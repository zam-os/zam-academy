import { fmt, linear, shifted } from "../exercises/format";
import type { LabValues } from "../model/types";
import { clampX, clampY, type Line, placeInfo, polyText, quadraticRoots } from "./shared";
import { circle, clipped, handle, type LabView, line, open, Plot, type Pt, text } from "./svg";

/** "(x − 2)" or "x", for products of linear factors. */
export function factor(r: number): string {
  return shifted(r);
}

/** A set of numbers as written in D_f: "{−1; 2}". */
export function setText(values: number[]): string {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  return `{${sorted.map((v) => fmt(v)).join("; ")}}`;
}

/** Product of linear factors; a repeated factor is squared: [1, 1] → "(x − 1)²". */
export function factorProduct(roots: number[]): string {
  if (roots.length === 2 && roots[0] === roots[1]) {
    const f = factor(roots[0]);
    return f === "x" ? "x²" : `${f}²`;
  }
  const parts = roots.map(factor);
  // A bare x goes first: "x(x − 3)".
  parts.sort((a, b) => (a === "x" ? -1 : b === "x" ? 1 : 0));
  return parts.join("");
}

// ─── 2.1 Definitionsmenge und Nullstellen ──────────────────────────────────

export function numeratorRoots(v: LabValues): number[] {
  return v.nz === 0 ? [] : v.nz === 1 ? [v.z1] : [v.z1, v.z2];
}

export function denominatorRoots(v: LabValues): number[] {
  return v.nd === 1 ? [v.p1] : [v.p1, v.p2];
}

/** True when numerator and denominator share a linear factor, so the term is not fully reduced. */
export function sharesFactor(v: LabValues): boolean {
  return numeratorRoots(v).some((z) => denominatorRoots(v).includes(z));
}

export function zpValue(v: LabValues, x: number): number {
  const num = numeratorRoots(v).reduce((acc, z) => acc * (x - z), 1);
  const den = denominatorRoots(v).reduce((acc, p) => acc * (x - p), 1);
  return Math.abs(den) < 1e-12 ? Number.NaN : num / den;
}

export function zpTerm(v: LabValues): string {
  const z = numeratorRoots(v);
  const p = denominatorRoots(v);
  const top = z.length === 0 ? "1" : z.length === 1 ? factor(z[0]) : factorProduct(z);
  const bottom = p.length === 1 ? factor(p[0]) : `(${factorProduct(p)})`;
  return `${top} / ${bottom}`;
}

/** The expanded polynomial of the roots, highest power first. */
export function expand(roots: number[]): number[] {
  return roots.reduce<number[]>((poly, r) => {
    const next = [...poly, 0];
    for (let i = poly.length; i > 0; i--) next[i] -= r * poly[i - 1];
    return next;
  }, [1]);
}

const zpPlot = () => new Plot(-6, 6, -5, 5);
const POLE_Y = 4.4;

function rationalZerosPoles(v: LabValues): string {
  const plot = zpPlot();
  const f = (x: number) => zpValue(v, x);
  const shared = sharesFactor(v);
  let out = open("Graph einer gebrochen-rationalen Funktion mit ziehbaren Nullstellen und Definitionslücken");
  out += plot.clip("clip-zp") + plot.grid(1, 1);
  const poles = [...new Set(denominatorRoots(v))];
  for (const p of poles) out += line(plot.X(p), plot.box.y, plot.X(p), plot.box.y + plot.box.h, "lab-dashed");
  out += clipped("clip-zp", plot.graph(f, "lab-curve", 600));
  const handles: string[] = [];
  const avoid: Pt[] = [];
  numeratorRoots(v).forEach((z, i) => {
    const P = plot.P(z, 0);
    avoid.push(P);
    if (denominatorRoots(v).includes(z)) {
      // A shared factor: the zero turns into a hole of the graph.
      const y = zpValue(v, z + 1e-6);
      if (Number.isFinite(y) && plot.contains(z, y)) out += circle(plot.X(z), plot.Y(y), 5.5, "lab-plot-bg lab-ink");
    }
    handles.push(handle(`Z${i + 1}`, P.x, P.y, `Nullstelle des Zählers z${i + 1}`));
  });
  denominatorRoots(v).forEach((p, i) => {
    const P = plot.P(p, POLE_Y);
    avoid.push(P);
    handles.push(handle(`P${i + 1}`, P.x, P.y, `Nullstelle des Nenners p${i + 1}`, "lab-handle lab-handle-b"));
  });
  const lines: Line[] = [
    [`f(x) = ${zpTerm(v)}`, "lab-text lab-text-big"],
    shared ? ["Zähler und Nenner haben einen gemeinsamen Faktor", "lab-text lab-text-bad"] : [`D_f = ℝ \\ ${setText(denominatorRoots(v))}`, "lab-text lab-text-b"],
  ];
  out += placeInfo(plot, lines, avoid, [f]);
  out += handles.join("");
  return out + "</svg>";
}

