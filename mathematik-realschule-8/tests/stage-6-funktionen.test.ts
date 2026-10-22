import { describe, expect, it } from "vitest";
import { DESCRIPTIONS, RELATION_OPTIONS, SITUATIONS, STAGE_FUNKTIONEN } from "../src/curriculum/stage-6-funktionen";
import { checkTask } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { analyseRelation, domainOf, relationPoints, valueSet, zerosInDomain } from "../src/lab/views-funktionen";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabDefinition, LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_6 } from "./witnesses-stage-6";

const IDS = [
  "fu-1-funktionen",
  "fu-2-darstellungen",
  "fu-3-werte-nullstellen",
  "fu-4-ursprungsgeraden",
  "fu-5-senkrecht",
  "fu-6-geraden",
];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-6:${i}`));

const lesson = (id: string) => {
  const found = STAGE_FUNKTIONEN.lessons.find((l) => l.id === id);
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

function choice(task: ExerciseTask, index: number): ChoiceField {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field;
}

/** The text of the right option of a choice field. */
const picked = (task: ExerciseTask, index: number) => choice(task, index).options[choice(task, index).correctIndex];

const meta = (task: ExerciseTask) => task.meta ?? {};

function close(x: number, y: number, eps = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(eps * Math.max(1, Math.abs(y)));
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ");

/** A German number as fmt() writes it, for comparing with texts. */
const de = (x: number) => new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(x).replace("-", "−");

const at = (lab: LabDefinition, values: Partial<LabValues>) => {
  const v = { ...defaultLabValues(lab), ...values } as LabValues;
  return { v, r: computeReadouts(lab, v) };
};

describe("Etappe 6: Funktionen", () => {
  it("has its lessons in order, with the Zweige and Lernbereiche of the curriculum", () => {
    expect(STAGE_FUNKTIONEN.id).toBe("stage-6-funktionen");
    expect(STAGE_FUNKTIONEN.stageNumber).toBe(6);
    expect(STAGE_FUNKTIONEN.accent).toBe("#059669");
    expect(STAGE_FUNKTIONEN.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_FUNKTIONEN.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-6-funktionen");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`6.${index + 1} `), l.title).toBe(true);
      const both = index < 5;
      expect(l.tracks).toEqual(both ? ["I", "II_III"] : ["I"]);
      expect(l.lehrplan.startsWith(both ? "M8 LB 6 (I) · M8 LB 5 (II/III): " : "M8 LB 6 (I): "), l.lehrplan).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps y = mx + t out of the lessons Zweig II/III shares before 6.6 as a parameter form", () => {
    for (const l of STAGE_FUNKTIONEN.lessons.slice(0, 5)) {
      const text = plain([l.explanationHtml, l.quiz.question, ...l.quiz.options, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => `${f.html} ${f.quantities}`)].join(" "));
      expect(text, l.id).not.toMatch(/mx \+ t|m · x \+ t|y-Achsenabschnitt/);
      expect(text, l.id).not.toMatch(/Parabel|Scheitel|Pythagoras|ℝ/);
    }
  });
});

describe("Aufgaben der Etappe 6 rechnen richtig", () => {
  it("6.1 tables and lists of pairs: the x with two y-values, or none, and the value read off", () => {
    const seen = [0, 0];
    for (const task of tasks("fu-1-funktionen", "eindeutig", 1)) {
      const m = meta(task);
      const pairs = Array.from({ length: 6 }, (_, i) => ({ x: m[`x${i}`], y: m[`y${i}`] }));
      const info = analyseRelation(pairs);
      expect(info.isFunction ? 1 : 0, task.prompt).toBe(m.isFunction);
      seen[m.isFunction] += 1;
      if (info.isFunction) expect(picked(task, 0)).toBe("keine, die Zuordnung ist eine Funktion");
      else {
        expect(info.broken).toEqual([m.dup]);
        expect(picked(task, 0)).toBe(`x = ${de(m.dup)}`);
      }
      // the options name x that occur, every one at most once
      const options = choice(task, 0).options;
      expect(new Set(options).size).toBe(options.length);
      expect(options.length).toBe(4);
      const ys = info.ys.get(m.q) ?? [];
      expect(ys).toHaveLength(1);
      expect(num(task, 1)).toBe(ys[0]);
    }
    expect(seen.every((n) => n > 50), `${seen}`).toBe(true);
  });

  it("6.1 everyday relations: the verdict matches the situation, and both kinds occur", () => {
    let functions = 0;
    for (const task of tasks("fu-1-funktionen", "eindeutig", 2)) {
      const { a, b } = meta(task);
      expect(a).not.toBe(b);
      expect(choice(task, 0).options).toEqual(RELATION_OPTIONS);
      expect(choice(task, 0).correctIndex).toBe(SITUATIONS[a].isFunction ? 0 : 1);
      expect(choice(task, 1).correctIndex).toBe(SITUATIONS[b].isFunction ? 0 : 1);
      functions += Number(SITUATIONS[a].isFunction) + Number(SITUATIONS[b].isFunction);
    }
    expect(functions).toBeGreaterThan(120);
    expect(functions).toBeLessThan(280);
  });

  it("6.1 describing a table: uniform or not, and the next value of the pattern", () => {
    for (const task of tasks("fu-1-funktionen", "beschreiben", 1)) {
      const { kind, m, c } = meta(task);
      const f = (x: number) => (kind === 2 ? x * x + c : m * x + c);
      const diffs = [1, 2, 3, 4].map((x) => f(x) - f(x - 1));
      const uniform = diffs.every((d) => Math.abs(d - diffs[0]) < 1e-12);
      const expected = !uniform ? DESCRIPTIONS[1] : diffs[0] > 0 ? DESCRIPTIONS[0] : diffs[0] < 0 ? DESCRIPTIONS[2] : DESCRIPTIONS[3];
      expect(picked(task, 0)).toBe(expected);
      close(num(task, 1), f(5));
    }
    for (const task of tasks("fu-1-funktionen", "beschreiben", 2)) {
      const m = meta(task);
      const ys = [0, 1, 2, 3, 4].map((k) => m[`y${k}`]);
      const xs = [0, 1, 2, 3, 4].map((k) => m[`x${k}`]);
      close(num(task, 1), ys[m.j] - ys[m.i]);
      expect(m.j).toBeGreaterThan(m.i);
      // the chosen sentence says "gleichmäßig" exactly when the differences are equal
      const diffs = ys.slice(1).map((y, k) => (y - ys[k]) / (xs[k + 1] - xs[k]));
      const uniform = diffs.every((d) => Math.abs(d - diffs[0]) < 1e-12);
      const sentence = picked(task, 0);
      expect(sentence.includes("gleichmäßig"), sentence).toBe(uniform);
      // and the direction is right: "desto kürzer/kälter/weniger/leerer" for falling values
      const falling = ys[4] < ys[0];
      expect(/kürzer|kälter|leerer/.test(sentence), sentence).toBe(falling);
      // values are plausible: no negative heights, temperatures above room temperature
      for (const y of ys) expect(y).toBeGreaterThanOrEqual(0);
    }
  });

  it("6.2 tables from a term: every value is the term at x", () => {
    for (const task of tasks("fu-2-darstellungen", "wertetabelle", 1)) {
      const { x0, x1, x2 } = meta(task);
      expect(x0).toBeLessThan(0);
      expect(new Set([x0, x1, x2]).size).toBe(3);
      const term = plain(task.given[0]).replace("y = ", "").replace(/−/g, "-").replace(/,/g, ".").trim();
      // evaluate the shown term independently: "0.5x + 1", "x² - 2", "12 : x"
      const f = (x: number) => {
        if (term.includes(":")) return Number(term.split(":")[0]) / x;
        const js = term.replace(/(\d)x²/g, "$1*x*x").replace(/x²/g, "x*x").replace(/(\d)x/g, "$1*x").replace(/ /g, "");
        return Function("x", `return ${js};`)(x) as number;
      };
      [x0, x1, x2].forEach((x, i) => close(num(task, i), f(x)));
    }
    for (const task of tasks("fu-2-darstellungen", "wertetabelle", 2)) {
      const { kind, a, b, x1, x2 } = meta(task);
      const f = [(x: number) => b * x + a, (x: number) => b * x + a, (x: number) => a / x, (x: number) => x * x, (x: number) => b * x + a][kind];
      close(num(task, 1), f(x1));
      close(num(task, 2), f(x2));
      const right = picked(task, 0);
      expect(right).toBe(["y = " + de(b) + "x + " + de(a), "y = " + de(b) + "x + " + de(a), `y = ${a} : x`, "y = x²", "y = " + de(b) + "x + " + de(a)][kind]);
      expect(choice(task, 0).options).toHaveLength(3);
    }
  });

  it("6.2 terms from a table: the right term fits every pair, every other offered term misses one", () => {
    const evalTerm = (html: string, x: number) => {
      const t = plain(html).replace("y = ", "").replace(/−/g, "-").replace(/,/g, ".").trim();
      if (t.includes(":")) return Number(t.split(":")[0]) / x;
      const js = t.replace(/(\d)x²/g, "$1*x*x").replace(/x²/g, "x*x").replace(/(\d)x/g, "$1*x").replace(/(^|[^\d*])x/g, "$11*x").replace(/ /g, "");
      return Function("x", `return ${js};`)(x) as number;
    };
    for (const level of [1, 2] as const) {
      for (const task of tasks("fu-2-darstellungen", "term-finden", level)) {
        const m = meta(task);
        const options = choice(task, 0).options;
        const right = picked(task, 0);
        const table = plain(task.given[0]).trim().split(/\s+/);
        // the table cells: after the two headings come the four x and the four y
        const numbers = table.filter((cell) => /^[−\d]/.test(cell)).map((cell) => Number(cell.replace("−", "-").replace(",", ".")));
        const xs = numbers.slice(0, 4);
        const ys = numbers.slice(4, 8);
        expect(xs).toEqual([1, 2, 3, 4]);
        xs.forEach((x, i) => close(evalTerm(right, x), ys[i], 1e-6));
        for (const option of options) {
          if (option === right) continue;
          close(evalTerm(option, 1), ys[0], 1e-6);
          expect(xs.some((x, i) => Math.abs(evalTerm(option, x) - ys[i]) > 1e-6), option).toBe(true);
        }
        const last = num(task, task.fields.length - 1);
        close(last, evalTerm(right, m.xStar), 1e-9);
        if (level === 2) expect(choice(task, 1).correctIndex).toBe(m.connect ? 0 : 1);
        if (level === 2) expect(m.connect).toBe([0, 0, 1, 1, 1][m.kind]);
      }
    }
  });

  it("6.3 values, the x of a value and the Nullstelle of a line", () => {
    for (const task of tasks("fu-3-werte-nullstellen", "werte-nullstelle", 1)) {
      const { m, t, a, b } = meta(task);
      close(num(task, 0), m * a + t);
      close(m * num(task, 1) + t, b);
      close(m * num(task, 2) + t, 0);
      expect(Number.isInteger(num(task, 2))).toBe(true);
    }
    for (const task of tasks("fu-3-werte-nullstellen", "werte-nullstelle", 2)) {
      const { v0, r, T, t1 } = meta(task);
      close(num(task, 0), v0 - r * t1);
      close(v0 - r * num(task, 1), 0);
      close(T, v0 / r);
      expect(t1).toBeLessThan(T);
      expect(num(task, 0)).toBeGreaterThan(0);
      expect(picked(task, 2)).toBe(`D = [0; ${de(T)}], W = [0; ${de(v0)}]`);
    }
  });

  it("6.3 value sets on an interval, from a term and from a situation", () => {
    let inside = 0;
    for (const task of tasks("fu-3-werte-nullstellen", "wertemenge", 1)) {
      const { m, t, a, b } = meta(task);
      const values = [a, b].map((x) => m * x + t);
      close(num(task, 0), Math.min(...values));
      close(num(task, 1), Math.max(...values));
      const zero = -t / m;
      expect(choice(task, 2).correctIndex).toBe(zero >= a && zero <= b ? 0 : 1);
      inside += Number(zero >= a && zero <= b);
    }
    expect(inside).toBeGreaterThan(30);
    expect(inside).toBeLessThan(170);
    for (const task of tasks("fu-3-werte-nullstellen", "wertemenge", 2)) {
      const { m, t, a, b, y } = meta(task);
      const values = [a, b].map((x) => m * x + t);
      close(num(task, 0), Math.min(...values));
      close(num(task, 1), Math.max(...values));
      const x = num(task, 2);
      close(m * x + t, y);
      // the asked value is reached inside the domain, and nothing is negative
      expect(x).toBeGreaterThan(a);
      expect(x).toBeLessThan(b);
      expect(Math.min(...values)).toBeGreaterThan(0);
    }
  });

  it("6.4 slopes of Ursprungsgeraden from a point, a situation or a read slope triangle", () => {
    for (const task of tasks("fu-4-ursprungsgeraden", "steigung", 1)) {
      const { xp, yp, k } = meta(task);
      expect(xp).not.toBe(0);
      close(num(task, 0), yp / xp);
      close(num(task, 1), (yp / xp) * k);
      expect(Number.isInteger(Math.round(num(task, 1) * 1e9) / 1e9)).toBe(true);
    }
    const variants = [0, 0];
    for (const task of tasks("fu-4-ursprungsgeraden", "steigung", 2)) {
      const m = meta(task);
      variants[m.variant] += 1;
      if (m.variant === 0) {
        close(num(task, 0), m.m);
        close(num(task, 1), m.m * m.x2);
        close(m.m * num(task, 2), m.m * m.x3);
        expect(m.m).toBeGreaterThan(0);
        expect(m.x1).not.toBe(m.x2);
      } else {
        const dx = m.left ? -m.q : m.q;
        const dy = m.up ? Math.abs(m.p) : -Math.abs(m.p);
        close(num(task, 0), dy / dx);
        close(num(task, 0), m.p / m.q);
        close(num(task, 1), (m.p / m.q) * m.k);
      }
    }
    expect(variants.every((n) => n > 40), `${variants}`).toBe(true);
  });

  it("6.4 Punktprobe, missing coordinates and claims about proportional situations", () => {
    const verdicts = [0, 0];
    for (const task of tasks("fu-4-ursprungsgeraden", "punktprobe", 1)) {
      const { p, q, a, b, askY, c } = meta(task);
      const m = p / q;
      const on = Math.abs(m * a - b) < 1e-9;
      expect(choice(task, 0).correctIndex).toBe(on ? 0 : 1);
      verdicts[on ? 0 : 1] += 1;
      if (askY) close(num(task, 1), m * c);
      else close(m * num(task, 1), c);
    }
    expect(verdicts.every((n) => n > 60), `${verdicts}`).toBe(true);
    for (const task of tasks("fu-4-ursprungsgeraden", "punktprobe", 2)) {
      const { m, x2, x3, claimed } = meta(task);
      expect(choice(task, 0).correctIndex).toBe(Math.abs(claimed - m * x2) < 1e-9 ? 0 : 1);
      close(num(task, 1), m * x2);
      close(num(task, 2), x3);
      expect(claimed).toBeGreaterThan(0);
    }
  });

  it("6.5 the slope of the perpendicular and the check with a point", () => {
    for (const task of tasks("fu-5-senkrecht", "senkrecht-m", 1)) {
      const { p1, q1, k } = meta(task);
      close(num(task, 0) * (p1 / q1), -1);
      close(num(task, 1), num(task, 0) * k);
    }
    const onH = [0, 0];
    for (const task of tasks("fu-5-senkrecht", "senkrecht-m", 2)) {
      const { a, b, qx, qy, xR } = meta(task);
      const mh = num(task, 0);
      close(mh * (b / a), -1);
      // Q on h: the vector OQ is perpendicular to OP
      const on = a * qx + b * qy === 0;
      expect(choice(task, 1).correctIndex).toBe(on ? 0 : 1);
      onH[on ? 0 : 1] += 1;
      close(num(task, 2), mh * xR);
    }
    expect(onH.every((n) => n > 40), `${onH}`).toBe(true);
  });

  it("6.5 deciding perpendicularity: the product and the dot product agree", () => {
    const verdicts = [0, 0];
    for (const task of tasks("fu-5-senkrecht", "pruefen", 1)) {
      const { p1, q1, p2, q2 } = meta(task);
      close(num(task, 0), (p1 / q1) * (p2 / q2));
      const perp = q1 * q2 + p1 * p2 === 0;
      expect(choice(task, 1).correctIndex).toBe(perp ? 0 : 1);
      verdicts[perp ? 0 : 1] += 1;
    }
    expect(verdicts.every((n) => n > 60), `${verdicts}`).toBe(true);
    for (const task of tasks("fu-5-senkrecht", "pruefen", 2)) {
      const { ax, ay, bx, by } = meta(task);
      close(num(task, 0), ay / ax);
      close(num(task, 1), by / bx);
      expect(choice(task, 2).correctIndex).toBe(ax * bx + ay * by === 0 ? 0 : 1);
      for (const c of [ax, ay, bx, by]) expect(Math.abs(c)).toBeLessThanOrEqual(10);
    }
  });

  it("6.6 drawing y = mx + t: the slope triangle, values and the Nullstelle", () => {
    for (const task of tasks("fu-6-geraden", "zeichnen", 1)) {
      const { p, q, t, a, x0 } = meta(task);
      const m = p / q;
      expect(picked(task, 0)).toBe(`${q} nach rechts, ${Math.abs(p)} nach ${p > 0 ? "oben" : "unten"}`);
      expect(new Set(choice(task, 0).options).size).toBe(3);
      close(num(task, 1), m * a + t);
      close(m * num(task, 2) + t, 0);
      close(num(task, 2), x0);
      expect(Number.isInteger(t)).toBe(true);
    }
    for (const task of tasks("fu-6-geraden", "zeichnen", 2)) {
      const { p, q, t } = meta(task);
      close(num(task, 0), p / q);
      expect(num(task, 1)).toBe(t);
      close(num(task, 0) * num(task, 2) + num(task, 1), 0);
    }
  });

  it("6.6 reading lines: intercepts, axis-parallel lines and the shifted Ursprungsgerade", () => {
    const variants = [0, 0, 0];
    for (const task of tasks("fu-6-geraden", "ablesen", 1)) {
      const m = meta(task);
      variants[m.variant] += 1;
      if (m.variant === 0) {
        // the line through (0 | t) and (x₀ | 0)
        close(num(task, 0), (0 - m.t) / (m.x0 - 0));
        expect(num(task, 1)).toBe(m.t);
      } else if (m.variant === 1) {
        expect(num(task, 0)).toBe(0);
        expect(num(task, 1)).toBe(m.b);
      } else {
        expect(num(task, 0)).toBe(m.a);
        expect(choice(task, 1).correctIndex).toBe(1);
      }
    }
    expect(variants.every((n) => n > 25), `${variants}`).toBe(true);
    for (const task of tasks("fu-6-geraden", "ablesen", 2)) {
      const { p, q, t, a, b } = meta(task);
      const m = p / q;
      expect(num(task, 0)).toBe(t);
      close(m * num(task, 1) + t, 0);
      expect(choice(task, 2).correctIndex).toBe(Math.abs(m * a + t - b) < 1e-9 ? 0 : 1);
    }
  });

  it("accepts slopes typed as fractions", () => {
    for (const task of tasks("fu-4-ursprungsgeraden", "steigung", 1).slice(0, 60)) {
      const { xp, yp } = meta(task);
      const inputs = task.fields.map((f, i) => (i === 0 ? `${yp}/${xp}` : f.kind === "number" ? String(f.answer) : "0"));
      expect(checkTask(task, inputs).status, task.prompt).toBe("correct");
    }
  });
});

describe("Labore der Etappe 6", () => {
  it("6.1 the relation lab finds the x with two y-values and reads D and W", () => {
    const lab = lesson("fu-1-funktionen").lab;
    const start = at(lab, {});
    expect(start.r.art).toBe("eine Funktion");
    expect(start.r.D).toBe("D = {0; 1; 2; 4; 5}");
    expect(start.r.W).toBe("W = {1; 2; 3; 4; 5}");
    expect(start.r.test).toBe("keinen Punkt");
    const broken = at(lab, GOAL_WITNESSES_STAGE_6["fu-1-funktionen"]["zwei-werte"]);
    expect(broken.r.art).toBe("keine Funktion: x = 2 hat 2 y-Werte");
    expect(broken.r.test).toBe("2 Punkte");
    expect(broken.r.D).toBe("D = {0; 1; 2; 5}");
    const constant = at(lab, GOAL_WITNESSES_STAGE_6["fu-1-funktionen"].konstant);
    expect(constant.r.W).toBe("W = {2}");
    // whatever the points, "Funktion" means every x has one y
    for (const values of enumerateLabGrid({ ...lab, params: lab.params.filter((p) => ["x1", "x2", "y1", "y2", "s"].includes(p.key)) }, 4)) {
      const v = { ...defaultLabValues(lab), ...values };
      const info = analyseRelation(relationPoints(v));
      const xs = relationPoints(v).map((p) => p.x);
      const expected = xs.every((x) => new Set(relationPoints(v).filter((p) => p.x === x).map((p) => p.y)).size === 1);
      expect(info.isFunction).toBe(expected);
    }
  });

  it("6.2 the representations agree: readout, table and term", () => {
    const lab = lesson("fu-2-darstellungen").lab;
    expect(at(lab, {}).r.wert).toBe("f(2) = 2");
    expect(at(lab, { f: 1, x: -3 }).r.wert).toBe("f(−3) = 7");
    expect(at(lab, { f: 2, x: 8 }).r.wert).toBe("f(8) = 1,5");
    expect(at(lab, { f: 2, x: -1 }).r.wert).toBe("x = −1 liegt nicht in D");
    expect(at(lab, { f: 3, x: 6 }).r.wert).toBe("f(6) = 15,5");
    expect(at(lab, { f: 4, x: 2.5 }).r.wert).toBe("x = 2,5 liegt nicht in D");
    expect(at(lab, { f: 4, x: 4 }).r.wert).toBe("f(4) = 6");
  });

  it("6.3 D, W and the Nullstellen in D", () => {
    const lab = lesson("fu-3-werte-nullstellen").lab;
    const start = at(lab, {});
    expect(start.r.D).toBe("D = [−2; 4]");
    expect(start.r.W).toBe("W = [−2; 1]");
    expect(start.r.null).toBe("x₀ = 2");
    expect(at(lab, { f: 1, a: 4, b: -1 }).r.W).toBe("W = [−1; 4]");
    expect(at(lab, { f: 2, a: -3, b: 3 }).r.null).toBe("x₁ = −2 und x₂ = 2");
    expect(at(lab, { f: 2, a: -1, b: 4 }).r.W).toBe("W = [−2; 6]");
    expect(at(lab, { f: 0, a: 3, b: 3 }).r.D).toBe("D = {3}");
    // W really is the set of values: sampled values stay inside, both ends are reached
    for (const values of enumerateLabGrid(lab, 9)) {
      const v = values as LabValues;
      const { lo, hi } = domainOf(v);
      const W = valueSet(v);
      const f = [(x: number) => 0.5 * x - 1, (x: number) => -x + 3, (x: number) => 0.5 * x * x - 2][v.f];
      const xs = Array.from({ length: 41 }, (_, i) => lo + ((hi - lo) * i) / 40);
      if (lo < 0 && hi > 0) xs.push(0);
      const samples = xs.map(f);
      for (const y of samples) {
        expect(y).toBeGreaterThanOrEqual(W.lo - 1e-9);
        expect(y).toBeLessThanOrEqual(W.hi + 1e-9);
      }
      close(Math.min(...samples), W.lo, 1e-9);
      close(Math.max(...samples), W.hi, 1e-9);
      for (const z of zerosInDomain(v)) close(f(z), 0);
    }
  });

  it("6.4 the readouts of the Ursprungsgerade and the target Q", () => {
    const lab = lesson("fu-4-ursprungsgeraden").lab;
    const start = at(lab, {});
    expect(start.r.gl).toBe("y = 1,5x");
    expect(start.r.m).toBe("1,5");
    expect(start.r.dy).toBe("Δx = 1, Δy = 1,5");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-4-ursprungsgeraden"]["durch-q"]).r.gl).toBe("y = −0,75x");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-4-ursprungsgeraden"]["dreieck-ganz"]).r.gl).toBe("y = 2/3 x");
    expect(at(lab, { px: 3, py: 2, d: 2 }).r.dy).toBe("Δx = 2, Δy = 4/3");
    expect(at(lab, { px: 0, py: 4 }).r.gl).toBe("x = 0 (y-Achse), keine Funktion");
    expect(at(lab, { px: -3, py: 0 }).r.gl).toBe("y = 0");
    const goal = lab.goals.find((g) => g.id === "durch-q")!;
    for (const values of enumerateLabGrid(lab, 13)) {
      const v = values as LabValues;
      const r = computeReadouts(lab, v);
      const onLine = v.px !== 0 && Math.abs((v.py / v.px) * -4 - 3) < 1e-9;
      expect(goal.check(v, r)).toBe(onLine);
    }
  });

  it("6.5 the product is −1 exactly where the angle is 90°", () => {
    const lab = lesson("fu-5-senkrecht").lab;
    const start = at(lab, {});
    expect(start.r.m1).toBe("1/3 ≈ 0,33");
    expect(start.r.m2).toBe("−2");
    expect(start.r.produkt).toBe("−2/3 ≈ −0,67");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-5-senkrecht"].bruch).r.produkt).toBe("−1");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-5-senkrecht"].achse).r.produkt).toBe("nicht berechenbar");
    for (const values of enumerateLabGrid(lab, 7)) {
      const v = values as LabValues;
      const r = computeReadouts(lab, v);
      if (v.x1 === 0 || v.x2 === 0 || v.y1 === 0 || v.y2 === 0) continue;
      const productIsMinusOne = Math.abs((v.y1 / v.x1) * (v.y2 / v.x2) + 1) < 1e-9;
      expect(r.produkt === "−1", JSON.stringify(v)).toBe(productIsMinusOne);
      expect(Math.abs(Number(r.winkel) - 90) < 1e-9, JSON.stringify(v)).toBe(productIsMinusOne);
    }
  });

  it("6.6 the readouts of y = mx + t and the Nullstelle on the grid", () => {
    const lab = lesson("fu-6-geraden").lab;
    const start = at(lab, {});
    expect(start.r.gl).toBe("y = 1,5x − 3");
    expect(start.r.achse).toBe("(0 | −3)");
    expect(start.r.null).toBe("x₀ = 2");
    expect(at(lab, { m: 0.75, t: 1 }).r.null).toBe("x₀ ≈ −1,33");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-6-geraden"]["zwei-punkte"]).r.gl).toBe("y = 0,5x + 2");
    expect(at(lab, GOAL_WITNESSES_STAGE_6["fu-6-geraden"]["parallele-x"]).r.null).toBe("keine (parallel zur x-Achse)");
    expect(at(lab, { m: 0, t: 0 }).r.null).toBe("jede Stelle (die x-Achse)");
    for (const values of enumerateLabGrid(lab, 25)) {
      const v = values as LabValues;
      if (v.m === 0) continue;
      const shown = String(computeReadouts(lab, v).null);
      const x0 = Number(shown.replace(/^x₀ = (≈ )?/, "").replace("−", "-").replace(",", "."));
      expect(Math.abs(v.m * x0 + v.t), shown).toBeLessThanOrEqual(0.006 * Math.abs(v.m));
    }
  });
});
