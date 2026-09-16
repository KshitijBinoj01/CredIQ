import { FEATURE_CONFIG } from "@/data/featureConfig";
import * as mockEngine from "@/lib/mockEngine";
import type {
  BorrowerInput,
  ExplainResponse,
  FeatureMeta,
  PredictionResponse,
  WhatIfRequest,
} from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

async function request<T>(path: string, body?: unknown): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  async predict(input: BorrowerInput): Promise<PredictionResponse> {
    if (!API_URL) return mockEngine.predict(input);
    return request<PredictionResponse>("/api/predict", input);
  },
  async whatIf(payload: WhatIfRequest): Promise<PredictionResponse> {
    if (!API_URL) return mockEngine.whatIf(payload.baseline, payload.changes);
    return request<PredictionResponse>("/api/what-if", payload);
  },
  async explain(input: BorrowerInput): Promise<ExplainResponse> {
    if (!API_URL) return mockEngine.explain(input);
    return request<ExplainResponse>("/api/explain", input);
  },
  async features(): Promise<FeatureMeta[]> {
    if (!API_URL) return FEATURE_CONFIG;
    return request<FeatureMeta[]>("/api/features");
  },
};
