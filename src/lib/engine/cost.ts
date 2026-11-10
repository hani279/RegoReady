import {
  DUTY_SOURCE,
  NSW_FEES,
  VEHICLE_TAX_SOURCE,
  stampDuty,
  vehicleTax,
  type FeeStatus,
} from "../fees/nsw";
import { SELLERS, type SellerId } from "../fees/sellers";

// "current": NSW rego is current and transfers with the car.
// "unregistered": expired more than 3 months ago, or no plates.
// "interstate": registered in, or brought from, another state.
export type RegoStatus = "current" | "unregistered" | "interstate";

export interface CostInput {
  seller: SellerId;
  price: number; // hammer price, or agreed price for a private sale
  gstExclusive: boolean; // listing price is "plus GST"
  regoStatus: RegoStatus;
  tareKg: number;
  manualBuyerFee?: number; // for houses with no published schedule
  towing?: number;
  ctpQuote?: number;
}

export interface CostLine {
  key: string;
  label: string;
  detail?: string;
  amount: number;
  source?: string;
  status: FeeStatus;
}

export interface CostResult {
  lines: CostLine[];
  total: number;
  overPrice: number;
  overPricePct: number;
  // Costs we could not price, so the total is a floor.
  excluded: string[];
  warnings: string[];
}

const cents = (n: number) => Math.round(n * 100) / 100;

export function landedCost(input: CostInput): CostResult {
  const seller = SELLERS[input.seller];
  const price = Math.max(0, input.price);
  const lines: CostLine[] = [];
  const excluded: string[] = [];
  const warnings: string[] = [];

  lines.push({
    key: "price",
    label: seller.kind === "auction" ? "Hammer price" : "Agreed price",
    amount: price,
    status: "confirmed",
  });

  const gst = input.gstExclusive ? cents(price * 0.1) : 0;
  if (gst > 0) {
    lines.push({
      key: "gst",
      label: "GST on the price",
      detail: "The listing is plus GST",
      amount: gst,
      status: "confirmed",
    });
  }

  if (seller.kind === "auction") {
    const fee = seller.buyerFee
      ? cents(seller.buyerFee(price))
      : (input.manualBuyerFee ?? 0);
    lines.push({
      key: "buyerFee",
      label: `${seller.name} buyer fee`,
      detail: seller.feeNote,
      amount: fee,
      source: seller.source,
      status: seller.status,
    });
    if (!seller.buyerFee && input.manualBuyerFee === undefined) {
      excluded.push(`${seller.name} buyer fee (enter it from the listing)`);
    }
    if (seller.storageNote) warnings.push(seller.storageNote);
  }

  // Duty is charged on the higher of price paid or market value, GST included.
  lines.push({
    key: "duty",
    label: "NSW stamp duty",
    detail: "$3 per $100 of the price or market value, whichever is higher",
    amount: stampDuty(price + gst),
    source: DUTY_SOURCE,
    status: "confirmed",
  });

  if (input.regoStatus === "current") {
    lines.push({
      key: "transfer",
      label: NSW_FEES.transfer.label,
      detail: "Within 14 days of getting the car",
      amount: NSW_FEES.transfer.amount,
      source: NSW_FEES.transfer.source,
      status: "confirmed",
    });
    warnings.push(
      `Transfer the rego within 14 days or the fee rises from $${NSW_FEES.transfer.amount} to $${NSW_FEES.transferLate.amount}.`,
    );
  } else {
    lines.push({
      key: "blueSlip",
      label: NSW_FEES.blueSlip.label,
      detail:
        input.regoStatus === "interstate"
          ? "Needed for a car from another state"
          : "Needed because it is unregistered",
      amount: NSW_FEES.blueSlip.amount,
      source: NSW_FEES.blueSlip.source,
      status: "confirmed",
    });
    lines.push({
      key: "registration",
      label: NSW_FEES.registration.label,
      amount: NSW_FEES.registration.amount,
      source: NSW_FEES.registration.source,
      status: "confirmed",
    });
    lines.push({
      key: "vehicleTax",
      label: "Motor vehicle tax (12 months)",
      detail: `Private use, ${input.tareKg.toLocaleString("en-AU")} kg tare`,
      amount: vehicleTax(input.tareKg),
      source: VEHICLE_TAX_SOURCE,
      status: "confirmed",
    });
    lines.push({
      key: "plates",
      label: NSW_FEES.plates.label,
      amount: NSW_FEES.plates.amount,
      source: NSW_FEES.plates.source,
      status: "confirmed",
    });
    if (input.ctpQuote !== undefined) {
      lines.push({
        key: "ctp",
        label: "CTP green slip",
        detail: "Your quote",
        amount: input.ctpQuote,
        status: "confirmed",
      });
    } else {
      excluded.push("CTP green slip (get a quote)");
    }
    if (input.regoStatus === "interstate") {
      warnings.push(
        "Some interstate vehicles also need a Vehicle Inspectorate check with an $87 booking fee.",
      );
    }
  }

  if (input.towing) {
    lines.push({
      key: "towing",
      label: "Towing",
      detail: "Your estimate",
      amount: input.towing,
      status: "confirmed",
    });
  }

  const total = cents(lines.reduce((sum, l) => sum + l.amount, 0));
  const overPrice = cents(total - price);
  return {
    lines,
    total,
    overPrice,
    overPricePct: price > 0 ? cents((overPrice / price) * 100) : 0,
    excluded,
    warnings,
  };
}

// The highest price, rounded down to `step`, whose landed cost fits the
// budget. Returns 0 when even a $0 car is over budget.
export function bidCeiling(
  budget: number,
  input: Omit<CostInput, "price">,
  step = 50,
): number {
  const fits = (price: number) => landedCost({ ...input, price }).total <= budget;
  if (!fits(0)) return 0;
  let lo = 0;
  let hi = Math.ceil(budget / step);
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (fits(mid * step)) lo = mid;
    else hi = mid - 1;
  }
  return lo * step;
}
