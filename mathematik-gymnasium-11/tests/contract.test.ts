import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import coverage from "../coverage.json";
import replacesJson from "../replaces-de-by.json";
import source from "../src/curriculum/source.json";
import legacyGeometrie from "./fixtures/de-by-gymnasium-11-mathematik-analytische-geometrie-ebenen-abstaende-kvt.json";
import legacyIntegral from "./fixtures/de-by-gymnasium-11-mathematik-integralrechnung-hauptsatz-flaechenberechnung-kvt.json";
import legacyKurven from "./fixtures/de-by-gymnasium-11-mathematik-kurvendiskussion-extremwertprobleme-wendepunkte-kvt.json";
import legacyStochastik from "./fixtures/de-by-gymnasium-11-mathematik-stochastik-bernoulli-binomialverteilung-kvt.json";
import { ALL_LESSONS, findLessonById, STAGES } from "../src/curriculum";
import { checkTask, parseNumber, parseNumberCandidates, wrongAnswerHint } from "../src/exercises/checker";
import { factorForm, linear, quadratic, vertexForm, withSubscripts } from "../src/exercises/format";
import { quizOrder } from "../src/exercises/quiz-order";
import type { ExerciseTask, NumberField } from "../src/model/types";
import { isLessonComplete, isStageComplete, isTransferDone, type LearnerProgress, overallStats } from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_ACADEMY_APP_URL } from "../src/zam/zam-link";
import { LESSON_IDS } from "./witnesses";

/**
 * LehrplanPLUS Mathematik 11 (Gymnasium, no Zweige): the Lernbereich of each
 * lesson family. LB 4 has two parts, 4.1 and 4.2, one stage each.
 */
const LERNBEREICH: Record<string, { lb: number; label: string }> = {
  fk: { lb: 1, label: "M11 LB 1:" },
  gr: { lb: 2, label: "M11 LB 2:" },
  bw: { lb: 3, label: "M11 LB 3:" },
  df: { lb: 4, label: "M11 LB 4.1:" },
  ku: { lb: 4, label: "M11 LB 4.2:" },
};

