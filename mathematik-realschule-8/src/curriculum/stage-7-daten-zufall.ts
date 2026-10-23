import { fmt, frac, fracHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  countingText,
  drawSequences,
  EVENT_KINDS,
  eventKindText,
  GAME_SEEDS,
  gameOf,
  gameRestart,
  GAMES,
  gameTrials,
  hText,
  isPrime,
  labEvent,
  OUTCOME_EXPERIMENTS,
  moreButSmallerShare,
  OUTCOME_SEEDS,
  outcomeRecord,
  outcomeRestart,
  outcomeTrials,
  pathsWithReplacement,
  ratioEnds,
  relText,
  roundedRatio,
  sameShare,
  setText,
  shareText,
  shortSetText,
  TABLE_EVENTS,
  tableEventCount,
  tableOf,
  TREE_EVENTS,
  TREE_EXPERIMENTS,
  treeDepth,
  treeEventPaths,
  treeEventWords,
  treePaths,
  treeSetup,
  upTo,
  wheelLeader,
} from "../lab/views-daten-zufall";
import { toleranceOf } from "../exercises/checker";
import type { ChoiceField, ExerciseTask, LabValues, Lesson, NumberField, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-7-daten-zufall";
/** Both Zweige learn this stage: Zweig I in LB 7, Zweig II/III in LB 6. */
const LP = "M8 LB 7 (I) · M8 LB 6 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

/** A choice whose options are shuffled; the right one is found again by its text. */
function shuffledChoice(rng: Rng, label: string, correct: string, wrong: string[]): ChoiceField {
  const options = rng.shuffle([correct, ...wrong.filter((w, i, all) => w !== correct && all.indexOf(w) === i)]);
  return choiceField(label, options, options.indexOf(correct));
}

/** "1." … "10." as an ordinal in German text. */
const nth = (n: number) => `${n}.`;

/** "a, b und c" */
function joinAnd(items: ReadonlyArray<string | number>): string {
  const list = items.map(String);
  return list.length <= 1 ? (list[0] ?? "") : `${list.slice(0, -1).join(", ")} und ${list[list.length - 1]}`;
}

/** "zwei rote, eine blaue und eine grüne Kugel": the noun follows the last number, as in German. */
function ballsText(parts: Array<[number, string]>): string {
  const shown = parts.filter(([n]) => n > 0);
  const word = (n: number) => ["", "eine", "zwei", "drei", "vier", "fünf"][n] ?? String(n);
  const last = shown[shown.length - 1][0];
  return `${joinAnd(shown.map(([n, colour]) => `${word(n)} ${colour}`))} ${last === 1 ? "Kugel" : "Kugeln"}`;
}

/** The first names the tasks draw from, in pairs of two different people. */
const NAMES = ["Lena", "Tim", "Mia", "Jonas", "Emma", "Luca", "Hannah", "Paul", "Sophie", "Ben", "Lea", "Noah", "Marie", "Elias"];

function twoNames(rng: Rng): [string, string] {
  const [a, b] = rng.shuffle(NAMES);
  return [a, b];
}

/** "Lenas", but "Jonas'" and "Elias'" after an s. */
const genitive = (name: string) => (/[sxz]$/.test(name) ? `${name}’` : `${name}s`);

// ─── 7.1 Ergebnis und Ereignis ─────────────────────────────────────────────

/** Single-stage experiments of the tasks, each with numbered results 1 … size. */
export const SIMPLE_EXPERIMENTS: Array<{ intro: string; noun: string; size: number; series: string; at: (list: string) => string }> = [
  { intro: "Ein Würfel wird geworfen.", noun: "Augenzahl", size: 6, series: "Ein Würfel wird 10-mal geworfen", at: (list) => `beim ${list} Wurf` },
  { intro: "Ein Glücksrad mit 8 gleich großen Feldern, beschriftet mit 1 bis 8, wird gedreht.", noun: "Zahl", size: 8, series: "Ein Glücksrad mit den Zahlen 1 bis 8 wird 10-mal gedreht", at: (list) => `bei der ${list} Drehung` },
  { intro: "Ein Glücksrad mit 10 gleich großen Feldern, beschriftet mit 1 bis 10, wird gedreht.", noun: "Zahl", size: 10, series: "Ein Glücksrad mit den Zahlen 1 bis 10 wird 10-mal gedreht", at: (list) => `bei der ${list} Drehung` },
  { intro: "Ein Spielwürfel mit 12 Flächen, beschriftet mit 1 bis 12, wird geworfen.", noun: "Zahl", size: 12, series: "Ein Spielwürfel mit 12 Flächen wird 10-mal geworfen", at: (list) => `beim ${list} Wurf` },
  { intro: "Aus 20 verdeckten Karten mit den Zahlen 1 bis 20 wird eine gezogen.", noun: "Zahl", size: 20, series: "", at: (list) => `beim ${list} Ziehen` },
];

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export interface Statement {
  kind: number;
  k: number;
  words: string;
  test: (e: number) => boolean;
  /** Why the results belong to E, for the worked solution. */
  note: string;
  /** Tempting wrong readings: their results and what to say about them. */
  lures: Array<{ test: (e: number) => boolean; hint: string }>;
}

const isSquare = (e: number) => Math.round(Math.sqrt(e)) ** 2 === e;

/**
 * A statement about one number 1 … size. Kinds: 0 mindestens, 1 größer als,
 * 2 höchstens, 3 kleiner als, 4 durch k teilbar, 5 gerade, 6 ungerade,
 * 7 Primzahl, 8 Quadratzahl.
 */
export function statementOf(kind: number, k: number, noun: string, size: number): Statement {
  switch (kind) {
    case 0:
      return {
        kind, k, words: `${noun} mindestens ${k}`, test: (e) => e >= k,
        note: `„mindestens ${k}“ heißt ${k} oder mehr, ${k} selbst gehört dazu.`,
        lures: [
          { test: (e) => e > k, hint: `„Mindestens ${k}“ schließt ${k} selbst ein.` },
          { test: (e) => e <= k, hint: `„Mindestens ${k}“ heißt ${k} oder mehr, nicht weniger.` },
        ],
      };
    case 1:
      return {
        kind, k, words: `${noun} größer als ${k}`, test: (e) => e > k,
        note: `„größer als ${k}“ heißt mehr als ${k}, ${k} selbst gehört nicht dazu.`,
        lures: [
          { test: (e) => e >= k, hint: `„Größer als ${k}“ schließt ${k} selbst aus.` },
          { test: (e) => e < k, hint: `„Größer als ${k}“ heißt mehr als ${k}, nicht weniger.` },
        ],
      };
    case 2:
      return {
        kind, k, words: `${noun} höchstens ${k}`, test: (e) => e <= k,
        note: `„höchstens ${k}“ heißt ${k} oder weniger, ${k} selbst gehört dazu.`,
        lures: [
          { test: (e) => e < k, hint: `„Höchstens ${k}“ schließt ${k} selbst ein.` },
          { test: (e) => e >= k, hint: `„Höchstens ${k}“ heißt ${k} oder weniger, nicht mehr.` },
        ],
      };
    case 3:
      return {
        kind, k, words: `${noun} kleiner als ${k}`, test: (e) => e < k,
        note: `„kleiner als ${k}“ heißt weniger als ${k}, ${k} selbst gehört nicht dazu.`,
        lures: [
          { test: (e) => e <= k, hint: `„Kleiner als ${k}“ schließt ${k} selbst aus.` },
          { test: (e) => e > k, hint: `„Kleiner als ${k}“ heißt weniger als ${k}, nicht mehr.` },
        ],
      };
    case 4:
      return {
        kind, k, words: `${noun} durch ${k} teilbar`, test: (e) => e % k === 0,
        note: `Durch ${k} teilbar sind die Vielfachen von ${k}: ${k}, ${2 * k}, ${3 * k} und so weiter.`,
        lures: [
          { test: (e) => k % e === 0, hint: `Durch ${k} teilbar sind die Vielfachen von ${k}, nicht die Teiler von ${k}.` },
          { test: (e) => e % k === 0 && e !== k, hint: `Auch ${k} selbst ist durch ${k} teilbar.` },
        ],
      };
    case 5:
      return {
        kind, k: 0, words: `gerade ${noun}`, test: (e) => e % 2 === 0,
        note: "Gerade Zahlen sind durch 2 teilbar; auch 2 ist gerade.",
        lures: [
          { test: (e) => e % 2 === 1, hint: "Gerade sind die Zahlen, die durch 2 teilbar sind." },
          { test: (e) => e % 2 === 0 && e !== 2, hint: "Auch 2 ist eine gerade Zahl." },
        ],
      };
    case 6:
      return {
        kind, k: 0, words: `ungerade ${noun}`, test: (e) => e % 2 === 1,
        note: "Ungerade Zahlen sind nicht durch 2 teilbar; auch 1 ist ungerade.",
        lures: [
          { test: (e) => e % 2 === 0, hint: "Ungerade sind die Zahlen, die nicht durch 2 teilbar sind." },
          { test: (e) => e % 2 === 1 && e !== 1, hint: "Auch 1 ist eine ungerade Zahl." },
        ],
      };
    case 7:
      return {
        kind, k: 0, words: `${noun} ist eine Primzahl`, test: isPrime,
        note: "Eine Primzahl hat genau zwei Teiler, 1 und sich selbst. Die 1 ist keine Primzahl, die 2 schon.",
        lures: [
          { test: (e) => e === 1 || isPrime(e), hint: "Die 1 ist keine Primzahl: Sie hat nur einen Teiler." },
          { test: (e) => e % 2 === 1 && e > 1, hint: "Die 2 ist eine Primzahl, und nicht jede ungerade Zahl ist eine (9 = 3 · 3)." },
        ],
      };
    default:
      return {
        kind: 8, k: 0, words: `${noun} ist eine Quadratzahl`, test: isSquare,
        note: "Quadratzahlen sind 1 = 1 · 1, 4 = 2 · 2, 9 = 3 · 3, 16 = 4 · 4 und so weiter.",
        lures: [
          { test: (e) => isSquare(e) && e > 1, hint: "Auch 1 = 1 · 1 ist eine Quadratzahl." },
          { test: (e) => e * e <= size, hint: "Gesucht sind die Quadratzahlen selbst, nicht die Zahlen, die man quadriert." },
        ],
      };
  }
}

/** A random statement for numbers 1 … size, with its k. */
function randomStatement(rng: Rng, noun: string, size: number): Statement {
  const kinds = [0, 1, 2, 3, 4, 5, 6, 7, ...(size >= 10 ? [8] : [])];
  const kind = rng.pick(kinds);
  const k =
    kind === 0 || kind === 2 ? rng.int(2, size - 1) : kind === 1 ? rng.int(1, size - 2) : kind === 3 ? rng.int(3, size) : kind === 4 ? rng.int(3, Math.max(3, Math.floor(size / 2))) : 0;
  return statementOf(kind, k, noun, size);
}

/** Two dice noted as a pair (first | second): Ereignisse with their test and typical slips. */
export const PAIR_EVENTS: Array<{ words: (s: number) => string; test: (a: number, b: number, s: number) => boolean; slips: (count: number, s: number) => Array<{ value: number; hint: string }> }> = [
  {
    words: (s) => `Augensumme ${s}`,
    test: (a, b, s) => a + b === s,
    slips: (count, s) => {
      const a = Math.max(1, s - 6);
      return [
        { value: 1, hint: "Notiert wird das Augenpaar, nicht die Summe: Jedes Paar mit dieser Summe ist ein eigenes Ergebnis." },
        { value: Math.ceil(count / 2), hint: `(${a} | ${s - a}) und (${s - a} | ${a}) sind verschiedene Ergebnisse: Es kommt darauf an, welcher Würfel welche Zahl zeigt.` },
      ];
    },
  },
  { words: () => "Pasch (beide Augenzahlen gleich)", test: (a, b) => a === b, slips: () => [{ value: 1, hint: "Ein Pasch kann (1 | 1), (2 | 2), … oder (6 | 6) sein." }] },
  { words: () => "mindestens eine Sechs", test: (a, b) => a === 6 || b === 6, slips: () => [{ value: 12, hint: "Das Paar (6 | 6) hast du doppelt gezählt." }] },
  { words: () => "beide Augenzahlen gerade", test: (a, b) => a % 2 === 0 && b % 2 === 0, slips: () => [{ value: 6, hint: "Zählprinzip: 3 gerade Augenzahlen beim ersten Würfel mal 3 beim zweiten." }] },
  { words: () => "die erste Augenzahl ist größer als die zweite", test: (a, b) => a > b, slips: () => [{ value: 21, hint: "Bei einem Pasch ist die erste Augenzahl nicht größer als die zweite." }] },
  { words: () => "Augensumme höchstens 4", test: (a, b) => a + b <= 4, slips: () => [{ value: 3, hint: "Gezählt werden Augenpaare, nicht Summen: (1 | 2) und (2 | 1) sind zwei Ergebnisse." }] },
];

/** Two dice, only the sum noted: Ereignisse about the sum 2 … 12. */
export const SUM_EVENTS: Array<{ words: (k: number) => string; test: (sum: number, k: number) => boolean; slips: (k: number) => Array<{ value: number; hint: string }> }> = [
  { words: (k) => `Augensumme mindestens ${k}`, test: (sum, k) => sum >= k, slips: (k) => [{ value: 12 - k, hint: `„Mindestens ${k}“ schließt die Augensumme ${k} selbst ein.` }] },
  { words: () => "gerade Augensumme", test: (sum) => sum % 2 === 0, slips: () => [{ value: 18, hint: "Notiert wird nur die Summe: Gezählt werden die geraden Summen von 2 bis 12, nicht die Augenpaare." }] },
  { words: () => "Augensumme ist eine Primzahl", test: (sum) => isPrime(sum), slips: () => [{ value: 4, hint: "Auch 2 = 1 + 1 ist eine mögliche Augensumme, und 2 ist eine Primzahl." }] },
  { words: (k) => `Augensumme kleiner als ${k}`, test: (sum, k) => sum < k, slips: (k) => [{ value: k - 1, hint: `Die kleinste Augensumme ist 1 + 1 = 2, und „kleiner als ${k}“ schließt ${k} aus.` }] },
];

/** The 32 cards of a Skat deck: 4 suits, 8 values each. */
export const SKAT_SUITS = ["Kreuz", "Pik", "Herz", "Karo"];
export const SKAT_VALUES = ["7", "8", "9", "10", "Bube", "Dame", "König", "Ass"];
const isRed = (suit: number) => suit >= 2;
const isFace = (value: number) => value >= 4 && value <= 6;

export const SKAT_EVENTS: Array<{ words: string; test: (suit: number, value: number) => boolean; explain: string; slip?: { value: number; hint: string } }> = [
  { words: "eine Herzkarte", test: (s) => s === 2, explain: "die 8 Herzkarten", slip: { value: 13, hint: "Ein Skatspiel hat nur 8 Karten jeder Farbe: 7, 8, 9, 10, Bube, Dame, König und Ass." } },
  { words: "ein Ass", test: (_, v) => v === 7, explain: "die 4 Asse, eines von jeder Farbe", slip: { value: 1, hint: "Jede der vier Farben hat ein Ass." } },
  { words: "eine rote Karte", test: (s) => isRed(s), explain: "die 8 Herz- und die 8 Karokarten", slip: { value: 8, hint: "Rot sind zwei Farben: Herz und Karo." } },
  { words: "ein Bild (Bube, Dame oder König)", test: (_, v) => isFace(v), explain: "Bube, Dame und König jeder Farbe, also 4 · 3 Karten", slip: { value: 3, hint: "Jede der vier Farben hat Bube, Dame und König." } },
  { words: "eine Herzkarte oder eine Dame", test: (s, v) => s === 2 || v === 5, explain: "die 8 Herzkarten und die Damen von Kreuz, Pik und Karo; die Herz-Dame ist schon bei den Herzkarten dabei", slip: { value: 12, hint: "Die Herz-Dame ist eine Herzkarte und eine Dame: Zähle sie nur einmal." } },
  { words: "eine schwarze Karte oder ein Ass", test: (s, v) => !isRed(s) || v === 7, explain: "die 16 Kreuz- und Pikkarten sowie das Herz-Ass und das Karo-Ass; die schwarzen Asse sind schon dabei", slip: { value: 20, hint: "Die beiden schwarzen Asse hast du doppelt gezählt." } },
  { words: "eine Zahlenkarte (7, 8, 9 oder 10)", test: (_, v) => v <= 3, explain: "7, 8, 9 und 10 jeder Farbe, also 4 · 4 Karten", slip: { value: 4, hint: "Jede der vier Farben hat die Zahlenkarten 7, 8, 9 und 10." } },
  { words: "ein roter König", test: (s, v) => isRed(s) && v === 6, explain: "der Herz-König und der Karo-König", slip: { value: 4, hint: "Rot sind nur Herz und Karo." } },
  { words: "keine Herzkarte", test: (s) => s !== 2, explain: "alle Kreuz-, Pik- und Karokarten, also 3 · 8 Karten", slip: { value: 8, hint: "Das sind die Herzkarten; gesucht sind alle anderen." } },
  { words: "eine Pikkarte mit einer Zahl (7 bis 10)", test: (s, v) => s === 1 && v <= 3, explain: "Pik 7, Pik 8, Pik 9 und Pik 10", slip: { value: 16, hint: "Gesucht sind nur die Zahlenkarten von Pik." } },
];

const PAIRS = upTo(6).flatMap((a) => upTo(6).map((b) => [a, b] as [number, number]));
const pairText = ([a, b]: [number, number]) => `(${a} | ${b})`;

function ergebnisseTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    for (let attempt = 0; ; attempt++) {
      const exIndex = rng.int(0, SIMPLE_EXPERIMENTS.length - 1);
      const ex = SIMPLE_EXPERIMENTS[exIndex];
      const all = upTo(ex.size);
      const st = randomStatement(rng, ex.noun, ex.size);
      const E = all.filter(st.test);
      const lureSets = st.lures.map((lure) => all.filter(lure.test));
      const texts = [setText(E), ...lureSets.map(setText)];
      const fine = E.length >= 1 && E.length < ex.size && E.length <= 10 && lureSets.every((l) => l.length >= 1 && l.length <= 12) && new Set(texts).size === 3;
      if (!fine && attempt < 40) continue;
      const slips = st.lures.map((lure, i) => ({ value: lureSets[i].length, hint: lure.hint })).filter((s) => s.value !== E.length);
      return {
        prompt: `${ex.intro} Welche Ergebnisse gehören zum Ereignis E: „${st.words}“? Wie viele sind es?`,
        given: [`mögliche Ergebnisse: ${setText(all)}`],
        formulaHint: "Gehe alle möglichen Ergebnisse der Reihe nach durch: Erfüllt ein Ergebnis die Aussage, gehört es zu E.",
        fields: [shuffledChoice(rng, "E =", texts[0], texts.slice(1)), numberField("Anzahl der Ergebnisse von E:", E.length, "", 0, { slips })],
        steps: [`Mögliche Ergebnisse: ${setText(all)}`, `${st.note} Zu E gehören also ${joinAnd(E)}; die übrigen Ergebnisse nicht.`, `<strong>E = ${setText(E)}, das sind ${E.length} Ergebnisse.</strong>`],
        meta: { level: 1, ex: exIndex, size: ex.size, kind: st.kind, k: st.k, count: E.length },
      };
    }
  }
  const context = rng.int(0, 2);
  if (context === 0) {
    const id = rng.int(0, PAIR_EVENTS.length - 1);
    const s = rng.int(3, 11);
    const event = PAIR_EVENTS[id];
    const E = PAIRS.filter(([a, b]) => event.test(a, b, s));
    return {
      prompt: `Ein roter und ein blauer Würfel werden gleichzeitig geworfen. Notiert wird das Augenpaar (rot | blau), zum Beispiel (2 | 5). Wie viele Ergebnisse hat dieses Zufallsexperiment? Wie viele Ergebnisse gehören zum Ereignis E: „${event.words(s)}“?`,
      given: ["Ergebnis: das Augenpaar (rot | blau)", `E: „${event.words(s)}“`],
      fields: [
        numberField("Anzahl aller Ergebnisse:", 36, "", 0, {
          slips: [
            { value: 11, hint: "Das wären die Augensummen 2 bis 12. Notiert wird aber das Augenpaar." },
            { value: 12, hint: "6 + 6 zählt nur die Augenzahlen der beiden Würfel. Jede Augenzahl des roten passt zu jeder des blauen: 6 · 6." },
          ],
        }),
        numberField("Ergebnisse von E:", E.length, "", 0, { slips: event.slips(E.length, s) }),
      ],
      steps: [
        "Zählprinzip: 6 Augenzahlen beim roten Würfel, zu jeder 6 beim blauen, also 6 · 6 = 36 Augenpaare.",
        E.length <= 12 ? `E = {${E.map(pairText).join("; ")}}` : `Zu E gehören ${E.length} Augenpaare, zum Beispiel ${E.slice(0, 3).map(pairText).join(", ")}.`,
        `<strong>36 Ergebnisse, davon gehören ${E.length} zu E.</strong>`,
      ],
      meta: { level: 2, context, id, s, total: 36, count: E.length },
    };
  }
  if (context === 1) {
    const id = rng.int(0, SUM_EVENTS.length - 1);
    const k = id === 0 ? rng.int(6, 11) : id === 3 ? rng.int(5, 10) : 0;
    const event = SUM_EVENTS[id];
    const sums = Array.from({ length: 11 }, (_, i) => i + 2);
    const E = sums.filter((sum) => event.test(sum, k));
    return {
      prompt: `Zwei Würfel werden geworfen, notiert wird nur die Augensumme. Welche Ergebnisse hat dieses Zufallsexperiment, und wie viele sind es? Wie viele Ergebnisse gehören zum Ereignis E: „${event.words(k)}“?`,
      given: ["Ergebnis: die Augensumme der beiden Würfel", `E: „${event.words(k)}“`],
      fields: [
        numberField("Anzahl aller Ergebnisse:", 11, "", 0, {
          slips: [
            { value: 36, hint: "36 gilt für die Augenpaare. Notiert wird hier nur die Summe: Die Ergebnisse sind die Summen 2 bis 12." },
            { value: 12, hint: "Die Augensumme 1 ist unmöglich: Die Ergebnisse sind die Summen 2 bis 12." },
          ],
        }),
        numberField("Ergebnisse von E:", E.length, "", 0, { slips: event.slips(k) }),
      ],
      steps: [`Die kleinste Augensumme ist 1 + 1 = 2, die größte 6 + 6 = 12. Ergebnisse: ${setText(sums)}, das sind 11.`, `E = ${setText(E)}`, `<strong>11 Ergebnisse, davon gehören ${E.length} zu E.</strong>`],
      meta: { level: 2, context, id, k, total: 11, count: E.length },
    };
  }
  const id = rng.int(0, SKAT_EVENTS.length - 1);
  const event = SKAT_EVENTS[id];
  const cards = SKAT_SUITS.flatMap((_, suit) => SKAT_VALUES.map((__, value) => [suit, value] as [number, number]));
  const count = cards.filter(([suit, value]) => event.test(suit, value)).length;
  return {
    prompt: `Aus einem gut gemischten Skatspiel wird verdeckt eine Karte gezogen. Ein Skatspiel hat 32 Karten: die Farben Kreuz und Pik (schwarz) sowie Herz und Karo (rot), jeweils mit 7, 8, 9, 10, Bube, Dame, König und Ass. Wie viele Ergebnisse hat das Zufallsexperiment? Wie viele gehören zum Ereignis E: „${event.words}“?`,
    given: ["4 Farben mit je 8 Karten", `E: „${event.words}“`],
    fields: [
      numberField("Anzahl aller Ergebnisse:", 32, "", 0, { slips: [{ value: 12, hint: "Jede Karte ist ein Ergebnis: 4 Farben mit je 8 Karten, also 4 · 8." }] }),
      numberField("Ergebnisse von E:", count, "", 0, { slips: event.slip && event.slip.value !== count ? [event.slip] : [] }),
    ],
    steps: ["Jede der 32 Karten ist ein Ergebnis: 4 · 8 = 32.", `Zu E gehören ${event.explain}.`, `<strong>32 Ergebnisse, davon gehören ${count} zu E.</strong>`],
    meta: { level: 2, context, id, total: 32, count },
  };
}

function eintretenTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    for (let attempt = 0; ; attempt++) {
      const exIndex = rng.int(0, 2);
      const ex = SIMPLE_EXPERIMENTS[exIndex];
      const st = randomStatement(rng, ex.noun, ex.size);
      const E = upTo(ex.size).filter(st.test);
      const results = Array.from({ length: 10 }, () => rng.int(1, ex.size));
      const hitAt = results.map((r, i) => (st.test(r) ? i + 1 : 0)).filter((i) => i > 0);
      if ((E.length === 0 || E.length === ex.size || hitAt.length === 0 || hitAt.length === 10) && attempt < 40) continue;
      // ask about a trial where E occurred or one where it did not, half and half
      const missAt = upTo(10).filter((i) => !hitAt.includes(i));
      const askHit = missAt.length === 0 || (hitAt.length > 0 && rng.next() < 0.5);
      const j = askHit ? rng.pick(hitAt) : rng.pick(missAt);
      const r = results[j - 1];
      const lureCount = results.filter(st.lures[0].test).length;
      return {
        prompt: `${ex.series}; die Ergebnisse stehen unten in ihrer Reihenfolge. Wie oft ist das Ereignis E: „${st.words}“ eingetreten? Ist E ${ex.at(nth(j))} eingetreten?`,
        given: [`Ergebnisse: ${results.join(", ")}`],
        formulaHint: "E tritt ein, wenn das Ergebnis zu E gehört. Schreibe E zuerst als Menge auf.",
        fields: [
          numberField("E ist so oft eingetreten:", hitAt.length, "", 0, { slips: lureCount !== hitAt.length ? [{ value: lureCount, hint: st.lures[0].hint }] : [] }),
          yesNo(`${capital(ex.at(nth(j)))} (Ergebnis ${r}) eingetreten?`, st.test(r)),
        ],
        steps: [
          `E = ${setText(E)}. ${st.note}`,
          `E ist ${ex.at(joinAnd(hitAt.map(nth)))} eingetreten, mit ${hitAt.length === 1 ? "dem Ergebnis" : "den Ergebnissen"} ${joinAnd(hitAt.map((i) => results[i - 1]))}.`,
          `<strong>E ist ${hitAt.length}-mal eingetreten; ${ex.at(nth(j))} (Ergebnis ${r}) ist E ${st.test(r) ? "eingetreten" : "nicht eingetreten"}.</strong>`,
        ],
        meta: { level: 1, ex: exIndex, kind: st.kind, k: st.k, j, hits: hitAt.length, ...Object.fromEntries(results.map((x, i) => [`r${i}`, x])) },
      };
    }
  }
  // two dice, two players, each wins when their Ereignis occurs
  // [the Ereignis, "bei …" for the rule, its test]
  const GAME_EVENTS: Array<[string, string, (a: number, b: number) => boolean]> = [
    ["Pasch", "bei einem Pasch", (a, b) => a === b],
    ["Augensumme mindestens 9", "bei einer Augensumme von mindestens 9", (a, b) => a + b >= 9],
    ["mindestens eine Sechs", "bei mindestens einer Sechs", (a, b) => a === 6 || b === 6],
    ["Augensumme 7", "bei der Augensumme 7", (a, b) => a + b === 7],
    ["zwei ungerade Augenzahlen", "bei zwei ungeraden Augenzahlen", (a, b) => a % 2 === 1 && b % 2 === 1],
    ["Augensumme höchstens 5", "bei einer Augensumme von höchstens 5", (a, b) => a + b <= 5],
  ];
  const points = (n: number) => (n === 1 ? "1 Punkt" : `${n} Punkte`);
  for (let attempt = 0; ; attempt++) {
    const [i1, i2] = rng.shuffle(upTo(GAME_EVENTS.length).map((i) => i - 1)).slice(0, 2);
    const [p1, p2] = twoNames(rng);
    const throws = Array.from({ length: 10 }, () => [rng.int(1, 6), rng.int(1, 6)] as [number, number]);
    const w1 = throws.map((t, i) => (GAME_EVENTS[i1][2](...t) ? i + 1 : 0)).filter((i) => i > 0);
    const w2 = throws.map((t, i) => (GAME_EVENTS[i2][2](...t) ? i + 1 : 0)).filter((i) => i > 0);
    if ((w1.length === 0 || w2.length === 0) && attempt < 60) continue;
    const winner = w1.length > w2.length ? 0 : w2.length > w1.length ? 1 : 2;
    const winners = [p1, p2, "beide gleich viele"];
    return {
      prompt: `${p1} und ${p2} werfen zehnmal zwei Würfel (rot | blau). ${p1} bekommt einen Punkt ${GAME_EVENTS[i1][1]}, ${p2} ${GAME_EVENTS[i2][1]}. Bei einem Wurf können auch beide einen Punkt bekommen. Wie oft ist jedes der beiden Ereignisse eingetreten? Wer hat mehr Punkte?`,
      given: [`Würfe: ${throws.map(pairText).join(", ")}`],
      fields: [
        numberField(`Punkte von ${p1}:`, w1.length, "", 0),
        numberField(`Punkte von ${p2}:`, w2.length, "", 0),
        choiceField("Mehr Punkte hat:", winners, winner),
      ],
      steps: [
        `${p1}: ${GAME_EVENTS[i1][0]} beim ${joinAnd(w1.map(nth))} Wurf, ${joinAnd(w1.map((i) => pairText(throws[i - 1])))}.`,
        `${p2}: ${GAME_EVENTS[i2][0]} beim ${joinAnd(w2.map(nth))} Wurf, ${joinAnd(w2.map((i) => pairText(throws[i - 1])))}.`,
        `<strong>${p1} hat ${points(w1.length)}, ${p2} ${points(w2.length)}; ${winner === 2 ? "beide haben gleich viele" : `mehr hat ${winners[winner]}`}.</strong>`,
      ],
      meta: { level: 2, i1, i2, w1: w1.length, w2: w2.length, winner, ...Object.fromEntries(throws.flatMap(([a, b], i) => [[`a${i}`, a], [`b${i}`, b]])) },
    };
  }
}

export const CATEGORY_OPTIONS = ["ein sicheres Ereignis", "ein unmögliches Ereignis", "ein Ereignis mit genau einem Ergebnis", "ein Ereignis mit mehreren, aber nicht allen Ergebnissen"];

/** Statements that hit the edge cases: every result, none, exactly one. */
function edgeStatement(rng: Rng, noun: string, size: number, category: number): { words: string; test: (e: number) => boolean } {
  const pick = rng.int(0, 2);
  if (category === 0) {
    return [
      { words: `${noun} kleiner als ${size + 1}`, test: (e: number) => e < size + 1 },
      { words: `${noun} höchstens ${size}`, test: (e: number) => e <= size },
      { words: `${noun} mindestens 1`, test: (e: number) => e >= 1 },
    ][pick];
  }
  if (category === 1) {
    return [
      { words: `${noun} größer als ${size}`, test: (e: number) => e > size },
      { words: `${noun} kleiner als 1`, test: (e: number) => e < 1 },
      { words: `${noun} ${size + 1}`, test: (e: number) => e === size + 1 },
    ][pick];
  }
  if (category === 2) {
    const k = rng.int(1, size);
    return [
      { words: `${noun} ${k}`, test: (e: number) => e === k },
      { words: `${noun} mindestens ${size}`, test: (e: number) => e >= size },
      { words: `${noun} kleiner als 2`, test: (e: number) => e < 2 },
    ][pick];
  }
  const st = randomStatement(rng, noun, size);
  return { words: st.words, test: st.test };
}

/** What two learners note about the same experiment: their numbers of results and how many of the finer ones make up one coarse result. */
interface Observation {
  intro: string;
  /** What the first learner does, after the name: "notiert, wie oft Kopf fällt". */
  coarse: string;
  fine: string;
  coarseLabel: string;
  fineLabel: string;
  coarseCount: number;
  fineCount: number;
  part: string;
  partCount: number;
  coarseList: string;
  fineList: string;
  partList: string;
  fineSlip?: { value: number; hint: string };
}

function observation(rng: Rng, kind: number): Observation {
  if (kind === 0 || kind === 1) {
    const coins = kind === 0 ? 2 : 3;
    const paths = drawSequences(["K", "Z"], null, coins).map((p) => p.join(""));
    const heads = coins === 2 ? 1 : rng.int(1, 2);
    const part = paths.filter((p) => [...p].filter((c) => c === "K").length === heads);
    const word = heads === 1 ? "einmal" : "zweimal";
    return {
      intro: `${coins === 2 ? "Zwei" : "Drei"} Münzen werden nacheinander geworfen.`,
      coarse: "notiert, wie oft Kopf fällt",
      fine: "notiert für jede Münze der Reihe nach, ob Kopf (K) oder Zahl (Z) oben liegt",
      coarseLabel: "Anzahl von Kopf",
      fineLabel: "K oder Z für jede Münze, der Reihe nach",
      coarseCount: coins + 1,
      fineCount: 2 ** coins,
      part: `${word} Kopf`,
      partCount: part.length,
      coarseList: setText(upTo(coins + 1).map((i) => i - 1)),
      fineList: setText(paths),
      partList: setText(part),
      fineSlip: { value: coins + 1, hint: "Bei der Reihenfolge sind KZ und ZK zwei verschiedene Ergebnisse." },
    };
  }
  if (kind === 2) {
    const s = rng.int(3, 11);
    const part = PAIRS.filter(([a, b]) => a + b === s);
    return {
      intro: "Zwei Würfel, ein roter und ein blauer, werden geworfen.",
      coarse: "notiert nur die Augensumme",
      fine: "notiert das Augenpaar (rot | blau)",
      coarseLabel: "Augensumme",
      fineLabel: "Augenpaar (rot | blau)",
      coarseCount: 11,
      fineCount: 36,
      part: `Augensumme ${s}`,
      partCount: part.length,
      coarseList: "{2; 3; …; 12}",
      fineList: "{(1 | 1); (1 | 2); …; (6 | 6)}",
      partList: `{${part.map(pairText).join("; ")}}`,
      fineSlip: { value: 21, hint: "(1 | 2) und (2 | 1) sind verschiedene Augenpaare: Der rote und der blaue Würfel sind verschieden." },
    };
  }
  if (kind === 3) {
    const red = rng.int(2, 4);
    const blue = rng.int(2, 6 - red);
    const green = 8 - red - blue;
    const colours: Array<[string, number[]]> = [
      ["Rot", upTo(red)],
      ["Blau", upTo(blue).map((i) => red + i)],
      ["Grün", upTo(green).map((i) => red + blue + i)],
    ];
    const [name, fields] = rng.pick(colours);
    return {
      intro: `Ein Glücksrad hat 8 gleich große Felder mit den Zahlen 1 bis 8. Die Felder ${joinAnd(colours[0][1])} sind rot, ${joinAnd(colours[1][1])} blau und ${joinAnd(colours[2][1])} grün.`,
      coarse: "notiert nur die Farbe",
      fine: "notiert die Zahl",
      coarseLabel: "Farbe",
      fineLabel: "Zahl",
      coarseCount: 3,
      fineCount: 8,
      part: name,
      partCount: fields.length,
      coarseList: "{Rot; Blau; Grün}",
      fineList: setText(upTo(8)),
      partList: setText(fields),
    };
  }
  return {
    intro: "Ein Würfel wird geworfen.",
    coarse: "notiert nur, ob eine Sechs fällt oder nicht",
    fine: "notiert die Augenzahl",
    coarseLabel: "Sechs oder keine Sechs",
    fineLabel: "Augenzahl",
    coarseCount: 2,
    fineCount: 6,
    part: "keine Sechs",
    partCount: 5,
    coarseList: "{Sechs; keine Sechs}",
    fineList: setText(upTo(6)),
    partList: setText(upTo(5)),
  };
}

function begriffTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const exIndex = rng.int(0, SIMPLE_EXPERIMENTS.length - 1);
    const ex = SIMPLE_EXPERIMENTS[exIndex];
    let st = edgeStatement(rng, ex.noun, ex.size, rng.int(0, 3));
    let E = upTo(ex.size).filter(st.test);
    for (let i = 0; i < 20 && E.length > 10 && E.length < ex.size; i++) {
      st = edgeStatement(rng, ex.noun, ex.size, 3);
      E = upTo(ex.size).filter(st.test);
    }
    const category = E.length === ex.size ? 0 : E.length === 0 ? 1 : E.length === 1 ? 2 : 3;
    const reason = [
      `Alle ${ex.size} Ergebnisse gehören dazu: E tritt bei jedem Versuch ein.`,
      "Kein Ergebnis gehört dazu: E kann nie eintreten.",
      `Nur ${E[0]} gehört dazu: E tritt genau dann ein, wenn ${E[0]} herauskommt.`,
      `Es gehören ${E.length} der ${ex.size} Ergebnisse dazu, aber nicht alle.`,
    ][category];
    const verdict = [
      `E ist ein sicheres Ereignis; alle ${ex.size} Ergebnisse gehören dazu.`,
      "E ist ein unmögliches Ereignis; 0 Ergebnisse gehören dazu.",
      "E ist ein Ereignis mit genau einem Ergebnis.",
      `E ist ein Ereignis mit mehreren, aber nicht allen Ergebnissen: ${E.length} von ${ex.size}.`,
    ][category];
    return {
      prompt: `${ex.intro} Was für ein Ereignis ist E: „${st.words}“? Wie viele Ergebnisse gehören dazu?`,
      given: [`mögliche Ergebnisse: ${setText(upTo(ex.size))}`],
      formulaHint: "Schreibe E als Menge. Alle Ergebnisse: sicheres Ereignis; kein Ergebnis, E = { }: unmögliches Ereignis.",
      fields: [choiceField("E ist", CATEGORY_OPTIONS, category), numberField("Anzahl der Ergebnisse von E:", E.length, "", 0)],
      steps: [`Mögliche Ergebnisse: ${setText(upTo(ex.size))}`, `E = ${E.length === ex.size && ex.size > 10 ? `{1; 2; …; ${ex.size}}` : setText(E)}. ${reason}`, `<strong>${verdict}</strong>`],
      meta: { level: 1, ex: exIndex, size: ex.size, category, count: E.length },
    };
  }
  const kind = rng.int(0, 4);
  const o = observation(rng, kind);
  const [a, b] = twoNames(rng);
  return {
    prompt: `${o.intro} ${a} ${o.coarse}. ${b} ${o.fine}. Wie viele mögliche Ergebnisse hat das Zufallsexperiment für ${a}, wie viele für ${b}? Wie viele von ${genitive(b)} Ergebnissen gehören zu ${genitive(a)} Ergebnis „${o.part}“?`,
    given: [`${a}: ${o.coarseLabel}`, `${b}: ${o.fineLabel}`],
    fields: [
      numberField(`Ergebnisse bei ${a}:`, o.coarseCount, "", 0),
      numberField(`Ergebnisse bei ${b}:`, o.fineCount, "", 0, { slips: o.fineSlip ? [o.fineSlip] : [] }),
      numberField(`${genitive(b)} Ergebnisse zu „${o.part}“:`, o.partCount, "", 0),
    ],
    steps: [`${a}: ${o.coarseList}, das sind ${o.coarseCount} Ergebnisse.`, `${b}: ${o.fineList}, das sind ${o.fineCount} Ergebnisse.`, `Was für ${a} ein Ergebnis ist, ist für ${b} ein Ereignis: „${o.part}“ = ${o.partList}.`, `<strong>${a} hat ${o.coarseCount}, ${b} ${o.fineCount} mögliche Ergebnisse; zu „${o.part}“ gehören ${o.partCount} von ${genitive(b)} Ergebnissen.</strong>`],
    meta: { level: 2, kind, coarse: o.coarseCount, fine: o.fineCount, part: o.partCount },
  };
}

