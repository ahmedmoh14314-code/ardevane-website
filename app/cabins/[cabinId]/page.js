import Link from "next/link";
import {
  ArrowLeftIcon,
  FireIcon,
  HomeModernIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

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

function MountainIcon(props) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 21 12 7l6 8 4-5 8 11z" />
      <path d="M9.5 10.5 12 7l2.5 3.5" />
    </svg>
  );
}

// What every Ardevane cabin has, and what a stay includes
const included = [
  { icon: MountainIcon, title: "Lake & mountain views" },
  { icon: HomeModernIcon, title: "Private deck" },
  { icon: FireIcon, title: "Fireplace" },
  { icon: SunIcon, title: "Food to your cabin" },
  { icon: SparklesIcon, title: "Housekeeping" },
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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-8">
      <Link
        href="/cabins"
        className="mb-5 inline-flex items-center gap-2 font-display text-ink-700 hover:text-forest-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to cabins
      </Link>

      <CabinGallery photos={photos} name={name} />

      {/* On phones the booking card sits right under the cabin's name; on
          wide screens it stays beside everything, as you scroll */}
      <div className="mt-8 grid gap-x-12 gap-y-9 lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          {/* The cabin in a line */}
          <h1 className="font-display text-[2.5rem] leading-none text-forest-950 sm:text-[3.1rem]">
            Cabin {name}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-label text-[0.92rem] text-ink-700">
            <span className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Up to {maxCapacity} guests
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-[#2d8663] px-3 py-1 text-[0.8rem] font-semibold text-white">
                Save {formatCurrency(discount)} a night
              </span>
            )}
          </p>

          {/* What every cabin has */}
          <ul className="mt-7 grid grid-cols-3 gap-y-5 rounded-md border border-sand-200 bg-sand-100/70 py-5 sm:grid-cols-5">
            {included.map(({ icon: Icon, title }) => (
              <li
                key={title}
                className="flex flex-col items-center gap-2 px-2 text-center"
              >
                <Icon className="h-7 w-7 text-bark-700" />
                <span className="font-label text-[0.8rem] leading-tight text-ink-700">
                  {title}
                </span>
              </li>
            ))}
          </ul>
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
            <section className="border-t border-sand-200 pt-8">
              <h2 className="font-display text-[1.7rem] text-forest-950">
                About this cabin
              </h2>
              <p className="mt-3 text-[1.08rem] leading-relaxed text-ink-700">
                <TextExpander>{description}</TextExpander>
              </p>
            </section>
          )}

          {/* The free nights, picked here and carried into the card */}
          <section
            id="availability"
            className="mt-9 scroll-mt-24 border-t border-sand-200 pt-8"
          >
            <h2 className="font-display text-[1.7rem] text-forest-950">
              Availability
            </h2>
            <p className="mb-5 mt-1 font-label text-[0.9rem] text-ink-600">
              Pick your arrival and departure days.
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
