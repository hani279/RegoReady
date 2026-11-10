// What we need back from a PPSR + NEVDIS vehicle search, whichever
// provider supplies it.

// "unknown": the register reports a write-off but not which kind.
export type WrittenOffType = "none" | "statutory" | "repairable" | "unknown";

export interface VehicleRecord {
  identifier: string; // the VIN or plate that was searched
  vin: string;
  description: string; // e.g. "2004 BMW 325i"
  financeOwing: boolean;
  writtenOff: WrittenOffType;
  writtenOffState?: string; // jurisdiction that recorded the write-off
  stolen: boolean;
  rego: {
    state: string | null; // null when never registered or unknown
    status: "current" | "expired" | "cancelled" | "none";
    expiredOverThreeMonths: boolean;
  };
  // Provider URL of the official PPSR search certificate. It needs the
  // provider key, so buyers download it through /report/[id]/certificate.
  certificateUrl?: string;
  searchedAt: string; // ISO timestamp
}

export class PpsrError extends Error {}

// Searches can take a while, so a lookup is two steps: start it and keep
// the reference, then ask for the result until it is ready.
export interface PpsrProvider {
  name: string;
  // False when the provider can only search by VIN.
  acceptsPlates: boolean;
  start(identifier: string): Promise<string>;
  // Resolves to null while the search is still running.
  result(ref: string): Promise<VehicleRecord | null>;
  // Fetches the certificate PDF for a finished search.
  certificate?(record: VehicleRecord): Promise<Response>;
}
