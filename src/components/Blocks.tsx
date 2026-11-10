import Link from "next/link";
import CheckCar from "@/components/CheckCar";
import { platesEnabled } from "@/lib/plates";
import { btnPrimary, btnSecondary, card, container, eyebrow } from "@/lib/ui";

export function PageHeader(props: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className={`${container} flex flex-col gap-4 pb-8 pt-10 sm:pt-14`}>
      {props.eyebrow && <p className={eyebrow}>{props.eyebrow}</p>}
      <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] sm:text-5xl">
        {props.title}
      </h1>
      {props.intro && (
        <p className="max-w-2xl text-lg leading-relaxed text-soft">
          {props.intro}
        </p>
      )}
    </div>
  );
}

// Demo mode until Stripe is configured (see .env.example).
export const isDemo = () => !process.env.STRIPE_SECRET_KEY;

export function CheckCard({ heading = "Can this exact car be registered?" }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border-2 border-ink bg-card p-6">
      <h2 className="font-display text-2xl font-bold leading-tight">{heading}</h2>
      <p className="text-[15px] leading-relaxed text-muted">
        Official PPSR certificate, write-off and stolen check, and the
        step-by-step NSW path for this car.
      </p>
      <CheckCar demo={isDemo()} plates={platesEnabled()} />
      <Link href="/report/sample" className="flex min-h-11 w-fit items-center text-sm font-semibold underline">
        See a sample report
      </Link>
    </div>
  );
}

const tick = (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0b5a42"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 shrink-0"
  >
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export function TickList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-[15px] leading-snug text-soft">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          {tick}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={`${card} flex flex-col gap-4 p-6`}>
        <p className="text-[15px] font-semibold">Calculator</p>
        <p className="font-display text-5xl font-bold">Free</p>
        <TickList
          items={[
            "Landed cost for auctions and private sales",
            "Bid ceiling from your all-in budget",
            "Every government fee linked to its source",
            "No sign-up",
          ]}
        />
        <Link href="/calculator" className={`${btnSecondary} mt-auto`}>
          Open the calculator
        </Link>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-card p-6">
        <p className="text-[15px] font-semibold">One car, checked</p>
        <p className="font-display text-5xl font-bold">
          $19 <span className="text-base font-semibold text-muted">per report</span>
        </p>
        <TickList
          items={[
            "Official PPSR certificate",
            "Finance owing, write-off and stolen check",
            "A clear verdict: can it be registered in NSW?",
            "Numbered steps to rego with the cost of each",
          ]}
        />
        <Link href="/check" className={`${btnPrimary} mt-auto`}>
          Check a car
        </Link>
      </div>
    </div>
  );
}

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is the calculator really free?",
    a: "Yes. There is no sign-up and no limit. You only pay if you want a specific car checked against the registers.",
  },
  {
    q: "Where do the fees come from?",
    a: "NSW government fees are read from the Service NSW, Transport for NSW and Revenue NSW pages and each line links to its source. Auction fees come from the auction house's published schedule. Anything we could not confirm is tagged “check the listing”.",
  },
  {
    q: "Can I register a written-off car in NSW?",
    a: "Almost never as a new buyer. A statutory write-off cannot be re-registered at all, and a repairable write-off can only be re-registered by someone who was its registered operator before the damage or who inherited it.",
  },
  {
    q: "Do I need a blue slip or a pink slip?",
    a: "A blue slip if the rego expired more than 3 months ago, the car is from interstate, or it has no plates. A car with current NSW rego needs neither to be transferred into your name.",
  },
  {
    q: "Can I drive an unregistered car home from the auction?",
    a: "No. Without a permit you can only drive it by the most direct route to get it registered, such as to a booked inspection. Any other trip needs an unregistered vehicle permit or a tow.",
  },
  {
    q: "Is this legal advice?",
    a: "No. It is general information with links to the official sources. Confirm with Service NSW before you act on it.",
  },
];

export function Faq() {
  return (
    <div className="flex flex-col">
      {FAQ.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="shrink-0 transition-transform group-open:rotate-45"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-soft">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
