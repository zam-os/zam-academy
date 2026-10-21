import { fmt, frac, fracText, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  AT_LEAST_ONCE,
  atLeastOnce,
  CLASS_9B,
  dataValues,
  eventProbability,
  fiveNumbers,
  mean,
  median,
  quartiles,
  simulateSeries,
  simulateUrn,
  sorted,
  testTable,
  URN_EVENTS,
  urnPaths,
} from "../lab/views-daten-zufall";
import type { ExerciseTask, LabParam, Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const STAGE_ID = "stage-5-daten-zufall";
const LEHRPLAN = "M9 LB 8 (I) · M9 LB 7 (II/III): Daten und Zufall";

/** Data points the learner drags in the drawing; no slider each (arrow keys move a focused point). */
function dataParams(prefix: string, values: number[], max: number): LabParam[] {
  return values.map((value, i) => ({
    type: "range" as const,
    key: `${prefix}${i + 1}`,
    label: `Wert ${i + 1}`,
    unit: "",
    min: 0,
    max,
    step: 1,
    value,
    showIf: () => false,
  }));
}

/** `count` random integers in [min, max]. */
/** The quartile convention of lesson 5.4, named in every task that asks for quartiles. */
const QUARTILE_RULE = "q₁ und q₃ sind die Mediane der unteren und der oberen Hälfte; bei ungerader Anzahl zählt der Median zu keiner Hälfte.";

function sample(rng: Rng, count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => rng.int(min, max));
}

const list = (values: number[]) => values.map((v) => fmt(v, 1)).join("; ");

// 5.1 Baumdiagramm ───────────────────────────────────────────────────────────

