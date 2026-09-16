import { Link } from "react-router-dom";
import { Cta69 } from "@/components/ui/cta69";

export default function LandingPage() {
  return (
    <main className="relative min-h-svh bg-background">
      <Link
        to="/pricing"
        className="fixed top-6 right-6 z-50 rounded-full border border-white/10 bg-background/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground backdrop-blur transition-transform hover:scale-[1.03] hover:text-foreground"
      >
        See plans
      </Link>
      <Cta69
        className="flex min-h-svh items-center"
        badge={{ label: "CreditIQ" }}
        heading="Know your credit risk before you apply."
        buttons={[
          { label: "Check your score", href: "/borrower?new=1", variant: "primary" },
          { label: "Review portfolio", href: "/lender", variant: "inverse" },
        ]}
        labels={{
          marqueePhrase: "Credit insight",
          note: "Borrower score is a FICO-style estimate from your answers. Lender view is a separate default-risk model — not the same number.",
          footnote: "Hackathon demo · No real credit data stored · Slash commands: /faq /why /improve",
        }}
      />
    </main>
  );
}
