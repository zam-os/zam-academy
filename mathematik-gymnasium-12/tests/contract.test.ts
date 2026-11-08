import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  STAGES,
  findLessonById,
  nextLesson,
  previousLesson,
} from "../src/curriculum";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  isLessonComplete,
  isStageComplete,
  overallStats,
  stageStats,
  type LearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import source from "../src/curriculum/source.json";
import coverage from "../coverage.json";
import rawCell from "../cell.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";

interface Item {
  id: string;
  slug: string;
  source_link: string;
  tier: string;
  choice_distractors: { text: string; reason: string }[];
  fast_check?: { options: string[]; correct_index: number };
  sample_solution?: string;
  question?: string;
  concept?: string;
  replaces?: string[];
  question_segments?: { type: string; text?: string; speech?: string }[];
  concept_segments?: { type: string; text?: string; speech?: string }[];
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
    school_type?: string;
    topic_code: string;
    topic_title: string;
  }[];
  practice_items: Item[];
}

const cell = rawCell as unknown as {
  tile_id: string;
  atoms: Atom[];
  sources: { uri: string }[];
};

const IDS = ALL_LESSONS.map((l) => l.id);
/** A hyphen used as a minus sign: before a digit, a bracket or a variable, or as an operator. */
const HYPHEN_MINUS = /(^|[\s(|=])-(?=[\s\d(a-zα-ω])/;
const LESSONS = 30;
const CARDS = 90;

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

describe("Lehrplan und Umfang (Gymnasium 12)", () => {
  it("covers all five Lernbereiche with substantive lessons and one accent per stage", () => {
    expect(STAGES).toHaveLength(5);
    expect(ALL_LESSONS).toHaveLength(LESSONS);
    expect(STAGES.map((s) => s.lessons.length)).toEqual([8, 5, 4, 8, 5]);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(5);
    expect(new Set(IDS).size).toBe(LESSONS);

    for (const lesson of ALL_LESSONS) {
      expect(lesson.explanationHtml, lesson.id).toContain('class="example"');
      expect(lesson.explanationHtml, lesson.id).toContain('class="merke"');
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals, lesson.id).toHaveLength(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(lesson.lehrplan).toMatch(/^M12 LB [1-5](\.[1-3])?: /);
      expect(lesson.teacherVideo, `${lesson.id}: videos follow in a later step`).toBeUndefined();
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

  it("keeps the Lernbereich labels of the official plan on every stage and lesson", () => {
    source.areas.forEach((area, index) => {
      const stage = STAGES[index];
      expect(stage.title).toBe(area.title);
      expect(stage.lehrplanLabel).toBe(`M12 LB ${area.lb}: ${area.title}`);
      for (const lesson of stage.lessons) {
        const section = lesson.lehrplan.match(/^M12 LB (\d\.\d): (.+)$/);
        if (section) {
          expect(((area.sections as unknown) as Record<string, string>)[section[1]]).toBe(section[2]);
        } else {
          expect(lesson.lehrplan).toBe(stage.lehrplanLabel);
        }
      }
    });
  });

  it("maps all 30 official competences verbatim to lessons of their own Lernbereich", () => {
    expect(source.areas.map((a) => a.hours)).toEqual([33, 22, 8, 29, 20]);
    expect(source.areas.map((a) => a.competences.length)).toEqual([8, 5, 4, 8, 5]);
    expect(coverage.rows).toHaveLength(30);

    const expected = source.areas.flatMap((a) =>
      a.competences.map((c) => `${a.lb}:${c.text}`),
    );
    expect(coverage.rows.map((r) => `${r.lb}:${r.competence}`)).toEqual(expected);

    for (const row of coverage.rows) {
      expect(row.status).toBe("implemented");
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(30);
      for (const id of row.lessons) {
        const found = findLessonById(id);
        expect(found, id).toBeDefined();
        expect(found!.stage.stageNumber, `${id} in LB ${row.lb}`).toBe(row.lb);
      }
    }
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(new Set(IDS));
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("names the labs and generators the evidence relies on", () => {
    const names = new Set(
      ALL_LESSONS.flatMap((l) => [l.lab.kind, ...l.exercises.map((g) => g.id)]),
    );
    const mentioned = coverage.rows.flatMap((r) =>
      [...r.evidence.matchAll(/\b[a-z0-9]+(?:-[a-z0-9]+)+\b/g)].map((m) => m[0]),
    );
    const unknown = mentioned.filter(
      (word) => !names.has(word) && !IDS.includes(word),
    );
    expect(unknown).toEqual([]);
  });

  it("gives level 2 a different task than level 1 from the same seed", () => {
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises) {
        for (let seed = 1; seed <= 20; seed++) {
          const one = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), 1);
          const two = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), 2);
          expect(one.prompt, `${lesson.id}/${generator.id}`).not.toBe(two.prompt);
          expect(one.formulaHint, `${lesson.id}/${generator.id}`).toBeTruthy();
          expect(two.formulaHint, `${lesson.id}/${generator.id}`).toBeUndefined();
        }
      }
    }
  });

  it("walks the whole path forward and backward", () => {
    expect(previousLesson(IDS[0])).toBeUndefined();
    expect(nextLesson(IDS[IDS.length - 1])).toBeUndefined();
    for (let i = 0; i + 1 < IDS.length; i++) {
      expect(nextLesson(IDS[i])?.id).toBe(IDS[i + 1]);
      expect(previousLesson(IDS[i + 1])?.id).toBe(IDS[i]);
    }
    STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title).toMatch(new RegExp(`^${stage.stageNumber}\\.${index + 1} `));
      });
    });
  });

  it("shows the right quick-check answer at different positions across lessons", () => {
    const shownAt = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      const order = quizOrder(lesson);
      expect([...order].sort()).toEqual(lesson.quiz.options.map((_, i) => i));
      shownAt.add(order.indexOf(lesson.quiz.correctIndex));
    }
    expect([...shownAt].sort()).toEqual([0, 1, 2]);
  });

  it("writes minus signs as − in every fixed text of a lesson", () => {
    for (const lesson of ALL_LESSONS) {
      const texts = [
        lesson.title,
        lesson.subtitle,
        lesson.whyItMatters,
        lesson.explanationHtml.replace(/<[^>]*>/g, " "),
        lesson.quiz.question,
        lesson.quiz.explanation,
        ...lesson.quiz.options,
        lesson.lab.intro,
        ...lesson.lab.goals.map((g) => g.text),
        ...(lesson.formulas ?? []).map((f) => f.html.replace(/<[^>]*>/g, " ")),
      ];
      for (const text of texts) {
        expect(text, lesson.id).not.toMatch(HYPHEN_MINUS);
      }
    }
  });
});

