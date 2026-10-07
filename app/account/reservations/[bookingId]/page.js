import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import StatusTag from "@/app/_components/StatusTag";
import StayFolio from "@/app/_components/StayFolio";
import StayRequests from "@/app/_components/StayRequests";
import { getGuest } from "@/app/_lib/auth";
import {
  getBookings,
  getStayCharges,
  getStayRequests,
} from "@/app/_lib/data-service";
import { toDay } from "@/app/_lib/stay";

export const metadata = {
  title: "Stay details",
};

// A stay, read only: when, where, and its final folio
export default async function Page({ params }) {
  const guest = await getGuest();
  const bookings = await getBookings(guest.id);

  // Somebody else's booking number simply does not exist for this guest
  const booking = bookings.find((item) => String(item.id) === params.bookingId);
  if (!booking) notFound();

  const [charges, requests] = await Promise.all([
    getStayCharges(booking.id),
    getStayRequests(booking.id),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/account/reservations"
        className="inline-block text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        &larr; Your reservations
      </Link>

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <p className="eyebrow">Stay {booking.reference}</p>
          <StatusTag status={booking.status} />
        </div>
        <h1 className="page-title mb-2">Cabin {booking.cabins.name}</h1>
        <p className="text-ink-600">
          {format(toDay(booking.startDate), "EEE, MMM d")} &ndash;{" "}
          {format(toDay(booking.endDate), "EEE, MMM d, yyyy")} &middot;{" "}
          {booking.numNights} nights &middot; {booking.numGuests}{" "}
          {booking.numGuests === 1 ? "guest" : "guests"}
        </p>
      </header>

      <StayFolio folio={booking.folio} charges={charges} />

      {/* What was asked for during the stay, for the record */}
      <StayRequests requests={requests} title="Requests during this stay" />
    </div>
  );
}
