import { signInWithGoogle } from "../_lib/actions";

function SignInButton({ next }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next ?? ""} />

      <button className="btn-secondary w-full py-3.5 text-base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt=""
          height="20"
          width="20"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
