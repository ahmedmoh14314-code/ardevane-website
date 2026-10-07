import Link from "next/link";
import Image from "next/image";
import { format, isFuture, isToday } from "date-fns";
import { auth } from "../_lib/auth";
import { getBookings, getGuest } from "../_lib/data-service";
import { formatCurrency } from "../_lib/pricing";
import StatusTag from "../_components/StatusTag";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  const [bookings, guest] = await Promise.all([
    getBookings(session.user.guestId),
    getGuest(session.user.email),
  ]);

  const firstName = session.user.name.split(" ").at(0);

  // The stay that matters most: the one happening now, or the next one
  const nextStay = bookings.find(
    (booking) =>
      booking.status === "checked-in" ||
      (booking.status === "unconfirmed" &&
        (isFuture(new Date(booking.startDate)) ||
          isToday(new Date(booking.startDate))))
  );

  const isProfileDone = Boolean(guest?.nationality && guest?.nationalID);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow mb-2">Guest area</p>
        <h1 className="page-title">Welcome, {firstName}</h1>
      </header>

      {nextStay ? (
        <Link
          href="/account/reservations"
          className="card group grid overflow-hidden transition-shadow hover:shadow-lift sm:grid-cols-[14rem_1fr]"
        >
          <div className="relative aspect-[16/10] sm:aspect-auto">
            <Image
              src={nextStay.cabins.image}
              alt={`Cabin ${nextStay.cabins.name}`}
              fill
              sizes="(min-width: 640px) 14rem, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-3 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">
                {nextStay.status === "checked-in" ? "Your stay" : "Next stay"}
              </p>
              <StatusTag status={nextStay.status} />
            </div>

            <h2 className="font-display text-3xl text-brand-900">
              Cabin {nextStay.cabins.name}
            </h2>

            <p className="text-ink-600">
              {format(new Date(nextStay.startDate), "EEE, MMM d")} &ndash;{" "}
              {format(new Date(nextStay.endDate), "EEE, MMM d, yyyy")} &middot;{" "}
              {nextStay.numNights} nights
            </p>

            <p className="font-semibold text-ink-800">
              {formatCurrency(nextStay.totalPrice)}
            </p>
          </div>
        </Link>
      ) : (
        <div className="card p-8">
          <h2 className="mb-2 font-display text-2xl text-brand-900">
            No stay planned yet
          </h2>
          <p className="mb-6 text-ink-600">
            Your next escape is a few clicks away.
          </p>
          <Link href="/cabins" className="btn-primary">
            Find a cabin
          </Link>
        </div>
      )}

      {!isProfileDone && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-200 bg-gold-100 p-6">
          <p className="text-ink-700">
            <span className="font-semibold">Save time at check-in.</span> Add
            your nationality and ID number before you arrive.
          </p>
          <Link href="/account/profile" className="btn-secondary">
            Complete profile
          </Link>
        </div>
      )}
    </div>
  );
}
