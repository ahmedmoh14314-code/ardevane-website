"use client";

import { useState } from "react";
import Image from "next/image";

// A large photo with the rest of the cabin's gallery underneath
function CabinGallery({ photos, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream-100 shadow-soft">
        <Image
          key={photos[active]}
          src={photos[active]}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={`Cabin ${name}, photo ${active + 1} of ${photos.length}`}
          className="animate-fade object-cover"
        />
      </div>

      {photos.length > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <li key={photo}>
              <button
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl transition-all ${
                  i === active
                    ? "ring-2 ring-brand-600 ring-offset-2 ring-offset-cream-50"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo}
                  fill
                  sizes="120px"
                  alt=""
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CabinGallery;
