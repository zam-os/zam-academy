import { fmt } from "../exercises/format";
import { createRng } from "../exercises/rng";
import type { LabValues, ReadoutValues } from "../model/types";
import {
  circle,
  handle,
  line,
  open,
  Plot,
  polygon,
  rect,
  text,
  type HandleSpec,
  type LabView,
  type Pt,
} from "./svg";
import { title } from "./view-helpers";

// ─── Mathematik der Normalverteilung ───────────────────────────────────────

/**
 * Die Fehlerfunktion erf(x) = 2/√π · ∫₀ˣ e^(−t²) dt nach Abramowitz/Stegun
 * 7.1.26 (Fehler unter 1,5 · 10⁻⁷). Daraus Φ(z) = ½(1 + erf(z/√2)).
 */
export function erf(x: number): number {
  if (x === 0) return 0;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
    t;
  const y = 1 - poly * Math.exp(-a * a);
  return x < 0 ? -y : y;
}

/** Φ(z) = P(Z ≤ z) der Standardnormalverteilung N(0; 1). */
export function Phi(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Dichtefunktion der Normalverteilung N(μ; σ). */
export function normalPdf(x: number, mu: number, sigma: number): number {
  return (
    Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) /
    (sigma * Math.sqrt(2 * Math.PI))
  );
}

/** Die Standardisierung z = (x − μ)/σ. */
export const standardize = (x: number, mu: number, sigma: number): number =>
  (x - mu) / sigma;

/** P(a < X ≤ b) für X ~ N(μ; σ), intern über Φ, immer in [0; 1]. */
export function normalIntervalP(
  a: number,
  b: number,
  mu: number,
  sigma: number,
): number {
  if (!(b > a)) return 0;
  const p = Phi(standardize(b, mu, sigma)) - Phi(standardize(a, mu, sigma));
  return Math.min(1, Math.max(0, p));
}

// ─── Labor „zufallsgroesse“: diskretes Histogramm und stetige Dichte ───────

/** Der Anteil des Intervalls [lo | hi] an [a | b]: die Länge der Überlappung. */
export function overlap(lo: number, hi: number, a: number, b: number): number {
  return Math.max(0, Math.min(hi, b) - Math.max(lo, a));
}

/** Die Balkenhöhen des Histogramms der Werte 1 bis 4. */
export function balken(v: LabValues): number[] {
  return [v.h1, v.h2, v.h3, v.h4];
}

/** F(x) = P(X ≤ x) des Histogramms: die Summe der Balken bis x (höchstens 1). */
export function diskretF(v: LabValues, x: number): number {
  let sum = 0;
  balken(v).forEach((h, index) => {
    if (index + 1 <= x + 1e-9) sum += h;
  });
  return Math.min(1, Math.max(0, sum));
}

/**
 * P(lo < X ≤ hi) des Histogramms: die Summe der Balken im Intervall. Erst
 * bei der Summe 1 ist das eine Wahrscheinlichkeit; begrenzt bleibt das
 * Ergebnis in jedem Fall in [0 | 1].
 */
export function diskretP(v: LabValues): number {
  let sum = 0;
  balken(v).forEach((h, index) => {
    if (index + 1 > v.lo + 1e-9 && index + 1 <= v.hi + 1e-9) sum += h;
  });
  return Math.min(1, Math.max(0, sum));
}

/** Die konstante Dichte ist von a0 bis a0 + b0 gleich hh und sonst 0. */
export function stetigF(v: LabValues, x: number): number {
  return Math.min(
    1,
    Math.max(0, v.hh * Math.min(v.b0, Math.max(0, x - v.a0))),
  );
}

/** P(lo < X ≤ hi) der konstanten Dichte: Fläche = Höhe · Überlappung, begrenzt auf [0 | 1]. */
export function stetigP(v: LabValues): number {
  return Math.min(
    1,
    Math.max(0, v.hh * overlap(v.lo, v.hi, v.a0, v.a0 + v.b0)),
  );
}

