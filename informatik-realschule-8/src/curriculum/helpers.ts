import type {
  ChoiceField,
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  ModuleCode,
  NumberField,
  TextField,
} from "../model/types";
import { toleranceOf } from "../exercises/checker";
import { MINUS } from "../exercises/format";
import type { Rng } from "../exercises/rng";

/** An integer with the real minus sign, without thousands separator: "−25", "196". */
export function signed(value: number): string {
  return String(value).replace("-", MINUS);
}

export function numberField(label: string, answer: number, unit = "", digits = 0): NumberField {
  return { kind: "number", label, answer, unit, digits };
}

/**
 * Adds targeted hints for typical wrong results. A slip that lands within 5 %
 * of the answer or collides with an earlier slip for this task is dropped.
 */
export function withSlips(field: NumberField, ...slips: Array<[number, string]>): NumberField {
  const kept: Array<{ value: number; hint: string }> = [];
  for (const [value, hint] of slips) {
    if (
      Math.abs(value - field.answer) <=
      Math.max(0.05 * Math.abs(field.answer), 10 ** -field.digits / 2)
    ) {
      continue;
    }
    const collides = kept.some(
      (earlier) =>
        Math.abs(value - earlier.value) <=
        Math.max(
          toleranceOf({ ...field, answer: earlier.value }),
          toleranceOf({ ...field, answer: value }),
        ),
    );
    if (!collides) kept.push({ value, hint });
  }
  return kept.length ? { ...field, slips: kept } : field;
}

/**
 * A short code to type. Slips that equal an accepted answer are dropped, so
 * a hint never contradicts a correct entry.
 */
export function textField(
  label: string,
  answers: string[],
  placeholder: string,
  slips: Array<[string, string]> = [],
  caseSensitive = false,
): TextField {
  const norm = (text: string) => {
    const plain = text.replace(/\s+/g, "");
    return caseSensitive ? plain : plain.toUpperCase();
  };
  const accepted = new Set(answers.map(norm));
  const kept = slips
    .filter(([value]) => !accepted.has(norm(value)))
    .map(([value, hint]) => ({ value, hint }));
  return {
    kind: "text",
    label,
    answers,
    placeholder,
    ...(caseSensitive ? { caseSensitive } : {}),
    ...(kept.length ? { slips: kept } : {}),
  };
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
  "1.1": "Texterfassung",
  "1.2": "Einführung in die Programmierung",
  "1.3": "Einführung in die Textverarbeitung",
  "1.4": "Informationsaustausch",
  "1.5": "Einführung in die Bildbearbeitung",
  "1.6": "Einführung in die Tabellenkalkulation",
  "1.7": "Informationsbeschaffung und -präsentation",
  "1.8": "Grundlagen elektronischer Datenverarbeitung",
  "1.9": "Digitale Medien",
};

export function lesson(
  stageId: string,
  module: ModuleCode,
  stepNumber: number,
  input: LessonInput,
): Lesson {
  return {
    id: input.id,
    stageId,
    stepNumber,
    title: input.title,
    subtitle: input.subtitle,
    module,
    lehrplan: `IT ${module} ${MODULE_TITLES[module]}`,
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
