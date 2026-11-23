import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { createAttempt, revealAttempt, skipAttempt, submitAttempt } from "../src/exercises/attempt";
import { checkExercise, numberMatches, parseNumbers } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import { goalReached, LABS, renderResult } from "../src/labs";
import type { LabKind } from "../src/model/types";
import { freshProgress, parseProgress } from "../src/storage/progress";
import {
  applianceUsageCost,
  careerProfileMatch,
  checkHolidayJob,
  fmt,
  fmtInt,
  fourWeekBudget,
  livingStandardSplit,
  marketState,
  money,
  projectBudgetPlan,
  schoolSaleOutcome,
  selfEmployedResult,
  trainingMonthlyBudget,
  unitPrice,
  workplaceScore,
  workTimeHours,
} from "../src/wib";

describe("rounding and German number formatting", () => {
  it("rounds commercially and formats negative numbers with real minus", () => {
    for (const [amount, rounded] of [
      [8.575, 8.58],
      [1.005, 1.01],
      [2.675, 2.68],
      [-8.575, -8.58],
      [-1.005, -1.01],
      [0.001, 0],
      [1e-7, 0],
    ])
      expect(money(amount)).toBe(rounded);

    expect(fmt(-12.5)).toBe("−12,50");
    expect(fmt(1234.5)).toBe("1.234,50");
    expect(fmtInt(-42)).toBe("−42");
  });
});

describe("WiB 7 domain calculations", () => {
  it("computes project budgets, workplace scores, self-employment, career matches and training budgets", () => {
    expect(projectBudgetPlan(4, 2.5, 30, 0.8, 2.0, 40)).toEqual({
      totalPrepHours: 10,
      contribution: 1.2,
      breakEvenQty: 25,
      revenue: 80,
      variableTotal: 32,
      totalCost: 62,
      surplus: 18,
      returnPerHour: 1.8,
    });

    expect(workplaceScore(5, 6, 5, 4)).toEqual({
      lightNoise: 5,
      ergonomics: 6,
      tools: 5,
      breaksHours: 4,
      total: 5.1,
      weakPoints: [],
    });
    expect(workplaceScore(2, 1, 4, 3).weakPoints).toEqual(["Licht/Lärm", "Ergonomie"]);

    expect(selfEmployedResult(120, 45, 20, 1800)).toEqual({
      revenue: 5400,
      materialCost: 1080,
      grossMargin: 4320,
      profit: 2520,
      marginPct: 46.67,
    });

    const matches = careerProfileMatch(6, 3, 5, 3);
    expect(matches[0]).toMatchObject({
      name: "Elektroniker/in (Handwerk)",
      distance: 0,
      fitPct: 100,
    });

    expect(trainingMonthlyBudget(950, 49, 45, 10)).toEqual({
      allowance: 950,
      travelCost: 49,
      workGear: 45,
      reserve: 95,
      available: 761,
    });
  });

  it("computes work-time equivalent, budgets, unit prices, market state, school sale, JArbSchG and appliance cost", () => {
    expect(workTimeHours(60, 12.5)).toBe(4.8);
    expect(workTimeHours(60, 0)).toBe(Infinity);

    expect(livingStandardSplit(2000, 1250)).toEqual({
      netIncome: 2000,
      basicCosts: 1250,
      basicRatioPct: 62.5,
      freeIncome: 750,
      freeRatioPct: 37.5,
    });

    expect(fourWeekBudget(25, 10, 10, 15)).toEqual({
      income4: 100,
      fixed4: 40,
      variable4: 40,
      expenses4: 80,
      surplus4: 20,
      saveRatePct: 20,
      fourWeekGoal: 15,
      gapToGoal: -5,
    });

    expect(unitPrice(1.89, 0.75)).toBe(2.52);

    expect(marketState(2.0, 0, 20)).toMatchObject({
      demandQty: 70,
      supplyQty: 30,
      excessDemand: 40,
      tradedQty: 30,
      revenue: 60,
    });

    expect(schoolSaleOutcome(60, 0.9, 2.0, 100, 10)).toEqual({
      buyQty: 60,
      demandQty: 60,
      soldQty: 60,
      unsoldQty: 0,
      revenue: 120,
      purchaseCost: 54,
      standCost: 10,
      expense: 64,
      surplus: 56,
    });

    const illegal = checkHolidayJob(14, 9, 6, 5, 30);
    expect(illegal.allowed).toBe(false);
    expect(illegal.violations).toHaveLength(6);

    const legal = checkHolidayJob(15, 8, 5, 4, 60);
    expect(legal.allowed).toBe(true);
    expect(legal.violations).toEqual([]);

    expect(applianceUsageCost(1000, 5, 0, 40, 200)).toEqual({
      activeKwhYear: 260,
      standbyKwhYear: 0,
      totalKwhYear: 260,
      activeCostYear: 104,
      standbyCostYear: 0,
      totalCostYear: 104,
      standbySharePct: 0,
      fiveYearCost: 720,
    });
  });
});

