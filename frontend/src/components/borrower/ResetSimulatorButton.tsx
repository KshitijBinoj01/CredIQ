import { cn } from "@/lib/utils";

interface ResetSimulatorButtonProps {
  onClick: () => void;
  className?: string;
}

export function ResetSimulatorButton({
  onClick,
  className,
}: ResetSimulatorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      Reset profile
    </button>
  );
}
