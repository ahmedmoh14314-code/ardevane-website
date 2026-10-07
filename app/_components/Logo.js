import Image from "next/image";
import Link from "next/link";
import mark from "@/public/logo-mark.png";
import markLight from "@/public/logo-mark-light.png";

// light: for dark backgrounds such as the footer
function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src={light ? markLight : mark}
        alt=""
        height={40}
        priority
        className="h-10 w-auto"
      />

      <span className="leading-none">
        <span
          className={`block font-display text-2xl font-semibold tracking-wide ${
            light ? "text-white" : "text-brand-900"
          }`}
        >
          Ardevane
        </span>
        <span
          className={`mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.3em] ${
            light ? "text-gold-300" : "text-gold-600"
          }`}
        >
          Cabins &amp; lake
        </span>
      </span>
    </Link>
  );
}

export default Logo;
