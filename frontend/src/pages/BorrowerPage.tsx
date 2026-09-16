import { useState } from "react";
import { BorrowerIntakeWizard } from "@/components/borrower/intake/BorrowerIntakeWizard";
import { CreditInsightBanner } from "@/components/borrower/factors/CreditInsightBanner";
import { FactorContributionChart } from "@/components/borrower/factors/FactorContributionChart";
import { FactorDetailPanel } from "@/components/borrower/factors/FactorDetailPanel";
import { FactorSummaryCards } from "@/components/borrower/factors/FactorSummaryCards";
import { ScoreBandLegend } from "@/components/borrower/factors/ScoreBandLegend";
import { ScorePresets } from "@/components/borrower/factors/ScorePresets";
import { WhatIfScenarios } from "@/components/borrower/factors/WhatIfScenarios";
import {
  HelpAssistantButton,
  HelpAssistantDrawer,
} from "@/components/borrower/help/HelpAssistantDrawer";
import { ScoreGauge } from "@/components/borrower/ScoreGauge";
import { Navbar } from "@/components/layout/Navbar";
import { PageShell } from "@/components/layout/PageShell";
import { ApiDownBanner } from "@/components/layout/ApiDownBanner";
import { useCurrency } from "@/context/CurrencyContext";
import { useBorrowerProfile } from "@/hooks/useBorrowerProfile";
import { useFactorScore } from "@/hooks/useFactorScore";
import { useApiHealth } from "@/hooks/useApiHealth";
import { breakdownToRiskTier } from "@/lib/factorEngine";
import { formatFeatureValue } from "@/lib/featureLabels";

export default function BorrowerPage() {
  const {
    intake,
    intakeComplete,
    commitIntake,
    applyIntake,
    patchIntake,
    editAnswers,
  } = useBorrowerProfile();
  const breakdown = useFactorScore(intake);
  const { currency } = useCurrency();
  const { down } = useApiHealth();
  const [helpOpen, setHelpOpen] = useState(false);
  const tier = breakdownToRiskTier(breakdown.score);

  return (
    <main className="min-h-svh bg-background text-foreground">
      <Navbar />
      <PageShell variant="wide">
        {!intakeComplete ? (
          <BorrowerIntakeWizard initial={intake} onSubmit={commitIntake} />
        ) : (
          <div className="space-y-10">
            {down ? <ApiDownBanner className="mb-0 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-200" /> : null}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={editAnswers}
                className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Edit answers
              </button>
              <HelpAssistantButton onClick={() => setHelpOpen(true)} />
            </div>

            <ScorePresets onSelect={(next) => applyIntake(next, true)} />

            <section className="flex flex-col items-center gap-6">
              <ScoreGauge
                score={breakdown.score}
                tier={tier}
                size="hero"
                caption={breakdown.bandLabel}
              />
              <ScoreBandLegend active={breakdown.band} />
              <p className="max-w-xl text-center text-sm text-muted-foreground">
                Annual income {formatFeatureValue("annualIncome", intake.annualIncome, currency)}{" "}
                is shown for context and is not part of the five-factor score.
              </p>
            </section>

            <FactorSummaryCards factors={breakdown.factors} />

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-5">
                <FactorDetailPanel
                  intake={intake}
                  factors={breakdown.factors}
                  onPatch={patchIntake}
                />
              </div>
              <div className="col-span-12 lg:col-span-7">
                <FactorContributionChart factors={breakdown.factors} />
              </div>
            </div>

            <WhatIfScenarios intake={intake} onPatch={patchIntake} />
            <CreditInsightBanner insight={breakdown.insight} />
          </div>
        )}
      </PageShell>
      <HelpAssistantDrawer
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        breakdown={breakdown}
        intake={intake}
      />
    </main>
  );
}