describe("Lernpfad", () => {
  it("has five stages in LehrplanPLUS order and lessons with stable ids", () => {
    expect(STAGES.map((stage) => stage.stageNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length);
    expect(new Set(STAGES.map((stage) => stage.accent)).size, "each stage has its own accent").toBe(STAGES.length);
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.id).toBe(true);
        expect(lesson.lehrplan.startsWith(LERNBEREICH[lesson.id.slice(0, 2)].label), `${lesson.id}: ${lesson.lehrplan}`).toBe(true);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.requiredCorrect).toBe(3);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(lesson.lab.goals.length).toBe(3);
        expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
        expect(lesson.explanationHtml, `${lesson.id} has a worked example`).toContain('<div class="example">');
        expect(lesson.explanationHtml, `${lesson.id} has a Merke box`).toContain('<div class="merke">');
      });
    }
  });

  it("takes every Kompetenzerwartung verbatim from the fetched Fachlehrplan", () => {
    expect(source.url).toBe("https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/mathematik");
    expect(source.html_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(source.areas.map((area) => area.lb)).toEqual([1, 2, 3, 4]);
    expect(source.areas.map((area) => area.hours)).toEqual([14, 15, 15, 37]);
    expect(source.areas.map((area) => area.competences.length)).toEqual([5, 5, 4, 12]);
    const expected = source.areas.flatMap((area) => area.competences.map((c) => `${area.lb}:${c.text}`));
    expect(coverage.rows.map((row) => `${row.lb}:${row.competence}`)).toEqual(expected);
  });

  it("maps every Kompetenzerwartung to lessons of its Lernbereich, and every lesson to a competence", () => {
    const rows = coverage.rows as Array<{ lb: number; section?: string; competence: string; lessons: string[]; evidence: string }>;
    expect(rows).toHaveLength(26);
    expect(coverage.optional_lessons).toEqual([]);
    for (const row of rows) {
      expect(row.lessons.length, row.competence).toBeGreaterThan(0);
      expect(row.evidence.length, row.competence).toBeGreaterThan(40);
      for (const id of row.lessons) {
        expect(findLessonById(id)?.lesson, `${id} in coverage.json`).toBeDefined();
        const family = LERNBEREICH[id.slice(0, 2)];
        expect(family.lb, `${id} in LB ${row.lb}`).toBe(row.lb);
        if (row.lb === 4) expect(family.label, `${id} in ${row.section}`).toContain(`LB ${row.section}:`);
      }
    }
    for (const lesson of ALL_LESSONS) {
      expect(rows.some((row) => row.lessons.includes(lesson.id)), `${lesson.id} covers a competence`).toBe(true);
    }
  });

  it("never uses the multiplication dot to separate formulas, so no list reads as a product", () => {
    const separator = /· [A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß, ]*[A-Za-zÄÖÜäöüß]:/;
    for (const lesson of ALL_LESSONS) {
      const lines = [
        ...lesson.formulas.map((formula) => formula.html),
        ...[...lesson.explanationHtml.matchAll(/<p class="formula-line">([\s\S]*?)<\/p>/g)].map((match) => match[1]),
      ];
      for (const line of lines) expect(line, `${lesson.id}: ${line}`).not.toMatch(separator);
    }
  });

  it("shows the right quick-check answer at different positions across lessons", () => {
    const shownAt = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
      const order = quizOrder(lesson);
      expect([...order].sort()).toEqual(lesson.quiz.options.map((_, i) => i));
      shownAt.add(order.indexOf(lesson.quiz.correctIndex));
    }
    for (const position of [0, 1, 2]) expect(shownAt.has(position), `right answer shown at position ${position}`).toBe(true);
  });

  it("links no teacher video yet: videos are added and checked in a separate step", () => {
    for (const lesson of ALL_LESSONS) expect(lesson.teacherVideo, lesson.id).toBeUndefined();
  });

  it("writes plain text without HTML entities where it is escaped, and sets P_B(A) and D_f as subscripts", () => {
    for (const lesson of ALL_LESSONS) {
      const plainTexts = [
        lesson.whyItMatters,
        lesson.quiz.question,
        ...lesson.quiz.options,
        lesson.quiz.explanation,
        ...lesson.formulas.map((formula) => formula.quantities),
        lesson.lab.intro,
        ...lesson.lab.goals.map((goal) => goal.text),
      ];
      for (const text of plainTexts) expect(text, lesson.id).not.toMatch(/&(gt|lt|amp);/);
    }
    expect(withSubscripts("P_B(A) und P_T̄(K̄), D_f")).toBe("P<sub>B</sub>(A) und P<sub>T̄</sub>(K̄), D<sub>f</sub>");
  });
});

