import type { Metadata } from "next";
import { CheckCard, PageHeader } from "@/components/Blocks";
import Calculator from "@/components/Calculator";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "NSW used car landed cost and bid ceiling calculator",
  description:
    "Add buyer fees, stamp duty, blue slip, registration and vehicle tax to the price of a used car bought at auction or privately in NSW.",
};

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free calculator"
        title="What will it cost to get on the road?"
        intro="Enter the price to see the all-in cost, or switch to bid ceiling and work backwards from your budget."
      />
      <div className={`${container} pb-14`}>
        <Calculator />
      </div>
      <div className="border-t border-line bg-card">
        <div className={`${container} flex justify-center py-14`}>
          <CheckCard />
        </div>
      </div>
    </>
  );
}
