"use client";

import { useEffect } from "react";
import { useReservation } from "./ReservationContext";

// Once the stay is booked, the dates picked for it are done with
function ClearPickedDates() {
  const { resetRange } = useReservation();

  useEffect(
    function () {
      resetRange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return null;
}

export default ClearPickedDates;
