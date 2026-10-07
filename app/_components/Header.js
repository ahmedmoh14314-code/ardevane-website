import Logo from "@/app/_components/Logo";
import Navigation from "@/app/_components/Navigation";
import { getUser } from "../_lib/auth";

async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Logo />
        <Navigation user={user} />
      </div>
    </header>
  );
}

export default Header;
