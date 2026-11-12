import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  STAGES,
  lessonTitleForTrack,
  stageNumberForTrack,
  findLessonById,
  lessonsForTrack,
  nextLesson,
  previousLesson,
} from "../src/curriculum";
import {
  isLessonComplete,
  isStageComplete,
  overallStats,
  type LearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import source from "../src/curriculum/source.json";
import coverage from "../coverage.json";
import rawCell from "../cell.json";
import contract from "./fixtures/public-contract.json";

interface Item {
  id: string;
  slug: string;
  source_link: string;
  choice_distractors: { text: string; reason: string }[];
  fast_check?: { options: unknown[]; correct_index: number };
  sample_solution?: string;
  question_segments?: { type: string; speech?: string }[];
  concept_segments?: { type: string; speech?: string }[];
}
interface Atom {
  id: string;
  slug: string;
  source_link: string;
  prerequisites: { atom_id: string }[];
  curricula: {
    provider: string;
    track?: string;
    grade?: number;
    subject?: string;
    topic_code: string;
  }[];
  practice_items: Item[];
}
const cell = rawCell as { tile_id: string; atoms: Atom[] };
const IDS = ALL_LESSONS.map((l) => l.id);
const blank = (): LearnerProgress => ({
  activeLessonId: IDS[0],
  difficultyLevel: 1,
  trackFilter: "alle",
  quizDone: [],
  labGoals: {},
  solved: {},
  attempts: {},
  celebratedStageIds: [],
  celebratedLessonIds: [],
});

describe("Lehrplan und Umfang", () => {
  it("covers eight areas in R and M with 31 substantive lessons and zero teacher videos", () => {
    expect(STAGES).toHaveLength(8);
    expect(ALL_LESSONS).toHaveLength(31);
    expect(lessonsForTrack("R")).toHaveLength(24);
    expect(lessonsForTrack("M")).toHaveLength(31);
    expect(
      STAGES.filter((s) => s.lessons.some((l) => l.tracks.includes("R"))),
    ).toHaveLength(8);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(8);
    for (const lesson of ALL_LESSONS) {
      expect(lesson.teacherVideo, lesson.id).toBeUndefined();
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.explanationHtml).toContain('class="merke"');
      expect(lesson.formulas.length).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals).toHaveLength(3);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(
        [
          lesson.explanationHtml,
          lesson.quiz.question,
          ...lesson.quiz.options,
          lesson.quiz.explanation,
          ...lesson.formulas.map((f) => f.quantities),
        ]
          .join(" ")
          .replace(/<[^>]+>/g, " "),
      ).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(new Set(lesson.quiz.options).size).toBe(
        lesson.quiz.options.length,
      );
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      for (const track of lesson.tracks)
        expect(lesson.lehrplan).toContain(`(${track})`);
      const topic = STAGES.find(
        (stage) => stage.id === lesson.stageId,
      )!.lehrplanLabel.split(": ")[1];
      expect(topic.length).toBeGreaterThan(0);
    }
  });

  it("maps all 68 official R8/M8 competences verbatim and only to applicable lessons", () => {
    expect(coverage.rows).toHaveLength(68);
    for (const track of ["R", "M"] as const) {
      const expected = source.tracks[track].areas.flatMap((a) =>
        a.competences.map((c) => `${a.lb}:${c}`),
      );
      expect(
        coverage.rows
          .filter((r) => r.track === track)
          .map((r) => `${r.lb}:${r.competence}`),
      ).toEqual(expected);
    }
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(20);
      for (const id of row.lessons) {
        const lesson = findLessonById(id)?.lesson;
        expect(lesson, id).toBeDefined();
        expect(lesson?.tracks).toContain(row.track);
        expect(lesson?.lehrplan).toContain(`M8 LB ${row.lb} (${row.track})`);
      }
    }
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
      new Set(IDS),
    );
  });

  it("keeps M-only content out of the R forward and backward path", () => {
    expect(nextLesson("pr-3-brutto-netto-tara", "R")?.id).toBe(
      "pr-5-kalkulation-verkaufspreis",
    );
    expect(previousLesson("pr-5-kalkulation-verkaufspreis", "R")?.id).toBe(
      "pr-3-brutto-netto-tara",
    );
    expect(nextLesson("kz-2-kreisumfang-umkehrung", "R")?.id).toBe(
      "kz-4-zusammengesetzte-umfaenge",
    );
    expect(nextLesson("kf-2-kreisflaeche-umkehrung", "R")?.id).toBe(
      "kf-4-zusammengesetzte-kreisflaechen",
    );
    expect(
      lessonTitleForTrack(
        findLessonById("gl-1-terme-k-a-d-gesetz")!.lesson,
        "R",
      ),
    ).toBe("Terme aufstellen & vereinfachen in ℚ");
    expect(stageNumberForTrack(STAGES[4], "R")).toBe(5);
    const mOnly = new Set([
      "pr-4-wachstumsfaktor",
      "pr-6m-halbkreis-plus-minus",
      "wz-2-quadratwurzeln-ueberschlag",
      "kz-3-kreisbogen-sektor",
      "kf-3-kreisring-sektor",
      "zy-3-kreisringzylinder",
      "fk-2-lineare-funktionen-mxt",
    ]);
    expect(lessonsForTrack("R").every((l) => !mOnly.has(l.id))).toBe(true);
    expect(nextLesson("pr-6-schaubilder-prozent", "R")?.id).toBe(
      "pr-7-promillerechnung",
    );
    expect(nextLesson("pr-6-schaubilder-prozent", "M")?.id).toBe(
      "pr-6m-halbkreis-plus-minus",
    );
  });
});

