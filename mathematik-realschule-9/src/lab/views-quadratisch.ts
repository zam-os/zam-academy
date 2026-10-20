import { factorForm, fmt, linear, paren, quadratic, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  circle,
  clipped,
  handle,
  infoBox,
  type LabView,
  line,
  open,
  path,
  Plot,
  polyline,
  rect,
  text,
} from "./svg";

// ─── 4.1 Verschobene Normalparabel ─────────────────────────────────────────

const vertexPlot = () => new Plot(-8, 8, -4, 6);

function vertex(v: LabValues): string {
  const plot = vertexPlot();
  const f = (x: number) => (x - v.d) ** 2 + v.e;
  let out = open("Eine verschobene Normalparabel mit ziehbarem Scheitel");
  out += plot.clip("clip-vertex") + plot.grid(1, 2);
  out += clipped("clip-vertex", plot.graph((x) => x * x, "lab-ghost") + plot.graph(f, "lab-curve"));
  // the stairs of the normal parabola: 1 right 1 up, 2 right 4 up
  const S = plot.P(v.d, v.e);
  const stairs = [
    plot.P(v.d, v.e),
    plot.P(v.d + 1, v.e),
    plot.P(v.d + 1, v.e + 1),
    plot.P(v.d + 2, v.e + 1),
    plot.P(v.d + 2, v.e + 4),
  ];
  out += clipped("clip-vertex", polyline(stairs, "lab-dashed"));
  out += text(plot.X(v.d + 1.15), plot.Y(v.e + 0.5) + 4, "1", "lab-text-small");
  out += text(plot.X(v.d + 2.15), plot.Y(v.e + 2.5) + 4, "3", "lab-text-small");
  for (const [x, y] of [[1, 2], [5, 2]]) {
    const P = plot.P(x, y);
    const hit = Math.abs(f(x) - y) < 1e-9;
    out += circle(P.x, P.y, 7, hit ? "lab-point-ok" : "lab-target");
    out += text(P.x + 9, P.y - 9, `(${x} | ${y})`, "lab-text-small");
  }
  out += infoBox(32, 34, [
    [`f(x) = ${vertexForm(1, v.d, v.e)}`, "lab-text lab-text-big"],
    [`Scheitel S(${fmt(v.d)} | ${fmt(v.e)})`, "lab-text lab-text-c"],
    ["gestrichelt: Normalparabel y = x²", "lab-text-small"],
  ]);
  out += handle("S", S.x, S.y, "Scheitel S");
  out += `</svg>`;
  return out;
}

// ─── 4.2 Basketball: der Faktor a ──────────────────────────────────────────

export const HOOP = { x: 4.2, y: 3.05 };
export const RELEASE = { x: 0, y: 2 };

/** The throw through the release point (0 | 2) with vertex (d | e): its factor a. */
export function throwFactor(v: LabValues): number {
  return (RELEASE.y - v.e) / (RELEASE.x - v.d) ** 2;
}

export function isHit(v: LabValues): boolean {
  const a = throwFactor(v);
  const atHoop = a * (HOOP.x - v.d) ** 2 + v.e;
  return v.d < HOOP.x && Math.abs(atHoop - HOOP.y) <= 0.05;
}

const courtPlot = () => new Plot(-0.6, 5.9, 0, 4.8, { x: 60, y: 14, w: 420, h: 310 });

