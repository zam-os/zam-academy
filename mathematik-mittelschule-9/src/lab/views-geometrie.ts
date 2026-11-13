import { fmt } from "../exercises/format";
import {
  pyramidSolid,
  regularPolygon,
  SOLIDS,
  type SolidKind,
} from "../models";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  angleMark,
  arcPath,
  circle,
  clamp,
  H,
  handle,
  infoBox,
  line,
  num,
  open,
  path,
  polar,
  polygon,
  sideLabel,
  str,
  text,
  W,
  type LabView,
  type Pt,
} from "./svg";
import { legend, legendRow, title } from "./view-helpers";

// ─── 3.1 Rechtwinklige Dreiecke als Teilfiguren ─────────────────────────────

/** The figures of lesson 3.1 with their cuts; each part is a triangle or more. */
export const FIGURES = ["Quadrat", "Rechteck", "Drachenviereck", "Parallelogramm", "Trapez"];
export const CUTS = ["eine Diagonale", "Höhe von einer Ecke", "beide Diagonalen"];

interface Part {
  pts: Pt[];
  /** Index of the right-angle vertex in `pts`, or -1. */
  right: number;
}

/** Corner points of the figure in model units (y up), width about 8. */
function figureCorners(fig: number): Pt[] {
  switch (fig) {
    case 0:
      return [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 6 }, { x: 0, y: 6 }];
    case 1:
      return [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 5 }, { x: 0, y: 5 }];
    case 2:
      return [{ x: 0, y: 3 }, { x: 3, y: 0 }, { x: 8, y: 3 }, { x: 3, y: 6 }];
    case 3:
      return [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: 8, y: 5 }, { x: 2, y: 5 }];
    default:
      return [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 6, y: 5 }, { x: 2, y: 5 }];
  }
}

const dot = (o: Pt, p: Pt, q: Pt) => (p.x - o.x) * (q.x - o.x) + (p.y - o.y) * (q.y - o.y);

/** The index of a right angle in a triangle, or -1. */
function rightIndex(t: Pt[]): number {
  for (let i = 0; i < 3; i++) {
    if (Math.abs(dot(t[i], t[(i + 1) % 3], t[(i + 2) % 3])) < 1e-9) return i;
  }
  return -1;
}

/** The parts a cut makes; the diagonals of a kite, a square and a rhombus cross at right angles. */
export function figureParts(fig: number, cut: number): Part[] {
  const [A, B, C, D] = figureCorners(fig);
  let tris: Pt[][];
  if (cut === 0) tris = [[A, B, C], [A, C, D]];
  else if (cut === 1) {
    // Height from D onto AB (from the top left corner straight down).
    const F = { x: D.x, y: A.y };
    tris = D.x === A.x ? [[A, B, C, D]] : [[A, F, D], [F, B, C, D]];
  } else {
    // Intersection of AC and BD.
    const d1 = { x: C.x - A.x, y: C.y - A.y };
    const d2 = { x: D.x - B.x, y: D.y - B.y };
    const det = d1.x * -d2.y - d1.y * -d2.x;
    const t = ((B.x - A.x) * -d2.y - (B.y - A.y) * -d2.x) / det;
    const S = { x: A.x + t * d1.x, y: A.y + t * d1.y };
    tris = [[A, B, S], [B, C, S], [C, D, S], [D, A, S]];
  }
  return tris.map((pts) => ({ pts, right: pts.length === 3 ? rightIndex(pts) : -1 }));
}

/** How many right triangles a figure and cut produce. */
export function rightTriangleCount(fig: number, cut: number): number {
  return figureParts(fig, cut).filter((part) => part.right >= 0).length;
}

