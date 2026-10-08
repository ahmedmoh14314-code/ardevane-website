"use client";

import Link from "next/link";
import { differenceInDays, format } from "date-fns";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getNightlyPrice, getStayPrice } from "../_lib/pricing";
import { pickableRange, reviewPath } from "../_lib/stay";

const boxClass =
  "block rounded-[3px] border border-sand-300 bg-white px-3.5 py-2.5 transition-colors hover:border-forest-700";
const smallLabel = "block font-label text-[0.72rem] text-ink-500";

function DateBox({ label, date }) {
  return (
    <a href="#availability" className={`${boxClass} flex-1`}>
      <span className={smallLabel}>{label}</span>
      <span className="block font-display text-[1rem] text-ink-800">
        {date ? format(date, "MMM d, yyyy") : "Pick a day"}
      </span>
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
    <div className="rounded-md border border-sand-200 bg-sand-100/70 p-4 shadow-soft sm:p-6">
      <p className="flex items-baseline gap-2 border-b border-sand-200 pb-4 font-display">
        <span
          className={`text-[2rem] leading-none ${
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

      <label className={`${boxClass} mt-2.5`}>
        <span className={smallLabel}>Guests</span>
        <select
          value={numGuests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent font-display text-[1rem] text-ink-800 focus:outline-none"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
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
          className="btn-forest mt-4 w-full"
        >
          Continue to booking
        </Link>
      ) : (
        <a href="#availability" className="btn-forest mt-4 w-full">
          Pick your dates
        </a>
      )}

      <p className="mt-3 text-center font-label text-[0.8rem] leading-relaxed text-ink-600">
        Nothing to pay now. Free cancellation until the day before.
      </p>

      {/* On phones the calendar is far below the card, so once the days
          are picked the way on follows along at the bottom of the screen */}
      {hasDates && (
        <div className="fixed inset-x-0 bottom-[3.4rem] z-30 border-t border-sand-200 bg-sand-50/95 px-4 py-3 backdrop-blur lg:hidden">
          <Link
            href={reviewPath({
              cabinId: cabin.id,
              from: range.from,
              to: range.to,
              guests: numGuests,
            })}
            className="btn-forest w-full justify-between px-5"
          >
            <span>
              {numNights} {numNights === 1 ? "night" : "nights"} &middot;{" "}
              {formatCurrency(getStayPrice(cabin, numNights))}
            </span>
            <span>Continue</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default BookingCard;
