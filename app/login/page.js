import Link from "next/link";
import AuthPanel, { AuthHeading, OrDivider } from "../_components/AuthPanel";
import SignInButton from "../_components/SignInButton";
import EmailSignInForm from "../_components/EmailSignInForm";
import FormError from "../_components/FormError";
import { safeNextPath } from "../_lib/users";

export const metadata = {
  title: "Sign in",
};

const errors = {
  link: "That link didn't work here. It may have expired or been opened in another browser. Please sign in.",
  google:
    "Google sign in isn't available right now. Please try again, or use your email.",
};

export default function Page({ searchParams }) {
  const next = safeNextPath(searchParams?.next);
  const error = errors[searchParams?.error];

  return (
    <AuthPanel>
      <AuthHeading
        title="Welcome back"
        intro="Sign in to manage your reservations, view upcoming stays, and explore our mountain cabins."
      />

      {error && (
        <div className="mb-5">
          <FormError message={error} />
        </div>
      )}

      <EmailSignInForm next={next} />

      <OrDivider />

      <SignInButton next={next} />

      <p className="mt-6 border-t border-sand-200 pt-5 text-center font-label text-[0.9rem] text-ink-600">
        Don&apos;t have an account yet?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold text-forest-900 underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AuthPanel>
  );
}
