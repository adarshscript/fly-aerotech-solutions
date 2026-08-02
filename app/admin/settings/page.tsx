import type { Metadata } from "next";
import CompanySettingsForm from "@/components/admin/CompanySettingsForm";
import { getCompanySettings } from "@/services/company.service";

export const metadata: Metadata = {
  title: "Company Settings",
  description: "Manage company profile, branding, footer, SEO and social links.",
};

export default async function AdminSettingsPage() {
  const company = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Company Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage the company profile that powers the entire website — logo, registration, address,
          footer, SEO and social links are all database driven.
        </p>
      </div>

      <CompanySettingsForm company={company} />
    </div>
  );
}
