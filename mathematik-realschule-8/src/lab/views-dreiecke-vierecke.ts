import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { angleMark, arcPath, clipped, H, handle, type LabView, line, open, polar, polygon, type Pt, r1, sectorPath, sideLabel, text, W } from "./svg";

// ─── Shared helpers of this stage ──────────────────────────────────────────
// Lengths in the labs are in cm, points in cm have y upwards; a Frame maps
// them onto the SVG. Triangles are labelled counterclockwise: A left, B
// right, C on top, side a = [BC], b = [CA], c = [AB].

const RAD = Math.PI / 180;
const sinD = (d: number): number => Math.sin(d * RAD);
const cosD = (d: number): number => Math.cos(d * RAD);
const toDeg = (r: number): number => r / RAD;
const EPS = 1e-9;

/** An angle in degrees as the readouts write it: "47°". */
export const deg = (value: number, digits = 0): string => `${fmt(value, digits)}°`;
/** A length in cm with up to one decimal: "4,5 cm". */
export const cmText = (value: number, digits = 1): string => `${fmt(value, digits)} cm`;

interface Frame {
  ax: number;
  base: number;
  k: number;
}

/** A point in cm (y up) on the SVG. */
const scr = (f: Frame, p: Pt): Pt => ({ x: f.ax + p.x * f.k, y: f.base - p.y * f.k });

function unitOf(from: Pt, to: Pt): Pt {
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
}

const dist = (p: Pt, q: Pt): number => Math.hypot(p.x - q.x, p.y - q.y);

/** A label with a halo in the colour of the lab background, readable over dashed circles and lines. */
function halo(svg: string): string {
  return svg.replace("<text ", '<text style="paint-order:stroke;stroke:var(--elevated);stroke-width:4px;stroke-linejoin:round" ');
}

/** The letter (or value) of the angle at `vertex`: on the bisector, `d` px inside the angle. */
function angleLabel(vertex: Pt, p1: Pt, p2: Pt, d: number, content: string, cls = "lab-text"): string {
  const u = unitOf(vertex, p1);
  const w = unitOf(vertex, p2);
  const bis = unitOf({ x: 0, y: 0 }, { x: u.x + w.x, y: u.y + w.y });
  return halo(text(vertex.x + bis.x * d, vertex.y + bis.y * d + 4, content, cls, "middle"));
}

/** A side label pushed far enough off a slanted side that its text does not cross the line. */
function edgeLabel(p: Pt, q: Pt, content: string, cls: string): string {
  const u = unitOf(p, q);
  const width = content.length * 7;
  return halo(sideLabel(p, q, content, 9 + (width / 2) * Math.abs(u.y) + 7 * Math.abs(u.x), cls));
}

/** The name of a vertex, pushed away from the centre of its figure. */
function vertexLabel(P: Pt, center: Pt, name: string, cls = "lab-text", d = 15): string {
  const u = unitOf(center, P);
  return halo(text(P.x + u.x * d, P.y + u.y * d + 4, name, cls, "middle"));
}

const centroid = (...pts: Pt[]): Pt => ({ x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length });

/** Start and end direction (degrees, counterclockwise on screen) of the angle at `vertex` from `from` to `to`. */
function angleSpan(vertex: Pt, from: Pt, to: Pt): [number, number] {
  const a0 = toDeg(Math.atan2(vertex.y - from.y, from.x - vertex.x));
  const a1 = toDeg(Math.atan2(vertex.y - to.y, to.x - vertex.x));
  let sweep = a1 - a0;
  while (sweep > 180) sweep -= 360;
  while (sweep < -180) sweep += 360;
  return [a0, a0 + sweep];
}

/** A filled sector that marks the angle at `vertex`. */
function angleFill(vertex: Pt, from: Pt, to: Pt, r: number, cls: string): string {
  const [a0, a1] = angleSpan(vertex, from, to);
  return `<path d="${sectorPath(vertex.x, vertex.y, r, a0, a1)}" class="${cls}" />`;
}

/** The arc of an angle, without fill. */
function angleArc(vertex: Pt, from: Pt, to: Pt, r: number, cls = "lab-angle"): string {
  const [a0, a1] = angleSpan(vertex, from, to);
  return `<path d="${arcPath(vertex.x, vertex.y, r, a0, a1)}" class="${cls}" />`;
}

type Tone = "a" | "b" | "c";

/** A compass circle as in the exercise book: thin, dashed, in the colour of the side it carries. */
function ring(center: Pt, r: number, tone: Tone, current = false): string {
  return `<circle cx="${r1(center.x)}" cy="${r1(center.y)}" r="${r1(Math.max(0, r))}" class="lab-side-${tone}" style="stroke-width:${current ? 2.6 : 1.5};stroke-dasharray:6 5" />`;
}

/** A free leg (Schenkel) from `from` in the direction `angle` (degrees, counterclockwise on screen); clip it. */
function ray(from: Pt, angle: number, current = false): string {
  const to = polar(from.x, from.y, 900, angle);
  return `<line x1="${r1(from.x)}" y1="${r1(from.y)}" x2="${r1(to.x)}" y2="${r1(to.y)}" class="lab-ink" style="stroke-width:${current ? 2.6 : 1.4}" />`;
}

/** A thin line in the colour of a side, for the parts of a triangle that are not given. */
function thinSide(p: Pt, q: Pt, tone: Tone): string {
  return `<line x1="${r1(p.x)}" y1="${r1(p.y)}" x2="${r1(q.x)}" y2="${r1(q.y)}" class="lab-side-${tone}" style="stroke-width:1.6" />`;
}

function dot(p: Pt, cls = "lab-point", r = 4.5): string {
  return `<circle cx="${r1(p.x)}" cy="${r1(p.y)}" r="${r}" class="${cls}" />`;
}

function clipRect(id: string, top: number): string {
  return `<defs><clipPath id="${id}"><rect x="0" y="${top}" width="${W}" height="${H - top}" /></clipPath></defs>`;
}

const inView = (p: Pt, top: number): boolean => p.x >= 16 && p.x <= W - 16 && p.y >= top + 10 && p.y <= H - 10;

/** Where the handle of a compass circle sits: the first of the directions that is inside the drawing. */
function ringHandlePos(center: Pt, r: number, angles: number[], top: number): Pt {
  for (const angle of angles) {
    const p = polar(center.x, center.y, r, angle);
    if (inView(p, top)) return p;
  }
  return polar(center.x, center.y, r, angles[0]);
}

