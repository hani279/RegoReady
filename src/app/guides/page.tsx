import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Blocks";
import { GUIDES } from "@/lib/guides";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "NSW rego guides for used car buyers",
  description:
    "Plain answers on blue slips, pink slips, unregistered cars, written-off vehicles and transferring rego in NSW.",
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title="NSW rego, in plain English"
        intro="Short answers to the questions buyers get stuck on, each linked to the official source."
      />
      <ul className={`${container} grid gap-4 pb-16 md:grid-cols-2`}>
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-card p-6 hover:border-ink"
            >
              <span className="font-display text-xl font-bold leading-snug">
                {g.title}
              </span>
              <span className="text-[15px] leading-relaxed text-soft">
                {g.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
