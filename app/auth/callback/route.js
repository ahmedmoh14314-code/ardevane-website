import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase/server";
import { safeNextPath } from "@/app/_lib/users";

// Where Google, and the "confirm your email" link, send people back to.
// The one-time code becomes a session, the guest profile is made or linked,
// and the guest carries on where they were.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await supabase.rpc("ensure_guest_profile");

      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error(error);
  }

  // A link opened in another browser, an expired link, or a cancelled
  // Google sign in
  const signIn = new URL("/login", origin);
  signIn.searchParams.set("error", "link");
  signIn.searchParams.set("next", next);

  return NextResponse.redirect(signIn);
}
