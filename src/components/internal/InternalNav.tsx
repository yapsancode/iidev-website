"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, Inbox, Sun, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/internal", label: "Today", icon: Sun },
  { href: "/internal/prospects", label: "Prospects", icon: Users },
  { href: "/internal/leads", label: "Enquiries", icon: Inbox },
  { href: "/internal/insights", label: "Insights", icon: ChartNoAxesColumn },
];

function isActive(pathname: string, href: string) {
  return href === "/internal" ? pathname === href : pathname.startsWith(href);
}

/** Top links on a computer, a bottom tab bar on a phone. A dot marks new website enquiries. */
export function InternalNav({ mobile = false, enquiries = 0 }: { mobile?: boolean; enquiries?: number }) {
  const pathname = usePathname();
  const badge = (href: string) =>
    href === "/internal/leads" && enquiries > 0 ? (
      <span className="tabular bg-os-alert px-1.5 text-[11px] font-medium leading-[18px] text-os-paper" aria-label={`${enquiries} new`}>
        {enquiries}
      </span>
    ) : null;

  if (mobile) {
    return (
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-os-line bg-os-paper pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="grid grid-cols-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-xs", active ? "text-os-accent" : "text-os-muted")}
              >
                {active && <span aria-hidden className="absolute inset-x-6 top-0 h-0.5 bg-os-accent" />}
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  {href === "/internal/leads" && enquiries > 0 && <span aria-hidden className="absolute -right-1.5 -top-1 h-2 w-2 bg-os-alert" />}
                </span>
                {label}
                {href === "/internal/leads" && enquiries > 0 && <span className="sr-only">, {enquiries} new</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label="Main" className="hidden h-full items-stretch gap-6 lg:flex">
      {items.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 border-b-2 text-sm transition-colors",
              active ? "border-os-accent text-os-ink" : "border-transparent text-os-muted hover:text-os-ink",
            )}
          >
            {label}
            {badge(href)}
          </Link>
        );
      })}
    </nav>
  );
}
