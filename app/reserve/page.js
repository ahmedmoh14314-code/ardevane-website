import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDaysIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { getUser } from "../_lib/auth";
import { getCabin, quoteBooking } from "../_lib/data-service";
import { formatCurrency } from "../_lib/pricing";
import { readReview, reviewPath, toDay } from "../_lib/stay";
import ConfirmReservationForm from "../_components/ConfirmReservationForm";
import SignInToConfirm from "../_components/SignInToConfirm";
import FormError from "../_components/FormError";
import Message from "../_components/Message";

export const metadata = {
  title: "Review your reservation",
};

// The last step before booking. Everything comes from the address, so this
// page is the same before and after signing in, and the price shown is the
// database's own (quote_booking), not the browser's.
export default async function Page({ searchParams }) {
  const stay = readReview(searchParams);

  if (!stay)
    return (
      <Message eyebrow="Reservation" title="Let's start with a cabin">
        <Link href="/cabins" className="btn-primary">
          See the cabins
        </Link>
      </Message>
    );

  const [cabin, { quote, error }, user] = await Promise.all([
    getCabin(stay.cabinId),
    quoteBooking(stay),
    getUser(),
  ]);

  const changeLink = `/cabins/${cabin.id}#reserve`;

  return (
    <div className="page">
      <Link
        href={changeLink}
        className="mb-6 inline-block text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        &larr; Change dates or guests
      </Link>

      <header className="mb-8">
        <p className="eyebrow mb-2">Almost there</p>
        <h1 className="page-title">Review your reservation</h1>
      </header>

      <div className="grid animate-rise gap-8 lg:grid-cols-[3fr_2fr]">
        <section className="card overflow-hidden">
          <div className="relative aspect-[16/7] bg-cream-100">
            <Image
              src={cabin.image}
              alt={`Cabin ${cabin.name}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <h2 className="font-display text-3xl text-brand-900">
              Cabin {cabin.name}
            </h2>

            <ul className="space-y-3 text-ink-700">
              <li className="flex items-center gap-3">
                <CalendarDaysIcon className="h-5 w-5 text-brand-600" />
                {format(toDay(stay.from), "EEE, MMM d")} &ndash;{" "}
                {format(toDay(stay.to), "EEE, MMM d, yyyy")}
              </li>
              <li className="flex items-center gap-3">
                <UsersIcon className="h-5 w-5 text-brand-600" />
                {stay.guests} {stay.guests === 1 ? "guest" : "guests"}
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheckIcon className="h-5 w-5 text-brand-600" />
                Free changes and cancellation until the day before you arrive
              </li>
            </ul>

            {quote && (
              <dl className="space-y-2 rounded-xl bg-cream-50 p-5">
                <div className="flex justify-between text-ink-600">
                  <dt>
                    {formatCurrency(quote.nightly_price)} &times; {quote.nights}{" "}
                    nights
                  </dt>
                  <dd>{formatCurrency(quote.total_price)}</dd>
                </div>
                <div className="flex justify-between border-t border-cream-200 pt-2 text-lg font-semibold text-ink-800">
                  <dt>Total, paid at the cabin</dt>
                  <dd>{formatCurrency(quote.total_price)}</dd>
                </div>
              </dl>
            )}

            {error && (
              <div className="space-y-4">
                <FormError message={error} />
                <Link href={changeLink} className="btn-secondary">
                  Choose other dates
                </Link>
              </div>
            )}
          </div>
        </section>

        {quote && (
          <aside className="card h-fit p-6 sm:p-8">
            {user ? (
              <ConfirmReservationForm stay={stay} user={user} />
            ) : (
              <SignInToConfirm next={reviewPath(stay)} />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
