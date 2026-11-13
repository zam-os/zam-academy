import { fmt, fracText } from "../exercises/format";
import { createRng } from "../exercises/rng";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, path, type Pt, rect, text } from "./svg";

// ─── Paths in the tree of an urn with red and blue balls ───────────────────

/** The colour of one draw: 0 = rot, 1 = blau. */
export type Colour = 0 | 1;

export const COLOUR_WORD = ["rot", "blau"] as const;
const COLOUR_LETTER = ["r", "b"] as const;

/** Every path of `draws` draws in the order the tree lists them from top to bottom, red first. */
export function treePaths(draws: number): Colour[][] {
  return Array.from({ length: 2 ** draws }, (_, index) =>
    Array.from({ length: draws }, (_, k) => ((index >> (draws - 1 - k)) & 1) as Colour),
  );
}

/** "rrb" for rot, rot, blau. */
export function pathKey(path: readonly Colour[]): string {
  return path.map((c) => COLOUR_LETTER[c]).join("");
}

/** The position of a path (or of the node a prefix ends in) on its level of the tree, top to bottom. */
export function pathIndex(path: readonly Colour[]): number {
  return path.reduce<number>((sum, c) => 2 * sum + c, 0);
}

function samePath(a: readonly Colour[], b: readonly Colour[]): boolean {
  return a.length === b.length && a.every((c, k) => c === b[k]);
}

/**
 * The branch after the draws in `prefix` towards `colour`, as counts: how
 * many balls of that colour are in the urn, out of how many. With
 * replacement the urn is full before every draw; without, every draw takes
 * one ball of its colour out.
 */
export function branchCount(red: number, blue: number, without: boolean, prefix: readonly Colour[], colour: Colour): [number, number] {
  if (!without) return [colour === 0 ? red : blue, red + blue];
  const redsTaken = prefix.filter((c) => c === 0).length;
  const left = colour === 0 ? red - redsTaken : blue - (prefix.length - redsTaken);
  return [Math.max(0, left), red + blue - prefix.length];
}

/**
 * A path's probability by the first path rule, as an unreduced fraction: the
 * products of the branch counts. Every path of the tree has the same
 * denominator (n · n · n, or n · (n − 1) · (n − 2) without replacement), so
 * the numerators of several paths simply add up.
 */
export function pathFraction(red: number, blue: number, without: boolean, path: readonly Colour[]): [number, number] {
  let num = 1;
  let den = 1;
  path.forEach((colour, k) => {
    const [a, n] = branchCount(red, blue, without, path.slice(0, k), colour);
    num *= a;
    den *= n;
  });
  return [num, den];
}

export function pathProbability(red: number, blue: number, without: boolean, path: readonly Colour[]): number {
  const [num, den] = pathFraction(red, blue, without, path);
  return num / den;
}

const redsIn = (path: readonly Colour[]) => path.filter((c) => c === 0).length;

/** An event of three draws: the paths it collects and the name of its complement. */
export interface TreeEvent {
  label: string;
  complement: string;
  test: (path: readonly Colour[]) => boolean;
}

export const TREE_EVENTS: TreeEvent[] = [
  { label: "drei rote", complement: "höchstens zwei rote", test: (p) => redsIn(p) === 3 },
  { label: "genau zwei rote", complement: "nicht genau zwei rote", test: (p) => redsIn(p) === 2 },
  { label: "genau eine rote", complement: "nicht genau eine rote", test: (p) => redsIn(p) === 1 },
  { label: "keine rote", complement: "mindestens eine rote", test: (p) => redsIn(p) === 0 },
  { label: "mindestens eine rote", complement: "keine rote", test: (p) => redsIn(p) >= 1 },
  { label: "höchstens eine rote", complement: "mindestens zwei rote", test: (p) => redsIn(p) <= 1 },
  { label: "mindestens zwei rote", complement: "höchstens eine rote", test: (p) => redsIn(p) >= 2 },
  { label: "alle gleichfarbig", complement: "beide Farben dabei", test: (p) => redsIn(p) === 0 || redsIn(p) === 3 },
  { label: "die erste rot", complement: "die erste blau", test: (p) => p[0] === 0 },
];

/** The paths of an event of three draws, in the tree's order. */
export function eventPaths(event: number): Colour[][] {
  return treePaths(3).filter((p) => TREE_EVENTS[event].test(p));
}

/** The probability of an event of three draws by the second path rule, as an unreduced fraction. */
export function eventFraction(red: number, blue: number, without: boolean, event: number): [number, number] {
  let num = 0;
  let den = 1;
  for (const p of treePaths(3)) {
    const [a, d] = pathFraction(red, blue, without, p);
    den = d;
    if (TREE_EVENTS[event].test(p)) num += a;
  }
  return [num, den];
}

