import { fmt, frac, fracText, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  approx,
  atLeastOnce,
  branchCount,
  chosenPath,
  COLOUR_WORD,
  type Colour,
  eventFraction,
  eventPaths,
  minTries,
  pathFraction,
  pathKey,
  pathProbability,
  probText,
  simulateSeries,
  simulateUrn,
  TREE_EVENTS,
  treePaths,
  triesBound,
} from "../lab/views-daten-zufall";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-8-daten-zufall";
const LEHRPLAN = "M10 LB 5 (I) · M10 LB 5 (II/III): Daten und Zufall";

// ─── Shared helpers ────────────────────────────────────────────────────────

/** A probability in percent with two decimals: pct(0.148148) → "14,81". */
const pct = (P: number) => fmt(P * 100, 2);
/** A probability with four decimals: dec(0.148148) → "0,1481". */
const dec = (P: number) => fmt(P, 4);
const COLOUR_PLURAL = ["rote", "blaue"] as const;
/** "rot, rot, blau" */
const words = (path: readonly Colour[]) => path.map((c) => COLOUR_WORD[c]).join(", ");
const randomPath = (rng: Rng): Colour[] => [rng.int(0, 1), rng.int(0, 1), rng.int(0, 1)] as Colour[];

/** The branch fractions along a path: ["4/7", "3/6", "3/5"]. */
function factorTexts(red: number, blue: number, without: boolean, path: readonly Colour[]): string[] {
  return path.map((colour, k) => {
    const [a, n] = branchCount(red, blue, without, path.slice(0, k), colour);
    return `${a}/${n}`;
  });
}

/** "24/120 = 1/5", or just "4/27" when it is already reduced. */
function reduced(num: number, den: number): string {
  const short = fracText(num, den);
  return short === `${num}/${den}` ? short : `${num}/${den} = ${short}`;
}

/** n · (n − 1) · … with `k` factors: the count of ordered draws without replacement. */
function falling(n: number, k: number): number {
  let product = 1;
  for (let i = 0; i < k; i++) product *= n - i;
  return product;
}

/** "4 · 3 · 2" */
const fallingText = (n: number, k: number) => Array.from({ length: k }, (_, i) => `${n - i}`).join(" · ");

/** Enough decimals that a value under the target never shows as reaching it (89,99 %, not 90,0 %). */
function probeDigits(before: number, target: number): number {
  return [1, 2, 3, 4].find((d) => round(before, d) < target) ?? 4;
}

// ─── 8.1 Mehrstufige Zufallsexperimente ────────────────────────────────────

/** Per draw of a die: the event and how many of the six faces belong to it. */
const DIE_EVENTS: Array<[string, number]> = [
  ["eine Sechs", 1],
  ["keine Sechs", 5],
  ["eine gerade Zahl", 3],
  ["eine Zahl kleiner als 3", 2],
  ["eine Primzahl", 3],
  ["eine Fünf oder Sechs", 2],
  ["eine Eins", 1],
  ["eine Zahl größer als 1", 5],
];

/** Glücksrad with the sectors Rot, Gelb, Grün: their Mittelpunktswinkel. */
const WHEELS = [
  [180, 120, 60],
  [90, 90, 180],
  [150, 90, 120],
  [120, 120, 120],
  [200, 100, 60],
  [240, 60, 60],
  [180, 90, 90],
  [60, 120, 180],
];
const WHEEL_COLOURS = ["Rot", "Gelb", "Grün"];

/** Lose: 0 = Gewinn, 1 = Niete; Anna, Ben and Cem draw in this order. */
const LOT_PATTERNS: Array<[string, Colour[]]> = [
  ["nur Cem gewinnt", [1, 1, 0]],
  ["nur Anna gewinnt", [0, 1, 1]],
  ["Anna und Ben gewinnen, Cem nicht", [0, 0, 1]],
  ["keiner der drei gewinnt", [1, 1, 1]],
  ["Ben gewinnt, Anna und Cem nicht", [1, 0, 1]],
];

function pathTask(rng: Rng): ExerciseTask {
  const context = rng.int(0, 3);
  if (context === 0) {
    const sweets = ["Erdbeere", "Zitrone"];
    const e = rng.int(4, 8);
    const z = rng.int(3, 6);
    const path = randomPath(rng);
    const [num, den] = pathFraction(e, z, true, path);
    const P = num / den;
    return {
      prompt: `In einer Tüte sind ${e} Erdbeer- und ${z} Zitronenbonbons. Mia nimmt, ohne hinzusehen, nacheinander drei Bonbons heraus und isst sie. Wie groß ist die Wahrscheinlichkeit, dass sie die Sorten in der Reihenfolge ${path.map((c) => sweets[c]).join(" – ")} erwischt? Gib das Ergebnis in Prozent an.`,
      given: [`${e} Erdbeere, ${z} Zitrone`, "drei Bonbons nacheinander, ohne Zurücklegen"],
      fields: [
        numberField("P =", P * 100, "%", 2, {
          slips: [{ value: pathProbability(e, z, false, path) * 100, hint: "Mia isst die Bonbons: Sie kommen nicht in die Tüte zurück, die Nenner werden kleiner." }],
        }),
      ],
      steps: [
        `Dreistufiges Baumdiagramm mit E und Z, ohne Zurücklegen: ${e + z}, dann ${e + z - 1}, dann ${e + z - 2} Bonbons in der Tüte.`,
        `1. Pfadregel: P = ${factorTexts(e, z, true, path).join(" · ")} = ${reduced(num, den)}`,
        `<strong>P ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
      ],
      meta: { context, r: e, b: z, without: 1, c1: path[0], c2: path[1], c3: path[2] },
    };
  }
  if (context === 1) {
    const angles = rng.pick(WHEELS);
    const spins = [rng.int(0, 2), rng.int(0, 2), rng.int(0, 2)];
    const num = spins.reduce((product, s) => product * angles[s], 1);
    const den = 360 ** 3;
    const P = num / den;
    const added = spins.reduce((sum, s) => sum + angles[s] / 360, 0);
    return {
      prompt: `Ein Glücksrad hat drei Felder: Rot mit dem Mittelpunktswinkel ${angles[0]}°, Gelb mit ${angles[1]}° und Grün mit ${angles[2]}°. Es wird dreimal gedreht. Wie groß ist die Wahrscheinlichkeit für die Farbfolge ${spins.map((s) => WHEEL_COLOURS[s]).join(" – ")}? Gib das Ergebnis in Prozent an.`,
      given: [`Rot ${angles[0]}°, Gelb ${angles[1]}°, Grün ${angles[2]}°`, "dreimal drehen, jede Drehung unabhängig"],
      fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: added * 100, hint: "Entlang eines Pfades wird multipliziert, nicht addiert." }] })],
      steps: [
        `Je Drehung: P(Feld) = Mittelpunktswinkel : 360°, also ${WHEEL_COLOURS.map((name, i) => `${name} ${fracText(angles[i], 360)}`).join(", ")}`,
        `1. Pfadregel: P = ${spins.map((s) => fracText(angles[s], 360)).join(" · ")} = ${fracText(num, den)}`,
        `<strong>P ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
      ],
      meta: { context, a0: angles[0], a1: angles[1], a2: angles[2], s1: spins[0], s2: spins[1], s3: spins[2] },
    };
  }
  if (context === 2) {
    const picks = [rng.pick(DIE_EVENTS), rng.pick(DIE_EVENTS), rng.pick(DIE_EVENTS)];
    const num = picks.reduce((product, [, k]) => product * k, 1);
    const P = num / 216;
    return {
      prompt: `Ein Laplace-Würfel wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit, dass beim ersten Wurf ${picks[0][0]}, beim zweiten ${picks[1][0]} und beim dritten ${picks[2][0]} fällt? Gib das Ergebnis in Prozent an.`,
      given: ["Laplace-Würfel, dreimal geworfen", "jeder Wurf ist eine Stufe"],
      fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: ((picks[0][1] + picks[1][1] + picks[2][1]) / 6) * 100, hint: "Entlang eines Pfades wird multipliziert, nicht addiert." }] })],
      steps: [
        `Je Wurf zählen: ${picks.map(([label, k]) => `${label} ${k}/6`).join(", ")}`,
        `1. Pfadregel: P = ${picks.map(([, k]) => `${k}/6`).join(" · ")} = ${reduced(num, 216)}`,
        `<strong>P ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
      ],
      meta: { context, k1: picks[0][1], k2: picks[1][1], k3: picks[2][1] },
    };
  }
  const lots = rng.pick([10, 12, 15, 20]);
  const wins = rng.int(3, 5);
  const [label, path] = rng.pick(LOT_PATTERNS);
  const [num, den] = pathFraction(wins, lots - wins, true, path);
  const P = num / den;
  return {
    prompt: `In einer Lostrommel liegen ${lots} Lose, darunter ${wins} Gewinne. Anna, Ben und Cem ziehen nacheinander je ein Los und behalten es. Wie groß ist die Wahrscheinlichkeit, dass ${label}? Gib das Ergebnis in Prozent an.`,
    given: [`${lots} Lose, ${wins} Gewinne`, "drei Lose nacheinander, ohne Zurücklegen"],
    fields: [
      numberField("P =", P * 100, "%", 2, {
        slips: [{ value: pathProbability(wins, lots - wins, false, path) * 100, hint: "Die Lose werden behalten: Nach jedem Zug ist ein Los weniger in der Trommel." }],
      }),
    ],
    steps: [
      `Pfad (G = Gewinn, N = Niete): ${path.map((c) => (c === 0 ? "G" : "N")).join(" – ")}`,
      `1. Pfadregel: P = ${factorTexts(wins, lots - wins, true, path).join(" · ")} = ${reduced(num, den)}`,
      `<strong>P ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
    ],
    meta: { context, r: wins, b: lots - wins, without: 1, c1: path[0], c2: path[1], c3: path[2] },
  };
}

