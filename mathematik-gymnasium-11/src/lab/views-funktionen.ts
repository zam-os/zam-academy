import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { clampX, clampY, type Line, placeInfo, pointLabel, sameGraph } from "./shared";
import { arrow, circle, clipped, handle, type LabView, line, open, Plot, rect, text } from "./svg";

// ─── 1.1 Funktionstypen im Überblick ───────────────────────────────────────

/** The function types of grades 7 to 10, each as a·g(x). */
export const FUNCTION_TYPES = [
  { name: "lineare Funktion", base: "x", g: (x: number) => x },
  { name: "quadratische Funktion", base: "x²", g: (x: number) => x * x },
  { name: "Potenzfunktion", base: "x³", g: (x: number) => x ** 3 },
  { name: "Potenzfunktion mit negativem Exponenten", base: "x⁻¹", g: (x: number) => (x === 0 ? Number.NaN : 1 / x) },
  { name: "Exponentialfunktion", base: "2ˣ", g: (x: number) => 2 ** x },
  { name: "Sinusfunktion", base: "sin x", g: (x: number) => Math.sin(x) },
  { name: "ganzrationale Funktion 4. Grades", base: "(0,25x⁴ − x²)", g: (x: number) => 0.25 * x ** 4 - x * x },
] as const;

/** The term a·g(x) as the blackboard writes it. */
export function typeTerm(type: number, a: number): string {
  const base = FUNCTION_TYPES[type].base;
  if (a === 0) return "0";
  if (type === 3) return `${fmt(a)}/x`;
  const factor = a === 1 ? "" : a === -1 ? "−" : `${fmt(a)} · `;
  if (type === 6 && Math.abs(a) === 1) return a === 1 ? "0,25x⁴ − x²" : "−0,25x⁴ + x²";
  return `${factor}${base}`;
}

export function typeValue(type: number, a: number, x: number): number {
  return a * FUNCTION_TYPES[type].g(x);
}

/** Definitionsmenge of a·g as D_f is written. */
export function typeDomain(type: number): string {
  return type === 3 ? "ℝ \\ {0}" : "ℝ";
}

/** Wertemenge of a·g(x); a = 0 gives the zero function. */
export function typeRange(type: number, a: number): string {
  if (a === 0) return "{0}";
  const s = Math.sign(a);
  switch (type) {
    case 0:
    case 2:
      return "ℝ";
    case 1:
      return s > 0 ? "ℝ₀⁺" : "ℝ₀⁻";
    case 3:
      return "ℝ \\ {0}";
    case 4:
      return s > 0 ? "ℝ⁺" : "ℝ⁻";
    case 5:
      return `[${fmt(-Math.abs(a))}; ${fmt(Math.abs(a))}]`;
    default:
      return s > 0 ? `[${fmt(-a)}; +∞[` : `]−∞; ${fmt(-a)}]`;
  }
}

export function typeSymmetry(type: number, a: number): "achse" | "punkt" | "keine" | "beide" {
  if (a === 0) return "beide";
  if (type === 1 || type === 6) return "achse";
  if (type === 4) return "keine";
  return "punkt";
}

export const SYMMETRY_TEXT = {
  achse: "achsensymmetrisch zur y-Achse",
  punkt: "punktsymmetrisch zum Ursprung",
  keine: "weder achsen- noch punktsymmetrisch",
  beide: "achsen- und punktsymmetrisch (Nullfunktion)",
};

/** "steigt", "fällt" or "wechselt": strict monotony on the whole Definitionsmenge. */
export function typeMonotony(type: number, a: number): "steigt" | "fällt" | "wechselt" | "konstant" {
  if (a === 0) return "konstant";
  if (type === 0 || type === 2 || type === 4) return a > 0 ? "steigt" : "fällt";
  return "wechselt";
}

/** The behaviour for x → +∞ (side 1) or x → −∞ (side −1). */
export function typeLimit(type: number, a: number, side: 1 | -1): string {
  if (a === 0) return "0";
  const s = Math.sign(a);
  const inf = (sign: number) => (sign > 0 ? "+∞" : "−∞");
  switch (type) {
    case 0:
    case 2:
      return inf(s * side);
    case 1:
    case 6:
      return inf(s);
    case 3:
      return "0";
    case 4:
      return side > 0 ? inf(s) : "0";
    default:
      return "kein Grenzwert";
  }
}

