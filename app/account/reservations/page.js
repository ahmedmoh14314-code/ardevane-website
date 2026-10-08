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
      <header className="mb-6">
        <h1 className="page-title">Reservations</h1>
      </header>

      {bookings.length === 0 ? (
        <div className="card p-6 sm:p-8">
          <p className="mb-5 font-display text-[1.15rem] text-ink-700">
            You have no reservations yet.
          </p>
          <Link href="/cabins" className="btn-forest w-full sm:w-auto">
            Explore the cabins
          </Link>
        </div>
      ) : (
        <ReservationList bookings={bookings} today={today} />
      )}
    </div>
  );
}
