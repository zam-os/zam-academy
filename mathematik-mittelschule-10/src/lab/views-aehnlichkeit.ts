import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  angleMark,
  arcPath,
  clamp,
  clipped,
  handle,
  infoBox,
  line,
  open,
  path,
  Plot,
  polygon,
  rect,
  sideLabel,
  text,
  type LabView,
  type Pt,
} from "./svg";
import { legendRow, title } from "./view-helpers";

const RAD = Math.PI / 180;
const toDeg = (rad: number) => rad / RAD;
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

// ─── 3.1 Ähnliche Dreiecke: Winkel und Seitenverhältnisse ─────────────────

/** The fixed original of lesson 3.1: α = 40°, β = 60°, c = 5 cm. */
export const REF_TRIANGLE = { alpha: 40, beta: 60, c: 5 };

/** Sides a, b, c of the triangle with angles α, β at A, B and the side c = AB. */
export function triangleSides(alpha: number, beta: number, c: number): { a: number; b: number; c: number; gamma: number } {
  const gamma = 180 - alpha - beta;
  const k = c / Math.sin(gamma * RAD);
  return { a: k * Math.sin(alpha * RAD), b: k * Math.sin(beta * RAD), c, gamma };
}

/** The ratios image : original of the shortest, middle and longest sides. */
export function sortedRatios(v: LabValues): number[] {
  const ref = triangleSides(REF_TRIANGLE.alpha, REF_TRIANGLE.beta, REF_TRIANGLE.c);
  const img = triangleSides(v.alpha2, v.beta2, v.c2);
  const r = [ref.a, ref.b, ref.c].sort((x, y) => x - y);
  const i = [img.a, img.b, img.c].sort((x, y) => x - y);
  return [i[0] / r[0], i[1] / r[1], i[2] / r[2]];
}

/** True when the image has the angles of the original, in any order. */
export function isSimilar(v: LabValues): boolean {
  const ref = [REF_TRIANGLE.alpha, REF_TRIANGLE.beta, 180 - REF_TRIANGLE.alpha - REF_TRIANGLE.beta].sort((x, y) => x - y);
  const img = [v.alpha2, v.beta2, 180 - v.alpha2 - v.beta2].sort((x, y) => x - y);
  return ref.every((angle, i) => same(angle, img[i]));
}

const SIM = { base: 300, scale: 19, a1: 24, a2: 180 };

function trianglePoints(x0: number, alpha: number, beta: number, c: number) {
  const s = triangleSides(alpha, beta, c);
  const k = SIM.scale;
  const A: Pt = { x: x0, y: SIM.base };
  const B: Pt = { x: x0 + c * k, y: SIM.base };
  const C: Pt = { x: x0 + s.b * k * Math.cos(alpha * RAD), y: SIM.base - s.b * k * Math.sin(alpha * RAD) };
  return { A, B, C, ...s };
}

function drawTriangle(t: ReturnType<typeof trianglePoints>, alpha: number, beta: number, fill: string, names: [string, string, string]): string {
  let out = polygon([t.A, t.B, t.C], fill);
  out += line(t.B.x, t.B.y, t.C.x, t.C.y, "lab-side-a") + line(t.A.x, t.A.y, t.C.x, t.C.y, "lab-side-b") + line(t.A.x, t.A.y, t.B.x, t.B.y, "lab-side-c");
  out += angleMark(t.A, t.B, t.C, 14, "lab-angle") + angleMark(t.B, t.C, t.A, 14, "lab-angle");
  out += text(t.A.x - 3, t.A.y + 16, names[0], "lab-text", "end") + text(t.B.x + 3, t.B.y + 16, names[1], "lab-text");
  out += text(t.C.x, t.C.y - 10, names[2], "lab-text", "middle");
  out += text(t.A.x + 18, t.A.y - 4, `${fmt(alpha)}°`, "lab-text-small");
  out += text(t.B.x - 18, t.B.y - 4, `${fmt(beta)}°`, "lab-text-small", "end");
  out += sideLabel(t.A, t.B, `${fmt(t.c, 1)}`, -12, "lab-text-small lab-text-c");
  return out;
}

