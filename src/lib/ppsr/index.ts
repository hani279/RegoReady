import { mockProvider } from "./mock";
import type { PpsrProvider } from "./types";

// Returns the configured PPSR provider. Only the demo provider exists so
// far: add the real adapter here once the provider's API docs and sandbox
// key are in hand, and select it with PPSR_PROVIDER.
export function getPpsrProvider(): PpsrProvider {
  const name = process.env.PPSR_PROVIDER ?? "mock";
  if (name === "mock") return mockProvider;
  throw new Error(`Unknown PPSR_PROVIDER "${name}"`);
}

export function isDemoData(): boolean {
  return (process.env.PPSR_PROVIDER ?? "mock") === "mock";
}

export * from "./types";
