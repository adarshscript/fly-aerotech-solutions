import { Rocket, type LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title,
  description,
  primaryLabel,
  primaryHref,
  icon: Icon = Rocket,
}: EmptyStateProps) {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="glass-card mx-auto max-w-xl px-8 py-16 text-center">
          <div className="relative mx-auto mb-6 size-20">
            <span className="absolute inset-0 rounded-full bg-tech-500/20 animate-pulse-ring" aria-hidden />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-linear-to-br from-tech-500 to-tech-600 text-white shadow-lg shadow-tech-500/30">
              <Icon className="size-9" aria-hidden />
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{description}</p>
          {primaryLabel && primaryHref ? (
            <Button href={primaryHref} className="mt-8">
              {primaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
