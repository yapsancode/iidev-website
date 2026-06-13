import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Team from "@/components/sections/Team";
import { BookingButton } from "@/components/modal/BookingButton";

export const metadata: Metadata = {
  title: "About — A Founder-Led Web & SEO Studio in Malaysia",
  description:
    "iidev Studio is a two-person, founder-led web design and SEO studio in Malaysia. We build fast, search-ready websites that bring local service businesses more calls and bookings.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About iidev Studio",
    description:
      "A two-person, founder-led web design and SEO studio in Malaysia. We build fast, search-ready websites that bring local service businesses more calls and bookings.",
    url: "https://iidevstudio.com/about",
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
      "@id": "https://iidevstudio.com/about#webpage",
      url: "https://iidevstudio.com/about",
      name: "About iidev Studio",
      description:
        "iidev Studio is a two-person, founder-led web design and SEO studio in Malaysia, building fast, search-ready websites for local service businesses.",
      about: { "@id": "https://iidevstudio.com/#organization" },
      isPartOf: { "@id": "https://iidevstudio.com/#organization" },
    },
    {
      "@type": "Person",
      "@id": "https://iidevstudio.com/#isyraf-afifi",
      name: "Isyraf Afifi",
      jobTitle: "Co-Founder & Product",
      worksFor: { "@id": "https://iidevstudio.com/#organization" },
    },
    {
      "@type": "Person",
      "@id": "https://iidevstudio.com/#imran-ariff",
      name: "Imran Ariff",
      jobTitle: "Co-Founder & Tech Lead",
      worksFor: { "@id": "https://iidevstudio.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iidevstudio.com" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://iidevstudio.com/about" },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        {/* Intro */}
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
            About us
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
            About iidev Studio
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed mb-6">
            iidev Studio is a Malaysian web design and SEO studio. We build fast,
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
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
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
          <ul className="space-y-4">
            {beliefs.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
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
        <div className="max-w-3xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
            Let&apos;s see if we&apos;re a fit.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8 max-w-xl">
            Book a free 15-minute discovery call — no pitch, no pressure. Just a
            straight conversation about your business and whether we can help.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase">
              Book a Free Call
            </BookingButton>
            <Link
              href="/#faq"
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
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
