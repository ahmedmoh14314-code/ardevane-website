"use client";

import {
  differenceInDays,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfToday,
  subDays,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";

// Does the picked stay run over a night someone else has?
function isAlreadyBooked(range, takenNights) {
  return (
    range.from &&
    range.to &&
    takenNights.some((night) =>
      isWithinInterval(night, { start: range.from, end: subDays(range.to, 1) })
    )
  );
}

// takenNights are the nights other guests have. Their departure day is free,
// so a new guest can arrive on it; and the first taken night after a picked
// arrival can still be the new guest's departure day.
function DateSelector({ settings, cabin, takenNights }) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, takenNights) ? {} : range;

  const numNights =
    displayRange.from && displayRange.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;

  const { minBookingLength, maxBookingLength } = settings;

  const firstTakenAfterArrival =
    range.from && !range.to
      ? takenNights
          .filter((night) => night > range.from)
          .sort((a, b) => a - b)[0]
      : null;

  function isDisabled(day) {
    if (isBefore(day, startOfToday())) return true;

    const isTaken = takenNights.some((night) => isSameDay(night, day));
    if (!isTaken) return false;

    // Leaving on the morning the next guest arrives is fine
    return !(firstTakenAfterArrival && isSameDay(day, firstTakenAfterArrival));
  }

  return (
    <div className="flex flex-col border-b border-cream-200 lg:border-b-0 lg:border-r">
      <div className="flex-1 overflow-x-auto px-4 py-8 sm:px-8">
        <DayPicker
          className="mx-auto w-fit"
          mode="range"
          onSelect={setRange}
          selected={displayRange}
          min={minBookingLength + 1}
          max={maxBookingLength}
          fromMonth={new Date()}
          fromDate={new Date()}
          toYear={new Date().getFullYear() + 5}
          captionLayout="dropdown"
          numberOfMonths={2}
          disabled={isDisabled}
        />

        <p className="mt-4 text-center text-sm text-ink-500">
          Stays of {minBookingLength} to {maxBookingLength} nights. Faded days
          are already taken.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-50 px-6 py-4 sm:px-8">
        <p className="text-ink-700">
          <span className="text-xl font-semibold text-ink-800">
            {formatCurrency(getNightlyPrice(cabin))}
          </span>{" "}
          / night
          {numNights > 0 && (
            <span className="ml-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-700">
              &times; {numNights} {numNights === 1 ? "night" : "nights"}
            </span>
          )}
        </p>

        {(range.from || range.to) && (
          <button
            onClick={resetRange}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
