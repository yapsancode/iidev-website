"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClass } from "@/components/internal/ui";

export function CopyButton({
  text,
  label = "Copy",
  tone = "secondary",
  full = false,
}: {
  text: string;
  label?: string;
  tone?: "primary" | "secondary";
  full?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className={buttonClass(tone, { small: true, full })}
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden /> : <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** A Claude Code command, shown as code with a copy button. */
export function CommandCopy({ command }: { command: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-os-ground px-3 py-2">
      <code className="min-w-0 break-all text-[13px] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">{command}</code>
      <CopyButton text={command} label="Copy" />
    </div>
  );
}
