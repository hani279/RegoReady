import { describe, expect, it } from "vitest";
import { parseRegcheck } from "./plates";

const wrap = (json: object) =>
  `<?xml version="1.0"?><Vehicle xmlns="http://regcheck.org.uk"><vehicleJson>${JSON.stringify(
    json,
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")}</vehicleJson></Vehicle>`;

describe("parseRegcheck", () => {
  it("reads the VIN and builds a description", () => {
    const m = parseRegcheck(
      wrap({
        Description: "FORD Fiesta 5D Hatchback",
        RegistrationYear: "2007",
        MakeDescription: "FORD",
        ModelDescription: "Fiesta 5D Hatchback",
        VechileIdentificationNumber: "wf0dxxgajd7k12345",
        Expiry: "",
        State: "NSW",
      }),
    );
    expect(m).toEqual({
      description: "2007 FORD Fiesta 5D Hatchback",
      vin: "WF0DXXGAJD7K12345",
      regoExpiry: undefined,
    });
  });

  it("accepts fields wrapped in CurrentTextValue", () => {
    const m = parseRegcheck(
      wrap({
        RegistrationYear: 2004,
        MakeDescription: { CurrentTextValue: "BMW" },
        ModelDescription: { CurrentTextValue: "325i & Co" },
        VechileIdentificationNumber: "WBAEV32040KL00001",
      }),
    );
    expect(m?.description).toBe("2004 BMW 325i & Co");
  });

  it("returns null without a usable VIN or vehicle", () => {
    expect(parseRegcheck(wrap({ Description: "x" }))).toBeNull();
    expect(parseRegcheck("<error>no</error>")).toBeNull();
    expect(parseRegcheck("<vehicleJson>not json</vehicleJson>")).toBeNull();
  });
});
