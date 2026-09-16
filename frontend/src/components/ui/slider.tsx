import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function Slider({
  min,
  max,
  step,
  value,
  onValueChange,
  className,
  ariaLabel,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      style={{ "--value": `${percent}%` } as CSSProperties}
      onInput={(event) => onValueChange(Number(event.currentTarget.value))}
      onChange={(event) => onValueChange(Number(event.currentTarget.value))}
      className={cn("credit-slider w-full", className)}
    />
  );
}