const baumdiagramm: Lesson = {
  id: "dz-1-baumdiagramm",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "5.1 Baumdiagramm und Pfadregeln",
  subtitle: "Kugeln ziehen, mit und ohne Zurücklegen",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, mehrstufige Zufallsexperimente`,
  whyItMatters:
    "Losbude, Elfmeterschießen, zwei Würfe beim Basketball: Viele Zufallsexperimente laufen in Stufen ab. Ein Baumdiagramm macht sie übersichtlich, und zwei Regeln reichen zum Rechnen.",
  explanationHtml: `
    <p>Ein Zufallsexperiment aus mehreren Schritten heißt <strong>mehrstufig</strong>. Im <strong>Baumdiagramm</strong> steht an jedem Ast die Wahrscheinlichkeit dieses Schritts; die Äste aus einem Punkt ergeben zusammen 1.</p>
    <ul>
      <li><strong>1. Pfadregel (Produktregel):</strong> Die Wahrscheinlichkeit eines Pfades ist das <strong>Produkt</strong> der Wahrscheinlichkeiten entlang des Pfades.</li>
      <li><strong>2. Pfadregel (Summenregel):</strong> Gehören mehrere Pfade zu einem Ereignis, werden ihre Wahrscheinlichkeiten <strong>addiert</strong>.</li>
      <li><strong>Ohne Zurücklegen</strong> ändern sich in der zweiten Stufe die Anteile, weil eine Kugel fehlt.</li>
    </ul>
    <div class="example">Urne mit 3 roten und 2 blauen Kugeln, zwei Kugeln ohne Zurücklegen. „Genau eine rote“: P(RB) + P(BR) = ${frac(3, 5)} · ${frac(2, 4)} + ${frac(2, 5)} · ${frac(3, 4)} = ${frac(6, 20)} + ${frac(6, 20)} = ${frac(12, 20)} = 60 %.</div>
    <p>Im Labor kannst du sehr oft ziehen lassen: Die relative Häufigkeit nähert sich der Wahrscheinlichkeit (Gesetz der großen Zahlen).</p>
    <div class="merke"><strong>Merke:</strong> Entlang des Pfades multiplizieren, verschiedene Pfade addieren.</div>
  `,
  formulas: [
    { name: "1. Pfadregel", html: "P(Pfad) = p₁ · p₂", quantities: "Produkt der Astwahrscheinlichkeiten" },
    { name: "2. Pfadregel", html: "P(Ereignis) = P(Pfad 1) + P(Pfad 2) + …", quantities: "Summe der Pfade, die zum Ereignis gehören" },
  ],
  quiz: {
    question: "Wie berechnet man die Wahrscheinlichkeit eines einzelnen Pfades im Baumdiagramm?",
    options: ["Man addiert die Wahrscheinlichkeiten entlang des Pfades", "Man multipliziert die Wahrscheinlichkeiten entlang des Pfades", "Man nimmt die größte Wahrscheinlichkeit am Pfad"],
    correctIndex: 1,
    explanation: "Das ist die 1. Pfadregel: entlang eines Pfades multiplizieren. Addiert wird erst, wenn mehrere Pfade zu einem Ereignis gehören.",
  },
  lab: {
    kind: "urn",
    title: "Labor: Die Urne",
    intro: "Lege die Urne fest und wähle ein Ereignis. Das Baumdiagramm rechnet mit; die Knöpfe ziehen zur Probe sehr oft zwei Kugeln.",
    params: [
      { type: "range", key: "rot", label: "rote Kugeln", unit: "", min: 1, max: 8, step: 1, value: 3 },
      { type: "range", key: "blau", label: "blaue Kugeln", unit: "", min: 1, max: 8, step: 1, value: 2 },
      { type: "choice", key: "mode", label: "Ziehen", options: [{ value: 0, label: "mit Zurücklegen" }, { value: 1, label: "ohne Zurücklegen" }], value: 0 },
      { type: "choice", key: "event", label: "Ereignis", options: URN_EVENTS.map((label, value) => ({ value, label })), value: 0 },
      { type: "state", key: "n", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: 20261021 },
    ],
    readouts: [
      { key: "P", label: "Wahrscheinlichkeit", digits: 4, emphasis: true, compute: (v) => eventProbability(v) },
      { key: "freq", label: "relative Häufigkeit", compute: (v) => (v.n > 0 ? `${fmt((v.hits / v.n) * 100, 1)} % bei ${v.n} Versuchen` : "noch nicht gezogen") },
      { key: "rr", label: "P(zwei rote) mit / ohne Zurücklegen", compute: (v) => `${fmt(urnPaths(v.rot, v.blau, false).RR, 3)} / ${fmt(urnPaths(v.rot, v.blau, true).RR, 3)}` },
    ],
    actions: [
      { id: "eins", label: "1× ziehen", apply: (v) => simulateUrn(v, 1) },
      { id: "hundert", label: "100× ziehen", apply: (v) => simulateUrn(v, 100) },
      { id: "neu", label: "Zählung neu starten", apply: (v) => ({ ...v, n: 0, hits: 0 }) },
    ],
    goals: [
      {
        id: "sechzig",
        text: "Stelle eine Urne ein, bei der „genau eine rote“ ohne Zurücklegen genau 60 % hat.",
        check: (v) => v.mode === 1 && v.event === 1 && Math.abs(eventProbability(v) - 0.6) < 1e-9,
      },
      {
        id: "unterschied",
        text: "Finde eine Urne, bei der sich P(zwei rote) mit und ohne Zurücklegen um mehr als 10 Prozentpunkte unterscheidet. Tipp: Je weniger Kugeln in der Urne sind, desto mehr ändert das Zurücklegen.",
        check: (v) => urnPaths(v.rot, v.blau, false).RR - urnPaths(v.rot, v.blau, true).RR > 0.1,
      },
      {
        id: "simulation",
        text: "Ziehe mindestens 500-mal: Die relative Häufigkeit liegt dann nahe an der Wahrscheinlichkeit (±4 Prozentpunkte).",
        check: (v) => v.n >= 500 && Math.abs(v.hits / v.n - eventProbability(v)) <= 0.04,
      },
    ],
  },
  exercises: [
    {
      id: "pfadregel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.int(2, 6);
          const b = rng.int(2, 6);
          const without = rng.next() < 0.5;
          const event = rng.int(0, 2);
          const P = eventProbability({ rot: r, blau: b, mode: without ? 1 : 0, event });
          const n = r + b;
          const n2 = without ? n - 1 : n;
          const paths: Record<number, string> = {
            0: `P(RR) = ${r}/${n} · ${without ? r - 1 : r}/${n2}`,
            1: `P(RB) + P(BR) = ${r}/${n} · ${b}/${n2} + ${b}/${n} · ${r}/${n2}`,
            2: `1 − P(BB) = 1 − ${b}/${n} · ${without ? b - 1 : b}/${n2}`,
          };
          return {
            prompt: `In einer Urne liegen ${r} rote und ${b} blaue Kugeln. Es werden zwei Kugeln ${without ? "ohne" : "mit"} Zurücklegen gezogen. Berechne P(${URN_EVENTS[event]}).`,
            given: [`${r} rot, ${b} blau`, without ? "ohne Zurücklegen" : "mit Zurücklegen"],
            formulaHint: "Pfade multiplizieren, zugehörige Pfade addieren",
            fields: [
              numberField("P =", P, "", 4, {
                slips: [
                  { value: eventProbability({ rot: r, blau: b, mode: without ? 0 : 1, event }), hint: without ? "Ohne Zurücklegen fehlt in der zweiten Stufe eine Kugel." : "Mit Zurücklegen ist die Urne beim zweiten Zug wieder vollständig." },
                  ...(event === 1 ? [{ value: P / 2, hint: "Es gibt zwei Pfade: erst rot, dann blau, und erst blau, dann rot." }] : []),
                ],
              }),
            ],
            steps: [paths[event], `<strong>P = ${fracText(Math.round(P * n * n2), n * n2)} ≈ ${fmt(P, 4)}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const p = rng.pick([0.6, 0.65, 0.7, 0.75, 0.8, 0.85]);
          const P = 2 * p * (1 - p);
          return {
            prompt: `Ein Basketballspieler trifft beim Freiwurf mit ${fmt(p * 100, 0)} % Wahrscheinlichkeit, unabhängig vom letzten Wurf. Er wirft zweimal. Wie wahrscheinlich trifft er genau einmal?`,
            given: [`P(Treffer) = ${fmt(p, 2)}`],
            fields: [numberField("P =", P, "", 4, { slips: [{ value: p * (1 - p), hint: "Es gibt zwei Pfade: Treffer–daneben und daneben–Treffer." }] })],
            steps: [`P(TD) = ${fmt(p, 2)} · ${fmt(1 - p, 2)} = ${fmt(p * (1 - p), 4)}, P(DT) genauso`, `<strong>P = 2 · ${fmt(p * (1 - p), 4)} = ${fmt(P, 4)} ≈ ${fmt(P * 100, 1)} %</strong>`],
          };
        }
        const lots = rng.pick([20, 25, 30, 40]);
        const wins = rng.int(3, 8);
        const P = 1 - ((lots - wins) / lots) * ((lots - wins - 1) / (lots - 1));
        return {
          prompt: `In einer Lostrommel sind ${lots} Lose, davon ${wins} Gewinne. Du ziehst zwei Lose. Wie wahrscheinlich ist mindestens ein Gewinn dabei?`,
          given: [`${lots} Lose, ${wins} Gewinne`, "ohne Zurücklegen"],
          fields: [numberField("P =", P, "", 4)],
          steps: [`Gegenereignis „zwei Nieten“: ${lots - wins}/${lots} · ${lots - wins - 1}/${lots - 1} ≈ ${fmt(1 - P, 4)}`, `<strong>P = 1 − ${fmt(1 - P, 4)} ≈ ${fmt(P, 4)}</strong>`],
        };
      },
    },
    {
      id: "baum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.int(2, 7);
          const b = rng.int(2, 7);
          const n = r + b;
          const pRB = (r / n) * (b / (n - 1));
          const pBB = (b / n) * ((b - 1) / (n - 1));
          return {
            prompt: `Aus einer Urne mit ${r} roten und ${b} blauen Kugeln werden zwei Kugeln ohne Zurücklegen gezogen. Berechne P(erst rot, dann blau) und P(zwei blaue).`,
            given: [`${r} rot, ${b} blau`, "ohne Zurücklegen"],
            formulaHint: `P(RB) = ${r}/${n} · ${b}/${n - 1}`,
            fields: [numberField("P(RB) =", pRB, "", 4), numberField("P(BB) =", pBB, "", 4, { slips: [{ value: (b / n) ** 2, hint: "Ohne Zurücklegen: Beim zweiten Zug ist eine blaue Kugel weniger in der Urne." }] })],
            steps: [`P(RB) = ${r}/${n} · ${b}/${n - 1} = ${fracText(r * b, n * (n - 1))}`, `P(BB) = ${b}/${n} · ${b - 1}/${n - 1} = ${fracText(b * (b - 1), n * (n - 1))}`, `<strong>P(RB) ≈ ${fmt(pRB, 4)}, P(BB) ≈ ${fmt(pBB, 4)}</strong>`],
          };
        }
        const girls = rng.int(8, 16);
        const boys = rng.int(8, 16);
        const n = girls + boys;
        const pGG = (girls / n) * ((girls - 1) / (n - 1));
        const pMixed = 2 * (girls / n) * (boys / (n - 1));
        return {
          prompt: `In einer Klasse sind ${girls} Mädchen und ${boys} Jungen. Zwei Kinder werden für den Klassenrat ausgelost. Wie wahrscheinlich sind es zwei Mädchen, und wie wahrscheinlich ein Mädchen und ein Junge?`,
          given: [`${girls} Mädchen, ${boys} Jungen`, "zwei verschiedene Kinder"],
          fields: [numberField("P(zwei Mädchen) =", pGG, "", 4), numberField("P(gemischt) =", pMixed, "", 4, { slips: [{ value: pMixed / 2, hint: "Gemischt geht auf zwei Pfaden: Mädchen–Junge und Junge–Mädchen." }] })],
          steps: [`P(MM) = ${girls}/${n} · ${girls - 1}/${n - 1} ≈ ${fmt(pGG, 4)}`, `P(MJ) + P(JM) = 2 · ${girls}/${n} · ${boys}/${n - 1} ≈ ${fmt(pMixed, 4)}`, `<strong>P(MM) ≈ ${fmt(pGG, 4)}, P(gemischt) ≈ ${fmt(pMixed, 4)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zeichnest Baumdiagramme und rechnest mit Produkt- und Summenregel, mit und ohne Zurücklegen.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=7B0rKLTUPZ0",
    title: "Baumdiagramm und Pfadregeln Stochastik",
    author: "Daniel Jung",
  },
};

// 5.2 Gegenereignis ──────────────────────────────────────────────────────────

const gegenereignis: Lesson = {
  id: "dz-2-gegenereignis",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "5.2 Gegenereignis: mindestens einmal",
  subtitle: "Wie oft muss man würfeln, um eine Sechs zu bekommen?",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Gegenereignis`,
  whyItMatters:
    "„Mindestens einmal“ hat viele Pfade, „nie“ nur einen. Wer mit dem Gegenereignis rechnet, kommt schnell zum Ziel, und versteht, warum Wahrscheinlichkeiten sich nicht einfach addieren.",
  explanationHtml: `
    <p>Das <strong>Gegenereignis</strong> Ā tritt genau dann ein, wenn A nicht eintritt. Es gilt <strong>P(Ā) = 1 − P(A)</strong>.</p>
    <p>„Mindestens eine Sechs in n Würfen“ hat sehr viele Pfade, das Gegenereignis „keine Sechs“ nur einen: ${frac(5, 6)} · ${frac(5, 6)} · … · ${frac(5, 6)} = (${frac(5, 6)})<sup>n</sup>. Deshalb:</p>
    <p class="formula-line">P(mindestens eine Sechs) = 1 − (${frac(5, 6)})<sup>n</sup></p>
    <ul>
      <li>Bei 4 Würfen ist das 1 − 0,482 ≈ 51,8 %, also erst ab 4 Würfen wahrscheinlicher als nicht.</li>
      <li>Nicht addieren: 6 · ${frac(1, 6)} wäre 100 %, aber auch bei 6 Würfen kann die Sechs ausbleiben.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Bei „mindestens einmal“ das Gegenereignis „nie“ berechnen und von 1 abziehen.</div>
  `,
  formulas: [
    { name: "Gegenereignis", html: "P(Ā) = 1 − P(A)", quantities: "Ā: A tritt nicht ein" },
    { name: "Mindestens einmal", html: "P(mindestens einmal) = 1 − (1 − p)<sup>n</sup>", quantities: "p Erfolgswahrscheinlichkeit, n unabhängige Versuche" },
  ],
  quiz: {
    question: "Du würfelst sechsmal. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs?",
    options: ["100 %, weil 6 · 1/6 = 1", "etwa 67 %", "genau 50 %"],
    correctIndex: 1,
    explanation: "1 − (5/6)⁶ ≈ 1 − 0,335 ≈ 66,5 %. Addieren geht nicht, weil sich die Fälle überschneiden.",
  },
  lab: {
    kind: "at-least-once",
    title: "Labor: Mindestens einmal",
    intro: "Wähle das Spiel und die Anzahl der Versuche. Die Säulen zeigen P(mindestens einmal) für n = 1 bis 20; die Knöpfe spielen ganze Serien durch.",
    params: [
      {
        type: "choice",
        key: "den",
        label: "Spiel",
        options: Object.entries(AT_LEAST_ONCE).map(([den, game]) => ({ value: Number(den), label: `${game.name}: p = 1/${den}` })),
        value: 6,
      },
      { type: "range", key: "n", label: "Versuche n", unit: "", min: 1, max: 20, step: 1, value: 1 },
      { type: "state", key: "series", value: 0, resetOnChange: true },
      { type: "state", key: "hits", value: 0, resetOnChange: true },
      { type: "state", key: "seed", value: 1789 },
    ],
    readouts: [
      { key: "P", label: "P(mindestens einmal)", unit: "%", digits: 1, emphasis: true, compute: (v) => atLeastOnce(v.den, v.n) * 100 },
      { key: "never", label: "P(nie)", unit: "%", digits: 1, compute: (v) => (1 - atLeastOnce(v.den, v.n)) * 100 },
      { key: "sim", label: "Simulation", compute: (v) => (v.series > 0 ? `${v.hits} von ${v.series} Serien (${fmt((v.hits / v.series) * 100, 1)} %)` : "noch keine Serie") },
    ],
    actions: [
      { id: "zehn", label: "10 Serien spielen", apply: (v) => simulateSeries(v, 10) },
      { id: "hundert", label: "100 Serien spielen", apply: (v) => simulateSeries(v, 100) },
      { id: "neu", label: "Zählung neu starten", apply: (v) => ({ ...v, series: 0, hits: 0 }) },
    ],
    goals: [
      { id: "halb", text: "Würfel: Finde das kleinste n, bei dem mindestens eine Sechs wahrscheinlicher ist als keine.", check: (v) => v.den === 6 && v.n === 4 },
      { id: "neunzig", text: "Würfel: Wie oft musst du mindestens würfeln, damit mit 90 % eine Sechs dabei ist?", check: (v) => v.den === 6 && v.n === 13 },
      { id: "muenze", text: "Münze: Finde das kleinste n mit mindestens 99 % für mindestens einmal Kopf.", check: (v) => v.den === 2 && v.n === 7 },
    ],
  },
  exercises: [
    {
      id: "mindestens",
      make: (rng, level): ExerciseTask => {
        const [label, p] = rng.pick([
          ["eine Sechs beim Würfeln", 1 / 6],
          ["einen Gewinn am Glücksrad (Gewinnchance 25 %)", 0.25],
          ["einen Treffer (Trefferquote 30 %)", 0.3],
          ["Kopf beim Münzwurf", 0.5],
          ["einen Gewinn (jedes zehnte Los gewinnt)", 0.1],
        ] as const);
        if (level === 1) {
          const n = rng.int(2, 8);
          const P = 1 - (1 - p) ** n;
          return {
            prompt: `Wie groß ist die Wahrscheinlichkeit für mindestens ${label} bei ${n} Versuchen?`,
            given: [`p = ${fmt(p, 4)}`, `n = ${n}`],
            formulaHint: "1 − (1 − p)ⁿ",
            fields: [
              numberField("P =", P, "", 4, {
                slips: [
                  { value: n * p, hint: "Wahrscheinlichkeiten der Versuche darf man nicht addieren. Rechne mit dem Gegenereignis „nie“." },
                  { value: (1 - p) ** n, hint: "Das ist P(nie). Gesucht ist 1 − P(nie)." },
                ],
              }),
            ],
            steps: [`P(nie) = (1 − ${fmt(p, 4)})^${n} ≈ ${fmt((1 - p) ** n, 4)}`, `<strong>P(mindestens einmal) ≈ 1 − ${fmt((1 - p) ** n, 4)} ≈ ${fmt(P, 4)}</strong>`],
          };
        }
        const target = rng.pick([0.8, 0.9, 0.95, 0.99]);
        const n = Math.ceil(Math.log(1 - target) / Math.log(1 - p) - 1e-12);
        const before = (1 - (1 - p) ** (n - 1)) * 100;
        const after = (1 - (1 - p) ** n) * 100;
        // Enough decimals that n − 1 stays visibly under the target (89,99 %, not 90,0 %).
        const digits = [1, 2, 3, 4].find((d) => round(before, d) < target * 100) ?? 4;
        return {
          prompt: `Wie oft muss man mindestens spielen, damit man mit einer Wahrscheinlichkeit von mindestens ${fmt(target * 100, 0)} % wenigstens ${label} hat?`,
          given: [`p = ${fmt(p, 4)}`, `Ziel: mindestens ${fmt(target * 100, 0)} %`],
          fields: [numberField("n =", n, "", 0, { slips: [{ value: n - 1, hint: `Prüfe: Bei ${n - 1} Versuchen sind es erst ${fmt(before, digits)} %.` }] })],
          steps: [`Gesucht: 1 − (1 − p)ⁿ ≥ ${fmt(target, 2)}, also (1 − p)ⁿ ≤ ${fmt(1 - target, 2)}`, `n = ${n - 1}: ${fmt(before, digits)} %; n = ${n}: ${fmt(after, digits)} %`, `<strong>n = ${n}</strong>`],
        };
      },
    },
    {
      id: "gegenereignis",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const n = rng.int(2, 5);
          const never = (5 / 6) ** n;
          return {
            prompt: `Du würfelst ${n}-mal. Berechne P(keine Sechs) und P(mindestens eine Sechs).`,
            given: [`n = ${n}`, "P(Sechs) = 1/6"],
            formulaHint: "P(keine Sechs) = (5/6)ⁿ, P(mindestens eine) = 1 − P(keine)",
            fields: [numberField("P(keine) =", never, "", 4), numberField("P(mindestens eine) =", 1 - never, "", 4)],
            steps: [`P(keine Sechs) = (5/6)^${n} ≈ ${fmt(never, 4)}`, `<strong>P(mindestens eine) ≈ ${fmt(1 - never, 4)}</strong>`],
          };
        }
        const green = rng.pick([0.3, 0.4, 0.5, 0.6]);
        const lights = rng.int(2, 4);
        const P = 1 - green ** lights;
        return {
          prompt: `Auf dem Schulweg liegen ${lights} Ampeln, die unabhängig voneinander mit ${fmt(green * 100, 0)} % Wahrscheinlichkeit grün zeigen, wenn du ankommst. Wie wahrscheinlich musst du an mindestens einer Ampel warten?`,
          given: [`P(grün) = ${fmt(green, 2)}`, `${lights} Ampeln`],
          fields: [numberField("P =", P, "", 4, { slips: [{ value: green ** lights, hint: "Das ist P(alle grün). Warten heißt: nicht alle grün." }] })],
          steps: [`Gegenereignis: alle grün, P = ${fmt(green, 2)}^${lights} = ${fmt(green ** lights, 4)}`, `<strong>P(mindestens einmal warten) = 1 − ${fmt(green ** lights, 4)} = ${fmt(P, 4)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest „mindestens einmal“ mit dem Gegenereignis und weißt, warum man nicht addieren darf.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=nR7hFCRgp1g",
    title: "Gegenwahrscheinlichkeit Gegenereignis berechnen",
    author: "Daniel Jung",
  },
};

// 5.3 Vierfeldertafel ────────────────────────────────────────────────────────

const vierfeldertafel: Lesson = {
  id: "dz-3-vierfeldertafel",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "5.3 Vierfeldertafel und bedingte Wahrscheinlichkeit",
  subtitle: "Was ein positiver Schnelltest wirklich bedeutet",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Vierfeldertafel`,
  whyItMatters:
    "Ein Test erkennt 90 % der Kranken, und trotzdem ist bei einem positiven Ergebnis oft niemand krank. Die Vierfeldertafel zeigt, warum: Es kommt darauf an, worauf man sich bezieht.",
  explanationHtml: `
    <p>Werden zwei Merkmale gleichzeitig erfasst (krank/gesund, Test positiv/negativ), ordnet man die Anzahlen in einer <strong>Vierfeldertafel</strong>. Die vier inneren Felder sind die Kombinationen, rechts und unten stehen die <strong>Summen</strong>, ganz unten rechts die <strong>Gesamtzahl</strong>.</p>
    <table class="mini">
      <tr><th></th><th>positiv</th><th>negativ</th><th>Summe</th></tr>
      <tr><th>krank</th><td>9</td><td>1</td><td>10</td></tr>
      <tr><th>gesund</th><td>99</td><td>891</td><td>990</td></tr>
      <tr><th>Summe</th><td>108</td><td>892</td><td>1000</td></tr>
    </table>
    <p>Die <strong>bedingte Wahrscheinlichkeit</strong> P<sub>B</sub>(A) („A unter der Bedingung B“) bezieht sich nur auf die Fälle mit B: <strong>P<sub>B</sub>(A) = ${frac("|A ∩ B|", "|B|")}</strong>.</p>
    <div class="example">Von 108 positiven Tests stammen nur 9 von Kranken: P(krank | positiv) = 9 : 108 ≈ 8,3 %, obwohl der Test 9 von 10 Kranken erkennt (90 %).</div>
    <div class="merke"><strong>Merke:</strong> Erst die Zeile oder Spalte der Bedingung wählen, dann darin den Anteil bestimmen.</div>
  `,
  formulas: [
    { name: "Bedingte Wahrscheinlichkeit", html: `P<sub>B</sub>(A) = ${frac("|A ∩ B|", "|B|")} = ${frac("P(A ∩ B)", "P(B)")}`, quantities: "Anteil von A unter den Fällen mit B" },
    { name: "Vierfeldertafel", html: "innere Felder + Zeilen- und Spaltensummen", quantities: "unten rechts: Gesamtzahl" },
  ],
  quiz: {
    question: "Was steht in einer Vierfeldertafel mit Anzahlen immer im Feld ganz unten rechts?",
    options: ["die Gesamtzahl aller Fälle", "die Zahl der Fälle mit beiden Merkmalen", "die Zahl der Fälle ohne beide Merkmale"],
    correctIndex: 0,
    explanation: "Unten rechts treffen sich Zeilen- und Spaltensumme: Es ist die Anzahl aller Befragten oder Untersuchten.",
  },
  lab: {
    kind: "test-table",
    title: "Labor: Der Schnelltest",
    intro: "1000 Personen werden getestet. Stelle ein, wie viele krank sind und wie gut der Test ist. Sensitivität: Anteil der Kranken mit positivem Test. Spezifität: Anteil der Gesunden mit negativem Test.",
    params: [
      { type: "range", key: "prev", label: "Anteil Kranke", unit: "%", min: 1, max: 50, step: 1, value: 10 },
      { type: "range", key: "sens", label: "Sensitivität", unit: "%", min: 50, max: 100, step: 0.5, value: 80, digits: 1 },
      { type: "range", key: "spec", label: "Spezifität", unit: "%", min: 50, max: 100, step: 0.1, value: 90, digits: 1 },
    ],
    readouts: [
      { key: "pos", label: "positive Tests", digits: 1, compute: (v) => testTable(v).truePositive + testTable(v).falsePositive },
      { key: "ppv", label: "P(krank | positiv)", unit: "%", digits: 1, emphasis: true, compute: (v) => testTable(v).ppv * 100 },
      { key: "npv", label: "P(gesund | negativ)", unit: "%", digits: 1, compute: (v) => { const t = testTable(v); const neg = t.trueNegative + t.falseNegative; return neg > 0 ? (t.trueNegative / neg) * 100 : 0; } },
    ],
    goals: [
      { id: "ueberraschung", text: "Stelle 1 % Kranke, 90 % Sensitivität und 90 % Spezifität ein. Wie oft stimmt ein positiver Test?", check: (v) => v.prev === 1 && v.sens === 90 && v.spec === 90 },
      { id: "fuenfzig", text: "Bei 1 % Kranken und 90 % Sensitivität: Finde die Spezifität, ab der ein positiver Test zu mindestens 50 % stimmt.", check: (v) => v.prev === 1 && v.sens === 90 && testTable(v).ppv >= 0.5 },
      {
        id: "unabhaengig",
        text: "Mache den Test nutzlos: Ein positives Ergebnis soll nichts verraten, P(krank | positiv) ist dann gleich dem Anteil der Kranken.",
        check: (v) => Math.abs(testTable(v).ppv - v.prev / 100) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "tafel",
      make: (rng, level): ExerciseTask => {
        const n = rng.pick([100, 120, 150, 200, 240, 300]);
        const a = rng.int(Math.round(n * 0.3), Math.round(n * 0.7));
        const b = rng.int(Math.round(n * 0.2), Math.round(n * 0.6));
        const ab = rng.int(Math.max(1, a + b - n + 1), Math.min(a, b) - 1);
        if (level === 1) {
          return {
            prompt: `Von ${n} Schülerinnen und Schülern kommen ${a} mit dem Fahrrad (R), ${b} tragen auf dem Schulweg einen Helm (H), ${ab} kommen mit dem Rad und tragen einen Helm. Ergänze die Vierfeldertafel: R ∩ H̄, R̄ ∩ H und R̄ ∩ H̄.`,
            given: [`|R| = ${a}, |H| = ${b}`, `|R ∩ H| = ${ab}`, `n = ${n}`],
            formulaHint: "Zeilen und Spalten ergeben ihre Summen",
            fields: [numberField("|R ∩ H̄| =", a - ab, "", 0), numberField("|R̄ ∩ H| =", b - ab, "", 0), numberField("|R̄ ∩ H̄| =", n - a - b + ab, "", 0)],
            steps: [`|R ∩ H̄| = ${a} − ${ab} = ${a - ab}, |R̄ ∩ H| = ${b} − ${ab} = ${b - ab}`, `|R̄ ∩ H̄| = ${n} − ${a} − ${b - ab} = ${n - a - b + ab}`, `<strong>${a - ab}, ${b - ab}, ${n - a - b + ab}</strong>`],
          };
        }
        return {
          prompt: `Von ${n} Schülerinnen und Schülern kommen ${a} mit dem Rad, ${b} tragen einen Helm, ${ab} kommen mit dem Rad und tragen einen Helm. Wie groß ist der Anteil der Helmträger unter den Radfahrern, und wie groß der Anteil der Radfahrer unter den Helmträgern?`,
          given: [`|R| = ${a}, |H| = ${b}, |R ∩ H| = ${ab}`],
          fields: [numberField("P<sub>R</sub>(H) =", ab / a, "", 4), numberField("P<sub>H</sub>(R) =", ab / b, "", 4)],
          steps: [`P_R(H) = |R ∩ H| : |R| = ${ab} : ${a} ≈ ${fmt(ab / a, 4)}`, `P_H(R) = |R ∩ H| : |H| = ${ab} : ${b} ≈ ${fmt(ab / b, 4)}`, `<strong>${fmt((ab / a) * 100, 1)} % und ${fmt((ab / b) * 100, 1)} %</strong>: Die Bedingung entscheidet, worauf sich der Anteil bezieht.`],
        };
      },
    },
    {
      id: "bedingt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const tp = rng.int(5, 40);
          const fp = rng.int(5, 60);
          const fn = rng.int(1, 10);
          const tn = rng.int(100, 400);
          return {
            prompt: `Eine Vierfeldertafel zeigt: krank und positiv ${tp}, krank und negativ ${fn}, gesund und positiv ${fp}, gesund und negativ ${tn}. Berechne P(krank | positiv).`,
            given: [`positiv: ${tp} krank, ${fp} gesund`, `negativ: ${fn} krank, ${tn} gesund`],
            formulaHint: "P(krank | positiv) = krank und positiv : alle positiven",
            fields: [numberField("P =", tp / (tp + fp), "", 4, { slips: [{ value: tp / (tp + fn), hint: "Das ist P(positiv | krank). Hier ist die Bedingung „positiv“: Teile durch alle positiven Tests." }] })],
            steps: [`alle positiven: ${tp} + ${fp} = ${tp + fp}`, `<strong>P = ${tp} : ${tp + fp} ≈ ${fmt(tp / (tp + fp), 4)}</strong>`],
          };
        }
        const prev = rng.pick([1, 2, 5, 10]);
        const sens = rng.pick([90, 95, 98]);
        const spec = rng.pick([90, 95, 97, 99]);
        const t = testTable({ prev, sens, spec });
        return {
          prompt: `Von 1000 Personen sind ${prev * 10} krank. Ein Test erkennt ${sens} % der Kranken und schlägt bei ${100 - spec} % der Gesunden fälschlich positiv an. Wie wahrscheinlich ist jemand mit positivem Test wirklich krank?`,
          given: [`${prev * 10} von 1000 krank`, `Sensitivität ${sens} %`, `falsch positiv bei ${100 - spec} % der Gesunden`],
          fields: [numberField("P(krank | positiv) =", t.ppv, "", 3, { tolerance: 0.02, slips: [{ value: sens / 100, hint: "Das ist P(positiv | krank). Gefragt ist umgekehrt: Teile die richtig Positiven durch alle Positiven." }] })],
          steps: [`krank und positiv: ${prev * 10} · ${sens} % = ${fmt(t.truePositive, 1)}`, `gesund und positiv: ${1000 - prev * 10} · ${100 - spec} % = ${fmt(t.falsePositive, 1)}`, `<strong>P = ${fmt(t.truePositive, 1)} : ${fmt(t.truePositive + t.falsePositive, 1)} ≈ ${fmt(t.ppv, 3)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du füllst Vierfeldertafeln und unterscheidest P(krank | positiv) von P(positiv | krank).",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=xslCG8xjGjI",
    title: "Vierfeldertafel Wahrscheinlichkeitsrechnung",
    author: "Daniel Jung",
  },
};

// 5.4 Kenngrößen ─────────────────────────────────────────────────────────────

const kenngroessen: Lesson = {
  id: "dz-4-kenngroessen",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "5.4 Mittelwert, Median und Quartile",
  subtitle: "Ein Ausreißer zieht am Mittelwert, nicht am Median",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Lage- und Streumaße`,
  whyItMatters:
    "„Im Durchschnitt“ ist schnell gesagt. Ob eine Zahl die Daten fair beschreibt, hängt davon ab, ob es Ausreißer gibt. Median und Quartile sind dabei robuster als der Mittelwert.",
  explanationHtml: `
    <p>Eine <strong>Urliste</strong> wird zuerst zur <strong>Rangliste</strong> sortiert.</p>
    <ul>
      <li><strong>Arithmetisches Mittel</strong> x̄ = Summe aller Werte : Anzahl. Im Labor ist es der Punkt, an dem die Wippe im Gleichgewicht ist.</li>
      <li><strong>Median</strong> (Zentralwert): der mittlere Wert der Rangliste; bei gerader Anzahl der Mittelwert der beiden mittleren.</li>
      <li><strong>Unteres Quartil q₁</strong> und <strong>oberes Quartil q₃</strong>: die Mediane der unteren und der oberen Hälfte. Bei ungerader Anzahl zählt der Median selbst zu keiner Hälfte.</li>
      <li><strong>Spannweite</strong> = Maximum − Minimum.</li>
    </ul>
    <div class="example">Rangliste 2, 3, 5, 7, 8, 9, 15: Median 7, untere Hälfte 2, 3, 5 → q₁ = 3, obere Hälfte 8, 9, 15 → q₃ = 9. Mittelwert 49 : 7 = 7. Wird aus der 15 eine 50, steigt der Mittelwert auf 12, der Median bleibt 7.</div>
    <div class="merke"><strong>Merke:</strong> Der Median ist robust gegen Ausreißer, der Mittelwert nicht.</div>
  `,
  formulas: [
    { name: "Arithmetisches Mittel", html: `x̄ = ${frac("x₁ + x₂ + … + x<sub>n</sub>", "n")}`, quantities: "Summe durch Anzahl" },
    { name: "Median und Quartile", html: "Median: Mitte der Rangliste; q₁, q₃: Mitten der Hälften", quantities: "vorher der Größe nach ordnen" },
  ],
  quiz: {
    question: "Welche Kenngröße teilt eine geordnete Rangliste in zwei gleich große Hälften?",
    options: ["das arithmetische Mittel", "der Median", "die Spannweite"],
    correctIndex: 1,
    explanation: "Der Median ist der mittlere Wert der Rangliste: Mindestens die Hälfte der Werte ist kleiner oder gleich, mindestens die Hälfte größer oder gleich.",
  },
  lab: {
    kind: "data-dots",
    title: "Labor: Die Wippe",
    intro: "Ziehe die 11 Datenpunkte (oder wähle einen an und benutze die Pfeiltasten). Die Wippe ruht immer auf dem Mittelwert, die gestrichelte Linie zeigt den Median.",
    params: dataParams("v", [3, 5, 7, 8, 10, 12, 13, 15, 18, 20, 22], 30),
    readouts: [
      { key: "mean", label: "Mittelwert", digits: 2, emphasis: true, compute: (v) => mean(dataValues(v, "v", 11)) },
      { key: "median", label: "Median", digits: 1, compute: (v) => median(dataValues(v, "v", 11)) },
      { key: "q1", label: "unteres Quartil q₁", digits: 1, compute: (v) => quartiles(dataValues(v, "v", 11)).q1 },
      { key: "q3", label: "oberes Quartil q₃", digits: 1, compute: (v) => quartiles(dataValues(v, "v", 11)).q3 },
      { key: "range", label: "Spannweite", digits: 0, compute: (v) => { const s = sorted(dataValues(v, "v", 11)); return s[s.length - 1] - s[0]; } },
    ],
    goals: [
      {
        id: "ausreisser",
        text: "Ziehe große Werte nach rechts, bis der Mittelwert mindestens 2 über dem Median liegt. Was macht der Median?",
        check: (_v, r) => Number(r.mean) - Number(r.median) >= 2,
      },
      {
        id: "gleich",
        text: "Mache Mittelwert und Median genau gleich, ohne dass alle Werte gleich sind.",
        check: (v, r) => Math.abs(Number(r.mean) - Number(r.median)) < 1e-9 && new Set(dataValues(v, "v", 11)).size > 1,
      },
      {
        id: "quartile",
        text: "Stelle die Daten so ein, dass q₁ = 10, der Median 15 und q₃ = 20 ist.",
        check: (_v, r) => r.q1 === 10 && r.median === 15 && r.q3 === 20,
      },
    ],
  },
  exercises: [
    {
      id: "mittel-median",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const count = rng.pick([7, 8, 9, 10]);
          const values = sample(rng, count, 1, 30);
          return {
            prompt: `Berechne Mittelwert und Median der Urliste ${list(values)}.`,
            given: [`${count} Werte`],
            formulaHint: "Mittelwert: Summe : Anzahl. Median: erst sortieren, dann die Mitte",
            fields: [numberField("Mittelwert =", mean(values), "", 2), numberField("Median =", median(values), "", 1, { slips: [{ value: values[Math.floor(count / 2)], hint: "Sortiere die Werte zuerst der Größe nach." }] })],
            steps: [`Summe ${values.reduce((s, v) => s + v, 0)}, Mittelwert ${values.reduce((s, v) => s + v, 0)} : ${count} ≈ ${fmt(mean(values), 2)}`, `Rangliste ${list(sorted(values))}`, `<strong>Mittelwert ≈ ${fmt(mean(values), 2)}, Median ${fmt(median(values), 1)}</strong>`],
          };
        }
        const games = rng.int(4, 6);
        const scores = sample(rng, games, 8, 25);
        const target = Math.round(mean(scores)) + rng.int(1, 3);
        const needed = target * (games + 1) - scores.reduce((s, v) => s + v, 0);
        return {
          prompt: `Eine Basketballerin hat in ${games} Spielen ${list(scores)} Punkte geworfen. Wie viele Punkte braucht sie im nächsten Spiel, damit ihr Schnitt genau ${target} Punkte beträgt?`,
          given: [`bisher: ${list(scores)}`, `Ziel-Mittelwert ${target}`],
          fields: [numberField("Punkte =", needed, "", 0, { slips: [{ value: target, hint: "Der neue Wert muss die Summe auf Ziel · Anzahl bringen, nicht selbst gleich dem Ziel sein." }] })],
          steps: [`Benötigte Summe: ${target} · ${games + 1} = ${target * (games + 1)}`, `Bisher: ${scores.reduce((s, v) => s + v, 0)}`, `<strong>${target * (games + 1)} − ${scores.reduce((s, v) => s + v, 0)} = ${needed} Punkte</strong>`],
        };
      },
    },
    {
      id: "quartile",
      make: (rng, level): ExerciseTask => {
        // Conventions for quartiles differ, so every prompt names the lesson's.
        const count = level === 1 ? rng.pick([7, 11]) : rng.pick([8, 12]);
        const values = sample(rng, count, 1, 40);
        const { q1, q2, q3 } = quartiles(values);
        if (level === 1) {
          return {
            prompt: `Bestimme unteres Quartil, Median und oberes Quartil der Urliste ${list(values)}. ${QUARTILE_RULE}`,
            given: [`${count} Werte`],
            formulaHint: "Sortieren; Median; q₁ und q₃ sind die Mediane der Hälften ohne den Median",
            fields: [numberField("q₁ =", q1, "", 1), numberField("Median =", q2, "", 1), numberField("q₃ =", q3, "", 1)],
            steps: [`Rangliste ${list(sorted(values))}`, `Median ${fmt(q2, 1)}; untere Hälfte ${list(sorted(values).slice(0, Math.floor(count / 2)))}, obere Hälfte ${list(sorted(values).slice(Math.ceil(count / 2)))}`, `<strong>q₁ = ${fmt(q1, 1)}, Median = ${fmt(q2, 1)}, q₃ = ${fmt(q3, 1)}</strong>`],
          };
        }
        return {
          prompt: `Hier sind die Zeiten (in Minuten), die ${count} Jugendliche für ihren Schulweg brauchen: ${list(values)}. Bestimme die Quartile und den Abstand zwischen ihnen (Interquartilsabstand). ${QUARTILE_RULE}`,
          given: [`${count} Werte`],
          fields: [numberField("q₁ =", q1, "min", 1), numberField("q₃ =", q3, "min", 1), numberField("q₃ − q₁ =", q3 - q1, "min", 1)],
          steps: [`Rangliste ${list(sorted(values))}`, `untere Hälfte: ${list(sorted(values).slice(0, count / 2))} → q₁ = ${fmt(q1, 1)}; obere Hälfte → q₃ = ${fmt(q3, 1)}`, `<strong>q₁ = ${fmt(q1, 1)}, q₃ = ${fmt(q3, 1)}, Abstand ${fmt(q3 - q1, 1)} min</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst Mittelwert, Median und Quartile und erkennst, wann ein Mittelwert täuscht.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=OM90fGYTj_w",
    title: "Mittelwert und Median berechnen",
    author: "Daniel Jung",
  },
};

// 5.5 Boxplot ────────────────────────────────────────────────────────────────

const boxplot: Lesson = {
  id: "dz-5-boxplot",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "5.5 Der Boxplot",
  subtitle: "Fünf Zahlen zeigen eine ganze Verteilung",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Boxplot`,
  whyItMatters:
    "Zwei Klassen, zwei Testergebnisse: Welche hat besser abgeschnitten, welche ist gleichmäßiger? Zwei Boxplots untereinander beantworten das auf einen Blick.",
  explanationHtml: `
    <p>Ein <strong>Boxplot</strong> zeigt fünf Kennwerte: <strong>Minimum, q₁, Median, q₃, Maximum</strong>.</p>
    <ul>
      <li>Die <strong>Box</strong> reicht von q₁ bis q₃ und enthält die <strong>mittleren 50 %</strong> der Werte. Ihre Breite q₃ − q₁ heißt <strong>Interquartilsabstand</strong>.</li>
      <li>Der Strich in der Box ist der <strong>Median</strong>.</li>
      <li>Die <strong>Antennen</strong> (Whisker) reichen von der Box bis zum Minimum und Maximum.</li>
      <li>Jeder der vier Teile enthält etwa ein Viertel der Werte. Ein kurzer Teil heißt: Dort liegen die Werte dicht beieinander, nicht: dort liegen weniger Werte.</li>
    </ul>
    <div class="example">Liegt der Median weit links in der Box und ist die rechte Antenne lang, sind die Werte nach rechts weit gestreut: Die Verteilung ist nicht symmetrisch, sondern <strong>schief</strong>.</div>
    <div class="merke"><strong>Merke:</strong> Box = mittlere Hälfte, Breite der Box = Interquartilsabstand, Spannweite = Max − Min.</div>
  `,
  formulas: [
    { name: "Boxplot", html: "Min — q₁ [ Median ] q₃ — Max", quantities: "Box: mittlere 50 % der Werte" },
    { name: "Interquartilsabstand", html: "IQR = q₃ − q₁", quantities: "Breite der Box" },
  ],
  quiz: {
    question: "Wie viel Prozent aller Werte liegen im Boxplot innerhalb der Box (von q₁ bis q₃)?",
    options: ["25 %", "50 %", "75 %"],
    correctIndex: 1,
    explanation: "Unter q₁ liegt etwa ein Viertel, über q₃ ebenfalls. Dazwischen, in der Box, ist die mittlere Hälfte der Werte.",
  },
  lab: {
    kind: "boxplot",
    title: "Labor: Deine Klasse gegen die 9b",
    intro: "Ziehe die 12 Punktwerte deiner Klasse. Der Boxplot darüber rechnet mit; oben steht zum Vergleich die Klasse 9b.",
    params: dataParams("w", [4, 8, 11, 14, 17, 19, 21, 23, 26, 29, 32, 36], 40),
    readouts: [
      { key: "five", label: "Min | q₁ | Median | q₃ | Max", compute: (v) => { const f = fiveNumbers(dataValues(v, "w", 12)); return [f.min, f.q1, f.q2, f.q3, f.max].map((x) => fmt(x, 1)).join(" | "); } },
      { key: "iqr", label: "Interquartilsabstand", digits: 1, emphasis: true, compute: (v) => { const f = fiveNumbers(dataValues(v, "w", 12)); return f.q3 - f.q1; } },
      { key: "range", label: "Spannweite", digits: 0, compute: (v) => { const f = fiveNumbers(dataValues(v, "w", 12)); return f.max - f.min; } },
    ],
    goals: [
      {
        id: "schmal",
        text: "Mache die Box höchstens 4 Punkte breit, die Spannweite aber mindestens 30.",
        check: (v) => { const f = fiveNumbers(dataValues(v, "w", 12)); return f.q3 - f.q1 <= 4 && f.max - f.min >= 30; },
      },
      {
        id: "vergleich",
        text: "Übertriff die 9b: einen höheren Median, aber eine schmalere Box.",
        check: (v) => { const f = fiveNumbers(dataValues(v, "w", 12)); return f.q2 > CLASS_9B.q2 && f.q3 - f.q1 < CLASS_9B.q3 - CLASS_9B.q1; },
      },
      {
        id: "schief",
        text: "Lege den Median in die linke Hälfte der Box und mache die rechte Antenne mindestens doppelt so lang wie die linke.",
        check: (v) => {
          const f = fiveNumbers(dataValues(v, "w", 12));
          return f.q2 - f.q1 < (f.q3 - f.q1) / 2 && f.q1 - f.min > 0 && f.max - f.q3 >= 2 * (f.q1 - f.min);
        },
      },
    ],
  },
  exercises: [
    {
      id: "fuenf-zahlen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const values = sample(rng, rng.pick([8, 12]), 1, 50);
          const f = fiveNumbers(values);
          return {
            prompt: `Bestimme die fünf Kennwerte für einen Boxplot der Werte ${list(values)}. ${QUARTILE_RULE}`,
            given: [`${values.length} Werte`],
            formulaHint: "Sortieren; Min, q₁, Median, q₃, Max",
            fields: [numberField("Min =", f.min, "", 1), numberField("q₁ =", f.q1, "", 1), numberField("Median =", f.q2, "", 1), numberField("q₃ =", f.q3, "", 1), numberField("Max =", f.max, "", 1)],
            steps: [`Rangliste ${list(sorted(values))}`, `<strong>${fmt(f.min, 1)} | ${fmt(f.q1, 1)} | ${fmt(f.q2, 1)} | ${fmt(f.q3, 1)} | ${fmt(f.max, 1)}</strong>`],
          };
        }
        const q1 = rng.int(8, 20);
        const q3 = q1 + rng.int(6, 20);
        const share = rng.pick([25, 50, 75]);
        const answer = share;
        const bound = share === 25 ? q1 : share === 50 ? `${q1} und ${q3}` : q3;
        return {
          prompt: `Ein Boxplot über die Wartezeiten an einer Kasse hat die Box von ${q1} s bis ${q3} s. Wie breit ist die Box, und wie viel Prozent der Wartezeiten liegen ${share === 25 ? `unter ${bound} s` : share === 50 ? `zwischen ${bound} s` : `unter ${bound} s`}?`,
          given: [`q₁ = ${q1} s`, `q₃ = ${q3} s`],
          fields: [numberField("Boxbreite =", q3 - q1, "s", 0), numberField("Anteil ≈", answer, "%", 0)],
          steps: [`Boxbreite q₃ − q₁ = ${q3} − ${q1} = ${q3 - q1} s`, `Unter q₁ liegt etwa ein Viertel, zwischen q₁ und q₃ die Hälfte, unter q₃ drei Viertel.`, `<strong>${q3 - q1} s, etwa ${answer} %</strong>`],
        };
      },
    },
    {
      id: "boxplot-lesen",
      make: (rng, level): ExerciseTask => {
        const min = rng.int(0, 10);
        const q1 = min + rng.int(2, 10);
        const q2 = q1 + rng.int(1, 8);
        const q3 = q2 + rng.int(1, 8);
        const max = q3 + rng.int(2, 15);
        if (level === 1) {
          return {
            prompt: `Ein Boxplot hat die Kennwerte Min ${min}, q₁ ${q1}, Median ${q2}, q₃ ${q3}, Max ${max}. Bestimme Spannweite und Interquartilsabstand.`,
            given: [`${min} | ${q1} | ${q2} | ${q3} | ${max}`],
            formulaHint: "Spannweite = Max − Min, IQR = q₃ − q₁",
            fields: [numberField("Spannweite =", max - min, "", 0), numberField("IQR =", q3 - q1, "", 0, { slips: [{ value: q3 - q2, hint: "Der Interquartilsabstand reicht von q₁ bis q₃, über den Median hinweg." }] })],
            steps: [`Spannweite = ${max} − ${min} = ${max - min}`, `<strong>Spannweite ${max - min}, IQR = ${q3} − ${q1} = ${q3 - q1}</strong>`],
          };
        }
        const pupils = rng.pick([24, 28, 32]);
        return {
          prompt: `Der Boxplot der Schulwege einer Klasse mit ${pupils} Kindern zeigt q₁ = ${q1} min, Median ${q2} min und q₃ = ${q3} min. Wie viele Kinder brauchen ungefähr höchstens ${q3} Minuten, und wie viele brauchen mehr als ${q2} Minuten?`,
          given: [`${pupils} Kinder`, `q₁ = ${q1}, Median ${q2}, q₃ = ${q3}`],
          fields: [numberField("höchstens q₃:", (pupils * 3) / 4, "Kinder", 0), numberField("mehr als Median:", pupils / 2, "Kinder", 0)],
          steps: [`Bis q₃ liegen etwa drei Viertel: ¾ · ${pupils} = ${(pupils * 3) / 4}`, `Über dem Median liegt etwa die Hälfte: ${pupils / 2}`, `<strong>etwa ${(pupils * 3) / 4} und ${pupils / 2} Kinder</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest und zeichnest Boxplots und vergleichst damit zwei Verteilungen.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=HbHoRjIHOTE",
    title: "Boxplot zeichnen und verstehen",
    author: "Daniel Jung",
  },
};

export const STAGE_DATEN_ZUFALL: Stage = {
  id: STAGE_ID,
  stageNumber: 5,
  title: "Daten und Zufall",
  subtitle: "Baumdiagramme, Gegenereignis, Vierfeldertafel, Kenngrößen, Boxplot",
  icon: "🎲",
  accent: "#db2777",
  badgeTitle: "Zufalls-Profi",
  lehrplanLabel: "LB 8 (I) · LB 7 (II/III)",
  lessons: [baumdiagramm, gegenereignis, vierfeldertafel, kenngroessen, boxplot],
};
