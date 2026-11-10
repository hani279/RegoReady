import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Blocks";
import { SELLER_LIST } from "@/lib/fees/sellers";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Car auction buyer fees in Australia",
  description:
    "Buyer fees for Pickles, Manheim, Lloyds, Grays and Carbids, and what a private sale costs, with a calculator for each.",
};

export default function FeesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Auction fees"
        title="Buyer fees, house by house"
        intro="What each auction house adds to the hammer price, and what a private sale costs you."
      />
      <ul className={`${container} grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3`}>
        {SELLER_LIST.map((s) => (
          <li key={s.id}>
            <Link
              href={`/fees/${s.id}`}
              className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-card p-6 hover:border-ink"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-xl font-bold">{s.name}</span>
                {s.status === "unconfirmed" && (
                  <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-semibold text-amber-text">
                    check the listing
                  </span>
                )}
              </span>
              <span className="text-[15px] leading-relaxed text-soft">
                {s.feeNote}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
