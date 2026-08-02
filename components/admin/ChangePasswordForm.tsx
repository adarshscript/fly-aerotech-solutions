"use client";
import { useActionState, useRef } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { changePasswordAction, type AdminFormState } from "@/app/admin/actions";

const initialState: AdminFormState = {};

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const fields: { id: string; label: string; autoComplete: string }[] = [
    { id: "currentPassword", label: "Current password", autoComplete: "current-password" },
    { id: "newPassword", label: "New password", autoComplete: "new-password" },
    { id: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
  ];

  return (
    <form
      ref={formRef}
      action={(payload) => {
        formAction(payload);
        if (state.ok) formRef.current?.reset();
      }}
      className="space-y-5"
    >
      {fields.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {field.label}
          </label>
          <input
            id={field.id}
            name={field.id}
            type="password"
            required
            minLength={8}
            autoComplete={field.autoComplete}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-tech-500 focus:ring-2 focus:ring-tech-500/30 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
          />
        </div>
      ))}

      {state.ok && (
        <div className="flex items-start gap-2 rounded-lg border border-tech-500/30 bg-tech-500/10 px-3 py-2.5 text-sm text-tech-600 dark:text-tech-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Password changed successfully.</span>
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
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
        Update password
      </button>
    </form>
  );
}
