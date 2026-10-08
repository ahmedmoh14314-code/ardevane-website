"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "all", label: "All cabins" },
  { value: "small", label: "2–3 guests" },
  { value: "medium", label: "4–7 guests" },
  { value: "large", label: "8+ guests" },
];

// The cabin sizes, as a row of pills. On phones the row scrolls sideways
// rather than wrapping.
function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label="Cabin size"
      className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((option) => {
        const isActive = option.value === activeFilter;

        return (
          <button
            key={option.value}
            onClick={() => handleFilter(option.value)}
            aria-pressed={isActive}
            className={`min-h-[2.75rem] shrink-0 whitespace-nowrap rounded-full border px-5 font-display text-[1rem] transition-colors ${
              isActive
                ? "border-forest-900 bg-forest-900 text-sand-50"
                : "border-sand-300 bg-transparent text-ink-700 hover:border-forest-700 hover:text-forest-900"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default Filter;
