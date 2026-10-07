import { redirect } from "next/navigation";
import SideNavigation from "@/app/_components/SideNavigation";
import { getGuest } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export default async function Layout({ children }) {
  // middleware.js already sent signed-out visitors to /login. This catches
  // the rare account whose guest profile couldn't be opened.
  const guest = await getGuest();
  if (!guest) redirect("/login");

  // While the guest is checked in, the account is their stay
  const bookings = await getBookings(guest.id);
  const isStaying = bookings.some((booking) => booking.status === "checked_in");

  return (
    <div className="page grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
      <SideNavigation isStaying={isStaying} />
      <div className="min-w-0 animate-rise">{children}</div>
    </div>
  );
}
