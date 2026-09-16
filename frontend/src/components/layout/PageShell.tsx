import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  variant?: "default" | "wide";
  className?: string;
}

export function PageShell({
  children,
  title,
  description,
  variant = "default",
  className,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 py-8 md:px-10 md:py-10 lg:px-14",
        variant === "wide" ? "max-w-[1400px]" : "max-w-6xl",
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
