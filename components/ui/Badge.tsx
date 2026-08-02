import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export default function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-tech-500/30 bg-tech-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-tech-600 uppercase",
        className
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-tech-500" aria-hidden />
      {children}
    </span>
  );
}
