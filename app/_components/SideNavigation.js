"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "./SignOutButton";

const navLinks = [
  { name: "Overview", href: "/account", icon: HomeIcon },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: CalendarDaysIcon,
  },
  { name: "My Stay", href: "/my-stay", icon: HomeModernIcon },
  { name: "Profile", href: "/account/profile", icon: UserIcon },
];

// The account's own menu: a list beside the page on wide screens, rows with
// a chevron on phones. Sign out is at the bottom, always.
function SideNavigation() {
  const pathname = usePathname();

  // Editing a reservation still lights up "Reservations"
  function isActive(href) {
    if (href === "/account") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex flex-col gap-6 md:sticky md:top-24 md:min-h-[calc(100vh-9rem)] md:self-start">
      <div>
        <h2 className="mb-4 font-display text-[1.9rem] text-forest-950 md:text-[1.7rem]">
          My Account
        </h2>

        <ul className="divide-y divide-sand-200 overflow-hidden rounded-md border border-sand-200 bg-sand-50 md:divide-y-0 md:rounded-none md:border-0 md:bg-transparent">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const active = isActive(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3.5 border-l-2 px-4 py-3.5 font-display text-[1.05rem] transition-colors md:rounded-r-md md:py-3 ${
                    active
                      ? "border-forest-900 bg-sand-200/70 text-forest-950"
                      : "border-transparent text-ink-600 hover:bg-sand-100 hover:text-forest-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{name}</span>
                  <ChevronRightIcon className="h-4 w-4 text-ink-400 md:hidden" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto">
        <SignOutButton />
      </div>
    </nav>
  );
}

export default SideNavigation;