/** Left and below A first, right and below B first: never on [AB] or near C. */
const RING_A = [200, 215, 230, 245, 160, 145, 130, 115];
const RING_B = [-20, -35, -50, -65, 20, 35, 50, 65];

/** Where the handle on a free leg sits: in the drawing and away from the points to avoid (C). */
function rayHandlePos(vertex: Pt, angle: number, avoid: Pt[], top: number): Pt {
  for (const d of [64, 100, 140, 44, 180]) {
    const p = polar(vertex.x, vertex.y, d, angle);
    if (inView(p, top) && avoid.every((q) => dist(p, q) >= 30)) return p;
  }
  return polar(vertex.x, vertex.y, 64, angle);
}

/** The degrees of the direction from `center` to `p`, counterclockwise on screen, in ]−180; 180]. */
const direction = (center: Pt, p: Pt): number => toDeg(Math.atan2(center.y - p.y, p.x - center.x));

/** An angle dragged at the point `p` around `vertex`; below the base line it stays at the near end. */
function dragAngle(vertex: Pt, p: Pt, min: number, max: number, mirrored = false): number {
  const raw = direction(vertex, p);
  if (raw < 0) {
    const right = p.x >= vertex.x;
    return mirrored ? (right ? max : min) : right ? min : max;
  }
  return mirrored ? 180 - raw : raw;
}

// ─── Triangle geometry (cm, y up; A = (0 | 0), B = (c | 0)) ─────────────────

export type Meet = "two" | "touch" | "none";

export interface SideCheck {
  /** The longest side; on a tie c before a before b. */
  longest: Tone;
  L: number;
  /** The sum of the two other sides. */
  S: number;
  /** How the circle around A (radius b) and the circle around B (radius a) meet. */
  meet: Meet;
}

/** The Dreiecksungleichung for three sides: the longest against the sum of the other two. */
export function sideCheck(a: number, b: number, c: number): SideCheck {
  const longest: Tone = c >= a && c >= b ? "c" : a >= b ? "a" : "b";
  const L = { a, b, c }[longest];
  const S = a + b + c - L;
  const meet: Meet = S - L > EPS ? "two" : Math.abs(S - L) <= EPS ? "touch" : "none";
  return { longest, L, S, meet };
}

/** C above [AB] for the sides a, b, c, or the touching point on the line AB; null when the circles miss. */
export function sssApex(a: number, b: number, c: number): Pt | null {
  if (sideCheck(a, b, c).meet === "none") return null;
  const x = (b * b + c * c - a * a) / (2 * c);
  return { x, y: Math.sqrt(Math.max(0, b * b - x * x)) };
}

/** C as the meeting point of the free legs of α at A and β at B; null when α + β ≥ 180°. */
export function wswApex(c: number, alpha: number, beta: number): Pt | null {
  if (alpha + beta >= 180 - EPS) return null;
  const t = (c * sinD(beta)) / sinD(alpha + beta);
  return { x: t * cosD(alpha), y: t * sinD(alpha) };
}

/**
 * Two sides and an opposite angle: the lengths AC on the free leg of α at A
 * for which BC = a (AB = c). None, one or two, ascending.
 */
export function ssaLengths(c: number, a: number, alpha: number): number[] {
  const disc = a * a - (c * sinD(alpha)) ** 2;
  if (disc < -EPS) return [];
  const root = disc <= EPS ? 0 : Math.sqrt(disc);
  const mid = c * cosD(alpha);
  const ts = root === 0 ? [mid] : [mid - root, mid + root];
  return ts.filter((t) => t > 1e-6).sort((p, q) => p - q);
}

/** The point at distance t on the free leg of α at A. */
const onLeg = (t: number, alpha: number): Pt => ({ x: t * cosD(alpha), y: t * sinD(alpha) });

/** The distance of B from the line of the free leg of α at A, as with the Geodreieck (Lot). */
export const legDistance = (c: number, alpha: number): number => Math.abs(c * sinD(alpha));

export interface Measured {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
}

/** Sides and angles of the triangle ABC, measured as with ruler and protractor. */
export function measure(A: Pt, B: Pt, C: Pt): Measured {
  const a = dist(B, C);
  const b = dist(C, A);
  const c = dist(A, B);
  const angle = (opp: number, s1: number, s2: number) => toDeg(Math.acos(Math.max(-1, Math.min(1, (s1 * s1 + s2 * s2 - opp * opp) / (2 * s1 * s2)))));
  const alpha = angle(a, b, c);
  const beta = angle(b, a, c);
  return { a, b, c, alpha, beta, gamma: 180 - alpha - beta };
}

const ORIGIN: Pt = { x: 0, y: 0 };
const GREEK: Record<Tone, string> = { a: "α", b: "β", c: "γ" };

/** "Größter Winkel γ gegenüber der längsten Seite c", and the equal pairs of an isosceles triangle. */
export function oppositeText(m: Measured): string {
  const len: Record<Tone, number> = { a: m.a, b: m.b, c: m.c };
  const near = (x: number, y: number) => Math.abs(x - y) < 1e-6;
  if (near(m.a, m.b) && near(m.b, m.c)) return "Gleichseitig: Alle Winkel sind 60° groß.";
  const pair = ([["a", "b"], ["b", "c"], ["a", "c"]] as Array<[Tone, Tone]>).find(([p, q]) => near(len[p], len[q]));
  const order = (["a", "b", "c"] as Tone[]).sort((p, q) => len[q] - len[p]);
  const largest = near(len[order[0]], len[order[1]]) ? null : order[0];
  const parts: string[] = [];
  if (pair) parts.push(`gleich lang: ${pair[0]} = ${pair[1]}, also ${GREEK[pair[0]]} = ${GREEK[pair[1]]}`);
  parts.push(largest ? `größter Winkel ${GREEK[largest]} gegenüber der längsten Seite ${largest}` : `${GREEK[order[0]]} und ${GREEK[order[1]]} sind die größten Winkel`);
  const sentence = parts.join("; ");
  return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
}

/** The side c under [AB]: one row lower when [AB] is short, so that it stays clear of A and B. */
function baseLabel(A: Pt, B: Pt, c: number, low = false): string {
  const y = A.y + (low || B.x - A.x < 90 ? 36 : 19);
  return halo(text((A.x + B.x) / 2, y, `c = ${cmText(c)}`, "lab-text lab-text-c", "middle"));
}

