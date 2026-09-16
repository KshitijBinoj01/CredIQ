import { FEATURE_CONFIG } from "@/data/featureConfig";
import { setUsingMock } from "@/api/status";
import { computeFactorScores } from "@/lib/factorEngine";
import * as mockEngine from "@/lib/mockEngine";
import type {
  ApplicantRecord,
  BatchPredictResponse,
  BorrowerInput,
  ExplainResponse,
  FeatureMeta,
  PredictionResponse,
  WhatIfRequest,
} from "@/types/api";
import type { IntakeAnswers } from "@/types/intake";
import type { ScoreBreakdown } from "@/types/score";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const USE_REMOTE = API_URL !== undefined;

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL ?? ""}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function withMockFallback<T>(
  remote: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!USE_REMOTE) {
    setUsingMock(true);
    return fallback();
  }
  try {
    const result = await remote();
    setUsingMock(false);
    return result;
  } catch {
    setUsingMock(true);
    return fallback();
  }
}

export const apiClient = {
  async predict(input: BorrowerInput): Promise<PredictionResponse> {
    return withMockFallback(
      () => request<PredictionResponse>("/api/predict", input),
      () => mockEngine.predict(input),
    );
  },
  async whatIf(payload: WhatIfRequest): Promise<PredictionResponse> {
    return withMockFallback(
      () => request<PredictionResponse>("/api/what-if", payload),
      () => mockEngine.whatIf(payload.baseline, payload.changes),
    );
  },
  async explain(input: BorrowerInput): Promise<ExplainResponse> {
    return withMockFallback(
      () => request<ExplainResponse>("/api/explain", input),
      () => mockEngine.explain(input),
    );
  },
  async features(): Promise<FeatureMeta[]> {
    return withMockFallback(
      () => request<FeatureMeta[]>("/api/features"),
      () => FEATURE_CONFIG,
    );
  },
  async batchPredict(
    applicants: ApplicantRecord[],
  ): Promise<BatchPredictResponse> {
    return withMockFallback(
      () =>
        request<BatchPredictResponse>("/api/lender/batch", { applicants }),
      () => mockEngine.batchPredict(applicants),
    );
  },
  async calculateScore(intake: IntakeAnswers): Promise<ScoreBreakdown> {
    return withMockFallback(
      () => request<ScoreBreakdown>("/api/score/calculate", intake),
      () => computeFactorScores(intake),
    );
  },
};
