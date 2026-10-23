import { describe, expect, it } from "vitest";
import {
  ANGLE_CASES,
  BODIES,
  COMPARE,
  COMPOSITE_SECTIONS,
  cuboidVertex,
  LOCATIONS,
  SECTIONS,
  STAGE_RAUMGEOMETRIE,
  SYM_OBJECTS,
  TURN_CASES,
  TURN_OBJECTS,
} from "../src/curriculum/stage-3-raumgeometrie";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues, enumerateLabGrid } from "../src/lab/engine";
import { axialSlant, axialWidth, drawnAngle, locationOf, obliqueDims, obliqueSolid, pictureDistance, solidTop, solidVertices, SYM_BODIES, symmetryOf, trueFigure, vec } from "../src/lab/views-raumgeometrie";
import type { ChoiceField, DifficultyLevel, ExerciseTask, LabDefinition, LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";

const IDS = ["rg-1-koerpersymmetrie", "rg-2-axialschnitte", "rg-3-raumkoordinaten", "rg-4-koerper-koordinaten", "rg-5-schraegbilder", "rg-6-wahre-groesse"];

const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-3:${i}`));

const lesson = (id: string) => {
  const found = STAGE_RAUMGEOMETRIE.lessons.find((l) => l.id === id);
  if (!found) throw new Error(id);
  return found;
};

function tasks(lessonId: string, generatorId: string, level: DifficultyLevel): ExerciseTask[] {
  const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId);
  if (!generator) throw new Error(`${lessonId}/${generatorId}`);
  return SEEDS.map((seed) => generator.make(createRng(seed), level));
}

function num(task: ExerciseTask, index: number): number {
  const field = task.fields[index];
  if (field?.kind !== "number") throw new Error(`field ${index} of ${task.prompt} is no number`);
  return field.answer;
}

function choice(task: ExerciseTask, index: number): ChoiceField {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field;
}

/** The text of the right option of a choice field. */
const picked = (task: ExerciseTask, index: number) => choice(task, index).options[choice(task, index).correctIndex];

const meta = (task: ExerciseTask) => task.meta ?? {};

function close(x: number, y: number, eps = 1e-9): void {
  expect(Math.abs(x - y), `${x} ≈ ${y}`).toBeLessThanOrEqual(eps * Math.max(1, Math.abs(y)));
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ");

const at = (lab: LabDefinition, values: Partial<LabValues>) => {
  const v = { ...defaultLabValues(lab), ...values } as LabValues;
  return { v, r: computeReadouts(lab, v) };
};

// ─── Independent symmetry counting for polyhedra ───────────────────────────
//
// Every symmetry plane of a polyhedron maps some vertex onto another one, so
// it is the perpendicular bisector plane of a vertex pair. Every rotation
// axis of the bodies used here is an intersection of two symmetry planes or
// runs through a vertex or the midpoint of two vertices. The counts below
// try them all and so recompute the numbers the lesson states.

type P3 = [number, number, number];
const sub3 = (a: P3, b: P3): P3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot3 = (a: P3, b: P3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: P3, b: P3): P3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm3 = (a: P3) => Math.hypot(...a);

/** A direction as a unit vector whose first non-zero component is positive. */
function direction(a: P3): P3 | null {
  const l = norm3(a);
  if (l < 1e-9) return null;
  let u: P3 = [a[0] / l, a[1] / l, a[2] / l];
  const first = u.find((c) => Math.abs(c) > 1e-9) ?? 1;
  if (first < 0) u = [-u[0], -u[1], -u[2]];
  return u;
}

function uniqueDirections(list: P3[]): P3[] {
  const out: P3[] = [];
  for (const raw of list) {
    const d = direction(raw);
    if (d && !out.some((o) => norm3(sub3(o, d)) < 1e-7)) out.push(d);
  }
  return out;
}

function mapsOnto(vs: P3[], f: (p: P3) => P3): boolean {
  return vs.every((p) => vs.some((q) => norm3(sub3(f(p), q)) < 1e-6));
}

const reflectP = (n: P3) => (p: P3): P3 => {
  const t = 2 * dot3(p, n);
  return [p[0] - t * n[0], p[1] - t * n[1], p[2] - t * n[2]];
};

const rotateP = (k: P3, deg: number) => (p: P3): P3 => {
  const c = Math.cos((deg * Math.PI) / 180);
  const s = Math.sin((deg * Math.PI) / 180);
  const kp = cross3(k, p);
  const kd = dot3(k, p) * (1 - c);
  return [p[0] * c + kp[0] * s + k[0] * kd, p[1] * c + kp[1] * s + k[1] * kd, p[2] * c + kp[2] * s + k[2] * kd];
};

function centred(vs: P3[]): P3[] {
  const c: P3 = [0, 1, 2].map((i) => vs.reduce((s, v) => s + v[i], 0) / vs.length) as P3;
  return vs.map((v) => sub3(v, c));
}

function maxOrder(vs: P3[], axis: P3): number {
  let best = 0;
  for (let n = 2; n <= 12; n++) if (mapsOnto(vs, rotateP(axis, 360 / n))) best = n;
  return best;
}

function symmetryCounts(raw: P3[]): { planes: number; axes: number; centre: boolean } {
  const vs = centred(raw);
  const normals = uniqueDirections(vs.flatMap((p, i) => vs.slice(i + 1).map((q) => sub3(p, q))));
  const planes = normals.filter((n) => mapsOnto(vs, reflectP(n)));
  const candidates = uniqueDirections([
    ...planes.flatMap((n, i) => planes.slice(i + 1).map((m) => cross3(n, m))),
    ...vs,
    ...vs.flatMap((p, i) => vs.slice(i + 1).map((q): P3 => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2])),
  ]);
  const axes = candidates.filter((d) => maxOrder(vs, d) >= 2);
  return { planes: planes.length, axes: axes.length, centre: mapsOnto(vs, (p) => [-p[0], -p[1], -p[2]]) };
}

const box = (a: number, b: number, c: number): P3[] => [0, a].flatMap((x) => [0, b].flatMap((y) => [0, c].map((z): P3 => [x, y, z])));

function ngon(n: number, side: number, z: number): P3[] {
  const R = side / (2 * Math.sin(Math.PI / n));
  return Array.from({ length: n }, (_, k): P3 => [R * Math.cos((2 * Math.PI * k) / n), R * Math.sin((2 * Math.PI * k) / n), z]);
}

const prism = (n: number, side: number, h: number) => [...ngon(n, side, 0), ...ngon(n, side, h)];
const pyramid = (n: number, side: number, h: number): P3[] => [...ngon(n, side, 0), [0, 0, h]];

describe("Etappe 3: Raumgeometrie", () => {
  it("has its lessons in order, with the Zweige and Lernbereiche of the curriculum", () => {
    expect(STAGE_RAUMGEOMETRIE.id).toBe("stage-3-raumgeometrie");
    expect(STAGE_RAUMGEOMETRIE.stageNumber).toBe(3);
    expect(STAGE_RAUMGEOMETRIE.accent).toBe("#0891b2");
    expect(STAGE_RAUMGEOMETRIE.lessons.map((l) => l.id)).toEqual(IDS);
    STAGE_RAUMGEOMETRIE.lessons.forEach((l, index) => {
      expect(l.stageId).toBe("stage-3-raumgeometrie");
      expect(l.stepNumber).toBe(index + 1);
      expect(l.title.startsWith(`3.${index + 1} `), l.title).toBe(true);
      const zweigI = index < 4;
      expect(l.tracks).toEqual(zweigI ? ["I"] : ["II_III"]);
      expect(l.lehrplan.startsWith(zweigI ? "M8 LB 3 (I): " : "M8 LB 2 (II/III): "), l.lehrplan).toBe(true);
      expect(l.lab.goals).toHaveLength(3);
      expect(l.exercises.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps later grades and programmer notation out of lessons and tasks", () => {
    const allTexts = (task: ExerciseTask) =>
      [
        task.prompt,
        ...task.given,
        task.formulaHint ?? "",
        ...task.steps,
        ...task.fields.flatMap((f) => (f.kind === "number" ? [f.label, ...(f.slips ?? []).map((s) => s.hint)] : [f.label, ...f.options])),
      ]
        .map(plain)
        .join(" \n ");
    for (const l of STAGE_RAUMGEOMETRIE.lessons) {
      const lessonText = plain([l.explanationHtml, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.map((f) => `${f.html} ${f.quantities}`)].join(" "));
      expect(lessonText, l.id).not.toMatch(/Pythagoras|\bsin\b|\bcos\b|\btan\b|Volumen von|ℝ/);
      for (const g of l.exercises) {
        for (const level of [1, 2] as const) {
          for (const task of tasks(l.id, g.id, level)) {
            const text = allTexts(task);
            expect(text, `${l.id}/${g.id}: grade 9 content`).not.toMatch(/Pythagoras|\bsin\b|\bcos\b|\btan\b|√/);
            expect(text, `${l.id}/${g.id}: y_P or a backslash`).not.toMatch(/[a-z]_[A-Za-z]|\\/);
            expect(text, `${l.id}/${g.id}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±;[\]])-\d/);
            expect(text, `${l.id}/${g.id}: decimal point`).not.toMatch(/\d\.(\d{1,2}|\d{4,})(?!\d)/);
            expect(text, `${l.id}/${g.id}: "1x" or "+ 0"`).not.toMatch(/(^|[^\d,])1x|\+ 0(?![,\d])/);
          }
        }
      }
    }
  });
});

