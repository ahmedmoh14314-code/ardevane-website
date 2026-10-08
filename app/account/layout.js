import { redirect } from "next/navigation";
import SideNavigation from "@/app/_components/SideNavigation";
import { getGuest } from "@/app/_lib/auth";

export default async function Layout({ children }) {
  // middleware.js already sent signed-out visitors to /login. This catches
  // the rare account whose guest profile couldn't be opened.
  const guest = await getGuest();
  if (!guest) redirect("/login");

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-8 md:grid-cols-[15rem_1fr] md:gap-0 md:pt-0">
      <aside className="md:border-r md:border-sand-200 md:py-10 md:pr-7">
        <SideNavigation />
      </aside>
      <div className="min-w-0 animate-rise md:py-10 md:pl-10">{children}</div>
    </div>
  );
}
