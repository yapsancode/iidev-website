"use client";

import { useTheme } from "@wrksz/themes/client";
import { cn } from "@/lib/utils";

/** Light or dark, as two plain buttons. */
export function ThemeChoice() {
  const { theme, setTheme } = useTheme();
  const current = theme === "dark" ? "dark" : "light";
  return (
    <div role="group" aria-label="Theme" className="inline-flex bg-os-ground p-1">
      {(["light", "dark"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={current === option}
          onClick={() => setTheme(option)}
          className={cn("min-h-10 px-4 text-sm capitalize transition-colors", current === option ? "bg-os-ink text-os-paper" : "text-os-muted hover:text-os-ink")}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
