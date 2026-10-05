"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PENDING_STAMPS =
  ':is(.stamp, .uncover, .type-in, .nudge):not([data-stamp="in"]):not([data-stamp="done"])';

/**
 * Makes every label with the `stamp` class land with a small bounce the first
 * time it scrolls into view (the motion itself is in globals.css). The same
 * signal slides the block off words marked `uncover`, types out text marked
 * `type-in`, and presses a button marked `nudge`.
 *
 * A label that is already on screen when the page opens is marked "done" and
 * left alone. Only labels still off screen are hidden ("armed"), so nothing
 * the visitor can see is ever hidden and replayed — and without JavaScript
 * every label simply stays visible.
 */
export function StampObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const labels = document.querySelectorAll<HTMLElement>(PENDING_STAMPS);
    if (labels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const label = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            label.dataset.stamp =
              label.dataset.stamp === "armed" ? "in" : "done";
            observer.unobserve(label);
          } else {
            label.dataset.stamp = "armed";
          }
        }
      },
      // Wait until the label is fully on screen and a little above the bottom.
      { rootMargin: "0px 0px -12% 0px", threshold: 1 },
    );

    labels.forEach((label) => observer.observe(label));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
