import type { Metadata } from "next";
import CertificatesManager from "@/components/admin/certificates/CertificatesManager";
import { listCertificates } from "@/services/certificate.service";

export const metadata: Metadata = {
  title: "Certificate Management",
  description: "Issue, edit, duplicate and revoke certificates.",
};

export default async function AdminCertificatesPage() {
  const certificates = await listCertificates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Certificate Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Issue, preview, download and revoke certificates. Each certificate gets a unique
          reference and a scannable verification QR code.
        </p>
      </div>

      <CertificatesManager certificates={certificates} />
    </div>
  );
}
