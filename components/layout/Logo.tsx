import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function Logo({ variant = "dark", className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-tech-500 to-tech-600 shadow-md shadow-tech-500/25">
        <Image
          src={images.logo}
          alt="Fly Aerotech Solutions logo"
          width={40}
          height={40}
          className="size-full object-cover"
          unoptimized
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-base font-bold tracking-tight",
            variant === "dark" ? "text-navy-900" : "text-white"
          )}
        >
          Fly Aerotech
        </span>
        <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-tech-600">
          Solutions
        </span>
      </span>
    </Link>
  );
}
