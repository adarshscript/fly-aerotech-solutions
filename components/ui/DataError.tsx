import { AlertTriangle } from "lucide-react";

export default function DataError({
  title = "Something went wrong",
  message = "We could not load the data for this page. Please try again shortly.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center">
      <AlertTriangle className="mx-auto size-12 text-red-500" />
      <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">{title}</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
