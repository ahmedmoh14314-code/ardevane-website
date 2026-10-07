// Where a guest stands with the hotel, from their bookings. No server or
// browser APIs, so it can be used anywhere and tested on its own.

import { differenceInCalendarDays } from "date-fns";
import { toDay } from "./stay";

// The guest's bookings, sorted the way the account shows them:
//   stay      the booking that is checked in: that is My Stay
//   upcoming  reserved stays still ahead, soonest first
//   history   everything finished, cancelled or missed, newest first
// and the state the account is in: "staying", "upcoming" or "none".
export function sortBookings(bookings = [], today) {
  const byStart = [...bookings].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  const stay = byStart.find((booking) => booking.status === "checked_in");

  const upcoming = byStart.filter(
    (booking) => booking.status === "reserved" && booking.endDate > today
  );

  const history = byStart
    .filter((booking) => booking !== stay && !upcoming.includes(booking))
    .reverse();

  const state = stay ? "staying" : upcoming.length ? "upcoming" : "none";

  return { state, stay: stay ?? null, upcoming, history };
}

// "Day 2 of 5" for a stay: the arrival day is day 1, and the last night is
// the last day. On the departure day it is simply the departure day.
export function stayDay({ startDate, endDate, numNights }, today) {
  const nights =
    numNights ?? differenceInCalendarDays(toDay(endDate), toDay(startDate));
  const day = differenceInCalendarDays(toDay(today), toDay(startDate)) + 1;

  return {
    day: Math.min(Math.max(day, 1), nights),
    of: nights,
    isDepartureDay: today >= endDate,
  };
}