describe("Prüfen der Eingabe", () => {
  const field = (answer: number, digits = 2, unit = ""): NumberField => ({ kind: "number", label: "x =", answer, unit, digits });
  const task = (...fields: NumberField[]): ExerciseTask => ({ prompt: "", given: [], fields, steps: ["", "<strong></strong>"] });

  it("reads numbers, fractions, multiples of π and percentages the way learners type them", () => {
    expect(parseNumber("2,5")).toBe(2.5);
    expect(parseNumber("2.5")).toBe(2.5);
    expect(parseNumberCandidates("1.500")).toEqual([1.5, 1500]);
    expect(parseNumber("1.234,5")).toBe(1234.5);
    expect(parseNumber("−3,2")).toBe(-3.2);
    expect(parseNumber("x = 4")).toBe(4);
    expect(parseNumber("12 cm²")).toBe(12);
    expect(parseNumber("3/5")).toBeCloseTo(0.6);
    expect(parseNumber("-7/2")).toBeCloseTo(-3.5);
    expect(parseNumber("60 %")).toBeCloseTo(0.6);
    expect(parseNumber("60 %", "%")).toBe(60);
    expect(parseNumber("4π")).toBeCloseTo(4 * Math.PI);
    expect(parseNumber("pi")).toBeCloseTo(Math.PI);
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1/0")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("wants exact answers exact and accepts rounding for the others", () => {
    expect(checkTask(task(field(3, 0)), ["3"]).status).toBe("correct");
    expect(checkTask(task(field(3, 0)), ["3,4"]).status).toBe("wrong");
    expect(checkTask(task(field(Math.sqrt(52), 2)), ["7,21"]).status).toBe("correct");
    expect(checkTask(task(field(Math.sqrt(52), 2)), ["7,3"]).status).toBe("wrong");
    expect(checkTask(task(field(1 / 3, 2)), ["1/3"]).status).toBe("correct");
    expect(checkTask(task(field(0.6, 2)), ["60 %"]).status).toBe("correct");
  });

  it("accepts both solutions in any order only where the task says so", () => {
    const solutions = { ...task(field(30, 0), field(150, 0)), anyOrder: [0, 1] };
    expect(checkTask(solutions, ["150", "30"]).status).toBe("correct");
    const point = task(field(2, 0), field(-5, 0));
    const swapped = checkTask(point, ["-5", "2"]);
    expect(swapped.status).toBe("wrong");
    expect(wrongAnswerHint(point, swapped)).toContain("vertauscht");
  });

  it("names the predicted slip and the sign", () => {
    const slip = task({ ...field(5, 2), slips: [{ value: 25, hint: "Das ist c². Ziehe noch die Wurzel." }] });
    expect(wrongAnswerHint(slip, checkTask(slip, ["25"]))).toContain("Wurzel");
    const sign = task(field(4, 0));
    expect(wrongAnswerHint(sign, checkTask(sign, ["-4"]))).toContain("Vorzeichen");
    const empty = task(field(1, 0), field(2, 0));
    expect(checkTask(empty, ["1", ""]).status).toBe("invalid");
  });

  it("writes terms the way the blackboard does", () => {
    expect(linear(0.5, -2)).toBe("0,5x − 2");
    expect(quadratic(2, -4, -6)).toBe("2x² − 4x − 6");
    expect(vertexForm(-0.5, -2, 0)).toBe("−0,5(x + 2)²");
    expect(factorForm(1, 2, -5)).toBe("(x − 2)(x + 5)");
  });
});

describe("Lektionsabschluss", () => {
  const blank = (): LearnerProgress => ({
    activeLessonId: LESSON_IDS[0],
    difficultyLevel: 1,
    quizDone: [],
    labGoals: {},
    solved: {},
    attempts: {},
    celebratedStageIds: [],
    celebratedLessonIds: [],
  });

  it("needs the quick check, every lab goal and the required Level-1 tasks; the transfer badge needs Level 2 too", () => {
    const progress = blank();
    const lesson = ALL_LESSONS[0];
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.quizDone.push(lesson.id);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect - 1, 2: lesson.requiredCorrect };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    expect(isLessonComplete(progress, lesson)).toBe(true);
    expect(isTransferDone(progress, lesson)).toBe(false);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: lesson.requiredCorrect };
    expect(isTransferDone(progress, lesson)).toBe(true);
  });

  it("counts every lesson of every stage; a stage is done when all its lessons are", () => {
    const progress = blank();
    expect(overallStats(progress, STAGES).totalStages).toBe(5);
    expect(overallStats(progress, STAGES).total).toBe(LESSON_IDS.length);
    const stage = STAGES[2];
    expect(isStageComplete(progress, stage)).toBe(false);
    for (const lesson of stage.lessons) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    }
    expect(isStageComplete(progress, stage)).toBe(true);
    expect(overallStats(progress, STAGES).completedStages).toBe(1);
  });
});

describe("Links from ZAM cards", () => {
  it("opens every lesson from the link a card cites", () => {
    for (const lesson of ALL_LESSONS) {
      const link = lessonLink(lesson.id);
      expect(link.startsWith(`${ZAM_ACADEMY_APP_URL}#lesson=`)).toBe(true);
      const hash = link.slice(link.indexOf("#"));
      expect(parseTrainingDeepLink(hash).lessonId).toBe(lesson.id);
      expect(findLessonById(lesson.id)?.lesson.id).toBe(lesson.id);
    }
  });

  it("reads the level next to the lesson and ignores values that are no lesson id", () => {
    expect(parseTrainingDeepLink("#lesson=fk-1-funktionstypen&level=2")).toEqual({ lessonId: "fk-1-funktionstypen", level: 2 });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
    expect(parseTrainingDeepLink("")).toEqual({});
  });
});

