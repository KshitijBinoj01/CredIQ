import { useCallback, useState } from "react";
import { DEMO_BORROWER } from "@/data/demoBorrower";
import { intakeToBorrowerInput } from "@/lib/intakeMapper";
import type { BorrowerInput } from "@/types/api";
import { DEFAULT_INTAKE, type IntakeAnswers } from "@/types/intake";

const STORAGE_KEY = "creditiq-intake";

interface StoredIntake {
  intake: IntakeAnswers;
  intakeComplete: boolean;
}

function loadStored(): StoredIntake | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredIntake;
  } catch {
    return null;
  }
}

function persist(intake: IntakeAnswers, intakeComplete: boolean) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ intake, intakeComplete } satisfies StoredIntake),
  );
}

const stored = loadStored();
const initialIntake = stored?.intake ?? DEFAULT_INTAKE;
const initialComplete = stored?.intakeComplete ?? false;
const initialMapped = intakeToBorrowerInput(initialIntake);

export function useBorrowerProfile() {
  const [intake, setIntake] = useState<IntakeAnswers>(initialIntake);
  const [intakeComplete, setIntakeComplete] = useState(initialComplete);
  const [baseline, setBaseline] = useState<BorrowerInput>(
    initialComplete ? initialMapped : DEMO_BORROWER,
  );
  const [profile, setProfile] = useState<BorrowerInput>(
    initialComplete ? initialMapped : DEMO_BORROWER,
  );

  const applyIntake = useCallback(
    (answers: IntakeAnswers, complete = true) => {
      const mapped = intakeToBorrowerInput(answers);
      setIntake(answers);
      setBaseline(mapped);
      setProfile(mapped);
      setIntakeComplete(complete);
      persist(answers, complete);
    },
    [],
  );

  const updateField = useCallback(
    <K extends keyof BorrowerInput>(key: K, value: BorrowerInput[K]) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setProfile(baseline);
    applyIntake(intake, true);
  }, [applyIntake, baseline, intake]);

  const commitIntake = useCallback(
    (answers: IntakeAnswers) => applyIntake(answers, true),
    [applyIntake],
  );

  const patchIntake = useCallback(
    (partial: Partial<IntakeAnswers>) => {
      setIntake((current) => {
        const next = { ...current, ...partial };
        if (partial.accountTypes) {
          next.accountTypes = {
            ...current.accountTypes,
            ...partial.accountTypes,
          };
        }
        const mapped = intakeToBorrowerInput(next);
        setBaseline(mapped);
        setProfile(mapped);
        setIntakeComplete(true);
        persist(next, true);
        return next;
      });
    },
    [],
  );

  const editAnswers = useCallback(() => {
    setIntakeComplete(false);
    persist(intake, false);
  }, [intake]);

  return {
    profile,
    baseline,
    intake,
    intakeComplete,
    updateField,
    reset,
    commitIntake,
    applyIntake,
    patchIntake,
    editAnswers,
  };
}
