"use client";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateProfileAction, type AdminFormState } from "@/app/admin/actions";

const initialState: AdminFormState = {};

export default function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          defaultValue={name}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={email}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
        />
      </div>

      {state.ok && (
        <div className="flex items-start gap-2 rounded-lg border border-tech-500/30 bg-tech-500/10 px-3 py-2.5 text-sm text-tech-600 dark:text-tech-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {state.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-tech-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save changes
      </button>
    </form>
  );
}
