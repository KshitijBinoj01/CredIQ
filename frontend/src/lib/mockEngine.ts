import { FEATURE_LABELS } from "@/lib/featureLabels";
import {
  getRiskTier,
  getTierInsight,
  probabilityToScore,
} from "@/lib/riskScore";
import type {
  BorrowerInput,
  ExplainResponse,
  PredictionResponse,
  ShapFactor,
} from "@/types/api";

const WEIGHTS: Record<keyof BorrowerInput, number> = {
  annualIncome: -0.000004,
  creditUtilization: 0.0075,
  outstandingDebt: 0.000006,
  loanAmount: 0.0000035,
  employmentYears: -0.018,
  delinquencies: 0.085,
  creditHistoryMonths: -0.0018,
};

const BASE_LOGIT = -0.35;

function logitToProbability(logit: number): number {
  return 1 / (1 + Math.exp(-logit));
}

function riskLogit(profile: BorrowerInput): number {
  return (
    BASE_LOGIT +
    profile.annualIncome * WEIGHTS.annualIncome +
    profile.creditUtilization * WEIGHTS.creditUtilization +
    profile.outstandingDebt * WEIGHTS.outstandingDebt +
    profile.loanAmount * WEIGHTS.loanAmount +
    profile.employmentYears * WEIGHTS.employmentYears +
    profile.delinquencies * WEIGHTS.delinquencies +
    profile.creditHistoryMonths * WEIGHTS.creditHistoryMonths
  );
}

export function predict(profile: BorrowerInput): PredictionResponse {
  const probability = logitToProbability(riskLogit(profile));
  const score = probabilityToScore(probability);
  const tier = getRiskTier(score);
  return {
    score,
    probability,
    tier,
    insight: getTierInsight(tier),
  };
}

export function whatIf(
  baseline: BorrowerInput,
  changes: Partial<BorrowerInput>,
): PredictionResponse {
  return predict({ ...baseline, ...changes });
}

export function explain(profile: BorrowerInput): ExplainResponse {
  const contributions: ShapFactor[] = (
    Object.keys(WEIGHTS) as Array<keyof BorrowerInput>
  ).map((feature) => ({
    feature,
    label: FEATURE_LABELS[feature],
    impact: -(profile[feature] * WEIGHTS[feature]) * 80,
  }));

  contributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return { factors: contributions };
}
