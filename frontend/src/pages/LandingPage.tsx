import { Cta69 } from "@/components/ui/cta69";

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-background">
      <Cta69
        className="flex min-h-svh items-center"
        badge={{ label: "CreditIQ" }}
        heading="Know your credit risk before you apply."
        buttons={[
          { label: "Check your score", href: "/borrower", variant: "primary" },
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
