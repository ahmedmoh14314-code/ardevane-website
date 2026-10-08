// Where a guest stands with the hotel, from their bookings. No server or
// browser APIs, so it can be used anywhere and tested on its own.

import { differenceInCalendarDays, eachDayOfInterval, format } from "date-fns";
import { toDay } from "./stay";

// The guest's bookings, sorted the way the account shows them:
//   stay      the booking that is checked in: that is My Stay
//   upcoming  stays still ahead, soonest first: confirmed ones, and
//             requests the hotel hasn't answered yet
//   history   everything finished, cancelled or missed, newest first
// and the state the account is in: "staying", "upcoming" or "none".
export function sortBookings(bookings = [], today) {
  const byStart = [...bookings].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  const stay = byStart.find((booking) => booking.status === "checked_in");

  const upcoming = byStart.filter(
    (booking) =>
      (booking.status === "reserved" || booking.status === "pending") &&
      booking.endDate > today
  );

  const history = byStart
    // A stay still checked in is never history, even a second one
    .filter(
      (booking) =>
        booking.status !== "checked_in" && !upcoming.includes(booking)
    )
    .reverse();

  const state = stay ? "staying" : upcoming.length ? "upcoming" : "none";

  // The booking guests can ask for things on: the stay they are in, or
  // else their next confirmed one. A request not yet approved has none.
  const servicesFor =
    stay ?? upcoming.find((booking) => booking.status === "reserved") ?? null;

  return { state, stay: stay ?? null, upcoming, history, servicesFor };
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

// The days food can be ordered for: from today (or the arrival day, if the
// stay hasn't started) to the departure morning
export function stayDays({ startDate, endDate }, today) {
  const from = startDate > today ? startDate : today;
  if (from > endDate) return [];

  return eachDayOfInterval({ start: toDay(from), end: toDay(endDate) }).map(
    (day) => format(day, "yyyy-MM-dd")
  );
}
