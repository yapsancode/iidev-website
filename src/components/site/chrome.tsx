import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import "./site.css";
import { BookingButton } from "@/components/modal/BookingButton";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/site-config";
import { SiteMotion } from "./SiteMotion";

/** Order within a group of parts that arrive together (see site.css). */
export const order = (i: number) => ({ "--i": i }) as CSSProperties;

/* ------------------------------------------------------------------ Top bar */

const BAR_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Prices", href: "/#prices" },
  { label: "Questions", href: "/#faq" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
] as const;

type CurrentPage = "/services" | "/about";

export function SkipLink() {
  return (
    <a href="#main" className="skip">
      Skip to content
    </a>
  );
}

export function SiteBar({ current }: { current?: CurrentPage }) {
  return (
    <nav aria-label="Main" className="wrap bar">
      <Link href="/" className="bar-name">
        {BRAND_NAME}
      </Link>
      <div className="bar-links">
        {BAR_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === current ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <BookingButton className="btn">Book a free call</BookingButton>
    </nav>
  );
}

/* ------------------------------------------------------------------- Footer */

/**
 * `children` is the page's own closing invitation (a heading, a line, the
 * button). Pages with nothing to invite to leave it out.
 */
export function SiteFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="foot on-dark">
      <div className={`wrap cols foot-top${children ? "" : " is-bare"}`}>
        {children && <div className="foot-invite">{children}</div>}
        <div className="foot-links" data-reveal style={order(2)}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <a
            href="https://www.linkedin.com/company/iidevstudio"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>

      <div className="wrap foot-legal">
        <span>
          © {new Date().getFullYear()} {BRAND_NAME}. IIDEV STUDIO, SSM Reg.
          202603215168 (CA0426006-D)
        </span>
        <span>Serving service businesses across Malaysia</span>
      </div>
      <div className="display foot-name" aria-hidden="true">
        {BRAND_NAME}
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------- Whole page */

interface SitePageProps {
  /** Marks this page in the top bar. */
  current?: CurrentPage;
  /** The closing invitation, shown at the top of the footer. */
  invite?: ReactNode;
  /** Structured data for search engines. */
  jsonLd?: object;
  children: ReactNode;
}

/** Every public page except the home page: top bar, content, footer. */
export function SitePage({ current, invite, jsonLd, children }: SitePageProps) {
  return (
    <div className="site page">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SkipLink />
      <SiteBar current={current} />
      <main id="main">{children}</main>
      <SiteFooter>{invite}</SiteFooter>
      <SiteMotion />
    </div>
  );
}
