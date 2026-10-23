import { describe, expect, it } from "vitest";
import { findLessonById } from "../src/curriculum";
import { STAGE_QUADRATISCH } from "../src/curriculum/stage-7-quadratisch";
import { createRng, seedFrom } from "../src/exercises/rng";
import { defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import {
  BASE_PARABOLA,
  completedVertex,
  completionFits,
  fenceArea,
  fenceModel,
  fitParabola,
  intersectionInfo,
} from "../src/lab/views-quadratisch";
import type { ChoiceField, ExerciseTask, LabValues, NumberField } from "../src/model/types";

const IDS = ["qf-1-parabeln", "qf-2-scheitelpunkt", "qf-3-bestimmungsstuecke", "qf-4-extremwerte", "qf-5-loesungsformel", "qf-6-schnittpunkte"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-7:${i}`));

function tasks(lessonId: string, id: string, level: 1 | 2): ExerciseTask[] {
  const generator = findLessonById(lessonId)?.lesson.exercises.find((exercise) => exercise.id === id);
  if (!generator) throw new Error(`${lessonId}/${id}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

const numbers = (task: ExerciseTask) => task.fields.filter((f): f is NumberField => f.kind === "number").map((f) => f.answer);
const choices = (task: ExerciseTask) => task.fields.filter((f): f is ChoiceField => f.kind === "choice");
/** A German number: "−2,5" → −2.5. */
const num = (text: string) => Number(text.replace(/−/g, "-").replace(/,/g, "."));
const close = (value: number, target: number, eps = 1e-6) => Math.abs(value - target) <= eps * Math.max(1, Math.abs(target));

function expectClose(value: number, target: number, where: string, eps = 1e-6): void {
  expect(close(value, target, eps), `${where}: ${value} should be ${target}`).toBe(true);
}

/**
 * A term as the tasks write it ("−0,5(x − 2,5)² + 3,5", "x(6 − 2x) + 1",
 * "3 · 2<sup>x</sup>") turned into a function of x, so the tests recompute
 * every answer from the stated equation, not from the generator's formulas.
 */
function fn(term: string): (x: number) => number {
  const s = term
    .replace(/<sup>x<\/sup>/g, "^x")
    .replace(/<[^>]+>/g, "")
    .replace(/−/g, "-")
    .replace(/·/g, "*")
    .replace(/,/g, ".")
    .replace(/\s+/g, "");
  let out = "";
  for (const ch of s) {
    if (ch !== "²") {
      out += ch;
      continue;
    }
    if (out.endsWith("x")) {
      out = `${out.slice(0, -1)}sq(x)`;
      continue;
    }
    let depth = 0;
    let j = out.length - 1;
    for (; j >= 0; j--) {
      if (out[j] === ")") depth++;
      if (out[j] === "(") depth--;
      if (depth === 0) break;
    }
    if (j < 0 || !out.endsWith(")")) throw new Error(`cannot square in ${term}`);
    out = `${out.slice(0, j)}sq(${out.slice(j)})`;
  }
  out = out.replace(/(\d+(?:\.\d+)?)\^x/g, "pw($1,x)").replace(/([0-9.)x])(?=[(xsp])/g, "$1*");
  const compiled = new Function("x", "sq", "pw", `return ${out};`) as (x: number, sq: (v: number) => number, pw: (b: number, e: number) => number) => number;
  return (x) => compiled(x, (v) => v * v, Math.pow);
}

/** The right side of "p: y = …" or "(2) y = …". */
const rhs = (line: string) => line.slice(line.indexOf("=") + 1);

/** a, b and c of a quadratic function from three of its values. */
function coeffs(f: (x: number) => number): [number, number, number] {
  const c = f(0);
  const p = f(1);
  const m = f(-1);
  return [(p + m - 2 * c) / 2, (p - m) / 2, c];
}

function isQuadratic(f: (x: number) => number): boolean {
  const [a, b, c] = coeffs(f);
  return Math.abs(a) > 1e-9 && [2, 3, -2.5, 4.5].every((x) => close(f(x), a * x * x + b * x + c, 1e-9));
}

/** The real roots of a·x² + b·x + c, sorted, computed here independently of the app. */
function roots(a: number, b: number, c: number): number[] {
  const D = b * b - 4 * a * c;
  if (D < -1e-9) return [];
  if (Math.abs(D) <= 1e-9) return [-b / (2 * a)];
  return [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((p, q) => p - q);
}

/** Named points such as "S(2 | −1)" or "P(−3 | 4,5)" in a text. */
function points(text: string): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {};
  for (const match of text.matchAll(/([A-Z])\((−?[\d,]+) \| (−?[\d,]+)\)/g)) out[match[1]] = [num(match[2]), num(match[3])];
  return out;
}

/** The largest (or smallest) value of f on (lo, hi), by a fine search. */
function extremum(f: (x: number) => number, lo: number, hi: number, kind: "max" | "min"): { x: number; y: number } {
  let best = { x: lo, y: kind === "max" ? -Infinity : Infinity };
  const steps = 20000;
  for (let i = 1; i < steps; i++) {
    const x = lo + ((hi - lo) * i) / steps;
    const y = f(x);
    if (kind === "max" ? y > best.y : y < best.y) best = { x, y };
  }
  return best;
}

describe("Etappe 7: Quadratische Funktionen und quadratische Gleichungen", () => {
  it("has the six lessons of LB 4 for Zweig II/III in order", () => {
    expect(STAGE_QUADRATISCH.id).toBe("stage-7-quadratisch");
    expect(STAGE_QUADRATISCH.lessons.map((lesson) => lesson.id)).toEqual(IDS);
    STAGE_QUADRATISCH.lessons.forEach((lesson, index) => {
      expect(lesson.stageId).toBe("stage-7-quadratisch");
      expect(lesson.stepNumber).toBe(index + 1);
      expect(lesson.title.startsWith(`7.${index + 1} `)).toBe(true);
      expect(lesson.tracks).toEqual(["II_III"]);
      expect(lesson.lehrplan.startsWith("M10 LB 4 (II/III): Quadratische Funktionen und quadratische Gleichungen")).toBe(true);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.lab.goals).toHaveLength(3);
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.explanationHtml).toContain('class="merke"');
    });
  });

  it("states the worked examples of the explanations correctly", () => {
    // 7.1: −2(x − 3)² + 1 = −2x² + 12x − 17
    expect(coeffs(fn("−2(x − 3)² + 1"))).toEqual([-2, 12, -17]);
    // 7.2: 2x² − 12x + 7 = 2(x − 3)² − 11 and −x² + 5x − 4 = −(x − 2,5)² + 2,25
    expect([2, -1, 0, 4, 7].every((x) => close(fn("2x² − 12x + 7")(x), fn("2(x − 3)² − 11")(x)))).toBe(true);
    expect([2, -1, 0, 4, 7].every((x) => close(fn("−x² + 5x − 4")(x), fn("−(x − 2,5)² + 2,25")(x)))).toBe(true);
    // 7.3: y = −0,5x² + x + 4 through (−2 | 0) and (4 | 0); 2(x − 1)² − 2 through P(3 | 6)
    expect(roots(-0.5, 1, 4)).toEqual([-2, 4]);
    expect(fn("2(x − 1)² − 2")(3)).toBe(6);
    // 7.4: A(x) = x(24 − 2x) largest at 6 with 72; the segment −0,5x² + 1,5x + 5 between −2 and 5, longest 6,125
    const area = extremum((x) => x * (24 - 2 * x), 0, 12, "max");
    expectClose(area.x, 6, "fence", 1e-3);
    expectClose(area.y, 72, "fence");
    expect(roots(-0.5, 1.5, 5)).toEqual([-2, 5]);
    expectClose(fn("−0,5x² + 2x + 4")(1.5) - fn("0,5x − 1")(1.5), 6.125, "segment");
    // 7.5: 2x² − 4x − 6 = 0 ⇒ L = {−1; 3}; 2x² − 4x + 2 = 0 has D = 0
    expect(roots(2, -4, -6)).toEqual([-1, 3]);
    expect((-4) ** 2 - 4 * 2 * 2).toBe(0);
    // 7.6: x² − 2x − 1 = x + 3 at −1 and 4; x² − 4 = −x² + 2x at −1 and 2; x² + 2x = x² − 4x + 6 only at 1
    expect(roots(1, -3, -4)).toEqual([-1, 4]);
    expect(roots(2, -2, -4)).toEqual([-1, 2]);
    expect(fn("x² + 2x")(1)).toBe(fn("x² − 4x + 6")(1));
  });
});

