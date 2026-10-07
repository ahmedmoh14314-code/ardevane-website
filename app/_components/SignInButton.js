import { signInAction } from "../_lib/actions";

function SignInButton({ next }) {
  return (
    <form action={signInAction}>
      <input type="hidden" name="next" value={next ?? ""} />

      <button className="btn-secondary w-full py-4 text-base">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt=""
          height="22"
          width="22"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