/** "=" when the value is exact at `digits` decimals, else "≈". */
export function approx(value: number, digits: number): string {
  return Math.abs(value - Number(value.toFixed(digits))) < 1e-9 ? "=" : "≈";
}

/** "1/5 = 20 %", "4/27 ≈ 14,81 %", "0 (unmöglich)". */
export function probText(num: number, den: number): string {
  if (num === 0) return "0 (unmöglich)";
  if (num === den) return "1 (sicher)";
  const percent = (num / den) * 100;
  return `${fracText(num, den)} ${approx(percent, 2)} ${fmt(percent, 2)} %`;
}

/** The path the tree lab follows: the colours chosen for draw 1, 2 (and 3). */
export function chosenPath(v: LabValues): Colour[] {
  return [v.z1, v.z2, v.z3].slice(0, v.draws) as Colour[];
}

/**
 * Runs `count` experiments of the tree lab (two or three draws) and counts
 * how often the chosen path comes out; `last` keeps the last outcome
 * (1 + its index, 0 before the first draw).
 */
export function simulateUrn(v: LabValues, count: number): LabValues {
  const rng = createRng(v.seed);
  const wanted = chosenPath(v);
  let hits = 0;
  let last = v.last;
  for (let i = 0; i < count; i++) {
    let red = v.rot;
    let blue = v.blau;
    const drawn: Colour[] = [];
    for (let k = 0; k < v.draws; k++) {
      const colour: Colour = rng.next() < red / (red + blue) ? 0 : 1;
      drawn.push(colour);
      if (v.mode === 1) {
        if (colour === 0) red -= 1;
        else blue -= 1;
      }
    }
    if (samePath(drawn, wanted)) hits += 1;
    last = 1 + pathIndex(drawn);
  }
  return { ...v, n: v.n + count, hits: v.hits + hits, last, seed: rng.state() };
}

// ─── Drawing: urn and tree ─────────────────────────────────────────────────

/** The urn: its balls stacked by colour and a handle above each stack that sets the count. */
const URN = { left: 18, right: 132, top: 54, bottom: 212, redX: 52, blueX: 98, base: 198, step: 15 };

const urnHandleY = (count: number) => URN.base - count * URN.step;
const urnCount = (y: number) => Math.round((URN.base - y) / URN.step);

function urn(red: number, blue: number, without: boolean): string {
  const { left, right, top, bottom } = URN;
  let out = path(
    `M${left} ${top + 10} Q${left} ${top} ${left + 10} ${top} H${right - 10} Q${right} ${top} ${right} ${top + 10} V${bottom - 16} Q${right} ${bottom} ${right - 16} ${bottom} H${left + 16} Q${left} ${bottom} ${left} ${bottom - 16} Z`,
    "lab-shape",
  );
  for (let i = 0; i < red; i++) out += circle(URN.redX, URN.base - i * URN.step, 7, "lab-ball-red");
  for (let i = 0; i < blue; i++) out += circle(URN.blueX, URN.base - i * URN.step, 7, "lab-ball-blue");
  out += handle("rot", URN.redX, urnHandleY(red), `Rote Kugeln: ${red}`);
  out += handle("blau", URN.blueX, urnHandleY(blue), `Blaue Kugeln: ${blue}`);
  out += text((left + right) / 2, 230, `${red} rot, ${blue} blau`, "lab-text-small", "middle");
  out += text((left + right) / 2, 245, without ? "ohne Zurücklegen" : "mit Zurücklegen", "lab-text-small", "middle");
  return out;
}

const URN_HANDLES: NonNullable<LabView["handles"]> = {
  rot: { y: "rot", drag: (p) => ({ rot: urnCount(p.y) }) },
  blau: { y: "blau", drag: (p) => ({ blau: urnCount(p.y) }) },
};

/** x of each level of the tree (root, 1., 2., 3. draw) and the spacing of the leaves. */
const TREE_X = [188, 258, 328, 398];
const LEAF_TOP = 62;
const LEAF_STEP = 38;

/** Two draws use the places of the second level of the three-draw tree, so both trees share their root. */
function leafY(index: number, draws: number): number {
  return draws === 3 ? LEAF_TOP + index * LEAF_STEP : LEAF_TOP + (2 * index + 0.5) * LEAF_STEP;
}

/** A node sits at the mean height of the leaves below it. */
function nodeY(depth: number, index: number, draws: number): number {
  const span = 2 ** (draws - depth);
  let sum = 0;
  for (let k = 0; k < span; k++) sum += leafY(index * span + k, draws);
  return sum / span;
}

