import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, getNightlyPrice } from "../_lib/pricing";

// A cabin in the listing: the photo first, then its name, how many it
// sleeps, the price a night, and the way in. The cabin page has the rest.
function CabinCard({ cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;
  const percentOff =
    discount > 0 ? Math.round((discount / regularPrice) * 100) : 0;

  return (
    <Link
      href={`/cabins/${id}`}
      className="group block transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-sand-200 shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
        <Image
          src={image}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={`Cabin ${name}`}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
        />

        {/* On hover the photo darkens a little and invites you in */}
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-forest-950/55 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex translate-y-2 items-center gap-2 rounded-full bg-sand-50 px-4 py-2 font-display text-forest-900 transition-transform duration-300 group-hover:translate-y-0">
            View cabin
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>

        {/* The discount, in a green that is hard to miss */}
        {discount > 0 && (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 overflow-hidden rounded-full bg-[#2d8663] px-3.5 py-1.5 font-label text-[0.8rem] font-semibold text-white shadow-md">
            <TagIcon className="h-4 w-4" />
            Save {formatCurrency(discount)}
            <span className="font-medium text-white/85">
              &middot; {percentOff}% off
            </span>
            {/* A slow shine across the badge */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 animate-shine bg-white/35 motion-reduce:hidden"
            />
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h2 className="font-display text-[1.7rem] leading-tight text-forest-950 transition-colors group-hover:text-bark-700">
            Cabin {name}
          </h2>
          <p className="mt-1.5 flex items-center gap-2 font-display text-[1.02rem] text-ink-600">
            <UsersIcon className="h-5 w-5 text-bark-600" />
            Up to {maxCapacity} guests
          </p>
        </div>

        <p className="shrink-0 pt-1 text-right font-display">
          <span
            className={`text-[1.6rem] leading-none ${
              discount > 0 ? "text-[#2d8663]" : "text-bark-700"
            }`}
          >
            {formatCurrency(getNightlyPrice(cabin))}
          </span>
          <span className="text-ink-500"> / night</span>
          {discount > 0 && (
            <s className="mt-1 block text-[0.95rem] text-ink-400">
              {formatCurrency(regularPrice)}
            </s>
          )}
        </p>
      </div>

      {/* A line that fills in green as you hover, and the arrow moves on */}
      <span className="relative mt-5 flex items-center justify-between border-t border-sand-200 pt-4 font-display text-[1.05rem] text-forest-900">
        <span
          aria-hidden="true"
          className="absolute -top-px left-0 h-px w-0 bg-[#2d8663] transition-all duration-500 group-hover:w-full"
        />
        View cabin
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0" />
      </span>
    </Link>
  );
}

export default CabinCard;
