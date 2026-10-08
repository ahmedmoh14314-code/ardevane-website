import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon, SunIcon } from "@heroicons/react/24/outline";

import hero from "@/public/img/home/hero.jpg";
import interior from "@/public/img/home/interior.jpg";
import escape from "@/public/img/home/escape.jpg";
import pineBranch from "@/public/img/home/pine-branch.png";
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

// Thin line icons, drawn to match the rest of the page
function CupIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      {...props}
    >
      <path d="M4 10h13v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16.5M8 3.5c-.8 1 .8 2-.1 3M12 3c-.8 1 .8 2-.1 3.2" />
    </svg>
  );
}

function LeafIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      {...props}
    >
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
      <path d="M5 19 13 11M9 15V11M12 12h3" />
    </svg>
  );
}

function PineIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2 7.5 9h3L6 15h4l-4 5h12l-4-5h4l-4.5-6h3z" />
      <path d="M12 20v2.5" />
    </svg>
  );
}

const experience = [
  {
    icon: CupIcon,
    title: "Morning comforts",
    text: "Start the day with locally sourced coffee and tea.",
  },
  {
    icon: LeafIcon,
    title: "Carefully maintained",
    text: "Spotless cabins and attentive housekeeping.",
  },
  {
    icon: PineIcon,
    title: "Local insight",
    text: "Recommendations for hikes, dining and more.",
  },
  {
    icon: SunIcon,
    title: "We're here for you",
    text: "Responsive support throughout your stay.",
  },
];

export default async function Page() {
  const cabins = await getCabins();

  return (
    <>
      {/* 1. The hero: the cabin at sunset, and a search right on it */}
      <section className="relative isolate">
        <div className="relative min-h-[34rem] overflow-hidden md:min-h-[38rem]">
          <Image
            src={hero}
            alt="A wooden cabin with a lit deck above a lake, mountains behind, at sunset"
            fill
            priority
            placeholder="blur"
            quality={85}
            sizes="100vw"
            className="-z-10 object-cover object-[70%_center]"
          />

          <div className="mx-auto max-w-7xl px-5 pb-40 pt-12 sm:px-8 md:pb-44 md:pt-16">
            <p className="kicker mb-5 text-sand-50 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
              Private cabins. Wilder places.
            </p>
            <h1 className="max-w-[28rem] font-display text-[3.2rem] leading-[0.98] tracking-[-0.02em] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.55)] sm:text-[4.4rem]">
              A more meaningful mountain stay.
            </h1>
            <p className="mt-5 max-w-md text-[1.15rem] leading-relaxed text-sand-50 [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
              Secluded cabins, stunning natural surroundings, and the comforts
              of a thoughtfully curated stay.
            </p>
            <div className="mt-8 hidden gap-3 sm:flex">
              <Link href="/cabins" className="btn-forest">
                Explore cabins
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/about" className="btn-sand">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bark-700 text-sand-50">
                  <PlayIcon className="h-3.5 w-3.5 translate-x-px" />
                </span>
                Our story
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-28 max-w-5xl px-5 sm:px-8 md:-mt-20">
          <HeroSearch />
        </div>
      </section>

      {/* 2. A quieter kind of getaway */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_1.1fr] md:gap-14 md:py-16 xl:grid-cols-[1fr_1fr_13rem] xl:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] shadow-soft">
          <Image
            src={interior}
            alt="An armchair with a blanket by a big window over the lake and mountains"
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="kicker mb-4 text-bark-600">A quieter kind of getaway</p>
          <h2 className="font-display text-[2.4rem] leading-[1.08] text-forest-950 sm:text-[2.75rem]">
            Rooted in nature.
            <br />
            Built for what matters.
          </h2>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-ink-700">
            Ardevane is a collection of private mountain cabins, created for
            slowing down, reconnecting, and experiencing the outdoors in
            comfort. Whether you&apos;re here for crisp mornings, long hikes, or
            simply a change of pace, you&apos;ll find a stay that feels
            different in all the right ways.
          </p>
          <Link
            href="/about"
            className="link-arrow mt-6 text-bark-700 hover:text-bark-500"
          >
            Our story
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* The pine branch and a handwritten note, in their own margin */}
        <div aria-hidden="true" className="relative hidden h-full xl:block">
          <Image
            src={pineBranch}
            alt=""
            className="absolute -right-10 -top-6 w-[12.5rem] opacity-90"
          />
          <p className="absolute bottom-6 left-0 -rotate-[14deg] font-script text-[3.2rem] leading-[0.95] text-bark-600/90">
            More
            <br />
            <span className="ml-7">Nature</span>
            <br />
            <span className="ml-12 whitespace-nowrap">Lives Here</span>
          </p>
        </div>
      </section>

      {/* 3. The cabins */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker mb-3 text-ink-700">Our cabins</p>
            <h2 className="font-display text-[2.2rem] leading-[1.1] text-forest-950 sm:text-[2.5rem]">
              Distinct stays.
              <br />
              Same breathtaking setting.
            </h2>
          </div>
          <Link
            href="/cabins"
            className="link-arrow text-forest-900 hover:text-bark-600"
          >
            Explore all cabins
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="-mx-5 flex snap-x scroll-px-5 gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
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
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl text-forest-950">
                        {title}
                      </h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 font-display text-[0.95rem] text-ink-600">
                        {cabin && <span>Up to {cabin.maxCapacity} guests</span>}
                        {notes.map((note) => (
                          <span key={note} className="flex items-center gap-3">
                            <span className="h-3.5 w-px bg-ink-400" />
                            {note}
                          </span>
                        ))}
                      </p>
                      {cabin && (
                        <p className="mt-1 font-display text-[0.95rem] text-bark-600">
                          From{" "}
                          {formatCurrency(
                            cabin.regularPrice - (cabin.discount ?? 0)
                          )}{" "}
                          a night
                        </p>
                      )}
                    </div>
                    <ArrowRightIcon className="mt-1.5 h-5 w-5 shrink-0 text-forest-900 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 4. The stay experience */}
      <section className="bg-sand-200/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.25fr_2.6fr] lg:items-center">
          <div className="lg:border-r lg:border-ink-400/40 lg:pr-10">
            <p className="kicker mb-3 text-bark-600">The stay experience</p>
            <h2 className="font-display text-[2rem] leading-[1.12] text-forest-950">
              Thoughtful details
              <br />
              for a more restful stay.
            </h2>
          </div>
          <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {experience.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="mb-3 h-8 w-8 text-bark-600" />
                <h3 className="font-display text-lg text-forest-950">
                  {title}
                </h3>
                <p className="mt-1 font-display text-[0.98rem] leading-snug text-ink-600">
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

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <p className="kicker mb-4 text-sand-100">Your next chapter awaits</p>
          <h2 className="font-display text-[2.3rem] leading-[1.08] text-white sm:text-[2.7rem]">
            Discover your
            <br />
            mountain escape.
          </h2>
          <Link href="/cabins" className="btn-outline-light mt-7">
            Explore cabins
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
