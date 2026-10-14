import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Web Presence — Get Your Business Online Properly (RM 1k–3k)",
  description:
    "A fast, credible website for Malaysian businesses getting online for the first time. Mobile-optimised, SEO-ready, and fully owned by you — no builder lock-in. From RM 1,000.",
  alternates: { canonical: "/services/web-presence" },
  openGraph: {
    title: "Web Presence | IIDev Studio",
    description:
      "A fast, credible website for Malaysian businesses getting online for the first time. Mobile-optimised, SEO-ready, fully owned by you.",
    url: "/services/web-presence",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const outcomes = [
  "A site that loads fast and looks credible on any device — phone or desktop",
  "Google can find and index you from day one, so you're not invisible by default",
  "Clear contact points — WhatsApp, inquiry form, directions — so customers can actually reach you",
  "Built on a proper tech stack, not a drag-and-drop builder that breaks when you need it most",
  "You own everything: domain, hosting, code — no lock-in, no monthly ransom",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Web Presence",
      serviceType: "Website design and development",
      description:
        "A fast, credible website for Malaysian businesses getting online for the first time. Mobile-optimised, SEO-ready, and fully owned by you.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "1000",
        url: absoluteUrl("/services/web-presence"),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: "Web Presence", item: absoluteUrl("/services/web-presence") },
      ],
    },
  ],
};

export default function WebPresencePage() {
  return (
    <SitePage
      current="/services"
      jsonLd={jsonLd}
      invite={
        <>
          <p>
            15 minutes. No pitch. Just clarity on whether this is the right
            move for you.
          </p>
          <BookingButton service="Web Presence" className="btn">
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
            <ServiceMorph slug="web-presence" part="title">
              <span className="inline-block">Web Presence</span>
            </ServiceMorph>
          </h1>
          <ServiceMorph slug="web-presence" part="price">
            <p className="display figure page-price">One-time · RM 1,000 – 3,000</p>
          </ServiceMorph>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            You don't have a website yet — or the one you have makes you look
            like you closed two years ago. This gets you online properly, so
            customers stop second-guessing whether your business is real.
          </p>
          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="page-action">
            <BookingButton service="Web Presence" className="btn">
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
          You're a new business, a clinic, a restaurant, or a service
          provider who needs a professional online home — something you can
          confidently send customers to. You're not chasing page-one Google
          rankings yet. You just need to exist online, properly.
        </p>
      </section>
    </SitePage>
  );
}
