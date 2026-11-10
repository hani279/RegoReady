"use client";

import { useState } from "react";

interface Found {
  plate: string;
  description: string;
  vin: string | null;
}

const VIN = /^[A-HJ-NPR-Z0-9]{17}$/;
const clean = (s: string) => s.replace(/[\s-]/g, "").toUpperCase();

const primary =
  "min-h-[54px] rounded-[10px] border-2 border-ink bg-plate font-display text-[17px] font-bold text-ink disabled:opacity-60";
const secondary =
  "min-h-12 rounded-[10px] border-2 border-ink bg-card font-display text-base font-bold text-ink disabled:opacity-60";

async function post(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong. Try again.");
  }
  return data;
}

export default function CheckCar({
  demo,
  plates,
}: {
  demo: boolean;
  plates: boolean; // plate search is available, not only VINs
}) {
  const [identifier, setIdentifier] = useState("");
  const [found, setFound] = useState<Found | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const payLabel = demo ? "Check this car (demo)" : "Check this car · $19";

  async function run(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(false);
  }

  const checkout = (id: string) =>
    run(async () => {
      const data = await post("/api/checkout", { identifier: id });
      if (!data.url) throw new Error("Something went wrong. Try again.");
      window.location.assign(data.url);
      // Keep the button disabled while the browser navigates.
      await new Promise(() => {});
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = clean(identifier);
    if (VIN.test(id) || !plates) return checkout(id);
    // A plate: look the car up first so the buyer can confirm it is the
    // right one before paying.
    return run(async () => setFound(await post("/api/plate", { plate: id })));
  }

  if (found) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-line bg-ground p-4">
          <p className="text-[13px] font-semibold text-soft">
            Plate {found.plate} belongs to
          </p>
          <p className="font-display text-xl font-bold">{found.description}</p>
          {found.vin && (
            <p className="font-mono text-[13px] text-muted">VIN {found.vin}</p>
          )}
        </div>
        <p className="text-sm text-soft">Is this the car you are looking at?</p>
        {error && (
          <p role="alert" className="text-sm font-medium text-blocked">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={busy}
          className={primary}
          onClick={() => checkout(found.vin ?? found.plate)}
        >
          {busy ? "Checking…" : `Yes. ${payLabel}`}
        </button>
        <button
          type="button"
          disabled={busy}
          className={secondary}
          onClick={() => {
            setFound(null);
            setError("");
          }}
        >
          No, change the plate
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="identifier"
          className="text-[13px] font-semibold text-soft"
        >
          {plates ? "NSW plate or VIN" : "VIN (17 characters)"}
        </label>
        <input
          id="identifier"
          className="h-12 w-full rounded-lg border border-field bg-white px-3 text-base font-medium uppercase text-ink placeholder:normal-case"
          placeholder="From the listing"
          autoCapitalize="characters"
          autoComplete="off"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          aria-describedby={error ? "identifier-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
      </div>
      {error && (
        <p
          id="identifier-error"
          role="alert"
          className="text-sm font-medium text-blocked"
        >
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={primary}>
        {busy ? "Checking…" : plates ? "Find this car" : payLabel}
      </button>
      {demo && (
        <p className="text-[13px] leading-5 text-muted">
          Demo mode: no payment is taken and the result is sample data, not a
          real register search.
        </p>
      )}
    </form>
  );
}
