import { fmt, linear, paren, sum } from "../exercises/format";
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
  text,
  W,
} from "./svg";

/** "2x − 4y = 8" from its coefficients. */
export function equationText(a: number, b: number, c: number): string {
  return `${sum([[a, "x"], [b, "y"]])} = ${fmt(c)}`;
}

export type SystemKind = "one" | "none" | "infinite";

export interface SystemSolution {
  kind: SystemKind;
  x: number;
  y: number;
}

/** Solves a1·x + b1·y = c1, a2·x + b2·y = c2 and names the case. */
export function solveSystem(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): SystemSolution {
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) > 1e-12) {
    return { kind: "one", x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det };
  }
  // Parallel or the same line: the rows are proportional, the right-hand sides decide.
  const rank1 = Math.abs(a1 * c2 - a2 * c1) < 1e-12 && Math.abs(b1 * c2 - b2 * c1) < 1e-12;
  return { kind: rank1 ? "infinite" : "none", x: Number.NaN, y: Number.NaN };
}

/** True when a·x + b·y = c is a line (not 0 = c). */
export function isLine(a: number, b: number): boolean {
  return a !== 0 || b !== 0;
}

/** The explicit form of a·x + b·y = c: "y = −0,5x + 2", "x = 3" or a note. */
export function explicitText(a: number, b: number, c: number): string {
  if (b !== 0) return `y = ${linear(-a / b, c / b)}`;
  if (a !== 0) return `x = ${fmt(c / a)} (senkrechte Gerade)`;
  return c === 0 ? "0 = 0: jedes Zahlenpaar" : `0 = ${fmt(c)}: kein Zahlenpaar`;
}

const PLANE = () => new Plot(-8, 8, -5, 5);

/** Draws a·x + b·y = c across the plot, including vertical lines. */
function drawLine(plot: Plot, a: number, b: number, c: number, cls: string): string {
  if (b !== 0) return plot.lineThrough(-a / b, c / b, cls);
  if (a !== 0) {
    const x = c / a;
    return line(plot.X(x), plot.Y(plot.ymin), plot.X(x), plot.Y(plot.ymax), cls);
  }
  return "";
}

// ─── 3.1 Lineare Gleichung mit zwei Variablen ──────────────────────────────

function lineEquation(v: LabValues): string {
  const plot = PLANE();
  const value = v.a * v.px + v.b * v.py;
  const on = isLine(v.a, v.b) && Math.abs(value - v.c) < 1e-9;
  let out = open("Die Lösungen einer linearen Gleichung mit zwei Variablen bilden eine Gerade");
  out += plot.clip("clip-plane") + plot.grid(1, 2);
  out += clipped("clip-plane", drawLine(plot, v.a, v.b, v.c, "lab-curve"));
  const P = plot.P(v.px, v.py);
  out += infoBox(32, 34, [
    [equationText(v.a, v.b, v.c), "lab-text lab-text-big"],
    [explicitText(v.a, v.b, v.c), "lab-text-muted"],
    [`P(${fmt(v.px)} | ${fmt(v.py)}): ${paren(v.a)} · ${paren(v.px)} + ${paren(v.b)} · ${paren(v.py)} = ${fmt(value)}`, on ? "lab-text lab-text-ok" : "lab-text lab-text-bad"],
    [on ? "P liegt auf der Geraden: eine Lösung." : `${fmt(value)} ≠ ${fmt(v.c)}: P ist keine Lösung.`, "lab-text-small"],
  ]);
  out += circle(P.x, P.y, 9, on ? "lab-point-ok" : "lab-point-bad");
  out += handle("P", P.x, P.y, "Punkt P");
  out += `</svg>`;
  return out;
}

// ─── 3.2 Zwei Geraden: Gleichsetzen ────────────────────────────────────────

/** Where the slope handle of y = m x + t sits: 3 units along the line from (0 | t), inside the plot. */
function slopeHandle(m: number, t: number): { x: number; y: number } {
  const len = Math.hypot(1, m);
  const forward = { x: 3 / len, y: t + (3 * m) / len };
  if (forward.y <= 4.8 && forward.y >= -4.8) return forward;
  return { x: -3 / len, y: t - (3 * m) / len };
}

