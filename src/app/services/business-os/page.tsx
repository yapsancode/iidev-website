import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Receipt,
  ShieldCheck,
  Boxes,
  CalendarCheck,
  LayoutDashboard,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingButton } from "@/components/modal/BookingButton";
import { PriceReveal } from "@/components/ui/PriceReveal";

export const metadata: Metadata = {
  title: "Business OS — A Custom System to Run Your Business (RM 10k onwards)",
  description:
    "A custom-built system scoped to your exact business — customer and sales tracking, invoicing, inventory, and MyInvois e-invoice compliance, all in one place. Built local, launched fast. From RM 10,000.",
  alternates: { canonical: "/services/business-os" },
  openGraph: {
    title: "Business OS | iidev Studio",
    description:
      "A custom system built around how your business actually works — customers, invoicing, inventory, and MyInvois compliance, all in one place.",
    url: "https://iidevstudio.com/services/business-os",
    type: "website",
    images: ["/opengraph-image"],
  },
};

const modules = [
  {
    icon: Users,
    title: "Customer & Sales (CRM)",
    desc: "Every customer, lead, and deal in one place — so nothing falls through the cracks.",
    tag: undefined as string | undefined,
  },
  {
    icon: Receipt,
    title: "Invoicing & Quotations",
    desc: "Send professional invoices and quotes in seconds. See what's paid, what's overdue.",
    tag: "Popular first step",
  },
  {
    icon: ShieldCheck,
    title: "MyInvois e-Invoicing",
    desc: "LHDN-compliant e-invoices built in — ready for Malaysia's rollout from day one.",
    tag: "Popular first step",
  },
  {
    icon: Boxes,
    title: "Inventory & Stock",
    desc: "Real-time stock levels and low-stock alerts. No more guessing what's on the shelf.",
    tag: undefined,
  },
  {
    icon: CalendarCheck,
    title: "Bookings & Appointments",
    desc: "Let customers book online and keep your schedule organised automatically.",
    tag: undefined,
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & Reports",
    desc: "See how the business is doing at a glance — sales, cash flow, what needs attention.",
    tag: undefined,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Business OS",
      serviceType: "Custom business management system",
      description:
        "A custom system built around how your business actually works — customer and sales tracking, invoicing, inventory, and MyInvois e-invoice compliance, all in one place.",
      provider: { "@id": "https://iidevstudio.com/#organization" },
      areaServed: { "@type": "Country", name: "Malaysia" },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: "10000",
        url: "https://iidevstudio.com/services/business-os",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Business OS modules",
        itemListElement: modules.map((m) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: m.title,
            description: m.desc,
          },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iidevstudio.com" },
        { "@type": "ListItem", position: 2, name: "Services", item: "https://iidevstudio.com/services" },
        { "@type": "ListItem", position: 3, name: "Business OS", item: "https://iidevstudio.com/services/business-os" },
      ],
    },
  ],
};

export default function BusinessOSPage() {
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
          <PriceReveal className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
            One-time · RM 10,000 onwards
          </PriceReveal>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Business OS
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed mb-16 max-w-xl">
            You're running your business on spreadsheets, WhatsApp, and gut feel
            — and it's starting to cost you. Customers slip through the cracks.
            Stock goes missing. Invoices pile up. This is the fix: a system built
            around how your business actually works, not a generic tool you have
            to work around.
          </p>

          {/* Modules */}
          <div className="mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-3">
              What we can build
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Business OS isn't one fixed product — it's a set of modules we
              build around your business. Most clients start with the one or two
              that hurt most, then add the rest as they grow. You only pay for
              what you'll actually use.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {modules.map(({ icon: Icon, title, desc, tag }) => (
                <div
                  key={title}
                  className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/50 p-5"
                >
                  {tag && (
                    <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                      {tag}
                    </span>
                  )}
                  <Icon className="h-5 w-5 text-indigo-500 mb-3" />
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-400 mt-6">
              We'd rather get one module genuinely right than rush all of them.
              Start where it hurts most — add the rest when you're ready.
            </p>
          </div>

          {/* Right fit */}
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 mb-16">
            <h2 className="font-bold text-neutral-900 dark:text-white mb-2">
              This is the right fit if:
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              You're an SME owner still stitching things together with Excel and
              WhatsApp. You know you need a proper system but don't want to pay
              for SAP or spend six months configuring Odoo. You want something
              that works the way your business works — built local, launched
              fast, and supported by someone you can actually call.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookingButton service="Business OS" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase">
              Book a Free Call
            </BookingButton>
            <p className="text-sm text-neutral-400">
              We'll map out how your business runs today and scope a system that
              fits it — no jargon, no six-month rollout.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
