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
  title: "Food & drinks",
};

// The dining menu, for the stay the guest is in or their next confirmed one
export default async function Page() {
  const [guest, today] = await Promise.all([getGuest(), getPropertyToday()]);
  if (!guest) redirect("/login?next=/my-stay/menu");
  const bookings = await getBookings(guest.id);
  const { stay, servicesFor } = sortBookings(bookings, today);
  const menu = servicesFor ? await getMenu() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-8 sm:pt-10 lg:pb-16">
      <Link
        href="/my-stay"
        className="inline-block font-display text-ink-700 hover:text-forest-900"
      >
        &larr; My Stay
      </Link>

      <header className="mb-4 mt-4 sm:mb-6">
        <h1 className="font-display text-[2.4rem] leading-none text-forest-950 sm:text-[3.2rem]">
          Food & drinks
        </h1>
        <p className="mt-2 font-label text-[0.95rem] text-ink-600 sm:text-[1.02rem]">
          Pick what you like, choose a day and time, and we bring it to Cabin{" "}
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
        <div className="rounded-md border border-sand-200 bg-sand-50 p-6 shadow-soft sm:p-8">
          <p className="font-display text-[1.15rem] text-ink-700">
            The menu opens once you have a confirmed stay with us.
          </p>
          <Link href="/cabins" className="btn-forest mt-5 w-full sm:w-auto">
            Book a stay
          </Link>
        </div>
      )}
    </div>
  );
}
