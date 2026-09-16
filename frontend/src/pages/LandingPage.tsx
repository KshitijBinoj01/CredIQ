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
          note: "Live what-if simulator, explainable factors, and a clear risk score — built for borrowers and lenders.",
          footnote: "Hackathon demo · No real credit data stored",
        }}
      />
    </main>
  );
}
