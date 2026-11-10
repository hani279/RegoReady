import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { pathway, type Pathway } from "./engine/pathway";
import { getPpsrProvider, type VehicleRecord } from "./ppsr";

export interface Report {
  id: string;
  createdAt: string;
  identifier: string;
  paid: boolean;
  stripeSessionId?: string;
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
export function isValidIdentifier(id: string): boolean {
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(id) || /^[A-Z0-9]{2,6}$/.test(id);
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

// Runs the paid lookup once payment is confirmed. Safe to call twice:
// the webhook and the report page can both trigger it.
export async function fulfilReport(id: string): Promise<Report | null> {
  const report = await getReport(id);
  if (!report) return null;
  if (report.paid && report.record) return report;
  const record = await getPpsrProvider().lookup(report.identifier);
  const done: Report = {
    ...report,
    paid: true,
    record,
    pathway: pathway(record),
  };
  await store().put(done);
  return done;
}