describe("Aufgaben der Etappe 3 rechnen richtig", () => {
  it("3.1 counts of planes, axes and the centre agree with a brute-force count over the vertices", () => {
    const seen = new Set<number>();
    for (const task of tasks("rg-1-koerpersymmetrie", "zaehlen", 1)) {
      const m = meta(task);
      seen.add(m.kind);
      const vs =
        m.kind === 0
          ? box(m.a, m.b, m.c)
          : m.kind === 1
            ? box(m.a, m.a, m.h)
            : m.kind === 2
              ? box(m.a, m.a, m.a)
              : m.kind === 3
                ? pyramid(4, m.a, m.h)
                : m.kind === 7
                  ? pyramid(m.n, m.a, m.h)
                  : prism(m.n, m.a, m.h);
      const counts = symmetryCounts(vs);
      expect(num(task, 0), task.prompt).toBe(counts.planes);
      expect(num(task, 1), task.prompt).toBe(counts.axes);
      expect(choice(task, 2).correctIndex === 0, task.prompt).toBe(counts.centre);
      if (m.kind === 0) expect(new Set([m.a, m.b, m.c]).size).toBe(3);
      if (m.kind === 1) expect(m.h).not.toBe(m.a);
    }
    expect(seen.size).toBe(9);
  });

  it("3.1 real objects: the right counts are offered once among four options", () => {
    for (const task of tasks("rg-1-koerpersymmetrie", "zaehlen", 2)) {
      const o = SYM_OBJECTS[meta(task).index];
      expect(choice(task, 0).options).toHaveLength(4);
      expect(choice(task, 1).options).toHaveLength(4);
      expect(picked(task, 0)).toBe(o.planes);
      expect(picked(task, 1)).toBe(o.axes);
      expect(choice(task, 2).correctIndex === 0).toBe(o.centre);
    }
    // the polyhedral objects agree with the brute-force count
    const check = (index: number, vs: P3[]) => {
      const c = symmetryCounts(vs);
      expect(SYM_OBJECTS[index].planes, SYM_OBJECTS[index].text).toBe(String(c.planes));
      expect(SYM_OBJECTS[index].axes, SYM_OBJECTS[index].text).toBe(String(c.axes));
      expect(SYM_OBJECTS[index].centre).toBe(c.centre);
    };
    check(0, box(1, 1, 1));
    check(1, box(32, 20, 12));
    check(2, prism(6, 1, 0.8));
    check(3, [...prism(6, 1, 3), [0, 0, 4], [0, 0, -1]]);
    check(4, [[0, 0, 0], [3, 0, 0], [1.5, 0, 2], [0, 5, 0], [3, 5, 0], [1.5, 5, 2]]);
    check(5, prism(3, 2, 5));
    check(6, pyramid(4, 35, 21.6));
    check(13, box(2, 2, 5));
  });

  it("3.1 smallest angles: 360° : n, and n is the order of the axis in the body", () => {
    const geometry: Array<[P3[], P3]> = [
      [box(2, 2, 2), [1, 1, 1]],
      [box(2, 2, 2), [0, 0, 1]],
      [box(2, 2, 2), [1, 1, 0]],
      [box(2, 3, 5), [0, 0, 1]],
      [box(2, 2, 5), [0, 0, 1]],
      [prism(3, 2, 4), [0, 0, 1]],
      [prism(6, 1, 4), [0, 0, 1]],
      [pyramid(5, 2, 3), [0, 0, 1]],
      [prism(8, 1, 3), [0, 0, 1]],
      [pyramid(4, 2, 3), [0, 0, 1]],
      [prism(6, 1, 3), [1, 0, 0]],
    ];
    expect(geometry).toHaveLength(TURN_CASES.length);
    TURN_CASES.forEach((t, i) => {
      const [vs, axis] = geometry[i];
      const d = direction(axis) as P3;
      expect(maxOrder(centred(vs), d), `${t.body}, ${t.axis}`).toBe(t.n);
    });
    for (const task of tasks("rg-1-koerpersymmetrie", "drehwinkel", 1)) {
      const { n } = meta(task);
      close(num(task, 0) * n, 360);
      expect(num(task, 1)).toBe(n);
      expect(Number.isInteger(num(task, 0))).toBe(true);
    }
    for (const task of tasks("rg-1-koerpersymmetrie", "drehwinkel", 2)) {
      const o = TURN_OBJECTS[meta(task).index];
      close(num(task, 0), 360 / o.n);
      expect(Number.isInteger(num(task, 0))).toBe(true);
      expect(choice(task, 1).correctIndex === 0).toBe(o.centre);
    }
  });

  it("3.2 figure → body: body, Axialschnitt and its width 2r", () => {
    for (const task of tasks("rg-2-axialschnitte", "figur-koerper", 1)) {
      const m = meta(task);
      expect(picked(task, 0)).toBe(BODIES[m.kind]);
      expect(picked(task, 1)).toBe(SECTIONS[m.kind]);
      close(num(task, 2), 2 * m.r);
      if (m.kind === 3) expect(m.r2).not.toBe(m.r);
    }
    for (const task of tasks("rg-2-axialschnitte", "figur-koerper", 2)) {
      const m = meta(task);
      expect(picked(task, 0)).toBe(COMPOSITE_SECTIONS[m.ctx]);
      expect(choice(task, 0).options).toHaveLength(4);
      const expected = [
        [2 * m.r, m.h + m.k],
        [m.D - 2 * m.w, (m.D - 2 * m.w) / 2],
        [2 * m.r, 2 * m.h],
        [2 * m.r1, 2 * m.r2],
        [2 * m.r, m.h + m.r],
      ][m.ctx];
      close(num(task, 1), expected[0]);
      close(num(task, 2), expected[1]);
      expect(num(task, 1)).toBeGreaterThan(0);
      expect(num(task, 2)).toBeGreaterThan(0);
    }
  });

  it("3.2 measures from the Axialschnitt: radius = half the width", () => {
    for (const task of tasks("rg-2-axialschnitte", "masse", 1)) {
      const m = meta(task);
      expect(picked(task, 0)).toBe(BODIES[m.kind]);
      close(num(task, 1), m.r);
      close(num(task, 2), m.h);
      const shown = plain(task.prompt).match(m.kind === 2 ? /Durchmesser (\d+) cm/ : /(\d+) cm (breit|und)/);
      if (m.kind !== 3) close(m.r * 2, Number(shown?.[1] ?? Number.NaN));
    }
    for (const task of tasks("rg-2-axialschnitte", "masse", 2)) {
      const m = meta(task);
      const expected = [
        [m.u / 8, m.u / 4],
        [m.A / m.h, m.A / (2 * m.h)],
        [m.u / 6, m.u / 3],
        [m.B / 2, m.B / 2 - m.w],
        [(m.u - 2 * m.s - m.g2) / 2, m.g2 / 2],
      ][m.ctx];
      close(num(task, 0), expected[0]);
      close(num(task, 1), expected[1]);
      expect(num(task, 1)).toBeGreaterThan(0);
      // the Kegelstumpf exists: the legs reach across half the difference of the widths
      if (m.ctx === 4) expect(m.s).toBeGreaterThan(num(task, 0) - num(task, 1));
    }
  });

  it("3.3 corners and midpoints of a cuboid in the system, with whole coordinates", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
    let mids = 0;
    for (const task of tasks("rg-3-raumkoordinaten", "quader-punkte", 1)) {
      const m = meta(task);
      let target: number[];
      if (m.mid === 1) {
        mids += 1;
        const p = cuboidVertex(names[m.e0], m.a, m.b, m.c);
        const q = cuboidVertex(names[m.e1], m.a, m.b, m.c);
        // the two corners are the ends of one edge: they differ in one coordinate
        expect(p.filter((v, i) => v !== q[i])).toHaveLength(1);
        target = p.map((v, i) => (v + q[i]) / 2);
        for (const v of target) expect(Number.isInteger(v), task.prompt).toBe(true);
      } else {
        const name = plain(task.prompt).match(/die Ecke ([B-H])/)?.[1] ?? "";
        target = [name === "B" || name === "C" || name === "F" || name === "G" ? m.a : 0, "CDGH".includes(name) ? m.b : 0, "EFGH".includes(name) ? m.c : 0];
      }
      target.forEach((v, i) => expect(num(task, i)).toBe(v));
    }
    expect(mids).toBeGreaterThan(50);
    expect(mids).toBeLessThan(140);
    for (const task of tasks("rg-3-raumkoordinaten", "quader-punkte", 2)) {
      const m = meta(task);
      const expected = [
        [m.L / 2, m.B / 2, m.H - m.p1],
        [m.p1, m.p2, m.H],
        [m.L, m.B, m.H],
        [m.p1, 0, m.p2],
        [m.p1, m.B - m.p2, m.p3],
      ][m.ctx];
      expected.forEach((v, i) => close(num(task, i), v));
      // inside the room
      expect(num(task, 0)).toBeGreaterThanOrEqual(0);
      expect(num(task, 0)).toBeLessThanOrEqual(m.L);
      expect(num(task, 1)).toBeGreaterThanOrEqual(0);
      expect(num(task, 1)).toBeLessThanOrEqual(m.B);
      expect(num(task, 2)).toBeGreaterThanOrEqual(0);
      expect(num(task, 2)).toBeLessThanOrEqual(m.H);
    }
  });

  it("3.3 location of a point and its distance from a coordinate plane", () => {
    const zeros = [0, 0, 0];
    for (const task of tasks("rg-3-raumkoordinaten", "lage", 1)) {
      const { x, y, z, plane, distance } = meta(task);
      const where = locationOf(x, y, z);
      expect(where).not.toBe("im Ursprung");
      expect(picked(task, 0)).toBe(where);
      expect(choice(task, 0).options).toHaveLength(4);
      for (const option of choice(task, 0).options) expect(LOCATIONS).toContain(option);
      expect(distance).toBe(Math.abs([x, y, z][plane]));
      expect(num(task, 1)).toBe(distance);
      zeros[[x, y, z].filter((c) => c === 0).length] += 1;
    }
    expect(zeros.every((count) => count > 15), `${zeros}`).toBe(true);
    for (const task of tasks("rg-3-raumkoordinaten", "lage", 2)) {
      const { px, py, pz, target, distance } = meta(task);
      const spot = [target === 2 ? 0 : px, target === 1 ? 0 : py, target === 0 ? 0 : pz];
      spot.forEach((v, i) => expect(num(task, i)).toBe(v));
      expect(num(task, 3)).toBe(distance);
      expect(distance).toBe([pz, py, px][target]);
    }
  });

  it("3.4 corners of moved cuboids and edge lengths from two corners", () => {
    const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (const task of tasks("rg-4-koerper-koordinaten", "quader-ecken", 1)) {
      const m = meta(task);
      if (m.variant === 0) {
        const name = names[m.vertex];
        const expected = [m.ax + ("BCFG".includes(name) ? m.a : 0), m.ay + ("CDGH".includes(name) ? m.b : 0), m.az + ("EFGH".includes(name) ? m.c : 0)];
        expected.forEach((v, i) => expect(num(task, i), task.prompt).toBe(v));
        expect(name).not.toBe("A");
      } else {
        expect([num(task, 0), num(task, 1), num(task, 2)]).toEqual([m.a, m.b, m.c]);
        // the shown G is A plus the edges
        expect(plain(task.prompt)).toContain(`G(${m.ax + m.a} | ${m.ay + m.b} | ${m.az + m.c})`);
      }
    }
    for (const task of tasks("rg-4-koerper-koordinaten", "quader-ecken", 2)) {
      const m = meta(task);
      const expected = [
        [m.a + m.dx, m.b + m.dy, m.c + m.t],
        [m.ax + m.a, m.ay + m.b + m.m, 0],
        [m.s, m.s, m.n * m.s],
      ][m.ctx];
      expected.forEach((v, i) => expect(num(task, i), task.prompt).toBe(v));
      if (m.ctx === 1) expect(num(task, 3)).toBe(m.b);
    }
  });

  it("3.4 apex of a pyramid over the midpoint of the diagonal, a tent ridge and a moved apex", () => {
    for (const task of tasks("rg-4-koerper-koordinaten", "pyramide-spitze", 1)) {
      const m = meta(task);
      [(m.x1 + m.x2) / 2, (m.y1 + m.y2) / 2, m.z0 + m.h].forEach((v, i) => expect(num(task, i)).toBe(v));
      expect(Number.isInteger((m.x1 + m.x2) / 2) && Number.isInteger((m.y1 + m.y2) / 2)).toBe(true);
    }
    for (const task of tasks("rg-4-koerper-koordinaten", "pyramide-spitze", 2)) {
      const m = meta(task);
      const expected = [
        [m.p / 2, m.q / 2, m.T + m.r],
        [m.L, m.W / 2, m.H],
        [(m.x1 + m.x2) / 2, (m.y1 + m.y2) / 2 + m.dy, m.h + m.dz],
      ][m.ctx];
      expected.forEach((v, i) => close(num(task, i), v));
      if (m.ctx === 1) expect(num(task, 3)).toBe(m.L);
    }
  });

  it("3.5 drawn lengths and angles follow from q and ω, recomputed from the Schrägbild itself", () => {
    // picture of a point (x along s, y into the depth, z up)
    const pic = (q: number, omega: number, x: number, y: number, z: number): [number, number] => [x + q * y * Math.cos((omega * Math.PI) / 180), z + q * y * Math.sin((omega * Math.PI) / 180)];
    const angleAt = (v: [number, number], p: [number, number], r: [number, number]) => {
      const a = Math.atan2(p[1] - v[1], p[0] - v[0]);
      const b = Math.atan2(r[1] - v[1], r[0] - v[0]);
      let d = Math.abs(a - b) * (180 / Math.PI);
      if (d > 180) d = 360 - d;
      return d;
    };
    for (const task of tasks("rg-5-schraegbilder", "zeichnen", 1)) {
      const { q, omega, front, depth, h } = meta(task);
      const B = pic(q, omega, front, 0, 0);
      const C = pic(q, omega, front, depth, 0);
      close(num(task, 0), front);
      close(num(task, 1), Math.hypot(C[0] - B[0], C[1] - B[1]), 1e-9);
      close(num(task, 2), h);
      // the drawn length has at most two decimals and is exact
      expect(Math.abs(num(task, 1) * 100 - Math.round(num(task, 1) * 100))).toBeLessThan(1e-6);
    }
    for (const task of tasks("rg-5-schraegbilder", "zeichnen", 2)) {
      const m = meta(task);
      if (m.kind === 0) {
        close(num(task, 0), m.q * m.b);
        close(num(task, 1), m.h);
        const A = pic(m.q, m.omega, 0, 0, 0);
        const B = pic(m.q, m.omega, m.a, 0, 0);
        const C = pic(m.q, m.omega, m.a, m.b, 0);
        close(num(task, 2), angleAt(B, A, C), 1e-9);
        expect(picked(task, 3)).toBe("[AB] und [MS]");
      } else {
        expect(m.onS + m.depth).toBe(m.onS === m.B ? m.B + m.L : m.L + m.B);
        expect(picked(task, 0)).toBe(`die Fläche ${m.onS} cm × ${m.H} cm`);
        close(num(task, 1), m.depth / 2);
        close(num(task, 2), 180 - m.omega);
      }
    }
  });

  it("3.5 true lengths from the picture: divided by q, and the square base only when the edges agree", () => {
    for (const task of tasks("rg-5-schraegbilder", "zurueck", 1)) {
      const m = meta(task);
      close(num(task, 0), m.front);
      close(num(task, 1), m.drawn / m.q);
      close(num(task, 2), m.h);
    }
    let squares = 0;
    for (const task of tasks("rg-5-schraegbilder", "zurueck", 2)) {
      const m = meta(task);
      close(num(task, 0), m.drawn / m.q);
      close(num(task, 1), m.a * (m.drawn / m.q));
      expect(choice(task, 2).correctIndex === 0).toBe(m.a === m.b);
      squares += m.square;
    }
    expect(squares).toBeGreaterThan(60);
    expect(squares).toBeLessThan(140);
  });

  it("3.6 Tiefenkanten, the right figure for a lateral edge and the half diagonal", () => {
    for (const task of tasks("rg-6-wahre-groesse", "tiefenkanten", 1)) {
      const m = meta(task);
      close(num(task, 0), m.drawn / m.q);
      expect(picked(task, 1)).toBe("die Kante [BF]");
      expect(picked(task, 2)).toBe("∢ABF");
    }
    for (const task of tasks("rg-6-wahre-groesse", "tiefenkanten", 2)) {
      const m = meta(task);
      close(num(task, 0), m.b);
      expect(Math.abs(m.d - Math.hypot(m.a, m.b))).toBeLessThanOrEqual(0.05 + 1e-9);
      close(num(task, 2), m.d / 2);
      expect(picked(task, 1)).toMatch(/^das Dreieck [ABCD]MS mit dem rechten Winkel bei M$/);
      const corner = picked(task, 1).charAt(12);
      expect(plain(task.prompt)).toContain(`Gesucht ist die Seitenkante [${corner}S]`);
    }
  });

  it("3.6 special angles: their true size, and how they look in the Schrägbild (ω = 45°, q = ½)", () => {
    const q = 0.5;
    const c45 = Math.SQRT1_2;
    const pic = (p: P3): [number, number] => [p[0] + q * p[1] * c45, p[2] + q * p[1] * c45];
    const angle3 = (v: P3, p: P3, r: P3) => (Math.acos(dot3(sub3(p, v), sub3(r, v)) / (norm3(sub3(p, v)) * norm3(sub3(r, v)))) * 180) / Math.PI;
    const angle2 = (v: [number, number], p: [number, number], r: [number, number]) => {
      const u = [p[0] - v[0], p[1] - v[1]];
      const w = [r[0] - v[0], r[1] - v[1]];
      return (Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]))) * 180) / Math.PI;
    };
    // cube 4, cuboid 6 × 4 × 3, pyramid with all edges 4 (height 4 : √2)
    const cube: Record<string, P3> = { A: [0, 0, 0], B: [4, 0, 0], C: [4, 4, 0], D: [0, 4, 0], E: [0, 0, 4], F: [4, 0, 4], G: [4, 4, 4], H: [0, 4, 4] };
    const cuboid: Record<string, P3> = { A: [0, 0, 0], B: [6, 0, 0], C: [6, 4, 0], D: [0, 4, 0], E: [0, 0, 3], F: [6, 0, 3], G: [6, 4, 3], H: [0, 4, 3] };
    const pyr: Record<string, P3> = { A: [0, 0, 0], B: [4, 0, 0], S: [2, 2, 4 * Math.SQRT1_2] };
    const bodies = [cube, cube, cuboid, cuboid, cuboid, pyr, cube, cuboid];
    expect(bodies).toHaveLength(ANGLE_CASES.length);
    ANGLE_CASES.forEach((c, i) => {
      const pts = bodies[i];
      const [p, v, r] = c.name.slice(1).split("").map((n) => pts[n]);
      close(angle3(v, p, r), c.value, 1e-9);
      const drawn = angle2(pic(v), pic(p), pic(r));
      const expected = Math.abs(drawn - c.value) < 1e-6 ? "gleich" : drawn < c.value ? "kleiner" : "größer";
      expect(c.picture, `${c.name}: ${drawn.toFixed(1)}° im Bild`).toBe(expected);
    });
    for (const task of tasks("rg-6-wahre-groesse", "winkel-figur", 1)) {
      const c = ANGLE_CASES[meta(task).index];
      expect(num(task, 0)).toBe(c.value);
      expect(picked(task, 1)).toBe(COMPARE[["kleiner", "gleich", "größer"].indexOf(c.picture)]);
    }
  });

  it("3.6 diagonal sections in true size: a rectangle or an isosceles triangle, never borderline", () => {
    for (const task of tasks("rg-6-wahre-groesse", "winkel-figur", 2)) {
      const m = meta(task);
      expect(Math.abs(m.d - Math.hypot(m.a, m.b))).toBeLessThanOrEqual(0.05 + 1e-9);
      if (m.kind === 0) {
        expect(picked(task, 0)).toBe("ein Rechteck");
        close(num(task, 1), m.d * m.c);
        close(num(task, 2), 2 * (m.d + m.c));
        expect(Math.abs(m.d - m.c)).toBeGreaterThanOrEqual(0.5);
      } else {
        expect(picked(task, 0)).toBe("ein gleichschenkliges Dreieck");
        close(num(task, 1), m.d / 2);
        close(num(task, 2), (m.d * m.h) / 2);
        // far from equilateral: the legs differ clearly from the base
        expect(Math.abs(Math.hypot(m.h, m.d / 2) - m.d)).toBeGreaterThan(0.3);
      }
    }
  });
});

