import Link from "next/link";
import type { Pathway, Verdict } from "@/lib/engine/pathway";
import { dollars } from "@/lib/format";
import type { VehicleRecord } from "@/lib/ppsr/types";

const banner: Record<Verdict, string> = {
  clear: "bg-clear",
  caution: "bg-ink",
  blocked: "bg-blocked",
};

function VerdictIcon({ verdict }: { verdict: Verdict }) {
  const common = {
    "aria-hidden": true,
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0",
  };
  if (verdict === "clear") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <path d="M7.5 12.5l3 3 6-6.5" />
      </svg>
    );
  }
  if (verdict === "blocked") {
    return (
      <svg {...common}>
        <path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18v.5" />
    </svg>
  );
}

function Check(props: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "bad";
}) {
  const tone = {
    ok: "text-clear-text",
    warn: "text-amber-text",
    bad: "font-bold text-blocked",
  }[props.tone];
  return (
    <li className="flex min-h-12 items-center justify-between gap-4 border-b border-[#e8eae4] py-2 text-sm last:border-b-0">
      <span>{props.label}</span>
      <span className={`text-right font-semibold ${tone}`}>{props.value}</span>
    </li>
  );
}

export default function ReportView(props: {
  record: VehicleRecord;
  pathway: Pathway;
  sample: boolean;
  compact?: boolean; // preview on the landing page: no actions or footnote
  certificateHref?: string; // our own download route for the PPSR certificate
}) {
  const { record, pathway, sample, compact, certificateHref } = props;
  const writtenOff =
    record.writtenOff === "none"
      ? "Not recorded"
      : `${{ statutory: "Statutory write-off", repairable: "Repairable write-off", unknown: "Written off" }[record.writtenOff]}${record.writtenOffState ? `, ${record.writtenOffState}` : ""}`;
  const rego =
    record.rego.status === "none"
      ? "None recorded"
      : `${record.rego.status[0].toUpperCase()}${record.rego.status.slice(1)}${record.rego.state ? `, ${record.rego.state}` : ""}`;
  const Heading = compact ? "p" : "h1";

  return (
    <div className="flex flex-col gap-5">
      {sample && !compact && (
        <p className="rounded-xl border border-amber-line bg-amber px-4 py-3 text-sm text-amber-text">
          Sample data. This is not a real register search.
        </p>
      )}
      <div className="flex flex-col gap-1">
        <Heading className="font-display text-2xl font-bold">
          {record.description}
        </Heading>
        <p className="font-mono text-[13px] text-muted">VIN {record.vin}</p>
      </div>

      <div
        className={`flex items-start gap-3.5 rounded-2xl p-5 text-white ${banner[pathway.verdict]}`}
      >
        <VerdictIcon verdict={pathway.verdict} />
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-bold">{pathway.headline}</p>
          <p className="text-sm leading-5">{pathway.summary}</p>
        </div>
      </div>

      <ul className="flex flex-col rounded-2xl border border-line bg-card px-4 py-1.5">
        <Check
          label="Finance owing"
          value={record.financeOwing ? "Recorded" : "None recorded"}
          tone={record.financeOwing ? "bad" : "ok"}
        />
        <Check
          label="Written-off"
          value={writtenOff}
          tone={record.writtenOff === "none" ? "ok" : "bad"}
        />
        <Check
          label="Stolen"
          value={record.stolen ? "Recorded as stolen" : "Not recorded"}
          tone={record.stolen ? "bad" : "ok"}
        />
        <Check
          label="Registration"
          value={rego}
          tone={record.rego.status === "current" ? "ok" : "warn"}
        />
      </ul>

      {!compact && pathway.reasons.length > 0 && (
        <section className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-lg font-bold">Why</h2>
          {pathway.reasons.map((r) => (
            <p key={r.text} className="text-sm leading-[21px] text-soft">
              {r.text}{" "}
              {r.source && (
                <a
                  href={r.source}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                >
                  Source
                </a>
              )}
            </p>
          ))}
        </section>
      )}

      {pathway.steps.length > 0 && (
        <section className="flex flex-col gap-2.5">
          {!compact && (
            <h2 className="font-display text-lg font-bold">Your path to rego</h2>
          )}
          <ol className="flex flex-col gap-2.5">
            {(compact ? pathway.steps.slice(0, 2) : pathway.steps).map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-3.5"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex grow flex-col gap-0.5">
                  <div className="flex justify-between gap-3 text-[15px] font-semibold">
                    <span>{s.title}</span>
                    {s.cost !== undefined && (
                      <span className="tabular-nums">{dollars(s.cost)}</span>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-[13px] leading-[19px] text-muted">
                      {s.detail}
                    </p>
                  )}
                  {!compact && s.source && (
                    <a
                      href={s.source}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-11 w-fit items-center text-[13px] font-semibold underline"
                    >
                      Official source
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!compact && (
        <>
          <div className="flex flex-col gap-2.5">
            {certificateHref && (
              <a
                href={certificateHref}
                className="flex min-h-[54px] items-center justify-center rounded-[10px] border-2 border-ink bg-plate font-display font-bold"
              >
                Download PPSR certificate
              </a>
            )}
            <Link
              href="/calculator"
              className="flex min-h-[54px] items-center justify-center rounded-[10px] border-2 border-ink bg-card font-display font-bold"
            >
              Work out the landed cost
            </Link>
          </div>
          <p className="text-xs leading-[18px] text-muted">
            General information, not legal advice. Register data as returned on{" "}
            {new Date(record.searchedAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            . Confirm with Service NSW before acting.
          </p>
        </>
      )}
    </div>
  );
}
