import { fmt } from "../exercises/format";
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

// ─── 7.3 Vierfeldertafeln ──────────────────────────────────────────────────

/** The four cells: a Mädchen mit Brille, b Mädchen ohne Brille, c Jungen mit Brille, d Jungen ohne Brille. */
export interface Table4 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export const tableOf = (v: LabValues): Table4 => ({ a: v.a, b: v.b, c: v.c, d: v.d });

/** The Ereignisse the lab marks: the cells a, b, c, d that belong to each. */
export const TABLE_EVENTS: Array<{ label: string; cells: [boolean, boolean, boolean, boolean] }> = [
  { label: "Mädchen und Brille", cells: [true, false, false, false] },
  { label: "Mädchen oder Brille", cells: [true, true, true, false] },
  { label: "Junge und keine Brille", cells: [false, false, false, true] },
  { label: "Junge oder keine Brille", cells: [false, true, true, true] },
];

export function tableEventCount(t: Table4, event: number): number {
  const cells = [t.a, t.b, t.c, t.d];
  return (TABLE_EVENTS[event] ?? TABLE_EVENTS[0]).cells.reduce((sum, on, i) => sum + (on ? cells[i] : 0), 0);
}

/** How the count of an Ereignis comes about: one cell, or three cells and the sums with the shared cell taken off once. */
export function tableEventSum(t: Table4, event: number): string {
  const n = tableEventCount(t, event);
  if (event === 0) return `${t.a}`;
  if (event === 2) return `${t.d}`;
  if (event === 1) return `${t.a} + ${t.b} + ${t.c} = ${n} oder ${t.a + t.b} + ${t.a + t.c} − ${t.a} = ${n}`;
  return `${t.b} + ${t.c} + ${t.d} = ${n} oder ${t.c + t.d} + ${t.b + t.d} − ${t.d} = ${n}`;
}

/** "8 von 28 ≈ 28,6 %"; "=" when the percentage ends after one decimal. */
export function shareText(part: number, whole: number): string {
  if (whole === 0) return "niemand in der Gruppe";
  const percent = (100 * part) / whole;
  const exact = Math.abs(percent * 10 - Math.round(percent * 10)) < 1e-9;
  return `${part} von ${whole} ${exact ? "=" : "≈"} ${fmt(percent, 1)} %`;
}

/** Same share with glasses among girls and boys, but groups of different size and a share strictly between 0 and 1. */
export const sameShare = (t: Table4): boolean => t.a > 0 && t.b > 0 && t.a + t.b !== t.c + t.d && t.a * (t.c + t.d) === t.c * (t.a + t.b);

/** More boys than girls with glasses, but a larger share among the girls. */
export const moreButSmallerShare = (t: Table4): boolean => t.c > t.a && t.a + t.b > 0 && t.a * (t.c + t.d) > t.c * (t.a + t.b);

const TT = { x: 14, y: 64, cols: [86, 64, 64, 56], rows: [26, 34, 34, 34] };

