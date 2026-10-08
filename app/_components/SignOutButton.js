import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="block w-full rounded-[3px] px-4 py-3 text-left font-display text-[1.02rem] text-ink-500 transition-colors hover:bg-[#f8e2da] hover:text-[#9b3b23]">
        Sign out
      </button>
    </form>
  );
}

export default SignOutButton;