const similarTriangles: LabView = {
  render(v) {
    const ref = trianglePoints(SIM.a1, REF_TRIANGLE.alpha, REF_TRIANGLE.beta, REF_TRIANGLE.c);
    const img = trianglePoints(SIM.a2, v.alpha2, v.beta2, v.c2);
    const similar = isSimilar(v);
    const ratios = sortedRatios(v);
    let out =
      open(`Original mit 40°, 60°, 80° und Bild mit ${v.alpha2}°, ${v.beta2}°, ${fmt(img.gamma)}°: ${similar ? "ähnlich" : "nicht ähnlich"}`) +
      title("Original links, Bild rechts: gleiche Winkel?");
    out += drawTriangle(ref, REF_TRIANGLE.alpha, REF_TRIANGLE.beta, "lab-fill-a", ["A", "B", "C"]);
    out += drawTriangle(img, v.alpha2, v.beta2, similar ? "lab-fill-ok" : "lab-fill-b", ["A'", "B'", "C'"]);
    out += infoBox(18, 62, [
      ["kurz : kurz", "lab-text-small"],
      [`= ${fmt(ratios[0], 2)}`, "lab-text-c"],
      ["mittel : mittel", "lab-text-small"],
      [`= ${fmt(ratios[1], 2)}`, "lab-text-c"],
      ["lang : lang", "lab-text-small"],
      [`= ${fmt(ratios[2], 2)}`, "lab-text-c"],
    ]);
    out += infoBox(372, 62, [
      ["Original", "lab-text-a"],
      ["40° · 60° · 80°", "lab-text-small"],
      ["Bild", "lab-text-b"],
      [`${fmt(v.alpha2)}° · ${fmt(v.beta2)}° · ${fmt(img.gamma)}°`, "lab-text-small"],
      [similar ? "ähnlich" : "nicht ähnlich", similar ? "lab-text-ok" : "lab-text-bad"],
      [similar ? `k = ${fmt(ratios[2], 2)}` : "Verhältnisse ungleich", "lab-text-small"],
    ]);
    out += handle("C", img.C.x, img.C.y, "Ecke C' des Bildes: Winkel");
    out += handle("B", img.B.x, img.B.y, "Ecke B' des Bildes: Seite c'");
    return out + "</svg>";
  },
  handles: {
    C: {
      x: "alpha2",
      y: "beta2",
      drag: (p, v) => {
        const B = SIM.a2 + v.c2 * SIM.scale;
        return {
          alpha2: toDeg(Math.atan2(SIM.base - p.y, p.x - SIM.a2)),
          beta2: toDeg(Math.atan2(SIM.base - p.y, B - p.x)),
        };
      },
    },
    B: { x: "c2", drag: (p) => ({ c2: (p.x - SIM.a2) / SIM.scale }) },
  },
};

// ─── 3.2 Zentrische Streckung ────────────────────────────────────────────

/** The original triangle of lesson 3.2 in grid units (1 Kästchen = 1 cm). */
export const STRETCH_TRIANGLE = { A: { x: 4, y: 2 }, B: { x: 7, y: 2 }, C: { x: 5, y: 4 } };

function gcdInt(a: number, b: number): number {
  return b === 0 ? a : gcdInt(b, a % b);
}

/** k as a Maßstab "Bild : Original" of small whole numbers, e.g. 1,5 → "3 : 2". */
export function scaleText(k: number): string {
  const n = Math.round(k * 4);
  const g = gcdInt(n, 4);
  return `${n / g} : ${4 / g}`;
}

const stretchPlot = new Plot(0, 13, 0, 8.5, { x: 16, y: 44, w: 338, h: 221 });

function stretchImage(v: LabValues) {
  const Z = { x: v.zx, y: v.zy };
  const map = (P: Pt): Pt => ({ x: Z.x + v.k * (P.x - Z.x), y: Z.y + v.k * (P.y - Z.y) });
  const { A, B, C } = STRETCH_TRIANGLE;
  return { Z, A, B, C, A2: map(A), B2: map(B), C2: map(C) };
}

