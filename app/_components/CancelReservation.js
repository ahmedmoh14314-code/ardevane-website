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
      className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
        isAsking
          ? "bg-[#9b3b23] text-white hover:bg-[#7d2e1a]"
          : "text-ink-600 hover:bg-[#f8e2da] hover:text-[#9b3b23]"
      }`}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <>
          <XCircleIcon className="h-5 w-5" />
          <span>{isAsking ? "Sure?" : "Cancel"}</span>
        </>
      )}
    </button>
  );
}

export default CancelReservation;
