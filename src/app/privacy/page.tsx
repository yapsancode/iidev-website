import type { Metadata } from "next";
import { SitePage } from "@/components/site/chrome";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How IIDev Studio collects and uses enquiry information.",
  alternates: { canonical: "/privacy" },
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
    bodyEn: "We limit access to authorised IIDev Studio founders and the service providers required to store and process the enquiry. We do not sell your personal data or use the form for autonomous marketing outreach. We apply access controls, audit records, and restricted server-side credentials.",
    bodyMs: "Kami mengehadkan akses kepada pengasas IIDev Studio yang diberi kuasa serta penyedia perkhidmatan yang diperlukan untuk menyimpan dan memproses pertanyaan. Kami tidak menjual data peribadi anda atau menggunakan borang ini untuk pemasaran autonomi. Kami menggunakan kawalan akses, rekod audit, dan kelayakan pelayan yang terhad.",
  },
  {
    en: "Retention and your choices",
    ms: "Penyimpanan dan pilihan anda",
    bodyEn: `Closed leads marked lost or not suitable are scheduled for deletion after 12 months. Other inactive records are reviewed after 24 months. You may ask to access, correct, or delete your enquiry information by emailing ${CONTACT_EMAIL}.`,
    bodyMs: `Lead yang ditutup sebagai tidak berjaya atau tidak sesuai dijadualkan untuk dipadam selepas 12 bulan. Rekod tidak aktif yang lain akan disemak selepas 24 bulan. Anda boleh meminta akses, pembetulan, atau pemadaman maklumat pertanyaan melalui e-mel ${CONTACT_EMAIL}.`,
  },
];

export default function PrivacyPage() {
  return (
    <SitePage>
      <header className="wrap page-head">
        <h1 className="display page-title">
          Privacy Notice
          <span className="page-title-second">Notis Privasi</span>
        </h1>
        <p className="muted">Effective 30 August 2026 · Berkuat kuasa 30 Ogos 2026</p>
      </header>

      {sections.map((section) => (
        <section key={section.en} className="wrap cols part">
          <div className="part-head">
            <h2 className="display is-small">
              {section.en}
              <span className="page-title-second">{section.ms}</span>
            </h2>
          </div>
          <div className="part-body legal">
            <p>{section.bodyEn}</p>
            <p lang="ms" className="muted">
              {section.bodyMs}
            </p>
          </div>
        </section>
      ))}

      <section className="wrap cols part">
        <div className="part-head">
          <h2 className="display is-small">Contact / Hubungi</h2>
        </div>
        <div className="part-body">
          <a href={`mailto:${CONTACT_EMAIL}`} className="link link-line">
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </SitePage>
  );
}