const partsView: LabView = {
  render(v) {
    const parts = figureParts(v.fig, v.cut);
    const k = 34;
    const P = (p: Pt): Pt => ({ x: 70 + p.x * k, y: 290 - p.y * k });
    let out =
      open(`${FIGURES[v.fig]}, zerlegt durch ${CUTS[v.cut]}: ${rightTriangleCount(v.fig, v.cut)} rechtwinklige Dreiecke`) +
      title(`${FIGURES[v.fig]} · ${CUTS[v.cut]}`);
    for (const part of parts) {
      const pts = part.pts.map(P);
      out += polygon(pts, part.right >= 0 ? "lab-fill-ok" : "lab-shape-2");
      if (part.right >= 0) {
        const r = part.right;
        const V = pts[r];
        const U = pts[(r + 1) % 3];
        const X = pts[(r + 2) % 3];
        out += line(V.x, V.y, U.x, U.y, "lab-side-a") + line(V.x, V.y, X.x, X.y, "lab-side-b") + line(U.x, U.y, X.x, X.y, "lab-side-c");
        out += angleMark(V, U, X, 12, "lab-angle", true);
      }
    }
    const corners = figureCorners(v.fig).map(P);
    out += polygon(corners, "lab-ink");
    "ABCD".split("").forEach((name, i) => {
      const c = corners[i];
      const centre = P({ x: 4, y: 3 });
      const dx = c.x - centre.x;
      const dy = c.y - centre.y;
      const len = Math.hypot(dx, dy) || 1;
      out += text(c.x + (dx / len) * 14, c.y + (dy / len) * 14 + 4, name, "lab-text", "middle");
    });
    const count = rightTriangleCount(v.fig, v.cut);
    out += infoBox(380, 70, [
      [`${count} rechtwinklige`, count ? "lab-text-ok" : "lab-text"],
      ["Dreiecke", count ? "lab-text-ok" : "lab-text"],
    ]);
    out += legend(380, 150, [
      ["lab-fill-a", "Kathete"],
      ["lab-fill-b", "Kathete"],
      ["lab-fill-c", "Hypotenuse"],
      ["lab-fill-ok", "rechtwinkliges Dreieck"],
    ]);
    out += text(380, 250, "Die Hypotenuse liegt dem", "lab-text-small");
    out += text(380, 266, "rechten Winkel gegenüber.", "lab-text-small");
    return out + "</svg>";
  },
};

// ─── 3.2 Thaleskreis ───────────────────────────────────────────────────────

const TH = { cx: 200, cy: 250, k: 22 };

/** C on (r = 1) or off the Thales circle: phi is the angle at the centre from B. */
function thalesPoints(v: LabValues) {
  const R = (v.c / 2) * TH.k;
  const A: Pt = { x: TH.cx - R, y: TH.cy };
  const B: Pt = { x: TH.cx + R, y: TH.cy };
  const C = polar(TH.cx, TH.cy, R * v.rf, v.phi);
  return { A, B, C, R };
}

/** The angle at C in degrees. */
export function thalesGamma(v: LabValues): number {
  const { A, B, C } = thalesPoints(v);
  const u = { x: A.x - C.x, y: A.y - C.y };
  const w = { x: B.x - C.x, y: B.y - C.y };
  return (Math.acos(clamp((u.x * w.x + u.y * w.y) / (Math.hypot(u.x, u.y) * Math.hypot(w.x, w.y)), -1, 1)) * 180) / Math.PI;
}

/** The angle at A in degrees. */
export function thalesAlpha(v: LabValues): number {
  const { A, C } = thalesPoints(v);
  return (Math.atan2(A.y - C.y, C.x - A.x) * 180) / Math.PI;
}

const thalesView: LabView = {
  render(v) {
    const { A, B, C, R } = thalesPoints(v);
    const gamma = thalesGamma(v);
    const right = Math.abs(gamma - 90) < 0.05;
    let out =
      open(`Thaleskreis über AB, C ${v.rf === 1 ? "auf dem Kreis" : v.rf < 1 ? "innerhalb" : "außerhalb"}, Winkel bei C ${fmt(gamma, 1)}°`) +
      title(`Winkel bei C: γ = ${fmt(gamma, 1)}°`);
    out += path(arcPath(TH.cx, TH.cy, R, 0, 180), "lab-dashed");
    out += circle(TH.cx, TH.cy, 3, "lab-dot-small");
    out += text(TH.cx, TH.cy + 16, "M", "lab-text-small", "middle");
    out += polygon([A, B, C], right ? "lab-fill-ok" : "lab-shape");
    out += line(A.x, A.y, B.x, B.y, "lab-side-c");
    out += line(A.x, A.y, C.x, C.y, "lab-side-b") + line(B.x, B.y, C.x, C.y, "lab-side-a");
    out += angleMark(C, A, B, 18, right ? "lab-angle-ok" : "lab-angle", right);
    out += text(A.x - 8, A.y + 5, "A", "lab-text", "end") + text(B.x + 8, B.y + 5, "B", "lab-text");
    out += text(C.x, C.y - 14, "C", "lab-text", "middle");
    const alphaDeg = thalesAlpha(v);
    out += infoBox(380, 70, [
      [`c = AB = ${fmt(v.c)} cm`, "lab-text-c"],
      [`α ≈ ${fmt(alphaDeg, 1)}°`, "lab-text-b"],
      [`β ≈ ${fmt(180 - alphaDeg - gamma, 1)}°`, "lab-text-a"],
      [`γ ≈ ${fmt(gamma, 1)}°`, right ? "lab-text-ok" : "lab-text"],
    ]);
    out += text(380, 182, v.rf === 1 ? "C auf dem Kreis:" : v.rf < 1 ? "C im Kreis:" : "C außerhalb:", "lab-text-small");
    out += text(380, 198, v.rf === 1 ? "immer 90°" : v.rf < 1 ? "stumpfer Winkel" : "spitzer Winkel", "lab-text-small");
    return out + handle("C", C.x, C.y, "Punkt C") + "</svg>";
  },
  handles: {
    C: {
      x: "phi",
      drag: (p) => {
        const angle = (Math.atan2(TH.cy - p.y, p.x - TH.cx) * 180) / Math.PI;
        return { phi: clamp(angle, 10, 170) };
      },
    },
  },
};

