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
  careerProfileMatch,
  checkInternship,
  circularFlow,
  fmt,
  fmtInt,
  money,
  netPay,
  noiseExposure,
  productionCompare,
  projectCost,
  projectSchedule,
  shopGuV,
  standDemand,
  trainingMinimum,
  wageForms,
  weightedScore,
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

describe("WiB 8 domain calculations", () => {
  it("recomputes every worked example of the lessons", () => {
    expect(projectCost(40, 1.2, 30, 4)).toEqual({
      materialTotal: 48,
      totalCost: 78,
      costPerPiece: 1.95,
      revenue: 160,
      result: 82,
    });
    expect(projectSchedule(6, 14, 4, 20, 4, 8)).toEqual({
      workHours: 24,
      bufferHours: 4.8,
      totalHours: 28.8,
      weeksNeeded: 8,
      fits: true,
      spareWeeks: 0,
    });
    expect(projectSchedule(6, 14, 4, 20, 2, 8).weeksNeeded).toBe(15);

    const niklas = careerProfileMatch(5, 3, 5, 4);
    expect(niklas[0]).toMatchObject({ name: "Kfz-Mechatroniker/in", distance: 1, fitPct: 95 });
    expect(niklas.find((m) => m.name.startsWith("Kaufmann"))).toMatchObject({ distance: 7, fitPct: 65 });

    expect(trainingMinimum(700, 2)).toBe(826);
    expect(trainingMinimum(700, 3)).toBe(945);
    expect(trainingMinimum(650, 2)).toBe(767);
    expect(trainingMinimum(725, 2)).toBe(856); // 855,50 € wird aufgerundet

    // Punschstand: 120 Becher zu 2,00 €, 20 € Werbung
    expect(standDemand(2, 20)).toBe(120);
    expect(shopGuV(2, 20, 1.2, 40)).toEqual({
      sold: 120,
      revenue: 240,
      goodsCost: 144,
      standRent: 40,
      advertising: 20,
      expenses: 204,
      result: 36,
    });

    expect(circularFlow(40, 2250, 10)).toEqual({ income: 90000, saving: 9000, consumption: 81000 });

    expect(wageForms(18, 8, 12, 14)).toEqual({
      timeWage: 144,
      pieces: 112,
      pieceWage: 168,
      performancePct: 116.67,
      pieceHourly: 21,
    });

    expect(netPay(15, 160, 190, true, 21)).toEqual({
      gross: 2400,
      incomeTax: 190,
      churchTax: 15.2,
      taxes: 205.2,
      social: 504,
      net: 1690.8,
      minimumWageOk: true,
    });
    expect(money(2150 / 160)).toBe(13.44);
    expect(netPay(13.44, 160, 0, false, 0).minimumWageOk).toBe(false);

    expect(noiseExposure(95, true, true, 20)).toMatchObject({ workplaceDb: 85, earDb: 65, earOk: true });
    expect(noiseExposure(95, true, false, 20).zone).toContain("oberer Auslösewert");
    expect(noiseExposure(82, false, false, 20).zone).toContain("unterer Auslösewert");

    const robot = productionCompare(8000, 10, 30, 120000, 8, 60, 36);
    expect(robot.depreciation).toBe(15000);
    expect(robot.breakEvenQty).toBe(6250);
    expect(robot.machineCheaper).toBe(true);
    expect(productionCompare(4000, 10, 30, 120000, 8, 60, 36).machineCheaper).toBe(false);

    expect(weightedScore([2, 5, 5, 2], [30, 30, 20, 20])).toBe(3.5);
    expect(weightedScore([4, 2, 3, 4], [30, 30, 20, 20])).toBe(3.2);
    expect(weightedScore([2, 5, 5, 2], [10, 30, 20, 40])).toBe(3.5);
    expect(weightedScore([4, 2, 3, 4], [10, 30, 20, 40])).toBe(3.2);
  });

  it("checks Betriebspraktikum plans against the JArbSchG limits", () => {
    const tim = checkInternship(8, 16, 60, 5);
    expect(tim).toMatchObject({ workHours: 7, weeklyHours: 35, requiredBreak: 60, allowed: true });
    const draft = checkInternship(7.5, 16.5, 30, 5);
    expect(draft.workHours).toBe(8.5);
    expect(draft.allowed).toBe(false);
    expect(draft.violations.join(" ")).toContain("§ 11");
    expect(checkInternship(8, 15.5, 30, 5).checks.breaks).toBe(false); // 7 Std. brauchen 60 Min.
    expect(checkInternship(9, 14, 30, 5).allowed).toBe(true); // 4,5 Std. Arbeit
    expect(checkInternship(4, 10, 60, 5).checks.timeWindow).toBe(false);
    expect(checkInternship(8, 14, 30, 6).checks.days).toBe(false);
    expect(checkInternship(6, 17, 240, 5).checks.shift).toBe(false);
  });
});

