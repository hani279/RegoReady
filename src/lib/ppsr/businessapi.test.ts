import { describe, expect, it } from "vitest";
import { pathway } from "../engine/pathway";
import { toRecord } from "./businessapi";

const search = (vehicle: object, registrations: unknown[] = []) => ({
  requestId: "req_1",
  status: "completed" as const,
  data: {
    registrations,
    nevdisData: { vehicles: [{ vin: "ZAM57YTA0T0000042", make: "BMW", model: "325i", year: 2004, ...vehicle }] },
    certificates: [{ downloadUrl: "/api/v2/ppsr/searches/req_1/certificates/c1" }],
  },
});

const future = new Date(Date.now() + 90 * 864e5).toISOString();
const longAgo = new Date(Date.now() - 200 * 864e5).toISOString();

describe("toRecord", () => {
  it("maps a clean vehicle with null stolen and writtenOff", () => {
    const r = toRecord("X", search({ stolen: null, writtenOff: null, registrationExpiry: longAgo }));
    expect(r.description).toBe("2004 BMW 325i");
    expect(r.stolen).toBe(false);
    expect(r.writtenOff).toBe("none");
    expect(r.financeOwing).toBe(false);
    expect(r.rego.status).toBe("expired");
    expect(r.rego.expiredOverThreeMonths).toBe(true);
    expect(r.certificateUrl).toContain("/certificates/c1");
    expect(pathway(r).verdict).toBe("clear");
  });

  it("reads the write-off type and state from whatever shape comes back", () => {
    const r = toRecord("X", search({ writtenOff: [{ type: "Statutory Write-off", jurisdiction: "NSW" }] }));
    expect(r.writtenOff).toBe("statutory");
    expect(r.writtenOffState).toBe("NSW");
    expect(toRecord("X", search({ writtenOff: "Repairable write-off (QLD)" })).writtenOff).toBe("repairable");
  });

  it("blocks a write-off of unknown type", () => {
    const r = toRecord("X", search({ writtenOff: true }));
    expect(r.writtenOff).toBe("unknown");
    expect(pathway(r).verdict).toBe("blocked");
  });

  it("flags stolen and finance owing", () => {
    expect(toRecord("X", search({ stolen: { reported: "2026-01-01" } })).stolen).toBe(true);
    expect(toRecord("X", search({ stolen: "No" })).stolen).toBe(false);
    expect(toRecord("X", search({}, [{ registrationNumber: "1" }])).financeOwing).toBe(true);
  });

  it("treats current rego of unknown state as NSW and says so", () => {
    const r = toRecord("X", search({ registrationExpiry: future }));
    expect(r.rego.status).toBe("current");
    const p = pathway(r);
    expect(p.regoStatus).toBe("current");
    expect(p.reasons.some((x) => x.text.includes("not which state"))).toBe(true);
  });

  it("copes with no NEVDIS vehicle", () => {
    const r = toRecord("X", { requestId: "r", status: "completed", data: {} });
    expect(r.vin).toBe("");
    expect(r.rego.status).toBe("none");
  });
});
