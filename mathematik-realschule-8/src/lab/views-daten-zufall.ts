import { createRng, seedFrom } from "../exercises/rng";
import type { LabValues } from "../model/types";
import { circle, close, type LabView, line, open, polygon, polar, r1, rect, sectorPath, text } from "./svg";

/**
 * Etappe 7: Daten und Zufall. Grade 8 describes the results of random
 * experiments and counts them; it computes no probabilities (M9: Laplace,
 * M10: Pfadregeln). The simulations keep only the number of trials and a
 * seed per experiment and replay the draws from the seed, so a tally, a bar
 * chart and the course of a relative frequency always come from the same
 * sequence of results.
 */

// ─── Shared helpers ────────────────────────────────────────────────────────

/** A list of results as the school writes it: "{2; 4; 6}", the empty one "{ }". */
export function setText(items: ReadonlyArray<string | number>): string {
  return items.length === 0 ? "{ }" : `{${items.join("; ")}}`;
}

/** A long list shortened to its first and last items: "{rrr; rrb; rrg; …; ggr; ggb}". */
export function shortSetText(items: readonly string[], max = 8): string {
  if (items.length <= max) return setText(items);
  return `{${items.slice(0, 3).join("; ")}; …; ${items.slice(-2).join("; ")}}`;
}

export function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** 1, 2, …, n */
export const upTo = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1);

/** The seed after "neu beginnen": a new sequence of results, still reproducible. */
export const nextSeed = (seed: number): number => seedFrom(`neu:${seed}`);

/** "1 Wurf", "20 Würfe" */
const countWord = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The pips of a die face, as offsets from its centre in units of a third of the face. */
const PIPS: Record<number, Array<[number, number]>> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** A die face with its pips, centred at (cx | cy). */
export function dieFace(cx: number, cy: number, size: number, value: number, cls = "lab-shape"): string {
  let out = rect(cx - size / 2, cy - size / 2, size, size, cls, `rx="${r1(size * 0.18)}"`);
  const d = size * 0.27;
  for (const [i, j] of PIPS[value] ?? []) out += circle(cx + i * d, cy + j * d, size * 0.085, "lab-dot-small");
  return out;
}

/** A needle from the centre of a wheel to `angle` (degrees, counter-clockwise, 0° = right). */
function needle(cx: number, cy: number, r: number, angle: number): string {
  const tip = polar(cx, cy, r, angle);
  const left = polar(cx, cy, r - 11, angle + 7);
  const right = polar(cx, cy, r - 11, angle - 7);
  return line(cx, cy, tip.x, tip.y, "lab-ink") + polygon([tip, left, right], "lab-dot-small") + circle(cx, cy, 4.5, "lab-dot-small");
}

/** A tally of `count` in groups of five (four strokes and one across), at most `max` strokes. */
function tallyMarks(x: number, y: number, count: number, max = 30): string {
  let out = "";
  const shown = Math.min(count, max);
  for (let i = 0; i < shown; i++) {
    const gx = x + Math.floor(i / 5) * 22;
    const inGroup = i % 5;
    if (inGroup < 4) out += line(gx + inGroup * 4, y - 7, gx + inGroup * 4, y + 7, "lab-thin");
    else out += line(gx - 3, y + 5, gx + 15, y - 5, "lab-thin");
  }
  if (count > max) out += text(x + 6 * 22 + 2, y + 4, "…", "lab-text-small");
  return out;
}

// ─── 7.1 Ergebnis und Ereignis ─────────────────────────────────────────────

export interface OutcomeExperiment {
  name: string;
  /** What is read off: "Augenzahl" or "Zahl". */
  noun: string;
  size: number;
  trial: string;
  trials: string;
}

export const OUTCOME_EXPERIMENTS: OutcomeExperiment[] = [
  { name: "Würfel", noun: "Augenzahl", size: 6, trial: "Wurf", trials: "Würfe" },
  { name: "Glücksrad mit 8 gleich großen Feldern", noun: "Zahl", size: 8, trial: "Drehung", trials: "Drehungen" },
];

