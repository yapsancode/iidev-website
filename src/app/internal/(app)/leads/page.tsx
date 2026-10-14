import type { Metadata } from "next";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/internal/EmptyState";
import { PriorityBadge } from "@/components/internal/PriorityBadge";
import { formatMoment } from "@/components/internal/ProspectBits";
import { buttonClass, LinkRow, PageHeader, RowList, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { listLeads } from "@/lib/leads/data";
import { leadPriorities, leadStatuses, statusLabels } from "@/lib/leads/types";

export const metadata: Metadata = { title: "Enquiries" };

const priorityLabels: Record<string, string> = { high: "High", medium: "Medium", low: "Low", needs_review: "Check by hand" };
const selectClass = "block min-h-11 border border-os-line bg-os-paper px-3 text-[15px] text-os-ink outline-none focus:border-os-accent";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireInternalUser();
  const params = await searchParams;
  const value = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const leads = await listLeads({ query: value("query"), status: value("status"), priority: value("priority") });
  const filtered = Boolean(value("query") || value("status") || value("priority"));
  return (
    <>
      <PageHeader
        eyebrow="From the website"
        title="Enquiries"
        description="People who wrote to us through the booking form. To get a summary and a score, ask Claude in the chat app to summarise the new enquiries."
      />
      <form className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]" role="search">
        <label className="relative">
          <span className="sr-only">Search enquiries</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-os-muted" strokeWidth={1.75} aria-hidden />
          <input name="query" defaultValue={value("query")} className={`${selectClass} w-full pl-10 placeholder:text-os-muted`} placeholder="Name, business or email" />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={value("status")} className={`${selectClass} w-full`}>
            <option value="">All statuses</option>
            {leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Priority</span>
          <select name="priority" defaultValue={value("priority")} className={`${selectClass} w-full`}>
            <option value="">All priorities</option>
            {leadPriorities.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}
          </select>
        </label>
        <button className={buttonClass("secondary")}>Apply</button>
      </form>
      {leads.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={filtered ? "No matching enquiries" : "No enquiries yet"}
            description={filtered ? "Try clearing the filters." : "When someone sends the booking form on the website, it shows here and a Telegram alert goes to the founders."}
          />
        </div>
      ) : (
        <RowList className="mt-4">
          {leads.map((lead) => (
            <LinkRow
              key={lead.id}
              href={`/internal/leads/${lead.id}`}
              title={lead.business_name || lead.full_name}
              meta={`${statusLabels[lead.status]} · ${formatMoment(lead.created_at)}`}
              detail={lead.ai_extraction?.summary || lead.raw_enquiry}
              aside={lead.ai_extraction ? <PriorityBadge priority={lead.priority} score={lead.lead_score} /> : <Tag tone="alert">Not summarised</Tag>}
            />
          ))}
        </RowList>
      )}
    </>
  );
}