/** The probability beside a branch: above an upward branch, below a downward one. */
function branchLabel(from: Pt, to: Pt, content: string, up: boolean): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const offset = 8 + 7 * (Math.abs(dy) / len);
  // The normal on the outer side: up-left for an upward branch, down-left for a downward one.
  const nx = up ? dy / len : -dy / len;
  const ny = up ? -dx / len : dx / len;
  const mx = (from.x + to.x) / 2 + nx * offset;
  const my = (from.y + to.y) / 2 + ny * offset;
  return text(mx, my + 4, content, "lab-text-small", "middle");
}

interface TreeStyle {
  draws: number;
  red: number;
  blue: number;
  without: boolean;
  /** The class a marked path is drawn with, or null for the plain ones. */
  mark: (path: Colour[]) => string | null;
  /** The shortened tree: only the branches that lie on a marked path. */
  shortened?: boolean;
  /** A ring around this leaf (the last simulated outcome). */
  ring?: number;
}

/** The tree of two or three draws with every branch probability and, at each leaf, the path probability. */
function tree(style: TreeStyle): string {
  const { draws, red, blue, without } = style;
  const marked = new Map<string, string>();
  for (const p of treePaths(draws)) {
    const cls = style.mark(p);
    if (!cls) continue;
    for (let k = 1; k <= draws; k++) marked.set(`${k}:${pathIndex(p.slice(0, k))}`, cls);
  }
  let lines = "";
  let nodes = "";
  let labels = "";
  for (let depth = 0; depth < draws; depth++) {
    for (let index = 0; index < 2 ** depth; index++) {
      if (style.shortened && depth > 0 && !marked.has(`${depth}:${index}`)) continue;
      const prefix = treePaths(depth)[index];
      const from = { x: TREE_X[depth], y: nodeY(depth, index, draws) };
      for (const colour of [0, 1] as const) {
        const child = 2 * index + colour;
        const id = `${depth + 1}:${child}`;
        if (style.shortened && !marked.has(id)) continue;
        const to = { x: TREE_X[depth + 1], y: nodeY(depth + 1, child, draws) };
        const [a, n] = branchCount(red, blue, without, prefix, colour);
        lines += line(from.x, from.y, to.x, to.y, marked.get(id) ?? (a === 0 ? "lab-dashed" : "lab-thin"));
        labels += branchLabel(from, to, a === 0 ? "0" : `${a}/${n}`, colour === 0);
        nodes += circle(to.x, to.y, 7, colour === 0 ? "lab-ball-red" : "lab-ball-blue");
      }
    }
  }
  nodes += circle(TREE_X[0], nodeY(0, 0, draws), 4, "lab-dot-small");
  treePaths(draws).forEach((p, index) => {
    const cls = style.mark(p);
    if (style.shortened && !cls) return;
    const y = leafY(index, draws);
    const [num, den] = pathFraction(red, blue, without, p);
    const tone = cls === "lab-side-b" ? "lab-text lab-text-b" : cls ? "lab-text lab-text-c" : "lab-text-small";
    labels += text(TREE_X[draws] + 16, y + 4, `${pathKey(p)}  ${num === 0 ? "0" : `${num}/${den}`}`, tone);
    if (style.ring === index) nodes += circle(TREE_X[draws], y, 10.5, "lab-target");
  });
  return lines + nodes + labels;
}

// ─── 6.1 Mehrstufig: die Urne und ihr Baum (aus Mathematik 10 Realschule) ─────────────────────────────────

