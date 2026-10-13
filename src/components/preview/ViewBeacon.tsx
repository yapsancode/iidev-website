"use client";

import { useEffect } from "react";

/** Tells the site the page was really looked at: visible for a few seconds, in a real browser. */
export function ViewBeacon({ token, delayMs }: { token: string; delayMs: number }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      fetch(`/api/p/${token}/view`, { method: "POST", keepalive: true }).catch(() => {});
    };
    const schedule = () => {
      clearTimeout(timer);
      if (document.visibilityState === "visible" && !sent) timer = setTimeout(send, delayMs);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [token, delayMs]);
  return null;
}
