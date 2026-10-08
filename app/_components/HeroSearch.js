"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { addDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { toDay, toISODate } from "../_lib/stay";

// The guests a cabin filter is named after on the cabins page
function capacityFor(guests) {
  if (guests <= 3) return "small";
  if (guests <= 7) return "medium";
  return "large";
}

// A date that reads "Check in" until one is picked: a text field that
// becomes the browser's date picker when it is used
function DateField({ value, min, onChange, placeholder }) {
  const [isPicking, setIsPicking] = useState(false);

  return (
    <input
      type={isPicking || value ? "date" : "text"}
      value={value}
      min={min}
      placeholder={placeholder}
      aria-label={placeholder}
      onFocus={() => setIsPicking(true)}
      onBlur={() => setIsPicking(false)}
      onChange={(e) => onChange(e.target.value)}
      className={`${isPicking || value ? "w-[7.4rem]" : "w-[5.4rem]"} bg-transparent font-display text-[1rem] text-ink-600 placeholder:text-ink-600 focus:outline-none`}
    />
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
      className="grid gap-4 rounded-md bg-sand-50/95 p-4 shadow-lift backdrop-blur md:grid-cols-[1.2fr_1fr_auto] md:items-center md:gap-0 md:p-3"
    >
      <label className="flex items-center gap-4 px-3 md:border-r md:border-sand-300">
        <CalendarIcon className="h-6 w-6 shrink-0 text-ink-700" />
        <span className="flex flex-1 flex-col">
          <span className="font-display text-sm text-ink-700">Dates</span>
          <span className="flex items-center gap-2 font-display text-ink-600">
            <DateField
              value={from}
              min={today}
              onChange={(value) => {
                setFrom(value);
                // A departure before the new arrival is picked again
                if (to && value && to <= value) setTo("");
              }}
              placeholder="Check in"
            />
            <span>&ndash;</span>
            <DateField
              value={to}
              min={from ? toISODate(addDays(toDay(from), 1)) : today}
              onChange={setTo}
              placeholder="Check out"
            />
          </span>
        </span>
      </label>

      <label className="flex items-center gap-4 px-3 md:px-6">
        <UsersIcon className="h-6 w-6 shrink-0 text-ink-700" />
        <span className="flex flex-1 flex-col">
          <span className="font-display text-sm text-ink-700">Guests</span>
          <span className="relative flex items-center">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full appearance-none bg-transparent pr-6 font-display text-ink-600 focus:outline-none"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-0 h-4 w-4 text-ink-600" />
          </span>
        </span>
      </label>

      <button className="btn-forest h-[3.25rem] px-10 md:ml-3">
        Search cabins
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

export default HeroSearch;
