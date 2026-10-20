import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clouds,
  element,
  hydrocarbon,
  MOLECULES,
  reaction,
  saltRatio,
  shells,
} from "../src/chemistry/model";
import {
  ALL_LESSONS,
  continuationLesson,
  findLessonById,
  lessonsForTrack,
  nextLesson,
  previousLesson,
  stageNumberForTrack,
  STAGES,
} from "../src/curriculum";
import { checkTask, parseNumber, wrongAnswerHint } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import { quizOrder } from "../src/exercises/quiz-order";
import { EXPERIMENTS, experimentWitness } from "../src/lab/definitions";
import {
  applyAction,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
  withChanges,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import {
  isLessonComplete,
  isStageComplete,
  loadLearnerProgress,
  overallStats,
  saveLearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import legacyAtombau from "./fixtures/de-by-realschule-9-chemie-atombau-pse-kvt.json";
import legacyBindung from "./fixtures/de-by-realschule-9-chemie-chemische-bindung-kvt.json";

function must<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) throw new Error("Required test fixture is missing");
  return value;
}

const LESSON_IDS = [
  "ch-sicher-arbeiten",
  "ch-stoffeigenschaften",
  "ch-teilchenmodell",
  "ch-trennverfahren",
  "ch-nachweise",
  "ch-teilchenverbaende",
  "ch-reaktionsgleichungen",
  "ch-energie-katalyse",
  "ch-stoffmenge",
  "ch-rutherford",
  "ch-atomteilchen",
  "ch-energiestufen",
  "ch-periodensystem",
  "ch-kugelwolken",
  "ch-ionen-salze",
  "ch-metallbindung",
  "ch-elektronenpaare",
  "ch-molekuelgestalt",
  "ch-polaritaet",
  "ch-zwischenmolekulare-kraefte",
  "ch-kohlenwasserstoffe",
  "ch-funktionelle-gruppen",
  "ch-organik-vertiefung",
  "ch-elektronenuebergang",
  "ch-oxidationszahlen",
  "ch-redoxgleichungen",
  "ch-salze-loesen",
  "ch-batterie-akku",
  "ch-elektrolyse",
  "ch-korrosion",
  "ch-brennstoffzelle",
  "ch-ph-indikator",
  "ch-protonenuebergang",
  "ch-saeurereste",
  "ch-oxide-wasser",
];

type Item = {
  id: string;
  slug: string;
  source_link: string;
  tier: string;
  question?: string;
  concept?: string;
  question_segments?: Array<{ type: string; text?: string; tex?: string; speech?: string }>;
  concept_segments?: Array<{ type: string; text?: string; tex?: string; speech?: string }>;
  choice_distractors?: Array<{ text: string; reason: string }>;
  fast_check?: { options: string[]; correct_index: number };
  replaces?: string[];
};
const items = cell.atoms.flatMap((atom) => atom.practice_items) as Item[];

