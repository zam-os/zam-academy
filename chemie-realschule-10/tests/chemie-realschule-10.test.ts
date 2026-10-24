import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ANIONS,
  CATIONS,
  carbonOxidation,
  FATTY_ACIDS,
  fatFormula,
  fatState,
  functionalCarbon,
  oxidationStepName,
  photosynthesis,
  saltFormula,
  saltName,
  saltRatio,
  titrationPh,
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
import {
  acidReaction,
  EXPERIMENTS,
  experimentWitness,
  OX_MOLECULES,
  plasticBehaviour,
  redoxHalves,
  REDOX_REACTIONS,
  siliconeType,
} from "../src/lab/definitions";
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
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import legacyOrganik from "./fixtures/de-by-realschule-10-chemie-organik-kohlenwasserstoffe-kvt.json";
import legacySaeuren from "./fixtures/de-by-realschule-10-chemie-saeuren-basen-neutralisation-kvt.json";

function must<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) throw new Error("Required test fixture is missing");
  return value;
}

const LESSON_IDS = [
  "ch-gefahrstoffe",
  "ch-versuche-planen",
  "ch-ionenbildung",
  "ch-redox-teilgleichungen",
  "ch-salzformeln",
  "ch-gitterenergie",
  "ch-hydratation",
  "ch-saure-alkalische-loesungen",
  "ch-broensted",
  "ch-protolyse-saeurereste",
  "ch-ph-oxonium",
  "ch-neutralisation",
  "ch-titration",
  "ch-carbonate-metalle",
  "ch-kohlenstoff-nachweis",
  "ch-fotosynthese",
  "ch-energiegehalt",
  "ch-rohstoffe",
  "ch-addition",
  "ch-substitution",
  "ch-oxidationszahlen-organisch",
  "ch-alkanole-oxidation",
  "ch-alkanone",
  "ch-estersynthese",
  "ch-ester-eigenschaften",
  "ch-aminosaeuren",
  "ch-peptide",
  "ch-proteinstruktur",
  "ch-glucose-fructose",
  "ch-saccharose-polysaccharide",
  "ch-glycerin",
  "ch-fette",
  "ch-polymerisation",
  "ch-polykondensation",
  "ch-kunststoffklassen",
  "ch-silikone",
  "ch-kunststoffabfall",
  "ch-biokunststoff-oekobilanz",
  "ch-batterie-akku",
  "ch-brennstoffzelle",
];

type Segment = { type: string; text?: string; tex?: string; speech?: string };
type Item = {
  id: string;
  slug: string;
  source_link: string;
  tier: string;
  question?: string;
  concept?: string;
  sample_solution?: string;
  question_segments?: Segment[];
  concept_segments?: Segment[];
  choice_distractors?: Array<{ text: string; reason: string }>;
  fast_check?: { options: string[]; correct_index: number };
  replaces?: string[];
};
type Atom = {
  id: string;
  slug: string;
  title: string;
  source_link: string;
  curricula: Array<{ provider: string; track?: string; topic_code: string; grade?: number }>;
  prerequisites: Array<{ atom_id: string }>;
  practice_items: Item[];
};
const atoms = cell.atoms as Atom[];
const items = atoms.flatMap((atom) => atom.practice_items);