function twoWayTableView(v: LabValues): string {
  const t = tableOf(v);
  const event = v.ereignis;
  const marks = (TABLE_EVENTS[event] ?? TABLE_EVENTS[0]).cells;
  const girls = t.a + t.b;
  const boys = t.c + t.d;
  const glasses = t.a + t.c;
  const none = t.b + t.d;
  const total = girls + boys;
  let out = open("Vierfeldertafel zu Geschlecht und Brille, Anteile als Balken und der passende Häufigkeitsbaum");
  out += text(14, 24, `${TABLE_EVENTS[event].label}: ${tableEventCount(t, event)} Jugendliche`, "lab-text lab-text-big");
  out += text(14, 44, event === 1 || event === 3 ? tableEventSum(t, event) : `ein einziges Feld der Tafel: ${tableEventSum(t, event)}`, "lab-text-small lab-text-c");

  // the table: four cells, their row and column sums and the total
  const xs = [TT.x];
  for (const w of TT.cols) xs.push(xs[xs.length - 1] + w);
  const ys = [TT.y];
  for (const h of TT.rows) ys.push(ys[ys.length - 1] + h);
  const cell = (col: number, row: number, content: string, box: string, cls = "lab-text") =>
    rect(xs[col], ys[row], TT.cols[col], TT.rows[row], box) + text(xs[col] + TT.cols[col] / 2, ys[row] + TT.rows[row] / 2 + 5, content, cls, "middle");
  out += cell(0, 0, "", "lab-cell-sum") + cell(1, 0, "mit Brille", "lab-cell-sum", "lab-text-small") + cell(2, 0, "ohne Brille", "lab-cell-sum", "lab-text-small") + cell(3, 0, "Summe", "lab-cell-sum", "lab-text-small");
  out += cell(0, 1, "Mädchen", "lab-cell-sum") + cell(0, 2, "Jungen", "lab-cell-sum") + cell(0, 3, "Summe", "lab-cell-sum", "lab-text-small");
  const inner: Array<[number, number, number]> = [
    [1, 1, t.a],
    [2, 1, t.b],
    [1, 2, t.c],
    [2, 2, t.d],
  ];
  inner.forEach(([col, row, n], i) => (out += cell(col, row, String(n), marks[i] ? "lab-fill-c" : "lab-cell", marks[i] ? "lab-text lab-text-c" : "lab-text")));
  out += cell(3, 1, String(girls), "lab-cell-sum") + cell(3, 2, String(boys), "lab-cell-sum");
  out += cell(1, 3, String(glasses), "lab-cell-sum") + cell(2, 3, String(none), "lab-cell-sum") + cell(3, 3, String(total), "lab-cell-sum", "lab-text lab-text-big");

  // the shares with glasses in both groups
  const barX = 14;
  const barW = 190;
  out += text(barX, 216, "Anteil mit Brille", "lab-text");
  const rows: Array<[string, number, number, string]> = [
    ["Mädchen", t.a, girls, "lab-bar-a"],
    ["Jungen", t.c, boys, "lab-bar-b"],
  ];
  rows.forEach(([name, part, whole, cls], i) => {
    const y = 236 + i * 40;
    out += text(barX, y, `${name}: ${shareText(part, whole)}`, "lab-text-small");
    out += rect(barX, y + 6, barW, 12, "lab-bar-ghost");
    if (whole > 0) out += rect(barX, y + 6, (barW * part) / whole, 12, cls);
  });
  if (girls > 0 && boys > 0) {
    const absolute = t.a === t.c ? "gleich viele mit Brille" : `mehr mit Brille: ${t.a > t.c ? "Mädchen" : "Jungen"}`;
    const cross = t.a * boys - t.c * girls;
    const relative = cross === 0 ? "gleicher Anteil" : `größerer Anteil: ${cross > 0 ? "Mädchen" : "Jungen"}`;
    out += text(barX, 326, `${absolute} · ${relative}`, "lab-text-small");
  }

  // the frequency tree: first by Geschlecht or first by Brille
  const byGlasses = v.baum === 1;
  const first: Array<[string, number]> = byGlasses ? [["mit Brille", glasses], ["ohne Brille", none]] : [["Mädchen", girls], ["Jungen", boys]];
  const leaves: Array<[string, number, boolean]> = byGlasses
    ? [["Mädchen", t.a, marks[0]], ["Jungen", t.c, marks[2]], ["Mädchen", t.b, marks[1]], ["Jungen", t.d, marks[3]]]
    : [["mit Brille", t.a, marks[0]], ["ohne Brille", t.b, marks[1]], ["mit Brille", t.c, marks[2]], ["ohne Brille", t.d, marks[3]]];
  const rootP = { x: 404, y: 96 };
  const firstP = [{ x: 350, y: 168 }, { x: 458, y: 168 }];
  const leafP = [322, 378, 430, 486].map((x) => ({ x, y: 244 }));
  out += text(rootP.x, 66, "Häufigkeitsbaum", "lab-text-muted", "middle");
  const box = (p: { x: number; y: number }, n: number, cls = "lab-cell", tcls = "lab-text") => rect(p.x - 21, p.y - 12, 42, 24, cls, 'rx="6"') + text(p.x, p.y + 5, String(n), tcls, "middle");
  firstP.forEach((p) => (out += line(rootP.x, rootP.y + 12, p.x, p.y - 12, "lab-thin")));
  leafP.forEach((p, i) => (out += line(firstP[Math.floor(i / 2)].x, firstP[Math.floor(i / 2)].y + 12, p.x, p.y - 12, "lab-thin")));
  out += text((rootP.x + firstP[0].x) / 2 - 8, (rootP.y + firstP[0].y) / 2 + 2, first[0][0], "lab-text-small", "end");
  out += text((rootP.x + firstP[1].x) / 2 + 8, (rootP.y + firstP[1].y) / 2 + 2, first[1][0], "lab-text-small", "start");
  out += box(rootP, total, "lab-cell-sum", "lab-text lab-text-big");
  firstP.forEach((p, i) => (out += box(p, first[i][1], "lab-cell-sum")));
  leafP.forEach((p, i) => {
    const [name, n, on] = leaves[i];
    out += box(p, n, on ? "lab-fill-c" : "lab-cell", on ? "lab-text lab-text-c" : "lab-text");
    const words = name.split(" ");
    words.forEach((w, j) => (out += text(p.x, p.y + 28 + j * 12, w, "lab-text-small", "middle")));
  });
  out += text(rootP.x, 316, `Probe: ${t.a} + ${t.b} + ${t.c} + ${t.d} = ${total}`, "lab-text-small", "middle");
  out += close();
  return out;
}

