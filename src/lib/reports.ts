import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { pathway, type Pathway } from "./engine/pathway";
import { getPpsrProvider, type VehicleRecord } from "./ppsr";
import { getStripe } from "./stripe";

export interface Report {
  id: string;
  createdAt: string;
  identifier: string;
  paid: boolean;
  stripeSessionId?: string;
  claim?: string; // which caller started the register search
  lookupRef?: string; // provider reference for the running search
  failed?: boolean; // the search failed; the buyer is owed a refund
  refunded?: boolean; // the refund went through automatically
  record?: VehicleRecord;
  pathway?: Pathway;
}

interface Store {
  get(id: string): Promise<Report | null>;
  put(report: Report): Promise<void>;
}

// Local JSON file, used in development when Supabase is not configured.
const FILE = path.join(process.cwd(), ".data", "reports.json");

const fileStore: Store = {
  async get(id) {
    return (await readAll())[id] ?? null;
  },
  async put(report) {
    const all = await readAll();
    all[report.id] = report;
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(all, null, 2));
  },
};

async function readAll(): Promise<Record<string, Report>> {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

// Supabase table `reports` (see supabase/migrations), one JSON column.
function supabaseStore(url: string, key: string): Store {
  const db = createClient(url, key, { auth: { persistSession: false } });
  return {
    async get(id) {
      const { data, error } = await db
        .from("reports")
        .select("data")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data?.data as Report | undefined) ?? null;
    },
    async put(report) {
      const { error } = await db
        .from("reports")
        .upsert({ id: report.id, data: report });
      if (error) throw new Error(error.message);
    },
  };
}

function store(): Store {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? supabaseStore(url, key) : fileStore;
}

export function normaliseIdentifier(raw: string): string {
  return raw.replace(/[\s-]/g, "").toUpperCase();
}

// A VIN is 17 characters without I, O or Q; an NSW plate is up to 6.
export function isValidIdentifier(id: string, allowPlates: boolean): boolean {
  return (
    /^[A-HJ-NPR-Z0-9]{17}$/.test(id) ||
    (allowPlates && /^[A-Z0-9]{2,6}$/.test(id))
  );
}

export async function createReport(identifier: string): Promise<Report> {
  const report: Report = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    identifier,
    paid: false,
  };
  await store().put(report);
  return report;
}

export async function getReport(id: string): Promise<Report | null> {
  return store().get(id);
}

export async function attachSession(id: string, sessionId: string) {
  const report = await getReport(id);
  if (!report) return;
  await store().put({ ...report, stripeSessionId: sessionId });
}

// Refunds the payment for a report whose search failed. Returns whether
// the refund went through, so a failure can be followed up by hand.
async function refund(report: Report): Promise<boolean> {
  const stripe = getStripe();
  if (!stripe || !report.stripeSessionId) return false;
  try {
    const session = await stripe.checkout.sessions.retrieve(
      report.stripeSessionId,
    );
    if (typeof session.payment_intent !== "string") return false;
    await stripe.refunds.create({ payment_intent: session.payment_intent });
    return true;
  } catch (err) {
    console.error("Refund failed", report.id, err);
    return false;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Runs the paid register search once payment is confirmed, waiting up to
// `waitMs` for the result. Safe to call repeatedly: the Stripe webhook and
// the report page both call it, and later calls resume the same search.
export async function fulfilReport(
  id: string,
  waitMs = 25000,
): Promise<Report | null> {
  let report = await getReport(id);
  if (!report) return null;
  if (report.record || report.failed) return report;
  const provider = getPpsrProvider();

  try {
    if (!report.lookupRef) {
      // Another caller is already starting this search.
      if (report.claim) return report;
      // Claim the search before starting it, so that a webhook and a page
      // load arriving together do not both pay for a search.
      const claim = randomUUID();
      await store().put({ ...report, paid: true, claim });
      await sleep(200);
      report = (await getReport(id))!;
      if (report.claim !== claim) return report;
      const lookupRef = await provider.start(report.identifier);
      report = { ...report, lookupRef };
      await store().put(report);
    }

    const deadline = Date.now() + waitMs;
    for (;;) {
      const record = await provider.result(report.lookupRef!);
      if (record) {
        const full = {
          ...record,
          identifier: report.identifier,
          vin: record.vin || report.identifier,
        };
        const done: Report = { ...report, record: full, pathway: pathway(full) };
        await store().put(done);
        return done;
      }
      if (Date.now() + 2000 > deadline) return report;
      await sleep(2000);
    }
  } catch (err) {
    console.error("Register search failed", id, err);
    const failed: Report = {
      ...report,
      paid: true,
      failed: true,
      refunded: await refund(report),
    };
    await store().put(failed);
    return failed;
  }
}
