"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { sendToPalmPolish } from "@/lib/contact";

const TOPICS = ["I need a detail", "I'm a detailer", "I have space to host", "Partnership", "Something else"];

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError("");
    const res = await sendToPalmPolish({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      topic: String(fd.get("topic") || TOPICS[0]),
      message: String(fd.get("message") || ""),
      details: { ZIP: String(fd.get("zip") || "") },
      website: String(fd.get("website") || ""),
    });
    if (res.ok) {
      form.reset();
      setState("sent");
    } else {
      setError(res.error || "Something went wrong.");
      setState("error");
    }
  }

  const field = "w-full rounded-xl bg-white/[0.04] border border-[var(--border)] px-4 py-3 text-white placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--gold)]";
  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="eyebrow mb-4 text-center">Contact</div>
        <h2 className="serif text-3xl sm:text-4xl text-white text-center mb-3">Talk to Palm Polish</h2>
        <p className="text-center text-[var(--text-muted)] mb-8">
          Questions, detailer sign-ups or hosting a space. Or email{" "}
          <a className="text-[var(--gold)]" href="mailto:Contact@PalmPolish.com">Contact@PalmPolish.com</a>.
        </p>
        <form onSubmit={onSubmit} className="glass p-6 sm:p-8 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm text-[var(--text-body)]">Name<input name="name" required maxLength={100} autoComplete="name" className={field} /></label>
            <label className="grid gap-2 text-sm text-[var(--text-body)]">Email<input name="email" type="email" required maxLength={200} autoComplete="email" className={field} /></label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm text-[var(--text-body)]">Phone (optional)<input name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} /></label>
            <label className="grid gap-2 text-sm text-[var(--text-body)]">ZIP code (optional)<input name="zip" inputMode="numeric" maxLength={10} autoComplete="postal-code" className={field} /></label>
          </div>
          <label className="grid gap-2 text-sm text-[var(--text-body)]">Topic
            <select name="topic" className={field} defaultValue={TOPICS[0]}>
              {TOPICS.map((t) => <option key={t} className="text-black">{t}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-[var(--text-body)]">Message<textarea name="message" required minLength={5} maxLength={3000} rows={5} className={field} /></label>
          <div className="absolute -left-[9999px]" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <button type="submit" disabled={state === "sending"} className="btn-gold justify-center sm:justify-self-start">
            <Send className="w-4 h-4" /> {state === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" aria-live="polite" className={state === "error" ? "text-red-400 text-sm" : "text-emerald-400 text-sm"}>
            {state === "sent" ? "Thanks! Your message was sent. We'll reply by email soon." : state === "error" ? error : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
