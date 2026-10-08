import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import deck from "@/public/img/about/deck.jpg";
import bedroom from "@/public/img/about/bedroom.jpg";
import fireplace from "@/public/img/about/fireplace.jpg";
import escape from "@/public/img/home/escape.jpg";
import { getCabins } from "../_lib/data-service";

export const revalidate = 86400;

export const metadata = {
  title: "About",
};

// Thin line icons, drawn to match the rest of the site
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

function MountainsIcon(props) {
  return (
    <svg viewBox="0 0 32 24" {...line} {...props}>
      <path d="M2 21 12 7l6 8 4-5 8 11z" />
      <path d="M9.5 10.5 12 7l2.5 3.5" />
    </svg>
  );
}

function PineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...line} {...props}>
      <path d="M12 2 7.5 9h3L6 15h4l-4 5h12l-4-5h4l-4.5-6h3z" />
      <path d="M12 20v2.5" />
    </svg>
  );
}

function LeafIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...line} {...props}>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
      <path d="M5 19 13 11" />
    </svg>
  );
}

function PeopleIcon(props) {
  return (
    <svg viewBox="0 0 28 24" {...line} {...props}>
      <circle cx="14" cy="7" r="3" />
      <circle cx="6.5" cy="9" r="2.4" />
      <circle cx="21.5" cy="9" r="2.4" />
      <path d="M8 20a6 6 0 0 1 12 0M1.5 19a5 5 0 0 1 6.5-4.7M26.5 19a5 5 0 0 0-6.5-4.7" />
    </svg>
  );
}

const highlights = [
  { icon: MountainsIcon, title: "Scenic location", text: "Mountains & lake" },
  { icon: PineIcon, title: "Cozy cabins", text: "Modern comfort" },
  { icon: LeafIcon, title: "Nature first", text: "Peace & privacy" },
  {
    icon: PeopleIcon,
    title: "Memorable stays",
    text: "For families & friends",
  },
];

function Kicker({ children }) {
  return <p className="kicker mb-4 text-bark-600">{children}</p>;
}

function Photo({ src, alt, className = "", sizes }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-soft ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        placeholder="blur"
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export default async function Page() {
  const cabins = await getCabins();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      {/* 1. A place to slow down */}
      <section className="grid items-center gap-8 md:grid-cols-[1fr_1.05fr] md:gap-14">
        <div className="animate-rise">
          <Kicker>About Ardevane</Kicker>
          <h1 className="font-display text-[2.6rem] leading-[1.05] tracking-[-0.01em] text-forest-950 sm:text-[3.5rem]">
            A place to slow down and{" "}
            <em className="text-bark-700">feel at home.</em>
          </h1>
          <p className="mt-6 max-w-md text-[1.12rem] leading-relaxed text-ink-700">
            Ardevane is a collection of {cabins.length} handpicked cabins set in
            nature, where modern comfort meets the calm of the mountains and the
            lake.
          </p>
        </div>

        <Photo
          src={deck}
          alt="A wooden deck with chairs around a fire, above a lake at sunset"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[3/2]"
        />
      </section>

      {/* 2. What Ardevane is, in four words */}
      <ul className="mt-10 grid grid-cols-2 gap-y-8 border-y border-sand-200 py-8 sm:mt-14 lg:grid-cols-4">
        {highlights.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className={`flex items-center gap-2.5 px-2 sm:gap-4 sm:px-6 ${
              i % 2 === 1 ? "border-l border-sand-200" : ""
            } ${i > 0 ? "lg:border-l lg:border-sand-200" : ""}`}
          >
            <Icon className="h-7 w-7 shrink-0 text-bark-700 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <h2 className="whitespace-nowrap font-display text-[1rem] text-forest-950 sm:text-[1.15rem]">
                {title}
              </h2>
              <p className="font-label text-[0.75rem] text-ink-600 sm:text-[0.82rem]">
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* 3. Our story */}
      <section className="mt-14 grid items-center gap-8 md:mt-20 md:grid-cols-[1fr_1.05fr] md:gap-14">
        <Photo
          src={bedroom}
          alt="A warm cabin bedroom with a big window over the lake"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="order-2 aspect-[3/2] md:order-1"
        />

        <div className="order-1 md:order-2">
          <Kicker>Our story</Kicker>
          <h2 className="font-display text-[2.1rem] leading-[1.1] text-forest-950 sm:text-[2.6rem]">
            Built on a love
            <br />
            for nature and simple living.
          </h2>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-ink-700">
            Ardevane started with a simple idea: to create a place where people
            can escape the noise, reconnect with nature, and enjoy meaningful
            time together.
          </p>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-ink-700">
            Every cabin is carefully designed to offer comfort, privacy, and a
            true sense of place, inspired by the surrounding forest, lake, and
            mountains.
          </p>
          <Link href="/cabins" className="btn-forest mt-7">
            Explore our cabins
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. Our philosophy */}
      <section className="mt-14 grid gap-6 md:mt-20 md:grid-cols-[1.6fr_1fr]">
        <Photo
          src={fireplace}
          alt="An armchair by a stone fireplace and a window over the lake"
          sizes="(min-width: 768px) 60vw, 100vw"
          className="aspect-[2.2/1] md:aspect-auto md:min-h-[20rem]"
        />

        <div className="rounded-md bg-sand-100 p-7 sm:p-10">
          <Kicker>Our philosophy</Kicker>
          <h2 className="font-display text-[2rem] leading-[1.1] text-forest-950 sm:text-[2.3rem]">
            Simple stays.
            <br />
            Richer moments.
          </h2>
          <span className="mt-5 block h-px w-14 bg-bark-500" />
          <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-700">
            We believe the best memories come from simple things: a warm cabin,
            a good meal, great company and time in nature.
          </p>
        </div>
      </section>

      {/* 5. The location */}
      <section className="mt-14 grid items-center gap-8 md:mt-20 md:grid-cols-[1fr_1.15fr] md:gap-14">
        <div>
          <Kicker>The location</Kicker>
          <h2 className="font-display text-[2.1rem] leading-[1.1] text-forest-950 sm:text-[2.6rem]">
            Nature at your doorstep.
          </h2>
          <p className="mt-5 max-w-md text-[1.08rem] leading-relaxed text-ink-700">
            Ardevane is set in a stunning natural landscape, with forests, a
            peaceful lake and breathtaking views in every season. Mornings on
            the deck, long walks among the pines, and evenings by the fire.
          </p>
        </div>

        <Photo
          src={escape}
          alt="Two wooden chairs on a rock above the lake and mountains"
          sizes="(min-width: 768px) 55vw, 100vw"
          className="aspect-[2.4/1]"
        />
      </section>
    </div>
  );
}
