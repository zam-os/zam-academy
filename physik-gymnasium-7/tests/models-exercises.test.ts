import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, parseNumberCandidates } from "../src/exercises/checker";
import { LIGHT, makeExercise, METALS } from "../src/exercises/generators";
import { createRng, type Rng } from "../src/exercises/rng";
import type { CalculationKind, Level, ModelKind } from "../src/model/types";
import {
  applyScenario,
  atomCharge,
  blockedShare,
  bodyColour,
  circuit,
  clipsHeld,
  coil,
  colouredShadows,
  compareMaterials,
  compass,
  density,
  eclipse,
  initialModelState,
  irradiation,
  MATERIALS,
  MODEL_SCENARIOS,
  measurement,
  modelReady,
  modelValues,
  moonPhase,
  ordering,
  PARAMS,
  penumbra,
  poles,
  recordExploration,
  rubbing,
  seeing,
  setModelValue,
  shadowSize,
  STOPPING_50,
  switching,
  visibility,
} from "../src/models";
import { renderModel } from "../src/ui/models";

describe("physical invariants and limiting cases", () => {
  it("spreads the same light over a larger spot when it falls flatter", () => {
    expect(irradiation(90)).toEqual({ share: 1, area: 1 });
    expect(irradiation(30).area).toBeCloseTo(2);
    // Munich at noon: about 65° in summer, 18° in winter, about three times the area.
    expect(irradiation(18).area / irradiation(65).area).toBeCloseTo(2.93, 1);
    expect(irradiation(10).share).toBeLessThan(irradiation(20).share);
  });
  it("lets unlike poles attract, like poles repel, and iron screen", () => {
    expect(poles(0, 2, 0).kind).toBe("Anziehung");
    expect(poles(1, 2, 0).kind).toBe("Abstoßung");
    expect(poles(0, 1, 0).strength).toBe(100);
    expect(poles(0, 2, 0).strength).toBe(25);
    expect(poles(0, 2, 1).strength).toBe(poles(0, 2, 0).strength);
    expect(poles(0, 2, 2).strength).toBe(poles(0, 2, 0).strength);
    expect(poles(0, 2, 3).kind).toBe("kaum spürbar");
    expect(poles(0, 10, 0).kind).toBe("kaum spürbar");
  });
  it("orders Elementarmagnete by stroking and disorders them by heat; copper has none", () => {
    expect(ordering(0, 0, 0)).toBe(0);
    expect(ordering(0, 10, 0)).toBeCloseTo(1 - 0.8 ** 10);
    for (let n = 1; n <= 10; n++) expect(ordering(0, n, 0)).toBeGreaterThan(ordering(0, n - 1, 0));
    expect(ordering(0, 10, 1)).toBeLessThan(ordering(0, 10, 0));
    expect(ordering(0, 10, 2)).toBe(0);
    expect(ordering(1, 10, 0)).toBe(0);
    expect(clipsHeld(0, 0)).toBe(0);
    expect(clipsHeld(ordering(0, 10, 0), 0)).toBeGreaterThan(clipsHeld(ordering(0, 10, 0), 1));
  });
  it("finds the target only on an oriented map", () => {
    expect(compass(0, 0)).toMatchObject({ oriented: true, offset: 0, direction: "Nordosten" });
    expect(compass(90, 0)).toMatchObject({ oriented: false, offset: 90 });
    expect(compass(345, 1)).toMatchObject({ oriented: false, offset: 15, direction: "Süden" });
    expect(compass(0, 2).direction).toBe("Nordwesten");
  });
  it("keeps the density of a material fixed while mass grows with volume", () => {
    for (const [i, material] of MATERIALS.entries()) {
      const one = density(i, 1),
        ten = density(i, 10);
      expect(ten.mass).toBeCloseTo(10 * one.mass);
      expect(ten.mass / 10).toBeCloseTo(material.rho);
    }
    expect(density(6, 10).mass).toBeCloseTo(193);
    expect(density(1, 10).mass).toBeCloseTo(9.2);
  });
  it("brackets the measured density by the reading uncertainty", () => {
    const screw = measurement(0, 0);
    expect(screw).toMatchObject({ mass: 62.4, v1: 50, v2: 58, volume: 8 });
    expect(screw.rho).toBeCloseTo(7.8);
    expect(screw.rhoMin).toBeCloseTo(62.4 / 8.5);
    expect(screw.rhoMax).toBeCloseTo(62.4 / 7.5);
    expect(screw.matches).toEqual(["Eisen"]);
    // The coarse scale leaves the pendant open; the fine one narrows it to brass or copper.
    expect(measurement(1, 1).matches.length).toBeGreaterThanOrEqual(4);
    expect(measurement(1, 0).matches).toEqual(["Messing", "Kupfer"]);
    expect(measurement(2, 0).matches).toEqual(["Aluminium", "Granit"]);
    for (const sample of [0, 1, 2])
      for (const scale of [0, 1]) {
        const r = measurement(sample, scale);
        expect(r.rhoMin).toBeLessThanOrEqual(r.rho);
        expect(r.rhoMax).toBeGreaterThanOrEqual(r.rho);
        expect(Number.isFinite(r.rhoMax)).toBe(true);
      }
  });
  it("compares Werkstoffe of the same volume by their densities", () => {
    const r = compareMaterials(0, 1, 300);
    expect(r.ma).toBeCloseTo(2.34);
    expect(r.mb).toBeCloseTo(0.81);
    expect(r.difference).toBeCloseTo(1.53);
    expect(compareMaterials(1, 1, 500).difference).toBe(0);
  });
  it("sees only along an unbroken light path", () => {
    expect(seeing(1, 0, 0)).toEqual({ lit: true, seesBook: true, seesLamp: true });
    expect(seeing(0, 0, 0)).toEqual({ lit: false, seesBook: false, seesLamp: false });
    expect(seeing(1, 1, 0).seesBook).toBe(false);
    expect(seeing(1, 0, 1)).toMatchObject({ lit: true, seesBook: false });
  });
  it("reflects what the light offers and the body allows", () => {
    expect(bodyColour(0, 1).name).toBe("rot");
    expect(bodyColour(2, 1).name).toBe("schwarz");
    expect(bodyColour(1, 4).name).toBe("rot");
    expect(bodyColour(3, 0).name).toBe("blau");
    expect(bodyColour(0, 4).name).toBe("gelb");
    expect(bodyColour(0, 5).name).toBe("schwarz");
    for (let light = 0; light < 4; light++)
      for (let object = 0; object < 6; object++) {
        const r = bodyColour(light, object);
        expect(r.seen | r.absorbed).toBe(r.incoming);
        expect(r.seen & r.absorbed).toBe(0);
      }
  });
  it("mixes coloured light additively and colours each shadow by the other lamps", () => {
    expect(colouredShadows(1, 1, 0)).toEqual({
      wall: 3,
      shadows: [
        { lamp: 1, colour: 2 },
        { lamp: 2, colour: 1 },
      ],
    });
    const all = colouredShadows(1, 1, 1);
    expect(all.wall).toBe(7);
    expect(all.shadows.map((s) => s.colour)).toEqual([6, 5, 3]);
    expect(colouredShadows(1, 0, 0).shadows).toEqual([{ lamp: 1, colour: 0 }]);
  });
  it("scales the shadow with the ratio of the distances", () => {
    expect(shadowSize(50, 4).size).toBe(8);
    expect(shadowSize(20, 4).size).toBe(20);
    expect(shadowSize(80, 4).size).toBe(5);
    expect(shadowSize(10, 4).size).toBeGreaterThan(shadowSize(90, 4).size);
  });
  it("splits shadows into core and half shadow as in the worked example", () => {
    expect(penumbra(8, 50)).toMatchObject({ core: 4, total: 20, half: 8, gap: 0, each: 12 });
    expect(penumbra(16, 50).core).toBe(0);
    expect(penumbra(16, 50).gap).toBe(4);
    expect(penumbra(4, 50).core).toBeGreaterThan(penumbra(16, 50).core);
    expect(penumbra(8, 80).core).toBeGreaterThan(penumbra(8, 50).core);
    for (const d of [2, 10, 20])
      for (const a of [20, 50, 80]) {
        const r = penumbra(d, a);
        expect(r.core + 2 * r.half + r.gap).toBeCloseTo(r.total);
      }
  });
  it("never leaves a lit gap behind a continuous lamp (review of #169)", () => {
    // 16 cm lamp, object 50 cm away: two lamps leave a lit gap, a continuous lamp does not.
    expect(penumbra(16, 50).gap).toBe(4);
    const continuous = penumbra(16, 50, true);
    expect(continuous).toMatchObject({ core: 0, gap: 0, total: 28 });
    // The 6 cm object hides the middle 12 cm of the lamp from the centre of the screen.
    expect(continuous.centreShade).toBeCloseTo(0.75);
    expect(blockedShare(16, 50, 0)).toBeCloseTo(0.75);
    expect(blockedShare(8, 50, 0)).toBe(1);
    expect(blockedShare(16, 50, 14)).toBeCloseTo(0);
    for (const d of [2, 8, 16, 20])
      for (const a of [20, 30, 50, 80]) {
        const r = penumbra(d, a, true);
        expect(r.gap).toBe(0);
        expect(r.core + 2 * r.half).toBeCloseTo(r.total);
        // Inside the core every point of the lamp is hidden; inside the shadow some are.
        if (r.core > 0) expect(blockedShare(d, a, r.core / 2 - 0.01)).toBeCloseTo(1, 2);
        for (let y = -r.total / 2 + 0.05; y < r.total / 2; y += 0.5)
          expect(blockedShare(d, a, y)).toBeGreaterThan(0);
        expect(blockedShare(d, a, r.total / 2 + 0.1)).toBe(0);
      }
  });
  it("follows the Moon through its phases", () => {
    expect(moonPhase(0)).toMatchObject({ lit: 0, name: "Neumond", waxing: false });
    expect(moonPhase(90).lit).toBeCloseTo(0.5);
    expect(moonPhase(90)).toMatchObject({ name: "zunehmender Halbmond", waxing: true });
    expect(moonPhase(180)).toMatchObject({ lit: 1, name: "Vollmond" });
    expect(moonPhase(270)).toMatchObject({ name: "abnehmender Halbmond", waxing: false });
    expect(moonPhase(180).days).toBeCloseTo(14.75);
    for (let t = 0; t < 360; t += 45) expect(moonPhase(t).name).not.toBe("");
  });
  it("needs new moon for a solar and full moon for a lunar eclipse near the plane", () => {
    expect(eclipse(0, 0).kind).toBe("totale Sonnenfinsternis");
    expect(eclipse(0, 3).kind).toBe("keine Finsternis");
    expect(eclipse(1, 0).kind).toBe("totale Mondfinsternis");
    expect(eclipse(1, -1.5).kind).toBe("partielle Mondfinsternis");
    expect(eclipse(1, 2).kind).toBe("Halbschattenfinsternis");
    expect(eclipse(1, -2.5)).toEqual(eclipse(1, 2.5));
  });
  it("compares recognition distances with the stopping distance", () => {
    expect(STOPPING_50).toBe(28);
    expect(visibility(0, 25)).toEqual({ range: 25, seen: true, inTime: false });
    expect(visibility(0, 60).seen).toBe(false);
    expect(visibility(1, 40)).toMatchObject({ range: 40, inTime: true });
    expect(visibility(2, 120)).toMatchObject({ range: 140, seen: true, inTime: true });
  });
  it("balances protons and electrons", () => {
    expect(atomCharge(2, 3)).toMatchObject({ protons: 3, charge: 0, state: "elektrisch neutral" });
    expect(atomCharge(2, 2)).toMatchObject({ charge: 1, state: "positiv geladen" });
    expect(atomCharge(4, 10)).toMatchObject({ charge: -2, state: "negativ geladen" });
  });
  it("separates equal and opposite charges by rubbing", () => {
    for (const pair of [0, 1, 2])
      for (let rubs = 0; rubs <= 10; rubs++) {
        const r = rubbing(pair, rubs, 0);
        expect(r.body + r.cloth).toBe(0);
      }
    expect(rubbing(0, 6, 0).body).toBeLessThan(0);
    expect(rubbing(1, 6, 0).body).toBeLessThan(0);
    expect(rubbing(2, 6, 0).body).toBeGreaterThan(0);
    expect(rubbing(0, 6, 0).effect).toBe("Anziehung");
    expect(rubbing(0, 6, 1).effect).toBe("Abstoßung");
    expect(rubbing(0, 0, 1).effect).toBe("keine Wirkung");
  });
  it("lets current flow only through a closed circuit of conductors", () => {
    expect(circuit(0, 0).flowing).toBe(false);
    expect(circuit(1, 0).flowing).toBe(true);
    expect(circuit(1, 2).flowing).toBe(true);
    expect(circuit(1, 4).flowing).toBe(false);
    expect(circuit(1, 5).flowing).toBe(false);
  });
  it("strengthens the coil with windings and core and swaps poles on reversal", () => {
    expect(coil(0, 0, 400, 1)).toEqual({ magnetic: false, rightPole: "kein Pol", nails: 0 });
    expect(coil(1, 0, 200, 0).rightPole).toBe("Nordpol");
    expect(coil(1, 1, 200, 0).rightPole).toBe("Südpol");
    expect(coil(1, 0, 400, 0).nails).toBeGreaterThan(coil(1, 0, 100, 0).nails);
    expect(coil(1, 0, 200, 1).nails).toBeGreaterThan(coil(1, 0, 200, 0).nails);
  });
  it("switches the lamp as UND, ODER and Wechselschaltung", () => {
    const table = (type: number) => [0, 1].flatMap((a) => [0, 1].map((b) => switching(type, a, b)));
    expect(table(0)).toEqual([false, false, false, true]);
    expect(table(1)).toEqual([false, true, true, true]);
    expect(table(2)).toEqual([true, false, false, true]);
    // In a Wechselschaltung every single flip changes the lamp.
    for (const a of [0, 1])
      for (const b of [0, 1]) {
        expect(switching(2, 1 - a, b)).toBe(!switching(2, a, b));
        expect(switching(2, a, 1 - b)).toBe(!switching(2, a, b));
      }
  });
});