export interface EventKind {
  label: string;
  /** Whether the slider k belongs to the statement. */
  usesK: boolean;
  test: (result: number, k: number) => boolean;
  words: (noun: string, k: number) => string;
}

/** The statements the lab offers as Ereignisse; k is the number of the slider. */
export const EVENT_KINDS: EventKind[] = [
  { label: "mindestens k", usesK: true, test: (e, k) => e >= k, words: (noun, k) => `${noun} mindestens ${k}` },
  { label: "größer als k", usesK: true, test: (e, k) => e > k, words: (noun, k) => `${noun} größer als ${k}` },
  { label: "höchstens k", usesK: true, test: (e, k) => e <= k, words: (noun, k) => `${noun} höchstens ${k}` },
  { label: "genau k", usesK: true, test: (e, k) => e === k, words: (noun, k) => `${noun} ${k}` },
  { label: "durch k teilbar", usesK: true, test: (e, k) => e % k === 0, words: (noun, k) => `${noun} durch ${k} teilbar` },
  { label: "gerade Zahl", usesK: false, test: (e) => e % 2 === 0, words: (noun) => `gerade ${noun}` },
  { label: "ungerade Zahl", usesK: false, test: (e) => e % 2 === 1, words: (noun) => `ungerade ${noun}` },
  { label: "Primzahl", usesK: false, test: (e) => isPrime(e), words: (noun) => `${noun} ist eine Primzahl` },
];

export const OUTCOME_SEEDS = [71001, 71002];

const outcomeExperiment = (v: LabValues) => OUTCOME_EXPERIMENTS[v.exp] ?? OUTCOME_EXPERIMENTS[0];

/** The Ereignis of the lab: its statement and the results that belong to it. */
export function labEvent(v: LabValues): { words: string; results: number[] } {
  const ex = outcomeExperiment(v);
  const kind = EVENT_KINDS[v.art] ?? EVENT_KINDS[0];
  return { words: kind.words(ex.noun, v.k), results: upTo(ex.size).filter((e) => kind.test(e, v.k)) };
}

/** The results of `n` trials, replayed from the experiment's seed. */
export function outcomeSeries(seed: number, n: number, size: number): number[] {
  const rng = createRng(seed);
  return Array.from({ length: Math.max(0, Math.floor(n)) }, () => rng.int(1, size));
}

/** The trials so far of the chosen experiment: the results, the tally per result and how often E occurred. */
export function outcomeRecord(v: LabValues): { series: number[]; tally: number[]; hits: number; n: number } {
  const ex = outcomeExperiment(v);
  const series = outcomeSeries(v[`s${v.exp}`], v[`n${v.exp}`], ex.size);
  const tally = Array.from({ length: ex.size + 1 }, () => 0);
  for (const e of series) tally[e] += 1;
  const { results } = labEvent(v);
  return { series, tally, hits: results.reduce((sum, e) => sum + tally[e], 0), n: series.length };
}

/** "sicheres Ereignis", "unmögliches Ereignis" or how many results belong to E. */
export function eventKindText(count: number, size: number): string {
  if (count === size) return `sicheres Ereignis, alle ${size} Ergebnisse`;
  if (count === 0) return "unmögliches Ereignis, kein Ergebnis";
  return count === 1 ? `1 von ${size} Ergebnissen` : `${count} von ${size} Ergebnissen`;
}

/** The actions of the lab: more trials of the chosen experiment, or a new tally. */
export const outcomeTrials = (v: LabValues, count: number): LabValues => ({ ...v, [`n${v.exp}`]: v[`n${v.exp}`] + count });
export const outcomeRestart = (v: LabValues): LabValues => ({ ...v, [`n${v.exp}`]: 0, [`s${v.exp}`]: nextSeed(v[`s${v.exp}`]) });

const OE = { cx: 124, cy: 168, wheelR: 92, tableX: 252, tableRight: 506, top: 84 };