function basketball(v: LabValues): string {
  const plot = courtPlot();
  const a = throwFactor(v);
  const f = (x: number) => a * (x - v.d) ** 2 + v.e;
  const hit = isHit(v);
  let out = open("Ein Basketballwurf als Parabel durch Abwurfpunkt und Korb");
  out += plot.clip("clip-court");
  out += rect(60, 14, 420, 310, "lab-plot-bg");
  for (let y = 1; y <= 4; y++) {
    out += line(60, plot.Y(y), 480, plot.Y(y), "lab-grid") + text(56, plot.Y(y) + 4, `${y} m`, "lab-text-tick", "end");
  }
  for (let x = 1; x <= 5; x++) out += text(plot.X(x), plot.Y(0) + 14, `${x} m`, "lab-text-tick", "middle");
  out += line(60, plot.Y(0), 480, plot.Y(0), "lab-ink");
  // player and hoop
  const foot = plot.P(0, 0);
  const shoulder = plot.P(0, 1.4);
  const head = plot.P(0, 1.6);
  out += line(foot.x, foot.y, shoulder.x, shoulder.y, "lab-ink") + circle(head.x, head.y, 9, "lab-shape");
  out += line(shoulder.x, shoulder.y, plot.X(0.04), plot.Y(1.95), "lab-ink");
  out += rect(plot.X(4.62), plot.Y(3.95), 6, plot.Y(2.9) - plot.Y(3.95), "lab-shape-2");
  out += line(plot.X(4.65), plot.Y(0), plot.X(4.65), plot.Y(2.9), "lab-ink");
  out += line(plot.X(HOOP.x - 0.23), plot.Y(HOOP.y), plot.X(HOOP.x + 0.23), plot.Y(HOOP.y), hit ? "lab-side-ok" : "lab-side-b");
  out += path(`M${plot.X(HOOP.x - 0.2)} ${plot.Y(HOOP.y)} L${plot.X(HOOP.x - 0.12)} ${plot.Y(HOOP.y - 0.4)} L${plot.X(HOOP.x + 0.12)} ${plot.Y(HOOP.y - 0.4)} L${plot.X(HOOP.x + 0.2)} ${plot.Y(HOOP.y)}`, "lab-thin");
  // the flight
  out += clipped("clip-court", plot.graph((x) => (x >= 0 && x <= HOOP.x + 0.05 ? f(x) : Number.NaN), hit ? "lab-curve-ok" : "lab-curve"));
  out += clipped("clip-court", plot.graph((x) => (x > HOOP.x + 0.05 ? f(x) : Number.NaN), "lab-dashed"));
  out += circle(plot.X(0), plot.Y(2), 7, "lab-point-b");
  out += infoBox(74, 34, [
    [`f(x) = ${vertexForm(a, v.d, v.e, 3)}`, "lab-text lab-text-big"],
    [`a = (2 − ${fmt(v.e, 2)}) : ${fmt(v.d, 2)}² = ${fmt(a, 3)}`, "lab-text-muted"],
    [`Höhe am Korb: ${fmt(f(HOOP.x), 2)} m (Korb: 3,05 m)`, hit ? "lab-text lab-text-ok" : "lab-text-muted"],
  ]);
  if (hit) out += text(470, 34, "Treffer! 🏀", "lab-text lab-text-ok lab-text-big", "end");
  const S = plot.P(v.d, v.e);
  out += handle("S", S.x, S.y, "Höchster Punkt der Flugbahn");
  out += `</svg>`;
  return out;
}

// ─── 4.3 Quadratische Ergänzung mit Kacheln ────────────────────────────────

const TILES = { x0: 30, y0: 60, X: 130, u: 18 };

function squareTiles(v: LabValues): string {
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
  out += text(tx, 90, `f(x) = ${quadratic(1, v.b, v.c)}`, "lab-text lab-text-big");
  out += text(tx, 116, `= x² + ${fmt(v.b)}x + ${fmt(v.q)} − ${fmt(v.q)}${v.c === 0 ? "" : v.c > 0 ? ` + ${fmt(v.c)}` : ` − ${fmt(-v.c)}`}`, "lab-text-muted");
  if (fits) {
    out += text(tx, 142, `= ${vertexForm(1, -half, v.c - v.q)}`, "lab-text lab-text-ok");
    out += text(tx, 170, `Scheitel S(${fmt(-half)} | ${fmt(v.c - v.q)})`, "lab-text lab-text-c lab-text-big");
  } else {
    out += text(tx, 142, v.q < half * half ? "Das Eckquadrat ist zu klein." : "Das Eckquadrat ist zu groß.", "lab-text lab-text-bad");
    out += text(tx, 162, "Ein Binom entsteht nur mit (b/2)².", "lab-text-small");
  }
  out += handle("corner", x0 + X + Math.max(side, 0), y0 + X + Math.max(side, 0), "Ecke des Ergänzungsquadrats");
  out += `</svg>`;
  return out;
}

