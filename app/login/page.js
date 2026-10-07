import Image from "next/image";
import hero from "@/public/img/hero.jpg";
import SignInButton from "../_components/SignInButton";

export const metadata = {
  title: "Sign in",
};

// Where to go after signing in: ?next= from our own links, or ?callbackUrl=
// when middleware.js sent a signed-out guest here from a guest area page
function getNextPage({ next, callbackUrl }) {
  if (next) return next;

  try {
    const url = new URL(callbackUrl);
    return url.pathname + url.search;
  } catch {
    return "/account";
  }
}

export default function Page({ searchParams }) {
  return (
    <div className="relative isolate flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Image
        src={hero}
        alt=""
        fill
        placeholder="blur"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-brand-950/40" />

      <div className="w-full max-w-md animate-rise rounded-3xl bg-white/90 p-10 text-center shadow-lift backdrop-blur">
        <p className="eyebrow mb-3">Guest area</p>
        <h1 className="mb-3 font-display text-4xl text-brand-900">
          Welcome to Ardevane
        </h1>
        <p className="mb-8 text-ink-600">
          Sign in to reserve a cabin and to see or change your stays.
        </p>

        <SignInButton next={getNextPage(searchParams ?? {})} />

        <p className="mt-6 text-xs text-ink-500">
          We only use your name and email address, to keep your reservations
          together.
        </p>
      </div>
    </div>
  );
}
