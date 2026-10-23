import { fmt, fracText, paren, point } from "../exercises/format";
import type { LabValues } from "../model/types";
import { arcPath, circle, clamp, clipped, handle, type LabView, line, open, Plot, polar, polygon, type Pt, text } from "./svg";

// ─── Vectors as plain pairs ────────────────────────────────────────────────

export interface Vec {
  x: number;
  y: number;
}

/** A pair; "+ 0" turns −0 into 0, so a turned vector never prints or compares as −0. */
export const vec = (x: number, y: number): Vec => ({ x: x + 0, y: y + 0 });
export const add = (a: Vec, b: Vec): Vec => vec(a.x + b.x, a.y + b.y);
export const sub = (a: Vec, b: Vec): Vec => vec(a.x - b.x, a.y - b.y);
export const neg = (a: Vec): Vec => vec(-a.x, -a.y);
export const norm = (a: Vec): number => Math.hypot(a.x, a.y);
export const same = (a: Vec, b: Vec, eps = 1e-9): boolean => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;
export const midpoint = (a: Vec, b: Vec): Vec => vec((a.x + b.x) / 2, (a.y + b.y) / 2);

/** cos of an angle in degrees, exact at the multiples of 30° and 90° (no 6·10⁻¹⁷ for cos 90°). */
export function cosDeg(deg: number): number {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0) return 1;
  if (r === 90 || r === 270) return 0;
  if (r === 180) return -1;
  if (r === 60 || r === 300) return 0.5;
  if (r === 120 || r === 240) return -0.5;
  return Math.cos((deg * Math.PI) / 180);
}

/** sin of an angle in degrees, exact at the multiples of 30° and 90°. */
export function sinDeg(deg: number): number {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0 || r === 180) return 0;
  if (r === 90) return 1;
  if (r === 270) return -1;
  if (r === 30 || r === 150) return 0.5;
  if (r === 210 || r === 330) return -0.5;
  return Math.sin((deg * Math.PI) / 180);
}

/**
 * P rotated about Z by phi degrees, counter-clockwise for phi > 0. The lab
 * draws any angle the way Zirkel and Geodreieck construct it; the lessons
 * compute coordinates only for ±90° and 180°.
 */
export function rotateAbout(p: Vec, z: Vec, phi: number): Vec {
  const c = cosDeg(phi);
  const s = sinDeg(phi);
  const d = sub(p, z);
  return vec(z.x + c * d.x - s * d.y, z.y + s * d.x + c * d.y);
}

/**
 * A vector turned by +90°, −90° or 180° the way grade 8 does it: (x; y)
 * becomes (−y; x), (y; −x) or (−x; −y). 270° is −90°, −180° is 180°.
 */
export function turn(v: Vec, phi: number): Vec {
  const r = ((phi % 360) + 360) % 360;
  if (r === 90) return vec(-v.y, v.x);
  if (r === 270) return vec(v.y, -v.x);
  if (r === 180) return vec(-v.x, -v.y);
  if (r === 0) return vec(v.x, v.y);
  throw new Error(`turn() only knows multiples of 90°, not ${phi}°`);
}

/** P turned about Z: Z ⊕ (ZP→ turned). */
export const turnAbout = (p: Vec, z: Vec, phi: number): Vec => add(z, turn(sub(p, z), phi));

/** The Umlaufsinn of a triangle: 1 counter-clockwise, −1 clockwise, 0 on a line. */
export function orientation(t: Vec[]): number {
  const d = (t[1].x - t[0].x) * (t[2].y - t[0].y) - (t[1].y - t[0].y) * (t[2].x - t[0].x);
  return Math.abs(d) < 1e-9 ? 0 : Math.sign(d);
}

// ─── Vectors in HTML ───────────────────────────────────────────────────────
// No CSS class of the app draws a column vector, so these carry inline
// styles (as in Mathematik 10, views-vektoren-abbildungen.ts).

const BRACKETS = "border-left:1.5px solid currentColor;border-right:1.5px solid currentColor";
const COLUMN_STYLE = `display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;padding:0.05em 0.38em;margin:0 0.12em;${BRACKETS};border-radius:0.65em / 50%`;

const cell = (value: number | string): string => (typeof value === "number" ? fmt(value) : value);

/** A column vector (x over y) in round brackets. */
export function vecHtml(x: number | string, y: number | string): string {
  return `<span class="vec" style="${COLUMN_STYLE}"><span>${cell(x)}</span><span>${cell(y)}</span></span>`;
}

/** A column vector of a pair, its coordinates rounded to `digits`. */
export function colHtml(v: Vec, digits = 2): string {
  return vecHtml(fmt(v.x, digits), fmt(v.y, digits));
}

/** A vector name with the arrow above it: vn("ZP") is ZP→. */
export function vn(name: string): string {
  const visible = name.replace(/<[^>]+>/g, "");
  const arrow = visible.length > 1 ? "⟶" : "→";
  return `<span class="vname" style="display:inline-block;position:relative;line-height:1;padding-top:0.42em"><span aria-hidden="true" style="position:absolute;left:0;right:0;top:0;text-align:center;font-size:0.7em;line-height:0.8">${arrow}</span>${name}</span>`;
}

/** A point as the school writes it: "P(3 | −2)". */
export const named = (name: string, p: Vec, digits = 2): string => `${name}${point(p.x, p.y, digits)}`;

/** A vector in words, for readouts and hints that show plain text: "x = 3, y = −1". */
export const coordsText = (v: Vec, digits = 2): string => `x = ${fmt(v.x, digits)}, y = ${fmt(v.y, digits)}`;

// ─── SVG helpers ───────────────────────────────────────────────────────────

/** Rough width of one character of a lab text class, as infoBox() estimates it. */
function charWidth(cls: string): number {
  return cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : cls.includes("muted") ? 6.7 : 7.3;
}

