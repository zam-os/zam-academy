import { describe, expect, it } from "vitest";
import { LABS, freshLab, renderLab, trackedGoals } from "../src/labs/index";
import {
  applyControl,
  fmtDe,
  type LabState,
  type LabValue,
} from "../src/labs/core";
import { CELL_PARTS, microscopeView, nachweisResult } from "../src/labs/methoden";
import {
  ACTIVITY,
  cubeSurface,
  cyclePhase,
  energy,
  reactionTime,
  cubePieces,
  reactionWay,
} from "../src/labs/mensch";
import { ernaehrungspyramide } from "../src/figures/scenes-mensch";
import { pollenschlauch, vergleichMenschPflanze } from "../src/figures/scenes-pflanzen";
import { FLOWERS, KEY, PLANTS, keyPosition, meadowModel } from "../src/labs/pflanzen";
import { LESSONS } from "../src/curriculum";
import type { LabKind } from "../src/model/types";

const KINDS = Object.keys(LABS) as LabKind[];
type Step = [string, LabValue];

/** Applies steps through the same `set` path the DOM uses. */
function run(kind: LabKind, steps: Step[]): LabState {
  const state = freshLab(kind);
  for (const [key, value] of steps) applyControl(LABS[kind], state, key, value);
  return state;
}

function clean(html: string): void {
  expect(html).toContain("<svg");
  expect(html).toContain('role="img"');
  expect(html).not.toMatch(/\b(NaN|undefined|Infinity)\b/);
}

/** One witness per goal: the steps that reach exactly that goal. */
const WITNESSES: Record<LabKind, [Step[], Step[], Step[]]> = {
  fairTest: [
    [["tempB", "35"], ["sugarB", "1"]],
    [["control", true]],
    [["repeats", 3]],
  ],
  nachweis: [
    [["sample", "kartoffel"], ["test", "iod"]],
    [["sample", "walnuss"], ["test", "fettfleck"]],
    [["test", "kalkwasser"], ["sample", "ausatemluft"], ["sample", "raumluft"]],
  ],
  microscope: [
    [["focus", 40]],
    [["focus", 40], ["objective", "10"], ["focus", 48]],
    [["objective", "40"], ["focus", 52], ["light", 70]],
  ],
  cell: [
    [["celltype", "pflanze"], ["part", "wand"], ["part", "chloroplast"], ["part", "vakuole"]],
    [["celltype", "tier"], ["part", "kern"]],
    [["celltype", "tier"], ["part", "membran"], ["celltype", "pflanze"], ["part", "membran"]],
  ],
  reaction: [
    [["cm", 15]],
    [["cm", 45]],
    [["speed", "25"], ["cm", 42]],
  ],
  armLever: [
    [["armAngle", 50]],
    [["armAngle", 160]],
    [["showTendons", true]],
  ],
  foodEnergy: [
    [["kh", 60]],
    [["kh", 0], ["eiweiss", 0], ["fett", 10]],
    [["kh", 60], ["fett", 10], ["eiweiss", 20]],
  ],
  surface: [
    [["n", "2"]],
    [["n", "4"]],
    [["example", "zotten"], ["example", "lunge"]],
  ],
  activity: [
    [["level", "rennen"]],
    [["level", "ruhe"], ["level", "treppe"]],
    [["level", "rennen"], ["level", "erholung"]],
  ],
  cycle: [
    [["day", 14]],
    [["day", 3]],
    [["fertilized", true], ["day", 22]],
  ],
  flower: [
    [["step", "2"]],
    [["step", "3"]],
    [["step", "3"], ["cut", true]],
  ],
  flowerDiagram: [
    [["target", "kirsche"], ["k", "5"], ["c", "5"], ["a", "viele"], ["g", "1"]],
    [["target", "raps"], ["k", "4"], ["c", "4"], ["a", "6"], ["g", "2"]],
    [["target", "salbei"], ["k", "5"], ["c", "5"], ["a", "2"], ["g", "2"]],
  ],
  key: [
    [["plant", "loewenzahn"], ["answer", "j"], ["answer", "j"], ["answer", "j"]],
    [["plant", "salbei"], ["answer", "j"], ["answer", "n"], ["answer", "j"]],
    [
      ["answer", "j"], ["answer", "n"], ["answer", "n"], ["answer", "j"],
      ["plant", "spitzwegerich"], ["answer", "n"],
      ["plant", "margerite"], ["answer", "j"], ["answer", "j"], ["answer", "n"],
    ],
  ],
  meadow: [
    [["cuts", 5], ["dung", "1"]],
    [["dung", "0"], ["cuts", 2]],
    [["dung", "0"], ["cuts", 3]],
  ],
};

