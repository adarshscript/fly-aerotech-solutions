"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        setError(data.error ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Signed in successfully. Redirecting…");
      const next = searchParams.get("next") ?? "/admin/dashboard";
      router.replace(next.startsWith("/admin") ? next : "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40" />
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@flyaerotechsolutions.com"
            className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pr-4 pl-10 text-sm text-white placeholder-white/30 outline-none transition focus:border-tech-400 focus:ring-2 focus:ring-tech-400/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pr-11 pl-10 text-sm text-white placeholder-white/30 outline-none transition focus:border-tech-400 focus:ring-2 focus:ring-tech-400/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 transition hover:text-white/70"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-tech-400/30 bg-tech-500/10 px-3 py-2.5 text-sm text-tech-100">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg bg-tech-500 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <Lock className="size-4" />
            Sign in to Dashboard
          </>
        )}
      </button>

      <p className="text-center text-xs text-white/40">
        Super admin credentials are configured by the site owner via environment variables.
      </p>
    </form>
  );
}