function twoLines(v: LabValues): string {
  const plot = PLANE();
  let out = open("Zwei Geraden und ihr Schnittpunkt");
  out += plot.clip("clip-plane") + plot.grid(1, 2);
  out += clipped("clip-plane", plot.lineThrough(v.m1, v.t1, "lab-curve") + plot.lineThrough(v.m2, v.t2, "lab-curve-2"));
  const info: Array<[string, string]> = [
    [`(I)  y = ${linear(v.m1, v.t1)}`, "lab-text lab-text-a"],
    [`(II) y = ${linear(v.m2, v.t2)}`, "lab-text lab-text-b"],
  ];
  if (v.m1 !== v.m2) {
    const x = (v.t2 - v.t1) / (v.m1 - v.m2);
    const y = v.m1 * x + v.t1;
    info.push([`${linear(v.m1, v.t1)} = ${linear(v.m2, v.t2)}`, "lab-text-muted"], [`x = ${fmt(x, 3)}, y = ${fmt(y, 3)}`, "lab-text-muted"]);
    if (plot.contains(x, y)) {
      const S = plot.P(x, y);
      out += circle(S.x, S.y, 6, "lab-point-ok");
      out += text(S.x + 10, S.y + 18, `S(${fmt(x, 2)} | ${fmt(y, 2)})`, "lab-text lab-text-ok");
    } else {
      info.push(["Der Schnittpunkt liegt außerhalb des Bildes.", "lab-text-small"]);
    }
  } else {
    info.push([v.t1 === v.t2 ? "Die Geraden sind gleich." : "Parallel: kein Schnittpunkt.", "lab-text-muted"]);
  }
  out += infoBox(32, 34, info);
  for (const [index, m, t] of [[1, v.m1, v.t1], [2, v.m2, v.t2]] as const) {
    const T = plot.P(0, t);
    const s = slopeHandle(m, t);
    const S = plot.P(s.x, s.y);
    out += handle(`t${index}`, T.x, T.y, `Achsenabschnitt der Geraden ${index === 1 ? "I" : "II"}`);
    out += handle(`m${index}`, S.x, S.y, `Steigung der Geraden ${index === 1 ? "I" : "II"}`, index === 1 ? "lab-handle lab-handle-a" : "lab-handle lab-handle-b");
  }
  out += `</svg>`;
  return out;
}

function twoLineHandles(): LabView["handles"] {
  const plot = PLANE();
  const intercept = (key: "t1" | "t2") => ({
    y: key,
    drag: (p: { x: number; y: number }) => ({ [key]: plot.invY(p.y) }),
  });
  const slope = (m: "m1" | "m2", t: "t1" | "t2") => ({
    y: m,
    drag: (p: { x: number; y: number }, v: LabValues) => {
      const x = plot.invX(p.x);
      if (Math.abs(x) < 0.3) return {};
      return { [m]: (plot.invY(p.y) - v[t]) / x };
    },
  });
  return { t1: intercept("t1"), t2: intercept("t2"), m1: slope("m1", "t1"), m2: slope("m2", "t2") };
}

// ─── 3.3 Additionsverfahren ────────────────────────────────────────────────

export interface LinearSystem {
  a1: number;
  b1: number;
  c1: number;
  a2: number;
  b2: number;
  c2: number;
}

export const ELIMINATION_SYSTEMS: Record<number, LinearSystem> = {
  1: { a1: 2, b1: 3, c1: 12, a2: 4, b2: -1, c2: 10 },
  2: { a1: 3, b1: 2, c1: 7, a2: 5, b2: -3, c2: 37 },
  3: { a1: 5, b1: 4, c1: 3, a2: 3, b2: -6, c2: -15 },
};

/** The sum k1·(I) + k2·(II) of a system. */
export function combined(v: LabValues): { a: number; b: number; c: number } {
  const s = ELIMINATION_SYSTEMS[v.sys];
  return { a: v.k1 * s.a1 + v.k2 * s.a2, b: v.k1 * s.b1 + v.k2 * s.b2, c: v.k1 * s.c1 + v.k2 * s.c2 };
}

