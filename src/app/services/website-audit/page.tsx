import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Website Audit — A Straight Diagnosis Before You Rebuild (RM 500)",
  description:
    "A clear, honest review of your website and Google presence, with a prioritised fix list in plain language. RM 500 — credited back in full if you start a project with us within 30 days.",
  alternates: { canonical: "/services/website-audit" },
  openGraph: {
    title: "Website Audit | IIDev Studio",
    description:
      "A clear, honest review of your website and Google presence, with a prioritised fix list in plain language. RM 500, credited back if you hire us within 30 days.",
    url: "/services/website-audit",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const outcomes = [
  "A full review of your current site — speed, mobile experience, and how it actually looks to a customer",
  "The friction points costing you enquiries — where visitors leave instead of calling or booking",
  "How findable you are on Google — and the specific gaps holding you back",
  "A prioritised, plain-language fix list — what to fix first, what can wait, and why",
  "A short walkthrough so you understand the findings, not just receive a PDF",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Website Audit",
      serviceType: "Website and SEO audit",
      description:
        "A paid review of your website and Google presence with a prioritised, plain-language fix list. Credited back in full if you start a project within 30 days.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "500",
        url: absoluteUrl("/services/website-audit"),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: "Website Audit", item: absoluteUrl("/services/website-audit") },
      ],
    },
  ],
};

export default function WebsiteAuditPage() {
  return (
    <SitePage
      current="/services"
      jsonLd={jsonLd}
      invite={
        <>
          <p>
            Send us your website and what you wish it did better. We'll take it
            from there and get your report back to you.
          </p>
          <BookingButton service="Website Audit" className="btn">
            Get Your Audit
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
            Website Audit
          </h1>
          <ServiceMorph slug="website-audit" part="price">
            <p className="display figure page-price">Start here · RM 500</p>
          </ServiceMorph>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            You know your website isn't pulling its weight — but not exactly why.
            Before you spend on a rebuild, get a clear, honest read on what's
            actually wrong. We audit your site and your Google presence, then
            hand you a prioritised list of fixes in plain language. No pitch, no
            jargon — just where you stand and what to do about it.
          </p>
          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="page-action">
            <BookingButton service="Website Audit" className="btn">
              Get Your Audit
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

      {/* Credited back */}
      <section className="wrap cols band on-accent">
        <h2 className="display" data-reveal>
          Credited back if you go ahead
        </h2>
        <p data-reveal style={order(1)}>
          The audit is RM 500. If you start a project with us within 30 days,
          we credit the full RM 500 back — so if you're serious about fixing
          things, it effectively costs you nothing. You either walk away with
          a clear plan, or you put it straight toward the work.
        </p>
      </section>

      <section className="wrap cols band">
        <h2 className="display" data-reveal>
          This is the right fit if:
        </h2>
        <p data-reveal style={order(1)}>
          You've got a website but it's not bringing in calls or bookings,
          and you want a straight diagnosis before committing to a bigger
          project. You'd rather know exactly what's wrong — and what it's
          worth fixing — than keep guessing.
        </p>
      </section>
    </SitePage>
  );
}
