import { fmt, linear, quadratic, term } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  circle,
  clipped,
  handle,
  infoBox,
  type LabView,
  line,
  open,
  Plot,
  type Pt,
  polygon,
  rect,
  text,
} from "./svg";

// ─── Shared helpers ─────────────────────────────────────────────────────────

type Line = [string, string];

/** Filled strip between the graph of f and the x-axis on [x0; x1]. */
function shade(
  plot: Plot,
  f: (x: number) => number,
  x0: number,
  x1: number,
  cls: string,
): string {
  if (!(x1 > x0)) return "";
  const pts: Pt[] = [];
  const samples = 24;
  for (let i = 0; i <= samples; i++) {
    const x = x0 + ((x1 - x0) * i) / samples;
    pts.push(plot.P(x, f(x)));
  }
  pts.push(plot.P(x1, 0), plot.P(x0, 0));
  return polygon(pts, cls);
}

/** The signed area of f on [x0; x1] split at all inner zeros of f. */
export function signedAreas(
  F: (x: number) => number,
  zeros: number[],
  x0: number,
  x1: number,
): { ap: number; am: number; bilanz: number } {
  const p = Math.min(x0, x1);
  const q = Math.max(x0, x1);
  const cuts = [p, ...zeros.filter((z) => z > p + 1e-9 && z < q - 1e-9).sort((a, b) => a - b), q];
  let ap = 0;
  let am = 0;
  for (let i = 0; i + 1 < cuts.length; i++) {
    const v = F(cuts[i + 1]) - F(cuts[i]);
    if (v >= 0) ap += v;
    else am -= v;
  }
  return { ap, am, bilanz: ap - am };
}

// ─── 1.1 Das bestimmte Integral als Flächenbilanz ───────────────────────────

const bilanzPlot = () => new Plot(-7, 7, -9, 9);

/** A⁺, A⁻ and the Bilanz of f(x) = m x + t over [min(a,b); max(a,b)], exactly. */
export function linearBilanz(
  m: number,
  t: number,
  a: number,
  b: number,
): { ap: number; am: number; bilanz: number } {
  const F = (x: number) => (m * x * x) / 2 + t * x;
  const root = m === 0 ? null : -t / m;
  return signedAreas(F, root === null ? [] : [root], a, b);
}