const typesPlot = () => new Plot(-5, 5, -5, 5);

function functionTypes(v: LabValues): string {
  const plot = typesPlot();
  const f = (x: number) => typeValue(v.type, v.a, x);
  let out = open(`Graph der Funktion f(x) = ${typeTerm(v.type, v.a)} mit ziehbarem Punkt P`);
  out += plot.clip("clip-types") + plot.grid(1, 1);
  out += clipped("clip-types", plot.graph(f, "lab-curve", 400));
  if (v.type === 3) out += line(plot.X(0), plot.box.y, plot.X(0), plot.box.y + plot.box.h, "lab-dashed");
  const y = f(v.x0);
  const P = { x: plot.X(v.x0), y: Number.isFinite(y) ? clampY(plot, y) : plot.Y(0) };
  if (Number.isFinite(y)) out += line(P.x, plot.Y(0), P.x, P.y, "lab-thin");
  const lines: Line[] = [
    [`f(x) = ${typeTerm(v.type, v.a)}`, "lab-text lab-text-big"],
    [FUNCTION_TYPES[v.type].name, "lab-text-muted"],
    [Number.isFinite(y) ? pointLabel("P", v.x0, y) : "x = 0 gehört nicht zu D_f", "lab-text lab-text-a"],
  ];
  out += placeInfo(plot, lines, [P], [f]);
  out += handle("P", P.x, P.y, "Punkt P auf dem Graphen");
  return out + "</svg>";
}

// ─── 1.2 Grenzverhalten für x → +∞ ─────────────────────────────────────────

export const LIMIT_FUNCTIONS = [
  { term: "2 + 3/x", f: (x: number) => (x === 0 ? Number.NaN : 2 + 3 / x), limit: 2 as number | null },
  { term: "1 − 2 · 0,5ˣ", f: (x: number) => 1 - 2 * 0.5 ** x, limit: 1 as number | null },
  { term: "0,5x", f: (x: number) => 0.5 * x, limit: null },
  { term: "sin x", f: (x: number) => Math.sin(x), limit: null },
] as const;

/** True when the graph of function `fn` never leaves the strip c ± ε for x ≥ x₀ (exact, from the monotone shape). */
export function staysInStrip(fn: number, c: number, eps: number, x0: number): boolean {
  const low = c - eps - 1e-9;
  const high = c + eps + 1e-9;
  if (fn === 0) return x0 > 0 && low <= 2 && 2 + 3 / x0 <= high;
  if (fn === 1) return 1 - 2 * 0.5 ** x0 >= low && 1 <= high;
  if (fn === 2) return false;
  return low <= -1 && high >= 1;
}

/** The smallest x₀ ≥ 0 from which the graph stays in the strip, or null when there is none. */
export function smallestX0(fn: number, c: number, eps: number): number | null {
  const low = c - eps;
  const high = c + eps;
  if (fn === 0) {
    if (low > 2 + 1e-9 || high <= 2 + 1e-9) return null;
    return 3 / (high - 2);
  }
  if (fn === 1) {
    if (high < 1 - 1e-9 || low >= 1 - 1e-9) return null;
    if (low <= -1) return 0;
    return Math.log2(2 / (1 - low));
  }
  if (fn === 2) return null;
  return low <= -1 + 1e-9 && high >= 1 - 1e-9 ? 0 : null;
}

const stripPlot = () => new Plot(0, 16, -2, 5);

