"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import {
  INITIAL_HEADLINE_STATE,
  advanceHeadlineState,
  getHeadlineDelay,
  getHeadlineText,
  type HeadlineState,
} from "./hero-headline-sequence";

interface AnimatedHeadlineProps {
  brandLine: string;
  phrases: readonly string[];
  className?: string;
}

const SLOT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SLOT_GLYPHS = 5;

function getSlotSequence(character: string, index: number): string[] {
  const seed = character.charCodeAt(0) + index * 17;
  return [
    ...Array.from({ length: SLOT_GLYPHS }, (_, step) =>
      SLOT_ALPHABET[(seed + step * 11) % SLOT_ALPHABET.length],
    ),
    character,
  ];
}

function SlotReveal({ text }: { text: string }) {
  let characterIndex = 0;

  return (
    <span className="flex w-full flex-wrap justify-center gap-x-[0.25em]">
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-flex whitespace-nowrap">
          {word.split("").map((character) => {
            const index = characterIndex++;
            const sequence = getSlotSequence(character, index);
            const style = {
              animationDelay: `${Math.min(index * 18, 900)}ms`,
            } satisfies CSSProperties;

            return (
              <span
                key={`${character}-${index}`}
                className="relative inline-block h-[1em] overflow-hidden align-bottom leading-none"
              >
                <span className="hero-slot-track absolute inset-x-0 top-0 flex flex-col" style={style}>
                  {sequence.map((glyph, glyphIndex) => (
                    <span
                      key={`${glyph}-${glyphIndex}`}
                      className="flex h-[1em] items-center justify-center"
                    >
                      {glyph}
                    </span>
                  ))}
                </span>
                <span className="invisible">{character}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export default function AnimatedHeadline({
  brandLine,
  phrases,
  className,
}: AnimatedHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<HeadlineState>(INITIAL_HEADLINE_STATE);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const mounted = useMounted();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const tallestLine = useMemo(
    () =>
      [brandLine, ...phrases].reduce((longest, line) =>
        line.length > longest.length ? line : longest,
      ),
    [brandLine, phrases],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () =>
      setPageVisible(document.visibilityState === "visible");

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Server HTML and the first paint show the plain brand line; the slot reveal
  // only starts once the client has hydrated.
  const animationActive =
    mounted && isIntersecting && pageVisible && !reduceMotion;

  useEffect(() => {
    if (!animationActive) return;

    const delay = getHeadlineDelay(state);
    if (delay === null) return;

    const timeoutId = window.setTimeout(
      () => setState((current) => advanceHeadlineState(current, phrases)),
      delay,
    );

    return () => window.clearTimeout(timeoutId);
  }, [animationActive, phrases, state]);

  const visibleText = getHeadlineText(state, brandLine, phrases);
  const showSlotReveal = animationActive && state.phase === "slot";
  const showBrandReturn = animationActive && state.phase === "brand-return";

  return (
    <div ref={containerRef} className={cn("relative text-center", className)}>
      {/* The real heading: brand line only, so crawlers never see animation markup. */}
      <h1 className="sr-only">{brandLine}</h1>
      <div aria-hidden="true">
        <span className="invisible">{tallestLine}</span>
        <span
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          data-headline-phase={reduceMotion ? "reduced-motion" : state.phase}
        >
          {showSlotReveal ? (
            <SlotReveal text={brandLine} />
          ) : showBrandReturn ? (
            <span key="brand-return" className="hero-brand-return">
              {brandLine}
            </span>
          ) : (
            visibleText
          )}
        </span>
      </div>
    </div>
  );
}
