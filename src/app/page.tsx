import Calculator from "@/components/Calculator";
import CheckCar from "@/components/CheckCar";

const steps = [
  {
    title: "Work out the landed cost",
    body: "Pick where you are buying and enter the price. Or start from your budget and get the most you should bid.",
  },
  {
    title: "Check the exact car",
    body: "Enter the VIN from the listing for the PPSR certificate plus write-off, stolen and rego status.",
  },
  {
    title: "Follow the path to rego",
    body: "A plain checklist for that car in NSW: which inspection, which forms, what each step costs. Or a clear “do not buy”.",
  },
];

export default function Home() {
  // Demo mode until Stripe is configured (see .env.example).
  const demo = !process.env.STRIPE_SECRET_KEY;

  return (
    <>
      <section className="mx-auto flex max-w-5xl flex-col gap-4 px-5 pb-8 pt-6">
        <p className="text-[13px] font-semibold tracking-wider text-soft">
          PICKLES · MANHEIM · GRAYS · LLOYDS · CARSALES · MARKETPLACE
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl">
          Know the real cost before you bid.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-soft">
          The price is where the bill starts. See buyer fees, stamp duty,
          inspections and rego in one number, and find out whether the car can
          be registered in NSW at all.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-5xl scroll-mt-4 px-5 pb-14">
        <Calculator />
      </section>

      <section className="border-y border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-14">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight">
            A history report says what the car was. We tell you what happens
            next.
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-ink font-display text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-[17px] font-semibold">{s.title}</span>
                <span className="text-[15px] leading-relaxed text-soft">
                  {s.body}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="check" className="mx-auto max-w-5xl scroll-mt-4 px-5 py-14">
        <div className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border-2 border-ink bg-card p-6">
          <h2 className="font-display text-2xl font-bold leading-tight">
            Can this exact car be registered?
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Official PPSR certificate, write-off and stolen check, and the
            step-by-step NSW path for this car.
          </p>
          <CheckCar demo={demo} />
        </div>
      </section>
    </>
  );
}
