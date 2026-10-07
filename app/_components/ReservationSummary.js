"use client";

import { useState } from "react";
import Link from "next/link";
import { differenceInDays, format } from "date-fns";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getStayPrice } from "../_lib/pricing";
import { reviewPath } from "../_lib/stay";

// Guests and the price so far, then on to the review page. Everything the
// reservation needs goes into the review page's address.
function ReservationSummary({ cabin, settings }) {
  const { range } = useReservation();
  const [numGuests, setNumGuests] = useState(1);

  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);

  const hasDates = Boolean(range.from && range.to);
  const numNights = hasDates ? differenceInDays(range.to, range.from) : 0;

  return (
    <div className="flex flex-col gap-5 bg-white px-6 py-6 sm:px-8">
      <div>
        <label htmlFor="numGuests" className="label">
          Guests
        </label>
        <select
          id="numGuests"
          value={numGuests}
          onChange={(e) => setNumGuests(Number(e.target.value))}
          className="field"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((x) => (
            <option value={x} key={x}>
              {x} {x === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>

      {hasDates ? (
        <dl className="space-y-2 rounded-xl bg-cream-50 p-4 text-sm">
          <div className="flex justify-between text-ink-600">
            <dt>
              {format(range.from, "MMM d")} &ndash; {format(range.to, "MMM d")}{" "}
              &middot; {numNights} nights
            </dt>
            <dd>{formatCurrency(getStayPrice(cabin, numNights))}</dd>
          </div>

          <div className="flex justify-between border-t border-cream-200 pt-2 text-base font-semibold text-ink-800">
            <dt>Total, paid at the cabin</dt>
            <dd>{formatCurrency(getStayPrice(cabin, numNights))}</dd>
          </div>
        </dl>
      ) : (
        <p className="rounded-xl bg-cream-50 p-4 text-center text-sm text-ink-500">
          Pick your arrival and departure days on the calendar.
        </p>
      )}

      <p className="text-sm text-ink-500">
        Nothing to pay now. Free changes and cancellation until the day before
        you arrive.
      </p>

      {hasDates ? (
        <Link
          href={reviewPath({
            cabinId: cabin.id,
            from: range.from,
            to: range.to,
            guests: numGuests,
          })}
          className="btn-primary mt-auto w-full py-3.5"
        >
          Review reservation
        </Link>
      ) : (
        <button disabled className="btn-primary mt-auto w-full py-3.5">
          Review reservation
        </button>
      )}
    </div>
  );
}

export default ReservationSummary;
