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
    <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
      {/* Just the title and the sizes: the cabins themselves come straight after */}
      <header className="mb-8 flex flex-col gap-4 border-b border-sand-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">Our cabins</h1>
        <Filter />
      </header>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
