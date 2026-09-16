import { DivergingFactorChart } from "@/components/borrower/DivergingFactorChart";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type { ShapFactor } from "@/types/api";

interface FactorInsightsSectionProps {
  factors: ShapFactor[];
  className?: string;
}

export function FactorInsightsSection({
  factors,
  className,
}: FactorInsightsSectionProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 size-[420px] -translate-y-1/2 rounded-full border border-white/[0.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-1/2 size-[280px] -translate-y-1/2 rounded-full border border-white/[0.03]"
      />
      <Surface
        variant="elevated"
        className="relative px-6 py-12 md:px-10 md:py-16 lg:px-12"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          ( explainability )
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          What’s moving your score
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300">
            Pulls down
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Impact
          </span>
          <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Lifts up
          </span>
        </div>
        <Surface
          variant="inset"
          className="mt-10 rounded-2xl px-4 py-6 md:px-8 md:py-8"
        >
          <DivergingFactorChart factors={factors} />
        </Surface>
      </Surface>
    </section>
  );
}
