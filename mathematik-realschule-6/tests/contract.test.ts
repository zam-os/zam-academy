import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  STAGES,
  findLessonById,
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

// Thomas approved the mapping on 2026-11-08 (cell 2026.11.2): each A successor
// declares `replaces` on exactly its one old card, and no other card does.
const approvedReplaces = new Map(
  mapping.rows.filter((row) => row.category === "A").map((row) => [row.academy_slug, [row.de_by_id]]),
);
const replacesOf = (item: object): string[] =>
  (item as { replaces?: string[] }).replaces ?? [];

interface Item {
  id: string;
  slug: string;
  source_link: string;
  question?: string;
  concept?: string;
  choice_distractors: { text: string; reason: string }[];
  fast_check?: { options: unknown[]; correct_index: number };
  sample_solution?: string;
  question_segments?: { type: string; speech?: string; tex?: string }[];
  concept_segments?: { type: string; speech?: string; tex?: string }[];
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
const cell = rawCell as unknown as {
  tile_id: string;
  atoms: Atom[];
  retired_items?: unknown;
};
const IDS = ALL_LESSONS.map((l) => l.id);
const blank = (): LearnerProgress => ({
  activeLessonId: IDS[0],
  difficultyLevel: 1,
  quizDone: [],
  labGoals: {},
  solved: {},
  attempts: {},
  celebratedStageIds: [],
  celebratedLessonIds: [],
});

describe("Lehrplan und Umfang", () => {
  it("covers all six areas in one shared path with substantive lessons", () => {
    expect(STAGES).toHaveLength(6);
    expect(STAGES.map((s) => s.lessons.length)).toEqual([19, 6, 6, 4, 7, 5]);
    expect(ALL_LESSONS).toHaveLength(47);
    expect(new Set(IDS).size).toBe(47);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(6);
    for (const stage of STAGES)
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `)).toBe(true);
        expect(lesson.lehrplan).toBe(stage.lehrplanLabel);
      });
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
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
    }
  });

  it("maps all 32 official competences verbatim to lessons of the right Lernbereich", () => {
    expect(source.areas.map((a) => a.hours)).toEqual([68, 13, 18, 14, 15, 12]);
    expect(source.areas.map((a) => a.competences.length)).toEqual([10, 5, 4, 2, 7, 4]);
    expect(coverage.rows).toHaveLength(32);
    expect(coverage.rows.map((r) => `${r.lb}:${r.competence}`)).toEqual(
      source.areas.flatMap((a) => a.competences.map((c) => `${a.lb}:${c}`)),
    );
    for (const row of coverage.rows) {
      expect(row.status).toBe("implemented");
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(40);
      for (const id of row.lessons) {
        const lesson = findLessonById(id)?.lesson;
        expect(lesson, id).toBeDefined();
        expect(lesson?.lehrplan).toContain(`M6 LB ${row.lb}:`);
      }
    }
    expect(coverage.optional_lessons).toEqual([]);
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(new Set(IDS));
  });

  it("keeps the order of the shared path", () => {
    expect(previousLesson(IDS[0])).toBeUndefined();
    expect(nextLesson(IDS[IDS.length - 1])).toBeUndefined();
    IDS.slice(1).forEach((id, index) =>
      expect(previousLesson(id)?.id).toBe(IDS[index]),
    );
  });
});

describe("Sprache", () => {
  const texts = ALL_LESSONS.flatMap((lesson) => [
    lesson.whyItMatters,
    lesson.explanationHtml,
    lesson.quiz.question,
    ...lesson.quiz.options,
    lesson.quiz.explanation,
    lesson.lab.intro,
    ...lesson.lab.goals.map((g) => g.text),
  ]);
  it("uses the real minus sign and the decimal comma in lesson texts", () => {
    for (const text of texts) {
      const plain = text.replace(/<[^>]+>/g, " ");
      expect(plain, plain).not.toMatch(/(^|[\s(=:])-\d/);
      expect(plain, plain).not.toMatch(/\d\.\d/);
    }
  });
  it("addresses the learner informally", () => {
    // "Ihre" can be third person ("Trapeze … Ihre Formel"); "Ihnen" here never is.
    expect(texts.join(" ")).not.toMatch(/\bIhnen\b/);
    expect(texts.join(" ")).toMatch(/\bdu\b/);
  });
});

describe("Lehrervideos", () => {
  it("pins the verified video ids, original titles and channels on exactly the intended lessons", () => {
    expect(Object.keys(teacherVideos)).toEqual(IDS);
    expect(Object.keys(teacherVideoIds)).toEqual(IDS);
    interface PinnedVideo {
      id: string;
      title: string;
      author: string;
      scope: string;
      additional?: PinnedVideo[];
    }
    const pinned: Record<string, PinnedVideo> = teacherVideoIds;
    const expectedVideo = ({ id, title, author, scope }: PinnedVideo) => ({
      url: `https://www.youtube.com/watch?v=${id}`,
      title,
      author,
      scope,
    });
    for (const lesson of ALL_LESSONS) {
      expect(lesson.teacherVideo, lesson.id).toEqual(
        expectedVideo(pinned[lesson.id]),
      );
      expect(lesson.additionalTeacherVideos, lesson.id).toEqual(
        (pinned[lesson.id].additional ?? []).map(expectedVideo),
      );
      const videos = [
        lesson.teacherVideo!,
        ...(lesson.additionalTeacherVideos ?? []),
      ];
      expect(new Set(videos.map((video) => video.url)).size, lesson.id).toBe(
        videos.length,
      );
      for (const video of videos) {
        expect(video.title.trim().length).toBeGreaterThan(8);
        expect(video.author?.trim().length).toBeGreaterThan(3);
        expect(video.scope.trim().length).toBeGreaterThan(30);
      }
    }
  });
  it("uses direct HTTPS watch links without embeds or tracking parameters", () => {
    const videos = ALL_LESSONS.flatMap((lesson) => [
      lesson.teacherVideo!,
      ...(lesson.additionalTeacherVideos ?? []),
    ]);
    for (const video of videos) {
      const url = new URL(video.url);
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
    const p = blank();
    const l = ALL_LESSONS[0];
    p.quizDone.push(l.id);
    p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
    p.solved[l.id] = { 1: 3, 2: 2 };
    expect(isLessonComplete(p, l)).toBe(false);
    p.solved[l.id][2] = 3;
    expect(isLessonComplete(p, l)).toBe(true);
    p.labGoals[l.id].pop();
    expect(isLessonComplete(p, l)).toBe(false);
  });
  it("counts stages and the whole path", () => {
    const p = blank();
    expect(overallStats(p, STAGES).total).toBe(47);
    expect(isStageComplete(p, STAGES[1])).toBe(false);
    for (const l of STAGES[1].lessons) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(isStageComplete(p, STAGES[1])).toBe(true);
    expect(overallStats(p, STAGES).completed).toBe(6);
    expect(overallStats(p, STAGES).completedStages).toBe(1);
  });
  it("resolves every card deep link and ignores malformed fragments", () => {
    for (const l of ALL_LESSONS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(l.id)).hash).lessonId).toBe(l.id);
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
  it("pins all 47 lesson identities and 188 atom and item ids", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-realschule-6");
    expect(cell.atoms).toHaveLength(47);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(141);
    const ids = cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)]);
    expect(new Set(ids).size).toBe(188);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    const slugs = cell.atoms.flatMap((a) => a.practice_items.map((i) => i.slug));
    expect(new Set(slugs).size).toBe(141);
  });
  it("binds each atom to its stage and Lernbereich for all Zweige, with earlier prerequisites", () => {
    const seen = new Set<string>();
    for (const [n, a] of cell.atoms.entries()) {
      const l = ALL_LESSONS[n];
      expect(a.source_link).toBe(lessonLink(l.id));
      const official = a.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track).toBeUndefined();
      const stage = STAGES.find((s) => s.id === l.stageId)!;
      expect([official[0].grade, official[0].subject, official[0].topic_code]).toEqual([
        6,
        "mathematik",
        `lb${stage.stageNumber}`,
      ]);
      for (const prereq of a.prerequisites)
        expect(seen.has(prereq.atom_id), `${a.slug} builds on a later atom`).toBe(true);
      seen.add(a.id);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(a.source_link);
        expect(replacesOf(i), i.slug).toEqual(approvedReplaces.get(i.slug) ?? []);
      }
    }
    expect("retired_items" in cell).toBe(false);
  });
  it("has binary checks, meaningful curated reasons, transfer solutions and spoken formulas", () => {
    for (const a of cell.atoms) {
      expect(a.practice_items).toHaveLength(3);
      for (const i of a.practice_items) {
        expect(i.choice_distractors).toHaveLength(2);
        expect(i.choice_distractors.every((d) => d.reason.length > 15)).toBe(true);
        if (i.fast_check) {
          expect(i.fast_check.options).toHaveLength(2);
          expect(i.fast_check.correct_index).toBe(0);
        } else expect(i.sample_solution?.length).toBeGreaterThan(30);
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const s of i[key] ?? [])
            if (s.type === "math") {
              expect(s.tex?.length).toBeGreaterThan(0);
              expect(s.speech?.length).toBeGreaterThan(0);
            }
      }
    }
  });
  it("accounts for 16 old items with six approved transfers", () => {
    expect(mapping.approved).toBe("2026-11-08");
    expect(mapping.status).toBe("approved");
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(16);
    expect(mapping.sources).toHaveLength(2);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(6);
    expect(mapping.rows.filter((r) => r.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((r) => r.action === "keep-active")).toHaveLength(10);
    const items = cell.atoms.flatMap((a) => a.practice_items);
    const successors = mapping.rows.filter((r) => r.category === "A").map((r) => r.academy_slug);
    expect(new Set(successors).size).toBe(6);
    for (const r of mapping.rows) {
      expect(r.reason.length).toBeGreaterThan(15);
      if (r.category === "A") {
        expect(items.some((i) => i.slug === r.academy_slug)).toBe(true);
        expect(r.action).toBe("replace");
        expect(replacesOf(items.find((i) => i.slug === r.academy_slug)!)).toEqual([r.de_by_id]);
      } else {
        expect(r.category).toBe("C");
        expect(r.academy_slug).toBeNull();
        expect(r.action).toBe("keep-active");
      }
    }
  });
});
