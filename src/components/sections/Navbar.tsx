"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { BookingButton } from "@/components/modal/BookingButton";
import { ThemeToggle } from "../ui/ThemeToggle";
import { BRAND_NAME, CONTACT_EMAIL } from "@/lib/site-config";
import { LABEL, PRIMARY_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

// Sections of the home page (only shown there).
const NAV_ITEMS = [
  { label: "WHY US", href: "#why-us" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
] as const;

// Pages (shown everywhere).
const PAGE_LINKS = [
  { label: "SERVICES", href: "/services" },
  { label: "ABOUT", href: "/about" },
] as const;

const BAR_ITEM =
  "inline-flex h-9 items-center px-4 text-[11px] font-bold tracking-widest transition-colors duration-200";
const BAR_IDLE =
  "text-neutral-700 hover:bg-neutral-100 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white";
const BAR_ACTIVE = "bg-black text-white dark:bg-white dark:text-black";
const MENU_ITEM =
  "block w-56 border-2 border-black bg-white py-4 text-center text-lg font-bold uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-[transform,box-shadow] duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-800 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]";
// Compact version of the main button for the navbar.
const NAV_CTA = cn(
  PRIMARY_BUTTON,
  "h-11 px-3 py-0 text-[11px] tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]",
);

export const Navbar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileMenuOpen);
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting);
        if (current) setActiveSection(current.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    ["home", ...NAV_ITEMS.map((item) => item.href.slice(1))].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isPageActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleNavClick = (event: MouseEvent, href: string) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border-2 focus:border-black focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-black"
      >
        Skip to content
      </a>

      {/* Phones get a solid bar so the logo and menu never sit on top of content. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-neutral-200 bg-[#FAFAFA] px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 md:pointer-events-none md:border-b-0 md:bg-transparent md:px-12 md:py-6 md:animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none dark:md:bg-transparent"
      >
        <Link
          href="/"
          onClick={handleHomeClick}
          className="group pointer-events-auto flex items-center gap-1 bg-black px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white dark:bg-white dark:text-black"
        >
          <span>IIDev</span>{" "}
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-16 group-hover:opacity-100">
            Studio
          </span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          <div className="hidden items-center gap-1 border-2 border-black bg-white p-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] md:flex">
            {pathname === "/" &&
              NAV_ITEMS.map((item) => {
                const active = activeSection === item.href.slice(1);
                return (
                  <button
                    key={item.label}
                    onClick={(event) => handleNavClick(event, item.href)}
                    className={`${BAR_ITEM} ${active ? BAR_ACTIVE : BAR_IDLE}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            {PAGE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isPageActive(item.href) ? "page" : undefined}
                className={`${BAR_ITEM} ${isPageActive(item.href) ? BAR_ACTIVE : BAR_IDLE}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mx-1 h-5 w-0.5 bg-black dark:bg-white" />
            <ThemeToggle />
          </div>

          {/* Always one tap away: phones and wide screens (tablets use the hero button). */}
          <BookingButton
            className={cn(NAV_CTA, "md:hidden lg:inline-flex lg:px-5 lg:tracking-widest")}
          >
            Book a Free Call
          </BookingButton>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {/* The bars share one 24px box, so the short bar lines up with the others. */}
            <span className="flex w-6 flex-col items-end gap-1.5">
              <span className="h-0.5 w-6 rounded-full bg-black dark:bg-white" />
              <span className="h-0.5 w-6 rounded-full bg-black dark:bg-white" />
              <span className="h-0.5 w-4 rounded-full bg-black dark:bg-white" />
            </span>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex animate-[menu-fade-in_0.2s_ease-out_both] flex-col overflow-y-auto bg-[#FAFAFA] text-black motion-reduce:animate-none dark:bg-neutral-900 dark:text-white md:hidden"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="bg-black px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-white dark:bg-white dark:text-black"
            >
              {BRAND_NAME}
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                autoFocus
                onClick={() => setMobileMenuOpen(false)}
                className="h-11 border-2 border-black bg-white px-5 text-xs font-bold tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-800 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
              >
                CLOSE
              </button>
            </div>
          </div>

          {/* No fixed min-height: it let this block shrink smaller than its buttons, so they covered the rows above and below on short screens. */}
          <div className="flex flex-1 flex-col items-center justify-center gap-5 py-4">
            {pathname === "/" &&
              NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={MENU_ITEM}
                >
                  {item.label}
                </button>
              ))}
            {PAGE_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isPageActive(item.href) ? "page" : undefined}
                className={MENU_ITEM}
              >
                {item.label}
              </Link>
            ))}
            <BookingButton
              className={cn(PRIMARY_BUTTON, "mt-3 w-56 px-4 py-4")}
            >
              Book a Free Call
            </BookingButton>
          </div>

          <div className="flex flex-col items-center gap-6 pt-6 pb-10 text-neutral-800 dark:text-neutral-300">
            <div className="flex flex-col items-center gap-1">
              <span className={cn(LABEL, "text-neutral-600 dark:text-neutral-400")}>Follow</span>
              <a
                href="https://www.linkedin.com/company/iidevstudio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className={cn(LABEL, "text-neutral-600 dark:text-neutral-400")}>General Enquiries</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-11 items-center text-sm font-bold underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} {BRAND_NAME}® All Rights Reserved
            </div>
          </div>
        </div>
      )}
    </>
  );
};
