import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, clamp, handle, type LabView, line, open, path, polar, polygon, type Pt, r1, rect, text } from "./svg";

// ─── Shared space geometry of this stage ───────────────────────────────────
//
// Every body is a list of vertices in space and its faces; a camera maps
// space onto the drawing and knows its viewing direction. A face is seen when
// its outward normal points to the viewer; an edge is drawn solid when one of
// its faces is seen and dashed otherwise, the rule of every Schrägbild.

export interface V3 {
  x: number;
  y: number;
  z: number;
}

export const vec = (x: number, y: number, z: number): V3 => ({ x, y, z });
const add = (a: V3, b: V3): V3 => vec(a.x + b.x, a.y + b.y, a.z + b.z);
const sub = (a: V3, b: V3): V3 => vec(a.x - b.x, a.y - b.y, a.z - b.z);
const mul = (a: V3, s: number): V3 => vec(a.x * s, a.y * s, a.z * s);
const dot = (a: V3, b: V3): number => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: V3, b: V3): V3 => vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const len3 = (a: V3): number => Math.hypot(a.x, a.y, a.z);
const unit3 = (a: V3): V3 => mul(a, 1 / (len3(a) || 1));
const DEG = Math.PI / 180;
const Z_AXIS = vec(0, 0, 1);

/** A convex body: vertices and faces (vertex indices around each face). */
export interface Solid {
  verts: V3[];
  faces: number[][];
}

/** Maps a point of space onto the drawing; `view` points from the viewer into the scene. */
interface Camera {
  project: (p: V3) => Pt;
  view: V3;
}

function centroid(points: V3[]): V3 {
  return mul(points.reduce((s, p) => add(s, p), vec(0, 0, 0)), 1 / Math.max(1, points.length));
}

/** The outward normal of a face (Newell's method, turned away from the body's centre). */
function faceNormal(solid: Solid, face: number[]): V3 {
  let n = vec(0, 0, 0);
  for (let i = 0; i < face.length; i++) {
    const a = solid.verts[face[i]];
    const b = solid.verts[face[(i + 1) % face.length]];
    n = add(n, vec((a.y - b.y) * (a.z + b.z), (a.z - b.z) * (a.x + b.x), (a.x - b.x) * (a.y + b.y)));
  }
  const out = sub(centroid(face.map((i) => solid.verts[i])), centroid(solid.verts));
  return dot(n, out) < 0 ? mul(n, -1) : n;
}

/** Seen from the camera: the face turns to the viewer (or shows its edge, which lies on the outline). */
function faceSeen(solid: Solid, face: number[], view: V3): boolean {
  return dot(unit3(faceNormal(solid, face)), unit3(view)) < 1e-9;
}

interface Edge {
  a: number;
  b: number;
  faces: number[];
}

