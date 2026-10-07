import Link from "next/link";
import AuthCard, { Divider } from "../_components/AuthCard";
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
    <AuthCard
      eyebrow="Guest area"
      title="Welcome back"
      intro="Sign in to reserve a cabin and to see or change your stays."
    >
      {error && (
        <div className="mb-6">
          <FormError message={error} />
        </div>
      )}

      <SignInButton next={next} />

      <Divider />

      <EmailSignInForm next={next} />

      <p className="mt-6 text-sm text-ink-600">
        New to Ardevane?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600"
        >
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
