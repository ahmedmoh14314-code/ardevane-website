import Link from "next/link";
import AuthPanel, { AuthHeading, OrDivider } from "../_components/AuthPanel";
import SignInButton from "../_components/SignInButton";
import SignUpForm from "../_components/SignUpForm";
import { safeNextPath } from "../_lib/users";

export const metadata = {
  title: "Create an account",
};

export default function Page({ searchParams }) {
  const next = safeNextPath(searchParams?.next);

  return (
    <AuthPanel>
      <AuthHeading
        title="Create account"
        intro="Join Ardevane and start your mountain journey."
      />

      <SignUpForm next={next} />

      <OrDivider />

      <SignInButton next={next} />

      <p className="mt-6 border-t border-sand-200 pt-5 text-center font-label text-[0.9rem] text-ink-600">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-semibold text-forest-900 underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthPanel>
  );
}
