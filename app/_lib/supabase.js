import "server-only";
import { createClient } from "@supabase/supabase-js";

// The database is locked to hotel staff, so the website talks to it only
// from the server, with the secret key. "server-only" makes the build fail
// if this file is ever imported into a component that runs in the browser.
// Every guest check (is this your booking?) is done in actions.js.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);
