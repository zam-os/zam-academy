import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, parseNumberCandidates } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng, type Rng } from "../src/exercises/rng";
import type { CalculationKind, Level, ModelKind } from "../src/model/types";
import {
  applyScenario,
  C,
  centripetal,
  centriSeries,
  chain,
  circular,
  curve,
  EARTH_MASS,
  EARTH_RADIUS,
  eulerFall,
  eulerOscillation,
  fringeSpacing,
  G_EARTH,
  gamma,
  gravityForce,
  harmonic,
  hubble,
  initialModelState,
  interference,
  kepler,
  logistic,
  MODEL_SCENARIOS,
  modelReady,
  modelValues,
  muon,
  orbit,
  PARAMS,
  pendulumPeriod,
  platformSpeed,
  pvPlant,
  recordExploration,
  ride,
  saving,
  setModelValue,
  solarCurrent,
  solarMpp,
  solarPoint,
  spring,
  standing,
  superpose,
  terminalSpeed,
  timingSample,
  UTILITY_OPTIONS,
  utility,
  wave,
} from "../src/models";
import { renderModel } from "../src/ui/models";

describe("physical invariants and limiting cases", () => {
  it("links period, angular velocity and orbital speed, and scales the centripetal force", () => {
    const c = circular(2, 4);
    expect(c.omega).toBeCloseTo(Math.PI / 2);
    expect(c.v).toBeCloseTo(c.omega * 2);
    expect(c.f).toBe(0.25);
    expect(circular(4, 4).v).toBeCloseTo(2 * c.v);
    const base = centripetal(0.5, 4, 2);
    expect(base.f).toBe(4);
    expect(base.a).toBe(8);
    expect(centripetal(0.5, 8, 2).f).toBe(4 * base.f);
    expect(centripetal(0.5, 4, 4).f).toBe(base.f / 2);
    expect(centripetal(1, 4, 2).f).toBe(2 * base.f);
    expect(base.f).toBeCloseTo(0.5 * base.omega ** 2 * 2);
    expect(() => centripetal(1, 1, 0)).toThrow();
  });
  it("produces measurement series that show the three proportionalities", () => {
    for (const vary of [0, 1, 2]) {
      const exact = centriSeries(vary, 0);
      for (const row of exact)
        expect(row.quotient).toBeCloseTo(exact[0].quotient, 10);
      const noisy = centriSeries(vary, 5);
      expect(noisy).toEqual(centriSeries(vary, 5));
      noisy.forEach((row, i) => {
        expect(Math.abs(row.f / exact[i].f - 1)).toBeLessThanOrEqual(0.05);
      });
      expect(noisy.some((row, i) => row.f !== exact[i].f)).toBe(true);
    }
    // m = 0,2 kg, r = 0,4 m, ω = 5 1/s gives 2 N.
    expect(centriSeries(2, 0)[3].f).toBeCloseTo(2);
  });
  it("lets friction decide a bend independently of the mass", () => {
    const dry = curve(1200, 70, 80, 0.8),
      ice = curve(1200, 70, 80, 0.1);
    expect(dry.safe).toBe(true);
    expect(ice.safe).toBe(false);
    expect(curve(2000, 70, 80, 0.8).vMaxKmh).toBeCloseTo(dry.vMaxKmh);
    expect(dry.vMaxKmh).toBeCloseTo(Math.sqrt(0.8 * G_EARTH * 80) * 3.6);
    const limit = curve(1200, dry.vMaxKmh, 80, 0.8);
    expect(limit.need).toBeCloseTo(limit.max);
    expect(curve(1200, 140, 80, 0.8).need).toBeCloseTo(4 * dry.need);
  });
  it("obeys the inverse-square law and reproduces known orbits", () => {
    const surface = gravityForce(EARTH_MASS, 70, EARTH_RADIUS);
    expect(surface / 70).toBeCloseTo(9.82, 1);
    expect(gravityForce(EARTH_MASS, 70, 2 * EARTH_RADIUS)).toBeCloseTo(
      surface / 4,
    );
    expect(gravityForce(EARTH_MASS, 70, 3 * EARTH_RADIUS)).toBeCloseTo(
      surface / 9,
    );
    expect(() => gravityForce(1, 1, 0)).toThrow();
    const iss = orbit(EARTH_MASS, EARTH_RADIUS + 400e3);
    expect(iss.v / 1000).toBeCloseTo(7.67, 1);
    expect(iss.T / 60).toBeGreaterThan(91);
    expect(iss.T / 60).toBeLessThan(94);
    const geo = orbit(EARTH_MASS, EARTH_RADIUS + 35800e3);
    expect(geo.T / 3600).toBeCloseTo(23.93, 0);
    expect(geo.v).toBeLessThan(iss.v);
    // Kepler III for circular orbits: T² / r³ is the same for both.
    expect(geo.T ** 2 / (EARTH_RADIUS + 35800e3) ** 3).toBeCloseTo(
      iss.T ** 2 / (EARTH_RADIUS + 400e3) ** 3,
      20,
    );
  });
  it("describes oscillators: period, energy and the pendulum's independence of mass", () => {
    expect(harmonic(4, 2, 0)).toBe(0);
    expect(harmonic(4, 2, 0.5)).toBeCloseTo(4);
    expect(harmonic(4, 2, 1.5)).toBeCloseTo(-4);
    expect(harmonic(4, 2, 2.5)).toBeCloseTo(harmonic(4, 2, 0.5));
    const s = spring(0.2, 20, 4);
    expect(s.T).toBeCloseTo(0.6283, 3);
    expect(spring(0.8, 20, 4).T).toBeCloseTo(2 * s.T);
    expect(spring(0.2, 5, 4).T).toBeCloseTo(2 * s.T);
    expect(spring(0.2, 20, 8).T).toBeCloseTo(s.T);
    expect(spring(0.2, 20, 8).energy).toBeCloseTo(4 * s.energy);
    expect(0.5 * 0.2 * s.vMax ** 2).toBeCloseTo(s.energy);
    expect(pendulumPeriod(0.5, 9.81)).toBeCloseTo(1.4185, 3);
    expect(pendulumPeriod(2, 9.81)).toBeCloseTo(2 * pendulumPeriod(0.5, 9.81));
    expect(pendulumPeriod(0.5, 1.62)).toBeGreaterThan(pendulumPeriod(0.5, 9.81));
    const one = timingSample(5, 1, 0.2),
      ten = timingSample(5, 10, 0.2);
    expect(ten.halfRange).toBeCloseTo(one.halfRange / 10);
    expect(Math.abs(ten.mean - 1.42)).toBeLessThan(0.02);
    expect(ten.deviation).toBeGreaterThan(0);
    expect(timingSample(5, 10, 0.2)).toEqual(ten);
  });
  it("superposes waves and decides interference from the path difference", () => {
    expect(wave(2, 1)).toEqual({ c: 2, T: 1 });
    expect(wave(1, 2).c).toBe(2);
    expect(superpose(3, 3, 0)).toBeCloseTo(6);
    expect(superpose(3, 3, 0.5)).toBeCloseTo(0);
    expect(superpose(3, 1, 0.5)).toBeCloseTo(2);
    expect(superpose(3, 3, 0.25)).toBeCloseTo(3 * Math.SQRT2);
    expect(superpose(3, 3, 1)).toBeCloseTo(6);
    expect(interference(4, 4, 1).kind).toBe("konstruktiv");
    expect(interference(4, 5, 1).kind).toBe("konstruktiv");
    expect(interference(4, 4.5, 1).kind).toBe("destruktiv");
    expect(interference(5.5, 4, 1).kind).toBe("destruktiv");
    expect(interference(4, 4.25, 1).kind).toBe("dazwischen");
    expect(interference(4, 5, 2).kind).toBe("destruktiv");
    expect(standing(1, 1, 200)).toEqual({ lambda: 2, f: 100, nodes: 2 });
    expect(standing(1, 3, 200).f).toBeCloseTo(300);
    expect(standing(0.5, 1, 200).f).toBe(200);
    expect(fringeSpacing(650, 0.2, 2)).toBeCloseTo(6.5);
    expect(fringeSpacing(450, 0.2, 2)).toBeLessThan(fringeSpacing(550, 0.2, 2));
    expect(fringeSpacing(650, 0.1, 2)).toBeCloseTo(13);
  });
  it("keeps Kepler's third law, Hubble's proportionality and the speed of light", () => {
    expect(kepler(1, 0).T).toBe(1);
    expect(kepler(4, 0).T).toBe(8);
    const comet = kepler(18, 0.9);
    expect(comet.perihel + comet.aphel).toBeCloseTo(36);
    expect(comet.speedRatio).toBeCloseTo(19);
    expect(kepler(5, 0).speedRatio).toBe(1);
    expect(hubble(100, 70).v).toBe(7000);
    expect(hubble(200, 70).v).toBe(2 * hubble(100, 70).v);
    expect(hubble(100, 70).ageGyr).toBeCloseTo(13.97, 1);
    for (const beta of [0, 0.5, 0.9]) {
      expect(platformSpeed(beta, 1).measured).toBeCloseTo(1);
      expect(platformSpeed(beta, 0.5).measured).toBeLessThan(1);
    }
    expect(platformSpeed(0.5, 0.5)).toMatchObject({ classical: 1 });
    expect(platformSpeed(0.5, 0.5).measured).toBeCloseTo(0.8);
    expect(gamma(0)).toBe(1);
    expect(gamma(0.6)).toBeCloseTo(1.25);
    expect(gamma(0.8)).toBeCloseTo(5 / 3);
    expect(() => gamma(1)).toThrow();
    const m = muon(0.995, 10);
    expect(m.gamma).toBeCloseTo(10.01, 1);
    expect(m.classicalReach).toBeCloseTo(0.995 * C * 2.2e-6);
    expect(m.reach).toBeCloseTo(m.gamma * m.classicalReach);
    expect(m.contractedHeight).toBeCloseTo(10000 / m.gamma);
    // Both frames agree on the surviving share.
    expect(Math.exp(-m.contractedHeight / m.classicalReach)).toBeCloseTo(
      m.share,
    );
    expect(m.share).toBeGreaterThan(1000 * m.classicalShare);
  });
  it("balances energy chains, weights and savings", () => {
    const bulb = chain(100, [40, 95, 5]);
    expect(bulb.useful).toBeCloseTo(1.9);
    expect(bulb.useful + bulb.devalued).toBeCloseTo(100);
    expect(chain(100, [100, 100, 100]).devalued).toBe(0);
    expect(utility([5, 5, 5], [3, 5, 3])).toBeCloseTo(11 / 3);
    expect(utility([0, 0, 0], [3, 5, 3])).toBe(0);
    const [wind, gas] = UTILITY_OPTIONS.map((o) => o.scores);
    expect(utility([3, 9, 3], wind)).toBeGreaterThan(utility([3, 9, 3], gas));
    expect(utility([9, 2, 4], gas)).toBeGreaterThan(utility([9, 2, 4], wind));
    const lamp = saving(60, 8, 3, 35);
    expect(lamp.oldKwh).toBeCloseTo(65.7);
    expect(lamp.savedKwh).toBeCloseTo(lamp.oldKwh - lamp.newKwh);
    expect(lamp.savedEuro).toBeCloseTo(19.929);
    const pv = pvPlant(8, 1000, 30, 35);
    expect(pv.energy).toBe(8000);
    expect(pv.own + pv.fed).toBe(8000);
    expect(pv.euro).toBeCloseTo(2400 * 0.35 + 5600 * 0.08);
    expect(pvPlant(8, 1000, 60, 35).euro).toBeGreaterThan(pv.euro);
  });
  it("steps through non-constant forces and approaches the known limits", () => {
    const free = eulerFall(1, 0, 0.5, 6);
    free.forEach((row) => {
      expect(row.a).toBe(G_EARTH);
      expect(row.v).toBeCloseTo(G_EARTH * row.t);
    });
    const drag = eulerFall(1, 0.2, 0.5, 6);
    expect(drag[1].v).toBeCloseTo(4.905);
    expect(drag[1].a).toBeCloseTo(G_EARTH - 0.2 * 4.905 ** 2);
    expect(terminalSpeed(80, 0)).toBeNull();
    const end = terminalSpeed(80, 0.3)!;
    expect(end).toBeCloseTo(51.15, 1);
    const fine = eulerFall(80, 0.3, 0.1, 400);
    expect(fine[400].v).toBeCloseTo(end, 2);
    for (let i = 1; i < fine.length; i++)
      expect(fine[i].v).toBeGreaterThanOrEqual(fine[i - 1].v);
    // Every slider setting stays finite, also the coarsest step.
    for (const m of [10, 100])
      for (const k of [0, 0.5])
        for (const dt of [0.1, 1])
          for (const row of eulerFall(m, k, dt, Math.round(20 / dt)))
            expect(Number.isFinite(row.v) && Math.abs(row.v) < 400).toBe(true);
    const osc = eulerOscillation(0.2, 20, 0.01);
    expect(osc.exact).toBeCloseTo(0.6283, 3);
    expect(osc.simulated!).toBeCloseTo(osc.exact, 2);
    expect(eulerOscillation(0.8, 20, 0.01).simulated!).toBeCloseTo(
      2 * osc.simulated!,
      1,
    );
    const coarse = eulerOscillation(0.2, 20, 0.08);
    expect(Math.abs(coarse.simulated! - coarse.exact)).toBeGreaterThan(
      Math.abs(osc.simulated! - osc.exact),
    );
    for (const m of [0.1, 1])
      for (const D of [5, 50])
        for (const dt of [0.01, 0.08])
          for (const [, x] of eulerOscillation(m, D, dt).points)
            expect(Math.abs(x)).toBeLessThan(0.2);
  });
  it("finds the solar cell's working point and its maximum power point", () => {
    expect(solarCurrent(1000, 0)).toBeCloseTo(0.5);
    expect(solarCurrent(1000, 0.6)).toBeCloseTo(0, 6);
    expect(solarCurrent(400, 0)).toBeCloseTo(0.2);
    const mpp = solarMpp(1000);
    expect(mpp.u).toBeGreaterThan(0.45);
    expect(mpp.u).toBeLessThan(0.58);
    for (const r of [0.2, 1, 5]) {
      const point = solarPoint(1000, r);
      expect(point.u / r).toBeCloseTo(solarCurrent(1000, point.u), 6);
      expect(point.p).toBeLessThanOrEqual(mpp.p + 1e-9);
    }
    expect(solarPoint(1000, mpp.r).p).toBeCloseTo(mpp.p, 3);
    expect(solarMpp(400).p).toBeLessThan(mpp.p);
    expect(solarPoint(1000, 0.2).p).toBeLessThan(0.5 * mpp.p);
    expect(solarPoint(1000, 5).p).toBeLessThan(0.5 * mpp.p);
  });
  it("measures rides in multiples of g and separates stable from chaotic rules", () => {
    const r = ride(8, 4);
    expect(r.a).toBeCloseTo(19.74, 1);
    expect(r.gFactor).toBeCloseTo(r.a / G_EARTH);
    expect(ride(20, 20).gFactor).toBeLessThan(0.3);
    const gap = (rate: number) =>
      Math.abs(logistic(rate, 0.2, 30)[30] - logistic(rate, 0.201, 30)[30]);
    expect(gap(2.8)).toBeLessThan(1e-4);
    expect(gap(3.9)).toBeGreaterThan(0.01);
    expect(logistic(2.8, 0.2, 60)[60]).toBeCloseTo(1 - 1 / 2.8, 4);
    for (const x of logistic(4, 0.9, 30)) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
    }
  });
});

