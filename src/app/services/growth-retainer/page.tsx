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
          <ServiceMorph slug="growth-retainer" part="price">
            <p className={cn(BADGE, "mb-5 flex w-fit text-sm")}>
              Monthly · RM 1,000 – 2,000 / month
            </p>
          </ServiceMorph>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            <ServiceMorph slug="growth-retainer" part="title">
              <span className="inline-block">Growth Retainer</span>
            </ServiceMorph>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8 max-w-xl">
            You're already online and getting some traction. Now you want to
            compound it. SEO isn't a one-time setup — it's a direction you
            commit to. This retainer means someone is actively working on your
            growth every month, not just once and forgetting you exist.
          </p>

          {/* Early CTA — visitors who are already convinced don't have to scroll */}
          <div className="mb-16">
            <BookingButton service="Growth Retainer" className={PRIMARY_BUTTON}>
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
              You have a working website and you understand that growth online is
              a process, not a project. You're ready to invest consistently
              instead of hoping a one-time fix will carry you forever. You want
              to see your rankings move, your traffic grow, and know exactly
              why.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Growth Retainer" className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We'll audit your current situation and map out what consistent
              growth actually looks like for your business.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
