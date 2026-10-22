import { describe, expect, it } from "vitest";
import { STAGE_POTENZEN } from "../src/curriculum/stage-4-potenzen";
import { checkTask } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { basicSets, mirrorCase, powerEquationSolutions, powerOf, shiftedPower, shiftedSets } from "../src/lab/views-potenzen";
import type { DifficultyLevel, ExerciseTask } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_4, VIDEOS_STAGE_4 } from "./witnesses-stage-4";

const IDS = ["pt-1-potenzgesetze", "pt-2-wurzeln", "pt-3-potenzfunktionen", "pt-4-parameter", "pt-5-umkehrfunktion"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-4:${i}`));

const lesson = (id: string) => {
  const found = STAGE_POTENZEN.lessons.find((l) => l.id === id);
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

/** |x − y| within a relative tolerance. */
function close(x: number, y: number, rel = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(rel * Math.max(1, Math.abs(y)));
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const SETS = ["ℝ", "ℝ ∖ {0}", "ℝ₀⁺", "ℝ⁺"];

describe("Etappe 4: Potenzen und Potenzfunktionen", () => {
  it("has its five lessons in order, all in Zweig I, in LB 3", () => {
    expect(STAGE_POTENZEN.id).toBe("stage-4-potenzen");
    expect(STAGE_POTENZEN.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_POTENZEN.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-4-potenzen");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`4.${index + 1} `), l.title).toBe(true);
      expect(l.tracks).toEqual(["I"]);
      expect(l.lehrplan.startsWith("M10 LB 3 (I): Potenzen und Potenzfunktionen"), l.lehrplan).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("links the teacher video pinned for a lesson, and none where none is pinned yet", () => {
    for (const l of STAGE_POTENZEN.lessons) {
      const expected = VIDEOS_STAGE_4[l.id];
      if (!expected) {
        expect(l.teacherVideo, l.id).toBeUndefined();
        continue;
      }
      expect(l.teacherVideo?.url).toBe(`https://www.youtube.com/watch?v=${expected.id}`);
      expect(l.teacherVideo?.author).toBe(expected.author);
    }
  });

  it("writes real minus signs and the set minus in every lesson text", () => {
    for (const l of STAGE_POTENZEN.lessons) {
      const plain = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => `${f.html} ${f.quantities}`)].join(" ").replace(/<[^>]+>/g, " ");
      expect(plain, l.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(plain, l.id).not.toContain("\\");
    }
  });
});

