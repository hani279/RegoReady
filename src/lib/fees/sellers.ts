import type { FeeStatus } from "./nsw";

export type SellerId =
  | "pickles"
  | "manheim"
  | "lloyds"
  | "grays"
  | "carbids"
  | "private";

export interface Seller {
  id: SellerId;
  name: string;
  kind: "auction" | "private";
  // Returns the buyer fee for a hammer price, or null when the house has
  // no published schedule and the buyer must enter it from the listing.
  buyerFee: ((hammer: number) => number) | null;
  feeNote: string;
  storageNote?: string;
  status: FeeStatus;
  source: string;
}

export const SELLERS: Record<SellerId, Seller> = {
  pickles: {
    id: "pickles",
    name: "Pickles",
    kind: "auction",
    buyerFee: (hammer) => (hammer < 2000 ? 525 : 650 + hammer * 0.0165),
    feeNote: "$525 under $2,000, otherwise $650 + 1.65% of hammer",
    storageNote:
      "Storage is $75 a day for uncollected vehicles, and late payment is $75 per invoice per day.",
    status: "confirmed",
    source: "https://www.pickles.com.au/fees/car",
  },
  manheim: {
    id: "manheim",
    name: "Manheim",
    kind: "auction",
    buyerFee: (hammer) => (hammer <= 2000 ? 500 : 650 + hammer * 0.015),
    feeNote: "$500 up to $2,000, otherwise $650 + 1.5% of purchase price",
    storageNote:
      "Storage is $66 a day per item from the third business day after purchase.",
    status: "unconfirmed",
    source:
      "https://www.manheim.com.au/opalcmsassets/manheim/linkreports/Buyer-Auction-Fees-AU-May26.pdf",
  },
  lloyds: {
    id: "lloyds",
    name: "Lloyds",
    kind: "auction",
    buyerFee: (hammer) => hammer * 0.125,
    feeNote: "12.5% buyer's premium, GST inclusive",
    status: "unconfirmed",
    source: "https://www.lloydsonline.com.au/",
  },
  grays: {
    id: "grays",
    name: "Grays",
    kind: "auction",
    buyerFee: null,
    feeNote: "Set per lot. Enter the buyer's premium shown on the listing.",
    status: "unconfirmed",
    source: "https://www.grays.com/",
  },
  carbids: {
    id: "carbids",
    name: "Carbids",
    kind: "auction",
    buyerFee: null,
    feeNote: "No published schedule. Enter the fee shown on the listing.",
    status: "unconfirmed",
    source: "https://carbids.com.au/",
  },
  private: {
    id: "private",
    name: "Private sale",
    kind: "private",
    buyerFee: () => 0,
    feeNote: "No buyer fee on carsales, Facebook Marketplace or Gumtree",
    status: "unconfirmed",
    source: "https://www.service.nsw.gov.au/transaction/transfer-a-vehicle-registration",
  },
};

export const SELLER_LIST: Seller[] = Object.values(SELLERS);
