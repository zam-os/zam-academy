import { fmt, MINUS } from "../exercises/format";
import type {
  AnswerField,
  DifficultyLevel,
  ExerciseTask,
  QuizQuestion,
} from "../model/types";

const svgIcon = (inner: string) =>
  `<svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const stageMeta = {
  1: {
    id: "stage-1-funktionen",
    title: "Funktion und Term",
    subtitle: "Eindeutige Zuordnungen, Fachbegriffe, Achsenpunkte und Änderung",
    icon: "𝑓",
    iconSvg: svgIcon(
      `<line x1="4" y1="23" x2="24" y2="23"/><line x1="6" y1="5" x2="6" y2="25"/><path d="M6 21 Q13 9 23 11"/><circle cx="15" cy="13" r="2.2" fill="currentColor"/>`,
    ),
    accent: "#1d58c9",
    badgeTitle: "Funktions-Entdecker",
    lehrplanLabel: "M8 LB 1: Funktion und Term",
  },
  2: {
    id: "stage-2-linear",
    title: "Lineare Funktionen",
    subtitle: "Geraden y = mx + t, Nullstellen, Schnittpunkte, Ungleichungen & Direkte Proportionalität",
    icon: "↗",
    iconSvg: svgIcon(
      `<line x1="4" y1="23" x2="24" y2="23"/><line x1="8" y1="4" x2="8" y2="25"/><line x1="4" y1="21" x2="24" y2="7"/><polyline points="12,15.5 18,15.5 18,11.3" stroke-width="1.6"/>`,
    ),
    accent: "#0b7265",
    badgeTitle: "Geraden-Profi",
    lehrplanLabel: "M8 LB 2: Lineare Funktionen",
  },
  3: {
    id: "stage-3-gebrochen",
    title: "Elementare gebrochen-rationale Funktionen",
    subtitle: "Hyperbeln, Definitionslücken, Asymptoten und indirekte Proportionalität",
    icon: "∿",
    iconSvg: svgIcon(
      `<line x1="14" y1="4" x2="14" y2="24" stroke-dasharray="2.5 2.5"/><path d="M4 17 Q11 18 12 24"/><path d="M16 4 Q17 10 24 11"/>`,
    ),
    accent: "#7334d6",
    badgeTitle: "Hyperbel-Lotse",
    lehrplanLabel: "M8 LB 3: Elementare gebrochen-rationale Funktionen",
  },
  4: {
    id: "stage-4-bruchterme",
    title: "Bruchterme und Bruchgleichungen",
    subtitle: "Kürzen, Hauptnenner, negative Exponenten, Bruchgleichungen & Formeln",
    icon: "÷",
    iconSvg: svgIcon(
      `<line x1="5" y1="14" x2="23" y2="14"/><circle cx="14" cy="8" r="2.2"/><path d="M9 21 H19"/>`,
    ),
    accent: "#b45309",
    badgeTitle: "Bruchterm-Meister",
    lehrplanLabel: "M8 LB 4: Bruchterme und Bruchgleichungen",
  },
  5: {
    id: "stage-5-laplace",
    title: "Laplace-Experimente",
    subtitle: "Zufall, relative Häufigkeit, Zählprinzip, Baumdiagramme & Wahrscheinlichkeit",
    icon: "🎲",
    iconSvg: svgIcon(
      `<rect x="5" y="5" width="18" height="18" rx="4"/><circle cx="10" cy="10" r="1.4" fill="currentColor"/><circle cx="14" cy="14" r="1.4" fill="currentColor"/><circle cx="18" cy="18" r="1.4" fill="currentColor"/>`,
    ),
    accent: "#be185d",
    badgeTitle: "Laplace-Stratege",
    lehrplanLabel: "M8 LB 5: Laplace-Experimente",
  },
  6: {
    id: "stage-6-lgs",
    title: "Lineare Gleichungssysteme",
    subtitle: "Zwei Gleichungen, Einsetzen & Schnittpunkt, Lösungsfälle",
    icon: "✕",
    iconSvg: svgIcon(
      `<line x1="4" y1="22" x2="24" y2="6"/><line x1="4" y1="8" x2="24" y2="20"/><circle cx="14" cy="14" r="2.5" fill="currentColor"/>`,
    ),
    accent: "#4338ca",
    badgeTitle: "System-Löser",
    lehrplanLabel: "M8 LB 6: Lineare Gleichungssysteme",
  },
  7: {
    id: "stage-7-kreis-zylinder",
    title: "Kreis und Zylinder",
    subtitle: "Kreiszahl π, Umfang, Fläche, Kreisteile, Prismen & gerade Kreiszylinder",
    icon: "◯",
    iconSvg: svgIcon(
      `<ellipse cx="14" cy="8" rx="8" ry="3.2"/><line x1="6" y1="8" x2="6" y2="20"/><line x1="22" y1="8" x2="22" y2="20"/><path d="M6 20 A8 3.2 0 0 0 22 20"/>`,
    ),
    accent: "#15803d",
    badgeTitle: "Kreis- und Körper-Ass",
    lehrplanLabel: "M8 LB 7: Kreis und Zylinder",
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
