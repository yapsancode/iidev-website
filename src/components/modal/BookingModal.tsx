import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";

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
    lines.push(
      message.trim() ||
        "I'd like to chat about a website for my business."
    );

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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            aria-describedby="booking-desc"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

              <div className="p-7 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2
                      id="booking-title"
                      className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                    >
                      Let's talk.
                    </h2>
                    <p
                      id="booking-desc"
                      className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400"
                    >
                      Tell us what you need and we'll pick it up on WhatsApp —
                      usually within minutes. Happy to hop on a quick call if
                      that's easier.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="-mr-2 -mt-1 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Context chip (only when opened from a service page) */}
                {service && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    About: <span className="font-semibold">{service}</span>
                  </div>
                )}

                {/* Single field + action */}
                <form onSubmit={handleSend}>
                  <label
                    htmlFor="booking-message"
                    className="mb-2 block text-xs font-bold uppercase tracking-wide text-neutral-900 dark:text-white"
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
                    className="w-full resize-none rounded-xl border border-transparent bg-neutral-50 px-4 py-3 font-medium text-neutral-900 placeholder-neutral-400 transition-all hover:bg-neutral-100 focus:border-neutral-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-neutral-100 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:hover:bg-neutral-700/60 dark:focus:border-neutral-700 dark:focus:bg-neutral-800 dark:focus:ring-neutral-800"
                  />

                  <button
                    type="submit"
                    className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:scale-[1.01] hover:bg-emerald-500 active:scale-[0.98]"
                  >
                    <MessageCircle size={20} />
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
