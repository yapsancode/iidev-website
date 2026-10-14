import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CircleAlert, ExternalLink, MessageCircle, Phone, Search } from "lucide-react";
import { CommandCopy, CopyButton } from "@/components/internal/CopyButton";
import { formatDay, formatMoment, ProspectPriorityBadge, ProspectStatusBadge, WebsiteStateBadge } from "@/components/internal/ProspectBits";
import { buttonClass, Disclosure, Facts, fieldClass, labelClass, Panel, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getProspect } from "@/lib/prospects/data";
import { checkDraft, type DraftCheck, type DraftKind } from "@/lib/prospects/draft-check";
import { previewPath } from "@/lib/prospects/preview";
import { previewShareMessage } from "@/lib/prospects/preview-copy";
import { todayInMalaysia, whatsappLink } from "@/lib/prospects/rules";
import { daysBetween, journeyIndex, journeySteps, stageOf } from "@/lib/prospects/stage";
import {
  lostReasonLabels,
  lostReasons,
  objectionLabels,
  objections,
  prospectEventLabels,
  prospectStatuses,
  prospectStatusLabels,
  websiteStateLabels,
  type ProspectAction,
  type ProspectRecord,
  type ProspectStatus,
} from "@/lib/prospects/types";
import { isHealthcare } from "@/lib/sample/clinic";
import { absoluteUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import {
  addProspectNote,
  logProspectReply,
  markProspectLost,
  runProspectAction,
  setProspectObjection,
  setProspectPreview,
  setProspectStatus,
} from "../../../prospect-actions";

export const metadata: Metadata = { title: "Prospect" };

const languageLabel = (language: ProspectRecord["draft_language"]) => (language === "ms" ? "Bahasa Melayu" : language === "en" ? "English" : null);

function ActionButton({ prospectId, action, tone = "secondary", children }: { prospectId: string; action: ProspectAction; tone?: "primary" | "secondary"; children: React.ReactNode }) {
  return (
    <form action={runProspectAction}>
      <input type="hidden" name="prospectId" value={prospectId} />
      <input type="hidden" name="action" value={action} />
      <button className={buttonClass(tone, { full: true })}>{children}</button>
    </form>
  );
}

function StatusButton({ prospectId, status, children }: { prospectId: string; status: ProspectStatus; children: React.ReactNode }) {
  return (
    <form action={setProspectStatus}>
      <input type="hidden" name="prospectId" value={prospectId} />
      <input type="hidden" name="status" value={status} />
      <button className={buttonClass("secondary", { full: true })}>{children}</button>
    </form>
  );
}

function WhatsAppLink({ href, children, tone = "primary" }: { href: string; children: React.ReactNode; tone?: "primary" | "secondary" }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={buttonClass(tone, { full: true })}>
      <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      {children}
    </a>
  );
}

type CheckLine = Pick<DraftCheck, "ok" | "label"> & { id: string };

function Checklist({ checks }: { checks: CheckLine[] }) {
  return (
    <ul className="grid gap-1.5 text-[13px]">
      {checks.map((check) => (
        <li key={check.id} className={cn("flex items-start gap-2", check.ok ? "text-os-ink" : "text-os-alert")}>
          {check.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />}
          <span>{check.label}</span>
        </li>
      ))}
    </ul>
  );
}

function MessageText({ text }: { text: string }) {
  return <blockquote className="whitespace-pre-wrap bg-os-ground p-3 text-[15px] leading-relaxed">{text}</blockquote>;
}

/** "They replied": what they said and what held them back, saved in one step. */
function ReplyForm({ prospectId }: { prospectId: string }) {
  return (
    <details>
      <summary className={buttonClass("secondary", { full: true })}>They replied</summary>
      <form action={logProspectReply} className="mt-3 grid gap-3 bg-os-ground p-3">
        <input type="hidden" name="prospectId" value={prospectId} />
        <label className={labelClass}>What did they say? Optional
          <textarea name="note" rows={3} maxLength={4000} className={fieldClass} placeholder="Asked how much a website costs" />
        </label>
        <label className={labelClass}>What held them back? Only if they said it
          <select name="objection" defaultValue="" className={fieldClass}>
            <option value="">Nothing said</option>
            {objections.map((objection) => <option key={objection} value={objection}>{objectionLabels[objection]}</option>)}
          </select>
        </label>
        <button className={buttonClass("primary", { full: true })}>Save reply</button>
      </form>
    </details>
  );
}

