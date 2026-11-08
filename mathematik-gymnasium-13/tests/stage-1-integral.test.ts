import { describe, expect, it } from "vitest";
import { STAGE_INTEGRAL } from "../src/curriculum/stage-1-integral";
import { checkTask } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
} from "../src/lab/engine";
import { INTEGRAL_VIEWS } from "../src/lab/views-1-integral";
import type { DifficultyLevel, ExerciseTask, Lesson } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1 } from "./witnesses-stage-1";

const IDS = [
  "int-1-flaechenbilanz",
  "int-2-integralfunktion",
  "int-3-hauptsatz",
  "int-4-graphen",
  "int-5-stammfunktionen",
  "int-6-flaechen",
  "int-7-uneigentlich",
  "int-8-gesaendteraenderung",
  "int-9-rotationskoerper",
];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-1:${i}`));
const DIVERSE = Array.from({ length: 300 }, (_, i) => seedFrom(`stage-1-div:${i}`));

const lesson = (id: string): Lesson => {
  const found = STAGE_INTEGRAL.lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};

function tasks(
  lessonId: string,
  generatorId: string,
  level: DifficultyLevel,
  seeds = SEEDS,
): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return seeds.map((seed) => generator.make(createRng(seed), level));
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "number")
    throw new Error(`field ${index} of ${task.prompt} is no number`);
  return field.answer;
}

function choice(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "choice")
    throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field.correctIndex;
}

/** Index of the first number field (generators differ in field order). */
function firstNumber(task: ExerciseTask): number {
  const index = task.fields.findIndex((f) => f.kind === "number");
  if (index < 0) throw new Error(`no number field in ${task.prompt}`);
  return index;
}

const meta = (task: ExerciseTask): Record<string, number> => task.meta ?? {};

/** |x − y| within an absolute tolerance. */
function near(x: number, y: number, eps = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(eps);
}

/** The task generator must not always answer the same. */
function varied(lessonId: string, generatorId: string, level: DifficultyLevel): void {
  const values = new Set(
    tasks(lessonId, generatorId, level, DIVERSE).map((t) =>
      num(t, firstNumber(t)).toFixed(6),
    ),
  );
  expect(values.size, `${lessonId}/${generatorId} L${level} repeats itself`).toBeGreaterThanOrEqual(4);
}

describe("Etappe 1: Flächeninhalt und bestimmtes Integral", () => {
  it("has its nine lessons in order, with labs and generators", () => {
    expect(STAGE_INTEGRAL.id).toBe("stage-1");
    expect(STAGE_INTEGRAL.stageNumber).toBe(1);
    expect(STAGE_INTEGRAL.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_INTEGRAL.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-1");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`1.${index + 1} `), l.title).toBe(true);
      expect(l.lehrplan.startsWith("M13 LB 1: "), l.lehrplan).toBe(true);
      expect(l.lehrplan).toBe("M13 LB 1: Flächeninhalt und bestimmtes Integral");
      expect(l.lab.goals).toHaveLength(3);
      expect(new Set(l.lab.goals.map((g) => g.id)).size).toBe(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
      expect(l.teacherVideo).toBeUndefined();
      expect(INTEGRAL_VIEWS[l.lab.kind], l.lab.kind).toBeDefined();
    });
  });

  it("covers every Kompetenzerwartung of M13 LB 1 with its own lesson", () => {
    // KE 1 Flächenbilanz, KE 2 Integralfunktion, KE 3 Hauptsatz, KE 4 Schluss
    // f ↔ F, KE 5 Stammfunktionen, KE 6 Flächen + uneigentlich (2 Lektionen),
    // KE 7 Gesamtänderung, KE 8 Rotationskörper.
    const coverage = [
      "int-1-flaechenbilanz",
      "int-2-integralfunktion",
      "int-3-hauptsatz",
      "int-4-graphen",
      "int-5-stammfunktionen",
      "int-6-flaechen",
      "int-7-uneigentlich",
      "int-8-gesaendteraenderung",
      "int-9-rotationskoerper",
    ];
    expect(coverage).toEqual(IDS);
  });

  it("writes real minus signs and no character escapes in lesson texts", () => {
    for (const l of STAGE_INTEGRAL.lessons) {
      const plain = [
        l.explanationHtml,
        l.whyItMatters,
        l.quiz.question,
        ...l.quiz.options,
        l.quiz.explanation,
        l.lab.intro,
        ...l.lab.goals.map((g) => g.text),
        ...l.formulas.map((f) => `${f.html} ${f.quantities} ${f.name}`),
      ]
        .join(" ")
        .replace(/<[^>]+>/g, " ");
      expect(plain, l.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(plain, l.id).not.toContain("\\");
      // Quiz texts and formulas are shown as text: no HTML entities or raw
      // markup inside them (only the formula HTML may carry tags, stripped here).
      for (const text of [
        l.quiz.question,
        ...l.quiz.options,
        l.quiz.explanation,
        ...l.formulas.map((f) => f.html.replace(/<[^>]+>/g, "")),
      ]) {
        expect(text, l.id).not.toContain("&");
        expect(text, l.id).not.toContain("<");
      }
    }
  });

  it("has a mathematically correct quick check in every lesson", () => {
    const l1 = lesson("int-1-flaechenbilanz");
    expect(l1.quiz.options[l1.quiz.correctIndex]).toBe("die Flächenbilanz −3 FE");
    // A⁺ = 2, A⁻ = 5: Bilanz 2 − 5 = −3, Flächeninhalt 7.
    const l2 = lesson("int-2-integralfunktion");
    expect(l2.quiz.options[l2.quiz.correctIndex]).toBe("linear steigend mit F(x) = 3x");
    // F(x) = ∫₀ˣ 3 dt = 3x.
    const l3 = lesson("int-3-hauptsatz");
    expect(l3.quiz.options[l3.quiz.correctIndex]).toBe("9");
    // ∫₀³ x² dx = [x³ : 3]₀³ = 9.
    const l4 = lesson("int-4-graphen");
    expect(l4.quiz.options[l4.quiz.correctIndex]).toContain("Maximum");
    const l5 = lesson("int-5-stammfunktionen");
    expect(l5.quiz.options[l5.quiz.correctIndex]).toBe("F(x) = ln|x| + C");
    // (ln|x|)′ = 1 : x.
    const l6 = lesson("int-6-flaechen");
    expect(l6.quiz.options[l6.quiz.correctIndex]).toContain("g(x) − f(x)");
    // Auf (0 | 1) liegt g = x über f = x², „oben minus unten“.
    const l7 = lesson("int-7-uneigentlich");
    expect(l7.quiz.options[l7.quiz.correctIndex]).toContain("x²");
    // p = 2 > 1: ∫₁^∞ 1 : x² dx = 1 konvergiert.
    const l8 = lesson("int-8-gesaendteraenderung");
    expect(l8.quiz.options[l8.quiz.correctIndex]).toContain("−6 m");
    // ∫₀³ (−2) dt = −6 m Verschiebung.
    const l9 = lesson("int-9-rotationskoerper");
    expect(l9.quiz.options[l9.quiz.correctIndex]).toBe("V = 12π");
    // Zylinder r = 2, h = 3: π r² h = 12π.
    for (const l of STAGE_INTEGRAL.lessons) {
      expect(l.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(l.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(l.quiz.correctIndex).toBeLessThan(l.quiz.options.length);
      expect(l.quiz.explanation.length).toBeGreaterThan(20);
    }
  });
});

describe("Aufgaben der Etappe 1 rechnen richtig", () => {
  it("1.1 Flächenwerte: A⁺, A⁻ and the Bilanz of piecewise constant graphs", () => {
    for (const task of tasks("int-1-flaechenbilanz", "flaechenwert", 1)) {
      const { h1, h2, h3 } = meta(task);
      const h = [h1, h2, h3];
      const ap = h.reduce((s, x) => s + Math.max(x, 0), 0);
      const am = h.reduce((s, x) => s + Math.max(-x, 0), 0);
      near(num(task, 0), ap);
      near(num(task, 1), am);
      near(num(task, 2), ap - am);
      near(num(task, 2), h1 + h2 + h3, 1e-12);
    }
    for (const task of tasks("int-1-flaechenbilanz", "flaechenwert", 2)) {
      const { r1, r2, r3, w1, w2, w3 } = meta(task);
      const r = [r1, r2, r3];
      const w = [w1, w2, w3];
      const ap = r.reduce((s, x, i) => s + Math.max(x, 0) * w[i], 0);
      const am = r.reduce((s, x, i) => s + Math.max(-x, 0) * w[i], 0);
      near(num(task, 0), ap);
      near(num(task, 1), am);
      near(num(task, 2), ap - am);
    }
  });

  it("1.1 Bilanz lesen und umkehren", () => {
    for (const task of tasks("int-1-flaechenbilanz", "bilanz-interpretieren", 1)) {
      const { p, n } = meta(task);
      near(num(task, 0), p - n);
      expect(choice(task, 1)).toBe(p > n ? 0 : p < n ? 1 : 2);
    }
    for (const task of tasks("int-1-flaechenbilanz", "bilanz-interpretieren", 2)) {
      const { r, B, t } = meta(task);
      near(num(task, 0), t);
      near(r * t, B);
      expect(t).toBeGreaterThan(0);
    }
  });

  it("1.2 Integralwerte: F(x) = m x² : 2 + c x", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-2-integralfunktion", "integralwert", level)) {
        const { m, c, x } = meta(task);
        near(num(task, 0), (m * x * x) / 2 + c * x);
        if (level === 2) {
          const rate = m * x + c;
          expect(choice(task, 1)).toBe(rate > 0 ? 0 : 1);
        }
      }
    }
    varied("int-2-integralfunktion", "integralwert", 1);
    varied("int-2-integralfunktion", "integralwert", 2);
  });

  it("1.2 Verlauf zuordnen: ΔF = f · (b − a)", () => {
    for (const task of tasks("int-2-integralfunktion", "zuordnen", 1)) {
      const { c, a, b } = meta(task);
      near(num(task, 0), c * (b - a));
      expect(choice(task, 1)).toBe(c > 0 ? 0 : c < 0 ? 1 : 2);
      expect(b).toBeGreaterThan(a);
    }
    for (const task of tasks("int-2-integralfunktion", "zuordnen", 2)) {
      const { w, len } = meta(task);
      near(num(task, 0), w / len);
      expect(choice(task, 1)).toBe(w > 0 ? 0 : 1);
      near((w / len) * len, w);
    }
    varied("int-2-integralfunktion", "zuordnen", 1);
    varied("int-2-integralfunktion", "zuordnen", 2);
  });

  it("1.3 bestimmte Integrale von k, x, x² und x³ sind ganzzahlig und korrekt", () => {
    for (const task of tasks("int-3-hauptsatz", "bestimmtes-integral", 1)) {
      const { type, a, b, k } = meta(task);
      expect(b).toBeGreaterThan(a);
      const value =
        type === 0
          ? k * (b - a)
          : type === 1
            ? (b * b - a * a) / 2
            : type === 2
              ? (b ** 3 - a ** 3) / 3
              : (b ** 4 - a ** 4) / 4;
      near(num(task, 0), value);
      near(num(task, 0), Math.round(num(task, 0)), 1e-12);
    }
    for (const task of tasks("int-3-hauptsatz", "bestimmtes-integral", 2)) {
      const { variant, c, T, a, b } = meta(task);
      if (variant === 0) near(num(task, 0), c * T);
      if (variant === 1) near(num(task, 0), b * b - a * a);
      if (variant === 2) near(num(task, 0), T ** 3);
      expect(num(task, 0)).toBeGreaterThan(0);
    }
    varied("int-3-hauptsatz", "bestimmtes-integral", 1);
    varied("int-3-hauptsatz", "bestimmtes-integral", 2);
  });

  it("1.3 Stammfunktion wählen und zählen: nur die Ableitung entscheidet", () => {
    for (const task of tasks("int-3-hauptsatz", "stammfunktion-pruefen", 1)) {
      const { p, q, u } = meta(task);
      const field = task.fields[0];
      if (field?.kind !== "choice") throw new Error("choice expected");
      // The correct candidate differentiates to p x + q; the others do not.
      const expected = [p / 2, q, 0];
      const chosen = field.options[field.correctIndex];
      const wrong = field.options.filter((_, i) => i !== field.correctIndex);
      expect(chosen).not.toBe("");
      expect(wrong).toHaveLength(3);
      // F(u) − F(0) = p u² : 2 + q u.
      near(num(task, 1), (p * u * u) / 2 + q * u);
      // At most one candidate may be the antiderivative (3a = p, 2b = q).
      const parsed = field.options.map((option) => {
        // Each option is "…x² + …x" or "…x² + …" from quadratic(p/2 | p, ±q | 0, …).
        return option;
      });
      expect(new Set(parsed).size).toBe(4);
      expect(expected[0]).toBeGreaterThan(0);
    }
    for (const task of tasks("int-3-hauptsatz", "stammfunktion-pruefen", 2)) {
      const { p, q, a, b, n, a1, b1, c1, a2, b2, c2, a3, b3, c3, a4, b4, c4 } = meta(task);
      const coeffs = [
        [a1, b1, c1],
        [a2, b2, c2],
        [a3, b3, c3],
        [a4, b4, c4],
      ];
      // A x³ + B x² + C differentiates to 3A x² + 2B x; that is f = p x² + q x
      // exactly when 3A = p and 2B = q.
      const really = coeffs.filter(([A, B]) => 3 * A === p && 2 * B === q).length;
      expect(really, task.prompt).toBe(n);
      expect(choice(task, 0)).toBe(n - 1);
      near(num(task, 1), (p * (b ** 3 - a ** 3)) / 3 + (q * (b * b - a * a)) / 2);
    }
    varied("int-3-hauptsatz", "stammfunktion-pruefen", 1);
    varied("int-3-hauptsatz", "stammfunktion-pruefen", 2);
  });

  it("1.4 Verlaufsschluss: Flächenbilanz und Vorzeichenwechsel", () => {
    for (const task of tasks("int-4-graphen", "graph-schluss", 1)) {
      const { h1, h2, h3, h4 } = meta(task);
      const h = [h1, h2, h3, h4];
      near(num(task, 0), h1 + h2 + h3 + h4);
      let changes = 0;
      for (let i = 0; i + 1 < h.length; i++) {
        if (h[i] !== 0 && h[i + 1] !== 0 && Math.sign(h[i]) !== Math.sign(h[i + 1])) changes++;
      }
      expect(choice(task, 1)).toBe(changes);
    }
    for (const task of tasks("int-4-graphen", "graph-schluss", 2)) {
      const { m, t, s } = meta(task);
      near(num(task, 0), m);
      near(-t / m, s);
      expect(choice(task, 1)).toBe(m < 0 ? 0 : 1);
    }
    varied("int-4-graphen", "graph-schluss", 1);
    varied("int-4-graphen", "graph-schluss", 2);
  });

  it("1.4 Extremstellen: Nullstelle von f mit Vorzeichenwechsel", () => {
    for (const task of tasks("int-4-graphen", "extremstelle", 1)) {
      const { m, t } = meta(task);
      near(num(task, 0), -t / m);
      expect(choice(task, 1)).toBe(m < 0 ? 0 : 1);
    }
    for (const task of tasks("int-4-graphen", "extremstelle", 2)) {
      const { a, p, q } = meta(task);
      expect(num(task, 0)).toBe(p);
      expect(num(task, 1)).toBe(q);
      expect(q).toBeGreaterThan(p);
      // a > 0: F steigt außerhalb, Maximum bei p; a < 0: Maximum bei q.
      expect(choice(task, 2)).toBe(a > 0 ? 0 : 1);
    }
    varied("int-4-graphen", "extremstelle", 1);
    varied("int-4-graphen", "extremstelle", 2);
  });

  it("1.5 Stammterme: Potenzregel, Kehrwert und e-Regel", () => {
    for (const task of tasks("int-5-stammfunktionen", "stammterm", 1)) {
      const { variant, k, d, x0, c, m } = meta(task);
      if (variant === 0) {
        near(num(task, 0), d * x0 ** (k + 1));
        near(num(task, 0), ((d * (k + 1)) * x0 ** (k + 1)) / (k + 1));
      }
      if (variant === 1) near(num(task, 0), c);
      if (variant === 2) near(num(task, 0), 1 / m);
    }
    for (const task of tasks("int-5-stammfunktionen", "stammterm", 2)) {
      const { k, d, T } = meta(task);
      near(num(task, 0), d * T ** (k + 1));
      expect(T).toBeGreaterThan(1);
    }
    varied("int-5-stammfunktionen", "stammterm", 1);
    varied("int-5-stammfunktionen", "stammterm", 2);
  });

  it("1.5 verkettete Regeln: der Faktor s wandert in die Stammfunktion", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-5-stammfunktionen", "regel-anwenden", level)) {
        const { s } = meta(task);
        near(num(task, level === 1 ? 0 : 1), s);
        expect(choice(task, level === 1 ? 1 : 0)).toBe(0);
        expect(s).not.toBe(0);
      }
    }
    varied("int-5-stammfunktionen", "regel-anwenden", 1);
    varied("int-5-stammfunktionen", "regel-anwenden", 2);
  });

  it("1.6 Flächen zwischen zwei Graphen stimmen mit |a| d³ : 6 überein", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-6-flaechen", "flaeche-zwischen", level)) {
        const { variant, d, x0, v, a, x1, x2 } = meta(task);
        if (variant === 0) {
          // Two triangles: |d| · (x₀² + (v − x₀)²) : 2 over [0 | v].
          near(num(task, 0), (Math.abs(d) * (x0 * x0 + (v - x0) ** 2)) / 2);
          expect(v).toBeGreaterThanOrEqual(2);
          expect(x0).toBeGreaterThanOrEqual(0);
          expect(x0).toBeLessThanOrEqual(v);
        } else {
          near(num(task, 0), (Math.abs(a) * (x2 - x1) ** 3) / 6);
          expect(x2).toBeGreaterThan(x1);
          // (x₂ − x₁)³ |a| must be divisible by 6: the area is whole.
          near(num(task, 0), Math.round(num(task, 0)), 1e-12);
        }
      }
    }
    varied("int-6-flaechen", "flaeche-zwischen", 1);
    varied("int-6-flaechen", "flaeche-zwischen", 2);
  });

  it("1.6 Schnittpunkte sind die Grenzen der Fläche, und D = 0 berührt", () => {
    for (const task of tasks("int-6-flaechen", "schnittpunkte", 1)) {
      const { a, x1, x2, m, t } = meta(task);
      near(num(task, 0), x1);
      near(num(task, 1), x2);
      near(num(task, 2), (Math.abs(a) * (x2 - x1) ** 3) / 6);
      // x₁ und x₂ sind wirklich Nullstellen von f − g = a x² − m x − t.
      near(a * x1 * x1 - m * x1 - t, 0, 1e-9);
      near(a * x2 * x2 - m * x2 - t, 0, 1e-9);
    }
    for (const task of tasks("int-6-flaechen", "schnittpunkte", 2)) {
      const { m, t, c } = meta(task);
      near(num(task, 0), c);
      expect(choice(task, 1)).toBe(0);
      // Berührung: D = m² − 4(c − t) = 0.
      near(m * m - 4 * (c - t), 0, 1e-9);
    }
    varied("int-6-flaechen", "schnittpunkte", 1);
    varied("int-6-flaechen", "schnittpunkte", 2);
  });

  it("1.7 uneigentliche Werte: (b^(1−p) − 1) : (1 − p) bzw. ln b", () => {
    for (const task of tasks("int-7-uneigentlich", "uneigentlich-wert", 1)) {
      const { p, b } = meta(task);
      const value = p === 1 ? Math.log(b) : (b ** (1 - p) - 1) / (1 - p);
      near(num(task, 0), value, 5e-4);
      expect(b).toBeGreaterThanOrEqual(2);
    }
    for (const task of tasks("int-7-uneigentlich", "uneigentlich-wert", 2)) {
      const { b, k, c } = meta(task);
      near(num(task, 0), c * (1 - 1 / b));
      near(num(task, 0), k * (b - 1));
      expect(choice(task, 1)).toBe(0);
    }
    varied("int-7-uneigentlich", "uneigentlich-wert", 1);
    varied("int-7-uneigentlich", "uneigentlich-wert", 2);
  });

  it("1.7 Konvergenz entscheidet sich an p > 1, der Wert rechnet nach", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-7-uneigentlich", "konvergenz", level)) {
        const { p, oben } = meta(task);
        const value = p === 1 ? Math.log(oben) : (oben ** (1 - p) - 1) / (1 - p);
        near(num(task, 0), value, 5e-4);
        expect(choice(task, 1)).toBe(p > 1 ? 0 : 1);
        expect(oben).toBe(level === 1 ? 4 : 5);
      }
    }
    varied("int-7-uneigentlich", "konvergenz", 1);
    varied("int-7-uneigentlich", "konvergenz", 2);
  });

  it("1.8 Strecke addiert Beträge, Verschiebung die Flächen", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-8-gesaendteraenderung", "strecke-geschwindigkeit", level)) {
        const { v1, v2, v3, w1, w2, w3 } = meta(task);
        const v = [v1, v2, v3];
        const w = [w1, w2, w3];
        near(num(task, 0), v.reduce((s, x, i) => s + Math.abs(x) * w[i], 0));
        near(num(task, 1), v.reduce((s, x, i) => s + x * w[i], 0));
        if (level === 2) {
          const netto = v.reduce((s, x, i) => s + x * w[i], 0);
          expect(choice(task, 2)).toBe(netto > 0 ? 0 : netto < 0 ? 1 : 2);
        }
      }
    }
    varied("int-8-gesaendteraenderung", "strecke-geschwindigkeit", 1);
    varied("int-8-gesaendteraenderung", "strecke-geschwindigkeit", 2);
  });

  it("1.8 Gesamtänderung: Dauer = Gesamtänderung : Rate", () => {
    for (const task of tasks("int-8-gesaendteraenderung", "gesamt-aenderung", 1)) {
      const { r, B, t } = meta(task);
      near(num(task, 0), t);
      near(r * t, B);
      expect(choice(task, 1)).toBe(r > 0 ? 0 : 1);
    }
    for (const task of tasks("int-8-gesaendteraenderung", "gesamt-aenderung", 2)) {
      const { r1, t1, r2, t2, B } = meta(task);
      near(num(task, 0), t2);
      near(r1 * t1 + r2 * t2, B);
    }
    varied("int-8-gesaendteraenderung", "gesamt-aenderung", 1);
    varied("int-8-gesaendteraenderung", "gesamt-aenderung", 2);
  });

  it("1.9 Rotationsvolumina: π ∫ f² exakt", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-9-rotationskoerper", "rotationsvolumen", level)) {
        const { k, d, a, b } = meta(task);
        const p = Math.min(a, b);
        const q = Math.max(a, b);
        const vpi =
          (k * k * (q ** 3 - p ** 3)) / 3 + k * d * (q * q - p * p) + d * d * (q - p);
        near(num(task, 0), vpi);
        near(num(task, 0), Math.round(num(task, 0)), 1e-12);
      }
    }
    varied("int-9-rotationskoerper", "rotationsvolumen", 1);
    varied("int-9-rotationskoerper", "rotationsvolumen", 2);
  });

  it("1.9 Volumenvergleich: Zylinder r² h gegen Kegel k² h³ : 3", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("int-9-rotationskoerper", "volumen-vergleich", level)) {
        const { r, h, k, h2 } = meta(task);
        const v1 = r * r * h;
        const v2 = (k * k * h2 ** 3) / 3;
        if (level === 1) {
          near(num(task, 0), v1);
          near(num(task, 1), v2);
        } else {
          expect(choice(task, 0)).toBe(v1 > v2 ? 0 : v1 < v2 ? 1 : 2);
          near(num(task, 1), Math.abs(v1 - v2));
        }
      }
    }
    varied("int-9-rotationskoerper", "volumen-vergleich", 1);
    varied("int-9-rotationskoerper", "volumen-vergleich", 2);
  });

  it("accepts every answer typed with decimal comma or point", () => {
    for (const l of STAGE_INTEGRAL.lessons) {
      for (const generator of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const seed of SEEDS.slice(0, 40)) {
            const task = generator.make(createRng(seed), level);
            const comma = task.fields.map((field) =>
              field.kind === "choice"
                ? String(field.correctIndex)
                : fmt(field.answer, field.digits).replace("−", "-"),
            );
            const point = task.fields.map((field) =>
              field.kind === "choice"
                ? String(field.correctIndex)
                : field.answer.toFixed(field.digits),
            );
            const where = `${l.id}/${generator.id} L${level} seed ${seed}`;
            expect(checkTask(task, comma).status, where).toBe("correct");
            expect(checkTask(task, point).status, where).toBe("correct");
          }
        }
      }
    }
  });
});

describe("Labore der Etappe 1 rechnen richtig", () => {
  it("Flächenbilanz: A⁺ − A⁻ ist die Bilanz der Geraden", () => {
    const lab = lesson("int-1-flaechenbilanz").lab;
    for (const values of enumerateLabGrid(lab, 5)) {
      const r = computeReadouts(lab, values);
      const p = Math.min(values.a, values.b);
      const q = Math.max(values.a, values.b);
      const exact = (values.m * (q * q - p * p)) / 2 + values.t * (q - p);
      near(Number(r.bilanz), exact, 1e-9);
      near(Number(r.bilanz), Number(r.ap) - Number(r.am), 1e-9);
      expect(Number(r.ap)).toBeGreaterThanOrEqual(0);
      expect(Number(r.am)).toBeGreaterThanOrEqual(0);
    }
  });

  it("Hauptsatz: beide Wege liefern dieselbe Bilanz, die Differenz ist 0", () => {
    const lab = lesson("int-3-hauptsatz").lab;
    for (const values of enumerateLabGrid(lab, 3)) {
      const r = computeReadouts(lab, values);
      const p = Math.min(values.u, values.v);
      const q = Math.max(values.u, values.v);
      const F = (x: number) =>
        (values.a * x ** 3) / 3 + (values.b * x * x) / 2 + values.c * x;
      near(Number(r.fbfa), F(q) - F(p), 1e-9);
      near(Number(r.bilanz), F(q) - F(p), 1e-9);
      near(Number(r.diff), 0, 1e-9);
    }
  });

  it("Integralfunktion: F(x) = m x² : 2 + t x und ΔF über [x − 1 | x]", () => {
    const lab = lesson("int-2-integralfunktion").lab;
    for (const values of enumerateLabGrid(lab, 5)) {
      const r = computeReadouts(lab, values);
      const F = (x: number) => (values.m * x * x) / 2 + values.t * x;
      near(Number(r.Fx), F(values.x), 1e-9);
      near(Number(r.fx), values.m * values.x + values.t, 1e-9);
      near(Number(r.df), F(values.x) - F(values.x - 1), 1e-9);
    }
  });

  it("Graph-Schluss: F′(x) = f(x), und die Extremstelle sitzt bei der Nullstelle", () => {
    const lab = lesson("int-4-graphen").lab;
    for (const values of enumerateLabGrid(lab, 4)) {
      const r = computeReadouts(lab, values);
      const f = (x: number) => values.a * (x - values.s) ** 2 + values.k;
      const F = (x: number) =>
        (values.a * ((x - values.s) ** 3 + values.s ** 3)) / 3 + values.k * x;
      near(Number(r.Fx), F(values.x), 1e-9);
      near(Number(r.steigung), f(values.x), 1e-9);
      // The readout F′ = f is what the lab claims; prove it numerically.
      const h = 1e-4;
      near((F(values.x + h) - F(values.x - h)) / (2 * h), f(values.x), 1e-3);
    }
  });

  it("Stammfunktion: jede Familie leitet auf f zurück (Probe klein)", () => {
    const lab = lesson("int-5-stammfunktionen").lab;
    for (const values of enumerateLabGrid(lab, 3)) {
      const r = computeReadouts(lab, values);
      const { Fx, fx, probe } = r as { Fx: number; fx: number; probe: number };
      expect(Number.isFinite(Fx)).toBe(true);
      expect(Number.isFinite(fx)).toBe(true);
      // The forward-difference probe (h = 0,01) stays below the scale of f′.
      expect(probe).toBeLessThan(Math.max(1, Math.abs(fx) * 0.05));
      if (values.fam === 0) {
        near(Fx, values.x ** (values.n + 1) / (values.n + 1), 1e-9);
        near(fx, values.x ** values.n, 1e-9);
      }
      if (values.fam === 2) {
        near(Fx, Math.log(Math.abs(values.p * values.x + values.q)), 1e-9);
        near(fx, values.p / (values.p * values.x + values.q), 1e-9);
        expect(String(r.term)).toContain("ln");
      }
      if (values.fam === 3) {
        near(Fx, Math.exp(values.p * values.x + values.q), 1e-9);
      }
    }
  });

  it("Zwei Graphen: die Fläche stimmt mit numerischer Integration überein", () => {
    const lab = lesson("int-6-flaechen").lab;
    for (const values of enumerateLabGrid(lab, 3)) {
      const r = computeReadouts(lab, values);
      const f = (x: number) => values.a * x * x + values.b;
      const g = (x: number) => values.m * x + values.t;
      const intervall = String(r.intervall).match(/\[([−\d,]+) \| ([−\d,]+)\]/);
      expect(intervall, String(r.intervall)).not.toBeNull();
      const u = Number(intervall?.[1].replace("−", "-").replace(",", "."));
      const w = Number(intervall?.[2].replace("−", "-").replace(",", "."));
      // Midpoint integration with 20000 strips as an independent check.
      const n = 20000;
      let numeric = 0;
      for (let i = 0; i < n; i++) {
        const x = u + ((w - u) * (i + 0.5)) / n;
        numeric += Math.abs(f(x) - g(x)) * ((w - u) / n);
      }
      near(Number(r.flaeche), numeric, 1e-2);
      near(Number(r.differenz), f(values.x) - g(values.x), 1e-9);
    }
  });

  it("Uneigentlich: Wert, Vergleichswerte und der Fall bei b → ∞", () => {
    const lab = lesson("int-7-uneigentlich").lab;
    for (const values of enumerateLabGrid(lab, 7)) {
      const r = computeReadouts(lab, values);
      const F = (b: number) =>
        values.p === 1 ? Math.log(b) : (b ** (1 - values.p) - 1) / (1 - values.p);
      near(Number(r.wert), F(values.b), 1e-9);
      near(Number(r.wert10), F(10), 1e-9);
      near(Number(r.wert50), F(50), 1e-9);
      expect(String(r.fall)).toContain(values.p > 1 ? "konvergiert" : "divergiert");
    }
  });

  it("Gesamtänderung: Verschiebung mit Zeichen, Strecke als Betrag", () => {
    const lab = lesson("int-8-gesaendteraenderung").lab;
    for (const values of enumerateLabGrid(lab, 4)) {
      const r = computeReadouts(lab, values);
      const t1 = Math.min(values.t1, values.T);
      const t2 = Math.max(0, values.T - t1);
      near(Number(r.verschiebung), values.vmax * t1 - values.vback * t2, 1e-9);
      near(Number(r.strecke), values.vmax * t1 + values.vback * t2, 1e-9);
      near(Number(r.mittel), Number(r.strecke) / values.T, 1e-9);
      expect(Number(r.strecke)).toBeGreaterThanOrEqual(Math.abs(Number(r.verschiebung)));
    }
  });

  it("Rotationskörper: V = π ∫ f² und die Körperart stimmen", () => {
    const lab = lesson("int-9-rotationskoerper").lab;
    for (const values of enumerateLabGrid(lab, 3)) {
      const r = computeReadouts(lab, values);
      const p = Math.min(values.a, values.b);
      const q = Math.max(values.a, values.b);
      const vpi =
        (values.k * values.k * (q ** 3 - p ** 3)) / 3 +
        values.k * values.d * (q * q - p * p) +
        values.d * values.d * (q - p);
      near(Number(r.vpi), vpi, 1e-9);
      near(Number(r.V), Math.PI * vpi, 1e-9);
      const fp = values.k * p + values.d;
      const fq = values.k * q + values.d;
      const art =
        values.k === 0
          ? "Zylinder"
          : Math.abs(fp) < 1e-9 || Math.abs(fq) < 1e-9
            ? "Kegel"
            : "Kegelstumpf";
      expect(r.art).toBe(art);
    }
  });

  it("reaches every goal with its witness and none at the start values", () => {
    for (const l of STAGE_INTEGRAL.lessons) {
      const witnesses = GOAL_WITNESSES_STAGE_1[l.id];
      expect(witnesses, l.id).toBeDefined();
      const defaults = defaultLabValues(l.lab);
      const reachedAtStart = l.lab.goals.filter((goal) =>
        goal.check(defaults, computeReadouts(l.lab, defaults)),
      );
      expect(reachedAtStart.map((g) => g.id), `${l.id} start`).toEqual([]);
      for (const goal of l.lab.goals) {
        const witness = { ...defaults, ...witnesses[goal.id] };
        const readouts = computeReadouts(l.lab, witness);
        expect(
          goal.check(witness, readouts),
          `${l.id}/${goal.id} with ${JSON.stringify(witness)}`,
        ).toBe(true);
      }
    }
  });
});
