import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { createAttempt, revealAttempt, skipAttempt, submitAttempt } from "../src/exercises/attempt";
import { checkBooking, checkExercise, numberMatches, parseNumbers } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import {
  accrual,
  ACCOUNTS,
  breakEven,
  calculation,
  distribute,
  makeOrBuy,
  money,
  operatingResult,
  provisionRelease,
  ratios,
} from "../src/finance";
import { goalReached, LABS } from "../src/labs";
import type { LabKind } from "../src/model/types";
import { freshProgress, parseProgress } from "../src/storage/progress";

describe("rounding", () => {
  it("rounds half cents commercially for both signs and decimal input sizes", () => {
    for (const [amount, rounded] of [
      [8.575, 8.58],
      [1.005, 1.01],
      [2.675, 2.68],
      [-8.575, -8.58],
      [-1.005, -1.01],
      [0.001, 0],
      [1e-7, 0],
      [10000000, 10000000],
    ])
      expect(money(amount)).toBe(rounded);
  });
});

describe("periodenrichtige Erfolgsermittlung", () => {
  it("splits the lesson's examples by months, counting the start month", () => {
    expect(accrual(1200, 10, 12)).toEqual({ oldMonths: 3, newMonths: 9, oldPart: 300, newPart: 900 });
    expect(accrual(2400, 4, 12).newPart).toBe(600);
    expect(accrual(3600, 8, 12)).toMatchObject({ oldPart: 1500, newPart: 2100 });
    expect(accrual(1800, 11, 6)).toMatchObject({ oldPart: 600, newPart: 1200 });
    expect(accrual(4800, 3, 12).newPart).toBe(800);
    expect(accrual(6000, 7, 12).newPart).toBe(3000);
    expect(accrual(3000, 12, 12).newPart).toBe(2750);
    expect(accrual(900, 12, 3).newPart).toBe(600);
    expect(accrual(1200, 1, 12)).toMatchObject({ newMonths: 0, newPart: 0 });
    expect(accrual(1800, 3, 6)).toMatchObject({ newMonths: 0, newPart: 0 });
  });
  it("conserves every cent of the payment for all starts and periods", () => {
    for (const amount of [1, 99.99, 1000, 1234.56, 7777.77])
      for (let start = 1; start <= 12; start++)
        for (let months = 1; months <= 12; months++) {
          const r = accrual(amount, start, months);
          expect(r.oldMonths + r.newMonths).toBe(months);
          expect(Math.round((r.oldPart + r.newPart) * 100)).toBe(Math.round(amount * 100));
          expect(r.oldPart).toBeGreaterThanOrEqual(0);
          expect(r.newPart).toBeGreaterThanOrEqual(0);
        }
    expect(() => accrual(100, 0, 12)).toThrow();
    expect(() => accrual(100, 5, 13)).toThrow();
  });
  it("settles provisions in the three cases of the lesson", () => {
    expect(provisionRelease(2000, 2300)).toEqual({ kind: "expense", vat: 437, gross: 2737, difference: 300 });
    expect(provisionRelease(2000, 1800)).toEqual({ kind: "income", vat: 342, gross: 2142, difference: 200 });
    expect(provisionRelease(1500, 1200)).toMatchObject({ kind: "income", vat: 228, gross: 1428, difference: 300 });
    expect(provisionRelease(3000, 3400)).toMatchObject({ kind: "expense", vat: 646, gross: 4046 });
    expect(provisionRelease(900, 900)).toMatchObject({ kind: "equal", difference: 0 });
  });
});

describe("Abschluss und Kennzahlen", () => {
  const base = { av: 400000, vorraete: 0, forderungen: 65300, fluessig: 18000, ek: 259500, lfk: 160000, kfk: 120000 };
  it("reproduces every ratio quoted in the lessons", () => {
    const r = ratios(base, 43500, 250000);
    expect(r).toEqual({ cash: 15, quick: 69.42, coverage1: 64.88, coverage2: 104.88, roe: 17.4 });
    expect(ratios({ ...base, fluessig: 30000, kfk: 200000 }, 0, 1).cash).toBe(15);
    expect(ratios({ ...base, fluessig: 20000, kfk: 140000 }, 0, 1).cash).toBe(14.29);
    expect(ratios({ ...base, forderungen: 50000, fluessig: 10000, kfk: 75000 }, 0, 1).quick).toBe(80);
    expect(ratios({ ...base, av: 500000, ek: 300000, lfk: 150000 }, 0, 1).coverage2).toBe(90);
    expect(ratios({ ...base, av: 320000, ek: 208000, lfk: 96000 }, 0, 1)).toMatchObject({ coverage1: 65, coverage2: 95 });
    expect(ratios(base, 24000, 160000).roe).toBe(15);
    expect(ratios(base, 30800, 220000).roe).toBe(14);
    expect(ratios(base, 48000, 300000).roe).toBe(16);
    expect(ratios(base, -5000, 100000).roe).toBe(-5);
    expect(() => ratios({ ...base, kfk: 0 }, 1, 1)).toThrow();
  });
});

