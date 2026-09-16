import { Slider } from "@/components/ui/slider";
import { formatFeatureValue } from "@/lib/featureLabels";
import type { FeatureMeta } from "@/types/api";

interface FeatureSliderProps {
  feature: FeatureMeta;
  value: number;
  onChange: (value: number) => void;
}

export function FeatureSlider({
  feature,
  value,
  onChange,
}: FeatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <label className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {feature.label}
        </label>
        <span className="text-base font-semibold tabular-nums">
          {formatFeatureValue(feature.key, value)}
        </span>
      </div>
      <Slider
        min={feature.min}
        max={feature.max}
        step={feature.step}
        value={value}
        ariaLabel={feature.label}
        onValueChange={onChange}
      />
    </div>
  );
}