function outcomeEventView(v: LabValues): string {
  const ex = outcomeExperiment(v);
  const { words, results } = labEvent(v);
  const record = outcomeRecord(v);
  const inE = (e: number) => results.includes(e);
  const last = record.n > 0 ? record.series[record.n - 1] : 0;
  let out = open(`${ex.name} mit dem Ereignis „${words}“ und einer Strichliste der Ergebnisse`);
  out += text(14, 24, `E: „${words}“`, "lab-text lab-text-big");
  const special = results.length === ex.size || results.length === 0;
  out += text(14, 44, `E = ${setText(results)}: ${eventKindText(results.length, ex.size)}`, special ? "lab-text-small lab-text-c" : "lab-text-small");

  // the experiment: six die faces or a wheel with eight fields, the fields of E in purple
  if (v.exp === 0) {
    upTo(6).forEach((e) => {
      const cx = 46 + ((e - 1) % 3) * 78;
      const cy = 106 + Math.floor((e - 1) / 3) * 82;
      out += dieFace(cx, cy, 58, e, inE(e) ? "lab-fill-c" : "lab-shape");
      if (e === last) out += rect(cx - 36, cy - 36, 72, 72, "lab-target", 'rx="14"');
    });
  } else {
    const step = 360 / ex.size;
    upTo(ex.size).forEach((e) => {
      const a0 = 90 - (e - 1) * step;
      out += `<path d="${sectorPath(OE.cx, OE.cy, OE.wheelR, a0 - step, a0)}" class="${inE(e) ? "lab-fill-c" : "lab-shape"}" />`;
      const at = polar(OE.cx, OE.cy, OE.wheelR * 0.68, a0 - step / 2);
      out += text(at.x, at.y + 5, String(e), inE(e) ? "lab-text lab-text-c" : "lab-text", "middle");
    });
    if (last > 0) out += needle(OE.cx, OE.cy, OE.wheelR * 0.86, 90 - (last - 0.5) * step);
    else out += circle(OE.cx, OE.cy, 4.5, "lab-dot-small");
  }
  if (record.n === 0) {
    out += text(OE.cx, 296, `Noch kein ${ex.trial}: Starte mit den Knöpfen.`, "lab-text-small", "middle");
  } else {
    out += text(OE.cx, 294, `Letzter ${ex.trial}: ${last}`, "lab-text", "middle");
    out += text(OE.cx, 314, inE(last) ? "E ist eingetreten." : "E ist nicht eingetreten.", inE(last) ? "lab-text lab-text-ok" : "lab-text lab-text-bad", "middle");
  }

  // the tally: one row per result, the rows of E in purple
  const rowH = ex.size === 6 ? 30 : 24;
  out += text(OE.tableX + 8, OE.top - 10, "Ergebnis", "lab-text-small");
  out += text(OE.tableX + 70, OE.top - 10, "Strichliste", "lab-text-small");
  out += text(OE.tableRight - 6, OE.top - 10, "Anzahl", "lab-text-small", "end");
  upTo(ex.size).forEach((e, i) => {
    const y = OE.top + i * rowH;
    out += rect(OE.tableX, y, OE.tableRight - OE.tableX, rowH, inE(e) ? "lab-fill-c" : "lab-cell");
    out += text(OE.tableX + 28, y + rowH / 2 + 5, String(e), inE(e) ? "lab-text lab-text-c" : "lab-text", "middle");
    out += tallyMarks(OE.tableX + 72, y + rowH / 2, record.tally[e]);
    out += text(OE.tableRight - 8, y + rowH / 2 + 5, String(record.tally[e]), "lab-text", "end");
  });
  const below = OE.top + ex.size * rowH;
  const parts = results.map((e) => record.tally[e]);
  const sum = results.length >= 2 && results.length <= 4 && record.n > 0 ? `${parts.join(" + ")} = ` : "";
  out += text(OE.tableX, below + 22, countWord(record.n, ex.trial, ex.trials), "lab-text-small");
  out += text(OE.tableX, below + 42, `E ist ${sum}${record.hits}-mal eingetreten.`, "lab-text lab-text-c");
  out += close();
  return out;
}