function elimination(v: LabValues): string {
  const s = ELIMINATION_SYSTEMS[v.sys];
  const sumRow = combined(v);
  const sol = solveSystem(s.a1, s.b1, s.c1, s.a2, s.b2, s.c2);
  const factor = (k: number) => (k < 0 ? `· (${fmt(k)})` : `· ${fmt(k)}`);
  let out = open("Additionsverfahren: zwei Gleichungen mit Faktoren addiert");
  out += text(16, 40, `(I)   ${equationText(s.a1, s.b1, s.c1)}`, "lab-text lab-text-a");
  out += text(206, 40, `| ${factor(v.k1)}`, "lab-text-muted");
  out += text(16, 64, `(II)  ${equationText(s.a2, s.b2, s.c2)}`, "lab-text lab-text-b");
  out += text(206, 64, `| ${factor(v.k2)}`, "lab-text-muted");
  out += text(16, 100, `${fmt(v.k1)} · (I):  ${equationText(v.k1 * s.a1, v.k1 * s.b1, v.k1 * s.c1)}`, "lab-text-muted");
  out += text(16, 120, `${fmt(v.k2)} · (II): ${equationText(v.k2 * s.a2, v.k2 * s.b2, v.k2 * s.c2)}`, "lab-text-muted");
  out += line(16, 130, 250, 130, "lab-ink");
  out += text(16, 152, `Summe: ${equationText(sumRow.a, sumRow.b, sumRow.c)}`, "lab-text lab-text-c lab-text-big");
  const eliminated = v.k1 !== 0 && v.k2 !== 0 && (sumRow.a === 0) !== (sumRow.b === 0);
  let notes: string[];
  if (v.k1 === 0 || v.k2 === 0) notes = ["Mit dem Faktor 0 fällt eine", "ganze Gleichung weg."];
  else if (sumRow.b === 0 && sumRow.a !== 0) notes = [`y ist weg: x = ${fmt(sumRow.c)} : ${fmt(sumRow.a)} = ${fmt(sol.x, 3)}`, "Einsetzen in (I) gibt y:", `L = {(${fmt(sol.x, 3)} | ${fmt(sol.y, 3)})}`];
  else if (sumRow.a === 0 && sumRow.b !== 0) notes = [`x ist weg: y = ${fmt(sumRow.c)} : ${fmt(sumRow.b)} = ${fmt(sol.y, 3)}`, "Einsetzen in (I) gibt x:", `L = {(${fmt(sol.x, 3)} | ${fmt(sol.y, 3)})}`];
  else notes = ["Noch stehen x und y da. Suche", "Faktoren, mit denen eine", "Variable herausfällt."];
  notes.forEach((note, index) => {
    out += text(16, 182 + index * 20, note, eliminated ? (index === 0 ? "lab-text lab-text-ok" : "lab-text") : "lab-text-muted");
  });
  // all three lines pass through the solution
  const plot = new Plot(-6, 6, -6, 6, { x: 280, y: 222 - 200, w: 230, h: 230 });
  out += plot.clip("clip-elim") + plot.grid(1, 2);
  out += clipped(
    "clip-elim",
    drawLine(plot, s.a1, s.b1, s.c1, "lab-curve") + drawLine(plot, s.a2, s.b2, s.c2, "lab-curve-2") + (isLine(sumRow.a, sumRow.b) && v.k1 !== 0 && v.k2 !== 0 ? drawLine(plot, sumRow.a, sumRow.b, sumRow.c, "lab-curve-c") : ""),
  );
  const S = plot.P(sol.x, sol.y);
  out += circle(S.x, S.y, 5, "lab-point-ok");
  out += text(280, 270, "Violett: die Summen-Gerade. Auch sie", "lab-text-small");
  out += text(280, 286, "läuft durch den Schnittpunkt; fehlt eine", "lab-text-small");
  out += text(280, 302, "Variable, steht sie senkrecht oder waagrecht.", "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 3.4 Lösungsfälle ──────────────────────────────────────────────────────

export function caseText(v: LabValues): string {
  if (!isLine(v.a1, v.b1) || !isLine(v.a2, v.b2)) return "eine Gleichung ist keine Gerade";
  const sol = solveSystem(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2);
  if (sol.kind === "one") return `genau eine Lösung: (${fmt(sol.x, 3)} | ${fmt(sol.y, 3)})`;
  return sol.kind === "none" ? "keine Lösung" : "unendlich viele Lösungen";
}

function systemCases(v: LabValues): string {
  const plot = PLANE();
  const sol = solveSystem(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2);
  const valid = isLine(v.a1, v.b1) && isLine(v.a2, v.b2);
  let out = open("Zwei Geraden: Schnittpunkt, parallel oder deckungsgleich");
  out += plot.clip("clip-plane") + plot.grid(1, 2);
  out += clipped("clip-plane", drawLine(plot, v.a1, v.b1, v.c1, "lab-curve") + drawLine(plot, v.a2, v.b2, v.c2, sol.kind === "infinite" ? "lab-curve-dashed" : "lab-curve-2"));
  out += infoBox(32, 34, [
    [`(I)  ${equationText(v.a1, v.b1, v.c1)}`, "lab-text lab-text-a"],
    [`(II) ${equationText(v.a2, v.b2, v.c2)}`, "lab-text lab-text-b"],
  ]);
  const verdict: Array<[string, string]> = [[caseText(v), sol.kind === "one" && valid ? "lab-text lab-text-ok" : "lab-text lab-text-c"]];
  if (valid && sol.kind !== "one") {
    // eliminate y: b2·(I) − b1·(II), or x when both b are 0
    const useY = v.b1 !== 0 || v.b2 !== 0;
    const rest = useY ? v.c1 * v.b2 - v.c2 * v.b1 : v.c1 * v.a2 - v.c2 * v.a1;
    verdict.push([`Eliminieren: 0 = ${fmt(rest)}, ${rest === 0 ? "immer wahr" : "ein Widerspruch"}`, "lab-text-muted"]);
  }
  out += infoBox(W - 32, 254, verdict, "end");
  if (valid && sol.kind === "one" && plot.contains(sol.x, sol.y)) {
    const S = plot.P(sol.x, sol.y);
    out += circle(S.x, S.y, 6, "lab-point-ok");
  }
  out += `</svg>`;
  return out;
}

// ─── 3.5 Textaufgaben: drei Rätsel ─────────────────────────────────────────

export interface Riddle {
  title: string;
  a: string;
  b: string;
  iconA: string;
  iconB: string;
  /** x + y = total */
  total: number;
  totalLabel: string;
  /** wa·x + wb·y = value */
  wa: number;
  wb: number;
  value: number;
  valueLabel: string;
  unit: string;
  solution: [number, number];
  range: [number, number];
}

export const RIDDLES: Record<number, Riddle> = {
  0: {
    title: "Fasane und Kaninchen",
    a: "Fasane",
    b: "Kaninchen",
    iconA: "🐓",
    iconB: "🐇",
    total: 35,
    totalLabel: "Köpfe",
    wa: 2,
    wb: 4,
    value: 94,
    valueLabel: "Beine",
    unit: "",
    solution: [23, 12],
    range: [50, 40],
  },
  1: {
    title: "Kinokasse",
    a: "Erwachsene (8 €)",
    b: "Kinder (5 €)",
    iconA: "🧑",
    iconB: "🧒",
    total: 120,
    totalLabel: "Karten",
    wa: 8,
    wb: 5,
    value: 840,
    valueLabel: "Einnahmen",
    unit: " €",
    solution: [80, 40],
    range: [130, 170],
  },
  2: {
    title: "Spardose",
    a: "1-€-Münzen",
    b: "2-€-Münzen",
    iconA: "①",
    iconB: "②",
    total: 25,
    totalLabel: "Münzen",
    wa: 1,
    wb: 2,
    value: 38,
    valueLabel: "Betrag",
    unit: " €",
    solution: [12, 13],
    range: [40, 30],
  },
};

function riddlePlot(v: LabValues): Plot {
  const [xmax, ymax] = RIDDLES[v.puzzle].range;
  return new Plot(0, xmax, 0, ymax, { x: 300, y: 70, w: 205, h: 240 });
}

function puzzleFarm(v: LabValues): string {
  const riddle = RIDDLES[v.puzzle];
  const total = v.x + v.y;
  const value = riddle.wa * v.x + riddle.wb * v.y;
  let out = open(`Rätsel ${riddle.title}: zwei Bedingungen, zwei Unbekannte`);
  out += text(16, 26, riddle.title, "lab-text lab-text-big");
  out += text(16, 48, `${riddle.totalLabel}: x + y = ${total} (Ziel ${riddle.total})`, total === riddle.total ? "lab-text lab-text-ok" : "lab-text");
  out += text(16, 68, `${riddle.valueLabel}: ${riddle.wa === 1 ? "" : riddle.wa}x + ${riddle.wb}y = ${value}${riddle.unit} (Ziel ${riddle.value}${riddle.unit})`, value === riddle.value ? "lab-text lab-text-ok" : "lab-text");
  // the crowd: one mark per animal, ticket or coin
  const many = total > 60;
  const cols = many ? 20 : 10;
  const size = many ? 11 : 24;
  const shown = Math.min(total, many ? 200 : 60);
  for (let i = 0; i < shown; i++) {
    const x = 18 + (i % cols) * (size + 2);
    const y = 92 + Math.floor(i / cols) * (size + 2);
    const isA = i < v.x;
    if (many) out += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="3" class="${isA ? "lab-bar-a" : "lab-bar-b"}" />`;
    else out += `<text x="${x}" y="${y + size - 4}" class="lab-emoji">${isA ? riddle.iconA : riddle.iconB}</text>`;
  }
  out += text(16, 330, `x = ${v.x} ${riddle.a}, y = ${v.y} ${riddle.b}`, "lab-text-small");
  // both conditions as lines in the (x | y) plane
  const plot = riddlePlot(v);
  out += plot.clip("clip-riddle");
  out += `<rect x="300" y="70" width="205" height="240" class="lab-plot-bg" />`;
  const [xmax, ymax] = riddle.range;
  out += text(300, 62, "y", "lab-text-axis") + text(505, 326, "x", "lab-text-axis", "end");
  out += text(300, 326, "0", "lab-text-tick");
  out += text(505, 62, `${xmax} × ${ymax}`, "lab-text-tick", "end");
  out += clipped(
    "clip-riddle",
    plot.lineThrough(-1, riddle.total, "lab-curve") + plot.lineThrough(-riddle.wa / riddle.wb, riddle.value / riddle.wb, "lab-curve-2"),
  );
  const P = plot.P(Math.min(v.x, xmax), Math.min(v.y, ymax));
  out += handle("xy", P.x, P.y, "Zahlenpaar (x | y)");
  out += text(305, 84, `x + y = ${riddle.total}`, "lab-text-small lab-text-a");
  out += text(305, 98, `${riddle.wa === 1 ? "" : riddle.wa}x + ${riddle.wb}y = ${riddle.value}`, "lab-text-small lab-text-b");
  out += `</svg>`;
  return out;
}

export const GLEICHUNGSSYSTEME_VIEWS: Record<"line-equation" | "two-lines" | "elimination" | "system-cases" | "puzzle-farm", LabView> = {
  "line-equation": {
    render: lineEquation,
    handles: {
      P: {
        x: "px",
        y: "py",
        drag: (p) => {
          const plot = PLANE();
          return { px: plot.invX(p.x), py: plot.invY(p.y) };
        },
      },
    },
  },
  "two-lines": { render: twoLines, handles: twoLineHandles() },
  elimination: { render: elimination },
  "system-cases": { render: systemCases },
  "puzzle-farm": {
    render: puzzleFarm,
    handles: {
      xy: {
        x: "x",
        y: "y",
        drag: (p, v) => {
          const plot = riddlePlot(v);
          return { x: plot.invX(p.x), y: plot.invY(p.y) };
        },
      },
    },
  },
};
