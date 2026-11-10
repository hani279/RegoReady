# RegoReady

Landed cost and registration pathway checker for used cars bought at auction or privately in NSW.

## Run it

```bash
npm install
npm run dev
```

With no environment variables it runs in demo mode: reports are issued without payment, use sample vehicle data, and are stored in `.data/reports.json`. Copy `.env.example` to `.env.local` to configure Stripe and Supabase.

```bash
npm test
```

## What is where

| Path | What it is |
|---|---|
| `src/lib/fees/nsw.ts` | NSW government fees, vehicle tax table and stamp duty, each with a source link and `LAST_VERIFIED` date |
| `src/lib/fees/sellers.ts` | Buyer fee schedules for each auction house and private sales, with a confirmed/unconfirmed status |
| `src/lib/engine/cost.ts` | Landed cost and bid ceiling |
| `src/lib/engine/pathway.ts` | Verdict (clear, caution, blocked) and the steps to registration from a vehicle record |
| `src/lib/ppsr/` | PPSR/NEVDIS provider interface, the Business API adapter and the demo provider |
| `src/lib/reports.ts` | Report storage (Supabase, or a local file) and fulfilment |
| `src/app/api/checkout` | Creates the report and the Stripe Checkout session |
| `src/app/api/stripe/webhook` | Fulfils the report when payment completes |
| `src/app/report/[id]` | The paid report page |
| `supabase/migrations` | The `reports` table |
| `docs/fee-data.md` | Research notes behind the fee data, including what is still unconfirmed |

## Demo vehicle data

The demo provider picks a scenario from the last character of the VIN or plate: `W` statutory write-off, `R` repairable write-off, `S` stolen, `F` finance owing, `C` current NSW rego, `I` interstate rego, anything else is a clean car with expired NSW rego.

## Connecting Stripe and the register search

Put these in `.env.local` (and in your host's environment settings), then restart. The keys must be present when the app is built, because some pages read them at build time.

**Stripe**

1. In the Stripe dashboard, copy the secret key (`sk_test_...` while testing) into `STRIPE_SECRET_KEY`.
2. Add a webhook endpoint for `https://YOUR-DOMAIN/api/stripe/webhook`, listening for `checkout.session.completed`, and copy its signing secret into `STRIPE_WEBHOOK_SECRET`. Locally, `stripe listen --forward-to localhost:3000/api/stripe/webhook` prints one.
3. Pay with test card `4242 4242 4242 4242`.

The report page also confirms the payment itself when the buyer returns from Stripe, so reports work locally even without the webhook. If a register search fails after payment, the payment is refunded automatically.

**Business API (PPSR and NEVDIS)**

1. Register at businessapi.com.au and generate a secret key in the dashboard.
2. Set `PPSR_PROVIDER=businessapi` and `BUSINESSAPI_KEY`. A `bapi_sk_test_...` key uses the free sandbox; a `bapi_sk_live_...` key runs real searches at $6.00 each.

With this provider the check accepts VINs only, because the API has no plate search.

The adapter in `src/lib/ppsr/businessapi.ts` is written from the published documentation and has only been run against a local stand-in, not the real API. The documentation does not describe the shape of the `stolen` and `writtenOff` fields or give a registration state, so the adapter reads them defensively: check a few sandbox responses and tighten `toRecord` to match.

## Before launch

1. Run sandbox searches and confirm the stolen, written-off and registration fields map correctly.
2. Create the Supabase project, run the migration and set the Supabase keys. Without them reports are stored in a local file, which does not work on serverless hosting.
3. Confirm the fees marked unconfirmed in `src/lib/fees/sellers.ts`, and cross-check `stampDuty` against the Revenue NSW calculator.
4. Have the Terms and Privacy pages reviewed and fill in the business details.