describe("Aufgaben der Etappe 4 rechnen richtig", () => {
  it("4.1 values of powers: a^(m/n) from whole roots, Kleiber's law and the cube", () => {
    for (const task of tasks("pt-1-potenzgesetze", "wert", 1)) {
      const { a, r, n, m, value } = meta(task);
      expect(a).toBe(r ** n);
      expect(gcd(m, n)).toBe(1);
      close(num(task, 0), a ** (m / n));
      close(value, a ** (m / n));
    }
    for (const task of tasks("pt-1-potenzgesetze", "wert", 2)) {
      const { m1, m2, G, V } = meta(task);
      if (G !== undefined) {
        for (const mass of [m1, m2]) expect(Math.round(mass ** 0.25) ** 4, "masses are fourth powers").toBe(mass);
        close(num(task, 0), 70 * m2 ** 0.75, 1e-9);
        close(num(task, 1), (70 * m2 ** 0.75) / (70 * m1 ** 0.75), 1e-9);
        expect(m2).toBeGreaterThan(m1);
      } else {
        close(num(task, 0) ** 3, V, 1e-9);
        close(num(task, 1), 6 * num(task, 0) ** 2, 1e-9);
      }
    }
  });

  it("4.1 power laws: the exponent k of x^r ∘ x^s and of a two-letter term", () => {
    for (const task of tasks("pt-1-potenzgesetze", "gesetze", 1)) {
      const { rule, rp, rq, sp, sq } = meta(task);
      const [r, s] = [rp / rq, sp / sq];
      close(num(task, 0), [r + s, r - s, r * s][rule]);
      // the claimed power really equals the term at x = 2
      close(2 ** num(task, 0), [2 ** r * 2 ** s, 2 ** r / 2 ** s, (2 ** r) ** s][rule], 1e-9);
    }
    for (const task of tasks("pt-1-potenzgesetze", "gesetze", 2)) {
      const { e1p, e1q, f1p, f1q, t, e2p, e2q, f2p, f2q, multiply } = meta(task);
      const sign = multiply ? 1 : -1;
      const [a, b] = [2, 3];
      const term = (a ** (e1p / e1q) * b ** (f1p / f1q)) ** t * (a ** (e2p / e2q) * b ** (f2p / f2q)) ** sign;
      close(a ** num(task, 0) * b ** num(task, 1), term, 1e-9);
      expect(num(task, 0)).not.toBe(0);
      expect(num(task, 1)).not.toBe(0);
    }
  });

  it("4.2 root and power notation translate into each other", () => {
    for (const task of tasks("pt-2-wurzeln", "umschreiben", 1)) {
      const { dir, n, m, inverse } = meta(task);
      if (dir === 0) close(3 ** num(task, 0), (inverse ? -1 : 1) === 1 ? (3 ** m) ** (1 / n) : 1 / (3 ** m) ** (1 / n), 1e-9);
      else {
        expect([num(task, 0), num(task, 1)]).toEqual([n, m]);
        expect(gcd(m, n)).toBe(1);
      }
    }
    for (const task of tasks("pt-2-wurzeln", "umschreiben", 2)) {
      const { variant, n1, m1, n2, m2, multiply, n, m, p } = meta(task);
      const x = 3;
      const expected = variant === 0 ? (x ** m1) ** (1 / n1) * ((x ** m2) ** (1 / n2)) ** (multiply ? 1 : -1) : (x ** m * x ** (1 / p)) ** (1 / n);
      close(x ** num(task, 0), expected, 1e-9);
      expect(num(task, 0)).not.toBe(0);
    }
  });

  it("4.2 xⁿ = a: the number of solutions follows n and the sign of a, and every solution solves it", () => {
    let seen = [0, 0, 0];
    for (const task of tasks("pt-2-wurzeln", "gleichung", 1)) {
      const { n, a } = meta(task);
      const count = choice(task, 0);
      const expected = n % 2 === 0 ? (a > 0 ? 2 : 0) : 1;
      expect(count, task.prompt).toBe(expected);
      seen[count] += 1;
      expect(task.fields).toHaveLength(1 + count);
      const solutions = task.fields.slice(1).map((_, i) => num(task, i + 1));
      for (const x of solutions) close(x ** n, a, 1e-9);
      expect(solutions.sort((p, q) => p - q).map((x) => x.toFixed(6))).toEqual(powerEquationSolutions(n, a).map((x) => x.toFixed(6)));
    }
    expect(seen.every((s) => s > 0), `${seen}`).toBe(true);
    seen = [0, 0, 0];
    for (const task of tasks("pt-2-wurzeln", "gleichung", 2)) {
      const { mass, rho, V, a0, k } = meta(task);
      if (mass !== undefined) {
        close(num(task, 0), (mass * 1000) / rho, 1e-9);
        close(num(task, 1) ** 3, V, 1e-9);
      } else close(num(task, 0) ** 3, k * a0 ** 3, 1e-9);
    }
  });

  it("4.3 properties of y = xⁿ: symmetry, value set and function values", () => {
    for (const task of tasks("pt-3-potenzfunktionen", "eigenschaften", 1)) {
      const { c, x0 } = meta(task);
      const even = c % 2 === 0;
      expect(choice(task, 0)).toBe(even ? 0 : 1);
      expect(SETS[choice(task, 1)]).toBe(c > 0 ? (even ? "ℝ₀⁺" : "ℝ") : even ? "ℝ⁺" : "ℝ ∖ {0}");
      close(num(task, 2), x0 ** c);
    }
    for (const task of tasks("pt-3-potenzfunktionen", "eigenschaften", 2)) {
      const { c, x0, y0 } = meta(task);
      expect(num(task, 0)).toBe(c);
      close(x0 ** c, y0);
      // the point fixes n: no other whole exponent fits
      for (let other = -8; other <= 8; other++) if (other !== 0 && other !== c) expect(Math.abs(x0 ** other - y0) > 1e-9, `${x0}^${other}`).toBe(true);
      expect(choice(task, 1)).toBe(c % 2 === 0 ? 0 : 1);
      expect(choice(task, 2)).toBe(c < 0 ? 0 : 1);
    }
  });

  it("4.3 definition and value sets, and the points with a given y on the graph", () => {
    for (const task of tasks("pt-3-potenzfunktionen", "definitionsmenge", 1)) {
      const { cp, cq, x0 } = meta(task);
      const c = cp / cq;
      const D = cq > 1 ? (c > 0 ? "ℝ₀⁺" : "ℝ⁺") : c > 0 ? "ℝ" : "ℝ ∖ {0}";
      expect(SETS[choice(task, 0)]).toBe(D);
      expect(SETS[choice(task, 1)]).toBe(basicSets(c).W);
      close(num(task, 2), x0 ** c, 1e-12);
    }
    const counts = [0, 0, 0];
    for (const task of tasks("pt-3-potenzfunktionen", "definitionsmenge", 2)) {
      const { cp, cq, y0 } = meta(task);
      const c = cp / cq;
      const evenOrFraction = cq > 1 || cp % 2 === 0;
      const expected = y0 < 0 && evenOrFraction ? 0 : cq === 1 && cp % 2 === 0 ? 2 : 1;
      expect(choice(task, 0), task.prompt).toBe(expected);
      counts[expected] += 1;
      for (let i = 1; i < task.fields.length; i++) close(powerOf(num(task, i), c), y0, 1e-9);
      if (expected === 2) close(num(task, 1), -num(task, 2), 1e-12);
    }
    expect(counts.every((n) => n > 0), `${counts}`).toBe(true);
  });

  it("4.4 asymptotes and value sets of y = a(x + b)ᶜ + d", () => {
    for (const task of tasks("pt-4-parameter", "asymptoten", 1)) {
      const { a, b, c, d } = meta(task);
      expect(num(task, 0)).toBe(-b);
      expect(num(task, 1)).toBe(d);
      expect(Number.isFinite(shiftedPower(a, b, c, d, -b))).toBe(false);
      // far away the graph comes close to y = d
      expect(Math.abs(shiftedPower(a, b, c, d, 1e4) - d)).toBeLessThan(1e-3);
      const odd = c % 2 !== 0;
      expect(choice(task, 2)).toBe(odd ? 0 : a > 0 ? 1 : 2);
    }
    for (const task of tasks("pt-4-parameter", "asymptoten", 2)) {
      const { c, xP, yP } = meta(task);
      const [a, b, d] = [num(task, 0), num(task, 1), num(task, 2)];
      close(shiftedPower(a, b, c, d, xP), yP, 1e-12);
      expect(a).not.toBe(0);
    }
  });

  it("4.4 points on the graph and the intersections with the axes", () => {
    for (const task of tasks("pt-4-parameter", "punkte", 1)) {
      const { a, b, c, d, x0 } = meta(task);
      close(num(task, 0), shiftedPower(a, b, c, d, x0), 1e-12);
    }
    for (const task of tasks("pt-4-parameter", "punkte", 2)) {
      const { kind, a, b, d } = meta(task);
      const c = kind === 0 ? 0.5 : -1;
      expect(Math.abs(shiftedPower(a, b, c, d, num(task, 0)))).toBeLessThan(1e-9);
      close(num(task, 1), shiftedPower(a, b, c, d, 0), 1e-12);
    }
  });

  it("4.5 the inverse functions undo f on both sides", () => {
    const check = (f: (x: number) => number, inv: (x: number) => number, xs: number[], ys: number[]) => {
      for (const x of xs) close(inv(f(x)), x, 1e-9);
      for (const y of ys) close(f(inv(y)), y, 1e-9);
    };
    for (const level of [1, 2] as const) {
      for (const task of tasks("pt-5-umkehrfunktion", "umkehrfunktion", level)) {
        const { kind, a, b, d } = meta(task);
        const s = -b;
        const xs = [s + 0.5, s + 2, s + 7];
        if (kind === 0) check((x) => (x + b) ** 2 + d, (x) => Math.sqrt(x - num(task, 0)) + num(task, 1), xs, [d, d + 1, d + 9]);
        if (kind === 1) check((x) => (x + b) ** 3 + d, (x) => Math.cbrt(x - num(task, 0)) + num(task, 1), xs, [d, d + 1, d + 9]);
        if (kind === 2) check((x) => Math.sqrt(x + b) + d, (x) => (x - num(task, 0)) ** 2 + num(task, 1), xs, [d, d + 1, d + 9]);
        if (kind === 3) check((x) => a / (x + b) + d, (x) => num(task, 0) / (x - num(task, 1)) + num(task, 2), [s - 3, s - 0.5, s + 0.5, s + 4], [d - 2, d + 0.5, d + 3]);
        if (kind === 4) check((x) => a * (x + b) ** 2 + d, (x) => Math.sqrt(num(task, 0) * (x - num(task, 1))) + num(task, 2), xs, [d, d + 1, d + 9]);
        if (kind === 5) check((x) => a * (x + b) ** -2 + d, (x) => num(task, 0) * (x - num(task, 1)) ** -0.5 + num(task, 2), xs, [d + 0.25, d + 1, d + 9]);
      }
    }
  });

  it("4.5 applications: sphere, ball, Kepler's third law and the balloon", () => {
    for (const task of tasks("pt-5-umkehrfunktion", "anwendung", 1)) {
      const { variant, V, O } = meta(task);
      const r = num(task, 0);
      if (variant === 0) close((4 / 3) * Math.PI * r ** 3, V, 1e-9);
      else close(4 * Math.PI * r ** 2, O, 1e-9);
    }
    for (const task of tasks("pt-5-umkehrfunktion", "anwendung", 2)) {
      const { variant, T, a, k } = meta(task);
      if (variant === 2) close(num(task, 0) ** 3, T ** 2, 1e-9);
      if (variant === 3) close(num(task, 0) ** 2, a ** 3, 1e-9);
      if (variant === 4) close(num(task, 0) ** 3, k, 1e-9);
    }
  });

  it("uses planet data that obey T² = a³ within 1 %", () => {
    const pairs = new Map<number, number>();
    for (const task of tasks("pt-5-umkehrfunktion", "anwendung", 2)) {
      const { variant, T, a } = meta(task);
      if (variant === 2) pairs.set(T, num(task, 0));
      if (variant === 3) pairs.set(num(task, 0), a);
    }
    expect(pairs.size).toBeGreaterThan(5);
    for (const [T, a] of pairs) expect(Math.abs(a ** 1.5 - T) / T).toBeLessThan(0.01);
  });

  it("accepts the answer typed as a fraction where the exponent is one", () => {
    for (const task of tasks("pt-1-potenzgesetze", "gesetze", 1).slice(0, 60)) {
      const { rule, rp, rq, sp, sq } = meta(task);
      const k = [rp / rq + sp / sq, rp / rq - sp / sq, (rp / rq) * (sp / sq)][rule];
      // the reduced fraction p/q of k, with a denominator up to 16
      const q = [1, 2, 3, 4, 6, 8, 9, 12, 16].find((d) => Math.abs(Math.round(k * d) - k * d) < 1e-9) ?? 1;
      expect(checkTask(task, [`${Math.round(k * q)}/${q}`]).status, task.prompt).toBe("correct");
    }
  });
});

