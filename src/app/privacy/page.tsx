import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How IIDev Studio collects and uses enquiry information.",
};

const sections = [
  {
    en: "Information we collect",
    ms: "Maklumat yang kami kumpul",
    bodyEn: "When you submit an enquiry, we collect the details you provide such as your name, WhatsApp number, business name, email, budget, timeline, and project description. We also record basic source information such as the page and campaign that led to the enquiry.",
    bodyMs: "Apabila anda menghantar pertanyaan, kami mengumpul maklumat yang anda berikan seperti nama, nombor WhatsApp, nama perniagaan, e-mel, bajet, tempoh masa, dan penerangan projek. Kami juga merekod maklumat sumber asas seperti halaman dan kempen yang membawa kepada pertanyaan tersebut.",
  },
  {
    en: "How we use it",
    ms: "Cara kami menggunakannya",
    bodyEn: "We use this information to understand your request, assess whether our services may be suitable, prepare for a discovery conversation, and contact you about the enquiry. An AI-assisted tool may structure and summarise the information for internal review. A founder remains responsible for any client-facing decision.",
    bodyMs: "Kami menggunakan maklumat ini untuk memahami permintaan anda, menilai kesesuaian perkhidmatan kami, bersedia untuk perbincangan awal, dan menghubungi anda berkaitan pertanyaan tersebut. Alat berbantu AI mungkin menyusun dan meringkaskan maklumat untuk semakan dalaman. Pengasas kekal bertanggungjawab terhadap sebarang keputusan yang melibatkan pelanggan.",
  },
  {
    en: "Sharing and security",
    ms: "Perkongsian dan keselamatan",
    bodyEn: "We limit access to authorised iidev Studio founders and the service providers required to store and process the enquiry. We do not sell your personal data or use the form for autonomous marketing outreach. We apply access controls, audit records, and restricted server-side credentials.",
    bodyMs: "Kami mengehadkan akses kepada pengasas iidev Studio yang diberi kuasa serta penyedia perkhidmatan yang diperlukan untuk menyimpan dan memproses pertanyaan. Kami tidak menjual data peribadi anda atau menggunakan borang ini untuk pemasaran autonomi. Kami menggunakan kawalan akses, rekod audit, dan kelayakan pelayan yang terhad.",
  },
  {
    en: "Retention and your choices",
    ms: "Penyimpanan dan pilihan anda",
    bodyEn: "Closed leads marked lost or not suitable are scheduled for deletion after 12 months. Other inactive records are reviewed after 24 months. You may ask to access, correct, or delete your enquiry information by emailing team.iidevstudio@gmail.com.",
    bodyMs: "Lead yang ditutup sebagai tidak berjaya atau tidak sesuai dijadualkan untuk dipadam selepas 12 bulan. Rekod tidak aktif yang lain akan disemak selepas 24 bulan. Anda boleh meminta akses, pembetulan, atau pemadaman maklumat pertanyaan melalui e-mel team.iidevstudio@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f4f1e8] px-5 py-14 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:py-20">
      <article className="mx-auto max-w-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0_#10b981] dark:border-white dark:bg-neutral-900 sm:p-10">
        <Link href="/" className="font-mono text-xs font-bold uppercase text-emerald-700 underline dark:text-emerald-400">← IIDev Studio</Link>
        <h1 className="mt-7 font-sans text-4xl font-extrabold tracking-tight">Privacy Notice<br /><span className="text-emerald-600">Notis Privasi</span></h1>
        <p className="mt-5 font-sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Effective 30 August 2026 · Berkuat kuasa 30 Ogos 2026</p>
        <div className="mt-9 space-y-9">{sections.map((section) => <section key={section.en}><h2 className="font-sans text-xl font-bold">{section.en}<span className="mt-1 block text-base text-emerald-700 dark:text-emerald-400">{section.ms}</span></h2><p className="mt-3 font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{section.bodyEn}</p><p lang="ms" className="mt-3 font-sans text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{section.bodyMs}</p></section>)}</div>
        <div className="mt-10 border-t border-neutral-200 pt-6 font-sans text-sm dark:border-neutral-700"><strong>Contact / Hubungi</strong><a href="mailto:team.iidevstudio@gmail.com" className="mt-2 block text-emerald-700 underline dark:text-emerald-400">team.iidevstudio@gmail.com</a></div>
      </article>
    </main>
  );
}
