import { Suspense } from "react";
import Link from "next/link";
import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import {
  getCabin,
  getCabinImages,
  getCabins,
} from "@/app/_lib/data-service";

export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
}

export default async function Page({ params }) {
  const [cabin, images] = await Promise.all([
    getCabin(params.cabinId),
    getCabinImages(params.cabinId),
  ]);

  return (
    <div className="page">
      <Link
        href="/cabins"
        className="mb-6 inline-block text-sm font-medium text-ink-500 hover:text-brand-700"
      >
        &larr; All cabins
      </Link>

      <Cabin cabin={cabin} images={images} />

      <section id="reserve" className="mt-16 scroll-mt-24">
        <p className="eyebrow mb-3">Reserve</p>
        <h2 className="page-title mb-3">Choose your dates</h2>
        <p className="mb-8 text-ink-600">
          Nothing to pay now. You pay at the cabin when you arrive.
        </p>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </section>
    </div>
  );
}
