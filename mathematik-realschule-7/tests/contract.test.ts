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
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import teacherVideos from "../src/curriculum/teacher-videos.json";
import teacherVideoIds from "./fixtures/teacher-video-ids.json";
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
const FIRST_IDS = [
  "pt-1-negative-exponenten",
  "pt-2-gleiche-basis",
  "pt-3-weitere-potenzgesetze",
  "pt-4-zehnerpotenzen",
  "pt-5-vorsilben",
];
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
  it("covers eight areas in I and six in II/III with substantive lessons", () => {
    expect(STAGES).toHaveLength(8);
    expect(ALL_LESSONS).toHaveLength(42);
    expect(IDS.slice(0, 5)).toEqual(FIRST_IDS);
    expect(lessonsForTrack("I")).toHaveLength(42);
    expect(lessonsForTrack("II_III")).toHaveLength(31);
    expect(
      STAGES.filter((s) => s.lessons.some((l) => l.tracks.includes("II_III"))),
    ).toHaveLength(6);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(8);
    for (const lesson of ALL_LESSONS) {
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.explanationHtml).toContain('class="merke"');
      expect(lesson.formulas.length).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals).toHaveLength(3);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(
        [
          lesson.quiz.question,
          ...lesson.quiz.options,
          lesson.quiz.explanation,
          ...lesson.formulas.map((f) => f.quantities),
        ].join(" "),
      ).not.toMatch(/&(?:lt|gt|amp);/);
      expect(new Set(lesson.quiz.options).size).toBe(
        lesson.quiz.options.length,
      );
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      for (const track of lesson.tracks)
        expect(lesson.lehrplan).toContain(
          `(${track === "I" ? "I" : "II/III"})`,
        );
      const topic = STAGES.find(
        (stage) => stage.id === lesson.stageId,
      )!.lehrplanLabel.split(": ")[1];
      expect(topic.length).toBeGreaterThan(0);
      expect(lesson.lehrplan.split(": ")[1]).toBe(topic);
    }
  });
  it("maps all 62 current official competences verbatim and only to applicable lessons", () => {
    expect(source.tracks.I.areas.map((a) => a.hours)).toEqual([
      10, 23, 14, 10, 12, 22, 12, 9,
    ]);
    expect(source.tracks.II_III.areas.map((a) => a.hours)).toEqual([
      10, 21, 10, 22, 12, 9,
    ]);
    expect(coverage.rows).toHaveLength(62);
    for (const track of ["I", "II_III"] as const) {
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
      expect(row.status).toBe("implemented");
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(40);
      for (const id of row.lessons) {
        const lesson = findLessonById(id)?.lesson;
        expect(lesson, id).toBeDefined();
        expect(lesson?.tracks).toContain(row.track);
        expect(lesson?.lehrplan).toContain(
          `M7 LB ${row.lb} (${row.track === "I" ? "I" : "II/III"})`,
        );
      }
    }
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
      new Set(IDS),
    );
  });
  it("keeps I-only content out of the II/III forward and backward path", () => {
    expect(nextLesson("pv-2-vektoren", "II_III")?.id).toBe(
      "pv-4-parallelogramm-mitte",
    );
    expect(nextLesson("pv-7-winkelsummen", "II_III")?.id).toBe(
      "ol-1-kreisbereiche",
    );
    expect(previousLesson("ol-1-kreisbereiche", "II_III")?.id).toBe(
      "pv-7-winkelsummen",
    );
    expect(nextLesson("ol-4-kreis-gerade", "II_III")?.id).toBe(
      "ol-6-ortsschnitte",
    );
    expect(nextLesson("ol-7-umkreis-inkreis", "II_III")?.id).toBe("al-1-terme");
    expect(
      lessonTitleForTrack(
        findLessonById("pv-4-parallelogramm-mitte")!.lesson,
        "II_III",
      ),
    ).toBe("2.3 Parallelogramm und Mittelpunkt");
    expect(stageNumberForTrack(STAGES[4], "II_III")).toBe(3);
    expect(
      lessonsForTrack("II_III").every(
        (l) => !l.id.startsWith("dr-") && !l.id.startsWith("rg-"),
      ),
    ).toBe(true);
  });
});
describe("Lehrervideos", () => {
  it("keeps the manually verified video ids on exactly the intended lessons", () => {
    expect(Object.keys(teacherVideos)).toEqual(IDS);
    expect(Object.keys(teacherVideoIds)).toEqual(IDS);
    const pinned: Record<string, string> = teacherVideoIds;
    for (const lesson of ALL_LESSONS) {
      expect(lesson.teacherVideo, lesson.id).toEqual({
        ...teacherVideos[lesson.id as keyof typeof teacherVideos],
        url: `https://www.youtube.com/watch?v=${pinned[lesson.id]}`,
      });
      expect(lesson.teacherVideo?.title.trim().length).toBeGreaterThan(8);
      expect(lesson.teacherVideo?.author?.trim().length).toBeGreaterThan(3);
    }
  });
  it("uses direct HTTPS watch links without embeds or tracking parameters", () => {
    for (const lesson of ALL_LESSONS) {
      const url = new URL(lesson.teacherVideo!.url);
      expect(url.origin).toBe("https://www.youtube.com");
      expect(url.pathname).toBe("/watch");
      expect([...url.searchParams.keys()]).toEqual(["v"]);
      expect(url.searchParams.get("v")).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(url.hash).toBe("");
    }
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
    for (const track of ["I", "II_III"] as const) {
      expect(overallStats(p, STAGES, track).total).toBe(
        track === "I" ? 42 : 31,
      );
      expect(isStageComplete(p, STAGES[0], track)).toBe(false);
    }
    for (const l of lessonsForTrack("II_III")) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(overallStats(p, STAGES, "II_III").percent).toBe(100);
    expect(overallStats(p, STAGES, "I").completed).toBe(31);
    expect(isStageComplete(p, STAGES[0], "II_III")).toBe(true);
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
  it("pins all 42 lesson identities and 168 atom/item IDs, including the original five lessons", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms[0].id).toBe("01M5KX1QRJS5FXTEHCQB856W97");
    expect(cell.atoms[0].practice_items[0].id).toBe(
      "01M5KX1QRMXBW894Y6CPWKQ95G",
    );
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-realschule-7");
    expect(cell.atoms).toHaveLength(42);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(126);
    const ids = cell.atoms.flatMap((a) => [
      a.id,
      ...a.practice_items.map((i) => i.id),
    ]);
    expect(new Set(ids).size).toBe(168);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });
  it("binds each official track to the right LB without hidden I-only prerequisites", () => {
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
          7,
          "mathematik",
          `lb${row?.lb}`,
        ]);
      }
      for (const prereq of a.prerequisites) {
        const previous = cell.atoms.find(
          (candidate) => candidate.id === prereq.atom_id,
        );
        expect(previous).toBeDefined();
        if (l.tracks.includes("II_III"))
          expect(previous?.curricula.some((c) => c.track === "II_III")).toBe(
            true,
          );
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
  it("accounts for 30 old items with seven transfer proposals, one retirement proposal and no applied migration", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toHaveLength(30);
    expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(30);
    expect(mapping.sources).toHaveLength(4);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(7);
    expect(mapping.rows.filter((r) => r.action === "keep-active")).toHaveLength(
      22,
    );
    expect(
      mapping.rows
        .filter((r) => r.action === "propose-retire-after-approval")
        .map((r) => r.de_by_id),
    ).toEqual(["01K4M7K0000000000000000J02"]);
    for (const r of mapping.rows) {
      expect(r.reason.length).toBeGreaterThan(40);
      if (r.category === "A") {
        expect(
          cell.atoms
            .flatMap((a) => a.practice_items)
            .some((i) => i.slug === r.academy_slug),
        ).toBe(true);
        expect(r.action).toBe("propose-replace-after-approval");
      } else {
        expect(r.category).toBe("C");
        expect(r.academy_slug).toBeNull();
        expect(r.action).toBe(
          r.de_by_id === "01K4M7K0000000000000000J02"
            ? "propose-retire-after-approval"
            : "keep-active",
        );
      }
    }
  });
});
