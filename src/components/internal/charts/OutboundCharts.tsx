import {
  pipelineStageLabels,
  pipelineStages,
  type CategoryStageRow,
  type PipelineStage,
  type WeekActivity,
} from "@/lib/prospects/stats";

/**
 * Chart colours. Four categorical slots in a fixed order, checked for colour-blind
 * separation on both surfaces. "Not contacted" is a neutral because it is the absence
 * of activity, not a series. Text never wears these colours: a swatch sits beside it.
 */
const stageFill: Record<PipelineStage, string> = {
  waiting: "bg-neutral-300 dark:bg-neutral-600",
  messaged: "bg-[#2a78d6] dark:bg-[#3987e5]",
  talking: "bg-[#eb6834] dark:bg-[#d95926]",
  won: "bg-[#1baf7a] dark:bg-[#199e70]",
  dropped: "bg-[#eda100] dark:bg-[#c98500]",
};
const sentFill = "bg-[#2a78d6] dark:bg-[#3987e5]";
const replyFill = "bg-[#eb6834] dark:bg-[#d95926]";

function Swatch({ className }: { className: string }) {
  return <span aria-hidden className={`inline-block h-2.5 w-2.5 shrink-0 rounded-[3px] ${className}`} />;
}

const cardClass = "bg-os-paper p-4 sm:p-6";
const noteClass = "mt-1 text-[13px] text-os-muted";

