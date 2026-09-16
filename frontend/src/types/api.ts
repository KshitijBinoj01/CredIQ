export type RiskTier = "low" | "medium" | "high";

export interface BorrowerInput {
  annualIncome: number;
  creditUtilization: number;
  outstandingDebt: number;
  loanAmount: number;
  employmentYears: number;
  delinquencies: number;
  creditHistoryMonths: number;
}

export interface PredictionResponse {
  score: number;
  probability: number;
  tier: RiskTier;
  insight: string;
}

export interface WhatIfRequest {
  baseline: BorrowerInput;
  changes: Partial<BorrowerInput>;
}

export interface ShapFactor {
  feature: keyof BorrowerInput;
  label: string;
  impact: number;
}

export interface ExplainResponse {
  factors: ShapFactor[];
}

export interface FeatureMeta {
  key: keyof BorrowerInput;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}
