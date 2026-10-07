import { createClient } from "@supabase/supabase-js";

// For what anyone may read: open cabins, their photos and the house rules.
// It carries no session, so it also works while pages are built ahead of
// time. What a visitor can see is decided by the database's access rules.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
