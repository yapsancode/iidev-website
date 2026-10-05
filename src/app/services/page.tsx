import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SITE_URL, absoluteUrl } from "@/lib/site-config";
import {
  BADGE,
  CARD_FRAME,
  CARD_HOVER,
  CARD_WHITE,
  LABEL,
  PRIMARY_BUTTON,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

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
    variant: "light" as const,
    imgSrc: "/images/cherry-monitor-1.png",
    imgAlt: "Laptop",
    imgClassName: "right-0 -bottom-2 w-30 h-30",
  },
  {
    title: "Search-Ready Website",
    price: "RM 3,000 – 6,000",
    target: "One-time",
    description:
      "For businesses that want to actually be found on Google. Website + on-page SEO setup + Google Business Profile + keyword research.",
    href: "/services/search-ready",
    variant: "accent" as const,
    imgSrc: "/images/fogg-magnifying-glass.png",
    imgAlt: "Magnifying glass",
  },
  {
    title: "Growth Retainer",
    price: "RM 1,000 – 2,000 / month",
    target: "Monthly",
    description:
      "For businesses ready to invest consistently in growing online. Ongoing SEO, content updates, performance reporting, rank tracking.",
    href: "/services/growth-retainer",
    variant: "dark" as const,
    imgSrc: "/images/fogg-arrow-1.png",
    imgAlt: "Growth graph",
    imgClassName: "right-0 -bottom-6 w-40 h-40",
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
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main id="main" className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">
          {/* Header */}
          <div className="mb-16">
            <div className={cn(BADGE, "mb-6")}>What we offer</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
              How we <br />can help.
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-lg">
              Each package is built for a specific stage of business growth. Pick
              the one that matches where you are right now.
            </p>
          </div>

          {/* Start here — Website Audit */}
          <Link
            href="/services/website-audit"
            className={cn(CARD_WHITE, CARD_HOVER, "group mb-6 block p-6")}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                  <span className={cn(LABEL, "bg-black px-2 py-1 text-white dark:bg-white dark:text-black")}>
                    Start here
                  </span>
                  <span className={cn(LABEL, "text-neutral-700 dark:text-neutral-300")}>
                    RM 500 · credited back if you hire us
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-1">
                  Not sure where you stand? Get a Website Audit.
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  We review your site and Google presence, then send a
                  prioritised fix list — a straight answer on what's costing you
                  leads, before you spend on a rebuild.
                </p>
              </div>
              <div className={cn(LABEL, "flex items-center whitespace-nowrap shrink-0 group-hover:underline")}>
                See how it works
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <ServiceCard key={tier.title} {...tier} />
            ))}
          </div>

          {/* Flagship — Business OS */}
          <Link
            href="/services/business-os"
            className={cn(
              CARD_FRAME,
              CARD_HOVER,
              "group mt-6 block bg-black p-8 text-white md:p-10",
              "shadow-[6px_6px_0px_0px_#10b981] hover:shadow-[3px_3px_0px_0px_#10b981] dark:shadow-[6px_6px_0px_0px_#10b981] dark:hover:shadow-[3px_3px_0px_0px_#10b981]",
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                  <span className={cn(LABEL, "bg-emerald-300 px-2 py-1 text-black")}>
                    Flagship
                  </span>
                  <span className={cn(LABEL, "text-neutral-300")}>
                    One-time · RM 10,000 onwards
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  Business OS
                </h2>
                <p className="text-neutral-300 leading-relaxed">
                  Still running on spreadsheets, WhatsApp, and gut feel? We build
                  a custom system around how your business actually works —
                  customer tracking, invoicing, inventory, and MyInvois
                  compliance, all in one place.
                </p>
              </div>
              <div className={cn(LABEL, "flex items-center whitespace-nowrap shrink-0 group-hover:underline")}>
                See what you get
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Bottom CTA */}
          <div className="mt-16 pt-12 border-t-2 border-black dark:border-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-sm">
              Not sure which one fits? Book a free 15-minute call — no pitch,
              just clarity.
            </p>
            <BookingButton className={cn(PRIMARY_BUTTON, "whitespace-nowrap")}>
              Book a Free Call
            </BookingButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
