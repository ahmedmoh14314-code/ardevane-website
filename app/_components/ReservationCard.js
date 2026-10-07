import Link from "next/link";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  endOfDay,
  format,
  formatDistance,
  isPast,
  isToday,
  parseISO,
} from "date-fns";
import DeleteReservation from "./DeleteReservation";
import StatusTag from "./StatusTag";
import { formatCurrency } from "../_lib/pricing";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, onDelete }) {
  const {
    id,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    hasBreakfast,
    isPaid,
    status,
    created_at,
    cabins: { name, image },
  } = booking;

  // Changes are open until the arrival day is over, or until the front desk
  // checks the guest in. actions.js applies the same rule.
  const canChange =
    status === "unconfirmed" && !isPast(endOfDay(new Date(startDate)));

  return (
    <li className="card flex flex-col overflow-hidden sm:flex-row">
      <div className="relative aspect-[16/9] sm:aspect-auto sm:w-44">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          sizes="(min-width: 640px) 11rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-2xl text-brand-900">
            {numNights} nights in Cabin {name}
          </h3>

          <div className="flex gap-2">
            <StatusTag status={status} />
            <StatusTag status={isPaid ? "paid" : "due"} />
          </div>
        </div>

        <p className="text-ink-600">
          {format(new Date(startDate), "EEE, MMM d yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM d yyyy")}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <p className="text-lg font-semibold text-ink-800">
            {formatCurrency(totalPrice)}
          </p>
          <p className="text-ink-500">
            {numGuests} guest{numGuests > 1 && "s"}
            {hasBreakfast && " · breakfast included"}
          </p>
          <p className="text-ink-400 sm:ml-auto">
            #{id} &middot; booked {format(new Date(created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {canChange && (
        <div className="flex border-t border-cream-200 sm:w-32 sm:flex-col sm:border-l sm:border-t-0">
          <Link
            href={`/account/reservations/edit/${id}`}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>Edit</span>
          </Link>
          <DeleteReservation bookingId={id} onDelete={onDelete} />
        </div>
      )}
    </li>
  );
}

export default ReservationCard;