describe("Chemie 9: curriculum and two paths", () => {
  it("pins all public lesson ids, with no duplicate or orphan lesson", () => {
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(35);
    for (const lesson of ALL_LESSONS) {
      expect(findLessonById(lesson.id)?.stage.id).toBe(lesson.stageId);
      expect(lesson.explanationHtml.length).toBeGreaterThan(250);
      expect(lesson.quiz.options[lesson.quiz.correctIndex]).toBeTruthy();
      expect(new Set(quizOrder(lesson))).toEqual(new Set([0, 1]));
    }
  });

  it("gives each track a complete, different path through its Lernbereiche", () => {
    expect(lessonsForTrack("I")).toHaveLength(22);
    expect(lessonsForTrack("II_III")).toHaveLength(22);
    for (const track of ["I", "II_III"] as const) {
      expect(new Set(lessonsForTrack(track).map((lesson) => lesson.bindings[track]))).toEqual(
        new Set(track === "I" ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6]),
      );
    }
    expect(lessonsForTrack("I").some((lesson) => lesson.id === "ch-rutherford")).toBe(false);
    expect(lessonsForTrack("II_III").some((lesson) => lesson.id === "ch-batterie-akku")).toBe(
      false,
    );
    expect(lessonsForTrack("II_III").some((lesson) => lesson.id === "ch-organik-vertiefung")).toBe(
      false,
    );
    expect(findLessonById("ch-polaritaet")?.lesson.bindings).toEqual({ I: 2, II_III: 6 });
    expect(findLessonById("ch-ionen-salze")?.lesson.bindings).toEqual({ I: 3, II_III: 3 });
  });

  it("keeps Continue, next and previous inside the selected track", () => {
    expect(nextLesson("ch-sicher-arbeiten", "I")?.id).toBe("ch-ionen-salze");
    expect(previousLesson("ch-ionen-salze", "I")?.id).toBe("ch-sicher-arbeiten");
    expect(nextLesson("ch-funktionelle-gruppen", "II_III")).toBeUndefined();
    expect(continuationLesson("ch-batterie-akku", "II_III").id).toBe("ch-sicher-arbeiten");
    expect(continuationLesson("ch-batterie-akku", "I").id).toBe("ch-batterie-akku");
    expect(nextLesson("does-not-exist", "I")).toBeUndefined();
    expect(previousLesson("does-not-exist", "II_III")).toBeUndefined();
    expect(stageNumberForTrack("bindungen", "I")).toBe(2);
    expect(stageNumberForTrack("bindungen", "II_III")).toBe(4);
    expect(stageNumberForTrack("atombau", "I")).toBeUndefined();
  });

  it("opens canonical card links, rejects invalid ids and reads the level", () => {
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash).lessonId).toBe(id);
    expect(parseTrainingDeepLink("#lesson=ch-rutherford&level=2")).toEqual({
      lessonId: "ch-rutherford",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=3")).toEqual({});
  });
});

