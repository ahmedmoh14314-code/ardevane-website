import localFont from "next/font/local";

import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { ReservationProvider } from "./_components/ReservationContext";

// The Ardevane identity: a calm, classic serif (Newsreader) for headings and
// reading, a quiet sans (Inter) for small labels, and a handwritten script
// (Mrs Saint Delafield) for the odd note. The files live in the site itself,
// so building and loading never wait on Google Fonts.
const display = localFont({
  src: [
    { path: "./_fonts/newsreader-400.woff2", weight: "400", style: "normal" },
    { path: "./_fonts/newsreader-500.woff2", weight: "500", style: "normal" },
    {
      path: "./_fonts/newsreader-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./_fonts/newsreader-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// The body text is the same serif
const body = localFont({
  src: [
    { path: "./_fonts/newsreader-400.woff2", weight: "400", style: "normal" },
    { path: "./_fonts/newsreader-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

const label = localFont({
  src: [
    { path: "./_fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./_fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./_fonts/inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-label",
  display: "swap",
});

const script = localFont({
  src: "./_fonts/mrs-saint-delafield-400.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata = {
  title: {
    template: "%s · Ardevane",
    default: "Ardevane · Mountain cabins by the lake",
  },
  description:
    "Private wooden cabins between the pines and the lake, with mountain views from every deck. Book your stay at Ardevane.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${label.variable} ${script.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-sand-50 font-sans text-[17px] text-ink-700 antialiased">
        <Header />

        <ReservationProvider>
          {/* Room at the bottom on phones for the tab bar */}
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </ReservationProvider>

        <Footer />
      </body>
    </html>
  );
}
