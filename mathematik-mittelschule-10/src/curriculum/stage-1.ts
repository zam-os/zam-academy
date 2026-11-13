import { fmt, fmtUnit, fracText, gcd, MINUS, round } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { powText, ROOT_BASES, ruleResult, RULES } from "../lab/views-potenzen";
import { choice, fractionFields, lab, makeLesson, makeStage, NAMES, output as o, range as r, task } from "./builders";
import { choiceField, numberField as num, yesNo } from "./helpers";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(1, content);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (near(value, round(value, digits)) ? "=" : "≈");
/** "x<sup>5</sup>" with a real minus in the exponent. */
const xp = (base: string, e: number) => (e === 1 ? base : `${base}<sup>${e < 0 ? MINUS + -e : e}</sup>`);
/** A root with its index: "<sup>3</sup>√8". */
const rootHtml = (n: number, a: number | string) => `${n === 2 ? "" : `<sup>${n}</sup>`}√${a}`;
function nz(rng: Rng, min: number, max: number): number {
  let k = rng.int(min, max);
  while (k === 0) k = rng.int(min, max);
  return k;
}

// 1.1 Potenzen mit beliebiger Basis ────────────────────────────────────────

const potenzen = L({
  id: "pw-1-potenzen",
  title: "Potenzen mit beliebiger Basis",
  subtitle: "Basis, Exponent und das Vorzeichen",
  whyItMatters:
    "Potenzen kürzen lange Produkte ab: Zinseszins, Flächen, Rauminhalte und Wachstum. Wer weiß, was Basis und Exponent bedeuten und wann das Ergebnis negativ wird, rechnet auch mit negativen Zahlen und Brüchen sicher.",
  explanationHtml: `
    <p>Ein Produkt aus n gleichen Faktoren schreibt man als <strong>Potenz</strong>: a · a · … · a = a<sup>n</sup>. Dabei heißt a die <strong>Basis</strong>, n der <strong>Exponent</strong> und das Ergebnis der <strong>Potenzwert</strong>. Es gilt a<sup>1</sup> = a.</p>
    <p>Die Basis kann jede Zahl sein, auch negativ, ein Bruch oder eine Dezimalzahl:</p>
    <ul>
      <li>(−2)<sup>4</sup> = (−2) · (−2) · (−2) · (−2) = 16: gerader Exponent, positiver Wert.</li>
      <li>(−2)<sup>3</sup> = −8: ungerader Exponent, negativer Wert.</li>
      <li>−2<sup>4</sup> = −(2 · 2 · 2 · 2) = −16: Ohne Klammer gehört das Minus nicht zur Basis.</li>
      <li>(2/3)<sup>3</sup> = 8/27 und 0,5<sup>2</sup> = 0,25: Bei einer Basis zwischen 0 und 1 wird der Wert kleiner.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> (−3)<sup>4</sup> = 81, −3<sup>4</sup> = −81, (−3)<sup>3</sup> = −27, (1/2)<sup>5</sup> = 1/32, 1,1<sup>2</sup> = 1,21.<br>
    Am Taschenrechner musst du eine negative Basis in Klammern eingeben: (−3) ^ 4 = 81.</div>
    <div class="merke"><strong>Merke:</strong> a<sup>n</sup> = a · a · … · a mit n Faktoren. Negative Basis: gerader Exponent ergibt einen positiven, ungerader Exponent einen negativen Wert. Achte auf Klammern: (−a)<sup>n</sup> ist etwas anderes als −a<sup>n</sup>.</div>
  `,
  formulas: [
    { name: "Potenz", html: "a<sup>n</sup> = a · a · … · a (n Faktoren)", quantities: "a Basis, n Exponent" },
    { name: "Vorzeichen", html: "(−a)<sup>n</sup> &gt; 0 für gerades n, &lt; 0 für ungerades n", quantities: "a > 0; −aⁿ = −(aⁿ)" },
  ],
  quiz: {
    question: "Welchen Wert hat −2⁴?",
    options: ["−16", "16", "−8", "8"],
    correctIndex: 0,
    explanation: "Ohne Klammer wird nur 2 hoch 4 genommen: 2⁴ = 16, davor steht das Minus: −16. (−2)⁴ wäre 16.",
  },
  lab: lab(
    "power-chain",
    "Gleiche Faktoren",
    "Stelle Basis und Exponent ein. Die Kästchen zeigen die Faktoren, darunter siehst du, wie sich der Wert Schritt für Schritt entwickelt.",
    [r("b", "Basis a", -3, 3, 2, 0.5), r("n", "Exponent n", 1, 8, 3, 1)],
    [o("wert", "Potenzwert", (v) => v.b ** v.n, "", 4, true), o("vorzeichen", "Vorzeichen", (v) => (v.b ** v.n < 0 ? "negativ" : v.b === 0 ? "null" : "positiv"))],
    [
      { id: "minus-acht", text: "Erzeuge den Potenzwert −8.", check: (v) => near(v.b ** v.n, -8) },
      { id: "positiv", text: "Erzeuge mit einer negativen Basis einen Potenzwert über 10.", check: (v) => v.b < 0 && v.b ** v.n > 10 },
      { id: "kleiner", text: "Finde eine Basis, bei der der Wert kleiner wird, wenn der Exponent wächst, und stelle mindestens Exponent 2 ein.", check: (v) => v.b > 0 && v.b < 1 && v.n >= 2 },
    ],
  ),
  exercises: [
    {
      id: "wert",
      make: (rng, level) => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          if (kind === 2) {
            const p = rng.int(1, 4);
            const q = rng.pick([2, 3, 5].filter((d) => gcd(d, p) === 1));
            const n = rng.int(2, 4);
            return task(
              level,
              `Berechne (${p}/${q})<sup>${n}</sup> und gib das Ergebnis als gekürzten Bruch an.`,
              fractionFields(p ** n, q ** n),
              "Zähler und Nenner werden jeweils n-mal malgenommen.",
              [`(${p}/${q})<sup>${n}</sup> = ${p}<sup>${n}</sup> / ${q}<sup>${n}</sup>`],
              `${fracText(p ** n, q ** n)}`,
              { p, q, n },
            );
          }
          if (kind === 3) {
            const d = rng.int(1, 9) / 10;
            const n = rng.int(2, 3);
            return task(
              level,
              `Berechne die Potenz ${fmt(d)}<sup>${n}</sup> ohne Taschenrechner.`,
              [num("Wert:", d ** n, "", 4, { slips: [{ value: d * n, hint: "Der Exponent ist kein Faktor: " + n + "-mal die Basis malnehmen." }] })],
              "a hoch n heißt n gleiche Faktoren. Eine Basis zwischen 0 und 1 macht den Wert kleiner.",
              [`${Array.from({ length: n }, () => fmt(d)).join(" · ")}`],
              `${fmt(d)}<sup>${n}</sup> = ${fmt(d ** n, 4)}`,
              { d, n },
            );
          }
          const a = rng.int(2, 5);
          const n = rng.int(2, 5);
          const value = kind === 0 ? (-a) ** n : -(a ** n);
          const shown = kind === 0 ? `(${MINUS}${a})<sup>${n}</sup>` : `${MINUS}${a}<sup>${n}</sup>`;
          return task(
            level,
            `Berechne ${shown}. Achte auf die Klammer.`,
            [num("Wert:", value, "", 0, { slips: [{ value: -value, hint: kind === 0 ? "Mit Klammer gehört das Minus zur Basis: Bei geradem Exponenten wird es positiv." : "Ohne Klammer gehört das Minus nicht zur Basis: −(a hoch n)." }, { value: (kind === 0 ? -a : a) * n, hint: "Der Exponent ist kein Faktor." }] })],
            "(−a)ⁿ: Minus gehört zur Basis. −aⁿ: erst aⁿ, dann das Minus davor.",
            [kind === 0 ? `${Array.from({ length: n }, () => `(${MINUS}${a})`).join(" · ")}` : `${MINUS}(${Array.from({ length: n }, () => a).join(" · ")})`],
            `${shown} = ${fmt(value)}`,
            { a, n, kind },
          );
        }
        const n = rng.int(5, 12);
        const mm = 0.1 * 2 ** n;
        return task(
          level,
          `Ein Blatt Papier ist 0,1 mm dick. Bei jedem Falten verdoppelt sich die Dicke. Wie dick ist das Papier nach ${n}-maligem Falten? Gib das Ergebnis in mm und in cm an.`,
          [num("Dicke:", mm, "mm", 1, { slips: [{ value: 0.1 * 2 * n, hint: "Jedes Falten verdoppelt: 2 hoch n, nicht 2 mal n." }] }), num("in cm:", mm / 10, "cm", 2)],
          "Nach n-maligem Falten: 0,1 mm · 2ⁿ.",
          [`0,1 mm · 2<sup>${n}</sup> = 0,1 mm · ${fmt(2 ** n)}`],
          `${fmtUnit(mm, "mm", 1)} = ${fmtUnit(mm / 10, "cm")}`,
          { n },
        );
      },
    },
    {
      id: "begriffe",
      make: (rng, level) => {
        if (level === 1) {
          const b = nz(rng, -5, 6);
          const n = rng.int(2, 5);
          const shown = Array.from({ length: n }, () => (b < 0 ? `(${fmt(b)})` : fmt(b))).join(" · ");
          return task(
            level,
            `Schreibe ${shown} als Potenz. Gib Basis, Exponent und Potenzwert an.`,
            [num("Basis:", b, "", 0, { slips: [{ value: -b, hint: "Das Vorzeichen gehört zur Basis, weil jeder Faktor negativ ist." }] }), num("Exponent:", n, "", 0), num("Potenzwert:", b ** n, "", 0)],
            "Die Basis ist der wiederholte Faktor, der Exponent zählt die Faktoren.",
            [`${shown} = ${powText(b, n)}`],
            `${powText(b, n)} = ${fmt(b ** n)}`,
            { b, n },
          );
        }
        const a = rng.int(2, 4);
        const n = 2 * rng.int(1, 3);
        return task(
          level,
          `Vergleiche (${MINUS}${a})<sup>${n}</sup> und ${MINUS}${a}<sup>${n}</sup>. Berechne beide Werte. Welcher ist größer?`,
          [num(`(−${a})^${n} =`, a ** n, "", 0), num(`−${a}^${n} =`, -(a ** n), "", 0), choiceField("größer ist", [`(−${a})^${n}`, `−${a}^${n}`, "beide gleich"], 0)],
          "Mit Klammer gehört das Minus zur Basis; bei geradem Exponenten wird das Ergebnis positiv.",
          [`(${MINUS}${a})<sup>${n}</sup> = ${fmt(a ** n)}`, `${MINUS}${a}<sup>${n}</sup> = ${MINUS}(${fmt(a ** n)})`],
          `${fmt(a ** n)} ist größer als ${fmt(-(a ** n))}`,
          { a, n },
        );
      },
    },
  ],
});

