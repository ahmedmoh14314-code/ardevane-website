"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { toDay, toISODate } from "../_lib/stay";

// The guests a cabin filter is named after on the cabins page
function capacityFor(guests) {
  if (guests <= 3) return "small";
  if (guests <= 7) return "medium";
  return "large";
}

const fieldClass =
  "block w-full bg-transparent font-display text-[1.05rem] text-forest-950 focus:outline-none";

function Field({ label, children }) {
  return (
    <label className="block border-b border-sand-300 px-1 pb-2.5 pt-1 md:border-b-0 md:border-r md:px-5 md:py-1">
      <span className="mb-1 block font-label text-[0.72rem] uppercase tracking-[0.18em] text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

// Dates and guests over the hero photo. It takes the guest to the cabins
// that fit, where they pick a cabin and see its free nights. The dates and
// guests go along: a new search always replaces the last one.
function HeroSearch() {
  const router = useRouter();
  const { setRange, setGuests: rememberGuests } = useReservation();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);

  function search(e) {
    e.preventDefault();
    const hasStay = from && to && to > from;
    setRange(
      hasStay
        ? { from: toDay(from), to: toDay(to) }
        : { from: undefined, to: undefined }
    );
    rememberGuests(guests);

    const params = new URLSearchParams({ capacity: capacityFor(guests) });
    router.push(`/cabins?${params}`);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      onSubmit={search}
      className="grid gap-4 rounded-md bg-sand-50 p-4 shadow-lift md:grid-cols-[1fr_1fr_0.8fr_auto] md:items-center md:gap-0 md:p-3"
    >
      <Field label="Check in">
        <input
          type="date"
          value={from}
          min={today}
          onChange={(e) => {
            setFrom(e.target.value);
            // A departure before the new arrival is picked again
            if (to && e.target.value && to <= e.target.value) setTo("");
          }}
          className={fieldClass}
        />
      </Field>

      <Field label="Check out">
        <input
          type="date"
          value={to}
          min={from ? toISODate(addDays(toDay(from), 1)) : today}
          onChange={(e) => setTo(e.target.value)}
          className={fieldClass}
        />
      </Field>

      <Field label="Guests">
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className={fieldClass}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </Field>

      <button className="btn-forest md:ml-3">Search cabins</button>
    </form>
  );
}

export default HeroSearch;
