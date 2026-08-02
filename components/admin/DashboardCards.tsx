import {
  Award,
  Briefcase,
  FileText,
  GraduationCap,
  MessageSquare,
  Rocket,
  Users,
  Wrench,
} from "lucide-react";
import type { DashboardStats, RecentEnquiry } from "@/services/dashboard.service";

interface CardConfig {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

function buildCards(stats: DashboardStats): CardConfig[] {
  return [
    { label: "Students", value: stats.students, icon: Users, accent: "from-sky-500 to-blue-600" },
    { label: "Courses", value: stats.courses, icon: GraduationCap, accent: "from-violet-500 to-purple-600" },
    { label: "Training Programs", value: stats.trainingPrograms, icon: Rocket, accent: "from-tech-500 to-emerald-600" },
    { label: "Internships", value: stats.internships, icon: Briefcase, accent: "from-amber-500 to-orange-600" },
    { label: "Services", value: stats.services, icon: Wrench, accent: "from-pink-500 to-rose-600" },
    { label: "Certificates", value: stats.certificates, icon: Award, accent: "from-cyan-500 to-teal-600" },
    { label: "Enquiries", value: stats.enquiries, icon: MessageSquare, accent: "from-indigo-500 to-blue-600" },
    { label: "Blog Posts", value: stats.blogs, icon: FileText, accent: "from-slate-500 to-slate-700" },
  ];
}

function formatDate(value: Date | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function statusColor(status: string): string {
  switch (status) {
    case "new":
      return "bg-tech-500/15 text-tech-600 dark:text-tech-400";
    case "in-progress":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    case "resolved":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-400";
    default:
      return "bg-slate-500/15 text-slate-600 dark:text-slate-400";
  }
}

export default function DashboardCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {buildCards(stats).map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-navy-800 dark:bg-navy-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <span
                  className={`flex size-9 items-center justify-center rounded-lg bg-gradient-to-br ${card.accent} text-white shadow-sm`}
                >
                  <Icon className="size-4.5" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-navy-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Enquiries
            </h2>
            <span className="rounded-full bg-tech-500/15 px-2.5 py-1 text-xs font-semibold text-tech-600 dark:text-tech-400">
              {stats.unreadEnquiries} new
            </span>
          </div>
        </div>
        {stats.recentEnquiries.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No enquiries yet. Contact form submissions will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase dark:border-navy-800">
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEnquiries.map((enquiry: RecentEnquiry) => (
                  <tr
                    key={enquiry.id}
                    className="border-b border-slate-50 last:border-0 dark:border-navy-800"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{enquiry.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{enquiry.email}</p>
                    </td>
                    <td className="max-w-56 truncate px-5 py-3 text-slate-600 dark:text-slate-300">
                      {enquiry.subject}
                    </td>
                    <td className="hidden px-5 py-3 text-slate-500 md:table-cell dark:text-slate-400">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColor(enquiry.status)}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
