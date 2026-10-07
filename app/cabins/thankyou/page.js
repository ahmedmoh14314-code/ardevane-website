import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Reservation received",
};

export default function Page({ searchParams }) {
  const bookingId = Number(searchParams?.booking) || null;

  return (
    <div className="page flex justify-center">
      <div className="card w-full max-w-lg animate-rise p-10 text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-7 w-7" />
        </span>

        <h1 className="mb-3 font-display text-4xl text-brand-900">
          Your cabin is reserved
        </h1>

        {bookingId && (
          <p className="mb-3 text-ink-600">
            Booking number{" "}
            <span className="rounded-md bg-cream-100 px-2 py-0.5 font-semibold text-ink-800">
              #{bookingId}
            </span>
          </p>
        )}

        <p className="mb-8 text-ink-600">
          Nothing to pay now. Show this number at the front desk when you
          arrive, and we&apos;ll take it from there.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/account/reservations" className="btn-primary">
            See your reservations
          </Link>
          <Link href="/cabins" className="btn-secondary">
            Back to the cabins
          </Link>
        </div>
      </div>
    </div>
  );
}
