import { notFound } from "next/navigation";
import { eachDayOfInterval, startOfToday } from "date-fns";
import { supabase } from "./supabase";

/////////////
// CABINS

// Only cabins the hotel has not archived are shown or bookable
export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

// The photos staff upload in the dashboard gallery, cover photo first
export async function getCabinImages(cabinId) {
  const { data, error } = await supabase
    .from("cabin_images")
    .select("id, url")
    .eq("cabinId", cabinId)
    .order("position");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

/////////////
// BOOKINGS

// Every day that is taken from today on. Only the dates leave the
// database, never who booked them.
export async function getBookedDatesByCabinId(cabinId) {
  const today = startOfToday().toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("startDate, endDate")
    .eq("cabinId", cabinId)
    .neq("status", "cancelled")
    .gte("endDate", today);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data
    .map((booking) =>
      eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      })
    )
    .flat();
}

// True when another stay in this cabin overlaps these dates. A guest may
// arrive on the day the last one leaves.
export async function isCabinTaken(cabinId, startDate, endDate) {
  const { count, error } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("cabinId", cabinId)
    .neq("status", "cancelled")
    .lt("startDate", endDate.toISOString())
    .gt("endDate", startDate.toISOString());

  if (error) {
    console.error(error);
    throw new Error("Availability could not be checked");
  }

  return count > 0;
}

export async function getBookings(guestId) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, extrasPrice, hasBreakfast, isPaid, status, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// A booking only comes back if it belongs to this guest
export async function getGuestBooking(id, guestId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(name, image, maxCapacity, regularPrice, discount)")
    .eq("id", id)
    .eq("guestId", guestId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

/////////////
// GUESTS

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

/////////////
// SETTINGS AND COUNTRIES

// The rules staff set on the dashboard's Settings page
export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    // restcountries.com v2 was shut down, so the same data comes from the
    // world-countries package, shaped like the old { name, flag } response
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/world-countries@5/countries.json"
    );
    const data = await res.json();

    const countries = data
      .map((country) => ({
        name: country.name.common,
        flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}
