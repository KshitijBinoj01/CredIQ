import type { FactorKey } from "@/types/score";
import type { IntakeAnswers } from "@/types/intake";
import type { ScoreBreakdown } from "@/types/score";
import { FACTOR_LABELS } from "@/lib/factorEngine";

export interface Tip {
  title: string;
  body: string;
}

const HOW_IT_WORKS: Tip[] = [
  {
    title: "How the score is built",
    body: "CreditIQ’s borrower score is a transparent FICO-style estimate: 300 plus up to 550 points from five factors. It is not a bureau FICO or VantageScore.",
  },
  {
    title: "Payment history — 35%",
    body: "On-time payments dominate the score. Missed payments and collections/bankruptcy-style events cut this factor the most.",
  },
  {
    title: "Credit utilization — 30%",
    body: "Revolving balance divided by total credit limit. Under 30% is healthy; under 10% is strongest. Maxing a card hurts fast.",
  },
  {
    title: "Credit age — 15%",
    body: "Time since your first card or loan. Thin files (under 6 months) start lower. Keeping old accounts open helps this slowly.",
  },
  {
    title: "Credit mix — 10%",
    body: "A mix of revolving and installment accounts (card, auto, mortgage, student, other) is rewarded. Quantity of types matters, not dollar size.",
  },
  {
    title: "New credit — 10%",
    body: "Applications in the last year. Each extra inquiry trims this factor. Pausing new apps lets it recover.",
  },
  {
    title: "USD and INR",
    body: "Money is stored in USD. The navbar toggle shows rupees at 1 USD = 96 INR. The score itself never converts.",
  },
];

const WEAKEST_TIPS: Record<FactorKey, Tip> = {
  paymentHistory: {
    title: "Lift payment history",
    body: "Bring any past-due accounts current and avoid new lates. This 35% factor moves the gauge more than anything else.",
  },
  utilization: {
    title: "Lower utilization",
    body: "Pay revolving balances toward under 30% of the combined limit. Paying a card to $0 is the fastest what-if win.",
  },
  creditAge: {
    title: "Let accounts age",
    body: "Keep your oldest accounts open. Waiting a year raises credit age; closing old cards can shorten the average.",
  },
  creditMix: {
    title: "Build a healthier mix",
    body: "A second responsible account type (for example an auto loan alongside a card) can raise this 10% factor over time.",
  },
  newCredit: {
    title: "Pause new applications",
    body: "Each hard inquiry in the last year trims new credit. Space out applications and avoid stacking them.",
  },
};

export function tipsForBreakdown(breakdown: ScoreBreakdown): Tip[] {
  const weakest = [...breakdown.factors].sort(
    (a, b) => a.percentOfMax - b.percentOfMax,
  )[0];
  const personalized = weakest ? WEAKEST_TIPS[weakest.key] : null;
  return personalized ? [personalized, ...HOW_IT_WORKS] : HOW_IT_WORKS;
}

export function answerHelpQuestion(
  question: string,
  breakdown: ScoreBreakdown,
  intake: IntakeAnswers,
): string {
  const q = question.toLowerCase();
  if (q.includes("how") && (q.includes("work") || q.includes("score"))) {
    return `Your ${breakdown.score} (${breakdown.bandLabel}) is 300 plus points from five factors: payment 35%, utilization 30%, age 15%, mix 10%, new credit 10%. ${breakdown.insight}`;
  }
  if (q.includes("inr") || q.includes("rupee") || q.includes("dollar")) {
    return "Toggle USD / INR in the navbar. Income, limits, and balances convert at 1 USD = 96 INR. The 300–850 score does not change.";
  }
  if (q.includes("util")) {
    const factor = breakdown.factors.find((item) => item.key === "utilization");
    return factor
      ? `${factor.summary} This factor is worth up to ${Math.round(factor.maxPoints)} points.`
      : WEAKEST_TIPS.utilization.body;
  }
  if (q.includes("payment") || q.includes("miss")) {
    return WEAKEST_TIPS.paymentHistory.body;
  }
  if (q.includes("thin") || q.includes("age") || q.includes("history")) {
    return `Credit age uses years since your first account (${intake.yearsSinceFirstCredit}). ${WEAKEST_TIPS.creditAge.body}`;
  }
  if (q.includes("mix") || q.includes("account")) {
    return WEAKEST_TIPS.creditMix.body;
  }
  if (q.includes("inquir") || q.includes("new credit") || q.includes("apply")) {
    return WEAKEST_TIPS.newCredit.body;
  }
  if (q.includes("why") || q.includes("low") || q.includes("improve")) {
    const weakest = [...breakdown.factors].sort(
      (a, b) => a.percentOfMax - b.percentOfMax,
    )[0];
    if (weakest) {
      return `The weakest factor is ${FACTOR_LABELS[weakest.key]} (${weakest.percentOfMax}% of its max). ${WEAKEST_TIPS[weakest.key].body}`;
    }
  }
  return `${breakdown.insight} Ask about utilization, payments, INR, or how the score is built.`;
}