const n1 = (value: number): string => value.toFixed(1);

/** A thin line of a class whose CSS stroke is too heavy for brackets and small arrows. */
function thin(x1: number, y1: number, x2: number, y2: number, cls: string, width = 1.2, dash = ""): string {
  return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${cls}" style="stroke-width:${width}${dash ? `;stroke-dasharray:${dash}` : ""}" />`;
}

/** Text in the stage accent colour. */
function accentText(x: number, y: number, content: string, cls = "lab-text lab-text-big", anchor: "start" | "middle" | "end" = "start"): string {
  return text(x, y, content, cls, anchor).replace("<text ", '<text style="fill:var(--accent)" ');
}

/** The stroke class in the colour of a text class, for the arrows over names. */
function strokeFor(cls: string): string {
  if (cls.includes("lab-text-a")) return "lab-side-a";
  if (cls.includes("lab-text-b")) return "lab-side-b";
  if (cls.includes("lab-text-ok")) return "lab-side-ok";
  return "lab-ink";
}

/** A vector name with a small arrow above it; returns the drawing and its width. */
function svgName(x: number, baseline: number, name: string, cls: string): { svg: string; w: number } {
  const letters = name.replace(/'/g, "").length;
  const w = letters * (cls.includes("small") ? 7 : 8.4) + (name.includes("'") ? 3 : 0);
  const y = baseline - (cls.includes("small") ? 11 : 13);
  const stroke = strokeFor(cls);
  const svg =
    text(x, baseline, name, cls) +
    thin(x + 0.5, y, x + w, y, stroke) +
    thin(x + w - 3.5, y - 2.5, x + w, y, stroke) +
    thin(x + w - 3.5, y + 2.5, x + w, y, stroke);
  return { svg, w: w + 2 };
}

/** Round brackets around a block from y0 to y1. */
function brackets(x0: number, x1: number, y0: number, y1: number): string {
  const mid = (y0 + y1) / 2;
  const curve = (x: number, bulge: number) =>
    `<path d="M${n1(x + bulge)} ${n1(y0)} Q${n1(x - bulge)} ${n1(mid)} ${n1(x + bulge)} ${n1(y1)}" class="lab-ink" style="stroke-width:1.2;fill:none" />`;
  return curve(x0 + 2, 2.5) + curve(x1 - 2, -2.5);
}

/** One piece of an equation in the side panel: text, a vector name or a column vector. */
type Piece = { t: string; cls?: string } | { n: string; cls?: string } | { v: [string, string]; cls?: string };

/** An equation laid out from left to right around the middle line y. */
function equation(x: number, y: number, pieces: Piece[], base = "lab-text"): string {
  let out = "";
  let cx = x;
  for (const piece of pieces) {
    const cls = piece.cls ?? base;
    const cw = charWidth(cls);
    if ("t" in piece) {
      out += text(cx, y + 4, piece.t, cls);
      cx += piece.t.length * cw;
    } else if ("n" in piece) {
      const name = svgName(cx, y + 4, piece.n, cls);
      out += name.svg;
      cx += name.w;
    } else {
      const w = Math.max(piece.v[0].length, piece.v[1].length) * cw + 14;
      out += text(cx + w / 2, y - 2, piece.v[0], cls, "middle");
      out += text(cx + w / 2, y + 13, piece.v[1], cls, "middle");
      out += brackets(cx, cx + w, y - 14, y + 17);
      cx += w + 3;
    }
  }
  return out;
}

const col = (v: Vec, digits = 2, cls?: string): Piece => ({ v: [fmt(v.x, digits), fmt(v.y, digits)], cls });

type Tone = "a" | "b" | "ok" | "ghost";

const TONE_LINE: Record<Tone, string> = { a: "lab-side-a", b: "lab-side-b", ok: "lab-side-ok", ghost: "lab-ghost" };
const TONE_HEAD: Record<Tone, string> = { a: "lab-bar-a", b: "lab-bar-b", ok: "lab-bar-ok", ghost: "lab-bar-ghost" };

/** A vector arrow in SVG units with a filled head in the colour of its tone. */
function vArrow(from: Pt, to: Pt, tone: Tone, width = 2.6, dash = ""): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 2) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(11, len * 0.45);
  const bx = to.x - ux * head;
  const by = to.y - uy * head;
  const px = -uy * head * 0.45;
  const py = ux * head * 0.45;
  return (
    `<line x1="${n1(from.x)}" y1="${n1(from.y)}" x2="${n1(bx)}" y2="${n1(by)}" class="${TONE_LINE[tone]}" style="stroke-width:${width}${dash ? `;stroke-dasharray:${dash}` : ""}" />` +
    polygon(
      [
        { x: to.x, y: to.y },
        { x: bx + px, y: by + py },
        { x: bx - px, y: by - py },
      ],
      TONE_HEAD[tone],
    )
  );
}

/** A label inside the plot box, beside the point it names. */
function pointLabel(plot: Plot, at: Pt, content: string, cls = "lab-text-small", dx = 9, dy = -9): string {
  const width = content.length * charWidth(cls);
  let x = at.x + dx;
  if (x + width > plot.box.x + plot.box.w - 2) x = at.x - Math.abs(dx) - width;
  x = clamp(x, plot.box.x + 2, plot.box.x + plot.box.w - width - 2);
  const y = clamp(at.y + dy, plot.box.y + 12, plot.box.y + plot.box.h - 4);
  return text(x, y, content, cls);
}

/** A vertex label pushed away from the centre of its figure, kept inside the plot. */
function vertexLabel(plot: Plot, at: Pt, centre: Pt, content: string, cls: string, gap = 14): string {
  const d = Math.hypot(at.x - centre.x, at.y - centre.y) || 1;
  const x = clamp(at.x + ((at.x - centre.x) / d) * gap, plot.box.x + 8, plot.box.x + plot.box.w - 8);
  const y = clamp(at.y + ((at.y - centre.y) / d) * gap + 4, plot.box.y + 12, plot.box.y + plot.box.h - 4);
  return text(x, y, content, cls, "middle");
}

