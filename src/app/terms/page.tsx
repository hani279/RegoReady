import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      sections={[
        {
          heading: "Who we are",
          body: ["RegoReady is operated by [BUSINESS NAME], ABN [ABN]."],
        },
        {
          heading: "General information only",
          body: [
            "RegoReady gives general information about the cost and process of registering a vehicle in NSW. It is not legal, financial or mechanical advice.",
            "Fees and rules change. Each figure links to its official source and shows when it was last checked. Confirm with Service NSW, Transport for NSW or the auction house before you rely on it.",
          ],
        },
        {
          heading: "Vehicle reports",
          body: [
            "A report reflects the register data returned at the time of the search. Registers can be incomplete or out of date, and a report does not replace a mechanical inspection.",
            "You may only request a report for a vehicle you are genuinely considering buying or already own.",
          ],
        },
        {
          heading: "Payments and refunds",
          body: [
            "Reports are charged once, at the price shown at checkout. If a search fails and no report is produced, the charge is refunded.",
            "Nothing in these terms limits your rights under the Australian Consumer Law.",
          ],
        },
        {
          heading: "Contact",
          body: ["[CONTACT EMAIL]"],
        },
      ]}
    />
  );
}
