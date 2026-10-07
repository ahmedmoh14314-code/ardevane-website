import { redirect } from "next/navigation";
import SideNavigation from "@/app/_components/SideNavigation";
import { getGuest } from "@/app/_lib/auth";

export default async function Layout({ children }) {
  // middleware.js already sent signed-out visitors to /login. This catches
  // the rare account whose guest profile couldn't be opened.
  const guest = await getGuest();
  if (!guest) redirect("/login");

  return (
    <div className="page grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
      <SideNavigation />
      <div className="min-w-0 animate-rise">{children}</div>
    </div>
  );
}
