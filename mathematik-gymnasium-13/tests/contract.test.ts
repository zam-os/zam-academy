import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  findLessonById,
  nextLesson,
  previousLesson,
  STAGES,
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
    exam_relevant?: boolean;
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
const LESSONS = 27;
const CARDS = 84;
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
  it("covers all four Lernbereiche with substantive lessons and one accent per stage", () => {
    expect(STAGES).toHaveLength(4);
    expect(ALL_LESSONS).toHaveLength(LESSONS);
    expect(STAGES.map((s) => s.lessons.length)).toEqual([9, 4, 9, 5]);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(4);
    expect(new Set(IDS).size).toBe(LESSONS);
    for (const lesson of ALL_LESSONS) {
      expect(lesson.explanationHtml, lesson.id).toContain('class="example"');
      expect(lesson.explanationHtml, lesson.id).toContain('class="merke"');
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals, lesson.id).toHaveLength(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(lesson.lehrplan).toMatch(/^M13 LB \d: /);
      expect(lesson.teacherVideo, `${lesson.id}: videos follow in a later step`).toBeUndefined();
      expect(
        [
          lesson.quiz.question,
          ...lesson.quiz.options,
          lesson.quiz.explanation,
          ...lesson.formulas.map((f) => f.quantities),
        ].join(" "),
      ).not.toMatch(/&(?:lt|gt|amp);/);
      // `quantities` is plain text in the formula table; HTML would show as tags.
      for (const formula of lesson.formulas) {
        expect(formula.quantities ?? "", `${lesson.id}: ${formula.name}`).not.toMatch(/<[a-z/]/i);
        expect(formula.name, lesson.id).not.toMatch(/<[a-z/]/i);
      }
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
    }
  });

  it("shows the right quick-check answer at different positions across lessons", () => {
    const shownAt = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      const order = quizOrder(lesson);
      expect([...order].sort()).toEqual(lesson.quiz.options.map((_, i) => i));
      shownAt.add(order.indexOf(lesson.quiz.correctIndex));
    }
    for (const position of [0, 1, 2]) expect(shownAt.has(position), `right answer shown at position ${position}`).toBe(true);
  });

  it("keeps the Lernbereich labels of the official plan on every stage and lesson", () => {
    source.areas.forEach((area, index) => {
      const stage = STAGES[index];
      expect(stage.stageNumber).toBe(area.lb);
      expect(stage.title).toBe(area.title);
      expect(stage.lehrplanLabel).toBe(`M13 LB ${area.lb}: ${area.title}`);
      for (const lesson of stage.lessons) {
        expect(lesson.lehrplan, lesson.id).toBe(stage.lehrplanLabel);
      }
    });
  });

  it("maps all 22 official competences verbatim to lessons of their own Lernbereich", () => {
    expect(source.areas.map((a) => a.hours)).toEqual([26, 14, 24, 20]);
    expect(source.areas.map((a) => a.competences.length)).toEqual([8, 4, 6, 4]);
    expect(coverage.rows).toHaveLength(22);
    const expected = source.areas.flatMap((a) =>
      a.competences.map((c) => `${a.lb}:${c.text}`),
    );
    expect(coverage.rows.map((r) => `${r.lb}:${r.competence}`)).toEqual(expected);
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
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(new Set(IDS));
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("names the labs and generators the evidence relies on", () => {
    const names = new Set(
      ALL_LESSONS.flatMap((l) => [l.lab.kind, ...l.exercises.map((g) => g.id)]),
    );
    const mentioned = coverage.rows.flatMap((r) =>
      [...r.evidence.matchAll(/\b[a-z]+(?:-[a-z]+)+\b/g)].map((m) => m[0]),
    );
    const unknown = mentioned.filter(
      (word) => !names.has(word) && !IDS.includes(word),
    );
    expect(unknown).toEqual([]);
  });

  it("gives level 2 a different task than level 1 from the same seed", () => {
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (let seed = 1; seed <= 20; seed++) {
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

  it("teaches only the Fachlehrplan M13, not the Vertiefungskurs or M12 repetitions", () => {
    // Vertiefungskurs M12 (Komplexe Zahlen, Folgen und Reihen, Matrizen,
    // Zahlentheorie) und M13-fremde Stochastik bleiben draußen.
    const later = /\bKomplexe Zahlen\b|\bMatrizen\b|\bFolgen und Reihen\b|\bZahlentheorie\b|\bMoivre\b|\bHypothesentest\b|\bSignifikanztest\b|\bBinomialverteilung\b/;
    for (const lesson of ALL_LESSONS)
      expect(lesson.explanationHtml + lesson.quiz.question + lesson.quiz.explanation, lesson.id).not.toMatch(later);
    for (const item of cell.atoms.flatMap((a) => a.practice_items))
      expect(JSON.stringify(item), item.slug).not.toMatch(later);
  });
});

/** Every generated task of a generator on both levels, or one level. */
function* tasks(lessonId: string, generatorId: string, level?: 1 | 2, seeds = 300) {
  const generator = findLessonById(lessonId)!.lesson.exercises.find((g) => g.id === generatorId)!;
  for (const lv of level ? [level] : ([1, 2] as const))
    for (let seed = 1; seed <= seeds; seed++)
      yield generator.make(createRng(seedFrom(`${lessonId}:${generatorId}:${seed}`)), lv);
}
const answers = (lessonId: string, generatorId: string, level: 1 | 2) => {
  // Over all fields: a task may ask one fixed conceptual fact beside a varying
  // number, but the tasks of a generator must vary overall.
  const out = new Set<string | number>();
  for (const task of tasks(lessonId, generatorId, level)) {
    for (const field of task.fields) {
      out.add(field.kind === "number" ? field.answer : field.options[field.correctIndex]);
    }
  }
  return out;
};

describe("Plausible Werte und Texte", () => {
  it("lets no generator on any level always have the same answer", () => {
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const)
          expect(answers(lesson.id, generator.id, level).size, `${lesson.id}/${generator.id} L${level}`).toBeGreaterThan(1);
  });

  it("writes minus signs as − in every fixed text of a lesson and every generated task", () => {
    for (const lesson of ALL_LESSONS) {
      const fixed = [
        lesson.title,
        lesson.subtitle,
        lesson.whyItMatters,
        lesson.explanationHtml,
        ...lesson.formulas.flatMap((f) => [f.name, f.html, f.quantities]),
        lesson.quiz.question,
        ...lesson.quiz.options,
        lesson.quiz.explanation,
        lesson.lab.title,
        lesson.lab.intro,
        ...lesson.lab.params.map((p) => (p as { label?: string }).label ?? ""),
        ...lesson.lab.readouts.map((r) => r.label),
        ...lesson.lab.goals.map((g) => g.text),
      ].join(" ");
      expect(fixed.replace(/<[^>]+>/g, " "), lesson.id).not.toMatch(HYPHEN_MINUS);
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const)
          for (let seed = 1; seed <= 40; seed++) {
            const task = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), level);
            const text = [task.prompt, ...task.given, ...task.steps, task.formulaHint ?? "", task.feedbackHint ?? ""].join(" ");
            expect(text.replace(/<[^>]+>/g, " "), `${lesson.id}/${generator.id}`).not.toMatch(HYPHEN_MINUS);
          }
    }
    for (const a of cell.atoms)
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
        for (const text of texts) if (text) expect(text, i.slug).not.toMatch(HYPHEN_MINUS);
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

  it("counts the whole path and each stage", () => {
    const p = blank();
    expect(overallStats(p, STAGES).total).toBe(LESSONS);
    expect(overallStats(p, STAGES).totalStages).toBe(4);
    expect(isStageComplete(p, STAGES[1])).toBe(false);
    for (const l of STAGES[1].lessons) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(stageStats(p, STAGES[1]).percent).toBe(100);
    expect(isStageComplete(p, STAGES[1])).toBe(true);
    expect(overallStats(p, STAGES).completed).toBe(4);
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
  it("pins all lesson identities, atom and item ids", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-13");
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
      expect(a.slug).toBe(l.id);
      const official = a.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track, "no Zweige at the Gymnasium in Jgst 13").toBeUndefined();
      expect([official[0].school_type, official[0].grade, official[0].subject, official[0].topic_code, official[0].topic_title]).toEqual([
        "gymnasium",
        13,
        "mathematik",
        `lb${stage.stageNumber}`,
        stage.title,
      ]);
      expect(official[0].exam_relevant).toBe(true);
      const own = a.curricula.find((c) => c.provider === "zam-academy");
      expect(own?.topic_code).toBe(stage.id);
      for (const prereq of a.prerequisites) {
        expect(earlier.has(prereq.atom_id), `${a.slug} builds only on earlier atoms`).toBe(true);
      }
      earlier.add(a.id);
      for (const i of a.practice_items) expect(i.source_link).toBe(a.source_link);
    }
    expect("retired_items" in cell).toBe(false);
  });

  it("has binary checks, meaningful curated reasons, transfer solutions and spoken formulas", () => {
    for (const a of cell.atoms) {
      expect(a.practice_items.length).toBeGreaterThanOrEqual(3);
      expect(a.practice_items.length).toBeLessThanOrEqual(4);
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
    expect(JSON.stringify(cell)).toContain('"type":"math"');
  });
});

describe("Bestandsabgleich", () => {
  it("records Thomas's approval and declares exactly the five approved transfers", () => {
    expect(mapping.approved).toBe("2026-11-08");
    expect(mapping.status).toBe("approved");
    expect(mapping.source).toContain("Freigabe für den Bestandsabgleich erteilt");
    expect(mapping.source).toContain("OpenCode-Chat");
    expect(mapping.source_repository).toBe("zam-os/zam");
    expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
    expect(mapping.sources).toHaveLength(3);
    const replaced = cell.atoms
      .flatMap((a) => a.practice_items)
      .filter((i) => "replaces" in i)
      .map((i) => [i.slug, i.replaces]);
    expect(Object.fromEntries(replaced)).toEqual(
      Object.fromEntries(
        mapping.rows.filter((r) => r.category === "A").map((r) => [r.academy_slug, [r.de_by_id]]),
      ),
    );
    expect(replaced).toHaveLength(5);
  });

  it("maps every old item exactly once with a category and a reason", () => {
    expect(mapping.rows).toHaveLength(12);
    expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(12);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(5);
    expect(mapping.rows.filter((r) => r.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(7);
    expect("retired_items" in cell).toBe(false);
    const slugs = new Set(cell.atoms.flatMap((a) => a.practice_items.map((i) => i.slug)));
    const successors: string[] = [];
    for (const row of mapping.rows) {
      expect(row.reason.length, row.de_by_id).toBeGreaterThan(30);
      expect(row.de_by_question, row.de_by_id).toBeTruthy();
      if (row.category === "A") {
        expect(row.action).toBe("replace");
        const successor = row.academy_slug;
        expect(successor, row.de_by_id).toBeTruthy();
        expect(slugs.has(successor!), successor ?? "").toBe(true);
        successors.push(successor!);
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("keep-active");
      }
    }
    expect(new Set(successors).size, "one history per successor").toBe(successors.length);
  });
});
