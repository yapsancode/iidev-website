"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Concept } from "@/lib/concepts";

/** The tile shows the first few concepts. All of them are on /concept. */
const SHOWN = 4;

const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The concepts' place in the Work section, beside KerjaKit. They take turns: a
 * phone stands on the stage for a few seconds, then sinks off its bottom edge
 * while the next one rises. A thin line per concept fills while its turn runs.
 * That fill is a CSS animation (home.css), and its end moves the tile on.
 *
 * Pointing at the tile or focusing inside it pauses the turn, and the tile
 * only runs while it is on screen. Choosing a line stops the turns for good.
 * With reduced motion the fill never runs, so the tile never moves on its own.
 */
export function ConceptTile({ concepts: all }: { concepts: Concept[] }) {
  const concepts = all.slice(0, SHOWN);
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [stopped, setStopped] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const tile = ref.current;
    if (!tile) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(tile);
    return () => observer.disconnect();
  }, []);

  const show = (next: number) => {
    if (next === current) return;
    setPrevious(current);
    setCurrent(next);
  };

  const turning = concepts.length > 1 && !stopped;
  const concept = concepts[current];
  const [main] = concept.links;

  return (
    <article
      ref={ref}
      className={`project project-tall project-concepts${turning ? " is-turning" : ""}${
        onScreen ? "" : " is-away"
      }`}
    >
      <div className="project-visual" data-reveal>
        {concepts.map((item, index) => (
          <span
            key={item.name}
            className="shot shot-phone concept-shot"
            data-turn={index === current ? "on" : index === previous ? "out" : "wait"}
            aria-hidden={index !== current || undefined}
          >
            <span className="concept-slide">
              <Image
                src={item.shot}
                width={500}
                height={1000}
                sizes="(max-width: 899px) 46vw, 22vw"
                alt={item.alt}
              />
            </span>
          </span>
        ))}

        <Link
          href={main.href}
          className="concept-hit"
          aria-label={`${main.label}: ${concept.name}`}
        />

        {concepts.length > 1 && (
          <div className="concept-lines" role="group" aria-label="Choose a concept">
            {concepts.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className="concept-line"
                aria-label={item.name}
                aria-pressed={index === current}
                data-done={index < current || undefined}
                onClick={() => {
                  show(index);
                  setStopped(true);
                }}
              >
                <span>
                  <i
                    onAnimationEnd={
                      index === current
                        ? () => show((current + 1) % concepts.length)
                        : undefined
                    }
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="project-text">
        <h2 className="display project-title concept-swap" data-reveal style={order(1)}>
          {concepts.map((item, index) => (
            <span
              key={item.name}
              data-on={index === current || undefined}
              aria-hidden={index !== current || undefined}
            >
              {item.name}
            </span>
          ))}
        </h2>
        <div className="project-body" data-reveal style={order(2)}>
          {/* Announced only once the visitor picks a concept, never while it turns by itself. */}
          <div className="concept-swap" aria-live={stopped ? "polite" : "off"}>
            {concepts.map((item, index) => (
              <p
                key={item.name}
                data-on={index === current || undefined}
                aria-hidden={index !== current || undefined}
              >
                <strong>Concept project. </strong>
                {item.text}
              </p>
            ))}
          </div>
          <p className="project-links">
            <Link href={main.href} className="link">
              See this concept
            </Link>
            <Link href="/concept" className="link">
              See all concepts →
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