describe("7.1 Parabeln und ihre Parameter", () => {
  it("reads vertex, opening and shape from the stated equation", () => {
    for (const task of tasks("qf-1-parabeln", "erkennen", 1)) {
      const f = fn(rhs(task.given[0]));
      const [a, b] = coeffs(f);
      const xs = -b / (2 * a);
      const [fx, fy] = numbers(task);
      expectClose(fx, xs, task.prompt);
      expectClose(fy, f(xs), task.prompt);
      expect(Math.abs(a)).not.toBeCloseTo(1, 9);
      const shape = choices(task)[0];
      const shown = shape.options[shape.correctIndex];
      expect(shown, task.prompt).toContain(a > 0 ? "nach oben" : "nach unten");
      expect(shown, task.prompt).toContain(Math.abs(a) > 1 ? "gestreckt" : "gestaucht");
    }
  });

  it("finds the one parabola among equations that only look like one", () => {
    for (const task of tasks("qf-1-parabeln", "erkennen", 2)) {
      const functions = task.given.map((line) => fn(rhs(line)));
      const quadratic = functions.map(isQuadratic);
      expect(quadratic.filter(Boolean), task.given.join(" / ")).toHaveLength(1);
      const index = quadratic.indexOf(true);
      expect(choices(task)[0].correctIndex).toBe(index);
      const [a, , c] = coeffs(functions[index]);
      const [fa, fc] = numbers(task);
      expectClose(fa, a, task.given[index]);
      expectClose(fc, c, task.given[index]);
    }
  });

  it("turns a description of stretching, mirroring and shifting into a, x_S and y_S", () => {
    for (const task of tasks("qf-1-parabeln", "verschieben", 1)) {
      const factor = /mit dem Faktor ([\d,]+) (gestreckt|gestaucht)/.exec(task.prompt);
      const size = factor ? num(factor[1]) : 1;
      if (factor) expect(factor[2] === "gestreckt", task.prompt).toBe(size > 1);
      const a = (task.prompt.includes("gespiegelt") ? -1 : 1) * size;
      const sideways = /um ([\d,]+) nach (rechts|links)/.exec(task.prompt)!;
      const upwards = /um ([\d,]+) nach (oben|unten)/.exec(task.prompt);
      const xs = num(sideways[1]) * (sideways[2] === "rechts" ? 1 : -1);
      const ys = upwards ? num(upwards[1]) * (upwards[2] === "oben" ? 1 : -1) : 0;
      expect(numbers(task), task.prompt).toEqual([a, xs, ys]);
    }
  });

  it("reads height, place of the highest point and nozzle height of the fountain", () => {
    for (const task of tasks("qf-1-parabeln", "verschieben", 2)) {
      const f = fn(rhs(task.given[0]));
      const [a, b] = coeffs(f);
      const xs = -b / (2 * a);
      expect(a).toBeLessThan(0);
      const [height, distance, nozzle] = numbers(task);
      expectClose(height, f(xs), task.prompt);
      expectClose(distance, xs, task.prompt);
      expectClose(nozzle, f(0), task.prompt);
      expect(nozzle, "the nozzle is above the water and below the top").toBeGreaterThan(0);
      expect(nozzle).toBeLessThan(height);
    }
  });
});