// ─── 7.4 Absolute und relative Häufigkeiten ────────────────────────────────

export interface Game {
  name: string;
  outcomes: string[];
  /** Hidden from the learner: how the replay draws. Empty for the two wheels. */
  weights: number[];
  /** The outcome whose relative frequency the lab follows. */
  focus: number;
  trial: string;
  trials: string;
}

export const GAMES: Game[] = [
  { name: "normaler Spielwürfel", outcomes: ["1", "2", "3", "4", "5", "6"], weights: [1, 1, 1, 1, 1, 1].map((w) => w / 6), focus: 5, trial: "Wurf", trials: "Würfe" },
  { name: "Würfel aus dem Fundbüro", outcomes: ["1", "2", "3", "4", "5", "6"], weights: [0.1, 0.16, 0.16, 0.16, 0.16, 0.26], focus: 5, trial: "Wurf", trials: "Würfe" },
  { name: "Reißnagel", outcomes: ["Spitze oben", "Seitenlage"], weights: [0.38, 0.62], focus: 0, trial: "Wurf", trials: "Würfe" },
  { name: "Glücksräder A und B", outcomes: ["Gewinn A", "Gewinn B"], weights: [], focus: 0, trial: "Drehung", trials: "Drehungen" },
];

export const GAME_SEEDS = [74001, 74002, 74003, 74004];

/** The winning fields of the wheels, in degrees clockwise from the top: A one quarter, B three eighths in three pieces. */
export const WHEEL_A: Array<[number, number]> = [[0, 90]];
export const WHEEL_B: Array<[number, number]> = [[0, 45], [120, 165], [240, 285]];
const inFields = (angle: number, fields: Array<[number, number]>) => fields.some(([a, b]) => angle >= a && angle < b);

export interface GameRecord {
  n: number;
  /** Per outcome; for the wheels the wins of A and of B. */
  counts: number[];
  /** The relative frequency of the followed outcome after each trial; for the wheels one row per wheel. */
  history: number[][];
  /** The last outcome, or for the wheels the last two angles; empty before the first trial. */
  last: number[];
}