// ─── Labor „glockenkurve“: eine Messreihe simulieren ───────────────────────

/**
 * Die Messreihe zum gespeicherten seed: n normalverteilte Werte zu μ und σ
 * (Box-Muller). Dieselbe Reihe gehört zu denselben Reglerwerten, solange
 * niemand „neue Messreihe ziehen“ drückt.
 */
export function messreihe(v: LabValues): number[] {
  const rng = createRng(v.seed);
  const out: number[] = [];
  for (let i = 0; i < v.n; i++) {
    const u1 = 1 - rng.next(); // in (0 | 1], damit log(u1) endlich bleibt
    const u2 = rng.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    out.push(v.mu + v.sigma * z);
  }
  return out;
}

/** Der Mittelwert einer Messreihe. */
export function sampleMean(xs: number[]): number {
  return xs.reduce((sum, x) => sum + x, 0) / xs.length;
}

/** Die Standardabweichung s = √(Σ(xᵢ − x̄)²/(n − 1)) einer Messreihe. */
export function sampleStd(xs: number[]): number {
  const mean = sampleMean(xs);
  const variance =
    xs.reduce((sum, x) => sum + (x - mean) ** 2, 0) / Math.max(1, xs.length - 1);
  return Math.sqrt(variance);
}

/** Der Anteil der Messwerte im Intervall μ ± σ. */
export function anteilImBand(v: LabValues): number {
  const xs = messreihe(v);
  const inside = xs.filter((x) => Math.abs(x - v.mu) <= v.sigma + 1e-9).length;
  return inside / xs.length;
}

/** Der Knopf „neue Messreihe ziehen“: der seed wandert weiter, die Zählung mit. */
export function neueMessreihe(v: LabValues): LabValues {
  return {
    ...v,
    seed: (Math.imul(v.seed >>> 0, 1664525) + 1013904223) >>> 0,
    ziehungen: v.ziehungen + 1,
  };
}

/** Der Knopf „Messreihe zurücksetzen“: wieder dieselbe Startreihe. */
export function messreiheZurueck(v: LabValues): LabValues {
  return { ...v, seed: 20261108, ziehungen: 0 };
}

// ─── Zeichnen: Histogramm oder Dichte ──────────────────────────────────────

const ZPLOT = new Plot(0, 8, 0, 1.25, { x: 58, y: 44, w: 408, h: 224 });
const ZHANDLES: Record<string, HandleSpec> = {
  xstelle: {
    x: "xstelle",
    drag: (p) => ({ xstelle: ZPLOT.invX(p.x) }),
  },
};

