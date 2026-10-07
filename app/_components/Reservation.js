import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import ReservationSummary from "./ReservationSummary";

// Dates and guests, open to everyone. Signing in only comes at the very
// end, when the guest confirms on the review page.
async function Reservation({ cabin }) {
  const [settings, takenNights] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[3fr_2fr]">
      <DateSelector
        settings={settings}
        takenNights={takenNights}
        cabin={cabin}
      />

      <ReservationSummary cabin={cabin} settings={settings} />
    </div>
  );
}

export default Reservation;
