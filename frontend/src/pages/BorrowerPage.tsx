import { FactorInsightsSection } from "@/components/borrower/FactorInsightsSection";
import { GaugeHeroCell } from "@/components/borrower/GaugeHeroCell";
import { ProfileRail } from "@/components/borrower/ProfileRail";
import { ScoreMetaPanel } from "@/components/borrower/ScoreMetaPanel";
import { WhatIfPanel } from "@/components/borrower/WhatIfPanel";
import { Navbar } from "@/components/layout/Navbar";
import { PageShell } from "@/components/layout/PageShell";
import { useBorrowerProfile } from "@/hooks/useBorrowerProfile";
import { useWhatIfSimulator } from "@/hooks/useWhatIfSimulator";

export default function BorrowerPage() {
  const { profile, baseline, updateField, reset } = useBorrowerProfile();
  const { prediction, factors, delta } = useWhatIfSimulator({
    profile,
    baseline,
  });

  const score = prediction?.score ?? 300;
  const tier = prediction?.tier ?? "medium";

  return (
    <main className="min-h-svh bg-background text-foreground">
      <Navbar />
      <PageShell variant="wide">
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-10 lg:gap-y-16">
          <GaugeHeroCell
            className="col-span-12 order-1 lg:col-span-5"
            score={score}
            tier={tier}
          />
          <ScoreMetaPanel
            className="col-span-12 order-2 lg:col-span-7"
            prediction={prediction}
            delta={delta}
            profile={profile}
          />
          <WhatIfPanel
            className="col-span-12 order-3 lg:order-4 lg:col-span-8"
            profile={profile}
            delta={delta}
            onChange={updateField}
            onReset={reset}
          />
          <ProfileRail
            className="col-span-12 order-4 lg:order-3 lg:col-span-4"
            profile={profile}
          />
          <FactorInsightsSection
            className="col-span-12 order-5"
            factors={factors}
          />
        </div>
      </PageShell>
    </main>
  );
}
