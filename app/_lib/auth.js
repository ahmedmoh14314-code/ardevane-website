import "server-only";
import { cache } from "react";
import { createClient } from "./supabase/server";
import { toGuestUser } from "./users";

// Who is signed in, or null. cache() makes it one check per request, however
// many components ask.
export const getUser = cache(async function () {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? toGuestUser(user) : null;
});

// The guest row that belongs to the signed-in account. The database creates
// it on the first visit, or links the guest the hotel already knew by email.
export const getGuest = cache(async function () {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("ensure_guest_profile");

  if (error) {
    console.error(error);
    return null;
  }

  return data;
});