const ergebnisEreignis: Lesson = {
  id: "dz-1-ergebnis-ereignis",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "7.1 Ergebnis und Ereignis",
  subtitle: "Was beim Zufall herauskommen kann",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Ergebnis und Ereignis`,
  whyItMatters:
    "Ob beim Brettspiel eine Sechs fällt oder bei der Tombola ein Gewinn: Wer über Zufall genau sprechen will, muss zuerst sagen, was alles herauskommen kann und welche Ausgänge zu einer Aussage gehören. Darauf bauen Baumdiagramme, Vierfeldertafeln und in Klasse 9 die Wahrscheinlichkeit auf.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5:</strong> Strichlisten, Tabellen und Baumdiagramme kennst du schon. Jetzt beschreibst du damit Zufallsexperimente.</p>
    <p>Ein <strong>Zufallsexperiment</strong> ist ein Versuch, der sich unter gleichen Bedingungen beliebig oft wiederholen lässt, der mehrere mögliche Ausgänge hat und dessen Ausgang man vorher nicht vorhersagen kann. Beispiele sind: einen Würfel werfen, eine Münze werfen, ein Glücksrad drehen, ohne hinzusehen eine Kugel aus einer Urne ziehen, einen Reißnagel werfen.</p>
    <p>Jeder mögliche Ausgang heißt <strong>Ergebnis</strong>. Beim Würfel sind die möglichen Ergebnisse die Augenzahlen 1 bis 6; man schreibt sie als Liste in geschweiften Klammern: {1; 2; 3; 4; 5; 6}. Bei jeder Durchführung tritt genau ein Ergebnis ein.</p>
    <p>Ein <strong>Ereignis</strong> ist eine Aussage über den Ausgang. Zu ihr gehören alle Ergebnisse, für die die Aussage stimmt: E: „gerade Augenzahl“ = {2; 4; 6}. Ein Ereignis <strong>tritt ein</strong>, wenn das Ergebnis des Versuchs dazugehört. Fällt eine 4, ist E eingetreten; fällt eine 5, nicht.</p>
    <ul>
      <li>„Augenzahl 6“ ist ein Ergebnis. Liest man es als Ereignis, gehört genau dieses eine Ergebnis dazu: {6}.</li>
      <li>„Augenzahl mindestens 5“ = {5; 6} ist ein Ereignis mit zwei Ergebnissen. Vorsicht: „Augenzahl größer als 5“ = {6} hat nur eines.</li>
      <li>Gehören alle Ergebnisse dazu, tritt das Ereignis immer ein: ein <strong>sicheres Ereignis</strong>, etwa „Augenzahl kleiner als 7“. Gehört kein Ergebnis dazu, tritt es nie ein: ein <strong>unmögliches Ereignis</strong>, etwa „Augenzahl 7“ = { }.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Ein Glücksrad hat 8 gleich große Felder mit den Zahlen 1 bis 8.<br>
      Mögliche Ergebnisse: {1; 2; 3; 4; 5; 6; 7; 8}<br>
      E: „Zahl ist eine Primzahl“. Prüfe jede Zahl: 1 ist keine Primzahl, 2, 3, 5 und 7 sind Primzahlen, 4, 6 und 8 nicht.<br>
      Also E = {2; 3; 5; 7}, ein Ereignis mit 4 Ergebnissen.<br>
      Das Rad bleibt bei 5 stehen: 5 gehört zu E, E ist eingetreten. Bei 8 wäre E nicht eingetreten.</div>
    <p><strong>Was ein Ergebnis ist, hängt davon ab, was du beobachtest.</strong> Wirfst du zwei Würfel und notierst nur die Augensumme, sind die Ergebnisse die Summen 2 bis 12, also 11 Ergebnisse. Notierst du das Augenpaar (erster Würfel | zweiter Würfel), gibt es 36 Ergebnisse, und (2 | 5) und (5 | 2) sind verschiedene Ergebnisse. Das Ereignis „Augensumme 7“ besteht dann aus den sechs Paaren (1 | 6), (2 | 5), (3 | 4), (4 | 3), (5 | 2) und (6 | 1).</p>
    <p><strong>Typische Fehler:</strong> „mindestens“ und „größer als“ verwechseln; die 1 als Primzahl zählen; meinen, ein Ereignis müsse immer mehrere Ergebnisse haben.</p>
    <div class="merke"><strong>Merke:</strong> Ein Ergebnis ist ein einzelner möglicher Ausgang. Ein Ereignis fasst die Ergebnisse zusammen, für die eine Aussage stimmt; es tritt ein, wenn das Ergebnis dazugehört. Gehören alle Ergebnisse dazu, ist es sicher, gehört keines dazu, ist es unmöglich.</div>
  `,
  formulas: [
    { name: "Ergebnis", html: "ein möglicher Ausgang, z. B. die Augenzahl 4", quantities: "bei jeder Durchführung tritt genau ein Ergebnis ein" },
    { name: "Ereignis", html: "E: „gerade Augenzahl“ = {2; 4; 6}", quantities: "E tritt ein, wenn das Ergebnis zu E gehört" },
    { name: "Sicheres und unmögliches Ereignis", html: "sicher: alle Ergebnisse gehören dazu; unmöglich: E = { }", quantities: "z. B. „Augenzahl kleiner als 7“ und „Augenzahl 7“ beim Würfel" },
  ],
  quiz: {
    question: "Ein Würfel wird geworfen. Welche Ergebnisse gehören zum Ereignis „Augenzahl mindestens 4“?",
    options: ["{5; 6}", "{4}", "{4; 5; 6}", "{1; 2; 3; 4}"],
    correctIndex: 2,
    explanation:
      "„Mindestens 4“ heißt 4 oder mehr, also gehören 4, 5 und 6 dazu. {5; 6} wäre „größer als 4“, {4} ist nur das einzelne Ergebnis 4, und {1; 2; 3; 4} ist „höchstens 4“.",
  },
  lab: {
    kind: "outcome-event",
    title: "Labor: Würfel, Glücksrad und Strichliste",
    intro:
      "Wähle das Zufallsexperiment und ein Ereignis E; seine Ergebnisse sind lila markiert. Mit den Knöpfen führst du Versuche durch, die Strichliste zählt jedes Ergebnis. Die Strichliste bleibt, wenn du ein anderes Ereignis wählst: Sie gehört zum Experiment, nicht zum Ereignis.",
    params: [
      { type: "choice", key: "exp", label: "Zufallsexperiment", options: OUTCOME_EXPERIMENTS.map((ex, value) => ({ value, label: ex.name })), value: 0 },
      { type: "choice", key: "art", label: "Ereignis E", options: EVENT_KINDS.map((kind, value) => ({ value, label: kind.label })), value: 0 },
      { type: "range", key: "k", label: "Zahl k im Ereignis", unit: "", min: 1, max: 9, step: 1, value: 5, showIf: (v) => (EVENT_KINDS[v.art] ?? EVENT_KINDS[0]).usesK },
      { type: "state", key: "n0", value: 0 },
      { type: "state", key: "s0", value: OUTCOME_SEEDS[0] },
      { type: "state", key: "n1", value: 0 },
      { type: "state", key: "s1", value: OUTCOME_SEEDS[1] },
    ],
    readouts: [
      { key: "ergebnisse", label: "mögliche Ergebnisse", compute: (v) => setText(upTo((OUTCOME_EXPERIMENTS[v.exp] ?? OUTCOME_EXPERIMENTS[0]).size)) },
      {
        key: "ereignis",
        label: "Ereignis E",
        emphasis: true,
        compute: (v) => {
          const { words, results } = labEvent(v);
          return `„${words}“ = ${setText(results)}`;
        },
      },
      { key: "art", label: "Art", compute: (v) => eventKindText(labEvent(v).results.length, (OUTCOME_EXPERIMENTS[v.exp] ?? OUTCOME_EXPERIMENTS[0]).size) },
      {
        key: "zuletzt",
        label: "letzter Versuch",
        compute: (v) => {
          const record = outcomeRecord(v);
          if (record.n === 0) return "noch kein Versuch";
          const last = record.series[record.n - 1];
          return `${last}: E ${labEvent(v).results.includes(last) ? "ist eingetreten" : "ist nicht eingetreten"}`;
        },
      },
      {
        key: "anzahl",
        label: "E ist eingetreten",
        compute: (v) => {
          const record = outcomeRecord(v);
          const ex = OUTCOME_EXPERIMENTS[v.exp] ?? OUTCOME_EXPERIMENTS[0];
          return record.n === 0 ? "noch kein Versuch" : `${record.hits}-mal bei ${record.n} ${record.n === 1 ? ex.trial : ex.trialsDative}`;
        },
      },
    ],
    actions: [
      { id: "eins", label: "1 Versuch", apply: (v) => outcomeTrials(v, 1) },
      { id: "zehn", label: "10 Versuche", apply: (v) => outcomeTrials(v, 10) },
      { id: "neu", label: "Strichliste löschen", apply: (v) => outcomeRestart(v) },
    ],
    goals: [
      {
        id: "sicher",
        text: "Finde ein Ereignis, das bei jedem Versuch eintreten muss (ein sicheres Ereignis), und bestätige es mit mindestens 10 Versuchen.",
        check: (v) => {
          const ex = OUTCOME_EXPERIMENTS[v.exp] ?? OUTCOME_EXPERIMENTS[0];
          return labEvent(v).results.length === ex.size && outcomeRecord(v).n >= 10;
        },
      },
      {
        id: "drei",
        text: "Finde beim Würfel ein Ereignis mit genau drei Ergebnissen, zu dem die 6 nicht gehört. Wie viele solche Ereignisse bietet das Labor?",
        check: (v) => {
          const { results } = labEvent(v);
          return v.exp === 0 && results.length === 3 && !results.includes(6);
        },
      },
      {
        id: "einzeln",
        text: "Wähle ein Ereignis, zu dem nur ein einziges Ergebnis gehört, und führe Versuche durch, bis es fünfmal eingetreten ist.",
        check: (v) => labEvent(v).results.length === 1 && outcomeRecord(v).hits >= 5,
      },
    ],
  },
  exercises: [
    { id: "ergebnisse", make: (rng, level) => ergebnisseTask(rng, level) },
    { id: "eintreten", make: (rng, level) => eintretenTask(rng, level) },
    { id: "begriff", make: (rng, level) => begriffTask(rng, level) },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Ergebnis und Ereignis sicher und weißt, wann ein Ereignis eintritt.",
};

// ─── 7.2 Baumdiagramme ─────────────────────────────────────────────────────

const BALL_NAMES = ["rot", "blau", "grün", "gelb", "weiß"];

/** "4 Kugeln in verschiedenen Farben (rot, blau, grün und gelb)" */
function distinctBalls(m: number): string {
  const names = BALL_NAMES.slice(0, m);
  return `${m} Kugeln in verschiedenen Farben (${names.slice(0, -1).join(", ")} und ${names[m - 1]})`;
}

const stageWord = (k: number) => `${k}. Stufe`;

function anzahlTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const context = rng.int(0, 4);
    const formulaHint = "Zählprinzip: Anzahl der Ergebnisse = (Äste je Punkt in der 1. Stufe) · (Äste je Punkt in der 2. Stufe) · …";
    if (context <= 1) {
      // the same branches at every stage: a coin or a wheel
      const m = context === 0 ? 2 : rng.int(3, 5);
      const s = context === 0 ? rng.int(2, 4) : rng.int(2, 3);
      const intro = context === 0 ? `Eine Münze wird ${["", "", "zweimal", "dreimal", "viermal"][s]} geworfen.` : `Ein Glücksrad hat ${m} gleich große Felder in verschiedenen Farben. Es wird ${s === 2 ? "zweimal" : "dreimal"} gedreht.`;
      const total = m ** s;
      return {
        prompt: `${intro} Im Baumdiagramm ist ${context === 0 ? "jeder Wurf" : "jede Drehung"} eine Stufe. Wie viele Äste gehen in jeder Stufe von jedem Punkt aus, und wie viele Ergebnisse hat das Zufallsexperiment?`,
        given: [context === 0 ? "Münze: Kopf (K) oder Zahl (Z)" : `${m} Farben`, `${s} Stufen`],
        formulaHint,
        fields: [
          numberField("Äste je Punkt:", m, "", 0),
          numberField("Anzahl der Ergebnisse:", total, "", 0, { slips: [{ value: m * s, hint: "Die Astzahlen der Stufen werden multipliziert, nicht addiert." }] }),
        ],
        steps: [`Jede Stufe hat an jedem Punkt ${m} Äste.`, `Zählprinzip: ${Array(s).fill(m).join(" · ")} = ${total}`, `<strong>${m} Äste je Punkt, ${total} Ergebnisse.</strong>`],
        meta: { level: 1, context, m, s, total },
      };
    }
    let branches: number[];
    let intro: string;
    let note: string;
    let slipHint = "";
    if (context === 2 || context === 3) {
      const m = rng.int(3, 5);
      const s = rng.int(2, 3);
      const without = context === 2;
      branches = Array.from({ length: s }, (_, k) => (without ? m - k : m));
      intro = `In einer Urne liegen ${distinctBalls(m)}. Es wird ${s === 2 ? "zweimal" : "dreimal"} nacheinander ${without ? "ohne" : "mit"} Zurücklegen gezogen.`;
      note = without ? "Ohne Zurücklegen fehlt die gezogene Kugel: In jeder Stufe gibt es einen Ast weniger." : "Mit Zurücklegen ist die Urne vor jedem Zug wieder voll: Jede Stufe hat gleich viele Äste.";
      slipHint = note;
    } else {
      const order = rng.int(0, 2);
      branches = [[6, 2], [2, 6], [2, 6, 2]][order];
      intro = [
        "Zuerst wird ein Würfel geworfen, danach eine Münze.",
        "Zuerst wird eine Münze geworfen, danach ein Würfel.",
        "Zuerst wird eine Münze geworfen, dann ein Würfel und zum Schluss noch einmal die Münze.",
      ][order];
      note = "Beim Würfel gehen von jedem Punkt 6 Äste aus, bei der Münze 2.";
    }
    const total = branches.reduce((a, b) => a * b, 1);
    const m0 = branches[0];
    return {
      prompt: `${intro} Wie viele Äste gehen im Baumdiagramm in jeder Stufe von jedem Punkt aus, und wie viele Ergebnisse hat das Zufallsexperiment?`,
      given: [`${branches.length} Stufen`],
      formulaHint,
      fields: [
        ...branches.map((b, k) =>
          numberField(`Äste je Punkt in der ${stageWord(k + 1)}:`, b, "", 0, slipHint && k > 0 ? { slips: [{ value: context === 2 ? m0 : m0 - k, hint: slipHint }] } : {}),
        ),
        numberField("Anzahl der Ergebnisse:", total, "", 0, {
          slips: [
            { value: branches.reduce((a, b) => a + b, 0), hint: "Die Astzahlen der Stufen werden multipliziert, nicht addiert." },
            ...(context === 2 ? [{ value: m0 ** branches.length, hint: slipHint }] : []),
          ],
        }),
      ],
      steps: [note, `Äste je Punkt in den ${branches.length} Stufen: ${joinAnd(branches)}`, `<strong>Zählprinzip: ${branches.join(" · ")} = ${total} Ergebnisse.</strong>`],
      meta: { level: 1, context, total, s: branches.length, ...Object.fromEntries(branches.map((b, k) => [`b${k}`, b])) },
    };
  }
  const context = rng.int(0, 4);
  if (context === 0) {
    const k = rng.int(3, 4);
    const total = 10 ** k;
    const distinct = Array.from({ length: k }, (_, i) => 10 - i).reduce((a, b) => a * b, 1);
    const factors = Array.from({ length: k }, (_, i) => 10 - i).join(" · ");
    return {
      prompt: `Ein Zahlenschloss hat ${k} Ringe mit den Ziffern 0 bis 9. Lukas hat seinen Code vergessen und stellt die Ringe zufällig ein. Wie viele verschiedene Codes kann er dabei erhalten? Wie viele davon bestehen aus lauter verschiedenen Ziffern?`,
      given: [`${k} Ringe, je 10 Ziffern`],
      fields: [
        numberField("Codes insgesamt:", total, "", 0, {
          slips: [
            { value: 10 * k, hint: "Jede Ziffer des ersten Rings passt zu jeder des zweiten: multiplizieren, nicht addieren." },
            { value: 9 ** k, hint: "Die Ziffer 0 zählt mit: Jeder Ring hat 10 Ziffern." },
          ],
        }),
        numberField("mit lauter verschiedenen Ziffern:", distinct, "", 0, { slips: [{ value: total, hint: "Jede Ziffer darf nur einmal vorkommen: Wie beim Ziehen ohne Zurücklegen hat jede Stufe einen Ast weniger." }] }),
      ],
      steps: [`Jeder Ring ist eine Stufe mit 10 Ästen: ${Array(k).fill(10).join(" · ")} = ${fmt(total, 0)}.`, `Lauter verschiedene Ziffern: Für den 2. Ring bleiben 9 Ziffern, für den 3. noch 8 …: ${factors} = ${fmt(distinct, 0)}.`, `<strong>${fmt(total, 0)} Codes, davon ${fmt(distinct, 0)} mit lauter verschiedenen Ziffern.</strong>`],
      meta: { level: 2, context, k, total, second: distinct },
    };
  }
  if (context === 1) {
    const n = rng.int(6, 9);
    const total = n * (n - 1) * (n - 2);
    return {
      prompt: `Bei einer Tombola liegen ${n} Lose mit den Nummern 1 bis ${n} in einer Trommel. Für den 1., den 2. und den 3. Preis wird nacheinander je ein Los gezogen; gezogene Lose kommen nicht zurück. Ein Ergebnis ist die Folge der drei Nummern. Wie viele Ergebnisse gibt es? Wie viele wären es, wenn jedes Los nach dem Ziehen zurückgelegt würde?`,
      given: [`${n} Lose`, "drei Züge, ohne Zurücklegen"],
      fields: [
        numberField("ohne Zurücklegen:", total, "", 0, { slips: [{ value: n ** 3, hint: "Die gezogenen Lose fehlen: Beim 2. Zug sind nur noch " + (n - 1) + " Lose in der Trommel." }] }),
        numberField("mit Zurücklegen:", n ** 3, "", 0, { slips: [{ value: total, hint: "Mit Zurücklegen ist die Trommel vor jedem Zug wieder voll." }] }),
      ],
      steps: [`Ohne Zurücklegen: ${n} · ${n - 1} · ${n - 2} = ${total}`, `Mit Zurücklegen: ${n} · ${n} · ${n} = ${n ** 3}`, `<strong>${total} Ergebnisse ohne, ${n ** 3} mit Zurücklegen.</strong>`],
      meta: { level: 2, context, n, total, second: n ** 3 },
    };
  }
  if (context === 2) {
    const a = rng.int(2, 4);
    const b = rng.int(3, 5);
    const c = rng.int(2, 4);
    return {
      prompt: `Die Schulmensa stellt ein Überraschungsmenü zusammen: Ohne Absprache wählt die Küche eine von ${a} Suppen, eines von ${b} Hauptgerichten und einen von ${c} Nachtischen aus. Einer der Nachtische ist Schokopudding. Wie viele verschiedene Menüs sind möglich? Wie viele davon enthalten Schokopudding?`,
      given: [`${a} Suppen, ${b} Hauptgerichte, ${c} Nachtische`],
      fields: [
        numberField("Menüs insgesamt:", a * b * c, "", 0, { slips: [{ value: a + b + c, hint: "Jede Suppe passt zu jedem Hauptgericht und jedem Nachtisch: multiplizieren." }] }),
        numberField("Menüs mit Schokopudding:", a * b, "", 0, { slips: [{ value: 1, hint: "Der Pudding ist fest, Suppe und Hauptgericht können sich noch ändern." }] }),
      ],
      steps: [`Zählprinzip: ${a} · ${b} · ${c} = ${a * b * c} Menüs.`, `Mit Schokopudding ist die 3. Stufe fest (1 Ast): ${a} · ${b} · 1 = ${a * b}.`, `<strong>${a * b * c} Menüs, davon ${a * b} mit Schokopudding.</strong>`],
      meta: { level: 2, context, a, b, c, total: a * b * c, second: a * b },
    };
  }
  if (context === 3) {
    const n = rng.int(4, 5);
    const runners = ["Anna", "Ben", "Cem", "Dana", "Emil"].slice(0, n);
    const total = upTo(n).reduce((x, y) => x * y, 1);
    const first = total / n;
    return {
      prompt: `${n} Läuferinnen und Läufer einer Staffel (${runners.join(", ")}) losen aus, in welcher Reihenfolge sie laufen. Wie viele verschiedene Reihenfolgen sind möglich? Bei wie vielen davon läuft ${runners[0]} als Erste?`,
      given: [`${n} Personen`, "jede läuft genau einmal"],
      fields: [
        numberField("Reihenfolgen:", total, "", 0, { slips: [{ value: n ** n, hint: "Wer schon eingeteilt ist, kann nicht noch einmal laufen: Jede Stufe hat einen Ast weniger." }] }),
        numberField(`${runners[0]} zuerst:`, first, "", 0),
      ],
      steps: [`Platz 1: ${n} Möglichkeiten, Platz 2: ${n - 1}, …: ${upTo(n).reverse().join(" · ")} = ${total}`, `Steht ${runners[0]} fest, bleiben ${upTo(n - 1).reverse().join(" · ")} = ${first} Reihenfolgen für die anderen.`, `<strong>${total} Reihenfolgen, bei ${first} davon läuft ${runners[0]} zuerst.</strong>`],
      meta: { level: 2, context, n, total, second: first },
    };
  }
  // two dice as a pair: all pairs, and those of a condition counted by the Zählprinzip
  const variant = rng.int(0, 2);
  const k = rng.int(2, 5);
  const dice = [
    {
      question: "Bei wie vielen zeigen die beiden Würfel verschiedene Augenzahlen?",
      label: "verschiedene Augenzahlen:",
      second: 30,
      slips: [{ value: 15, hint: "(2 | 5) und (5 | 2) sind verschiedene Augenpaare." }, { value: 6, hint: "Das sind die Paschs; gesucht sind die anderen Augenpaare." }],
      step: "Verschiedene Augenzahlen: Zu jeder Zahl des roten Würfels passen nur noch 5 Zahlen des blauen, also 6 · 5 = 30. Probe: 36 Augenpaare minus 6 Paschs.",
      result: "30 mit verschiedenen Augenzahlen",
    },
    {
      question: "Bei wie vielen zeigen beide Würfel eine ungerade Augenzahl?",
      label: "beide ungerade:",
      second: 9,
      slips: [{ value: 6, hint: "Die Astzahlen werden multipliziert, nicht addiert: 3 ungerade Augenzahlen beim roten, zu jeder 3 beim blauen." }, { value: 18, hint: "Beide Würfel müssen ungerade zeigen, nicht nur einer." }],
      step: "Beide ungerade: 3 Äste (1, 3, 5) beim roten Würfel, an jedem 3 beim blauen, also 3 · 3 = 9.",
      result: "9 mit zwei ungeraden Augenzahlen",
    },
    {
      question: `Bei wie vielen zeigt der rote Würfel höchstens ${k} und der blaue eine gerade Augenzahl?`,
      label: `rot höchstens ${k}, blau gerade:`,
      second: 3 * k,
      slips: [{ value: k + 3, hint: "Die Astzahlen werden multipliziert, nicht addiert." }, { value: 3 * (k - 1), hint: `„Höchstens ${k}“ schließt die ${k} selbst ein.` }],
      step: `Der rote Würfel hat ${k} passende Äste (1 bis ${k}), an jedem hat der blaue 3 (2, 4, 6), also ${k} · 3 = ${3 * k}.`,
      result: `${3 * k} mit rot höchstens ${k} und blau gerade`,
    },
  ][variant];
  return {
    prompt: `Ein roter und ein blauer Würfel werden geworfen; ein Ergebnis ist das Augenpaar (rot | blau). Wie viele Ergebnisse gibt es? ${dice.question}`,
    given: ["zwei Würfel, das Augenpaar wird notiert"],
    fields: [
      numberField("Ergebnisse:", 36, "", 0, { slips: [{ value: 12, hint: "Jede Augenzahl des roten Würfels passt zu jeder des blauen: 6 · 6." }] }),
      numberField(dice.label, dice.second, "", 0, { slips: dice.slips.filter((s, i, all) => all.findIndex((t) => t.value === s.value) === i) }),
    ],
    steps: ["Zählprinzip: 6 · 6 = 36 Augenpaare.", dice.step, `<strong>36 Ergebnisse, davon ${dice.result}.</strong>`],
    meta: { level: 2, context, variant, k, total: 36, second: dice.second },
  };
}

