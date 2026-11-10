import { describe, expect, it } from "vitest";
import { stampDuty, vehicleTax } from "../fees/nsw";
import { mockProvider } from "../ppsr/mock";
import { bidCeiling, landedCost, type CostInput } from "./cost";
import { pathway } from "./pathway";

const base: CostInput = {
  seller: "pickles",
  price: 8500,
  gstExclusive: false,
  regoStatus: "unregistered",
  tareKg: 1400,
};

const line = (r: ReturnType<typeof landedCost>, key: string) =>
  r.lines.find((l) => l.key === key)?.amount;

describe("stampDuty", () => {
  it("charges $3 per $100 or part under $45,000", () => {
    expect(stampDuty(8500)).toBe(255);
    expect(stampDuty(8501)).toBe(258);
    expect(stampDuty(44999)).toBe(1350);
  });
  it("charges $1,350 plus $5 per $100 over $45,000", () => {
    expect(stampDuty(45000)).toBe(1350);
    expect(stampDuty(50000)).toBe(1600);
  });
});

describe("vehicleTax", () => {
  it("uses the tare weight band", () => {
    expect(vehicleTax(970)).toBe(278);
    expect(vehicleTax(971)).toBe(322);
    expect(vehicleTax(1400)).toBe(391);
  });
});

describe("landedCost", () => {
  it("prices an unregistered Pickles car", () => {
    const r = landedCost(base);
    expect(line(r, "buyerFee")).toBe(790.25);
    expect(line(r, "duty")).toBe(255);
    expect(line(r, "blueSlip")).toBe(82);
    expect(line(r, "transfer")).toBeUndefined();
    // 8500 + 790.25 + 255 + 82 + 84 + 391 + 58
    expect(r.total).toBe(10160.25);
    expect(r.excluded).toContain("CTP green slip (get a quote)");
  });

  it("uses the flat Pickles fee under $2,000", () => {
    expect(line(landedCost({ ...base, price: 1999 }), "buyerFee")).toBe(525);
  });

  it("adds GST and charges duty on the GST-inclusive price", () => {
    const r = landedCost({ ...base, gstExclusive: true });
    expect(line(r, "gst")).toBe(850);
    expect(line(r, "duty")).toBe(stampDuty(9350));
  });

  it("prices a private sale with current rego as price, duty and transfer", () => {
    const r = landedCost({ ...base, seller: "private", regoStatus: "current" });
    expect(r.lines.map((l) => l.key)).toEqual(["price", "duty", "transfer"]);
    expect(r.total).toBe(8500 + 255 + 42);
  });

  it("flags a missing buyer fee for houses with no schedule", () => {
    const r = landedCost({ ...base, seller: "grays" });
    expect(r.excluded.some((e) => e.includes("Grays"))).toBe(true);
    expect(line(landedCost({ ...base, seller: "grays", manualBuyerFee: 600 }), "buyerFee")).toBe(600);
  });
});

describe("bidCeiling", () => {
  const { price: _price, ...rest } = base;
  it("returns the highest price that fits the budget", () => {
    const ceiling = bidCeiling(10000, rest);
    expect(landedCost({ ...rest, price: ceiling }).total).toBeLessThanOrEqual(10000);
    expect(landedCost({ ...rest, price: ceiling + 50 }).total).toBeGreaterThan(10000);
  });
  it("returns 0 when the fixed costs alone exceed the budget", () => {
    expect(bidCeiling(500, rest)).toBe(0);
  });
});

describe("pathway", () => {
  const verdictFor = async (id: string) => pathway((await mockProvider.result(id))!);

  it("blocks stolen and written-off vehicles", async () => {
    expect((await verdictFor("TESTS")).verdict).toBe("blocked");
    expect((await verdictFor("TESTW")).verdict).toBe("blocked");
    const repairable = await verdictFor("TESTR");
    expect(repairable.verdict).toBe("blocked");
    expect(repairable.steps).toHaveLength(0);
  });

  it("warns when finance is owing but still gives the steps", async () => {
    const p = await verdictFor("TESTF");
    expect(p.verdict).toBe("caution");
    expect(p.steps.length).toBeGreaterThan(0);
  });

  it("gives a transfer path for current NSW rego", async () => {
    const p = await verdictFor("TESTC");
    expect(p.verdict).toBe("clear");
    expect(p.regoStatus).toBe("current");
  });

  it("gives a blue slip path for unregistered and interstate cars", async () => {
    expect((await verdictFor("TESTX")).regoStatus).toBe("unregistered");
    const interstate = await verdictFor("TESTI");
    expect(interstate.regoStatus).toBe("interstate");
    expect(interstate.steps.some((s) => s.title.includes("blue slip"))).toBe(true);
  });
});
