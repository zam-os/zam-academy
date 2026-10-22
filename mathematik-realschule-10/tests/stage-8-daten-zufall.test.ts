import { describe, expect, it } from "vitest";
import { STAGE_DATEN_ZUFALL } from "../src/curriculum/stage-8-daten-zufall";
import { fmt, round } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import { applyAction, computeReadouts, defaultLabValues, withChanges } from "../src/lab/engine";
import {
  atLeastOnce,
  branchCount,
  type Colour,
  eventFraction,
  minTries,
  pathFraction,
  probText,
  TREE_EVENTS,
  treePaths,
  triesBound,
} from "../src/lab/views-daten-zufall";
import type { ChoiceField, ExerciseTask, Lesson, NumberField } from "../src/model/types";

const lessons = STAGE_DATEN_ZUFALL.lessons;
const lesson = (id: string): Lesson => lessons.find((l) => l.id === id)!;
const generator = (lessonId: string, id: string) => {
  const found = lesson(lessonId).exercises.find((exercise) => exercise.id === id);
  if (!found) throw new Error(`${lessonId}/${id}`);
  return found;
};
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-8:${i}`));
const tasks = (lessonId: string, id: string, level: 1 | 2): Array<[number, ExerciseTask]> =>
  SEEDS.map((seed) => [seed, generator(lessonId, id).make(createRng(seed), level)]);
const num = (task: ExerciseTask, index: number) => task.fields[index] as NumberField;
const choice = (task: ExerciseTask, index: number) => task.fields[index] as ChoiceField;
const close = (value: number, expected: number) => Math.abs(value - expected) <= 1e-9 * Math.max(1, Math.abs(expected));
const number = (text: string) => Number(text.replace(/\./g, "").replace(",", "."));

// ─── Independent recomputation: an urn drawn ball by ball ──────────────────

/** P(path) by drawing ball by ball: 0 = the first kind (rot, Gewinn, Mädchen), 1 = the second. */
function drawPath(first: number, second: number, without: boolean, path: number[]): number {
  let a = first;
  let b = second;
  let P = 1;
  for (const c of path) {
    P *= (c === 0 ? a : b) / (a + b);
    if (without) {
      if (c === 0) a -= 1;
      else b -= 1;
    }
  }
  return P;
}

const ALL3 = Array.from({ length: 8 }, (_, i) => [(i >> 2) & 1, (i >> 1) & 1, i & 1]);
const firstKind = (path: number[]) => path.filter((c) => c === 0).length;
const eventP = (first: number, second: number, without: boolean, test: (path: number[]) => boolean) =>
  ALL3.filter(test).reduce((sum, path) => sum + drawPath(first, second, without, path), 0);
const falling = (n: number, k: number) => Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b, 1);
/** P(at most one success in three independent tries). */
const atMostOne = (p: number) => (1 - p) ** 3 + 3 * p * (1 - p) ** 2;

describe("Etappe 8: Daten und Zufall", () => {
  it("has the three lessons of LB 5 in order, for both Zweige", () => {
    expect(STAGE_DATEN_ZUFALL.id).toBe("stage-8-daten-zufall");
    expect(lessons.map((l) => l.id)).toEqual(["dz-1-mehrstufig", "dz-2-pfadregeln", "dz-3-anwendungen"]);
    lessons.forEach((l, i) => {
      expect(l.stageId).toBe(STAGE_DATEN_ZUFALL.id);
      expect(l.stepNumber).toBe(i + 1);
      expect(l.title.startsWith(`8.${i + 1} `)).toBe(true);
      expect(l.tracks).toEqual(["I", "II_III"]);
      expect(l.lehrplan.startsWith("M10 LB 5 (I) · M10 LB 5 (II/III): Daten und Zufall")).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
      expect(l.formulas.length).toBeGreaterThanOrEqual(1);
      expect(l.formulas.length).toBeLessThanOrEqual(3);
      // The teacher videos are chosen centrally later.
      expect(l.teacherVideo).toBeUndefined();
    });
    expect(lessons.map((l) => l.lab.kind)).toEqual(["tree-urn", "path-rules", "at-least"]);
  });

  it("stays inside LB 5: no conditional probability, Vierfeldertafel, independence or expected value", () => {
    for (const l of lessons) {
      const text = [l.explanationHtml, l.whyItMatters, l.quiz.question, l.lab.intro, ...l.lab.goals.map((g) => g.text)].join(" ");
      expect(text).not.toMatch(/bedingt|Vierfeldertafel|unabhängig im Sinne|stochastisch unabhängig|Erwartungswert|Binomial/i);
    }
  });

  it("states only true numbers in the explanations and quick checks", () => {
    const [m, p, a] = lessons;
    expect(fmt((4 / 27) * 100, 2)).toBe("14,81");
    expect(m.explanationHtml).toContain("14,81 %");
    expect(drawPath(4, 2, true, [0, 0, 1])).toBeCloseTo(1 / 5, 12);
    expect(drawPath(4, 2, false, [0, 0, 1])).toBeCloseTo(4 / 27, 12);
    expect(drawPath(2, 4, true, [0, 0, 0])).toBe(0);
    // Quick check 8.1: after rot, blau from 3 red and 2 blue, the third blue branch is 1/3.
    expect(branchCount(3, 2, true, [0, 1], 1)).toEqual([1, 3]);
    expect(m.quiz.options[m.quiz.correctIndex]).toBe("1/3");
    // 8.2: 3 · 1/5 = 3/5 and 1 − (2/6)³ = 26/27 ≈ 96,30 %
    expect(eventP(4, 2, true, (path) => firstKind(path) === 2)).toBeCloseTo(3 / 5, 12);
    expect(fmt((1 - (2 / 6) ** 3) * 100, 2)).toBe("96,3");
    expect(p.explanationHtml).toContain("96,30 %");
    expect(p.quiz.options[p.quiz.correctIndex]).toBe("mindestens zwei rote Kugeln");
    // 8.3: the Multiple-Choice example, the probe and de Méré's two games
    expect(fmt(triesBound(0.25, 0.95), 2)).toBe("10,41");
    expect(minTries(0.25, 0.95)).toBe(11);
    for (const [value, shown] of [
      [atLeastOnce(0.25, 10), "94,37"],
      [atLeastOnce(0.25, 11), "95,78"],
      [atLeastOnce(1 / 6, 4), "51,77"],
      [atLeastOnce(1 / 36, 24), "49,14"],
    ] as const) {
      expect(fmt(value * 100, 2)).toBe(shown);
      expect(a.explanationHtml).toContain(`${shown} %`);
    }
    expect(fmt(atLeastOnce(0.2, 10) * 100, 2)).toBe("89,26");
    expect(a.quiz.options[a.quiz.correctIndex]).toBe("1 − 0,8¹⁰");
  });
});

describe("Baumdiagramm und Pfadregeln (Rechnung der Labore)", () => {
  it("gives every path the product of its branches, and all paths together 1", () => {
    for (let r = 2; r <= 8; r++) {
      for (let b = 2; b <= 8; b++) {
        for (const without of [false, true]) {
          for (const draws of [2, 3]) {
            let total = 0;
            for (const path of treePaths(draws)) {
              const [a, d] = pathFraction(r, b, without, path);
              expect(a / d).toBeCloseTo(drawPath(r, b, without, path), 12);
              total += a / d;
            }
            expect(total).toBeCloseTo(1, 12);
          }
        }
      }
    }
  });

  it("adds the paths of an event (second path rule) and pairs it with its complement", () => {
    const sameRule: Array<(path: number[]) => boolean> = [
      (p) => firstKind(p) === 3,
      (p) => firstKind(p) === 2,
      (p) => firstKind(p) === 1,
      (p) => firstKind(p) === 0,
      (p) => firstKind(p) >= 1,
      (p) => firstKind(p) <= 1,
      (p) => firstKind(p) >= 2,
      (p) => firstKind(p) === 0 || firstKind(p) === 3,
      (p) => p[0] === 0,
    ];
    expect(TREE_EVENTS).toHaveLength(sameRule.length);
    for (let r = 2; r <= 8; r++) {
      for (let b = 2; b <= 8; b++) {
        for (const without of [false, true]) {
          TREE_EVENTS.forEach((_, event) => {
            const [a, d] = eventFraction(r, b, without, event);
            expect(a / d).toBeCloseTo(eventP(r, b, without, sameRule[event]), 12);
            expect(a / d + eventP(r, b, without, (p) => !sameRule[event](p))).toBeCloseTo(1, 12);
          });
          // The three paths of "genau zwei rote" are equally likely, with and without replacement.
          const [rrb, rbr, brr] = ([[0, 0, 1], [0, 1, 0], [1, 0, 0]] as Colour[][]).map((p) => pathFraction(r, b, without, p)[0]);
          expect(rrb).toBe(rbr);
          expect(rbr).toBe(brr);
          // "Die erste rot" collects four paths whose sum is just the first branch.
          expect(eventFraction(r, b, without, 8)[0] / eventFraction(r, b, without, 8)[1]).toBeCloseTo(r / (r + b), 12);
        }
      }
    }
  });

  it("writes probabilities as reduced fractions with a percentage", () => {
    expect(probText(24, 120)).toBe("1/5 = 20 %");
    expect(probText(32, 216)).toBe("4/27 ≈ 14,81 %");
    expect(probText(0, 120)).toBe("0 (unmöglich)");
    expect(probText(120, 120)).toBe("1 (sicher)");
  });

  it("finds the smallest n for every slider setting of the at-least lab", () => {
    for (let p = 1; p <= 60; p++) {
      for (let target = 50; target <= 99; target++) {
        const n = minTries(p / 100, target / 100);
        let brute = 1;
        while (1 - (1 - p / 100) ** brute < target / 100 - 1e-12) brute += 1;
        expect(n, `p = ${p} %, Ziel ${target} %`).toBe(brute);
        expect(n).toBeGreaterThanOrEqual(Math.ceil(triesBound(p / 100, target / 100) - 1e-9));
      }
    }
  });

  it("asks for the right settings in the at-least lab: they are the smallest that reach the goal", () => {
    expect(minTries(0.25, 0.95)).toBe(11);
    expect(minTries(0.02, 0.5)).toBe(35);
    expect(atLeastOnce(0.36, 5)).toBeLessThan(0.9);
    expect(atLeastOnce(0.37, 5)).toBeGreaterThanOrEqual(0.9);
  });
});

describe("Simulationen", () => {
  const urnLab = lesson("dz-1-mehrstufig").lab;
  const atLeastLab = lesson("dz-3-anwendungen").lab;

  it("reach the simulation goal of the urn by pressing „100× ziehen“ five times", () => {
    let values = defaultLabValues(urnLab);
    for (let i = 0; i < 5; i++) values = applyAction(urnLab, values, "hundert");
    expect(values.n).toBe(500);
    const goal = urnLab.goals.find((g) => g.id === "simulation")!;
    expect(goal.check(values, computeReadouts(urnLab, values))).toBe(true);
  });

  it("let the relative frequency of every path approach its probability", () => {
    for (const without of [0, 1]) {
      for (const path of treePaths(3)) {
        let values = withChanges(urnLab, defaultLabValues(urnLab), { mode: without, z1: path[0], z2: path[1], z3: path[2] });
        for (let i = 0; i < 30; i++) values = applyAction(urnLab, values, "hundert");
        expect(values.n).toBe(3000);
        expect(Math.abs(values.hits / values.n - drawPath(4, 2, without === 1, path)), `${path} ohne=${without}`).toBeLessThan(0.03);
      }
    }
  });

  it("draw one ball after another and remember the last outcome", () => {
    let values = defaultLabValues(urnLab);
    values = applyAction(urnLab, values, "eins");
    expect(values.n).toBe(1);
    expect(values.last).toBeGreaterThanOrEqual(1);
    expect(values.last).toBeLessThanOrEqual(8);
    expect(computeReadouts(urnLab, values).zuletzt).toMatch(/^(rot|blau), (rot|blau), (rot|blau)$/);
    const two = withChanges(urnLab, values, { draws: 2 });
    expect([two.n, two.hits, two.last]).toEqual([0, 0, 0]);
    expect(computeReadouts(urnLab, applyAction(urnLab, two, "eins")).zuletzt).toMatch(/^(rot|blau), (rot|blau)$/);
    // An impossible path is never drawn.
    let impossible = withChanges(urnLab, defaultLabValues(urnLab), { rot: 2, blau: 4, z1: 0, z2: 0, z3: 0 });
    for (let i = 0; i < 10; i++) impossible = applyAction(urnLab, impossible, "hundert");
    expect(impossible.hits).toBe(0);
  });

  it("count series with at least one success close to 1 − (1 − p)ⁿ", () => {
    for (const [p, n] of [[10, 5], [25, 3], [2, 35], [40, 2]]) {
      let values = withChanges(atLeastLab, defaultLabValues(atLeastLab), { p, n });
      for (let i = 0; i < 20; i++) values = applyAction(atLeastLab, values, "hundert");
      expect(values.series).toBe(2000);
      expect(Math.abs(values.hits / values.series - atLeastOnce(p / 100, n)), `p = ${p}, n = ${n}`).toBeLessThan(0.035);
    }
  });
});

describe("Aufgaben rechnen nach (unabhängig nachgerechnet)", () => {
  it("8.1 Pfad: the product along the path, Level 1 urn and Level 2 contexts", () => {
    for (const [seed, task] of tasks("dz-1-mehrstufig", "pfad", 1)) {
      const m = task.meta!;
      const path = [m.c1, m.c2, m.c3];
      expect(task.prompt).toContain(`${m.r} rote und ${m.b} blaue`);
      expect(task.prompt).toContain(m.without ? "ohne Zurücklegen" : "mit Zurücklegen");
      expect(close(num(task, 0).answer, drawPath(m.r, m.b, m.without === 1, path)), `seed ${seed}`).toBe(true);
      expect(num(task, 0).answer).toBeGreaterThan(0);
    }
    const seen = new Set<number>();
    for (const [seed, task] of tasks("dz-1-mehrstufig", "pfad", 2)) {
      const m = task.meta!;
      seen.add(m.context);
      let expected: number;
      if (m.context === 1) {
        const angles = [m.a0, m.a1, m.a2];
        expect(angles.reduce((s, a) => s + a, 0)).toBe(360);
        expected = (angles[m.s1] / 360) * (angles[m.s2] / 360) * (angles[m.s3] / 360);
        expect(task.prompt).toContain(`Rot mit dem Mittelpunktswinkel ${m.a0}°`);
      } else if (m.context === 2) {
        expected = (m.k1 / 6) * (m.k2 / 6) * (m.k3 / 6);
      } else {
        expected = drawPath(m.r, m.b, true, [m.c1, m.c2, m.c3]);
        expect(task.prompt).toContain(m.context === 0 ? `${m.r} Erdbeer- und ${m.b} Zitronenbonbons` : `${m.r + m.b} Lose, darunter ${m.r} Gewinne`);
      }
      expect(num(task, 0).unit).toBe("%");
      expect(close(num(task, 0).answer, expected * 100), `seed ${seed}`).toBe(true);
      expect(num(task, 0).answer).toBeGreaterThan(0.05);
    }
    expect([...seen].sort()).toEqual([0, 1, 2, 3]);
  });

  it("8.1 Baum: the branches along the path, and back from P(alle rot) to the number of red balls", () => {
    for (const [seed, task] of tasks("dz-1-mehrstufig", "baum", 1)) {
      const m = task.meta!;
      const path = [m.c1, m.c2, m.c3];
      let red = m.r;
      let blue = m.b;
      path.forEach((c, k) => {
        expect(close(num(task, k).answer, (c === 0 ? red : blue) / (red + blue)), `seed ${seed} Zug ${k + 1}`).toBe(true);
        if (c === 0) red -= 1;
        else blue -= 1;
      });
      expect(close(num(task, 3).answer, drawPath(m.r, m.b, true, path)), `seed ${seed}`).toBe(true);
    }
    for (const [seed, task] of tasks("dz-1-mehrstufig", "baum", 2)) {
      const m = task.meta!;
      const [, a, b] = /beträgt (\d+)\/(\d+)/.exec(task.prompt)!.map(Number);
      // Exactly one count of red balls gives the stated probability.
      const fits = Array.from({ length: m.total + 1 }, (_, x) => x).filter((x) => falling(x, m.draws) * b === a * falling(m.total, m.draws));
      expect(fits, `seed ${seed}: ${task.prompt}`).toEqual([m.red]);
      expect(num(task, 0).answer).toBe(m.red);
      expect(m.red).toBeGreaterThanOrEqual(m.draws);
      expect(m.total - m.red).toBeGreaterThanOrEqual(m.draws);
      expect(close(num(task, 1).answer, (falling(m.total - m.red, m.draws) / falling(m.total, m.draws)) * 100)).toBe(true);
    }
  });

  it("8.2 Genau: three equally likely paths, on both levels", () => {
    for (const [seed, task] of tasks("dz-2-pfadregeln", "genau", 1)) {
      const m = task.meta!;
      const exactly = (p: number[]) => firstKind(p) === m.k;
      const firstPath = ALL3.find(exactly)!;
      expect(close(num(task, 0).answer, drawPath(m.r, m.b, m.without === 1, firstPath)), `seed ${seed}`).toBe(true);
      expect(close(num(task, 1).answer, eventP(m.r, m.b, m.without === 1, exactly)), `seed ${seed}`).toBe(true);
    }
    for (const [seed, task] of tasks("dz-2-pfadregeln", "genau", 2)) {
      const m = task.meta!;
      const expected =
        m.context === 0 ? 3 * (m.hit / 100) ** m.k * (1 - m.hit / 100) ** (3 - m.k) : eventP(m.r, m.b, true, (p) => firstKind(p) === m.k);
      expect(close(num(task, 0).answer, expected * 100), `seed ${seed}`).toBe(true);
    }
  });

  it("8.2 Mindestens und höchstens: over the complement and over the paths", () => {
    for (const [seed, task] of tasks("dz-2-pfadregeln", "mindestens", 1)) {
      const m = task.meta!;
      const none = drawPath(m.r, m.b, m.without === 1, [1, 1, 1]);
      expect(none, `seed ${seed}`).toBeGreaterThan(0);
      expect(close(num(task, 0).answer, none)).toBe(true);
      expect(close(num(task, 1).answer, eventP(m.r, m.b, m.without === 1, (p) => firstKind(p) >= 1)), `seed ${seed}`).toBe(true);
    }
    for (const [seed, task] of tasks("dz-2-pfadregeln", "mindestens", 2)) {
      const m = task.meta!;
      const p = m.chance / 100;
      const expected = m.context === 2 ? 1 - atMostOne(p) : atMostOne(p);
      expect(task.prompt).toContain(`${m.chance} %`);
      expect(close(num(task, 0).answer, expected * 100), `seed ${seed}`).toBe(true);
    }
  });

  it("8.2 Vermutung: the complement is the right one, and the verdict follows the rounded value", () => {
    const events: Array<[string, (p: number[]) => boolean]> = [
      ["keine rote Kugel", (p) => firstKind(p) >= 1],
      ["drei rote Kugeln", (p) => firstKind(p) <= 2],
      ["alle Kugeln haben dieselbe Farbe", (p) => firstKind(p) === 1 || firstKind(p) === 2],
      ["mindestens zwei rote Kugeln", (p) => firstKind(p) <= 1],
      ["keine blaue Kugel", (p) => firstKind(p) <= 2],
    ];
    for (const [seed, task] of tasks("dz-2-pfadregeln", "vermutung", 1)) {
      const m = task.meta!;
      const [complement, event] = events[m.kind];
      const options = choice(task, 0);
      expect(options.options[options.correctIndex], `seed ${seed}`).toBe(complement);
      expect(new Set(options.options).size).toBe(4);
      expect(close(num(task, 1).answer, eventP(m.r, m.b, m.without === 1, event)), `seed ${seed}`).toBe(true);
    }
    let yes = 0;
    for (const [seed, task] of tasks("dz-2-pfadregeln", "vermutung", 2)) {
      const m = task.meta!;
      const P =
        m.context === 0 ? 1 - falling(m.total - m.mustard, m.taken) / falling(m.total, m.taken) : m.context === 1 ? 1 - (1 - m.red / 100) ** 3 : (m.goal / 100) ** 3;
      expect(close(num(task, 0).answer, P * 100), `seed ${seed}`).toBe(true);
      expect(task.prompt).toContain(`mehr als ${m.claim} %`);
      // The claim is far enough from the value that no rounding decides it.
      expect(Math.abs(P * 100 - m.claim), `seed ${seed}`).toBeGreaterThanOrEqual(1.5);
      const verdict = choice(task, 1);
      expect(verdict.correctIndex === 0, `seed ${seed}`).toBe(round(P * 100, 2) > m.claim);
      if (verdict.correctIndex === 0) yes += 1;
    }
    // Both verdicts occur.
    expect(yes).toBeGreaterThan(30);
    expect(yes).toBeLessThan(170);
  });

  it("8.3 Wie oft: the smallest n, a logarithm clearly between two whole numbers, and a probe that shows it", () => {
    for (const level of [1, 2] as const) {
      const contexts = new Set<number>();
      for (const [seed, task] of tasks("dz-3-anwendungen", "wie-oft", level)) {
        const m = task.meta!;
        const p = m.p;
        const target = m.target / 100;
        const n = num(task, 0).answer;
        expect(n).toBe(m.n);
        expect(1 - (1 - p) ** (n - 1), `seed ${seed}`).toBeLessThan(target);
        expect(1 - (1 - p) ** n, `seed ${seed}`).toBeGreaterThanOrEqual(target);
        expect(n).toBeGreaterThanOrEqual(2);
        const bound = Math.log(1 - target) / Math.log(1 - p);
        expect(Math.abs(bound - Math.round(bound)), `seed ${seed}: log value ${bound}`).toBeGreaterThanOrEqual(0.05);
        const [before, after] = [...task.steps[2].matchAll(/: ([\d.,]+) %/g)].map((match) => number(match[1]));
        expect(before, `seed ${seed}: ${task.steps[2]}`).toBeLessThan(m.target);
        expect(after, `seed ${seed}: ${task.steps[2]}`).toBeGreaterThanOrEqual(m.target);
        expect(task.prompt).toContain(`mindestens ${fmt(m.target, 0)} %`);
        if (level === 2) {
          contexts.add(m.context);
          const fromContext = [1 / m.value, m.value / 100, m.value / 360, m.value / 100, 1 / m.value][m.context];
          expect(close(p, fromContext), `seed ${seed}`).toBe(true);
          expect(close(num(task, 1).answer, (1 - (1 - p) ** n) * 100)).toBe(true);
        }
      }
      if (level === 2) expect([...contexts].sort()).toEqual([0, 1, 2, 3, 4]);
    }
  });

  it("8.3 Anwendung: Multiple-Choice, Elfmeter and Qualitätskontrolle", () => {
    for (const [seed, task] of tasks("dz-3-anwendungen", "anwendung", 1)) {
      const { k, n } = task.meta!;
      expect(close(num(task, 0).answer, (1 / k) ** n), `seed ${seed}`).toBe(true);
      expect(close(num(task, 1).answer, 1 - ((k - 1) / k) ** n), `seed ${seed}`).toBe(true);
    }
    for (const [seed, task] of tasks("dz-3-anwendungen", "anwendung", 2)) {
      const m = task.meta!;
      if (m.context === 0) {
        const h = m.hit / 100;
        expect(close(num(task, 0).answer, h ** m.n * 100), `seed ${seed}`).toBe(true);
        expect(close(num(task, 1).answer, (1 - h ** m.n) * 100)).toBe(true);
        // genau einer daneben: n paths, counted one by one
        const paths = Array.from({ length: m.n }, (_, miss) => Array.from({ length: m.n }, (_, k) => (k === miss ? 1 - h : h)).reduce((a, b) => a * b, 1));
        expect(close(num(task, 2).answer, paths.reduce((a, b) => a + b, 0) * 100)).toBe(true);
      } else {
        const ok = drawPath(m.total - m.broken, m.broken, true, [0, 0, 0]);
        expect(close(num(task, 0).answer, ok * 100), `seed ${seed}`).toBe(true);
        expect(close(num(task, 1).answer, (1 - ok) * 100)).toBe(true);
      }
    }
  });

  it("8.3 Spiel: the verdicts follow the rounded values and are never close calls", () => {
    for (const [seed, task] of tasks("dz-3-anwendungen", "spiel", 1)) {
      const m = task.meta!;
      const P = 1 - (1 - m.num / m.den) ** m.n;
      expect(close(num(task, 0).answer, P), `seed ${seed}`).toBe(true);
      expect(Math.abs(P - 0.5), `seed ${seed}`).toBeGreaterThanOrEqual(0.01);
      expect(choice(task, 1).correctIndex === 0).toBe(round(P, 4) > 0.5);
    }
    for (const [seed, task] of tasks("dz-3-anwendungen", "spiel", 2)) {
      const [pa, pb] = task.given.map((line) => {
        const [, top, bottom, n] = /p = (\d+)\/(\d+), n = (\d+)/.exec(line)!.map(Number);
        return 1 - (1 - top / bottom) ** n;
      });
      expect(close(num(task, 0).answer, pa * 100), `seed ${seed}`).toBe(true);
      expect(close(num(task, 1).answer, pb * 100), `seed ${seed}`).toBe(true);
      expect(Math.abs(pa - pb), `seed ${seed}`).toBeGreaterThanOrEqual(0.015);
      expect(choice(task, 2).correctIndex).toBe(round(pa * 100, 2) > round(pb * 100, 2) ? 0 : 1);
    }
  });

  it("keeps every probability between 0 and 1 (or 0 % and 100 %)", () => {
    for (const l of lessons) {
      for (const exercise of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const seed of SEEDS) {
            const task = exercise.make(createRng(seed), level);
            for (const field of task.fields) {
              if (field.kind !== "number" || field.label.includes("x =") || field.label.startsWith("n =")) continue;
              const limit = field.unit === "%" ? 100 : 1;
              expect(field.answer, `${l.id}/${exercise.id} L${level} seed ${seed} ${field.label}`).toBeGreaterThanOrEqual(0);
              expect(field.answer, `${l.id}/${exercise.id} L${level} seed ${seed} ${field.label}`).toBeLessThanOrEqual(limit);
            }
          }
        }
      }
    }
  });
});
