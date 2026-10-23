import { describe, expect, it } from "vitest";
import { STAGE_VEKTOREN_ABBILDUNGEN as STAGE } from "../src/curriculum/stage-3-vektoren-abbildungen";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues } from "../src/lab/engine";
import {
  angleBetween,
  carrierText,
  cosDeg,
  footOn,
  LINES,
  LOCUS_GRAPHS,
  LOCUS_MAPS,
  reflectAt,
  rotateAbout,
  sinDeg,
} from "../src/lab/views-vektoren-abbildungen";
import type { ExerciseTask, NumberField } from "../src/model/types";

const LESSON_IDS = [
  "vk-1-vektoren",
  "vk-2-skalarprodukt",
  "vk-3-abstand",
  "ab-1-verschiebung-streckung",
  "ab-2-achsenspiegelung",
  "ab-3-drehung",
  "ab-4-determinante",
  "ab-5-traegergraph",
];

const SEEDS = Array.from({ length: 200 }, (_, i) => seedFrom(`stage-3:${i}`));
const DEG = Math.PI / 180;

function generator(lessonId: string, id: string) {
  const lesson = STAGE.lessons.find((l) => l.id === lessonId);
  const found = lesson?.exercises.find((e) => e.id === id);
  if (!found) throw new Error(`${lessonId}/${id}`);
  return found;
}

/** Every task of a generator on one level, with its number answers and the index of the chosen option. */
function tasks(lessonId: string, id: string, level: 1 | 2): Array<{ task: ExerciseTask; n: number[]; choice: number; m: Record<string, number> }> {
  return SEEDS.map((seed) => {
    const task = generator(lessonId, id).make(createRng(seed), level);
    const n = task.fields.filter((f): f is NumberField => f.kind === "number").map((f) => f.answer);
    const choiceField = task.fields.find((f) => f.kind === "choice");
    return { task, n, choice: choiceField && choiceField.kind === "choice" ? choiceField.correctIndex : -1, m: task.meta ?? {} };
  });
}

const close = (actual: number, expected: number, where: string, eps = 1e-6) => expect(Math.abs(actual - expected), `${where}: ${actual} vs ${expected}`).toBeLessThan(eps);
const dotOf = (ax: number, ay: number, bx: number, by: number) => ax * bx + ay * by;
const detOf = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx;
const angle = (ax: number, ay: number, bx: number, by: number) => Math.acos(dotOf(ax, ay, bx, by) / (Math.hypot(ax, ay) * Math.hypot(bx, by))) / DEG;
/** Reflection at the line through O with the inclination alpha, written out with Math.cos. */
const mirror = (x: number, y: number, alpha: number) => [x * Math.cos(2 * alpha * DEG) + y * Math.sin(2 * alpha * DEG), x * Math.sin(2 * alpha * DEG) - y * Math.cos(2 * alpha * DEG)];
/** Reflection at y = m·x via the foot of the perpendicular, without any matrix. */
const mirrorSlope = (x: number, y: number, m: number) => {
  const fx = (x + m * y) / (1 + m * m);
  return [2 * fx - x, 2 * m * fx - y];
};
const turn = (x: number, y: number, phi: number) => [x * Math.cos(phi * DEG) - y * Math.sin(phi * DEG), x * Math.sin(phi * DEG) + y * Math.cos(phi * DEG)];

