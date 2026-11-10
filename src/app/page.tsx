import Link from "next/link";
import { CheckCard, Faq, PricingCards, TickList } from "@/components/Blocks";
import Calculator from "@/components/Calculator";
import ReportView from "@/components/ReportView";
import { SELLER_LIST } from "@/lib/fees/sellers";
import { GUIDES } from "@/lib/guides";
import { SAMPLE_BLOCKED, SAMPLE_CAUTION, SAMPLE_CLEAR } from "@/lib/sample";
import { btnPrimary, btnSecondary, card, container, eyebrow, h2 } from "@/lib/ui";

const steps = [
  {
    title: "Work out the landed cost",
    body: "Pick where you are buying and enter the price. Or start from your budget and get the most you should bid.",
  },
  {
    title: "Check the exact car",
    body: "Enter the VIN from the listing for the PPSR certificate plus write-off, stolen and rego status.",
  },
  {
    title: "Follow the path to rego",
    body: "A plain checklist for that car in NSW: which inspection, which forms, what each step costs. Or a clear “do not buy”.",
  },
];

const compare = [
  ["Finance owing, write-off and stolen status", true, true],
  ["Official PPSR certificate", true, true],
  ["Whether you can register it in NSW", false, true],
  ["The steps to rego, in order, with costs", false, true],
  ["Total landed cost including fees and duty", false, true],
  ["The most you should bid for your budget", false, true],
] as const;

const verdicts = [
  { label: "Clear", note: "Registrable, with the steps to follow", data: SAMPLE_CLEAR },
  { label: "Caution", note: "Registrable, but fix this before you pay", data: SAMPLE_CAUTION },
  { label: "Do not buy", note: "It can never go on the road in NSW", data: SAMPLE_BLOCKED },
];

function Mark({ yes }: { yes: boolean }) {
  return yes ? (
    <svg role="img" aria-label="Yes" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0b5a42" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  ) : (
    <svg role="img" aria-label="No" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b737c" strokeWidth="2.4" strokeLinecap="round" className="mx-auto">
      <path d="M6 12h12" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={`${container} grid items-center gap-10 pb-14 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr]`}>
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
            <Link href="#calculator" className={btnPrimary}>
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
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div aria-hidden="true" className="absolute -right-3 -top-3 size-full rounded-3xl bg-plate" />
          <div className="relative rounded-3xl border-2 border-ink bg-ground p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-soft">
              What a report looks like
            </p>
            <ReportView {...SAMPLE_CLEAR} sample compact />
            <Link href="/report/sample" className="mt-3 flex min-h-11 w-fit items-center text-sm font-semibold underline">
              Open the full sample
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="scroll-mt-20 border-y border-line bg-card">
        <div className={`${container} flex flex-col gap-8 py-14`}>
          <div className="flex flex-col gap-3">
            <p className={eyebrow}>Free calculator</p>
            <h2 className={h2}>What will it cost to get on the road?</h2>
          </div>
          <Calculator />
        </div>
      </section>

      {/* How it works */}
      <section className={`${container} flex flex-col gap-8 py-16`}>
        <h2 className={`${h2} max-w-2xl`}>
          A history report says what the car was. We tell you what happens
          next.
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className={`${card} flex flex-col gap-2 p-6`}>
              <span className="flex size-9 items-center justify-center rounded-full bg-ink font-display text-[15px] font-bold text-white">
                {i + 1}
              </span>
              <span className="mt-2 text-lg font-semibold">{s.title}</span>
              <span className="text-[15px] leading-relaxed text-soft">{s.body}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Verdicts */}
      <section className="border-y border-line bg-card">
        <div className={`${container} flex flex-col gap-8 py-16`}>
          <div className="flex flex-col gap-3">
            <p className={eyebrow}>The paid check</p>
            <h2 className={h2}>One of three answers, before you pay for the car</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {verdicts.map((v) => (
              <div key={v.label} className="flex flex-col gap-3">
                <div>
                  <p className="text-lg font-semibold">{v.label}</p>
                  <p className="text-sm text-muted">{v.note}</p>
                </div>
                <div className="rounded-2xl border border-line bg-ground p-4">
                  <ReportView {...v.data} sample compact />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={`${container} flex flex-col gap-8 py-16`}>
        <h2 className={`${h2} max-w-2xl`}>More than a history check</h2>
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 font-semibold">What you find out</th>
                <th scope="col" className="w-32 p-4 text-center font-semibold text-soft">History report</th>
                <th scope="col" className="w-32 bg-plate-tint p-4 text-center font-display font-bold">RegoReady</th>
              </tr>
            </thead>
            <tbody>
              {compare.map(([label, other, us]) => (
                <tr key={label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="p-4 font-normal">{label}</th>
                  <td className="p-4"><Mark yes={other} /></td>
                  <td className="bg-plate-tint p-4"><Mark yes={us} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fees and guides */}
      <section className="border-y border-line bg-card">
        <div className={`${container} grid gap-12 py-16 lg:grid-cols-2`}>
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-2xl font-bold">Buyer fees by auction house</h2>
            <ul className="grid grid-cols-2 gap-3">
              {SELLER_LIST.map((s) => (
                <li key={s.id}>
                  <Link href={`/fees/${s.id}`} className="flex min-h-14 items-center justify-between rounded-xl border border-line bg-ground px-4 font-semibold hover:border-ink">
                    {s.name}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-2xl font-bold">NSW rego guides</h2>
            <ul className="flex flex-col gap-3">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="flex min-h-14 items-center justify-between gap-4 rounded-xl border border-line bg-ground px-4 py-2 font-semibold hover:border-ink">
                    {g.title}
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`${container} flex flex-col gap-8 py-16`}>
        <h2 className={h2}>Pay only when you are serious about a car</h2>
        <PricingCards />
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-card">
        <div className={`${container} grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <h2 className={h2}>Questions buyers ask</h2>
          <Faq />
        </div>
      </section>

      {/* Final call */}
      <section id="check" className="scroll-mt-20 bg-plate">
        <div className={`${container} grid items-center gap-10 py-16 lg:grid-cols-2`}>
          <div className="flex flex-col gap-4">
            <h2 className={h2}>Found a car? Check it before you pay.</h2>
            <p className="max-w-md text-lg leading-relaxed text-ink">
              It takes a VIN or a plate. You get the verdict and the steps in
              one page you can keep.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <CheckCard heading="Check this car" />
          </div>
        </div>
      </section>
    </>
  );
}