// ─── 7.2 Baumdiagramme ─────────────────────────────────────────────────────

/** 0 = Münze, 1 = Urne mit Zurücklegen, 2 = Urne ohne Zurücklegen. */
export const TREE_EXPERIMENTS = ["Münze werfen", "Urne: mit Zurücklegen", "Urne: ohne Zurücklegen"];

export const SYMBOL_WORDS: Record<string, string> = { K: "Kopf", Z: "Zahl", r: "rot", b: "blau", g: "grün" };

/**
 * Every ordered result of `depth` stages in the order of the tree, the first
 * symbol first. Without `counts` every stage offers every symbol (a coin,
 * drawing with replacement); with counts an urn holds counts[i] balls of
 * symbols[i] and loses the ball drawn, so a colour that is used up has no
 * branch any more.
 */
export function drawSequences(symbols: readonly string[], counts: readonly number[] | null, depth: number): string[][] {
  const out: string[][] = [];
  const walk = (prefix: string[], left: number[] | null) => {
    if (prefix.length === depth) {
      out.push(prefix);
      return;
    }
    symbols.forEach((symbol, i) => {
      if (left && left[i] <= 0) return;
      walk([...prefix, symbol], left ? left.map((c, j) => (j === i ? c - 1 : c)) : null);
    });
  };
  walk([], counts ? [...counts] : null);
  return out;
}

export interface TreeSetup {
  exp: number;
  stages: number;
  red: number;
  blue: number;
  green: number;
}

export const treeSetup = (v: LabValues): TreeSetup => ({ exp: v.exp, stages: v.stufen, red: v.rot, blue: v.blau, green: v.gruen });

/** The symbols of the first stage: K and Z, or the colours in the urn. */
export function treeSymbols(s: TreeSetup): string[] {
  if (s.exp === 0) return ["K", "Z"];
  return (["r", "b", "g"] as const).filter((_, i) => [s.red, s.blue, s.green][i] > 0);
}

const urnCounts = (s: TreeSetup) => [s.red, s.blue, s.green].filter((c) => c > 0);

/** Without replacement an urn of two balls is empty after two draws. */
export const treeDepth = (s: TreeSetup): number => (s.exp === 2 ? Math.min(s.stages, s.red + s.blue + s.green) : s.stages);

export function treePaths(s: TreeSetup): string[][] {
  return drawSequences(treeSymbols(s), s.exp === 2 ? urnCounts(s) : null, treeDepth(s));
}

/** The branches per stage when every node of a stage has the same number (Zählprinzip), else null. */
export function stageBranches(paths: readonly string[][], depth: number): number[] | null {
  const result: number[] = [];
  for (let d = 0; d < depth; d++) {
    const children = new Map<string, Set<string>>();
    for (const p of paths) {
      const key = p.slice(0, d).join("");
      if (!children.has(key)) children.set(key, new Set());
      children.get(key)!.add(p[d]);
    }
    const sizes = new Set([...children.values()].map((c) => c.size));
    if (sizes.size !== 1) return null;
    result.push([...sizes][0]);
  }
  return result;
}

export interface TreeEvent {
  label: string;
  coin: string;
  urn: string;
  /** `x` is the marked symbol: K for the coin, r for the urn. */
  test: (path: readonly string[], x: string) => boolean;
}

const countOf = (path: readonly string[], x: string) => path.filter((s) => s === x).length;

export const TREE_EVENTS: TreeEvent[] = [
  { label: "genau ein K bzw. r", coin: "genau einmal Kopf", urn: "genau eine rote Kugel", test: (p, x) => countOf(p, x) === 1 },
  { label: "mindestens ein K bzw. r", coin: "mindestens einmal Kopf", urn: "mindestens eine rote Kugel", test: (p, x) => countOf(p, x) >= 1 },
  { label: "höchstens ein K bzw. r", coin: "höchstens einmal Kopf", urn: "höchstens eine rote Kugel", test: (p, x) => countOf(p, x) <= 1 },
  { label: "kein K bzw. r", coin: "keinmal Kopf", urn: "keine rote Kugel", test: (p, x) => countOf(p, x) === 0 },
  { label: "jedes Mal dasselbe", coin: "jedes Mal dieselbe Seite", urn: "jedes Mal dieselbe Farbe", test: (p) => p.every((s) => s === p[0]) },
  { label: "zuerst K bzw. r", coin: "beim ersten Wurf Kopf", urn: "die erste Kugel ist rot", test: (p, x) => p[0] === x },
];