describe("model controls and comparisons", () => {
  it("allows only valid controls", () => {
    const s = applyScenario("circular", initialModelState(), "fast");
    expect(modelValues("circular", s).T).toBe(2);
    expect(setModelValue("circular", s, "unknown", 2)).toBe(s);
    expect(setModelValue("circular", s, "T", NaN)).toBe(s);
    expect(setModelValue("circular", s, "T", 11)).toBe(s);
    expect(setModelValue("circular", s, "T", 0.7)).toBe(s);
    const moved = setModelValue("circular", s, "T", 3.5);
    expect(moved.selected).toBe("");
    expect(modelValues("circular", moved)).toEqual({ r: 2, T: 3.5 });
    expect(
      recordExploration("circular", ["base", "unknown"], "base"),
    ).toEqual(["base"]);
    expect(modelReady("circular", ["base"])).toBe(false);
  });
  for (const [kind, scenarios] of Object.entries(MODEL_SCENARIOS) as Array<
    [ModelKind, (typeof MODEL_SCENARIOS)[ModelKind]]
  >)
    it(`${kind}: no comparison reached at the start, every one reachable and renderable`, () => {
      const lesson = LESSONS.find((l) => l.model === kind)!;
      expect(lesson).toBeDefined();
      expect(scenarios.length).toBeGreaterThanOrEqual(3);
      expect(modelReady(kind, [])).toBe(false);
      let seen: string[] = [];
      for (const scenario of scenarios) {
        // Witness: opening the comparison records it, and its values lie on the slider grid.
        expect(modelReady(kind, seen)).toBe(false);
        const state = applyScenario(kind, initialModelState(), scenario.id);
        expect(state.selected).toBe(scenario.id);
        seen = recordExploration(kind, seen, scenario.id);
        expect(Object.keys(scenario.values).sort()).toEqual(
          PARAMS[kind].map((p) => p.key).sort(),
        );
        for (const param of PARAMS[kind]) {
          const value = scenario.values[param.key];
          expect(value).toBeGreaterThanOrEqual(param.min);
          expect(value).toBeLessThanOrEqual(param.max);
          const steps = (value - param.min) / param.step;
          expect(Math.abs(steps - Math.round(steps))).toBeLessThan(1e-6);
          expect(
            setModelValue(kind, initialModelState(), param.key, value).values[
              param.key
            ],
          ).toBe(value);
        }
        const html = renderModel(lesson, seen, state);
        expect(html).not.toMatch(/NaN|Infinity|undefined/);
        expect(html).toContain('class="panel exploration"');
      }
      expect(modelReady(kind, seen)).toBe(true);
    });
  it("renders finite readouts on a sampled slider grid of every model", () => {
    for (const kind of Object.keys(PARAMS) as ModelKind[]) {
      const lesson = LESSONS.find((l) => l.model === kind)!,
        params = PARAMS[kind],
        points = params.length >= 4 ? 3 : params.length === 3 ? 4 : 6;
      const grid = params.map((param) => {
        const count = Math.round((param.max - param.min) / param.step);
        return [
          ...new Set(
            Array.from({ length: points }, (_, i) =>
              Number(
                (
                  param.min +
                  Math.round((count * i) / (points - 1)) * param.step
                ).toFixed(6),
              ),
            ),
          ),
        ];
      });
      const walk = (index: number, values: Record<string, number>): void => {
        if (index === params.length) {
          const html = renderModel(lesson, [], { selected: "", values });
          expect(html, `${kind} ${JSON.stringify(values)}`).not.toMatch(
            /NaN|Infinity|undefined|>–</,
          );
          return;
        }
        for (const value of grid[index])
          walk(index + 1, { ...values, [params[index].key]: value });
      };
      walk(0, {});
    }
  });
  it("requires distinct model states rather than opening the same scenario twice", () => {
    for (const scenarios of Object.values(MODEL_SCENARIOS)) {
      const states = scenarios.map((s) =>
        JSON.stringify(
          Object.entries(s.values).sort(([a], [b]) => a.localeCompare(b)),
        ),
      );
      expect(new Set(states).size).toBe(scenarios.length);
      expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length);
    }
  });
});

