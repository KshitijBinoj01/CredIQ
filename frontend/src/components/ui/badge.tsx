import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { RiskTier } from "@/types/api";

type BadgeVariant = RiskTier | "default";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  low: "bg-emerald-500/15 text-emerald-300",
  medium: "bg-amber-500/15 text-amber-300",
  high: "bg-primary/20 text-red-300",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    />
  );
}
