"use client";

import { useId, useState } from "react";
import {
  bidCeiling,
  landedCost,
  type CostInput,
  type RegoStatus,
} from "@/lib/engine/cost";
import { VEHICLE_TAX_PRIVATE } from "@/lib/fees/nsw";
import { SELLERS, SELLER_LIST, type SellerId } from "@/lib/fees/sellers";
import { dollars, money } from "@/lib/format";

type Mode = "cost" | "ceiling";

const num = (s: string) => {
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const optional = (s: string) => (s.trim() === "" ? undefined : num(s));

const fieldClass =
  "h-12 w-full rounded-lg border border-field bg-white px-3 text-base font-medium text-ink";
const labelClass = "text-[13px] font-semibold text-soft";

function Choice<T extends string>(props: {
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={`${labelClass} mb-1.5`}>{props.legend}</legend>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${props.options.length}, minmax(0, 1fr))`,
        }}
      >
        {props.options.map((o) => {
          const on = o.value === props.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => props.onChange(o.value)}
              className={`min-h-11 rounded-lg px-2 text-[13px] ${
                on
                  ? "border-2 border-ink bg-plate-tint font-semibold text-ink"
                  : "border border-field bg-white font-medium text-soft"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Calculator({
  initialSeller = "pickles",
}: {
  initialSeller?: SellerId;
}) {
  const id = useId();
  const [mode, setMode] = useState<Mode>("cost");
  const [seller, setSeller] = useState<SellerId>(initialSeller);
  const [price, setPrice] = useState("8500");
  const [budget, setBudget] = useState("10000");
  const [gst, setGst] = useState<"incl" | "excl">("incl");
  const [rego, setRego] = useState<RegoStatus>("unregistered");
  const [tare, setTare] = useState(1500);
  const [manualFee, setManualFee] = useState("");
  const [towing, setTowing] = useState("");
  const [ctp, setCtp] = useState("");

  const s = SELLERS[seller];
  const isAuction = s.kind === "auction";
  const shared: Omit<CostInput, "price"> = {
    seller,
    gstExclusive: isAuction && gst === "excl",
    regoStatus: rego,
    tareKg: tare,
    manualBuyerFee: s.buyerFee ? undefined : optional(manualFee),
    towing: optional(towing),
    ctpQuote: rego === "current" ? undefined : optional(ctp),
  };
  const ceiling = mode === "ceiling" ? bidCeiling(num(budget), shared) : 0;
  const result = landedCost({
    ...shared,
    price: mode === "ceiling" ? ceiling : num(price),
  });
  const priceWord = isAuction ? "hammer" : "price";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form
        className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-[#e3e5df] p-1">
          {(
            [
              ["cost", "Landed cost"],
              ["ceiling", isAuction ? "Bid ceiling" : "Offer ceiling"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className={`min-h-11 rounded-[7px] text-sm font-semibold ${
                mode === value ? "bg-ink text-white" : "text-soft"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-seller`} className={labelClass}>
            Where are you buying?
          </label>
          <select
            id={`${id}-seller`}
            className={fieldClass}
            value={seller}
            onChange={(e) => setSeller(e.target.value as SellerId)}
          >
            {SELLER_LIST.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </div>

        {mode === "cost" ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-price`} className={labelClass}>
              {isAuction ? "Hammer price" : "Agreed price"}
            </label>
            <input
              id={`${id}-price`}
              inputMode="decimal"
              className={`${fieldClass} text-lg font-semibold tabular-nums`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-budget`} className={labelClass}>
              Your all-in budget
            </label>
            <input
              id={`${id}-budget`}
              inputMode="decimal"
              className={`${fieldClass} text-lg font-semibold tabular-nums`}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        )}

        {isAuction && !s.buyerFee && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-fee`} className={labelClass}>
              Buyer fee from the listing ($)
            </label>
            <input
              id={`${id}-fee`}
              inputMode="decimal"
              className={fieldClass}
              placeholder={s.feeNote}
              value={manualFee}
              onChange={(e) => setManualFee(e.target.value)}
            />
          </div>
        )}

        {isAuction && (
          <Choice
            legend="Price on the listing is"
            value={gst}
            onChange={setGst}
            options={[
              { value: "incl", label: "GST included" },
              { value: "excl", label: "Plus GST" },
            ]}
          />
        )}

        <Choice
          legend="Registration"
          value={rego}
          onChange={setRego}
          options={[
            { value: "current", label: "NSW rego" },
            { value: "unregistered", label: "Unregistered" },
            { value: "interstate", label: "Interstate" },
          ]}
        />

        {rego !== "current" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-tare`} className={labelClass}>
                Tare weight (sets the vehicle tax)
              </label>
              <select
                id={`${id}-tare`}
                className={fieldClass}
                value={tare}
                onChange={(e) => setTare(Number(e.target.value))}
              >
                {VEHICLE_TAX_PRIVATE.slice(0, 5).map((b, i, all) => (
                  <option key={b.maxTareKg} value={b.maxTareKg}>
                    {i === 0
                      ? `Up to ${b.maxTareKg} kg`
                      : `${all[i - 1].maxTareKg + 1} to ${b.maxTareKg} kg`}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-ctp`} className={labelClass}>
                  CTP quote ($)
                </label>
                <input
                  id={`${id}-ctp`}
                  inputMode="decimal"
                  className={fieldClass}
                  placeholder="Optional"
                  value={ctp}
                  onChange={(e) => setCtp(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-tow`} className={labelClass}>
                  Towing ($)
                </label>
                <input
                  id={`${id}-tow`}
                  inputMode="decimal"
                  className={fieldClass}
                  placeholder="Optional"
                  value={towing}
                  onChange={(e) => setTowing(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
      </form>

      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="flex flex-col gap-2 rounded-2xl bg-ink p-5 text-white">
          {mode === "ceiling" ? (
            <>
              <div className="text-sm font-semibold">
                {isAuction ? "Stop bidding at" : "Offer no more than"}
              </div>
              <div className="font-display text-5xl font-bold tabular-nums">
                {dollars(ceiling)}
              </div>
              <div className="text-[13px] text-[#c9cec6]">
                {ceiling > 0
                  ? `That lands at ${money(result.total)} all-in.`
                  : "The fixed costs alone are over this budget."}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold">
                All-in to get it on the road
              </div>
              <div className="font-display text-5xl font-bold tabular-nums">
                {money(result.total)}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-plate px-2.5 py-1 font-semibold text-ink">
                  {dollars(Math.round(result.overPrice))} over {priceWord} (
                  {result.overPricePct.toFixed(1)}%)
                </span>
              </div>
            </>
          )}
          {result.excluded.length > 0 && (
            <div className="text-[13px] text-white">
              Not included: {result.excluded.join("; ")}.
            </div>
          )}
        </div>

        <ul className="flex flex-col rounded-2xl border border-line bg-card px-4 py-1.5">
          {result.lines.map((l) => (
            <li
              key={l.key}
              className="flex min-h-12 items-center justify-between gap-4 border-b border-[#e8eae4] py-2 text-sm last:border-b-0"
            >
              <span>
                {l.label}
                {l.status === "unconfirmed" && (
                  <span className="ml-2 rounded-full bg-amber px-2 py-0.5 text-[11px] font-semibold text-amber-text">
                    check the listing
                  </span>
                )}
                {l.detail && (
                  <span className="block text-xs text-muted">{l.detail}</span>
                )}
                {l.source && (
                  <a
                    href={l.source}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-fit text-xs font-medium text-soft underline"
                  >
                    Source
                  </a>
                )}
              </span>
              <span className="font-semibold tabular-nums">
                {money(l.amount)}
              </span>
            </li>
          ))}
        </ul>

        {result.warnings.map((w) => (
          <p
            key={w}
            className="rounded-2xl border border-amber-line bg-amber px-4 py-3 text-sm leading-5 text-amber-text"
          >
            {w}
          </p>
        ))}
      </div>
    </div>
  );
}
