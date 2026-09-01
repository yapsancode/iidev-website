import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function InternalLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eff0ee] px-5 py-12 dark:bg-[#101310]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,0.12)] dark:bg-neutral-900">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><LockKeyhole className="h-6 w-6" /></div>
        <p className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">iidev Internal OS</p>
        <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">Founder sign in</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">This dashboard is protected by Cloudflare Access. In production, Cloudflare asks for your founder email before this page can load.</p>
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 font-sans text-sm leading-relaxed text-amber-900 dark:bg-amber-950 dark:text-amber-100">If you can see this in production, the Access rule or founder allowlist still needs configuration.</div>
        <Link href="/" className="mt-5 block text-center font-sans text-xs text-neutral-500 underline">Return to public website</Link>
      </section>
    </main>
  );
}
