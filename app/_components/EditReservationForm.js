"use client";

import { useState } from "react";
import { updateBooking } from "../_lib/actions";
import { formatCurrency, getBookingPrice } from "../_lib/pricing";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";

function EditReservationForm({ booking, settings }) {
  const [numGuests, setNumGuests] = useState(booking.numGuests);
  const [hasBreakfast, setHasBreakfast] = useState(booking.hasBreakfast);
  const [error, setError] = useState("");

  const cabin = booking.cabins;
  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);

  // Shown live as the guest changes things. The server works it out again.
  const { totalPrice } = getBookingPrice({
    cabin,
    numNights: booking.numNights,
    numGuests,
    hasBreakfast,
    breakfastPrice: settings.breakfastPrice,
  });

  async function handleSubmit(formData) {
    setError("");

    const result = await updateBooking(formData);

    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="card space-y-6 p-6 sm:p-8">
      <input type="hidden" name="bookingId" value={booking.id} />

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
          <span className="block font-medium text-ink-800">Breakfast</span>
          <span className="text-sm text-ink-500">
            {formatCurrency(settings.breakfastPrice)} per guest, per night
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
          rows={4}
          maxLength={1000}
          defaultValue={booking.observations ?? ""}
          className="field resize-none"
        />
      </div>

      <FormError message={error} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream-200 pt-6">
        <p className="text-ink-600">
          New total{" "}
          <span className="text-xl font-semibold text-ink-800">
            {formatCurrency(totalPrice)}
          </span>
        </p>

        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}

export default EditReservationForm;