/** The dashed Lot from B onto the line of the free leg of α, with its length. */
function legLot(f: Frame, c: number, alpha: number): string {
  const B = scr(f, { x: c, y: 0 });
  const tF = c * cosD(alpha);
  const F = scr(f, onLeg(tF, alpha));
  let out = "";
  if (tF < 0) out += line(scr(f, ORIGIN).x, scr(f, ORIGIN).y, F.x, F.y, "lab-dashed");
  out += line(B.x, B.y, F.x, F.y, "lab-dashed");
  out += angleMark(F, B, scr(f, onLeg(tF + 1, alpha)), 10, "lab-angle", true);
  const mid = { x: (B.x + F.x) / 2, y: (B.y + F.y) / 2 };
  out += halo(text(mid.x + 8, mid.y - 4, `Abstand ≈ ${cmText(legDistance(c, alpha))}`, "lab-text-small", "start"));
  return out;
}

// ─── 1.1 Wann es ein Dreieck gibt ──────────────────────────────────────────

export const EXIST: Frame = { ax: 170, base: 262, k: 20 };
const EXIST_TOP = 74;
const OTHERS: Record<Tone, string> = { a: "b + c", b: "a + c", c: "a + b" };

/** The triangle of the existence lab, or null; view 0 by its sides, view 1 by c, α and β. */
export function existenceTriangle(v: LabValues): Measured | null {
  if (v.view === 1) {
    const C = wswApex(v.c, v.alpha, v.beta);
    return C ? measure(ORIGIN, { x: v.c, y: 0 }, C) : null;
  }
  if (sideCheck(v.a, v.b, v.c).meet !== "two") return null;
  return measure(ORIGIN, { x: v.c, y: 0 }, sssApex(v.a, v.b, v.c)!);
}

function compassTest(v: LabValues): string {
  const f = EXIST;
  const A = scr(f, ORIGIN);
  const B = scr(f, { x: v.c, y: 0 });
  const check = sideCheck(v.a, v.b, v.c);
  let out = open("Zirkelprobe: Der Kreis um A hat den Radius b, der Kreis um B den Radius a. Nur wenn sie sich schneiden, gibt es ein Dreieck.");
  out += clipRect("ex-clip", EXIST_TOP);
  out += clipped("ex-clip", ring(A, v.b * f.k, "b") + ring(B, v.a * f.k, "a"));
  const rel = check.meet === "two" ? "<" : check.meet === "touch" ? "=" : ">";
  out += text(16, 26, `${check.longest} = ${cmText(check.L)} ${rel} ${OTHERS[check.longest]} = ${cmText(check.S)}`, check.meet === "two" ? "lab-text lab-text-big lab-text-ok" : "lab-text lab-text-big lab-text-bad");
  out += text(W - 14, 20, "Kreis um A: r = b", "lab-text-small lab-text-b", "end");
  out += text(W - 14, 34, "Kreis um B: r = a", "lab-text-small lab-text-a", "end");
  if (check.meet === "two") {
    const apex = sssApex(v.a, v.b, v.c)!;
    const C = scr(f, apex);
    const S = centroid(A, B, C);
    out += text(16, 48, "Die Kreise schneiden sich: Es gibt ein Dreieck ABC.", "lab-text-muted");
    out += text(16, 66, oppositeText(measure(ORIGIN, { x: v.c, y: 0 }, apex)), "lab-text-muted");
    out += polygon([A, B, C], "lab-shape");
    out += angleFill(A, B, C, 24, "lab-fill-a") + angleFill(B, C, A, 24, "lab-fill-b") + angleFill(C, A, B, 20, "lab-fill-c");
    out += line(B.x, B.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, A.x, A.y, "lab-side-b") + line(A.x, A.y, B.x, B.y, "lab-side-c");
    out += angleLabel(A, B, C, 36, "α", "lab-text lab-text-a") + angleLabel(B, C, A, 36, "β", "lab-text lab-text-b") + angleLabel(C, A, B, 32, "γ", "lab-text lab-text-c");
    out += edgeLabel(B, C, `a = ${cmText(v.a)}`, "lab-text lab-text-a") + edgeLabel(C, A, `b = ${cmText(v.b)}`, "lab-text lab-text-b");
    out += baseLabel(A, B, v.c);
    out += vertexLabel(A, S, "A") + vertexLabel(B, S, "B") + vertexLabel(C, S, "C");
    out += handle("C", C.x, C.y, "Ecke C: Seiten a und b zugleich");
  } else if (check.meet === "touch") {
    const C = scr(f, sssApex(v.a, v.b, v.c)!);
    const between = C.x >= A.x - 0.5 && C.x <= B.x + 0.5;
    out += text(16, 48, "Die Kreise berühren sich nur: C liegt auf der Geraden AB.", "lab-text-muted");
    out += text(16, 66, "A, B und C liegen auf einer Linie: kein Dreieck.", "lab-text-muted");
    out += line(Math.min(A.x, C.x), A.y, Math.max(B.x, C.x), A.y, "lab-thin");
    out += line(A.x, A.y, B.x, B.y, "lab-side-c");
    const yb = A.y - 8;
    const ya = between ? yb : A.y - 16;
    out += line(A.x, yb, C.x, yb, "lab-side-b") + line(C.x, ya, B.x, ya, "lab-side-a");
    out += halo(text((A.x + C.x) / 2, yb - 8, `b = ${cmText(v.b)}`, "lab-text-small lab-text-b", "middle"));
    out += halo(text((C.x + B.x) / 2, ya - 8 - (between ? 0 : 6), `a = ${cmText(v.a)}`, "lab-text-small lab-text-a", "middle"));
    out += dot(C, "lab-point-bad", 5);
    out += halo(text(C.x, A.y + 19, "C", "lab-text lab-text-bad", "middle"));
    out += baseLabel(A, B, v.c, true);
    out += text(A.x - 8, A.y + 19, "A", "lab-text", "end") + text(B.x + 8, B.y + 19, "B", "lab-text");
    out += handle("C", C.x, C.y, "Ecke C: Seiten a und b zugleich");
  } else {
    // where the circles cross the line AB: circle A at ±b, circle B at c ± a; the gap lies between
    const [g0, g1] = v.a + v.b < v.c ? [v.b, v.c - v.a] : v.b > v.a + v.c ? [v.c + v.a, v.b] : [v.c - v.a, -v.b];
    const P = scr(f, { x: g0, y: 0 });
    const Q = scr(f, { x: g1, y: 0 });
    out += text(16, 48, "Die Kreise treffen sich nicht: Es gibt kein Dreieck.", "lab-text-muted");
    out += text(16, 66, v.a + v.b < v.c ? "a und b zusammen sind kürzer als c." : "Ein Kreis liegt ganz im anderen.", "lab-text-muted");
    out += line(Math.min(A.x, P.x, Q.x) - 10, A.y, Math.max(B.x, P.x, Q.x) + 10, A.y, "lab-thin");
    out += line(A.x, A.y, B.x, B.y, "lab-side-c");
    out += `<line x1="${r1(P.x)}" y1="${r1(P.y)}" x2="${r1(Q.x)}" y2="${r1(Q.y)}" class="lab-bad-stroke" style="stroke-width:6;stroke-linecap:round" />`;
    out += halo(text((P.x + Q.x) / 2, P.y - 12, `Lücke ${cmText(Math.abs(g1 - g0))}`, "lab-text lab-text-bad", "middle"));
    out += baseLabel(A, B, v.c);
    out += text(A.x - 8, A.y + 19, "A", "lab-text", "end") + text(B.x + 8, B.y + 19, "B", "lab-text");
  }
  out += dot(A);
  const rb = ringHandlePos(A, v.b * f.k, RING_A, EXIST_TOP);
  const ra = ringHandlePos(B, v.a * f.k, RING_B, EXIST_TOP);
  out += handle("Rb", rb.x, rb.y, "Zirkel um A: Radius b");
  out += handle("Ra", ra.x, ra.y, "Zirkel um B: Radius a");
  out += handle("B", B.x, B.y, "Ecke B: Seite c");
  out += `</svg>`;
  return out;
}

