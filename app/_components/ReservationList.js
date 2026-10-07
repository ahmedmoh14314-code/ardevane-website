"use client";

import { useOptimistic } from "react";
import { isPast } from "date-fns";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/actions";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) =>
      curBookings.filter((booking) => booking.id !== bookingId)
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  // Stays still to come (or happening now) first, finished ones below
  const upcoming = optimisticBookings.filter(
    (booking) =>
      booking.status !== "checked-out" && !isPast(new Date(booking.endDate))
  );
  const past = optimisticBookings
    .filter((booking) => !upcoming.includes(booking))
    .reverse();

  return (
    <div className="space-y-10">
      {[
        { title: "Upcoming", list: upcoming },
        { title: "Past stays", list: past },
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
                    onDelete={handleDelete}
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
