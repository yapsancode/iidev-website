import { BarList, CategoryStageChart, StatTile, WeeklyActivityChart } from "@/components/internal/charts/OutboundCharts";
import type { OutboundOverview } from "@/lib/prospects/data";
import { categoryByStage, countByField, replyRateBy, websiteStateOfAudited, type GroupReplyRate } from "@/lib/prospects/stats";
import { lostReasonLabels, objectionLabels, prospectStatusLabels, websiteStateLabels, type LostReason, type Objection } from "@/lib/prospects/types";

/** Below this many sends, a reply rate is noise. Apollo's guidance is about 100 per version. */
const ENOUGH_SENDS = 100;
/** /pipeline-review starts comparing groups after this many first messages. */
const START_COMPARING = 20;

function ReplyRateTable({ title, note, rows }: { title: string; note: string; rows: GroupReplyRate[] }) {
  return (
    <section className="bg-os-paper p-4 sm:p-6">
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-1 text-[13px] text-os-muted">{note}</p>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-os-muted">No first messages logged yet.</p>
      ) : (
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-os-muted">
              <th className="pb-2 font-normal">Group</th>
              <th className="pb-2 text-right font-normal">Sent</th>
              <th className="pb-2 text-right font-normal">Replied</th>
              <th className="pb-2 text-right font-normal">Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-os-line">
                <td className="py-2">{row.label}</td>
                <td className="tabular py-2 text-right">{row.messaged}</td>
                <td className="tabular py-2 text-right">{row.replied}</td>
                <td className="tabular py-2 text-right">
                  {row.percent}%{row.messaged < ENOUGH_SENDS && <span className="ml-1 text-xs text-os-muted">too few</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/** The outbound part of Insights. Every number comes from prospects and their logged events. */
export function OutboundInsights({ overview }: { overview: OutboundOverview }) {
  const audited = overview.prospects.filter((prospect) => prospect.audit_date).length;
  const rate = overview.replyRate;
  const comparing = rate.messaged >= START_COMPARING;
  return (
    <section aria-labelledby="outbound-title" className="mt-8">
      <h2 id="outbound-title" className="font-os-display text-3xl leading-tight">Outbound</h2>
      <p className="mt-1 text-[15px] text-os-muted">Businesses we contact first. Counts come from what was logged. Nothing is estimated.</p>
      {overview.total === 0 ? (
        <p className="mt-4 bg-os-paper p-5 text-sm text-os-muted">No prospects yet.</p>
      ) : (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Prospects" value={String(overview.total)} detail={`${audited} audited`} />
            <StatTile label="Sent, last 7 days" value={String(overview.sentLast7Days)} detail="First messages and follow-ups" />
            <StatTile
              label="Replied"
              value={rate.messaged === 0 ? "—" : `${rate.replied} of ${rate.messaged}`}
              detail={rate.messaged === 0 ? "No messages sent yet" : `${rate.percent}% of businesses messaged${rate.messaged < START_COMPARING ? ". Too few to trust yet" : ""}`}
            />
            <StatTile label="Follow-ups due" value={String(overview.due.length)} detail={overview.goneQuiet.length > 0 ? `${overview.goneQuiet.length} gone quiet` : "None gone quiet"} />
          </div>
          <div className="mt-2 grid gap-2 xl:grid-cols-2">
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

          <h3 className="mt-8 text-base font-medium">What gets replies</h3>
          {!comparing ? (
            <p className="mt-2 bg-os-paper p-5 text-sm text-os-muted">
              Comparisons by message version, business type, language and preview link start after {START_COMPARING} first messages. Sent so far: <span className="tabular text-os-ink">{rate.messaged}</span>. Before that, the numbers would only be noise.
            </p>
          ) : (
            <div className="mt-2 grid gap-2 xl:grid-cols-2">
              <ReplyRateTable
                title="By message version"
                note={`Decide between versions only after about ${ENOUGH_SENDS} sends each.`}
                rows={replyRateBy(overview.prospects, overview.events, (prospect) => prospect.message_variant)}
              />
              <ReplyRateTable
                title="By business type"
                note="Which kinds of business answer."
                rows={replyRateBy(overview.prospects, overview.events, (prospect) => prospect.category)}
              />
              <ReplyRateTable
                title="By language"
                note="Bahasa Melayu or English."
                rows={replyRateBy(overview.prospects, overview.events, (prospect) => (prospect.draft_language === "ms" ? "Bahasa Melayu" : prospect.draft_language === "en" ? "English" : null))}
              />
              <ReplyRateTable
                title="With and without a preview link"
                note="A link exists only after they said yes, so read this as how many got a page, not as a fair test."
                rows={replyRateBy(overview.prospects, overview.events, (prospect) => (prospect.preview_token ? "Has a preview link" : "No preview link"))}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
