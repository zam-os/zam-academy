import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import replacesJson from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import { checkTask, parseNumber } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import type { ExerciseTask } from "../src/model/types";
import {
  isLessonComplete,
  isStageComplete,
  type LearnerProgress,
  overallStats,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_ACADEMY_APP_URL } from "../src/zam/zam-link";
import { EXPECTED_TEACHER_VIDEOS, LESSON_IDS } from "./witnesses";

function answerText(task: ExerciseTask): string[] {
  return task.fields.map((field) => {
    if (field.kind === "choice") return String(field.correctIndex);
    return field.answer.toFixed(field.digits);
  });
}

describe("Curriculum & LehrplanPLUS Realschule 10", () => {
  it("has six stages in correct didactic and curriculum order", () => {
    expect(STAGES.map((s) => s.stageNumber)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(26);
  });

  it("ensures every lesson has valid metadata, formulas, exercises and lab goals", () => {
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.id).toBe(true);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        expect(lesson.lehrplan.length).toBeGreaterThan(5);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.requiredCorrect).toBeGreaterThanOrEqual(2);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);
        expect(lesson.lab.goals.length).toBeGreaterThanOrEqual(1);
        expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
      });
    }
  });

  it("filters tracks cleanly for Zweig I (technisch) and Zweig II/III (kaufmännisch/sprachlich)", () => {
    const trackI = lessonsForTrack("I").map((l) => l.id);
    const trackII = lessonsForTrack("II_III").map((l) => l.id);
    expect(trackI).toEqual(LESSON_IDS);
    // Vektorgeometrie is specific to Zweig I in Bavarian Realschule curriculum:
    for (const id of trackII) {
      expect(id.startsWith("vg-"), `vg- lesson ${id} should be Zweig I only`).toBe(false);
    }
    // Zweig II/III has Raumgeometrie & Abschlussprüfung
    expect(trackII.some((id) => id.startsWith("ap-"))).toBe(true);
    expect(trackII.some((id) => id.startsWith("tr-"))).toBe(true);
  });

  it("shuffles quiz options and maintains valid correct answers", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(2);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
      const order = quizOrder(lesson);
      expect([...order].sort()).toEqual(lesson.quiz.options.map((_, i) => i));
    }
  });
});

describe("Lehrer-Erklärvideos (Daniel Jung & Fachkollegen)", () => {
  it("provides a verified, pinned teacher video for every one of the 26 lessons", () => {
    for (const lesson of ALL_LESSONS) {
      const expected = EXPECTED_TEACHER_VIDEOS[lesson.id];
      expect(expected, `Missing expectation for lesson ${lesson.id}`).toBeDefined();
      expect(lesson.teacherVideo, `Missing teacherVideo in lesson ${lesson.id}`).toBeDefined();
      expect(lesson.teacherVideo!.author).toBe(expected.author);
      expect(lesson.teacherVideo!.title).toBe(expected.title);
      expect(lesson.teacherVideo!.url).toBe(`https://www.youtube.com/watch?v=${expected.id}`);
      // Verify valid 11-character YouTube video ID format:
      expect(/^[A-Za-z0-9_-]{11}$/.test(expected.id)).toBe(true);
    }
  });
});

describe("Cell & Replaces Mappings (KVT Tile Contract)", () => {
  it("defines exactly 26 atoms in cell.json matching the curriculum lessons", () => {
    expect(cellJson.atoms.length).toBe(26);
    expect(cellJson.atoms.map((a) => a.source_link.split("#lesson=")[1])).toEqual(LESSON_IDS);
  });

  it("declares the 16 legacy de-by items as Category A replacements", () => {
    const replacedSlugs = new Set<string>();
    const oldIds = new Set<string>();
    for (const atom of cellJson.atoms) {
      for (const rawItem of atom.practice_items) {
        const item = rawItem as { slug: string; replaces?: string[] };
        if (item.replaces && item.replaces.length > 0) {
          for (const oldId of item.replaces) {
            oldIds.add(oldId);
            replacedSlugs.add(item.slug);
          }
        }
      }
    }
    expect(oldIds.size).toBe(16);
    expect(replacesJson.rows.length).toBe(16);
    expect(replacesJson.approved).toBe("2026-10-22");

    for (const row of replacesJson.rows) {
      expect(row.category).toBe("A");
      expect(oldIds.has(row.de_by_id), `Old ID ${row.de_by_id} missing in cell`).toBe(true);
      expect(replacedSlugs.has(row.academy_slug), `Slug ${row.academy_slug} missing in cell`).toBe(true);
    }
  });

  it("ensures all practice items cite valid academy training links", () => {
    for (const atom of cellJson.atoms) {
      for (const item of atom.practice_items) {
        expect(item.source_link.startsWith("https://academy.zam-os.org/mathematik-realschule-10/#lesson=")).toBe(true);
        const lessonId = item.source_link.split("#lesson=")[1];
        expect(findLessonById(lessonId)).toBeDefined();
      }
    }
  });
});

