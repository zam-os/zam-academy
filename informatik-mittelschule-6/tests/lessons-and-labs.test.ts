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
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
} from "../src/lab/engine";
import { fieldLabel, runSequence, startAt } from "../src/lab/figur";
import type { LabDefinition, LabValues } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

function sampledGrid(lab: LabDefinition, samples: number, limit = 1500): LabValues[] {
  const grid = enumerateLabGrid(lab, samples);
  if (grid.length <= limit) return grid;
  const stride = Math.ceil(grid.length / limit);
  return grid.filter((_, index) => index % stride === 0);
}

const MODULES = ["1", "2"] as const;

describe("LehrplanPLUS Mittelschule Informatik 6 (LB 1–2)", () => {
  it("pins all 12 stable lesson ids across two stages, one per Lernbereich, each with its own accent", () => {
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
      expect(lesson.lehrplan, lesson.id).toMatch(/^Inf6 LB [12] /);
      expect(lesson.explanationHtml.length, lesson.id).toBeGreaterThan(600);
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="example">');
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="merke">');
      expect(lesson.explanationHtml, lesson.id).not.toMatch(/https?:\/\/|youtube|vimeo|<iframe/i);
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

  it("maps every verbatim Kompetenzerwartung and content bullet of Inf6 LB 1–2 to lessons, and covers every lesson", () => {
    expect(coverage.rows).toHaveLength(6);
    expect(coverage.contents).toHaveLength(7);
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
        expect(lesson.module, `${id} serves LB ${row.lb}`).toBe(row.lb);
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
      expect(coverage.rows.filter((row) => row.lb === module)).toHaveLength(3);
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
    expect(parseTrainingDeepLink("#lesson=ms6-testen-optimieren&level=2")).toEqual({
      lessonId: "ms6-testen-optimieren",
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
      const grid = lab.witnesses ? [] : sampledGrid(lab, 21, 200000);
      for (const goal of lab.goals) {
        const witness =
          lab.witnesses?.[goal.id] ?? grid.find((values) => goal.check(values, computeReadouts(lab, values)));
        expect(witness, `${lesson.id}: ${goal.text}`).toBeDefined();
        const reached = { ...start, ...must(witness) };
        for (const param of lab.params) {
          expect(clampParam(param, reached[param.key]), `${lesson.id}: witness ${param.key} in range`).toBe(
            reached[param.key],
          );
        }
        expect(goal.check(reached, computeReadouts(lab, reached)), `${lesson.id}: ${goal.id}`).toBe(true);
      }
      for (const values of sampledGrid(lab, 3)) {
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

  it("lets drag handles move their parameters to finite values", () => {
    const withHandles = ALL_LESSONS.filter((lesson) => Object.keys(lesson.lab.view.handles ?? {}).length > 0);
    expect(withHandles.length).toBeGreaterThanOrEqual(5);
    for (const lesson of withHandles) {
      for (const spec of Object.values(must(lesson.lab.view.handles))) {
        const raw = spec.drag({ x: 250, y: 150 }, defaultLabValues(lesson.lab));
        for (const [key, value] of Object.entries(raw)) {
          const param = must(lesson.lab.params.find((p) => p.key === key), key);
          expect(Number.isFinite(clampParam(param, value ?? 0))).toBe(true);
        }
      }
    }
  });
});

describe("Subject details checked in review", () => {
  it("labels both stages with Inf6 LB 1 and Inf6 LB 2", () => {
    expect(STAGES[0].lehrplanLabel).toBe("Inf6 LB 1");
    expect(STAGES[1].lehrplanLabel).toBe("Inf6 LB 2");
  });

  it("filters search results cleanly and checks Creative Commons rules accurately", () => {
    const searchLesson = must(findLessonById("ms6-suchstrategien")).lesson;
    const filtered = computeReadouts(searchLesson.lab, {
      begriff: 1,
      ausschluss: 2,
      siteFilter: 1,
      zeitraum: 2022,
    });
    expect(String(filtered.hits)).toBe("3 (3 fachlich · 0 unpassend)");

    const ccLesson = must(findLessonById("ms6-urheberrecht-lizenzen")).lesson;
    expect(computeReadouts(ccLesson.lab, { lizenz: 5, nutzung: 1 }).status).toBe("Nicht erlaubt");
    expect(computeReadouts(ccLesson.lab, { lizenz: 2, nutzung: 1 }).status).toBe("Erlaubt");
    expect(computeReadouts(ccLesson.lab, { lizenz: 1, nutzung: 3 }).status).toBe("Erlaubt");
  });

  it("tracks figure movement, endless loops, nested courses, and boundary debugging", () => {
    const end = runSequence(
      { size: 5, obstacles: [{ x: 0, y: 2 }] },
      ["rechts", "vor", "vor", "links", "vor"],
      startAt(0, 4, 0),
    );
    expect(fieldLabel(end.x, end.y)).toBe("C4");
    expect(end.bumps).toBe(0);

    const schachtel = must(findLessonById("ms6-schachtelung")).lesson;
    const p1 = computeReadouts(schachtel.lab, { parcours: 0, aussen: 1, wennFrei: 1, sonst: 2 });
    expect(p1.ziel).toContain("E1");
    const p2 = computeReadouts(schachtel.lab, { parcours: 1, aussen: 1, wennFrei: 1, sonst: 2 });
    expect(p2.ziel).toContain("E5");
    const stuck = computeReadouts(schachtel.lab, { parcours: 0, aussen: 1, wennFrei: 1, sonst: 0 });
    expect(stuck.runden).toBe("Endlos (abgebrochen)");

    const debug = must(findLessonById("ms6-testen-optimieren")).lesson;
    expect(computeReadouts(debug.lab, { gangLaenge: 0, programm: 0 }).testfall).toContain("Fehlgeschlagen");
    expect(computeReadouts(debug.lab, { gangLaenge: 0, programm: 3 }).testfall).toContain("Bestanden");
    expect(computeReadouts(debug.lab, { gangLaenge: 5, programm: 3 }).testfall).toContain("Bestanden");
  });
});
