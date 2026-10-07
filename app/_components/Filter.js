"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "all", label: "All cabins" },
  { value: "small", label: "2–3 guests" },
  { value: "medium", label: "4–7 guests" },
  { value: "large", label: "8+ guests" },
];

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
    <div className="flex flex-wrap gap-1 rounded-xl border border-cream-200 bg-white p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilter(option.value)}
          aria-pressed={option.value === activeFilter}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            option.value === activeFilter
              ? "bg-brand-600 text-white"
              : "text-ink-600 hover:bg-brand-50 hover:text-brand-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