describe("Chemie 10: curriculum and two paths", () => {
  it("pins all public lesson ids, with no duplicate or orphan lesson", () => {
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(40);
    for (const lesson of ALL_LESSONS) {
      expect(findLessonById(lesson.id)?.stage.id).toBe(lesson.stageId);
      expect(lesson.explanationHtml.length).toBeGreaterThan(250);
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.quiz.options[lesson.quiz.correctIndex]).toBeTruthy();
      expect(new Set(quizOrder(lesson))).toEqual(new Set([0, 1]));
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.lab.goals.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.lehrplan).toMatch(/^C10 LB/);
    }
  });

  it("maps every Kompetenzerwartung of both Zweige to a lesson of that Zweig and LB, and every lesson to a competence", () => {
    const rows = coverage.rows as Array<{ track: "I" | "II_III"; lb: number; competence: string; lessons: string[] }>;
    expect(rows.filter((row) => row.track === "I")).toHaveLength(35);
    expect(rows.filter((row) => row.track === "II_III")).toHaveLength(50);
    expect(new Set(rows.map((row) => `${row.track}:${row.competence}`)).size).toBe(rows.length);
    for (const row of rows) {
      expect(row.lessons.length, row.competence).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = must(findLessonById(id)?.lesson);
        // LB 1 holds process competences that the subject LBs practise.
        if (row.lb === 1) expect(lesson.tracks, `${id} serves Zweig ${row.track}`).toContain(row.track);
        else expect(lesson.bindings[row.track], `${id} serves LB ${row.lb} (${row.track})`).toBe(row.lb);
      }
    }
    for (const lesson of ALL_LESSONS)
      for (const track of lesson.tracks)
        expect(
          rows.some((row) => row.track === track && row.lessons.includes(lesson.id)),
          `${lesson.id} covers a competence of Zweig ${track}`,
        ).toBe(true);
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("gives each stage its own accent colour", () => {
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(STAGES.length);
  });

  it("gives each track a complete, different path through its Lernbereiche", () => {
    expect(lessonsForTrack("I")).toHaveLength(30);
    expect(lessonsForTrack("II_III")).toHaveLength(34);
    for (const track of ["I", "II_III"] as const) {
      expect(new Set(lessonsForTrack(track).map((lesson) => lesson.bindings[track]))).toEqual(
        new Set([1, 2, 3, 4, 5, 6]),
      );
    }
    // Zweig I had electron transfer and the Redox applications in C9; Zweig II/III has no Silikone, Substitution or Titration.
    for (const id of ["ch-ionenbildung", "ch-broensted", "ch-batterie-akku"])
      expect(lessonsForTrack("I").some((lesson) => lesson.id === id)).toBe(false);
    for (const id of ["ch-silikone", "ch-substitution", "ch-titration", "ch-alkanone", "ch-ph-oxonium"])
      expect(lessonsForTrack("II_III").some((lesson) => lesson.id === id)).toBe(false);
    expect(findLessonById("ch-neutralisation")?.lesson.bindings).toEqual({ I: 2, II_III: 3 });
    expect(findLessonById("ch-addition")?.lesson.bindings).toEqual({ I: 4, II_III: 5 });
    expect(findLessonById("ch-fette")?.lesson.bindings).toEqual({ I: 5, II_III: 6 });
  });

  it("keeps Continue, next and previous inside the selected track", () => {
    expect(nextLesson("ch-versuche-planen", "I")?.id).toBe("ch-ph-oxonium");
    expect(nextLesson("ch-versuche-planen", "II_III")?.id).toBe("ch-ionenbildung");
    expect(previousLesson("ch-ph-oxonium", "I")?.id).toBe("ch-versuche-planen");
    expect(nextLesson("ch-biokunststoff-oekobilanz", "I")).toBeUndefined();
    expect(nextLesson("ch-kunststoffabfall", "II_III")?.id).toBe("ch-batterie-akku");
    expect(continuationLesson("ch-silikone", "II_III").id).toBe("ch-gefahrstoffe");
    expect(continuationLesson("ch-silikone", "I").id).toBe("ch-silikone");
    expect(nextLesson("does-not-exist", "I")).toBeUndefined();
    expect(previousLesson("does-not-exist", "II_III")).toBeUndefined();
    expect(stageNumberForTrack("protonen", "I")).toBe(2);
    expect(stageNumberForTrack("protonen", "II_III")).toBe(3);
    expect(stageNumberForTrack("elektronen", "I")).toBeUndefined();
    expect(stageNumberForTrack("redoxanwendungen", "I")).toBeUndefined();
  });

  it("opens canonical card links, rejects invalid ids and reads the level", () => {
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash).lessonId).toBe(id);
    expect(parseTrainingDeepLink("#lesson=ch-titration&level=2")).toEqual({
      lessonId: "ch-titration",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=3")).toEqual({});
  });
});

