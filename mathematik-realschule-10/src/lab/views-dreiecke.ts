import { fmt } from "../exercises/format";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  angleMark,
  circle,
  clamp,
  clipped,
  H,
  handle,
  type LabView,
  line,
  open,
  path,
  Plot,
  polygon,
  type Pt,
  rect,
  sideLabel,
  str,
  text,
  W,
} from "./svg";

const RAD = Math.PI / 180;
const sinD = (deg: number): number => Math.sin(deg * RAD);
const cosD = (deg: number): number => Math.cos(deg * RAD);
const toDeg = (rad: number): number => rad / RAD;

function unitOf(from: Pt, to: Pt): Pt {
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
}

/** The letter of the angle at `vertex`: on the bisector, `dist` px inside the angle. */
function angleLabel(vertex: Pt, p1: Pt, p2: Pt, dist: number, content: string, cls = "lab-text"): string {
  const u = unitOf(vertex, p1);
  const w = unitOf(vertex, p2);
  const bis = unitOf({ x: 0, y: 0 }, { x: u.x + w.x, y: u.y + w.y });
  return text(vertex.x + bis.x * dist, vertex.y + bis.y * dist + 4, content, cls, "middle");
}

/**
 * The frame of a plot with its own steps on both axes: background, grid,
 * axes through 0 (or along the border) and tick labels.
 */
function plotFrame(
  plot: Plot,
  xs: number[],
  ys: number[],
  xLabel: string,
  yLabel: string,
  xTick: (x: number) => string,
  yTick: (y: number) => string,
): string {
  const { box } = plot;
  let out = rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  for (const x of xs) out += line(plot.X(x), box.y, plot.X(x), box.y + box.h, "lab-grid");
  for (const y of ys) out += line(box.x, plot.Y(y), box.x + box.w, plot.Y(y), "lab-grid");
  const x0 = clamp(plot.X(0), box.x, box.x + box.w);
  const y0 = clamp(plot.Y(0), box.y, box.y + box.h);
  out += line(box.x, y0, box.x + box.w, y0, "lab-axis") + line(x0, box.y, x0, box.y + box.h, "lab-axis");
  out += text(box.x + box.w - 4, y0 - 6, xLabel, "lab-text-axis", "end");
  out += text(x0 + 6, box.y + 12, yLabel, "lab-text-axis");
  for (const x of xs) if (Math.abs(x) > 1e-9) out += text(plot.X(x), y0 + 13, xTick(x), "lab-text-tick", "middle");
  for (const y of ys) if (Math.abs(y) > 1e-9) out += text(x0 - 4, plot.Y(y) + 3.5, yTick(y), "lab-text-tick", "end");
  return out;
}

function steps(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let value = from; value <= to + 1e-9; value += step) out.push(Math.round(value * 1e6) / 1e6);
  return out;
}

const deg = (value: number, digits = 2): string => `${fmt(value, digits)}°`;

// ─── 2.1 Sinussatz: three quotients, and the two triangles of SsW ──────────

/** One triangle ABC: sides a, b, c opposite the angles α, β, γ (degrees). */
export interface Triangle {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
}

/** The triangle with AC = b, AB = c and the angle α at A. */
export function swsTriangle(b: number, c: number, alpha: number): Triangle {
  const a = Math.sqrt(Math.max(b * b + c * c - 2 * b * c * cosD(alpha), 0));
  const beta = toDeg(Math.atan2(b * sinD(alpha), c - b * cosD(alpha)));
  return { a, b, c, alpha, beta, gamma: 180 - alpha - beta };
}

/**
 * Every triangle with AC = b, the angle α at A and BC = a, B on the ray of α
 * (two sides and an opposite angle): none, one or two, the acute β first.
 */
export function ssaTriangles(b: number, alpha: number, a: number): Triangle[] {
  const h = b * sinD(alpha);
  const foot = b * cosD(alpha);
  const disc = a * a - h * h;
  if (disc < -1e-9) return [];
  const roots = Math.abs(disc) <= 1e-9 ? [foot] : [foot + Math.sqrt(disc), foot - Math.sqrt(disc)];
  return roots
    .filter((x) => x > 1e-9)
    .map((c) => {
      const beta = toDeg(Math.acos(clamp((c - foot) / a, -1, 1)));
      return { a, b, c, alpha, beta, gamma: 180 - alpha - beta };
    })
    .sort((s, t) => s.beta - t.beta);
}

/** The triangles the sine-law lab shows: one in view 0, the SsW solutions in view 1. */
export function sineLabTriangles(v: LabValues): Triangle[] {
  return v.view === 1 ? ssaTriangles(v.b, v.alpha, v.a) : [swsTriangle(v.b, v.c, v.alpha)];
}

const SINE = { ax: 150, base: 296, k: 20 };

function sinePoints(v: LabValues): { A: Pt; C: Pt } {
  const A: Pt = { x: SINE.ax, y: SINE.base };
  const C: Pt = { x: A.x + v.b * SINE.k * cosD(v.alpha), y: A.y - v.b * SINE.k * sinD(v.alpha) };
  return { A, C };
}

