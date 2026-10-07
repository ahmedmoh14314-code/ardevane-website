import { getUser } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

async function Reservation({ cabin }) {
  const [settings, bookedDates, user] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
    getUser(),
  ]);

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[3fr_2fr]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />

      {user ? (
        <ReservationForm cabin={cabin} settings={settings} user={user} />
      ) : (
        <LoginMessage next={`/cabins/${cabin.id}#reserve`} />
      )}
    </div>
  );
}

export default Reservation;
