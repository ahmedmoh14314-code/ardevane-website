import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="flex w-full items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 font-display text-[1.02rem] text-ink-500 transition-colors hover:bg-[#f8e2da] hover:text-[#9b3b23]">
        <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