/** One horizontal bar per row, one colour, value printed at the end. For "how many of each". */
export function BarList({
  title,
  note,
  rows,
  emptyText,
}: {
  title: string;
  note?: string;
  rows: { label: string; value: number }[];
  emptyText: string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (
    <section className={cardClass}>
      <h3 className="text-base font-medium">{title}</h3>
      {note && <p className={noteClass}>{note}</p>}
      {total === 0 ? (
        <p className="mt-5 text-sm text-os-muted">{emptyText}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((row) => (
            <li key={row.label} className="grid grid-cols-[112px_1fr_32px] items-center gap-3" title={`${row.label}: ${row.value}`}>
              <span className="truncate text-[13px] text-os-ink">{row.label}</span>
              <span className="h-3 rounded-r-[4px] bg-os-well">
                {row.value > 0 && (
                  <span className={`block h-full rounded-r-[4px] ${sentFill}`} style={{ width: `${Math.max(2, (row.value / maximum) * 100)}%` }} />
                )}
              </span>
              <strong className="tabular text-right text-[13px] font-medium">{row.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Each business type as one stacked bar, split by pipeline stage. Shows which types move. */
export function CategoryStageChart({ rows }: { rows: CategoryStageRow[] }) {
  const maximum = Math.max(1, ...rows.map((row) => row.total));
  const used = pipelineStages.filter((stage) => rows.some((row) => row.stages[stage] > 0));
  return (
    <section className={cardClass}>
      <h3 className="text-base font-medium">Business types by stage</h3>
      <p className={noteClass}>Bar length is the number of prospects. Colour shows how far they have moved.</p>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-os-muted">No prospects yet.</p>
      ) : (
        <>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {used.map((stage) => (
              <li key={stage} className="flex items-center gap-1.5 text-xs text-os-ink">
                <Swatch className={stageFill[stage]} />
                {pipelineStageLabels[stage]}
              </li>
            ))}
          </ul>
          <ul className="mt-5 space-y-3">
            {rows.map((row) => {
              const summary = pipelineStages
                .filter((stage) => row.stages[stage] > 0)
                .map((stage) => `${pipelineStageLabels[stage]} ${row.stages[stage]}`)
                .join(", ");
              return (
                <li key={row.category} className="grid grid-cols-[112px_1fr_32px] items-center gap-3">
                  <span className="truncate text-[13px] text-os-ink">{row.category}</span>
                  <span className="flex h-3 gap-[2px]" style={{ width: `${Math.max(4, (row.total / maximum) * 100)}%` }} role="img" aria-label={`${row.category}: ${summary}`}>
                    {pipelineStages
                      .filter((stage) => row.stages[stage] > 0)
                      .map((stage) => (
                        <span
                          key={stage}
                          title={`${row.category} · ${pipelineStageLabels[stage]}: ${row.stages[stage]}`}
                          className={`h-full min-w-[3px] first:rounded-l-[2px] last:rounded-r-[4px] ${stageFill[stage]}`}
                          style={{ flexGrow: row.stages[stage], flexBasis: 0 }}
                        />
                      ))}
                  </span>
                  <strong className="tabular text-right text-[13px] font-medium">{row.total}</strong>
                </li>
              );
            })}
          </ul>
          <details className="mt-5">
            <summary className="text-[13px] text-os-muted">Show as a table</summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] text-xs">
                <thead>
                  <tr className="text-left text-os-muted">
                    <th className="py-1.5 pr-3 font-medium">Type</th>
                    {pipelineStages.map((stage) => <th key={stage} className="py-1.5 pr-3 text-right font-medium">{pipelineStageLabels[stage]}</th>)}
                    <th className="py-1.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.category} className="border-t border-os-line">
                      <td className="py-1.5 pr-3">{row.category}</td>
                      {pipelineStages.map((stage) => <td key={stage} className="py-1.5 pr-3 text-right tabular">{row.stages[stage]}</td>)}
                      <td className="py-1.5 text-right tabular font-medium">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** Messages sent and replies received, side by side for each week. Both are counts on one scale. */
export function WeeklyActivityChart({ weeks }: { weeks: WeekActivity[] }) {
  const rows = weeks.map((week) => ({ ...week, out: week.sent + week.followUps }));
  const maximum = Math.max(1, ...rows.flatMap((week) => [week.out, week.replies]));
  const hasData = rows.some((week) => week.out > 0 || week.replies > 0);
  return (
    <section className={cardClass}>
      <h3 className="text-base font-medium">Messages and replies per week</h3>
      <p className={noteClass}>Messages include first messages and follow-ups. Weeks start on Monday.</p>
      {!hasData ? (
        <p className="mt-5 text-sm text-os-muted">Nothing sent yet. The first message you mark as sent will show here.</p>
      ) : (
        <>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <li className="flex items-center gap-1.5 text-xs text-os-ink"><Swatch className={sentFill} />Messages sent</li>
            <li className="flex items-center gap-1.5 text-xs text-os-ink"><Swatch className={replyFill} />Replies</li>
          </ul>
          <div className="mt-5 grid items-end gap-2 border-b border-os-line" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`, height: "160px" }}>
            {rows.map((week) => (
              <div key={week.weekStart} className="flex h-full items-end justify-center gap-[2px]">
                {([["Messages sent", week.out, sentFill], ["Replies", week.replies, replyFill]] as const).map(([label, value, fill]) => (
                  <div key={label} className="flex h-full w-full max-w-6 flex-col items-center justify-end" title={`Week of ${shortDate(week.weekStart)} · ${label}: ${value}`}>
                    {value > 0 && <span className="tabular mb-1 text-xs text-os-ink">{value}</span>}
                    <span className={`w-full rounded-t-[4px] ${fill}`} style={{ height: value === 0 ? "0" : `${Math.max(3, (value / maximum) * 82)}%` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
            {rows.map((week) => <span key={week.weekStart} className="text-center text-xs text-os-muted">{shortDate(week.weekStart)}</span>)}
          </div>
        </>
      )}
    </section>
  );
}

/** A single headline number. Used when the answer is one figure, not a comparison. */
export function StatTile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <section className="bg-os-paper p-4">
      <p className="text-[13px] text-os-muted">{label}</p>
      <strong className="tabular mt-1 block font-os-display text-4xl font-normal leading-tight">{value}</strong>
      {detail && <p className="mt-1 text-[13px] text-os-muted">{detail}</p>}
    </section>
  );
}
