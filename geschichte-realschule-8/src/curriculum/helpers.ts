import type { Check, Workshop, WrittenTask } from "../model/types";

export const check = (
  question: string,
  answer: string,
  wrong: [string, string],
  explanation: string,
): Check => ({ question, answer, wrong, explanation });

/** The author supplies chronological order; learners receive a shuffled copy. */
export const timeline = (
  entries: Array<[string, string]>,
  conclusion: string,
): Workshop => ({
  kind: "timeline",
  title: "Ereignisse einordnen",
  instruction:
    "Bringe die Ereignisse mit den Pfeilen in zeitliche Reihenfolge: das früheste nach oben. Prüfe dann deine Reihenfolge.",
  categories: [],
  entries: entries.map(([text, feedback], target) => ({
    text,
    target,
    feedback,
  })),
  conclusion,
});

export const classify = (
  title: string,
  categories: string[],
  entries: Array<[string, number, string]>,
  conclusion: string,
  material?: string,
  materialLabel = "Für diese Übung verfasster Darstellungstext · keine historische Originalquelle",
): Workshop => ({
  kind: "classify",
  title,
  instruction:
    "Ordne jede Aussage ein. Begründe deine Wahl zunächst für dich und prüfe anschließend die Zuordnung.",
  material,
  materialLabel,
  categories,
  entries: entries.map(([text, target, feedback]) => ({
    text,
    target,
    feedback,
  })),
  conclusion,
});

export const writing = (
  prompt: string,
  hints: [string, string],
  model: string,
  criteria: [string, string, string],
): WrittenTask => ({ prompt, hints, model, criteria });
