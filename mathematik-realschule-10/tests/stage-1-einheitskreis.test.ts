import { describe, expect, it } from "vitest";
import { findLessonById } from "../src/curriculum";
import { EXACT_ITEMS, STAGE_EINHEITSKREIS, TERMS_KOMPLEMENT, TERMS_PYTHAGORAS, TERMS_SPECIAL, TERMS_SUMS } from "../src/curriculum/stage-1-einheitskreis";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { calculatorAngle, sameValueAngles, trig } from "../src/lab/views-einheitskreis";
import type { ChoiceField, ExerciseTask, NumberField } from "../src/model/types";

// Independent trigonometry in degrees, written out here rather than imported.
const RAD = Math.PI / 180;
const S = (a: number) => Math.sin(a * RAD);
const C = (a: number) => Math.cos(a * RAD);
const T = (a: number) => Math.tan(a * RAD);
const toNumber = (text: string) => Number(text.replace("−", "-").replace(",", "."));

const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-1:${i}`));

function tasks(lessonId: string, generatorId: string, level: 1 | 2): ExerciseTask[] {
  const generator = findLessonById(lessonId)?.lesson.exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

const numbers = (task: ExerciseTask) => task.fields.filter((f): f is NumberField => f.kind === "number");
const choice = (task: ExerciseTask) => task.fields.find((f): f is ChoiceField => f.kind === "choice")!;
const meta = (task: ExerciseTask) => task.meta ?? {};

/** Sign changes of f − k on a fine grid in [from; to[, jumps through asymptotes left out. */
function countSolutions(f: (a: number) => number, k: number, from: number, to: number): number {
  let count = 0;
  let prev = f(from + 0.1) - k;
  for (let a = from + 0.35; a < to; a += 0.25) {
    const cur = f(a) - k;
    if (prev * cur < 0 && Math.abs(cur - prev) < 2) count += 1;
    prev = cur;
  }
  return count;
}

/** The angle between two lines with slopes m1 and m2, from their direction vectors. */
const angleBetween = (m1: number, m2: number) => Math.acos(Math.abs(1 + m1 * m2) / Math.sqrt((1 + m1 * m1) * (1 + m2 * m2))) / RAD;

/** "−0,5x + 2", "x − 3", "2x" → slope and intercept. */
function parseLinear(text: string): { m: number; t: number } {
  const match = /^(−?[\d,]*)x(?: ([+−]) ([\d,]+))?$/.exec(text.trim());
  if (!match) throw new Error(`no line: ${text}`);
  const m = match[1] === "" ? 1 : match[1] === "−" ? -1 : toNumber(match[1]);
  const t = match[2] ? (match[2] === "−" ? -1 : 1) * toNumber(match[3]) : 0;
  return { m, t };
}

// The terms of the simplification tasks, transcribed from their text.
const RAW: Record<string, (a: number, b: number) => number> = {
  "(1 − cos²α) : sin α": (a) => (1 - C(a) ** 2) / S(a),
  "tan α · cos α": (a) => T(a) * C(a),
  "sin²α + cos²α + 1": (a) => S(a) ** 2 + C(a) ** 2 + 1,
  "(1 − sin²α) : cos α": (a) => (1 - S(a) ** 2) / C(a),
  "sin α : tan α": (a) => S(a) / T(a),
  "1 − sin²α": (a) => 1 - S(a) ** 2,
  "(sin α + cos α)² + (sin α − cos α)²": (a) => (S(a) + C(a)) ** 2 + (S(a) - C(a)) ** 2,
  "(1 − sin α) · (1 + sin α) : cos²α": (a) => ((1 - S(a)) * (1 + S(a))) / C(a) ** 2,
  "tan α · (1 − sin²α) : sin α": (a) => (T(a) * (1 - S(a) ** 2)) / S(a),
  "sin³α + sin α · cos²α": (a) => S(a) ** 3 + S(a) * C(a) ** 2,
  "(1 + tan²α) · cos²α": (a) => (1 + T(a) ** 2) * C(a) ** 2,
  "(sin α + cos α)² − 2 · sin α · cos α": (a) => (S(a) + C(a)) ** 2 - 2 * S(a) * C(a),
  "sin α · cos α · tan α + cos²α": (a) => S(a) * C(a) * T(a) + C(a) ** 2,
  "cos⁴α − sin⁴α + 2 · sin²α": (a) => C(a) ** 4 - S(a) ** 4 + 2 * S(a) ** 2,
  "sin(90° − α) · tan α": (a) => S(90 - a) * T(a),
  "cos(90° − α) : sin(90° − α)": (a) => C(90 - a) / S(90 - a),
  "sin²(90° − α) + sin²α": (a) => S(90 - a) ** 2 + S(a) ** 2,
  "cos(90° − α) · sin α + sin(90° − α) · cos α": (a) => C(90 - a) * S(a) + S(90 - a) * C(a),
  "sin(90° − α) · cos(90° − α) · tan α": (a) => S(90 - a) * C(90 - a) * T(a),
  "1 − cos²(90° − α)": (a) => 1 - C(90 - a) ** 2,
  "sin(90° − α) : cos α + 1": (a) => S(90 - a) / C(a) + 1,
  "tan α · cos α − cos(90° − α) + sin(90° − α)": (a) => T(a) * C(a) - C(90 - a) + S(90 - a),
  "sin(α + 90°)": (a) => S(a + 90),
  "cos(α + 90°)": (a) => C(a + 90),
  "sin(α − 90°)": (a) => S(a - 90),
  "cos(α − 90°)": (a) => C(a - 90),
  "sin(180° − α)": (a) => S(180 - a),
  "cos(180° − α)": (a) => C(180 - a),
  "sin(α + 180°)": (a) => S(a + 180),
  "cos(α + 180°)": (a) => C(a + 180),
  "sin(270° − α)": (a) => S(270 - a),
  "cos(360° − α)": (a) => C(360 - a),
  "sin(α + β) + sin(α − β)": (a, b) => S(a + b) + S(a - b),
  "sin(α + β) − sin(α − β)": (a, b) => S(a + b) - S(a - b),
  "cos(α + β) + cos(α − β)": (a, b) => C(a + b) + C(a - b),
  "cos(α − β) − cos(α + β)": (a, b) => C(a - b) - C(a + b),
  "sin(60° + α) − sin(60° − α)": (a) => S(60 + a) - S(60 - a),
  "cos(30° − α) − cos(30° + α)": (a) => C(30 - a) - C(30 + a),
  "sin(α + 30°) + cos(α + 60°)": (a) => S(a + 30) + C(a + 60),
  "cos(α + 45°) + sin(α + 45°)": (a) => C(a + 45) + S(a + 45),
  "sin(α + β) · cos β − cos(α + β) · sin β": (a, b) => S(a + b) * C(b) - C(a + b) * S(b),
  "cos(α + β) · cos β + sin(α + β) · sin β": (a, b) => C(a + b) * C(b) + S(a + b) * S(b),
};

const OPTION: Record<string, (a: number, b: number) => number> = {
  "0": () => 0,
  "1": () => 1,
  "2": () => 2,
  "sin α": (a) => S(a),
  "−sin α": (a) => -S(a),
  "cos α": (a) => C(a),
  "−cos α": (a) => -C(a),
  "tan α": (a) => T(a),
  "sin²α": (a) => S(a) ** 2,
  "cos²α": (a) => C(a) ** 2,
  "√2 · cos α": (a) => Math.SQRT2 * C(a),
  "2 · sin α · cos β": (a, b) => 2 * S(a) * C(b),
  "2 · cos α · sin β": (a, b) => 2 * C(a) * S(b),
  "2 · cos α · cos β": (a, b) => 2 * C(a) * C(b),
  "2 · sin α · sin β": (a, b) => 2 * S(a) * S(b),
};

const SAMPLES: Array<[number, number]> = [
  [23, 17],
  [41, 52],
  [67, 8],
  [112, 33],
  [199, 71],
  [301, 44],
];

/** The chosen option equals the term at every sample, every other option differs somewhere. */
function expectSimplification(task: ExerciseTask): void {
  const text = task.given[0].replace("Term: ", "");
  const raw = RAW[text];
  expect(raw, `term ${text}`).toBeDefined();
  const field = choice(task);
  const options = field.options.map((option) => {
    expect(OPTION[option], `option ${option}`).toBeDefined();
    return OPTION[option];
  });
  for (const [a, b] of SAMPLES) expect(raw(a, b), `${text} = ${field.options[field.correctIndex]} at ${a}°, ${b}°`).toBeCloseTo(options[field.correctIndex](a, b), 9);
  options.forEach((option, i) => {
    if (i === field.correctIndex) return;
    expect(SAMPLES.some(([a, b]) => Math.abs(raw(a, b) - option(a, b)) > 1e-6), `${text} ≠ ${field.options[i]}`).toBe(true);
  });
}

describe("Etappe 1: Lektionen", () => {
  it("has the six lessons in LehrplanPLUS order with their Zweige and Lernbereich", () => {
    expect(STAGE_EINHEITSKREIS.id).toBe("stage-1-einheitskreis");
    expect(STAGE_EINHEITSKREIS.lessons.map((l) => l.id)).toEqual([
      "tr-1-einheitskreis",
      "tr-2-winkel-bis-360",
      "tr-3-steigungswinkel",
      "tr-4-sinusfunktion",
      "tr-5-kosinus-tangens",
      "tr-6-additionstheoreme",
    ]);
    expect(STAGE_EINHEITSKREIS.lessons.map((l) => l.tracks)).toEqual([
      ["I", "II_III"],
      ["I", "II_III"],
      ["I", "II_III"],
      ["I", "II_III"],
      ["I"],
      ["I"],
    ]);
    for (const lesson of STAGE_EINHEITSKREIS.lessons) {
      expect(lesson.lehrplan, lesson.id).toContain("M10 LB 1 (I)");
      expect(lesson.lehrplan, lesson.id).toContain("Trigonometrie");
      expect(lesson.lehrplan.includes("(II/III)"), lesson.id).toBe(lesson.tracks.includes("II_III"));
      expect(lesson.stageId).toBe(STAGE_EINHEITSKREIS.id);
    }
  });

  it("writes HTML without bare angle brackets, so no prompt loses text to the parser", () => {
    for (const lesson of STAGE_EINHEITSKREIS.lessons) {
      const texts = [lesson.explanationHtml, ...lesson.formulas.map((f) => f.html)];
      for (const generator of lesson.exercises) {
        for (const level of [1, 2] as const) {
          for (const seed of SEEDS.slice(0, 40)) {
            const task = generator.make(createRng(seed), level);
            texts.push(task.prompt, ...task.given, ...task.steps, task.formulaHint ?? "", ...task.fields.map((f) => f.label));
          }
        }
      }
      for (const html of texts) expect(html, lesson.id).not.toMatch(/<(?![a-z/])/);
    }
  });

  it("states the exact values of the theorem examples correctly", () => {
    const EXACT: Record<string, number> = {
      "¼√6": Math.sqrt(6) / 4,
      "¼√2": Math.sqrt(2) / 4,
      "½√2": Math.SQRT1_2,
      "½": 0.5,
      "0": 0,
      "¼(√6 + √2)": (Math.sqrt(6) + Math.sqrt(2)) / 4,
      "¼(√6 − √2)": (Math.sqrt(6) - Math.sqrt(2)) / 4,
      "¼(√2 − √6)": (Math.sqrt(2) - Math.sqrt(6)) / 4,
      "−½": -0.5,
    };
    const last = (text: string) => text.split("=").pop()!.trim();
    for (const item of EXACT_ITEMS) {
      const value = trig(item.fn, item.a + item.op * item.b);
      const target = toNumber(/\d+/.exec(item.target)![0]);
      expect(value, item.target).toBeCloseTo(item.target.startsWith("sin") ? S(target) : C(target), 12);
      expect(EXACT[last(item.exact)], item.exact).toBeCloseTo(value, 12);
      const p1 = item.fn === 0 ? S(item.a) * C(item.b) : C(item.a) * C(item.b);
      const p2 = item.fn === 0 ? C(item.a) * S(item.b) : S(item.a) * S(item.b);
      expect(EXACT[last(item.p1)], item.p1).toBeCloseTo(p1, 12);
      expect(EXACT[last(item.p2)], item.p2).toBeCloseTo(p2, 12);
    }
  });

  it("lists only simplifications that are identities", () => {
    for (const item of [...TERMS_PYTHAGORAS[1], ...TERMS_PYTHAGORAS[2], ...TERMS_KOMPLEMENT, ...TERMS_SPECIAL, ...TERMS_SUMS]) {
      expect(RAW[item.text], item.text).toBeDefined();
      for (const [a, b] of SAMPLES) expect(RAW[item.text](a, b), `${item.text} = ${item.answer}`).toBeCloseTo(OPTION[item.answer](a, b), 9);
    }
  });
});

describe("Etappe 1: Aufgaben rechnen richtig", () => {
  it("1.1 Punkt: P(cos α | sin α) and tan α, and the Ferris wheel gondola", () => {
    for (const task of tasks("tr-1-einheitskreis", "punkt", 1)) {
      const { a } = meta(task);
      expect(a % 90).not.toBe(0);
      const [x, y, t] = numbers(task);
      expect(x.answer).toBeCloseTo(C(a), 12);
      expect(y.answer).toBeCloseTo(S(a), 12);
      expect(t.answer).toBeCloseTo(T(a), 9);
    }
    for (const task of tasks("tr-1-einheitskreis", "punkt", 2)) {
      const { r, hub, a } = meta(task);
      const [h, d] = numbers(task);
      expect(h.answer).toBeCloseTo(hub + r * S(a), 9);
      expect(d.answer).toBeCloseTo(Math.abs(r * C(a)), 9);
      expect(h.answer).toBeGreaterThan(1);
      // The side is never a matter of rounding: the gondola is clearly left or right.
      expect(d.answer).toBeGreaterThan(1.5);
      expect(choice(task).correctIndex === 0).toBe(C(a) > 0);
    }
  });

  it("1.1 Pythagoras: the other value with the sign of its quadrant", () => {
    const inQuadrant = (sin: number, cos: number, q: number) => {
      const angle = ((Math.atan2(sin, cos) / RAD) % 360 + 360) % 360;
      return angle > 90 * (q - 1) && angle < 90 * q;
    };
    for (const level of [1, 2] as const) {
      for (const task of tasks("tr-1-einheitskreis", "pythagoras", level)) {
        const { q, u, w, h, givenSin } = meta(task);
        expect(u * u + w * w).toBe(h * h);
        const [first, second] = numbers(task);
        if (level === 2) {
          expect(first.answer ** 2 + second.answer ** 2).toBeCloseTo(1, 12);
          expect(inQuadrant(first.answer, second.answer, q)).toBe(true);
          expect(first.answer / second.answer).toBeCloseTo(((q === 1 || q === 3 ? 1 : -1) * u) / w, 12);
        } else {
          const other = first.answer;
          const given = (givenSin === 1 ? u : w) / h;
          expect(other ** 2 + given ** 2).toBeCloseTo(1, 12);
          const sinV = givenSin === 1 ? (q <= 2 ? given : -given) : other;
          const cosV = givenSin === 1 ? other : q === 1 || q === 4 ? given : -given;
          expect(inQuadrant(sinV, cosV, q)).toBe(true);
          expect(second.answer).toBeCloseTo(sinV / cosV, 12);
        }
      }
    }
  });

  it("1.1 and 1.5 and 1.6: every simplification task has exactly one right option", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tr-1-einheitskreis", "terme", level)) expectSimplification(task);
      for (const task of tasks("tr-6-additionstheoreme", "vereinfachen", level)) expectSimplification(task);
    }
    for (const task of tasks("tr-5-kosinus-tangens", "komplement", 2)) expectSimplification(task);
  });

  it("1.2 Werte: the calculator values and the quadrant of negative and large angles", () => {
    for (const task of tasks("tr-2-winkel-bis-360", "werte", 1)) {
      const { a } = meta(task);
      const [s, c] = numbers(task);
      expect(s.answer).toBeCloseTo(S(a), 12);
      expect(c.answer).toBeCloseTo(C(a), 12);
      const turned = ((a % 360) + 360) % 360;
      expect(choice(task).correctIndex).toBe(Math.floor(turned / 90));
    }
    for (const task of tasks("tr-2-winkel-bis-360", "werte", 2)) {
      const { b } = meta(task);
      const given = [S(b), C(b), T(b)];
      for (const field of numbers(task)) {
        const match = /(sin|cos|tan)[ (](−?\d+)°/.exec(field.label)!;
        const fn = ["sin", "cos", "tan"].indexOf(match[1]);
        const angle = toNumber(match[2]);
        const direct = fn === 0 ? S(angle) : fn === 1 ? C(angle) : T(angle);
        expect(field.answer, field.label).toBeCloseTo(direct, 12);
        // Without a calculator: the same number as a given value, up to its sign.
        expect(Math.abs(Math.abs(field.answer) - given[fn])).toBeLessThan(1e-12);
      }
    }
  });

  it("1.2 Umkehrung: both angles in [0°; 360°[, and there are no others", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tr-2-winkel-bis-360", "umkehrung", level)) {
        const { fn, k } = meta(task);
        const f = [S, C, T][fn];
        const [a1, a2] = numbers(task).map((x) => x.answer);
        expect(task.anyOrder).toEqual([0, 1]);
        for (const angle of [a1, a2]) {
          expect(angle).toBeGreaterThanOrEqual(0);
          expect(angle).toBeLessThan(360);
          expect(f(angle)).toBeCloseTo(k, 9);
        }
        expect(Math.abs(a1 - a2)).toBeGreaterThan(1);
        expect(countSolutions(f, k, 0, 360), `${task.prompt}`).toBe(2);
        if (level === 2) {
          const { a, b } = meta(task);
          const right = toNumber(/= (−?[\d,]+) über/.exec(task.prompt)![1]);
          expect(a * k + b).toBeCloseTo(right, 9);
        }
      }
    }
  });

  it("1.3 Steigungswinkel: m = tan α, falling lines over 90°, lines through the given point", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("tr-3-steigungswinkel", "steigungswinkel", level)) {
        const m0 = meta(task);
        const fields = numbers(task);
        if (m0.variant === 0) {
          const alpha = fields[0].answer;
          expect(alpha).toBeGreaterThan(0);
          expect(alpha).toBeLessThan(180);
          expect(T(alpha)).toBeCloseTo(m0.m, 9);
          expect(alpha > 90).toBe(m0.m < 0);
        } else if (m0.variant === 1) {
          const [m, t] = fields.map((x) => x.answer);
          expect(m).toBeCloseTo(T(m0.alpha), 12);
          expect(m * m0.xp + t).toBeCloseTo(m0.yp, 9);
        } else if (m0.variant === 2) {
          const [m, t, height] = fields.map((x) => x.answer);
          expect(m).toBeCloseTo(T(m0.alpha), 12);
          expect(m * m0.xa + t).toBeCloseTo(0, 9);
          expect(height).toBeCloseTo(m * m0.xq + t, 9);
          expect(height).toBeGreaterThan(0);
        } else {
          const [alpha, m, x0] = fields.map((x) => x.answer);
          expect(alpha).toBe(180 - m0.beta);
          expect(m).toBeCloseTo(T(alpha), 12);
          expect(m).toBeLessThan(0);
          expect(m * x0 + m0.h0).toBeCloseTo(0, 9);
        }
      }
    }
  });

  it("1.3 Schnittwinkel: the smaller angle between the lines, checked with direction vectors", () => {
    for (const task of tasks("tr-3-steigungswinkel", "schnittwinkel", 1)) {
      const { m1, m2 } = meta(task);
      const [a1, a2, phi] = numbers(task).map((x) => x.answer);
      expect(T(a1)).toBeCloseTo(m1, 9);
      expect(T(a2)).toBeCloseTo(m2, 9);
      expect(phi).toBeCloseTo(angleBetween(m1, m2), 6);
      expect(phi).toBeGreaterThan(0);
      expect(phi).toBeLessThanOrEqual(90 + 1e-9);
    }
    for (const task of tasks("tr-3-steigungswinkel", "schnittwinkel", 2)) {
      const A = /A\((−?[\d,]+) \| (−?[\d,]+)\)/.exec(task.prompt)!.slice(1).map(toNumber);
      const B = /B\((−?[\d,]+) \| (−?[\d,]+)\)/.exec(task.prompt)!.slice(1).map(toNumber);
      const h = parseLinear(/Gleichung y = (.+?)\. Berechne/.exec(task.prompt)![1]);
      const m1 = (B[1] - A[1]) / (B[0] - A[0]);
      const t1 = A[1] - m1 * A[0];
      const x = (h.t - t1) / (m1 - h.m);
      const [xs, ys, phi] = numbers(task).map((f) => f.answer);
      expect(xs).toBeCloseTo(x, 9);
      expect(ys).toBeCloseTo(m1 * x + t1, 9);
      expect(ys).toBeCloseTo(h.m * x + h.t, 9);
      expect(phi).toBeCloseTo(angleBetween(m1, h.m), 6);
    }
  });

  it("1.4 Sinusgleichung: four angles in two periods, and the Ferris wheel heights", () => {
    for (const task of tasks("tr-4-sinusfunktion", "sinusgleichung", 1)) {
      const { k } = meta(task);
      const angles = numbers(task).map((x) => x.answer);
      expect(new Set(angles.map((x) => Math.round(x * 100))).size).toBe(4);
      for (const angle of angles) {
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(720);
        expect(S(angle)).toBeCloseTo(k, 9);
      }
      expect(countSolutions(S, k, 0, 720)).toBe(4);
    }
    for (const task of tasks("tr-4-sinusfunktion", "sinusgleichung", 2)) {
      const { r, hub, aq } = meta(task);
      const target = toNumber(/Gondel ([\d,]+) m hoch\?/.exec(task.prompt)![1]);
      const [a1, a2, hq] = numbers(task).map((x) => x.answer);
      for (const angle of [a1, a2]) expect(hub + r * S(angle)).toBeCloseTo(target, 9);
      expect(countSolutions((a) => hub + r * S(a), target, 0, 360)).toBe(2);
      expect(hq).toBeCloseTo(hub + r * S(aq), 9);
      expect(hub - r).toBeGreaterThanOrEqual(2);
    }
  });

  it("1.4 Kurve: extremes and zero in the interval, and the length of the longest day", () => {
    for (const task of tasks("tr-4-sinusfunktion", "kurve", 1)) {
      const { a } = meta(task);
      const [hi, lo, zero] = numbers(task).map((x) => x.answer);
      expect(S(hi)).toBeCloseTo(1, 12);
      expect(S(lo)).toBeCloseTo(-1, 12);
      expect(S(zero)).toBeCloseTo(0, 12);
      for (const x of [hi, lo, zero]) {
        expect(x).toBeGreaterThan(a);
        expect(x).toBeLessThan(a + 360);
      }
    }
    for (const task of tasks("tr-4-sinusfunktion", "kurve", 2)) {
      const { mean, amp, aq } = meta(task);
      const [longest, at, dq] = numbers(task).map((x) => x.answer);
      const grid = Array.from({ length: 3600 }, (_, i) => mean + amp * S(i / 10));
      expect(longest).toBeCloseTo(Math.max(...grid), 6);
      expect(S(at)).toBeCloseTo(1, 12);
      expect(dq).toBeCloseTo(mean + amp * S(aq), 9);
      expect(mean - amp).toBeGreaterThan(6);
      expect(mean + amp).toBeLessThan(18);
    }
  });

  it("1.5 Komplement and graphs: complement angles, zeros, extremes, asymptotes and contexts", () => {
    for (const task of tasks("tr-5-kosinus-tangens", "komplement", 1)) {
      const { b1, b2 } = meta(task);
      const [c1, c2] = numbers(task).map((x) => x.answer);
      expect(C(c1)).toBeCloseTo(S(b1), 12);
      expect(S(c2)).toBeCloseTo(C(b2), 12);
      for (const x of [c1, c2]) {
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(90);
      }
    }
    for (const task of tasks("tr-5-kosinus-tangens", "graphen", 1)) {
      const { type, a } = meta(task);
      const values = numbers(task).map((x) => x.answer);
      for (const x of values) {
        expect(x).toBeGreaterThanOrEqual(a);
        expect(x).toBeLessThan(a + 360);
      }
      if (type === 0) {
        for (const x of values) expect(C(x)).toBeCloseTo(0, 12);
        expect(countSolutions(C, 0, a, a + 360)).toBe(2);
      } else if (type === 1) {
        expect(C(values[0])).toBeCloseTo(1, 12);
        expect(C(values[1])).toBeCloseTo(-1, 12);
      } else if (type === 2) {
        for (const x of values) expect(S(x)).toBeCloseTo(0, 12);
      } else {
        for (const x of values) expect(C(x)).toBeCloseTo(0, 12);
      }
      if (type !== 1) expect(new Set(values).size).toBe(2);
    }
    for (const task of tasks("tr-5-kosinus-tangens", "graphen", 2)) {
      const m0 = meta(task);
      const values = numbers(task).map((x) => x.answer);
      if (m0.variant === 0) {
        const target = toNumber(/Gondel ([\d,]+) m hoch, und/.exec(task.prompt)![1]);
        for (const x of values.slice(0, 2)) expect(m0.hub - m0.r * C(x)).toBeCloseTo(target, 9);
        expect(countSolutions((x) => m0.hub - m0.r * C(x), target, 0, 360)).toBe(2);
        expect(m0.hub - m0.r * C(values[2])).toBeCloseTo(m0.hub + m0.r, 12);
      } else {
        expect(values[0]).toBeCloseTo(m0.d * T(m0.a1), 9);
        expect(m0.d * T(values[1])).toBeCloseTo(m0.s2, 9);
        const field = choice(task);
        expect(field.options[field.correctIndex]).toContain("parallel");
      }
    }
  });

  it("1.6 Exakt: products, results and recognised theorems agree with direct computation", () => {
    for (const task of tasks("tr-6-additionstheoreme", "exakt", 1)) {
      const item = EXACT_ITEMS[meta(task).item];
      const [p1, p2, result] = numbers(task);
      const parse = (label: string) => [...label.matchAll(/(sin|cos) (\d+)°/g)].map((m) => (m[1] === "sin" ? S : C)(toNumber(m[2])));
      const [f1, g1] = parse(p1.label);
      const [f2, g2] = parse(p2.label);
      expect(p1.answer).toBeCloseTo(f1 * g1, 12);
      expect(p2.answer).toBeCloseTo(f2 * g2, 12);
      const target = toNumber(/(\d+)°/.exec(item.target)![1]);
      expect(result.answer).toBeCloseTo(item.fn === 0 ? S(target) : C(target), 12);
      const op = task.prompt.includes(`${item.a}° + ${item.b}°`) ? 1 : -1;
      expect(result.answer).toBeCloseTo(item.fn === 0 ? p1.answer + op * p2.answer : p1.answer - op * p2.answer, 12);
    }
    for (const task of tasks("tr-6-additionstheoreme", "exakt", 2)) {
      const m0 = meta(task);
      const fields = numbers(task);
      if (m0.variant === 0) {
        const parts = [...task.prompt.matchAll(/(sin|cos) (\d+)°/g)].slice(0, 4).map((m) => (m[1] === "sin" ? S : C)(toNumber(m[2])));
        const sign = /° ([+−]) (?:cos|sin) /.exec(task.prompt)![1] === "+" ? 1 : -1;
        expect(fields[0].answer).toBeCloseTo(parts[0] * parts[1] + sign * parts[2] * parts[3], 12);
      } else {
        const { p1, q1, h1, p2, q2, h2 } = m0;
        expect(p1 * p1 + q1 * q1).toBe(h1 * h1);
        expect(p2 * p2 + q2 * q2).toBe(h2 * h2);
        const alpha = Math.asin(p1 / h1) / RAD;
        const beta = Math.acos(q2 / h2) / RAD;
        const exact: Record<string, number> = {
          "sin(α + β)": S(alpha + beta),
          "sin(α − β)": S(alpha - beta),
          "cos(α + β)": C(alpha + beta),
          "cos(α − β)": C(alpha - beta),
        };
        for (const field of fields) expect(field.answer, field.label).toBeCloseTo(exact[field.label.replace(" =", "")], 12);
      }
    }
  });
});

describe("Etappe 1: Labore rechnen richtig", () => {
  const lab = (id: string) => findLessonById(id)!.lesson.lab;

  it("keeps sin²α + cos²α = 1 on the unit circle and leaves tan undefined only at 90° and 270°", () => {
    for (const values of enumerateLabGrid(lab("tr-1-einheitskreis"), 360)) {
      const r = computeReadouts(lab("tr-1-einheitskreis"), values);
      expect(r.pyth).toBeCloseTo(1, 12);
      expect(typeof r.tan === "string").toBe(values.alpha === 90 || values.alpha === 270);
    }
  });

  it("names every angle with the same value and the calculator's angle among them", () => {
    for (const fn of [0, 1, 2]) {
      for (let alpha = -180; alpha <= 360; alpha += 1) {
        const angles = sameValueAngles(fn, alpha);
        const calc = calculatorAngle(fn, alpha);
        const f = [S, C, T][fn];
        if (fn === 2 && Math.abs(C(alpha)) < 1e-9) {
          expect(angles).toEqual([]);
          expect(calc).toBeNull();
          continue;
        }
        for (const x of angles) expect(f(x)).toBeCloseTo(f(alpha), 9);
        expect(angles.length).toBe(fn === 2 ? 2 : Math.abs(Math.abs(f(alpha)) - 1) < 1e-12 ? 1 : 2);
        expect(angles.some((x) => Math.abs(x - (((calc! % 360) + 360) % 360)) < 1e-6)).toBe(true);
      }
    }
  });

  it("shows the intersection angle of the slope lab as the angle between the directions", () => {
    const slope = lab("tr-3-steigungswinkel");
    for (let a1 = 0; a1 < 180; a1 += 7) {
      for (let a2 = 0; a2 < 180; a2 += 11) {
        if (a1 === a2) continue;
        const r = computeReadouts(slope, { ...defaultLabValues(slope), a1, a2 });
        const cos = Math.abs(C(a1) * C(a2) + S(a1) * S(a2));
        expect(r.phi as number).toBeCloseTo(Math.acos(Math.min(1, cos)) / RAD, 6);
      }
    }
  });

  it("matches the addition theorems in the lab readouts and lets the naive sum differ", () => {
    const add = lab("tr-6-additionstheoreme");
    let differs = 0;
    for (const values of enumerateLabGrid(add, 19)) {
      const r = computeReadouts(add, values);
      expect(r.sinTheorem as number).toBeCloseTo(r.sinSumme as number, 12);
      expect(r.cosTheorem as number).toBeCloseTo(r.cosSumme as number, 12);
      if (Math.abs((r.sinFalsch as number) - (r.sinSumme as number)) > 0.01) differs += 1;
    }
    expect(differs).toBeGreaterThan(100);
  });

  it("keeps the Ferris wheel gondola between 2 m and 42 m", () => {
    const sine = lab("tr-4-sinusfunktion");
    for (const values of enumerateLabGrid(sine, 145)) {
      const h = computeReadouts(sine, values).h as number;
      expect(h).toBeGreaterThanOrEqual(2 - 1e-9);
      expect(h).toBeLessThanOrEqual(42 + 1e-9);
    }
  });
});
