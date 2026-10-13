import type { DraftLanguage } from "./types";

/**
 * Words on the private preview page. Written once, shown to every prospect.
 * Each block does one pre-selling job: one path, past frustration, or belief.
 * Rules: no promise of a ranking or a date, no invented results, no criticism of anyone's agency.
 */
export interface PreviewCopy {
  preparedFor: string;
  checkedBy: (date: string) => string;
  intro: string;
  findingsTitle: string;
  checkLabel: string;
  frustrationTitle: string;
  frustrationLead: string;
  frustrationPoints: string[];
  optionsTitle: string;
  options: { name: string; detail: string }[];
  questionsTitle: string;
  questions: { q: string; a: string }[];
  proofTitle: string;
  /** Shown to clinics, dental and physio. */
  proofHealthcare: string[];
  /** Shown to every other kind of business. */
  proofOther: string[];
  cardLine: (count: number) => string;
  cardPrivate: string;
  offerTitle: string;
  offerLead: string;
  offerPoints: string[];
  offerButton: string;
  offerMessage: (business: string) => string;
  whoTitle: string;
  who: string[];
  stop: string;
}

const en: PreviewCopy = {
  preparedFor: "Prepared for",
  checkedBy: (date) => `Checked on ${date} by Isyraf, IIDev Studio`,
  intro: "You said I could share what I found. Here are the things a customer sees today. You can check each one yourself.",
  findingsTitle: "What a customer sees",
  checkLabel: "Check it yourself",
  frustrationTitle: "If a website has let you down before",
  frustrationLead:
    "Maybe you paid for a website once and nothing changed. When that happens, the cause is often one of three things. This is how we work instead.",
  frustrationPoints: [
    "It looked fine but was never built to be found. We start from the words your customers type into Google.",
    "You could not change anything yourself. With us you own the domain, the hosting and the code.",
    "The person who built it stopped replying. You talk to the two founders who build your site, nobody else.",
  ],
  optionsTitle: "Your options, side by side",
  options: [
    { name: "Leave it as it is", detail: "Costs nothing. The things above stay as they are." },
    {
      name: "Facebook or Instagram only",
      detail: "Good for people who already follow you. Someone searching Google for your service may never see it.",
    },
    {
      name: "Build it yourself",
      detail: "Cheap, and fine for some businesses. You pay the platform every month, and it takes your own time.",
    },
    {
      name: "A website built to be found",
      detail: "This is what we do. RM 1,000 to 6,000, paid once. You own it, and it is built around what your customers search for.",
    },
  ],
  questionsTitle: "Questions owners ask",
  questions: [
    {
      q: "Why pay for an audit when others quote for free?",
      a: "A free quote is a sales pitch. The audit is real work, written down, and you keep the report whether you hire us or not.",
    },
    {
      q: "Will I be number 1 on Google?",
      a: "Nobody honest can promise that, and be careful with anyone who does. We build the strongest base we can for what your customers search.",
    },
    {
      q: "What if I do not continue after the audit?",
      a: "That is fine. You keep the report and the plan. There is no pressure and no automatic charge.",
    },
  ],
  proofTitle: "Work we can show",
  proofHealthcare: [
    "A 24-hour clinic in Serdang. We built its website in October 2025: 7 pages, and WhatsApp booking with a ready-written message.",
  ],
  proofOther: [
    "A website for a 24-hour clinic in Serdang, built in October 2025: 7 pages, and WhatsApp booking with a ready-written message.",
    "KerjaKit, our own AI resume product, with more than 40 registered users.",
  ],
  cardLine: (count) => (count === 1 ? "One thing a customer sees today" : `${count} things a customer sees today`),
  cardPrivate: "Private page",
  offerTitle: "The next step: a full written audit",
  offerLead: "RM 500. Credited back in full if you start a project with us within 30 days.",
  offerPoints: [
    "A full review of your website: speed, phone experience, and how it looks to a customer",
    "Where visitors leave instead of calling or booking",
    "How easy you are to find on Google, and the gaps",
    "A fix list in plain language: what to fix first, what can wait, and why",
    "A short call so you understand the findings",
  ],
  offerButton: "Ask about the audit on WhatsApp",
  offerMessage: (business) => `Hi Isyraf, I saw the page you made for ${business}. Tell me more about the audit.`,
  whoTitle: "Who sent this",
  who: [
    "Isyraf, co-founder of IIDEV STUDIO (SSM Reg. 202603215168).",
    "We found your number on your public Google listing.",
    "This page is private. Only people with this link can open it, and Google does not list it.",
    "We count how many times this page is opened. Nothing else is tracked.",
  ],
  stop: "Do not want to hear from us? Reply \"no\" on WhatsApp and we will not message again.",
};

