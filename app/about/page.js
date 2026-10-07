import Image from "next/image";
import Link from "next/link";
import panorama from "@/public/img/panorama.webp";
import hero from "@/public/img/hero.jpg";
import { getCabins } from "../_lib/data-service";

export const revalidate = 86400;

export const metadata = {
  title: "About",
};

export default async function Page() {
  const cabins = await getCabins();

  const facts = [
    { value: cabins.length, label: "private cabins" },
    {
      value: Math.max(...cabins.map((cabin) => cabin.maxCapacity)),
      label: "guests in our largest cabin",
    },
    { value: "365", label: "days a year open" },
  ];

  return (
    <>
      <div className="page pb-0 sm:pb-0">
        <header className="mx-auto max-w-3xl animate-rise text-center">
          <p className="eyebrow mb-3">About Ardevane</p>
          <h1 className="page-title mb-6">
            A quiet corner between the pines and the lake
          </h1>
          <p className="text-lg leading-relaxed text-ink-600">
            Ardevane is a small resort of wooden cabins, spread out so that
            every one of them feels like the only one. You come for the views,
            and stay for how little you have to think about.
          </p>
        </header>
      </div>

      <Image
        src={panorama}
        alt="The lake and the mountains seen from a cabin deck"
        placeholder="blur"
        sizes="100vw"
        className="mt-6 h-auto w-full"
      />

      <div className="page">
        <ul className="mb-20 grid gap-6 sm:grid-cols-3">
          {facts.map((fact) => (
            <li key={fact.label} className="card p-8 text-center">
              <p className="font-display text-5xl text-brand-700">
                {fact.value}
              </p>
              <p className="mt-2 text-ink-600">{fact.label}</p>
            </li>
          ))}
        </ul>

        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
            <Image
              src={hero}
              alt="A terrace with a fire pit at sunset"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-ink-600">
            <p className="eyebrow">How we look after you</p>
            <h2 className="font-display text-4xl text-brand-900">
              Small enough to know your name
            </h2>
            <p>
              The same team runs the front desk, the kitchen and the cabins. We
              see your reservation the moment you make it, so your notes about
              allergies, pets or a late arrival are waiting for us before you
              are.
            </p>
            <p>
              There is nothing to pay until you arrive, and you can change or
              cancel a stay from your guest area until the day before you
              arrive.
            </p>

            <Link href="/cabins" className="btn-primary px-8 py-4">
              Explore the cabins
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
