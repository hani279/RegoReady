import type { Metadata } from "next";
import { Faq, PageHeader, PricingCards } from "@/components/Blocks";
import { container, h2 } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "The calculator is free. A full check on one car is $19.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Pay only when you are serious about a car"
        intro="Use the calculator as much as you like. Pay for a check when you have a car you might actually buy."
      />
      <div className={`${container} pb-16`}>
        <PricingCards />
      </div>
      <div className="border-t border-line bg-card">
        <div className={`${container} grid gap-8 py-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <h2 className={h2}>Questions buyers ask</h2>
          <Faq />
        </div>
      </div>
    </>
  );
}