describe("interactive SVG labs", () => {
  const witness: Record<LabKind, Record<string, number | string>> = {
    projectPlan: { buffer: 20, perWeek: 4 },
    careerMatch: { tech: 6, social: 3, care: 5, logic: 4 },
    shopGuV: { price: 3, advertising: 40 },
    circularFlow: { wage: 2500, savings: 10 },
    wageForms: { actual: 14 },
    netPay: { hourly: 14.6 },
    internshipCheck: { start: 8, end: 16, pause: 60, days: 5 },
    noiseProtection: { enclosure: "ja", worn: "ja" },
    productionCompare: { qty: 8000 },
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
    const d = (kind: LabKind, extra: Record<string, number | string>) => ({ ...LABS[kind].defaults, ...extra });
    expect(goalReached("projectPlan", d("projectPlan", { perWeek: 4 }))).toBe(false); // kein Puffer
    expect(goalReached("projectPlan", d("projectPlan", { buffer: 20, perWeek: 4, weeks: 9 }))).toBe(false);
    expect(goalReached("shopGuV", d("shopGuV", { price: 3, advertising: 40, unitCost: 0.8 }))).toBe(false);
    expect(goalReached("circularFlow", d("circularFlow", { wage: 2500, savings: 5 }))).toBe(false);
    expect(goalReached("circularFlow", d("circularFlow", { workers: 50, savings: 10 }))).toBe(false);
    expect(goalReached("wageForms", d("wageForms", { actual: 13 }))).toBe(false);
    expect(goalReached("netPay", d("netPay", { hourly: 14.5 }))).toBe(false);
    expect(goalReached("netPay", d("netPay", { hourly: 14.6, tax: 100 }))).toBe(false); // Lohnsteuer verändert
    expect(goalReached("internshipCheck", d("internshipCheck", { start: 8, end: 15.5, pause: 30, days: 5 }))).toBe(false);
    expect(goalReached("noiseProtection", d("noiseProtection", { worn: "ja" }))).toBe(false); // Haube fehlt
    expect(goalReached("productionCompare", d("productionCompare", { qty: 4000, invest: 40000 }))).toBe(false);
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
  const INT_UNITS = new Set(["Stück", "Min.", "Tage", "Wochen", "dB(A)"]);

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

  it("creates valid, solvable tasks across all 17 PracticeKinds (80 seeds × 2 levels) with differing levels", () => {
    const kinds = [...new Set(LESSONS.flatMap((l) => (l.practice ? [l.practice] : [])))];
    expect(kinds).toHaveLength(17);
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
          expect(task.prompt, where).not.toMatch(/\d\.\d{1,2}(?!\d)/);
          if (kind === "internshipHours" && level === 2) expect(task.fields).toHaveLength(3);
          if (kind === "trainingPay" && level === 1)
            for (const f of task.fields) expect(Number.isInteger(f.answer), where).toBe(true);
        }
      }
      expect(differing, kind).toBe(80);
    }
  });

  it("never counts a shown answer, a repeated submit, or a reloaded solved task twice", () => {
    const p = freshProgress(),
      lesson = LESSONS.find((l) => l.id === "wi-lohnabrechnung");
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
