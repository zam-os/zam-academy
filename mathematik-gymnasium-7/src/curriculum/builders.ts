import { fmt, MINUS } from "../exercises/format";
import type {
  AnswerField,
  DifficultyLevel,
  ExerciseTask,
  QuizQuestion,
} from "../model/types";

export const stageMeta = {
  1: {
    id: "stage-1-terme",
    title: "Terme mit Variablen",
    subtitle: "Aufstellen, deuten, berechnen und geschickt umformen",
    icon: "🧮",
    accent: "#1d58c9",
    badgeTitle: "Term-Profi",
    lehrplanLabel: "M7 LB 1: Terme mit Variablen",
  },
  2: {
    id: "stage-2-symmetrie",
    title: "Geometrische Figuren: Symmetrie und Winkel",
    subtitle: "Konstruieren, begründen, Vierecke ordnen und Winkel berechnen",
    icon: "📐",
    accent: "#0b7265",
    badgeTitle: "Symmetrie- und Winkel-Meister",
    lehrplanLabel: "M7 LB 2: Geometrische Figuren: Symmetrie und Winkel",
  },
  3: {
    id: "stage-3-gleichungen",
    title: "Lineare Gleichungen und Vertiefung der Prozentrechnung",
    subtitle: "Äquivalenzumformungen, Lösungsfälle und Prozent im Sachkontext",
    icon: "⚖️",
    accent: "#7334d6",
    badgeTitle: "Gleichungs-Löser",
    lehrplanLabel: "M7 LB 3: Lineare Gleichungen und Vertiefung der Prozentrechnung",
  },
  4: {
    id: "stage-4-daten",
    title: "Kenngrößen von Daten",
    subtitle: "Median, Quartile, Spannweite und Boxplots auswerten",
    icon: "📊",
    accent: "#b45309",
    badgeTitle: "Daten-Analyst",
    lehrplanLabel: "M7 LB 4: Kenngrößen von Daten",
  },
  5: {
    id: "stage-5-kongruenz",
    title: "Kongruenz, besondere Dreiecke und Dreieckskonstruktionen",
    subtitle: "Kongruenzsätze, Satz des Thales, Tangente, Umkreis & Inkreis",
    icon: "🧭",
    accent: "#be185d",
    badgeTitle: "Konstruktions-Ass",
    lehrplanLabel:
      "M7 LB 5: Kongruenz, besondere Dreiecke und Dreieckskonstruktionen",
  },
} as const;

/** Quick check with three distinct options (`options[0]` is always the right one; `quizOrder` shuffles). */
export function Q(
  question: string,
  correct: string,
  wrong1: string,
  wrong2: string,
  explanation: string,
): QuizQuestion {
  return {
    question,
    options: [correct, wrong1, wrong2],
    correctIndex: 0,
    explanation,
  };
}

/** Builds a generated task: Level 1 provides `hint` as `formulaHint`; Level 2 uses its own prompt and solution line. */
export function task(
  level: DifficultyLevel,
  level1Prompt: string,
  level2Prompt: string,
  fields: AnswerField[],
  hint: string,
  step1: string,
  step2: string,
  meta?: Record<string, number>,
  extra: Partial<Pick<ExerciseTask, "given" | "anyOrder" | "feedbackHint">> = {},
): ExerciseTask {
  return {
    prompt: level === 1 ? level1Prompt : level2Prompt,
    given: extra.given ?? [],
    ...(level === 1 && hint ? { formulaHint: hint } : {}),
    ...(extra.feedbackHint ? { feedbackHint: extra.feedbackHint } : {}),
    fields,
    ...(extra.anyOrder ? { anyOrder: extra.anyOrder } : {}),
    steps: [step1, step2],
    ...(meta ? { meta } : {}),
  };
}

/** " + 3" or " − 3" for continuing an algebraic or numeric expression. */
export function signed(k: number, digits = 2): string {
  return k < 0 ? ` ${MINUS} ${fmt(-k, digits)}` : ` + ${fmt(k, digits)}`;
}

/** Singular or plural noun phrase: `1 Schritt`, `3 Schritte`. */
export function countPhrase(value: number, one: string, many: string): string {
  return `${fmt(value, 0)} ${Math.abs(value) === 1 ? one : many}`;
}

/** Semicolon-separated list formatted in German decimal style. */
export function valueList(values: readonly number[], digits = 2): string {
  return values.map((v) => fmt(v, digits)).join("; ");
}
