import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { angleMark, arcPath, clipped, H, handle, type LabView, line, open, Plot, polar, polygon, type Pt, r1, rect, sectorPath, sideLabel, text, W } from "./svg";

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

// ─── Quadrilaterals: properties, exact on grid points ──────────────────────
// A quadrilateral ABCD (counterclockwise): sides a = [AB], b = [BC], c = [CD],
// d = [DA], diagonals e = [AC], f = [BD], angles α, β, γ, δ at A, B, C, D.

const sub = (p: Pt, q: Pt): Pt => ({ x: p.x - q.x, y: p.y - q.y });
const cross = (u: Pt, w: Pt): number => u.x * w.y - u.y * w.x;
const dotP = (u: Pt, w: Pt): number => u.x * w.x + u.y * w.y;
const len2 = (u: Pt): number => u.x * u.x + u.y * u.y;
const QV = ["A", "B", "C", "D"];
const QW = ["α", "β", "γ", "δ"];
const SIDE_NAMES = ["AB", "BC", "CD", "DA"];

/** Whether the segments [p1p2] and [p3p4] meet, touching included. */
function segmentsMeet(p1: Pt, p2: Pt, p3: Pt, p4: Pt, eps: number): boolean {
  const d1 = cross(sub(p4, p3), sub(p1, p3));
  const d2 = cross(sub(p4, p3), sub(p2, p3));
  const d3 = cross(sub(p2, p1), sub(p3, p1));
  const d4 = cross(sub(p2, p1), sub(p4, p1));
  const opposite = (s: number, t: number) => (s > eps && t < -eps) || (s < -eps && t > eps);
  if (opposite(d1, d2) && opposite(d3, d4)) return true;
  const on = (p: Pt, q: Pt, r: Pt) => Math.min(p.x, q.x) - eps <= r.x && r.x <= Math.max(p.x, q.x) + eps && Math.min(p.y, q.y) - eps <= r.y && r.y <= Math.max(p.y, q.y) + eps;
  return (Math.abs(d1) <= eps && on(p3, p4, p1)) || (Math.abs(d2) <= eps && on(p3, p4, p2)) || (Math.abs(d3) <= eps && on(p1, p2, p3)) || (Math.abs(d4) <= eps && on(p1, p2, p4));
}

export interface QuadInfo {
  simple: boolean;
  /** Why ABCD is no quadrilateral, or "". */
  broken: string;
  convex: boolean;
  /** AB ∥ CD and BC ∥ DA. */
  par: [boolean, boolean];
  /** The squared side lengths a², b², c², d². */
  sides2: number[];
  allEqual: boolean;
  /** Right angles at A, B, C, D. */
  right: boolean[];
  diagEqual: boolean;
  diagPerp: boolean;
  diagBisect: boolean;
  /** [AC] halves [BD], [BD] halves [AC]. */
  eHalvesF: boolean;
  fHalvesE: boolean;
  /** Symmetry axes: "AC", "BD" (diagonals), "AB|CD", "BC|DA" (through the midpoints of two sides). */
  axes: string[];
  pointSym: boolean;
  /** The most special name in the Haus der Vierecke. */
  name: string;
}

/** Every property the Haus der Vierecke asks about; exact for grid points (eps for constructed ones). */
export function quadInfo(P: Pt[], eps = 1e-9): QuadInfo {
  const [A, B, C, D] = P;
  const zero = (x: number) => Math.abs(x) <= eps;
  const edges = [sub(B, A), sub(C, B), sub(D, C), sub(A, D)];
  const turns = edges.map((e, i) => cross(e, edges[(i + 1) % 4]));
  const collinear = edges.some((e) => zero(len2(e))) || turns.some(zero);
  const crossing = !collinear && (segmentsMeet(A, B, C, D, eps) || segmentsMeet(B, C, D, A, eps));
  const simple = !collinear && !crossing;
  const convex = simple && (turns.every((t) => t > eps) || turns.every((t) => t < -eps));
  const sides2 = edges.map(len2);
  const par: [boolean, boolean] = [zero(cross(edges[0], edges[2])), zero(cross(edges[1], edges[3]))];
  const right = [0, 1, 2, 3].map((i) => zero(dotP(edges[(i + 3) % 4], edges[i])));
  const e = sub(C, A);
  const f = sub(D, B);
  const diagEqual = zero(len2(e) - len2(f));
  const diagPerp = zero(dotP(e, f));
  const diagBisect = zero(A.x + C.x - B.x - D.x) && zero(A.y + C.y - B.y - D.y);
  const eHalvesF = zero(cross(e, { x: B.x + D.x - 2 * A.x, y: B.y + D.y - 2 * A.y }));
  const fHalvesE = zero(cross(f, { x: A.x + C.x - 2 * B.x, y: A.y + C.y - 2 * B.y }));
  const axes: string[] = [];
  if (simple) {
    if (diagPerp && eHalvesF) axes.push("AC");
    if (diagPerp && fHalvesE) axes.push("BD");
    if (par[0] && zero(dotP({ x: C.x + D.x - A.x - B.x, y: C.y + D.y - A.y - B.y }, edges[0]))) axes.push("AB|CD");
    if (par[1] && zero(dotP({ x: A.x + D.x - B.x - C.x, y: A.y + D.y - B.y - C.y }, edges[1]))) axes.push("BC|DA");
  }
  const allEqual = sides2.every((s) => zero(s - sides2[0]));
  let name: string;
  if (!simple) name = "kein Viereck";
  else if (allEqual && right[0]) name = "Quadrat";
  else if (par[0] && par[1] && right[0]) name = "Rechteck";
  else if (allEqual) name = "Raute";
  else if (par[0] && par[1]) name = "Parallelogramm";
  else if (axes.some((a) => a.includes("|"))) name = "gleichschenkliges Trapez";
  else if (axes.length) name = convex ? "Drachenviereck" : "Drachenviereck (nicht konvex)";
  else if (par[0] || par[1]) name = "Trapez";
  else name = convex ? "allgemeines Viereck" : "Viereck (nicht konvex)";
  return {
    simple,
    broken: collinear ? "Drei Ecken liegen auf einer Geraden." : crossing ? "Die Seiten überschneiden sich." : "",
    convex,
    par,
    sides2,
    allEqual,
    right,
    diagEqual,
    diagPerp,
    diagBisect,
    eHalvesF,
    fHalvesE,
    axes,
    pointSym: simple && diagBisect,
    name,
  };
}

