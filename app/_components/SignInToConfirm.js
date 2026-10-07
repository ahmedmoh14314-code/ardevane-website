import Link from "next/link";
import { Divider } from "./AuthCard";
import SignInButton from "./SignInButton";
import EmailSignInForm from "./EmailSignInForm";

// Shown instead of the confirm button to a visitor who isn't signed in.
// Every way in comes back to this same review page, with the stay intact.
function SignInToConfirm({ next }) {
  return (
    <div>
      <h2 className="mb-2 font-display text-2xl text-brand-900">
        Sign in to confirm
      </h2>
      <p className="mb-6 text-sm text-ink-600">
        Your cabin, dates and guests are kept. You&apos;ll come straight back
        here to confirm.
      </p>

      <SignInButton next={next} />

      <Divider />

      <EmailSignInForm next={next} />

      <p className="mt-6 text-center text-sm text-ink-600">
        New to Ardevane?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default SignInToConfirm;
