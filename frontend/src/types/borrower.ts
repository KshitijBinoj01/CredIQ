import type { BorrowerInput } from "./api";

export type BorrowerProfile = BorrowerInput;

export interface SimulatorState {
  profile: BorrowerProfile;
  baseline: BorrowerProfile;
}