function sineQuotients(v: LabValues): string {
  const [t] = sineLabTriangles(v);
  const { A, C } = sinePoints(v);
  const B: Pt = { x: A.x + v.c * SINE.k, y: A.y };
  const F: Pt = { x: C.x, y: A.y };
  let out = open("Dreieck mit den Quotienten aus Seite und Sinus des Gegenwinkels");
  if (F.x < A.x - 0.5) out += line(F.x, F.y, A.x, A.y, "lab-dashed");
  if (F.x > B.x + 0.5) out += line(B.x, B.y, F.x, F.y, "lab-dashed");
  out += polygon([A, B, C], "lab-shape");
  out += line(C.x, C.y, F.x, F.y, "lab-dashed");
  if (Math.abs(F.x - A.x) > 8 && Math.abs(F.x - B.x) > 8) out += angleMark(F, C, F.x < A.x ? A : B, 10, "lab-angle", true);
  out += line(A.x, A.y, B.x, B.y, "lab-side-c") + line(B.x, B.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, A.x, A.y, "lab-side-b");
  out += angleMark(A, B, C, 24) + angleMark(B, C, A, 24) + angleMark(C, A, B, 20);
  out += angleLabel(A, B, C, 38, "α") + angleLabel(B, C, A, 38, "β") + angleLabel(C, A, B, 32, "γ");
  out += sideLabel(A, B, `c = ${fmt(t.c, 1)}`, 16, "lab-text lab-text-c");
  out += sideLabel(B, C, `a = ${fmt(t.a, 2)}`, 16, "lab-text lab-text-a");
  out += sideLabel(C, A, `b = ${fmt(t.b, 1)}`, 16, "lab-text lab-text-b");
  out += text(A.x - 8, A.y + 16, "A", "lab-text", "end") + text(B.x + 8, B.y + 16, "B", "lab-text");
  out += text(C.x, C.y - 12, "C", "lab-text", "middle");
  out += text(16, 26, "a : sin α = b : sin β = c : sin γ", "lab-text lab-text-big");
  out += text(16, 50, `a : sin α = ${fmt(t.a, 2)} : sin ${deg(t.alpha, 0)} ≈ ${fmt(t.a / sinD(t.alpha), 2)} cm`, "lab-text lab-text-a");
  out += text(16, 70, `b : sin β = ${fmt(t.b, 1)} : sin ${deg(t.beta)} ≈ ${fmt(t.b / sinD(t.beta), 2)} cm`, "lab-text lab-text-b");
  out += text(16, 90, `c : sin γ = ${fmt(t.c, 1)} : sin ${deg(t.gamma)} ≈ ${fmt(t.c / sinD(t.gamma), 2)} cm`, "lab-text lab-text-c");
  const h = t.b * sinD(t.alpha);
  out += text(W - 14, 116, "Höhe h = b · sin α = a · sin β", "lab-text-muted", "end");
  out += text(W - 14, 134, `h ≈ ${fmt(h, 2)} cm`, "lab-text-muted", "end");
  out += handle("C", C.x, C.y, "Ecke C: Winkel α und Seite b");
  out += handle("B", B.x, B.y, "Ecke B: Seite c");
  out += `</svg>`;
  return out;
}

function sineAmbiguous(v: LabValues): string {
  const { A, C } = sinePoints(v);
  const k = SINE.k;
  const solutions = ssaTriangles(v.b, v.alpha, v.a);
  const h = v.b * sinD(v.alpha);
  const F: Pt = { x: C.x, y: A.y };
  const two = solutions.length === 2;
  let out = open("Zwei Seiten und ein Gegenwinkel: Der Kreis um C trifft den Schenkel keinmal, einmal oder zweimal");
  out += `<defs><clipPath id="ssa-clip"><rect x="0" y="104" width="${W}" height="${H - 104}" /></clipPath></defs>`;
  const fills = ["lab-fill-a", "lab-fill-b"];
  solutions.forEach((s, i) => {
    out += polygon([A, { x: A.x + s.c * k, y: A.y }, C], fills[i]);
  });
  out += line(A.x, A.y, W - 14, A.y, "lab-ink");
  if (F.x < A.x - 0.5) out += line(F.x, F.y, A.x, A.y, "lab-dashed");
  out += line(C.x, C.y, F.x, F.y, "lab-dashed");
  out += clipped("ssa-clip", circle(C.x, C.y, v.a * k, "lab-ghost"));
  out += line(A.x, A.y, C.x, C.y, "lab-side-b");
  const ray: Pt = { x: A.x + 40, y: A.y };
  out += angleMark(A, ray, C, 26) + angleLabel(A, ray, C, 40, "α");
  out += sideLabel(C, A, `b = ${fmt(v.b, 1)}`, 16, "lab-text lab-text-b");
  solutions.forEach((s, i) => {
    const B: Pt = { x: A.x + s.c * k, y: A.y };
    out += line(B.x, B.y, C.x, C.y, "lab-side-a");
    out += angleMark(B, C, A, 18);
    out += circle(B.x, B.y, 5, "lab-point");
    out += text(B.x, B.y + 18, two ? `B${i === 0 ? "₁" : "₂"}` : "B", "lab-text", "middle");
    out += angleLabel(B, C, A, 32, two ? `β${i === 0 ? "₁" : "₂"}` : "β", "lab-text-small");
  });
  out += text(A.x - 8, A.y + 16, "A", "lab-text", "end") + text(C.x, C.y - 12, "C", "lab-text", "middle");
  out += text(C.x + 8, (C.y + F.y) / 2, `h = ${fmt(h, 2)}`, "lab-text-small");
  // the header: sin β, both candidates and the test with the angle sum
  const s = (v.b * sinD(v.alpha)) / v.a;
  if (s > 1 + 1e-9) {
    out += text(16, 26, `sin β = b · sin α : a ≈ ${fmt(s, 3)} > 1`, "lab-text lab-text-big");
    out += text(16, 50, `a = ${fmt(v.a, 1)} cm ist kürzer als die Höhe h ≈ ${fmt(h, 2)} cm.`, "lab-text lab-text-bad");
    out += text(16, 70, "Der Kreis um C erreicht den Schenkel nicht: kein Dreieck.", "lab-text-muted");
  } else {
    const beta1 = toDeg(Math.asin(clamp(s, -1, 1)));
    out += text(16, 26, `sin β = b · sin α : a ≈ ${fmt(s, 3)}`, "lab-text lab-text-big");
    if (Math.abs(s - 1) <= 1e-9) {
      out += text(16, 50, "β = 90°: Der Kreis berührt den Schenkel nur.", solutions.length ? "lab-text lab-text-ok" : "lab-text lab-text-bad");
      out += text(16, 70, solutions.length ? "Genau ein Dreieck, und es ist rechtwinklig." : "Mit α + 90° ≥ 180° bleibt kein Dreieck.", "lab-text-muted");
    } else {
      out += text(16, 50, `Kandidaten: β₁ ≈ ${deg(beta1)} und β₂ = 180° − β₁ ≈ ${deg(180 - beta1)}`, "lab-text");
      const message =
        solutions.length === 2
          ? [`Probe: α + β₂ ≈ ${deg(v.alpha + 180 - beta1)} < 180°: zwei Dreiecke`, "lab-text lab-text-ok"]
          : solutions.length === 1
            ? [`Probe: α + β₂ ≈ ${deg(v.alpha + 180 - beta1)} ≥ 180°: nur β₁, ein Dreieck`, "lab-text"]
            : [`Probe: schon α + β₁ ≈ ${deg(v.alpha + beta1)} ≥ 180°: kein Dreieck`, "lab-text lab-text-bad"];
      out += text(16, 70, message[0], message[1]);
    }
  }
  out += text(
    16,
    90,
    v.a < v.b ? "a < b: α liegt der kürzeren Seite gegenüber, Vorsicht!" : "a ≥ b: α liegt nicht der kürzeren Seite gegenüber.",
    "lab-text-muted",
  );
  out += handle("C", C.x, C.y, "Ecke C: Winkel α und Seite b");
  out += handle("R", C.x + v.a * k, C.y, "Zirkel um C: Seite a");
  out += `</svg>`;
  return out;
}