function limitStrip(v: LabValues): string {
  const plot = stripPlot();
  const def = LIMIT_FUNCTIONS[v.fn];
  const stays = staysInStrip(v.fn, v.c, v.eps, v.x0);
  let out = open("Graph mit einem Streifen der Breite 2ε um die Gerade y = c ab der Stelle x₀");
  out += plot.clip("clip-strip") + plot.grid(1, 2);
  const top = plot.Y(v.c + v.eps);
  const bottom = plot.Y(v.c - v.eps);
  const X0 = plot.X(v.x0);
  out += clipped(
    "clip-strip",
    rect(X0, top, plot.box.x + plot.box.w - X0, bottom - top, stays ? "lab-fill-ok" : "lab-fill-b") +
      line(plot.box.x, plot.Y(v.c), plot.box.x + plot.box.w, plot.Y(v.c), "lab-dashed") +
      plot.graph((x) => (x <= 0 ? Number.NaN : def.f(x)), "lab-curve", 480),
  );
  out += line(X0, plot.box.y, X0, plot.box.y + plot.box.h, stays ? "lab-ok-stroke lab-thin" : "lab-thin");
  out += text(plot.box.x + plot.box.w - 6, clampY(plot, v.c + v.eps) - 5, `y = ${fmt(v.c)} ± ${fmt(v.eps)}`, "lab-text-small", "end");
  const lines: Line[] = [
    [`f(x) = ${def.term}`, "lab-text lab-text-big"],
    [stays ? "bleibt ab x₀ im Streifen" : "verlässt den Streifen nach x₀", stays ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  const X = { x: X0, y: plot.Y(-1.5) };
  const C = { x: plot.X(15.2), y: clampY(plot, v.c) };
  out += placeInfo(plot, lines, [X, C], [def.f]);
  out += text(X0, plot.Y(-1.5) + 26, "x₀", "lab-text-small", "middle");
  out += handle("X", X.x, X.y, "Stelle x₀");
  out += handle("C", C.x, C.y, "Mittellinie y = c", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 1.3 Symmetrie rechnerisch prüfen ──────────────────────────────────────

export function symCubic(v: LabValues, x: number): number {
  return ((v.a * x + v.b) * x + v.c) * x + v.d;
}

export function symmetryOf(v: LabValues): "achse" | "punkt" | "keine" | "beide" {
  const even = v.a === 0 && v.c === 0;
  const odd = v.b === 0 && v.d === 0;
  return even && odd ? "beide" : even ? "achse" : odd ? "punkt" : "keine";
}

const symPlot = () => new Plot(-5, 5, -6, 6);

function symmetryCheck(v: LabValues): string {
  const plot = symPlot();
  const f = (x: number) => symCubic(v, x);
  let out = open("Graph mit einem Punkt P und seinen Spiegelpunkten an der y-Achse und am Ursprung");
  out += plot.clip("clip-sym") + plot.grid(1, 1);
  out += clipped("clip-sym", plot.graph(f, "lab-curve"));
  const fp = f(v.p);
  const fm = f(-v.p);
  const P = { x: plot.X(v.p), y: clampY(plot, fp) };
  const Qa = { x: plot.X(-v.p), y: clampY(plot, fp) };
  const Qp = { x: plot.X(-v.p), y: clampY(plot, -fp) };
  const R = { x: plot.X(-v.p), y: clampY(plot, fm) };
  out += line(P.x, P.y, Qa.x, Qa.y, "lab-dashed") + line(P.x, P.y, Qp.x, Qp.y, "lab-dashed");
  out += circle(Qa.x, Qa.y, 6, Math.abs(fm - fp) < 1e-9 ? "lab-point-ok" : "lab-point-b");
  out += circle(Qp.x, Qp.y, 6, Math.abs(fm + fp) < 1e-9 ? "lab-point-ok" : "lab-point-b");
  out += circle(R.x, R.y, 4, "lab-point");
  const inside = (y: number) => Math.min(plot.box.y + plot.box.h - 6, Math.max(plot.box.y + 14, y));
  out += text(Qa.x - 8, inside(Qa.y - 9), "(−p | f(p))", "lab-text-small", "end");
  out += text(Qp.x - 8, inside(Qp.y + 16), "(−p | −f(p))", "lab-text-small", "end");
  const lines: Line[] = [
    [`f(${fmt(v.p)}) = ${fmt(fp)}`, "lab-text lab-text-a"],
    [`f(${fmt(-v.p)}) = ${fmt(fm)}`, "lab-text"],
  ];
  out += placeInfo(plot, lines, [P, Qa, Qp], [f]);
  out += handle("P", P.x, P.y, "Probepunkt P(p | f(p))");
  return out + "</svg>";
}

// ─── 1.4 Verschieben, Strecken, Spiegeln ───────────────────────────────────

export const TRANSFORM_BASES = [
  { name: "f(x) = x²", f: (x: number) => x * x, anchor: [0, 0], probe: [1, 1] },
  { name: "f(x) = 2ˣ", f: (x: number) => 2 ** x, anchor: [0, 1], probe: [1, 2] },
  { name: "f(x) = sin x", f: (x: number) => Math.sin(x), anchor: [0, 0], probe: [Math.PI / 2, 1] },
  { name: "f(x) = x³", f: (x: number) => x ** 3, anchor: [0, 0], probe: [1, 1] },
] as const;

/** g(x) = a · f(b · (x + c)) + d, the form of the Lehrplan for sin in grade 10. */
export function transformed(v: LabValues): (x: number) => number {
  const f = TRANSFORM_BASES[v.base].f;
  return (x) => v.a * f(v.b * (x + v.c)) + v.d;
}

/** The targets of the three Laborauftraege, as functions of x. */
export const TRANSFORM_TARGETS = [
  { base: 0, g: (x: number) => (x - 2) ** 2 - 1 },
  { base: 1, g: (x: number) => 2 ** -x },
  { base: 2, g: (x: number) => 2 * Math.sin(0.5 * x) },
] as const;

export function matchesTarget(v: LabValues, index: number): boolean {
  const target = TRANSFORM_TARGETS[index];
  return v.base === target.base && sameGraph(transformed(v), target.g);
}

/** The term of g as written: "2 · sin(0,5 · (x + 1)) − 3". */
export function transformTerm(v: LabValues): string {
  const inner = v.c === 0 ? (v.b === 1 ? "x" : v.b === -1 ? "−x" : `${fmt(v.b)}x`) : `${v.b === 1 ? "" : v.b === -1 ? "−" : `${fmt(v.b)} · `}(x ${v.c > 0 ? "+" : "−"} ${fmt(Math.abs(v.c))})`;
  const factor = v.a === 1 ? "" : v.a === -1 ? "−" : `${fmt(v.a)} · `;
  const core =
    v.base === 0 ? (inner === "x" ? "x²" : `(${inner})²`) : v.base === 1 ? (inner === "x" ? "2ˣ" : inner === "−x" ? "2⁻ˣ" : `2^(${inner})`) : v.base === 2 ? `sin(${inner})` : inner === "x" ? "x³" : `(${inner})³`;
  const shift = v.d === 0 ? "" : ` ${v.d > 0 ? "+" : "−"} ${fmt(Math.abs(v.d))}`;
  return v.a === 0 ? fmt(v.d) : `${factor}${core}${shift}`;
}

const transformPlot = () => new Plot(-6, 6, -5, 5);

function graphTransform(v: LabValues): string {
  const plot = transformPlot();
  const base = TRANSFORM_BASES[v.base];
  const g = transformed(v);
  let out = open("Ausgangsgraph gestrichelt, verschobener, gestreckter oder gespiegelter Graph durchgezogen");
  out += plot.clip("clip-trans") + plot.grid(1, 1);
  const target = TRANSFORM_TARGETS.find((t) => t.base === v.base);
  out += clipped(
    "clip-trans",
    plot.graph(base.f, "lab-ghost", 400) + (target ? plot.graph(target.g, "lab-target", 400) : "") + plot.graph(g, "lab-curve", 400),
  );
  const [ax, ay] = base.anchor;
  const [px, py] = base.probe;
  const A = { x: clampX(plot, ax - v.c), y: clampY(plot, v.a * ay + v.d) };
  const lines: Line[] = [[`g(x) = ${transformTerm(v)}`, "lab-text lab-text-big"], [`aus ${base.name}`, "lab-text-muted"]];
  const avoid = [A];
  let probe = "";
  if (v.b !== 0) {
    const bx = px / v.b - v.c;
    const by = v.a * py + v.d;
    if (plot.contains(bx, by)) {
      const B = plot.P(bx, by);
      avoid.push(B);
      probe = handle("B", B.x, B.y, "Formpunkt: ändert den Streckfaktor a", "lab-handle lab-handle-b");
    }
  }
  out += placeInfo(plot, lines, avoid, [g, base.f]);
  out += handle("A", A.x, A.y, "Bezugspunkt: verschiebt den Graphen") + probe;
  return out + "</svg>";
}

// ─── 1.5 Transformationen kombinieren ──────────────────────────────────────

export const STEPS = [
  "kein Schritt",
  "um 2 nach oben verschieben",
  "in y-Richtung mit Faktor 2 strecken",
  "an der x-Achse spiegeln",
  "um 1 nach rechts verschieben",
  "in x-Richtung mit Faktor 0,5 stauchen",
  "an der y-Achse spiegeln",
] as const;

/** g(x) = α · f(γx + δ) + β after the chosen steps, in their order. */
export interface Affine {
  alpha: number;
  beta: number;
  gamma: number;
  delta: number;
}

export function applyStep(t: Affine, step: number): Affine {
  const n = { ...t };
  if (step === 1) n.beta += 2;
  if (step === 2) {
    n.alpha *= 2;
    n.beta *= 2;
  }
  if (step === 3) {
    n.alpha = -n.alpha;
    n.beta = -n.beta;
  }
  if (step === 4) n.delta -= n.gamma;
  if (step === 5) n.gamma *= 2;
  if (step === 6) n.gamma = -n.gamma;
  return n;
}

export function chain(t1: number, t2: number): Affine {
  return applyStep(applyStep({ alpha: 1, beta: 0, gamma: 1, delta: 0 }, t1), t2);
}

export const ORDER_BASES = [
  { name: "x²", n: 2, f: (x: number) => x * x },
  { name: "x³", n: 3, f: (x: number) => x ** 3 },
] as const;

export function chainFunction(base: number, t: Affine): (x: number) => number {
  const f = ORDER_BASES[base].f;
  return (x) => t.alpha * f(t.gamma * x + t.delta) + t.beta;
}

/** The term α(γx + δ)ⁿ + β written as A(x − h)ⁿ + k: "2(x − 1)² + 4". */
export function chainTerm(base: number, t: Affine): string {
  const n = ORDER_BASES[base].n;
  const A = t.alpha * t.gamma ** n;
  const h = -t.delta / t.gamma;
  const power = n === 2 ? "²" : "³";
  const inner = Math.abs(h) < 1e-12 ? `x${power}` : `(x ${h > 0 ? "−" : "+"} ${fmt(Math.abs(h))})${power}`;
  const factor = A === 1 ? "" : A === -1 ? "−" : fmt(A);
  const shift = t.beta === 0 ? "" : ` ${t.beta > 0 ? "+" : "−"} ${fmt(Math.abs(t.beta))}`;
  return `${factor}${inner}${shift}`;
}

export const ORDER_TARGETS = [
  (x: number) => 2 * x * x + 4,
  (x: number) => 2 * x * x + 2,
  (x: number) => -((x - 1) ** 2),
] as const;

const orderPlot = () => new Plot(-5, 5, -6, 8);

function transformOrder(v: LabValues): string {
  const plot = orderPlot();
  const base = ORDER_BASES[v.base];
  const first = chain(v.t1, 0);
  const both = chain(v.t1, v.t2);
  const g1 = chainFunction(v.base, first);
  const g = chainFunction(v.base, both);
  let out = open("Der Ausgangsgraph, der Graph nach dem ersten und nach dem zweiten Schritt, mit dem Weg eines Punktes");
  out += plot.clip("clip-order") + plot.grid(1, 2);
  out += clipped("clip-order", plot.graph(base.f, "lab-ghost") + plot.graph(g1, "lab-curve-c") + plot.graph(g, "lab-curve"));
  // The point (p | f(p)) and where the two steps take it.
  const move = (t: Affine, x: number, y: number) => ({ x: (x - t.delta) / t.gamma, y: t.alpha * y + t.beta });
  const P0 = { x: v.p, y: base.f(v.p) };
  const P1 = move(first, P0.x, P0.y);
  const P2 = move(both, P0.x, P0.y);
  const S0 = { x: plot.X(P0.x), y: clampY(plot, P0.y) };
  const S1 = { x: clampX(plot, P1.x), y: clampY(plot, P1.y) };
  const S2 = { x: clampX(plot, P2.x), y: clampY(plot, P2.y) };
  out += arrow(S0.x, S0.y, S1.x, S1.y, "lab-side-c", 1.6) + arrow(S1.x, S1.y, S2.x, S2.y, "lab-side-a", 1.6);
  out += circle(S1.x, S1.y, 5, "lab-point-b") + circle(S2.x, S2.y, 6, "lab-point-a");
  const lines: Line[] = [
    [`y = ${chainTerm(v.base, both)}`, "lab-text lab-text-big"],
    [`1. ${STEPS[v.t1]}`, "lab-text-small"],
    [`2. ${STEPS[v.t2]}`, "lab-text-small"],
  ];
  out += placeInfo(plot, lines, [S0, S1, S2], [g, g1]);
  out += handle("P", S0.x, S0.y, "Punkt P auf dem Ausgangsgraphen");
  return out + "</svg>";
}

// ─── 1.6 Stetigkeit ─────────────────────────────────────────────────────────

/** Left piece m·x + t for x ≤ 2, right piece 0,5x² − 1 for x > 2. */
export function piecewise(v: LabValues, x: number): number {
  return x <= 2 ? v.m * x + v.t : 0.5 * x * x - 1;
}

/** The jump at x = 2: right-hand limit minus f(2). */
export function jumpAt2(v: LabValues): number {
  return 1 - (2 * v.m + v.t);
}

const piecePlot = () => new Plot(-3, 5, -4, 6);

function piecewiseContinuity(v: LabValues): string {
  const plot = piecePlot();
  const left = (x: number) => (x <= 2 ? v.m * x + v.t : Number.NaN);
  const right = (x: number) => (x > 2 ? 0.5 * x * x - 1 : Number.NaN);
  const jump = jumpAt2(v);
  let out = open("Abschnittsweise definierte Funktion: links eine Gerade, rechts eine Parabel, Übergang bei x = 2");
  out += plot.clip("clip-piece") + plot.grid(1, 1);
  out += line(plot.X(2), plot.box.y, plot.X(2), plot.box.y + plot.box.h, "lab-dashed");
  out += clipped("clip-piece", plot.graph(left, "lab-curve", 320) + plot.graph(right, "lab-curve-2", 320));
  const E = { x: plot.X(2), y: clampY(plot, 2 * v.m + v.t) };
  const A = { x: plot.X(0), y: clampY(plot, v.t) };
  const R = plot.P(2, 1);
  out += circle(R.x, R.y, 5.5, Math.abs(jump) < 1e-9 ? "lab-point-ok" : "lab-plot-bg lab-ink");
  const lines: Line[] = [
    [`f(2) = ${fmt(2 * v.m + v.t)}`, "lab-text lab-text-a"],
    ["rechts von 2: f(x) → 1", "lab-text"],
    [Math.abs(jump) < 1e-9 ? "stetig bei x = 2" : `Sprung um ${fmt(jump)}`, Math.abs(jump) < 1e-9 ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  out += placeInfo(plot, lines, [E, A, R], [left, right]);
  out += handle("A", A.x, A.y, "Punkt der Geraden auf der y-Achse: ändert die Steigung m");
  out += handle("E", E.x, E.y, "Endpunkt der Geraden bei x = 2: verschiebt sie", "lab-handle lab-handle-b");
  return out + "</svg>";
}

export const FUNKTIONEN_VIEWS: Record<string, LabView> = {
  "function-types": {
    render: functionTypes,
    handles: { P: { x: "x0", drag: (p) => ({ x0: typesPlot().invX(p.x) }) } },
  },
  "limit-strip": {
    render: limitStrip,
    handles: {
      X: { x: "x0", drag: (p) => ({ x0: stripPlot().invX(p.x) }) },
      C: { y: "c", drag: (p) => ({ c: stripPlot().invY(p.y) }) },
    },
  },
  "symmetry-check": {
    render: symmetryCheck,
    handles: { P: { x: "p", drag: (p) => ({ p: symPlot().invX(p.x) }) } },
  },
  "graph-transform": {
    render: graphTransform,
    handles: {
      A: {
        x: "c",
        y: "d",
        drag: (p, v) => {
          const plot = transformPlot();
          return { c: TRANSFORM_BASES[v.base].anchor[0] - plot.invX(p.x), d: plot.invY(p.y) - v.a * TRANSFORM_BASES[v.base].anchor[1] };
        },
      },
      B: {
        y: "a",
        drag: (p, v) => ({ a: (transformPlot().invY(p.y) - v.d) / TRANSFORM_BASES[v.base].probe[1] }),
      },
    },
  },
  "transform-order": {
    render: transformOrder,
    handles: { P: { x: "p", drag: (p) => ({ p: orderPlot().invX(p.x) }) } },
  },
  "piecewise-continuity": {
    render: piecewiseContinuity,
    handles: {
      A: {
        y: "m",
        drag: (p, v) => {
          const end = 2 * v.m + v.t;
          const t = piecePlot().invY(p.y);
          return { m: (end - t) / 2, t };
        },
      },
      E: { y: "t", drag: (p, v) => ({ t: piecePlot().invY(p.y) - 2 * v.m }) },
    },
  },
};
