"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const EMERALD = "#10b981";
const DEFAULT_COLOR = "#a3a3a3"; // neutral-400 — the resting eyebrow colour
const GLOW =
  "0 0 14px rgba(16,185,129,0.85), 0 0 28px rgba(16,185,129,0.45)";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";
const REVEAL_MS = 1500; // how long the scramble takes to fully resolve
const FRAME_MS = 45; // glitch refresh rate

const randomChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

interface PriceRevealProps {
  children: string;
  className?: string;
}

/**
 * Glitch-scrambles the price in on entry: characters flicker through random
 * glyphs in glowing emerald, lock in left-to-right, then the whole line settles
 * to the default muted colour.
 *
 * - An invisible sizer reserves the final width, so scrambling never shifts layout.
 * - The animated text is aria-hidden; the real price is exposed via an sr-only node.
 * - Falls back to static text under prefers-reduced-motion.
 */
export function PriceReveal({ children, className }: PriceRevealProps) {
  const reduceMotion = useReducedMotion();
  const text = String(children).trim();
  const [display, setDisplay] = useState(text);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      setResolved(true);
      return;
    }

    setResolved(false);
    const start = performance.now();

    const id = window.setInterval(() => {
      const progress = Math.min((performance.now() - start) / REVEAL_MS, 1);
      const locked = Math.floor(progress * text.length);

      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " ") out += " ";
        else if (i < locked) out += c;
        else out += randomChar();
      }
      setDisplay(out);

      if (progress >= 1) {
        window.clearInterval(id);
        setDisplay(text);
        setResolved(true);
      }
    }, FRAME_MS);

    return () => window.clearInterval(id);
  }, [text, reduceMotion]);

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="relative inline-block">
        {/* invisible sizer locks the width so glitching never shifts layout */}
        <span className="invisible">{text}</span>
        {/* glitching overlay */}
        <span
          className="absolute left-0 top-0"
          style={{
            color: resolved ? DEFAULT_COLOR : EMERALD,
            textShadow: resolved ? "none" : GLOW,
            transition: "color 1s ease, text-shadow 1s ease",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "pre",
          }}
        >
          {display}
        </span>
      </span>
    </p>
  );
}