/** Whether the interior angles at the vertices i and j are equal (convex quadrilaterals). */
function sameAngle(P: Pt[], i: number, j: number): boolean {
  const parts = (k: number) => {
    const u = sub(P[(k + 3) % 4], P[k]);
    const w = sub(P[(k + 1) % 4], P[k]);
    return { d: dotP(u, w), l: len2(u) * len2(w) };
  };
  const p = parts(i);
  const q = parts(j);
  if (Math.sign(Math.round(p.d * 1e6)) !== Math.sign(Math.round(q.d * 1e6))) return false;
  const x = p.d * p.d * q.l;
  const y = q.d * q.d * p.l;
  return Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
}

export function sidesText(info: QuadInfo): string {
  if (!info.simple) return info.broken;
  const parallel = info.par[0] && info.par[1] ? "AB ∥ CD, BC ∥ DA" : info.par[0] ? "AB ∥ CD" : info.par[1] ? "BC ∥ DA" : "keine parallelen Seiten";
  const s = info.sides2;
  const same = (i: number, j: number) => Math.abs(s[i] - s[j]) <= 1e-9 * Math.max(1, s[i]);
  const pairs: string[] = [];
  if (info.allEqual) pairs.push("alle vier gleich lang");
  else
    ([[0, 2], [1, 3], [0, 1], [1, 2], [2, 3], [3, 0]] as Array<[number, number]>).forEach(([i, j]) => {
      if (same(i, j)) pairs.push(`${SIDE_NAMES[i]} = ${SIDE_NAMES[j]}`);
    });
  return `${parallel}; ${pairs.length ? pairs.join(", ") : "keine gleich langen Seiten"}`;
}

export function anglesText(info: QuadInfo, P: Pt[]): string {
  if (!info.simple) return info.broken;
  const rights = info.right.map((r, i) => (r ? QV[i] : "")).filter(Boolean);
  if (rights.length === 4) return "vier rechte Winkel";
  const parts: string[] = [];
  if (rights.length) parts.push(`rechter Winkel bei ${listText(rights)}`);
  if (info.convex) {
    ([[0, 2], [1, 3], [0, 1], [1, 2], [2, 3], [3, 0]] as Array<[number, number]>).forEach(([i, j]) => {
      if (sameAngle(P, i, j) && !(info.right[i] && info.right[j])) parts.push(`${QW[i]} = ${QW[j]}`);
    });
  }
  return parts.length ? parts.join("; ") : "keine rechten oder gleich großen Winkel";
}

export function diagonalsText(info: QuadInfo): string {
  if (!info.simple) return info.broken;
  const parts: string[] = [];
  if (info.diagEqual) parts.push("gleich lang");
  if (info.diagPerp) parts.push("senkrecht zueinander");
  if (info.diagBisect) parts.push("halbieren sich gegenseitig");
  else if (info.convex && info.eHalvesF) parts.push("[AC] halbiert [BD]");
  else if (info.convex && info.fHalvesE) parts.push("[BD] halbiert [AC]");
  return parts.length ? parts.join(", ") : "keine besondere Eigenschaft";
}

export function symmetryText(info: QuadInfo): string {
  if (!info.simple) return info.broken;
  const n = info.axes.length;
  const axes = n === 0 ? "keine Symmetrieachse" : n === 1 ? "1 Symmetrieachse" : `${n} Symmetrieachsen`;
  return `${axes}${info.pointSym ? "; punktsymmetrisch" : ""}`;
}

