import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import hero from "@/public/img/home/hero.jpg";
import ClearPickedDates from "@/app/_components/ClearPickedDates";
import { getGuest } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import { formatCurrency } from "@/app/_lib/pricing";
import { toDay } from "@/app/_lib/stay";

export const metadata = {
  title: "Booking request received",
};

// What happens now, in three short lines
const steps = [
  {
    title: "We confirm your booking",
    text: "Our front desk confirms it shortly. Your nights are held until then.",
  },
  {
    title: "Change your mind for free",
    text: "Edit or cancel from your account until the day before you arrive.",
  },
  {
    title: "Order ahead",
    text: "Once confirmed, order food and ask for anything in My Stay.",
  },
];

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="font-label text-[0.78rem] text-ink-500">{label}</p>
      <p className="mt-0.5 font-display text-[1.1rem] text-ink-800">{value}</p>
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
        <div className="absolute inset-0 -z-10 bg-forest-950/55" />

        <div className="mx-auto max-w-5xl animate-rise px-5 pb-28 pt-12 text-center sm:px-8 sm:pb-32 sm:pt-16">
          <h1 className="font-display text-[3rem] leading-none text-white sm:text-[4rem]">
            Thank you!
          </h1>
          <p className="mt-3 font-display text-[1.4rem] text-sand-100 sm:text-[1.7rem]">
            Your booking request is in.
          </p>
        </div>
      </section>

      <div className="relative mx-auto -mt-20 max-w-3xl px-4 pb-16 sm:px-8 sm:pb-24">
        {/* The booking, when we can show it */}
        {booking ? (
          <section className="overflow-hidden rounded-md border border-sand-200 bg-sand-50 shadow-lift">
            <div className="relative aspect-[16/8] sm:aspect-[21/8]">
              <Image
                src={booking.cabins.image}
                alt={`Cabin ${booking.cabins.name}`}
                fill
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-[1.8rem] text-forest-950">
                  Cabin {booking.cabins.name}
                </h2>
                <span className="font-label text-[0.85rem] text-ink-500">
                  {booking.reference}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-sand-200 pt-4 sm:grid-cols-4">
                <Fact
                  label="Check in"
                  value={format(toDay(booking.startDate), "MMM d, yyyy")}
                />
                <Fact
                  label="Check out"
                  value={format(toDay(booking.endDate), "MMM d, yyyy")}
                />
                <Fact
                  label="Stay"
                  value={`${booking.numNights} ${booking.numNights === 1 ? "night" : "nights"}, ${booking.numGuests} ${booking.numGuests === 1 ? "guest" : "guests"}`}
                />
                <Fact
                  label="Total, paid at the cabin"
                  value={formatCurrency(booking.totalPrice)}
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
        <ol
          className={`grid gap-5 rounded-md border border-sand-200 bg-sand-100 p-5 sm:grid-cols-3 sm:p-6 ${
            booking || reference ? "mt-4" : "shadow-lift"
          }`}
        >
          {steps.map(({ title, text }, i) => (
            <li key={title} className="flex gap-4 sm:block">
              <span className="font-display text-[1.8rem] leading-none text-bark-500">
                {i + 1}
              </span>
              <div className="sm:mt-2">
                <h3 className="font-display text-[1.1rem] leading-snug text-forest-950">
                  {title}
                </h3>
                <p className="mt-1 font-label text-[0.85rem] leading-relaxed text-ink-600">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account/reservations" className="btn-forest sm:px-10">
            See my reservation
          </Link>
          <Link href="/" className="btn-outline sm:px-10">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
