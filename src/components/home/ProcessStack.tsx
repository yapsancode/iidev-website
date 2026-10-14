"use client";

import { useEffect } from "react";

/**
 * The process steps stack as you scroll: each panel sticks near the top and
 * the next one slides over it (that part is plain CSS). This adds the last
 * touch: while a panel is being covered it shrinks and dims a little. It sets
 * one number, `--p` from 0 to 1, on each panel and home.css does the rest.
 * With reduced motion or no JavaScript the panels still stack, at full size.
 */
export function ProcessStack() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const list = document.querySelector<HTMLElement>(".home .process");
    if (!list) return;
    const panels = Array.from(list.children) as HTMLElement[];
    if (panels.length < 2) return;

    let queued = false;
    const update = () => {
      queued = false;
      panels.forEach((panel, index) => {
        const next = panels[index + 1];
        if (!next) return;
        const top = parseFloat(getComputedStyle(panel).top) || 0;
        const nextTop = parseFloat(getComputedStyle(next).top) || 0;
        const start = top + panel.offsetHeight; // the next panel touches this one
        const y = next.getBoundingClientRect().top;
        const covered = Math.min(1, Math.max(0, (start - y) / (start - nextTop)));
        panel.style.setProperty("--p", covered.toFixed(3));
      });
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    // Listen only while the steps are near the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          update();
        } else {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      panels.forEach((panel) => panel.style.removeProperty("--p"));
    };
  }, []);

  return null;
}
