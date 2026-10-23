import { describe, expect, it } from "vitest";
import { STAGES } from "../src/curriculum";
import { STAGE_DREHUNG } from "../src/curriculum/stage-2-drehung";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues } from "../src/lab/engine";
import {
  angleAtZ,
  angleText,
  covers,
  isPointSymmetric,
  landingArm,
  orientation,
  reachesTarget,
  rotatedTriangle,
  symmetryAngle,
  TARGET_MIRRORED,
  TARGET_ROTATED,
  targetText,
  TRIANGLE,
  vectorLab,
  vectorReadouts,
} from "../src/lab/views-drehung";
import type { DifficultyLevel, ExerciseTask, LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";

const IDS = ["dr-1-drehung", "dr-2-punktspiegelung", "dr-3-vektoren"];
const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-2:${i}`));

const lesson = (id: string) => {
  const found = STAGE_DREHUNG.lessons.find((l) => l.id === id);
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

function chosen(task: ExerciseTask, index: number): string {
  const field = task.fields[index];
  if (field?.kind !== "choice") throw new Error(`field ${index} of ${task.prompt} is no choice`);
  return field.options[field.correctIndex];
}

const meta = (task: ExerciseTask) => task.meta ?? {};

type P = [number, number];

/** P turned about Z by φ, written out with Math.cos and Math.sin and rounded: independent of turn(). */
function rot(p: P, z: P, phi: number): P {
  const r = (phi * Math.PI) / 180;
  const dx = p[0] - z[0];
  const dy = p[1] - z[1];
  const x = z[0] + dx * Math.cos(r) - dy * Math.sin(r);
  const y = z[1] + dx * Math.sin(r) + dy * Math.cos(r);
  return [Math.round(x * 1e6) / 1e6 + 0, Math.round(y * 1e6) / 1e6 + 0];
}

const eq = (a: P, b: P) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;

describe("Etappe 2: Drehung", () => {
  it("has its lessons in order, all in Zweig I, with the stage meta of the package", () => {
    expect(STAGE_DREHUNG.id).toBe("stage-2-drehung");
    expect(STAGE_DREHUNG.stageNumber).toBe(2);
    expect(STAGE_DREHUNG.title).toBe("Drehung");
    expect(STAGE_DREHUNG.accent).toBe("#7c3aed");
    expect(STAGE_DREHUNG.lehrplanLabel).toBe("LB 2 (nur Zweig I)");
    expect(STAGE_DREHUNG.lessons.map((l) => l.id)).toEqual(IDS);
    expect(STAGE_DREHUNG.lessons.map((l) => l.title)).toEqual(["2.1 Die Drehung", "2.2 Punktspiegelung und Drehsymmetrie", "2.3 Vektoren drehen"]);
    expect(STAGE_DREHUNG.lessons.map((l) => l.lab.kind)).toEqual(["rotation", "point-symmetry", "vector-rotation"]);
    for (const l of STAGE_DREHUNG.lessons) {
      expect(l.tracks).toEqual(["I"]);
      expect(l.lehrplan.startsWith("M8 LB 2 (I): "), l.lehrplan).toBe(true);
    }
  });

  it("uses no content of later grades in its lesson texts", () => {
    for (const l of STAGE_DREHUNG.lessons) {
      const plain = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text)].join(" ");
      expect(plain, l.id).not.toMatch(/Pythagoras|Drehmatrix|sin |cos |Streckung|ℝ|Parabel/);
    }
  });

  it("names a rotation angle ∢PZP' only where it runs counter-clockwise (Bavarian convention)", () => {
    expect(angleAtZ(120)).toBe("∢AZA' = 120°");
    expect(angleAtZ(-90)).toBe("∢A'ZA = 90°");
    expect(angleAtZ(270)).toBe("∢A'ZA = 90°");
    expect(angleAtZ(-270)).toBe("∢AZA' = 90°");
    expect(angleAtZ(180)).toBe("∢AZA' = 180°");
    const text = lesson("dr-1-drehung").explanationHtml;
    expect(text).toContain("für negatives φ, etwa φ = −50°, ist ∢P'ZP = 50°");
  });
});

describe("Labore der Etappe 2", () => {
  it("2.1: Dreieck 2 is ABC turned by 90° about (0 | −1), Dreieck 1 its mirror image with the other Umlaufsinn", () => {
    const abc = TRIANGLE.map((p) => [p.x, p.y] as P);
    TARGET_ROTATED.forEach((q, i) => expect(eq([q.x, q.y], rot(abc[i], [0, -1], 90))).toBe(true));
    expect(TARGET_ROTATED.map((q) => [q.x, q.y])).toEqual([[-2, 1], [-2, 4], [-4, 2]]);
    expect(TARGET_MIRRORED.map((q) => [q.x, q.y])).toEqual([[-1, -2], [-1, -5], [-3, -3]]);
    expect(orientation(TRIANGLE)).toBe(1);
    expect(orientation(TARGET_ROTATED)).toBe(1);
    expect(orientation(TARGET_MIRRORED)).toBe(-1);
  });

  it("2.1: on the slider grid exactly Z(0 | −1) with 90° or −270° reaches Dreieck 2, and nothing reaches Dreieck 1", () => {
    const hits: string[] = [];
    for (let i = 0; i <= 24; i++) {
      for (let j = 0; j <= 24; j++) {
        for (let k = 0; k <= 144; k++) {
          const v: LabValues = { zx: -6 + 0.5 * i, zy: -6 + 0.5 * j, phi: -360 + 5 * k, hilfe: 0 };
          expect(reachesTarget(v, 0)).toBe(false);
          if (reachesTarget(v, 1)) hits.push(`${v.zx}|${v.zy}|${v.phi}`);
        }
      }
    }
    expect(hits).toEqual(["0|-1|-270", "0|-1|90"]);
  });

  it("2.1: every image keeps |ZP| and the Umlaufsinn, and the readouts say what happens", () => {
    for (const zx of [-6, -2.5, 0, 3.5]) {
      for (const zy of [-4, 0.5, 6]) {
        for (const phi of [-355, -180, -45, 15, 90, 200, 360]) {
          const v = { zx, zy, phi, hilfe: 0 };
          const image = rotatedTriangle(v);
          image.forEach((q, i) => expect(Math.hypot(q.x - zx, q.y - zy)).toBeCloseTo(Math.hypot(TRIANGLE[i].x - zx, TRIANGLE[i].y - zy), 9));
          expect(orientation(image)).toBe(1);
        }
      }
    }
    const lab = lesson("dr-1-drehung").lab;
    const r = computeReadouts(lab, defaultLabValues(lab));
    expect(r.radius).toBeCloseTo(Math.sqrt(34), 9);
    expect(r.winkel).toBe("60° (gegen den Uhrzeigersinn), dieselbe Drehung wie −300°");
    expect(r.ziel).toBe("noch keines erreicht");
    expect(angleText(-90)).toBe("−90° (im Uhrzeigersinn), dieselbe Drehung wie 270°");
    // the near miss of the lesson: A and B land on Dreieck 1, C on the other side
    expect(targetText({ zx: -1, zy: 1, phi: -90, hilfe: 0 })).toBe("A' und B' auf Dreieck 1, C' nicht");
    expect(targetText({ ...defaultLabValues(lab), ...GOAL_WITNESSES_STAGE_2["dr-1-drehung"].ziel })).toBe("A'B'C' liegt genau auf Dreieck 2");
    expect(computeReadouts(lab, { zx: 0, zy: -1, phi: 90, hilfe: 0 }).bild).toBe("A'(−2 | 1)");
  });

  it("2.2: the covering angles are those of the arm pattern, found again by brute force", () => {
    for (const n of [2, 3, 4, 5, 6, 8]) {
      for (const pattern of [0, 1, 2]) {
        const angles: number[] = [];
        for (let phi = 1; phi < 360; phi++) {
          const k = (phi * n) / 360;
          let fits = Number.isInteger(k);
          // with two colours, arm i must land on an arm of its own colour
          if (fits && pattern === 2) for (let i = 0; i < n; i++) if ((i % 2) !== (((i + k) % n) % 2)) fits = false;
          expect(covers(n, pattern, phi), `${n}/${pattern}/${phi}`).toBe(fits);
          if (fits) angles.push(phi);
        }
        expect(symmetryAngle(n, pattern)).toBe(angles[0] ?? 360);
        expect(isPointSymmetric(n, pattern)).toBe(angles.includes(180));
      }
    }
    expect(isPointSymmetric(5, 0)).toBe(false);
    expect(isPointSymmetric(6, 2)).toBe(false);
    expect(isPointSymmetric(8, 2)).toBe(true);
    expect(landingArm(5, 72)).toBe(2);
    expect(landingArm(5, 288)).toBe(5);
    expect(landingArm(5, 73)).toBe(0);
    const lab = lesson("dr-2-punktspiegelung").lab;
    const r = computeReadouts(lab, { n: 6, muster: 2, phi: 60 });
    expect(r.deckt).toBe("nein: Die Arme liegen aufeinander, aber die Farben passen nicht.");
    expect(computeReadouts(lab, { n: 5, muster: 0, phi: 72 }).anteil).toBe("1/5");
  });

  it("2.3: the turned vectors follow the rules, and each angle has exactly one centre that sends P to T", () => {
    for (let x = -5; x <= 5; x++) {
      for (let y = -5; y <= 5; y++) {
        for (const phi of [90, -90, 180]) {
          const after = vectorLab({ mode: 0, phi, vx: x, vy: y, zx: 0, zy: 0, bx: 0, by: 0 }).after;
          expect(eq([after.x, after.y], rot([x, y], [0, 0], phi))).toBe(true);
        }
      }
    }
    const centres: string[] = [];
    for (const phi of [90, -90, 180]) {
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const v = { mode: 1, phi, vx: 0, vy: 0, zx: -5 + 0.5 * i, zy: -5 + 0.5 * j, bx: 0, by: 0 };
          const q = vectorLab(v).result[0];
          if (Math.abs(q.x + 1) < 1e-9 && Math.abs(q.y - 2) < 1e-9) centres.push(`${phi}: ${v.zx}|${v.zy}`);
        }
      }
    }
    expect(centres).toEqual(["90: 1|-1", "-90: 2|4", "180: 1.5|1.5"]);
    const lab = lesson("dr-3-vektoren").lab;
    const start = defaultLabValues(lab);
    expect(vectorReadouts(start)).toEqual({ before: "v→: x = 3, y = 1", after: "v'→: x = −1, y = 3", points: "Spitze von v'→ am Ursprung: (−1 | 3)" });
    const square = vectorLab({ ...start, mode: 2, bx: 1, by: -3 });
    expect(square.result.map((p) => [p.x, p.y])).toEqual([[2, 2], [-3, 3]]);
  });
});

describe("Aufgaben der Etappe 2 rechnen richtig", () => {
  it("2.1 winkel: Umkehrabbildung, gleichwertiger Winkel, Hintereinanderausführung, Uhr und Riesenrad", () => {
    for (const task of tasks("dr-1-drehung", "winkel", 1)) {
      const m = meta(task);
      if (m.kind === 0) {
        expect(num(task, 0)).toBe(-m.phi);
        expect(num(task, 1)).toBe(m.phi > 0 ? m.phi - 360 : m.phi + 360);
        expect(Math.abs(num(task, 0))).toBeLessThan(180);
      } else {
        const total = m.p1 + m.p2;
        expect(Math.sign(m.p1)).toBe(Math.sign(m.p2));
        expect(num(task, 0)).toBe(total);
        expect(Math.abs(total)).toBeGreaterThan(180);
        const inRange = num(task, 1);
        expect(inRange).toBeGreaterThan(-180);
        expect(inRange).toBeLessThanOrEqual(180);
        expect(((inRange - total) % 360 + 360) % 360).toBe(0);
      }
    }
    let clocks = 0;
    for (const task of tasks("dr-1-drehung", "winkel", 2)) {
      const m = meta(task);
      if (m.kind === 2) {
        clocks++;
        expect(num(task, 0)).toBe(-6 * m.minutes);
        expect(num(task, 1)).toBe(-m.minutes / 2);
        expect(m.minutes).toBeLessThan(60);
      } else {
        const phi = (360 * m.t) / m.period;
        expect(num(task, 0)).toBe(phi);
        const gondola = num(task, 1);
        expect(Number.isInteger(gondola)).toBe(true);
        expect(gondola).toBe(1 + phi / (360 / m.n));
        expect(gondola).toBeGreaterThan(1);
        expect(gondola).toBeLessThanOrEqual(m.n);
      }
    }
    expect(clocks).toBeGreaterThan(60);
    expect(clocks).toBeLessThan(140);
  });

  it("2.1 gitter: the image by counting, and Z and φ from a triangle and its image", () => {
    let origin = 0;
    let axis = 0;
    for (const task of tasks("dr-1-drehung", "gitter", 1)) {
      const m = meta(task);
      const q = rot([m.px, m.py], [m.zx, m.zy], m.phi);
      expect([num(task, 0), num(task, 1)]).toEqual(q);
      if (m.zx === 0 && m.zy === 0) origin++;
      if (m.px === m.zx || m.py === m.zy) axis++;
    }
    expect(origin).toBeLessThan(15);
    expect(axis).toBeLessThan(50);
    for (const task of tasks("dr-1-drehung", "gitter", 2)) {
      const m = meta(task);
      const z: P = [num(task, 0), num(task, 1)];
      const phi = num(task, 2);
      expect([90, -90, 180]).toContain(phi);
      const corners: P[] = [[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]];
      const images = corners.map((p) => rot(p, z, phi));
      // the images named in the prompt are the corners turned about the answer
      for (const [i, name] of ["A'", "B'", "C'"].entries()) expect(task.prompt).toContain(`${name}(${images[i].map((c) => String(c).replace("-", "−")).join(" | ")})`);
      // no corner of the image on a corner of the triangle
      for (const q of images) for (const p of corners) expect(eq(p, q)).toBe(false);
      if (phi !== 180) {
        // [AA'] and [BB'] run along grid lines, one across the other, so their Mittelsenkrechten can be read off
        const [A, B] = corners;
        const [A1, B1] = images;
        const aHorizontal = A[1] === A1[1];
        expect(aHorizontal || A[0] === A1[0]).toBe(true);
        expect(aHorizontal ? B[0] === B1[0] : B[1] === B1[1]).toBe(true);
      }
    }
  });

  it("2.1 eigenschaften: längen- und winkeltreu, Umlaufsinn, gleichschenkliges Dreieck ZPP'", () => {
    for (const task of tasks("dr-1-drehung", "eigenschaften", 1)) {
      const m = meta(task);
      expect([num(task, 0), num(task, 1), num(task, 2)]).toEqual([m.ab, m.alpha, m.za]);
      expect(chosen(task, 3)).toBe(m.ccw ? "gegen den Uhrzeigersinn" : "im Uhrzeigersinn");
    }
    const positions = new Set<number>();
    for (const task of tasks("dr-1-drehung", "eigenschaften", 2)) {
      const m = meta(task);
      if (m.kind === 0) {
        const size = Math.abs(m.phi);
        const field = task.fields[0];
        if (field.kind === "choice") positions.add(field.correctIndex);
        expect(chosen(task, 0)).toBe(size === 60 ? "gleichseitig" : size === 90 ? "gleichschenklig und rechtwinklig" : "nur gleichschenklig mit der Spitze Z");
        expect(num(task, 1)).toBe(size);
        expect(num(task, 2)).toBe((180 - size) / 2);
        expect(num(task, 1) + 2 * num(task, 2)).toBe(180);
        if (size === 60) expect(num(task, 3)).toBe(m.zp);
      } else {
        expect(num(task, 0)).toBe(180 - 2 * m.base);
        expect(num(task, 1)).toBe((m.clockwise ? -1 : 1) * (180 - 2 * m.base));
        expect(num(task, 0)).toBeGreaterThan(0);
      }
    }
    // the app shows task options in the given order, so the right one moves
    expect(positions.size).toBe(3);
  });

  it("2.2 punktspiegelung: P' = 2Z − P, Parallelogramm aus dem Diagonalenschnittpunkt, Zentrum als Mittelpunkt", () => {
    let sameLine = 0;
    for (const task of tasks("dr-2-punktspiegelung", "punktspiegelung", 1)) {
      const m = meta(task);
      expect([num(task, 0), num(task, 1)]).toEqual([2 * m.zx - m.px, 2 * m.zy - m.py]);
      expect(m.zx !== 0 || m.zy !== 0).toBe(true);
      if (m.px === m.zx || m.py === m.zy) sameLine++;
    }
    expect(sameLine).toBeLessThan(50);
    for (const task of tasks("dr-2-punktspiegelung", "punktspiegelung", 2)) {
      const m = meta(task);
      if (m.kind === 1) {
        const C: P = [num(task, 0), num(task, 1)];
        const D: P = [num(task, 2), num(task, 3)];
        // ABCD is a parallelogram: AB→ = DC→, and its diagonals meet in M
        expect([m.bx - m.ax, m.by - m.ay]).toEqual([C[0] - D[0], C[1] - D[1]]);
        expect([(m.ax + C[0]) / 2, (m.ay + C[1]) / 2]).toEqual([m.mx, m.my]);
        expect([(m.bx + D[0]) / 2, (m.by + D[1]) / 2]).toEqual([m.mx, m.my]);
        expect((m.bx - m.ax) * (m.my - m.ay) - (m.by - m.ay) * (m.mx - m.ax)).not.toBe(0);
      } else {
        const z: P = [num(task, 0), num(task, 1)];
        expect(z).toEqual([(m.ax + m.a1x) / 2, (m.ay + m.a1y) / 2]);
        expect([num(task, 2), num(task, 3)]).toEqual([2 * z[0] - m.bx, 2 * z[1] - m.by]);
      }
    }
  });

  it("2.2 drehsymmetrie: kleinster Drehwinkel, Anzahl, Punktsymmetrie, auch bei Mustern", () => {
    for (const task of tasks("dr-2-punktspiegelung", "drehsymmetrie", 1)) {
      const { n } = meta(task);
      expect(num(task, 0)).toBe(360 / n);
      expect(Number.isInteger(360 / n)).toBe(true);
      expect(num(task, 1)).toBe(n - 1);
      expect(chosen(task, 2)).toBe(n % 2 === 0 ? "ja" : "nein");
    }
    const seen = new Set<number>();
    for (const task of tasks("dr-2-punktspiegelung", "drehsymmetrie", 2)) {
      const { index, repeats } = meta(task);
      seen.add(index);
      expect(num(task, 0)).toBe(360 / repeats);
      expect(num(task, 1)).toBe(repeats - 1);
      expect(chosen(task, 2)).toBe(repeats % 2 === 0 ? "ja" : "nein");
    }
    expect(seen.size).toBe(9);
    const window = tasks("dr-2-punktspiegelung", "drehsymmetrie", 2).find((t) => meta(t).index === 3)!;
    expect(num(window, 0)).toBe(60);
    const star = tasks("dr-2-punktspiegelung", "drehsymmetrie", 2).find((t) => meta(t).index === 7)!;
    expect([num(star, 0), num(star, 1), chosen(star, 2)]).toEqual([72, 4, "nein"]);
  });

  it("2.3 vektor: Regeln, Dreieck um eine Ecke, Urpunkt durch Zurückdrehen", () => {
    for (const task of tasks("dr-3-vektoren", "vektor", 1)) {
      const m = meta(task);
      expect([num(task, 0), num(task, 1)]).toEqual(rot([m.vx, m.vy], [0, 0], m.phi));
      expect(Math.abs(m.vx)).not.toBe(Math.abs(m.vy));
    }
    for (const task of tasks("dr-3-vektoren", "vektor", 2)) {
      const m = meta(task);
      if (m.kind === 1) {
        expect([num(task, 0), num(task, 1)]).toEqual(rot([m.bx, m.by], [m.ax, m.ay], m.phi));
        expect([num(task, 2), num(task, 3)]).toEqual(rot([m.cx, m.cy], [m.ax, m.ay], m.phi));
      } else {
        // turning the answer P about Z gives the P' of the task
        expect(rot([num(task, 0), num(task, 1)], [m.zx, m.zy], m.phi)).toEqual([m.qx, m.qy]);
      }
    }
  });

  it("2.3 figur: Quadrate aus zwei Ecken, aus Ecke und Mittelpunkt, Rechteck mit doppelter Seite", () => {
    const square = (pts: P[], ccw: boolean) => {
      const [A, B, C, D] = pts;
      const ab: P = [B[0] - A[0], B[1] - A[1]];
      const ad: P = [D[0] - A[0], D[1] - A[1]];
      expect(ab[0] * ad[0] + ab[1] * ad[1] + 0).toBe(0);
      expect(ab[0] ** 2 + ab[1] ** 2).toBe(ad[0] ** 2 + ad[1] ** 2);
      expect(Math.sign(ab[0] * ad[1] - ab[1] * ad[0])).toBe(ccw ? 1 : -1);
      expect([C[0] - B[0], C[1] - B[1]]).toEqual(ad);
    };
    for (const task of tasks("dr-3-vektoren", "figur", 1)) {
      const m = meta(task);
      square([[m.ax, m.ay], [m.bx, m.by], [num(task, 2), num(task, 3)], [num(task, 0), num(task, 1)]], !m.clockwise);
    }
    for (const task of tasks("dr-3-vektoren", "figur", 2)) {
      const m = meta(task);
      if (m.kind === 1) {
        const pts: P[] = [[m.ax, m.ay], [num(task, 0), num(task, 1)], [num(task, 2), num(task, 3)], [num(task, 4), num(task, 5)]];
        square(pts, true);
        expect([(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2]).toEqual([m.mx, m.my]);
      } else {
        const C: P = [num(task, 0), num(task, 1)];
        const D: P = [num(task, 2), num(task, 3)];
        const ab: P = [m.bx - m.ax, m.by - m.ay];
        const ad: P = [D[0] - m.ax, D[1] - m.ay];
        expect(ab[0] * ad[0] + ab[1] * ad[1] + 0).toBe(0);
        expect(ad[0] ** 2 + ad[1] ** 2).toBe(4 * (ab[0] ** 2 + ab[1] ** 2));
        expect(ab[0] * ad[1] - ab[1] * ad[0]).toBeGreaterThan(0);
        expect([C[0] - m.bx, C[1] - m.by]).toEqual(ad);
      }
    }
  });
});

/** Twice the signed area (shoelace), written out again: positive for corners counter-clockwise. */
function twiceArea(pts: P[]): number {
  return pts.reduce((sum, p, i) => {
    const q = pts[(i + 1) % pts.length];
    return sum + p[0] * q[1] - q[0] * p[1];
  }, 0);
}

/** The interior angles of a convex polygon, in degrees. */
function angles(pts: P[]): number[] {
  return pts.map((p, i) => {
    const u = pts[(i + pts.length - 1) % pts.length];
    const w = pts[(i + 1) % pts.length];
    const a = Math.atan2(u[1] - p[1], u[0] - p[0]);
    const b = Math.atan2(w[1] - p[1], w[0] - p[0]);
    const d = Math.abs(a - b) * (180 / Math.PI);
    return d > 180 ? 360 - d : d;
  });
}

describe("Figuren der Etappe 2 sind gegen den Uhrzeigersinn beschriftet und nicht flach", () => {
  const SEEDS_1000 = Array.from({ length: 1000 }, (_, i) => seedFrom(`stage-2:shape:${i}`));
  const make = (lessonId: string, generatorId: string) => {
    const generator = lesson(lessonId).exercises.find((e) => e.id === generatorId)!;
    return SEEDS_1000.map((seed) => generator.make(createRng(seed), 2));
  };
  const check = (pts: P[], minArea: number, where: string) => {
    const twice = twiceArea(pts);
    expect(twice, `${where}: Ecken gegen den Uhrzeigersinn`).toBeGreaterThan(0);
    expect(twice / 2, `${where}: Flächeninhalt`).toBeGreaterThanOrEqual(minArea);
    for (const angle of angles(pts)) expect(angle, `${where}: kein fast flacher Winkel`).toBeGreaterThanOrEqual(20);
  };

  it("2.1 gitter L2: ABC and A'B'C' counter-clockwise, at least 3 FE, every angle at least 20°", () => {
    for (const task of make("dr-1-drehung", "gitter")) {
      const m = meta(task);
      const corners: P[] = [[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]];
      check(corners, 3, task.prompt);
      check(corners.map((p) => rot(p, [m.zx, m.zy], m.phi)), 3, task.prompt);
    }
  });

  it("2.2 punktspiegelung L2: the parallelogram ABCD counter-clockwise, at least 6 FE, every angle at least 20°", () => {
    let parallelograms = 0;
    for (const task of make("dr-2-punktspiegelung", "punktspiegelung")) {
      const m = meta(task);
      if (m.kind !== 1) continue;
      parallelograms++;
      const C: P = [2 * m.mx - m.ax, 2 * m.my - m.ay];
      const D: P = [2 * m.mx - m.bx, 2 * m.my - m.by];
      check([[m.ax, m.ay], [m.bx, m.by], C, D], 6, task.prompt);
    }
    expect(parallelograms).toBeGreaterThan(400);
  });

  it("2.3 vektor L2: the triangle ABC turned about A counter-clockwise, at least 3 FE, every angle at least 20°", () => {
    let triangles = 0;
    for (const task of make("dr-3-vektoren", "vektor")) {
      const m = meta(task);
      if (m.kind !== 1) continue;
      triangles++;
      check([[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]], 3, task.prompt);
      check([[m.ax, m.ay], [num(task, 0), num(task, 1)], [num(task, 2), num(task, 3)]], 3, task.prompt);
    }
    expect(triangles).toBeGreaterThan(450);
  });

  it("2.1 eigenschaften L1: the two lengths and the two angles differ, so every slip keeps its hint", () => {
    for (const seed of SEEDS_1000) {
      const generator = lesson("dr-1-drehung").exercises.find((e) => e.id === "eigenschaften")!;
      const task = generator.make(createRng(seed), 1);
      const m = meta(task);
      expect(m.za, task.prompt).not.toBe(m.ab);
      expect(Math.abs(m.phi), task.prompt).not.toBe(m.alpha);
      for (const index of [0, 1, 2]) {
        const field = task.fields[index];
        expect(field.kind === "number" && field.slips?.length, `${task.prompt}: field ${index}`).toBe(1);
      }
    }
  });
});

describe("Wortlaut der Etappen 1 und 2", () => {
  const texts = (stageNumbers: number[]) =>
    STAGES.filter((s) => stageNumbers.includes(s.stageNumber)).flatMap((s) =>
      s.lessons.flatMap((l) => {
        const out = [l.explanationHtml, l.whyItMatters, l.quiz.question, ...l.quiz.options, l.quiz.explanation, l.lab.intro, ...l.lab.goals.map((g) => g.text), ...l.formulas.flatMap((f) => [f.html, f.quantities])];
        for (const generator of l.exercises) {
          for (const level of [1, 2] as const) {
            for (let i = 0; i < 100; i++) {
              const t = generator.make(createRng(seedFrom(`wording:${generator.id}:${i}`)), level);
              out.push(t.prompt, ...t.given, t.formulaHint ?? "", ...t.steps, ...t.fields.flatMap((f) => (f.kind === "number" ? [f.label, ...(f.slips ?? []).map((s) => s.hint)] : [f.label, ...f.options])));
            }
          }
        }
        return out.map((text) => ({ id: l.id, text }));
      }),
    );

  it("names the vector between two points with one rule, „Spitze minus Schaft“, as Mathematik 10 does", () => {
    const all = texts([1, 2]);
    expect(all.filter(({ text }) => /Spitze minus (?!Schaft)/.test(text)).map(({ id, text }) => `${id}: ${text}`)).toEqual([]);
    expect(all.some(({ text }) => text.includes("Spitze minus Schaft"))).toBe(true);
  });

  it("says „drehsymmetrisch, aber nicht punktsymmetrisch“ and leaves the Steigungsdreieck to lesson 6.4", () => {
    const all = texts([2]);
    expect(all.filter(({ text }) => /nur drehsymmetrisch|Steigungsdreieck/.test(text)).map(({ id }) => id)).toEqual([]);
    expect(lesson("dr-2-punktspiegelung").explanationHtml).toContain("drehsymmetrisch, aber nicht punktsymmetrisch");
  });

  it("writes vector names in HTML with vn() (the arrow above the name), never as a plain „BC→“", () => {
    // plain „BC→“ stays in hints, quiz and drawings, which the app shows as text
    const html = STAGES.filter((s) => [1, 2, 3, 5].includes(s.stageNumber)).flatMap((s) =>
      s.lessons.flatMap((l) => {
        const out = [l.explanationHtml, ...l.formulas.map((f) => f.html)];
        for (const generator of l.exercises) {
          for (const level of [1, 2] as const) {
            for (let i = 0; i < 100; i++) {
              const t = generator.make(createRng(seedFrom(`vn:${generator.id}:${i}`)), level);
              out.push(t.prompt, ...t.given, t.formulaHint ?? "", ...t.steps, ...t.fields.map((f) => f.label));
            }
          }
        }
        return out.map((text) => ({ id: l.id, text: text.replace(/<span aria-hidden="true"[^>]*>[⟶→]<\/span>/g, "") }));
      }),
    );
    expect(html.filter(({ text }) => /[A-Za-z]'?→/.test(text)).map(({ id, text }) => `${id}: ${text.slice(0, 120)}`)).toEqual([]);
  });
});