// 1.2 Potenzgesetze ─────────────────────────────────────────────────────────

const gesetze = L({
  id: "pw-2-potenzgesetze",
  title: "Potenzgesetze",
  subtitle: "Faktoren zählen statt auswendig lernen",
  whyItMatters:
    "Mit den Potenzgesetzen vereinfachst du lange Terme in einem Schritt: aus x³ · x⁵ wird x⁸. Sie sind die Grundlage für Wurzeln, Logarithmen und Wachstumsrechnungen.",
  explanationHtml: `
    <p>Alle Potenzgesetze lassen sich durch Zählen der Faktoren begründen:</p>
    <table class="mini">
      <tr><th>Gesetz</th><th>Begründung am Beispiel</th></tr>
      <tr><td>a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup></td><td>a<sup>2</sup> · a<sup>3</sup> = (a · a) · (a · a · a) = a<sup>5</sup></td></tr>
      <tr><td>a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup></td><td>a<sup>5</sup> : a<sup>2</sup>: zwei Faktoren kürzen sich weg, a<sup>3</sup> bleibt</td></tr>
      <tr><td>(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup></td><td>(a<sup>2</sup>)<sup>3</sup> = a<sup>2</sup> · a<sup>2</sup> · a<sup>2</sup> = a<sup>6</sup></td></tr>
      <tr><td>a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup></td><td>2<sup>3</sup> · 5<sup>3</sup> = (2 · 5)<sup>3</sup> = 1.000</td></tr>
      <tr><td>a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup></td><td>12<sup>2</sup> : 4<sup>2</sup> = 3<sup>2</sup> = 9</td></tr>
    </table>
    <p>Die ersten drei Gesetze brauchen <strong>gleiche Basis</strong>, die letzten zwei <strong>gleiche Exponenten</strong>. Für 2<sup>3</sup> + 2<sup>4</sup> gibt es kein Gesetz: Summen rechnest du aus.</p>
    <div class="example"><strong>Beispiel:</strong> x<sup>3</sup> · x<sup>5</sup> = x<sup>8</sup>. (2x<sup>3</sup>) · (3x<sup>4</sup>) = 6x<sup>7</sup>. (2x<sup>2</sup>)<sup>3</sup> = 2<sup>3</sup> · x<sup>6</sup> = 8x<sup>6</sup>. y<sup>7</sup> : y<sup>4</sup> = y<sup>3</sup>.</div>
    <div class="merke"><strong>Merke:</strong> Gleiche Basis: beim Malnehmen Exponenten addieren, beim Teilen subtrahieren, beim Potenzieren malnehmen. Gleiche Exponenten: Basen malnehmen oder teilen. Die Zahl vor x wird wie gewohnt gerechnet.</div>
  `,
  formulas: [
    { name: "Gleiche Basis", html: "a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>; a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup>", quantities: "a ≠ 0" },
    { name: "Potenz einer Potenz", html: "(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>", quantities: "Exponenten malnehmen" },
    { name: "Gleiche Exponenten", html: "a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup>; a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup>", quantities: "b ≠ 0" },
  ],
  quiz: {
    question: "Was ergibt (x³)⁴?",
    options: ["x¹²", "x⁷", "x⁸¹", "4x³"],
    correctIndex: 0,
    explanation: "Vier Gruppen zu je drei Faktoren x: 3 · 4 = 12. x⁷ wäre x³ · x⁴.",
  },
  lab: lab(
    "power-rules",
    "Faktoren zählen",
    "Wähle ein Gesetz und stelle die Exponenten ein. Jedes Kästchen ist ein Faktor: Zähle, wie viele übrig bleiben.",
    [choice("rule", "Gesetz", RULES, 0), r("m", "Exponent m", 1, 6, 2, 1), r("n", "Exponent n", 1, 6, 3, 1)],
    [o("ergebnis", "Ergebnis", (v) => ruleResult(v.rule, v.m, v.n), "", 0, true)],
    [
      { id: "zehn", text: "Erzeuge mit dem Produkt gleicher Basen den Exponenten 10.", check: (v) => v.rule === 0 && v.m + v.n === 10 },
      { id: "eins", text: "Teile so, dass sich alle Faktoren wegkürzen: a⁰ = 1.", check: (v) => v.rule === 1 && v.m === v.n },
      { id: "zwoelf", text: "Erzeuge mit der Potenz einer Potenz den Exponenten 12.", check: (v) => v.rule === 2 && v.m * v.n === 12 },
    ],
  ),
  exercises: [
    {
      id: "vereinfachen",
      make: (rng, level) => {
        if (level === 1) {
          const rule = rng.int(0, 2);
          const m = rng.int(2, 9);
          const n = rule === 1 ? rng.int(1, m - 1) : rng.int(2, 6);
          const e = rule === 0 ? m + n : rule === 1 ? m - n : m * n;
          const shown = rule === 0 ? `${xp("x", m)} · ${xp("x", n)}` : rule === 1 ? `${xp("x", m)} : ${xp("x", n)}` : `(${xp("x", m)})<sup>${n}</sup>`;
          return task(
            level,
            `Vereinfache ${shown} und gib den Exponenten des Ergebnisses x<sup>☐</sup> an.`,
            [num("Exponent:", e, "", 0, { slips: [{ value: rule === 2 ? m + n : m * n, hint: rule === 2 ? "Potenz einer Potenz: Exponenten malnehmen." : "Bei gleicher Basis werden die Exponenten addiert oder subtrahiert, nicht malgenommen." }] })],
            "aᵐ · aⁿ = aᵐ⁺ⁿ; aᵐ : aⁿ = aᵐ⁻ⁿ; (aᵐ)ⁿ = aᵐ·ⁿ",
            [rule === 0 ? `${m} + ${n} = ${e}` : rule === 1 ? `${m} − ${n} = ${e}` : `${m} · ${n} = ${e}`],
            `${shown} = ${xp("x", e)}`,
            { m, n, rule },
          );
        }
        if (rng.next() < 0.5) {
          const a = rng.int(2, 6);
          const b = rng.int(2, 6);
          const m = rng.int(1, 5);
          const n = rng.int(2, 5);
          return task(
            level,
            `Vereinfache den Term (${a}${xp("x", m)}) · (${b}${xp("x", n)}). Gib die Zahl vor x und den Exponenten an.`,
            [num("Zahl:", a * b, "", 0, { slips: [{ value: a + b, hint: "Die Zahlen vor x werden malgenommen." }] }), num("Exponent:", m + n, "", 0, { slips: [{ value: m * n, hint: "Gleiche Basis beim Malnehmen: Exponenten addieren." }] })],
            "Zahlen malnehmen, Potenzen mit gleicher Basis: Exponenten addieren.",
            [`${a} · ${b} = ${a * b}`, `${xp("x", m)} · ${xp("x", n)} = ${xp("x", m + n)}`],
            `${a * b}${xp("x", m + n)}`,
            { a, b, m, n },
          );
        }
        const a = rng.int(2, 4);
        const m = rng.int(2, 4);
        const n = rng.int(2, 3);
        return task(
          level,
          `Vereinfache den Term (${a}${xp("x", m)})<sup>${n}</sup>. Gib die Zahl vor x und den Exponenten an.`,
          [num("Zahl:", a ** n, "", 0, { slips: [{ value: a * n, hint: "Auch die Zahl wird hoch " + n + " genommen: a · a · …" }] }), num("Exponent:", m * n, "", 0, { slips: [{ value: m + n, hint: "Potenz einer Potenz: Exponenten malnehmen." }] })],
          "Jeder Faktor in der Klammer wird potenziert: (a · xᵐ)ⁿ = aⁿ · xᵐ·ⁿ.",
          [`${a}<sup>${n}</sup> = ${a ** n}`, `(${xp("x", m)})<sup>${n}</sup> = ${xp("x", m * n)}`],
          `${a ** n}${xp("x", m * n)}`,
          { a, m, n },
        );
      },
    },
    {
      id: "pruefen",
      make: (rng, level) => {
        const base = rng.pick([2, 3]);
        const m = rng.int(2, 4);
        const n = rng.int(2, 4);
        if (level === 1)
          return task(
            level,
            `Prüfe das Gesetz am Beispiel: Berechne ${base}<sup>${m}</sup> · ${base}<sup>${n}</sup> und ${base}<sup>${m + n}</sup>.`,
            [num("Produkt:", base ** m * base ** n, "", 0), num(`${base}^${m + n} =`, base ** (m + n), "", 0)],
            "Erst beide Potenzen ausrechnen und malnehmen, dann die Potenz mit der Summe der Exponenten.",
            [`${base ** m} · ${base ** n} = ${base ** (m + n)}`, `${base}<sup>${m + n}</sup> = ${base ** (m + n)}`],
            `beide ergeben ${base ** (m + n)}`,
            { base, m, n },
          );
        const name = rng.pick(NAMES);
        return task(
          level,
          `${name} rechnet ${base}<sup>${m}</sup> · ${base}<sup>${n}</sup> = ${base * base}<sup>${m + n}</sup>. Berechne den richtigen Wert. Welcher Fehler ist passiert?`,
          [num("richtiger Wert:", base ** (m + n), "", 0, { slips: [{ value: (base * base) ** (m + n), hint: "Die Basis bleibt gleich; nur die Exponenten werden addiert." }] }), choiceField("Fehler:", ["Die Basen wurden auch malgenommen.", "Die Exponenten wurden malgenommen.", "Es ist kein Fehler passiert."], 0)],
          "Bei gleicher Basis bleibt die Basis stehen; nur die Exponenten werden addiert.",
          [`richtig: ${base}<sup>${m}</sup> · ${base}<sup>${n}</sup> = ${base}<sup>${m + n}</sup> = ${base ** (m + n)}`],
          `${base ** (m + n)}; die Basen wurden fälschlich malgenommen`,
          { base, m, n },
        );
      },
    },
  ],
});