function treeUrnView(v: LabValues): string {
  const without = v.mode === 1;
  const chosen = chosenPath(v);
  const key = pathKey(chosen);
  const [num, den] = pathFraction(v.rot, v.blau, without, chosen);
  const factors = chosen.map((colour, k) => {
    const [a, n] = branchCount(v.rot, v.blau, without, chosen.slice(0, k), colour);
    return a === 0 ? "0" : `${a}/${n}`;
  });
  let out = open("Urne mit roten und blauen Kugeln und das Baumdiagramm für zwei oder drei Züge");
  out += text(14, 24, `P(${key}) = ${probText(num, den)}`, "lab-text lab-text-big");
  out += text(14, 42, `1. Pfadregel: ${factors.join(" · ")} = ${num === 0 ? "0" : `${num}/${den}`}`, "lab-text-small");
  out += urn(v.rot, v.blau, without);
  out += tree({ draws: v.draws, red: v.rot, blue: v.blau, without, mark: (p) => (samePath(p, chosen) ? "lab-side-c" : null), ring: v.last > 0 ? v.last - 1 : undefined });
  // the simulation: relative frequency of the chosen path against its probability (the purple mark)
  const P = num / den;
  const bar = { x: 18, y: 302, w: 150 };
  out += text(bar.x, 270, "Probe durch Ziehen", "lab-text");
  out += rect(bar.x, bar.y, bar.w, 11, "lab-bar-ghost");
  if (v.n > 0) {
    const freq = v.hits / v.n;
    out += text(bar.x, 288, `${v.n} Versuche, ${v.hits}-mal ${key}`, "lab-text-small");
    out += rect(bar.x, bar.y, freq * bar.w, 11, "lab-bar-a");
    out += text(bar.x, 330, `relativ ${fmt(freq * 100, 1)} %, P = ${fmt(P * 100, 1)} %`, "lab-text-small");
  } else {
    out += text(bar.x, 288, "Noch nicht gezogen.", "lab-text-small");
    out += text(bar.x, 330, `P = ${fmt(P * 100, 1)} % (lila Strich)`, "lab-text-small");
  }
  out += line(bar.x + P * bar.w, bar.y - 5, bar.x + P * bar.w, bar.y + 16, "lab-side-c");
  out += `</svg>`;
  return out;
}

// ─── 6.2 Pfadregeln: ein Ereignis sammelt Pfade (aus Mathematik 10 Realschule) ────────────────────────────

