import type { LabDefinition, LabValues } from "../model/types";
import { open, rect, text } from "./svg";

/** One case of a sorting workshop: what the learner reads, the right category, why. */
export interface WorkshopCase {
  /** Short label for the drawing, at most about 34 characters. */
  short: string;
  /** The full case the learner decides on. */
  text: string;
  /** Index into the categories. */
  answer: number;
  /** Shown once the case is sorted correctly. */
  why: string;
  /** Shown when the case is sorted into a wrong category. */
  hint: string;
}

export interface WorkshopGoal {
  text: string;
  /** Indices of the cases that must all be sorted correctly. */
  cases: number[];
}

/**
 * A sorting workshop: every case gets a category from a drop-down, the
 * drawing shows which cases fit, and each goal names cases that must all be
 * right. Nothing is sorted at the start, so no goal is reached.
 */
export function caseLab(input: {
  kind: string;
  title: string;
  intro: string;
  /** What the learner sorts into, e.g. "Eingabe", "Ausgabe". */
  categories: string[];
  cases: WorkshopCase[];
  goals: WorkshopGoal[];
}): LabDefinition {
  const key = (index: number) => `c${index}`;
  const correct = (values: LabValues, index: number) =>
    values[key(index)] === input.cases[index].answer + 1;
  const solved: LabValues = {};
  input.cases.forEach((entry, index) => {
    solved[key(index)] = entry.answer + 1;
  });
  const witnesses: Record<string, LabValues> = {};
  input.goals.forEach((_, index) => {
    witnesses[`g${index + 1}`] = solved;
  });
  return {
    kind: input.kind,
    title: input.title,
    intro: input.intro,
    params: input.cases.map((entry, index) => ({
      key: key(index),
      type: "choice" as const,
      label: `Fall ${index + 1}: ${entry.text}`,
      options: [
        { value: 0, label: "– zuordnen –" },
        ...input.categories.map((label, category) => ({ value: category + 1, label })),
      ],
      value: 0,
    })),
    readouts: [
      {
        key: "score",
        label: "Richtig zugeordnet",
        emphasis: true,
        compute: (values) =>
          `${input.cases.filter((_, index) => correct(values, index)).length} von ${input.cases.length}`,
      },
      ...input.cases.map((entry, index) => ({
        key: `f${index}`,
        label: `Fall ${index + 1}`,
        compute: (values: LabValues) =>
          values[key(index)] === 0
            ? "noch offen"
            : correct(values, index)
              ? `✓ ${entry.why}`
              : `✗ ${entry.hint}`,
      })),
    ],
    goals: input.goals.map((goal, index) => ({
      id: `g${index + 1}`,
      text: goal.text,
      check: (values) => goal.cases.every((caseIndex) => correct(values, caseIndex)),
    })),
    witnesses,
    view: {
      render(values) {
        const columns = input.cases.length > 4 ? 2 : 1;
        const rows = Math.ceil(input.cases.length / columns);
        const width = columns === 2 ? 236 : 472;
        const height = Math.min(62, (300 - (rows - 1) * 10) / rows);
        let out = open(input.title);
        input.cases.forEach((entry, index) => {
          const col = columns === 2 ? index % 2 : 0;
          const row = columns === 2 ? Math.floor(index / 2) : index;
          const x = 24 + col * 248;
          const y = 20 + row * (height + 10);
          const chosen = values[key(index)];
          const state = chosen === 0 ? "open" : correct(values, index) ? "ok" : "bad";
          const fill = state === "ok" ? "lab-fill-ok" : state === "bad" ? "lab-fill-b" : "lab-panel";
          out += rect(x, y, width, height, fill, 'rx="12"');
          out += text(x + 14, y + 24, `${index + 1}. ${entry.short}`, "lab-text-small");
          out += text(
            x + 14,
            y + 44,
            chosen === 0
              ? "? noch nicht zugeordnet"
              : `${state === "ok" ? "✓" : "✗"} ${input.categories[chosen - 1]}`,
            state === "ok" ? "lab-text-ok" : state === "bad" ? "lab-text-bad" : "lab-text-muted",
          );
        });
        return `${out}</svg>`;
      },
    },
  };
}
