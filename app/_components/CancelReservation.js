"use client";

import { useEffect, useState, useTransition } from "react";
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
      className={`btn-danger min-h-[2.6rem] px-5 text-[0.98rem] ${
        isAsking
          ? "bg-[#9b3b23] text-white hover:bg-[#7d2e1a] hover:text-white"
          : ""
      }`}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <span>{isAsking ? "Yes, cancel it" : "Cancel"}</span>
      )}
    </button>
  );
}

export default CancelReservation;
