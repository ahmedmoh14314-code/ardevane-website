import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { differenceInCalendarDays, format } from "date-fns";
import CancelReservation from "./CancelReservation";
import StatusTag from "./StatusTag";
import { formatCurrency } from "../_lib/pricing";
import { stayDay } from "../_lib/account";
import { canChangeOnline, toDay } from "../_lib/stay";

// "Arrives in 25 days", "Day 2 of 6": where the stay is, in a few words
function whenLine(booking, today) {
  const { status, startDate } = booking;

  if (status === "checked_in") {
    const { day, of, isDepartureDay } = stayDay(booking, today);
    return isDepartureDay ? "Departure day" : `Day ${day} of ${of}`;
  }

  if (status !== "reserved" && status !== "pending") return null;

  const days = differenceInCalendarDays(toDay(startDate), toDay(today));
  if (days <= 0) return "Arrives today";
  return days === 1 ? "Arrives tomorrow" : `Arrives in ${days} days`;
}

function Fact({ label, children, className = "" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="font-label text-[0.75rem] text-ink-500">{label}</dt>
      <dd className="mt-0.5 font-display text-[1.05rem] text-ink-800">
        {children}
      </dd>
    </div>
  );
}

const actionClass =
  "inline-flex items-center justify-center gap-2 rounded-[3px] border px-4 py-2 font-display text-[0.98rem] transition-colors";

// One reservation: the cabin, the days, what it costs, and what can be done
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
    folio,
    cabins: { name, image },
  } = booking;

  const isClosed = status === "cancelled" || status === "no_show";
  const detailsHref = `/account/reservations/${id}`;
  const when = whenLine(booking, today);

  // Once the guest has arrived the folio is what counts: the nights plus
  // anything added, and what has been paid. Before that, the nights alone.
  const hasFolio =
    (status === "checked_in" || status === "checked_out") && folio;
  const total = hasFolio ? folio.total : totalPrice;

  return (
    <li
      className={`overflow-hidden rounded-md border border-sand-200 bg-sand-50 shadow-soft transition-shadow hover:shadow-lift ${
        isClosed ? "opacity-80" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <Link
          href={detailsHref}
          className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-56 lg:w-64"
        >
          <Image
            src={image}
            alt={`Cabin ${name}`}
            fill
            sizes="(min-width: 1024px) 16rem, (min-width: 640px) 14rem, 100vw"
            className={`object-cover transition-transform duration-500 hover:scale-105 ${
              isClosed ? "grayscale" : ""
            }`}
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-label text-[0.72rem] uppercase tracking-[0.2em] text-bark-600">
                {reference}
              </p>
              <h3 className="mt-1 font-display text-[1.6rem] leading-tight text-forest-950">
                <Link href={detailsHref} className="hover:text-forest-700">
                  Cabin {name}
                </Link>
              </h3>
              {when && (
                <p className="mt-0.5 font-label text-[0.85rem] text-ink-600">
                  {when}
                </p>
              )}
            </div>
            <StatusTag status={status} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-[3px] sm:grid-cols-3 bg-sand-100 px-4 py-3">
            <Fact label="Check in">
              {format(toDay(startDate), "MMM d, yyyy")}
            </Fact>
            <Fact label="Check out">
              {format(toDay(endDate), "MMM d, yyyy")}
            </Fact>
            <Fact label="Stay" className="col-span-2 sm:col-span-1">
              {numNights} {numNights === 1 ? "night" : "nights"}, {numGuests}{" "}
              {numGuests === 1 ? "guest" : "guests"}
            </Fact>
          </dl>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-sand-200 pt-4">
            <p className="font-label text-[0.85rem] text-ink-600">
              <span
                className={`mr-2 font-display text-[1.35rem] text-forest-950 ${
                  isClosed ? "line-through decoration-ink-400" : ""
                }`}
              >
                {formatCurrency(total)}
              </span>
              {hasFolio ? (
                folio.remaining > 0 ? (
                  <span className="text-[#9b3b23]">
                    {formatCurrency(folio.remaining)} left to pay
                  </span>
                ) : (
                  <span className="text-[#1d5a3d]">Paid in full</span>
                )
              ) : (
                !isClosed && "Paid at the cabin"
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {status === "checked_in" && (
                <Link
                  href="/my-stay"
                  className={`${actionClass} border-forest-900 bg-forest-900 text-sand-50 hover:bg-forest-700`}
                >
                  Open My Stay
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}

              {canChangeOnline(booking, today) ? (
                <>
                  <Link
                    href={`/account/reservations/edit/${id}`}
                    className={`${actionClass} border-sand-300 bg-white text-ink-800 hover:border-forest-900`}
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <CancelReservation bookingId={id} onCancel={onCancel} />
                </>
              ) : (
                status !== "checked_in" && (
                  <Link
                    href={detailsHref}
                    className={`${actionClass} border-sand-300 bg-white text-ink-800 hover:border-forest-900`}
                  >
                    View details
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ReservationCard;
