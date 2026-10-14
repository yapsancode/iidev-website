import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Search-Ready Website — Get Found on Google (RM 3k–6k)",
  description:
    "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so Malaysian customers find you instead of your competitors. From RM 3,000.",
  alternates: { canonical: "/services/search-ready" },
  openGraph: {
    title: "Search-Ready Website | IIDev Studio",
    description:
      "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so customers find you first.",
    url: "/services/search-ready",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const outcomes = [
  "Keyword research into what your actual customers type into Google — not guesswork",
  "Your website built around those searches, so every page has a reason to exist",
  "Google Business Profile set up and optimised so you show up in local map results",
  "On-page SEO done properly from the start — titles, structure, speed, mobile",
  "A site that earns trust from both Google and the humans who land on it",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Search-Ready Website",
      serviceType: "SEO website design and development",
      description:
        "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so customers find you first.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "3000",
        url: absoluteUrl("/services/search-ready"),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: "Search-Ready Website", item: absoluteUrl("/services/search-ready") },
      ],
    },
  ],
};

export default function SearchReadyPage() {
  return (
    <SitePage
      current="/services"
      jsonLd={jsonLd}
      invite={
        <>
          <p>
            15 minutes. We'll look at your market together and tell you
            exactly what's possible.
          </p>
          <BookingButton service="Search-Ready Website" className="btn">
            Book a Free Call
          </BookingButton>
        </>
      }
    >
      <header className="wrap page-head">
        <div>
          <Link href="/services" className="link-line page-back">
            <ArrowLeft aria-hidden="true" />
            All services
          </Link>
          <h1 className="display page-title">
            <ServiceMorph slug="search-ready" part="title">
              <span className="inline-block">Search-Ready <br />Website</span>
            </ServiceMorph>
          </h1>
          <ServiceMorph slug="search-ready" part="price">
            <p className="display figure page-price">One-time · RM 3,000 – 6,000</p>
          </ServiceMorph>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            You have a website — or you're building one — but it's not bringing
            in customers. People search for exactly what you sell and find your
            competitors instead. This is the fix: a site built to be found, not
            just built to look good.
          </p>
          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="page-action">
            <BookingButton service="Search-Ready Website" className="btn">
              Book a Free Call
            </BookingButton>
          </div>
        </div>
      </header>

      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            What you get
          </h2>
        </div>
        <ul className="part-body points">
          {outcomes.map((item, index) => (
            <li key={item} data-reveal style={order(index)}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap cols band">
        <h2 className="display" data-reveal>
          This is the right fit if:
        </h2>
        <p data-reveal style={order(1)}>
          You're a service business — a clinic, a law firm, a contractor, a
          tuition centre — where customers search before they decide. You
          want to show up when they do, not rely on word-of-mouth alone. You
          understand that a website without visibility is just an expensive
          brochure.
        </p>
      </section>
    </SitePage>
  );
}