// ─── 3.3 Pythagoras: squares on the sides, and the puzzle proof ────────────
// Ported from mathematik-realschule-9 (lesson 1.1, "Quadrate an den Seiten").

interface PythagorasLayout {
  scale: number;
  origin: Pt;
}

function pythagorasLayout(v: LabValues): PythagorasLayout {
  const { a, b } = v;
  const width = 2 * a + b;
  const height = a + 2 * b;
  const scale = Math.min(34, 470 / width, 300 / height);
  const left = (W - width * scale) / 2 + a * scale;
  const top = (H - 20 - height * scale) / 2 + 20 + (a + b) * scale;
  return { scale, origin: { x: left, y: top } };
}

function pythagorasSquares(v: LabValues): string {
  const { a, b } = v;
  const c = Math.hypot(a, b);
  const { scale, origin } = pythagorasLayout(v);
  const P = (x: number, y: number): Pt => ({ x: origin.x + x * scale, y: origin.y - y * scale });
  const C = P(0, 0);
  const A = P(b, 0);
  const B = P(0, a);
  const sqA = [C, B, P(-a, a), P(-a, 0)];
  const sqB = [C, A, P(b, -b), P(0, -b)];
  const sqC = [A, B, P(a, a + b), P(a + b, b)];
  const centre = (pts: Pt[]) => ({ x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length });
  const ca = centre(sqA);
  const cb = centre(sqB);
  const cc = centre(sqC);
  return (
    open("Rechtwinkliges Dreieck mit den Quadraten über allen drei Seiten") +
    polygon(sqA, "lab-fill-a") +
    polygon(sqB, "lab-fill-b") +
    polygon(sqC, "lab-fill-c") +
    polygon([A, B, C], "lab-shape") +
    line(C.x, C.y, B.x, B.y, "lab-side-a") +
    line(C.x, C.y, A.x, A.y, "lab-side-b") +
    line(A.x, A.y, B.x, B.y, "lab-side-c") +
    angleMark(C, A, B, 14, "lab-angle", true) +
    text(ca.x, ca.y + 5, `a² = ${fmt(a * a, 2)}`, "lab-text lab-text-a", "middle") +
    text(cb.x, cb.y + 5, `b² = ${fmt(b * b, 2)}`, "lab-text lab-text-b", "middle") +
    text(cc.x, cc.y - 4, `c² = ${fmt(c * c, 2)}`, "lab-text lab-text-c", "middle") +
    text(cc.x, cc.y + 13, `c = ${fmt(c, 2)} cm`, "lab-text-small", "middle") +
    sideLabel(C, B, "a", 10, "lab-text lab-text-a") +
    sideLabel(C, A, "b", -10, "lab-text lab-text-b") +
    text(C.x - 6, C.y + 14, "C", "lab-text", "end") +
    text(A.x + 6, A.y + 14, "A", "lab-text") +
    text(B.x - 8, B.y - 4, "B", "lab-text", "end") +
    text(14, 22, `${fmt(a * a, 2)} + ${fmt(b * b, 2)} = ${fmt(c * c, 2)}`, "lab-text lab-text-big") +
    handle("A", A.x, A.y, "Ecke A: Kathete b") +
    handle("B", B.x, B.y, "Ecke B: Kathete a") +
    `</svg>`
  );
}

