import { signInWithGoogle } from "../_lib/actions";

function SignInButton({ next }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next ?? ""} />

      <button className="flex w-full items-center justify-center gap-3 rounded-[3px] border border-ink-400/60 bg-white py-3 font-label text-[0.95rem] font-medium text-ink-800 transition-colors hover:border-forest-900">
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
