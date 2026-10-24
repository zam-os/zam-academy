import type { Workshop } from "./types";

export function checkWorkshop(
  workshop: Workshop,
  answers: readonly number[],
): boolean[] {
  return workshop.entries.map(
    (entry, index) => answers[index] === entry.target,
  );
}
export function workshopSolved(
  workshop: Workshop,
  answers: readonly number[],
): boolean {
  return (
    workshop.entries.length > 0 &&
    answers.length === workshop.entries.length &&
    checkWorkshop(workshop, answers).every(Boolean)
  );
}