// ─── 2.2 Kosinussatz: SWS → c, SSS → γ ─────────────────────────────────────

/** The triangle of the cosine-law lab: SWS (a, b, γ) or SSS (a, b, c); null when the three sides form none. */
export function cosineLabTriangle(v: LabValues): { c: number; gamma: number } | null {
  const { a, b } = v;
  if (v.mode === 1) {
    const c = v.c;
    if (c >= a + b - 1e-9 || c <= Math.abs(a - b) + 1e-9) return null;
    return { c, gamma: toDeg(Math.acos(clamp((a * a + b * b - c * c) / (2 * a * b), -1, 1))) };
  }
  return { c: Math.sqrt(Math.max(a * a + b * b - 2 * a * b * cosD(v.gamma), 0)), gamma: v.gamma };
}

const COS = { cx: 165, base: 292, k: 14 };

function cosineLaw(v: LabValues, r: ReadoutValues): string {
  const k = COS.k;
  const C: Pt = { x: COS.cx, y: COS.base };
  const B: Pt = { x: C.x + v.a * k, y: C.y };
  const tri = cosineLabTriangle(v);
  const sss = v.mode === 1;
  const a2 = v.a * v.a;
  const b2 = v.b * v.b;
  let out = open(sss ? "Drei Seiten gegeben: der Winkel γ aus dem Kosinussatz" : "Zwei Seiten und der eingeschlossene Winkel: die dritte Seite aus dem Kosinussatz");
  if (sss) {
    // The circle around C (radius b) and the one around B (radius c) meet in A exactly when a triangle exists.
    out += `<defs><clipPath id="cos-clip"><rect x="0" y="100" width="330" height="${H - 100}" /></clipPath></defs>`;
    out += clipped("cos-clip", circle(C.x, C.y, v.b * k, "lab-ghost") + circle(B.x, B.y, v.c * k, "lab-ghost"));
  }
  if (tri) {
    const A: Pt = { x: C.x + v.b * k * cosD(tri.gamma), y: C.y - v.b * k * sinD(tri.gamma) };
    const right = Math.abs(tri.gamma - 90) < 1e-6;
    out += polygon([A, B, C], right ? "lab-fill-ok" : "lab-shape");
    out += line(B.x, B.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, A.x, A.y, "lab-side-b") + line(A.x, A.y, B.x, B.y, "lab-side-c");
    out += angleMark(C, B, A, 22, right ? "lab-angle-ok" : "lab-angle", right);
    out += angleLabel(C, B, A, 36, "γ");
    out += sideLabel(C, B, `a = ${fmt(v.a, 1)}`, 16, "lab-text lab-text-a");
    out += sideLabel(A, C, `b = ${fmt(v.b, 1)}`, 16, "lab-text lab-text-b");
    out += sideLabel(B, A, `c = ${fmt(tri.c, 2)}`, 16, "lab-text lab-text-c");
    out += text(A.x, A.y - 12, "A", "lab-text", "middle");
    if (!sss) out += handle("A", A.x, A.y, "Ecke A: Winkel γ und Seite b");
  } else {
    out += line(B.x, B.y, C.x, C.y, "lab-side-a");
    out += sideLabel(C, B, `a = ${fmt(v.a, 1)}`, 16, "lab-text lab-text-a");
  }
  out += text(C.x - 8, C.y + 16, "C", "lab-text", "end") + text(B.x + 8, B.y + 16, "B", "lab-text");
  if (!sss) out += handle("B", B.x, B.y, "Ecke B: Seite a");

  // the header: the law with the numbers of this triangle
  out += text(16, 26, sss ? "cos γ = (a² + b² − c²) : (2ab)" : "c² = a² + b² − 2ab · cos γ", "lab-text lab-text-big");
  if (!tri) {
    out += text(16, 50, `Kein Dreieck: c muss zwischen ${fmt(Math.abs(v.a - v.b), 1)} cm und ${fmt(v.a + v.b, 1)} cm liegen.`, "lab-text lab-text-bad");
    out += text(16, 70, "Die Kreise um C (Radius b) und um B (Radius c) treffen sich nicht.", "lab-text-muted");
  } else if (sss) {
    const top = a2 + b2 - v.c * v.c;
    out += text(16, 50, `cos γ = (${fmt(a2, 2)} + ${fmt(b2, 2)} − ${fmt(v.c * v.c, 2)}) : ${fmt(2 * v.a * v.b, 2)} ≈ ${fmt(top / (2 * v.a * v.b), 4)}`, "lab-text");
    out += text(16, 70, `γ ≈ ${deg(tri.gamma)}`, "lab-text lab-text-c");
  } else {
    const term = 2 * v.a * v.b * cosD(v.gamma);
    out += text(16, 50, `c² = ${fmt(a2, 2)} + ${fmt(b2, 2)} − 2 · ${fmt(v.a, 1)} · ${fmt(v.b, 1)} · cos ${deg(v.gamma, 0)} ≈ ${fmt(tri.c * tri.c, 2)}`, "lab-text");
    out += text(16, 70, `2ab · cos γ ≈ ${fmt(term, 2)} cm², also c ≈ ${fmt(tri.c, 2)} cm`, "lab-text lab-text-c");
  }

  // the panel: a² + b² against c²
  if (tri) {
    const c2 = tri.c * tri.c;
    const px = 348;
    const width = 156;
    const scale = width / Math.max(a2 + b2, c2);
    const y1 = 132;
    const y2 = 192;
    out += text(px, y1 - 8, "a² + b²", "lab-text-muted");
    out += rect(px, y1, a2 * scale, 22, "lab-fill-a") + rect(px + a2 * scale, y1, b2 * scale, 22, "lab-fill-b");
    out += text(px + 4, y1 + 15, fmt(a2 + b2, 2), "lab-text-small");
    out += text(px, y2 - 8, "c²", "lab-text-muted");
    out += rect(px, y2, c2 * scale, 22, "lab-fill-c");
    out += text(px + 4, y2 + 15, fmt(c2, 2), "lab-text-small");
    const gap = Math.abs(a2 + b2 - c2) * scale;
    if (gap > 2) {
      const from = Math.min(a2 + b2, c2) * scale;
      out += line(px + from, y2 + 32, px + from + gap, y2 + 32, "lab-side-c");
      out += text(px + width, y2 + 50, `Unterschied |2ab · cos γ| ≈ ${fmt(Math.abs(a2 + b2 - c2), 2)}`, "lab-text-small", "end");
    }
    out += text(px + width, 290, str(r, "kind"), Math.abs(tri.gamma - 90) < 1e-6 ? "lab-text lab-text-ok" : "lab-text", "end");
  }
  out += `</svg>`;
  return out;
}

