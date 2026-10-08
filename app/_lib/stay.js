// Small helpers about stays. No server or browser APIs, so they can be used
// anywhere and tested on their own.

import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  isBefore,
  isSameDay,
  parseISO,
} from "date-fns";

// A Date as the database writes a day: "2026-11-02"
export function toISODate(date) {
  return format(date, "yyyy-MM-dd");
}

// The database sends days as "2026-11-02". parseISO reads that as the day
// itself, where the guest is (new Date() would read it in London).
export function toDay(value) {
  return typeof value === "string" ? parseISO(value) : value;
}

// The nights that are taken, from the date ranges the database returns.
// A stay from the 2nd to the 5th takes the nights of the 2nd, 3rd and 4th:
// the 5th is free for the next guest to arrive.
export function takenNights(ranges) {
  return ranges.flatMap(({ start_date, end_date }) =>
    eachDayOfInterval({
      start: toDay(start_date),
      end: addDays(toDay(end_date), -1),
    })
  );
}

// Does a stay from one day to another use a night that is taken? The
// departure day itself is never slept, so it may be taken.
function runsOverTaken(from, to, nights) {
  return nights.some((night) => {
    const day = new Date(night);
    return !isBefore(day, from) && isBefore(day, to);
  });
}

const noRange = {};

// The picked stay, if this cabin can really have it: both days, free
// nights only, and a length the rules allow. Otherwise nothing, so dates
// remembered from another cabin never reach the review page.
export function pickableRange(range, nights, rules) {
  if (!range?.from || !range?.to) return noRange;

  const length = differenceInDays(range.to, range.from);
  if (length < rules.minBookingLength || length > rules.maxBookingLength)
    return noRange;

  return runsOverTaken(range.from, range.to, nights) ? noRange : range;
}

// The stay after a click on the calendar. The first click is the arrival,
// the second the departure. A click once both are picked, or one before
// the arrival, past a taken night or further than the longest stay, starts
// a new stay on that day.
export function nextRange(range, day, nights, rules) {
  if (!range?.from || range.to) return { from: day, to: undefined };
  if (isSameDay(day, range.from)) return noRange;
  if (
    isBefore(day, range.from) ||
    differenceInDays(day, range.from) > rules.maxBookingLength ||
    runsOverTaken(range.from, day, nights)
  )
    return { from: day, to: undefined };

  return { from: range.from, to: day };
}

// The review page for a stay. Everything that defines the reservation lives
// in the address, so it survives signing in (Google and the email link
// both come back to it) and nothing has to be picked twice.
export function reviewPath({ cabinId, from, to, guests }) {
  const params = new URLSearchParams({
    cabin: String(cabinId),
    from: toISODate(toDay(from)),
    to: toISODate(toDay(to)),
    guests: String(guests),
  });

  return `/reserve?${params}`;
}

// Read back what reviewPath wrote. Anything missing or malformed gives
// null; the database still checks every value before booking.
export function readReview(searchParams) {
  const cabinId = Number(searchParams?.cabin);
  const guests = Number(searchParams?.guests);
  const { from, to } = searchParams ?? {};
  const isDay = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");

  if (!Number.isInteger(cabinId) || !Number.isInteger(guests)) return null;
  if (!isDay(from) || !isDay(to)) return null;

  return { cabinId, from, to, guests };
}

// The database's messages, as sentences: one full stop, never two
export function asSentence(text) {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

// A guest can change or cancel online while the stay is reserved (or still
// a request), until the day before arrival. The database applies the same
// rule.
export function canChangeOnline(booking, today = toISODate(new Date())) {
  return (
    (booking.status === "reserved" || booking.status === "pending") &&
    booking.startDate > today
  );
}