describe("Labore der Etappe 3", () => {
  it("3.1 the candidates show the symmetry counts of each body, and the verdicts read right", () => {
    const lab = lesson("rg-1-koerpersymmetrie").lab;
    const count = (body: number) => {
      const planes = Array.from({ length: 13 }, (_, i) => symmetryOf({ body, elem: 0, k: i + 1, alpha: 0, view: 30 }).symmetric).filter(Boolean).length;
      const orders = Array.from({ length: 13 }, (_, i) => symmetryOf({ body, elem: 1, k: i + 1, alpha: 0, view: 30 }).order).filter((o) => o >= 2);
      const centre = symmetryOf({ body, elem: 2, k: 1, alpha: 0, view: 30 }).symmetric;
      return { planes, orders: orders.sort(), centre };
    };
    expect(count(0)).toEqual({ planes: 3, orders: [2, 2, 2], centre: true });
    expect(count(1)).toEqual({ planes: 5, orders: [2, 2, 2, 2, 4], centre: true });
    expect(count(2)).toEqual({ planes: 9, orders: [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4], centre: true });
    expect(count(3)).toEqual({ planes: 4, orders: [4], centre: false });
    expect(count(4).planes).toBe(5);
    expect(count(4).orders).toEqual([2, 2, 2, 2, Infinity]);
    expect(count(4).centre).toBe(true);
    expect(count(5)).toEqual({ planes: 4, orders: [Infinity], centre: false });
    expect(count(6).planes).toBe(13);
    expect(count(6).orders.every((o) => o === Infinity)).toBe(true);
    // the box candidates agree with the brute-force count of the Quader of the lab
    const q = SYM_BODIES[0];
    const c = symmetryCounts(box(2 * q.hx, 2 * q.hy, 2 * q.hz));
    expect([c.planes, c.axes, c.centre]).toEqual([3, 3, true]);
    expect(at(lab, {}).r.urteil).toBe("Symmetrieebene");
    expect(at(lab, { body: 2, elem: 1, k: 10 }).r.urteil).toBe("Symmetrieachse, kleinster Winkel 120°");
    expect(at(lab, { body: 5, elem: 1, k: 3 }).r.urteil).toBe("Symmetrieachse für jeden Winkel");
    expect(at(lab, { body: 3, elem: 2 }).r.urteil).toBe("kein Symmetriezentrum");
    expect(at(lab, { body: 0, elem: 0, k: 4 }).r.urteil).toBe("keine Symmetrieebene");
    // the corner axis of the cube matches exactly at 120° and 240°
    const goal = lab.goals.find((g) => g.id === "ecken-achse")!;
    for (let alpha = 0; alpha <= 345; alpha += 15) {
      const { v, r } = at(lab, { body: 2, elem: 1, k: 11, alpha });
      expect(goal.check(v, r), `${alpha}°`).toBe(alpha === 120 || alpha === 240);
    }
  });

  it("3.2 the Axialschnitt is twice the figure, and the equilateral cone is found where s = 2r", () => {
    const lab = lesson("rg-2-axialschnitte").lab;
    const start = at(lab, {});
    expect(start.r.body).toBe("Zylinder");
    expect(start.r.section).toBe("Rechteck 5 cm × 4 cm");
    expect(start.r.breite).toBe(5);
    expect(start.r.s).toBe("keine");
    expect(at(lab, { r: 2, h: 3, d: 1.5 }).r.section).toBe("zwei Rechtecke je 2 cm × 3 cm, 3 cm voneinander entfernt");
    expect(at(lab, { r: 2, d: 1.5 }).r.breite).toBe(7);
    expect(at(lab, { shape: 2, r: 3 }).r.hoehe).toBe(6);
    expect(at(lab, { shape: 3, r: 2, r2: 2 }).r.body).toBe("Zylinder");
    close(Number(at(lab, { shape: 1, r: 3, h: 4 }).r.s), 5);
    const goal = lab.goals.find((g) => g.id === "gleichseitig")!;
    for (const values of enumerateLabGrid(lab, 8)) {
      const v = values as LabValues;
      const s = axialSlant(v);
      const ok = v.shape === 1 && s !== null && Math.abs(s - axialWidth(v)) <= 0.02 * axialWidth(v);
      expect(goal.check(v, computeReadouts(lab, v))).toBe(ok);
    }
  });

  it("3.3 the picture of a point does not show its coordinates: the readouts and the shortened x-axis", () => {
    const lab = lesson("rg-3-raumkoordinaten").lab;
    const start = at(lab, {});
    expect(start.r.P).toBe("P(2 | 3 | 2)");
    expect(start.r.lageP).toBe("in keiner Koordinatenebene");
    expect(at(lab, { x: 0, y: 0, z: 3 }).r.lageP).toBe("auf der z-Achse");
    expect(at(lab, { x: 4, y: 0, z: 2 }).r.lageP).toBe("in der xz-Ebene");
    expect(at(lab, { x: 0, y: 0, z: 0 }).r.lageP).toBe("im Ursprung");
    // one unit of x is drawn ½ · cos 45° to the left and down
    close(pictureDistance(vec(0, 0, 0), vec(1, 0, 0)), 0.5);
    close(pictureDistance(vec(0, 2, 2), vec(3, 3, 3)), Math.SQRT2 * Math.abs(1 - 3 * 0.5 * Math.SQRT1_2));
    expect(pictureDistance(vec(0, 2, 2), vec(3, 3, 3))).toBeLessThan(0.1);
    const witness = GOAL_WITNESSES_STAGE_3["rg-3-raumkoordinaten"]["gleiches-bild"];
    expect(at(lab, witness).r.bild).toBeLessThan(0.1);
  });

  it("3.4 the corners of the three bodies, and the apex goal exactly where S = (2 | 3 | 5)", () => {
    const lab = lesson("rg-4-koerper-koordinaten").lab;
    const start = at(lab, {});
    expect(start.r.top).toBe("G(3 | 4 | 2)");
    expect(start.r.M).toBe("M(1,5 | 2 | 0)");
    expect(at(lab, { body: 1 }).r.top).toBe("S(1,5 | 2 | 2)");
    expect(at(lab, { body: 2 }).r.top).toBe("First von E(0 | 2 | 2) bis F(3 | 2 | 2)");
    expect(at(lab, { ax: 1, ay: 2, az: 1 }).r.top).toBe("G(4 | 6 | 3)");
    const names = solidVertices({ ...start.v, body: 0 }).map((n) => n.name).join("");
    expect(names).toBe("ABCDEFGH");
    const goal = lab.goals.find((g) => g.id === "spitze")!;
    for (const values of enumerateLabGrid(lab, 5)) {
      const v = values as LabValues;
      const S = solidTop(v).p;
      expect(goal.check(v, computeReadouts(lab, v))).toBe(v.body === 1 && S.x === 2 && S.y === 3 && S.z === 5);
    }
  });

  it("3.5 the picture of the base is a square exactly in the goal's settings", () => {
    const lab = lesson("rg-5-schraegbilder").lab;
    const start = at(lab, {});
    expect(start.r.tiefe).toBe("½ · 4 cm = 2 cm");
    expect(start.r.vorne).toBe("a = 5 cm, unverkürzt");
    expect(at(lab, { pos: 1 }).r.tiefe).toBe("½ · 5 cm = 2,5 cm");
    expect(at(lab, { q: 0.25, b: 6 }).r.tiefe).toBe("¼ · 6 cm = 1,5 cm");
    const goal = lab.goals.find((g) => g.id === "quadrat-bild")!;
    const pic = (v: LabValues, p: { x: number; y: number; z: number }): [number, number] => [p.x + v.q * p.y * Math.cos((v.omega * Math.PI) / 180), p.z + v.q * p.y * Math.sin((v.omega * Math.PI) / 180)];
    for (const values of enumerateLabGrid(lab, 4)) {
      const v = values as LabValues;
      if (v.body !== 2) continue;
      const [A, B, , D] = obliqueSolid(v).verts.map((p) => pic(v, p));
      const ab = [B[0] - A[0], B[1] - A[1]];
      const ad = [D[0] - A[0], D[1] - A[1]];
      const square = Math.abs(Math.hypot(ab[0], ab[1]) - Math.hypot(ad[0], ad[1])) < 1e-9 && Math.abs(ab[0] * ad[0] + ab[1] * ad[1]) < 1e-9;
      const { front, depth } = obliqueDims(v);
      expect(goal.check(v, computeReadouts(lab, v)), JSON.stringify(v)).toBe(square && front !== depth);
    }
  });

  it("3.6 the measured lengths and angles of the true-size figures, and the numbers of the example", () => {
    const lab = lesson("rg-6-wahre-groesse").lab;
    const start = at(lab, {});
    // the example of the lesson: 6 × 4 × 3, [AC] ≈ 7,2 cm, [AG] ≈ 7,8 cm, in the picture about 8,6 cm
    expect(start.r.strecke).toBe("[AG] ≈ 7,8 cm");
    close(Math.hypot(6, 4), 7.211, 1e-3);
    const G = [6 + 0.5 * 4 * Math.SQRT1_2, 3 + 0.5 * 4 * Math.SQRT1_2];
    close(Math.hypot(G[0], G[1]), 8.63, 1e-3);
    expect(at(lab, { figQ: 0, a: 5, b: 5 }).r.wahr).toBe("∢BAC ≈ 45°");
    close(drawnAngle({ ...start.v, figQ: 0, a: 5, b: 5 }), (Math.atan(0.5 * Math.SQRT1_2 / (1 + 0.5 * Math.SQRT1_2)) * 180) / Math.PI, 1e-9);
    const pyr = { ...start.v, body: 1, figP: 1, a: 6, b: 8, h: 5 };
    close(trueFigure(pyr).length, Math.sqrt(25 + 25));
    expect(trueFigure({ ...pyr, figP: 2 }).wantedName).toBe("[NS]");
    close(trueFigure({ ...pyr, figP: 2 }).length, Math.sqrt(25 + 16));
    const goal = lab.goals.find((g) => g.id === "gleichseitig")!;
    let reached = 0;
    for (const values of enumerateLabGrid(lab, 11)) {
      const v = values as LabValues;
      const s = Math.sqrt(v.h * v.h + (v.a * v.a) / 4 + (v.b * v.b) / 4);
      const ok = v.body === 1 && v.figP === 0 && Math.abs(s - v.a) <= 0.02 * v.a;
      expect(goal.check(v, computeReadouts(lab, v))).toBe(ok);
      if (ok) reached += 1;
    }
    expect(reached).toBeGreaterThan(0);
  });
});