function twoAngles(v: LabValues): string {
  const f = EXIST;
  const A = scr(f, ORIGIN);
  const B = scr(f, { x: v.c, y: 0 });
  const sum = v.alpha + v.beta;
  const apex = wswApex(v.c, v.alpha, v.beta);
  let out = open("Zwei Winkel an der Seite c: Die freien Schenkel treffen sich nur, wenn α + β kleiner als 180° ist.");
  out += clipRect("ex-clip-2", EXIST_TOP);
  out += clipped("ex-clip-2", ray(A, v.alpha) + ray(B, 180 - v.beta));
  const rel = sum < 180 ? "<" : sum === 180 ? "=" : ">";
  out += text(16, 26, `α + β = ${deg(sum)} ${rel} 180°`, sum < 180 ? "lab-text lab-text-big lab-text-ok" : "lab-text lab-text-big lab-text-bad");
  const DA = polar(A.x, A.y, 60, v.alpha);
  const DB = polar(B.x, B.y, 60, 180 - v.beta);
  const avoid: Pt[] = [];
  if (apex) {
    const C = scr(f, apex);
    avoid.push(C);
    out += text(16, 48, `Die freien Schenkel treffen sich in C: γ = 180° − α − β = ${deg(180 - sum)}.`, "lab-text-muted");
    if (C.y >= EXIST_TOP + 12 && C.x > 8 && C.x < W - 8) {
      const S = centroid(A, B, C);
      out += text(16, 66, oppositeText(measure(ORIGIN, { x: v.c, y: 0 }, apex)), "lab-text-muted");
      out += polygon([A, B, C], "lab-shape");
      out += angleFill(C, A, B, 20, "lab-fill-c");
      out += line(B.x, B.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, A.x, A.y, "lab-side-b");
      out += angleLabel(C, A, B, 34, "γ", "lab-text lab-text-c");
      out += vertexLabel(C, S, "C");
    } else {
      out += text(16, 66, "C liegt so weit oben, dass es nicht mehr ins Bild passt.", "lab-text-muted");
    }
  } else {
    out += text(16, 48, sum === 180 ? "Die freien Schenkel sind parallel (Ergänzungswinkel aus M7)." : "Die freien Schenkel laufen nach oben auseinander.", "lab-text-muted");
    out += text(16, 66, "Sie treffen sich oberhalb von [AB] nie: kein Dreieck.", "lab-text-muted");
  }
  out += angleFill(A, B, DA, 26, "lab-fill-a") + angleFill(B, DB, A, 26, "lab-fill-b");
  out += line(A.x, A.y, B.x, B.y, "lab-side-c");
  out += angleLabel(A, B, DA, 48, `α = ${deg(v.alpha)}`, "lab-text-small lab-text-a");
  out += angleLabel(B, DB, A, 48, `β = ${deg(v.beta)}`, "lab-text-small lab-text-b");
  out += baseLabel(A, B, v.c);
  out += dot(A) + text(A.x - 8, A.y + 19, "A", "lab-text", "end");
  out += text(B.x + 8, B.y + 19, "B", "lab-text");
  const HA = rayHandlePos(A, v.alpha, avoid, EXIST_TOP);
  const HB = rayHandlePos(B, 180 - v.beta, [...avoid, HA], EXIST_TOP);
  out += handle("HA", HA.x, HA.y, "freier Schenkel in A: Winkel α");
  out += handle("HB", HB.x, HB.y, "freier Schenkel in B: Winkel β");
  out += handle("B", B.x, B.y, "Ecke B: Seite c");
  out += `</svg>`;
  return out;
}

// ─── 1.2 Dreiecke konstruieren ─────────────────────────────────────────────

export const CON: Frame = { ax: 110, base: 276, k: 24 };
const CON_TOP = 70;

/** The four cases of the construction lab. */
export const CASES = ["SSS", "SWS", "WSW", "SsW"] as const;
const GIVEN_SIDES: Tone[][] = [["a", "b", "c"], ["b", "c"], ["c"], ["c", "a"]];
const GIVEN_ANGLES: Tone[][] = [[], ["a"], ["a", "b"], ["a"]];

/** The apexes C (cm) the construction of the chosen case ends with: none, one or two. */
export function constructionApexes(v: LabValues): Pt[] {
  if (v.fall === 0) return sideCheck(v.a, v.b, v.c).meet === "two" ? [sssApex(v.a, v.b, v.c)!] : [];
  if (v.fall === 1) return [onLeg(v.b, v.alpha)];
  if (v.fall === 2) {
    const C = wswApex(v.c, v.alpha, v.beta);
    return C ? [C] : [];
  }
  return ssaLengths(v.c, v.a, v.alpha).map((t) => onLeg(t, v.alpha));
}

