"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ArrowUpRight, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { budgetBands, budgetLabels, timelineBands, timelineLabels, type BudgetBand, type TimelineBand } from "@/lib/leads/types";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";

interface BookingModalProps { isOpen: boolean; onClose: () => void; service?: string; }

interface FormState {
  fullName: string; businessName: string; whatsapp: string; email: string;
  budget: BudgetBand | ""; timeline: TimelineBand | ""; enquiry: string;
  consent: boolean; companyWebsite: string;
}

const initialForm: FormState = {
  fullName: "", businessName: "", whatsapp: "", email: "", budget: "",
  timeline: "", enquiry: "", consent: false, companyWebsite: "",
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, service }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const submissionIdRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) return onClose();
      if (event.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, isSubmitting, onClose]);

  function getSourceContext() {
    const url = new URL(window.location.href);
    const utm = Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
        .map((key) => [key, url.searchParams.get(key)])
        .filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    return { sourcePage: `${url.pathname}${url.search}`, referrer: document.referrer, utm };
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  }

  function getFallbackUrl(submissionId: string) {
    return form.fullName && form.whatsapp && form.enquiry
      ? buildWhatsAppUrl({
        submissionId,
        fullName: form.fullName, businessName: form.businessName || undefined,
        whatsapp: form.whatsapp, email: form.email || undefined,
        budget: form.budget || undefined, timeline: form.timeline || undefined,
        enquiry: form.enquiry, serviceContext: service,
      })
      : null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true); setError(null); setFallbackUrl(null);
    const submissionId = submissionIdRef.current || crypto.randomUUID();
    submissionIdRef.current = submissionId;
    const localFallbackUrl = getFallbackUrl(submissionId);
    const payload = {
      submissionId, fullName: form.fullName,
      businessName: form.businessName || undefined, whatsapp: form.whatsapp,
      email: form.email || undefined, budget: form.budget || undefined,
      timeline: form.timeline || undefined, enquiry: form.enquiry,
      consent: form.consent, companyWebsite: form.companyWebsite,
      serviceContext: service, ...getSourceContext(),
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string; fallbackWhatsappUrl?: string; whatsappUrl?: string };
      if (!response.ok) {
        setError(result.error || "We could not save your enquiry. Please try again.");
        setFallbackUrl(result.fallbackWhatsappUrl || localFallbackUrl);
        return;
      }
      setForm(initialForm); submissionIdRef.current = crypto.randomUUID();
      if (!result.whatsappUrl) throw new Error("Missing WhatsApp destination.");
      window.location.assign(result.whatsappUrl);
    } catch {
      setError("We could not reach the lead system. Your details are still here.");
      setFallbackUrl(localFallbackUrl);
    } finally { setIsSubmitting(false); }
  }

  if (!isOpen) return null;
  const fieldClass = "mt-2 w-full rounded-none border-2 border-black bg-white px-3 py-3 text-base font-sans font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:shadow-[3px_3px_0_#10b981] dark:border-white dark:bg-neutral-950 dark:text-white";
  const labelClass = "block font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-neutral-950/75 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-desc" className="my-2 w-full max-w-2xl sm:my-0">
          <div className="border-2 border-black bg-white shadow-[6px_6px_0_#10b981] dark:border-white dark:bg-neutral-900 sm:shadow-[8px_8px_0_#10b981]">
          <div className="p-5 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="mb-3 inline-block -rotate-1 bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white dark:bg-white dark:text-black">Free consultation</span>
                <h2 id="booking-title" className="font-sans text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Tell us what you need.</h2>
                <p id="booking-desc" className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">We save your enquiry securely first, then continue the conversation on WhatsApp.</p>
              </div>
              <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-white text-2xl text-black disabled:opacity-50 dark:border-white dark:bg-neutral-900 dark:text-white">×</button>
            </div>
            {service && <div className="mb-5 inline-flex border-2 border-black bg-emerald-300 px-3 py-1.5 font-mono text-[11px] font-bold uppercase text-black dark:border-white"><span className="mr-1 opacity-60">About:</span>{service}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>Your name *<input ref={firstFieldRef} required minLength={2} maxLength={100} autoComplete="name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={fieldClass} placeholder="Aina" /></label>
                <label className={labelClass}>Business name <span className="font-normal text-neutral-400">optional</span><input maxLength={120} autoComplete="organization" value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className={fieldClass} placeholder="ABC Dental" /></label>
                <label className={labelClass}>WhatsApp number *<input required minLength={7} maxLength={30} type="tel" autoComplete="tel" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className={fieldClass} placeholder="+60 12-345 6789" /></label>
                <label className={labelClass}>Email <span className="font-normal text-neutral-400">optional</span><input maxLength={160} type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={fieldClass} placeholder="you@company.com" /></label>
                <label className={labelClass}>Budget <span className="font-normal text-neutral-400">optional</span><select value={form.budget} onChange={(event) => updateField("budget", event.target.value as BudgetBand | "")} className={fieldClass}><option value="">Select a range</option>{budgetBands.map((budget) => <option key={budget} value={budget}>{budgetLabels[budget]}</option>)}</select></label>
                <label className={labelClass}>Timeline <span className="font-normal text-neutral-400">optional</span><select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value as TimelineBand | "")} className={fieldClass}><option value="">Select a timeline</option>{timelineBands.map((timeline) => <option key={timeline} value={timeline}>{timelineLabels[timeline]}</option>)}</select></label>
                <label className={`${labelClass} sm:col-span-2`}>What does your business need? *<textarea required minLength={15} maxLength={4000} rows={4} value={form.enquiry} onChange={(event) => updateField("enquiry", event.target.value)} className={`${fieldClass} resize-y`} placeholder="We run a dental clinic in Shah Alam and need a website that brings in bookings." /></label>
              </div>
              <label className="sr-only" aria-hidden="true">Company website<input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} /></label>
              <label className="mt-4 flex cursor-pointer items-start gap-3 font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-400"><input required type="checkbox" checked={form.consent} onChange={(event) => updateField("consent", event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" /><span>I agree that IIDev Studio may use these details to understand my enquiry and contact me. <a href="/privacy" target="_blank" className="font-bold text-emerald-700 underline dark:text-emerald-400">Privacy notice</a>.</span></label>
              {error && <div role="alert" className="mt-4 flex gap-2 border border-red-300 bg-red-50 p-3 font-sans text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
              <button type="submit" disabled={isSubmitting} className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-black bg-emerald-500 px-5 py-4 font-mono text-sm font-bold uppercase text-black shadow-[4px_4px_0_#000] transition hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-70 dark:border-white dark:shadow-[4px_4px_0_#fff]">
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Saving securely…</> : <><WhatsAppIcon size={20} />Save & continue on WhatsApp</>}
              </button>
              {fallbackUrl && <a href={fallbackUrl} className="mt-3 flex w-full items-center justify-center gap-2 px-4 py-3 font-sans text-sm font-bold text-neutral-700 underline dark:text-neutral-200">Continue on WhatsApp without saving <ArrowUpRight className="h-4 w-4" /></a>}
            </form>
          </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
