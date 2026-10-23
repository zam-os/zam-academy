import { describe, expect, it } from "vitest";
import { STAGE_DREIECKE } from "../src/curriculum/stage-2-dreiecke";
import { createRng, seedFrom } from "../src/exercises/rng";
import { clampParam, computeReadouts, defaultLabValues } from "../src/lab/engine";
import { carrierPoint, cosineLabTriangle, familyAt, ssaTriangles, swsTriangle, TRIG_EQUATIONS, trigSolutions } from "../src/lab/views-dreiecke";
import type { ChoiceField, DifficultyLevel, ExerciseTask, NumberField } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";

/**
 * Stage 2 (M10 LB 1, Trigonometrie in Dreieck und Raum): every generated task
 * is recomputed from the values it states, with methods of its own
 * (coordinates, Heron, brute-force root scans), and every decision a task
 * asks for must survive rounding.
 */

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);
const tan = (deg: number) => Math.tan(deg * RAD);
const deg = (rad: number) => rad / RAD;

interface P {
  x: number;
  y: number;
}
const dist = (p: P, q: P) => Math.hypot(p.x - q.x, p.y - q.y);
/** The area of a simple polygon from its corners (shoelace formula). */
const shoelace = (points: P[]) =>
  Math.abs(points.reduce((sum, p, i) => sum + p.x * points[(i + 1) % points.length].y - points[(i + 1) % points.length].x * p.y, 0)) / 2;
/** Heron's formula: the area from three sides. */
const heron = (a: number, b: number, c: number) => {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};
/** The angle at `v` between the rays to p and q, in degrees. */
const angleAt = (v: P, p: P, q: P) =>
  deg(Math.acos(((p.x - v.x) * (q.x - v.x) + (p.y - v.y) * (q.y - v.y)) / (dist(v, p) * dist(v, q))));

/** Every root of f(φ) = k between lo and hi (degrees): sign changes on a fine grid, refined by bisection. */
function scanRoots(f: (phi: number) => number, k: number, lo: number, hi: number, includeLo: boolean): number[] {
  const g = (phi: number) => f(phi) - k;
  const roots: number[] = [];
  const step = 0.25;
  for (let x = lo; x < hi - 1e-9; x += step) {
    const x2 = Math.min(x + step, hi);
    const g1 = g(x);
    const g2 = g(x2);
    if (!Number.isFinite(g1) || !Number.isFinite(g2) || Math.abs(g1) > 50 || Math.abs(g2) > 50) continue;
    if (g1 === 0) {
      roots.push(x);
      continue;
    }
    if (g1 * g2 >= 0) continue;
    let [a, b] = [x, x2];
    for (let i = 0; i < 60; i++) {
      const m = (a + b) / 2;
      if (g(a) * g(m) <= 0) b = m;
      else a = m;
    }
    roots.push((a + b) / 2);
  }
  return roots.filter((phi, i) => (includeLo ? phi >= lo - 1e-9 : phi > lo + 1e-6) && phi < hi - 1e-6 && (i === 0 || phi - roots[i - 1] > 1e-6));
}