/** Events about a coin thrown several times, with the K counted. */
const COIN_EVENTS: Array<{ words: string; test: (p: string) => boolean; neighbour: number }> = [
  { words: "genau einmal Kopf", test: (p) => count(p, "K") === 1, neighbour: 1 },
  { words: "mindestens einmal Kopf", test: (p) => count(p, "K") >= 1, neighbour: 0 },
  { words: "genau zweimal Kopf", test: (p) => count(p, "K") === 2, neighbour: 3 },
  { words: "mindestens zweimal Kopf", test: (p) => count(p, "K") >= 2, neighbour: 2 },
  { words: "höchstens einmal Kopf", test: (p) => count(p, "K") <= 1, neighbour: 0 },
  { words: "jedes Mal dieselbe Seite", test: (p) => [...p].every((c) => c === p[0]), neighbour: 6 },
  { words: "der erste und der letzte Wurf zeigen dieselbe Seite", test: (p) => p[0] === p[p.length - 1], neighbour: 5 },
];

function count(path: string, symbol: string): number {
  return [...path].filter((c) => c === symbol).length;
}

/** Events about drawing with replacement from red and blue balls, each with the one it is easily confused with. */
const RB_EVENTS: Array<{ words: string; test: (p: string) => boolean; neighbour: number }> = [
  { words: "genau eine rote Kugel", test: (p) => count(p, "r") === 1, neighbour: 1 },
  { words: "mindestens eine rote Kugel", test: (p) => count(p, "r") >= 1, neighbour: 0 },
  { words: "keine rote Kugel", test: (p) => count(p, "r") === 0, neighbour: 3 },
  { words: "höchstens eine rote Kugel", test: (p) => count(p, "r") <= 1, neighbour: 0 },
  { words: "jedes Mal dieselbe Farbe", test: (p) => [...p].every((c) => c === p[0]), neighbour: 2 },
  { words: "die letzte Kugel ist blau", test: (p) => p[p.length - 1] === "b", neighbour: 6 },
  { words: "die erste Kugel ist blau", test: (p) => p[0] === "b", neighbour: 5 },
];

/** Events about two or three draws from an urn with red, blue and maybe green balls. */
const URN_EVENTS: Array<{ words: string; test: (p: string) => boolean }> = [
  { words: "genau eine rote Kugel", test: (p) => count(p, "r") === 1 },
  { words: "mindestens eine rote Kugel", test: (p) => count(p, "r") >= 1 },
  { words: "keine rote Kugel", test: (p) => count(p, "r") === 0 },
  { words: "lauter gleichfarbige Kugeln", test: (p) => [...p].every((c) => c === p[0]) },
  { words: "die letzte Kugel ist blau", test: (p) => p[p.length - 1] === "b" },
  { words: "mindestens zwei verschiedene Farben", test: (p) => new Set(p).size >= 2 },
];

function pfadeTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const s = rng.int(2, 3);
    const useUrn = rng.next() < 0.4;
    const paths = drawSequences(useUrn ? ["r", "b"] : ["K", "Z"], null, s).map((p) => p.join(""));
    const pool = useUrn ? RB_EVENTS : COIN_EVENTS;
    for (let attempt = 0; ; attempt++) {
      const id = rng.int(0, pool.length - 1);
      const event = pool[id];
      const E = paths.filter(event.test);
      const lureA = paths.filter(pool[event.neighbour].test);
      // forgotten order: only the first path of each combination
      const lureB = E.length >= 2 ? E.filter((p, i) => E.findIndex((q) => [...q].sort().join("") === [...p].sort().join("")) === i) : [...E, paths.find((p) => !E.includes(p)) ?? paths[0]];
      const lureC = E.length >= 2 ? E.slice(0, -1) : paths.filter((p) => !E.includes(p)).slice(0, 2);
      const lure2 = setText(lureB) !== setText(E) ? lureB : lureC;
      const texts = [setText(E), setText(lureA), setText(lure2)];
      if ((E.length === 0 || new Set(texts).size < 3) && attempt < 40) continue;
      const what = useUrn ? `Aus einer Urne mit roten (r) und blauen (b) Kugeln wird ${s === 2 ? "zweimal" : "dreimal"} mit Zurücklegen gezogen.` : `Eine Münze wird ${s === 2 ? "zweimal" : "dreimal"} geworfen (K Kopf, Z Zahl).`;
      return {
        prompt: `${what} Zeichne das Baumdiagramm. Welche Pfade gehören zum Ereignis E: „${event.words}“, und wie viele sind es?`,
        given: [`alle Pfade: ${setText(paths)}`],
        formulaHint: `Prüfe jeden Pfad einzeln. Die Reihenfolge zählt: ${useUrn ? "rb und br" : "KZ und ZK"} sind zwei verschiedene Pfade.`,
        fields: [shuffledChoice(rng, "E =", texts[0], texts.slice(1)), numberField("Anzahl der Pfade von E:", E.length, "", 0, { slips: lureA.length !== E.length ? [{ value: lureA.length, hint: `Lies E genau: „${event.words}“.` }] : [] })],
        steps: [
          `Zählprinzip: ${Array(s).fill(2).join(" · ")} = ${paths.length} Pfade: ${setText(paths)}`,
          `Zu „${event.words}“ ${E.length === 1 ? "passt nur" : "passen"} ${joinAnd(E)}.`,
          `<strong>E = ${setText(E)}, das ${E.length === 1 ? "ist 1 Pfad" : `sind ${E.length} Pfade`}.</strong>`,
        ],
        meta: { level: 1, urn: useUrn ? 1 : 0, s, id, count: E.length },
      };
    }
  }
  for (let attempt = 0; ; attempt++) {
    const red = rng.int(1, 3);
    const blue = rng.int(1, 2);
    const green = rng.int(0, 1);
    const s = rng.int(2, 3);
    const symbols = ["r", "b", "g"].filter((_, i) => [red, blue, green][i] > 0);
    const counts = [red, blue, green].filter((c) => c > 0);
    if (red + blue + green < s) continue;
    const paths = drawSequences(symbols, counts, s).map((p) => p.join(""));
    const full = symbols.length ** s;
    const impossible = drawSequences(symbols, null, s).map((p) => p.join("")).filter((p) => !paths.includes(p));
    const id = rng.int(0, URN_EVENTS.length - 1);
    const E = paths.filter(URN_EVENTS[id].test);
    // an impossible path always repeats a colour; a possible one must repeat one too, or the repetition gives the answer away
    const repeats = (p: string) => new Set(p).size < p.length;
    const possibleRepeats = paths.filter(repeats);
    if ((impossible.length === 0 || possibleRepeats.length === 0 || E.length === 0 || E.length === paths.length || paths.length > 18) && attempt < 80) continue;
    const content = ballsText([
      [red, "rote"],
      [blue, "blaue"],
      [green, "grüne"],
    ]);
    const nope = rng.pick(impossible);
    const twin = rng.pick(possibleRepeats.length > 0 ? possibleRepeats : paths);
    const possible = [twin, rng.pick(paths.filter((p) => p !== twin))];
    const Ewith = drawSequences(symbols, null, s).map((p) => p.join("")).filter(URN_EVENTS[id].test).length;
    return {
      prompt: `In einer Urne liegen ${content}. Es wird ${s === 2 ? "zweimal" : "dreimal"} nacheinander ohne Zurücklegen gezogen und jedes Mal die Farbe notiert (r, b${green ? ", g" : ""}). Wie viele Ergebnisse hat das Zufallsexperiment? Wie viele Pfade gehören zum Ereignis „${URN_EVENTS[id].words}“? Welche der drei Farbfolgen unten kann gar nicht vorkommen?`,
      given: [capital(content), `${s === 2 ? "zwei" : "drei"} Züge ohne Zurücklegen`],
      fields: [
        numberField("Anzahl der Ergebnisse:", paths.length, "", 0, { slips: [{ value: full, hint: "Ohne Zurücklegen: Ist eine Farbe aufgebraucht, hat sie im Baum keinen Ast mehr." }] }),
        numberField(`Pfade von „${URN_EVENTS[id].words}“:`, E.length, "", 0, { slips: Ewith !== E.length ? [{ value: Ewith, hint: "Zähle nur Pfade, die es ohne Zurücklegen wirklich gibt." }] : [] }),
        shuffledChoice(rng, "unmöglich ist:", nope, possible),
      ],
      steps: [
        `Mit Zurücklegen wären es ${Array(s).fill(symbols.length).join(" · ")} = ${full} Pfade. Ohne Zurücklegen fehlen die Pfade, für die die Kugeln nicht reichen: ${joinAnd(impossible)}.`,
        `Es bleiben ${paths.length} Pfade: ${setText(paths)}`,
        `Zu „${URN_EVENTS[id].words}“ ${E.length === 1 ? "gehört nur" : "gehören"} ${joinAnd(E)}.`,
        `<strong>${paths.length} Ergebnisse; ${E.length === 1 ? "1 Pfad gehört" : `${E.length} Pfade gehören`} zum Ereignis; unmöglich ist ${nope}.</strong>`,
      ],
      meta: { level: 2, red, blue, green, s, id, total: paths.length, count: E.length },
    };
  }
}

