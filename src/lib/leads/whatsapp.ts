import { budgetLabels, timelineLabels, type LeadSubmission } from "./types";

export const IIDEV_WHATSAPP_NUMBER = "601133506561";

export function buildWhatsAppUrl(submission: Omit<LeadSubmission, "consent">): string {
  const lines = ["Hi IIDev Studio", "", `My name is ${submission.fullName}.`];
  if (submission.businessName) lines.push(`Business: ${submission.businessName}`);
  if (submission.serviceContext) lines.push(`I'm interested in: ${submission.serviceContext}`);
  if (submission.budget) lines.push(`Budget: ${budgetLabels[submission.budget]}`);
  if (submission.timeline) lines.push(`Timeline: ${timelineLabels[submission.timeline]}`);
  lines.push("", submission.enquiry.trim());
  return `https://wa.me/${IIDEV_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