/** The Konstruktionsbeschreibung of the chosen case, step 1 to 4, with the values. */
export function constructionSteps(v: LabValues): string[] {
  const first = `Zeichne die Strecke [AB] mit c = ${cmText(v.c)}.`;
  const angleA = `Trage in A an [AB] den Winkel α = ${deg(v.alpha)} an.`;
  const n = constructionApexes(v).length;
  if (v.fall === 0) {
    const meet = sideCheck(v.a, v.b, v.c).meet;
    return [
      first,
      `Zeichne den Kreis um A mit dem Radius b = ${cmText(v.b)}.`,
      `Zeichne den Kreis um B mit dem Radius a = ${cmText(v.a)}.`,
      meet === "two" ? "Die Kreise schneiden sich in C. Verbinde C mit A und B." : meet === "touch" ? "Die Kreise berühren sich nur auf AB: kein Dreieck." : "Die Kreise schneiden sich nicht: kein Dreieck.",
    ];
  }
  if (v.fall === 1) {
    return [first, angleA, `Der Kreis um A mit r = b = ${cmText(v.b)} schneidet den Schenkel in C.`, "Verbinde B mit C."];
  }
  if (v.fall === 2) {
    return [first, angleA, `Trage in B an [BA] den Winkel β = ${deg(v.beta)} an.`, n ? "Die freien Schenkel schneiden sich in C." : "Die freien Schenkel schneiden sich nicht: kein Dreieck."];
  }
  const touch = n === 1 && v.a < v.c - EPS;
  return [
    first,
    angleA,
    `Zeichne den Kreis um B mit dem Radius a = ${cmText(v.a)}.`,
    n === 2 ? "Der Kreis schneidet den Schenkel in C₁ und C₂: zwei Dreiecke." : n === 1 ? (touch ? "Der Kreis berührt den Schenkel nur in C: ein Dreieck." : "Der Kreis schneidet den Schenkel in C. Verbinde B mit C.") : "Der Kreis trifft den freien Schenkel nicht: kein Dreieck.",
  ];
}

/** The sketch triangle of a Planfigur in a box: given pieces in colour, the rest thin. */
function planfigur(fall: number, box: { x: number; y: number; w: number; h: number }, v: LabValues | null): string {
  const P = (u: number, t: number): Pt => ({ x: box.x + 12 + u * (box.w - 24), y: box.y + box.h - 16 - (t / 0.72) * (box.h - 36) });
  const A = P(0, 0);
  const B = P(1, 0);
  const C = P(0.36, 0.72);
  const sides = GIVEN_SIDES[fall];
  const angles = GIVEN_ANGLES[fall];
  const big = v !== null;
  let out = polygon([A, B, C], "lab-fill-only");
  const sideLine = (p: Pt, q: Pt, tone: Tone) => (sides.includes(tone) ? line(p.x, p.y, q.x, q.y, `lab-side-${tone}`) : line(p.x, p.y, q.x, q.y, "lab-thin"));
  out += sideLine(B, C, "a") + sideLine(C, A, "b") + sideLine(A, B, "c");
  const r = big ? 30 : 13;
  if (angles.includes("a")) out += angleFill(A, B, C, r, "lab-fill-a");
  if (angles.includes("b")) out += angleFill(B, C, A, r, "lab-fill-b");
  const cls = big ? "lab-text" : "lab-text-small";
  const value = (tone: Tone): string => (v ? ` = ${cmText(v[tone])}` : "");
  if (sides.includes("a")) out += edgeLabel(B, C, `a${value("a")}`, `${cls} lab-text-a`);
  if (sides.includes("b")) out += edgeLabel(C, A, `b${value("b")}`, `${cls} lab-text-b`);
  if (sides.includes("c")) out += sideLabel(A, B, `c${value("c")}`, big ? 16 : 11, `${cls} lab-text-c`);
  if (angles.includes("a")) out += angleLabel(A, B, C, big ? 54 : 22, v ? `α = ${deg(v.alpha)}` : "α", `${cls} lab-text-a`);
  if (angles.includes("b")) out += angleLabel(B, C, A, big ? 54 : 22, v ? `β = ${deg(v.beta)}` : "β", `${cls} lab-text-b`);
  out += text(A.x - 5, A.y + (big ? 16 : 11), "A", cls, "end") + text(B.x + 5, B.y + (big ? 16 : 11), "B", cls) + text(C.x, C.y - 7, "C", cls, "middle");
  return out;
}

/** The step the construction lab shows, 0 (Planfigur) to 4. */
export const conStep = (v: LabValues): number => Math.max(0, Math.min(4, Math.round(v.step)));

