"use client";
import { motion } from "framer-motion";
import { WaveCanvas } from "../ui/wave-canvas";
import Link from "next/link";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Stable, crawlable <h1> — also the first line shown (slot-machine reveal).
const BRAND_LINE = "We Don't Just Build Websites, We Help Businesses Thrive.";

// Decorative taglines that rotate after the intro. EN + Malay on purpose.
const HEADLINE_PHRASES = [
  "Letsgo digital!!",
  "Built for the AI era.",
  "Your business, but louder online.",
  "Make your business impossible to ignore.",
  "Offline bagus. Online lagi bagus.",
  "Internetkan bisnes anda.",
  "Your next customer is already online.",
  "Website dulu. Growth kemudian.",
  "Built to click.",
  "The internet is your new storefront.",
  "Looks good. Loads fast. Gets found.",
  "Not just online. Proper online.",
  "Bring your business into the modern web.",
  "Digital presence matters now.",
  "Make your business feel alive online.",
  "Modern business starts online.",
  "Your business deserves internet presence.",
  "Optimized for Google, AI answers, and beyond.",
  "Where SEO meets modern AI search (AEO & GEO).",
  "Designed to rank, built to be answered.",
  "Get found on search engines and AI platforms.",
  "From SEO to AEO — built for how people search today.",
  "Visibility across Google, AI, and future search.",
  "Search-optimized. AI-ready. Business-focused.",
  "Built for rankings, answers, and conversions.",
  "Future-ready websites for SEO + AI search.",
  "Run your whole business in one place.",
  "Less spreadsheets. More system.",
  "Custom business systems, built local.",
  "From WhatsApp chaos to one clean system.",
  "Buang spreadsheet. Pakai sistem.",
  "Sistem bisnes, dibina khas untuk anda.",
  "Invois, stok, pelanggan — semua satu tempat.",
  "MyInvois-ready from day one.",
  "Stop running on spreadsheets and gut feel.",
  "Your business, finally organised.",
  "Not sure what's broken? Let's find out.",
  "Audit dulu. Baru fix.",
];

const AnimatedHeadline = dynamic(() => import("../ui/AnimatedHeadline"), {
  ssr: false,
  loading: () => (
    <h1 className="text-center text-6xl md:text-8xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]">
      {BRAND_LINE}
    </h1>
  ),
});

interface HeroProps {
  onBookingClick: () => void;
}

export function Hero({ onBookingClick }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-svh w-full overflow-hidden bg-[#FAFAFA] dark:bg-neutral-900"
    >
      {/* Canvas: Ensure it sits behind content (z-0) */}
      <div className="absolute inset-0 z-0">
        <WaveCanvas className="opacity-60" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute h-full w-full bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 pt-20">
        <div className="flex w-full max-w-5xl flex-col items-center text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div
              className={cn(
                "relative inline-flex -rotate-1 items-center gap-2 rounded-none",
                "border-2 border-black bg-white",
                "dark:border-white dark:bg-neutral-900",
                "px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest",
                "text-black dark:text-white",
                "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]",
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Accepting New Projects
            </div>
          </motion.div>

          {/* Main Typography */}
          <div className="relative z-10 mb-6 flex w-full flex-col items-center justify-center">
            <motion.div
              className={cn(
                "absolute -z-10 h-37.5 w-[300px] rounded-full pointer-events-none",
                "bg-blue-500/10 dark:bg-blue-500/20 blur-[100px]",
              )}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatedHeadline
                brandLine={BRAND_LINE}
                phrases={HEADLINE_PHRASES}
                className="text-6xl md:text-8xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className={cn(
              "mb-8 h-px w-32 md:w-64",
              "bg-gradient-to-r from-transparent via-black/20 to-transparent",
              "dark:via-white/40",
            )}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={cn(
              "mb-10 max-w-xl px-4 text-base font-medium leading-relaxed md:text-xl",
              "text-slate-600 dark:text-slate-400",
            )}
          >
            iidev Studio designs fast, search-ready websites for Malaysian
            service businesses — built to bring in more calls, bookings, and
            leads.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col gap-6 sm:flex-row items-center"
          >
            <button
              onClick={onBookingClick}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase"
            >
              Book Consultation
            </button>

            <Link
              href="/services"
              className="group relative h-12 w-48 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent transition-all active:scale-95 flex items-center justify-center"
            >
              <div className="absolute inset-0 translate-y-full bg-emerald-600 dark:bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 text-sm font-semibold tracking-wide text-neutral-900 dark:text-white transition-colors duration-300 group-hover:text-white dark:group-hover:text-black">
                View Services
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
