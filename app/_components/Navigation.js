"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRightIcon,
  Bars3BottomRightIcon,
  UserCircleIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { isActiveLink, links } from "../_lib/navigation";

function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Wide screens: the links in the middle, account and booking right */}
      <ul className="hidden items-center gap-9 lg:flex">
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

      <div className="hidden items-center gap-8 lg:flex">
        <Link
          href="/account"
          className="flex items-center gap-2 font-display text-[1.02rem] text-ink-700 hover:text-forest-900"
        >
          <UserIcon className="h-5 w-5" />
          Account
        </Link>
        <Link href="/cabins" className="btn-forest py-2.5">
          Explore cabins
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* Phones: the account and a menu button */}
      <div className="flex items-center gap-3 lg:hidden">
        <Link
          href="/account"
          aria-label="Account"
          className="p-1.5 text-forest-900"
        >
          <UserCircleIcon className="h-7 w-7" />
        </Link>
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="p-1.5 text-forest-900"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3BottomRightIcon className="h-7 w-7" />
          )}
        </button>
      </div>

      {isOpen && (
        <ul className="absolute inset-x-0 top-full flex animate-fade flex-col border-b border-sand-200 bg-sand-50 px-5 py-3 shadow-soft lg:hidden">
          {links.map(({ name, href }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-display text-xl ${
                  isActiveLink(pathname, href)
                    ? "text-forest-900"
                    : "text-ink-600"
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
          <li className="py-3">
            <Link
              href="/cabins"
              onClick={() => setIsOpen(false)}
              className="btn-forest w-full"
            >
              Explore cabins
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}

export default Navigation;
