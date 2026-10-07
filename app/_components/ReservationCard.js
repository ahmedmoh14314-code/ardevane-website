import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  DocumentTextIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { format, formatDistance, isToday } from "date-fns";
import CancelReservation from "./CancelReservation";
import StatusTag from "./StatusTag";
import { formatCurrency } from "../_lib/pricing";
import { canChangeOnline, toDay } from "../_lib/stay";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(toDay(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, today, onCancel }) {
  const {
    id,
    reference,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    folio,
    cabins: { name, image },
  } = booking;

  const isClosed = status === "cancelled" || status === "no_show";

  // Once the guest has arrived the folio is what counts: the nights plus
  // anything added, and what has been paid. Before that, the nights alone.
  const hasFolio =
    (status === "checked_in" || status === "checked_out") && folio;

  return (
    <li
      className={`card flex flex-col overflow-hidden sm:flex-row ${
        isClosed ? "opacity-70" : ""
      }`}
    >
      <div className="relative aspect-[16/9] sm:aspect-auto sm:w-44">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          sizes="(min-width: 640px) 11rem, 100vw"
          className={`object-cover ${isClosed ? "grayscale" : ""}`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-2xl text-brand-900">
            {numNights} nights in Cabin {name}
          </h3>

          <StatusTag status={status} />
        </div>

        <p className="text-ink-600">
          {format(toDay(startDate), "EEE, MMM d yyyy")}
          {!isClosed &&
            ` (${
              isToday(toDay(startDate))
                ? "Today"
                : formatDistanceFromNow(startDate)
            })`}{" "}
          &mdash; {format(toDay(endDate), "EEE, MMM d yyyy")}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          {hasFolio ? (
            <>
              <p className="text-lg font-semibold text-ink-800">
                {formatCurrency(folio.total)}
              </p>
              <p
                className={
                  folio.remaining > 0
                    ? "font-medium text-[#9b3b23]"
                    : "text-brand-700"
                }
              >
                {folio.remaining > 0
                  ? `${formatCurrency(folio.paid)} paid · ${formatCurrency(folio.remaining)} remaining`
                  : "Paid in full"}
              </p>
            </>
          ) : (
            <p className="text-lg font-semibold text-ink-800">
              {formatCurrency(totalPrice)}
              {status === "reserved" && (
                <span className="ml-1 text-sm font-normal text-ink-500">
                  accommodation
                </span>
              )}
            </p>
          )}
          <p className="text-ink-500">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          <p className="text-ink-400 sm:ml-auto">
            <span className="font-medium text-ink-600">{reference}</span>{" "}
            &middot; booked {format(new Date(created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {status === "checked_in" && (
        <CardLink href="/account" icon={ArrowRightIcon}>
          My stay
        </CardLink>
      )}

      {status === "checked_out" && (
        <CardLink href={`/account/reservations/${id}`} icon={DocumentTextIcon}>
          Details
        </CardLink>
      )}

      {canChangeOnline(booking, today) && (
        <div className="flex border-t border-cream-200 sm:w-32 sm:flex-col sm:border-l sm:border-t-0">
          <Link
            href={`/account/reservations/edit/${id}`}
            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>Edit</span>
          </Link>
          <CancelReservation bookingId={id} onCancel={onCancel} />
        </div>
      )}
    </li>
  );
}

// One action on the side of a card, like "My stay" or "Details"
function CardLink({ href, icon: Icon, children }) {
  return (
    <div className="flex border-t border-cream-200 sm:w-32 sm:flex-col sm:border-l sm:border-t-0">
      <Link
        href={href}
        className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
      >
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </Link>
    </div>
  );
}

export default ReservationCard;
