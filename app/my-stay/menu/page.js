import Link from "next/link";
import { redirect } from "next/navigation";
import { getGuest } from "@/app/_lib/auth";
import {
  getBookings,
  getMenu,
  getPropertyToday,
} from "@/app/_lib/data-service";
import { sortBookings, stayDays } from "@/app/_lib/account";
import DiningMenu from "@/app/_components/DiningMenu";

export const metadata = {
  title: "Dining",
};

// The dining menu, for the stay the guest is in or their next confirmed one
export default async function Page() {
  const [guest, today] = await Promise.all([getGuest(), getPropertyToday()]);
  if (!guest) redirect("/login?next=/my-stay/menu");
  const bookings = await getBookings(guest.id);
  const { stay, servicesFor } = sortBookings(bookings, today);
  const menu = servicesFor ? await getMenu() : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
      <Link
        href="/my-stay"
        className="inline-block font-display text-ink-600 hover:text-forest-900"
      >
        &larr; My Stay
      </Link>

      <header>
        <p className="eyebrow mb-2">Dining</p>
        <h1 className="page-title mb-2">Brought to your cabin</h1>
        <p className="max-w-2xl text-ink-600">
          Breakfast, lunch and dinner from our kitchen, with desserts and
          drinks. Choose the day and time, and we bring it to Cabin{" "}
          {servicesFor?.cabins.name ?? ""}.
        </p>
      </header>

      {servicesFor ? (
        <DiningMenu
          menu={menu}
          days={stayDays(servicesFor, today)}
          isStaying={Boolean(stay)}
        />
      ) : (
        <div className="card p-8">
          <p className="mb-6 text-ink-600">
            The menu opens once you have a confirmed stay with us.
          </p>
          <Link href="/cabins" className="btn-primary">
            Book a stay
          </Link>
        </div>
      )}
    </div>
  );
}
