"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Typewriter } from "./Typewriter";

/**
 * Rotating hero headline.
 *
 * - `brandLine` is the single, STABLE <h1> (the accessible name + the text a
 *   crawler reads). It plays the slot-machine reveal once on load.
 * - `phrases` then cycle as a purely decorative (aria-hidden) visual layer.
 * - An invisible spacer reserves the brand line's height so swapping phrases
 *   never shifts the page (protects CLS). Respects prefers-reduced-motion.
 */
interface AnimatedHeadlineProps {
  brandLine: string;
  phrases: string[];
  className?: string;
}

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const getRandomChar = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

const getSequence = (target: string): string[] => {
  const count = 10;
  const isUpper = target === target.toUpperCase();
  const startChar = isUpper ? "A" : "a";

  const sequence = [target];
  for (let i = 0; i < count - 2; i++) {
    sequence.push(getRandomChar());
  }
  sequence.push(startChar);

  return sequence;
};

// Timing for the one-time slot-machine intro.
const BASE_DELAY = 0.1;
const PER_CHAR = 0.05;
const SLOT_DURATION = 1.25;
const PAUSE_AFTER = ",";
const PAUSE_DURATION = 1.5; // mid-sentence pause after the comma (seconds)

// How long the fully-revealed brand line holds before the taglines start (ms).
const INTRO_HOLD_MS = 4000;

const SlotChar = ({
  char,
  index,
  extraDelay = 0,
}: {
  char: string;
  index: number;
  extraDelay?: number;
}) => {
  const sequence = useMemo(() => getSequence(char), [char]);

  if (char === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  const heightInEms = sequence.length - 1;
  const effectiveDelay = BASE_DELAY + index * PER_CHAR + extraDelay;

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom leading-none text-inherit">
      <motion.span
        className="absolute bottom-0 left-0 right-0 flex flex-col text-center"
        initial={{ y: "0em", opacity: 0 }}
        animate={{ y: `${heightInEms}em`, opacity: 1 }}
        transition={{
          y: { duration: SLOT_DURATION, ease: [0.16, 1, 0.3, 1], delay: effectiveDelay },
          opacity: { duration: 0.01, delay: effectiveDelay },
        }}
      >
        {sequence.map((s, i) => (
          <span
            key={i}
            className={`flex h-[1em] items-center justify-center ${i === 0 ? "opacity-100" : "opacity-40"}`}
          >
            {s}
          </span>
        ))}
      </motion.span>
      <span className="invisible">{char}</span>
    </span>
  );
};

/** Per-character slot reveal of a string (inline group — no heading element). */
const SlotReveal = ({ text }: { text: string }) => {
  // Precompute each character's stagger index + comma-pause offset, purely
  // (no mutated counters), so the reveal pacing is stable across re-renders.
  const words = useMemo(() => {
    const wordChars = text.split(" ").map((word) => word.split(""));
    const commaIndex = wordChars.flat().indexOf(PAUSE_AFTER);

    return wordChars.map((chars, wIndex) => {
      const start = wordChars
        .slice(0, wIndex)
        .reduce((sum, w) => sum + w.length, 0);

      return chars.map((char, cIndex) => {
        const index = start + cIndex;
        const extraDelay =
          commaIndex !== -1 && index > commaIndex ? PAUSE_DURATION : 0;
        return { char, index, extraDelay };
      });
    });
  }, [text]);

  return (
    <span className="flex flex-wrap justify-center gap-[0.25em]">
      {words.map((chars, wIndex) => (
        <span key={wIndex} className="inline-flex whitespace-nowrap">
          {chars.map((c, cIndex) => (
            <SlotChar
              key={cIndex}
              char={c.char}
              index={c.index}
              extraDelay={c.extraDelay}
            />
          ))}
        </span>
      ))}
    </span>
  );
};

const introDurationMs = (text: string): number => {
  const letters = text.replace(/\s/g, "").length;
  const hasPause = text.includes(PAUSE_AFTER);
  const lastDelay =
    BASE_DELAY + (letters - 1) * PER_CHAR + (hasPause ? PAUSE_DURATION : 0);
  // Reveal completes (incl. the comma pause), then holds before taglines begin.
  return (lastDelay + SLOT_DURATION) * 1000 + INTRO_HOLD_MS;
};

export default function AnimatedHeadline({
  brandLine,
  phrases,
  className = "",
}: AnimatedHeadlineProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"intro" | "cycling">("intro");

  // Longest line among the brand line + taglines — used to reserve height so the
  // layout never shifts, no matter how short or long brandLine is set.
  const tallest = useMemo(
    () =>
      [brandLine, ...phrases].reduce(
        (longest, line) => (line.length > longest.length ? line : longest),
        brandLine,
      ),
    [brandLine, phrases],
  );

  // Hand off from the one-time slot-machine intro to the typewriter cycle.
  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setTimeout(() => setPhase("cycling"), introDurationMs(brandLine));
    return () => window.clearTimeout(t);
  }, [brandLine, reduceMotion]);

  return (
    <h1 className={cn("relative text-center", className)}>
      {/* The real, stable heading text — what screen readers and crawlers read.
          The rotating taglines below are purely decorative. */}
      <span className="sr-only">{brandLine}</span>

      {/* Invisible spacer sized to the longest line, so the typewriter never
          shifts the page no matter what brandLine you choose. */}
      <span aria-hidden="true" className="invisible">
        {tallest}
      </span>

      {/* Decorative animated layer, centered over the reserved space. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        {reduceMotion ? (
          <span>{brandLine}</span>
        ) : phase === "intro" ? (
          <SlotReveal text={brandLine} />
        ) : (
          <Typewriter
            text={phrases}
            loop
            random
            speed={70}
            deleteSpeed={35}
            delay={4000}
            cursor="|"
            className="block px-2"
          />
        )}
      </span>
    </h1>
  );
}
