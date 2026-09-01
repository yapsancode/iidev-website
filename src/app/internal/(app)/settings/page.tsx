import { Bot, Database, KeyRound, LogOut, MoonStar, Smartphone } from "lucide-react";
import { InstallAppButton } from "@/components/internal/InstallAppButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { requireInternalUser } from "@/lib/auth/internal-user";

function Status({ ready }: { ready: boolean }) { return <span className={`rounded-full px-2.5 py-1 font-sans text-[10px] font-bold ${ready ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}>{ready ? "Ready" : "Not configured"}</span>; }

export default async function SettingsPage() {
  const user = await requireInternalUser();
  const services = [
    { label: "Cloudflare D1 database", icon: Database, ready: true },
    { label: "OpenAI lead extraction", icon: KeyRound, ready: Boolean(process.env.OPENAI_API_KEY) },
    { label: "Telegram founder group", icon: Bot, ready: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) },
  ];
  return (
    <>
      <div><p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">Founder controls</p><h1 className="mt-1 font-sans text-3xl font-bold tracking-tight">Settings</h1></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><div className="flex items-center gap-2"><Database className="h-5 w-5 text-emerald-600" /><h2 className="font-sans text-lg font-bold">System connections</h2></div><div className="mt-5 divide-y divide-neutral-100 dark:divide-neutral-800">{services.map(({ label, icon: Icon, ready }) => <div key={label} className="flex items-center justify-between gap-4 py-4"><span className="flex items-center gap-3 font-sans text-sm"><Icon className="h-4 w-4 text-neutral-400" />{label}</span><Status ready={ready} /></div>)}</div><p className="mt-5 font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">Secrets are stored as encrypted Cloudflare Worker secrets and are never exposed in this dashboard.</p></section>
        <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><div className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-[#ef6552]" /><h2 className="font-sans text-lg font-bold">Install on this device</h2></div><p className="mt-4 font-sans text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">Install the Internal OS from your browser for an app-like launch experience. Lead data is never cached offline.</p><div className="mt-5"><InstallAppButton /></div></section>
        <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><div className="flex items-center gap-2"><MoonStar className="h-5 w-5 text-blue-500" /><h2 className="font-sans text-lg font-bold">Appearance</h2></div><div className="mt-5 flex items-center justify-between"><span className="font-sans text-sm">Light or dark theme</span><ThemeToggle /></div></section>
        <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><p className="font-sans text-[10px] uppercase tracking-wider text-neutral-400">Signed in as</p><h2 className="mt-2 font-sans text-lg font-bold">{user.full_name}</h2><p className="mt-1 font-sans text-xs text-neutral-500">{user.email}</p><a href="/cdn-cgi/access/logout" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-sans text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-200"><LogOut className="h-4 w-4" />Sign out</a></section>
      </div>
    </>
  );
}