/** The four congruent triangles of the puzzle proof, as legs a and b along u and v. */
function puzzleTriangles(a: number, b: number, t: number): Pt[][] {
  const s = a + b;
  const phase = (index: number) => clamp(t * 3 - index, 0, 1);
  const tri = (R: Pt, u: Pt, v: Pt): Pt[] => [R, { x: R.x + a * u.x, y: R.y + a * u.y }, { x: R.x + b * v.x, y: R.y + b * v.y }];
  const move = (start: Pt, delta: Pt, k: number): Pt => ({ x: start.x + delta.x * k, y: start.y + delta.y * k });
  return [
    tri({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
    tri(move({ x: s, y: 0 }, { x: 0, y: b }, phase(0)), { x: 0, y: 1 }, { x: -1, y: 0 }),
    tri(move({ x: s, y: s }, { x: -b, y: -a }, phase(1)), { x: -1, y: 0 }, { x: 0, y: -1 }),
    tri(move({ x: 0, y: s }, { x: a, y: 0 }, phase(2)), { x: 0, y: -1 }, { x: 1, y: 0 }),
  ];
}

function pythagorasPuzzle(v: LabValues): string {
  const { a, b } = v;
  const t = v.puzzle / 100;
  const s = a + b;
  const scale = Math.min(26, 290 / s);
  const x0 = 150 - (s * scale) / 2 + 30;
  const y0 = H - 22;
  const P = (p: Pt): Pt => ({ x: x0 + p.x * scale, y: y0 - p.y * scale });
  const frame = [P({ x: 0, y: 0 }), P({ x: s, y: 0 }), P({ x: s, y: s }), P({ x: 0, y: s })];
  let holes = "";
  if (t <= 0) {
    const tilted = [P({ x: a, y: 0 }), P({ x: s, y: a }), P({ x: b, y: s }), P({ x: 0, y: b })];
    const m = P({ x: s / 2, y: s / 2 });
    holes = polygon(tilted, "lab-fill-c") + text(m.x, m.y + 5, "c²", "lab-text lab-text-c lab-text-big", "middle");
  } else if (t >= 1) {
    const sqA = [P({ x: 0, y: b }), P({ x: a, y: b }), P({ x: a, y: s }), P({ x: 0, y: s })];
    const sqB = [P({ x: a, y: 0 }), P({ x: s, y: 0 }), P({ x: s, y: b }), P({ x: a, y: b })];
    const ma = P({ x: a / 2, y: b + a / 2 });
    const mb = P({ x: a + b / 2, y: b / 2 });
    holes =
      polygon(sqA, "lab-fill-a") +
      polygon(sqB, "lab-fill-b") +
      text(ma.x, ma.y + 5, "a²", "lab-text lab-text-a", "middle") +
      text(mb.x, mb.y + 5, "b²", "lab-text lab-text-b", "middle");
  }
  const triangles = puzzleTriangles(a, b, t)
    .map((tri) => polygon(tri.map(P), "lab-shape-2"))
    .join("");
  const caption =
    t <= 0
      ? ["Frei bleibt das Quadrat", "über der Hypotenuse: c²"]
      : t >= 1
        ? ["Frei bleiben die Quadrate", "über den Katheten: a² + b²"]
        : ["Die vier Dreiecke werden", "nur verschoben …"];
  return (
    open("Puzzle-Beweis: vier gleiche Dreiecke in einem Quadrat der Seite a + b") +
    polygon(frame, "lab-shape") +
    holes +
    triangles +
    text(330, 60, "Großes Quadrat: Seite a + b", "lab-text") +
    text(330, 80, `= ${fmt(s, 2)} cm, Fläche ${fmt(s * s, 2)} cm²`, "lab-text-muted") +
    text(330, 112, "Darin: vier gleiche Dreiecke", "lab-text") +
    text(330, 132, `je ½ · a · b = ${fmt((a * b) / 2, 2)} cm²`, "lab-text-muted") +
    text(330, 176, caption[0], "lab-text") +
    text(330, 196, caption[1], "lab-text lab-text-big") +
    text(330, 240, "Die freie Fläche ist beide Male", "lab-text-muted") +
    text(330, 258, `${fmt(s * s, 2)} − 4 · ${fmt((a * b) / 2, 2)} = ${fmt(a * a + b * b, 2)} cm²`, "lab-text-muted") +
    `</svg>`
  );
}

const pythagoras: LabView = {
  render: (v) => (v.view === 1 ? pythagorasPuzzle(v) : pythagorasSquares(v)),
  handles: {
    A: {
      x: "b",
      drag: (p, v) => {
        const { scale, origin } = pythagorasLayout(v);
        return { b: (p.x - origin.x) / scale };
      },
    },
    B: {
      y: "a",
      drag: (p, v) => {
        const { scale, origin } = pythagorasLayout(v);
        return { a: (origin.y - p.y) / scale };
      },
    },
  },
};

// ─── 3.4 Pythagoras im Quader: Flächen- und Raumdiagonale ───────────────────

/** Oblique projection: depth at 45°, shortened to half. */
function oblique(x: number, y: number, z: number, u: number, ox: number, oy: number): Pt {
  const q = 0.5 * Math.SQRT1_2;
  return { x: ox + (x + y * q) * u, y: oy - (z + y * q) * u };
}

const cuboidDiagonals: LabView = {
  render(v) {
    const { a, b, c } = v;
    const e = Math.hypot(a, b);
    const d = Math.hypot(e, c);
    const u = Math.min(26, 260 / (a + 0.36 * b), 230 / (c + 0.36 * b));
    const P = (x: number, y: number, z: number) => oblique(x, y, z, u, 50, 300);
    const corners = {
      A: P(0, 0, 0), B: P(a, 0, 0), C: P(a, b, 0), D: P(0, b, 0),
      E: P(0, 0, c), F: P(a, 0, c), G: P(a, b, c), Hh: P(0, b, c),
    };
    const edge = (p: Pt, q: Pt, cls = "lab-ink") => line(p.x, p.y, q.x, q.y, cls);
    let out =
      open(`Quader ${fmt(a)} × ${fmt(b)} × ${fmt(c)} mit Flächendiagonale ${fmt(e, 2)} und Raumdiagonale ${fmt(d, 2)}`) +
      title(`e = √(${fmt(a)}² + ${fmt(b)}²) ≈ ${fmt(e, 2)};  d = √(e² + ${fmt(c)}²) ≈ ${fmt(d, 2)}`);
    const { A, B, C, D, E, F, G, Hh } = corners;
    // Hidden edges dashed.
    out += line(A.x, A.y, D.x, D.y, "lab-dashed") + line(D.x, D.y, C.x, C.y, "lab-dashed") + line(D.x, D.y, Hh.x, Hh.y, "lab-dashed");
    // The right triangle A C G in the solid.
    out += polygon([A, C, G], "lab-fill-ok");
    out += edge(A, B) + edge(B, C) + edge(A, E) + edge(B, F) + edge(C, G) + edge(E, F) + edge(F, G) + edge(G, Hh) + edge(Hh, E);
    out += line(A.x, A.y, C.x, C.y, "lab-side-a");
    out += line(C.x, C.y, G.x, G.y, "lab-side-b");
    out += line(A.x, A.y, G.x, G.y, "lab-side-c");
    out += angleMark(C, A, G, 10, "lab-angle", true);
    out += text(A.x - 6, A.y + 14, "A", "lab-text", "end") + text(C.x + 6, C.y + 12, "C", "lab-text") + text(G.x + 6, G.y - 6, "G", "lab-text");
    out += infoBox(352, 70, [
      [`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`, "lab-text"],
      [`e² = a² + b² = ${fmt(e * e, 2)}`, "lab-text-a"],
      [`d² = e² + c² = ${fmt(d * d, 2)}`, "lab-text-c"],
      [`d ≈ ${fmt(d, 2)}`, "lab-text-c"],
    ]);
    out += legend(352, 190, [
      ["lab-fill-a", "Flächendiagonale e (Kathete)"],
      ["lab-fill-b", "Kante c (Kathete)"],
      ["lab-fill-c", "Raumdiagonale d (Hypotenuse)"],
    ]);
    return out + "</svg>";
  },
};

// ─── 3.5 Umkehrung: die Knotenschnur ────────────────────────────────────────
// Ported from mathematik-realschule-9 (lesson 1.2, "Die Knotenschnur").

/** The rope's three sides sorted: the two short ones and the longest. */
export function ropeSides(v: LabValues): { sides: number[]; valid: boolean } {
  const r = v.N - v.p - v.q;
  const sides = [v.p, v.q, r].sort((x, y) => x - y);
  const valid = r > 0 && sides[0] + sides[1] > sides[2];
  return { sides, valid };
}

/** The angle opposite the longest side, or null when the rope makes no triangle. */
export function ropeGamma(v: LabValues): number | null {
  const { sides, valid } = ropeSides(v);
  if (!valid) return null;
  const [u, w, L] = sides;
  return (Math.acos((u * u + w * w - L * L) / (2 * u * w)) * 180) / Math.PI;
}

function rope(v: LabValues, r: ReadoutValues): string {
  const { sides, valid } = ropeSides(v);
  const [u, w, L] = sides;
  const scale = Math.min(34, 400 / Math.max(L, 1));
  const X: Pt = { x: (W - L * scale) / 2, y: 280 };
  const Y: Pt = { x: X.x + L * scale, y: 280 };
  let out = open("Ein Seil mit gleichen Knotenabständen, zu einem Dreieck gespannt");
  out += line(20, 292, W - 20, 292, "lab-thin");
  if (!valid) {
    out += text(W / 2, 120, v.N - v.p - v.q <= 0 ? "Für die dritte Seite bleibt kein Seil übrig." : "Die zwei kurzen Seiten reichen nicht bis zur Spitze.", "lab-text lab-text-bad", "middle");
    out += text(W / 2, 145, "Wähle p und q so, dass ein Dreieck entsteht.", "lab-text-muted", "middle");
    out += `</svg>`;
    return out;
  }
  const cosX = (L * L + w * w - u * u) / (2 * L * w);
  const angX = Math.acos(clamp(cosX, -1, 1));
  const Z: Pt = { x: X.x + w * scale * Math.cos(angX), y: X.y - w * scale * Math.sin(angX) };
  const gamma = num(r, "gamma");
  const right = Math.abs(gamma - 90) < 0.05;
  out += polygon([X, Y, Z], right ? "lab-fill-ok" : "lab-shape");
  const knots = (A: Pt, B: Pt, n: number) => {
    let dots = "";
    for (let i = 0; i < n; i++) {
      dots += circle(A.x + ((B.x - A.x) * i) / n, A.y + ((B.y - A.y) * i) / n, 3.2, "lab-point");
    }
    return dots;
  };
  out += line(X.x, X.y, Y.x, Y.y, "lab-side-c") + line(Y.x, Y.y, Z.x, Z.y, "lab-side-a") + line(Z.x, Z.y, X.x, X.y, "lab-side-b");
  out += knots(X, Y, L) + knots(Y, Z, u) + knots(Z, X, w);
  out += angleMark(Z, X, Y, 22, right ? "lab-angle-ok" : "lab-angle", right);
  out += circle(X.x, X.y, 6, "lab-point-b") + circle(Y.x, Y.y, 6, "lab-point-b") + circle(Z.x, Z.y, 6, "lab-point-b");
  out += sideLabel(X, Y, `${L}`, 16, "lab-text lab-text-c");
  out += sideLabel(Y, Z, `${u}`, 14, "lab-text lab-text-a");
  out += sideLabel(Z, X, `${w}`, 14, "lab-text lab-text-b");
  out += text(Z.x, Z.y - 28, `${fmt(gamma, 1)}°`, right ? "lab-text lab-text-ok" : "lab-text", "middle");
  out += text(16, 24, `${u}² + ${w}² = ${u * u + w * w}`, "lab-text lab-text-big");
  out += text(16, 46, `${L}² = ${L * L}`, "lab-text lab-text-big");
  out += text(W - 16, 24, str(r, "kind"), right ? "lab-text lab-text-ok" : "lab-text", "end");
  out += `</svg>`;
  return out;
}

// ─── 3.6 Regelmäßige Vielecke ──────────────────────────────────────────────

const polygonView: LabView = {
  render(v) {
    const poly = regularPolygon(v.n, v.s);
    const cx = 175;
    const cy = 185;
    const R = 130;
    const corner = (i: number) => polar(cx, cy, R, 90 + (i * 360) / v.n);
    const pts = Array.from({ length: v.n }, (_, i) => corner(i));
    let out =
      open(`Regelmäßiges ${v.n}-Eck: Mittelpunktswinkel ${fmt(poly.centre, 2)}°, Innenwinkel ${fmt(poly.interior, 2)}°`) +
      title(`Regelmäßiges ${v.n}-Eck mit s = ${fmt(v.s)} cm: u = ${fmt(poly.perimeter)} cm`);
    // Every determining triangle, one highlighted.
    for (let i = 0; i < v.n; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % v.n];
      out += polygon([{ x: cx, y: cy }, p, q], i === 0 ? "lab-fill-b" : i % 2 === 0 ? "lab-fill-a" : "lab-shape-2");
    }
    const [p0, p1] = [pts[0], pts[1]];
    out += line(p0.x, p0.y, p1.x, p1.y, "lab-side-c");
    out += path(arcPath(cx, cy, 26, 90, 90 + 360 / v.n), "lab-angle");
    const mAt = polar(cx, cy, 40, 90 + 180 / v.n);
    out += text(mAt.x, mAt.y + 4, "μ", "lab-text-b", "middle");
    out += angleMark(p0, { x: cx, y: cy }, p1, 16, "lab-angle");
    out += angleMark(p1, p0, { x: cx, y: cy }, 16, "lab-angle");
    out += circle(cx, cy, 3, "lab-dot-small");
    out += infoBox(338, 64, [
      [`μ = 360° : ${v.n} = ${fmt(poly.centre, 2)}°`, "lab-text-b"],
      ["Basiswinkel = (180° − μ) : 2", "lab-text-small"],
      [`Basiswinkel = ${fmt(poly.base, 2)}°`, "lab-text-a"],
      [`Innenwinkel = ${fmt(poly.interior, 2)}°`, "lab-text"],
      [`u = ${v.n} · ${fmt(v.s)} cm = ${fmt(poly.perimeter)} cm`, "lab-text-c"],
    ]);
    out += legendRow(30, 330, [
      ["lab-fill-b", "Bestimmungsdreieck (gleichschenklig)"],
      ["lab-fill-c", "Seite s"],
    ]);
    return out + "</svg>";
  },
};

// ─── 3.7 Pyramide und Kegel im Schrägbild ──────────────────────────────────

const solidView: LabView = {
  render(v) {
    const kind = SOLIDS[v.body] as SolidKind;
    const solid = pyramidSolid(kind, v.a, v.h);
    const u = Math.min(30, 250 / (v.a * 1.5), 230 / (v.h + 2));
    const P = (x: number, y: number, z: number) => oblique(x, y, z, u, 110, 295);
    let out =
      open(`${solid.name} im Schrägbild: ${solid.vertices} Ecken, ${solid.edges} Kanten, ${solid.faces} Flächen`) +
      title(
        kind === "Kegel"
          ? "Kegel: 1 Spitze · 1 gekrümmte Kante · 2 Flächen"
          : `${solid.name}: ${solid.vertices} Ecken · ${solid.edges} Kanten · ${solid.faces} Flächen`,
      );
    const apex = P(solid.centre.x, solid.centre.y, v.h);
    const base = solid.base.map((p) => P(p.x, p.y, 0));
    const foot = P(solid.centre.x, solid.centre.y, 0);
    if (kind === "Kegel") {
      // An ellipse for the base circle, outline tangents to the apex.
      const r = v.a / 2;
      const ellipse = Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * 2 * Math.PI;
        return P(solid.centre.x + r * Math.cos(t), solid.centre.y + r * Math.sin(t), 0);
      });
      out += polygon(ellipse, "lab-fill-a");
      const left = P(solid.centre.x - r, solid.centre.y, 0);
      const right = P(solid.centre.x + r, solid.centre.y, 0);
      out += polygon([left, right, apex], "lab-fill-b");
      out += line(foot.x, foot.y, right.x, right.y, "lab-side-a");
      out += line(right.x, right.y, apex.x, apex.y, "lab-side-b");
      out += text((foot.x + right.x) / 2, foot.y + 16, "r", "lab-text-a", "middle");
      out += text((right.x + apex.x) / 2 + 10, (right.y + apex.y) / 2, "s", "lab-text-b");
    } else {
      out += polygon(base, "lab-fill-a");
      base.forEach((p, i) => {
        out += polygon([p, base[(i + 1) % base.length], apex], i === 0 || i === base.length - 1 ? "lab-fill-b" : "lab-shape-2");
      });
      base.forEach((p) => {
        out += line(p.x, p.y, apex.x, apex.y, "lab-ink");
      });
      // Seitenhöhe on the front face.
      const m = { x: (base[0].x + base[1].x) / 2, y: (base[0].y + base[1].y) / 2 };
      out += line(m.x, m.y, apex.x, apex.y, "lab-side-b");
      out += line(foot.x, foot.y, m.x, m.y, "lab-side-a");
      out += text(m.x, m.y + 16, "hₛ", "lab-text-b", "middle");
    }
    out += line(foot.x, foot.y, apex.x, apex.y, "lab-side-c");
    out += text(foot.x + 6, (foot.y + apex.y) / 2, "h", "lab-text-c");
    out += circle(apex.x, apex.y, 3.5, "lab-dot-small");
    out += text(apex.x, apex.y - 10, "Spitze S", "lab-text-small", "middle");
    out += infoBox(355, 70, [
      [`Ecken: ${solid.vertices}`, "lab-text"],
      [`Kanten: ${solid.edges}`, "lab-text"],
      [`Flächen: ${solid.faces}`, "lab-text"],
      [solid.note, "lab-text-small"],
    ]);
    out += legend(355, 190, [
      ["lab-fill-a", "Grundfläche"],
      ["lab-fill-b", kind === "Kegel" ? "Mantel (gekrümmt)" : "Seitenflächen (Dreiecke)"],
      ["lab-fill-c", "Höhe h, senkrecht"],
    ]);
    return out + "</svg>";
  },
};

