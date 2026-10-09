import { BarList, CategoryStageChart, StatTile, WeeklyActivityChart } from "@/components/internal/charts/OutboundCharts";
import type { OutboundOverview } from "@/lib/prospects/data";
import { categoryByStage, websiteStateOfAudited } from "@/lib/prospects/stats";
import { prospectStatusLabels, websiteStateLabels } from "@/lib/prospects/types";

/** The outbound section of Insights. Every number comes from prospects and their logged events. */
export function OutboundInsights({ overview }: { overview: OutboundOverview }) {
  const audited = overview.prospects.filter((prospect) => prospect.audit_date).length;
  const rate = overview.replyRate;
  return (
    <div className="mt-10">
      <h2 className="font-sans text-2xl font-bold tracking-tight">Outbound</h2>
      <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">Prospects we contact first. Counts come from what was logged, nothing is estimated.</p>
      {overview.total === 0 ? (
        <p className="mt-5 rounded-3xl bg-white p-6 font-sans text-sm text-neutral-500 dark:bg-neutral-900">No prospects yet.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Prospects" value={String(overview.total)} detail={`${audited} audited`} />
            <StatTile label="Sent, last 7 days" value={String(overview.sentLast7Days)} detail="First messages and follow-ups" />
            <StatTile
              label="Reply rate"
              value={rate.percent === null ? "—" : `${rate.percent}%`}
              detail={rate.messaged === 0 ? "No messages sent yet" : `${rate.replied} of ${rate.messaged} businesses replied${rate.messaged < 20 ? ". Too few to trust yet" : ""}`}
            />
            <StatTile label="Follow-ups due" value={String(overview.due.length)} detail={overview.goneQuiet.length > 0 ? `${overview.goneQuiet.length} gone quiet` : "None gone quiet"} />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <BarList
              title="Pipeline by status"
              note="Where every prospect is right now."
              rows={overview.counts.map((entry) => ({ label: prospectStatusLabels[entry.status], value: entry.count }))}
              emptyText="No prospects yet."
            />
            <WeeklyActivityChart weeks={overview.weekly} />
            <CategoryStageChart rows={categoryByStage(overview.prospects)} />
            <BarList
              title="Website state of audited prospects"
              note="No website and weak website are the ones worth messaging."
              rows={websiteStateOfAudited(overview.prospects).map((entry) => ({ label: websiteStateLabels[entry.state], value: entry.count }))}
              emptyText="Nothing audited yet."
            />
          </div>
        </>
      )}
    </div>
  );
}
