import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import {
  alkaneCombustion,
  alkaneFormula,
  alkaneMolarMass,
  ANIONS,
  averageMolarMass,
  binaryMoleculeFormula,
  binaryNonmetalName,
  CATIONS,
  heatingCurveTemp,
  kugelwolkenConfig,
  lindeFractionation,
  molarMassFromParticleMassE24,
  moleculeRatio,
  PARTICLE_SPECIES,
  PHASE_SUBSTANCES,
  PSE_ELEMENTS,
  saltFormula,
  saltName,
  saltRatio,
  stateOfMatter,
  valenceElectrons,
} from "../src/chemistry/model";
import {
  ALL_LESSONS,
  continuationLesson,
  findLessonById,
  lessonsForTrack,
  nextLesson,
  previousLesson,
  STAGES,
  stageNumberForTrack,
} from "../src/curriculum/index";
import { quizOrder } from "../src/exercises/quiz-order";
import { EXPERIMENTS, experimentWitness } from "../src/lab/definitions";
import {
  applyAction,
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
  withChanges,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

describe("LehrplanPLUS Bayern Chemie 8 (Zweig I) curriculum", () => {
  it("pins all 32 stable lesson ids across five distinct stages", () => {
    expect(STAGES).toHaveLength(5);
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(5);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual([...LESSON_IDS]);
    expect(lessonsForTrack("I")).toHaveLength(32);
    expect(lessonsForTrack("alle")).toHaveLength(32);
    expect(new Set(ALL_LESSONS.map((lesson) => lesson.lab.kind)).size).toBe(32);
  });

  it("ships complete explanations, quick checks, formulas, labs and exercise generators on every lesson", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.tracks).toEqual(["I"]);
      expect(lesson.lehrplan).toMatch(/^C8 LB [1-5] \(I\)$/);
      expect(lesson.explanationHtml.length, lesson.id).toBeGreaterThan(250);
      expect(lesson.explanationHtml, lesson.id).toContain('class="example"');
      expect(lesson.explanationHtml, lesson.id).not.toMatch(/https?:\/\/|youtube|vimeo|<iframe/i);
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.lab.goals.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.options.length, lesson.id).toBeGreaterThanOrEqual(2);
      const order = quizOrder(lesson);
      expect([...order].sort((a, b) => a - b)).toEqual(lesson.quiz.options.map((_, i) => i));
    }
  });

  it("maps all 51 verbatim Kompetenzerwartungen of Chemie 8 (Zweig I) without gaps or duplicates", () => {
    expect(coverage.rows).toHaveLength(51);
    expect(coverage.optional_lessons).toEqual([]);
    const seen = new Set<string>();
    for (const row of coverage.rows) {
      expect(row.track).toBe("I");
      expect(row.lb).toBeGreaterThanOrEqual(1);
      expect(row.lb).toBeLessThanOrEqual(5);
      expect(row.competence.length).toBeGreaterThan(20);
      const key = `${row.lb}:${row.competence}`;
      expect(seen.has(key), `duplicate competence: ${key}`).toBe(false);
      seen.add(key);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = must(findLessonById(id)?.lesson, id);
        if (row.lb >= 2) expect(lesson.bindings.I, `${id} serves LB ${row.lb}`).toBe(row.lb);
      }
    }
    for (const lesson of ALL_LESSONS) {
      expect(
        coverage.rows.some((row) => row.lessons.includes(lesson.id)),
        `${lesson.id} covers at least one competence`,
      ).toBe(true);
    }
  });

  it("navigates cleanly and resolves canonical deep links", () => {
    expect(previousLesson("ch-gefahrstoffe-sicherheit", "I")).toBeUndefined();
    expect(nextLesson("ch-gefahrstoffe-sicherheit", "I")?.id).toBe("ch-experiment-protokoll");
    expect(previousLesson("ch-experiment-protokoll", "I")?.id).toBe("ch-gefahrstoffe-sicherheit");
    expect(nextLesson("ch-isotopie-molare-masse", "I")).toBeUndefined();
    expect(continuationLesson("unknown-id", "I").id).toBe("ch-gefahrstoffe-sicherheit");
    expect(stageNumberForTrack("atombau", "I")).toBe(5);
    expect(stageNumberForTrack("unknown", "I")).toBeUndefined();
    for (const id of LESSON_IDS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash).lessonId).toBe(id);
    }
    expect(parseTrainingDeepLink("#lesson=ch-luft-linde&level=2")).toEqual({
      lessonId: "ch-luft-linde",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
  });
});