describe("Chemie models: scientific edge cases", () => {
  it("distinguishes atomic number, isotope and charge", () => {
    expect(element(6).name).toBe("Kohlenstoff");
    const lab = must(findLessonById("ch-atomteilchen")).lesson.lab;
    expect(computeReadouts(lab, { p: 6, n: 8, e: 6 })).toMatchObject({
      element: "Kohlenstoff",
      massNumber: 14,
      charge: 0,
    });
    expect(computeReadouts(lab, { p: 11, n: 12, e: 10 }).charge).toBe(1);
    expect(computeReadouts(lab, { p: 17, n: 18, e: 18 }).charge).toBe(-1);
  });

  it("handles helium and the first twenty ground-state atoms without a universal 2-8-8 rule", () => {
    expect(element(2).group).toBe(8);
    expect(shells(2)).toEqual([2]);
    expect(shells(19)).toEqual([2, 8, 8, 1]);
    expect(shells(20)).toEqual([2, 8, 8, 2]);
    const lab = must(findLessonById("ch-energiestufen")).lesson.lab;
    expect(computeReadouts(lab, { z: 20, shell: 3 })).toMatchObject({ outer: 2, capacity: 18 });
    expect(clouds(6)).toEqual([2, 2, 1, 1]);
  });

  it("preserves both atom balances with limiting reactants and excess", () => {
    for (let h = 0; h <= 8; h++)
      for (let o = 0; o <= 4; o++) {
        const result = reaction(h, o);
        expect(2 * result.hydrogen + 2 * result.water).toBe(2 * h);
        expect(2 * result.oxygen + result.water).toBe(2 * o);
        expect(result.hydrogen).toBeGreaterThanOrEqual(0);
        expect(result.oxygen).toBeGreaterThanOrEqual(0);
      }
    expect(reaction(3, 1)).toEqual({ water: 2, hydrogen: 1, oxygen: 0 });
  });

  it("reduces salt formula ratios and balances formal charges", () => {
    expect(saltRatio(3, 2)).toEqual([2, 3]);
    expect(saltRatio(2, 2)).toEqual([1, 1]);
    for (const p of [1, 2, 3])
      for (const n of [1, 2, 3]) {
        const [c, a] = saltRatio(p, n);
        expect(c * p - a * n).toBe(0);
      }
  });

  it("treats multiple bonds as one domain and distinguishes polar bonds from a dipole", () => {
    expect(MOLECULES.find((m) => m.formula === "N₂")?.bonds).toBe(3);
    expect(MOLECULES.find((m) => m.formula === "CO₂")).toMatchObject({
      bonds: 4,
      domains: 2,
      shape: "linear",
    });
    const lab = must(findLessonById("ch-polaritaet")).lesson.lab;
    expect(Number(computeReadouts(lab, { difference: 1.2, angle: 180 }).dipole)).toBeCloseTo(0);
    expect(Number(computeReadouts(lab, { difference: 1.2, angle: 105 }).dipole)).toBeGreaterThan(1);
    expect(Number(computeReadouts(lab, { difference: 0, angle: 90 }).dipole)).toBe(0);
  });

  it("keeps catalyst energy balances and the signs of dissolution physically consistent", () => {
    const energy = must(findLessonById("ch-energie-katalyse")).lesson.lab;
    expect(computeReadouts(energy, { endo: 0, catalyst: 0 }).delta).toBe(-40);
    expect(computeReadouts(energy, { endo: 0, catalyst: 1 })).toMatchObject({
      delta: -40,
      barrier: 55,
    });
    const solution = must(findLessonById("ch-salze-loesen")).lesson.lab;
    expect(computeReadouts(solution, { lattice: 600, hydration: 500 }).delta).toBe(100);
    expect(computeReadouts(solution, { lattice: 600, hydration: 700 }).delta).toBe(-100);
  });

  it("uses electrode names independently of sign and includes peroxide and hydride exceptions", () => {
    const electro = must(findLessonById("ch-elektrolyse")).lesson.lab;
    expect(computeReadouts(electro, { mode: 1, electrode: 0 }).electrode).toBe("Anode, negativ");
    expect(computeReadouts(electro, { mode: 2, electrode: 0 }).electrode).toBe("Anode, positiv");
    expect(computeReadouts(electro, { mode: 2, electrode: 1 }).electrode).toBe("Kathode, negativ");
    const oxidation = must(findLessonById("ch-oxidationszahlen")).lesson.lab;
    expect(computeReadouts(oxidation, { compound: 1, number: -1 }).sum).toBe(0);
    expect(computeReadouts(oxidation, { compound: 1, number: -2 }).sum).not.toBe(0);
    expect(computeReadouts(oxidation, { compound: 2, number: -1 }).sum).toBe(0);
  });

  it("limits hydrocarbon formulas to the stated open-chain model", () => {
    expect(hydrocarbon(2, 1).formula).toBe("C₂H₆");
    expect(hydrocarbon(2, 2).formula).toBe("C₂H₄");
    expect(hydrocarbon(2, 3).formula).toBe("C₂H₂");
    const base = must(findLessonById("ch-kohlenwasserstoffe")).lesson.lab.params.find(
      (param) => param.key === "bond",
    );
    expect(base?.type === "choice" ? base.options.map((option) => option.value) : []).toEqual([
      0, 1,
    ]);
  });
});

describe("Every lab can be completed by interacting with the model", () => {
  for (const lesson of ALL_LESSONS)
    it(lesson.id, () => {
      const lab = lesson.lab;
      const grid = enumerateLabGrid(lab, 21);
      for (const goal of lab.goals) {
        const witness = EXPERIMENTS[lab.kind]
          ? experimentWitness(lab.kind, Number(goal.id.slice(5)))
          : grid.find((values) => goal.check(values, computeReadouts(lab, values)));
        expect(witness, `${lesson.id}: ${goal.text}`).toBeDefined();
        const reached = must(witness);
        expect(goal.check(reached, computeReadouts(lab, reached))).toBe(true);
      }
      for (const values of enumerateLabGrid(lab, 3)) {
        const readouts = computeReadouts(lab, values);
        for (const value of Object.values(readouts))
          if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
        const svg = labView(lab.kind).render(values, readouts);
        expect(svg).toContain('role="img"');
        expect(svg).not.toMatch(/NaN|Infinity|undefined/);
      }
    });

  it("requires an actual experiment action and invalidates the old observation when the setup changes", () => {
    const lab = must(findLessonById("ch-trennverfahren")).lesson.lab;
    const prediction = withChanges(lab, defaultLabValues(lab), { prediction: 0 });
    expect(reachedGoals(lab, prediction)).toHaveLength(0);
    const observed = applyAction(lab, prediction, "run");
    expect(reachedGoals(lab, observed).map((goal) => goal.id)).toEqual(["case-0"]);
    const changed = withChanges(lab, observed, { case: 1 });
    expect(changed.observed).toBe(0);
    expect(reachedGoals(lab, changed)).toHaveLength(0);
    expect(applyAction(lab, defaultLabValues(lab), "run").observed).toBe(0);
  });
});

