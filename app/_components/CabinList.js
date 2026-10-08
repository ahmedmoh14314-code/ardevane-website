import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "../_lib/data-service";

const filters = {
  all: () => true,
  small: (cabin) => cabin.maxCapacity <= 3,
  medium: (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
  large: (cabin) => cabin.maxCapacity >= 8,
};

async function CabinList({ filter }) {
  const cabins = await getCabins();

  const displayedCabins = cabins.filter(filters[filter] ?? filters.all);

  if (!displayedCabins.length)
    return (
      <p className="border-y border-sand-200 py-12 text-center font-display text-lg text-ink-600">
        No cabin of this size is open right now. Try another size.
      </p>
    );

  return (
    <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      {displayedCabins.map((cabin, i) => (
        <li
          key={cabin.id}
          className="animate-rise"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <CabinCard cabin={cabin} />
        </li>
      ))}
    </ul>
  );
}

export default CabinList;
