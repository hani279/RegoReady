import { LAST_VERIFIED } from "./fees/nsw";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV = [
  { href: "/calculator", label: "Calculator" },
  { href: "/check", label: "Check a car" },
  { href: "/fees", label: "Auction fees" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

export const VERIFIED_LABEL = new Date(LAST_VERIFIED).toLocaleDateString(
  "en-AU",
  { day: "numeric", month: "long", year: "numeric" },
);
