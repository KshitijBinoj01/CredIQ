import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type Button12Variant = "primary" | "inverse";

interface Button12Props {
  label: string;
  href?: string;
  to?: string;
  variant?: Button12Variant;
  onClick?: () => void;
  className?: string;
}

export function Button12({
  label,
  href,
  to,
  variant = "primary",
  onClick,
  className,
}: Button12Props) {
  const isInverse = variant === "inverse";

  const content = (
    <>
      <span className="pr-4 text-sm font-bold uppercase tracking-wide">
        {label}
      </span>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          isInverse ? "bg-white text-black" : "bg-black text-white",
        )}
      >
        <ArrowUpRight className="size-4" strokeWidth={2.5} />
      </span>
    </>
  );

  const classes = cn(
    "inline-flex items-center rounded-full py-1.5 pl-6 pr-1.5 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
    isInverse ? "bg-primary text-primary-foreground" : "bg-white text-black",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
