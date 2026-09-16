import { apiClient } from "@/api/client";
import type { BorrowerInput, PredictionResponse } from "@/types/api";

export function predict(input: BorrowerInput): Promise<PredictionResponse> {
  return apiClient.predict(input);
}
