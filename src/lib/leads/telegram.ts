import type { LeadRecord } from "./types";
import { budgetLabels, timelineLabels } from "./types";
import { getSiteUrl } from "@/lib/cloudflare/env";

function escapeHtml(value: string): string {
  return value.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]!);
}

function formatLeadAlert(lead: LeadRecord, manualReview = false): string {
  const extraction = lead.ai_extraction;
  const heading = manualReview ? "⚠️ <b>NEW LEAD — MANUAL REVIEW</b>" : `🚨 <b>NEW LEAD — ${lead.priority.toUpperCase()}</b>`;
  const lines = [
    heading,
    "",
    `<b>${escapeHtml(lead.business_name || lead.full_name)}</b>`,
    escapeHtml(lead.full_name),
    `Score: <b>${lead.lead_score ?? "Pending"}/100</b>`,
  ];
  if (extraction?.requestedServices.length) lines.push(`Service: ${escapeHtml(extraction.requestedServices.join(", "))}`);
  if (lead.budget) lines.push(`Budget: ${escapeHtml(budgetLabels[lead.budget])}`);
  if (lead.timeline) lines.push(`Timeline: ${escapeHtml(timelineLabels[lead.timeline])}`);
  if (extraction?.summary) lines.push("", escapeHtml(extraction.summary));
  if (extraction?.recommendedNextAction) {
    lines.push("", `<b>Next:</b> ${escapeHtml(extraction.recommendedNextAction.replaceAll("_", " "))}`);
  }
  lines.push("", `<a href="${getSiteUrl()}/internal/leads/${lead.id}">Open secure lead record</a>`);
  return lines.join("\n");
}

export async function sendLeadTelegramAlert(lead: LeadRecord, manualReview = false) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { status: "not_configured" as const, error: null };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(6_000),
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLeadAlert(lead, manualReview),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) {
    const message = await response.text();
    return { status: "failed" as const, error: message.slice(0, 500) };
  }
  return { status: "sent" as const, error: null };
}
