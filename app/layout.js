import { Playfair_Display, Poppins } from "next/font/google";

import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { ReservationProvider } from "./_components/ReservationContext";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50 font-sans text-ink-700 antialiased">
        <Header />

        <ReservationProvider>
          <main className="flex-1">{children}</main>
        </ReservationProvider>

        <Footer />
      </body>
    </html>
  );
}