function triangleConstruction(v: LabValues): string {
  const f = CON;
  const step = conStep(v);
  const steps = constructionSteps(v);
  let out = open("Dreieckskonstruktion Schritt für Schritt: Planfigur, Strecke, Winkel und Zirkelkreise");
  if (step === 0) {
    out += text(16, 26, `Planfigur zum Fall ${CASES[v.fall]}`, "lab-text lab-text-big");
    out += text(16, 48, "Skizze, nicht maßstäblich: Die gegebenen Stücke sind farbig.", "lab-text");
    out += text(16, 66, "Mit „Nächster Schritt“ beginnt die Konstruktion.", "lab-text-muted");
    out += planfigur(v.fall, { x: 100, y: 84, w: 320, h: 236 }, v);
    out += `</svg>`;
    return out;
  }
  const A = scr(f, ORIGIN);
  const B = scr(f, { x: v.c, y: 0 });
  const apexes = constructionApexes(v);
  out += text(16, 24, `Schritt ${step} von 4`, "lab-text lab-text-big");
  out += text(16, 44, steps[step - 1], "lab-text");
  out += clipRect("con-clip", CON_TOP);
  let loci = "";
  // the free legs and the compass circles of the steps done so far
  if (v.fall === 0) {
    if (step >= 2) loci += ring(A, v.b * f.k, "b", step === 2);
    if (step >= 3) loci += ring(B, v.a * f.k, "a", step === 3);
  } else {
    if (step >= 2) loci += ray(A, v.alpha, step === 2);
    if (v.fall === 1 && step >= 3) loci += ring(A, v.b * f.k, "b", step === 3);
    if (v.fall === 2 && step >= 3) loci += ray(B, 180 - v.beta, step === 3);
    if (v.fall === 3 && step >= 3) loci += ring(B, v.a * f.k, "a", step === 3);
  }
  out += clipped("con-clip", loci);
  // the result: C is found in step 3 (SWS) or in step 4
  const showApex = step === 4 || (v.fall === 1 && step === 3);
  const visible = (C: Pt) => C.y >= CON_TOP + 6 && C.x > 6 && C.x < W - 6;
  const shown: Pt[] = [];
  let note = "";
  if (showApex) {
    const fills = ["lab-fill-a", "lab-fill-b"];
    const two = apexes.length === 2;
    apexes.forEach((apex, i) => {
      const C = scr(f, apex);
      if (!visible(C)) return;
      shown.push(C);
      if (step === 4) {
        out += polygon([A, B, C], two ? fills[i] : "lab-shape");
        out += thinSide(B, C, "a") + thinSide(C, A, "b");
      }
      out += dot(C);
      out += vertexLabel(C, two ? (i === 0 ? { x: C.x + 30, y: C.y + 20 } : { x: C.x - 10, y: C.y + 30 }) : centroid(A, B, C), two ? `C${i === 0 ? "₁" : "₂"}` : "C");
    });
    if (step === 4 && v.fall === 0 && apexes.length === 1) {
      const mirror = scr(f, { x: apexes[0].x, y: -apexes[0].y });
      if (mirror.y < H - 8) out += dot(mirror, "lab-dot-small", 3.5) + halo(text(mirror.x + 8, mirror.y + 4, "C'", "lab-text-small"));
      note = "C' unter AB gäbe nur das Spiegelbild: dasselbe Dreieck.";
    }
    if (step === 4 && v.fall === 0 && sideCheck(v.a, v.b, v.c).meet === "touch") out += dot(scr(f, sssApex(v.a, v.b, v.c)!), "lab-point-bad", 5);
    if (step === 4 && apexes.length === 0) {
      note = v.fall === 3 ? "Der Kreis um B ist kleiner als der Abstand von B zum Schenkel." : "Mit diesen Stücken gibt es kein Dreieck.";
      if (v.fall === 3) out += legLot(f, v.c, v.alpha);
    }
    if (step === 4 && apexes.length === 2) note = "α liegt der kürzeren Seite a gegenüber: zwei Lösungen.";
    if (apexes.some((apex) => !visible(scr(f, apex)))) note = "C liegt weit oben, außerhalb der Zeichnung.";
  }
  if (note) out += text(16, 62, note, apexes.length === 0 && step === 4 ? "lab-text-muted lab-text-bad" : "lab-text-muted");
  if (v.fall !== 0 && step >= 2) {
    const DA = polar(A.x, A.y, 60, v.alpha);
    out += angleFill(A, B, DA, 26, "lab-fill-a") + angleLabel(A, B, DA, 48, `α = ${deg(v.alpha)}`, "lab-text-small lab-text-a");
  }
  if (v.fall === 2 && step >= 3) {
    const DB = polar(B.x, B.y, 60, 180 - v.beta);
    out += angleFill(B, DB, A, 26, "lab-fill-b") + angleLabel(B, DB, A, 48, `β = ${deg(v.beta)}`, "lab-text-small lab-text-b");
  }
  out += line(A.x, A.y, B.x, B.y, "lab-side-c");
  out += baseLabel(A, B, v.c);
  out += dot(A) + text(A.x - 8, A.y + 19, "A", "lab-text", "end");
  out += text(B.x + 8, B.y + 19, "B", "lab-text");
  // the Planfigur, small, top right
  out += `<rect x="384" y="${CON_TOP + 4}" width="128" height="100" rx="8" class="lab-panel" />`;
  out += text(392, CON_TOP + 18, "Planfigur", "lab-text-small");
  out += planfigur(v.fall, { x: 384, y: CON_TOP + 22, w: 128, h: 82 }, null);
  // handles for the pieces drawn so far
  let HA: Pt | null = null;
  if (v.fall !== 0 && step >= 2) {
    HA = rayHandlePos(A, v.alpha, shown, CON_TOP);
    out += handle("HA", HA.x, HA.y, "freier Schenkel in A: Winkel α");
  }
  if (v.fall === 2 && step >= 3) {
    const HB = rayHandlePos(B, 180 - v.beta, HA ? [...shown, HA] : shown, CON_TOP);
    out += handle("HB", HB.x, HB.y, "freier Schenkel in B: Winkel β");
  }
  if ((v.fall === 0 && step >= 2) || (v.fall === 1 && step >= 3)) {
    const rb = ringHandlePos(A, v.b * f.k, RING_A, CON_TOP);
    out += handle("Rb", rb.x, rb.y, "Zirkel um A: Radius b");
  }
  if ((v.fall === 0 || v.fall === 3) && step >= 3) {
    const ra = ringHandlePos(B, v.a * f.k, RING_B, CON_TOP);
    out += handle("Ra", ra.x, ra.y, "Zirkel um B: Radius a");
  }
  out += handle("B", B.x, B.y, "Ecke B: Seite c");
  out += `</svg>`;
  return out;
}

// ─── 1.3 Die Kongruenzsätze ────────────────────────────────────────────────

export const KON: Frame = { ax: 100, base: 256, k: 22 };
const KON_TOP = 72;

/** What the chosen pieces of the congruence lab determine. */
export interface CongruenceResult {
  /** The apexes C (cm, y up) of the triangles over [AB]; empty for WWW and for no triangle. */
  apexes: Pt[];
  count: "eins" | "zwei" | "keins" | "unendlich";
  /** The congruence theorem the pieces form, or "" when they form none. */
  theorem: string;
}

export function congruenceResult(v: LabValues): CongruenceResult {
  if (v.art === 4) return { apexes: [], count: v.alpha + v.beta < 180 - EPS ? "unendlich" : "keins", theorem: "" };
  if (v.art === 0) {
    const C = sideCheck(v.a, v.b, v.c).meet === "two" ? [sssApex(v.a, v.b, v.c)!] : [];
    return { apexes: C, count: C.length ? "eins" : "keins", theorem: "SSS" };
  }
  if (v.art === 1) return { apexes: [onLeg(v.b, v.alpha)], count: "eins", theorem: "SWS" };
  if (v.art === 2) {
    const C = wswApex(v.c, v.alpha, v.beta);
    return { apexes: C ? [C] : [], count: C ? "eins" : "keins", theorem: "WSW" };
  }
  const apexes = ssaLengths(v.c, v.a, v.alpha).map((t) => onLeg(t, v.alpha));
  const count = apexes.length === 2 ? "zwei" : apexes.length === 1 ? "eins" : "keins";
  return { apexes, count, theorem: v.a > v.c + EPS ? "SsW" : "" };
}

