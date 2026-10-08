"use client";

import Link from "next/link";
import { differenceInDays, format } from "date-fns";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getNightlyPrice, getStayPrice } from "../_lib/pricing";
import { pickableRange, reviewPath } from "../_lib/stay";

function DateBox({ label, date }) {
  return (
    <a
      href="#availability"
      className="flex flex-1 items-center justify-between gap-2 rounded-[3px] border border-sand-300 bg-white px-3.5 py-2.5 transition-colors hover:border-forest-700"
    >
      <span>
        <span className="block font-label text-[0.72rem] text-ink-500">
          {label}
        </span>
        <span className="block font-display text-[1rem] text-ink-800">
          {date ? format(date, "MMM d, yyyy") : "Add date"}
        </span>
      </span>
      <CalendarIcon className="h-5 w-5 shrink-0 text-ink-600" />
    </a>
  );
}

// The price, the dates picked on the calendar, the guests, and on to the
// review page. Nothing is booked until the guest confirms there. Only a stay
// this cabin can have is carried on, the same check the calendar makes.
function BookingCard({ cabin, settings, takenNights }) {
  const { range: picked, guests, setGuests } = useReservation();
  const range = pickableRange(picked, takenNights, settings);

  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);
  // The number from the search, as many as this cabin takes, or two
  const numGuests = Math.min(guests ?? 2, maxGuests);
  const hasDates = Boolean(range.from && range.to);
  const numNights = hasDates ? differenceInDays(range.to, range.from) : 0;

  return (
    <div className="rounded-md border border-sand-200 bg-sand-100/70 p-5 shadow-soft sm:p-6">
      <p className="flex items-baseline gap-2 border-b border-sand-200 pb-4 font-display">
        <span
          className={`text-[2.1rem] leading-none ${
            cabin.discount > 0 ? "text-[#2d8663]" : "text-forest-950"
          }`}
        >
          {formatCurrency(getNightlyPrice(cabin))}
        </span>
        <span className="text-ink-600">per night</span>
        {cabin.discount > 0 && (
          <s className="ml-auto text-ink-400">
            {formatCurrency(cabin.regularPrice)}
          </s>
        )}
      </p>

      <div className="mt-4 flex gap-2.5">
        <DateBox label="Check in" date={range.from} />
        <DateBox label="Check out" date={range.to} />
      </div>

      <label className="relative mt-2.5 flex items-center gap-3 rounded-[3px] border border-sand-300 bg-white px-3.5 py-2.5 transition-colors hover:border-forest-700">
        <UserIcon className="h-5 w-5 text-ink-600" />
        <span className="flex-1">
          <span className="block font-label text-[0.72rem] text-ink-500">
            Guests
          </span>
          <select
            value={numGuests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full appearance-none bg-transparent font-display text-[1rem] text-ink-800 focus:outline-none"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </span>
        <ChevronDownIcon className="pointer-events-none h-4 w-4 text-ink-600" />
      </label>

      {hasDates && (
        <dl className="mt-4 flex justify-between border-t border-sand-200 pt-4 font-display text-ink-800">
          <dt>
            {numNights} {numNights === 1 ? "night" : "nights"}
          </dt>
          <dd className="text-lg">
            {formatCurrency(getStayPrice(cabin, numNights))}
          </dd>
        </dl>
      )}

      {hasDates ? (
        <Link
          href={reviewPath({
            cabinId: cabin.id,
            from: range.from,
            to: range.to,
            guests: numGuests,
          })}
          className="btn-forest mt-4 w-full py-3.5"
        >
          Review reservation
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <a href="#availability" className="btn-forest mt-4 w-full py-3.5">
          Check availability
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      )}

      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 font-label text-[0.78rem] text-ink-600">
        <li className="flex items-center gap-1.5">
          <CheckCircleIcon className="h-4 w-4" />
          Free cancellation until the day before
        </li>
        <li className="flex items-center gap-1.5">
          <CheckCircleIcon className="h-4 w-4" />
          Pay at the cabin
        </li>
      </ul>
    </div>
  );
}

export default BookingCard;
