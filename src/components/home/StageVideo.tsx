"use client";

import { useEffect, useRef } from "react";

/**
 * A short, silent recording of the real page scrolling, laid over its
 * screenshot. The file is fetched only when the stage comes on screen and the
 * recording pauses when it leaves. With reduced motion, data saving or no
 * JavaScript, the screenshot underneath is all there is.
 */
export function StageVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        if (!video.getAttribute("src")) video.src = src;
        video.play().catch(() => {});
      },
      { threshold: 0.1 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className="shot-video"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={(event) => {
        event.currentTarget.dataset.on = "";
      }}
    />
  );
}