const centerStretch: LabView = {
  render(v) {
    const plot = stretchPlot;
    const g = stretchImage(v);
    const P = (q: Pt) => plot.P(q.x, q.y);
    let out =
      open(`Zentrische Streckung mit Zentrum Z (${fmt(v.zx)} | ${fmt(v.zy)}) und k = ${fmt(v.k, 2)}`) +
      title(`Zentrische Streckung: k = ${fmt(v.k, 2)}, Maßstab ${scaleText(v.k)}`);
    out += plot.clip("st-clip");
    let inner = plot.grid(1, 2, "", "");
    for (const [X, X2] of [
      [g.A, g.A2],
      [g.B, g.B2],
      [g.C, g.C2],
    ] as const) {
      const far = v.k >= 1 ? X2 : X;
      // The ray from Z through the point and its image, a little beyond both.
      const end = { x: g.Z.x + (far.x - g.Z.x) * 1.15, y: g.Z.y + (far.y - g.Z.y) * 1.15 };
      inner += line(P(g.Z).x, P(g.Z).y, P(end).x, P(end).y, "lab-dashed");
    }
    inner += polygon([P(g.A), P(g.B), P(g.C)], "lab-fill-a");
    inner += polygon([P(g.A2), P(g.B2), P(g.C2)], "lab-fill-b");
    inner += text(P(g.A).x - 4, P(g.A).y + 15, "A", "lab-text-a", "end") + text(P(g.B).x + 4, P(g.B).y + 15, "B", "lab-text-a");
    inner += text(P(g.C).x, P(g.C).y - 8, "C", "lab-text-a", "middle");
    inner += text(P(g.A2).x - 4, P(g.A2).y - 6, "A'", "lab-text-b", "end") + text(P(g.B2).x + 6, P(g.B2).y - 6, "B'", "lab-text-b");
    inner += text(P(g.C2).x, P(g.C2).y - 8, "C'", "lab-text-b", "middle");
    out += clipped("st-clip", inner);
    out += text(P(g.Z).x + 10, P(g.Z).y + 16, "Z", "lab-text");
    const area = (3 * 2) / 2;
    out += infoBox(372, 70, [
      [`k = ${fmt(v.k, 2)}`, "lab-text-c"],
      [`Maßstab ${scaleText(v.k)}`, "lab-text-small"],
      [`AB = 3 cm`, "lab-text-a"],
      [`A'B' = ${fmt(3 * v.k, 2)} cm`, "lab-text-b"],
      [`Fläche ${fmt(area)} cm²`, "lab-text-a"],
      [`Bild ${fmt(area * v.k * v.k, 2)} cm²`, "lab-text-b"],
      [`ZA' = ${fmt(v.k, 2)} · ZA`, "lab-text-small"],
    ]);
    out += legendRow(30, 322, [
      ["lab-fill-a", "Original"],
      ["lab-fill-b", "Bild"],
    ]);
    out += text(354, 322, "1 Kästchen = 1 cm", "lab-text-small", "end");
    out += handle("Z", P(g.Z).x, P(g.Z).y, "Streckungszentrum Z");
    out += handle("k", P(g.B2).x, P(g.B2).y, "Bildpunkt B': Streckungsfaktor k");
    return out + "</svg>";
  },
  handles: {
    Z: {
      x: "zx",
      y: "zy",
      drag: (p) => ({ zx: stretchPlot.invX(p.x), zy: stretchPlot.invY(p.y) }),
    },
    k: {
      x: "k",
      drag: (p, v) => {
        const { B } = STRETCH_TRIANGLE;
        const dx = B.x - v.zx;
        const dy = B.y - v.zy;
        const len2 = dx * dx + dy * dy;
        if (len2 < 0.01) return {};
        const px = stretchPlot.invX(p.x) - v.zx;
        const py = stretchPlot.invY(p.y) - v.zy;
        return { k: (px * dx + py * dy) / len2 };
      },
    },
  },
};

// ─── 3.3 Längen, Flächen und Volumen bei ähnlichen Körpern ──────────────

/** The original cube of lesson 3.3 has edges of 2 cm. */
export const CUBE_EDGE = 2;
const CUBE = { base: 300, scale: 21, x1: 24, x2: 110, depth: 0.5 };

