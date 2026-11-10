import type { PpsrProvider, VehicleRecord } from "./types";

// Demo provider used until a real PPSR/NEVDIS API key is configured.
// The last character of the identifier picks the scenario so every
// verdict can be exercised:
//   W = statutory write-off (NSW)   R = repairable write-off (QLD)
//   S = stolen                      F = finance owing
//   C = current NSW rego            I = interstate rego (VIC)
//   anything else = clean, NSW rego expired more than 3 months ago
export const mockProvider: PpsrProvider = {
  name: "mock",
  acceptsPlates: true,
  async start(identifier: string) {
    return identifier;
  },
  async result(identifier: string): Promise<VehicleRecord> {
    const id = identifier.trim().toUpperCase();
    const flag = id.slice(-1);
    const record: VehicleRecord = {
      identifier: id,
      vin: id.length === 17 ? id : "DEMO0000000000000",
      description: "Demo vehicle (sample data)",
      financeOwing: flag === "F",
      writtenOff:
        flag === "W" ? "statutory" : flag === "R" ? "repairable" : "none",
      writtenOffState: flag === "W" ? "NSW" : flag === "R" ? "QLD" : undefined,
      stolen: flag === "S",
      rego: {
        state: flag === "I" ? "VIC" : "NSW",
        status: flag === "C" || flag === "I" ? "current" : "expired",
        expiredOverThreeMonths: !(flag === "C" || flag === "I"),
      },
      searchedAt: new Date().toISOString(),
    };
    return record;
  },
};
