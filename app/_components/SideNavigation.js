"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  HomeIcon,
  HomeModernIcon,
  ReceiptPercentIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SignOutButton from "./SignOutButton";

const reservations = {
  name: "Reservations",
  href: "/account/reservations",
  icon: CalendarDaysIcon,
};
const profile = {
  name: "My account",
  href: "/account/profile",
  icon: UserIcon,
};

// While the guest is checked in, the overview becomes My Stay, with its
// charges one click away
const stayingLinks = [
  { name: "My stay", href: "/account", icon: HomeModernIcon },
  { name: "Stay charges", href: "/account#charges", icon: ReceiptPercentIcon },
  reservations,
  profile,
];
const links = [
  { name: "Overview", href: "/account", icon: HomeIcon },
  reservations,
  profile,
];

function SideNavigation({ isStaying = false }) {
  const pathname = usePathname();
  const navLinks = isStaying ? stayingLinks : links;

  // Editing a reservation still lights up "Reservations". A link to a part
  // of a page never lights up on its own.
  function isActive(href) {
    if (href.includes("#")) return false;
    return href === "/account" ? pathname === href : pathname.startsWith(href);
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
