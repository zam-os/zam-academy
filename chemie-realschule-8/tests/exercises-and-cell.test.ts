import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum/index";
import { checkTask, parseNumber, wrongAnswerHint } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  isLessonComplete,
  isStageComplete,
  loadLearnerProgress,
  overallStats,
  saveLearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";
import legacyReaktion from "./fixtures/de-by-realschule-8-chemie-chemische-reaktion-oxidation-kvt.json";
import legacyStoffe from "./fixtures/de-by-realschule-8-chemie-stoffe-stoffgemische-trennung-kvt.json";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

type Segment = { type: "text"; text: string } | { type: "math"; tex: string; speech?: string };
type CellItem = {
  id: string;
  slug: string;
  tier: string;
  question?: string;
  question_segments?: Segment[];
  concept?: string;
  concept_segments?: Segment[];
  sample_solution?: string;
  source_link: string;
  replaces?: string[];
  fast_check?: { options: string[]; correct_index: number };
  choice_distractors?: Array<{ text: string; reason: string }>;
};

const atoms = cell.atoms;
const items: CellItem[] = atoms.flatMap((atom) => atom.practice_items as unknown as CellItem[]);

describe("All 64 exercise generators across varied seeds and both levels", () => {
  for (const lesson of ALL_LESSONS) {
    it(lesson.id, () => {
      for (const generator of lesson.exercises) {
        const prompts = { 1: new Set<string>(), 2: new Set<string>() };
        for (const level of [1, 2] as const) {
          for (let seed = 0; seed < 40; seed++) {
            const task = generator.make(
              createRng(seedFrom(`${seed}:${level}:${lesson.id}`)),
              level,
            );
            prompts[level].add(task.prompt);
            for (const text of [task.prompt, ...task.given, ...task.steps]) {
              expect(text, `${lesson.id} ${generator.id}: real minus sign`).not.toMatch(
                /(^|[\s(:=>])-\d/,
              );
            }
            expect(task.fields.length).toBeGreaterThan(0);
            expect(task.steps.length).toBeGreaterThanOrEqual(3);
            expect(task.prompt).not.toMatch(/\bNaN\b|undefined|Infinity/);
            const answers = task.fields.map((field) =>
              field.kind === "choice"
                ? String(field.correctIndex)
                : field.answer.toFixed(field.digits).replace(".", ","),
            );
            expect(
              checkTask(task, answers).status,
              `${lesson.id} ${generator.id} seed=${seed} level=${level}`,
            ).toBe("correct");
            const withUnits = task.fields.map((field, index) =>
              field.kind === "number" && field.unit
                ? `${answers[index]} ${field.unit}`
                : answers[index],
            );
            expect(checkTask(task, withUnits).status).toBe("correct");
            expect(
              checkTask(
                task,
                answers.map(() => ""),
              ).status,
            ).toBe("invalid");
            for (const [index, field] of task.fields.entries()) {
              if (field.kind === "choice") {
                expect(field.options.length).toBeGreaterThanOrEqual(2);
                expect(new Set(field.options).size, `${lesson.id} ${generator.id}`).toBe(
                  field.options.length,
                );
              } else {
                expect(Number.isFinite(field.answer)).toBe(true);
              }
              const wrong = [...answers];
              wrong[index] =
                field.kind === "choice"
                  ? String((field.correctIndex + 1) % field.options.length)
                  : String(field.answer + Math.max(10, Math.abs(field.answer) * 2));
              expect(checkTask(task, wrong).status).toBe("wrong");
              expect(wrongAnswerHint(task, checkTask(task, wrong))).toBeTruthy();
              for (const slip of field.kind === "number" ? (field.slips ?? []) : []) {
                const typed = [...answers];
                typed[index] = String(slip.value).replace(".", ",");
                const result = checkTask(task, typed);
                expect(result.status, `${lesson.id} ${generator.id}: slip ${slip.value}`).toBe(
                  "wrong",
                );
                expect(wrongAnswerHint(task, result)).toBe(slip.hint);
              }
            }
          }
        }
        const overlap = [...prompts[2]].filter((p) => [...prompts[1]].includes(p));
        expect(overlap, `${lesson.id} ${generator.id}: distinct L1 vs L2`).toHaveLength(0);
      }
    });
  }

  it("provides targeted slip hints on calculation lessons and parses German numbers", () => {
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("−196 °C", "°C")).toBe(-196);
    const withSlips = ALL_LESSONS.filter((lesson) =>
      lesson.exercises.some((generator) =>
        [1, 2].some((level) =>
          generator
            .make(createRng(seedFrom(`slips:${lesson.id}:${level}`)), level as 1 | 2)
            .fields.some((field) => field.kind === "number" && field.slips?.length),
        ),
      ),
    );
    expect(withSlips.map((lesson) => lesson.id)).toEqual(
      expect.arrayContaining([
        "ch-sinne-kenngroessen",
        "ch-teilchenmasse-molare-masse",
        "ch-stoffmenge-molvolumen",
        "ch-stoffumsatz-rechnen",
        "ch-isotopie-molare-masse",
      ]),
    );
  });
});

