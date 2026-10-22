import { describe, expect, it } from "vitest";
import { findLessonById } from "../src/curriculum";
import { boxTable, STAGE_RAUMGEOMETRIE } from "../src/curriculum/stage-6-raumgeometrie";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import { clampParam, computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import {
  axialArea,
  axialPerimeter,
  axialSlant,
  cavalieri,
  compositeSolid,
  extremumAt,
  extremumBest,
  solidNet,
} from "../src/lab/views-raumgeometrie";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabValues, NumberField } from "../src/model/types";

const PI = Math.PI;
const IDS = ["rg-1-axialschnitt", "rg-2-oberflaeche", "rg-3-volumen", "rg-4-zusammengesetzt", "rg-5-extremwerte"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-6:${i}`));

function lesson(id: string) {
  const found = findLessonById(id);
  if (!found) throw new Error(id);
  return found.lesson;
}

/** Every task a generator makes on one level, with its drawn values. */
function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): Array<{ task: ExerciseTask; m: Record<string, number> }> {
  const generator = lesson(lessonId).exercises.find((exercise) => exercise.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => {
    const task = generator.make(createRng(seed), level);
    expect(task.meta, `${lessonId}/${generatorId} L${level} has meta`).toBeDefined();
    return { task, m: task.meta ?? {} };
  });
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index] as NumberField;
  expect(field.kind).toBe("number");
  return field.answer;
}

function choice(task: ExerciseTask, index: number): number {
  const field = task.fields[index] as ChoiceField;
  expect(field.kind).toBe("choice");
  return field.correctIndex;
}

/** Relative closeness for recomputed answers. */
function close(actual: number, expected: number, where: string) {
  expect(Math.abs(actual - expected), `${where}: ${actual} vs ${expected}`).toBeLessThanOrEqual(1e-9 * Math.max(1, Math.abs(expected)));
}

/** Area of a polygon (shoelace), for checking the Axialschnitt independently. */
function shoelace(points: Array<[number, number]>): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

describe("Etappe 6: Raumgeometrie (LehrplanPLUS M10 LB 2, nur Zweig II/III)", () => {
  it("has the five lessons in order, all for Zweig II/III in Lernbereich 2", () => {
    expect(STAGE_RAUMGEOMETRIE.id).toBe("stage-6-raumgeometrie");
    expect(STAGE_RAUMGEOMETRIE.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_RAUMGEOMETRIE.lessons.forEach((l, i) => {
      expect(l.stageId).toBe("stage-6-raumgeometrie");
      expect(l.stepNumber).toBe(i + 1);
      expect(l.title.startsWith(`6.${i + 1} `)).toBe(true);
      expect(l.tracks).toEqual(["II_III"]);
      expect(l.lehrplan.startsWith("M10 LB 2 (II/III): Raumgeometrie")).toBe(true);
      expect(l.formulas.length).toBeGreaterThanOrEqual(1);
      expect(l.formulas.length).toBeLessThanOrEqual(3);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
      expect(l.requiredCorrect).toBe(3);
      expect(l.explanationHtml).toContain('class="example"');
      expect(l.explanationHtml).toContain('class="merke"');
      // A real minus sign everywhere a learner reads.
      const texts = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, ...l.formulas.map((f) => f.html), ...l.lab.goals.map((g) => g.text)];
      for (const text of texts) expect(text.replace(/<[^>]+>/g, " "), l.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
    });
  });

  it("keeps every lab param on its slider grid at the start and labels decimals", () => {
    for (const id of IDS) {
      for (const param of lesson(id).lab.params) {
        if (param.type !== "range") continue;
        const decimals = Math.max(0, -Math.floor(Math.log10(param.step) + 1e-9));
        expect(param.digits ?? 0, `${id}.${param.key} shows its step`).toBe(decimals);
        expect([1, 0.5, 0.1, 5]).toContain(param.step);
      }
    }
  });
});

describe("6.1 Rotationskörper und Axialschnitte", () => {
  it("computes the Axialschnitt as the figure and its mirror image", () => {
    const lab = lesson("rg-1-axialschnitt").lab;
    for (const v of enumerateLabGrid(lab, 4)) {
      const { r, h, r2, k } = v;
      const figure: Record<number, Array<[number, number]>> = {
        0: [[0, 0], [r, 0], [r, h], [0, h]],
        1: [[0, 0], [r, 0], [0, h]],
        3: [[0, 0], [r, 0], [r2, h], [0, h]],
        4: [[0, 0], [r, 0], [r, h], [0, h + k]],
      };
      const area = v.shape === 2 ? PI * r * r : 2 * shoelace(figure[v.shape]);
      close(axialArea(v), area, `A ${JSON.stringify(v)}`);
      const slant = { 0: h, 1: Math.hypot(r, h), 2: null, 3: Math.hypot(r - r2, h), 4: Math.hypot(r, k) }[v.shape];
      expect(axialSlant(v)).toBe(slant);
      const perimeter = { 0: 2 * (2 * r) + 2 * h, 1: 2 * r + 2 * Math.hypot(r, h), 2: 2 * PI * r, 3: 2 * r + 2 * r2 + 2 * Math.hypot(r - r2, h), 4: 2 * r + 2 * h + 2 * Math.hypot(r, k) }[v.shape]!;
      close(axialPerimeter(v), perimeter, `u ${JSON.stringify(v)}`);
    }
  });

  it("states cones that exist and recomputes s, h and the Axialschnitt", () => {
    for (const { task, m } of tasks("rg-1-axialschnitt", "kegel-axialschnitt", 1)) {
      expect(task.prompt).toContain(`r = ${fmt(m.r, 1)} cm`);
      close(num(task, 0), Math.sqrt(m.r ** 2 + m.h ** 2), "s");
      close(num(task, 1), m.r * m.h, "A");
    }
    for (const { task, m } of tasks("rg-1-axialschnitt", "kegel-axialschnitt", 2)) {
      expect(m.s).toBeGreaterThan(m.r);
      close(m.u, 2 * m.r + 2 * m.s, "u");
      expect(task.prompt).toContain(`${fmt(m.u, 1)} cm`);
      const h = Math.sqrt(((m.u - 2 * m.r) / 2) ** 2 - m.r ** 2);
      close(num(task, 0), h, "h");
      close(num(task, 1), m.r * h, "A");
    }
  });

  it("names the right solid and doubles the figure", () => {
    for (const { task, m } of tasks("rg-1-axialschnitt", "figur-koerper", 1)) {
      expect(choice(task, 0)).toBe(m.kind);
      const A = [2 * m.a * m.b, m.a * m.b, PI * m.r * m.r, (m.a + m.c) * m.h][m.kind];
      close(num(task, 1), A, `kind ${m.kind}`);
      if (m.kind === 3) expect(m.a).not.toBe(m.c);
    }
    for (const { task, m } of tasks("rg-1-axialschnitt", "figur-koerper", 2)) {
      expect(m.a).not.toBe(m.b);
      expect(choice(task, 0)).toBe(0);
      const c = Math.sqrt(m.a ** 2 + m.b ** 2);
      // The radius is the altitude onto the hypotenuse: twice the area over c.
      close(num(task, 1), (2 * ((m.a * m.b) / 2)) / c, "r");
      expect(num(task, 1)).toBeLessThan(Math.min(m.a, m.b));
      close(num(task, 2), c * num(task, 1), "A = c · h_c");
    }
  });

  it("builds composite rotation bodies with a real roof", () => {
    for (const { task, m } of tasks("rg-1-axialschnitt", "zusammengesetzt", 1)) {
      close(num(task, 0), Math.hypot(m.r, m.k), "s");
      close(num(task, 1), 2 * m.r * m.h + 0.5 * 2 * m.r * m.k, "A");
    }
    for (const { task, m } of tasks("rg-1-axialschnitt", "zusammengesetzt", 2)) {
      expect(m.s).toBeGreaterThan(m.r);
      const k = Math.sqrt(m.s ** 2 - m.r ** 2);
      close(num(task, 0), k, "k");
      close(num(task, 1), m.h + k, "Turm");
    }
  });
});

describe("6.2 Netze und Oberflächen", () => {
  it("unrolls the cone into a sector with arc 2πr and area πrs", () => {
    const lab = lesson("rg-2-oberflaeche").lab;
    for (const v of enumerateLabGrid(lab, 5).filter((v) => v.solid === 3)) {
      const net = solidNet(v);
      const s = Math.hypot(v.r, v.h);
      const alpha = net.alpha ?? Number.NaN;
      close(2 * PI * s * (alpha / 360), 2 * PI * v.r, "arc");
      close(PI * s * s * (alpha / 360), net.M, "sector area");
      expect(alpha).toBeLessThan(360);
    }
    // The other solids: prism with an equilateral base, square pyramid, cylinder.
    const prism = solidNet({ solid: 0, a: 2, r: 1, h: 5, t: 0 });
    close(prism.G, Math.sqrt(3), "G prism");
    close(prism.O, 2 * Math.sqrt(3) + 30, "O prism");
    const pyramid = solidNet({ solid: 1, a: 6, r: 1, h: 4, t: 0 });
    close(pyramid.side ?? 0, 5, "h_s");
    close(pyramid.O, 36 + 60, "O pyramid");
    const cylinder = solidNet({ solid: 2, a: 1, r: 2, h: 3, t: 0 });
    close(cylinder.O, 8 * PI + 12 * PI, "O cylinder");
  });

  it("recomputes cone surfaces and the Schultüte from its sector", () => {
    for (const { task, m } of tasks("rg-2-oberflaeche", "kegel", 1)) {
      const s = Math.hypot(m.r, m.h);
      close(num(task, 0), s, "s");
      close(num(task, 1), PI * m.r * s, "M");
      close(num(task, 2), PI * m.r * m.r + PI * m.r * s, "O");
    }
    for (const { task, m } of tasks("rg-2-oberflaeche", "kegel", 2)) {
      const r = num(task, 0);
      close(2 * PI * r, 2 * PI * m.s * (m.alpha / 360), "arc = 2πr");
      close(num(task, 1), Math.sqrt(m.s ** 2 - r ** 2), "h");
      expect(task.prompt).toContain(`${m.alpha}°`);
    }
  });

  it("recomputes pyramid surfaces and the roof with its surcharge; every roof exists", () => {
    for (const { task, m } of tasks("rg-2-oberflaeche", "pyramide", 1)) {
      const hs = Math.sqrt(m.h ** 2 + (m.a / 2) ** 2);
      close(num(task, 0), hs, "h_s");
      close(num(task, 1), m.a ** 2 + 4 * 0.5 * m.a * hs, "O");
    }
    for (const { task, m } of tasks("rg-2-oberflaeche", "pyramide", 2)) {
      // The apex lies above the base: edge² > (a/2)² + (a/2)².
      expect(m.edge ** 2 - 2 * (m.a / 2) ** 2).toBeGreaterThan(0);
      const hs = Math.sqrt(m.edge ** 2 - (m.a / 2) ** 2);
      close(num(task, 0), hs, "h_s");
      close(num(task, 1), 4 * 0.5 * m.a * hs * (1 + m.p / 100), "Blech");
    }
  });

  it("recomputes prisms, cylinders and the tent", () => {
    for (const { task, m } of tasks("rg-2-oberflaeche", "saeule", 1)) {
      if (m.kind === 0) {
        close(num(task, 0), 2 * PI * m.r * m.h, "M cylinder");
        close(num(task, 1), 2 * PI * m.r ** 2 + 2 * PI * m.r * m.h, "O cylinder");
      } else {
        const u = m.a + m.b + Math.hypot(m.a, m.b);
        close(num(task, 0), u * m.h, "M prism");
        close(num(task, 1), 2 * 0.5 * m.a * m.b + u * m.h, "O prism");
      }
    }
    for (const { task, m } of tasks("rg-2-oberflaeche", "saeule", 2)) {
      const s = Math.hypot(m.b / 2, m.hd);
      close(num(task, 0), s, "s");
      close(num(task, 1), 2 * 0.5 * m.b * m.hd + 2 * s * m.L + m.b * m.L, "Stoff");
    }
  });
});

describe("6.3 Volumen und das Prinzip von Cavalieri", () => {
  it("stacks slices exactly as the readouts say and approaches the formulas", () => {
    for (const n of [4, 8, 16, 32, 64]) {
      const pyramid = cavalieri({ mode: 1, a: 3, h: 5, r: 4, shift: 2, n, z: 40 });
      let stack = 0;
      for (let i = 0; i < n; i++) stack += (3 * (1 - i / n)) ** 2 * (5 / n);
      close(pyramid.Vs, stack, `pyramid n = ${n}`);
      expect(pyramid.Vs).toBeGreaterThan(pyramid.Vf);
      const sphere = cavalieri({ mode: 2, a: 3, h: 5, r: 4, shift: 0, n, z: 40 });
      let half = 0;
      for (let i = 0; i < n; i++) half += PI * (16 - ((i / n) * 4) ** 2) * (4 / n);
      close(sphere.Vs, half, `sphere n = ${n}`);
      close(sphere.Vf, (2 / 3) * PI * 64, "⅔πr³");
    }
    // Only from 32 slices on is the stepped pyramid less than 5 % too big.
    const dev = (n: number) => {
      const c = cavalieri({ mode: 1, a: 3, h: 5, r: 4, shift: 0, n, z: 0 });
      return (c.Vs / c.Vf - 1) * 100;
    };
    expect(dev(16)).toBeGreaterThan(5);
    expect(dev(32)).toBeLessThan(5);
    expect(dev(64)).toBeLessThan(dev(32));
  });

  it("shows equal cross-sections in every height, also for the sphere and the drilled cylinder", () => {
    const lab = lesson("rg-3-volumen").lab;
    for (const v of enumerateLabGrid(lab, 4)) {
      const c = cavalieri(v);
      close(c.Ql, c.Qr, `Q ${JSON.stringify(v)}`);
      if (v.mode === 2) {
        const z = (v.z / 100) * v.r;
        close(c.Qr, PI * v.r ** 2 - PI * z ** 2, "annulus");
      }
    }
  });

  it("asks for the one sphere on the slider whose volume and surface agree", () => {
    const lab = lesson("rg-3-volumen").lab;
    const goal = lab.goals.find((g) => g.id === "kugel")!;
    const radii = enumerateLabGrid(lab, 9)
      .filter((v) => v.mode === 2)
      .filter((v) => goal.check(v, computeReadouts(lab, v)))
      .map((v) => v.r);
    expect(new Set(radii)).toEqual(new Set([3]));
  });

  it("recomputes volumes, the slanted coin stack and rearranged formulas", () => {
    for (const { task, m } of tasks("rg-3-volumen", "volumen", 1)) {
      const expected = [m.G * m.h, PI * m.r ** 2 * m.h, (m.a ** 2 * m.h) / 3, (PI * m.r ** 2 * m.h) / 3][m.kind];
      close(num(task, 0), expected, `kind ${m.kind}`);
    }
    for (const { task, m } of tasks("rg-3-volumen", "volumen", 2)) {
      close(num(task, 0), m.n * m.t, "height");
      close(num(task, 1), (PI * (m.d / 2) ** 2 * m.n * m.t) / 1000, "V in cm³");
    }
    for (const { task, m } of tasks("rg-3-volumen", "umstellen", 1)) {
      const x = num(task, 0);
      const V = [(PI * m.r ** 2 * x) / 3, (x * x * m.h) / 3, PI * x * x * m.h][m.kind];
      close(V, m.V, `kind ${m.kind}`);
    }
    for (const { task, m } of tasks("rg-3-volumen", "umstellen", 2)) {
      close((PI * (m.d / 2) ** 2 * num(task, 0)) / 3, m.litres * 1000, "glass");
    }
    for (const { task, m } of tasks("rg-3-volumen", "kugel", 1)) {
      close(num(task, 0), (4 / 3) * PI * m.r ** 3, "V");
      close(num(task, 1), 4 * PI * m.r ** 2, "O");
    }
    for (const { task, m } of tasks("rg-3-volumen", "kugel", 2)) {
      if (m.variant === 0) {
        close(num(task, 0), (PI * m.a ** 3) / 6, "sphere in cube");
        close(num(task, 1), (1 - PI / 6) * 100, "waste");
      } else {
        const r = num(task, 0);
        close(4 * PI * r * r, m.O, "O");
        close(num(task, 1), ((4 / 3) * PI * r ** 3) / 1000, "litres");
      }
    }
  });
});

describe("6.4 Zusammengesetzte Körper", () => {
  it("adds and subtracts parts and counts only the outer faces", () => {
    const lab = lesson("rg-4-zusammengesetzt").lab;
    for (const v of enumerateLabGrid(lab, 4)) {
      const { r, h, k, t } = v;
      const c = compositeSolid(v);
      const d = (t / 100) * h;
      const V = [
        PI * r * r * h + (PI * r * r * k) / 3,
        PI * r * r * h + (2 / 3) * PI * r ** 3,
        (PI * r * r * k) / 3 + (2 / 3) * PI * r ** 3,
        PI * r * r * h + (4 / 3) * PI * r ** 3,
        PI * r * r * h - (PI * r * r * d) / 3,
      ][v.model];
      const O = [
        PI * r * r + 2 * PI * r * h + PI * r * Math.hypot(r, k),
        PI * r * r + 2 * PI * r * h + 2 * PI * r * r,
        PI * r * Math.hypot(r, k) + 2 * PI * r * r,
        4 * PI * r * r + 2 * PI * r * h,
        PI * r * r + 2 * PI * r * h + PI * r * Math.hypot(r, d),
      ][v.model];
      close(c.V, V, `V ${JSON.stringify(v)}`);
      close(c.O, O, `O ${JSON.stringify(v)}`);
      // A bore always makes the surface bigger than that of the full cylinder.
      if (v.model === 4) expect(c.O).toBeGreaterThan(2 * PI * r * r + 2 * PI * r * h);
    }
  });

  it("recomputes the composite tasks; bores fit inside their workpiece", () => {
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "aufsetzen", 1)) {
      const top = m.cone ? (PI * m.r ** 2 * m.k) / 3 : (2 / 3) * PI * m.r ** 3;
      const topArea = m.cone ? PI * m.r * Math.hypot(m.r, m.k) : 2 * PI * m.r ** 2;
      close(num(task, 0), PI * m.r ** 2 * m.h + top, "V");
      close(num(task, 1), PI * m.r ** 2 + 2 * PI * m.r * m.h + topArea, "O");
    }
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "aufsetzen", 2)) {
      const r = m.d / 2;
      close(num(task, 0), PI * r * r * m.h + (PI * r * r * m.k) / 3, "silo V");
      close(num(task, 1), 2 * PI * r * m.h + PI * r * Math.hypot(r, m.k), "silo sheet");
    }
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "aushoehlen", 1)) {
      expect(m.d).toBeLessThan(m.a);
      const r = m.d / 2;
      close(num(task, 0), m.a ** 3 - PI * r * r * m.a, "V");
      close(num(task, 1), 6 * m.a ** 2 - 2 * PI * r * r + 2 * PI * r * m.a, "O");
    }
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "aushoehlen", 2)) {
      expect(m.depth).toBeLessThanOrEqual(m.h);
      const r = m.d / 2;
      const V = PI * r * r * m.h - (PI * r * r * m.depth) / 3;
      close(num(task, 0), V, "V");
      close(num(task, 1), (V * 7.85) / 1000, "kg");
    }
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "liter", 1)) {
      close(num(task, 0), ((2 / 3) * PI * m.r ** 3 + PI * m.r ** 2 * m.h) / 1000, "litres");
    }
    for (const { task, m } of tasks("rg-4-zusammengesetzt", "liter", 2)) {
      const r = m.d / 2;
      const V = PI * r * r * m.h + (2 / 3) * PI * r ** 3;
      close(num(task, 0), V, "m³");
      close(num(task, 1), (V * 1000) / m.q / 60, "minutes");
    }
  });
});

describe("6.5 Funktionale Abhängigkeiten und Extremwerte", () => {
  /** The largest value of f on a fine grid of ]0; bound[. */
  const bruteMax = (f: (x: number) => number, bound: number) => {
    let best = { x: 0, value: -Infinity };
    for (let i = 1; i < 20000; i++) {
      const x = (bound * i) / 20000;
      const value = f(x);
      if (value > best.value) best = { x, value };
    }
    return best;
  };

  it("finds the true maximum of every lab setting, and the 0,1 grid reaches it", () => {
    const lab = lesson("rg-5-extremwerte").lab;
    const settings: LabValues[] = [];
    for (const R of [3, 3.5, 4, 5, 6, 7.5, 8]) for (const hk of [4, 9, 12]) for (const qty of [0, 1]) settings.push({ ...defaultLabValues(lab), task: 0, qty, R, hk });
    for (let L = 10; L <= 30; L++) settings.push({ ...defaultLabValues(lab), task: 1, L });
    for (const v of settings) {
      const best = extremumBest(v);
      const bound = v.task === 1 ? v.L / 2 : v.R;
      const brute = bruteMax((x) => extremumAt(v, x), bound);
      expect(best.value, JSON.stringify(v)).toBeGreaterThanOrEqual(brute.value - 1e-9);
      expect(Math.abs(best.x - brute.x)).toBeLessThan(bound / 1000);
      // Some slider position of x reaches the goal's 99,9 %.
      const key = v.task === 1 ? "c" : "x";
      const param = lab.params.find((p) => p.key === key)!;
      const onGrid = clampParam(param, best.x);
      const values = { ...v, [key]: onGrid };
      const goal = lab.goals.find((g) => g.id === (v.task === 1 ? "schachtel" : v.qty === 1 ? "volumen" : "mantel"))!;
      expect(goal.check(values, computeReadouts(lab, values)), JSON.stringify(values)).toBe(true);
    }
  });

  it("puts the largest Mantel at half the cone radius, also by brute force", () => {
    for (const level of [1, 2] as const) {
      for (const { task, m } of tasks("rg-5-extremwerte", "zylinder-im-kegel", level)) {
        const M = (x: number) => 2 * PI * x * m.H * (1 - x / m.R);
        const brute = bruteMax(M, m.R);
        const last = task.fields.length - 1;
        close(num(task, last), (PI * m.R * m.H) / 2, "M max");
        expect(num(task, last)).toBeGreaterThanOrEqual(brute.value - 1e-9);
        if (level === 1) close(num(task, 0), m.R / 2, "x");
        else {
          close(num(task, 0), m.R, "upper bound of D");
          expect(m.x0).toBeGreaterThan(0);
          expect(m.x0).toBeLessThan(m.R);
          // Strahlensatz: h(x) : H = (R − x) : R.
          close(num(task, 1), (m.H * (m.R - m.x0)) / m.R, "h(x0)");
        }
      }
    }
  });

  it("evaluates the box and reads a table with one clear winner", () => {
    for (const { task, m } of tasks("rg-5-extremwerte", "schachtel", 1)) {
      expect(m.x0).toBeLessThan(m.a / 2);
      close(num(task, 0), m.a / 2, "bound");
      close(num(task, 1), m.x0 * (m.a - 2 * m.x0) ** 2, "V");
    }
    for (const { task, m } of tasks("rg-5-extremwerte", "schachtel", 2)) {
      const values: number[] = [];
      for (let x = 1; 2 * x < m.a; x++) values.push(x * (m.a - 2 * x) ** 2);
      const sorted = [...values].sort((p, q) => q - p);
      expect(sorted[1], `a = ${m.a}: the best whole x is clear`).toBeLessThan(0.99 * sorted[0]);
      expect(num(task, 0)).toBe(values.indexOf(sorted[0]) + 1);
      expect(num(task, 1)).toBe(sorted[0]);
      expect(boxTable(m.a).best).toBe(num(task, 0));
    }
  });

  it("maximises the quadratic dependencies inside the Definitionsmenge", () => {
    for (const { task, m } of tasks("rg-5-extremwerte", "abhaengig", 1)) {
      const M = (x: number) => 2 * PI * (m.r - x) * (m.h + m.k * x);
      const brute = bruteMax(M, m.r);
      expect(num(task, 0)).toBeGreaterThan(0);
      expect(num(task, 0)).toBeLessThan(m.r);
      expect(Math.abs(num(task, 0) - brute.x)).toBeLessThan(m.r / 1000);
      close(num(task, 1), M(num(task, 0)), "M max");
      expect(num(task, 1)).toBeGreaterThanOrEqual(brute.value - 1e-9);
    }
    for (const { task, m } of tasks("rg-5-extremwerte", "abhaengig", 2)) {
      const V = (x: number) => m.c * (m.a + x) * (m.b - x);
      const xs = num(task, 0);
      expect(xs).toBeGreaterThan(0);
      expect(xs).toBeLessThan(m.b);
      expect(V(xs)).toBeGreaterThanOrEqual(bruteMax(V, m.b).value - 1e-9);
      close(num(task, 1), V(xs), "V max");
      expect(m.a + xs).toBe(m.b - xs);
      expect(choice(task, 2)).toBe(0);
    }
  });
});
