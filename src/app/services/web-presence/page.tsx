import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";

export const metadata: Metadata = {
  title: "Web Presence — Get Your Business Online Properly (RM 1k–3k)",
  description:
    "A fast, credible website for Malaysian businesses getting online for the first time. Mobile-optimised, SEO-ready, and fully owned by you — no builder lock-in. From RM 1,000.",
  alternates: { canonical: "/services/web-presence" },
  openGraph: {
    title: "Web Presence | iidev Studio",
    description:
      "A fast, credible website for Malaysian businesses getting online for the first time. Mobile-optimised, SEO-ready, fully owned by you.",
    url: "https://iidevstudio.com/services/web-presence",
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
      provider: { "@id": "https://iidevstudio.com/#organization" },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "1000",
        url: "https://iidevstudio.com/services/web-presence",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iidevstudio.com" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://iidevstudio.com/services" },
        { "@type": "ListItem", position: 3, name: "Web Presence", item: "https://iidevstudio.com/services/web-presence" },
      ],
    },
  ],
};

export default function WebPresencePage() {
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
            One-time · RM 1,000 – 3,000
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Web Presence
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-16 max-w-xl">
            You don't have a website yet — or the one you have makes you look
            like you closed two years ago. This gets you online properly, so
            customers stop second-guessing whether your business is real.
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
              You're a new business, a clinic, a restaurant, or a service
              provider who needs a professional online home — something you can
              confidently send customers to. You're not chasing page-one Google
              rankings yet. You just need to exist online, properly.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Web Presence" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase">
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-400">
              30 minutes. No pitch. Just clarity on whether this is the right
              move for you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
