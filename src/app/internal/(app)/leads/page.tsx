import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { EmptyState } from "@/components/internal/EmptyState";
import { PriorityBadge } from "@/components/internal/PriorityBadge";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { listLeads } from "@/lib/leads/data";
import { leadPriorities, leadStatuses, statusLabels } from "@/lib/leads/types";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireInternalUser();
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const leads = await listLeads({ query: value("query"), status: value("status"), priority: value("priority") });
  return (
    <>
      <div><p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">Lead pipeline</p><h1 className="mt-1 font-sans text-3xl font-bold tracking-tight">Leads</h1><p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">Every enquiry, AI result, owner, and next action in one place.</p></div>
      <form className="mt-6 grid gap-3 rounded-[1.6rem] bg-white p-4 shadow-sm dark:bg-neutral-900 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative"><span className="sr-only">Search leads</span><Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" /><input name="query" defaultValue={value("query")} className="w-full rounded-xl bg-neutral-100 py-3 pl-10 pr-3 font-sans text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-800" placeholder="Search name, business, email" /></label>
        <select name="status" defaultValue={value("status")} className="rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm dark:bg-neutral-800"><option value="">All statuses</option>{leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select>
        <select name="priority" defaultValue={value("priority")} className="rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm dark:bg-neutral-800"><option value="">All priorities</option>{leadPriorities.map((priority) => <option key={priority} value={priority}>{priority.replace("_", " ")}</option>)}</select>
        <button className="rounded-xl bg-neutral-950 px-5 py-3 font-sans text-sm font-bold text-white dark:bg-white dark:text-neutral-950">Apply</button>
      </form>
      {leads.length === 0 ? <div className="mt-5"><EmptyState title="No matching leads" description="Try clearing the filters, or submit a test enquiry through the public booking modal." /></div> : <div className="mt-5 space-y-3">{leads.map((lead) => <Link key={lead.id} href={`/internal/leads/${lead.id}`} className="grid gap-4 rounded-[1.6rem] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 dark:bg-neutral-900 sm:grid-cols-[1fr_auto] sm:items-center"><div className="flex min-w-0 items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 font-sans text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{(lead.business_name || lead.full_name).slice(0, 2).toUpperCase()}</span><div className="min-w-0"><h2 className="truncate font-sans text-sm font-bold">{lead.business_name || lead.full_name}</h2><p className="mt-1 line-clamp-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">{lead.ai_extraction?.summary || lead.raw_enquiry}</p><p className="mt-2 font-sans text-[10px] text-neutral-400">{statusLabels[lead.status]} · {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date(lead.created_at))}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><PriorityBadge priority={lead.priority} score={lead.lead_score} /><ArrowRight className="h-4 w-4 text-neutral-400" /></div></Link>)}</div>}
    </>
  );
}
