import { cn } from "@/lib/utils";

interface SimulatorDeltaProps {
  delta: number;
}

export function SimulatorDelta({ delta }: SimulatorDeltaProps) {
  const sign = delta > 0 ? "+" : "";
  return (
    <p
      className={cn(
        "font-bold tracking-tighter tabular-nums",
        delta > 0 && "text-emerald-300",
        delta < 0 && "text-red-300",
        delta === 0 && "text-muted-foreground",
        "text-4xl md:text-5xl",
      )}
    >
      {sign}
      {delta}
      <span className="ml-2 text-base font-medium tracking-normal text-muted-foreground">
        pts
      </span>
    </p>
  );
}
