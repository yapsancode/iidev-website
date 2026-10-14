import type { Metadata } from "next";
import Link from "next/link";
import { Columns3, List, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/internal/EmptyState";
import { ProspectBoard, type BoardCard } from "@/components/internal/ProspectBoard";
import { formatDay, websiteStateShort } from "@/components/internal/ProspectBits";
import { buttonClass, LinkRow, PageHeader, RowList, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { listProspects, loadProspects } from "@/lib/prospects/data";
import { compareForAudit, isDue, matchesView, todayInMalaysia } from "@/lib/prospects/rules";
import { stageLabels, stageOf, type ProspectStage } from "@/lib/prospects/stage";
import { prospectStatusLabels, prospectViewLabels, prospectViews, type ProspectView } from "@/lib/prospects/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Prospects" };

const stageTone: Partial<Record<ProspectStage, "accent" | "alert" | "solid" | "outline">> = {
  ready: "accent",
  follow_up_due: "alert",
  replied: "accent",
  in_progress: "solid",
  stopped: "alert",
  closed: "outline",
  no_problem: "outline",
};

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireInternalUser();
  const params = await searchParams;
  const value = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const view: ProspectView = (prospectViews as readonly string[]).includes(value("view")) ? (value("view") as ProspectView) : "all";
  const query = value("query");
  const board = value("layout") === "board";
  const today = todayInMalaysia();

  const everyone = await loadProspects();
  const prospects = board ? everyone : await listProspects({ view, query }, today);
  const countFor = (entry: ProspectView) => everyone.filter((prospect) => matchesView(prospect, entry, today)).length;
  const link = (next: { view?: ProspectView; layout?: string }) => {
    const search = new URLSearchParams();
    const nextView = next.view ?? view;
    if (nextView !== "all") search.set("view", nextView);
    if (next.layout === "board") search.set("layout", "board");
    const text = search.toString();
    return `/internal/prospects${text ? `?${text}` : ""}`;
  };

  const cards: BoardCard[] = [...everyone].sort(compareForAudit).map((prospect) => ({
    id: prospect.id,
    business_name: prospect.business_name,
    category: prospect.category,
    priority: prospect.priority,
    status: prospect.status,
    website_state: prospect.website_state,
    next_follow_up_label: prospect.status === "messaged" && prospect.next_follow_up ? formatDay(prospect.next_follow_up) : null,
    due: isDue(prospect, today),
    stopped: prospect.lost_reason === "asked_to_stop",
  }));

  const toggleClass = (active: boolean) =>
    cn("inline-flex min-h-10 items-center gap-1.5 px-3 text-[13px]", active ? "bg-os-ink text-os-paper" : "text-os-muted hover:text-os-ink");

  return (
    <>
      <PageHeader
        eyebrow={`${everyone.length} businesses`}
        title="Prospects"
        description="Businesses we plan to contact. Audit first, then message."
        actions={
          <>
            <div className="flex bg-os-paper p-1">
              <Link href={link({ layout: "list" })} aria-current={!board ? "page" : undefined} className={toggleClass(!board)}><List className="h-4 w-4" strokeWidth={1.75} aria-hidden />List</Link>
              <Link href={link({ view: "all", layout: "board" })} aria-current={board ? "page" : undefined} className={toggleClass(board)}><Columns3 className="h-4 w-4" strokeWidth={1.75} aria-hidden />Board</Link>
            </div>
            <Link href="/internal/prospects/new" className={buttonClass("secondary")}><Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />Add</Link>
          </>
        }
      />

      {everyone.length === 0 ? (
        <div className="mt-6"><EmptyState title="No prospects yet" description="Add one by hand, or ask Claude to find businesses in an area." /></div>
      ) : board ? (
        <ProspectBoard cards={cards} />
      ) : (
        <>
          <nav aria-label="Prospect lists" className="-mx-4 mt-6 flex gap-1 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {prospectViews.map((entry) => {
              const active = entry === view;
              return (
                <Link
                  key={entry}
                  href={link({ view: entry })}
                  aria-current={active ? "page" : undefined}
                  className={cn("inline-flex min-h-10 shrink-0 items-center gap-1.5 px-3 text-[13px]", active ? "bg-os-ink text-os-paper" : "bg-os-paper text-os-ink hover:bg-os-well")}
                >
                  {prospectViewLabels[entry]} <span className={cn("tabular", active ? "opacity-70" : "text-os-muted")}>{countFor(entry)}</span>
                </Link>
              );
            })}
          </nav>
          <form className="mt-3 flex gap-2" role="search">
            {view !== "all" && <input type="hidden" name="view" value={view} />}
            <label className="relative flex-1">
              <span className="sr-only">Search prospects</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-os-muted" strokeWidth={1.75} aria-hidden />
              <input name="query" defaultValue={query} className="block min-h-11 w-full border border-os-line bg-os-paper py-2.5 pl-10 pr-3 text-[15px] outline-none placeholder:text-os-muted focus:border-os-accent" placeholder="Business, area, type or phone" />
            </label>
            <button className={buttonClass("secondary")}>Search</button>
          </form>
          {prospects.length === 0 ? (
            <div className="mt-4"><EmptyState title="Nothing in this list" description={view === "due" ? "No follow-ups are due today." : "Try another list or clear the search."} /></div>
          ) : (
            <RowList className="mt-4">
              {prospects.map((prospect) => {
                const stage = stageOf(prospect, today);
                const detail =
                  stage === "follow_up_due" ? `Follow-up due ${prospect.next_follow_up === today ? "today" : `since ${formatDay(prospect.next_follow_up)}`}`
                  : stage === "waiting" ? `Follow up on ${formatDay(prospect.next_follow_up)}`
                  : prospect.top_finding || prospect.suggested_angle || "Not audited yet.";
                return (
                  <LinkRow
                    key={prospect.id}
                    href={`/internal/prospects/${prospect.id}`}
                    title={prospect.business_name}
                    meta={[
                      prospect.category,
                      prospect.area,
                      prospect.google_reviews != null ? `${prospect.google_reviews.toLocaleString("en-MY")} reviews` : null,
                      prospect.website_state ? websiteStateShort[prospect.website_state] : null,
                      prospect.whatsapp ? null : "landline",
                    ].filter(Boolean).join(" · ")}
                    detail={detail}
                    detailTone={stage === "follow_up_due" ? "alert" : "muted"}
                    aside={
                      <span className="flex flex-col items-end gap-1">
                        <Tag tone={stageTone[stage] || "neutral"}>{stage === "closed" ? prospectStatusLabels[prospect.status] : stageLabels[stage]}</Tag>
                        <span className="hidden text-xs text-os-muted sm:block">Priority {prospect.priority}</span>
                      </span>
                    }
                  />
                );
              })}
            </RowList>
          )}
        </>
      )}
    </>
  );
}
