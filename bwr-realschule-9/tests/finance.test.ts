import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  createAttempt,
  revealAttempt,
  skipAttempt,
  submitAttempt,
} from "../src/exercises/attempt";
import {
  checkBooking,
  checkExercise,
  numberMatches,
  parseNumbers,
} from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import {
  claimAmounts,
  depreciation,
  loanSchedule,
  money,
  supplierCredit,
} from "../src/finance";
import { freshProgress, parseProgress } from "../src/storage/progress";

describe("financial consequences", () => {
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
  it("ends January acquisitions in their economic year and uses the rounded annual amount for partial years", () => {
    expect(depreciation(10000, 3, 1).rows).toEqual([
      { year: 1, depreciation: 3333.33, book: 6666.67 },
      { year: 2, depreciation: 3333.33, book: 3333.34 },
      { year: 3, depreciation: 3333.34, book: 0 },
    ]);
    const partial = depreciation(100, 6, 7);
    expect(partial.annual).toBe(16.67);
    expect(partial.rows[0]).toEqual({
      year: 1,
      depreciation: 8.34,
      book: 91.66,
    });
    expect(partial.rows.at(-1)).toEqual({
      year: 7,
      depreciation: 8.31,
      book: 0,
    });
    expect(depreciation(10000, 3, 1, true).rows.at(-1)).toEqual({
      year: 3,
      depreciation: 3332.34,
      book: 1,
    });
  });
  it("uses months including acquisition and conserves the asset's cents", () => {
    const result = depreciation(24000, 4, 10);
    expect(result.rows[0]).toEqual({
      year: 1,
      depreciation: 1500,
      book: 22500,
    });
    expect(result.rows.at(-1)).toEqual({
      year: 5,
      depreciation: 4500,
      book: 0,
    });
    const remembered = depreciation(24000, 4, 10, true);
    expect(remembered.rows.at(-1)?.book).toBe(1);
    for (const cost of [800.01, 1000, 12345.67, 60000])
      for (let years = 1; years <= 15; years++)
        for (let month = 1; month <= 12; month++) {
          const rows = depreciation(cost, years, month).rows;
          expect(rows).toHaveLength(month === 1 ? years : years + 1);
          expect(Math.round(rows.reduce((s, r) => s + r.depreciation, 0) * 100)).toBe(
            Math.round(cost * 100),
          );
          expect(rows.at(-1)?.book).toBe(0);
          expect(rows.every((r) => r.book >= 0 && r.depreciation >= 0)).toBe(true);
        }
    expect(() => depreciation(100, 0, 1)).toThrow();
    expect(() => depreciation(100, 3, 13)).toThrow();
  });
  it("rounds the year-6 interest on 28.60 Euro at 17.5 percent to 5.01 Euro", () => {
    const rows = loanSchedule(100, 17.5, 7, "instalment");
    expect(rows[4].balance).toBe(28.6);
    expect(rows[5].interest).toBe(5.01);
  });
  it("keeps loan balance and payment identities for all three forms, including zero interest", () => {
    const instalment = loanSchedule(20000, 6, 4, "instalment");
    expect(instalment[0]).toEqual({
      year: 1,
      interest: 1200,
      redemption: 5000,
      payment: 6200,
      balance: 15000,
    });
    expect(instalment[1].interest).toBe(900);
    expect(loanSchedule(20000, 6, 4, "fixed").map((r) => r.redemption)).toEqual([
      0, 0, 0, 20000,
    ]);
    const annuity = loanSchedule(20000, 6, 4, "annuity");
    expect(annuity[1].interest).toBeLessThan(annuity[0].interest);
    expect(annuity[1].redemption).toBeGreaterThan(annuity[0].redemption);
    for (const type of ["fixed", "instalment", "annuity"] as const)
      for (const rate of [0, 1.5, 6, 17.5, 30])
        for (const principal of [100, 1000, 12345.67, 20000]) {
          const rows = loanSchedule(principal, rate, 7, type);
          expect(rows.at(-1)?.balance).toBe(0);
          expect(Math.round(rows.reduce((s, r) => s + r.redemption, 0) * 100)).toBe(
            Math.round(principal * 100),
          );
          let balance = principal;
          for (const row of rows) {
            // Independent integer oracle for the listed rates (tenths of a percent).
            expect(Math.round(row.interest * 100)).toBe(
              Math.floor((Math.round(balance * 100) * Math.round(rate * 10) + 500) / 1000),
            );
            expect(Math.round(row.payment * 100)).toBe(
              Math.round(row.interest * 100) + Math.round(row.redemption * 100),
            );
            expect(Math.round(row.balance * 100)).toBe(
              Math.round(balance * 100) - Math.round(row.redemption * 100),
            );
            expect(row.balance).toBeGreaterThanOrEqual(0);
            balance = row.balance;
          }
        }
  });
  it("rounds half-cent supplier interest before calculating the advantage", () => {
    expect(supplierCredit(1500, 2, 7, 30)).toMatchObject({
      saving: 30,
      financed: 1470,
      interest: 8.58,
      advantage: 21.42,
    });
    for (let net = 1000; net <= 8000; net += 100)
      for (let rate = 3; rate <= 9; rate++)
        for (const days of [10, 20, 30, 40]) {
          // Net euros × 98 gives the financed cents after 2% Skonto.
          const interestCents = Math.floor((net * 98 * rate * days + 18000) / 36000);
          const result = supplierCredit(net, 2, rate, days);
          expect(result.interest, `${net}/${rate}/${days}`).toBe(interestCents / 100);
          expect(result.advantage).toBe((net * 2 - interestCents) / 100);
        }
  });
  it("compares only the extra supplier days and exposes an unprofitable alternative", () => {
    expect(supplierCredit(10000, 2, 9, 20)).toMatchObject({
      saving: 200,
      financed: 9800,
      interest: 49,
      advantage: 151,
    });
    expect(supplierCredit(10000, 1, 50, 60).advantage).toBeLessThan(0);
    expect(() => supplierCredit(10000, 2, 9, 0)).toThrow();
  });
  it("separates net loss, gross removal and VAT instead of taxing a risk estimate", () => {
    expect(claimAmounts(17.15, 0, 50)).toEqual({
      net: 17.15,
      expectedLoss: 8.58,
      netLoss: 8.58,
      grossLoss: 8.58,
      taxCorrection: 0,
    });
    expect(claimAmounts(11900, 19, 40)).toEqual({
      net: 10000,
      expectedLoss: 4000,
      netLoss: 4000,
      grossLoss: 4760,
      taxCorrection: 760,
    });
    expect(claimAmounts(1070, 7, 100)).toEqual({
      net: 1000,
      expectedLoss: 1000,
      netLoss: 1000,
      grossLoss: 1070,
      taxCorrection: 70,
    });
    expect(() => claimAmounts(1190, 19, 110)).toThrow();
  });
});
describe("strict but usable answer checking", () => {
  it("accepts the correctly rounded supplier answer and rejects the one-cent error", () => {
    const draws = [15, 7, 2, 10, 3];
    const task = makeExercise(
      "supplier",
      {
        int() {
          const value = draws.shift();
          if (value === undefined) throw new Error("Unerwarteter zusätzlicher Zufallswert");
          return value;
        },
      },
      1,
    );
    expect(task.fields.map((field) => field.answer)).toEqual([30, 8.58, 21.42]);
    expect(checkExercise(task, ["30,00", "8,58", "21,42"], [])).toBe(true);
    expect(checkExercise(task, ["30,00", "8,57", "21,43"], [])).toBe(false);
  });
  it("accepts financial notation and rejects an error of one cent", () => {
    for (const value of ["1.234,50 €", "1,234.50", "1234.50", "1 234,50"])
      expect(numberMatches(value, 1234.5)).toBe(true);
    expect(numberMatches("1.500", 1500)).toBe(true);
    expect(numberMatches("1.500", 1.5)).toBe(true);
    expect(numberMatches("−12,50", -12.5)).toBe(true);
    expect(numberMatches("1234,51", 1234.5)).toBe(false);
    for (const invalid of [
      "",
      "1,2,3",
      "1.2.3",
      "NaN",
      "Infinity",
      "<script>",
      "12abc",
      "1,234,50",
    ])
      expect(parseNumbers(invalid)).toEqual([]);
  });
  it("accepts reordered or split postings, but never a wrong side, extra account or penny", () => {
    const expected = [
      { side: "debit" as const, account: "3001", amount: 1500 },
      { side: "credit" as const, account: "2800", amount: 1500 },
    ];
    const actual = [
      { side: "credit", account: "2800", amount: "1.500" },
      { side: "debit", account: "3001", amount: "1.500,00" },
    ];
    expect(checkBooking(expected, actual)).toBe(true);
    expect(checkBooking(expected, [{ ...actual[0], amount: "1500,01" }, actual[1]])).toBe(
      false,
    );
    expect(
      checkBooking(
        expected,
        actual.map((x) => ({ ...x, side: "debit" })),
      ),
    ).toBe(false);
    expect(
      checkBooking(expected, [...actual, { side: "debit", account: "7510", amount: "1" }]),
    ).toBe(false);
    expect(
      checkBooking(expected, [
        actual[0],
        { ...actual[1], amount: "1.000" },
        { ...actual[1], amount: "500" },
      ]),
    ).toBe(true);
  });
  it("creates balanced, solvable and cent-exact tasks across 30 exercise families", () => {
    const kinds = [...new Set(LESSONS.flatMap((l) => (l.practice ? [l.practice] : [])))];
    expect(kinds).toHaveLength(30);
    for (const kind of kinds)
      for (const level of [1, 2] as const)
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          const values = task.fields.map((f) => f.answer.toFixed(2).replace(".", ","));
          const entries = task.booking.map((e) => ({
            ...e,
            amount: e.amount.toFixed(2).replace(".", ","),
          }));
          expect(checkExercise(task, values, entries), `${kind}/${level}/${seed}`).toBe(true);
          const debit = task.booking
            .filter((e) => e.side === "debit")
            .reduce((s, e) => s + Math.round(e.amount * 100), 0);
          const credit = task.booking
            .filter((e) => e.side === "credit")
            .reduce((s, e) => s + Math.round(e.amount * 100), 0);
          expect(debit).toBe(credit);
          if (values.length)
            expect(
              checkExercise(
                task,
                [String(task.fields[0].answer + 1), ...values.slice(1)],
                entries,
              ),
            ).toBe(false);
          if (entries.length)
            expect(
              checkExercise(task, values, [
                { ...entries[0], amount: String(task.booking[0].amount + 1) },
                ...entries.slice(1),
              ]),
            ).toBe(false);
        }
  });
  it("never counts a shown answer, a repeated submit, or a reloaded solved task twice", () => {
    const p = freshProgress(),
      lesson = LESSONS.find((l) => l.id === "an-linear");
    if (!lesson) throw new Error("Anker der Rechenlektion fehlt");
    const a = createAttempt(p, lesson, 1);
    revealAttempt(p, a);
    expect(
      submitAttempt(
        p,
        a,
        a.task.fields.map((f) => String(f.answer)),
        [],
      ),
    ).toBe(false);
    expect(p.solved[a.key] ?? 0).toBe(0);
    const recovered = parseProgress(JSON.stringify(p));
    expect(recovered.serial[a.key]).toBe(1);
    const next = createAttempt(recovered, lesson, 1);
    expect(next.task).not.toEqual(a.task);
    expect(
      submitAttempt(
        recovered,
        next,
        next.task.fields.map((f) => String(f.answer)),
        [],
      ),
    ).toBe(true);
    expect(
      submitAttempt(
        recovered,
        next,
        next.task.fields.map((f) => String(f.answer)),
        [],
      ),
    ).toBe(false);
    expect(recovered.solved[next.key]).toBe(1);
    skipAttempt(recovered, next);
    expect(recovered.serial[next.key]).toBe(2);
  });
});
