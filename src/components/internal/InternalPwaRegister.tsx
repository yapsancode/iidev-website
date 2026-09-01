"use client";

import { useEffect } from "react";

export function InternalPwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.isSecureContext) {
      navigator.serviceWorker.register("/internal-sw.js", { scope: "/internal" }).catch(() => undefined);
    }
  }, []);
  return null;
}