describe("Vollkostenrechnung", () => {
  it("distributes overheads by key and keeps the total", () => {
    expect(distribute(12000, [100, 400, 50, 50])).toEqual([2000, 8000, 1000, 1000]);
    expect(distribute(4800, [2000, 9000, 600, 400])).toEqual([800, 3600, 240, 160]);
    expect(distribute(10000, [1, 5, 2, 2])).toEqual([1000, 5000, 2000, 2000]);
    for (const total of [100, 999.99, 24000, 12345.67])
      for (const w of [
        [1, 1, 1],
        [3, 7, 11, 13],
        [100, 0, 50, 7],
      ])
        expect(Math.round(distribute(total, w).reduce((s, x) => s + x, 0) * 100)).toBe(Math.round(total * 100));
    // Review finding: 100 Euro over 0, 130, 190 and 0 m² once gave the empty last centre −0,01 Euro.
    expect(distribute(100, [0, 130, 190, 0])).toEqual([0, 40.63, 59.37, 0]);
    for (let total = 1; total <= 300; total += 7.13)
      for (const w of [
        [0, 130, 190, 0],
        [1, 1, 1],
        [0, 0, 3],
        [7, 0, 11, 13],
      ]) {
        const shares = distribute(total, w);
        expect(Math.round(shares.reduce((s, x) => s + x, 0) * 100)).toBe(Math.round(total * 100));
        shares.forEach((x, i) => {
          expect(x).toBeGreaterThanOrEqual(0);
          if (w[i] === 0) expect(x).toBe(0);
          // Never more than one cent away from the exact proportional share.
          expect(Math.abs(x - (total * w[i]) / w.reduce((s, v) => s + v, 0))).toBeLessThan(0.0100001);
        });
      }
  });
  it("calculates the lesson's two orders step by step to the Listenverkaufspreis", () => {
    const a = calculation({ fm: 200, mgk: 10, fl: 300, fgk: 150, sek: 0, vwvt: 25, profit: 20, discount: 2, rebate: 10 });
    expect(a).toMatchObject({ mk: 220, fk: 750, hk: 970, vwvt: 242.5, sk: 1212.5, bvp: 1455, zvp: 1484.69, lvp: 1649.66 });
    const input = { fm: 400, mgk: 15, fl: 250, fgk: 180, sek: 40, vwvt: 20, profit: 15, discount: 3, rebate: 10 };
    const b = calculation(input);
    expect(b).toMatchObject({ mk: 460, fk: 740, hk: 1200, sk: 1440, bvp: 1656, zvp: 1707.22, lvp: 1896.91 });
    // Each step adds up exactly.
    expect(Math.round((b.zvp - b.discount) * 100)).toBe(Math.round(b.bvp * 100));
    expect(() =>
      calculation({ fm: 0, mgk: 0, fl: 0, fgk: 0, sek: 0, vwvt: 0, profit: 0, discount: 2, rebate: 10 }),
    ).toThrow();
    expect(() => calculation({ ...input, discount: 50 })).toThrow();
  });
});

describe("Teilkostenrechnung", () => {
  it("rounds the Gewinnschwelle up and reproduces the lesson's numbers", () => {
    expect(breakEven(40000, 95, 60)).toEqual({ db: 35, quantity: 1143 });
    expect(breakEven(50000, 70, 40).quantity).toBe(1667);
    expect(breakEven(45000, 90, 62).quantity).toBe(1608);
    expect(breakEven(60000, 120, 80).quantity).toBe(1500);
    expect(breakEven(60000, 108, 80).quantity).toBe(2143);
    expect(breakEven(20000, 45, 30).quantity).toBe(1334);
    expect(breakEven(40000, 138, 100).quantity).toBe(1053);
    expect(breakEven(120000, 95, 55).quantity).toBe(3000);
    expect(breakEven(1000, 10, 10).quantity).toBe(Infinity);
    for (let kf = 1000; kf <= 50000; kf += 777)
      for (const [p, kv] of [
        [10, 3],
        [99.99, 12.34],
        [70, 40],
      ]) {
        const q = breakEven(kf, p, kv).quantity;
        expect(operatingResult(kf, p, kv, q)).toBeGreaterThanOrEqual(0);
        expect(operatingResult(kf, p, kv, q - 1)).toBeLessThan(0);
      }
  });
  it("compares make and buy at the critical quantity", () => {
    expect(makeOrBuy(12000, 4, 10, 1500)).toEqual({ make: 18000, buy: 15000, critical: 2000 });
    expect(makeOrBuy(18000, 6, 15, 2500)).toMatchObject({ make: 33000, buy: 37500, critical: 2000 });
    expect(makeOrBuy(9000, 7, 10, 0).critical).toBe(3000);
    const at = makeOrBuy(12000, 4, 10, 2000);
    expect(at.make).toBe(at.buy);
  });
});

