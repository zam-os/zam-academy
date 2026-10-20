import { fmt } from "../exercises/format";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  angleMark,
  arcPath,
  circle,
  clamp,
  H,
  handle,
  type LabView,
  line,
  num,
  open,
  path,
  type Pt,
  polar,
  polygon,
  rect,
  sideLabel,
  str,
  text,
  W,
} from "./svg";

// ─── 1.1 Pythagoras: squares on the sides, and the puzzle proof ────────────

interface PythagorasLayout {
  scale: number;
  /** C, the right angle, in SVG units. */
  origin: Pt;
}

function pythagorasLayout(v: LabValues): PythagorasLayout {
  const { a, b } = v;
  // Model: C = (0, 0), A = (b, 0), B = (0, a); squares outside the triangle.
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

// ─── 1.2 Seilspanner: a closed rope with N knots ───────────────────────────

/** The rope's three sides sorted: the two short ones and the longest. */
export function ropeSides(v: LabValues): { sides: number[]; valid: boolean } {
  const r = v.N - v.p - v.q;
  const sides = [v.p, v.q, r].sort((x, y) => x - y);
  const valid = r > 0 && sides[0] + sides[1] > sides[2];
  return { sides, valid };
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
  // Apex Z with XZ = w, YZ = u (cosine law for the angle at X).
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

// ─── 1.3 Thaleskreis: Höhensatz and Kathetensatz ───────────────────────────

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
  const mode = v.show;
  const shapes =
    mode === 0
      ? { sq: h, w: p, hh: q, sqLabel: "h²", rectLabel: "p · q", sqCls: "lab-fill-c", rectCls: "lab-fill-c", law: "Höhensatz: h² = p · q" }
      : mode === 1
        ? { sq: a, w: c, hh: p, sqLabel: "a²", rectLabel: "c · p", sqCls: "lab-fill-a", rectCls: "lab-fill-a", law: "Kathetensatz: a² = c · p" }
        : { sq: b, w: c, hh: q, sqLabel: "b²", rectLabel: "c · q", sqCls: "lab-fill-b", rectCls: "lab-fill-b", law: "Kathetensatz: b² = c · q" };
  const panelX = 340;
  const kk = Math.min(16, 150 / Math.max(shapes.sq, shapes.w), 105 / Math.max(shapes.sq, shapes.hh));
  out += text(panelX, 26, shapes.law, "lab-text lab-text-big");
  out += rect(panelX, 60, shapes.sq * kk, shapes.sq * kk, shapes.sqCls);
  out += text(panelX + 4, 60 + shapes.sq * kk + 16, `${shapes.sqLabel} = ${fmt(shapes.sq * shapes.sq, 2)} cm²`, "lab-text");
  const ry = 60 + shapes.sq * kk + 34;
  out += rect(panelX, ry, shapes.w * kk, shapes.hh * kk, shapes.rectCls);
  out += text(panelX + 4, ry + shapes.hh * kk + 16, `${shapes.rectLabel} = ${fmt(shapes.w * shapes.hh, 2)} cm²`, "lab-text");
  out += handle("C", C.x, C.y, "Punkt C auf dem Thaleskreis");
  out += `</svg>`;
  return out;
}

// ─── 1.4 Leiter: Sinus und Kosinus ─────────────────────────────────────────

const LADDER = { ground: 312, wall: 430, scale: 34 };

function ladderPoints(v: LabValues) {
  const k = LADDER.scale;
  const gk = v.L * Math.sin((v.alpha * Math.PI) / 180);
  const ak = v.L * Math.cos((v.alpha * Math.PI) / 180);
  const foot: Pt = { x: LADDER.wall - ak * k, y: LADDER.ground };
  const top: Pt = { x: LADDER.wall, y: LADDER.ground - gk * k };
  return { gk, ak, foot, top };
}

function ladder(v: LabValues): string {
  const { gk, ak, foot, top } = ladderPoints(v);
  const corner: Pt = { x: LADDER.wall, y: LADDER.ground };
  const safe = v.alpha >= 65 && v.alpha <= 75;
  let out = open("Eine Leiter lehnt an einer Wand und bildet ein rechtwinkliges Dreieck");
  out += rect(LADDER.wall, 20, 40, LADDER.ground - 20, "lab-shape-2");
  out += line(20, LADDER.ground, W - 10, LADDER.ground, "lab-ink");
  out += path(`M${foot.x} ${foot.y} L${foot.x + 110 * Math.cos((65 * Math.PI) / 180)} ${foot.y - 110 * Math.sin((65 * Math.PI) / 180)} A110 110 0 0 0 ${foot.x + 110 * Math.cos((75 * Math.PI) / 180)} ${foot.y - 110 * Math.sin((75 * Math.PI) / 180)} Z`, "lab-fill-ok");
  out += polygon([foot, corner, top], "lab-fill-c");
  out += line(foot.x, foot.y, corner.x, corner.y, "lab-side-b");
  out += line(corner.x, corner.y, top.x, top.y, "lab-side-a");
  // the ladder: two rails and rungs
  const dx = top.x - foot.x;
  const dy = top.y - foot.y;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * 5;
  const ny = (dx / len) * 5;
  out += line(foot.x + nx, foot.y + ny, top.x + nx, top.y + ny, "lab-ink") + line(foot.x - nx, foot.y - ny, top.x - nx, top.y - ny, "lab-ink");
  const rungs = Math.max(2, Math.round(v.L * 3));
  for (let i = 1; i < rungs; i++) {
    const t = i / rungs;
    out += line(foot.x + dx * t + nx, foot.y + dy * t + ny, foot.x + dx * t - nx, foot.y + dy * t - ny, "lab-thin");
  }
  out += angleMark(foot, corner, top, 34, safe ? "lab-angle-ok" : "lab-angle");
  out += angleMark(corner, foot, top, 14, "lab-angle", true);
  out += text(foot.x + 40, foot.y - 8, `α = ${v.alpha}°`, safe ? "lab-text lab-text-ok" : "lab-text");
  out += text((foot.x + corner.x) / 2, LADDER.ground + 18, `Ankathete ${fmt(ak, 2)} m`, "lab-text lab-text-b", "middle");
  out += text(LADDER.wall + 20, (corner.y + top.y) / 2 - 6, "GK", "lab-text lab-text-a", "middle");
  out += text(LADDER.wall + 20, (corner.y + top.y) / 2 + 10, `${fmt(gk, 2)} m`, "lab-text-small", "middle");
  out += text(16, 24, `sin α = ${fmt(gk, 2)} / ${fmt(v.L, 1)} = ${fmt(gk / v.L, 3)}`, "lab-text lab-text-big");
  out += text(16, 46, `cos α = ${fmt(ak, 2)} / ${fmt(v.L, 1)} = ${fmt(ak / v.L, 3)}`, "lab-text lab-text-big");
  out += text(16, 66, `Leiter (Hypotenuse): ${fmt(v.L, 1)} m · grüner Bereich: 65° bis 75°`, "lab-text-muted");
  out += handle("top", top.x, top.y, "Oberes Leiterende an der Wand");
  out += handle("foot", foot.x, foot.y, "Leiterfuß am Boden");
  out += `</svg>`;
  return out;
}

// ─── 1.5 Steigung: tan α und Prozent ───────────────────────────────────────

function slopeGeometry(v: LabValues) {
  const ratio = v.h / v.run;
  let w = 240;
  let hgt = w * ratio;
  if (hgt > 250) {
    w *= 250 / hgt;
    hgt = 250;
  }
  const start: Pt = { x: 60, y: 300 };
  const end: Pt = { x: start.x + w, y: start.y - hgt };
  return { ratio, start, end, corner: { x: end.x, y: start.y } };
}

function slope(v: LabValues, r: ReadoutValues): string {
  const { start, end, corner } = slopeGeometry(v);
  const alpha = num(r, "alpha");
  let out = open("Eine ansteigende Straße mit Steigungsdreieck und Verkehrsschild");
  out += polygon([start, corner, end], "lab-fill-c");
  out += line(start.x, start.y, corner.x, corner.y, "lab-side-b") + line(corner.x, corner.y, end.x, end.y, "lab-side-a");
  out += line(start.x, start.y, end.x, end.y, "lab-ink");
  out += line(20, start.y, start.x, start.y, "lab-ink") + line(end.x, end.y, end.x + 60, end.y, "lab-ink");
  out += angleMark(start, corner, end, 40, "lab-angle");
  out += angleMark(corner, start, end, 12, "lab-angle", true);
  out += text(start.x + 46, start.y - 6, `α = ${fmt(alpha, 2)}°`, "lab-text");
  out += text((start.x + corner.x) / 2, start.y + 18, `waagrecht ${fmt(v.run, 0)} m`, "lab-text lab-text-b", "middle");
  out += text(corner.x + 8, (corner.y + end.y) / 2 + 4, `${fmt(v.h, 0)} m hoch`, "lab-text lab-text-a");
  // traffic sign
  const sx = 420;
  const sy = 36;
  out += polygon([{ x: sx, y: sy }, { x: sx + 56, y: sy + 96 }, { x: sx - 56, y: sy + 96 }], "lab-sign");
  out += polygon([{ x: sx, y: sy + 16 }, { x: sx + 42, y: sy + 88 }, { x: sx - 42, y: sy + 88 }], "lab-sign-inner");
  const ramp = Math.min(26, 60 * (v.h / v.run));
  out += polygon([{ x: sx - 30, y: sy + 82 }, { x: sx + 30, y: sy + 82 }, { x: sx + 30, y: sy + 82 - ramp }], "lab-sign-ramp");
  out += line(sx, sy + 99, sx, sy + 116, "lab-ink");
  out += rect(sx - 44, sy + 116, 88, 30, "lab-sign-plate");
  out += text(sx, sy + 137, `${fmt(num(r, "percent"), 1)} %`, "lab-sign-text", "middle");
  out += line(sx, sy + 146, sx, sy + 190, "lab-ink");
  out += text(16, 24, `tan α = ${fmt(v.h, 0)} / ${fmt(v.run, 0)} = ${fmt(v.h / v.run, 4)}`, "lab-text lab-text-big");
  out += text(16, 44, `Steigung: ${fmt(num(r, "percent"), 1)} % heißt ${fmt(num(r, "percent"), 1)} m hoch auf 100 m waagrecht`, "lab-text-muted");
  out += handle("top", end.x, end.y, "Oberes Ende der Straße");
  out += `</svg>`;
  return out;
}

// ─── 1.6 Viertelkreis: sin² α + cos² α = 1 ─────────────────────────────────

const QUARTER = { x: 40, y: 310, r: 260 };

function unitQuarter(v: LabValues): string {
  const { x, y, r } = QUARTER;
  const s = Math.sin((v.alpha * Math.PI) / 180);
  const c = Math.cos((v.alpha * Math.PI) / 180);
  const O: Pt = { x, y };
  const P = polar(x, y, r, v.alpha);
  const F: Pt = { x: P.x, y };
  let out = open("Viertelkreis mit Radius 1: Sinus und Kosinus als Katheten");
  out += path(arcPath(x, y, r, 0, 90), "lab-thin");
  out += line(x, y, x + r + 10, y, "lab-axis") + line(x, y, x, y - r - 10, "lab-axis");
  if (v.helper === 1) {
    const G = polar(x, y, r, 45);
    out += polygon([O, { x: G.x, y }, G], "lab-ghost");
    out += text(G.x + 6, (G.y + y) / 2, "½√2", "lab-text-small");
    out += text((x + G.x) / 2, y - 6, "½√2", "lab-text-small", "middle");
  } else if (v.helper === 2) {
    for (const angle of [30, 60]) {
      const G = polar(x, y, r, angle);
      out += polygon([O, { x: G.x, y }, G], "lab-ghost");
      out += text(G.x + 6, G.y + 4, angle === 30 ? "30°: sin = ½" : "60°: sin = ½√3", "lab-text-small");
    }
  }
  out += polygon([O, F, P], "lab-fill-c");
  out += line(O.x, O.y, F.x, F.y, "lab-side-b") + line(F.x, F.y, P.x, P.y, "lab-side-a") + line(O.x, O.y, P.x, P.y, "lab-side-c");
  out += angleMark(O, F, P, 36, "lab-angle");
  if (v.alpha > 0 && v.alpha < 90) out += angleMark(F, O, P, 10, "lab-angle", true);
  out += text(x + 40, y - 8, `${v.alpha}°`, "lab-text");
  out += text((O.x + F.x) / 2, y + 18, `cos α = ${fmt(c, 3)}`, "lab-text lab-text-b", "middle");
  out += text(F.x + 6, (F.y + P.y) / 2, `sin α = ${fmt(s, 3)}`, "lab-text lab-text-a");
  out += text((O.x + P.x) / 2 - 10, (O.y + P.y) / 2 - 8, "1", "lab-text lab-text-c", "end");
  // the unit square, filled by cos² and sin²
  const sx = 360;
  const sy = 120;
  const side = 130;
  out += rect(sx, sy + side * (1 - c * c), side, side * c * c, "lab-fill-b");
  out += rect(sx, sy, side, side * s * s, "lab-fill-a");
  out += rect(sx, sy, side, side, "lab-ink");
  out += text(sx + side / 2, sy - 34, "sin²α + cos²α = 1", "lab-text lab-text-big", "middle");
  out += text(sx + side / 2, sy - 14, `${fmt(s * s, 3)} + ${fmt(c * c, 3)} = 1`, "lab-text-muted", "middle");
  if (s * s > 0.12) out += text(sx + side / 2, sy + (side * s * s) / 2 + 4, "sin²α", "lab-text lab-text-a", "middle");
  if (c * c > 0.12) out += text(sx + side / 2, sy + side - (side * c * c) / 2 + 4, "cos²α", "lab-text lab-text-b", "middle");
  out += handle("P", P.x, P.y, "Punkt P auf dem Viertelkreis");
  out += `</svg>`;
  return out;
}

export const DREIECKE_VIEWS: Record<"pythagoras" | "rope" | "thales" | "ladder" | "slope" | "unit-quarter", LabView> = {
  pythagoras,
  rope: { render: rope },
  thales: {
    render: thales,
    handles: {
      C: {
        x: "s",
        drag: (p, v) => {
          const { A, c, k } = thalesGeometry(v);
          const centre = A.x + (c * k) / 2;
          const angle = Math.atan2(Math.max(THALES.base - p.y, 0), p.x - centre);
          const foot = centre + ((c * k) / 2) * Math.cos(angle);
          return { s: ((foot - A.x) / (c * k)) * 100 };
        },
      },
    },
  },
  ladder: {
    render: ladder,
    handles: {
      top: {
        y: "alpha",
        drag: (p, v) => ({ alpha: (Math.asin(clamp((LADDER.ground - p.y) / (v.L * LADDER.scale), 0, 1)) * 180) / Math.PI }),
      },
      foot: {
        x: "alpha",
        drag: (p, v) => ({ alpha: (Math.acos(clamp((LADDER.wall - p.x) / (v.L * LADDER.scale), 0, 1)) * 180) / Math.PI }),
      },
    },
  },
  slope: {
    render: slope,
    handles: {
      top: {
        y: "h",
        drag: (p, v) => {
          const { start } = slopeGeometry(v);
          const angle = Math.atan2(Math.max(start.y - p.y, 0), Math.max(p.x - start.x, 1));
          return { h: v.run * Math.tan(Math.min(angle, 1.37)) };
        },
      },
    },
  },
  "unit-quarter": {
    render: unitQuarter,
    handles: {
      P: {
        y: "alpha",
        drag: (p) => ({ alpha: (Math.atan2(Math.max(QUARTER.y - p.y, 0), Math.max(p.x - QUARTER.x, 0)) * 180) / Math.PI }),
      },
    },
  },
};
