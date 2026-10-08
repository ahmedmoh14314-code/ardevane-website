import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  HomeModernIcon,
  MoonIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { getGuest, getUser } from "../_lib/auth";
import { getBookings, getPropertyToday } from "../_lib/data-service";
import { sortBookings, stayDay } from "../_lib/account";
import { canChangeOnline, toDay } from "../_lib/stay";
import { formatCurrency } from "../_lib/pricing";
import StatusTag from "../_components/StatusTag";

export const metadata = {
  title: "My account",
};

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-sand-200 bg-sand-50 p-4 shadow-soft">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-sand-200/70 text-forest-900">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="font-display text-[1.8rem] leading-none text-forest-950">
          {value}
        </p>
        <p className="mt-1 font-label text-[0.85rem] text-ink-600">{label}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, href }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[1.7rem] text-forest-950">{title}</h2>
      {href && (
        <Link
          href={href}
          className="font-label text-[0.9rem] text-ink-700 hover:text-forest-900"
        >
          View all
        </Link>
      )}
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="font-label text-[0.8rem] text-ink-500">{label}</p>
      <p className="mt-1 flex items-center gap-2 font-display text-[1.05rem] text-ink-800">
        <Icon className="h-5 w-5 shrink-0 text-forest-900" />
        {value}
      </p>
    </div>
  );
}

// The stay coming up (or the one going on), large
function UpcomingStay({ booking, today, canOrder }) {
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
    <section className="rounded-md border border-sand-200 bg-sand-50 p-3 shadow-soft sm:p-4">
      <Link
        href={canOrder ? "/my-stay" : `/account/reservations/${id}`}
        className="grid gap-4 sm:grid-cols-[15rem_1fr] sm:gap-6"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] sm:aspect-auto sm:min-h-[10rem]">
          <Image
            src={cabins.image}
            alt={`Cabin ${cabins.name}`}
            fill
            sizes="(min-width: 640px) 15rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 px-1 sm:px-0 sm:py-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-[1.6rem] leading-tight text-forest-950">
                Cabin {cabins.name}
              </h3>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-label text-[0.88rem] text-ink-700">
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  {numGuests} {numGuests === 1 ? "guest" : "guests"}
                </span>
                <span>{formatCurrency(totalPrice)}</span>
                <span className="text-ink-500">{reference}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusTag status={status} />
              <ChevronRightIcon className="hidden h-5 w-5 text-ink-500 sm:block" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-sand-200 pt-4">
            <Fact
              icon={CalendarIcon}
              label="Check in"
              value={format(toDay(startDate), "MMM d, yyyy")}
            />
            <Fact
              icon={CalendarIcon}
              label="Check out"
              value={format(toDay(endDate), "MMM d, yyyy")}
            />
            <Fact
              icon={MoonIcon}
              label={isStaying ? "Today" : "Nights"}
              value={
                isStaying
                  ? day.isDepartureDay
                    ? "Departure"
                    : `Day ${day.day} of ${day.of}`
                  : `${numNights} nights`
              }
            />
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row [&>*]:flex-1">
        <Link
          href={canOrder ? "/my-stay" : `/account/reservations/${id}`}
          className="btn-primary"
        >
          {canOrder ? "Open My Stay" : "View details"}
        </Link>
        {canChangeOnline(booking, today) && (
          <Link
            href={`/account/reservations/edit/${id}`}
            className="btn-secondary"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Modify reservation
          </Link>
        )}
      </div>
    </section>
  );
}

// A finished or cancelled stay, as one line
function PastStay({ booking }) {
  const { id, startDate, endDate, numNights, numGuests, status, cabins } =
    booking;

  return (
    <li>
      <Link
        href={`/account/reservations/${id}`}
        className="flex items-center gap-4 rounded-md border border-sand-200 bg-sand-50 p-3 shadow-soft transition-colors hover:border-sand-300"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[3px] sm:h-24 sm:w-36">
          <Image
            src={cabins.image}
            alt={`Cabin ${cabins.name}`}
            fill
            sizes="9rem"
            className={`object-cover ${status === "cancelled" ? "grayscale" : ""}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-[1.2rem] text-forest-950">
              Cabin {cabins.name}
            </h3>
            {status !== "checked_out" && <StatusTag status={status} />}
          </div>
          <p className="mt-0.5 font-label text-[0.88rem] text-ink-600">
            {format(toDay(startDate), "MMM d")} &ndash;{" "}
            {format(toDay(endDate), "MMM d, yyyy")}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 font-label text-[0.85rem] text-ink-600">
            <span className="flex items-center gap-1.5">
              <MoonIcon className="h-4 w-4" />
              {numNights} nights
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon className="h-4 w-4" />
              {numGuests} {numGuests === 1 ? "guest" : "guests"}
            </span>
          </p>
        </div>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-500" />
      </Link>
    </li>
  );
}

// The account at a glance: the counts, the stay coming up, the ones before
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
    <div className="space-y-10">
      <header>
        <h1 className="page-title">Overview</h1>
        <p className="mt-2 font-label text-[1rem] text-ink-600">
          Welcome, {firstName}. Manage your reservations, view your stays, and
          keep your information up to date.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Stat
          icon={CalendarIcon}
          value={bookings.length}
          label="Total reservations"
        />
        <Stat
          icon={HomeModernIcon}
          value={upcoming.length + (stay ? 1 : 0)}
          label="Upcoming stays"
        />
        <Stat
          icon={ClockIcon}
          value={history.filter((b) => b.status === "checked_out").length}
          label="Past stays"
        />
      </div>

      <section>
        <SectionHead
          title={stay ? "Your stay" : "Upcoming stay"}
          href={upcoming.length > 1 ? "/account/reservations" : null}
        />
        {next ? (
          <UpcomingStay
            booking={next}
            today={today}
            canOrder={Boolean(servicesFor) && servicesFor.id === next.id}
          />
        ) : (
          <div className="rounded-md border border-sand-200 bg-sand-50 p-8 shadow-soft">
            <h3 className="font-display text-[1.5rem] text-forest-950">
              No stay planned yet
            </h3>
            <p className="mt-1 font-label text-ink-600">
              Your next escape is a few clicks away.
            </p>
            <Link href="/cabins" className="btn-primary mt-5">
              Explore cabins
            </Link>
          </div>
        )}
      </section>

      {!isProfileDone && (
        <Link
          href="/account/profile"
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-sand-300 bg-sand-100 px-5 py-4 font-label text-[0.92rem] text-ink-700 hover:border-forest-700"
        >
          <span>
            <span className="font-display text-[1.05rem] text-forest-950">
              Save time at check-in.
            </span>{" "}
            Add your nationality and ID number before you arrive.
          </span>
          <ChevronRightIcon className="h-5 w-5 text-ink-500" />
        </Link>
      )}

      {past.length > 0 && (
        <section>
          <SectionHead title="Past stays" href="/account/reservations" />
          <ul className="space-y-3">
            {past.map((booking) => (
              <PastStay key={booking.id} booking={booking} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