describe("Labore der Etappe 4", () => {
  it("Potenzleiter: both sides of aʳ · aˢ = aʳ⁺ˢ agree everywhere", () => {
    const lab = lesson("pt-1-potenzgesetze").lab;
    for (const values of enumerateLabGrid(lab, 9)) {
      const r = computeReadouts(lab, values);
      expect(r.product, JSON.stringify(values)).toBe(r.power);
    }
  });

  it("Wurzel als Schnittstelle: the root is the non-negative solution", () => {
    const lab = lesson("pt-2-wurzeln").lab;
    for (const values of enumerateLabGrid(lab, 97)) {
      const r = computeReadouts(lab, values);
      const solutions = powerEquationSolutions(values.n, values.a);
      for (const x of solutions) close(x ** values.n, values.a, 1e-9);
      if (values.a >= 0) {
        expect(typeof r.root).toBe("number");
        close(Number(r.root), Math.max(...solutions), 1e-12);
      } else expect(r.root).toBe("nicht definiert (a < 0)");
      expect(solutions.length).toBe(values.a === 0 ? 1 : values.n % 2 === 0 ? (values.a > 0 ? 2 : 0) : 1);
    }
  });

  it("Zoo: the stated symmetry holds and every graph passes through (1 | 1)", () => {
    const param = lesson("pt-3-potenzfunktionen").lab.params.find((p) => p.key === "c");
    if (param?.type !== "choice") throw new Error("exponent choice");
    expect(param.options).toHaveLength(9);
    for (const { value: c } of param.options) {
      const { symmetry, D } = basicSets(c);
      expect(powerOf(1, c)).toBe(1);
      for (const x of [0.3, 1.7, 2.5]) {
        if (symmetry.startsWith("achsen")) close(powerOf(-x, c), powerOf(x, c), 1e-12);
        else if (symmetry.startsWith("punkt")) close(powerOf(-x, c), -powerOf(x, c), 1e-12);
        else expect(Number.isNaN(powerOf(-x, c))).toBe(true);
      }
      expect(Number.isFinite(powerOf(0, c))).toBe(D === "ℝ" || D === "ℝ₀⁺");
    }
  });

  it("Verschieben und Strecken: the stated value set and asymptotes describe the graph", () => {
    const lab = lesson("pt-4-parameter").lab;
    for (const values of enumerateLabGrid(lab, 5)) {
      const { a, b, c, d } = values;
      if (a === 0) continue;
      const sets = shiftedSets(a, b, c, d);
      const samples = [-50, -5, -1.3, -0.4, 0.2, 0.9, 3, 40].map((t) => t - b).filter((x) => Number.isFinite(shiftedPower(a, b, c, d, x)));
      for (const x of samples) {
        const y = shiftedPower(a, b, c, d, x);
        if (sets.W.includes(">")) expect(y).toBeGreaterThan(d);
        if (sets.W.includes("<")) expect(y).toBeLessThan(d);
        if (sets.W.includes("≥")) expect(y).toBeGreaterThanOrEqual(d);
        if (sets.W.includes("≤")) expect(y).toBeLessThanOrEqual(d);
        if (sets.W.includes("∖")) expect(y).not.toBe(d);
      }
      if (c < 0) {
        expect(sets.asymptotes).toBe(`x = ${(-b).toString().replace("-", "−").replace(".", ",")} und y = ${d.toString().replace("-", "−").replace(".", ",")}`);
        expect(Math.abs(shiftedPower(a, b, c, d, 1e5) - d)).toBeLessThan(1e-3);
      } else expect(sets.asymptotes).toBe("keine");
    }
  });

  it("Spiegel: the inverse undoes f wherever f is invertible, and the self-inverse goal is really self-inverse", () => {
    const lab = lesson("pt-5-umkehrfunktion").lab;
    for (const values of enumerateLabGrid(lab, 9)) {
      const mc = mirrorCase(values);
      if (!mc.invertible) {
        expect(values.c === 2 || values.c === -2).toBe(true);
        expect(values.r).toBe(0);
        continue;
      }
      for (const x of [-4.5, -1.2, 0.7, 2.6, 4.1]) {
        if (!mc.inD(x)) continue;
        const y = mc.f(x);
        if (!Number.isFinite(y)) continue;
        close(mc.inverse(y), x, 1e-9);
      }
      if (values.c === -1 && values.b === -values.d) {
        for (const x of [-3, 0.5, 2.5]) if (mc.inD(x)) close(mc.inverse(x), mc.f(x), 1e-12);
      }
    }
    const witness = { ...defaultLabValues(lab), ...GOAL_WITNESSES_STAGE_4["pt-5-umkehrfunktion"].gleichung };
    expect(computeReadouts(lab, witness).inv).toBe("y = √(x − 1) + 2");
  });
});
