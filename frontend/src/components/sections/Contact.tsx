"use client";

import { type FormEvent, useEffect, useState } from "react";
import { contact, socials } from "@/data/portfolio";
import { API_URL, CONTACT_EMAIL } from "@/lib/site";
import { onReady } from "@/lib/ready";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import { ArrowUpRight } from "../Icons";
import Footer from "./Footer";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Render's free tier sleeps when idle — wake the API as soon as the page is ready
  // so the form is fast by the time someone scrolls down here.
  useEffect(() => {
    if (!API_URL) return;
    return onReady(() => {
      fetch(`${API_URL}/health`, { mode: "no-cors", cache: "no-store" }).catch(() => {});
    });
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setMessage("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 70_000);

    try {
      if (!API_URL) throw new Error("The contact service isn't configured yet.");
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(json?.error ?? "Something went wrong. Please try again.");
      setStatus("sent");
      setMessage("Message sent. I read every one — expect a reply soon.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof DOMException && err.name === "AbortError"
          ? "The server took too long to wake up. Please try again in a moment."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.titleWrap}>
          <Assemble
            from="left"
            end="top 62%"
            cursors={[
              { label: "type", color: CURSOR_COLORS.pink, end: "br" },
              { label: "motion", color: CURSOR_COLORS.green, end: "tl" },
            ]}
          >
            <h2 id="contact-title" className={styles.title}>
              {contact.title}
            </h2>
          </Assemble>
        </div>

        <p className={styles.lede}>{contact.lede}</p>
        <p className={styles.badge}>
          <span className={styles.live} aria-hidden="true" />
          {contact.availability}
        </p>

        <div className={styles.grid}>
          <Assemble
            from="up"
            radius={18}
            start="top 98%"
            end="top 66%"
            cursors={[{ label: "copy", color: CURSOR_COLORS.amber, end: "br" }]}
          >
            <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
              <div className={styles.field}>
                <label htmlFor="c-name">Your name</label>
                <input id="c-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
              </div>
              <div className={styles.field}>
                <label htmlFor="c-email">Email</label>
                <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={120} />
              </div>
              <div className={styles.field}>
                <label htmlFor="c-message">What are we building?</label>
                <textarea id="c-message" name="message" required minLength={10} maxLength={2000} />
              </div>
              {/* honeypot — real people never see or fill this */}
              <div className={styles.hp} aria-hidden="true">
                <label htmlFor="c-website">Website</label>
                <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" className={styles.submit} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
                <ArrowUpRight />
              </button>
              <p
                className={`${styles.status} ${status === "sent" ? styles.ok : ""} ${status === "error" ? styles.err : ""}`}
                role="status"
                aria-live="polite"
              >
                {status === "sending" ? "Waking the server — the first message can take up to a minute." : message}
              </p>
            </form>
          </Assemble>

          <div className={styles.links}>
            {CONTACT_EMAIL && (
              <div>
                <h3>Email</h3>
                <ul>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL} <ArrowUpRight />
                    </a>
                  </li>
                </ul>
              </div>
            )}
            <div>
              <h3>Elsewhere</h3>
              <ul>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer me">
                      {s.label} <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
