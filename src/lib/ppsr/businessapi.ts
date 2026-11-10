import {
  PpsrError,
  type PpsrProvider,
  type VehicleRecord,
  type WrittenOffType,
} from "./types";

// Business API PPSR searches (https://businessapi.com.au/developers/api/ppsr-searches).
// POST /ppsr/searches with a VIN starts an asynchronous search; GET
// /ppsr/searches/{requestId} returns its status and, once completed, the
// PPSR registrations, NEVDIS vehicle data and certificates.
//
// The environment is chosen by the URL, and must match the key: test keys
// start with bapi_sk_test_, live keys with bapi_sk_live_.

// BUSINESSAPI_HOST exists so tests can point at a local stand-in.
const HOST = process.env.BUSINESSAPI_HOST ?? "https://businessapi.com.au";

function config() {
  const key = process.env.BUSINESSAPI_KEY;
  if (!key) throw new PpsrError("BUSINESSAPI_KEY is not set");
  const live = key.startsWith("bapi_sk_live_");
  return { key, base: `${HOST}/api/${live ? "" : "test/"}v2/ppsr/searches` };
}

async function call(url: string, init?: RequestInit): Promise<Response> {
  const { key } = config();
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok && res.status !== 202) {
    const body = await res.text().catch(() => "");
    throw new PpsrError(
      `Business API returned ${res.status}: ${body.slice(0, 300)}`,
    );
  }
  return res;
}

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

// The docs list `stolen` and `writtenOff` on each NEVDIS vehicle but do
// not document their shape (the published example shows null). Treat
// null, false, "" and empty collections as "nothing recorded", and
// anything else as a record, reading the type out of whatever is there.
function recorded(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return false;
  if (typeof value === "string") {
    return !/^(|no|none|false|n|not recorded)$/i.test(value.trim());
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return Boolean(value);
}

function writtenOffType(value: unknown): WrittenOffType {
  if (!recorded(value)) return "none";
  const text = JSON.stringify(value).toLowerCase();
  if (text.includes("statutory")) return "statutory";
  if (text.includes("repairable")) return "repairable";
  return "unknown";
}

function stateIn(value: unknown): string | undefined {
  const text = JSON.stringify(value ?? "").toUpperCase();
  return STATES.find((s) => new RegExp(`\\b${s}\\b`).test(text));
}

interface ApiVehicle {
  vin?: string;
  make?: string;
  model?: string;
  year?: string | number;
  registrationPlate?: string;
  registrationExpiry?: string;
  registrationState?: string;
  stolen?: unknown;
  writtenOff?: unknown;
}

interface ApiSearch {
  requestId: string;
  status: "new" | "processing" | "completed" | "failed";
  data?: {
    registrations?: unknown[];
    nevdisData?: { vehicles?: ApiVehicle[] };
    certificates?: { downloadUrl?: string }[];
  };
}

const THREE_MONTHS_MS = 92 * 24 * 60 * 60 * 1000;

export function toRecord(identifier: string, search: ApiSearch): VehicleRecord {
  const data = search.data ?? {};
  const vehicle = data.nevdisData?.vehicles?.[0];
  const description = [vehicle?.year, vehicle?.make, vehicle?.model]
    .filter(Boolean)
    .join(" ");

  const expiry = vehicle?.registrationExpiry
    ? new Date(vehicle.registrationExpiry)
    : null;
  const hasExpiry = expiry !== null && !Number.isNaN(expiry.getTime());
  const now = Date.now();
  const status: VehicleRecord["rego"]["status"] = !hasExpiry
    ? "none"
    : expiry.getTime() >= now
      ? "current"
      : "expired";

  return {
    identifier,
    vin: vehicle?.vin ?? "",
    description: description || "Vehicle details not returned",
    financeOwing: (data.registrations?.length ?? 0) > 0,
    writtenOff: writtenOffType(vehicle?.writtenOff),
    writtenOffState: stateIn(vehicle?.writtenOff),
    stolen: recorded(vehicle?.stolen),
    rego: {
      // The API does not document a registration state field.
      state: vehicle?.registrationState ?? null,
      status,
      expiredOverThreeMonths:
        status !== "current" &&
        (!hasExpiry || now - expiry.getTime() > THREE_MONTHS_MS),
    },
    certificateUrl: data.certificates?.[0]?.downloadUrl,
    searchedAt: new Date().toISOString(),
  };
}

export const businessApiProvider: PpsrProvider = {
  name: "businessapi",
  acceptsPlates: false,

  async start(identifier) {
    const res = await call(config().base, {
      method: "POST",
      body: JSON.stringify({ vin: identifier }),
    });
    const search = (await res.json()) as ApiSearch;
    if (!search.requestId) {
      throw new PpsrError("Business API did not return a requestId");
    }
    return search.requestId;
  },

  async result(ref) {
    const res = await call(`${config().base}/${encodeURIComponent(ref)}`);
    const search = (await res.json()) as ApiSearch;
    if (search.status === "failed") {
      throw new PpsrError("The register search failed");
    }
    if (search.status !== "completed") return null;
    return toRecord(ref, search);
  },

  async certificate(record) {
    if (!record.certificateUrl) {
      throw new PpsrError("No certificate for this search");
    }
    const url = new URL(record.certificateUrl, HOST);
    if (url.origin !== HOST) {
      throw new PpsrError("Unexpected certificate host");
    }
    return call(url.toString());
  },
};
