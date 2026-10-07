import { notFound } from "next/navigation";
import { asSentence, takenNights } from "./stay";
import { supabase } from "./supabase/public";
import { createClient } from "./supabase/server";

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

// The nights of a cabin that are taken from today on, as Dates. The
// database sends only date ranges, never who booked them.
export async function getBookedDatesByCabinId(cabinId) {
  const { data, error } = await supabase.rpc("get_booked_dates", {
    p_cabin_id: cabinId,
  });

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return takenNights(data);
}

// The database's price for a stay, or its reason for refusing it. Anyone may
// ask, signed in or not.
export async function quoteBooking({ cabinId, from, to, guests }) {
  const { data, error } = await supabase.rpc("quote_booking", {
    p_cabin_id: cabinId,
    p_start_date: from,
    p_end_date: to,
    p_num_guests: guests,
  });

  // 22023 = a rule the stay breaks; the message says which
  if (error)
    return {
      error:
        error.code === "22023"
          ? asSentence(error.message)
          : "This stay could not be priced. Please try again.",
    };

  return { quote: data[0] };
}

export async function getBookings(guestId) {
  const { data, error } = await createClient()
    .from("bookings")
    .select(
      "id, reference, created_at, startDate, endDate, numNights, numGuests, totalPrice, status, cancelledAt, cabinId, cabins(name, image)"
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
  const { data, error } = await createClient()
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