// ─── 4.4 Lösungsformel und Diskriminante ───────────────────────────────────

/** The real solutions of a·x² + b·x + c = 0, sorted; empty when there are none. */
export function quadraticRoots(a: number, b: number, c: number): number[] {
  if (a === 0) return b === 0 ? [] : [-c / b];
  const D = b * b - 4 * a * c;
  if (D < 0) return [];
  if (D === 0) return [-b / (2 * a)];
  const r = Math.sqrt(D);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((x, y) => x - y);
}

const formulaPlot = () => new Plot(-8, 8, -6, 6);

function discriminant(v: LabValues): string {
  const plot = formulaPlot();
  const D = v.b * v.b - 4 * v.a * v.c;
  const roots = quadraticRoots(v.a, v.b, v.c);
  let out = open("Parabel, ihre Nullstellen und die Diskriminante");
  out += plot.clip("clip-formula") + plot.grid(1, 2);
  out += clipped("clip-formula", plot.graph((x) => v.a * x * x + v.b * x + v.c, "lab-curve"));
  for (const x of roots) {
    const P = plot.P(x, 0);
    out += circle(P.x, P.y, 6, "lab-point-ok");
  }
  const info: Array<[string, string]> = [
    [v.a === 0 ? "a = 0: keine quadratische Gleichung" : `${quadratic(v.a, v.b, v.c)} = 0`, "lab-text lab-text-big"],
    [`D = b² − 4ac = ${fmt(D)}`, D > 0 ? "lab-text lab-text-ok" : D === 0 ? "lab-text lab-text-c" : "lab-text lab-text-bad"],
  ];
  if (v.a !== 0) {
    info.push([D < 0 ? "D < 0: keine Lösung" : D === 0 ? `D = 0: eine Lösung x = ${fmt(roots[0], 3)}` : `x₁,₂ = (${fmt(-v.b)} ± √${fmt(D)}) : ${paren(2 * v.a)}`, "lab-text-muted"]);
    if (D > 0) info.push([`x₁ = ${fmt(roots[0], 3)}, x₂ = ${fmt(roots[1], 3)}`, "lab-text-muted"]);
  }
  out += infoBox(32, 34, info);
  // the D gauge
  const gx = 476;
  const g0 = 170;
  const h = Math.max(-120, Math.min(120, D * 2));
  out += line(gx - 14, g0, gx + 14, g0, "lab-ink");
  out += rect(gx - 8, D >= 0 ? g0 - h : g0, 16, Math.abs(h), D > 0 ? "lab-bar-ok" : "lab-bar-bad");
  out += circle(gx, g0, D === 0 ? 7 : 3, D === 0 ? "lab-point-a" : "lab-dot-small");
  out += text(gx, g0 - 130, "D", "lab-text-axis", "middle");
  out += `</svg>`;
  return out;
}

// ─── 4.5 Nullstellen und Linearfaktoren ────────────────────────────────────

const rootsPlot = () => new Plot(-8, 8, -6, 6);

/** Right of both roots where (x − x₁)(x − x₂) = 1, so the curve there sits at height a. */
function factorHandleX(x1: number, x2: number): number {
  const delta = Math.abs(x2 - x1);
  return Math.max(x1, x2) + (-delta + Math.sqrt(delta * delta + 4)) / 2;
}

