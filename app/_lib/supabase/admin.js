import "server-only";
import { createClient } from "@supabase/supabase-js";

// TEMPORARY, until bookings move into database functions in the next phase.
// Guests have no right to write bookings themselves, so for now the server
// does it with the secret key, after checking who is signed in. It is also
// used to read which nights are taken (dates only, never who booked them).
// The secret key never leaves the server.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
