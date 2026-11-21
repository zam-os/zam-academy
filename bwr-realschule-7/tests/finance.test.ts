import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { createAttempt, revealAttempt, skipAttempt, submitAttempt } from "../src/exercises/attempt";
import { checkBooking, checkExercise, numberMatches, parseNumbers } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import {
  ACCOUNT_LIST,
  ACCOUNTS,
  balanceShift,
  changedBase,
  householdBudget,
  inventarTotals,
  inventoryDiff,
  money,
  offerPrice,
  originalBase,
  percentBase,
  percentRate,
  percentValue,
  periodOutcome,
  tAccountClosing,
  vatFromGross,
  vatFromNet,
  weightedLocation,
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

describe("household & business calculations (BwR 7)", () => {
  it("computes household budgets, percentages and inverse percentage changes exactly", () => {
    expect(householdBudget(3400, 2100, 1050, 0)).toEqual({
      totalExpenses: 3150,
      balance: 250,
      savingsRate: 7.35,
    });
    expect(householdBudget(3600, 2350, 640, 250)).toEqual({
      totalExpenses: 3240,
      balance: 360,
      savingsRate: 10,
    });
    expect(percentValue(3200, 15)).toBe(480);
    expect(percentRate(960, 3200)).toBe(30);
    expect(percentBase(360, 12)).toBe(3000);
    expect(changedBase(400, 8, "inc")).toBe(432);
    expect(changedBase(400, 15, "dec")).toBe(340);
    expect(originalBase(64, 20, "dec")).toBe(80);
    expect(originalBase(119, 19, "inc")).toBe(100);
  });

  it("scores weighted locations and rejects weights that do not sum to 100 %", () => {
    expect(weightedLocation([6, 5, 4, 1], [2, 2, 4, 6], [35, 35, 20, 10])).toEqual({
      scoreA: 4.75,
      scoreB: 2.8,
      diff: 1.95,
    });
    expect(() => weightedLocation([6, 5], [2, 2], [40, 40])).toThrow();
  });

  it("computes inventories, balance shifts, T-accounts, VAT, procurement offers, period outcome and inventory diffs", () => {
    expect(inventarTotals([180000, 55000], [18000, 22000, 3000], [90000, 28000])).toEqual({
      av: 235000,
      uv: 43000,
      assets: 278000,
      debts: 118000,
      equity: 160000,
    });
    const base = { av: 140000, uv: 70000, ek: 120000, lbkv: 50000, ve: 40000 };
    expect(balanceShift(base, "aktivtausch", 5000)).toMatchObject({ total: 210000, av: 145000, uv: 65000 });
    expect(balanceShift(base, "passivtausch", 10000)).toMatchObject({ total: 210000, lbkv: 60000, ve: 30000 });
    expect(balanceShift(base, "mehrung", 20000)).toMatchObject({ total: 230000, av: 160000, ve: 60000 });
    expect(balanceShift(base, "minderung", 15000)).toMatchObject({ total: 195000, uv: 55000, ve: 25000 });
    expect(() => balanceShift(base, "minderung", 50000)).toThrow();

    expect(tAccountClosing("active", 20000, [5000], [3000])).toEqual({
      sideTotal: 25000,
      debitEntries: 25000,
      creditEntries: 3000,
      balance: 22000,
    });
    expect(tAccountClosing("passive", 12000, [4500], [6000])).toEqual({
      sideTotal: 16500,
      debitEntries: 6000,
      creditEntries: 16500,
      balance: 10500,
    });

    expect(vatFromNet(300, 19)).toEqual({ net: 300, vat: 57, gross: 357 });
    expect(vatFromGross(59.5, 19)).toEqual({ net: 50, vat: 9.5, gross: 59.5 });
    expect(vatFromGross(107, 7)).toEqual({ net: 100, vat: 7, gross: 107 });
    expect(offerPrice(8500, 15, 19)).toEqual({
      listPrice: 8500,
      discount: 1275,
      net: 7225,
      vat: 1372.75,
      gross: 8597.75,
    });
    expect(periodOutcome([68000], [30000, 15000, 6000, 3000])).toMatchObject({
      totalRevenue: 68000,
      totalExpense: 54000,
      result: 14000,
      kind: "profit",
    });
    expect(inventoryDiff(250, 238, 18)).toEqual({
      qtyDiff: -12,
      valueDiff: -216,
      absValueDiff: 216,
      kind: "shortage",
    });
  });
});

describe("labs", () => {
  const witness: Record<LabKind, Record<string, number | string>> = {
    budget: { variable: 640 },
    chart: { yMin: 36 },
    location: { wTraffic: 35, wRent: 35, wStaff: 20, wCust: 10 },
    balance: { uv: 100000, fk: 90000 },
    bilanzChange: { kind: "mehrung", amount: 20000 },
    vat: { net: 500, rate: "19" },
    offerCompare: { rabB: 15 },
    closingFlow: { uefe: 140000 },
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
          const steps = (Number(start[c.id]) - (c.min ?? 0)) / (c.step ?? 1);
          expect(Math.abs(steps - Math.round(steps)), `${kind}.${c.id}`).toBeLessThan(1e-9);
        }
      expect(LESSONS.filter((l) => l.lab === kind)).toHaveLength(1);
    });

  it("does not count shortcuts that violate fixed lab constraints", () => {
    expect(goalReached("budget", { ...LABS.budget.defaults, income: 6000 })).toBe(false);
    expect(goalReached("budget", { ...LABS.budget.defaults, wish: 0, variable: 640 })).toBe(false);
    expect(goalReached("chart", { ...LABS.chart.defaults, valB: 150 })).toBe(false);
    expect(goalReached("location", { ...LABS.location.defaults, wTraffic: 50 })).toBe(false);
    expect(goalReached("balance", { ...LABS.balance.defaults, av: 200000, fk: 50000 })).toBe(false);
    expect(goalReached("vat", { ...LABS.vat.defaults, net: 1000, rate: "7" })).toBe(false);
    expect(goalReached("offerCompare", { ...LABS.offerCompare.defaults, priceB: 6000 })).toBe(false);
    expect(goalReached("closingFlow", { ...LABS.closingFlow.defaults, ekStart: 200000, uefe: 120000 })).toBe(false);
  });
});

