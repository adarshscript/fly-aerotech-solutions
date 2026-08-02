import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { CompanyInfo } from "@/types";

interface LogoProps {
  company?: CompanyInfo | null;
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ company, variant = "dark", className }: LogoProps) {
  const name = company?.name ?? "Fly Aerotech Solutions";
  const tagline = company?.tagline ?? "Solutions";
  const logoSrc = company?.logo || images.logo;

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-tech-500 to-tech-600 shadow-md shadow-tech-500/25">
        <Image
          src={logoSrc}
          alt={`${name} logo`}
          width={40}
          height={40}
          className="size-full object-cover"
          unoptimized
        />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "truncate text-base font-bold tracking-tight",
            variant === "dark" ? "text-navy-900" : "text-white"
          )}
        >
          {name}
        </span>
        <span className="truncate text-[10px] font-semibold tracking-[0.22em] uppercase text-tech-600">
          {tagline}
        </span>
      </span>
    </Link>
  );
}