describe("7.2 Scheitelpunktsform und allgemeine Form", () => {
  it("completes the square to the right vertex and Wertemenge", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("qf-2-scheitelpunkt", "ergaenzen", level)) {
        const f = fn(rhs(task.given[0]));
        const [a, b] = coeffs(f);
        const xs = -b / (2 * a);
        const [fx, fy] = numbers(task);
        expectClose(fx, xs, task.prompt);
        expectClose(fy, f(xs), task.prompt);
        expect(Math.abs(xs)).toBeGreaterThan(0.1);
        if (level === 2) {
          const set = choices(task)[0];
          expect(set.options[set.correctIndex]).toContain(a > 0 ? "≥" : "≤");
        }
      }
    }
  });

  it("multiplies the vertex form out to the stated b and c", () => {
    for (const task of tasks("qf-2-scheitelpunkt", "allgemeine-form", 1)) {
      const [, b, c] = coeffs(fn(rhs(task.given[0])));
      const [fb, fc] = numbers(task);
      expectClose(fb, b, task.prompt);
      expectClose(fc, c, task.prompt);
    }
  });

  it("uses the vertex form for the roots and the general form for the y-intercept", () => {
    for (const task of tasks("qf-2-scheitelpunkt", "allgemeine-form", 2)) {
      const f = fn(rhs(task.given[0]));
      const zeros = roots(...coeffs(f));
      expect(zeros, task.prompt).toHaveLength(2);
      const [x1, x2, c] = numbers(task);
      [x1, x2].sort((p, q) => p - q).forEach((x, i) => expectClose(x, zeros[i], task.prompt));
      expectClose(c, f(0), task.prompt);
      expect(task.anyOrder).toEqual([0, 1]);
    }
  });

  it("gives 𝔻 = ℝ and the Wertemenge on the side of the opening", () => {
    for (const task of tasks("qf-2-scheitelpunkt", "wertemenge", 1)) {
      const f = fn(rhs(task.given[0]));
      const [a, b] = coeffs(f);
      const [domain, relation] = choices(task);
      expect(domain.options[domain.correctIndex]).toBe("ℝ");
      expectClose(numbers(task)[0], f(-b / (2 * a)), task.prompt);
      expect(relation.correctIndex).toBe(a > 0 ? 0 : 1);
    }
  });

  it("finds the Wertemenge on a restricted Definitionsmenge with the vertex inside", () => {
    for (const task of tasks("qf-2-scheitelpunkt", "wertemenge", 2)) {
      const f = fn(rhs(task.given[0]));
      const [, lo, hi] = /\{x \| (−?[\d,]+) ≤ x ≤ (−?[\d,]+)\}/.exec(task.given[1])!.map((part, i) => (i === 0 ? 0 : num(part)));
      const [a, b] = coeffs(f);
      const xs = -b / (2 * a);
      expect(xs > lo && xs < hi, task.prompt).toBe(true);
      const low = extremum(f, lo, hi, "min").y;
      const high = extremum(f, lo, hi, "max").y;
      const [fmin, fmax] = numbers(task);
      expectClose(fmin, Math.min(low, f(lo), f(hi)), task.prompt, 1e-4);
      expectClose(fmax, Math.max(high, f(lo), f(hi)), task.prompt, 1e-4);
    }
  });
});

