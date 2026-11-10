import {
  BLUE_SLIP_SOURCE,
  BLUE_SLIP_VALID_DAYS,
  DRIVE_UNREGISTERED_SOURCE,
  DUTY_SOURCE,
  NSW_FEES,
  TRANSFER_SOURCE,
  WRITTEN_OFF_SOURCE,
} from "../fees/nsw";
import type { VehicleRecord } from "../ppsr/types";
import type { RegoStatus } from "./cost";

export type Verdict = "clear" | "caution" | "blocked";

export interface PathwayStep {
  title: string;
  detail: string;
  cost?: number;
  source?: string;
}

export interface Pathway {
  verdict: Verdict;
  headline: string;
  summary: string;
  reasons: { text: string; source?: string }[];
  steps: PathwayStep[];
  regoStatus: RegoStatus;
}

export function regoStatusOf(record: VehicleRecord): RegoStatus {
  const { rego } = record;
  if (rego.state && rego.state !== "NSW" && rego.status === "current") {
    return "interstate";
  }
  if (rego.state === "NSW" && rego.status === "current") return "current";
  // Expired under 3 months can usually still be renewed, but the buyer
  // cannot rely on that: treat anything not current as unregistered.
  return "unregistered";
}

// The buyer is assumed to be a new owner (auction or private purchase),
// not the person who was the registered operator when any damage happened.
export function pathway(record: VehicleRecord): Pathway {
  const regoStatus = regoStatusOf(record);
  const reasons: Pathway["reasons"] = [];

  if (record.stolen) {
    return {
      verdict: "blocked",
      headline: "Do not buy",
      summary: "This vehicle is recorded as stolen.",
      reasons: [
        {
          text: "A stolen vehicle can be seized from you with no refund. Report the listing to the platform and to police.",
        },
      ],
      steps: [],
      regoStatus,
    };
  }

  if (record.writtenOff !== "none") {
    const state = record.writtenOffState ?? "an unknown state";
    const interstate = record.writtenOffState !== "NSW";
    reasons.push({
      text:
        record.writtenOff === "statutory"
          ? "Statutory write-offs are not eligible for an Authorisation to Repair, so they cannot be re-registered."
          : "A repairable write-off can only be re-registered by someone who was its registered operator for more than 28 days before the damage, had hail damage only, or inherited it. A new buyer does not qualify.",
      source: WRITTEN_OFF_SOURCE,
    });
    if (interstate) {
      reasons.push({
        text: "A vehicle written off in another state cannot be registered in NSW unless it is first re-registered in that state.",
        source: WRITTEN_OFF_SOURCE,
      });
    }
    reasons.push({
      text: "Written-off vehicles cannot get an unregistered vehicle permit, so it has to leave on a tow truck. Passing a blue slip does not change any of this.",
    });
    return {
      verdict: "blocked",
      headline: "Do not buy to drive it",
      summary: `Recorded as a ${record.writtenOff} write-off in ${state}. As a new buyer you cannot register it in NSW.`,
      reasons,
      steps: [],
      regoStatus,
    };
  }

  const steps: PathwayStep[] = [];
  if (regoStatus === "current") {
    steps.push({
      title: "Get the paperwork from the seller",
      detail:
        "Ask for the certificate of registration signed on the back, and check the seller lodges a notice of disposal. You cannot transfer online without it.",
      source: TRANSFER_SOURCE,
    });
    steps.push({
      title: "Transfer the rego within 14 days",
      detail: `Online or at Service NSW. After 14 days the fee is $${NSW_FEES.transferLate.amount}. No pink slip is needed to transfer current NSW rego.`,
      cost: NSW_FEES.transfer.amount,
      source: TRANSFER_SOURCE,
    });
    steps.push({
      title: "Pay stamp duty with the transfer",
      detail:
        "$3 per $100 of the price you paid or the market value, whichever is higher.",
      source: DUTY_SOURCE,
    });
  } else {
    steps.push({
      title: "Get it to an inspection station",
      detail: `Tow it, or drive it by the most direct route to a booked inspection. Keep the booking as proof. For any other trip you need a $${NSW_FEES.unregisteredPermit.amount} unregistered vehicle permit.`,
      source: DRIVE_UNREGISTERED_SOURCE,
    });
    steps.push({
      title: "Pass a blue slip",
      detail: `At an authorised inspection station. The report is valid for ${BLUE_SLIP_VALID_DAYS} days.`,
      cost: NSW_FEES.blueSlip.amount,
      source: BLUE_SLIP_SOURCE,
    });
    steps.push({
      title: "Buy a CTP green slip",
      detail: "Compare quotes. You need it before the car can be registered.",
    });
    steps.push({
      title: "Register at a Service NSW centre",
      detail: `Bring ID, proof of purchase and the blue slip. You pay the $${NSW_FEES.registration.amount} registration fee, $${NSW_FEES.plates.amount} for plates, motor vehicle tax by weight, and stamp duty.`,
      cost: NSW_FEES.registration.amount + NSW_FEES.plates.amount,
      source: NSW_FEES.registration.source,
    });
  }

  if (record.financeOwing) {
    return {
      verdict: "caution",
      headline: "Finance is owing on this car",
      summary:
        "It can be registered, but a lender has a registered interest in it. Sort that out before you pay.",
      reasons: [
        {
          text: "If the debt is not cleared, the lender can repossess the car from you. Ask the seller for a payout letter and pay the lender directly, or ask the auction house to confirm in writing that it guarantees clear title.",
        },
      ],
      steps,
      regoStatus,
    };
  }

  return {
    verdict: "clear",
    headline: "Can be registered in NSW",
    summary:
      regoStatus === "current"
        ? "NSW rego is current. You only need to transfer it."
        : regoStatus === "interstate"
          ? "It is registered in another state, so it needs a blue slip and new NSW registration."
          : "It is unregistered, so it needs a blue slip and new registration.",
    reasons,
    steps,
    regoStatus,
  };
}
