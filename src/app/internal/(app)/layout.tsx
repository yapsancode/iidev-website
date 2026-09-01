import { Bell } from "lucide-react";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { InternalNav } from "@/components/internal/InternalNav";
import { InternalPwaRegister } from "@/components/internal/InternalPwaRegister";

export const dynamic = "force-dynamic";

export default async function InternalAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireInternalUser();
  const initials = user.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="min-h-screen bg-[#eff0ee] text-neutral-950 dark:bg-[#101310] dark:text-neutral-50">
      <InternalPwaRegister />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900 lg:block">
        <a href="/internal" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-950 font-mono text-sm font-bold text-white dark:bg-white dark:text-neutral-950">ii</span><span><strong className="block font-sans text-sm">iidev Internal OS</strong><small className="font-sans text-neutral-500">Lead Intelligence</small></span></a>
        <InternalNav />
        <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-neutral-100 p-3 dark:bg-neutral-800"><p className="font-sans text-xs font-semibold">{user.full_name}</p><p className="mt-1 truncate font-sans text-[10px] text-neutral-500 dark:text-neutral-400">{user.email}</p></div>
      </aside>
      <div className="lg:pl-64">
        <header className="flex items-center justify-between px-4 pb-1 pt-4 sm:px-7 lg:px-10">
          <a href="/internal" className="flex items-center gap-2 lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-950 font-mono text-xs font-bold text-white dark:bg-white dark:text-neutral-950">ii</span><span className="font-sans text-xs font-bold">Internal OS</span></a>
          <div className="ml-auto flex items-center gap-2"><button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm dark:bg-neutral-900"><Bell className="h-4 w-4" /></button><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-200 font-sans text-xs font-bold text-neutral-900">{initials}</span></div>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-28 pt-4 sm:px-7 lg:px-10 lg:pb-12">{children}</main>
      </div>
      <InternalNav mobile />
    </div>
  );
}
