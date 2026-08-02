"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { site } from "@/lib/site";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Contact] ${form.subject || "Website enquiry"} — ${site.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-[26rem] flex-col items-center justify-center rounded-2xl border border-tech-500/30 bg-tech-500/5 p-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-tech-500/15 text-tech-600">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h3 className="mt-5 text-xl font-bold text-navy-900">Message ready in your email client</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
          Your message has been prepared. Send it from your email app and our team will get back to you. You can
          also reach us directly at {site.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className={inputClass}
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 00000 00000"
            className={inputClass}
          />
        </Field>
        <Field label="Subject">
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            placeholder="How can we help?"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Message">
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us about your project, training or internship requirement..."
          className={`${inputClass} resize-none`}
        />
      </Field>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tech-500 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition-all hover:bg-tech-400 sm:w-auto"
      >
        Send Message <Send className="size-4" aria-hidden />
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-tech-500 focus:outline-none focus:ring-2 focus:ring-tech-500/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-navy-900">{label}</span>
      {children}
    </label>
  );
}