describe("Fortschritt und Links", () => {
  it("requires every goal, quiz and three correct tasks at each level", () => {
    const p = blank(),
      l = ALL_LESSONS[0];
    p.quizDone.push(l.id);
    p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
    p.solved[l.id] = { 1: 3, 2: 2 };
    expect(isLessonComplete(p, l)).toBe(false);
    p.solved[l.id][2] = 3;
    expect(isLessonComplete(p, l)).toBe(true);
    p.labGoals[l.id].pop();
    expect(isLessonComplete(p, l)).toBe(false);
  });

  it("counts the proper scope per track while preserving existing progress", () => {
    const p = blank();
    for (const track of ["R", "M"] as const) {
      expect(overallStats(p, STAGES, track).total).toBe(
        track === "R" ? 24 : 31,
      );
      expect(isStageComplete(p, STAGES[0], track)).toBe(false);
    }
    for (const l of lessonsForTrack("R")) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(overallStats(p, STAGES, "R").percent).toBe(100);
    expect(overallStats(p, STAGES, "M").completed).toBe(24);
    expect(isStageComplete(p, STAGES[0], "R")).toBe(true);
  });

  it("resolves every card deep link and ignores malformed fragments", () => {
    for (const l of ALL_LESSONS) {
      expect(
        parseTrainingDeepLink(new URL(lessonLink(l.id)).hash).lessonId,
      ).toBe(l.id);
      expect(findLessonById(l.id)?.lesson).toBe(l);
    }
    expect(parseTrainingDeepLink(`#lesson=${IDS[0]}&level=2`)).toEqual({
      lessonId: IDS[0],
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
  });
});

describe("ZAM-Karten", () => {
  it("pins all 31 lesson identities and 124 atom/item ULIDs", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-mittelschule-8");
    expect(cell.atoms).toHaveLength(31);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(93);
    const ids = cell.atoms.flatMap((a) => [
      a.id,
      ...a.practice_items.map((i) => i.id),
    ]);
    expect(new Set(ids).size).toBe(124);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });

  it("binds each official track to the right LB without hidden M-only prerequisites for R", () => {
    for (const [n, a] of cell.atoms.entries()) {
      const l = ALL_LESSONS[n];
      expect(a.source_link).toBe(lessonLink(l.id));
      const official = a.curricula.filter(
        (c) => c.provider === "lehrplanplus-bayern",
      );
      expect(official.map((c) => c.track)).toEqual(l.tracks);
      for (const c of official) {
        const row = coverage.rows.find(
          (r) => r.track === c.track && r.lessons.includes(l.id),
        );
        expect([c.grade, c.subject, c.topic_code]).toEqual([
          8,
          "mathematik",
          `lb${row?.lb}`,
        ]);
      }
      for (const prereq of a.prerequisites) {
        const previous = cell.atoms.find(
          (candidate) => candidate.id === prereq.atom_id,
        );
        expect(previous).toBeDefined();
        if (l.tracks.includes("R"))
          expect(previous?.curricula.some((c) => c.track === "R")).toBe(true);
      }
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(a.source_link);
        expect("replaces" in i).toBe(false);
      }
    }
    expect("retired_items" in cell).toBe(false);
  });

  it("has binary checks, meaningful curated reasons, transfer solutions and spoken formulas", () => {
    for (const a of cell.atoms) {
      expect(a.practice_items).toHaveLength(3);
      for (const i of a.practice_items) {
        expect(i.choice_distractors).toHaveLength(2);
        expect(i.choice_distractors.every((d) => d.reason.length > 15)).toBe(
          true,
        );
        if (i.fast_check) {
          expect(i.fast_check.options).toHaveLength(2);
          expect(i.fast_check.correct_index).toBe(0);
        } else expect(i.sample_solution?.length).toBeGreaterThan(30);
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const s of i[key] ?? [])
            if (s.type === "math") expect(s.speech?.length).toBeGreaterThan(0);
      }
    }
  });
});