describe("7.3 Parabelgleichungen bestimmen", () => {
  it("finds a from the vertex and one point", () => {
    for (const task of tasks("qf-3-bestimmungsstuecke", "scheitel-punkt", 1)) {
      const { S, P } = points(task.given.join(" "));
      const a = (P[1] - S[1]) / (P[0] - S[0]) ** 2;
      expectClose(numbers(task)[0], a, task.prompt);
    }
  });

  it("fits arches and the general form through vertex and point", () => {
    let arches = 0;
    for (const task of tasks("qf-3-bestimmungsstuecke", "scheitel-punkt", 2)) {
      if (task.given[0].startsWith("Breite")) {
        arches += 1;
        const w = num(/Breite am Boden ([\d,]+) m/.exec(task.given[0])![1]);
        const h = num(/Höhe ([\d,]+) m/.exec(task.given[1])![1]);
        const a = -h / (w / 2) ** 2;
        const height = a * (w / 2 - 1) ** 2 + h;
        const [fa, fh] = numbers(task);
        expectClose(fa, a, task.prompt);
        expectClose(fh, height, task.prompt);
        expect(height > 0 && height < h).toBe(true);
        continue;
      }
      const { S, P } = points(task.given.join(" "));
      const a = (P[1] - S[1]) / (P[0] - S[0]) ** 2;
      const [fa, fb, fc] = numbers(task);
      expectClose(fa, a, task.prompt);
      expectClose(fb, -2 * a * S[0], task.prompt);
      expectClose(fc, a * S[0] * S[0] + S[1], task.prompt);
    }
    expect(arches).toBeGreaterThan(50);
  });

  it("solves the linear system for b and c when a and two points are given", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("qf-3-bestimmungsstuecke", "zwei-punkte", level)) {
        const form = /y = (−?[\d,]*)x² \+ bx \+ c/.exec(task.given.join(" "))!;
        const a = form[1] === "" ? 1 : form[1] === "−" ? -1 : num(form[1]);
        const { P, Q } = points(task.given.join(" "));
        const b = (Q[1] - a * Q[0] ** 2 - (P[1] - a * P[0] ** 2)) / (Q[0] - P[0]);
        const c = P[1] - a * P[0] ** 2 - b * P[0];
        const answers = numbers(task);
        expectClose(answers[0], b, task.prompt);
        expectClose(answers[1], c, task.prompt);
        if (level === 2) {
          expectClose(answers[2], -b / (2 * a), task.prompt);
          expectClose(answers[3], c - (b * b) / (4 * a), task.prompt);
        }
      }
    }
  });

  it("draws vertex and point on grid points of the graph and reads the equation from them", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("qf-3-bestimmungsstuecke", "graph", level)) {
        const marks = [...task.prompt.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="5"/g)].map((m) => [(Number(m[1]) - 10) / 20 - 6, 6 - (Number(m[2]) - 10) / 20]);
        expect(marks, task.prompt).toHaveLength(2);
        for (const [x, y] of marks) {
          expect(Number.isInteger(Math.round(x * 1e6) / 1e6) && Number.isInteger(Math.round(y * 1e6) / 1e6), `${x}, ${y}`).toBe(true);
          expect(Math.abs(x) <= 6 && Math.abs(y) <= 6).toBe(true);
        }
        const [[xs, ys], [xp, yp]] = marks.map(([x, y]) => [Math.round(x), Math.round(y)]);
        const a = (yp - ys) / (xp - xs) ** 2;
        const answers = numbers(task);
        if (level === 1) {
          expect(answers.slice(0, 2)).toEqual([xs, ys]);
          expectClose(answers[2], a, task.prompt);
        } else {
          expectClose(answers[0], a, task.prompt);
          expectClose(answers[1], -2 * a * xs, task.prompt);
          expectClose(answers[2], a * xs * xs + ys, task.prompt);
        }
      }
    }
  });
});

