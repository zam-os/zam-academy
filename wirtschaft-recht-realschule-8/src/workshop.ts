import { shuffle } from "./format";
import type { CaseFile, Workshop } from "./model/types";

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

/** The options of a case step in the order the learner sees them, with the right one's new position. */
export function shownOptions(
  file: CaseFile,
  step: number,
  key: string,
): { options: string[]; answer: number } {
  const source = file.steps[step];
  const order = shuffle(
    source.options.map((_, i) => i),
    `${key}:case:${step}`,
  );
  return { options: order.map((i) => source.options[i]), answer: order.indexOf(source.answer) };
}

/** A case is solved when every step has the right option; an unanswered step is wrong. */
export function checkCase(file: CaseFile, key: string, choices: number[]): boolean[] {
  return file.steps.map((_, i) => choices[i] === shownOptions(file, i, key).answer);
}

export function canReviewDraft(text: string): boolean {
  return text.trim().length >= 20;
}

export function canAcceptSelfAssessment(text: string, criteria: boolean[]): boolean {
  return canReviewDraft(text) && criteria.length === 3 && criteria.every(Boolean);
}
