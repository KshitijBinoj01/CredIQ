import type { RiskTier } from "@/types/api";

export function probabilityToScore(probability: number): number {
  const clamped = Math.min(1, Math.max(0, probability));
  return Math.round(300 + (1 - clamped) * 550);
}

export function getRiskTier(score: number): RiskTier {
  if (score >= 700) return "low";
  if (score >= 580) return "medium";
  return "high";
}

export function getTierInsight(tier: RiskTier): string {
  switch (tier) {
    case "low":
      return "Your score is in a strong range. Lenders typically see this as lower risk.";
    case "medium":
      return "Your score is in a fair range. Small changes in utilization or debt can move it.";
    case "high":
      return "Your score is in a higher-risk range. Lower utilization and fewer delinquencies help most.";
  }
}

export function getTierLabel(tier: RiskTier): string {
  switch (tier) {
    case "low":
      return "Low risk";
    case "medium":
      return "Medium risk";
    case "high":
      return "High risk";
  }
}