function cube(x0: number, edge: number, cls: string): string {
  const s = CUBE.scale;
  const e = edge * s;
  const dx = e * CUBE.depth * Math.cos(45 * RAD);
  const dy = e * CUBE.depth * Math.sin(45 * RAD);
  const y0 = CUBE.base;
  const front = [
    { x: x0, y: y0 },
    { x: x0 + e, y: y0 },
    { x: x0 + e, y: y0 - e },
    { x: x0, y: y0 - e },
  ];
  const top = [front[3], front[2], { x: front[2].x + dx, y: front[2].y - dy }, { x: front[3].x + dx, y: front[3].y - dy }];
  const side = [front[1], { x: front[1].x + dx, y: front[1].y - dy }, top[2], front[2]];
  let out = polygon(front, cls) + polygon(top, cls) + polygon(side, cls);
  // 1-cm lines on the three visible faces.
  for (let i = 1; i < edge - 1e-9; i++) {
    const t = i * s;
    out += line(x0 + t, y0, x0 + t, y0 - e, "lab-thin") + line(x0, y0 - t, x0 + e, y0 - t, "lab-thin");
    const f = t / e;
    out += line(x0 + t, y0 - e, x0 + t + dx, y0 - e - dy, "lab-thin");
    out += line(front[3].x + dx * f, front[3].y - dy * f, front[2].x + dx * f, front[2].y - dy * f, "lab-thin");
    out += line(front[1].x + dx * f, front[1].y - dy * f, front[2].x + dx * f, front[2].y - dy * f, "lab-thin");
    out += line(x0 + e, y0 - t, x0 + e + dx, y0 - t - dy, "lab-thin");
  }
  out += polygon(front, "lab-ink") + polygon(top, "lab-ink") + polygon(side, "lab-ink");
  return out;
}

const scaleSolid: LabView = {
  render(v) {
    const a = CUBE_EDGE;
    const a2 = a * v.k;
    let out =
      open(`Würfel mit Kante ${a} cm und ähnlicher Würfel mit Kante ${fmt(a2, 1)} cm, k = ${fmt(v.k, 1)}`) +
      title(`k = ${fmt(v.k, 1)}: Längen · ${fmt(v.k, 1)}, Flächen · ${fmt(v.k ** 2, 2)}, Volumen · ${fmt(v.k ** 3, 3)}`);
    out += line(16, CUBE.base, 340, CUBE.base, "lab-ink");
    out += cube(CUBE.x1, a, "lab-fill-a");
    out += cube(CUBE.x2, a2, "lab-fill-b");
    out += text(CUBE.x1 + (a * CUBE.scale) / 2, CUBE.base + 18, `${a} cm`, "lab-text-a", "middle");
    out += text(CUBE.x2 + (a2 * CUBE.scale) / 2, CUBE.base + 18, `${fmt(a2, 1)} cm`, "lab-text-b", "middle");
    out += infoBox(372, 64, [
      ["Original", "lab-text-a"],
      [`O = ${fmt(6 * a * a)} cm²`, "lab-text-small"],
      [`V = ${fmt(a ** 3)} cm³`, "lab-text-small"],
      ["Bild", "lab-text-b"],
      [`O' = ${fmt(6 * a2 * a2, 1)} cm²`, "lab-text-small"],
      [`V' = ${fmt(a2 ** 3, 3)} cm³`, "lab-text-small"],
      [`O' : O = ${fmt(v.k ** 2, 2)} = k²`, "lab-text-c"],
      [`V' : V = ${fmt(v.k ** 3, 3)} = k³`, "lab-text-c"],
    ]);
    out += legendRow(30, 330, [
      ["lab-fill-a", "Original"],
      ["lab-fill-b", "vergrößert oder verkleinert"],
    ]);
    return out + handle("k", CUBE.x2 + a2 * CUBE.scale, CUBE.base, "Kante des Bildwürfels") + "</svg>";
  },
  handles: { k: { x: "k", drag: (p) => ({ k: (p.x - CUBE.x2) / (CUBE_EDGE * CUBE.scale) }) } },
};

// ─── 3.4 Strahlensätze ────────────────────────────────────────────────────

const RAYS = { zx: 40, zy: 262, scale: 34, angle: 30, length: 13.4 };

/** True when the segments AB and A'B' are parallel: ZA' : ZA = ZB' : ZB. */
export const isParallel = (v: LabValues): boolean => Math.abs(v.a2 * v.b - v.b2 * v.a) < 1e-9;

/** Length of a segment between a point at distance u on ray 1 and one at w on ray 2. */
export function chord(u: number, w: number): number {
  return Math.sqrt(u * u + w * w - 2 * u * w * Math.cos(RAYS.angle * RAD));
}