const ART_GIVEN_SIDES: Tone[][] = [["a", "b", "c"], ["b", "c"], ["c"], ["c", "a"], []];
const ART_GIVEN_ANGLES: Tone[][] = [[], ["a"], ["a", "b"], ["a"], ["a", "b"]];

function wwwFamily(v: LabValues): string {
  const apex1 = wswApex(1, v.alpha, v.beta);
  if (!apex1) return text(16, 48, "Schon α + β ist 180° oder mehr: kein Dreieck.", "lab-text-muted");
  const xmin = Math.min(0, apex1.x);
  const xmax = Math.max(1, apex1.x);
  const s = Math.min(420 / (xmax - xmin), 200 / apex1.y, 300);
  const f: Frame = { ax: 50 - xmin * s, base: 304, k: s };
  const A = scr(f, ORIGIN);
  const sizes = [1, 0.74, 0.5];
  const fills = ["lab-fill-c", "lab-fill-b", "lab-fill-a"];
  const sub = ["₃", "₂", "₁"];
  let out = "";
  sizes.forEach((size, i) => {
    const B = scr(f, { x: size, y: 0 });
    const C = scr(f, { x: apex1.x * size, y: apex1.y * size });
    out += polygon([A, B, C], fills[i]);
    out += angleArc(B, C, A, 16);
    out += halo(text(B.x + 4, B.y + 16, `B${sub[i]}`, "lab-text-small"));
    out += halo(text(C.x + 7, C.y - 3, `C${sub[i]}`, "lab-text-small"));
  });
  const B3 = scr(f, { x: 1, y: 0 });
  const C3 = scr(f, apex1);
  out += angleFill(A, B3, C3, 26, "lab-fill-a");
  out += angleLabel(A, B3, C3, 48, `α = ${deg(v.alpha)}`, "lab-text-small lab-text-a");
  out += angleLabel(B3, C3, A, 38, `β = ${deg(v.beta)}`, "lab-text-small lab-text-b");
  out += angleLabel(C3, A, B3, 34, `γ = ${deg(180 - v.alpha - v.beta)}`, "lab-text-small lab-text-c");
  out += dot(A) + text(A.x - 8, A.y + 16, "A", "lab-text", "end");
  out += text(16, 48, "Gleiche Winkel legen nur die Form fest, nicht die Größe.", "lab-text-muted");
  out += text(16, 66, "Drei von unendlich vielen; die Gegenseiten von A sind parallel.", "lab-text-muted");
  return out;
}

/** The second line of the congruence lab for two sides and an opposite angle. */
function ssaNote(v: LabValues, res: CongruenceResult): string {
  const d = legDistance(v.c, v.alpha);
  if (res.count === "zwei") return `Abstand ≈ ${cmText(d)} < a < c: Der Kreis schneidet den Schenkel zweimal.`;
  if (res.count === "keins") return v.alpha >= 90 && v.a <= v.c ? "α ist nicht spitz: a müsste die längste Seite sein." : `a ist kürzer als der Abstand ≈ ${cmText(d)}: kein Schnittpunkt.`;
  if (v.a < v.c - EPS) return "a ist genau der Abstand: Der Kreis berührt den Schenkel.";
  return v.a > v.c + EPS ? "a > c: Der zweite Schnittpunkt liegt auf der Verlängerung über A hinaus." : "Der Kreis geht durch A; nur der zweite Schnittpunkt ergibt C.";
}

