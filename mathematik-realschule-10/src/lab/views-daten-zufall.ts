import { fmt, fracText } from "../exercises/format";
import { createRng } from "../exercises/rng";
import type { LabValues } from "../model/types";
import { circle, esc, handle, type LabView, line, open, path, type Pt, r1, rect, text } from "./svg";

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

// ─── Mindestens einmal ─────────────────────────────────────────────────────

/** P(at least one success in n independent tries) = 1 − (1 − p)ⁿ. */
export function atLeastOnce(p: number, n: number): number {
  return 1 - (1 - p) ** n;
}

/** The bound of (1 − p)ⁿ ≤ 1 − target: n ≥ log₍₁₋ₚ₎(1 − target). */
export function triesBound(p: number, target: number): number {
  return Math.log(1 - target) / Math.log(1 - p);
}

/** The smallest n with 1 − (1 − p)ⁿ ≥ target, checked by the probabilities themselves (0 < p, target < 1). */
export function minTries(p: number, target: number): number {
  let n = Math.max(1, Math.ceil(triesBound(p, target) - 1e-9));
  while (n > 1 && atLeastOnce(p, n - 1) >= target - 1e-12) n -= 1;
  while (atLeastOnce(p, n) < target - 1e-12) n += 1;
  return n;
}

/** Runs `count` series of n tries with success probability p %; a hit is a series with at least one success. */
export function simulateSeries(v: LabValues, count: number): LabValues {
  const rng = createRng(v.seed);
  let hits = 0;
  for (let i = 0; i < count; i++) {
    let success = false;
    for (let k = 0; k < v.n; k++) if (rng.next() < v.p / 100) success = true;
    if (success) hits += 1;
  }
  return { ...v, series: v.series + count, hits: v.hits + hits, seed: rng.state() };
}

// ─── Drawing: urn and tree ─────────────────────────────────────────────────

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** An exponent in superscript digits: sup(11) → "¹¹". */
export function sup(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUPERSCRIPT[Number(d)])
    .join("");
}