describe("interactive SVG labs", () => {
  const witness: Record<LabKind, Record<string, number | string>> = {
    projectPlan: { sellPrice: 2.2 },
    workplaceCheck: { lightNoise: 5, ergonomics: 6, tools: 5, breaksHours: 4 },
    selfEmployedSim: { hours: 120 },
    careerMatch: { tech: 6, social: 3, care: 5, creative: 3 },
    householdBudget: { weeklyFixed: 5, weeklyVariable: 10 },
    marketMechanism: { price: 2.0 },
    schoolSale: { buyQty: 60, sellPrice: 2.0 },
    holidayJobCheck: { age: 15, hoursPerDay: 8, daysPerWeek: 5, weeksPerYear: 4, breakMinutes: 60 },
    applianceCheck: { standbyWatts: 0 },
  };

  for (const kind of Object.keys(LABS) as LabKind[])
    it(`${kind}: the goal is unmet at the start, reachable via witness, and has 1 lesson`, () => {
      const start = LABS[kind].defaults;
      expect(goalReached(kind, start)).toBe(false);
      expect(goalReached(kind, { ...start, ...witness[kind] })).toBe(true);
      for (const c of LABS[kind].controls)
        if (!c.options) {
          expect(Number(start[c.id])).toBeGreaterThanOrEqual(c.min ?? -Infinity);
          expect(Number(start[c.id])).toBeLessThanOrEqual(c.max ?? Infinity);
          const steps = (Number(start[c.id]) - (c.min ?? 0)) / (c.step ?? 1);
          expect(Math.abs(steps - Math.round(steps)), `${kind}.${c.id}`).toBeLessThan(1e-9);
        }
      expect(LESSONS.filter((l) => l.lab === kind)).toHaveLength(1);
    });

  it("rejects goal shortcuts that violate lab conditions", () => {
    expect(goalReached("holidayJobCheck", { ...LABS.holidayJobCheck.defaults, age: 14, hoursPerDay: 6, breakMinutes: 60 })).toBe(false);
    expect(goalReached("holidayJobCheck", { ...LABS.holidayJobCheck.defaults, age: 15, hoursPerDay: 8, daysPerWeek: 6, breakMinutes: 60 })).toBe(false);
    expect(goalReached("householdBudget", { ...LABS.householdBudget.defaults, fourWeekGoal: 120, weeklyFixed: 5, weeklyVariable: 10 })).toBe(false);
    expect(goalReached("applianceCheck", { ...LABS.applianceCheck.defaults, standbyWatts: 2 })).toBe(false);
  });

  it("renders finite readouts and valid SVGs over sampled slider grids across all 9 labs", () => {
    for (const kind of Object.keys(LABS) as LabKind[]) {
      const controls = LABS[kind].controls;
      const pointsPerSlider = controls.length <= 2 ? 9 : controls.length <= 3 ? 6 : controls.length <= 4 ? 4 : 3;
      const domainFor = (c: (typeof controls)[number]): Array<number | string> => {
        if (c.options) return c.options.map((o) => o[0]);
        const min = c.min ?? 0;
        const max = c.max ?? 100;
        const step = c.step ?? 1;
        const vals: number[] = [];
        for (let idx = 0; idx < pointsPerSlider; idx++) {
          const raw = min + ((max - min) * idx) / Math.max(1, pointsPerSlider - 1);
          const snapped = Math.min(max, Math.max(min, min + Math.round((raw - min) / step) * step));
          vals.push(Number(snapped.toFixed(4)));
        }
        return [...new Set(vals)];
      };

      const domains = controls.map(domainFor);
      let combinations: Record<string, number | string>[] = [{}];
      for (let i = 0; i < controls.length; i++) {
        const ctrl = controls[i];
        const next: Record<string, number | string>[] = [];
        for (const base of combinations)
          for (const val of domains[i]) {
            next.push({ ...base, [ctrl.id]: val });
            if (next.length >= 250 && controls.length >= 5) break;
          }
        combinations = next;
      }

      if (controls.length >= 5) {
        const rng = createRng(99);
        for (let s = 0; s < 400; s++) {
          const sample: Record<string, number | string> = {};
          for (let i = 0; i < controls.length; i++) {
            const vals = domains[i];
            sample[controls[i].id] = vals[rng.int(0, vals.length - 1)];
          }
          combinations.push(sample);
        }
      }

      for (const values of combinations) {
        const html = renderResult(kind, values);
        expect(html, `${kind}:${JSON.stringify(values)}`).toContain("<svg");
        expect(html, `${kind}:${JSON.stringify(values)}`).not.toMatch(/\bNaN\b|\bundefined\b|\bInfinity\b/);
      }
    }
  });
});

