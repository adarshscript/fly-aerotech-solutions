import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-tech-500 text-navy-950 shadow-lg shadow-tech-500/25 hover:bg-tech-400 hover:shadow-tech-400/30",
  outline:
    "border border-navy-200 bg-white text-navy-800 hover:border-tech-500 hover:text-tech-600",
  ghost: "text-navy-800 hover:bg-navy-50",
  white: "bg-white text-navy-900 shadow-lg shadow-navy-950/10 hover:bg-navy-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tech-500";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
