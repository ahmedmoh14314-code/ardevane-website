import { getBookedDatesByCabinId, getCabins } from "@/app/_lib/data-service";

// Public: a cabin and the days it is taken. Only dates, never guests.
export async function GET(request, { params }) {
  const cabinId = Number(params.cabinId);

  const cabins = await getCabins();
  const cabin = cabins.find((cabin) => cabin.id === cabinId);

  if (!cabin)
    return Response.json({ message: "Cabin not found" }, { status: 404 });

  const bookedDates = await getBookedDatesByCabinId(cabinId);

  return Response.json({ cabin, bookedDates });
}
