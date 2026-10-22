import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import coverage from "../coverage.json";
import replacesJson from "../replaces-de-by.json";
import legacyVierecke from "./fixtures/de-by-realschule-8-mathematik-ebene-geometrie-vierecke-kvt.json";
import legacyFunktionen from "./fixtures/de-by-realschule-8-mathematik-lineare-funktionen-kvt.json";
import legacyTerme from "./fixtures/de-by-realschule-8-mathematik-terme-gleichungen-kvt.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import { checkTask, parseNumber, parseNumberCandidates, wrongAnswerHint } from "../src/exercises/checker";
import { factorForm, linear, quadratic, vertexForm } from "../src/exercises/format";
import { quizOrder } from "../src/exercises/quiz-order";
import type { ExerciseTask, NumberField, Track } from "../src/model/types";
import {
  DEFAULT_LESSON_ID,
  isLessonComplete,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  overallStats,
  relevantLessons,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_ACADEMY_APP_URL } from "../src/zam/zam-link";
import { EXPECTED_VIDEOS, LERNBEREICH, LESSON_IDS, ONLY_I, ONLY_II_III } from "./curriculum-map";

describe("Lernpfad", () => {
  it("has seven stages in LehrplanPLUS order and lessons with stable ids", () => {
    expect(STAGES.map((stage) => stage.stageNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length);
    expect(DEFAULT_LESSON_ID).toBe(LESSON_IDS[0]);
    // Each stage keeps its own accent colour (AGENTS.md, section 3).
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(STAGES.length);
  });

  it("gives each Zweig exactly its lessons, as the two Fachlehrpläne do", () => {
    const trackI = lessonsForTrack("I").map((lesson) => lesson.id);
    const trackII = lessonsForTrack("II_III").map((lesson) => lesson.id);
    for (const id of ONLY_I) {
      expect(trackI, id).toContain(id);
      expect(trackII, id).not.toContain(id);
    }
    for (const id of ONLY_II_III) {
      expect(trackII, id).toContain(id);
      expect(trackI, id).not.toContain(id);
    }
    for (const lesson of ALL_LESSONS) {
      if (ONLY_I.includes(lesson.id) || ONLY_II_III.includes(lesson.id)) continue;
      expect([...lesson.tracks].sort(), `${lesson.id} serves both Zweige`).toEqual(["I", "II_III"]);
    }
    expect(trackI).toHaveLength(36);
    expect(trackII).toHaveLength(28);
  });

  it("maps every Kompetenzerwartung of both Zweige to lessons, and every lesson to a competence of each of its Zweige", () => {
    const rows = coverage.rows as Array<{ track: Track; lb: number; competence: string; lessons: string[]; evidence: string }>;
    expect(rows.filter((row) => row.track === "I")).toHaveLength(23);
    expect(rows.filter((row) => row.track === "II_III")).toHaveLength(19);
    for (const row of rows) {
      expect(row.lessons.length, row.competence).toBeGreaterThan(0);
      expect(row.evidence.length, row.competence).toBeGreaterThan(20);
      for (const id of row.lessons) {
        const lesson = findLessonById(id)?.lesson;
        expect(lesson, `${id} in coverage.json`).toBeDefined();
        expect(lesson!.tracks, `${id} serves Zweig ${row.track}`).toContain(row.track);
        expect(LERNBEREICH[id.slice(0, 2)][row.track], `${id} in LB ${row.lb} (${row.track})`).toBe(row.lb);
      }
    }
    for (const lesson of ALL_LESSONS) {
      for (const track of lesson.tracks) {
        expect(rows.some((row) => row.track === track && row.lessons.includes(lesson.id)), `${lesson.id} covers a competence of Zweig ${track}`).toBe(true);
      }
    }
    expect(coverage.optional_lessons).toEqual([]);
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

  it("links only verified teacher videos, each pinned with its author and watch URL", () => {
    // Videos are added in a separate step (AGENTS.md, section 4): a lesson
    // gets one only after its YouTube oEmbed title and channel were checked.
    for (const id of Object.keys(EXPECTED_VIDEOS)) expect(LESSON_IDS, `pinned video for unknown lesson ${id}`).toContain(id);
    for (const lesson of ALL_LESSONS) {
      const expected = EXPECTED_VIDEOS[lesson.id];
      if (!expected) {
        expect(lesson.teacherVideo, `${lesson.id} links a video that is not pinned`).toBeUndefined();
        continue;
      }
      expect(lesson.teacherVideo?.author).toBe(expected.author);
      expect(lesson.teacherVideo?.title.length).toBeGreaterThan(5);
      expect(lesson.teacherVideo?.url).toBe(`https://www.youtube.com/watch?v=${expected.id}`);
    }
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
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1/0")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("wants exact answers exact and accepts rounding for the others", () => {
    expect(checkTask(task(field(3, 0)), ["3"]).status).toBe("correct");
    expect(checkTask(task(field(3, 0)), ["3,4"]).status).toBe("wrong");
    expect(checkTask(task(field(1 / 3, 2)), ["1/3"]).status).toBe("correct");
    expect(checkTask(task(field(1 / 3, 2)), ["0,33"]).status).toBe("correct");
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
    const slip = task({ ...field(5, 2), slips: [{ value: 25, hint: "Das ist das Quadrat, nicht die Seite." }] });
    expect(wrongAnswerHint(slip, checkTask(slip, ["25"]))).toContain("Quadrat");
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
    trackFilter: "alle",
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

  it("counts only the lessons of the chosen Zweig: seven stages for Zweig I, six for Zweig II/III", () => {
    const progress = blank();
    const byId = (id: string) => STAGES.find((stage) => stage.id === id)!;
    expect(relevantLessons(byId("stage-2-drehung"), "II_III")).toHaveLength(0);
    expect(overallStats(progress, STAGES, "II_III").totalStages).toBe(6);
    expect(overallStats(progress, STAGES, "I").totalStages).toBe(7);
    expect(overallStats(progress, STAGES, "alle").totalStages).toBe(7);
    expect(overallStats(progress, STAGES, "alle").total).toBe(LESSON_IDS.length);
    const vierecke = byId("stage-1-dreiecke-vierecke");
    expect(relevantLessons(vierecke, "I")).toHaveLength(3);
    for (const lesson of relevantLessons(vierecke, "I")) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    }
    expect(isStageComplete(progress, vierecke, "I")).toBe(true);
    expect(isStageComplete(progress, vierecke, "II_III")).toBe(false);
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
    expect(parseTrainingDeepLink("#lesson=tg-3-binomische-formeln&level=2")).toEqual({ lessonId: "tg-3-binomische-formeln", level: 2 });
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
    expect(cell.tile_id).toBe("zam-academy:mathematik-realschule-8");
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
      expect(atom.slug).toBe(`m8-${lessonId}`);
      const academy = atom.curricula?.find((binding) => binding.provider === "zam-academy");
      expect(academy?.topic_code, `${atom.slug} is bound to its stage`).toBe(stage.id);
      const lehrplan = (atom.curricula ?? []).filter((binding) => binding.provider === "lehrplanplus-bayern");
      for (const binding of lehrplan) {
        expect(binding.school_type).toBe("realschule");
        expect(binding.grade).toBe(8);
        expect(binding.subject).toBe("mathematik");
        expect(binding.topic_code, `${atom.slug} in Zweig ${binding.track}`).toBe(`lb${LERNBEREICH[lessonId.slice(0, 2)][binding.track as Track]}`);
      }
      expect(lehrplan.map((binding) => binding.track).sort(), `${atom.slug} carries the lesson's Zweige`).toEqual([...lesson.tracks].sort());
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

  it("has well-formed cards: unique ids and slugs, valid fast checks, formulas with speech, two distractors each", () => {
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
        expect(item.slug.startsWith("m8-"), item.slug).toBe(true);
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

  it("writes minus signs as − and works over ℚ in every text a learner reads", () => {
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
        if (!text) continue;
        expect(text, item.slug).not.toMatch(/(^|[\s(|=])-(?=[\s\d(a-zα-ω])/);
        expect(text, `${item.slug}: ℝ belongs to grade 9`).not.toContain("ℝ");
      }
    }
  });

  describe("keeps the old de-by Realschule 8 mathematics cells as a proposal", () => {
    interface MappingRow {
      de_by_cell: string;
      de_by_id: string;
      de_by_question: string;
      category: "A" | "B" | "C";
      academy_slug: string | null;
      reason: string;
    }
    const table = replacesJson as unknown as {
      approved: string | null;
      status: string;
      source: string | null;
      sources: Array<{ file: string; tile_id: string; version: string; sha256: string }>;
      rows: MappingRow[];
    };
    const bySlug = new Map(items.map((item) => [item.slug, item]));
    type LegacyTile = { tile_id: string; version: string; atoms: Array<{ practice_items: Array<{ id: string; question?: string }> }> };
    // The byte-exact SHA-256 of each snapshot is checked by scripts/validate-migration.mjs in CI.
    const SNAPSHOTS: Record<string, LegacyTile> = {
      "tests/fixtures/de-by-realschule-8-mathematik-ebene-geometrie-vierecke-kvt.json": legacyVierecke as unknown as LegacyTile,
      "tests/fixtures/de-by-realschule-8-mathematik-lineare-funktionen-kvt.json": legacyFunktionen as unknown as LegacyTile,
      "tests/fixtures/de-by-realschule-8-mathematik-terme-gleichungen-kvt.json": legacyTerme as unknown as LegacyTile,
    };
    const legacy = table.sources.map((source) => ({ source, tile: SNAPSHOTS[source.file] }));

    it("awaits Thomas's approval: no date, no quoted approval, no replaces or retirements in the cell", () => {
      expect(table.approved).toBeNull();
      expect(table.source).toBeNull();
      expect(table.status).toBe("proposal-only");
      for (const item of items) expect(item.replaces ?? [], item.slug).toEqual([]);
      expect(cell.retired_items ?? []).toEqual([]);
    });

    it("keeps snapshots of all three old cells", () => {
      for (const { source, tile } of legacy) expect(tile, `${source.file} is a known snapshot`).toBeDefined();
      expect(new Set(legacy.map(({ tile }) => tile.tile_id))).toEqual(
        new Set([
          "de-by:realschule-8-mathematik-ebene-geometrie-vierecke",
          "de-by:realschule-8-mathematik-lineare-funktionen",
          "de-by:realschule-8-mathematik-terme-gleichungen",
        ]),
      );
      for (const { source, tile } of legacy) {
        expect(source.sha256, source.file).toMatch(/^[0-9a-f]{64}$/);
        expect(tile.tile_id).toBe(source.tile_id);
        expect(tile.version).toBe(source.version);
      }
    });

    it("lists every de-by item exactly once with its old question: 9 A, 8 B, 7 C", () => {
      const oldItems = new Map(legacy.flatMap(({ tile }) => tile.atoms.flatMap((atom) => atom.practice_items.map((item) => [item.id, { tile: tile.tile_id, item }] as const))));
      expect(table.rows.map((row) => row.de_by_id).sort()).toEqual([...oldItems.keys()].sort());
      for (const row of table.rows) {
        const old = oldItems.get(row.de_by_id)!;
        expect(row.de_by_cell).toBe(old.tile);
        expect(row.de_by_question).toBe(old.item.question);
        expect(row.reason.length, `${row.de_by_id} says why`).toBeGreaterThan(40);
      }
      const counts = { A: 0, B: 0, C: 0 };
      for (const row of table.rows) counts[row.category] += 1;
      expect(counts).toEqual({ A: 9, B: 8, C: 7 });
    });

    it("names one existing successor for every A and B row, none for C, never one card for two rows", () => {
      const named = table.rows.filter((row) => row.category !== "C").map((row) => row.academy_slug);
      expect(new Set(named).size).toBe(named.length);
      for (const row of table.rows) {
        if (row.category === "C") {
          expect(row.academy_slug, row.de_by_id).toBeNull();
          continue;
        }
        expect(bySlug.get(row.academy_slug ?? ""), `${row.de_by_id} → ${row.academy_slug}`).toBeDefined();
      }
    });

    it("keeps a B row's whole old prompt on its successor", () => {
      const oldQuestion = new Map(legacy.flatMap(({ tile }) => tile.atoms.flatMap((atom) => atom.practice_items.map((item) => [item.id, item.question ?? ""] as const))));
      const plain = (item: CellItem) => item.question ?? (item.question_segments ?? []).map((segment) => segment.text ?? segment.tex ?? "").join("");
      const normalise = (text: string) => text.replace(/−/g, "-").replace(/\s+/g, " ").trim();
      for (const row of table.rows.filter((entry) => entry.category === "B")) {
        const item = bySlug.get(row.academy_slug ?? "")!;
        expect(item.tier, row.de_by_id).toBe("tier2_synthesis");
        expect(item.sample_solution, row.de_by_id).toBeTruthy();
        expect(normalise(plain(item)).length, row.de_by_id).toBeGreaterThan(0.8 * normalise(oldQuestion.get(row.de_by_id)!).length);
      }
    });
  });
});
