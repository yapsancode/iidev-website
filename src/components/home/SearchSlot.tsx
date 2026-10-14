"use client";

import { useEffect, useRef, useState } from "react";

/** The form the box belongs to. It sits outside the heading (see HomeHero). */
export const SEARCH_FORM_ID = "hero-search";

// Things people really type: Malay and English mixed, with a place name.
const EXAMPLES = [
  "klinik 24 jam serdang",
  "kedai makan near me",
  "salon rambut bangi",
  "physio near me",
  "tuisyen matematik kajang",
  "bengkel kereta puchong",
] as const;

const TYPE_MS = 70;
const HOLD_MS = 1800;

/**
 * The search box inside the hero sentence. The visitor types what their own
 * customers would search and Google opens in a new tab. Until they type, the
 * box shows example searches being typed out.
 *
 * It works without JavaScript: the input belongs to a plain GET form that
 * points at Google.
 */
export function SearchSlot() {
  const [placeholder, setPlaceholder] = useState<string>(EXAMPLES[0]);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let example = 0;
    let length = EXAMPLES[0].length;
    let timeoutId = 0;

    const step = () => {
      const text = EXAMPLES[example];
      if (paused.current) {
        timeoutId = window.setTimeout(step, 400);
        return;
      }
      if (length < text.length) {
        length += 1;
        setPlaceholder(text.slice(0, length));
        timeoutId = window.setTimeout(step, length === text.length ? HOLD_MS : TYPE_MS);
        return;
      }
      example = (example + 1) % EXAMPLES.length;
      length = 0;
      setPlaceholder("");
      timeoutId = window.setTimeout(step, 300);
    };

    timeoutId = window.setTimeout(step, HOLD_MS + 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <span className="slot" data-ui>
      <span className="slot-inner">
        <input
          form={SEARCH_FORM_ID}
          type="search"
          name="q"
          required
          autoComplete="off"
          enterKeyHint="search"
          placeholder={placeholder}
          aria-label="Type what your customers search on Google"
          onFocus={() => (paused.current = true)}
          onBlur={() => (paused.current = false)}
        />
        <button form={SEARCH_FORM_ID} type="submit" aria-label="Search on Google (opens in a new tab)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
        </button>
      </span>
    </span>
  );
}
