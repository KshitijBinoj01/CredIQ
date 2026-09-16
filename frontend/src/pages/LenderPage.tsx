import { Navbar } from "@/components/layout/Navbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/card";

export default function LenderPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <Navbar />
      <PageShell
        title="Lender view"
        description="Portfolio summary and applicant table will live here after the Borrower view is complete."
      >
        <Card>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Coming next
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Portfolio scoring
          </h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Batch applicants, risk distribution, and a sortable table will
            reuse the same scoring contract as the Borrower simulator.
          </p>
        </Card>
      </PageShell>
    </main>
  );
}
