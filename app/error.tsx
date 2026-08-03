"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] Server Components render failed:", error);
  }, [error]);

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center">
          <AlertTriangle className="mx-auto size-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            This page could not be loaded. If the problem persists, please contact the site owner.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
          >
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
