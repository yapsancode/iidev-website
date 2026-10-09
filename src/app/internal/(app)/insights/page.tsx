import { AlertTriangle, BrainCircuit, Clock3, Gauge, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/internal/EmptyState";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getInsightsData } from "@/lib/leads/data";
import { OutboundInsights } from "@/components/internal/OutboundInsights";
import { getOutboundOverview } from "@/lib/prospects/data";

function metric(value: number | null, suffix = "") { return value === null ? "—" : `${value}${suffix}`; }

export default async function InsightsPage() {
  await requireInternalUser();
  const [insights, outbound] = await Promise.all([getInsightsData(), getOutboundOverview()]);
  const weekly = new Map<string, { total: number; qualified: number; won: number }>();
  insights.records.forEach((lead) => {
    const date = new Date(lead.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(Math.ceil(date.getDate() / 7)).padStart(2, "0")}`;
    const current = weekly.get(key) || { total: 0, qualified: 0, won: 0 };
    current.total += 1;
    if (["qualified", "proposal", "won"].includes(lead.status)) current.qualified += 1;
    if (lead.status === "won") current.won += 1;
    weekly.set(key, current);
  });
  const weeks = [...weekly.entries()].slice(-8);
  const maximum = Math.max(1, ...weeks.map(([, values]) => values.total));
  return (
    <>
      <div><p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">Last 90 days</p><h1 className="mt-1 font-sans text-3xl font-bold tracking-tight">Insights</h1><p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">Only metrics supported by actual lead and audit-event data.</p></div>
      <h2 className="mt-8 font-sans text-2xl font-bold tracking-tight">Inbound</h2>
      {insights.total === 0 ? <div className="mt-6"><EmptyState title="Not enough data yet" description="Insights will appear after real or test enquiries have moved through the lead workflow." /></div> : <>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <section className="rounded-[1.6rem] bg-white p-5 dark:bg-neutral-900"><Gauge className="h-5 w-5 text-[#ef6552]" /><p className="mt-5 font-sans text-xs text-neutral-500">Average lead score</p><strong className="mt-2 block font-sans text-3xl">{metric(insights.averageScore, "/100")}</strong></section>
          <section className="rounded-[1.6rem] bg-white p-5 dark:bg-neutral-900"><Clock3 className="h-5 w-5 text-blue-500" /><p className="mt-5 font-sans text-xs text-neutral-500">Average first response</p><strong className="mt-2 block font-sans text-3xl">{metric(insights.averageResponseMinutes, " min")}</strong></section>
          <section className="rounded-[1.6rem] bg-white p-5 dark:bg-neutral-900"><BrainCircuit className="h-5 w-5 text-emerald-600" /><p className="mt-5 font-sans text-xs text-neutral-500">AI completion rate</p><strong className="mt-2 block font-sans text-3xl">{metric(insights.aiReliability, "%")}</strong></section>
          <section className="rounded-[1.6rem] bg-white p-5 dark:bg-neutral-900"><AlertTriangle className="h-5 w-5 text-amber-500" /><p className="mt-5 font-sans text-xs text-neutral-500">Missed follow-ups</p><strong className="mt-2 block font-sans text-3xl">{insights.missedFollowUps}</strong></section>
        </div>
        <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
          <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-[#ef6552]" /><h2 className="font-sans text-lg font-bold">Weekly pipeline</h2></div>{weeks.length < 2 ? <p className="mt-5 font-sans text-sm text-neutral-500">More than one week of data is needed for a useful trend.</p> : <div className="mt-6 space-y-5">{weeks.map(([week, values]) => <div key={week} className="grid grid-cols-[70px_1fr_28px] items-center gap-3"><span className="font-sans text-[10px] text-neutral-500">{week}</span><div className="relative h-4 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="absolute inset-y-0 left-0 rounded-full bg-[#ef6552]" style={{ width: `${(values.total / maximum) * 100}%` }} /><div className="absolute inset-y-0 left-0 rounded-full bg-amber-400" style={{ width: `${(values.qualified / maximum) * 100}%` }} /><div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: `${(values.won / maximum) * 100}%` }} /></div><strong className="text-right font-mono text-xs">{values.total}</strong></div>)}</div>}</section>
          <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7"><h2 className="font-sans text-lg font-bold">Service demand</h2>{insights.serviceDemand.length === 0 ? <p className="mt-5 font-sans text-sm text-neutral-500">No service data extracted yet.</p> : <div className="mt-5 space-y-4">{insights.serviceDemand.map(([service, count]) => <div key={service} className="flex items-center justify-between gap-3"><span className="font-sans text-xs capitalize">{service.replaceAll("_", " ")}</span><strong className="rounded-full bg-emerald-100 px-2.5 py-1 font-mono text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{count}</strong></div>)}</div>}</section>
        </div>
      </>}
      <OutboundInsights overview={outbound} />
    </>
  );
}
