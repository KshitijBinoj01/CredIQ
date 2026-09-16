import { useEffect, useMemo, useState } from "react";
import { explain } from "@/api/explain";
import { predict } from "@/api/predict";
import { whatIf } from "@/api/whatIf";
import type {
  BorrowerInput,
  PredictionResponse,
  ShapFactor,
} from "@/types/api";

interface UseWhatIfSimulatorArgs {
  profile: BorrowerInput;
  baseline: BorrowerInput;
}

export function useWhatIfSimulator({
  profile,
  baseline,
}: UseWhatIfSimulatorArgs) {
  const [baselinePrediction, setBaselinePrediction] =
    useState<PredictionResponse | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [factors, setFactors] = useState<ShapFactor[]>([]);

  useEffect(() => {
    let cancelled = false;
    predict(baseline).then((result) => {
      if (!cancelled) setBaselinePrediction(result);
    });
    return () => {
      cancelled = true;
    };
  }, [baseline]);

  useEffect(() => {
    let cancelled = false;
    whatIf({ baseline, changes: profile }).then((result) => {
      if (!cancelled) setPrediction(result);
    });
    return () => {
      cancelled = true;
    };
  }, [baseline, profile]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      explain(profile).then((result) => {
        if (!cancelled) setFactors(result.factors);
      });
    }, 100);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [profile]);

  const delta = useMemo(() => {
    if (!prediction || !baselinePrediction) return 0;
    return prediction.score - baselinePrediction.score;
  }, [prediction, baselinePrediction]);

  return {
    prediction,
    baselinePrediction,
    factors,
    delta,
  };
}