// ─── 2.3 Flächeninhalt: A = ½ · a · b · sin γ ──────────────────────────────

const AREA = { cx: 168, base: 292, k: 15 };

function areaPlot(v: LabValues): { plot: Plot; ymax: number } {
  const top = 0.5 * v.a * v.b;
  const ymax = [4, 8, 16, 32].find((value) => value >= top * 1.04) ?? 36;
  return { plot: new Plot(0, 180, 0, ymax, { x: 330, y: 74, w: 174, h: 206 }), ymax };
}

function triangleArea(v: LabValues): string {
  const k = AREA.k;
  const C: Pt = { x: AREA.cx, y: AREA.base };
  const B: Pt = { x: C.x + v.a * k, y: C.y };
  const A: Pt = { x: C.x + v.b * k * cosD(v.gamma), y: C.y - v.b * k * sinD(v.gamma) };
  const twin: Pt = { x: C.x - v.b * k * cosD(v.gamma), y: A.y };
  const area = 0.5 * v.a * v.b * sinD(v.gamma);
  const h = v.b * sinD(v.gamma);
  const F: Pt = { x: A.x, y: C.y };
  const right = v.gamma === 90;
  let out = open("Dreieck mit zwei festen Seiten und veränderlichem Winkel, daneben der Flächeninhalt als Graph");
  if (!right) out += polygon([twin, B, C], "lab-ghost");
  if (F.x < C.x - 0.5) out += line(F.x, F.y, C.x, C.y, "lab-dashed");
  if (F.x > B.x + 0.5) out += line(B.x, B.y, F.x, F.y, "lab-dashed");
  out += polygon([A, B, C], right ? "lab-fill-ok" : "lab-fill-c");
  out += line(A.x, A.y, F.x, F.y, "lab-dashed");
  out += line(B.x, B.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, A.x, A.y, "lab-side-b");
  out += angleMark(C, B, A, 22, right ? "lab-angle-ok" : "lab-angle", right);
  out += angleLabel(C, B, A, 36, "γ");
  out += sideLabel(C, B, `a = ${fmt(v.a, 1)}`, 16, "lab-text lab-text-a");
  out += sideLabel(A, C, `b = ${fmt(v.b, 1)}`, 16, "lab-text lab-text-b");
  out += text(A.x + (A.x >= C.x ? 8 : -8), (A.y + F.y) / 2 + 4, `h = ${fmt(h, 2)}`, "lab-text-small", A.x >= C.x ? "start" : "end");
  out += text(A.x, A.y - 12, "A", "lab-text", "middle");
  out += text(C.x - 6, C.y + 16, "C", "lab-text", "end") + text(B.x + 6, B.y + 16, "B", "lab-text");
  if (!right) out += text(twin.x, twin.y - 12, "180° − γ", "lab-text-small", "middle");
  out += text(16, 26, `A = ½ · a · b · sin γ = ½ · ${fmt(v.a, 1)} · ${fmt(v.b, 1)} · sin ${deg(v.gamma, 0)} ≈ ${fmt(area, 2)} cm²`, "lab-text lab-text-big");
  out += text(16, 48, `Gestrichelt: 180° − γ = ${deg(180 - v.gamma, 0)}, gleiche Höhe, gleiche Fläche`, "lab-text-muted");

  // the graph of A(γ)
  const { plot, ymax } = areaPlot(v);
  out += plotFrame(plot, steps(0, 180, 30), steps(0, ymax, ymax / 4), "γ", "A", (x) => `${fmt(x, 0)}°`, (y) => fmt(y, 1));
  out += plot.graph((g) => 0.5 * v.a * v.b * sinD(g), "lab-curve");
  const P: Pt = plot.P(v.gamma, area);
  const Q: Pt = plot.P(180 - v.gamma, area);
  out += line(plot.box.x, P.y, plot.box.x + plot.box.w, P.y, "lab-dashed");
  out += line(P.x, P.y, P.x, plot.Y(0), "lab-thin") + line(Q.x, Q.y, Q.x, plot.Y(0), "lab-thin");
  out += circle(Q.x, Q.y, 5, "lab-point-b");
  out += text(plot.box.x + plot.box.w, plot.box.y - 8, `größter Wert ½ · a · b = ${fmt(0.5 * v.a * v.b, 2)} cm²`, "lab-text-small", "end");
  out += handle("A", A.x, A.y, "Ecke A: Winkel γ");
  out += handle("B", B.x, B.y, "Ecke B: Seite a");
  out += handle("P", P.x, P.y, "Punkt auf dem Graphen: Winkel γ");
  out += `</svg>`;
  return out;
}