// ─── 2.2 Verhalten im Unendlichen und Asymptoten ───────────────────────────

export const ASYMPTOTE_FUNCTIONS = [
  { term: "(2x + 1) / (x − 1)", f: (x: number) => (2 * x + 1) / (x - 1), m: 0, t: 2, pole: 1 as number | null },
  { term: "3x / (x² + 1)", f: (x: number) => (3 * x) / (x * x + 1), m: 0, t: 0, pole: null },
  { term: "(−3x² + x) / (2x² + 5)", f: (x: number) => (-3 * x * x + x) / (2 * x * x + 5), m: 0, t: -1.5, pole: null },
  { term: "0,5x − 1 + 2 / (x + 1)", f: (x: number) => 0.5 * x - 1 + 2 / (x + 1), m: 0.5, t: -1, pole: -1 },
] as const;

/** Distance of the graph from the learner's line y = mx + t at x. */
export function gapAt(v: LabValues, x: number): number {
  return ASYMPTOTE_FUNCTIONS[v.fn].f(x) - (v.m * x + v.t);
}

export function isAsymptote(v: LabValues): boolean {
  const target = ASYMPTOTE_FUNCTIONS[v.fn];
  return v.m === target.m && v.t === target.t;
}

const asymPlot = () => new Plot(-8, 8, -6, 6);

