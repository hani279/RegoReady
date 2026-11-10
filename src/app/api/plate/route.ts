import { PLATE_PATTERN, lookupPlate, platesEnabled } from "@/lib/plates";
import { normaliseIdentifier } from "@/lib/reports";

// Each lookup costs money and happens before the buyer pays, so cap how
// many one address can run. This is per server instance: on serverless
// hosting put a shared rate limiter in front of this route as well.
const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function allowed(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  hits.set(key, [...recent, now]);
  return true;
}

export async function POST(request: Request) {
  if (!platesEnabled()) {
    return Response.json(
      { error: "Plate search is not available. Enter the VIN." },
      { status: 400 },
    );
  }
  const body = await request.json().catch(() => null);
  const plate = normaliseIdentifier(String(body?.plate ?? ""));
  if (!PLATE_PATTERN.test(plate)) {
    return Response.json(
      { error: "Enter an NSW plate of up to 6 letters and numbers." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!allowed(ip)) {
    return Response.json(
      { error: "Too many plate searches. Enter the VIN, or try again in an hour." },
      { status: 429 },
    );
  }

  let match;
  try {
    match = await lookupPlate(plate);
  } catch (err) {
    console.error("Plate lookup error", err);
    return Response.json(
      { error: "Plate search is unavailable right now. Enter the VIN." },
      { status: 502 },
    );
  }
  if (!match) {
    return Response.json(
      { error: "We could not find that NSW plate. Check it, or enter the VIN." },
      { status: 404 },
    );
  }
  return Response.json({ plate, ...match });
}
