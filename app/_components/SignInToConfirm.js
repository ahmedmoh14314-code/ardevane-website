import Link from "next/link";
import { OrDivider } from "./AuthPanel";
import SignInButton from "./SignInButton";
import EmailSignInForm from "./EmailSignInForm";

// Shown instead of the confirm button to a visitor who isn't signed in.
// Every way in comes back to this same review page, with the stay intact.
// The same form, in the same order, as the sign in page.
function SignInToConfirm({ next }) {
  return (
    <div>
      <h2 className="font-display text-[1.7rem] leading-tight text-forest-950">
        Sign in to confirm
      </h2>
      <p className="mb-6 mt-1.5 font-label text-[0.92rem] leading-relaxed text-ink-600">
        Your cabin, dates and guests are kept. You&apos;ll come straight back
        here to confirm.
      </p>

      <EmailSignInForm next={next} />

      <OrDivider />

      <SignInButton next={next} />

      <p className="mt-6 border-t border-sand-200 pt-5 text-center font-label text-[0.9rem] text-ink-600">
        New to Ardevane?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="font-semibold text-forest-900 underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default SignInToConfirm;
