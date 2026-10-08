import Image from "next/image";
import Link from "next/link";

import hero from "@/public/img/home/hero.jpg";
import interior from "@/public/img/home/interior.jpg";
import escape from "@/public/img/home/escape.jpg";
import cabinLakeside from "@/public/img/home/cabin-lakeside.jpg";
import cabinPineRidge from "@/public/img/home/cabin-pine-ridge.jpg";
import cabinSummit from "@/public/img/home/cabin-summit.jpg";

import HeroSearch from "./_components/HeroSearch";
import { getCabins } from "./_lib/data-service";
import { formatCurrency } from "./_lib/pricing";

export const revalidate = 3600;

// The three cabins shown on the home page, each with a photo of the cabin
// from outside, and what it is known for
const featured = [
  {
    photo: cabinLakeside,
    title: "Lakeside Cabin",
    notes: ["Lake views", "Private deck"],
  },
  {
    photo: cabinPineRidge,
    title: "Pine Ridge Cabin",
    notes: ["Forest setting", "Fireplace"],
  },
  {
    photo: cabinSummit,
    title: "Summit Cabin",
    notes: ["Mountain views", "Hot tub"],
  },
];

// What a stay comes with, in four short lines
const experience = [
  {
    title: "Food to your cabin",
    text: "Breakfast, lunch and dinner from our kitchen, brought to your door.",
  },
  {
    title: "Housekeeping",
    text: "Fresh towels, linen and a tidy cabin whenever you ask.",
  },
  {
    title: "Help any time",
    text: "Our team is a message away, before you arrive and during your stay.",
  },
  {
    title: "Pay at the cabin",
    text: "Nothing to pay online. Change or cancel for free until the day before.",
  },
];

export default async function Page() {
  const cabins = await getCabins();

  return (
    <>
      {/* 1. The hero: the cabin lit at dusk, filling the top of the page
          with the header laid over it; the words sit low on the left and
          the search runs along the bottom of the photo. */}
      <section className="relative isolate">
        <div className="relative overflow-hidden">
          <Image
            src={hero}
            alt="A glass-fronted wooden cabin lit at dusk, pines around it and snowy peaks behind"
            fill
            priority
            placeholder="blur"
            quality={85}
            sizes="100vw"
            className="-z-10 object-cover object-[62%_center]"
          />
          {/* Shade at the top, under the header, and at the bottom, under
              the words, so both read on any part of the photo */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-950/60 via-forest-950/10 to-forest-950/55"
            aria-hidden="true"
          />

          {/* The words sit low. On wide screens the photo keeps going
              under them, with the search laid along its bottom. */}
          <div className="mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 sm:min-h-[34rem] sm:px-8 md:min-h-[min(46rem,94vh)] md:pb-44 md:pt-32">
            <div className="max-w-2xl">
              <p className="kicker mb-4 text-[0.78rem] text-gold-300 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
                Welcome to Ardevane
              </p>
              <h1 className="font-display text-[2.8rem] leading-[1] tracking-[-0.02em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.55)] sm:text-[4.6rem] sm:leading-[0.98]">
                Nature stays feel different here.
              </h1>
              <p className="mt-4 max-w-lg text-[1.08rem] leading-relaxed text-sand-50 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)] sm:mt-5 sm:text-[1.2rem]">
                Cozy cabins in the heart of the mountains. A peaceful place to
                relax, explore and create unforgettable memories.
              </p>
            </div>
          </div>
        </div>

        {/* On phones the search hangs off the bottom of the photo; on wide
            screens it lies on the photo. Above the photo's box either way,
            or the box takes the taps meant for the fields. */}
        <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 sm:px-8 md:absolute md:inset-x-0 md:bottom-10 md:mt-0">
          <HeroSearch />
        </div>
      </section>

      {/* 2. A quieter kind of getaway */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-14 md:py-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] shadow-soft">
          <Image
            src={interior}
            alt="An armchair with a blanket by a big window over the lake and mountains"
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="kicker mb-3 text-bark-600">A quieter kind of getaway</p>
          <h2 className="font-display text-[2.1rem] leading-[1.08] text-forest-950 sm:text-[2.75rem]">
            Rooted in nature.
            <br />
            Built for what matters.
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-700 sm:mt-5 sm:text-[1.08rem]">
            Ardevane is a collection of private mountain cabins, created for
            slowing down, reconnecting, and experiencing the outdoors in
            comfort.
          </p>
          <Link
            href="/about"
            className="link-arrow mt-5 text-bark-700 hover:text-bark-500"
          >
            Our story
          </Link>
        </div>
      </section>

      {/* 3. The cabins */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <h2 className="font-display text-[2rem] leading-[1.1] text-forest-950 sm:text-[2.5rem]">
            Our cabins
          </h2>
          <Link
            href="/cabins"
            className="link-arrow shrink-0 text-forest-900 hover:text-bark-600"
          >
            See all
          </Link>
        </div>

        <ul className="-mx-5 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
          {featured.map(({ photo, title, notes }, i) => {
            const cabin = cabins[i];

            return (
              <li key={title} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <Link
                  href={cabin ? `/cabins/${cabin.id}` : "/cabins"}
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[3px]">
                    <Image
                      src={photo}
                      alt={title}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 640px) 33vw, 80vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-3 font-display text-[1.3rem] text-forest-950 group-hover:text-bark-700">
                    {title}
                  </h3>
                  <p className="mt-0.5 font-label text-[0.85rem] text-ink-600">
                    {[cabin && `Up to ${cabin.maxCapacity} guests`, ...notes]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {cabin && (
                    <p className="mt-1 font-display text-[1.05rem] text-bark-700">
                      From{" "}
                      {formatCurrency(
                        cabin.regularPrice - (cabin.discount ?? 0)
                      )}{" "}
                      a night
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/cabins" className="btn-forest mt-6 w-full sm:hidden">
          Explore all cabins
        </Link>
      </section>

      {/* 4. What a stay comes with */}
      <section className="bg-sand-200/70">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <p className="kicker mb-3 text-bark-600">The stay</p>
          <h2 className="max-w-md font-display text-[2rem] leading-[1.12] text-forest-950 sm:text-[2.4rem]">
            Thoughtful details for a more restful stay.
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {experience.map(({ title, text }) => (
              <li key={title} className="border-t border-bark-500/60 pt-4">
                <h3 className="font-display text-[1.2rem] text-forest-950">
                  {title}
                </h3>
                <p className="mt-1 text-[1rem] leading-snug text-ink-600">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. The next chapter */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={escape}
          alt="Two wooden chairs on a rock above a lake and mountains at sunset"
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/75 via-forest-950/35 to-transparent" />

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
          <h2 className="font-display text-[2.2rem] leading-[1.08] text-white sm:text-[2.7rem]">
            Discover your
            <br />
            mountain escape.
          </h2>
          <Link
            href="/cabins"
            className="btn-outline-light mt-6 w-full sm:w-auto"
          >
            Explore cabins
          </Link>
        </div>
      </section>
    </>
  );
}