describe("model controls and comparisons", () => {
  it("allows only valid controls", () => {
    const s = applyScenario("dichte", initialModelState(), "gold10");
    expect(modelValues("dichte", s)).toEqual({ material: 6, V: 10 });
    expect(setModelValue("dichte", s, "unknown", 2)).toBe(s);
    expect(setModelValue("dichte", s, "V", Number.NaN)).toBe(s);
    expect(setModelValue("dichte", s, "V", 61)).toBe(s);
    expect(setModelValue("dichte", s, "V", 2.5)).toBe(s);
    const moved = setModelValue("dichte", s, "V", 30);
    expect(moved.selected).toBe("");
    expect(modelValues("dichte", moved)).toEqual({ material: 6, V: 30 });
    expect(recordExploration("dichte", ["alu1", "unknown"], "alu1")).toEqual(["alu1"]);
    expect(modelReady("dichte", ["alu1"])).toBe(false);
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

/** Independently calculated answers for a = 4, b = 3, c = 2. */
const oracle: Record<CalculationKind, [number, number]> = {
  // Copper: 176 g in 20 cm³; a copper plate of 4 dm³.
  dichte: [8.8, 35.2],
  // Copper: 61,6 g raise the water from 50 to 57 ml; a stone of 2,7 g/cm³.
  differenz: [8.8, 2700],
  // CFK part of 100 cm³; steel part of 150 cm³ replaced by CFK: 1170 g − 225 g.
  bauteil: [150, 945],
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
        expect(makeExercise(kind, exampleRng(), level).answer).toBeCloseTo(oracle[kind][level - 1], 9);
      });
  it("sweeps 80 seeded tasks per level, accepts German rounding and rejects unrelated numbers", () => {
    for (const kind of Object.keys(oracle) as CalculationKind[])
      for (const level of [1, 2] as Level[]) {
        const prompts = new Set<string>();
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          prompts.add(task.prompt);
          expect(Number.isFinite(task.answer)).toBe(true);
          expect(task.answer).toBeGreaterThan(0);
          expect(task.prompt.length).toBeGreaterThan(60);
          expect(task.formulaHint?.length).toBeGreaterThan(3);
          expect(task.solutionHtml.length).toBeGreaterThan(15);
          expect(task.unit.length).toBeGreaterThan(0);
          const rounded = task.answer.toFixed(task.digits);
          expect(checkAnswer(task, rounded.replace(".", ",")).status).toBe("correct");
          expect(checkAnswer(task, rounded).status).toBe("correct");
          expect(checkAnswer(task, String(task.answer + Math.max(1, Math.abs(task.answer)) * 10)).status).toBe("wrong");
          expect(checkAnswer(task, "").status).toBe("invalid");
        }
        expect(prompts.size).toBeGreaterThanOrEqual(4);
      }
    expect(parseNumberCandidates("1.234,5 g")).toEqual([1234.5]);
    expect(parseNumberCandidates("8,8 g/cm³")).toEqual([8.8]);
  });
  it("changes the task with the level and keeps the values plausible", () => {
    const densities = [...METALS, ...LIGHT].map((m) => m.rho);
    for (const kind of Object.keys(oracle) as CalculationKind[])
      for (let seed = 1; seed <= 80; seed++) {
        const one = makeExercise(kind, createRng(seed), 1),
          two = makeExercise(kind, createRng(seed), 2);
        expect(one.prompt).not.toBe(two.prompt);
        expect(one.formulaHint).not.toBe(two.formulaHint);
      }
    for (let seed = 1; seed <= 80; seed++) {
      // A measured density lies within 2 % of a real material.
      for (const kind of ["dichte", "differenz"] as const) {
        const rho = makeExercise(kind, createRng(seed), 1).answer;
        expect(densities.some((d) => Math.abs(rho / d - 1) < 0.02), `${kind} ${rho}`).toBe(true);
      }
      // Stones have densities of 2,5 to 2,9 g/cm³; plates stay below 100 kg.
      const stone = makeExercise("differenz", createRng(seed), 2).answer;
      expect(stone).toBeGreaterThanOrEqual(2450);
      expect(stone).toBeLessThanOrEqual(2950);
      expect(makeExercise("dichte", createRng(seed), 2).answer).toBeLessThan(100);
      // Saving mass is less than the steel part itself.
      const saving = makeExercise("bauteil", createRng(seed), 2);
      expect(saving.answer).toBeGreaterThan(0);
      expect(saving.prompt).toMatch(/Masse [\d.,]+ g/);
    }
  });
});