describe("Every task generator over varied seeds and both levels", () => {
  for (const lesson of ALL_LESSONS)
    it(lesson.id, () => {
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const)
          for (let seed = 0; seed < 40; seed++) {
            const task = generator.make(
              createRng(seedFrom(`${seed}:${level}:${lesson.id}`)),
              level,
            );
            expect(task.fields.length).toBeGreaterThan(0);
            expect(task.steps.length).toBeGreaterThanOrEqual(3);
            const answers = task.fields.map((field) =>
              field.kind === "choice"
                ? String(field.correctIndex)
                : field.answer.toFixed(field.digits).replace(".", ","),
            );
            expect(
              checkTask(task, answers).status,
              `${lesson.id} ${generator.id} ${seed} ${level}`,
            ).toBe("correct");
            expect(
              checkTask(
                task,
                answers.map(() => ""),
              ).status,
            ).toBe("invalid");
            for (const [index, field] of task.fields.entries()) {
              if (field.kind === "number") expect(Number.isFinite(field.answer)).toBe(true);
              const wrong = [...answers];
              wrong[index] =
                field.kind === "choice"
                  ? String((field.correctIndex + 1) % field.options.length)
                  : String(field.answer + Math.max(10, Math.abs(field.answer) * 2));
              expect(checkTask(task, wrong).status).toBe("wrong");
              expect(wrongAnswerHint(task, checkTask(task, wrong))).toBeTruthy();
            }
          }
    });

  it("accepts decimal commas and fractions, checks sign and exact integer counts", () => {
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("3/2")).toBe(1.5);
    const task = must(findLessonById("ch-reaktionsgleichungen")).lesson.exercises[0].make(
      createRng(1),
      1,
    );
    const answers = task.fields.map((field) =>
      field.kind === "number" ? String(field.answer) : "",
    );
    const inexact = [...answers];
    inexact[0] = String(Number(inexact[0]) + 0.1);
    expect(checkTask(task, inexact).status).toBe("wrong");
  });
});

describe("Progress: only the chosen path counts", () => {
  const memory = new Map<string, string>();
  beforeEach(() => {
    memory.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("persists the independent track and level with a light first run", () => {
    const progress = loadLearnerProgress();
    expect(progress.trackFilter).toBe("II_III");
    expect(progress.difficultyLevel).toBe(1);
    progress.trackFilter = "I";
    progress.difficultyLevel = 2;
    saveLearnerProgress(progress);
    expect(loadLearnerProgress()).toEqual(progress);
  });

  it("completes Zweig I without requiring the other track's basics", () => {
    const progress = loadLearnerProgress();
    for (const lesson of lessonsForTrack("I")) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: 3, 2: 0 };
    }
    expect(overallStats(progress, STAGES, "I")).toMatchObject({
      total: 22,
      completed: 22,
      percent: 100,
    });
    expect(overallStats(progress, STAGES, "II_III").percent).toBeLessThan(100);
    expect(isStageComplete(progress, STAGES[2], "I")).toBe(false);
    expect(isLessonComplete(progress, must(findLessonById("ch-rutherford")).lesson)).toBe(false);
  });

  it("needs the quick check, every lab goal and three guided tasks", () => {
    const progress = loadLearnerProgress();
    const lesson = ALL_LESSONS[0];
    progress.quizDone.push(lesson.id);
    progress.solved[lesson.id] = { 1: 3, 2: 10 };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    expect(isLessonComplete(progress, lesson)).toBe(true);
  });

  it("survives blocked or corrupt storage", () => {
    memory.set("chemie_rs9_academy_progress_v1", "not json");
    expect(loadLearnerProgress().activeLessonId).toBe("ch-sicher-arbeiten");
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    });
    const progress = loadLearnerProgress();
    expect(() => saveLearnerProgress(progress)).not.toThrow();
  });

  it("does not turn invalid stored counters into earned progress", () => {
    memory.set(
      "chemie_rs9_academy_progress_v1",
      JSON.stringify({
        solved: { "ch-sicher-arbeiten": { 1: -2, 2: 0.5 } },
        attempts: { "ch-sicher-arbeiten": -4 },
      }),
    );
    const progress = loadLearnerProgress();
    expect(progress.solved["ch-sicher-arbeiten"]).toEqual({ 1: 0, 2: 0 });
    expect(progress.attempts["ch-sicher-arbeiten"]).toBe(0);
  });
});

