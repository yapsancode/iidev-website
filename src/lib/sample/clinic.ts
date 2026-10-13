import { z } from "zod";

/**
 * The clinic website we show as a sample, and reuse as a sketch for one prospect.
 * Nothing here is a real clinic: no real doctors, reviews, photos or health claims.
 */
export type SampleLanguage = "en" | "ms";

/** What changes from one clinic to the next. Everything else is shared wording. */
export const mockupSchema = z
  .object({
    tagline: z.string().trim().min(1).max(120).optional(),
    services: z.array(z.string().trim().min(1).max(60)).min(1).max(8).optional(),
    hours: z.string().trim().min(1).max(120).optional(),
  })
  .strict();
export type Mockup = z.infer<typeof mockupSchema>;

export function parseMockup(raw: unknown): Mockup | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed = mockupSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export interface ClinicSite {
  language: SampleLanguage;
  name: string;
  area: string;
  tagline: string;
  services: string[];
  hours: string;
  /** A short line at the very top saying what this page is. */
  notice: string;
}

export interface ClinicWords {
  book: string;
  call: string;
  bookingIntro: string;
  bookingMessage: (name: string) => string;
  servicesTitle: string;
  hoursTitle: string;
  findTitle: string;
  findBody: (area: string) => string;
  doctorsTitle: string;
  doctorsBody: string;
  reviewsTitle: string;
  reviewsBody: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  whyLabel: string;
  why: { hero: string; booking: string; services: string; hours: string; find: string; reviews: string; faq: string };
  footer: string;
}

const words: Record<SampleLanguage, ClinicWords> = {
  en: {
    book: "Book on WhatsApp",
    call: "Call the clinic",
    bookingIntro: "On your website, this button opens WhatsApp with this message already written:",
    bookingMessage: (name) => `Hi ${name}, I would like to book an appointment. My name is ___ and I prefer ___ (day and time).`,
    servicesTitle: "What we treat",
    hoursTitle: "Opening hours",
    findTitle: "Where to find us",
    findBody: (area) => `In ${area}. Your address, a map and parking notes go here.`,
    doctorsTitle: "Your doctors",
    doctorsBody: "A photo, name and qualifications for each doctor go here. Patients like to see who they will meet.",
    reviewsTitle: "What patients say",
    reviewsBody: "Your real Google reviews go here. We never write reviews for you.",
    faqTitle: "Common questions",
    faqs: [
      { q: "Do I need an appointment?", a: "Your answer goes here. Walk-in or by booking, said plainly." },
      { q: "Which panels and insurance do you accept?", a: "Your list goes here, so patients do not have to call to ask." },
      { q: "How much is a consultation?", a: "Your price or price range goes here, if you want to show it." },
    ],
    whyLabel: "Why this is here",
    why: {
      hero: "A patient decides in a few seconds. The name, the area and the opening hours come first.",
      booking: "One tap to book. The message is already written, so the patient only fills in two blanks.",
      services: "These are the words patients type into Google. Each one can become its own page later.",
      hours: "The most common reason people call a clinic. Shown without scrolling far.",
      find: "Your area in plain words helps people nearby, and helps Google know where you are.",
      reviews: "Real reviews build trust faster than anything we could write.",
      faq: "Answers the questions your front desk repeats every day.",
    },
    footer: "Built to load fast on a phone. You own the domain, the hosting and the code.",
  },
  ms: {
    book: "Booking di WhatsApp",
    call: "Call klinik",
    bookingIntro: "Di website anda, butang ini buka WhatsApp dengan mesej ini yang sudah siap ditulis:",
    bookingMessage: (name) => `Hi ${name}, saya nak buat temujanji. Nama saya ___ dan saya pilih ___ (hari dan masa).`,
    servicesTitle: "Rawatan kami",
    hoursTitle: "Waktu operasi",
    findTitle: "Lokasi kami",
    findBody: (area) => `Di ${area}. Alamat, peta dan nota parking anda diletak di sini.`,
    doctorsTitle: "Doktor anda",
    doctorsBody: "Gambar, nama dan kelayakan setiap doktor diletak di sini. Pesakit suka tahu siapa yang akan mereka jumpa.",
    reviewsTitle: "Apa kata pesakit",
    reviewsBody: "Review Google sebenar anda diletak di sini. Kami tidak pernah tulis review untuk anda.",
    faqTitle: "Soalan lazim",
    faqs: [
      { q: "Perlu buat temujanji?", a: "Jawapan anda di sini. Walk-in atau booking, dalam ayat mudah." },
      { q: "Panel dan insurans apa yang diterima?", a: "Senarai anda di sini, supaya pesakit tidak perlu call untuk tanya." },
      { q: "Berapa caj konsultasi?", a: "Harga atau julat harga anda di sini, kalau mahu tunjuk." },
    ],
    whyLabel: "Kenapa ini di sini",
    why: {
      hero: "Pesakit buat keputusan dalam beberapa saat. Nama, kawasan dan waktu operasi datang dulu.",
      booking: "Satu tekan untuk booking. Mesej sudah siap, pesakit cuma isi dua tempat kosong.",
      services: "Ini perkataan yang pesakit taip di Google. Setiap satu boleh jadi halaman sendiri nanti.",
      hours: "Sebab paling biasa orang call klinik. Ditunjuk tanpa perlu scroll jauh.",
      find: "Kawasan anda dalam ayat mudah bantu orang berdekatan, dan bantu Google tahu lokasi anda.",
      reviews: "Review sebenar bina kepercayaan lebih cepat daripada apa yang kami boleh tulis.",
      faq: "Jawab soalan yang kaunter anda ulang setiap hari.",
    },
    footer: "Dibina untuk laju di telefon. Domain, hosting dan kod semuanya milik anda.",
  },
};