function listText(items: string[]): string {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

/** The characteristic property of each name, and why it is not more special. */
const CHARACTERISTIC: Record<string, string> = {
  Quadrat: "vier gleich lange Seiten und vier rechte Winkel",
  Rechteck: "Parallelogramm mit rechtem Winkel; kein Quadrat: verschieden lange Seiten",
  Raute: "vier gleich lange Seiten; kein Quadrat: kein rechter Winkel",
  Parallelogramm: "zwei Paare paralleler Seiten; weder rechte Winkel noch vier gleiche Seiten",
  "gleichschenkliges Trapez": "Trapez mit Symmetrieachse durch die Mitten der Parallelen",
  Drachenviereck: "eine Diagonale ist Symmetrieachse; keine Raute",
  "Drachenviereck (nicht konvex)": "eine Diagonale ist Symmetrieachse, eine Ecke zeigt nach innen",
  Trapez: "ein Paar paralleler Seiten; keine Symmetrieachse",
  "allgemeines Viereck": "keine parallelen Seiten, keine Symmetrie",
  "Viereck (nicht konvex)": "eine Ecke zeigt nach innen",
};

/** The dashes that mark equal sides and the arrowheads that mark parallel sides, as in the exercise book. */
function sideMarks(S: Pt[], info: QuadInfo): string {
  let out = "";
  const s = info.sides2;
  const groups: number[][] = [];
  s.forEach((value, i) => {
    const group = groups.find((g) => Math.abs(s[g[0]] - value) <= 1e-9 * Math.max(1, value));
    if (group) group.push(i);
    else groups.push([i]);
  });
  let ticks = 0;
  for (const group of groups) {
    if (group.length < 2) continue;
    ticks += 1;
    for (const i of group) {
      const p = S[i];
      const q = S[(i + 1) % 4];
      const u = unitOf(p, q);
      const n = { x: -u.y, y: u.x };
      const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      for (let k = 0; k < ticks; k++) {
        const o = (k - (ticks - 1) / 2) * 5;
        const c = { x: m.x + u.x * o, y: m.y + u.y * o };
        out += line(c.x - n.x * 6, c.y - n.y * 6, c.x + n.x * 6, c.y + n.y * 6, "lab-ink");
      }
    }
  }
  const chevron = (p: Pt, q: Pt, dir: Pt, count: number) => {
    let marks = "";
    for (let k = 0; k < count; k++) {
      const t = 0.28 + k * 0.06;
      const c = { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
      const n = { x: -dir.y, y: dir.x };
      const back = { x: c.x - dir.x * 6, y: c.y - dir.y * 6 };
      marks += `<path d="M${r1(back.x + n.x * 4.5)} ${r1(back.y + n.y * 4.5)} L${r1(c.x)} ${r1(c.y)} L${r1(back.x - n.x * 4.5)} ${r1(back.y - n.y * 4.5)}" class="lab-ink" />`;
    }
    return marks;
  };
  if (info.par[0]) {
    const dir = unitOf(S[0], S[1]);
    out += chevron(S[0], S[1], dir, 1) + chevron(S[3], S[2], dir, 1);
  }
  if (info.par[1]) {
    const dir = unitOf(S[1], S[2]);
    out += chevron(S[1], S[2], dir, 2) + chevron(S[0], S[3], dir, 2);
  }
  return out;
}

/** A long line through p and q, to be clipped by the plot. */
function longLine(p: Pt, q: Pt, cls: string): string {
  const u = unitOf(p, q);
  return line(p.x - u.x * 900, p.y - u.y * 900, p.x + u.x * 900, p.y + u.y * 900, cls);
}

/** The point where the diagonals [AC] and [BD] cross (lines), or null when they are parallel. */
function diagonalCross(S: Pt[]): Pt | null {
  const e = sub(S[2], S[0]);
  const f = sub(S[3], S[1]);
  const det = cross(e, f);
  if (Math.abs(det) < 1e-9) return null;
  const t = cross(sub(S[1], S[0]), f) / det;
  return { x: S[0].x + e.x * t, y: S[0].y + e.y * t };
}

/** Diagonals, symmetry axes, centre, the outline with its marks and the vertex names of a quadrilateral on a plot. */
function quadFigure(plot: Plot, P: Pt[], info: QuadInfo, clipId: string, options: { axes?: boolean; marks?: boolean } = {}): string {
  const S = P.map((p) => plot.P(p.x, p.y));
  let out = polygon(S, info.simple ? "lab-fill-a" : "lab-fill-b");
  let inner = line(S[0].x, S[0].y, S[2].x, S[2].y, "lab-dashed") + line(S[1].x, S[1].y, S[3].x, S[3].y, "lab-dashed");
  if (options.axes !== false && info.simple) {
    for (const axis of info.axes) {
      if (axis === "AC") inner += longLine(S[0], S[2], "lab-curve-c");
      else if (axis === "BD") inner += longLine(S[1], S[3], "lab-curve-c");
      else {
        const [i, j] = axis === "AB|CD" ? [0, 2] : [1, 3];
        const m1 = { x: (S[i].x + S[(i + 1) % 4].x) / 2, y: (S[i].y + S[(i + 1) % 4].y) / 2 };
        const m2 = { x: (S[j].x + S[(j + 1) % 4].x) / 2, y: (S[j].y + S[(j + 1) % 4].y) / 2 };
        inner += longLine(m1, m2, "lab-curve-c");
      }
    }
  }
  out += clipped(clipId, inner);
  out += polygon(S, "lab-ink", 'style="fill:none"');
  if (info.convex) {
    const M = diagonalCross(S);
    if (M) {
      if (info.diagPerp) out += angleMark(M, S[2], S[1], 9, "lab-angle", true);
      out += dot(M, info.pointSym ? "lab-bar-c" : "lab-dot-small", info.pointSym ? 4 : 2.5);
      if (info.pointSym) out += halo(text(M.x + 7, M.y + 14, "Z", "lab-text-small lab-text-c"));
    }
    info.right.forEach((r, i) => {
      if (r) out += angleMark(S[i], S[(i + 1) % 4], S[(i + 3) % 4], 13, "lab-angle", true);
    });
  }
  if (options.marks !== false && info.simple) out += sideMarks(S, info);
  const center = centroid(...S);
  S.forEach((p, i) => (out += clampedLabel(plot, p, center, QV[i], "lab-text")));
  return out;
}

/** The name of a vertex outside its figure, but kept inside the plot box. */
function clampedLabel(plot: Plot, P: Pt, center: Pt, name: string, cls: string, d = 17): string {
  const u = unitOf(center, P);
  const { box } = plot;
  const x = Math.min(box.x + box.w - 8, Math.max(box.x + 8, P.x + u.x * d));
  const y = Math.min(box.y + box.h - 4, Math.max(box.y + 14, P.y + u.y * d + 4));
  return halo(text(x, y, name, cls, "middle"));
}

/** Background, lattice and, if asked, the numbers on the axes of a grid plot. */
function lattice(plot: Plot, numbers: boolean): string {
  const { box } = plot;
  let out = rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  for (let x = Math.ceil(plot.xmin); x <= plot.xmax; x++) out += line(plot.X(x), box.y, plot.X(x), box.y + box.h, "lab-grid");
  for (let y = Math.ceil(plot.ymin); y <= plot.ymax; y++) out += line(box.x, plot.Y(y), box.x + box.w, plot.Y(y), "lab-grid");
  if (numbers) {
    for (let x = 0; x <= plot.xmax; x += 2) out += text(plot.X(x), box.y + box.h + 12, String(x), "lab-text-tick", "middle");
    for (let y = 0; y <= plot.ymax; y += 1) out += text(box.x - 5, plot.Y(y) + 3.5, String(y), "lab-text-tick", "end");
  }
  return out;
}

// ─── 1.4 Das Haus der Vierecke ─────────────────────────────────────────────

export const FAMILY_PLOT = new Plot(-0.5, 12.5, -0.25, 7.25, { x: 14, y: 54, w: 492, h: 284 });

/** The four vertices of the Haus-der-Vierecke lab, in grid units. */
export const familyPoints = (v: LabValues): Pt[] => QV.map((n) => ({ x: v[`x${n}`], y: v[`y${n}`] }));

function quadrilateralFamily(v: LabValues): string {
  const plot = FAMILY_PLOT;
  const P = familyPoints(v);
  const info = quadInfo(P);
  let out = open("Ein Viereck mit ziehbaren Ecken auf Gitterpunkten; seine Eigenschaften und sein speziellster Name");
  out += `<defs>${plot.clip("fam-clip")}</defs>`;
  out += lattice(plot, false);
  out += quadFigure(plot, P, info, "fam-clip");
  out += text(16, 24, info.name === "kein Viereck" ? "Kein Viereck" : info.name.charAt(0).toUpperCase() + info.name.slice(1), info.simple ? "lab-text lab-text-big" : "lab-text lab-text-big lab-text-bad");
  out += text(16, 43, info.simple ? CHARACTERISTIC[info.name] : info.broken, "lab-text-muted");
  if (info.axes.length) out += text(W - 14, 24, "lila: Symmetrieachsen", "lab-text-small lab-text-c", "end");
  P.forEach((p, i) => {
    const s = plot.P(p.x, p.y);
    out += handle(QV[i], s.x, s.y, `Ecke ${QV[i]}`);
  });
  out += `</svg>`;
  return out;
}

const familyDrag = (i: number) => ({
  x: `x${QV[i]}`,
  y: `y${QV[i]}`,
  drag: (p: Pt) => ({ [`x${QV[i]}`]: FAMILY_PLOT.invX(p.x), [`y${QV[i]}`]: FAMILY_PLOT.invY(p.y), sel: i }),
});

// ─── 1.5 Vierecke konstruieren: der Zugmodus ───────────────────────────────

export const ZUG_PLOT = new Plot(0, 12, 0, 7, { x: 34, y: 54, w: 456, h: 266 });
export const ZUG_FIGURES = ["Parallelogramm", "Raute", "Drachenviereck"];

const half = (x: number): number => Math.round(x * 2) / 2;

/** The vertices the construction of figure `fig` gives from the free points A, B, C (and f for the Raute). */
export function zugConstructed(fig: number, A: Pt, B: Pt, C: Pt, f: number): Pt[] {
  if (fig === 0) return [A, B, C, { x: A.x + C.x - B.x, y: A.y + C.y - B.y }];
  if (fig === 1) {
    const M = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
    const d = Math.hypot(C.x - A.x, C.y - A.y);
    const n = d > 1e-9 ? { x: -(C.y - A.y) / d, y: (C.x - A.x) / d } : { x: 0, y: 1 };
    return [A, { x: M.x - (n.x * f) / 2, y: M.y - (n.y * f) / 2 }, C, { x: M.x + (n.x * f) / 2, y: M.y + (n.y * f) / 2 }];
  }
  const d2 = len2(sub(C, A));
  if (d2 < 1e-9) return [A, B, C, B];
  const t = dotP(sub(B, A), sub(C, A)) / d2;
  const F = { x: A.x + (C.x - A.x) * t, y: A.y + (C.y - A.y) * t };
  return [A, B, C, { x: 2 * F.x - B.x, y: 2 * F.y - B.y }];
}

/** The start of the Zugmodus lab; the freehand vertices start where the construction puts them, rounded to half units. */
export const ZUG_START = { xA: 1, yA: 1, xB: 6, yB: 1, xC: 8, yC: 4, f: 3 };
function freehandStart(fig: number): Pt[] {
  const s = ZUG_START;
  return zugConstructed(fig, { x: s.xA, y: s.yA }, { x: s.xB, y: s.yB }, { x: s.xC, y: s.yC }, s.f).map((p) => ({ x: half(p.x), y: half(p.y) }));
}
export const FREEHAND_START = { p: freehandStart(0)[3], rB: freehandStart(1)[1], rD: freehandStart(1)[3], k: freehandStart(2)[3] };

/** The four vertices the Zugmodus lab shows, and which of them depend on the others (constructed or frozen). */
export function zugPoints(v: LabValues): { P: Pt[]; dependent: boolean[] } {
  const A = { x: v.xA, y: v.yA };
  const B = { x: v.xB, y: v.yB };
  const C = { x: v.xC, y: v.yC };
  const built = zugConstructed(v.fig, A, B, C, v.f);
  if (v.modus === 0) return { P: built, dependent: [false, v.fig === 1, false, true] };
  if (v.fig === 0) return { P: [A, B, C, { x: v.pDx, y: v.pDy }], dependent: [false, false, false, true] };
  if (v.fig === 1) return { P: [A, { x: v.rBx, y: v.rBy }, C, { x: v.rDx, y: v.rDy }], dependent: [false, true, false, true] };
  return { P: [A, B, C, { x: v.kDx, y: v.kDy }], dependent: [false, false, false, true] };
}

/** Whether ABCD still is the figure its construction promises. */
export function zugKeeps(fig: number, info: QuadInfo): boolean {
  if (!info.simple) return false;
  if (fig === 0) return info.par[0] && info.par[1];
  if (fig === 1) return info.allEqual;
  return info.axes.includes("AC");
}

/** The values after "Ecken nach Augenmaß neu setzen": the frozen vertices where the construction puts them now, rounded. */
export function redrawFreehand(v: LabValues): LabValues {
  const built = zugConstructed(v.fig, { x: v.xA, y: v.yA }, { x: v.xB, y: v.yB }, { x: v.xC, y: v.yC }, v.f).map((p) => ({ x: half(p.x), y: half(p.y) }));
  if (v.fig === 0) return { ...v, pDx: built[3].x, pDy: built[3].y };
  if (v.fig === 1) return { ...v, rBx: built[1].x, rBy: built[1].y, rDx: built[3].x, rDy: built[3].y };
  return { ...v, kDx: built[3].x, kDy: built[3].y };
}

/** A thin arrow in the colour of side c, with a filled head. */
function vectorArrow(p: Pt, q: Pt, dashed = false): string {
  const len = dist(p, q);
  if (len < 2) return "";
  const u = unitOf(p, q);
  const head = Math.min(10, len * 0.45);
  const b = { x: q.x - u.x * head, y: q.y - u.y * head };
  const n = { x: -u.y * head * 0.45, y: u.x * head * 0.45 };
  return (
    `<line x1="${r1(p.x)}" y1="${r1(p.y)}" x2="${r1(b.x)}" y2="${r1(b.y)}" class="lab-side-c" style="stroke-width:2.2${dashed ? ";stroke-dasharray:6 4" : ""}" />` +
    polygon([q, { x: b.x + n.x, y: b.y + n.y }, { x: b.x - n.x, y: b.y - n.y }], "lab-bar-c")
  );
}

const pointText = (p: Pt): string => `(${fmt(p.x, 2)} | ${fmt(p.y, 2)})`;

/** "ein Parallelogramm", "eine Raute". */
export const withArticle = (name: string): string => `${name === "Raute" ? "eine" : "ein"} ${name}`;

function quadrilateralConstruction(v: LabValues): string {
  const plot = ZUG_PLOT;
  const { P, dependent } = zugPoints(v);
  const info = quadInfo(P, 1e-6);
  const keeps = zugKeeps(v.fig, info);
  const S = P.map((p) => plot.P(p.x, p.y));
  const fig = ZUG_FIGURES[v.fig];
  let out = open("Zugmodus: Eine konstruierte Figur behält ihre Eigenschaften, eine nach Augenmaß gezeichnete nicht.");
  out += `<defs>${plot.clip("zug-clip")}</defs>`;
  out += lattice(plot, true);
  const built = zugConstructed(v.fig, P[0], { x: v.xB, y: v.yB }, P[2], v.f);
  let aids = "";
  if (v.fig === 0) {
    // the arrow BC→ beside [BC], and the same arrow from A, beside [AD]: both pushed away from the figure
    const D = plot.P(built[3].x, built[3].y);
    const center = centroid(S[0], S[1], S[2], D);
    const away = (p: Pt, q: Pt): Pt => {
      const u = unitOf(p, q);
      const n = { x: -u.y, y: u.x };
      const mid = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      const sign = (mid.x - center.x) * n.x + (mid.y - center.y) * n.y >= 0 ? 1 : -1;
      return { x: n.x * sign * 11, y: n.y * sign * 11 };
    };
    const o1 = away(S[1], S[2]);
    const o2 = away(S[0], D);
    aids += vectorArrow({ x: S[1].x + o1.x, y: S[1].y + o1.y }, { x: S[2].x + o1.x, y: S[2].y + o1.y });
    aids += vectorArrow({ x: S[0].x + o2.x, y: S[0].y + o2.y }, { x: D.x + o2.x, y: D.y + o2.y }, true);
    const mid1 = { x: (S[1].x + S[2].x) / 2 + o1.x * 2.2, y: (S[1].y + S[2].y) / 2 + o1.y * 2.2 + 4 };
    const mid2 = { x: (S[0].x + D.x) / 2 + o2.x * 2.2, y: (S[0].y + D.y) / 2 + o2.y * 2.2 + 4 };
    aids += halo(text(mid1.x, mid1.y, "BC→", "lab-text-small lab-text-c", "middle"));
    aids += halo(text(mid2.x, mid2.y, "BC→", "lab-text-small lab-text-c", "middle"));
  } else if (v.fig === 1) {
    const M = plot.P((P[0].x + P[2].x) / 2, (P[0].y + P[2].y) / 2);
    const Bc = plot.P(built[1].x, built[1].y);
    aids += line(S[0].x, S[0].y, S[2].x, S[2].y, "lab-thin");
    aids += clipped("zug-clip", longLine(Bc, plot.P(built[3].x, built[3].y), "lab-curve-c"));
    if (dist(Bc, M) > 2) aids += angleMark(M, S[2], Bc, 10, "lab-angle", true);
    aids += dot(M, "lab-bar-c", 3.5) + halo(text(M.x + 8, M.y - 6, "M", "lab-text-small lab-text-c"));
  } else {
    const B = plot.P(v.xB, v.yB);
    const d2 = len2(sub(P[2], P[0]));
    const t = d2 > 1e-9 ? dotP(sub({ x: v.xB, y: v.yB }, P[0]), sub(P[2], P[0])) / d2 : 0;
    const F = plot.P(P[0].x + (P[2].x - P[0].x) * t, P[0].y + (P[2].y - P[0].y) * t);
    aids += clipped("zug-clip", longLine(S[0], S[2], "lab-curve-c"));
    aids += line(B.x, B.y, F.x, F.y, "lab-dashed") + line(F.x, F.y, plot.P(built[3].x, built[3].y).x, plot.P(built[3].x, built[3].y).y, "lab-dashed");
    if (dist(B, F) > 2) aids += angleMark(F, B, S[2], 10, "lab-angle", true);
  }
  out += polygon(S, keeps ? "lab-fill-a" : "lab-fill-b");
  out += aids;
  out += polygon(S, "lab-ink", 'style="fill:none"');
  if (info.simple) out += sideMarks(S, info);
  if (v.modus === 1) {
    // where the construction would put the frozen vertices
    built.forEach((p, i) => {
      if (!dependent[i]) return;
      const at = plot.P(p.x, p.y);
      if (dist(at, S[i]) > 3) out += `<circle cx="${r1(at.x)}" cy="${r1(at.y)}" r="9" class="lab-target" />`;
    });
  }
  const center = centroid(...S);
  S.forEach((p, i) => {
    out += clampedLabel(plot, p, center, QV[i], dependent[i] ? "lab-text lab-text-b" : "lab-text");
    if (dependent[i]) out += dot(p, v.modus === 0 ? "lab-point-b" : "lab-point", 5.5);
  });
  out += text(16, 22, keeps ? `ABCD ist ${withArticle(fig)}${info.name !== fig ? `, sogar ${withArticle(info.name)}` : ""}.` : `ABCD ist ${fig === "Raute" ? "keine" : "kein"} ${fig} mehr.`, keeps ? "lab-text lab-text-big lab-text-ok" : "lab-text lab-text-big lab-text-bad");
  const how =
    v.modus === 0
      ? ["D = A ⊕ BC→ hängt an A, B und C: Ziehe, es bleibt ein Parallelogramm.", "B und D liegen auf der Senkrechten durch M, je f : 2 von M entfernt.", "D ist das Spiegelbild von B an AC: Ziehe, es bleibt ein Drachen."][v.fig]
      : `Nach Augenmaß: ${v.fig === 1 ? "B und D bleiben" : "D bleibt"} liegen, wenn du ziehst. Kreis: Hier gehört ${v.fig === 1 ? "es" : "D"} hin.`;
  out += text(16, 40, how, "lab-text-muted");
  // handles for the free vertices
  [0, 1, 2].forEach((i) => {
    if (v.fig === 1 && i === 1) return;
    out += handle(QV[i], S[i].x, S[i].y, `Ecke ${QV[i]}`);
  });
  out += `</svg>`;
  return out;
}

const zugDrag = (i: number) => ({
  x: `x${QV[i]}`,
  y: `y${QV[i]}`,
  drag: (p: Pt) => ({ [`x${QV[i]}`]: ZUG_PLOT.invX(p.x), [`y${QV[i]}`]: ZUG_PLOT.invY(p.y), sel: i }),
});

/** "D = (3 | 4)" style coordinates of the Zugmodus readout. */
export function zugConstructionText(v: LabValues): string {
  const { P } = zugPoints(v);
  if (v.modus === 1) return v.fig === 1 ? `B = ${pointText(P[1])} und D = ${pointText(P[3])} liegen fest` : `D = ${pointText(P[3])} liegt fest`;
  if (v.fig === 0) {
    const bc = { x: v.xC - v.xB, y: v.yC - v.yB };
    return `BC→ = (${fmt(bc.x)} | ${fmt(bc.y)}), D = A ⊕ BC→ = ${pointText(P[3])}`;
  }
  if (v.fig === 1) return `M = ${pointText({ x: (v.xA + v.xC) / 2, y: (v.yA + v.yC) / 2 })}, f = ${fmt(v.f)}: B und D je ${fmt(v.f / 2)} von M`;
  return `D = Spiegelbild von B an AC ≈ ${pointText(P[3])}`;
}

// ─── 1.6 Mit Viereckseigenschaften rechnen ─────────────────────────────────

export const TRAP: Frame = { ax: 80, base: 292, k: 30 };
export const KITE: Frame = { ax: 80, base: 200, k: 36 };
export const PARA: Frame = { ax: 148, base: 296, k: 22 };

/** The trapezoid of the lab: A(0 | 0), B(a | 0), C(s + c | h), D(s | h). */
export const trapezoidPoints = (v: LabValues): Pt[] => [ORIGIN, { x: v.a, y: 0 }, { x: v.s + v.c, y: v.h }, { x: v.s, y: v.h }];
/** The kite of the lab: A(0 | 0), C(e | 0), B and D on the vertical through M at p % of e. */
export const kitePoints = (v: LabValues): Pt[] => {
  const m = (v.e * v.p) / 100;
  return [ORIGIN, { x: m, y: -v.f / 2 }, { x: v.e, y: 0 }, { x: m, y: v.f / 2 }];
};
/** The parallelogram of the lab: A(0 | 0), B(a | 0), D = b · (cos α | sin α), C = B + D. */
export const parallelogramPoints = (v: LabValues): Pt[] => {
  const D = { x: v.b * cosD(v.alpha), y: v.b * sinD(v.alpha) };
  return [ORIGIN, { x: v.a, y: 0 }, { x: v.a + D.x, y: D.y }, D];
};

/** The interior angles of a convex quadrilateral in degrees, as with the protractor. */
export function quadAngles(P: Pt[]): number[] {
  return [0, 1, 2, 3].map((i) => {
    const u = sub(P[(i + 3) % 4], P[i]);
    const w = sub(P[(i + 1) % 4], P[i]);
    return toDeg(Math.acos(Math.max(-1, Math.min(1, dotP(u, w) / Math.sqrt(len2(u) * len2(w))))));
  });
}

/** The area of the quadrilateral of figure `fig`. */
export function problemArea(v: LabValues): number {
  if (v.fig === 0) return ((v.a + v.c) / 2) * v.h;
  if (v.fig === 1) return (v.e * v.f) / 2;
  return v.a * v.b * sinD(v.alpha);
}

/** Whole degrees for a pair of angles that add up to 180°: both rounded the same way. */
function supplementPair(x: number): [number, number] {
  const r = Math.round(x);
  return [r, 180 - r];
}

/** The four angles of the figure as the readout and the drawing show them. */
export function problemAngles(v: LabValues): number[] {
  if (v.fig === 2) return [v.alpha, 180 - v.alpha, v.alpha, 180 - v.alpha];
  if (v.fig === 0) {
    const [al, be] = quadAngles(trapezoidPoints(v));
    const [alpha, delta] = supplementPair(al);
    const [beta, gamma] = supplementPair(be);
    return [alpha, beta, gamma, delta];
  }
  const raw = quadAngles(kitePoints(v));
  const alpha = Math.round(raw[0]);
  const gamma = Math.round(raw[2]);
  const beta = (360 - alpha - gamma) / 2;
  return [alpha, beta, gamma, beta];
}

/**
 * Arcs and values of the four angles. Very small or very flat angles get only
 * their letter (the readout has the value); `nudge` moves a label off a
 * diagonal that runs along its bisector.
 */
function angleLabels(S: Pt[], values: number[], cls: string[], exact: boolean, nudge: Pt[] = []): string {
  let out = "";
  S.forEach((p, i) => {
    const prev = S[(i + 3) % 4];
    const next = S[(i + 1) % 4];
    out += angleArc(p, next, prev, 18);
    const content = values[i] < 20 || values[i] > 160 ? QW[i] : `${QW[i]} ${exact ? "=" : "≈"} ${fmt(values[i], 1)}°`;
    const shift = nudge[i] ?? { x: 0, y: 0 };
    const u = unitOf(p, next);
    const w = unitOf(p, prev);
    const bis = unitOf({ x: 0, y: 0 }, { x: u.x + w.x, y: u.y + w.y });
    const d = values[i] < 20 ? 52 : 36;
    out += halo(text(p.x + bis.x * d + shift.x, p.y + bis.y * d + 4 + shift.y, content, cls[i], "middle"));
  });
  return out;
}

function quadrilateralProblems(v: LabValues): string {
  let out = open("Flächeninhalt und Winkel eines Trapezes, eines Drachenvierecks oder eines Parallelogramms; die Hilfsfigur zeigt, woher die Formel kommt.");
  const angles = problemAngles(v);
  const area = problemArea(v);
  const angleCls = ["lab-text-small lab-text-a", "lab-text-small lab-text-b", "lab-text-small lab-text-a", "lab-text-small lab-text-b"];
  if (v.fig === 0) {
    const f = TRAP;
    const P = trapezoidPoints(v);
    const S = P.map((p) => scr(f, p));
    const iso = Math.abs(2 * v.s + v.c - v.a) < 1e-9;
    out += text(16, 24, `A = (a + c) : 2 · h = (${fmt(v.a)} + ${fmt(v.c)}) : 2 · ${fmt(v.h)} = ${fmt(area)} cm²`, "lab-text lab-text-big");
    out += text(16, 46, iso ? "Gleichschenklig: α = β und γ = δ." : "α + δ = 180° und β + γ = 180°: Ergänzungswinkel an den Parallelen.", iso ? "lab-text-muted lab-text-ok" : "lab-text-muted");
    if (v.hilfe === 1) {
      const m = (v.a + v.c) / 2;
      const left = v.s / 2;
      out += polygon([scr(f, { x: left, y: 0 }), scr(f, { x: left + m, y: 0 }), scr(f, { x: left + m, y: v.h }), scr(f, { x: left, y: v.h })], "lab-ghost");
    }
    out += polygon(S, "lab-fill-a");
    // the height from D, on the extended base when D lies outside
    const foot = scr(f, { x: v.s, y: 0 });
    const lo = Math.min(S[0].x, foot.x, S[3].x);
    const hi = Math.max(S[1].x, foot.x, S[2].x);
    out += line(lo - 8, S[0].y, hi + 8, S[0].y, "lab-thin");
    out += line(S[3].x, S[3].y, foot.x, foot.y, "lab-dashed");
    out += angleMark(foot, S[3], foot.x > S[0].x + 1 ? S[0] : S[1], 9, "lab-angle", true);
    const hLeft = v.s < 0 && foot.x > 40;
    out += halo(text(S[3].x + (hLeft ? -6 : 6), (S[3].y + foot.y) / 2, "h", "lab-text-small", hLeft ? "end" : "start"));
    out += line(S[0].x, S[0].y, S[1].x, S[1].y, "lab-side-a") + line(S[3].x, S[3].y, S[2].x, S[2].y, "lab-side-b");
    out += line(S[1].x, S[1].y, S[2].x, S[2].y, "lab-ink") + line(S[3].x, S[3].y, S[0].x, S[0].y, "lab-ink");
    out += angleLabels(S, angles, angleCls, false);
    out += halo(text((S[0].x + S[1].x) / 2, S[0].y + 36, `a = ${cmText(v.a)}`, "lab-text lab-text-a", "middle"));
    out += halo(text((S[3].x + S[2].x) / 2, S[3].y - 10, `c = ${cmText(v.c)}`, "lab-text lab-text-b", "middle"));
    if (v.hilfe === 1) {
      const m = (v.a + v.c) / 2;
      const L = scr(f, { x: v.s / 2, y: v.h / 2 });
      const R = scr(f, { x: (v.a + v.s + v.c) / 2, y: v.h / 2 });
      out += line(L.x, L.y, R.x, R.y, "lab-curve-c");
      out += halo(text((L.x + R.x) / 2, L.y - 6, `m = (a + c) : 2 = ${cmText(m)}`, "lab-text-small lab-text-c", "middle"));
      out += text(16, 64, "gestrichelt: Rechteck m · h, gleich groß wie das Trapez", "lab-text-small");
    }
    const center = centroid(...S);
    S.forEach((p, i) => (out += vertexLabel(p, center, QV[i], "lab-text", 15)));
    out += handle("B", S[1].x, S[1].y, "Ecke B: Seite a");
    out += handle("C", S[2].x, S[2].y, "Ecke C: Seite c");
    out += handle("D", S[3].x, S[3].y, "Ecke D: obere Seite verschieben und Höhe");
  } else if (v.fig === 1) {
    const f = KITE;
    const P = kitePoints(v);
    const S = P.map((p) => scr(f, p));
    const M = scr(f, { x: (v.e * v.p) / 100, y: 0 });
    out += text(16, 24, `A = e · f : 2 = ${fmt(v.e)} · ${fmt(v.f)} : 2 = ${fmt(area)} cm²`, "lab-text lab-text-big");
    out += text(16, 46, v.p === 50 ? "Raute: Die Diagonalen halbieren sich, α = γ und β = δ." : "Die Symmetrieachse AC halbiert f; β = δ.", v.p === 50 ? "lab-text-muted lab-text-ok" : "lab-text-muted");
    const box = [scr(f, { x: 0, y: -v.f / 2 }), scr(f, { x: v.e, y: -v.f / 2 }), scr(f, { x: v.e, y: v.f / 2 }), scr(f, { x: 0, y: v.f / 2 })];
    out += polygon(box, "lab-ghost");
    if (v.hilfe === 1) {
      // the four corner triangles of the rectangle: each one as large as a quarter of the kite
      const corners: Array<[Pt, Pt, Pt]> = [
        [box[0], S[0], S[1]],
        [box[1], S[1], S[2]],
        [box[2], S[2], S[3]],
        [box[3], S[3], S[0]],
      ];
      for (const t of corners) out += polygon(t, "lab-fill-b");
      out += text(16, 64, `Rechteck e · f = ${fmt(v.e * v.f)} cm²: Die orangen Ecken sind so groß wie der Drachen.`, "lab-text-small");
    }
    out += polygon(S, "lab-fill-a");
    out += line(S[0].x, S[0].y, S[2].x, S[2].y, "lab-side-a") + line(S[1].x, S[1].y, S[3].x, S[3].y, "lab-side-b");
    out += angleMark(M, S[2], S[3], 9, "lab-angle", true);
    out += polygon(S, "lab-ink", 'style="fill:none"');
    // α and γ lie on the bisecting diagonal e, β and δ on f: their labels move off the lines
    out += angleLabels(S, angles, angleCls, false, [
      { x: 0, y: -12 },
      { x: -22, y: 0 },
      { x: 0, y: -12 },
      { x: -22, y: 0 },
    ]);
    const eMid = v.p < 50 ? (M.x + S[2].x) / 2 : (S[0].x + M.x) / 2;
    out += halo(text(eMid, M.y + 17, `e = ${cmText(v.e)}`, "lab-text-small lab-text-a", "middle"));
    out += halo(text(M.x + 7, (S[3].y + M.y) / 2 + 4, `f = ${cmText(v.f)}`, "lab-text-small lab-text-b", "start"));
    const center = centroid(...S);
    S.forEach((p, i) => (out += vertexLabel(p, center, QV[i], "lab-text", 15)));
    out += handle("C", S[2].x, S[2].y, "Ecke C: Diagonale e");
    out += handle("D", S[3].x, S[3].y, "Ecke D: Diagonale f");
    out += handle("M", M.x, M.y, "Kreuzungspunkt M der Diagonalen");
  } else {
    const f = PARA;
    const P = parallelogramPoints(v);
    const S = P.map((p) => scr(f, p));
    const h = v.b * sinD(v.alpha);
    out += text(16, 24, `A = a · h ≈ ${fmt(v.a)} cm · ${fmt(h, 2)} cm ≈ ${fmt(area, 2)} cm²`, "lab-text lab-text-big");
    out += text(16, 46, v.alpha === 90 ? "Rechteck: Die Höhe ist so lang wie b." : "α + β = 180°, α = γ und β = δ.", "lab-text-muted");
    const foot = scr(f, { x: P[3].x, y: 0 });
    if (v.hilfe === 1) {
      out += polygon([foot, scr(f, { x: P[3].x + v.a, y: 0 }), scr(f, { x: P[3].x + v.a, y: h }), S[3]], "lab-ghost");
      out += text(16, 64, "gestrichelt: Rechteck a · h, gleich groß wie das Parallelogramm", "lab-text-small");
    }
    out += polygon(S, "lab-fill-a");
    out += line(Math.min(S[0].x, foot.x) - 8, S[0].y, Math.max(S[1].x, foot.x) + 8, S[0].y, "lab-thin");
    out += line(S[3].x, S[3].y, foot.x, foot.y, "lab-dashed");
    if (Math.abs(foot.x - S[0].x) > 1) out += angleMark(foot, S[3], foot.x > S[0].x ? S[0] : S[1], 9, "lab-angle", true);
    const hLeft = v.alpha > 90 && foot.x > 40;
    out += halo(text(S[3].x + (hLeft ? -6 : 6), (S[3].y + foot.y) / 2, "h", "lab-text-small", hLeft ? "end" : "start"));
    out += line(S[0].x, S[0].y, S[1].x, S[1].y, "lab-side-a") + line(S[3].x, S[3].y, S[2].x, S[2].y, "lab-side-a");
    out += line(S[1].x, S[1].y, S[2].x, S[2].y, "lab-side-b") + line(S[3].x, S[3].y, S[0].x, S[0].y, "lab-side-b");
    if (v.alpha === 90) out += angleMark(S[0], S[1], S[3], 13, "lab-angle", true);
    out += angleLabels(S, angles, angleCls, true);
    out += halo(text((S[0].x + S[1].x) / 2, S[0].y + 36, `a = ${cmText(v.a)}`, "lab-text lab-text-a", "middle"));
    out += edgeLabel(S[1], S[2], `b = ${cmText(v.b)}`, "lab-text lab-text-b");
    const center = centroid(...S);
    S.forEach((p, i) => (out += vertexLabel(p, center, QV[i], "lab-text", 15)));
    out += handle("B", S[1].x, S[1].y, "Ecke B: Seite a");
    out += handle("D", S[3].x, S[3].y, "Ecke D: Winkel α und Seite b");
  }
  out += `</svg>`;
  return out;
}

const problemHandles: Record<string, { x?: string; y?: string; drag: (p: Pt, v: LabValues) => Partial<LabValues> }> = {
  B: { x: "a", drag: (p, v) => ({ a: (p.x - (v.fig === 2 ? PARA : TRAP).ax) / (v.fig === 2 ? PARA : TRAP).k }) },
  C: {
    x: "c",
    drag: (p, v) => (v.fig === 1 ? { e: (p.x - KITE.ax) / KITE.k } : { c: (p.x - TRAP.ax) / TRAP.k - v.s }),
  },
  D: {
    x: "s",
    y: "h",
    drag: (p, v) => {
      if (v.fig === 1) return { f: (2 * (KITE.base - p.y)) / KITE.k };
      if (v.fig === 2) {
        const A = scr(PARA, ORIGIN);
        const angle = direction(A, p);
        return { alpha: angle < 0 ? (p.x >= A.x ? 15 : 165) : angle, b: dist(p, A) / PARA.k };
      }
      return { s: (p.x - TRAP.ax) / TRAP.k, h: (TRAP.base - p.y) / TRAP.k };
    },
  },
  M: { x: "p", drag: (p, v) => ({ p: (100 * (p.x - KITE.ax)) / (KITE.k * v.e) }) },
};

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
  "quadrilateral-family": {
    render: quadrilateralFamily,
    handles: { A: familyDrag(0), B: familyDrag(1), C: familyDrag(2), D: familyDrag(3) },
  },
  "quadrilateral-construction": {
    render: quadrilateralConstruction,
    handles: { A: zugDrag(0), B: zugDrag(1), C: zugDrag(2) },
  },
  "quadrilateral-problems": {
    render: quadrilateralProblems,
    handles: problemHandles,
  },
};