// ─── 2.4 Dreiecksschar: A(x) and BₙCₙ(x) ────────────────────────────────────

/** The family of the lab: AB = 9 cm, AC = 3 cm, ∢BAC = 60°; ABₙ = (9 − x) cm, ACₙ = (3 + 2x) cm. */
export const FAMILY = { ab: 9, ac: 3, grow: 2, alpha: 60 };

export function familyAt(x: number): { ab: number; ac: number; area: number; bc: number } {
  const ab = FAMILY.ab - x;
  const ac = FAMILY.ac + FAMILY.grow * x;
  const area = 0.5 * ab * ac * sinD(FAMILY.alpha);
  const bc = Math.sqrt(Math.max(ab * ab + ac * ac - 2 * ab * ac * cosD(FAMILY.alpha), 0));
  return { ab, ac, area, bc };
}

const FAM = { ax: 26, base: 312, k: 12.5 };
const FAMILY_PLOT = new Plot(0, 9.4, 0, 26, { x: 236, y: 70, w: 268, h: 236 });

function familyPoints(x: number): { A: Pt; B: Pt; C: Pt; Bn: Pt; Cn: Pt } {
  const k = FAM.k;
  const A: Pt = { x: FAM.ax, y: FAM.base };
  const dir: Pt = { x: cosD(FAMILY.alpha), y: -sinD(FAMILY.alpha) };
  const { ab, ac } = familyAt(x);
  return {
    A,
    B: { x: A.x + FAMILY.ab * k, y: A.y },
    C: { x: A.x + FAMILY.ac * k * dir.x, y: A.y + FAMILY.ac * k * dir.y },
    Bn: { x: A.x + ab * k, y: A.y },
    Cn: { x: A.x + ac * k * dir.x, y: A.y + ac * k * dir.y },
  };
}

function familyValue(v: LabValues, x: number): number {
  const at = familyAt(x);
  return v.graph === 1 ? at.bc : at.area;
}

