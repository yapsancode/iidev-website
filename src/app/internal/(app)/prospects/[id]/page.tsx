import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, ExternalLink, MessageCircle, MessageSquareReply, Pencil, Phone, Search, Send, StickyNote } from "lucide-react";
import { CopyButton } from "@/components/internal/CopyButton";
import { formatDay, ProspectPriorityBadge, ProspectStatusBadge, WebsiteStateBadge } from "@/components/internal/ProspectBits";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getProspect } from "@/lib/prospects/data";
import { isDue, isReadyToMessage, isToAudit, todayInMalaysia, whatsappLink } from "@/lib/prospects/rules";
import { prospectEventLabels, prospectStatuses, prospectStatusLabels, websiteStateLabels, type ProspectAction, type ProspectStatus } from "@/lib/prospects/types";
import { addProspectNote, runProspectAction, setProspectStatus } from "../../../prospect-actions";

export const metadata: Metadata = { title: "Prospect" };

const card = "rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900 sm:p-7";
const smallLabel = "font-sans text-[10px] text-neutral-400";

function ActionButton({ prospectId, action, tone, children }: { prospectId: string; action: ProspectAction; tone: "primary" | "plain"; children: React.ReactNode }) {
  const style = tone === "primary" ? "bg-emerald-600 text-white" : "bg-neutral-100 dark:bg-neutral-800";
  return (
    <form action={runProspectAction}>
      <input type="hidden" name="prospectId" value={prospectId} />
      <input type="hidden" name="action" value={action} />
      <button className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 font-sans text-xs font-bold ${style}`}>{children}</button>
    </form>
  );
}

function Draft({ title, text, link, language }: { title: string; text: string | null; link: string | null; language: string | null }) {
  if (!text) return null;
  return (
    <div className="mt-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans text-[10px] font-bold uppercase text-neutral-400">{title}{language ? ` · ${language === "ms" ? "Bahasa Melayu" : "English"}` : ""}</span>
        <span className="font-mono text-[10px] tabular-nums text-neutral-400">{text.trim().split(/\s+/).length} words</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {link && <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-[#ef6552] px-3 py-2.5 font-sans text-xs font-bold text-white"><MessageCircle className="h-3.5 w-3.5" />Open WhatsApp with this message</a>}
        <CopyButton text={text} label="Copy message" />
      </div>
    </div>
  );
}

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireInternalUser();
  const { id } = await params;
  const found = await getProspect(id);
  if (!found) notFound();
  const { prospect, events } = found;
  const today = todayInMalaysia();
  const due = isDue(prospect, today);
  const plainWhatsapp = whatsappLink(prospect.whatsapp);

  const nextStep =
    isToAudit(prospect) ? "Audit this business before sending anything."
    : prospect.status === "not_contacted" && !isReadyToMessage(prospect) ? "Audited, but no clear problem found. Low priority, or mark it not fit."
    : prospect.status === "not_contacted" && !prospect.draft_first ? "Ready to message. Ask Claude to write the message."
    : prospect.status === "not_contacted" ? "Ready. Send the first message, then tap Mark sent."
    : due ? "Follow-up is due. Send it once, then tap Follow-up sent."
    : prospect.status === "messaged" && prospect.next_follow_up ? `Waiting for a reply. Follow up on ${formatDay(prospect.next_follow_up)}.`
    : prospect.status === "messaged" ? "Follow-up already sent. If they stay silent, mark it lost."
    : prospect.status === "replied" ? "They replied. Answer their question, then offer the audit."
    : null;

  return (
    <>
      <Link href="/internal/prospects" className="inline-flex items-center gap-2 font-sans text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white"><ArrowLeft className="h-4 w-4" />All prospects</Link>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm dark:bg-neutral-900">
            <div className="h-1.5 bg-[#ef6552]" />
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2"><ProspectStatusBadge status={prospect.status} /><ProspectPriorityBadge priority={prospect.priority} /><WebsiteStateBadge state={prospect.website_state} /></div>
                  <h1 className="mt-4 font-sans text-3xl font-bold tracking-tight">{prospect.business_name}</h1>
                  <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">{prospect.category}{prospect.area ? ` · ${prospect.area}` : ""}</p>
                </div>
                <Link href={`/internal/prospects/${prospect.id}/edit`} className="inline-flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-4 py-3 font-sans text-xs font-bold dark:bg-neutral-800"><Pencil className="h-3.5 w-3.5" />Edit</Link>
              </div>
              {nextStep && <p className={`mt-5 rounded-2xl px-4 py-3 font-sans text-sm font-semibold ${due ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200" : "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{nextStep}</p>}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:grid-cols-4">
                <div><span className={smallLabel}>Phone</span><strong className="mt-1 block font-sans text-xs">{prospect.phone || "—"}{prospect.phone && !prospect.whatsapp ? " (landline)" : ""}</strong></div>
                <div><span className={smallLabel}>Google reviews</span><strong className="mt-1 block font-sans text-xs tabular-nums">{prospect.google_reviews != null ? prospect.google_reviews.toLocaleString("en-MY") : "—"}</strong></div>
                <div><span className={smallLabel}>Last contact</span><strong className="mt-1 block font-sans text-xs">{formatDay(prospect.last_contact)}</strong></div>
                <div><span className={smallLabel}>Next follow-up</span><strong className="mt-1 block font-sans text-xs">{formatDay(prospect.next_follow_up)}</strong></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {plainWhatsapp && <a href={plainWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 font-sans text-xs font-bold dark:bg-neutral-800"><MessageCircle className="h-3.5 w-3.5" />Open WhatsApp chat</a>}
                {prospect.phone && <a href={`tel:${prospect.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 font-sans text-xs font-bold dark:bg-neutral-800"><Phone className="h-3.5 w-3.5" />Call</a>}
                {prospect.website && <a href={prospect.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 font-sans text-xs font-bold dark:bg-neutral-800"><ExternalLink className="h-3.5 w-3.5" />Website</a>}
                <a href={`https://www.google.com/search?q=${encodeURIComponent(`${prospect.business_name} ${prospect.area || ""}`.trim())}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 font-sans text-xs font-bold dark:bg-neutral-800"><Search className="h-3.5 w-3.5" />Google listing</a>
              </div>
            </div>
          </section>

          <section className={card}>
            <h2 className="font-sans text-lg font-bold">Message</h2>
            {!prospect.draft_first && !prospect.draft_followup ? (
              <p className="mt-3 font-sans text-sm text-neutral-500 dark:text-neutral-400">No message written yet. In Claude Code, type <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">/outreach-message {prospect.business_name}</code>.</p>
            ) : (
              <>
                <p className="mt-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">The button opens WhatsApp with the text filled in. You still press send yourself.</p>
                <Draft title="First message" text={prospect.draft_first} link={whatsappLink(prospect.whatsapp, prospect.draft_first)} language={prospect.draft_language} />
                <Draft title="Follow-up, day 4" text={prospect.draft_followup} link={whatsappLink(prospect.whatsapp, prospect.draft_followup)} language={prospect.draft_language} />
                {!prospect.whatsapp && <p className="mt-3 font-sans text-xs text-neutral-500 dark:text-neutral-400">This number is a landline, so there is no WhatsApp button. Call, or use their contact form.</p>}
              </>
            )}
          </section>

          <section className={card}>
            <div className="flex items-end justify-between gap-3"><h2 className="font-sans text-lg font-bold">Audit</h2><span className="font-sans text-[11px] text-neutral-400">{prospect.audit_date ? `Checked ${formatDay(prospect.audit_date)}` : "Not audited"}</span></div>
            {!prospect.audit_date ? (
              <p className="mt-3 font-sans text-sm text-neutral-500 dark:text-neutral-400">In Claude Code, type <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">/prospect-audit {prospect.business_name}</code>.</p>
            ) : (
              <>
                <div className="mt-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950"><span className="font-sans text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Top finding</span><p className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed">{prospect.top_finding || "None recorded."}</p></div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div><span className={smallLabel}>Website</span><strong className="mt-1 block font-sans text-xs">{prospect.website_state ? websiteStateLabels[prospect.website_state] : "Not checked"}</strong></div>
                  <div><span className={smallLabel}>Mobile speed</span><strong className="mt-1 block font-sans text-xs tabular-nums">{prospect.mobile_score != null ? `${prospect.mobile_score}/100` : "Not checked"}</strong></div>
                  <div><span className={smallLabel}>Google profile</span><strong className="mt-1 block font-sans text-xs">{prospect.has_gbp == null ? "Not checked" : prospect.has_gbp ? "Has one" : "None found"}</strong></div>
                </div>
                {prospect.findings && <div className="mt-4"><span className={smallLabel}>Other findings</span><p className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{prospect.findings}</p></div>}
              </>
            )}
            {prospect.suggested_angle && <div className="mt-4"><span className={smallLabel}>Suggested angle</span><p className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{prospect.suggested_angle}</p></div>}
            {prospect.notes && <div className="mt-4"><span className={smallLabel}>Notes</span><p className="mt-1 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{prospect.notes}</p></div>}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900">
            <h2 className="font-sans text-sm font-bold">What happened?</h2>
            <div className="mt-4 grid gap-2">
              {prospect.status === "not_contacted" && <ActionButton prospectId={prospect.id} action="mark_sent" tone="primary"><Send className="h-3.5 w-3.5" />Mark sent</ActionButton>}
              {prospect.status === "messaged" && prospect.next_follow_up && <ActionButton prospectId={prospect.id} action="follow_up_sent" tone="primary"><Send className="h-3.5 w-3.5" />Follow-up sent</ActionButton>}
              {(prospect.status === "messaged" || prospect.status === "not_contacted") && <ActionButton prospectId={prospect.id} action="replied" tone="plain"><MessageSquareReply className="h-3.5 w-3.5" />They replied</ActionButton>}
              {prospect.status === "not_contacted" && <ActionButton prospectId={prospect.id} action="not_fit" tone="plain">Not a fit</ActionButton>}
            </div>
            <form action={setProspectStatus} className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label className={smallLabel}>Or set the status directly
                <select name="status" defaultValue={prospect.status} className="mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50">
                  {prospectStatuses.map((status) => <option key={status} value={status}>{prospectStatusLabels[status]}</option>)}
                </select>
              </label>
              <button className="mt-2 w-full rounded-xl bg-neutral-950 px-4 py-3 font-sans text-xs font-bold text-white dark:bg-white dark:text-neutral-950">Update status</button>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900">
            <h2 className="font-sans text-sm font-bold">Add a note</h2>
            <form action={addProspectNote} className="mt-4">
              <input type="hidden" name="prospectId" value={prospect.id} />
              <label><span className="sr-only">Note</span><textarea name="note" required maxLength={4000} rows={3} className="w-full resize-y rounded-xl bg-neutral-100 p-3 font-sans text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-800" placeholder="What they said, when to call back…" /></label>
              <button className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 font-sans text-xs font-bold text-white">Add note</button>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900">
            <h2 className="font-sans text-sm font-bold">Timeline</h2>
            <div className="mt-4 space-y-4">
              {events.map((event) => {
                const metadata = event.metadata as { from?: ProspectStatus; to?: ProspectStatus; body?: string; fields?: string[]; imported?: boolean };
                const Icon = event.event_type === "note_added" ? StickyNote : event.event_type.includes("sent") ? Send : event.event_type === "reply_logged" ? MessageSquareReply : event.event_type === "status_changed" ? Check : Clock3;
                const detail =
                  event.event_type === "status_changed" && metadata.to ? `${metadata.from ? prospectStatusLabels[metadata.from] : "?"} to ${prospectStatusLabels[metadata.to]}`
                  : event.event_type === "note_added" ? metadata.body
                  : event.event_type === "details_updated" && metadata.fields ? metadata.fields.join(", ").replaceAll("_", " ")
                  : metadata.imported ? "Carried over from the old tracker"
                  : null;
                return (
                  <div key={event.id} className="grid grid-cols-[32px_1fr] gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"><Icon className="h-3.5 w-3.5" /></span>
                    <div className="min-w-0">
                      <strong className="block font-sans text-xs">{prospectEventLabels[event.event_type] || event.event_type.replaceAll("_", " ")}</strong>
                      {detail && <p className="mt-1 whitespace-pre-wrap break-words font-sans text-xs text-neutral-600 dark:text-neutral-300">{detail}</p>}
                      <time className="mt-1 block font-sans text-[9px] text-neutral-400">{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(event.created_at))} · {event.actor === "claude" ? "Claude" : "Founder"}</time>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
