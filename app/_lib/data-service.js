import { cache } from "react";
import { notFound } from "next/navigation";
import { asSentence, takenNights, toISODate } from "./stay";
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

// A guest's bookings, each with its folio (what the stay costs and what
// has been paid, worked out by the database). cache() makes it one request
// per page, however many components ask.
export const getBookings = cache(async function (guestId) {
  const supabase = createClient();

  const { data: bookings, error } = await supabase
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

  if (!bookings.length) return [];

  // The guest can read the folios of their own bookings, and only those
  const { data: folios, error: folioError } = await supabase
    .from("booking_folios")
    .select("bookingId, accommodation, extras, total, paid, remaining")
    .in(
      "bookingId",
      bookings.map((booking) => booking.id)
    );

  if (folioError) {
    console.error(folioError);
    throw new Error("Bookings could not get loaded");
  }

  return bookings.map((booking) => ({
    ...booking,
    folio: folios.find((folio) => folio.bookingId === booking.id) ?? null,
  }));
});

// What was added to a stay, for the guest to read. Charges and payments are
// written only by the front desk.
export async function getStayCharges(bookingId) {
  const { data, error } = await createClient()
    .from("charges")
    .select("id, created_at, description, amount")
    .eq("bookingId", bookingId)
    .order("created_at");

  if (error) {
    console.error(error);
    throw new Error("Stay charges could not be loaded");
  }

  return data;
}

// What the guest asked for during a stay, newest first, with the dishes of
// a breakfast order. Guests only ever see their own.
export async function getStayRequests(bookingId) {
  const { data, error } = await createClient()
    .from("requests")
    .select(
      "id, created_at, type, status, title, note, priority, requestedFor, request_items(name, quantity, unitPrice)"
    )
    .eq("bookingId", bookingId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Requests could not be loaded");
  }

  return data;
}

// The breakfast menu, for signed-in guests
export async function getMenu() {
  const { data, error } = await createClient()
    .from("services")
    .select("id, name, price")
    .eq("category", "menu")
    .eq("isActive", true)
    .order("price", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("The menu could not be loaded");
  }

  return data;
}

// "Today" where the cabins are, so Day 2 of 5 is right wherever the
// server runs
export async function getPropertyToday() {
  const { data, error } = await supabase.rpc("property_today");

  if (error) {
    console.error(error);
    return toISODate(new Date());
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
