import { pathway } from "./engine/pathway";
import type { VehicleRecord } from "./ppsr/types";

// Fixed example used on the landing page and at /report/sample.
const base: VehicleRecord = {
  identifier: "SAMPLE",
  vin: "SAMPLE00000000000",
  description: "Sample: 2004 sedan, unregistered",
  financeOwing: false,
  writtenOff: "none",
  stolen: false,
  rego: { state: "NSW", status: "expired", expiredOverThreeMonths: true },
  searchedAt: "2026-11-10T00:00:00.000Z",
};

export const SAMPLE_CLEAR = { record: base, pathway: pathway(base) };

const blocked: VehicleRecord = {
  ...base,
  description: "Sample: 2012 hatch, statutory write-off",
  writtenOff: "statutory",
  writtenOffState: "NSW",
  rego: { state: "NSW", status: "cancelled", expiredOverThreeMonths: true },
};
export const SAMPLE_BLOCKED = { record: blocked, pathway: pathway(blocked) };

const caution: VehicleRecord = {
  ...base,
  description: "Sample: 2016 ute, finance owing",
  financeOwing: true,
  rego: { state: "NSW", status: "current", expiredOverThreeMonths: false },
};
export const SAMPLE_CAUTION = { record: caution, pathway: pathway(caution) };
