import type {
  ChoiceField,
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  NumberField,
  Track,
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

/** Random cases and random option positions; Level 2 omits the scaffold. */
export function cases(id: string, bank: ChoiceCase[]): ExerciseGenerator {
  return {
    id,
    make(rng, level): ExerciseTask {
      const item = rng.pick(bank);
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
    lehrplan: tracks
      .map((track) => `C9 LB ${input.bindings[track]} (${track === "I" ? "I" : "II/III"})`)
      .join(" · "),
    whyItMatters: input.why,
    explanationHtml: input.html,
    formulas: [{ name: "Merksatz / Modell", html: input.rule, quantities: "" }],
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
