import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Team from "@/components/sections/Team";
import { BookingButton } from "@/components/modal/BookingButton";
import { ORGANIZATION_ID, SITE_URL, absoluteUrl } from "@/lib/site-config";
import { BADGE, CARD_WHITE, PRIMARY_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col font-sans overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="main" className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        {/* Intro */}
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-16">
          <div className={cn(BADGE, "mb-6")}>About us</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
            About IIDev Studio
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed mb-6">
            IIDev Studio is a Malaysian web design and SEO studio. We build fast,
            search-ready websites for local service businesses — clinics,
            restaurants, consultants, contractors, and retailers — that need a
            website which actually brings in customers, not one that just sits
            there looking nice.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed">
            We&apos;re a two-person, founder-led team, and we keep it that way on
            purpose. When you work with us, you deal directly with the people
            writing your code and shaping your strategy — never an account
            manager passing notes to a team you&apos;ll never meet.
          </p>
        </div>

        {/* What we do */}
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
            What we do
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
            At our core, we do three things well: get your business online
            properly, get it found on Google, and keep it growing month after
            month. Whether you&apos;re starting from nothing or fixing a site that
            never brought in a single lead, we build around one question — will
            this bring you more calls, bookings, and customers? And once
            you&apos;re online and growing, we build the systems to run it day to
            day — customers, invoicing, and inventory, all in one place.
          </p>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
          >
            See how we can help
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* What we believe */}
        <div className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            What we believe
          </h2>
          <ul className={cn(CARD_WHITE, "space-y-4 p-6 md:p-8")}>
            {beliefs.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Who we work with */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
            Who we work with
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            We focus on Malaysian service businesses, because we understand the
            local market, the customers, and how they search. That said, we&apos;re
            open to working with clients further afield when the project is a
            good fit.
          </p>
        </div>

        {/* Founders */}
        <Team />

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-6 pt-4 pb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Let&apos;s see if we&apos;re a fit.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8 max-w-xl">
            Book a free 15-minute discovery call — no pitch, no pressure. Just a
            straight conversation about your business and whether we can help.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>
            <Link
              href="/#faq"
              className="inline-flex min-h-11 items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Got questions first? Read the FAQ →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
