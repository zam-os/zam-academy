import { describe, expect, it } from "vitest";
import { STAGE_TERME_GLEICHUNGEN } from "../src/curriculum/stage-4-terme-gleichungen";
import { checkTask, wrongAnswerHint } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import {
  CLAIMS,
  completedSquare,
  equationCase,
  equationSolutionSet,
  EXTREMUM_MODELS,
  inequalitySolution,
  probeCounts,
  rectChange,
  satisfies,
  termValue,
  tileFit,
} from "../src/lab/views-terme-gleichungen";
import type { DifficultyLevel, ExerciseTask } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";

const IDS = ["tg-1-terme", "tg-2-ausmultiplizieren", "tg-3-binomische-formeln", "tg-4-faktorisieren", "tg-5-extremwerte", "tg-6-extremwertprobleme", "tg-7-gleichungen", "tg-8-sachaufgaben", "tg-9-ungleichungen"];
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

  it("Rechteckmodell: no label of the rectangle touches a handle dot, also at small x", () => {
    const lab = lesson("tg-2-ausmultiplizieren").lab;
    const view = labView("expand-products");
    let checked = 0;
    for (const x of [1, 1.5, 2, 2.5, 3, 4, 5, 7]) {
      for (const p of [1, 2, 3, 5]) {
        for (const q of [-4, -3, -2, -1, 0, 1, 2, 5]) {
          const values = { ...defaultLabValues(lab), x, p, q };
          const svg = view.render(values, computeReadouts(lab, values));
          // the dots: radius 7.5 and a ring of 2.5
          const dots = [...svg.matchAll(/data-handle="[^"]+"[^>]*>\s*<circle cx="([-\d.]+)" cy="([-\d.]+)"/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
          expect(dots.length).toBeGreaterThanOrEqual(2);
          // the labels left of the table (13 px type: about 7 px a character, 9 px high above the baseline)
          for (const m of svg.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)" class="[^"]*" text-anchor="(start|middle|end)">([^<]*)<\/text>/g)) {
            const tx = Number(m[1]);
            const ty = Number(m[2]);
            if (tx > 312 || ty < 40) continue;
            const width = 6.6 * [...m[4]].length;
            const left = m[3] === "start" ? tx : m[3] === "end" ? tx - width : tx - width / 2;
            for (const d of dots) {
              const apart = d.x < left - 10 || d.x > left + width + 10 || d.y < ty - 9 - 10 || d.y > ty + 10;
              expect(apart, `"${m[4]}" at (${tx} | ${ty}) under the handle at (${d.x} | ${d.y}) for x = ${x}, p = ${p}, q = ${q}`).toBe(true);
              checked++;
            }
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(1000);
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

  it("Quadrate legen: a fitting tile set is the claimed square, and every square tile set fits", () => {
    for (const A of [1, 2, 3, 4, 9]) {
      for (let B = 0; B <= 36; B++) {
        for (let C = 0; C <= 36; C++) {
          const fit = tileFit(A, B, C);
          if (!fit.ok) continue;
          const k = fit.k ?? 0;
          for (const x of XS) close(A * x * x + B * x + C, fit.groups * (fit.s * x + k) ** 2);
        }
      }
    }
    // every (sx + k)² and g(x + k)² inside the slider ranges is recognised
    for (const s of [1, 2, 3]) for (let k = 0; 2 * s * k <= 36 && k * k <= 36; k++) expect(tileFit(s * s, 2 * s * k, k * k).ok).toBe(true);
    for (const g of [2, 3]) for (let k = 0; 2 * g * k <= 36 && g * k * k <= 36; k++) expect(tileFit(g, 2 * g * k, g * k * k).ok).toBe(true);
    expect(tileFit(1, 6, 4)).toMatchObject({ ok: false, k: 3, need: 9 });
    expect(tileFit(4, 6, 4).k).toBeNull();
  });

  it("Das Quadrat entscheidet: T(d) = e is the smallest (a > 0) or greatest (a < 0) value on the grid", () => {
    const lab = lesson("tg-5-extremwerte").lab;
    for (const values of enumerateLabGrid(lab, 4)) {
      const { d, e } = completedSquare(values);
      close(termValue(values, d), e);
      for (const x of [-6, -2.5, 0, 1.5, 6]) {
        const T = termValue(values, x);
        if (values.a > 0) expect(T).toBeGreaterThanOrEqual(e - 1e-9);
        else expect(T).toBeLessThanOrEqual(e + 1e-9);
        close(termValue(values, 2 * d - x), T);
      }
    }
    const r = computeReadouts(lab, defaultLabValues(lab));
    expect(r.form).toBe("T(x) = (x − 3)² + 5");
    expect(r.value).toBe(14);
  });

  it("Das beste Rechteck: every model reaches its stated extreme value at the stated x", () => {
    for (const model of EXTREMUM_MODELS) {
      close(model.area(model.xBest), model.best);
      for (let i = 1; i < 400; i++) {
        const x = (model.upper * i) / 400;
        if (model.max) expect(model.area(x)).toBeLessThanOrEqual(model.best + 1e-9);
        else expect(model.area(x)).toBeGreaterThanOrEqual(model.best - 1e-9);
        expect(model.area(x), "the figure exists inside ]0; upper[").toBeGreaterThan(0);
      }
      expect(model.steps[model.steps.length - 1]).toContain(String(model.best).replace(".", ","));
    }
    expect(EXTREMUM_MODELS[0].area(1)).toBe(49);
    expect(EXTREMUM_MODELS[0].area(4.5)).toBe(49);
  });
});

/** The largest value of f on a fine grid of ]0; upper[, and where it is. */
function scan(f: (x: number) => number, upper: number, max = true): { x: number; y: number } {
  let best = { x: 0, y: max ? -Infinity : Infinity };
  for (let i = 1; i < 4000; i++) {
    const x = (upper * i) / 4000;
    const y = f(x);
    if (max ? y > best.y : y < best.y) best = { x, y };
  }
  return best;
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

describe("Aufgaben der Etappe 4 rechnen richtig (4.4 bis 4.6)", () => {
  it("4.4 ausklammern: the factor is the gcd with the smallest exponents", () => {
    for (const task of tasks("tg-4-faktorisieren", "ausklammern", 1)) {
      const m = meta(task);
      const n = m.terms;
      const cs = Array.from({ length: n }, (_, i) => m[`c${i}`]);
      const us = Array.from({ length: n }, (_, i) => m[`u${i}`]);
      const ws = Array.from({ length: n }, (_, i) => m[`w${i}`]);
      expect(num(task, 0)).toBe(cs.reduce(gcd));
      expect(num(task, 1)).toBe(Math.min(...us));
      expect(num(task, 2)).toBe(Math.min(...ws));
      expect(num(task, 1) + num(task, 2)).toBeGreaterThan(0);
    }
    for (const task of tasks("tg-4-faktorisieren", "ausklammern", 2)) {
      const m = meta(task);
      const g = num(task, 0);
      const e = num(task, 1);
      const k = num(task, 3);
      const kind = choice(task, 2);
      expect([kind, g, k, e]).toEqual([m.kind, m.g, m.k, m.withX]);
      // the factorisation equals the shown term, and nothing more can be taken out
      for (const x of XS) {
        const product = g * x ** e * (kind === 0 ? (x + k) ** 2 : kind === 1 ? (x - k) ** 2 : (x + k) * (x - k));
        close(product, m.t3 * x ** 3 + m.t2 * x * x + m.t1 * x + m.t0);
      }
      expect([m.t3, m.t2, m.t1, m.t0].filter((c) => c !== 0).reduce(gcd)).toBe(g);
      expect([4, 9]).not.toContain(g);
    }
  });

  it("4.4 binomial formulas backwards: the factors give the term, and a claimed square is judged right", () => {
    for (const task of tasks("tg-4-faktorisieren", "rueckwaerts", 1)) {
      const { kind, p, q } = meta(task);
      expect([num(task, 0), num(task, 1)]).toEqual([p, q]);
      expect(gcd(p, q)).toBe(1);
      for (const x of XS) {
        const term = kind === 0 ? p * p * x * x + 2 * p * q * x + q * q : kind === 1 ? p * p * x * x - 2 * p * q * x + q * q : p * p * x * x - q * q;
        const product = kind === 0 ? (p * x + q) ** 2 : kind === 1 ? (p * x - q) ** 2 : (p * x + q) * (p * x - q);
        close(product, term);
      }
    }
    const seen = [0, 0, 0];
    for (const task of tasks("tg-4-faktorisieren", "rueckwaerts", 2)) {
      const { variant, p, q, mid, last, askLast, minus } = meta(task);
      seen[variant] += 1;
      const isSquare = mid === 2 * p * q && last === q * q;
      expect(choice(task, 0)).toBe(isSquare ? 0 : 1);
      expect(isSquare).toBe(variant === 0);
      // the number in front of x carries the sign of the term: 49x² − 112x + 64 needs −112
      expect(task.given[0].includes(" − "), task.prompt).toBe(minus === 1);
      expect(num(task, 1)).toBe(askLast ? q * q : minus ? -2 * p * q : 2 * p * q);
      if (!askLast && minus) {
        const field = task.fields[1];
        if (field.kind !== "number") throw new Error("number field");
        expect(field.slips?.find((s) => s.value === 2 * p * q)?.hint, task.prompt).toMatch(/Minus/);
        expect(task.steps[1]).toContain(`= −${2 * p * q}x`);
      }
      // only the asked summand is wrong
      if (!isSquare) expect(askLast ? mid === 2 * p * q : last === q * q).toBe(true);
    }
    expect(seen.every((n) => n > 20), `${seen}`).toBe(true);
  });

  it("4.5 extreme values: T(d) = e, the kind follows the sign of a, and the term really turns there", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-5-extremwerte", "extremwert", level)) {
        const { a, b, c, d, e, context } = meta(task);
        const T = (x: number) => a * x * x + b * x + c;
        const offset = context ? 0 : 1;
        if (!context) expect(choice(task, 0)).toBe(a > 0 ? 0 : 1);
        close(num(task, offset), -b / (2 * a));
        close(num(task, offset + 1), T(num(task, offset)));
        for (const h of [0.5, 1, 3]) {
          if (a > 0) expect(T(d + h)).toBeGreaterThan(e);
          else expect(T(d - h)).toBeLessThan(e);
        }
        if (level === 1) expect(Math.abs(a)).toBe(1);
        // a = ±1 is Level 1: Level 2 always has a factor to take out first
        else if (!context) expect(Math.abs(a)).not.toBe(1);
        if (context) {
          expect(d).toBeGreaterThan(0);
          expect(e).toBeGreaterThan(0);
          expect(a).toBeLessThan(0);
          // a school company: without sales a loss of 100 € to 2.000 €, at best a profit below 4.000 €
          expect(c, task.prompt).toBeLessThanOrEqual(-1);
          expect(c, task.prompt).toBeGreaterThanOrEqual(-20);
          expect(e, task.prompt).toBeLessThan(40);
        }
      }
    }
  });

  it("4.5 parameter: with the c found, the extreme value is the one asked for", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-5-extremwerte", "parameter", level)) {
        const { a, b, d, m } = meta(task);
        const c = num(task, 0);
        close(num(task, 1), -b / (2 * a));
        close(a * d * d + b * d + c, m);
        close(c - (b * b) / (4 * a), m);
      }
    }
  });

  it("4.6 rectangles: the maximum (or the inner square's minimum) is where the tasks say", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-6-extremwertprobleme", "rechteck", level)) {
        const m = meta(task);
        if (m.inner) {
          const f = (x: number) => m.s * m.s - 2 * x * (m.s - x);
          const best = scan(f, m.s, false);
          expect(num(task, 0)).toBe(m.s);
          close(num(task, 1), m.s / 2);
          expect(Math.abs(best.x - num(task, 1))).toBeLessThan(m.s / 1000);
          close(num(task, 2), f(num(task, 1)));
          continue;
        }
        const f = (x: number) => (m.L - x) * (m.B + m.k * x);
        const best = scan(f, m.L);
        const xi = level === 1 ? 0 : 1;
        if (level === 2) expect(num(task, 0)).toBe(m.L);
        expect(Math.abs(best.x - num(task, xi))).toBeLessThan(m.L / 1000);
        close(num(task, xi + 1), f(num(task, xi)));
        expect(num(task, xi)).toBeGreaterThan(0);
        expect(num(task, xi)).toBeLessThan(m.L);
        expect(m.B).toBeLessThan(m.L);
      }
    }
  });

  it("4.6 fences: the largest enclosure for a wall, a free rectangle and a divider", () => {
    for (const level of [1, 2] as const) {
      const kinds = new Set<number>();
      for (const task of tasks("tg-6-extremwertprobleme", "zaun", level)) {
        const m = meta(task);
        kinds.add(m.kind);
        const [f, upper] =
          m.kind === 0 ? [(x: number) => x * (m.L - 2 * x), m.L / 2] : m.kind === 1 ? [(x: number) => x * (m.U / 2 - x), m.U / 2] : [(x: number) => x * (m.L - 3 * x), m.L / 3];
        const xi = level === 1 ? 0 : 1;
        if (level === 2) close(num(task, 0), upper);
        const best = scan(f, upper);
        expect(Math.abs(best.x - num(task, xi))).toBeLessThan(upper / 1000);
        close(num(task, xi + 1), f(num(task, xi)));
        expect(Number.isInteger(num(task, xi + 1))).toBe(true);
      }
      expect(kinds.size).toBe(level === 1 ? 2 : 3);
    }
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

const holdsRel = (left: number, rel: number, right: number) =>
  rel === 0 ? left < right - 1e-9 : rel === 1 ? left <= right + 1e-9 : rel === 2 ? left > right + 1e-9 : left >= right - 1e-9;
const isWhole = (x: number) => Math.abs(x - Math.round(x)) < 1e-9;
const endsAfterTwoDecimals = (x: number) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;

describe("Labore der Etappe 4 (4.7 bis 4.9)", () => {
  it("Gleichungsbaukasten: the reduced form A · x = B is the equation, and L follows G", () => {
    const lab = lesson("tg-7-gleichungen").lab;
    for (const values of enumerateLabGrid(lab, 4)) {
      const { p, q, r, k, G } = values;
      const c = equationCase(values);
      for (const x of [0, 1, 2.5]) close((x + p) ** 2 - (x + q) * (x + r) - k, c.A * x - c.B);
      const set = equationSolutionSet(values);
      if (c.kind === 1) expect(set).toBe("L = { }");
      if (c.kind === 2) expect(set).toBe(`L = ${["ℚ", "ℤ", "ℕ"][G]}`);
      if (c.kind === 0) {
        const allowed = G === 0 || (isWhole(c.x0) && (G === 1 || c.x0 >= 1));
        expect(set === "L = { }").toBe(!allowed);
      }
    }
    const r = computeReadouts(lab, defaultLabValues(lab));
    expect(r.reduced).toBe("3x = −7");
    expect(r.set).toBe("L = {−7/3}");
  });

  it("Gleicher Flächeninhalt: the change of area is (m − n)x + m(d − n)", () => {
    const lab = lesson("tg-8-sachaufgaben").lab;
    for (const values of enumerateLabGrid(lab, 4)) {
      const { x, d, m, n } = values;
      const rc = rectChange(values);
      close(rc.diff, (m - n) * x + m * (d - n));
      close(rc.diff, rc.added - rc.removed);
    }
    expect(computeReadouts(lab, defaultLabValues(lab)).diff).toBe("+4 cm²");
  });

  it("Ungleichungen am Zahlenstrahl: the solution set holds exactly the test values that satisfy the inequality", () => {
    const lab = lesson("tg-9-ungleichungen").lab;
    for (const values of enumerateLabGrid(lab, 3)) {
      const sol = inequalitySolution(values);
      for (let t = -8; t <= 8; t += 0.5) {
        const inSet = sol.kind === "all" ? true : sol.kind === "none" ? false : holdsRel(t, sol.rel, sol.g);
        expect(satisfies(values, t), JSON.stringify({ ...values, t })).toBe(inSet);
      }
      if (values.a < 0 && sol.kind === "bound") expect(sol.rel).not.toBe(values.rel);
    }
    const witness = { ...defaultLabValues(lab), ...GOAL_WITNESSES_STAGE_4["tg-9-ungleichungen"].umkehr };
    expect(computeReadouts(lab, witness).set).toBe("L = ]−∞; −4]");
  });
});

describe("Aufgaben der Etappe 4 rechnen richtig (4.7 bis 4.9)", () => {
  it("4.7 equations: the solution solves the equation as printed, and the Grundmenge is honoured", () => {
    for (const task of tasks("tg-7-gleichungen", "gleichung", 1)) {
      const { s, p, q, r, k, x0 } = meta(task);
      const left = (x: number) => s * ((x + p) ** 2 - (x + q) * (x + r));
      close(left(x0), k);
      for (const x of XS) close(left(x), num(task, 0) * x + num(task, 1));
      expect(num(task, 0)).not.toBe(0);
      close(num(task, 2), x0);
      expect(endsAfterTwoDecimals(x0)).toBe(true);
    }
    const variants = new Set<number>();
    for (const task of tasks("tg-7-gleichungen", "gleichung", 2)) {
      const m = meta(task);
      variants.add(m.variant);
      if (m.variant === 1) close((m.a * m.x0 + m.p) ** 2, (m.a * m.x0 - m.q) ** 2 + m.k);
      if (m.variant === 2) close((m.a * m.x0 + m.p) ** 2 - (m.a * m.x0 + m.q) * (m.a * m.x0 - m.q), m.k);
      if (m.variant === 3) {
        close((m.x0 + m.p) ** 2 - (m.x0 + m.q) * (m.x0 + m.r), m.k);
        const allowed = isWhole(m.x0) && (m.G === 1 || m.x0 >= 1);
        expect(choice(task, 1)).toBe(allowed ? 0 : 1);
      }
      close(num(task, 0), m.x0);
      expect(endsAfterTwoDecimals(m.x0)).toBe(true);
    }
    expect([...variants].sort()).toEqual([1, 2, 3]);
  });

  it("4.7 solution cases: a and b are the reduced form, and the case follows from them", () => {
    const seen = [0, 0, 0];
    for (const task of tasks("tg-7-gleichungen", "loesungsfall", 1)) {
      const m = meta(task);
      const reduced = (x: number) => (m.tpl === 0 ? (x + m.p) ** 2 - (x + m.q) * (x + m.r) - m.k : m.m * (m.a * x + m.b) - m.n * (m.c * x + m.d) - (m.e * x + m.f));
      for (const x of XS) close(reduced(x), num(task, 0) * x - num(task, 1));
      const [A, B] = [num(task, 0), num(task, 1)];
      const kind = A !== 0 ? 0 : B !== 0 ? 1 : 2;
      expect(choice(task, 2)).toBe(kind);
      seen[kind] += 1;
    }
    expect(seen.every((n) => n > 30), `${seen}`).toBe(true);
    for (const task of tasks("tg-7-gleichungen", "loesungsfall", 2)) {
      const m = meta(task);
      const k = num(task, 0);
      const left = (x: number) => (x + m.p) ** 2 - (x + m.q) * (x + k);
      if (m.variant === 0) {
        close(left(0), left(3));
        expect(Math.abs(left(0) - m.c)).toBeGreaterThan(1e-9);
      } else if (m.variant === 1) {
        for (const x of XS) close(left(x), num(task, 1));
      } else {
        close(left(m.x1), m.c);
        expect(Math.abs(left(m.x1 + 1) - left(m.x1))).toBeGreaterThan(1e-9);
        // k is determined: another k would not give the solution x1 (for x1 = −q every k would)
        expect(m.x1 + m.q, task.prompt).not.toBe(0);
        const other = (x: number) => (x + m.p) ** 2 - (x + m.q) * (x + k + 1);
        expect(Math.abs(other(m.x1) - m.c)).toBeGreaterThan(1e-9);
      }
      expect(m.p, "no common factor (x + p) on both sides").not.toBe(m.q);
    }
  });

  it("4.7 solution cases: only adding and subtracting, so exactly one pair (a, b) is right, and 6x = 22 → 3x = 11 or −8x = 24 → 8x = −24 get a hint", () => {
    let flipped = 0;
    let divided = 0;
    for (const task of tasks("tg-7-gleichungen", "loesungsfall", 1)) {
      // the instruction rules out the equivalent forms the fields cannot accept
      expect(task.prompt).toContain("nur durch Ausmultiplizieren, Zusammenfassen, Addieren und Subtrahieren");
      expect(task.prompt).toContain("ohne zu multiplizieren oder zu teilen");
      const [A, B] = [num(task, 0), num(task, 1)];
      // the pair of adding and subtracting, recomputed: x-terms of the right side subtracted, numbers of the left side subtracted
      const m = meta(task);
      if (m.tpl === 0) expect([A, B]).toEqual([2 * m.p - m.q - m.r, m.k - (m.p * m.p - m.q * m.r)]);
      else expect([A, B]).toEqual([m.m * m.a - m.n * m.c - m.e, m.f - (m.m * m.b - m.n * m.d)]);
      const typed = (a: number, b: number) => [String(a).replace("-", "−"), String(b).replace("-", "−"), String(choice(task, 2))];
      expect(checkTask(task, typed(A, B)).status).toBe("correct");
      if (A !== 0) {
        const result = checkTask(task, typed(-A, -B));
        expect(result.status).toBe("wrong");
        expect(wrongAnswerHint(task, result), task.prompt).toMatch(/mit −1 multiplizieren|Minus|Vorzeichen/);
        flipped += 1;
      }
      let [g, h] = [Math.abs(A), Math.abs(B)];
      while (h) [g, h] = [h, g % h];
      if (A !== 0 && g > 1) {
        const result = checkTask(task, typed(A / g, B / g));
        expect(result.status).toBe("wrong");
        expect(wrongAnswerHint(task, result), task.prompt).toMatch(/Nicht teilen|Minus|Vorzeichen/);
        divided += 1;
      }
      // a · x = b and its solution once, never the same line twice
      for (let i = 1; i < task.steps.length; i++) expect(task.steps[i], task.prompt).not.toBe(task.steps[i - 1]);
    }
    expect(flipped).toBeGreaterThan(40);
    expect(divided).toBeGreaterThan(10);
  });

  it("4.7 equations: no step repeats the line before it (x = 4 twice, or 12x = 6 before 12x = 6 | : 12)", () => {
    for (const generator of ["gleichung", "loesungsfall"])
      for (const level of [1, 2] as const)
        for (const task of tasks("tg-7-gleichungen", generator, level)) {
          const lines = task.steps.map((s) => s.replace(/<[^>]+>/g, "").replace(/\s+\|.*$/, "").replace(/^.*: /, ""));
          // equations only: the result line may name the case again („…: keine Lösung“)
          for (let i = 1; i < lines.length; i++) if (lines[i].includes("=")) expect(lines[i], `${task.prompt}\n${task.steps.join("\n")}`).not.toBe(lines[i - 1]);
        }
  });

  it("4.7 equations: the minus-bracket slip is the value that slip really gives", () => {
    for (const task of tasks("tg-7-gleichungen", "gleichung", 1)) {
      const { s, p, q, r } = meta(task);
      // turning only the x² term of the bracket behind the minus
      const wrong = (x: number) => (s === 1 ? (x + p) ** 2 - x * x + (q + r) * x + q * r : (x + q) * (x + r) - x * x + 2 * p * x + p * p);
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("field 0");
      for (const slip of field.slips ?? []) close(slip.value, wrong(1) - wrong(0));
      expect(q, "no product of two equal brackets").not.toBe(r);
    }
  });

  it("4.8 geometry: the rectangle and the square fit the text", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-8-sachaufgaben", "geometrie", level)) {
        const m = meta(task);
        if (m.kind === 0) {
          close(m.x * (m.x + m.d), (m.x + m.m) * (m.x + m.d - m.n));
          expect(m.x + m.d - m.n).toBeGreaterThan(0);
          expect([num(task, 0), num(task, 1)]).toEqual([m.x, m.x + m.d]);
          if (level === 2) expect(num(task, 2)).toBe(m.x * (m.x + m.d));
        } else {
          close((m.x + m.a) * (m.x - m.b), m.x * m.x - m.c);
          expect(m.x).toBeGreaterThan(m.b);
          expect(m.c).not.toBe(0);
          expect([num(task, 0), num(task, 1)]).toEqual([m.x, m.x * m.x]);
        }
      }
    }
  });

  it("4.8 numbers, ages, motion, mixtures and prices: the answers solve the text", () => {
    const contexts = new Set<number>();
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-8-sachaufgaben", "zahlen", level)) {
        const m = meta(task);
        contexts.add(m.context);
        if (m.context === 0) {
          close(m.x * (m.x + m.d), m.x * m.x + m.c);
          expect([num(task, 0), num(task, 1)]).toEqual([m.x, m.x + m.d]);
        } else if (m.context === 5) {
          close(m.x * (m.x + m.d), (m.x - m.e) ** 2 + m.c);
          expect(m.x).toBeGreaterThan(m.e);
          expect(num(task, 0)).toBe(m.x);
        } else if (m.context === 1) {
          close((m.x + m.t) * (m.x + m.d + m.t) - m.x * (m.x + m.d), m.P);
          expect([num(task, 0), num(task, 1)]).toEqual([m.x, m.x + m.d]);
        } else if (m.context === 2) {
          close(m.v1 * m.t, m.v2 * (m.t - m.delta));
          expect(m.t).toBeGreaterThan(m.delta);
          close(num(task, 0), m.t);
          close(num(task, 1), m.v1 * m.t);
        } else if (m.context === 3) {
          close(m.p1 * m.m1 + m.p2 * m.x, m.p * (m.m1 + m.x));
          expect(m.p1).toBeLessThan(m.p);
          expect(m.p).toBeLessThan(m.p2);
          close(num(task, 0), m.x);
          close(num(task, 1), m.m1 + m.x);
          // the Probe with the exact amounts: 0,25 l + 0,875 l = 1,125 l, and 1,125 : 2,25 really is 50 %
          const probe = task.steps.find((s) => s.startsWith("Probe am Text"))!;
          const read = (t: string) => Number(t.replace(/\./g, "").replace(",", "."));
          const [, f1, f2, sum, mix, share, pct] = /Frucht ([\d,]+) l \+ ([\d,]+) l = ([\d,]+) l in ([\d,]+) l Getränk; [\d,]+ : [\d,]+ = ([\d,]+) = (\d+) %/.exec(probe)!;
          close(read(f1), (m.p1 * m.m1) / 100);
          close(read(f2), (m.p2 * m.x) / 100);
          close(read(sum), read(f1) + read(f2));
          close(read(mix), m.m1 + m.x);
          close(read(sum) / read(mix), read(share));
          expect(Number(pct)).toBe(m.p);
        } else {
          expect(m.PA * (m.N - m.kids) + m.PK * m.kids).toBe(m.T);
          expect(m.kids).toBeGreaterThanOrEqual(1);
          expect(m.kids).toBeLessThan(m.N);
          expect([num(task, 0), num(task, 1)]).toEqual([m.kids, m.N - m.kids]);
        }
        for (const field of task.fields) if (field.kind === "number") expect(field.answer).toBeGreaterThan(0);
      }
    }
    expect([...contexts].sort()).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("4.8 writes its steps once and without „1x“: no line repeats the one before, no „x = 16, also x = 16“", () => {
    for (const generator of ["geometrie", "zahlen"])
      for (const level of [1, 2] as const)
        for (const task of tasks("tg-8-sachaufgaben", generator, level)) {
          const text = task.steps.map((s) => s.replace(/<[^>]+>/g, ""));
          for (const line of text) {
            expect(line, task.prompt).not.toMatch(/(^|[^\d,])1x/);
            const twice = /(x = [−\d,]+), also \1(?![\d,])/.exec(line);
            expect(twice, line).toBeNull();
          }
          // the solution is not written again at the start of the next line
          for (let i = 1; i < text.length; i++) {
            const solved = /(?:^|: )(x = [−\d,]+)$/.exec(text[i - 1]);
            if (solved) expect(text[i].startsWith(solved[1]), `${text[i - 1]} / ${text[i]}`).toBe(false);
          }
        }
  });

  it("4.9 inequalities: the stated solution set is exactly where the inequality holds", () => {
    for (const task of tasks("tg-9-ungleichungen", "ungleichung", 1)) {
      const { m, n, e, p, q, f, rel, g } = meta(task);
      const solved = choice(task, 1);
      close(num(task, 0), g);
      const ok = (x: number) => holdsRel(m * (x + p) - n * (x + q), rel, e * x + f);
      for (const x of [g - 2, g - 0.5, g, g + 0.5, g + 2]) expect(ok(x), `${task.prompt} at ${x}`).toBe(holdsRel(x, solved, g));
    }
    for (const task of tasks("tg-9-ungleichungen", "ungleichung", 2)) {
      const { p, q, r, k, rel, g, edge } = meta(task);
      const solved = choice(task, 0);
      close(num(task, 1), g);
      const ok = (x: number) => holdsRel((x - p) ** 2, rel, (x + q) * (x - r) + k);
      for (const x of [g - 2, g - 0.5, g, g + 0.5, g + 2]) expect(ok(x), `${task.prompt} at ${x}`).toBe(holdsRel(x, solved, g));
      expect(num(task, 2)).toBe(edge);
      expect(ok(edge)).toBe(true);
      expect(ok(edge + (solved >= 2 ? -1 : 1)), "the next whole number outward is outside L").toBe(false);
    }
  });

  it("4.9 word problems: the whole-number answer is the last (first) one that satisfies the condition", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tg-9-ungleichungen", "sachaufgabe", level)) {
        const m = meta(task);
        // a boundary like 12,5 ends and gets no "…"; one like 55,55… is cut, never rounded up
        const bound = task.steps.map((step) => step.match(/x (?:≤|≥|&gt;) ([\d.,]+)(…?)$/)).find(Boolean);
        expect(bound, task.steps.join(" ")).not.toBeNull();
        const shown = Number((bound?.[1] ?? "").replace(/\./g, "").replace(",", "."));
        const exactBound =
          m.kind === 0 ? (m.budget - m.base) / m.perMin
          : m.kind === 1 ? (m.target - m.bonus) / m.wage
          : m.kind === 2 ? (m.baseB - m.baseA) / (m.perA - m.perB)
          : m.kind === 4 ? (m.joinB - m.joinA) / (m.perA - m.perB)
          : m.season / (m.single - m.perVisit);
        // Level 1 has one grade-8 variant with x on both sides; the two others are marked as M7 Wiederholung.
        if (level === 1) expect(m.kind === 4 || task.prompt.startsWith("Wiederholung aus M7: "), task.prompt).toBe(true);
        const ends = endsAfterTwoDecimals(exactBound);
        expect(bound?.[2] === "…", task.steps.join(" ")).toBe(!ends);
        if (ends) close(shown, exactBound);
        else expect(shown <= exactBound && exactBound - shown < 0.01, `${shown} for ${exactBound}`).toBe(true);
        expect(task.prompt, "no fee of 0,00 €").not.toMatch(/(^|[^\d.,])0,00 €/);
        if (m.kind === 0) {
          expect(m.base + m.perMin * m.minutes).toBeLessThanOrEqual(m.budget);
          expect(m.base + m.perMin * (m.minutes + 1)).toBeGreaterThan(m.budget);
          expect(num(task, 0)).toBe(m.minutes);
        } else if (m.kind === 1) {
          expect(m.bonus + m.wage * m.hours).toBeGreaterThanOrEqual(m.target);
          expect(m.bonus + m.wage * (m.hours - 1)).toBeLessThan(m.target);
          expect(num(task, 0)).toBe(m.hours);
        } else if (m.kind === 2) {
          expect(m.baseB + m.perB * m.from).toBeLessThan(m.baseA + m.perA * m.from);
          expect(m.baseB + m.perB * (m.from - 1)).toBeGreaterThanOrEqual(m.baseA + m.perA * (m.from - 1));
          // the tariff with the smaller Grundgebühr (baseA, perA) is called A or B; the right option names it
          expect(m.baseA).toBeLessThan(m.baseB);
          expect(choice(task, 0)).toBe(m.lowIsA ? 0 : 1);
          expect(task.given[m.lowIsA ? 0 : 1]).toContain(`${m.perA} ct/min`);
          expect(task.fields[1].label).toBe(`Tarif ${m.lowIsA ? "B" : "A"} ist günstiger ab`);
          expect(num(task, 1)).toBe(m.from);
        } else if (m.kind === 4) {
          expect(m.joinB + m.perB * m.from).toBeLessThan(m.joinA + m.perA * m.from);
          expect(m.joinB + m.perB * (m.from - 1)).toBeGreaterThanOrEqual(m.joinA + m.perA * (m.from - 1));
          expect(num(task, 0)).toBe(m.from);
        } else {
          expect(m.season + m.perVisit * m.from).toBeLessThan(m.single * m.from);
          expect(m.season + m.perVisit * (m.from - 1)).toBeGreaterThanOrEqual(m.single * (m.from - 1));
          expect(num(task, 0)).toBe(m.from);
        }
      }
    }
  });
});

describe("Etappe 4: predicted slips", () => {
  it("name each wrong value once: two slips of a field never share a value", () => {
    let fields = 0;
    for (const id of IDS)
      for (const generator of lesson(id).exercises)
        for (const level of [1, 2] as const)
          for (const task of tasks(id, generator.id, level))
            for (const field of task.fields) {
              if (field.kind !== "number" || !field.slips?.length) continue;
              const values = field.slips.map((s) => s.value.toFixed(9));
              expect(new Set(values).size, `${id}/${generator.id} L${level}: ${field.label} in ${task.prompt}`).toBe(values.length);
              fields += 1;
            }
    expect(fields).toBeGreaterThan(3000);
  });
});
