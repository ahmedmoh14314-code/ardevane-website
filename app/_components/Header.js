"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Navigation from "./Navigation";
import MobileTabBar from "./MobileTabBar";

// On the home page the header lies over the hero photo, clear, with light
// text, and turns solid once the page is scrolled. Everywhere else it is
// the solid bar that stays at the top.
function Header() {
  const pathname = usePathname();
  const overPhoto = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overPhoto) return;

    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, [overPhoto]);

  const light = overPhoto && !scrolled;

  return (
    <>
      <header
        className={`inset-x-0 top-0 z-30 border-b transition-colors duration-300 ${
          overPhoto ? "fixed" : "sticky"
        } ${
          light
            ? "border-transparent bg-transparent"
            : "border-sand-200 bg-sand-50/95 backdrop-blur"
        }`}
      >
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-[4.5rem]">
          <Logo light={light} />
          <Navigation light={light} />
        </nav>
      </header>

      <MobileTabBar />
    </>
  );
}

export default Header;
