import type {
  LabDefinition,
  LabGoal,
  LabParam,
  LabValues,
  ReadoutValues,
} from "../model/types";

/** The values a lab starts with. */
export function defaultLabValues(lab: LabDefinition): LabValues {
  const values: LabValues = {};
  for (const param of lab.params) values[param.key] = param.value;
  return values;
}

/** Clamps a value to its parameter's range or choice set; state stays as it is when finite. */
export function clampParam(param: LabParam, raw: number): number {
  if (param.type === "choice") {
    return param.options.some((o) => o.value === raw) ? raw : param.value;
  }
  if (!Number.isFinite(raw)) return param.value;
  if (param.type === "state") return raw;
  const clamped = Math.min(param.max, Math.max(param.min, raw));
  const steps = Math.round((clamped - param.min) / param.step);
  // A step of 0.25 needs two places; its order of magnitude is insufficient.
  const precision = (value: number): number => {
    const [coefficient, exponent = "0"] = String(value)
      .toLowerCase()
      .split("e");
    return Math.max(
      0,
      (coefficient.split(".")[1]?.length ?? 0) - Number(exponent),
    );
  };
  const decimals = Math.min(
    12,
    Math.max(precision(param.min), precision(param.step)),
  );
  return Number((param.min + steps * param.step).toFixed(decimals));
}

/**
 * The values after the learner set some sliders, choices or handles: each
 * clamped to its range, and the simulation state that belongs to the old
 * set-up back at its start.
 */
export function withChanges(
  lab: LabDefinition,
  values: LabValues,
  changes: Partial<LabValues>,
): LabValues {
  const next: LabValues = { ...values };
  let changed = false;
  for (const [key, raw] of Object.entries(changes)) {
    const param = lab.params.find((p) => p.key === key);
    if (!param || param.type === "state" || raw === undefined) continue;
    const value = clampParam(param, raw);
    if (value !== next[key]) {
      next[key] = value;
      changed = true;
    }
  }
  if (changed) {
    for (const param of lab.params) {
      if (param.type === "state" && param.resetOnChange)
        next[param.key] = param.value;
    }
  }
  return next;
}

/** The values after an action button, every visible value clamped. */
export function applyAction(
  lab: LabDefinition,
  values: LabValues,
  actionId: string,
): LabValues {
  const action = lab.actions?.find((a) => a.id === actionId);
  if (!action) return values;
  const raw = action.apply({ ...values });
  const next: LabValues = { ...values };
  for (const param of lab.params) {
    if (raw[param.key] !== undefined)
      next[param.key] = clampParam(param, raw[param.key]);
  }
  return next;
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
 * Every combination of a coarse grid over the visible parameters, for tests
 * that prove every readout finite and every drawing clean. Ranges take
 * `samples` points including both ends; choices take every option; state
 * keeps its start value.
 */
export function enumerateLabGrid(lab: LabDefinition, samples = 9): LabValues[] {
  const axes = lab.params.map((param) => {
    if (param.type === "choice") return param.options.map((o) => o.value);
    if (param.type === "state") return [param.value];
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