describe("answer checking and generated exercises", () => {
  const INT_UNITS = new Set(["Stück", "Min.", "Tage"]);

  it("accepts German and English decimals with units and rejects off-by-one-hundredth answers", () => {
    for (const value of ["1.234,50 €", "1,234.50", "1234.50", "1 234,50", "1.234,50 Euro"])
      expect(numberMatches(value, 1234.5)).toBe(true);
    expect(numberMatches("35.000", 35000)).toBe(true);
    expect(numberMatches("35.000", 35)).toBe(false);
    expect(numberMatches("−25,00 €", -25)).toBe(true);
    expect(numberMatches("45 Min.", 45)).toBe(true);
    expect(numberMatches("2,50 €/kg", 2.5)).toBe(true);
    expect(numberMatches("12,50 €/Std.", 12.5)).toBe(true);
    expect(numberMatches("1234,51", 1234.5)).toBe(false);
    for (const invalid of ["", "1,2,3", "1.2.3", "NaN", "Infinity", "<script>", "12abc"])
      expect(parseNumbers(invalid)).toEqual([]);
  });

  it("creates valid, solvable tasks across all 18 PracticeKinds (80 seeds × 2 levels) with differing levels", () => {
    const kinds = [...new Set(LESSONS.flatMap((l) => (l.practice ? [l.practice] : [])))];
    expect(kinds).toHaveLength(18);
    for (const kind of kinds) {
      let differing = 0;
      for (let seed = 1; seed <= 80; seed++) {
        if (makeExercise(kind, createRng(seed), 1).prompt !== makeExercise(kind, createRng(seed), 2).prompt)
          differing++;
        for (const level of [1, 2] as const) {
          const task = makeExercise(kind, createRng(seed), level);
          const where = `${kind}/${level}/${seed}`;
          expect(task.fields.length, where).toBeGreaterThan(0);

          const commaValues = task.fields.map((f) =>
            INT_UNITS.has(f.unit) ? String(f.answer) : f.answer.toFixed(2).replace(".", ","),
          );
          const dotValues = task.fields.map((f) =>
            INT_UNITS.has(f.unit) ? String(f.answer) : f.answer.toFixed(2),
          );
          expect(checkExercise(task, commaValues), where).toBe(true);
          expect(checkExercise(task, dotValues), where).toBe(true);

          for (const f of task.fields) {
            expect(Number.isFinite(f.answer), where).toBe(true);
            if (INT_UNITS.has(f.unit)) expect(Number.isInteger(f.answer), where).toBe(true);
          }
          expect(
            checkExercise(task, [String(task.fields[0].answer + 1), ...commaValues.slice(1)]),
            where,
          ).toBe(false);
          expect(task.prompt, where).not.toMatch(/NaN|undefined|Infinity/);
          expect(task.hint, where).not.toMatch(/NaN|undefined|Infinity/);
          expect(task.solution, where).not.toMatch(/NaN|undefined|Infinity/);
          expect(task.prompt, where).not.toMatch(/(^|[\s(„"])-\d/);
        }
      }
      expect(differing, kind).toBe(80);
    }
  });

  it("never counts a shown answer, a repeated submit, or a reloaded solved task twice", () => {
    const p = freshProgress(),
      lesson = LESSONS.find((l) => l.id === "wi-geldwert-arbeitszeit");
    if (!lesson) throw new Error("Anker der Rechenlektion fehlt");
    const a = createAttempt(p, lesson, 1);
    revealAttempt(p, a);
    expect(submitAttempt(p, a, a.task.fields.map((f) => String(f.answer)))).toBe(false);
    expect(p.solved[a.key] ?? 0).toBe(0);
    const recovered = parseProgress(JSON.stringify(p));
    expect(recovered.serial[a.key]).toBe(1);
    const next = createAttempt(recovered, lesson, 1);
    expect(next.task).not.toEqual(a.task);
    expect(submitAttempt(recovered, next, next.task.fields.map((f) => String(f.answer)))).toBe(true);
    expect(submitAttempt(recovered, next, next.task.fields.map((f) => String(f.answer)))).toBe(false);
    expect(recovered.solved[next.key]).toBe(1);
    skipAttempt(recovered, next);
    expect(recovered.serial[next.key]).toBe(2);
  });
});
