import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { PriorityBadge } from "@/components/internal/PriorityBadge";
import { formatMoment } from "@/components/internal/ProspectBits";
import { buttonClass, Facts, fieldClass, labelClass, Panel, Tag } from "@/components/internal/ui";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getLeadDetails } from "@/lib/leads/data";
import { budgetLabels, leadStatuses, statusLabels, timelineLabels, type ScoreBreakdown } from "@/lib/leads/types";
import { cn } from "@/lib/utils";
import { addLeadNote, assignLeadOwner, resendLeadTelegram, updateLeadStatus } from "../../../actions";

export const metadata: Metadata = { title: "Enquiry" };

const nextActionLabels: Record<string, string> = {
  schedule_discovery: "Book a discovery call",
  ask_clarifying_questions: "Ask what they need first",
  send_service_information: "Send the details of the right service",
  manual_review: "Read this one yourself",
  not_a_fit: "Check whether this is a fit",
};

const eventLabels: Record<string, string> = {
  lead_captured: "Enquiry received",
  ai_processing_started: "Summary started",
  ai_processing_completed: "Summary saved via Claude",
  ai_processing_failed: "Summary failed",
  telegram_sent: "Telegram alert sent",
  telegram_failed: "Telegram alert failed",
  telegram_not_configured: "Telegram is not set up",
  status_changed: "Status changed",
  owner_changed: "Owner changed",
  note_added: "Note added",
  ai_retry_requested: "Summary asked again",
  telegram_retry_requested: "Alert sent again",
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireInternalUser();
  const { id } = await params;
  const { lead, notes, events, users } = await getLeadDetails(id);
  if (!lead) notFound();
  const score = lead.score_breakdown as ScoreBreakdown | null;
  const whatsappUrl = `https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`;
  const scoreItems = score
    ? ([["Service fit", score.serviceFit, 30], ["Budget fit", score.budgetFit, 25], ["Timeline", score.timeline, 20], ["Clarity", score.clarity, 15], ["Complete", score.completeness, 10]] as const)
    : [];
  const name = lead.business_name || lead.full_name;

  return (
    <>
      <Link href="/internal/leads" className="inline-flex min-h-10 items-center gap-2 text-[13px] text-os-muted hover:text-os-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />Enquiries
      </Link>
      <header className="mt-2">
        <h1 className="text-balance font-os-display text-[2.5rem] leading-[0.95] tracking-[-0.02em] sm:text-5xl">{name}</h1>
        <p className="mt-2 text-[15px] text-os-muted">{[lead.business_name ? lead.full_name : null, lead.whatsapp, lead.email].filter(Boolean).join(" · ")}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tag tone="outline">{statusLabels[lead.status]}</Tag>
          {lead.ai_extraction ? <PriorityBadge priority={lead.priority} score={lead.lead_score} /> : <Tag tone="alert">Not summarised</Tag>}
        </div>
      </header>

      <div className="mt-6 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <section aria-labelledby="now-title" className="border-t-4 border-os-accent bg-os-paper p-4 sm:p-5">
            <p className="text-[13px] text-os-muted">Now</p>
            <h2 id="now-title" className="mt-0.5 text-xl font-medium leading-snug">
              {lead.status === "new" ? "Reply to them on WhatsApp" : lead.ai_extraction ? nextActionLabels[lead.ai_extraction.recommendedNextAction] : "Keep the conversation going"}
            </h2>
            <p className="mt-2 text-[15px] text-os-muted">
              {lead.ai_extraction
                ? `Suggested next step: ${nextActionLabels[lead.ai_extraction.recommendedNextAction].toLowerCase()}.`
                : "Not summarised yet. Ask Claude in the chat app to summarise the new enquiries. The summary and the score appear here."}
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className={buttonClass("primary", { full: true })}>
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />Open WhatsApp
              </a>
              {lead.status === "new" && (
                <form action={updateLeadStatus}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="status" value="contacted" />
                  <button className={buttonClass("secondary", { full: true })}>Mark contacted</button>
                </form>
              )}
            </div>
          </section>

          <Panel>
            <Facts
              items={[
                { label: "Service", value: lead.ai_extraction?.requestedServices.join(", ").replaceAll("_", " ") || lead.service_context || "Not known" },
                { label: "Budget", value: lead.budget ? budgetLabels[lead.budget] : "Not given" },
                { label: "Timeline", value: lead.timeline ? timelineLabels[lead.timeline] : "Not given" },
                { label: "Owner", value: lead.owner?.full_name || "Nobody yet" },
              ]}
            />
          </Panel>

          {lead.ai_extraction && (
            <Panel>
              <h2 className="text-base font-medium">Summary</h2>
              <p className="mt-2 text-[15px] leading-relaxed">{lead.ai_extraction.summary}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs text-os-muted">What they want</h3>
                  <ul className="mt-1 grid gap-1 text-sm">{lead.ai_extraction.businessGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
                </div>
                <div>
                  <h3 className="text-xs text-os-muted">What is not working</h3>
                  <ul className="mt-1 grid gap-1 text-sm">{lead.ai_extraction.painPoints.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </div>
            </Panel>
          )}

          {scoreItems.length > 0 && (
            <Panel>
              <div className="flex items-baseline justify-between">
                <h2 className="text-base font-medium">Score</h2>
                <span className="tabular font-os-display text-3xl">{lead.lead_score ?? "—"}</span>
              </div>
              <p className="mt-1 text-[13px] text-os-muted">Worked out by the website from the summary. Each part has a maximum.</p>
              <ul className="mt-4 grid gap-3">
                {scoreItems.map(([label, points, maximum]) => (
                  <li key={label} className="grid grid-cols-[96px_1fr_44px] items-center gap-3 text-[13px]">
                    <span className="text-os-muted">{label}</span>
                    <span className="h-2 bg-os-well"><span className="block h-2 bg-os-accent" style={{ width: `${Math.round((points / maximum) * 100)}%` }} /></span>
                    <span className="tabular text-right">{points}/{maximum}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel>
            <h2 className="text-base font-medium">What they wrote</h2>
            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed">{lead.raw_enquiry}</p>
            <p className="mt-4 text-xs text-os-muted">From {lead.source_page || "an unknown page"} · {formatMoment(lead.created_at)}</p>
          </Panel>
        </div>

        <aside className="grid content-start gap-6">
          <Panel>
            <h2 className="text-base font-medium">Status and owner</h2>
            <form action={updateLeadStatus} className="mt-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <label className={labelClass}>Status
                <select name="status" defaultValue={lead.status} className={fieldClass}>
                  {leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </label>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Update status</button>
            </form>
            <form action={assignLeadOwner} className="mt-4 border-t border-os-line pt-4">
              <input type="hidden" name="leadId" value={lead.id} />
              <label className={labelClass}>Owner
                <select name="ownerId" defaultValue={lead.owner_id || ""} className={fieldClass}>
                  <option value="">Nobody yet</option>
                  {users.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}
                </select>
              </label>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Set owner</button>
            </form>
            <form action={resendLeadTelegram} className="mt-4 border-t border-os-line pt-4">
              <input type="hidden" name="leadId" value={lead.id} />
              <button className={buttonClass("quiet", { small: true })}><Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />Send the Telegram alert again</button>
            </form>
          </Panel>

          <Panel>
            <form action={addLeadNote}>
              <input type="hidden" name="leadId" value={lead.id} />
              <label className={labelClass}>Add a note for the other founder
                <textarea name="body" required maxLength={4000} rows={3} className={fieldClass} placeholder="Called, will send the audit details tomorrow" />
              </label>
              <button className={cn(buttonClass("secondary", { full: true }), "mt-2")}>Add note</button>
            </form>
            {notes.length > 0 && (
              <ul className="mt-4 grid gap-3 border-t border-os-line pt-4">
                {notes.map((note) => (
                  <li key={note.id}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
                    <p className="mt-1 text-xs text-os-muted">{note.author?.full_name || "Founder"} · {formatMoment(note.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <h2 className="text-base font-medium">Timeline</h2>
            <ol className="mt-3 grid gap-3">
              {events.map((event) => (
                <li key={event.id} className={cn("border-l-2 pl-3", event.event_type.includes("failed") ? "border-os-alert" : "border-os-line")}>
                  <p className={cn("text-sm", event.event_type.includes("failed") && "text-os-alert")}>{eventLabels[event.event_type] || event.event_type.replaceAll("_", " ")}</p>
                  <p className="mt-0.5 text-xs text-os-muted"><time dateTime={event.created_at}>{formatMoment(event.created_at)}</time></p>
                </li>
              ))}
            </ol>
          </Panel>
        </aside>
      </div>
    </>
  );
}
