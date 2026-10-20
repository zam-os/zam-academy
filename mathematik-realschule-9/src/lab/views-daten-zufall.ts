import { fmt, fracText } from "../exercises/format";
import { createRng } from "../exercises/rng";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, path, polygon, rect, text, W } from "./svg";

// ─── Statistics shared by the labs and the exercises ───────────────────────

export function sorted(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function median(values: number[]): number {
  const s = sorted(values);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Lower and upper quartile as the median of the lower and upper half of the
 * ordered list; with an odd count the median itself belongs to neither half.
 * For 4k + 3 and 4k values every common school convention gives the same
 * result, so labs and tasks only use those counts.
 */
export function quartiles(values: number[]): { q1: number; q2: number; q3: number } {
  const s = sorted(values);
  const half = Math.floor(s.length / 2);
  const lower = s.slice(0, half);
  const upper = s.slice(s.length % 2 === 1 ? half + 1 : half);
  return { q1: median(lower), q2: median(s), q3: median(upper) };
}

export function fiveNumbers(values: number[]) {
  const s = sorted(values);
  const { q1, q2, q3 } = quartiles(s);
  return { min: s[0], q1, q2, q3, max: s[s.length - 1] };
}

// ─── 5.1 Urne: Baumdiagramm und Simulation ─────────────────────────────────

export type Draw = "R" | "B";

/** Probabilities of the four paths for two draws, with or without replacement. */
export function urnPaths(r: number, b: number, withoutReplacement: boolean): Record<"RR" | "RB" | "BR" | "BB", number> {
  const n = r + b;
  if (!withoutReplacement) {
    const p = r / n;
    return { RR: p * p, RB: p * (1 - p), BR: (1 - p) * p, BB: (1 - p) * (1 - p) };
  }
  return {
    RR: (r / n) * ((r - 1) / (n - 1)),
    RB: (r / n) * (b / (n - 1)),
    BR: (b / n) * (r / (n - 1)),
    BB: (b / n) * ((b - 1) / (n - 1)),
  };
}

export const URN_EVENTS = ["zwei rote", "genau eine rote", "mindestens eine rote", "zwei gleiche Farben"];

export function eventPaths(event: number): Array<"RR" | "RB" | "BR" | "BB"> {
  return [["RR"], ["RB", "BR"], ["RR", "RB", "BR"], ["RR", "BB"]][event] as Array<"RR" | "RB" | "BR" | "BB">;
}

export function eventProbability(v: LabValues): number {
  const paths = urnPaths(v.rot, v.blau, v.mode === 1);
  return eventPaths(v.event).reduce((sum, key) => sum + paths[key], 0);
}

/** Runs `count` experiments of two draws and returns the new counters and seed. */
export function simulateUrn(v: LabValues, count: number): LabValues {
  const rng = createRng(v.seed);
  let hits = 0;
  const wanted = eventPaths(v.event);
  for (let i = 0; i < count; i++) {
    let red = v.rot;
    let blue = v.blau;
    const first: Draw = rng.next() < red / (red + blue) ? "R" : "B";
    if (v.mode === 1) {
      if (first === "R") red -= 1;
      else blue -= 1;
    }
    const second: Draw = rng.next() < red / (red + blue) ? "R" : "B";
    if (wanted.includes(`${first}${second}` as "RR")) hits += 1;
  }
  return { ...v, n: v.n + count, hits: v.hits + hits, seed: rng.state() };
}

/** Text of a probability as a fraction of the urn, e.g. "3/5". */
function branch(numerator: number, denominator: number): string {
  return denominator === 0 ? "–" : numerator === 0 ? "0" : `${numerator}/${denominator}`;
}

function urn(v: LabValues): string {
  const n = v.rot + v.blau;
  const without = v.mode === 1;
  const paths = urnPaths(v.rot, v.blau, without);
  const wanted = eventPaths(v.event);
  const P = eventProbability(v);
  let out = open("Eine Urne mit roten und blauen Kugeln und das Baumdiagramm für zweimaliges Ziehen");
  // the urn
  out += path("M24 70 Q24 60 34 60 H116 Q126 60 126 70 V230 Q126 250 106 250 H44 Q24 250 24 230 Z", "lab-shape");
  for (let i = 0; i < n; i++) {
    const cx = 44 + (i % 4) * 21;
    const cy = 232 - Math.floor(i / 4) * 21;
    out += circle(cx, cy, 9, i < v.rot ? "lab-ball-red" : "lab-ball-blue");
  }
  out += text(75, 274, `${v.rot} rot, ${v.blau} blau`, "lab-text-small", "middle");
  out += text(75, 290, without ? "ohne Zurücklegen" : "mit Zurücklegen", "lab-text-small", "middle");
  // the tree
  const root = { x: 160, y: 150 };
  const level1 = { R: { x: 270, y: 90 }, B: { x: 270, y: 210 } };
  const leaves = { RR: { x: 380, y: 60 }, RB: { x: 380, y: 120 }, BR: { x: 380, y: 180 }, BB: { x: 380, y: 240 } };
  const second = (first: Draw, colour: Draw) => {
    const red = without && first === "R" ? v.rot - 1 : v.rot;
    const blue = without && first === "B" ? v.blau - 1 : v.blau;
    const total = without ? n - 1 : n;
    return branch(colour === "R" ? red : blue, total);
  };
  out += line(root.x, root.y, level1.R.x, level1.R.y, "lab-thin") + line(root.x, root.y, level1.B.x, level1.B.y, "lab-thin");
  out += text((root.x + level1.R.x) / 2 - 6, (root.y + level1.R.y) / 2 - 4, branch(v.rot, n), "lab-text-small", "end");
  out += text((root.x + level1.B.x) / 2 - 6, (root.y + level1.B.y) / 2 + 14, branch(v.blau, n), "lab-text-small", "end");
  for (const key of ["RR", "RB", "BR", "BB"] as const) {
    const from = level1[key[0] as Draw];
    const to = leaves[key];
    const on = wanted.includes(key);
    out += line(from.x, from.y, to.x, to.y, on ? "lab-side-c" : "lab-thin");
    out += text((from.x + to.x) / 2, (from.y + to.y) / 2 - 4, second(key[0] as Draw, key[1] as Draw), "lab-text-small", "middle");
    out += circle(to.x, to.y, 8, key[1] === "R" ? "lab-ball-red" : "lab-ball-blue");
    out += text(to.x + 14, to.y + 4, `${key}: ${fmt(paths[key], 4)}`, on ? "lab-text lab-text-c" : "lab-text-small");
  }
  out += circle(level1.R.x, level1.R.y, 8, "lab-ball-red") + circle(level1.B.x, level1.B.y, 8, "lab-ball-blue");
  out += circle(root.x, root.y, 4, "lab-dot-small");
  out += text(160, 26, `P(${URN_EVENTS[v.event]}) = ${fmt(P, 4)} ≈ ${fmt(P * 100, 1)} %`, "lab-text lab-text-big");
  // simulation bar
  const bx = 160;
  const by = 300;
  const bw = 340;
  out += rect(bx, by, bw, 12, "lab-bar-ghost");
  out += line(bx + P * bw, by - 6, bx + P * bw, by + 18, "lab-side-c");
  if (v.n > 0) {
    const freq = v.hits / v.n;
    out += rect(bx, by, freq * bw, 12, "lab-bar-a");
    out += text(bx, by - 8, `${v.n} Versuche, ${v.hits} Treffer: relative Häufigkeit ${fmt(freq * 100, 1)} %`, "lab-text-small");
  } else {
    out += text(bx, by - 8, "Noch nicht gezogen: Starte die Simulation mit den Knöpfen.", "lab-text-small");
  }
  out += `</svg>`;
  return out;
}

// ─── 5.2 Mindestens einmal ─────────────────────────────────────────────────

export const AT_LEAST_ONCE: Record<number, { name: string; success: string }> = {
  6: { name: "Würfel", success: "eine Sechs" },
  4: { name: "Glücksrad mit 4 Feldern", success: "einen Gewinn" },
  2: { name: "Münze", success: "Kopf" },
  10: { name: "Los (jedes zehnte gewinnt)", success: "einen Gewinn" },
};

export function atLeastOnce(den: number, n: number): number {
  return 1 - (1 - 1 / den) ** n;
}

/** Runs `count` series of n tries; a hit is a series with at least one success. */
export function simulateSeries(v: LabValues, count: number): LabValues {
  const rng = createRng(v.seed);
  let hits = 0;
  for (let i = 0; i < count; i++) {
    let success = false;
    for (let k = 0; k < v.n; k++) if (rng.next() < 1 / v.den) success = true;
    if (success) hits += 1;
  }
  return { ...v, series: v.series + count, hits: v.hits + hits, seed: rng.state() };
}

function atLeastOnceView(v: LabValues): string {
  const game = AT_LEAST_ONCE[v.den];
  const P = atLeastOnce(v.den, v.n);
  const x0 = 40;
  const y0 = 280;
  const h = 200;
  const bw = 20;
  let out = open("Säulendiagramm: Wahrscheinlichkeit für mindestens einen Erfolg bei n Versuchen");
  out += line(x0, y0, x0 + 20 * (bw + 2) + 6, y0, "lab-ink");
  for (const share of [0.5, 0.9]) {
    out += line(x0, y0 - share * h, x0 + 20 * (bw + 2) + 6, y0 - share * h, "lab-dashed");
    out += text(x0 - 4, y0 - share * h + 4, `${share * 100} %`, "lab-text-tick", "end");
  }
  out += text(x0 - 4, y0 - h + 4, "100 %", "lab-text-tick", "end");
  for (let k = 1; k <= 20; k++) {
    const p = atLeastOnce(v.den, k);
    const x = x0 + 4 + (k - 1) * (bw + 2);
    out += rect(x, y0 - p * h, bw, p * h, k === v.n ? "lab-bar-c" : k < v.n ? "lab-bar-a" : "lab-bar-ghost");
    if (k % 2 === 1 || k === v.n) out += text(x + bw / 2, y0 + 14, `${k}`, k === v.n ? "lab-text-small lab-text-c" : "lab-text-tick", "middle");
  }
  out += text(x0 + 220, y0 + 30, "Anzahl der Versuche n", "lab-text-axis", "middle");
  const q = 1 - 1 / v.den;
  out += text(16, 26, `${game.name}: P(mindestens ${game.success} in ${v.n} Versuch${v.n === 1 ? "" : "en"})`, "lab-text");
  out += text(16, 48, `= 1 − P(nie) = 1 − (${fracText(v.den - 1, v.den)})${v.n === 1 ? "" : `^${v.n}`} = ${fmt(P * 100, 1)} %`, "lab-text lab-text-big");
  out += text(16, 66, `P(nie) = ${fmt(q ** v.n * 100, 1)} %: nur ein einziger Pfad im Baumdiagramm`, "lab-text-small");
  if (v.series > 0) {
    out += text(W - 16, 90, `Simulation: ${v.hits} von ${v.series} Serien = ${fmt((v.hits / v.series) * 100, 1)} %`, "lab-text-small lab-text-a", "end");
  }
  out += `</svg>`;
  return out;
}

// ─── 5.3 Vierfeldertafel: der Schnelltest ──────────────────────────────────

export interface TestTable {
  sick: number;
  healthy: number;
  truePositive: number;
  falseNegative: number;
  falsePositive: number;
  trueNegative: number;
  /** P(krank | positiv) */
  ppv: number;
}

export const POPULATION = 1000;

export function testTable(v: LabValues): TestTable {
  const sick = (POPULATION * v.prev) / 100;
  const healthy = POPULATION - sick;
  const truePositive = (sick * v.sens) / 100;
  const falsePositive = (healthy * (100 - v.spec)) / 100;
  const positives = truePositive + falsePositive;
  return {
    sick,
    healthy,
    truePositive,
    falseNegative: sick - truePositive,
    falsePositive,
    trueNegative: healthy - falsePositive,
    ppv: positives > 0 ? truePositive / positives : 0,
  };
}

function testTableView(v: LabValues): string {
  const t = testTable(v);
  const round = (x: number) => fmt(x, 1);
  const counts = [Math.round(t.truePositive), Math.round(t.sick) - Math.round(t.truePositive), Math.round(t.falsePositive)];
  let out = open("1000 Personen nach Krankheit und Testergebnis und die Vierfeldertafel");
  // 1000 dots: sick ones first (true positives, false negatives), then false positives, then the rest
  const cols = 40;
  for (let i = 0; i < POPULATION; i++) {
    const x = 18 + (i % cols) * 6.2;
    const y = 54 + Math.floor(i / cols) * 6.2;
    const cls = i < counts[0] ? "lab-dot-tp" : i < counts[0] + counts[1] ? "lab-dot-fn" : i < counts[0] + counts[1] + counts[2] ? "lab-dot-fp" : "lab-dot-tn";
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="5" height="5" rx="1" class="${cls}" />`;
  }
  out += text(18, 40, "1000 Personen", "lab-text");
  const legend: Array<[string, string]> = [["lab-dot-tp", "krank, positiv"], ["lab-dot-fn", "krank, negativ"], ["lab-dot-fp", "gesund, positiv"], ["lab-dot-tn", "gesund, negativ"]];
  legend.forEach(([cls, label], i) => {
    const lx = 18 + (i % 2) * 130;
    const ly = 222 + Math.floor(i / 2) * 18;
    out += `<rect x="${lx}" y="${ly}" width="9" height="9" rx="2" class="${cls}" />`;
    out += text(lx + 14, ly + 9, label, "lab-text-small");
  });
  // the table
  const tx = 284;
  const ty = 40;
  const cw = [58, 58, 58];
  const rows = [
    ["", "positiv", "negativ", "Summe"],
    ["krank", round(t.truePositive), round(t.falseNegative), round(t.sick)],
    ["gesund", round(t.falsePositive), round(t.trueNegative), round(t.healthy)],
    ["Summe", round(t.truePositive + t.falsePositive), round(t.falseNegative + t.trueNegative), "1000"],
  ];
  rows.forEach((row, r) => {
    row.forEach((cell, c) => {
      const x = tx + (c === 0 ? 0 : 52 + (c - 1) * cw[0]);
      const y = ty + r * 26;
      if (r > 0 && c > 0) out += rect(x - 4, y - 16, cw[0] - 4, 22, r === 3 || c === 3 ? "lab-cell-sum" : "lab-cell");
      out += text(x, y, cell, r === 0 || c === 0 ? "lab-text-small" : "lab-text");
    });
  });
  out += text(tx, 168, "P(krank | positiv)", "lab-text");
  out += text(tx, 190, `= ${round(t.truePositive)} : ${round(t.truePositive + t.falsePositive)} = ${fmt(t.ppv * 100, 1)} %`, "lab-text lab-text-big");
  out += text(tx, 216, `Anteil Kranke insgesamt: ${fmt(v.prev, 0)} %`, "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 5.4 Datenpunkte: Mittelwert, Median, Quartile ─────────────────────────

const DOTS = { x0: 40, x1: 490, base: 210, max: 30 };

function dotX(value: number): number {
  return DOTS.x0 + ((DOTS.x1 - DOTS.x0) * value) / DOTS.max;
}

export function dataValues(v: LabValues, prefix: string, count: number): number[] {
  return Array.from({ length: count }, (_, i) => v[`${prefix}${i + 1}`]);
}

function dataDots(v: LabValues): string {
  const values = dataValues(v, "v", 11);
  const m = mean(values);
  const { q1, q2, q3 } = quartiles(values);
  let out = open("Datenpunkte auf einer Wippe: Der Mittelwert ist der Schwerpunkt, der Median der mittlere Wert");
  // the plank balances on the mean
  out += rect(DOTS.x0 - 10, DOTS.base, DOTS.x1 - DOTS.x0 + 20, 6, "lab-shape-2");
  out += polygon([{ x: dotX(m), y: DOTS.base + 6 }, { x: dotX(m) - 14, y: DOTS.base + 30 }, { x: dotX(m) + 14, y: DOTS.base + 30 }], "lab-fulcrum");
  out += text(dotX(m), DOTS.base + 46, `Mittelwert ${fmt(m, 2)}`, "lab-text lab-text-b", "middle");
  for (let tick = 0; tick <= DOTS.max; tick += 5) {
    out += line(dotX(tick), DOTS.base + 6, dotX(tick), DOTS.base + 12, "lab-thin");
    out += text(dotX(tick), DOTS.base + 66, `${tick}`, "lab-text-tick", "middle");
  }
  out += line(dotX(q2), 40, dotX(q2), DOTS.base, "lab-dashed");
  out += text(dotX(q2), 34, `Median ${fmt(q2, 1)}`, "lab-text lab-text-c", "middle");
  // stacked dots, each one a handle
  const stack = new Map<number, number>();
  values.forEach((value, i) => {
    const level = stack.get(value) ?? 0;
    stack.set(value, level + 1);
    const y = DOTS.base - 12 - level * 16;
    out += handle(`v${i + 1}`, dotX(value), y, `Wert ${i + 1}: ${value}`, "lab-handle lab-handle-a");
  });
  const s = sorted(values);
  out += text(16, 316, `Rangliste: ${s.join("  ")}`, "lab-text-small");
  out += text(16, 334, `q₁ = ${fmt(q1, 1)}, Median = ${fmt(q2, 1)}, q₃ = ${fmt(q3, 1)}`, "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 5.5 Boxplot ───────────────────────────────────────────────────────────

const BOX = { x0: 40, x1: 490, max: 40 };
export const CLASS_9B = { min: 5, q1: 12, q2: 20, q3: 28, max: 38 };

function boxX(value: number): number {
  return BOX.x0 + ((BOX.x1 - BOX.x0) * value) / BOX.max;
}

function boxplotShape(f: { min: number; q1: number; q2: number; q3: number; max: number }, y: number, cls: string, label: string): string {
  let out = line(boxX(f.min), y, boxX(f.q1), y, "lab-ink") + line(boxX(f.q3), y, boxX(f.max), y, "lab-ink");
  out += line(boxX(f.min), y - 8, boxX(f.min), y + 8, "lab-ink") + line(boxX(f.max), y - 8, boxX(f.max), y + 8, "lab-ink");
  out += rect(boxX(f.q1), y - 16, boxX(f.q3) - boxX(f.q1), 32, cls);
  out += line(boxX(f.q2), y - 16, boxX(f.q2), y + 16, "lab-side-c");
  out += text(BOX.x0 - 6, y + 4, label, "lab-text-small", "end");
  return out;
}

function boxplot(v: LabValues): string {
  const values = dataValues(v, "w", 12);
  const f = fiveNumbers(values);
  let out = open("Boxplot der eigenen Daten im Vergleich mit Klasse 9b");
  out += boxplotShape(CLASS_9B, 60, "lab-fill-b", "9b");
  out += boxplotShape(f, 150, "lab-fill-a", "du");
  out += text(boxX(f.q1), 122, `q₁ ${fmt(f.q1, 1)}`, "lab-text-tick", "middle");
  out += text(boxX(f.q2), 186, `Median ${fmt(f.q2, 1)}`, "lab-text-small lab-text-c", "middle");
  out += text(boxX(f.q3), 122, `q₃ ${fmt(f.q3, 1)}`, "lab-text-tick", "middle");
  const base = 250;
  out += line(BOX.x0, base, BOX.x1, base, "lab-ink");
  for (let tick = 0; tick <= BOX.max; tick += 5) {
    out += line(boxX(tick), base, boxX(tick), base + 6, "lab-thin");
    out += text(boxX(tick), base + 20, `${tick}`, "lab-text-tick", "middle");
  }
  const stack = new Map<number, number>();
  values.forEach((value, i) => {
    const level = stack.get(value) ?? 0;
    stack.set(value, level + 1);
    out += handle(`w${i + 1}`, boxX(value), base - 12 - level * 14, `Wert ${i + 1}: ${value}`, "lab-handle lab-handle-a");
  });
  out += text(16, 316, `Box (mittlere Hälfte): ${fmt(f.q1, 1)} bis ${fmt(f.q3, 1)}, Breite ${fmt(f.q3 - f.q1, 1)}; Spannweite ${fmt(f.max - f.min, 1)}`, "lab-text-small");
  out += text(16, 334, "Jeder der vier Teile (Antenne, Boxhälfte, Boxhälfte, Antenne) enthält etwa ein Viertel der Werte.", "lab-text-small");
  out += `</svg>`;
  return out;
}

function dotHandles(prefix: string, count: number, toValue: (x: number) => number): LabView["handles"] {
  const handles: NonNullable<LabView["handles"]> = {};
  for (let i = 1; i <= count; i++) {
    const key = `${prefix}${i}`;
    handles[key] = { x: key, drag: (p) => ({ [key]: toValue(p.x) }) };
  }
  return handles;
}

export const DATEN_ZUFALL_VIEWS: Record<"urn" | "at-least-once" | "test-table" | "data-dots" | "boxplot", LabView> = {
  urn: { render: urn },
  "at-least-once": { render: atLeastOnceView },
  "test-table": { render: testTableView },
  "data-dots": { render: dataDots, handles: dotHandles("v", 11, (x) => ((x - DOTS.x0) / (DOTS.x1 - DOTS.x0)) * DOTS.max) },
  boxplot: { render: boxplot, handles: dotHandles("w", 12, (x) => ((x - BOX.x0) / (BOX.x1 - BOX.x0)) * BOX.max) },
};
