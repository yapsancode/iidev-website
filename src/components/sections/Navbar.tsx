"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { BRAND_NAME, CONTACT_EMAIL } from "@/lib/site-config";

const NAV_ITEMS = [
  { label: "WHY US", href: "#why-us" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
] as const;

export const Navbar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileMenuOpen);
    return () => document.body.classList.remove("no-scroll");
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
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 md:animate-[hero-fade-up_0.6s_ease-out_both] motion-reduce:animate-none">
        <Link
          href="/"
          onClick={handleHomeClick}
          className={`group pointer-events-auto flex items-center gap-1 bg-black px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity duration-200 dark:bg-white dark:text-black ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
        >
          <span>IIDev</span>{" "}
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 group-hover:max-w-16 group-hover:opacity-100">
            Studio
          </span>
        </Link>

        <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-neutral-200 bg-[#F0F0F0]/95 p-1.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/95 md:flex">
          {pathname === "/" &&
            NAV_ITEMS.map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.label}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className={`relative rounded-full px-5 py-2 text-[11px] font-bold tracking-widest transition-colors duration-200 ${active ? "bg-white text-black shadow-md" : "text-neutral-500 hover:bg-white/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"}`}
                >
                  {item.label}
                </button>
              );
            })}
          <Link
            href="/about"
            className={`relative rounded-full px-5 py-2 text-[11px] font-bold tracking-widest transition-colors duration-200 ${pathname === "/about" ? "border border-black/5 bg-white text-black shadow-md dark:bg-neutral-800 dark:text-white" : "text-neutral-500 hover:bg-white/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"}`}
          >
            ABOUT
          </Link>
          <div className="mx-1 h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
          <ThemeToggle />
        </div>

        {!mobileMenuOpen && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="pointer-events-auto flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Open menu"
            aria-expanded="false"
          >
            <span className="h-0.5 w-6 rounded-full bg-black dark:bg-white" />
            <span className="h-0.5 w-6 rounded-full bg-black dark:bg-white" />
            <span className="h-0.5 w-4 self-end rounded-full bg-black dark:bg-white" />
          </button>
        )}
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-[menu-fade-in_0.2s_ease-out_both] flex-col overflow-y-auto bg-[#E6E6E6] text-black motion-reduce:animate-none dark:bg-neutral-950 dark:text-white md:hidden">
          <div className="flex items-start justify-between p-6">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="rounded-sm bg-[#EFEEE9] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-sm dark:bg-neutral-800 dark:text-white"
            >
              {BRAND_NAME}
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-[#111] px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] text-white dark:bg-white dark:text-black"
              >
                CLOSE
              </button>
            </div>
          </div>

          <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center gap-5">
            {pathname === "/" &&
              NAV_ITEMS.map((item) => (
                <div key={item.label} className="group relative">
                  <button
                    onClick={(event) => handleNavClick(event, item.href)}
                    className="relative z-10 block w-40 rounded-[2rem] border border-transparent bg-[#F1F0EB] py-4 text-center text-xl font-normal tracking-wide text-black shadow-sm transition-transform duration-200 active:scale-95 group-hover:-translate-y-1"
                  >
                    {item.label}
                  </button>
                  <div className="absolute inset-0 z-0 translate-y-1 rounded-[2rem] bg-[#D6D6D6] transition-transform group-hover:translate-y-2" />
                </div>
              ))}
            <div className="group relative">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="relative z-10 block w-40 rounded-[2rem] border border-transparent bg-[#F1F0EB] py-4 text-center text-xl font-normal tracking-wide text-black shadow-sm transition-transform duration-200 active:scale-95 group-hover:-translate-y-1"
              >
                ABOUT
              </Link>
              <div className="absolute inset-0 z-0 translate-y-1 rounded-[2rem] bg-[#D6D6D6] transition-transform group-hover:translate-y-2" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pb-10 text-[11px] font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-300">
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-[2px] bg-[#EFEEE9] px-2 py-1 text-black">Follow</span>
              <a
                href="https://www.linkedin.com/company/iidevstudio"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-neutral-500"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-[2px] bg-[#EFEEE9] px-2 py-1 text-black">General Enquiries</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm font-normal lowercase tracking-normal text-neutral-600 hover:text-black dark:text-neutral-400"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-4 text-[10px] font-normal normal-case tracking-normal text-neutral-500">
              © {new Date().getFullYear()} {BRAND_NAME}® All Rights Reserved
            </div>
          </div>
        </div>
      )}
    </>
  );
};
