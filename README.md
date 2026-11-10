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
| `src/lib/ppsr/` | PPSR/NEVDIS provider interface and the demo provider |
| `src/lib/reports.ts` | Report storage (Supabase, or a local file) and fulfilment |
| `src/app/api/checkout` | Creates the report and the Stripe Checkout session |
| `src/app/api/stripe/webhook` | Fulfils the report when payment completes |
| `src/app/report/[id]` | The paid report page |
| `supabase/migrations` | The `reports` table |
| `docs/fee-data.md` | Research notes behind the fee data, including what is still unconfirmed |

## Demo vehicle data

The demo provider picks a scenario from the last character of the VIN or plate: `W` statutory write-off, `R` repairable write-off, `S` stolen, `F` finance owing, `C` current NSW rego, `I` interstate rego, anything else is a clean car with expired NSW rego.

## Before taking real payments

1. Add a real PPSR/NEVDIS adapter in `src/lib/ppsr/` and select it with `PPSR_PROVIDER`.
2. Set the Stripe keys and point a webhook at `/api/stripe/webhook` for `checkout.session.completed`.
3. Create the Supabase project, run the migration and set the Supabase keys.
4. Confirm the fees marked unconfirmed in `src/lib/fees/sellers.ts`, and cross-check `stampDuty` against the Revenue NSW calculator.
