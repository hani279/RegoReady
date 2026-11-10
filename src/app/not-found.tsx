import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start gap-5 px-5 py-24">
      <p className="rounded-md border-2 border-ink bg-plate px-3 py-1 font-display text-sm font-bold tracking-[0.12em]">
        404
      </p>
      <h1 className="font-display text-4xl font-bold">
        That page is off the road.
      </h1>
      <p className="text-lg text-soft">
        The link may be old or mistyped. These will get you going again.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/calculator" className={btnPrimary}>
          Open the calculator
        </Link>
        <Link href="/" className={btnSecondary}>
          Go home
        </Link>
      </div>
    </div>
  );
}
