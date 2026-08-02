"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function VerifyForm({ initialValue }: { initialValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue ?? "");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const ref = value.trim();
    if (!ref) return;
    router.push(`/certificate-verify?ref=${encodeURIComponent(ref)}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter certificate or reference number, e.g. CER-2026-XXXXXX"
        className="w-full flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-tech-500 px-6 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
      >
        <Search className="size-4" />
        Verify
      </button>
    </form>
  );
}