/** Replays `n` trials of a game from its seed. */
export function gameRecord(game: number, seed: number, n: number): GameRecord {
  const g = GAMES[game] ?? GAMES[0];
  const rng = createRng(seed);
  const trials = Math.max(0, Math.floor(n));
  if (game === 3) {
    const counts = [0, 0];
    const history: number[][] = [[], []];
    let last: number[] = [];
    for (let t = 0; t < trials; t++) {
      const a = rng.next() * 360;
      const b = rng.next() * 360;
      if (inFields(a, WHEEL_A)) counts[0] += 1;
      if (inFields(b, WHEEL_B)) counts[1] += 1;
      history[0].push(counts[0] / (t + 1));
      history[1].push(counts[1] / (t + 1));
      last = [a, b];
    }
    return { n: trials, counts, history, last };
  }
  const counts = g.outcomes.map(() => 0);
  const history: number[][] = [[]];
  let last: number[] = [];
  for (let t = 0; t < trials; t++) {
    const u = rng.next();
    let acc = 0;
    let outcome = g.weights.length - 1;
    for (let i = 0; i < g.weights.length; i++) {
      acc += g.weights[i];
      if (u < acc) {
        outcome = i;
        break;
      }
    }
    counts[outcome] += 1;
    history[0].push(counts[g.focus] / (t + 1));
    last = [outcome];
  }
  return { n: trials, counts, history, last };
}

export const gameOf = (v: LabValues, game: number = v.spiel): GameRecord => gameRecord(game, v[`s${game}`], v[`n${game}`]);

/** The relative frequency of the followed outcome (game 0 to 2) or of a wheel's win (wheel 0 = A, 1 = B); 0 before any trial. */
export function relFreq(record: GameRecord, index = 0): number {
  return record.n > 0 ? record.counts[index] / record.n : 0;
}

/** "52 : 300 ≈ 0,17"; "=" when the decimal ends after two places. */
export function relText(count: number, n: number): string {
  const h = count / n;
  const exact = Math.abs(h * 100 - Math.round(h * 100)) < 1e-9;
  return `${count} : ${n} ${exact ? "=" : "≈"} ${fmt(h, 2)}`;
}

/** The wheel whose wins are more frequent so far: 1 = A, 2 = B, 0 = level or no data. */
export function wheelLeader(record: GameRecord): number {
  if (record.n === 0 || record.counts[0] === record.counts[1]) return 0;
  return record.counts[0] > record.counts[1] ? 1 : 2;
}

/** The smallest and largest relative frequency in the second half of the trials, from the 10th trial on. */
export function fluctuation(history: readonly number[]): [number, number] | null {
  if (history.length < 20) return null;
  const tail = history.slice(Math.floor(history.length / 2));
  return [Math.min(...tail), Math.max(...tail)];
}

export const gameTrials = (v: LabValues, count: number): LabValues => ({ ...v, [`n${v.spiel}`]: v[`n${v.spiel}`] + count });
export const gameRestart = (v: LabValues): LabValues => ({ ...v, [`n${v.spiel}`]: 0, [`s${v.spiel}`]: nextSeed(v[`s${v.spiel}`]) });

/** A thumbtack on the table: point up, or on its side resting on the rim of its head and its point. */
function thumbtack(cx: number, base: number, side: boolean, cls: string): string {
  let out = line(cx - 30, base + 1, cx + 30, base + 1, "lab-thin");
  if (!side) {
    out += line(cx - 15, base - 2, cx + 15, base - 2, cls);
    out += line(cx, base - 4, cx, base - 40, "lab-ink");
    return out;
  }
  // tan θ = pin length : half the head, so that rim and point both touch the table
  const theta = Math.atan(40 / 16);
  const p = { x: cx - 22, y: base - 2 };
  const q = { x: p.x + 32 * Math.cos(theta), y: p.y - 32 * Math.sin(theta) };
  const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  out += line(p.x, p.y, q.x, q.y, cls);
  out += line(m.x, m.y, m.x + 40 * Math.sin(theta), m.y + 40 * Math.cos(theta), "lab-ink");
  return out;
}

/** A wheel with its winning fields in green and the needle at the last angle (degrees clockwise from the top). */
function luckyWheel(cx: number, cy: number, r: number, fields: Array<[number, number]>, angle: number | null): string {
  let out = circle(cx, cy, r, "lab-shape");
  for (const [a, b] of fields) out += `<path d="${sectorPath(cx, cy, r, 90 - b, 90 - a)}" class="lab-fill-ok" />`;
  out += angle === null ? circle(cx, cy, 3.5, "lab-dot-small") : needle(cx, cy, r * 0.86, 90 - angle);
  return out;
}

