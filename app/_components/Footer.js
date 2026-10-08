import Link from "next/link";
import { links } from "../_lib/navigation";

function PineTrees() {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      className="h-8 w-auto"
      aria-hidden="true"
    >
      <path d="M12 30V24M12 4l-7 10h4l-5 7h6M12 4l7 10h-4l5 7h-6" />
      <path d="M26 30V22M26 1l-8 12h5l-6 8h18l-6-8h5z" />
      <path d="M38 30V25M38 9l-5 8h3l-4 6h12l-4-6h3z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="bg-forest-950 text-sand-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-display text-[0.98rem]">
            {[...links, { name: "Account", href: "/account" }].map(
              ({ name, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-sand-200/90">
            <PineTrees />
            <p className="kicker leading-relaxed text-sand-200/80">
              A kinder place
              <br />
              further up
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
