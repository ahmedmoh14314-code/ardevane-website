import Logo from "@/app/_components/Logo";
import Navigation from "@/app/_components/Navigation";
import MobileTabBar from "@/app/_components/MobileTabBar";

function Header() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/95 backdrop-blur">
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-[4.5rem]">
          <Logo />
          <Navigation />
        </nav>
      </header>

      <MobileTabBar />
    </>
  );
}

export default Header;
