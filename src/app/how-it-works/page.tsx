import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Blocks";
import ReportView from "@/components/ReportView";
import { SAMPLE_BLOCKED, SAMPLE_CAUTION, SAMPLE_CLEAR } from "@/lib/sample";
import { btnPrimary, btnSecondary, card, container, eyebrow, h2 } from "@/lib/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Work out the landed cost, check the exact car, then follow the steps to NSW registration.",
};

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

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="A history report says what the car was. We tell you what happens next."
      />
      <div className={`${container} flex flex-col gap-14 pb-16`}>
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

        <section className="flex flex-col gap-6">
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
                <div className={`${card} p-4`}>
                  <ReportView {...v.data} sample compact />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className={h2}>More than a history check</h2>
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

        <div className="flex flex-wrap gap-3">
          <Link href="/calculator" className={btnPrimary}>
            Work out my cost
          </Link>
          <Link href="/check" className={btnSecondary}>
            Check a car
          </Link>
        </div>
      </div>
    </>
  );
}