const baumdiagramm: Lesson = {
  id: "dz-2-baumdiagramm",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "7.2 Baumdiagramme",
  subtitle: "Mehrstufige Zufallsexperimente und das Zählprinzip",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Ergebnisse im Baumdiagramm`,
  whyItMatters:
    "Zweimal würfeln, drei Lose ziehen, einen Zahlencode einstellen: Viele Zufallsexperimente laufen in Stufen ab. Mit dem Baumdiagramm übersiehst du alle Ergebnisse, und mit dem Zählprinzip weißt du ihre Anzahl, auch wenn der Baum zu groß zum Zeichnen ist.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5:</strong> Beim Zählen von Möglichkeiten, etwa bei Kleidungskombinationen, hast du Baumdiagramme und das Zählprinzip benutzt. Jetzt beschreibst du damit Zufallsexperimente aus mehreren Schritten.</p>
    <p>Ein Zufallsexperiment aus mehreren Schritten heißt <strong>mehrstufig</strong>: eine Münze dreimal werfen, zwei Würfel werfen, zweimal aus einer Urne ziehen. Im <strong>Baumdiagramm</strong> ist jeder Schritt eine <strong>Stufe</strong>. Von jedem Punkt gehen so viele <strong>Äste</strong> aus, wie der Schritt Möglichkeiten hat. Ein <strong>Pfad</strong> vom Start bis zum Ende ist genau ein <strong>Ergebnis</strong>. Man schreibt es als Folge in der richtigen Reihenfolge: KZ heißt erst Kopf, dann Zahl. KZ und ZK sind verschiedene Ergebnisse.</p>
    <p><strong>Zählprinzip:</strong> Hat eine Stufe an jedem Punkt gleich viele Äste, ist die Anzahl der Ergebnisse das Produkt der Astzahlen. Dreimal eine Münze werfen: 2 · 2 · 2 = 8 Ergebnisse. Zwei Würfel, als Augenpaar notiert: 6 · 6 = 36.</p>
    <p><strong>Mit und ohne Zurücklegen:</strong> Legst du die gezogene Kugel zurück, ist die Urne vor jedem Zug wieder voll, und jede Stufe hat dieselben Äste. Ohne Zurücklegen fehlt die gezogene Kugel. Ist eine Farbe aufgebraucht, fällt ihr Ast weg. Aus einer Urne mit einer roten, einer blauen und einer grünen Kugel kannst du zweimal ohne Zurücklegen ziehen: 3 · 2 = 6 Ergebnisse statt 3 · 3 = 9 mit Zurücklegen.</p>
    <div class="example"><strong>Beispiel:</strong> In einer Urne liegen 2 rote Kugeln (r) und 1 blaue Kugel (b). Es wird zweimal ohne Zurücklegen gezogen.<br>
      1. Zug: Äste r und b.<br>
      2. Zug nach r: Es liegen noch eine rote und eine blaue Kugel in der Urne, also Äste r und b. Nach b: Es liegen nur noch rote Kugeln darin, also nur der Ast r.<br>
      Pfade: rr, rb, br. Das sind 3 Ergebnisse; mit Zurücklegen wären es 2 · 2 = 4, denn dann gäbe es auch bb.<br>
      Ereignis „genau eine rote Kugel“: die Pfade rb und br, also E = {rb; br}.</div>
    <p>Ein <strong>Ereignis</strong> ist im Baumdiagramm eine Menge von Pfaden. Du findest sie, indem du jeden Pfad prüfst. Beim dreimaligen Münzwurf gehören zu „genau einmal Kopf“ die Pfade KZZ, ZKZ und ZZK, zu „mindestens einmal Kopf“ alle Pfade außer ZZZ, also 7.</p>
    <p><strong>Vorsicht:</strong> Die Pfade kommen nicht unbedingt gleich oft vor. Liegen 3 rote und 1 blaue Kugel in der Urne und ziehst du zweimal mit Zurücklegen, kommt rr viel öfter vor als bb, obwohl beides ein Pfad ist. Wie oft etwas eintritt, untersuchst du in Lektion 7.4 mit Häufigkeiten.</p>
    <p><strong>Typische Fehler:</strong> die Reihenfolge vergessen und KZ und ZK nur einmal zählen; ohne Zurücklegen trotzdem überall alle Äste zeichnen; die Astzahlen addieren statt multiplizieren.</p>
    <div class="merke"><strong>Merke:</strong> Jeder Pfad im Baumdiagramm ist ein Ergebnis. Zählprinzip: Anzahl der Ergebnisse = Produkt der Astzahlen der Stufen. Ohne Zurücklegen fällt der Ast einer Farbe weg, sobald sie aufgebraucht ist.</div>
  `,
  formulas: [
    { name: "Zählprinzip", html: "Anzahl der Ergebnisse = n<sub>1</sub> · n<sub>2</sub> · n<sub>3</sub>", quantities: "n₁, n₂, n₃: Äste der 1., 2. und 3. Stufe, an jedem Punkt einer Stufe gleich viele" },
    { name: "Ergebnis im Baumdiagramm", html: "ein Pfad = ein Ergebnis, z. B. KZK", quantities: "die Reihenfolge zählt: KZ und ZK sind verschiedene Ergebnisse" },
    { name: "Ziehen ohne Zurücklegen", html: "3 verschiedene Kugeln, 2 Züge: 3 · 2 = 6", quantities: "die gezogene Kugel fehlt; eine aufgebrauchte Farbe hat keinen Ast mehr" },
  ],
  quiz: {
    question: "Eine Münze wird dreimal geworfen. Wie viele Pfade hat das Baumdiagramm, und wie viele gehören zum Ereignis „genau zweimal Kopf“?",
    options: ["6 Pfade, davon 3", "8 Pfade, davon 3", "8 Pfade, davon 1", "9 Pfade, davon 3"],
    correctIndex: 1,
    explanation:
      "Jeder Wurf hat 2 Äste: 2 · 2 · 2 = 8 Pfade. Genau zweimal Kopf sind KKZ, KZK und ZKK, also 3. Mit 6 hat jemand 2 + 2 + 2 gerechnet, mit 9 hat jemand 3 · 3 gerechnet und die Zahl der Würfe mit der Zahl der Äste verwechselt; nur 1 Pfad käme heraus, wenn die Reihenfolge egal wäre.",
  },
  lab: {
    kind: "tree-diagram",
    title: "Labor: Baumdiagramm-Baukasten",
    intro:
      "Wähle Münze oder Urne, die Zahl der Stufen und bei der Urne ihren Inhalt. Jeder Pfad vom Start nach unten ist ein Ergebnis. Wähle ein Ereignis: Seine Pfade werden lila. Vergleiche das Ziehen mit und ohne Zurücklegen.",
    params: [
      { type: "choice", key: "exp", label: "Zufallsexperiment", options: TREE_EXPERIMENTS.map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "stufen", label: "Stufen (Würfe bzw. Züge)", unit: "", min: 1, max: 3, step: 1, value: 2 },
      { type: "range", key: "rot", label: "rote Kugeln", unit: "", min: 1, max: 3, step: 1, value: 2, showIf: (v) => v.exp !== 0 },
      { type: "range", key: "blau", label: "blaue Kugeln", unit: "", min: 1, max: 3, step: 1, value: 2, showIf: (v) => v.exp !== 0 },
      { type: "range", key: "gruen", label: "grüne Kugeln", unit: "", min: 0, max: 2, step: 1, value: 0, showIf: (v) => v.exp !== 0 },
      { type: "choice", key: "ereignis", label: "Ereignis E", options: TREE_EVENTS.map((e, value) => ({ value, label: e.label })), value: 0 },
    ],
    readouts: [
      { key: "anzahl", label: "Ergebnisse (Pfade)", compute: (v) => countingText(treeSetup(v)) },
      {
        key: "ereignis",
        label: "Ereignis E",
        emphasis: true,
        compute: (v) => {
          const s = treeSetup(v);
          return `„${treeEventWords(s, v.ereignis)}“: ${treeEventPaths(s, v.ereignis).length} von ${treePaths(s).length} Pfaden`;
        },
      },
      { key: "liste", label: "Pfade von E", compute: (v) => shortSetText(treeEventPaths(treeSetup(v), v.ereignis), 12) },
      {
        key: "vergleich",
        label: "mit / ohne Zurücklegen",
        compute: (v) => {
          const s = treeSetup(v);
          if (s.exp === 0) return "Münze: jeder Wurf K oder Z";
          const other = treePaths({ ...s, exp: s.exp === 1 ? 2 : 1 }).length;
          return s.exp === 1 ? `ohne Zurücklegen: ${other} Pfade` : `mit Zurücklegen: ${other} Pfade`;
        },
      },
    ],
    goals: [
      {
        id: "sieben",
        text: "Wirf die Münze dreimal und finde ein Ereignis, zu dem genau 7 der 8 Pfade gehören. Welcher Pfad fehlt?",
        check: (v) => v.exp === 0 && v.stufen === 3 && treeEventPaths(treeSetup(v), v.ereignis).length === 7,
      },
      {
        id: "neun",
        text: "Ziehe mit Zurücklegen: Stelle Urne und Zahl der Züge so ein, dass der Baum genau 9 Pfade hat. Wie lautet das Zählprinzip dazu?",
        check: (v) => v.exp === 1 && treePaths(treeSetup(v)).length === 9,
      },
      {
        id: "weniger",
        text: "Ziehe ohne Zurücklegen und stelle die Urne so ein, dass im Baum Äste fehlen, weil eine Farbe aufgebraucht ist. Wie viele Pfade wären es mit Zurücklegen?",
        check: (v) => {
          const s = treeSetup(v);
          return s.exp === 2 && treeDepth(s) >= 2 && treePaths(s).length < pathsWithReplacement(s);
        },
      },
    ],
  },
  exercises: [
    { id: "anzahl", make: (rng, level) => anzahlTask(rng, level) },
    { id: "pfade", make: (rng, level) => pfadeTask(rng, level) },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest Baumdiagramme, zählst Ergebnisse mit dem Zählprinzip und liest Ereignisse als Pfade ab.",
};

// ─── 7.3 Vierfeldertafeln ──────────────────────────────────────────────────

const CELL = "border:1px solid var(--line);padding:0.2rem 0.55rem;text-align:center";
const HEAD = `${CELL};background:var(--elevated)`;

/** Two features with two values each, as the tasks count them. Cells: a = (row 1, col 1), b = (row 1, col 2), c = (row 2, col 1), d = (row 2, col 2). */
export interface TwoWayContext {
  intro: string;
  noun: string;
  rowFeature: string;
  colFeature: string;
  rows: [string, string];
  cols: [string, string];
  /** The group of each cell as a noun phrase: [[a, b], [c, d]]. */
  cell: [[string, string], [string, string]];
  row: [string, string];
  col: [string, string];
  /** Relative clauses after "die": row 1 or column 1, exactly one of them, neither. */
  or: string;
  one: string;
  neither: string;
  ranges: Array<[number, number]>;
}

export const TWO_WAY: TwoWayContext[] = [
  {
    intro: "In der Jahrgangsstufe 8 einer Realschule wurde gezählt, wer eine Brille trägt.",
    noun: "Jugendliche",
    rowFeature: "Geschlecht",
    colFeature: "Brille",
    rows: ["Mädchen", "Jungen"],
    cols: ["mit Brille", "ohne Brille"],
    cell: [["Mädchen mit Brille", "Mädchen ohne Brille"], ["Jungen mit Brille", "Jungen ohne Brille"]],
    row: ["Mädchen", "Jungen"],
    col: ["Jugendliche mit Brille", "Jugendliche ohne Brille"],
    or: "ein Mädchen sind oder eine Brille tragen",
    one: "ein Mädchen sind oder eine Brille tragen, aber nicht beides",
    neither: "weder ein Mädchen sind noch eine Brille tragen",
    ranges: [[3, 12], [12, 26], [2, 12], [12, 26]],
  },
  {
    intro: "In den Klassen 8a und 8b wurde gefragt, wer ein Haustier hat.",
    noun: "Schülerinnen und Schüler",
    rowFeature: "Klasse",
    colFeature: "Haustier",
    rows: ["8a", "8b"],
    cols: ["mit Haustier", "ohne Haustier"],
    cell: [["Schülerinnen und Schüler der 8a mit Haustier", "Schülerinnen und Schüler der 8a ohne Haustier"], ["Schülerinnen und Schüler der 8b mit Haustier", "Schülerinnen und Schüler der 8b ohne Haustier"]],
    row: ["Schülerinnen und Schüler der 8a", "Schülerinnen und Schüler der 8b"],
    col: ["Schülerinnen und Schüler mit Haustier", "Schülerinnen und Schüler ohne Haustier"],
    or: "in die 8a gehen oder ein Haustier haben",
    one: "in die 8a gehen oder ein Haustier haben, aber nicht beides",
    neither: "weder in die 8a gehen noch ein Haustier haben",
    ranges: [[6, 16], [6, 16], [6, 16], [6, 16]],
  },
  {
    intro: "Bei einer Reihenuntersuchung wurden Erwachsene mit einem Schnelltest auf eine Krankheit getestet.",
    noun: "Personen",
    rowFeature: "Gesundheit (krank oder gesund)",
    colFeature: "Testergebnis",
    rows: ["krank", "gesund"],
    cols: ["Test positiv", "Test negativ"],
    cell: [["kranke Personen mit positivem Test", "kranke Personen mit negativem Test"], ["gesunde Personen mit positivem Test", "gesunde Personen mit negativem Test"]],
    row: ["kranke Personen", "gesunde Personen"],
    col: ["Personen mit positivem Test", "Personen mit negativem Test"],
    or: "krank sind oder einen positiven Test haben",
    one: "krank sind oder einen positiven Test haben, aber nicht beides",
    neither: "weder krank sind noch einen positiven Test haben",
    ranges: [[18, 45], [1, 6], [8, 30], [150, 400]],
  },
  {
    intro: "In einer Jahrgangsstufe wurde gefragt, wer in einem Sportverein ist und wer ein Instrument spielt.",
    noun: "Jugendliche",
    rowFeature: "Sportverein",
    colFeature: "Instrument",
    rows: ["im Sportverein", "kein Sportverein"],
    cols: ["mit Instrument", "ohne Instrument"],
    cell: [["Jugendliche im Sportverein mit Instrument", "Jugendliche im Sportverein ohne Instrument"], ["Jugendliche ohne Sportverein mit Instrument", "Jugendliche ohne Sportverein und ohne Instrument"]],
    row: ["Jugendliche im Sportverein", "Jugendliche ohne Sportverein"],
    col: ["Jugendliche mit Instrument", "Jugendliche ohne Instrument"],
    or: "in einem Sportverein sind oder ein Instrument spielen",
    one: "in einem Sportverein sind oder ein Instrument spielen, aber nicht beides",
    neither: "weder in einem Sportverein sind noch ein Instrument spielen",
    ranges: [[4, 15], [10, 30], [3, 12], [8, 25]],
  },
];

/** The cells of a context, drawn from its plausible ranges; in the 8a/8b context each class has 18 to 32 pupils. */
function drawCells(rng: Rng, ctx: number): [number, number, number, number] {
  for (;;) {
    const cells = TWO_WAY[ctx].ranges.map(([lo, hi]) => rng.int(lo, hi)) as [number, number, number, number];
    if (ctx !== 1) return cells;
    const [a, b, c, d] = cells;
    if (a + b >= 18 && a + b <= 32 && c + d >= 18 && c + d <= 32) return cells;
  }
}

/**
 * A Vierfeldertafel as HTML. `values` are a, b, a + b, c, d, c + d, a + c,
 * b + d, N; null leaves a cell empty, a string (such as "?") is shown as it is.
 */
function fourFieldTable(ctx: TwoWayContext, values: Array<number | string | null>): string {
  const show = (x: number | string | null) => (x === null ? "" : String(x));
  const td = (x: number | string | null) => `<td style="${CELL}">${show(x)}</td>`;
  const th = (x: string) => `<th style="${HEAD}">${x}</th>`;
  return (
    `<table style="border-collapse:collapse;margin:0.3rem 0">` +
    `<tr>${th("")}${th(ctx.cols[0])}${th(ctx.cols[1])}${th("Summe")}</tr>` +
    `<tr>${th(ctx.rows[0])}${td(values[0])}${td(values[1])}${td(values[2])}</tr>` +
    `<tr>${th(ctx.rows[1])}${td(values[3])}${td(values[4])}${td(values[5])}</tr>` +
    `<tr>${th("Summe")}${td(values[6])}${td(values[7])}${td(values[8])}</tr>` +
    `</table>`
  );
}

/** A group after an article: "die Jugendlichen", "der gesunden Personen"; nouns such as "Mädchen" stay as they are. */
const weak = (phrase: string) => phrase.replace(/^Jugendliche/, "Jugendlichen").replace(/^gesunde /, "gesunden ").replace(/^kranke /, "kranken ");

const allValues = (a: number, b: number, c: number, d: number) => [a, b, a + b, c, d, c + d, a + c, b + d, a + b + c + d];

function ergaenzenTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const ctxIndex = rng.int(0, TWO_WAY.length - 1);
    const ctx = TWO_WAY[ctxIndex];
    const cells = drawCells(rng, ctxIndex);
    const [a, b, c, d] = cells;
    const N = a + b + c + d;
    const missing = rng.int(0, 3);
    const row = missing < 2 ? 0 : 1;
    const col = missing % 2;
    const rowMate = cells[row * 2 + (1 - col)];
    const colMate = cells[(1 - row) * 2 + col];
    const diagonal = cells[(1 - row) * 2 + (1 - col)];
    const shown: Array<number | string | null> = [a, b, null, c, d, null, null, null, N];
    shown[[0, 1, 3, 4][missing]] = "?";
    shown[row === 0 ? 2 : 5] = "?";
    shown[col === 0 ? 6 : 7] = "?";
    const rowSum = cells[row * 2] + cells[row * 2 + 1];
    const colSum = cells[col] + cells[2 + col];
    const value = cells[missing];
    return {
      prompt: `${ctx.intro} Die Vierfeldertafel ist nur teilweise ausgefüllt. Berechne die Felder mit „?“: Wie viele ${ctx.cell[row][col]} gibt es? Wie viele ${ctx.row[row]} und wie viele ${ctx.col[col]} sind es insgesamt?`,
      given: [fourFieldTable(ctx, shown)],
      formulaHint: "Alle vier inneren Felder ergeben zusammen die Gesamtzahl; jede Zeile und jede Spalte ergibt ihre Summe.",
      fields: [
        numberField(`${capital(ctx.cell[row][col])}:`, value, "", 0, { slips: [{ value: N - rowMate - colMate, hint: "Ziehe alle drei bekannten Felder von der Gesamtzahl ab, auch das diagonal gegenüber." }] }),
        numberField(`${capital(ctx.row[row])} insgesamt:`, rowSum, "", 0),
        numberField(`${capital(ctx.col[col])} insgesamt:`, colSum, "", 0, { slips: [{ value: rowSum, hint: "Das ist die Zeilensumme. Gesucht ist die Summe der Spalte." }] }),
      ],
      steps: [
        `Fehlendes Feld: ${N} − ${rowMate} − ${colMate} − ${diagonal} = ${value}`,
        `Zeile „${ctx.rows[row]}“: ${cells[row * 2]} + ${cells[row * 2 + 1]} = ${rowSum}; Spalte „${ctx.cols[col]}“: ${cells[col]} + ${cells[2 + col]} = ${colSum}`,
        `Probe: Die Summen der Zeilen und die der Spalten ergeben beide ${N}.`,
        `<strong>${capital(ctx.cell[row][col])}: ${value}; ${ctx.row[row]} insgesamt: ${rowSum}; ${ctx.col[col]} insgesamt: ${colSum}.</strong>`,
      ],
      meta: { level: 1, ctx: ctxIndex, a, b, c, d, missing },
    };
  }
  // sums and shares: which part of each row has the first column
  const ctxIndex = rng.int(0, TWO_WAY.length - 1);
  const ctx = TWO_WAY[ctxIndex];
  const SHARES: Array<[number, number, string]> =
    ctxIndex === 2
      ? [
          [9, 10, "90 %"],
          [19, 20, "95 %"],
          [4, 5, "80 %"],
          [3, 4, "drei Viertel"],
        ]
      : [
          [1, 2, "die Hälfte"],
          [1, 3, "ein Drittel"],
          [1, 4, "ein Viertel"],
          [3, 4, "drei Viertel"],
          [2, 5, "zwei Fünftel"],
          [1, 5, "ein Fünftel"],
          [3, 10, "30 %"],
          [1, 10, "10 %"],
          [3, 5, "60 %"],
        ];
  const SMALL: Array<[number, number, string]> = [
    [1, 20, "5 %"],
    [1, 10, "10 %"],
    [3, 50, "6 %"],
  ];
  const s1 = rng.pick(SHARES);
  let s2 = ctxIndex === 2 ? rng.pick(SMALL) : rng.pick(SHARES);
  while (s2[2] === s1[2]) s2 = rng.pick(SHARES);
  const sizeRange: Array<[number, number]> = ctxIndex === 0 ? [[24, 60], [24, 60]] : ctxIndex === 1 ? [[20, 32], [20, 32]] : ctxIndex === 2 ? [[20, 80], [180, 480]] : [[20, 50], [20, 50]];
  const multiple = (lo: number, hi: number, k: number) => k * rng.int(Math.ceil(lo / k), Math.floor(hi / k));
  const r1 = multiple(sizeRange[0][0], sizeRange[0][1], s1[1]);
  const r2 = multiple(sizeRange[1][0], sizeRange[1][1], s2[1]);
  const a = (r1 * s1[0]) / s1[1];
  const c = (r2 * s2[0]) / s2[1];
  const b = r1 - a;
  const d = r2 - c;
  const N = r1 + r2;
  const setting = [
    `Es sind ${N} Jugendliche, ${r1} davon Mädchen. ${capital(s1[2])} der Mädchen und ${s2[2]} der Jungen tragen eine Brille.`,
    `In der 8a sind ${r1}, in der 8b ${r2} Schülerinnen und Schüler. In der 8a hat ${s1[2]} der Klasse ein Haustier, in der 8b sind es ${s2[2]}.`,
    `Es wurden ${N} Personen getestet, ${r1} davon sind krank. Bei ${s1[2]} der Kranken und bei ${s2[2]} der Gesunden ist der Test positiv.`,
    `Es sind ${N} Jugendliche, ${r1} davon im Sportverein. ${capital(s1[2])} der Vereinsmitglieder und ${s2[2]} der übrigen spielen ein Instrument.`,
  ][ctxIndex];
  const wrongBase = (N * s2[0]) / s2[1];
  return {
    prompt: `${ctx.intro} ${setting} Lege eine Vierfeldertafel an. Wie viele ${ctx.cell[1][0]} gibt es? Wie viele ${ctx.col[0]} sind es insgesamt, und wie viele ${ctx.cell[1][1]}?`,
    given: [ctxIndex === 1 ? `8a: ${r1}, 8b: ${r2}` : `insgesamt ${N}, ${ctx.row[0]}: ${r1}`, `${ctx.cols[0]}: ${s1[2]} der ${weak(ctx.row[0])}, ${s2[2]} der ${weak(ctx.row[1])}`],
    fields: [
      numberField(`${capital(ctx.cell[1][0])}:`, c, "", 0, { slips: Number.isInteger(wrongBase) && wrongBase !== c ? [{ value: wrongBase, hint: `Der Anteil ${s2[2]} bezieht sich nur auf die ${weak(ctx.row[1])}, nicht auf alle.` }] : [] }),
      numberField(`${capital(ctx.col[0])}:`, a + c, "", 0),
      numberField(`${capital(ctx.cell[1][1])}:`, d, "", 0, { slips: [{ value: N - (a + c), hint: `Das sind alle ${weak(ctx.col[1])}. Gesucht sind nur die ${weak(ctx.cell[1][1])}.` }] }),
    ],
    steps: [
      `${capital(ctx.cell[0][0])}: ${s1[2]} von ${r1} = ${a}; also ${ctx.cell[0][1]}: ${r1} − ${a} = ${b}.`,
      `${capital(ctx.row[1])}: ${r2}; davon ${s2[2]}: ${c} ${ctx.cell[1][0]}, also ${r2} − ${c} = ${d} ${ctx.cell[1][1]}.`,
      fourFieldTable(ctx, allValues(a, b, c, d)),
      `<strong>${capital(ctx.cell[1][0])}: ${c}; ${ctx.col[0]}: ${a} + ${c} = ${a + c}; ${ctx.cell[1][1]}: ${d}.</strong>`,
    ],
    meta: { level: 2, ctx: ctxIndex, a, b, c, d, r1, r2, n1: s1[0], d1: s1[1], n2: s2[0], d2: s2[1] },
  };
}