describe("labs", () => {
  const witness: Record<LabKind, Record<string, number | string>> = {
    accrual: { start: 10 },
    provision: { net: 1500 },
    balance: { fluessig: 60000, ek: 250000 },
    bab: { m2: 1600 },
    calc: { profit: 10, rebate: 5 },
    breakeven: { kv: 25 },
    makebuy: { x: 2500 },
  };
  for (const kind of Object.keys(LABS) as LabKind[])
    it(`${kind}: the goal is unmet at the start and reachable`, () => {
      const start = LABS[kind].defaults;
      expect(goalReached(kind, start)).toBe(false);
      expect(goalReached(kind, { ...start, ...witness[kind] })).toBe(true);
      for (const c of LABS[kind].controls)
        if (!c.options) {
          expect(Number(start[c.id])).toBeGreaterThanOrEqual(c.min ?? -Infinity);
          expect(Number(start[c.id])).toBeLessThanOrEqual(c.max ?? Infinity);
          // The browser refuses the form when a start value is off the min/step grid.
          const steps = (Number(start[c.id]) - (c.min ?? 0)) / (c.step ?? 1);
          expect(Math.abs(steps - Math.round(steps)), `${kind}.${c.id}`).toBeLessThan(1e-9);
        }
      expect(LESSONS.filter((l) => l.lab === kind)).toHaveLength(1);
    });
  it("does not count shortcuts that change what the goal fixes", () => {
    expect(goalReached("breakeven", { ...LABS.breakeven.defaults, price: 70 })).toBe(false);
    expect(goalReached("breakeven", { ...LABS.breakeven.defaults, kv: 25, capacity: 4000 })).toBe(false);
    expect(goalReached("calc", { ...LABS.calc.defaults, fgk: 50 })).toBe(false);
    expect(goalReached("calc", { ...LABS.calc.defaults, profit: 0, rebate: 0 })).toBe(false);
    expect(goalReached("bab", { ...LABS.bab.defaults, m2: 1600, fl: 20000 })).toBe(false);
    expect(goalReached("makebuy", { ...LABS.makebuy.defaults, kf: 1000 })).toBe(false);
    expect(goalReached("balance", { ...LABS.balance.defaults, ek: 10_000_000 })).toBe(false);
  });
});