// ─── 3.8 Schiefe Pyramide und schiefer Kegel ────────────────────────────────

/** Edge lengths of a square pyramid (side a) whose apex lies at (dx, dy) over the centre. */
export function slantEdges(a: number, h: number, dx: number, dy: number): number[] {
  const half = a / 2;
  return [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ].map(([x, y]) => Math.hypot(x - dx, y - dy, h));
}

const obliqueSolid: LabView = {
  render(v) {
    const cone = v.body === 1;
    const half = v.a / 2;
    const u = Math.min(26, 250 / (v.a + 8 + 0.36 * (v.a + 8)), 230 / (v.h + 3));
    const P = (x: number, y: number, z: number) => oblique(x + half + 4, y + half + 4, z, u, 30, 305);
    const apex = P(v.dx, v.dy, v.h);
    const foot = P(v.dx, v.dy, 0);
    const centre = P(0, 0, 0);
    let out = open(`${cone ? "Kegel" : "Quadratische Pyramide"} mit Spitze über (${fmt(v.dx)} | ${fmt(v.dy)}): ${v.dx === 0 && v.dy === 0 ? "gerade" : "schief"}`);
    out += title(`${cone ? "Kegel" : "Pyramide"}: ${v.dx === 0 && v.dy === 0 ? "gerade" : "schief"}, Höhe h = ${fmt(v.h)} cm`);
    if (cone) {
      const ring = Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * 2 * Math.PI;
        return P(half * Math.cos(t), half * Math.sin(t), 0);
      });
      out += polygon(ring, "lab-fill-a");
      const lengths = ring.map((p, i) => {
        const t = (i / 48) * 2 * Math.PI;
        return { p, s: Math.hypot(half * Math.cos(t) - v.dx, half * Math.sin(t) - v.dy, v.h) };
      });
      const longest = lengths.reduce((m, x) => (x.s > m.s ? x : m));
      const shortest = lengths.reduce((m, x) => (x.s < m.s ? x : m));
      out += polygon([P(-half, 0, 0), P(half, 0, 0), apex], "lab-fill-b");
      out += line(longest.p.x, longest.p.y, apex.x, apex.y, "lab-side-b");
      out += line(shortest.p.x, shortest.p.y, apex.x, apex.y, "lab-side-a");
    } else {
      const base = [P(-half, -half, 0), P(half, -half, 0), P(half, half, 0), P(-half, half, 0)];
      out += polygon(base, "lab-fill-a");
      const edges = slantEdges(v.a, v.h, v.dx, v.dy);
      const max = Math.max(...edges);
      const min = Math.min(...edges);
      base.forEach((p, i) => {
        out += polygon([p, base[(i + 1) % 4], apex], "lab-shape-2");
      });
      base.forEach((p, i) => {
        const cls = Math.abs(edges[i] - max) < 1e-9 ? "lab-side-b" : Math.abs(edges[i] - min) < 1e-9 ? "lab-side-a" : "lab-ink";
        out += line(p.x, p.y, apex.x, apex.y, cls);
      });
    }
    out += line(foot.x, foot.y, apex.x, apex.y, "lab-side-c");
    out += circle(foot.x, foot.y, 3, "lab-dot-small");
    out += circle(centre.x, centre.y, 2.5, "lab-dot-small");
    out += text(foot.x + 6, (foot.y + apex.y) / 2, "h", "lab-text-c");
    const edges = cone ? null : slantEdges(v.a, v.h, v.dx, v.dy);
    const longest = cone ? Math.hypot(half + Math.hypot(v.dx, v.dy), v.h) : Math.max(...edges!);
    const shortest = cone ? Math.hypot(Math.max(0, half - Math.hypot(v.dx, v.dy)), v.h) : Math.min(...edges!);
    out += infoBox(330, 64, [
      [`Höhe h = ${fmt(v.h)} cm`, "lab-text-c"],
      [`längste ≈ ${fmt(longest, 2)} cm`, "lab-text-b"],
      [`kürzeste ≈ ${fmt(shortest, 2)} cm`, "lab-text-a"],
    ]);
    out += text(330, 160, "Die Höhe steht immer", "lab-text-small");
    out += text(330, 176, "senkrecht auf der Grundfläche,", "lab-text-small");
    out += text(330, 192, "auch bei schiefen Körpern.", "lab-text-small");
    out += legend(330, 222, [
      ["lab-fill-b", cone ? "längste Mantellinie" : "längste Kante"],
      ["lab-fill-a", cone ? "kürzeste Mantellinie" : "kürzeste Kante"],
      ["lab-fill-c", "Höhe h"],
    ]);
    return out + "</svg>";
  },
};

export const GEOMETRIE_VIEWS: Record<string, LabView> = {
  "right-parts": partsView,
  thales: thalesView,
  pythagoras,
  "cuboid-diagonals": cuboidDiagonals,
  rope: { render: rope },
  "regular-polygon": polygonView,
  "pyramid-cone": solidView,
  "oblique-solid": obliqueSolid,
};

