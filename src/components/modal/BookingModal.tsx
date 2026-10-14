"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ArrowUpRight, Loader2, X } from "lucide-react";
import "@/components/site/site.css";
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
  // Phones start with the required fields only, so the submit button fits on screen.
  const [showOptional, setShowOptional] = useState(false);
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
  const optionalTag = <span className="muted">optional</span>;

  // Added to the end of <body>, outside the page, so it carries `site` itself.
  return createPortal(
    <div
      className="site booking"
      onMouseDown={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) onClose();
      }}
    >
      <div className="booking-center">
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-desc" className="booking-panel">
          <div className="booking-top">
            <div>
              <p className="booking-kicker">Free consultation</p>
              <h2 id="booking-title" className="display booking-title">Tell us what you need.</h2>
              <p id="booking-desc" className="booking-desc">We save your enquiry securely first, then continue the conversation on WhatsApp.</p>
            </div>
            <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close" className="booking-close"><X aria-hidden="true" /></button>
          </div>
          {service && <p className="booking-about"><span className="muted">About:</span> {service}</p>}
          <form onSubmit={handleSubmit}>
            <div className="booking-fields">
              <label className="booking-label">Your name *<input ref={firstFieldRef} required minLength={2} maxLength={100} autoComplete="name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} className="booking-field" placeholder="Aina" /></label>
              <label className="booking-label">WhatsApp number *<input required minLength={7} maxLength={30} type="tel" autoComplete="tel" value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className="booking-field" placeholder="+60 12-345 6789" /></label>
              <label className="booking-label booking-span">What does your business need? *<textarea required minLength={15} maxLength={4000} rows={3} value={form.enquiry} onChange={(event) => updateField("enquiry", event.target.value)} className="booking-field" placeholder="We run a dental clinic in Shah Alam and need a website that brings in bookings." /></label>
              {!showOptional && <button type="button" onClick={() => setShowOptional(true)} aria-expanded="false" aria-controls="booking-optional" className="link booking-more">+ Add more details (optional)</button>}
              {/* Folded on phones only; site.css always shows it on wider screens. */}
              <div id="booking-optional" className={showOptional ? "booking-optional" : "booking-optional is-folded"}>
                <label className="booking-label">Business name {optionalTag}<input maxLength={120} autoComplete="organization" value={form.businessName} onChange={(event) => updateField("businessName", event.target.value)} className="booking-field" placeholder="ABC Dental" /></label>
                <label className="booking-label">Email {optionalTag}<input maxLength={160} type="email" autoComplete="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="booking-field" placeholder="you@company.com" /></label>
                <label className="booking-label">Budget {optionalTag}<select value={form.budget} onChange={(event) => updateField("budget", event.target.value as BudgetBand | "")} className="booking-field"><option value="">Select a range</option>{budgetBands.map((budget) => <option key={budget} value={budget}>{budgetLabels[budget]}</option>)}</select></label>
                <label className="booking-label">Timeline {optionalTag}<select value={form.timeline} onChange={(event) => updateField("timeline", event.target.value as TimelineBand | "")} className="booking-field"><option value="">Select a timeline</option>{timelineBands.map((timeline) => <option key={timeline} value={timeline}>{timelineLabels[timeline]}</option>)}</select></label>
              </div>
            </div>
            <label className="sr-only" aria-hidden="true">Company website<input tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} /></label>
            <label className="booking-consent"><input required type="checkbox" checked={form.consent} onChange={(event) => updateField("consent", event.target.checked)} /><span>I agree that IIDev Studio may use these details to understand my enquiry and contact me. <a href="/privacy" target="_blank" className="link">Privacy notice</a>.</span></label>
            {error && <div role="alert" className="booking-error"><AlertCircle aria-hidden="true" />{error}</div>}
            <button type="submit" disabled={isSubmitting} className="btn booking-submit">
              {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" />Saving securely…</> : <><WhatsAppIcon size={20} />Save & continue on WhatsApp</>}
            </button>
            {fallbackUrl && <a href={fallbackUrl} className="link booking-fallback">Continue on WhatsApp without saving <ArrowUpRight aria-hidden="true" /></a>}
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
};
