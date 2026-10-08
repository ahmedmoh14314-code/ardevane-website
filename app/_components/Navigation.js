"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink, links } from "../_lib/navigation";

// The links across the top on wide screens. On phones the header carries
// only the name: the places of the site are in the bar at the bottom.
// light: over a photo, so the text is light and the button is outlined
function Navigation({ light = false }) {
  const pathname = usePathname();

  const quiet = light
    ? "text-sand-50/85 hover:text-white"
    : "text-ink-600 hover:text-forest-900";
  const strong = light ? "text-white" : "text-forest-900";
  const line = light ? "after:bg-white" : "after:bg-forest-900";

  return (
    <>
      <ul className="hidden items-center gap-9 md:flex">
        {links.map(({ name, href }) => {
          const active = isActiveLink(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`relative py-2 font-display text-[1.02rem] transition-colors ${
                  active
                    ? `${strong} after:absolute after:inset-x-0 after:-bottom-[1.05rem] after:h-px ${line}`
                    : quiet
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="hidden items-center gap-7 md:flex">
        <Link
          href="/account"
          className={`font-display text-[1.02rem] transition-colors ${
            isActiveLink(pathname, "/account") ? strong : quiet
          }`}
        >
          Account
        </Link>
        <Link
          href="/cabins"
          className={`min-h-[2.75rem] px-5 ${light ? "btn-outline-light" : "btn-forest"}`}
        >
          Book a cabin
        </Link>
      </div>
    </>
  );
}

export default Navigation;