function pathRulesView(v: LabValues): string {
  const without = v.mode === 1;
  const event = TREE_EVENTS[v.event];
  const complement = v.sicht === 2;
  const [num, den] = eventFraction(v.rot, v.blau, without, v.event);
  const inside = eventPaths(v.event);
  const outside = treePaths(3).filter((p) => !event.test(p));
  const numerator = (p: Colour[]) => pathFraction(v.rot, v.blau, without, p)[0];
  const share = (a: number) => (a === 0 ? "0" : `${a}/${den}`);
  let out = open("Baumdiagramm für dreimaliges Ziehen: die Pfade eines Ereignisses und ihre Summe");
  out += text(14, 24, `P(${event.label}) = ${probText(num, den)}`, "lab-text lab-text-big");
  let rule: string;
  if (complement) {
    const rest = outside.reduce((sum, p) => sum + numerator(p), 0);
    const names = outside.map((p) => `P(${pathKey(p)})`);
    const term = outside.length === 1 ? names[0] : outside.length === 2 ? `(${names.join(" + ")})` : `(${outside.length} Pfade)`;
    rule = `Gegenereignis „${event.complement}“: P = 1 − ${term} = 1 − ${share(rest)}`;
  } else if (inside.length === 1) {
    rule = `Nur ein Pfad: P(${pathKey(inside[0])}) = ${share(num)} (1. Pfadregel)`;
  } else if (inside.length <= 4) {
    rule = `2. Pfadregel: ${inside.map((p) => share(numerator(p))).join(" + ")} = ${share(num)}`;
  } else {
    rule = `2. Pfadregel: ${inside.length} Pfade addieren, oder schneller: 1 − P(${event.complement})`;
  }
  out += text(14, 42, rule, "lab-text-small");
  out += urn(v.rot, v.blau, without);
  out += tree({
    draws: 3,
    red: v.rot,
    blue: v.blau,
    without,
    mark: (p) => (complement ? (event.test(p) ? null : "lab-side-b") : event.test(p) ? "lab-side-c" : null),
    shortened: v.sicht === 1,
  });
  // the event and its complement share the whole probability 1
  const P = num / den;
  const bar = { x: 18, y: 296, w: 150 };
  out += text(bar.x, 270, `E: ${event.label}`, "lab-text-small lab-text-c");
  out += text(bar.x, 286, `Ē: ${event.complement}`, "lab-text-small lab-text-b");
  out += rect(bar.x, bar.y, P * bar.w, 12, "lab-fill-c");
  out += rect(bar.x + P * bar.w, bar.y, (1 - P) * bar.w, 12, "lab-fill-b");
  out += text(bar.x, 326, `P(E) + P(Ē) = ${fmt(P * 100, 1)} % + ${fmt((1 - P) * 100, 1)} % = 100 %`, "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 6.4 Fehldeutungen: der Schnelltest (aus Mathematik 9 Realschule) ──────────────────────────────────

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
  out += text(tx, 168, "Anteil Kranker unter den Positiven", "lab-text");
  out += text(tx, 190, `= ${round(t.truePositive)} : ${round(t.truePositive + t.falsePositive)} = ${fmt(t.ppv * 100, 1)} %`, "lab-text lab-text-big");
  out += text(tx, 216, `Anteil Kranke insgesamt: ${fmt(v.prev, 0)} %`, "lab-text-small");
  out += `</svg>`;
  return out;
}

// ─── 6.3 Permutationen: Reihenfolgen zählen ────────────────────────────────

/** The people of lesson 6.3, one letter each. */
export const PEOPLE = ["Anna", "Ben", "Cem", "Dila", "Emil", "Finn", "Gül"];

/** n! for small whole n. */
export function factorial(n: number): number {
  let product = 1;
  for (let k = 2; k <= n; k++) product *= k;
  return product;
}

/** The orders of n people; with `fixed` the first one always sits in seat 1. */
export function arrangements(n: number, fixed: boolean): string[] {
  const letters = PEOPLE.slice(0, n).map((name) => name[0]);
  const out: string[] = [];
  const walk = (prefix: string, rest: string[]) => {
    if (rest.length === 0) out.push(prefix);
    rest.forEach((letter, i) => walk(prefix + letter, [...rest.slice(0, i), ...rest.slice(i + 1)]));
  };
  if (fixed) walk(letters[0], letters.slice(1));
  else walk("", letters);
  return out;
}

/** The number of choices for each seat, left to right. */
export function seatChoices(n: number, fixed: boolean): number[] {
  return Array.from({ length: n }, (_, i) => (fixed ? (i === 0 ? 1 : n - i) : n - i));
}

const PERM = { x0: 60, y: 86, step: 62 };

function permutationsView(v: LabValues): string {
  const fixed = v.fixed === 1;
  const choices = seatChoices(v.n, fixed);
  const count = choices.reduce((a, b) => a * b, 1);
  let out = open(`${v.n} Personen auf ${v.n} Plätzen: ${count} Reihenfolgen`);
  out += text(14, 24, `${choices.join(" · ")} = ${fmt(count)}${fixed ? "" : ` = ${v.n}!`}`, "lab-text lab-text-big");
  out += text(14, 44, fixed ? `${PEOPLE[0]} sitzt immer auf Platz 1, die anderen ${v.n - 1} wechseln.` : "Für Platz 1 gibt es n Möglichkeiten, für Platz 2 eine weniger, …", "lab-text-small");
  for (let i = 0; i < v.n; i++) {
    const x = PERM.x0 + i * PERM.step;
    out += rect(x - 24, PERM.y - 22, 48, 44, i === 0 && fixed ? "lab-fill-ok" : "lab-fill-a", 'rx="8"');
    out += text(x, PERM.y + 6, PEOPLE[i][0], "lab-text lab-text-big", "middle");
    out += text(x, PERM.y + 40, `Platz ${i + 1}`, "lab-text-tick", "middle");
    out += circle(x, PERM.y + 66, 13, "lab-fill-b");
    out += text(x, PERM.y + 71, String(choices[i]), "lab-text", "middle");
    if (i < v.n - 1) out += text(x + PERM.step / 2, PERM.y + 71, "·", "lab-text", "middle");
  }
  out += text(14, PERM.y + 71, "Wahl:", "lab-text-small");
  const list = arrangements(v.n, fixed);
  const top = 196;
  if (list.length <= 24) {
    out += text(14, top, `Alle ${list.length} Reihenfolgen:`, "lab-text-small");
    list.forEach((word, i) => {
      const col = Math.floor(i / 6);
      const row = i % 6;
      out += text(24 + col * 84, top + 20 + row * 20, word, "lab-text-c");
    });
  } else {
    out += text(14, top, `${fmt(list.length)} Reihenfolgen: zu viele zum Aufschreiben.`, "lab-text-small");
    out += text(14, top + 22, `Die ersten: ${list.slice(0, 4).join(", ")}, …`, "lab-text-c");
    out += text(14, top + 44, "Darum rechnet man mit dem Produkt statt zu zählen.", "lab-text-small");
  }
  out += handle("n", PERM.x0 + (v.n - 1) * PERM.step + 34, PERM.y, `Anzahl Personen: ${v.n}`);
  return out + "</svg>";
}

export const ZUFALL_VIEWS: Record<string, LabView> = {
  "tree-urn": { render: treeUrnView, handles: URN_HANDLES },
  "path-rules": { render: pathRulesView, handles: URN_HANDLES },
  permutations: {
    render: permutationsView,
    handles: { n: { x: "n", drag: (p) => ({ n: Math.round((p.x - PERM.x0 - 34) / PERM.step) + 1 }) } },
  },
  "test-table": { render: testTableView },
};
