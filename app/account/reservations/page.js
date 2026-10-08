import Link from "next/link";
import ReservationList from "@/app/_components/ReservationList";
import { getGuest } from "@/app/_lib/auth";
import { getBookings, getPropertyToday } from "@/app/_lib/data-service";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const [guest, today] = await Promise.all([getGuest(), getPropertyToday()]);
  const bookings = await getBookings(guest.id);

  return (
    <div>
      <header className="mb-8">
        <h1 className="page-title">Reservations</h1>
        <p className="mt-2 font-label text-[1rem] text-ink-600">
          Every stay you have booked with us, coming up and before.
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="card p-8">
          <p className="mb-6 text-ink-600">You have no reservations yet.</p>
          <Link href="/cabins" className="btn-primary">
            Explore the cabins
          </Link>
        </div>
      ) : (
        <ReservationList bookings={bookings} today={today} />
      )}
    </div>
  );
}
