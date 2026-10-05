import { Calendar } from "lucide-react";
import { BookingButton } from "@/components/modal/BookingButton";
import { PRIMARY_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function CTA() {
  return (
    <div
      id="contact"
      className="overflow-clip bg-[#FAFAFA] px-4 py-20 dark:bg-neutral-900 md:px-6 md:py-24"
      aria-labelledby="cta-heading"
    >
      <div className="lift-in mx-auto grid max-w-6xl gap-10 border-2 border-black bg-emerald-300 p-8 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] [--lift-by:6px] dark:border-white dark:bg-emerald-400 dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-12 lg:p-16">
        <div className="max-w-3xl">
          <div className="stamp mb-6 inline-flex -rotate-1 items-center border-2 border-black bg-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Start a conversation
          </div>
          <h2
            id="cta-heading"
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Ready for a website that works harder for your business?
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-black/75 md:text-xl">
            Book a free 15-minute call. We&apos;ll talk through what is not
            working, what you need next, and whether we are the right fit.
          </p>
        </div>

        {/* On the green panel the border and shadow stay black in dark mode too. */}
        <BookingButton
          className={cn(
            PRIMARY_BUTTON,
            "w-full px-7 py-4 tracking-wide md:w-auto md:whitespace-nowrap",
            "dark:border-black dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          )}
        >
          <Calendar size={18} aria-hidden="true" />
          Book a Free Call
        </BookingButton>
      </div>
    </div>
  );
}
