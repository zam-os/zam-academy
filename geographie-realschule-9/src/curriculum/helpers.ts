import type { Check, Workshop, WrittenTask } from "../model/types";

export const check = (
  question: string,
  answer: string,
  wrong: [string, string],
  explanation: string,
): Check => ({ question, answer, wrong, explanation });

/** The author supplies the order of events or process steps; learners receive a shuffled copy. */
export const timeline = (entries: Array<[string, string]>, conclusion: string): Workshop => ({
  kind: "timeline",
  title: "Abläufe einordnen",
  instruction:
    "Bringe die Schritte mit den Pfeilen in eine sinnvolle Reihenfolge: den ersten nach oben. Prüfe dann deine Reihenfolge.",
  categories: [],
  entries: entries.map(([text, feedback], target) => ({ text, target, feedback })),
  conclusion,
});

export const classify = (
  title: string,
  categories: string[],
  entries: Array<[string, number, string]>,
  conclusion: string,
  material?: string,
  materialLabel = "Für diese Übung verfasster Darstellungstext · keine Messreihe oder Originalquelle",
): Workshop => ({
  kind: "classify",
  title,
  instruction:
    "Ordne jede Aussage ein. Begründe deine Wahl zunächst für dich und prüfe anschließend die Zuordnung.",
  material,
  materialLabel,
  categories,
  entries: entries.map(([text, target, feedback]) => ({ text, target, feedback })),
  conclusion,
});

export const writing = (
  prompt: string,
  hints: [string, string],
  model: string,
  criteria: [string, string, string],
): WrittenTask => ({ prompt, hints, model, criteria });

/** Two deliberately authored responses; no model grades the learner's own text. */
export function tasks(
  prompt: string,
  model: string,
  criteria: [string, string, string],
  transferPrompt: string,
  transferModel: string,
  transferCriteria: [string, string, string],
): Record<1 | 2, WrittenTask> {
  return {
    1: writing(prompt, [criteria[0], criteria[1]], model, criteria),
    2: writing(
      transferPrompt,
      [transferCriteria[0], transferCriteria[1]],
      transferModel,
      transferCriteria,
    ),
  };
}