describe("Chemie models: scientific edge cases", () => {
  const ion = (core: string, charge: number) =>
    must([...CATIONS, ...ANIONS].find((i) => i.core === core && i.charge === charge));

  it("reduces salt ratios, brackets polyatomic ions and names variable-charge metals with their oxidation number", () => {
    expect(saltRatio(3, -2)).toEqual([2, 3]);
    expect(saltRatio(2, -2)).toEqual([1, 1]);
    expect(saltFormula(ion("Al", 3), ion("O", -2))).toBe("Al₂O₃");
    expect(saltFormula(ion("Ca", 2), ion("OH", -1))).toBe("Ca(OH)₂");
    expect(saltFormula(ion("Fe", 3), ion("SO₄", -2))).toBe("Fe₂(SO₄)₃");
    expect(saltFormula(ion("Ca", 2), ion("PO₄", -3))).toBe("Ca₃(PO₄)₂");
    expect(saltFormula(ion("Na", 1), ion("NO₃", -1))).toBe("NaNO₃");
    expect(saltName(ion("Fe", 3) as (typeof CATIONS)[number], ion("O", -2))).toBe("Eisen(III)-oxid");
    expect(saltName(CATIONS[0], ion("Cl", -1))).toBe("Natriumchlorid");
    expect(saltName(CATIONS[0], ion("Cl", -1), true)).toBe("Natrium(I)-chlorid");
    for (const c of CATIONS)
      for (const a of ANIONS) {
        const [nc, na] = saltRatio(c.charge, a.charge);
        expect(nc * c.charge + na * a.charge).toBe(0);
      }
  });

  it("balances every half-equation model only with equal electrons", () => {
    expect(redoxHalves(0, 2, 1)).toMatchObject({ given: 2, taken: 2 });
    expect(redoxHalves(2, 4, 3)).toMatchObject({ given: 12, taken: 12 });
    expect(redoxHalves(2, 4, 3).reduction).toBe("3 O₂ + 12 e⁻ → 6 O²⁻");
    expect(redoxHalves(1, 1, 1).given).not.toBe(redoxHalves(1, 1, 1).taken);
    expect(REDOX_REACTIONS).toHaveLength(4);
  });

  it("titrates a strong acid: neutral exactly at equivalence, monotonic, and a dilution never crosses pH 7", () => {
    expect(titrationPh(10, 0.12, 12, 0.1)).toBe(7);
    expect(titrationPh(10, 0.1, 0, 0.1)).toBeCloseTo(1);
    expect(titrationPh(10, 0.1, 5, 0.1)).toBeLessThan(7);
    expect(titrationPh(10, 0.1, 15, 0.1)).toBeGreaterThan(7);
    let last = 0;
    for (let v = 0; v <= 20; v += 0.5) {
      const ph = titrationPh(10, 0.1, v, 0.1);
      expect(ph).toBeGreaterThanOrEqual(last);
      last = ph;
    }
    const dilution = must(findLessonById("ch-ph-oxonium")).lesson.lab;
    for (let steps = 0; steps <= 4; steps++)
      expect(computeReadouts(dilution, { steps }).ph).toBeLessThan(7);
  });

  it("names salts and gases of acidic solutions with carbonates and metals; copper does not react", () => {
    expect(acidReaction(0, 0)).toMatchObject({ gas: "Kohlenstoffdioxid", salt: "Calciumchlorid" });
    expect(acidReaction(0, 0).equation).toBe("CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂");
    expect(acidReaction(2, 0).equation).toBe("CaCO₃ + 2 CH₃COOH → Ca(CH₃COO)₂ + H₂O + CO₂");
    expect(acidReaction(1, 1).equation).toBe("Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂");
    expect(acidReaction(2, 1).equation).toBe("Na₂CO₃ + 2 CH₃COOH → 2 CH₃COONa + H₂O + CO₂");
    expect(acidReaction(0, 2)).toMatchObject({ gas: "Wasserstoff", salt: "Magnesiumchlorid" });
    expect(acidReaction(1, 4).gas).toBe("kein Gas");
  });

  it("keeps the photosynthesis model atom-balanced and dark-blocked", () => {
    for (let c = 0; c <= 12; c++)
      for (let w = 0; w <= 12; w++) {
        const p = photosynthesis(c, w, true);
        expect(p.co2 + 6 * p.glucose).toBe(c);
        expect(p.water + 6 * p.glucose).toBe(w);
        expect(p.oxygen).toBe(6 * p.glucose);
        expect(photosynthesis(c, w, false).glucose).toBe(0);
      }
  });

  it("derives carbon oxidation numbers from bonds and raises them along the oxidation series", () => {
    expect(OX_MOLECULES.map((m) => carbonOxidation(m.h, m.o))).toEqual([-4, -2, 0, 2, 4, -1, 1, 3, 0, 2]);
    for (const n of [1, 2, 3, 4]) {
      const oz = [0, 1, 2].map((step) => {
        const c = functionalCarbon(n, step);
        return carbonOxidation(c.h, c.o);
      });
      expect(oz[1] - oz[0]).toBe(2);
      expect(oz[2] - oz[1]).toBe(2);
    }
    expect(oxidationStepName(3, 0)).toBe("Propan-1-ol");
    expect(oxidationStepName(2, 2)).toBe("Ethansäure");
  });

  it("builds fats as triesters and keeps the stated fest/flüssig model", () => {
    const stearin = must(FATTY_ACIDS.find((a) => a.name === "Stearinsäure"));
    const olein = must(FATTY_ACIDS.find((a) => a.name === "Ölsäure"));
    expect(fatFormula([stearin, stearin, stearin])).toBe("C₅₇H₁₁₀O₆");
    expect(fatFormula([olein, olein, olein])).toBe("C₅₇H₁₀₄O₆");
    expect(fatState([stearin, stearin, olein])).toBe("fest");
    expect(fatState([stearin, olein, olein])).toBe("flüssig");
  });

  it("classifies plastics and silicones by crosslinking", () => {
    expect(plasticBehaviour(0, 150)).toContain("formbar");
    expect(plasticBehaviour(2, 150)).toContain("formstabil");
    expect(plasticBehaviour(2, 240)).toContain("ohne zu schmelzen");
    expect(siliconeType(2, 10, 0)).toMatch(/^Silikonöl/);
    expect(siliconeType(2, 8, 1)).toMatch(/^Silikonelastomer/);
    expect(siliconeType(0, 4, 4)).toMatch(/^Silikonharz/);
  });

  it("never forms half molecules in the fuel cell", () => {
    const lab = must(findLessonById("ch-brennstoffzelle")).lesson.lab;
    for (const values of enumerateLabGrid(lab, 9)) {
      const r = computeReadouts(lab, values);
      expect(Number(r.water) % 2).toBe(0);
      expect(String(r.left)).not.toMatch(/,|\./);
    }
  });
});

