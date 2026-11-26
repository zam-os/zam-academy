import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import { ALL_LESSONS, continuationLesson, findLessonById, nextLesson, previousLesson, STAGES } from "../src/curriculum";
import { quizOrder } from "../src/exercises/quiz-order";
import { applyAction, computeReadouts, defaultLabValues, enumerateLabGrid, reachedGoals, withChanges } from "../src/lab/engine";
import type { LabValues } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";

const MODULES = ["1", "2", "3"] as const;

describe("LehrplanPLUS Informatik R7 and M7", () => {
  it("has twelve stable lessons and one differently coloured stage per Lernbereich", () => {
    expect(STAGES.map((stage) => stage.module)).toEqual([...MODULES]);
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(3);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual([...LESSON_IDS]);
    expect(new Set(ALL_LESSONS.map((lesson) => lesson.lab.kind)).size).toBe(12);
    for (const stage of STAGES) {
      expect(stage.stageNumber).toBe(MODULES.indexOf(stage.module) + 1);
      for (const lesson of stage.lessons) {
        expect(lesson.module).toBe(stage.module);
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.tracks).toEqual(["R", "M"]);
      }
    }
  });

  it("has explanations, quick checks, key terms and two practice strands per lesson", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.lehrplan).toMatch(/^R7 und M7 · LB [1-3] · /);
      expect(lesson.explanationHtml).toContain('<div class="example">');
      expect(lesson.explanationHtml).toContain('<div class="merke">');
      expect(lesson.explanationHtml).not.toMatch(/https?:\/\/|youtube|vimeo|<iframe/i);
      expect(lesson.formulas.length).toBeGreaterThanOrEqual(3);
      expect(new Set(lesson.exercises.map((generator) => generator.id)).size).toBe(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(new Set(lesson.quiz.options).size).toBe(3);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      expect([...quizOrder(lesson)].sort((a, b) => a - b)).toEqual([0, 1, 2]);
      expect(lesson.explanationHtml.replace(/<[^>]+>/g, " ")).not.toMatch(/\d\.\d|(^|[\s(:=>])-\d/);
    }
  });

  it("maps all eleven competencies and fourteen content bullets in each track to the right stage", () => {
    expect(coverage.optional_lessons).toEqual([]);
    for (const track of ["R", "M"]) {
      const rows = coverage.rows.filter((row) => row.track === track);
      const contents = coverage.contents.filter((row) => row.track === track);
      expect(rows).toHaveLength(11);
      expect(contents).toHaveLength(14);
      for (const [index, lb] of MODULES.entries()) {
        expect(rows.filter((row) => row.lb === lb)).toHaveLength([3, 6, 2][index]);
        expect(contents.filter((row) => row.lb === lb)).toHaveLength([5, 6, 3][index]);
      }
      for (const row of [...rows, ...contents]) {
        expect(row.lessons.length).toBeGreaterThan(0);
        const modules = row.lessons.map((id) => findLessonById(id)?.lesson.module);
        expect(modules).toContain(row.lb);
        expect(modules.every((module, i) => module === row.lb ||
          (row.lb === "2" && row.lessons[i] === "ms7-bildrechte"))).toBe(true);
      }
      expect(new Set(rows.flatMap((row) => row.lessons))).toEqual(new Set(LESSON_IDS));
    }
  });

  it("resolves each Academy link to a lesson and handles navigation at both ends", () => {
    expect(previousLesson(LESSON_IDS[0])).toBeUndefined();
    expect(nextLesson(LESSON_IDS[0])?.id).toBe(LESSON_IDS[1]);
    expect(nextLesson(LESSON_IDS.at(-1)!)).toBeUndefined();
    expect(continuationLesson("unknown-id").id).toBe(LESSON_IDS[0]);
    for (const id of LESSON_IDS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash + "&level=2")).toEqual({ lessonId: id, level: 2 });
    }
    expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
  });
});

type Move = [Partial<LabValues>, ...string[]];
const submit = (scene: number, answer: number): Move => [{ scene, answer }, "check"];
const decisionMoves: Move[] = [submit(0, 1), submit(1, 2), submit(2, 0)];
const witnesses: Record<(typeof LESSON_IDS)[number], Move[]> = {
  "ms7-nachrichtenwege": [0, 1, 5].map((job) => [{ job, service: job }, "send", "send", "send"]),
  "ms7-phishing-quellen": decisionMoves,
  "ms7-bildrechte": decisionMoves,
  "ms7-medienwirkung": decisionMoves,
  "ms7-pixel-formate": [[{ size: 1 }], [{ size: 1, input: 1 }], [{ size: 1, format: 1 }]],
  "ms7-raster-bearbeiten": [[{ tool: 1 }], [{ tool: 2 }], [{ tool: 3 }]],
  "ms7-raster-vektor": [
    [{ zoom: 3, job: 0, format: 1 }, "compare"], [{ zoom: 3, job: 1, format: 0 }, "compare"],
    [{ zoom: 3, job: 2, format: 1 }, "compare"],
  ],
  "ms7-vektor-objekte": [
    [{ shape: 1, color: 1, width: 60 }], [{ shape: 2, color: 2, width: 48 }], [{ line: 1, slope: 15 }],
  ],
  "ms7-objekte-methoden": [[{}, "step"], [{ order: 1 }, "step", "step"], [{ order: 2 }, "run"]],
  "ms7-bedingung-alternative": [
    [{ blocked: 1 }, "step", "step"], [{ blocked: 1, law: 1 }, "run"], [{ blocked: 0, law: 1 }, "run"],
  ],
  "ms7-wiederholung-schachtelung": [2, 3, 5].map((count) => [{ count, collect: 1, nested: 1 }, "run"]),
  "ms7-variablen-grenztest": [2, 3, 4].map((first) => [{ first, gain: 0, inclusive: 1 }, "run"]),
};

