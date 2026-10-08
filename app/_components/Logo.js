import Image from "next/image";
import Link from "next/link";
import mark from "@/public/logo-mark.png";
import markLight from "@/public/logo-mark-light.png";

// Two mountain ridges drawn with a single line, for small decorative uses
export function MountainMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 48 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 24 L15 6 L22 15 L29 8 L46 24" />
      <path d="M9 24 L17 13" />
      <path d="M13 9.5 L15 6 L18 10" />
      <path d="M26 24 L33 15" />
    </svg>
  );
}

// The Ardevane logo, the same artwork as Ardevane Operations: the cabin
// among the pines and peaks, with the name spaced out beside it.
// light: for dark backgrounds such as the footer
function Logo({ light = false }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 sm:gap-3 ${light ? "text-sand-50" : "text-forest-900"}`}
    >
      <Image
        src={light ? markLight : mark}
        alt=""
        priority
        className="h-7 w-auto sm:h-9"
      />
      <span className="font-display text-[1.15rem] uppercase leading-none tracking-[0.14em] sm:text-[1.45rem] sm:tracking-[0.2em]">
        Ardevane
      </span>
    </Link>
  );
}

// The full logo, stacked, as in Operations: the artwork, the name, and a
// fine gold line under it
export function LogoStacked() {
  return (
    <Link href="/" className="flex flex-col items-center text-forest-900">
      <Image src={mark} alt="" priority className="h-20 w-auto" />
      <span className="mt-1 font-display text-[2.1rem] uppercase leading-none tracking-[0.06em]">
        Ardevane
      </span>
      <span className="mt-2 font-label text-[0.68rem] font-medium uppercase tracking-[0.45em] text-bark-500">
        Mountain cabins
      </span>
      <span className="mt-2 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-px w-6 bg-bark-500/70" />
        <span className="h-0.5 w-10 bg-bark-500" />
        <span className="h-px w-6 bg-bark-500/70" />
      </span>
    </Link>
  );
}

export default Logo;
