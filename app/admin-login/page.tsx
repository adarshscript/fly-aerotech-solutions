import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure sign-in to the Fly Aerotech Solutions admin dashboard.",
};

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center py-10 text-white/50">
      <Loader2 className="size-5 animate-spin" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-12">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-tech-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-tech-400 to-tech-600 shadow-lg shadow-tech-500/30">
              <ShieldCheck className="size-7 text-navy-950" />
            </span>
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1.5 text-sm text-white/50">
            Fly Aerotech Solutions · Secure access portal
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-navy-950/50 backdrop-blur-xl sm:p-8">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <Link href="/" className="transition hover:text-tech-400">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