function congruence(v: LabValues): string {
  const res = congruenceResult(v);
  let out = open("Welche Dreiecke passen zu den gewählten Stücken? Eines, zwei, keines oder unendlich viele verschieden große.");
  const headline =
    res.count === "unendlich"
      ? "WWW: gleiche Form, viele Größen"
      : res.count === "zwei"
        ? "Zwei Dreiecke, nicht kongruent"
        : res.count === "keins"
          ? "Kein Dreieck"
          : res.theorem
            ? `${res.theorem}: genau ein Dreieck`
            : "Hier passt nur ein Dreieck";
  out += text(16, 26, headline, res.count === "eins" && res.theorem ? "lab-text lab-text-big lab-text-ok" : res.count === "keins" ? "lab-text lab-text-big lab-text-bad" : "lab-text lab-text-big");
  if (v.art === 4) return `${out}${wwwFamily(v)}</svg>`;
  const f = KON;
  const A = scr(f, ORIGIN);
  const B = scr(f, { x: v.c, y: 0 });
  const sides = ART_GIVEN_SIDES[v.art];
  const angles = ART_GIVEN_ANGLES[v.art];
  const reason =
    v.art === 3
      ? v.a > v.c + EPS
        ? "α liegt der längeren Seite a gegenüber: SsW."
        : v.a < v.c - EPS
          ? "α liegt der kürzeren Seite a gegenüber: kein Kongruenzsatz."
          : "a = c: Der Kreis um B geht durch A."
      : res.count === "keins"
        ? v.art === 0
          ? "Die längste Seite ist zu lang für die beiden anderen."
          : "α + β ist 180° oder mehr."
        : ["Drei Seiten legen das Dreieck fest.", "Zwei Seiten und der Winkel dazwischen legen es fest.", "Eine Seite und die Winkel an ihren Enden legen es fest."][v.art];
  out += text(16, 48, reason, "lab-text-muted");
  out += clipRect("kon-clip", KON_TOP);
  // the loci that decide: compass circles and free legs
  let loci = "";
  if (v.art === 0 || v.art === 1) loci += ring(A, v.b * f.k, "b");
  if (v.art === 0 || v.art === 3) loci += ring(B, v.a * f.k, "a");
  if (v.art !== 0) loci += ray(A, v.alpha);
  if (v.art === 2) loci += ray(B, 180 - v.beta);
  out += clipped("kon-clip", loci);
  if (v.art === 3) out += clipped("kon-clip", legLot(f, v.c, v.alpha));
  const visible = (C: Pt) => C.y >= KON_TOP + 6 && C.x > 6 && C.x < W - 6;
  const shown: Pt[] = [];
  let note = v.art === 3 ? ssaNote(v, res) : "";
  if (res.apexes.length === 1) {
    const apex = res.apexes[0];
    const C = scr(f, apex);
    const mirror = scr(f, { x: apex.x, y: -apex.y });
    out += clipped("kon-clip", polygon([A, B, mirror], "lab-ghost"));
    if (mirror.y < H - 8) out += halo(text(mirror.x + 8, mirror.y + 4, "C'", "lab-text-small"));
    if (!note) note = visible(C) ? "Gestrichelt: das Spiegelbild an AB, deckungsgleich." : "C liegt weit oben, außerhalb der Zeichnung.";
    if (visible(C)) {
      shown.push(C);
      const S = centroid(A, B, C);
      out += polygon([A, B, C], "lab-shape");
      out += sides.includes("a") ? line(B.x, B.y, C.x, C.y, "lab-side-a") : thinSide(B, C, "a");
      out += sides.includes("b") ? line(C.x, C.y, A.x, A.y, "lab-side-b") : thinSide(C, A, "b");
      out += vertexLabel(C, S, "C");
      if (sides.includes("a")) out += edgeLabel(B, C, `a = ${cmText(v.a)}`, "lab-text-small lab-text-a");
      if (sides.includes("b")) out += edgeLabel(C, A, `b = ${cmText(v.b)}`, "lab-text-small lab-text-b");
    }
  } else if (res.apexes.length === 2) {
    const fills = ["lab-fill-a", "lab-fill-b"];
    res.apexes.forEach((apex, i) => {
      const C = scr(f, apex);
      shown.push(C);
      out += polygon([A, B, C], fills[i]);
      out += line(B.x, B.y, C.x, C.y, "lab-side-a");
      out += dot(C);
      out += vertexLabel(C, i === 0 ? { x: C.x + 30, y: C.y + 20 } : { x: C.x - 10, y: C.y + 30 }, `C${i === 0 ? "₁" : "₂"}`);
    });
  }
  if (note) out += text(16, 66, note, "lab-text-muted");
  if (angles.includes("a")) {
    const DA = polar(A.x, A.y, 60, v.alpha);
    out += angleFill(A, B, DA, 24, "lab-fill-a") + angleLabel(A, B, DA, 46, `α = ${deg(v.alpha)}`, "lab-text-small lab-text-a");
  }
  if (angles.includes("b")) {
    const DB = polar(B.x, B.y, 60, 180 - v.beta);
    out += angleFill(B, DB, A, 24, "lab-fill-b") + angleLabel(B, DB, A, 46, `β = ${deg(v.beta)}`, "lab-text-small lab-text-b");
  }
  out += line(A.x, A.y, B.x, B.y, "lab-side-c");
  out += baseLabel(A, B, v.c);
  out += dot(A) + text(A.x - 8, A.y + 19, "A", "lab-text", "end");
  out += text(B.x + 8, B.y + 19, "B", "lab-text");
  let HA: Pt | null = null;
  if (v.art !== 0) {
    HA = rayHandlePos(A, v.alpha, shown, KON_TOP);
    out += handle("HA", HA.x, HA.y, "freier Schenkel in A: Winkel α");
  }
  if (v.art === 2) {
    const HB = rayHandlePos(B, 180 - v.beta, HA ? [...shown, HA] : shown, KON_TOP);
    out += handle("HB", HB.x, HB.y, "freier Schenkel in B: Winkel β");
  }
  if (v.art === 0 || v.art === 1) {
    const rb = ringHandlePos(A, v.b * f.k, RING_A, KON_TOP);
    out += handle("Rb", rb.x, rb.y, "Zirkel um A: Radius b");
  }
  if (v.art === 0 || v.art === 3) {
    const ra = ringHandlePos(B, v.a * f.k, RING_B, KON_TOP);
    out += handle("Ra", ra.x, ra.y, "Zirkel um B: Radius a");
  }
  out += handle("B", B.x, B.y, "Ecke B: Seite c");
  out += `</svg>`;
  return out;
}

// ─── Handles of the triangle labs ──────────────────────────────────────────

/** B on the base: the side c. */
const baseHandle = (f: Frame) => ({ x: "c", drag: (p: Pt) => ({ c: (p.x - f.ax) / f.k }) });
/** The handle on the free leg in A: the angle α. */
const legA = (f: Frame) => ({ x: "alpha", drag: (p: Pt) => ({ alpha: dragAngle(scr(f, ORIGIN), p, 10, 170) }) });
/** The handle on the free leg in B: the angle β, measured from [BA]. */
const legB = (f: Frame) => ({ x: "beta", drag: (p: Pt, v: LabValues) => ({ beta: dragAngle(scr(f, { x: v.c, y: 0 }), p, 10, 170, true) }) });
/** The compass around A: the radius b. */
const radiusB = (f: Frame) => ({ x: "b", drag: (p: Pt) => ({ b: dist(p, scr(f, ORIGIN)) / f.k }) });
/** The compass around B: the radius a. */
const radiusA = (f: Frame) => ({ x: "a", drag: (p: Pt, v: LabValues) => ({ a: dist(p, scr(f, { x: v.c, y: 0 })) / f.k }) });

// ─── 1.4 to 1.6: written in the next step ──────────────────────────────────

const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const DREIECKE_VIERECKE_VIEWS: Record<"triangle-existence" | "triangle-construction" | "congruence" | "quadrilateral-family" | "quadrilateral-construction" | "quadrilateral-problems", LabView> = {
  "triangle-existence": {
    render: (v) => (v.view === 1 ? twoAngles(v) : compassTest(v)),
    handles: {
      B: baseHandle(EXIST),
      C: {
        x: "b",
        y: "a",
        drag: (p, v) => ({ b: dist(p, scr(EXIST, ORIGIN)) / EXIST.k, a: dist(p, scr(EXIST, { x: v.c, y: 0 })) / EXIST.k }),
      },
      Rb: radiusB(EXIST),
      Ra: radiusA(EXIST),
      HA: legA(EXIST),
      HB: legB(EXIST),
    },
  },
  "triangle-construction": {
    render: triangleConstruction,
    handles: { B: baseHandle(CON), HA: legA(CON), HB: legB(CON), Rb: radiusB(CON), Ra: radiusA(CON) },
  },
  congruence: {
    render: congruence,
    handles: { B: baseHandle(KON), HA: legA(KON), HB: legB(KON), Rb: radiusB(KON), Ra: radiusA(KON) },
  },
  "quadrilateral-family": placeholder,
  "quadrilateral-construction": placeholder,
  "quadrilateral-problems": placeholder,
};
