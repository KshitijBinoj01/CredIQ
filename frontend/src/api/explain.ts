import { apiClient } from "@/api/client";
import type { BorrowerInput, ExplainResponse } from "@/types/api";

export function explain(input: BorrowerInput): Promise<ExplainResponse> {
  return apiClient.explain(input);
}