export const treeMark = (s: TreeSetup): string => (s.exp === 0 ? "K" : "r");

export function treeEventWords(s: TreeSetup, event: number): string {
  const e = TREE_EVENTS[event] ?? TREE_EVENTS[0];
  return s.exp === 0 ? e.coin : e.urn;
}

/** The paths of the lab's Ereignis, as strings such as "KZK". */
export function treeEventPaths(s: TreeSetup, event: number): string[] {
  const e = TREE_EVENTS[event] ?? TREE_EVENTS[0];
  return treePaths(s)
    .filter((p) => e.test(p, treeMark(s)))
    .map((p) => p.join(""));
}

/** How many paths the tree would have with replacement: (colours)^(stages). */
export const pathsWithReplacement = (s: TreeSetup): number => treeSymbols(s).length ** treeDepth(s);

/** The counting text: "2 · 2 · 2 = 8", or the plain count when the stages differ. */
export function countingText(s: TreeSetup): string {
  const paths = treePaths(s);
  const branches = stageBranches(paths, treeDepth(s));
  if (branches && branches.length > 1) return `${branches.join(" · ")} = ${paths.length}`;
  return branches ? String(paths.length) : `${paths.length} (Pfade gezählt, die Stufen haben verschieden viele Äste)`;
}

const TREE = { left: 80, right: 502, rootY: 80, leafY: 250 };
const BALL_CLASS: Record<string, string> = { r: "lab-ball-red", b: "lab-ball-blue", g: "lab-point-ok" };