describe("Every lab can be completed by interacting with the model", () => {
  for (const lesson of ALL_LESSONS)
    it(lesson.id, () => {
      const lab = lesson.lab;
      const start = defaultLabValues(lab);
      expect(reachedGoals(lab, start), `${lesson.id}: no goal at the start`).toHaveLength(0);
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
          else expect(value).not.toMatch(/\bNaN\b|undefined|Infinity/);
        const svg = labView(lab.kind).render(values, readouts);
        expect(svg).toContain('role="img"');
        expect(svg).not.toMatch(/\bNaN\b|Infinity|undefined/);
        // Learner-facing text uses the real minus sign (U+2212), never "-3".
        for (const [, text] of svg.matchAll(/>([^<]+)</g))
          expect(text, `${lesson.id}: SVG text`).not.toMatch(/(^|[\s(:=])-\d/);
        for (const value of Object.values(readouts))
          if (typeof value === "string") expect(value, `${lesson.id}: readout`).not.toMatch(/(^|[\s(:=])-\d/);
      }
    });

  it("requires an actual experiment action and invalidates the old observation when the setup changes", () => {
    const lab = must(findLessonById("ch-gefahrstoffe")).lesson.lab;
    const prediction = withChanges(lab, defaultLabValues(lab), { prediction: 2 });
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
      for (const generator of lesson.exercises) {
        const prompts = { 1: new Set<string>(), 2: new Set<string>() };
        for (const level of [1, 2] as const)
          for (let seed = 0; seed < 40; seed++) {
            const task = generator.make(
              createRng(seedFrom(`${seed}:${level}:${lesson.id}`)),
              level,
            );
            prompts[level].add(task.prompt);
            for (const text of [task.prompt, ...task.given, ...task.steps])
              expect(text, `${lesson.id} ${generator.id}: real minus sign`).not.toMatch(/(^|[\s(:=>])-\d/);
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
              `${lesson.id} ${generator.id} ${seed} ${level}`,
            ).toBe("correct");
            const withUnits = task.fields.map((field, index) =>
              field.kind === "number" && field.unit
                ? `${answers[index]} ${field.unit}`
                : answers[index],
            );
            expect(checkTask(task, withUnits).status, `${lesson.id}: answers with units`).toBe(
              "correct",
            );
            expect(
              checkTask(
                task,
                answers.map(() => ""),
              ).status,
            ).toBe("invalid");
            for (const [index, field] of task.fields.entries()) {
              if (field.kind === "choice") {
                expect(field.options.length, `${lesson.id} ${generator.id}`).toBeGreaterThanOrEqual(2);
                expect(new Set(field.options).size).toBe(field.options.length);
              } else expect(Number.isFinite(field.answer)).toBe(true);
              const wrong = [...answers];
              wrong[index] =
                field.kind === "choice"
                  ? String((field.correctIndex + 1) % field.options.length)
                  : String(field.answer + Math.max(10, Math.abs(field.answer) * 2));
              expect(checkTask(task, wrong).status).toBe("wrong");
              expect(wrongAnswerHint(task, checkTask(task, wrong))).toBeTruthy();
              // A typical mistake is graded wrong and gets its own hint.
              for (const slip of field.kind === "number" ? (field.slips ?? []) : []) {
                const typed = [...answers];
                typed[index] = String(slip.value).replace(".", ",");
                const result = checkTask(task, typed);
                expect(result.status, `${lesson.id} ${generator.id}: slip ${slip.value}`).toBe("wrong");
                expect(wrongAnswerHint(task, result)).toBe(slip.hint);
              }
            }
          }
        // The level changes the task, not only the wording.
        const overlap = [...prompts[2]].filter((p) =>
          [...prompts[1]].some((q) => q === p || q === `${p} Wähle die fachlich passende Aussage.`),
        );
        expect(overlap, `${lesson.id} ${generator.id}`).toHaveLength(0);
      }
    });

  it("gives targeted hints for typical mistakes in the calculations", () => {
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
        "ch-ionenbildung",
        "ch-ph-oxonium",
        "ch-neutralisation",
        "ch-titration",
        "ch-fotosynthese",
        "ch-energiegehalt",
        "ch-peptide",
        "ch-saccharose-polysaccharide",
        "ch-fette",
        "ch-silikone",
        "ch-brennstoffzelle",
      ]),
    );
  });

  it("keeps the peanut measurement plausible and below the table value", () => {
    const generator = must(must(findLessonById("ch-energiegehalt")).lesson.exercises.find((g) => g.id === "waerme"));
    for (let seed = 0; seed < 400; seed++) {
      const task = generator.make(createRng(seedFrom(`peanut:${seed}`)), 2);
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("Expected number field");
      expect(field.answer, task.prompt).toBeGreaterThanOrEqual(8);
      expect(field.answer, task.prompt).toBeLessThan(25);
      // The derivation shows joules before kilojoules.
      expect(task.steps[0]).toMatch(/ J = .* kJ$/);
    }
  });

  it("explains the fat state and the bromine test with the same rule it grades", () => {
    const generator = must(must(findLessonById("ch-fette")).lesson.exercises.find((g) => g.id === "fett-bau"));
    for (let seed = 0; seed < 200; seed++) {
      const task = generator.make(createRng(seedFrom(`fat:${seed}`)), 2);
      const [state, bromine] = task.fields;
      if (state.kind !== "choice" || bromine.kind !== "choice") throw new Error("Expected choices");
      const solid = state.options[state.correctIndex] === "eher fest";
      expect(task.steps[1].includes("eher fest"), task.prompt).toBe(solid);
      const decolours = bromine.options[bromine.correctIndex] === "entfärbt";
      expect(task.steps[1].includes("kein Brom"), task.prompt).toBe(!decolours);
    }
    expect(must(findLessonById("ch-fette")).lesson.formulas[0].html).toContain("höchstens ein ungesättigter Rest");
  });

  it("grades the silicone type with the lab's rule", () => {
    const generator = must(must(findLessonById("ch-silikone")).lesson.exercises.find((g) => g.id === "chlorwasserstoff"));
    for (let seed = 0; seed < 200; seed++) {
      const task = generator.make(createRng(seedFrom(`silicone:${seed}`)), 2);
      const [di, tri] = [...task.prompt.matchAll(/(\d+) \(?CH₃/g)].map((m) => Number(m[1]));
      const field = task.fields[0];
      if (field.kind !== "choice") throw new Error("Expected choice");
      expect(field.options[field.correctIndex], task.prompt).toBe(siliconeType(1, di, tri).split(":")[0]);
    }
  });

  it("accepts decimal commas, signs and units", () => {
    expect(parseNumber("1,5")).toBe(1.5);
    expect(parseNumber("−2")).toBe(-2);
    expect(parseNumber("0,075 mol/l", "mol/l")).toBeCloseTo(0.075);
    const task = must(findLessonById("ch-oxidationszahlen-organisch")).lesson.exercises[0].make(createRng(3), 1);
    const field = task.fields[0];
    if (field.kind !== "number") throw new Error("Expected number field");
    expect(checkTask(task, [String(field.answer)]).status).toBe("correct");
    expect(checkTask(task, [String(-field.answer || 1)]).status).toBe("wrong");
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

  it("completes Zweig I without requiring the other track's lessons", () => {
    const progress = loadLearnerProgress();
    for (const lesson of lessonsForTrack("I")) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: 3, 2: 0 };
    }
    expect(overallStats(progress, STAGES, "I")).toMatchObject({
      total: 30,
      completed: 30,
      percent: 100,
    });
    expect(overallStats(progress, STAGES, "II_III").percent).toBeLessThan(100);
    expect(isStageComplete(progress, STAGES[1], "II_III")).toBe(false);
    expect(isLessonComplete(progress, must(findLessonById("ch-ionenbildung")).lesson)).toBe(false);
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
    memory.set("chemie_rs10_academy_progress_v1", "not json");
    expect(loadLearnerProgress().activeLessonId).toBe("ch-gefahrstoffe");
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
      "chemie_rs10_academy_progress_v1",
      JSON.stringify({
        solved: { "ch-gefahrstoffe": { 1: -2, 2: 0.5 } },
        attempts: { "ch-gefahrstoffe": -4 },
      }),
    );
    const progress = loadLearnerProgress();
    expect(progress.solved["ch-gefahrstoffe"]).toEqual({ 1: 0, 2: 0 });
    expect(progress.attempts["ch-gefahrstoffe"]).toBe(0);
  });
});

