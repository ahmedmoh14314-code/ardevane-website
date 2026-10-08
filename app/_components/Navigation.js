"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink, links } from "../_lib/navigation";

// The links across the top on wide screens. On phones the header carries
// only the name: the places of the site are in the bar at the bottom.
function Navigation() {
  const pathname = usePathname();

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
                    ? "text-forest-900 after:absolute after:inset-x-0 after:-bottom-[1.05rem] after:h-px after:bg-forest-900"
                    : "text-ink-600 hover:text-forest-900"
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
          className={`font-display text-[1.02rem] transition-colors hover:text-forest-900 ${
            isActiveLink(pathname, "/account")
              ? "text-forest-900"
              : "text-ink-600"
          }`}
        >
          Account
        </Link>
        <Link href="/cabins" className="btn-forest min-h-[2.75rem] px-5">
          Book a cabin
        </Link>
      </div>
    </>
  );
}

export default Navigation;