const PI2 = 2 * Math.PI;
/** Independently calculated answers for a = 4, b = 3, c = 2. */
const oracle: Record<CalculationKind, [number, number]> = {
  circular: [(PI2 * 4) / 6, PI2 * 0.2 * 3],
  centripetal: [3.6, Math.sqrt(40 / 0.3)],
  centriexp: [8, (0.2 * PI2 * PI2 * 0.3) / 0.64],
  curve: [5400, Math.sqrt(0.4 * 9.81 * 60) * 3.6],
  gravity: [(6.674e-11 * 4e24) / 9e12, 100],
  orbit: [
    Math.sqrt(3.986e14 / 9e6) / 1000,
    (PI2 * PI2 * 6.4e22) / (6.674e-11 * 21600 ** 2) / 1e24,
  ],
  oscillation: [0.6, 2],
  spring: [PI2 * Math.sqrt(0.4 / 30), 0.02 * Math.sqrt(75)],
  pendulum: [PI2 * Math.sqrt(1 / 9.81), (PI2 * PI2 * 1.5) / 6.05 ** 2],
  uncertainty: [1.418, 2.5],
  wave: [6, 34],
  interference: [3, 425],
  standing: [0.4, 750],
  light: [3e8 / 550e-9 / 1e14, 500],
  kepler: [Math.sqrt(27), 16 ** (2 / 3)],
  hubble: [14000, 300],
  lorentz: [5, Math.sqrt(1 - (4 / 6.67) ** 2)],
  contraction: [80, (0.98 * 3e8 * 4e-6) / Math.sqrt(1 - 0.98 ** 2) / 1000],
  efficiency: [30, 4 / (0.4 * 0.95 * 0.3)],
  fullload: [6000, 40000 / 900],
  saving: [43.8, 0.052 * 3 * 365 * 0.35],
  euler: [4.6, -0.24],
  airfall: [9.81 - (0.3 * 16) / 40, Math.sqrt((40 * 9.81) / 0.3)],
  solar: [0.132, 17],
  pvplant: [3800, 1.5 / (0.3 * 0.35 + 0.7 * 0.08)],
  ride: [(PI2 * PI2 * 6) / 16 / 9.81, Math.sqrt(9.81 * 4) * 3.6],
};
function exampleRng(): Rng {
  const values = [4, 3, 2];
  return { ...createRng(1), int: () => values.shift()! };
}
describe("numeric tasks and answer checking", () => {
  it("gives every calculation kind to exactly one lesson", () => {
    const used = LESSONS.filter((l) => l.calculation).map((l) => l.calculation);
    expect([...used].sort()).toEqual(Object.keys(oracle).sort());
  });
  for (const kind of Object.keys(oracle) as CalculationKind[])
    for (const level of [1, 2] as Level[])
      it(`${kind} level ${level}: independently calculated reference`, () => {
        expect(makeExercise(kind, exampleRng(), level).answer).toBeCloseTo(
          oracle[kind][level - 1],
          9,
        );
      });
  it("sweeps 80 seeded tasks per level, accepts German rounding and rejects unrelated numbers", () => {
    for (const kind of Object.keys(oracle) as CalculationKind[])
      for (const level of [1, 2] as Level[]) {
        const prompts = new Set<string>();
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          prompts.add(task.prompt);
          expect(Number.isFinite(task.answer)).toBe(true);
          expect(task.answer).not.toBe(0);
          expect(task.prompt.length).toBeGreaterThan(60);
          expect(task.formulaHint?.length).toBeGreaterThan(3);
          expect(task.solutionHtml.length).toBeGreaterThan(15);
          expect(task.unit.length).toBeGreaterThan(0);
          const rounded = task.answer.toFixed(task.digits);
          expect(checkAnswer(task, rounded.replace(".", ",")).status).toBe(
            "correct",
          );
          expect(checkAnswer(task, rounded).status).toBe("correct");
          expect(
            checkAnswer(
              task,
              String(task.answer + Math.max(1, Math.abs(task.answer)) * 10),
            ).status,
          ).toBe("wrong");
          expect(checkAnswer(task, "").status).toBe("invalid");
        }
        // Values vary from task to task (at least the four values of c).
        expect(prompts.size).toBeGreaterThanOrEqual(4);
      }
    expect(parseNumberCandidates("1.234,5 V")).toEqual([1234.5]);
    expect(parseNumberCandidates("−3")).toEqual([-3]);
    expect(parseNumberCandidates("-3,2")).toEqual([-3.2]);
  });
  it("changes the task with the level and keeps the values plausible", () => {
    for (const kind of Object.keys(oracle) as CalculationKind[])
      for (let seed = 1; seed <= 80; seed++) {
        const one = makeExercise(kind, createRng(seed), 1),
          two = makeExercise(kind, createRng(seed), 2);
        expect(one.prompt).not.toBe(two.prompt);
        expect(one.formulaHint).not.toBe(
          kind === "kepler" ? undefined : two.formulaHint,
        );
      }
    for (let seed = 1; seed <= 80; seed++) {
      // Speeds stay below c, efficiencies below 100 %, the falling body still accelerates.
      expect(makeExercise("lorentz", createRng(seed), 2).answer).toBeLessThan(1);
      expect(
        makeExercise("efficiency", createRng(seed), 1).answer,
      ).toBeLessThanOrEqual(60);
      expect(makeExercise("solar", createRng(seed), 2).answer).toBeLessThanOrEqual(
        20,
      );
      expect(makeExercise("airfall", createRng(seed), 1).answer).toBeGreaterThan(
        0,
      );
      expect(makeExercise("ride", createRng(seed), 1).answer).toBeLessThan(10);
      expect(makeExercise("curve", createRng(seed), 2).answer).toBeLessThan(120);
    }
  });
});
