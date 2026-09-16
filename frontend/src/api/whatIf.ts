import { apiClient } from "@/api/client";
import type { PredictionResponse, WhatIfRequest } from "@/types/api";

export function whatIf(payload: WhatIfRequest): Promise<PredictionResponse> {
  return apiClient.whatIf(payload);
}
