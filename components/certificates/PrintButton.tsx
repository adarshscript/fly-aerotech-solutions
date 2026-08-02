"use client";
import { Printer } from "lucide-react";

export default function PrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200 dark:hover:text-tech-400 ${
        className ?? ""
      }`}
    >
      <Printer className="size-4" />
      Print
    </button>
  );
}
