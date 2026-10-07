import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";

  return (
    <div className="page">
      <header className="mb-10 animate-rise">
        <p className="eyebrow mb-3">Stay with us</p>
        <h1 className="page-title mb-4">Our cabins</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-600">
          Every cabin has its own deck, a fireplace and a view of the lake or
          the mountains. Pick the size that fits, then choose your dates.
        </p>
      </header>

      <div className="mb-8 flex justify-end">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
