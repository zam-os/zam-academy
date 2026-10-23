import { toleranceOf } from "../exercises/checker";
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

/**
 * sin of an angle in degrees. Grade 8 teaches no trigonometry; stage 1 uses
 * it only inside a generator, never in learner text: with the angle opposite
 * the shorter side, two triangles exist only while that side is longer than
 * the distance l · sin(w) of the far corner from the other leg.
 */
export const sinD = (deg: number): number => Math.sin((deg * Math.PI) / 180);

/** The same number twice, up to floating-point noise. */
const sameValue = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** A number field; `digits` decimals in the solution. */
export function numberField(
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField {
  const field: NumberField = { kind: "number", label, answer, unit, digits, ...extra };
  // A slip the checker would accept as right is no slip; every value it
  // rejects keeps its targeted hint. Two slips with the same value would
  // compete for one wrong answer: the first one keeps it.
  const slips = extra.slips
    ?.filter((slip) => Number.isFinite(slip.value) && Math.abs(slip.value - answer) > toleranceOf(field))
    .filter((slip, index, all) => all.findIndex((other) => sameValue(other.value, slip.value)) === index);
  return slips ? { ...field, slips } : field;
}

/** A choice field among a few options. */
export function choiceField(label: string, options: string[], correctIndex: number): ChoiceField {
  return { kind: "choice", label, options, correctIndex };
}

/** "ja"/"nein" as a choice field. */
export function yesNo(label: string, yes: boolean): ChoiceField {
  return choiceField(label, ["ja", "nein"], yes ? 0 : 1);
}
