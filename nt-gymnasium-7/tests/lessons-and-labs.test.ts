import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import {
  ALL_LESSONS,
  continuationLesson,
  findLessonById,
  nextLesson,
  previousLesson,
  STAGES,
} from "../src/curriculum/index";
import { quizOrder } from "../src/exercises/quiz-order";
import {
  applyAction,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
  withChanges,
} from "../src/lab/engine";
import type { LabDefinition, LabValues } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";
import { physicsLink } from "../src/ui/subject-overview";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

/** Every grid point, or an even sample of at most `limit` of them for very large labs. */
function sampledGrid(lab: LabDefinition, samples: number, limit = 1500): LabValues[] {
  const grid = enumerateLabGrid(lab, samples);
  if (grid.length <= limit) return grid;
  const stride = Math.ceil(grid.length / limit);
  return grid.filter((_, index) => index % stride === 0);
}

const MODULES = ["2.1", "2.2", "2.3", "2.4"] as const;

describe("LehrplanPLUS Gymnasium NT7 Schwerpunkt Informatik (2.1–2.4)", () => {
  it("pins all 12 stable lesson ids across four stages, one per module, each with its own accent", () => {
    expect(STAGES.map((stage) => stage.module)).toEqual([...MODULES]);
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(STAGES.length);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual([...LESSON_IDS]);
    expect(new Set(ALL_LESSONS.map((lesson) => lesson.lab.kind)).size).toBe(ALL_LESSONS.length);
    for (const stage of STAGES) {
      expect(stage.stageNumber).toBe(MODULES.indexOf(stage.module) + 1);
      for (const lesson of stage.lessons) {
        expect(lesson.module).toBe(stage.module);
        expect(lesson.stageId).toBe(stage.id);
      }
    }
  });

  it("ships complete explanations, quick checks, key terms, workshops and two generators on every lesson", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.lehrplan, lesson.id).toMatch(/^NT7 2\.[1-4] /);
      expect(lesson.explanationHtml.length, lesson.id).toBeGreaterThan(600);
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="example">');
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="merke">');
      expect(lesson.explanationHtml, lesson.id).not.toMatch(/(?:href|src)=["\x27]https?:\/\/|<iframe/i);
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(new Set(lesson.exercises.map((g) => g.id)).size, lesson.id).toBe(lesson.exercises.length);
      expect(lesson.lab.goals.length, lesson.id).toBe(3);
      expect(lesson.quiz.options, lesson.id).toHaveLength(3);
      expect(new Set(lesson.quiz.options).size, lesson.id).toBe(3);
      expect(lesson.quiz.explanation.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.requiredCorrect).toBe(3);
      const order = quizOrder(lesson);
      expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2]);
      for (const text of [lesson.explanationHtml, lesson.whyItMatters, lesson.quiz.question, ...lesson.quiz.options]) {
        expect(text, `${lesson.id}: real minus sign`).not.toMatch(/(^|[\s(:=>])-\d/);
      }
      const strippedHtml = lesson.explanationHtml.replace(/<[^>]+>/g, " ");
      expect(strippedHtml, `${lesson.id}: decimal comma`).not.toMatch(/\d\.\d/);
    }
  });

  it("maps every verbatim Kompetenzerwartung and content bullet of NT7 2.1–2.4 to lessons, and covers every lesson", () => {
    expect(coverage.rows).toHaveLength(10);
    expect(coverage.contents).toHaveLength(12);
    expect(coverage.optional_lessons).toEqual([]);
    const seen = new Set<string>();
    for (const row of coverage.rows) {
      expect(MODULES).toContain(row.lb);
      expect(row.competence.length).toBeGreaterThan(30);
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(["implemented", "supported"]).toContain(row.status);
      expect(seen.has(row.competence), `duplicate competence: ${row.competence}`).toBe(false);
      seen.add(row.competence);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = must(findLessonById(id)?.lesson, id);
        expect(lesson.module, `${id} serves ${row.lb}`).toBe(row.lb);
      }
    }
    for (const row of coverage.contents) {
      expect(MODULES).toContain(row.lb);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        must(findLessonById(id)?.lesson, id);
      }
    }
    for (const module of MODULES) {
      expect(coverage.rows.filter((row) => row.lb === module).length, module).toBeGreaterThanOrEqual(2);
    }
    for (const lesson of ALL_LESSONS) {
      expect(
        coverage.rows.some((row) => row.lessons.includes(lesson.id)),
        `${lesson.id} covers at least one competence`,
      ).toBe(true);
    }
  });

  it("navigates cleanly and resolves canonical deep links", () => {
    expect(previousLesson(LESSON_IDS[0])).toBeUndefined();
    expect(nextLesson(LESSON_IDS[0])?.id).toBe(LESSON_IDS[1]);
    expect(previousLesson(LESSON_IDS[1])?.id).toBe(LESSON_IDS[0]);
    expect(nextLesson(LESSON_IDS[LESSON_IDS.length - 1])).toBeUndefined();
    expect(continuationLesson("unknown-id").id).toBe(LESSON_IDS[0]);
    for (const id of LESSON_IDS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash).lessonId).toBe(id);
    }
    expect(parseTrainingDeepLink("#lesson=inf7-bedingte-schleife&level=2")).toEqual({
      lessonId: "inf7-bedingte-schleife",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
  });
});

