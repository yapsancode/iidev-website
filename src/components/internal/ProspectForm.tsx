import { toMalaysianMobile } from "@/lib/prospects/rules";
import {
  prospectCategories,
  prospectPriorities,
  prospectStatuses,
  prospectStatusLabels,
  websiteStateLabels,
  websiteStates,
  type ProspectRecord,
} from "@/lib/prospects/types";

const inputClass = "mt-1.5 w-full rounded-xl bg-neutral-100 px-3 py-3 font-sans text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-800";
const labelClass = "block font-sans text-[11px] font-semibold text-neutral-500 dark:text-neutral-400";
const sectionClass = "rounded-[2rem] bg-white p-5 shadow-sm dark:bg-neutral-900 sm:p-7";

/** Shared by "Add prospect" and "Edit prospect". Plain form fields, so it works without JavaScript. */
export function ProspectForm({
  action,
  prospect,
  error,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  prospect?: ProspectRecord;
  error?: string;
  submitLabel: string;
}) {
  const categories = prospect && !(prospectCategories as readonly string[]).includes(prospect.category)
    ? [...prospectCategories, prospect.category]
    : [...prospectCategories];
  const text = (value: string | number | null | undefined) => (value == null ? "" : String(value));
  // Only show a WhatsApp number when it is not simply the phone number.
  const separateWhatsapp = prospect?.whatsapp && prospect.whatsapp !== toMalaysianMobile(prospect.phone) ? prospect.whatsapp : "";

  return (
    <form action={action} className="mt-6 space-y-5">
      {prospect && <input type="hidden" name="prospectId" value={prospect.id} />}
      {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 font-sans text-sm text-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}

      <section className={sectionClass}>
        <h2 className="font-sans text-lg font-bold">The business</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>Business name<input name="business_name" required maxLength={160} defaultValue={text(prospect?.business_name)} className={inputClass} /></label>
          <label className={labelClass}>Type<select name="category" defaultValue={prospect?.category || "Other"} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className={labelClass}>Area<input name="area" maxLength={120} defaultValue={text(prospect?.area)} className={inputClass} placeholder="SS2, Damansara Jaya…" /></label>
          <label className={labelClass}>Phone on the Google listing<input name="phone" maxLength={40} inputMode="tel" defaultValue={text(prospect?.phone)} className={inputClass} placeholder="+60 12-345 6789" /></label>
          <label className={labelClass}>WhatsApp number, only if different<input name="whatsapp" maxLength={40} inputMode="tel" defaultValue={separateWhatsapp} className={inputClass} placeholder="Leave empty to use the phone" /></label>
          <label className={labelClass}>Google reviews<input name="google_reviews" type="number" min={0} step={1} inputMode="numeric" defaultValue={text(prospect?.google_reviews)} className={inputClass} /></label>
          <label className={labelClass}>Priority<select name="priority" defaultValue={prospect?.priority || "B"} className={inputClass}>{prospectPriorities.map((priority) => <option key={priority} value={priority}>{priority === "A" ? "A, healthcare first" : "B"}</option>)}</select></label>
          <label className={labelClass}>Status<select name="status" defaultValue={prospect?.status || "not_contacted"} className={inputClass}>{prospectStatuses.map((status) => <option key={status} value={status}>{prospectStatusLabels[status]}</option>)}</select></label>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="font-sans text-lg font-bold">Audit</h2>
        <p className="mt-1 font-sans text-xs text-neutral-500 dark:text-neutral-400">Only what was actually checked. Leave a field empty if it was not checked.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>Website<input name="website" type="url" maxLength={500} defaultValue={text(prospect?.website)} className={inputClass} placeholder="https://" /></label>
          <label className={labelClass}>Website state<select name="website_state" defaultValue={prospect?.website_state || ""} className={inputClass}><option value="">Not checked</option>{websiteStates.map((state) => <option key={state} value={state}>{websiteStateLabels[state]}</option>)}</select></label>
          <label className={labelClass}>Mobile speed score, 0 to 100<input name="mobile_score" type="number" min={0} max={100} step={1} inputMode="numeric" defaultValue={text(prospect?.mobile_score)} className={inputClass} /></label>
          <label className={labelClass}>Google Business Profile<select name="has_gbp" defaultValue={prospect?.has_gbp == null ? "" : prospect.has_gbp ? "yes" : "no"} className={inputClass}><option value="">Not checked</option><option value="yes">Has one</option><option value="no">None found</option></select></label>
          <label className={labelClass}>Audit date<input name="audit_date" type="date" defaultValue={text(prospect?.audit_date)} className={inputClass} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Top finding, the one problem to open with<textarea name="top_finding" rows={3} maxLength={1000} defaultValue={text(prospect?.top_finding)} className={inputClass} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Other findings<textarea name="findings" rows={3} maxLength={4000} defaultValue={text(prospect?.findings)} className={inputClass} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Suggested angle<textarea name="suggested_angle" rows={2} maxLength={1000} defaultValue={text(prospect?.suggested_angle)} className={inputClass} /></label>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="font-sans text-lg font-bold">Messages and follow-up</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={`${labelClass} sm:col-span-2`}>First message<textarea name="draft_first" rows={6} maxLength={2000} defaultValue={text(prospect?.draft_first)} className={inputClass} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Follow-up message<textarea name="draft_followup" rows={4} maxLength={2000} defaultValue={text(prospect?.draft_followup)} className={inputClass} /></label>
          <label className={labelClass}>Message language<select name="draft_language" defaultValue={prospect?.draft_language || ""} className={inputClass}><option value="">Not set</option><option value="ms">Bahasa Melayu</option><option value="en">English</option></select></label>
          <span />
          <label className={labelClass}>Last contact<input name="last_contact" type="date" defaultValue={text(prospect?.last_contact)} className={inputClass} /></label>
          <label className={labelClass}>Next follow-up<input name="next_follow_up" type="date" defaultValue={text(prospect?.next_follow_up)} className={inputClass} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Notes<textarea name="notes" rows={4} maxLength={8000} defaultValue={text(prospect?.notes)} className={inputClass} /></label>
        </div>
      </section>

      <button className="w-full rounded-2xl bg-neutral-950 px-5 py-4 font-sans text-sm font-bold text-white dark:bg-white dark:text-neutral-950 sm:w-auto">{submitLabel}</button>
    </form>
  );
}
