import Image from "next/image";
import { format } from "date-fns";
import StatusTag from "./StatusTag";
import StayFolio from "./StayFolio";
import { stayDay } from "../_lib/account";
import { formatCurrency } from "../_lib/pricing";
import { toDay } from "../_lib/stay";

// The account while the guest is checked in: where they are staying, which
// day of the stay it is, and what the stay has cost so far
function MyStay({ guestName, booking, charges, today }) {
  const {
    reference,
    startDate,
    endDate,
    numGuests,
    status,
    folio,
    cabins: { name, image },
  } = booking;

  const { day, of, isDepartureDay } = stayDay(booking, today);
  const remaining = folio?.remaining ?? 0;

  return (
    <div className="space-y-6">
      <section className="card grid overflow-hidden md:grid-cols-[18rem_1fr]">
        <div className="relative aspect-[16/10] md:aspect-auto">
          <Image
            src={image}
            alt={`Cabin ${name}`}
            fill
            sizes="(min-width: 768px) 18rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow">My stay &middot; {guestName}</p>
            <StatusTag status={status} />
          </div>

          <div>
            <h2 className="font-display text-4xl text-brand-900">
              Cabin {name}
            </h2>
            <p className="mt-1 text-lg font-medium text-gold-700">
              {isDepartureDay ? "Departure day" : `Day ${day} of ${of}`}
            </p>
          </div>

          <p className="text-ink-600">
            {format(toDay(startDate), "EEE, MMM d")} &ndash;{" "}
            {format(toDay(endDate), "EEE, MMM d, yyyy")} &middot; {numGuests}{" "}
            {numGuests === 1 ? "guest" : "guests"}
          </p>

          <div className="grid grid-cols-3 gap-3 border-t border-cream-200 pt-4 text-sm">
            <div>
              <p className="text-ink-500">Total</p>
              <p className="font-semibold text-ink-900">
                {formatCurrency(folio?.total ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-ink-500">Paid</p>
              <p className="font-semibold text-brand-700">
                {formatCurrency(folio?.paid ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-ink-500">Remaining</p>
              <p
                className={`font-semibold ${
                  remaining > 0 ? "text-[#9b3b23]" : "text-brand-700"
                }`}
              >
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          <p className="text-sm text-ink-400">Booking {reference}</p>
        </div>
      </section>

      <StayFolio id="charges" folio={folio} charges={charges} />
    </div>
  );
}

export default MyStay;