function zufallsgroesseView(v: LabValues, r: ReadoutValues): string {
  const stetig = v.art === 1;
  let out = open(
    "Histogramm einer diskreten oder Dichte einer stetigen Zufallsgröße mit markiertem Intervall",
  );
  out += title(
    stetig
      ? "Stetige Zufallsgröße: Wahrscheinlichkeit ist Fläche"
      : "Diskrete Zufallsgröße: Wahrscheinlichkeit sind Balkenhöhen",
  );
  out += ZPLOT.grid(0.25, 1, "x", "P");
  if (stetig) {
    const x0 = ZPLOT.X(v.a0);
    const x1 = ZPLOT.X(v.a0 + v.b0);
    const yTop = ZPLOT.Y(v.hh);
    out += rect(x0, yTop, x1 - x0, ZPLOT.Y(0) - yTop, "lab-fill-a");
    const lo = Math.max(v.lo, v.a0);
    const hi = Math.min(v.hi, v.a0 + v.b0);
    if (hi > lo) {
      out += rect(
        ZPLOT.X(lo),
        yTop,
        ZPLOT.X(hi) - ZPLOT.X(lo),
        ZPLOT.Y(0) - yTop,
        "lab-fill-c",
      );
    }
    out += line(x0, yTop, x1, yTop, "lab-curve");
    out += text(x1 + 4, yTop - 4, `h = ${fmt(v.hh)}`, "lab-text-small");
    out += text(
      (x0 + x1) / 2,
      ZPLOT.Y(0) + 30,
      `Dichte von ${fmt(v.a0)} bis ${fmt(v.a0 + v.b0)}`,
      "lab-text-small",
      "middle",
    );
    out += text(
      62,
      62,
      `P(X = x) = 0 – nur Intervalle haben Fläche`,
      "lab-text-small lab-text-c",
    );
  } else {
    balken(v).forEach((h, index) => {
      const i = index + 1;
      const left = ZPLOT.X(i - 0.3);
      const right = ZPLOT.X(i + 0.3);
      const top = ZPLOT.Y(h);
      const inside = i > v.lo + 1e-9 && i <= v.hi + 1e-9;
      out += rect(left, top, right - left, ZPLOT.Y(0) - top, inside ? "lab-fill-c" : "lab-fill-a");
      out += text((left + right) / 2, top - 5, fmt(h), "lab-text-small", "middle");
      out += text(ZPLOT.X(i), ZPLOT.Y(0) + 16, String(i), "lab-text-tick", "middle");
    });
  }
  // Intervallgrenzen und die Stelle x, an der F(x) abgelesen wird
  for (const [grenze, label] of [
    [v.lo, "a"],
    [v.hi, "b"],
  ] as const) {
    out += line(ZPLOT.X(grenze), ZPLOT.Y(0), ZPLOT.X(grenze), ZPLOT.box.y + 4, "lab-dashed");
    out += text(ZPLOT.X(grenze), ZPLOT.box.y + 2, label, "lab-text-tick", "middle");
  }
  out += line(ZPLOT.X(v.xstelle), ZPLOT.Y(0), ZPLOT.X(v.xstelle), ZPLOT.box.y + 4, "lab-side-c");
  out += text(ZPLOT.X(v.xstelle), ZPLOT.box.y + 16, `x = ${fmt(v.xstelle)}`, "lab-text-small lab-text-c", "middle");
  out += handle("xstelle", ZPLOT.X(v.xstelle), ZPLOT.Y(0), `Stelle x = ${fmt(v.xstelle)}`);
  out += text(
    62,
    300,
    `Summe der Balken bzw. Fläche der Dichte: ${fmt(r.summe as number)}`,
    "lab-text-small",
  );
  out += text(
    62,
    316,
    `F(${fmt(v.xstelle)}) = ${fmt(r.F as number)}   ·   P(${fmt(v.lo)} < X ≤ ${fmt(v.hi)}) = ${fmt(r.Pint as number)}`,
    "lab-text-small",
  );
  out += `</svg>`;
  return out;
}

// ─── Zeichnen: die simulierte Messreihe ────────────────────────────────────

const FRAME = { x0: 52, x1: 488, y0: 262, y1: 84, bins: 12 };