function roots(v: LabValues): string {
  const plot = rootsPlot();
  const f = (x: number) => v.a * (x - v.x1) * (x - v.x2);
  const xs = (v.x1 + v.x2) / 2;
  let out = open("Eine Parabel mit ziehbaren Nullstellen und Streckfaktor");
  out += plot.clip("clip-roots") + plot.grid(1, 2);
  out += clipped("clip-roots", plot.graph(f, "lab-curve"));
  if (v.a !== 0) {
    const S = plot.P(xs, f(xs));
    if (plot.contains(xs, f(xs))) out += circle(S.x, S.y, 5, "lab-point-ok");
    out += clipped("clip-roots", line(S.x, plot.Y(plot.ymin), S.x, plot.Y(plot.ymax), "lab-dashed"));
  }
  out += infoBox(32, 34, [
    [`f(x) = ${v.a === 0 ? "0" : factorForm(v.a, v.x1, v.x2)}`, "lab-text lab-text-big"],
    [`= ${quadratic(v.a, -v.a * (v.x1 + v.x2), v.a * v.x1 * v.x2)}`, "lab-text-muted"],
    [v.a === 0 ? "a = 0: keine Parabel" : `Scheitel S(${fmt(xs, 2)} | ${fmt(f(xs), 2)}) in der Mitte der Nullstellen`, "lab-text-small"],
  ]);
  const R1 = plot.P(v.x1, 0);
  const R2 = plot.P(v.x2, 0);
  out += handle("x1", R1.x, R1.y, "Nullstelle x₁", "lab-handle lab-handle-a");
  out += handle("x2", R2.x, R2.y, "Nullstelle x₂", "lab-handle lab-handle-b");
  const hx = factorHandleX(v.x1, v.x2);
  const A = plot.P(hx, v.a);
  out += handle("a", A.x, A.y, "Streckfaktor a");
  out += text(A.x + 12, A.y + 4, `a = ${fmt(v.a, 2)}`, "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 4.6 Parabel und Gerade ────────────────────────────────────────────────

const PARABOLA_Q = -4; // f(x) = x² − 4
const pgPlot = () => new Plot(-5, 5, -6, 8);

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

function parabolaLine(v: LabValues): string {
  const plot = pgPlot();
  const { D, xs } = intersectionKind(v.m, v.t);
  let out = open("Eine Parabel und eine Gerade: Sekante, Tangente oder Passante");
  out += plot.clip("clip-pg") + plot.grid(1, 2);
  out += clipped("clip-pg", plot.graph((x) => x * x + PARABOLA_Q, "lab-curve") + plot.lineThrough(v.m, v.t, "lab-curve-2"));
  for (const x of xs) {
    const y = v.m * x + v.t;
    if (plot.contains(x, y)) {
      const P = plot.P(x, y);
      out += circle(P.x, P.y, 6, "lab-point-ok");
    }
  }
  const kind = D > 0 ? "Sekante: 2 Schnittpunkte" : D === 0 ? "Tangente: 1 Berührpunkt" : "Passante: kein Schnittpunkt";
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
  out += `</svg>`;
  return out;
}

// ─── 4.7 Gehege: Extremwert ────────────────────────────────────────────────

export function fenceRect(v: LabValues): { y: number; area: number; best: number; bestX: number } {
  const y = v.mode === 0 ? v.L / 2 - v.x : v.L - 2 * v.x;
  const area = y > 0 ? v.x * y : 0;
  const bestX = v.mode === 0 ? v.L / 4 : v.L / 4;
  const bestY = v.mode === 0 ? v.L / 4 : v.L / 2;
  return { y, area, best: bestX * bestY, bestX };
}

const FENCE = { x0: 30, y0: 70 };

/** Pixels per metre: the longest possible side (y) still fits 250 px. */
const fenceScale = (v: LabValues) => Math.min(18, 250 / (v.mode === 0 ? v.L / 2 : v.L));

function fence(v: LabValues): string {
  const { y, area, best, bestX } = fenceRect(v);
  const { x0, y0 } = FENCE;
  const k = fenceScale(v);
  let out = open("Ein rechteckiges Gehege aus einem Zaun fester Länge und sein Flächeninhalt");
  if (v.mode === 1) {
    out += rect(x0 - 6, y0 - 10, 260, 10, "lab-shape-2");
    out += text(x0 + 124, y0 - 14, "Mauer", "lab-text-small", "middle");
  }
  if (y > 0) {
    // x is the side at right angles to the wall; y runs along it
    const w = y * k;
    const h = v.x * k;
    out += rect(x0, y0, w, h, "lab-fill-ok");
    out += path(v.mode === 1 ? `M${x0} ${y0} V${y0 + h} H${x0 + w} V${y0}` : `M${x0} ${y0} H${x0 + w} V${y0 + h} H${x0} Z`, "lab-fence");
    out += text(x0 + w / 2, y0 + h + 16, `y = ${fmt(y, 2)} m`, "lab-text", "middle");
    out += text(x0 + w + 6, y0 + h / 2, `x = ${fmt(v.x, 2)} m`, "lab-text");
    if (h > 24 && w > 60) out += text(x0 + w / 2, y0 + h / 2 + 5, `${fmt(area, 2)} m²`, "lab-text lab-text-big", "middle");
  } else {
    out += text(x0, y0 + 30, "Der Zaun reicht für dieses x nicht.", "lab-text lab-text-bad");
  }
  out += text(x0, 30, v.mode === 0 ? `Zaun ${v.L} m: 2x + 2y = ${v.L}` : `Zaun ${v.L} m: 2x + y = ${v.L}`, "lab-text lab-text-big");
  out += text(x0, 50, v.mode === 0 ? `A(x) = x · (${fmt(v.L / 2)} − x)` : `A(x) = x · (${v.L} − 2x)`, "lab-text-muted");
  // A(x) on the right
  const xmax = v.mode === 0 ? v.L / 2 : v.L / 2;
  const plot = new Plot(0, xmax, 0, best * 1.15, { x: 300, y: 70, w: 205, h: 220 });
  out += rect(300, 70, 205, 220, "lab-plot-bg");
  out += plot.clip("clip-fence");
  out += clipped("clip-fence", plot.graph((x) => (v.mode === 0 ? x * (v.L / 2 - x) : x * (v.L - 2 * x)), "lab-curve"));
  const P = plot.P(Math.min(v.x, xmax), Math.max(area, 0));
  out += circle(P.x, P.y, 6, "lab-point-b");
  const B = plot.P(bestX, best);
  out += circle(B.x, B.y, 4, "lab-dot-small");
  out += text(300, 62, "A in m²", "lab-text-axis");
  out += text(505, 306, "x in m", "lab-text-axis", "end");
  out += text(B.x, B.y - 10, `max ${fmt(best, 1)}`, "lab-text-small", "middle");
  out += text(300, 326, `A = ${fmt(area, 2)} m²`, "lab-text-small");
  if (y > 0) out += handle("corner", x0 + y * k, y0 + v.x * k, "Ecke des Geheges: x ändern");
  out += `</svg>`;
  return out;
}

export const QUADRATISCH_VIEWS: Record<"vertex" | "basketball" | "square-tiles" | "discriminant" | "roots" | "parabola-line" | "fence", LabView> = {
  vertex: {
    render: vertex,
    handles: {
      S: {
        x: "d",
        y: "e",
        drag: (p) => {
          const plot = vertexPlot();
          return { d: plot.invX(p.x), e: plot.invY(p.y) };
        },
      },
    },
  },
  basketball: {
    render: basketball,
    handles: {
      S: {
        x: "d",
        y: "e",
        drag: (p) => {
          const plot = courtPlot();
          return { d: plot.invX(p.x), e: plot.invY(p.y) };
        },
      },
    },
  },
  "square-tiles": {
    render: squareTiles,
    handles: {
      corner: {
        y: "q",
        drag: (p) => {
          const side = Math.max(0, Math.max(p.x - (TILES.x0 + TILES.X), p.y - (TILES.y0 + TILES.X))) / TILES.u;
          return { q: side * side };
        },
      },
    },
  },
  discriminant: { render: discriminant },
  roots: {
    render: roots,
    handles: {
      x1: { x: "x1", drag: (p) => ({ x1: rootsPlot().invX(p.x) }) },
      x2: { x: "x2", drag: (p) => ({ x2: rootsPlot().invX(p.x) }) },
      a: { y: "a", drag: (p) => ({ a: rootsPlot().invY(p.y) }) },
    },
  },
  "parabola-line": {
    render: parabolaLine,
    handles: {
      t: { y: "t", drag: (p) => ({ t: pgPlot().invY(p.y) }) },
      m: {
        y: "m",
        drag: (p, v) => {
          const plot = pgPlot();
          const x = plot.invX(p.x);
          if (Math.abs(x) < 0.3) return {};
          return { m: (plot.invY(p.y) - v.t) / x };
        },
      },
    },
  },
  fence: {
    render: fence,
    handles: {
      corner: { x: "x", drag: (p, v) => ({ x: (p.y - FENCE.y0) / fenceScale(v) }) },
    },
  },
};
