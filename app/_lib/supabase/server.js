import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Acts as the person who is signed in, using the session in their cookies.
// The database's access rules decide what they can see and change.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't set cookies. That's fine: middleware.js
          // refreshes the session on every request.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
