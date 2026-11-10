import Link from "next/link";
import { TickList } from "@/components/Blocks";
import ReportView from "@/components/ReportView";
import { SAMPLE_CLEAR } from "@/lib/sample";
import { btnPrimary, btnSecondary, container, eyebrow } from "@/lib/ui";

const pages = [
  {
    href: "/calculator",
    title: "Calculator",
    body: "The all-in cost, or the most you should bid for your budget.",
  },
  {
    href: "/check",
    title: "Check a car",
    body: "A verdict on one car, with the steps to get it registered.",
  },
  {
    href: "/fees",
    title: "Auction fees",
    body: "What each auction house adds to the hammer price.",
  },
  {
    href: "/guides",
    title: "Guides",
    body: "Blue slips, write-offs and transfers in plain English.",
  },
];

export default function Home() {
  return (
    <>
      <section
        className={`${container} grid items-center gap-10 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr]`}
      >
        <div className="flex flex-col gap-6">
          <p className={eyebrow}>Auctions and private sales in NSW</p>
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.04] sm:text-6xl">
            Know the real cost before you bid.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-soft">
            The price is where the bill starts. See buyer fees, stamp duty,
            inspections and rego in one number, and find out whether the car
            can be registered in NSW at all.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculator" className={btnPrimary}>
              Work out my cost
            </Link>
            <Link href="/check" className={btnSecondary}>
              Check a car
            </Link>
          </div>
          <TickList
            items={[
              "Free calculator, no sign-up",
              "Every government fee linked to its official source",
              "Pickles, Manheim, Grays, Lloyds, carsales and Marketplace",
            ]}
          />
          <Link
            href="/how-it-works"
            className="flex min-h-11 w-fit items-center font-semibold underline"
          >
            See how it works
          </Link>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 size-full rounded-3xl bg-plate"
          />
          <div className="relative rounded-3xl border-2 border-ink bg-ground p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-soft">
              What a report looks like
            </p>
            <ReportView {...SAMPLE_CLEAR} sample compact />
            <Link
              href="/report/sample"
              className="mt-3 flex min-h-11 w-fit items-center text-sm font-semibold underline"
            >
              Open the full sample
            </Link>
          </div>
        </div>
      </section>

      <nav aria-label="Sections" className={`${container} pb-16`}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="flex h-full flex-col gap-1.5 rounded-2xl border border-line bg-card p-5 hover:border-ink"
              >
                <span className="flex items-center justify-between font-display text-lg font-bold">
                  {p.title}
                  <span aria-hidden="true">→</span>
                </span>
                <span className="text-[15px] leading-relaxed text-soft">
                  {p.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