describe("The cell is the only card source, and every card leads to a taught lesson", () => {
  it("has valid distinct ULIDs, a stable cell id and one atom per lesson", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(atoms).toHaveLength(40);
    expect(items).toHaveLength(100);
    const ids = [...atoms.map((atom) => atom.id), ...items.map((item) => item.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(new Set(items.map((item) => item.slug)).size).toBe(items.length);
    expect(new Set(atoms.map((atom) => atom.source_link))).toEqual(
      new Set(LESSON_IDS.map((id) => lessonLink(id))),
    );
    for (const atom of atoms) expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
  });

  it("matches the explicit Lehrplan bindings and lesson links", () => {
    for (const atom of atoms) {
      const lessonId = must(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId);
      const lesson = must(findLessonById(lessonId)).lesson;
      expect(atom.title).toBe(lesson.title);
      const bindings = atom.curricula.filter((binding) => binding.provider === "lehrplanplus-bayern");
      expect(bindings.map((binding) => ({ track: binding.track, lb: binding.topic_code }))).toEqual(
        Object.entries(lesson.bindings).map(([track, lb]) => ({ track, lb: `lb${lb}` })),
      );
      for (const binding of bindings) expect(binding.grade).toBe(10);
      expect(atom.curricula.find((c) => c.provider === "zam-academy")?.topic_code).toBe(lesson.stageId);
      for (const item of atom.practice_items) expect(item.source_link).toBe(lessonLink(lesson.id));
      for (const prerequisite of atom.prerequisites)
        expect(atoms.some((other) => other.id === prerequisite.atom_id)).toBe(true);
    }
  });

  it("writes chemical formulas on cards as segments with speech, except the kept legacy B cards", () => {
    for (const item of items) {
      if (item.slug.includes("legacy")) continue;
      for (const field of ["question", "concept"] as const) {
        const plain = item[field];
        if (plain && /[₀-₉⁺⁻⇌]/.test(plain))
          expect(item[`${field}_segments`]?.length, `${item.slug}.${field}`).toBeGreaterThan(0);
      }
    }
  });

  it("keeps structured formulas spoken and offers curated choices on every atomic card", () => {
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
        for (const distractor of item.choice_distractors ?? []) {
          expect(distractor.reason).toBeTruthy();
          expect(distractor.text).not.toBe(item.concept);
        }
        expect(item.fast_check?.options[1]).toBe(item.choice_distractors?.[0].text);
      } else expect(item.sample_solution).toBeTruthy();
    }
  });
});