/** A line of text with subscripts (the base of a logarithm): parts are [content, isSubscript]. */
function richText(x: number, y: number, parts: Array<[string, boolean]>, cls: string): string {
  let inner = "";
  let low = false;
  for (const [content, subscript] of parts) {
    const dy = subscript === low ? "" : ` dy="${subscript ? 3.5 : -3.5}"`;
    const size = subscript ? ' font-size="8.5"' : "";
    inner += `<tspan${dy}${size}>${esc(content)}</tspan>`;
    low = subscript;
  }
  return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="start">${inner}</text>`;
}

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
    labels += text(TREE_X[draws] + 13, y + 4, `${pathKey(p)}  ${num === 0 ? "0" : `${num}/${den}`}`, tone);
    if (style.ring === index) nodes += circle(TREE_X[draws], y, 11.5, "lab-target");
  });
  return lines + nodes + labels;
}

// ─── 8.1 Mehrstufig: die Urne und ihr Baum ─────────────────────────────────

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

// ─── 8.2 Pfadregeln: ein Ereignis sammelt Pfade ────────────────────────────

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

// ─── 8.3 Mindestens einmal: wie oft? ───────────────────────────────────────

const PLOT = { x0: 46, x1: 484, y0: 300, y1: 72, nMax: 60 };
const plotX = (n: number) => PLOT.x0 + ((PLOT.x1 - PLOT.x0) * n) / PLOT.nMax;
const plotY = (percent: number) => PLOT.y0 - ((PLOT.y0 - PLOT.y1) * percent) / 100;
const TARGET_HANDLE_X = 503;

function atLeastView(v: LabValues): string {
  const p = v.p / 100;
  const target = v.ziel / 100;
  const q = 1 - p;
  const P = atLeastOnce(p, v.n);
  const need = minTries(p, target);
  const bound = triesBound(p, target);
  let out = open("Säulendiagramm: Wahrscheinlichkeit für mindestens einen Erfolg bei n Versuchen, mit Ziellinie");
  out += text(14, 22, `P(mindestens einmal) = 1 − ${fmt(q, 2)}${sup(v.n)} ${approx(P * 100, 2)} ${fmt(P * 100, 2)} %`, "lab-text lab-text-big");
  out += richText(
    14,
    40,
    [
      [`Ziel ${v.ziel} %: ${fmt(q, 2)}ⁿ ≤ ${fmt(1 - target, 2)}  ⇒  n ≥ log`, false],
      [fmt(q, 2), true],
      [`(${fmt(1 - target, 2)}) ${approx(bound, 2)} ${fmt(bound, 2)}  ⇒  n = ${need}`, false],
    ],
    "lab-text-small",
  );
  if (v.series > 0) {
    out += text(14, 57, `Simulation: ${v.hits} von ${v.series} Serien mit mindestens einem Erfolg (${fmt((v.hits / v.series) * 100, 1)} %)`, "lab-text-small lab-text-a");
  }
  // axes and grid
  for (const percent of [25, 50, 75, 100]) {
    out += line(PLOT.x0, plotY(percent), PLOT.x1 + 6, plotY(percent), "lab-grid");
    out += text(PLOT.x0 - 5, plotY(percent) + 4, `${percent} %`, "lab-text-tick", "end");
  }
  out += line(PLOT.x0, PLOT.y0, PLOT.x1 + 6, PLOT.y0, "lab-ink");
  for (let k = 10; k <= PLOT.nMax; k += 10) out += text(plotX(k), PLOT.y0 + 14, `${k}`, "lab-text-tick", "middle");
  out += text((PLOT.x0 + PLOT.x1) / 2, PLOT.y0 + 34, "Anzahl der Versuche n", "lab-text-axis", "middle");
  // one bar per n: before the current n, the current one, the first n that reaches the target
  const width = ((PLOT.x1 - PLOT.x0) / PLOT.nMax) * 0.7;
  for (let k = 1; k <= PLOT.nMax; k++) {
    const share = atLeastOnce(p, k) * 100;
    const cls = k === v.n ? "lab-bar-c" : k === need ? "lab-bar-ok" : k < v.n ? "lab-bar-a" : "lab-bar-ghost";
    out += rect(plotX(k) - width / 2, plotY(share), width, plotY(0) - plotY(share), cls);
  }
  // P(nie) is the rest of the current bar up to 100 %
  out += line(plotX(v.n) + width, plotY(P * 100), plotX(v.n) + width, plotY(100), "lab-side-b");
  // the target line and the first n on or above it
  out += line(PLOT.x0, plotY(v.ziel), TARGET_HANDLE_X, plotY(v.ziel), "lab-dashed");
  out += text(TARGET_HANDLE_X - 12, plotY(v.ziel) - 8, `Ziel ${v.ziel} %`, "lab-text-small", "end");
  if (need <= PLOT.nMax) {
    out += text(plotX(need), PLOT.y0 + 24, `n = ${need}`, "lab-text-small lab-text-ok", "middle");
  } else {
    out += text(PLOT.x1, PLOT.y0 + 24, `Ziel erst ab n = ${need}`, "lab-text-small lab-text-ok", "end");
  }
  out += handle("n", plotX(v.n), plotY(P * 100), `Versuche n = ${v.n}`);
  out += handle("ziel", TARGET_HANDLE_X, plotY(v.ziel), `Ziel ${v.ziel} %`, "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

export const DATEN_ZUFALL_VIEWS: Record<"tree-urn" | "path-rules" | "at-least", LabView> = {
  "tree-urn": { render: treeUrnView, handles: URN_HANDLES },
  "path-rules": { render: pathRulesView, handles: URN_HANDLES },
  "at-least": {
    render: atLeastView,
    handles: {
      n: { x: "n", drag: (p) => ({ n: Math.round(((p.x - PLOT.x0) / (PLOT.x1 - PLOT.x0)) * PLOT.nMax) }) },
      ziel: { y: "ziel", drag: (p) => ({ ziel: Math.round(((PLOT.y0 - p.y) / (PLOT.y0 - PLOT.y1)) * 100) }) },
    },
  },
};
