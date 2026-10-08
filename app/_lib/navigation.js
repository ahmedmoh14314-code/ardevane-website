// The main places on the site, shared by the header, the footer and the
// tab bar on phones
export const links = [
  { name: "Home", href: "/" },
  { name: "Cabins", href: "/cabins" },
  { name: "My Stay", href: "/my-stay" },
  { name: "About", href: "/about" },
];

export function isActiveLink(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
