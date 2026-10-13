import { BarList, CategoryStageChart, StatTile, WeeklyActivityChart } from "@/components/internal/charts/OutboundCharts";
import type { OutboundOverview } from "@/lib/prospects/data";
import { categoryByStage, countByField, replyRateBy, websiteStateOfAudited, type GroupReplyRate } from "@/lib/prospects/stats";
import { lostReasonLabels, objectionLabels, prospectStatusLabels, websiteStateLabels, type LostReason, type Objection } from "@/lib/prospects/types";

/** Below this many sends, a reply rate is noise. Apollo's guidance is about 100 per version. */
const ENOUGH_SENDS = 100;

function ReplyRateTable({ title, note, rows }: { title: string; note: string; rows: GroupReplyRate[] }) {
  return (
    <section className="rounded-[2rem] bg-white p-5 dark:bg-neutral-900 sm:p-7">
      <h3 className="font-sans text-lg font-bold">{title}</h3>
      <p className="mt-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">{note}</p>
      {rows.length === 0 ? (
        <p className="mt-5 font-sans text-sm text-neutral-500">No first messages logged yet.</p>
      ) : (
        <table className="mt-5 w-full font-sans text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase text-neutral-400">
              <th className="pb-2 font-bold">Group</th>
              <th className="pb-2 text-right font-bold">Sent</th>
              <th className="pb-2 text-right font-bold">Replied</th>
              <th className="pb-2 text-right font-bold">Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-neutral-100 dark:border-neutral-800">
                <td className="py-2">{row.label}</td>
                <td className="py-2 text-right tabular-nums">{row.messaged}</td>
                <td className="py-2 text-right tabular-nums">{row.replied}</td>
                <td className="py-2 text-right tabular-nums">
                  {row.percent}%{row.messaged < ENOUGH_SENDS && <span className="ml-1 text-[10px] text-neutral-400">too few</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

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
            <ReplyRateTable
              title="Reply rate by message version"
              note={`Compare versions only after about ${ENOUGH_SENDS} sends each.`}
              rows={replyRateBy(overview.prospects, overview.events, (prospect) => prospect.message_variant)}
            />
            <ReplyRateTable
              title="Reply rate by business type"
              note="Which kinds of business answer."
              rows={replyRateBy(overview.prospects, overview.events, (prospect) => prospect.category)}
            />
            <ReplyRateTable
              title="Reply rate by language"
              note="Bahasa Melayu or English."
              rows={replyRateBy(overview.prospects, overview.events, (prospect) => (prospect.draft_language === "ms" ? "Bahasa Melayu" : prospect.draft_language === "en" ? "English" : null))}
            />
            <ReplyRateTable
              title="Reply rate with and without a preview link"
              note="A link exists only after they said yes, so read this as how many got a page, not as a fair test."
              rows={replyRateBy(overview.prospects, overview.events, (prospect) => (prospect.preview_token ? "Has a preview link" : "No preview link"))}
            />
            <BarList
              title="Why prospects were lost"
              note="Lost prospects with a reason recorded."
              rows={countByField(overview.prospects, (prospect) => (prospect.status === "lost" ? prospect.lost_reason : null)).map((entry) => ({ label: lostReasonLabels[entry.value as LostReason] || entry.value, value: entry.count }))}
              emptyText="No lost reasons recorded yet."
            />
            <BarList
              title="Objections heard"
              note="The main thing that held them back, from their replies. These are the beliefs to answer earlier."
              rows={countByField(overview.prospects, (prospect) => prospect.objection).map((entry) => ({ label: objectionLabels[entry.value as Objection] || entry.value, value: entry.count }))}
              emptyText="No objections recorded yet."
            />
          </div>
        </>
      )}
    </div>
  );
}
