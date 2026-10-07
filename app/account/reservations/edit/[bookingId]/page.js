import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import EditReservationForm from "@/app/_components/EditReservationForm";
import { auth } from "@/app/_lib/auth";
import { getGuestBooking, getSettings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Edit reservation",
};

export default async function Page({ params }) {
  const session = await auth();

  // Somebody else's booking number simply does not exist for this guest
  const [booking, settings] = await Promise.all([
    getGuestBooking(params.bookingId, session.user.guestId),
    getSettings(),
  ]);

  if (!booking) notFound();

  return (
    <div>
      <Link
        href="/account/reservations"
        className="mb-6 inline-block text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        &larr; Your reservations
      </Link>

      <header className="mb-8">
        <p className="eyebrow mb-2">Reservation #{booking.id}</p>
        <h1 className="page-title mb-2">Cabin {booking.cabins.name}</h1>
        <p className="text-ink-600">
          {format(new Date(booking.startDate), "EEE, MMM d")} &ndash;{" "}
          {format(new Date(booking.endDate), "EEE, MMM d, yyyy")} &middot;{" "}
          {booking.numNights} nights
        </p>
      </header>

      <EditReservationForm booking={booking} settings={settings} />
    </div>
  );
}
