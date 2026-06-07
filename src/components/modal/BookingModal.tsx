import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional context (e.g. the service page the user came from). Attached to the WhatsApp message. */
  service?: string;
}

const WHATSAPP_NUMBER = "60167093543";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Lock body scroll, manage focus, and wire up keyboard handlers while open.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => textareaRef.current?.focus(), 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = ["Hi iidev Studio 👋", ""];
    if (service) lines.push(`I'm interested in: ${service}`, "");
    lines.push(message.trim() || "I'd like to chat about a website for my business.");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            aria-describedby="booking-desc"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", damping: 24, stiffness: 360 }
            }
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-5"
          >
            <div className="relative rounded-none border-2 border-black bg-white shadow-[8px_8px_0px_0px_#10b981] dark:border-white dark:bg-neutral-900">
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-3 inline-block -rotate-1 bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white dark:bg-white dark:text-black">
                      Free consult
                    </span>
                    <h2
                      id="booking-title"
                      className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white"
                    >
                      Let&apos;s talk.
                    </h2>
                    <p
                      id="booking-desc"
                      className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                    >
                      Tell us what you need — we pick it up on WhatsApp, usually
                      within minutes. Happy to hop on a quick call if that&apos;s
                      easier.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-none border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-none"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Context tag (only when opened from a service page) */}
                {service && (
                  <div className="mb-5 inline-flex rotate-1 items-center gap-1.5 border-2 border-black bg-emerald-300 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-black dark:border-white">
                    <span className="opacity-60">About:</span>
                    <span>{service}</span>
                  </div>
                )}

                {/* Single field + action */}
                <form onSubmit={handleSend}>
                  <label
                    htmlFor="booking-message"
                    className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-white"
                  >
                    What does your business need?
                  </label>
                  <textarea
                    id="booking-message"
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="e.g. I run a dental clinic in PJ and need a website that brings in bookings."
                    className="w-full resize-none rounded-none border-2 border-black bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 placeholder-neutral-400 transition-all focus:border-emerald-500 focus:shadow-[4px_4px_0px_0px_#10b981] focus:outline-none dark:border-white dark:bg-neutral-950 dark:text-white dark:placeholder-neutral-500 dark:focus:border-emerald-400"
                  />

                  <button
                    type="submit"
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-none border-2 border-black bg-emerald-500 px-6 py-4 font-mono text-sm font-bold uppercase tracking-wide text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-emerald-400 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-none"
                  >
                    <WhatsAppIcon size={20} />
                    <span>Continue on WhatsApp</span>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
