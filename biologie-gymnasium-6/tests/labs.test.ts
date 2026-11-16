import { describe, expect, it } from "vitest";
import { LABS, freshLab, renderLab, trackedGoals } from "../src/labs/index";
import {
  applyControl,
  fmtDe,
  type LabState,
  type LabValue,
} from "../src/labs/core";
import { microscopeView } from "../src/labs/methoden";
import {
  FRUITS,
  bendAngle,
  bubbles,
  dispersalDistance,
  germination,
} from "../src/labs/pflanzen";
import {
  ANIMALS,
  CLASS_NAMES,
  POND,
  SHAPES,
  STAGES_FROG,
  VKEY,
  echoTime,
  frogStage,
  resistance,
  thermo,
  vkeyPosition,
  webEffects,
} from "../src/labs/tiere";
import { photosyntheseTeilchen } from "../src/figures/scenes-pflanzen";
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
  microscope: [
    [["focus", 40]],
    [["focus", 40], ["objective", "10"], ["focus", 48]],
    [["objective", "40"], ["focus", 52], ["light", 70]],
  ],
  dispersal: [
    [["wind", 3]],
    [["fruit", "klette"], ["animal", "fell"]],
    [["fruit", "kirsche"], ["animal", "vogel"]],
  ],
  germination: [
    [["water", "trocken"]],
    [["water", "unter"]],
    [["water", "feucht"], ["light", "dunkel"]],
  ],
  waterweed: [
    [["lamp", false]],
    [["lamp", true], ["distance", 10], ["co2", true]],
    [["distance", 10], ["distance", 50]],
  ],
  phototropism: [
    [["light", "links"], ["hours", 16]],
    [["light", "rechts"], ["cap", true], ["hours", 24]],
    [["light", "dunkel"], ["hours", 24]],
  ],
  streamline: [
    [["shape", "spindel"]],
    [["shape", "spindel"], ["shape", "kugel"], ["shape", "wuerfel"], ["shape", "platte"]],
    [["speed", 1], ["speed", 5]],
  ],
  thermo: [
    [["outside", 5]],
    [["outside", 25]],
    [["animal", "maus"], ["outside", 0]],
  ],
  metamorphosis: [
    [["week", 1]],
    [["week", 6]],
    [["week", 12]],
  ],
  echolocation: [
    [["distance", 1]],
    [["distance", 8]],
    [["night", true]],
  ],
  vertebrateKey: [
    [["answer", "j"]],
    [
      ["animal", "blindschleiche"], ["answer", "n"], ["answer", "n"], ["answer", "n"], ["answer", "j"],
      ["animal", "feuersalamander"], ["answer", "n"], ["answer", "n"], ["answer", "n"], ["answer", "n"],
    ],
    [
      ["answer", "j"],
      ["animal", "pinguin"], ["answer", "n"], ["answer", "j"],
      ["animal", "seepferdchen"], ["answer", "n"], ["answer", "n"], ["answer", "j"],
      ["animal", "fledermaus"], ["answer", "j"],
    ],
  ],
  foodWeb: [
    [["wasserfloh", false]],
    [["hecht", false]],
    [["algen", false], ["pflanzen", false]],
  ],
};

