import type { Entry, Exercise, LearnerEntry } from "../model/types";
import { ACCOUNTS } from "../finance";

/** Accept German/English decimals, grouping and an optional trailing unit. */
export function parseNumbers(raw: string): number[] {
  const value = raw
    .trim()
    .replaceAll("−", "-")
    .replace(/\s/g, "")
    .replace(/(?:€|Euro|EUR|%|Prozentpunkte?|Stück|Jahre?|Tage?)$/i, "");
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
    // German grouping wins: "35.000" is thirty-five thousand, never 35. A point
    // counts as a decimal point only when no group of three digits follows it.
    if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(value)) candidates.push(value.replaceAll(".", ""));
    else if (/^[+-]?\d+(\.\d+)?$/.test(value)) candidates.push(value);
  }
  return [...new Set(candidates.map(Number).filter(Number.isFinite))];
}
/** Exercises accept the correctly rounded hundredth (cents, percent), never a percentage error band. */
export const numberMatches = (raw: string, expected: number): boolean =>
  parseNumbers(raw).some((n) => Math.abs(n - expected) < 0.005001);

export function checkBooking(expected: Entry[], actual: LearnerEntry[]): boolean {
  if (!expected.length) return actual.every((e) => !e.account && !e.amount);
  const target = new Map<string, number>();
  for (const e of expected)
    target.set(
      `${e.side}:${e.account}`,
      (target.get(`${e.side}:${e.account}`) ?? 0) + Math.round(e.amount * 100),
    );
  const totals = new Map<string, number>();
  for (const row of actual) {
    if (!row.account && !row.amount.trim()) continue;
    const key = `${row.side}:${row.account}`;
    if (!ACCOUNTS[row.account] || !target.has(key)) return false;
    const candidates = parseNumbers(row.amount).filter(
      (n) => n > 0 && Math.abs(n * 100 - Math.round(n * 100)) < 0.000001,
    );
    // Resolve a single ambiguous grouping using that account's expected total.
    const remaining = (target.get(key) ?? 0) - (totals.get(key) ?? 0);
    const matching = candidates.filter((n) => Math.round(n * 100) <= remaining);
    const amount = matching.length ? Math.max(...matching) : NaN;
    if (!Number.isFinite(amount)) return false;
    totals.set(key, (totals.get(key) ?? 0) + Math.round(amount * 100));
  }
  return (
    totals.size === target.size && [...target].every(([key, amount]) => totals.get(key) === amount)
  );
}
export function checkExercise(task: Exercise, values: string[], booking: LearnerEntry[]): boolean {
  return (
    values.length === task.fields.length &&
    task.fields.every((f, i) => numberMatches(values[i], f.answer)) &&
    checkBooking(task.booking, booking)
  );
}
