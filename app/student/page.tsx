import type { Metadata } from "next";
import { GraduationCap, ShieldCheck } from "lucide-react";
import StudentRegistrationForm from "@/components/student/StudentRegistrationForm";
import { listActiveCourses } from "@/services/course.service";
import { getSettings } from "@/services/settings.service";

export const metadata: Metadata = {
  title: "Student Registration",
  description:
    "Register as a student of Fly Aerotech Solutions and get your certificate with a unique reference number for online verification.",
};

export const dynamic = "force-dynamic";

export default async function StudentRegistrationPage() {
  const [settings, courses] = await Promise.all([getSettings(), listActiveCourses()]);

  if (settings && settings.studentRegistrationEnabled === false) {
    return (
      <section className="section-padding">
        <div className="container-site">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-navy-800 dark:bg-navy-900">
            <GraduationCap className="mx-auto size-12 text-slate-300" />
            <h1 className="mt-4 text-2xl font-bold text-navy-900 dark:text-white">
              Registration Currently Closed
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Student registrations are temporarily paused. Please contact Fly Aerotech Solutions
              for more information.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-tech-500/30 bg-tech-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-tech-600 uppercase dark:text-tech-400">
              <GraduationCap className="size-4" />
              Student Registration
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl dark:text-white">
              Register for Your Certificate
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Fill in your details below. On submission, your certificate is created instantly and
              a unique Reference Number is generated — keep it safe to verify your certificate.
            </p>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-tech-500/30 bg-tech-500/5 p-4 text-sm text-navy-800 dark:text-tech-400 dark:bg-navy-900">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-tech-500" />
            <p>
              Your details are stored securely and used only to issue and verify your certificate.
              Never share your Reference Number publicly.
            </p>
          </div>

          <div className="mt-8">
            <StudentRegistrationForm
              courses={courses.map((course) => ({
                id: String((course as unknown as { _id: unknown })._id),
                title: course.title,
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
