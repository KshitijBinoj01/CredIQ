import { ScoreGauge } from "@/components/borrower/ScoreGauge";
import { cn } from "@/lib/utils";
import type { RiskTier } from "@/types/api";

interface GaugeHeroCellProps {
  score: number;
  tier: RiskTier;
  className?: string;
}

export function GaugeHeroCell({ score, tier, className }: GaugeHeroCellProps) {
  return (
    <section className={cn("flex flex-col items-center justify-center", className)}>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
        ( live score )
      </p>
      <ScoreGauge score={score} tier={tier} size="hero" />
    </section>
  );
}