// 1.3 Negative Exponenten ──────────────────────────────────────────────────

const negativ = L({
  id: "pw-3-negative-exponenten",
  title: "Null und negative Exponenten",
  subtitle: "a⁰ = 1 und a⁻ⁿ = 1 : aⁿ",
  whyItMatters:
    "Brüche wie 1/8 oder b⁷ : c³ lassen sich als Potenzen mit negativen Exponenten schreiben. Dann gelten die Potenzgesetze weiter, und Terme werden kürzer und übersichtlicher.",
  explanationHtml: `
    <p>Geht man die Potenzleiter nach unten, wird bei jeder Stufe durch die Basis geteilt: 2<sup>3</sup> = 8, 2<sup>2</sup> = 4, 2<sup>1</sup> = 2, 2<sup>0</sup> = 1, 2<sup>−1</sup> = 1/2, 2<sup>−2</sup> = 1/4. So kommt man zu:</p>
    <ul>
      <li><strong>a<sup>0</sup> = 1</strong> für a ≠ 0, denn a<sup>3</sup> : a<sup>3</sup> = a<sup>0</sup> = 1.</li>
      <li><strong>a<sup>−n</sup> = 1 : a<sup>n</sup></strong> für a ≠ 0. Das Minus bildet den Kehrwert, die Zahl wird nicht negativ.</li>
    </ul>
    <p>Brüche schreibt man so in Potenzschreibweise: b<sup>7</sup> : c<sup>3</sup> = b<sup>7</sup> · c<sup>−3</sup>. Die Potenzgesetze gelten auch mit negativen Exponenten.</p>
    <div class="example"><strong>Beispiel:</strong> 2<sup>−3</sup> = 1/8 = 0,125. 10<sup>−3</sup> = 0,001.<br>
    x<sup>5</sup> · x<sup>−2</sup> = x<sup>3</sup>. x<sup>2</sup> : x<sup>6</sup> = x<sup>−4</sup> = 1 : x<sup>4</sup>.<br>
    (a<sup>2</sup> · b<sup>−3</sup>) : (a<sup>−1</sup> · b<sup>2</sup>) = a<sup>2 − (−1)</sup> · b<sup>−3 − 2</sup> = a<sup>3</sup> · b<sup>−5</sup>.</div>
    <div class="merke"><strong>Merke:</strong> a<sup>0</sup> = 1 und a<sup>−n</sup> = 1 : a<sup>n</sup> (a ≠ 0). Ein negativer Exponent bedeutet Kehrwert. Beim Subtrahieren negativer Exponenten auf die Vorzeichen achten: 2 − (−1) = 3.</div>
  `,
  formulas: [
    { name: "Exponent 0", html: "a<sup>0</sup> = 1", quantities: "a ≠ 0" },
    { name: "Negativer Exponent", html: "a<sup>−n</sup> = 1 : a<sup>n</sup>", quantities: "a ≠ 0; Kehrwert, nicht negativ" },
  ],
  quiz: {
    question: "Welchen Wert hat 5⁻²?",
    options: ["1/25", "−25", "−10", "25"],
    correctIndex: 0,
    explanation: "5⁻² = 1 : 5² = 1/25 = 0,04. Ein negativer Exponent bildet den Kehrwert; er macht die Zahl nicht negativ.",
  },
  lab: lab(
    "power-ladder",
    "Die Potenzleiter",
    "Wähle eine Basis und gehe mit dem Exponenten die Leiter hinunter. Jede Stufe nach unten heißt: durch die Basis teilen.",
    [{ type: "choice", key: "base", label: "Basis", options: [2, 3, 10].map((value) => ({ value, label: String(value) })), value: 2 }, r("e", "Exponent", -4, 4, 2, 1)],
    [o("wert", "Wert", (v) => (v.e < 0 ? `1/${fmt(v.base ** -v.e)} = ${fmt(v.base ** v.e, 6)}` : fmt(v.base ** v.e)), "", 0, true)],
    [
      { id: "eins", text: "Finde den Exponenten, bei dem der Wert 1 ist.", check: (v) => v.e === 0 },
      { id: "achtel", text: "Stelle ein Achtel als Potenz von 2 ein.", check: (v) => v.base === 2 && v.e === -3 },
      { id: "tausendstel", text: "Stelle ein Tausendstel als Zehnerpotenz ein.", check: (v) => v.base === 10 && v.e === -3 },
    ],
  ),
  exercises: [
    {
      id: "umschreiben",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(2, 6);
          const n = rng.int(1, 4);
          return task(
            level,
            `Schreibe ${a}<sup>${MINUS}${n}</sup> als gekürzten Bruch.`,
            fractionFields(1, a ** n),
            "a⁻ⁿ = 1 : aⁿ",
            [`${a}<sup>${MINUS}${n}</sup> = 1 : ${a}<sup>${n}</sup> = 1/${a ** n}`],
            `1/${a ** n}`,
            { a, n },
          );
        }
        const p = rng.int(2, 9);
        const q = rng.int(2, 9);
        return task(
          level,
          `Schreibe den Bruch b<sup>${p}</sup> : c<sup>${q}</sup> ohne Bruchstrich als Produkt. Welchen Exponenten bekommt c? Vereinfache außerdem ${xp("x", p)} · ${xp("x", -q)}.`,
          [num("Exponent von c:", -q, "", 0, { slips: [{ value: q, hint: "Was im Nenner steht, bekommt einen negativen Exponenten." }] }), num("Exponent von x:", p - q, "", 0, { slips: [{ value: p + q, hint: "x hoch minus " + q + ": die Exponenten werden addiert, also " + p + " + (−" + q + ")." }] })],
          "1 : cⁿ = c⁻ⁿ. Gleiche Basis beim Malnehmen: Exponenten addieren, auch negative.",
          [`b<sup>${p}</sup> : c<sup>${q}</sup> = b<sup>${p}</sup> · c<sup>${MINUS}${q}</sup>`, `${xp("x", p)} · ${xp("x", -q)} = x<sup>${p} + (${MINUS}${q})</sup> = ${xp("x", p - q)}`],
          `c<sup>${MINUS}${q}</sup> und ${xp("x", p - q)}`,
          { p, q },
        );
      },
    },
    {
      id: "rechnen",
      make: (rng, level) => {
        if (level === 1) {
          const m = nz(rng, -5, 5);
          const n = nz(rng, -5, 5);
          const e = m + n;
          return task(
            level,
            `Berechne 2<sup>${m < 0 ? MINUS + -m : m}</sup> · 2<sup>${n < 0 ? MINUS + -n : n}</sup>. Gib den Exponenten und den Wert an.`,
            [num("Exponent:", e, "", 0), num("Wert:", 2 ** e, "", 4)],
            "Exponenten addieren, dann ausrechnen. Ein negativer Exponent heißt Kehrwert.",
            [`Exponent: ${fmt(m)} + ${n < 0 ? `(${fmt(n)})` : fmt(n)} = ${fmt(e)}`, `2<sup>${e < 0 ? MINUS + -e : e}</sup> = ${e < 0 ? `1/${2 ** -e} = ` : ""}${fmt(2 ** e, 4)}`],
            `2<sup>${e < 0 ? MINUS + -e : e}</sup> = ${fmt(2 ** e, 4)}`,
            { m, n },
          );
        }
        const a1 = nz(rng, -3, 4);
        const b1 = nz(rng, -4, 3);
        const a2 = nz(rng, -3, 3);
        const b2 = nz(rng, -3, 4);
        return task(
          level,
          `Vereinfache (${xp("a", a1)} · ${xp("b", b1)}) : (${xp("a", a2)} · ${xp("b", b2)}). Gib die Exponenten von a und b an.`,
          [num("Exponent von a:", a1 - a2, "", 0, { slips: [{ value: a1 + a2, hint: "Beim Teilen werden die Exponenten subtrahiert." }] }), num("Exponent von b:", b1 - b2, "", 0, { slips: [{ value: b1 + b2, hint: "Beim Teilen werden die Exponenten subtrahiert." }] })],
          "Gleiche Basen getrennt behandeln: aᵐ : aⁿ = aᵐ⁻ⁿ. Minus mal Minus beachten.",
          [`a: ${fmt(a1)} − ${a2 < 0 ? `(${fmt(a2)})` : fmt(a2)} = ${fmt(a1 - a2)}`, `b: ${fmt(b1)} − ${b2 < 0 ? `(${fmt(b2)})` : fmt(b2)} = ${fmt(b1 - b2)}`],
          [a1 - a2 ? xp("a", a1 - a2) : "", b1 - b2 ? xp("b", b1 - b2) : ""].filter(Boolean).join(" · ") || "1",
          { a1, b1, a2, b2 },
        );
      },
    },
  ],
});

