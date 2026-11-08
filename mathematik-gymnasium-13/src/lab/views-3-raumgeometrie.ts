import { fmt } from "../exercises/format";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  arrow,
  circle,
  clamp,
  handle,
  type LabView,
  line,
  open,
  Plot,
  polygon,
  type Pt,
  text,
} from "./svg";

// ─── Vectors in space ──────────────────────────────────────────────────────

export interface V3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = (x: number, y: number, z: number): V3 => ({ x, y, z });
export const add3 = (a: V3, b: V3): V3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub3 = (a: V3, b: V3): V3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const mul3 = (k: number, a: V3): V3 => ({ x: k * a.x, y: k * a.y, z: k * a.z });
export const dot3 = (a: V3, b: V3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross3 = (a: V3, b: V3): V3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
export const norm3 = (a: V3): number => Math.hypot(a.x, a.y, a.z);
export const same3 = (a: V3, b: V3, eps = 1e-9): boolean =>
  Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps && Math.abs(a.z - b.z) < eps;

/** The angle between two vectors in degrees (0° to 180°); null for a zero vector. */
export function angleBetween3(a: V3, b: V3): number | null {
  const n = norm3(a) * norm3(b);
  if (n < 1e-12) return null;
  return (Math.acos(clamp(dot3(a, b) / n, -1, 1)) * 180) / Math.PI;
}

// ─── Notation in German school writing ─────────────────────────────────────

/** "P(1 | 2 | −3)": a point or vector in coordinates. */
export function p3(x: number, y: number, z: number, digits = 2): string {
  return `(${fmt(x, digits)} | ${fmt(y, digits)} | ${fmt(z, digits)})`;
}
/** "(1 | 2 | −3)" from a vector. */
export const pv = (v: V3, digits = 2): string => p3(v.x, v.y, v.z, digits);

const BRACKETS = "border-left:1.5px solid currentColor;border-right:1.5px solid currentColor";
const COLUMN_STYLE = `display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;padding:0.05em 0.38em;margin:0 0.12em;${BRACKETS};border-radius:0.65em / 50%`;

const cell = (value: number | string): string => (typeof value === "number" ? fmt(value) : value);

/** A column vector of three entries in round brackets. */
export function vec3Html(x: number | string, y: number | string, z: number | string): string {
  return `<span class="vec" style="${COLUMN_STYLE}"><span>${cell(x)}</span><span>${cell(y)}</span><span>${cell(z)}</span></span>`;
}
/** The column vector of a V3. */
export const col3 = (v: V3, digits = 2): string => vec3Html(fmt(v.x, digits), fmt(v.y, digits), fmt(v.z, digits));

/** A vector name with the arrow above it: vn("u") is u→. */
export function vn(name: string): string {
  const visible = name.replace(/<[^>]+>/g, "");
  const arrowMark = visible.length > 1 ? "⟶" : "→";
  return `<span class="vname" style="display:inline-block;position:relative;line-height:1;padding-top:0.42em"><span aria-hidden="true" style="position:absolute;left:0;right:0;top:0;text-align:center;font-size:0.7em;line-height:0.8">${arrowMark}</span>${name}</span>`;
}

/** The equation of a line: "g: X = (1 | 0 | 2) + t · (2 | 1 | 0)". */
export function lineText(name: string, a: V3, u: V3, digits = 2): string {
  return `${name}: X = ${pv(a, digits)} + t · ${pv(u, digits)}`;
}

/** The normal form of a plane: "2x + 3y + 6z = 6" with real minus signs. */
export function planeText(n: V3, d: number, digits = 2): string {
  const parts: Array<[number, string]> = [
    [n.x, "x"],
    [n.y, "y"],
    [n.z, "z"],
  ];
  let out = "";
  for (const [coefficient, variable] of parts) {
    const rounded = Number(coefficient.toFixed(digits));
    if (rounded === 0) continue;
    const abs = Math.abs(rounded);
    const number = abs === 1 ? "" : fmt(abs, digits);
    if (out === "") out = rounded < 0 ? `−${number}${variable}` : `${number}${variable}`;
    else out += rounded < 0 ? ` − ${number}${variable}` : ` + ${number}${variable}`;
  }
  return `${out || "0"} = ${fmt(d, digits)}`;
}

/** The equation of a sphere: "(x − 1)² + (y + 2)² + (z − 3)² = 16". */
export function sphereText(m: V3, r: number, digits = 2): string {
  const term = (variable: string, value: number): string => {
    const rounded = Number(value.toFixed(digits));
    if (rounded === 0) return `${variable}²`;
    return rounded > 0
      ? `(${variable} − ${fmt(rounded, digits)})²`
      : `(${variable} + ${fmt(-rounded, digits)})²`;
  };
  return `${term("x", m.x)} + ${term("y", m.y)} + ${term("z", m.z)} = ${fmt(r * r, digits)}`;
}

// ─── Lageberechnungen (gerechnet, nicht gezeichnet) ────────────────────────

export type LineCase = "schnittpunkt" | "parallel" | "windschief" | "identisch" | "degeneriert";

/** The case of two lines g: X = a + t·u and h: X = b + s·w. */
export function lineCase(a: V3, u: V3, b: V3, w: V3): LineCase {
  if (norm3(u) < 1e-9 || norm3(w) < 1e-9) return "degeneriert";
  const ap = sub3(b, a);
  const cu = cross3(u, w);
  if (norm3(cu) < 1e-9) {
    return norm3(cross3(ap, u)) < 1e-9 ? "identisch" : "parallel";
  }
  return Math.abs(dot3(ap, cu)) < 1e-9 ? "schnittpunkt" : "windschief";
}

/** The intersection of two lines, when they meet in one point (null for parallel or windschief). */
export function lineIntersection(a: V3, u: V3, b: V3, w: V3): { t: number; s: number; p: V3 } | null {
  const cu = cross3(u, w);
  const d2 = dot3(cu, cu);
  if (d2 < 1e-12) return null;
  const ap = sub3(b, a);
  if (Math.abs(dot3(ap, cu)) > 1e-9) return null;
  const t = dot3(cross3(ap, w), cu) / d2;
  const s = dot3(cross3(ap, u), cu) / d2;
  return { t, s, p: add3(a, mul3(t, u)) };
}

/** The distance between two lines in space (0 when they meet); also for degenerate directions. */
export function lineDistance(a: V3, u: V3, b: V3, w: V3): number {
  const nu = norm3(u);
  const nw = norm3(w);
  const ap = sub3(b, a);
  if (nu < 1e-9 && nw < 1e-9) return norm3(ap);
  if (nu < 1e-9) return norm3(cross3(ap, w)) / nw;
  if (nw < 1e-9) return norm3(cross3(ap, u)) / nu;
  const cu = cross3(u, w);
  const ncu = norm3(cu);
  if (ncu < 1e-9) return norm3(cross3(ap, u)) / nu;
  return Math.abs(dot3(ap, cu)) / ncu;
}

export type LinePlaneCase = "schnittpunkt" | "in-der-ebene" | "parallel" | "degeneriert";

/** The case of a line g: X = a + t·u and a plane E: n·X = d. */
export function linePlaneCase(n: V3, d: number, a: V3, u: V3): LinePlaneCase {
  if (norm3(n) < 1e-9 || norm3(u) < 1e-9) return "degeneriert";
  const nu = dot3(n, u);
  if (Math.abs(nu) > 1e-9) return "schnittpunkt";
  return Math.abs(dot3(n, a) - d) < 1e-9 ? "in-der-ebene" : "parallel";
}

/** The parameter t of the intersection of a line and a plane, when there is one. */
export function linePlaneT(n: V3, d: number, a: V3, u: V3): number | null {
  const nu = dot3(n, u);
  if (Math.abs(nu) < 1e-12) return null;
  return (d - dot3(n, a)) / nu;
}

/** The angle between a line and a plane in degrees (0° to 90°); null for zero vectors. */
export function linePlaneAngle(n: V3, u: V3): number | null {
  const len = norm3(n) * norm3(u);
  if (len < 1e-12) return null;
  const sin = Math.abs(dot3(n, u)) / len;
  return (Math.asin(clamp(sin, 0, 1)) * 180) / Math.PI;
}

export type PlaneCase = "schnittgerade" | "parallel" | "identisch" | "degeneriert";

/** The case of two planes E1: n1·X = d1 and E2: n2·X = d2. */
export function planeCase(n1: V3, d1: number, n2: V3, d2: number): PlaneCase {
  if (norm3(n1) < 1e-9 || norm3(n2) < 1e-9) return "degeneriert";
  const c = cross3(n1, n2);
  if (norm3(c) > 1e-9) return "schnittgerade";
  // parallel normals: n2 = lambda · n1
  let lambda = 0;
  const big = Math.max(Math.abs(n1.x), Math.abs(n1.y), Math.abs(n1.z));
  if (Math.abs(n1.x) === big) lambda = n2.x / n1.x;
  else if (Math.abs(n1.y) === big) lambda = n2.y / n1.y;
  else lambda = n2.z / n1.z;
  return Math.abs(d2 - lambda * d1) < 1e-9 ? "identisch" : "parallel";
}

/** The angle between two planes, as the angle of their normal vectors (0° to 180°). */
export function planeAngle(n1: V3, n2: V3): number | null {
  return angleBetween3(n1, n2);
}

/** The distance between two parallel planes; null when they are not parallel. */
export function planeDistance(n1: V3, d1: number, n2: V3, d2: number): number | null {
  if (norm3(n1) < 1e-9 || norm3(n2) < 1e-9) return null;
  const c = cross3(n1, n2);
  if (norm3(c) > 1e-9) return null;
  let lambda = 0;
  const big = Math.max(Math.abs(n1.x), Math.abs(n1.y), Math.abs(n1.z));
  if (Math.abs(n1.x) === big) lambda = n2.x / n1.x;
  else if (Math.abs(n1.y) === big) lambda = n2.y / n1.y;
  else lambda = n2.z / n1.z;
  if (Math.abs(lambda) < 1e-12) return null;
  return Math.abs(d2 / lambda - d1) / norm3(n1);
}

/** The distance from a point to a line; also for a degenerate direction. */
export function pointLineDistance(p: V3, a: V3, u: V3): number {
  return lineDistance(p, v3(0, 0, 0), a, u);
}

/** The distance from a point to a plane; null when n is the zero vector. */
export function pointPlaneDistance(p: V3, n: V3, d: number): number | null {
  const len = norm3(n);
  if (len < 1e-12) return null;
  return Math.abs(dot3(n, p) - d) / len;
}

// ─── Schräge Parallelprojektion ───────────────────────────────────────────
// x-Achse nach rechts unten, y-Achse nach rechts, z-Achse nach oben.

const SQ = 0.35355;
const O = { cx: 150, cy: 190, k: 21 };
const SCENE = { x: 8, y: 8, w: 284, h: 324 };
const PX = 302;

/** The oblique projection of a point of space. */
export function proj(x: number, y: number, z: number): Pt {
  return { x: O.cx + O.k * (y + SQ * x), y: O.cy - O.k * (z - SQ * x) };
}

function clipScene(id: string, content: string): string {
  return (
    `<clipPath id="${id}"><rect x="${SCENE.x}" y="${SCENE.y}" width="${SCENE.w}" height="${SCENE.h}" /></clipPath>` +
    `<g clip-path="url(#${id})">${content}</g>`
  );
}

/** The three axes with arrows and labels. */
function axes3(): string {
  const o = proj(0, 0, 0);
  const ex = proj(3.4, 0, 0);
  const ey = proj(0, 3.4, 0);
  const ez = proj(0, 0, 3.4);
  return (
    arrow(o.x, o.y, ex.x, ex.y, "lab-axis", 1.4) +
    arrow(o.x, o.y, ey.x, ey.y, "lab-axis", 1.4) +
    arrow(o.x, o.y, ez.x, ez.y, "lab-axis", 1.4) +
    text(ex.x + 4, ex.y + 10, "x", "lab-text-axis") +
    text(ey.x + 6, ey.y + 4, "y", "lab-text-axis") +
    text(ez.x + 2, ez.y - 6, "z", "lab-text-axis")
  );
}

function seg3(p: V3, q: V3, cls: string): string {
  const a = proj(p.x, p.y, p.z);
  const b = proj(q.x, q.y, q.z);
  return line(a.x, a.y, b.x, b.y, cls);
}

function arrow3(p: V3, q: V3, cls: string): string {
  const a = proj(p.x, p.y, p.z);
  const b = proj(q.x, q.y, q.z);
  return arrow(a.x, a.y, b.x, b.y, cls);
}

/** A parallelogram patch spanned by two directions, drawn as its projection. */
function patch(base: V3, e1: V3, e2: V3, cls: string): string {
  const corners = [base, add3(base, e1), add3(add3(base, e1), e2), add3(base, e2)];
  return polygon(
    corners.map((c) => proj(c.x, c.y, c.z)),
    cls,
  );
}

const panelLine = (y: number, content: string, cls = "lab-text-small") => text(PX, y, content, cls);

// ─── 3.1 Gerade im Raum ───────────────────────────────────────────────────

function gerade3d(v: LabValues, r: ReadoutValues): string {
  const a = v3(v.ax, v.ay, v.az);
  const u = v3(v.ux, v.uy, v.uz);
  const x = add3(a, mul3(v.t, u));
  const flat = norm3(u) < 1e-9;
  const from = add3(a, mul3(-12, u));
  const to = add3(a, mul3(12, u));
  let out = open("Eine Gerade im Raum mit Stützpunkt A, Richtung u und dem Punkt X(t)");
  let drawing = axes3();
  if (!flat) drawing += seg3(from, to, "lab-curve");
  drawing += arrow3(a, add3(a, u), "lab-side-c");
  drawing += circle(proj(a.x, a.y, a.z).x, proj(a.x, a.y, a.z).y, 5, "lab-point-a");
  const px = proj(x.x, x.y, x.z);
  drawing += circle(px.x, px.y, 6, "lab-point-b");
  out += clipScene("clip-rg1", drawing);
  const pa = proj(a.x, a.y, a.z);
  out += text(pa.x + 9, pa.y + 16, "A", "lab-text lab-text-a");
  out += text(px.x + 9, px.y - 8, "X(t)", "lab-text lab-text-b");
  out += panelLine(30, "Gerade g im Raum", "lab-text lab-text-big");
  out += panelLine(56, `A = ${pv(a)}`, "lab-text lab-text-a");
  out += panelLine(76, `u = ${pv(u)}`, "lab-text");
  out += panelLine(100, `t = ${fmt(v.t)}`, "lab-text lab-text-b");
  out += panelLine(124, str(r, "xt"), "lab-text lab-text-b");
  out += panelLine(152, flat ? "u = 0: kein Richtungsvektor" : "u ≠ 0: eine echte Gerade", "lab-text-muted");
  out += panelLine(172, `|u| = ${fmt(Math.hypot(u.x, u.y, u.z))}`, "lab-text-muted");
  out += panelLine(240, "Ziehe X(t): Der Punkt wandert", "lab-text-small");
  out += panelLine(254, "mit t auf der Geraden.", "lab-text-small");
  if (!flat) {
    out += handle("X", px.x, px.y, "Punkt X(t): t ändern");
  }
  out += `</svg>`;
  return out;
}

// ─── 3.2 Linearkombination ────────────────────────────────────────────────

const BOX2 = { x: 14, y: 14, w: 268, h: 300 };
const plane2 = () => new Plot(-6, 6, -6, 6, BOX2);

function linearkombination(v: LabValues, r: ReadoutValues): string {
  const plot = plane2();
  const u = v3(v.ux, v.uy, 0);
  const w = v3(v.vx, v.vy, 0);
  const target = v3(v.wx, v.wy, v.wz);
  const det = v.ux * v.vy - v.uy * v.vx;
  const O2 = plot.P(0, 0);
  const U = plot.P(u.x, u.y);
  const V = plot.P(w.x, w.y);
  const Wp = plot.P(target.x, target.y);
  let out = open("Zwei Vektoren in der xy-Ebene und ein Zielvektor w, der als Linearkombination dargestellt werden soll");
  out += plot.clip("clip-lk") + plot.grid(1, 2);
  let drawing = "";
  if (det !== 0 && v.wz === 0) {
    const rk = (v.wx * v.vy - v.wy * v.vx) / det;
    const sk = (v.ux * v.wy - v.uy * v.wx) / det;
    const ru = mul3(rk, u);
    const rs = add3(ru, mul3(sk, w));
    const A = plot.P(ru.x, ru.y);
    const B = plot.P(rs.x, rs.y);
    drawing += polygon([O2, U, plot.P(add3(u, w).x, add3(u, w).y), V], "lab-ghost");
    drawing += line(O2.x, O2.y, A.x, A.y, "lab-side-a");
    drawing += line(A.x, A.y, B.x, B.y, "lab-side-b");
    drawing += circle(A.x, A.y, 4, "lab-point-a");
    drawing += text(A.x + 8, A.y + 14, "r·u", "lab-text lab-text-a");
    drawing += text((A.x + B.x) / 2 + 8, (A.y + B.y) / 2 + 4, "s·v", "lab-text lab-text-b");
  }
  out += clipped2(drawing);
  out += arrow3xy(O2, U, "a");
  out += arrow3xy(O2, V, "b");
  out += arrow3xy(O2, Wp, v.wz === 0 ? "c" : "ghost");
  out += text(U.x + 8, U.y - 6, "u", "lab-text lab-text-a");
  out += text(V.x + 8, V.y - 6, "v", "lab-text lab-text-b");
  out += text(Wp.x + 8, Wp.y + 14, v.wz === 0 ? "w" : "w (z ≠ 0)", "lab-text lab-text-c");
  out += panelLine(30, "Linearkombination", "lab-text lab-text-big");
  out += panelLine(56, `u = ${pv(u, 0)}, v = ${pv(w, 0)}`, "lab-text-small");
  out += panelLine(74, `w = ${pv(target, 0)}`, "lab-text-small");
  out += panelLine(98, str(r, "lage"), "lab-text");
  out += panelLine(122, str(r, "rs"), "lab-text lab-text-big");
  out += panelLine(150, det === 0 ? "det(u | v) = 0: u, v kollinear" : `det(u | v) = ${fmt(det, 0)}`, "lab-text-muted");
  out += panelLine(236, "Ziehe die Spitzen von u", "lab-text-small");
  out += panelLine(250, "und v.", "lab-text-small");
  out += handle("u", U.x, U.y, "Spitze von Vektor u");
  out += handle("v", V.x, V.y, "Spitze von Vektor v");
  out += `</svg>`;
  return out;
}

function clipped2(content: string): string {
  return content ? `<g clip-path="url(#clip-lk)">${content}</g>` : "";
}

function arrow3xy(from: Pt, to: Pt, tone: "a" | "b" | "c" | "ghost"): string {
  const cls = { a: "lab-side-a", b: "lab-side-b", c: "lab-side-c", ghost: "lab-ghost" }[tone];
  return arrow(from.x, from.y, to.x, to.y, cls);
}

// ─── 3.3 Ebene in Parameterform ───────────────────────────────────────────

function ebeneParameter(v: LabValues, r: ReadoutValues): string {
  const p = v3(v.px, v.py, v.pz);
  const u = v3(v.ux, v.uy, v.uz);
  const w = v3(v.vx, v.vy, v.vz);
  const x = add3(add3(p, mul3(v.r, u)), mul3(v.s, w));
  const n = cross3(u, w);
  let out = open("Eine Ebene in Parameterform mit Stützpunkt P, Spannvektoren u und v und dem Punkt X(r | s)");
  let drawing = axes3();
  drawing += patch(p, mul3(3, u), mul3(3, w), "lab-fill-a");
  drawing += arrow3(p, add3(p, u), "lab-side-a");
  drawing += arrow3(p, add3(p, w), "lab-side-b");
  drawing += circle(proj(p.x, p.y, p.z).x, proj(p.x, p.y, p.z).y, 5, "lab-point-a");
  const pxp = proj(x.x, x.y, x.z);
  drawing += circle(pxp.x, pxp.y, 6, "lab-point-b");
  out += clipScene("clip-rg3", drawing);
  const pp = proj(p.x, p.y, p.z);
  out += text(pp.x + 9, pp.y + 16, "P", "lab-text lab-text-a");
  out += text(pxp.x + 9, pxp.y - 8, "X(r | s)", "lab-text lab-text-b");
  out += panelLine(30, "Ebene in Parameterform", "lab-text lab-text-big");
  out += panelLine(56, `P = ${pv(p)}`, "lab-text lab-text-a");
  out += panelLine(76, `u = ${pv(u)}, v = ${pv(w)}`, "lab-text-small");
  out += panelLine(98, `r = ${fmt(v.r)}, s = ${fmt(v.s)}`, "lab-text lab-text-b");
  out += panelLine(122, str(r, "xrs"), "lab-text lab-text-b");
  out += panelLine(150, `n = u × v = ${pv(n)}`, "lab-text-small");
  out += panelLine(168, norm3(n) < 1e-9 ? "u und v kollinear: keine Ebene" : `|n| = ${fmt(norm3(n))}`, "lab-text-muted");
  out += panelLine(240, "Ziehe X(r | s): r und s", "lab-text-small");
  out += panelLine(254, "ändern sich.", "lab-text-small");
  out += handle("X", pxp.x, pxp.y, "Punkt X(r | s): r und s ändern");
  out += `</svg>`;
  return out;
}

// ─── 3.4 Normalenform und Koordinatenform ─────────────────────────────────

function ebeneNormal(v: LabValues, r: ReadoutValues): string {
  const n = v3(v.nx, v.ny, v.nz);
  const len = norm3(n);
  let out = open("Eine Ebene in Koordinatenform mit Normalenvektor und Achsenabschnitten");
  let drawing = axes3();
  if (len > 1e-9) {
    const foot = mul3(v.d / (len * len), n);
    const e1 = norm3(cross3(n, v3(1, 0, 0))) > 1e-9 ? cross3(n, v3(1, 0, 0)) : cross3(n, v3(0, 1, 0));
    const e2 = cross3(n, e1);
    const s1 = mul3(4 / (norm3(e1) || 1), e1);
    const s2 = mul3(4 / (norm3(e2) || 1), e2);
    drawing += patch(add3(foot, mul3(-1, s1)), mul3(2, s1), mul3(2, s2), "lab-fill-a");
    drawing += arrow3(foot, add3(foot, mul3(2 / len, n)), "lab-side-b");
    const pf = proj(foot.x, foot.y, foot.z);
    drawing += circle(pf.x, pf.y, 4, "lab-point-b");
    drawing += line(proj(0, 0, 0).x, proj(0, 0, 0).y, pf.x, pf.y, "lab-dashed");
  }
  out += clipScene("clip-rg4", drawing);
  out += panelLine(30, "Ebene: n·X = d", "lab-text lab-text-big");
  out += panelLine(56, `n = ${pv(n)}, d = ${fmt(v.d)}`, "lab-text-small");
  out += panelLine(80, str(r, "koordinatenform"), "lab-text");
  out += panelLine(104, str(r, "abschnitte"), "lab-text-small");
  out += panelLine(128, str(r, "abstand"), "lab-text lab-text-big");
  out += panelLine(156, str(r, "lage"), "lab-text-muted");
  out += panelLine(236, "Der Normalenvektor steht", "lab-text-small");
  out += panelLine(250, "senkrecht auf der Ebene.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.5 Lage zweier Geraden ──────────────────────────────────────────────

function geradenLage(v: LabValues, r: ReadoutValues): string {
  const a = v3(v.ax, v.ay, v.az);
  const u = v3(v.ux, v.uy, v.uz);
  const b = v3(v.bx, v.by, v.bz);
  const w = v3(v.vx, v.vy, v.vz);
  const s = lineIntersection(a, u, b, w);
  let out = open("Zwei Geraden im Raum, ihr Schnittpunkt oder ihr Abstand");
  let drawing = axes3();
  if (norm3(u) > 1e-9) drawing += seg3(add3(a, mul3(-8, u)), add3(a, mul3(8, u)), "lab-curve");
  if (norm3(w) > 1e-9) drawing += seg3(add3(b, mul3(-8, w)), add3(b, mul3(8, w)), "lab-curve-2");
  drawing += arrow3(a, add3(a, u), "lab-side-a");
  drawing += arrow3(b, add3(b, w), "lab-side-b");
  drawing += circle(proj(a.x, a.y, a.z).x, proj(a.x, a.y, a.z).y, 4.5, "lab-point-a");
  drawing += circle(proj(b.x, b.y, b.z).x, proj(b.x, b.y, b.z).y, 4.5, "lab-point-b");
  if (s) {
    const ps = proj(s.p.x, s.p.y, s.p.z);
    drawing += circle(ps.x, ps.y, 6, "lab-point-ok");
  }
  out += clipScene("clip-rg5", drawing);
  const pa = proj(a.x, a.y, a.z);
  const pb = proj(b.x, b.y, b.z);
  out += text(pa.x + 8, pa.y + 15, "A", "lab-text lab-text-a");
  out += text(pb.x + 8, pb.y + 15, "B", "lab-text lab-text-b");
  if (s) {
    const ps = proj(s.p.x, s.p.y, s.p.z);
    out += text(ps.x + 8, ps.y - 8, "S", "lab-text lab-text-ok");
  }
  out += panelLine(30, "Zwei Geraden", "lab-text lab-text-big");
  out += panelLine(54, `g: A = ${pv(a)}`, "lab-text-small");
  out += panelLine(70, `   u = ${pv(u)}`, "lab-text-small");
  out += panelLine(90, `h: B = ${pv(b)}`, "lab-text-small");
  out += panelLine(106, `   w = ${pv(w)}`, "lab-text-small");
  out += panelLine(132, str(r, "fall"), "lab-text lab-text-big");
  out += panelLine(154, str(r, "schnittpunkt"), "lab-text lab-text-a");
  out += panelLine(176, str(r, "winkel"), "lab-text");
  out += panelLine(198, `Abstand = ${fmt(lineDistance(a, u, b, w))} LE`, "lab-text");
  out += panelLine(240, "Winkel und Abstände werden", "lab-text-small");
  out += panelLine(254, "gerechnet, nicht gemessen.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.6 Gerade und Ebene ─────────────────────────────────────────────────

function geradeEbene(v: LabValues, r: ReadoutValues): string {
  const n = v3(v.nx, v.ny, v.nz);
  const a = v3(v.ax, v.ay, v.az);
  const u = v3(v.ux, v.uy, v.uz);
  const t = linePlaneT(n, v.d, a, u);
  let out = open("Eine Gerade und eine Ebene: Schnittpunkt, Parallelität oder Gerade in der Ebene");
  let drawing = axes3();
  if (norm3(n) > 1e-9) {
    const foot = mul3(v.d / (norm3(n) * norm3(n)), n);
    const e1 = norm3(cross3(n, v3(1, 0, 0))) > 1e-9 ? cross3(n, v3(1, 0, 0)) : cross3(n, v3(0, 1, 0));
    const e2 = cross3(n, e1);
    const s1 = mul3(4 / (norm3(e1) || 1), e1);
    const s2 = mul3(4 / (norm3(e2) || 1), e2);
    drawing += patch(add3(foot, mul3(-1, s1)), mul3(2, s1), mul3(2, s2), "lab-fill-a");
  }
  if (norm3(u) > 1e-9) drawing += seg3(add3(a, mul3(-8, u)), add3(a, mul3(8, u)), "lab-curve");
  drawing += arrow3(a, add3(a, u), "lab-side-c");
  drawing += circle(proj(a.x, a.y, a.z).x, proj(a.x, a.y, a.z).y, 4.5, "lab-point-a");
  if (t !== null) {
    const x = add3(a, mul3(t, u));
    const pxp = proj(x.x, x.y, x.z);
    drawing += circle(pxp.x, pxp.y, 6, "lab-point-ok");
  }
  out += clipScene("clip-rg6", drawing);
  out += panelLine(30, "Gerade und Ebene", "lab-text lab-text-big");
  out += panelLine(54, `E: n = ${pv(n)}, d = ${fmt(v.d)}`, "lab-text-small");
  out += panelLine(72, `g: A = ${pv(a)}, u = ${pv(u)}`, "lab-text-small");
  out += panelLine(98, str(r, "fall"), "lab-text lab-text-big");
  out += panelLine(120, str(r, "t"), "lab-text");
  out += panelLine(142, str(r, "schnittpunkt"), "lab-text lab-text-a");
  out += panelLine(164, str(r, "winkel"), "lab-text");
  out += panelLine(240, "Der Winkel zur Ebene misst", "lab-text-small");
  out += panelLine(254, "man über die Normale.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.7 Lage zweier Ebenen ───────────────────────────────────────────────

function ebenenLage(v: LabValues, r: ReadoutValues): string {
  const n1 = v3(v.n1x, v.n1y, v.n1z);
  const n2 = v3(v.n2x, v.n2y, v.n2z);
  let out = open("Zwei Ebenen im Raum: Schnittgerade, Parallelität oder Deckung");
  let drawing = axes3();
  const e1 = norm3(cross3(n1, v3(1, 0, 0))) > 1e-9 ? cross3(n1, v3(1, 0, 0)) : cross3(n1, v3(0, 1, 0));
  const e2 = cross3(n1, e1);
  const s1 = mul3(4 / (norm3(e1) || 1), e1);
  const s2 = mul3(4 / (norm3(e2) || 1), e2);
  if (norm3(n1) > 1e-9) {
    const foot = mul3(v.d1 / (norm3(n1) * norm3(n1)), n1);
    drawing += patch(add3(foot, mul3(-1, s1)), mul3(2, s1), mul3(2, s2), "lab-fill-a");
  }
  if (norm3(n2) > 1e-9) {
    const f1 = norm3(cross3(n2, v3(1, 0, 0))) > 1e-9 ? cross3(n2, v3(1, 0, 0)) : cross3(n2, v3(0, 1, 0));
    const f2 = cross3(n2, f1);
    const t1 = mul3(4 / (norm3(f1) || 1), f1);
    const t2 = mul3(4 / (norm3(f2) || 1), f2);
    const foot = mul3(v.d2 / (norm3(n2) * norm3(n2)), n2);
    drawing += patch(add3(foot, mul3(-1, t1)), mul3(2, t1), mul3(2, t2), "lab-fill-b");
    const u = cross3(n1, n2);
    if (norm3(u) > 1e-9) {
      const mid = mul3(0.5, add3(mul3(v.d1 / (norm3(n1) * norm3(n1)), n1), mul3(v.d2 / (norm3(n2) * norm3(n2)), n2)));
      drawing += seg3(add3(mid, mul3(-6, u)), add3(mid, mul3(6, u)), "lab-curve-ok");
    }
  }
  out += clipScene("clip-rg7", drawing);
  out += panelLine(30, "Zwei Ebenen", "lab-text lab-text-big");
  out += panelLine(54, `E₁: n₁ = ${pv(n1)}, d₁ = ${fmt(v.d1)}`, "lab-text-small");
  out += panelLine(72, `E₂: n₂ = ${pv(n2)}, d₂ = ${fmt(v.d2)}`, "lab-text-small");
  out += panelLine(98, str(r, "fall"), "lab-text lab-text-big");
  out += panelLine(120, str(r, "richtung"), "lab-text lab-text-a");
  out += panelLine(142, str(r, "winkel"), "lab-text");
  out += panelLine(240, "Zwei Ebenen schneiden sich", "lab-text-small");
  out += panelLine(254, "fast immer in einer Geraden.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.8 Abstände im Raum ─────────────────────────────────────────────────

function abstandLab(v: LabValues, r: ReadoutValues): string {
  const p = v3(v.px, v.py, v.pz);
  let out = open("Abstände im Raum: Punkt zu Gerade, Punkt zu Ebene und zwei windschiefe Geraden");
  let drawing = axes3();
  if (v.mode === 0) {
    const a = v3(0, v.ay, v.az);
    const u = v3(1, 0, 0);
    drawing += seg3(add3(a, mul3(-8, u)), add3(a, mul3(8, u)), "lab-curve");
    const f = v3(p.x, v.ay, v.az);
    drawing += seg3(p, f, "lab-dashed");
    drawing += circle(proj(p.x, p.y, p.z).x, proj(p.x, p.y, p.z).y, 5, "lab-point-a");
    drawing += circle(proj(f.x, f.y, f.z).x, proj(f.x, f.y, f.z).y, 4, "lab-point-ok");
  } else if (v.mode === 1) {
    const n = v3(v.nx, 2, 2);
    const len = norm3(n);
    const foot = sub3(p, mul3((dot3(n, p) - v.d) / (len * len), n));
    const e1 = norm3(cross3(n, v3(1, 0, 0))) > 1e-9 ? cross3(n, v3(1, 0, 0)) : cross3(n, v3(0, 1, 0));
    const e2 = cross3(n, e1);
    const s1 = mul3(4 / (norm3(e1) || 1), e1);
    const s2 = mul3(4 / (norm3(e2) || 1), e2);
    drawing += patch(add3(foot, mul3(-1, s1)), mul3(2, s1), mul3(2, s2), "lab-fill-a");
    drawing += seg3(p, foot, "lab-dashed");
    drawing += circle(proj(p.x, p.y, p.z).x, proj(p.x, p.y, p.z).y, 5, "lab-point-a");
  } else {
    const g = v3(0, 0, 0);
    const ug = v3(1, 0, 0);
    const h = v3(0, 0, v.b);
    const uh = v3(0, 1, 0);
    drawing += seg3(add3(g, mul3(-8, ug)), add3(g, mul3(8, ug)), "lab-curve");
    drawing += seg3(add3(h, mul3(-8, uh)), add3(h, mul3(8, uh)), "lab-curve-2");
  }
  out += clipScene("clip-rg8", drawing);
  out += panelLine(30, ["Punkt und Gerade", "Punkt und Ebene", "Zwei windschiefe Geraden"][v.mode] ?? "Abstand", "lab-text lab-text-big");
  out += panelLine(56, `P = ${pv(p)}`, "lab-text-small");
  out += panelLine(82, str(r, "hilfe"), "lab-text-small");
  out += panelLine(108, `Abstand = ${fmt(Number(r.abstand ?? 0))} LE`, "lab-text lab-text-big");
  out += panelLine(240, "Der Abstand wird senkrecht", "lab-text-small");
  out += panelLine(254, "gemessen und immer gerechnet.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.9 Kugeln im Raum ───────────────────────────────────────────────────

function kugelLab(v: LabValues, r: ReadoutValues): string {
  const m = v3(v.mx, v.my, v.mz);
  const n = v3(v.nx, v.ny, v.nz);
  const radius = v.r * O.k;
  const pm = proj(m.x, m.y, m.z);
  let out = open("Eine Kugel und eine Ebene oder Gerade: tangential, schneidend oder ohne Kontakt");
  let drawing = axes3();
  drawing += circle(pm.x, pm.y, radius, "lab-fill-b");
  drawing += circle(pm.x, pm.y, radius, "lab-ink");
  if (v.mode === 0 && norm3(n) > 1e-9) {
    const foot = sub3(m, mul3((dot3(n, m) - v.d) / (norm3(n) * norm3(n)), n));
    const e1 = norm3(cross3(n, v3(1, 0, 0))) > 1e-9 ? cross3(n, v3(1, 0, 0)) : cross3(n, v3(0, 1, 0));
    const e2 = cross3(n, e1);
    const s1 = mul3(4 / (norm3(e1) || 1), e1);
    const s2 = mul3(4 / (norm3(e2) || 1), e2);
    drawing += patch(add3(foot, mul3(-1, s1)), mul3(2, s1), mul3(2, s2), "lab-fill-a");
    drawing += seg3(m, foot, "lab-dashed");
  } else if (v.mode === 1) {
    const a = v3(0, v.ay, v.az);
    const u = v3(1, 0, 0);
    drawing += seg3(add3(a, mul3(-8, u)), add3(a, mul3(8, u)), "lab-curve");
  }
  drawing += circle(pm.x, pm.y, 3.5, "lab-point-a");
  out += clipScene("clip-rg9", drawing);
  out += text(pm.x + 8, pm.y - 8, "M", "lab-text lab-text-a");
  out += panelLine(30, "Kugel im Raum", "lab-text lab-text-big");
  out += panelLine(54, str(r, "gleichung"), "lab-text-small");
  out += panelLine(78, str(r, "abstand"), "lab-text");
  out += panelLine(100, str(r, "lage"), "lab-text lab-text-big");
  out += panelLine(122, str(r, "schnitt"), "lab-text");
  out += panelLine(240, "Alle Lagenfragen sind", "lab-text-small");
  out += panelLine(254, "Abstandsfragen.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── The views of the stage ───────────────────────────────────────────────

export const RAUMGEOMETRIE_VIEWS: Record<string, LabView> = {
  "gerade-3d": {
    render: gerade3d,
    handles: {
      X: {
        x: "t",
        drag: (p, v) => {
          const dir = proj(v.ux, v.uy, v.uz);
          const origin = proj(0, 0, 0);
          const dx = dir.x - origin.x;
          const dy = dir.y - origin.y;
          const len2 = dx * dx + dy * dy;
          if (len2 < 1e-9) return {};
          const x = add3(v3(v.ax, v.ay, v.az), mul3(v.t, v3(v.ux, v.uy, v.uz)));
          const drawn = proj(x.x, x.y, x.z);
          return { t: v.t + ((p.x - drawn.x) * dx + (p.y - drawn.y) * dy) / len2 };
        },
      },
    },
  },
  linearkombination: {
    render: linearkombination,
    handles: {
      u: pointHandle("ux", "uy"),
      v: pointHandle("vx", "vy"),
    },
  },
  "ebene-parameter": {
    render: ebeneParameter,
    handles: {
      X: {
        x: "r",
        y: "s",
        drag: (p, v) => {
          const o = proj(0, 0, 0);
          const du = proj(v.ux, v.uy, v.uz);
          const dv = proj(v.vx, v.vy, v.vz);
          const a = du.x - o.x;
          const b = dv.x - o.x;
          const c = du.y - o.y;
          const d = dv.y - o.y;
          const det = a * d - b * c;
          if (Math.abs(det) < 1e-9) return {};
          const x = add3(
            add3(v3(v.px, v.py, v.pz), mul3(v.r, v3(v.ux, v.uy, v.uz))),
            mul3(v.s, v3(v.vx, v.vy, v.vz)),
          );
          const drawn = proj(x.x, x.y, x.z);
          const ex = p.x - drawn.x;
          const ey = p.y - drawn.y;
          return { r: v.r + (ex * d - b * ey) / det, s: v.s + (a * ey - ex * c) / det };
        },
      },
    },
  },
  "ebene-normal": {
    render: ebeneNormal,
    handles: {
      F: {
        x: "d",
        drag: (p, v) => {
          const n = v3(v.nx, v.ny, v.nz);
          const len2 = dot3(n, n);
          if (len2 < 1e-9) return {};
          const o = proj(0, 0, 0);
          const step = proj(n.x / len2, n.y / len2, n.z / len2);
          const dx = step.x - o.x;
          const dy = step.y - o.y;
          const l2 = dx * dx + dy * dy;
          if (l2 < 1e-9) return {};
          const foot = mul3(v.d / len2, n);
          const drawn = proj(foot.x, foot.y, foot.z);
          return { d: v.d + ((p.x - drawn.x) * dx + (p.y - drawn.y) * dy) / l2 };
        },
      },
    },
  },
  "geraden-lage": { render: geradenLage },
  "gerade-ebene": { render: geradeEbene },
  "ebenen-lage": { render: ebenenLage },
  abstand: { render: abstandLab },
  kugel: { render: kugelLab },
};

function pointHandle(kx: string, ky: string) {
  return {
    x: kx,
    y: ky,
    drag: (p: Pt) => {
      const plot = plane2();
      return { [kx]: plot.invX(p.x), [ky]: plot.invY(p.y) };
    },
  };
}

/** The readout value of a key as text, for panels that show what the readouts hold. */
function str(r: ReadoutValues, key: string): string {
  const value = r[key];
  return typeof value === "string" ? value : typeof value === "number" ? fmt(value) : "";
}