describe("7.4 Extremwertprobleme", () => {
  it("builds the largest enclosure for every fence shape", () => {
    for (const task of tasks("qf-4-extremwerte", "gehege", 1)) {
      const L = num(/Zaunlänge (\d+) m/.exec(task.given[0])![1]);
      const [, k, j] = /(\d)x \+ (\d?)y = \d+/.exec(task.given[1])!.map((part, i) => (i === 0 ? 0 : part === "" ? 1 : Number(part)));
      const best = extremum((x) => (x * (L - k * x)) / j, 0, L / k, "max");
      const [upper, x, area] = numbers(task);
      expectClose(upper, L / k, task.prompt);
      expectClose(x, best.x, task.prompt, 1e-3);
      expectClose(area, best.y, task.prompt, 1e-6);
      expect(x > 0 && x < upper).toBe(true);
    }
  });

  it("finds the largest of the changed rectangles inside 𝔻", () => {
    for (const task of tasks("qf-4-extremwerte", "gehege", 2)) {
      const [, l, w] = /Länge (\d+) cm, Breite (\d+) cm/.exec(task.given[0])!.map(Number);
      const grow = /neue Breite \(\d+ \+ (\d*)x\) cm/.exec(task.given[1])![1];
      const k = grow === "" ? 1 : Number(grow);
      const best = extremum((x) => (l - x) * (w + k * x), 0, l, "max");
      const [upper, x, area] = numbers(task);
      expect(upper).toBe(l);
      expectClose(x, best.x, task.prompt, 1e-3);
      expectClose(area, best.y, task.prompt, 1e-6);
      expect(x).toBeGreaterThanOrEqual(1);
    }
  });

  it("takes the longest segment and the largest rhombus between parabola and line", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("qf-4-extremwerte", "schar", level)) {
        const p = fn(rhs(task.given[level === 1 ? 0 : 1]));
        const g = fn(rhs(task.given[level === 1 ? 1 : 0]));
        const d = (x: number) => p(x) - g(x);
        const [r1, r2] = roots(...coeffs(d));
        expect(r2 - r1, task.prompt).toBeGreaterThan(1);
        const best = extremum(d, r1, r2, "max");
        expect(d((r1 + r2) / 2)).toBeGreaterThan(0);
        const answers = numbers(task);
        if (level === 1) {
          expectClose(answers[0], best.x, task.prompt, 1e-3);
          expectClose(answers[1], best.y, task.prompt, 1e-6);
        } else {
          const diagonal = Number(/= (\d+) LE/.exec(task.given[2])![1]);
          expectClose(answers[0], r1, task.prompt);
          expectClose(answers[1], r2, task.prompt);
          expectClose(answers[2], best.x, task.prompt, 1e-3);
          expectClose(answers[3], (diagonal / 2) * best.y, task.prompt, 1e-6);
        }
      }
    }
  });

  it("finds the smallest inscribed square and parallelogram for an x inside 𝔻", () => {
    for (const task of tasks("qf-4-extremwerte", "minimum", 1)) {
      const s = Number(/Seitenlänge (\d+) cm/.exec(task.given[0])![1]);
      const best = extremum((x) => s * s - 2 * x * (s - x), 0, s, "min");
      const [x, area] = numbers(task);
      expectClose(x, best.x, task.prompt, 1e-3);
      expectClose(area, best.y, task.prompt, 1e-6);
    }
    for (const task of tasks("qf-4-extremwerte", "minimum", 2)) {
      const l = Number(/AB = (\d+) cm/.exec(task.given[0])![1]);
      const w = Number(/BC = (\d+) cm/.exec(task.given[1])![1]);
      expect(l).toBeGreaterThan(w);
      const best = extremum((x) => l * w - x * (l - x) - x * (w - x), 0, w, "min");
      const [upper, x, area] = numbers(task);
      expect(upper).toBe(w);
      expectClose(x, best.x, task.prompt, 1e-3);
      expectClose(area, best.y, task.prompt, 1e-6);
      expect(x).toBeLessThan(w);
    }
  });
});

