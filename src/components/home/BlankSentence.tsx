"use client";

import type { FormEvent } from "react";
import { WHATSAPP_URL } from "@/lib/site-config";

/**
 * The closing sentence has a gap in it, and the gap is the form. The visitor
 * fills in their business and WhatsApp opens with the first message already
 * written, the same idea as the booking button we build for clients.
 *
 * Without JavaScript the form still opens WhatsApp, with only the typed words
 * as the message.
 */
export function BlankSentence() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const business = String(new FormData(event.currentTarget).get("text") ?? "").trim();
    if (!business) return;

    const message = `Hi IIDev Studio, I run ${business}. I'd like to talk about my website.`;
    window.open(
      `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <form action={WHATSAPP_URL} method="get" target="_blank" onSubmit={handleSubmit}>
      <h2 className="display blank-sentence" data-reveal>
        <span>
          I run{" "}
          <input
            type="text"
            name="text"
            required
            maxLength={80}
            autoComplete="organization"
            placeholder="a dental clinic in Bangi"
            aria-label="Your business and area"
          />
        </span>
        <span>
          Let&rsquo;s <button type="submit">talk</button>
        </span>
      </h2>
      <p className="blank-note" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
        This opens WhatsApp with your first message already written. You reach
        a founder, not a call centre.
      </p>
    </form>
  );
}