const onRay1 = (u: number): Pt => ({ x: RAYS.zx + u * RAYS.scale, y: RAYS.zy });
const onRay2 = (w: number): Pt => ({
  x: RAYS.zx + w * RAYS.scale * Math.cos(RAYS.angle * RAD),
  y: RAYS.zy - w * RAYS.scale * Math.sin(RAYS.angle * RAD),
});
const along1 = (p: Pt) => (p.x - RAYS.zx) / RAYS.scale;
const along2 = (p: Pt) =>
  ((p.x - RAYS.zx) * Math.cos(RAYS.angle * RAD) + (RAYS.zy - p.y) * Math.sin(RAYS.angle * RAD)) / RAYS.scale;

const intercept: LabView = {
  render(v) {
    const parallel = isParallel(v);
    const Z: Pt = { x: RAYS.zx, y: RAYS.zy };
    const A = onRay1(v.a);
    const A2 = onRay1(v.a2);
    const B = onRay2(v.b);
    const B2 = onRay2(v.b2);
    const end1 = onRay1(RAYS.length);
    const end2 = onRay2(RAYS.length);
    let out =
      open(`Zwei Strahlen von Z, Strecken AB und A'B': ${parallel ? "parallel" : "nicht parallel"}`) +
      title(parallel ? "AB ∥ A'B': die Strahlensätze gelten" : "AB und A'B' sind nicht parallel");
    out += line(Z.x, Z.y, end1.x, end1.y, "lab-ink") + line(Z.x, Z.y, end2.x, end2.y, "lab-ink");
    out += polygon([Z, A2, B2], "lab-fill-b") + polygon([Z, A, B], "lab-fill-a");
    out += line(A.x, A.y, B.x, B.y, parallel ? "lab-side-ok" : "lab-side-a");
    out += line(A2.x, A2.y, B2.x, B2.y, parallel ? "lab-side-ok" : "lab-side-b");
    out += text(Z.x - 6, Z.y + 16, "Z", "lab-text", "end");
    out += text(A.x, A.y + 18, "A", "lab-text-a", "middle") + text(A2.x, A2.y + 18, "A'", "lab-text-b", "middle");
    out += text(B.x - 8, B.y - 4, "B", "lab-text-a", "end") + text(B2.x - 8, B2.y - 4, "B'", "lab-text-b", "end");
    out += infoBox(60, 300, [
      [`ZA' : ZA = ${fmt(v.a2)} : ${fmt(v.a)} = ${fmt(v.a2 / v.a, 2)}    ZB' : ZB = ${fmt(v.b2)} : ${fmt(v.b)} = ${fmt(v.b2 / v.b, 2)}`, "lab-text-small"],
      [`AB = ${fmt(chord(v.a, v.b), 2)} cm, A'B' = ${fmt(chord(v.a2, v.b2), 2)} cm, A'B' : AB = ${fmt(chord(v.a2, v.b2) / chord(v.a, v.b), 2)}`, parallel ? "lab-text-ok" : "lab-text-small"],
    ]);
    out += handle("A", A.x, A.y, "Punkt A auf dem ersten Strahl");
    out += handle("A2", A2.x, A2.y, "Punkt A' auf dem ersten Strahl");
    out += handle("B", B.x, B.y, "Punkt B auf dem zweiten Strahl");
    out += handle("B2", B2.x, B2.y, "Punkt B' auf dem zweiten Strahl");
    return out + "</svg>";
  },
  handles: {
    A: { x: "a", drag: (p) => ({ a: along1(p) }) },
    A2: { x: "a2", drag: (p) => ({ a2: along1(p) }) },
    B: { x: "b", drag: (p) => ({ b: along2(p) }) },
    B2: { x: "b2", drag: (p) => ({ b2: along2(p) }) },
  },
};

// ─── 3.5 Thaleskreis: Höhensatz und Kathetensatz (aus Mathematik 9 RS) ──

const THALES = { left: 24, base: 214, scale: 29 };

function thalesGeometry(v: LabValues) {
  const c = v.c;
  const q = (c * v.s) / 100;
  const p = c - q;
  const h = Math.sqrt(p * q);
  const k = THALES.scale;
  const A: Pt = { x: THALES.left, y: THALES.base };
  const B: Pt = { x: THALES.left + c * k, y: THALES.base };
  const F: Pt = { x: A.x + q * k, y: THALES.base };
  const C: Pt = { x: F.x, y: THALES.base - h * k };
  return { c, p, q, h, A, B, F, C, k };
}

