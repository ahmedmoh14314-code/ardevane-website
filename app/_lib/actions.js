"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";
import { asSentence, reviewPath } from "./stay";
import { safeNextPath } from "./users";

// The database explains a booking it refuses in plain words (code 22023,
// or P0002 for "not found"). Anything else gets a general message.
function bookingError(error, fallback) {
  console.error(error);

  return ["22023", "P0002"].includes(error.code)
    ? asSentence(error.message)
    : fallback;
}

// The guest who sent a form. A guest who saw the page signed in can still
// arrive here with a session that expired a moment ago, so it is refreshed
// once before they are treated as signed out (and sent to sign in again).
async function signedInUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) return user;

  const { data, error: refreshError } = await supabase.auth.refreshSession();
  if (!data?.user)
    console.warn(
      "Booking sent without a session:",
      error?.message,
      refreshError?.message
    );

  return data?.user ?? null;
}

function readObservations(formData) {
  return String(formData.get("observations") ?? "")
    .trim()
    .slice(0, 1000);
}

// The address of this site, for links that come back to it
function getOrigin() {
  const requestHeaders = headers();

  return (
    requestHeaders.get("origin") ??
    `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${requestHeaders.get("host")}`
  );
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
          ? asSentence(error.message)
          : "Your profile could not be saved.",
    };

  revalidatePath("/account/profile");

  return { success: "Your profile is saved." };
}

/////////////
// BOOKINGS

// Confirm the stay on the review page. The form only says which cabin, which
// days and how many guests; create_booking checks every rule again and works
// out the price itself, as the signed-in guest.
export async function createBooking(formData) {
  const stay = {
    cabinId: Number(formData.get("cabinId")),
    from: String(formData.get("from") ?? ""),
    to: String(formData.get("to") ?? ""),
    guests: Number(formData.get("guests")),
  };

  const supabase = createClient();
  const user = await signedInUser(supabase);

  // Signed out in the meantime: sign in, then come back to this same review
  if (!user) redirect(`/login?next=${encodeURIComponent(reviewPath(stay))}`);

  const { data, error } = await supabase.rpc("create_booking", {
    p_cabin_id: stay.cabinId,
    p_start_date: stay.from,
    p_end_date: stay.to,
    p_num_guests: stay.guests,
    p_observations: readObservations(formData),
  });

  if (error)
    return {
      error: bookingError(
        error,
        "Your reservation could not be saved. Please try again."
      ),
    };

  revalidatePath(`/cabins/${stay.cabinId}`);
  revalidatePath("/account/reservations");

  redirect(`/cabins/thankyou?ref=${data.reference}`);
}

// A guest changes the number of guests or the notes, until the day before
// arrival. update_booking checks the reservation is theirs.
export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  const { error } = await createClient().rpc("update_booking", {
    p_booking_id: bookingId,
    p_num_guests: Number(formData.get("numGuests")),
    p_observations: readObservations(formData),
  });

  if (error)
    return { error: bookingError(error, "Your changes could not be saved.") };

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

// Cancelling keeps the reservation, marked cancelled, and frees the nights
export async function cancelBooking(bookingId) {
  const { data, error } = await createClient().rpc("cancel_booking", {
    p_booking_id: bookingId,
  });

  if (error)
    throw new Error(
      bookingError(error, "Your reservation could not be cancelled.")
    );

  revalidatePath("/account/reservations");
  revalidatePath(`/cabins/${data.cabinId}`);
}

/////////////
// STAY REQUESTS

// A checked-in guest asks for something. The database finds their stay,
// checks it is checked in, and prices any breakfast itself.
export async function createStayRequest({
  type,
  title,
  note,
  priority,
  requestedFor,
  requestedDate,
  items,
}) {
  const { error } = await createClient().rpc("create_stay_request", {
    p_type: type,
    p_title: title ?? null,
    p_note: note ?? null,
    p_priority: priority ?? "normal",
    p_requested_for: requestedFor || null,
    p_items: items ?? null,
    p_requested_date: requestedDate || null,
  });

  if (error)
    return {
      error:
        error.code === "22023"
          ? asSentence(error.message)
          : "That didn't go through. Please try again.",
    };

  revalidatePath("/account");
  return { ok: true };
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
  // The form asks for a first and a last name; older forms sent one field
  const fullName = (
    formData.get("fullName") ??
    `${formData.get("firstName") ?? ""} ${formData.get("lastName") ?? ""}`
  )
    .toString()
    .trim()
    .replace(/\s+/g, " ");
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

    // Without its own email service, Supabase only sends confirmation
    // emails to the project's team, so other addresses are refused
    if (error.code === "email_address_not_authorized")
      return {
        error:
          "We can't send a confirmation email to this address yet. Please continue with Google for now.",
      };

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

// Signs out of this website only. supabase-js signs out every session of
// the account by default, which would also end the same person's session
// in Ardevane Operations.
export async function signOutAction() {
  await createClient().auth.signOut({ scope: "local" });

  redirect("/");
}
