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
}

interface Trail {
  spring: number;
  friction: number;
  nodes: TrailNode[];
}

const FRAME_INTERVAL_MS = 1_000 / 30;
const BURST_DECAY_MS = 900;
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
    let frameTimerId: number | null = null;
    let activeUntil = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let trails: Trail[] = [];
    const pointer = { x: 0, y: 0 };

    const canAnimate = () =>
      isIntersecting && pageVisible && !reducedMotion.matches;

    const clearCanvas = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = coarsePointer.matches
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.5);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const stopAnimation = (clear = true) => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (frameTimerId !== null) {
        window.clearTimeout(frameTimerId);
        frameTimerId = null;
      }
      activeUntil = 0;
      if (clear) clearCanvas();
    };

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = coarsePointer.matches
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
        nodes: Array.from({ length: nodeCount }, (_, nodeIndex) => ({
          x: pointer.x - nodeIndex * (coarsePointer.matches ? 1.2 : 0.8),
          y: pointer.y + Math.sin(nodeIndex * 0.55 + trailIndex) * 4,
          vx: 0,
          vy: 0,
        })),
      }));
    };

    const updateAndDraw = (timestamp: number) => {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.globalCompositeOperation = "lighter";
      context.lineWidth = 1;
      context.strokeStyle = `hsla(${Math.round(285 + Math.sin(timestamp * 0.0015) * 85)}, 100%, 50%, 0.15)`;

      for (const trail of trails) {
        let spring = trail.spring;

        for (let index = 0; index < trail.nodes.length; index += 1) {
          const node = trail.nodes[index];
          const previousNode = index > 0 ? trail.nodes[index - 1] : null;
          const targetX = previousNode?.x ?? pointer.x;
          const targetY = previousNode?.y ?? pointer.y;

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
        }

        const [first, ...remainingNodes] = trail.nodes;
        context.beginPath();
        context.moveTo(first.x, first.y);
        for (let index = 0; index < remainingNodes.length - 1; index += 1) {
          const node = remainingNodes[index];
          const next = remainingNodes[index + 1];
          context.quadraticCurveTo(
            node.x,
            node.y,
            (node.x + next.x) * 0.5,
            (node.y + next.y) * 0.5,
          );
        }
        context.stroke();
      }
    };

    const scheduleFrame = (immediate = false) => {
      if (
        !canAnimate() ||
        animationFrameId !== null ||
        frameTimerId !== null
      ) {
        return;
      }

      const requestFrame = () => {
        frameTimerId = null;
        animationFrameId = window.requestAnimationFrame((timestamp) => {
          animationFrameId = null;
          if (!canAnimate() || timestamp >= activeUntil) {
            stopAnimation();
            return;
          }
          updateAndDraw(timestamp);
          scheduleFrame();
        });
      };

      if (immediate) requestFrame();
      else frameTimerId = window.setTimeout(requestFrame, FRAME_INTERVAL_MS);
    };

    const handlePointer = (event: PointerEvent) => {
      if (!canAnimate()) return;

      const bounds = canvas.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        return;
      }

      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      if (trails.length === 0) createTrails();
      activeUntil = performance.now() + BURST_DECAY_MS;
      scheduleFrame(true);
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
