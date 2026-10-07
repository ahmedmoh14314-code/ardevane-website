"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { cancelBooking } from "../_lib/actions";
import { sortBookings } from "../_lib/account";

const groups = [
  { key: "stay", title: "Staying now" },
  { key: "upcoming", title: "Upcoming" },
  { key: "history", title: "Past stays" },
];

function ReservationList({ bookings, today }) {
  // A cancelled reservation shows as cancelled at once, while the database
  // catches up. It stays in the list, under past stays.
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

  // The stay that is checked in, reservations ahead, then everything else
  const sorted = sortBookings(optimisticBookings, today);
  const lists = {
    stay: sorted.stay ? [sorted.stay] : [],
    upcoming: sorted.upcoming,
    history: sorted.history,
  };

  return (
    <div className="space-y-10">
      {groups.map(
        ({ key, title }) =>
          lists[key].length > 0 && (
            <section key={key}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-500">
                {title} &middot; {lists[key].length}
              </h2>

              <ul className="space-y-4">
                {lists[key].map((booking) => (
                  <ReservationCard
                    booking={booking}
                    today={today}
                    onCancel={handleCancel}
                    key={booking.id}
                  />
                ))}
              </ul>
            </section>
          )
      )}
    </div>
  );
}

export default ReservationList;
