import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/Blocks";
import Calculator from "@/components/Calculator";
import { landedCost } from "@/lib/engine/cost";
import { SELLERS, SELLER_LIST, type SellerId } from "@/lib/fees/sellers";
import { money } from "@/lib/format";
import { card, container } from "@/lib/ui";

type Props = PageProps<"/fees/[seller]">;

export function generateStaticParams() {
  return SELLER_LIST.map((s) => ({ seller: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seller = SELLERS[(await params).seller as SellerId];
  if (!seller) return {};
  return seller.kind === "auction"
    ? {
        title: `${seller.name} buyer fees calculator`,
        description: `${seller.name} buyer fee: ${seller.feeNote}. Add NSW stamp duty, inspection and rego to see the real cost.`,
      }
    : {
        title: "Private sale costs in NSW",
        description:
          "What a private car purchase costs in NSW: transfer fee, stamp duty and, for an unregistered car, blue slip and registration.",
      };
}

const EXAMPLES = [2000, 5000, 10000, 20000];

export default async function SellerFeesPage({ params }: Props) {
  const seller = SELLERS[(await params).seller as SellerId];
  if (!seller) notFound();
  const auction = seller.kind === "auction";

  return (
    <>
      <PageHeader
        eyebrow={auction ? "Auction fees" : "Private sale"}
        title={auction ? `${seller.name} buyer fees` : "What a private sale costs in NSW"}
        intro={
          auction
            ? `${seller.feeNote}.${seller.storageNote ? ` ${seller.storageNote}` : ""}`
            : "There is no buyer fee on carsales, Facebook Marketplace or Gumtree. You pay the transfer fee and stamp duty, plus inspection and registration if the car is unregistered."
        }
      />
      <div className={`${container} flex flex-col gap-10 pb-16`}>
        {seller.status === "unconfirmed" && (
          <p className="max-w-2xl rounded-xl border border-amber-line bg-amber px-4 py-3 text-sm leading-relaxed text-amber-text">
            {auction
              ? `We have not been able to confirm these figures with ${seller.name}. Check the fee shown on the listing before you bid.`
              : "No platform publishes a buyer fee, but check the listing and any payment service you use."}{" "}
            <a href={seller.source} target="_blank" rel="noreferrer" className="font-semibold underline">
              Source
            </a>
          </p>
        )}

        {seller.buyerFee && auction && (
          <div className={`${card} overflow-x-auto`}>
            <table className="w-full min-w-[480px] text-left text-[15px]">
              <caption className="p-4 text-left font-display text-lg font-bold">
                Worked examples, unregistered car, 1,151 to 1,500 kg
              </caption>
              <thead>
                <tr className="border-y border-line text-soft">
                  <th scope="col" className="p-4 font-semibold">Hammer price</th>
                  <th scope="col" className="p-4 text-right font-semibold">Buyer fee</th>
                  <th scope="col" className="p-4 text-right font-semibold">All-in, before CTP</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((price) => {
                  const r = landedCost({
                    seller: seller.id,
                    price,
                    gstExclusive: false,
                    regoStatus: "unregistered",
                    tareKg: 1500,
                  });
                  const fee = r.lines.find((l) => l.key === "buyerFee")?.amount ?? 0;
                  return (
                    <tr key={price} className="border-b border-line last:border-b-0">
                      <th scope="row" className="p-4 font-semibold tabular-nums">{money(price)}</th>
                      <td className="p-4 text-right tabular-nums">{money(fee)}</td>
                      <td className="p-4 text-right font-semibold tabular-nums">{money(r.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-bold">
            {auction ? `${seller.name} calculator` : "Private sale calculator"}
          </h2>
          <Calculator initialSeller={seller.id} />
        </div>
      </div>
    </>
  );
}
