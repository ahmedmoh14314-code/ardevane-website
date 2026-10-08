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
    <form action={handleSubmit} className="card space-y-5 p-5 sm:p-8">
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

      <div className="grid gap-4 border-t border-sand-200 pt-5 sm:flex sm:items-center sm:justify-between">
        <p className="font-display text-[1.05rem] text-ink-600">
          Total{" "}
          <span className="text-[1.3rem] text-forest-950">
            {formatCurrency(booking.totalPrice)}
          </span>
        </p>

        <SubmitButton pendingLabel="Saving…" className="w-full sm:w-auto">
          Save changes
        </SubmitButton>
      </div>
    </form>
  );
}

export default EditReservationForm;
