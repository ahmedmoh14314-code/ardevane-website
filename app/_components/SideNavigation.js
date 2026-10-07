"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  HomeIcon,
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
  { name: "Guest profile", href: "/account/profile", icon: UserIcon },
];

function SideNavigation() {
  const pathname = usePathname();

  // Editing a reservation still lights up "Reservations"
  function isActive(href) {
    return href === "/account"
      ? pathname === href
      : pathname.startsWith(href);
  }

  return (
    <nav className="md:sticky md:top-24 md:self-start">
      <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-cream-200 bg-white p-2 shadow-soft md:flex-col">
        {navLinks.map(({ name, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-xl border-l-4 px-4 py-3 font-medium transition-colors ${
                isActive(href)
                  ? "border-gold-600 bg-cream-100 text-brand-800"
                  : "border-transparent text-ink-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </Link>
          </li>
        ))}

        <li className="md:mt-4 md:border-t md:border-cream-100 md:pt-2">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
