import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { getGuest } from "@/app/_lib/auth";
import {
  getBookings,
  getPropertyToday,
  getStayCharges,
  getStayRequests,
} from "@/app/_lib/data-service";
import { sortBookings, stayDay } from "@/app/_lib/account";
import { toDay } from "@/app/_lib/stay";
import StatusTag from "@/app/_components/StatusTag";
import StayHub from "@/app/_components/StayHub";
import StayRequests from "@/app/_components/StayRequests";

export const metadata = {
  title: "My Stay",
};

// The stay, wherever the guest is with it: in it now, about to come (and
// able to order ahead), waiting for the hotel to confirm, or not booked yet
export default async function Page() {
  const [guest, today] = await Promise.all([getGuest(), getPropertyToday()]);
  if (!guest) redirect("/login?next=/my-stay");

  const bookings = await getBookings(guest.id);
  const { stay, upcoming, servicesFor } = sortBookings(bookings, today);
  const shown = servicesFor ?? upcoming[0] ?? null;

  const [charges, requests] = servicesFor
    ? await Promise.all([
        getStayCharges(servicesFor.id),
        getStayRequests(servicesFor.id),
      ])
    : [[], []];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-14 pt-7 sm:px-8 sm:pb-20 sm:pt-10">
      <header className="mb-5 sm:mb-7">
        <h1 className="page-title">My Stay</h1>
        <p className="mt-2 font-label text-[0.95rem] text-ink-600 sm:text-[1.02rem]">
          {stay
            ? "Everything for your stay, brought to your cabin."
            : servicesFor
              ? "Order ahead. It will be ready when you arrive."
              : "Your stay, once you have booked one."}
        </p>
      </header>

      {shown ? (
        <StayCard booking={shown} today={today} />
      ) : (
        <div className="rounded-md border border-sand-200 bg-sand-100/70 p-6 shadow-soft sm:p-8">
          <p className="max-w-xl font-display text-[1.15rem] text-ink-700">
            Book a cabin and this becomes your stay: food to your cabin,
            housekeeping, help from our team and your charges.
          </p>
          <Link href="/cabins" className="btn-forest mt-5 w-full sm:w-auto">
            Explore cabins
          </Link>
        </div>
      )}

      {servicesFor && (
        <div className="mt-6 sm:mt-8">
          <StayHub folio={servicesFor.folio} charges={charges} />
        </div>
      )}

      {/* A request the hotel hasn't answered yet has no services */}
      {shown && !servicesFor && (
        <p className="mt-5 rounded-md border border-sand-200 bg-sand-100/70 p-5 font-display text-[1.05rem] text-ink-700">
          We are confirming your booking. Once it is confirmed, you can order
          food and ask for anything right here.
        </p>
      )}

      {requests.length > 0 && (
        <div className="mt-9 sm:mt-12">
          <StayRequests requests={requests} />
        </div>
      )}
    </div>
  );
}

// The stay in a line: the cabin, the days, and where you are in it
function StayCard({ booking, today }) {
  const { id, startDate, endDate, numGuests, status, cabins } = booking;
  const isStaying = status === "checked_in";
  const day = isStaying ? stayDay(booking, today) : null;

  const start = toDay(startDate);
  const end = toDay(endDate);
  const sameMonth = start.getMonth() === end.getMonth();
  const dates = `${format(start, "MMM d")} – ${format(end, sameMonth ? "d, yyyy" : "MMM d, yyyy")}`;

  return (
    <section className="overflow-hidden rounded-md border border-sand-200 bg-sand-50 shadow-soft sm:flex">
      <div className="relative aspect-[16/8] sm:aspect-auto sm:w-60 sm:shrink-0">
        <Image
          src={cabins.image}
          alt={`Cabin ${cabins.name}`}
          fill
          sizes="(min-width: 640px) 15rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-[1.5rem] leading-tight text-forest-950">
              Cabin {cabins.name}
            </h2>
            <StatusTag status={status} />
          </div>
          <p className="mt-1.5 font-label text-[0.92rem] text-ink-700">
            {dates}
            <span className="mx-2 text-ink-400">·</span>
            {numGuests} {numGuests === 1 ? "guest" : "guests"}
            {day && (
              <>
                <span className="mx-2 text-ink-400">·</span>
                {day.isDepartureDay
                  ? "Departure day"
                  : `Day ${day.day} of ${day.of}`}
              </>
            )}
          </p>
        </div>

        <Link
          href={`/account/reservations/${id}`}
          className="btn-outline min-h-[2.6rem] shrink-0 px-5 text-[0.98rem]"
        >
          Reservation details
        </Link>
      </div>
    </section>
  );
}
