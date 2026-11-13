import { factorForm, fmt, linear, point, quadratic, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  circle,
  clipped,
  handle,
  infoBox,
  line,
  open,
  Plot,
  polygon,
  polyline,
  rect,
  text,
  type LabView,
} from "./svg";

const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;

// ─── 7.1 Gerade durch zwei Punkte ─────────────────────────────────────────

const twoPointPlot = new Plot(-7, 7, -6, 6, { x: 20, y: 20, w: 300, h: 300 });

/** Slope and intercept of the line through (x1 | y1) and (x2 | y2); null when it is vertical. */
export function lineThrough(v: LabValues): { m: number; t: number } | null {
  if (v.x1 === v.x2) return null;
  const m = (v.y2 - v.y1) / (v.x2 - v.x1);
  return { m, t: v.y1 - m * v.x1 };
}

const lineTwoPoints: LabView = {
  render(v) {
    const plot = twoPointPlot;
    const g = lineThrough(v);
    const P = plot.P(v.x1, v.y1);
    const Q = plot.P(v.x2, v.y2);
    let out = open(g ? `Gerade durch P und Q: y = ${linear(g.m, g.t)}` : "P und Q liegen senkrecht übereinander");
    out += plot.clip("tp-clip") + plot.grid(1, 2);
    if (g) {
      out += clipped("tp-clip", plot.lineThrough(g.m, g.t, "lab-curve"));
      // slope triangle from P to Q
      const C = plot.P(v.x2, v.y1);
      out += polygon([P, C, Q], "lab-fill-c");
      out += line(P.x, P.y, C.x, C.y, "lab-side-b") + line(C.x, C.y, Q.x, Q.y, "lab-side-a");
      out += text((P.x + C.x) / 2, C.y + (v.y2 >= v.y1 ? 16 : -8), `Δx = ${fmt(v.x2 - v.x1)}`, "lab-text-b", "middle");
      out += text(C.x + 6, (C.y + Q.y) / 2 + 4, `Δy = ${fmt(v.y2 - v.y1)}`, "lab-text-a");
      const T = plot.P(0, g.t);
      if (plot.contains(0, g.t)) out += circle(T.x, T.y, 5, "lab-point-ok");
    } else {
      out += clipped("tp-clip", line(P.x, plot.box.y, P.x, plot.box.y + plot.box.h, "lab-curve"));
    }
    out += text(P.x - 8, P.y - 8, "P", "lab-text", "end") + text(Q.x + 8, Q.y - 8, "Q", "lab-text");
    out += infoBox(336, 60, [
      [`P${point(v.x1, v.y1)}`, "lab-text-small"],
      [`Q${point(v.x2, v.y2)}`, "lab-text-small"],
      [g ? `m = Δy : Δx = ${fmt(g.m, 2)}` : "senkrecht: keine Funktion", "lab-text-c"],
      [g ? `t = ${fmt(g.t, 2)}` : "", "lab-text-ok"],
      [g ? `y = ${linear(g.m, g.t)}` : `x = ${fmt(v.x1)}`, "lab-text-a"],
    ]);
    out += handle("P", P.x, P.y, "Punkt P", "lab-handle lab-handle-a");
    out += handle("Q", Q.x, Q.y, "Punkt Q", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    P: { x: "x1", y: "y1", drag: (p) => ({ x1: twoPointPlot.invX(p.x), y1: twoPointPlot.invY(p.y) }) },
    Q: { x: "x2", y: "y2", drag: (p) => ({ x2: twoPointPlot.invX(p.x), y2: twoPointPlot.invY(p.y) }) },
  },
};

// ─── 7.2 Parallele und Senkrechte ─────────────────────────────────────────

/** The slopes the learner can give g (never 0, so the perpendicular exists). */
export const SLOPES = [-2, -1, -0.5, 0.5, 1, 2, 3];

const ppPlot = new Plot(-7, 7, -6, 6, { x: 20, y: 20, w: 300, h: 300 });

const parallelPerp: LabView = {
  render(v) {
    const plot = ppPlot;
    const mp = -1 / v.m;
    const tPar = v.py - v.m * v.px;
    const tPerp = v.py - mp * v.px;
    const P = plot.P(v.px, v.py);
    let out = open(`g: y = ${linear(v.m, v.t)}; Parallele und Senkrechte durch P${point(v.px, v.py)}`);
    out += plot.clip("pp-clip") + plot.grid(1, 2);
    out += clipped(
      "pp-clip",
      plot.lineThrough(v.m, v.t, "lab-curve") + plot.lineThrough(v.m, tPar, "lab-curve-2") + plot.lineThrough(mp, tPerp, "lab-curve-c"),
    );
    out += circle(P.x, P.y, 5, "lab-point");
    out += text(P.x + 9, P.y - 9, "P", "lab-text");
    out += infoBox(336, 60, [
      [`g: y = ${linear(v.m, v.t)}`, "lab-text-a"],
      ["parallel durch P:", "lab-text-small"],
      [`y = ${linear(v.m, tPar)}`, "lab-text-b"],
      ["senkrecht durch P:", "lab-text-small"],
      [`y = ${linear(mp, tPerp)}`, "lab-text-c"],
      [`m · m⊥ = ${fmt(v.m, 2)} · ${fmt(mp, 2)} = −1`, "lab-text-small"],
    ]);
    const T = plot.P(0, v.t);
    out += handle("t", T.x, T.y, "y-Achsenabschnitt von g");
    out += handle("P", P.x, P.y, "Punkt P", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    t: { y: "t", drag: (p) => ({ t: ppPlot.invY(p.y) }) },
    P: { x: "px", y: "py", drag: (p) => ({ px: ppPlot.invX(p.x), py: ppPlot.invY(p.y) }) },
  },
};

// ─── 7.3 Binomische Formeln als Flächen ───────────────────────────────────

export const BINOMIALS = ["(a + b)²", "(a − b)²", "(a + b) · (a − b)"];
const BIN = { x0: 30, y0: 46, k: 26 };

const binomialArea: LabView = {
  render(v) {
    const { x0, y0, k } = BIN;
    const A = v.a * k;
    const B = v.b * k;
    let out = open(`Binomische Formel ${BINOMIALS[v.formula]} mit a = ${fmt(v.a)} und b = ${fmt(v.b)}`);
    let right: Array<[string, string]>;
    let handleA = { x: x0 + A, y: y0 + A };
    if (v.formula === 0) {
      out += rect(x0, y0, A, A, "lab-fill-a") + rect(x0 + A, y0, B, A, "lab-fill-b") + rect(x0, y0 + A, A, B, "lab-fill-b") + rect(x0 + A, y0 + A, B, B, "lab-fill-c");
      out += text(x0 + A / 2, y0 + A / 2 + 5, "a²", "lab-text-a", "middle");
      if (B > 22) {
        out += text(x0 + A + B / 2, y0 + A / 2 + 5, "ab", "lab-text-b", "middle") + text(x0 + A / 2, y0 + A + B / 2 + 5, "ab", "lab-text-b", "middle");
        out += text(x0 + A + B / 2, y0 + A + B / 2 + 5, "b²", "lab-text-c", "middle");
      }
      right = [
        ["(a + b)² = a² + 2ab + b²", "lab-text"],
        [`${fmt((v.a + v.b) ** 2, 2)} = ${fmt(v.a ** 2, 2)} + ${fmt(2 * v.a * v.b, 2)} + ${fmt(v.b ** 2, 2)}`, "lab-text-small"],
      ];
    } else if (v.formula === 1) {
      const fits = v.a > v.b;
      out += rect(x0, y0, A, A, "lab-ghost");
      if (fits) {
        out += rect(x0, y0, A - B, A - B, "lab-fill-ok");
        out += rect(x0 + A - B, y0, B, A, "lab-fill-b") + rect(x0, y0 + A - B, A, B, "lab-fill-b");
        out += rect(x0 + A - B, y0 + A - B, B, B, "lab-fill-c");
        out += text(x0 + (A - B) / 2, y0 + (A - B) / 2 + 5, "(a − b)²", "lab-text-ok", "middle");
      }
      right = [
        ["(a − b)² = a² − 2ab + b²", "lab-text"],
        [fits ? `${fmt((v.a - v.b) ** 2, 2)} = ${fmt(v.a ** 2, 2)} − ${fmt(2 * v.a * v.b, 2)} + ${fmt(v.b ** 2, 2)}` : "Für das Bild muss a größer als b sein.", "lab-text-small"],
        ["Vom Quadrat a² zwei Streifen ab wegnehmen;", "lab-text-small"],
        ["das Eck b² wurde doppelt weggenommen: + b²", "lab-text-small"],
      ];
    } else {
      const fits = v.a > v.b;
      out += rect(x0, y0, A, A, "lab-ghost");
      if (fits) {
        out += rect(x0, y0, A - B, A - B, "lab-fill-a") + rect(x0 + A - B, y0, B, A - B, "lab-fill-b");
        out += rect(x0 + A, y0, B, A - B, "lab-fill-b") + rect(x0 + A - B, y0 + A - B, B, B, "lab-ghost");
        out += text(x0 + (A - B) / 2, y0 + (A - B) / 2 + 5, "(a + b)(a − b)", "lab-text-a", "middle");
      }
      handleA = { x: x0 + A, y: y0 + A };
      right = [
        ["(a + b)(a − b) = a² − b²", "lab-text"],
        [fits ? `${fmt((v.a + v.b) * (v.a - v.b), 2)} = ${fmt(v.a ** 2, 2)} − ${fmt(v.b ** 2, 2)}` : "Für das Bild muss a größer als b sein.", "lab-text-small"],
        ["Der Streifen b rechts wird nach oben", "lab-text-small"],
        ["umgelegt: a² ohne das Eck b².", "lab-text-small"],
      ];
    }
    out += text(x0 + A / 2, y0 - 8, "a", "lab-text-axis", "middle") + text(x0 + A + B / 2, y0 - 8, "b", "lab-text-axis", "middle");
    out += text(14, 24, BINOMIALS[v.formula], "lab-text lab-text-big");
    out += infoBox(330, 70, right);
    out += handle("a", handleA.x, handleA.y, "Länge a");
    out += handle("b", x0 + A + B, y0, "Länge b", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    a: { x: "a", drag: (p) => ({ a: (p.x - BIN.x0) / BIN.k }) },
    b: { x: "b", drag: (p, v) => ({ b: (p.x - BIN.x0) / BIN.k - v.a }) },
  },
};

// ─── 7.4 Quadratische Gleichungen: Nullstellen und Faktoren (aus M9 RS) ──

const rootsPlot = new Plot(-8, 8, -6, 6);

const roots: LabView = {
  render(v) {
    const plot = rootsPlot;
    const f = (x: number) => v.a * (x - v.x1) * (x - v.x2);
    const xs = (v.x1 + v.x2) / 2;
    let out = open("Eine Parabel mit ziehbaren Nullstellen");
    out += plot.clip("clip-roots") + plot.grid(1, 2);
    out += clipped("clip-roots", plot.graph(f, "lab-curve"));
    const S = plot.P(xs, f(xs));
    if (plot.contains(xs, f(xs))) out += circle(S.x, S.y, 5, "lab-point-ok");
    out += clipped("clip-roots", line(S.x, plot.Y(plot.ymin), S.x, plot.Y(plot.ymax), "lab-dashed"));
    const b = -v.a * (v.x1 + v.x2);
    const c = v.a * v.x1 * v.x2;
    out += infoBox(32, 34, [
      [`${quadratic(v.a, b, c)} = 0`, "lab-text lab-text-big"],
      [`faktorisiert: ${factorForm(v.a, v.x1, v.x2)} = 0`, "lab-text-muted"],
      [same(v.x1, v.x2) ? `eine Lösung: x = ${fmt(v.x1)}` : `Lösungen: x₁ = ${fmt(Math.min(v.x1, v.x2))}, x₂ = ${fmt(Math.max(v.x1, v.x2))}`, "lab-text-small"],
    ]);
    const R1 = plot.P(v.x1, 0);
    const R2 = plot.P(v.x2, 0);
    out += handle("x1", R1.x, R1.y, "Nullstelle x₁", "lab-handle lab-handle-a");
    out += handle("x2", R2.x, R2.y, "Nullstelle x₂", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    x1: { x: "x1", drag: (p) => ({ x1: rootsPlot.invX(p.x) }) },
    x2: { x: "x2", drag: (p) => ({ x2: rootsPlot.invX(p.x) }) },
  },
};

// ─── 7.5 Bruchgleichung a : (x − b) = c ──────────────────────────────────

const fracPlot = new Plot(-8, 8, -6, 6);

/** The solution of a : (x − b) = c, or null when there is none. */
export function fractionSolution(a: number, b: number, c: number): number | null {
  if (c === 0 || a === 0) return null;
  return b + a / c;
}

const fractionEq: LabView = {
  render(v) {
    const plot = fracPlot;
    const sol = fractionSolution(v.a, v.b, v.c);
    let out = open(`Bruchgleichung ${fmt(v.a)} : (x − ${fmt(v.b)}) = ${fmt(v.c)}`);
    out += plot.clip("fr-clip") + plot.grid(1, 2);
    const left = (x: number) => (x < v.b - 0.02 ? v.a / (x - v.b) : Number.NaN);
    const rightBranch = (x: number) => (x > v.b + 0.02 ? v.a / (x - v.b) : Number.NaN);
    out += clipped("fr-clip", plot.graph(left, "lab-curve", 400) + plot.graph(rightBranch, "lab-curve", 400) + plot.lineThrough(0, v.c, "lab-curve-2"));
    out += clipped("fr-clip", line(plot.X(v.b), plot.box.y, plot.X(v.b), plot.box.y + plot.box.h, "lab-dashed"));
    if (sol !== null && plot.contains(sol, v.c)) {
      const S = plot.P(sol, v.c);
      out += circle(S.x, S.y, 6, "lab-point-ok");
    }
    const lhs = v.b === 0 ? `${fmt(v.a)} : x` : `${fmt(v.a)} : (x ${v.b > 0 ? "−" : "+"} ${fmt(Math.abs(v.b))})`;
    out += infoBox(32, 34, [
      [`${lhs} = ${fmt(v.c)}`, "lab-text lab-text-big"],
      [`D = ℚ \\ {${fmt(v.b)}}`, "lab-text-c"],
      [sol === null ? "L = { } (keine Lösung)" : `L = {${fmt(sol, 2)}}`, sol === null ? "lab-text-bad" : "lab-text-ok"],
    ]);
    out += handle("c", plot.X(6.5), plot.Y(v.c), "rechte Seite c", "lab-handle lab-handle-b");
    out += handle("b", plot.X(v.b), plot.Y(-5.3), "Definitionslücke b");
    return out + "</svg>";
  },
  handles: {
    c: { y: "c", drag: (p) => ({ c: fracPlot.invY(p.y) }) },
    b: { x: "b", drag: (p) => ({ b: fracPlot.invX(p.x) }) },
  },
};

// ─── 7.6 Abhängigkeiten erkennen ──────────────────────────────────────────

export interface DataSet {
  title: string;
  xLabel: string;
  yLabel: string;
  xs: number[];
  f: (x: number) => number;
  xmax: number;
  ymax: number;
  /** Where the k handle sits on the model curve. */
  handleX: number;
}

export const DATA_SETS: DataSet[] = [
  { title: "Äpfel: Preis für x kg", xLabel: "kg", yLabel: "€", xs: [1, 2, 3, 4, 5], f: (x) => 3 * x, xmax: 6.5, ymax: 24, handleX: 6 },
  { title: "Pizza: 24 Stücke für x Personen", xLabel: "Personen", yLabel: "Stück", xs: [1, 2, 3, 4, 6, 8], f: (x) => 24 / x, xmax: 9, ymax: 30, handleX: 2 },
  { title: "Fallweg nach x Sekunden", xLabel: "s", yLabel: "m", xs: [0.5, 1, 1.5, 2, 2.5], f: (x) => 5 * x * x, xmax: 3, ymax: 45, handleX: 2.8 },
];
export const MODEL_TYPES = ["linear: y = k · x", "umgekehrt proportional: y = k : x", "quadratisch: y = k · x²"];
export const modelValue = (type: number, k: number, x: number) => (type === 0 ? k * x : type === 1 ? k / x : k * x * x);

/** True when the model of `type` with factor k hits every data point. */
export function modelFits(v: LabValues): boolean {
  const data = DATA_SETS[v.data];
  return data.xs.every((x) => same(modelValue(v.type, v.k, x), data.f(x)));
}

const depPlot = (data: number) => new Plot(0, DATA_SETS[data].xmax, 0, DATA_SETS[data].ymax, { x: 50, y: 40, w: 270, h: 250 });

const dependencies: LabView = {
  render(v) {
    const data = DATA_SETS[v.data];
    const plot = depPlot(v.data);
    const fits = modelFits(v);
    let out = open(`${data.title}; Modell ${MODEL_TYPES[v.type]} mit k = ${v.k}`) + text(260, 25, data.title, "lab-text", "middle");
    out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
    out += plot.clip("dep-clip");
    out += clipped("dep-clip", plot.graph((x) => (x > 0.05 ? modelValue(v.type, v.k, x) : Number.NaN), fits ? "lab-curve-ok" : "lab-curve-2", 240));
    for (const x of data.xs) {
      const P = plot.P(x, data.f(x));
      out += circle(P.x, P.y, 5, "lab-point-a");
    }
    out += line(plot.box.x, plot.Y(0), plot.box.x + plot.box.w, plot.Y(0), "lab-ink") + line(plot.box.x, plot.box.y, plot.box.x, plot.Y(0), "lab-ink");
    out += text(plot.box.x + plot.box.w, plot.Y(0) + 16, data.xLabel, "lab-text-axis", "end");
    out += text(plot.box.x - 4, plot.box.y - 6, data.yLabel, "lab-text-axis", "end");
    // the table: data against model
    const tx = 340;
    out += text(tx, 54, "x", "lab-text-small") + text(tx + 40, 54, "Daten", "lab-text-a") + text(tx + 110, 54, "Modell", "lab-text-b");
    data.xs.forEach((x, i) => {
      const y = 76 + i * 20;
      out += text(tx, y, fmt(x, 1), "lab-text-small");
      out += text(tx + 40, y, fmt(data.f(x), 2), "lab-text-small");
      const m = modelValue(v.type, v.k, x);
      out += text(tx + 110, y, fmt(m, 2), same(m, data.f(x)) ? "lab-text-ok" : "lab-text-small");
    });
    out += text(tx, 220, MODEL_TYPES[v.type].split(":")[0], "lab-text-c");
    out += text(tx, 240, `k = ${v.k}`, "lab-text-c");
    out += text(tx, 266, fits ? "passt zu allen Punkten" : "passt noch nicht", fits ? "lab-text-ok" : "lab-text-bad");
    const H = plot.P(data.handleX, Math.min(modelValue(v.type, v.k, data.handleX), data.ymax));
    out += handle("k", H.x, H.y, "Faktor k des Modells", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    k: {
      y: "k",
      drag: (p, v) => {
        const data = DATA_SETS[v.data];
        const y = depPlot(v.data).invY(p.y);
        const g = modelValue(v.type, 1, data.handleX);
        return { k: y / g };
      },
    },
  },
};

// ─── 7.7 Verschobene Normalparabel (aus Mathematik 9 Realschule) ──────────

const vertexPlot = new Plot(-8, 8, -5, 7);

const vertex: LabView = {
  render(v) {
    const plot = vertexPlot;
    const f = (x: number) => v.s * (x - v.d) ** 2 + v.e;
    let out = open("Eine verschobene Normalparabel mit ziehbarem Scheitel");
    out += plot.clip("clip-vertex") + plot.grid(1, 2);
    out += clipped("clip-vertex", plot.graph((x) => v.s * x * x, "lab-ghost") + plot.graph(f, "lab-curve"));
    // the stairs of the normal parabola: 1 right 1 up (down), 2 right 4 up (down)
    const S = plot.P(v.d, v.e);
    const stairs = [plot.P(v.d, v.e), plot.P(v.d + 1, v.e), plot.P(v.d + 1, v.e + v.s), plot.P(v.d + 2, v.e + v.s), plot.P(v.d + 2, v.e + 4 * v.s)];
    out += clipped("clip-vertex", polyline(stairs, "lab-dashed"));
    for (const [x, y] of [
      [1, 2],
      [5, 2],
    ]) {
      const P = plot.P(x, y);
      const hit = Math.abs(f(x) - y) < 1e-9;
      out += circle(P.x, P.y, 7, hit ? "lab-point-ok" : "lab-target");
      out += text(P.x + 9, P.y - 9, `(${x} | ${y})`, "lab-text-small");
    }
    out += infoBox(32, 34, [
      [`y = ${vertexForm(v.s, v.d, v.e)}`, "lab-text lab-text-big"],
      [`Scheitel S${point(v.d, v.e)}, nach ${v.s > 0 ? "oben" : "unten"} geöffnet`, "lab-text lab-text-c"],
      [`gestrichelt: y = ${v.s > 0 ? "" : "−"}x²`, "lab-text-small"],
    ]);
    out += handle("S", S.x, S.y, "Scheitel S");
    return out + "</svg>";
  },
  handles: {
    S: { x: "d", y: "e", drag: (p) => ({ d: vertexPlot.invX(p.x), e: vertexPlot.invY(p.y) }) },
  },
};

// ─── 7.8 Quadratische Ergänzung mit Kacheln (aus Mathematik 9 Realschule) ─

const TILES = { x0: 30, y0: 60, X: 130, u: 18 };

const squareTiles: LabView = {
  render(v) {
    const { x0, y0, X, u } = TILES;
    const half = v.b / 2;
    const H = half * u;
    const side = Math.sqrt(v.q) * u;
    const fits = v.q === half * half;
    let out = open("Algebra-Kacheln: x² + bx wird mit einem Eckquadrat zum vollständigen Quadrat");
    out += rect(x0, y0, X, X, "lab-fill-a");
    out += text(x0 + X / 2, y0 + X / 2 + 5, "x²", "lab-text lab-text-a lab-text-big", "middle");
    out += rect(x0 + X, y0, H, X, "lab-fill-b");
    out += rect(x0, y0 + X, X, H, "lab-fill-b");
    out += text(x0 + X + H / 2, y0 + X / 2 + 4, `${fmt(half)}x`, "lab-text lab-text-b", "middle");
    out += text(x0 + X / 2, y0 + X + H / 2 + 4, `${fmt(half)}x`, "lab-text lab-text-b", "middle");
    out += rect(x0 + X, y0 + X, H, H, "lab-target");
    if (v.q > 0) out += rect(x0 + X, y0 + X, side, side, fits ? "lab-fill-ok" : "lab-fill-c");
    out += text(x0 + X / 2, y0 - 8, "x", "lab-text-axis", "middle");
    out += text(x0 + X + H / 2, y0 - 8, `${fmt(half)}`, "lab-text-axis", "middle");
    out += text(x0 - 8, y0 + X / 2, "x", "lab-text-axis", "end");
    out += text(x0 - 8, y0 + X + H / 2 + 4, `${fmt(half)}`, "lab-text-axis", "end");
    out += text(x0, 30, fits ? `x² + ${fmt(v.b)}x + ${fmt(v.q)} = (x + ${fmt(half)})²` : `x² + ${fmt(v.b)}x: Ergänze das Eck zu einem Quadrat.`, fits ? "lab-text lab-text-ok" : "lab-text");
    const tx = 300;
    out += text(tx, 90, `y = ${quadratic(1, v.b, v.c)}`, "lab-text lab-text-big");
    out += text(tx, 116, `= x² + ${fmt(v.b)}x + ${fmt(v.q)} − ${fmt(v.q)}${v.c === 0 ? "" : v.c > 0 ? ` + ${fmt(v.c)}` : ` − ${fmt(-v.c)}`}`, "lab-text-muted");
    if (fits) {
      out += text(tx, 142, `= ${vertexForm(1, -half, v.c - v.q)}`, "lab-text lab-text-ok");
      out += text(tx, 170, `Scheitel S${point(-half, v.c - v.q)}`, "lab-text lab-text-c lab-text-big");
    } else {
      out += text(tx, 142, v.q < half * half ? "Das Eckquadrat ist zu klein." : "Das Eckquadrat ist zu groß.", "lab-text lab-text-bad");
      out += text(tx, 162, "Ein Binom entsteht nur mit (b : 2)².", "lab-text-small");
    }
    out += handle("corner", x0 + X + Math.max(side, 0), y0 + X + Math.max(side, 0), "Ecke des Ergänzungsquadrats");
    return out + "</svg>";
  },
  handles: {
    corner: {
      y: "q",
      drag: (p) => {
        const side = Math.max(0, Math.max(p.x - (TILES.x0 + TILES.X), p.y - (TILES.y0 + TILES.X))) / TILES.u;
        return { q: side * side };
      },
    },
  },
};

// ─── 7.9 Parabel durch zwei Punkte ────────────────────────────────────────

const fitPlot = new Plot(-6, 6, -6, 8, { x: 20, y: 20, w: 300, h: 300 });

/** p and q of y = s·x² + p·x + q through (x1 | y1) and (x2 | y2); null when x1 = x2. */
export function parabolaThrough(v: LabValues): { p: number; q: number } | null {
  if (v.x1 === v.x2) return null;
  const r1 = v.y1 - v.s * v.x1 * v.x1;
  const r2 = v.y2 - v.s * v.x2 * v.x2;
  const p = (r1 - r2) / (v.x1 - v.x2);
  return { p, q: r1 - p * v.x1 };
}

const parabolaFit: LabView = {
  render(v) {
    const plot = fitPlot;
    const pq = parabolaThrough(v);
    const P = plot.P(v.x1, v.y1);
    const Q = plot.P(v.x2, v.y2);
    let out = open(pq ? `Parabel y = ${quadratic(v.s, pq.p, pq.q)} durch P und Q` : "P und Q übereinander: keine Parabel");
    out += plot.clip("fit-clip") + plot.grid(1, 2);
    if (pq) {
      out += clipped("fit-clip", plot.graph((x) => v.s * x * x + pq.p * x + pq.q, "lab-curve"));
      const xs = -pq.p / (2 * v.s);
      const ys = pq.q - (v.s * pq.p * pq.p) / 4;
      if (plot.contains(xs, ys)) {
        const S = plot.P(xs, ys);
        out += circle(S.x, S.y, 5, "lab-point-ok");
      }
      out += infoBox(336, 60, [
        [`y = ${v.s > 0 ? "" : "−"}x² + px + q`, "lab-text-small"],
        [`p = ${fmt(pq.p, 2)}, q = ${fmt(pq.q, 2)}`, "lab-text-c"],
        [`y = ${quadratic(v.s, pq.p, pq.q)}`, "lab-text-a"],
        [`Scheitel ${point(xs, ys)}`, "lab-text-ok"],
      ]);
    } else {
      out += infoBox(336, 60, [["Gleiche x-Werte:", "lab-text-small"], ["keine Funktion", "lab-text-bad"]]);
    }
    out += text(P.x - 8, P.y - 8, "P", "lab-text", "end") + text(Q.x + 8, Q.y - 8, "Q", "lab-text");
    out += handle("P", P.x, P.y, "Punkt P", "lab-handle lab-handle-a");
    out += handle("Q", Q.x, Q.y, "Punkt Q", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    P: { x: "x1", y: "y1", drag: (p) => ({ x1: fitPlot.invX(p.x), y1: fitPlot.invY(p.y) }) },
    Q: { x: "x2", y: "y2", drag: (p) => ({ x2: fitPlot.invX(p.x), y2: fitPlot.invY(p.y) }) },
  },
};

// ─── 7.10 Parabel und Gerade (aus Mathematik 9 Realschule) ────────────────

const PARABOLA_Q = -4; // y = x² − 4
const pgPlot = new Plot(-5, 5, -6, 8);

export function intersectionKind(m: number, t: number): { D: number; xs: number[] } {
  // x² − 4 = m·x + t  ⇔  x² − m·x − (4 + t) = 0
  const D = m * m + 4 * (4 + t);
  const xs = D < 0 ? [] : D === 0 ? [m / 2] : [(m - Math.sqrt(D)) / 2, (m + Math.sqrt(D)) / 2];
  return { D, xs };
}

function slopeHandlePoint(m: number, t: number, plot: Plot): { x: number; y: number } {
  const len = Math.hypot(1, m);
  const forward = { x: 2 / len, y: t + (2 * m) / len };
  if (plot.contains(forward.x, forward.y)) return forward;
  return { x: -2 / len, y: t - (2 * m) / len };
}

const parabolaLine: LabView = {
  render(v) {
    const plot = pgPlot;
    const { D, xs } = intersectionKind(v.m, v.t);
    let out = open("Eine Parabel und eine Gerade: zwei, ein oder kein gemeinsamer Punkt");
    out += plot.clip("clip-pg") + plot.grid(1, 2);
    out += clipped("clip-pg", plot.graph((x) => x * x + PARABOLA_Q, "lab-curve") + plot.lineThrough(v.m, v.t, "lab-curve-2"));
    for (const x of xs) {
      const y = v.m * x + v.t;
      if (plot.contains(x, y)) {
        const P = plot.P(x, y);
        out += circle(P.x, P.y, 6, "lab-point-ok");
      }
    }
    const kind = D > 0 ? "2 Schnittpunkte" : D === 0 ? "1 Berührpunkt" : "kein gemeinsamer Punkt";
    out += infoBox(32, 34, [
      [`Parabel y = x² − 4, Gerade y = ${linear(v.m, v.t)}`, "lab-text"],
      [`Gleichsetzen: ${quadratic(1, -v.m, -(4 + v.t))} = 0, D = ${fmt(D, 3)}`, "lab-text-muted"],
      [kind, D > 0 ? "lab-text lab-text-ok" : D === 0 ? "lab-text lab-text-c" : "lab-text lab-text-bad"],
    ]);
    const T = plot.P(0, v.t);
    const s = slopeHandlePoint(v.m, v.t, plot);
    const Sp = plot.P(s.x, s.y);
    out += handle("t", T.x, T.y, "Achsenabschnitt der Geraden");
    out += handle("m", Sp.x, Sp.y, "Steigung der Geraden", "lab-handle lab-handle-b");
    return out + "</svg>";
  },
  handles: {
    t: { y: "t", drag: (p) => ({ t: pgPlot.invY(p.y) }) },
    m: {
      y: "m",
      drag: (p, v) => {
        const x = pgPlot.invX(p.x);
        if (Math.abs(x) < 0.3) return {};
        return { m: (pgPlot.invY(p.y) - v.t) / x };
      },
    },
  },
};

export const FUNKTIONEN_VIEWS: Record<string, LabView> = {
  "line-two-points": lineTwoPoints,
  "parallel-perp": parallelPerp,
  "binomial-area": binomialArea,
  roots,
  "fraction-eq": fractionEq,
  dependencies,
  vertex,
  "square-tiles": squareTiles,
  "parabola-fit": parabolaFit,
  "parabola-line": parabolaLine,
};

