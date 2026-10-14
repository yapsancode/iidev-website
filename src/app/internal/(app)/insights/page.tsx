import type { Metadata } from "next";
import { StatTile } from "@/components/internal/charts/OutboundCharts";
import { OutboundInsights } from "@/components/internal/OutboundInsights";
import { PageHeader } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getInsightsData } from "@/lib/leads/data";
import { getOutboundOverview } from "@/lib/prospects/data";

export const metadata: Metadata = { title: "Insights" };

function metric(value: number | null, suffix = "") {
  return value === null ? "—" : `${value}${suffix}`;
}

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
      <PageHeader eyebrow="Last 90 days" title="Insights" description="Only numbers backed by logged events. Small numbers are marked as too few to trust." />

      <OutboundInsights overview={outbound} />

      <section aria-labelledby="inbound-title" className="mt-12">
        <h2 id="inbound-title" className="font-os-display text-3xl leading-tight">Website enquiries</h2>
        <p className="mt-1 text-[15px] text-os-muted">People who wrote to us through the booking form.</p>
        {insights.total === 0 ? (
          <p className="mt-4 bg-os-paper p-5 text-sm text-os-muted">No enquiries yet. Numbers appear once real enquiries come in.</p>
        ) : (
          <>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile label="Average score" value={metric(insights.averageScore)} detail="Out of 100" />
              <StatTile label="Average first reply" value={metric(insights.averageResponseMinutes, " min")} detail="From the enquiry to Mark contacted" />
              <StatTile label="Summaries ready to use" value={metric(insights.aiReliability, "%")} detail="Of summarised enquiries, the share that needed no check by hand" />
              <StatTile label="Not answered after 3 days" value={String(insights.missedFollowUps)} detail="Still marked New" />
            </div>
            <div className="mt-2 grid gap-2 xl:grid-cols-[1.4fr_.6fr]">
              <section className="bg-os-paper p-4 sm:p-6">
                <h3 className="text-base font-medium">Enquiries per week</h3>
                <p className="mt-1 text-[13px] text-os-muted">Bar length is all enquiries. The darker part reached qualified or later.</p>
                {weeks.length < 2 ? (
                  <p className="mt-5 text-sm text-os-muted">More than one week of enquiries is needed for a trend.</p>
                ) : (
                  <ul className="mt-5 grid gap-3">
                    {weeks.map(([week, values]) => (
                      <li key={week} className="grid grid-cols-[72px_1fr_32px] items-center gap-3 text-[13px]">
                        <span className="text-os-muted">{week}</span>
                        <span className="relative h-3 bg-os-well">
                          <span className="absolute inset-y-0 left-0 bg-os-accent/40" style={{ width: `${(values.total / maximum) * 100}%` }} />
                          <span className="absolute inset-y-0 left-0 bg-os-accent" style={{ width: `${(values.qualified / maximum) * 100}%` }} />
                        </span>
                        <span className="tabular text-right">{values.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="bg-os-paper p-4 sm:p-6">
                <h3 className="text-base font-medium">Services asked for</h3>
                {insights.serviceDemand.length === 0 ? (
                  <p className="mt-5 text-sm text-os-muted">Nothing summarised yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-os-line">
                    {insights.serviceDemand.map(([service, count]) => (
                      <li key={service} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="capitalize">{service.replaceAll("_", " ")}</span>
                        <span className="tabular">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </section>
    </>
  );
}