describe("All 12 workshops", () => {
  for (const lesson of ALL_LESSONS) {
    it(`${lesson.id} (${lesson.lab.kind}) starts open, reaches every goal and renders clean SVG`, () => {
      const lab = lesson.lab;
      const start = defaultLabValues(lab);
      expect(reachedGoals(lab, start), `${lesson.id}: no goal at the start`).toHaveLength(0);
      const grid = reachableStates(lab);
      for (const goal of lab.goals) {
        const reached = must(grid.find((values) => goal.check(values, computeReadouts(lab, values))), goal.text);
        expect(goal.check(reached, computeReadouts(lab, reached)), `${lesson.id}: ${goal.id}`).toBe(true);
      }
      for (const values of grid) {
        const readouts = computeReadouts(lab, values);
        for (const val of Object.values(readouts)) {
          if (typeof val === "number") expect(Number.isFinite(val)).toBe(true);
          else {
            expect(val).not.toMatch(/\bNaN\b|undefined|Infinity/);
            expect(val, `${lesson.id}: readout minus`).not.toMatch(/(^|[\s(:=])-\d/);
          }
        }
        const svg = lab.view.render(values, readouts);
        expect(svg).toContain('role="img"');
        expect(svg.trim().endsWith("</svg>")).toBe(true);
        expect(svg).not.toMatch(/\bNaN\b|undefined|Infinity/);
        for (const [, text] of svg.matchAll(/>([^<]+)</g)) {
          expect(text, `${lesson.id}: SVG minus`).not.toMatch(/(^|[\s(:=])-\d/);
        }
      }
      for (const action of lab.actions ?? []) {
        const after = applyAction(lab, start, action.id);
        expect(Object.keys(after).sort()).toEqual(Object.keys(start).sort());
      }
    });
  }

});

function reachableStates(lab: LabDefinition): LabValues[] {
  const states = sampledGrid(lab, 3);
  const seen = new Set(states.map((values) => JSON.stringify(values)));
  let current = states.slice();
  for (let depth = 0; depth < 8 && current.length; depth++) {
    const next: LabValues[] = [];
    for (const values of current) {
      for (const action of lab.actions ?? []) {
        const after = applyAction(lab, values, action.id);
        const key = JSON.stringify(after);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(after);
      }
    }
    states.push(...next);
    current = next;
  }
  return states;
}

describe("Subject models", () => {
  const lab = (id: string) => must(findLessonById(id)).lesson.lab;
  const run = (model: LabDefinition, action: string, changes: LabValues, steps: number) => {
    let values = withChanges(model, defaultLabValues(model), changes);
    for (let step = 0; step < steps; step++) values = applyAction(model, values, action);
    return computeReadouts(model, values);
  };

  it("follows directed links and completes the return path only with the return edge", () => {
    const graph = lab("inf7-hypertext-graph");
    expect(run(graph, "follow", { forward: 2, cross: 1 }, 3).page).toBe("AGs");
    expect(run(graph, "follow", { forward: 2, cross: 1, back: 1 }, 3).page).toBe("Startseite");
  });

  it("displays a document only after the response has reached the client", () => {
    const web = lab("inf7-client-server");
    expect(run(web, "packet", { host: 1 }, 3).document).toBe("Dokument noch nicht empfangen");
    expect(run(web, "packet", { host: 1 }, 4).document).toBe("Stadtbücherei");
  });

  it("stops invalid robot moves and branches by the initial condition", () => {
    const sequence = lab("inf7-sequenz");
    expect(run(sequence, "step", { first: 2, second: 1 }, 2).status).toMatch(/Stopp/);
    expect(run(sequence, "step", { first: 1, second: 2, third: 3 }, 3).position).toBe("Spalte 2, Zeile 2 · markiert");
    const branch = lab("inf7-verzweigung");
    expect(run(branch, "step", { wall: 1, yes: 2, no: 1 }, 1).position).toBe("Spalte 1, Zeile 2");
    expect(run(branch, "step", { wall: 0, yes: 2, no: 1 }, 1).position).toBe("Spalte 2, Zeile 3");
  });

  it("uses fixed counts and stops a conditional loop at two, four or zero steps", () => {
    const fixed = lab("inf7-feste-schleife");
    expect(run(fixed, "step", { body: 1, amount: 2 }, 6).position).toBe("Spalte 4, Zeile 3");
    const conditional = lab("inf7-bedingte-schleife");
    for (const [target, steps] of [[0, 2], [1, 4], [2, 0]]) {
      expect(run(conditional, "step", { body: 1, target }, 7).status).toBe(`Ziel erreicht. Durchläufe: ${steps}.`);
    }
    expect(run(conditional, "step", { body: 3, target: 0 }, 7).status).toMatch(/fünf Durchläufen/);
  });

  it("links published Physics to its existing address and opens the embedded app offline", () => {
    expect(physicsLink({ protocol: "https:", hostname: "academy.zam-os.org" })).toBe("../physik-gymnasium-7/");
    expect(physicsLink({ protocol: "file:", hostname: "" })).toBe("./physik/index.html");
    expect(physicsLink({ protocol: "http:", hostname: "localhost" })).toBe("./physik/index.html");
  });
});
