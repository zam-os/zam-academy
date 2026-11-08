import { describe, expect, it } from "vitest";
import { ALL_LESSONS, STAGES, findLessonById, nextLesson, previousLesson } from "../src/curriculum";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng, seedFrom } from "../src/exercises/rng";
import { isLessonComplete, isStageComplete, overallStats, stageStats, type LearnerProgress } from "../src/storage/progress";
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
  question_segments?: { type: string; speech?: string }[];
  concept_segments?: { type: string; speech?: string }[];
}
interface Atom {
  id: string;
  slug: string;
  source_link: string;
  prerequisites: { atom_id: string; type: string }[];
  curricula: {
    provider: string;
    track?: string;
    grade?: number;
    subject?: string;
    school_type?: string;
    topic_code: string;
    topic_title: string;
    exam_relevant?: boolean;
  }[];
  practice_items: Item[];
}
const cell = rawCell as unknown as { tile_id: string; atoms: Atom[]; sources: { uri: string }[] };
const IDS = ALL_LESSONS.map((lesson) => lesson.id);
const HYPHEN_MINUS = /(^|[\s(|=])-(?=[\s\d(a-zα-ω])/;
const LESSONS = 47;
const CARDS = 141;
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
  it("covers all three Lernbereiche with substantive lessons and one accent per stage", () => {
    expect(STAGES).toHaveLength(3);
    expect(ALL_LESSONS).toHaveLength(LESSONS);
    expect(STAGES.map((stage) => stage.lessons.length)).toEqual([27, 12, 8]);
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(3);
    expect(new Set(IDS).size).toBe(LESSONS);
    for (const lesson of ALL_LESSONS) {
      expect(lesson.explanationHtml, lesson.id).toContain('class="example"');
      expect(lesson.explanationHtml, lesson.id).toContain('class="merke"');
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals, lesson.id).toHaveLength(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(lesson.lehrplan).toMatch(/^M6 LB \d(\.\d)?: /);
      expect(lesson.teacherVideo, `${lesson.id}: videos follow in a later step`).toBeUndefined();
      expect(lesson.quiz.options).toHaveLength(3);
      expect(new Set(lesson.quiz.options).size).toBe(3);
    }
  });

  it("keeps the Lernbereich labels of the official plan on every stage and lesson", () => {
    source.areas.forEach((area, index) => {
      const stage = STAGES[index];
      expect(stage.title).toBe(area.title);
      expect(stage.lehrplanLabel).toBe(`M6 LB ${area.lb}: ${area.title}`);
      for (const lesson of stage.lessons) {
        const section = lesson.lehrplan.match(/^M6 LB (\d\.\d): (.+)$/);
        if (section) {
          expect((area.sections as Record<string, string>)[section[1]]).toBe(section[2]);
        } else {
          expect(lesson.lehrplan).toBe(stage.lehrplanLabel);
        }
      }
    });
  });

  it("maps all 33 official competences verbatim to lessons of their own Lernbereich", () => {
    expect(source.areas.map((area) => area.hours)).toEqual([68, 24, 20]);
    expect(source.areas.map((area) => area.competences.length)).toEqual([19, 9, 5]);
    expect(coverage.rows).toHaveLength(33);
    const expected = source.areas.flatMap((area) => area.competences.map((row) => `${area.lb}:${row.text}`));
    expect(coverage.rows.map((row) => `${row.lb}:${row.competence}`)).toEqual(expected);
    for (const row of coverage.rows) {
      expect(row.status).toBe("implemented");
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(40);
      for (const id of row.lessons) {
        const found = findLessonById(id);
        expect(found, id).toBeDefined();
        expect(found!.stage.stageNumber, `${id} in LB ${row.lb}`).toBe(row.lb);
      }
    }
    expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(new Set(IDS));
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("names the labs and generators the evidence relies on", () => {
    const names = new Set(ALL_LESSONS.flatMap((lesson) => [lesson.lab.kind, ...lesson.exercises.map((generator) => generator.id)]));
    const mentioned = coverage.rows.flatMap((row) => [...row.evidence.matchAll(/\b[a-z]+(?:-[a-z]+)+\b/g)].map((match) => match[0]));
    const unknown = mentioned.filter((word) => !names.has(word) && !IDS.includes(word));
    expect(unknown).toEqual([]);
  });

  it("gives level 2 a different task than level 1 from the same seed", () => {
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (let seed = 1; seed <= 12; seed++) {
          const one = generator.make(createRng(seedFrom(`${lesson.id}:${seed}`)), 1);
          const two = generator.make(createRng(seedFrom(`${lesson.id}:${seed}`)), 2);
          expect(one.prompt, `${lesson.id}/${generator.id}`).not.toBe(two.prompt);
          expect(one.formulaHint, `${lesson.id}/${generator.id}`).toBeTruthy();
          expect(two.formulaHint, `${lesson.id}/${generator.id}`).toBeUndefined();
        }
  });

  it("walks the whole path forward and backward", () => {
    expect(previousLesson(IDS[0])).toBeUndefined();
    expect(nextLesson(IDS[IDS.length - 1])).toBeUndefined();
    for (let index = 0; index + 1 < IDS.length; index++) {
      expect(nextLesson(IDS[index])?.id).toBe(IDS[index + 1]);
      expect(previousLesson(IDS[index + 1])?.id).toBe(IDS[index]);
    }
    STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title).toMatch(new RegExp(`^${stage.stageNumber}\\.${index + 1} `));
      });
    });
  });

  it("does not pull grade 7 forward", () => {
    const later = /\bMedian\b|\bBoxplot\b|\bKongruenz\b|\bThales\b|\bPythagoras\b|\bbinomisch\b|\bAchsenspiegelung\b|\bMittelsenkrechte\b|\bProportionalität\b|\bVariable\b|\bPrisma\b|\blineare Gleichung\b/;
    for (const lesson of ALL_LESSONS)
      expect(lesson.explanationHtml + lesson.quiz.question + lesson.quiz.explanation, lesson.id).not.toMatch(later);
    for (const item of cell.atoms.flatMap((atom) => atom.practice_items))
      expect(JSON.stringify(item), item.slug).not.toMatch(later);
  });

  it("shows the right quick-check answer at different positions across lessons", () => {
    const shownAt = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      const order = quizOrder(lesson);
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
        ...lesson.lab.goals.map((goal) => goal.text),
        ...lesson.formulas.map((formula) => formula.html.replace(/<[^>]*>/g, " ")),
      ];
      for (const text of texts) expect(text, lesson.id).not.toMatch(HYPHEN_MINUS);
    }
  });

  it("keeps singular and plural apart and avoids bare four-digit numbers in a sample of tasks", () => {
    const wrong = /(?<![\d.,])1 (?:Busse|Kisten|Äpfel|Tage|Stunden|Minuten|Sekunden|Punkte|Reihen|Plätze|Stücke|Flächen|Ecken|Kanten|Karten|Tüten|Portionen|Kinder|Stockwerke|Abschnitte|Teilstriche|Möglichkeiten|Faktoren|negative Faktoren|gleiche Faktoren)\b|\bsind 1 Punkt\b|\b(?:sind es|fehlen noch) 1 (?:Grad|m|min|cm)\b/;
    const bare = /(?<![\d.,:|(])\d{4,}(?![\d.,])/;
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const)
          for (let seed = 1; seed <= 20; seed++) {
            const task = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), level);
            const shown = [task.prompt, ...task.steps, task.feedbackHint].join(" ");
            expect(shown, `${lesson.id}/${generator.id}`).not.toMatch(wrong);
            expect(shown.replace(/<[^>]+>/g, " "), `${lesson.id}/${generator.id}`).not.toMatch(bare);
          }
  });
});

