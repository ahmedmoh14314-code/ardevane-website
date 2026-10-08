import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
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
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-8 sm:pb-24 sm:pt-8">
      <Link
        href={changeLink}
        className="mb-5 inline-flex items-center gap-2 font-display text-ink-700 hover:text-forest-900"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Change dates or guests
      </Link>

      <header className="mb-7">
        <p className="eyebrow mb-2">Almost there</p>
        <h1 className="page-title">Review your reservation</h1>
      </header>

      <div className="grid animate-rise items-start gap-6 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <section className="overflow-hidden rounded-md border border-sand-200 bg-sand-50 shadow-soft">
          <div className="relative aspect-[16/8] bg-sand-200">
            <Image
              src={cabin.image}
              alt={`Cabin ${cabin.name}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="p-5 sm:p-7">
            <h2 className="font-display text-[1.9rem] leading-tight text-forest-950">
              Cabin {cabin.name}
            </h2>

            <ul className="mt-4 space-y-3 font-label text-[0.95rem] text-ink-700">
              <li className="flex items-center gap-3">
                <CalendarDaysIcon className="h-5 w-5 shrink-0 text-bark-500" />
                {format(toDay(stay.from), "EEE, MMM d")} &ndash;{" "}
                {format(toDay(stay.to), "EEE, MMM d, yyyy")}
              </li>
              <li className="flex items-center gap-3">
                <UsersIcon className="h-5 w-5 shrink-0 text-bark-500" />
                {stay.guests} {stay.guests === 1 ? "guest" : "guests"}
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheckIcon className="h-5 w-5 shrink-0 text-bark-500" />
                Free changes and cancellation until the day before you arrive
              </li>
            </ul>

            {quote && (
              <dl className="mt-6 space-y-3 border-t border-sand-200 pt-5 font-label text-[0.95rem]">
                <div className="flex justify-between text-ink-600">
                  <dt>
                    {formatCurrency(quote.nightly_price)} &times; {quote.nights}{" "}
                    nights
                  </dt>
                  <dd>{formatCurrency(quote.total_price)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-sand-200 pt-3">
                  <dt className="font-display text-[1.15rem] text-forest-950">
                    Total, paid at the cabin
                  </dt>
                  <dd className="font-display text-[1.6rem] text-forest-950">
                    {formatCurrency(quote.total_price)}
                  </dd>
                </div>
              </dl>
            )}

            {error && (
              <div className="mt-6 space-y-4">
                <FormError message={error} />
                <Link href={changeLink} className="btn-secondary">
                  Choose other dates
                </Link>
              </div>
            )}
          </div>
        </section>

        {quote && (
          <aside className="rounded-md border border-sand-200 bg-white p-5 shadow-soft sm:p-7 lg:sticky lg:top-24">
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
