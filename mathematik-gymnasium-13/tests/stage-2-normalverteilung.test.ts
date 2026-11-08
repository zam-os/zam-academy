import { describe, expect, it } from "vitest";
import { STAGE_NORMALVERTEILUNG } from "../src/curriculum/stage-2-normalverteilung";
import { checkTask, toleranceOf, wrongAnswerHint } from "../src/exercises/checker";
import { shuffleTaskChoices } from "../src/exercises/choice-order";
import { fmt, round } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  applyAction,
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  withChanges,
} from "../src/lab/engine";
import {
  anteilImBand,
  balken,
  diskretF,
  diskretP,
  messreihe,
  normalIntervalP,
  normalPdf,
  Phi,
  sampleMean,
  sampleStd,
  stetigF,
  stetigP,
} from "../src/lab/views-2-normalverteilung";
import { NORMALVERTEILUNG_VIEWS } from "../src/lab/views-2-normalverteilung";
import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  LabValues,
} from "../src/model/types";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";

const IDS = [
  "nv-1-zufallsgroessen",
  "nv-2-glockenkurve",
  "nv-3-dichte-verteilung",
  "nv-4-sigma-regeln",
];

const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-2:${i}`));
const SEEDS300 = Array.from(
  { length: 300 },
  (_, i) => seedFrom(`stage-2-varianz:${i}`),
);

const lesson = (id: string) => {
  const found = STAGE_NORMALVERTEILUNG.lessons.find((l) => l.id === id);
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

const meta = (task: ExerciseTask): Record<string, number> => task.meta ?? {};

/** |x − y| within a relative tolerance. */
function close(x: number, y: number, rel = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(
    rel * Math.max(1, Math.abs(y)),
  );
}

/**
 * Eine unabhängige Φ-Rechnung für die Tests: erf als Reihenentwicklung
 * erf(x) = 2/√π · Σ (−1)ⁿ x^(2n+1)/(n!(2n+1)), nicht die Näherung der App.
 */
function erfReihe(x: number): number {
  const ax = Math.abs(x);
  let sum = 0;
  let term = ax;
  for (let n = 0; n < 80; n++) {
    sum += term / (2 * n + 1);
    term *= -(ax * ax) / (n + 1);
    if (Math.abs(term) < 1e-20) break;
  }
  return (x < 0 ? -1 : 1) * (2 / Math.sqrt(Math.PI)) * sum;
}
const phiTest = (z: number) => 0.5 * (1 + erfReihe(z / Math.SQRT2));

/** Ein Tabellenwert weicht höchstens um das Runden auf vier Dezimalstellen ab. */
function tabellenWert(p: number, z: number): void {
  expect(Math.abs(p - phiTest(z)), `Φ(${z}) = ${p}`).toBeLessThan(6e-5);
  expect(p).toBe(round(Phi(z), 4));
}

/** Wie labs-tasks.test.ts: volles Raster bei wenig Reglern, sonst Stichproben. */
function gridOf(lab: LabDefinition): LabValues[] {
  const sliders = lab.params.filter((p) => p.type === "range").length;
  if (sliders <= 4) return enumerateLabGrid(lab, sliders <= 2 ? 9 : 4);
  const rng = createRng(seedFrom(lab.kind));
  return Array.from({ length: 300 }, () => {
    const values = defaultLabValues(lab);
    for (const param of lab.params) {
      if (param.type === "range")
        values[param.key] = clampParam(
          param,
          param.min + rng.next() * (param.max - param.min),
        );
      if (param.type === "choice")
        values[param.key] = param.options[rng.int(0, param.options.length - 1)]
          .value;
    }
    return values;
  });
}

// ─── Aufbau der Etappe ─────────────────────────────────────────────────────

describe("Etappe 2: Normalverteilung – Aufbau", () => {
  it("hat ihre vier Lektionen in der richtigen Ordnung in LB 2", () => {
    expect(STAGE_NORMALVERTEILUNG.id).toBe("stage-2");
    expect(STAGE_NORMALVERTEILUNG.stageNumber).toBe(2);
    expect(STAGE_NORMALVERTEILUNG.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_NORMALVERTEILUNG.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-2");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`2.${index + 1} `), l.title).toBe(true);
      expect(l.lehrplan, l.id).toMatch(/^M13 LB 2: /);
      expect(l.teacherVideo, l.id).toBeUndefined();
      expect(l.whyItMatters.length).toBeGreaterThan(80);
      expect(l.explanationHtml, l.id).toContain('class="example"');
      expect(l.explanationHtml, l.id).toContain('class="merke"');
      expect(l.formulas.length, l.id).toBeGreaterThanOrEqual(1);
      for (const formula of l.formulas) {
        expect(formula.name.length, l.id).toBeGreaterThan(3);
        expect(formula.html.length, l.id).toBeGreaterThan(3);
        expect(formula.quantities.length, l.id).toBeGreaterThan(5);
      }
      expect(l.quiz.options.length, l.id).toBeGreaterThanOrEqual(3);
      expect(new Set(l.quiz.options).size, l.id).toBe(l.quiz.options.length);
      expect(l.quiz.correctIndex, l.id).toBeGreaterThanOrEqual(0);
      expect(l.quiz.correctIndex, l.id).toBeLessThan(l.quiz.options.length);
      expect(l.quiz.explanation.length, l.id).toBeGreaterThan(20);
      expect(l.lab.goals, l.id).toHaveLength(3);
      expect(new Set(l.lab.goals.map((g) => g.id)).size, l.id).toBe(3);
      expect(new Set(l.lab.params.map((p) => p.key)).size, l.id).toBe(
        l.lab.params.length,
      );
      expect(new Set(l.lab.readouts.map((r) => r.key)).size, l.id).toBe(
        l.lab.readouts.length,
      );
      expect(l.exercises.length, l.id).toBeGreaterThanOrEqual(2);
    });
  });

  it("nennt die Kompetenzerwartungen von M13 LB 2 im Leitgedanken", () => {
    const text = STAGE_NORMALVERTEILUNG.lessons
      .map((l) => `${l.explanationHtml} ${l.whyItMatters} ${l.quiz.question}`)
      .join(" ");
    expect(text).toContain("Normalverteilung");
    expect(text).toContain("Dichtefunktion");
    expect(text).toContain("kumulative Verteilungsfunktion");
    expect(text).toContain("Histogramm");
    expect(text).toContain("Standardabweichung");
    expect(text).toContain("Sigma-Regel");
  });

  it("schreibt echte Minuszeichen und keine HTML-Entities", () => {
    for (const l of STAGE_NORMALVERTEILUNG.lessons) {
      const plain = [
        l.explanationHtml,
        l.whyItMatters,
        l.quiz.question,
        ...l.quiz.options,
        l.quiz.explanation,
        l.lab.intro,
        ...l.lab.goals.map((g) => g.text),
        ...l.lab.readouts.map((r) => r.label),
        ...l.formulas.map((f) => `${f.html} ${f.quantities}`),
      ]
        .join(" ")
        .replace(/<[^>]+>/g, " ");
      expect(plain, l.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(plain, l.id).not.toMatch(/&lt;|&gt;|&amp;|&quot;/);
      expect(plain, l.id).not.toContain("\\");
      expect(plain, l.id).not.toMatch(/NaN|undefined|Infinity/);
    }
  });

  it("beantwortet die Schnellchecks mathematisch richtig", () => {
    // 2.3: F(μ) = 0,5, weil die Glocke symmetrisch ist
    const q3 = lesson("nv-3-dichte-verteilung").quiz;
    expect(Phi(0)).toBe(0.5);
    expect(q3.options[q3.correctIndex].startsWith("0,5"), q3.options[q3.correctIndex]).toBe(true);
    // 2.4: P(100 < X ≤ 110) = Φ(1) − Φ(0) = 0,8413 − 0,5 = 0,3413
    const q4 = lesson("nv-4-sigma-regeln").quiz;
    const richtig = q4.options[q4.correctIndex];
    const wert = Number(richtig.split(",")[0] + "." + (richtig.split(",")[1] ?? "0"));
    close(wert, normalIntervalP(100, 110, 100, 10), 2e-4);
    // 2.1: bei stetigen Größen ist P(X = x) = 0
    const q1 = lesson("nv-1-zufallsgroessen").quiz;
    expect(q1.options[q1.correctIndex], q1.options[q1.correctIndex]).toMatch(/^0,/);
    expect(q1.explanation, q1.explanation).toContain("0");
    // 2.2: kleine Zufallseinflüsse addieren sich
    const q2 = lesson("nv-2-glockenkurve").quiz;
    expect(q2.options[q2.correctIndex], q2.options[q2.correctIndex]).toContain(
      "addieren",
    );
  });
});

// ─── Φ-Werte ───────────────────────────────────────────────────────────────

describe("Φ-Werte sind konsistent", () => {
  it("stimmt mit einer unabhängigen Reihenentwicklung von erf überein", () => {
    for (let z = -4; z <= 4.001; z += 0.25) {
      close(Phi(z), phiTest(z), 1e-6);
    }
  });

  it("hat die bekannten Eigenschaften der Standardnormalverteilung", () => {
    expect(Phi(0)).toBe(0.5);
    for (let z = 0; z <= 5.001; z += 0.5) {
      expect(Math.abs(Phi(-z) + Phi(z) - 1), `Symmetrie bei z = ${z}`).toBeLessThan(3e-7);
    }
    let previous = 0;
    for (let z = -6; z <= 6.001; z += 0.1) {
      expect(Phi(z), `monoton bei z = ${z}`).toBeGreaterThanOrEqual(previous - 1e-12);
      expect(Phi(z)).toBeGreaterThanOrEqual(0);
      expect(Phi(z)).toBeLessThanOrEqual(1);
      previous = Phi(z);
    }
    close(Phi(1), 0.8413, 2e-4);
    close(Phi(1.96), 0.975, 2e-4);
    close(Phi(2.33), 0.9901, 1e-4);
  });

  it("liefert die Sigma-Regeln und Wahrscheinlichkeiten in [0; 1]", () => {
    close(normalIntervalP(-1, 1, 0, 1), 0.6827, 5e-4);
    close(normalIntervalP(-2, 2, 0, 1), 0.9545, 5e-4);
    close(normalIntervalP(-3, 3, 0, 1), 0.9973, 5e-4);
    const rng = createRng(seedFrom("phi-grenzen"));
    for (let i = 0; i < 400; i++) {
      const mu = rng.stepped(-50, 50, 0.5);
      const sigma = rng.stepped(0.5, 20, 0.5);
      const a = rng.stepped(-60, 60, 1);
      const b = rng.stepped(-60, 60, 1);
      const p = normalIntervalP(a, b, mu, sigma);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
      expect(Number.isFinite(normalPdf(a, mu, sigma))).toBe(true);
      // Symmetrie: P(μ − d < X ≤ μ) = P(μ < X ≤ μ + d)
      close(normalIntervalP(mu - 7, mu, mu, sigma), normalIntervalP(mu, mu + 7, mu, sigma), 1e-9);
    }
  });
});

// ─── Generatoren ───────────────────────────────────────────────────────────

describe("Aufgaben der Etappe 2 rechnen richtig", () => {
  it("2.1 diskret-stetig: Balkensummen und Flächen", () => {
    for (const t of tasks("nv-1-zufallsgroessen", "diskret-stetig", 1)) {
      const { h1, h2, h3, h4, k } = meta(t);
      close(h1 + h2 + h3 + h4, 1, 1e-9);
      for (const h of [h1, h2, h3, h4]) {
        expect(h).toBeGreaterThan(0);
        expect(h).toBeLessThanOrEqual(1);
      }
      expect(k).toBeGreaterThanOrEqual(1);
      expect(k).toBeLessThanOrEqual(3);
      close(num(t, 0), round([h1, h2, h3, h4].slice(0, k).reduce((s, h) => s + h, 0), 2));
      expect(num(t, 0)).toBeGreaterThanOrEqual(0);
      expect(num(t, 0)).toBeLessThanOrEqual(1);
      expect(choice(t, 1)).toBe(0);
    }
    for (const t of tasks("nv-1-zufallsgroessen", "diskret-stetig", 2)) {
      const { w, l, s, c, d } = meta(t);
      expect(d - c).toBe(l);
      expect(c).toBeGreaterThanOrEqual(s);
      expect(d).toBeLessThanOrEqual(s + w);
      close(num(t, 0), round(l / w, 3));
      expect(num(t, 0)).toBeGreaterThan(0);
      expect(num(t, 0)).toBeLessThanOrEqual(1);
      expect(choice(t, 1)).toBe(1);
    }
  });

  it("2.1 verteilung-ablesen: kumulative Tabellen lesen und umkehren", () => {
    for (const t of tasks("nv-1-zufallsgroessen", "verteilung-ablesen", 1)) {
      const { c1, c2, c3 } = meta(t);
      expect(c1).toBeLessThan(c2);
      expect(c2).toBeLessThan(c3);
      expect(c3).toBeLessThan(1);
      close(num(t, 0), c2);
      close(num(t, 1), round(c3 - c2, 2));
      expect(num(t, 1)).toBeGreaterThan(0);
    }
    for (const t of tasks("nv-1-zufallsgroessen", "verteilung-ablesen", 2)) {
      const { c1, c2, c3, t: ziel, k } = meta(t);
      const werte = [c1, c2, c3, 1];
      expect(k).toBe(werte.findIndex((c) => c >= ziel - 1e-9) + 1);
      close(num(t, 0), k);
      close(num(t, 1), werte[k - 1]);
      expect(werte[k - 1]).toBeGreaterThanOrEqual(ziel - 1e-9);
      if (k > 1) expect(werte[k - 2]).toBeLessThan(ziel);
    }
  });

  it("2.2 messwerte: Mittelwert und Standardabweichung stimmen", () => {
    for (const t of tasks("nv-2-glockenkurve", "messwerte", 1)) {
      const { m, s } = meta(t);
      const xs = [m - s, m - s, m, m + s, m + s];
      close(sampleMean(xs), m);
      close(sampleStd(xs), s);
      close(num(t, 0), m);
      close(num(t, 1), s);
      expect(s).toBeGreaterThan(0);
    }
    for (const t of tasks("nv-2-glockenkurve", "messwerte", 2)) {
      const { mu, sigma, z, x } = meta(t);
      close((x - mu) / sigma, z);
      close(num(t, 0), z);
      expect(choice(t, 1)).toBe(Math.abs(z) <= 2 ? 0 : 1);
    }
  });

  it("2.2 glockenform: Sigma-Regeln und 3σ-Regel", () => {
    for (const t of tasks("nv-2-glockenkurve", "glockenform", 1)) {
      const { k, p, aussen } = meta(t);
      const regel = [0.68, 0.95, 0.997][k - 1];
      close(p, regel);
      close(num(t, 0), regel);
      expect(num(t, 0)).toBeGreaterThan(0);
      expect(num(t, 0)).toBeLessThanOrEqual(1);
      close(aussen, Math.round((1 - regel) * 1000));
    }
    for (const t of tasks("nv-2-glockenkurve", "glockenform", 2)) {
      const { mu, sigma, z, x, oben } = meta(t);
      close(x, mu + z * sigma);
      close(oben, mu + 3 * sigma);
      close(num(t, 0), oben);
      expect(choice(t, 1)).toBe(Math.abs(z) > 3 ? 1 : 0);
    }
  });

  it("2.3 dichte-parameter: μ und σ aus dem Term, Anteile aus Φ", () => {
    for (const t of tasks("nv-3-dichte-verteilung", "dichte-parameter", 1)) {
      const { variante, mu, sigma, z, x, pw, pg } = meta(t);
      expect([0, 1]).toContain(variante);
      if (variante === 0) {
        close(num(t, 0), mu);
        close(num(t, 1), sigma);
        expect(sigma).toBeGreaterThanOrEqual(1);
      } else {
        close((x - mu) / sigma, z);
        tabellenWert(pw, z);
        close(num(t, 0), pw);
        close(num(t, 1), round(1 - pw, 4));
        close(pg, round(1 - pw, 4));
        expect(num(t, 0)).toBeGreaterThanOrEqual(0);
        expect(num(t, 0)).toBeLessThanOrEqual(1);
      }
    }
    for (const t of tasks("nv-3-dichte-verteilung", "dichte-parameter", 2)) {
      const { mu, sigma, za, zb, pa, pb, a, b } = meta(t);
      expect(za).toBeLessThan(zb);
      close(a, mu + za * sigma);
      close(b, mu + zb * sigma);
      tabellenWert(pa, za);
      tabellenWert(pb, zb);
      close(num(t, 0), round(pb - pa, 4));
      expect(num(t, 0)).toBeGreaterThanOrEqual(0);
      expect(num(t, 0)).toBeLessThanOrEqual(1);
    }
  });

  it("2.3 eigenschaften: Wendepunkte bei μ ± σ und die Stelle zu F(x)", () => {
    for (const t of tasks("nv-3-dichte-verteilung", "eigenschaften", 1)) {
      const { mu, sigma } = meta(t);
      close(num(t, 0), round(mu - sigma, 1));
      close(num(t, 1), round(mu + sigma, 1));
      expect(num(t, 0)).toBeLessThan(num(t, 1));
    }
    for (const t of tasks("nv-3-dichte-verteilung", "eigenschaften", 2)) {
      const { mu, sigma, z, x, pw } = meta(t);
      tabellenWert(pw, z);
      close(x, mu + z * sigma);
      close(num(t, 0), x);
    }
  });

  it("2.4 wahrscheinlichkeit: P = Φ(z_b) − Φ(z_a) und Stückzahlen", () => {
    for (const t of tasks("nv-4-sigma-regeln", "wahrscheinlichkeit", 1)) {
      const { mu, sigma, za, zb, pa, pb, p, a, b } = meta(t);
      close(a, mu + za * sigma);
      close(b, mu + zb * sigma);
      tabellenWert(pa, za);
      tabellenWert(pb, zb);
      close(p, round(pb - pa, 4));
      close(num(t, 0), p);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
    for (const t of tasks("nv-4-sigma-regeln", "wahrscheinlichkeit", 2)) {
      const { p, N, za, zb, pa, pb } = meta(t);
      tabellenWert(pa, za);
      tabellenWert(pb, zb);
      expect(N).toBe(1000);
      close(num(t, 0), Math.round(p * N));
      expect(Number.isInteger(num(t, 0))).toBe(true);
      expect(num(t, 0)).toBeGreaterThanOrEqual(0);
      expect(num(t, 0)).toBeLessThanOrEqual(N);
    }
  });

  it("2.4 intervall-suchen: Sigma-Grenzen und symmetrische Umkehrung", () => {
    for (const t of tasks("nv-4-sigma-regeln", "intervall-suchen", 1)) {
      const { mu, sigma, k, p } = meta(t);
      close(p, [0.68, 0.95, 0.997][k - 1]);
      close(num(t, 0), round(mu - k * sigma, 1));
      close(num(t, 1), round(mu + k * sigma, 1));
      close(num(t, 0) + num(t, 1), 2 * mu, 1e-9);
    }
    for (const t of tasks("nv-4-sigma-regeln", "intervall-suchen", 2)) {
      const { mu, sigma, z, w, pSym, d, a, b } = meta(t);
      tabellenWert(w, z);
      close(d, z * sigma);
      close(a, mu - d);
      close(b, mu + d);
      close(pSym, round(2 * w - 1, 4));
      close(num(t, 0), a);
      close(num(t, 1), b);
      close(num(t, 2), pSym);
      expect(num(t, 2)).toBeGreaterThanOrEqual(0);
      expect(num(t, 2)).toBeLessThanOrEqual(1);
    }
  });

  it("kein Generator liefert über 300 Seeds immer dieselbe Antwort", () => {
    const paar: Array<[string, string]> = [
      ["nv-1-zufallsgroessen", "diskret-stetig"],
      ["nv-1-zufallsgroessen", "verteilung-ablesen"],
      ["nv-2-glockenkurve", "messwerte"],
      ["nv-2-glockenkurve", "glockenform"],
      ["nv-3-dichte-verteilung", "dichte-parameter"],
      ["nv-3-dichte-verteilung", "eigenschaften"],
      ["nv-4-sigma-regeln", "wahrscheinlichkeit"],
      ["nv-4-sigma-regeln", "intervall-suchen"],
    ];
    for (const [lessonId, generatorId] of paar) {
      for (const level of [1, 2] as const) {
        const werte = new Set(
          tasks(lessonId, generatorId, level, SEEDS300).map((t) => num(t, 0)),
        );
        expect(
          werte.size,
          `${lessonId}/${generatorId} L${level} liefert ${werte.size} Werte`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

// ─── Labore ────────────────────────────────────────────────────────────────

describe("Labore der Etappe 2", () => {
  it("zeichnet jede Einstellung sauber und liefert endliche Readouts", () => {
    for (const l of STAGE_NORMALVERTEILUNG.lessons) {
      const view = NORMALVERTEILUNG_VIEWS[l.lab.kind];
      expect(view, l.lab.kind).toBeDefined();
      for (const values of gridOf(l.lab)) {
        const readouts = computeReadouts(l.lab, values);
        for (const readout of l.lab.readouts) {
          const value = readouts[readout.key];
          if (typeof value === "number") {
            expect(
              Number.isFinite(value),
              `${l.id}.${readout.key} at ${JSON.stringify(values)}`,
            ).toBe(true);
          } else {
            expect(value.length, `${l.id}.${readout.key}`).toBeGreaterThan(0);
          }
        }
        const svg = view.render(values, readouts);
        expect(svg.startsWith("<svg"), l.id).toBe(true);
        expect(svg.endsWith("</svg>"), l.id).toBe(true);
        expect(svg, l.id).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it("erreicht jedes Laborziel genau mit seinem Zeugen und bei Start keins", () => {
    for (const l of STAGE_NORMALVERTEILUNG.lessons) {
      const witnesses = GOAL_WITNESSES_STAGE_2[l.id];
      expect(witnesses, l.id).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(
        l.lab.goals.map((g) => g.id).sort(),
      );
      for (const goal of l.lab.goals) {
        const witness = {
          ...defaultLabValues(l.lab),
          ...witnesses[goal.id],
        };
        for (const param of l.lab.params) {
          if (param.type === "state") continue;
          expect(
            witnesses[goal.id][param.key],
            `${l.id}/${goal.id} setzt ${param.key}`,
          ).toBeDefined();
          expect(
            clampParam(param, witness[param.key]),
            `${l.id}/${goal.id}: ${param.key} liegt auf dem Regler`,
          ).toBe(witness[param.key]);
        }
        expect(
          goal.check(witness, computeReadouts(l.lab, witness)),
          `${l.id}/${goal.id} bei ${JSON.stringify(witness)}`,
        ).toBe(true);
      }
      const defaults = defaultLabValues(l.lab);
      const atStart = l.lab.goals.filter((goal) =>
        goal.check(defaults, computeReadouts(l.lab, defaults)),
      );
      expect(atStart.map((g) => g.id), `${l.id} verschenkt Ziele`).toEqual([]);
    }
  });

  it("2.1 zufallsgroesse: Summe, F und P passen zur Einstellung", () => {
    const lab = lesson("nv-1-zufallsgroessen").lab;
    for (const values of gridOf(lab)) {
      const r = computeReadouts(lab, values);
      const summe =
        values.art === 0
          ? balken(values).reduce((s, h) => s + h, 0)
          : values.hh * values.b0;
      close(Number(r.summe), summe, 1e-9);
      close(Number(r.F), values.art === 0 ? diskretF(values, values.xstelle) : stetigF(values, values.xstelle), 1e-9);
      close(Number(r.Pint), values.art === 0 ? diskretP(values) : stetigP(values), 1e-9);
      expect(Number(r.Pint)).toBeGreaterThanOrEqual(0);
      expect(Number(r.Pint)).toBeLessThanOrEqual(1);
    }
  });

  it("2.3 normalverteilung: f(x) und F(x) stimmen mit der Mathematik überein", () => {
    const lab = lesson("nv-3-dichte-verteilung").lab;
    for (const values of gridOf(lab)) {
      const r = computeReadouts(lab, values);
      close(Number(r.fx), normalPdf(values.x, values.mu, values.sigma), 1e-9);
      close(Number(r.Fx), Phi((values.x - values.mu) / values.sigma), 1e-9);
      expect(Number(r.Fx)).toBeGreaterThanOrEqual(0);
      expect(Number(r.Fx)).toBeLessThanOrEqual(1);
      // Die S-Kurve geht durch F(μ) = 0,5
      close(Phi(0), 0.5);
    }
  });

  it("2.4 sigma-regeln: die Fläche ist P(a < X ≤ b) und bleibt in [0; 1]", () => {
    const lab = lesson("nv-4-sigma-regeln").lab;
    for (const values of gridOf(lab)) {
      const r = computeReadouts(lab, values);
      const p = normalIntervalP(values.a, values.b, values.mu, values.sigma);
      close(Number(r.P), p, 1e-9);
      expect(Number(r.P)).toBeGreaterThanOrEqual(0);
      expect(Number(r.P)).toBeLessThanOrEqual(1);
      // Symmetrische Intervalle folgen den Sigma-Regeln
      close(normalIntervalP(values.mu - values.sigma, values.mu + values.sigma, values.mu, values.sigma), 0.6827, 5e-4);
      close(normalIntervalP(values.mu - 2 * values.sigma, values.mu + 2 * values.sigma, values.mu, values.sigma), 0.9545, 5e-4);
    }
  });

  it("2.2 glockenkurve: die Simulation bleibt endlich und startet bei Reglerwechsel neu", () => {
    const lab = lesson("nv-2-glockenkurve").lab;
    let values = defaultLabValues(lab);
    const startReihe = messreihe(values);
    expect(startReihe).toHaveLength(values.n);
    expect(startReihe.every(Number.isFinite)).toBe(true);
    for (let i = 0; i < 5; i++) {
      values = applyAction(lab, values, "neu");
      expect(values.ziehungen).toBe(i + 1);
      const readouts = computeReadouts(lab, values);
      for (const readout of lab.readouts) {
        const value = readouts[readout.key];
        if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
        else expect(value.length).toBeGreaterThan(0);
      }
      const xs = messreihe(values);
      expect(xs).toHaveLength(values.n);
      expect(xs.every(Number.isFinite)).toBe(true);
      const anteil = anteilImBand(values);
      expect(anteil).toBeGreaterThanOrEqual(0);
      expect(anteil).toBeLessThanOrEqual(1);
      expect(sampleStd(xs)).toBeGreaterThanOrEqual(0);
    }
    expect(messreihe(values)).not.toEqual(startReihe);
    values = applyAction(lab, values, "zurueck");
    expect(messreihe(values)).toEqual(startReihe);
    values = applyAction(lab, values, "neu");
    const gewechselt = withChanges(lab, values, { n: 25 });
    expect(gewechselt.seed).toBe(20261108);
    expect(gewechselt.ziehungen).toBe(0);
  });
});

// ─── Aufgabenströme wie im Testlauf ────────────────────────────────────────

function answerText(task: ExerciseTask, style: "comma" | "point"): string[] {
  return task.fields.map((field) => {
    if (field.kind === "choice") return String(field.correctIndex);
    return style === "comma"
      ? fmt(field.answer, field.digits).replace("−", "-")
      : field.answer.toFixed(field.digits);
  });
}

describe("Aufgabenströme der Etappe 2 erfüllen die harten Bedingungen", () => {
  it("sind über beide Stufen je 80 Aufgaben lösbar, sauber formuliert und ehrlich bewertet", () => {
    for (const lesson of STAGE_NORMALVERTEILUNG.lessons) {
      for (const level of [1, 2] as const) {
        for (let counter = 1; counter <= 80; counter++) {
          const generator =
            lesson.exercises[(counter - 1) % lesson.exercises.length];
          const rng = createRng(seedFrom(`${lesson.id}:${level}:${counter}`));
          const task = shuffleTaskChoices(generator.make(rng, level), rng);
          const where = `${lesson.id}/${generator.id} L${level} task ${counter}`;
          expect(task.fields.length, where).toBeGreaterThan(0);
          expect(task.prompt.length, where).toBeGreaterThan(30);
          expect(task.steps.length, where).toBeGreaterThanOrEqual(2);
          expect(task.steps[task.steps.length - 1], where).toContain("<strong>");
          if (level === 1) expect(task.formulaHint, where).toBeTruthy();
          if (level === 2) expect(task.formulaHint, where).toBeUndefined();
          const html = [
            task.prompt,
            ...task.given,
            ...task.steps,
            task.formulaHint ?? "",
          ].join(" ");
          expect(html, where).not.toMatch(
            /NaN|undefined|Infinity|\+ −|− −|\+ -/,
          );
          expect(html.replace(/<[^>]+>/g, " "), where).not.toMatch(
            /(^|[\s(=:|,{±])-\d/,
          );
          expect(html, where).not.toMatch(/&lt;|&gt;|&amp;|&quot;/);
          for (const field of task.fields) {
            if (field.kind === "number") {
              expect(Number.isFinite(field.answer), where).toBe(true);
              expect(toleranceOf(field), where).toBeLessThan(
                Math.abs(field.answer) * 0.05 + 0.06,
              );
            } else {
              expect(field.correctIndex, where).toBeGreaterThanOrEqual(0);
              expect(field.correctIndex, where).toBeLessThan(
                field.options.length,
              );
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
          expect(wrongAnswerHint(task, result).length, where).toBeGreaterThan(
            10,
          );
          for (const field of task.fields) {
            if (field.kind !== "number") continue;
            for (const slip of field.slips ?? []) {
              expect(
                Math.abs(slip.value - field.answer) > toleranceOf(field),
                `${where}: slip ${slip.value} = ${field.answer}`,
              ).toBe(true);
            }
          }
        }
      }
    }
  });
});