describe("lab registry", () => {
  it("lists 14 labs and every lesson lab exists", () => {
    expect(KINDS).toHaveLength(14);
    for (const lesson of LESSONS) if (lesson.lab) expect(KINDS).toContain(lesson.lab);
    expect(new Set(LESSONS.filter((l) => l.lab).map((l) => l.lab)).size).toBe(14);
  });

  it("formats German numbers with decimal comma and real minus sign", () => {
    expect(fmtDe(23.5, 1)).toBe("23,5");
    expect(fmtDe(-10, 0)).toBe("−10");
    expect(fmtDe(-0, 0)).toBe("0");
    expect(fmtDe(1250)).toBe("1.250");
  });

  it.each(KINDS)("%s starts with three goals, none reached", (kind) => {
    const goals = LABS[kind].goals(freshLab(kind));
    expect(goals).toHaveLength(3);
    expect(goals.filter((goal) => goal.met)).toEqual([]);
    clean(renderLab(kind, freshLab(kind)));
  });

  it.each(KINDS)("%s: each goal has a witness that reaches it", (kind) => {
    WITNESSES[kind].forEach((steps, index) => {
      const state = run(kind, steps);
      expect(LABS[kind].goals(state)[index].met, `${kind} goal ${index + 1}`).toBe(true);
      clean(LABS[kind].draw(state));
      expect(LABS[kind].readout(state)).not.toMatch(/\b(NaN|undefined)\b/);
    });
  });

  it.each(KINDS)("%s renders finite drawings over a grid of control settings", (kind) => {
    const def = LABS[kind];
    const base = freshLab(kind);
    for (const control of def.controls(base)) {
      const values: LabValue[] =
        control.type === "range"
          ? Array.from({ length: 6 }, (_, i) => control.min + ((control.max - control.min) * i) / 5).map((v) => Math.round(v / control.step) * control.step)
          : control.type === "toggle"
            ? [true, false]
            : control.options.map((option) => option.value);
      for (const value of values) {
        const state = { ...base };
        applyControl(def, state, control.key, value);
        clean(def.draw(state));
        expect(def.readout(state).length).toBeGreaterThan(20);
      }
    }
  });
});

describe("goals stay reached", () => {
  it.each(KINDS)("%s reaches 3 of 3 when all witnesses run one after another", (kind) => {
    const state = freshLab(kind);
    for (const steps of WITNESSES[kind])
      for (const [key, value] of steps) {
        applyControl(LABS[kind], state, key, value);
        trackedGoals(LABS[kind], state);
      }
    expect(trackedGoals(LABS[kind], state).every((goal) => goal.met)).toBe(true);
  });
});

