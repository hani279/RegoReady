// What we need back from a PPSR + NEVDIS vehicle search, whichever
// provider supplies it.

export type WrittenOffType = "none" | "statutory" | "repairable";

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
  certificateUrl?: string; // official PPSR search certificate
  searchedAt: string; // ISO timestamp
}

export interface PpsrProvider {
  name: string;
  lookup(identifier: string): Promise<VehicleRecord>;
}
