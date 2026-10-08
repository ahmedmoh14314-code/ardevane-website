"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

function Arrow({ direction, onClick }) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${direction === "previous" ? "Previous" : "Next"} photo`}
      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sand-50/95 text-forest-900 shadow-md transition-transform hover:scale-105 ${
        direction === "previous" ? "left-4" : "right-4"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

// The cabin's photos: a large one to browse, the next ones beside it on
// wide screens and underneath on phones
function CabinGallery({ photos, name }) {
  const [active, setActive] = useState(0);
  const count = photos.length;

  const go = (step) => setActive((i) => (i + step + count) % count);

  // The four photos after the one shown, beside it
  const side = Array.from(
    { length: Math.min(4, count - 1) },
    (_, i) => (active + 1 + i) % count
  );
  const more = count - 1 - side.length;

  // One photo: just the photo, wide, with nothing to browse
  if (count === 1)
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-sand-200 sm:aspect-[21/9]">
        <Image
          src={photos[0]}
          fill
          priority
          sizes="100vw"
          alt={`Cabin ${name}`}
          className="object-cover"
        />
      </div>
    );

  return (
    <div className="grid gap-2.5 md:grid-cols-[1.45fr_1fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-sand-200 md:aspect-auto md:min-h-[24rem]">
        <Image
          key={photos[active]}
          src={photos[active]}
          fill
          priority
          sizes="(min-width: 768px) 55vw, 100vw"
          alt={`Cabin ${name}, photo ${active + 1} of ${count}`}
          className="animate-fade object-cover"
        />

        <Arrow direction="previous" onClick={() => go(-1)} />
        <Arrow direction="next" onClick={() => go(1)} />

        <span className="absolute bottom-4 left-4 rounded-full bg-forest-950/60 px-3 py-1 font-label text-[0.8rem] text-white backdrop-blur-sm">
          {active + 1} / {count}
        </span>
      </div>

      {side.length > 0 && (
        <ul className="grid grid-cols-4 gap-2.5 md:grid-cols-2">
          {side.map((index, i) => {
            const isLast = i === side.length - 1 && more > 0;

            return (
              <li key={photos[index]}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photo ${index + 1}`}
                  className="group relative block aspect-square w-full overflow-hidden rounded-md bg-sand-200 md:aspect-[4/3]"
                >
                  <Image
                    src={photos[index]}
                    fill
                    sizes="(min-width: 768px) 20vw, 25vw"
                    alt=""
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isLast && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2 bg-forest-950/50 font-label text-[0.9rem] text-white">
                      <PhotoIcon className="hidden h-5 w-5 sm:block" />+{more}{" "}
                      more
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CabinGallery;
