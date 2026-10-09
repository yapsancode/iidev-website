import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Columns3, List, Plus, Search } from "lucide-react";
import { EmptyState } from "@/components/internal/EmptyState";
import { ProspectBoard, type BoardCard } from "@/components/internal/ProspectBoard";
import { formatDay, ProspectPriorityBadge, ProspectStatusBadge, WebsiteStateBadge } from "@/components/internal/ProspectBits";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { listProspects, loadProspects } from "@/lib/prospects/data";
import { compareForAudit, isDue, matchesView, todayInMalaysia } from "@/lib/prospects/rules";
import { prospectViewLabels, prospectViews, type ProspectView } from "@/lib/prospects/types";

export const metadata: Metadata = { title: "Prospects" };

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
  }));

  const toggleClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-sans text-xs font-bold ${active ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-600 dark:text-neutral-300"}`;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400">Outbound pipeline</p>
          <h1 className="mt-1 font-sans text-3xl font-bold tracking-tight">Prospects</h1>
          <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">Businesses we plan to contact. Audit first, then message.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-2xl bg-white p-1 shadow-sm dark:bg-neutral-900">
            <Link href={link({ layout: "list" })} aria-current={!board ? "page" : undefined} className={toggleClass(!board)}><List className="h-4 w-4" />List</Link>
            <Link href={link({ view: "all", layout: "board" })} aria-current={board ? "page" : undefined} className={toggleClass(board)}><Columns3 className="h-4 w-4" />Board</Link>
          </div>
          <Link href="/internal/prospects/new" className="inline-flex items-center gap-1.5 rounded-2xl bg-[#ef6552] px-4 py-3 font-sans text-xs font-bold text-white"><Plus className="h-4 w-4" />Add</Link>
        </div>
      </div>

      {everyone.length === 0 ? (
        <div className="mt-6"><EmptyState title="No prospects yet" description="Add one by hand, or ask Claude to import a list." /></div>
      ) : board ? (
        <ProspectBoard cards={cards} />
      ) : (
        <>
          <nav aria-label="Prospect lists" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {prospectViews.map((entry) => {
              const active = entry === view;
              return (
                <Link key={entry} href={link({ view: entry })} aria-current={active ? "page" : undefined} className={`shrink-0 rounded-full px-3.5 py-2 font-sans text-xs font-semibold ${active ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "bg-white text-neutral-600 shadow-sm dark:bg-neutral-900 dark:text-neutral-300"}`}>
                  {prospectViewLabels[entry]} <span className="font-mono tabular-nums opacity-70">{countFor(entry)}</span>
                </Link>
              );
            })}
          </nav>
          <form className="mt-3 grid gap-3 rounded-[1.6rem] bg-white p-4 shadow-sm dark:bg-neutral-900 sm:grid-cols-[1fr_auto]">
            {view !== "all" && <input type="hidden" name="view" value={view} />}
            <label className="relative">
              <span className="sr-only">Search prospects</span>
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              <input name="query" defaultValue={query} className="w-full rounded-xl bg-neutral-100 py-3 pl-10 pr-3 font-sans text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-800" placeholder="Search business, area, type or phone" />
            </label>
            <button className="rounded-xl bg-neutral-950 px-5 py-3 font-sans text-sm font-bold text-white dark:bg-white dark:text-neutral-950">Search</button>
          </form>
          {prospects.length === 0 ? (
            <div className="mt-5"><EmptyState title="Nothing in this list" description={view === "due" ? "No follow-ups are due today." : "Try another list or clear the search."} /></div>
          ) : (
            <div className="mt-5 space-y-3">
              {prospects.map((prospect) => {
                const due = isDue(prospect, today);
                return (
                  <Link key={prospect.id} href={`/internal/prospects/${prospect.id}`} className="grid gap-3 rounded-[1.6rem] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 dark:bg-neutral-900 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="min-w-0">
                      <h2 className="truncate font-sans text-sm font-bold">{prospect.business_name}</h2>
                      <p className="mt-1 font-sans text-[11px] text-neutral-500 dark:text-neutral-400">
                        {prospect.category}{prospect.area ? ` · ${prospect.area}` : ""}{prospect.google_reviews != null ? ` · ${prospect.google_reviews.toLocaleString("en-MY")} reviews` : ""}{prospect.whatsapp ? "" : " · landline"}
                      </p>
                      <p className="mt-2 line-clamp-2 font-sans text-xs text-neutral-600 dark:text-neutral-300">{prospect.top_finding || prospect.suggested_angle || "Not audited yet."}</p>
                      {prospect.status === "messaged" && prospect.next_follow_up && (
                        <p className={`mt-2 font-sans text-[11px] font-semibold ${due ? "text-red-700 dark:text-red-300" : "text-neutral-500 dark:text-neutral-400"}`}>{due ? "Follow-up due" : "Follow up on"} {formatDay(prospect.next_follow_up)}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <WebsiteStateBadge state={prospect.website_state} />
                      <ProspectPriorityBadge priority={prospect.priority} />
                      <ProspectStatusBadge status={prospect.status} />
                      <ArrowRight className="hidden h-4 w-4 text-neutral-400 sm:block" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
