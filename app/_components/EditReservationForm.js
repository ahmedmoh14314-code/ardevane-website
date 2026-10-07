"use client";

import { useState } from "react";
import { updateBooking } from "../_lib/actions";
import { formatCurrency } from "../_lib/pricing";
import SubmitButton from "./SubmitButton";
import FormError from "./FormError";

// The number of guests and the notes. The dates and the price stay as they
// are; to move the dates, cancel and book again.
function EditReservationForm({ booking, settings }) {
  const [error, setError] = useState("");

  const cabin = booking.cabins;
  const maxGuests = Math.min(cabin.maxCapacity, settings.maxGuestsPerBooking);

  async function handleSubmit(formData) {
    setError("");

    // Comes back only when something is wrong. Saving redirects.
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
          defaultValue={booking.numGuests}
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
          Total{" "}
          <span className="text-xl font-semibold text-ink-800">
            {formatCurrency(booking.totalPrice)}
          </span>
        </p>

        <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}

export default EditReservationForm;
