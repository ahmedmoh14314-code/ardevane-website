import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Runs before every page. It keeps the Supabase session cookie fresh, and
// sends anyone who isn't signed in from the guest area to the sign-in page.
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/login";
    signIn.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;

    return NextResponse.redirect(signIn);
  }

  return response;
}

// Every page, but not images or Next's own files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|img/|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)",
  ],
};
