"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  status: string;
  referenceNo: string;
  createdAt: string;
  certificate?: {
    id: string;
    certificateNo: string;
    referenceNo: string;
    status: string;
    isVerified: boolean;
  } | null;
}

interface ListResponse {
  success: boolean;
  error?: string;
  students?: StudentRow[];
  total?: number;
  page?: number;
  pages?: number;
  limit?: number;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-tech-500/15 text-tech-600 dark:text-tech-400",
  completed: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  dropped: "bg-red-500/15 text-red-600 dark:text-red-400",
};

function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function StudentsManager() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({ page: String(page), limit: "10" });
        if (query.trim()) params.set("search", query.trim());
        if (statusFilter !== "all") params.set("status", statusFilter);
        const response = await fetch(`/api/students?${params.toString()}`);
        const result = (await response.json()) as ListResponse;
        if (cancelled) return;
        if (!response.ok || !result.success) {
          setError(result.error ?? "Could not load students.");
          return;
        }
        setStudents(result.students ?? []);
        setTotal(result.total ?? 0);
        setPages(result.pages ?? 1);
      } catch {
        if (!cancelled) setError("Network error while loading students.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, query, statusFilter, reloadKey]);

  function handleSearchChange(value: string) {
    setLoading(true);
    setQuery(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setLoading(true);
    setStatusFilter(value);
    setPage(1);
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) {
        setError(result.error ?? "Could not delete student.");
        return;
      }
      setLoading(true);
      setReloadKey((prev) => prev + 1);
    } catch {
      setError("Network error while deleting student.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Students</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {total} registered student{total === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/students/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
        >
          <Plus className="size-4" />
          New Student
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by name, email, mobile, reference or certificate number..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-tech-500 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-200"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="size-5 animate-spin" />
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No students found. Register a student or adjust your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-400 uppercase dark:border-navy-700">
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Certificate</th>
                  <th className="px-5 py-3 font-semibold">Mobile</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {students.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50 dark:hover:bg-navy-800/50">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-semibold text-navy-900 hover:text-tech-600 dark:text-white dark:hover:text-tech-400"
                      >
                        {student.name}
                      </Link>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {student.courseTitle || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {student.certificate ? (
                        <div>
                          <p className="font-mono text-xs font-semibold text-navy-900 dark:text-white">
                            {student.certificate.certificateNo}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400">
                            {student.certificate.referenceNo}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Not issued</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{student.phone}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                          STATUS_STYLES[student.status] ?? "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                        )}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/students/${student.id}`}
                          title="View"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-tech-500/10 hover:text-tech-600 dark:hover:text-tech-400"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/admin/students/${student.id}/edit`}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-tech-500/10 hover:text-tech-600 dark:hover:text-tech-400"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          type="button"
                          title="Delete"
                          disabled={deletingId === student.id}
                          onClick={() => handleDelete(student.id, student.name)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                        >
                          {deletingId === student.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 ? (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-navy-700">
            <p className="text-xs text-slate-400">
              Page {page} of {pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setLoading(true);
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 transition hover:border-tech-500 hover:text-tech-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-700 dark:text-slate-300"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => {
                  setLoading(true);
                  setPage((prev) => Math.min(pages, prev + 1));
                }}
                className="rounded-lg border border-slate-300 p-2 text-slate-500 transition hover:border-tech-500 hover:text-tech-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-700 dark:text-slate-300"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="text-xs text-slate-400">
        Tip: creating a student here only saves the record. Issue their certificate from the{" "}
        <Link href="/admin/certificates" className="font-semibold text-tech-600 underline dark:text-tech-400">
          Certificates
        </Link>{" "}
        section. Self-registered students get certificates automatically.
      </p>
    </div>
  );
}
