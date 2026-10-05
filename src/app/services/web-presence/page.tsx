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
  CARD_WHITE,
  LABEL,
  PRIMARY_BUTTON,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

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
          <ServiceMorph slug="web-presence" part="price">
            <p className={cn(BADGE, "mb-5 flex w-fit text-sm")}>
              One-time · RM 1,000 – 3,000
            </p>
          </ServiceMorph>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            <ServiceMorph slug="web-presence" part="title">
              <span className="inline-block">Web Presence</span>
            </ServiceMorph>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl">
            You don't have a website yet — or the one you have makes you look
            like you closed two years ago. This gets you online properly, so
            customers stop second-guessing whether your business is real.
          </p>

          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="mb-16">
            <BookingButton service="Web Presence" className={PRIMARY_BUTTON}>
              Book a Free Call
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

          {/* Right fit */}
          <div className={cn(CARD_ACCENT, "mb-16 p-6 md:p-8")}>
            <h2 className="font-bold mb-2">
              This is the right fit if:
            </h2>
            <p className="text-black/80 leading-relaxed">
              You're a new business, a clinic, a restaurant, or a service
              provider who needs a professional online home — something you can
              confidently send customers to. You're not chasing page-one Google
              rankings yet. You just need to exist online, properly.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Web Presence" className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              15 minutes. No pitch. Just clarity on whether this is the right
              move for you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