describe("Fortschritt und Links", () => {
  it("requires every goal, quiz and three correct tasks at each level", () => {
    const progress = blank();
    const lesson = ALL_LESSONS[0];
    progress.quizDone.push(lesson.id);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: 3, 2: 2 };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.solved[lesson.id][2] = 3;
    expect(isLessonComplete(progress, lesson)).toBe(true);
  });

  it("counts the whole path and each stage", () => {
    const progress = blank();
    expect(overallStats(progress, STAGES).total).toBe(LESSONS);
    expect(overallStats(progress, STAGES).totalStages).toBe(3);
    for (const lesson of STAGES[1].lessons) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: 3, 2: 3 };
    }
    expect(stageStats(progress, STAGES[1]).percent).toBe(100);
    expect(isStageComplete(progress, STAGES[1])).toBe(true);
    expect(overallStats(progress, STAGES).completed).toBe(12);
  });

  it("resolves every card deep link", () => {
    for (const lesson of ALL_LESSONS)
      expect(parseTrainingDeepLink(new URL(lessonLink(lesson.id)).hash).lessonId).toBe(lesson.id);
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
  });
});

describe("ZAM-Karten", () => {
  it("pins all lesson identities, atom and item ids", () => {
    expect(cell.atoms.map((atom) => ({
      lesson: atom.slug,
      atom_id: atom.id,
      slug: atom.slug,
      items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
    }))).toEqual(contract);
    expect(cell.atoms.map((atom) => atom.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-6");
    expect(cell.atoms.flatMap((atom) => atom.practice_items)).toHaveLength(CARDS);
    const ids = cell.atoms.flatMap((atom) => [atom.id, ...atom.practice_items.map((item) => item.id)]);
    expect(new Set(ids).size).toBe(LESSONS + CARDS);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });

  it("binds each atom to its stage and Lernbereich at the Gymnasium and cites its lesson", () => {
    const earlier = new Set<string>();
    for (const [index, atom] of cell.atoms.entries()) {
      const lesson = ALL_LESSONS[index];
      const stage = findLessonById(lesson.id)!.stage;
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      const official = atom.curricula.filter((entry) => entry.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track).toBeUndefined();
      expect(official[0].exam_relevant).toBe(false);
      expect([official[0].school_type, official[0].grade, official[0].subject, official[0].topic_code, official[0].topic_title]).toEqual([
        "gymnasium", 6, "mathematik", `lb${stage.stageNumber}`, stage.title,
      ]);
      const own = atom.curricula.find((entry) => entry.provider === "zam-academy");
      expect(own?.topic_code).toBe(stage.id);
      for (const prerequisite of atom.prerequisites)
        expect(earlier.has(prerequisite.atom_id), `${atom.slug} builds only on earlier atoms`).toBe(true);
      earlier.add(atom.id);
    }
    expect("retired_items" in cell).toBe(false);
    expect(cell.atoms.every((atom) => atom.practice_items.every((item) => !item.replaces))).toBe(true);
  });

  it("has binary checks, curated reasons, transfer solutions and a spoken formula", () => {
    for (const atom of cell.atoms) {
      expect(atom.practice_items).toHaveLength(3);
      for (const item of atom.practice_items) {
        expect(item.choice_distractors).toHaveLength(2);
        expect(item.choice_distractors.every((distractor) => distractor.reason.length > 15)).toBe(true);
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.options).toHaveLength(2);
          expect(item.fast_check?.correct_index).toBe(0);
          expect(item.fast_check?.options[0]).toBe(item.concept);
        } else {
          expect(item.sample_solution?.length).toBeGreaterThan(3);
        }
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const segment of item[key] ?? [])
            if (segment.type === "math") expect(segment.speech?.length).toBeGreaterThan(0);
      }
    }
    expect(JSON.stringify(cell)).toContain('"type":"math"');
  });

  it("keeps the mapping a proposal until Thomas approves it", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toHaveLength(16);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(7);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(9);
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(30);
      if (row.category === "A") {
        const item = cell.atoms.flatMap((atom) => atom.practice_items).find((entry) => entry.slug === row.academy_slug);
        expect(item?.tier).toBe("tier1_fast");
        expect(row.action).toBe("propose-replace-after-approval");
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("keep-active");
      }
    }
  });
});
