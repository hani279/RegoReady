// Turns a number plate into a vehicle, so a buyer can type the plate from
// a listing and we can run the register search on the VIN behind it.
//
// PLATE_PROVIDER selects the source:
//   "mock"     sample data (the default while the register search is also
//              the demo provider)
//   "regcheck" carregistrationapi.com.au, needs REGCHECK_USERNAME
//   "none"     plates are not accepted; buyers enter the VIN

export interface PlateMatch {
  description: string; // e.g. "2007 FORD Fiesta 5D Hatchback"
  // Null in demo mode, where the plate itself is what gets searched.
  vin: string | null;
  regoExpiry?: string;
}

export const PLATE_PATTERN = /^[A-Z0-9]{2,6}$/;

function providerName(): string {
  if (process.env.PLATE_PROVIDER) return process.env.PLATE_PROVIDER;
  return (process.env.PPSR_PROVIDER ?? "mock") === "mock" ? "mock" : "none";
}

export function platesEnabled(): boolean {
  return providerName() !== "none";
}

// The provider's ASMX service: an HTTP GET returns XML whose vehicleJson
// element holds the vehicle as JSON. REGCHECK_HOST exists so tests can
// point at a local stand-in.
const REGCHECK_HOST = () =>
  process.env.REGCHECK_HOST ?? "https://www.regcheck.org.uk";

const unescapeXml = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

// Fields arrive either as plain strings or as { CurrentTextValue }.
function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "CurrentTextValue" in value) {
    return text((value as { CurrentTextValue: unknown }).CurrentTextValue);
  }
  return "";
}

export function parseRegcheck(xml: string): PlateMatch | null {
  const match = xml.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/);
  if (!match) return null;
  let vehicle: Record<string, unknown>;
  try {
    vehicle = JSON.parse(unescapeXml(match[1]));
  } catch {
    return null;
  }
  // The provider's field name really is spelled this way.
  const vin = text(vehicle.VechileIdentificationNumber).toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return null;

  const year = text(vehicle.RegistrationYear);
  const make = text(vehicle.MakeDescription) || text(vehicle.CarMake);
  const model = text(vehicle.ModelDescription) || text(vehicle.CarModel);
  const description =
    [year, make, model].filter(Boolean).join(" ") ||
    text(vehicle.Description) ||
    "Vehicle";
  return { description, vin, regoExpiry: text(vehicle.Expiry) || undefined };
}

async function regcheck(plate: string, state: string): Promise<PlateMatch | null> {
  const username = process.env.REGCHECK_USERNAME;
  if (!username) throw new Error("REGCHECK_USERNAME is not set");
  const url = new URL("/api/reg.asmx/CheckAustralia", REGCHECK_HOST());
  url.searchParams.set("RegistrationNumber", plate);
  url.searchParams.set("State", state);
  url.searchParams.set("username", username);

  const res = await fetch(url, { cache: "no-store" });
  const body = await res.text();
  if (!res.ok) {
    // The service answers an unknown plate with an error status, but also
    // an invalid username or an empty credit balance, so keep the detail.
    console.error("Plate lookup failed", res.status, body.slice(0, 200));
    return null;
  }
  return parseRegcheck(body);
}

export async function lookupPlate(
  plate: string,
  state = "NSW",
): Promise<PlateMatch | null> {
  const name = providerName();
  if (name === "mock") {
    return { description: "Demo vehicle (sample data)", vin: null };
  }
  if (name === "regcheck") return regcheck(plate, state);
  return null;
}