describe("The cell is the only card source, and every card leads to a taught lesson", () => {
  it("has valid distinct ULIDs, a stable cell id and 77 cards for 35 lessons", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(35);
    expect(items).toHaveLength(77);
    const ids = [...cell.atoms.map((atom) => atom.id), ...items.map((item) => item.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(new Set(items.map((item) => item.slug)).size).toBe(items.length);
  });

  it("matches the explicit Lehrplan bindings and lesson links", () => {
    for (const atom of cell.atoms) {
      const lessonId = must(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId);
      const lesson = must(findLessonById(lessonId)).lesson;
      expect(atom.title).toBe(lesson.title);
      const bindings = atom.curricula.filter(
        (binding) => binding.provider === "lehrplanplus-bayern",
      );
      expect(bindings.map((binding) => ({ track: binding.track, lb: binding.topic_code }))).toEqual(
        Object.entries(lesson.bindings).map(([track, lb]) => ({ track, lb: `lb${lb}` })),
      );
      for (const item of atom.practice_items) expect(item.source_link).toBe(lessonLink(lesson.id));
    }
  });

  it("keeps structured formulas spoken and offers curated choices on every new atomic card", () => {
    for (const item of items) {
      expect(Boolean(item.question || item.question_segments?.length)).toBe(true);
      expect(Boolean(item.concept || item.concept_segments?.length)).toBe(true);
      for (const segment of [...(item.question_segments ?? []), ...(item.concept_segments ?? [])]) {
        if (segment.type === "math") expect(segment.speech).toBeTruthy();
        else expect(segment.text).not.toMatch(/\\|\$|<[a-z]/i);
      }
      if (item.tier === "tier1_fast") {
        expect(item.fast_check?.options).toHaveLength(2);
        expect(item.fast_check?.correct_index).toBe(0);
        expect(item.choice_distractors).toHaveLength(2);
        for (const distractor of item.choice_distractors ?? [])
          expect(distractor.reason).toBeTruthy();
      }
    }
  });
});

describe("Explicit history mapping, never similarity matching or partial mastery", () => {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const originals: Pick<Item, "id" | "question" | "concept">[] = [
    legacyAtombau,
    legacyBindung,
  ].flatMap((tile) => tile.atoms.flatMap((atom) => atom.practice_items));

  it("accounts for all 16 original items exactly once", () => {
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(16);
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
      originals.map((item) => item.id).sort(),
    );
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(7);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(5);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(4);
  });

  it("declares only the twelve deliberate one-to-one replacements", () => {
    const declared = items.flatMap((item) => item.replaces ?? []);
    expect(new Set(declared).size).toBe(12);
    expect(declared.sort()).toEqual(
      mapping.rows
        .filter((row) => row.category !== "C")
        .map((row) => row.de_by_id)
        .sort(),
    );
    for (const item of items) expect(item.replaces?.length ?? 0).toBeLessThanOrEqual(1);
    for (const row of mapping.rows) {
      if (row.category === "C") {
        expect(declared).not.toContain(row.de_by_id);
        expect(row.note).toBeTruthy();
        for (const slug of row.related_new_slugs ?? []) expect(bySlug.has(slug)).toBe(true);
      } else expect(bySlug.get(row.academy_slug ?? "")?.replaces).toEqual([row.de_by_id]);
    }
  });

  it("preserves the entire demand of each old synthesis question", () => {
    for (const row of mapping.rows.filter((row) => row.category === "B")) {
      const old = must(originals.find((item) => item.id === row.de_by_id));
      const successor = must(bySlug.get(row.academy_slug ?? ""));
      expect(successor.question).toBe(old.question);
      expect(successor.concept).toBe(old.concept);
      expect(successor.tier).toBe("tier2_synthesis");
    }
  });
});