/** A small circular arrow that shows the Umlaufsinn of a figure around its centre. */
function turnArrow(c: Pt, r: number, ccw: boolean, tone: Tone): string {
  const a0 = ccw ? 200 : -20;
  const a1 = ccw ? 470 : -290;
  const end = polar(c.x, c.y, r, a1);
  // the head points along the circle at the end of the arc
  const t = ((ccw ? a1 + 90 : a1 - 90) * Math.PI) / 180;
  const tip = { x: end.x + 5.5 * Math.cos(t), y: end.y - 5.5 * Math.sin(t) };
  const side = { x: -Math.sin(t) * 3.6, y: -Math.cos(t) * 3.6 };
  return (
    `<path d="${arcPath(c.x, c.y, r, a0, a1)}" class="${TONE_LINE[tone]}" style="fill:none;stroke-width:1.6;stroke-dasharray:none" />` +
    polygon([tip, { x: end.x + side.x, y: end.y + side.y }, { x: end.x - side.x, y: end.y - side.y }], TONE_HEAD[tone])
  );
}

const centroid = (pts: Pt[]): Pt => ({ x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length });

/** The coordinate system of the stage: a square from −6 to 6 left of the side panel. */
const BOX = { x: 14, y: 14, w: 312, h: 312 };
const plane = () => new Plot(-6, 6, -6, 6, BOX);
/** Left edge of the side panel. */
const PX = 342;

/** A line through the plot with a point and a direction, also a vertical one. */
function lineThrough(plot: Plot, p: Vec, dir: Vec, cls: string): string {
  if (Math.abs(dir.x) < 1e-12) return line(plot.X(p.x), plot.Y(plot.ymin), plot.X(p.x), plot.Y(plot.ymax), cls);
  const m = dir.y / dir.x;
  return plot.lineThrough(m, p.y - m * p.x, cls);
}

/** "4 − (−2)": a difference of two coordinates as it is written down. */
const diff = (b: number, a: number): string => `${fmt(b)} − ${paren(a)}`;

// ─── 2.1 Die Drehung ───────────────────────────────────────────────────────

/** The triangle ABC the rotation lab turns (scalene, so only one congruence maps it onto a copy). */
export const TRIANGLE: Vec[] = [vec(2, 1), vec(5, 1), vec(3, 3)];
/** Dreieck 2 is ABC turned about this centre by this angle. */
export const ROT_CENTRE = vec(0, -1);
export const ROT_ANGLE = 90;
/** Dreieck 1: ABC mirrored at the line y = −x, so its Umlaufsinn is the other one. No rotation reaches it. */
export const TARGET_MIRRORED: Vec[] = TRIANGLE.map((p) => vec(-p.y, -p.x));
/** Dreieck 2: ABC turned by 90° about (0 | −1). */
export const TARGET_ROTATED: Vec[] = TRIANGLE.map((p) => rotateAbout(p, ROT_CENTRE, ROT_ANGLE));
/** The two dashed triangles of the lab, Dreieck 1 and Dreieck 2. */
export const TARGETS: Vec[][] = [TARGET_MIRRORED, TARGET_ROTATED];

const VERTEX = ["A", "B", "C"];
const SUBSCRIPT = ["₁", "₂"];

/** The image A'B'C' of the lab's triangle under the rotation about Z with φ. */
export function rotatedTriangle(v: LabValues): Vec[] {
  return TRIANGLE.map((p) => rotateAbout(p, vec(v.zx, v.zy), v.phi));
}

/** Which corners of the image lie on the corresponding corners of a target. */
export function cornerHits(image: Vec[], target: Vec[]): boolean[] {
  return image.map((p, i) => same(p, target[i], 1e-6));
}

export const reachesTarget = (v: LabValues, k: number): boolean => cornerHits(rotatedTriangle(v), TARGETS[k]).every(Boolean);

/** True when φ is no multiple of 360°, so the rotation moves the plane. */
export const turns = (phi: number): boolean => Math.abs(phi % 360) > 1e-9;

/** A corner of ABC that lies on Z, the Fixpunkt of a real rotation; −1 when none. */
export function fixedCorner(v: LabValues): number {
  return TRIANGLE.findIndex((p) => same(p, vec(v.zx, v.zy)));
}

/** The rotation angle in words with its partner of the other sign. */
export function angleText(phi: number): string {
  if (!turns(phi)) return phi === 0 ? "0°: jeder Punkt bleibt, wo er ist" : `${fmt(phi)}°: eine volle Umdrehung, wie 0°`;
  const partner = phi > 0 ? phi - 360 : phi + 360;
  return `${fmt(phi)}° (${phi > 0 ? "gegen den" : "im"} Uhrzeigersinn), dieselbe Drehung wie ${fmt(partner)}°`;
}

/**
 * The angle between [ZA and [ZA' as the Bavarian convention names it: an
 * angle ∢XYZ runs counter-clockwise from [YX to [YZ, so a turn by −90° gives
 * ∢A'ZA = 90° (and ∢AZA' = 270°). The panel names the one up to 180°.
 */
export function angleAtZ(phi: number): string {
  const ccw = ((phi % 360) + 360) % 360;
  return ccw <= 180 ? `∢AZA' = ${fmt(ccw)}°` : `∢A'ZA = ${fmt(360 - ccw)}°`;
}

