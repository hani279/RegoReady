import type { Metadata } from "next";
import { PageHeader } from "@/components/Blocks";
import {
  DUTY_SOURCE,
  NSW_FEES,
  VEHICLE_TAX_PRIVATE,
  VEHICLE_TAX_SOURCE,
} from "@/lib/fees/nsw";
import { SELLER_LIST } from "@/lib/fees/sellers";
import { dollars } from "@/lib/format";
import { VERIFIED_LABEL } from "@/lib/site";
import { card, container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Sources and fee data",
  description:
    "Every fee RegoReady uses, where it comes from, and whether it has been confirmed.",
};

function Status({ status }: { status: "confirmed" | "unconfirmed" }) {
  return status === "confirmed" ? (
    <span className="font-semibold text-clear-text">Confirmed</span>
  ) : (
    <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-semibold text-amber-text">
      Unconfirmed
    </span>
  );
}

const th = "p-4 font-semibold text-soft";
const td = "p-4 align-top";

function SourceLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-semibold underline">
      Source
    </a>
  );
}

export default function SourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sources"
        title="Where every number comes from"
        intro={`Fees were last checked on ${VERIFIED_LABEL}. Confirmed means read from the official page on that date. Unconfirmed means we could not open the official schedule and you should check the listing.`}
      />
      <div className={`${container} flex flex-col gap-10 pb-16`}>
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-bold">NSW government fees</h2>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[520px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={th}>Fee</th>
                  <th scope="col" className={`${th} text-right`}>Amount</th>
                  <th scope="col" className={th}>Status</th>
                  <th scope="col" className={th}>Source</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(NSW_FEES).map((f) => (
                  <tr key={f.label} className="border-b border-line">
                    <th scope="row" className={`${td} font-normal`}>{f.label}</th>
                    <td className={`${td} text-right font-semibold tabular-nums`}>{dollars(f.amount)}</td>
                    <td className={td}><Status status={f.status} /></td>
                    <td className={td}><SourceLink href={f.source} /></td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className={`${td} font-normal`}>
                    Stamp duty
                    <span className="block text-sm text-muted">
                      $3 per $100 under $45,000; $1,350 plus $5 per $100 over $45,000 for passenger vehicles
                    </span>
                  </th>
                  <td className={`${td} text-right font-semibold`}>By value</td>
                  <td className={td}><Status status="confirmed" /></td>
                  <td className={td}><SourceLink href={DUTY_SOURCE} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-bold">
            Motor vehicle tax, private cars, per year
          </h2>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[360px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={th}>Tare weight</th>
                  <th scope="col" className={`${th} text-right`}>Tax</th>
                </tr>
              </thead>
              <tbody>
                {VEHICLE_TAX_PRIVATE.map((b, i, all) => (
                  <tr key={b.maxTareKg} className="border-b border-line last:border-b-0">
                    <th scope="row" className={`${td} font-normal tabular-nums`}>
                      {i === 0
                        ? `Up to ${b.maxTareKg} kg`
                        : `${all[i - 1].maxTareKg + 1} to ${b.maxTareKg} kg`}
                    </th>
                    <td className={`${td} text-right font-semibold tabular-nums`}>{dollars(b.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm"><SourceLink href={VEHICLE_TAX_SOURCE} /></p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-2xl font-bold">Buyer fees</h2>
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[520px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={th}>Seller</th>
                  <th scope="col" className={th}>Fee</th>
                  <th scope="col" className={th}>Status</th>
                  <th scope="col" className={th}>Source</th>
                </tr>
              </thead>
              <tbody>
                {SELLER_LIST.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-b-0">
                    <th scope="row" className={`${td} font-semibold`}>{s.name}</th>
                    <td className={td}>{s.feeNote}</td>
                    <td className={td}><Status status={s.status} /></td>
                    <td className={td}><SourceLink href={s.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
