import type { Workshop } from "./model/types";

export const esc = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export function shuffle<T>(items: readonly T[], key: string): T[] {
  let seed = 2166136261;
  for (const char of key) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function initialOrder(workshop: Workshop, key: string): number[] {
  const order = shuffle(
    workshop.entries.map((_, index) => index),
    key,
  );
  // A timeline never starts already solved, including a two-entry workshop.
  if (workshop.kind === "timeline" && order.every((entry, index) => entry === index))
    order.reverse();
  return order;
}

export function moveEntry(order: number[], index: number, delta: -1 | 1): number[] {
  const next = [...order];
  if (index < 0 || index >= next.length || index + delta < 0 || index + delta >= next.length)
    return next;
  [next[index], next[index + delta]] = [next[index + delta], next[index]];
  return next;
}

/** Reject incomplete answers, duplicates and out-of-range entries, not just wrong values. */
export function checkWorkshop(workshop: Workshop, answer: number[]): boolean[] {
  if (answer.length !== workshop.entries.length) return workshop.entries.map(() => false);
  if (workshop.kind === "timeline") {
    if (new Set(answer).size !== answer.length) return workshop.entries.map(() => false);
    return workshop.entries.map(
      (_, position) => workshop.entries[answer[position]]?.target === position,
    );
  }
  return workshop.entries.map((entry, index) => answer[index] === entry.target);
}

export function canReviewDraft(text: string): boolean {
  return text.trim().length >= 20;
}

export function canAcceptSelfAssessment(text: string, criteria: boolean[]): boolean {
  return canReviewDraft(text) && criteria.length === 3 && criteria.every(Boolean);
}

/**
 * The first year named in a text such as "753 v. Chr.: …" or "117 n. Chr.: …";
 * years v. Chr. are negative. "478/477 v. Chr." counts as −478.
 */
export function yearOf(text: string): number | null {
  const match = text.match(/(\d{1,5})(?:\/\d{1,5})?\s+(v|n)\.\s?Chr\./);
  if (!match) return null;
  const year = Number(match[1]);
  return match[2] === "v" ? -year : year;
}

/** "753 v. Chr.", "117 n. Chr."; there is no year 0. */
export function yearLabel(year: number): string {
  return year < 0 ? `${-year} v. Chr.` : `${year} n. Chr.`;
}

/**
 * Position on the time strip in percent. The scale runs from 3000 v. Chr. to
 * 1000 n. Chr. between 12 % and 88 %; earlier years fall into the
 * "Vorgeschichte" zone on the left, later ones into the zone on the right.
 */
export const STRIP = { from: -3000, to: 1000, left: 12, right: 88 } as const;
export function stripPosition(year: number): number {
  if (year < STRIP.from) return 5;
  if (year > STRIP.to) return 95;
  return STRIP.left + ((year - STRIP.from) / (STRIP.to - STRIP.from)) * (STRIP.right - STRIP.left);
}

/** The highlighted part of the strip for a span, at least one percent wide. */
export function stripRange(span: [number, number]): { left: number; width: number } {
  const start = span[0] < STRIP.from ? 0 : span[0] > STRIP.to ? 90 : stripPosition(span[0]);
  const end = span[1] > STRIP.to ? 100 : span[1] < STRIP.from ? 10 : stripPosition(span[1]);
  const left = Math.min(start, end);
  return { left, width: Math.max(1, Math.abs(end - start)) };
}
