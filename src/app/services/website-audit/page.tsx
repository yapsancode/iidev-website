import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";
import { ServiceMorph } from "@/components/ui/ServiceMorph";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";
import {
  BADGE,
  CARD_ACCENT,
  CARD_DARK,
  CARD_WHITE,
  LABEL,
  PRIMARY_BUTTON,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

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
          <ServiceMorph slug="website-audit" part="price">
            <p className={cn(BADGE, "mb-5 flex w-fit text-sm")}>
              Start here · RM 500
            </p>
          </ServiceMorph>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Website Audit
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl">
            You know your website isn't pulling its weight — but not exactly why.
            Before you spend on a rebuild, get a clear, honest read on what's
            actually wrong. We audit your site and your Google presence, then
            hand you a prioritised list of fixes in plain language. No pitch, no
            jargon — just where you stand and what to do about it.
          </p>

          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="mb-16">
            <BookingButton service="Website Audit" className={PRIMARY_BUTTON}>
              Get Your Audit
            </BookingButton>
          </div>

          {/* Outcomes */}
          <div className={cn(CARD_WHITE, "mb-16 p-6 md:p-8")}>
            <h2 className={cn(LABEL, "mb-6 text-neutral-600 dark:text-neutral-300")}>
              What you get
            </h2>
            <ul className="space-y-4">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Credited back */}
          <div className={cn(CARD_DARK, "mb-16 p-6 md:p-8")}>
            <h2 className="font-bold mb-2">
              Credited back if you go ahead
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              The audit is RM 500. If you start a project with us within 30 days,
              we credit the full RM 500 back — so if you're serious about fixing
              things, it effectively costs you nothing. You either walk away with
              a clear plan, or you put it straight toward the work.
            </p>
          </div>

          {/* Right fit */}
          <div className={cn(CARD_ACCENT, "mb-16 p-6 md:p-8")}>
            <h2 className="font-bold mb-2">
              This is the right fit if:
            </h2>
            <p className="text-black/80 leading-relaxed">
              You've got a website but it's not bringing in calls or bookings,
              and you want a straight diagnosis before committing to a bigger
              project. You'd rather know exactly what's wrong — and what it's
              worth fixing — than keep guessing.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Website Audit" className={PRIMARY_BUTTON}>
              Get Your Audit
            </BookingButton>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Send us your website and what you wish it did better. We'll take it
              from there and get your report back to you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
