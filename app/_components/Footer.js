import Link from "next/link";
import { links } from "../_lib/navigation";

function Footer() {
  return (
    <footer className="bg-forest-950 text-sand-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-7 gap-y-3 font-display text-[1rem]">
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

        <p className="font-display text-[1rem] text-sand-200/80">
          Ardevane
          <span className="mx-2.5 text-sand-200/40">·</span>
          Mountain cabins by the lake
        </p>
      </div>
    </footer>
  );
}

export default Footer;
