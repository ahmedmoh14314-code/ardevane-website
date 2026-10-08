import Link from "next/link";
import { links } from "../_lib/navigation";

const columns = [
  {
    title: "Explore",
    items: [...links, { name: "Account", href: "/account" }],
  },
  {
    title: "Your stay",
    items: [
      { name: "Food & drinks", href: "/my-stay/menu" },
      { name: "Reservations", href: "/account/reservations" },
      { name: "Profile", href: "/account/profile" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-forest-950 text-sand-200">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[1.6rem] uppercase tracking-[0.2em] text-sand-50">
              Ardevane
            </p>
            <p className="mt-3 max-w-xs font-display text-[1.05rem] leading-relaxed text-sand-200/80">
              Private wooden cabins between the pines and the lake, with
              mountain views from every deck.
            </p>
          </div>

          {columns.map(({ title, items }) => (
            <div key={title}>
              <p className="kicker mb-4 text-sand-200/60">{title}</p>
              <ul className="space-y-2.5 font-display text-[1.02rem]">
                {items.map(({ name, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-sand-200/15 pt-6 font-label text-[0.8rem] text-sand-200/60 md:mt-12">
          &copy; {new Date().getFullYear()} Ardevane. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
