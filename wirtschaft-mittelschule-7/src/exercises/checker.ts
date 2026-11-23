import type { Exercise } from "../model/types";

/** Accept German/English decimals, grouping and an optional trailing unit. */
export function parseNumbers(raw: string): number[] {
  const value = raw
    .trim()
    .replaceAll("−", "-")
    .replace(/\s/g, "")
    .replace(
      /(?:€\/kg|€\/l|€\/Std\.?|ct\/kWh|€|Euro|EUR|%|Prozentpunkte?|Stück|Punkte?|Jahre?|Tage?|Wochen?|Std\.?|Stunden?|Min\.?|Minuten?|kWh|Watt|W|ct|Cent)$/i,
      "",
    );
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
    // German grouping wins: "35.000" is thirty-five thousand, never 35.
    if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(value)) candidates.push(value.replaceAll(".", ""));
    else if (/^[+-]?\d+(\.\d+)?$/.test(value)) candidates.push(value);
  }
  return [...new Set(candidates.map(Number).filter(Number.isFinite))];
}

/** Accept the correctly rounded hundredth (cents, percent, kWh), never an error band. */
export const numberMatches = (raw: string, expected: number): boolean =>
  parseNumbers(raw).some((n) => Math.abs(n - expected) < 0.005001);

export function checkExercise(task: Exercise, values: string[]): boolean {
  return (
    values.length === task.fields.length &&
    task.fields.every((f, i) => numberMatches(values[i], f.answer))
  );
}
