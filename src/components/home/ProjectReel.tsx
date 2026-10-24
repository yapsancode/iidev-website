"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "./sections";

const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * The projects after the stages, as a list (the idea comes from Hover Reel by
 * ham7a311, MIT). Each row is a band: name, what it is, a link. Pointing at a
 * row with a mouse opens a small stage that follows the pointer; moving to the
 * next row rolls the stage on to that project's picture. Keyboard focus parks
 * the stage beside the focused link.
 *
 * Phones and touch screens have no pointer to follow, so each row shows its
 * own small stage instead (home.css decides which one shows).
 */
export function ProjectReel({ projects }: { projects: Project[] }) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  // The stage chases the pointer with an eased step and rests once it arrives.
  useEffect(() => {
    const list = host.current;
    const stage = frame.current;
    if (!list || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const at = { x: 0, y: 0, toX: 0, toY: 0, raf: 0, placed: false };

    const draw = () => {
      stage.style.translate = `${at.x}px ${at.y}px`;
    };
    const step = () => {
      at.raf = 0;
      const ease = reduced ? 1 : 0.16;
      at.x += (at.toX - at.x) * ease;
      at.y += (at.toY - at.y) * ease;
      draw();
      if (Math.abs(at.toX - at.x) + Math.abs(at.toY - at.y) > 0.3) {
        at.raf = requestAnimationFrame(step);
      }
    };
    // Move the stage's left edge to x, centred on y (both in page pixels).
    const aim = (x: number, y: number) => {
      const box = list.getBoundingClientRect();
      at.toX = Math.max(0, x - box.left);
      at.toY = y - box.top - stage.offsetHeight / 2;
      if (!at.placed) {
        at.x = at.toX;
        at.y = at.toY;
        at.placed = true;
        draw();
      }
      if (!at.raf) at.raf = requestAnimationFrame(step);
    };

    // Beside the pointer, never over it, so the words under the pointer stay
    // readable. Near the list's right edge it goes to the left of the pointer.
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const right = event.clientX + 24;
      const fits = right + stage.offsetWidth <= list.getBoundingClientRect().right;
      aim(fits ? right : event.clientX - 24 - stage.offsetWidth, event.clientY);
    };
    const onLeave = () => {
      at.placed = false;
      setOpen(false);
    };
    // Keyboard focus parks the stage just left of the focused link.
    const onFocus = (event: FocusEvent) => {
      const link = event.target as HTMLElement;
      const row = link.closest<HTMLElement>(".reel-row");
      if (!row || !link.matches(":focus-visible")) return;
      const box = row.getBoundingClientRect();
      at.placed = false;
      aim(
        link.getBoundingClientRect().left - 24 - stage.offsetWidth,
        box.top + box.height / 2,
      );
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    list.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(at.raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      list.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <div ref={host} className="reel" data-open={open || undefined}>
      <ul
        className="reel-list"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
        }}
      >
        {projects.map((project, index) => {
          const [main] = project.links;
          return (
            <li
              key={project.title}
              className="reel-row"
              data-on={(open && index === current) || undefined}
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                setCurrent(index);
                setOpen(true);
              }}
              onFocus={() => {
                setCurrent(index);
                setOpen(true);
              }}
            >
              <ReelStage project={project} className="reel-thumb" sizes="40vw" />
              <h2 className="display reel-title" data-reveal style={order(1)}>
                {project.title}
              </h2>
              <div className="reel-body" data-reveal style={order(2)}>
                <p>
                  {project.kind && <strong>{project.kind} </strong>}
                  {project.text}
                </p>
                <p className="project-links">
                  <Link
                    href={main.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link reel-link"
                    aria-label={`${main.label} (opens in a new tab)`}
                  >
                    {main.label}
                  </Link>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div ref={frame} className="reel-frame" aria-hidden="true">
        <div className="reel-strip" style={{ translate: `0 ${-100 * current}%` }}>
          {projects.map((project) => (
            <ReelStage key={project.title} project={project} sizes="420px" decorative />
          ))}
        </div>
      </div>
    </div>
  );
}

/** A small dark stage with the project's pictures standing on it. */
function ReelStage({
  project,
  className = "",
  sizes,
  decorative = false,
}: {
  project: Project;
  className?: string;
  sizes: string;
  decorative?: boolean;
}) {
  const pair = project.shots.some((shot) => shot.kind === "phone");
  return (
    <span className={`reel-stage${pair ? " is-pair" : ""} ${className}`}>
      {project.shots.map((shot) => (
        <span key={shot.src} className={`shot shot-${shot.kind}`}>
          <Image
            src={shot.src}
            width={shot.size[0]}
            height={shot.size[1]}
            sizes={shot.kind === "phone" ? `calc(${sizes} / 5)` : sizes}
            alt={decorative ? "" : shot.alt}
          />
        </span>
      ))}
    </span>
  );
}
