import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { LAST_VERIFIED } from "@/lib/fees/nsw";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "RegoReady: the real cost to get a used car on the road in NSW",
  description:
    "Free NSW landed cost and bid ceiling calculator for auction and private car purchases, plus a per-car registration pathway check.",
};

const verified = new Date(LAST_VERIFIED).toLocaleDateString("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link
            href="/"
            className="rounded-md border-2 border-ink bg-plate px-3 py-1 font-display text-sm font-bold tracking-[0.12em] text-ink"
          >
            REGOREADY
          </Link>
          <nav className="flex flex-wrap items-center gap-x-6 text-[15px] font-medium">
            <Link href="/#calculator" className="flex min-h-11 items-center">
              Calculator
            </Link>
            <Link href="/#check" className="flex min-h-11 items-center">
              Check a car
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-ink text-[13px] leading-relaxed text-[#c9cec6]">
          <div className="mx-auto max-w-5xl px-5 py-8">
            General information, not legal advice. NSW fees last checked{" "}
            {verified} against Service NSW, Transport for NSW and Revenue NSW.
            Fees marked &ldquo;check the listing&rdquo; have not been confirmed
            from the auction house. Not affiliated with any auction house or
            government agency.
          </div>
        </footer>
      </body>
    </html>
  );
}