describe("Learner progress persistence", () => {
  const memory = new Map<string, string>();
  beforeEach(() => {
    memory.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("persists progress, requires quick check + all lab goals + 3 Level-1 tasks, and survives corrupt storage", () => {
    const progress = loadLearnerProgress();
    expect(progress.trackFilter).toBe("I");
    expect(progress.difficultyLevel).toBe(1);
    for (const lesson of lessonsForTrack("I")) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((g) => g.id);
      progress.solved[lesson.id] = { 1: 3, 2: 0 };
    }
    saveLearnerProgress(progress);
    expect(loadLearnerProgress()).toEqual(progress);
    expect(overallStats(progress, STAGES, "I")).toMatchObject({
      total: 32,
      completed: 32,
      percent: 100,
    });
    expect(isStageComplete(progress, STAGES[0], "I")).toBe(true);
    expect(isLessonComplete(progress, ALL_LESSONS[0])).toBe(true);

    memory.set("chemie_rs8_academy_progress_v1", "{corrupt");
    expect(loadLearnerProgress().activeLessonId).toBe("ch-gefahrstoffe-sicherheit");
  });
});

describe("ZAM cell and unapproved migration proposal", () => {
  it("contains 32 atoms (1:1 with lessons) and 66 atomic cards with valid ULIDs and zero replaces", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect("retired_items" in cell).toBe(false);
    expect(atoms).toHaveLength(32);
    expect(items).toHaveLength(66);
    const ids = [...atoms.map((a) => a.id), ...items.map((i) => i.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(new Set(items.map((i) => i.slug)).size).toBe(items.length);
    expect(new Set(atoms.map((a) => a.source_link))).toEqual(
      new Set(LESSON_IDS.map((id) => lessonLink(id))),
    );
    for (const atom of atoms) {
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
      const lessonId = must(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId);
      const lesson = must(findLessonById(lessonId)?.lesson);
      expect(atom.title).toBe(lesson.title);
      const lpp = must(atom.curricula.find((c) => c.provider === "lehrplanplus-bayern"));
      expect(lpp).toMatchObject({ grade: 8, track: "I", topic_code: `lb${lesson.bindings.I}` });
      for (const item of atom.practice_items as unknown as CellItem[]) {
        expect(item.source_link).toBe(lessonLink(lesson.id));
        expect(item.replaces).toBeUndefined();
      }
    }
  });

  it("enforces segment XOR plain-text invariant, speech on math segments and curated distractors", () => {
    for (const item of items) {
      for (const field of ["question", "concept"] as const) {
        const plain = item[field];
        const segs = item[`${field}_segments`];
        expect(plain === undefined, `${item.slug}.${field}: plain XOR segments`).toBe(
          segs !== undefined,
        );
      }
      for (const seg of [...(item.question_segments ?? []), ...(item.concept_segments ?? [])]) {
        if (seg.type === "math") expect(seg.speech).toBeTruthy();
        else expect(seg.text).not.toMatch(/\\|\$|<[a-z]/i);
      }
      if (item.tier === "tier1_fast") {
        expect(item.fast_check?.options).toHaveLength(2);
        expect(item.fast_check?.correct_index).toBe(0);
        expect(item.choice_distractors).toHaveLength(2);
        expect(item.fast_check?.options[1]).toBe(item.choice_distractors?.[0].text);
      } else {
        expect(item.tier).toBe("tier2_synthesis");
        expect(item.sample_solution).toBeTruthy();
      }
    }
  });

  it("keeps replaces-de-by.json strictly unapproved while accounting for all 16 legacy cards", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    const originals = [legacyStoffe, legacyReaktion].flatMap((tile) =>
      tile.atoms.flatMap((atom) => atom.practice_items),
    );
    expect(mapping.rows).toHaveLength(16);
    expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(
      originals.map((item) => item.id).sort(),
    );
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(8);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(8);
    const bySlug = new Map(items.map((i) => [i.slug, i]));
    for (const row of mapping.rows) {
      expect(row.action).toBe("keep-active");
      expect(row.reason.length).toBeGreaterThan(20);
      if (row.category === "A") expect(bySlug.has(must(row.academy_slug))).toBe(true);
      else expect(row.academy_slug).toBeNull();
    }
  });
});
