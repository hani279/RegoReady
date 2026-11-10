import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      sections={[
        {
          heading: "The calculator",
          body: [
            "The calculator runs in your browser. The prices and options you enter are not sent to us or stored.",
          ],
        },
        {
          heading: "Vehicle reports",
          body: [
            "When you request a report we store the VIN or plate you entered, the register data returned for it, and the report we produced, so that you can reopen the report from its link.",
            "Anyone with the link to a report can open it, so share it only with people you want to see it.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Payments are handled by Stripe. We do not receive or store your card details.",
          ],
        },
        {
          heading: "Who we share data with",
          body: [
            "We send the VIN or plate to our register search provider to run the search, and payment details go to Stripe. We do not sell your information.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "To ask for a report to be deleted, or with any privacy question, contact [CONTACT EMAIL].",
          ],
        },
      ]}
    />
  );
}
