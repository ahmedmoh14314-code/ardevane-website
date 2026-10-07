import Image from "next/image";
import Link from "next/link";
import { UsersIcon } from "@heroicons/react/24/outline";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";

// The same card as the Cabins page of the dashboard, seen from the guest's side
function CabinCard({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;

  return (
    <Link
      href={`/cabins/${id}`}
      className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
        <Image
          src={image}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={`Cabin ${name}`}
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
        />

        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            Save {formatCurrency(discount)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-medium text-brand-900">
            Cabin {name}
          </h3>

          <p className="whitespace-nowrap text-right">
            <span className="text-xl font-semibold text-ink-800">
              {formatCurrency(getNightlyPrice(cabin))}
            </span>
            <span className="text-sm text-ink-500"> / night</span>
            {discount > 0 && (
              <s className="block text-sm text-ink-400">
                {formatCurrency(regularPrice)}
              </s>
            )}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-cream-100 pt-4 text-sm">
          <span className="flex items-center gap-2 text-ink-600">
            <UsersIcon className="h-5 w-5 text-brand-600" />
            Up to {maxCapacity} guests
          </span>

          <span className="font-medium text-brand-700 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
            View &amp; reserve &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CabinCard;
