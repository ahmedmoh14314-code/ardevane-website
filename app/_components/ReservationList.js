"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { cancelBooking } from "../_lib/actions";
import { toISODate } from "../_lib/stay";

function ReservationList({ bookings }) {
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

  const today = toISODate(new Date());

  // Reserved and in-house stays that haven't ended come first; finished,
  // cancelled and missed ones below, newest first
  const upcoming = optimisticBookings.filter(
    (booking) =>
      (booking.status === "reserved" || booking.status === "checked_in") &&
      booking.endDate >= today
  );
  const past = optimisticBookings
    .filter((booking) => !upcoming.includes(booking))
    .reverse();

  return (
    <div className="space-y-10">
      {[
        { title: "Upcoming", list: upcoming },
        { title: "Past and cancelled", list: past },
      ].map(
        ({ title, list }) =>
          list.length > 0 && (
            <section key={title}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-500">
                {title} &middot; {list.length}
              </h2>

              <ul className="space-y-4">
                {list.map((booking) => (
                  <ReservationCard
                    booking={booking}
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
