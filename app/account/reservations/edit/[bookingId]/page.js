import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import EditReservationForm from "@/app/_components/EditReservationForm";
import { getGuest } from "@/app/_lib/auth";
import { getGuestBooking, getSettings } from "@/app/_lib/data-service";
import { canChangeOnline, toDay } from "@/app/_lib/stay";

export const metadata = {
  title: "Edit reservation",
};

export default async function Page({ params }) {
  const guest = await getGuest();

  // Somebody else's booking number simply does not exist for this guest
  const [booking, settings] = await Promise.all([
    getGuestBooking(params.bookingId, guest.id),
    getSettings(),
  ]);

  if (!booking) notFound();

  return (
    <div>
      <Link
        href="/account/reservations"
        className="mb-6 inline-block font-display text-ink-600 hover:text-forest-900"
      >
        &larr; Your reservations
      </Link>

      <header className="mb-8">
        <p className="eyebrow mb-2">Reservation {booking.reference}</p>
        <h1 className="page-title mb-2">Cabin {booking.cabins.name}</h1>
        <p className="text-ink-600">
          {format(toDay(booking.startDate), "EEE, MMM d")} &ndash;{" "}
          {format(toDay(booking.endDate), "EEE, MMM d, yyyy")} &middot;{" "}
          {booking.numNights} nights
        </p>
      </header>

      {canChangeOnline(booking) ? (
        <EditReservationForm booking={booking} settings={settings} />
      ) : (
        <p className="card p-6 text-ink-600">
          This reservation can no longer be changed online. Please contact the
          front desk.
        </p>
      )}
    </div>
  );
}
