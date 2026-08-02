"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificateView } from "@/services/certificate.service";
import { formatCertificateDate } from "@/components/certificates/preview-types";

interface CertificatesManagerProps {
  certificates: CertificateView[];
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  issued: "bg-tech-500/15 text-tech-600 dark:text-tech-400",
  revoked: "bg-red-500/15 text-red-600 dark:text-red-400",
  duplicate: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export default function CertificatesManager({ certificates }: CertificatesManagerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return certificates.filter((certificate) => {
      if (statusFilter !== "all" && certificate.status !== statusFilter) return false;
      if (!q) return true;
      return (
        certificate.certificateNo.toLowerCase().includes(q) ||
        certificate.referenceNo.toLowerCase().includes(q) ||
        certificate.studentName.toLowerCase().includes(q) ||
        certificate.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [certificates, query, statusFilter]);

  async function handleDuplicate(id: string) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch(`/api/certificates/${id}/duplicate`, { method: "POST" });
      const result = (await response.json()) as { success: boolean; error?: string; certificate?: CertificateView };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Could not duplicate certificate.");
        return;
      }
      router.push(`/admin/certificates/${result.certificate?.id}`);
      router.refresh();
    } catch {
      setError("Could not duplicate certificate.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: string, certificateNo: string) {
    if (!window.confirm(`Delete certificate ${certificateNo}? This cannot be undone.`)) return;
    setBusy(id);
    setError("");
    try {
      const response = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Could not delete certificate.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not delete certificate.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificate / student / course"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-tech-500 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="issued">Issued</option>
            <option value="revoked">Revoked</option>
            <option value="duplicate">Duplicate</option>
          </select>
        </div>
        <Link
          href="/admin/certificates/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
        >
          <Plus className="size-4" />
          New Certificate
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase dark:border-navy-800 dark:bg-navy-800/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Certificate</th>
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">Course</th>
                <th className="px-5 py-3.5 font-semibold">Dates</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-slate-400">
                    No certificates found. Click &quot;New Certificate&quot; to issue one.
                  </td>
                </tr>
              ) : (
                filtered.map((certificate) => (
                  <tr key={certificate.id} className="transition hover:bg-slate-50 dark:hover:bg-navy-800/40">
                    <td className="px-5 py-4">
                      <p className="font-mono text-[13px] font-semibold text-navy-900 dark:text-white">
                        {certificate.certificateNo}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">{certificate.referenceNo}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{certificate.studentName}</p>
                      {certificate.fatherName ? (
                        <p className="text-xs text-slate-400">S/o {certificate.fatherName}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700 dark:text-slate-200">{certificate.courseTitle}</p>
                      <p className="text-xs text-slate-400 capitalize">
                        {certificate.type}
                        {certificate.technology ? ` · ${certificate.technology}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      <p>Issued {formatCertificateDate(certificate.issueDate)}</p>
                      <p className="mt-0.5">
                        {formatCertificateDate(certificate.startDate)} → {formatCertificateDate(certificate.endDate)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                          STATUS_STYLES[certificate.status] ?? STATUS_STYLES.draft
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/certificates/${certificate.id}`}
                          title="View"
                          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/admin/certificates/${certificate.id}/edit`}
                          title="Edit"
                          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <a
                          href={`/api/certificates/${certificate.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download PDF"
                          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
                        >
                          <Download className="size-4" />
                        </a>
                        <button
                          type="button"
                          title="Duplicate"
                          disabled={busy === certificate.id}
                          onClick={() => handleDuplicate(certificate.id)}
                          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-navy-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          disabled={busy === certificate.id}
                          onClick={() => handleDelete(certificate.id, certificate.certificateNo)}
                          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
