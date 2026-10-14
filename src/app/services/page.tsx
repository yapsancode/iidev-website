import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SitePage } from "@/components/site/chrome";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Services & Pricing — Web Design & SEO for Malaysian Businesses",
  description:
    "Web design and SEO for Malaysian businesses: get online (RM 1k–3k), get found on Google (RM 3k–6k), grow every month with an SEO retainer, or run your whole business on a custom system (Business OS, RM 10k onwards).",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Pricing | IIDev Studio",
    description:
      "Web design and SEO for Malaysian businesses: get online, get found on Google, grow monthly with an SEO retainer, or run your business on a custom system.",
    url: "/services",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const tiers = [
  {
    title: "Web Presence",
    price: "RM 1,000 – 3,000",
    target: "One-time",
    description:
      "For new businesses getting online for the first time. Basic but solid — SEO-ready foundation, mobile optimised, fast loading.",
    href: "/services/web-presence",
  },
  {
    title: "Search-Ready Website",
    price: "RM 3,000 – 6,000",
    target: "One-time",
    description:
      "For businesses that want to actually be found on Google. Website + on-page SEO setup + Google Business Profile + keyword research.",
    href: "/services/search-ready",
  },
  {
    title: "Growth Retainer",
    price: "RM 1,000 – 2,000 / month",
    target: "Monthly",
    description:
      "For businesses ready to invest consistently in growing online. Ongoing SEO, content updates, performance reporting, rank tracking.",
    href: "/services/growth-retainer",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: absoluteUrl("/services"),
    },
  ],
};

export default function ServicesPage() {
  return (
    <SitePage
      current="/services"
      jsonLd={breadcrumbJsonLd}
      invite={
        <>
          <p>
            Not sure which one fits? Book a free 15-minute call — no pitch,
            just clarity.
          </p>
          <BookingButton className="btn">Book a Free Call</BookingButton>
        </>
      }
    >
      <header className="wrap page-head">
        <div>
          <p className="page-kicker">What we offer</p>
          <h1 className="display page-title">
            How we <br />can help.
          </h1>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            Each package is built for a specific stage of business growth. Pick
            the one that matches where you are right now.
          </p>
        </div>
      </header>

      <div className="ladder">
        {/* Start here — Website Audit */}
        <Link href="/services/website-audit" className="rung is-start">
          <p className="rung-kind">Start here</p>
          <div className="rung-main">
            <h2 className="display rung-title">
              Not sure where you stand? Get a Website Audit.
            </h2>
            <p className="rung-text">
              We review your site and Google presence, then send a
              prioritised fix list — a straight answer on what's costing you
              leads, before you spend on a rebuild.
            </p>
          </div>
          <div className="rung-side">
            <ServiceMorph slug="website-audit" part="price">
              <p className="rung-price">RM 500 · credited back if you hire us</p>
            </ServiceMorph>
            <span className="rung-more">
              See how it works
              <ArrowRight aria-hidden="true" />
            </span>
          </div>
        </Link>

        {tiers.map((tier) => (
          <ServiceCard key={tier.title} {...tier} />
        ))}

        {/* Flagship — Business OS */}
        <Link href="/services/business-os" className="rung on-accent">
          <p className="rung-kind">Flagship</p>
          <div className="rung-main">
            <h2 className="display rung-title">
              <ServiceMorph slug="business-os" part="title">
                <span>Business OS</span>
              </ServiceMorph>
            </h2>
            <p className="rung-text">
              Still running on spreadsheets, WhatsApp, and gut feel? We build
              a custom system around how your business actually works —
              customer tracking, invoicing, inventory, and bookings, all in
              one place.
            </p>
          </div>
          <div className="rung-side">
            <ServiceMorph slug="business-os" part="price">
              <p className="rung-price">One-time · RM 10,000 onwards</p>
            </ServiceMorph>
            <span className="rung-more">
              See what you get
              <ArrowRight aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </SitePage>
  );
}