const ms: PreviewCopy = {
  preparedFor: "Disediakan untuk",
  checkedBy: (date) => `Disemak pada ${date} oleh Isyraf, IIDev Studio`,
  intro:
    "Terima kasih kerana benarkan saya share. Ini apa yang pelanggan nampak hari ini. Setiap satu boleh disemak sendiri.",
  findingsTitle: "Apa yang pelanggan nampak",
  checkLabel: "Semak sendiri",
  frustrationTitle: "Kalau website pernah mengecewakan",
  frustrationLead:
    "Mungkin pernah bayar untuk website, tapi tiada apa berubah. Selalunya puncanya salah satu daripada tiga perkara ini. Ini cara kami bekerja.",
  frustrationPoints: [
    "Nampak cantik, tapi tidak dibina untuk dijumpai. Kami mula daripada perkataan yang pelanggan taip di Google.",
    "Tidak boleh ubah apa-apa sendiri. Dengan kami, domain, hosting dan kod semuanya milik anda.",
    "Orang yang buat website berhenti membalas. Anda berurusan terus dengan dua pengasas yang bina website anda.",
  ],
  optionsTitle: "Pilihan anda, sebelah-menyebelah",
  options: [
    { name: "Biarkan seperti sekarang", detail: "Tiada kos. Perkara di atas kekal seperti itu." },
    {
      name: "Facebook atau Instagram sahaja",
      detail: "Bagus untuk orang yang sudah follow. Orang yang cari servis anda di Google mungkin tidak nampak.",
    },
    {
      name: "Bina sendiri",
      detail: "Murah, dan sesuai untuk sesetengah perniagaan. Bayar platform setiap bulan, dan guna masa anda sendiri.",
    },
    {
      name: "Website yang dibina untuk dijumpai",
      detail: "Ini kerja kami. RM 1,000 hingga 6,000, bayar sekali. Milik anda, dan dibina ikut apa yang pelanggan cari.",
    },
  ],
  questionsTitle: "Soalan yang pemilik selalu tanya",
  questions: [
    {
      q: "Kenapa bayar untuk audit kalau orang lain bagi quotation percuma?",
      a: "Quotation percuma ialah sales pitch. Audit ialah kerja sebenar yang bertulis, dan laporan itu milik anda walaupun tidak ambil kami.",
    },
    {
      q: "Boleh jamin nombor 1 di Google?",
      a: "Tiada siapa yang jujur boleh janji begitu, dan berhati-hati dengan yang berjanji. Kami bina asas yang paling kukuh untuk apa yang pelanggan anda cari.",
    },
    {
      q: "Kalau saya tidak teruskan selepas audit?",
      a: "Tiada masalah. Laporan dan pelan itu milik anda. Tiada paksaan dan tiada caj automatik.",
    },
  ],
  proofTitle: "Kerja yang boleh kami tunjuk",
  proofHealthcare: [
    "Sebuah klinik 24 jam di Serdang. Kami bina website klinik itu pada Oktober 2025: 7 halaman, dan booking WhatsApp dengan mesej yang sudah siap ditulis.",
  ],
  proofOther: [
    "Website untuk sebuah klinik 24 jam di Serdang, dibina pada Oktober 2025: 7 halaman, dan booking WhatsApp dengan mesej yang sudah siap ditulis.",
    "KerjaKit, produk resume AI kami sendiri, dengan lebih 40 pengguna berdaftar.",
  ],
  cardLine: (count) => `${count} perkara yang pelanggan nampak hari ini`,
  cardPrivate: "Halaman peribadi",
  offerTitle: "Langkah seterusnya: audit bertulis penuh",
  offerLead: "RM 500. Dikreditkan semula sepenuhnya jika anda mulakan projek dengan kami dalam 30 hari.",
  offerPoints: [
    "Semakan penuh website: kelajuan, pengalaman di telefon, dan rupa di mata pelanggan",
    "Di mana pelawat keluar tanpa call atau booking",
    "Semudah mana anda dijumpai di Google, dan apa yang kurang",
    "Senarai pembaikan dalam bahasa mudah: apa dulu, apa boleh tunggu, dan sebabnya",
    "Panggilan ringkas supaya anda faham dapatan itu",
  ],
  offerButton: "Tanya tentang audit di WhatsApp",
  offerMessage: (business) => `Hi Isyraf, saya dah tengok page untuk ${business}. Boleh terangkan tentang audit?`,
  whoTitle: "Siapa yang hantar",
  who: [
    "Isyraf, pengasas bersama IIDEV STUDIO (No. Pendaftaran SSM 202603215168).",
    "Kami jumpa nombor anda di listing Google anda yang terbuka kepada umum.",
    "Halaman ini peribadi. Hanya orang yang ada link ini boleh buka, dan Google tidak senaraikannya.",
    "Kami kira berapa kali halaman ini dibuka. Tiada perkara lain yang dijejak.",
  ],
  stop: "Tidak mahu dihubungi lagi? Balas \"tidak\" di WhatsApp dan kami tidak akan mesej lagi.",
};

const HEALTHCARE_CATEGORIES = ["clinic", "dental", "physio"];

/** Proof that fits the business: clinics see the clinic, others also see our own product. */
export function previewProof(copy: PreviewCopy, category: string | null): string[] {
  return HEALTHCARE_CATEGORIES.includes((category || "").toLowerCase()) ? copy.proofHealthcare : copy.proofOther;
}

export function previewCopy(language: DraftLanguage | null): PreviewCopy {
  return language === "ms" ? ms : en;
}

/** The one-line message that carries the link, sent after the prospect says yes. */
export function previewShareMessage(language: DraftLanguage | null, business: string, url: string): string {
  return language === "ms"
    ? `Terima kasih. Ini apa yang saya jumpa untuk ${business}:\n${url}`
    : `Thanks. Here is what I found for ${business}:\n${url}`;
}