describe("strict but usable answer checking", () => {
  it("accepts financial notation, units and rejects an error of one cent", () => {
    for (const value of ["1.234,50 €", "1,234.50", "1234.50", "1 234,50"]) expect(numberMatches(value, 1234.5)).toBe(true);
    expect(numberMatches("1.500", 1500)).toBe(true);
    // A thousands point is never read as a decimal point as well.
    expect(numberMatches("1.500", 1.5)).toBe(false);
    expect(numberMatches("35.000", 35)).toBe(false);
    expect(numberMatches("1.5", 1.5)).toBe(true);
    expect(numberMatches("12.50", 12.5)).toBe(true);
    expect(numberMatches("1.234.567", 1234567)).toBe(true);
    expect(numberMatches("−12,50", -12.5)).toBe(true);
    expect(numberMatches("1.143 Stück", 1143)).toBe(true);
    expect(numberMatches("−6 Prozentpunkte", -6)).toBe(true);
    expect(numberMatches("69,42 %", 69.42)).toBe(true);
    expect(numberMatches("1234,51", 1234.5)).toBe(false);
    expect(numberMatches("1.142", 1143)).toBe(false);
    for (const invalid of ["", "1,2,3", "1.2.3", "NaN", "Infinity", "<script>", "12abc", "1,234,50"])
      expect(parseNumbers(invalid)).toEqual([]);
  });
  it("accepts reordered or split postings, but never a wrong side, extra account or penny", () => {
    const expected = [
      { side: "debit" as const, account: "2900", amount: 900 },
      { side: "credit" as const, account: "6900", amount: 900 },
    ];
    const actual = [
      { side: "credit", account: "6900", amount: "900" },
      { side: "debit", account: "2900", amount: "900,00" },
    ];
    expect(checkBooking(expected, actual)).toBe(true);
    expect(checkBooking(expected, [{ ...actual[0], amount: "900,01" }, actual[1]])).toBe(false);
    expect(checkBooking(expected, actual.map((x) => ({ ...x, side: x.side === "debit" ? "credit" : "debit" })))).toBe(false);
    expect(checkBooking(expected, [...actual, { side: "debit", account: "6990", amount: "1" }])).toBe(false);
    expect(checkBooking(expected, [actual[0], { ...actual[1], amount: "400" }, { ...actual[1], amount: "500" }])).toBe(true);
  });
  it("creates balanced, solvable, cent-exact tasks across 34 families, and level 2 changes the task", () => {
    const kinds = [...new Set(LESSONS.flatMap((l) => (l.practice ? [l.practice] : [])))];
    expect(kinds).toHaveLength(34);
    for (const kind of kinds) {
      let differing = 0;
      for (let seed = 1; seed <= 80; seed++) {
        if (makeExercise(kind, createRng(seed), 1).prompt !== makeExercise(kind, createRng(seed), 2).prompt) differing++;
        for (const level of [1, 2] as const) {
          const task = makeExercise(kind, createRng(seed), level);
          const where = `${kind}/${level}/${seed}`;
          expect(task.fields.length + task.booking.length, where).toBeGreaterThan(0);
          const values = task.fields.map((f) => f.answer.toFixed(2).replace(".", ","));
          const entries = task.booking.map((e) => ({ ...e, amount: e.amount.toFixed(2).replace(".", ",") }));
          expect(checkExercise(task, values, entries), where).toBe(true);
          // The same answer typed with a decimal point counts as well.
          expect(checkExercise(task, task.fields.map((f) => f.answer.toFixed(2)), entries), where).toBe(true);
          for (const e of task.booking) {
            expect(ACCOUNTS[e.account], where).toBeDefined();
            expect(e.amount, where).toBeGreaterThan(0);
          }
          const debit = task.booking.filter((e) => e.side === "debit").reduce((s, e) => s + Math.round(e.amount * 100), 0);
          const credit = task.booking.filter((e) => e.side === "credit").reduce((s, e) => s + Math.round(e.amount * 100), 0);
          expect(debit, where).toBe(credit);
          for (const f of task.fields) {
            expect(Number.isFinite(f.answer), where).toBe(true);
            if (f.unit === "Stück") expect(Number.isInteger(f.answer), where).toBe(true);
          }
          if (values.length)
            expect(checkExercise(task, [String(task.fields[0].answer + 1), ...values.slice(1)], entries), where).toBe(false);
          if (entries.length)
            expect(
              checkExercise(task, values, [{ ...entries[0], amount: String(task.booking[0].amount + 0.01) }, ...entries.slice(1)]),
              where,
            ).toBe(false);
          expect(task.prompt, where).not.toMatch(/NaN|undefined|Infinity/);
          expect(task.prompt, where).not.toMatch(/(^|\s)-\d/);
        }
      }
      expect(differing, kind).toBe(80);
    }
  });
  it("never counts a shown answer, a repeated submit, or a reloaded solved task twice", () => {
    const p = freshProgress(),
      lesson = LESSONS.find((l) => l.id === "tk-gewinnschwelle");
    if (!lesson) throw new Error("Anker der Rechenlektion fehlt");
    const a = createAttempt(p, lesson, 1);
    revealAttempt(p, a);
    expect(submitAttempt(p, a, a.task.fields.map((f) => String(f.answer)), [])).toBe(false);
    expect(p.solved[a.key] ?? 0).toBe(0);
    const recovered = parseProgress(JSON.stringify(p));
    expect(recovered.serial[a.key]).toBe(1);
    const next = createAttempt(recovered, lesson, 1);
    expect(next.task).not.toEqual(a.task);
    expect(submitAttempt(recovered, next, next.task.fields.map((f) => String(f.answer)), [])).toBe(true);
    expect(submitAttempt(recovered, next, next.task.fields.map((f) => String(f.answer)), [])).toBe(false);
    expect(recovered.solved[next.key]).toBe(1);
    skipAttempt(recovered, next);
    expect(recovered.serial[next.key]).toBe(2);
  });
});