const BARS = { x0: 192, x1: 506, top: 46, bottom: 146 };
const COURSE = { x0: 46, x1: 506, top: 214, bottom: 314 };

function frequencySimulationView(v: LabValues): string {
  const game = GAMES[v.spiel] ?? GAMES[0];
  const record = gameOf(v);
  const wheels = v.spiel === 3;
  const focusLabel = game.outcomes[game.focus];
  let out = open(`${game.name}: absolute und relative Häufigkeiten als Säulen und der Verlauf der relativen Häufigkeit`);

  // the result so far, in one line
  let head: string;
  if (record.n === 0) head = "Noch kein Versuch: Starte mit den Knöpfen.";
  else if (wheels) head = `n = ${record.n} · h(Gewinn A) ≈ ${fmt(relFreq(record, 0), 2)} · h(Gewinn B) ≈ ${fmt(relFreq(record, 1), 2)}`;
  else head = `n = ${record.n} · H(${focusLabel}) = ${record.counts[game.focus]} · h ${relText(record.counts[game.focus], record.n).replace(/^\d+ : \d+ /, "")}`;
  out += text(14, 24, head, "lab-text lab-text-big");

  // the object: die, thumbtack or the two wheels, with the last result
  if (v.spiel <= 1) {
    out += dieFace(80, 92, 62, record.n > 0 ? record.last[0] + 1 : 6, record.n > 0 ? "lab-shape" : "lab-shape-2");
    out += text(80, 146, record.n > 0 ? `letzter Wurf: ${record.last[0] + 1}` : "noch nicht geworfen", "lab-text-small", "middle");
    out += text(80, 164, v.spiel === 0 ? "normaler Würfel" : "aus dem Fundbüro", "lab-text-muted", "middle");
  } else if (v.spiel === 2) {
    const last = record.n > 0 ? record.last[0] : -1;
    out += thumbtack(46, 110, false, last === 0 ? "lab-side-c" : "lab-side-b");
    out += thumbtack(116, 110, true, last === 1 ? "lab-side-c" : "lab-side-b");
    out += text(46, 132, "Spitze oben", last === 0 ? "lab-text-small lab-text-c" : "lab-text-small", "middle");
    out += text(116, 132, "Seitenlage", last === 1 ? "lab-text-small lab-text-c" : "lab-text-small", "middle");
    out += text(80, 160, record.n > 0 ? `letzter Wurf: ${game.outcomes[last]}` : "noch nicht geworfen", "lab-text-small", "middle");
  } else {
    out += luckyWheel(46, 92, 31, WHEEL_A, record.n > 0 ? record.last[0] : null);
    out += luckyWheel(116, 92, 31, WHEEL_B, record.n > 0 ? record.last[1] : null);
    out += text(46, 140, "Rad A", "lab-text lab-text-a", "middle");
    out += text(116, 140, "Rad B", "lab-text lab-text-b", "middle");
    out += text(80, 160, "grün: Gewinn", "lab-text-small", "middle");
  }

  // the bars: relative frequency on the axis, absolute frequency on top
  const yBar = (h: number) => BARS.bottom - (BARS.bottom - BARS.top) * Math.min(h, 1) * 2;
  for (const h of [0, 0.25, 0.5]) {
    out += line(BARS.x0, yBar(h), BARS.x1, yBar(h), h === 0 ? "lab-ink" : "lab-grid");
    out += text(BARS.x0 - 5, yBar(h) + 4, fmt(h, 2), "lab-text-tick", "end");
  }
  const k = game.outcomes.length;
  const slot = (BARS.x1 - BARS.x0) / k;
  const barW = Math.min(46, slot * 0.6);
  game.outcomes.forEach((name, i) => {
    const count = record.counts[i];
    const h = record.n > 0 ? count / record.n : 0;
    const cx = BARS.x0 + slot * (i + 0.5);
    const cls = wheels ? (i === 0 ? "lab-bar-a" : "lab-bar-b") : i === game.focus ? "lab-bar-c" : "lab-bar-a";
    const top = Math.max(BARS.top - 6, yBar(h));
    if (record.n > 0) out += rect(cx - barW / 2, top, barW, BARS.bottom - top, cls);
    out += text(cx, top - 4, record.n > 0 ? String(count) : "", "lab-text-small", "middle");
    out += text(cx, BARS.bottom + 15, name, i === game.focus && !wheels ? "lab-text-small lab-text-c" : "lab-text-small", "middle");
    if (record.n > 0) out += text(cx, BARS.bottom + 29, fmt(h, 2), "lab-text-small", "middle");
  });
  if (record.n > 0 && !wheels) out += text(BARS.x1, BARS.top - 6, `Summe aller h: ${fmt(record.counts.reduce((a, b) => a + b, 0) / record.n, 2)}`, "lab-text-small", "end");

  // the course of the relative frequency over the trials
  const N = Math.max(10, record.n);
  const xC = (t: number) => COURSE.x0 + ((COURSE.x1 - COURSE.x0) * t) / N;
  const yC = (h: number) => COURSE.bottom - (COURSE.bottom - COURSE.top) * h * 2;
  out += text(COURSE.x0, COURSE.top - 10, wheels ? "Verlauf von h(Gewinn A) und h(Gewinn B)" : `Verlauf von h(${focusLabel})`, "lab-text-muted");
  if (v.spiel === 0) {
    out += rect(COURSE.x0, yC(0.22), COURSE.x1 - COURSE.x0, yC(0.12) - yC(0.22), "lab-fill-ok");
    out += text(COURSE.x1 - 4, yC(0.22) - 4, "0,12 bis 0,22", "lab-text-small lab-text-ok", "end");
  }
  for (const h of [0, 0.25, 0.5]) {
    out += line(COURSE.x0, yC(h), COURSE.x1, yC(h), h === 0 ? "lab-ink" : "lab-grid");
    out += text(COURSE.x0 - 5, yC(h) + 4, fmt(h, 2), "lab-text-tick", "end");
  }
  for (const t of [0, Math.round(N / 2), N]) out += text(xC(t), COURSE.bottom + 14, String(t), "lab-text-tick", "middle");
  out += text((COURSE.x0 + COURSE.x1) / 2, COURSE.bottom + 26, `Anzahl n der ${game.trials}`, "lab-text-axis", "middle");
  if (v.spiel === 1 && v.n0 > 0) {
    const h0 = relFreq(gameOf(v, 0), 5);
    out += line(COURSE.x0, yC(h0), COURSE.x1, yC(h0), "lab-dashed");
    out += text(COURSE.x0 + 6, yC(h0) - 4, `normaler Würfel: ${fmt(h0, 2)}`, "lab-text-small");
  }
  const clipId = "dz-course-clip";
  out += `<clipPath id="${clipId}"><rect x="${COURSE.x0}" y="${COURSE.top - 2}" width="${COURSE.x1 - COURSE.x0}" height="${COURSE.bottom - COURSE.top + 4}" /></clipPath>`;
  const step = Math.max(1, Math.floor(record.n / 300));
  record.history.forEach((row, r) => {
    if (row.length === 0) return;
    let d = "";
    for (let t = 0; t < row.length; t += step) d += `${d ? "L" : "M"}${r1(xC(t + 1))} ${r1(yC(row[t]))} `;
    d += `L${r1(xC(row.length))} ${r1(yC(row[row.length - 1]))}`;
    out += `<g clip-path="url(#${clipId})"><path d="${d}" class="${r === 0 && !wheels ? "lab-curve-c" : r === 0 ? "lab-curve" : "lab-curve-2"}" style="stroke-dasharray:none;stroke-width:2" /></g>`;
  });
  out += close();
  return out;
}

// ─── The views of the stage ────────────────────────────────────────────────

export const DATEN_ZUFALL_VIEWS: Record<"outcome-event" | "tree-diagram" | "two-way-table" | "frequency-simulation", LabView> = {
  "outcome-event": { render: outcomeEventView },
  "tree-diagram": { render: treeDiagramView },
  "two-way-table": { render: twoWayTableView },
  "frequency-simulation": { render: frequencySimulationView },
};