function triangleFamily(v: LabValues): string {
  const { A, B, C, Bn, Cn } = familyPoints(v.x);
  const at = familyAt(v.x);
  const plot = FAMILY_PLOT;
  const extreme = v.graph === 1 ? 1.5 : 3.75;
  const atExtreme = Math.abs(v.x - extreme) < 1e-9;
  let out = open("Eine Schar von Dreiecken ABₙCₙ, daneben ihr Flächeninhalt oder die Länge BₙCₙ in Abhängigkeit von x");
  out += polygon([A, B, C], "lab-ghost");
  if (at.ab > 1e-9) out += polygon([A, Bn, Cn], atExtreme ? "lab-fill-ok" : "lab-fill-c");
  out += line(A.x, A.y, Cn.x, Cn.y, "lab-ink") + line(A.x, A.y, B.x, B.y, "lab-ink");
  if (v.x > 0) {
    out += line(Bn.x, Bn.y, B.x, B.y, "lab-side-a");
    out += line(C.x, C.y, Cn.x, Cn.y, "lab-side-b");
  }
  out += line(Bn.x, Bn.y, Cn.x, Cn.y, v.graph === 1 ? "lab-side-c" : "lab-thin");
  out += angleMark(A, B, Cn, 22);
  out += text(A.x + 30, A.y - 8, "60°", "lab-text-small");
  out += text(A.x - 4, A.y + 16, "A", "lab-text", "middle");
  out += text(B.x + 4, B.y + 16, "B", "lab-text-small", "middle");
  out += text(C.x - 8, C.y, "C", "lab-text-small", "end");
  out += circle(B.x, B.y, 3, "lab-dot-small") + circle(C.x, C.y, 3, "lab-dot-small");
  out += text(Bn.x - 2, Bn.y + 30, "Bₙ", "lab-text", "middle");
  out += text(Cn.x - 10, Cn.y - 2, "Cₙ", "lab-text", "end");
  if (v.x > 0) {
    out += text((Bn.x + B.x) / 2, B.y - 8, "x", "lab-text-small lab-text-a", "middle");
    out += text((C.x + Cn.x) / 2 - 10, (C.y + Cn.y) / 2, "2x", "lab-text-small lab-text-b", "end");
  }
  out += text(16, 24, "ABₙ = (9 − x) cm, ACₙ = (3 + 2x) cm, ∢BₙACₙ = 60°, 0 ≤ x < 9", "lab-text-muted");
  out += text(
    16,
    46,
    v.graph === 1
      ? `BₙCₙ(x) = √(7x² − 21x + 63) cm ≈ ${fmt(at.bc, 2)} cm`
      : `A(x) = ½ · (9 − x) · (3 + 2x) · sin 60° cm² ≈ ${fmt(at.area, 2)} cm²`,
    "lab-text lab-text-big",
  );

  // the graph of the chosen quantity
  out += plotFrame(plot, steps(0, 9, 1), steps(0, 25, 5), "x", v.graph === 1 ? "BₙCₙ" : "A", (x) => fmt(x, 0), (y) => fmt(y, 0));
  out += plot.graph((x) => (x <= FAMILY.ab ? familyValue(v, x) : Number.NaN), v.graph === 1 ? "lab-curve-2" : "lab-curve");
  const P: Pt = plot.P(v.x, familyValue(v, v.x));
  out += line(P.x, P.y, P.x, plot.Y(0), "lab-dashed");
  if (atExtreme) {
    out += circle(P.x, P.y, 11, "lab-target");
    out += text(P.x, P.y - 16, v.graph === 1 ? "kürzeste Seite" : "größter Flächeninhalt", "lab-text-small lab-text-ok", "middle");
  }
  if (at.ab <= 1e-9) out += text(plot.X(9), plot.Y(3), "kein Dreieck", "lab-text-small lab-text-bad", "end");
  out += handle("Bn", Bn.x, Bn.y, "Punkt Bₙ: x ändern");
  out += handle("Cn", Cn.x, Cn.y, "Punkt Cₙ: x ändern");
  out += handle("P", P.x, P.y, "Punkt auf dem Graphen: x ändern");
  out += `</svg>`;
  return out;
}

// ─── 2.5 Trigonometrische Gleichungen und Trägergraph ──────────────────────

/** The left-hand sides of the lab's equations, as functions of φ in degrees. */
export const TRIG_EQUATIONS: Array<{ label: string; f: (phi: number) => number }> = [
  { label: "sin φ", f: (phi) => sinD(phi) },
  { label: "cos φ", f: (phi) => cosD(phi) },
  { label: "tan φ", f: (phi) => Math.tan(phi * RAD) },
  { label: "2 · sin φ · cos φ", f: (phi) => 2 * sinD(phi) * cosD(phi) },
];

/** The interval of the lab: 0 for 0° ≤ φ < 360°, 1 for 0° < φ < 180°. */
export function inTrigInterval(phi: number, interval: number): boolean {
  return interval === 1 ? phi > 1e-7 && phi < 180 - 1e-7 : phi > -1e-7 && phi < 360 - 1e-7;
}

/** Every solution of the lab's equation number `eq` = k in the interval, ascending. */
export function trigSolutions(eq: number, k: number, interval: number): number[] {
  let candidates: number[] = [];
  if (eq === 0 || eq === 3) {
    if (Math.abs(k) > 1 + 1e-12) return [];
    const base = toDeg(Math.asin(clamp(k, -1, 1)));
    // sin ψ = k for ψ = base and ψ = 180° − base, every 360°; for eq 3, ψ = 2φ.
    for (let turn = -1; turn <= 2; turn++) candidates.push(base + 360 * turn, 180 - base + 360 * turn);
    if (eq === 3) candidates = candidates.map((psi) => psi / 2);
  } else if (eq === 1) {
    if (Math.abs(k) > 1 + 1e-12) return [];
    const base = toDeg(Math.acos(clamp(k, -1, 1)));
    for (let turn = -1; turn <= 1; turn++) candidates.push(base + 360 * turn, 360 - base + 360 * turn);
  } else {
    const base = toDeg(Math.atan(k));
    for (let turn = -1; turn <= 2; turn++) candidates.push(base + 180 * turn);
  }
  const inside = candidates
    .map((phi) => Math.round(phi * 1e9) / 1e9)
    .filter((phi) => inTrigInterval(phi, interval))
    .sort((p, q) => p - q);
  return inside.filter((phi, i) => i === 0 || phi - inside[i - 1] > 1e-6);
}

