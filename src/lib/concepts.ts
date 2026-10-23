/**
 * Every concept site: a website we designed for a business that does not exist. The /concept
 * page lists them all, and the tile on the home page shows them in turn, in this order.
 *
 * To add one: sync its files into public/concept/<slug>, add a route like
 * src/app/concept/tariklagi/route.ts, then add it here with a 500 × 1000 phone screenshot in
 * public/images/work.
 */

export interface ConceptLink {
  href: string;
  label: string;
  lang?: string;
}

export interface Concept {
  name: string;
  /** The kind of business, so a visitor can find their own. */
  trade: string;
  /** Says plainly that the business is made up and not a client. */
  text: string;
  /** The first link is the concept itself. */
  links: [ConceptLink, ...ConceptLink[]];
  /** A 500 × 1000 screenshot of the concept on a phone. */
  shot: string;
  alt: string;
  /** A silent recording of the same page scrolling, played over the picture on /concept. */
  video?: string;
}

export const CONCEPTS: Concept[] = [
  {
    name: "Senja Dental",
    trade: "Dental clinic",
    text: "An evening dentist in Kuala Lumpur. It is not a real clinic and not a client. The site puts opening hours, prices and WhatsApp booking first, in English and Bahasa Melayu.",
    links: [
      { href: "/concept/senjadental", label: "See the concept" },
      { href: "/concept/senjadental/ms", label: "Bahasa Melayu", lang: "ms" },
    ],
    shot: "/images/work/senja-dental-phone.png",
    alt: "The Senja Dental concept on a phone: Open till 10pm, with a note that it is a concept project and not a real clinic",
    video: "/videos/work/senja-dental-phone.mp4",
  },
  {
    name: "Tarik Lagi",
    trade: "Food and drink",
    text: "A teh tarik stall. It is not a real stall and not a client. One page shows six drinks with their prices, and the WhatsApp button writes the order for the customer.",
    links: [{ href: "/concept/tariklagi", label: "See the concept" }],
    shot: "/images/work/tarik-lagi-phone.png",
    alt: "The Tarik Lagi concept on a phone: Teh tarik, pulled long, from RM 3.00, with an Order on WhatsApp button",
  },
];