function auditCheck(auditDate: string | null, today: string): CheckLine {
  const age = auditDate ? daysBetween(auditDate, today) : null;
  return age === 0
    ? { id: "audit_age", ok: true, label: "Audited today" }
    : { id: "audit_age", ok: false, label: `Audited ${formatDay(auditDate)}. Open the Google listing and check it is still true today.` };
}

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireInternalUser();
  const { id } = await params;
  const found = await getProspect(id);
  if (!found) notFound();
  const { prospect, events } = found;
  const today = todayInMalaysia();
  const stage = stageOf(prospect, today);
  const step = journeyIndex(stage, prospect.status);
  const name = prospect.business_name;

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${name} ${prospect.area || ""}`.trim())}`;
  const telUrl = prospect.phone ? `tel:${prospect.phone.replace(/[^\d+]/g, "")}` : null;
  const chatUrl = whatsappLink(prospect.whatsapp);
  const firstUrl = whatsappLink(prospect.whatsapp, prospect.draft_first);
  const followUpUrl = whatsappLink(prospect.whatsapp, prospect.draft_followup);
  const previewLink = previewPath(prospect);
  const previewUrl = previewLink ? absoluteUrl(previewLink) : null;
  const previewMessage = previewUrl ? previewShareMessage(prospect.draft_language, name, previewUrl) : null;
  const previewWhatsapp = previewMessage ? whatsappLink(prospect.whatsapp, previewMessage) : null;
  const hasFindings = Boolean(prospect.preview_findings?.length);

  const googleButton = (
    <a href={googleUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary", { full: true })}>
      <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />Google listing
    </a>
  );

  const createLinkForm = (
    <form action={setProspectPreview}>
      <input type="hidden" name="prospectId" value={prospect.id} />
      <input type="hidden" name="publish" value="yes" />
      <button className={buttonClass("primary", { full: true })}>Create the private link</button>
    </form>
  );

  // The one thing to do now, for the step this prospect is on.
  let now: { title: string; tone?: "accent" | "alert" | "plain"; body?: React.ReactNode; actions?: React.ReactNode };
  switch (stage) {
    case "stopped":
      now = { title: "Do not contact", tone: "alert", body: <p>They asked us to stop. Nothing more is drafted or sent to this business, and their preview page is closed.</p> };
      break;
    case "closed":
      now = {
        title: prospect.status === "won" ? "Won" : prospect.status === "not_fit" ? "Not a fit" : "Lost",
        tone: "plain",
        body: (
          <p className="text-os-muted">
            {prospect.status === "lost"
              ? prospect.lost_reason ? `Reason: ${lostReasonLabels[prospect.lost_reason]}.` : "No reason recorded. Pick one under Change status."
              : prospect.status === "won" ? "Start the project. Proof from this client can go in CLAUDE.md once they agree." : "Nothing more to do."}
          </p>
        ),
      };
      break;
    case "to_audit":
      now = {
        title: "Audit this business first",
        body: (
          <>
            <p className="text-os-muted">No audit, no message. In Claude Code, run:</p>
            <div className="mt-3"><CommandCopy command={`/prospect-audit ${name}`} /></div>
          </>
        ),
        actions: <>{googleButton}{prospect.website && <a href={prospect.website} target="_blank" rel="noreferrer" className={buttonClass("secondary", { full: true })}><ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />Website</a>}</>,
      };
      break;
    case "no_problem":
      now = {
        title: "Audited. No clear problem found",
        body: <p className="text-os-muted">Their website works on a phone and is easy to contact. Low priority: lead with the edge, not a rebuild, or mark it not a fit.</p>,
        actions: <ActionButton prospectId={prospect.id} action="not_fit">Not a fit</ActionButton>,
      };
      break;
    case "needs_draft":
      now = {
        title: "Ask Claude to write the message",
        body: (
          <>
            <p className="text-os-muted">The audit found a real problem to open with. Claude writes it in Bahasa Melayu and English, and you pick one.</p>
            <div className="mt-3"><CommandCopy command={`/outreach-message ${name}`} /></div>
          </>
        ),
      };
      break;
    case "ready":
      now = {
        title: "Send the first message",
        tone: "accent",
        body: (
          <div className="grid gap-4">
            <Checklist checks={[...checkDraft(prospect.draft_first || "", "first"), auditCheck(prospect.audit_date, today)]} />
            <MessageText text={prospect.draft_first || ""} />
            {!prospect.whatsapp && <p className="text-[13px] text-os-muted">This number is a landline, so there is no WhatsApp button. Call, or use their contact form or email.</p>}
          </div>
        ),
        actions: (
          <>
            {firstUrl ? <WhatsAppLink href={firstUrl}>Open WhatsApp with this message</WhatsAppLink> : telUrl && <a href={telUrl} className={buttonClass("primary", { full: true })}><Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />Call</a>}
            <ActionButton prospectId={prospect.id} action="mark_sent">Mark sent</ActionButton>
            {googleButton}
            {!firstUrl && <CopyButton text={prospect.draft_first || ""} label="Copy message" full />}
          </>
        ),
      };
      break;
    case "follow_up_due":
      now = {
        title: prospect.next_follow_up === today ? "Send the follow-up today" : `Follow-up due since ${formatDay(prospect.next_follow_up)}`,
        tone: "alert",
        body: prospect.draft_followup ? (
          <div className="grid gap-4">
            <Checklist checks={checkDraft(prospect.draft_followup, "follow_up")} />
            <MessageText text={prospect.draft_followup} />
          </div>
        ) : (
          <>
            <p className="text-os-muted">No follow-up written yet. In Claude Code, run:</p>
            <div className="mt-3"><CommandCopy command={`/outreach-message ${name}`} /></div>
          </>
        ),
        actions: (
          <>
            {followUpUrl && <WhatsAppLink href={followUpUrl}>Open WhatsApp with this message</WhatsAppLink>}
            <ActionButton prospectId={prospect.id} action="follow_up_sent">Follow-up sent</ActionButton>
            <ReplyForm prospectId={prospect.id} />
          </>
        ),
      };
      break;
    case "waiting":
      now = {
        title: "Waiting for a reply",
        body: <p className="text-os-muted">First message sent {formatDay(prospect.last_contact)}. If they stay silent, the follow-up is due on {formatDay(prospect.next_follow_up)}.</p>,
        actions: <ReplyForm prospectId={prospect.id} />,
      };
      break;
    case "follow_up_sent":
      now = {
        title: "Waiting for a reply",
        body: <p className="text-os-muted">The follow-up went out {formatDay(prospect.last_contact)}. That was the last message. If they stay silent, mark it lost.</p>,
        actions: (
          <>
            <ReplyForm prospectId={prospect.id} />
            <form action={markProspectLost}>
              <input type="hidden" name="prospectId" value={prospect.id} />
              <input type="hidden" name="reason" value="no_reply" />
              <button className={buttonClass("secondary", { full: true })}>Lost: no reply</button>
            </form>
          </>
        ),
      };
      break;
    case "replied":
      now = {
        title: "They replied. Answer them",
        tone: "accent",
        body: (
          <div className="grid gap-3 text-os-muted">
            {prospect.objection && <p>What held them back: <span className="text-os-ink">{objectionLabels[prospect.objection]}</span>. The playbook has an answer under Common questions.</p>}
            {previewUrl ? (
              <p>If they want to see what you found, send their private page. It carries the findings and the RM 500 audit offer.</p>
            ) : hasFindings ? (
              <p>If they want to see what you found, read the findings under Preview page. If every one is still true, create the private link.</p>
            ) : (
              <>
                <p>No preview page yet. Ask Claude to help with the answer, or to write the findings message:</p>
                <CommandCopy command={`/outreach-message ${name}`} />
              </>
            )}
            <form action={setProspectObjection} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label className={cn(labelClass, "min-w-0 flex-1")}>What held them back? Only if they said it
                <select name="objection" defaultValue={prospect.objection || ""} className={fieldClass}>
                  <option value="">Nothing said</option>
                  {objections.map((objection) => <option key={objection} value={objection}>{objectionLabels[objection]}</option>)}
                </select>
              </label>
              <button className={buttonClass("secondary")}>Save</button>
            </form>
          </div>
        ),
        actions: (
          <>
            {previewUrl && previewWhatsapp && <WhatsAppLink href={previewWhatsapp}>Open WhatsApp with the link</WhatsAppLink>}
            {!previewUrl && hasFindings && createLinkForm}
            {chatUrl && <WhatsAppLink href={chatUrl} tone={previewUrl || hasFindings ? "secondary" : "primary"}>Open WhatsApp chat</WhatsAppLink>}
            <StatusButton prospectId={prospect.id} status="audit_booked">Audit booked</StatusButton>
          </>
        ),
      };
      break;
    case "in_progress":
      now =
        prospect.status === "audit_booked" ? { title: "Audit booked. Do the audit", actions: <StatusButton prospectId={prospect.id} status="audit_done">Audit done</StatusButton> }
        : prospect.status === "audit_done" ? { title: "Send the proposal", actions: <StatusButton prospectId={prospect.id} status="proposal">Proposal sent</StatusButton> }
        : { title: "Waiting on the proposal", body: <p className="text-os-muted">Ask for a decision. If they say no, mark it lost with the reason under Change status.</p>, actions: <StatusButton prospectId={prospect.id} status="won">Won</StatusButton> };
      break;
  }

  const nowBorder = now.tone === "alert" ? "border-os-alert" : now.tone === "accent" ? "border-os-accent" : "border-os-ink";
  const timelineActor = (event: (typeof events)[number]) =>
    event.actor === "claude" ? "Claude"
    : event.actor === "prospect" ? "Someone with the link"
    : event.metadata.via === "claude" ? "Founder, via Claude"
    : "Founder";

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link href="/internal/prospects" className="inline-flex min-h-10 items-center gap-2 text-[13px] text-os-muted hover:text-os-ink">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />Prospects
        </Link>
        <Link href={`/internal/prospects/${prospect.id}/edit`} className={buttonClass("quiet", { small: true })}>Edit details</Link>
      </div>

      <header className="mt-2">
        <div className="min-w-0">
          <h1 className="text-balance font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] sm:text-5xl">{name}</h1>
          <p className="mt-2 text-[15px] text-os-muted">
            {[prospect.category, prospect.area, prospect.google_reviews != null ? `${prospect.google_reviews.toLocaleString("en-MY")} Google reviews` : null].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <ProspectStatusBadge status={prospect.status} />
            <ProspectPriorityBadge priority={prospect.priority} />
            <WebsiteStateBadge state={prospect.website_state} />
            {!prospect.whatsapp && prospect.phone && <Tag tone="outline">Landline</Tag>}
          </div>
        </div>
      </header>

      {step !== null && (
        <ol aria-label="Steps" className="mt-6 grid grid-cols-6 gap-1 text-center text-xs">
          {journeySteps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={cn("flex min-h-10 items-center justify-center px-1 leading-tight", index < step ? "bg-os-ink text-os-paper" : index === step ? "bg-os-accent text-os-on-accent" : "bg-os-well text-os-muted")}
            >
              <span className="sr-only">{index < step ? "Done: " : index === step ? "Now: " : "Later: "}</span>
              {label}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <section aria-labelledby="now-title" className={cn("border-t-4 bg-os-paper p-4 sm:p-5", nowBorder)}>
            <p className="text-[13px] text-os-muted">Now</p>
            <h2 id="now-title" className={cn("mt-0.5 text-xl font-medium leading-snug", now.tone === "alert" && "text-os-alert")}>{now.title}</h2>
            {now.body && <div className="mt-3 text-[15px]">{now.body}</div>}
            {now.actions && <div className="mt-4 grid gap-2 sm:grid-cols-2 [&>*:first-child]:sm:col-span-2">{now.actions}</div>}
          </section>

          <section aria-label="Contact" className="flex flex-wrap gap-2">
            {chatUrl && <a href={chatUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />WhatsApp chat</a>}
            {telUrl && <a href={telUrl} className={buttonClass("secondary", { small: true })}><Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />{prospect.phone}</a>}
            {prospect.website && <a href={prospect.website} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />Website</a>}
            <a href={googleUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><Search className="h-4 w-4" strokeWidth={1.75} aria-hidden />Google listing</a>
          </section>

          <Panel>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-medium">Audit</h2>
              <span className="text-[13px] text-os-muted">{prospect.audit_date ? `Checked ${formatDay(prospect.audit_date)}` : "Not audited"}</span>
            </div>
            {!prospect.audit_date ? (
              <p className="mt-2 text-sm text-os-muted">Nothing checked yet.</p>
            ) : (
              <>
                <p className="mt-3 border-l-2 border-os-accent pl-3 text-[15px] leading-relaxed">{prospect.top_finding || "No top finding recorded."}</p>
                <Facts
                  className="mt-4"
                  items={[
                    { label: "Website", value: prospect.website_state ? websiteStateLabels[prospect.website_state] : "Not checked" },
                    { label: "Mobile speed", value: prospect.mobile_score != null ? `${prospect.mobile_score} of 100` : "Not checked" },
                    { label: "Google profile", value: prospect.has_gbp == null ? "Not checked" : prospect.has_gbp ? "Has one" : "None found" },
                    { label: "Google reviews", value: prospect.google_reviews != null ? prospect.google_reviews.toLocaleString("en-MY") : "Not checked" },
                  ]}
                />
                {prospect.findings && <div className="mt-4"><h3 className="text-xs text-os-muted">Other findings</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{prospect.findings}</p></div>}
              </>
            )}
            {prospect.suggested_angle && <div className="mt-4"><h3 className="text-xs text-os-muted">Suggested angle</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{prospect.suggested_angle}</p></div>}
            {prospect.notes && <div className="mt-4"><h3 className="text-xs text-os-muted">Notes</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{prospect.notes}</p></div>}
          </Panel>

          <Disclosure
            title="Messages"
            meta={prospect.draft_first || prospect.draft_followup ? [languageLabel(prospect.draft_language), prospect.message_variant].filter(Boolean).join(" · ") || "Saved" : "None yet"}
          >
            {!prospect.draft_first && !prospect.draft_followup ? (
              <>
                <p className="text-sm text-os-muted">No message written yet. In Claude Code, run:</p>
                <div className="mt-3"><CommandCopy command={`/outreach-message ${name}`} /></div>
              </>
            ) : (
              <div className="grid gap-6">
                {([["First message", prospect.draft_first, "first", firstUrl], ["Follow-up, day 4", prospect.draft_followup, "follow_up", followUpUrl]] as const).map(([title, text, kind, url]) =>
                  text ? (
                    <div key={kind} className="grid gap-3">
                      <h3 className="text-sm font-medium">{title}</h3>
                      <Checklist checks={checkDraft(text, kind as DraftKind)} />
                      <MessageText text={text} />
                      <div className="flex flex-wrap gap-2">
                        {url && <a href={url} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />Open WhatsApp with this message</a>}
                        <CopyButton text={text} label="Copy message" />
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            )}
          </Disclosure>

          <Disclosure
            title="Preview page"
            open={stage === "replied"}
            meta={previewUrl ? `Link live · opened ${prospect.preview_views} ${prospect.preview_views === 1 ? "time" : "times"}` : hasFindings ? "No link yet" : "No findings yet"}
          >
            <p className="text-[13px] text-os-muted">A private page with their findings and the audit offer. Send the link only after they say yes. Never in the first message.</p>
            {!hasFindings ? (
              <>
                <p className="mt-3 text-sm text-os-muted">No findings written for the page yet. In Claude Code, run:</p>
                <div className="mt-3"><CommandCopy command={`/prospect-audit ${name}`} /></div>
              </>
            ) : (
              <>
                <ol className="mt-4 grid gap-3">
                  {prospect.preview_findings!.map((finding, index) => (
                    <li key={index} className="bg-os-ground p-3">
                      <p className="text-[15px] leading-relaxed">{index + 1}. {finding.seen}</p>
                      <p className="mt-1 text-[13px] text-os-muted">Check it yourself: {finding.check}</p>
                    </li>
                  ))}
                </ol>
                {previewUrl ? (
                  <>
                    <p className="mt-4 break-all bg-os-ground px-3 py-2.5 text-[13px] [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]">{previewUrl}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {previewWhatsapp && <a href={previewWhatsapp} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />Open WhatsApp with the link</a>}
                      <CopyButton text={previewUrl} label="Copy link" />
                      <a href={previewUrl} target="_blank" rel="noreferrer" className={buttonClass("secondary", { small: true })}><ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />Open page</a>
                    </div>
                    <Facts
                      className="mt-4 sm:grid-cols-3"
                      items={[
                        { label: "Times opened", value: <span className="tabular">{prospect.preview_views}</span> },
                        { label: "First opened", value: formatMoment(prospect.preview_first_viewed_at) },
                        { label: "Last opened", value: formatMoment(prospect.preview_last_viewed_at) },
                      ]}
                    />
                    <p className="mt-2 text-[13px] text-os-muted">
                      Your own visits count too. A reload within 30 minutes does not.
                      {prospect.status === "not_contacted" && prospect.preview_views > 0 && " Nothing has been sent yet, so these opens are almost certainly yours."}
                    </p>
                    {isHealthcare(prospect.category) && (
                      <p className="mt-3 text-[13px] text-os-muted">
                        {prospect.mockup ? <>The page also links to a sketch of their future website. <a href={`${previewUrl}/sketch`} target="_blank" rel="noreferrer" className="text-os-accent underline-offset-4 hover:underline">Open sketch</a></> : "No sketch of their future website yet. Ask Claude for one after they show interest."}
                      </p>
                    )}
                    <form action={setProspectPreview} className="mt-4">
                      <input type="hidden" name="prospectId" value={prospect.id} />
                      <input type="hidden" name="publish" value="no" />
                      <button className={buttonClass("quiet", { small: true })}>Remove the link</button>
                    </form>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-sm text-os-muted">Read the findings above. If every one is true today, create the link.</p>
                    <div className="mt-3 sm:max-w-xs">{createLinkForm}</div>
                  </>
                )}
              </>
            )}
          </Disclosure>
        </div>

        <aside className="grid content-start gap-6">
          <Panel>
            <h2 className="text-base font-medium">Timeline</h2>
            <ol className="mt-3 grid gap-3">
              {events.map((event) => {
                const metadata = event.metadata as { from?: ProspectStatus; to?: ProspectStatus; body?: string; fields?: string[]; imported?: boolean; objection?: string };
                const detail =
                  event.event_type === "status_changed" && metadata.to ? `${metadata.from ? prospectStatusLabels[metadata.from] : "?"} to ${prospectStatusLabels[metadata.to]}`
                  : event.event_type === "note_added" ? metadata.body
                  : event.event_type === "details_updated" && metadata.fields ? metadata.fields.join(", ").replaceAll("_", " ")
                  : event.event_type === "reply_logged" && metadata.objection ? `Held back by: ${objectionLabels[metadata.objection as keyof typeof objectionLabels] || metadata.objection}`
                  : metadata.imported ? "Carried over from the old tracker"
                  : null;
                const label = prospectEventLabels[event.event_type] || event.event_type.replaceAll("_", " ");
                return (
                  <li key={event.id} className="border-l-2 border-os-line pl-3">
                    <p className="text-sm">{label}</p>
                    {detail && <p className="mt-0.5 whitespace-pre-wrap break-words text-[13px] text-os-muted">{detail}</p>}
                    <p className="mt-0.5 text-xs text-os-muted">
                      <time dateTime={event.created_at}>{formatMoment(event.created_at)}</time> · {timelineActor(event)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Panel>

          <Panel>
            <form action={addProspectNote}>
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label className={labelClass}>Add a note
                <textarea name="note" required maxLength={4000} rows={3} className={fieldClass} placeholder="What they said, when to call back" />
              </label>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Add note</button>
            </form>
          </Panel>

          <Disclosure title="Change status" meta={prospectStatusLabels[prospect.status]}>
            <form action={setProspectStatus}>
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label className={labelClass}>Move to
                <select name="status" defaultValue={prospect.status === "lost" ? "not_contacted" : prospect.status} className={fieldClass}>
                  {prospectStatuses.filter((status) => status !== "lost").map((status) => <option key={status} value={status}>{prospectStatusLabels[status]}</option>)}
                </select>
              </label>
              <p className="mt-1.5 text-xs text-os-muted">Moving to Messaged sets the follow-up date, the same as Mark sent.</p>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Update status</button>
            </form>
            <form action={markProspectLost} className="mt-5 border-t border-os-line pt-4">
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label className={labelClass}>Lost? Say why
                <select name="reason" required defaultValue={prospect.lost_reason && prospect.lost_reason !== "asked_to_stop" ? prospect.lost_reason : ""} className={fieldClass}>
                  <option value="" disabled>Pick a reason</option>
                  {lostReasons.filter((reason) => reason !== "asked_to_stop").map((reason) => <option key={reason} value={reason}>{lostReasonLabels[reason]}</option>)}
                </select>
              </label>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Mark lost</button>
            </form>
          </Disclosure>

          {stage !== "stopped" && (
            <details className="bg-os-paper">
              <summary className="flex min-h-12 items-center px-4 py-3 text-sm text-os-alert sm:px-5">They asked us to stop</summary>
              <form action={markProspectLost} className="border-t border-os-line px-4 pb-5 pt-4 sm:px-5">
                <input type="hidden" name="prospectId" value={prospect.id} />
                <input type="hidden" name="reason" value="asked_to_stop" />
                <p className="text-sm">This closes {name} for good. No more drafts, no follow-up, and their preview page stops working. Send them one polite line of thanks first.</p>
                <button className={cn(buttonClass("danger", { full: true }), "mt-3")}>Never contact them again</button>
              </form>
            </details>
          )}
        </aside>
      </div>
    </>
  );
}
