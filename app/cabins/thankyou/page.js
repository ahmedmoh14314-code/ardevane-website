import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HomeModernIcon,
  MoonIcon,
  PencilSquareIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import hero from "@/public/img/home/hero.jpg";
import ClearPickedDates from "@/app/_components/ClearPickedDates";
import { getGuest } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import { formatCurrency } from "@/app/_lib/pricing";
import { toDay } from "@/app/_lib/stay";

export const metadata = {
  title: "Booking request received",
};

function PineIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2 7.5 9h3L6 15h4l-4 5h12l-4-5h4l-4.5-6h3z" />
      <path d="M12 20v2.5" />
    </svg>
  );
}

// What happens now, in three short lines
const nowItems = [
  {
    icon: ClockIcon,
    title: "Awaiting confirmation",
    text: "Our front desk confirms your booking shortly. Your nights are held until then.",
  },
  {
    icon: PencilSquareIcon,
    title: "Manage your stay",
    text: "Change or cancel for free until the day before you arrive.",
  },
  {
    icon: SunIcon,
    title: "Order ahead",
    text: "Once confirmed, order food and ask for anything in My Stay.",
  },
];

const nextItems = [
  {
    icon: HomeModernIcon,
    title: "Plan your arrival",
    text: "Nothing to pay now. You pay at the cabin when you arrive.",
  },
  {
    icon: SunIcon,
    title: "Get ready",
    text: "Breakfast, lunch and dinner can be brought to your cabin.",
  },
  {
    icon: PineIcon,
    title: "Explore Ardevane",
    text: "Trails, lake views and evenings by the fire.",
    href: "/about",
  },
];

function Fact({ icon: Icon, label, value, note }) {
  return (
    <div className="min-w-0">
      <p className="font-label text-[0.85rem] text-ink-500">{label}</p>
      <p className="mt-1.5 flex items-center gap-2.5 font-display text-[1.1rem] text-ink-800">
        <Icon className="h-5 w-5 shrink-0 text-forest-900" />
        {value}
      </p>
      {note && (
        <p className="ml-[1.9rem] font-label text-[0.75rem] text-ink-500">
          {note}
        </p>
      )}
    </div>
  );
}

export default async function Page({ searchParams }) {
  // Only something shaped like a booking reference is looked up
  const reference = /^ARD-[A-Z0-9]{6}$/.test(searchParams?.ref ?? "")
    ? searchParams.ref
    : null;

  // The booking itself, if it belongs to the guest who is signed in
  const guest = reference ? await getGuest() : null;
  const booking = guest
    ? (await getBookings(guest.id)).find((b) => b.reference === reference)
    : null;

  return (
    <div className="relative">
      <ClearPickedDates />

      {/* The welcome, over the cabin at sunset */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={hero}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/80 via-forest-950/50 to-forest-950/10" />

        <div className="mx-auto max-w-6xl animate-rise px-5 pb-36 pt-12 text-center sm:px-8 sm:pb-40 sm:pt-16 md:text-left">
          <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-sand-100/80 bg-forest-900 text-sand-50 md:mx-0">
            <CheckIcon className="h-8 w-8" />
          </span>
          <h1 className="font-display text-[3rem] leading-none text-white sm:text-[4rem]">
            Thank you!
          </h1>
          <p className="mt-3 font-display text-[1.5rem] text-sand-100 sm:text-[1.8rem]">
            Your request is in.
          </p>
          <p className="mx-auto mt-4 max-w-md font-label text-[1rem] leading-relaxed text-sand-100/90 md:mx-0">
            We can&apos;t wait to welcome you to Ardevane. You&apos;ll see your
            booking change to Reserved in your account once it&apos;s confirmed.
          </p>
        </div>
      </section>

      <div className="relative mx-auto -mt-24 max-w-5xl px-4 pb-16 sm:px-8 sm:pb-24">
        {/* The booking, when we can show it */}
        {booking ? (
          <section className="grid gap-5 rounded-md border border-sand-200 bg-sand-50 p-4 shadow-lift sm:grid-cols-[17rem_1fr] sm:gap-7 sm:p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] sm:aspect-auto sm:min-h-[11rem]">
              <Image
                src={booking.cabins.image}
                alt={`Cabin ${booking.cabins.name}`}
                fill
                sizes="(min-width: 640px) 17rem, 100vw"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-[1.7rem] text-forest-950">
                  Cabin {booking.cabins.name}
                </h2>
                <span className="font-label text-[0.85rem] text-ink-500">
                  Booking {booking.reference}
                </span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 font-label text-[0.9rem] text-ink-700">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  {booking.numGuests}{" "}
                  {booking.numGuests === 1 ? "guest" : "guests"}
                </span>
                <span>
                  {formatCurrency(booking.totalPrice)}, paid at the cabin
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-sand-200 pt-4 sm:grid-cols-3">
                <Fact
                  icon={CalendarIcon}
                  label="Check in"
                  value={format(toDay(booking.startDate), "MMM d, yyyy")}
                />
                <Fact
                  icon={CalendarIcon}
                  label="Check out"
                  value={format(toDay(booking.endDate), "MMM d, yyyy")}
                />
                <Fact
                  icon={MoonIcon}
                  label="Nights"
                  value={`${booking.numNights} ${booking.numNights === 1 ? "night" : "nights"}`}
                />
              </div>
            </div>
          </section>
        ) : (
          reference && (
            <p className="rounded-md border border-sand-200 bg-sand-50 p-6 text-center font-display text-lg text-ink-700 shadow-lift">
              Booking number{" "}
              <span className="rounded-[3px] bg-sand-200 px-2 py-0.5 text-forest-950">
                {reference}
              </span>
            </p>
          )
        )}

        {/* What happens now */}
        <ul
          className={`grid gap-5 rounded-md border border-sand-200 bg-sand-100 p-5 sm:grid-cols-3 sm:gap-0 sm:p-6 ${
            booking || reference ? "mt-4" : "shadow-lift"
          }`}
        >
          {nowItems.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={`flex gap-4 sm:px-5 ${
                i > 0 ? "sm:border-l sm:border-sand-300" : ""
              }`}
            >
              <Icon className="h-7 w-7 shrink-0 text-forest-900" />
              <div>
                <h3 className="font-display text-[1.1rem] text-forest-950">
                  {title}
                </h3>
                <p className="mt-1 font-label text-[0.82rem] leading-relaxed text-ink-600">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/account/reservations"
            className="btn-forest px-10 py-3.5"
          >
            View my reservation
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[3px] border border-ink-400 px-10 py-3.5 font-display text-[1.05rem] text-ink-800 transition-colors hover:border-forest-900 hover:bg-white"
          >
            Back to home
          </Link>
        </div>

        {/* What's next */}
        <section className="mt-14">
          <h2 className="font-display text-[2rem] text-forest-950">
            What&apos;s next?
          </h2>
          <ul className="mt-5 grid gap-6 sm:grid-cols-3">
            {nextItems.map(({ icon: Icon, title, text, href }) => (
              <li key={title} className="flex gap-4">
                <Icon className="h-8 w-8 shrink-0 text-ink-700" />
                <div>
                  <h3 className="font-display text-[1.15rem] text-forest-950">
                    {href ? (
                      <Link href={href} className="hover:text-bark-700">
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                  </h3>
                  <p className="mt-1 font-label text-[0.85rem] leading-relaxed text-ink-600">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
