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
import { KEY_ROWS } from "../src/curriculum/keyboard";
import { duration } from "../src/curriculum/stage-8-edv";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  applyAction,
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
} from "../src/lab/engine";
import type { LabDefinition, LabValues } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";

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

const MODULES = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9"];

describe("LehrplanPLUS Realschule IT-Anfangsunterricht (1.1–1.9)", () => {
  it("pins all 40 stable lesson ids across nine stages, one per module, each with its own accent", () => {
    expect(STAGES.map((stage) => stage.module)).toEqual(MODULES);
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
      expect(lesson.lehrplan, lesson.id).toMatch(/^IT 1\.[1-9] /);
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
    }
  });

  it("maps every verbatim Kompetenzerwartung of 1.1–1.9 to lessons, and every lesson to a competence", () => {
    expect(coverage.rows).toHaveLength(35);
    expect(coverage.optional_lessons).toEqual([]);
    const seen = new Set<string>();
    for (const row of coverage.rows) {
      expect(MODULES).toContain(row.module);
      expect(row.lb).toBe(1);
      expect(row.competence.length).toBeGreaterThan(30);
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(seen.has(row.competence), `duplicate competence: ${row.competence}`).toBe(false);
      seen.add(row.competence);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = must(findLessonById(id)?.lesson, id);
        expect(lesson.module, `${id} serves ${row.module}`).toBe(row.module);
      }
    }
    for (const module of MODULES) {
      expect(coverage.rows.filter((row) => row.module === module).length, module).toBeGreaterThanOrEqual(3);
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
    expect(parseTrainingDeepLink("#lesson=it8-dualsystem&level=2")).toEqual({
      lessonId: "it8-dualsystem",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
  });
});

describe("All 40 workshops", () => {
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
    expect(withHandles.length).toBeGreaterThanOrEqual(3);
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
  it("places N under H and M under J, and names the Grundreihe key of the same column", () => {
    const lesson = must(findLessonById("it8-zehnfingersystem")).lesson;
    expect(KEY_ROWS.grund[KEY_ROWS.unten.indexOf("N")]).toBe("H");
    expect(KEY_ROWS.grund[KEY_ROWS.unten.indexOf("M")]).toBe("J");
    expect(lesson.explanationHtml).toContain("Das N liegt unter dem H");
    expect(lesson.explanationHtml).toContain("rechts Z, H, N)");
    const generator = must(lesson.exercises.find((g) => g.id === "finger-zuordnen"));
    const seen = new Set<string>();
    for (let seed = 0; seed < 300; seed++) {
      const task = generator.make(createRng(seedFrom(`keys:${seed}`)), 1);
      const key = must(task.prompt.match(/<strong>(.)<\/strong>/), task.prompt)[1];
      seen.add(key);
      const row = KEY_ROWS.oben.includes(key) ? "oben" : KEY_ROWS.unten.includes(key) ? "unten" : "grund";
      const column = KEY_ROWS.grund[KEY_ROWS[row].indexOf(key)];
      expect(task.steps[1], key).toContain(row === "grund" ? "neben der Grundtaste" : `die Taste ${column}`);
    }
    for (const key of ["N", "B", "Z", "T", "Ü", "Ä", "G", "H"]) expect(seen.has(key), key).toBe(true);
  });

  it("shows the Kasse result the visible program lines compute, negative included", () => {
    const lab = must(findLessonById("it8-variablen-sequenz")).lesson.lab;
    const values = { ...defaultLabValues(lab), preis: 1, anzahl: 1, gutschein: 5, order: 0 };
    const readouts = computeReadouts(lab, values);
    expect(readouts.summe).toBe(-4);
    expect(reachedGoals(lab, values, readouts).map((goal) => goal.id)).not.toContain("gratis");
    expect(lab.view.render(values, readouts)).toContain("summe = −4 €");
    const exact = { ...values, preis: 5 };
    expect(reachedGoals(lab, exact).map((goal) => goal.id)).toContain("gratis");
  });

  it("gives brute-force times under a minute in seconds", () => {
    expect(duration(1)).toBe("≈ 1 Sekunde");
    expect(duration(2.3)).toBe("≈ 2 Sekunden");
    expect(duration(90)).toBe("≈ 1,5 Minuten");
    expect(duration(7200)).toBe("≈ 2 Stunden");
    const lab = must(findLessonById("it8-datensicherheit")).lesson.lab;
    const pin10 = { ...defaultLabValues(lab), pool: 0, len: 10 };
    expect(computeReadouts(lab, pin10).time).toBe("≈ 1 Sekunde");
  });
});
