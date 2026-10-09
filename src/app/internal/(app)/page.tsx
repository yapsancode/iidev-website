import Link from "next/link";
import { ArrowRight, Clock3, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getDashboardData } from "@/lib/leads/data";
import { budgetLabels } from "@/lib/leads/types";
import { EmptyState } from "@/components/internal/EmptyState";
import { PriorityBadge } from "@/components/internal/PriorityBadge";
import { OutboundToday } from "@/components/internal/OutboundToday";
import { getOutboundOverview } from "@/lib/prospects/data";

export default async function InternalHomePage() {
  const [user, dashboard, outbound] = await Promise.all([requireInternalUser(), getDashboardData(), getOutboundOverview()]);
  const today = new Intl.DateTimeFormat("en-MY", { timeZone: "Asia/Kuala_Lumpur", weekday: "short", day: "numeric", month: "short" }).format(new Date());
  const firstName = user.full_name.split(" ")[0];
  const health = dashboard.openCount === 0 ? null : Math.max(0, Math.min(100, Math.round(100 - dashboard.needsReviewCount * 15 - dashboard.missedFollowUps * 20)));

  return (
    <>
      <div><p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">{today}</p><h1 className="mt-1 font-sans text-3xl font-bold tracking-tight sm:text-4xl">Stay in control, {firstName}.</h1><p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">What needs your attention across the lead pipeline.</p></div>

      <section className="mt-6 rounded-[2rem] bg-[#0d1712] p-5 text-white shadow-sm sm:p-7">
        <div className="flex items-start justify-between gap-5"><div><p className="font-sans text-xs text-emerald-200">Pipeline health</p><h2 className="mt-2 font-sans text-2xl font-bold">{dashboard.openCount} active {dashboard.openCount === 1 ? "lead" : "leads"}</h2></div><div className="grid h-16 w-16 place-items-center rounded-full border-[7px] border-[#ef6552] font-sans text-sm font-bold">{health === null ? "—" : `${health}%`}</div></div>
        <div className="mt-6 grid grid-cols-3 border-t border-white/15 pt-5 text-center"><div className="border-r border-white/15"><strong className="block font-sans text-lg">{dashboard.highPriorityCount}</strong><span className="font-sans text-[10px] text-neutral-400">High priority</span></div><div className="border-r border-white/15"><strong className="block font-sans text-lg">{dashboard.needsReviewCount}</strong><span className="font-sans text-[10px] text-neutral-400">Needs review</span></div><div><strong className="block font-sans text-lg">{dashboard.missedFollowUps}</strong><span className="font-sans text-[10px] text-neutral-400">Missed follow-ups</span></div></div>
      </section>

      <OutboundToday overview={outbound} />

      <div className="mt-7 flex items-end justify-between"><div><h2 className="font-sans text-lg font-bold">Today’s attention</h2><p className="mt-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">High priority and manual-review leads</p></div><Link href="/internal/leads" className="font-sans text-xs font-bold text-[#e95f4d]">See all</Link></div>
      {dashboard.recent.length === 0 ? <div className="mt-4"><EmptyState title="No leads yet" description="New website enquiries will appear here after the D1 migration and Worker secrets are configured." /></div> : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboard.recent.slice(0, 3).map((lead, index) => <Link key={lead.id} href={`/internal/leads/${lead.id}`} className={`group rounded-[1.6rem] p-5 shadow-sm transition hover:-translate-y-0.5 ${index === 0 && lead.priority === "high" ? "bg-[#ef6552] text-white" : "bg-white dark:bg-neutral-900"}`}><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-2xl ${index === 0 && lead.priority === "high" ? "bg-white/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}`}><Sparkles className="h-5 w-5" /></span><PriorityBadge priority={lead.priority} score={lead.lead_score} /></div><h3 className="mt-7 font-sans text-lg font-bold">{lead.business_name || lead.full_name}</h3><p className={`mt-2 line-clamp-2 font-sans text-xs leading-relaxed ${index === 0 && lead.priority === "high" ? "text-white/80" : "text-neutral-500 dark:text-neutral-400"}`}>{lead.ai_extraction?.summary || lead.raw_enquiry}</p><div className="mt-5 flex items-center justify-between font-sans text-[10px]"><span>{lead.budget ? budgetLabels[lead.budget] : "Budget not provided"}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div></Link>)}
        </div>
      )}

      <div className="mt-7"><h2 className="font-sans text-lg font-bold">System status</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-3xl bg-white p-4 dark:bg-neutral-900"><ShieldCheck className="h-5 w-5 text-emerald-600" /><strong className="mt-3 block font-sans text-sm">Raw capture</strong><span className="mt-1 block font-sans text-xs text-neutral-500">Saved before WhatsApp</span></div><div className="rounded-3xl bg-white p-4 dark:bg-neutral-900"><Sparkles className="h-5 w-5 text-emerald-600" /><strong className="mt-3 block font-sans text-sm">AI processing</strong><span className="mt-1 block font-sans text-xs text-neutral-500">{dashboard.needsReviewCount ? `${dashboard.needsReviewCount} need attention` : "No known failures"}</span></div><div className="rounded-3xl bg-white p-4 dark:bg-neutral-900"><MessageCircle className="h-5 w-5 text-emerald-600" /><strong className="mt-3 block font-sans text-sm">Follow-up</strong><span className="mt-1 block font-sans text-xs text-neutral-500">{dashboard.missedFollowUps ? `${dashboard.missedFollowUps} overdue` : "Nothing overdue"}</span></div></div></div>

      {dashboard.recent.length > 0 && <section className="mt-7 rounded-[2rem] bg-white p-5 dark:bg-neutral-900"><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-[#e95f4d]" /><h2 className="font-sans text-lg font-bold">Coming up</h2></div><div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">{dashboard.recent.filter((lead) => lead.status === "new").slice(0, 3).map((lead) => <Link key={lead.id} href={`/internal/leads/${lead.id}`} className="flex items-center justify-between gap-4 py-4"><div><strong className="font-sans text-sm">Follow up with {lead.full_name}</strong><p className="mt-1 font-sans text-xs text-neutral-500">{lead.business_name || "Website enquiry"}</p></div><ArrowRight className="h-4 w-4" /></Link>)}</div></section>}
    </>
  );
}