describe("lab registry", () => {
  it("lists 12 labs and every lab is used by exactly one lesson", () => {
    expect(KINDS).toHaveLength(12);
    const used = LESSONS.filter((l) => l.lab).map((l) => l.lab);
    for (const lab of used) expect(KINDS).toContain(lab);
    expect(new Set(used).size).toBe(12);
    expect(used).toHaveLength(12);
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
        const text = def.readout(state);
        expect(text.length).toBeGreaterThan(20);
        expect(text).not.toMatch(/\d\.\d/);
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
  it("computes total magnification as eyepiece times objective", () => {
    expect(microscopeView({ objective: "4", focus: 40, light: 30 }).total).toBe(40);
    expect(microscopeView({ objective: "40", focus: 52, light: 30 }).brightEnough).toBe(false);
  });

  it("sends wind fruits with the wind and animal fruits only with their own animal", () => {
    expect(dispersalDistance({ fruit: "ahorn", wind: 0, animal: "keins" })).toBe(0);
    expect(dispersalDistance({ fruit: "ahorn", wind: 3, animal: "keins" })).toBe(3);
    expect(dispersalDistance({ fruit: "klette", wind: 3, animal: "keins" })).toBe(0);
    expect(dispersalDistance({ fruit: "klette", wind: 0, animal: "vogel" })).toBe(0);
    expect(dispersalDistance({ fruit: "kirsche", wind: 0, animal: "vogel" })).toBe(3);
    expect(Object.values(FRUITS).map((f) => f.agent).sort()).toEqual(["fell", "vogel", "wind", "wind"]);
  });

  it("needs water, oxygen and warmth for germination, but not light", () => {
    expect(germination("feucht", "hell", "20").germinated).toBe(18);
    expect(germination("trocken", "hell", "20").germinated).toBe(0);
    expect(germination("unter", "hell", "20").germinated).toBe(0);
    expect(germination("feucht", "hell", "4").germinated).toBe(0);
    const dark = germination("feucht", "dunkel", "20");
    expect(dark.germinated).toBe(18);
    expect(dark.pale).toBe(true);
  });

  it("gives fewer bubbles the farther the lamp and none without light", () => {
    const series = [10, 20, 30, 40, 50].map((d) => bubbles(true, d, true));
    expect(series).toEqual([24, 15, 9, 6, 4]);
    for (let i = 1; i < series.length; i++) expect(series[i]).toBeLessThan(series[i - 1]);
    expect(bubbles(false, 10, true)).toBe(0);
    expect(bubbles(true, 10, false)).toBeLessThan(bubbles(true, 10, true));
  });

  it("bends towards the side light, never with a covered tip", () => {
    expect(bendAngle({ light: "links", cap: false, hours: 24 })).toBe(-45);
    expect(bendAngle({ light: "rechts", cap: false, hours: 10 })).toBe(20);
    expect(bendAngle({ light: "rechts", cap: true, hours: 24 })).toBe(0);
    expect(bendAngle({ light: "oben", cap: false, hours: 24 })).toBe(0);
  });

  it("ranks the body shapes by water resistance and grows it with the square of speed", () => {
    expect(resistance("spindel", 3)).toBeLessThan(resistance("kugel", 3));
    expect(resistance("kugel", 3)).toBeLessThan(resistance("wuerfel", 3));
    expect(resistance("wuerfel", 3)).toBeLessThan(resistance("platte", 3));
    expect(resistance("kugel", 4)).toBeCloseTo(4 * resistance("kugel", 2), 10);
    expect(Object.keys(SHAPES)).toHaveLength(4);
  });

  it("lets the lizard follow the outside temperature and keeps the mouse at 37 °C", () => {
    for (const t of [0, 10, 20, 30]) {
      expect(thermo("eidechse", t).body).toBe(t);
      expect(thermo("maus", t).body).toBe(37);
    }
    expect(thermo("eidechse", 5).activity).toMatch(/Kältestarre/);
    expect(thermo("maus", 0).demand).toBeGreaterThan(thermo("maus", 30).demand);
    expect(thermo("eidechse", 25).demand).toBeLessThan(thermo("maus", 25).demand);
  });

  it("orders the frog stages with hind legs before front legs and ends on land", () => {
    const names = STAGES_FROG.map((s) => s.name);
    expect(names.indexOf("Hinterbeine")).toBeLessThan(names.indexOf("Vorderbeine und Lunge"));
    expect(frogStage(0).name).toBe("Laichballen");
    expect(frogStage(12).name).toBe("Jungfrosch");
    for (let i = 1; i < STAGES_FROG.length; i++) expect(STAGES_FROG[i].from).toBeGreaterThan(STAGES_FROG[i - 1].from);
  });

  it("computes echo times for there and back at 340 m per second", () => {
    expect(echoTime(1)).toBeCloseTo(5.88, 2);
    expect(echoTime(5)).toBeCloseTo(29.41, 2);
    expect(echoTime(10)).toBeCloseTo(2 * echoTime(5), 10);
  });

  it("leads every animal through the key to its own class", () => {
    const answers: Record<string, string> = {
      delfin: "j",
      fledermaus: "j",
      pinguin: "nj",
      seepferdchen: "nnj",
      blindschleiche: "nnnj",
      feuersalamander: "nnnn",
    };
    for (const [animal, a] of Object.entries(ANIMALS)) expect(vkeyPosition(answers[animal])).toBe(a.klasse);
    const leaves = new Set(Object.values(VKEY).flatMap((node) => [node.ja, node.nein]).filter((id) => !VKEY[id]));
    expect([...leaves].sort()).toEqual(Object.keys(CLASS_NAMES).sort());
  });

  it("passes the loss of a species along the food web", () => {
    const all = Object.fromEntries(Object.keys(POND).map((k) => [k, true]));
    expect(webEffects(all)).toEqual({ lostFood: [], starving: [], fewerEnemies: [] });
    const noFlea = webEffects({ ...all, wasserfloh: false });
    expect(noFlea.starving).toEqual(["libellenlarve"]);
    expect(noFlea.lostFood.sort()).toEqual(["libellenlarve", "rotauge"]);
    expect(noFlea.fewerEnemies).toEqual(["algen"]);
    expect(webEffects({ ...all, hecht: false }).fewerEnemies).toEqual(["rotauge"]);
    const noProducers = webEffects({ ...all, algen: false, pflanzen: false });
    expect(noProducers.starving.sort()).toEqual(["graureiher", "hecht", "libellenlarve", "rotauge", "wasserfloh"]);
  });

  it("keeps every building block in the particle model of photosynthesis", () => {
    const svg = photosyntheseTeilchen();
    expect(svg).toContain("je 6 C, 12 H und 18 O");
    // 6 CO2 + 6 H2O on the left, 1 glucose (C6H12O6) + 6 O2 on the right.
    const left = { C: 6, O: 6 * 2 + 6, H: 6 * 2 };
    const right = { C: 6, O: 6 + 6 * 2, H: 12 };
    expect(left).toEqual(right);
    const balls = (fill: string) => svg.split(`fill="${fill}"`).length - 1;
    expect(balls("#37474f")).toBe(6 + 6 + 1);
    expect(balls("var(--f-white)")).toBe(12 + 12 + 1);
  });
});
