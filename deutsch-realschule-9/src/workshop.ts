import { shuffle } from "./format";
import type {
  CaseFile,
  ChooseItem,
  CommaItem,
  MarkWorkshop,
  SortWorkshop,
} from "./model/types";

export function initialOrder(workshop: SortWorkshop, key: string): number[] {
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
export function checkSort(workshop: SortWorkshop, answer: number[]): boolean[] {
  if (answer.length !== workshop.entries.length) return workshop.entries.map(() => false);
  if (workshop.kind === "timeline") {
    if (new Set(answer).size !== answer.length) return workshop.entries.map(() => false);
    return workshop.entries.map(
      (_, position) => workshop.entries[answer[position]]?.target === position,
    );
  }
  return workshop.entries.map((entry, index) => answer[index] === entry.target);
}

/** The label of every piece of a marked text: `undefined` where the learner marked nothing. */
export type Marking = Array<number | undefined>;

/**
 * One result per piece: a target is right with exactly its label, any other
 * piece is right while it stays unmarked.
 */
export function checkMarks(workshop: MarkWorkshop, marking: Marking): boolean[] {
  return workshop.text.map((segment, i) => marking[i] === segment.label);
}

/** The pieces that carry a label: the ones the learner has to find. */
export const markTargets = (workshop: MarkWorkshop): number[] =>
  workshop.text.flatMap((segment, i) => (segment.label === undefined ? [] : [i]));

/** Toggles one piece: a second click with the same label takes the mark away. */
export function toggleMark(marking: Marking, index: number, label: number): Marking {
  const next = [...marking];
  next[index] = next[index] === label ? undefined : label;
  return next;
}

/** A comma set is right when exactly the commas of the sentence stand, no more and no fewer. */
export function checkCommas(item: CommaItem, chosen: number[]): boolean {
  const want = [...item.commas].sort((a, b) => a - b);
  const have = [...new Set(chosen)].sort((a, b) => a - b);
  return want.length === have.length && want.every((gap, i) => gap === have[i]);
}

/** The sentence with its commas, as the solution shows it. */
export function commaSentence(item: CommaItem): string {
  return item.words
    .map((word, i) => (item.commas.includes(i) ? `${word},` : word))
    .join(" ");
}

export function checkChoose(item: ChooseItem, chosen: number): boolean {
  return chosen === item.answer;
}

/** The sentence with the right option in its gap, as the solution shows it. */
export function chooseSentence(item: ChooseItem): string {
  return `${item.before}${item.options[item.answer]}${item.after}`;
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
