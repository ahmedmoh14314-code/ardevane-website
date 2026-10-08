"use client";

import { useOptimistic, useState } from "react";
import ReservationCard from "./ReservationCard";
import { cancelBooking } from "../_lib/actions";
import { sortBookings } from "../_lib/account";

const isClosed = (booking) =>
  booking.status === "cancelled" || booking.status === "no_show";

// The reservations in three tabs: what is ahead (and any stay going on),
// what is behind, and what was called off
function groupBookings(bookings, today) {
  const { upcoming, history } = sortBookings(bookings, today);
  const staying = bookings
    .filter((booking) => booking.status === "checked_in")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const behind = history.filter((booking) => !staying.includes(booking));

  return {
    upcoming: [...staying, ...upcoming],
    past: behind.filter((booking) => !isClosed(booking)),
    cancelled: behind.filter(isClosed),
  };
}

const tabs = [
  { key: "upcoming", label: "Upcoming", empty: "Nothing planned yet." },
  { key: "past", label: "Past", empty: "No past stays yet." },
  { key: "cancelled", label: "Cancelled", empty: "Nothing cancelled." },
];

function ReservationList({ bookings, today }) {
  // A cancelled reservation moves to "Cancelled" at once, while the
  // database catches up
  const [optimisticBookings, optimisticCancel] = useOptimistic(
    bookings,
    (curBookings, bookingId) =>
      curBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
  );

  async function handleCancel(bookingId) {
    optimisticCancel(bookingId);
    await cancelBooking(bookingId);
  }

  const groups = groupBookings(optimisticBookings, today);
  const [tab, setTab] = useState(
    groups.upcoming.length > 0 ? "upcoming" : "past"
  );
  const { empty } = tabs.find(({ key }) => key === tab);

  return (
    <div>
      <div
        role="tablist"
        className="-mx-4 mb-6 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {tabs.map(({ key, label }) => {
          const isActive = key === tab;

          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(key)}
              className={`pill ${isActive ? "pill-on" : "pill-off"}`}
            >
              {label}
              <span
                className={`rounded-full px-2 py-0.5 font-label text-xs ${
                  isActive ? "bg-white/15" : "bg-sand-200 text-ink-600"
                }`}
              >
                {groups[key].length}
              </span>
            </button>
          );
        })}
      </div>

      {groups[tab].length === 0 ? (
        <p className="rounded-md border border-dashed border-sand-300 px-6 py-12 text-center font-display text-[1.1rem] text-ink-600">
          {empty}
        </p>
      ) : (
        <ul className="space-y-4">
          {groups[tab].map((booking) => (
            <ReservationCard
              booking={booking}
              today={today}
              onCancel={handleCancel}
              key={booking.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationList;
