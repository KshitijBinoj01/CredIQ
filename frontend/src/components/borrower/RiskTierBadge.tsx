import { Badge } from "@/components/ui/badge";
import { getTierLabel } from "@/lib/riskScore";
import type { RiskTier } from "@/types/api";

interface RiskTierBadgeProps {
  tier: RiskTier;
}

export function RiskTierBadge({ tier }: RiskTierBadgeProps) {
  return <Badge variant={tier}>{getTierLabel(tier)}</Badge>;
}
