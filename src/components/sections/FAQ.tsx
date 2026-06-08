import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Q&A content. A single source of truth: the visible <details> list and the
 * FAQPage JSON-LD are both generated from this array, so the structured data
 * can never drift from what's on the page (a Google requirement for FAQ rich
 * results / answer-engine eligibility).
 */
const faqs = [
  {
    q: "How much does a website cost in Malaysia?",
    a: "Most of our one-time builds fall between RM 1,000 and RM 6,000, depending on the number of pages and whether you need SEO. Ongoing SEO retainers run RM 1,000–2,000 a month. We agree on a fixed price upfront after a short discovery call — no hourly billing, and no surprise fees later.",
  },
  {
    q: "How long does it take to build a website?",
    a: "A standard five-page business website is usually ready in about two weeks from kickoff. Larger or more SEO-heavy projects take a little longer. We set the timeline together before any work starts, so you're never left guessing.",
  },
  {
    q: "Do I own my website, or is it locked to a platform?",
    a: "You own everything — the domain, the hosting, and the code. We don't build on drag-and-drop platforms that lock you in with monthly fees. If you ever decide to move on or work with someone else, you can take the whole site with you.",
  },
  {
    q: "Will my website show up on Google?",
    a: "We build every site to be found: proper on-page SEO, fast loading, mobile-first design, and Google Business Profile setup. We can't promise a number-one ranking — and you should be cautious of anyone who does — but we give your site the strongest possible foundation to rank for what your customers are actually searching for.",
  },
  {
    q: "What's the difference between a cheap website and an SEO-ready one?",
    a: "A cheap website just exists — it looks fine, but almost nobody finds it. An SEO-ready website is built around the exact terms your customers type into Google, so it brings in calls and bookings. One is a digital business card; the other is a salesperson working for you around the clock.",
  },
  {
    q: "I already have a website but it doesn't bring in customers. Can you help?",
    a: "Yes — that's one of the most common problems we fix. Usually the site looks okay but was never built to be found or to turn visitors into enquiries. We audit what you have and rebuild the parts that matter, instead of starting from scratch when we don't need to.",
  },
  {
    q: "Do you only work with businesses in Malaysia?",
    a: "We focus on Malaysian service businesses — clinics, F&B, consultants, coaches, and retailers — because we understand the local market and customers. We work with clients across Malaysia remotely, handling everything over WhatsApp and calls.",
  },
  {
    q: "What are GEO and AEO, and why do they matter for my business?",
    a: "Search is shifting from Google to AI tools like ChatGPT, Claude, and Perplexity. GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) mean structuring your website so these tools understand your business and recommend it by name when someone asks for help. We build this in from the start, so you're visible both on Google and in the AI tools your customers are starting to use.",
  },
  {
    q: "How do I get started?",
    a: "Message us on WhatsApp at +60 16-709 3543, or book a free 15-minute discovery call. No sales pressure — just a straight conversation about your business and goals. We usually reply within minutes.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FAQ() {
  return (
    <section className="py-24 px-4 md:px-6 bg-[#FAFAFA] dark:bg-neutral-900 overflow-hidden">
      {/* FAQPage structured data — generated from the same array rendered below */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex -rotate-1 items-center gap-2 mb-4 rounded-none border-2 border-black bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
            Questions? Answered.
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-neutral-400">
            The things business owners ask us most — answered straight, no jargon.
          </p>
        </div>

        {/* List — native <details> so every answer is in the HTML, needs no JS,
            and is fully readable by search crawlers and answer engines. */}
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              name="faq"
              className="group rounded-none border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-800 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6 font-bold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                <span className="text-base md:text-lg">{item.q}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 md:px-6">
                <p className="leading-relaxed text-slate-600 dark:text-neutral-300">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
