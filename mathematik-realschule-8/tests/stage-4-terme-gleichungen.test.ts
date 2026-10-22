import { describe, expect, it } from "vitest";
import { STAGE_TERME_GLEICHUNGEN } from "../src/curriculum/stage-4-terme-gleichungen";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { CLAIMS, probeCounts } from "../src/lab/views-terme-gleichungen";
import type { DifficultyLevel, ExerciseTask } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";

const IDS = ["tg-1-terme", "tg-2-ausmultiplizieren", "tg-3-binomische-formeln"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-4:${i}`));
/** Points at which two polynomials of degree ≤ 3 that agree are equal. */
const XS = [-2, -1, 0.5, 2, 3];

const lesson = (id: string) => {
  const found = STAGE_TERME_GLEICHUNGEN.lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};

function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "number") throw new Error(`field ${index} of ${task.prompt} is no number`);
  return field.answer;
}

function choice(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field.correctIndex;
}

const meta = (task: ExerciseTask) => task.meta ?? {};

function close(x: number, y: number, rel = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(rel * Math.max(1, Math.abs(y)));
}

/** The answers of the fields from `from` on, read as coefficients of x², x, 1, evaluated at x. */
const quad = (task: ExerciseTask, x: number, from = 0) => num(task, from) * x * x + num(task, from + 1) * x + num(task, from + 2);

describe("Etappe 4: Terme und Gleichungen", () => {
  it("has its lessons in order, with the stage meta of the package", () => {
    expect(STAGE_TERME_GLEICHUNGEN.id).toBe("stage-4-terme-gleichungen");
    expect(STAGE_TERME_GLEICHUNGEN.stageNumber).toBe(4);
    expect(STAGE_TERME_GLEICHUNGEN.title).toBe("Terme und Gleichungen");
    expect(STAGE_TERME_GLEICHUNGEN.lehrplanLabel).toBe("LB 4 (I) · LB 3 (II/III)");
    expect(STAGE_TERME_GLEICHUNGEN.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_TERME_GLEICHUNGEN.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-4-terme-gleichungen");
      expect(l.title.startsWith(`4.${index + 1} `), l.title).toBe(true);
      expect(l.tracks).toEqual(l.id === "tg-9-ungleichungen" ? ["I"] : ["I", "II_III"]);
      expect(l.lehrplan.startsWith(l.id === "tg-9-ungleichungen" ? "M8 LB 4 (I): " : "M8 LB 4 (I) · M8 LB 3 (II/III): "), l.lehrplan).toBe(true);
    });
  });

  it("uses no word of later grades in its lesson texts", () => {
    for (const l of STAGE_TERME_GLEICHUNGEN.lessons) {
      const plain = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text)].join(" ");
      expect(plain, l.id).not.toMatch(/Parabel|Scheitel|Lösungsformel|Diskriminante|ℝ|Pythagoras/);
    }
  });
});

describe("Labore der Etappe 4", () => {
  it("Einsetzprobe: right Umformungen agree everywhere, every wrong one is exposed somewhere", () => {
    const grid = [-3, -2, -1, 0, 1, 2, 3];
    for (const claim of CLAIMS) {
      const differs = grid.some((x) => grid.some((y) => Math.abs(claim.left(x, y) - claim.rightSide(x, y)) > 1e-9));
      expect(differs, claim.text).toBe(!claim.right);
    }
    expect(CLAIMS.filter((c) => !c.right)).toHaveLength(6);
    expect(probeCounts(0, 0)).toEqual({ exposed: 0, slipped: 6 });
    expect(probeCounts(2, 1)).toEqual({ exposed: 6, slipped: 0 });
    // exactly one slips through only for x = y outside {0, 1}
    for (const x of grid) for (const y of grid) expect(probeCounts(x, y).slipped === 1, `${x}, ${y}`).toBe(x === y && x !== 0 && x !== 1);
  });

  it("Rechteckmodell: the readouts are the product, its expansion and the forgotten strips", () => {
    const lab = lesson("tg-2-ausmultiplizieren").lab;
    const r = computeReadouts(lab, defaultLabValues(lab));
    expect(r.term).toBe("(x + 3)(x + 2)");
    expect(r.expanded).toBe("x² + 5x + 6");
    expect(r.value).toBe(56);
    expect(r.missing).toBe(25);
    for (const values of enumerateLabGrid(lab, 6)) {
      const { x, p, q } = values;
      const readouts = computeReadouts(lab, values);
      close(Number(readouts.value), x * x + (p + q) * x + p * q);
      close(Number(readouts.value) - (x * x + p * q), Number(readouts.missing));
    }
    expect(computeReadouts(lab, { x: 5, p: 3, q: -3 }).expanded).toBe("x² − 9");
  });

  it("Formeln am Quadrat: the left side equals the sum of the pieces in every picture", () => {
    const lab = lesson("tg-3-binomische-formeln").lab;
    for (const values of enumerateLabGrid(lab, 9)) {
      const { a, b, mode } = values;
      const r = computeReadouts(lab, values);
      const right = mode === 0 ? a * a + 2 * a * b + b * b : mode === 1 ? a * a - 2 * a * b + b * b : a * a - b * b;
      close(Number(r.left), right);
    }
    const witness = { ...defaultLabValues(lab), ...GOAL_WITNESSES_STAGE_4["tg-3-binomische-formeln"].dritte };
    expect(computeReadouts(lab, witness).left).toBe(24);
  });
});

describe("Aufgaben der Etappe 4 rechnen richtig", () => {
  it("4.1 like terms: the coefficients are the sums of the like terms", () => {
    for (const task of tasks("tg-1-terme", "zusammenfassen", 1)) {
      const { c1, c2, d1, d2 } = meta(task);
      expect(num(task, 0)).toBe(c1 + c2);
      expect(num(task, 1)).toBe(d1 + d2);
      expect(num(task, 0)).not.toBe(0);
      expect(num(task, 1)).not.toBe(0);
    }
    for (const task of tasks("tg-1-terme", "zusammenfassen", 2)) {
      const { A, B, C, D, f1, f2, t } = meta(task);
      expect(num(task, 0)).toBe(A - C + (t === 0 ? f1 * f2 : 0));
      expect(num(task, 1)).toBe(B - D + (t === 1 ? f1 * f2 : 0));
      // the two factors of the product multiply to the like term they claim
      const m = meta(task);
      const exps = ["a", "b", "x", "y"].map((v) => m[`m1${v}`] + m[`m2${v}`]);
      const pairs = [[[0, 0, 2, 1], [0, 0, 1, 2]], [[2, 1, 0, 0], [1, 2, 0, 0]], [[0, 0, 3, 0], [0, 0, 2, 0]], [[2, 2, 0, 0], [1, 1, 0, 0]], [[0, 0, 1, 1], [0, 0, 2, 0]], [[3, 1, 0, 0], [1, 3, 0, 0]]];
      expect(exps).toEqual(pairs[m.pair][t]);
      for (const v of ["a", "b", "x", "y"]) {
        expect(m[`m1${v}`]).toBeGreaterThanOrEqual(0);
        expect(m[`m2${v}`]).toBeGreaterThanOrEqual(0);
      }
      expect(["a", "b", "x", "y"].some((v) => m[`m1${v}`] > 0) && ["a", "b", "x", "y"].some((v) => m[`m2${v}`] > 0)).toBe(true);
    }
  });

  it("4.1 power laws: products, quotients, powers and cubes, checked at u = 2, w = 3", () => {
    const at = (c: number, e: number, f: number) => c * 2 ** e * 3 ** f;
    for (const task of tasks("tg-1-terme", "potenzgesetze", 1)) {
      const { kind, c1, c2, m1, m2, n1, n2 } = meta(task);
      const value = kind === 0 ? at(c1, m1, n1) * at(c2, m2, n2) : at(c1, m1, n1) / at(c2, m2, n2);
      close(at(num(task, 0), num(task, 1), num(task, 2)), value);
      expect(Number.isInteger(num(task, 0))).toBe(true);
      expect(num(task, 1)).toBeGreaterThanOrEqual(1);
      expect(num(task, 2)).toBeGreaterThanOrEqual(0);
    }
    const kinds = new Set<number>();
    for (const task of tasks("tg-1-terme", "potenzgesetze", 2)) {
      const m = meta(task);
      kinds.add(m.kind);
      let value: number;
      if (m.kind <= 3) value = (at(m.c1, m.m1, m.n1) ** m.k * at(m.c2, m.m2, m.n2)) / at(m.c3, m.m3, m.n3);
      else value = m.kind === 4 ? at(m.c, m.m, m.n) ** 3 : 6 * at(m.c, m.m, m.n) ** 2;
      close(at(num(task, 0), num(task, 1), num(task, 2)), value);
      expect(Number.isInteger(num(task, 0)), task.prompt).toBe(true);
      expect(num(task, 1)).toBeGreaterThanOrEqual(1);
      expect(num(task, 2)).toBeGreaterThanOrEqual(1);
    }
    expect([...kinds].sort()).toEqual([2, 3, 4, 5]);
  });

  it("4.2 products of sums: the coefficients give the product at five points", () => {
    for (const task of tasks("tg-2-ausmultiplizieren", "ausmultiplizieren", 1)) {
      const { a, b, c, d } = meta(task);
      for (const x of XS) close(quad(task, x), (a * x + b) * (c * x + d));
    }
    const kinds = new Set<number>();
    for (const task of tasks("tg-2-ausmultiplizieren", "ausmultiplizieren", 2)) {
      const m = meta(task);
      kinds.add(m.kind);
      for (const x of XS) {
        if (m.kind === 1) {
          expect(num(task, 0)).toBe(6);
          close(num(task, 1) * x ** 3 + num(task, 2) * x * x + num(task, 3) * x + num(task, 4), (m.a * x + m.b) * (x * x + m.c * x + m.d));
        } else if (m.kind === 2) {
          const y = 1.5 - x;
          close(num(task, 0) * x * x + num(task, 1) * x * y + num(task, 2) * y * y, (m.a * x + m.b * y) * (m.c * x + m.d * y));
        } else {
          close(quad(task, x), (x + m.p) * (x + m.q) - (m.r * x + m.s) * (x + m.t));
        }
      }
    }
    expect([...kinds].sort()).toEqual([1, 2, 3]);
  });

  it("4.2 areas: the term and its value fit the rectangle, the change is new minus old", () => {
    for (const task of tasks("tg-2-ausmultiplizieren", "flaeche", 1)) {
      const { a, b, c, d, k } = meta(task);
      for (const x of XS) close(quad(task, x), (a * x + b) * (c * x + d));
      close(num(task, 3), (a * k + b) * (c * k + d));
    }
    for (const task of tasks("tg-2-ausmultiplizieren", "flaeche", 2)) {
      const m = meta(task);
      const change = (x: number) => (m.kind === 1 ? (m.L + x) * (m.B + m.m * x) - m.L * m.B : m.kind === 2 ? (m.L + x) * (m.B - x) - m.L * m.B : (m.s + x) ** 2 - m.s * m.s);
      for (const x of XS) close(num(task, 0) * x * x + num(task, 1) * x, change(x));
      close(num(task, 2), change(m.k));
      if (m.kind === 2) expect(m.B - m.k, "the width stays positive").toBeGreaterThan(0);
      if (m.kind === 1) expect(m.B).toBeLessThan(m.L);
    }
  });

  it("4.3 binomial formulas: the coefficients give the square or product at five points", () => {
    for (const task of tasks("tg-3-binomische-formeln", "binom", 1)) {
      const { kind, p, q } = meta(task);
      for (const x of XS) close(quad(task, x), kind === 0 ? (p * x + q) ** 2 : kind === 1 ? (p * x - q) ** 2 : (p * x + q) * (p * x - q));
    }
    const kinds = new Set<number>();
    for (const task of tasks("tg-3-binomische-formeln", "binom", 2)) {
      const m = meta(task);
      kinds.add(m.kind);
      for (const x of XS) {
        if (m.kind === 3) close(quad(task, x), (m.a * x + m.b) ** 2 - (m.c * x + m.d) * (m.c * x - m.d));
        if (m.kind === 4) {
          const y = 2 - x;
          close(num(task, 0) * x * x + num(task, 1) * x * y + num(task, 2) * y * y, (m.a * x + m.b * y) ** 2);
        }
        if (m.kind === 5) close(quad(task, x), (m.a * x + m.b) ** 2 + (m.a * x - m.b) ** 2);
      }
      if (m.kind === 3) expect(m.a).not.toBe(m.c);
    }
    expect([...kinds].sort()).toEqual([3, 4, 5]);
  });

  it("4.3 gaps and mental arithmetic: the filled formula is true", () => {
    for (const task of tasks("tg-3-binomische-formeln", "luecken", 1)) {
      const m = meta(task);
      if (m.kind === 0) {
        expect(num(task, 0)).toBe(m.k);
        expect(num(task, 1)).toBe(m.k * m.k);
        const s = m.minus ? -1 : 1;
        for (const x of XS) close((x + s * num(task, 0)) ** 2, x * x + s * 2 * m.k * x + num(task, 1));
      } else if (m.kind === 1) {
        expect(Math.abs(m.n - 10 * m.t)).toBe(m.d);
        expect(num(task, 0)).toBe(20 * m.t * m.d);
        expect(num(task, 1)).toBe(m.n * m.n);
      } else {
        expect(num(task, 0)).toBe(m.m * m.n);
        expect(m.m + m.n).toBe(20 * m.t);
      }
    }
    for (const task of tasks("tg-3-binomische-formeln", "luecken", 2)) {
      const m = meta(task);
      if (m.kind === 3) {
        // (□x ± k y)² = p²x² ± □xy + k²y²
        expect(num(task, 0) ** 2).toBe(m.p * m.p);
        expect(num(task, 1)).toBe(2 * num(task, 0) * m.k);
      } else {
        expect(choice(task, 0)).toBe(m.m === m.n ? (m.m > 100 && m.m % 100 < 50 ? 0 : 1) : 2);
        expect(num(task, 1)).toBe(m.m * m.n);
      }
    }
  });
});
