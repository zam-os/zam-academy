import { describe, expect, it } from "vitest";
import { findLessonById } from "../src/curriculum";
import { STAGE_EXPONENTIAL_LOGARITHMUS } from "../src/curriculum/stage-5-exponential-logarithmus";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import {
  characteristicTime,
  comparison,
  expInverseText,
  GROWTH_DATA,
  imageEquation,
  logInverseText,
  MAP_POINT,
  mapPoint,
  ruleGeometry,
} from "../src/lab/views-exponential-logarithmus";
import type { ChoiceField, ExerciseTask, LabValues, NumberField } from "../src/model/types";

const lessonOf = (id: string) => {
  const found = findLessonById(id);
  if (!found) throw new Error(id);
  return found.lesson;
};

/** 200 tasks of one generator on one level. */
function tasks(lessonId: string, generatorId: string, level: 1 | 2): ExerciseTask[] {
  const generator = lessonOf(lessonId).exercises.find((g) => g.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return Array.from({ length: 200 }, (_, i) => generator.make(createRng(seedFrom(`stage5:${lessonId}:${generatorId}:${level}:${i}`)), level));
}

const numbers = (task: ExerciseTask) => task.fields.filter((f): f is NumberField => f.kind === "number").map((f) => f.answer);
const choices = (task: ExerciseTask) => task.fields.filter((f): f is ChoiceField => f.kind === "choice").map((f) => f.correctIndex);
const m = (task: ExerciseTask) => task.meta ?? {};
const logb = (a: number, x: number) => Math.log(x) / Math.log(a);
const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(b));

describe("Etappe 5: Lernpfad", () => {
  it("has the seven lessons in order, with their Zweige and Lernbereiche", () => {
    const lessons = STAGE_EXPONENTIAL_LOGARITHMUS.lessons;
    expect(lessons.map((l) => l.id)).toEqual([
      "el-1-exponentialfunktion",
      "el-2-wachstum",
      "el-3-logarithmus",
      "el-4-logarithmensaetze",
      "el-5-exponentialfunktion-allgemein",
      "el-6-logarithmusfunktion",
      "ab-6-funktionsgraphen",
    ]);
    for (const lesson of lessons.slice(0, 3)) {
      expect(lesson.tracks).toEqual(["I", "II_III"]);
      expect(lesson.lehrplan.startsWith("M10 LB 4 (I) · M10 LB 3 (II/III): Exponentialfunktionen"), lesson.id).toBe(true);
    }
    for (const lesson of lessons.slice(3, 6)) {
      expect(lesson.tracks).toEqual(["I"]);
      expect(lesson.lehrplan.startsWith("M10 LB 4 (I):"), lesson.id).toBe(true);
    }
    expect(lessons[6].tracks).toEqual(["I"]);
    expect(lessons[6].lehrplan.startsWith("M10 LB 2 (I):")).toBe(true);
    for (const lesson of lessons) {
      expect(lesson.stageId).toBe("stage-5-exponential-logarithmus");
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.teacherVideo).toBeUndefined();
    }
  });
});