describe("7.5 Lösungsformel, Diskriminante und Nullstellen", () => {
  const abc = (line: string) => [...line.matchAll(/[abc] = (−?\d+(?:,\d+)?)/g)].map((m) => num(m[1])) as [number, number, number];

  it("solves with the Lösungsformel what the prompt states", () => {
    for (const task of tasks("qf-5-loesungsformel", "loesungsformel", 1)) {
      const [a, b, c] = abc(task.given[0]);
      const stated = coeffs(fn(/Gleichung (.+) = 0 mit/.exec(task.prompt)![1]));
      stated.forEach((value, i) => expectClose(value, [a, b, c][i], task.prompt));
      const [D, x1, x2] = numbers(task);
      expect(D).toBe(b * b - 4 * a * c);
      roots(a, b, c).forEach((x, i) => expectClose([x1, x2][i], x, task.prompt));
    }
    for (const task of tasks("qf-5-loesungsformel", "loesungsformel", 2)) {
      const [left, right] = task.given[0].split(" = ");
      const f = (x: number) => fn(left)(x) - fn(right)(x);
      const zeros = roots(...coeffs(f));
      expect(zeros, task.given[0]).toHaveLength(2);
      expect(zeros[1] - zeros[0], "two solutions stay apart after rounding").toBeGreaterThan(0.05);
      const found = numbers(task).sort((p, q) => p - q);
      expectClose(found[0], zeros[0], task.given[0]);
      expectClose(found[1], zeros[1], task.given[0]);
    }
  });

  it("decides the number of solutions by the sign of D", () => {
    for (const task of tasks("qf-5-loesungsformel", "anzahl", 1)) {
      const [a, b, c] = abc(task.given[0]);
      const D = b * b - 4 * a * c;
      expect(numbers(task)[0]).toBe(D);
      expect(choices(task)[0].correctIndex).toBe(D < 0 ? 0 : D === 0 ? 1 : 2);
      expect(roots(a, b, c)).toHaveLength(D < 0 ? 0 : D === 0 ? 1 : 2);
    }
    for (const task of tasks("qf-5-loesungsformel", "anzahl", 2)) {
      const [a, b] = coeffs(fn(task.given[0].split(" + c = 0")[0]));
      const c0 = (b * b) / (4 * a);
      const [c, x] = numbers(task);
      expectClose(c, c0, task.prompt);
      expectClose(x, -b / (2 * a), task.prompt);
      const twice = choices(task)[0];
      expect(twice.options[twice.correctIndex].startsWith(a > 0 ? "c <" : "c >")).toBe(true);
      // one step away from c₀ on the chosen side there are two solutions, on the other none
      const side = a > 0 ? -1 : 1;
      expect(roots(a, b, c0 + side)).toHaveLength(2);
      expect(roots(a, b, c0 - side)).toHaveLength(0);
    }
  });

  it("finds the zeros without and with the Lösungsformel, and only the landing point that fits", () => {
    for (const task of tasks("qf-5-loesungsformel", "nullstellen", 1)) {
      const zeros = roots(...coeffs(fn(rhs(task.given[0]))));
      numbers(task).sort((p, q) => p - q).forEach((x, i) => expectClose(x, zeros[i], task.prompt));
    }
    for (const task of tasks("qf-5-loesungsformel", "nullstellen", 2)) {
      const h = fn(rhs(task.given[0]));
      const [back, landing] = roots(...coeffs(h));
      expect(back).toBeLessThan(0);
      expect(landing).toBeGreaterThan(0);
      expect(h(0) >= 0.8 && h(0) <= 3, "release height").toBe(true);
      expectClose(numbers(task)[0], landing, task.prompt);
    }
  });
});

