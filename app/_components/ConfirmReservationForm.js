"use client";

import { useState } from "react";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import GuestAvatar from "./GuestAvatar";
import FormError from "./FormError";

// The final click. The form carries only which cabin, which days and how many
// guests; the database checks everything again and sets the price.
function ConfirmReservationForm({ stay, user }) {
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setError("");

    // Comes back only when something is wrong. A booking redirects.
    const result = await createBooking(formData);

    if (result?.error) setError(result.error);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <h2 className="font-display text-[1.7rem] leading-tight text-forest-950">
        Send your request
      </h2>

      <input type="hidden" name="cabinId" value={stay.cabinId} />
      <input type="hidden" name="from" value={stay.from} />
      <input type="hidden" name="to" value={stay.to} />
      <input type="hidden" name="guests" value={stay.guests} />

      <div className="flex items-center gap-3 border-b border-sand-200 pb-5 font-label text-[0.92rem]">
        <GuestAvatar user={user} />
        <p className="text-ink-600">
          Booking as{" "}
          <span className="font-medium text-ink-800">{user.name}</span>
        </p>
      </div>

      <div>
        <label htmlFor="observations" className="label">
          Anything we should know?
        </label>
        <textarea
          id="observations"
          name="observations"
          rows={4}
          maxLength={1000}
          className="field resize-none"
          placeholder="Pets, allergies, a late arrival, a special occasion…"
        />
      </div>

      <FormError message={error} />

      <SubmitButton pendingLabel="Sending…" className="w-full">
        Send booking request
      </SubmitButton>

      <p className="text-center font-label text-[0.82rem] leading-relaxed text-ink-500">
        Your nights are held while the front desk confirms. Nothing to pay now.
      </p>
    </form>
  );
}

export default ConfirmReservationForm;
