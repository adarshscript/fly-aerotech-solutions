"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  Hash,
  Image as ImageIcon,
  KeyRound,
  Loader2,
  MapPin,
  Plus,
  Save,
  Share2,
  Trash2,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateCompanyAction, type CompanyFormState } from "@/app/admin/actions";
import type { ICompany } from "@/models";

const initialState: CompanyFormState = {};

interface FormState {
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  website: string;
  address: { line1: string; line2: string; city: string; state: string; pincode: string; country: string };
  msmeNumber: string;
  udyamNumber: string;
  establishedYear: number;
  workingHours: string;
  copyright: string;
  mapEmbedUrl: string;
  socialLinks: { linkedin: string; instagram: string; twitter: string; facebook: string; youtube: string; github: string };
  footer: { about: string; quickLinks: { label: string; href: string }[] };
  seo: { title: string; description: string; keywords: string };
}

function fromCompany(company: ICompany | null): FormState {
  return {
    name: company?.name ?? "",
    tagline: company?.tagline ?? "",
    logo: company?.logo ?? "/logo.jpg",
    favicon: company?.favicon ?? "/favicon.png",
    email: company?.email ?? "",
    phone: company?.phone ?? "",
    website: company?.website ?? "",
    address: {
      line1: company?.address?.line1 ?? "",
      line2: company?.address?.line2 ?? "",
      city: company?.address?.city ?? "",
      state: company?.address?.state ?? "",
      pincode: company?.address?.pincode ?? "",
      country: company?.address?.country ?? "",
    },
    msmeNumber: company?.msmeNumber ?? "",
    udyamNumber: company?.udyamNumber ?? "",
    establishedYear: company?.establishedYear ?? new Date().getFullYear(),
    workingHours: company?.workingHours ?? "",
    copyright: company?.copyright ?? "",
    mapEmbedUrl: company?.mapEmbedUrl ?? "",
    socialLinks: {
      linkedin: company?.socialLinks?.linkedin ?? "",
      instagram: company?.socialLinks?.instagram ?? "",
      twitter: company?.socialLinks?.twitter ?? "",
      facebook: company?.socialLinks?.facebook ?? "",
      youtube: company?.socialLinks?.youtube ?? "",
      github: company?.socialLinks?.github ?? "",
    },
    footer: {
      about: company?.footer?.about ?? "",
      quickLinks: company?.footer?.quickLinks ?? [],
    },
    seo: {
      title: company?.seo?.title ?? "",
      description: company?.seo?.description ?? "",
      keywords: (company?.seo?.keywords ?? []).join(", "),
    },
  };
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="size-5 text-tech-500" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default function CompanySettingsForm({ company }: { company: ICompany | null }) {
  const [form, setForm] = useState<FormState>(() => fromCompany(company));
  const [state, formAction, isPending] = useActionState(updateCompanyAction, initialState);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setNested<K extends "address" | "socialLinks">(
    key: K,
    nested: keyof FormState[K],
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, string>), [nested]: value },
    }));
  }

  function setQuickLink(index: number, field: "label" | "href", value: string) {
    setForm((prev) => {
      const quickLinks = prev.footer.quickLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      );
      return { ...prev, footer: { ...prev.footer, quickLinks } };
    });
  }

  function addQuickLink() {
    setForm((prev) => ({
      ...prev,
      footer: { ...prev.footer, quickLinks: [...prev.footer.quickLinks, { label: "", href: "" }] },
    }));
  }

  function removeQuickLink(index: number) {
    setForm((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        quickLinks: prev.footer.quickLinks.filter((_, i) => i !== index),
      },
    }));
  }

  const payload = {
    name: form.name,
    tagline: form.tagline,
    logo: form.logo,
    favicon: form.favicon,
    email: form.email,
    phone: form.phone,
    website: form.website,
    address: { ...form.address, line2: form.address.line2 || undefined },
    msmeNumber: form.msmeNumber,
    udyamNumber: form.udyamNumber,
    establishedYear: Number(form.establishedYear),
    workingHours: form.workingHours || undefined,
    copyright: form.copyright,
    mapEmbedUrl: form.mapEmbedUrl || undefined,
    socialLinks: form.socialLinks,
    footer: { ...form.footer, quickLinks: form.footer.quickLinks.filter((l) => l.label && l.href) },
    seo: {
      title: form.seo.title,
      description: form.seo.description,
      keywords: form.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    },
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {state.ok && (
        <div className="flex items-start gap-2 rounded-lg border border-tech-500/30 bg-tech-500/10 px-3 py-2.5 text-sm text-tech-600 dark:text-tech-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{state.message ?? "Saved successfully."}</span>
        </div>
      )}

      {state.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Section icon={Building2} title="Basic Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Company Name">
            <input
              className={inputClasses}
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
            />
          </Field>
          <Field label="Tagline">
            <input
              className={inputClasses}
              value={form.tagline}
              onChange={(event) => set("tagline", event.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClasses}
              value={form.email}
              onChange={(event) => set("email", event.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClasses}
              value={form.phone}
              onChange={(event) => set("phone", event.target.value)}
            />
          </Field>
          <Field label="Website">
            <input
              className={inputClasses}
              value={form.website}
              onChange={(event) => set("website", event.target.value)}
            />
          </Field>
          <Field label="Established Year">
            <input
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              className={inputClasses}
              value={form.establishedYear}
              onChange={(event) => set("establishedYear", Number(event.target.value))}
            />
          </Field>
          <Field label="Working Hours" hint="e.g. Mon – Sat: 10:00 AM – 7:00 PM IST">
            <input
              className={inputClasses}
              value={form.workingHours}
              onChange={(event) => set("workingHours", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={ImageIcon} title="Logo & Favicon">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Logo" hint="Absolute or root-relative image URL. Currently a placeholder — replace later.">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-navy-700 dark:bg-navy-800">
                {form.logo ? (
                  <Image
                    src={form.logo}
                    alt="Logo preview"
                    width={44}
                    height={44}
                    className="size-full object-contain"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="size-5 text-slate-400" />
                )}
              </span>
              <input
                className={inputClasses}
                value={form.logo}
                onChange={(event) => set("logo", event.target.value)}
              />
            </div>
          </Field>
          <Field label="Favicon" hint="Absolute or root-relative image URL.">
            <input
              className={inputClasses}
              value={form.favicon}
              onChange={(event) => set("favicon", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={KeyRound} title="Registration Numbers">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="MSME Number">
            <input
              className={inputClasses}
              value={form.msmeNumber}
              onChange={(event) => set("msmeNumber", event.target.value)}
            />
          </Field>
          <Field label="UDYAM Registration Number">
            <input
              className={inputClasses}
              value={form.udyamNumber}
              onChange={(event) => set("udyamNumber", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={MapPin} title="Address">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Address Line 1">
            <input
              className={inputClasses}
              value={form.address.line1}
              onChange={(event) => setNested("address", "line1", event.target.value)}
            />
          </Field>
          <Field label="Address Line 2">
            <input
              className={inputClasses}
              value={form.address.line2}
              onChange={(event) => setNested("address", "line2", event.target.value)}
            />
          </Field>
          <Field label="City">
            <input
              className={inputClasses}
              value={form.address.city}
              onChange={(event) => setNested("address", "city", event.target.value)}
            />
          </Field>
          <Field label="State">
            <input
              className={inputClasses}
              value={form.address.state}
              onChange={(event) => setNested("address", "state", event.target.value)}
            />
          </Field>
          <Field label="PIN Code">
            <input
              className={inputClasses}
              value={form.address.pincode}
              onChange={(event) => setNested("address", "pincode", event.target.value)}
            />
          </Field>
          <Field label="Country">
            <input
              className={inputClasses}
              value={form.address.country}
              onChange={(event) => setNested("address", "country", event.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={Globe2} title="Google Map">
        <Field label="Map Embed URL" hint="Paste the embed iframe src URL from Google Maps.">
          <input
            className={inputClasses}
            value={form.mapEmbedUrl}
            onChange={(event) => set("mapEmbedUrl", event.target.value)}
          />
        </Field>
      </Section>

      <Section icon={Hash} title="Footer">
        <div className="space-y-5">
          <Field label="Footer About Text">
            <textarea
              rows={3}
              className={inputClasses}
              value={form.footer.about}
              onChange={(event) => setForm((prev) => ({ ...prev, footer: { ...prev.footer, about: event.target.value } }))}
            />
          </Field>
          <Field label="Copyright Text">
            <input
              className={inputClasses}
              value={form.copyright}
              onChange={(event) => set("copyright", event.target.value)}
            />
          </Field>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quick Links
              </span>
              <button
                type="button"
                onClick={addQuickLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-300"
              >
                <Plus className="size-3.5" />
                Add link
              </button>
            </div>
            {form.footer.quickLinks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-xs text-slate-400 dark:border-navy-700">
                No quick links. Add some to show in the footer.
              </p>
            ) : (
              <ul className="space-y-2">
                {form.footer.quickLinks.map((link, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      placeholder="Label"
                      className={inputClasses}
                      value={link.label}
                      onChange={(event) => setQuickLink(index, "label", event.target.value)}
                    />
                    <input
                      placeholder="/page"
                      className={inputClasses}
                      value={link.href}
                      onChange={(event) => setQuickLink(index, "href", event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeQuickLink(index)}
                      aria-label="Remove link"
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section icon={Share2} title="Social Links">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {(["linkedin", "instagram", "twitter", "facebook", "youtube", "github"] as const).map(
            (key) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <input
                  className={inputClasses}
                  value={form.socialLinks[key]}
                  onChange={(event) => setNested("socialLinks", key, event.target.value)}
                />
              </Field>
            )
          )}
        </div>
      </Section>

      <Section icon={UserRound} title="SEO">
        <div className="space-y-5">
          <Field label="Meta Title">
            <input
              className={inputClasses}
              value={form.seo.title}
              onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, title: event.target.value } }))}
            />
          </Field>
          <Field label="Meta Description">
            <textarea
              rows={3}
              className={inputClasses}
              value={form.seo.description}
              onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, description: event.target.value } }))}
            />
          </Field>
          <Field label="Keywords" hint="Comma-separated.">
            <input
              className={inputClasses}
              value={form.seo.keywords}
              onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, keywords: event.target.value } }))}
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg bg-tech-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Company Settings
        </button>
      </div>
    </form>
  );
}
