import { businessApiProvider } from "./businessapi";
import { mockProvider } from "./mock";
import type { PpsrProvider } from "./types";

// PPSR_PROVIDER selects the register search provider: "mock" (sample
// data, the default) or "businessapi" (needs BUSINESSAPI_KEY).
const providerName = () => process.env.PPSR_PROVIDER ?? "mock";

export function getPpsrProvider(): PpsrProvider {
  const name = providerName();
  if (name === "mock") return mockProvider;
  if (name === "businessapi") return businessApiProvider;
  throw new Error(`Unknown PPSR_PROVIDER "${name}"`);
}

export function isDemoData(): boolean {
  return providerName() === "mock";
}

export * from "./types";
