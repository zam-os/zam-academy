import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, path, polar, polygon, type Pt, r1, rect, sideLabel, text, W } from "./svg";

const PI = Math.PI;
/** How flat a circle looks from slightly above: the ellipse has ry = FLAT · rx. */
const FLAT = 0.3;
/** Schrägbild of prisms and pyramids: depth at 45° and half its length. */
const OBLIQUE = 0.5 * Math.SQRT1_2;

function ellipse(cx: number, cy: number, rx: number, ry: number, cls: string): string {
  return `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(Math.max(rx, 0))}" ry="${r1(Math.max(ry, 0))}" class="${cls}" />`;
}

/** Points of an ellipse from a0 to a1 (degrees; 0° right, 90° front = down on screen, 270° back). */
function ellipsePts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Pt[] {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 6));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * PI) / 180;
    pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
  }
  return pts;
}

/** Points of a circle in the drawing plane from a0 to a1 (degrees, counter-clockwise, 90° = up). */
function arcPts(cx: number, cy: number, radius: number, a0: number, a1: number): Pt[] {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 5));
  return Array.from({ length: n + 1 }, (_, i) => polar(cx, cy, radius, a0 + ((a1 - a0) * i) / n));
}

function pathOf(points: Pt[], closed = false): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${r1(p.x)} ${r1(p.y)}`).join(" ") + (closed ? " Z" : "");
}

/** A circle seen from slightly above: the front half as a line, the hidden back half dashed. */
function ring(cx: number, cy: number, rx: number, front = "lab-ink"): string {
  if (rx < 0.5) return "";
  return path(pathOf(ellipsePts(cx, cy, rx, rx * FLAT, 0, 180)), front) + path(pathOf(ellipsePts(cx, cy, rx, rx * FLAT, 180, 360)), "lab-dashed");
}

function circlePath(cx: number, cy: number, radius: number): string {
  const r = Math.max(radius, 0.01);
  return `M${r1(cx - r)} ${r1(cy)} a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0 a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0 Z`;
}

/** A label beside the middle of a slanted edge, on its outer (right) side, clear of the line. */
function edgeLabel(a: Pt, b: Pt, content: string, cls: string): string {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  let nx = (b.y - a.y) / len;
  let ny = -(b.x - a.x) / len;
  if (nx < 0) {
    nx = -nx;
    ny = -ny;
  }
  const x = (a.x + b.x) / 2 + nx * 12;
  const y = (a.y + b.y) / 2 + ny * 12 + 4;
  return text(x, y, content, cls, "start");
}

function seg(a: Pt, b: Pt, cls: string): string {
  return line(a.x, a.y, b.x, b.y, cls);
}

/** A tick step of 1, 2 or 5 times a power of ten, about `count` steps up to `max`. */
function niceStep(max: number, count = 4): number {
  const raw = max / count;
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * power;
}

// ─── 6.1 Rotationskörper und Axialschnitt ──────────────────────────────────

const AXIAL = { cx: 130, sx: 392, base: 300, k: 20 };

const AXIAL_BODY = ["Zylinder", "Kegel", "Kugel", "Kegelstumpf", "Zylinder mit Kegelspitze"];

export function axialBody(v: LabValues): string {
  if (v.shape === 3 && Math.abs(v.r - v.r2) < 1e-9) return "Zylinder";
  return AXIAL_BODY[v.shape] ?? AXIAL_BODY[0];
}

export function axialSectionName(v: LabValues): string {
  switch (v.shape) {
    case 1:
      return "gleichschenkliges Dreieck";
    case 2:
      return `Kreis mit d = ${fmt(2 * v.r, 1)} cm`;
    case 3:
      return Math.abs(v.r - v.r2) < 1e-9 ? "Rechteck" : "gleichschenkliges Trapez";
    case 4:
      return "Fünfeck: Rechteck mit Dreieck";
    default:
      return `Rechteck ${fmt(2 * v.r, 1)} cm × ${fmt(v.h, 1)} cm`;
  }
}

/** The slanted side of the Axialschnitt (for the cylinder its side h); the sphere has none. */
export function axialSlant(v: LabValues): number | null {
  switch (v.shape) {
    case 0:
      return v.h;
    case 1:
      return Math.hypot(v.r, v.h);
    case 3:
      return Math.hypot(v.h, v.r - v.r2);
    case 4:
      return Math.hypot(v.r, v.k);
    default:
      return null;
  }
}

/** Area of the Axialschnitt: the figure and its mirror image. */
export function axialArea(v: LabValues): number {
  switch (v.shape) {
    case 1:
      return v.r * v.h;
    case 2:
      return PI * v.r * v.r;
    case 3:
      return (v.r + v.r2) * v.h;
    case 4:
      return 2 * v.r * v.h + v.r * v.k;
    default:
      return 2 * v.r * v.h;
  }
}

export function axialPerimeter(v: LabValues): number {
  const s = axialSlant(v) ?? 0;
  switch (v.shape) {
    case 1:
      return 2 * v.r + 2 * s;
    case 2:
      return 2 * PI * v.r;
    case 3:
      return 2 * v.r + 2 * v.r2 + 2 * s;
    case 4:
      return 2 * v.r + 2 * v.h + 2 * s;
    default:
      return 4 * v.r + 2 * v.h;
  }
}

function axialTop(v: LabValues): number {
  return v.shape === 2 ? 2 * v.r : v.shape === 4 ? v.h + v.k : v.h;
}

/** The figure that rotates, as (distance from the axis, height), from the axis round to the axis. */
function axialProfile(v: LabValues): Array<[number, number]> {
  switch (v.shape) {
    case 1:
      return [[0, 0], [v.r, 0], [0, v.h]];
    case 2:
      return Array.from({ length: 37 }, (_, i): [number, number] => {
        const t = (i / 36) * PI;
        return [v.r * Math.sin(t), v.r - v.r * Math.cos(t)];
      });
    case 3:
      return [[0, 0], [v.r, 0], [v.r2, v.h], [0, v.h]];
    case 4:
      return [[0, 0], [v.r, 0], [v.r, v.h], [0, v.h + v.k]];
    default:
      return [[0, 0], [v.r, 0], [v.r, v.h], [0, v.h]];
  }
}

/** The outer boundary of the figure from bottom to top: it sweeps the mantle. */
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
      return [[v.r, 0], [v.r, v.h]];
  }
}

/** Points whose circles the drawing traces while the figure turns. */
function axialTracePoints(v: LabValues): Array<[number, number]> {
  if (v.shape === 2) return [45, 90, 135].map((deg): [number, number] => [v.r * Math.sin((deg * PI) / 180), v.r - v.r * Math.cos((deg * PI) / 180)]);
  return axialProfile(v).filter(([rho]) => rho > 0);
}

function axialSection(v: LabValues): string {
  const { cx, sx, base, k } = AXIAL;
  const prof = axialProfile(v);
  const top = axialTop(v);
  const P = (rho: number, y: number, deg: number): Pt => {
    const a = (deg * PI) / 180;
    return { x: cx + rho * k * Math.cos(a), y: base - y * k + rho * k * FLAT * Math.sin(a) };
  };
  let out = open("Eine ebene Figur dreht sich um eine Achse; daneben der Axialschnitt des Rotationskörpers");
  // Left: the figure turns about the axis.
  out += line(cx, base + 12, cx, base - top * k - 16, "lab-dashed");
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
    out += path(pathOf(outline, true), "lab-fill-a");
    out += path(pathOf(outline, true), "lab-ink");
    if (rb > 0) out += path(pathOf(ellipsePts(cx, yb, rb * k, rb * k * FLAT, 180, 360)), "lab-dashed");
    if (rt > 0) out += path(pathOf(ellipsePts(cx, yt, rt * k, rt * k * FLAT, 0, 180)), "lab-ink");
    if (v.shape === 2) out += ring(cx, base - v.r * k, v.r * k, "lab-thin");
    if (v.shape === 4) out += ring(cx, base - v.h * k, v.r * k, "lab-thin");
  } else {
    if (v.phi > 0) {
      out += polygon(prof.map(([rho, y]) => P(rho, y, 0)), "lab-ghost");
      for (let deg = 45; deg < v.phi; deg += 45) {
        out += polygon(prof.map(([rho, y]) => P(rho, y, deg)), "lab-thin", 'opacity="0.5"');
      }
      for (const [rho, y] of axialTracePoints(v)) {
        const pts: Pt[] = [];
        for (let deg = 0; deg <= v.phi; deg += 5) pts.push(P(rho, y, deg));
        out += path(pathOf(pts), "lab-dashed");
      }
    }
    out += polygon(prof.map(([rho, y]) => P(rho, y, v.phi)), "lab-fill-b");
  }
  out += text(cx, base + 28, "Drehachse", "lab-text-small", "middle");
  out += text(16, 24, v.phi >= 360 ? axialBody(v) : `Drehung: ${v.phi}°`, "lab-text lab-text-big");
  out += text(16, 44, v.phi >= 360 ? "rechts: sein Axialschnitt in wahrer Größe" : "Drehe bis 360°: Welcher Körper entsteht?", "lab-text-muted");

  // Right: the Axialschnitt in true size, the figure and its mirror image.
  out += text(286, 24, "Axialschnitt", "lab-text lab-text-big");
  out += text(286, 44, axialSectionName(v), "lab-text-muted");
  out += line(sx, base + 10, sx, base - top * k - 14, "lab-dashed");
  const right = prof.map(([rho, y]) => ({ x: sx + rho * k, y: base - y * k }));
  const left = prof.map(([rho, y]) => ({ x: sx - rho * k, y: base - y * k }));
  out += polygon(left, v.phi >= 180 ? "lab-fill-b" : "lab-ghost");
  out += polygon(right, "lab-fill-b");
  out += text(sx + 50, base + 36, "Figur", "lab-text-small", "middle");
  out += text(sx - 50, base + 36, v.phi >= 180 ? "Spiegelbild" : "Spiegelbild (ab 180°)", "lab-text-small", "middle");
  if (v.shape === 2) {
    out += line(sx, base - v.r * k, sx + v.r * k, base - v.r * k, "lab-side-a");
    out += text(sx + (v.r * k) / 2, base - v.r * k - 6, `r = ${fmt(v.r, 1)}`, "lab-text lab-text-a", "middle");
  } else {
    out += text(sx + (v.r * k) / 2, base + 21, `r = ${fmt(v.r, 1)}`, "lab-text lab-text-a", "middle");
    out += text(sx + 6, base - (v.h * k) / 2 + 4, `h = ${fmt(v.h, 1)}`, "lab-text");
  }
  const s = axialSlant(v);
  if (s !== null && v.shape !== 0) {
    const [a, b]: [Pt, Pt] =
      v.shape === 1
        ? [{ x: sx + v.r * k, y: base }, { x: sx, y: base - v.h * k }]
        : v.shape === 3
          ? [{ x: sx + v.r * k, y: base }, { x: sx + v.r2 * k, y: base - v.h * k }]
          : [{ x: sx + v.r * k, y: base - v.h * k }, { x: sx, y: base - (v.h + v.k) * k }];
    out += seg(a, b, "lab-side-c");
    out += edgeLabel(a, b, `s = ${fmt(s, 2)}`, "lab-text lab-text-c");
  }
  if (v.shape === 3) out += text(sx + (v.r2 * k) / 2, base - v.h * k - 6, `r₂ = ${fmt(v.r2, 1)}`, "lab-text lab-text-a", "middle");
  if (v.shape === 4) out += text(sx - v.r * k - 8, base - (v.h + v.k / 2) * k + 4, `k = ${fmt(v.k, 1)}`, "lab-text", "end");
  out += handle("rim", sx + v.r * k, v.shape === 2 ? base - v.r * k : base, "Rand: Radius r ändern");
  if (v.shape === 0 || v.shape === 1 || v.shape === 4) out += handle("top", sx, base - v.h * k, "Höhe h ändern");
  if (v.shape === 3) out += handle("corner", sx + v.r2 * k, base - v.h * k, "Ecke oben: r₂ und h ändern");
  if (v.shape === 4) out += handle("tip", sx, base - (v.h + v.k) * k, "Spitze: Höhe k ändern");
  out += `</svg>`;
  return out;
}

// ─── 6.2 Netze und Oberflächen ─────────────────────────────────────────────

const NET = { x0: 30, cx: 110, base: 292, k: 16 };
const NET_BOX = { x: 228, y: 62, w: 280, h: 254 };
const NET_NAMES = ["dreiseitiges Prisma", "quadratische Pyramide", "Zylinder", "Kegel"];

/** Grundfläche, Mantel, Oberfläche and the slanted length (h_s or s) of the solid in the net lab. */
export function solidNet(v: LabValues): { G: number; M: number; O: number; side: number | null; alpha: number | null } {
  switch (v.solid) {
    case 0: {
      const G = (Math.sqrt(3) / 4) * v.a * v.a;
      const M = 3 * v.a * v.h;
      return { G, M, O: 2 * G + M, side: null, alpha: null };
    }
    case 1: {
      const hs = Math.hypot(v.h, v.a / 2);
      const G = v.a * v.a;
      const M = 2 * v.a * hs;
      return { G, M, O: G + M, side: hs, alpha: null };
    }
    case 3: {
      const s = Math.hypot(v.r, v.h);
      const G = PI * v.r * v.r;
      const M = PI * v.r * s;
      return { G, M, O: G + M, side: s, alpha: (360 * v.r) / s };
    }
    default: {
      const G = PI * v.r * v.r;
      const M = 2 * PI * v.r * v.h;
      return { G, M, O: 2 * G + M, side: null, alpha: null };
    }
  }
}

/** Schrägbild point: x to the right, z into the depth, y up. */
function obl(x: number, z: number, y: number): Pt {
  return { x: NET.x0 + (x + OBLIQUE * z) * NET.k, y: NET.base - (y + OBLIQUE * z) * NET.k };
}

function prismSketch(v: LabValues): string {
  const zc = (Math.sqrt(3) / 2) * v.a;
  const A = obl(0, 0, 0);
  const B = obl(v.a, 0, 0);
  const C = obl(v.a / 2, zc, 0);
  const A2 = obl(0, 0, v.h);
  const B2 = obl(v.a, 0, v.h);
  const C2 = obl(v.a / 2, zc, v.h);
  let out = polygon([A, B, B2, A2], "lab-fill-a") + polygon([A2, B2, C2], "lab-fill-a");
  out += seg(A, C, "lab-dashed") + seg(B, C, "lab-dashed") + seg(C, C2, "lab-dashed");
  out += polygon([A, B, B2, C2, A2], "lab-ink") + seg(A2, B2, "lab-ink");
  out += text((A.x + B.x) / 2, A.y + 18, `a = ${fmt(v.a, 1)}`, "lab-text lab-text-a", "middle");
  out += text(B.x + 8, (B.y + B2.y) / 2 + 4, `h = ${fmt(v.h, 1)}`, "lab-text");
  return out;
}

function pyramidSketch(v: LabValues): string {
  const a = v.a;
  const A = obl(0, 0, 0);
  const B = obl(a, 0, 0);
  const C = obl(a, a, 0);
  const D = obl(0, a, 0);
  const S = obl(a / 2, a / 2, v.h);
  const foot = obl(a / 2, a / 2, 0);
  const mid = obl(a / 2, 0, 0);
  // Faces the viewer sees: front and right always, left and back only when the pyramid is flat.
  const leftSeen = v.h < a / 2;
  const backSeen = v.h < (OBLIQUE * a) / 2;
  let out = "";
  if (backSeen) out += polygon([C, D, S], "lab-fill-a");
  if (leftSeen) out += polygon([D, A, S], "lab-fill-a");
  out += polygon([A, B, S], "lab-fill-a") + polygon([B, C, S], "lab-fill-a");
  const edge = (p: Pt, q: Pt, seen: boolean) => seg(p, q, seen ? "lab-ink" : "lab-dashed");
  out += edge(A, B, true) + edge(B, C, true) + edge(C, D, backSeen) + edge(D, A, leftSeen);
  out += edge(S, A, true) + edge(S, B, true) + edge(S, C, true) + edge(S, D, leftSeen || backSeen);
  out += seg(foot, S, "lab-dashed") + seg(mid, S, "lab-side-b");
  out += text(S.x + 14, S.y - 6, `h_s = ${fmt(Math.hypot(v.h, a / 2), 2)}`, "lab-text lab-text-b");
  out += text((A.x + B.x) / 2, A.y + 18, `a = ${fmt(a, 1)}`, "lab-text lab-text-a", "middle");
  return out;
}

function roundSketch(v: LabValues): string {
  const { cx, base, k } = NET;
  const R = v.r * k;
  const top = base - v.h * k;
  let out = "";
  if (v.solid === 3) {
    out += path(pathOf([{ x: cx, y: top }, ...ellipsePts(cx, base, R, R * FLAT, 0, 180)], true), "lab-fill-a");
    out += seg({ x: cx - R, y: base }, { x: cx, y: top }, "lab-ink") + seg({ x: cx + R, y: base }, { x: cx, y: top }, "lab-ink");
    out += ring(cx, base, R);
    out += line(cx, base, cx, top, "lab-dashed");
    out += sideLabel({ x: cx + R, y: base }, { x: cx, y: top }, `s = ${fmt(Math.hypot(v.r, v.h), 2)}`, 16, "lab-text lab-text-b");
  } else {
    out += path(pathOf([{ x: cx - R, y: top }, ...ellipsePts(cx, base, R, R * FLAT, 180, 0), { x: cx + R, y: top }], true), "lab-fill-a");
    out += ellipse(cx, top, R, R * FLAT, "lab-fill-a");
    out += line(cx - R, top, cx - R, base, "lab-ink") + line(cx + R, top, cx + R, base, "lab-ink");
    out += ring(cx, base, R);
    out += text(cx + R + 6, (top + base) / 2 + 4, `h = ${fmt(v.h, 1)}`, "lab-text");
  }
  out += line(cx, base, cx + R, base, "lab-side-a");
  out += text(cx + R / 2, base + R * FLAT + 15, `r = ${fmt(v.r, 1)}`, "lab-text lab-text-a", "middle");
  return out;
}

function prismNet(v: LabValues, t: number): string {
  const a = v.a;
  const tri = (Math.sqrt(3) / 2) * a;
  const kn = Math.min(26, NET_BOX.w / (3 * a), NET_BOX.h / (v.h + 2 * tri));
  const left = NET_BOX.x + (NET_BOX.w - 3 * a * kn) / 2;
  const y0 = NET_BOX.y + (NET_BOX.h - (v.h + 2 * tri) * kn) / 2 + tri * kn;
  const faces = t <= 0 ? 0 : Math.min(3, Math.ceil((3 * t) / 100 - 1e-9));
  let out = "";
  for (let j = 0; j < faces; j++) {
    out += rect(left + j * a * kn, y0, a * kn, v.h * kn, "lab-fill-a");
    if (a * kn > 34 && v.h * kn > 16) out += text(left + (j + 0.5) * a * kn, y0 + (v.h * kn) / 2 + 4, "a × h", "lab-text-small", "middle");
  }
  if (t >= 100) {
    const xa = left + a * kn;
    const xb = left + 2 * a * kn;
    out += polygon([{ x: xa, y: y0 }, { x: xb, y: y0 }, { x: (xa + xb) / 2, y: y0 - tri * kn }], "lab-fill-b");
    out += polygon([{ x: xa, y: y0 + v.h * kn }, { x: xb, y: y0 + v.h * kn }, { x: (xa + xb) / 2, y: y0 + (v.h + tri) * kn }], "lab-fill-b");
  }
  return out;
}

function pyramidNet(v: LabValues, t: number): string {
  const a = v.a;
  const hs = Math.hypot(v.h, a / 2);
  const kn = Math.min(26, NET_BOX.h / (a + 2 * hs));
  const cx = NET_BOX.x + NET_BOX.w / 2;
  const cy = NET_BOX.y + NET_BOX.h / 2;
  const s0 = (a / 2) * kn;
  // Seen from above: a face tilted by β reaches h_s · cos β beyond its edge; folded down β = 0.
  const beta = Math.acos(Math.min(1, a / (2 * hs))) * (1 - t / 100);
  const d = hs * Math.cos(beta) * kn;
  let out = rect(cx - s0, cy - s0, 2 * s0, 2 * s0, "lab-fill-b");
  const faces: Array<Pt[]> = [
    [{ x: cx - s0, y: cy + s0 }, { x: cx + s0, y: cy + s0 }, { x: cx, y: cy + s0 + d }],
    [{ x: cx + s0, y: cy - s0 }, { x: cx + s0, y: cy + s0 }, { x: cx + s0 + d, y: cy }],
    [{ x: cx - s0, y: cy - s0 }, { x: cx + s0, y: cy - s0 }, { x: cx, y: cy - s0 - d }],
    [{ x: cx - s0, y: cy - s0 }, { x: cx - s0, y: cy + s0 }, { x: cx - s0 - d, y: cy }],
  ];
  for (const face of faces) out += polygon(face, "lab-fill-a");
  if (t >= 100) {
    out += line(cx, cy + s0, cx, cy + s0 + d, "lab-side-b");
    out += text(cx + 5, cy + s0 + d / 2 + 4, "h_s", "lab-text lab-text-b");
    out += text(cx, cy + 4, "G = a²", "lab-text-small", "middle");
  } else {
    out += text(cx, NET_BOX.y + NET_BOX.h + 14, "Blick von oben: die Seiten klappen herunter", "lab-text-small", "middle");
  }
  return out;
}

function cylinderNet(v: LabValues, t: number): string {
  const u = 2 * PI * v.r;
  const kn = Math.min(26, NET_BOX.w / u, NET_BOX.h / (v.h + 4 * v.r));
  const left = NET_BOX.x + (NET_BOX.w - u * kn) / 2;
  const y0 = NET_BOX.y + (NET_BOX.h - (v.h + 4 * v.r) * kn) / 2 + 2 * v.r * kn;
  let out = "";
  if (t > 0) {
    out += rect(left, y0, u * kn * (t / 100), v.h * kn, "lab-fill-a");
    if (t >= 60 && v.h * kn > 16) out += text(left + (u * kn * (t / 100)) / 2, y0 + (v.h * kn) / 2 + 4, "M = 2πr · h", "lab-text-small", "middle");
  }
  if (t >= 100) {
    out += circle(left + v.r * kn, y0 - v.r * kn, v.r * kn, "lab-fill-b");
    out += circle(left + v.r * kn, y0 + (v.h + v.r) * kn, v.r * kn, "lab-fill-b");
  }
  return out;
}

function coneNet(v: LabValues, t: number): string {
  const s = Math.hypot(v.r, v.h);
  const alpha = (360 * v.r) / s;
  const up = Math.max(0, -s * Math.cos(((alpha / 2) * PI) / 180));
  const halfWidth = Math.max(alpha >= 180 ? s : s * Math.sin(((alpha / 2) * PI) / 180), v.r);
  const kn = Math.min(26, NET_BOX.w / (2 * halfWidth), NET_BOX.h / (up + s + 2 * v.r));
  const ax = NET_BOX.x + NET_BOX.w / 2;
  const ay = NET_BOX.y + (NET_BOX.h - (up + s + 2 * v.r) * kn) / 2 + up * kn;
  const a0 = 270 - alpha / 2;
  const a1 = a0 + (alpha * t) / 100;
  let out = "";
  if (t > 0) {
    out += path(pathOf([{ x: ax, y: ay }, ...arcPts(ax, ay, s * kn, a0, a1)], true), "lab-fill-a");
    const edge = polar(ax, ay, s * kn, a0);
    out += line(ax, ay, edge.x, edge.y, "lab-side-b");
    out += sideLabel({ x: ax, y: ay }, edge, "s", 10, "lab-text lab-text-b");
    out += path(pathOf(arcPts(ax, ay, 18, a0, a1)), "lab-angle");
  }
  if (t >= 100) {
    out += circle(ax, ay + (s + v.r) * kn, v.r * kn, "lab-fill-b");
    out += text(ax, ay + s * kn * 0.62 + 4, "M = πrs", "lab-text-small", "middle");
  }
  return out;
}

function solidNetView(v: LabValues): string {
  const values = solidNet(v);
  const t = v.t;
  let out = open("Ein Körper und sein Netz, das beim Abwickeln entsteht");
  out += text(16, 24, NET_NAMES[v.solid] ?? NET_NAMES[2], "lab-text lab-text-big");
  out += text(16, 44, v.solid === 0 || v.solid === 2 ? "O = 2 · G + M" : "O = G + M", "lab-text-muted");
  out += v.solid === 0 ? prismSketch(v) : v.solid === 1 ? pyramidSketch(v) : roundSketch(v);
  out += text(NET_BOX.x, 24, t < 100 ? `Abwickeln: ${t} %` : "Netz", "lab-text lab-text-big");
  const info =
    v.solid === 0
      ? `Mantel: ${fmt(3 * v.a, 1)} cm × ${fmt(v.h, 1)} cm (u × h)`
      : v.solid === 1
        ? `4 Dreiecke, Seitenhöhe h_s = ${fmt(values.side ?? 0, 2)} cm`
        : v.solid === 3
          ? `Sektor mit Radius s, α = 360° · r : s = ${fmt(values.alpha ?? 0, 1)}°`
          : `Mantel: ${fmt(2 * PI * v.r, 2)} cm × ${fmt(v.h, 1)} cm (2πr × h)`;
  out += text(NET_BOX.x, 44, info, "lab-text-muted");
  out += v.solid === 0 ? prismNet(v, t) : v.solid === 1 ? pyramidNet(v, t) : v.solid === 3 ? coneNet(v, t) : cylinderNet(v, t);
  if (t <= 0) out += text(NET_BOX.x + NET_BOX.w / 2, NET_BOX.y + NET_BOX.h / 2, "Schiebe „Abwickeln“ nach rechts.", "lab-text-muted", "middle");
  if (t >= 100) out += text(W - 12, NET_BOX.y + NET_BOX.h + 14, `O = ${fmt(values.O, 2)} cm²`, "lab-text lab-text-c", "end");
  if (v.solid === 0) {
    out += handle("a", obl(v.a, 0, 0).x, NET.base, "Grundkante a ändern");
    out += handle("h", NET.x0, NET.base - v.h * NET.k, "Höhe h ändern");
  } else if (v.solid === 1) {
    out += handle("a", obl(v.a, 0, 0).x, NET.base, "Grundkante a ändern");
    const S = obl(v.a / 2, v.a / 2, v.h);
    out += handle("h", S.x, S.y, "Spitze: Höhe h ändern");
  } else {
    out += handle("r", NET.cx + v.r * NET.k, NET.base, "Rand: Radius r ändern");
    out += handle("h", NET.cx, NET.base - v.h * NET.k, v.solid === 3 ? "Spitze: Höhe h ändern" : "Deckel: Höhe h ändern");
  }
  out += `</svg>`;
  return out;
}

// ─── 6.3 Prinzip von Cavalieri ─────────────────────────────────────────────

const CAV = { lx: 120, rx: 330, base: 236, k: 18, iconY: 296, ki: 6 };
const CAV_NAMES = [
  ["gerades Prisma", "schiefes Prisma"],
  ["gerade Pyramide", "schiefe Pyramide"],
  ["Halbkugel", "Zylinder ohne Kegel"],
];

/**
 * The two bodies of the Cavalieri lab: volume by formula, volume of the
 * stack of n slices (each as wide as its bottom face), and the cross-section
 * of each body at the height z (in % of the body's height).
 */
export function cavalieri(v: LabValues): { G: number; Vf: number; Vs: number; Ql: number; Qr: number; height: number; zAt: number } {
  const n = v.n;
  const z = v.z / 100;
  if (v.mode === 2) {
    const r = v.r;
    const zAt = z * r;
    return {
      G: PI * r * r,
      Vf: (2 / 3) * PI * r ** 3,
      Vs: PI * r ** 3 * (1 - ((n - 1) * (2 * n - 1)) / (6 * n * n)),
      Ql: PI * (r * r - zAt * zAt),
      Qr: PI * r * r - PI * zAt * zAt,
      height: r,
      zAt,
    };
  }
  const G = v.a * v.a;
  if (v.mode === 1) {
    const q = G * (1 - z) ** 2;
    return { G, Vf: (G * v.h) / 3, Vs: (G * v.h * (n + 1) * (2 * n + 1)) / (6 * n * n), Ql: q, Qr: q, height: v.h, zAt: z * v.h };
  }
  return { G, Vf: G * v.h, Vs: G * v.h, Ql: G, Qr: G, height: v.h, zAt: z * v.h };
}

function cavalieriView(v: LabValues): string {
  const { lx, rx, base, k, iconY, ki } = CAV;
  const c = cavalieri(v);
  const n = v.n;
  const hk = c.height * k;
  const sliceH = hk / n;
  const thin = sliceH >= 3 ? 'style="stroke-width:0.5"' : 'style="stroke:none"';
  const cutY = base - (v.z / 100) * hk;
  const z = v.z / 100;
  let out = open("Zwei Körper aus gleich großen Scheiben: das Prinzip von Cavalieri");
  if (v.mode === 2) {
    const R = v.r * k;
    for (let i = 0; i < n; i++) {
      const y0 = base - (i + 1) * sliceH;
      const zi = (i / n) * v.r;
      const rho = Math.sqrt(Math.max(0, v.r * v.r - zi * zi)) * k;
      out += rect(lx - rho, y0, 2 * rho, sliceH, "lab-fill-a", thin);
      out += rect(rx - R, y0, R - zi * k, sliceH, "lab-fill-b", thin);
      out += rect(rx + zi * k, y0, R - zi * k, sliceH, "lab-fill-b", thin);
    }
    out += polygon(arcPts(lx, base, R, 0, 180), "lab-ink");
    out += polygon([{ x: rx - R, y: base }, { x: rx + R, y: base }, { x: rx + R, y: base - R }, { x: rx, y: base }, { x: rx - R, y: base - R }], "lab-ink");
    out += line(rx - R, base - R, rx + R, base - R, "lab-dashed");
    const rho = Math.sqrt(Math.max(0, v.r * v.r - c.zAt * c.zAt)) * k;
    out += line(lx - rho, cutY, lx + rho, cutY, "lab-side-c");
    out += line(rx - R, cutY, rx - c.zAt * k, cutY, "lab-side-c") + line(rx + c.zAt * k, cutY, rx + R, cutY, "lab-side-c");
    out += path(circlePath(lx, iconY, rho * (ki / k)), "lab-fill-c");
    out += path(`${circlePath(rx, iconY, v.r * ki)} ${circlePath(rx, iconY, c.zAt * ki)}`, "lab-fill-c", 'fill-rule="evenodd"');
    out += text(lx + v.r * ki + 8, iconY + 4, `Q = ${fmt(c.Ql, 2)} cm²`, "lab-text lab-text-c");
    out += text(rx + v.r * ki + 8, iconY + 4, `Q = ${fmt(c.Qr, 2)} cm²`, "lab-text lab-text-c");
    out += handle("radius", lx + R, base, "Rand: Radius r ändern");
  } else {
    const A = v.a * k;
    for (let i = 0; i < n; i++) {
      const y0 = base - (i + 1) * sliceH;
      const w = (v.mode === 0 ? v.a : v.a * (1 - i / n)) * k;
      const shift = v.shift * k * (v.mode === 0 ? (i + 0.5) / n : i / n);
      out += rect(lx - w / 2, y0, w, sliceH, "lab-fill-a", thin);
      out += rect(rx + shift - w / 2, y0, w, sliceH, "lab-fill-b", thin);
    }
    const top = base - hk;
    const S = v.shift * k;
    if (v.mode === 0) {
      out += rect(lx - A / 2, top, A, hk, "lab-ink");
      out += polygon([{ x: rx - A / 2, y: base }, { x: rx + A / 2, y: base }, { x: rx + S + A / 2, y: top }, { x: rx + S - A / 2, y: top }], "lab-ink");
    } else {
      out += polygon([{ x: lx - A / 2, y: base }, { x: lx + A / 2, y: base }, { x: lx, y: top }], "lab-ink");
      out += polygon([{ x: rx - A / 2, y: base }, { x: rx + A / 2, y: base }, { x: rx + S, y: top }], "lab-ink");
    }
    const w = (v.mode === 0 ? v.a : v.a * (1 - z)) * k;
    out += line(lx - w / 2, cutY, lx + w / 2, cutY, "lab-side-c");
    out += line(rx + S * z - w / 2, cutY, rx + S * z + w / 2, cutY, "lab-side-c");
    const side = (w / k) * ki;
    out += rect(lx - side / 2, iconY - side / 2, side, side, "lab-fill-c");
    out += rect(rx - side / 2, iconY - side / 2, side, side, "lab-fill-c");
    out += text(lx + v.a * ki * 0.5 + 10, iconY + 4, `Q = ${fmt(c.Ql, 2)} cm²`, "lab-text lab-text-c");
    out += text(rx + v.a * ki * 0.5 + 10, iconY + 4, `Q = ${fmt(c.Qr, 2)} cm²`, "lab-text lab-text-c");
    out += handle("edge", lx + A / 2, base, "Grundkante a ändern");
    out += handle("height", lx, top, "Höhe h ändern");
    out += handle("shift", rx + S, top, "Oben verschieben: schief stellen");
  }
  out += line(14, cutY, W - 14, cutY, "lab-dashed");
  out += line(10, base, W - 10, base, "lab-thin");
  const [nameL, nameR] = CAV_NAMES[v.mode] ?? CAV_NAMES[0];
  out += text(lx, base + 22, nameL, "lab-text-small", "middle");
  out += text(rx + (v.mode === 2 ? 0 : (v.shift * k) / 2), base + 22, nameR, "lab-text-small", "middle");
  const dev = (c.Vs / c.Vf - 1) * 100;
  const title =
    v.mode === 0
      ? `Säulen: V = G · h = ${fmt(c.Vf, 2)} cm³`
      : v.mode === 1
        ? `Spitzkörper: V = ⅓ · G · h = ${fmt(c.Vf, 2)} cm³`
        : `Halbkugel: V = ⅔ · π · r³ = ${fmt(c.Vf, 2)} cm³`;
  out += text(16, 22, title, "lab-text lab-text-big");
  out += text(
    16,
    42,
    v.mode === 0 ? `gerade und schief: je ${fmt(c.Vs, 2)} cm³, in jeder Höhe Q = G` : `${n} Scheiben: je Körper ${fmt(c.Vs, 2)} cm³, ${fmt(dev, 1)} % zu viel`,
    "lab-text-muted",
  );
  if (v.mode === 2) {
    out += text(16, 62, "Querschnitt in der Höhe z: π(r² − z²) = πr² − πz²", "lab-text-muted");
    out += text(16, 80, `ganze Kugel: V = ${fmt((4 / 3) * PI * v.r ** 3, 2)} cm³, O = 4πr² = ${fmt(4 * PI * v.r * v.r, 2)} cm²`, "lab-text-muted");
  }
  out += handle("cut", 22, cutY, "Schnitthöhe ändern");
  out += `</svg>`;
  return out;
}

// ─── 6.4 Zusammengesetzte Körper ───────────────────────────────────────────

const COMP = { cx: 140, base: 318, tx: 292 };
const COMP_TITLES = [
  ["Silo", "Zylinder + Kegel"],
  ["Turm", "Zylinder + Halbkugel"],
  ["Eistüte", "Kegel + Halbkugel"],
  ["Kapsel", "Halbkugel + Zylinder + Halbkugel"],
  ["Werkstück", "Zylinder − kegelförmige Bohrung"],
];

export interface CompositePart {
  name: string;
  V: number;
  sign: 1 | -1;
}

export interface CompositeFace {
  name: string;
  area: number;
  counts: boolean;
}

/** Volume, surface, parts and faces of the composite solid; the bore of the Werkstück is t % as deep as the cylinder. */
export function compositeSolid(v: LabValues): { V: number; O: number; parts: CompositePart[]; faces: CompositeFace[]; height: number } {
  const { r, h, k } = v;
  const disc = PI * r * r;
  const cyl: CompositePart = { name: "Zylinder", V: disc * h, sign: 1 };
  const mantle: CompositeFace = { name: "Zylindermantel", area: 2 * PI * r * h, counts: true };
  const bottom: CompositeFace = { name: "Boden", area: disc, counts: true };
  const contact: CompositeFace = { name: "Berührkreis", area: disc, counts: false };
  const dome: CompositeFace = { name: "Halbkugelfläche", area: 2 * disc, counts: true };
  const half: CompositePart = { name: "Halbkugel", V: (2 / 3) * PI * r ** 3, sign: 1 };
  let parts: CompositePart[];
  let faces: CompositeFace[];
  let height: number;
  switch (v.model) {
    case 1:
      parts = [cyl, half];
      faces = [bottom, mantle, dome, contact];
      height = h + r;
      break;
    case 2:
      parts = [{ name: "Kegel", V: (disc * k) / 3, sign: 1 }, half];
      faces = [{ name: "Kegelmantel", area: PI * r * Math.hypot(r, k), counts: true }, dome, contact];
      height = k + r;
      break;
    case 3:
      parts = [half, cyl, { ...half }];
      faces = [{ name: "2 Halbkugelflächen", area: 4 * disc, counts: true }, mantle, { name: "2 Berührkreise", area: 2 * disc, counts: false }];
      height = 2 * r + h;
      break;
    case 4: {
      const d = (v.t / 100) * h;
      parts = [cyl, { name: "Bohrung (Kegel)", V: (disc * d) / 3, sign: -1 }];
      faces = [bottom, mantle, { name: "Kegelmantel innen", area: PI * r * Math.hypot(r, d), counts: true }, { name: "Deckkreis", area: disc, counts: false }];
      height = h;
      break;
    }
    default:
      parts = [cyl, { name: "Kegel", V: (disc * k) / 3, sign: 1 }];
      faces = [bottom, mantle, { name: "Kegelmantel", area: PI * r * Math.hypot(r, k), counts: true }, contact];
      height = h + k;
  }
  const V = parts.reduce((sum, part) => sum + part.sign * part.V, 0);
  const O = faces.filter((face) => face.counts).reduce((sum, face) => sum + face.area, 0);
  return { V, O, parts, faces, height };
}

function compScale(v: LabValues): number {
  return Math.min(16, 262 / compositeSolid(v).height, 230 / (2 * v.r));
}

function compositeView(v: LabValues): string {
  const { cx, base, tx } = COMP;
  const c = compositeSolid(v);
  const kc = compScale(v);
  const R = v.r * kc;
  const ry = R * FLAT;
  const Y = (y: number) => base - y * kc;
  const cylinder = (y0: number, y1: number) =>
    path(pathOf([{ x: cx - R, y: Y(y1) }, ...ellipsePts(cx, Y(y0), R, ry, 180, 0), ...ellipsePts(cx, Y(y1), R, ry, 0, 180)], true), "lab-fill-a") +
    line(cx - R, Y(y0), cx - R, Y(y1), "lab-ink") +
    line(cx + R, Y(y0), cx + R, Y(y1), "lab-ink");
  const cone = (yBase: number, yApex: number) =>
    path(pathOf([{ x: cx, y: Y(yApex) }, ...ellipsePts(cx, Y(yBase), R, ry, 0, 180)], true), "lab-fill-c") +
    line(cx - R, Y(yBase), cx, Y(yApex), "lab-ink") +
    line(cx + R, Y(yBase), cx, Y(yApex), "lab-ink");
  const domeUp = (y0: number) => {
    const arc = arcPts(cx, Y(y0), R, 0, 180);
    return path(pathOf([...arc, ...ellipsePts(cx, Y(y0), R, ry, 180, 0)], true), "lab-fill-b") + path(pathOf(arc), "lab-ink");
  };
  const domeDown = (y0: number) => {
    const arc = arcPts(cx, Y(y0), R, 0, -180);
    return path(pathOf([...ellipsePts(cx, Y(y0), R, ry, 180, 0), ...arc], true), "lab-fill-b") + path(pathOf(arc), "lab-ink");
  };
  const contact = (y: number) => ellipse(cx, Y(y), R, ry, "lab-dashed");
  /** The name of a part in its middle, when the part is tall enough on screen. */
  const label = (y: number, size: number, name: string) => (size * kc >= 18 && R >= 34 ? text(cx, Y(y) + 4, name, "lab-text-small", "middle") : "");
  const { h, k, r } = v;
  let out = open("Ein zusammengesetzter Körper aus Zylinder, Kegel und Halbkugel");
  switch (v.model) {
    case 1:
      out += cylinder(0, h) + domeUp(h) + contact(h) + ring(cx, base, R);
      out += label(h / 2, h, "Zylinder") + label(h + r / 2, r, "Halbkugel");
      break;
    case 2:
      out += cone(k, 0) + domeUp(k) + contact(k);
      out += label((2 * k) / 3, k / 2, "Kegel") + label(k + r / 2, r, "Halbkugel");
      break;
    case 3:
      out += domeDown(r) + cylinder(r, r + h) + domeUp(r + h) + contact(r) + contact(r + h);
      out += label(r / 2, r, "Halbkugel") + label(r + h / 2, h, "Zylinder") + label(r + h + r / 2, r, "Halbkugel");
      break;
    case 4: {
      const d = (v.t / 100) * h;
      out += cylinder(0, h) + ellipse(cx, Y(h), R, ry, "lab-fill-c") + ellipse(cx, Y(h), R, ry, "lab-ink") + ring(cx, base, R);
      out += line(cx - R, Y(h), cx, Y(h - d), "lab-dashed") + line(cx + R, Y(h), cx, Y(h - d), "lab-dashed");
      out += text(cx, Y(h) - ry - 6, "Bohrung", "lab-text-small", "middle");
      break;
    }
    default:
      out += cylinder(0, h) + cone(h, h + k) + contact(h) + ring(cx, base, R);
      out += label(h / 2, h, "Zylinder") + label(h + k / 3, k / 2, "Kegel");
  }
  // The parts and faces on the right.
  const [title, sub] = COMP_TITLES[v.model] ?? COMP_TITLES[0];
  out += text(tx, 24, title, "lab-text lab-text-big");
  out += text(tx, 44, sub, "lab-text-muted");
  let y = 72;
  out += text(tx, y, "Volumen", "lab-text");
  for (const part of c.parts) {
    y += 18;
    out += text(tx, y, `${part.sign < 0 ? "−" : "+"} ${part.name}: ${fmt(part.V, 1)} cm³`, "lab-text-muted");
  }
  y += 20;
  out += text(tx, y, `V = ${fmt(c.V, 1)} cm³ = ${fmt(c.V / 1000, 3)} l`, "lab-text lab-text-a");
  y += 28;
  out += text(tx, y, "Oberfläche", "lab-text");
  for (const face of c.faces) {
    y += 18;
    out += face.counts
      ? text(tx, y, `+ ${face.name}: ${fmt(face.area, 1)} cm²`, "lab-text-muted")
      : text(tx, y, `${face.name}: ${v.model === 4 ? "ausgebohrt" : "innen"}, zählt nicht`, "lab-text-small");
  }
  y += 20;
  out += text(tx, y, `O = ${fmt(c.O, 1)} cm²`, "lab-text lab-text-c");
  // Handles: the radius at the side, the heights on the axis.
  const rimY = v.model === 2 ? k : v.model === 3 ? r + h / 2 : h / 2;
  out += handle("rim", cx + R, Y(rimY), "Rand: Radius r ändern");
  if (v.model !== 2) out += handle("height", cx - R, Y(v.model === 3 ? r + h : h), "Zylinderhöhe h ändern");
  if (v.model === 0) out += handle("tip", cx, Y(h + k), "Spitze: Kegelhöhe k ändern");
  if (v.model === 2) out += handle("tip", cx - R, Y(k), "Rand der Tüte: Kegelhöhe k ändern");
  if (v.model === 4) out += handle("depth", cx, Y(h - (v.t / 100) * h), "Spitze der Bohrung: Tiefe ändern");
  out += `</svg>`;
  return out;
}

// ─── 6.5 Extremwerte bei Körpern ───────────────────────────────────────────

const EXT = { cx: 130, base: 292, sheetX: 20, sheetY: 66, plot: { x: 292, y: 70, w: 212, h: 220 } };

const coneScale = (v: LabValues) => Math.min(15, 230 / v.hk);
const sheetScale = (v: LabValues) => Math.min(11, 230 / v.L);

/** The variable x of the chosen task: the cylinder radius or the side of the cut-out squares. */
export function extremumX(v: LabValues): number {
  return v.task === 1 ? v.c : v.x;
}

/** The upper bound of the Definitionsmenge: 0 < x < bound. */
export function extremumBound(v: LabValues): number {
  return v.task === 1 ? v.L / 2 : v.R;
}

export function extremumInDomain(v: LabValues): boolean {
  const x = extremumX(v);
  return x > 0 && x < extremumBound(v) - 1e-9;
}

/** The quantity of the task at x: Mantel or Volumen of the cylinder in the cone, or the volume of the box. */
export function extremumAt(v: LabValues, x: number): number {
  if (x <= 0 || x >= extremumBound(v)) return 0;
  if (v.task === 1) return x * (v.L - 2 * x) ** 2;
  const h = v.hk * (1 - x / v.R);
  return v.qty === 1 ? PI * x * x * h : 2 * PI * x * h;
}

/** Where the quantity is largest, and its value there. */
export function extremumBest(v: LabValues): { x: number; value: number } {
  const x = v.task === 1 ? v.L / 6 : v.qty === 1 ? (2 * v.R) / 3 : v.R / 2;
  return { x, value: extremumAt(v, x) };
}

function extremumView(v: LabValues): string {
  const { cx, base, sheetX, sheetY, plot: box } = EXT;
  const x = extremumX(v);
  const inside = extremumInDomain(v);
  const value = extremumAt(v, x);
  const best = extremumBest(v);
  const bound = extremumBound(v);
  const name = v.task === 1 || v.qty === 1 ? "V" : "M";
  const unit = name === "V" ? "cm³" : "cm²";
  let out = open("Ein Körper, dessen Maße von x abhängen, und der Graph seines Volumens oder Mantels");
  if (v.task === 1) {
    const ks = sheetScale(v);
    const S = v.L * ks;
    const c = v.c * ks;
    out += rect(sheetX, sheetY, S, S, "lab-ghost");
    if (inside) {
      const x0 = sheetX;
      const y0 = sheetY;
      const cross: Pt[] = [
        { x: x0 + c, y: y0 }, { x: x0 + S - c, y: y0 }, { x: x0 + S - c, y: y0 + c }, { x: x0 + S, y: y0 + c },
        { x: x0 + S, y: y0 + S - c }, { x: x0 + S - c, y: y0 + S - c }, { x: x0 + S - c, y: y0 + S }, { x: x0 + c, y: y0 + S },
        { x: x0 + c, y: y0 + S - c }, { x: x0, y: y0 + S - c }, { x: x0, y: y0 + c }, { x: x0 + c, y: y0 + c },
      ];
      out += polygon(cross, "lab-fill-a");
      out += rect(x0 + c, y0 + c, S - 2 * c, S - 2 * c, "lab-dashed");
      for (const [px, py] of [[x0, y0], [x0 + S - c, y0], [x0, y0 + S - c], [x0 + S - c, y0 + S - c]]) out += rect(px, py, c, c, "lab-fill-b");
      out += text(x0 + S / 2, y0 + S / 2 + 4, `a − 2x = ${fmt(v.L - 2 * v.c, 1)} cm`, "lab-text-small", "middle");
      if (c > 14) out += text(x0 + c / 2, y0 + c / 2 + 4, "x", "lab-text lab-text-b", "middle");
    } else {
      out += text(sheetX + S / 2, sheetY + S / 2, "x liegt nicht in D", "lab-text lab-text-bad", "middle");
    }
    out += text(16, 24, "Schachtel: V(x) = x · (a − 2x)²", "lab-text lab-text-big");
    out += text(16, 44, `Karton a = ${fmt(v.L, 0)} cm: Ecken x × x ausschneiden, Ränder hochklappen`, "lab-text-muted");
    out += handle("cut", sheetX + c, sheetY + c, "Ecke: x ändern");
  } else {
    const ke = coneScale(v);
    const R = v.R * ke;
    const Hc = v.hk * ke;
    out += polygon([{ x: cx - R, y: base }, { x: cx + R, y: base }, { x: cx, y: base - Hc }], "lab-fill-c");
    out += line(cx, base + 8, cx, base - Hc - 8, "lab-dashed");
    const hx = v.hk * (1 - x / v.R);
    if (inside) {
      out += rect(cx - x * ke, base - hx * ke, 2 * x * ke, hx * ke, "lab-fill-a");
      out += line(cx, base + 1, cx + x * ke, base + 1, "lab-side-b");
      out += text(cx, base + 20, `x = ${fmt(x, 1)} cm, h(x) = ${fmt(hx, 2)} cm`, "lab-text lab-text-b", "middle");
    } else {
      out += text(cx, base + 30, "x liegt nicht in D: kein Zylinder", "lab-text lab-text-bad", "middle");
    }
    out += text(16, 24, v.qty === 1 ? "V(x) = π · x² · h(x)" : "M(x) = 2π · x · h(x)", "lab-text lab-text-big");
    out += text(16, 44, `Kegel: r = ${fmt(v.R, 1)} cm, h = ${fmt(v.hk, 1)} cm; h(x) mit dem Strahlensatz`, "lab-text-muted");
    out += handle("corner", cx + x * ke, inside ? base - hx * ke : base, "Ecke des Zylinders: x ändern");
  }
  // The graph of the quantity over the Definitionsmenge.
  const ymax = best.value * 1.15;
  const toX = (t: number) => box.x + (t / bound) * box.w;
  const toY = (f: number) => box.y + box.h - (f / ymax) * box.h;
  out += rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  const xs = bound > 8 ? 2 : 1;
  for (let t = xs; t < bound - 1e-9; t += xs) {
    out += line(toX(t), box.y, toX(t), box.y + box.h, "lab-grid");
    out += text(toX(t), box.y + box.h + 13, fmt(t, 0), "lab-text-tick", "middle");
  }
  const ys = niceStep(ymax, 5);
  for (let f = ys; f < ymax - 1e-9; f += ys) {
    out += line(box.x, toY(f), box.x + box.w, toY(f), "lab-grid");
    out += text(box.x - 4, toY(f) + 4, fmt(f, 0), "lab-text-tick", "end");
  }
  out += line(box.x, box.y + box.h, box.x + box.w + 4, box.y + box.h, "lab-axis") + line(box.x, box.y + box.h, box.x, box.y - 4, "lab-axis");
  const pts: Pt[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = (bound * i) / 120;
    pts.push({ x: toX(t), y: toY(extremumAt(v, t)) });
  }
  out += path(pathOf(pts), "lab-curve");
  out += text(box.x + 4, box.y - 8, `${name} in ${unit}`, "lab-text-axis");
  out += text(box.x + box.w, box.y + box.h + 28, "x in cm", "lab-text-axis", "end");
  if (inside) {
    const P = { x: toX(x), y: toY(value) };
    out += line(P.x, P.y, P.x, box.y + box.h, "lab-dashed") + line(box.x, P.y, P.x, P.y, "lab-dashed");
    out += circle(P.x, P.y, 6, "lab-point-b");
    out += text(box.x + box.w - 4, box.y + 14, `${name}(${fmt(x, 1)}) = ${fmt(value, 2)}`, "lab-text lab-text-b", "end");
  } else {
    out += text(box.x + box.w / 2, box.y + 20, "x liegt nicht in D", "lab-text lab-text-bad", "middle");
  }
  out += text(box.x, box.y + box.h + 28, `D: 0 < x < ${fmt(bound, 1)}`, "lab-text-small");
  out += `</svg>`;
  return out;
}

export const RAUMGEOMETRIE_VIEWS: Record<"axial-section" | "solid-net" | "cavalieri" | "composite-solid" | "solid-extremum", LabView> = {
  "axial-section": {
    render: axialSection,
    handles: {
      rim: { x: "r", drag: (p) => ({ r: (p.x - AXIAL.sx) / AXIAL.k }) },
      top: { y: "h", drag: (p) => ({ h: (AXIAL.base - p.y) / AXIAL.k }) },
      corner: { x: "r2", y: "h", drag: (p) => ({ r2: (p.x - AXIAL.sx) / AXIAL.k, h: (AXIAL.base - p.y) / AXIAL.k }) },
      tip: { y: "k", drag: (p, v) => ({ k: (AXIAL.base - p.y) / AXIAL.k - v.h }) },
    },
  },
  "solid-net": {
    render: solidNetView,
    handles: {
      a: { x: "a", drag: (p) => ({ a: (p.x - NET.x0) / NET.k }) },
      r: { x: "r", drag: (p) => ({ r: (p.x - NET.cx) / NET.k }) },
      h: { y: "h", drag: (p, v) => ({ h: (NET.base - p.y) / NET.k - (v.solid === 1 ? (OBLIQUE * v.a) / 2 : 0) }) },
    },
  },
  cavalieri: {
    render: cavalieriView,
    handles: {
      edge: { x: "a", drag: (p) => ({ a: (2 * (p.x - CAV.lx)) / CAV.k }) },
      height: { y: "h", drag: (p) => ({ h: (CAV.base - p.y) / CAV.k }) },
      shift: { x: "shift", drag: (p) => ({ shift: (p.x - CAV.rx) / CAV.k }) },
      radius: { x: "r", drag: (p) => ({ r: (p.x - CAV.lx) / CAV.k }) },
      cut: { y: "z", drag: (p, v) => ({ z: ((CAV.base - p.y) / ((v.mode === 2 ? v.r : v.h) * CAV.k)) * 100 }) },
    },
  },
  "composite-solid": {
    render: compositeView,
    handles: {
      rim: { x: "r", drag: (p, v) => ({ r: (p.x - COMP.cx) / compScale(v) }) },
      height: { y: "h", drag: (p, v) => ({ h: (COMP.base - p.y) / compScale(v) - (v.model === 3 ? v.r : 0) }) },
      tip: { y: "k", drag: (p, v) => ({ k: (COMP.base - p.y) / compScale(v) - (v.model === 0 ? v.h : 0) }) },
      depth: { y: "t", drag: (p, v) => ({ t: ((v.h - (COMP.base - p.y) / compScale(v)) / v.h) * 100 }) },
    },
  },
  "solid-extremum": {
    render: extremumView,
    handles: {
      corner: { x: "x", drag: (p, v) => ({ x: (p.x - EXT.cx) / coneScale(v) }) },
      cut: { x: "c", drag: (p, v) => ({ c: (p.x - EXT.sheetX) / sheetScale(v) }) },
    },
  },
};
