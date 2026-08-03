import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Download, ShieldCheck } from "lucide-react";
import CopyValueButton from "@/components/ui/CopyValueButton";
import DataError from "@/components/ui/DataError";
import { getRegistrationByReference } from "@/services/registration.service";

export const metadata: Metadata = {
  title: "Registration Successful",
  description: "Your registration was successful. Save your reference number to verify your certificate.",
};

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function RegistrationSuccessPage({ searchParams }: SuccessPageProps) {
  const { ref } = await searchParams;
  const reference = ref?.trim() ?? "";

  let registration: Awaited<ReturnType<typeof getRegistrationByReference>> = null;
  let loadError: string | null = null;

  if (reference) {
    try {
      registration = await getRegistrationByReference(reference);
    } catch (error) {
      console.error("[student/success] Failed to load registration:", error);
      loadError =
        error instanceof Error
          ? error.message
          : "We could not load your registration details. Please try again shortly.";
    }
  }

  if (loadError) {
    return (
      <section className="section-padding">
        <div className="container-site">
          <div className="mx-auto max-w-xl">
            <DataError title="Registration Unavailable" message={loadError} />
          </div>
        </div>
      </section>
    );
  }

  if (!registration) {
    return (
      <section className="section-padding">
        <div className="container-site">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-red-500/5 p-10 text-center">
            <AlertTriangle className="mx-auto size-12 text-red-500" />
            <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">
              Registration Details Not Found
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              We could not find a registration with this reference number. Double-check the number
              or contact Fly Aerotech Solutions.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const { certificate, student } = registration;

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-tech-500/30 bg-white shadow-sm dark:border-tech-500/30 dark:bg-navy-900">
            <div className="flex items-center gap-3 bg-tech-500/10 px-6 py-5">
              <span className="flex size-11 items-center justify-center rounded-full bg-tech-500 text-navy-950">
                <CheckCircle2 className="size-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-navy-900 sm:text-2xl dark:text-white">
                  Registration Successful
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Welcome, {student.name}. Your certificate has been created.
                </p>
              </div>
            </div>

            <div className="space-y-5 px-6 py-7">
              <div className="rounded-xl border border-slate-200 p-5 dark:border-navy-700">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                      Certificate Number
                    </dt>
                    <dd className="mt-1 flex min-w-0 items-center gap-2">
                      <span className="min-w-0 font-mono text-base font-bold break-all text-navy-900 dark:text-white">
                        {certificate.certificateNo}
                      </span>
                      <CopyValueButton value={certificate.certificateNo} label="Copy" />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                      Reference Number
                    </dt>
                    <dd className="mt-1 flex min-w-0 items-center gap-2">
                      <span className="min-w-0 font-mono text-base font-bold break-all text-tech-600 dark:text-tech-400">
                        {certificate.referenceNo}
                      </span>
                      <CopyValueButton value={certificate.referenceNo} label="Copy" />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3.5">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Please save your Reference Number. Without it you cannot verify your certificate.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`/api/students/receipt?ref=${encodeURIComponent(certificate.referenceNo)}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-tech-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-tech-500/25 transition hover:bg-tech-400"
                >
                  <Download className="size-4" />
                  Download Receipt
                </a>
                <Link
                  href={`/certificate-verify?ref=${encodeURIComponent(certificate.referenceNo)}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-tech-500 hover:text-tech-600 dark:border-navy-700 dark:text-slate-200 dark:hover:text-tech-400"
                >
                  <ShieldCheck className="size-4" />
                  Verify Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
