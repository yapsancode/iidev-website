"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  FINAL_STORY_STATE,
  INITIAL_STORY_STATE,
  advanceStoryState,
  getStoryDelay,
  getStoryText,
  type StoryState,
} from "./search-story-sequence";

// What a Malaysian customer might really type. One is played per visit to the
// card, in this order.
const QUERIES = [
  "klinik gigi shah alam",
  "kedai kek near me",
  "servis aircond puchong",
] as const;

interface SearchStoryProps {
  className?: string;
}

/**
 * A small picture of what the site is for: someone searches, finds the
 * business, and sends an enquiry. It plays once each time it scrolls into
 * view, then rests on the finished picture.
 *
 * - Decorative only (aria-hidden). It shows one result and no position number,
 *   so it never suggests a ranking.
 * - The server renders the finished picture; hidden steps keep their space, so
 *   nothing shifts while it plays.
 * - Stays on the finished picture under prefers-reduced-motion.
 */
export function SearchStory({ className }: SearchStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plays, setPlays] = useState(0);
  const [state, setState] = useState<StoryState>(FINAL_STORY_STATE);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const query = QUERIES[Math.max(plays - 1, 0) % QUERIES.length];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setPlays((count) => count + 1);
          setState(INITIAL_STORY_STATE);
        }
      },
      { threshold: 0.8 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const animationActive = isIntersecting && !reduceMotion;

  useEffect(() => {
    if (!animationActive) return;

    const delay = getStoryDelay(state, query);
    if (delay === null) return;

    const timeoutId = window.setTimeout(
      () => setState((current) => advanceStoryState(current, query)),
      delay,
    );

    return () => window.clearTimeout(timeoutId);
  }, [animationActive, query, state]);

  const shown = reduceMotion ? FINAL_STORY_STATE : state;
  const found = shown.phase !== "typing";
  const enquired = shown.phase === "enquiry";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("select-none text-black", className)}
      data-story-phase={shown.phase}
    >
      <div className="flex h-10 items-center gap-2 border-2 border-black bg-white px-3 dark:border-white">
        <Search size={16} strokeWidth={2.5} className="shrink-0" />
        <span className="truncate text-sm font-medium">
          {getStoryText(shown, query)}
        </span>
        {!found && <span className="story-caret -ml-1 h-4 w-0.5 bg-black" />}
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between gap-3 border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
          found ? "story-found" : "invisible",
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">Your business</p>
          <p className="mt-1 truncate text-xs text-slate-600">
            Call · WhatsApp
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 -rotate-2 items-center gap-1.5 border-2 border-black bg-emerald-300 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest",
            enquired ? "story-enquiry" : "invisible",
          )}
        >
          <WhatsAppIcon size={12} />
          New enquiry
        </span>
      </div>
    </div>
  );
}
