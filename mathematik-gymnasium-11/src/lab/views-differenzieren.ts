import { fmt, linear, shifted } from "../exercises/format";
import type { LabValues } from "../model/types";
import { clampX, clampY, eq, type Line, placeInfo, polyAt, polyDerivative, polyText, sameGraph } from "./shared";
import { circle, clipped, handle, type LabView, line, open, Plot, type Pt, text } from "./svg";

const DEG = 180 / Math.PI;

// ─── 4.1 Mittlere Änderungsrate ────────────────────────────────────────────

export const SECANT_FUNCTIONS = [
  { term: "f(x) = 0,5x²", f: (x: number) => 0.5 * x * x, plot: () => new Plot(-4, 4, -1, 8), unit: "", x: "x", y: "y" },
  { term: "s(t) = t² (t in s, s in m)", f: (x: number) => x * x, plot: () => new Plot(0, 8, 0, 64), unit: "m/s", x: "t", y: "s" },
  { term: "f(x) = x³/3 − x", f: (x: number) => x ** 3 / 3 - x, plot: () => new Plot(-3, 3, -4, 4), unit: "", x: "x", y: "y" },
] as const;

/** The difference quotient (f(x₁) − f(x₀)) / (x₁ − x₀), NaN when x₁ = x₀. */
export function secantSlope(v: LabValues): number {
  const f = SECANT_FUNCTIONS[v.fn].f;
  return v.x1 === v.x0 ? Number.NaN : (f(v.x1) - f(v.x0)) / (v.x1 - v.x0);
}

