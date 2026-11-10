import type { Metadata } from "next";
import { Faq, PageHeader } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "Questions buyers ask",
  description:
    "Answers on the calculator, where the fees come from, written-off cars, blue slips and driving an unregistered car in NSW.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Questions buyers ask" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="max-w-3xl">
          <Faq />
        </div>
      </div>
    </>
  );
}
