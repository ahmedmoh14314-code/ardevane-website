import Link from "next/link";
import { getGuest, getUser } from "../_lib/auth";
import {
  getBookings,
  getMenu,
  getPropertyToday,
  getStayCharges,
  getStayRequests,
} from "../_lib/data-service";
import { sortBookings } from "../_lib/account";
import MyStay from "../_components/MyStay";
import ReservationList from "../_components/ReservationList";

export const metadata = {
  title: "Guest area",
};

// The account changes with the guest's stay: My Stay while they are checked
// in, their next reservation before that, and a way to book when there is
// nothing planned.
export default async function Page() {
  const [user, guest, today] = await Promise.all([
    getUser(),
    getGuest(),
    getPropertyToday(),
  ]);
  const bookings = await getBookings(guest.id);
  const { state, stay, upcoming, history } = sortBookings(bookings, today);

  // While checked in: the stay's charges, its requests and the menu
  const [charges, requests, menu] = stay
    ? await Promise.all([
        getStayCharges(stay.id),
        getStayRequests(stay.id),
        getMenu(),
      ])
    : [[], [], []];
  const firstName = user.name.split(" ").at(0);
  const isProfileDone = Boolean(guest?.nationality && guest?.nationalID);

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow mb-2">Guest area</p>
        <h1 className="page-title">
          {state === "staying"
            ? `Welcome to Ardevane, ${firstName}`
            : `Welcome, ${firstName}`}
        </h1>
      </header>

      {state === "staying" && (
        <MyStay
          guestName={user.name}
          booking={stay}
          charges={charges}
          requests={requests}
          menu={menu}
          today={today}
        />
      )}

      {state === "upcoming" && (
        <ReservationList bookings={upcoming} today={today} />
      )}

      {state === "none" && (
        <div className="card p-8">
          <h2 className="mb-2 font-display text-2xl text-brand-900">
            No stay planned yet
          </h2>
          <p className="mb-6 text-ink-600">
            Your next escape is a few clicks away.
          </p>
          <Link href="/cabins" className="btn-primary">
            Book a stay
          </Link>
        </div>
      )}

      {/* While staying, the next reservation is still worth a glance */}
      {state === "staying" && upcoming.length > 0 && (
        <ReservationList bookings={upcoming} today={today} />
      )}

      {state !== "staying" && !isProfileDone && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-200 bg-gold-100 p-6">
          <p className="text-ink-700">
            <span className="font-semibold">Save time at check-in.</span> Add
            your nationality and ID number before you arrive.
          </p>
          <Link href="/account/profile" className="btn-secondary">
            Complete profile
          </Link>
        </div>
      )}

      {state === "none" && history.length > 0 && (
        <ReservationList bookings={history} today={today} />
      )}
    </div>
  );
}
