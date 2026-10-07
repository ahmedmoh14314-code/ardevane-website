"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useReservation } from "./ReservationContext";

function ReservationReminder() {
  const { range, resetRange } = useReservation();

  if (!range.from || !range.to) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-rise items-center gap-4 rounded-2xl bg-brand-900 px-6 py-4 text-sm text-cream-100 shadow-lift">
      <p className="flex-1">
        Your dates are still picked:{" "}
        <span className="font-semibold text-gold-300">
          {format(new Date(range.from), "MMM d")} &ndash;{" "}
          {format(new Date(range.to), "MMM d, yyyy")}
        </span>
        . Open a cabin to reserve them.
      </p>
      <button
        className="rounded-full p-1 transition-colors hover:bg-brand-800"
        onClick={resetRange}
        aria-label="Forget these dates"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ReservationReminder;
