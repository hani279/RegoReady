import Link from "next/link";
import { SELLER_LIST } from "@/lib/fees/sellers";
import { GUIDES } from "@/lib/guides";
import { VERIFIED_LABEL } from "@/lib/site";

const linkClass = "flex min-h-9 items-center text-[#e6e9e3] hover:text-white hover:underline";

function Column(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#c9cec6]">
        {props.title}
      </h2>
      {props.children}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-sm text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <span className="rounded-md border-2 border-ink bg-plate px-3 py-1 font-display text-sm font-bold tracking-[0.12em] text-ink">
            REGOREADY
          </span>
          <p className="max-w-xs leading-relaxed text-[#c9cec6]">
            The real cost, and the legal path, to get a used car on the road in
            NSW.
          </p>
        </div>
        <Column title="Product">
          <Link href="/calculator" className={linkClass}>Calculator</Link>
          <Link href="/check" className={linkClass}>Check a car</Link>
          <Link href="/report/sample" className={linkClass}>Sample report</Link>
          <Link href="/pricing" className={linkClass}>Pricing</Link>
        </Column>
        <Column title="Fees">
          {SELLER_LIST.map((s) => (
            <Link key={s.id} href={`/fees/${s.id}`} className={linkClass}>
              {s.name}
            </Link>
          ))}
        </Column>
        <Column title="Guides">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className={linkClass}>
              {g.short}
            </Link>
          ))}
        </Column>
        <Column title="About">
          <Link href="/sources" className={linkClass}>Sources and fee data</Link>
          <Link href="/terms" className={linkClass}>Terms</Link>
          <Link href="/privacy" className={linkClass}>Privacy</Link>
        </Column>
      </div>
      <div className="border-t border-[#2c333a]">
        <p className="mx-auto w-full max-w-6xl px-5 py-6 text-[13px] leading-relaxed text-[#c9cec6]">
          General information, not legal advice. NSW fees last checked{" "}
          {VERIFIED_LABEL} against Service NSW, Transport for NSW and Revenue
          NSW. Fees marked &ldquo;check the listing&rdquo; have not been
          confirmed with the auction house. Not affiliated with any auction
          house or government agency.
        </p>
      </div>
    </footer>
  );
}
