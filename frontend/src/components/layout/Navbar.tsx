import { CurrencyToggle } from "@/components/layout/CurrencyToggle";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/borrower", label: "Borrower" },
  { to: "/lender", label: "Lender" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-14">
        <NavLink
          to="/"
          className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground"
        >
          CreditIQ
        </NavLink>
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          <nav className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                    isActive
                      ? "bg-white text-black"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