describe("Fortschritt und Navigation", () => {
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

  it("counts the whole path and each stage", () => {
    const p = blank();
    expect(overallStats(p, STAGES).total).toBe(LESSONS);
    expect(overallStats(p, STAGES).totalStages).toBe(5);
    expect(isStageComplete(p, STAGES[0])).toBe(false);

    for (const l of STAGES[0].lessons) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(stageStats(p, STAGES[0]).percent).toBe(100);
    expect(isStageComplete(p, STAGES[0])).toBe(true);
    expect(overallStats(p, STAGES).completed).toBe(8);
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

describe("ZAM-Karten und öffentliche Identitäten", () => {
  it("pins all lesson identities, atom and item ids against contract", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-12");
    expect(cell.atoms).toHaveLength(LESSONS);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(CARDS);
    const ids = cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)]);
    expect(new Set(ids).size).toBe(LESSONS + CARDS);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });

  it("binds each atom to its stage and Lernbereich at the Gymnasium and cites its lesson", () => {
    const earlier = new Set<string>();
    for (const [n, a] of cell.atoms.entries()) {
      const l = ALL_LESSONS[n];
      const stage = findLessonById(l.id)!.stage;
      expect(a.source_link).toBe(lessonLink(l.id));

      const official = a.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track, "no Zweige at the Gymnasium in grade 12").toBeUndefined();
      expect([
        official[0].school_type,
        official[0].grade,
        official[0].subject,
        official[0].topic_code,
        official[0].topic_title,
      ]).toEqual([
        "gymnasium",
        12,
        "mathematik",
        `lb${stage.stageNumber}`,
        stage.title,
      ]);

      const own = a.curricula.find((c) => c.provider === "zam-academy");
      expect(own?.topic_code).toBe(stage.id);

      for (const prereq of a.prerequisites) {
        expect(earlier.has(prereq.atom_id), `${a.slug} builds only on earlier atoms`).toBe(true);
      }
      earlier.add(a.id);

      for (const i of a.practice_items) {
        expect(i.source_link).toBe(a.source_link);
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
        if (i.tier === "tier1_fast") {
          expect(i.fast_check?.options).toHaveLength(2);
          expect(i.fast_check?.correct_index).toBe(0);
        } else {
          expect(i.tier).toBe("tier2_transfer");
          expect(i.fast_check).toBeUndefined();
          expect(i.sample_solution?.length).toBeGreaterThan(3);
        }
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const s of i[key] ?? [])
            if (s.type === "math") expect(s.speech?.length).toBeGreaterThan(0);
      }
    }
  });

  it("writes minus signs as − in every text of a card", () => {
    for (const a of cell.atoms) {
      for (const i of a.practice_items) {
        const texts = [
          i.question,
          i.concept,
          i.sample_solution,
          ...(i.question_segments ?? []).map((s) => s.text),
          ...(i.concept_segments ?? []).map((s) => s.text),
          ...(i.fast_check?.options ?? []),
          ...i.choice_distractors.flatMap((d) => [d.text, d.reason]),
        ];
        for (const text of texts) {
          if (text) expect(text, i.slug).not.toMatch(HYPHEN_MINUS);
        }
      }
    }
  });

  it("strictly enforces proposal-only status with approved null and zero cell replaces (Hard Rules 1 & 6)", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.source).toContain("noch nicht von Thomas freigegeben");

    // No item in cell.json may declare replaces while approved is null
    const replacedInCell = cell.atoms
      .flatMap((a) => a.practice_items)
      .filter((i) => "replaces" in i);
    expect(replacedInCell).toHaveLength(0);

    // Mapping rows structure
    expect(mapping.rows).toHaveLength(12);
    expect(mapping.sources).toHaveLength(3);
    const catA = mapping.rows.filter((r) => r.category === "A");
    const catC = mapping.rows.filter((r) => r.category === "C");
    expect(catA).toHaveLength(3);
    expect(catC).toHaveLength(9);

    for (const r of catA) {
      expect(r.action).toBe("propose-replace-after-approval");
      expect(r.academy_slug).toBeTruthy();
      const targetItem = cell.atoms
        .flatMap((a) => a.practice_items)
        .find((i) => i.slug === r.academy_slug);
      expect(targetItem, `target item for ${r.de_by_id}`).toBeDefined();
    }
    for (const r of catC) {
      expect(r.action).toBe("keep-active");
      expect(r.academy_slug).toBeNull();
    }
  });
});
