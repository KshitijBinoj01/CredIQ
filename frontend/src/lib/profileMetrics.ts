import type { BorrowerInput } from "@/types/api";

export function debtBurdenRatio(profile: BorrowerInput): number {
  if (profile.annualIncome <= 0) return 0;
  return ((profile.outstandingDebt + profile.loanAmount) / profile.annualIncome) * 100;
}

export function formatDebtBurden(ratio: number): string {
  return `${Math.round(ratio)}%`;
}