function glockenkurveView(v: LabValues): string {
  const xs = messreihe(v);
  const lo = v.mu - 4 * v.sigma;
  const width = 8 * v.sigma; // σ ≥ 1, also nie 0
  const counts = new Array<number>(FRAME.bins).fill(0);
  for (const x of xs) {
    const k = Math.floor(((x - lo) / width) * FRAME.bins);
    counts[Math.min(FRAME.bins - 1, Math.max(0, k))] += 1;
  }
  const maxCount = Math.max(1, ...counts);
  const px = (x: number) => FRAME.x0 + ((x - lo) / width) * (FRAME.x1 - FRAME.x0);
  const py = (c: number) => FRAME.y0 - (c / maxCount) * (FRAME.y0 - FRAME.y1);
  const mean = sampleMean(xs);
  const std = sampleStd(xs);
  const anteil = anteilImBand(v);
  let out = open(
    "Histogramm einer simulierten Messreihe mit der Glockenkurve und dem Intervall μ ± σ",
  );
  out += text(
    14,
    26,
    `${v.n} Messwerte zu μ = ${fmt(v.mu)} und σ = ${fmt(v.sigma)}`,
    "lab-text lab-text-big",
  );
  out += text(
    14,
    44,
    `x̄ = ${fmt(mean, 2)}   ·   s = ${fmt(std, 2)}   ·   Anteil in μ ± σ: ${fmt(anteil * 100, 1)} %`,
    "lab-text-small",
  );
  out += text(
    14,
    61,
    `Gezogene Messreihen: ${v.ziehungen} – die Regler starten jede Zählung neu`,
    "lab-text-small lab-text-muted",
  );
  // Das Intervall μ ± σ als Band hinter den Säulen
  out += rect(
    px(v.mu - v.sigma),
    FRAME.y1 - 12,
    px(v.mu + v.sigma) - px(v.mu - v.sigma),
    FRAME.y0 - FRAME.y1 + 12,
    "lab-fill-c",
  );
  out += text(px(v.mu), FRAME.y1 - 18, "μ ± σ", "lab-text-small lab-text-c", "middle");
  // Die Säulen des Histogramms
  const barW = (FRAME.x1 - FRAME.x0) / FRAME.bins;
  counts.forEach((count, index) => {
    const x = FRAME.x0 + index * barW;
    out += rect(x + 1, py(count), barW - 2, FRAME.y0 - py(count), "lab-bar-a");
    if (count > 0) {
      out += text(x + barW / 2, py(count) - 4, String(count), "lab-text-tick", "middle");
    }
  });
  // Achse, μ und die Marken μ ± σ
  out += line(FRAME.x0, FRAME.y0, FRAME.x1, FRAME.y0, "lab-ink");
  for (const [mark, label] of [
    [v.mu - v.sigma, "μ − σ"],
    [v.mu, "μ"],
    [v.mu + v.sigma, "μ + σ"],
  ] as const) {
    out += line(px(mark), FRAME.y0, px(mark), FRAME.y0 + 8, "lab-ink");
    out += text(px(mark), FRAME.y0 + 22, label, "lab-text-tick", "middle");
    out += text(px(mark), FRAME.y0 + 36, fmt(mark), "lab-text-tick", "middle");
  }
  out += text(
    FRAME.x0,
    FRAME.y0 + 52,
    `Messwerte von ${fmt(lo)} bis ${fmt(lo + width)} – Werte außerhalb liegen in den Randspalten`,
    "lab-text-small",
  );
  out += `</svg>`;
  return out;
}

// ─── Zeichnen: Dichte f und Verteilungsfunktion F ──────────────────────────

/** Der x-Bereich der beiden Graphen, immer um x und μ ± 4σ herum. */
function nfPlots(v: LabValues): { d: Plot; F: Plot } {
  const xmin = Math.min(v.mu - 4 * v.sigma, v.x) - v.sigma;
  const xmax = Math.max(v.mu + 4 * v.sigma, v.x) + v.sigma;
  const fmax = normalPdf(v.mu, v.mu, v.sigma); // σ ≥ 0,5, also > 0
  return {
    d: new Plot(xmin, xmax, 0, 1.2 * fmax, { x: 20, y: 44, w: 232, h: 218 }),
    F: new Plot(xmin, xmax, 0, 1, { x: 300, y: 44, w: 200, h: 218 }),
  };
}

const NF_HANDLES: Record<string, HandleSpec> = {
  x: {
    x: "x",
    drag: (p, values) => ({ x: nfPlots(values).d.invX(p.x) }),
  },
};

