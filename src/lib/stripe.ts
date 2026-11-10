import Stripe from "stripe";

export const REPORT_PRICE_CENTS = 1900;

// Null when Stripe is not configured, in which case the app runs in demo
// mode and reports are issued without payment.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  return key ? new Stripe(key) : null;
}
