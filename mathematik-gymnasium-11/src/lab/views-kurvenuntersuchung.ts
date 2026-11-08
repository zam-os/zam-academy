import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { clampX, clampY, type Line, placeInfo, polyAt, polyDerivative, polyText, quadraticRoots } from "./shared";
import { circle, clipped, handle, type LabView, line, open, Plot, rect, text } from "./svg";

// ─── 5.1 Monotonie ─────────────────────────────────────────────────────────

export const MONO_FUNCTIONS = [
  { term: "x³ − 3x", f: (x: number) => x ** 3 - 3 * x, d: (x: number) => 3 * x * x - 3 },
  { term: "x³", f: (x: number) => x ** 3, d: (x: number) => 3 * x * x },
] as const;

const monoPlot = () => new Plot(-3, 3, -5, 5);

/** A band under the plot: f′ positive (green) or negative (violet) along x, one block per run of the same sign. */
function signBand(plot: Plot, d: (x: number) => number, y: number): string {
  const steps = 240;
  const signAt = (i: number) => {
    const x = plot.xmin + ((plot.xmax - plot.xmin) * (i + 0.5)) / steps;
    const s = d(x);
    return Math.abs(s) < 1e-9 ? 0 : Math.sign(s);
  };
  let out = "";
  let start = 0;
  for (let i = 1; i <= steps; i++) {
    if (i < steps && signAt(i) === signAt(start)) continue;
    const x0 = plot.xmin + ((plot.xmax - plot.xmin) * start) / steps;
    const x1 = plot.xmin + ((plot.xmax - plot.xmin) * i) / steps;
    const s = signAt(start);
    out += rect(plot.X(x0), y, plot.X(x1) - plot.X(x0), 8, s === 0 ? "lab-cell" : s > 0 ? "lab-fill-ok" : "lab-fill-c");
    out += text((plot.X(x0) + plot.X(x1)) / 2, y + 7, s > 0 ? "+" : s < 0 ? "−" : "", "lab-text-small", "middle");
    start = i;
  }
  return out + text(plot.box.x + 4, y - 3, "Vorzeichen von f′", "lab-text-small");
}

