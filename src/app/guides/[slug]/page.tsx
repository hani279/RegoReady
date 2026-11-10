import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { VERIFIED_LABEL } from "@/lib/site";
import { btnPrimary, btnSecondary, eyebrow } from "@/lib/ui";

type Props = PageProps<"/guides/[slug]">;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  return guide ? { title: guide.title, description: guide.summary } : {};
}

export default async function GuidePage({ params }: Props) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 pb-16 pt-10 sm:pt-14">
      <header className="flex flex-col gap-4">
        <Link href="/guides" className={`${eyebrow} flex min-h-11 w-fit items-center hover:underline`}>
          Guides
        </Link>
        <h1 className="font-display text-4xl font-bold leading-[1.1]">
          {guide.title}
        </h1>
        <p className="rounded-2xl border-2 border-ink bg-plate-tint p-5 text-lg leading-relaxed">
          {guide.summary}
        </p>
      </header>

      {guide.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-bold">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="text-[17px] leading-relaxed text-soft">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-2 border-t border-line pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-soft">
          Official sources, checked {VERIFIED_LABEL}
        </h2>
        <ul className="flex flex-col">
          {guide.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center font-semibold underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          General information, not legal advice.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/calculator" className={btnPrimary}>
          Work out my cost
        </Link>
        <Link href="/check" className={btnSecondary}>
          Check a car
        </Link>
      </div>
    </article>
  );
}