function operate(id: (typeof LESSON_IDS)[number], [changes, ...actions]: Move) {
  const lab = findLessonById(id)!.lesson.lab;
  const setup = withChanges(lab, defaultLabValues(lab), changes);
  const values = actions.reduce((state, button) => applyAction(lab, state, button), setup);
  const readouts = computeReadouts(lab, values);
  const drawing = lab.view.render(values, readouts);
  return { values, readouts, drawing, reached: reachedGoals(lab, values, readouts) };
}

describe("Visual workshops", () => {
  for (const id of LESSON_IDS) {
    it(`${id} reaches all three goals through the same controls learners use`, () => {
      const lab = findLessonById(id)!.lesson.lab;
      expect(reachedGoals(lab, defaultLabValues(lab))).toEqual([]);
      expect(lab.goals).toHaveLength(3);
      expect(witnesses[id]).toHaveLength(3);
      witnesses[id].forEach((move, index) => {
        expect(operate(id, move).reached.map((entry) => entry.id)).toContain(lab.goals[index].id);
      });
    });

    it(`${id} renders stable readouts across settings and action steps`, () => {
      const lab = findLessonById(id)!.lesson.lab;
      for (const setup of enumerateLabGrid(lab, 3)) {
        const states = [setup, ...(lab.actions ?? []).map((action) => applyAction(lab, setup, action.id))];
        for (const state of states) {
          const readouts = computeReadouts(lab, state);
          for (const value of Object.values(readouts)) {
            if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
            else expect(value).not.toMatch(/NaN|undefined|Infinity/);
          }
          expect(lab.view.render(state, readouts)).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
    });
  }

  it("differentiates transport, destination and an unsuitable service", () => {
    const id = "ms7-nachrichtenwege";
    expect(operate(id, [{ job: 0, service: 0 }, "send"]).readouts.place).toBe("Netz");
    expect(operate(id, [{ job: 0, service: 1 }, "send", "send", "send"]).readouts.fit).toContain("anderen Dienst");
    expect(operate(id, [{ job: 1, service: 1 }, "send", "send", "send"]).drawing).toContain("Postfach der Lehrkraft");
  });

  it("shows raster crop dimensions, transparency and vector download data", () => {
    expect(operate("ms7-raster-bearbeiten", [{ tool: 1 }]).drawing).toContain("6 × 6");
    expect(operate("ms7-raster-bearbeiten", [{ tool: 2 }]).drawing).toContain("transparentem Hintergrund");
    const vector = operate("ms7-vektor-objekte", [{ shape: 1, color: 1, width: 60, line: 1, slope: 15 }]);
    expect(vector.drawing).toContain('width="60"');
    expect(vector.drawing).toContain('y2="82"');
    expect(vector.drawing).toContain("data:image/svg+xml");
    const handle = findLessonById("ms7-vektor-objekte")!.lesson.lab.view.handles?.["line-end"];
    expect(handle?.drag({ x: 114, y: 85 }, vector.values)).toEqual({ slope: 12 });
  });

  it("handles both branch outputs, counts nested actions and finds the boundary bug", () => {
    expect(operate("ms7-bedingung-alternative", [{ blocked: 1, law: 1 }, "run"]).readouts.state).toBe("Feld 0 · Licht an");
    expect(operate("ms7-bedingung-alternative", [{ blocked: 0, law: 1 }, "run"]).readouts.state).toBe("Feld 1 · Licht aus");
    const loop = operate("ms7-wiederholung-schachtelung", [{ count: 5, collect: 1, nested: 1 }, "run"]);
    expect(loop.readouts.collected).toBe(3);
    expect(operate("ms7-wiederholung-schachtelung", [{ count: 5, collect: 1 }, "run"]).readouts.collected).toBe(1);
    expect(loop.drawing).toMatch(/code-inner.*code-branch/);
    expect(operate("ms7-variablen-grenztest", [{ first: 2, gain: 1 }, "run"]).readouts.message).toBe("Weiter üben");
    expect(operate("ms7-variablen-grenztest", [{ first: 2, gain: 1, inclusive: 1 }, "run"]).readouts.message).toBe("Ziel erreicht");
  });
});
