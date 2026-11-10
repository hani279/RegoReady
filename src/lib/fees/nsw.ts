// NSW government fees and rules. Every figure carries its source and a
// status so the UI can flag anything that has not been read from the
// official page. See docs/fee-data.md for the research notes.

export type FeeStatus = "confirmed" | "unconfirmed";

export interface Fee {
  amount: number;
  label: string;
  source: string;
  status: FeeStatus;
}

export const LAST_VERIFIED = "2026-11-10";

const INSPECTION_FEES =
  "https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/fees-concessions-and-forms/vehicle-safety-check-and-inspection-fees";
const REGO_FEES =
  "https://www.nsw.gov.au/driving-boating-and-transport/driving-nsw/vehicle-registration/fees-concessions-and-forms/vehicle-registration-fees";
export const DUTY_SOURCE =
  "https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/motor-vehicle-duty";
export const BLUE_SLIP_SOURCE =
  "https://www.service.nsw.gov.au/transaction/get-an-authorised-unregistered-vehicle-inspection-blue-slip";
export const DRIVE_UNREGISTERED_SOURCE =
  "https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/unregistered-vehicles/when-you-can-drive-an-unregistered-vehicle";
export const TRANSFER_SOURCE =
  "https://www.service.nsw.gov.au/transaction/transfer-a-vehicle-registration";
export const WRITTEN_OFF_SOURCE =
  "https://www.nsw.gov.au/driving-boating-and-transport/vehicle-registration/written-off-vehicles/re-registering-a-written-off-light-vehicle";

export const NSW_FEES = {
  blueSlip: {
    amount: 82,
    label: "Blue slip inspection",
    source: INSPECTION_FEES,
    status: "confirmed",
  },
  pinkSlip: {
    amount: 52,
    label: "Pink slip safety check",
    source: INSPECTION_FEES,
    status: "confirmed",
  },
  writtenOffInspection: {
    amount: 651,
    label: "Written-off vehicle inspection",
    source: INSPECTION_FEES,
    status: "confirmed",
  },
  registration: {
    amount: 84,
    label: "Registration fee (12 months)",
    source: REGO_FEES,
    status: "confirmed",
  },
  plates: {
    amount: 58,
    label: "Number plates",
    source: REGO_FEES,
    status: "confirmed",
  },
  transfer: {
    amount: 42,
    label: "Transfer fee",
    source: REGO_FEES,
    status: "confirmed",
  },
  transferLate: {
    amount: 193,
    label: "Transfer fee (after 14 days)",
    source: REGO_FEES,
    status: "confirmed",
  },
  unregisteredPermit: {
    amount: 28,
    label: "Unregistered vehicle permit",
    source: REGO_FEES,
    status: "confirmed",
  },
} as const satisfies Record<string, Fee>;

export const TRANSFER_DEADLINE_DAYS = 14;
export const BLUE_SLIP_VALID_DAYS = 42;

// Motor vehicle tax for privately used cars and station wagons, per year.
export const VEHICLE_TAX_PRIVATE: { maxTareKg: number; amount: number }[] = [
  { maxTareKg: 970, amount: 278 },
  { maxTareKg: 1150, amount: 322 },
  { maxTareKg: 1500, amount: 391 },
  { maxTareKg: 2500, amount: 596 },
  { maxTareKg: 2790, amount: 860 },
  { maxTareKg: 3050, amount: 977 },
  { maxTareKg: 3300, amount: 1070 },
  { maxTareKg: 3560, amount: 1164 },
  { maxTareKg: 3810, amount: 1249 },
  { maxTareKg: 4060, amount: 1343 },
  { maxTareKg: 4320, amount: 1434 },
  { maxTareKg: 4500, amount: 1525 },
];

export const VEHICLE_TAX_SOURCE = REGO_FEES;

export function vehicleTax(tareKg: number): number {
  const band = VEHICLE_TAX_PRIVATE.find((b) => tareKg <= b.maxTareKg);
  if (!band) {
    throw new Error("Vehicles over 4,500 kg tare are heavy vehicles");
  }
  return band.amount;
}

// Motor vehicle duty: $3 per $100 (or part) under $45,000; for passenger
// vehicles at $45,000 or more, $1,350 plus $5 per $100 (or part) over
// $45,000. The "or part" rounding and the over-$45,000 base should be
// cross-checked against the Revenue NSW calculator before launch.
export function stampDuty(dutiableValue: number): number {
  if (dutiableValue <= 0) return 0;
  if (dutiableValue < 45000) {
    return Math.ceil(dutiableValue / 100) * 3;
  }
  return 1350 + Math.ceil((dutiableValue - 45000) / 100) * 5;
}