/** The points Pₙ(2 · cos φ | 4 · sin² φ) of the lab; their Trägergraph is y = −x² + 4. */
export function carrierPoint(phi: number): Pt {
  return { x: 2 * cosD(phi), y: 4 * sinD(phi) ** 2 };
}

function equationPlot(v: LabValues): Plot {
  return new Plot(0, v.interval === 1 ? 180 : 360, -2.2, 2.2, { x: 40, y: 92, w: 462, h: 228 });
}

function trigHint(eq: number): string {
  if (eq === 0) return "Zweite Lösung: sin(180° − φ) = sin φ; Periode 360°";
  if (eq === 1) return "Zweite Lösung: cos(360° − φ) = cos φ; Periode 360°";
  if (eq === 2) return "Der Tangens wiederholt sich nach 180°: tan(φ + 180°) = tan φ";
  return "Additionstheorem: 2 · sin φ · cos φ = sin(2φ); erst nach 2φ auflösen";
}

function trigEquation(v: LabValues): string {
  const plot = equationPlot(v);
  const eq = TRIG_EQUATIONS[v.eq] ?? TRIG_EQUATIONS[0];
  const solutions = trigSolutions(v.eq, v.k, v.interval);
  const xmax = plot.xmax;
  let out = open("Graph der linken Seite und die Gerade y = k: Die Schnittstellen sind die Lösungen");
  out += `<defs>${plot.clip("trig-clip")}</defs>`;
  out += plotFrame(plot, steps(0, xmax, xmax > 180 ? 45 : 30), steps(-2, 2, 0.5), "φ", "y", (x) => `${fmt(x, 0)}°`, (y) => fmt(y, 1));
  if (v.eq === 2) {
    for (const pole of [90, 270]) {
      if (pole < xmax) out += line(plot.X(pole), plot.box.y, plot.X(pole), plot.box.y + plot.box.h, "lab-dashed");
    }
  }
  out += clipped("trig-clip", plot.graph(eq.f, "lab-curve", 480) + line(plot.box.x, plot.Y(v.k), plot.box.x + plot.box.w, plot.Y(v.k), "lab-curve-2"));
  solutions.forEach((phi, i) => {
    const P = plot.P(phi, v.k);
    out += line(P.x, P.y, P.x, plot.Y(0), "lab-dashed");
    out += circle(P.x, P.y, 5.5, "lab-point-ok");
    const y = v.k >= 0 ? plot.Y(0) + 26 + (i % 2) * 12 : plot.Y(0) - 10 - (i % 2) * 12;
    out += text(P.x, y, deg(phi), "lab-text-small lab-text-ok", "middle");
  });
  out += text(16, 26, `${eq.label} = ${fmt(v.k, 2)}`, "lab-text lab-text-big");
  out += text(W - 16, 26, v.interval === 1 ? "für 0° < φ < 180°" : "für 0° ≤ φ < 360°", "lab-text-muted", "end");
  const names = ["₁", "₂", "₃", "₄"];
  out += text(
    16,
    50,
    solutions.length === 0
      ? "Keine Lösung: Die Gerade schneidet den Graphen im Intervall nicht."
      : `${solutions.length === 1 ? "Eine Lösung" : `${solutions.length} Lösungen`}: ${solutions.map((phi, i) => `φ${names[i] ?? ""} ≈ ${deg(phi)}`).join(", ")}`,
    solutions.length === 0 ? "lab-text lab-text-bad" : "lab-text lab-text-ok",
  );
  out += text(16, 72, trigHint(v.eq), "lab-text-muted");
  out += handle("k", plot.X(xmax) - 12, plot.Y(v.k), "Gerade y = k verschieben");
  out += `</svg>`;
  return out;
}

const CARRIER_PLOT = new Plot(-2.5, 2.5, -0.5, 4.5, { x: 232, y: 40, w: 272, h: 272 });
const INSET = { cx: 118, cy: 168, r: 78 };