function secantView(v: LabValues): string {
  const def = SECANT_FUNCTIONS[v.fn];
  const plot = def.plot();
  const m = secantSlope(v);
  let out = open("Graph mit zwei ziehbaren Punkten und der Sekante durch sie");
  out += plot.clip("clip-sec") + plot.grid(v.fn === 1 ? 8 : 1, v.fn === 1 ? 8 : 1, def.x, def.y);
  out += clipped("clip-sec", plot.graph(def.f, "lab-curve") + (Number.isFinite(m) ? plot.lineThrough(m, def.f(v.x0) - m * v.x0, "lab-curve-c") : ""));
  const P = { x: clampX(plot, v.x0), y: clampY(plot, def.f(v.x0)) };
  const Q = { x: clampX(plot, v.x1), y: clampY(plot, def.f(v.x1)) };
  // Slope triangle Δx, Δy.
  out += line(P.x, P.y, Q.x, P.y, "lab-side-b") + line(Q.x, P.y, Q.x, Q.y, "lab-side-a");
  const lines: Line[] = [
    [def.term, "lab-text lab-text-big"],
    [Number.isFinite(m) ? `Δy : Δx ${eq(m)}${def.unit ? ` ${def.unit}` : ""}` : "x₀ = x₁: keine Sekante", "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [P, Q], [def.f]);
  out += handle("P", P.x, P.y, "Punkt P") + handle("Q", Q.x, Q.y, "Punkt Q", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 4.2 Vom Differenzenquotienten zum Differentialquotienten ─────────────

export const LIMIT_FUNCTIONS_D = [
  { term: "x²", f: (x: number) => x * x, d: (x: number) => 2 * x },
  { term: "x³", f: (x: number) => x ** 3, d: (x: number) => 3 * x * x },
  { term: "0,5x³ − 2x", f: (x: number) => 0.5 * x ** 3 - 2 * x, d: (x: number) => 1.5 * x * x - 2 },
] as const;

/** The signed step: +h to the right, −h to the left. */
export function signedH(v: LabValues): number {
  return v.side === 1 ? v.h : -v.h;
}

export function dq(v: LabValues): number {
  const f = LIMIT_FUNCTIONS_D[v.fn].f;
  const h = signedH(v);
  return (f(v.x0 + h) - f(v.x0)) / h;
}

const tangentPlot = () => new Plot(-3, 3, -4, 8);

function secantToTangent(v: LabValues): string {
  const plot = tangentPlot();
  const def = LIMIT_FUNCTIONS_D[v.fn];
  const h = signedH(v);
  const m = dq(v);
  const slope = def.d(v.x0);
  let out = open("Sekante durch P und Q; wird h kleiner, nähert sie sich der gestrichelten Tangente");
  out += plot.clip("clip-tan") + plot.grid(1, 1);
  out += clipped(
    "clip-tan",
    plot.graph(def.f, "lab-curve") + plot.lineThrough(slope, def.f(v.x0) - slope * v.x0, "lab-dashed") + plot.lineThrough(m, def.f(v.x0) - m * v.x0, "lab-curve-c"),
  );
  const P = { x: plot.X(v.x0), y: clampY(plot, def.f(v.x0)) };
  const Q = { x: clampX(plot, v.x0 + h), y: clampY(plot, def.f(v.x0 + h)) };
  const lines: Line[] = [
    [`f(x) = ${def.term}, h = ${fmt(h)}`, "lab-text"],
    [`Sekante: m ${eq(m, 3)}`, "lab-text lab-text-c"],
    [`Tangente: f′(${fmt(v.x0)}) = ${fmt(slope, 3)}`, "lab-text-muted"],
  ];
  out += placeInfo(plot, lines, [P, Q], [def.f]);
  out += handle("P", P.x, P.y, "Berührpunkt P") + handle("Q", Q.x, Q.y, "Sekantenpunkt Q, Abstand h", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 4.3 Differenzierbarkeit ───────────────────────────────────────────────

/** Left piece m₁·x for x ≤ 0, right piece x² + m₂·x for x > 0. */
export function kinkValue(v: LabValues, x: number): number {
  return x <= 0 ? v.m1 * x : x * x + v.m2 * x;
}

export function differentiableAt0(v: LabValues): boolean {
  return v.m1 === v.m2;
}

function kinkPlot(v: LabValues): Plot {
  const w = 3 / v.zoom;
  return new Plot(-w, w, -w, w);
}

function kinkZoom(v: LabValues): string {
  const plot = kinkPlot(v);
  const w = 3 / v.zoom;
  const f = (x: number) => kinkValue(v, x);
  let out = open("Graph einer abschnittsweise definierten Funktion unter der Lupe an der Stelle 0");
  out += plot.clip("clip-kink") + plot.grid(w / 4, w / 2);
  out += clipped("clip-kink", plot.graph(f, "lab-curve", 400));
  const L = { x: plot.X(-w / 3), y: clampY(plot, f(-w / 3)) };
  const R = { x: plot.X(w / 3), y: clampY(plot, f(w / 3)) };
  const lines: Line[] = [
    [`Lupe ×${v.zoom}`, "lab-text lab-text-big"],
    [`Steigung links ${fmt(v.m1)}, rechts ${fmt(v.m2)}`, "lab-text"],
    [differentiableAt0(v) ? "glatt: differenzierbar bei 0" : "Knick: nicht differenzierbar", differentiableAt0(v) ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
  ];
  out += placeInfo(plot, lines, [L, R], [f]);
  out += handle("L", L.x, L.y, "linker Ast: Steigung m₁") + handle("R", R.x, R.y, "rechter Ast: Steigung m₂", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 4.4 Graph der Ableitungsfunktion ──────────────────────────────────────

export const SKETCH_FUNCTIONS = [
  { term: "x³ − 3x", f: (x: number) => x ** 3 - 3 * x, d: (x: number) => 3 * x * x - 3 },
  { term: "−x³/3 + x²", f: (x: number) => -(x ** 3) / 3 + x * x, d: (x: number) => -x * x + 2 * x },
  { term: "x³/3 − 2x² + 3x", f: (x: number) => x ** 3 / 3 - 2 * x * x + 3 * x, d: (x: number) => x * x - 4 * x + 3 },
] as const;

export function sketch(v: LabValues): (x: number) => number {
  return (x) => v.a * (x - v.u) * (x - v.v);
}

export function sketchMatches(v: LabValues): boolean {
  return sameGraph(sketch(v), SKETCH_FUNCTIONS[v.fn].d, -3, 4);
}

/** The sketch as written: "3(x + 1)(x − 1)", "−x(x − 2)". */
export function sketchTerm(v: LabValues): string {
  const factor = v.a === 1 ? "" : v.a === -1 ? "−" : fmt(v.a);
  const parts = [shifted(v.u), shifted(v.v)].sort((p, q) => (p === "x" ? -1 : q === "x" ? 1 : 0));
  if (parts[0] === parts[1]) return `${factor}${parts[0] === "x" ? "x²" : `${parts[0]}²`}`;
  return `${factor}${parts.join("")}`;
}

const sketchPlot = () => new Plot(-3.5, 4.5, -6, 10);

/** Where the shape handle sits: one to the right of the larger zero. */
export function shapeX(v: LabValues): number {
  return Math.max(v.u, v.v) + 1;
}

function derivativeSketch(v: LabValues): string {
  const plot = sketchPlot();
  const def = SKETCH_FUNCTIONS[v.fn];
  const p = sketch(v);
  const ok = sketchMatches(v);
  let out = open("Graph von f und deine Skizze der Ableitungsfunktion als Parabel");
  out += plot.clip("clip-sketch") + plot.grid(1, 2);
  out += clipped("clip-sketch", plot.graph(def.f, "lab-curve") + plot.graph(p, ok ? "lab-curve-ok" : "lab-curve-c"));
  const U = plot.P(v.u, 0);
  const V = plot.P(v.v, 0);
  const xa = shapeX(v);
  const A = { x: plot.X(xa), y: clampY(plot, p(xa)) };
  const lines: Line[] = [
    [`f(x) = ${def.term}`, "lab-text lab-text-big"],
    [`Skizze: y = ${sketchTerm(v)}`, ok ? "lab-text lab-text-ok" : "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [U, V, A], [def.f, p]);
  out += handle("U", U.x, U.y, "erste Nullstelle der Skizze") + handle("V", V.x, V.y, "zweite Nullstelle der Skizze");
  out += handle("A", A.x, A.y, "Formpunkt der Skizze", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 4.5 Ableitungsregeln ──────────────────────────────────────────────────

export function rulesPoly(v: LabValues): number[] {
  return [v.a, v.b, v.c, v.d];
}

const rulesPlot = () => new Plot(-4, 4, -8, 8);

function derivativeRules(v: LabValues): string {
  const plot = rulesPlot();
  const p = rulesPoly(v);
  const d = polyDerivative(p);
  const f = (x: number) => polyAt(p, x);
  const fd = (x: number) => polyAt(d, x);
  let out = open("Graph von f (blau) und seiner Ableitung f′ (orange) mit Tangente im Punkt P");
  out += plot.clip("clip-rules") + plot.grid(1, 2);
  const m = fd(v.x0);
  out += clipped("clip-rules", plot.graph(f, "lab-curve") + plot.graph(fd, "lab-curve-c") + plot.lineThrough(m, f(v.x0) - m * v.x0, "lab-dashed"));
  const P = { x: plot.X(v.x0), y: clampY(plot, f(v.x0)) };
  const D = { x: plot.X(v.x0), y: clampY(plot, m) };
  out += line(P.x, P.y, D.x, D.y, "lab-thin") + circle(D.x, D.y, 5, "lab-point-b");
  const lines: Line[] = [
    [`f(x) = ${polyText(p)}`, "lab-text lab-text-big"],
    [`f′(x) = ${polyText(d)}`, "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [P, D], [f, fd]);
  out += handle("P", P.x, P.y, "Punkt P auf dem Graphen von f");
  return out + "</svg>";
}

// ─── 4.6 Lokale Änderungsrate im Sachkontext ───────────────────────────────

export const RATE_FUNCTIONS = [
  {
    name: "freier Fall: s(t) = 5t² (t in s, s in m)",
    f: (t: number) => 5 * t * t,
    d: (t: number) => 10 * t,
    plot: () => new Plot(0, 4, 0, 80),
    rate: (t: number) => `v = s′(${fmt(t)}) = ${fmt(10 * t)} m/s`,
    x: "t",
    y: "s",
  },
  {
    name: "Passstraße: h(x) = 60x² − 8x³ (x in km, h in m)",
    f: (x: number) => 60 * x * x - 8 * x ** 3,
    // Gradient in percent: h′(x) in m per km, divided by 10.
    d: (x: number) => (120 * x - 24 * x * x) / 10,
    plot: () => new Plot(0, 5, 0, 600),
    rate: (x: number) => `Steigung ${fmt((120 * x - 24 * x * x) / 10, 1)} %`,
    x: "x",
    y: "h",
  },
] as const;

function localRate(v: LabValues): string {
  const def = RATE_FUNCTIONS[v.fn];
  const plot = def.plot();
  let out = open("Sachkontext mit Tangente: ihre Steigung ist die lokale Änderungsrate");
  out += plot.clip("clip-rate") + plot.grid(v.fn === 0 ? 10 : 100, v.fn === 0 ? 20 : 100, def.x, def.y);
  const y0 = def.f(v.x0);
  // Slope in plot units: for the road h′ in m per km is 10 · percent.
  const m = v.fn === 0 ? def.d(v.x0) : def.d(v.x0) * 10;
  out += clipped("clip-rate", plot.graph(def.f, "lab-curve") + plot.lineThrough(m, y0 - m * v.x0, "lab-curve-c"));
  const P = { x: clampX(plot, v.x0), y: clampY(plot, y0) };
  const lines: Line[] = [
    [def.name, "lab-text-small"],
    [def.rate(v.x0), "lab-text lab-text-big"],
  ];
  out += placeInfo(plot, lines, [P], [def.f]);
  out += handle("P", P.x, P.y, "Zeitpunkt oder Ort");
  return out + "</svg>";
}

// ─── 4.7 Tangente und Steigungswinkel ──────────────────────────────────────

export const tangentF = (x: number) => 0.5 * x * x + 2;
export const tangentD = (x: number) => x;

/** Tangent y = m·x + t at x₀. */
export function tangentAt(x0: number): { m: number; t: number } {
  const m = tangentD(x0);
  return { m, t: tangentF(x0) - m * x0 };
}

export function slopeAngle(m: number): number {
  return Math.atan(m) * DEG;
}

const angleLabPlot = () => new Plot(-5, 5, -2, 10);

function tangentLine(v: LabValues): string {
  const plot = angleLabPlot();
  const { m, t } = tangentAt(v.x0);
  let out = open("Parabel mit Tangente im ziehbaren Punkt P und ihrem Steigungswinkel");
  out += plot.clip("clip-tl") + plot.grid(1, 2);
  out += clipped("clip-tl", plot.graph(tangentF, "lab-curve") + plot.lineThrough(m, t, "lab-curve-c"));
  const P = { x: plot.X(v.x0), y: clampY(plot, tangentF(v.x0)) };
  // The angle at the tangent's crossing with the x-axis, if it is in view.
  let marks = "";
  if (Math.abs(m) > 1e-9) {
    const xs = -t / m;
    if (xs > plot.xmin && xs < plot.xmax) {
      const S: Pt = plot.P(xs, 0);
      marks += circle(S.x, S.y, 4, "lab-point");
      marks += text(S.x + (m > 0 ? 18 : -18), S.y - 6, "α", "lab-text lab-text-c", "middle");
    }
  }
  const lines: Line[] = [
    [`t: y = ${linear(m, t)}`, "lab-text lab-text-big"],
    [`α ≈ ${fmt(slopeAngle(m), 1)}°`, "lab-text lab-text-c"],
  ];
  out += marks + placeInfo(plot, lines, [P], [tangentF, (x) => m * x + t]);
  out += handle("P", P.x, P.y, "Berührpunkt P");
  return out + "</svg>";
}

export const DIFFERENZIEREN_VIEWS: Record<string, LabView> = {
  "secant-slope": {
    render: secantView,
    handles: {
      P: { x: "x0", drag: (p, v) => ({ x0: SECANT_FUNCTIONS[v.fn].plot().invX(p.x) }) },
      Q: { x: "x1", drag: (p, v) => ({ x1: SECANT_FUNCTIONS[v.fn].plot().invX(p.x) }) },
    },
  },
  "secant-to-tangent": {
    render: secantToTangent,
    handles: {
      P: { x: "x0", drag: (p) => ({ x0: tangentPlot().invX(p.x) }) },
      Q: {
        x: "h",
        drag: (p, v) => {
          const x = tangentPlot().invX(p.x);
          return { side: x < v.x0 ? 0 : 1, h: Math.abs(x - v.x0) };
        },
      },
    },
  },
  "kink-zoom": {
    render: kinkZoom,
    handles: {
      L: { y: "m1", drag: (p, v) => ({ m1: kinkPlot(v).invY(p.y) / (-1 / v.zoom) }) },
      R: {
        y: "m2",
        drag: (p, v) => {
          const x = 1 / v.zoom;
          return { m2: (kinkPlot(v).invY(p.y) - x * x) / x };
        },
      },
    },
  },
  "derivative-sketch": {
    render: derivativeSketch,
    handles: {
      U: { x: "u", drag: (p) => ({ u: sketchPlot().invX(p.x) }) },
      V: { x: "v", drag: (p) => ({ v: sketchPlot().invX(p.x) }) },
      A: {
        y: "a",
        drag: (p, v) => {
          const x = shapeX(v);
          return { a: sketchPlot().invY(p.y) / ((x - v.u) * (x - v.v)) };
        },
      },
    },
  },
  "derivative-rules": {
    render: derivativeRules,
    handles: { P: { x: "x0", drag: (p) => ({ x0: rulesPlot().invX(p.x) }) } },
  },
  "local-rate": {
    render: localRate,
    handles: { P: { x: "x0", drag: (p, v) => ({ x0: RATE_FUNCTIONS[v.fn].plot().invX(p.x) }) } },
  },
  "tangent-line": {
    render: tangentLine,
    handles: { P: { x: "x0", drag: (p) => ({ x0: angleLabPlot().invX(p.x) }) } },
  },
};
