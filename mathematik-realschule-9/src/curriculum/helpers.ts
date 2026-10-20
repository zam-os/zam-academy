import type { NumberField, ChoiceField } from "../model/types";

/** True when `value` is within `tolerance` (relative) of `target`. */
export function near(value: number, target: number, tolerance = 0.02): boolean {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  if (target === 0) return Math.abs(value) <= tolerance;
  return Math.abs(value - target) <= Math.abs(target) * tolerance;
}

/** True when `value` is within `delta` (absolute) of `target`. */
export function within(value: number, target: number, delta: number): boolean {
  return Number.isFinite(value) && Math.abs(value - target) <= delta;
}

export const DEG = Math.PI / 180;

export const sinD = (deg: number): number => Math.sin(deg * DEG);
export const cosD = (deg: number): number => Math.cos(deg * DEG);
export const tanD = (deg: number): number => Math.tan(deg * DEG);
export const asinD = (ratio: number): number => Math.asin(ratio) / DEG;
export const acosD = (ratio: number): number => Math.acos(ratio) / DEG;
export const atanD = (ratio: number): number => Math.atan(ratio) / DEG;

/** A number field; `digits` decimals in the solution. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  // A slip that happens to equal the answer (sin 45° = cos 45°) is no slip.
  const slips = extra.slips?.filter(
    (slip) => Number.isFinite(slip.value) && Math.abs(slip.value - answer) > Math.max(1e-9, 0.02 * Math.abs(answer), 0.51 * 10 ** -digits),
  );
  return { kind: "number", label, answer, unit, digits, ...extra, ...(slips ? { slips } : {}) };
}

/** A choice field among a few options. */
export function choiceField(label: string, options: string[], correctIndex: number): ChoiceField {
  return { kind: "choice", label, options, correctIndex };
}

/** "ja"/"nein" as a choice field. */
export function yesNo(label: string, yes: boolean): ChoiceField {
  return choiceField(label, ["ja", "nein"], yes ? 0 : 1);
}

/** The slip a calculator set to RAD gives for c · sin(α°), so the hint can name it. */
export const RAD_HINT =
  "Steht dein Taschenrechner auf RAD? Für Winkel in Grad muss er auf DEG (D) stehen.";
