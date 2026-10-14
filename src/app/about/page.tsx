import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Team from "@/components/sections/Team";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About — A Founder-Led Web & SEO Studio in Malaysia",
  description:
    "IIDev Studio is a two-person, founder-led web design and SEO studio in Malaysia. We build fast, search-ready websites that bring local service businesses more calls and bookings.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About IIDev Studio",
    description:
      "A two-person, founder-led web design and SEO studio in Malaysia. We build fast, search-ready websites that bring local service businesses more calls and bookings.",
    url: "/about",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const beliefs = [
  "Founder-led, no outsourcing. The people you meet are the people who build your site.",
  "Performance isn't an upsell. Fast loading and mobile-first are how every site starts — not an add-on.",
  "Honest about SEO. We can't promise a #1 ranking, and we won't pretend otherwise. We build the strongest foundation and tell you the truth.",
  "We don't vanish after launch. We stay reachable for the fixes and tweaks that come up months later.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": absoluteUrl("/about#webpage"),
      url: absoluteUrl("/about"),
      name: "About IIDev Studio",
      description:
        "IIDev Studio is a two-person, founder-led web design and SEO studio in Malaysia, building fast, search-ready websites for local service businesses.",
      about: { "@id": ORGANIZATION_ID },
      isPartOf: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#isyraf-afifi"),
      name: "Isyraf Afifi",
      jobTitle: "Co-Founder & Product",
      worksFor: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#imran-ariff"),
      name: "Imran Ariff",
      jobTitle: "Co-Founder & Tech Lead",
      worksFor: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <SitePage
      current="/about"
      jsonLd={jsonLd}
      invite={
        <>
          <h2 className="display" data-reveal>
            Let&apos;s see if we&apos;re a fit.
          </h2>
          <p data-reveal style={order(1)}>
            Book a free 15-minute discovery call — no pitch, no pressure. Just a
            straight conversation about your business and whether we can help.
          </p>
          <BookingButton className="btn">Book a Free Call</BookingButton>
          <p className="foot-aside">
            <Link href="/#faq" className="link link-line">
              Got questions first? Read the FAQ →
            </Link>
          </p>
        </>
      }
    >
      {/* Intro */}
      <header className="wrap page-head">
        <div>
          <p className="page-kicker">About us</p>
          <h1 className="display page-title">About IIDev Studio</h1>
        </div>
        <div className="page-foot">
          <div className="page-lead">
            <p>
              IIDev Studio is a Malaysian web design and SEO studio. We build
              fast, search-ready websites for local service businesses —
              clinics, restaurants, consultants, contractors, and retailers —
              that need a website which actually brings in customers, not one
              that just sits there looking nice.
            </p>
            <p>
              We&apos;re a two-person, founder-led team, and we keep it that way
              on purpose. When you work with us, you deal directly with the
              people writing your code and shaping your strategy — never an
              account manager passing notes to a team you&apos;ll never meet.
            </p>
          </div>
        </div>
      </header>

      {/* What we do */}
      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            What we do
          </h2>
        </div>
        <div className="part-body" data-reveal style={order(1)}>
          <p>
            At our core, we do three things well: get your business online
            properly, get it found on Google, and keep it growing month after
            month. Whether you&apos;re starting from nothing or fixing a site that
            never brought in a single lead, we build around one question — will
            this bring you more calls, bookings, and customers? And once
            you&apos;re online and growing, we build the systems to run it day to
            day — customers, invoicing, and inventory, all in one place.
          </p>
          <Link href="/services" className="link link-line">
            See how we can help
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* What we believe */}
      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            What we believe
          </h2>
        </div>
        <ul className="part-body points">
          {beliefs.map((item, index) => (
            <li key={item} data-reveal style={order(index)}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Who we work with */}
      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            Who we work with
          </h2>
        </div>
        <div className="part-body" data-reveal style={order(1)}>
          <p>
            We focus on Malaysian service businesses, because we understand the
            local market, the customers, and how they search. That said, we&apos;re
            open to working with clients further afield when the project is a
            good fit.
          </p>
        </div>
      </section>

      {/* Founders */}
      <Team />
    </SitePage>
  );
}
