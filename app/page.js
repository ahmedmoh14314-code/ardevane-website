import Image from "next/image";
import Link from "next/link";
import {
  FireIcon,
  HomeModernIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import hero from "@/public/img/hero.jpg";
import CabinCard from "./_components/CabinCard";
import { getCabins } from "./_lib/data-service";

export const revalidate = 3600;

const highlights = [
  {
    icon: HomeModernIcon,
    title: "A cabin of your own",
    text: "Wooden cabins spread between the pines, each with its own deck and no neighbours in sight.",
  },
  {
    icon: FireIcon,
    title: "Evenings by the fire",
    text: "Fire pits, hot tubs and long views over the lake as the sun goes down behind the peaks.",
  },
  {
    icon: SparklesIcon,
    title: "Looked after, quietly",
    text: "Breakfast brought to your cabin if you want it, and a team that knows every cabin by name.",
  },
];

export default async function Page() {
  const cabins = await getCabins();

  return (
    <>
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden">
        <Image
          src={hero}
          alt="A cabin terrace with a fire pit, looking over the lake to the mountains"
          fill
          priority
          placeholder="blur"
          quality={85}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/85 via-brand-950/35 to-transparent" />

        <div className="mx-auto w-full max-w-7xl animate-rise px-4 pb-16 sm:px-8 sm:pb-24">
          <p className="eyebrow mb-4 text-gold-300">Mountain cabins by the lake</p>
          <h1 className="max-w-3xl font-display text-5xl font-medium leading-tight text-white sm:text-7xl">
            Wake up where the forest meets the water.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream-100">
            {cabins.length} private cabins, open all year. Choose your dates,
            reserve in a minute and pay when you arrive.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/cabins" className="btn-gold px-8 py-4 text-lg">
              Find your cabin
            </Link>
            <Link
              href="/about"
              className="btn border border-white/40 px-8 py-4 text-lg text-white hover:bg-white/10"
            >
              About Ardevane
            </Link>
          </div>
        </div>
      </section>

      <section className="page">
        <ul className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="card animate-rise p-7"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mb-2 font-display text-2xl text-brand-900">
                {title}
              </h2>
              <p className="leading-relaxed text-ink-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="page pt-0 sm:pt-0">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Our cabins</p>
            <h2 className="page-title">Pick your view</h2>
          </div>

          <Link href="/cabins" className="btn-secondary">
            See all {cabins.length} cabins &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cabins.slice(0, 3).map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
          ))}
        </div>
      </section>
    </>
  );
}
