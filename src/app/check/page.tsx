import type { Metadata } from "next";
import { CheckCard, PageHeader, TickList } from "@/components/Blocks";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Check a car: can it be registered in NSW?",
  description:
    "Enter a VIN or NSW plate for the PPSR certificate, write-off and stolen status, and the steps to register that car in NSW.",
};

export default function CheckPage() {
  return (
    <>
      <PageHeader
        eyebrow="Check a car"
        title="Can this exact car be registered?"
        intro="Find out before you bid or hand over money. One page with the verdict, the reasons and the steps."
      />
      <div className={`${container} grid gap-10 pb-16 lg:grid-cols-2`}>
        <CheckCard heading="Enter the VIN" />
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-bold">What you get</h2>
          <TickList
            items={[
              "A verdict: clear, caution or do not buy",
              "Finance owing, written-off and stolen status",
              "Registration status and state",
              "The numbered steps to NSW rego, with the cost of each",
              "A link to the official source for every rule",
              "The official PPSR search certificate",
            ]}
          />
          <p className="text-sm leading-relaxed text-muted">
            The VIN is on the auction listing, the registration papers and the
            compliance plate. It has 17 characters.
          </p>
        </div>
      </div>
    </>
  );
}
