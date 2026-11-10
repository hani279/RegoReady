import {
  BLUE_SLIP_SOURCE,
  BLUE_SLIP_VALID_DAYS,
  DRIVE_UNREGISTERED_SOURCE,
  NSW_FEES,
  TRANSFER_SOURCE,
  WRITTEN_OFF_SOURCE,
} from "./fees/nsw";

export interface Guide {
  slug: string;
  short: string; // label for menus
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
  sources: { label: string; url: string }[];
}

const f = NSW_FEES;

export const GUIDES: Guide[] = [
  {
    slug: "blue-slip-vs-pink-slip",
    short: "Blue slip vs pink slip",
    title: "Blue slip vs pink slip in NSW: which one does your car need?",
    summary: `A pink slip ($${f.pinkSlip.amount}) is the yearly safety check for a registered car. A blue slip ($${f.blueSlip.amount}) is the fuller safety and identity check an unregistered car needs before it can be registered.`,
    sections: [
      {
        heading: "When you need a blue slip",
        body: [
          "You need a blue slip when the registration expired more than 3 months ago, the car has come from another state or overseas, it has no number plates, or the registration records need changing because of something major such as a new engine.",
          "A blue slip is also needed to clear defect notices, and for a written-off vehicle that has been approved for re-registration.",
          `The report is sent to Transport for NSW electronically and is valid for ${BLUE_SLIP_VALID_DAYS} days, so book it close to when you plan to register.`,
        ],
      },
      {
        heading: "When a pink slip is enough",
        body: [
          "A pink slip is the safety check used to renew registration. If you buy a car with current NSW registration, you do not need a pink slip to transfer it into your name.",
        ],
      },
      {
        heading: "What each one costs",
        body: [
          `For a light vehicle the blue slip is $${f.blueSlip.amount} and the pink slip is $${f.pinkSlip.amount}. These are the regulated fees including GST.`,
          "If the registration lapsed more than 3 months ago you will also pay for new number plates when you register.",
        ],
      },
    ],
    sources: [
      { label: "Service NSW: get a blue slip", url: BLUE_SLIP_SOURCE },
      { label: "NSW Government: inspection fees", url: f.blueSlip.source },
    ],
  },
  {
    slug: "driving-an-unregistered-car",
    short: "Driving an unregistered car",
    title: "Can you drive an unregistered car home in NSW?",
    summary:
      "Not home, no. You can drive it without a permit only for trips to get it registered, by the most direct route. Anything else needs an unregistered vehicle permit or a tow truck.",
    sections: [
      {
        heading: "Trips you can make without a permit",
        body: [
          "You are allowed to drive an unregistered vehicle when you are getting it registered. That covers trips to an inspection station, a Service NSW centre, a weighbridge, a repairer or an insurer.",
          "You must take the most direct or convenient route. If police stop you, you may need to show the trip is for registration, so book the inspection first and keep the booking handy.",
        ],
      },
      {
        heading: "When you need an unregistered vehicle permit",
        body: [
          `For any other trip, including driving it home from an auction, you need an unregistered vehicle permit. It costs $${f.unregisteredPermit.amount}, covers one specific journey by the most direct route, and the number plates must come off first.`,
          "Written-off vehicles are not eligible for a permit. They have to be towed.",
        ],
      },
      {
        heading: "At an auction",
        body: [
          "Most auction cars are sold unregistered, so plan the tow or the permit before you bid. Storage charges start quickly once the free period ends.",
        ],
      },
    ],
    sources: [
      {
        label: "NSW Government: when you can drive an unregistered vehicle",
        url: DRIVE_UNREGISTERED_SOURCE,
      },
      { label: "NSW Government: registration fees", url: f.unregisteredPermit.source },
    ],
  },
  {
    slug: "written-off-vehicles-nsw",
    short: "Written-off vehicles",
    title: "Can you register a written-off car in NSW?",
    summary:
      "Almost never, if you are buying it. NSW only lets a written-off light vehicle be repaired and re-registered in very limited circumstances, and none of them apply to a new buyer.",
    sections: [
      {
        heading: "Statutory write-offs",
        body: [
          "A statutory write-off has damage so severe it can only be used for parts or scrap. It is not eligible for an Authorisation to Repair, so it cannot be re-registered by anyone.",
        ],
      },
      {
        heading: "Repairable write-offs",
        body: [
          "Transport for NSW will only consider an application to repair a written-off light vehicle if the applicant was its registered operator for more than 28 days before the damage, the damage is hail only and the applicant is the same registered operator, or the applicant inherited the vehicle.",
          "Someone buying the car at auction or privately meets none of these, so a repairable write-off is also a car you cannot register.",
        ],
      },
      {
        heading: "Why a blue slip pass does not help",
        body: [
          "The block is on the register, not on the condition of the car. A written-off car can pass a blue slip and still be refused registration at Service NSW.",
          `Where re-registration is allowed, it needs an Authorisation to Repair before any repairs start, then a blue slip, then a Vehicle Inspectorate inspection that costs $${f.writtenOffInspection.amount}.`,
        ],
      },
    ],
    sources: [
      {
        label: "NSW Government: re-registering a written-off light vehicle",
        url: WRITTEN_OFF_SOURCE,
      },
      { label: "NSW Government: inspection fees", url: f.writtenOffInspection.source },
    ],
  },
  {
    slug: "transferring-rego-private-sale",
    short: "Transferring rego",
    title: "Transferring rego after a private sale in NSW",
    summary: `You have 14 days. Transfer within that and the fee is $${f.transfer.amount}; after it, $${f.transferLate.amount}. You also pay stamp duty on the price or market value, whichever is higher.`,
    sections: [
      {
        heading: "What the seller must do",
        body: [
          "The seller lodges a notice of disposal and gives you the certificate of registration, signed on the back. You cannot transfer online until the notice of disposal is lodged.",
        ],
      },
      {
        heading: "What you pay",
        body: [
          `The transfer fee is $${f.transfer.amount} within 14 days of getting the car and $${f.transferLate.amount} after that.`,
          "Stamp duty is $3 for every $100 of the price you paid or the market value, whichever is higher. Under-declaring the price can attract interest and a penalty.",
          "You do not need a pink slip to transfer a car with current NSW registration.",
        ],
      },
      {
        heading: "When you have to go to a service centre",
        body: [
          "You can transfer online only if the car is registered in NSW and the seller has lodged the notice of disposal. Go to a Service NSW centre if the seller is interstate, the registration expired more than 3 months ago, or you are claiming a stamp duty exemption.",
        ],
      },
      {
        heading: "What a private sale does not give you",
        body: [
          "A private sale has no cooling-off period and no dealer guarantee, and NSW Fair Trading cannot help with a dispute. Check for money owing and write-off history yourself before you pay.",
        ],
      },
    ],
    sources: [
      { label: "Service NSW: transfer a vehicle registration", url: TRANSFER_SOURCE },
      { label: "NSW Government: registration fees", url: f.transfer.source },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
