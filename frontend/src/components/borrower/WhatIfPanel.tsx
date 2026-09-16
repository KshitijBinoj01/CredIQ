import { FeatureSlider } from "@/components/borrower/FeatureSlider";
import { ResetSimulatorButton } from "@/components/borrower/ResetSimulatorButton";
import { SimulatorDelta } from "@/components/borrower/SimulatorDelta";
import { Surface } from "@/components/ui/surface";
import { FEATURE_CONFIG } from "@/data/featureConfig";
import { cn } from "@/lib/utils";
import type { BorrowerInput } from "@/types/api";

interface WhatIfPanelProps {
  profile: BorrowerInput;
  delta: number;
  onChange: <K extends keyof BorrowerInput>(
    key: K,
    value: BorrowerInput[K],
  ) => void;
  onReset: () => void;
  className?: string;
}

export function WhatIfPanel({
  profile,
  delta,
  onChange,
  onReset,
  className,
}: WhatIfPanelProps) {
  return (
    <section className={cn(className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            ( simulator )
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            What if?
          </h2>
        </div>
        <SimulatorDelta delta={delta} />
      </div>
      <Surface variant="inset" className="px-1 py-6 md:px-4 md:py-8">
        <div className="space-y-6">
          {FEATURE_CONFIG.map((feature) => (
            <FeatureSlider
              key={feature.key}
              feature={feature}
              value={profile[feature.key]}
              onChange={(value) => onChange(feature.key, value)}
            />
          ))}
        </div>
        <div className="mt-8">
          <ResetSimulatorButton onClick={onReset} />
        </div>
      </Surface>
    </section>
  );
}