function lesenTask(rng: Rng, level: 1 | 2): ExerciseTask {
  const ctxIndex = rng.int(0, TWO_WAY.length - 1);
  const ctx = TWO_WAY[ctxIndex];
  const [a, b, c, d] = drawCells(rng, ctxIndex);
  const cells = [a, b, c, d];
  if (level === 1) {
    const i = rng.int(0, 1);
    const j = rng.int(0, 1);
    const byRow = rng.next() < 0.5;
    const k = rng.int(0, 1);
    const groupWords = byRow ? ctx.row[k] : ctx.col[k];
    const group = byRow ? cells[k * 2] + cells[k * 2 + 1] : cells[k] + cells[2 + k];
    const value = cells[i * 2 + j];
    return {
      prompt: `${ctx.intro} Lies aus der Vierfeldertafel ab: Wie viele ${ctx.cell[i][j]} gibt es? Wie viele ${groupWords} gibt es insgesamt?`,
      given: [fourFieldTable(ctx, allValues(a, b, c, d))],
      formulaHint: "„und“: genau ein inneres Feld. Ein Merkmal allein: die Summe seiner Zeile oder Spalte.",
      fields: [
        numberField(`${capital(ctx.cell[i][j])}:`, value, "", 0),
        numberField(`${capital(groupWords)}:`, group, "", 0, { slips: [{ value: byRow ? cells[k] + cells[2 + k] : cells[k * 2] + cells[k * 2 + 1], hint: "Zeile und Spalte verwechselt? Prüfe, wo das Merkmal in der Tafel steht." }] }),
      ],
      steps: [
        `${capital(ctx.cell[i][j])}: Zeile „${ctx.rows[i]}“, Spalte „${ctx.cols[j]}“, also ${value}.`,
        `${capital(groupWords)}: ${byRow ? `Summe der Zeile „${ctx.rows[k]}“` : `Summe der Spalte „${ctx.cols[k]}“`}, also ${group}.`,
        `<strong>${capital(ctx.cell[i][j])}: ${value}; ${groupWords} insgesamt: ${group}.</strong>`,
      ],
      meta: { level: 1, ctx: ctxIndex, a, b, c, d, i, j, byRow: byRow ? 1 : 0, k },
    };
  }
  const or = a + b + c;
  return {
    prompt: `${ctx.intro} Die Tafel zeigt nur die vier inneren Felder. Wie viele ${ctx.noun} gibt es, die ${ctx.or} (auch beides)? Wie viele, die ${ctx.one}? Wie viele, die ${ctx.neither}?`,
    given: [fourFieldTable(ctx, [a, b, null, c, d, null, null, null, null])],
    fields: [
      numberField("oder (auch beides):", or, "", 0, {
        slips: [
          { value: 2 * a + b + c, hint: `Das Feld „${ctx.cell[0][0]}“ hast du doppelt gezählt: Es gehört zur Zeile und zur Spalte.` },
          { value: a, hint: "Das ist „und“: beide Merkmale zugleich. „Oder“ heißt mindestens eines." },
        ],
      }),
      numberField("genau eines von beiden:", b + c, "", 0, { slips: [{ value: or, hint: `Ohne die ${weak(ctx.cell[0][0])}: Sie haben beides.` }] }),
      numberField("keines von beiden:", d, "", 0),
    ],
    steps: [
      `Zu „oder“ gehören drei Felder: ${a} + ${b} + ${c} = ${or}. Ebenso: Zeile ${a + b} plus Spalte ${a + c} minus das gemeinsame Feld ${a} = ${or}.`,
      `Genau eines: ohne das gemeinsame Feld, also ${b} + ${c} = ${b + c}.`,
      `Keines von beiden: das vierte Feld, ${d}. Probe: ${or} + ${d} = ${a + b + c + d}.`,
      `<strong>„oder“: ${or}; genau eines: ${b + c}; keines: ${d}.</strong>`,
    ],
    meta: { level: 2, ctx: ctxIndex, a, b, c, d },
  };
}

/** A frequency tree as lines: the total, then each value of the first feature with its two branches. */
function treeLines(ctx: TwoWayContext, values: { N: number | string; r: Array<number | string>; leaves: Array<number | string> }): string[] {
  return [
    `Gesamtzahl: ${values.N}`,
    `→ ${ctx.rows[0]}: ${values.r[0]} → ${ctx.cols[0]}: ${values.leaves[0]}, ${ctx.cols[1]}: ${values.leaves[1]}`,
    `→ ${ctx.rows[1]}: ${values.r[1]} → ${ctx.cols[0]}: ${values.leaves[2]}, ${ctx.cols[1]}: ${values.leaves[3]}`,
  ];
}

function baumTask(rng: Rng, level: 1 | 2): ExerciseTask {
  const ctxIndex = rng.int(0, TWO_WAY.length - 1);
  const ctx = TWO_WAY[ctxIndex];
  const [a, b, c, d] = drawCells(rng, ctxIndex);
  const N = a + b + c + d;
  const formulaHint = "Die vier Zahlen am Ende des Baums sind die vier inneren Felder der Vierfeldertafel. Der andere Baum fasst sie nach dem anderen Merkmal zusammen.";
  if (level === 1) {
    const r = rng.int(0, 1);
    const j = rng.int(0, 1);
    const leaf = [a, b, c, d][r * 2 + j];
    return {
      prompt: `${ctx.intro} Der Häufigkeitsbaum unten ist zuerst nach dem Merkmal ${ctx.rowFeature} geordnet. Zeichne ihn andersherum, zuerst nach dem Merkmal ${ctx.colFeature}. Welche Zahlen stehen dann auf der ersten Stufe? Welche Zahl steht unter „${ctx.cols[j]}“ beim Ast „${ctx.rows[r]}“?`,
      given: treeLines(ctx, { N, r: [a + b, c + d], leaves: [a, b, c, d] }),
      formulaHint,
      fields: [
        numberField(`1. Stufe „${ctx.cols[0]}“:`, a + c, "", 0, { slips: [{ value: a + b, hint: "Auf der ersten Stufe des neuen Baums steht das andere Merkmal: Zähle die passenden Endzahlen beider Äste zusammen." }] }),
        numberField(`1. Stufe „${ctx.cols[1]}“:`, b + d, "", 0, { slips: [{ value: c + d, hint: "Auf der ersten Stufe des neuen Baums steht das andere Merkmal: Zähle die passenden Endzahlen beider Äste zusammen." }] }),
        numberField(`unter „${ctx.cols[j]}“, Ast „${ctx.rows[r]}“:`, leaf, "", 0),
      ],
      steps: [
        `Die Endzahlen nach dem Merkmal ${ctx.colFeature} zusammengefasst: ${ctx.cols[0]} ${a} + ${c} = ${a + c}, ${ctx.cols[1]} ${b} + ${d} = ${b + d}. Probe: ${a + c} + ${b + d} = ${N}.`,
        `Die Endzahlen bleiben dieselben, nur anders sortiert: unter „${ctx.cols[j]}“ stehen ${ctx.rows[0]} ${[a, b][j]} und ${ctx.rows[1]} ${[c, d][j]}.`,
        `<strong>1. Stufe: ${ctx.cols[0]} ${a + c}, ${ctx.cols[1]} ${b + d}; unter „${ctx.cols[j]}“ beim Ast „${ctx.rows[r]}“: ${leaf}.</strong>`,
      ],
      meta: { level: 1, ctx: ctxIndex, a, b, c, d, r, j },
    };
  }
  return {
    prompt: `${ctx.intro} Vom Häufigkeitsbaum unten, zuerst nach dem Merkmal ${ctx.rowFeature} geordnet, sind nur einige Zahlen bekannt. Berechne die Zahl der ${weak(ctx.cell[1][0])}. Zeichne den Baum dann andersherum, zuerst nach dem Merkmal ${ctx.colFeature}: Welche Zahlen stehen auf seiner ersten Stufe?`,
    given: treeLines(ctx, { N, r: [a + b, "?"], leaves: [a, "?", "?", d] }),
    fields: [
      numberField(`${capital(ctx.cell[1][0])}:`, c, "", 0, { slips: [{ value: c + d, hint: `Das sind alle ${weak(ctx.row[1])}; ziehe noch die ${weak(ctx.cell[1][1])} ab.` }] }),
      numberField(`1. Stufe „${ctx.cols[0]}“:`, a + c, "", 0),
      numberField(`1. Stufe „${ctx.cols[1]}“:`, b + d, "", 0),
    ],
    steps: [
      `${capital(ctx.row[1])}: ${N} − ${a + b} = ${c + d}; davon ${ctx.cols[0]}: ${c + d} − ${d} = ${c}.`,
      `${capital(ctx.cell[0][1])}: ${a + b} − ${a} = ${b}.`,
      `Neuer Baum, 1. Stufe: ${ctx.cols[0]} ${a} + ${c} = ${a + c}, ${ctx.cols[1]} ${b} + ${d} = ${b + d}. Probe: ${a + c} + ${b + d} = ${N}.`,
      `<strong>${capital(ctx.cell[1][0])}: ${c}; 1. Stufe: ${ctx.cols[0]} ${a + c}, ${ctx.cols[1]} ${b + d}.</strong>`,
    ],
    meta: { level: 2, ctx: ctxIndex, a, b, c, d },
  };
}

