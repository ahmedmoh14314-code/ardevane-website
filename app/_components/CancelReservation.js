"use client";

import { useEffect, useState, useTransition } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import SpinnerMini from "./SpinnerMini";

// Two taps instead of a browser pop-up: the first asks, the second cancels.
// The reservation stays on record, marked cancelled.
function CancelReservation({ bookingId, onCancel }) {
  const [isPending, startTransition] = useTransition();
  const [isAsking, setIsAsking] = useState(false);

  // The question goes away on its own if the guest changes their mind
  useEffect(
    function () {
      if (!isAsking) return;

      const timer = setTimeout(() => setIsAsking(false), 4000);
      return () => clearTimeout(timer);
    },
    [isAsking]
  );

  function handleClick() {
    if (!isAsking) return setIsAsking(true);

    startTransition(() => onCancel(bookingId));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex min-w-[6.5rem] items-center justify-center gap-2 rounded-[3px] border px-4 py-2 font-display text-[0.98rem] transition-colors ${
        isAsking
          ? "border-[#9b3b23] bg-[#9b3b23] text-white hover:bg-[#7d2e1a]"
          : "border-sand-300 bg-white text-ink-700 hover:border-[#9b3b23] hover:text-[#9b3b23]"
      }`}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <>
          <XCircleIcon className="h-4 w-4" />
          <span>{isAsking ? "Sure?" : "Cancel"}</span>
        </>
      )}
    </button>
  );
}

export default CancelReservation;
