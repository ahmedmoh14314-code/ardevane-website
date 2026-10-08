"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink } from "../_lib/navigation";

const tabs = [
  { name: "Home", href: "/" },
  { name: "Cabins", href: "/cabins" },
  { name: "My Stay", href: "/my-stay" },
  { name: "Account", href: "/account" },
];

// On phones the four places of the site sit at the bottom, under the
// thumb: just their names, the one you are on underlined
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
        {tabs.map(({ name, href }) => {
          const active = href === activeHref;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-[3.4rem] items-center justify-center font-display text-[1.02rem] ${
                  active ? "text-forest-950" : "text-ink-600"
                }`}
              >
                <span
                  className={`border-b-2 pb-0.5 ${
                    active ? "border-bark-500" : "border-transparent"
                  }`}
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
