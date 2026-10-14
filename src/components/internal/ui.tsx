import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the founder dashboard. The colours come from
 * app/internal/internal.css: one accent for "do this", red for "act now"
 * or "never contact", everything else ink and grey.
 */

type ButtonTone = "primary" | "secondary" | "danger" | "quiet";

const buttonTones: Record<ButtonTone, string> = {
  primary: "bg-os-accent text-os-on-accent hover:bg-os-accent/90",
  secondary: "bg-os-well text-os-ink hover:bg-os-line",
  danger: "bg-os-alert text-os-paper hover:bg-os-alert/90",
  quiet: "text-os-ink underline decoration-os-line underline-offset-4 hover:decoration-os-ink",
};

/** Every tap target is at least 44 px tall. */
export function buttonClass(tone: ButtonTone = "secondary", { full = false, small = false } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 active:translate-y-px",
    small ? "min-h-10 px-3 text-[13px]" : "min-h-11 px-4 text-sm",
    tone === "quiet" && "px-0",
    full && "w-full",
    buttonTones[tone],
  );
}

export const fieldClass =
  "mt-1.5 block w-full min-h-11 border border-os-line bg-os-ground px-3 py-2.5 text-[15px] text-os-ink outline-none transition-colors placeholder:text-os-muted focus:border-os-accent";
export const labelClass = "block text-[13px] text-os-muted";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-[13px] text-os-muted">{eyebrow}</p>}
        <h1 className="mt-1 text-balance font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-[60ch] text-pretty text-[15px] text-os-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** A titled block: heading, a count on the right, then its content on paper. */
export function Section({
  title,
  count,
  hint,
  href,
  linkLabel,
  children,
  className,
}: {
  title: React.ReactNode;
  count?: number;
  hint?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-8", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-base font-medium">
          {title}
          {count !== undefined && <span className="tabular ml-2 text-os-muted">{count}</span>}
        </h2>
        {href && (
          <Link href={href} className="shrink-0 text-[13px] text-os-accent underline-offset-4 hover:underline">
            {linkLabel || "See all"}
          </Link>
        )}
      </div>
      {hint && <p className="mt-0.5 text-[13px] text-os-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-os-paper p-4 sm:p-5", className)}>{children}</div>;
}

/** Rows on one sheet of paper, split by hairlines. Better than a stack of cards for lists. */
export function RowList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("divide-y divide-os-line bg-os-paper", className)}>{children}</ul>;
}

export function LinkRow({
  href,
  title,
  meta,
  detail,
  detailTone = "muted",
  aside,
}: {
  href: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  detail?: React.ReactNode;
  detailTone?: "muted" | "alert" | "accent";
  aside?: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="group flex min-h-14 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-os-ground/60">
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          {meta && <p className="mt-0.5 truncate text-[13px] text-os-muted">{meta}</p>}
          {detail && (
            <p className={cn("mt-1 line-clamp-2 text-[13px]", detailTone === "alert" ? "text-os-alert" : detailTone === "accent" ? "text-os-accent" : "text-os-muted")}>
              {detail}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {aside}
          <ArrowRight className="h-4 w-4 text-os-muted transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
        </div>
      </Link>
    </li>
  );
}

type TagTone = "neutral" | "accent" | "alert" | "solid" | "outline";

const tagTones: Record<TagTone, string> = {
  neutral: "bg-os-well text-os-ink",
  accent: "bg-os-accent-soft text-os-accent",
  alert: "bg-os-alert-soft text-os-alert",
  solid: "bg-os-ink text-os-paper",
  outline: "border border-os-line text-os-muted",
};

export function Tag({ tone = "neutral", children }: { tone?: TagTone; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap px-2 py-0.5 text-xs font-medium", tagTones[tone])}>{children}</span>;
}

/** Label above value. For the few facts worth a glance. */
export function Facts({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs text-os-muted">{item.label}</dt>
          <dd className="mt-0.5 truncate text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A section that starts closed. Plain <details>, so it works without JavaScript. */
export function Disclosure({
  title,
  meta,
  open = false,
  children,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="bg-os-paper">
      <summary className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <span className="font-medium">{title}</span>
        <span className="flex items-center gap-3 text-[13px] text-os-muted">
          {meta}
          <ChevronDown className="os-chevron h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </summary>
      <div className="border-t border-os-line px-4 pb-5 pt-4 sm:px-5">{children}</div>
    </details>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="bg-os-paper px-4 py-5 text-sm text-os-muted">{children}</p>;
}
