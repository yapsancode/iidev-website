"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lets the parts of each section arrive once as they scroll into view (the
 * motion itself is in site.css). Same approach as StampObserver: a part that
 * is already on screen when the page opens is left alone, and only parts still
 * below the screen are hidden ("armed"). Without JavaScript nothing is hidden.
 */
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const parts = document.querySelectorAll<HTMLElement>(
      '.site [data-reveal]:not([data-reveal="in"])',
    );
    if (parts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const part = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            part.dataset.reveal = "in";
            observer.unobserve(part);
          } else if (part.dataset.reveal !== "in" && entry.boundingClientRect.top > 0) {
            part.dataset.reveal = "armed";
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    parts.forEach((part) => observer.observe(part));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
