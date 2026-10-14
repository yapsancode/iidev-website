import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Growth Retainer — Monthly SEO That Compounds (RM 1k–2k/mo)",
  description:
    "Ongoing SEO for Malaysian businesses ready to grow consistently. Monthly content, technical fixes, rank tracking, and a plain-language report — with direct access to the person doing the work. From RM 1,000/month.",
  alternates: { canonical: "/services/growth-retainer" },
  openGraph: {
    title: "Growth Retainer | IIDev Studio",
    description:
      "Ongoing SEO for Malaysian businesses ready to grow consistently. Monthly content, technical fixes, rank tracking, and clear reporting.",
    url: "/services/growth-retainer",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const outcomes = [
  "Monthly SEO work — new content, technical fixes, and improvements that compound over time",
  "Rank tracking so you see actual movement, not just effort and invoices",
  "A plain-language performance report every month — what changed, what's next, no fluff",
  "Content that keeps working after it's published — not one-off posts that disappear",
  "Direct access to the person doing the work, not a project manager relaying messages",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Growth Retainer",
      serviceType: "Monthly SEO and content retainer",
      description:
        "Ongoing SEO for Malaysian businesses ready to grow consistently. Monthly content, technical fixes, rank tracking, and clear reporting.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "1000",
        url: absoluteUrl("/services/growth-retainer"),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: "Growth Retainer", item: absoluteUrl("/services/growth-retainer") },
      ],
    },
  ],
};

export default function GrowthRetainerPage() {
  return (
    <SitePage
      current="/services"
      jsonLd={jsonLd}
      invite={
        <>
          <p>
            We'll audit your current situation and map out what consistent
            growth actually looks like for your business.
          </p>
          <BookingButton service="Growth Retainer" className="btn">
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
            <ServiceMorph slug="growth-retainer" part="title">
              <span className="inline-block">Growth Retainer</span>
            </ServiceMorph>
          </h1>
          <ServiceMorph slug="growth-retainer" part="price">
            <p className="display figure page-price">Monthly · RM 1,000 – 2,000 / month</p>
          </ServiceMorph>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            You're already online and getting some traction. Now you want to
            compound it. SEO isn't a one-time setup — it's a direction you
            commit to. This retainer means someone is actively working on your
            growth every month, not just once and forgetting you exist.
          </p>
          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="page-action">
            <BookingButton service="Growth Retainer" className="btn">
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
          You have a working website and you understand that growth online is
          a process, not a project. You're ready to invest consistently
          instead of hoping a one-time fix will carry you forever. You want
          to see your rankings move, your traffic grow, and know exactly
          why.
        </p>
      </section>
    </SitePage>
  );
}
