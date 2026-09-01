"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallAppButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches);
  useEffect(() => {
    const handler = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (installed) return <p className="font-sans text-xs text-emerald-700 dark:text-emerald-300">Installed on this device.</p>;
  return <button type="button" disabled={!prompt} onClick={async () => { if (!prompt) return; await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") setInstalled(true); setPrompt(null); }} className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 font-sans text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-950"><Download className="h-4 w-4" />{prompt ? "Install app" : "Use browser menu to install"}</button>;
}