describe("History mapping: approved by Thomas, exactly the documented transfers", () => {
  const bySlug = new Map(items.map((item) => [item.slug, item]));
  const originals: Item[] = [legacyOrganik, legacySaeuren].flatMap((tile) =>
    tile.atoms.flatMap((atom) => atom.practice_items as unknown as Item[]),
  );

  it("accounts for all 16 original items exactly once", () => {
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(16);
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
      originals.map((item) => item.id).sort(),
    );
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(5);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(2);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(9);
    for (const row of mapping.rows) expect(row.reason).toBeTruthy();
  });

  it("declares exactly the seven approved replaces and retires no card", () => {
    expect(mapping.approved).toBe("2026-10-24");
    expect(mapping.status).toBe("approved");
    expect(mapping.source).toContain("Kartenzuordnung freigegeben");
    expect("retired_items" in cell).toBe(false);
    const declared = items
      .filter((item) => item.replaces)
      .map((item) => [item.slug, item.replaces])
      .sort();
    const approved = mapping.rows
      .filter((row) => row.category !== "C")
      .map((row) => [row.academy_slug, [row.de_by_id]])
      .sort();
    expect(declared).toEqual(approved);
    expect(declared).toHaveLength(7);
    for (const row of mapping.rows.filter((row) => row.category === "C")) expect(row.action).toBe("keep-active");
  });

  it("names an existing successor for every A and B row and none for C", () => {
    for (const row of mapping.rows) {
      if (row.category === "C") {
        expect(row.academy_slug).toBeNull();
        for (const slug of row.related_new_slugs ?? []) expect(bySlug.has(slug)).toBe(true);
      } else expect(bySlug.has(must(row.academy_slug))).toBe(true);
    }
    const successors = mapping.rows.filter((row) => row.category !== "C").map((row) => row.academy_slug);
    expect(new Set(successors).size).toBe(successors.length);
  });

  it("preserves the entire demand of each old synthesis question on its B successor", () => {
    for (const row of mapping.rows.filter((row) => row.category === "B")) {
      const old = must(originals.find((item) => item.id === row.de_by_id));
      const successor = must(bySlug.get(must(row.academy_slug)));
      expect(successor.question).toBe(old.question);
      expect(successor.concept).toBe(old.concept);
      expect(successor.sample_solution).toBe(old.sample_solution);
      expect(successor.tier).toBe("tier2_synthesis");
    }
  });
});