describe("lab models are correct", () => {
  it("computes ruler fall time and reaction distance exactly", () => {
    expect(reactionTime(20)).toBeCloseTo(0.2019, 4);
    expect(reactionTime(45)).toBeGreaterThan(0.3);
    expect(reactionWay(20, 15)).toBeCloseTo(0.841, 3);
    expect(reactionWay(40, 25)).toBeLessThan(2);
    expect(reactionWay(41, 25)).toBeGreaterThan(2);
  });

  it("keeps the clay cube volume and multiplies the surface", () => {
    expect([1, 2, 3, 4].map(cubeSurface)).toEqual([96, 192, 288, 384]);
  });

  it("draws all n³ pieces of the cut cube, as the label says", () => {
    for (const n of [1, 2, 3, 4]) {
      expect(cubePieces(n)).toHaveLength(n ** 3);
      const html = LABS.surface.draw({ ...freshLab("surface"), n: String(n) });
      expect(html.match(/data-piece/g)).toHaveLength(n ** 3);
      expect(html).toContain(`${n ** 3} Würfel`);
    }
  });

  it("draws the nutrition pyramid with the drinks base widest and the sweets tip narrowest", () => {
    const tiers = [...ernaehrungspyramide().matchAll(/<path d="M([\d.]+) [\d.]+ L([\d.]+) [\d.]+ L([\d.]+) [\d.]+ L([\d.]+) [\d.]+ Z"/g)].map(
      ([, bl, br, tr, tl]) => ({ bottom: Number(br) - Number(bl), top: Number(tr) - Number(tl) }),
    );
    expect(tiers).toHaveLength(6);
    for (const [i, tier] of tiers.entries()) {
      expect(tier.top).toBeGreaterThan(0);
      expect(tier.bottom).toBeGreaterThan(tier.top);
      if (i > 0) expect(tier.top).toBe(tiers[i - 1].bottom);
    }
  });

  it("keeps pollen grains and male germ cells apart", () => {
    expect(vergleichMenschPflanze()).not.toMatch(/Keimzellen: Pollen /);
    expect(vergleichMenschPflanze()).toContain("Keimzellen: männliche Keimzelle und Eizelle");
    expect(pollenschlauch()).toContain("männliche Keimzelle");
  });

  it("uses 17 and 37 kJ per gram", () => {
    expect(energy({ kh: 20, fett: 5, eiweiss: 3 }).total).toBe(576);
    expect(energy({ kh: 0, fett: 10, eiweiss: 0 }).total).toBe(370);
  });

  it("gives each detection test only its own positive result", () => {
    expect(nachweisResult("kartoffel", "iod").positive).toBe(true);
    expect(nachweisResult("traubenzucker", "iod").positive).toBe(false);
    expect(nachweisResult("oel", "fettfleck").positive).toBe(true);
    expect(nachweisResult("kartoffel", "fettfleck").positive).toBe(false);
    expect(nachweisResult("ausatemluft", "kalkwasser").positive).toBe(true);
    expect(nachweisResult("raumluft", "kalkwasser").positive).toBe(false);
    expect(nachweisResult("kartoffel", "kalkwasser").positive).toBe(false);
  });

  it("computes total magnification as eyepiece times objective", () => {
    expect(microscopeView({ objective: "4", focus: 40, light: 30 }).total).toBe(40);
    expect(microscopeView({ objective: "40", focus: 52, light: 30 }).brightEnough).toBe(false);
  });

  it("marks exactly cell wall, chloroplasts and vacuole as plant-only", () => {
    expect(Object.entries(CELL_PARTS).filter(([, p]) => p.plantOnly).map(([k]) => k).sort()).toEqual(["chloroplast", "vakuole", "wand"]);
  });

  it("keeps example activity values plausible and rising with effort", () => {
    const order = ["ruhe", "gehen", "treppe", "rennen"].map((k) => ACTIVITY[k]);
    for (let i = 1; i < order.length; i++) {
      expect(order[i].pulse).toBeGreaterThan(order[i - 1].pulse);
      expect(order[i].breath).toBeGreaterThan(order[i - 1].breath);
    }
    expect(ACTIVITY.erholung.pulse).toBeLessThan(ACTIVITY.rennen.pulse);
  });

  it("describes the simplified cycle without hormones", () => {
    expect(cyclePhase(3, false)).toMatch(/Menstruation/);
    expect(cyclePhase(14, false)).toMatch(/Eisprung/);
    expect(cyclePhase(22, true)).toMatch(/eingenistet/);
    for (let day = 1; day <= 28; day++) expect(cyclePhase(day, false)).not.toMatch(/Hormon|Östrogen|Progesteron/);
  });

  it("uses the botanical flower formulas", () => {
    expect(FLOWERS.kirsche).toMatchObject({ k: "5", c: "5", a: "viele", g: "1" });
    expect(FLOWERS.raps).toMatchObject({ k: "4", c: "4", a: "6", g: "2" });
    expect(FLOWERS.salbei).toMatchObject({ k: "5", c: "5", a: "2", g: "2" });
  });

  it("leads every plant through the key to itself with the matching answers", () => {
    const answers: Record<string, string> = {
      spitzwegerich: "n",
      loewenzahn: "jjj",
      margerite: "jjn",
      salbei: "jnj",
      klee: "jnnj",
      hahnenfuss: "jnnn",
    };
    for (const plant of Object.keys(PLANTS)) expect(keyPosition(answers[plant])).toBe(plant);
    const leaves = new Set(Object.values(KEY).flatMap((node) => [node.ja, node.nein]).filter((id) => !KEY[id]));
    expect([...leaves].sort()).toEqual(Object.keys(PLANTS).sort());
  });

  it("models a trade-off between fodder and species in the meadow", () => {
    expect(meadowModel(5, 2).fodder).toBeGreaterThan(meadowModel(1, 0).fodder);
    expect(meadowModel(1, 0).species).toBeGreaterThan(meadowModel(5, 2).species);
    for (let cuts = 1; cuts <= 5; cuts++)
      for (let dung = 0; dung <= 2; dung++) {
        const m = meadowModel(cuts, dung);
        expect(m.fodder).toBeLessThanOrEqual(100);
        expect(m.species).toBeGreaterThanOrEqual(5);
      }
  });
});