describe("7.6 Schnittpunkte von Parabel und Gerade bzw. zweier Parabeln", () => {
  it("computes both intersection points of parabola and line", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("qf-6-schnittpunkte", "schnittpunkte", level)) {
        const p = fn(rhs(task.given[0]));
        const g = fn(rhs(task.given[1]));
        const xs = roots(...coeffs((x) => p(x) - g(x)));
        expect(xs, task.prompt).toHaveLength(2);
        const [x1, y1, x2, y2] = numbers(task);
        expectClose(x1, xs[0], task.prompt);
        expectClose(x2, xs[1], task.prompt);
        expectClose(y1, g(xs[0]), task.prompt);
        expectClose(y2, g(xs[1]), task.prompt);
        expectClose(p(xs[1]), g(xs[1]), task.prompt);
      }
    }
  });

  it("intersects two parabolas, and lets them touch for the computed e", () => {
    for (const task of tasks("qf-6-schnittpunkte", "zwei-parabeln", 1)) {
      const p1 = fn(rhs(task.given[0]));
      const p2 = fn(rhs(task.given[1]));
      const xs = roots(...coeffs((x) => p1(x) - p2(x)));
      expect(xs).toHaveLength(2);
      const [x1, y1, x2, y2] = numbers(task);
      expectClose(x1, xs[0], task.prompt);
      expectClose(y1, p1(xs[0]), task.prompt);
      expectClose(x2, xs[1], task.prompt);
      expectClose(y2, p2(xs[1]), task.prompt);
    }
    for (const task of tasks("qf-6-schnittpunkte", "zwei-parabeln", 2)) {
      const p1 = fn(rhs(task.given[0]));
      const base = fn(rhs(task.given[1]).replace(" + e", ""));
      const [A, B, C] = coeffs((x) => p1(x) - base(x));
      expect(Math.abs(A)).toBeGreaterThan(0.1);
      const e = C - (B * B) / (4 * A);
      const [fe, x0, y0] = numbers(task);
      expectClose(fe, e, task.prompt);
      expect(roots(A, B, C - e), "exactly one common point").toHaveLength(1);
      expectClose(x0, -B / (2 * A), task.prompt);
      expectClose(y0, p1(x0), task.prompt);
      expectClose(base(x0) + e, y0, task.prompt);
    }
  });

  it("names Sekante, Tangente and Passante by the discriminant, and the t of the tangent", () => {
    for (const task of tasks("qf-6-schnittpunkte", "lage", 1)) {
      const p = fn(rhs(task.given[0]));
      const g = fn(rhs(task.given[1]));
      const [A, B, C] = coeffs((x) => p(x) - g(x));
      const D = B * B - 4 * A * C;
      expectClose(numbers(task)[0], D, task.prompt, 1e-9);
      const kind = Math.abs(D) < 1e-9 ? 1 : D > 0 ? 2 : 0;
      expect(choices(task)[0].correctIndex, task.prompt).toBe(kind);
    }
    for (const task of tasks("qf-6-schnittpunkte", "lage", 2)) {
      const p = fn(rhs(task.given[0]));
      const lineText = rhs(task.given[1]).trim();
      const slope = lineText === "t" ? 0 : fn(lineText.replace(" + t", ""))(1);
      const [A, B, C] = coeffs((x) => p(x) - slope * x);
      const t0 = C - (B * B) / (4 * A);
      expectClose(numbers(task)[0], t0, task.prompt);
      expect(roots(A, B, C - t0)).toHaveLength(1);
      const passing = choices(task)[0];
      const below = passing.options[passing.correctIndex].startsWith("t <");
      expect(roots(A, B, C - (below ? t0 - 1 : t0 + 1)), "a Passante misses the parabola").toHaveLength(0);
      expect(roots(A, B, C - (below ? t0 + 1 : t0 - 1)), "the other side cuts it").toHaveLength(2);
    }
  });
});

