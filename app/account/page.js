import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import { getGuest, getUser } from "../_lib/auth";
import { getBookings, getPropertyToday } from "../_lib/data-service";
import { sortBookings, stayDay } from "../_lib/account";
import { canChangeOnline, toDay } from "../_lib/stay";
import { formatCurrency } from "../_lib/pricing";
import StatusTag from "../_components/StatusTag";

export const metadata = {
  title: "My account",
};

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="font-label text-[0.75rem] text-ink-500">{label}</p>
      <p className="mt-0.5 font-display text-[1.05rem] text-ink-800">{value}</p>
    </div>
  );
}

// The stay coming up (or the one going on), with the one thing to do next
function NextStay({ booking, today, canOrder }) {
  const {
    id,
    reference,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    cabins,
  } = booking;
  const isStaying = status === "checked_in";
  const day = isStaying ? stayDay(booking, today) : null;

  return (
    <section className="overflow-hidden rounded-md border border-sand-200 bg-sand-50 shadow-soft">
      <div className="sm:flex">
        <div className="relative aspect-[16/9] sm:aspect-auto sm:w-64 sm:shrink-0">
          <Image
            src={cabins.image}
            alt={`Cabin ${cabins.name}`}
            fill
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-label text-[0.72rem] uppercase tracking-[0.2em] text-bark-600">
                {reference}
              </p>
              <h3 className="mt-1 font-display text-[1.6rem] leading-tight text-forest-950">
                Cabin {cabins.name}
              </h3>
            </div>
            <StatusTag status={status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-[3px] bg-sand-100 px-4 py-3 sm:grid-cols-4">
            <Fact label="Check in" value={format(toDay(startDate), "MMM d")} />
            <Fact label="Check out" value={format(toDay(endDate), "MMM d")} />
            <Fact
              label="Stay"
              value={`${numNights} ${numNights === 1 ? "night" : "nights"}, ${numGuests} ${numGuests === 1 ? "guest" : "guests"}`}
            />
            <Fact
              label={isStaying ? "Today" : "Total"}
              value={
                isStaying
                  ? day.isDepartureDay
                    ? "Departure day"
                    : `Day ${day.day} of ${day.of}`
                  : formatCurrency(totalPrice)
              }
            />
          </dl>
        </div>
      </div>

      <div className="grid gap-2.5 border-t border-sand-200 p-4 sm:flex sm:p-5">
        {canOrder ? (
          <Link href="/my-stay" className="btn-forest sm:px-8">
            {isStaying ? "Open My Stay" : "Order ahead in My Stay"}
          </Link>
        ) : (
          <Link
            href={`/account/reservations/${id}`}
            className="btn-forest sm:px-8"
          >
            See the details
          </Link>
        )}
        {canChangeOnline(booking, today) && (
          <Link
            href={`/account/reservations/edit/${id}`}
            className="btn-outline sm:px-8"
          >
            Edit reservation
          </Link>
        )}
      </div>
    </section>
  );
}

// A finished or cancelled stay, as one line
function PastStay({ booking }) {
  const { id, startDate, endDate, status, cabins } = booking;

  return (
    <li>
      <Link
        href={`/account/reservations/${id}`}
        className="flex items-center gap-4 rounded-md border border-sand-200 bg-sand-50 p-3 transition-colors hover:border-forest-900/40"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[3px]">
          <Image
            src={cabins.image}
            alt={`Cabin ${cabins.name}`}
            fill
            sizes="6rem"
            className={`object-cover ${status === "cancelled" ? "grayscale" : ""}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[1.15rem] text-forest-950">
            Cabin {cabins.name}
          </h3>
          <p className="font-label text-[0.85rem] text-ink-600">
            {format(toDay(startDate), "MMM d")} &ndash;{" "}
            {format(toDay(endDate), "MMM d, yyyy")}
          </p>
        </div>
        {status !== "checked_out" && <StatusTag status={status} />}
      </Link>
    </li>
  );
}

// The account at a glance: the stay that matters now, and the ones before
export default async function Page() {
  const [user, guest, today] = await Promise.all([
    getUser(),
    getGuest(),
    getPropertyToday(),
  ]);
  const bookings = await getBookings(guest.id);
  const { stay, upcoming, history, servicesFor } = sortBookings(
    bookings,
    today
  );

  const next = stay ?? upcoming[0] ?? null;
  const past = history.slice(0, 3);
  // "AHMED" or "ahmed" reads as "Ahmed"
  const word = user.name.split(" ").at(0) ?? "";
  const firstName = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  const isProfileDone = Boolean(guest?.nationality && guest?.nationalID);

  return (
    <div className="space-y-9">
      <header>
        <h1 className="page-title">Welcome, {firstName}.</h1>
        <p className="mt-2 font-label text-[1rem] text-ink-600">
          {next
            ? stay
              ? "You are staying with us right now."
              : upcoming.length > 1
                ? `You have ${upcoming.length} stays coming up.`
                : "Your next stay is coming up."
            : "No stay planned yet."}
        </p>
      </header>

      <section>
        <h2 className="mb-3 font-display text-[1.5rem] text-forest-950">
          {stay ? "Your stay" : "Your next stay"}
        </h2>
        {next ? (
          <NextStay
            booking={next}
            today={today}
            canOrder={Boolean(servicesFor) && servicesFor.id === next.id}
          />
        ) : (
          <div className="rounded-md border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
            <p className="font-display text-[1.2rem] text-ink-700">
              Your next escape is a few taps away.
            </p>
            <Link
              href="/cabins"
              className="btn-forest mt-5 w-full sm:w-auto sm:px-8"
            >
              Explore cabins
            </Link>
          </div>
        )}
        {upcoming.length > 1 && (
          <Link
            href="/account/reservations"
            className="mt-3 inline-block font-display text-forest-900 underline underline-offset-4"
          >
            See all {upcoming.length} upcoming stays
          </Link>
        )}
      </section>

      {!isProfileDone && (
        <Link
          href="/account/profile"
          className="block rounded-md border border-sand-300 bg-sand-100 px-5 py-4 hover:border-forest-700"
        >
          <span className="font-display text-[1.1rem] text-forest-950">
            Save time at check-in
          </span>
          <span className="mt-1 block font-label text-[0.9rem] text-ink-700">
            Add your nationality and ID number to your profile before you
            arrive.
          </span>
        </Link>
      )}

      {past.length > 0 && (
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-[1.5rem] text-forest-950">
              Past & cancelled
            </h2>
            <Link
              href="/account/reservations"
              className="font-display text-[0.95rem] text-ink-700 underline underline-offset-4 hover:text-forest-900"
            >
              All reservations
            </Link>
          </div>
          <ul className="space-y-2.5">
            {past.map((booking) => (
              <PastStay key={booking.id} booking={booking} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