function thales(v: LabValues): string {
  const { c, p, q, h, A, B, F, C, k } = thalesGeometry(v);
  const a = Math.sqrt(c * p);
  const b = Math.sqrt(c * q);
  const mx = (A.x + B.x) / 2;
  let out = open("Rechtwinkliges Dreieck im Thaleskreis mit Höhe und Hypotenusenabschnitten");
  out += path(arcPath(mx, THALES.base, (c * k) / 2, 0, 180), "lab-dashed");
  out += polygon([A, B, C], "lab-shape");
  out += line(C.x, C.y, F.x, F.y, "lab-dashed");
  out += line(B.x, B.y, C.x, C.y, "lab-side-a") + line(A.x, A.y, C.x, C.y, "lab-side-b");
  out += line(A.x, A.y + 10, F.x, F.y + 10, "lab-side-b") + line(F.x, F.y + 10, B.x, B.y + 10, "lab-side-a");
  out += text((A.x + F.x) / 2, THALES.base + 26, `q = ${fmt(q, 2)}`, "lab-text lab-text-b", "middle");
  out += text((F.x + B.x) / 2, THALES.base + 26, `p = ${fmt(p, 2)}`, "lab-text lab-text-a", "middle");
  out += text(F.x + 5, (F.y + C.y) / 2, `h = ${fmt(h, 2)}`, "lab-text");
  out += angleMark(C, A, B, 12, "lab-angle", true);
  out += text(A.x - 4, A.y + 4, "A", "lab-text", "end") + text(B.x + 4, B.y + 4, "B", "lab-text");
  out += text(C.x, C.y - 12, "C", "lab-text", "middle");
  out += text(A.x, THALES.base + 48, `c = p + q = ${fmt(c, 2)} cm`, "lab-text-muted");

  // Side panel: two shapes of equal area at a common scale.
  const shapes =
    v.show === 0
      ? { sq: h, w: p, hh: q, sqLabel: "h²", rectLabel: "p · q", cls: "lab-fill-c", law: "Höhensatz: h² = p · q" }
      : v.show === 1
        ? { sq: a, w: c, hh: p, sqLabel: "a²", rectLabel: "c · p", cls: "lab-fill-a", law: "Kathetensatz: a² = c · p" }
        : { sq: b, w: c, hh: q, sqLabel: "b²", rectLabel: "c · q", cls: "lab-fill-b", law: "Kathetensatz: b² = c · q" };
  const panelX = 340;
  const kk = Math.min(16, 150 / Math.max(shapes.sq, shapes.w), 105 / Math.max(shapes.sq, shapes.hh));
  out += text(panelX, 26, shapes.law, "lab-text lab-text-big");
  out += rect(panelX, 60, shapes.sq * kk, shapes.sq * kk, shapes.cls);
  out += text(panelX + 4, 60 + shapes.sq * kk + 16, `${shapes.sqLabel} = ${fmt(shapes.sq * shapes.sq, 2)} cm²`, "lab-text");
  const ry = 60 + shapes.sq * kk + 34;
  out += rect(panelX, ry, shapes.w * kk, shapes.hh * kk, shapes.cls);
  out += text(panelX + 4, ry + shapes.hh * kk + 16, `${shapes.rectLabel} = ${fmt(shapes.w * shapes.hh, 2)} cm²`, "lab-text");
  out += handle("C", C.x, C.y, "Punkt C auf dem Thaleskreis");
  return out + "</svg>";
}

const thalesView: LabView = {
  render: thales,
  handles: {
    C: {
      x: "s",
      drag: (p, v) => {
        const { A, c, k } = thalesGeometry(v);
        const centre = A.x + (c * k) / 2;
        const angle = Math.atan2(Math.max(THALES.base - p.y, 0), p.x - centre);
        const foot = centre + ((c * k) / 2) * Math.cos(angle);
        return { s: clamp(((foot - A.x) / (c * k)) * 100, 0, 100) };
      },
    },
  },
};

export const AEHNLICHKEIT_VIEWS: Record<string, LabView> = {
  "similar-triangles": similarTriangles,
  "center-stretch": centerStretch,
  "scale-solid": scaleSolid,
  intercept,
  "thales-height": thalesView,
};