describe("Labore der Etappe 7", () => {
  const lab = (id: string) => findLessonById(id)!.lesson.lab;

  it("completes x² + px exactly with the side p : 2 and reads the true vertex", () => {
    for (const values of enumerateLabGrid(lab("qf-2-scheitelpunkt"), 9)) {
      expect(completionFits(values)).toBe(Math.abs(values.s - Math.abs(values.p) / 2) < 1e-9);
      const f = (x: number) => values.a * x * x + values.a * values.p * x + values.c;
      const [a, b] = coeffs(f);
      const { xs, ys } = completedVertex(values);
      expectClose(xs, -b / (2 * a), JSON.stringify(values));
      expectClose(ys, f(-b / (2 * a)), JSON.stringify(values));
    }
  });

  it("draws the parabola through the dragged points", () => {
    for (const values of enumerateLabGrid(lab("qf-3-bestimmungsstuecke"), 5)) {
      const fit = fitParabola(values);
      if (!fit.ok) continue;
      const f = (x: number) => fit.a * x * x + fit.b * x + fit.c;
      const where = JSON.stringify(values);
      expectClose(f(values.xp), values.yp, where, 1e-9);
      if (values.mode === 0) {
        expectClose(-fit.b / (2 * fit.a), values.xs, where, 1e-9);
        expectClose(f(values.xs), values.ys, where, 1e-9);
      } else {
        expect(fit.a).toBe(values.a);
        expectClose(f(values.xq), values.yq, where, 1e-9);
      }
    }
  });

  it("gives the largest enclosure at the vertex of A(x) for every fence", () => {
    for (const mode of [0, 1, 2]) {
      for (const L of [24, 30, 36]) {
        const model = fenceModel(mode, L);
        const area = (x: number) => fenceArea({ mode, L, x } as LabValues);
        const best = extremum(area, 0, model.xmax, "max");
        expectClose(model.xBest, best.x, `${mode}/${L}`, 1e-3);
        expectClose(model.areaBest, best.y, `${mode}/${L}`, 1e-6);
        expectClose(area(model.xBest), model.areaBest, `${mode}/${L}`);
        expect(area(model.xmax + 0.5)).toBe(0);
      }
    }
  });

  it("finds exactly the common points of the fixed parabola and the second graph", () => {
    const { a, b, c } = BASE_PARABOLA;
    const p = (x: number) => a * x * x + b * x + c;
    for (const values of enumerateLabGrid(lab("qf-6-schnittpunkte"), 5)) {
      const info = intersectionInfo(values);
      const other = values.mode === 0 ? (x: number) => values.m * x + values.t : (x: number) => values.a2 * (x - values.d) ** 2 + values.e;
      for (const x of info.xs) expectClose(p(x), other(x), JSON.stringify(values), 1e-9);
      if (info.D !== null) expect(info.xs).toHaveLength(info.D > 0 ? 2 : info.D === 0 ? 1 : 0);
      else expect(values.mode === 1 && values.a2 === a).toBe(true);
    }
  });

  it("starts every lab of the stage away from all goals", () => {
    for (const id of IDS) {
      const l = lab(id);
      const start = defaultLabValues(l);
      expect(l.goals.some((goal) => goal.check(start, {})), id).toBe(false);
    }
  });
});
