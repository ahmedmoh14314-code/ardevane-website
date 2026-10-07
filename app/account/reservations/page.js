import Link from "next/link";
import ReservationList from "@/app/_components/ReservationList";
import { getGuest } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const guest = await getGuest();
  const bookings = await getBookings(guest.id);

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow mb-2">Guest area</p>
        <h1 className="page-title">Your reservations</h1>
      </header>

      {bookings.length === 0 ? (
        <div className="card p-8">
          <p className="mb-6 text-ink-600">You have no reservations yet.</p>
          <Link href="/cabins" className="btn-primary">
            Explore the cabins
          </Link>
        </div>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
