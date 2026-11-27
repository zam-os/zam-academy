import type { Exercise } from "../model/types";

/** Accept German/English decimals, grouping and an optional trailing unit. */
export function parseNumbers(raw: string): number[] {
  const value = raw
    .trim()
    .replaceAll("−", "-")
    .replace(/\s/g, "")
    .replace(/(?:€|Euro|EUR|%|Prozent|Stück|Jahre?|Tage?)$/i, "");
  if (!/^[+-]?\d[\d.,]*$/.test(value)) return [];
  const candidates: string[] = [];
  if (value.includes(",") && value.includes(".")) {
    if (value.lastIndexOf(",") > value.lastIndexOf(".")) {
      if (!/^[+-]?\d{1,3}(\.\d{3})+,\d+$/.test(value)) return [];
      candidates.push(value.replaceAll(".", "").replace(",", "."));
    } else {
      if (!/^[+-]?\d{1,3}(,\d{3})+\.\d+$/.test(value)) return [];
      candidates.push(value.replaceAll(",", ""));
    }
  } else if (value.includes(",")) {
    if (!/^[+-]?\d+,\d+$/.test(value)) return [];
    candidates.push(value.replace(",", "."));
  } else {
    if (/^[+-]?\d+(\.\d+)?$/.test(value)) candidates.push(value);
    if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(value)) candidates.push(value.replaceAll(".", ""));
  }
  return [...new Set(candidates.map(Number).filter(Number.isFinite))];
}

/** Amounts and rates are accepted as the correctly rounded hundredth, never within an error band. */
export const numberMatches = (raw: string, expected: number): boolean =>
  parseNumbers(raw).some((n) => Math.abs(n - expected) < 0.005001);

export function checkExercise(task: Exercise, values: string[]): boolean {
  return (
    values.length === task.fields.length &&
    task.fields.every((f, i) => numberMatches(values[i], f.answer))
  );
}