export function clinicWords(language: SampleLanguage): ClinicWords {
  return words[language];
}

const defaults: Record<SampleLanguage, Pick<ClinicSite, "tagline" | "services" | "hours">> = {
  en: {
    tagline: "Family clinic. Walk-ins welcome.",
    services: ["Fever, cough and flu", "Child health", "Health screening", "Vaccinations", "Minor injuries", "Chronic care follow-up"],
    hours: "Open daily, 8am to 10pm",
  },
  ms: {
    tagline: "Klinik keluarga. Walk-in dialu-alukan.",
    services: ["Demam, batuk dan selesema", "Kesihatan kanak-kanak", "Saringan kesihatan", "Vaksinasi", "Kecederaan ringan", "Rawatan susulan penyakit kronik"],
    hours: "Buka setiap hari, 8 pagi hingga 10 malam",
  },
};

/** The made-up clinic everyone can open. */
export function sampleClinic(language: SampleLanguage): ClinicSite {
  return {
    language,
    name: "Klinik Contoh",
    area: "Petaling Jaya",
    ...defaults[language],
    notice:
      language === "ms"
        ? "Website contoh oleh IIDev Studio. Klinik Contoh bukan klinik sebenar."
        : "A sample website by IIDev Studio. Klinik Contoh is not a real clinic.",
  };
}

/** The same site with one prospect's name and details. Anything not given stays a placeholder. */
export function mockupClinic(
  prospect: { business_name: string; area: string | null; draft_language: SampleLanguage | null },
  mockup: Mockup,
): ClinicSite {
  const language = prospect.draft_language === "ms" ? "ms" : "en";
  return {
    language,
    name: prospect.business_name,
    area: prospect.area || (language === "ms" ? "kawasan anda" : "your area"),
    tagline: mockup.tagline || defaults[language].tagline,
    services: mockup.services || defaults[language].services,
    hours: mockup.hours || defaults[language].hours,
    notice:
      language === "ms"
        ? `Lakaran untuk ${prospect.business_name} oleh IIDev Studio. Bukan website sebenar anda. Gambar dan ayat ialah contoh sahaja.`
        : `A sketch for ${prospect.business_name} by IIDev Studio. Not your final website. Pictures and words are placeholders.`,
  };
}

const HEALTHCARE_CATEGORIES = ["clinic", "dental", "physio"];

export function isHealthcare(category: string | null): boolean {
  return HEALTHCARE_CATEGORIES.includes((category || "").toLowerCase());
}
