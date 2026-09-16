import { CreditCard, Hourglass, Maximize2, UserPlus, UserX, X } from "lucide-react";
import type { IntakeAnswers } from "@/types/intake";

interface WhatIfScenariosProps {
  intake: IntakeAnswers;
  onPatch: (partial: Partial<IntakeAnswers>) => void;
}

const SCENARIOS: Array<{
  id: string;
  label: string;
  icon: typeof CreditCard;
  apply: (intake: IntakeAnswers) => Partial<IntakeAnswers>;
}> = [
  {
    id: "payoff",
    label: "Pay off credit card",
    icon: CreditCard,
    apply: () => ({ totalCreditBalance: 0 }),
  },
  {
    id: "miss",
    label: "Miss a payment",
    icon: X,
    apply: (intake) => ({
      lastMissedPayment:
        intake.lastMissedPayment === "never" ? "30" : "90",
    }),
  },
  {
    id: "open",
    label: "Open new account",
    icon: UserPlus,
    apply: (intake) => ({
      accountTypes: { ...intake.accountTypes, creditCard: true },
      creditApplicationsLastYear: intake.creditApplicationsLastYear + 1,
      totalCreditLimit: intake.totalCreditLimit + 3000,
    }),
  },
  {
    id: "close",
    label: "Close old account",
    icon: UserX,
    apply: (intake) => ({
      yearsSinceFirstCredit: Math.max(0, intake.yearsSinceFirstCredit - 2),
      totalCreditLimit: Math.max(0, intake.totalCreditLimit * 0.7),
    }),
  },
  {
    id: "max",
    label: "Max out card",
    icon: Maximize2,
    apply: (intake) => ({
      totalCreditBalance: Math.max(intake.totalCreditLimit, 1000),
      totalCreditLimit: Math.max(intake.totalCreditLimit, 1000),
    }),
  },
  {
    id: "wait",
    label: "Wait 1 year",
    icon: Hourglass,
    apply: (intake) => ({
      yearsSinceFirstCredit: intake.yearsSinceFirstCredit + 1,
      hasCreditSixMonths: true,
      creditApplicationsLastYear: 0,
    }),
  },
];

export function WhatIfScenarios({ intake, onPatch }: WhatIfScenariosProps) {
  return (
    <section>
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        What-if scenarios
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onPatch(scenario.apply(intake))}
              className="flex flex-col items-center gap-3 rounded-2xl bg-surface-raised px-3 py-5 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <Icon className="size-5 text-emerald-300" />
              {scenario.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