function asymptoteInfinity(v: LabValues): string {
  const plot = asymPlot();
  const def = ASYMPTOTE_FUNCTIONS[v.fn];
  const ok = isAsymptote(v);
  let out = open("Graph mit einer ziehbaren Geraden, die auf die Asymptote gelegt werden soll");
  out += plot.clip("clip-asym") + plot.grid(1, 2);
  if (def.pole !== null) out += line(plot.X(def.pole), plot.box.y, plot.X(def.pole), plot.box.y + plot.box.h, "lab-dashed");
  out += clipped("clip-asym", plot.graph(def.f, "lab-curve", 600) + plot.lineThrough(v.m, v.t, ok ? "lab-curve-ok" : "lab-curve-c"));
  const T = { x: plot.X(0), y: clampY(plot, v.t) };
  const M = { x: plot.X(4), y: clampY(plot, 4 * v.m + v.t) };
  const lines: Line[] = [
    [`f(x) = ${def.term}`, "lab-text lab-text-big"],
    [`Gerade: y = ${linear(v.m, v.t)}`, ok ? "lab-text lab-text-ok" : "lab-text lab-text-c"],
  ];
  out += placeInfo(plot, lines, [T, M], [def.f, (x) => v.m * x + v.t]);
  out += handle("T", T.x, T.y, "Achsenabschnitt der Geraden");
  out += handle("M", M.x, M.y, "Punkt der Geraden bei x = 4: ändert die Steigung", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 2.3 Polstellen und senkrechte Asymptoten ──────────────────────────────

export function poleValue(v: LabValues, x: number): number {
  const d = (x - v.p) ** v.n;
  return Math.abs(d) < 1e-12 ? Number.NaN : v.a / d;
}

/** The x of the probe point: the pole ± its distance. */
export function probeX(v: LabValues): number {
  return v.side === 0 ? v.p - v.dist : v.p + v.dist;
}

/** "+∞" or "−∞" for x → p from the left (side 0) or the right (side 1). */
export function oneSided(v: LabValues, side: 0 | 1): string {
  if (v.a === 0) return "0";
  const sign = v.n === 2 ? Math.sign(v.a) : Math.sign(v.a) * (side === 1 ? 1 : -1);
  return sign > 0 ? "+∞" : "−∞";
}

export function poleTerm(v: LabValues): string {
  if (v.a === 0) return "0";
  const base = shifted(v.p);
  return `${fmt(v.a)} / ${v.n === 1 ? base : base === "x" ? "x²" : `${base}²`}`;
}

const polePlot = () => new Plot(-5, 5, -8, 8);

function poleApproach(v: LabValues): string {
  const plot = polePlot();
  const f = (x: number) => poleValue(v, x);
  let out = open("Graph mit Polstelle, senkrechter Asymptote und einem Punkt, der sich der Polstelle nähert");
  out += plot.clip("clip-pole") + plot.grid(1, 2);
  out += line(plot.X(v.p), plot.box.y, plot.X(v.p), plot.box.y + plot.box.h, "lab-dashed");
  out += clipped("clip-pole", plot.graph(f, "lab-curve", 800));
  const x = probeX(v);
  const y = f(x);
  const P = { x: plot.X(x), y: clampY(plot, y) };
  out += line(P.x, plot.Y(0), P.x, P.y, "lab-thin");
  const lines: Line[] = [
    [`f(x) = ${poleTerm(v)}`, "lab-text lab-text-big"],
    [`f(${fmt(x)}) = ${fmt(y)}`, "lab-text lab-text-a"],
    [`x → ${fmt(v.p)} von links: ${oneSided(v, 0)}, von rechts: ${oneSided(v, 1)}`, "lab-text-small"],
  ];
  out += placeInfo(plot, lines, [P], [f]);
  out += text(plot.X(v.p) + 6, plot.box.y + 14, `x = ${fmt(v.p)}`, "lab-text-small");
  out += handle("X", P.x, P.y, "Punkt nahe der Polstelle");
  return out + "</svg>";
}

// ─── 2.4 Graph und Term ────────────────────────────────────────────────────

export function buildValue(v: LabValues, x: number): number {
  const d = (x - v.p) ** v.n;
  return Math.abs(d) < 1e-12 ? Number.NaN : (v.a * (x - v.z)) / d;
}

export function buildTerm(v: LabValues): string {
  // a = 0 leaves the zero function on D_f: no single zero, no pole, a gap at p.
  if (v.a === 0) return `0 für x ≠ ${fmt(v.p)}`;
  const factorText = v.a === 1 ? "" : v.a === -1 ? "−" : fmt(v.a);
  const top = factor(v.z) === "x" ? "x" : factor(v.z);
  const bottom = v.n === 1 ? factor(v.p) : factor(v.p) === "x" ? "x²" : `${factor(v.p)}²`;
  return `${factorText}${top} / ${bottom}`;
}

/** Zeros and the kind of gap at p, as the lab reports them. */
export function buildProps(v: LabValues): string {
  if (v.a === 0) return `a = 0: f ist überall 0, jedes x ≠ ${fmt(v.p)} ist Nullstelle; bei ${fmt(v.p)} nur eine Definitionslücke, kein Pol`;
  if (v.z === v.p) return "gemeinsamer Faktor: Term erst kürzen";
  return `Nullstelle ${fmt(v.z)}; Pol ${v.n === 1 ? "mit" : "ohne"} Vorzeichenwechsel bei ${fmt(v.p)}`;
}

const buildPlot = () => new Plot(-6, 6, -6, 6);

function rationalBuild(v: LabValues): string {
  const plot = buildPlot();
  const f = (x: number) => buildValue(v, x);
  let out = open("Gebrochen-rationale Funktion mit ziehbarer Nullstelle, Polstelle und Asymptote");
  out += plot.clip("clip-build") + plot.grid(1, 1);
  // a = 0: no pole, only a gap in the x-axis at p.
  if (v.a !== 0) out += line(plot.X(v.p), plot.box.y, plot.X(v.p), plot.box.y + plot.box.h, "lab-dashed");
  const asym = v.n === 1 ? v.a : 0;
  out += clipped("clip-build", plot.lineThrough(0, asym, "lab-dashed") + plot.graph(f, "lab-curve", 600));
  if (v.a === 0) out += circle(plot.X(v.p), plot.Y(0), 5.5, "lab-plot-bg lab-ink");
  const Z = plot.P(v.z, 0);
  const P = plot.P(v.p, 5.3);
  const avoid = [Z, P];
  let aHandle = "";
  if (v.n === 1) {
    const A = { x: plot.X(5.3), y: clampY(plot, v.a) };
    avoid.push(A);
    aHandle = handle("A", A.x, A.y, "waagrechte Asymptote y = a", "lab-handle lab-handle-b");
  }
  const lines: Line[] = [
    [`f(x) = ${buildTerm(v)}`, "lab-text lab-text-big"],
    v.a === 0
      ? [`a = 0: kein Pol, nur Lücke bei ${fmt(v.p)}`, "lab-text lab-text-bad"]
      : v.z === v.p
        ? ["gemeinsamer Faktor: erst kürzen!", "lab-text lab-text-bad"]
        : [`Asymptote y = ${fmt(asym)}`, "lab-text-muted"],
  ];
  out += placeInfo(plot, lines, avoid, [f]);
  out += handle("Z", Z.x, Z.y, "Nullstelle");
  out += handle("P", P.x, P.y, "Polstelle", "lab-handle lab-handle-a");
  out += aHandle;
  return out + "</svg>";
}

// ─── 2.5 Schnittpunkte ─────────────────────────────────────────────────────

export const CUT_FUNCTIONS = [
  { term: "1/x", f: (x: number) => (x === 0 ? Number.NaN : 1 / x), pole: 0 },
  { term: "2/(x − 1) + 1", f: (x: number) => (x === 1 ? Number.NaN : 2 / (x - 1) + 1), pole: 1 },
] as const;

/** The quadratic equation a·x² + b·x + c = 0 that f(x) = mx + t leads to. */
export function cutEquation(v: LabValues): [number, number, number] {
  if (v.fn === 0) return [v.m, v.t, -1];
  return [v.m, v.t - 1 - v.m, -(v.t + 1)];
}

/** The intersection x-values, without the pole. */
export function cutPoints(v: LabValues): number[] {
  const [a, b, c] = cutEquation(v);
  if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) return [];
  return quadraticRoots(a, b, c).filter((x) => Math.abs(x - CUT_FUNCTIONS[v.fn].pole) > 1e-9);
}

const cutPlot = () => new Plot(-6, 6, -6, 6);

function rationalIntersections(v: LabValues): string {
  const plot = cutPlot();
  const def = CUT_FUNCTIONS[v.fn];
  const cuts = cutPoints(v);
  let out = open("Graph einer gebrochen-rationalen Funktion und einer ziehbaren Geraden mit ihren Schnittpunkten");
  out += plot.clip("clip-cut") + plot.grid(1, 1);
  out += line(plot.X(def.pole), plot.box.y, plot.X(def.pole), plot.box.y + plot.box.h, "lab-dashed");
  out += clipped("clip-cut", plot.graph(def.f, "lab-curve", 600) + plot.lineThrough(v.m, v.t, "lab-curve-c"));
  for (const x of cuts) {
    const y = v.m * x + v.t;
    if (plot.contains(x, y)) out += circle(plot.X(x), plot.Y(y), 6, cuts.length === 1 ? "lab-point-ok" : "lab-point-a");
  }
  const T = { x: plot.X(0), y: clampY(plot, v.t) };
  const M = { x: clampX(plot, 3), y: clampY(plot, 3 * v.m + v.t) };
  const lines: Line[] = [
    [`${polyText(cutEquation(v))} = 0`, "lab-text lab-text-big"],
    [cuts.length === 0 ? "kein Schnittpunkt" : cuts.length === 1 ? "ein gemeinsamer Punkt" : "zwei Schnittpunkte", "lab-text-muted"],
  ];
  out += placeInfo(plot, lines, [T, M], [def.f, (x) => v.m * x + v.t]);
  out += handle("T", T.x, T.y, "Achsenabschnitt der Geraden");
  out += handle("M", M.x, M.y, "Punkt der Geraden bei x = 3", "lab-handle lab-handle-b");
  return out + "</svg>";
}

export const GEBROCHEN_RATIONAL_VIEWS: Record<string, LabView> = {
  "rational-zeros-poles": {
    render: rationalZerosPoles,
    handles: {
      Z1: { x: "z1", drag: (p) => ({ z1: zpPlot().invX(p.x) }) },
      Z2: { x: "z2", drag: (p) => ({ z2: zpPlot().invX(p.x) }) },
      P1: { x: "p1", drag: (p) => ({ p1: zpPlot().invX(p.x) }) },
      P2: { x: "p2", drag: (p) => ({ p2: zpPlot().invX(p.x) }) },
    },
  },
  "asymptote-infinity": {
    render: asymptoteInfinity,
    handles: {
      T: { y: "t", drag: (p) => ({ t: asymPlot().invY(p.y) }) },
      M: { y: "m", drag: (p, v) => ({ m: (asymPlot().invY(p.y) - v.t) / 4 }) },
    },
  },
  "pole-approach": {
    render: poleApproach,
    handles: {
      X: {
        x: "dist",
        drag: (p, v) => {
          const x = polePlot().invX(p.x);
          return { side: x < v.p ? 0 : 1, dist: Math.abs(x - v.p) };
        },
      },
    },
  },
  "rational-build": {
    render: rationalBuild,
    handles: {
      Z: { x: "z", drag: (p) => ({ z: buildPlot().invX(p.x) }) },
      P: { x: "p", drag: (p) => ({ p: buildPlot().invX(p.x) }) },
      A: { y: "a", drag: (p) => ({ a: buildPlot().invY(p.y) }) },
    },
  },
  "rational-intersections": {
    render: rationalIntersections,
    handles: {
      T: { y: "t", drag: (p) => ({ t: cutPlot().invY(p.y) }) },
      M: { y: "m", drag: (p, v) => ({ m: (cutPlot().invY(p.y) - v.t) / 3 }) },
    },
  },
};
