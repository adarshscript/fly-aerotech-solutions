import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { CompanyInfo } from "@/types";

interface LogoProps {
  company?: CompanyInfo | null;
  variant?: "dark" | "light";
  tagline?: string;
  navbar?: boolean;
  className?: string;
}

export default function Logo({ company, variant = "dark", tagline: taglineProp, navbar = false, className }: LogoProps) {
  const name = company?.name ?? "Fly Aerotech Solutions";
  const tagline = taglineProp ?? company?.tagline ?? "Solutions";
  const logoSrc = company?.logo || images.logo;

  return (
    <Link
      href="/"
      className={cn(
        "flex min-w-0 items-center",
        navbar ? "gap-2.5 xl:gap-3" : "gap-3",
        className
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-tech-500 to-tech-600 shadow-md shadow-tech-500/25",
          navbar ? "size-[38px] md:size-[42px] xl:size-12" : "size-10"
        )}
      >
        <Image
          src={logoSrc}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="size-full object-cover"
          unoptimized
        />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "truncate font-bold tracking-tight",
            navbar ? "text-sm sm:text-base xl:text-lg" : "text-base",
            variant === "dark" ? "text-navy-900" : "text-white"
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "truncate font-semibold tracking-[0.22em] uppercase text-tech-600",
            navbar ? "text-[9px] sm:text-[10px] xl:text-[11px]" : "text-[10px]"
          )}
        >
          {tagline}
        </span>
      </span>
    </Link>
  );
}