const mehrstufig: Lesson = {
  id: "dz-1-mehrstufig",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "8.1 Mehrstufige Zufallsexperimente im Baumdiagramm",
  subtitle: "Drei Züge, mit und ohne Zurücklegen",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, mehrstufige Zufallsexperimente`,
  whyItMatters:
    "Drei Lose ziehen, dreimal würfeln, ein Glücksrad mehrmals drehen: Viele Zufallsexperimente laufen in Stufen ab. Im Baumdiagramm siehst du jeden möglichen Ablauf und kannst ihm seine Wahrscheinlichkeit zuordnen.",
  explanationHtml: `
    <p>Ein Zufallsexperiment aus mehreren Schritten heißt <strong>mehrstufig</strong>. Im <strong>Baumdiagramm</strong> ist jeder Schritt eine Stufe. Ein <strong>Pfad</strong> vom Start bis zum Ende ist ein <strong>Ergebnis</strong>, zum Beispiel rrb (rot, rot, blau).</p>
    <ul>
      <li>An jedem Ast steht die Wahrscheinlichkeit dieses Schritts. Die Äste, die von einem Punkt ausgehen, ergeben zusammen 1.</li>
      <li>Bei zwei Farben und drei Zügen hat der Baum 2 · 2 · 2 = 8 Pfade, beim dreimaligen Würfeln 6 · 6 · 6 = 216.</li>
      <li><strong>1. Pfadregel (Produktregel):</strong> Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades.</li>
    </ul>
    <p><strong>Mit Zurücklegen</strong> ist die Urne vor jedem Zug wieder vollständig: Jede Stufe hat dieselben Äste. <strong>Ohne Zurücklegen</strong> fehlt nach jedem Zug eine Kugel: Der Nenner wird von Stufe zu Stufe um 1 kleiner, und bei der gezogenen Farbe auch der Zähler.</p>
    <div class="example">Urne mit 4 roten und 2 blauen Kugeln, es wird dreimal gezogen.<br>
      Ohne Zurücklegen: P(rrb) = ${frac(4, 6)} · ${frac(3, 5)} · ${frac(2, 4)} = ${frac(24, 120)} = ${frac(1, 5)} = 20 %.<br>
      Mit Zurücklegen: P(rrb) = ${frac(4, 6)} · ${frac(4, 6)} · ${frac(2, 6)} = ${frac(32, 216)} = ${frac(4, 27)} ≈ 14,81 %.</div>
    <p>Ohne Zurücklegen kann ein Pfad sogar unmöglich werden: Mit nur 2 roten Kugeln ist P(rrr) = ${frac(2, 6)} · ${frac(1, 5)} · ${frac(0, 4)} = 0. Die Summe aller Pfadwahrscheinlichkeiten ist immer 1; das ist eine gute Probe für dein Baumdiagramm.</p>
    <div class="merke"><strong>Merke:</strong> Entlang eines Pfades multiplizieren. Ohne Zurücklegen vor jedem Zug neu zählen: Was liegt noch in der Urne?</div>
  `,
  formulas: [
    { name: "1. Pfadregel (Produktregel)", html: "P(Pfad) = p₁ · p₂ · p₃", quantities: "Astwahrscheinlichkeiten entlang des Pfades" },
    {
      name: "Ziehen ohne Zurücklegen",
      html: `P(rrr) = ${frac("r", "n")} · ${frac("r − 1", "n − 1")} · ${frac("r − 2", "n − 2")}`,
      quantities: "r rote unter n Kugeln; nach jedem Zug ist eine Kugel weniger in der Urne",
    },
    { name: "Probe im Baumdiagramm", html: "Äste aus einem Punkt: zusammen 1; alle Pfade: zusammen 1", quantities: "z. B. P(rot) + P(blau) = 1" },
  ],
  quiz: {
    question: "Aus einer Urne mit 3 roten und 2 blauen Kugeln ziehst du dreimal ohne Zurücklegen. Zuerst kommt rot, dann blau. Welche Wahrscheinlichkeit steht am Ast „blau“ im dritten Zug?",
    options: ["1/3", "2/5", "1/5", "2/3"],
    correctIndex: 0,
    explanation: "Nach rot und blau liegen noch 2 rote und 1 blaue Kugel in der Urne, also 3 Kugeln: P(blau) = 1/3. Ohne Zurücklegen ändern sich die Äste von Stufe zu Stufe.",
  },
  lab: {
    kind: "tree-urn",
    title: "Labor: Drei Kugeln aus der Urne",
    intro:
      "Lege die Urne fest (Regler oder die runden Griffe über den Kugeln), wähle zwei oder drei Züge und einen Pfad. Der Baum zeigt alle Astwahrscheinlichkeiten; mit den Knöpfen ziehst du zur Probe.",
    params: [
      { type: "range", key: "rot", label: "rote Kugeln", unit: "", min: 2, max: 8, step: 1, value: 4 },
      { type: "range", key: "blau", label: "blaue Kugeln", unit: "", min: 2, max: 8, step: 1, value: 2 },
      { type: "choice", key: "draws", label: "Züge", options: [{ value: 2, label: "zwei Züge" }, { value: 3, label: "drei Züge" }], value: 3 },
      { type: "choice", key: "mode", label: "Ziehen", options: [{ value: 0, label: "mit Zurücklegen" }, { value: 1, label: "ohne Zurücklegen" }], value: 1 },
      { type: "choice", key: "z1", label: "Pfad: 1. Kugel", options: [{ value: 0, label: "rot" }, { value: 1, label: "blau" }], value: 0 },
      { type: "choice", key: "z2", label: "Pfad: 2. Kugel", options: [{ value: 0, label: "rot" }, { value: 1, label: "blau" }], value: 0 },
      { type: "choice", key: "z3", label: "Pfad: 3. Kugel", options: [{ value: 0, label: "rot" }, { value: 1, label: "blau" }], value: 1, showIf: (v) => v.draws === 3 },
      { type: "state", key: "n", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "last", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: 20261022 },
    ],
    readouts: [
      {
        key: "P",
        label: "P(gewählter Pfad)",
        emphasis: true,
        compute: (v) => {
          const path = chosenPath(v);
          const [num, den] = pathFraction(v.rot, v.blau, v.mode === 1, path);
          return `${pathKey(path)}: ${probText(num, den)}`;
        },
      },
      {
        key: "vergleich",
        label: "mit / ohne Zurücklegen",
        compute: (v) => {
          const path = chosenPath(v);
          return `${pct(pathProbability(v.rot, v.blau, false, path))} % / ${pct(pathProbability(v.rot, v.blau, true, path))} %`;
        },
      },
      { key: "freq", label: "relative Häufigkeit", compute: (v) => (v.n > 0 ? `${fmt((v.hits / v.n) * 100, 1)} % bei ${v.n} Versuchen` : "noch nicht gezogen") },
      { key: "zuletzt", label: "zuletzt gezogen", compute: (v) => (v.last > 0 ? words(treePaths(v.draws)[v.last - 1]) : "noch nichts") },
    ],
    actions: [
      { id: "eins", label: "1× ziehen", apply: (v) => simulateUrn(v, 1) },
      { id: "hundert", label: "100× ziehen", apply: (v) => simulateUrn(v, 100) },
      { id: "neu", label: "Zählung neu starten", apply: (v) => ({ ...v, n: 0, hits: 0, last: 0 }) },
    ],
    goals: [
      {
        id: "achtel",
        text: "Mit Zurücklegen, drei Züge: Stelle Urne und Pfad so ein, dass dein Pfad genau die Wahrscheinlichkeit 1/8 hat. Was fällt dir an der Urne auf?",
        check: (v) => v.draws === 3 && v.mode === 0 && Math.abs(pathProbability(v.rot, v.blau, false, chosenPath(v)) - 1 / 8) < 1e-9,
      },
      {
        id: "unmoeglich",
        text: "Ohne Zurücklegen, drei Züge: Mache deinen Pfad unmöglich (P = 0). Welche Kugeln dürfen dafür nur zweimal in der Urne liegen?",
        check: (v) => v.draws === 3 && v.mode === 1 && pathFraction(v.rot, v.blau, true, chosenPath(v))[0] === 0,
      },
      {
        id: "simulation",
        text: "Ziehe mindestens 500-mal (Knopf „100× ziehen“): Die relative Häufigkeit deines Pfades liegt dann höchstens 3 Prozentpunkte neben seiner Wahrscheinlichkeit.",
        check: (v) => v.n >= 500 && Math.abs(v.hits / v.n - pathProbability(v.rot, v.blau, v.mode === 1, chosenPath(v))) <= 0.03,
      },
    ],
  },
  exercises: [
    {
      id: "pfad",
      make: (rng, level): ExerciseTask => {
        if (level === 2) return pathTask(rng);
        const without = rng.next() < 0.6;
        const r = rng.int(3, 7);
        const b = rng.int(3, 7);
        const path = randomPath(rng);
        const key = pathKey(path);
        const [num, den] = pathFraction(r, b, without, path);
        const P = num / den;
        const added = path.reduce<number>((sum, colour, k) => {
          const [a, n] = branchCount(r, b, without, path.slice(0, k), colour);
          return sum + a / n;
        }, 0);
        const counts = path.map((colour, k) => branchCount(r, b, without, path.slice(0, k), colour));
        return {
          prompt: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Du ziehst nacheinander drei Kugeln ${without ? "ohne" : "mit"} Zurücklegen. Berechne die Wahrscheinlichkeit des Pfades ${key} (${words(path)}).`,
          given: [`${r} rote und ${b} blaue Kugeln, zusammen ${r + b}`, `dreimal ${without ? "ohne" : "mit"} Zurücklegen`],
          formulaHint: "1. Pfadregel: P(Pfad) = p₁ · p₂ · p₃",
          fields: [
            numberField(`P(${key}) =`, P, "", 4, {
              slips: [
                {
                  value: pathProbability(r, b, !without, path),
                  hint: without ? "Ohne Zurücklegen fehlt nach jedem Zug eine Kugel: Die Nenner werden kleiner." : "Mit Zurücklegen ist die Urne vor jedem Zug wieder vollständig: Jede Stufe hat dieselben Äste.",
                },
                { value: added, hint: "Entlang eines Pfades wird multipliziert, nicht addiert." },
              ],
            }),
          ],
          steps: [
            without
              ? counts.map(([a, n], k) => (k === 0 ? `1. Zug: ${a} von ${n} Kugeln sind ${COLOUR_WORD[path[k]]}` : `${k + 1}. Zug: noch ${n} Kugeln, davon ${a} ${COLOUR_PLURAL[path[k]]}`)).join("; ")
              : `Mit Zurücklegen hat jede Stufe dieselben Äste: rot ${r}/${r + b}, blau ${b}/${r + b}.`,
            `P(${key}) = ${factorTexts(r, b, without, path).join(" · ")} = ${reduced(num, den)}`,
            `<strong>P(${key}) ${approx(P, 4)} ${dec(P)} ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
          ],
          meta: { r, b, without: without ? 1 : 0, c1: path[0], c2: path[1], c3: path[2] },
        };
      },
    },
    {
      id: "baum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.int(3, 7);
          const b = rng.int(3, 7);
          const path = randomPath(rng);
          const key = pathKey(path);
          const counts = path.map((colour, k) => branchCount(r, b, true, path.slice(0, k), colour));
          const [num, den] = pathFraction(r, b, true, path);
          const stage = (k: number, extra: Partial<Parameters<typeof numberField>[4]> = {}) =>
            numberField(`${k + 1}. Zug (${COLOUR_WORD[path[k]]}):`, counts[k][0] / counts[k][1], "", 4, extra);
          const full = (k: number) => (path[k] === 0 ? r : b) / (r + b);
          const slip = { hint: "Ohne Zurücklegen: Vor diesem Zug fehlen schon Kugeln, zähle neu." };
          return {
            prompt: `Aus einer Urne mit ${r} roten und ${b} blauen Kugeln werden nacheinander drei Kugeln ohne Zurücklegen gezogen. Gib entlang des Pfades ${key} (${words(path)}) die drei Astwahrscheinlichkeiten an und berechne die Wahrscheinlichkeit dieses Pfades.`,
            given: [`${r} rot, ${b} blau`, "dreimal ohne Zurücklegen", `Pfad ${key}`],
            formulaHint: "Ohne Zurücklegen vor jedem Zug neu zählen: Wie viele Kugeln, wie viele der Farbe sind noch da? Dann P(Pfad) = p₁ · p₂ · p₃",
            fields: [
              stage(0),
              stage(1, { slips: [{ value: full(1), ...slip }] }),
              stage(2, { slips: [{ value: full(2), ...slip }] }),
              numberField(`P(${key}) =`, num / den, "", 4),
            ],
            steps: [
              `1. Zug: ${counts[0][0]} von ${counts[0][1]} Kugeln sind ${COLOUR_WORD[path[0]]}: ${counts[0][0]}/${counts[0][1]}`,
              `2. Zug: noch ${counts[1][1]} Kugeln, davon ${counts[1][0]} ${COLOUR_PLURAL[path[1]]}: ${counts[1][0]}/${counts[1][1]}`,
              `3. Zug: noch ${counts[2][1]} Kugeln, davon ${counts[2][0]} ${COLOUR_PLURAL[path[2]]}: ${counts[2][0]}/${counts[2][1]}`,
              `<strong>P(${key}) = ${factorTexts(r, b, true, path).join(" · ")} = ${reduced(num, den)} ${approx(num / den, 4)} ${dec(num / den)}</strong>`,
            ],
            meta: { r, b, c1: path[0], c2: path[1], c3: path[2] },
          };
        }
        // Transfer: from the probability of "all red" back to the number of red balls.
        const draws = rng.pick([2, 3]);
        const total = draws === 2 ? rng.pick([8, 9, 10, 12, 15, 16, 20]) : rng.pick([8, 9, 10, 12]);
        const red = rng.int(draws, total - draws);
        const num = falling(red, draws);
        const den = falling(total, draws);
        const none = falling(total - red, draws) / den;
        const factors = draws === 2 ? "x · (x − 1)" : "x · (x − 1) · (x − 2)";
        const tries = Array.from({ length: Math.min(3, red - draws + 1) }, (_, i) => red - i)
          .reverse()
          .map((x) => `${fallingText(x, draws)} = ${falling(x, draws)}${x === red ? " ✓" : ""}`);
        return {
          prompt: `In einem Beutel liegen ${total} Kugeln, ein Teil davon ist rot. Lisa zieht ${draws === 2 ? "zwei" : "drei"} Kugeln ohne Zurücklegen. Die Wahrscheinlichkeit, dass ${draws === 2 ? "beide" : "alle drei"} rot sind, beträgt ${fracText(num, den)}. Wie viele rote Kugeln sind im Beutel? Wie wahrscheinlich ist dann, dass keine der gezogenen Kugeln rot ist?`,
          given: [`${total} Kugeln, x davon rot`, `P(${draws === 2 ? "rr" : "rrr"}) = ${fracText(num, den)}`, "ohne Zurücklegen"],
          fields: [numberField("rote Kugeln x =", red, "", 0), numberField("P(keine rote) =", none * 100, "%", 2)],
          steps: [
            `1. Pfadregel: P(${draws === 2 ? "rr" : "rrr"}) = ${draws === 2 ? `x/${total} · (x − 1)/${total - 1}` : `x/${total} · (x − 1)/${total - 1} · (x − 2)/${total - 2}`}`,
            `Also ${factors} = ${fracText(num, den)} · ${fallingText(total, draws)} = ${num}`,
            `Probieren: ${tries.join(", ")}`,
            `<strong>x = ${red}; P(keine rote) = ${fallingText(total - red, draws)} : (${fallingText(total, draws)}) ${approx(none * 100, 2)} ${pct(none)} %</strong>`,
          ],
          meta: { total, red, draws },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest mehrstufige Baumdiagramme und berechnest Pfade mit und ohne Zurücklegen.",
};

// ─── 8.2 Pfadregeln für Ereignisse ─────────────────────────────────────────

/** Events of three draws whose complement has few paths, with the complement and plausible wrong ones. */
const COMPLEMENT_CASES: Array<{ event: string; complement: string; paths: Colour[][]; wrong: string[] }> = [
  { event: "mindestens eine rote Kugel", complement: "keine rote Kugel", paths: [[1, 1, 1]], wrong: ["höchstens eine rote Kugel", "genau eine rote Kugel", "drei rote Kugeln"] },
  { event: "höchstens zwei rote Kugeln", complement: "drei rote Kugeln", paths: [[0, 0, 0]], wrong: ["mindestens zwei rote Kugeln", "keine rote Kugel", "genau zwei rote Kugeln"] },
  {
    event: "nicht alle Kugeln haben dieselbe Farbe",
    complement: "alle Kugeln haben dieselbe Farbe",
    paths: [[0, 0, 0], [1, 1, 1]],
    wrong: ["drei rote Kugeln", "genau eine rote Kugel", "keine rote Kugel"],
  },
  {
    event: "höchstens eine rote Kugel",
    complement: "mindestens zwei rote Kugeln",
    paths: [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]],
    wrong: ["mindestens eine rote Kugel", "genau zwei rote Kugeln", "keine rote Kugel"],
  },
  { event: "mindestens eine blaue Kugel", complement: "keine blaue Kugel", paths: [[0, 0, 0]], wrong: ["keine rote Kugel", "genau eine blaue Kugel", "höchstens eine blaue Kugel"] },
];

/** A claim threshold (multiple of 5) clearly away from the true value, so rounding never decides. */
function claimThreshold(rng: Rng, percent: number): number {
  const candidates: number[] = [];
  for (let x = 10; x <= 90; x += 5) if (Math.abs(percent - x) >= 1.5 && Math.abs(percent - x) <= 15) candidates.push(x);
  return candidates.length > 0 ? rng.pick(candidates) : percent < 50 ? 95 : 5;
}

const pfadregeln: Lesson = {
  id: "dz-2-pfadregeln",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "8.2 Pfadregeln für Ereignisse",
  subtitle: "Genau, höchstens, mindestens: Pfade addieren",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Pfadregeln`,
  whyItMatters:
    "Gefragt ist selten ein einzelner Ablauf, sondern „genau zwei“, „höchstens einer“ oder „mindestens einer“. Mit der zweiten Pfadregel und dem Gegenereignis rechnest du solche Ereignisse schnell und sicher aus.",
  explanationHtml: `
    <p>Ein <strong>Ereignis</strong> E fasst mehrere Ergebnisse zusammen, zum Beispiel „genau zwei rote Kugeln“ bei drei Zügen. Im Baumdiagramm gehören dazu mehrere Pfade.</p>
    <ul>
      <li><strong>2. Pfadregel (Summenregel):</strong> Die Wahrscheinlichkeit eines Ereignisses ist die Summe der Wahrscheinlichkeiten aller Pfade, die zu ihm gehören.</li>
      <li>„Genau zwei rote“: rrb, rbr und brr. Diese drei Pfade sind gleich wahrscheinlich, auch ohne Zurücklegen, denn sie haben dieselben Faktoren in anderer Reihenfolge. Also P = 3 · P(rrb).</li>
      <li>„Mindestens eine rote“ hat sieben Pfade, das <strong>Gegenereignis</strong> Ē „keine rote“ nur einen: P(E) = 1 − P(Ē) = 1 − P(bbb).</li>
      <li>„Höchstens eine rote“ heißt keine oder genau eine rote. Das Gegenereignis ist „mindestens zwei rote“, nicht „mindestens eine“.</li>
      <li>Im <strong>verkürzten Baumdiagramm</strong> zeichnest du nur die Pfade, die du für das Ereignis brauchst.</li>
    </ul>
    <div class="example">Urne mit 4 roten und 2 blauen Kugeln, es wird dreimal gezogen.<br>
      Ohne Zurücklegen: P(genau zwei rote) = P(rrb) + P(rbr) + P(brr) = 3 · ${frac(24, 120)} = ${frac(72, 120)} = ${frac(3, 5)} = 60 %.<br>
      Mit Zurücklegen: P(mindestens eine rote) = 1 − P(bbb) = 1 − (${frac(2, 6)})<sup>3</sup> = 1 − ${frac(1, 27)} = ${frac(26, 27)} ≈ 96,30 %.</div>
    <div class="merke"><strong>Merke:</strong> Erst die passenden Pfade suchen, dann ihre Wahrscheinlichkeiten addieren. Hat das Gegenereignis weniger Pfade, rechne 1 − P(Gegenereignis).</div>
  `,
  formulas: [
    { name: "2. Pfadregel (Summenregel)", html: "P(E) = P(Pfad 1) + P(Pfad 2) + …", quantities: "alle Pfade, die zum Ereignis E gehören" },
    { name: "Gegenereignis", html: "P(Ē) = 1 − P(E)", quantities: "Ē tritt genau dann ein, wenn E nicht eintritt" },
    { name: "Genau zwei von drei", html: "P(genau zwei rote) = 3 · P(rrb)", quantities: "die Pfade rrb, rbr und brr sind gleich wahrscheinlich" },
  ],
  quiz: {
    question: "Du ziehst dreimal eine Kugel. Was ist das Gegenereignis von „höchstens eine rote Kugel“?",
    options: ["mindestens zwei rote Kugeln", "mindestens eine rote Kugel", "keine rote Kugel", "genau zwei rote Kugeln"],
    correctIndex: 0,
    explanation: "„Höchstens eine“ heißt keine oder genau eine. Alle anderen Ausgänge, also zwei oder drei rote, bilden das Gegenereignis „mindestens zwei rote Kugeln“.",
  },
  lab: {
    kind: "path-rules",
    title: "Labor: Pfade sammeln",
    intro:
      "Wähle ein Ereignis: Seine Pfade leuchten lila, oben steht ihre Summe. Schalte auf den verkürzten Baum oder auf das Gegenereignis (orange). Die Urne stellst du mit den Reglern oder den Griffen ein.",
    params: [
      { type: "range", key: "rot", label: "rote Kugeln", unit: "", min: 2, max: 8, step: 1, value: 4 },
      { type: "range", key: "blau", label: "blaue Kugeln", unit: "", min: 2, max: 8, step: 1, value: 2 },
      { type: "choice", key: "mode", label: "Ziehen", options: [{ value: 0, label: "mit Zurücklegen" }, { value: 1, label: "ohne Zurücklegen" }], value: 1 },
      { type: "choice", key: "event", label: "Ereignis (drei Züge)", options: TREE_EVENTS.map((event, value) => ({ value, label: event.label })), value: 1 },
      {
        type: "choice",
        key: "sicht",
        label: "Ansicht",
        options: [
          { value: 0, label: "ganzer Baum" },
          { value: 1, label: "verkürzter Baum" },
          { value: 2, label: "Gegenereignis markieren" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "P", label: "P(Ereignis)", emphasis: true, compute: (v) => probText(...eventFraction(v.rot, v.blau, v.mode === 1, v.event)) },
      { key: "pfade", label: "Pfade des Ereignisses", compute: (v) => `${eventPaths(v.event).length} von 8: ${eventPaths(v.event).map(pathKey).join(", ")}` },
      {
        key: "gegen",
        label: "P(Gegenereignis)",
        compute: (v) => {
          const [num, den] = eventFraction(v.rot, v.blau, v.mode === 1, v.event);
          return probText(den - num, den);
        },
      },
    ],
    goals: [
      {
        id: "fuenfzig",
        text: "Ohne Zurücklegen: Finde eine Urne, bei der „genau zwei rote“ genau 50 % hat. Tipp: Die drei Pfade sind gleich wahrscheinlich, jeder braucht also 1/6.",
        check: (v) => v.mode === 1 && v.event === 1 && Math.abs(eventFraction(v.rot, v.blau, true, 1)[0] / eventFraction(v.rot, v.blau, true, 1)[1] - 0.5) < 1e-9,
      },
      {
        id: "gegen",
        text: "„Mindestens eine rote“ hat sieben Pfade, das Gegenereignis nur einen. Markiere das Gegenereignis und stelle mit Zurücklegen eine Urne ein, bei der P(mindestens eine rote) mindestens 99 % ist.",
        check: (v) => v.mode === 0 && v.event === 4 && v.sicht === 2 && eventFraction(v.rot, v.blau, false, 4)[0] / eventFraction(v.rot, v.blau, false, 4)[1] >= 0.99,
      },
      {
        id: "verkuerzt",
        text: "Zeige den verkürzten Baum für „höchstens eine rote“ und finde eine Urne, bei der dieses Ereignis genauso wahrscheinlich ist wie sein Gegenereignis.",
        check: (v) => v.event === 5 && v.sicht === 1 && Math.abs(eventFraction(v.rot, v.blau, v.mode === 1, 5)[0] / eventFraction(v.rot, v.blau, v.mode === 1, 5)[1] - 0.5) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "genau",
      make: (rng, level): ExerciseTask => {
        const k = rng.pick([1, 2]);
        const event = k === 2 ? 1 : 2;
        const paths = eventPaths(event);
        if (level === 1) {
          const without = rng.next() < 0.5;
          const r = rng.int(3, 7);
          const b = rng.int(3, 7);
          const [one, den] = pathFraction(r, b, without, paths[0]);
          const [num] = eventFraction(r, b, without, event);
          const name = k === 2 ? "genau zwei rote Kugeln" : "genau eine rote Kugel";
          return {
            prompt: `Aus einer Urne mit ${r} roten und ${b} blauen Kugeln werden drei Kugeln ${without ? "ohne" : "mit"} Zurücklegen gezogen. Berechne P(${pathKey(paths[0])}) und die Wahrscheinlichkeit für ${name}.`,
            given: [`${r} rot, ${b} blau`, `dreimal ${without ? "ohne" : "mit"} Zurücklegen`],
            formulaHint: `2. Pfadregel; die drei Pfade ${paths.map(pathKey).join(", ")} sind gleich wahrscheinlich: P = 3 · P(${pathKey(paths[0])})`,
            fields: [
              numberField(`P(${pathKey(paths[0])}) =`, one / den, "", 4),
              numberField(`P(${k === 2 ? "genau zwei rote" : "genau eine rote"}) =`, num / den, "", 4, {
                slips: [
                  { value: one / den, hint: `Zum Ereignis gehören drei Pfade: ${paths.map(pathKey).join(", ")}. Addiere sie.` },
                  { value: eventFraction(r, b, !without, event)[0] / eventFraction(r, b, !without, event)[1], hint: without ? "Ohne Zurücklegen fehlt nach jedem Zug eine Kugel." : "Mit Zurücklegen ist die Urne vor jedem Zug wieder vollständig." },
                ],
              }),
            ],
            steps: [
              `Zu „${name}“ gehören die Pfade ${paths.map(pathKey).join(", ")}.`,
              `P(${pathKey(paths[0])}) = ${factorTexts(r, b, without, paths[0]).join(" · ")} = ${one}/${den}; die beiden anderen Pfade haben dieselben Faktoren in anderer Reihenfolge.`,
              `<strong>P = 3 · ${one}/${den} = ${reduced(num, den)} ${approx(num / den, 4)} ${dec(num / den)}</strong>`,
            ],
            meta: { r, b, without: without ? 1 : 0, k },
          };
        }
        const context = rng.int(0, 2);
        if (context === 0) {
          const hit = rng.pick([60, 65, 70, 75, 80, 85, 90]) / 100;
          const onePath = hit ** k * (1 - hit) ** (3 - k);
          const P = 3 * onePath;
          return {
            prompt: `Eine Basketballerin trifft beim Freiwurf mit ${fmt(hit * 100, 0)} % Wahrscheinlichkeit, unabhängig von den anderen Würfen. Sie wirft dreimal. Wie groß ist die Wahrscheinlichkeit, dass sie genau ${k === 2 ? "zweimal" : "einmal"} trifft? Gib das Ergebnis in Prozent an.`,
            given: [`P(Treffer) = ${fmt(hit, 2)}`, "drei Würfe"],
            fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: onePath * 100, hint: "Das ist nur ein Pfad. Genau " + (k === 2 ? "zwei Treffer" : "ein Treffer") + " geht auf drei Pfaden." }] })],
            steps: [
              `Pfade (T Treffer, D daneben): ${k === 2 ? "TTD, TDT, DTT" : "TDD, DTD, DDT"}`,
              `Jeder Pfad: ${k === 2 ? `${fmt(hit, 2)}² · ${fmt(1 - hit, 2)}` : `${fmt(hit, 2)} · ${fmt(1 - hit, 2)}²`} = ${fmt(onePath, 6)}`,
              `<strong>P = 3 · ${fmt(onePath, 6)} ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
            ],
            meta: { context, hit: hit * 100, k },
          };
        }
        const lottery = context === 1;
        const total = lottery ? rng.pick([10, 12, 15, 20]) : 0;
        const red = lottery ? rng.int(3, 6) : rng.int(10, 16);
        const blue = lottery ? total - red : rng.int(10, 16);
        const [one, den] = pathFraction(red, blue, true, paths[0]);
        const P = (3 * one) / den;
        const what = lottery ? (k === 2 ? "zwei Gewinne" : "einen Gewinn") : k === 2 ? "zwei Mädchen" : "ein Mädchen";
        return {
          prompt: lottery
            ? `Bei einer Tombola liegen ${red + blue} Lose in der Trommel, darunter ${red} Gewinne. Du ziehst nacheinander drei Lose. Wie groß ist die Wahrscheinlichkeit für genau ${what}? Gib das Ergebnis in Prozent an.`
            : `In der 10b sind ${red} Mädchen und ${blue} Jungen. Für den Aufbau des Schulfests werden drei Kinder ausgelost. Wie wahrscheinlich ${k === 2 ? "sind" : "ist"} genau ${what} dabei? Gib das Ergebnis in Prozent an.`,
          given: lottery ? [`${red + blue} Lose, ${red} Gewinne`, "drei Lose, ohne Zurücklegen"] : [`${red} Mädchen, ${blue} Jungen`, "drei verschiedene Kinder"],
          fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: (one / den) * 100, hint: `Das ist nur ein Pfad. Genau ${what}: drei Pfade.` }] })],
          steps: [
            `Drei Pfade, je nachdem, an welcher Stelle ${k === 2 ? (lottery ? "die Niete" : "der Junge") : lottery ? "der Gewinn" : "das Mädchen"} kommt; ohne Zurücklegen, aber gleich wahrscheinlich.`,
            `Ein Pfad: ${factorTexts(red, blue, true, paths[0]).join(" · ")} = ${reduced(one, den)}`,
            `<strong>P = 3 · ${fracText(one, den)} = ${fracText(3 * one, den)} ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
          ],
          meta: { context, r: red, b: blue, without: 1, k },
        };
      },
    },
    {
      id: "mindestens",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const without = rng.next() < 0.5;
          const r = rng.int(2, 7);
          const b = rng.int(3, 7);
          const [none, den] = pathFraction(r, b, without, [1, 1, 1]);
          const P = 1 - none / den;
          return {
            prompt: `Aus einer Urne mit ${r} roten und ${b} blauen Kugeln werden drei Kugeln ${without ? "ohne" : "mit"} Zurücklegen gezogen. Berechne die Wahrscheinlichkeit für keine rote Kugel und für mindestens eine rote Kugel.`,
            given: [`${r} rot, ${b} blau`, `dreimal ${without ? "ohne" : "mit"} Zurücklegen`],
            formulaHint: "P(mindestens eine rote) = 1 − P(keine rote) = 1 − P(bbb)",
            fields: [
              numberField("P(keine rote) =", none / den, "", 4),
              numberField("P(mindestens eine rote) =", P, "", 4, {
                slips: [
                  { value: none / den, hint: "Das ist P(keine rote). Gesucht ist das Gegenereignis: 1 − P(keine rote)." },
                  { value: 1 - eventFraction(r, b, without, 2)[0] / den - none / den - eventFraction(r, b, without, 1)[0] / den, hint: "„Mindestens eine“ heißt eine, zwei oder drei rote: alles außer bbb." },
                ],
              }),
            ],
            steps: [
              `„Keine rote“ ist nur der Pfad bbb: P(bbb) = ${factorTexts(r, b, without, [1, 1, 1]).join(" · ")} = ${reduced(none, den)}`,
              "„Mindestens eine rote“ hat sieben Pfade, sein Gegenereignis „keine rote“ nur einen.",
              `<strong>P(mindestens eine rote) = 1 − ${fracText(none, den)} = ${fracText(den - none, den)} ${approx(P, 4)} ${dec(P)}</strong>`,
            ],
            meta: { r, b, without: without ? 1 : 0 },
          };
        }
        const context = rng.int(0, 2);
        const chance = rng.pick(context === 0 ? [30, 40, 50, 60] : context === 1 ? [5, 10, 15, 20] : [70, 75, 80, 85]) / 100;
        const q = 1 - chance;
        const zero = q ** 3;
        const one = 3 * chance * q * q;
        const atMostOne = zero + one;
        const P = context === 2 ? 1 - atMostOne : atMostOne;
        const c = fmt(chance, 2);
        const qq = fmt(q, 2);
        const prompt = [
          `Auf deinem Schulweg liegen drei Ampeln. Jede zeigt bei deiner Ankunft unabhängig von den anderen mit ${fmt(chance * 100, 0)} % Wahrscheinlichkeit Rot. Wie groß ist die Wahrscheinlichkeit, dass du höchstens einmal anhalten musst? Gib das Ergebnis in Prozent an.`,
          `Beim Bäcker sind ${fmt(chance * 100, 0)} % der Brezen zu dunkel gebacken. Du kaufst drei Brezen. Wie groß ist die Wahrscheinlichkeit, dass höchstens eine davon zu dunkel ist? Gib das Ergebnis in Prozent an.`,
          `Ein Stürmer verwandelt ${fmt(chance * 100, 0)} % seiner Elfmeter. Im Training schießt er drei Elfmeter. Wie groß ist die Wahrscheinlichkeit, dass er mindestens zweimal trifft? Gib das Ergebnis in Prozent an.`,
        ][context];
        const given = [
          [`P(Rot) = ${c} je Ampel`, "drei Ampeln, unabhängig"],
          [`P(zu dunkel) = ${c} je Breze`, "drei Brezen"],
          [`P(Treffer) = ${c}`, "drei Elfmeter"],
        ][context];
        if (context === 2) {
          return {
            prompt,
            given,
            fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: 3 * chance * chance * q * 100, hint: "„Mindestens zweimal“ heißt zweimal oder dreimal: Auch der Pfad TTT gehört dazu." }] })],
            steps: [
              "„Mindestens zweimal“: genau zweimal (3 Pfade) oder dreimal (1 Pfad). Kürzer: 1 − P(höchstens einmal).",
              `P(genau zweimal) = 3 · ${c}² · ${qq} = ${fmt(3 * chance * chance * q, 6)}; P(dreimal) = ${c}³ = ${fmt(chance ** 3, 6)}`,
              `<strong>P = ${fmt(3 * chance * chance * q, 6)} + ${fmt(chance ** 3, 6)} = ${fmt(P, 6)} ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
            ],
            meta: { context, chance: chance * 100 },
          };
        }
        return {
          prompt,
          given,
          fields: [numberField("P =", P * 100, "%", 2, { slips: [{ value: (1 - zero) * 100, hint: "Das ist „mindestens einmal“. „Höchstens einmal“ heißt keinmal oder genau einmal." }, { value: one * 100, hint: "„Höchstens einmal“ schließt auch keinmal ein." }] })],
          steps: [
            "„Höchstens einmal“: keinmal (1 Pfad) oder genau einmal (3 Pfade).",
            `P(keinmal) = ${qq}³ = ${fmt(zero, 6)}; P(genau einmal) = 3 · ${c} · ${qq}² = ${fmt(one, 6)}`,
            `<strong>P = ${fmt(zero, 6)} + ${fmt(one, 6)} = ${fmt(P, 6)} ${approx(P * 100, 2)} ${pct(P)} %</strong>`,
          ],
          meta: { context, chance: chance * 100 },
        };
      },
    },
    {
      id: "vermutung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, COMPLEMENT_CASES.length - 1);
          const item = COMPLEMENT_CASES[kind];
          const without = rng.next() < 0.5;
          const r = rng.int(3, 6);
          const b = rng.int(3, 6);
          const den = pathFraction(r, b, without, [0, 0, 0])[1];
          const rest = item.paths.reduce((sum, p) => sum + pathFraction(r, b, without, p)[0], 0);
          const P = 1 - rest / den;
          const options = rng.shuffle([item.complement, ...item.wrong]);
          return {
            prompt: `Aus einer Urne mit ${r} roten und ${b} blauen Kugeln werden drei Kugeln ${without ? "ohne" : "mit"} Zurücklegen gezogen. E: „${item.event}“. Wähle das Gegenereignis Ē und berechne damit P(E).`,
            given: [`${r} rot, ${b} blau`, `dreimal ${without ? "ohne" : "mit"} Zurücklegen`],
            formulaHint: "P(E) = 1 − P(Ē); Ē tritt genau dann ein, wenn E nicht eintritt",
            fields: [choiceField("Gegenereignis Ē:", options, options.indexOf(item.complement)), numberField("P(E) =", P, "", 4, { slips: [{ value: rest / den, hint: "Das ist P(Ē). Gesucht ist 1 − P(Ē)." }] })],
            steps: [
              `Ē: „${item.complement}“, ${item.paths.length === 1 ? "das ist der Pfad" : "das sind die Pfade"} ${item.paths.map(pathKey).join(", ")}`,
              item.paths.length === 1
                ? `P(Ē) = ${factorTexts(r, b, without, item.paths[0]).join(" · ")} = ${reduced(rest, den)}`
                : `P(Ē) = ${item.paths.map((p) => `${pathFraction(r, b, without, p)[0]}/${den}`).join(" + ")} = ${reduced(rest, den)}`,
              `<strong>P(E) = 1 − ${fracText(rest, den)} = ${fracText(den - rest, den)} ${approx(P, 4)} ${dec(P)}</strong>`,
            ],
            meta: { r, b, without: without ? 1 : 0, kind },
          };
        }
        const context = rng.int(0, 2);
        let P: number;
        let prompt: string;
        let given: string[];
        let first: string;
        let meta: Record<string, number>;
        if (context === 0) {
          const total = rng.pick([10, 12, 15, 16, 20]);
          const mustard = rng.int(1, 3);
          const taken = rng.pick([2, 3]);
          P = 1 - falling(total - mustard, taken) / falling(total, taken);
          const X = claimThreshold(rng, P * 100);
          prompt = `Zum Fasching liegen auf einem Teller ${total} Krapfen; ${mustard === 1 ? "einer ist" : `${mustard} sind`} zum Spaß mit Senf gefüllt, die anderen mit Marmelade. Martin nimmt sich zufällig ${taken === 2 ? "zwei" : "drei"} Krapfen. Er vermutet: „Mit einer Wahrscheinlichkeit von mehr als ${X} % ist mindestens ein Senfkrapfen dabei.“ Berechne die Wahrscheinlichkeit und beurteile die Vermutung.`;
          given = [`${total} Krapfen, ${mustard} mit Senf`, `${taken === 2 ? "zwei" : "drei"} Krapfen, ohne Zurücklegen`, `Vermutung: mehr als ${X} %`];
          first = `Gegenereignis „kein Senfkrapfen“: ${Array.from({ length: taken }, (_, i) => `${total - mustard - i}/${total - i}`).join(" · ")} = ${reduced(falling(total - mustard, taken), falling(total, taken))}`;
          meta = { context, total, mustard, taken, claim: X };
        } else if (context === 1) {
          const red = rng.pick([20, 25, 30, 40]);
          P = 1 - (1 - red / 100) ** 3;
          const X = claimThreshold(rng, P * 100);
          prompt = `Auf Tims Schulweg liegen drei Ampeln, die unabhängig voneinander mit ${red} % Wahrscheinlichkeit Rot zeigen, wenn er ankommt. Tim behauptet: „Mit mehr als ${X} % Wahrscheinlichkeit muss ich an mindestens einer Ampel warten.“ Berechne die Wahrscheinlichkeit und beurteile die Behauptung.`;
          given = [`P(Rot) = ${fmt(red / 100, 2)} je Ampel`, "drei Ampeln", `Behauptung: mehr als ${X} %`];
          first = `Gegenereignis „dreimal nicht Rot“: ${fmt(1 - red / 100, 2)}³ = ${fmt((1 - red / 100) ** 3, 6)}`;
          meta = { context, red, claim: X };
        } else {
          const goal = rng.pick([70, 75, 80, 85, 90]);
          P = (goal / 100) ** 3;
          const X = claimThreshold(rng, P * 100);
          prompt = `Eine Spielerin verwandelt ${goal} % ihrer Elfmeter. Im Elfmeterschießen tritt sie dreimal an. Ihr Trainer meint: „Mit mehr als ${X} % Wahrscheinlichkeit trifft sie alle drei.“ Berechne die Wahrscheinlichkeit und beurteile die Aussage.`;
          given = [`P(Treffer) = ${fmt(goal / 100, 2)}`, "drei Elfmeter", `Aussage: mehr als ${X} %`];
          first = `Nur ein Pfad, TTT: ${fmt(goal / 100, 2)}³ = ${fmt(P, 6)}`;
          meta = { context, goal, claim: X };
        }
        const claim = meta.claim;
        const yes = P * 100 > claim;
        const word = ["Vermutung", "Behauptung", "Aussage"][context];
        return {
          prompt,
          given,
          fields: [numberField("P =", P * 100, "%", 2), yesNo(`Stimmt die ${word}?`, yes)],
          steps: [
            first,
            context === 2 ? `P ${approx(P * 100, 2)} ${pct(P)} %` : `P = 1 − ${context === 0 ? fracText(falling(meta.total - meta.mustard, meta.taken), falling(meta.total, meta.taken)) : fmt((1 - meta.red / 100) ** 3, 6)} ${approx(P * 100, 2)} ${pct(P)} %`,
            `<strong>${pct(P)} % ist ${yes ? "mehr" : "weniger"} als ${claim} %: Die ${word} ${yes ? "stimmt" : "stimmt nicht"}.</strong>`,
          ],
          meta: { ...meta, P: P * 100 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest die Pfade eines Ereignisses, addierst sie und nimmst das Gegenereignis, wo es schneller geht.",
};

// ─── 8.3 Anwendungen ───────────────────────────────────────────────────────

const TARGETS = [0.5, 0.8, 0.9, 0.95, 0.99];

/** A chance per try as the task states it and as the base 1 − p of the logarithm. */
interface Chance {
  value: number;
  text: string;
  q: string;
}

const fractionChance = (num: number, den: number): Chance => ({ value: num / den, text: fracText(num, den), q: fracText(den - num, den) });
const decimalChance = (value: number): Chance => ({ value, text: fmt(value, 2), q: fmt(1 - value, 2) });

/** Only pairs whose bound lies clearly between two whole numbers: a rounded logarithm never changes n. */
function clearlyBetween(p: number, target: number): boolean {
  const bound = triesBound(p, target);
  const n = minTries(p, target);
  return Math.abs(bound - Math.round(bound)) >= 0.05 && n >= 2 && n <= 250;
}

const L1_CHANCES: Chance[] = [
  fractionChance(1, 6),
  fractionChance(1, 4),
  fractionChance(1, 3),
  fractionChance(1, 5),
  fractionChance(1, 8),
  ...[0.05, 0.1, 0.15, 0.2, 0.3, 0.4].map(decimalChance),
];

const L1_PAIRS = L1_CHANCES.flatMap((chance) => TARGETS.filter((t) => clearlyBetween(chance.value, t)).map((target) => ({ chance, target })));

/** Word problems for "Wie oft mindestens?": the context, its value and the chance per try. */
interface HowOften {
  context: number;
  value: number;
  chance: Chance;
  target: number;
}

const HOW_OFTEN: HowOften[] = [
  ...[3, 4, 5].map((k) => ({ context: 0, value: k, chance: fractionChance(1, k) })),
  ...[2, 3, 4, 5, 8].map((d) => ({ context: 1, value: d, chance: decimalChance(d / 100) })),
  ...[30, 45, 60, 72, 90, 120].map((a) => ({ context: 2, value: a, chance: fractionChance(a, 360) })),
  ...[15, 20, 25, 30].map((h) => ({ context: 3, value: h, chance: decimalChance(h / 100) })),
  ...[4, 5, 8, 10].map((k) => ({ context: 4, value: k, chance: fractionChance(1, k) })),
].flatMap((item) => TARGETS.filter((t) => clearlyBetween(item.chance.value, t)).map((target) => ({ ...item, target })));

function howOftenPrompt(item: HowOften): string {
  const X = fmt(item.target * 100, 0);
  switch (item.context) {
    case 0:
      return `Ein Multiple-Choice-Test hat Fragen mit je ${item.value} Antworten, von denen genau eine richtig ist. Wie viele Fragen muss der Test mindestens haben, damit jemand, der bei jeder Frage nur rät, mit einer Wahrscheinlichkeit von mindestens ${X} % wenigstens eine Frage richtig beantwortet?`;
    case 1:
      return `Eine Maschine stellt Schrauben her; ${item.value} % davon sind fehlerhaft. Wie viele Schrauben muss man mindestens zufällig herausgreifen und prüfen, damit mit einer Wahrscheinlichkeit von mindestens ${X} % wenigstens eine fehlerhafte dabei ist?`;
    case 2:
      return `Ein Glücksrad hat ein Gewinnfeld mit dem Mittelpunktswinkel ${item.value}°. Wie oft muss man das Rad mindestens drehen, damit man mit einer Wahrscheinlichkeit von mindestens ${X} % wenigstens einmal gewinnt?`;
    case 3:
      return `Eine Torhüterin hält ${item.value} % aller Elfmeter. Wie viele Elfmeter muss sie mindestens auf ihr Tor bekommen, damit sie mit einer Wahrscheinlichkeit von mindestens ${X} % wenigstens einen hält?`;
    default:
      return `An einer Losbude mit sehr vielen Losen gewinnt jedes ${item.value}. Los. Wie viele Lose muss man mindestens kaufen, damit man mit einer Wahrscheinlichkeit von mindestens ${X} % wenigstens einen Gewinn hat?`;
  }
}

/** The base of a power as written: a fraction in brackets, a decimal without: (5/6)ⁿ, 0,8ⁿ. */
const powerBase = (chance: Chance) => (chance.q.includes("/") ? `(${chance.q})` : chance.q);

/** The worked steps of 1 − qⁿ ≥ P: inequality, logarithm, probe with n − 1 and n. */
function howOftenSteps(chance: Chance, target: number, n: number): string[] {
  const p = chance.value;
  const bound = triesBound(p, target);
  const before = atLeastOnce(p, n - 1) * 100;
  const after = atLeastOnce(p, n) * 100;
  const digits = probeDigits(before, target * 100);
  const power = `${powerBase(chance)}<sup>n</sup>`;
  return [
    `1 − ${power} ≥ ${fmt(target, 2)}  ⇔  ${power} ≤ ${fmt(1 - target, 2)}`,
    `Gleichung ${power} = ${fmt(1 - target, 2)}: n = log<sub>${chance.q}</sub>(${fmt(1 - target, 2)}) ≈ ${fmt(bound, 2)}. Weil ${chance.q} kleiner als 1 ist, wird ${power} mit jedem Versuch kleiner: n ≥ ${fmt(bound, 2)}, also aufrunden.`,
    `Probe: n = ${n - 1}: ${fmt(before, digits)} %; n = ${n}: ${fmt(after, digits)} %`,
    `<strong>n = ${n}</strong>`,
  ];
}

/** The slips of "Wie oft mindestens?": rounded down, P instead of 1 − P, p instead of 1 − p as the base. */
function howOftenSlips(chance: Chance, target: number, n: number): Array<{ value: number; hint: string }> {
  const p = chance.value;
  const before = atLeastOnce(p, n - 1) * 100;
  return [
    { value: n - 1, hint: `Aufrunden: Bei ${n - 1} Versuchen sind es erst ${fmt(before, probeDigits(before, target * 100))} %.` },
    { value: Math.ceil(Math.log(target) / Math.log(1 - p) - 1e-9), hint: "Rechts gehört 1 − P hin: (1 − p)ⁿ ist die Wahrscheinlichkeit für „nie ein Erfolg“." },
    { value: Math.ceil(Math.log(1 - target) / Math.log(p) - 1e-9), hint: "Die Basis ist 1 − p: Beim Gegenereignis misslingt jeder einzelne Versuch." },
  ];
}

/** Games for the comparison: a sentence, the chance per try and the number of tries. */
const GAMES: Array<{ text: string; num: number; den: number; n: number }> = [
  { text: "Du würfelst viermal und gewinnst bei mindestens einer Sechs.", num: 1, den: 6, n: 4 },
  { text: "Du wirfst 24-mal zwei Würfel und gewinnst bei mindestens einem Sechserpasch.", num: 1, den: 36, n: 24 },
  { text: "Du drehst zweimal ein Glücksrad, dessen Gewinnfeld einen Mittelpunktswinkel von 120° hat, und gewinnst bei mindestens einem Treffer.", num: 1, den: 3, n: 2 },
  { text: "Du drehst dreimal ein Glücksrad mit einem Gewinnfeld von 90° und gewinnst bei mindestens einem Treffer.", num: 1, den: 4, n: 3 },
  { text: "Du ziehst fünf Lose aus einer großen Trommel, in der jedes achte Los gewinnt, und gewinnst bei mindestens einem Treffer.", num: 1, den: 8, n: 5 },
  { text: "Du würfelst dreimal und gewinnst, wenn mindestens einmal eine Fünf oder Sechs fällt.", num: 1, den: 3, n: 3 },
  { text: "Du würfelst sechsmal und gewinnst bei mindestens einer Sechs.", num: 1, den: 6, n: 6 },
];

const gameChance = (g: (typeof GAMES)[number]) => atLeastOnce(g.num / g.den, g.n);

/** Pairs of games whose chances differ by at least 1,5 percentage points. */
const GAME_PAIRS = GAMES.flatMap((a, i) =>
  GAMES.map((_, j) => [i, j] as const).filter(([, j]) => j !== i && Math.abs(gameChance(a) - gameChance(GAMES[j])) >= 0.015),
);

const anwendungen: Lesson = {
  id: "dz-3-anwendungen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "8.3 Anwendungen: Spiele, Prüfungen, mindestens einmal",
  subtitle: "Wie oft muss man mindestens …?",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Anwendungen der Pfadregeln`,
  whyItMatters:
    "Wie viele Bauteile muss man prüfen, damit ein Fehler mit hoher Wahrscheinlichkeit auffällt, und was bringt Raten im Multiple-Choice-Test? Solche Fragen aus Spielen, Tests und Qualitätskontrolle beantwortest du mit 1 − (1 − p)ⁿ und dem Logarithmus.",
  explanationHtml: `
    <p>Viele Aufgaben wiederholen denselben Versuch n-mal unabhängig: Elfmeter, Glücksrad, Raten im Test, Prüfen von Bauteilen. Ist p die Erfolgswahrscheinlichkeit, dann hat „nie ein Erfolg“ im Baumdiagramm genau einen Pfad: (1 − p) · (1 − p) · … · (1 − p) = (1 − p)<sup>n</sup>. Ebenso ist P(alle n gelingen) = p<sup>n</sup>.</p>
    <p class="formula-line">P(mindestens einmal) = 1 − (1 − p)<sup>n</sup></p>
    <p><strong>Wie oft muss man mindestens …, damit …?</strong> Gesucht ist das kleinste n mit 1 − (1 − p)<sup>n</sup> ≥ P, umgeformt (1 − p)<sup>n</sup> ≤ 1 − P.</p>
    <ol class="steps">
      <li>Löse die Gleichung (1 − p)<sup>n</sup> = 1 − P mit dem Logarithmus: n = log<sub>1 − p</sub>(1 − P).</li>
      <li>Weil 1 − p kleiner als 1 ist, wird (1 − p)<sup>n</sup> mit jedem weiteren Versuch kleiner. Jedes n ab diesem Wert passt, also <strong>aufrunden</strong>.</li>
      <li>Probe mit n − 1 und n. Ohne Logarithmus geht es auch durch Probieren mit dem Taschenrechner, nur langsamer.</li>
    </ol>
    <div class="example">Multiple-Choice-Test mit vier Antworten pro Frage, du rätst: p = ${frac(1, 4)}. Wie viele Fragen braucht der Test mindestens, damit du mit mindestens 95 % wenigstens eine richtig hast?<br>
      0,75<sup>n</sup> ≤ 0,05 ⇒ n ≥ log<sub>0,75</sub>(0,05) ≈ 10,41 ⇒ n = 11.<br>
      Probe: 1 − 0,75<sup>10</sup> ≈ 94,37 % ist zu wenig, 1 − 0,75<sup>11</sup> ≈ 95,78 % reicht.</div>
    <p>Auch Spiele lassen sich so vergleichen: Viermal würfeln mit mindestens einer Sechs gewinnt mit 1 − (${frac(5, 6)})<sup>4</sup> ≈ 51,77 %, 24-mal zwei Würfel mit mindestens einem Sechserpasch nur mit 1 − (${frac(35, 36)})<sup>24</sup> ≈ 49,14 %.</p>
    <div class="merke"><strong>Merke:</strong> „Mindestens einmal“ über das Gegenereignis „nie“. Bei „Wie oft mindestens?“ den Logarithmus-Wert immer aufrunden und mit n − 1 prüfen.</div>
  `,
  formulas: [
    { name: "Mindestens einmal", html: "P(mindestens einmal) = 1 − (1 − p)<sup>n</sup>", quantities: "p Erfolgswahrscheinlichkeit je Versuch, n unabhängige Versuche" },
    { name: "Wie oft mindestens?", html: "(1 − p)<sup>n</sup> ≤ 1 − P ⇒ n ≥ log<sub>1 − p</sub>(1 − P)", quantities: "P gewünschte Mindestwahrscheinlichkeit; n aufrunden" },
    { name: "Alle Versuche gelingen", html: "P(alle n) = p<sup>n</sup>", quantities: "n unabhängige Versuche mit Erfolgswahrscheinlichkeit p" },
  ],
  quiz: {
    question: "Ein Glücksrad zeigt bei jeder Drehung mit p = 0,2 einen Gewinn. Du drehst zehnmal. Wie berechnest du P(mindestens ein Gewinn)?",
    options: ["1 − 0,8¹⁰", "10 · 0,2", "0,2¹⁰", "1 − 0,2¹⁰"],
    correctIndex: 0,
    explanation: "Das Gegenereignis „kein Gewinn“ ist ein einziger Pfad: 0,8¹⁰ ≈ 0,107. Also P ≈ 1 − 0,107 ≈ 89,26 %. 10 · 0,2 = 2 kann keine Wahrscheinlichkeit sein, und 1 − 0,2¹⁰ wäre „nicht zehnmal Gewinn“.",
  },
  lab: {
    kind: "at-least",
    title: "Labor: Wie oft mindestens?",
    intro:
      "Stelle die Erfolgswahrscheinlichkeit p und die Zahl n der Versuche ein. Die Säulen zeigen P(mindestens einmal) für n = 1 bis 60, der orange Strich P(nie). Ziehe den Punkt auf der lila Säule oder die gestrichelte Ziellinie; die grüne Säule ist das kleinste n für das Ziel.",
    params: [
      { type: "range", key: "p", label: "Erfolgswahrscheinlichkeit p", unit: "%", min: 1, max: 60, step: 1, value: 10 },
      { type: "range", key: "n", label: "Versuche n", unit: "", min: 1, max: 60, step: 1, value: 5 },
      { type: "range", key: "ziel", label: "Ziel: mindestens", unit: "%", min: 50, max: 99, step: 1, value: 90 },
      { type: "state", key: "series", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: 1654 },
    ],
    readouts: [
      { key: "P", label: "P(mindestens einmal)", unit: "%", digits: 2, emphasis: true, compute: (v) => atLeastOnce(v.p / 100, v.n) * 100 },
      { key: "nie", label: "P(nie) = (1 − p)ⁿ", unit: "%", digits: 2, compute: (v) => (1 - v.p / 100) ** v.n * 100 },
      { key: "need", label: "kleinstes n für das Ziel", compute: (v) => `n = ${minTries(v.p / 100, v.ziel / 100)} (n ≥ ${fmt(triesBound(v.p / 100, v.ziel / 100), 2)})` },
      { key: "sim", label: "Simulation", compute: (v) => (v.series > 0 ? `${v.hits} von ${v.series} Serien (${fmt((v.hits / v.series) * 100, 1)} %)` : "noch keine Serie") },
    ],
    actions: [
      { id: "hundert", label: "100 Serien spielen", apply: (v) => simulateSeries(v, 100) },
      { id: "neu", label: "Zählung neu starten", apply: (v) => ({ ...v, series: 0, hits: 0 }) },
    ],
    goals: [
      {
        id: "mc",
        text: "Multiple-Choice-Test mit vier Antworten pro Frage: Wer rät, hat p = 25 %. Finde das kleinste n, bei dem mit mindestens 95 % wenigstens eine Antwort richtig ist.",
        check: (v) => v.p === 25 && v.n === 11,
      },
      {
        id: "qualitaet",
        text: "Qualitätskontrolle: 2 % der Bauteile sind defekt. Ab wie vielen geprüften Teilen ist mit mindestens 50 % wenigstens ein defektes dabei? Stelle genau dieses n ein.",
        check: (v) => v.p === 2 && v.n === 35,
      },
      {
        id: "p-finden",
        text: "Umgekehrt: Schon bei 5 Versuchen soll mit mindestens 90 % wenigstens ein Erfolg dabei sein. Wie groß muss p mindestens sein (ganze Prozent)?",
        check: (v) => v.n === 5 && v.p === 37,
      },
    ],
  },
  exercises: [
    {
      id: "wie-oft",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { chance, target } = rng.pick(L1_PAIRS);
          const n = minTries(chance.value, target);
          return {
            prompt: `Ein Versuch gelingt mit der Wahrscheinlichkeit p = ${chance.text} und wird mehrmals unabhängig wiederholt. Wie oft muss man ihn mindestens durchführen, damit mit einer Wahrscheinlichkeit von mindestens ${fmt(target * 100, 0)} % wenigstens ein Erfolg dabei ist?`,
            given: [`p = ${chance.text}, also 1 − p = ${chance.q}`, `P(mindestens ein Erfolg) ≥ ${fmt(target * 100, 0)} %`],
            formulaHint: "1 − (1 − p)<sup>n</sup> ≥ P ⇔ (1 − p)<sup>n</sup> ≤ 1 − P ⇒ n ≥ log<sub>1 − p</sub>(1 − P), dann aufrunden",
            fields: [numberField("n =", n, "", 0, { slips: howOftenSlips(chance, target, n) })],
            steps: howOftenSteps(chance, target, n),
            meta: { p: chance.value, target: target * 100, n },
          };
        }
        const item = rng.pick(HOW_OFTEN);
        const n = minTries(item.chance.value, item.target);
        const after = atLeastOnce(item.chance.value, n);
        return {
          prompt: `${howOftenPrompt(item)} Gib auch die Wahrscheinlichkeit für dieses n an.`,
          given: [`p = ${item.chance.text} je Versuch`, `Ziel: mindestens ${fmt(item.target * 100, 0)} %`],
          fields: [
            numberField("n =", n, "", 0, { slips: howOftenSlips(item.chance, item.target, n) }),
            numberField(`P(mindestens einmal) bei n =`, after * 100, "%", 2),
          ],
          steps: [...howOftenSteps(item.chance, item.target, n).slice(0, 3), `<strong>n = ${n}; P = 1 − ${powerBase(item.chance)}<sup>${n}</sup> ${approx(after * 100, 2)} ${pct(after)} %</strong>`],
          meta: { context: item.context, value: item.value, p: item.chance.value, target: item.target * 100, n },
        };
      },
    },
    {
      id: "anwendung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const k = rng.int(3, 4);
          const n = k === 3 ? rng.int(3, 5) : rng.int(3, 4);
          const all = 1 / k ** n;
          const none = (k - 1) ** n / k ** n;
          return {
            prompt: `Ein Multiple-Choice-Test hat ${n} Fragen mit je ${k} Antworten, von denen genau eine richtig ist. Du rätst bei jeder Frage. Berechne die Wahrscheinlichkeit, dass alle Antworten richtig sind, und die Wahrscheinlichkeit, dass mindestens eine richtig ist.`,
            given: [`p = 1/${k} je Frage`, `${n} Fragen, unabhängig geraten`],
            formulaHint: "P(alle richtig) = p<sup>n</sup>; P(mindestens eine richtig) = 1 − (1 − p)<sup>n</sup>",
            fields: [
              numberField("P(alle richtig) =", all, "", 4),
              numberField("P(mindestens eine richtig) =", 1 - none, "", 4, {
                slips: [
                  { value: none, hint: "Das ist P(keine richtig). Gesucht ist 1 − P(keine richtig)." },
                  { value: n / k, hint: "Die Wahrscheinlichkeiten der Fragen darf man nicht addieren. Rechne mit dem Gegenereignis „keine richtig“." },
                ],
              }),
            ],
            steps: [
              `Je Frage p = 1/${k}, falsch mit ${k - 1}/${k}; ${n} Stufen im Baumdiagramm`,
              `P(alle richtig) = (1/${k})<sup>${n}</sup> = 1/${k ** n}; P(keine richtig) = (${k - 1}/${k})<sup>${n}</sup> = ${(k - 1) ** n}/${k ** n}`,
              `<strong>P(alle richtig) = 1/${k ** n} ${approx(all, 4)} ${dec(all)}; P(mindestens eine richtig) = ${fracText(k ** n - (k - 1) ** n, k ** n)} ${approx(1 - none, 4)} ${dec(1 - none)}</strong>`,
            ],
            meta: { k, n },
          };
        }
        if (rng.next() < 0.5) {
          const hit = rng.pick([70, 75, 80, 85, 90]) / 100;
          const n = rng.int(4, 5);
          const all = hit ** n;
          const oneMiss = n * (1 - hit) * hit ** (n - 1);
          const h = fmt(hit, 2);
          return {
            prompt: `Lena verwandelt ${fmt(hit * 100, 0)} % ihrer Elfmeter, unabhängig voneinander. Im Training schießt sie ${n} Elfmeter. Berechne die Wahrscheinlichkeit, dass a) alle drin sind, b) mindestens einer danebengeht, c) genau einer danebengeht. Gib die Ergebnisse in Prozent an.`,
            given: [`P(Treffer) = ${h}`, `${n} Elfmeter`],
            fields: [
              numberField("a) P =", all * 100, "%", 2),
              numberField("b) P =", (1 - all) * 100, "%", 2, { slips: [{ value: (1 - hit) * n * 100, hint: "Nicht addieren: „Mindestens einer daneben“ ist das Gegenereignis von „alle drin“." }] }),
              numberField("c) P =", oneMiss * 100, "%", 2, { slips: [{ value: (1 - hit) * hit ** (n - 1) * 100, hint: `Das ist nur ein Pfad. Der Fehlschuss kann jeder der ${n} Elfmeter sein.` }] }),
            ],
            steps: [
              `a) Ein Pfad: ${h}<sup>${n}</sup> ≈ ${fmt(all, 4)}`,
              `b) Gegenereignis von a): 1 − ${h}<sup>${n}</sup> ≈ ${fmt(1 - all, 4)}`,
              `c) ${n} Pfade (der Fehlschuss ist der 1., 2., … Elfmeter), je ${fmt(1 - hit, 2)} · ${h}<sup>${n - 1}</sup>: ${n} · ${fmt(1 - hit, 2)} · ${h}<sup>${n - 1}</sup> ≈ ${fmt(oneMiss, 4)}`,
              `<strong>a) ${pct(all)} %, b) ${pct(1 - all)} %, c) ${pct(oneMiss)} %</strong>`,
            ],
            meta: { context: 0, hit: hit * 100, n },
          };
        }
        const total = rng.pick([20, 24, 25, 30, 40, 50]);
        const broken = rng.int(2, 5);
        const ok = falling(total - broken, 3) / falling(total, 3);
        return {
          prompt: `In einer Kiste mit ${total} Smartphones sind ${broken} defekt. Eine Prüferin nimmt zufällig nacheinander drei Geräte heraus und testet sie. Wie groß ist die Wahrscheinlichkeit, dass a) alle drei in Ordnung sind, b) mindestens eines defekt ist? Gib die Ergebnisse in Prozent an.`,
          given: [`${total} Geräte, ${broken} defekt`, "drei Geräte, ohne Zurücklegen"],
          fields: [
            numberField("a) P =", ok * 100, "%", 2, { slips: [{ value: ((total - broken) / total) ** 3 * 100, hint: "Ein getestetes Gerät kommt nicht zurück in die Kiste: Die Nenner werden kleiner." }] }),
            numberField("b) P =", (1 - ok) * 100, "%", 2),
          ],
          steps: [
            `a) Ein Pfad, ohne Zurücklegen: ${total - broken}/${total} · ${total - broken - 1}/${total - 1} · ${total - broken - 2}/${total - 2} = ${reduced(falling(total - broken, 3), falling(total, 3))}`,
            "b) Gegenereignis von a): mindestens eines defekt = 1 − P(alle in Ordnung)",
            `<strong>a) ${pct(ok)} %, b) ${pct(1 - ok)} %</strong>`,
          ],
          meta: { context: 1, total, broken },
        };
      },
    },
    {
      id: "spiel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const game = rng.pick([
            { text: (n: number) => `Du würfelst ${n}-mal mit einem Laplace-Würfel`, success: "eine Sechs", num: 1, den: 6, ns: [2, 3, 4, 5, 6, 7, 8] },
            { text: (n: number) => `Du drehst ${n}-mal ein Glücksrad, dessen Gewinnfeld ein Viertel des Rades ist`, success: "ein Gewinn", num: 1, den: 4, ns: [1, 2, 3, 4, 5] },
            { text: (n: number) => `Du ziehst ${n}-mal mit Zurücklegen eine Kugel aus einer Urne mit einer roten und vier weißen Kugeln`, success: "eine rote Kugel", num: 1, den: 5, ns: [2, 3, 4, 5, 6] },
          ]);
          const n = rng.pick(game.ns);
          const P = atLeastOnce(game.num / game.den, n);
          return {
            prompt: `${game.text(n)}. Du gewinnst, wenn dabei mindestens einmal ${game.success} kommt. Berechne deine Gewinnwahrscheinlichkeit. Ist sie größer als 50 %?`,
            given: [`p = ${game.num}/${game.den} je Versuch`, `n = ${n}`],
            formulaHint: "P(mindestens einmal) = 1 − (1 − p)<sup>n</sup>",
            fields: [
              numberField("P(Gewinn) =", P, "", 4, { slips: [{ value: 1 - P, hint: "Das ist P(nie). Gewinn heißt mindestens einmal: 1 − P(nie)." }] }),
              yesNo("Größer als 50 %?", P > 0.5),
            ],
            steps: [
              `Gegenereignis „nie“: (${game.den - game.num}/${game.den})<sup>${n}</sup> ≈ ${fmt(1 - P, 4)}`,
              `P(Gewinn) = 1 − ${fmt(1 - P, 4)} ${approx(P, 4)} ${dec(P)}`,
              `<strong>P ${approx(P * 100, 2)} ${pct(P)} %: ${P > 0.5 ? "größer" : "kleiner"} als 50 %</strong>`,
            ],
            meta: { num: game.num, den: game.den, n },
          };
        }
        const [i, j] = rng.pick(GAME_PAIRS);
        const [a, b] = [GAMES[i], GAMES[j]];
        const [pa, pb] = [gameChance(a), gameChance(b)];
        const deMere = (i === 0 && j === 1) || (i === 1 && j === 0);
        return {
          prompt: `Zwei Spiele: Spiel A: ${a.text} Spiel B: ${b.text} Berechne beide Gewinnwahrscheinlichkeiten. Bei welchem Spiel sind deine Chancen besser?`,
          given: [`A: p = ${a.num}/${a.den}, n = ${a.n}`, `B: p = ${b.num}/${b.den}, n = ${b.n}`],
          fields: [
            numberField("P(A) =", pa * 100, "%", 2),
            numberField("P(B) =", pb * 100, "%", 2),
            choiceField("Bessere Chancen hat", ["Spiel A", "Spiel B"], pa > pb ? 0 : 1),
          ],
          steps: [
            `A: 1 − (${a.den - a.num}/${a.den})<sup>${a.n}</sup> ${approx(pa * 100, 2)} ${pct(pa)} %`,
            `B: 1 − (${b.den - b.num}/${b.den})<sup>${b.n}</sup> ${approx(pb * 100, 2)} ${pct(pb)} %${deMere ? ". Genau diese beiden Spiele verglich um 1654 der Chevalier de Méré; Pascal und Fermat erklärten den Unterschied." : ""}`,
            `<strong>${pct(Math.max(pa, pb))} % &gt; ${pct(Math.min(pa, pb))} %: Spiel ${pa > pb ? "A" : "B"} hat die besseren Chancen.</strong>`,
          ],
          meta: { a: i, b: j },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest „mindestens einmal“ mit dem Gegenereignis und bestimmst mit dem Logarithmus, wie oft man es mindestens versuchen muss.",
};

export const STAGE_DATEN_ZUFALL: Stage = {
  id: STAGE_ID,
  stageNumber: 8,
  title: "Daten und Zufall",
  subtitle: "Mehrstufige Zufallsexperimente, Pfadregeln, Mindestens-Aufgaben",
  icon: "🎲",
  accent: "#9333ea",
  badgeTitle: "Zufalls-Profi",
  lehrplanLabel: "LB 5 (I und II/III)",
  lessons: [mehrstufig, pfadregeln, anwendungen],
};
