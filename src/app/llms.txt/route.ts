import {
  CONTACT_EMAIL,
  SITE_URL,
  WHATSAPP_DISPLAY,
  absoluteUrl,
} from "@/lib/site-config";

// Built once at build time, like robots.txt and sitemap.xml.
export const dynamic = "force-static";

const body = `# IIDev Studio

> IIDev Studio is a Malaysian web design and SEO studio. We build fast, search-ready websites for local service businesses — clinics, restaurants, consultants, contractors, and retailers — designed to bring in more calls, bookings, and leads.

IIDev Studio is a two-person, founder-led team based in Malaysia: Isyraf Afifi (Co-Founder & Product) and Imran Ariff (Co-Founder & Tech Lead). Founder-led, no outsourcing — you work directly with the people building your site. We focus on Malaysian service businesses, but are open to international clients when the project is a good fit. Tech stack: Next.js, Tailwind, and TypeScript. All pricing is in Malaysian Ringgit (RM).

## Services
- [Website Audit](${absoluteUrl("/services/website-audit")}): A paid review of your website and Google presence with a prioritised, plain-language fix list. RM 500, credited back in full if you start a project with us within 30 days. The low-commitment way to start.
- [Web Presence](${absoluteUrl("/services/web-presence")}): Get your business online properly — a fast, credible, SEO-ready website you fully own. One-time, RM 1,000–3,000.
- [Search-Ready Website](${absoluteUrl("/services/search-ready")}): A website built to be found on Google — keyword research, on-page SEO, and Google Business Profile setup. One-time, RM 3,000–6,000.
- [Growth Retainer](${absoluteUrl("/services/growth-retainer")}): Ongoing monthly SEO — content, technical fixes, rank tracking, and plain-language reporting. RM 1,000–2,000 per month.
- [Business OS](${absoluteUrl("/services/business-os")}): A custom-built system to run your business — customer and sales tracking, invoicing, inventory, and bookings, all in one place. One-time, from RM 10,000: a core system (RM 6,000) plus the modules you need (from RM 4,000 each). After launch, hosting and upkeep are a separate monthly fee, from RM 200. A MyInvois e-invoicing module is coming soon and not available yet.

## Key pages
- [Home](${SITE_URL}): Overview of what we do and who we help.
- [Services & pricing](${absoluteUrl("/services")}): All packages, by stage of growth.
- [About](${absoluteUrl("/about")}): The studio, the founders, and how we work.
- [FAQ](${absoluteUrl("/#faq")}): Common questions on cost, timelines, ownership, and SEO.

## Contact
- WhatsApp: ${WHATSAPP_DISPLAY}
- Email: ${CONTACT_EMAIL}
- The fastest way to start is a free 15-minute discovery call, booked over WhatsApp.

## Notes
- We build fast, mobile-first, conversion-focused websites. We cannot promise a #1 Google ranking and will not pretend otherwise — we build the strongest possible foundation and are honest about what's realistic.
- We structure sites for GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) so AI tools like ChatGPT, Claude, and Perplexity can understand the business and recommend it by name.
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
