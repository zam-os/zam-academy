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
