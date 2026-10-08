"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { isActiveLink } from "../_lib/navigation";

const tabs = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Cabins", href: "/cabins", icon: HomeModernIcon },
  { name: "My Stay", href: "/my-stay", icon: CalendarDaysIcon },
  { name: "Account", href: "/account", icon: UserIcon },
];

// On phones the main places sit at the bottom, under the thumb
function MobileTabBar() {
  const pathname = usePathname();

  // The account pages light up "Account", except My Stay itself
  const activeHref = tabs
    .map((tab) => tab.href)
    .filter((href) => isActiveLink(pathname, href))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-sand-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {tabs.map(({ name, href, icon: Icon }) => {
          const active = href === activeHref;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 pb-2 pt-2.5 font-display text-[0.8rem] ${
                  active ? "text-bark-600" : "text-ink-600"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span
                  className={
                    active ? "border-b border-bark-600 pb-0.5" : "pb-0.5"
                  }
                >
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileTabBar;
