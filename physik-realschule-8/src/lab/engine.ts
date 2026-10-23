import type {
  LabDefinition,
  LabGoal,
  LabParam,
  LabValues,
  ReadoutValues,
} from "../model/types";

/** The slider positions a lab starts with. */
export function defaultLabValues(lab: LabDefinition): LabValues {
  const values: LabValues = {};
  for (const param of lab.params) values[param.key] = param.value;
  return values;
}

/** Clamps a value to its parameter's range or choice set. */
export function clampParam(param: LabParam, raw: number): number {
  if (param.type === "choice") {
    return param.options.some((o) => o.value === raw) ? raw : param.value;
  }
  if (!Number.isFinite(raw)) return param.value;
  const clamped = Math.min(param.max, Math.max(param.min, raw));
  const steps = Math.round((clamped - param.min) / param.step);
  const decimals = Math.max(0, -Math.floor(Math.log10(param.step) + 1e-9));
  return Number((param.min + steps * param.step).toFixed(decimals));
}

export function computeReadouts(
  lab: LabDefinition,
  values: LabValues,
): ReadoutValues {
  const readouts: ReadoutValues = {};
  for (const readout of lab.readouts) {
    readouts[readout.key] = readout.compute(values);
  }
  return readouts;
}

export function reachedGoals(
  lab: LabDefinition,
  values: LabValues,
  readouts: ReadoutValues = computeReadouts(lab, values),
): LabGoal[] {
  return lab.goals.filter((goal) => goal.check(values, readouts));
}

/**
 * Every combination of a coarse grid over the parameters, for tests that
 * prove each goal reachable and every readout finite. Ranges take
 * `samples` points including both ends; choices take every option.
 */
export function enumerateLabGrid(
  lab: LabDefinition,
  samples = 9,
): LabValues[] {
  const axes = lab.params.map((param) => {
    if (param.type === "choice") return param.options.map((o) => o.value);
    const points: number[] = [];
    for (let i = 0; i < samples; i++) {
      const raw = param.min + ((param.max - param.min) * i) / (samples - 1);
      points.push(clampParam(param, raw));
    }
    return [...new Set(points)];
  });
  let combos: LabValues[] = [{}];
  lab.params.forEach((param, index) => {
    const next: LabValues[] = [];
    for (const combo of combos) {
      for (const value of axes[index]) {
        next.push({ ...combo, [param.key]: value });
      }
    }
    combos = next;
  });
  return combos;
}

/**
 * Searches the fine grid of one lab for a combination that reaches a goal,
 * for tests. Returns null when none of the sampled combinations does.
 */
export function findGoalWitness(
  lab: LabDefinition,
  goalId: string,
  samples = 21,
): LabValues | null {
  const goal = lab.goals.find((g) => g.id === goalId);
  if (!goal) return null;
  for (const values of enumerateLabGrid(lab, samples)) {
    if (goal.check(values, computeReadouts(lab, values))) return values;
  }
  return null;
}

/** Physical constants used throughout the labs and exercises. */
export const G = 9.81; // N/kg, Ortsfaktor auf der Erde
export const C_LIGHT = 300_000; // km/s, Lichtgeschwindigkeit (gerundet)
export const C_LIGHT_MS = 3e8; // m/s
export const V_SOUND_AIR = 343; // m/s bei 20 °C
export const E_CHARGE = 1.6e-19; // C, Elementarladung (gerundet)
export const KELVIN_OFFSET = 273.15;
