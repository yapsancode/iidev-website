import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { SitePage, order } from "@/components/site/chrome";
import { BusinessOsDemo } from "@/components/ui/BusinessOsDemo";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Business OS — A Custom System to Run Your Business (RM 10k onwards)",
  description:
    "A custom-built system scoped to your exact business — customer and sales tracking, invoicing, inventory, and bookings, all in one place. Built local, launched fast. From RM 10,000.",
  alternates: { canonical: "/services/business-os" },
  openGraph: {
    title: "Business OS | IIDev Studio",
    description:
      "A custom system built around how your business actually works — customers, invoicing, inventory, and bookings, all in one place.",
    url: "/services/business-os",
    type: "website",
    images: ["/opengraph-image"],
  },
};

// Locked pricing: every build is the core (RM 6,000, once) plus modules. No
// module is under RM 4,000, so the smallest build is RM 10,000 — which keeps
// the "RM 10,000 onwards" badge true. Change these together or not at all.
// After launch the client also pays hosting and upkeep monthly (UPKEEP_PRICE).
const CORE_PRICE = "RM 6,000";
const UPKEEP_PRICE = "from RM 200 a month";

const modules = [
  {
    title: "Customer & Sales (CRM)",
    desc: "Every customer, lead, and deal in one place — so nothing falls through the cracks.",
    price: "from RM 5,000",
    tag: undefined as string | undefined,
    comingSoon: false,
  },
  {
    title: "Invoicing & Quotations",
    desc: "Send professional invoices and quotes in seconds. See what's paid, what's overdue.",
    price: "from RM 4,000",
    tag: "Good first step",
    comingSoon: false,
  },
  {
    title: "Inventory & Stock",
    desc: "Real-time stock levels and low-stock alerts. No more guessing what's on the shelf.",
    price: "from RM 5,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    title: "Bookings & Appointments",
    desc: "Let customers book online and keep your schedule organised automatically.",
    price: "from RM 4,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    title: "Dashboard & Reports",
    desc: "See how the business is doing at a glance — sales, cash flow, what needs attention.",
    price: "from RM 4,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    title: "MyInvois e-Invoicing",
    desc: "LHDN e-invoices sent straight from your system — no typing the same invoice twice.",
    price: "Not available yet",
    tag: "Coming soon",
    comingSoon: true,
  },
];

// The hosted, full demo of Business OS. Leave empty until it is live — the
// "See it in action" section always shows the built-in sample (BusinessOsDemo)
// and adds a "coming soon" note under it, so production never ships a dead
// link. Fill this in to turn the note into a link.
const DEMO_URL = "";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Business OS",
      serviceType: "Custom business management system",
      description:
        "A custom system built around how your business actually works — customer and sales tracking, invoicing, inventory, and bookings, all in one place.",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        // A starting price, not a fixed one.
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "MYR",
          minPrice: 10000,
        },
        url: absoluteUrl("/services/business-os"),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Business OS modules",
        itemListElement: modules.filter((m) => !m.comingSoon).map((m) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: m.title,
            description: m.desc,
          },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
        { "@type": "ListItem", position: 3, name: "Business OS", item: absoluteUrl("/services/business-os") },
      ],
    },
  ],
};

export default function BusinessOSPage() {
  return (
    <SitePage
      current="/services"
      jsonLd={jsonLd}
      invite={
        <>
          <p>
            We'll map out how your business runs today and scope a system that
            fits it — no jargon, no six-month rollout.
          </p>
          <BookingButton service="Business OS" className="btn">
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
            <ServiceMorph slug="business-os" part="title">
              <span className="inline-block">Business OS</span>
            </ServiceMorph>
          </h1>
          <ServiceMorph slug="business-os" part="price">
            <p className="display figure page-price">One-time · RM 10,000 onwards</p>
          </ServiceMorph>
        </div>
        <div className="page-foot">
          <p className="page-lead">
            You're running your business on spreadsheets, WhatsApp, and gut feel
            — and it's starting to cost you. Customers slip through the cracks.
            Stock goes missing. Invoices pile up. This is the fix: a system built
            around how your business actually works, not a generic tool you have
            to work around.
          </p>
          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="page-action">
            <BookingButton service="Business OS" className="btn">
              Book a Free Call
            </BookingButton>
          </div>
        </div>
      </header>

      {/* Modules */}
      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            What we can build
          </h2>
          <p data-reveal style={order(1)}>
            Business OS isn't one fixed product — it's a set of modules we
            build around your business. Start with the one or two that hurt
            most, then add the rest as you grow. You only pay for what you'll
            actually use.
          </p>
        </div>
        <div className="part-body">
          <div className="modules">
            {/* Core — part of every build, paid once */}
            <div className="module is-core" data-reveal>
              <p className="module-note">Every build</p>
              <h3>The core system</h3>
              <p>
                Secure logins, staff accounts with the right access for each
                person, and the setup and handover that get your team using
                it. You pay for this once, however many modules you add.
              </p>
              <p className="module-price">{CORE_PRICE}</p>
            </div>
            {modules.map(({ title, desc, price, tag, comingSoon }) => (
              <div
                key={title}
                className={comingSoon ? "module is-later" : "module"}
                data-reveal
              >
                {tag && <p className="module-note">{tag}</p>}
                <h3>{title}</h3>
                <p>{desc}</p>
                <p className="module-price">{price}</p>
              </div>
            ))}
          </div>
          <div className="module-terms">
            <p>
              The smallest build is the core plus one module — RM 10,000. You
              pay for the core once; every module after that just adds its own
              price. These are starting prices — final scope and cost are agreed
              with you on a discovery call, never before.
            </p>
            <p>
              After launch, hosting and upkeep are billed separately,{" "}
              <strong className="font-medium">{UPKEEP_PRICE}</strong>. We
              confirm the exact amount with your quote.
            </p>
            <p>
              We'd rather get one module genuinely right than rush all of them.
              Start where it hurts most — add the rest when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* See it in action */}
      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display" data-reveal>
            See it in action
          </h2>
          <p data-reveal style={order(1)}>
            Don't take our word for it — try it. Pick your kind of business
            and tap around. It's a small sample with made-up data, but it
            shows the idea: do one thing, and everything else updates by
            itself.
          </p>
        </div>
        <div className="part-body">
          <BusinessOsDemo />

          <div className="demo-foot">
            <p>
              This is a simplified sample, not the finished product. Your
              system is built around how your business actually works.
            </p>

            {/* The hosted demo — a link once DEMO_URL is set, "coming soon" until then */}
            {DEMO_URL ? (
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-line"
              >
                Open the full demo
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="muted">Full demo — coming soon</p>
            )}
          </div>
        </div>
      </section>

      <section className="wrap cols band">
        <h2 className="display" data-reveal>
          This is the right fit if:
        </h2>
        <p data-reveal style={order(1)}>
          You're an SME owner still stitching things together with Excel and
          WhatsApp. You know you need a proper system but don't want to pay
          for SAP or spend six months configuring Odoo. You want something
          that works the way your business works — built local, launched
          fast, and supported by someone you can actually call.
        </p>
      </section>
    </SitePage>
  );
}