describe("ZAM-Zelle (cell.json)", () => {
  interface CellBinding {
    provider: string;
    school_type?: string;
    grade?: number;
    track?: string;
    subject?: string;
    topic_code: string;
  }
  interface CellSegment {
    type: string;
    text?: string;
    tex?: string;
    speech?: string;
  }
  interface CellItem {
    id: string;
    slug: string;
    tier?: string;
    bloom_level: number;
    source_link?: string;
    question?: string;
    concept?: string;
    question_segments?: CellSegment[];
    concept_segments?: CellSegment[];
    sample_solution?: string;
    fast_check?: { options: unknown[]; correct_index: number };
    choice_distractors?: Array<{ text: string; reason?: string }>;
    replaces?: string[];
  }
  interface CellAtom {
    id: string;
    slug: string;
    source_link?: string;
    prerequisites?: Array<{ atom_id: string }>;
    curricula?: CellBinding[];
    practice_items: CellItem[];
  }
  const cell = cellJson as unknown as { tile_id: string; version: string; atoms: CellAtom[]; retired_items?: unknown[] };
  const items = cell.atoms.flatMap((atom) => atom.practice_items);
  const prefix = `${ZAM_ACADEMY_APP_URL}#lesson=`;
  const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
  const lessonOf = (link: string | undefined) => (link?.startsWith(prefix) ? link.slice(prefix.length) : "");

  it("is the cell of this app with one atom per lesson, in lesson order", () => {
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-11");
    expect(/^\d+(\.\d+)*$/.test(cell.version)).toBe(true);
    expect(cell.atoms.map((atom) => lessonOf(atom.source_link))).toEqual(ALL_LESSONS.map((lesson) => lesson.id));
    expect(cell.retired_items ?? []).toEqual([]);
  });

  it("cites for every card the lesson of its atom, and binds the atom to its stage and Lernbereich", () => {
    for (const atom of cell.atoms) {
      const lessonId = lessonOf(atom.source_link);
      const found = findLessonById(lessonId);
      expect(found, `${atom.id} cites ${atom.source_link}`).toBeDefined();
      const { stage, lesson } = found!;
      const academy = atom.curricula?.find((binding) => binding.provider === "zam-academy");
      expect(academy?.topic_code, `${atom.slug} is bound to its stage`).toBe(stage.id);
      const lehrplan = (atom.curricula ?? []).filter((binding) => binding.provider === "lehrplanplus-bayern");
      expect(lehrplan, `${atom.slug} has one LehrplanPLUS binding`).toHaveLength(1);
      for (const binding of lehrplan) {
        expect(binding.school_type).toBe("gymnasium");
        expect(binding.grade).toBe(11);
        expect(binding.subject).toBe("mathematik");
        expect(binding.track, `${atom.slug}: the Gymnasium has no Zweige`).toBeUndefined();
        expect(binding.topic_code, atom.slug).toBe(`lb${LERNBEREICH[lesson.id.slice(0, 2)].lb}`);
      }
      expect(atom.practice_items.length, `${atom.slug} has cards`).toBeGreaterThanOrEqual(2);
      for (const item of atom.practice_items) {
        expect(lessonOf(item.source_link), `${item.id} cites its atom's lesson`).toBe(lessonId);
      }
    }
  });

  it("uses generated ULIDs, never hand-made id patterns (AGENTS.md, section 5)", () => {
    // The first ten characters of a ULID are its creation time in milliseconds.
    const created = (id: string) =>
      [...id.slice(0, 10)].reduce((time, char) => time * 32 + "0123456789ABCDEFGHJKMNPQRSTVWXYZ".indexOf(char), 0);
    for (const id of [...cell.atoms.map((atom) => atom.id), ...items.map((item) => item.id)]) {
      expect(id, id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      expect(new Date(created(id)).getUTCFullYear(), `${id} was generated, not composed`).toBe(2026);
      expect(id.slice(10), `${id} has random bits`).not.toMatch(/0{6}/);
    }
  });

  it("has well-formed cards: ULID-shaped ids, unique slugs, valid fast checks, formulas with speech", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const atom of cell.atoms) {
      expect(ULID.test(atom.id), atom.id).toBe(true);
      expect(ids.has(atom.id)).toBe(false);
      ids.add(atom.id);
      expect(slugs.has(atom.slug), `${atom.slug} is unique`).toBe(false);
      slugs.add(atom.slug);
      for (const prereq of atom.prerequisites ?? []) {
        expect(cell.atoms.some((other) => other.id === prereq.atom_id), `${atom.slug} needs ${prereq.atom_id}`).toBe(true);
      }
      for (const item of atom.practice_items) {
        expect(ULID.test(item.id), item.id).toBe(true);
        expect(ids.has(item.id), `${item.id} is unique`).toBe(false);
        ids.add(item.id);
        expect(item.slug.startsWith("m11-"), item.slug).toBe(true);
        expect(slugs.has(item.slug), `${item.slug} is unique`).toBe(false);
        slugs.add(item.slug);
        expect(item.bloom_level).toBeGreaterThanOrEqual(1);
        expect(item.bloom_level).toBeLessThanOrEqual(3);
        const hasQuestion = Boolean(item.question) || Boolean(item.question_segments?.length);
        const hasConcept = Boolean(item.concept) || Boolean(item.concept_segments?.length);
        expect(hasQuestion && hasConcept, `${item.slug} has question and answer`).toBe(true);
        for (const segment of [...(item.question_segments ?? []), ...(item.concept_segments ?? [])]) {
          if (segment.type === "math") {
            expect(segment.speech, `${item.slug}: formula ${segment.tex} is spoken`).toBeTruthy();
            expect(segment.speech).not.toMatch(/[\\$<]/);
          } else {
            expect(segment.text, `${item.slug}: text segment`).toBeTruthy();
            expect(segment.text).not.toMatch(/[$\\]|<[a-z]/);
          }
        }
        for (const plain of [item.question, item.concept, item.sample_solution]) {
          if (plain) expect(plain, `${item.slug}: no markup in plain text`).not.toMatch(/\$|\\[a-z]|\*\*/);
        }
        if (item.tier === "tier1_fast") expect(item.fast_check, `${item.slug} has a fast check`).toBeDefined();
        if (item.tier === "tier2_synthesis") expect(item.sample_solution, `${item.slug} has a sample solution`).toBeTruthy();
        if (item.fast_check) {
          expect(item.fast_check.options.length).toBe(2);
          expect(item.fast_check.correct_index).toBe(0);
        }
        expect(item.choice_distractors?.length, `${item.slug} has distractors`).toBe(2);
        for (const distractor of item.choice_distractors ?? []) {
          expect(distractor.reason, `${item.slug}: every distractor says why`).toBeTruthy();
        }
      }
    }
  });

  it("writes minus signs as − in every text a learner reads", () => {
    for (const item of items) {
      const texts = [
        item.question,
        item.concept,
        item.sample_solution,
        ...(item.question_segments ?? []).map((segment) => segment.text),
        ...(item.concept_segments ?? []).map((segment) => segment.text),
        ...(item.fast_check?.options ?? []).filter((option): option is string => typeof option === "string"),
        ...(item.choice_distractors ?? []).flatMap((distractor) => [distractor.text, distractor.reason]),
      ];
      for (const text of texts) {
        if (text) expect(text, item.slug).not.toMatch(/(^|[\s(|=])-(?=[\s\d(a-zα-ω])/);
      }
    }
  });

  describe("proposes to take over the four de-by Gymnasium 11 mathematics cells, without applying it", () => {
    interface MappingRow {
      de_by_cell: string;
      de_by_id: string;
      de_by_question: unknown;
      category: "A" | "B" | "C";
      academy_slug: string | null;
      action: string;
      reason: string;
    }
    const table = replacesJson as unknown as {
      status: string;
      approved: string | null;
      source: string;
      source_commit: string;
      sources: Array<{ file: string; tile_id: string; version: string; sha256: string }>;
      rows: MappingRow[];
    };
    type LegacyTile = { tile_id: string; version: string; atoms: Array<{ practice_items: Array<{ id: string; question?: string; question_segments?: unknown }> }> };
    // The byte-exact SHA-256 of each snapshot is checked by scripts/validate-migration.mjs in CI.
    const SNAPSHOTS: Record<string, LegacyTile> = {
      "tests/fixtures/de-by-gymnasium-11-mathematik-analytische-geometrie-ebenen-abstaende-kvt.json": legacyGeometrie as unknown as LegacyTile,
      "tests/fixtures/de-by-gymnasium-11-mathematik-integralrechnung-hauptsatz-flaechenberechnung-kvt.json": legacyIntegral as unknown as LegacyTile,
      "tests/fixtures/de-by-gymnasium-11-mathematik-kurvendiskussion-extremwertprobleme-wendepunkte-kvt.json": legacyKurven as unknown as LegacyTile,
      "tests/fixtures/de-by-gymnasium-11-mathematik-stochastik-bernoulli-binomialverteilung-kvt.json": legacyStochastik as unknown as LegacyTile,
    };
    const legacy = table.sources.map((entry) => ({ entry, tile: SNAPSHOTS[entry.file] }));

    it("is a proposal only: no approval, no replaces, no retired items", () => {
      expect(table.status).toBe("proposal-only");
      expect(table.approved).toBeNull();
      expect(table.source).not.toMatch(/Freigabe durch Thomas am|gebe ich frei/);
      expect(cell.retired_items ?? []).toEqual([]);
      for (const item of items) expect(item.replaces, item.slug).toBeUndefined();
    });

    it("keeps snapshots of all four old cells at the named commit", () => {
      expect(table.source_commit).toMatch(/^[0-9a-f]{40}$/);
      for (const { entry, tile } of legacy) {
        expect(tile, `${entry.file} is a known snapshot`).toBeDefined();
        expect(entry.sha256, entry.file).toMatch(/^[0-9a-f]{64}$/);
        expect(tile.tile_id).toBe(entry.tile_id);
        expect(tile.version).toBe(entry.version);
      }
      expect(legacy.map(({ tile }) => tile.tile_id).sort()).toEqual([
        "de-by:gymnasium-11-mathematik-analytische-geometrie-ebenen-abstaende",
        "de-by:gymnasium-11-mathematik-integralrechnung-hauptsatz-flaechenberechnung",
        "de-by:gymnasium-11-mathematik-kurvendiskussion-extremwertprobleme-wendepunkte",
        "de-by:gymnasium-11-mathematik-stochastik-bernoulli-binomialverteilung",
      ]);
    });

    it("lists every old item exactly once with its exact question: 1 A, 0 B, 15 C", () => {
      const oldItems = new Map(legacy.flatMap(({ tile }) => tile.atoms.flatMap((atom) => atom.practice_items.map((item) => [item.id, { tile: tile.tile_id, item }] as const))));
      expect(table.rows.map((row) => row.de_by_id).sort()).toEqual([...oldItems.keys()].sort());
      for (const row of table.rows) {
        const old = oldItems.get(row.de_by_id)!;
        expect(row.de_by_cell).toBe(old.tile);
        expect(row.de_by_question).toEqual(old.item.question_segments ?? old.item.question);
        expect(row.reason.length, `${row.de_by_id} says why`).toBeGreaterThan(40);
      }
      const counts = { A: 0, B: 0, C: 0 };
      for (const row of table.rows) counts[row.category] += 1;
      expect(counts).toEqual({ A: 1, B: 0, C: 15 });
    });

    it("names an existing successor for the A row, one history per card, and keeps every C card active", () => {
      const slugs = new Set(items.map((item) => item.slug));
      for (const row of table.rows) {
        if (row.category === "C") {
          expect(row.academy_slug).toBeNull();
          expect(row.action).toBe("keep-active");
        } else {
          expect(slugs.has(row.academy_slug ?? ""), `${row.de_by_id} → ${row.academy_slug}`).toBe(true);
          expect(row.action).toBe("propose-replace-after-approval");
        }
      }
      const successors = table.rows.filter((row) => row.academy_slug).map((row) => row.academy_slug);
      expect(new Set(successors).size).toBe(successors.length);
    });
  });
});
