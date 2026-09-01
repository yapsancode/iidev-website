import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Check, Clock3, MessageCircle, RefreshCw, Send, Sparkles, UserRound } from "lucide-react";
import { PriorityBadge } from "@/components/internal/PriorityBadge";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { getLeadDetails } from "@/lib/leads/data";
import { budgetLabels, leadStatuses, statusLabels, timelineLabels, type LeadRecord, type ScoreBreakdown } from "@/lib/leads/types";
import { addLeadNote, assignLeadOwner, resendLeadTelegram, retryLeadProcessing, updateLeadStatus } from "../../../actions";

const nextActionLabels: Record<string, string> = {
  schedule_discovery: "Schedule a discovery call",
  ask_clarifying_questions: "Ask clarifying questions",
  send_service_information: "Send relevant service information",
  manual_review: "Review this enquiry manually",
  not_a_fit: "Confirm whether this is a fit",
};

const eventLabels: Record<string, string> = {
  lead_captured: "Lead captured",
  ai_processing_started: "AI analysis started",
  ai_processing_completed: "AI analysis completed",
  ai_processing_failed: "AI analysis failed",
  telegram_sent: "Telegram alert sent",
  telegram_failed: "Telegram alert failed",
  telegram_not_configured: "Telegram is not configured",
  status_changed: "Lead status changed",
  owner_changed: "Lead owner changed",
  note_added: "Internal note added",
  ai_retry_requested: "AI retry requested",
  telegram_retry_requested: "Telegram retry requested",
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireInternalUser();
  const { id } = await params;
  const { lead: rawLead, notes, events, users } = await getLeadDetails(id);
  if (!rawLead) notFound();
  const lead = rawLead as LeadRecord & { owner?: { id: string; full_name: string; email: string } | null };
  const score = lead.score_breakdown as ScoreBreakdown | null;
  const whatsappUrl = `https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`;
  const scoreItems = score ? [
    ["Service fit", score.serviceFit, 30], ["Budget fit", score.budgetFit, 25],
    ["Timeline", score.timeline, 20], ["Clarity", score.clarity, 15],
    ["Completeness", score.completeness, 10],
  ] as const : [];

  return (
    <>
      <Link href="/internal/leads" className="inline-flex items-center gap-2 font-sans text-xs font-bold text-neutral-500 hover:text-neutral-950 dark:hover:text-white"><ArrowLeft className="h-4 w-4" />All leads</Link>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm dark:bg-neutral-900">
            <div className="h-1.5 bg-[#ef6552]" />
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><PriorityBadge priority={lead.priority} score={lead.lead_score} /><h1 className="mt-4 font-sans text-3xl font-bold tracking-tight">{lead.business_name || lead.full_name}</h1><p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">{lead.full_name} · {lead.whatsapp}{lead.email ? ` · ${lead.email}` : ""}</p></div><a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-[#ef6552] px-4 py-3 font-sans text-xs font-bold text-white"><MessageCircle className="h-4 w-4" />Open WhatsApp</a></div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-800 sm:grid-cols-4"><div><span className="font-sans text-[10px] text-neutral-400">Service</span><strong className="mt-1 block font-sans text-xs">{lead.ai_extraction?.requestedServices.join(", ").replaceAll("_", " ") || lead.service_context || "Unknown"}</strong></div><div><span className="font-sans text-[10px] text-neutral-400">Budget</span><strong className="mt-1 block font-sans text-xs">{lead.budget ? budgetLabels[lead.budget] : "Not provided"}</strong></div><div><span className="font-sans text-[10px] text-neutral-400">Timeline</span><strong className="mt-1 block font-sans text-xs">{lead.timeline ? timelineLabels[lead.timeline] : "Not provided"}</strong></div><div><span className="font-sans text-[10px] text-neutral-400">Owner</span><strong className="mt-1 block font-sans text-xs">{lead.owner?.full_name || "Unassigned"}</strong></div></div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900 sm:p-7"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-600" /><h2 className="font-sans text-lg font-bold">AI summary</h2></div>{lead.ai_extraction ? <><p className="mt-4 font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{lead.ai_extraction.summary}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800"><span className="font-sans text-[10px] font-bold uppercase text-neutral-400">Business goals</span><ul className="mt-2 space-y-1 font-sans text-xs">{lead.ai_extraction.businessGoals.map((goal) => <li key={goal}>• {goal}</li>)}</ul></div><div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800"><span className="font-sans text-[10px] font-bold uppercase text-neutral-400">Pain points</span><ul className="mt-2 space-y-1 font-sans text-xs">{lead.ai_extraction.painPoints.map((point) => <li key={point}>• {point}</li>)}</ul></div></div><div className="mt-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-950"><span className="font-sans text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Suggested next action</span><strong className="mt-1 block font-sans text-sm">{nextActionLabels[lead.ai_extraction.recommendedNextAction]}</strong></div></> : <div className="mt-4 flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-950 dark:text-amber-200"><AlertTriangle className="h-5 w-5 shrink-0" /><div><strong className="font-sans text-sm">Analysis unavailable</strong><p className="mt-1 font-sans text-xs">{lead.ai_error || "This lead is waiting to be processed."}</p></div></div>}</section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900 sm:p-7"><div className="flex items-end justify-between"><h2 className="font-sans text-lg font-bold">Qualification score</h2><strong className="font-sans text-3xl">{lead.lead_score ?? "—"}</strong></div>{scoreItems.length ? <div className="mt-5 space-y-4">{scoreItems.map(([label, value, maximum]) => <div key={label} className="grid grid-cols-[90px_1fr_42px] items-center gap-3"><span className="font-sans text-[10px] text-neutral-500">{label}</span><div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"><div className="h-full rounded-full bg-[#ef6552]" style={{ width: `${Math.round((value / maximum) * 100)}%` }} /></div><span className="text-right font-mono text-[10px]">{value}/{maximum}</span></div>)}</div> : <p className="mt-4 font-sans text-sm text-neutral-500">A score will appear after successful AI extraction.</p>}</section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900 sm:p-7"><h2 className="font-sans text-lg font-bold">Raw enquiry</h2><p className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{lead.raw_enquiry}</p><div className="mt-5 flex flex-wrap gap-2 font-sans text-[10px] text-neutral-400"><span>Source: {lead.source_page || "Unknown"}</span><span>·</span><span>Captured {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.created_at))}</span></div></section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900"><h2 className="font-sans text-sm font-bold">Founder controls</h2><form action={updateLeadStatus} className="mt-4"><input type="hidden" name="leadId" value={lead.id} /><label className="font-sans text-[10px] text-neutral-400">Status<select name="status" defaultValue={lead.status} className="mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm dark:bg-neutral-800">{leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label><button className="mt-2 w-full rounded-xl bg-neutral-950 px-4 py-3 font-sans text-xs font-bold text-white dark:bg-white dark:text-neutral-950">Update status</button></form><form action={assignLeadOwner} className="mt-4"><input type="hidden" name="leadId" value={lead.id} /><label className="font-sans text-[10px] text-neutral-400">Owner<select name="ownerId" defaultValue={lead.owner_id || ""} className="mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm dark:bg-neutral-800"><option value="">Unassigned</option>{users.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}</select></label><button className="mt-2 w-full rounded-xl bg-neutral-100 px-4 py-3 font-sans text-xs font-bold dark:bg-neutral-800">Assign owner</button></form><div className="mt-4 grid grid-cols-2 gap-2"><form action={retryLeadProcessing}><input type="hidden" name="leadId" value={lead.id} /><button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-2 py-3 font-sans text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200"><RefreshCw className="h-3.5 w-3.5" />Retry AI</button></form><form action={resendLeadTelegram}><input type="hidden" name="leadId" value={lead.id} /><button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-2 py-3 font-sans text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-200"><Send className="h-3.5 w-3.5" />Resend alert</button></form></div></section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900"><h2 className="font-sans text-sm font-bold">Internal notes</h2><form action={addLeadNote} className="mt-4"><input type="hidden" name="leadId" value={lead.id} /><textarea name="body" required maxLength={4000} rows={3} className="w-full resize-y rounded-xl bg-neutral-100 p-3 font-sans text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-800" placeholder="Add context for the other founder…" /><button className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-3 font-sans text-xs font-bold text-white">Add note</button></form><div className="mt-5 space-y-4">{notes.length === 0 ? <p className="font-sans text-xs text-neutral-400">No notes yet.</p> : notes.map((note) => <div key={note.id} className="border-t border-neutral-100 pt-4 dark:border-neutral-800"><p className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{note.body}</p><p className="mt-2 font-sans text-[9px] text-neutral-400">{note.author?.full_name || "Founder"} · {new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(note.created_at))}</p></div>)}</div></section>

          <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900"><h2 className="font-sans text-sm font-bold">Automation timeline</h2><div className="mt-4 space-y-4">{events.map((event) => <div key={event.id} className="grid grid-cols-[32px_1fr] gap-3"><span className={`grid h-8 w-8 place-items-center rounded-full ${event.event_type.includes("failed") ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"}`}>{event.event_type.includes("failed") ? <AlertTriangle className="h-3.5 w-3.5" /> : event.event_type.includes("telegram") ? <Send className="h-3.5 w-3.5" /> : event.event_type.includes("status") ? <Check className="h-3.5 w-3.5" /> : event.event_type.includes("owner") ? <UserRound className="h-3.5 w-3.5" /> : event.event_type.includes("ai") ? <Sparkles className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}</span><div><strong className="block font-sans text-xs">{eventLabels[event.event_type] || event.event_type.replaceAll("_", " ")}</strong><time className="mt-1 block font-sans text-[9px] text-neutral-400">{new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.created_at))}</time></div></div>)}</div></section>
        </aside>
      </div>
    </>
  );
}
