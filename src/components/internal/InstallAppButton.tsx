"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { buttonClass } from "@/components/internal/ui";

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
  if (installed) return <p className="text-sm">Installed on this device.</p>;
  if (!prompt) return <p className="text-sm text-os-muted">In your browser menu, choose &ldquo;Add to Home Screen&rdquo; or &ldquo;Install app&rdquo;.</p>;
  return (
    <button
      type="button"
      onClick={async () => {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === "accepted") setInstalled(true);
        setPrompt(null);
      }}
      className={buttonClass("secondary")}
    >
      <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />Install app
    </button>
  );
}