function normalverteilungView(v: LabValues, r: ReadoutValues): string {
  const { d, F } = nfPlots(v);
  const fx = normalPdf(v.x, v.mu, v.sigma);
  const Fx = Phi(standardize(v.x, v.mu, v.sigma));
  let out = open(
    "Links die Dichtefunktion f der Normalverteilung, rechts die Verteilungsfunktion F",
  );
  out += title("Glocke und S-Kurve: f und F gehören zusammen");
  // Dichte f
  out += d.grid(2, 4, "x", "f(x)");
  const area: Pt[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const x = d.xmin + ((v.x - d.xmin) * i) / steps;
    area.push(d.P(x, normalPdf(x, v.mu, v.sigma)));
  }
  area.push(d.P(v.x, 0));
  area.push(d.P(d.xmin, 0));
  out += polygon(area, "lab-fill-c");
  out += d.graph((x) => normalPdf(x, v.mu, v.sigma), "lab-curve");
  for (const wend of [v.mu - v.sigma, v.mu + v.sigma]) {
    out += circle(d.X(wend), d.Y(normalPdf(wend, v.mu, v.sigma)), 3.5, "lab-dot-small");
  }
  if (v.sigma >= 0.75) {
    out += text(d.X(v.mu - v.sigma) - 6, d.Y(normalPdf(v.mu - v.sigma, v.mu, v.sigma)) - 10, "Wendepunkt", "lab-text-tick", "end");
    out += text(d.X(v.mu + v.sigma) + 6, d.Y(normalPdf(v.mu + v.sigma, v.mu, v.sigma)) - 10, "Wendepunkt", "lab-text-tick", "start");
  }
  out += handle("x", d.X(v.x), d.Y(fx), `Stelle x = ${fmt(v.x)}`);
  out += text(d.box.x + 4, d.box.y - 6, "Dichte f", "lab-text lab-text-c");
  out += text(
    d.box.x + 4,
    d.box.y + 16,
    `f(${fmt(v.x)}) = ${fmt(fx, 4)}`,
    "lab-text-small",
  );
  // Verteilungsfunktion F
  out += F.grid(2, 4, "x", "F(x)");
  out += F.graph((x) => Phi(standardize(x, v.mu, v.sigma)), "lab-curve-2");
  out += F.lineThrough(0, 0.5, "lab-dashed");
  out += text(F.box.x + F.box.w - 4, F.Y(0.5) - 5, "F(μ) = 0,5", "lab-text-tick", "end");
  out += line(F.X(v.x), F.Y(0), F.X(v.x), F.Y(Fx), "lab-side-c");
  out += line(F.box.x, F.Y(Fx), F.X(v.x), F.Y(Fx), "lab-side-c");
  out += circle(F.X(v.x), F.Y(Fx), 4, "lab-point-a");
  out += text(F.box.x + 4, F.box.y - 6, "Verteilungsfunktion F", "lab-text lab-text-b");
  out += text(
    F.box.x + 4,
    F.box.y + 16,
    `F(${fmt(v.x)}) = ${fmt(Fx, 4)}`,
    "lab-text-small",
  );
  out += text(
    20,
    300,
    `μ = ${r.erwartungswert}   ·   σ = ${r.streuung}   ·   Wendepunkte bei ${r.wendepunkte}`,
    "lab-text-small",
  );
  out += text(
    20,
    318,
    `Schattierte Fläche links von x: F(x) = ${fmt(Fx, 4)} – die Fläche unter f insgesamt ist 1`,
    "lab-text-small",
  );
  out += `</svg>`;
  return out;
}

// ─── Zeichnen: das Intervall einer Sigma-Aufgabe ───────────────────────────

