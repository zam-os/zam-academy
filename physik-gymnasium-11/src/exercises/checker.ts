import type { ExerciseTask } from "../model/types";

/**
 * Every reading of a number the way a learner types it: "2,5", "2.5",
 * "1 500", "1.234,5", "1.000.000", "-3,2". A comma is always the decimal
 * separator; several points group thousands. A single point followed by
 * exactly three digits is ambiguous ("1.500" is 1,5 or the German thousands
 * 1500), so both readings are returned, the decimal one first; the checker
 * accepts whichever matches. A unit typed after the number is ignored.
 * Empty when there is no number.
 */
export function parseNumberCandidates(raw: string): number[] {
  let text = raw.trim().replaceAll("−", "-").replace(/\s+/g, "");
  if (!text) return [];
  // Drop a trailing unit such as "Pa" or "kWh", but keep digits and signs.
  text = text.replace(/[^0-9.,+-]+$/u, "");
  if (!/^[+-]?[0-9.,]+$/.test(text)) return [];

  const hasComma = text.includes(",");
  const hasPoint = text.includes(".");
  const candidates: string[] = [];
  if (hasComma && hasPoint) {
    // The last separator is the decimal one, the others group thousands.
    const lastComma = text.lastIndexOf(",");
    const lastPoint = text.lastIndexOf(".");
    const decimal = lastComma > lastPoint ? "," : ".";
    const grouping = decimal === "," ? "." : ",";
    candidates.push(text.split(grouping).join("").replace(decimal, "."));
  } else if (hasComma) {
    if (text.indexOf(",") !== text.lastIndexOf(",")) return [];
    candidates.push(text.replace(",", "."));
  } else if (hasPoint) {
    const single = text.indexOf(".") === text.lastIndexOf(".");
    const grouped = /^[+-]?\d{1,3}(\.\d{3})+$/.test(text);
    if (single) candidates.push(text);
    if (grouped) candidates.push(text.split(".").join(""));
    if (candidates.length === 0) return [];
  } else {
    candidates.push(text);
  }
  const values = candidates
    .map(Number)
    .filter((value) => Number.isFinite(value));
  return [...new Set(values)];
}

export type CheckStatus = "correct" | "wrong" | "invalid";

export interface CheckResult {
  status: CheckStatus;
  parsed: number | null;
  /** How far off, as a fraction of the expected value (wrong answers only). */
  relativeError?: number;
}

/** The tolerance a task accepts: relative (default 2 %) or absolute, whichever is wider. */
export function toleranceOf(task: ExerciseTask): number {
  const relative = (task.tolerance ?? 0.02) * Math.abs(task.answer);
  const absolute = task.absTolerance ?? 0;
  // Rounding to the shown decimals must always pass.
  const rounding = 0.51 * 10 ** -task.digits;
  return Math.max(relative, absolute, rounding);
}

export function checkAnswer(task: ExerciseTask, raw: string): CheckResult {
  const candidates = parseNumberCandidates(raw);
  if (candidates.length === 0) return { status: "invalid", parsed: null };
  const tolerance = toleranceOf(task);
  const hit = candidates.find(
    (value) => Math.abs(value - task.answer) <= tolerance,
  );
  if (hit !== undefined) return { status: "correct", parsed: hit };
  // Report the reading closest to the expected answer, so the hint fits.
  const parsed = candidates.reduce((best, value) =>
    Math.abs(value - task.answer) < Math.abs(best - task.answer) ? value : best,
  );
  const relativeError =
    task.answer === 0
      ? Math.abs(parsed)
      : Math.abs(parsed - task.answer) / Math.abs(task.answer);
  return { status: "wrong", parsed, relativeError };
}

/**
 * A hint for a wrong answer without giving the result away: the common slips
 * are a unit factor (1000, 100, 60, 3600) or a swapped division.
 */
export function wrongAnswerHint(
  result: CheckResult,
  task: ExerciseTask,
): string {
  if (result.status !== "wrong" || result.parsed === null) return "";
  const ratio = result.parsed / task.answer;
  const near = (target: number) => Math.abs(ratio - target) / target < 0.03;
  if (near(1000) || near(1 / 1000)) {
    return "Der Wert liegt um den Faktor 1000 daneben. Prüfe die Einheit: kilo, milli oder Grundeinheit?";
  }
  if (near(100) || near(1 / 100)) {
    return "Der Wert liegt um den Faktor 100 daneben. Prüfe die Umrechnung, zum Beispiel cm² in m² oder Prozent.";
  }
  if (near(10000) || near(1 / 10000)) {
    return "Der Wert liegt um den Faktor 10 000 daneben: 1 m² = 10 000 cm².";
  }
  if (near(60) || near(1 / 60) || near(3600) || near(1 / 3600)) {
    return "Der Wert liegt um einen Zeitfaktor daneben. Rechne Minuten oder Stunden in Sekunden um, oder umgekehrt.";
  }
  if (Math.abs(ratio * ratio - 1) < 0.001 && ratio < 0) {
    return "Das Vorzeichen stimmt nicht.";
  }
  // A swapped division gives the reciprocal: parsed · answer ≈ 1.
  if (task.answer !== 0 && Math.abs(result.parsed * task.answer - 1) < 0.03) {
    return "Hast du vielleicht durch den falschen Wert geteilt? Prüfe, welche Größe gesucht ist.";
  }
  return "Nicht ganz. Prüfe Formel, Einheiten und die Rechnung Schritt für Schritt.";
}
