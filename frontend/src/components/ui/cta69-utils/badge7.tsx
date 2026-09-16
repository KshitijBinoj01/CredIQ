interface Badge7Props {
  label: string;
  className?: string;
}

export function Badge7({ label, className }: Badge7Props) {
  return (
    <span
      className={`font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground ${className ?? ""}`}
    >
      ( {label} )
    </span>
  );
}