function sigmaRegelnView(v: LabValues, r: ReadoutValues): string {
  const lo = Math.min(v.a, v.b);
  const hi = Math.max(v.a, v.b);
  const xmin = Math.min(v.mu - 4 * v.sigma, lo) - 1;
  const xmax = Math.max(v.mu + 4 * v.sigma, hi) + 1;
  const fmax = normalPdf(v.mu, v.mu, v.sigma); // σ ≥ 2, also > 0
  const plot = new Plot(xmin, xmax, 0, 1.2 * fmax, { x: 30, y: 46, w: 462, h: 216 });
  let out = open(
    "Dichtefunktion der Normalverteilung mit schattiertem Intervall zwischen a und b",
  );
  out += title("Die Fläche zwischen a und b ist die Wahrscheinlichkeit");
  out += plot.grid(2, 4, "x", "f(x)");
  if (v.b > v.a) {
    const area: Pt[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const x = lo + ((hi - lo) * i) / steps;
      area.push(plot.P(x, normalPdf(x, v.mu, v.sigma)));
    }
    area.push(plot.P(hi, 0));
    area.push(plot.P(lo, 0));
    out += polygon(area, "lab-fill-c");
  }
  out += plot.graph((x) => normalPdf(x, v.mu, v.sigma), "lab-curve");
  out += line(plot.X(v.mu), plot.Y(0), plot.X(v.mu), plot.box.y + 4, "lab-side-b");
  out += text(plot.X(v.mu), plot.box.y + 2, "μ", "lab-text-tick", "middle");
  for (const k of [1, 2, 3]) {
    for (const sign of [-1, 1]) {
      const mark = v.mu + sign * k * v.sigma;
      out += line(plot.X(mark), plot.Y(0), plot.X(mark), plot.Y(0) + 6, "lab-ink");
      out += text(
        plot.X(mark),
        plot.Y(0) + 18,
        `${sign < 0 ? "−" : "+"}${k}σ`,
        "lab-text-tick",
        "middle",
      );
    }
  }
  out += line(plot.X(v.a), plot.Y(0), plot.X(v.a), plot.box.y + 4, "lab-dashed");
  out += line(plot.X(v.b), plot.Y(0), plot.X(v.b), plot.box.y + 4, "lab-dashed");
  out += text(plot.X(v.a), plot.box.y + 2, "a", "lab-text-tick", "middle");
  out += text(plot.X(v.b), plot.box.y + 2, "b", "lab-text-tick", "middle");
  out += handle("a", plot.X(v.a), plot.Y(0), `Intervallgrenze a = ${fmt(v.a)}`);
  out += handle("b", plot.X(v.b), plot.Y(0), `Intervallgrenze b = ${fmt(v.b)}`);
  out += text(
    30,
    302,
    `P(${fmt(v.a)} < X ≤ ${fmt(v.b)}) = ${fmt(r.P as number, 4)}   ·   z-Werte: ${r.z as string}`,
    "lab-text-small",
  );
  out += text(
    30,
    320,
    `Sigma-Regeln: ${r.anteile as string}   ·   symmetrisch zu P = 0,95: ${r.sym as string}`,
    "lab-text-small",
  );
  out += `</svg>`;
  return out;
}

// ─── Die vier Labore der Etappe ────────────────────────────────────────────

export const NORMALVERTEILUNG_VIEWS: Record<string, LabView> = {
  zufallsgroesse: { render: zufallsgroesseView, handles: ZHANDLES },
  glockenkurve: { render: glockenkurveView },
  normalverteilung: { render: normalverteilungView, handles: NF_HANDLES },
  "sigma-regeln": {
    render: sigmaRegelnView,
    handles: {
      a: { x: "a", drag: (p, values) => ({ a: sigmaPlots(values).invX(p.x) }) },
      b: { x: "b", drag: (p, values) => ({ b: sigmaPlots(values).invX(p.x) }) },
    },
  },
};

/** Derselbe Plot wie in der Zeichnung, damit ein Ziehpunkt exakt passt. */
function sigmaPlots(v: LabValues): Plot {
  const lo = Math.min(v.a, v.b);
  const hi = Math.max(v.a, v.b);
  const xmin = Math.min(v.mu - 4 * v.sigma, lo) - 1;
  const xmax = Math.max(v.mu + 4 * v.sigma, hi) + 1;
  return new Plot(xmin, xmax, 0, 1, { x: 30, y: 46, w: 462, h: 216 });
}