/** What the image does with the two dashed triangles. */
export function targetText(v: LabValues): string {
  const image = rotatedTriangle(v);
  for (const k of [0, 1]) {
    if (cornerHits(image, TARGETS[k]).every(Boolean)) return `A'B'C' liegt genau auf Dreieck ${k + 1}`;
  }
  for (const k of [0, 1]) {
    const hits = cornerHits(image, TARGETS[k]);
    const on = VERTEX.filter((_, i) => hits[i]).map((n) => `${n}'`);
    if (on.length > 0) {
      const off = VERTEX.filter((_, i) => !hits[i]).map((n) => `${n}'`);
      return `${on.join(" und ")} auf Dreieck ${k + 1}, ${off.join(" und ")} nicht`;
    }
  }
  return "noch keines erreicht";
}

function rotationView(v: LabValues): string {
  const plot = plane();
  const z = vec(v.zx, v.zy);
  const Z = plot.P(z.x, z.y);
  const image = rotatedTriangle(v);
  const S = TRIANGLE.map((p) => plot.P(p.x, p.y));
  const I = image.map((p) => plot.P(p.x, p.y));
  const moving = turns(v.phi);
  let out = open("Drehung des Dreiecks ABC um ein Drehzentrum Z, zwei gestrichelte Zieldreiecke");
  out += plot.clip("clip-dr1") + plot.grid(1, 2);

  // the perpendicular bisectors of [AA_k], [BB_k], [CC_k] for one target
  let helpers = "";
  if (v.hilfe === 1 || v.hilfe === 2) {
    const target = TARGETS[v.hilfe - 1];
    TRIANGLE.forEach((p, i) => {
      const q = target[i];
      const m = midpoint(p, q);
      helpers += thin(plot.X(p.x), plot.Y(p.y), plot.X(q.x), plot.Y(q.y), "lab-thin", 1, "2 3");
      helpers += lineThrough(plot, m, vec(-(q.y - p.y), q.x - p.x), "lab-curve-c");
      helpers += circle(plot.X(m.x), plot.Y(m.y), 2.6, "lab-dot-small");
    });
  }
  out += clipped("clip-dr1", helpers);

  // the two dashed targets with their Umlaufsinn
  const reached = [0, 1].map((k) => cornerHits(image, TARGETS[k]).every(Boolean));
  TARGETS.forEach((target, k) => {
    const T = target.map((p) => plot.P(p.x, p.y));
    const c = centroid(T);
    out += polygon(T, reached[k] ? "lab-fill-ok" : "lab-ghost", reached[k] ? 'style="stroke-dasharray:6 4"' : 'style="fill:none"');
    out += turnArrow(c, 8, orientation(target) > 0, reached[k] ? "ok" : "ghost");
    if (!reached[k]) T.forEach((p, i) => (out += vertexLabel(plot, p, c, `${VERTEX[i]}${SUBSCRIPT[k]}`, "lab-text-small")));
  });

  // the triangle ABC
  const cS = centroid(S);
  out += polygon(S, "lab-fill-a");
  out += turnArrow(cS, 8, true, "a");

  // the circular arcs of the construction: P' on the circle about Z through P
  const rA = norm(sub(TRIANGLE[0], z));
  let arcs = "";
  if (moving) {
    TRIANGLE.forEach((p, i) => {
      const d = sub(p, z);
      const r = norm(d) * plot.sx;
      if (r < 1) return;
      const a0 = (Math.atan2(d.y, d.x) * 180) / Math.PI;
      arcs +=
        Math.abs(v.phi) >= 359.999
          ? circle(Z.x, Z.y, r, "lab-ghost")
          : `<path d="${arcPath(Z.x, Z.y, r, a0, a0 + v.phi)}" class="lab-ghost" style="stroke-width:${i === 0 ? 2 : 1.3}" />`;
    });
    if (rA > 1e-9) {
      arcs += thin(Z.x, Z.y, S[0].x, S[0].y, "lab-ink", 1.3) + thin(Z.x, Z.y, I[0].x, I[0].y, "lab-ink", 1.3);
    }
  }
  out += clipped("clip-dr1", arcs);
  if (moving && rA > 1e-9) {
    const a0 = (Math.atan2(TRIANGLE[0].y - z.y, TRIANGLE[0].x - z.x) * 180) / Math.PI;
    const small = Math.min(26, (rA * plot.sx) / 2);
    out += `<path d="${arcPath(Z.x, Z.y, small, a0, a0 + v.phi)}" class="lab-angle" style="stroke:var(--accent);stroke-width:2" />`;
    const mid = polar(Z.x, Z.y, small + 11, a0 + v.phi / 2);
    if (plot.contains(plot.invX(mid.x), plot.invY(mid.y))) out += accentText(mid.x, mid.y + 4, "φ", "lab-text", "middle");
  }

  // the image A'B'C'
  out += clipped("clip-dr1", polygon(I, "lab-fill-b", 'style="fill-opacity:0.55"'));
  const cI = centroid(I);
  if (plot.contains(plot.invX(cI.x), plot.invY(cI.y)) && moving) out += turnArrow(cI, 8, true, "b");
  S.forEach((p, i) => (out += circle(p.x, p.y, 4, "lab-point-a") + vertexLabel(plot, p, cS, VERTEX[i], "lab-text lab-text-a")));
  image.forEach((p, i) => {
    if (!plot.contains(p.x, p.y)) return;
    out += circle(I[i].x, I[i].y, 4, "lab-point-b");
    if (moving) out += vertexLabel(plot, I[i], cI, `${VERTEX[i]}'`, "lab-text lab-text-b");
  });

  // the centre
  out += circle(Z.x, Z.y, 4.5, "lab-point");
  out += pointLabel(plot, Z, "Z", "lab-text", 10, 17);

  // the side panel: the rule, live
  const whole = Math.abs(rA - Math.round(rA)) < 1e-9;
  out += text(PX, 30, `Drehung um Z${point(z.x, z.y, 1)}`, "lab-text");
  out += accentText(PX, 56, `φ = ${fmt(v.phi)}°`);
  out += text(PX, 76, !moving ? (v.phi === 0 ? "keine Drehung" : "volle Umdrehung") : v.phi > 0 ? "gegen den Uhrzeigersinn" : "im Uhrzeigersinn", "lab-text-small");
  if (moving) out += text(PX, 94, `dieselbe Drehung wie ${fmt(v.phi > 0 ? v.phi - 360 : v.phi + 360)}°`, "lab-text-small");
  out += text(PX, 124, "Abbildungsvorschrift:", "lab-text-muted");
  out += text(PX, 144, `|ZA'| = |ZA| ${whole ? "=" : "≈"} ${fmt(rA, 2)} LE`, "lab-text-small");
  if (moving) out += text(PX, 162, angleAtZ(v.phi), "lab-text-small");
  out += text(PX, 192, "Zieldreiecke:", "lab-text-muted");
  [0, 1].forEach((k) => {
    const hits = cornerHits(image, TARGETS[k]);
    const marks = VERTEX.map((n, i) => `${n}' ${hits[i] ? "✓" : "✗"}`).join("  ");
    out += text(PX, 212 + 20 * k, `${k + 1}: ${marks}`, reached[k] ? "lab-text lab-text-ok" : "lab-text-small");
  });
  const fixed = fixedCorner(v);
  if (moving && fixed >= 0) out += text(PX, 266, `Fixpunkt: ${VERTEX[fixed]} = Z`, "lab-text lab-text-ok");
  out += text(PX, 300, "Ziehe Z und A'.", "lab-text-small");

  // handles: the centre, and A' to set the angle
  out += handle("Z", Z.x, Z.y, "Drehzentrum Z");
  if (plot.contains(image[0].x, image[0].y) && rA > 0.4) out += handle("Abild", I[0].x, I[0].y, "Bildpunkt A' (Drehwinkel)", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

/** The drag of A' around Z: the angle from ZA to the pointer, kept near the current φ. */
function rotationDrag(p: Pt, v: LabValues): Partial<LabValues> {
  const plot = plane();
  const za = sub(TRIANGLE[0], vec(v.zx, v.zy));
  const to = sub(vec(plot.invX(p.x), plot.invY(p.y)), vec(v.zx, v.zy));
  if (norm(za) < 1e-9 || norm(to) < 0.3) return {};
  const raw = ((Math.atan2(to.y, to.x) - Math.atan2(za.y, za.x)) * 180) / Math.PI;
  let best = raw;
  for (const k of [-2, -1, 0, 1, 2]) {
    const candidate = raw + 360 * k;
    if (Math.abs(candidate - v.phi) < Math.abs(best - v.phi)) best = candidate;
  }
  return { phi: clamp(best, -360, 360) };
}

// ─── 2.2 Punktspiegelung und Drehsymmetrie ─────────────────────────────────

/** The arm counts the lab offers; each gives a whole smallest angle. */
export const ARM_COUNTS = [2, 3, 4, 5, 6, 8];
export const PATTERNS = ["gleiche Arme", "Windrad (Arme mit Haken)", "zwei Farben abwechselnd"];

/** The smallest angle 0° < α ≤ 360° that maps the figure onto itself; 360° when it is not drehsymmetrisch. */
export function symmetryAngle(n: number, pattern: number): number {
  if (pattern === 2) return n % 2 === 0 ? 720 / n : 360;
  return 360 / n;
}

/** True when the rotation by φ maps the figure onto itself (also for 0° and 360°). */
export function covers(n: number, pattern: number, phi: number): boolean {
  const k = phi / symmetryAngle(n, pattern);
  return Math.abs(k - Math.round(k)) < 1e-9;
}

export const isRotationSymmetric = (n: number, pattern: number): boolean => symmetryAngle(n, pattern) < 360;
export const isPointSymmetric = (n: number, pattern: number): boolean => covers(n, pattern, 180);

/** The arm whose place arm 1 takes after the rotation by φ, or 0 when it lands between two arms. */
export function landingArm(n: number, phi: number): number {
  const k = (phi * n) / 360;
  if (Math.abs(k - Math.round(k)) > 1e-9) return 0;
  return (((Math.round(k) % n) + n) % n) + 1;
}

const STAR = { x: 166, y: 172, R: 126, r0: 13 };

/** The outline of arm k (0-based) of the figure, turned by `extra` degrees. */
function armPoints(n: number, pattern: number, k: number, extra: number): Pt[] {
  const theta = 90 + (k * 360) / n + extra;
  const half = Math.min(15, 110 / n);
  const { x, y, R, r0 } = STAR;
  if (pattern === 1) {
    // a pinwheel blade: straight on one side, a hook on the other
    return [polar(x, y, r0, theta - 50), polar(x, y, R, theta), polar(x, y, R * 0.66, theta + 1.7 * half), polar(x, y, r0 * 1.4, theta + 40)];
  }
  return [polar(x, y, r0, theta - 55), polar(x, y, R * 0.58, theta - half), polar(x, y, R, theta), polar(x, y, R * 0.58, theta + half), polar(x, y, r0, theta + 55)];
}

/** Whether the rotation by φ maps the figure onto itself, in words. */
export function symmetryText(n: number, pattern: number, phi: number): string {
  if (phi === 0) return "keine Drehung: jede Figur deckt sich";
  if (phi === 360) return "volle Umdrehung: zählt nicht mit";
  if (covers(n, pattern, phi)) return "ja, die gedrehte Figur deckt die Figur genau";
  if (pattern === 2 && landingArm(n, phi) > 0) return "nein: Die Arme liegen aufeinander, aber die Farben passen nicht.";
  return "nein";
}

function pointSymmetryView(v: LabValues): string {
  const { n, muster: pattern, phi } = v;
  const { x, y, R } = STAR;
  let out = open("Eine Figur mit mehreren Armen und ihre um den Drehwinkel gedrehte Kopie");
  out += `<rect x="14" y="14" width="312" height="312" rx="12" class="lab-plot-bg" />`;
  // the figure
  for (let k = 0; k < n; k++) {
    const cls = pattern === 2 ? (k % 2 === 0 ? "lab-fill-a" : "lab-fill-b") : "lab-shape";
    out += polygon(armPoints(n, pattern, k, 0), cls);
  }
  const tip1 = polar(x, y, R, 90);
  out += text(tip1.x - 12, tip1.y + 4, "1", "lab-text", "end");
  // the turned copy, dashed on top
  const fits = covers(n, pattern, phi);
  const real = phi > 0 && phi < 360;
  for (let k = 0; k < n; k++) {
    const pts = armPoints(n, pattern, k, phi);
    const style =
      fits && real
        ? 'style="fill:none;stroke-width:2.4;stroke-dasharray:6 4"'
        : pattern === 2
          ? 'style="fill:none;stroke-width:2.2;stroke-dasharray:6 4"'
          : 'style="fill:none;stroke:var(--accent);stroke-width:2.2;stroke-dasharray:6 4"';
    const cls = fits && real ? "lab-ok-stroke" : pattern === 2 ? (k % 2 === 0 ? "lab-side-a" : "lab-side-b") : "lab-ink";
    out += polygon(pts, cls, style);
  }
  // the angle from arm 1 to its image
  if (real) {
    out += `<path d="${arcPath(x, y, 34, 90, 90 + phi)}" class="lab-angle" style="stroke:var(--accent);stroke-width:2" />`;
    const mid = polar(x, y, 48, 90 + phi / 2);
    out += accentText(mid.x, mid.y + 4, "φ", "lab-text", "middle");
  }
  out += circle(x, y, 4.5, "lab-point");
  out += text(x + 8, y + 16, "Z", "lab-text");
  const tipImage = polar(x, y, R, 90 + phi);
  const away = polar(x, y, R + 15, 90 + phi);
  out += accentText(away.x, away.y + 4, "1'", "lab-text", "middle");

  // the side panel
  out += text(PX, 30, `${n} Arme: ${pattern === 0 ? "alle gleich" : pattern === 1 ? "Windrad" : "zwei Farben"}`, "lab-text");
  out += accentText(PX, 58, `φ = ${fmt(phi)}°`);
  out += text(PX, 78, phi === 0 ? "keine Drehung" : phi === 360 ? "eine volle Umdrehung" : `= ${fracText(phi, 360)} Umdrehung`, "lab-text-small");
  const arm = landingArm(n, phi);
  out += text(PX, 108, "Arm 1 landet", "lab-text-muted");
  out += text(PX, 126, arm > 0 ? `auf dem Platz von Arm ${arm}` : "zwischen zwei Armen", "lab-text-small");
  out += text(PX, 156, "Deckt sich die Figur?", "lab-text-muted");
  const verdict = !real ? ["zählt nicht (0° oder 360°)", "lab-text-small"] : fits ? ["ja", "lab-text lab-text-ok"] : ["nein", "lab-text lab-text-bad"];
  out += text(PX, 176, verdict[0], verdict[1]);
  if (pattern === 2 && arm > 0 && !fits) out += text(PX, 194, "Die Farben passen nicht.", "lab-text-small");
  out += text(PX, 300, "Ziehe die Spitze 1'.", "lab-text-small");
  out += handle("tip", tipImage.x, tipImage.y, "Spitze des gedrehten Arms 1 (Drehwinkel)", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

/** The drag of the turned arm 1: the angle of the pointer seen from Z, counted from arm 1, near the current φ. */
function symmetryDrag(p: Pt, v: LabValues): Partial<LabValues> {
  const dx = p.x - STAR.x;
  const dy = STAR.y - p.y;
  if (Math.hypot(dx, dy) < 8) return {};
  const raw = ((((Math.atan2(dy, dx) * 180) / Math.PI - 90) % 360) + 360) % 360;
  let best = raw;
  for (const k of [-1, 1]) {
    const candidate = raw + 360 * k;
    if (candidate >= -1 && candidate <= 361 && Math.abs(candidate - v.phi) < Math.abs(best - v.phi)) best = candidate;
  }
  return { phi: clamp(best, 0, 360) };
}

// ─── 2.3 Vektoren drehen ───────────────────────────────────────────────────

/** Mode 0: the marked vector w→, the +90° image of (5; 2). */
export const W_TARGET = vec(-2, 5);
/** Mode 1: P is fixed, the learner moves Z until P' lands on T. */
export const P_FIXED = vec(4, 1);
export const T_POINT = vec(-1, 2);
/** Mode 2: A is fixed, the learner moves B until the corner C of the square ABCD lands on T. */
export const A_SQUARE = vec(-4, -2);
export const T_CORNER = vec(2, 2);

export interface VectorLab {
  mode: number;
  phi: number;
  /** The vector before the turn: v→, ZP→ or AB→. */
  before: Vec;
  /** The turned vector: v'→, ZP'→ or AD→. */
  after: Vec;
  /** Where both arrows start: O, Z or A. */
  foot: Vec;
  /** The points the turn makes: [] for a free vector, [P'] or [C, D]. */
  result: Vec[];
}

/** The pieces of the vector lab in its three modes. */
export function vectorLab(v: LabValues): VectorLab {
  if (v.mode === 1) {
    const z = vec(v.zx, v.zy);
    const before = sub(P_FIXED, z);
    const after = turn(before, v.phi);
    return { mode: 1, phi: v.phi, before, after, foot: z, result: [add(z, after)] };
  }
  if (v.mode === 2) {
    const b = vec(v.bx, v.by);
    const before = sub(b, A_SQUARE);
    const after = turn(before, 90);
    return { mode: 2, phi: 90, before, after, foot: A_SQUARE, result: [add(b, after), add(A_SQUARE, after)] };
  }
  const before = vec(v.vx, v.vy);
  return { mode: 0, phi: v.phi, before, after: turn(before, v.phi), foot: vec(0, 0), result: [] };
}

/** The rule of the chosen angle, as the side panel shows it. */
const RULE: Record<number, string> = { 90: "+90°: (x; y) wird (−y; x)", [-90]: "−90°: (x; y) wird (y; −x)", 180: "180°: (x; y) wird (−x; −y)" };

/** Dashed legs of a vector's slope triangle with their lengths: first along x, then along y. */
function legs(plot: Plot, from: Vec, d: Vec, cls: string): string {
  if (d.x === 0 && d.y === 0) return "";
  const A = plot.P(from.x, from.y);
  const K = plot.P(from.x + d.x, from.y);
  const B = plot.P(from.x + d.x, from.y + d.y);
  let out = "";
  if (d.x !== 0) {
    out += thin(A.x, A.y, K.x, K.y, "lab-ink", 1.2, "4 3");
    out += text((A.x + K.x) / 2, clamp(K.y + (d.y > 0 ? 15 : -7), 26, 322), fmt(d.x, 1), cls, "middle");
  }
  if (d.y !== 0) {
    out += thin(K.x, K.y, B.x, B.y, "lab-ink", 1.2, "4 3");
    out += text(clamp(K.x + (d.x >= 0 ? 6 : -6), 22, 320), (K.y + B.y) / 2 + 4, fmt(d.y, 1), cls, d.x >= 0 ? "start" : "end");
  }
  return out;
}

function vectorRotationView(v: LabValues): string {
  const plot = plane();
  const lab = vectorLab(v);
  const foot = plot.P(lab.foot.x, lab.foot.y);
  const tipBefore = add(lab.foot, lab.before);
  const tipAfter = add(lab.foot, lab.after);
  const B = plot.P(tipBefore.x, tipBefore.y);
  const Bt = plot.P(tipAfter.x, tipAfter.y);
  let out = open("Ein Vektor und sein um 90°, −90° oder 180° gedrehtes Bild im Koordinatensystem");
  out += plot.clip("clip-dr3") + plot.grid(1, 2);
  const zero = lab.before.x === 0 && lab.before.y === 0;
  const angleLabel = lab.phi === 90 ? "+90°" : lab.phi === -90 ? "−90°" : "180°";
  const slopes = clipped("clip-dr3", legs(plot, lab.foot, lab.before, "lab-text-small lab-text-a") + legs(plot, lab.foot, lab.after, "lab-text-small lab-text-b"));

  if (lab.mode === 0) {
    const W = plot.P(W_TARGET.x, W_TARGET.y);
    const hit = same(lab.after, W_TARGET) && lab.phi === 90;
    out += vArrow(foot, W, "ok", 2.2, "6 4");
    out += pointLabel(plot, W, "w", "lab-text lab-text-ok", -18, 2);
    out += slopes;
    if (!zero) {
      out += clipped("clip-dr3", vArrow(foot, B, "a") + vArrow(foot, Bt, hit ? "ok" : "b"));
      out += pointLabel(plot, B, "v", "lab-text lab-text-a", 8, -6);
      if (plot.contains(tipAfter.x, tipAfter.y)) out += pointLabel(plot, Bt, "v'", hit ? "lab-text lab-text-ok" : "lab-text lab-text-b", 8, -6);
    }
    out += text(PX, 26, `Drehung um ${angleLabel}`, "lab-text lab-text-big");
    out += equation(PX, 62, [{ n: "v", cls: "lab-text lab-text-a" }, { t: " = " }, col(lab.before, 0, "lab-text lab-text-a")]);
    out += text(PX, 104, RULE[lab.phi], "lab-text-small");
    out += equation(PX, 140, [{ n: "v'", cls: "lab-text lab-text-b" }, { t: " = " }, col(lab.after, 0, "lab-text lab-text-b")]);
    out += equation(PX, 196, [{ n: "w", cls: "lab-text lab-text-ok" }, { t: " = " }, col(W_TARGET, 0, "lab-text lab-text-ok")]);
    if (hit || zero) out += text(PX, 236, hit ? "v' = w: getroffen!" : "Nullvektor: nichts zu drehen", hit ? "lab-text lab-text-ok" : "lab-text-small");
    out += text(PX, 300, "Ziehe die Spitze von v.", "lab-text-small");
    out += handle("V", B.x, B.y, "Spitze des Vektors v");
  } else if (lab.mode === 1) {
    const T = plot.P(T_POINT.x, T_POINT.y);
    const image = lab.result[0];
    const hit = same(image, T_POINT);
    out += circle(T.x, T.y, 9, "lab-target");
    out += pointLabel(plot, T, "T", "lab-text lab-text-ok", 11, 16);
    out += slopes;
    if (!zero) out += clipped("clip-dr3", vArrow(foot, B, "a") + vArrow(foot, Bt, hit ? "ok" : "b"));
    out += circle(B.x, B.y, 5, "lab-point-a");
    out += pointLabel(plot, B, "P", "lab-text lab-text-a", 9, -9);
    const inside = plot.contains(image.x, image.y);
    if (inside) {
      out += circle(Bt.x, Bt.y, 5, hit ? "lab-point-ok" : "lab-point-b");
      out += pointLabel(plot, Bt, "P'", hit ? "lab-text lab-text-ok" : "lab-text lab-text-b", 9, -9);
    }
    out += circle(foot.x, foot.y, 4.5, "lab-point");
    out += pointLabel(plot, foot, "Z", "lab-text", 9, 17);
    out += text(PX, 26, `Drehung um Z, ${angleLabel}`, "lab-text lab-text-big");
    out += equation(PX, 60, [{ n: "ZP", cls: "lab-text lab-text-a" }, { t: " = " }, { v: [diff(P_FIXED.x, lab.foot.x), diff(P_FIXED.y, lab.foot.y)] }]);
    out += equation(PX + 34, 102, [{ t: "= " }, col(lab.before, 1, "lab-text lab-text-a")]);
    out += text(PX, 140, RULE[lab.phi], "lab-text-small");
    out += equation(PX, 174, [{ n: "ZP'", cls: "lab-text lab-text-b" }, { t: " = " }, col(lab.after, 1, "lab-text lab-text-b")]);
    out += text(PX, 214, "P' = Z ⊕ ZP'→:", "lab-text-muted");
    out += text(PX, 236, named("P'", image, 1), hit ? "lab-text lab-text-ok lab-text-big" : "lab-text lab-text-b lab-text-big");
    if (hit || !inside) out += text(PX, 258, hit ? "P' liegt auf T!" : "P' liegt außerhalb des Bildes.", hit ? "lab-text lab-text-ok" : "lab-text-small");
    out += text(PX, 300, "Ziehe das Drehzentrum Z.", "lab-text-small");
    out += handle("Z", foot.x, foot.y, "Drehzentrum Z");
  } else {
    const [c, d] = lab.result;
    const T = plot.P(T_CORNER.x, T_CORNER.y);
    const hit = same(c, T_CORNER) && !zero;
    const C = plot.P(c.x, c.y);
    const D = plot.P(d.x, d.y);
    out += circle(T.x, T.y, 9, "lab-target");
    out += pointLabel(plot, T, "T", "lab-text lab-text-ok", 11, 16);
    if (!zero) {
      out += clipped("clip-dr3", polygon([foot, B, C, D], hit ? "lab-fill-ok" : "lab-shape", 'style="fill-opacity:0.6"'));
      out += slopes;
      out += clipped("clip-dr3", vArrow(foot, B, "a") + vArrow(foot, D, "b") + vArrow(B, C, "b", 2, "5 4"));
    }
    out += circle(foot.x, foot.y, 4.5, "lab-point-a");
    out += pointLabel(plot, foot, "A", "lab-text lab-text-a", -18, 16);
    out += pointLabel(plot, B, "B", "lab-text lab-text-a", 10, 16);
    if (!zero) {
      if (plot.contains(c.x, c.y)) out += circle(C.x, C.y, 4.5, hit ? "lab-point-ok" : "lab-point-b") + pointLabel(plot, C, "C", hit ? "lab-text lab-text-ok" : "lab-text lab-text-b", 10, -8);
      if (plot.contains(d.x, d.y)) out += circle(D.x, D.y, 4.5, "lab-point-b") + pointLabel(plot, D, "D", "lab-text lab-text-b", -18, -8);
    }
    out += text(PX, 26, "Quadrat ABCD", "lab-text lab-text-big");
    out += text(PX, 44, "gegen den Uhrzeigersinn", "lab-text-small");
    out += equation(PX, 76, [{ n: "AB", cls: "lab-text lab-text-a" }, { t: " = " }, col(lab.before, 0, "lab-text lab-text-a")]);
    out += text(PX, 114, "um +90° gedreht:", "lab-text-small");
    out += equation(PX, 148, [{ n: "AD", cls: "lab-text lab-text-b" }, { t: " = " }, col(lab.after, 0, "lab-text lab-text-b")]);
    out += text(PX, 190, "D = A ⊕ AD→", "lab-text-muted");
    out += text(PX, 208, named("D", d), "lab-text lab-text-b");
    out += text(PX, 232, "C = B ⊕ AD→", "lab-text-muted");
    out += text(PX, 250, named("C", c), hit ? "lab-text lab-text-ok" : "lab-text lab-text-b");
    if (hit || zero) out += text(PX, 272, hit ? "C liegt auf T!" : "B = A: kein Quadrat", hit ? "lab-text lab-text-ok" : "lab-text-small");
    out += text(PX, 300, "Ziehe B.", "lab-text-small");
    out += handle("B", B.x, B.y, "Eckpunkt B");
  }
  out += "</svg>";
  return out;
}

/** The readouts of the vector lab in words: the vector before and after the turn, and the points. */
export function vectorReadouts(v: LabValues): { before: string; after: string; points: string } {
  const lab = vectorLab(v);
  const names = [
    ["v→", "v'→"],
    ["ZP→", "ZP'→"],
    ["AB→", "AD→"],
  ][lab.mode];
  const points =
    lab.mode === 0
      ? `Spitze von v'→ am Ursprung: ${point(lab.after.x, lab.after.y)}`
      : lab.mode === 1
        ? named("P'", lab.result[0], 1)
        : `${named("C", lab.result[0])}, ${named("D", lab.result[1])}`;
  return { before: `${names[0]}: ${coordsText(lab.before, 1)}`, after: `${names[1]}: ${coordsText(lab.after, 1)}`, points };
}

// ─── The views of the stage ────────────────────────────────────────────────

const pointHandle = (kx: string, ky: string) => ({
  x: kx,
  y: ky,
  drag: (p: Pt) => {
    const plot = plane();
    return { [kx]: plot.invX(p.x), [ky]: plot.invY(p.y) };
  },
});

export const DREHUNG_VIEWS: Record<"rotation" | "point-symmetry" | "vector-rotation", LabView> = {
  rotation: {
    render: rotationView,
    handles: { Z: pointHandle("zx", "zy"), Abild: { x: "phi", drag: rotationDrag } },
  },
  "point-symmetry": {
    render: pointSymmetryView,
    handles: { tip: { x: "phi", drag: symmetryDrag } },
  },
  "vector-rotation": {
    render: vectorRotationView,
    handles: { V: pointHandle("vx", "vy"), Z: pointHandle("zx", "zy"), B: pointHandle("bx", "by") },
  },
};
