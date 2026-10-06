import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Receipt,
  ShieldCheck,
  Boxes,
  CalendarCheck,
  LayoutDashboard,
  Layers,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";
import { BusinessOsDemo } from "@/components/ui/BusinessOsDemo";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";
import {
  BADGE,
  CARD_ACCENT,
  LABEL,
  PRIMARY_BUTTON,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

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
    icon: Users,
    title: "Customer & Sales (CRM)",
    desc: "Every customer, lead, and deal in one place — so nothing falls through the cracks.",
    price: "from RM 5,000",
    tag: undefined as string | undefined,
    comingSoon: false,
  },
  {
    icon: Receipt,
    title: "Invoicing & Quotations",
    desc: "Send professional invoices and quotes in seconds. See what's paid, what's overdue.",
    price: "from RM 4,000",
    tag: "Good first step",
    comingSoon: false,
  },
  {
    icon: Boxes,
    title: "Inventory & Stock",
    desc: "Real-time stock levels and low-stock alerts. No more guessing what's on the shelf.",
    price: "from RM 5,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    icon: CalendarCheck,
    title: "Bookings & Appointments",
    desc: "Let customers book online and keep your schedule organised automatically.",
    price: "from RM 4,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & Reports",
    desc: "See how the business is doing at a glance — sales, cash flow, what needs attention.",
    price: "from RM 4,000",
    tag: undefined,
    comingSoon: false,
  },
  {
    icon: ShieldCheck,
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
    <div className="min-h-screen flex flex-col font-sans overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="main" className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
          {/* Back */}
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All services
          </Link>

          {/* Header */}
          <ServiceMorph slug="business-os" part="price">
            <p className={cn(BADGE, "mb-5 flex w-fit text-sm")}>
              One-time · RM 10,000 onwards
            </p>
          </ServiceMorph>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            <ServiceMorph slug="business-os" part="title">
              <span className="inline-block">Business OS</span>
            </ServiceMorph>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl">
            You're running your business on spreadsheets, WhatsApp, and gut feel
            — and it's starting to cost you. Customers slip through the cracks.
            Stock goes missing. Invoices pile up. This is the fix: a system built
            around how your business actually works, not a generic tool you have
            to work around.
          </p>

          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="mb-16">
            <BookingButton service="Business OS" className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>
          </div>

          {/* Modules */}
          <div className="mb-16">
            <h2 className={cn(LABEL, "mb-3 text-neutral-600 dark:text-neutral-300")}>
              What we can build
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Business OS isn't one fixed product — it's a set of modules we
              build around your business. Start with the one or two that hurt
              most, then add the rest as you grow. You only pay for what you'll
              actually use.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Core — part of every build, paid once */}
              <div className="relative border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] sm:col-span-2">
                <span className="absolute right-0 top-0 border-b-2 border-l-2 border-black bg-emerald-300 px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-black dark:border-white">
                  Every build
                </span>
                <Layers className="h-5 w-5 text-neutral-900 dark:text-white mb-3" aria-hidden="true" />
                <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                  The core system
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                  Secure logins, staff accounts with the right access for each
                  person, and the setup and handover that get your team using
                  it. You pay for this once, however many modules you add.
                </p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white mt-3">
                  {CORE_PRICE}
                </p>
              </div>
              {modules.map(({ icon: Icon, title, desc, price, tag, comingSoon }) => (
                <div
                  key={title}
                  className={cn(
                    "relative border-2 border-black bg-white p-5 dark:border-white dark:bg-neutral-800",
                    comingSoon
                      ? "border-dashed"
                      : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                  )}
                >
                  {tag && (
                    <span
                      className={cn(
                        "absolute right-0 top-0 border-b-2 border-l-2 border-black px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-black dark:border-white",
                        comingSoon ? "border-dashed bg-neutral-200" : "bg-emerald-300",
                      )}
                    >
                      {tag}
                    </span>
                  )}
                  <Icon className="h-5 w-5 text-neutral-900 dark:text-white mb-3" aria-hidden="true" />
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {desc}
                  </p>
                  <p
                    className={cn(
                      "text-sm mt-3",
                      comingSoon
                        ? "text-neutral-600 dark:text-neutral-400"
                        : "font-bold text-neutral-900 dark:text-white",
                    )}
                  >
                    {price}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed max-w-xl">
              The smallest build is the core plus one module — RM 10,000. You
              pay for the core once; every module after that just adds its own
              price. These are starting prices — final scope and cost are agreed
              with you on a discovery call, never before.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed max-w-xl">
              After launch, hosting and upkeep are billed separately,{" "}
              <span className="font-bold text-neutral-900 dark:text-white">
                {UPKEEP_PRICE}
              </span>
              . We confirm the exact amount with your quote.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
              We'd rather get one module genuinely right than rush all of them.
              Start where it hurts most — add the rest when you're ready.
            </p>
          </div>

          {/* See it in action */}
          <div className="mb-16">
            <h2 className={cn(LABEL, "mb-3 text-neutral-600 dark:text-neutral-300")}>
              See it in action
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Don't take our word for it — try it. Pick your kind of business
              and tap around. It's a small sample with made-up data, but it
              shows the idea: do one thing, and everything else updates by
              itself.
            </p>

            <BusinessOsDemo />

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed max-w-xl">
              This is a simplified sample, not the finished product. Your
              system is built around how your business actually works.
            </p>

            {/* The hosted demo — a link once DEMO_URL is set, "coming soon" until then */}
            <div className="mt-6">
              {DEMO_URL ? (
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase"
                >
                  Open the full demo
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 border-2 border-dashed border-black dark:border-white text-neutral-700 dark:text-neutral-300 py-3 px-8 font-mono text-sm uppercase">
                  Full demo — coming soon
                </span>
              )}
            </div>
          </div>

          {/* Right fit */}
          <div className={cn(CARD_ACCENT, "mb-16 p-6 md:p-8")}>
            <h2 className="font-bold mb-2">
              This is the right fit if:
            </h2>
            <p className="text-black/80 leading-relaxed">
              You're an SME owner still stitching things together with Excel and
              WhatsApp. You know you need a proper system but don't want to pay
              for SAP or spend six months configuring Odoo. You want something
              that works the way your business works — built local, launched
              fast, and supported by someone you can actually call.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Business OS" className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We'll map out how your business runs today and scope a system that
              fits it — no jargon, no six-month rollout.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