function treeDiagramView(v: LabValues): string {
  const s = treeSetup(v);
  const paths = treePaths(s);
  const depth = treeDepth(s);
  const event = TREE_EVENTS[v.ereignis] ?? TREE_EVENTS[0];
  const mark = treeMark(s);
  const inE = paths.map((p) => event.test(p, mark));
  const marked = paths.filter((_, i) => inE[i]).map((p) => p.join(""));
  const L = paths.length;
  const sp = Math.min(64, (TREE.right - TREE.left) / L);
  const mid = (TREE.left + TREE.right) / 2;
  const leafX = (i: number) => mid + (i - (L - 1) / 2) * sp;
  const levelY = (d: number) => TREE.rootY + (d * (TREE.leafY - TREE.rootY)) / depth;
  const branches = stageBranches(paths, depth);

  let out = open("Baumdiagramm eines mehrstufigen Zufallsexperiments, die Pfade eines Ereignisses lila markiert");
  out += text(14, 24, branches && depth > 1 ? `Zählprinzip: ${branches.join(" · ")} = ${L} Ergebnisse` : `${L} Ergebnisse${branches ? "" : " (Pfade gezählt)"}`, "lab-text lab-text-big");
  const head = `E: „${treeEventWords(s, v.ereignis)}“ · ${marked.length} von ${L} Pfaden`;
  const list = `E = ${setText(marked)}`;
  out += text(14, 44, (head.length + list.length + 3) * 6.2 < 380 ? `${head} · ${list}` : head, "lab-text-small lab-text-c");

  // what is drawn from: the coin or the urn, top right
  if (s.exp === 0) {
    ["K", "Z"].forEach((sym, i) => {
      const cx = 450 + i * 36;
      out += circle(cx, 28, 14, "lab-cell") + text(cx, 33, sym, "lab-text", "middle");
    });
  } else {
    out += rect(400, 6, 106, 50, "lab-shape", 'rx="9"');
    const balls = [...Array(s.red).fill("r"), ...Array(s.blue).fill("b"), ...Array(s.green).fill("g")] as string[];
    const perRow = Math.ceil(balls.length / 2);
    balls.forEach((c, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      out += circle(453 - ((perRow - 1) * 15) / 2 + col * 15, 20 + row * 21, 6.5, BALL_CLASS[c]);
    });
  }

  // nodes at the mean place of their leaves, as in a drawn tree
  const nodes = new Map<string, { sum: number; count: number; depth: number; marked: boolean }>();
  paths.forEach((p, i) => {
    for (let d = 0; d <= depth; d++) {
      const key = p.slice(0, d).join("");
      const node = nodes.get(key) ?? { sum: 0, count: 0, depth: d, marked: false };
      node.sum += leafX(i);
      node.count += 1;
      node.marked = node.marked || inE[i];
      nodes.set(key, node);
    }
  });
  const at = (key: string) => {
    const node = nodes.get(key)!;
    return { x: node.sum / node.count, y: levelY(node.depth) };
  };
  let thin = "";
  let bold = "";
  for (const [key, node] of nodes) {
    if (node.depth === 0) continue;
    const from = at(key.slice(0, -1));
    const to = at(key);
    if (node.marked) bold += line(from.x, from.y, to.x, to.y, "lab-side-c");
    else thin += line(from.x, from.y, to.x, to.y, "lab-thin");
  }
  out += thin + bold;
  const root = at("");
  out += circle(root.x, root.y, 4, "lab-dot-small") + text(root.x, root.y - 9, "Start", "lab-text-small", "middle");
  const ballR = sp >= 22 ? 7 : 5.5;
  for (const [key, node] of nodes) {
    if (node.depth === 0) continue;
    const p = at(key);
    const sym = key[key.length - 1];
    if (s.exp === 0) {
      out += circle(p.x, p.y, 10, "lab-cell") + text(p.x, p.y + 4, sym, node.marked ? "lab-text-small lab-text-c" : "lab-text-small", "middle");
    } else {
      out += circle(p.x, p.y, node.depth < depth ? 7 : ballR, BALL_CLASS[sym]);
    }
  }
  for (let d = 1; d <= depth; d++) out += text(14, levelY(d) + 4, `${d}. ${s.exp === 0 ? "Wurf" : "Zug"}`, "lab-text-muted");

  // each leaf is one Ergebnis: its path in order
  const across = sp >= depth * 8 + 12;
  paths.forEach((p, i) => {
    const cls = inE[i] ? "lab-text-small lab-text-c" : "lab-text-small";
    if (across) out += text(leafX(i), TREE.leafY + 26, p.join(""), cls, "middle");
    else p.forEach((sym, j) => (out += text(leafX(i), TREE.leafY + 22 + j * 11, sym, cls, "middle")));
  });

  // with or without replacement
  let note: string;
  if (s.exp === 0) note = "Jeder Wurf hat dieselben zwei Äste: K (Kopf) und Z (Zahl).";
  else if (s.exp === 1) note = "Mit Zurücklegen ist die Urne vor jedem Zug wieder voll: Jede Stufe hat dieselben Äste.";
  else if (depth < s.stages) note = `Nur ${s.red + s.blue + s.green} Kugeln: Nach ${depth} Zügen ist die Urne leer.`;
  else {
    const full = pathsWithReplacement(s);
    note = L < full ? `Mit Zurücklegen wären es ${full} Pfade; ohne Zurücklegen fehlen ${full - L}.` : `Keine Farbe geht aus: so viele Pfade wie mit Zurücklegen (${full}).`;
  }
  out += text(14, 330, note, "lab-text-small");
  out += close();
  return out;
}

// ─── The views of the stage ────────────────────────────────────────────────

// Placeholder drawings until the stage's labs are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const DATEN_ZUFALL_VIEWS: Record<"outcome-event" | "tree-diagram" | "two-way-table" | "frequency-simulation", LabView> = {
  "outcome-event": { render: outcomeEventView },
  "tree-diagram": { render: treeDiagramView },
  "two-way-table": placeholder,
  "frequency-simulation": placeholder,
};
