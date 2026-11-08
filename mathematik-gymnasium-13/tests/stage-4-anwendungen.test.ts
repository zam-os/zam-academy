import { describe, expect, it } from "vitest";
import {
  checkTask,
  toleranceOf,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  withChanges,
} from "../src/lab/engine";
import {
  chainG,
  chainH,
  chainHPrime,
  chainInner,
  chainOuter,
  extremAnalyse,
  paramDf,
  paramF,
  rateWerte,
  sachWerte,
  SACH_START_X,
} from "../src/lab/views-4-anwendungen";
import { labView } from "../src/lab/visuals";
import { STAGE_ANWENDUNGEN } from "../src/curriculum/stage-4-anwendungen";
import type {
  ChoiceField,
  ExerciseTask,
  LabDefinition,
  NumberField,
} from "../src/model/types";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";

const IDS = [
  "aw-1-verknuepfte-funktionen",
  "aw-2-parameter",
  "aw-3-extremwerte",
  "aw-4-sachzusammenhaenge",
  "aw-5-anwendungen",
];
const GENERATORS: Record<string, string[]> = {
  "aw-1-verknuepfte-funktionen": [
    "verkettet-wert",
    "verkettet-ableitung",
    "untersuchen",
  ],
  "aw-2-parameter": ["parameter-punkt", "parameter-tangente"],
  "aw-3-extremwerte": ["extremwert", "parameter-extremum"],
  "aw-4-sachzusammenhaenge": ["sachextremum", "modell-pruefen"],
  "aw-5-anwendungen": ["anwendung-integral", "rate-vergleich"],
};
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-4:${i}`));
const SEEDS_WIDE = Array.from({ length: 300 }, (_, i) =>
  seedFrom(`stage-4-wide:${i}`),
);

function lesson(id: string) {
  const found = STAGE_ANWENDUNGEN.lessons.find((entry) => entry.id === id);
  if (!found) throw new Error(`lesson ${id}`);
  return found;
}

function tasksFor(
  lessonId: string,
  generatorId: string,
  level: 1 | 2,
  seeds: number[],
): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return seeds.map((seed) => generator.make(createRng(seed), level));
}

const numbers = (task: ExerciseTask): number[] =>
  task.fields
    .filter((f): f is NumberField => f.kind === "number")
    .map((f) => f.answer);
const choices = (task: ExerciseTask): ChoiceField[] =>
  task.fields.filter((f): f is ChoiceField => f.kind === "choice");

function answerText(task: ExerciseTask, style: "comma" | "point"): string[] {
  return task.fields.map((field) => {
    if (field.kind === "choice") return String(field.correctIndex);
    return style === "comma"
      ? fmt(field.answer, field.digits).replace("−", "-")
      : field.answer.toFixed(field.digits);
  });
}

const close = (value: number, target: number, eps = 1e-6) =>
  Math.abs(value - target) <= eps * Math.max(1, Math.abs(target));

function expectClose(
  value: number,
  target: number,
  where: string,
  eps = 1e-6,
): void {
  expect(close(value, target, eps), `${where}: ${value} should be ${target}`).toBe(
    true,
  );
}

/** A numerical derivative, computed independently of the generators. */
const diff = (f: (x: number) => number, x: number): number => {
  const e = 1e-4;
  return (f(x + e) - f(x - e)) / (2 * e);
};

/** The largest (or smallest) value of f on [lo, hi] by a fine search. */
function extremum(
  f: (x: number) => number,
  lo: number,
  hi: number,
  kind: "max" | "min",
): { x: number; y: number } {
  const better = (y: number, best: number) =>
    kind === "max" ? y > best : y < best;
  let best = { x: lo, y: f(lo) };
  for (let i = 1; i <= 20000; i++) {
    const x = lo + ((hi - lo) * i) / 20000;
    const y = f(x);
    if (better(y, best.y)) best = { x, y };
  }
  return best;
}

/** The mechanical rules every generated task obeys. */
function expectWellFormed(task: ExerciseTask, level: 1 | 2, where: string) {
  expect(task.fields.length, where).toBeGreaterThan(0);
  expect(task.prompt.length, where).toBeGreaterThan(30);
  expect(task.steps.length, where).toBeGreaterThanOrEqual(2);
  expect(task.steps[task.steps.length - 1], where).toContain("<strong>");
  if (level === 1) expect(task.formulaHint, where).toBeTruthy();
  else expect(task.formulaHint, where).toBeUndefined();
  const html = [
    task.prompt,
    ...task.given,
    ...task.steps,
    task.formulaHint ?? "",
  ].join(" ");
  expect(html, where).not.toMatch(/NaN|undefined|Infinity|\+ −|− −|\+ -/);
  expect(html.replace(/<[^>]+>/g, " "), `${where}: hyphen as minus`).not.toMatch(
    /(^|[\s(=:|,{±])-\d/,
  );
  for (const field of task.fields) {
    if (field.kind === "number") {
      expect(Number.isFinite(field.answer), where).toBe(true);
      expect(toleranceOf(field), where).toBeLessThan(
        Math.abs(field.answer) * 0.05 + 0.06,
      );
      // whole numbers or tenths, so the typed rounded answer is exact
      expect(field.answer, `${where}: ${field.label}`).toBe(
        Math.round(field.answer * 10) / 10,
      );
    } else {
      expect(field.correctIndex, where).toBeGreaterThanOrEqual(0);
      expect(field.correctIndex, where).toBeLessThan(field.options.length);
    }
  }
  expect(checkTask(task, answerText(task, "comma")).status, where).toBe(
    "correct",
  );
  expect(checkTask(task, answerText(task, "point")).status, where).toBe(
    "correct",
  );
  const wrong = task.fields.map((field) =>
    field.kind === "choice"
      ? String((field.correctIndex + 1) % field.options.length)
      : String(field.answer * 3 + 7),
  );
  const result = checkTask(task, wrong);
  expect(result.status, where).toBe("wrong");
  expect(wrongAnswerHint(task, result).length, where).toBeGreaterThan(10);
  for (const field of task.fields) {
    if (field.kind !== "number") continue;
    for (const slip of field.slips ?? []) {
      expect(
        Math.abs(slip.value - field.answer) > toleranceOf(field),
        `${where}: slip ${slip.value} equals the answer ${field.answer}`,
      ).toBe(true);
    }
  }
}

describe("Etappe 4: Anwendungen der Differential- und Integralrechnung", () => {
  it("has the five lessons of M13 LB 4 in order with the full lesson standard", () => {
    expect(STAGE_ANWENDUNGEN.id).toBe("stage-4");
    expect(STAGE_ANWENDUNGEN.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_ANWENDUNGEN.lessons.forEach((entry, index) => {
      expect(entry.stageId).toBe("stage-4");
      expect(entry.stepNumber).toBe(index + 1);
      expect(entry.title.startsWith(`4.${index + 1} `)).toBe(true);
      expect(entry.lehrplan).toMatch(/^M13 LB 4: /);
      expect(entry.lehrplan).toBe(
        "M13 LB 4: Anwendungen der Differential- und Integralrechnung",
      );
      expect(entry.whyItMatters.length).toBeGreaterThan(80);
      expect(entry.explanationHtml).toContain('class="example"');
      expect(entry.explanationHtml).toContain('class="merke"');
      expect(entry.formulas.length).toBeGreaterThanOrEqual(1);
      expect(entry.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(entry.quiz.options).size).toBe(entry.quiz.options.length);
      expect(entry.quiz.explanation.length).toBeGreaterThan(20);
      expect(entry.lab.goals).toHaveLength(3);
      expect(entry.exercises.length).toBeGreaterThanOrEqual(2);
      expect(entry.teacherVideo).toBeUndefined();
    });
    expect(
      STAGE_ANWENDUNGEN.lessons.map((l) => l.exercises.map((e) => e.id)),
    ).toEqual(Object.values(GENERATORS));
  });

  it("writes every fixed text with a real minus and no entities in the quiz", () => {
    for (const entry of STAGE_ANWENDUNGEN.lessons) {
      const fixed = [
        entry.title,
        entry.subtitle,
        entry.whyItMatters,
        entry.explanationHtml,
        ...entry.formulas.flatMap((f) => [f.name, f.html, f.quantities]),
        entry.lab.title,
        entry.lab.intro,
        ...entry.lab.goals.map((g) => g.text),
      ].join(" ");
      const plain = fixed.replace(/<[^>]+>/g, " ");
      expect(plain, entry.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(plain, entry.id).not.toMatch(/NaN|undefined|Infinity|\+ −|− −/);
      const quiz = [
        entry.quiz.question,
        ...entry.quiz.options,
        entry.quiz.explanation,
      ].join(" ");
      expect(quiz, entry.id).not.toMatch(/&[a-z]+;/);
      expect(quiz, entry.id).not.toContain("<");
      expect(quiz, entry.id).not.toContain(">");
      expect(quiz.replace(/<[^>]+>/g, " "), entry.id).not.toMatch(
        /(^|[\s(=:|,{±])-\d/,
      );
    }
  });

  it("answers every quiz mathematically correctly", () => {
    // 4.1: h(x) = (x² + 3)² has h′(x) = 4x(x² + 3)
    const h = (x: number) => (x * x + 3) ** 2;
    for (const x of [-2, 0.5, 1, 3]) {
      expectClose(diff(h, x), 4 * x * (x * x + 3), "Kettenregel", 1e-6);
    }
    expect(lesson("aw-1-verknuepfte-funktionen").quiz.correctIndex).toBe(0);
    expect(lesson("aw-1-verknuepfte-funktionen").quiz.options[0]).toContain(
      "4x(x² + 3)",
    );
    // 4.2: f(x) = ax² + bx has f′(1) = 2a + b, the Steigungsbedingung
    for (const [a, b] of [
      [1, 2],
      [-3, 5],
    ]) {
      const f = (x: number) => a * x * x + b * x;
      expectClose(diff(f, 1), 2 * a + b, "Steigungsbedingung", 1e-6);
    }
    expect(lesson("aw-2-parameter").quiz.correctIndex).toBe(0);
    expect(lesson("aw-2-parameter").quiz.options[0]).toBe("2a + b = 5");
    // 4.3: the candidates of f(x) = x³ − 3x on [−2; 2] hold the global extrema
    const analyse = extremAnalyse({ a: 1, b: 0, c: -3, l: -2, r: 2 });
    expect(analyse.gmax).toBe(2);
    expect(analyse.gmin).toBe(-2);
    const cubic = (x: number) => x ** 3 - 3 * x;
    expect(extremum(cubic, -2, 2, "max").y).toBeCloseTo(2, 6);
    expect(extremum(cubic, -2, 2, "min").y).toBeCloseTo(-2, 6);
    expect(lesson("aw-3-extremwerte").quiz.correctIndex).toBe(0);
    // 4.4: 2x + y = 24 gives y = 24 − 2x and A(x) = x · (24 − 2x), max 72 at 6
    const A = (x: number) => x * (24 - 2 * x);
    const best = extremum(A, 0.01, 11.99, "max");
    expectClose(best.x, 6, "Zaun", 1e-3);
    expectClose(best.y, 72, "Zaun", 1e-6);
    expect(lesson("aw-4-sachzusammenhaenge").quiz.correctIndex).toBe(0);
    expect(lesson("aw-4-sachzusammenhaenge").quiz.options[0]).toBe(
      "A(x) = x · (24 − 2x)",
    );
    // 4.5: (8 + 4) : 2 · 6 = 36 lies between the constant-rate bounds
    expect(((8 + 4) / 2) * 6).toBe(36);
    expect(36).toBeGreaterThan(6 * 4);
    expect(36).toBeLessThan(6 * 8);
    expect(lesson("aw-5-anwendungen").quiz.correctIndex).toBe(0);
    expect(lesson("aw-5-anwendungen").quiz.options[0]).toBe("36 t");
  });
});

describe("4.1 Verknüpfte Funktionen", () => {
  it("computes g, f(g(x)) and the chain rule like the lab model", () => {
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "verkettet-wert",
      1,
      SEEDS,
    )) {
      const { x, b, g, h } = task.meta as Record<string, number>;
      expectClose(g, x * x + b, task.prompt);
      expectClose(h, g * g, task.prompt);
      expect(numbers(task)).toEqual([g, h]);
      expect(g, "inner value can be negative").toBe(x * x + b);
    }
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "verkettet-wert",
      2,
      SEEDS,
    )) {
      const { t, v, E } = task.meta as Record<string, number>;
      expectClose(v, t + 2, task.prompt);
      expectClose(E, 2 * v * v, task.prompt);
      expect(numbers(task)).toEqual([v, E]);
      expect(v > 0 && E > 0, "plausible speed and energy").toBe(true);
    }
  });

  it("applies the chain rule and reproduces the derivatives numerically", () => {
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "verkettet-ableitung",
      1,
      SEEDS,
    )) {
      const { a, x, g, aussen, innen, hp } = task.meta as Record<string, number>;
      expectClose(g, x * x + a, task.prompt);
      expectClose(aussen, 3 * g * g, task.prompt);
      expectClose(innen, 2 * x, task.prompt);
      expectClose(hp, aussen * innen, task.prompt);
      expect(numbers(task)).toEqual([aussen, innen, hp]);
      const h = (t: number) => (t * t + a) ** 3;
      expectClose(diff(h, x), hp, `${task.prompt}: Kettenregel`, 1e-3);
    }
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "verkettet-ableitung",
      2,
      SEEDS,
    )) {
      const { k, rate, konz, tmin } = task.meta as Record<string, number>;
      expectClose(rate, k, task.prompt);
      expectClose(konz, 1, task.prompt);
      expectClose(tmin, k / 2, task.prompt);
      expect(numbers(task)).toEqual([rate, konz]);
      expect(choices(task)[0].correctIndex, task.prompt).toBe(0);
      // c(t) = e^(t² − k·t): Differenzenquotient gegen die Kettenregel
      const c = (t: number) => Math.exp(t * t - k * t);
      expectClose(diff(c, k), rate, `${task.prompt}: Kettenregel`, 1e-3);
      expectClose(c(k), konz, `${task.prompt}: Funktionswert`, 1e-9);
      // das Minimum liegt bei t = k : 2
      const best = extremum(c, 0, k, "min");
      expectClose(best.x, tmin, `${task.prompt}: Minimum`, 1e-3);
    }
  });

  it("investigates the composition: roots and extrema checked by probe", () => {
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "untersuchen",
      1,
      SEEDS,
    )) {
      const { k, a, x1, x2, xt, yt } = task.meta as Record<string, number>;
      expectClose(a, k * k, task.prompt);
      expectClose(x1, -k, task.prompt);
      expectClose(x2, k, task.prompt);
      expect(xt, task.prompt).toBe(0);
      expect(numbers(task)).toEqual([x1, x2, xt, yt]);
      const h = (x: number) => (x * x - a) ** 3;
      // Nullstellen gegen Probe
      expectClose(h(x1), 0, `${task.prompt}: Nullstelle`, 1e-9);
      expectClose(h(x2), 0, `${task.prompt}: Nullstelle`, 1e-9);
      // Differenzenquotient gegen Kettenregel und gegen die Extremstelle
      expectClose(diff(h, 1), 6 * (1 - a) ** 2, `${task.prompt}: Kettenregel`, 1e-3);
      expectClose(diff(h, xt), 0, `${task.prompt}: h′ = 0`, 1e-3);
      expectClose(diff(h, x2), 0, `${task.prompt}: Terrassenpunkt`, 1e-3);
      // Extremwerte gegen Probe
      expectClose(h(xt), yt, `${task.prompt}: Extremwert`, 1e-6);
      const best = extremum(h, -2 * k, 2 * k, "min");
      expectClose(best.x, xt, `${task.prompt}: Tiefpunkt`, 1e-3);
      expectClose(best.y, yt, `${task.prompt}: Tiefpunkt`, 1e-6);
      // 𝔻 = ℝ, und die Ablenkoption nennen die Nullstellen als Ausnahmen
      const domain = choices(task)[0];
      expect(domain.correctIndex, task.prompt).toBe(0);
      expect(domain.options[0]).toBe("𝔻 = ℝ");
      expect(domain.options[1]).toContain(fmt(-k));
    }
    for (const task of tasksFor(
      "aw-1-verknuepfte-funktionen",
      "untersuchen",
      2,
      SEEDS,
    )) {
      const { k, a, xt, yt, ns } = task.meta as Record<string, number>;
      expectClose(a, 3 * k, task.prompt);
      expectClose(xt, k, task.prompt);
      expectClose(ns, a, task.prompt);
      expect(numbers(task)).toEqual([xt, yt, ns]);
      const h = (x: number) => (x + a) ** 2 * (x - a);
      // Nullstellen gegen Probe
      expectClose(h(-a), 0, `${task.prompt}: Nullstelle`, 1e-9);
      expectClose(h(ns), 0, `${task.prompt}: Nullstelle`, 1e-9);
      // Differenzenquotient gegen die Produkt- und Kettenregel
      expectClose(diff(h, 0), -a * a, `${task.prompt}: Produktregel`, 1e-3);
      expectClose(diff(h, xt), 0, `${task.prompt}: h′ = 0`, 1e-3);
      // Extremwerte gegen Probe
      expectClose(h(xt), yt, `${task.prompt}: Extremwert`, 1e-6);
      const best = extremum(h, -a, a, "min");
      expectClose(best.x, xt, `${task.prompt}: Tiefpunkt`, 1e-3);
      expectClose(best.y, yt, `${task.prompt}: Tiefpunkt`, 1e-6);
      // bei x = −a liegt ein Hochpunkt auf der x-Achse
      expect(h(-a - 0.5), task.prompt).toBeLessThan(0);
      expect(h(-a + 0.5), task.prompt).toBeLessThan(0);
      // Grenzverhalten für x → −∞
      expect(h(-10 * a), task.prompt).toBeLessThan(0);
      const chosen = choices(task);
      expect(chosen[0].correctIndex, task.prompt).toBe(0);
      expect(chosen[1].correctIndex, task.prompt).toBe(0);
    }
  });
});

describe("4.2 Parameter bestimmen", () => {
  it("solves the point condition for the unknown parameter", () => {
    for (const task of tasksFor(
      "aw-2-parameter",
      "parameter-punkt",
      1,
      SEEDS,
    )) {
      const { a, b, x, y } = task.meta as Record<string, number>;
      expectClose(y, a * x * x + b * x, task.prompt);
      const answer = numbers(task)[0];
      if (task.prompt.includes("Der Parameter b =")) {
        expect(answer, task.prompt).toBe(a);
        expect(task.prompt).toContain(`b = ${fmt(b)}`);
      } else {
        expect(answer, task.prompt).toBe(b);
        expect(task.prompt).toContain(`a = ${fmt(a)}`);
      }
    }
    for (const task of tasksFor(
      "aw-2-parameter",
      "parameter-punkt",
      2,
      SEEDS,
    )) {
      const { a, b, y1, y2 } = task.meta as Record<string, number>;
      expectClose(y1, a + b, task.prompt);
      expectClose(y2, 4 * a + 2 * b, task.prompt);
      // the two-point system solved independently
      const solvedA = (y2 - 2 * y1) / 2;
      const solvedB = y1 - solvedA;
      expect(numbers(task)[0], task.prompt).toBe(solvedA);
      expect(numbers(task)[1], task.prompt).toBe(solvedB);
      expect(a > 0 && b > 0, "plausible model parameters").toBe(true);
    }
  });

  it("turns the slope condition into the parameter", () => {
    for (const task of tasksFor(
      "aw-2-parameter",
      "parameter-tangente",
      1,
      SEEDS,
    )) {
      const { a, x, m } = task.meta as Record<string, number>;
      expectClose(m, 2 * x + a, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(a);
      const f = (t: number) => t * t + a * t + 3;
      expectClose(diff(f, x), m, `${task.prompt}: Tangentensteigung`, 1e-3);
    }
    for (const task of tasksFor(
      "aw-2-parameter",
      "parameter-tangente",
      2,
      SEEDS,
    )) {
      const { a, p, x, m, fx } = task.meta as Record<string, number>;
      expectClose(m, 2 * a * x + p, task.prompt);
      expectClose(fx, a * x * x + p * x, task.prompt);
      expect(numbers(task)).toEqual([a, fx]);
      const f = (t: number) => a * t * t + p * t;
      expectClose(diff(f, x), m, `${task.prompt}: Tangentensteigung`, 1e-3);
    }
  });
});

describe("4.3 Extremwertprobleme", () => {
  it("compares interior candidates and borders on the interval", () => {
    for (const task of tasksFor("aw-3-extremwerte", "extremwert", 1, SEEDS)) {
      const { d, e, s, r, vmax, vmin, argmax } = task.meta as Record<
        string,
        number
      >;
      const f = (x: number) => s * (x - d) ** 2 + e;
      const best = extremum(f, 0, r, "max");
      const worst = extremum(f, 0, r, "min");
      expectClose(vmax, best.y, task.prompt, 1e-4);
      expectClose(vmin, worst.y, task.prompt, 1e-4);
      expectClose(
        vmax,
        s > 0 ? Math.max(f(0), f(r)) : f(d),
        task.prompt,
      );
      expectClose(
        vmin,
        s > 0 ? f(d) : Math.min(f(0), f(r)),
        task.prompt,
      );
      expect([0, d, r], task.prompt).toContain(argmax);
      expect(numbers(task)).toEqual([vmax, vmin, argmax]);
      expect(r, "interval grows with d").toBe(d + 3);
    }
    for (const task of tasksFor("aw-3-extremwerte", "extremwert", 2, SEEDS)) {
      const { d, k, e } = task.meta as Record<string, number>;
      expectClose(e, d * d + k, task.prompt);
      expect(numbers(task)).toEqual([e, d]);
      // h(t) = −t² + 2dt + k has its maximum at t = d with height e
      const h = (t: number) => -t * t + 2 * d * t + k;
      const best = extremum(h, 0, 12, "max");
      expectClose(best.x, d, task.prompt, 1e-3);
      expectClose(best.y, e, task.prompt, 1e-6);
      expect(k > 0 && e > k, "plausible heights").toBe(true);
    }
  });

  it("uses the extremum condition f′(x₀) = 0 and the sufficient condition", () => {
    for (const task of tasksFor(
      "aw-3-extremwerte",
      "parameter-extremum",
      1,
      SEEDS,
    )) {
      const { k, a } = task.meta as Record<string, number>;
      expectClose(a, -3 * k * k, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(a);
      const f = (t: number) => t ** 3 + a * t;
      expectClose(diff(f, k), 0, `${task.prompt}: f′ = 0`, 1e-6);
    }
    for (const task of tasksFor(
      "aw-3-extremwerte",
      "parameter-extremum",
      2,
      SEEDS,
    )) {
      const { k, s, x, a, fval } = task.meta as Record<string, number>;
      expectClose(x, s * k, task.prompt);
      expectClose(a, -3 * k * k, task.prompt);
      expectClose(fval, x ** 3 + a * x, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(fval);
      const chosen = choices(task)[0];
      // f″(x) = 6x: negative ⇒ Maximum (index 0), positive ⇒ Minimum (index 1)
      expect(chosen.correctIndex, task.prompt).toBe(x < 0 ? 0 : 1);
      const f = (t: number) => t ** 3 + a * t;
      expectClose(diff(f, x), 0, `${task.prompt}: f′ = 0`, 1e-6);
      const curvature = diff((t) => diff(f, t), x);
      expect(curvature < 0 ? "max" : "min", task.prompt).toBe(
        x < 0 ? "max" : "min",
      );
    }
  });
});

describe("4.4 Extremwerte in Sachzusammenhängen", () => {
  it("maximises the fence area and minimises the canister surface", () => {
    for (const task of tasksFor("aw-4-sachzusammenhaenge", "sachextremum", 1, SEEDS)) {
      const { P, x, A } = task.meta as Record<string, number>;
      expectClose(x, P / 4, task.prompt);
      expectClose(A, (P * P) / 8, task.prompt);
      const area = (t: number) => t * (P - 2 * t);
      const best = extremum(area, 0.001, P / 2 - 0.001, "max");
      expectClose(best.x, x, task.prompt, 1e-3);
      expectClose(best.y, A, task.prompt, 1e-6);
      // Nebenbedingung: y = P − 2x bleibt eine positive Länge
      expect(P - 2 * x, "length of the enclosure").toBeGreaterThan(0);
      expect(numbers(task)).toEqual([x, A]);
    }
    for (const task of tasksFor("aw-4-sachzusammenhaenge", "sachextremum", 2, SEEDS)) {
      const { v, V, O } = task.meta as Record<string, number>;
      expectClose(V, v ** 3, task.prompt);
      expectClose(O, 6 * v * v, task.prompt);
      const surface = (t: number) => 2 * t * t + (4 * V) / t;
      const best = extremum(surface, 0.5, 30, "min");
      expectClose(best.x, v, task.prompt, 1e-3);
      expectClose(best.y, O, task.prompt, 1e-4);
      expect(V > 0 && O > 0 && V / (v * v) > 0, "plausible canister").toBe(true);
      expect(numbers(task)).toEqual([v, O]);
    }
  });

  it("checks the plausibility of a computed length against the constraint", () => {
    for (const task of tasksFor(
      "aw-4-sachzusammenhaenge",
      "modell-pruefen",
      1,
      SEEDS,
    )) {
      const { x, y } = task.meta as Record<string, number>;
      expectClose(y, 24 - 2 * x, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(y);
      const chosen = choices(task)[0];
      // "sinnvoll" (index 0) exactly when both lengths are positive
      expect(chosen.correctIndex, task.prompt).toBe(y > 0 ? 0 : 1);
      expect(x > 0, "given length is positive").toBe(true);
    }
    for (const task of tasksFor(
      "aw-4-sachzusammenhaenge",
      "modell-pruefen",
      2,
      SEEDS,
    )) {
      const { v, V, neu } = task.meta as Record<string, number>;
      expectClose(V, v ** 3, task.prompt);
      expectClose(neu, 2 * v, task.prompt);
      expectClose(neu ** 3, 8 * V, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(neu);
      expect(choices(task)[0].correctIndex).toBe(0);
    }
  });
});

describe("4.5 Analysis in Beruf und Forschung", () => {
  it("adds the areas of piecewise constant rates and reads the trapezoid", () => {
    for (const task of tasksFor(
      "aw-5-anwendungen",
      "anwendung-integral",
      1,
      SEEDS,
    )) {
      const { r1, t1, r2, t2, m1, G } = task.meta as Record<string, number>;
      expectClose(m1, r1 * t1, task.prompt);
      expectClose(G, r1 * t1 + r2 * t2, task.prompt);
      expect(numbers(task)).toEqual([m1, G]);
      expect(r1 > 0 && r2 > 0 && t1 > 0 && t2 > 0 && G > 0).toBe(true);
    }
    for (const task of tasksFor(
      "aw-5-anwendungen",
      "anwendung-integral",
      2,
      SEEDS,
    )) {
      const { r0, rT, T, G, mittel } = task.meta as Record<string, number>;
      expectClose(G, ((r0 + rT) / 2) * T, task.prompt);
      expectClose(mittel, (r0 + rT) / 2, task.prompt);
      expect(numbers(task)).toEqual([G, mittel]);
      expect(r0 > rT && rT > 0 && G > 0, "falling rate, positive amounts").toBe(
        true,
      );
    }
  });

  it("compares a local rate with the total amount and its change", () => {
    for (const task of tasksFor(
      "aw-5-anwendungen",
      "rate-vergleich",
      1,
      SEEDS,
    )) {
      const { a, b, T, rT } = task.meta as Record<string, number>;
      expectClose(rT, a * T + b, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(rT);
      expect(rT > 0 && b > 0, "plausible rates").toBe(true);
      // with a < 0 the trapezoid lies below the constant-rate rectangle
      const total = ((b + rT) / 2) * T;
      expect(total, task.prompt).toBeLessThan(b * T);
      const chosen = choices(task)[0];
      expect(chosen.correctIndex).toBe(0);
    }
    for (const task of tasksFor(
      "aw-5-anwendungen",
      "rate-vergleich",
      2,
      SEEDS,
    )) {
      const { r0, rT, T, G, G2 } = task.meta as Record<string, number>;
      expectClose(G, ((r0 + rT) / 2) * T, task.prompt);
      expectClose(G2, ((r0 + 2 + rT) / 2) * T, task.prompt);
      expectClose(G2 - G, T, task.prompt);
      expect(numbers(task)[0], task.prompt).toBe(G2);
      const chosen = choices(task)[0];
      expect(chosen.correctIndex).toBe(0);
    }
  });
});

describe("Aufgaben beider Stufen", () => {
  it("keep every mechanical rule of the task streams, on both levels", () => {
    for (const lessonId of IDS) {
      for (const generatorId of GENERATORS[lessonId]) {
        for (const level of [1, 2] as const) {
          for (const task of tasksFor(lessonId, generatorId, level, SEEDS)) {
            expectWellFormed(task, level, `${lessonId}/${generatorId} L${level}`);
          }
        }
      }
    }
  });

  it("never repeat one answer: every generator varies over 300 seeds", () => {
    for (const lessonId of IDS) {
      for (const generatorId of GENERATORS[lessonId]) {
        for (const level of [1, 2] as const) {
          const answers = tasksFor(
            lessonId,
            generatorId,
            level,
            SEEDS_WIDE,
          ).map((task) => numbers(task)[0]);
          expect(
            new Set(answers).size,
            `${lessonId}/${generatorId} L${level} always answers ${answers[0]}`,
          ).toBeGreaterThan(5);
        }
      }
    }
  });
});

describe("Labore der Etappe 4", () => {
  const labOf = (id: string): LabDefinition => lesson(id).lab;

  it("reach every goal with its witness and none at the start", () => {
    for (const lessonId of IDS) {
      const lab = labOf(lessonId);
      const witnesses = GOAL_WITNESSES_STAGE_4[lessonId];
      expect(witnesses, lessonId).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(
        lab.goals.map((g) => g.id).sort(),
      );
      for (const goal of lab.goals) {
        const witness = {
          ...defaultLabValues(lab),
          ...witnesses[goal.id],
        };
        for (const param of lab.params) {
          if (param.type === "state") continue;
          const value = witnesses[goal.id][param.key];
          expect(value, `${lessonId}/${goal.id} sets ${param.key}`).toBeDefined();
          expect(
            clampParam(param, value),
            `${lessonId}/${goal.id}: ${param.key} is a smooth slider value`,
          ).toBe(value);
        }
        expect(
          goal.check(witness, computeReadouts(lab, witness)),
          `${lessonId}/${goal.id} not reached by ${JSON.stringify(witness)}`,
        ).toBe(true);
      }
      const start = defaultLabValues(lab);
      expect(
        lab.goals.filter((goal) =>
          goal.check(start, computeReadouts(lab, start)),
        ),
        `${lessonId} hands out goals for free`,
      ).toEqual([]);
    }
  });

  it("keep the chain rule readouts of the composition lab consistent", () => {
    for (const values of enumerateLabGrid(labOf("aw-1-verknuepfte-funktionen"), 5)) {
      const g = chainG(values);
      const h = chainH(values);
      const outer = chainOuter(values);
      const inner = chainInner(values);
      const hp = chainHPrime(values);
      expectClose(h, g * g, JSON.stringify(values));
      expectClose(outer, 2 * g, JSON.stringify(values));
      expectClose(inner, 2 * values.x + values.a, JSON.stringify(values));
      expectClose(hp, outer * inner, JSON.stringify(values));
      const fn = (x: number) =>
        (x * x + values.a * x + values.b) ** 2;
      expectClose(diff(fn, values.x), hp, JSON.stringify(values), 1e-4);
    }
  });

  it("reproduce the derivatives of the parameter lab numerically", () => {
    for (const values of enumerateLabGrid(labOf("aw-2-parameter"), 6)) {
      const f = (x: number) => paramF(values, x);
      expectClose(paramF(values, 1), f(1), JSON.stringify(values), 1e-9);
      expectClose(
        paramDf(values, 1),
        diff(f, 1),
        JSON.stringify(values),
        1e-4,
      );
      expectClose(
        paramDf(values, 1),
        3 * values.a + values.b,
        JSON.stringify(values),
      );
    }
  });

  it("find exactly the candidates of the extremum lab, with true global extrema", () => {
    for (const values of enumerateLabGrid(labOf("aw-3-extremwerte"), 3)) {
      const analyse = extremAnalyse(values);
      const f = (x: number) =>
        values.a * x ** 3 + values.b * x * x + values.c * x;
      for (const root of analyse.roots) {
        expectClose(diff(f, root), 0, JSON.stringify(values), 1e-3);
      }
      const values2 = analyse.punkte.map((p) => p.y);
      expectClose(analyse.gmax, Math.max(...values2), JSON.stringify(values));
      expectClose(analyse.gmin, Math.min(...values2), JSON.stringify(values));
      const best = extremum(f, values.l, values.r, "max");
      const worst = extremum(f, values.l, values.r, "min");
      expectClose(analyse.gmax, best.y, JSON.stringify(values), 1e-3);
      expectClose(analyse.gmin, worst.y, JSON.stringify(values), 1e-3);
    }
  });

  it("optimise the objective of the modelling lab and honour its constraint", () => {
    for (const values of enumerateLabGrid(labOf("aw-4-sachzusammenhaenge"), 3)) {
      const w = sachWerte(values);
      expect(Number.isFinite(w.F), JSON.stringify(values)).toBe(true);
      expect(Number.isFinite(w.Fopt), JSON.stringify(values)).toBe(true);
      expect(Number.isFinite(w.xOpt), JSON.stringify(values)).toBe(true);
      expect(w.xOpt, JSON.stringify(values)).toBeGreaterThan(0);
      const f = (x: number) => sachWerte({ ...values, x }).F;
      const best = extremum(f, 1, 15, w.minimieren ? "min" : "max");
      expectClose(w.Fopt, best.y, JSON.stringify(values), 1e-3);
      expectClose(w.xOpt, best.x, JSON.stringify(values), 1e-2);
      // the constraint reads as length/height and decides `erfuellt`
      expect(w.erfuellt, JSON.stringify(values)).toBe(
        w.yRichtung === "min"
          ? w.y >= w.yGrenze - 1e-9
          : w.y <= w.yGrenze + 1e-9,
      );
    }
    // only the constraint goal may violate the Nebenbedingung, and the
    // optimisation witnesses stay positive and interpretable
    for (const goalId of ["optimum", "besser"]) {
      const w = sachWerte({
        ...defaultLabValues(labOf("aw-4-sachzusammenhaenge")),
        ...GOAL_WITNESSES_STAGE_4["aw-4-sachzusammenhaenge"][goalId],
      });
      expect(w.erfuellt, goalId).toBe(true);
      expect(w.F > 0 && w.Fopt > 0, goalId).toBe(true);
    }
    const violated = sachWerte({
      ...defaultLabValues(labOf("aw-4-sachzusammenhaenge")),
      ...GOAL_WITNESSES_STAGE_4["aw-4-sachzusammenhaenge"]["nb-verletzt"],
    });
    expect(violated.erfuellt).toBe(false);
    expect(SACH_START_X).toBe(2);
  });

  it("integrate the linear rate as the trapezoid the readout claims", () => {
    for (const values of enumerateLabGrid(labOf("aw-5-anwendungen"), 6)) {
      const w = rateWerte(values);
      // fine Riemann sum over [0; T] as an independent integral
      let sum = 0;
      const n = 2000;
      for (let i = 0; i < n; i++) {
        const t = (values.T * (i + 0.5)) / n;
        sum += (values.a * t + values.b) * (values.T / n);
      }
      expectClose(w.G, sum, JSON.stringify(values), 1e-6);
      expectClose(w.G, ((w.r0 + w.rT) / 2) * values.T, JSON.stringify(values));
      expectClose(w.rT, values.a * values.T + values.b, JSON.stringify(values));
    }
  });

  it("keep readouts finite and the drawing clean on a grid sample", () => {
    for (const lessonId of IDS) {
      const lab = labOf(lessonId);
      const view = labView(lab.kind);
      expect(view, lab.kind).toBeDefined();
      for (const values of enumerateLabGrid(lab, 3)) {
        const readouts = computeReadouts(lab, values);
        for (const readout of lab.readouts) {
          const value = readouts[readout.key];
          if (typeof value === "number") {
            expect(
              Number.isFinite(value),
              `${lessonId}.${readout.key} at ${JSON.stringify(values)}`,
            ).toBe(true);
          } else {
            expect(value.length, `${lessonId}.${readout.key}`).toBeGreaterThan(0);
          }
        }
        const svg = view.render(values, readouts);
        expect(svg.startsWith("<svg"), lessonId).toBe(true);
        expect(svg.endsWith("</svg>"), lessonId).toBe(true);
        expect(
          svg,
          `${lessonId} draws NaN at ${JSON.stringify(values)}`,
        ).not.toContain("NaN");
        expect(svg, lessonId).not.toContain("undefined");
        expect(svg, lessonId).not.toContain("Infinity");
      }
    }
  });

  it("drag every handle along with the pointer", () => {
    const handlePosition = (
      svg: string,
      id: string,
    ): { x: number; y: number } | null => {
      const match = new RegExp(
        `data-handle="${id}"[^>]*>\\s*<circle cx="([-\\d.]+)" cy="([-\\d.]+)"`,
      ).exec(svg);
      return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
    };
    for (const lessonId of IDS) {
      const lab = labOf(lessonId);
      const view = labView(lab.kind);
      const settings = [
        defaultLabValues(lab),
        ...Object.values(GOAL_WITNESSES_STAGE_4[lessonId]).map((w) => ({
          ...defaultLabValues(lab),
          ...w,
        })),
      ];
      for (const [id, spec] of Object.entries(view.handles ?? {})) {
        for (const values of settings) {
          const svg = view.render(values, computeReadouts(lab, values));
          const at = handlePosition(svg, id);
          if (!at) continue;
          const changes = spec.drag(at, values);
          const moved = withChanges(lab, values, changes);
          for (const key of Object.keys(changes)) {
            const param = lab.params.find((p) => p.key === key);
            expect(param, `${lessonId}: handle ${id} drags ${key}`).toBeDefined();
            if (param?.type !== "range") continue;
            expect(
              Math.abs(moved[key] - values[key]),
              `${lessonId}: handle ${id} jumps on ${key} at ${JSON.stringify(values)}`,
            ).toBeLessThanOrEqual(param.step + 1e-9);
          }
        }
      }
    }
  });
});
