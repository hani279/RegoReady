import { getPpsrProvider } from "@/lib/ppsr";
import {
  attachSession,
  createReport,
  fulfilReport,
  isValidIdentifier,
  normaliseIdentifier,
} from "@/lib/reports";
import { REPORT_PRICE_CENTS, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const identifier = normaliseIdentifier(String(body?.identifier ?? ""));
  const allowPlates = getPpsrProvider().acceptsPlates;
  if (!isValidIdentifier(identifier, allowPlates)) {
    return Response.json(
      {
        error: allowPlates
          ? "Enter a 17-character VIN or an NSW plate."
          : "Enter the 17-character VIN. It has no I, O or Q.",
      },
      { status: 400 },
    );
  }

  const report = await createReport(identifier);
  const origin = new URL(request.url).origin;
  const reportUrl = `${origin}/report/${report.id}`;
  const stripe = getStripe();

  // Demo mode: no Stripe key, so issue the report straight away.
  if (!stripe) {
    await fulfilReport(report.id, 8000);
    return Response.json({ url: reportUrl });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: REPORT_PRICE_CENTS,
          product_data: {
            name: "RegoReady vehicle report",
            description: `PPSR certificate and NSW registration pathway for ${identifier}`,
          },
        },
      },
    ],
    metadata: { reportId: report.id },
    success_url: `${reportUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#check`,
  });
  await attachSession(report.id, session.id);
  return Response.json({ url: session.url });
}