const lesson = (id: string) => {
  const found = STAGE_DREIECKE.lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-2:${i}`));
function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}
const num = (task: ExerciseTask, index: number) => (task.fields[index] as NumberField).answer;
const pick = (task: ExerciseTask, index: number) => (task.fields[index] as ChoiceField).correctIndex;
const meta = (task: ExerciseTask) => {
  if (!task.meta) throw new Error(`no meta: ${task.prompt}`);
  return task.meta;
};
const near = (actual: number, expected: number, where: string, tolerance = 1e-6) =>
  expect(Math.abs(actual - expected), `${where}: ${actual} vs ${expected}`).toBeLessThan(tolerance);

describe("Etappe 2: Lernpfad", () => {
  it("has the five lessons of M10 LB 1 in order, with their Zweige", () => {
    expect(STAGE_DREIECKE.id).toBe("stage-2-dreiecke");
    expect(STAGE_DREIECKE.lessons.map((l) => l.id)).toEqual([
      "dr-1-sinussatz",
      "dr-2-kosinussatz",
      "dr-3-flaecheninhalt",
      "dr-4-ebene-raum",
      "dr-5-gleichungen",
    ]);
    expect(STAGE_DREIECKE.lessons.map((l) => l.tracks)).toEqual([["I", "II_III"], ["I", "II_III"], ["I", "II_III"], ["I", "II_III"], ["I"]]);
    STAGE_DREIECKE.lessons.forEach((l, i) => {
      expect(l.stageId).toBe(STAGE_DREIECKE.id);
      expect(l.stepNumber).toBe(i + 1);
      expect(l.title.startsWith(`2.${i + 1} `), l.id).toBe(true);
      expect(l.lehrplan.startsWith("M10 LB 1 (I)"), l.id).toBe(true);
      expect(l.lehrplan.includes("Trigonometrie"), l.id).toBe(true);
      // Zweig II/III learns everything here except the angle-dependent equations of 2.5.
      expect(l.lehrplan.includes("M10 LB 1 (II/III)"), l.id).toBe(l.tracks.includes("II_III"));
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("writes formulas as HTML with real minus signs, never LaTeX", () => {
    for (const l of STAGE_DREIECKE.lessons) {
      const html = [l.explanationHtml, ...l.formulas.map((f) => f.html)].join(" ");
      expect(html, l.id).not.toMatch(/\\[a-z]+|\$/);
      expect(html.replace(/<[^>]+>/g, " "), l.id).not.toMatch(/(^|[\s(=:|,{±])-\d/);
      expect(l.explanationHtml, l.id).toContain('class="merke"');
      expect(l.explanationHtml, l.id).toContain('class="example"');
    }
  });
});

describe("Etappe 2: Labore", () => {
  it("find exactly the triangles of SsW that a brute-force walk along the ray finds", () => {
    for (let alpha = 15; alpha <= 135; alpha += 5) {
      for (let b = 2; b <= 8; b += 1) {
        for (let a = 1; a <= 9; a += 0.25) {
          const found = ssaTriangles(b, alpha, a);
          // B = (x | 0) on the ray: |BC| = a; count the sign changes of |BC| − a.
          const C = { x: b * cos(alpha), y: b * sin(alpha) };
          const f = (x: number) => dist({ x, y: 0 }, C) - a;
          let changes = 0;
          for (let x = 1e-6; x < 40; x += 0.01) if (f(x) * f(x + 0.01) < 0) changes += 1;
          // A circle that only touches the ray gives one right triangle, unless it touches in A itself.
          const tangent = Math.abs(a - C.y) < 1e-9 && C.x > 1e-9;
          expect(found.length, `b=${b}, α=${alpha}, a=${a}`).toBe(tangent ? 1 : changes);
          for (const t of found) {
            const B = { x: t.c, y: 0 };
            near(dist(B, C), a, "BC = a");
            near(angleAt(B, { x: 0, y: 0 }, C), t.beta, "β at B", 1e-6);
            near(a / sin(alpha), t.b / sin(t.beta), "sine law b");
            near(a / sin(alpha), t.c / sin(t.gamma), "sine law c");
          }
        }
      }
    }
  });

  it("draw the sine-law triangle and the cosine-law triangle consistently", () => {
    for (let alpha = 15; alpha <= 135; alpha += 10) {
      for (const [b, c] of [[2, 9], [6, 7], [8, 2]]) {
        const t = swsTriangle(b, c, alpha);
        const A = { x: 0, y: 0 };
        const B = { x: c, y: 0 };
        const C = { x: b * cos(alpha), y: b * sin(alpha) };
        near(t.a, dist(B, C), "a");
        near(t.beta, angleAt(B, A, C), "β");
        near(t.alpha + t.beta + t.gamma, 180, "angle sum");
      }
    }
    for (const [a, b, c] of [[3, 5, 7], [5, 4, 6], [2, 9, 10.5]]) {
      const t = cosineLabTriangle({ mode: 1, a, b, c, gamma: 70 });
      expect(t).not.toBeNull();
      near(a * a + b * b - 2 * a * b * cos(t!.gamma), c * c, "cosine law");
    }
    expect(cosineLabTriangle({ mode: 1, a: 2, b: 3, c: 6, gamma: 70 })).toBeNull();
    near(cosineLabTriangle({ mode: 1, a: 3, b: 5, c: 7, gamma: 70 })!.gamma, 120, "3-5-7");
  });

  it("put the extremes of the triangle family on the slider grid", () => {
    const x = lesson("dr-4-ebene-raum").lab.params.find((p) => p.key === "x");
    if (x?.type !== "range") throw new Error("x");
    const grid = Array.from({ length: Math.round((x.max - x.min) / x.step) + 1 }, (_, i) => clampParam(x, x.min + i * x.step));
    const byArea = [...grid].sort((p, q) => familyAt(q).area - familyAt(p).area);
    const byLength = [...grid].sort((p, q) => familyAt(p).bc - familyAt(q).bc);
    expect(byArea[0]).toBe(3.75);
    expect(byLength[0]).toBe(1.5);
    near(familyAt(7.5).area, familyAt(0).area, "A(7,5) = A(0)");
    // Coordinates: A(0|0), Bₙ(9 − x | 0), Cₙ on the 60° ray.
    for (const value of [0, 1, 3.75, 8.5]) {
      const Bn = { x: 9 - value, y: 0 };
      const Cn = { x: (3 + 2 * value) * cos(60), y: (3 + 2 * value) * sin(60) };
      near(familyAt(value).area, shoelace([{ x: 0, y: 0 }, Bn, Cn]), "area");
      near(familyAt(value).bc, dist(Bn, Cn), "BₙCₙ");
    }
  });

  it("solve the lab's equations exactly as a scan of the graph does", () => {
    for (let eq = 0; eq < TRIG_EQUATIONS.length; eq++) {
      for (const interval of [0, 1]) {
        for (let k = -2; k <= 2.0001; k += 0.05) {
          const kk = Math.round(k * 100) / 100;
          const [lo, hi] = interval === 1 ? [0, 180] : [0, 360];
          const scanned = scanRoots(TRIG_EQUATIONS[eq].f, kk, lo, hi, interval === 0);
          const solved = trigSolutions(eq, kk, interval);
          // Touching roots (k = ±1 at a maximum) have no sign change; check them directly.
          const touching = solved.filter((phi) => !scanned.some((s) => Math.abs(s - phi) < 1e-4));
          for (const phi of touching) near(TRIG_EQUATIONS[eq].f(phi), kk, `touch ${eq} ${kk}`, 1e-9);
          for (const phi of scanned) expect(solved.some((s) => Math.abs(s - phi) < 1e-4), `eq ${eq}, k ${kk}, interval ${interval}: ${phi}`).toBe(true);
          for (const phi of solved) near(TRIG_EQUATIONS[eq].f(phi), kk, `eq ${eq}, k ${kk}`, 1e-9);
        }
      }
    }
  });

  it("let the points Pₙ run on y = −x² + 4", () => {
    for (let phi = 0; phi <= 180; phi += 5) {
      const p = carrierPoint(phi);
      near(p.y, 4 - p.x * p.x, `φ = ${phi}`, 1e-12);
    }
  });

  it("make the witnesses show what the goals are about", () => {
    const sine = lesson("dr-1-sinussatz").lab;
    const doubled = { ...defaultLabValues(sine), ...GOAL_WITNESSES_STAGE_2["dr-1-sinussatz"].doppelt };
    const t = swsTriangle(doubled.b, doubled.c, doubled.alpha);
    near(t.alpha, 2 * t.beta, "α = 2β", 0.5);
    // α = 2β, but a : b = sin α : sin β = 2 · cos β, not 2.
    expect(Math.abs(t.a / t.b - 2)).toBeGreaterThan(0.2);
    const touch = { ...defaultLabValues(sine), ...GOAL_WITNESSES_STAGE_2["dr-1-sinussatz"].beruehrt };
    const [right] = ssaTriangles(touch.b, touch.alpha, touch.a);
    near(right.beta, 90, "β = 90°", 1e-6);
    const cosine = lesson("dr-2-kosinussatz").lab;
    const sss = { ...defaultLabValues(cosine), ...GOAL_WITNESSES_STAGE_2["dr-2-kosinussatz"].sss };
    near(Number(computeReadouts(cosine, sss).gamma), 120, "γ = 120°");
    const area = lesson("dr-3-flaecheninhalt").lab;
    const twin = { ...defaultLabValues(area), ...GOAL_WITNESSES_STAGE_2["dr-3-flaecheninhalt"].gleich };
    near(Number(computeReadouts(area, twin).A), 0.5 * 6 * 5 * sin(40), "same area as 40°");
    const trig = lesson("dr-5-gleichungen").lab;
    const doubleAngle = { ...defaultLabValues(trig), ...GOAL_WITNESSES_STAGE_2["dr-5-gleichungen"].doppelt };
    expect(trigSolutions(doubleAngle.eq, doubleAngle.k, doubleAngle.interval)).toEqual([15, 75]);
  });
});

describe("Etappe 2: Aufgaben zum Sinussatz", () => {
  it("compute the side from two angles and a side (WSW), on both levels", () => {
    for (const task of tasks("dr-1-sinussatz", "seite", 1)) {
      const { c, alpha, beta, ask } = meta(task);
      const gamma = 180 - alpha - beta;
      expect(gamma, task.prompt).toBeGreaterThanOrEqual(30);
      // Build the triangle from c and the angles at A and B; read the asked side off.
      const C = { x: (c * tan(beta)) / (tan(alpha) + tan(beta)), y: (c * tan(alpha) * tan(beta)) / (tan(alpha) + tan(beta)) };
      const side = ask === 0 ? dist({ x: c, y: 0 }, C) : dist({ x: 0, y: 0 }, C);
      near(num(task, 0), gamma, "γ");
      near(num(task, 1), side, task.prompt);
    }
    for (const task of tasks("dr-1-sinussatz", "seite", 2)) {
      const { base, alpha, beta } = meta(task);
      const C = { x: (base * tan(beta)) / (tan(alpha) + tan(beta)), y: (base * tan(alpha) * tan(beta)) / (tan(alpha) + tan(beta)) };
      near(num(task, 0), dist({ x: 0, y: 0 }, C), "AC");
      near(num(task, 1), C.y, "Breite = Abstand von C zur Geraden AB");
      expect(task.prompt).toContain(`${base} m`);
    }
  });

  it("compute the angle opposite the shorter side only where one triangle exists", () => {
    for (const task of tasks("dr-1-sinussatz", "winkel", 1)) {
      const { a, b, alpha } = meta(task);
      expect(b, task.prompt).toBeLessThan(a);
      // c from the cosine law a² = b² + c² − 2bc · cos α, the positive root.
      const c = b * cos(alpha) + Math.sqrt(a * a - (b * sin(alpha)) ** 2);
      const beta = angleAt({ x: c, y: 0 }, { x: 0, y: 0 }, { x: b * cos(alpha), y: b * sin(alpha) });
      near(num(task, 0), beta, "β");
      near(num(task, 1), c, "c");
      expect(alpha + (180 - beta), "the second candidate is no triangle").toBeGreaterThan(180);
      expect(180 - alpha - beta).toBeGreaterThanOrEqual(12);
    }
    for (const task of tasks("dr-1-sinussatz", "winkel", 2)) {
      const { c, a, gamma } = meta(task);
      expect(a, task.prompt).toBeLessThan(c);
      const b = a * cos(gamma) + Math.sqrt(c * c - (a * sin(gamma)) ** 2);
      near(num(task, 1), b, "AC");
      near(heron(a, b, c), 0.5 * a * b * sin(gamma), "the triangle exists with these sides");
      near(Math.sin(num(task, 0) * RAD) / a, sin(gamma) / c, "sine law for α");
    }
  });

  it("decide one or two triangles the way the circle around C does, never on a rounding edge", () => {
    let two = 0;
    for (const task of tasks("dr-1-sinussatz", "zwei-loesungen", 1)) {
      const { a, b, alpha } = meta(task);
      // B on the ray: x² − 2b · cos α · x + b² − a² = 0, positive roots only.
      const disc = (b * cos(alpha)) ** 2 - (b * b - a * a);
      const roots = [b * cos(alpha) + Math.sqrt(disc), b * cos(alpha) - Math.sqrt(disc)].filter((x) => x > 1e-9);
      expect(disc, task.prompt).toBeGreaterThan(0);
      expect(pick(task, 2) + 1, task.prompt).toBe(roots.length);
      expect(roots.length === 2).toBe(a < b);
      const beta1 = deg(Math.asin((b * sin(alpha)) / a));
      near(num(task, 0), beta1, "β₁");
      near(num(task, 1), 180 - beta1, "β₂");
      // α + β₂ stays at least 3° away from 180°, so rounding cannot flip the answer.
      expect(Math.abs(alpha + 180 - beta1 - 180), task.prompt).toBeGreaterThanOrEqual(3);
      expect((b * sin(alpha)) / a).toBeLessThanOrEqual(0.95);
      if (roots.length === 2) two += 1;
    }
    expect(two).toBeGreaterThan(60);
    expect(two).toBeLessThan(180);
  });

  it("let the ship enter and leave the light circle where the circle meets the course", () => {
    for (const task of tasks("dr-1-sinussatz", "zwei-loesungen", 2)) {
      const { b, alpha, a } = meta(task);
      const L = { x: b * cos(alpha), y: b * sin(alpha) };
      const h = L.y;
      expect(a, task.prompt).toBeGreaterThan(h);
      expect(a, task.prompt).toBeLessThan(b);
      const enter = L.x - Math.sqrt(a * a - h * h);
      const leave = L.x + Math.sqrt(a * a - h * h);
      near(num(task, 0), enter, "hinein");
      near(num(task, 1), leave, "hinaus");
      near(dist({ x: num(task, 0), y: 0 }, L), a, "on the circle");
      expect(enter).toBeGreaterThanOrEqual(0.5);
    }
  });
});

describe("Etappe 2: Aufgaben zum Kosinussatz", () => {
  it("find the third side from two sides and the angle between them", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-2-kosinussatz", "seite", level)) {
        const m = meta(task);
        const [p, q] = level === 1 ? [m.a, m.b] : [m.p, m.q];
        // C at the origin, the two given sides along the x-axis and at the angle γ.
        near(num(task, 0), dist({ x: p, y: 0 }, { x: q * cos(m.gamma), y: q * sin(m.gamma) }), task.prompt);
      }
    }
  });

  it("find the angle from three sides that really form a triangle, and name its kind safely", () => {
    for (const task of tasks("dr-2-kosinussatz", "winkel", 1)) {
      const { a, b, c } = meta(task);
      expect(c, task.prompt).toBeLessThan(a + b);
      expect(c, task.prompt).toBeGreaterThan(Math.abs(a - b));
      const area = heron(a, b, c);
      // sin γ from the area, cos γ from the sign of a² + b² − c²: the angle without the cosine law.
      const top = a * a + b * b - c * c;
      const sinG = (2 * area) / (a * b);
      const gamma = top >= 0 ? deg(Math.asin(Math.min(1, sinG))) : 180 - deg(Math.asin(Math.min(1, sinG)));
      near(num(task, 0), gamma, task.prompt, 1e-5);
      expect(pick(task, 1), task.prompt).toBe(top === 0 ? 1 : top > 0 ? 0 : 2);
      if (top !== 0) expect(Math.abs(gamma - 90), task.prompt).toBeGreaterThanOrEqual(1.5);
    }
    for (const task of tasks("dr-2-kosinussatz", "winkel", 2)) {
      const { p, q, r } = meta(task);
      expect(r, "the asked angle faces the longest side").toBeGreaterThan(Math.max(p, q));
      expect(r).toBeLessThan(p + q);
      const gamma = deg(Math.acos((p * p + q * q - r * r) / (2 * p * q)));
      near(num(task, 0), gamma, task.prompt);
      expect(pick(task, 1) === 0, task.prompt).toBe(p * p + q * q < r * r);
      expect(Math.abs(gamma - 90), "no yes/no on a rounding edge").toBeGreaterThanOrEqual(2);
    }
  });

  it("compute both diagonals of the parallelogram from its corners", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-2-kosinussatz", "parallelogramm", level)) {
        const { a, b, alpha } = meta(task);
        const A = { x: 0, y: 0 };
        const B = { x: a, y: 0 };
        const D = { x: b * cos(alpha), y: b * sin(alpha) };
        const C = { x: B.x + D.x, y: B.y + D.y };
        near(num(task, 0), dist(B, D), "BD");
        near(num(task, 1), dist(A, C), "AC");
        expect(num(task, 0)).toBeLessThan(num(task, 1));
      }
    }
  });
});

describe("Etappe 2: Aufgaben zum Flächeninhalt", () => {
  it("compute areas with the sine and check them with corners", () => {
    for (const task of tasks("dr-3-flaecheninhalt", "flaeche", 1)) {
      const { a, b, gamma } = meta(task);
      near(num(task, 0), shoelace([{ x: 0, y: 0 }, { x: a, y: 0 }, { x: b * cos(gamma), y: b * sin(gamma) }]), task.prompt);
    }
    for (const task of tasks("dr-3-flaecheninhalt", "flaeche", 2)) {
      const m = meta(task);
      if (m.scenario === 0) {
        const area = shoelace([{ x: 0, y: 0 }, { x: m.p, y: 0 }, { x: m.q * cos(m.gamma), y: m.q * sin(m.gamma) }]);
        near(num(task, 0), area, "A");
        near(num(task, 1), area * m.price, "Preis", 1e-4);
      } else {
        // Boom AB = c with the angle α at the mast A and β at the end B.
        const C = { x: (m.c * tan(m.beta)) / (tan(m.alpha) + tan(m.beta)), y: (m.c * tan(m.alpha) * tan(m.beta)) / (tan(m.alpha) + tan(m.beta)) };
        near(num(task, 0), dist({ x: 0, y: 0 }, C), "vordere Kante");
        near(num(task, 1), shoelace([{ x: 0, y: 0 }, { x: m.c, y: 0 }, C]), "Segelfläche");
      }
    }
  });

  it("give both angles of a given area, far apart and never near 90°", () => {
    for (const task of tasks("dr-3-flaecheninhalt", "winkel", 1)) {
      const { a, b, area } = meta(task);
      const [g1, g2] = [num(task, 0), num(task, 1)];
      near(0.5 * a * b * sin(g1), area, "γ₁");
      near(0.5 * a * b * sin(g2), area, "γ₂");
      expect(g1).toBeLessThan(90 - 10);
      expect(g2).toBeGreaterThan(90 + 10);
      expect(task.anyOrder).toEqual([0, 1]);
    }
    for (const task of tasks("dr-3-flaecheninhalt", "winkel", 2)) {
      const { p, q, area } = meta(task);
      const [g1, g2, c1, c2] = [0, 1, 2, 3].map((i) => num(task, i));
      expect(g1).toBeLessThan(90);
      expect(g2).toBeGreaterThan(90);
      near(heron(p, q, c1), area, "triangle with γ₁", 1e-6);
      near(heron(p, q, c2), area, "triangle with γ₂", 1e-6);
      expect(c2).toBeGreaterThan(c1);
    }
  });

  it("find the missing side from the area", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-3-flaecheninhalt", "seite", level)) {
        const { area, b, gamma } = meta(task);
        const a = num(task, 0);
        near(shoelace([{ x: 0, y: 0 }, { x: a, y: 0 }, { x: b * cos(gamma), y: b * sin(gamma) }]), area, task.prompt);
        expect(a).toBeGreaterThan(1);
        expect(a).toBeLessThan(level === 1 ? 30 : 8);
      }
    }
  });
});

describe("Etappe 2: Aufgaben in Ebene und Raum", () => {
  /** Corners of the quadrilateral: C lies on the far side of [BD], ∢DBC = ε away from A. */
  function corners(m: Record<string, number>) {
    const A = { x: 0, y: 0 };
    const B = { x: m.ab, y: 0 };
    const D = { x: m.ad * cos(m.alpha), y: m.ad * sin(m.alpha) };
    const u = { x: (D.x - B.x) / dist(B, D), y: (D.y - B.y) / dist(B, D) };
    // Rotating B→D clockwise turns away from A, which lies to the right of B→D's left normal.
    const turn = (sign: number) => ({ x: B.x + m.bc * (u.x * cos(m.eps) - sign * u.y * sin(m.eps)), y: B.y + m.bc * (sign * u.x * sin(m.eps) + u.y * cos(m.eps)) });
    const side = (p: P) => (D.x - B.x) * (p.y - B.y) - (D.y - B.y) * (p.x - B.x);
    const C = [turn(1), turn(-1)].find((p) => side(p) * side(A) < 0)!;
    return { A, B, C, D };
  }

  it("split quadrilaterals along a diagonal: convex shapes, sides and areas from corners", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-4-ebene-raum", "viereck", level)) {
        const m = meta(task);
        if (m.scenario === 2) {
          const bottom = m.top + m.h / tan(m.wet) + m.h / tan(m.dry);
          near(num(task, 0), bottom, "Sohle");
          near(num(task, 1), shoelace([{ x: 0, y: 0 }, { x: bottom, y: 0 }, { x: m.h / tan(m.wet) + m.top, y: m.h }, { x: m.h / tan(m.wet), y: m.h }]), "Deich");
          continue;
        }
        const { A, B, C, D } = corners(m);
        const quad = [A, B, C, D];
        const turns = quad.map((p, i) => {
          const q = quad[(i + 1) % 4];
          const r = quad[(i + 2) % 4];
          return (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
        });
        expect(turns.every((t) => t > 0) || turns.every((t) => t < 0), `convex: ${task.prompt}`).toBe(true);
        near(num(task, 0), dist(B, D), "BD");
        near(angleAt(B, D, C), m.eps, "∢DBC");
        if (m.scenario === 1) {
          near(num(task, 1), dist(C, D), "CD");
          near(num(task, 2), shoelace(quad), "Grundstück");
        } else near(num(task, 1), shoelace(quad), "Viereck");
      }
    }
  });

  it("find edges and angles of pyramids and cones in their right triangles", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-4-ebene-raum", "raum", level)) {
        const m = meta(task);
        if (m.scenario === 0) {
          // A(−a/2 | −a/2 | 0), M at the origin, S(0 | 0 | h).
          const edge = Math.hypot(m.a / 2, m.a / 2, m.h);
          near(num(task, 0), edge, "AS");
          near(num(task, 1), deg(Math.asin(m.h / edge)), "ε");
        } else if (m.scenario === 1) {
          const h = Math.sqrt(m.s * m.s - 2 * (m.a / 2) ** 2);
          near(num(task, 0), h, "Dachhöhe");
          near(num(task, 1), deg(Math.asin(h / m.s)), "Neigung der Dachkante");
        } else {
          near(num(task, 0), (m.d / 2) * tan(m.angle), "Höhe");
          near(num(task, 1), Math.hypot(m.d / 2, (m.d / 2) * tan(m.angle)), "Mantellinie");
        }
      }
    }
  });

  it("put the largest triangle of the family where a fine scan of x finds it, inside the domain", () => {
    for (const level of [1, 2] as const) {
      for (const task of tasks("dr-4-ebene-raum", "funktion", level)) {
        const { c, b, alpha, k, shrinkAB } = meta(task);
        const ab = (x: number) => (shrinkAB ? c - x : c + k * x);
        const ac = (x: number) => (shrinkAB ? b + k * x : b - x);
        const upper = shrinkAB ? c : b;
        const area = (x: number) => 0.5 * ab(x) * ac(x) * sin(alpha);
        let best = 0;
        for (let x = 0; x < upper; x += 0.0005) if (area(x) > area(best)) best = x;
        const xs = num(task, level === 1 ? 1 : 0);
        expect(Math.abs(xs - best), task.prompt).toBeLessThan(0.001);
        expect(xs).toBeGreaterThan(0);
        expect(xs).toBeLessThan(upper);
        expect(task.prompt).toContain(`${c} cm`);
        near(num(task, level === 1 ? 2 : 1), area(xs), "A_max");
        if (level === 1) near(num(task, 0), area(meta(task).x0), "A(x₀)");
        else {
          const Bn = { x: ab(xs), y: 0 };
          const Cn = { x: ac(xs) * cos(alpha), y: ac(xs) * sin(alpha) };
          near(num(task, 2), dist(Bn, Cn), "BₙCₙ");
        }
      }
    }
  });
});

describe("Etappe 2: Gleichungen und Trägergraphen", () => {
  it("give all solutions of sin, cos and tan φ = k in [0°; 360°[, as a scan finds them", () => {
    const fs = [sin, cos, tan];
    for (const task of tasks("dr-5-gleichungen", "gleichung", 1)) {
      const { type, k } = meta(task);
      const roots = scanRoots(fs[type], k, 0, 360, true);
      expect(roots, task.prompt).toHaveLength(2);
      near(num(task, 0), roots[0], "φ₁", 1e-6);
      near(num(task, 1), roots[1], "φ₂", 1e-6);
    }
  });

  it("solve the figure equations of the rotating triangle in ]0°; 180°[", () => {
    for (const task of tasks("dr-5-gleichungen", "gleichung", 2)) {
      const m = meta(task);
      if (m.variant === 0) {
        const roots = scanRoots((phi) => 0.5 * m.b * m.c * sin(phi), m.area, 0, 180, false);
        expect(roots, task.prompt).toHaveLength(2);
        near(num(task, 0), roots[0], "φ₁", 1e-6);
        near(num(task, 1), roots[1], "φ₂", 1e-6);
      } else {
        const roots = scanRoots((phi) => Math.hypot(m.c - m.b * cos(phi), m.b * sin(phi)), m.d, 0, 180, false);
        expect(roots, task.prompt).toHaveLength(1);
        near(num(task, 0), roots[0], "φ", 1e-6);
      }
    }
  });

  it("use tan = sin : cos, the double angle and sin² + cos² = 1 without losing solutions", () => {
    for (const task of tasks("dr-5-gleichungen", "zusammenhang", 1)) {
      const m = meta(task);
      const f =
        m.variant === 0
          ? (phi: number) => m.p * sin(phi) - m.q * cos(phi)
          : m.variant === 1
            ? (phi: number) => 2 * sin(phi) * cos(phi) - m.k
            : (phi: number) => m.p * cos(phi) ** 2 + m.q * sin(phi) ** 2 - m.r;
      const roots = scanRoots(f, 0, 0, 180, false);
      expect(roots.length, task.prompt).toBe(task.fields.length);
      roots.forEach((root, i) => near(num(task, i), root, `${task.prompt} #${i}`, 1e-6));
    }
    for (const task of tasks("dr-5-gleichungen", "zusammenhang", 2)) {
      const { s, area } = meta(task);
      // Gable: base 2s · cos φ, height s · sin φ.
      const roots = scanRoots((phi) => 0.5 * 2 * s * cos(phi) * s * sin(phi), area, 0, 90, false);
      expect(roots, task.prompt).toHaveLength(2);
      near(num(task, 0), roots[0], "φ₁", 1e-6);
      near(num(task, 1), roots[1], "φ₂", 1e-6);
    }
  });

  it("name Trägergraphen that every point Pₙ lies on, and the x-axis points", () => {
    for (const task of tasks("dr-5-gleichungen", "traegergraph", 1)) {
      const { straight, p, q, r } = meta(task);
      for (let phi = 0; phi <= (straight ? 90 : 180); phi += 7.5) {
        const x = straight ? p * sin(phi) ** 2 : p * cos(phi);
        const y = straight ? q * cos(phi) ** 2 + r : q * sin(phi) ** 2 + r;
        near(straight ? num(task, 0) * x + num(task, 1) : num(task, 0) * x * x + num(task, 1), y, task.prompt, 1e-9);
      }
    }
    for (const task of tasks("dr-5-gleichungen", "traegergraph", 2)) {
      const { p, q, r } = meta(task);
      for (let phi = 5; phi < 180; phi += 7.5) near(num(task, 0) * (p * cos(phi)) ** 2 + num(task, 1), q * sin(phi) ** 2 + r, task.prompt, 1e-9);
      const roots = scanRoots((phi) => q * sin(phi) ** 2 + r, 0, 0, 180, false);
      expect(roots, task.prompt).toHaveLength(2);
      near(num(task, 2), roots[0], "φ₁", 1e-6);
      near(num(task, 3), roots[1], "φ₂", 1e-6);
      expect(task.anyOrder).toEqual([2, 3]);
    }
  });

  it("find the largest angle-dependent area, checked on figures built from coordinates", () => {
    // The largest value on a 0,01° grid of φ, not the rule sin φ ≤ 1 the lesson teaches.
    const largest = (area: (phi: number) => number, hi: number) => {
      let best = { phi: 0, value: Number.NEGATIVE_INFINITY };
      for (let i = 1; i < hi * 100; i++) {
        const value = area(i / 100);
        if (value > best.value) best = { phi: i / 100, value };
      }
      return best;
    };
    const O = { x: 0, y: 0 };
    for (const task of tasks("dr-5-gleichungen", "extremwert", 1)) {
      const { variant, c, b } = meta(task);
      // A in the origin, B on the x-axis, the moving corner on the ray under φ.
      const area = (phi: number) => {
        const D = { x: b * cos(phi), y: b * sin(phi) };
        return shoelace(variant === 1 ? [O, { x: c, y: 0 }, { x: c + D.x, y: D.y }, D] : [O, { x: c, y: 0 }, D]);
      };
      const best = largest(area, 180);
      near(num(task, 0), best.phi, `${task.prompt} φ`, 0.011);
      near(num(task, 1), best.value, `${task.prompt} A`, 1e-6);
    }
    for (const task of tasks("dr-5-gleichungen", "extremwert", 2)) {
      const { variant, s } = meta(task);
      // Base or diameter on the x-axis, symmetric to the y-axis: the rectangle's corner
      // (s · cos φ | s · sin φ) lies on the semicircle, the triangle's legs are s long
      // and meet the base under φ.
      const area = (phi: number) => {
        const x = s * cos(phi);
        const y = s * sin(phi);
        return shoelace(variant === 1 ? [{ x: -x, y: 0 }, { x, y: 0 }, { x, y }, { x: -x, y }] : [{ x: -x, y: 0 }, { x, y: 0 }, { x: 0, y }]);
      };
      const best = largest(area, 90);
      near(num(task, 0), best.phi, `${task.prompt} φ`, 0.011);
      near(num(task, 1), best.value, `${task.prompt} A`, 1e-6);
      const factor = Number(task.prompt.match(/A\(φ\) = ([\d,]+) · sin\(2φ\)/)?.[1].replace(",", "."));
      for (const phi of [10, 30, 60, 80]) near(factor * sin(2 * phi), area(phi), `${task.prompt} A(${phi}°)`, 1e-9);
    }
  });
});
