import Link from "next/link";
import { BADGE, PRIMARY_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { BookingButton } from "@/components/modal/BookingButton";
import AnimatedHeadline from "@/components/ui/AnimatedHeadline";
import { WaveCanvas } from "@/components/ui/wave-canvas";

// Stable, crawlable hero heading.
const BRAND_LINE = "We Don't Just Build Websites, We Help Businesses Thrive.";
const HEADLINE_PHRASES = [
  "Built for the AI era.",
  "Looks good. Loads fast. Gets found.",
] as const;

export function Hero() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-[#FAFAFA] dark:bg-neutral-900">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.18),transparent_45%)]" />
      <WaveCanvas className="opacity-60" />

      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute h-full w-full bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 pt-24 md:pt-20">
        <div className="flex w-full max-w-5xl flex-col items-center text-center">
          {/* Status Badge */}
          <div className="mb-8 md:animate-[hero-fade-up_0.8s_ease-out_both] motion-reduce:animate-none">
            <div className={cn(BADGE, "relative gap-2")}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Accepting New Projects
            </div>
          </div>

          {/* Main Typography */}
          <div className="relative z-10 mb-6 flex w-full flex-col items-center justify-center">
            <div
              className={cn(
                "absolute -z-10 hidden h-37.5 w-[300px] rounded-full pointer-events-none md:block",
                "bg-blue-500/10 dark:bg-blue-500/20 blur-[100px]",
                "md:animate-[hero-pulse_8s_ease-in-out_infinite] motion-reduce:animate-none",
              )}
            />

            <div className="w-full md:animate-[hero-scale-in_1s_0.1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none">
              <AnimatedHeadline
                brandLine={BRAND_LINE}
                phrases={HEADLINE_PHRASES}
                // On phones the size follows the screen width (about 41px on a
                // 375px phone, capped at 60px). That keeps the buttons below on
                // screen and makes the line breaks the same on every phone.
                className="text-[length:min(calc((100vw-2rem)*0.12),3.75rem)] font-extrabold leading-[1.1] tracking-tight text-black dark:text-white md:text-8xl"
              />
            </div>
          </div>

          <div
            className={cn(
              "mb-8 h-px w-32 md:w-64",
              "bg-gradient-to-r from-transparent via-black/20 to-transparent",
              "dark:via-white/40",
              "md:animate-[hero-line-in_1.5s_0.5s_ease-out_both] motion-reduce:animate-none",
            )}
          />

          <p
            className={cn(
              "mb-10 max-w-xl px-4 text-base font-medium leading-relaxed md:text-xl",
              "text-slate-600 dark:text-slate-400",
              "md:animate-[hero-fade-up_0.8s_0.6s_ease-out_both] motion-reduce:animate-none",
            )}
          >
            IIDev Studio designs fast, search-ready websites for Malaysian
            service businesses — built to bring in more calls, bookings, and
            leads.
          </p>

          <div className="flex flex-col gap-6 sm:flex-row items-center md:animate-[hero-fade-up_0.8s_0.8s_ease-out_both] motion-reduce:animate-none">
            <BookingButton className={PRIMARY_BUTTON}>
              Book a Free Call
            </BookingButton>

            <Link
              href="/services"
              className="group relative h-12 w-48 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent transition-all active:scale-95 flex items-center justify-center"
            >
              <div className="absolute inset-0 translate-y-full bg-emerald-600 dark:bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative z-10 text-sm font-semibold tracking-wide text-neutral-900 dark:text-white transition-colors duration-300 group-hover:text-white dark:group-hover:text-black">
                View Services
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