describe("Etappe 3: Lektionen", () => {
  it("has the eight lessons in order, all in Zweig I, with the right Lernbereich", () => {
    expect(STAGE.id).toBe("stage-3-vektoren-abbildungen");
    expect(STAGE.lessons.map((l) => l.id)).toEqual(LESSON_IDS);
    STAGE.lessons.forEach((lesson, i) => {
      expect(lesson.stepNumber).toBe(i + 1);
      expect(lesson.title.startsWith(`3.${i + 1} `), lesson.id).toBe(true);
      expect(lesson.tracks).toEqual(["I"]);
      expect(lesson.lehrplan.startsWith(lesson.id.startsWith("vk-") ? "M10 LB 1 (I)" : "M10 LB 2 (I)"), lesson.id).toBe(true);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      expect(lesson.lab.goals).toHaveLength(3);
      expect(lesson.explanationHtml).toContain('class="example"');
      expect(lesson.explanationHtml).toContain('class="merke"');
      expect(lesson.explanationHtml, `${lesson.id}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±])-\d/);
    });
  });

  it("uses the notation of the Bavarian Merkhilfe: ⊙ for the scalar product and Matrix mal Vektor, ⊕ for the translation", () => {
    const html = (id: string) => STAGE.lessons.find((l) => l.id === id)!.explanationHtml;
    expect(html("vk-2-skalarprodukt")).toContain("⊙");
    expect(html("ab-1-verschiebung-streckung")).toContain("⊕");
    expect(html("ab-2-achsenspiegelung")).toMatch(/cos 2α[\s\S]*sin 2α[\s\S]*−cos 2α/);
    expect(html("ab-3-drehung")).toMatch(/cos φ[\s\S]*−sin φ[\s\S]*sin φ[\s\S]*cos φ/);
  });
});

describe("Etappe 3: Labore", () => {
  it("finds the foot of the perpendicular on the 0,1 grid of the slider for every P with whole coordinates", () => {
    for (const g of Object.values(LINES)) {
      for (let x = -5; x <= 5; x++) {
        for (let y = -5; y <= 5; y++) {
          const f = footOn(g, { x, y });
          close(f.x * 10, Math.round(f.x * 10), `${g.label} P(${x} | ${y})`, 1e-9);
          // the foot really is the foot: PF ⊥ u
          close(dotOf(f.x - x, f.y - y, g.u.x, g.u.y), 0, `${g.label} P(${x} | ${y})`, 1e-9);
          close(g.u.y / g.u.x, g.m, g.label, 1e-12);
        }
      }
    }
  });

  it("rotates and mirrors exactly at the special angles", () => {
    expect(rotateAbout({ x: 3, y: 2 }, { x: 0, y: 0 }, 90)).toEqual({ x: -2, y: 3 });
    expect(rotateAbout({ x: 3, y: 2 }, { x: 0, y: 0 }, -90)).toEqual({ x: 2, y: -3 });
    expect(rotateAbout({ x: 4, y: 3 }, { x: 1, y: 2 }, 90)).toEqual({ x: 0, y: 5 });
    expect(rotateAbout({ x: 5, y: 1 }, { x: 2, y: 1 }, -90)).toEqual({ x: 2, y: -2 });
    const p = rotateAbout({ x: 4, y: 0 }, { x: 0, y: 0 }, 60);
    close(p.x, 2, "4 | 0 um 60°");
    close(p.y, 2 * Math.sqrt(3), "4 | 0 um 60°");
    expect(reflectAt({ x: 3, y: 1 }, 45)).toEqual({ x: 1, y: 3 });
    expect(reflectAt({ x: 4, y: 0 }, 135)).toEqual({ x: 0, y: -4 });
    expect(reflectAt({ x: 3, y: 2 }, 90)).toEqual({ x: -3, y: 2 });
    expect(reflectAt({ x: 3, y: 2 }, 0)).toEqual({ x: 3, y: -2 });
    for (let deg = -360; deg <= 360; deg += 5) {
      close(cosDeg(deg), Math.cos(deg * DEG), `cos ${deg}`, 1e-12);
      close(sinDeg(deg), Math.sin(deg * DEG), `sin ${deg}`, 1e-12);
    }
    close(angleBetween({ x: 4, y: 1 }, { x: 3, y: 5 }) ?? 0, 45, "45° des Laborauftrags");
    expect(angleBetween({ x: 0, y: 0 }, { x: 3, y: 5 })).toBeNull();
  });

  it("names the Trägergraph of every Punktschar and mapping of the lab as worked out by hand", () => {
    const expected: Record<string, string> = {
      "0/0": "y = −2x − 2",
      "0/1": "y = 2x − 2",
      "0/2": "y = 0,5x − 2",
      "0/3": "y = 0,5x − 0,5",
      "0/4": "y = −0,5x + 1",
      "1/0": "x = −0,25y² + 3",
      "1/1": "x = 0,25y² − 3",
      "1/2": "y = 0,25(x − 2)² − 5",
      "1/3": "y = −0,5x² + 1,5",
      "1/4": "y = −0,25(x − 2)² + 4",
    };
    for (const [g, graph] of Object.entries(LOCUS_GRAPHS)) {
      for (const [m, map] of Object.entries(LOCUS_MAPS)) {
        expect(carrierText(graph, map.m), `${g}/${m}`).toBe(expected[`${g}/${m}`]);
      }
    }
  });

  it("starts every lab with readouts a learner can read", () => {
    for (const lesson of STAGE.lessons) {
      const readouts = computeReadouts(lesson.lab, defaultLabValues(lesson.lab));
      for (const value of Object.values(readouts)) {
        if (typeof value === "string") expect(value, lesson.id).not.toMatch(/NaN|undefined|(^|[\s(=:|,{±])-\d/);
      }
    }
  });
});

describe("Etappe 3: Aufgaben rechnen richtig", () => {
  it("3.1 Verbindungsvektor, Parallelogramm, Gegenvektor, Drohne und Abstand", () => {
    for (const { n, m } of tasks("vk-1-vektoren", "verbindungsvektor", 1)) {
      const dx = m.bx - m.ax;
      const dy = m.by - m.ay;
      expect(n.slice(0, 2)).toEqual([dx, dy]);
      close(n[2], Math.hypot(dx, dy), "Länge");
    }
    for (const { n, m } of tasks("vk-1-vektoren", "verbindungsvektor", 2)) {
      const c = [m.dx + m.bx - m.ax, m.dy + m.by - m.ay];
      expect(n.slice(0, 2)).toEqual(c);
      close(n[2], Math.hypot(c[0] - m.ax, c[1] - m.ay), "Diagonale");
      // ABCD is a real parallelogram: AB and AD are not parallel
      expect(detOf(m.bx - m.ax, m.by - m.ay, m.dx - m.ax, m.dy - m.ay)).toBeGreaterThan(0);
    }
    for (const { n, m } of tasks("vk-1-vektoren", "punkt-plus-vektor", 1)) {
      expect(n).toEqual([-m.ux, -m.uy, m.bx - m.ux, m.by - m.uy]);
    }
    for (const { n, m } of tasks("vk-1-vektoren", "punkt-plus-vektor", 2)) {
      const s = [m.v1x + m.v2x, m.v1y + m.v2y];
      expect(n.slice(0, 2)).toEqual([m.sx + s[0], m.sy + s[1]]);
      close(n[2], 10 * Math.hypot(s[0], s[1]), "Luftlinie");
    }
    for (const { n, m } of tasks("vk-1-vektoren", "betrag", 1)) {
      close(n[0], Math.hypot(m.vx, m.vy), "Betrag");
      close(n[1], Math.abs(m.k) * Math.hypot(m.vx, m.vy), "Betrag k·v");
    }
    for (const { n, m } of tasks("vk-1-vektoren", "betrag", 2)) {
      expect(n[0]).not.toBe(n[1]);
      for (const x of n) close(Math.hypot(x - m.ax, m.c - m.ay), m.d, "Abstand");
    }
  });

  it("3.2 Skalarprodukt, Orthogonalität, Winkel und Winkelart", () => {
    for (const { n, choice, m } of tasks("vk-2-skalarprodukt", "orthogonal", 1)) {
      const s = dotOf(m.ax, m.ay, m.bx, m.by);
      expect(n[0]).toBe(s);
      expect(choice === 0, "ja nur bei Skalarprodukt 0").toBe(s === 0);
    }
    let both = new Set<number>();
    for (const { choice } of tasks("vk-2-skalarprodukt", "orthogonal", 1)) both.add(choice);
    expect([...both].sort()).toEqual([0, 1]);
    for (const { n, m } of tasks("vk-2-skalarprodukt", "orthogonal", 2)) {
      close(dotOf(n[0], m.p, m.q, m.r), 0, "OA ⊥ OB");
    }
    for (const { n, m } of tasks("vk-2-skalarprodukt", "winkel", 1)) {
      expect(n[0]).toBe(dotOf(m.ax, m.ay, m.bx, m.by));
      close(n[1], angle(m.ax, m.ay, m.bx, m.by), "Winkel");
    }
    for (const { n, m } of tasks("vk-2-skalarprodukt", "winkel", 2)) {
      close(n[0], angle(m.hx - m.px, m.hy - m.py, m.qx - m.px, m.qy - m.py), "Winkel HPA");
    }
    for (const level of [1, 2] as const) {
      both = new Set<number>();
      for (const { n, choice, m } of tasks("vk-2-skalarprodukt", "winkelart", level)) {
        const s = level === 1 ? dotOf(m.ax, m.ay, m.bx, m.by) : dotOf(m.bx - m.ax, m.by - m.ay, m.cx - m.ax, m.cy - m.ay);
        expect(n[0]).toBe(s);
        expect(choice).toBe(s > 0 ? 0 : s === 0 ? 1 : 2);
        both.add(choice);
      }
      expect([...both].sort(), "alle drei Winkelarten kommen vor").toEqual([0, 1, 2]);
    }
  });

  it("3.3 rechter Winkel, Innenwinkel, Lotfußpunkt und Abstand", () => {
    for (const { n, choice, m } of tasks("vk-3-abstand", "rechter-winkel", 1)) {
      const pts = [[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]];
      const v = pts[m.vertex];
      const [p, q] = pts.filter((_, i) => i !== m.vertex);
      const s = dotOf(p[0] - v[0], p[1] - v[1], q[0] - v[0], q[1] - v[1]);
      expect(n[0]).toBe(s);
      expect(choice === 0).toBe(s === 0);
      // a real triangle
      expect(detOf(p[0] - v[0], p[1] - v[1], q[0] - v[0], q[1] - v[1])).not.toBe(0);
    }
    for (const { n, m } of tasks("vk-3-abstand", "rechter-winkel", 2)) {
      const [x, y] = n;
      close(y, m.m * x + m.t, "C liegt auf g");
      close(dotOf(m.ax - m.bx, m.ay - m.by, x - m.bx, y - m.by), 0, "rechter Winkel bei B");
      expect(Math.hypot(x - m.bx, y - m.by)).toBeGreaterThan(0.5);
    }
    for (const { n, m } of tasks("vk-3-abstand", "innenwinkel", 1)) {
      close(n[0], angle(m.bx - m.ax, m.by - m.ay, m.cx - m.ax, m.cy - m.ay), "α");
    }
    for (const { n, m } of tasks("vk-3-abstand", "innenwinkel", 2)) {
      close(n[0], angle(m.bx - m.ax, m.by - m.ay, m.dx - m.ax, m.dy - m.ay), "α");
      close(n[0] + n[1], 180, "α + β");
    }
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("vk-3-abstand", "abstand", level)) {
        // the distance from the formula |m·x − y + t| : √(m² + 1), independent of the foot
        const d = Math.abs(m.m * m.px - m.py + m.t) / Math.hypot(m.m, 1);
        const fx = n[0];
        close(dotOf(fx - m.px, m.m * fx + m.t - m.py, 1, m.m), 0, "PF ⊥ g");
        if (level === 1) {
          close(n[1], m.m * fx + m.t, "F auf g");
          close(n[2], d, "Abstand");
        } else {
          close(n[1], 100 * d, "Abstand in m");
        }
      }
    }
  });

  it("3.4 Verschiebung, Streckung, Faktor und Zentrum", () => {
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("ab-1-verschiebung-streckung", "verschiebung", level)) {
        if (m.variant === 0) expect(n).toEqual([m.px + m.vx, m.py + m.vy]);
        if (m.variant === 1) expect(n).toEqual([m.vx, m.vy]);
        if (m.variant === 2) {
          close(m.m * n[0] + m.t + m.vy, 0, "Bildpunkt auf der x-Achse");
          close(n[1], n[0] + m.vx, "x'");
        }
        if (m.variant === 3) expect(n).toEqual([m.vx, m.vy, m.cx + m.vx, m.cy + m.vy]);
      }
    }
    for (const { n, m } of tasks("ab-1-verschiebung-streckung", "streckung", 1)) {
      close(n[0], m.zx + m.k * (m.px - m.zx), "x'");
      close(n[1], m.zy + m.k * (m.py - m.zy), "y'");
    }
    for (const { task, n, m } of tasks("ab-1-verschiebung-streckung", "streckung", 2)) {
      expect(n.slice(0, 2)).toEqual([m.ax, m.ay]);
      close(n[2], m.k * m.k * m.area, "Flächeninhalt");
      // the stated image is the image of A
      const a1 = `A'(${[m.zx + m.k * (m.ax - m.zx), m.zy + m.k * (m.ay - m.zy)].map((x) => String(Number(x.toFixed(2))).replace(".", ",").replace("-", "−")).join(" | ")})`;
      expect(task.prompt).toContain(a1);
      expect(m.k * m.k * m.area * 100).toBeCloseTo(Math.round(m.k * m.k * m.area * 100), 9);
    }
    for (const { task, n, m } of tasks("ab-1-verschiebung-streckung", "faktor-zentrum", 1)) {
      expect(n[0]).toBe(m.k);
      const q = [m.zx + m.k * (m.px - m.zx), m.zy + m.k * (m.py - m.zy)];
      expect(task.prompt).toContain(`P'(${q.map((x) => String(x).replace(".", ",").replace("-", "−")).join(" | ")})`);
    }
    for (const { n, m } of tasks("ab-1-verschiebung-streckung", "faktor-zentrum", 2)) {
      // P' = Z + k·(P − Z) with the answer as Z
      close(n[0] + m.k * (m.px - n[0]), m.qx, "Zentrum x");
      close(n[1] + m.k * (m.py - n[1]), m.qy, "Zentrum y");
    }
  });

  it("3.5 Achsenspiegelung: Bildpunkt, Sonderfälle, Urpunkt und Nachweis", () => {
    for (const { n, m } of tasks("ab-2-achsenspiegelung", "bildpunkt", 1)) {
      const [x, y] = mirror(m.px, m.py, m.alpha);
      close(n[0], x, "x'");
      close(n[1], y, "y'");
    }
    for (const { n, m } of tasks("ab-2-achsenspiegelung", "bildpunkt", 2)) {
      const alpha = Math.atan(m.m);
      close(n[0], Math.cos(2 * alpha), "cos 2α");
      close(n[1], Math.sin(2 * alpha), "sin 2α");
      const [x, y] = mirrorSlope(m.px, m.py, m.m);
      close(n[2], x, "x'");
      close(n[3], y, "y'");
      // exact two-decimal values, so that the typed rounded value is the answer
      for (const value of n) close(value * 100, Math.round(value * 100), "zwei Dezimalen", 1e-7);
    }
    for (const { n, m } of tasks("ab-2-achsenspiegelung", "sonderfall-urpunkt", 1)) {
      const [x, y] = mirror(m.px, m.py, m.alpha);
      close(n[0], x, "x'", 1e-9);
      close(n[1], y, "y'", 1e-9);
    }
    for (const { n, m } of tasks("ab-2-achsenspiegelung", "sonderfall-urpunkt", 2)) {
      const [x, y] = mirror(n[0], n[1], m.alpha);
      close(x, m.qx, "Spiegelbild des Urpunkts", 1e-6);
      close(y, m.qy, "Spiegelbild des Urpunkts", 1e-6);
      // the Urpunkt has whole coordinates up to the rounding of P'
      close(n[0], Math.round(n[0]), "ganzzahlig", 0.008);
      close(n[1], Math.round(n[1]), "ganzzahlig", 0.008);
    }
    const seen = new Set<number>();
    for (const { n, choice, m } of tasks("ab-2-achsenspiegelung", "nachweis", 1)) {
      const [x, y] = mirrorSlope(m.px, m.py, m.m);
      const isMirror = Math.abs(x - m.qx) < 1e-9 && Math.abs(y - m.qy) < 1e-9;
      expect(choice === 0, `P(${m.px} | ${m.py}), Q(${m.qx} | ${m.qy})`).toBe(isMirror);
      close(n[0], (m.px + m.qx) / 2, "M x");
      close(n[1], (m.py + m.qy) / 2, "M y");
      seen.add(choice);
    }
    expect([...seen].sort()).toEqual([0, 1]);
    for (const { n, m } of tasks("ab-2-achsenspiegelung", "nachweis", 2)) {
      expect(n[0]).toBeGreaterThanOrEqual(0);
      expect(n[0]).toBeLessThan(180);
      close(Math.tan(n[0] * DEG), m.m, "tan α = m", 1e-9);
    }
  });

  it("3.6 Drehung um O, um Z, Urpunkt, Uhr und Quadrat", () => {
    for (const { n, m } of tasks("ab-3-drehung", "drehung-o", 1)) {
      const [x, y] = turn(m.px, m.py, m.phi);
      close(n[0], x, "x'");
      close(n[1], y, "y'");
    }
    for (const { n, m } of tasks("ab-3-drehung", "drehung-o", 2)) {
      close(n[0], m.r * Math.sin(6 * m.minutes * DEG), "Zeiger x");
      close(n[1], m.r * Math.cos(6 * m.minutes * DEG), "Zeiger y");
    }
    for (const { n, m } of tasks("ab-3-drehung", "drehung-z", 1)) {
      const [x, y] = turn(m.px - m.zx, m.py - m.zy, m.phi);
      close(n[0], m.zx + x, "x'");
      close(n[1], m.zy + y, "y'");
    }
    for (const { n, m } of tasks("ab-3-drehung", "drehung-z", 2)) {
      const [x, y] = turn(n[0] - m.zx, n[1] - m.zy, m.phi);
      close(m.zx + x, m.qx, "gedrehter Urpunkt");
      close(m.zy + y, m.qy, "gedrehter Urpunkt");
      close(n[0], Math.round(n[0]), "ganzzahlig", 0.008);
      close(n[1], Math.round(n[1]), "ganzzahlig", 0.008);
    }
    for (const { n, m } of tasks("ab-3-drehung", "quadrat", 1)) {
      expect(n).toEqual([-m.vy, m.vx, m.vy, -m.vx]);
    }
    for (const { n, m } of tasks("ab-3-drehung", "quadrat", 2)) {
      const [cx, cy, dx, dy] = n;
      const ab = [m.bx - m.ax, m.by - m.ay];
      const bc = [cx - m.bx, cy - m.by];
      const ad = [dx - m.ax, dy - m.ay];
      close(Math.hypot(...ab), Math.hypot(...bc), "gleich lange Seiten");
      expect(dotOf(ab[0], ab[1], bc[0], bc[1])).toBe(0);
      expect(detOf(ab[0], ab[1], ad[0], ad[1])).toBeGreaterThan(0);
      expect([cx - dx, cy - dy]).toEqual(ab);
    }
  });

  it("3.7 Determinante, Viereck, Dreiecksschar und Flächen unter Abbildungen", () => {
    const shoelace = (pts: number[][]) => pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0) / 2;
    for (const { n, m } of tasks("ab-4-determinante", "dreieck", 1)) {
      const d = detOf(m.bx - m.ax, m.by - m.ay, m.cx - m.ax, m.cy - m.ay);
      expect(n[0]).toBe(d);
      close(n[1], Math.abs(shoelace([[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]])), "Dreieck");
    }
    for (const { n, m } of tasks("ab-4-determinante", "dreieck", 2)) {
      const pts = [[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy], [m.dx, m.dy]];
      close(n[0], shoelace(pts), "Viereck");
      // convex and counter-clockwise
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % 4];
        const r = pts[(i + 2) % 4];
        expect(detOf(q[0] - p[0], q[1] - p[1], r[0] - q[0], r[1] - q[1])).toBeGreaterThan(0);
      });
    }
    const family = (m: Record<string, number>, x: number) => {
      const c = [x, m.p * x * x + m.q * x + m.r];
      return detOf(m.ux, m.uy, c[0] - m.ax, c[1] - m.ay) / 2;
    };
    for (const { n, m } of tasks("ab-4-determinante", "dreiecksschar", 1)) {
      close(n[0], family(m, m.x0), "A(x₀)");
      expect(n[0]).toBeGreaterThan(0);
    }
    for (const { n, m } of tasks("ab-4-determinante", "dreiecksschar", 2)) {
      let best = -Infinity;
      let at = 0;
      for (let x = -10; x <= 10; x += 0.01) {
        if (family(m, x) > best) {
          best = family(m, x);
          at = x;
        }
      }
      close(n[0], at, "x des Maximums", 0.006);
      close(n[1], best, "A_max", 1e-3);
      expect(n[1]).toBeGreaterThan(0);
    }
    for (const { n, m } of tasks("ab-4-determinante", "abbildung-flaeche", 1)) {
      const area = shoelace([[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]]);
      close(n[0], area, "Dreieck");
      close(n[1], m.k * m.k * area, "Bilddreieck");
    }
    const senses = new Set<number>();
    for (const { task, n, choice, m } of tasks("ab-4-determinante", "abbildung-flaeche", 2)) {
      const area = shoelace([[m.ax, m.ay], [m.bx, m.by], [m.cx, m.cy]]);
      expect(area).toBeGreaterThan(0);
      close(n[0], m.k * m.k * area, "Bilddreieck");
      expect((task.prompt.match(/gespiegelt/g) ?? []).length).toBe(m.mirrors);
      expect(choice).toBe(m.mirrors % 2);
      senses.add(choice);
    }
    expect([...senses].sort()).toEqual([0, 1]);
  });

  it("3.8 Hintereinanderausführung, Trägergeraden und Trägerparabeln", () => {
    const first = [
      (x: number, y: number) => [x, -y],
      (x: number, y: number) => [-x, y],
      (x: number, y: number) => [y, x],
      (x: number, y: number) => [-y, x],
      (x: number, y: number) => [-x, -y],
    ];
    for (const { n, m } of tasks("ab-5-traegergraph", "hintereinander", 1)) {
      const [x, y] = first[m.first](m.px, m.py);
      expect(n).toEqual([x + m.vx, y + m.vy]);
    }
    for (const { n, m } of tasks("ab-5-traegergraph", "hintereinander", 2)) {
      const result = m.reflectFirst === 1 ? turn(...(mirrorSlope(m.px, m.py, m.m) as [number, number]), 90) : mirrorSlope(...(turn(m.px, m.py, 90) as [number, number]), m.m);
      close(n[0], result[0], "x''");
      close(n[1], result[1], "y''");
    }
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("ab-5-traegergraph", "traegergerade", level)) {
        // image points of three points of the line lie on y = m'x + t'
        for (const x of [-2, 0, 3]) {
          const y = m.m * x + m.t;
          const xi = m.a * x + m.b * y + m.e;
          const yi = m.c * x + m.d * y + m.f;
          close(yi, n[0] * xi + n[1], `Bildpunkt von x = ${x}`);
        }
      }
    }
    for (const level of [1, 2] as const) {
      for (const { n, m } of tasks("ab-5-traegergraph", "traegerparabel", level)) {
        const map = (x: number, y: number): number[] => {
          if (level === 1) return m.kind === 0 ? [x + m.vx, y + m.vy] : m.kind === 1 ? [x, -y] : [m.k * x, m.k * y];
          return m.mirrorFirst === 1 ? [x + m.vx, -y + m.vy] : [m.k * (x + m.vx), m.k * (y + m.vy)];
        };
        for (const x of [-3, -1, 0, 2, 5]) {
          const [xi, yi] = map(x, m.a * (x - m.d) ** 2 + m.e);
          close(yi, n[0] * (xi - n[1]) ** 2 + n[2], `Bildpunkt von x = ${x}`, 1e-9);
        }
      }
    }
  });
});
