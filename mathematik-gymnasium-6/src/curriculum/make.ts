import type { ExerciseGenerator, FormulaEntry, Lesson, QuizQuestion } from "../model/types";
import { makeLesson } from "./builders";
import { familyLab, type GoalSpec, type LabKind } from "./labs";

export const F = (name: string, html: string, quantities: string): FormulaEntry => ({
  name,
  html,
  quantities,
});

export const Q = (
  question: string,
  correct: string,
  wrong1: string,
  wrong2: string,
  explanation: string,
): QuizQuestion => ({
  question,
  options: [correct, wrong1, wrong2],
  correctIndex: 0,
  explanation,
});

export const ex = (body: string, example: string, merke: string): string =>
  `<p>${body}</p><div class="example">${example}</div><div class="merke"><strong>Merke:</strong> ${merke}</div>`;

export function lesson(
  stage: number,
  step: number,
  section: number | null,
  id: string,
  title: string,
  subtitle: string,
  why: string,
  html: string,
  formulas: FormulaEntry[],
  quiz: QuizQuestion,
  kind: LabKind,
  labTitle: string,
  intro: string,
  goals: GoalSpec[],
  exercises: ExerciseGenerator[],
): Lesson {
  return makeLesson(stage, step, section, {
    id,
    title,
    subtitle,
    whyItMatters: why,
    explanationHtml: html,
    formulas,
    quiz,
    lab: familyLab(id, kind, labTitle, intro, goals),
    exercises,
  });
}