// 1.4 Die n-te Wurzel ──────────────────────────────────────────────────────

const wurzeln = L({
  id: "pw-4-wurzeln",
  title: "Die n-te Wurzel",
  subtitle: "Radizieren macht das Potenzieren rückgängig",
  whyItMatters:
    "Wie lang ist die Kante eines Würfels mit 1.000 cm³? Welcher Faktor ergibt in fünf Schritten das Doppelte? Solche Fragen drehen eine Potenz um. Die Antwort ist eine n-te Wurzel.",
  explanationHtml: `
    <p>Die <strong>n-te Wurzel</strong> aus einer Zahl a ≥ 0 ist die Zahl b ≥ 0, die hoch n genommen a ergibt:</p>
    <p class="formula-line"><sup>n</sup>√a = b, weil b<sup>n</sup> = a</p>
    <p>Radizieren (Wurzelziehen) ist die Umkehrung des Potenzierens. Die Quadratwurzel kennst du schon: √49 = 7, weil 7<sup>2</sup> = 49. Die Zahl unter der Wurzel heißt <strong>Radikand</strong>, n der <strong>Wurzelexponent</strong>.</p>
    <div class="example"><strong>Beispiel:</strong> <sup>3</sup>√64 = 4, denn 4<sup>3</sup> = 64. <sup>5</sup>√32 = 2, denn 2<sup>5</sup> = 32. <sup>4</sup>√81 = 3.<br>
    Ein würfelförmiger Tank fasst 2 m³. Seine Kante ist <sup>3</sup>√2 ≈ 1,26 m. Taschenrechner: Taste <sup>x</sup>√ oder 2 ^ (1 : 3).</div>
    <p>Aus einer negativen Zahl ziehen wir keine Wurzel, denn bei geradem n gibt es kein Ergebnis: Kein Quadrat ist negativ.</p>
    <div class="merke"><strong>Merke:</strong> <sup>n</sup>√a = b genau dann, wenn b<sup>n</sup> = a (a, b ≥ 0). Probe: das Ergebnis hoch n nehmen.</div>
  `,
  formulas: [
    { name: "n-te Wurzel", html: "<sup>n</sup>√a = b ⇔ b<sup>n</sup> = a", quantities: "a ≥ 0 Radikand, n Wurzelexponent" },
  ],
  quiz: {
    question: "Welchen Wert hat ⁴√16?",
    options: ["2", "4", "8", "64"],
    correctIndex: 0,
    explanation: "2⁴ = 2 · 2 · 2 · 2 = 16, also ist ⁴√16 = 2. 4 wäre die Quadratwurzel, 4 = √16.",
  },
  lab: lab(
    "root-inverse",
    "Hin und zurück",
    "Wähle eine Zahl b und einen Exponenten n. Potenzieren führt nach rechts, Radizieren wieder zurück. Bei n = 2 siehst du ein Quadrat, bei n = 3 einen Würfel.",
    [r("n", "Exponent n", 2, 6, 2, 1), r("b", "Zahl b", 0, 5, 3, 0.5)],
    [o("a", "bⁿ", (v) => v.b ** v.n, "", 4, true)],
    [
      { id: "kubik", text: "Zeige die dritte Wurzel aus 64.", check: (v) => v.n === 3 && v.b === 4 },
      { id: "fuenfte", text: "Zeige die fünfte Wurzel aus 32.", check: (v) => v.n === 5 && v.b === 2 },
      { id: "einundachtzig", text: "Finde n > 2 und b mit bⁿ = 81.", check: (v) => v.n > 2 && near(v.b ** v.n, 81) },
    ],
  ),
  exercises: [
    {
      id: "wurzel",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(2, 6);
          const b = rng.int(2, n <= 3 ? 10 : n === 4 ? 5 : 3);
          return task(
            level,
            `Berechne ${rootHtml(n, b ** n)} ohne Taschenrechner und mache die Probe.`,
            [num("Wurzel:", b, "", 2, { slips: [{ value: (b ** n) / n, hint: "Die Wurzel ist kein Teilen durch n: Gesucht ist die Zahl, die hoch " + n + " den Radikanden ergibt." }] })],
            "Welche Zahl hoch n ergibt den Radikanden?",
            [`Probe: ${b}<sup>${n}</sup> = ${b ** n}`],
            `${rootHtml(n, b ** n)} = ${b}`,
            { n, b },
          );
        }
        const V = rng.pick([2, 3, 5, 10, 20, 50]);
        const edge = Math.cbrt(V);
        const area = rng.pick([50, 72, 120, 200]);
        return task(
          level,
          `Ein würfelförmiger Wassertank fasst ${V} m³. Wie lang ist eine Kante? Ein quadratisches Grundstück hat ${area} m². Wie lang ist eine Seite?`,
          [num("Kante:", edge, "m", 2, { slips: [{ value: V / 3, hint: "Die Kante ist die dritte Wurzel aus dem Volumen, nicht ein Drittel." }, { value: Math.sqrt(V), hint: "Beim Würfel ist es die dritte Wurzel." }] }), num("Seite:", Math.sqrt(area), "m", 2, { slips: [{ value: area / 2, hint: "Die Seite ist die Quadratwurzel aus der Fläche." }] })],
          "Würfel: V = a³, also a = ³√V. Quadrat: A = a², also a = √A.",
          [`a = <sup>3</sup>√${V} ≈ ${fmt(edge, 2)} m`, `a = √${area} ≈ ${fmt(Math.sqrt(area), 2)} m`],
          `Kante ≈ ${fmtUnit(edge, "m")}, Seite ≈ ${fmtUnit(Math.sqrt(area), "m")}`,
          { V, area },
        );
      },
    },
    {
      id: "probe",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(3, 5);
          const b = rng.int(2, 4);
          const claim = b + rng.pick([0, 0, 1]);
          const right = claim === b;
          return task(
            level,
            `Stimmt ${rootHtml(n, b ** n)} = ${claim}? Mache die Probe: Berechne ${claim}<sup>${n}</sup>.`,
            [num(`${claim}^${n} =`, claim ** n, "", 0), yesNo("stimmt es?", right)],
            "Probe: das angebliche Ergebnis hoch n nehmen und mit dem Radikanden vergleichen.",
            [`${claim}<sup>${n}</sup> = ${claim ** n}`, right ? `= ${b ** n}, stimmt.` : `≠ ${b ** n}, stimmt nicht.`],
            right ? "Ja, die Probe geht auf." : `Nein: richtig ist ${rootHtml(n, b ** n)} = ${b}.`,
            { n, b, claim },
          );
        }
        const b = rng.int(2, 5);
        const n = 2 * rng.int(1, 2);
        return task(
          level,
          `Berechne ${rootHtml(n + 1, b ** (n + 1))}. Warum gibt es dagegen keine Zahl, die man für ${rootHtml(n, `(${MINUS}${b ** n})`)} einsetzen kann?`,
          [num("Wert:", b, "", 0), choiceField("Grund:", [`Jede Zahl hoch ${n} ist positiv oder 0.`, `Weil ${b ** n} keine Quadratzahl ist.`, "Weil man nur aus Primzahlen Wurzeln zieht."], 0)],
          "Probe mit der Umkehrung: b hoch n. Bei geradem n wird jedes Ergebnis positiv oder 0.",
          [`${b}<sup>${n + 1}</sup> = ${b ** (n + 1)}`, `Für jede Zahl b gilt b<sup>${n}</sup> ≥ 0, also nie −${b ** n}.`],
          `${b}; eine gerade Potenz ist nie negativ`,
          { b, n },
        );
      },
    },
  ],
});

