import { config } from "./config.js";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export class MailNotConfiguredError extends Error {}

/** Delivers a contact message through Resend's HTTP API (no SMTP — Render's free plan blocks it). */
export async function sendContactMail({ name, email, message }: ContactMessage): Promise<void> {
  if (!config.resendApiKey || !config.contactTo) {
    if (config.isProd) throw new MailNotConfiguredError("Email delivery is not configured");
    console.log("[dev] contact message (email not configured, not sent):", { name, email, message });
    return;
  }

  // Header values must not contain line breaks.
  const safeName = name.replace(/[\r\n]+/g, " ");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.contactFrom,
      to: [config.contactTo],
      reply_to: email,
      subject: `Portfolio message from ${safeName}`,
      text: `From: ${safeName} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(safeName)}</strong> &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 200)}`);
  }
}
