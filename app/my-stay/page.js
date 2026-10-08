import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLongRightIcon,
  ChevronRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import pineBranch from "@/public/img/home/pine-branch.png";
import { getGuest } from "@/app/_lib/auth";
import {
  getBookings,
  getPropertyToday,
  getStayCharges,
  getStayRequests,
} from "@/app/_lib/data-service";
import { sortBookings } from "@/app/_lib/account";
import { toDay } from "@/app/_lib/stay";
import StayHub from "@/app/_components/StayHub";
import StayRequests from "@/app/_components/StayRequests";

export const metadata = {
  title: "My Stay",
};

const statusLabels = {
  checked_in: "Checked In",
  reserved: "Confirmed",
  pending: "Awaiting confirmation",
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
    <div className="relative overflow-hidden">
      {/* A sprig of pine in the corner, as in the rest of Ardevane */}
      <Image
        src={pineBranch}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-4 hidden w-[17rem] opacity-80 md:block"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        <header className="mb-6 sm:mb-8">
          <h1 className="font-display text-[2.5rem] leading-none text-forest-950 sm:text-[3.6rem]">
            My Stay
          </h1>
          <p className="mt-3 font-label text-[0.98rem] text-ink-700 sm:text-[1.05rem]">
            Make your stay more comfortable.
          </p>
        </header>

        {shown ? (
          <StayCard booking={shown} />
        ) : (
          <div className="rounded-md border border-sand-200 bg-sand-100/70 p-8 shadow-soft">
            <h2 className="font-display text-[1.7rem] text-forest-950">
              No stay booked yet
            </h2>
            <p className="mt-2 max-w-xl font-display text-ink-600">
              Book a cabin and this becomes your stay: breakfast to your cabin,
              housekeeping, help from our team and your charges, even before you
              arrive.
            </p>
            <Link href="/cabins" className="btn-forest mt-6">
              Explore cabins
              <ArrowLongRightIcon className="h-5 w-5" />
            </Link>
          </div>
        )}

        {servicesFor && (
          <div className="mt-5 sm:mt-6">
            <StayHub folio={servicesFor.folio} charges={charges} />
          </div>
        )}

        {/* A request the hotel hasn't answered yet has no services */}
        {shown && !servicesFor && (
          <p className="mt-6 rounded-md border border-sand-200 bg-sand-100/70 p-5 font-display text-ink-700">
            We&apos;re confirming your booking. Once it&apos;s confirmed, you
            can order breakfast and ask for anything you&apos;d like ready,
            right here.
          </p>
        )}

        {requests.length > 0 && (
          <div className="mt-8">
            <StayRequests requests={requests} />
          </div>
        )}

        {stay === null && servicesFor && (
          <p className="mt-6 text-center font-label text-sm text-ink-500">
            Your stay hasn&apos;t started yet: anything you ask for now will be
            ready when you arrive.
          </p>
        )}
      </div>
    </div>
  );
}

function StayCard({ booking }) {
  const { id, startDate, endDate, numGuests, status, cabins } = booking;
  const isCheckedIn = status === "checked_in";

  return (
    <section className="rounded-md border border-sand-200 bg-sand-100/70 p-3 shadow-soft sm:p-4">
      <Link
        href={`/account/reservations/${id}`}
        className="flex items-center gap-4 sm:gap-7"
      >
        <div className="relative h-[5.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-[3px] sm:h-[6.5rem] sm:w-[18.5rem]">
          <Image
            src={cabins.image}
            alt={`Cabin ${cabins.name}`}
            fill
            sizes="(min-width: 640px) 18.5rem, 6.5rem"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h2 className="font-display text-[1.2rem] text-forest-950 sm:text-[1.45rem]">
              Cabin {cabins.name}
            </h2>
            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label text-[0.72rem] font-medium sm:px-3 sm:text-[0.8rem] ${
                isCheckedIn
                  ? "bg-[#e2efe6] text-[#1d5a3d]"
                  : status === "pending"
                    ? "bg-[#f8ecd2] text-[#8a5a12]"
                    : "bg-sand-200 text-ink-700"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {statusLabels[status] ?? status}
            </span>
          </div>

          <p className="mt-1 flex items-center gap-2 font-label text-[0.85rem] text-ink-700 sm:mt-2 sm:gap-3 sm:text-[0.98rem]">
            {format(toDay(startDate), "MMM d, yyyy")}
            <ArrowLongRightIcon className="h-4 w-4" />
            {format(toDay(endDate), "MMM d, yyyy")}
          </p>

          <div className="mt-1 flex items-center justify-between gap-3 sm:mt-2">
            <p className="flex items-center gap-1.5 font-label text-[0.8rem] text-ink-600 sm:text-[0.9rem]">
              <UserIcon className="h-4 w-4" />
              {numGuests} {numGuests === 1 ? "Guest" : "Guests"}
            </p>
            <span className="hidden rounded-[3px] border border-forest-900 px-5 py-2 font-label text-[0.9rem] text-forest-900 transition-colors hover:bg-forest-900 hover:text-sand-50 sm:inline-block">
              View Reservation
            </span>
          </div>
        </div>

        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-600 sm:hidden" />
      </Link>
    </section>
  );
}
