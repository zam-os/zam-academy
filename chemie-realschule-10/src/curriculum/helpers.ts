import type {
  ChoiceField,
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  NumberField,
  Track,
} from "../model/types";
import { MINUS } from "../exercises/format";
import type { Rng } from "../exercises/rng";

/** An integer with the real minus sign, without thousands separator: "−25", "2852". */
export function signed(value: number): string {
  return String(value).replace("-", MINUS);
}

export function numberField(label: string, answer: number, unit = "", digits = 0): NumberField {
  return { kind: "number", label, answer, unit, digits };
}

/**
 * Adds targeted hints for typical wrong results. A slip that lands within 5 %
 * of the answer for this task is dropped, so it never marks a right answer.
 */
export function withSlips(field: NumberField, ...slips: Array<[number, string]>): NumberField {
  const kept = slips
    .filter(([value]) => Math.abs(value - field.answer) > Math.max(0.05 * Math.abs(field.answer), 10 ** -field.digits / 2))
    .map(([value, hint]) => ({ value, hint }));
  return kept.length ? { ...field, slips: kept } : field;
}

export function choiceField(
  rng: Rng,
  label: string,
  answer: string,
  others: string[],
): ChoiceField {
  const options = rng.shuffle([...new Set([answer, ...others])]);
  return { kind: "choice", label, options, correctIndex: options.indexOf(answer) };
}

export interface ChoiceCase {
  prompt: string;
  answer: string;
  others: string[];
  why: string;
  hint: string;
}

/** A choice case in one line: prompt, answer, two plausible wrong answers, why, hint. */
export function cc(
  prompt: string,
  answer: string,
  others: [string, string],
  why: string,
  hint: string,
): ChoiceCase {
  return { prompt, answer, others, why, hint };
}

/**
 * Level 1 draws a guided case and shows its hint as the scaffold; Level 2
 * draws a transfer case in the style of the Abschlussprüfung, so the level
 * changes the task, not only the wording.
 */
export function cases(id: string, guided: ChoiceCase[], transfer: ChoiceCase[]): ExerciseGenerator {
  return {
    id,
    make(rng, level): ExerciseTask {
      const item = rng.pick(level === 1 ? guided : transfer);
      return {
        prompt: level === 1 ? `${item.prompt} Wähle die fachlich passende Aussage.` : item.prompt,
        given: [],
        formulaHint: item.hint,
        fields: [choiceField(rng, "Deine Entscheidung", item.answer, item.others)],
        steps: [item.hint, item.why, `<strong>${item.answer}</strong>`],
      };
    },
  };
}

interface LessonInput {
  id: string;
  title: string;
  subtitle: string;
  bindings: Partial<Record<Track, number>>;
  why: string;
  html: string;
  rule: string;
  /** Key terms or formulas for the Formelsammlung: name, HTML, what the letters mean. */
  terms?: Array<[string, string, string]>;
  /** Label override for Wahlbereiche, e.g. "C10 LB 5.1 (I) · C10 LB 6.2 (II/III)". */
  lehrplan?: string;
  quiz: [string, string, string, string];
  lab: LabDefinition;
  exercises: ExerciseGenerator[];
}

export function lesson(stageId: string, stepNumber: number, input: LessonInput): Lesson {
  const tracks = Object.keys(input.bindings) as Track[];
  return {
    id: input.id,
    stageId,
    stepNumber,
    title: input.title,
    subtitle: input.subtitle,
    tracks,
    bindings: input.bindings,
    lehrplan:
      input.lehrplan ??
      tracks
        .map((track) => `C10 LB ${input.bindings[track]} (${track === "I" ? "I" : "II/III"})`)
        .join(" · "),
    whyItMatters: input.why,
    explanationHtml: input.html,
    formulas: [
      { name: "Merksatz / Modell", html: input.rule, quantities: "" },
      ...(input.terms ?? []).map(([name, html, quantities]) => ({ name, html, quantities })),
    ],
    quiz: {
      question: input.quiz[0],
      options: [input.quiz[1], input.quiz[2]],
      correctIndex: 0,
      explanation: input.quiz[3],
    },
    lab: input.lab,
    exercises: input.exercises,
    requiredCorrect: 3,
    celebrationMessage: `Du kannst ${input.title} jetzt an Beispielen erklären.`,
  };
}
