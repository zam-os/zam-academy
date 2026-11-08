import { fmt, quadratic, sum } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  circle,
  clamp,
  clipped,
  handle,
  infoBox,
  line,
  open,
  Plot,
  polygon,
  rect,
  text,
  type LabView,
} from "./svg";

// ─── 4.1 Verknüpfte Funktionen ─────────────────────────────────────────────

/** The inner function g(x) = x² + a·x + b of the lab. */
export const chainG = (v: LabValues): number => v.x * v.x + v.a * v.x + v.b;
/** The inner derivative g′(x) = 2x + a. */
export const chainInner = (v: LabValues): number => 2 * v.x + v.a;
/** The outer derivative f′(g(x)) = 2·g(x) for f(u) = u². */
export const chainOuter = (v: LabValues): number => 2 * chainG(v);
/** The composed function h(x) = f(g(x)) = g(x)². */
export const chainH = (v: LabValues): number => chainG(v) ** 2;
/** The chain rule: h′(x) = f′(g(x)) · g′(x). */
export const chainHPrime = (v: LabValues): number =>
  chainOuter(v) * chainInner(v);

const verkettetPlot = () => new Plot(-4.5, 4.5, -25, 25);

function verkettet(v: LabValues): string {
  const plot = verkettetPlot();
  const g = chainG(v);
  const h = g * g;
  const inner = chainInner(v);
  const outer = chainOuter(v);
  const hp = outer * inner;
  const gfun = (x: number) => x * x + v.a * x + v.b;
  const hfun = (x: number) => gfun(x) ** 2;
  let out = open(
    "Graph einer verketteten Funktion mit Tangente an der gewählten Stelle",
  );
  out += plot.clip("clip-verkettet") + plot.grid(2, 2);
  out += clipped(
    "clip-verkettet",
    plot.graph(gfun, "lab-ghost") +
      plot.graph(hfun, "lab-curve") +
      plot.lineThrough(hp, h - hp * v.x, "lab-curve-2"),
  );
  const px = plot.X(v.x);
  const py = clamp(plot.Y(h), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  out += line(px, plot.box.y, px, plot.box.y + plot.box.h, "lab-dashed");
  out += circle(px, py, 5, "lab-point-ok");
  out += text(px + 10, py - 8, `x = ${fmt(v.x)}`, "lab-text-small");
  const lines: Array<[string, string]> = [
    [`g(x) = ${sum([[1, "x²"], [v.a, "x"], [v.b, ""]])}`, "lab-text"],
    [`h(x) = f(g(x)) = ${fmt(h)}`, "lab-text lab-text-big"],
    [
      `f′(g(x)) = ${fmt(outer)}, g′(x) = ${fmt(inner)}`,
      "lab-text-muted",
    ],
    [`h′(x) = f′(g(x)) · g′(x) = ${fmt(hp)}`, "lab-text lab-text-ok"],
  ];
  out += infoBox(plot.box.x + 14, plot.box.y + 22, lines);
  out += handle("stelle", px, py, "Stelle x auf dem Graphen");
  out += "</svg>";
  return out;
}

// ─── 4.2 Parameter bestimmen ──────────────────────────────────────────────

/** f(x) = a·x³ + b·x of the lab. */
export const paramF = (v: LabValues, x: number): number =>
  v.a * x ** 3 + v.b * x;
/** f′(x) = 3a·x² + b. */
export const paramDf = (v: LabValues, x: number): number =>
  3 * v.a * x * x + v.b;

const parameterPlot = () => new Plot(-3.5, 3.5, -12, 12);

function parameter(v: LabValues): string {
  const plot = parameterPlot();
  const f = (x: number) => paramF(v, x);
  const f1 = f(1);
  const fm1 = f(-1);
  const m = paramDf(v, 1);
  let out = open(
    "Eine kubische Funktion mit Tangente an der Stelle x = 1 und ziehbaren Parametern",
  );
  out += plot.clip("clip-parameter") + plot.grid(1, 2);
  out += clipped(
    "clip-parameter",
    line(plot.X(-3.5), plot.Y(2), plot.X(3.5), plot.Y(2), "lab-dashed") +
      plot.graph(f, "lab-curve") +
      plot.lineThrough(m, f1 - m, "lab-curve-2"),
  );
  const px = plot.X(1);
  const py = clamp(plot.Y(f1), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  const qx = plot.X(-1);
  const qy = clamp(plot.Y(fm1), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  out += circle(px, py, 5, "lab-point-ok");
  out += text(px + 9, py - 8, `P(1 | ${fmt(f1)})`, "lab-text-small");
  out += circle(qx, qy, 5, "lab-point-a");
  out += text(qx + 9, qy + 16, `Q(−1 | ${fmt(fm1)})`, "lab-text-small");
  const ziel =
    v.bedingung === 0
      ? `Ziel: f(1) = 2`
      : v.bedingung === 1
        ? "Ziel: f′(1) = 0"
        : "Ziel: f(1) = 2 und f′(1) = 0";
  const lines: Array<[string, string]> = [
    [`f(x) = ${sum([[v.a, "x³"], [v.b, "x"]])}`, "lab-text lab-text-big"],
    [`f′(x) = ${quadratic(3 * v.a, v.b, 0)}`, "lab-text"],
    [`f(1) = ${fmt(f1)}, f′(1) = ${fmt(m)}`, "lab-text-muted"],
    [ziel, "lab-text lab-text-c"],
  ];
  out += infoBox(plot.box.x + 14, plot.box.y + 22, lines);
  out += handle("P", px, py, "Punkt P: b ändern", "lab-handle lab-handle-a");
  out += handle("Q", qx, qy, "Punkt Q: a ändern", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 4.3 Extremwertprobleme ───────────────────────────────────────────────

export interface ExtremPunkt {
  x: number;
  y: number;
  art: "rand" | "inner";
}

export interface ExtremAnalyse {
  /** All roots of f′, sorted. */
  roots: number[];
  /** Candidates: the interval borders and the roots of f′ inside. */
  punkte: ExtremPunkt[];
  gmax: number;
  gmin: number;
  argmax: number;
  argmin: number;
}

/**
 * The candidates of f(x) = a·x³ + b·x² + c·x on [l; r]: the roots of
 * f′(x) = 3a·x² + 2b·x + c inside the interval and both borders. For
 * a = b = 0 the derivative is constant and has no isolated roots.
 */
export function extremAnalyse(v: LabValues): ExtremAnalyse {
  const f = (x: number) => v.a * x ** 3 + v.b * x * x + v.c * x;
  const A = 3 * v.a;
  const B = 2 * v.b;
  const C = v.c;
  const roots: number[] = [];
  if (A === 0) {
    if (B !== 0) roots.push(-C / B);
  } else {
    const D = B * B - 4 * A * C;
    if (D > 1e-9) {
      const s = Math.sqrt(D);
      roots.push((-B - s) / (2 * A), (-B + s) / (2 * A));
    } else if (D >= -1e-9) {
      roots.push(-B / (2 * A));
    }
  }
  roots.sort((p, q) => p - q);
  const inner = roots.filter((x) => x > v.l + 1e-9 && x < v.r - 1e-9);
  const punkte: ExtremPunkt[] = [
    { x: v.l, y: f(v.l), art: "rand" },
    ...inner.map((x) => ({ x, y: f(x), art: "inner" as const })),
    { x: v.r, y: f(v.r), art: "rand" },
  ];
  let gmax = punkte[0];
  let gmin = punkte[0];
  for (const p of punkte) {
    if (p.y > gmax.y) gmax = p;
    if (p.y < gmin.y) gmin = p;
  }
  return { roots, punkte, gmax: gmax.y, gmin: gmin.y, argmax: gmax.x, argmin: gmin.x };
}

const SUB = ["₁", "₂"];

const extremPlot = () => new Plot(-4.5, 4.5, -20, 20);

function extremwert(v: LabValues): string {
  const plot = extremPlot();
  const analyse = extremAnalyse(v);
  const f = (x: number) => v.a * x ** 3 + v.b * x * x + v.c * x;
  let out = open(
    "Eine kubische Funktion auf einem Intervall mit den Kandidaten für ihre Extremwerte",
  );
  out += rect(
    plot.X(v.l),
    plot.box.y,
    plot.X(v.r) - plot.X(v.l),
    plot.box.h,
    "lab-fill-a",
  );
  out += plot.clip("clip-extrem") + plot.grid(1, 2);
  out += clipped("clip-extrem", plot.graph(f, "lab-curve"));
  for (const p of analyse.punkte) {
    const cx = plot.X(p.x);
    const cy = clamp(plot.Y(p.y), plot.box.y + 6, plot.box.y + plot.box.h - 6);
    out += circle(cx, cy, 5, p.art === "inner" ? "lab-point-ok" : "lab-point-a");
    out += text(
      cx + 8,
      cy + (p.art === "inner" ? -8 : 16),
      `f(${fmt(p.x)}) = ${fmt(p.y)}`,
      "lab-text-small",
    );
  }
  const lines: Array<[string, string]> = [
    [`f(x) = ${sum([[v.a, "x³"], [v.b, "x²"], [v.c, "x"]])}`, "lab-text lab-text-big"],
    [`f′(x) = ${quadratic(3 * v.a, 2 * v.b, v.c)}`, "lab-text"],
    [
      analyse.roots.length === 0
        ? "f′ hat keine Nullstelle"
        : `f′ = 0 bei ${analyse.roots.map((x, i) => `x${SUB[i] ?? ""} = ${fmt(x)}`).join(" und ")}`,
      "lab-text-muted",
    ],
    [
      `Maximum ${fmt(analyse.gmax)} bei x = ${fmt(analyse.argmax)}, Minimum ${fmt(analyse.gmin)} bei x = ${fmt(analyse.argmin)}`,
      "lab-text lab-text-ok",
    ],
  ];
  out += infoBox(plot.box.x + 14, plot.box.y + 22, lines);
  const lx = plot.X(v.l);
  const rx = plot.X(v.r);
  const ly = clamp(plot.Y(f(v.l)), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  const ry = clamp(plot.Y(f(v.r)), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  out += handle("links", lx, ly, "linke Intervallgrenze", "lab-handle lab-handle-a");
  out += handle("rechts", rx, ry, "rechte Intervallgrenze", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 4.4 Extremwerte in Sachzusammenhängen ────────────────────────────────

/** The x the lab opens with; every goal compares against the value there. */
export const SACH_START_X = 2;

export interface SachWerte {
  kontextName: string;
  /** The objective at the current x. */
  F: number;
  /** The objective at the optimum and at the start x. */
  Fopt: number;
  Fstart: number;
  xOpt: number;
  /** The constrained side: length, height or depth. */
  y: number;
  yName: string;
  yGrenze: number;
  /** "min": y must stay at least yGrenze; "max": at most. */
  yRichtung: "min" | "max";
  erfuellt: boolean;
  minimieren: boolean;
  einheitX: string;
  einheitF: string;
  formel: string;
}

/**
 * The four modelling contexts of the lab: two area problems to maximise, a
 * canister surface and a channel perimeter to minimise. Each has one
 * constrained side the learner can violate.
 */
export function sachWerte(v: LabValues): SachWerte {
  const x = v.x;
  const start = SACH_START_X;
  if (v.kontext === 1) {
    const V = v.V;
    return {
      kontextName: "Kanister mit quadratischer Grundfläche",
      F: 2 * x * x + (4 * V) / x,
      Fopt: 2 * Math.cbrt(V) ** 2 + (4 * V) / Math.cbrt(V),
      Fstart: 2 * start * start + (4 * V) / start,
      xOpt: Math.cbrt(V),
      y: V / (x * x),
      yName: "Bauhöhe h = V : x²",
      yGrenze: 50,
      yRichtung: "max",
      erfuellt: V / (x * x) <= 50 + 1e-9,
      minimieren: true,
      einheitX: "cm",
      einheitF: "cm²",
      formel: `O(x) = 2x² + 4 · ${fmt(V)} : x`,
    };
  }
  if (v.kontext === 2) {
    const A = v.A;
    return {
      kontextName: "offener Kanal mit rechteckigem Querschnitt",
      F: x + (2 * A) / x,
      Fopt: Math.sqrt(2 * A) + (2 * A) / Math.sqrt(2 * A),
      Fstart: start + (2 * A) / start,
      xOpt: Math.sqrt(2 * A),
      y: A / x,
      yName: "Wassertiefe y = A : x",
      yGrenze: 2,
      yRichtung: "max",
      erfuellt: A / x <= 2 + 1e-9,
      minimieren: true,
      einheitX: "m",
      einheitF: "m",
      formel: `U(x) = x + 2 · ${fmt(A)} : x`,
    };
  }
  const k = v.kontext === 3 ? 4 : 2;
  const P = v.P;
  return {
    kontextName:
      k === 4
        ? "Lagerfläche mit zwei Trennwänden"
        : "Gehege an einer Mauer",
    F: x * (P - k * x),
    Fopt: (P / (2 * k)) * (P - k * (P / (2 * k))),
    Fstart: start * (P - k * start),
    xOpt: P / (2 * k),
    y: P - k * x,
    yName: k === 4 ? "Länge y parallel zur Wand" : "Länge y parallel zur Mauer",
    yGrenze: k === 4 ? 8 : 6,
    yRichtung: "min",
    erfuellt: P - k * x >= (k === 4 ? 8 : 6) - 1e-9,
    minimieren: false,
    einheitX: "m",
    einheitF: "m²",
    formel: `A(x) = x · (${fmt(P)} − ${k === 4 ? "4" : "2"}x)`,
  };
}

const SACH_BOX = { x0: 40, y0: 92 };

/** Pixels per unit of the sketch: both sides and their labels fit the box. */
function sachScale(v: LabValues): number {
  const w = sachWerte(v);
  return Math.max(
    0.4,
    Math.min(150 / Math.max(0.5, Math.abs(w.y)), 150 / Math.max(0.5, v.x), 12),
  );
}

function sachextremum(v: LabValues): string {
  const w = sachWerte(v);
  const scale = sachScale(v);
  let out = open(
    "Ein Sachmodell mit Nebenbedingung: Rechteck, Kanister oder Kanal und die Zielfunktion als Balken",
  );
  out += text(260, 24, w.kontextName, "lab-text lab-text-big", "middle");
  out += text(260, 44, `${w.formel}, x in ${w.einheitX}`, "lab-text", "middle");
  const { x0, y0 } = SACH_BOX;
  if (w.y > 0) {
    const bw = w.y * scale;
    const bh = v.x * scale;
    out += rect(x0, y0, bw, bh, w.erfuellt ? "lab-fill-ok" : "lab-fill-c");
    out += rect(x0, y0, bw, bh, "lab-shape");
    if (v.kontext === 0 || v.kontext === 3) {
      out += rect(x0 - 6, y0 - 12, bw + 12, 10, "lab-shape-2");
      out += text(x0 + bw / 2, y0 - 17, v.kontext === 3 ? "Wand" : "Mauer", "lab-text-small", "middle");
      if (v.kontext === 3) {
        out += line(x0 + bw / 3, y0, x0 + bw / 3, y0 + bh, "lab-fence");
        out += line(x0 + (2 * bw) / 3, y0, x0 + (2 * bw) / 3, y0 + bh, "lab-fence");
      }
    }
    out += text(x0 + bw / 2, y0 + bh + 18, `y = ${fmt(w.y)} ${w.einheitX}`, "lab-text", "middle");
    out += text(x0 + bw + 10, y0 + bh / 2 + 4, `x = ${fmt(v.x)} ${w.einheitX}`, "lab-text");
  } else {
    out += text(
      x0,
      y0 + 30,
      `Modell verletzt: y = ${fmt(w.y)} ${w.einheitX} ist keine Länge.`,
      "lab-text lab-text-bad",
    );
    out += text(x0, y0 + 50, "So kann es nicht gebaut werden.", "lab-text lab-text-bad");
  }
  // The objective compared with the optimum and the start value.
  const bx = 300;
  const by = 110;
  const scaleF = 170 / Math.max(1, Math.abs(w.F), Math.abs(w.Fopt), Math.abs(w.Fstart));
  const bars: Array<[string, number, string]> = [
    ["jetzt", w.F, "lab-bar-a"],
    ["Optimum", w.Fopt, "lab-bar-ok"],
    ["Start", w.Fstart, "lab-bar-ghost"],
  ];
  bars.forEach(([label, value, cls], i) => {
    const y = by + i * 54;
    out += text(bx, y - 8, `${label}: ${fmt(value)} ${w.einheitF}`, "lab-text-small");
    out += rect(bx, y, Math.max(0, value) * scaleF, 18, cls);
    if (value < 0) out += text(bx + 6, y + 14, "negativ", "lab-text-small");
  });
  out += text(
    512,
    by + 3 * 54 + 4,
    w.erfuellt
      ? `Nebenbedingung erfüllt: ${w.yRichtung === "min" ? "mindestens" : "höchstens"} ${fmt(w.yGrenze)} ${w.einheitX}`
      : `Nebenbedingung verletzt: ${w.yRichtung === "min" ? "mindestens" : "höchstens"} ${fmt(w.yGrenze)} ${w.einheitX}`,
    w.erfuellt ? "lab-text lab-text-ok" : "lab-text lab-text-bad",
    "end",
  );
  if (w.y > 0) {
    out += handle(
      "ecke",
      x0 + w.y * scale,
      y0 + v.x * scale,
      "Ecke des Rechtecks: x ändern",
    );
  }
  out += "</svg>";
  return out;
}

// ─── 4.5 Analysis in Beruf und Forschung ──────────────────────────────────

export interface RateWerte {
  /** The total amount: the signed area under r(t) from 0 to T. */
  G: number;
  /** The rate at the start and the end of the period. */
  r0: number;
  rT: number;
}

/** r(t) = a·t + b on [0; T]: the integral is the trapezoid (r0 + rT) : 2 · T. */
export function rateWerte(v: LabValues): RateWerte {
  const r0 = v.b;
  const rT = v.a * v.T + v.b;
  return { G: (r0 + rT) / 2 * v.T, r0, rT };
}

const ratePlot = () => new Plot(-0.5, 10.5, -15, 25);

function anwendung(v: LabValues): string {
  const plot = ratePlot();
  const w = rateWerte(v);
  let out = open(
    "Eine lineare Rate über einen Zeitraum und die Gesamtmenge als Fläche unter dem Graphen",
  );
  out += plot.clip("clip-rate") + plot.grid(1, 2);
  const flaeche = [
    plot.P(0, 0),
    plot.P(v.T, 0),
    plot.P(v.T, w.rT),
    plot.P(0, w.r0),
  ];
  out += clipped(
    "clip-rate",
    polygon(flaeche, "lab-fill-ok") +
      line(plot.X(0), plot.Y(w.r0), plot.X(v.T), plot.Y(w.rT), "lab-curve"),
  );
  const sx = plot.X(0);
  const ex = plot.X(v.T);
  const sy = clamp(plot.Y(w.r0), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  const ey = clamp(plot.Y(w.rT), plot.box.y + 8, plot.box.y + plot.box.h - 8);
  out += circle(sx, sy, 5, "lab-point-a");
  out += circle(ex, ey, 5, "lab-point-ok");
  out += text(sx + 9, sy - 8, `r(0) = ${fmt(w.r0)}`, "lab-text-small");
  out += text(ex - 9, ey - 8, `r(${fmt(v.T)}) = ${fmt(w.rT)}`, "lab-text-small", "end");
  const lines: Array<[string, string]> = [
    [`r(t) = ${sum([[v.a, "t"], [v.b, ""]])}`, "lab-text lab-text-big"],
    [
      `G = (r(0) + r(${fmt(v.T)})) : 2 · ${fmt(v.T)} = ${fmt(w.G)}`,
      "lab-text lab-text-ok",
    ],
    [
      w.rT < w.r0
        ? "Die Rate fällt über den Zeitraum."
        : w.rT > w.r0
          ? "Die Rate steigt über den Zeitraum."
          : "Die Rate ist konstant.",
      "lab-text-muted",
    ],
  ];
  out += infoBox(plot.box.x + 14, plot.box.y + 22, lines);
  out += handle("start", sx, sy, "Anfangsrate r(0)", "lab-handle lab-handle-a");
  out += handle("ende", ex, ey, "Ende des Zeitraums", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

export const ANWENDUNGEN_VIEWS: Record<string, LabView> = {
  verkettet: {
    render: verkettet,
    handles: {
      stelle: {
        x: "x",
        drag: (p) => ({ x: verkettetPlot().invX(p.x) }),
      },
    },
  },
  parameter: {
    render: parameter,
    handles: {
      P: {
        y: "b",
        drag: (p, values) => ({ b: parameterPlot().invY(p.y) - values.a }),
      },
      Q: {
        y: "a",
        drag: (p, values) => ({ a: -parameterPlot().invY(p.y) - values.b }),
      },
    },
  },
  extremwert: {
    render: extremwert,
    handles: {
      links: {
        x: "l",
        drag: (p) => ({ l: extremPlot().invX(p.x) }),
      },
      rechts: {
        x: "r",
        drag: (p) => ({ r: extremPlot().invX(p.x) }),
      },
    },
  },
  sachextremum: {
    render: sachextremum,
    handles: {
      ecke: {
        x: "x",
        drag: (p, values) => ({
          x: (p.y - SACH_BOX.y0) / sachScale(values),
        }),
      },
    },
  },
  anwendung: {
    render: anwendung,
    handles: {
      start: {
        y: "b",
        drag: (p) => ({ b: ratePlot().invY(p.y) }),
      },
      ende: {
        x: "T",
        drag: (p) => ({ T: ratePlot().invX(p.x) }),
      },
    },
  },
};
