import { fmt, pow10, pow10Text, sciHtml, sciText } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { decimalString, fromSci, PREFIXES, sci } from "../models";
import { BOTH, choice, lab, makeLesson, makeStage, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(2, content);

/** A mantissa with one decimal between 1,1 and 9,9 (never a whole 10). */
const mantissa = (rng: Rng) => rng.int(11, 99) / 10;
/** An exponent from `min` to `max` without 0. */
function exponent(rng: Rng, min: number, max: number): number {
  let n = rng.int(min, max);
  while (n === 0) n = rng.int(min, max);
  return n;
}

/** Vorzahl and Exponent as two fields, with the typical slips. */
function sciFields(a: number, n: number, digits = 2) {
  return [
    num("Vorzahl a =", a, "", digits, {
      slips: [
        { value: a * 10, hint: "Die Vorzahl muss zwischen 1 und 10 liegen: genau eine Ziffer vor dem Komma." },
        { value: a / 10, hint: "Die Vorzahl muss mindestens 1 sein: eine Ziffer ungleich 0 vor dem Komma." },
      ],
    }),
    num("Exponent n =", n, "", 0, {
      slips: [
        { value: -n, hint: n < 0 ? "Zahlen kleiner als 1 haben einen negativen Exponenten." : "Zahlen größer als 10 haben einen positiven Exponenten." },
        { value: n + (n > 0 ? 1 : -1), hint: "Zähle, um wie viele Stellen das Komma wandert, nicht die Zahl der Ziffern." },
      ],
    }),
  ];
}

// 2.1 Große und kleine Zahlen ──────────────────────────────────────────────

/** Sizes from science and everyday life that stay true. */
const FACTS = [
  { text: "Die Erde ist im Mittel etwa 149.600.000 km von der Sonne entfernt.", a: 1.496, n: 8, unit: "km" },
  { text: "Der Mond ist im Mittel etwa 384.400 km von der Erde entfernt.", a: 3.844, n: 5, unit: "km" },
  { text: "Ein Lichtjahr sind etwa 9.460.000.000.000 km.", a: 9.46, n: 12, unit: "km" },
  { text: "Ein Blatt Druckerpapier ist etwa 0,0001 m dick.", a: 1, n: -4, unit: "m" },
  { text: "Ein rotes Blutkörperchen hat einen Durchmesser von etwa 0,0000075 m.", a: 7.5, n: -6, unit: "m" },
  { text: "Grünes Licht hat eine Wellenlänge von etwa 0,00000055 m.", a: 5.5, n: -7, unit: "m" },
  { text: "Die Erde hat einen Durchmesser von etwa 12.740 km.", a: 1.274, n: 4, unit: "km" },
  { text: "Ein Haar ist etwa 0,00007 m dick.", a: 7, n: -5, unit: "m" },
];

const zehnerpotenzen = L({
  id: "po-1-zehnerpotenzen",
  title: "Große und kleine Zahlen mit Zehnerpotenzen",
  subtitle: "Das Komma wandert um n Stellen",
  tracks: BOTH,
  whyItMatters:
    "Entfernungen im Weltall und die Größe von Bakterien haben so viele Nullen, dass man sich leicht verzählt. Mit Zehnerpotenzen schreibst du solche Zahlen kurz, liest sie sicher und vergleichst sie auf einen Blick.",
  explanationHtml: `
    <p>Eine <strong>Zehnerpotenz</strong> ist ein Produkt aus lauter Zehnen: 10<sup>3</sup> = 10 · 10 · 10 = 1.000. Der Exponent sagt, wie viele Nullen nach der 1 stehen. Für Zahlen kleiner als 1 gibt es <strong>negative Exponenten</strong>: 10<sup>−1</sup> = 0,1; 10<sup>−3</sup> = 0,001 = 1 : 1.000. Der negative Exponent sagt, an welcher Stelle nach dem Komma die 1 steht.</p>
    <p>In der <strong>Zehnerpotenzschreibweise</strong> schreibst du eine Zahl als a · 10<sup>n</sup>, wobei die Vorzahl a zwischen 1 und 10 liegt (1 ≤ a &lt; 10). Der Exponent n gibt an, um wie viele Stellen das Komma wandert: bei positivem n nach rechts, bei negativem n nach links.</p>
    <div class="example"><strong>Beispiel:</strong> 4.500.000 = 4,5 · 10<sup>6</sup>, denn das Komma wandert von 4,5 aus 6 Stellen nach rechts.<br>
    0,00072 = 7,2 · 10<sup>−4</sup>, denn das Komma wandert von 7,2 aus 4 Stellen nach links.<br>
    Vergleichen: 3,9 · 10<sup>−2</sup> = 0,039 ist größer als 4,2 · 10<sup>−3</sup> = 0,0042. Bei Vorzahlen zwischen 1 und 10 entscheidet zuerst der Exponent: −2 ist größer als −3.</div>
    <div class="merke"><strong>Merke:</strong> a · 10<sup>n</sup> mit 1 ≤ a &lt; 10. Großer Exponent, große Zahl. Bei negativem Exponenten ist die Zahl kleiner als 1, aber nicht negativ. Zum Ordnen vergleichst du zuerst die Exponenten, bei gleichem Exponenten die Vorzahlen.</div>
  `,
  formulas: [
    { name: "Zehnerpotenzschreibweise", html: "a · 10<sup>n</sup> mit 1 ≤ a &lt; 10", quantities: "a Vorzahl, n ganze Zahl: um so viele Stellen wandert das Komma" },
    { name: "Negative Exponenten", html: `${pow10(-1)} = 0,1; ${pow10(-3)} = 0,001`, quantities: "die 1 steht an der n-ten Stelle nach dem Komma" },
  ],
  quiz: {
    question: "Welche Zahl ist 6,3 · 10⁻⁴?",
    options: ["0,00063", "63.000", "−6.300", "0,0063"],
    correctIndex: 0,
    explanation:
      "Der Exponent −4 heißt: Das Komma wandert von 6,3 aus 4 Stellen nach links. Das ergibt 0,00063. Ein negativer Exponent macht die Zahl klein, nicht negativ.",
  },
  lab: lab(
    "place-value",
    "Die Stellenwerttafel",
    "Stelle die Vorzahl ein und ziehe den Exponenten. Die Ziffern rutschen in der Stellenwerttafel, das Komma bleibt rechts von den Einern.",
    [r("m", "Vorzahl a", 1, 9.9, 1, 0.1), r("e", "Exponent n", -9, 9, 0, 1)],
    [
      o("dezimal", "Dezimalschreibweise", (v) => decimalString(v.m, v.e), "", 0, true),
      o("stellen", "Komma wandert um", (v) => `${Math.abs(v.e)} ${Math.abs(v.e) === 1 ? "Stelle" : "Stellen"} nach ${v.e >= 0 ? "rechts" : "links"}`),
    ],
    [
      { id: "licht", text: "Licht legt in einer Sekunde etwa 300.000.000 m zurück. Stelle diese Zahl ein.", check: (v) => v.m === 3 && v.e === 8 },
      { id: "haar", text: "Ein Haar ist etwa 0,00007 m dick. Stelle diese Zahl ein.", check: (v) => v.m === 7 && v.e === -5 },
      { id: "groesser", text: "Stelle die größere der beiden Zahlen 4,2 · 10⁻³ und 3,9 · 10⁻² ein.", check: (v) => v.m === 3.9 && v.e === -2 },
    ],
  ),
  exercises: [
    {
      id: "umwandeln",
      make: (rng, level) => {
        if (level === 1) {
          const a = mantissa(rng);
          const n = exponent(rng, -7, 9);
          if (rng.next() < 0.5)
            return task(
              level,
              `Schreibe ${decimalString(a, n)} in Zehnerpotenzschreibweise a · 10<sup>n</sup> mit 1 ≤ a &lt; 10.`,
              sciFields(a, n),
              "Setze das Komma hinter die erste Ziffer, die nicht 0 ist. Zähle, um wie viele Stellen es gewandert ist: nach links heißt positiver, nach rechts negativer Exponent.",
              [`Vorzahl: ${fmt(a)}`, `Das Komma wandert von ${fmt(a)} aus ${Math.abs(n)} ${Math.abs(n) === 1 ? "Stelle" : "Stellen"} nach ${n > 0 ? "rechts" : "links"}.`],
              `${decimalString(a, n)} = ${sciHtml(a, n)}`,
              { a, n },
            );
          return task(
            level,
            `Schreibe ${sciHtml(a, n)} als Dezimalzahl.`,
            [num("Dezimalzahl:", fromSci(a, n), "", Math.max(0, 1 - n), { slips: [{ value: fromSci(a, -n), hint: "Achte auf das Vorzeichen des Exponenten: positiv heißt Komma nach rechts, negativ nach links." }, { value: fromSci(a, n + (n > 0 ? -1 : 1)), hint: "Der Exponent sagt, um wie viele Stellen das Komma wandert. Zähle nach." }] })],
            "Exponent positiv: Komma nach rechts. Exponent negativ: Komma nach links. Fehlende Stellen füllst du mit Nullen.",
            [`Das Komma wandert von ${fmt(a)} aus ${Math.abs(n)} ${Math.abs(n) === 1 ? "Stelle" : "Stellen"} nach ${n > 0 ? "rechts" : "links"}.`],
            `${sciHtml(a, n)} = ${decimalString(a, n)}`,
            { a, n },
          );
        }
        const fact = rng.pick(FACTS);
        return task(
          level,
          `${fact.text} Schreibe die Zahl in Zehnerpotenzschreibweise mit der Einheit ${fact.unit}.`,
          sciFields(fact.a, fact.n, 4),
          "Vorzahl zwischen 1 und 10, dann zählen, um wie viele Stellen das Komma wandert.",
          [`Vorzahl: ${fmt(fact.a, 4)}`, `Das Komma wandert ${Math.abs(fact.n)} Stellen nach ${fact.n > 0 ? "rechts" : "links"}.`],
          `${sciHtml(fact.a, fact.n)} ${fact.unit}`,
          { a: fact.a, n: fact.n },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        if (level === 1) {
          const n = exponent(rng, -6, 6);
          const items = [
            { a: mantissa(rng), n },
            { a: mantissa(rng), n: n + rng.pick([-2, -1, 1, 2]) },
            { a: mantissa(rng), n: n + rng.pick([-3, 3]) },
          ];
          while (items[0].a === items[1].a) items[1].a = mantissa(rng);
          const value = (x: { a: number; n: number }) => fromSci(x.a, x.n);
          const sorted = [...items].sort((p, q) => value(p) - value(q));
          const show = (x: { a: number; n: number }) => sciText(x.a, x.n);
          const byMantissa = [...items].sort((p, q) => p.a - q.a);
          const byAbsExp = [...items].sort((p, q) => Math.abs(p.n) - Math.abs(q.n) || p.a - q.a);
          const options = [sorted, byMantissa, byAbsExp, [...sorted].reverse()]
            .map((list) => list.map(show).join(" < "))
            .filter((text, i, all) => all.indexOf(text) === i);
          return task(
            level,
            `Ordne die Zahlen ${items.map((x) => sciHtml(x.a, x.n)).join(", ")} der Größe nach, mit der kleinsten zuerst.`,
            [choiceField("Reihenfolge:", options, 0)],
            "Vergleiche zuerst die Exponenten: Der kleinere Exponent gehört zur kleineren Zahl. Nur bei gleichem Exponenten entscheidet die Vorzahl.",
            sorted.map((x) => `${sciText(x.a, x.n)} = ${decimalString(x.a, x.n)}`),
            sorted.map(show).join(" < "),
            { n },
          );
        }
        const small = { a: mantissa(rng), n: exponent(rng, -9, -4) };
        const factor = rng.pick([10, 20, 25, 40, 50, 100, 200, 500, 1000]);
        const big = sci(fromSci(small.a, small.n) * factor, 6);
        const things = rng.pick([
          ["ein Virus", "ein Bakterium"],
          ["ein Staubkorn", "ein Sandkorn"],
          ["eine Zelle", "ein Insektenei"],
        ]);
        return task(
          level,
          `${things[0][0].toUpperCase()}${things[0].slice(1)} ist etwa ${sciHtml(small.a, small.n)} m groß, ${things[1]} etwa ${sciHtml(big.a, big.n)} m. Welches ist größer, und wie viel mal so groß ist es?`,
          [choiceField("Größer ist", [things[1], things[0]], 0), num("Faktor:", factor, "", 2, { slips: [{ value: 1 / factor, hint: "Teile die größere durch die kleinere Länge." }] })],
          "Schreibe beide als Dezimalzahl oder teile Vorzahlen und rechne den Unterschied der Exponenten als Zehnerpotenz.",
          [`${sciText(big.a, big.n)} : ${sciText(small.a, small.n)} = (${fmt(big.a, 4)} : ${fmt(small.a)}) · ${pow10Text(big.n - small.n)}`],
          `${things[1][0].toUpperCase()}${things[1].slice(1)} ist ${fmt(factor)}-mal so groß.`,
          { factor },
        );
      },
    },
  ],
});

// 2.2 Rechnen mit Zehnerpotenzen ───────────────────────────────────────────

const HALVES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8];

const rechnen = L({
  id: "po-2-rechnen-zehnerpotenzen",
  title: "Rechnen mit Zehnerpotenzen",
  subtitle: "Vorzahlen rechnen, Exponenten zählen, Taschenrechner nutzen",
  tracks: BOTH,
  whyItMatters:
    "Wie weit kommt Licht in acht Minuten? Wie viel Speicher brauchen 2.000 Fotos? Solche Aufgaben rechnest du mit Zehnerpotenzen im Kopf überschlägig und mit dem Taschenrechner genau.",
  explanationHtml: `
    <p>Beim <strong>Malnehmen</strong> rechnest du die Vorzahlen und die Zehnerpotenzen getrennt: 10<sup>3</sup> · 10<sup>2</sup> = 1.000 · 100 = 100.000 = 10<sup>5</sup>. Die Nullen zählen sich zusammen, die Exponenten werden addiert.</p>
    <p>Beim <strong>Teilen</strong> werden die Nullen weniger: 10<sup>5</sup> : 10<sup>2</sup> = 10<sup>3</sup>, die Exponenten werden subtrahiert.</p>
    <div class="example"><strong>Beispiel:</strong> Licht legt in einer Sekunde 3 · 10<sup>8</sup> m zurück. In 500 Sekunden (5 · 10<sup>2</sup> s) sind das (3 · 5) · 10<sup>8 + 2</sup> m = 15 · 10<sup>10</sup> m = 1,5 · 10<sup>11</sup> m. Ist die Vorzahl größer als 10, schiebst du eine Stelle in den Exponenten.</div>
    <p><strong>Taschenrechner:</strong> Zehnerpotenzen gibst du mit der Taste EE, EXP oder ×10<sup>x</sup> ein: 3 EE 8 bedeutet 3 · 10<sup>8</sup>. Zeigt die Anzeige 1,5E11 oder 1,5 × 10<sup>11</sup>, ist 1,5 · 10<sup>11</sup> gemeint (manche Geräte zeigen statt des Kommas einen Punkt). Tippe nicht „· 10 EE 8“, sonst rechnest du mit 10 zu viel.</p>
    <p><strong>Addieren</strong> kannst du nur bei gleichen Exponenten direkt: 3 · 10<sup>4</sup> + 5 · 10<sup>4</sup> = 8 · 10<sup>4</sup>. Sonst schreibst du die Zahlen vorher als Dezimalzahlen.</p>
    <div class="merke"><strong>Merke:</strong> (a · 10<sup>m</sup>) · (b · 10<sup>n</sup>) = (a · b) · 10<sup>m + n</sup> und (a · 10<sup>m</sup>) : (b · 10<sup>n</sup>) = (a : b) · 10<sup>m − n</sup>. Bringe das Ergebnis danach wieder auf eine Vorzahl zwischen 1 und 10.</div>
  `,
  formulas: [
    { name: "Malnehmen", html: "(a · 10<sup>m</sup>) · (b · 10<sup>n</sup>) = (a · b) · 10<sup>m + n</sup>", quantities: "Vorzahlen malnehmen, Exponenten addieren" },
    { name: "Teilen", html: "(a · 10<sup>m</sup>) : (b · 10<sup>n</sup>) = (a : b) · 10<sup>m − n</sup>", quantities: "Vorzahlen teilen, Exponenten subtrahieren" },
  ],
  quiz: {
    question: "Was ist (4 · 10⁵) · (3 · 10⁻²)?",
    options: ["1,2 · 10⁴", "12 · 10⁻¹⁰", "7 · 10³", "1,2 · 10³"],
    correctIndex: 0,
    explanation:
      "Vorzahlen: 4 · 3 = 12. Exponenten: 5 + (−2) = 3. Also 12 · 10³ = 1,2 · 10⁴, denn 12 = 1,2 · 10.",
  },
  lab: lab(
    "power-product",
    "Der Taschenrechner",
    "Stelle zwei Zahlen in Zehnerpotenzschreibweise ein. Oben siehst du die Tasten, die du drückst, darunter die Anzeige. Auf dem Zahlenstrahl der Exponenten addieren sich die Pfeile.",
    [r("a", "Vorzahl a", 1, 9.5, 2, 0.5), r("m", "Exponent m", -6, 9, 3, 1), r("b", "Vorzahl b", 1, 9.5, 3, 0.5), r("n", "Exponent n", -6, 9, 2, 1)],
    [
      o("vorzahl", "a · b", (v) => v.a * v.b, "", 2),
      o("ergebnis", "Ergebnis", (v) => {
        const res = sci(v.a * v.b, 6);
        return sciText(res.a, v.m + v.n + res.n);
      }, "", 0, true),
    ],
    [
      { id: "eins", text: "Erzeuge als Ergebnis genau 1.", check: (v) => Math.abs(v.a * v.b * 10 ** (v.m + v.n) - 1) < 1e-9 },
      { id: "licht", text: "Licht: 3 · 10⁸ m pro Sekunde, 500 s lang (5 · 10² s). Stelle die Rechnung ein.", check: (v) => v.a === 3 && v.m === 8 && v.b === 5 && v.n === 2 },
      { id: "umrechnen", text: "Erzeuge ein Produkt, bei dem die Vorzahl 10 oder mehr wird und der Exponent deshalb um 1 wächst.", check: (v) => v.a * v.b >= 10 },
    ],
  ),
  exercises: [
    {
      id: "produkt",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.pick(HALVES);
          const b = rng.pick(HALVES);
          const m = rng.int(-5, 8);
          const n = rng.int(-5, 8);
          const res = sci(a * b, 6);
          return task(
            level,
            `Berechne (${sciHtml(a, m)}) · (${sciHtml(b, n)}). Gib das Ergebnis in Zehnerpotenzschreibweise an.`,
            sciFields(res.a, m + n + res.n),
            "Vorzahlen malnehmen, Exponenten addieren. Ist die Vorzahl 10 oder größer, schiebe eine Stelle in den Exponenten.",
            [`Vorzahlen: ${fmt(a)} · ${fmt(b)} = ${fmt(a * b)}`, `Exponenten: ${fmt(m)} + ${n < 0 ? `(${fmt(n)})` : fmt(n)} = ${fmt(m + n)}`, ...(res.n ? [`${fmt(a * b)} = ${sciHtml(res.a, 1)}, also Exponent ${fmt(m + n + 1)}`] : [])],
            `${sciHtml(res.a, m + n + res.n)}`,
            { a, b, m, n },
          );
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const c = rng.pick([2, 4, 5, 8]);
          const k = rng.int(3, 6);
          const height = fromSci(c, k - 4);
          return task(
            level,
            `Ein Blatt Papier ist 1 · ${pow10(-4)} m dick. Wie hoch ist ein Stapel aus ${sciHtml(c, k)} Blättern? Gib das Ergebnis in Metern als Dezimalzahl an.`,
            [num("Höhe:", height, "m", Math.max(0, 4 - k), { slips: [{ value: fromSci(c, k + 4), hint: "Die Dicke hat den Exponenten −4: Die Exponenten werden addiert, k + (−4)." }] })],
            "Dicke mal Anzahl: Vorzahlen malnehmen, Exponenten addieren.",
            [`(1 · ${pow10(-4)}) · (${sciHtml(c, k)}) = ${sciHtml(c, k - 4)} m`],
            `Der Stapel ist ${decimalString(c, k - 4)} m hoch.`,
            { c, k },
          );
        }
        if (kind === 1) {
          const t = rng.pick([2, 4, 5, 6, 8]);
          const k = rng.int(1, 3);
          const res = sci(3 * t, 6);
          return task(
            level,
            `Licht legt in einer Sekunde etwa 3 · ${pow10(5)} km zurück. Wie weit kommt es in ${sciHtml(t, k)} Sekunden? Gib das Ergebnis in Zehnerpotenzschreibweise in km an.`,
            sciFields(res.a, 5 + k + res.n),
            "Geschwindigkeit mal Zeit. Vorzahlen malnehmen, Exponenten addieren, Vorzahl wieder zwischen 1 und 10 bringen.",
            [`(3 · ${pow10(5)}) · (${sciHtml(t, k)}) = ${fmt(3 * t)} · ${pow10(5 + k)}`],
            `${sciHtml(res.a, 5 + k + res.n)} km`,
            { t, k },
          );
        }
        const size = rng.pick([2, 3, 4, 5]);
        const count = rng.pick([1.5, 2, 2.5, 4, 5]);
        const j = rng.int(2, 4);
        const res = sci(size * count, 6);
        return task(
          level,
          `Ein Handyfoto belegt etwa ${sciHtml(size, 6)} Byte. Wie viel Speicher belegen ${sciHtml(count, j)} Fotos? Gib das Ergebnis in Byte in Zehnerpotenzschreibweise an.`,
          sciFields(res.a, 6 + j + res.n),
          "Speicher pro Foto mal Anzahl der Fotos.",
          [`(${sciHtml(size, 6)}) · (${sciHtml(count, j)}) = ${fmt(size * count)} · ${pow10(6 + j)}`],
          `${sciHtml(res.a, 6 + j + res.n)} Byte`,
          { size, count, j },
        );
      },
    },
    {
      id: "teilen",
      make: (rng, level) => {
        if (level === 1) {
          const q = rng.pick(HALVES);
          const b = rng.pick([2, 3, 4, 5]);
          const a = q * b;
          const m = rng.int(-4, 9);
          const n = rng.int(-4, 6);
          const shownA = sci(a, 6);
          const res = sci(q, 6);
          return task(
            level,
            `Berechne (${sciHtml(shownA.a, m + shownA.n)}) : (${sciHtml(b, n)}). Gib das Ergebnis in Zehnerpotenzschreibweise an.`,
            sciFields(res.a, m - n + res.n),
            "Vorzahlen teilen, Exponenten subtrahieren. Danach die Vorzahl wieder zwischen 1 und 10 bringen.",
            [`${sciHtml(shownA.a, m + shownA.n)} = ${fmt(a)} · ${pow10(m)}`, `Vorzahlen: ${fmt(a)} : ${b} = ${fmt(q)}; Exponenten: ${fmt(m)} − ${n < 0 ? `(${fmt(n)})` : fmt(n)} = ${fmt(m - n)}`],
            `${sciHtml(res.a, m - n + res.n)}`,
            { a, b, m, n },
          );
        }
        if (rng.next() < 0.5) {
          const d = rng.pick([1.5, 3, 4.5, 6]);
          const time = (d * 1e8) / 3e5;
          return task(
            level,
            `Ein Lichtsignal läuft ${sciHtml(d, 8)} km weit. Licht legt in einer Sekunde 3 · ${pow10(5)} km zurück. Wie viele Sekunden ist es unterwegs? Wie viele Minuten sind das?`,
            [num("Zeit:", time, "s", 0, { slips: [{ value: time / 60, hint: "Das sind schon Minuten. Gefragt ist zuerst die Zeit in Sekunden." }] }), num("in Minuten:", time / 60, "min", 1)],
            "Zeit = Strecke : Geschwindigkeit. Vorzahlen teilen, Exponenten subtrahieren.",
            [`(${sciHtml(d, 8)}) : (3 · ${pow10(5)}) = ${fmt(d / 3)} · ${pow10(3)} s = ${fmt(time)} s`, `${fmt(time)} s : 60 ≈ ${fmt(time / 60, 1)} min`],
            `${fmt(time)} s, also etwa ${fmt(time / 60, 1)} min`,
            { d },
          );
        }
        const a = rng.pick([1.2, 2.4, 3.6, 4.8, 7.2]);
        const n = rng.int(-6, -2);
        const display = `${fmt(a)}E${fmt(n)}`;
        return task(
          level,
          `Die Anzeige eines Taschenrechners zeigt <code>${display}</code> (bei manchen Geräten ${sciHtml(a, n)}). Was bedeutet das als Dezimalzahl? Teile die Zahl dann durch 4 · ${pow10(n - 1)} und gib das Ergebnis an.`,
          [num("Dezimalzahl:", fromSci(a, n), "", 1 - n, { slips: [{ value: fromSci(a, -n), hint: "E mit negativer Zahl heißt: Das Komma wandert nach links." }] }), num("Ergebnis:", (a / 4) * 10, "", 2, { slips: [{ value: a / 4, hint: "Die Exponenten werden subtrahiert: n − (n − 1) = 1, also noch mal 10." }] })],
          "E steht für · 10 hoch. Beim Teilen werden die Exponenten subtrahiert.",
          [`${display} = ${sciHtml(a, n)} = ${decimalString(a, n)}`, `(${sciHtml(a, n)}) : (4 · ${pow10(n - 1)}) = ${fmt(a / 4, 2)} · ${pow10(1)}`],
          `${decimalString(a, n)}; Ergebnis ${fmt((a / 4) * 10, 2)}`,
          { a, n },
        );
      },
    },
  ],
});

