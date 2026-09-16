import { useCallback, useState } from "react";
import { DEMO_BORROWER } from "@/data/demoBorrower";
import type { BorrowerInput } from "@/types/api";

export function useBorrowerProfile() {
  const [baseline, setBaseline] = useState<BorrowerInput>(DEMO_BORROWER);
  const [profile, setProfile] = useState<BorrowerInput>(DEMO_BORROWER);

  const updateField = useCallback(
    <K extends keyof BorrowerInput>(key: K, value: BorrowerInput[K]) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setProfile(baseline);
  }, [baseline]);

  const commitBaseline = useCallback((next: BorrowerInput) => {
    setBaseline(next);
    setProfile(next);
  }, []);

  return { profile, baseline, updateField, reset, commitBaseline };
}
