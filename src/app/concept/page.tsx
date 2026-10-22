import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookingButton } from "@/components/modal/BookingButton";
import { StageVideo } from "@/components/home/StageVideo";
import { SitePage, order } from "@/components/site/chrome";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Concept Sites — Websites for Businesses We Made Up",
  description:
    "Concept websites by IIDev Studio for invented Malaysian businesses: an evening dental clinic and a teh tarik stall. None of them is a client.",
  alternates: { canonical: "/concept" },
  openGraph: {
    title: "Concept sites by IIDev Studio",
    description:
      "Websites we designed for invented Malaysian businesses, to show what a site for your kind of business can put first.",
    url: "/concept",
    type: "website",
    images: ["/opengraph-image"],
  },
};

interface ConceptLink {
  href: string;
  label: string;
  lang?: string;
}

interface Concept {
  name: string;
  /** The kind of business, so a visitor can find their own. */
  trade: string;
  text: string;
  /** The first link is also where the picture goes. */
  links: [ConceptLink, ...ConceptLink[]];
  /** A 500 × 1000 screenshot of the concept on a phone. */
  shot: string;
  alt: string;
  /** A silent recording of the same page scrolling, played over the picture. */
  video?: string;
}

/**
 * Every concept site served under /concept. To add one: sync its files into
 * public/concept/<slug>, add a route like concept/tariklagi/route.ts, then add
 * it here with a phone screenshot in public/images/work.
 */
const CONCEPTS: Concept[] = [
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": absoluteUrl("/concept#webpage"),
      url: absoluteUrl("/concept"),
      name: "Concept sites by IIDev Studio",
      description:
        "Websites IIDev Studio designed for invented Malaysian businesses. None of them is a client.",
      isPartOf: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Concept sites", item: absoluteUrl("/concept") },
      ],
    },
  ],
};

export default function ConceptPage() {
  return (
    <SitePage
      jsonLd={jsonLd}
      invite={
        <>
          <h2 className="display" data-reveal>
            Want one for your business?
          </h2>
          <p data-reveal style={order(1)}>
            Book a free 15-minute call. We&apos;ll talk about your customers
            and what they look for first. Your site is designed for your
            business, not copied from a concept.
          </p>
          <BookingButton className="btn">Book a Free Call</BookingButton>
          <p className="foot-aside">
            <Link href="/services" className="link link-line">
              See our services and prices →
            </Link>
          </p>
        </>
      }
    >
      <header className="wrap page-head">
        <div>
          <p className="page-kicker">Our own designs</p>
          <h1 className="display page-title">Concept sites</h1>
        </div>
        <div className="page-foot">
          <div className="page-lead">
            <p>
              Each concept is a full website we designed for a business that
              does not exist. None of them is a client. They show what a site
              for your kind of business can put first: prices, opening hours,
              and one easy way to book or order on WhatsApp.
            </p>
            <p>They work best on a phone. Open one there, the way your customers would.</p>
          </div>
        </div>
      </header>

      <section aria-label="Concept sites" className="wrap concepts">
        {CONCEPTS.map((concept) => {
          const [main] = concept.links;
          return (
            <article key={concept.name} className="concept">
              <Link
                href={main.href}
                className="concept-visual"
                aria-label={`${main.label}: ${concept.name}`}
                data-reveal
              >
                <span className="concept-shot">
                  <Image
                    src={concept.shot}
                    width={500}
                    height={1000}
                    sizes="(max-width: 899px) 46vw, 22vw"
                    alt={concept.alt}
                  />
                  {concept.video && <StageVideo src={concept.video} />}
                </span>
              </Link>

              <div className="concept-text" data-reveal style={order(1)}>
                <p className="concept-trade">{concept.trade}</p>
                <h2 className="display concept-name">{concept.name}</h2>
                <p>{concept.text}</p>
                <p className="concept-links">
                  {concept.links.map((link) => (
                    <Link key={link.href} href={link.href} hrefLang={link.lang} className="link">
                      {link.label}
                    </Link>
                  ))}
                </p>
              </div>
            </article>
          );
        })}
      </section>
    </SitePage>
  );
}