describe("strict but usable answer checking", () => {
  it("accepts German/English financial notation and units and rejects off-by-one-cent answers", () => {
    for (const value of ["1.234,50 €", "1,234.50", "1234.50", "1 234,50"])
      expect(numberMatches(value, 1234.5)).toBe(true);
    expect(numberMatches("35.000", 35000)).toBe(true);
    expect(numberMatches("35.000", 35)).toBe(false);
    expect(numberMatches("−216,00 €", -216)).toBe(true);
    expect(numberMatches("−14 Stück", -14)).toBe(true);
    expect(numberMatches("4,75 Punkte", 4.75)).toBe(true);
    expect(numberMatches("69,00 %", 69)).toBe(true);
    expect(numberMatches("1234,51", 1234.5)).toBe(false);
    for (const invalid of ["", "1,2,3", "1.2.3", "NaN", "Infinity", "<script>", "12abc"])
      expect(parseNumbers(invalid)).toEqual([]);
  });

  it("accepts reordered or split bookings with official BwR 7 Kürzel and rejects wrong side, account or cent", () => {
    expect(ACCOUNT_LIST).toHaveLength(23);
    expect(ACCOUNTS["Vorräte"]).toBe("Vorräte an Werkstoffen");
    const expected = [
      { side: "debit" as const, account: "AWR", amount: 1000 },
      { side: "debit" as const, account: "VORST", amount: 190 },
      { side: "credit" as const, account: "VE", amount: 1190 },
    ];
    const actual = [
      { side: "credit", account: "VE", amount: "1.190,00" },
      { side: "debit", account: "VORST", amount: "190" },
      { side: "debit", account: "AWR", amount: "1000,00" },
    ];
    expect(checkBooking(expected, actual)).toBe(true);
    expect(checkBooking(expected, [{ ...actual[0], amount: "1190,01" }, actual[1], actual[2]])).toBe(false);
    expect(
      checkBooking(expected, [actual[0], actual[1], { side: "credit", account: "AWR", amount: "1000" }]),
    ).toBe(false);
  });

  it("keeps cash change nonnegative, closing balance assets nonnegative, and renders fillable invoices", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const receipt = makeExercise("receipt", createRng(seed), 1);
      expect(receipt.fields[0].answer, `receipt:${seed}:total`).toBeGreaterThan(0);
      expect(receipt.fields[1].answer, `receipt:${seed}:change`).toBeGreaterThanOrEqual(0);

      const cmp1 = makeExercise("bilanzCompare", createRng(seed), 1);
      expect(cmp1.prompt, `bilanzCompare:1:${seed}`).not.toContain("−");
      const cmp2 = makeExercise("bilanzCompare", createRng(seed), 2);
      expect(cmp2.prompt, `bilanzCompare:2:${seed}`).not.toContain("−");
      expect(cmp2.fields[0].answer, `bilanzCompare:share0:${seed}`).toBeGreaterThan(0);
      expect(cmp2.fields[0].answer, `bilanzCompare:share0:${seed}`).toBeLessThan(100);
      expect(cmp2.fields[1].answer, `bilanzCompare:share1:${seed}`).toBeGreaterThan(0);
      expect(cmp2.fields[1].answer, `bilanzCompare:share1:${seed}`).toBeLessThan(100);

      for (const lvl of [1, 2] as const) {
        const inv = makeExercise("inventar", createRng(seed), lvl);
        expect(inv.fields[2].answer, `inventar:${lvl}:${seed}:ek`).toBeGreaterThan(0);
      }
    }

    for (let seed = 1; seed <= 50; seed++) {
      for (const lvl of [1, 2] as const) {
        const doc = makeExercise("invoiceComplete", createRng(seed), lvl);
        expect(doc.invoice, `invoice:${lvl}:${seed}`).toBeDefined();
        const indices = [
          ...doc.invoice!.rows.flatMap((r) => (r.fieldIndex !== undefined ? [r.fieldIndex] : [])),
          ...doc.invoice!.summary.flatMap((s) => (s.fieldIndex !== undefined ? [s.fieldIndex] : [])),
        ];
        expect(indices, `invoice indices ${lvl}:${seed}`).toEqual(
          doc.fields.map((_, idx) => idx),
        );
      }
    }
  });

  it("creates balanced, solvable, cent-exact tasks across all 24 families, and level 2 changes the task", () => {
    const kinds = [...new Set(LESSONS.flatMap((l) => (l.practice ? [l.practice] : [])))];
    expect(kinds).toHaveLength(24);
    for (const kind of kinds) {
      let differing = 0;
      for (let seed = 1; seed <= 80; seed++) {
        if (makeExercise(kind, createRng(seed), 1).prompt !== makeExercise(kind, createRng(seed), 2).prompt)
          differing++;
        for (const level of [1, 2] as const) {
          const task = makeExercise(kind, createRng(seed), level);
          const where = `${kind}/${level}/${seed}`;
          expect(task.fields.length + task.booking.length, where).toBeGreaterThan(0);
          const values = task.fields.map((f) =>
            f.unit === "Stück" ? String(f.answer) : f.answer.toFixed(2).replace(".", ","),
          );
          const entries = task.booking.map((e) => ({
            ...e,
            amount: e.amount.toFixed(2).replace(".", ","),
          }));
          expect(checkExercise(task, values, entries), where).toBe(true);
          // Also accept decimal point notation.
          expect(
            checkExercise(
              task,
              task.fields.map((f) => (f.unit === "Stück" ? String(f.answer) : f.answer.toFixed(2))),
              entries,
            ),
            where,
          ).toBe(true);
          for (const e of task.booking) {
            expect(ACCOUNTS[e.account], where).toBeDefined();
            expect(e.amount, where).toBeGreaterThan(0);
          }
          const debit = task.booking
            .filter((e) => e.side === "debit")
            .reduce((s, e) => s + Math.round(e.amount * 100), 0);
          const credit = task.booking
            .filter((e) => e.side === "credit")
            .reduce((s, e) => s + Math.round(e.amount * 100), 0);
          expect(debit, where).toBe(credit);
          for (const f of task.fields) {
            expect(Number.isFinite(f.answer), where).toBe(true);
            if (f.unit === "Stück") expect(Number.isInteger(f.answer), where).toBe(true);
          }
          if (values.length)
            expect(
              checkExercise(task, [String(task.fields[0].answer + 1), ...values.slice(1)], entries),
              where,
            ).toBe(false);
          if (entries.length)
            expect(
              checkExercise(
                task,
                values,
                [{ ...entries[0], amount: String(task.booking[0].amount + 0.01) }, ...entries.slice(1)],
              ),
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
      lesson = LESSONS.find((l) => l.id === "gb-umsatzsteuer-rechnen");
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
