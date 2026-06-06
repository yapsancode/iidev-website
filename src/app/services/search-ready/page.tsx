import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";

export const metadata: Metadata = {
  title: "Search-Ready Website — Get Found on Google (RM 3k–6k)",
  description:
    "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so Malaysian customers find you instead of your competitors. From RM 3,000.",
  alternates: { canonical: "/services/search-ready" },
  openGraph: {
    title: "Search-Ready Website | iidev Studio",
    description:
      "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so customers find you first.",
    url: "https://iidevstudio.com/services/search-ready",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const outcomes = [
  "Keyword research into what your actual customers type into Google — not guesswork",
  "Your website built around those searches, so every page has a reason to exist",
  "Google Business Profile set up and optimised so you show up in local map results",
  "On-page SEO done properly from the start — titles, structure, speed, mobile",
  "A site that earns trust from both Google and the humans who land on it",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Search-Ready Website",
      serviceType: "SEO website design and development",
      description:
        "A website built to rank, not just to look good. Keyword research, on-page SEO, and Google Business Profile setup so customers find you first.",
      provider: { "@id": "https://iidevstudio.com/#organization" },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "3000",
        url: "https://iidevstudio.com/services/search-ready",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iidevstudio.com" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://iidevstudio.com/services" },
        { "@type": "ListItem", position: 3, name: "Search-Ready Website", item: "https://iidevstudio.com/services/search-ready" },
      ],
    },
  ],
};

export default function SearchReadyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
          {/* Back */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            All services
          </Link>

          {/* Header */}
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
            One-time · RM 3,000 – 6,000
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Search-Ready <br />Website
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-16 max-w-xl">
            You have a website — or you're building one — but it's not bringing
            in customers. People search for exactly what you sell and find your
            competitors instead. This is the fix: a site built to be found, not
            just built to look good.
          </p>

          {/* Outcomes */}
          <div className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">
              What you get
            </h2>
            <ul className="space-y-4">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right fit */}
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 mb-16">
            <h2 className="font-bold text-neutral-900 dark:text-white mb-2">
              This is the right fit if:
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You're a service business — a clinic, a law firm, a contractor, a
              tuition centre — where customers search before they decide. You
              want to show up when they do, not rely on word-of-mouth alone. You
              understand that a website without visibility is just an expensive
              brochure.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase">
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-400">
              30 minutes. We'll look at your market together and tell you
              exactly what's possible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