describe("Exercise Generators & Checker", () => {
  it("generates solvable exercise tasks across all levels for all lessons", () => {
    const rng = createRng(12345);
    for (const lesson of ALL_LESSONS) {
      for (const exercise of lesson.exercises) {
        for (const level of [1, 2] as const) {
          const task = exercise.make(rng, level);
          expect(task.prompt.length).toBeGreaterThan(10);
          expect(task.fields.length).toBeGreaterThan(0);
          const answers = answerText(task);
          const result = checkTask(task, answers);
          expect(result.status, `Task in ${lesson.id} failed with answers: ${answers.join(", ")}`).toBe("correct");
        }
      }
    }
  });

  it("parses numbers and formats correctly", () => {
    expect(parseNumber("3,14")).toBe(3.14);
    expect(parseNumber("-2.5")).toBe(-2.5);
    expect(parseNumber("invalid")).toBeNull();
    expect(fmt(3.14159, 2)).toBe("3,14");
  });
});

describe("Lab Engine & Visuals", () => {
  it("evaluates default readouts without NaNs or infinities for all 26 labs", () => {
    for (const lesson of ALL_LESSONS) {
      const def = lesson.lab;
      const values = defaultLabValues(def);
      const readouts = computeReadouts(def, values);
      for (const val of Object.values(readouts)) {
        if (typeof val === "number") {
          expect(Number.isNaN(val), `NaN readout in ${lesson.id}`).toBe(false);
          expect(Number.isFinite(val), `Non-finite readout in ${lesson.id}`).toBe(true);
        } else if (typeof val === "string") {
          expect(val.length, `Empty string readout in ${lesson.id}`).toBeGreaterThan(0);
        }
      }
      const view = labView(def.kind);
      const svg = view.render(values, readouts);
      expect(svg.startsWith("<svg"), `SVG in ${lesson.id} must start with <svg`).toBe(true);
      expect(svg.endsWith("</svg>"), `SVG in ${lesson.id} must end with </svg>`).toBe(true);
    }
  });
});

describe("Progress & Deep Links", () => {
  it("evaluates lesson and stage completion states", () => {
    const lesson1 = ALL_LESSONS[0];
    const lesson2 = ALL_LESSONS[1];
    const progress: LearnerProgress = {
      activeLessonId: lesson1.id,
      difficultyLevel: 1,
      trackFilter: "alle",
      quizDone: [lesson1.id],
      labGoals: { [lesson1.id]: lesson1.lab.goals.map((g) => g.id) },
      solved: { [lesson1.id]: { 1: 3, 2: 0 } },
      attempts: {},
      celebratedStageIds: [],
      celebratedLessonIds: [],
    };
    expect(isLessonComplete(progress, lesson1)).toBe(true);
    expect(isLessonComplete(progress, lesson2)).toBe(false);
    expect(isStageComplete(progress, STAGES[0])).toBe(false);

    const stats = overallStats(progress, STAGES);
    expect(stats.completed).toBe(1);
    expect(stats.total).toBe(26);
  });

  it("encodes and decodes ZAM training deep links", () => {
    const url = lessonLink("vg-4-skalarprodukt");
    expect(url).toBe(`${ZAM_ACADEMY_APP_URL}#lesson=vg-4-skalarprodukt`);
    const parsed = parseTrainingDeepLink("#lesson=vg-4-skalarprodukt");
    expect(parsed?.lessonId).toBe("vg-4-skalarprodukt");
  });
});
