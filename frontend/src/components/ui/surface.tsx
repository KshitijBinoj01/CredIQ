import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SurfaceVariant = "elevated" | "inset" | "transparent";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
}

const VARIANT_CLASS: Record<SurfaceVariant, string> = {
  elevated: "bg-surface-raised",
  inset: "bg-surface-inset",
  transparent: "bg-transparent",
};

export function Surface({
  className,
  variant = "elevated",
  ...props
}: SurfaceProps) {
  return (
    <div className={cn(VARIANT_CLASS[variant], className)} {...props} />
  );
}
