import type { Lesson, Workshop, WrittenTask } from "../model/types";

type Task = [prompt: string, hints: [string, string], model: string, criteria: [string, string, string]];

const writing = ([prompt, hints, model, criteria]: Task): WrittenTask => ({ prompt, hints, model, criteria });

export function lesson(lb: number, options: Omit<Lesson, "lb" | "quiz" | "tasks"> & {
  check: [question: string, answer: string, wrong: [string, string], explanation: string];
  guided: Task;
  transfer: Task;
}): Lesson {
  const { check: [question, answer, wrong, explanation], guided, transfer, ...content } = options;
  return { ...content, lb, quiz: { question, answer, wrong, explanation }, tasks: { 1: writing(guided), 2: writing(transfer) } };
}

/** Entries are authored in chronological order and shuffled when rendered. */
export const timeline = (entries: Array<[string, string]>, conclusion: string): Workshop => ({
  kind: "timeline",
  title: "Zeitleiste ordnen",
  instruction: "Bringe die Ereignisse mit den Pfeilen in zeitliche Reihenfolge. Das früheste steht oben.",
  categories: [],
  entries: entries.map(([text, feedback], target) => ({ text, target, feedback })),
  conclusion,
});

export const classify = (
  title: string,
  categories: string[],
  entries: Array<[string, number, string]>,
  conclusion: string,
): Workshop => ({
  kind: "classify",
  title,
  instruction: "Ordne die Aussagen zu. Prüfe anschließend deine Zuordnung und lies die Begründungen.",
  categories,
  entries: entries.map(([text, target, feedback]) => ({ text, target, feedback })),
  conclusion,
});
