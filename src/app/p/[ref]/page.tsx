import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { ViewBeacon } from "@/components/preview/ViewBeacon";
import { getProspectByPreviewToken } from "@/lib/prospects/data";
import { PREVIEW_VIEW_DELAY_MS, tokenFromRef } from "@/lib/prospects/preview";
import { previewCopy } from "@/lib/prospects/preview-copy";
import { BRAND_NAME, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/site-config";
import { CARD_ACCENT, CARD_DARK, CARD_WHITE, LABEL, PRIMARY_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ref: string }> };

async function findProspect(ref: string) {
  const token = tokenFromRef(ref);
  return token ? getProspectByPreviewToken(token) : null;
}

function formatDate(date: string | null, language: string | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(language === "ms" ? "ms-MY" : "en-MY", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prospect = await findProspect((await params).ref);
  // Private page: never listed by search engines, whether or not the link is valid.
  const robots = { index: false, follow: false };
  if (!prospect) return { title: "Not found", robots };
  const copy = previewCopy(prospect.draft_language);
  const title = `${copy.preparedFor} ${prospect.business_name}`;
  const description = copy.checkedBy(formatDate(prospect.audit_date, prospect.draft_language));
  return { title, description, robots, openGraph: { title, description, siteName: BRAND_NAME, type: "website" } };
}

export default async function PreviewPage({ params }: Props) {
  const prospect = await findProspect((await params).ref);
  if (!prospect || !prospect.preview_token || !prospect.preview_findings) notFound();
  const copy = previewCopy(prospect.draft_language);
  const heading = "text-xl font-bold tracking-tight text-neutral-900 dark:text-white";
  const body = "leading-relaxed text-neutral-700 dark:text-neutral-300";
  const offerLink = `${WHATSAPP_URL}?text=${encodeURIComponent(copy.offerMessage(prospect.business_name))}`;

  return (
    <main id="main" lang={prospect.draft_language === "ms" ? "ms" : "en"} className="min-h-screen bg-[#FAFAFA] font-sans dark:bg-neutral-900">
      <ViewBeacon token={prospect.preview_token} delayMs={PREVIEW_VIEW_DELAY_MS} />
      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <p className={cn(LABEL, "text-neutral-600 dark:text-neutral-400")}>{BRAND_NAME}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {copy.preparedFor} {prospect.business_name}
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {copy.checkedBy(formatDate(prospect.audit_date, prospect.draft_language))}
        </p>
        <p className={cn(body, "mt-6")}>{copy.intro}</p>

        <section className="mt-10">
          <h2 className={heading}>{copy.findingsTitle}</h2>
          <ol className="mt-5 space-y-4">
            {prospect.preview_findings.map((finding, index) => (
              <li key={index} className={cn(CARD_WHITE, "p-5")}>
                <p className={cn(LABEL, "text-neutral-500 dark:text-neutral-400")}>{index + 1}</p>
                <p className="mt-2 font-semibold leading-relaxed text-neutral-900 dark:text-white">{finding.seen}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  <span className="font-bold">{copy.checkLabel}: </span>
                  {finding.check}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className={heading}>{copy.frustrationTitle}</h2>
          <p className={cn(body, "mt-3")}>{copy.frustrationLead}</p>
          <ul className="mt-4 space-y-3">
            {copy.frustrationPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className={body}>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className={heading}>{copy.optionsTitle}</h2>
          <dl className="mt-4 divide-y-2 divide-black border-2 border-black bg-white dark:divide-white dark:border-white dark:bg-neutral-800">
            {copy.options.map((option) => (
              <div key={option.name} className="p-4">
                <dt className="font-bold text-neutral-900 dark:text-white">{option.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{option.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className={heading}>{copy.questionsTitle}</h2>
          <dl className="mt-4 space-y-5">
            {copy.questions.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-neutral-900 dark:text-white">{item.q}</dt>
                <dd className={cn(body, "mt-1")}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={cn(CARD_ACCENT, "mt-12 p-5")}>
          <h2 className="font-bold">{copy.proofTitle}</h2>
          <p className="mt-2 leading-relaxed text-black/80">{copy.proof}</p>
        </section>

        <section className={cn(CARD_DARK, "mt-12 p-6")}>
          <h2 className="text-xl font-bold">{copy.offerTitle}</h2>
          <p className="mt-2 leading-relaxed text-neutral-200">{copy.offerLead}</p>
          <ul className="mt-4 space-y-2">
            {copy.offerPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-200">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <a href={offerLink} target="_blank" rel="noreferrer" className={cn(PRIMARY_BUTTON, "mt-6 w-full border-white text-center sm:w-auto")}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {copy.offerButton}
          </a>
        </section>

        <footer className="mt-12 border-t-2 border-black pt-6 text-sm leading-relaxed text-neutral-600 dark:border-white dark:text-neutral-400">
          <h2 className={cn(LABEL, "text-neutral-900 dark:text-white")}>{copy.whoTitle}</h2>
          <ul className="mt-3 space-y-1">
            {copy.who.map((line) => (
              <li key={line}>{line}</li>
            ))}
            <li>WhatsApp: {WHATSAPP_DISPLAY}</li>
          </ul>
          <p className="mt-4 font-semibold text-neutral-900 dark:text-white">{copy.stop}</p>
        </footer>
      </div>
    </main>
  );
}
