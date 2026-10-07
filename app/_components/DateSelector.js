"use client";

import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();

  // A range that runs over a taken night is dropped
  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const numNights =
    displayRange.from && displayRange.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;

  const { minBookingLength, maxBookingLength } = settings;

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
          disabled={(curDate) =>
            isPast(curDate) ||
            bookedDates.some((date) => isSameDay(date, curDate))
          }
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
          <button onClick={resetRange} className="btn-secondary px-4 py-2 text-sm">
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
