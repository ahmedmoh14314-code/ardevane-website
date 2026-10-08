"use client";

import { useEffect } from "react";
import {
  differenceInDays,
  isAfter,
  isBefore,
  isSameDay,
  startOfToday,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";
import { nextRange, pickableRange } from "../_lib/stay";

// takenNights are the nights other guests have. Their departure day is free,
// so a new guest can arrive on it; and the first taken night after a picked
// arrival can still be the new guest's departure day.
function DateSelector({ settings, cabin, takenNights }) {
  const { range, setRange, resetRange } = useReservation();
  const { minBookingLength, maxBookingLength } = settings;

  const isComplete = Boolean(range.from && range.to);
  const picked = pickableRange(range, takenNights, settings);

  // Dates remembered from another cabin, or from the home page search, that
  // this cabin can't have are let go, so the guest picks again from clean
  useEffect(
    function () {
      if (isComplete && !picked.from) resetRange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isComplete, picked.from]
  );

  const numNights = picked.from ? differenceInDays(picked.to, picked.from) : 0;
  const isPickingDeparture = Boolean(range.from && !range.to);

  function isDisabled(day) {
    if (isBefore(day, startOfToday())) return true;

    // While the departure is picked, a stay too short can't be ended; a
    // click past a taken night, or too far away, starts a new stay there
    if (isPickingDeparture && isAfter(day, range.from)) {
      if (differenceInDays(day, range.from) < minBookingLength) return true;
      // Leaving on the morning the next guest arrives is fine
      const firstTaken = takenNights
        .map((night) => new Date(night))
        .filter((night) => isAfter(night, range.from))
        .sort((a, b) => a - b)[0];
      if (firstTaken && isSameDay(day, firstTaken)) return false;
    }

    return takenNights.some((night) => isSameDay(new Date(night), day));
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <DayPicker
          className="w-fit"
          mode="range"
          onSelect={(_, day) =>
            setRange(nextRange(range, day, takenNights, settings))
          }
          selected={isPickingDeparture ? range : picked}
          fromMonth={new Date()}
          fromDate={new Date()}
          toYear={new Date().getFullYear() + 5}
          captionLayout="dropdown"
          numberOfMonths={2}
          disabled={isDisabled}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
        <p className="font-label text-[0.85rem] text-ink-600">
          {isPickingDeparture
            ? `Now pick your departure day, ${minBookingLength} nights or more.`
            : `Stays of ${minBookingLength} to ${maxBookingLength} nights. Faded days are taken.`}
          {numNights > 0 &&
            ` · ${numNights} ${numNights === 1 ? "night" : "nights"} picked, ${formatCurrency(getNightlyPrice(cabin))} a night.`}
        </p>

        {(range.from || range.to) && (
          <button
            onClick={resetRange}
            className="pill pill-off min-h-[2.4rem] px-4"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
