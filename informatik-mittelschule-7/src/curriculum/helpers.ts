import type {
  ChoiceField,
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  ModuleCode,
  NumberField,
} from "../model/types";
import type { Rng } from "../exercises/rng";

export function numberField(label: string, answer: number, unit = "", digits = 0): NumberField {
  return { kind: "number", label, answer, unit, digits };
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
 * draws a transfer case, so the level changes the task, not only the wording.
 */
export function cases(id: string, guided: ChoiceCase[], transfer: ChoiceCase[]): ExerciseGenerator {
  return {
    id,
    make(rng, level): ExerciseTask {
      const item = rng.pick(level === 1 ? guided : transfer);
      return {
        prompt: level === 1 ? `${item.prompt} Wähle die passende Antwort.` : item.prompt,
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
  why: string;
  /** Explanation with a worked `<div class="example">` and the `<div class="merke">` rule. */
  html: string;
  /** The key rule for the Fachbegriffe view, as HTML. */
  rule: string;
  /** Key terms for the Fachbegriffe view: name, HTML, what the parts mean. */
  terms: Array<[string, string, string]>;
  /** Question, right answer, two plausible wrong answers, explanation of the right one. */
  quiz: [string, string, string, string, string];
  lab: LabDefinition;
  exercises: ExerciseGenerator[];
}

export const MODULE_TITLES: Record<ModuleCode, string> = {
  "1": "Digitaler Informationsaustausch",
  "2": "Datenverarbeitung",
  "3": "Programmieren",
};

export function lesson(
  stageId: string,
  module: ModuleCode,
  stepNumber: number,
  input: LessonInput,
): Lesson {
  return {
    id: input.id,
    tracks: ["R", "M"],
    stageId,
    stepNumber,
    title: input.title,
    subtitle: input.subtitle,
    module,
    lehrplan: `R7 und M7 · LB ${module} · ${MODULE_TITLES[module]}`,
    whyItMatters: input.why,
    explanationHtml: input.html,
    formulas: [
      { name: "Merksatz", html: input.rule, quantities: "" },
      ...input.terms.map(([name, html, quantities]) => ({ name, html, quantities })),
    ],
    quiz: {
      question: input.quiz[0],
      options: [input.quiz[1], input.quiz[2], input.quiz[3]],
      correctIndex: 0,
      explanation: input.quiz[4],
    },
    lab: input.lab,
    exercises: input.exercises,
    requiredCorrect: 3,
    celebrationMessage: `Du kannst „${input.title}“ jetzt an Beispielen erklären und anwenden.`,
  };
}

type CasePair = [ChoiceCase, ChoiceCase];

/** Two distinct practice strands, each with two guided and two transfer cases. */
export function practice(
  firstGuided: CasePair,
  firstTransfer: CasePair,
  secondGuided: CasePair,
  secondTransfer: CasePair,
): ExerciseGenerator[] {
  return [cases("erkennen", firstGuided, firstTransfer), cases("anwenden", secondGuided, secondTransfer)];
}

export function explain(paragraphs: string[], example: string, rule: string): string {
  return paragraphs.map((text) => `<p>${text}</p>`).join("") +
    `<div class="example"><strong>Beispiel</strong><p>${example}</p></div><div class="merke"><strong>Merke:</strong> ${rule}</div>`;
}
