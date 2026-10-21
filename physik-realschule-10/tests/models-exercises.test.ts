import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, parseNumberCandidates } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng, type Rng } from "../src/exercises/rng";
import type { CalculationKind, Level, ModelKind } from "../src/model/types";
import {
  applyScenario,
  circuit,
  collision,
  daughter,
  decaySample,
  induction,
  initialModelState,
  MODEL_SCENARIOS,
  modelReady,
  modelValues,
  motion,
  plant,
  recordExploration,
  remaining,
  setModelValue,
  storage,
  transformer,
} from "../src/models";
import { renderModel } from "../src/ui/models";

describe("physical invariants and limiting cases", () => {
  it("separates uniform motion, acceleration, position and speed", () => {
    expect(motion(4, 0, 3)).toEqual({ x: 12, v: 4 });
    expect(motion(0, 2, 3)).toEqual({ x: 9, v: 6 });
    expect(motion(2, -1, 4)).toEqual({ x: 0, v: -2 });
  });
  it("conserves directed momentum for all collision kinds and energy only for e=1", () => {
    for (const m1 of [1, 2, 5])
      for (const m2 of [1, 3, 7])
        for (const v2 of [-2, 0])
          for (const e of [0, 0.5, 1]) {
            const r = collision(m1, m2, 3, v2, e);
            expect(r.pAfter).toBeCloseTo(r.pBefore, 10);
            expect(r.eAfter).toBeLessThanOrEqual(r.eBefore + 1e-9);
            if (e === 1) expect(r.eAfter).toBeCloseTo(r.eBefore, 10);
            if (e === 0) expect(r.v1).toBeCloseTo(r.v2, 10);
          }
    expect(collision(1, 1, 3, 0, 1)).toMatchObject({ v1: 0, v2: 3 });
  });
  it("obeys node, loop and power balances in both circuit topologies", () => {
    for (const parallel of [false, true]) {
      const r = circuit(6, 100, 200, parallel);
      if (parallel) {
        expect(r.i).toBeCloseTo(r.i1 + r.i2);
        expect(r.u1).toBe(6);
        expect(r.u2).toBe(6);
        expect(r.r).toBeLessThan(100);
      } else {
        expect(r.i1).toBeCloseTo(r.i2);
        expect(r.u1 + r.u2).toBeCloseTo(6);
        expect(r.r).toBe(300);
      }
      expect(6 * r.i).toBeCloseTo(r.u1 * r.i1 + r.u2 * r.i2);
    }
  });
  it("distinguishes open induction voltage from current and reverses sign with change", () => {
    expect(induction(200, 0.02, 0, 0.5, true)).toMatchObject({ u: 0, i: 0 });
    const open = induction(200, 0.02, 0.4, 0.5, false),
      closed = induction(200, 0.02, 0.4, 0.5, true);
    expect(open.u).toBeCloseTo(-3.2);
    expect(open.i).toBe(0);
    expect(closed.i).toBeCloseTo(-0.032);
    expect(induction(200, 0.02, -0.4, 0.5, true).u).toBeCloseTo(-open.u);
  });
  it("accounts for transformer losses without inventing output power", () => {
    const ideal = transformer(500, 100, 20, 10, 100);
    expect(ideal.u2).toBe(4);
    expect(ideal.p1).toBeCloseTo(ideal.p2);
    expect(ideal.i1 / ideal.i2).toBeCloseTo(0.2);
    const real = transformer(500, 100, 20, 10, 80);
    expect(real.p1).toBeCloseTo(2);
    expect(real.p2).toBeCloseTo(1.6);
    expect(real.loss).toBeCloseTo(0.4);
  });
  it("uses repeated halving and keeps the random analogy separate", () => {
    expect(remaining(8000, 12, 4)).toBe(1000);
    expect(remaining(8000, 0, 4)).toBe(8000);
    const sample = decaySample(100, 8);
    expect(sample).toEqual(decaySample(100, 8));
    for (let i = 1; i < sample.length; i++) {
      expect(sample[i]).toBeGreaterThanOrEqual(0);
      expect(sample[i]).toBeLessThanOrEqual(sample[i - 1]);
      expect(Number.isInteger(sample[i])).toBe(true);
    }
    const average =
      Array.from(
        { length: 200 },
        (_, seed) => decaySample(1000, 1, seed)[1],
      ).reduce((a, b) => a + b) / 200;
    expect(average).toBeGreaterThan(490);
    expect(average).toBeLessThan(510);
  });
  it("balances nucleon counts and energy and refuses an unsupported storage load", () => {
    expect(daughter(238, 92, 0)).toEqual({ a: 234, z: 90 });
    expect(daughter(14, 6, 1)).toEqual({ a: 14, z: 7 });
    expect(daughter(99, 43, 2)).toEqual({ a: 99, z: 43 });
    const r = plant(100, 35, 70);
    expect(r.el + r.heat + r.loss).toBeCloseTo(100);
    expect(plant(100, 35, 0).useful).toBe(35);
    expect(storage(20, 80, 2, 4)).toEqual({ energy: 16, loss: 4, hours: 8 });
    expect(storage(20, 80, 6, 4).hours).toBeNull();
  });
  it("allows only valid controls and requires every named comparison", () => {
    const s = applyScenario("motion", initialModelState(), "accelerated");
    expect(modelValues("motion", s).a).toBe(2);
    expect(setModelValue("motion", s, "unknown", 2)).toBe(s);
    expect(setModelValue("motion", s, "a", NaN)).toBe(s);
    expect(setModelValue("motion", s, "a", 9)).toBe(s);
    expect(setModelValue("motion", s, "a", 0.3)).toBe(s);
    expect(
      recordExploration("motion", ["uniform", "unknown"], "uniform"),
    ).toEqual(["uniform"]);
    expect(modelReady("motion", ["uniform"])).toBe(false);
    for (const [kind, scenarios] of Object.entries(MODEL_SCENARIOS)) {
      const lesson = LESSONS.find((l) => l.model === kind)!;
      expect(lesson).toBeDefined();
      for (const scenario of scenarios) {
        const html = renderModel(
          lesson,
          [],
          applyScenario(kind as ModelKind, initialModelState(), scenario.id),
        );
        expect(html).not.toMatch(/NaN|Infinity|undefined/);
        expect(html).toContain('class="panel exploration"');
      }
      expect(
        modelReady(
          kind as ModelKind,
          scenarios.map((s) => s.id),
        ),
      ).toBe(true);
    }
  });
});
const oracle: Record<CalculationKind, [number, number]> = {
  speed: [4, 12],
  acceleration: [18, 2],
  fall: [0.44145, 16 / 19.62],
  force: [12, 3],
  energy: [18, 3],
  stopping: [18, 2.4],
  momentum: [-12, 8 / 3],
  collision: [8 / 7, 5 / 7],
  series: [12 / 700, 14],
  parallel: [1200 / 7, 0.07],
  meter: [6 / 43, 300 / 43],
  range: [3900, 100 / 39],
  frequency: [25, 25],
  transformer: [9, 3],
  line: [48, 32 / 9],
  halfLife: [400, 12],
  decay: [400 / Math.sqrt(8), 1.5],
  binding: [3.6, 4],
  dose: [4 / 3, 12],
  efficiency: [35, 24],
  kwk: [35, 40],
  storage: [32, 40 / 3],
  effective: [40 * Math.SQRT2, 40 / Math.SQRT2],
};
function exampleRng(): Rng {
  const values = [4, 3, 2];
  return { ...createRng(1), int: () => values.shift()! };
}
describe("numeric tasks and answer checking", () => {
  for (const kind of Object.keys(oracle) as CalculationKind[])
    for (const level of [1, 2] as Level[])
      it(`${kind} level ${level}: independently calculated reference`, () => {
        expect(makeExercise(kind, exampleRng(), level).answer).toBeCloseTo(
          oracle[kind][level - 1],
          9,
        );
      });
  it("sweeps seeded exercises, accepts German rounding and rejects unrelated numbers", () => {
    for (const kind of Object.keys(oracle) as CalculationKind[])
      for (const level of [1, 2] as Level[])
        for (let seed = 1; seed <= 100; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          expect(Number.isFinite(task.answer)).toBe(true);
          expect(task.prompt.length).toBeGreaterThan(20);
          expect(
            checkAnswer(
              task,
              task.answer.toFixed(task.digits).replace(".", ","),
            ).status,
          ).toBe("correct");
          expect(
            checkAnswer(
              task,
              String(task.answer + Math.max(1, Math.abs(task.answer)) * 10),
            ).status,
          ).toBe("wrong");
          expect(checkAnswer(task, "").status).toBe("invalid");
        }
    expect(parseNumberCandidates("1.234,5 V")).toEqual([1234.5]);
    expect(parseNumberCandidates("−3")).toEqual([-3]);
    expect(parseNumberCandidates("-3,2")).toEqual([-3.2]);
  });
});
