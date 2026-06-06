import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";

export const metadata: Metadata = {
  title: "Growth Retainer — Monthly SEO That Compounds (RM 1k–2k/mo)",
  description:
    "Ongoing SEO for Malaysian businesses ready to grow consistently. Monthly content, technical fixes, rank tracking, and a plain-language report — with direct access to the person doing the work. From RM 1,000/month.",
  alternates: { canonical: "/services/growth-retainer" },
  openGraph: {
    title: "Growth Retainer | iidev Studio",
    description:
      "Ongoing SEO for Malaysian businesses ready to grow consistently. Monthly content, technical fixes, rank tracking, and clear reporting.",
    url: "https://iidevstudio.com/services/growth-retainer",
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
      provider: { "@id": "https://iidevstudio.com/#organization" },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "1000",
        url: "https://iidevstudio.com/services/growth-retainer",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iidevstudio.com" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://iidevstudio.com/services" },
        { "@type": "ListItem", position: 3, name: "Growth Retainer", item: "https://iidevstudio.com/services/growth-retainer" },
      ],
    },
  ],
};

export default function GrowthRetainerPage() {
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
            Monthly · RM 1,000 – 2,000 / month
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Growth Retainer
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-16 max-w-xl">
            You're already online and getting some traction. Now you want to
            compound it. SEO isn't a one-time setup — it's a direction you
            commit to. This retainer means someone is actively working on your
            growth every month, not just once and forgetting you exist.
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
              You have a working website and you understand that growth online is
              a process, not a project. You're ready to invest consistently
              instead of hoping a one-time fix will carry you forever. You want
              to see your rankings move, your traffic grow, and know exactly
              why.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase">
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-400">
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
