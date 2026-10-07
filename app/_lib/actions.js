"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endOfDay, isPast, startOfToday, subDays } from "date-fns";

import { getGuest } from "./auth";
import { createClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";
import { safeNextPath } from "./users";
import {
  getCabin,
  getGuestBooking,
  getSettings,
  isCabinTaken,
} from "./data-service";
import { getBookingPrice } from "./pricing";

const DAY_MS = 24 * 60 * 60 * 1000;

// Every booking action starts here: no signed-in guest, no access. The guest
// comes from the session cookie, never from anything the browser sends.
async function getGuestId() {
  const guest = await getGuest();
  if (!guest) throw new Error("You need to be signed in");

  return guest.id;
}

// The address of this site, for links that come back to it
function getOrigin() {
  const requestHeaders = headers();

  return (
    requestHeaders.get("origin") ??
    `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${requestHeaders.get("host")}`
  );
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

// Guests can't write to the guests table. update_guest_profile() changes only
// their own row, and checks every value on the way in.
export async function updateGuest(formData) {
  const nationalID = String(formData.get("nationalID") ?? "").trim();
  const [nationality, countryFlag] = String(
    formData.get("nationality") ?? ""
  ).split("%");

  const { error } = await createClient().rpc("update_guest_profile", {
    p_nationality: nationality,
    p_country_flag: countryFlag ?? null,
    p_national_id: nationalID,
  });

  // 22023 = a value the database refused; its message says which one
  if (error)
    return {
      error:
        error.code === "22023"
          ? `${error.message}.`
          : "Your profile could not be saved.",
    };

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

  const { data, error } = await supabaseAdmin
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

  const { error } = await supabaseAdmin
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

  const { error } = await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("guestId", guestId);

  if (error) throw new Error("Booking could not be cancelled");

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${booking.cabinId}`);
}

/////////////
// SIGN IN, SIGN UP AND OUT

// Google signs the guest in and sends them to /auth/callback, which brings
// them back to the page they were on
export async function signInWithGoogle(formData) {
  const next = safeNextPath(formData.get("next"));

  const { data, error } = await createClient().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    console.error(error);
    redirect(`/login?error=google&next=${encodeURIComponent(next)}`);
  }

  redirect(data.url);
}

export async function signInWithEmail(formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password)
    return { error: "Please enter your email and password." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error)
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Please confirm your email address first. The link is in your inbox."
          : "Email or password is incorrect.",
    };

  const { error: profileError } = await supabase.rpc("ensure_guest_profile");

  if (profileError)
    return { error: "Your guest profile could not be opened. Please try again." };

  redirect(next);
}

export async function signUpWithEmail(formData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (fullName.length < 2) return { error: "Please enter your name." };

  if (!/\S+@\S+\.\S+/.test(email))
    return { error: "Please enter a valid email address." };

  if (password.length < 8)
    return { error: "Your password needs at least 8 characters." };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    console.error(error);

    return {
      error:
        error.status === 429
          ? "Too many attempts. Please wait a minute and try again."
          : error.code === "weak_password"
            ? error.message
            : "Your account could not be created. Please try again.",
    };
  }

  // Supabase asks new accounts to confirm their email first, so there is no
  // session yet. (It says the same for an address that is already
  // registered, without revealing which.)
  if (!data.session)
    return {
      success: `Check your inbox: we've sent a link to ${email}. Open it to confirm your address and you're in.`,
    };

  await supabase.rpc("ensure_guest_profile");

  redirect(next);
}

export async function signOutAction() {
  await createClient().auth.signOut();

  redirect("/");
}