const vierfeldertafel: Lesson = {
  id: "dz-3-vierfeldertafel",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "7.3 Vierfeldertafeln",
  subtitle: "Zwei Merkmale, vier Felder, alle Summen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Vierfeldertafeln`,
  whyItMatters:
    "Umfragen, Klassenstatistiken und medizinische Tests halten oft zwei Merkmale zugleich fest. In der Vierfeldertafel siehst du alle vier Kombinationen auf einen Blick und kannst fehlende Zahlen aus den Summen berechnen.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5:</strong> Vierfeldertafeln hast du schon gelesen. Jetzt stellst du damit Daten selbst dar und berechnest fehlende Einträge.</p>
    <p>Werden bei jeder Person zwei <strong>Merkmale</strong> mit je zwei Ausprägungen festgehalten, etwa das Geschlecht (Mädchen oder Junge) und ob sie eine Brille trägt, gibt es vier Kombinationen. Die <strong>Vierfeldertafel</strong> zeigt in ihren vier inneren Feldern, wie oft jede Kombination vorkommt. Rechts stehen die Zeilensummen, unten die Spaltensummen und rechts unten die Gesamtzahl.</p>
    <table class="mini">
      <tr><th></th><th>mit Brille</th><th>ohne Brille</th><th>Summe</th></tr>
      <tr><th>Mädchen</th><td>8</td><td>20</td><td>28</td></tr>
      <tr><th>Jungen</th><td>6</td><td>22</td><td>28</td></tr>
      <tr><th>Summe</th><td>14</td><td>42</td><td>56</td></tr>
    </table>
    <p>Jede Zeile und jede Spalte geht auf: 8 + 20 = 28 und 8 + 6 = 14. Die Zeilensummen und die Spaltensummen ergeben beide die Gesamtzahl: 28 + 28 = 14 + 42 = 56. Deshalb kannst du fehlende Felder aus den übrigen berechnen.</p>
    <div class="example"><strong>Beispiel:</strong> In einer Jahrgangsstufe sind 60 Jugendliche, 32 davon Mädchen. 21 Jugendliche haben ein Haustier, darunter 12 Mädchen. Wie viele Jungen haben kein Haustier?<br>
      Jungen insgesamt: 60 − 32 = 28.<br>
      Jungen mit Haustier: 21 − 12 = 9.<br>
      Jungen ohne Haustier: 28 − 9 = 19.<br>
      Probe über die Spalte „ohne Haustier“: 60 − 21 = 39, und Mädchen ohne Haustier 32 − 12 = 20; 20 + 19 = 39.</div>
    <p><strong>Ereignisse aus der Tafel lesen:</strong> „Mädchen und Brille“ ist ein einziges Feld, hier 8. „Mädchen oder Brille“ heißt: ein Mädchen, eine Brille oder beides. Dazu gehören drei Felder: 8 + 20 + 6 = 34. Wer die Mädchen (28) und die Brillenträger (14) einfach addiert, zählt die 8 Mädchen mit Brille doppelt; richtig ist 28 + 14 − 8 = 34.</p>
    <p><strong>Häufigkeitsbaum:</strong> Dieselben Daten kannst du als Baum zeichnen. Oben steht die Gesamtzahl 56, auf der ersten Stufe das erste Merkmal (Mädchen 28, Jungen 28), auf der zweiten das zweite (mit Brille 8, ohne 20; mit Brille 6, ohne 22). Die vier Endzahlen sind genau die vier inneren Felder. Beginnst du mit dem anderen Merkmal, steht auf der ersten Stufe mit Brille 14 und ohne Brille 42; die Endzahlen bleiben dieselben, nur anders sortiert.</p>
    <p>Auch bei medizinischen Tests zählt man so: wie viele Personen krank oder gesund sind und bei wem der Test positiv oder negativ ausfällt.</p>
    <p><strong>Typische Fehler:</strong> bei „oder“ das gemeinsame Feld doppelt zählen; Zeilen- und Spaltensummen verwechseln; die Probe vergessen, dass beide Summen die Gesamtzahl ergeben.</p>
    <div class="merke"><strong>Merke:</strong> Die Vierfeldertafel zeigt die vier Kombinationen zweier Merkmale. Jede Zeile und jede Spalte ergibt ihre Summe, alle vier Felder zusammen die Gesamtzahl. Bei „A oder B“ zählst du die drei passenden Felder, jedes nur einmal: Anzahl von A plus Anzahl von B minus Anzahl von „A und B“.</div>
  `,
  formulas: [
    { name: "Vierfeldertafel", html: "Felder einer Zeile ergeben die Zeilensumme, Felder einer Spalte die Spaltensumme; alle vier Felder ergeben die Gesamtzahl", quantities: "in den vier Feldern stehen die absoluten Häufigkeiten der vier Kombinationen" },
    { name: "„A oder B“", html: "Anzahl(A oder B) = Anzahl(A) + Anzahl(B) − Anzahl(A und B)", quantities: "das gemeinsame Feld „A und B“ nur einmal zählen" },
    { name: "Häufigkeitsbaum", html: "Gesamtzahl → 1. Merkmal → 2. Merkmal", quantities: "die vier Endzahlen sind die vier inneren Felder der Tafel" },
  ],
  quiz: {
    question: "In einer Klasse sind 14 Mädchen. 9 Kinder tragen eine Brille, darunter 4 Mädchen. Wie viele sind ein Mädchen oder tragen eine Brille?",
    options: ["19", "23", "4", "5"],
    correctIndex: 0,
    explanation:
      "Mädchen plus Brillenträger minus das gemeinsame Feld: 14 + 9 − 4 = 19. Mit 23 sind die 4 Mädchen mit Brille doppelt gezählt; 4 ist „Mädchen und Brille“, 5 sind die Jungen mit Brille.",
  },
  lab: {
    kind: "two-way-table",
    title: "Labor: Vierfeldertafel und Häufigkeitsbaum",
    intro:
      "Die vier Schieberegler stellen die inneren Felder ein: Mädchen und Jungen einer Jahrgangsstufe, mit oder ohne Brille. Summen, Anteile und der Häufigkeitsbaum rechnen mit. Wähle ein Ereignis: Seine Felder werden lila.",
    params: [
      { type: "range", key: "a", label: "Mädchen mit Brille", unit: "", min: 0, max: 30, step: 1, value: 8 },
      { type: "range", key: "b", label: "Mädchen ohne Brille", unit: "", min: 0, max: 30, step: 1, value: 20 },
      { type: "range", key: "c", label: "Jungen mit Brille", unit: "", min: 0, max: 30, step: 1, value: 6 },
      { type: "range", key: "d", label: "Jungen ohne Brille", unit: "", min: 0, max: 30, step: 1, value: 22 },
      { type: "choice", key: "ereignis", label: "Ereignis", options: TABLE_EVENTS.map((e, value) => ({ value, label: e.label })), value: 1 },
      {
        type: "choice",
        key: "baum",
        label: "Häufigkeitsbaum",
        options: [
          { value: 0, label: "zuerst Mädchen/Jungen" },
          { value: 1, label: "zuerst Brille" },
        ],
        value: 0,
      },
    ],
    readouts: [
      {
        key: "summen",
        label: "Zeilen- und Spaltensummen",
        compute: (v) => `${v.a + v.b} Mädchen, ${v.c + v.d} Jungen; ${v.a + v.c} mit, ${v.b + v.d} ohne Brille`,
      },
      { key: "gesamt", label: "Gesamtzahl", compute: (v) => `${v.a + v.b + v.c + v.d} Jugendliche` },
      {
        key: "ereignis",
        label: "Ereignis",
        emphasis: true,
        compute: (v) => `${TABLE_EVENTS[v.ereignis].label}: ${tableEventCount(tableOf(v), v.ereignis)}`,
      },
      { key: "anteile", label: "Anteil mit Brille", compute: (v) => `Mädchen ${shareText(v.a, v.a + v.b)}; Jungen ${shareText(v.c, v.c + v.d)}` },
    ],
    goals: [
      {
        id: "oder",
        text: "In einer Jahrgangsstufe sind 36 Mädchen, 24 Jugendliche tragen eine Brille, und 46 sind ein Mädchen oder tragen eine Brille. Stelle die Tafel passend ein: Wie viele Mädchen tragen eine Brille?",
        check: (v) => v.a + v.b === 36 && v.a + v.c === 24 && v.a + v.b + v.c === 46,
      },
      {
        id: "gleich",
        text: "Stelle die Tafel so ein, dass bei den Mädchen und bei den Jungen genau derselbe Anteil eine Brille trägt, obwohl es verschieden viele Mädchen und Jungen sind.",
        check: (v) => sameShare(tableOf(v)),
      },
      {
        id: "mehr",
        text: "Stelle die Tafel so ein, dass mehr Jungen als Mädchen eine Brille tragen, der Anteil der Brillenträger bei den Mädchen aber größer ist. Wie passt das zusammen?",
        check: (v) => moreButSmallerShare(tableOf(v)),
      },
    ],
  },
  exercises: [
    { id: "ergaenzen", make: (rng, level) => ergaenzenTask(rng, level) },
    { id: "lesen", make: (rng, level) => lesenTask(rng, level) },
    { id: "baum", make: (rng, level) => baumTask(rng, level) },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du füllst Vierfeldertafeln aus, zählst bei „oder“ nichts doppelt und wechselst zwischen Tafel und Baum.",
};

// ─── 7.4 Absolute und relative Häufigkeiten ────────────────────────────────

/** "= 0,38" or "≈ 0,31": a relative frequency with two decimals and the right sign before it, rounded from the integers (7 : 40 ≈ 0,18). */
const hDecimal = hText;

/** "= 38 %" or "≈ 30,8 %", rounded from the integers (23 : 80 = 28,75 % ≈ 28,8 %). */
function hPercent(count: number, n: number): string {
  return `${ratioEnds(count, n, 3) ? "=" : "≈"} ${fmt(roundedRatio(count, n, 3) * 100, 1)} %`;
}

/** "= 0,375 = 37,5 %" or "≈ 0,158 ≈ 15,8 %": three decimals and the percentage that belongs to them. */
function hBoth(count: number, n: number): string {
  const exact = ratioEnds(count, n, 3);
  const h = roundedRatio(count, n, 3);
  return `${exact ? "=" : "≈"} ${fmt(h, 3)} ${exact ? "=" : "≈"} ${fmt(h * 100, 1)} %`;
}

/**
 * A percentage field that names the early rounding: who rounds h to two
 * decimals first types 12 % for 7 : 60 ≈ 11,7 %. The percentage fields of
 * this lesson accept only the rounding to one decimal ({ tolerance: 0 }), so
 * 48,5 or 49 for 48,67 % is wrong; the slip is added only when the field
 * rejects the early value.
 */
function withEarlyRounding(field: NumberField, count: number, n: number): NumberField {
  const early = roundedRatio(count, n, 2) * 100;
  if (Math.abs(early - field.answer) <= toleranceOf(field)) return field;
  const hint = `Zu früh gerundet: Rechne ${count} : ${n} ungerundet in Prozent um und runde erst dann auf eine Nachkommastelle.`;
  return { ...field, slips: [...(field.slips ?? []), { value: early, hint }] };
}

/** One random experiment repeated n times with H hits, as the tasks tell it. */
const SERIES: Array<{ text: (n: number, H: number) => string; label: string; range: [number, number] }> = [
  { text: (n, H) => `Lea würfelt ${n}-mal und notiert ${H}-mal eine Sechs.`, label: "h(6)", range: [0.1, 0.25] },
  { text: (n, H) => `Ein Reißnagel wird ${n}-mal geworfen; ${H}-mal landet er mit der Spitze nach oben.`, label: "h(Spitze oben)", range: [0.25, 0.5] },
  { text: (n, H) => `Ein Glücksrad wird ${n}-mal gedreht; ${H}-mal bleibt es auf Rot stehen.`, label: "h(Rot)", range: [0.15, 0.6] },
  { text: (n, H) => `Eine Münze wird ${n}-mal geworfen; ${H}-mal zeigt sie Kopf.`, label: "h(Kopf)", range: [0.42, 0.58] },
  { text: (n, H) => `Bei einer Tombola zieht die Klasse 8c ${n} Lose; ${H} davon sind Gewinne.`, label: "h(Gewinn)", range: [0.1, 0.4] },
];

const RUNS = [20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300, 400, 500];

/** Two series to compare: who did what, and the question with its two answers. */
const COMPARISONS: Array<{ event: string; text: (n1: number, H1: number, n2: number, H2: number, who: [string, string]) => string; labels: [string, string]; question: string; options: (who: [string, string]) => [string, string]; answer: (better: string) => string; trap: (more: number, who: [string, string]) => string; range: [number, number] }> = [
  {
    event: "Gewinn",
    text: (n1, H1, n2, H2) => `Auf dem Schulfest gibt es zwei Glücksräder. Rad A brachte bei ${n1} Drehungen ${H1} Gewinne, Rad B bei ${n2} Drehungen ${H2} Gewinne.`,
    labels: ["Rad A", "Rad B"],
    question: "Nach diesen Daten scheint die bessere Gewinnchance zu haben:",
    options: () => ["Rad A", "Rad B"],
    answer: (better) => `Nach diesen Daten scheint ${better} die besseren Gewinnchancen zu haben.`,
    trap: (more) => `Achtung: Rad ${more === 0 ? "A" : "B"} brachte mehr Gewinne, wurde aber auch öfter gedreht. Entscheidend ist der Anteil.`,
    range: [0.15, 0.45],
  },
  {
    event: "Gewinn",
    text: (n1, H1, n2, H2) => `An der Losbude der 8a waren unter ${n1} verkauften Losen ${H1} Gewinne, an der Losbude der 8b unter ${n2} Losen ${H2} Gewinne.`,
    labels: ["8a", "8b"],
    question: "Der Anteil der Gewinne war größer bei der Losbude der",
    options: () => ["8a", "8b"],
    answer: (better) => `Bei der Losbude der ${better} war der Anteil der Gewinne größer.`,
    trap: (more) => `Achtung: Die Losbude der ${more === 0 ? "8a" : "8b"} hatte mehr Gewinne, aber auch mehr verkaufte Lose. Entscheidend ist der Anteil.`,
    range: [0.15, 0.4],
  },
  {
    event: "Spitze oben",
    text: (n1, H1, n2, H2) => `Zwei Sorten Reißnägel werden getestet: Sorte A landete bei ${n1} Würfen ${H1}-mal mit der Spitze nach oben, Sorte B bei ${n2} Würfen ${H2}-mal.`,
    labels: ["Sorte A", "Sorte B"],
    question: "Mit der Spitze nach oben landet nach diesen Daten eher:",
    options: () => ["Sorte A", "Sorte B"],
    answer: (better) => `Nach diesen Daten landet ${better} eher mit der Spitze nach oben.`,
    trap: (more) => `Achtung: Sorte ${more === 0 ? "A" : "B"} landete öfter mit der Spitze nach oben, wurde aber auch öfter geworfen. Entscheidend ist der Anteil.`,
    range: [0.25, 0.55],
  },
  {
    event: "6",
    text: (n1, H1, n2, H2, who) => `${who[0]} glaubt, dass ihr Würfel öfter eine Sechs zeigt als der von ${who[1]}. ${who[0]} würfelt ${n1}-mal und hat ${H1} Sechsen, ${who[1]} würfelt ${n2}-mal und hat ${H2} Sechsen.`,
    labels: ["1. Würfel", "2. Würfel"],
    question: "Die relative Häufigkeit der Sechs war größer beim Würfel von",
    options: (who) => [who[0], who[1]],
    answer: (better) => `Beim Würfel von ${better} war die relative Häufigkeit der Sechs größer.`,
    trap: (more, who) => `Achtung: ${genitive(who[more])} Würfel zeigte mehr Sechsen, wurde aber auch öfter geworfen. Entscheidend ist der Anteil.`,
    range: [0.1, 0.3],
  },
];

const GIRLS = ["Lena", "Mia", "Emma", "Hannah", "Sophie", "Lea", "Marie"];

function relativTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const ctx = rng.int(0, SERIES.length - 1);
    const s = SERIES[ctx];
    const n = rng.pick(RUNS);
    let H = Math.round(n * (s.range[0] + rng.next() * (s.range[1] - s.range[0])));
    H = Math.min(n - 1, Math.max(1, H));
    const h = H / n;
    return {
      prompt: `${s.text(n, H)} Berechne die relative Häufigkeit ${s.label} als Dezimalzahl und in Prozent.`,
      given: [`n = ${n}`, `H = ${H}`],
      formulaHint: "h(E) = H(E) : n; in Prozent: mal 100 %",
      fields: [
        numberField(`${s.label} =`, h, "", 2, {
          slips: [
            { value: n / H, hint: "Umgekehrt geteilt: h(E) = H(E) : n, also Treffer durch alle Versuche." },
            { value: H / (n - H), hint: "Teile durch die Anzahl aller Versuche n, nicht durch die der übrigen Ergebnisse." },
          ],
        }),
        withEarlyRounding(numberField(`${s.label} in Prozent:`, (100 * H) / n, "%", 1, { tolerance: 0 }), H, n),
      ],
      steps: [`${s.label} = H : n = ${H} : ${n} = ${fracHtml(H, n)} ${hBoth(H, n)}`, `<strong>${s.label} ${hDecimal(H, n)}; in Prozent: ${s.label} ${hPercent(H, n)}</strong>`],
      meta: { level: 1, ctx, n, H },
    };
  }
  const wantTrap = rng.next() < 0.5;
  for (let attempt = 0; ; attempt++) {
    const ctx = rng.int(0, COMPARISONS.length - 1);
    const cmp = COMPARISONS[ctx];
    const [n1, n2] = rng.shuffle(RUNS.filter((x) => x >= 50)).slice(0, 2);
    const draw = (n: number) => Math.round(n * (cmp.range[0] + rng.next() * (cmp.range[1] - cmp.range[0])));
    const H1 = draw(n1);
    const H2 = draw(n2);
    const p1 = (100 * H1) / n1;
    const p2 = (100 * H2) / n2;
    // a clear difference, and half of the tasks with the trap: more hits, but the smaller share
    const trap = (H1 > H2 && p1 < p2) || (H2 > H1 && p2 < p1);
    if ((Math.abs(p1 - p2) < 3 || H1 === H2 || trap !== wantTrap) && attempt < 200) continue;
    const who = ctx === 3 ? (rng.shuffle(GIRLS).slice(0, 2) as [string, string]) : (["", ""] as [string, string]);
    const options = cmp.options(who);
    const better = p1 > p2 ? 0 : 1;
    const labels = ctx === 3 ? [`${genitive(who[0])} Würfel`, `${genitive(who[1])} Würfel`] : cmp.labels;
    return {
      prompt: `${cmp.text(n1, H1, n2, H2, who)} Berechne für beide die relative Häufigkeit in Prozent und vergleiche.`,
      given: [`${labels[0]}: ${H1} von ${n1}`, `${labels[1]}: ${H2} von ${n2}`],
      fields: [
        withEarlyRounding(numberField(`${labels[0]}: h(${cmp.event}) in Prozent:`, p1, "%", 1, { tolerance: 0, slips: [{ value: H1, hint: "Das ist die absolute Häufigkeit. Teile noch durch die Anzahl der Versuche." }] }), H1, n1),
        withEarlyRounding(numberField(`${labels[1]}: h(${cmp.event}) in Prozent:`, p2, "%", 1, { tolerance: 0, slips: [{ value: H2, hint: "Das ist die absolute Häufigkeit. Teile noch durch die Anzahl der Versuche." }] }), H2, n2),
        choiceField(cmp.question, options, better),
      ],
      steps: [
        `${labels[0]}: h = ${H1} : ${n1} ${hBoth(H1, n1)}`,
        `${labels[1]}: h = ${H2} : ${n2} ${hBoth(H2, n2)}`,
        trap ? cmp.trap(H1 > H2 ? 0 : 1, who) : "Die Versuchsreihen sind verschieden lang; deshalb werden die Anteile verglichen.",
        `<strong>${cmp.answer(options[better])}</strong>`,
      ],
      meta: { level: 2, ctx, n1, H1, n2, H2, better, trap: trap ? 1 : 0 },
    };
  }
}

function absolutTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const ctx = rng.int(0, SERIES.length - 1);
    const s = SERIES[ctx];
    for (;;) {
      const n = rng.pick([20, 25, 40, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500]);
      const p = rng.int(Math.ceil(s.range[0] * 100), Math.floor(s.range[1] * 100));
      if ((p * n) % 100 !== 0) continue;
      const H = (p * n) / 100;
      const asPercent = rng.next() < 0.5;
      const shown = asPercent ? `${p} %` : fmt(p / 100, 2);
      const what = ["Sechsen", "Würfe mit der Spitze nach oben", "Drehungen auf Rot", "Würfe mit Kopf", "Gewinne"][ctx];
      const rest = ["Würfe ohne Sechs", "Würfe in Seitenlage", "Drehungen auf einer anderen Farbe", "Würfe mit Zahl", "Nieten"][ctx];
      const experiment = [`Ein Würfel wird ${n}-mal geworfen.`, `Ein Reißnagel wird ${n}-mal geworfen.`, `Ein Glücksrad wird ${n}-mal gedreht.`, `Eine Münze wird ${n}-mal geworfen.`, `Bei einer Tombola werden ${n} Lose gezogen.`][ctx];
      return {
        prompt: `${experiment} Die relative Häufigkeit ${s.label} beträgt ${shown}. Wie viele ${what} waren es, und wie viele ${rest}?`,
        given: [`n = ${n}`, `${s.label} = ${shown}`],
        formulaHint: "H(E) = h(E) · n",
        fields: [numberField(`${capital(what)}:`, H, "", 0), numberField(`${capital(rest)}:`, n - H, "", 0)],
        steps: [`H = h · n = ${asPercent ? `${p} % von ${n} = ${fmt(p / 100, 2)}` : shown} · ${n} = ${H}`, `${capital(rest)}: ${n} − ${H} = ${n - H}`, `<strong>${H} ${what}, ${n - H} ${rest}.</strong>`],
        meta: { level: 1, ctx, n, p, H },
      };
    }
  }
  if (rng.next() < 0.5) {
    // a thumbtack: an old series given by its percentage, then more throws
    for (;;) {
      const n1 = rng.pick([100, 150, 200, 250, 300, 400]);
      const p1 = rng.int(32, 44);
      if ((p1 * n1) % 100 !== 0) continue;
      const H1 = (p1 * n1) / 100;
      const n2 = rng.pick([50, 100, 150, 200]);
      const k2 = Math.round(n2 * (0.3 + rng.next() * 0.16));
      const [name] = rng.shuffle(GIRLS);
      const H = H1 + k2;
      const N = n1 + n2;
      return {
        prompt: `Bei ${n1} Würfen eines Reißnagels lag er in ${p1} % der Fälle mit der Spitze nach oben. ${name} wirft denselben Reißnagel noch ${n2}-mal, davon landet er ${k2}-mal mit der Spitze nach oben. Wie oft lag er bei allen ${N} Würfen mit der Spitze nach oben? Wie groß ist die relative Häufigkeit nun?`,
        given: [`${n1} Würfe: ${p1} % Spitze oben`, `${n2} weitere Würfe: ${k2}-mal Spitze oben`],
        fields: [
          numberField(`Spitze oben bei den ersten ${n1} Würfen:`, H1, "", 0),
          numberField(`Spitze oben insgesamt:`, H, "", 0, { slips: [{ value: p1 + k2, hint: `${p1} % ist ein Anteil, keine Anzahl: Rechne zuerst ${p1} % von ${n1}.` }] }),
          withEarlyRounding(
            numberField("h(Spitze oben) in Prozent:", (100 * H) / N, "%", 1, {
              tolerance: 0,
              slips: [{ value: (p1 + (100 * k2) / n2) / 2, hint: "Die beiden Prozentsätze darf man nicht einfach mitteln: Die Versuchsreihen sind verschieden lang. Teile alle Treffer durch alle Würfe." }],
            }),
            H,
            N,
          ),
        ],
        steps: [`Erste Reihe: H = ${p1} % von ${n1} = ${fmt(p1 / 100, 2)} · ${n1} = ${H1}`, `Insgesamt: ${H1} + ${k2} = ${H} Treffer bei ${n1} + ${n2} = ${N} Würfen`, `h = ${H} : ${N} ${hBoth(H, N)}`, `<strong>${H}-mal Spitze oben; h(Spitze oben) ${hPercent(H, N)}</strong>`],
        meta: { level: 2, kind: 0, n1, p1, n2, k2 },
      };
    }
  }
  // a die: the relative frequency of the Sechs before and after more throws
  for (;;) {
    const n1 = rng.pick([100, 200, 300]);
    const n2 = rng.pick([100, 200]);
    const h1 = rng.int(13, 20);
    const h2 = rng.int(13, 20);
    const H1 = (h1 * n1) / 100;
    const H2 = (h2 * (n1 + n2)) / 100;
    const last = H2 - H1;
    if (h1 === h2 || last < 0.08 * n2 || last > 0.3 * n2) continue;
    const [name] = rng.shuffle(["Tim", "Jonas", "Paul", "Ben", "Luca"]);
    return {
      prompt: `${name} hat ${n1}-mal gewürfelt; die relative Häufigkeit der Sechs betrug ${fmt(h1 / 100, 2)}. Nach ${n2} weiteren Würfen beträgt sie ${fmt(h2 / 100, 2)}. Wie viele Sechsen hatte er nach ${n1} Würfen, wie viele nach allen ${n1 + n2}? Wie viele Sechsen fielen bei den letzten ${n2} Würfen?`,
      given: [`nach ${n1} Würfen: h(6) = ${fmt(h1 / 100, 2)}`, `nach ${n1 + n2} Würfen: h(6) = ${fmt(h2 / 100, 2)}`],
      fields: [
        numberField(`Sechsen nach ${n1} Würfen:`, H1, "", 0),
        numberField(`Sechsen nach ${n1 + n2} Würfen:`, H2, "", 0, { slips: [{ value: (h2 * n2) / 100, hint: `Die neue relative Häufigkeit gilt für alle ${n1 + n2} Würfe, nicht nur für die letzten ${n2}.` }] }),
        numberField(`Sechsen bei den letzten ${n2} Würfen:`, last, "", 0),
      ],
      steps: [`Nach ${n1} Würfen: H = ${fmt(h1 / 100, 2)} · ${n1} = ${H1}`, `Nach ${n1 + n2} Würfen: H = ${fmt(h2 / 100, 2)} · ${n1 + n2} = ${H2}`, `Bei den letzten ${n2} Würfen: ${H2} − ${H1} = ${last}`, `<strong>${H1} Sechsen, dann ${H2}; bei den letzten ${n2} Würfen fielen ${last} Sechsen.</strong>`],
      meta: { level: 2, kind: 1, n1, n2, h1, h2 },
    };
  }
}

function summeTask(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    for (;;) {
      const n = rng.pick([50, 60, 100, 120, 150, 200]);
      const counts = Array.from({ length: 5 }, () => Math.round((n / 6) * (0.7 + rng.next() * 0.6)));
      const six = n - counts.reduce((a, b) => a + b, 0);
      if (six < Math.round(n / 12) || six > Math.round(n / 3)) continue;
      const rest = n - six;
      return {
        prompt: `Ein Würfel wurde ${n}-mal geworfen. Die Strichliste ergab für die Augenzahlen 1 bis 5 die Anzahlen in der Tabelle; die Zahl der Sechsen ist verwischt. Wie oft fiel die Sechs, und wie groß ist ihre relative Häufigkeit?`,
        given: [
          `<table style="border-collapse:collapse;margin:0.3rem 0"><tr><th style="${HEAD}">Augenzahl</th>${[1, 2, 3, 4, 5, 6].map((e) => `<th style="${HEAD}">${e}</th>`).join("")}</tr><tr><th style="${HEAD}">Anzahl</th>${counts.map((x) => `<td style="${CELL}">${x}</td>`).join("")}<td style="${CELL}">?</td></tr></table>`,
        ],
        formulaHint: "Alle absoluten Häufigkeiten zusammen ergeben n. Dann h(6) = H(6) : n.",
        fields: [
          numberField("H(6) =", six, "", 0, { slips: [{ value: rest, hint: `Das ist die Summe der Augenzahlen 1 bis 5. Ziehe sie von ${n} ab.` }] }),
          numberField("h(6) =", six / n, "", 2, { slips: [{ value: six / rest, hint: `Teile durch alle ${n} Würfe, nicht nur durch die übrigen.` }] }),
        ],
        steps: [`Augenzahlen 1 bis 5: ${counts.join(" + ")} = ${rest}`, `H(6) = ${n} − ${rest} = ${six}`, `<strong>H(6) = ${six}; h(6) = ${six} : ${n} ${hDecimal(six, n)}</strong>`],
        meta: { level: 1, n, six, ...Object.fromEntries(counts.map((x, i) => [`c${i + 1}`, x])) },
      };
    }
  }
  if (rng.next() < 0.5) {
    // a die: the relative frequencies of 1 to 5 in a table, the Sechs missing
    for (;;) {
      const n = rng.pick([200, 300, 400, 500]);
      const hs = Array.from({ length: 5 }, () => rng.int(12, 21));
      const h6 = 100 - hs.reduce((a, b) => a + b, 0);
      if (h6 < 10 || h6 > 26) continue;
      const k = rng.int(1, 5);
      return {
        prompt: `Ein Würfel wurde ${n}-mal geworfen. Die Tabelle zeigt die relativen Häufigkeiten der Augenzahlen 1 bis 5; bei der Sechs fehlt der Eintrag. Wie groß ist h(6)? Wie oft fiel die Sechs, und wie oft die ${k}?`,
        given: [
          `<table style="border-collapse:collapse;margin:0.3rem 0"><tr><th style="${HEAD}">Augenzahl</th>${[1, 2, 3, 4, 5, 6].map((e) => `<th style="${HEAD}">${e}</th>`).join("")}</tr><tr><th style="${HEAD}">h</th>${hs.map((x) => `<td style="${CELL}">${fmt(x / 100, 2)}</td>`).join("")}<td style="${CELL}">?</td></tr></table>`,
          `n = ${n}`,
        ],
        fields: [
          numberField("h(6) =", h6 / 100, "", 2, { slips: [{ value: 1 / 6, hint: "Rechne mit der Tabelle: Alle relativen Häufigkeiten zusammen ergeben 1, also h(6) = 1 minus die übrigen." }] }),
          numberField("H(6) =", (h6 * n) / 100, "", 0, { slips: [{ value: h6, hint: `${fmt(h6 / 100, 2)} ist ein Anteil: H(6) = h(6) · ${n}.` }] }),
          numberField(`H(${k}) =`, (hs[k - 1] * n) / 100, "", 0),
        ],
        steps: [
          `Alle relativen Häufigkeiten ergeben zusammen 1: h(6) = 1 − ${hs.map((x) => fmt(x / 100, 2)).join(" − ")} = ${fmt(h6 / 100, 2)}.`,
          `H(6) = ${fmt(h6 / 100, 2)} · ${n} = ${(h6 * n) / 100}; H(${k}) = ${fmt(hs[k - 1] / 100, 2)} · ${n} = ${(hs[k - 1] * n) / 100}.`,
          `<strong>h(6) = ${fmt(h6 / 100, 2)}; die Sechs fiel ${(h6 * n) / 100}-mal, die Augenzahl ${k} fiel ${(hs[k - 1] * n) / 100}-mal.</strong>`,
        ],
        meta: { level: 2, kind: 1, n, k, ...Object.fromEntries(hs.map((x, i) => [`h${i + 1}`, x])) },
      };
    }
  }
  // a wheel with four colours: the relative frequencies in mixed forms, one colour missing
  for (;;) {
    const n = rng.pick([80, 120, 160, 200, 240]);
    const pRed = 5 * rng.int(4, 9);
    const hBlue = 5 * rng.int(3, 7);
    const yellow = rng.int(1, 4);
    const pGreen = 100 - pRed - hBlue - 5 * yellow;
    if (pGreen < 5 || pGreen > 40) continue;
    const green = (pGreen * n) / 100;
    const red = (pRed * n) / 100;
    return {
      prompt: `Ein Glücksrad mit den Farben Rot, Blau, Gelb und Grün wurde ${n}-mal gedreht. Rot kam in ${pRed} % der Drehungen, die relative Häufigkeit von Blau betrug ${fmt(hBlue / 100, 2)}, die von Gelb ${fracHtml(yellow, 20)}. Wie groß ist die relative Häufigkeit von Grün? Wie oft kamen Grün und Rot?`,
      given: [`n = ${n}`, `Rot ${pRed} %, Blau ${fmt(hBlue / 100, 2)}, Gelb ${fracHtml(yellow, 20)}`],
      fields: [
        numberField("h(Grün) in Prozent:", pGreen, "%", 1, { slips: [{ value: 100 - pRed - hBlue, hint: "Gelb fehlt noch: Schreibe auch seinen Anteil in Prozent und ziehe ihn ab." }] }),
        numberField("H(Grün) =", green, "", 0),
        numberField("H(Rot) =", red, "", 0),
      ],
      steps: [
        `Alles in Prozent: Blau ${fmt(hBlue / 100, 2)} = ${hBlue} %, Gelb ${fracHtml(yellow, 20)} = ${5 * yellow} %.`,
        `Alle relativen Häufigkeiten ergeben zusammen 100 %: h(Grün) = 100 % − ${pRed} % − ${hBlue} % − ${5 * yellow} % = ${pGreen} %.`,
        `H(Grün) = ${pGreen} % von ${n} = ${green}; H(Rot) = ${pRed} % von ${n} = ${red}.`,
        `<strong>h(Grün) = ${pGreen} %; Grün kam ${green}-mal, Rot ${red}-mal.</strong>`,
      ],
      meta: { level: 2, kind: 0, n, pRed, hBlue, yellow, pGreen },
    };
  }
}

/**
 * Lab goal „gerade Augenzahl“: after at least 300 throws of the normal die the
 * learner has set h(2) + h(4) + h(6) in whole percent, computed either from
 * the counts, (H(2) + H(4) + H(6)) : n, or as the sum of the three rounded
 * shares under the bars (both ways are right and may differ by one percent).
 */
function evenShareTyped(v: LabValues): boolean {
  const r = gameOf(v, 0);
  if (r.n < 300) return false;
  const fromCounts = Math.round((100 * (r.counts[1] + r.counts[3] + r.counts[5])) / r.n + 1e-9);
  const fromBars = Math.round(100 * [1, 3, 5].reduce((s, i) => s + roundedRatio(r.counts[i], r.n, 2), 0));
  return v.gerade === fromCounts || v.gerade === fromBars;
}

const haeufigkeiten: Lesson = {
  id: "dz-4-haeufigkeiten",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "7.4 Absolute und relative Häufigkeiten",
  subtitle: "Zählen, Anteile bilden, Gewinnchancen einschätzen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Absolute und relative Häufigkeiten`,
  whyItMatters:
    "Ob ein Würfel gezinkt ist, an welcher Losbude man öfter gewinnt oder wie ein Reißnagel meistens landet, findest du nur durch Versuche heraus. Relative Häufigkeiten machen Versuchsreihen verschiedener Länge vergleichbar.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6:</strong> Einen Anteil schreibst du als Bruch, als Dezimalzahl oder in Prozent: ${frac(13, 50)} = 0,26 = 26 %.</p>
    <p>Ein Zufallsexperiment wird n-mal durchgeführt. Die <strong>absolute Häufigkeit</strong> H(E) eines Ereignisses E gibt an, wie oft E eingetreten ist. Die <strong>relative Häufigkeit</strong> h(E) gibt den Anteil an allen Versuchen an: h(E) = H(E) : n.</p>
    <ul>
      <li>Die relative Häufigkeit liegt immer zwischen 0 und 1, also zwischen 0 % und 100 %: 0, wenn E nie eingetreten ist, 1, wenn E bei jedem Versuch eingetreten ist.</li>
      <li>Die relativen Häufigkeiten aller Ergebnisse ergeben zusammen 1, denn ihre absoluten Häufigkeiten ergeben zusammen n.</li>
      <li>Umgekehrt erhältst du die absolute Häufigkeit aus der relativen: H(E) = h(E) · n.</li>
      <li>Gehören zu einem Ereignis mehrere Ergebnisse, addierst du ihre absoluten Häufigkeiten: H(gerade Augenzahl) = H(2) + H(4) + H(6). Ebenso ist h(gerade Augenzahl) = h(2) + h(4) + h(6).</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Ein Reißnagel wurde 50-mal geworfen: 19-mal landete er mit der Spitze nach oben, 31-mal auf der Seite.<br>
      H(Spitze oben) = 19, h(Spitze oben) = 19 : 50 = ${frac(19, 50)} = 0,38 = 38 %.<br>
      H(Seitenlage) = 31, h(Seitenlage) = 31 : 50 = 0,62 = 62 %.<br>
      Probe: 0,38 + 0,62 = 1.</div>
    <p><strong>Vergleichen:</strong> Versuchsreihen verschiedener Länge vergleichst du nicht mit den absoluten Häufigkeiten. Glücksrad A brachte in 80 Drehungen 22 Gewinne, Glücksrad B in 150 Drehungen 36. B hat mehr Gewinne, aber die relative Häufigkeit ist bei A 22 : 80 = 0,275 = 27,5 %, bei B nur 36 : 150 = 0,24 = 24 %. Nach diesen Daten scheint A die besseren Gewinnchancen zu haben.</p>
    <p><strong>Ausblick auf Klasse 9:</strong> Was die relativen Häufigkeiten sehr langer Versuchsreihen mit der Wahrscheinlichkeit zu tun haben, lernst du in Klasse 9.</p>
    <p><strong>Typische Fehler:</strong> durch die falsche Zahl teilen (n : H statt H : n, oder durch die Zahl der übrigen Ergebnisse statt durch alle Versuche); verschieden lange Versuchsreihen an den absoluten Häufigkeiten vergleichen; Dezimalzahl und Prozent verwechseln: 0,38 sind 38 %, nicht 0,38 %.</p>
    <div class="merke"><strong>Merke:</strong> Die absolute Häufigkeit H(E) zählt, wie oft E eingetreten ist. Die relative Häufigkeit h(E) = H(E) : n liegt zwischen 0 und 1; die relativen Häufigkeiten aller Ergebnisse ergeben 1. Verschieden lange Versuchsreihen vergleichst du mit relativen Häufigkeiten.</div>
  `,
  formulas: [
    { name: "Absolute Häufigkeit", html: "H(E) = Anzahl der Versuche, bei denen E eintritt", quantities: "eine ganze Zahl von 0 bis n" },
    { name: "Relative Häufigkeit", html: `h(E) = H(E) : n = ${frac("H(E)", "n")}`, quantities: "n Anzahl aller Versuche; 0 ≤ h(E) ≤ 1, auch in Prozent" },
    { name: "Summe der relativen Häufigkeiten", html: "h(1) + h(2) + … + h(6) = 1", quantities: "beim Würfel; allgemein ergeben die relativen Häufigkeiten aller Ergebnisse zusammen 1" },
    { name: "Absolute aus relativer Häufigkeit", html: "H(E) = h(E) · n", quantities: "zum Beispiel 0,38 · 50 = 19" },
  ],
  quiz: {
    question: "In 40 Würfen fiel 8-mal eine Sechs. Wie groß ist die relative Häufigkeit der Sechs?",
    options: ["8", "5", "0,08", "0,2"],
    correctIndex: 3,
    explanation:
      "h(6) = H(6) : n = 8 : 40 = 0,2 = 20 %. Die 8 ist die absolute Häufigkeit, 5 entsteht aus 40 : 8 (umgekehrt geteilt), und 0,08 wären nur 8 %.",
  },
  lab: {
    kind: "frequency-simulation",
    title: "Labor: Versuchsreihen mit Würfel, Reißnagel und Glücksrad",
    intro:
      "Wähle ein Zufallsgerät und führe Versuche durch. Die Säulen zeigen die relativen Häufigkeiten, die Zahl darüber die absolute. Jedes Gerät behält seine eigene Versuchsreihe, so kannst du zwei Geräte vergleichen. Unten siehst du als Ausblick auf Klasse 9, wie sich die relative Häufigkeit von Versuch zu Versuch verändert.",
    params: [
      { type: "choice", key: "spiel", label: "Zufallsgerät", options: GAMES.map((g, value) => ({ value, label: g.name })), value: 0 },
      // the learner's own result for an Ereignis without a bar of its own
      { type: "range", key: "gerade", label: "Deine Rechnung: h(gerade Augenzahl)", unit: "%", min: 0, max: 100, step: 1, value: 0, digits: 0, showIf: (v) => v.spiel === 0 },
      {
        type: "choice",
        key: "tipp",
        label: "Deine Entscheidung",
        options: [
          { value: 0, label: "noch offen" },
          { value: 1, label: "Rad A gewinnt öfter" },
          { value: 2, label: "Rad B gewinnt öfter" },
        ],
        value: 0,
        showIf: (v) => v.spiel === 3,
      },
      ...GAMES.flatMap((_, g) => [
        { type: "state" as const, key: `n${g}`, value: 0 },
        { type: "state" as const, key: `s${g}`, value: GAME_SEEDS[g] },
      ]),
    ],
    readouts: [
      { key: "n", label: "Versuche", compute: (v) => `${gameOf(v).n} ${(GAMES[v.spiel] ?? GAMES[0]).trials}` },
      {
        key: "H",
        label: "absolute Häufigkeit",
        compute: (v) => {
          const g = GAMES[v.spiel] ?? GAMES[0];
          const r = gameOf(v);
          return v.spiel === 3 ? `Gewinn A: ${r.counts[0]}, Gewinn B: ${r.counts[1]}` : `H(${g.outcomes[g.focus]}) = ${r.counts[g.focus]}`;
        },
      },
      {
        key: "h",
        label: "relative Häufigkeit",
        emphasis: true,
        compute: (v) => {
          const g = GAMES[v.spiel] ?? GAMES[0];
          const r = gameOf(v);
          if (r.n === 0) return "noch kein Versuch";
          if (v.spiel === 3) return `A: ${relText(r.counts[0], r.n)}; B: ${relText(r.counts[1], r.n)}`;
          return `h(${g.outcomes[g.focus]}) = ${relText(r.counts[g.focus], r.n)} ${hPercent(r.counts[g.focus], r.n)}`;
        },
      },
      {
        key: "vergleich",
        label: "Vergleich",
        compute: (v) => {
          if (v.spiel === 2) return "h(Spitze oben) + h(Seitenlage) = 1";
          // names no winner: deciding from the two relative frequencies is the learner's part
          if (v.spiel === 3) {
            const n = gameOf(v).n;
            return n === 0 ? "noch keine Daten" : `beide Räder je ${n === 1 ? "einmal" : `${n}-mal`} gedreht: Vergleiche h(Gewinn A) mit h(Gewinn B).`;
          }
          const part = (g: number) => {
            const r = gameOf(v, g);
            return r.n === 0 ? "noch nicht gewürfelt" : `h(6) ${hText(r.counts[5], r.n)} (${r.n} Würfe)`;
          };
          return `normal: ${part(0)}; Fundbüro: ${part(1)}`;
        },
      },
    ],
    actions: [
      { id: "eins", label: "1 Versuch", apply: (v) => gameTrials(v, 1) },
      { id: "zehn", label: "10 Versuche", apply: (v) => gameTrials(v, 10) },
      { id: "hundert", label: "100 Versuche", apply: (v) => gameTrials(v, 100) },
      { id: "neu", label: "Reihe neu beginnen", apply: (v) => gameRestart(v) },
    ],
    goals: [
      {
        id: "gerade",
        text: "Das Ereignis „gerade Augenzahl“ hat keine eigene Säule. Würfle mit dem normalen Spielwürfel mindestens 300-mal, bestimme aus den Säulen H(gerade Augenzahl) und h(gerade Augenzahl) und stelle h in Prozent ein, auf ganze Prozent gerundet.",
        check: (v) => evenShareTyped(v),
      },
      {
        id: "fundbuero",
        text: "Ist der Würfel aus dem Fundbüro gezinkt? Würfle mit beiden Würfeln je mindestens 300-mal: Fällt beim Fundbüro-Würfel die Sechs deutlich öfter, mit einer um mindestens 0,05 größeren relativen Häufigkeit?",
        check: (v) => {
          const normal = gameOf(v, 0);
          const found = gameOf(v, 1);
          if (normal.n < 300 || found.n < 300) return false;
          // the difference of the two values the readout shows
          return roundedRatio(found.counts[5], found.n, 2) - roundedRatio(normal.counts[5], normal.n, 2) >= 0.05 - 1e-9;
        },
      },
      {
        id: "raeder",
        text: "Mit welchem Glücksrad gewinnst du öfter? Drehe beide mindestens 200-mal und stelle deine Entscheidung passend zu den relativen Häufigkeiten ein.",
        check: (v) => {
          const r = gameOf(v, 3);
          return r.n >= 200 && v.tipp !== 0 && v.tipp === wheelLeader(r);
        },
      },
    ],
  },
  exercises: [
    { id: "relativ", make: (rng, level) => relativTask(rng, level) },
    { id: "absolut", make: (rng, level) => absolutTask(rng, level) },
    { id: "summe", make: (rng, level) => summeTask(rng, level) },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest absolute und relative Häufigkeiten und schätzt damit Gewinnchancen aus Daten ein.",
};

export const STAGE_DATEN_ZUFALL: Stage = {
  id: STAGE_ID,
  stageNumber: 7,
  title: "Daten und Zufall",
  subtitle: "Ergebnisse und Ereignisse, Baumdiagramme, Vierfeldertafeln und Häufigkeiten",
  icon: "🎲",
  accent: "#dc2626",
  badgeTitle: "Zufallsforscher",
  lehrplanLabel: "LB 7 (I) · LB 6 (II/III)",
  lessons: [ergebnisEreignis, baumdiagramm, vierfeldertafel, haeufigkeiten],
};
