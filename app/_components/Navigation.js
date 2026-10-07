"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import GuestAvatar from "./GuestAvatar";

const links = [
  { name: "Cabins", href: "/cabins" },
  { name: "About", href: "/about" },
];

function Navigation({ user }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const linkClass = (href) =>
    `rounded-lg px-3 py-2 font-medium transition-colors ${
      isActive(href)
        ? "text-brand-700"
        : "text-ink-600 hover:bg-brand-50 hover:text-brand-700"
    }`;

  const guestArea = user ? (
    <Link
      href="/account"
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 rounded-full border border-cream-200 bg-white py-1 pl-1 pr-4 font-medium text-ink-700 shadow-sm transition-colors hover:border-brand-200 hover:text-brand-700"
    >
      <GuestAvatar user={user} />
      <span>Guest area</span>
    </Link>
  ) : (
    <Link
      href="/account"
      onClick={() => setIsOpen(false)}
      className="btn-primary py-2"
    >
      Guest area
    </Link>
  );

  return (
    <nav>
      {/* Wide screens: everything in one row */}
      <ul className="hidden items-center gap-2 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          </li>
        ))}

        <li className="ml-4">{guestArea}</li>
      </ul>

      {/* Phones: a menu button that opens a panel under the header */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-lg p-2 text-ink-700 hover:bg-brand-50 md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute inset-x-0 top-full flex animate-fade flex-col gap-1 border-b border-cream-200 bg-cream-50 px-4 py-4 shadow-soft md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block ${linkClass(link.href)}`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          <li className="mt-2">{guestArea}</li>
        </ul>
      )}
    </nav>
  );
}

export default Navigation;
