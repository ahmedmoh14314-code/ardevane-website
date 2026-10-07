import Link from "next/link";
import AuthCard, { Divider } from "../_components/AuthCard";
import SignInButton from "../_components/SignInButton";
import SignUpForm from "../_components/SignUpForm";
import { safeNextPath } from "../_lib/users";

export const metadata = {
  title: "Create an account",
};

export default function Page({ searchParams }) {
  const next = safeNextPath(searchParams?.next);

  return (
    <AuthCard
      eyebrow="Guest area"
      title="Create your account"
      intro="One account for your reservations and your stays with us."
    >
      <SignInButton next={next} />

      <Divider />

      <SignUpForm next={next} />

      <p className="mt-6 text-sm text-ink-600">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