describe("Chemie 8 domain models: scientific invariants", () => {
  it("distinguishes pure water plateau, salt solution boiling range, sublimation and Linde fractionation", () => {
    expect(heatingCurveTemp(0, 6)).toBe(100);
    expect(heatingCurveTemp(0, 10)).toBe(100);
    expect(heatingCurveTemp(15, 10)).toBeGreaterThan(heatingCurveTemp(15, 7));
    const water = PHASE_SUBSTANCES[0];
    const iodine = PHASE_SUBSTANCES[2];
    expect(stateOfMatter(water, -5)).toBe("fest");
    expect(stateOfMatter(water, 25)).toBe("flüssig");
    expect(stateOfMatter(water, 120)).toBe("gasförmig");
    expect(stateOfMatter(iodine, 100)).toBe("fest");
    expect(stateOfMatter(iodine, 120)).toBe("gasförmig");
    expect(lindeFractionation(-200)).toMatchObject({ n2: "flüssig", ar: "flüssig", o2: "flüssig" });
    expect(lindeFractionation(-190)).toMatchObject({ n2: "gasförmig", ar: "flüssig", o2: "flüssig" });
    expect(lindeFractionation(-184)).toMatchObject({ n2: "gasförmig", ar: "gasförmig", o2: "flüssig" });
    expect(lindeFractionation(-180)).toMatchObject({ n2: "gasförmig", ar: "gasförmig", o2: "gasförmig" });
  });

  it("computes reduced ratios and IUPAC names for binary nonmetal molecules and binary salts", () => {
    expect(moleculeRatio(4, 2)).toEqual([1, 2]);
    expect(binaryMoleculeFormula("C", 1, "O", 2)).toBe("CO₂");
    expect(binaryNonmetalName("Kohlenstoff", 1, "oxid", 2)).toBe("Kohlenstoffdioxid");
    expect(binaryNonmetalName("Stickstoff", 2, "oxid", 5)).toBe("Distickstoffpentaoxid");
    const fe3 = must(CATIONS.find((c) => c.symbol === "Fe" && c.charge === 3));
    const al3 = must(CATIONS.find((c) => c.symbol === "Al"));
    const o2 = must(ANIONS.find((a) => a.symbol === "O"));
    const cl1 = must(ANIONS.find((a) => a.symbol === "Cl"));
    expect(saltFormula(al3, o2)).toBe("Al₂O₃");
    expect(saltName(al3, o2)).toBe("Aluminiumoxid");
    expect(saltName(fe3, cl1)).toBe("Eisen(III)-chlorid");
    for (const c of CATIONS)
      for (const a of ANIONS) {
        const [nc, na] = saltRatio(c.charge, a.charge);
        expect(nc * c.charge + na * a.charge).toBe(0);
      }
  });

  it("links particle mass to molar mass, balances alkane combustion, handles Helium and computes isotopic masses", () => {
    for (const sp of PARTICLE_SPECIES) {
      expect(molarMassFromParticleMassE24(sp.massE24g)).toBeCloseTo(sp.molarMass, 0);
    }
    expect(alkaneFormula(3)).toBe("C₃H₈");
    expect(alkaneMolarMass(4)).toBe(58);
    expect(alkaneCombustion(1, 2).equation).toBe("CH₄ + 2 O₂ → CO₂ + 2 H₂O");
    expect(alkaneCombustion(2, 2).equation).toBe("2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O");
    expect(alkaneCombustion(3, 1).mainCarbonProduct).toContain("CO");
    expect(alkaneCombustion(3, 0).mainCarbonProduct).toContain("Ruß");
    const he = must(PSE_ELEMENTS.find((e) => e.symbol === "He"));
    expect(he.hauptgruppe).toBe(8);
    expect(valenceElectrons(he)).toBe(2);
    expect(kugelwolkenConfig(2)).toMatchObject({ maxOuterClouds: 1, pairs: 1, singles: 0, bindigkeit: 0 });
    expect(kugelwolkenConfig(6)).toMatchObject({ maxOuterClouds: 4, pairs: 0, singles: 4, bindigkeit: 4 });
    expect(kugelwolkenConfig(8)).toMatchObject({ maxOuterClouds: 4, pairs: 2, singles: 2, bindigkeit: 2 });
    expect(averageMolarMass(35, 37, 75)).toBe(35.5);
  });
});

