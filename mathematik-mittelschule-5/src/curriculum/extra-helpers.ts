import type { LabGoal, LabValues } from "../model/types";

/** A precise model setting, also reachable using the keyboard controls. */
export function goal(id: string, text: string, target: LabValues): LabGoal {
  return {
    id,
    text,
    check: (v) =>
      Object.entries(target).every(([k, n]) => Math.abs(v[k] - n) < 1e-8),
  };
}
