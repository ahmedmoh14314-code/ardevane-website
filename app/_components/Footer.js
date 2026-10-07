import Link from "next/link";
import Logo from "./Logo";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed text-brand-200">
            Private wooden cabins between the pines and the lake. Exceptional
            stays, looked after by people who know every cabin by name.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 text-gold-300">Stay</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/cabins" className="hover:text-white">
                All cabins
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Ardevane
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 text-gold-300">Guests</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/account/reservations" className="hover:text-white">
                Your reservations
              </Link>
            </li>
            <li>
              <Link href="/account/profile" className="hover:text-white">
                Guest profile
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-brand-300 sm:px-8">
          &copy; {year} Ardevane. Pay on arrival. Change or cancel for free until
          your arrival day.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