function areaBilanz(v: LabValues): string {
  const plot = bilanzPlot();
  const f = (x: number) => v.m * x + v.t;
  const p = Math.min(v.a, v.b);
  const q = Math.max(v.a, v.b);
  const root = v.m === 0 ? null : -v.t / v.m;
  const { ap, am, bilanz } = linearBilanz(v.m, v.t, v.a, v.b);
  let out = open("Eine Gerade über einem Intervall: Fläche über der Achse positiv, darunter negativ");
  out += plot.clip("clip-bilanz") + plot.grid(1, 2);
  const cuts = [p, ...(root !== null && root > p && root < q ? [root] : []), q];
  let shading = "";
  for (let i = 0; i + 1 < cuts.length; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    shading += shade(plot, f, cuts[i], cuts[i + 1], f(mid) >= 0 ? "lab-fill-ok" : "lab-fill-b");
  }
  out += clipped("clip-bilanz", shading + plot.lineThrough(v.m, v.t, "lab-curve"));
  const y0 = plot.Y(0);
  out += line(plot.X(p), plot.box.y, plot.X(p), plot.box.y + plot.box.h, "lab-dashed");
  out += line(plot.X(q), plot.box.y, plot.X(q), plot.box.y + plot.box.h, "lab-dashed");
  out += text(plot.X(p), plot.box.y + plot.box.h - 8, `a = ${fmt(p)}`, "lab-text-axis", "middle");
  out += text(plot.X(q), plot.box.y - 6, `b = ${fmt(q)}`, "lab-text-axis", "middle");
  const lines: Line[] = [
    [`f(x) = ${linear(v.m, v.t)}`, "lab-text lab-text-big"],
    [`A⁺ = ${fmt(ap)} FE`, "lab-text lab-text-ok"],
    [`A⁻ = ${fmt(am)} FE`, "lab-text lab-text-b"],
    [`Bilanz = A⁺ − A⁻ = ${fmt(bilanz)} FE`, "lab-text lab-text-c"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  out += handle("ha", plot.X(v.a), y0, "Intervallgrenze a");
  out += handle("hb", plot.X(v.b), y0, "Intervallgrenze b", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 1.2 Die Integralfunktion ───────────────────────────────────────────────

const integralPlot = () => new Plot(-5, 5, -15, 15);

/** F(x) = ∫₀ˣ (m t + t₂) dt = m x² : 2 + t₂ x. */
export function integralFunction(m: number, t: number, x: number): number {
  return (m * x * x) / 2 + t * x;
}

function integralfunktion(v: LabValues): string {
  const plot = integralPlot();
  const f = (x: number) => v.m * x + v.t;
  const F = (x: number) => integralFunction(v.m, v.t, x);
  const fx = f(v.x);
  let out = open("Integrand f und Integralfunktion F in zwei Farben, x als Ziehpunkt");
  out += plot.clip("clip-if") + plot.grid(1, 2);
  out += clipped("clip-if", plot.graph(f, "lab-curve-2") + plot.graph(F, "lab-curve"));
  const X = plot.X(v.x);
  out += line(X, plot.box.y, X, plot.box.y + plot.box.h, "lab-dashed");
  const art = fx > 0 ? "f(x) > 0: F steigt" : fx < 0 ? "f(x) < 0: F fällt" : "f(x) = 0: Extremstelle von F";
  const lines: Line[] = [
    [`f(x) = ${linear(v.m, v.t)} (blau)`, "lab-text"],
    [`F(x) = ${fmt(v.m / 2)}x²${term(v.t, "x", false)}`, "lab-text lab-text-big"],
    [`F(${fmt(v.x)}) = ${fmt(F(v.x))}`, "lab-text lab-text-c"],
    [art, fx === 0 ? "lab-text lab-text-ok" : "lab-text-muted"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  const clampedY = Math.min(plot.box.y + plot.box.h - 4, Math.max(plot.box.y + 4, plot.Y(F(v.x))));
  out += handle("hx", X, clampedY, "Stelle x");
  out += handle("ht", plot.X(0), plot.Y(v.t), "Achsenabschnitt t von f", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 1.3 Der Hauptsatz der Differential- und Integralrechnung ───────────────

const hauptPlot = () => new Plot(-7, 7, -12, 12);

/** A⁺, A⁻ and the Bilanz of f(x) = a x² + b x + c over [min(u,v); max(u,v)], exactly. */
export function polyBilanz(
  a: number,
  b: number,
  c: number,
  u: number,
  v: number,
): { ap: number; am: number; bilanz: number } {
  const F = (x: number) => (a * x * x * x) / 3 + (b * x * x) / 2 + c * x;
  const zeros: number[] = [];
  if (a === 0) {
    if (b !== 0) zeros.push(-c / b);
  } else {
    const D = b * b - 4 * a * c;
    if (D >= 0) {
      const r = Math.sqrt(D);
      zeros.push((-b - r) / (2 * a), (-b + r) / (2 * a));
    }
  }
  return signedAreas(F, zeros, u, v);
}

function hauptsatz(v: LabValues): string {
  const plot = hauptPlot();
  const f = (x: number) => v.a * x * x + v.b * x + v.c;
  const F = (x: number) => (v.a * x * x * x) / 3 + (v.b * x * x) / 2 + v.c * x;
  const p = Math.min(v.u, v.v);
  const q = Math.max(v.u, v.v);
  const raw = polyBilanz(v.a, v.b, v.c, v.u, v.v);
  const { ap, am } = raw;
  const bilanz = v.u <= v.v ? raw.bilanz : -raw.bilanz;
  const fbfa = F(v.v) - F(v.u);
  let out = open("Parabelstück mit markiertem Intervall: Flächen über und unter der Achse");
  out += plot.clip("clip-hs") + plot.grid(1, 2);
  const zeros: number[] = [];
  if (v.a === 0) {
    if (v.b !== 0) zeros.push(-v.c / v.b);
  } else {
    const D = v.b * v.b - 4 * v.a * v.c;
    if (D >= 0) {
      const r = Math.sqrt(D);
      zeros.push((-v.b - r) / (2 * v.a), (-v.b + r) / (2 * v.a));
    }
  }
  const cuts = [p, ...zeros.filter((z) => z > p && z < q).sort((x, y) => x - y), q];
  let shading = "";
  for (let i = 0; i + 1 < cuts.length; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    shading += shade(plot, f, cuts[i], cuts[i + 1], f(mid) >= 0 ? "lab-fill-ok" : "lab-fill-b");
  }
  out += clipped("clip-hs", shading + plot.graph(f, "lab-curve"));
  const y0 = plot.Y(0);
  out += line(plot.X(p), plot.box.y, plot.X(p), plot.box.y + plot.box.h, "lab-dashed");
  out += line(plot.X(q), plot.box.y, plot.X(q), plot.box.y + plot.box.h, "lab-dashed");
  const lines: Line[] = [
    [`f(x) = ${quadratic(v.a, v.b, v.c)}`, "lab-text lab-text-big"],
    [`F(v) − F(u) = ${fmt(fbfa)}`, "lab-text"],
    [`Bilanz von u nach v = ${fmt(bilanz)}${v.u > v.v ? " = −(A⁺ − A⁻)" : " = A⁺ − A⁻"}`, "lab-text lab-text-c"],
    [`A⁺ = ${fmt(ap)}, A⁻ = ${fmt(am)} zwischen den Grenzen`, "lab-text-muted"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  out += handle("hu", plot.X(v.u), y0, "Intervallgrenze u");
  out += handle("hv", plot.X(v.v), y0, "Intervallgrenze v", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 1.4 Vom Integranden zur Integralfunktion und zurück ────────────────────

const schlussPlot = () => new Plot(-5, 5, -15, 15);

/** f(x) = a(x − s)² + k. */
export function paraF(a: number, s: number, k: number, x: number): number {
  return a * (x - s) * (x - s) + k;
}

/** F(x) = ∫₀ˣ f(t) dt with f(t) = a(t − s)² + k, exactly. */
export function paraIntegral(a: number, s: number, k: number, x: number): number {
  return (a * ((x - s) ** 3 + s ** 3)) / 3 + k * x;
}

/** The real zeros of f, the double root included; empty when there are none. */
export function paraZeros(a: number, s: number, k: number): number[] {
  if (a === 0) return [];
  const d = -k / a;
  if (d < 0) return [];
  if (d === 0) return [s];
  return [s - Math.sqrt(d), s + Math.sqrt(d)];
}

/** Zeros of f with a sign change (Extremstellen of F) inside [lo; hi]. */
export function signChangeCount(a: number, s: number, k: number, lo: number, hi: number): number {
  if (a === 0) return 0;
  const d = -k / a;
  if (d <= 0) return 0;
  return [s - Math.sqrt(d), s + Math.sqrt(d)].filter((z) => z >= lo && z <= hi).length;
}

function graphSchluss(v: LabValues): string {
  const plot = schlussPlot();
  const f = (x: number) => paraF(v.a, v.s, v.k, x);
  const F = (x: number) => paraIntegral(v.a, v.s, v.k, x);
  const count = signChangeCount(v.a, v.s, v.k, -5, 5);
  let out = open("Parabelstück f als Integrand und die Integralfunktion F, x als Ziehpunkt");
  out += plot.clip("clip-gs") + plot.grid(1, 2);
  out += clipped("clip-gs", plot.graph(f, "lab-curve-2") + plot.graph(F, "lab-curve"));
  const X = plot.X(v.x);
  out += line(X, plot.box.y, X, plot.box.y + plot.box.h, "lab-dashed");
  const art =
    Math.abs(f(v.x)) < 1e-9
      ? "f(x) = 0: Extremstellen-Kandidat"
      : f(v.x) > 0
        ? "f(x) > 0: F steigt hier"
        : "f(x) < 0: F fällt hier";
  const lines: Line[] = [
    [`f(x) = ${vertexText(v.a, v.s, v.k)}`, "lab-text lab-text-big"],
    [`F(${fmt(v.x)}) = ${fmt(F(v.x))}`, "lab-text lab-text-c"],
    [`F′(x) = f(x) = ${fmt(f(v.x))}`, "lab-text"],
    [`Extremstellen im Fenster: ${count}`, "lab-text-muted"],
    [art, "lab-text-muted"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  const clampedY = Math.min(plot.box.y + plot.box.h - 4, Math.max(plot.box.y + 4, plot.Y(F(v.x))));
  out += handle("hx", X, clampedY, "Stelle x");
  const S = plot.P(v.s, v.k);
  out += handle("hs", S.x, Math.min(plot.box.y + plot.box.h - 4, Math.max(plot.box.y + 4, S.y)), "Scheitel von f: s ändern", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

/** a(x − s)² + k as the blackboard writes it. */
function vertexText(a: number, s: number, k: number): string {
  if (a === 0) return fmt(k);
  const inner = s === 0 ? "x²" : s > 0 ? `(x − ${fmt(s)})²` : `(x + ${fmt(-s)})²`;
  const factor = a === 1 ? "" : a === -1 ? "−" : fmt(a);
  return `${factor}${inner}${term(k, "", false)}`;
}

// ─── 1.5 Stammfunktionen und Integrationsregeln ─────────────────────────────

const stammPlot = () => new Plot(0, 5, -6, 20);

/** The antiderivative family of the lab at the set x, with its probe. */
export function stammCase(v: LabValues): {
  termF: string;
  Fx: number;
  fx: number;
  probe: number;
} {
  const h = 0.01;
  let termF: string;
  let f: (x: number) => number;
  let F: (x: number) => number;
  if (v.fam === 0) {
    const n = v.n;
    f = (x) => x ** n;
    F = (x) => x ** (n + 1) / (n + 1);
    termF = `F(x) = x^${n + 1} : ${n + 1} + C`;
  } else if (v.fam === 1) {
    f = (x) => Math.exp(v.a * x + v.b);
    F = (x) => Math.exp(v.a * x + v.b) / v.a;
    termF = `F(x) = e^(${fmt(v.a)}x${term(v.b, "", false)}) : ${fmt(v.a)} + C`;
  } else if (v.fam === 2) {
    const g = (x: number) => v.p * x + v.q;
    f = (x) => v.p / g(x);
    F = (x) => Math.log(Math.abs(g(x)));
    termF = `F(x) = ln|${fmt(v.p)}x${term(v.q, "", false)}| + C`;
  } else {
    f = (x) => v.p * Math.exp(v.p * x + v.q);
    F = (x) => Math.exp(v.p * x + v.q);
    termF = `F(x) = e^(${fmt(v.p)}x${term(v.q, "", false)}) + C`;
  }
  const Fx = F(v.x);
  const fx = f(v.x);
  const probe = Math.abs((F(v.x + h) - F(v.x)) / h - fx);
  return { termF, Fx, fx, probe };
}

function stammfunktion(v: LabValues): string {
  const plot = stammPlot();
  const { termF, Fx, fx, probe } = stammCase(v);
  const curves: Record<number, (x: number) => number> = {
    0: (x) => x ** v.n,
    1: (x) => Math.exp(v.a * x + v.b),
    2: (x) => v.p / (v.p * x + v.q),
    3: (x) => v.p * Math.exp(v.p * x + v.q),
  };
  const f = curves[v.fam] ?? curves[0];
  let out = open("Integrand und Stammfunktion einer ausgewählten Regel mit Probe der Ableitung");
  out += plot.clip("clip-sf") + plot.grid(1, 2);
  out += clipped("clip-sf", plot.graph(f, "lab-curve-2"));
  const X = plot.X(v.x);
  out += line(X, plot.box.y, X, plot.box.y + plot.box.h, "lab-dashed");
  const lines: Line[] = [
    [termF, "lab-text lab-text-big"],
    [`F(${fmt(v.x)}) = ${fmt(Fx)}`, "lab-text lab-text-c"],
    [`f(${fmt(v.x)}) = ${fmt(fx)}`, "lab-text"],
    [`Probe |ΔF − f(x)| = ${fmt(probe, 4)}`, probe < 0.01 ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  out += handle("hx", X, plot.Y(0), "Stelle x");
  out += "</svg>";
  return out;
}

// ─── 1.6 Flächen zwischen zwei Graphen ──────────────────────────────────────

const zweiPlot = () => new Plot(-5, 5, -10, 10);

/** f − g = A x² + B x + C of the lab: f(x) = a x² + b, g(x) = m x + t. */
export function graphenDiff(v: LabValues): { A: number; B: number; C: number } {
  return { A: v.a, B: -v.m, C: v.b - v.t };
}

/** The real solutions of A x² + B x + C = 0, sorted and without doubles. */
export function quadRoots(A: number, B: number, C: number): number[] {
  if (A === 0) {
    if (B === 0) return [];
    return [-C / B];
  }
  const D = B * B - 4 * A * C;
  if (D < 0) return [];
  if (D === 0) return [-B / (2 * A)];
  const r = Math.sqrt(D);
  return [(-B - r) / (2 * A), (-B + r) / (2 * A)].sort((p, q) => p - q);
}

/** ∫ᵤᵛ |A x² + B x + C| dx, split at the zeros of the quadratic. */
export function absQuadraticArea(A: number, B: number, C: number, u: number, w: number): number {
  const F = (x: number) => (A * x * x * x) / 3 + (B * x * x) / 2 + C * x;
  const parts = signedAreas(F, quadRoots(A, B, C), u, w);
  return parts.ap + parts.am;
}

function zweiGraphen(v: LabValues): string {
  const plot = zweiPlot();
  const f = (x: number) => v.a * x * x + v.b;
  const g = (x: number) => v.m * x + v.t;
  const { A, B, C } = graphenDiff(v);
  const xs = quadRoots(A, B, C);
  const two = xs.length === 2;
  const u = v.grenzen === 1 || !two ? 0 : xs[0];
  const w = v.grenzen === 1 || !two ? 2 : xs[1];
  const area = absQuadraticArea(A, B, C, u, w);
  let out = open("Parabel und Gerade mit markierter Fläche zwischen den Graphen");
  out += plot.clip("clip-zg") + plot.grid(1, 2);
  const diff = (x: number) => f(x) - g(x);
  let shading = "";
  const inner = quadRoots(A, B, C).filter((z) => z > u + 1e-9 && z < w - 1e-9);
  const cuts = [u, ...inner, w];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    const pts: Pt[] = [];
    for (let j = 0; j <= 16; j++) {
      const x = cuts[i] + ((cuts[i + 1] - cuts[i]) * j) / 16;
      pts.push(plot.P(x, f(x)));
    }
    for (let j = 16; j >= 0; j--) {
      const x = cuts[i] + ((cuts[i + 1] - cuts[i]) * j) / 16;
      pts.push(plot.P(x, g(x)));
    }
    shading += polygon(pts, diff(mid) >= 0 ? "lab-fill-ok" : "lab-fill-b");
  }
  out += clipped(
    "clip-zg",
    shading + plot.graph(f, "lab-curve") + plot.lineThrough(v.m, v.t, "lab-curve-2"),
  );
  for (const x of xs) {
    if (!plot.contains(x, f(x))) continue;
    const P = plot.P(x, f(x));
    out += circle(P.x, P.y, 5, "lab-point-ok");
  }
  const lines: Line[] = [
    [`f(x) = ${term(v.a, "x²", true)}${term(v.b, "", false)}`, "lab-text lab-text-big"],
    [`g(x) = ${linear(v.m, v.t)}`, "lab-text"],
    [
      two ? `Schnittpunkte bei x = ${fmt(xs[0])} und x = ${fmt(xs[1])}` : xs.length === 1 ? "ein Schnittpunkt (Berührung)" : "keine Schnittpunkte",
      "lab-text-muted",
    ],
    [`Fläche über [${fmt(u)} | ${fmt(w)}]: ${fmt(area)}`, "lab-text lab-text-c"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  out += handle("hx", plot.X(v.x), plot.Y(0), "Stelle x für die Differenz");
  out += "</svg>";
  return out;
}

// ─── 1.7 Uneigentliche Integrale ────────────────────────────────────────────

const uneigPlot = () => new Plot(0, 52, 0, 1.2);

/** ∫₁^b x^(−p) dx: (b^(1−p) − 1) : (1 − p) für p ≠ 1, ln b für p = 1. */
export function uneigentlich(p: number, b: number): number {
  if (p === 1) return Math.log(b);
  return (Math.pow(b, 1 - p) - 1) / (1 - p);
}

function uneigentlichView(v: LabValues): string {
  const plot = uneigPlot();
  const f = (x: number) => x ** -v.p;
  const wert = uneigentlich(v.p, v.b);
  let out = open("Funktion 1 durch x hoch p mit schraffierter Fläche von 1 bis b");
  out += plot.clip("clip-ue") + plot.grid(10, 10);
  out += clipped("clip-ue", shade(plot, f, 1, Math.min(v.b, 52), "lab-fill-ok") + plot.graph(f, "lab-curve"));
  out += line(plot.X(Math.min(v.b, 52)), plot.Y(0), plot.X(Math.min(v.b, 52)), plot.Y(1.2), "lab-dashed");
  out += line(plot.X(10), plot.Y(0), plot.X(10), plot.Y(1.2), "lab-dashed");
  out += line(plot.X(50), plot.Y(0), plot.X(50), plot.Y(1.2), "lab-dashed");
  out += text(plot.X(10), plot.Y(1.2) + 14, "10", "lab-text-tick", "middle");
  out += text(plot.X(50), plot.Y(1.2) + 14, "50", "lab-text-tick", "middle");
  const lines: Line[] = [
    [`f(x) = 1 : x^${fmt(v.p)}`, "lab-text lab-text-big"],
    [`∫₁^${fmt(v.b)} f = ${fmt(wert)}`, "lab-text lab-text-c"],
    [`∫₁^10 f = ${fmt(uneigentlich(v.p, 10))}`, "lab-text"],
    [`∫₁^50 f = ${fmt(uneigentlich(v.p, 50))}`, "lab-text"],
    [v.p > 1 ? "p > 1: konvergiert gegen 1 : (p − 1)" : "p ≤ 1: divergiert, der Wert wächst weiter", v.p > 1 ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 30, lines);
  out += handle("hb", plot.X(Math.min(v.b, 52)), plot.Y(0), "obere Grenze b");
  out += "</svg>";
  return out;
}

// ─── 1.8 Das bestimmte Integral als Gesamtänderung ──────────────────────────

const profilPlot = () => new Plot(0, 10, -7, 7);

/**
 * The step profile: v = vmax on [0; min(t1, T)], v = −vback afterwards.
 * Verschiebung is signed, Strecke adds the absolute parts.
 */
export function profilData(v: LabValues): {
  t1: number;
  disp: number;
  strecke: number;
  mittel: number;
} {
  const t1 = Math.min(v.t1, v.T);
  const t2 = Math.max(0, v.T - t1);
  const disp = v.vmax * t1 - v.vback * t2;
  const strecke = v.vmax * t1 + v.vback * t2;
  return { t1, disp, strecke, mittel: strecke / v.T };
}

function gesamtAenderung(v: LabValues): string {
  const plot = profilPlot();
  const { t1, disp, strecke, mittel } = profilData(v);
  const profile = (x: number) => (x < t1 ? v.vmax : -v.vback);
  let out = open("Geschwindigkeitsprofil als Stufen: Hinphase und Rückphase mit Flächen");
  out += plot.clip("clip-ga") + plot.grid(1, 1);
  const y0 = plot.Y(0);
  if (t1 > 0) out += rect(plot.X(0), plot.Y(v.vmax), plot.X(t1) - plot.X(0), y0 - plot.Y(v.vmax), "lab-fill-ok");
  if (v.T - t1 > 0) out += rect(plot.X(t1), y0, plot.X(v.T) - plot.X(t1), plot.Y(-v.vback) - y0, "lab-fill-b");
  out += clipped("clip-ga", plot.graph(profile, "lab-curve"));
  out += line(plot.X(t1), plot.box.y, plot.X(t1), plot.box.y + plot.box.h, "lab-dashed");
  out += line(plot.X(v.T), plot.box.y, plot.X(v.T), plot.box.y + plot.box.h, "lab-dashed");
  const lines: Line[] = [
    [`v = ${fmt(v.vmax)} auf [0 | ${fmt(t1)}], danach ${fmt(-v.vback)}`, "lab-text lab-text-big"],
    [`Verschiebung = ${fmt(disp)} m`, "lab-text lab-text-c"],
    [`Strecke = ${fmt(strecke)} m`, "lab-text lab-text-ok"],
    [`Mittelgeschwindigkeit = ${fmt(mittel)} m/s`, "lab-text-muted"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  out += handle("hv", plot.X(t1 / 2), plot.Y(v.vmax), "Höchstgeschwindigkeit");
  out += handle("ht1", plot.X(t1), plot.Y(v.vmax), "Ende der Hinphase", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 1.9 Rotationskörper und Volumen ────────────────────────────────────────

const rotationsPlot = () => new Plot(-7, 7, -10, 10);

/** V = π ∫ₐᵇ (k x + d)² dx exactly; `vpi` is the multiple of π. */
export function rotationData(v: LabValues): {
  p: number;
  q: number;
  vpi: number;
  V: number;
  radius: number;
  art: string;
} {
  const p = Math.min(v.a, v.b);
  const q = Math.max(v.a, v.b);
  const F = (x: number) => (v.k * v.k * x * x * x) / 3 + v.k * v.d * x * x + v.d * v.d * x;
  const vpi = F(q) - F(p);
  const radius = q > p ? Math.sqrt(Math.max(0, vpi) / (q - p)) : Math.abs(v.k * p + v.d);
  const fp = v.k * p + v.d;
  const fq = v.k * q + v.d;
  const art =
    v.k === 0 ? "Zylinder" : Math.abs(fp) < 1e-9 || Math.abs(fq) < 1e-9 ? "Kegel" : "Kegelstumpf";
  return { p, q, vpi, V: Math.PI * vpi, radius, art };
}

function rotationskoerper(v: LabValues): string {
  const plot = rotationsPlot();
  const f = (x: number) => v.k * x + v.d;
  const { p, q, vpi, V, radius, art } = rotationData(v);
  let out = open("Rotationskörper aus einer Geraden um die x-Achse, als Scheibenreihe gezeichnet");
  out += plot.clip("clip-rk") + plot.grid(1, 2);
  out += clipped("clip-rk", plot.graph(f, "lab-curve"));
  out += clipped("clip-rk", plot.graph((x) => -f(x), "lab-dashed"));
  out += line(plot.X(p), plot.box.y, plot.X(p), plot.box.y + plot.box.h, "lab-thin");
  out += line(plot.X(q), plot.box.y, plot.X(q), plot.box.y + plot.box.h, "lab-thin");
  for (let i = 0; i <= 8; i++) {
    const x = p + ((q - p) * i) / 8;
    const r = Math.abs(f(x)) * plot.sy;
    const cx = plot.X(x);
    const cy = plot.Y(0);
    const ry = Math.min(190, r);
    if (!(ry > 0.6)) continue;
    out += `<path d="M${(cx - 5).toFixed(1)} ${cy.toFixed(1)} a5 ${ry.toFixed(1)} 0 1 0 10 0 a5 ${ry.toFixed(1)} 0 1 0 -10 0 Z" class="lab-fill-c" />`;
  }
  const lines: Line[] = [
    [`f(x) = ${linear(v.k, v.d)}`, "lab-text lab-text-big"],
    [`V = π · ${fmt(vpi)}`, "lab-text lab-text-c"],
    [`V ≈ ${fmt(V)}`, "lab-text"],
    [`mittlerer Radius ≈ ${fmt(radius)}`, "lab-text-muted"],
    [`Körper: ${art}`, "lab-text lab-text-ok"],
  ];
  out += infoBox(plot.box.x + 12, plot.box.y + 26, lines);
  const y0 = plot.Y(0);
  out += handle("ha", plot.X(v.a), y0, "Intervallgrenze a");
  out += handle("hb", plot.X(v.b), y0, "Intervallgrenze b", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── The view table ─────────────────────────────────────────────────────────

export const INTEGRAL_VIEWS: Record<string, LabView> = {
  "area-bilanz": {
    render: areaBilanz,
    handles: {
      ha: { x: "a", drag: (p) => ({ a: bilanzPlot().invX(p.x) }) },
      hb: { x: "b", drag: (p) => ({ b: bilanzPlot().invX(p.x) }) },
    },
  },
  integralfunktion: {
    render: integralfunktion,
    handles: {
      hx: { x: "x", drag: (p) => ({ x: integralPlot().invX(p.x) }) },
      ht: { y: "t", drag: (p) => ({ t: integralPlot().invY(p.y) }) },
    },
  },
  hauptsatz: {
    render: hauptsatz,
    handles: {
      hu: { x: "u", drag: (p) => ({ u: hauptPlot().invX(p.x) }) },
      hv: { x: "v", drag: (p) => ({ v: hauptPlot().invX(p.x) }) },
    },
  },
  "graph-schluss": {
    render: graphSchluss,
    handles: {
      hx: { x: "x", drag: (p) => ({ x: schlussPlot().invX(p.x) }) },
      hs: { x: "s", drag: (p) => ({ s: schlussPlot().invX(p.x) }) },
    },
  },
  stammfunktion: {
    render: stammfunktion,
    handles: {
      hx: { x: "x", drag: (p) => ({ x: stammPlot().invX(p.x) }) },
    },
  },
  "zwei-graphen": {
    render: zweiGraphen,
    handles: {
      hx: { x: "x", drag: (p) => ({ x: zweiPlot().invX(p.x) }) },
    },
  },
  uneigentlich: {
    render: uneigentlichView,
    handles: {
      hb: {
        x: "b",
        drag: (p) => ({ b: uneigPlot().invX(p.x) }),
      },
    },
  },
  "gesamt-aenderung": {
    render: gesamtAenderung,
    handles: {
      hv: { y: "vmax", drag: (p) => ({ vmax: profilPlot().invY(p.y) }) },
      ht1: { x: "t1", drag: (p) => ({ t1: profilPlot().invX(p.x) }) },
    },
  },
  rotationskoerper: {
    render: rotationskoerper,
    handles: {
      ha: { x: "a", drag: (p) => ({ a: rotationsPlot().invX(p.x) }) },
      hb: { x: "b", drag: (p) => ({ b: rotationsPlot().invX(p.x) }) },
    },
  },
};
