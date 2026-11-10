"use client";

import { useState } from "react";

export default function CheckCar({ demo }: { demo: boolean }) {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong. Try again.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="identifier" className="text-[13px] font-semibold text-soft">
          VIN or NSW plate
        </label>
        <input
          id="identifier"
          className="h-12 w-full rounded-lg border border-field bg-white px-3 text-base font-medium uppercase text-ink"
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
        <p id="identifier-error" role="alert" className="text-sm font-medium text-blocked">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="min-h-[54px] rounded-[10px] border-2 border-ink bg-plate font-display text-[17px] font-bold text-ink disabled:opacity-60"
      >
        {busy ? "Checking…" : demo ? "Check this car (demo)" : "Check this car · $19"}
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
