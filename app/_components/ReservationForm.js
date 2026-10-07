"use client";

import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/actions";
import { formatCurrency, getBookingPrice } from "../_lib/pricing";
import SubmitButton from "./SubmitButton";
import GuestAvatar from "./GuestAvatar";
import FormError from "./FormError";

function ReservationForm({ cabin, settings, user }) {
  const { range, resetRange } = useReservation();
  const [numGuests, setNumGuests] = useState(1);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [error, setError] = useState("");

  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);

  const startDate = range.from;
  const endDate = range.to;
  const hasDates = Boolean(startDate && endDate);
  const numNights = hasDates ? differenceInDays(endDate, startDate) : 0;

  // Only for showing the guest. The server works the price out again.
  const { cabinPrice, extrasPrice, totalPrice } = getBookingPrice({
    cabin,
    numNights,
    numGuests,
    hasBreakfast,
    breakfastPrice: settings.breakfastPrice,
  });

  const createBookingWithData = createBooking.bind(null, {
    cabinId: cabin.id,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  });

  async function handleSubmit(formData) {
    setError("");

    // Comes back only when something is wrong. A saved booking redirects.
    const result = await createBookingWithData(formData);

    if (result?.error) return setError(result.error);

    resetRange();
  }

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-cream-200 px-6 py-4 text-sm sm:px-8">
        <GuestAvatar user={user} />
        <p className="text-ink-600">
          Booking as <span className="font-medium text-ink-800">{user.name}</span>
        </p>
      </div>

      <form action={handleSubmit} className="flex flex-1 flex-col gap-5 px-6 py-6 sm:px-8">
        <div>
          <label htmlFor="numGuests" className="label">
            Guests
          </label>
          <select
            name="numGuests"
            id="numGuests"
            value={numGuests}
            onChange={(e) => setNumGuests(Number(e.target.value))}
            className="field"
            required
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-200 p-4 transition-colors hover:border-brand-200 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
          <input
            type="checkbox"
            name="hasBreakfast"
            checked={hasBreakfast}
            onChange={(e) => setHasBreakfast(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand-600"
          />
          <span>
            <span className="block font-medium text-ink-800">
              Add breakfast
            </span>
            <span className="text-sm text-ink-500">
              {formatCurrency(settings.breakfastPrice)} per guest, per night,
              brought to your cabin
            </span>
          </span>
        </label>

        <div>
          <label htmlFor="observations" className="label">
            Anything we should know?
          </label>
          <textarea
            name="observations"
            id="observations"
            rows={3}
            maxLength={1000}
            className="field resize-none"
            placeholder="Pets, allergies, a late arrival, a special occasion…"
          />
        </div>

        {hasDates ? (
          <dl className="space-y-2 rounded-xl bg-cream-50 p-4 text-sm">
            <div className="flex justify-between text-ink-600">
              <dt>
                {format(startDate, "MMM d")} &ndash; {format(endDate, "MMM d")}{" "}
                &middot; {numNights} nights
              </dt>
              <dd>{formatCurrency(cabinPrice)}</dd>
            </div>

            {hasBreakfast && (
              <div className="flex justify-between text-ink-600">
                <dt>Breakfast</dt>
                <dd>{formatCurrency(extrasPrice)}</dd>
              </div>
            )}

            <div className="flex justify-between border-t border-cream-200 pt-2 text-base font-semibold text-ink-800">
              <dt>Total, paid on arrival</dt>
              <dd>{formatCurrency(totalPrice)}</dd>
            </div>
          </dl>
        ) : (
          <p className="rounded-xl bg-cream-50 p-4 text-center text-sm text-ink-500">
            Pick your arrival and departure days on the calendar.
          </p>
        )}

        <FormError message={error} />

        <SubmitButton
          pendingLabel="Reserving…"
          disabled={!hasDates}
          className="mt-auto w-full"
        >
          Reserve now
        </SubmitButton>
      </form>
    </div>
  );
}

export default ReservationForm;