// 1.5 Wurzeln als Potenzen ────────────────────────────────────────────────

const wurzelPotenz = L({
  id: "pw-5-wurzelgesetze",
  title: "Wurzeln als Potenzen und Wurzelgesetze",
  subtitle: "ⁿ√a = a^(1/n): Nenner heißt Wurzel",
  whyItMatters:
    "Schreibst du Wurzeln als Potenzen, brauchst du keine neuen Regeln: Die Wurzelgesetze sind die bekannten Potenzgesetze. So vereinfachst du Terme mit Wurzeln und rechnest sie am Taschenrechner mit der Potenztaste.",
  explanationHtml: `
    <p>Damit die Potenzgesetze weiter gelten, muss (a<sup>1/n</sup>)<sup>n</sup> = a<sup>1</sup> = a sein. Also ist a<sup>1/n</sup> die n-te Wurzel:</p>
    <p class="formula-line"><sup>n</sup>√a = a<sup>1/n</sup> und <sup>n</sup>√(a<sup>m</sup>) = a<sup>m/n</sup></p>
    <p>Der <strong>Nenner</strong> des Exponenten sagt, welche Wurzel gezogen wird, der <strong>Zähler</strong>, womit potenziert wird. Ein Bruch 1/n mit dem Zähler 1 heißt Stammbruch.</p>
    <p>Die <strong>Wurzelgesetze</strong> sind Potenzgesetze in anderer Schreibweise:</p>
    <ul>
      <li><sup>n</sup>√a · <sup>n</sup>√b = <sup>n</sup>√(a · b), aus a<sup>1/n</sup> · b<sup>1/n</sup> = (a · b)<sup>1/n</sup>.</li>
      <li><sup>n</sup>√a : <sup>n</sup>√b = <sup>n</sup>√(a : b), aus a<sup>1/n</sup> : b<sup>1/n</sup> = (a : b)<sup>1/n</sup>.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> 8<sup>2/3</sup> = (<sup>3</sup>√8)<sup>2</sup> = 2<sup>2</sup> = 4. 16<sup>3/4</sup> = (<sup>4</sup>√16)<sup>3</sup> = 2<sup>3</sup> = 8.<br>
    √2 · √8 = √16 = 4. <sup>3</sup>√54 : <sup>3</sup>√2 = <sup>3</sup>√27 = 3. <sup>4</sup>√(x<sup>3</sup>) = x<sup>3/4</sup>.</div>
    <div class="merke"><strong>Merke:</strong> <sup>n</sup>√(a<sup>m</sup>) = a<sup>m/n</sup> (a ≥ 0): Nenner heißt Wurzel, Zähler heißt Potenz. Wurzeln mit gleichem Wurzelexponenten darf man zusammen malnehmen oder teilen, aber nicht addieren.</div>
  `,
  formulas: [
    { name: "Wurzel als Potenz", html: "<sup>n</sup>√(a<sup>m</sup>) = a<sup>m/n</sup>", quantities: "a ≥ 0; Nenner = Wurzel, Zähler = Potenz" },
    { name: "Wurzelgesetze", html: "<sup>n</sup>√a · <sup>n</sup>√b = <sup>n</sup>√(ab); <sup>n</sup>√a : <sup>n</sup>√b = <sup>n</sup>√(a : b)", quantities: "aus den Potenzgesetzen mit gleichem Exponenten" },
  ],
  quiz: {
    question: "Wie schreibt man ⁵√(x²) als Potenz?",
    options: ["x^(2/5)", "x^(5/2)", "x^(2 · 5)", "x^(2 − 5)"],
    correctIndex: 0,
    explanation: "Der Wurzelexponent 5 kommt in den Nenner, der Exponent 2 in den Zähler: x^(2/5).",
  },
  lab: lab(
    "root-exponent",
    "Zähler und Nenner",
    "Wähle eine Basis und einen Bruch im Exponenten. Links steht die Potenz, rechts dieselbe Zahl als Wurzel.",
    [{ type: "choice", key: "a", label: "Basis a", options: ROOT_BASES.map((value) => ({ value, label: String(value) })), value: 8 }, r("m", "Zähler m", 1, 4, 1, 1), r("n", "Nenner n", 2, 5, 2, 1)],
    [o("wert", "a^(m/n)", (v) => v.a ** (v.m / v.n), "", 4, true)],
    [
      { id: "vier", text: "Zeige: 8 hoch 2/3 ergibt 4.", check: (v) => v.a === 8 && v.m === 2 && v.n === 3 },
      { id: "acht", text: "Erzeuge den Wert 8 mit der Basis 16.", check: (v) => v.a === 16 && near(16 ** (v.m / v.n), 8) },
      { id: "fuenfte", text: "Finde mit dem Nenner 5 eine Einstellung, die eine ganze Zahl ergibt.", check: (v) => v.n === 5 && near(v.a ** (v.m / v.n), Math.round(v.a ** (v.m / v.n))) },
    ],
  ),
  exercises: [
    {
      id: "umschreiben",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.int(2, 6);
          let m = rng.int(1, 7);
          if (m === n) m += 1;
          return task(
            level,
            `Schreibe ${rootHtml(n, `(${xp("x", m)})`)} als Potenz x<sup>m/n</sup> und kürze den Exponenten.`,
            fractionFields(m, n, "Exponent: "),
            "Wurzelexponent in den Nenner, Potenzexponent in den Zähler.",
            [`${rootHtml(n, `(${xp("x", m)})`)} = x<sup>${m}/${n}</sup>`],
            `x<sup>${fracText(m, n)}</sup>`,
            { m, n },
          );
        }
        const cases: Array<[number, number, number]> = [[8, 2, 3], [27, 2, 3], [16, 3, 4], [32, 2, 5], [81, 3, 4], [125, 2, 3], [64, 5, 6], [9, 3, 2], [4, 5, 2]];
        const [a, m, n] = rng.pick(cases);
        const value = Math.round(a ** (m / n));
        return task(
          level,
          `Berechne ${a}<sup>${m}/${n}</sup> ohne Taschenrechner. Schreibe dazu zuerst als Wurzel.`,
          [num("Wert:", value, "", 0, { slips: [{ value: (a * m) / n, hint: "Der Bruch im Exponenten ist kein Faktor: erst die " + n + ". Wurzel, dann hoch " + m + "." }] })],
          "aᵐ/ⁿ = (ⁿ√a)ᵐ: erst die Wurzel ziehen, dann potenzieren.",
          [`${a}<sup>${m}/${n}</sup> = (${rootHtml(n, a)})<sup>${m}</sup> = ${Math.round(a ** (1 / n))}<sup>${m}</sup>`],
          `${a}<sup>${m}/${n}</sup> = ${value}`,
          { a, m, n },
        );
      },
    },
    {
      id: "gesetze",
      make: (rng, level) => {
        if (level === 1) {
          // √a · √(a · m²) = a · m: both radicands whole, the product a square.
          const a = rng.pick([2, 3, 5, 6, 7]);
          const k = a * rng.int(1, 6);
          const b = (k * k) / a;
          return task(
            level,
            `Berechne √${fmt(a)} · √${fmt(b, 4)} mit einem Wurzelgesetz.`,
            [num("Wert:", k, "", 2, { slips: [{ value: Math.sqrt(a) + Math.sqrt(b), hint: "Wurzeln werden zusammen malgenommen, nicht addiert: √a · √b = √(a · b)." }] })],
            "√a · √b = √(a · b)",
            [`√${fmt(a)} · √${fmt(b, 4)} = √(${fmt(a)} · ${fmt(b, 4)}) = √${k * k}`],
            `= ${k}`,
            { a, k },
          );
        }
        const k = rng.int(2, 5);
        const b = rng.pick([2, 3, 4]);
        const a = k ** 3 * b;
        return task(
          level,
          `Berechne ${rootHtml(3, a)} : ${rootHtml(3, b)}. Welches Potenzgesetz steckt hinter der Rechnung?`,
          [num("Wert:", k, "", 2), choiceField("Gesetz:", ["aⁿ : bⁿ = (a : b)ⁿ", "aᵐ : aⁿ = aᵐ⁻ⁿ", "(aᵐ)ⁿ = aᵐ·ⁿ"], 0)],
          "Gleicher Wurzelexponent: unter einer Wurzel zusammenfassen, das ist aⁿ : bⁿ = (a : b)ⁿ mit n = 1/3.",
          [`${rootHtml(3, a)} : ${rootHtml(3, b)} = ${rootHtml(3, `(${a} : ${b})`)} = ${rootHtml(3, k ** 3)}`],
          `= ${k}`,
          { a, b },
        );
      },
    },
  ],
});

