"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

const pages = [
  { name: "Overview", href: "/account" },
  { name: "Reservations", href: "/account/reservations" },
  { name: "Profile", href: "/account/profile" },
];

// Editing a reservation still lights up "Reservations"
function isActive(pathname, href) {
  if (href === "/account") return pathname === href;
  return pathname.startsWith(href);
}

// The account's three pages. On phones: a row of tabs under the heading,
// with nothing else in the way. On wide screens: a list down the side,
// with sign out at its foot.
function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:sticky md:top-24 md:flex md:min-h-[calc(100vh-9rem)] md:flex-col">
      <h2 className="font-display text-[2.2rem] leading-none text-forest-950 md:text-[1.7rem]">
        My account
      </h2>

      <ul className="-mx-4 mt-5 flex border-b border-sand-200 px-4 sm:-mx-8 sm:px-8 md:mx-0 md:mt-6 md:flex-col md:border-0 md:px-0">
        {pages.map(({ name, href }) => {
          const active = isActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`-mb-px block border-b-2 px-1 pb-3 font-display text-[1.05rem] transition-colors md:border-b-0 md:border-l-2 md:px-4 md:py-2.5 ${
                  active
                    ? "border-bark-500 text-forest-950 md:border-forest-900 md:bg-sand-200/70"
                    : "border-transparent text-ink-600 hover:text-forest-900 md:hover:bg-sand-100"
                } mr-7 md:mr-0`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto hidden md:block">
        <SignOutButton />
      </div>
    </nav>
  );
}

export default SideNavigation;
