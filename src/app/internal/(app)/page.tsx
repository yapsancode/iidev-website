import type { Metadata } from "next";
import Link from "next/link";
import { CommandCopy } from "@/components/internal/CopyButton";
import { formatDay, formatMoment } from "@/components/internal/ProspectBits";
import { EmptyNote, LinkRow, PageHeader, RowList, Section, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { countEnquiriesWaiting, listLeads } from "@/lib/leads/data";
import { getOutboundOverview } from "@/lib/prospects/data";
import { draftProblems } from "@/lib/prospects/draft-check";
import { daysBetween } from "@/lib/prospects/stage";
import { sentInLastDays } from "@/lib/prospects/stats";
import { inProgressProspectStatuses, objectionLabels, prospectStatusLabels, type ProspectRecord } from "@/lib/prospects/types";

export const metadata: Metadata = { title: "Today" };

/** The plan is 8 to 10 personalised messages a day (CLAUDE.md, Outreach rules). */
const DAILY_TARGET = 8;
const AUDIT_BATCH = 5;

const nextForInProgress: Partial<Record<ProspectRecord["status"], string>> = {
  audit_booked: "Do the audit, then mark it done.",
  audit_done: "Send the proposal.",
  proposal: "Ask for a decision on the proposal.",
};

function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

function meta(prospect: ProspectRecord, ...extra: (string | null | false)[]) {
  return [prospect.category, prospect.area, ...extra].filter(Boolean).join(" · ");
}

async function enquiryNumbers() {
  try {
    const [counts, fresh] = await Promise.all([countEnquiriesWaiting(), listLeads({ status: "new" })]);
    return { ...counts, fresh: fresh.slice(0, 3) };
  } catch {
    return { new_enquiries: 0, not_summarised: 0, fresh: [] };
  }
}

export default async function TodayPage() {
  const [, overview, enquiries] = await Promise.all([requireInternalUser(), getOutboundOverview(), enquiryNumbers()]);
  const { today } = overview;
  const sentToday = sentInLastDays(overview.events, today, 1);
  const readyToSend = overview.ready.filter((prospect) => prospect.draft_first);
  const needsDraft = overview.ready.filter((prospect) => !prospect.draft_first);
  const inProgress = overview.prospects.filter((prospect) => inProgressProspectStatuses.includes(prospect.status));
  const dateLabel = new Intl.DateTimeFormat("en-MY", { timeZone: "Asia/Kuala_Lumpur", weekday: "long", day: "numeric", month: "long" }).format(new Date());

  // The single most useful thing, in the order /pipeline-review uses.
  const stillToReach = Math.max(0, DAILY_TARGET - sentToday - readyToSend.length - needsDraft.length);
  const thenAudit = stillToReach > 0 && overview.toAudit.length > 0 ? ` Then audit ${Math.min(stillToReach, overview.toAudit.length)} more.` : "";
  const first: { text: string; command?: string } =
    overview.due.length > 0 ? { text: `Send ${plural(overview.due.length, "follow-up")}. They take a few minutes.` }
    : overview.replied.length > 0 ? { text: overview.replied.length === 1 ? `Answer ${overview.replied[0].business_name}.` : `Answer ${overview.replied.length} replies.` }
    : readyToSend.length > 0 ? { text: (readyToSend.length === 1 ? `Send ${readyToSend[0].business_name}.` : `Send the ${readyToSend.length} messages that are ready.`) + thenAudit }
    : needsDraft.length > 0 ? { text: `Ask Claude to write ${plural(needsDraft.length, "message")}.`, command: "/outreach-message all audited" }
    : overview.toAudit.length > 0 ? { text: `Nothing is due. Audit the next ${Math.min(AUDIT_BATCH, overview.toAudit.length)} and send them.`, command: `/prospect-audit next ${AUDIT_BATCH}` }
    : { text: "Nothing is due today." };

  const empty: string[] = [];
  if (overview.due.length === 0) empty.push("no follow-ups due");
  if (overview.replied.length === 0) empty.push("no replies waiting");
  if (inProgress.length === 0) empty.push("nothing in progress");

  return (
    <>
      <PageHeader eyebrow={dateLabel} title="Today" />

      <div className="mt-6 grid gap-x-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div>
          <section aria-label="Do this first" className="bg-os-accent p-5 text-os-on-accent sm:p-6">
            <p className="text-[13px] opacity-85">Do this first</p>
            <p className="mt-1 text-pretty text-xl font-medium leading-snug sm:text-2xl">{first.text}</p>
            {first.command && <div className="mt-4 text-os-ink"><CommandCopy command={first.command} /></div>}
            <div className="mt-5 flex items-baseline justify-between text-[13px]">
              <span>Sent today</span>
              <span className="tabular">{sentToday} of {DAILY_TARGET}</span>
            </div>
            <div className="mt-1.5 h-1 bg-os-on-accent/25" role="img" aria-label={`${sentToday} of ${DAILY_TARGET} messages sent today`}>
              <div className="h-1 bg-os-on-accent" style={{ width: `${Math.min(100, (sentToday / DAILY_TARGET) * 100)}%` }} />
            </div>
            <p className="mt-3 text-[13px] opacity-85">
              {plural(overview.sentLast7Days, "message")} in the last 7 days.{overview.sentLast7Days < DAILY_TARGET && " The plan is 8 to 10 a day."}
            </p>
          </section>

          {overview.due.length > 0 && (
            <Section title="Follow-ups due" count={overview.due.length} hint="Send each one once, then tap Follow-up sent." href="/internal/prospects?view=due">
              <RowList>
                {overview.due.map((prospect) => (
                  <LinkRow
                    key={prospect.id}
                    href={`/internal/prospects/${prospect.id}`}
                    title={prospect.business_name}
                    meta={meta(prospect, prospect.draft_followup ? null : "no follow-up written")}
                    detail={prospect.next_follow_up === today ? "Due today" : `Due since ${formatDay(prospect.next_follow_up)}`}
                    detailTone="alert"
                  />
                ))}
              </RowList>
            </Section>
          )}

          {overview.replied.length > 0 && (
            <Section title="Replies waiting" count={overview.replied.length} hint="Answer them. If they want to see what you found, send their private link." href="/internal/prospects?view=replied">
              <RowList>
                {overview.replied.map((prospect) => (
                  <LinkRow
                    key={prospect.id}
                    href={`/internal/prospects/${prospect.id}`}
                    title={prospect.business_name}
                    meta={meta(prospect)}
                    detail={`Replied ${formatDay(prospect.last_contact)}${prospect.objection ? ` · ${objectionLabels[prospect.objection]}` : ""}`}
                    detailTone="accent"
                  />
                ))}
              </RowList>
            </Section>
          )}

          <Section title="Ready to send" count={readyToSend.length} hint="Open the Google listing once more, then send." href="/internal/prospects?view=ready">
            {readyToSend.length === 0 ? (
              <EmptyNote>{needsDraft.length > 0 ? "Nothing written yet. See below." : "Nothing ready. Audit the next few first."}</EmptyNote>
            ) : (
              <RowList>
                {readyToSend.map((prospect) => {
                  const problems = draftProblems(prospect.draft_first, "first");
                  const age = prospect.audit_date ? daysBetween(prospect.audit_date, today) : 0;
                  return (
                    <LinkRow
                      key={prospect.id}
                      href={`/internal/prospects/${prospect.id}`}
                      title={prospect.business_name}
                      meta={meta(prospect, prospect.draft_language === "ms" ? "Bahasa Melayu" : prospect.draft_language === "en" ? "English" : null, !prospect.whatsapp && "landline")}
                      detail={problems.length > 0 ? `The message breaks ${plural(problems.length, "rule")}. Fix it before sending.` : `Checked ${age === 0 ? "today" : `${formatDay(prospect.audit_date)}, ${plural(age, "day")} ago`}`}
                      detailTone={problems.length > 0 ? "alert" : "muted"}
                    />
                  );
                })}
              </RowList>
            )}
          </Section>

          {needsDraft.length > 0 && (
            <Section title="Needs a message" count={needsDraft.length} hint="Audited, with a real problem to open with. Ask Claude to write the message.">
              <RowList>
                {needsDraft.slice(0, 5).map((prospect) => (
                  <LinkRow key={prospect.id} href={`/internal/prospects/${prospect.id}`} title={prospect.business_name} meta={meta(prospect)} detail={prospect.top_finding} />
                ))}
              </RowList>
              <div className="mt-2"><CommandCopy command="/outreach-message all audited" /></div>
            </Section>
          )}

          {inProgress.length > 0 && (
            <Section title="In progress" count={inProgress.length} href="/internal/prospects?view=in_progress">
              <RowList>
                {inProgress.map((prospect) => (
                  <LinkRow
                    key={prospect.id}
                    href={`/internal/prospects/${prospect.id}`}
                    title={prospect.business_name}
                    meta={meta(prospect)}
                    aside={<Tag tone="solid">{prospectStatusLabels[prospect.status]}</Tag>}
                    detail={nextForInProgress[prospect.status]}
                  />
                ))}
              </RowList>
            </Section>
          )}

          {overview.goneQuiet.length > 0 && (
            <Section title="Gone quiet" count={overview.goneQuiet.length} hint="No reply after the follow-up. Mark them lost when you are sure.">
              <RowList>
                {overview.goneQuiet.map((prospect) => (
                  <LinkRow key={prospect.id} href={`/internal/prospects/${prospect.id}`} title={prospect.business_name} meta={meta(prospect)} detail={`Last contact ${formatDay(prospect.last_contact)}`} />
                ))}
              </RowList>
            </Section>
          )}

          {empty.length > 0 && <p className="mt-6 text-[13px] text-os-muted">Also today: {empty.join(", ")}.</p>}
        </div>

        <div>
          <Section title="Audit next" count={overview.toAudit.length} hint="Priority A first, then the fewest Google reviews." href="/internal/prospects?view=to_audit" className="lg:mt-0">
            {overview.toAudit.length === 0 ? (
              <EmptyNote>Everyone is audited. Ask Claude to find more businesses in a new area.</EmptyNote>
            ) : (
              <>
                <RowList>
                  {overview.toAudit.slice(0, AUDIT_BATCH).map((prospect) => (
                    <LinkRow
                      key={prospect.id}
                      href={`/internal/prospects/${prospect.id}`}
                      title={prospect.business_name}
                      meta={[prospect.category, `Priority ${prospect.priority}`, prospect.google_reviews != null ? plural(prospect.google_reviews, "review") : null, !prospect.whatsapp && "landline"].filter(Boolean).join(" · ")}
                    />
                  ))}
                </RowList>
                <div className="mt-2"><CommandCopy command={`/prospect-audit next ${AUDIT_BATCH}`} /></div>
              </>
            )}
          </Section>

          <Section title="Website enquiries" count={enquiries.new_enquiries} href="/internal/leads" linkLabel="All enquiries">
            {enquiries.fresh.length === 0 ? (
              <EmptyNote>No new enquiries.</EmptyNote>
            ) : (
              <>
                <RowList>
                  {enquiries.fresh.map((lead) => (
                    <LinkRow
                      key={lead.id}
                      href={`/internal/leads/${lead.id}`}
                      title={lead.business_name || lead.full_name}
                      meta={formatMoment(lead.created_at)}
                      aside={lead.ai_extraction ? undefined : <Tag tone="alert">Not summarised</Tag>}
                    />
                  ))}
                </RowList>
                {enquiries.not_summarised > 0 && (
                  <p className="mt-2 text-[13px] text-os-muted">Ask Claude in the chat app: &ldquo;summarise the new enquiries&rdquo;.</p>
                )}
              </>
            )}
          </Section>

          <Section title="Numbers" href="/internal/insights" linkLabel="Insights">
            <div className="bg-os-paper p-4 text-sm">
              <dl className="grid grid-cols-2 gap-y-3">
                <div><dt className="text-xs text-os-muted">Prospects</dt><dd className="tabular text-lg">{overview.total}</dd></div>
                <div><dt className="text-xs text-os-muted">Sent, last 7 days</dt><dd className="tabular text-lg">{overview.sentLast7Days}</dd></div>
                <div><dt className="text-xs text-os-muted">Replied</dt><dd className="tabular text-lg">{overview.replyRate.replied} of {overview.replyRate.messaged}</dd></div>
                <div><dt className="text-xs text-os-muted">Won</dt><dd className="tabular text-lg">{overview.counts.find((entry) => entry.status === "won")?.count ?? 0}</dd></div>
              </dl>
              <p className="mt-4 text-[13px] text-os-muted">
                Reply rates mean little before 20 messages. <Link href="/internal/insights" className="text-os-accent underline-offset-4 hover:underline">See Insights</Link>
              </p>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}