// 2.3 Vorsilben von Nano bis Peta ───────────────────────────────────────────

const P = (name: string) => PREFIXES.findIndex((p) => p.name === name);
const LENGTH_PREFIXES = PREFIXES.filter((p) => p.name !== "Hekto" && p.exp !== 0);

const vorsilben = L({
  id: "po-3-vorsilben",
  title: "Vorsilben von Nano bis Peta",
  subtitle: "Kilo, Mega, Giga und Milli, Mikro, Nano",
  tracks: BOTH,
  whyItMatters:
    "Auf jedem Speicherstick, in jeder Handy-Werbung und in jedem Biologiebuch stehen Vorsilben: 256 GB, 5 MB, 100 nm. Jede Vorsilbe ist eine Zehnerpotenz. Wer sie kennt, rechnet Einheiten sicher um und vergleicht Größen.",
  explanationHtml: `
    <p>Vorsilben vor einer Einheit sind Abkürzungen für Zehnerpotenzen. Bei Kilo und darüber, bei Milli und darunter springt man in Dreierschritten:</p>
    <table class="mini">
      <tr><th>Vorsilbe</th><th>Zeichen</th><th>Faktor</th><th>Beispiel</th></tr>
      <tr><td>Peta</td><td>P</td><td>10<sup>15</sup></td><td>Datenmengen großer Rechenzentren</td></tr>
      <tr><td>Tera</td><td>T</td><td>10<sup>12</sup></td><td>1 TB Festplatte</td></tr>
      <tr><td>Giga</td><td>G</td><td>10<sup>9</sup></td><td>128 GB Speicherkarte</td></tr>
      <tr><td>Mega</td><td>M</td><td>10<sup>6</sup></td><td>4 MB Foto</td></tr>
      <tr><td>Kilo</td><td>k</td><td>10<sup>3</sup></td><td>1 km = 1.000 m</td></tr>
      <tr><td>Milli</td><td>m</td><td>10<sup>−3</sup></td><td>1 mm = 0,001 m</td></tr>
      <tr><td>Mikro</td><td>µ</td><td>10<sup>−6</sup></td><td>Bakterien: einige µm</td></tr>
      <tr><td>Nano</td><td>n</td><td>10<sup>−9</sup></td><td>Viren: etwa 100 nm</td></tr>
    </table>
    <p>Dazu gibt es Hekto (10<sup>2</sup>, wie in Hektar), Dezi (10<sup>−1</sup>) und Zenti (10<sup>−2</sup>). Bei Speicher rechnen wir wie der LehrplanPLUS mit Zehnerpotenzen: 1 kB = 1.000 Byte. Manche Programme rechnen dagegen mit 1.024 Byte.</p>
    <div class="example"><strong>Beispiel:</strong> 2,5 GB in MB: Von Giga (10<sup>9</sup>) zu Mega (10<sup>6</sup>) sind es 3 Stufen, also mal 10<sup>3</sup>: 2,5 GB = 2.500 MB.<br>
    350 nm in Metern: 350 · 10<sup>−9</sup> m = 3,5 · 10<sup>−7</sup> m.</div>
    <div class="merke"><strong>Merke:</strong> Ersetze die Vorsilbe durch ihre Zehnerpotenz. Zur kleineren Einheit wird die Maßzahl größer, zur größeren Einheit kleiner. Der Faktor ist 10 hoch (Exponent vorher − Exponent nachher).</div>
  `,
  formulas: [
    { name: "Große Vorsilben", html: `k = ${pow10(3)}, M = ${pow10(6)}, G = ${pow10(9)}, T = ${pow10(12)}, P = ${pow10(15)}`, quantities: "Kilo, Mega, Giga, Tera, Peta" },
    { name: "Kleine Vorsilben", html: `m = ${pow10(-3)}, µ = ${pow10(-6)}, n = ${pow10(-9)}`, quantities: "Milli, Mikro, Nano" },
  ],
  quiz: {
    question: "Wie viele Megabyte (MB) sind 3 Terabyte (TB)?",
    options: ["3.000.000 MB", "3.000 MB", "3.000.000.000 MB", "0,000003 MB"],
    correctIndex: 0,
    explanation:
      "Tera ist 10¹², Mega 10⁶. Der Unterschied ist 10⁶: 3 TB = 3 · 10⁶ MB = 3.000.000 MB.",
  },
  lab: lab(
    "prefix-ladder",
    "Die Vorsilben-Leiter",
    "Wähle Ausgangs- und Zieleinheit. Der Pfeil zeigt, wie viele Stufen du gehst; jede Stufe ist eine Zehnerpotenz.",
    [
      r("v", "Maßzahl", 0.5, 100, 1, 0.5),
      { type: "choice", key: "from", label: "von", options: PREFIXES.map((p, value) => ({ value, label: p.exp === 0 ? "ohne Vorsilbe" : `${p.name} (${p.symbol})` })), value: P("Kilo") },
      { type: "choice", key: "to", label: "nach", options: PREFIXES.map((p, value) => ({ value, label: p.exp === 0 ? "ohne Vorsilbe" : `${p.name} (${p.symbol})` })), value: P("(ohne)") },
      choice("unit", "Einheit", ["Meter (m)", "Byte (B)"], 0),
    ],
    [
      o("faktor", "Faktor", (v) => pow10Text(PREFIXES[v.from].exp - PREFIXES[v.to].exp)),
      o("ergebnis", "Ergebnis", (v) => `${decimalString(sci(v.v).a, sci(v.v).n + PREFIXES[v.from].exp - PREFIXES[v.to].exp)} ${PREFIXES[v.to].symbol}${v.unit === 1 ? "B" : "m"}`, "", 0, true),
    ],
    [
      { id: "speicher", text: "Rechne 2,5 GB in MB um.", check: (v) => v.v === 2.5 && v.from === P("Giga") && v.to === P("Mega") && v.unit === 1 },
      { id: "nano", text: "Wie viele Nanometer sind 1 mm? Stelle die Umrechnung ein.", check: (v) => v.v === 1 && v.from === P("Milli") && v.to === P("Nano") && v.unit === 0 },
      { id: "tera", text: "Eine Festplatte hat 4 TB. Rechne in Byte ohne Vorsilbe um.", check: (v) => v.v === 4 && v.from === P("Tera") && v.to === P("(ohne)") && v.unit === 1 },
    ],
  ),
  exercises: [
    {
      id: "umrechnen",
      make: (rng, level) => {
        if (level === 1) {
          const prefix = rng.pick(LENGTH_PREFIXES.filter((p) => p.exp <= -3 || p.exp >= 3));
          const value = rng.pick([1.5, 2, 2.5, 3.5, 4, 12, 25, 35, 45, 120, 350, 750]);
          const s = sci(value);
          const n = s.n + prefix.exp;
          return task(
            level,
            `Schreibe ${fmt(value)} ${prefix.symbol}m in Metern, in Zehnerpotenzschreibweise.`,
            sciFields(s.a, n),
            `${prefix.name} heißt ${pow10Text(prefix.exp)}. Schreibe ${fmt(value)} als Zehnerpotenz und addiere die Exponenten.`,
            [`${prefix.symbol}m = ${pow10(prefix.exp)} m`, `${fmt(value)} = ${sciHtml(s.a, s.n)}`, `${sciHtml(s.a, s.n)} · ${pow10(prefix.exp)} m`],
            `${fmt(value)} ${prefix.symbol}m = ${sciHtml(s.a, n)} m`,
            { value, exp: prefix.exp },
          );
        }
        const film = rng.pick([1.5, 2, 2.5, 4, 4.5, 6]);
        const disk = rng.pick([0.5, 1, 2, 4]);
        const count = Math.floor((disk * 1000) / film + 1e-9);
        return task(
          level,
          `Ein Film in HD-Qualität belegt etwa ${fmt(film)} GB. Wie viele solche Filme passen auf eine Festplatte mit ${fmt(disk)} TB? Rechne mit 1 TB = 1.000 GB und gib nur ganze Filme an.`,
          [num("Filme:", count, "", 0, { slips: [{ value: Math.floor(disk / film), hint: "Rechne zuerst TB in GB um: 1 TB = 1.000 GB." }, { value: Math.floor((disk * 1e6) / film), hint: "Tera und Giga liegen nur eine Dreierstufe auseinander: mal 1.000." }] })],
          "Gleiche Einheiten herstellen: TB in GB umrechnen, dann teilen und abrunden.",
          [`${fmt(disk)} TB = ${fmt(disk * 1000)} GB`, `${fmt(disk * 1000)} GB : ${fmt(film)} GB ${Number.isInteger((disk * 1000) / film) ? "=" : "≈"} ${fmt((disk * 1000) / film, 2)}`],
          `Es passen ${count} Filme darauf.`,
          { film, disk },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        if (level === 1) {
          const prefix = rng.pick(PREFIXES.filter((p) => Math.abs(p.exp) >= 3));
          const others = PREFIXES.filter((p) => Math.abs(p.exp) >= 3 && p !== prefix);
          const wrong = rng.shuffle(others).slice(0, 2);
          const options = [prefix, ...wrong].map((p) => `${p.name} (${p.symbol})`);
          const value = rng.pick([2, 3, 5, 8]);
          return task(
            level,
            `Welche Vorsilbe steht für den Faktor ${pow10(prefix.exp)}? Wie viele Einheiten ohne Vorsilbe sind ${value} ${prefix.symbol}m?`,
            [choiceField("Vorsilbe:", options, 0), num("in m:", fromSci(value, prefix.exp), "m", Math.max(0, -prefix.exp), { slips: [{ value: fromSci(value, -prefix.exp), hint: "Achte auf das Vorzeichen des Exponenten." }] })],
            "Große Vorsilben: k 10³, M 10⁶, G 10⁹, T 10¹², P 10¹⁵. Kleine: m 10⁻³, µ 10⁻⁶, n 10⁻⁹.",
            [`${pow10(prefix.exp)} heißt ${prefix.name}.`, `${value} ${prefix.symbol}m = ${value} · ${pow10(prefix.exp)} m`],
            `${prefix.name}; ${value} ${prefix.symbol}m = ${decimalString(value, prefix.exp)} m`,
            { exp: prefix.exp },
          );
        }
        const virus = rng.pick([20, 50, 80, 100, 120, 150, 200]);
        const bacterium = rng.pick([1, 2, 3, 4, 5, 6]);
        const factor = (bacterium * 1000) / virus;
        return task(
          level,
          `Ein Virus ist etwa ${virus} nm groß, ein Bakterium etwa ${bacterium} µm. Wie viel mal so groß ist das Bakterium?`,
          [num("Faktor:", factor, "", 2, { slips: [{ value: bacterium / virus, hint: "Rechne beide Längen in dieselbe Einheit um: 1 µm = 1.000 nm." }, { value: (bacterium * 1e6) / virus, hint: "Mikro und Nano liegen nur eine Dreierstufe auseinander: 1 µm = 1.000 nm." }] })],
          "Gleiche Einheit herstellen: µm in nm umrechnen, dann teilen.",
          [`${bacterium} µm = ${fmt(bacterium * 1000)} nm`, `${fmt(bacterium * 1000)} nm : ${virus} nm`],
          `Das Bakterium ist ${Number.isInteger(factor) ? "" : "etwa "}${fmt(factor, 2)}-mal so groß.`,
          { virus, bacterium },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  2,
  "Zehnerpotenzen, Rechnen mit ihnen und Vorsilben",
  "#7c3aed",
  "🔟",
  [zehnerpotenzen, rechnen, vorsilben],
);
