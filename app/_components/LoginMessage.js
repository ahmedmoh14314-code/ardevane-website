import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/24/outline";

// next: the page to come back to after signing in
function LoginMessage({ next }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white px-8 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <LockClosedIcon className="h-6 w-6" />
      </span>

      <h3 className="font-display text-2xl text-brand-900">
        Sign in to reserve
      </h3>
      <p className="max-w-xs text-ink-600">
        One click with Google. You come straight back here, with your dates still picked.
      </p>

      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="btn-primary mt-2"
      >
        Sign in with Google
      </Link>
    </div>
  );
}

export default LoginMessage;