describe("Etappe 5: Aufgaben rechnen richtig", () => {
  it("5.1 Funktionswerte, zwei Punkte, Wertetabellen und Vergleich", () => {
    for (const t of tasks("el-1-exponentialfunktion", "funktionswert", 1)) {
      const { k, a, x0 } = m(t);
      expect(close(numbers(t)[0], k * a ** x0)).toBe(true);
    }
    for (const t of tasks("el-1-exponentialfunktion", "funktionswert", 2)) {
      const { x1, x2, y1, y2 } = m(t);
      const a = (y2 / y1) ** (1 / (x2 - x1));
      expect(close(numbers(t)[0], a)).toBe(true);
      expect(close(numbers(t)[1], y1 / a ** x1)).toBe(true);
      expect(x1).not.toBe(0);
    }
    for (const t of tasks("el-1-exponentialfunktion", "verlauf", 1)) {
      const { k, a } = m(t);
      expect(choices(t)[0]).toBe(a > 1 ? 0 : 1);
      expect(numbers(t)).toEqual([k, k * a]);
    }
    const kinds = new Set<number>();
    for (const t of tasks("el-1-exponentialfunktion", "verlauf", 2)) {
      const { y0, y1, y2, y3, y5 } = m(t);
      const ys = [y0, y1, y2, y3];
      const d = [y1 - y0, y2 - y1, y3 - y2];
      const linear = close(d[0], d[1], 1e-9) && close(d[1], d[2], 1e-9);
      const s = [d[1] - d[0], d[2] - d[1]];
      const quadratic = !linear && close(s[0], s[1], 1e-9);
      const exponential = ys.every((y) => y !== 0) && close(y1 / y0, y2 / y1, 1e-9) && close(y2 / y1, y3 / y2, 1e-9);
      // exactly one type fits the table
      expect([linear, quadratic, exponential].filter(Boolean)).toHaveLength(1);
      const kind = linear ? 0 : quadratic ? 1 : 2;
      kinds.add(kind);
      expect(choices(t)[0]).toBe(kind);
      const expected = linear ? y3 + 2 * d[2] : quadratic ? y3 + 2 * d[2] + 3 * s[0] : y3 * (y3 / y2) ** 2;
      expect(close(numbers(t)[0], expected)).toBe(true);
      expect(y5).toBe(numbers(t)[0]);
    }
    expect([...kinds].sort()).toEqual([0, 1, 2]);
    for (const t of tasks("el-1-exponentialfunktion", "vergleich", 1)) {
      const { t: t0, m: slope, k, a, n } = m(t);
      const A = t0 + slope * n;
      const B = k * a ** n;
      expect(numbers(t)).toEqual([A, B]);
      expect(Math.abs(A - B)).toBeGreaterThanOrEqual(0.5);
      expect(choices(t)[0]).toBe(A > B ? 0 : 1);
    }
    for (const t of tasks("el-1-exponentialfunktion", "vergleich", 2)) {
      const { t: t0, m: slope, k, a, n } = m(t);
      expect(numbers(t)[0]).toBe(n);
      expect(k * a ** n).toBeGreaterThan(t0 + slope * n);
      for (let week = 1; week < n; week++) expect(k * a ** week, `week ${week}`).toBeLessThan(t0 + slope * week);
      expect(close(numbers(t)[1], k * a ** n)).toBe(true);
    }
  });

  it("5.2 Wachstumsfaktor, Zinseszins, Halbwertszeit und Parameter aus Messwerten", () => {
    for (const t of tasks("el-2-wachstum", "prozent", 1)) {
      const { N0, p, t: years } = m(t);
      const a = 1 + p / 100;
      expect(close(numbers(t)[0], a)).toBe(true);
      expect(close(numbers(t)[1], N0 * a ** years)).toBe(true);
    }
    for (const t of tasks("el-2-wachstum", "prozent", 2)) {
      const meta = m(t);
      if (meta.scenario === 0) {
        const Kn = meta.K0 * (1 + meta.p / 100) ** meta.n;
        expect(close(numbers(t)[0], Kn)).toBe(true);
        expect(close(numbers(t)[1], Kn - meta.K0)).toBe(true);
      } else {
        const share = (1 - meta.p / 100) ** meta.n;
        expect(close(numbers(t)[0], meta.W0 * share)).toBe(true);
        expect(close(numbers(t)[1], 100 * share)).toBe(true);
      }
    }
    for (const t of tasks("el-2-wachstum", "halbwertszeit", 1)) {
      const { N0, T, n } = m(t);
      expect(t.prompt).toContain(`nach ${n * T} Tagen`);
      expect(numbers(t)).toEqual([N0 / 2 ** n, 100 / 2 ** n]);
      // the amounts come out exactly at the shown decimals
      expect(Number((N0 / 2 ** n).toFixed(2))).toBe(N0 / 2 ** n);
    }
    for (const t of tasks("el-2-wachstum", "halbwertszeit", 2)) {
      const { scenario, N0, T, t: time } = m(t);
      if (scenario === 0) {
        expect(time % T).not.toBe(0);
        expect(close(numbers(t)[0], N0 * 0.5 ** (time / T))).toBe(true);
        expect(close(numbers(t)[1], 100 * (1 - 0.5 ** (1 / T)))).toBe(true);
      } else {
        expect(close(numbers(t)[0], N0 * 2 ** (time / T))).toBe(true);
        expect(close(numbers(t)[1], 100 * (2 ** (1 / T) - 1))).toBe(true);
      }
    }
    for (const t of tasks("el-2-wachstum", "daten", 1)) {
      const { N0, N1, t: years } = m(t);
      const a = N1 / N0;
      expect(close(numbers(t)[0], a)).toBe(true);
      expect(close(numbers(t)[1], (a - 1) * 100)).toBe(true);
      expect(close(numbers(t)[2], N0 * a ** years)).toBe(true);
    }
    for (const t of tasks("el-2-wachstum", "daten", 2)) {
      const { N1, N2, t1 } = m(t);
      expect(Number.isInteger(N1) && Number.isInteger(N2)).toBe(true);
      const a = N2 / N1;
      expect(close(numbers(t)[0], (a - 1) * 100)).toBe(true);
      const start = N1 / a ** t1;
      expect(close(numbers(t)[1], start)).toBe(true);
      expect(Math.abs(start - Math.round(start))).toBeLessThan(1e-6);
    }
  });

  it("5.3 Logarithmen, Exponentialgleichungen und Zeitfragen", () => {
    for (const t of tasks("el-3-logarithmus", "logwert", 1)) {
      const { a, n } = m(t);
      expect(numbers(t)[0]).toBe(n);
      expect(close(logb(a, a ** n), n, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-3-logarithmus", "logwert", 2)) {
      const meta = m(t);
      if (meta.variant === 0) expect(close(numbers(t)[0], meta.a ** meta.n)).toBe(true);
      else if (meta.variant === 1) expect(close(logb(numbers(t)[0], meta.x ** meta.n), meta.n, 1e-9)).toBe(true);
      else expect(numbers(t)[0]).toBe(meta.n1 + meta.n2);
    }
    for (const t of tasks("el-3-logarithmus", "gleichung", 1)) {
      const { a, b } = m(t);
      expect(close(numbers(t)[0], Math.log10(b) / Math.log10(a))).toBe(true);
      expect(close(a ** numbers(t)[0], b)).toBe(true);
    }
    let none = 0;
    for (const t of tasks("el-3-logarithmus", "gleichung", 2)) {
      const { k, a, r } = m(t);
      if (r / k <= 0) {
        none += 1;
        expect(t.fields).toHaveLength(1);
        expect(choices(t)[0]).toBe(1);
      } else {
        expect(choices(t)[0]).toBe(0);
        expect(close(k * a ** numbers(t)[0], r)).toBe(true);
      }
    }
    expect(none).toBeGreaterThan(10);
    for (const t of tasks("el-3-logarithmus", "wann", 1)) {
      const { N0, a, N } = m(t);
      expect(close(N0 * a ** numbers(t)[0], N)).toBe(true);
    }
    for (const t of tasks("el-3-logarithmus", "wann", 2)) {
      const { a, f } = m(t);
      const [exact, whole] = numbers(t);
      expect(close(a ** exact, f)).toBe(true);
      // the rounded exact time never contradicts the whole number of steps
      expect(Math.abs(exact - Math.round(exact))).toBeGreaterThanOrEqual(0.02);
      expect(whole).toBe(Math.ceil(Number(exact.toFixed(2))));
      if (a > 1) {
        expect(a ** whole).toBeGreaterThan(f);
        expect(a ** (whole - 1)).toBeLessThan(f);
      } else {
        expect(a ** whole).toBeLessThan(f);
        expect(a ** (whole - 1)).toBeGreaterThan(f);
      }
    }
  });

  it("5.4 Logarithmensätze, Gleichungen k · a^(x − b) + c = 0 und Schnittpunkte", () => {
    for (const t of tasks("el-4-logarithmensaetze", "saetze", 1)) {
      const meta = m(t);
      const expected = meta.kind === 0 ? Math.log10(meta.u * meta.v) : meta.kind === 1 ? logb(meta.a, meta.u / meta.v) : meta.r * logb(meta.a, meta.u);
      expect(close(numbers(t)[0], expected, 1e-9)).toBe(true);
      expect(Number.isInteger(numbers(t)[0])).toBe(true);
    }
    for (const t of tasks("el-4-logarithmensaetze", "saetze", 2)) {
      const meta = m(t);
      if (meta.n === undefined || meta.two === undefined) {
        expect(close(logb(meta.a, meta.N), meta.value, 1e-9)).toBe(true);
        expect(numbers(t)[0]).toBe(meta.value);
      } else {
        expect(close(2 ** meta.two * 3 ** meta.three * 10 ** meta.ten, meta.n, 1e-12)).toBe(true);
        expect(close(numbers(t)[0], meta.two * 0.301 + meta.three * 0.4771 + meta.ten, 1e-9)).toBe(true);
        expect(Math.abs(numbers(t)[0] - Math.log10(meta.n))).toBeLessThan(0.0006);
      }
    }
    for (const t of tasks("el-4-logarithmensaetze", "exponentialgleichung", 1)) {
      const { k, a, b, c } = m(t);
      const x = numbers(t)[0];
      expect(close(k * a ** (x - b) + c, 0, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-4-logarithmensaetze", "exponentialgleichung", 2)) {
      const meta = m(t);
      if (meta.variant === 3) {
        expect(meta.c / meta.k).toBeGreaterThan(0);
        expect(choices(t)).toEqual([1]);
        continue;
      }
      expect(choices(t)).toEqual([0]);
      const x = numbers(t)[0];
      if (meta.variant === 0) expect(close(meta.k * meta.a ** (meta.m * x + meta.n) + meta.c, meta.d, 1e-9)).toBe(true);
      else if (meta.variant === 1) expect(close(meta.a ** (x + meta.s) + meta.a ** x, meta.r, 1e-9)).toBe(true);
      else expect(close(meta.a ** (x + meta.s) - meta.a ** x, meta.r, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-4-logarithmensaetze", "basiswechsel", 1)) {
      const { a, b } = m(t);
      expect(close(a ** numbers(t)[0], b, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-4-logarithmensaetze", "basiswechsel", 2)) {
      const { p, a, q, b } = m(t);
      const [x, y] = numbers(t);
      expect(close(p * a ** x, y, 1e-9)).toBe(true);
      expect(close(q * b ** x, y, 1e-9)).toBe(true);
    }
  });

  it("5.5 Asymptote, Wertemenge, Nullstelle, Parameter und Umkehrfunktion", () => {
    for (const t of tasks("el-5-exponentialfunktion-allgemein", "eigenschaften", 1)) {
      const { k, a, b, c } = m(t);
      expect(numbers(t)[0]).toBe(c);
      expect(choices(t)[0]).toBe(k > 0 ? 0 : 1);
      expect(close(numbers(t)[1], k * a ** -b + c, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-5-exponentialfunktion-allgemein", "eigenschaften", 2)) {
      const { k, a, b, c } = m(t);
      expect(choices(t)[0]).toBe(k > 0 ? 0 : 1);
      expect(numbers(t)[0]).toBe(c);
      const zero = numbers(t)[1];
      expect(close(k * a ** (zero - b) + c, 0, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-5-exponentialfunktion-allgemein", "aufstellen", 1)) {
      const { a, x1, y1 } = m(t);
      const [c, k] = numbers(t);
      expect(close(k * a ** x1 + c, y1, 1e-9)).toBe(true);
      expect(t.prompt).toContain(`Asymptote y = `);
    }
    for (const t of tasks("el-5-exponentialfunktion-allgemein", "aufstellen", 2)) {
      const { a, x1, x2, y1, y2 } = m(t);
      const [k, c] = numbers(t);
      expect(close(k * a ** x1 + c, y1, 1e-9)).toBe(true);
      expect(close(k * a ** x2 + c, y2, 1e-9)).toBe(true);
    }
    for (const level of [1, 2] as const) {
      for (const t of tasks("el-5-exponentialfunktion-allgemein", "umkehrfunktion", level)) {
        const meta = m(t);
        const k = level === 1 ? 1 : meta.a ** meta.m;
        const [p, q] = numbers(t);
        // y = log_a(x − p) + q undoes f: y = k · a^(x − b) + c
        for (const x of [-2, 0.5, 3]) {
          const y = k * meta.a ** (x - meta.b) + meta.c;
          expect(close(logb(meta.a, y - p) + q, x, 1e-9), `x = ${x}`).toBe(true);
        }
        if (level === 2) expect(choices(t)).toEqual([0]);
      }
    }
  });

  it("5.6 Logarithmusfunktionen: Asymptote, Nullstelle, Achsenschnitte, Umkehrung", () => {
    for (const t of tasks("el-6-logarithmusfunktion", "eigenschaften", 1)) {
      const { a, k, b, c } = m(t);
      const [asymptote, zero] = numbers(t);
      expect(asymptote).toBe(b);
      expect(choices(t)).toEqual([0]);
      expect(zero).toBeGreaterThan(b);
      expect(close(k * logb(a, zero - b) + c, 0, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-6-logarithmusfunktion", "eigenschaften", 2)) {
      const { a, k, b, c } = m(t);
      const [zero, yInt] = numbers(t);
      expect(b).toBeLessThan(0);
      expect(close(k * logb(a, zero - b) + c, 0, 1e-9)).toBe(true);
      expect(close(yInt, k * logb(a, -b) + c, 1e-9)).toBe(true);
    }
    for (const t of tasks("el-6-logarithmusfunktion", "umkehrung", 1)) {
      const { a, b, c } = m(t);
      const [p, q] = numbers(t);
      for (const x of [b + 0.5, b + 2, b + 9]) {
        const y = logb(a, x - b) + c;
        expect(close(a ** (y - p) + q, x, 1e-9)).toBe(true);
      }
    }
    for (const t of tasks("el-6-logarithmusfunktion", "umkehrung", 2)) {
      const meta = m(t);
      if (meta.variant === 0) {
        const a = numbers(t)[0];
        expect(close(logb(a, meta.xP - meta.b) + meta.c, meta.yP, 1e-9)).toBe(true);
      } else {
        const [b, asymptote] = numbers(t);
        expect(asymptote).toBe(b);
        expect(close(logb(meta.a, meta.xP - b) + meta.c, meta.yP, 1e-9)).toBe(true);
      }
    }
  });

  it("5.7 Verschiebung, Spiegelung und zentrische Streckung von Graphen", () => {
    for (const t of tasks("ab-6-funktionsgraphen", "verschiebung", 1)) {
      const { vx, vy } = m(t);
      expect(numbers(t)).toEqual([vx, vy]);
    }
    for (const t of tasks("ab-6-funktionsgraphen", "verschiebung", 2)) {
      const meta = m(t);
      if (meta.variant === 0) expect(numbers(t)).toEqual([meta.b0 + meta.vx, meta.c0 + meta.vy]);
      else expect(numbers(t)).toEqual([meta.vx, meta.vy]);
    }
    for (const t of tasks("ab-6-funktionsgraphen", "spiegelung", 1)) {
      const { isLog, a, axis, m: e } = m(t);
      const P = isLog ? [a ** e, e] : [e, a ** e];
      const Q = axis === 0 ? [P[0], -P[1]] : axis === 1 ? [-P[0], P[1]] : [P[1], P[0]];
      expect(numbers(t)).toEqual(Q);
      // the image point lies on the chosen equation and on none of the others
      const candidates = isLog ? [(x: number) => -logb(a, x), (x: number) => logb(a, -x), (x: number) => a ** x] : [(x: number) => -(a ** x), (x: number) => a ** -x, (x: number) => logb(a, x)];
      const fits = candidates.map((g) => close(g(Q[0]), Q[1], 1e-9));
      expect(fits[axis]).toBe(true);
      expect(fits.filter(Boolean)).toHaveLength(1);
      expect(choices(t)).toEqual([axis]);
    }
    for (const t of tasks("ab-6-funktionsgraphen", "spiegelung", 2)) {
      const { variant, a, b, c } = m(t);
      const f = (x: number) => (variant === 0 || variant === 3 ? logb(a, x - b) + c : a ** (x - b) + c);
      const answers = numbers(t);
      for (const x0 of [b + 0.5, b + 1.5, b + 3]) {
        const [X, Y] = variant === 0 ? [x0, -f(x0)] : variant === 2 ? [-x0, f(x0)] : [f(x0), x0];
        let predicted: number;
        if (variant === 0) predicted = answers[0] * logb(a, X - answers[1]) + answers[2];
        else if (variant === 1) predicted = logb(a, X - answers[0]) + answers[1];
        else if (variant === 3) predicted = a ** (X - answers[0]) + answers[1];
        else predicted = answers[0] ** (X - answers[1]) + answers[2];
        expect(close(predicted, Y, 1e-9), `variant ${variant}`).toBe(true);
      }
    }
    for (const t of tasks("ab-6-funktionsgraphen", "streckung", 1)) {
      const { k } = m(t);
      const [x, y, coefficient] = numbers(t);
      expect([x, y]).toEqual([2 * k, 4 * k]);
      expect(close(coefficient * x * x, y, 1e-9)).toBe(true);
    }
    for (const t of tasks("ab-6-funktionsgraphen", "streckung", 2)) {
      const meta = m(t);
      const [r, second] = numbers(t);
      expect(r).toBe(meta.k);
      for (const x of [0.5, 2, 5]) {
        if (meta.variant === 0) expect(close(r * Math.log2(meta.k * x) + second, meta.k * Math.log2(x), 1e-9)).toBe(true);
        else expect(close(r * second ** (meta.k * x), meta.k * meta.a ** x, 1e-9)).toBe(true);
      }
    }
  });
});

describe("Etappe 5: Labore", () => {
  const lab = (id: string) => lessonOf(id).lab;
  const readouts = (id: string, values: LabValues) => computeReadouts(lab(id), { ...defaultLabValues(lab(id)), ...values });

  it("5.1: parabola and exponential curve meet again at x = 2 exactly for a = 3", () => {
    for (const values of enumerateLabGrid(lab("el-1-exponentialfunktion"), 29)) {
      if (values.k === 0 || values.a === 1) continue;
      const g = comparison({ ...values, cmp: 2 })!;
      const meet = close(g(2), values.k * values.a ** 2, 1e-9);
      expect(meet, JSON.stringify(values)).toBe(values.a === 3);
      expect(close(g(1), values.k * values.a, 1e-9)).toBe(true);
    }
  });

  it("5.2: the goals rest on the right numbers", () => {
    expect(1000 * 1.03 ** 23).toBeLessThan(2000);
    expect(1000 * 1.03 ** 24).toBeGreaterThan(2000);
    expect(0.75 ** 2).toBeGreaterThan(0.5);
    expect(0.75 ** 3).toBeLessThan(0.5);
    for (const [t, N] of GROWTH_DATA) expect(close(300 * 1.2 ** t, N, 1e-12)).toBe(true);
    expect(close(characteristicTime(10)!, Math.log(2) / Math.log(1.1))).toBe(true);
    expect(close(characteristicTime(-50)!, 1)).toBe(true);
    expect(characteristicTime(0)).toBeNull();
    expect(readouts("el-2-wachstum", { N0: 1000, p: 3, t: 24 }).Nt).toBe("N(24) ≈ 2.032,79");
  });

  it("5.3: the line y = b cuts y = aˣ at log_a b, and not at all for b ≤ 0", () => {
    expect(readouts("el-3-logarithmus", { a: 2, b: 8 }).x).toBe("x = log₂ 8 ≈ 3");
    expect(readouts("el-3-logarithmus", { a: 0.5, b: 4 }).x).toBe("x = log₀,₅ 4 ≈ −2");
    expect(String(readouts("el-3-logarithmus", { a: 3, b: 0 }).x)).toContain("keine Lösung");
  });

  it("5.4: the arrows add up as the rules say, and the false rule fits only by chance", () => {
    for (const values of enumerateLabGrid(lab("el-4-logarithmensaetze"), 6)) {
      const geo = ruleGeometry(values);
      if (values.rule === 0) expect(close(geo.v!, Math.log10(values.u * values.v), 1e-12)).toBe(true);
      if (values.rule === 1) expect(close(geo.v!, Math.log10(values.u / values.v), 1e-12)).toBe(true);
      if (values.rule === 2) expect(close(geo.r!, Math.log10(values.u ** values.r), 1e-12)).toBe(true);
    }
    const coincidences: string[] = [];
    for (let u = 0.5; u <= 50; u += 0.5) for (let v = 0.5; v <= 50; v += 0.5) if (Math.abs(u + v - u * v) < 1e-9) coincidences.push(`${u}+${v}`);
    expect(coincidences).toEqual(["1.5+3", "2+2", "3+1.5"]);
  });

  it("5.5 and 5.6: the inverse functions undo the functions on the whole slider grid", () => {
    for (const values of enumerateLabGrid(lab("el-5-exponentialfunktion-allgemein"), 4)) {
      const { a, k, b, c } = values;
      if (k === 0) continue;
      for (const x of [-1, 0, 2]) {
        const y = k * a ** (x - b) + c;
        expect(close(b + logb(a, (y - c) / k), x, 1e-9)).toBe(true);
      }
    }
    expect(expInverseText(2, 3, 1, -4)).toBe("y = log₃((x + 4) : 2) + 1");
    expect(expInverseText(1, 2, -1, 3)).toBe("y = log₂(x − 3) − 1");
    expect(logInverseText(1, 2, 3, 1)).toBe("y = 2ˣ⁻¹ + 3");
    expect(logInverseText(1, 3, 1, -2)).toBe("y = 3ˣ⁺² + 1");
    expect(readouts("el-6-logarithmusfunktion", { a: 3, k: 1, b: 1, c: -2 }).zero).toBe("x = 10");
  });

  it("5.7: every mapped point lies on the image graph the lab names", () => {
    const f = [(x: number) => 2 ** x, (x: number) => Math.log2(x), (x: number) => x * x];
    const image = (v: LabValues): ((x: number) => number) | null => {
      const g = f[v.f];
      switch (v.map) {
        case 0:
          return (x) => g(x - v.vx) + v.vy;
        case 1:
          return (x) => -g(x);
        case 2:
          return (x) => g(-x);
        case 3:
          return v.f === 0 ? (x) => Math.log2(x) : v.f === 1 ? (x) => 2 ** x : null;
        default:
          return v.k === 0 ? null : (x) => v.k * g(x / v.k);
      }
    };
    for (const values of enumerateLabGrid(lab("ab-6-funktionsgraphen"), 6)) {
      const g = image(values);
      if (!g) continue;
      for (const x0 of [0.5, 1, 2, 3]) {
        const [X, Y] = mapPoint(values, [x0, f[values.f](x0)]);
        expect(close(g(X), Y, 1e-9), JSON.stringify(values)).toBe(true);
      }
      const [px, py] = MAP_POINT[values.f];
      expect(close(f[values.f](px), py, 1e-12)).toBe(true);
    }
    const eq = (values: LabValues) => imageEquation({ ...defaultLabValues(lab("ab-6-funktionsgraphen")), ...values }).text;
    expect(eq({ f: 0, map: 0, vx: -1, vy: -3 })).toBe("y = 2ˣ⁺¹ − 3");
    expect(eq({ f: 1, map: 1 })).toBe("y = −log₂ x = log₀,₅ x");
    expect(eq({ f: 2, map: 4, k: 4 })).toBe("y = 4 · (x : 4)² = 0,25x²");
    expect(eq({ f: 1, map: 4, k: 2 })).toBe("y = 2 · log₂(x : 2) = 2 · log₂ x − 2");
    expect(eq({ f: 0, map: 4, k: -1 })).toBe("y = −2⁻ˣ = −0,5ˣ");
    // the parabola stretched with k = 4 passes through (2 | 1)
    expect(4 * (2 / 4) ** 2).toBe(1);
  });
});
