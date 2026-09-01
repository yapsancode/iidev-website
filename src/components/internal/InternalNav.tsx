"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesCombined, House, Settings, Users } from "lucide-react";

const items = [
  { href: "/internal", label: "Home", icon: House },
  { href: "/internal/leads", label: "Leads", icon: Users },
  { href: "/internal/insights", label: "Insights", icon: ChartNoAxesCombined },
  { href: "/internal/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/internal" ? pathname === href : pathname.startsWith(href);
}

export function InternalNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  if (mobile) {
    return (
      <nav aria-label="Internal app navigation" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/95 lg:hidden">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 font-sans text-[10px] font-semibold transition ${active ? "bg-[#fff0ed] text-[#e95f4d] dark:bg-[#47251f]" : "text-neutral-500 dark:text-neutral-400"}`}><Icon className="h-4 w-4" />{label}</Link>;
        })}
      </nav>
    );
  }
  return (
    <nav aria-label="Internal app navigation" className="mt-8 space-y-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-sans text-sm font-semibold transition ${active ? "bg-[#fff0ed] text-[#e95f4d] dark:bg-[#47251f]" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}><Icon className="h-5 w-5" />{label}</Link>;
      })}
    </nav>
  );
}
