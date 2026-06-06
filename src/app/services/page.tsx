import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";
import { ServiceCard } from "@/components/cards/ServiceCard";

export const metadata: Metadata = {
  title: "Services & Pricing — Web Design & SEO for Malaysian Businesses",
  description:
    "Three clear packages for Malaysian businesses: get online (RM 1k–3k), get found on Google (RM 3k–6k), or grow every month with an SEO retainer. Pick your stage.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Pricing | iidev Studio",
    description:
      "Three clear packages for Malaysian businesses: get online, get found on Google, or grow every month with an SEO retainer.",
    url: "https://iidevstudio.com/services",
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
    variant: "gray" as const,
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
    variant: "blue" as const,
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
      item: "https://iidevstudio.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://iidevstudio.com/services",
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
      <main className="grow bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">
          {/* Header */}
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
              What we offer
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-5">
              Three ways <br />we can help.
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-lg">
              Each tier is built for a specific stage of business growth. Pick
              the one that matches where you are right now.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((tier) => (
              <ServiceCard key={tier.title} {...tier} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm">
              Not sure which one fits? Book a free 30-minute call — no pitch,
              just clarity.
            </p>
            <BookingButton className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase whitespace-nowrap">
              Book a Free Call
            </BookingButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
