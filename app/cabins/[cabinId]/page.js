import Link from "next/link";

import CabinGallery from "@/app/_components/CabinGallery";
import BookingCard from "@/app/_components/BookingCard";
import DateSelector from "@/app/_components/DateSelector";
import TextExpander from "@/app/_components/TextExpander";
import {
  getBookedDatesByCabinId,
  getCabin,
  getCabinImages,
  getCabins,
  getSettings,
} from "@/app/_lib/data-service";
import { formatCurrency } from "@/app/_lib/pricing";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
}

// What every Ardevane cabin has, and what a stay includes
const included = [
  "Lake & mountain views",
  "Private deck",
  "Fireplace",
  "Food to your cabin",
  "Housekeeping",
];

export default async function Page({ params }) {
  const [cabin, images, settings, takenNights] = await Promise.all([
    getCabin(params.cabinId),
    getCabinImages(params.cabinId),
    getSettings(),
    getBookedDatesByCabinId(params.cabinId),
  ]);

  const { name, maxCapacity, discount, image, description } = cabin;

  // Cabins added before the gallery existed only have their cover photo
  const photos = images.length ? images.map((img) => img.url) : [image];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-8 sm:pb-24 sm:pt-8">
      <Link
        href="/cabins"
        className="mb-4 inline-block font-display text-ink-700 hover:text-forest-900 sm:mb-5"
      >
        &larr; All cabins
      </Link>

      <CabinGallery photos={photos} name={name} />

      {/* On phones the booking card sits right under the cabin's name; on
          wide screens it stays beside everything, as you scroll */}
      <div className="mt-6 grid gap-x-12 gap-y-8 sm:mt-8 lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <h1 className="font-display text-[2.4rem] leading-none text-forest-950 sm:text-[3.1rem]">
            Cabin {name}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-label text-[0.95rem] text-ink-700">
            <span>Up to {maxCapacity} guests</span>
            {discount > 0 && (
              <span className="rounded-full bg-[#2d8663] px-3 py-1 text-[0.8rem] font-semibold text-white">
                Save {formatCurrency(discount)} a night
              </span>
            )}
          </p>

          {/* What every cabin has, in one line */}
          <p className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 font-display text-[1rem] text-ink-700">
            {included.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && <span className="text-bark-500">&middot;</span>}
                {item}
              </span>
            ))}
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <BookingCard
            cabin={cabin}
            settings={settings}
            takenNights={takenNights}
          />
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          {description && (
            <section className="border-t border-sand-200 pt-7">
              <h2 className="font-display text-[1.6rem] text-forest-950">
                About this cabin
              </h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-700">
                <TextExpander>{description}</TextExpander>
              </p>
            </section>
          )}

          {/* The free nights, picked here and carried into the card */}
          <section
            id="availability"
            className="mt-8 scroll-mt-24 border-t border-sand-200 pt-7"
          >
            <h2 className="font-display text-[1.6rem] text-forest-950">
              Pick your dates
            </h2>
            <p className="mb-5 mt-1 font-label text-[0.9rem] text-ink-600">
              Tap your arrival day, then your departure day.
            </p>
            <DateSelector
              settings={settings}
              takenNights={takenNights}
              cabin={cabin}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