function carrierGraph(v: LabValues): string {
  const plot = CARRIER_PLOT;
  const P = carrierPoint(v.phi);
  const Pp = plot.P(P.x, P.y);
  const onLine = Math.abs(P.y - 3) < 1e-9;
  let out = open("Die Punkte Pₙ(2 · cos φ | 4 · sin² φ) und ihr Trägergraph, eine Parabel");
  out += plotFrame(plot, steps(-2, 2, 1), steps(0, 4, 1), "x", "y", (x) => fmt(x, 0), (y) => fmt(y, 0));
  out += line(plot.box.x, plot.Y(3), plot.box.x + plot.box.w, plot.Y(3), "lab-dashed");
  out += text(plot.box.x + plot.box.w - 4, plot.Y(3) - 5, "y = 3", "lab-text-small", "end");
  out += plot.graph((x) => (Math.abs(x) <= 2 + 1e-9 ? 4 - x * x : Number.NaN), "lab-curve-c", 200);
  out += text(plot.X(-2.45), plot.Y(4.25), "y = −x² + 4", "lab-text-small lab-text-c");
  out += line(Pp.x, Pp.y, Pp.x, plot.Y(0), "lab-dashed") + line(Pp.x, Pp.y, plot.X(0), Pp.y, "lab-dashed");
  out += text(
    Pp.x + (P.x > 0 ? -12 : 12),
    Pp.y - 12,
    `Pₙ(${fmt(P.x, 2)} | ${fmt(P.y, 2)})`,
    onLine ? "lab-text lab-text-ok" : "lab-text",
    P.x > 0 ? "end" : "start",
  );

  // the inset: the angle φ on a half circle with radius 1
  const { cx, cy, r } = INSET;
  const Q: Pt = { x: cx + r * cosD(v.phi), y: cy - r * sinD(v.phi) };
  out += path(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, "lab-thin");
  out += line(cx - r - 8, cy, cx + r + 8, cy, "lab-axis");
  out += line(cx, cy, Q.x, Q.y, "lab-ink");
  out += line(Q.x, Q.y, Q.x, cy, "lab-side-a") + line(cx, cy, Q.x, cy, "lab-side-b");
  out += angleMark({ x: cx, y: cy }, { x: cx + r, y: cy }, Q, 18);
  out += text(cx + 24, cy - 6, "φ", "lab-text-small");
  out += text(cx, cy + 20, "Halbkreis mit Radius 1", "lab-text-small", "middle");
  out += text(20, 26, `φ = ${deg(v.phi, 0)}`, "lab-text lab-text-big");
  out += text(20, 214, `x = 2 · cos φ ≈ ${fmt(P.x, 2)}`, "lab-text lab-text-b");
  out += text(20, 234, `y = 4 · sin² φ ≈ ${fmt(P.y, 2)}`, "lab-text lab-text-a");
  out += text(20, 262, "cos φ = x : 2", "lab-text-muted");
  out += text(20, 280, "sin² φ = 1 − cos² φ = 1 − x²/4", "lab-text-muted");
  out += text(20, 298, "⇒ y = 4 · (1 − x²/4) = −x² + 4", "lab-text-muted");
  out += handle("Q", Q.x, Q.y, "Winkel φ am Halbkreis");
  out += handle("P", Pp.x, Pp.y, "Punkt Pₙ auf dem Trägergraphen");
  out += `</svg>`;
  return out;
}

export const DREIECKE_VIEWS: Record<"sine-law" | "cosine-law" | "triangle-area" | "triangle-family" | "trig-equation", LabView> = {
  "sine-law": {
    render: (v) => (v.view === 1 ? sineAmbiguous(v) : sineQuotients(v)),
    handles: {
      C: {
        x: "alpha",
        y: "b",
        drag: (p) => {
          const dx = p.x - SINE.ax;
          const dy = SINE.base - p.y;
          return { alpha: toDeg(Math.atan2(dy, dx)), b: Math.hypot(dx, dy) / SINE.k };
        },
      },
      B: { x: "c", drag: (p) => ({ c: (p.x - SINE.ax) / SINE.k }) },
      R: {
        x: "a",
        drag: (p, v) => {
          const { C } = sinePoints(v);
          return { a: Math.hypot(p.x - C.x, p.y - C.y) / SINE.k };
        },
      },
    },
  },
  "cosine-law": {
    render: cosineLaw,
    handles: {
      A: {
        x: "gamma",
        y: "b",
        drag: (p) => {
          const dx = p.x - COS.cx;
          const dy = COS.base - p.y;
          return { gamma: toDeg(Math.atan2(dy, dx)), b: Math.hypot(dx, dy) / COS.k };
        },
      },
      B: { x: "a", drag: (p) => ({ a: (p.x - COS.cx) / COS.k }) },
    },
  },
  "triangle-area": {
    render: triangleArea,
    handles: {
      A: {
        x: "gamma",
        drag: (p) => {
          const angle = toDeg(Math.atan2(AREA.base - p.y, p.x - AREA.cx));
          // Below the base the angle turns negative: keep the side the pointer is on.
          return { gamma: angle < 0 ? (p.x >= AREA.cx ? 5 : 175) : angle };
        },
      },
      B: { x: "a", drag: (p) => ({ a: (p.x - AREA.cx) / AREA.k }) },
      P: { x: "gamma", drag: (p, v) => ({ gamma: areaPlot(v).plot.invX(p.x) }) },
    },
  },
  "triangle-family": {
    render: triangleFamily,
    handles: {
      Bn: { x: "x", drag: (p) => ({ x: FAMILY.ab - (p.x - FAM.ax) / FAM.k }) },
      Cn: {
        x: "x",
        drag: (p) => {
          const along = (p.x - FAM.ax) * cosD(FAMILY.alpha) - (p.y - FAM.base) * sinD(FAMILY.alpha);
          return { x: (along / FAM.k - FAMILY.ac) / FAMILY.grow };
        },
      },
      P: { x: "x", drag: (p) => ({ x: FAMILY_PLOT.invX(p.x) }) },
    },
  },
  "trig-equation": {
    render: (v) => (v.view === 1 ? carrierGraph(v) : trigEquation(v)),
    handles: {
      k: { y: "k", drag: (p, v) => ({ k: equationPlot(v).invY(p.y) }) },
      P: {
        x: "phi",
        // The point of the curve nearest to the pointer: acos(x : 2) alone would jump near 0° and 180°.
        drag: (p) => {
          let best = 0;
          let bestDistance = Number.POSITIVE_INFINITY;
          for (let i = 0; i <= 720; i++) {
            const point = carrierPoint(i / 4);
            const at = CARRIER_PLOT.P(point.x, point.y);
            const distance = Math.hypot(at.x - p.x, at.y - p.y);
            if (distance < bestDistance) {
              bestDistance = distance;
              best = i / 4;
            }
          }
          return { phi: best };
        },
      },
      Q: {
        x: "phi",
        drag: (p) => {
          const angle = toDeg(Math.atan2(INSET.cy - p.y, p.x - INSET.cx));
          return { phi: angle < 0 ? (p.x >= INSET.cx ? 0 : 180) : angle };
        },
      },
    },
  },
};