// 1.6 Der Logarithmus ──────────────────────────────────────────────────────

const logarithmus = L({
  id: "pw-6-logarithmus",
  title: "Der Logarithmus",
  subtitle: "Den Exponenten finden",
  whyItMatters:
    "Wann hat sich ein Kapital verdoppelt? Wie viele Bit braucht man für eine Million Zahlen? Hier ist der Exponent gesucht. Der Logarithmus liefert ihn, mit dem Taschenrechner in einem Schritt.",
  explanationHtml: `
    <p>Bei b<sup>x</sup> = a sind Basis b und Potenzwert a bekannt, gesucht ist der Exponent x. Er heißt <strong>Logarithmus von a zur Basis b</strong>:</p>
    <p class="formula-line">x = log<sub>b</sub>(a) genau dann, wenn b<sup>x</sup> = a (a, b &gt; 0, b ≠ 1)</p>
    <p>Der Logarithmus beantwortet also: „b hoch wie viel ergibt a?“ Den Zehnerlogarithmus log<sub>10</sub> schreibt man lg; der Taschenrechner hat dafür die Taste log.</p>
    <div class="example"><strong>Beispiel:</strong> log<sub>2</sub>(8) = 3, denn 2<sup>3</sup> = 8. lg(1.000) = 3. lg(0,01) = −2, denn 10<sup>−2</sup> = 0,01.<br>
    Mit dem Taschenrechner: log<sub>b</sub>(a) = lg(a) : lg(b). Aus 2<sup>x</sup> = 50 folgt x = lg(50) : lg(2) ≈ 5,64.<br>
    Ein Kapital wächst um 5 % pro Jahr. Es hat sich verdoppelt, wenn 1,05<sup>x</sup> = 2 ist: x = lg(2) : lg(1,05) ≈ 14,2, also nach 15 Jahren.</div>
    <div class="merke"><strong>Merke:</strong> Der Logarithmus ist ein Exponent: log<sub>b</sub>(a) = x ⇔ b<sup>x</sup> = a. Am Taschenrechner: log<sub>b</sub>(a) = lg(a) : lg(b). Probe: b hoch Ergebnis nehmen.</div>
  `,
  formulas: [
    { name: "Logarithmus", html: "log<sub>b</sub>(a) = x ⇔ b<sup>x</sup> = a", quantities: "a, b > 0, b ≠ 1" },
    { name: "Taschenrechner", html: "log<sub>b</sub>(a) = lg(a) : lg(b)", quantities: "lg = Logarithmus zur Basis 10" },
  ],
  quiz: {
    question: "Welchen Wert hat log₃(81)?",
    options: ["4", "27", "3", "9"],
    correctIndex: 0,
    explanation: "3⁴ = 81, also ist der gesuchte Exponent 4. 27 wäre 81 : 3.",
  },
  lab: lab(
    "log-curve",
    "Den Exponenten suchen",
    "Die Kurve zeigt y = bˣ. Ziehe den Punkt nach rechts oder links, bis der gewünschte Wert erreicht ist: Der Exponent, den du dann abliest, ist der Logarithmus.",
    [{ type: "choice", key: "base", label: "Basis b", options: [2, 3, 10].map((value) => ({ value, label: String(value) })), value: 2 }, r("x", "Exponent x", -3, 10, 1, 0.5)],
    [o("wert", "bˣ", (v) => v.base ** v.x, "", 4, true)],
    [
      { id: "vierundsechzig", text: "Finde log₂(64): Stelle den Exponenten ein, bei dem 2ˣ = 64 ist.", check: (v) => v.base === 2 && v.x === 6 },
      { id: "hundertstel", text: "Finde lg(0,01).", check: (v) => v.base === 10 && v.x === -2 },
      { id: "einundachtzig", text: "Finde log₃(81).", check: (v) => v.base === 3 && v.x === 4 },
    ],
  ),
  exercises: [
    {
      id: "logarithmus",
      make: (rng, level) => {
        if (level === 1) {
          const b = rng.pick([2, 3, 5, 10]);
          const x = b === 10 ? rng.int(-3, 6) : rng.int(-2, b === 2 ? 10 : 5);
          const a = b ** x;
          const shownA = x < 0 ? `1/${fmt(b ** -x)}` : fmt(a);
          return task(
            level,
            `Bestimme log<sub>${b}</sub>(${shownA}) ohne Taschenrechner und mache die Probe.`,
            [num("Exponent:", x, "", 0, { slips: [{ value: a / b, hint: "Der Logarithmus ist ein Exponent, kein Quotient." }, { value: -x, hint: "Ein Bruch 1 durch eine Potenz hat einen negativen Exponenten." }] })],
            `Frage: ${b} hoch wie viel ergibt ${shownA}?`,
            [`${b}<sup>${x < 0 ? MINUS + -x : x}</sup> = ${shownA}`],
            `log<sub>${b}</sub>(${shownA}) = ${fmt(x)}`,
            { b, x },
          );
        }
        const p = rng.pick([2, 3, 4, 5, 6, 8]);
        const f = rng.pick([2, 3]);
        const x = Math.log10(f) / Math.log10(1 + p / 100);
        return task(
          level,
          `Ein Kapital wächst mit Zinseszins jährlich um ${p} %. Nach wie vielen Jahren hat es sich ${f === 2 ? "verdoppelt" : "verdreifacht"}? Löse ${fmt(1 + p / 100)}<sup>x</sup> = ${f} mit dem Logarithmus und runde auf volle Jahre auf.`,
          [num("x =", x, "", 2, { slips: [{ value: (f - 1) * 100 / p, hint: "Das wäre ohne Zinseszins. Nutze x = lg(" + f + ") : lg(" + fmt(1 + p / 100) + ")." }] }), num("Jahre:", Math.ceil(x), "", 0)],
          "x = lg(Faktor) : lg(Wachstumsfaktor)",
          [`x = lg(${f}) : lg(${fmt(1 + p / 100)}) ≈ ${fmt(x, 2)}`, `aufgerundet: ${Math.ceil(x)} Jahre`],
          `x ≈ ${fmt(x, 2)}, also nach ${Math.ceil(x)} Jahren`,
          { p, f },
        );
      },
    },
    {
      id: "anwenden",
      make: (rng, level) => {
        if (level === 1) {
          const b = rng.pick([2, 3, 7]);
          const a = rng.pick([20, 50, 100, 300, 1000]);
          const x = Math.log10(a) / Math.log10(b);
          return task(
            level,
            `Löse ${b}<sup>x</sup> = ${a} mit dem Taschenrechner.`,
            [num("x =", x, "", 2, { slips: [{ value: a / b, hint: "Gesucht ist der Exponent: x = lg(" + a + ") : lg(" + b + ")." }, { value: Math.log10(b) / Math.log10(a), hint: "Umgedreht: lg des Potenzwerts durch lg der Basis." }] })],
            "x = log_b(a) = lg(a) : lg(b)",
            [`x = lg(${a}) : lg(${b}) = ${fmt(Math.log10(a), 4)} : ${fmt(Math.log10(b), 4)}`, `Probe: ${b}<sup>${fmt(x, 2)}</sup> ≈ ${fmt(b ** round(x, 2), 1)}`],
            `x ${eq(x)} ${fmt(x, 2)}`,
            { b, a },
          );
        }
        const target = rng.pick([1000, 10000, 100000, 1000000]);
        const bits = Math.ceil(Math.log2(target));
        return task(
          level,
          `Mit n Bit kann ein Computer 2<sup>n</sup> verschiedene Zahlen speichern. Wie viele Bit braucht man mindestens für ${fmt(target)} verschiedene Zahlen? Berechne zuerst log<sub>2</sub>(${fmt(target)}).`,
          [num("log₂ =", Math.log2(target), "", 2), num("Bit:", bits, "", 0, { slips: [{ value: Math.floor(Math.log2(target)), hint: "Abgerundet reicht es nicht: aufrunden." }] })],
          "log₂(a) = lg(a) : lg(2), dann auf eine ganze Zahl aufrunden.",
          [`log<sub>2</sub>(${fmt(target)}) = lg(${fmt(target)}) : lg(2) ≈ ${fmt(Math.log2(target), 2)}`, `2<sup>${bits}</sup> = ${fmt(2 ** bits)} ≥ ${fmt(target)}`],
          `${bits} Bit`,
          { target },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  1,
  "Potenzen, Potenzgesetze, Wurzeln und Logarithmen",
  "#7c3aed",
  "xⁿ",
  [potenzen, gesetze, negativ, wurzeln, wurzelPotenz, logarithmus],
);

