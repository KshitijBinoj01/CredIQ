import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ShapFactor } from "@/types/api";

interface DivergingFactorChartProps {
  factors: ShapFactor[];
}

function formatImpact(impact: number) {
  const sign = impact > 0 ? "+" : "";
  return `${sign}${impact.toFixed(1)}`;
}

export function DivergingFactorChart({ factors }: DivergingFactorChartProps) {
  const rows = factors.slice(0, 6);
  const maxAbs = Math.max(...rows.map((factor) => Math.abs(factor.impact)), 1);

  return (
    <div>
      <div className="mb-2 hidden grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)] gap-5 md:grid">
        <p className="text-right font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Pulls down
        </p>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Factor
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Lifts up
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/15 md:block"
        />

        {rows.map((factor, index) => {
          const helping = factor.impact >= 0;
          const widthPct = (Math.abs(factor.impact) / maxAbs) * 100;
          const last = index === rows.length - 1;

          return (
            <motion.div
              key={factor.feature}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "rounded-lg px-1 py-4 transition-colors hover:bg-white/[0.02] md:px-2",
                !last && "border-b border-white/[0.04]",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-3 md:hidden">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {factor.label}
                </p>
                <span
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    helping ? "text-emerald-300" : "text-red-300",
                  )}
                >
                  {formatImpact(factor.impact)}
                </span>
              </div>

              <div className="relative grid grid-cols-2 items-center gap-0 md:grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)] md:gap-5">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/15 md:hidden"
                />
                <div className="flex items-center justify-end gap-3">
                  <span
                    className={cn(
                      "hidden w-16 shrink-0 text-right text-xl font-bold tabular-nums md:inline",
                      helping ? "invisible" : "text-red-300",
                    )}
                  >
                    {formatImpact(factor.impact)}
                  </span>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                    {!helping && (
                      <motion.div
                        className="absolute top-0 right-0 h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </div>
                </div>

                <p className="hidden w-full text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:block">
                  {factor.label}
                </p>

                <div className="flex items-center gap-3">
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                    {helping && (
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden w-16 shrink-0 text-xl font-bold tabular-nums md:inline",
                      helping ? "text-emerald-300" : "invisible",
                    )}
                  >
                    {formatImpact(factor.impact)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
