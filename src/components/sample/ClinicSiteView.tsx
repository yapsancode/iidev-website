import { CalendarCheck, Clock3, MapPin, MessageCircle, Phone, Star, Stethoscope, UserRound } from "lucide-react";
import { clinicWords, type ClinicSite } from "@/lib/sample/clinic";

/** A small note under a section explaining what it does for the clinic. This is the selling part. */
function Why({ label, children }: { label: string; children: string }) {
  return (
    <p className="mt-4 border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
      <span className="font-bold">{label}: </span>
      {children}
    </p>
  );
}

/**
 * The sample clinic website. It deliberately looks like a clinic's own site, not like ours,
 * and always uses a light theme so it reads the same for everyone.
 */
export function ClinicSiteView({ site }: { site: ClinicSite }) {
  const t = clinicWords(site.language);
  const section = "mx-auto max-w-3xl px-5 py-10";
  const heading = "text-2xl font-bold tracking-tight text-slate-900";
  return (
    <div lang={site.language} className="min-h-screen bg-white font-sans text-slate-700">
      <p className="bg-slate-900 px-4 py-2 text-center text-xs leading-relaxed text-white">{site.notice}</p>

      <header className="bg-teal-50">
        <div className={section}>
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-800">
            <Stethoscope className="h-4 w-4" aria-hidden="true" />
            {site.area}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{site.name}</h1>
          <p className="mt-3 text-lg leading-relaxed">{site.tagline}</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Clock3 className="h-4 w-4 text-teal-700" aria-hidden="true" />
            {site.hours}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t.book}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-teal-700 px-5 py-3 text-sm font-bold text-teal-800">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {t.call}
            </span>
          </div>
          <Why label={t.whyLabel}>{t.why.hero}</Why>
        </div>
      </header>

      <section className={section}>
        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CalendarCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
            {t.bookingIntro}
          </p>
          <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-950">{t.bookingMessage(site.name)}</p>
          <Why label={t.whyLabel}>{t.why.booking}</Why>
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>{t.servicesTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {site.services.map((service) => (
            <li key={service} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
              {service}
            </li>
          ))}
        </ul>
        <Why label={t.whyLabel}>{t.why.services}</Why>
      </section>

      <section className="bg-slate-50">
        <div className={`${section} grid gap-8 sm:grid-cols-2`}>
          <div>
            <h2 className={heading}>{t.hoursTitle}</h2>
            <p className="mt-3 leading-relaxed">{site.hours}</p>
            <Why label={t.whyLabel}>{t.why.hours}</Why>
          </div>
          <div>
            <h2 className={heading}>{t.findTitle}</h2>
            <p className="mt-3 flex items-start gap-2 leading-relaxed">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
              {t.findBody(site.area)}
            </p>
            <Why label={t.whyLabel}>{t.why.find}</Why>
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>{t.doctorsTitle}</h2>
        <div className="mt-5 flex items-start gap-4 rounded-2xl border border-dashed border-slate-300 p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-slate-100">
            <UserRound className="h-6 w-6 text-slate-400" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed">{t.doctorsBody}</p>
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>{t.reviewsTitle}</h2>
        <div className="mt-5 flex items-start gap-4 rounded-2xl border border-dashed border-slate-300 p-5">
          <Star className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
          <p className="text-sm leading-relaxed">{t.reviewsBody}</p>
        </div>
        <Why label={t.whyLabel}>{t.why.reviews}</Why>
      </section>

      <section className={section}>
        <h2 className={heading}>{t.faqTitle}</h2>
        <dl className="mt-5 space-y-4">
          {t.faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-200 p-4">
              <dt className="font-bold text-slate-900">{faq.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed">{faq.a}</dd>
            </div>
          ))}
        </dl>
        <Why label={t.whyLabel}>{t.why.faq}</Why>
      </section>

      <footer className="bg-slate-900 px-5 py-8 text-center text-sm leading-relaxed text-slate-300">
        <p>{t.footer}</p>
        <p className="mt-2 text-xs text-slate-400">{site.notice}</p>
      </footer>
    </div>
  );
}
