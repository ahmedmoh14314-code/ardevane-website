"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endOfDay, isPast, startOfToday, subDays } from "date-fns";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import {
  getCabin,
  getGuestBooking,
  getSettings,
  isCabinTaken,
} from "./data-service";
import { getBookingPrice } from "./pricing";

const DAY_MS = 24 * 60 * 60 * 1000;

// Every action starts here: no signed-in guest, no access
async function getGuestId() {
  const session = await auth();
  if (!session?.user?.guestId) throw new Error("You must be logged in");

  return session.user.guestId;
}

// Changes are open until the arrival day is over, or until the guest is checked in
function canStillChange(booking) {
  return (
    booking.status === "unconfirmed" &&
    !isPast(endOfDay(new Date(booking.startDate)))
  );
}

function readObservations(formData) {
  return String(formData.get("observations") ?? "")
    .trim()
    .slice(0, 1000);
}

/////////////
// PROFILE

export async function updateGuest(formData) {
  const guestId = await getGuestId();

  const nationalID = String(formData.get("nationalID") ?? "").trim();
  const [nationality, countryFlag] = String(
    formData.get("nationality") ?? ""
  ).split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    return { error: "National ID must be 6 to 12 letters or numbers." };

  // The flag must come from our own country list, not any address at all
  if (!nationality || !countryFlag?.startsWith("https://flagcdn.com/"))
    return { error: "Please choose your country from the list." };

  const { error } = await supabase
    .from("guests")
    .update({ nationality, countryFlag, nationalID })
    .eq("id", guestId);

  if (error) return { error: "Your profile could not be saved." };

  revalidatePath("/account/profile");

  return { success: "Your profile is saved." };
}

/////////////
// BOOKINGS

// The browser only sends which cabin and which dates. Nights, prices and
// every rule are worked out again here, from the database, so nobody can
// book at their own price or squeeze into dates that are already taken.
export async function createBooking(bookingData, formData) {
  const guestId = await getGuestId();

  const cabin = await getCabin(bookingData.cabinId);
  const settings = await getSettings();

  const startDate = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);
  const numNights = Math.round((endDate - startDate) / DAY_MS);

  const numGuests = Number(formData.get("numGuests"));
  const hasBreakfast = formData.get("hasBreakfast") === "on";
  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);

  // A day of leeway, because the server and the guest may be in different time zones
  if (isNaN(numNights) || startDate < subDays(startOfToday(), 1))
    return { error: "Please choose dates from today on." };

  if (numNights < settings.minBookingLength)
    return {
      error: `Stays are at least ${settings.minBookingLength} nights.`,
    };

  if (numNights > settings.maxBookingLength)
    return {
      error: `Stays are at most ${settings.maxBookingLength} nights.`,
    };

  if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > maxGuests)
    return { error: `This cabin sleeps up to ${maxGuests} guests.` };

  if (await isCabinTaken(cabin.id, startDate, endDate))
    return {
      error: "Someone has just booked some of these nights. Please pick others.",
    };

  const prices = getBookingPrice({
    cabin,
    numNights,
    numGuests,
    hasBreakfast,
    breakfastPrice: settings.breakfastPrice,
  });

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        cabinId: cabin.id,
        guestId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numNights,
        numGuests,
        hasBreakfast,
        ...prices,
        observations: readObservations(formData),
        isPaid: false,
        status: "unconfirmed",
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error(error);
    return { error: "Your booking could not be saved. Please try again." };
  }

  revalidatePath(`/cabins/${cabin.id}`);
  revalidatePath("/account/reservations");

  redirect(`/cabins/thankyou?booking=${data.id}`);
}

// Guests can change a stay only until the hotel checks them in
export async function updateBooking(formData) {
  const guestId = await getGuestId();
  const bookingId = Number(formData.get("bookingId"));

  const booking = await getGuestBooking(bookingId, guestId);

  if (!booking) throw new Error("You are not allowed to update this booking");

  if (!canStillChange(booking))
    return { error: "This stay has started, so it can no longer be changed." };

  const settings = await getSettings();
  const numGuests = Number(formData.get("numGuests"));
  const hasBreakfast = formData.get("hasBreakfast") === "on";
  const maxGuests = Math.min(
    booking.cabins.maxCapacity,
    settings.maxGuestsPerBooking
  );

  if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > maxGuests)
    return { error: `This cabin sleeps up to ${maxGuests} guests.` };

  // More guests or breakfast changes the price, so it is worked out again
  const prices = getBookingPrice({
    cabin: booking.cabins,
    numNights: booking.numNights,
    numGuests,
    hasBreakfast,
    breakfastPrice: settings.breakfastPrice,
  });

  const { error } = await supabase
    .from("bookings")
    .update({
      numGuests,
      hasBreakfast,
      ...prices,
      observations: readObservations(formData),
    })
    .eq("id", bookingId)
    .eq("guestId", guestId);

  if (error) return { error: "Your changes could not be saved." };

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function deleteBooking(bookingId) {
  const guestId = await getGuestId();

  const booking = await getGuestBooking(bookingId, guestId);

  if (!booking) throw new Error("You are not allowed to cancel this booking");

  if (!canStillChange(booking))
    throw new Error("This stay has started, so it can no longer be cancelled");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", guestId);

  if (error) throw new Error("Booking could not be cancelled");

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${booking.cabinId}`);
}

/////////////
// SIGN IN AND OUT

export async function signInAction(formData) {
  const next = String(formData.get("next") ?? "");

  // Only our own pages, so the link can't send guests to another site
  const isOwnPage = next.startsWith("/") && !next.startsWith("//");

  await signIn("google", { redirectTo: isOwnPage ? next : "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
