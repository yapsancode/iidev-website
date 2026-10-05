"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveCanvasProps {
  className?: string;
}

interface TrailNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Position before the latest physics step, and the blended position that
  // is actually drawn this frame.
  prevX: number;
  prevY: number;
  drawX: number;
  drawY: number;
}

interface Trail {
  spring: number;
  friction: number;
  nodes: TrailNode[];
}

// The trail physics advance 30 times a second on every device, so the wave
// has the same shape and speed everywhere. Drawing happens on every screen
// frame and blends between the last two physics steps, which keeps the motion
// smooth on 60Hz and 144Hz screens alike. Raise SIMULATION_HZ to make the
// trails follow the pointer more tightly.
const SIMULATION_HZ = 30;
const STEP_MS = 1_000 / SIMULATION_HZ;
const MAX_STEPS_PER_FRAME = 4;
const BURST_DECAY_MS = 900;
const SETTLE_EPSILON = 0.01;
const CLEAR_PADDING = 2;
const DESKTOP_TRAILS = 12;
const DESKTOP_NODES = 36;
const MOBILE_TRAILS = 6;
const MOBILE_NODES = 24;

export function WaveCanvas({ className }: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let isIntersecting = true;
    let pageVisible = document.visibilityState === "visible";
    let animationFrameId: number | null = null;
    let activeUntil = 0;
    let lastFrameTime = 0;
    let pendingTime = 0;
    let inMotion = false;
    let dpr = 1;
    let canvasWidth = 0;
    let canvasHeight = 0;
    // Where the canvas sits in the page. Cached so pointer events don't have
    // to measure layout on every mouse move.
    let originX = 0;
    let originY = 0;
    let trails: Trail[] = [];
    const pointer = { x: 0, y: 0 };
    // The area painted by the last frame — the only part that needs clearing.
    const painted = { minX: 0, minY: 0, maxX: 0, maxY: 0, any: false };

    const canAnimate = () =>
      isIntersecting && pageVisible && !reducedMotion.matches;

    const clearCanvas = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      painted.any = false;
    };

    const stopAnimation = (clear = true) => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      activeUntil = 0;
      if (clear) clearCanvas();
    };

    const measureOrigin = () => {
      const bounds = canvas.getBoundingClientRect();
      originX = bounds.left + window.scrollX;
      originY = bounds.top + window.scrollY;
      return bounds;
    };

    const resizeCanvas = () => {
      const bounds = measureOrigin();
      dpr = coarsePointer.matches
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.5);

      canvasWidth = bounds.width;
      canvasHeight = bounds.height;
      canvas.width = Math.max(1, Math.round(canvasWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvasHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      trails = [];
      stopAnimation();
    };

    const createTrails = () => {
      const trailCount = coarsePointer.matches ? MOBILE_TRAILS : DESKTOP_TRAILS;
      const nodeCount = coarsePointer.matches ? MOBILE_NODES : DESKTOP_NODES;

      trails = Array.from({ length: trailCount }, (_, trailIndex) => ({
        spring: 0.42 + (trailIndex / trailCount) * 0.035,
        friction: 0.48 + (trailIndex % 3) * 0.004,
        nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => {
          const x = pointer.x - nodeIndex * (coarsePointer.matches ? 1.2 : 0.8);
          const y = pointer.y + Math.sin(nodeIndex * 0.55 + trailIndex) * 4;
          return { x, y, vx: 0, vy: 0, prevX: x, prevY: y, drawX: x, drawY: y };
        }),
      }));
    };

    // Advances the physics by one step. Returns false once every node has
    // come to rest, so the caller can skip redrawing an unchanged picture.
    const stepTrails = () => {
      let moved = false;

      for (const trail of trails) {
        const nodes = trail.nodes;
        let spring = trail.spring;

        for (let index = 0; index < nodes.length; index += 1) {
          const node = nodes[index];
          const previousNode = index > 0 ? nodes[index - 1] : null;
          const targetX = previousNode ? previousNode.x : pointer.x;
          const targetY = previousNode ? previousNode.y : pointer.y;

          node.prevX = node.x;
          node.prevY = node.y;
          node.vx += (targetX - node.x) * spring;
          node.vy += (targetY - node.y) * spring;
          if (previousNode) {
            node.vx += previousNode.vx * 0.025;
            node.vy += previousNode.vy * 0.025;
          }
          node.vx *= trail.friction;
          node.vy *= trail.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= 0.98;

          if (Math.abs(node.vx) + Math.abs(node.vy) > SETTLE_EPSILON) {
            moved = true;
          }
        }
      }

      return moved;
    };

    // `blend` is how far we are between the previous physics step (0) and the
    // latest one (1).
    const drawTrails = (timestamp: number, blend: number) => {
      context.globalCompositeOperation = "source-over";
      if (painted.any) {
        context.clearRect(
          painted.minX - CLEAR_PADDING,
          painted.minY - CLEAR_PADDING,
          painted.maxX - painted.minX + CLEAR_PADDING * 2,
          painted.maxY - painted.minY + CLEAR_PADDING * 2,
        );
      }

      context.globalCompositeOperation = "lighter";
      context.lineWidth = 1;
      context.strokeStyle = `hsla(${Math.round(285 + Math.sin(timestamp * 0.0015) * 85)}, 100%, 50%, 0.15)`;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const trail of trails) {
        const nodes = trail.nodes;
        const last = nodes.length - 1;

        // Every curve stays inside the box around its nodes.
        for (let index = 0; index <= last; index += 1) {
          const node = nodes[index];
          const x = node.prevX + (node.x - node.prevX) * blend;
          const y = node.prevY + (node.y - node.prevY) * blend;
          node.drawX = x;
          node.drawY = y;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }

        context.beginPath();
        context.moveTo(nodes[0].drawX, nodes[0].drawY);
        for (let index = 1; index < last; index += 1) {
          const node = nodes[index];
          const next = nodes[index + 1];
          context.quadraticCurveTo(
            node.drawX,
            node.drawY,
            (node.drawX + next.drawX) * 0.5,
            (node.drawY + next.drawY) * 0.5,
          );
        }
        context.stroke();
      }

      painted.minX = minX;
      painted.minY = minY;
      painted.maxX = maxX;
      painted.maxY = maxY;
      painted.any = trails.length > 0;
    };

    const renderFrame = (timestamp: number) => {
      animationFrameId = null;
      if (!canAnimate() || timestamp >= activeUntil) {
        stopAnimation();
        return;
      }

      // Turn elapsed time into whole physics steps. A burst starts with one
      // step; a long pause is capped so the wave never fast-forwards.
      pendingTime +=
        lastFrameTime === 0
          ? STEP_MS
          : Math.min(timestamp - lastFrameTime, STEP_MS * MAX_STEPS_PER_FRAME);
      lastFrameTime = timestamp;

      let stepped = false;
      let moved = false;
      while (pendingTime >= STEP_MS) {
        if (stepTrails()) moved = true;
        stepped = true;
        pendingTime -= STEP_MS;
      }
      if (stepped) inMotion = moved;

      // Once every node is at rest the picture no longer changes, so skip
      // the redraw until the pointer moves again.
      if (inMotion) drawTrails(timestamp, pendingTime / STEP_MS);

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    const handlePointer = (event: PointerEvent) => {
      if (!canAnimate()) return;

      let x = event.pageX - originX;
      let y = event.pageY - originY;
      if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) return;

      const idle = animationFrameId === null;
      if (idle) {
        // One layout read when a burst starts, in case the page has shifted.
        measureOrigin();
        x = event.pageX - originX;
        y = event.pageY - originY;
      }

      pointer.x = x;
      pointer.y = y;
      if (trails.length === 0) createTrails();
      activeUntil = performance.now() + BURST_DECAY_MS;

      if (idle) {
        lastFrameTime = 0;
        pendingTime = 0;
        inMotion = false;
        animationFrameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const handleVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (!pageVisible) stopAnimation();
    };

    const handleMotionChange = () => stopAnimation();
    const handlePointerTypeChange = () => resizeCanvas();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (!isIntersecting) stopAnimation();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(canvas);

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionChange);
    coarsePointer.addEventListener("change", handlePointerTypeChange);

    return () => {
      stopAnimation();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionChange);
      coarsePointer.removeEventListener("change", handlePointerTypeChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full bg-transparent",
        className,
      )}
      data-wave-canvas="bounded"
    />
  );
}
