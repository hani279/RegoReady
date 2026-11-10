import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ReportView from "@/components/ReportView";
import { isDemoData } from "@/lib/ppsr";
import { fulfilReport, getReport, type Report } from "@/lib/reports";
import { SAMPLE_CLEAR } from "@/lib/sample";
import { getStripe } from "@/lib/stripe";

type Props = PageProps<"/report/[id]">;

export const metadata: Metadata = {
  title: "Vehicle report",
  robots: { index: false },
};

export default function ReportPage(props: Props) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-5 pb-16 pt-8">
      <Suspense fallback={<p className="text-soft">Loading your report…</p>}>
        <ReportBody {...props} />
      </Suspense>
    </div>
  );
}

// Loads the report and, once it is paid for, runs or resumes the register
// search. If the buyer has just come back from Stripe and the webhook has
// not landed yet, the payment is confirmed directly.
async function load(id: string, sessionId?: string): Promise<Report | null> {
  const report = await getReport(id);
  if (!report || report.record || report.failed) return report;
  if (report.paid) return fulfilReport(id);
  const stripe = getStripe();
  if (!stripe || !sessionId) return report;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === "paid" && session.metadata?.reportId === id) {
    return fulfilReport(id);
  }
  return report;
}

async function ReportBody({ params, searchParams }: Props) {
  const { id } = await params;
  if (id === "sample") {
    return <ReportView {...SAMPLE_CLEAR} sample />;
  }

  const { session_id } = await searchParams;
  const report = await load(
    id,
    typeof session_id === "string" ? session_id : undefined,
  );

  if (!report) {
    return (
      <>
        <h1 className="font-display text-2xl font-bold">Report not found</h1>
        <Link href="/check" className="font-semibold underline">
          Check a car
        </Link>
      </>
    );
  }
  if (report.failed) {
    return (
      <>
        <h1 className="font-display text-2xl font-bold">
          The register search failed
        </h1>
        <p className="text-soft">
          We could not complete the search for {report.identifier}.{" "}
          {report.refunded
            ? "Your payment has been refunded."
            : "You have not been charged for a report. If a payment was taken, contact us and we will refund it."}
        </p>
        <Link href="/check" className="font-semibold underline">
          Try again
        </Link>
      </>
    );
  }
  if (report.paid && !report.record) {
    return (
      <>
        <h1 className="font-display text-2xl font-bold">
          Still searching the register
        </h1>
        <p className="text-soft">
          The search for {report.identifier} is taking longer than usual. Your
          payment went through. Refresh this page in a minute.
        </p>
      </>
    );
  }
  if (!report.paid || !report.record || !report.pathway) {
    return (
      <>
        <h1 className="font-display text-2xl font-bold">Waiting for payment</h1>
        <p className="text-soft">
          We have not received payment for {report.identifier} yet. If you have
          just paid, refresh this page in a few seconds.
        </p>
      </>
    );
  }

  return (
    <ReportView
      record={report.record}
      pathway={report.pathway}
      sample={isDemoData()}
      certificateHref={
        report.record.certificateUrl ? `/report/${id}/certificate` : undefined
      }
    />
  );
}