describe("All 32 interactive SVG labs", () => {
  for (const lesson of ALL_LESSONS) {
    it(`${lesson.id} (${lesson.lab.kind}) starts uncompleted, reaches every goal and renders clean SVG`, () => {
      const lab = lesson.lab;
      const start = defaultLabValues(lab);
      expect(reachedGoals(lab, start), `${lesson.id}: 0 goals at default start`).toHaveLength(0);
      const grid = enumerateLabGrid(lab, 21);
      for (const goal of lab.goals) {
        const witness = EXPERIMENTS[lab.kind]
          ? experimentWitness(lab.kind, Number(goal.id.slice(5)))
          : grid.find((values) => goal.check(values, computeReadouts(lab, values)));
        expect(witness, `${lesson.id}: ${goal.text}`).toBeDefined();
        const reached = must(witness);
        expect(goal.check(reached, computeReadouts(lab, reached))).toBe(true);
      }
      const view = labView(lab.kind);
      for (const values of enumerateLabGrid(lab, 3)) {
        const readouts = computeReadouts(lab, values);
        for (const val of Object.values(readouts)) {
          if (typeof val === "number") expect(Number.isFinite(val)).toBe(true);
          else {
            expect(val).not.toMatch(/\bNaN\b|undefined|Infinity/);
            expect(val, `${lesson.id}: readout minus`).not.toMatch(/(^|[\s(:=])-\d/);
          }
        }
        const svg = view.render(values, readouts);
        expect(svg).toContain('role="img"');
        expect(svg).not.toMatch(/\bNaN\b|undefined|Infinity/);
        for (const [, text] of svg.matchAll(/>([^<]+)</g)) {
          expect(text, `${lesson.id}: SVG minus`).not.toMatch(/(^|[\s(:=])-\d/);
        }
      }
    });
  }

  it("supports drag handles on 10 labs and resets experiment state when setup changes", () => {
    const withHandles = ALL_LESSONS.filter((lesson) => {
      const handles = labView(lesson.lab.kind).handles;
      return handles && Object.keys(handles).length > 0;
    });
    expect(withHandles.length).toBeGreaterThanOrEqual(10);
    for (const lesson of withHandles) {
      const handles = must(labView(lesson.lab.kind).handles);
      for (const h of Object.values(handles)) {
        const raw = h.drag({ x: 250, y: 150 }, defaultLabValues(lesson.lab));
        for (const [k, val] of Object.entries(raw)) {
          const p = must(lesson.lab.params.find((param) => param.key === k));
          expect(Number.isFinite(clampParam(p, val ?? 0))).toBe(true);
        }
      }
    }
    const expLab = must(findLessonById("ch-gefahrstoffe-sicherheit")).lesson.lab;
    const rightPrediction = experimentWitness("ghs", 0).prediction;
    const predicted = withChanges(expLab, defaultLabValues(expLab), { prediction: rightPrediction });
    expect(reachedGoals(expLab, predicted)).toHaveLength(0);
    const observed = applyAction(expLab, predicted, "run");
    expect(reachedGoals(expLab, observed).map((g) => g.id)).toEqual(["case-0"]);
    const switched = withChanges(expLab, observed, { case: 1 });
    expect(switched.observed).toBe(0);
  });
});