function monotony(v: LabValues): string {
  const plot = monoPlot();
  const def = MONO_FUNCTIONS[v.fn];
  let out = open("Graph mit zwei ziehbaren Stellen x₁ und x₂ und ihren Funktionswerten");
  out += plot.clip("clip-mono") + plot.grid(1, 1);
  out += clipped("clip-mono", plot.graph(def.f, "lab-curve"));
  out += signBand(plot, def.d, plot.box.y + plot.box.h - 12);
  const P1 = { x: plot.X(v.x1), y: clampY(plot, def.f(v.x1)) };
  const P2 = { x: plot.X(v.x2), y: clampY(plot, def.f(v.x2)) };
  out += line(P1.x, P1.y, P1.x, plot.Y(0), "lab-thin") + line(P2.x, P2.y, P2.x, plot.Y(0), "lab-thin");
  const rising = def.f(v.x2) > def.f(v.x1);
  const lines: Line[] = [
    [`f(x) = ${def.term}`, "lab-text lab-text-big"],
    [`f(x₁) = ${fmt(def.f(v.x1))}, f(x₂) = ${fmt(def.f(v.x2))}`, "lab-text"],
    [v.x1 < v.x2 ? (rising ? "x₁ < x₂ und f(x₁) < f(x₂)" : "x₁ < x₂, aber f(x₁) ≥ f(x₂)") : "Wähle x₁ links von x₂", rising && v.x1 < v.x2 ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  out += placeInfo(plot, lines, [P1, P2], [def.f]);
  out += handle("A", P1.x, P1.y, "Stelle x₁") + handle("B", P2.x, P2.y, "Stelle x₂", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 5.2 Extremstellen mit dem Vorzeichenwechsel von f′ ───────────────────

export const EXTREMA_FUNCTIONS = [
  { term: "x³ − 3x", f: (x: number) => x ** 3 - 3 * x, d: (x: number) => 3 * x * x - 3, critical: [-1, 1] },
  { term: "0,25x⁴ − (2/3)x³", f: (x: number) => 0.25 * x ** 4 - (2 / 3) * x ** 3, d: (x: number) => x ** 3 - 2 * x * x, critical: [0, 2] },
] as const;

/** What kind of point the graph has at a critical x: by the change of sign of f′. */
export function criticalKind(fn: number, x: number): "Hochpunkt" | "Tiefpunkt" | "Terrassenpunkt" | "keine waagrechte Tangente" {
  const def = EXTREMA_FUNCTIONS[fn];
  if (Math.abs(def.d(x)) > 1e-9) return "keine waagrechte Tangente";
  const left = def.d(x - 1e-3);
  const right = def.d(x + 1e-3);
  if (left > 0 && right < 0) return "Hochpunkt";
  if (left < 0 && right > 0) return "Tiefpunkt";
  return "Terrassenpunkt";
}

const extremaPlot = () => new Plot(-2.5, 3, -3, 3);

function extremaSign(v: LabValues): string {
  const plot = extremaPlot();
  const def = EXTREMA_FUNCTIONS[v.fn];
  const m = def.d(v.x0);
  let out = open("Graph mit ziehbarem Punkt, Tangente und dem Vorzeichen von f′ darunter");
  out += plot.clip("clip-ext") + plot.grid(0.5, 1);
  out += clipped("clip-ext", plot.graph(def.f, "lab-curve") + plot.lineThrough(m, def.f(v.x0) - m * v.x0, "lab-curve-c"));
  out += signBand(plot, def.d, plot.box.y + plot.box.h - 12);
  const P = { x: plot.X(v.x0), y: clampY(plot, def.f(v.x0)) };
  const kind = criticalKind(v.fn, v.x0);
  const lines: Line[] = [
    [`f(x) = ${def.term}`, "lab-text lab-text-big"],
    [`f′(${fmt(v.x0)}) = ${fmt(m, 3)}`, "lab-text lab-text-c"],
    [kind, kind === "keine waagrechte Tangente" ? "lab-text-muted" : "lab-text lab-text-ok"],
  ];
  out += placeInfo(plot, lines, [P], [def.f]);
  out += handle("P", P.x, P.y, "Punkt P");
  return out + "</svg>";
}

// ─── 5.3 Krümmung und Wendestellen ─────────────────────────────────────────

export const curveF = (x: number) => x ** 3 - 3 * x * x + 2;
export const curveD = (x: number) => 3 * x * x - 6 * x;
export const curveD2 = (x: number) => 6 * x - 6;

export function curvatureText(x: number): string {
  const c = curveD2(x);
  return Math.abs(c) < 1e-9 ? "Wendestelle: Krümmung wechselt" : c > 0 ? "linksgekrümmt (f″ > 0)" : "rechtsgekrümmt (f″ < 0)";
}

const curvePlot = () => new Plot(-1.5, 3.5, -3, 4);

function curvature(v: LabValues): string {
  const plot = curvePlot();
  const m = curveD(v.x0);
  let out = open("Graph von f mit Tangente; gestrichelt der Graph von f′, dessen Extrempunkt zur Wendestelle gehört");
  out += plot.clip("clip-curv") + plot.grid(0.5, 1);
  out += clipped("clip-curv", plot.graph(curveD, "lab-ghost") + plot.graph(curveF, "lab-curve") + plot.lineThrough(m, curveF(v.x0) - m * v.x0, "lab-curve-c"));
  const P = { x: plot.X(v.x0), y: clampY(plot, curveF(v.x0)) };
  const D = { x: plot.X(v.x0), y: clampY(plot, m) };
  out += circle(D.x, D.y, 4.5, "lab-point-b");
  const lines: Line[] = [
    ["f(x) = x³ − 3x² + 2", "lab-text lab-text-big"],
    [`f′ = ${fmt(m, 2)}, f″ = ${fmt(curveD2(v.x0), 2)}`, "lab-text"],
    [curvatureText(v.x0), "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [P, D], [curveF, curveD]);
  out += handle("P", P.x, P.y, "Punkt P");
  return out + "</svg>";
}

// ─── 5.4 Notwendige und hinreichende Bedingungen ───────────────────────────

/** f(x) = a·x⁴ + b·x³ + c·x²: always f(0) = 0 and f′(0) = 0. */
export function condPoly(v: LabValues): number[] {
  return [v.a, v.b, v.c, 0, 0];
}

export function pointAt0(v: LabValues): "Hochpunkt" | "Tiefpunkt" | "Terrassenpunkt" | "konstant" {
  if (v.c !== 0) return v.c > 0 ? "Tiefpunkt" : "Hochpunkt";
  if (v.b !== 0) return "Terrassenpunkt";
  if (v.a !== 0) return v.a > 0 ? "Tiefpunkt" : "Hochpunkt";
  return "konstant";
}

const condPlot = () => new Plot(-2, 2, -2, 2);

function conditions(v: LabValues): string {
  const plot = condPlot();
  const p = condPoly(v);
  const f = (x: number) => polyAt(p, x);
  let out = open("Graph von f(x) = ax⁴ + bx³ + cx² nahe der Stelle 0, an der immer f′(0) = 0 gilt");
  out += plot.clip("clip-cond") + plot.grid(0.5, 1);
  out += clipped("clip-cond", plot.graph(f, "lab-curve") + plot.lineThrough(0, 0, "lab-dashed"));
  out += circle(plot.X(0), plot.Y(0), 5, "lab-point-a");
  const H = { x: plot.X(1), y: clampY(plot, f(1)) };
  const lines: Line[] = [
    [`f(x) = ${polyText(p)}`, "lab-text lab-text-big"],
    [`f′(0) = 0, f″(0) = ${fmt(2 * v.c)}`, "lab-text"],
    [`bei 0: ${pointAt0(v)}`, "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [H, plot.P(0, 0)], [f]);
  out += handle("H", H.x, H.y, "Formpunkt bei x = 1: ändert a");
  return out + "</svg>";
}

// ─── 5.5 Ganzrationale Funktionen untersuchen ──────────────────────────────

export function cubicPoly(v: LabValues): number[] {
  const e1 = v.r1 + v.r2 + v.r3;
  const e2 = v.r1 * v.r2 + v.r1 * v.r3 + v.r2 * v.r3;
  const e3 = v.r1 * v.r2 * v.r3;
  return [v.a, -v.a * e1, v.a * e2, -v.a * e3];
}

export interface CubicFacts {
  extrema: Array<{ x: number; y: number; kind: "Hochpunkt" | "Tiefpunkt" }>;
  inflection: { x: number; y: number };
  terrace: boolean;
}

export function cubicFacts(v: LabValues): CubicFacts {
  const p = cubicPoly(v);
  const d = polyDerivative(p);
  const roots = quadraticRoots(d[0], d[1], d[2]);
  const xw = -p[1] / (3 * p[0]);
  const extrema =
    roots.length === 2
      ? roots.map((x) => ({ x, y: polyAt(p, x), kind: (6 * p[0] * x + 2 * p[1] < 0 ? "Hochpunkt" : "Tiefpunkt") as "Hochpunkt" | "Tiefpunkt" }))
      : [];
  return { extrema, inflection: { x: xw, y: polyAt(p, xw) }, terrace: roots.length === 1 };
}

const cubicPlotBox = () => new Plot(-4, 4, -6, 6);

function cubicAnalysis(v: LabValues): string {
  const plot = cubicPlotBox();
  const p = cubicPoly(v);
  const f = (x: number) => polyAt(p, x);
  const facts = cubicFacts(v);
  let out = open("Ganzrationale Funktion dritten Grades mit ziehbaren Nullstellen, Extrempunkten und Wendepunkt");
  out += plot.clip("clip-cubic") + plot.grid(1, 1);
  out += clipped("clip-cubic", plot.graph(f, "lab-curve"));
  for (const e of facts.extrema) {
    if (plot.contains(e.x, e.y)) out += circle(plot.X(e.x), plot.Y(e.y), 5.5, e.kind === "Hochpunkt" ? "lab-point-b" : "lab-point-ok");
  }
  if (plot.contains(facts.inflection.x, facts.inflection.y)) out += circle(plot.X(facts.inflection.x), plot.Y(facts.inflection.y), 5, "lab-point-a");
  const R = [v.r1, v.r2, v.r3].map((r) => plot.P(r, 0));
  const lines: Line[] = [
    [`f(x) = ${polyText(p)}`, "lab-text lab-text-big"],
    [`W(${fmt(facts.inflection.x)} | ${fmt(facts.inflection.y)})`, "lab-text lab-text-a"],
  ];
  out += placeInfo(plot, lines, R, [f]);
  out += R.map((P, i) => handle(`R${i + 1}`, P.x, P.y, `Nullstelle ${i + 1}`)).join("");
  return out + "</svg>";
}

// ─── 5.6 Newton-Verfahren ──────────────────────────────────────────────────

export const newtonF = (x: number) => x ** 3 - 3 * x + 1;
export const newtonD = (x: number) => 3 * x * x - 3;

/** The iterates x₀, x₁, …, xₙ; stops early when f′ = 0 or the values run away. */
export function newtonIterates(x0: number, n: number): { xs: number[]; stopped: boolean } {
  const xs = [x0];
  for (let i = 0; i < n; i++) {
    const x = xs[xs.length - 1];
    const d = newtonD(x);
    if (Math.abs(d) < 1e-12) return { xs, stopped: true };
    const next = x - newtonF(x) / d;
    if (!Number.isFinite(next) || Math.abs(next) > 1e6) return { xs, stopped: true };
    xs.push(next);
  }
  return { xs, stopped: false };
}

/** The three roots of x³ − 3x + 1, to many digits. */
export const NEWTON_ROOTS = [-1.8793852415718, 0.34729635533386, 1.5320888862380];

const newtonPlot = () => new Plot(-3, 3, -4, 6);

function newton(v: LabValues): string {
  const plot = newtonPlot();
  const { xs, stopped } = newtonIterates(v.x0, v.n);
  let out = open("Newton-Verfahren: Tangenten an den Graphen und ihre Schnittstellen mit der x-Achse");
  out += plot.clip("clip-newton") + plot.grid(0.5, 1);
  let tangents = "";
  for (let i = 0; i < xs.length - 1; i++) {
    const x = xs[i];
    const m = newtonD(x);
    tangents += plot.lineThrough(m, newtonF(x) - m * x, "lab-curve-c");
    if (plot.contains(x, newtonF(x))) tangents += line(plot.X(x), plot.Y(0), plot.X(x), plot.Y(newtonF(x)), "lab-dashed");
  }
  out += clipped("clip-newton", plot.graph(newtonF, "lab-curve") + tangents);
  xs.forEach((x, i) => {
    if (x > plot.xmin && x < plot.xmax) {
      out += circle(plot.X(x), plot.Y(0), i === xs.length - 1 ? 5.5 : 3.5, i === xs.length - 1 ? "lab-point-a" : "lab-point");
    }
  });
  const last = xs[xs.length - 1];
  const lines: Line[] = [
    ["f(x) = x³ − 3x + 1", "lab-text lab-text-big"],
    [stopped ? "f′(xₙ) = 0: keine Tangentenschnittstelle" : `x${xs.length - 1 === 0 ? "₀" : subscript(xs.length - 1)} ≈ ${fmt(last, 6)}`, stopped ? "lab-text lab-text-bad" : "lab-text lab-text-a"],
  ];
  const S = { x: clampX(plot, v.x0), y: plot.Y(0) };
  out += placeInfo(plot, lines, [S], [newtonF]);
  out += handle("S", S.x, S.y, "Startwert x₀");
  return out + "</svg>";
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";

export function subscript(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUB[Number(d)])
    .join("");
}

export const KURVENUNTERSUCHUNG_VIEWS: Record<string, LabView> = {
  monotony: {
    render: monotony,
    handles: {
      A: { x: "x1", drag: (p) => ({ x1: monoPlot().invX(p.x) }) },
      B: { x: "x2", drag: (p) => ({ x2: monoPlot().invX(p.x) }) },
    },
  },
  "extrema-sign": { render: extremaSign, handles: { P: { x: "x0", drag: (p) => ({ x0: extremaPlot().invX(p.x) }) } } },
  curvature: { render: curvature, handles: { P: { x: "x0", drag: (p) => ({ x0: curvePlot().invX(p.x) }) } } },
  conditions: { render: conditions, handles: { H: { y: "a", drag: (p, v) => ({ a: condPlot().invY(p.y) - v.b - v.c }) } } },
  "cubic-analysis": {
    render: cubicAnalysis,
    handles: {
      R1: { x: "r1", drag: (p) => ({ r1: cubicPlotBox().invX(p.x) }) },
      R2: { x: "r2", drag: (p) => ({ r2: cubicPlotBox().invX(p.x) }) },
      R3: { x: "r3", drag: (p) => ({ r3: cubicPlotBox().invX(p.x) }) },
    },
  },
  newton: { render: newton, handles: { S: { x: "x0", drag: (p) => ({ x0: newtonPlot().invX(p.x) }) } } },
};