function edgesOf(solid: Solid): Edge[] {
  const map = new Map<string, Edge>();
  solid.faces.forEach((face, fi) => {
    face.forEach((a, i) => {
      const b = face[(i + 1) % face.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      const edge = map.get(key) ?? { a: Math.min(a, b), b: Math.max(a, b), faces: [] };
      edge.faces.push(fi);
      map.set(key, edge);
    });
  });
  return [...map.values()];
}

/** Whether an edge is seen: one of its faces turns to the viewer. */
function edgeSeen(solid: Solid, edge: Edge, view: V3): boolean {
  return edge.faces.some((fi) => faceSeen(solid, solid.faces[fi], view));
}

interface SolidStyle {
  /** Class of the seen faces' fill. */
  fill?: string;
  /** Class of a seen or a hidden edge; `null` leaves the edge out (it is drawn elsewhere). */
  edgeClass?: (edge: Edge, seen: boolean) => string | null;
  /** Extra attributes of an edge, e.g. a thinner or dashed stroke. */
  edgeStyle?: (edge: Edge, seen: boolean) => string;
}

const FILL_ONLY = 'style="stroke:none"';

/** A body in a Schrägbild or a view: hidden edges dashed, seen faces filled, seen edges solid. */
function drawSolid(solid: Solid, cam: Camera, style: SolidStyle = {}): string {
  const P = solid.verts.map(cam.project);
  const cls = style.edgeClass ?? ((_: Edge, seen: boolean) => (seen ? "lab-ink" : "lab-dashed"));
  let hidden = "";
  let seenEdges = "";
  for (const edge of edgesOf(solid)) {
    const seen = edgeSeen(solid, edge, cam.view);
    const c = cls(edge, seen);
    if (!c) continue;
    const extra = style.edgeStyle ? style.edgeStyle(edge, seen) : "";
    const drawn = seg(P[edge.a], P[edge.b], c, extra);
    if (seen) seenEdges += drawn;
    else hidden += drawn;
  }
  let fills = "";
  if (style.fill) {
    for (const face of solid.faces) {
      if (faceSeen(solid, face, cam.view)) fills += polygon(face.map((i) => P[i]), style.fill, FILL_ONLY);
    }
  }
  return hidden + fills + seenEdges;
}

/** The cut of a convex body with the plane through `p0` with normal `n`, as a polygon in space. */
function sectionOf(solid: Solid, p0: V3, n: V3): V3[] {
  const points: V3[] = [];
  const pushUnique = (p: V3) => {
    if (!points.some((q) => len3(sub(p, q)) < 1e-7)) points.push(p);
  };
  for (const edge of edgesOf(solid)) {
    const a = solid.verts[edge.a];
    const b = solid.verts[edge.b];
    const da = dot(sub(a, p0), n);
    const db = dot(sub(b, p0), n);
    if (Math.abs(da) < 1e-9) pushUnique(a);
    if (Math.abs(db) < 1e-9) pushUnique(b);
    if (da * db < 0 && Math.abs(da) > 1e-9 && Math.abs(db) > 1e-9) pushUnique(add(a, mul(sub(b, a), da / (da - db))));
  }
  if (points.length < 3) return [];
  const c = centroid(points);
  const u = unit3(sub(points[0], c));
  const w = cross(unit3(n), u);
  return points
    .map((p) => ({ p, angle: Math.atan2(dot(sub(p, c), w), dot(sub(p, c), u)) }))
    .sort((s, t) => s.angle - t.angle)
    .map((entry) => entry.p);
}

/** Where the line p0 + t · d runs inside a convex body: the interval [t0; t1], or null. */
function clipLine(solid: Solid, p0: V3, d: V3): [number, number] | null {
  let t0 = -Infinity;
  let t1 = Infinity;
  for (const face of solid.faces) {
    const n = faceNormal(solid, face);
    const q = solid.verts[face[0]];
    const dn = dot(d, n);
    const rhs = dot(sub(q, p0), n);
    if (Math.abs(dn) < 1e-12) {
      if (rhs < 0) return null;
      continue;
    }
    const t = rhs / dn;
    if (dn > 0) t1 = Math.min(t1, t);
    else t0 = Math.max(t0, t);
  }
  return t0 <= t1 ? [t0, t1] : null;
}

/** Convex hull of points in the drawing (monotone chain). */
function hull2(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length < 3) return pts;
  const crossZ = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && crossZ(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && crossZ(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function pathOf(points: Pt[], closed = false): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${r1(p.x)} ${r1(p.y)}`).join(" ") + (closed ? " Z" : "");
}

function seg(a: Pt, b: Pt, cls: string, extra = ""): string {
  return `<line x1="${r1(a.x)}" y1="${r1(a.y)}" x2="${r1(b.x)}" y2="${r1(b.y)}" class="${cls}" ${extra}/>`;
}

/** Points of an ellipse from a0 to a1 (degrees; 0° right, 90° front = down on screen, 270° back). */
function ellipsePts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Pt[] {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 6));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (a0 + ((a1 - a0) * i) / n) * DEG;
    pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return pts;
}

/** Words broken into lines of at most `max` characters. */
function wrap(content: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of content.split(" ")) {
    if (current && `${current} ${word}`.length > max) {
      lines.push(current);
      current = word;
    } else current = current ? `${current} ${word}` : word;
  }
  if (current) lines.push(current);
  return lines;
}

/** The stage accent marks the element a lab is about (a symmetry plane, a cut, an axis). */
const ACCENT_FILL = 'style="fill:color-mix(in srgb, var(--accent) 26%, transparent);stroke:var(--accent);stroke-width:2"';
const ACCENT_SOFT = 'style="fill:color-mix(in srgb, var(--accent) 9%, transparent);stroke:var(--accent);stroke-width:1;stroke-dasharray:4 4"';
const ACCENT_LINE = 'style="stroke:var(--accent);stroke-width:3;stroke-linecap:round"';
const ACCENT_DASH = 'style="stroke:var(--accent);stroke-width:2.2;stroke-dasharray:5 4"';

function accentText(x: number, y: number, content: string, anchor: "start" | "middle" | "end" = "start"): string {
  return text(x, y, content, "lab-text", anchor).replace("<text ", '<text style="fill:var(--accent);font-weight:700" ');
}

// ─── 3.1 Symmetrische Körper ───────────────────────────────────────────────

export const SYM_BODY_NAMES = ["Quader", "quadratische Säule", "Würfel", "quadratische Pyramide", "Zylinder", "Kegel", "Kugel"];
export const SYM_ELEMENTS = ["Ebene", "Achse", "Zentrum"];
/** Thirteen planes and thirteen axes through the centre are offered per body. */
export const SYM_CANDIDATES = 13;

type SymKind = "box" | "pyramid" | "cylinder" | "cone" | "sphere";

export interface SymBody {
  kind: SymKind;
  /** Half the extent in x (right), y (depth) and z (up); the centre lies at the origin. */
  hx: number;
  hy: number;
  hz: number;
}

/** The Quader has three different edges (3,6 × 2,4 × 1,6), the Säule a square base and a longer height. */
export const SYM_BODIES: SymBody[] = [
  { kind: "box", hx: 1.8, hy: 1.2, hz: 0.8 },
  { kind: "box", hx: 1, hy: 1, hz: 1.7 },
  { kind: "box", hx: 1.3, hy: 1.3, hz: 1.3 },
  { kind: "pyramid", hx: 1.5, hy: 1.5, hz: 1.4 },
  { kind: "cylinder", hx: 1.25, hy: 1.25, hz: 1.4 },
  { kind: "cone", hx: 1.45, hy: 1.45, hz: 1.45 },
  { kind: "sphere", hx: 1.6, hy: 1.6, hz: 1.6 },
];

function boxSolid(hx: number, hy: number, hz: number): Solid {
  const verts = [vec(-hx, -hy, -hz), vec(hx, -hy, -hz), vec(hx, hy, -hz), vec(-hx, hy, -hz), vec(-hx, -hy, hz), vec(hx, -hy, hz), vec(hx, hy, hz), vec(-hx, hy, hz)];
  return { verts, faces: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]] };
}

/** A right pyramid over a rectangle 2hx × 2hy; base at z = −hz, apex at z = hz. */
function pyramidSolid(hx: number, hy: number, hz: number): Solid {
  return {
    verts: [vec(-hx, -hy, -hz), vec(hx, -hy, -hz), vec(hx, hy, -hz), vec(-hx, hy, -hz), vec(0, 0, hz)],
    faces: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]],
  };
}

/** A many-sided prism or pyramid that stands in for a cylinder or cone where cuts are computed. */
function roundSolid(r: number, hz: number, cone: boolean, n = 48): Solid {
  const verts: V3[] = [];
  for (let i = 0; i < n; i++) verts.push(vec(r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), -hz));
  const faces: number[][] = [Array.from({ length: n }, (_, i) => i)];
  if (cone) {
    verts.push(vec(0, 0, hz));
    for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, n]);
  } else {
    for (let i = 0; i < n; i++) verts.push(vec(verts[i].x, verts[i].y, hz));
    faces.push(Array.from({ length: n }, (_, i) => n + i));
    for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, n + ((i + 1) % n), n + i]);
  }
  return { verts, faces };
}

function symSolid(b: SymBody): Solid {
  switch (b.kind) {
    case "pyramid":
      return pyramidSolid(b.hx, b.hy, b.hz);
    case "cylinder":
      return roundSolid(b.hx, b.hz, false);
    case "cone":
      return roundSolid(b.hx, b.hz, true);
    default:
      return boxSolid(b.hx, b.hy, b.hz);
  }
}

export type CandidateType = "F" | "E" | "V";

/**
 * Candidate k (1 … 13) of a body: F through the middles of opposite faces of
 * its box (3), E through the middles of opposite edges (6), V through
 * opposite corners (4). As an axis it is the line through the centre with
 * direction d; as a plane, F and V have the normal d, and E is the plane
 * through d and the remaining box axis (the plane through two opposite edges).
 */
export function symCandidate(b: SymBody, k: number): { type: CandidateType; d: V3; normal: V3 } {
  const { hx, hy, hz } = b;
  const i = clamp(Math.round(k), 1, SYM_CANDIDATES) - 1;
  const F = [vec(1, 0, 0), vec(0, 1, 0), vec(0, 0, 1)];
  if (i < 3) return { type: "F", d: F[i], normal: F[i] };
  if (i < 9) {
    const list: Array<[V3, V3]> = [
      [vec(hx, hy, 0), Z_AXIS],
      [vec(hx, -hy, 0), Z_AXIS],
      [vec(hx, 0, hz), vec(0, 1, 0)],
      [vec(hx, 0, -hz), vec(0, 1, 0)],
      [vec(0, hy, hz), vec(1, 0, 0)],
      [vec(0, hy, -hz), vec(1, 0, 0)],
    ];
    const [d, e] = list[i - 3];
    return { type: "E", d, normal: cross(d, e) };
  }
  // ordered so that the first one is clearly seen at the default view (30°), not edge-on
  const V = [vec(-hx, hy, hz), vec(hx, hy, -hz), vec(hx, -hy, hz), vec(hx, hy, hz)][i - 9];
  return { type: "V", d: V, normal: V };
}

/** A congruence mapping that keeps the body's centre (the origin) fixed. */
export type Iso = (p: V3) => V3;

export function reflectIso(n: V3): Iso {
  const u = unit3(n);
  return (p) => sub(p, mul(u, 2 * dot(p, u)));
}

export function rotateIso(d: V3, degrees: number): Iso {
  const k = unit3(d);
  const c = Math.cos(degrees * DEG);
  const s = Math.sin(degrees * DEG);
  return (p) => add(add(mul(p, c), mul(cross(k, p), s)), mul(k, dot(k, p) * (1 - c)));
}

export const pointIso: Iso = (p) => mul(p, -1);

/** Whether the mapping maps the body onto itself. */
export function isSymmetry(b: SymBody, iso: Iso): boolean {
  if (b.kind === "sphere") return true;
  // A cylinder keeps its axis (either way round), a cone keeps its apex on top.
  if (b.kind === "cylinder") return Math.abs(iso(Z_AXIS).z) > 1 - 1e-9;
  if (b.kind === "cone") return iso(Z_AXIS).z > 1 - 1e-9;
  const verts = symSolid(b).verts;
  return verts.every((p) => verts.some((q) => len3(sub(iso(p), q)) < 1e-6));
}

/** The largest n for which turning by 360° : n about the axis maps the body onto itself: 0 for none, Infinity for every angle. */
export function axisOrder(b: SymBody, d: V3): number {
  if (b.kind === "sphere") return Infinity;
  if (b.kind === "cylinder" || b.kind === "cone") {
    if (isSymmetry(b, rotateIso(d, 1))) return Infinity;
    return isSymmetry(b, rotateIso(d, 180)) ? 2 : 0;
  }
  for (const n of [6, 5, 4, 3, 2]) if (isSymmetry(b, rotateIso(d, 360 / n))) return n;
  return 0;
}

export interface SymResult {
  /** Plane, axis or centre is a symmetry element of the body. */
  symmetric: boolean;
  /** For an axis: 360° : order is its smallest angle (Infinity: every angle). */
  order: number;
  /** For an axis: turning by α maps the body onto itself. */
  turnMatches: boolean;
  type: CandidateType | "Z";
}

export function symmetryOf(v: LabValues): SymResult {
  const b = SYM_BODIES[v.body] ?? SYM_BODIES[0];
  if (v.elem === 2) return { symmetric: isSymmetry(b, pointIso), order: 0, turnMatches: false, type: "Z" };
  const cand = symCandidate(b, v.k);
  if (v.elem === 0) return { symmetric: isSymmetry(b, reflectIso(cand.normal)), order: 0, turnMatches: false, type: cand.type };
  const order = axisOrder(b, cand.d);
  return { symmetric: order >= 2, order, turnMatches: isSymmetry(b, rotateIso(cand.d, v.alpha)), type: cand.type };
}

export function hasCentre(body: number): boolean {
  return isSymmetry(SYM_BODIES[body] ?? SYM_BODIES[0], pointIso);
}

const BOX_PLANES = [
  "senkrechte Mittelebene parallel zur linken und rechten Seitenfläche",
  "senkrechte Mittelebene parallel zur Vorder- und Rückseite",
  "waagrechte Mittelebene parallel zu Grund- und Deckfläche",
  "senkrechte Diagonalebene durch die Kanten vorne links und hinten rechts",
  "senkrechte Diagonalebene durch die Kanten vorne rechts und hinten links",
  "schräge Diagonalebene durch die Tiefenkanten oben rechts und unten links",
  "schräge Diagonalebene durch die Tiefenkanten unten rechts und oben links",
  "schräge Diagonalebene durch die Kanten oben hinten und unten vorne",
  "schräge Diagonalebene durch die Kanten unten hinten und oben vorne",
];

const BOX_AXES = [
  "Achse durch die Mittelpunkte der linken und rechten Seitenfläche",
  "Achse durch die Mittelpunkte von Vorder- und Rückseite",
  "Achse durch die Mittelpunkte von Grund- und Deckfläche",
  "Achse durch die Mitten der senkrechten Kanten vorne links und hinten rechts",
  "Achse durch die Mitten der senkrechten Kanten vorne rechts und hinten links",
  "Achse durch die Mitten der Tiefenkanten oben rechts und unten links",
  "Achse durch die Mitten der Tiefenkanten unten rechts und oben links",
  "Achse durch die Mitten der Kanten oben hinten und unten vorne",
  "Achse durch die Mitten der Kanten unten hinten und oben vorne",
];

/** What candidate k of the chosen element is, in words. */
export function symCandidateName(v: LabValues): string {
  const b = SYM_BODIES[v.body] ?? SYM_BODIES[0];
  const i = clamp(Math.round(v.k), 1, SYM_CANDIDATES) - 1;
  const where = b.kind === "pyramid" || b.kind === "cone" ? "durch die Mitte der Höhe" : "durch den Mittelpunkt";
  if (v.elem === 2) return b.kind === "pyramid" || b.kind === "cone" ? "Mitte der Höhe" : "Mittelpunkt des Körpers";
  const vertical = i === 0 || i === 1 || i === 3 || i === 4;
  if (v.elem === 0) {
    if (b.kind === "box") return i < 9 ? BOX_PLANES[i] : "Ebene senkrecht zu einer Raumdiagonale";
    if (b.kind === "pyramid") {
      if (i === 0) return "senkrechte Ebene durch die Spitze und die Mitten der vorderen und hinteren Grundkante";
      if (i === 1) return "senkrechte Ebene durch die Spitze und die Mitten der linken und rechten Grundkante";
      if (i === 3) return "senkrechte Ebene durch die Spitze und die Ecken vorne links und hinten rechts";
      if (i === 4) return "senkrechte Ebene durch die Spitze und die Ecken vorne rechts und hinten links";
    }
    if (i === 2) return b.kind === "sphere" ? "waagrechte Ebene durch den Mittelpunkt" : "waagrechte Ebene auf halber Höhe";
    if (vertical) return b.kind === "sphere" ? "senkrechte Ebene durch den Mittelpunkt" : "senkrechte Ebene durch die Achse";
    return `schräge Ebene ${where}`;
  }
  if (b.kind === "box") return i < 9 ? BOX_AXES[i] : "Achse durch zwei gegenüberliegende Ecken (Raumdiagonale)";
  if (i === 2) {
    if (b.kind === "pyramid") return "senkrechte Achse durch die Spitze und den Mittelpunkt der Grundfläche";
    return b.kind === "sphere" ? "senkrechte Achse durch den Mittelpunkt" : "die Körperachse (senkrecht)";
  }
  if (vertical) return b.kind === "pyramid" ? "waagrechte Achse auf halber Höhe" : `waagrechte Achse ${where}`;
  return `schräge Achse ${where}`;
}

/** The verdict on the chosen element, as the readout and the panel say it. */
export function symVerdict(v: LabValues): string {
  const s = symmetryOf(v);
  if (v.elem === 2) return s.symmetric ? "Symmetriezentrum" : "kein Symmetriezentrum";
  if (v.elem === 0) return s.symmetric ? "Symmetrieebene" : "keine Symmetrieebene";
  if (!s.symmetric) return "keine Symmetrieachse";
  return s.order === Infinity ? "Symmetrieachse für jeden Winkel" : `Symmetrieachse, kleinster Winkel ${fmt(360 / s.order)}°`;
}

/** What happens to the image: mirror image, turned body or point image. */
export function symImageText(v: LabValues): string {
  const s = symmetryOf(v);
  if (v.elem === 1) {
    if (v.alpha === 0) return "Stelle α ein: 0° ist noch keine Drehung.";
    return s.turnMatches ? `Nach ${fmt(v.alpha)}° deckt er sich mit sich selbst.` : `Nach ${fmt(v.alpha)}° deckt er sich nicht.`;
  }
  const what = v.elem === 0 ? "Das Spiegelbild" : "Das Bild der Punktspiegelung";
  return s.symmetric ? `${what} deckt sich mit dem Körper.` : `${what} deckt sich nicht.`;
}

const SYM = { cx: 162, cy: 178, e: 22, dial: { cx: 420, cy: 250, r: 32 } };

function symScale(b: SymBody): number {
  return 108 / Math.hypot(b.hx, b.hy, b.hz);
}

/** An upright view from slightly above, turned by `azimuth` about the vertical. */
function symCamera(azimuth: number, k: number): Camera {
  const c = Math.cos(azimuth * DEG);
  const s = Math.sin(azimuth * DEG);
  const ce = Math.cos(SYM.e * DEG);
  const se = Math.sin(SYM.e * DEG);
  return {
    project: (p) => {
      const xr = p.x * c + p.y * s;
      const yr = -p.x * s + p.y * c;
      return { x: SYM.cx + k * xr, y: SYM.cy - k * (p.z * ce + yr * se) };
    },
    view: vec(-s * ce, c * ce, -se),
  };
}

/** Cylinder, cone or sphere with a vertical axis, drawn with ellipses: hidden outlines dashed. */
function roundBody(b: SymBody, k: number): string {
  const se = Math.sin(SYM.e * DEG);
  const ce = Math.cos(SYM.e * DEG);
  const R = b.hx * k;
  const ry = R * se;
  if (b.kind === "sphere") {
    let out = circle(SYM.cx, SYM.cy, R, "lab-fill-a").replace("/>", `${FILL_ONLY} />`);
    out += path(pathOf(ellipsePts(SYM.cx, SYM.cy, R, ry, 0, 180)), "lab-thin");
    out += path(pathOf(ellipsePts(SYM.cx, SYM.cy, R, ry, 180, 360)), "lab-dashed");
    return out + circle(SYM.cx, SYM.cy, R, "lab-ink");
  }
  const yb = SYM.cy + b.hz * k * ce;
  const yt = SYM.cy - b.hz * k * ce;
  if (b.kind === "cylinder") {
    const outline = [{ x: SYM.cx - R, y: yt }, ...ellipsePts(SYM.cx, yb, R, ry, 180, 0), { x: SYM.cx + R, y: yt }];
    let out = path(pathOf([...outline, ...ellipsePts(SYM.cx, yt, R, ry, 0, -180)], true), "lab-fill-a", FILL_ONLY);
    out += path(pathOf(ellipsePts(SYM.cx, yb, R, ry, 180, 360)), "lab-dashed");
    out += path(pathOf(outline), "lab-ink");
    out += path(pathOf(ellipsePts(SYM.cx, yt, R, ry, 0, 360), true), "lab-ink");
    return out;
  }
  // cone: the outline touches the base ellipse where sin t = −ry : H (on its back half)
  const H = yb - yt;
  const delta = Math.asin(Math.min(0.95, ry / H)) / DEG;
  const apex = { x: SYM.cx, y: yt };
  const front = ellipsePts(SYM.cx, yb, R, ry, -delta, 180 + delta);
  let out = path(pathOf([apex, ...front], true), "lab-fill-a", FILL_ONLY);
  out += path(pathOf(ellipsePts(SYM.cx, yb, R, ry, 180 + delta, 360 - delta)), "lab-dashed");
  out += path(pathOf([front[front.length - 1], apex, front[0]]), "lab-ink");
  out += path(pathOf(front), "lab-ink");
  return out;
}

/** Sample points of a round body (rims, apex) whose image the ghost outlines. */
function roundSamples(b: SymBody): V3[][] {
  const rim = (z: number) => Array.from({ length: 49 }, (_, i) => vec(b.hx * Math.cos((2 * Math.PI * i) / 48), b.hx * Math.sin((2 * Math.PI * i) / 48), z));
  if (b.kind === "cone") return [rim(-b.hz), [vec(0, 0, b.hz)]];
  return [rim(-b.hz), rim(b.hz)];
}

const GHOST = 'style="stroke-width:1.3;stroke-dasharray:6 4"';

/** The image of the body under the mapping, dashed in orange, so it can be compared with the body. */
function ghostOf(b: SymBody, iso: Iso, cam: Camera): string {
  if (b.kind === "sphere") return circle(SYM.cx, SYM.cy, b.hx * symScale(b), "lab-side-b").replace("/>", `${GHOST} />`);
  if (b.kind === "cylinder" || b.kind === "cone") {
    const groups = roundSamples(b).map((g) => g.map((p) => cam.project(iso(p))));
    let out = path(pathOf(hull2(groups.flat()), true), "lab-side-b", GHOST);
    for (const g of groups) if (g.length > 2) out += path(pathOf(g), "lab-side-b", 'style="stroke-width:1.1;stroke-dasharray:3 4;opacity:0.8"');
    return out;
  }
  const solid = symSolid(b);
  const P = solid.verts.map((p) => cam.project(iso(p)));
  return edgesOf(solid)
    .map((edge) => seg(P[edge.a], P[edge.b], "lab-side-b", GHOST))
    .join("");
}

function symmetryView(v: LabValues): string {
  const b = SYM_BODIES[v.body] ?? SYM_BODIES[0];
  const k = symScale(b);
  const cam = symCamera(v.view, k);
  const result = symmetryOf(v);
  const cand = symCandidate(b, v.k);
  const radius = Math.hypot(b.hx, b.hy, b.hz);
  let out = open("Ein Körper mit einer Ebene, einer Achse oder einem Punkt, der auf Symmetrie geprüft wird");
  out += `<clipPath id="sym-clip"><rect x="0" y="0" width="322" height="340" /></clipPath>`;
  let drawing = "";
  const basis = (n: V3) => {
    const helper = Math.abs(n.z) < 0.9 ? Z_AXIS : vec(1, 0, 0);
    const u = unit3(cross(n, helper));
    return { u, w: cross(n, u) };
  };
  // a plane: a light patch behind the body, the cut inside it
  if (v.elem === 0) {
    const { u, w } = basis(unit3(cand.normal));
    const Rp = radius * 1.12;
    const patch = [add(mul(u, Rp), mul(w, Rp)), add(mul(u, -Rp), mul(w, Rp)), add(mul(u, -Rp), mul(w, -Rp)), add(mul(u, Rp), mul(w, -Rp))];
    drawing += polygon(patch.map(cam.project), "lab-thin", ACCENT_SOFT);
  }
  drawing += b.kind === "box" || b.kind === "pyramid" ? drawSolid(symSolid(b), cam, { fill: "lab-fill-a" }) : roundBody(b, k);
  if (v.elem === 0) {
    const n = unit3(cand.normal);
    let cut: V3[];
    if (b.kind === "sphere") {
      const { u, w } = basis(n);
      cut = Array.from({ length: 48 }, (_, i) => add(mul(u, b.hx * Math.cos((2 * Math.PI * i) / 48)), mul(w, b.hx * Math.sin((2 * Math.PI * i) / 48))));
    } else cut = sectionOf(symSolid(b), vec(0, 0, 0), n);
    if (cut.length >= 3) drawing += polygon(cut.map(cam.project), "lab-thin", ACCENT_FILL);
    drawing += ghostOf(b, reflectIso(n), cam);
  } else if (v.elem === 1) {
    const d = unit3(cand.d);
    const inside = b.kind === "sphere" ? ([-b.hx, b.hx] as [number, number]) : clipLine(symSolid(b), vec(0, 0, 0), d);
    const [t0, t1] = inside ?? [0, 0];
    const ext = 0.75;
    const p0 = cam.project(mul(d, t0 - ext));
    const pa = cam.project(mul(d, t0));
    const pb = cam.project(mul(d, t1));
    const p1 = cam.project(mul(d, t1 + ext));
    drawing += seg(p0, pa, "lab-thin", ACCENT_LINE) + seg(pa, pb, "lab-thin", ACCENT_DASH) + seg(pb, p1, "lab-thin", ACCENT_LINE);
    if (v.alpha > 0) drawing += ghostOf(b, rotateIso(d, v.alpha), cam);
  } else {
    drawing += ghostOf(b, pointIso, cam);
    const Z = cam.project(vec(0, 0, 0));
    drawing += circle(Z.x, Z.y, 5, "lab-point").replace("/>", 'style="fill:var(--accent)" />');
    drawing += accentText(Z.x + 8, Z.y - 7, "Z");
  }
  out += `<g clip-path="url(#sym-clip)">${drawing}</g>`;

  // the panel: body, element, verdict and, for an axis, the dial for α
  const px = 334;
  out += rect(px - 8, 12, 186, 316, "lab-panel", 'rx="10"');
  out += text(px, 36, SYM_BODY_NAMES[v.body] ?? "", "lab-text lab-text-big");
  out += text(px, 58, v.elem === 2 ? "Punkt Z" : `${SYM_ELEMENTS[v.elem]} Nr. ${Math.round(v.k)} von ${SYM_CANDIDATES}`, "lab-text-muted");
  let y = 80;
  for (const lineText of wrap(symCandidateName(v), 27).slice(0, 4)) {
    out += text(px, y, lineText, "lab-text-small");
    y += 16;
  }
  y += 6;
  for (const lineText of wrap(symVerdict(v), 24)) {
    out += text(px, y, lineText, result.symmetric ? "lab-text lab-text-ok" : "lab-text lab-text-bad");
    y += 18;
  }
  y += 4;
  for (const lineText of wrap(symImageText(v), 28)) {
    out += text(px, y, lineText, "lab-text-small");
    y += 15;
  }
  out += text(px, 320, "orange gestrichelt: das Bild", "lab-text-small");
  if (v.elem === 1) {
    const { cx, cy, r } = SYM.dial;
    out += circle(cx, cy, r, "lab-thin");
    if (v.alpha > 0) {
      const end = polar(cx, cy, r, 90 - v.alpha);
      out += path(`M${r1(cx)} ${r1(cy)} L${r1(cx)} ${r1(cy - r)} A${r} ${r} 0 ${v.alpha > 180 ? 1 : 0} 1 ${r1(end.x)} ${r1(end.y)} Z`, "lab-fill-c");
    }
    out += text(cx, cy + r + 20, `α = ${fmt(v.alpha)}°`, "lab-text", "middle");
    const knob = polar(cx, cy, r, 90 - v.alpha);
    out += handle("alpha", knob.x, knob.y, "Drehwinkel α ändern");
  }
  out += `</svg>`;
  return out;
}

// ─── 3.2 Rotationskörper und Axialschnitte ─────────────────────────────────

const AXIAL = { cx: 128, sx: 392, base: 282, k: 18 };
/** How flat a circle looks from slightly above: the ellipse has ry = FLAT · rx. */
const FLAT = 0.3;

export const AXIAL_FIGURES = ["Rechteck", "rechtwinkliges Dreieck", "Halbkreis", "rechtwinkliges Trapez", "Rechteck mit Dreieck"];

export function axialBody(v: LabValues): string {
  if (v.shape === 0) return v.d > 0 ? "Rohr (Hohlzylinder)" : "Zylinder";
  if (v.shape === 3 && v.r === v.r2) return "Zylinder";
  return ["Zylinder", "Kegel", "Kugel", "Kegelstumpf", "Zylinder mit Kegelspitze"][v.shape] ?? "Zylinder";
}

/** The Axialschnitt in words, with its measures. */
export function axialSectionName(v: LabValues): string {
  switch (v.shape) {
    case 1:
      return `gleichschenkliges Dreieck: Grundseite ${fmt(2 * v.r)} cm, Höhe ${fmt(v.h)} cm`;
    case 2:
      return `Kreis mit dem Durchmesser ${fmt(2 * v.r)} cm`;
    case 3:
      return v.r === v.r2
        ? `Rechteck ${fmt(2 * v.r)} cm × ${fmt(v.h)} cm`
        : `gleichschenkliges Trapez: unten ${fmt(2 * v.r)} cm, oben ${fmt(2 * v.r2)} cm breit, ${fmt(v.h)} cm hoch`;
    case 4:
      return `Fünfeck: Rechteck ${fmt(2 * v.r)} cm × ${fmt(v.h)} cm mit Dreieck der Höhe ${fmt(v.k)} cm`;
    default:
      return v.d > 0
        ? `zwei Rechtecke je ${fmt(v.r)} cm × ${fmt(v.h)} cm, ${fmt(2 * v.d)} cm voneinander entfernt`
        : `Rechteck ${fmt(2 * v.r)} cm × ${fmt(v.h)} cm`;
  }
}

/** Full width of the Axialschnitt: twice the largest distance from the axis. */
export function axialWidth(v: LabValues): number {
  return v.shape === 0 ? 2 * (v.d + v.r) : v.shape === 3 ? 2 * Math.max(v.r, v.r2) : 2 * v.r;
}

/** Height of the body (and of its Axialschnitt). */
export function axialHeight(v: LabValues): number {
  return v.shape === 2 ? 2 * v.r : v.shape === 4 ? v.h + v.k : v.h;
}

/** The slanted side of the Axialschnitt as a ruler measures it in the drawing (grade 8 does not compute it). */
export function axialSlant(v: LabValues): number | null {
  switch (v.shape) {
    case 1:
      return Math.hypot(v.r, v.h);
    case 3:
      return v.r === v.r2 ? null : Math.hypot(v.h, v.r - v.r2);
    case 4:
      return Math.hypot(v.r, v.k);
    default:
      return null;
  }
}

/** The figure that turns, as (distance from the axis, height), round its border. */
function axialProfile(v: LabValues): Array<[number, number]> {
  switch (v.shape) {
    case 1:
      return [[0, 0], [v.r, 0], [0, v.h]];
    case 2:
      return Array.from({ length: 37 }, (_, i): [number, number] => {
        const t = (i / 36) * Math.PI;
        return [v.r * Math.sin(t), v.r - v.r * Math.cos(t)];
      });
    case 3:
      return [[0, 0], [v.r, 0], [v.r2, v.h], [0, v.h]];
    case 4:
      return [[0, 0], [v.r, 0], [v.r, v.h], [0, v.h + v.k]];
    default:
      return [[v.d, 0], [v.d + v.r, 0], [v.d + v.r, v.h], [v.d, v.h]];
  }
}

/** The outer border from bottom to top: it sweeps the mantle. */
function axialSilhouette(v: LabValues): Array<[number, number]> {
  switch (v.shape) {
    case 1:
      return [[v.r, 0], [0, v.h]];
    case 2:
      return axialProfile(v);
    case 3:
      return [[v.r, 0], [v.r2, v.h]];
    case 4:
      return [[v.r, 0], [v.r, v.h], [0, v.h + v.k]];
    default:
      return [[v.d + v.r, 0], [v.d + v.r, v.h]];
  }
}

function ring(cx: number, cy: number, rx: number, front = "lab-ink"): string {
  if (rx < 0.5) return "";
  return path(pathOf(ellipsePts(cx, cy, rx, rx * FLAT, 0, 180)), front) + path(pathOf(ellipsePts(cx, cy, rx, rx * FLAT, 180, 360)), "lab-dashed");
}

function axialSectionView(v: LabValues): string {
  const { cx, sx, base, k } = AXIAL;
  const prof = axialProfile(v);
  const top = axialHeight(v);
  const P = (rho: number, y: number, deg: number): Pt => {
    const a = deg * DEG;
    return { x: cx + rho * k * Math.cos(a), y: base - y * k + rho * k * FLAT * Math.sin(a) };
  };
  let out = open("Eine ebene Figur dreht sich um eine Achse; daneben der Axialschnitt des Rotationskörpers");
  // Left: the figure turns about the axis.
  out += line(cx, base + 14, cx, base - top * k - 18, "lab-dashed");
  if (v.phi >= 360) {
    const sil = axialSilhouette(v);
    const [rb, yb0] = sil[0];
    const [rt, yt0] = sil[sil.length - 1];
    const yb = base - yb0 * k;
    const yt = base - yt0 * k;
    const outline: Pt[] = [
      ...(rb > 0 ? ellipsePts(cx, yb, rb * k, rb * k * FLAT, 180, 0) : []),
      ...sil.map(([rho, y]) => P(rho, y, 0)),
      ...(rt > 0 ? ellipsePts(cx, yt, rt * k, rt * k * FLAT, 360, 180) : []),
      ...[...sil].reverse().map(([rho, y]) => P(rho, y, 180)),
    ];
    out += path(pathOf(outline, true), "lab-fill-a", FILL_ONLY);
    out += path(pathOf(outline, true), "lab-ink");
    if (rb > 0) out += path(pathOf(ellipsePts(cx, yb, rb * k, rb * k * FLAT, 180, 360)), "lab-dashed");
    if (rt > 0) out += path(pathOf(ellipsePts(cx, yt, rt * k, rt * k * FLAT, 0, 180)), "lab-ink");
    if (v.shape === 0 && v.d > 0) {
      // the hole: its rim on top seen, its wall and its lower rim hidden
      const di = v.d * k;
      out += path(pathOf(ellipsePts(cx, yt, di, di * FLAT, 0, 360), true), "lab-plot-bg");
      out += path(pathOf(ellipsePts(cx, yt, di, di * FLAT, 0, 360), true), "lab-ink");
      out += line(cx - di, yt, cx - di, yb, "lab-dashed") + line(cx + di, yt, cx + di, yb, "lab-dashed");
      out += path(pathOf(ellipsePts(cx, yb, di, di * FLAT, 0, 360), true), "lab-dashed");
    }
    if (v.shape === 2) out += ring(cx, base - v.r * k, v.r * k, "lab-thin");
    if (v.shape === 4) out += ring(cx, base - v.h * k, v.r * k, "lab-thin");
  } else {
    if (v.phi > 0) {
      out += polygon(prof.map(([rho, y]) => P(rho, y, 0)), "lab-ghost");
      for (let deg = 45; deg < v.phi; deg += 45) {
        out += polygon(prof.map(([rho, y]) => P(rho, y, deg)), "lab-thin", 'opacity="0.5"');
      }
      const traced = v.shape === 2 ? [45, 90, 135].map((deg): [number, number] => [v.r * Math.sin(deg * DEG), v.r - v.r * Math.cos(deg * DEG)]) : prof.filter(([rho]) => rho > 0);
      for (const [rho, y] of traced) {
        const pts: Pt[] = [];
        for (let deg = 0; deg <= v.phi; deg += 5) pts.push(P(rho, y, deg));
        out += path(pathOf(pts), "lab-dashed");
      }
    }
    out += polygon(prof.map(([rho, y]) => P(rho, y, v.phi)), "lab-fill-b");
  }
  const bottomRim = v.phi >= 360 ? axialSilhouette(v)[0][0] : 0;
  out += text(cx, base + Math.max(30, bottomRim * k * FLAT + 16), "Drehachse", "lab-text-small", "middle");
  out += text(14, 24, v.phi >= 360 ? axialBody(v) : `Drehung: ${fmt(v.phi)}°`, "lab-text lab-text-big");
  out += text(14, 44, v.phi >= 360 ? "rechts: sein Axialschnitt" : "Drehe die Figur bis 360°.", "lab-text-muted");

  // Right: the Axialschnitt in true size, the figure and its mirror image.
  out += text(282, 24, "Axialschnitt", "lab-text lab-text-big");
  out += text(282, 44, `${fmt(axialWidth(v))} cm breit, ${fmt(top)} cm hoch`, "lab-text-muted");
  out += line(sx, base + 12, sx, base - top * k - 16, "lab-dashed");
  const right = prof.map(([rho, y]) => ({ x: sx + rho * k, y: base - y * k }));
  const left = prof.map(([rho, y]) => ({ x: sx - rho * k, y: base - y * k }));
  out += polygon(left, v.phi >= 180 ? "lab-fill-b" : "lab-ghost");
  out += polygon(right, "lab-fill-b");
  out += text(sx + 48, base + 38, "Figur", "lab-text-small", "middle");
  out += text(sx - 48, base + 38, v.phi >= 180 ? "Spiegelbild" : "Spiegelbild (ab 180°)", "lab-text-small", "middle");
  const outer = v.shape === 0 ? v.d + v.r : v.r;
  if (v.shape === 2) {
    out += line(sx, base - v.r * k, sx + v.r * k, base - v.r * k, "lab-side-a");
    out += text(sx + (v.r * k) / 2, base - v.r * k - 6, `r = ${fmt(v.r)}`, "lab-text lab-text-a", "middle");
  } else {
    out += line(sx, base, sx + outer * k, base, "lab-side-a");
    out += text(sx + (outer * k) / 2, base + 25, `r = ${fmt(outer)}`, "lab-text lab-text-a", "middle");
    // h beside the figure, or beside the mirror image where the right edge is near
    const hLabel = `h = ${fmt(v.h)}`;
    const atRight = sx + outer * k + 8 + hLabel.length * 7.3 < 516;
    out += text(atRight ? sx + outer * k + 8 : sx - outer * k - 8, base - (v.h * k) / 2 + 4, hLabel, "lab-text", atRight ? "start" : "end");
  }
  if (v.shape === 0 && v.d > 0) out += text(sx, base - v.h * k - 22, `Loch: ${fmt(2 * v.d)} cm breit`, "lab-text-small", "middle");
  if (v.shape === 3) out += text(sx - 8, base - v.h * k - 8, `r₂ = ${fmt(v.r2)}`, "lab-text lab-text-a", "end");
  if (v.shape === 4) out += text(sx - v.r * k - 8, base - (v.h + v.k / 2) * k + 4, `k = ${fmt(v.k)}`, "lab-text", "end");
  out += handle("rim", sx + outer * k, v.shape === 2 ? base - v.r * k : base, "Rand: Radius r ändern");
  if (v.shape === 0 || v.shape === 1 || v.shape === 4) out += handle("top", sx, base - v.h * k, "Höhe h ändern");
  if (v.shape === 3) out += handle("corner", sx + v.r2 * k, base - v.h * k, "Ecke oben: r₂ und h ändern");
  if (v.shape === 4) out += handle("tip", sx, base - (v.h + v.k) * k, "Spitze: Höhe k ändern");
  out += `</svg>`;
  return out;
}

// ─── 3.3 Punkte im Raum ────────────────────────────────────────────────────
//
// The coordinate system of the Realschule books: x towards the viewer, drawn
// like a Tiefenkante (45° to the left below the horizontal, shortened to
// half), y to the right, z up. One unit in y and z is 1 cm in the picture.

/** A unit of x moves the picture by ½ · cos 45° to the left and the same down (q = ½, ω = 45°). */
export const XQ = 0.5 * Math.SQRT1_2;

export interface Frame {
  ox: number;
  oy: number;
  k: number;
}

export function frameProject(f: Frame, p: V3): Pt {
  return { x: f.ox + f.k * (p.y - XQ * p.x), y: f.oy - f.k * (p.z - XQ * p.x) };
}

/** From the viewer (in front, on the right, above) into the scene. */
const FRAME_VIEW = vec(-1, -XQ, -XQ);

export function frameCamera(f: Frame): Camera {
  return { project: (p) => frameProject(f, p), view: FRAME_VIEW };
}

/** How far apart (in cm, 1 unit = 1 cm) the pictures of two points of space are. */
export function pictureDistance(p: V3, q: V3): number {
  const a = frameProject({ ox: 0, oy: 0, k: 1 }, p);
  const b = frameProject({ ox: 0, oy: 0, k: 1 }, q);
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** A point of space as the books write it: (2 | 3 | 1,5). */
export function point3(x: number, y: number, z: number): string {
  return `(${fmt(x)} | ${fmt(y)} | ${fmt(z)})`;
}

/** Where a point lies: in the origin, on an axis, in a coordinate plane or nowhere special. */
export function locationOf(x: number, y: number, z: number): string {
  const zero = [x === 0, y === 0, z === 0];
  const count = zero.filter(Boolean).length;
  if (count === 3) return "im Ursprung";
  if (count === 2) return `auf der ${["x", "y", "z"][zero.indexOf(false)]}-Achse`;
  if (count === 1) return `in der ${["yz", "xz", "xy"][zero.indexOf(true)]}-Ebene`;
  return "in keiner Koordinatenebene";
}

/** Axes with arrows, unit ticks and numbers, and the grid of the xy-plane. */
function axes3(f: Frame, xMax: number, yMax: number, zMax: number, grid = true): string {
  const P = (x: number, y: number, z: number) => frameProject(f, vec(x, y, z));
  let out = "";
  if (grid) {
    for (let y = 1; y <= yMax - 1; y++) out += seg(P(0, y, 0), P(xMax - 1, y, 0), "lab-grid");
    for (let x = 1; x <= xMax - 1; x++) out += seg(P(x, 0, 0), P(x, yMax - 1, 0), "lab-grid");
  }
  const o = P(0, 0, 0);
  const axis = (to: Pt, name: string, dx: number, dy: number) => {
    const l = Math.hypot(to.x - o.x, to.y - o.y);
    const ux = (to.x - o.x) / l;
    const uy = (to.y - o.y) / l;
    const head = 9;
    const bx = to.x - ux * head;
    const by = to.y - uy * head;
    return (
      seg(o, { x: bx, y: by }, "lab-axis", 'style="stroke-width:1.5"') +
      polygon([to, { x: bx - uy * 4.5, y: by + ux * 4.5 }, { x: bx + uy * 4.5, y: by - ux * 4.5 }], "lab-axis lab-arrowhead") +
      text(to.x + dx, to.y + dy, name, "lab-text-axis")
    );
  };
  out += axis(P(xMax, 0, 0), "x", -14, 2);
  out += axis(P(0, yMax, 0), "y", -4, 16);
  out += axis(P(0, 0, zMax), "z", 7, 8);
  for (let x = 1; x < xMax; x++) {
    const t = P(x, 0, 0);
    out += line(t.x - 3, t.y, t.x + 3, t.y, "lab-axis") + text(t.x + 5, t.y + 11, String(x), "lab-text-tick");
  }
  for (let y = 1; y < yMax; y++) {
    const t = P(0, y, 0);
    out += line(t.x, t.y - 3, t.x, t.y + 3, "lab-axis") + text(t.x, t.y + 14, String(y), "lab-text-tick", "middle");
  }
  for (let z = 1; z < zMax; z++) {
    const t = P(0, 0, z);
    out += line(t.x - 3, t.y, t.x + 3, t.y, "lab-axis") + text(t.x - 6, t.y + 4, String(z), "lab-text-tick", "end");
  }
  return out + text(o.x - 8, o.y + 4, "O", "lab-text-tick", "end");
}

/** The way from O to the point along the axes: x (blue), then y (orange), then z (purple). */
function helperPath(f: Frame, x: number, y: number, z: number, width = 2.6, dashed = false): string {
  const P = (a: number, b: number, c: number) => frameProject(f, vec(a, b, c));
  const style = `style="stroke-width:${width}${dashed ? ";stroke-dasharray:5 4" : ""}"`;
  let out = "";
  if (x !== 0) out += seg(P(0, 0, 0), P(x, 0, 0), "lab-side-a", style);
  if (y !== 0) out += seg(P(x, 0, 0), P(x, y, 0), "lab-side-b", style);
  if (z !== 0) out += seg(P(x, y, 0), P(x, y, z), "lab-side-c", style);
  return out;
}

export const SPACE_FRAME: Frame = { ox: 100, oy: 226, k: 32 };

function spaceCoordinatesView(v: LabValues): string {
  const f = SPACE_FRAME;
  const P = frameProject(f, vec(v.x, v.y, v.z));
  const Q = frameProject(f, vec(v.u, v.v, v.w));
  let out = open("Dreidimensionales Koordinatensystem mit den Punkten P und Q und dem Weg vom Ursprung zu P entlang der Achsen");
  out += axes3(f, 6, 8, 6);
  out += helperPath(f, v.x, v.y, v.z);
  if (v.qpath === 1) out += helperPath(f, v.u, v.v, v.w, 1.8, true);
  out += circle(Q.x, Q.y, 6, "lab-point-b") + circle(P.x, P.y, 6, "lab-point-a");
  const near = Math.hypot(P.x - Q.x, P.y - Q.y) < 18;
  out += text(P.x + 9, P.y - 9, "P", "lab-text lab-text-a");
  out += text(Q.x + 9, Q.y + (near ? 17 : -9), "Q", "lab-text lab-text-b");
  out += handle("P", P.x, P.y, "Punkt P parallel zur yz-Ebene verschieben (x bleibt)");
  out += handle("Q", Q.x, Q.y, "Punkt Q parallel zur yz-Ebene verschieben (x bleibt)");

  const px = 374;
  let y = 34;
  let panel = text(px, y, `P${point3(v.x, v.y, v.z)}`, "lab-text lab-text-a");
  for (const l of wrap(locationOf(v.x, v.y, v.z), 20)) panel += text(px, (y += 17), l, "lab-text-small");
  panel += text(px, (y += 25), `Q${point3(v.u, v.v, v.w)}`, "lab-text lab-text-b");
  for (const l of wrap(locationOf(v.u, v.v, v.w), 20)) panel += text(px, (y += 17), l, "lab-text-small");
  const dist = pictureDistance(vec(v.x, v.y, v.z), vec(v.u, v.v, v.w));
  panel += text(px, (y += 25), "Bildpunkte von P und Q:", "lab-text-small");
  panel += text(px, (y += 18), dist <= 0.1 ? "fallen zusammen" : `${fmt(dist, 1)} cm auseinander`, dist <= 0.1 ? "lab-text lab-text-ok" : "lab-text-small");
  out += rect(px - 8, 12, 146, y - 2, "lab-panel", 'rx="10"') + panel;
  out += rect(px - 8, 196, 146, 128, "lab-panel", 'rx="10"');
  out += text(px, 216, "Weg zu P:", "lab-text-small");
  out += line(px, 233, px + 22, 233, "lab-side-a") + text(px + 30, 237, "x: nach vorne", "lab-text-small");
  out += line(px, 253, px + 22, 253, "lab-side-b") + text(px + 30, 257, "y: nach rechts", "lab-text-small");
  out += line(px, 273, px + 22, 273, "lab-side-c") + text(px + 30, 277, "z: nach oben", "lab-text-small");
  out += text(px, 300, "x-Achse halb so lang", "lab-text-small");
  out += text(px, 315, "gezeichnet (q = ½)", "lab-text-small");
  out += `</svg>`;
  return out;
}

/** Inverse of the picture for a point whose x stays: the y and z of the picture point p. */
function dragYZ(f: Frame, p: Pt, x: number): { y: number; z: number } {
  return { y: (p.x - f.ox) / f.k + XQ * x, z: (f.oy - p.y) / f.k + XQ * x };
}

// ─── 3.4 Körper im Koordinatensystem ───────────────────────────────────────

export const SOLID_NAMES = ["Quader", "Pyramide", "Zelt (dreiseitiges Prisma)"];
export const SOLID_FRAME: Frame = { ox: 96, oy: 238, k: 28 };

export interface NamedPoint {
  name: string;
  p: V3;
}

/** The corners of the body in lab 3.4: base ABCD from A(ax | ay | az), a along x, b along y, height c. */
export function solidVertices(v: LabValues): NamedPoint[] {
  const { a, b, c, ax, ay, az } = v;
  const base: NamedPoint[] = [
    { name: "A", p: vec(ax, ay, az) },
    { name: "B", p: vec(ax + a, ay, az) },
    { name: "C", p: vec(ax + a, ay + b, az) },
    { name: "D", p: vec(ax, ay + b, az) },
  ];
  if (v.body === 1) return [...base, { name: "S", p: vec(ax + a / 2, ay + b / 2, az + c) }];
  if (v.body === 2) return [...base, { name: "E", p: vec(ax, ay + b / 2, az + c) }, { name: "F", p: vec(ax + a, ay + b / 2, az + c) }];
  return [...base, ...["E", "F", "G", "H"].map((name, i) => ({ name, p: vec(base[i].p.x, base[i].p.y, az + c) }))];
}

function solidFaces(body: number): number[][] {
  if (body === 1) return [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]];
  if (body === 2) return [[0, 1, 2, 3], [0, 3, 4], [1, 2, 5], [0, 1, 5, 4], [3, 2, 5, 4]];
  return [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
}

/** The highest point the handle moves: G of the Quader, the apex S, the front end F of the ridge. */
export function solidTop(v: LabValues): NamedPoint {
  const pts = solidVertices(v);
  return pts[v.body === 1 ? 4 : v.body === 2 ? 5 : 6];
}

/** The midpoint M of the base, the midpoint of its diagonal [AC]. */
export function baseCentre(v: LabValues): V3 {
  return vec(v.ax + v.a / 2, v.ay + v.b / 2, v.az);
}

/** The top in words for the readout: "G(3 | 4 | 2)", "S(…)" or the ridge "E(…) bis F(…)". */
export function solidTopText(v: LabValues): string {
  const pts = solidVertices(v);
  const name = (n: NamedPoint) => `${n.name}${point3(n.p.x, n.p.y, n.p.z)}`;
  return v.body === 2 ? `First von ${name(pts[4])} bis ${name(pts[5])}` : name(solidTop(v));
}

function solidCoordinatesView(v: LabValues): string {
  const f = SOLID_FRAME;
  const pts = solidVertices(v);
  const solid: Solid = { verts: pts.map((n) => n.p), faces: solidFaces(v.body) };
  const cam = frameCamera(f);
  let out = open("Ein Körper im dreidimensionalen Koordinatensystem mit den Koordinaten seiner Ecken");
  out += axes3(f, 7, 10, 8);
  out += helperPath(f, v.ax, v.ay, v.az, 1.6, true);
  if (v.body === 1) {
    const P = pts.map((n) => frameProject(f, n.p));
    const M = frameProject(f, baseCentre(v));
    out += seg(P[0], P[2], "lab-dashed", 'style="stroke-width:1"') + seg(P[1], P[3], "lab-dashed", 'style="stroke-width:1"');
    out += seg(M, P[4], "lab-side-c", 'style="stroke-width:2;stroke-dasharray:5 4"');
    out += circle(M.x, M.y, 3.5, "lab-dot-small") + text(M.x + 6, M.y + 13, "M", "lab-text-small");
  }
  out += drawSolid(solid, cam, { fill: "lab-fill-a" });
  const screen = pts.map((n) => frameProject(f, n.p));
  const cx = screen.reduce((s, p) => s + p.x, 0) / screen.length;
  const cy = screen.reduce((s, p) => s + p.y, 0) / screen.length;
  pts.forEach((n, i) => {
    const p = screen[i];
    const dx = p.x - cx;
    const dy = p.y - cy;
    const l = Math.hypot(dx, dy) || 1;
    out += text(p.x + (dx / l) * 19, p.y + (dy / l) * 19 + 4, n.name, "lab-text lab-text-a", "middle");
  });
  const A = screen[0];
  const C = screen[2];
  const T = frameProject(f, solidTop(v).p);
  out += handle("corner", A.x, A.y, "Ecke A ziehen: den Körper nach rechts oder oben verschieben");
  out += handle("side", C.x, C.y, "Ecke C ziehen: die Breite b ändern");
  out += handle("top", T.x, T.y, "Oben ziehen: die Höhe ändern");

  const px = 394;
  let y = 34;
  let panel = text(px, y, ["Quader", "Pyramide", "Zelt"][v.body] ?? "", "lab-text lab-text-big");
  for (const n of pts) panel += text(px, (y += 18), `${n.name}${point3(n.p.x, n.p.y, n.p.z)}`, "lab-text-small");
  if (v.body !== 0) {
    const M = baseCentre(v);
    panel += text(px, (y += 18), `M${point3(M.x, M.y, M.z)}`, "lab-text-small");
  }
  panel += text(px, (y += 24), `[AB] = ${fmt(v.a)}`, "lab-text-small");
  panel += text(px, (y += 17), `[BC] = ${fmt(v.b)}`, "lab-text-small");
  panel += text(px, (y += 17), `Höhe ${fmt(v.c)}`, "lab-text-small");
  out += rect(px - 8, 12, 126, y - 2, "lab-panel", 'rx="10"') + panel;
  out += `</svg>`;
  return out;
}

// ─── 3.5 Schrägbilder von Prismen und Pyramiden ────────────────────────────

export const OBLIQUE_NAMES = ["Quader", "dreiseitiges Prisma", "Pyramide"];
const OBL = { x0: 66, y0: 300 };

/** Scale of lab 3.5 in px per cm: as large as the biggest body (7 cm edges) allows for this ω and q, so dragging an edge never rescales. */
function oblScale(v: LabValues): number {
  return Math.min(26, 248 / (7 + 7 * v.q * Math.cos(v.omega * DEG)), 262 / (7 + 7 * v.q * Math.sin(v.omega * DEG)));
}

/** q as the books write it: ¼, ½, ¾, 1. */
export function qText(q: number): string {
  return q === 0.25 ? "¼" : q === 0.5 ? "½" : q === 0.75 ? "¾" : fmt(q);
}

/** The edge on s (front) and the edge into the depth, by the chosen position. */
export function obliqueDims(v: LabValues): { front: number; depth: number; frontName: string; depthName: string } {
  return v.pos === 1 ? { front: v.b, depth: v.a, frontName: "b", depthName: "a" } : { front: v.a, depth: v.b, frontName: "a", depthName: "b" };
}

/** Schrägbild: x along s, y into the depth (at ω, shortened by q), z up. */
function obliqueCamera(q: number, omega: number, x0: number, y0: number, k: number): Camera {
  const c = Math.cos(omega * DEG);
  const s = Math.sin(omega * DEG);
  return {
    project: (p) => ({ x: x0 + k * (p.x + q * p.y * c), y: y0 - k * (p.z + q * p.y * s) }),
    view: vec(-q * c, 1, -q * s),
  };
}

/** The body of lab 3.5 in space: the Quader, the prism over a right triangle (right angle at A) or the pyramid. */
export function obliqueSolid(v: LabValues): Solid {
  const { front: F, depth: D } = obliqueDims(v);
  const h = v.h;
  if (v.body === 1) {
    return {
      verts: [vec(0, 0, 0), vec(F, 0, 0), vec(0, D, 0), vec(0, 0, h), vec(F, 0, h), vec(0, D, h)],
      faces: [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]],
    };
  }
  if (v.body === 2) {
    return {
      verts: [vec(0, 0, 0), vec(F, 0, 0), vec(F, D, 0), vec(0, D, 0), vec(F / 2, D / 2, h)],
      faces: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]],
    };
  }
  return {
    verts: [vec(0, 0, 0), vec(F, 0, 0), vec(F, D, 0), vec(0, D, 0), vec(0, 0, h), vec(F, 0, h), vec(F, D, h), vec(0, D, h)],
    faces: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]],
  };
}

/** A Tiefenkante runs straight into the depth: only y changes. */
function isDepthEdge(solid: Solid, edge: Edge): boolean {
  const p = solid.verts[edge.a];
  const q = solid.verts[edge.b];
  return Math.abs(p.x - q.x) < 1e-9 && Math.abs(p.z - q.z) < 1e-9 && Math.abs(p.y - q.y) > 1e-9;
}

const DEPTH_STYLE = (seen: boolean) => `style="stroke-width:2.4${seen ? "" : ";stroke-dasharray:5 4"}"`;

/** What appears in true size in the Schrägbild of the chosen body. */
export function obliqueTrueSize(v: LabValues): string {
  const { front } = obliqueDims(v);
  if (v.body === 2) return "die Kanten auf s und die Höhe [MS]";
  if (v.body === 1) return `die Vorderfläche ${fmt(front)} cm × ${fmt(v.h)} cm`;
  return `Vorder- und Rückfläche, ${fmt(front)} cm × ${fmt(v.h)} cm`;
}

function obliqueView(v: LabValues): string {
  const { x0, y0 } = OBL;
  const k = oblScale(v);
  const { front, depth, frontName, depthName } = obliqueDims(v);
  const cam = obliqueCamera(v.q, v.omega, x0, y0, k);
  const solid = obliqueSolid(v);
  const P = solid.verts.map(cam.project);
  let out = open("Schrägbild eines Prismas oder einer Pyramide mit Schrägbildachse, Verzerrungswinkel und Verzerrungsmaßstab");
  out += line(14, y0, Math.min(318, x0 + front * k + 60), y0, "lab-axis");
  out += text(Math.min(318, x0 + front * k + 60) - 2, y0 + 15, "s", "lab-text-axis", "end");
  if (v.body === 2) {
    const M = cam.project(vec(front / 2, depth / 2, 0));
    out += seg(P[0], P[2], "lab-dashed", 'style="stroke-width:1"') + seg(P[1], P[3], "lab-dashed", 'style="stroke-width:1"');
    out += seg(M, P[4], "lab-side-c", 'style="stroke-width:2;stroke-dasharray:5 4"');
    out += circle(M.x, M.y, 3.5, "lab-dot-small") + text(M.x - 4, M.y + 14, "M", "lab-text-small", "end");
    out += text(x0 - 8, (M.y + P[4].y) / 2 + 4, `h = ${fmt(v.h)} cm`, "lab-text lab-text-c", "end");
  }
  out += drawSolid(solid, cam, {
    fill: "lab-fill-a",
    edgeClass: (edge, seen) => (isDepthEdge(solid, edge) ? "lab-side-b" : seen ? "lab-ink" : "lab-dashed"),
    edgeStyle: (edge, seen) => (isDepthEdge(solid, edge) ? DEPTH_STYLE(seen) : ""),
  });
  // ω at A, between s and the Tiefenkante that starts there
  const A = P[0];
  out += path(`M${r1(A.x + 26)} ${r1(A.y)} A26 26 0 0 0 ${r1(A.x + 26 * Math.cos(v.omega * DEG))} ${r1(A.y - 26 * Math.sin(v.omega * DEG))}`, "lab-angle");
  // ω inside the angle, away from the foot M of a pyramid
  const M0 = cam.project(vec(front / 2, depth / 2, 0));
  const spots = [polar(A.x, A.y, 38, v.omega / 2), polar(A.x, A.y, 36, v.omega * 0.25), polar(A.x, A.y, 38, v.omega * 0.75)];
  const lab = v.body === 2 ? spots.reduce((best, p) => (Math.hypot(p.x - M0.x, p.y - M0.y) > Math.hypot(best.x - M0.x, best.y - M0.y) ? p : best)) : spots[0];
  out += text(lab.x, lab.y + 4, "ω", "lab-text", "middle");
  out += text(x0 + (front * k) / 2, y0 + 20, `${frontName} = ${fmt(front)} cm`, "lab-text", "middle");
  // the drawn length beside a Tiefenkante: on the upper left outline (EH, DF), for the pyramid right of C
  const depthLabel = `${fmt(v.q * depth)} cm`;
  if (v.body === 2) {
    const roomRight = P[2].x + 14 + depthLabel.length * 8 <= 330;
    out += text(roomRight ? P[2].x + 14 : P[2].x - 12, roomRight ? P[2].y - 8 : P[2].y - 16, depthLabel, "lab-text lab-text-b", roomRight ? "start" : "end");
  } else {
    const [d0, d1] = v.body === 0 ? [P[4], P[7]] : [P[3], P[5]];
    out += text((d0.x + d1.x) / 2 - 10, (d0.y + d1.y) / 2 - 4, depthLabel, "lab-text lab-text-b", "end");
  }
  if (v.body !== 2) out += text(x0 - 8, y0 - (v.h * k) / 2 + 4, `h = ${fmt(v.h)} cm`, "lab-text", "end");
  const top = v.body === 2 ? P[4] : cam.project(vec(front, 0, v.h));
  const back = P[2];
  out += handle("front", P[1].x, P[1].y, "Ecke B ziehen: die Kante auf s ändern");
  out += handle("depth", back.x, back.y, "Hintere Ecke ziehen: die Tiefe ändern");
  out += handle("top", top.x, top.y, "Oben ziehen: die Höhe ändern");

  const px = 344;
  let y = 34;
  let panel = text(px, y, OBLIQUE_NAMES[v.body] ?? "", "lab-text lab-text-big");
  panel += text(px, (y += 22), `ω = ${fmt(v.omega)}°, q = ${qText(v.q)}`, "lab-text");
  panel += text(px, (y += 24), `auf s: ${frontName} = ${fmt(front)} cm`, "lab-text-small");
  panel += text(px, (y += 15), "in wahrer Größe", "lab-text-small");
  panel += text(px, (y += 22), `Tiefe ${depthName}: ${qText(v.q)} · ${fmt(depth)} cm`, "lab-text-small lab-text-b");
  panel += text(px, (y += 15), `gezeichnet ${fmt(v.q * depth)} cm`, "lab-text-small lab-text-b");
  panel += text(px, (y += 22), `Höhe: ${fmt(v.h)} cm,`, "lab-text-small");
  panel += text(px, (y += 15), "in wahrer Größe", "lab-text-small");
  y += 8;
  for (const l of wrap(`Unverzerrt: ${obliqueTrueSize(v)}`, 26)) panel += text(px, (y += 15), l, "lab-text-small");
  y += 8;
  for (const l of wrap(`Der rechte Winkel bei A erscheint als ${fmt(v.omega)}°.`, 26)) panel += text(px, (y += 15), l, "lab-text-small");
  out += rect(px - 8, 12, 176, y + 2, "lab-panel", 'rx="10"') + panel;
  out += `</svg>`;
  return out;
}

/** Inverse of the handles of lab 3.5. */
function obliqueDrag(handleId: "front" | "depth" | "top", p: Pt, v: LabValues): Partial<LabValues> {
  const { x0, y0 } = OBL;
  const k = oblScale(v);
  const { front, depth } = obliqueDims(v);
  const frontKey = v.pos === 1 ? "b" : "a";
  const depthKey = v.pos === 1 ? "a" : "b";
  if (handleId === "front") return { [frontKey]: (p.x - x0) / k };
  const c = Math.cos(v.omega * DEG);
  const s = Math.sin(v.omega * DEG);
  if (handleId === "depth") {
    const start = v.body === 1 ? { x: x0, y: y0 } : { x: x0 + front * k, y: y0 };
    return { [depthKey]: ((p.x - start.x) * c - (p.y - start.y) * s) / (v.q * k) };
  }
  const lift = v.body === 2 ? v.q * (depth / 2) * s : 0;
  return { h: (y0 - p.y) / k - lift };
}

// ─── 3.6 Strecken und Winkel in wahrer Größe ───────────────────────────────

export const TRUE_BODIES = ["Quader", "Pyramide"];
export const TRUE_FIGURES = [
  ["Grundfläche ABCD", "Diagonalschnitt ACGE", "Seitenfläche BCGF"],
  ["Seitenfläche ABS", "Dreieck AMS", "Dreieck NMS"],
];
const TS = { x0: 34, y0: 292, q: 0.5 };

/** Scale of the Schrägbild in lab 3.6, fixed for each ω (the handles change only the edges). */
function tsScale(v: LabValues): number {
  return Math.min(22, 212 / (7 + 3.5 * Math.cos(v.omega * DEG)), 226 / (7 + 3.5 * Math.sin(v.omega * DEG)));
}

/** One plane figure inside the body: its corners in space, the same figure flat in true size, the wanted segment and angle. */
export interface TrueFigure {
  name: string;
  shape: string;
  /** Names and corners in space (for the Schrägbild). */
  names: string[];
  corners: V3[];
  /** The figure in true size, in cm (x right, y up). */
  flat: Array<[number, number]>;
  /** Corners with a right angle in true size. */
  right: number[];
  known: string;
  wanted: [number, number];
  wantedName: string;
  length: number;
  /** The angle at corner `at` between the rays to `from` and `to`. */
  angle: { at: number; from: number; to: number; name: string; value: number };
}

export function trueFigure(v: LabValues): TrueFigure {
  const { a, b, h } = v;
  const fig = clamp(Math.round(v.body === 1 ? v.figP : v.figQ), 0, 2);
  const atan = (y: number, x: number) => Math.atan2(y, x) / DEG;
  if (v.body === 1) {
    const s = Math.sqrt(h * h + (a * a) / 4 + (b * b) / 4);
    const ha = Math.sqrt(h * h + (b * b) / 4);
    const m = Math.hypot(a, b) / 2;
    const A = vec(0, 0, 0);
    const B = vec(a, 0, 0);
    const S = vec(a / 2, b / 2, h);
    const M = vec(a / 2, b / 2, 0);
    const N = vec(a / 2, 0, 0);
    if (fig === 0) {
      return { name: TRUE_FIGURES[1][0], shape: "ein gleichschenkliges Dreieck", names: ["A", "B", "S"], corners: [A, B, S], flat: [[0, 0], [a, 0], [a / 2, ha]], right: [], known: `[AB] = ${fmt(a)} cm, [AS] = [BS]`, wanted: [0, 2], wantedName: "[AS]", length: s, angle: { at: 0, from: 1, to: 2, name: "∢BAS", value: atan(ha, a / 2) } };
    }
    if (fig === 1) {
      return { name: TRUE_FIGURES[1][1], shape: "ein rechtwinkliges Dreieck", names: ["A", "M", "S"], corners: [A, M, S], flat: [[0, 0], [m, 0], [m, h]], right: [1], known: `[AM] ≈ ${fmt(m, 1)} cm (halbe Diagonale), [MS] = ${fmt(h)} cm`, wanted: [0, 2], wantedName: "[AS]", length: s, angle: { at: 0, from: 1, to: 2, name: "∢MAS", value: atan(h, m) } };
    }
    return { name: TRUE_FIGURES[1][2], shape: "ein rechtwinkliges Dreieck", names: ["N", "M", "S"], corners: [N, M, S], flat: [[0, 0], [b / 2, 0], [b / 2, h]], right: [1], known: `[NM] = ${fmt(b / 2)} cm, [MS] = ${fmt(h)} cm`, wanted: [0, 2], wantedName: "[NS]", length: ha, angle: { at: 0, from: 1, to: 2, name: "∢MNS", value: atan(h, b / 2) } };
  }
  const d = Math.hypot(a, b);
  const P = (x: number, y: number, z: number) => vec(x, y, z);
  if (fig === 0) {
    return { name: TRUE_FIGURES[0][0], shape: "ein Rechteck", names: ["A", "B", "C", "D"], corners: [P(0, 0, 0), P(a, 0, 0), P(a, b, 0), P(0, b, 0)], flat: [[0, 0], [a, 0], [a, b], [0, b]], right: [0, 1, 2, 3], known: `[AB] = ${fmt(a)} cm, [BC] = ${fmt(b)} cm`, wanted: [0, 2], wantedName: "[AC]", length: d, angle: { at: 0, from: 1, to: 2, name: "∢BAC", value: atan(b, a) } };
  }
  if (fig === 1) {
    return { name: TRUE_FIGURES[0][1], shape: "ein Rechteck", names: ["A", "C", "G", "E"], corners: [P(0, 0, 0), P(a, b, 0), P(a, b, h), P(0, 0, h)], flat: [[0, 0], [d, 0], [d, h], [0, h]], right: [0, 1, 2, 3], known: `[AC] ≈ ${fmt(d, 1)} cm (aus ABCD), [CG] = ${fmt(h)} cm`, wanted: [0, 2], wantedName: "[AG]", length: Math.hypot(d, h), angle: { at: 0, from: 1, to: 2, name: "∢CAG", value: atan(h, d) } };
  }
  return { name: TRUE_FIGURES[0][2], shape: "ein Rechteck", names: ["B", "C", "G", "F"], corners: [P(a, 0, 0), P(a, b, 0), P(a, b, h), P(a, 0, h)], flat: [[0, 0], [b, 0], [b, h], [0, h]], right: [0, 1, 2, 3], known: `[BC] = ${fmt(b)} cm, [CG] = ${fmt(h)} cm`, wanted: [0, 2], wantedName: "[BG]", length: Math.hypot(b, h), angle: { at: 0, from: 1, to: 2, name: "∢CBG", value: atan(h, b) } };
}

function trueCamera(v: LabValues): Camera {
  return obliqueCamera(TS.q, v.omega, TS.x0, TS.y0, tsScale(v));
}

/** The same angle as it looks in the Schrägbild. */
export function drawnAngle(v: LabValues): number {
  const t = trueFigure(v);
  const cam = trueCamera(v);
  const at = cam.project(t.corners[t.angle.at]);
  const p = cam.project(t.corners[t.angle.from]);
  const q = cam.project(t.corners[t.angle.to]);
  const a1 = Math.atan2(at.y - p.y, p.x - at.x);
  const a2 = Math.atan2(at.y - q.y, q.x - at.x);
  let d = Math.abs(a1 - a2) / DEG;
  if (d > 180) d = 360 - d;
  return d;
}

function trueSolid(v: LabValues): Solid {
  const { a, b, h } = v;
  if (v.body === 1) return { verts: [vec(0, 0, 0), vec(a, 0, 0), vec(a, b, 0), vec(0, b, 0), vec(a / 2, b / 2, h)], faces: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]] };
  return {
    verts: [vec(0, 0, 0), vec(a, 0, 0), vec(a, b, 0), vec(0, b, 0), vec(0, 0, h), vec(a, 0, h), vec(a, b, h), vec(0, b, h)],
    faces: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]],
  };
}

const SOLID_LETTERS = [
  ["A", "B", "C", "D", "E", "F", "G", "H"],
  ["A", "B", "C", "D", "S"],
];

function trueSizeView(v: LabValues): string {
  const t = trueFigure(v);
  const cam = trueCamera(v);
  const solid = trueSolid(v);
  const P = solid.verts.map(cam.project);
  let out = open("Links ein Körper im Schrägbild mit einer ebenen Figur, rechts dieselbe Figur in wahrer Größe");
  out += text(14, 24, "Schrägbild", "lab-text lab-text-big");
  out += text(14, 44, `ω = ${fmt(v.omega)}°, q = ½`, "lab-text-muted");
  if (v.body === 1) {
    const M = cam.project(vec(v.a / 2, v.b / 2, 0));
    const N = cam.project(vec(v.a / 2, 0, 0));
    out += seg(P[0], P[2], "lab-dashed", 'style="stroke-width:1"') + seg(P[1], P[3], "lab-dashed", 'style="stroke-width:1"');
    out += seg(M, P[4], "lab-dashed");
    out += circle(M.x, M.y, 3, "lab-dot-small") + text(M.x + 5, M.y + 13, "M", "lab-text-small");
    out += circle(N.x, N.y, 3, "lab-dot-small") + text(N.x, N.y + 15, "N", "lab-text-small", "middle");
  }
  out += drawSolid(solid, cam, { fill: "lab-fill-a" });
  out += polygon(t.corners.map(cam.project), "lab-thin", ACCENT_FILL);
  const w0 = cam.project(t.corners[t.wanted[0]]);
  const w1 = cam.project(t.corners[t.wanted[1]]);
  out += seg(w0, w1, "lab-thin", ACCENT_LINE);
  const cx = P.reduce((s, p) => s + p.x, 0) / P.length;
  const cy = P.reduce((s, p) => s + p.y, 0) / P.length;
  P.forEach((p, i) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const l = Math.hypot(dx, dy) || 1;
    out += text(p.x + (dx / l) * 13, p.y + (dy / l) * 13 + 4, SOLID_LETTERS[v.body][i], "lab-text-small", "middle");
  });
  out += handle("front", P[1].x, P[1].y, "Ecke B ziehen: die Kante [AB] ändern");
  out += handle("depth", P[2].x, P[2].y, "Ecke C ziehen: die Tiefe [BC] ändern");
  const top = v.body === 1 ? P[4] : P[5];
  out += handle("top", top.x, top.y, "Oben ziehen: die Höhe ändern");

  // right: the figure in true size
  out += text(258, 24, "wahre Größe", "lab-text lab-text-big");
  out += text(258, 44, t.name, "lab-text-muted");
  const xs = t.flat.map(([x]) => x);
  const ys = t.flat.map(([, y]) => y);
  const W = Math.max(...xs) - Math.min(...xs);
  const Hh = Math.max(...ys) - Math.min(...ys);
  const kk = Math.min(26, 220 / W, 196 / Hh);
  const left = 266 + (232 - W * kk) / 2 - Math.min(...xs) * kk;
  const base = 286;
  const F = t.flat.map(([x, y]) => ({ x: left + x * kk, y: base - y * kk }));
  out += polygon(F, "lab-thin", ACCENT_FILL);
  const fcx = F.reduce((s, p) => s + p.x, 0) / F.length;
  const fcy = F.reduce((s, p) => s + p.y, 0) / F.length;
  for (const i of t.right) {
    const n = F.length;
    out += angleMarkRight(F[i], F[(i + n - 1) % n], F[(i + 1) % n]);
  }
  out += seg(F[t.wanted[0]], F[t.wanted[1]], "lab-thin", ACCENT_LINE);
  // the angle
  const at = F[t.angle.at];
  const a0 = Math.atan2(at.y - F[t.angle.from].y, F[t.angle.from].x - at.x) / DEG;
  const a1 = Math.atan2(at.y - F[t.angle.to].y, F[t.angle.to].x - at.x) / DEG;
  out += path(`M${r1(polar(at.x, at.y, 24, a0).x)} ${r1(polar(at.x, at.y, 24, a0).y)} A24 24 0 0 0 ${r1(polar(at.x, at.y, 24, a1).x)} ${r1(polar(at.x, at.y, 24, a1).y)}`, "lab-angle-ok");
  const al = polar(at.x, at.y, 44, (a0 + a1) / 2);
  out += text(al.x, al.y + 4, `${fmt(t.angle.value, 1)}°`, "lab-text-small lab-text-ok", "middle");
  F.forEach((p, i) => {
    const dx = p.x - fcx;
    const dy = p.y - fcy;
    const l = Math.hypot(dx, dy) || 1;
    out += text(p.x + (dx / l) * 13, p.y + (dy / l) * 13 + 4, t.names[i], "lab-text", "middle");
  });
  const wm = { x: (F[t.wanted[0]].x + F[t.wanted[1]].x) / 2, y: (F[t.wanted[0]].y + F[t.wanted[1]].y) / 2 };
  out += accentText(wm.x - 6, wm.y - 8, `≈ ${fmt(t.length, 1)} cm`, "end");
  out += text(258, 318, `gemessen: ${t.wantedName} ≈ ${fmt(t.length, 1)} cm`, "lab-text-small");
  out += text(258, 333, `im Schrägbild: ${t.angle.name} ≈ ${fmt(drawnAngle(v), 1)}°`, "lab-text-small");
  out += `</svg>`;
  return out;
}

/** A right-angle mark at vertex v between the rays to p and q. */
function angleMarkRight(vtx: Pt, p: Pt, q: Pt): string {
  const u = { x: p.x - vtx.x, y: p.y - vtx.y };
  const w = { x: q.x - vtx.x, y: q.y - vtx.y };
  const lu = Math.hypot(u.x, u.y) || 1;
  const lw = Math.hypot(w.x, w.y) || 1;
  const s = 11;
  const p1 = { x: vtx.x + (u.x / lu) * s, y: vtx.y + (u.y / lu) * s };
  const p3 = { x: vtx.x + (w.x / lw) * s, y: vtx.y + (w.y / lw) * s };
  const p2 = { x: p1.x + (w.x / lw) * s, y: p1.y + (w.y / lw) * s };
  return path(pathOf([p1, p2, p3]), "lab-angle") + circle(vtx.x + ((u.x / lu + w.x / lw) * s) / 2, vtx.y + ((u.y / lu + w.y / lw) * s) / 2, 1.5, "lab-dot-small");
}

/** Inverse of the handles of lab 3.6. */
function trueDrag(handleId: "front" | "depth" | "top", p: Pt, v: LabValues): Partial<LabValues> {
  const { x0, y0, q } = TS;
  const k = tsScale(v);
  const c = Math.cos(v.omega * DEG);
  const s = Math.sin(v.omega * DEG);
  if (handleId === "front") return { a: (p.x - x0) / k };
  if (handleId === "depth") return { b: ((p.x - (x0 + v.a * k)) * c - (p.y - y0) * s) / (q * k) };
  return { h: (y0 - p.y) / k - (v.body === 1 ? q * (v.b / 2) * s : 0) };
}

// ─── Lab views of this stage ────────────────────────────────────────────────

export const RAUMGEOMETRIE_VIEWS: Record<"solid-symmetry" | "axial-section" | "space-coordinates" | "solid-coordinates" | "oblique-drawing" | "true-size", LabView> = {
  "solid-symmetry": {
    render: symmetryView,
    handles: {
      alpha: {
        x: "alpha",
        drag: (p) => {
          const { cx, cy } = SYM.dial;
          const a = (((90 - Math.atan2(cy - p.y, p.x - cx) / DEG) % 360) + 360) % 360;
          return { alpha: a > 352.5 ? 0 : a };
        },
      },
    },
  },
  "axial-section": {
    render: axialSectionView,
    handles: {
      rim: { x: "r", drag: (p, v) => ({ r: (p.x - AXIAL.sx) / AXIAL.k - (v.shape === 0 ? v.d : 0) }) },
      top: { y: "h", drag: (p) => ({ h: (AXIAL.base - p.y) / AXIAL.k }) },
      corner: { x: "r2", y: "h", drag: (p) => ({ r2: (p.x - AXIAL.sx) / AXIAL.k, h: (AXIAL.base - p.y) / AXIAL.k }) },
      tip: { y: "k", drag: (p, v) => ({ k: (AXIAL.base - p.y) / AXIAL.k - v.h }) },
    },
  },
  "space-coordinates": {
    render: spaceCoordinatesView,
    handles: {
      P: { x: "y", y: "z", drag: (p, v) => dragYZ(SPACE_FRAME, p, v.x) },
      Q: {
        x: "v",
        y: "w",
        drag: (p, v) => {
          const { y, z } = dragYZ(SPACE_FRAME, p, v.u);
          return { v: y, w: z };
        },
      },
    },
  },
  "solid-coordinates": {
    render: solidCoordinatesView,
    handles: {
      corner: {
        x: "ay",
        y: "az",
        drag: (p, v) => {
          const { y, z } = dragYZ(SOLID_FRAME, p, v.ax);
          return { ay: y, az: z };
        },
      },
      side: { x: "b", drag: (p, v) => ({ b: (p.x - SOLID_FRAME.ox) / SOLID_FRAME.k + XQ * (v.ax + v.a) - v.ay }) },
      top: { y: "c", drag: (p, v) => ({ c: (SOLID_FRAME.oy - p.y) / SOLID_FRAME.k + XQ * solidTop(v).p.x - v.az }) },
    },
  },
  "oblique-drawing": {
    render: obliqueView,
    handles: {
      front: { x: "a", drag: (p, v) => obliqueDrag("front", p, v) },
      depth: { y: "b", drag: (p, v) => obliqueDrag("depth", p, v) },
      top: { y: "h", drag: (p, v) => obliqueDrag("top", p, v) },
    },
  },
  "true-size": {
    render: trueSizeView,
    handles: {
      front: { x: "a", drag: (p, v) => trueDrag("front", p, v) },
      depth: { y: "b", drag: (p, v) => trueDrag("depth", p, v) },
      top: { y: "h", drag: (p, v) => trueDrag("top", p, v) },
    },
  },
};
