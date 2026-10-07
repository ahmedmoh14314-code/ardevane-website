import SideNavigation from "@/app/_components/SideNavigation";

export default function Layout({ children }) {
  return (
    <div className="page grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12">
      <SideNavigation />
      <div className="min-w-0 animate-rise">{children}</div>
    </div>
  );
}
