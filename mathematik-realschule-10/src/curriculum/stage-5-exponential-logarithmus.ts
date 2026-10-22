import { fmt, fmtUnit, frac, fracHtml, paren, sqrtHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  characteristicTime,
  expHtml,
  expInverseText,
  expText,
  imageEquation,
  logBase,
  logHtml,
  logInverseText,
  logName,
  logNameHtml,
  logText,
  MAP_NAMES,
  MAP_ORIGINALS,
  mapPointRule,
  mapRule,
  plusConst,
  powText,
  shiftedArg,
} from "../lab/views-exponential-logarithmus";
import type { ExerciseGenerator, ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-5-exponential-logarithmus";
const LEHRPLAN_BOTH = "M10 LB 4 (I) · M10 LB 3 (II/III): Exponentialfunktionen";
const lg = Math.log10;

type Slip = { value: number; hint: string };

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/**
 * True when an answer sits at −3,5: there the shared task test's value far
 * off, 3 · a + 7, would hit the answer itself. Generators draw again then.
 */
function nearTrap(...answers: number[]): boolean {
  return answers.some((answer) => Math.abs(answer + 3.5) < 0.05);
}

/** A given value with up to four decimals. */
const f4 = (value: number) => fmt(value, 4);

/** base^exponent in HTML. */
function pow(base: number | string, exponent: number | string): string {
  return `${typeof base === "number" ? fmt(base) : base}<sup>${typeof exponent === "number" ? fmt(exponent) : exponent}</sup>`;
}

/** "−" or "+" and the absolute value, for a term that follows: "− 4", "+ 2". */
function signed(value: number, digits = 2): string {
  return `${value < 0 ? "−" : "+"} ${fmt(Math.abs(value), digits)}`;
}

// 5.1 Exponentialfunktionen y = k · aˣ ──────────────────────────────────────

function expEquation(v: LabValues): string {
  if (v.k === 0) return "y = 0 (k = 0: keine Exponentialfunktion)";
  if (v.a === 1) return `y = ${fmt(v.k)} (a = 1: konstant, keine Exponentialfunktion)`;
  return `y = ${expText(v.k, v.a)}`;
}

function expTrend(v: LabValues): string {
  if (v.k === 0 || v.a === 1) return "konstant";
  const rising = v.k * (v.a - 1) > 0;
  if (v.k > 0) return rising ? "steigt: exponentielles Wachstum" : "fällt: exponentielle Abnahme";
  return rising ? "steigt (an der x-Achse gespiegelte Abnahme)" : "fällt (an der x-Achse gespiegeltes Wachstum)";
}

const TYPES = ["linear", "quadratisch", "exponentiell"];

const funktionswert: ExerciseGenerator = {
  id: "funktionswert",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const k = rng.pick([0.5, 1.5, 2, 3, 4, 5]);
      const a = rng.pick([2, 3, 4, 0.5, 1.5, 2.5]);
      const x0 = rng.pick([-2, -1, 2, 3]);
      const power = a ** x0;
      const y = k * power;
      const slips: Slip[] = [
        { value: (k * a) ** x0, hint: "Erst potenzieren, dann mit k malnehmen: k · aˣ ist nicht (k · a)ˣ." },
        { value: k * a * x0, hint: "aˣ heißt: a so oft mit sich selbst malnehmen, wie x angibt, nicht a · x." },
      ];
      if (x0 < 0) slips.push({ value: -k * a ** -x0, hint: "Eine negative Hochzahl macht den Wert nicht negativ: a⁻ⁿ = 1 : aⁿ." });
      return {
        prompt: `Berechne für die Exponentialfunktion f(x) = ${expHtml(k, a)} den Funktionswert f(${fmt(x0)}). Runde, wo nötig, auf drei Nachkommastellen.`,
        given: [`f(x) = ${expHtml(k, a)}`, `x = ${fmt(x0)}`],
        formulaHint: "Erst die Potenz a<sup>x</sup> berechnen, dann mit k malnehmen; a<sup>−n</sup> = 1 : a<sup>n</sup>",
        fields: [numberField(`f(${fmt(x0)}) =`, y, "", 3, { slips })],
        steps: [
          `${pow(a, x0)} = ${x0 < 0 ? `1 : ${pow(a, -x0)} = ` : ""}${f4(power)}`,
          `f(${fmt(x0)}) = ${fmt(k)} · ${f4(power)} = <strong>${fmt(y, 3)}</strong>`,
        ],
        meta: { k, a, x0 },
      };
    }
    const a = rng.pick([2, 3, 4, 0.5, 1.5, 0.8]);
    const k = rng.pick([2, 3, 4, 5, 6, 8, 10, 12]);
    const x1 = rng.pick([1, 2, -1]);
    const d = rng.pick([1, 2]);
    const x2 = x1 + d;
    const y1 = k * a ** x1;
    const y2 = k * a ** x2;
    const slipsA: Slip[] = [{ value: y2 - y1, hint: "Bei Exponentialfunktionen teilt man die y-Werte, statt sie zu subtrahieren." }];
    if (d === 2) slipsA.push({ value: y2 / y1, hint: "Das ist a². Ziehe noch die Wurzel." });
    return {
      prompt: `Der Graph einer Exponentialfunktion f mit y = k · a<sup>x</sup> verläuft durch die Punkte P(${fmt(x1)} | ${f4(y1)}) und Q(${fmt(x2)} | ${f4(y2)}). Bestimme die Basis a und den Anfangswert k.`,
      given: [`P(${fmt(x1)} | ${f4(y1)})`, `Q(${fmt(x2)} | ${f4(y2)})`],
      fields: [
        numberField("a =", a, "", 2, { slips: slipsA }),
        numberField("k =", k, "", 2, { slips: [{ value: y1, hint: "k ist der y-Wert bei x = 0, nicht der bei P." }] }),
      ],
      steps: [
        `Die y-Werte teilen: ${pow("a", d)} = ${f4(y2)} : ${f4(y1)} = ${f4(a ** d)}`,
        `a = ${d === 2 ? `${sqrtHtml(f4(a ** 2))} = ` : ""}${fmt(a)}`,
        `k = ${f4(y1)} : ${pow(a, x1)} = ${fmt(k)}, also <strong>f: y = ${expHtml(k, a)}</strong>`,
      ],
      meta: { a, k, x1, x2, y1, y2 },
    };
  },
};

const verlauf: ExerciseGenerator = {
  id: "verlauf",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const k = rng.pick([0.5, 1.5, 2, 3, 4, 5, 8]);
      const a = rng.pick([0.25, 0.5, 0.75, 0.8, 0.9, 1.2, 1.5, 2, 3]);
      const grows = a > 1;
      return {
        prompt: `Gegeben ist die Exponentialfunktion f(x) = ${expHtml(k, a)}. Steigt oder fällt ihr Graph? Wo schneidet er die y-Achse, und welcher Funktionswert gehört zu x = 1?`,
        given: [`f(x) = ${expHtml(k, a)}`],
        formulaHint: "y = k · a<sup>x</sup> geht durch (0 | k); für k &gt; 0 steigt der Graph bei a &gt; 1 und fällt bei 0 &lt; a &lt; 1",
        fields: [
          choiceField("Der Graph", ["steigt (Wachstum)", "fällt (Abnahme)"], grows ? 0 : 1),
          numberField("Schnitt mit der y-Achse: y =", k, "", 2, { slips: [{ value: a, hint: "Bei x = 0 ist a⁰ = 1: Der Graph schneidet die y-Achse bei k." }] }),
          numberField("f(1) =", k * a, "", 3, { slips: [{ value: k + a, hint: "f(1) = k · a¹: malnehmen, nicht addieren." }] }),
        ],
        steps: [
          `a = ${fmt(a)} ${grows ? "&gt;" : "&lt;"} 1 und k = ${fmt(k)} &gt; 0: Der Graph ${grows ? "steigt" : "fällt"}.`,
          `f(0) = ${fmt(k)} · ${pow(a, 0)} = ${fmt(k)}`,
          `<strong>f(1) = ${fmt(k)} · ${fmt(a)} = ${fmt(k * a, 3)}</strong>`,
        ],
        meta: { k, a },
      };
    }
    for (;;) {
      const kind = rng.int(0, 2);
      let ys: number[];
      let y5: number;
      if (kind === 0) {
        const t = rng.int(-4, 10);
        const m = rng.pick([-3, -2, -1.5, 1.5, 2, 2.5, 3, 4]);
        ys = [0, 1, 2, 3].map((x) => t + m * x);
        y5 = t + 5 * m;
      } else if (kind === 1) {
        const c = rng.int(-3, 6);
        const p = rng.pick([0.5, 1, 2, 3, -1, -2]);
        ys = [0, 1, 2, 3].map((x) => c + p * x * x);
        y5 = c + 25 * p;
      } else {
        const [k, a] = rng.pick([
          [2, 2],
          [3, 2],
          [5, 2],
          [1, 3],
          [2, 3],
          [64, 0.5],
          [96, 0.5],
          [16, 1.5],
          [8, 1.5],
          [100, 0.8],
          [1000, 0.9],
          [250, 0.4],
        ]);
        ys = [0, 1, 2, 3].map((x) => Number((k * a ** x).toFixed(6)));
        y5 = Number((k * a ** 5).toFixed(6));
      }
      if (nearTrap(y5)) continue;
      const diffs = [ys[1] - ys[0], ys[2] - ys[1], ys[3] - ys[2]];
      const second = [diffs[1] - diffs[0], diffs[2] - diffs[1]];
      const quotients = ys.every((y) => y !== 0) ? [ys[1] / ys[0], ys[2] / ys[1], ys[3] / ys[2]] : null;
      const slips: Slip[] = [];
      if (kind === 2) slips.push({ value: ys[3] + 2 * diffs[2], hint: "Bei gleichen Quotienten wird weiter multipliziert, nicht der letzte Zuwachs addiert." });
      if (kind === 1) slips.push({ value: ys[3] + 2 * diffs[2], hint: "Die Zuwächse wachsen jedes Mal um dieselbe Zahl: Rechne mit den zweiten Differenzen weiter." });
      if (kind === 0 && ys[2] !== 0) slips.push({ value: ys[3] * (ys[3] / ys[2]) ** 2, hint: "Hier sind die Differenzen gleich: Es kommt jedes Mal derselbe Betrag dazu." });
      return {
        prompt: "Eine Messreihe liefert die Wertetabelle unten. Prüfe die Differenzen und die Quotienten aufeinanderfolgender y-Werte: Welcher Funktionstyp passt? Welcher y-Wert ist bei x = 5 zu erwarten?",
        given: ["x: 0; 1; 2; 3", `y: ${ys.map(f4).join("; ")}`],
        fields: [choiceField("Funktionstyp", TYPES, kind), numberField("y bei x = 5:", y5, "", 3, { slips })],
        steps: [
          `Differenzen: ${diffs.map(f4).join("; ")}${kind === 0 ? " (alle gleich)" : ""}`,
          kind === 1
            ? `zweite Differenzen: ${second.map(f4).join("; ")} (alle gleich)`
            : `Quotienten: ${quotients ? quotients.map(f4).join("; ") : "nicht bildbar, weil ein y-Wert 0 ist"}${kind === 2 ? " (alle gleich)" : ""}`,
          `<strong>${TYPES[kind]}, bei x = 5 ist y = ${fmt(y5, 3)}</strong>`,
        ],
        meta: { kind, y0: ys[0], y1: ys[1], y2: ys[2], y3: ys[3], y5 },
      };
    }
  },
};

const vergleich: ExerciseGenerator = {
  id: "vergleich",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const t = rng.pick([10, 20, 30, 40]);
        const m = rng.pick([2, 3, 4, 5, 6]);
        const k = rng.pick([1, 2, 3, 4]);
        const a = rng.pick([1.5, 1.8, 2, 2.5]);
        const n = rng.int(3, 6);
        const A = t + m * n;
        const B = k * a ** n;
        if (Math.abs(A - B) < 0.5) continue;
        return {
          prompt: `Auf einem Teich bedeckt ein Algenteppich ${t} m² und wächst jede Woche um ${m} m². Wasserlinsen bedecken ${k} m², ihre Fläche wird jede Woche ${fmt(a)}-mal so groß. Berechne beide Flächen nach ${n} Wochen. Welche ist dann größer?`,
          given: [`Algen: A(x) = ${t} + ${m} · x`, `Wasserlinsen: W(x) = ${expHtml(k, a)}`, `x = ${n} Wochen`],
          formulaHint: "linear: y = t + m · x (gleicher Zuwachs); exponentiell: y = k · a<sup>x</sup> (gleicher Faktor)",
          fields: [
            numberField("Algen:", A, "m²", 2),
            numberField("Wasserlinsen:", B, "m²", 2, { slips: [{ value: k * a * n, hint: "aˣ heißt x-mal mit a malnehmen, nicht a · x." }] }),
            choiceField("Größer ist", ["der Algenteppich", "die Fläche der Wasserlinsen"], A > B ? 0 : 1),
          ],
          steps: [
            `A(${n}) = ${t} + ${m} · ${n} = ${fmt(A)} m²`,
            `W(${n}) = ${fmt(k)} · ${pow(a, n)} ≈ ${fmt(B, 2)} m²`,
            `<strong>${A > B ? "Der Algenteppich ist größer." : "Die Wasserlinsen bedecken mehr."}</strong>`,
          ],
          meta: { t, m, k, a, n },
        };
      }
    }
    for (;;) {
      const t = rng.pick([20, 30, 40, 50]);
      const m = rng.pick([4, 5, 6, 8, 10]);
      const k = rng.pick([1, 2, 3]);
      const a = rng.pick([1.3, 1.4, 1.5, 1.6, 2]);
      const A = (x: number) => t + m * x;
      const B = (x: number) => k * a ** x;
      let n = 1;
      while (B(n) <= A(n)) n++;
      if (n > 40 || B(n) - A(n) < 0.5 || A(n - 1) - B(n - 1) < 0.5) continue;
      return {
        prompt: `Ein Algenteppich bedeckt ${t} m² eines Sees und wächst jede Woche um ${m} m². Wasserlinsen bedecken ${k} m², ihre Fläche wird jede Woche ${fmt(a)}-mal so groß. Nach wie vielen Wochen bedecken die Wasserlinsen zum ersten Mal mehr Fläche als die Algen? Wie groß ist ihre Fläche dann?`,
        given: [`Algen: ${t} m², + ${m} m² pro Woche`, `Wasserlinsen: ${k} m², · ${fmt(a)} pro Woche`],
        fields: [
          numberField("nach", n, "Wochen", 0, { slips: [{ value: n - 1, hint: `Nach ${n - 1} Wochen sind die Wasserlinsen noch nicht größer. Vergleiche beide Werte.` }] }),
          numberField("Fläche der Wasserlinsen:", B(n), "m²", 2),
        ],
        steps: [
          `A(x) = ${t} + ${m} · x, W(x) = ${expHtml(k, a)}`,
          `nach ${n - 1} Wochen: Algen ${fmt(A(n - 1), 2)} m², Wasserlinsen ${fmt(B(n - 1), 2)} m²`,
          `nach ${n} Wochen: Algen ${fmt(A(n), 2)} m², Wasserlinsen ${fmt(B(n), 2)} m²`,
          `<strong>Nach ${n} Wochen, dann bedecken die Wasserlinsen ${fmt(B(n), 2)} m².</strong>`,
        ],
        meta: { t, m, k, a, n },
      };
    }
  },
};

const exponentialfunktion: Lesson = {
  id: "el-1-exponentialfunktion",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "5.1 Exponentialfunktionen y = k · aˣ",
  subtitle: "Gleicher Schritt, gleicher Faktor",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN_BOTH}, y = k · aˣ`,
  whyItMatters:
    "Zinseszins, Bakterien oder ein Medikament im Blut ändern sich nicht um gleiche Beträge, sondern um gleiche Faktoren. Solche Vorgänge beschreibt eine Exponentialfunktion.",
  explanationHtml: `
    <p>Bei einer <strong>Exponentialfunktion</strong> steht die Variable x in der Hochzahl:</p>
    <p class="formula-line">f: y = k · a<sup>x</sup> &nbsp; mit a &gt; 0, a ≠ 1 und k ≠ 0</p>
    <ul>
      <li><strong>Anfangswert k:</strong> Wegen a<sup>0</sup> = 1 geht der Graph durch <strong>(0 | k)</strong>.</li>
      <li><strong>Basis a:</strong> Geht man um 1 nach rechts, wird der y-Wert mit a multipliziert. Bei a &gt; 1 steigt der Graph (<strong>exponentielles Wachstum</strong>), bei 0 &lt; a &lt; 1 fällt er (<strong>exponentielle Abnahme</strong>), jeweils für k &gt; 0. Für k &lt; 0 ist der Graph an der x-Achse gespiegelt.</li>
      <li><strong>Asymptote:</strong> Der Graph nähert sich der x-Achse (y = 0) beliebig nah, erreicht sie aber nie. Für k &gt; 0 sind alle y-Werte positiv: 𝕎 = ℝ<sup>+</sup>. Einsetzen darf man jedes x: 𝔻 = ℝ.</li>
      <li>Die Graphen von y = a<sup>x</sup> und y = (${frac(1, "a")})<sup>x</sup> liegen spiegelbildlich zur y-Achse, zum Beispiel y = 2<sup>x</sup> und y = 0,5<sup>x</sup>.</li>
      <li>Vorsicht: 2 · 3<sup>x</sup> ist nicht 6<sup>x</sup>. Erst potenzieren, dann mit k multiplizieren.</li>
    </ul>
    <p><strong>Abgrenzung:</strong> Vergleiche die Wertetabellen.</p>
    <table class="mini">
      <tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>Zuwachs</th></tr>
      <tr><td>linear: y = 2x + 1</td><td>1</td><td>3</td><td>5</td><td>7</td><td>9</td><td>immer + 2</td></tr>
      <tr><td>quadratisch: y = x² + 1</td><td>1</td><td>2</td><td>5</td><td>10</td><td>17</td><td>+ 1, + 3, + 5, + 7</td></tr>
      <tr><td>exponentiell: y = 2<sup>x</sup></td><td>1</td><td>2</td><td>4</td><td>8</td><td>16</td><td>immer · 2</td></tr>
    </table>
    <p>Eine lineare Funktion ändert sich pro Schritt um <strong>denselben Betrag</strong> (konstante Differenzen), eine Exponentialfunktion um <strong>denselben Faktor</strong> (konstante Quotienten). Eine Parabel ist symmetrisch und hat einen Scheitel; eine Exponentialfunktion steigt oder fällt überall und hat eine Asymptote. Auf lange Sicht überholt y = 2<sup>x</sup> jede Parabel: 2<sup>10</sup> = 1024, aber 10² + 1 = 101.</p>
    <div class="example">Der Graph von y = k · a<sup>x</sup> geht durch (0 | 3) und (2 | 12). Aus (0 | 3) folgt k = 3. Aus 3 · a² = 12 folgt a² = 4, also a = 2 (die Basis ist positiv): <strong>y = 3 · 2<sup>x</sup></strong>.</div>
    <div class="merke"><strong>Merke:</strong> y = k · a<sup>x</sup> startet bei (0 | k) und wird pro Schritt nach rechts mit a multipliziert. a &gt; 1: Wachstum, 0 &lt; a &lt; 1: Abnahme. Die x-Achse ist Asymptote.</div>
  `,
  formulas: [
    { name: "Exponentialfunktion", html: "y = k · a<sup>x</sup>", quantities: "a > 0, a ≠ 1 Basis (Faktor pro Schritt), k ≠ 0 Anfangswert: Graph durch (0 | k)" },
    { name: "Wachstum und Abnahme", html: "a &gt; 1: Wachstum; 0 &lt; a &lt; 1: Abnahme", quantities: "für k > 0; die x-Achse ist Asymptote" },
    { name: "Abgrenzung", html: "linear: + d pro Schritt; exponentiell: · a pro Schritt", quantities: "konstante Differenzen oder konstante Quotienten" },
  ],
  quiz: {
    question: "Bei welcher Funktion wird der y-Wert bei jedem Schritt um 1 nach rechts mit demselben Faktor multipliziert?",
    options: ["y = 3x + 2", "y = 3x²", "y = 2 · 3ˣ"],
    correctIndex: 2,
    explanation: "Bei y = 2 · 3ˣ wird pro Schritt mit 3 multipliziert: 2, 6, 18, 54. Bei y = 3x + 2 kommt immer 3 dazu, bei y = 3x² wachsen die Zuwächse gleichmäßig: 3, 9, 15.",
  },
  lab: {
    kind: "exp-graph",
    title: "Labor: Der Graph von y = k · aˣ",
    intro: "Ziehe den Punkt (0 | k) und den Punkt daneben, der die Basis a festlegt. Die Wertetabelle zeigt: Pro Schritt nach rechts wird mit a multipliziert. Zum Vergleich kannst du eine Gerade oder eine Parabel durch dieselben zwei Punkte einblenden.",
    params: [
      { type: "range", key: "k", label: "Anfangswert k", unit: "", min: -3, max: 4, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "a", label: "Basis a", unit: "", min: 0.2, max: 3, step: 0.1, value: 1.5, digits: 1 },
      {
        type: "choice",
        key: "cmp",
        label: "Vergleich",
        options: [
          { value: 0, label: "kein Vergleich" },
          { value: 1, label: "Gerade durch (0 | k) und (1 | k · a)" },
          { value: 2, label: "Parabel durch (0 | k) und (1 | k · a)" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "term", label: "Funktionsgleichung", emphasis: true, compute: expEquation },
      {
        key: "schritt",
        label: "Pro Schritt nach rechts",
        compute: (v) => (v.a === 1 ? "· 1: keine Änderung" : `· ${fmt(v.a)}, also ${v.a > 1 ? "+" : "−"} ${fmt(Math.abs(v.a - 1) * 100, 0)} %`),
      },
      { key: "sy", label: "Schnittpunkt mit der y-Achse", compute: (v) => `(0 | ${fmt(v.k)})` },
      { key: "verlauf", label: "Verlauf", compute: expTrend },
      {
        key: "w",
        label: "Wertemenge",
        compute: (v) => (v.k === 0 ? "𝕎 = {0}" : v.a === 1 ? `𝕎 = {${fmt(v.k)}}` : v.k > 0 ? "𝕎 = ℝ⁺: alle y > 0" : "𝕎 = ℝ⁻: alle y < 0"),
      },
    ],
    goals: [
      { id: "zwei-punkte", text: "Lege den Graphen durch die Punkte (0 | 2) und (2 | 8).", check: (v) => v.k === 2 && v.a === 2 },
      { id: "spiegelbild", text: "Stelle das Spiegelbild von y = 2ˣ an der y-Achse ein.", check: (v) => v.k === 1 && v.a === 0.5 },
      {
        id: "parabel",
        text: "Wähle den Vergleich mit der Parabel. Stelle a so ein, dass sich Parabel und Exponentialkurve außer bei x = 0 und x = 1 auch bei x = 2 treffen.",
        check: (v) => v.cmp === 2 && v.k !== 0 && v.a === 3,
      },
    ],
  },
  exercises: [funktionswert, verlauf, vergleich],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst Exponentialfunktionen am gleichen Faktor pro Schritt und liest k und a am Graphen ab.",
};

// 5.2 Wachstum und Abklingen ────────────────────────────────────────────────

const prozent: ExerciseGenerator = {
  id: "prozent",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const up = rng.next() < 0.5;
      const p = rng.pick(up ? [2, 3, 5, 8, 10, 12, 15, 20, 25] : [2, 4, 5, 8, 10, 12, 15, 20, 30]);
      const N0 = rng.pick([200, 400, 500, 800, 1200, 2400, 5000]);
      const t = rng.int(3, 8);
      const a = up ? 1 + p / 100 : 1 - p / 100;
      const N = N0 * a ** t;
      return {
        prompt: `Ein Bestand von ${fmt(N0)} Tieren ${up ? "wächst" : "nimmt"} jedes Jahr um ${fmt(p)} %${up ? "" : " ab"}. Gib den Wachstumsfaktor a an und berechne den Bestand nach ${t} Jahren.`,
        given: [`N<sub>0</sub> = ${fmt(N0)}`, `${up ? "Zunahme" : "Abnahme"}: ${fmt(p)} % pro Jahr`, `t = ${t} Jahre`],
        formulaHint: `a = 1 ${up ? "+" : "−"} ${frac("p", "100")}; N(t) = N<sub>0</sub> · a<sup>t</sup>`,
        fields: [
          numberField("a =", a, "", 2, {
            slips: [
              { value: p / 100, hint: "Der Faktor enthält die 100 % des alten Bestands: a = 1 ± p/100." },
              { value: up ? 1 - p / 100 : 1 + p / 100, hint: up ? "Bei einer Zunahme ist a größer als 1." : "Bei einer Abnahme ist a kleiner als 1." },
            ],
          }),
          numberField(`N(${t}) ≈`, N, "Tiere", 0, {
            slips: [{ value: N0 * (1 + ((up ? 1 : -1) * t * p) / 100), hint: "Die Prozente beziehen sich jedes Jahr auf den neuen Bestand: N₀ · aᵗ, nicht N₀ · (1 + t · p %)." }],
          }),
        ],
        steps: [`a = 1 ${up ? "+" : "−"} ${fmt(p / 100, 2)} = ${fmt(a, 2)}`, `N(${t}) = ${fmt(N0)} · ${pow(fmt(a, 2), t)} ≈ ${fmt(N0)} · ${f4(a ** t)}`, `<strong>N(${t}) ≈ ${fmt(N, 0)} Tiere</strong>`],
        meta: { N0, p: up ? p : -p, t },
      };
    }
    if (rng.next() < 0.5) {
      const K0 = rng.pick([1500, 2000, 2500, 3000, 4000, 5000, 8000]);
      const p = rng.pick([1.5, 2, 2.5, 3, 3.5, 4]);
      const n = rng.int(4, 12);
      const a = 1 + p / 100;
      const Kn = K0 * a ** n;
      return {
        prompt: `Frau Berger legt ${fmt(K0)} € zu einem festen Zinssatz von ${fmt(p)} % pro Jahr an. Die Zinsen werden jedes Jahr mitverzinst (Zinseszins). Wie hoch ist ihr Guthaben nach ${n} Jahren, und wie viel Zinsen hat sie insgesamt erhalten?`,
        given: [`K<sub>0</sub> = ${fmtUnit(K0, "€")}`, `p = ${fmt(p)} %`, `n = ${n} Jahre`],
        fields: [
          numberField(`K<sub>${n}</sub> =`, Kn, "€", 2, { slips: [{ value: K0 * (1 + (n * p) / 100), hint: "Das wären einfache Zinsen ohne Zinseszins. Mit Zinseszins: K₀ · (1 + p/100)ⁿ." }] }),
          numberField("Zinsen insgesamt:", Kn - K0, "€", 2, { slips: [{ value: Kn, hint: "Das ist das Guthaben. Die Zinsen sind das, was zu K₀ dazukam." }] }),
        ],
        steps: [
          `a = 1 + ${fmt(p / 100, 3)} = ${fmt(a, 3)}`,
          `K<sub>${n}</sub> = ${fmt(K0)} € · ${pow(fmt(a, 3), n)} ≈ ${fmtUnit(Kn, "€")}`,
          `<strong>Guthaben ${fmtUnit(Kn, "€")}, Zinsen ${fmtUnit(Kn - K0, "€")}</strong>`,
        ],
        meta: { scenario: 0, K0, p, n },
      };
    }
    const W0 = rng.pick([18000, 24000, 28000, 32000, 40000]);
    const p = rng.pick([10, 12, 15, 18, 20]);
    const n = rng.int(3, 7);
    const a = 1 - p / 100;
    const Wn = W0 * a ** n;
    const share = 100 * a ** n;
    return {
      prompt: `Ein neues Auto kostet ${fmt(W0)} €. Es verliert jedes Jahr ${fmt(p)} % des Wertes, den es zu Jahresbeginn hat. Welchen Wert hat es nach ${n} Jahren? Wie viel Prozent des Neupreises sind das noch?`,
      given: [`Neupreis ${fmtUnit(W0, "€")}`, `Wertverlust ${fmt(p)} % pro Jahr`, `n = ${n} Jahre`],
      fields: [
        numberField("Wert:", Wn, "€", 2, { slips: [{ value: W0 * (1 - (n * p) / 100), hint: "Der Verlust bezieht sich jedes Jahr auf den neuen, kleineren Wert: W₀ · (1 − p/100)ⁿ." }] }),
        numberField("Anteil:", share, "%", 1, { slips: [{ value: 100 - share, hint: "Das ist der Verlust. Gefragt ist, wie viel Prozent noch übrig sind." }] }),
      ],
      steps: [`a = 1 − ${fmt(p / 100, 2)} = ${fmt(a, 2)}`, `W = ${fmt(W0)} € · ${pow(fmt(a, 2), n)} ≈ ${fmtUnit(Wn, "€")}`, `<strong>${fmtUnit(Wn, "€")}, das sind ${fmt(share, 1)} % des Neupreises</strong>`],
      meta: { scenario: 1, W0, p, n },
    };
  },
};

const SUBSTANCES = [
  { name: "Iod-131", T: 8, unit: "Tagen", per: "Tag", doses: [2, 2.4, 3, 4] },
  { name: "Technetium-99m", T: 6, unit: "Stunden", per: "Stunde", doses: [0.5, 0.8, 1, 1.2] },
  { name: "Cäsium-137", T: 30, unit: "Jahren", per: "Jahr", doses: [10, 20, 50] },
];

const halbwertszeit: ExerciseGenerator = {
  id: "halbwertszeit",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const N0 = rng.pick([64, 80, 96, 120, 200, 400]);
      const T = rng.pick([5, 8, 12, 15, 30]);
      const n = rng.int(2, 5);
      const t = n * T;
      const N = N0 / 2 ** n;
      return {
        prompt: `Ein radioaktiver Stoff hat eine Halbwertszeit von ${T} Tagen. Zu Beginn sind ${N0} mg vorhanden. Wie viel ist nach ${t} Tagen noch da, und wie viel Prozent der Anfangsmenge sind das?`,
        given: [`N<sub>0</sub> = ${N0} mg`, `Halbwertszeit T = ${T} Tage`, `t = ${t} Tage`],
        formulaHint: "Nach jeder Halbwertszeit halbiert sich die Menge: N(t) = N<sub>0</sub> · 0,5<sup>t : T</sup>",
        fields: [
          numberField(`N(${t}) =`, N, "mg", 2, { slips: [{ value: N0 / (2 * n), hint: `${t} Tage sind ${n} Halbwertszeiten: ${n}-mal halbieren, nicht durch ${2 * n} teilen.` }] }),
          numberField("Anteil:", 100 / 2 ** n, "%", 3),
        ],
        steps: [`${t} : ${T} = ${n} Halbwertszeiten`, `N(${t}) = ${N0} mg · ${pow("0,5", n)} = ${N0} mg : ${2 ** n}`, `<strong>N(${t}) = ${fmt(N, 2)} mg, das sind ${fmt(100 / 2 ** n, 3)} %</strong>`],
        meta: { N0, T, n },
      };
    }
    if (rng.next() < 0.5) {
      const s = rng.pick(SUBSTANCES);
      const N0 = rng.pick(s.doses);
      let t = rng.int(s.T + 1, 5 * s.T);
      if (t % s.T === 0) t += 1;
      const N = N0 * 0.5 ** (t / s.T);
      const q = 100 * (1 - 0.5 ** (1 / s.T));
      return {
        prompt: `${s.name} hat eine Halbwertszeit von ${s.T} ${s.unit}. Eine Probe enthält ${fmt(N0)} mg davon. Wie viel ist nach ${t} ${s.unit} noch vorhanden? Um wie viel Prozent nimmt die Menge pro ${s.per} ab?`,
        given: [`N<sub>0</sub> = ${fmt(N0)} mg`, `T = ${s.T} ${s.unit.replace(/n$/, "")}`, `t = ${t} ${s.unit.replace(/n$/, "")}`],
        fields: [
          numberField(`N(${t}) ≈`, N, "mg", 3, { slips: [{ value: N0 * 0.5 ** Math.floor(t / s.T), hint: "Auch angefangene Halbwertszeiten zählen: Rechne mit dem Exponenten t : T als Dezimalzahl." }] }),
          numberField("Abnahme:", q, "%", 1, { slips: [{ value: 50 / s.T, hint: "Die Abnahme ist kein fester Teil von 50 %: Der Faktor pro Einheit ist 0,5 hoch (1 : T)." }] }),
        ],
        steps: [
          `N(t) = ${fmt(N0)} mg · 0,5<sup>t : ${s.T}</sup>`,
          `N(${t}) = ${fmt(N0)} mg · 0,5<sup>${f4(t / s.T)}</sup> ≈ ${fmt(N, 3)} mg`,
          `Faktor pro ${s.per}: 0,5<sup>1 : ${s.T}</sup> ≈ ${f4(0.5 ** (1 / s.T))}`,
          `<strong>${fmt(N, 3)} mg; Abnahme ≈ ${fmt(q, 1)} % pro ${s.per}</strong>`,
        ],
        meta: { scenario: 0, N0, T: s.T, t },
      };
    }
    const T = rng.pick([15, 20, 30]);
    const N0 = rng.pick([200, 500, 1000]);
    const hours = rng.pick([1, 1.5, 2, 2.5, 3]);
    const t = 60 * hours;
    const N = N0 * 2 ** (t / T);
    const q = 100 * (2 ** (1 / T) - 1);
    return {
      prompt: `Eine Bakterienkultur verdoppelt sich alle ${T} Minuten. Zu Beginn sind es ${fmt(N0)} Bakterien. Wie viele Bakterien sind es nach ${fmt(hours)} Stunden? Um wie viel Prozent wächst die Kultur pro Minute?`,
      given: [`N<sub>0</sub> = ${fmt(N0)}`, `Verdopplungszeit ${T} min`, `t = ${fmt(hours)} h = ${t} min`],
      fields: [
        numberField(`N(${t} min) ≈`, N, "Bakterien", 0, { slips: [{ value: N0 * 2 * (t / T), hint: "Verdoppeln heißt mit 2 malnehmen, und zwar (t : T)-mal: N₀ · 2 hoch (t : T)." }] }),
        numberField("Zunahme pro Minute:", q, "%", 2, { slips: [{ value: 100 / T, hint: "Pro Minute wächst die Kultur um einen festen Faktor: 2 hoch (1 : T), nicht um 100 % : T." }] }),
      ],
      steps: [
        `${t} min : ${T} min = ${f4(t / T)} Verdopplungen`,
        `N = ${fmt(N0)} · ${pow(2, f4(t / T))} ≈ ${fmt(N, 0)}`,
        `Faktor pro Minute: 2<sup>1 : ${T}</sup> ≈ ${f4(2 ** (1 / T))}`,
        `<strong>≈ ${fmt(N, 0)} Bakterien; Zunahme ≈ ${fmt(q, 2)} % pro Minute</strong>`,
      ],
      meta: { scenario: 1, N0, T, t },
    };
  },
};

/** Stocks N₀ · a^t₁ and N₀ · a^(t₁ + 1) that are whole numbers: N₀, a, t₁. */
const NICE_DATA: Array<[number, number, number]> = [
  [1000, 1.1, 2],
  [625, 1.2, 2],
  [1600, 1.25, 2],
  [800, 1.5, 2],
  [2000, 0.9, 2],
  [10000, 0.9, 3],
  [2560, 0.75, 3],
  [5000, 1.2, 3],
  [1250, 0.8, 3],
];

const daten: ExerciseGenerator = {
  id: "daten",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const N0 = rng.pick([200, 400, 500, 800, 1000, 1250]);
      const p = rng.pick([-25, -20, -10, -5, 4, 5, 10, 15, 20, 25]);
      const a = 1 + p / 100;
      const N1 = N0 * a;
      const t = rng.int(3, 6);
      return {
        prompt: `Ein Bestand ändert sich jedes Jahr um denselben Prozentsatz. Zu Beginn misst man ${fmt(N0)}, nach einem Jahr ${fmt(N1, 2)}. Bestimme den Faktor a, die prozentuale Änderung p pro Jahr (bei einer Abnahme negativ) und den Bestand nach ${t} Jahren.`,
        given: [`N(0) = ${fmt(N0)}`, `N(1) = ${fmt(N1, 2)}`],
        formulaHint: "a = N(1) : N(0); p = (a − 1) · 100 %; N(t) = N(0) · a<sup>t</sup>",
        fields: [
          numberField("a =", a, "", 2, { slips: [{ value: N0 / N1, hint: "Umgekehrt: a = N(1) : N(0), der neue Wert durch den alten." }] }),
          numberField("p =", p, "%", 1, { slips: [{ value: N1 - N0, hint: "p ist ein Prozentsatz: (a − 1) · 100 %, nicht die Differenz der Werte." }] }),
          numberField(`N(${t}) ≈`, N0 * a ** t, "", 1),
        ],
        steps: [`a = ${fmt(N1, 2)} : ${fmt(N0)} = ${fmt(a, 2)}`, `p = (${fmt(a, 2)} − 1) · 100 % = ${fmt(p)} %`, `<strong>N(${t}) = ${fmt(N0)} · ${pow(fmt(a, 2), t)} ≈ ${fmt(N0 * a ** t, 1)}</strong>`],
        meta: { N0, N1, t },
      };
    }
    const [N0, a, t1] = rng.pick(NICE_DATA);
    const N1 = Math.round(N0 * a ** t1);
    const N2 = Math.round(N0 * a ** (t1 + 1));
    const p = Number(((N2 / N1 - 1) * 100).toFixed(6));
    const up = p > 0;
    const start = N1 / (N2 / N1) ** t1;
    return {
      prompt: `Eine ${up ? "Kaninchenpopulation wächst" : "Feldhamsterpopulation nimmt"} jedes Jahr um denselben Prozentsatz${up ? "" : " ab"}. ${t1} Jahre nach Beginn der Zählung leben dort ${fmt(N1)} Tiere, ein Jahr später ${fmt(N2)}. Um wie viel Prozent ändert sich der Bestand jährlich, und wie viele Tiere waren es zu Beginn der Zählung?`,
      given: [`N(${t1}) = ${fmt(N1)}`, `N(${t1 + 1}) = ${fmt(N2)}`],
      fields: [
        numberField("p =", p, "%", 1, { slips: [{ value: N2 - N1, hint: "p ist ein Prozentsatz: Teile die Werte und rechne (a − 1) · 100 %." }] }),
        numberField("N₀ =", start, "Tiere", 0, { slips: [{ value: N1 - t1 * (N2 - N1), hint: "Rückwärts wird durch a geteilt, nicht der Zuwachs abgezogen: N₀ = N(t) : aᵗ." }] }),
      ],
      steps: [
        `a = ${fmt(N2)} : ${fmt(N1)} = ${f4(N2 / N1)}, also p = ${fmt(p, 1)} %`,
        `N(${t1}) = N<sub>0</sub> · ${pow("a", t1)} ⇒ N<sub>0</sub> = ${fmt(N1)} : ${pow(f4(N2 / N1), t1)}`,
        `<strong>p = ${fmt(p, 1)} %, N<sub>0</sub> = ${fmt(start, 0)} Tiere</strong>`,
      ],
      meta: { N1, N2, t1 },
    };
  },
};

const wachstum: Lesson = {
  id: "el-2-wachstum",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "5.2 Wachstum und Abklingen",
  subtitle: "Prozente werden zu Faktoren",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN_BOTH}, Wachstums- und Abklingprozesse`,
  whyItMatters:
    "Ob Sparbuch, Autowert oder radioaktiver Zerfall: Wer Prozente in Faktoren umrechnet, kann vorhersagen, wie viel nach einigen Jahren noch da ist.",
  explanationHtml: `
    <p>Wächst oder schrumpft eine Größe in jedem Zeitschritt um <strong>denselben Prozentsatz</strong> p %, wird sie in jedem Schritt mit demselben <strong>Wachstumsfaktor</strong> a multipliziert:</p>
    <ul>
      <li>Zunahme um p %: a = 1 + ${frac("p", "100")}, zum Beispiel 15 % mehr: a = 1,15.</li>
      <li>Abnahme um p %: a = 1 − ${frac("p", "100")}, zum Beispiel 20 % weniger: a = 0,8.</li>
    </ul>
    <p class="formula-line">N(t) = N<sub>0</sub> · a<sup>t</sup></p>
    <p>Dabei ist N<sub>0</sub> der Anfangsbestand und t die Anzahl der Zeitschritte. Beim <strong>Zinseszins</strong> heißt das K<sub>n</sub> = K<sub>0</sub> · (1 + ${frac("p", "100")})<sup>n</sup>: Die Zinsen werden jedes Jahr mitverzinst.</p>
    <ul>
      <li><strong>Halbwertszeit T:</strong> Nach jeder Halbwertszeit ist nur noch die Hälfte da: N(t) = N<sub>0</sub> · 0,5<sup>t : T</sup>. Nach 3 Halbwertszeiten bleibt ${fracHtml(1, 8)} = 12,5 %.</li>
      <li><strong>Verdopplungszeit:</strong> Bei exponentiellem Wachstum verdoppelt sich der Bestand immer in derselben Zeit, egal wann man zu zählen beginnt.</li>
      <li><strong>Parameter aus Messwerten:</strong> N<sub>0</sub> ist der Wert bei t = 0. Den Faktor findest du als Quotienten aufeinanderfolgender Werte: a = N(1) : N(0). Aus a = 1,08 liest du ab: 8 % Zunahme pro Schritt.</li>
    </ul>
    <div class="example">Eine Bakterienkultur hat 500 Bakterien und wächst stündlich um 15 %: N(t) = 500 · 1,15<sup>t</sup>. Nach 10 Stunden sind es N(10) = 500 · 1,15<sup>10</sup> ≈ 2023 Bakterien. Wann sich der Bestand verdoppelt hat, zeigt die Wertetabelle: N(4) ≈ 875 und N(5) ≈ 1006, also nach knapp 5 Stunden. Genau rechnest du das mit dem Logarithmus (5.3).</div>
    <div class="merke"><strong>Merke:</strong> Prozent in Faktor umrechnen: + p % ⇒ · (1 + ${frac("p", "100")}), − p % ⇒ · (1 − ${frac("p", "100")}). Exponentiell heißt: gleiche Zeitschritte, gleicher Faktor.</div>
  `,
  formulas: [
    { name: "Wachstumsfaktor", html: `a = 1 + ${frac("p", "100")} bzw. a = 1 − ${frac("p", "100")}`, quantities: "Zunahme bzw. Abnahme um p % pro Zeitschritt" },
    { name: "Exponentielles Wachstum", html: "N(t) = N<sub>0</sub> · a<sup>t</sup>", quantities: "N₀ Anfangsbestand, t Anzahl der Zeitschritte" },
    { name: "Halbwertszeit T", html: "N(t) = N<sub>0</sub> · 0,5<sup>t : T</sup>", quantities: "nach jeder Halbwertszeit ist noch die Hälfte da" },
  ],
  quiz: {
    question: "Ein Bestand nimmt jedes Jahr um 20 % ab. Mit welchem Faktor wird er jedes Jahr multipliziert?",
    options: ["0,8", "0,2", "1,2", "−0,2"],
    correctIndex: 0,
    explanation: "Nach einem Jahr sind noch 100 % − 20 % = 80 % des Bestands übrig: a = 1 − 0,20 = 0,8.",
  },
  lab: {
    kind: "growth",
    title: "Labor: Wachstum und Abklingen",
    intro: "Stelle den Anfangsbestand N₀ und die Änderung p pro Zeitschritt ein. Jeder Balken ist a-mal so hoch wie der davor. Ziehe den Zeitpunkt t auf der Zeitachse und lies N(t) ab.",
    params: [
      { type: "range", key: "N0", label: "Anfangsbestand N₀", unit: "", min: 100, max: 2000, step: 100, value: 500 },
      { type: "range", key: "p", label: "Änderung pro Zeitschritt p", unit: "%", min: -50, max: 50, step: 1, value: 10 },
      { type: "range", key: "t", label: "Zeitpunkt t", unit: "", min: 0, max: 30, step: 1, value: 5 },
    ],
    readouts: [
      { key: "a", label: "Wachstumsfaktor a = 1 + p %", compute: (v) => fmt(1 + v.p / 100, 2) },
      { key: "term", label: "Funktionsgleichung", emphasis: true, compute: (v) => `N(t) = ${fmt(v.N0)} · ${powText(fmt(1 + v.p / 100, 2), "t")}` },
      { key: "Nt", label: "Bestand zum Zeitpunkt t", compute: (v) => `N(${v.t}) ≈ ${fmt(v.N0 * (1 + v.p / 100) ** v.t, 2)}` },
      {
        key: "T",
        label: "Verdopplungs- bzw. Halbwertszeit",
        compute: (v) => {
          const T = characteristicTime(v.p);
          return T === null ? "keine: Bei p = 0 bleibt der Bestand gleich" : `${v.p > 0 ? "verdoppelt" : "halbiert"} sich alle ${fmt(T, 2)} Zeitschritte`;
        },
      },
    ],
    goals: [
      {
        id: "zinseszins",
        text: "1000 € werden mit 3 % pro Jahr verzinst. Stelle das ein und ziehe t auf das erste Jahr, in dem das Kapital über 2000 € liegt.",
        check: (v) => v.N0 === 1000 && v.p === 3 && v.t === 24,
      },
      {
        id: "abbau",
        text: "Ein Medikament wird pro Stunde um 25 % abgebaut. Stelle das ein und ziehe t auf die erste volle Stunde, in der weniger als die Hälfte übrig ist.",
        check: (v) => v.p === -25 && v.t === 3,
      },
      {
        id: "messwerte",
        text: "Passe N₀ und p so an, dass das Modell durch die drei Messwerte (0 | 300), (1 | 360) und (2 | 432) geht.",
        check: (v) => v.N0 === 300 && v.p === 20,
      },
    ],
  },
  exercises: [prozent, halbwertszeit, daten],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest Prozente in Wachstumsfaktoren um und beschreibst Wachstum, Zerfall und Halbwertszeit.",
};

// 5.3 Der Logarithmus löst aˣ = b ───────────────────────────────────────────

/** A power aⁿ as a number to show: 32, 1/8 or 0,01. */
function powerShown(a: number, n: number): string {
  if (n >= 0) return fmt(a ** n);
  return a === 10 ? fmt(a ** n, 4) : fracHtml(1, a ** -n);
}

const logwert: ExerciseGenerator = {
  id: "logwert",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const a = rng.pick([2, 3, 4, 5, 10]);
      const n = rng.int(-3, a === 2 ? 6 : 4);
      const b = powerShown(a, n);
      const slips: Slip[] = [];
      if (n >= 2) slips.push({ value: a ** n / a, hint: "Der Logarithmus ist eine Hochzahl, kein Quotient b : a." });
      if (n < 0) slips.push({ value: -n, hint: "Für Zahlen zwischen 0 und 1 ist der Logarithmus negativ." });
      return {
        prompt: `Berechne ohne Taschenrechner: ${logNameHtml(a)} ${b}.`,
        given: [`${logNameHtml(a)} ${b}`],
        formulaHint: `log<sub>a</sub> b = x ⇔ a<sup>x</sup> = b: Mit welcher Hochzahl wird aus ${a} die Zahl ${b}?`,
        fields: [numberField(`${logNameHtml(a)} ${b} =`, n, "", 0, { slips })],
        steps: [`${pow(a, n)} = ${b}`, `<strong>${logNameHtml(a)} ${b} = ${fmt(n)}</strong>`],
        meta: { a, n },
      };
    }
    const variant = rng.int(0, 2);
    if (variant === 0) {
      const a = rng.pick([2, 3, 4, 5, 10]);
      const n = rng.pick([-2, -1, 2, 3, 4]);
      const x = a ** n;
      return {
        prompt: `Bestimme die Zahl x, für die ${logNameHtml(a)} x = ${fmt(n)} gilt. Schreibe die Gleichung dazu als Potenz.`,
        given: [`${logNameHtml(a)} x = ${fmt(n)}`],
        fields: [numberField("x =", x, "", 4, { slips: [{ value: a * n, hint: `x ist ${a} hoch ${fmt(n)}, nicht ${a} mal ${fmt(n)}.` }] })],
        steps: [`${logNameHtml(a)} x = ${fmt(n)} bedeutet ${pow(a, n)} = x`, `<strong>x = ${powerShown(a, n)}${n < 0 && a !== 10 ? ` = ${f4(x)}` : ""}</strong>`],
        meta: { variant, a, n },
      };
    }
    if (variant === 1) {
      const x = rng.pick([2, 3, 4, 5, 6, 10]);
      const n = rng.pick([2, 3]);
      const b = x ** n;
      return {
        prompt: `Für welche Basis x gilt log<sub>x</sub> ${fmt(b)} = ${n}?`,
        given: [`log<sub>x</sub> ${fmt(b)} = ${n}`],
        fields: [numberField("x =", x, "", 2, { slips: [{ value: b / n, hint: `x hoch ${n} soll ${fmt(b)} ergeben: Ziehe die ${n === 2 ? "Quadratwurzel" : "dritte Wurzel"}, statt durch ${n} zu teilen.` }] })],
        steps: [`log<sub>x</sub> ${fmt(b)} = ${n} bedeutet ${pow("x", n)} = ${fmt(b)}`, `<strong>x = ${n === 2 ? sqrtHtml(fmt(b)) : `<sup>3</sup>${sqrtHtml(fmt(b))}`} = ${x}</strong>`],
        meta: { variant, x, n },
      };
    }
    const [a1, n1] = rng.pick([
      [2, 3],
      [2, 5],
      [3, 2],
      [3, 4],
      [5, 2],
      [4, 3],
    ]);
    const n2 = rng.pick([-3, -2, -1, 1, 2]);
    return {
      prompt: `Berechne ohne Taschenrechner: ${logNameHtml(a1)} ${fmt(a1 ** n1)} + lg ${f4(10 ** n2)}.`,
      given: [`${logNameHtml(a1)} ${fmt(a1 ** n1)} + lg ${f4(10 ** n2)}`],
      fields: [numberField("Wert =", n1 + n2, "", 0)],
      steps: [
        `${logNameHtml(a1)} ${fmt(a1 ** n1)} = ${n1}, weil ${pow(a1, n1)} = ${fmt(a1 ** n1)}`,
        `lg ${f4(10 ** n2)} = ${fmt(n2)}, weil ${pow(10, n2)} = ${f4(10 ** n2)}`,
        `<strong>${n1} ${signed(n2, 0)} = ${fmt(n1 + n2)}</strong>`,
      ],
      meta: { variant, a1, n1, n2 },
    };
  },
};

const gleichung: ExerciseGenerator = {
  id: "gleichung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const a = rng.pick([2, 3, 5, 1.5, 0.5, 4, 7]);
        const b = rng.int(3, 200);
        const x = logBase(a, b);
        if (Math.abs(x - Math.round(x)) < 1e-9 || nearTrap(x)) continue;
        return {
          prompt: `Löse die Exponentialgleichung ${pow(a, "x")} = ${fmt(b)}. Runde auf zwei Nachkommastellen.`,
          given: [`${pow(a, "x")} = ${fmt(b)}`],
          formulaHint: "a<sup>x</sup> = b ⇒ x = log<sub>a</sub> b = lg b : lg a",
          fields: [
            numberField("x ≈", x, "", 2, {
              slips: [
                { value: b / a, hint: "Gesucht ist eine Hochzahl, kein Quotient b : a." },
                { value: lg(b), hint: "Das ist lg b. Teile noch durch lg a." },
                { value: lg(a) / lg(b), hint: "Umgekehrt: x = lg b : lg a." },
              ],
            }),
          ],
          steps: [`x = ${logNameHtml(a)} ${fmt(b)} = lg ${fmt(b)} : lg ${fmt(a)}`, `x ≈ ${f4(lg(b))} : ${paren(lg(a), 4)}`, `<strong>x ≈ ${fmt(x, 2)}</strong>`],
          meta: { a, b },
        };
      }
    }
    for (;;) {
      const k = rng.pick([2, 3, 4, 5, 0.5]);
      const a = rng.pick([1.5, 2, 3, 1.2, 0.8]);
      const w = rng.pick([0.4, 0.6, 2.5, 3, 5, 6, 7, 10, 12, 20, 30]);
      const solvable = rng.next() < 0.8;
      const r = (solvable ? 1 : -1) * k * w;
      const prompt = `Bestimme die Lösung der Gleichung ${fmt(k)} · ${pow(a, "x")} = ${fmt(r)}. Runde auf zwei Nachkommastellen. Hat die Gleichung keine Lösung, wähle „keine Lösung“.`;
      if (!solvable) {
        return {
          prompt,
          given: [`${fmt(k)} · ${pow(a, "x")} = ${fmt(r)}`],
          fields: [choiceField("Die Gleichung hat", ["genau eine Lösung", "keine Lösung"], 1)],
          steps: [`Durch ${fmt(k)} teilen: ${pow(a, "x")} = ${fmt(r / k)}`, `<strong>Keine Lösung: ${pow(a, "x")} ist für jedes x positiv.</strong>`],
          meta: { k, a, r },
        };
      }
      const x = logBase(a, w);
      if (nearTrap(x)) continue;
      return {
        prompt,
        given: [`${fmt(k)} · ${pow(a, "x")} = ${fmt(r)}`],
        fields: [
          choiceField("Die Gleichung hat", ["genau eine Lösung", "keine Lösung"], 0),
          numberField("x ≈", x, "", 2, { slips: [{ value: logBase(a, r), hint: "Erst durch den Faktor vor der Potenz teilen, dann logarithmieren." }] }),
        ],
        steps: [`Durch ${fmt(k)} teilen: ${pow(a, "x")} = ${fmt(w)}`, `x = lg ${fmt(w)} : lg ${fmt(a)}`, `<strong>x ≈ ${fmt(x, 2)}</strong>`],
        meta: { k, a, r },
      };
    }
  },
};

const wann: ExerciseGenerator = {
  id: "wann",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const N0 = rng.pick([100, 200, 250, 400, 500]);
      const a = rng.pick([1.05, 1.08, 1.1, 1.2, 1.25, 0.9, 0.8, 0.75]);
      const factor = a > 1 ? rng.pick([2, 2.5, 3, 4, 5]) : rng.pick([0.5, 0.4, 0.25, 0.2, 0.1]);
      const N = N0 * factor;
      const t = logBase(a, factor);
      return {
        prompt: `Ein Bestand ${a > 1 ? "wächst" : "nimmt ab"} nach N(t) = ${fmt(N0)} · ${pow(a, "t")} (t in Jahren). Nach welcher Zeit ist N(t) = ${fmt(N)}? Runde auf zwei Nachkommastellen.`,
        given: [`N(t) = ${fmt(N0)} · ${pow(a, "t")}`, `N(t) = ${fmt(N)}`],
        formulaHint: "Erst durch N<sub>0</sub> teilen: a<sup>t</sup> = N : N<sub>0</sub>; dann t = lg(N : N<sub>0</sub>) : lg a",
        fields: [
          numberField("t ≈", t, "Jahre", 2, {
            slips: [
              { value: logBase(a, N), hint: "Erst durch N₀ teilen, dann logarithmieren." },
              { value: (N - N0) / (N0 * (a - 1)), hint: "So rechnet man linear. Hier wird jedes Jahr mit a multipliziert: logarithmieren." },
            ],
          }),
        ],
        steps: [`${fmt(N0)} · ${pow(a, "t")} = ${fmt(N)} ⇒ ${pow(a, "t")} = ${fmt(factor)}`, `t = lg ${fmt(factor)} : lg ${fmt(a)}`, `<strong>t ≈ ${fmt(t, 2)} Jahre</strong>`],
        meta: { N0, a, N },
      };
    }
    for (;;) {
      const scenario = rng.int(0, 2);
      let a: number;
      let f: number;
      let prompt: string;
      let given: string[];
      let unit: string;
      if (scenario === 0) {
        const K0 = rng.pick([2000, 3000, 5000, 6000, 8000]);
        const p = rng.pick([1.5, 2, 2.5, 3, 4]);
        f = rng.pick([1.25, 1.5, 2]);
        a = 1 + p / 100;
        unit = "Jahren";
        prompt = `Ein Kapital von ${fmt(K0)} € wird mit ${fmt(p)} % pro Jahr verzinst; die Zinsen werden mitverzinst. Nach wie vielen Jahren ist es zum ersten Mal auf mehr als ${fmt(K0 * f)} € angewachsen? Berechne zuerst die genaue Zeit.`;
        given = [`K<sub>0</sub> = ${fmtUnit(K0, "€")}`, `p = ${fmt(p)} %`, `Ziel: mehr als ${fmtUnit(K0 * f, "€")}`];
      } else if (scenario === 1) {
        const q = rng.pick([10, 12, 15, 20, 25]);
        f = rng.pick([0.5, 0.25, 0.1]);
        a = 1 - q / 100;
        unit = "Stunden";
        const share = f === 0.5 ? "die Hälfte" : f === 0.25 ? "ein Viertel" : "ein Zehntel";
        prompt = `Ein Medikament wird im Körper pro Stunde um ${q} % abgebaut. Nach wie vielen vollen Stunden ist zum ersten Mal weniger als ${share} der Anfangsmenge im Blut? Berechne zuerst die genaue Zeit.`;
        given = [`Abbau ${q} % pro Stunde`, `Ziel: weniger als ${share}`];
      } else {
        const P0 = rng.pick([12000, 25000, 40000]);
        const p = rng.pick([1, 1.5, 2, 2.5]);
        f = rng.pick([1.2, 1.5]);
        a = 1 + p / 100;
        unit = "Jahren";
        prompt = `Eine Stadt hat ${fmt(P0)} Einwohner. Ihre Einwohnerzahl wächst jährlich um ${fmt(p)} %. Nach wie vielen Jahren hat sie zum ersten Mal mehr als ${fmt(P0 * f)} Einwohner? Berechne zuerst die genaue Zeit.`;
        given = [`P<sub>0</sub> = ${fmt(P0)}`, `Zunahme ${fmt(p)} % pro Jahr`, `Ziel: mehr als ${fmt(P0 * f)}`];
      }
      const t = logBase(a, f);
      if (Math.abs(t - Math.round(t)) < 0.02) continue;
      const whole = Math.ceil(t);
      const shown = unit === "Jahren" ? "Jahre" : unit;
      return {
        prompt,
        given,
        fields: [
          numberField("genaue Zeit t ≈", t, shown, 2),
          numberField("zum ersten Mal nach", whole, shown, 0, { slips: [{ value: whole - 1, hint: "Nach dieser Zeit ist die Grenze noch nicht überschritten: Runde die genaue Zeit auf." }] }),
        ],
        steps: [`${pow(fmt(a, 3), "t")} = ${fmt(f, 2)}`, `t = lg ${fmt(f, 2)} : lg ${fmt(a, 3)} ≈ ${fmt(t, 2)}`, `<strong>t ≈ ${fmt(t, 2)}, also zum ersten Mal nach ${whole} ${unit}</strong>`],
        meta: { scenario, a, f },
      };
    }
  },
};

const logarithmus: Lesson = {
  id: "el-3-logarithmus",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "5.3 Der Logarithmus löst aˣ = b",
  subtitle: "Die Hochzahl hat einen Namen",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN_BOTH}, Logarithmus`,
  whyItMatters:
    "Wann hat sich das Guthaben verdoppelt, wann ist das Medikament abgebaut? Solche Fragen nach der Zeit beantwortet der Logarithmus.",
  explanationHtml: `
    <p>Die Gleichung 2<sup>x</sup> = 8 löst du im Kopf: x = 3. Doch welche Hochzahl löst 2<sup>x</sup> = 5? Diese Zahl heißt <strong>Logarithmus</strong> von 5 zur Basis 2:</p>
    <p class="formula-line">log<sub>a</sub> b = x &nbsp;⇔&nbsp; a<sup>x</sup> = b &nbsp; (a &gt; 0, a ≠ 1, b &gt; 0)</p>
    <ul>
      <li>log<sub>a</sub> b ist die <strong>Hochzahl</strong>, mit der man a potenzieren muss, um b zu erhalten: log<sub>2</sub> 32 = 5, weil 2<sup>5</sup> = 32, und log<sub>3</sub> ${fracHtml(1, 9)} = −2, weil 3<sup>−2</sup> = ${fracHtml(1, 9)}.</li>
      <li>Immer gilt log<sub>a</sub> 1 = 0 und log<sub>a</sub> a = 1.</li>
      <li>Der <strong>Zehnerlogarithmus</strong> heißt lg: lg 1000 = log<sub>10</sub> 1000 = 3. Auf dem Taschenrechner ist das die Taste <strong>log</strong>.</li>
      <li>Hat dein Taschenrechner keine Taste für log<sub>a</sub>, rechnest du <strong>log<sub>a</sub> b = lg b : lg a</strong>, zum Beispiel log<sub>2</sub> 5 = lg 5 : lg 2 ≈ 0,699 : 0,301 ≈ 2,32.</li>
      <li>Am Graphen: Die Gerade y = b schneidet den Graphen von y = a<sup>x</sup> bei x = log<sub>a</sub> b. Für b ≤ 0 gibt es keinen Schnittpunkt: 2<sup>x</sup> = −4 hat <strong>keine Lösung</strong>, weil a<sup>x</sup> immer positiv ist.</li>
    </ul>
    <p>Steht vor der Potenz noch ein Faktor, teilst du zuerst: 3 · 2<sup>x</sup> = 15 ⇒ 2<sup>x</sup> = 5 ⇒ x = log<sub>2</sub> 5 ≈ 2,32. So beantwortest du die Frage nach der Zeit bei Wachstum:</p>
    <div class="example">5000 € werden mit 3 % verzinst. Wann sind es 8000 €? 5000 · 1,03<sup>n</sup> = 8000 ⇒ 1,03<sup>n</sup> = 1,6 ⇒ n = log<sub>1,03</sub> 1,6 = lg 1,6 : lg 1,03 ≈ 15,9. Nach 16 Jahren sind es zum ersten Mal mehr als 8000 €.</div>
    <div class="merke"><strong>Merke:</strong> Der Logarithmus ist eine Hochzahl. a<sup>x</sup> = b ⇒ x = log<sub>a</sub> b = lg b : lg a, aber nur für b &gt; 0.</div>
  `,
  formulas: [
    { name: "Logarithmus", html: "log<sub>a</sub> b = x ⇔ a<sup>x</sup> = b", quantities: "a > 0, a ≠ 1, b > 0; der Logarithmus ist die Hochzahl x" },
    { name: "Zehnerlogarithmus und Taschenrechner", html: "lg b = log<sub>10</sub> b; log<sub>a</sub> b = lg b : lg a", quantities: "Taste log; die Umrechnung gilt für jede Basis a" },
    { name: "Exponentialgleichung", html: "a<sup>x</sup> = b ⇒ x = log<sub>a</sub> b", quantities: "nur für b > 0; für b ≤ 0 gibt es keine Lösung" },
  ],
  quiz: {
    question: "Was gibt log₂ 32 an?",
    options: [
      "die Hochzahl, mit der man 2 potenzieren muss, um 32 zu erhalten",
      "die Zahl, mit der man 2 multiplizieren muss, um 32 zu erhalten",
      "die Zahl, deren Quadrat 32 ergibt",
    ],
    correctIndex: 0,
    explanation: "log₂ 32 = 5, denn 2⁵ = 32. Mit 16 multiplizieren wäre 2 · 16 = 32, und die Zahl mit dem Quadrat 32 ist √32 ≈ 5,66.",
  },
  lab: {
    kind: "log-solve",
    title: "Labor: Die Hochzahl am Graphen ablesen",
    intro: "Die Gerade y = b schneidet den Graphen von y = aˣ genau bei x = logₐ b. Ziehe die Gerade am rechten Rand oder den Schnittpunkt S entlang der Kurve.",
    params: [
      { type: "choice", key: "a", label: "Basis a", options: [0.5, 1.5, 2, 3, 10].map((a) => ({ value: a, label: fmt(a) })), value: 2 },
      { type: "range", key: "b", label: "Zahl b", unit: "", min: -2, max: 16, step: 0.5, value: 5, digits: 1 },
    ],
    readouts: [
      { key: "eq", label: "Gleichung", compute: (v) => `${powText(fmt(v.a), "x")} = ${fmt(v.b)}` },
      {
        key: "x",
        label: "Lösung",
        emphasis: true,
        compute: (v) => (v.b > 0 ? `x = ${logName(v.a)} ${fmt(v.b)} ≈ ${fmt(logBase(v.a, v.b), 3)}` : `keine Lösung, denn ${powText(fmt(v.a), "x")} ist immer positiv`),
      },
      {
        key: "tr",
        label: "Mit dem Taschenrechner",
        compute: (v) =>
          v.b <= 0 ? "keine Rechnung möglich: lg b gibt es nur für b > 0" : v.a === 10 ? `Taste log: lg ${fmt(v.b)} ≈ ${fmt(lg(v.b), 3)}` : `lg ${fmt(v.b)} : lg ${fmt(v.a)} ≈ ${fmt(lg(v.b), 4)} : ${paren(lg(v.a), 4)}`,
      },
    ],
    goals: [
      { id: "acht", text: "Löse 2ˣ = 8 am Graphen.", check: (v) => v.a === 2 && v.b === 8 },
      { id: "keine", text: "Stelle eine Gleichung aˣ = b ein, die keine Lösung hat.", check: (v) => v.b <= 0 },
      { id: "minus-eins", text: "Stelle b so ein, dass log₂ b = −1 ist.", check: (v) => v.a === 2 && v.b === 0.5 },
    ],
  },
  exercises: [logwert, gleichung, wann],
  requiredCorrect: 3,
  celebrationMessage: "Du löst aˣ = b mit dem Logarithmus und beantwortest damit Zeitfragen bei Wachstum und Abnahme.",
};

// 5.4 Logarithmensätze und Exponentialgleichungen ───────────────────────────

function ruleText(v: LabValues): string {
  const U = fmt(v.u);
  const V = fmt(v.v);
  if (v.rule === 0) return `lg(${U} · ${V}) = lg ${U} + lg ${V}`;
  if (v.rule === 1) return `lg(${U} : ${V}) = lg ${U} − lg ${V}`;
  if (v.rule === 2) return `lg(${powText(U, fmt(v.r))}) = ${fmt(v.r)} · lg ${U}`;
  return `${logName(v.u)} ${V} = lg ${V} : lg ${U}`;
}

function ruleValues(v: LabValues): string {
  const lu = lg(v.u);
  const lv = lg(v.v);
  if (v.rule === 0) return `${f4(lg(v.u * v.v))} = ${f4(lu)} + ${paren(lv, 4)}`;
  if (v.rule === 1) return `${f4(lg(v.u / v.v))} = ${f4(lu)} − ${paren(lv, 4)}`;
  if (v.rule === 2) return `${f4(v.r * lu)} = ${fmt(v.r)} · ${paren(lu, 4)}`;
  return lu === 0 ? "Basis 1 ist nicht erlaubt: lg 1 = 0" : `${f4(lv / lu)} = ${f4(lv)} : ${paren(lu, 4)}`;
}

function wrongRule(v: LabValues): string {
  const lu = lg(v.u);
  const lv = lg(v.v);
  const U = fmt(v.u);
  const V = fmt(v.v);
  const compare = (wrong: number, right: number) => `${f4(wrong)} ${Math.abs(wrong - right) < 1e-9 ? "=" : "≠"} ${f4(right)}`;
  if (v.rule === 0) return `lg(${U} + ${V}) = ${compare(lg(v.u + v.v), lu + lv)}`;
  if (v.rule === 1) return lv === 0 ? "lg u : lg v: Division durch lg 1 = 0" : `lg ${U} : lg ${V} = ${compare(lu / lv, lu - lv)}`;
  if (v.rule === 2) {
    const wrong = lu ** v.r;
    return Number.isFinite(wrong) ? `${powText(`(lg ${U})`, fmt(v.r))} = ${compare(wrong, v.r * lu)}` : `${powText(`(lg ${U})`, fmt(v.r))} ist hier nicht definiert`;
  }
  return lu === 0 ? "keine: Die Basis 1 ist nicht erlaubt" : `lg(${V} : ${U}) = ${compare(lg(v.v / v.u), lv / lu)}`;
}

/** Σ cᵢ · log_a(nᵢ) = log_a(N) = value, for simplifying with the rules. */
const COMBOS: Array<{ a: number; terms: Array<[number, number]>; value: number }> = [
  { a: 10, terms: [[2, 5], [1, 4]], value: 2 },
  { a: 10, terms: [[1, 8], [1, 50], [-1, 4]], value: 2 },
  { a: 10, terms: [[3, 2], [1, 125]], value: 3 },
  { a: 2, terms: [[1, 24], [-1, 3], [2, 2]], value: 5 },
  { a: 3, terms: [[1, 18], [1, 4.5]], value: 4 },
  { a: 10, terms: [[0.5, 16], [1, 25]], value: 2 },
  { a: 2, terms: [[2, 6], [-1, 9]], value: 2 },
  { a: 10, terms: [[1, 0.2], [1, 5], [1, 1000]], value: 3 },
  { a: 5, terms: [[1, 50], [-1, 2], [1, 5]], value: 3 },
  { a: 4, terms: [[3, 2], [1, 8]], value: 3 },
  { a: 10, terms: [[2, 3], [-1, 0.9]], value: 1 },
];

function comboHtml(a: number, terms: Array<[number, number]>): string {
  return terms
    .map(([c, n], i) => {
      const sign = c < 0 ? "− " : i === 0 ? "" : "+ ";
      const abs = Math.abs(c);
      const coefficient = abs === 1 ? "" : abs === 0.5 ? "½ · " : `${fmt(abs)} · `;
      return `${sign}${coefficient}${logNameHtml(a)} ${fmt(n)}`;
    })
    .join(" ");
}

/** lg n for numbers built from 2, 3 and 10, with lg 2 ≈ 0,3010 and lg 3 ≈ 0,4771. */
const FACTORED: Array<{ n: number; two: number; three: number; ten: number }> = [
  { n: 12, two: 2, three: 1, ten: 0 },
  { n: 1.5, two: -1, three: 1, ten: 0 },
  { n: 18, two: 1, three: 2, ten: 0 },
  { n: 6, two: 1, three: 1, ten: 0 },
  { n: 0.75, two: -2, three: 1, ten: 0 },
  { n: 24, two: 3, three: 1, ten: 0 },
  { n: 5, two: -1, three: 0, ten: 1 },
  { n: 15, two: -1, three: 1, ten: 1 },
  { n: 2.25, two: -2, three: 2, ten: 0 },
];

const saetze: ExerciseGenerator = {
  id: "saetze",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const [u, v, n] = rng.pick([
          [2, 5, 1],
          [4, 25, 2],
          [20, 50, 3],
          [8, 125, 3],
          [0.5, 20, 1],
          [40, 25, 3],
          [2.5, 4, 1],
          [5, 200, 3],
        ]);
        return {
          prompt: `Berechne ohne Taschenrechner mit dem Produktsatz: lg ${fmt(u)} + lg ${fmt(v)}.`,
          given: [`lg ${fmt(u)} + lg ${fmt(v)}`],
          formulaHint: "Produktsatz: lg u + lg v = lg(u · v)",
          fields: [numberField("Wert =", n, "", 0, { slips: [{ value: lg(u + v), hint: "Beim Produktsatz werden u und v multipliziert, nicht addiert." }] })],
          steps: [`lg ${fmt(u)} + lg ${fmt(v)} = lg(${fmt(u)} · ${fmt(v)}) = lg ${fmt(u * v)}`, `<strong>= ${n}</strong>, weil ${pow(10, n)} = ${fmt(u * v)}`],
          meta: { kind, u, v },
        };
      }
      if (kind === 1) {
        const [a, u, v] = rng.pick([
          [2, 40, 5],
          [2, 12, 3],
          [3, 54, 2],
          [5, 250, 2],
          [10, 500, 5],
          [2, 48, 3],
          [3, 162, 2],
          [2, 5, 40],
        ]);
        const n = Math.round(logBase(a, u / v));
        return {
          prompt: `Berechne ohne Taschenrechner mit dem Quotientensatz: ${logNameHtml(a)} ${fmt(u)} − ${logNameHtml(a)} ${fmt(v)}.`,
          given: [`${logNameHtml(a)} ${fmt(u)} − ${logNameHtml(a)} ${fmt(v)}`],
          formulaHint: "Quotientensatz: log<sub>a</sub> u − log<sub>a</sub> v = log<sub>a</sub>(u : v)",
          fields: [numberField("Wert =", n, "", 0, { slips: [{ value: logBase(a, u) / logBase(a, v), hint: "log u − log v = log(u : v); die Logarithmen selbst werden nicht geteilt." }] })],
          steps: [`= ${logNameHtml(a)}(${fmt(u)} : ${fmt(v)}) = ${logNameHtml(a)} ${powerShown(a, n)}`, `<strong>= ${fmt(n)}</strong>, weil ${pow(a, n)} = ${powerShown(a, n)}`],
          meta: { kind, a, u, v },
        };
      }
      const [a, u, r] = rng.pick([
        [2, 8, 5],
        [3, 9, 4],
        [10, 100, 3],
        [2, 4, 7],
        [5, 25, 3],
        [10, 1000, -2],
      ]);
      const inner = Math.round(logBase(a, u));
      const value = r * inner;
      return {
        prompt: `Berechne ohne Taschenrechner mit dem Potenzsatz: ${logNameHtml(a)}(${pow(u, r)}).`,
        given: [`${logNameHtml(a)}(${pow(u, r)})`],
        formulaHint: "Potenzsatz: log<sub>a</sub>(u<sup>r</sup>) = r · log<sub>a</sub> u",
        fields: [numberField("Wert =", value, "", 0, { slips: [{ value: inner ** r, hint: "Die Hochzahl r wird zum Faktor vor dem Logarithmus: r · log u, nicht (log u)ʳ." }] })],
        steps: [`${logNameHtml(a)}(${pow(u, r)}) = ${fmt(r)} · ${logNameHtml(a)} ${fmt(u)} = ${fmt(r)} · ${inner}`, `<strong>= ${fmt(value)}</strong>`],
        meta: { kind, a, u, r },
      };
    }
    if (rng.next() < 0.5) {
      const { a, terms, value } = rng.pick(COMBOS);
      const N = terms.reduce((product, [c, n]) => product * n ** c, 1);
      const withPowers = terms.map(([c, n]) => [c < 0 ? -1 : 1, Math.abs(c) === 1 ? n : n ** Math.abs(c)] as [number, number]);
      const powered = terms.some(([c]) => Math.abs(c) !== 1);
      const slips: Slip[] = powered ? [{ value: terms.reduce((s, [c, n]) => s + Math.sign(c) * logBase(a, n), 0), hint: "Der Faktor vor dem Logarithmus wird zur Hochzahl: r · log u = log(uʳ)." }] : [];
      return {
        prompt: `Fasse mit den Logarithmensätzen zu einem einzigen Logarithmus zusammen und berechne den Wert ohne Taschenrechner: ${comboHtml(a, terms)}.`,
        given: [comboHtml(a, terms)],
        fields: [numberField("Wert =", value, "", 0, { slips })],
        steps: [
          powered ? `Potenzsatz: ${comboHtml(a, withPowers)}` : "Produkt- und Quotientensatz anwenden",
          `= ${logNameHtml(a)} ${fmt(N, 4)}`,
          `<strong>= ${value}</strong>, weil ${pow(a, value)} = ${fmt(N, 4)}`,
        ],
        meta: { a, value, N },
      };
    }
    const item = rng.pick(FACTORED);
    const approx = Number((item.two * 0.301 + item.three * 0.4771 + item.ten).toFixed(4));
    const parts: Array<[number, string]> = [];
    if (item.ten) parts.push([item.ten, "lg 10"]);
    if (item.two) parts.push([item.two, `${Math.abs(item.two) === 1 ? "" : `${Math.abs(item.two)} · `}lg 2`]);
    if (item.three) parts.push([item.three, `${Math.abs(item.three) === 1 ? "" : `${Math.abs(item.three)} · `}lg 3`]);
    const expression = parts.map(([c, part], i) => `${c < 0 ? (i === 0 ? "−" : "− ") : i === 0 ? "" : "+ "}${part}`).join(" ");
    return {
      prompt: `Es ist lg 2 ≈ 0,3010 und lg 3 ≈ 0,4771. Berechne damit lg ${fmt(item.n)} ohne die log-Taste. Zerlege ${fmt(item.n)} dazu in Faktoren 2, 3 und 10.`,
      given: ["lg 2 ≈ 0,3010", "lg 3 ≈ 0,4771", "lg 10 = 1"],
      fields: [numberField(`lg ${fmt(item.n)} ≈`, approx, "", 4, { absTolerance: 0.0006 })],
      steps: [`lg ${fmt(item.n)} = ${expression}`, `<strong>lg ${fmt(item.n)} ≈ ${fmt(approx, 4)}</strong>`],
      meta: { n: item.n, two: item.two, three: item.three, ten: item.ten },
    };
  },
};

const ANY_SOLUTION = ["genau eine Lösung", "keine Lösung"];

const exponentialgleichung: ExerciseGenerator = {
  id: "exponentialgleichung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const k = rng.pick([2, 3, 4, 5, 0.5]);
        const a = rng.pick([2, 3, 5, 1.5, 4]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const exact = rng.next() < 0.5;
        const m = rng.pick([1, 2, 3]);
        const w = exact ? a ** m : rng.pick([5, 6, 7, 10, 12, 20]);
        const L = exact ? m : logBase(a, w);
        const c = -k * w;
        const x = b + L;
        if (nearTrap(x)) continue;
        return {
          prompt: `Löse die Gleichung ${expHtml(k, a, b, c)} = 0. Runde, wo nötig, auf zwei Nachkommastellen.`,
          given: [`${expHtml(k, a, b, c)} = 0`],
          formulaHint: "Potenz isolieren: a<sup>x − b</sup> = −c : k; dann logarithmieren: x − b = log<sub>a</sub>(−c : k)",
          fields: [
            numberField("x =", x, "", 2, {
              slips: [
                { value: L, hint: "Das ist x − b. Addiere noch b." },
                { value: L - b, hint: "Vorzeichen: Aus x − b = … folgt x = … + b." },
                { value: b + logBase(a, -c), hint: "Erst durch k teilen, dann logarithmieren." },
              ],
            }),
          ],
          steps: [
            `${expHtml(k, a, b)} = ${fmt(-c)} ⇒ ${pow(a, shiftedArg(b))} = ${fmt(w)}`,
            `${shiftedArg(b)} = ${logNameHtml(a)} ${fmt(w)} ${exact ? "=" : "≈"} ${f4(L)}`,
            `<strong>x ${exact ? "=" : "≈"} ${fmt(x, 2)}</strong>`,
          ],
          meta: { k, a, b, c },
        };
      }
    }
    for (;;) {
      const variant = rng.int(0, 3);
      if (variant === 3) {
        const k = rng.pick([2, 3, 5]);
        const a = rng.pick([2, 3, 5]);
        const c = rng.pick([4, 6, 10, 12]);
        return {
          prompt: `Bestimme die Lösungsmenge der Gleichung ${expHtml(k, a, 0, c)} = 0.`,
          given: [`${expHtml(k, a, 0, c)} = 0`],
          fields: [choiceField("Die Gleichung hat", ANY_SOLUTION, 1)],
          steps: [`${expHtml(k, a)} = ${fmt(-c)} ⇒ ${pow(a, "x")} = ${fmt(-c / k, 4)}`, `<strong>Keine Lösung: ${pow(a, "x")} ist immer positiv, also L = { }.</strong>`],
          meta: { variant, k, a, c },
        };
      }
      if (variant === 0) {
        const k = rng.pick([2, 3, 4, 5]);
        const a = rng.pick([2, 3]);
        const m = rng.pick([2, 3]);
        const n = rng.pick([-1, 1, 2]);
        const exact = rng.next() < 0.5;
        const e = rng.pick([1, 2, 3]);
        const w = exact ? a ** e : rng.pick([5, 7, 10]);
        const L = exact ? e : logBase(a, w);
        const c = rng.pick([-12, -6, 5, 8]);
        const d = k * w + c;
        const x = (L - n) / m;
        if (nearTrap(x)) continue;
        const expo = `${m}x ${n < 0 ? "−" : "+"} ${Math.abs(n)}`;
        return {
          prompt: `Löse die Gleichung ${fmt(k)} · ${pow(a, expo)}${plusConst(c)} = ${fmt(d)} schrittweise. Runde auf zwei Nachkommastellen.`,
          given: [`${fmt(k)} · ${pow(a, expo)}${plusConst(c)} = ${fmt(d)}`],
          fields: [
            choiceField("Die Gleichung hat", ANY_SOLUTION, 0),
            numberField("x ≈", x, "", 2, {
              slips: [
                { value: L / m, hint: `Vergiss das ${n < 0 ? "−" : "+"} ${Math.abs(n)} in der Hochzahl nicht.` },
                { value: (L + n) / m, hint: "Vorzeichen: Die Zahl in der Hochzahl kommt mit dem umgekehrten Vorzeichen auf die andere Seite." },
              ],
            }),
          ],
          steps: [
            `${fmt(k)} · ${pow(a, expo)} = ${fmt(d - c)} ⇒ ${pow(a, expo)} = ${fmt(w)}`,
            `${expo} = ${logNameHtml(a)} ${fmt(w)} ${exact ? "=" : "≈"} ${f4(L)}`,
            `${m}x = ${f4(L - n)} ⇒ <strong>x ≈ ${fmt(x, 2)}</strong>`,
          ],
          meta: { variant, k, a, m, n, c, d },
        };
      }
      const a = variant === 1 ? rng.pick([2, 3]) : rng.pick([2, 3, 5]);
      const s = rng.pick([1, 2]);
      const w = rng.pick([2, 3, 4, 5, 8, 9]);
      const factor = variant === 1 ? a ** s + 1 : a ** s - 1;
      const r = w * factor;
      const x = logBase(a, w);
      if (nearTrap(x)) continue;
      const sum = `${pow(a, `x + ${s}`)} ${variant === 1 ? "+" : "−"} ${pow(a, "x")}`;
      return {
        prompt: `Löse die Gleichung ${sum} = ${fmt(r)}. Klammere dazu ${pow(a, "x")} aus. Runde auf zwei Nachkommastellen.`,
        given: [`${sum} = ${fmt(r)}`],
        fields: [
          choiceField("Die Gleichung hat", ANY_SOLUTION, 0),
          numberField("x ≈", x, "", 2, { slips: [{ value: logBase(a, r), hint: `Erst ${powText(fmt(a), "x")} ausklammern und durch den Faktor teilen, dann logarithmieren.` }] }),
        ],
        steps: [
          `${pow(a, `x + ${s}`)} = ${fmt(a ** s)} · ${pow(a, "x")}, also ${fmt(factor)} · ${pow(a, "x")} = ${fmt(r)}`,
          `${pow(a, "x")} = ${fmt(w)}`,
          `<strong>x = ${logNameHtml(a)} ${fmt(w)} ≈ ${fmt(x, 2)}</strong>`,
        ],
        meta: { variant, a, s, r },
      };
    }
  },
};

const basiswechsel: ExerciseGenerator = {
  id: "basiswechsel",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const a = rng.pick([3, 6, 7, 1.5, 0.5, 12]);
        const b = rng.pick([5, 20, 50, 100, 0.2, 250]);
        const value = lg(b) / lg(a);
        if (nearTrap(value) || Math.abs(value - Math.round(value)) < 1e-9) continue;
        return {
          prompt: `Berechne ${logNameHtml(a)} ${fmt(b)} mit dem Basiswechsel über den Zehnerlogarithmus. Runde auf drei Nachkommastellen.`,
          given: [`${logNameHtml(a)} ${fmt(b)}`],
          formulaHint: "Basiswechsel: log<sub>a</sub> b = lg b : lg a",
          fields: [
            numberField(`${logNameHtml(a)} ${fmt(b)} ≈`, value, "", 3, {
              slips: [
                { value: lg(b) * lg(a), hint: "Beim Basiswechsel wird geteilt, nicht multipliziert." },
                { value: lg(a) / lg(b), hint: "Umgekehrt: lg b steht im Zähler, lg a im Nenner." },
                { value: lg(b / a), hint: "lg b : lg a ist nicht dasselbe wie lg(b : a)." },
              ],
            }),
          ],
          steps: [`${logNameHtml(a)} ${fmt(b)} = lg ${fmt(b)} : lg ${fmt(a)}`, `≈ ${f4(lg(b))} : ${paren(lg(a), 4)}`, `<strong>≈ ${fmt(value, 3)}</strong>`],
          meta: { a, b },
        };
      }
    }
    for (;;) {
      const [p, a] = rng.pick([
        [1, 2],
        [2, 1.5],
        [4, 1.5],
        [0.5, 3],
        [1, 3],
        [3, 2],
      ]);
      const [q, b] = rng.pick([
        [1, 3],
        [2, 2],
        [8, 1.5],
        [6, 1.2],
        [3, 1.5],
        [16, 0.5],
      ]);
      if (a === b || p === q) continue;
      const x = lg(q / p) / lg(a / b);
      const y = p * a ** x;
      if (!Number.isFinite(x) || Math.abs(x) > 12 || y < 0.05 || y > 5000 || nearTrap(x, y)) continue;
      return {
        prompt: `Die Graphen der Funktionen f: y = ${expHtml(p, a)} und g: y = ${expHtml(q, b)} schneiden sich im Punkt S. Berechne die Koordinaten von S. Runde auf zwei Nachkommastellen.`,
        given: [`f: y = ${expHtml(p, a)}`, `g: y = ${expHtml(q, b)}`],
        fields: [numberField("x<sub>S</sub> ≈", x, "", 2), numberField("y<sub>S</sub> ≈", y, "", 2)],
        steps: [
          `Gleichsetzen: ${expHtml(p, a)} = ${expHtml(q, b)}`,
          `Logarithmieren: lg ${fmt(p)} + x · lg ${fmt(a)} = lg ${fmt(q)} + x · lg ${fmt(b)}`,
          `x · (lg ${fmt(a)} − lg ${fmt(b)}) = lg ${fmt(q)} − lg ${fmt(p)} ⇒ x ≈ ${fmt(x, 2)}`,
          `<strong>S(${fmt(x, 2)} | ${fmt(y, 2)})</strong>`,
        ],
        meta: { p, a, q, b },
      };
    }
  },
};

const logarithmensaetze: Lesson = {
  id: "el-4-logarithmensaetze",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "5.4 Logarithmensätze und Exponentialgleichungen",
  subtitle: "Aus Malnehmen wird Addieren",
  tracks: ["I"],
  lehrplan: "M10 LB 4 (I): Logarithmen, Logarithmensätze und Exponentialgleichungen",
  whyItMatters:
    "Mit den Logarithmensätzen holst du die Unbekannte aus dem Exponenten und löst auch Exponentialgleichungen, in denen die Potenz zweimal vorkommt.",
  explanationHtml: `
    <p>Logarithmen sind Hochzahlen. Deshalb folgen aus den Potenzgesetzen die <strong>Logarithmensätze</strong> (für a &gt; 0, a ≠ 1 und u, v &gt; 0):</p>
    <ul>
      <li><strong>Produktsatz:</strong> log<sub>a</sub>(u · v) = log<sub>a</sub> u + log<sub>a</sub> v, denn a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>.</li>
      <li><strong>Quotientensatz:</strong> log<sub>a</sub>(u : v) = log<sub>a</sub> u − log<sub>a</sub> v.</li>
      <li><strong>Potenzsatz:</strong> log<sub>a</sub>(u<sup>r</sup>) = r · log<sub>a</sub> u, zum Beispiel lg ${sqrtHtml(10)} = lg 10<sup>0,5</sup> = 0,5.</li>
      <li><strong>Basiswechsel:</strong> log<sub>a</sub> b = lg b : lg a. Begründung: Aus a<sup>x</sup> = b folgt lg(a<sup>x</sup>) = lg b, also x · lg a = lg b.</li>
    </ul>
    <p>Vorsicht, diese „Regeln“ gibt es <strong>nicht</strong>: lg(u + v) ≠ lg u + lg v, lg(u · v) ≠ lg u · lg v und lg u : lg v ≠ lg(u : v). Beispiel: lg 2 + lg 3 = lg 6 ≈ 0,778, aber lg(2 + 3) = lg 5 ≈ 0,699.</p>
    <p><strong>Gleichungen der Form k · a<sup>x − b</sup> + c = 0</strong> löst du in drei Schritten:</p>
    <ol class="steps">
      <li><strong>Potenz isolieren:</strong> 4 · 2<sup>3x − 1</sup> − 12 = 20 ⇒ 4 · 2<sup>3x − 1</sup> = 32 ⇒ 2<sup>3x − 1</sup> = 8</li>
      <li><strong>Logarithmieren:</strong> 3x − 1 = log<sub>2</sub> 8 = 3</li>
      <li><strong>Nach x auflösen:</strong> 3x = 4 ⇒ x = ${fracHtml(4, 3)} ≈ 1,33</li>
    </ol>
    <p>Kommt die Potenz zweimal vor, fasst du sie mit den Potenzgesetzen zusammen: 2<sup>x + 1</sup> + 2<sup>x</sup> = 2 · 2<sup>x</sup> + 2<sup>x</sup> = 3 · 2<sup>x</sup>. Stehen verschiedene Basen auf beiden Seiten, logarithmierst du beide Seiten: 2<sup>x</sup> = 3<sup>x − 1</sup> ⇒ x · lg 2 = (x − 1) · lg 3 ⇒ x = lg 3 : (lg 3 − lg 2) ≈ 2,71.</p>
    <div class="example">5 · 3<sup>x + 2</sup> − 15 = 0 ⇒ 3<sup>x + 2</sup> = 3 ⇒ x + 2 = 1 ⇒ x = −1. Dagegen hat 2 · 3<sup>x</sup> + 6 = 0 keine Lösung, denn 3<sup>x</sup> = −3 ist unmöglich.</div>
    <div class="merke"><strong>Merke:</strong> Produkt → Summe, Quotient → Differenz, Potenz → Faktor. Erst die Potenz isolieren, dann logarithmieren.</div>
  `,
  formulas: [
    {
      name: "Produkt- und Quotientensatz",
      html: "log<sub>a</sub>(u · v) = log<sub>a</sub> u + log<sub>a</sub> v; log<sub>a</sub>(u : v) = log<sub>a</sub> u − log<sub>a</sub> v",
      quantities: "u, v > 0; a > 0, a ≠ 1",
    },
    { name: "Potenzsatz", html: "log<sub>a</sub>(u<sup>r</sup>) = r · log<sub>a</sub> u", quantities: "u > 0, r eine beliebige Zahl" },
    { name: "Basiswechsel", html: "log<sub>a</sub> b = lg b : lg a", quantities: "folgt aus dem Potenzsatz; damit rechnet der Taschenrechner" },
  ],
  quiz: {
    question: "Welche Gleichung ist ein Logarithmensatz?",
    options: ["lg(u + v) = lg u + lg v", "lg(u · v) = lg u + lg v", "lg(u · v) = lg u · lg v", "lg(uʳ) = (lg u)ʳ"],
    correctIndex: 1,
    explanation: "Logarithmen sind Hochzahlen, und beim Multiplizieren von Zehnerpotenzen addieren sich die Hochzahlen. Gegenbeispiel zur ersten Gleichung: lg 2 + lg 3 = lg 6 ≈ 0,778, aber lg(2 + 3) = lg 5 ≈ 0,699.",
  },
  lab: {
    kind: "log-rules",
    title: "Labor: Logarithmen am Zahlenstrahl",
    intro: "Oben liegen die Logarithmen (Hochzahlen von 10), unten die Zahlen selbst. Ziehe die Pfeilspitzen: Zahlen multiplizieren heißt ihre Logarithmen aneinanderlegen. Der rote Punkt zeigt, was eine falsche Regel liefern würde.",
    params: [
      {
        type: "choice",
        key: "rule",
        label: "Satz",
        options: [
          { value: 0, label: "Produktsatz" },
          { value: 1, label: "Quotientensatz" },
          { value: 2, label: "Potenzsatz" },
          { value: 3, label: "Basiswechsel" },
        ],
        value: 0,
      },
      { type: "range", key: "u", label: "Zahl u", unit: "", min: 0.5, max: 50, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "v", label: "Zahl v", unit: "", min: 0.5, max: 50, step: 0.5, value: 3, digits: 1, showIf: (v) => v.rule !== 2 },
      { type: "range", key: "r", label: "Hochzahl r", unit: "", min: -2, max: 3, step: 0.5, value: 2, digits: 1, showIf: (v) => v.rule === 2 },
    ],
    readouts: [
      { key: "satz", label: "Satz mit deinen Zahlen", emphasis: true, compute: ruleText },
      { key: "wert", label: "Beide Seiten", compute: ruleValues },
      { key: "falsch", label: "Falsche Regel", compute: wrongRule },
    ],
    goals: [
      {
        id: "hundert",
        text: "Produktsatz: Finde zwei Zahlen u und v, beide ungleich 10, deren Logarithmen zusammen genau 2 ergeben.",
        check: (v) => v.rule === 0 && Math.abs(v.u * v.v - 100) < 1e-9 && v.u !== 10 && v.v !== 10,
      },
      {
        id: "zufall",
        text: "Finde beim Produktsatz zwei Zahlen u und v, für die auch die falsche Regel lg(u + v) = lg u + lg v zufällig stimmt.",
        check: (v) => v.rule === 0 && Math.abs(v.u + v.v - v.u * v.v) < 1e-9,
      },
      {
        id: "acht",
        text: "Potenzsatz: Stelle u und r mit r ≠ 1 so ein, dass uʳ = 8 ist, also r · lg u = lg 8.",
        check: (v) => v.rule === 2 && v.r !== 1 && Math.abs(v.u ** v.r - 8) < 1e-9,
      },
    ],
  },
  exercises: [saetze, exponentialgleichung, basiswechsel],
  requiredCorrect: 3,
  celebrationMessage: "Du wendest die Logarithmensätze an und löst Exponentialgleichungen Schritt für Schritt.",
};

// 5.5 Exponentialfunktionen y = k · a^(x − b) + c ───────────────────────────

function expZero(v: LabValues): string {
  if (v.k === 0) return v.c === 0 ? "jedes x" : "keine";
  if (-v.c / v.k <= 0) return "keine";
  return `x ≈ ${fmt(v.b + logBase(v.a, -v.c / v.k), 2)}`;
}

const W_OPTIONS = (c: number) => [`𝕎 = {y | y > ${fmt(c)}}`, `𝕎 = {y | y < ${fmt(c)}}`, "𝕎 = ℝ"];

const eigenschaftenExp: ExerciseGenerator = {
  id: "eigenschaften",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const k = rng.pick([-3, -2, -1, -0.5, 0.5, 2, 3]);
        const a = rng.pick([2, 3, 0.5, 4]);
        const b = rng.int(-3, 3);
        const c = rng.int(-5, 5);
        const f0 = k * a ** -b + c;
        if (nearTrap(c, f0)) continue;
        return {
          prompt: `Gegeben ist die Funktion f mit y = ${expHtml(k, a, b, c)}. Gib die Gleichung der Asymptote und die Wertemenge an, und berechne, wo der Graph die y-Achse schneidet.`,
          given: [`f: y = ${expHtml(k, a, b, c)}`],
          formulaHint: "y = k · a<sup>x − b</sup> + c: Asymptote y = c; 𝕎 = {y | y &gt; c} für k &gt; 0, 𝕎 = {y | y &lt; c} für k &lt; 0; y-Achse: x = 0 einsetzen",
          fields: [
            numberField("Asymptote: y =", c, "", 2, {
              slips: [
                { value: k, hint: "k streckt den Graphen nur. Die Asymptote liefert die Verschiebung c." },
                { value: b, hint: "b verschiebt waagrecht. Die waagrechte Asymptote ist y = c." },
              ],
            }),
            choiceField("Wertemenge", W_OPTIONS(c), k > 0 ? 0 : 1),
            numberField("Schnitt mit der y-Achse: y =", f0, "", 2, {
              slips: [
                { value: k * a ** b + c, hint: "Bei x = 0 steht im Exponenten 0 − b, also −b." },
                { value: k + c, hint: "k + c ist der Funktionswert bei x = b, nicht bei x = 0." },
              ],
            }),
          ],
          steps: [
            `Asymptote y = ${fmt(c)}; k = ${fmt(k)} ${k > 0 ? "&gt;" : "&lt;"} 0, also 𝕎 = {y | y ${k > 0 ? "&gt;" : "&lt;"} ${fmt(c)}}`,
            `f(0) = ${fmt(k)} · ${pow(a, -b)} ${signed(c, 0)} = ${fmt(k * a ** -b, 4)} ${signed(c, 0)}`,
            `<strong>S<sub>y</sub>(0 | ${fmt(f0, 2)})</strong>`,
          ],
          meta: { k, a, b, c },
        };
      }
    }
    for (;;) {
      const k = rng.pick([0.5, 2, 3, -0.5, -2, -1]);
      const a = rng.pick([2, 3, 0.5]);
      const b = rng.int(-3, 3);
      const c = -Math.sign(k) * rng.pick([1, 2, 3, 4, 6]);
      const zero = b + logBase(a, -c / k);
      if (nearTrap(zero, c)) continue;
      return {
        prompt: `Gegeben ist die Funktion f mit der Gleichung y = ${expHtml(k, a, b, c)} (G = ℝ × ℝ). Gib die Wertemenge von f und die Gleichung der Asymptote an. Berechne die Nullstelle von f auf zwei Nachkommastellen.`,
        given: [`f: y = ${expHtml(k, a, b, c)}`],
        fields: [
          choiceField("Wertemenge", W_OPTIONS(c), k > 0 ? 0 : 1),
          numberField("Asymptote: y =", c, "", 2),
          numberField("Nullstelle: x ≈", zero, "", 2, {
            slips: [
              { value: logBase(a, -c / k), hint: "Das ist x − b. Addiere noch b." },
              { value: b + logBase(a, Math.abs(c)), hint: "Erst durch k teilen, dann logarithmieren." },
            ],
          }),
        ],
        steps: [
          `k ${k > 0 ? "&gt;" : "&lt;"} 0: 𝕎 = {y | y ${k > 0 ? "&gt;" : "&lt;"} ${fmt(c)}}, Asymptote y = ${fmt(c)}`,
          `0 = ${expHtml(k, a, b, c)} ⇒ ${pow(a, shiftedArg(b))} = ${f4(-c / k)}`,
          `${shiftedArg(b)} = lg ${f4(-c / k)} : lg ${fmt(a)} ≈ ${f4(logBase(a, -c / k))}`,
          `<strong>x ≈ ${fmt(zero, 2)}</strong>`,
        ],
        meta: { k, a, b, c },
      };
    }
  },
};

const aufstellen: ExerciseGenerator = {
  id: "aufstellen",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const k = rng.pick([0.5, 1.5, 2, 3, -1, -2]);
      const c = rng.int(-4, 4);
      const a = rng.pick([2, 3]);
      const x1 = rng.int(1, 3);
      const y1 = k * a ** x1 + c;
      return {
        prompt: `Der Graph einer Funktion f mit y = k · ${pow(a, "x")} + c hat die Asymptote y = ${fmt(c)} und verläuft durch den Punkt P(${x1} | ${fmt(y1)}). Bestimme c und k.`,
        given: [`Asymptote y = ${fmt(c)}`, `P(${x1} | ${fmt(y1)})`],
        formulaHint: "Die Asymptote y = c liefert c. Dann P einsetzen und nach k auflösen.",
        fields: [
          numberField("c =", c, "", 2),
          numberField("k =", k, "", 2, {
            slips: [
              { value: (y1 - c) / (a * x1), hint: `${powText(fmt(a), String(x1))} ist eine Potenz, nicht ${a} · ${x1}.` },
              { value: y1 / a ** x1, hint: "Erst c abziehen, dann durch die Potenz teilen." },
            ],
          }),
        ],
        steps: [
          `Asymptote y = ${fmt(c)} ⇒ c = ${fmt(c)}`,
          `${fmt(y1)} = k · ${pow(a, x1)} ${signed(c, 0)} ⇒ k · ${fmt(a ** x1)} = ${fmt(y1 - c)}`,
          `<strong>k = ${fmt(k)}, also f: y = ${expHtml(k, a, 0, c)}</strong>`,
        ],
        meta: { k, a, c, x1, y1 },
      };
    }
    const a = rng.pick([2, 3]);
    const k = rng.pick([0.5, 1, 2, 3, -1, -2]);
    const c = rng.int(-4, 4);
    const x1 = rng.int(0, 2);
    const x2 = x1 + rng.int(1, 2);
    const y1 = k * a ** x1 + c;
    const y2 = k * a ** x2 + c;
    return {
      prompt: `Die Punkte P(${x1} | ${fmt(y1)}) und Q(${x2} | ${fmt(y2)}) liegen auf dem Graphen der Funktion f mit y = k · ${pow(a, "x")} + c. Berechne k und c und gib die Gleichung der Asymptote an.`,
      given: [`P(${x1} | ${fmt(y1)})`, `Q(${x2} | ${fmt(y2)})`],
      fields: [
        numberField("k =", k, "", 2, { slips: [{ value: (y2 - y1) / (x2 - x1), hint: "Das ist die Steigung einer Geraden. Ziehe die Gleichungen voneinander ab: k · (a hoch x₂ − a hoch x₁) = y₂ − y₁." }] }),
        numberField("c =", c, "", 2),
      ],
      steps: [
        `I: ${fmt(y1)} = k · ${fmt(a ** x1)} + c; II: ${fmt(y2)} = k · ${fmt(a ** x2)} + c`,
        `II − I: ${fmt(y2 - y1)} = k · ${fmt(a ** x2 - a ** x1)} ⇒ k = ${fmt(k)}`,
        `c = ${fmt(y1)} − ${paren(k * a ** x1)} = ${fmt(c)}`,
        `<strong>f: y = ${expHtml(k, a, 0, c)}, Asymptote y = ${fmt(c)}</strong>`,
      ],
      meta: { k, a, c, x1, x2, y1, y2 },
    };
  },
};

const umkehrExp: ExerciseGenerator = {
  id: "umkehrfunktion",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const a = rng.pick([2, 3, 5, 10]);
      const b = rng.int(-4, 4);
      const c = rng.int(-4, 4);
      return {
        prompt: `Bestimme die Gleichung der Umkehrfunktion von f: y = ${expHtml(1, a, b, c)}. Gib sie in der Form y = ${logNameHtml(a)}(x − p) + q an.`,
        given: [`f: y = ${expHtml(1, a, b, c)}`],
        formulaHint: `x und y tauschen: x = ${pow(a, "y − b")} + c; dann nach y auflösen: y − b = ${logNameHtml(a)}(x − c)`,
        fields: [
          numberField("p =", c, "", 0, {
            slips: [
              { value: -c, hint: "Vorzeichen: Aus x = a hoch (y − b) + c wird x − c = a hoch (y − b), also p = c." },
              { value: b, hint: "Beim Tauschen wird die Verschiebung c nach oben zur Verschiebung nach rechts: p = c." },
            ],
          }),
          numberField("q =", b, "", 0, { slips: [{ value: -b, hint: "Vorzeichen: Aus y − b = … folgt y = … + b." }] }),
        ],
        steps: [
          `x und y tauschen: x = ${expHtml(1, a, b, c, "y")}`,
          `${shiftedArg(c)} = ${pow(a, shiftedArg(b, "y"))} ⇒ ${shiftedArg(b, "y")} = ${logNameHtml(a)}(${shiftedArg(c)})`,
          `<strong>f<sup>−1</sup>: y = ${logHtml(1, a, c, b)}</strong>`,
        ],
        meta: { a, b, c },
      };
    }
    const a = rng.pick([2, 3]);
    const m = a === 2 ? rng.pick([-2, -1, 1, 2]) : rng.pick([1, 2]);
    const k = a ** m;
    const b = rng.int(-3, 3);
    const c = rng.int(-4, 4);
    const q = b - m;
    const inner = c === 0 ? " x" : `(${shiftedArg(c)})`;
    return {
      prompt: `Gegeben ist die Funktion f mit y = ${expHtml(k, a, b, c)}. Bestimme die Gleichung der Umkehrfunktion f<sup>−1</sup> in der Form y = ${logNameHtml(a)}(x − p) + q und ihre Definitionsmenge.`,
      given: [`f: y = ${expHtml(k, a, b, c)}`],
      fields: [
        numberField("p =", c, "", 0),
        numberField("q =", q, "", 0, { slips: [{ value: b, hint: `Der Faktor ${fmt(k)} vor der Potenz steckt noch im Logarithmus: ${logName(a)} ${fmt(k)} = ${m} wird abgezogen.` }] }),
        choiceField("Definitionsmenge von f⁻¹", [`𝔻 = {x | x > ${fmt(c)}}`, `𝔻 = {x | x < ${fmt(c)}}`, "𝔻 = ℝ"], 0),
      ],
      steps: [
        `x und y tauschen: x = ${expHtml(k, a, b, c, "y")}`,
        `${pow(a, shiftedArg(b, "y"))} = ${inner.trim()} : ${fmt(k)}`,
        `${shiftedArg(b, "y")} = ${logNameHtml(a)}${inner} − ${logNameHtml(a)} ${fmt(k)} = ${logNameHtml(a)}${inner} ${signed(-m, 0)}`,
        `<strong>f<sup>−1</sup>: y = ${logHtml(1, a, c, q)}, 𝔻 = {x | x &gt; ${fmt(c)}}</strong>`,
      ],
      meta: { a, m, b, c },
    };
  },
};

const exponentialAllgemein: Lesson = {
  id: "el-5-exponentialfunktion-allgemein",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "5.5 Exponentialfunktionen y = k · aˣ⁻ᵇ + c",
  subtitle: "Strecken, verschieben, Asymptote",
  tracks: ["I"],
  lehrplan: "M10 LB 4 (I): Exponentialfunktionen, Asymptote, Wertemenge, Umkehrfunktion",
  whyItMatters:
    "In der Abschlussprüfung werden Exponentialfunktionen verschoben und gestreckt. Wer Asymptote, Wertemenge und Umkehrfunktion abliest, hat den Graphen im Griff.",
  explanationHtml: `
    <p>Aus y = a<sup>x</sup> entsteht durch Strecken und Verschieben die allgemeine Exponentialfunktion</p>
    <p class="formula-line">y = k · a<sup>x − b</sup> + c &nbsp; (a &gt; 0, a ≠ 1, k ≠ 0)</p>
    <ul>
      <li><strong>k</strong> streckt den Graphen in y-Richtung (|k| &gt; 1) oder staucht ihn (|k| &lt; 1); für k &lt; 0 wird er zusätzlich an der Asymptote gespiegelt.</li>
      <li><strong>b</strong> verschiebt um b nach rechts: Bei x − 2 geht es 2 nach rechts, bei x + 2 = x − (−2) 2 nach links.</li>
      <li><strong>c</strong> verschiebt um c nach oben. Die <strong>Asymptote</strong> ist die waagrechte Gerade <strong>y = c</strong>.</li>
      <li>Der Punkt (0 | 1) von y = a<sup>x</sup> wandert nach <strong>(b | k + c)</strong>.</li>
    </ul>
    <p><strong>Definitions- und Wertemenge:</strong> 𝔻 = ℝ. Für k &gt; 0 liegt der Graph oberhalb der Asymptote: 𝕎 = {y | y &gt; c}; für k &lt; 0 liegt er unterhalb: 𝕎 = {y | y &lt; c}.</p>
    <p><strong>Umkehrfunktion:</strong> x und y vertauschen und nach y auflösen. Aus y = 2<sup>x + 1</sup> − 3 wird x = 2<sup>y + 1</sup> − 3 ⇒ 2<sup>y + 1</sup> = x + 3 ⇒ y + 1 = log<sub>2</sub>(x + 3) ⇒ <strong>y = log<sub>2</sub>(x + 3) − 1</strong>. Ihr Graph ist das Spiegelbild an der Geraden y = x; Definitions- und Wertemenge tauschen die Rollen.</p>
    <div class="example">f: y = 2 · 3<sup>x − 1</sup> − 4 hat die Asymptote y = −4 und 𝕎 = {y | y &gt; −4}. Schnitt mit der y-Achse: f(0) = 2 · 3<sup>−1</sup> − 4 = ${fracHtml(2, 3)} − 4 ≈ −3,33. Nullstelle: 2 · 3<sup>x − 1</sup> = 4 ⇒ 3<sup>x − 1</sup> = 2 ⇒ x = 1 + log<sub>3</sub> 2 ≈ 1,63.</div>
    <div class="merke"><strong>Merke:</strong> y = k · a<sup>x − b</sup> + c: Asymptote y = c, 𝔻 = ℝ, der Graph liegt für k &gt; 0 über und für k &lt; 0 unter der Asymptote.</div>
  `,
  formulas: [
    { name: "Allgemeine Exponentialfunktion", html: "y = k · a<sup>x − b</sup> + c", quantities: "Asymptote y = c; Punkt (b | k + c); 𝔻 = ℝ" },
    { name: "Wertemenge", html: "k &gt; 0: 𝕎 = {y | y &gt; c}; k &lt; 0: 𝕎 = {y | y &lt; c}", quantities: "der Graph liegt über oder unter der Asymptote" },
    { name: "Umkehrfunktion", html: "y = log<sub>a</sub>((x − c) : k) + b", quantities: "x und y tauschen, nach y auflösen" },
  ],
  quiz: {
    question: "Welche Wertemenge hat die Funktion y = −2 · 3ˣ + 4?",
    options: ["𝕎 = {y | y > 4}", "𝕎 = {y | y > −2}", "𝕎 = {y | y < 4}", "𝕎 = ℝ"],
    correctIndex: 2,
    explanation: "Die Asymptote ist y = 4. Wegen k = −2 < 0 liegt der Graph unterhalb der Asymptote, also sind alle y-Werte kleiner als 4.",
  },
  lab: {
    kind: "exp-shift",
    title: "Labor: Verschieben und Strecken",
    intro: "Ziehe den Punkt (b | k + c): waagrecht verschiebst du, senkrecht streckst du. Der Punkt auf der Asymptote verschiebt alles nach oben oder unten. Der Balken an der y-Achse zeigt die Wertemenge.",
    params: [
      { type: "choice", key: "a", label: "Basis a", options: [0.5, 2, 3].map((a) => ({ value: a, label: fmt(a) })), value: 2 },
      { type: "range", key: "k", label: "Streckfaktor k", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "Verschiebung nach rechts b", unit: "", min: -4, max: 4, step: 1, value: 0 },
      { type: "range", key: "c", label: "Verschiebung nach oben c", unit: "", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
      {
        type: "choice",
        key: "inv",
        label: "Umkehrfunktion",
        options: [
          { value: 0, label: "ausblenden" },
          { value: 1, label: "einblenden" },
        ],
        value: 0,
      },
    ],
    readouts: [
      {
        key: "term",
        label: "Funktionsgleichung",
        emphasis: true,
        compute: (v) => (v.k === 0 ? `y = ${fmt(v.c)} (k = 0: keine Exponentialfunktion)` : `y = ${expText(v.k, v.a, v.b, v.c)}`),
      },
      { key: "asymptote", label: "Asymptote", compute: (v) => `y = ${fmt(v.c)}` },
      {
        key: "dw",
        label: "Definitions- und Wertemenge",
        compute: (v) => (v.k === 0 ? `𝔻 = ℝ, 𝕎 = {${fmt(v.c)}}` : `𝔻 = ℝ, 𝕎 = {y | y ${v.k > 0 ? ">" : "<"} ${fmt(v.c)}}`),
      },
      { key: "sy", label: "Schnittpunkt mit der y-Achse", compute: (v) => `(0 | ${fmt(v.k * v.a ** -v.b + v.c, 2)})` },
      { key: "zero", label: "Nullstelle", compute: expZero },
      { key: "inverse", label: "Umkehrfunktion", compute: (v) => expInverseText(v.k, v.a, v.b, v.c) },
    ],
    goals: [
      {
        id: "verschieben",
        text: "Verschiebe den Graphen von y = 3ˣ um 1 nach links und um 2 nach unten.",
        check: (v) => v.a === 3 && v.k === 1 && v.b === -1 && v.c === -2,
      },
      {
        id: "wertemenge",
        text: "Stelle eine steigende Funktion mit der Wertemenge 𝕎 = {y | y < 2} ein.",
        check: (v) => v.c === 2 && v.k < 0 && v.a < 1,
      },
      {
        id: "y-achse",
        text: "Mit a = 2 und k = 0,5: Der Graph soll die Asymptote y = −1 haben und die y-Achse bei y = 1 schneiden.",
        check: (v) => v.a === 2 && v.k === 0.5 && v.c === -1 && v.b === -2,
      },
    ],
  },
  exercises: [eigenschaftenExp, aufstellen, umkehrExp],
  requiredCorrect: 3,
  celebrationMessage: "Du liest Asymptote, Definitions- und Wertemenge ab und bildest die Umkehrfunktion.",
};

// 5.6 Logarithmusfunktionen ─────────────────────────────────────────────────

const eigenschaftenLog: ExerciseGenerator = {
  id: "eigenschaften",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      for (;;) {
        const a = rng.pick([2, 3, 10, 0.5]);
        const k = rng.pick([1, 1, 2, -1, 0.5]);
        const b = rng.int(-4, 4);
        const e = a === 10 ? rng.int(-1, 2) : rng.int(-2, 3);
        const c = e === 0 ? 0 : -k * e;
        const zero = b + a ** e;
        if (nearTrap(zero, b)) continue;
        return {
          prompt: `Gegeben ist die Funktion f mit y = ${logHtml(k, a, b, c)}. Gib die Gleichung der Asymptote und die Definitionsmenge an, und berechne die Nullstelle.`,
          given: [`f: y = ${logHtml(k, a, b, c)}`],
          formulaHint: "Asymptote x = b, 𝔻 = {x | x &gt; b}; Nullstelle: log<sub>a</sub>(x − b) = −c : k ⇒ x = b + a<sup>−c : k</sup>",
          fields: [
            numberField("Asymptote: x =", b, "", 2, { slips: [{ value: -b, hint: "Vorzeichen: Bei log(x − 3) ist die Asymptote x = 3, bei log(x + 3) ist sie x = −3." }] }),
            choiceField("Definitionsmenge", [`𝔻 = {x | x > ${fmt(b)}}`, `𝔻 = {x | x < ${fmt(b)}}`, "𝔻 = ℝ"], 0),
            numberField("Nullstelle: x =", zero, "", 3, {
              slips: [
                { value: b - a ** e, hint: "Aus x − b = … folgt x = b + …, nicht b − …." },
                { value: b + a * e, hint: "x − b ist a hoch (−c : k), nicht a mal (−c : k)." },
              ],
            }),
          ],
          steps: [
            `Das Argument muss positiv sein: ${shiftedArg(b)} &gt; 0 ⇒ 𝔻 = {x | x &gt; ${fmt(b)}}, Asymptote x = ${fmt(b)}`,
            `${logHtml(k, a, b, c)} = 0 ⇒ ${logNameHtml(a)}(${shiftedArg(b)}) = ${fmt(e)}`,
            `${shiftedArg(b)} = ${pow(a, e)} = ${fmt(a ** e, 3)}`,
            `<strong>x = ${fmt(zero, 3)}</strong>`,
          ],
          meta: { a, k, b, c },
        };
      }
    }
    for (;;) {
      const a = rng.pick([2, 3, 0.5, 10]);
      const k = rng.pick([1, 2, -1, -2, 0.5, 3]);
      const b = -rng.int(1, 4);
      const c = rng.int(-4, 4);
      // the zero keeps a visible distance from the asymptote and stays in a sensible range
      const gap = a ** (-c / k);
      const zero = b + gap;
      const yInt = k * logBase(a, -b) + c;
      if (gap < 0.05 || gap > 1000 || nearTrap(zero, yInt)) continue;
      return {
        prompt: `Gegeben ist die Funktion f mit y = ${logHtml(k, a, b, c)} (G = ℝ × ℝ). Berechne die Koordinaten der Schnittpunkte ihres Graphen mit den beiden Koordinatenachsen. Runde auf zwei Nachkommastellen.`,
        given: [`f: y = ${logHtml(k, a, b, c)}`],
        fields: [
          numberField("Nullstelle: x ≈", zero, "", 2, { slips: [{ value: a ** (-c / k), hint: "Das ist x − b. Addiere noch b." }] }),
          numberField("Schnitt mit der y-Achse: y ≈", yInt, "", 2, { slips: [{ value: k * logBase(a, -b) - c, hint: "Vorzeichen von c: f(0) = k · log(0 − b) + c." }] }),
        ],
        steps: [
          `y = 0: ${logNameHtml(a)}(${shiftedArg(b)}) = ${f4(-c / k)} ⇒ x = ${fmt(b)} + ${pow(a, f4(-c / k))} ≈ ${fmt(zero, 2)}`,
          `x = 0: y = ${fmt(k)} · ${logNameHtml(a)} ${fmt(-b)}${plusConst(c)} ≈ ${fmt(yInt, 2)}`,
          `<strong>N(${fmt(zero, 2)} | 0), S<sub>y</sub>(0 | ${fmt(yInt, 2)})</strong>`,
        ],
        meta: { a, k, b, c },
      };
    }
  },
};

const umkehrLog: ExerciseGenerator = {
  id: "umkehrung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const a = rng.pick([2, 3, 5, 10]);
      const b = rng.int(-4, 4);
      const c = rng.int(-4, 4);
      return {
        prompt: `Bestimme die Umkehrfunktion von f: y = ${logHtml(1, a, b, c)}. Gib sie in der Form y = ${pow(a, "x − p")} + q an.`,
        given: [`f: y = ${logHtml(1, a, b, c)}`],
        formulaHint: "x und y tauschen und nach y auflösen: Aus y = log<sub>a</sub>(x − b) + c wird y = a<sup>x − c</sup> + b",
        fields: [
          numberField("p =", c, "", 0, {
            slips: [
              { value: -c, hint: "Vorzeichen: Aus x = log(y − b) + c wird x − c = log(y − b), also p = c." },
              { value: b, hint: "p kommt vom Summanden c der Logarithmusfunktion." },
            ],
          }),
          numberField("q =", b, "", 0, {
            slips: [
              { value: -b, hint: "Vorzeichen: Aus y − b = … folgt y = … + b." },
              { value: c, hint: "q kommt von der Verschiebung b im Argument." },
            ],
          }),
        ],
        steps: [
          `x und y tauschen: x = ${logNameHtml(a)}(${shiftedArg(b, "y")})${plusConst(c)}`,
          `${logNameHtml(a)}(${shiftedArg(b, "y")}) = ${shiftedArg(c)} ⇒ ${shiftedArg(b, "y")} = ${pow(a, shiftedArg(c))}`,
          `<strong>f<sup>−1</sup>: y = ${expHtml(1, a, c, b)}</strong>`,
        ],
        meta: { a, b, c },
      };
    }
    if (rng.next() < 0.5) {
      const a = rng.pick([2, 3, 4, 5]);
      const m = a === 5 ? 2 : rng.pick([2, 3]);
      const b = rng.int(-3, 3);
      const c = rng.int(-3, 3);
      const xP = b + a ** m;
      const yP = c + m;
      return {
        prompt: `Der Punkt P(${fmt(xP)} | ${fmt(yP)}) liegt auf dem Graphen der Funktion f mit y = log<sub>a</sub>(${shiftedArg(b)})${plusConst(c)}. Berechne die Basis a.`,
        given: [`f: y = log<sub>a</sub>(${shiftedArg(b)})${plusConst(c)}`, `P(${fmt(xP)} | ${fmt(yP)})`],
        fields: [numberField("a =", a, "", 2, { slips: [{ value: a ** m / m, hint: `a hoch ${m} = ${fmt(a ** m)}: Ziehe die Wurzel, statt durch ${m} zu teilen.` }] })],
        steps: [
          `P einsetzen: ${fmt(yP)} = log<sub>a</sub>(${fmt(xP)}${b === 0 ? "" : ` ${signed(-b, 0)}`})${plusConst(c)} ⇒ log<sub>a</sub> ${fmt(a ** m)} = ${m}`,
          `${pow("a", m)} = ${fmt(a ** m)}`,
          `<strong>a = ${a}</strong>`,
        ],
        meta: { variant: 0, b, c, xP, yP },
      };
    }
    const a = rng.pick([2, 3, 10]);
    const m = a === 10 ? rng.int(0, 2) : rng.int(0, 3);
    const b = rng.int(-4, 4);
    const c = rng.int(-3, 3);
    const xP = b + a ** m;
    const yP = c + m;
    return {
      prompt: `Der Graph der Funktion f mit y = ${logNameHtml(a)}(x − b)${plusConst(c)} verläuft durch den Punkt P(${fmt(xP)} | ${fmt(yP)}). Bestimme b und gib die Gleichung der Asymptote an.`,
      given: [`f: y = ${logNameHtml(a)}(x − b)${plusConst(c)}`, `P(${fmt(xP)} | ${fmt(yP)})`],
      fields: [
        numberField("b =", b, "", 0, { slips: m === 0 ? [] : [{ value: xP - m, hint: `Aus log(x − b) = ${m} folgt x − b = ${a} hoch ${m}, nicht = ${m}.` }] }),
        numberField("Asymptote: x =", b, "", 0),
      ],
      steps: [
        `P einsetzen: ${fmt(yP)} = ${logNameHtml(a)}(${fmt(xP)} − b)${plusConst(c)} ⇒ ${logNameHtml(a)}(${fmt(xP)} − b) = ${m}`,
        `${fmt(xP)} − b = ${pow(a, m)} = ${fmt(a ** m)}`,
        `<strong>b = ${fmt(b)}, Asymptote x = ${fmt(b)}</strong>`,
      ],
      meta: { variant: 1, a, c, xP, yP },
    };
  },
};

const logarithmusfunktion: Lesson = {
  id: "el-6-logarithmusfunktion",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "5.6 Logarithmusfunktionen",
  subtitle: "Das Spiegelbild der Exponentialfunktion",
  tracks: ["I"],
  lehrplan: "M10 LB 4 (I): Logarithmusfunktionen",
  whyItMatters:
    "Lautstärke in Dezibel und die Stärke von Erdbeben werden mit Logarithmen gemessen. Der Graph einer Logarithmusfunktion ist das Spiegelbild der Exponentialfunktion.",
  explanationHtml: `
    <p>Die <strong>Logarithmusfunktion</strong> y = log<sub>a</sub> x ist die Umkehrfunktion von y = a<sup>x</sup>: Ihr Graph ist das Spiegelbild an der Geraden y = x.</p>
    <ul>
      <li>𝔻 = ℝ<sup>+</sup> = {x | x &gt; 0}: Nur positive Zahlen haben einen Logarithmus. 𝕎 = ℝ.</li>
      <li>Die y-Achse (x = 0) ist <strong>senkrechte Asymptote</strong>. Der Graph geht durch (1 | 0) und (a | 1).</li>
      <li>Für a &gt; 1 steigt der Graph, für 0 &lt; a &lt; 1 fällt er.</li>
    </ul>
    <p>Allgemein: <strong>y = k · log<sub>a</sub>(x − b) + c</strong> mit k ≠ 0.</p>
    <ul>
      <li>b verschiebt nach rechts, c nach oben, k streckt in y-Richtung.</li>
      <li>Asymptote <strong>x = b</strong>, 𝔻 = {x | x &gt; b}, 𝕎 = ℝ. Der Punkt (1 | 0) wandert nach (b + 1 | c).</li>
      <li>Nullstelle: k · log<sub>a</sub>(x − b) + c = 0 ⇒ log<sub>a</sub>(x − b) = −c : k ⇒ x = b + a<sup>−c : k</sup>.</li>
      <li>Umkehrfunktion (für k = 1): Aus y = log<sub>a</sub>(x − b) + c wird y = a<sup>x − c</sup> + b.</li>
    </ul>
    <div class="example">f: y = log<sub>3</sub>(x − 1) − 2 hat die Asymptote x = 1, 𝔻 = {x | x &gt; 1} und 𝕎 = ℝ. Nullstelle: log<sub>3</sub>(x − 1) = 2 ⇒ x − 1 = 9 ⇒ x = 10. Umkehrfunktion: x = log<sub>3</sub>(y − 1) − 2 ⇒ y − 1 = 3<sup>x + 2</sup> ⇒ y = 3<sup>x + 2</sup> + 1.</div>
    <div class="merke"><strong>Merke:</strong> Das Argument des Logarithmus muss positiv sein: x − b &gt; 0. Daraus folgen die Definitionsmenge und die senkrechte Asymptote x = b.</div>
  `,
  formulas: [
    { name: "Logarithmusfunktion", html: "y = log<sub>a</sub> x: 𝔻 = ℝ<sup>+</sup>, 𝕎 = ℝ", quantities: "Umkehrfunktion von y = aˣ; Graph durch (1 | 0) und (a | 1); Asymptote x = 0" },
    { name: "Allgemeine Logarithmusfunktion", html: "y = k · log<sub>a</sub>(x − b) + c", quantities: "Asymptote x = b; 𝔻 = {x | x > b}; 𝕎 = ℝ; Punkt (b + 1 | c)" },
    { name: "Umkehrfunktion", html: "y = log<sub>a</sub>(x − b) + c ⇔ y = a<sup>x − c</sup> + b", quantities: "Spiegelung an der Geraden y = x" },
  ],
  quiz: {
    question: "Welche Definitionsmenge hat die Funktion y = log₂(x − 3) + 1?",
    options: ["𝔻 = {x | x > 3}", "𝔻 = {x | x > −3}", "𝔻 = {x | x > 1}", "𝔻 = ℝ"],
    correctIndex: 0,
    explanation: "Logarithmieren kann man nur positive Zahlen: x − 3 > 0, also x > 3. Die Gerade x = 3 ist die senkrechte Asymptote; die + 1 verschiebt den Graphen nur nach oben.",
  },
  lab: {
    kind: "log-graph",
    title: "Labor: Der Graph von y = k · logₐ(x − b) + c",
    intro: "Ziehe den Punkt (b + 1 | c), um den Graphen zu verschieben, den zweiten Punkt, um ihn zu strecken, und die Asymptote oben am Rand. Blende das Spiegelbild an y = x ein: Es ist eine Exponentialfunktion.",
    params: [
      { type: "choice", key: "a", label: "Basis a", options: [0.5, 2, 3, 10].map((a) => ({ value: a, label: fmt(a) })), value: 2 },
      { type: "range", key: "k", label: "Streckfaktor k", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "Verschiebung nach rechts b", unit: "", min: -4, max: 4, step: 1, value: 0 },
      { type: "range", key: "c", label: "Verschiebung nach oben c", unit: "", min: -4, max: 4, step: 1, value: 0 },
      {
        type: "choice",
        key: "mirror",
        label: "Spiegelbild an y = x",
        options: [
          { value: 0, label: "ausblenden" },
          { value: 1, label: "einblenden" },
        ],
        value: 0,
      },
    ],
    readouts: [
      {
        key: "term",
        label: "Funktionsgleichung",
        emphasis: true,
        compute: (v) => (v.k === 0 ? `y = ${fmt(v.c)} (k = 0: keine Logarithmusfunktion)` : `y = ${logText(v.k, v.a, v.b, v.c)}`),
      },
      { key: "asymptote", label: "Asymptote", compute: (v) => `x = ${fmt(v.b)}` },
      { key: "dw", label: "Definitions- und Wertemenge", compute: (v) => `𝔻 = {x | x > ${fmt(v.b)}}, 𝕎 = ${v.k === 0 ? `{${fmt(v.c)}}` : "ℝ"}` },
      {
        key: "zero",
        label: "Nullstelle",
        compute: (v) => (v.k === 0 ? (v.c === 0 ? "jedes x mit x > b" : "keine") : `x = ${fmt(v.b + v.a ** (-v.c / v.k), 3)}`),
      },
      { key: "verlauf", label: "Verlauf", compute: (v) => (v.k === 0 ? "konstant" : (v.k > 0) === (v.a > 1) ? "steigt" : "fällt") },
      { key: "inverse", label: "Umkehrfunktion", compute: (v) => logInverseText(v.k, v.a, v.b, v.c) },
    ],
    goals: [
      {
        id: "asymptote-punkt",
        text: "Verschiebe den Graphen so, dass seine Asymptote x = −2 ist und er durch den Punkt (−1 | 1) geht.",
        check: (v) => v.k !== 0 && v.b === -2 && v.c === 1,
      },
      {
        id: "umkehrung",
        text: "Stelle die Umkehrfunktion von y = 2ˣ⁻¹ + 3 ein.",
        check: (v) => v.a === 2 && v.k === 1 && v.b === 3 && v.c === 1,
      },
      {
        id: "fallend",
        text: "Stelle eine fallende Logarithmusfunktion mit der Definitionsmenge 𝔻 = {x | x > 3} ein.",
        check: (v) => v.b === 3 && v.k !== 0 && (v.k > 0) !== (v.a > 1),
      },
    ],
  },
  exercises: [eigenschaftenLog, umkehrLog],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst Definitionsmenge, Asymptote und Nullstelle von Logarithmusfunktionen und bildest ihre Umkehrfunktion.",
};

// 5.7 Funktionsgraphen abbilden ─────────────────────────────────────────────

const verschiebung: ExerciseGenerator = {
  id: "verschiebung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const type = rng.int(0, 2);
      const vx = nonZero(rng, 4);
      const vy = nonZero(rng, 4);
      const a = type === 0 ? rng.pick([2, 3, 0.5]) : rng.pick([2, 3, 10]);
      const n = rng.pick([2, 3]);
      const original = type === 0 ? pow(a, "x") : type === 1 ? `${logNameHtml(a)} x` : pow("x", n);
      const form = type === 0 ? `${pow(a, "x − p")} + q` : type === 1 ? `${logNameHtml(a)}(x − p) + q` : `(x − p)<sup>${n}</sup> + q`;
      const image = type === 0 ? expHtml(1, a, vx, vy) : type === 1 ? logHtml(1, a, vx, vy) : `(${shiftedArg(vx)})<sup>${n}</sup>${plusConst(vy)}`;
      return {
        prompt: `Der Graph von f: y = ${original} wird durch eine Parallelverschiebung mit dem Vektor v→ = (${fmt(vx)} | ${fmt(vy)}) abgebildet. Gib die Gleichung des Bildgraphen in der Form y = ${form} an.`,
        given: [`f: y = ${original}`, `v→ = (${fmt(vx)} | ${fmt(vy)})`],
        formulaHint: "Verschiebung um v→ = (v<sub>x</sub> | v<sub>y</sub>): y = f(x − v<sub>x</sub>) + v<sub>y</sub>",
        fields: [
          numberField("p =", vx, "", 0, { slips: [{ value: -vx, hint: "Im Term steht x − vₓ: Nach rechts um 3 heißt x − 3, also p = 3." }] }),
          numberField("q =", vy, "", 0, { slips: [{ value: -vy, hint: "Nach oben verschoben heißt: v_y wird am Ende des Terms addiert." }] }),
        ],
        steps: [`y = f(${shiftedArg(vx)})${plusConst(vy)}`, `<strong>y = ${image}</strong>, also p = ${fmt(vx)} und q = ${fmt(vy)}`],
        meta: { type, vx, vy },
      };
    }
    const isLog = rng.next() < 0.5;
    const a = isLog ? rng.pick([2, 3]) : rng.pick([2, 3, 0.5]);
    const b0 = nonZero(rng, 3);
    const c0 = nonZero(rng, 3);
    const vx = nonZero(rng, 4);
    const vy = nonZero(rng, 4);
    const term = (b: number, c: number) => (isLog ? logHtml(1, a, b, c) : expHtml(1, a, b, c));
    if (rng.next() < 0.5) {
      const p = b0 + vx;
      const q = c0 + vy;
      const form = isLog ? `${logNameHtml(a)}(x − p) + q` : `${pow(a, "x − p")} + q`;
      return {
        prompt: `Der Graph der Funktion f mit y = ${term(b0, c0)} wird durch Parallelverschiebung mit dem Vektor v→ = (${fmt(vx)} | ${fmt(vy)}) auf den Graphen f' abgebildet. Gib die Gleichung von f' in der Form y = ${form} an.`,
        given: [`f: y = ${term(b0, c0)}`, `v→ = (${fmt(vx)} | ${fmt(vy)})`],
        fields: [
          numberField("p =", p, "", 0, { slips: [{ value: b0 - vx, hint: "Nach rechts verschieben vergrößert die Verschiebung im Argument: p = b + vₓ." }] }),
          numberField("q =", q, "", 0, { slips: [{ value: c0 - vy, hint: "Nach oben verschieben addiert v_y: q = c + v_y." }] }),
        ],
        steps: [
          `y = f(${shiftedArg(vx)})${plusConst(vy)}`,
          `Die Verschiebungen addieren sich: ${fmt(b0)} ${signed(vx, 0)} = ${fmt(p)} und ${fmt(c0)} ${signed(vy, 0)} = ${fmt(q)}`,
          `<strong>f': y = ${term(p, q)}</strong>`,
        ],
        meta: { variant: 0, b0, c0, vx, vy },
      };
    }
    const b1 = b0 + vx;
    const c1 = c0 + vy;
    return {
      prompt: `Durch welche Parallelverschiebung wird der Graph von f: y = ${term(b0, c0)} auf den Graphen von g: y = ${term(b1, c1)} abgebildet? Gib den Verschiebungsvektor v→ an.`,
      given: [`f: y = ${term(b0, c0)}`, `g: y = ${term(b1, c1)}`],
      fields: [
        numberField("v<sub>x</sub> =", vx, "", 0, { slips: [{ value: -vx, hint: "Vergleiche die Verschiebung im Argument: Sie wandert von b nach b + vₓ." }] }),
        numberField("v<sub>y</sub> =", vy, "", 0, { slips: [{ value: -vy, hint: "Der Summand am Ende wandert von c nach c + v_y." }] }),
      ],
      steps: [
        `${isLog ? "Asymptote" : "Verschiebung im Exponenten"}: von ${fmt(b0)} nach ${fmt(b1)}, also v<sub>x</sub> = ${fmt(vx)}`,
        `Summand am Ende: von ${fmt(c0)} nach ${fmt(c1)}, also v<sub>y</sub> = ${fmt(vy)}`,
        `<strong>v→ = (${fmt(vx)} | ${fmt(vy)})</strong>`,
      ],
      meta: { variant: 1, b0, c0, vx, vy },
    };
  },
};

const AXES = ["an der x-Achse gespiegelt", "an der y-Achse gespiegelt", "an der Winkelhalbierenden y = x gespiegelt"];

const spiegelung: ExerciseGenerator = {
  id: "spiegelung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const isLog = rng.next() < 0.5;
      const a = isLog ? rng.pick([2, 3, 10]) : rng.pick([2, 3, 5]);
      const axis = rng.int(0, 2);
      const m = rng.pick([1, 2]);
      const [px, py] = isLog ? [a ** m, m] : [m, a ** m];
      const [qx, qy] = axis === 0 ? [px, -py] : axis === 1 ? [-px, py] : [py, px];
      const L = logName(a);
      const options = isLog ? [`y = −${L} x`, `y = ${L}(−x)`, `y = ${powText(fmt(a), "x")}`] : [`y = −${powText(fmt(a), "x")}`, `y = ${powText(fmt(a), "−x")}`, `y = ${L} x`];
      const original = isLog ? `${logNameHtml(a)} x` : pow(a, "x");
      return {
        prompt: `Der Graph von f: y = ${original} wird ${AXES[axis]}. Der Punkt P(${fmt(px)} | ${fmt(py)}) liegt auf dem Graphen von f. Gib den Bildpunkt P' an und wähle die Gleichung des Bildgraphen.`,
        given: [`f: y = ${original}`, `P(${fmt(px)} | ${fmt(py)})`],
        formulaHint: "x-Achse: (x | y) → (x | −y), y = −f(x); y-Achse: (x | y) → (−x | y), y = f(−x); y = x: (x | y) → (y | x), Umkehrfunktion",
        fields: [numberField("x' =", qx, "", 2), numberField("y' =", qy, "", 2), choiceField("Bildgraph", options, axis)],
        steps: [`${axis === 0 ? "(x | y) → (x | −y)" : axis === 1 ? "(x | y) → (−x | y)" : "(x | y) → (y | x)"}: P'(${fmt(qx)} | ${fmt(qy)})`, `<strong>${options[axis]}</strong>`],
        meta: { isLog: isLog ? 1 : 0, a, axis, m },
      };
    }
    const variant = rng.int(0, 3);
    const b = nonZero(rng, 3);
    const c = nonZero(rng, 3);
    if (variant === 0) {
      const a = rng.pick([2, 3]);
      return {
        prompt: `Der Graph der Funktion f mit y = ${logHtml(1, a, b, c)} wird an der x-Achse gespiegelt. Gib die Gleichung des Bildgraphen in der Form y = k · ${logNameHtml(a)}(x − p) + q an.`,
        given: [`f: y = ${logHtml(1, a, b, c)}`, "Spiegelachse: x-Achse"],
        fields: [
          numberField("k =", -1, "", 0),
          numberField("p =", b, "", 0, { slips: [{ value: -b, hint: "Beim Spiegeln an der x-Achse bleiben die x-Werte gleich: Das Argument ändert sich nicht." }] }),
          numberField("q =", -c, "", 0, { slips: [{ value: c, hint: "y = −f(x): Auch der Summand c bekommt das umgekehrte Vorzeichen." }] }),
        ],
        steps: [`y = −f(x) = −(${logHtml(1, a, b, c)})`, `<strong>y = ${logHtml(-1, a, b, -c)}</strong>`],
        meta: { variant, a, b, c },
      };
    }
    if (variant === 1 || variant === 3) {
      const a = rng.pick([2, 3]);
      const fromExp = variant === 1;
      const f = fromExp ? expHtml(1, a, b, c) : logHtml(1, a, b, c);
      const form = fromExp ? `${logNameHtml(a)}(x − p) + q` : `${pow(a, "x − p")} + q`;
      return {
        prompt: `Der Graph der Funktion f mit y = ${f} wird an der Winkelhalbierenden y = x gespiegelt. Gib die Gleichung des Bildgraphen in der Form y = ${form} an.`,
        given: [`f: y = ${f}`, "Spiegelachse: y = x"],
        fields: [
          numberField("p =", c, "", 0, { slips: [{ value: b, hint: "Beim Spiegeln an y = x tauschen x und y die Rollen: Die Verschiebung nach oben wird zur Verschiebung nach rechts." }] }),
          numberField("q =", b, "", 0, { slips: [{ value: c, hint: "Die Verschiebung nach rechts wird zur Verschiebung nach oben." }] }),
        ],
        steps: [
          `x und y tauschen: x = ${fromExp ? expHtml(1, a, b, c, "y") : `${logNameHtml(a)}(${shiftedArg(b, "y")})${plusConst(c)}`}`,
          `nach y auflösen: ${fromExp ? `${shiftedArg(b, "y")} = ${logNameHtml(a)}(${shiftedArg(c)})` : `${shiftedArg(b, "y")} = ${pow(a, shiftedArg(c))}`}`,
          `<strong>y = ${fromExp ? logHtml(1, a, c, b) : expHtml(1, a, c, b)}</strong>`,
        ],
        meta: { variant, a, b, c },
      };
    }
    const a = rng.pick([2, 4, 5, 10]);
    const d = 1 / a;
    return {
      prompt: `Der Graph der Funktion f mit y = ${expHtml(1, a, b, c)} wird an der y-Achse gespiegelt. Gib die Gleichung des Bildgraphen in der Form y = d<sup>x − p</sup> + q an.`,
      given: [`f: y = ${expHtml(1, a, b, c)}`, "Spiegelachse: y-Achse"],
      fields: [
        numberField("d =", d, "", 2, { slips: [{ value: -a, hint: "Die Basis bleibt positiv: a hoch (−x) = (1 : a) hoch x." }] }),
        numberField("p =", -b, "", 0, { slips: [{ value: b, hint: "y = f(−x): Aus x − b wird −x − b = −(x + b), also p = −b." }] }),
        numberField("q =", c, "", 0),
      ],
      steps: [
        `y = f(−x) = ${fmt(a)}<sup>−x ${signed(-b, 0)}</sup>${plusConst(c)} = ${fmt(a)}<sup>−(${shiftedArg(-b)})</sup>${plusConst(c)}`,
        `${fmt(a)}<sup>−(…)</sup> = (${fracHtml(1, a)})<sup>…</sup> = ${fmt(d, 2)}<sup>…</sup>`,
        `<strong>y = ${expHtml(1, d, -b, c)}</strong>`,
      ],
      meta: { variant, a, b, c },
    };
  },
};

const streckung: ExerciseGenerator = {
  id: "streckung",
  make: (rng, level): ExerciseTask => {
    if (level === 1) {
      const k = rng.pick([2, 3, 4, 0.5, -2, -1]);
      const coefficient = 1 / k;
      return {
        prompt: `Die Parabel y = x² wird durch zentrische Streckung mit dem Zentrum O(0 | 0) und dem Faktor k = ${fmt(k)} abgebildet. Berechne den Bildpunkt von P(2 | 4) und gib die Gleichung des Bildgraphen in der Form y = a · x² an.`,
        given: ["Urgraph y = x²", `k = ${fmt(k)}`, "P(2 | 4)"],
        formulaHint: "Zentrische Streckung an O: (x | y) → (k · x | k · y); Bildgraph y = k · f(x : k)",
        fields: [
          numberField("x' =", 2 * k, "", 2),
          numberField("y' =", 4 * k, "", 2),
          numberField("a =", coefficient, "", 2, { slips: [{ value: k, hint: "y = k · (x : k)² = x² : k, nicht k · x²." }] }),
        ],
        steps: [
          `P'(${fmt(k)} · 2 | ${fmt(k)} · 4) = P'(${fmt(2 * k)} | ${fmt(4 * k)})`,
          `y = ${fmt(k)} · (x : ${paren(k)})² = ${fmt(k)} · x² : ${fmt(k * k)}`,
          `<strong>y = ${fmt(coefficient, 2)} · x²</strong>`,
        ],
        meta: { k },
      };
    }
    if (rng.next() < 0.5) {
      const k = rng.pick([2, 4, 8, 0.5]);
      const s = -k * Math.log2(k);
      return {
        prompt: `Der Graph von f: y = log<sub>2</sub> x wird durch zentrische Streckung mit dem Zentrum O(0 | 0) und dem Faktor k = ${fmt(k)} abgebildet. Bestimme die Gleichung des Bildgraphen in der Form y = r · log<sub>2</sub> x + s.`,
        given: ["f: y = log<sub>2</sub> x", `k = ${fmt(k)}`],
        fields: [
          numberField("r =", k, "", 2),
          numberField("s =", s, "", 2, {
            slips: [
              { value: -s, hint: "Vorzeichen: log₂(x : k) = log₂ x − log₂ k." },
              { value: -Math.log2(k), hint: "Auch log₂ k wird mit k multipliziert." },
            ],
          }),
        ],
        steps: [
          `y = ${fmt(k)} · log<sub>2</sub>(x : ${fmt(k)})`,
          `Quotientensatz: = ${fmt(k)} · (log<sub>2</sub> x − log<sub>2</sub> ${fmt(k)}) = ${fmt(k)} · log<sub>2</sub> x − ${paren(k * Math.log2(k))}`,
          `<strong>y = ${fmt(k)} · log<sub>2</sub> x${plusConst(s)}</strong>`,
        ],
        meta: { variant: 0, k },
      };
    }
    const a = rng.pick([2, 3, 4, 9]);
    const k = rng.pick([2, 0.5, -1]);
    const d = a ** (1 / k);
    return {
      prompt: `Der Graph von f: y = ${pow(a, "x")} wird durch zentrische Streckung mit dem Zentrum O(0 | 0) und dem Faktor k = ${fmt(k)} abgebildet. Bestimme die Gleichung des Bildgraphen in der Form y = r · d<sup>x</sup>. Runde d auf drei Nachkommastellen.`,
      given: [`f: y = ${pow(a, "x")}`, `k = ${fmt(k)}`],
      fields: [numberField("r =", k, "", 2), numberField("d =", d, "", 3, { slips: [{ value: a ** k, hint: "Im Exponenten steht x : k: Die neue Basis ist a hoch (1 : k)." }] })],
      steps: [
        `y = ${fmt(k)} · ${fmt(a)}<sup>x : ${paren(k)}</sup> = ${fmt(k)} · (${fmt(a)}<sup>1 : ${paren(k)}</sup>)<sup>x</sup>`,
        `${fmt(a)}<sup>1 : ${paren(k)}</sup> ≈ ${fmt(d, 3)}`,
        `<strong>y = ${fmt(k)} · ${fmt(d, 3)}<sup>x</sup></strong>`,
      ],
      meta: { variant: 1, a, k },
    };
  },
};

const funktionsgraphen: Lesson = {
  id: "ab-6-funktionsgraphen",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "5.7 Funktionsgraphen abbilden",
  subtitle: "Verschieben, spiegeln, strecken",
  tracks: ["I"],
  lehrplan: "M10 LB 2 (I): Abbildungen von Funktionsgraphen",
  whyItMatters:
    "Prüfungsaufgaben verschieben, spiegeln und strecken Graphen von Potenz-, Exponential- und Logarithmusfunktionen. Mit wenigen Regeln schreibst du die Gleichung des Bildgraphen sofort auf.",
  explanationHtml: `
    <p>Bildet man jeden Punkt eines Funktionsgraphen ab, entsteht ein Bildgraph. Seine Gleichung findest du so: Ein Bildpunkt P'(x | y) kommt von einem Urpunkt P, und P liegt auf dem Urgraphen y = f(x).</p>
    <ul>
      <li><strong>Parallelverschiebung um v→ = (v<sub>x</sub> | v<sub>y</sub>):</strong> P(x − v<sub>x</sub> | y − v<sub>y</sub>) liegt auf y = f(x), also <strong>y = f(x − v<sub>x</sub>) + v<sub>y</sub></strong>. Aus y = 2<sup>x</sup> wird mit v→ = (3 | −1) der Graph y = 2<sup>x − 3</sup> − 1.</li>
      <li><strong>Spiegelung an der x-Achse:</strong> (x | y) → (x | −y), also <strong>y = −f(x)</strong>. Aus y = log<sub>2</sub> x wird y = −log<sub>2</sub> x = log<sub>0,5</sub> x.</li>
      <li><strong>Spiegelung an der y-Achse:</strong> (x | y) → (−x | y), also <strong>y = f(−x)</strong>. Aus y = 2<sup>x</sup> wird y = 2<sup>−x</sup> = 0,5<sup>x</sup>.</li>
      <li><strong>Spiegelung an der Winkelhalbierenden y = x:</strong> (x | y) → (y | x): x und y tauschen, das ergibt die <strong>Umkehrfunktion</strong>. Aus y = 2<sup>x</sup> wird y = log<sub>2</sub> x. Bei y = x² entsteht x = y²; das ist kein Funktionsgraph, denn er besteht aus den beiden Ästen y = ${sqrtHtml("x")} und y = −${sqrtHtml("x")}. Schränkt man y = x² auf x ≥ 0 ein, ist die Umkehrfunktion y = ${sqrtHtml("x")}.</li>
      <li><strong>Zentrische Streckung an O mit dem Faktor k:</strong> (x | y) → (k · x | k · y), also <strong>y = k · f(x : k)</strong>. Aus y = x² wird y = k · (x : k)² = x² : k.</li>
    </ul>
    <div class="example">Der Graph von f: y = log<sub>2</sub>(x + 1) wird durch Parallelverschiebung mit v→ = (−2 | 3) auf f' abgebildet: y = log<sub>2</sub>((x + 2) + 1) + 3 = log<sub>2</sub>(x + 3) + 3. Die Asymptote x = −1 wandert nach x = −3.</div>
    <div class="merke"><strong>Merke:</strong> Beim Verschieben steht im Funktionsterm das Gegenteil: Nach rechts um 3 heißt x − 3. Spiegeln an y = x heißt x und y tauschen.</div>
  `,
  formulas: [
    { name: "Parallelverschiebung um v→", html: "y = f(x − v<sub>x</sub>) + v<sub>y</sub>", quantities: "vₓ nach rechts, v_y nach oben" },
    { name: "Achsenspiegelungen", html: "x-Achse: y = −f(x); y-Achse: y = f(−x); y = x: Umkehrfunktion", quantities: "Spiegelachse x-Achse, y-Achse oder Winkelhalbierende y = x" },
    { name: "Zentrische Streckung an O", html: "y = k · f(x : k)", quantities: "Streckfaktor k ≠ 0, Zentrum O(0 | 0)" },
  ],
  quiz: {
    question: "Der Graph von f wird um v→ = (2 | 3) verschoben. Welche Gleichung hat der Bildgraph?",
    options: ["y = f(x + 2) + 3", "y = f(x − 2) + 3", "y = f(x − 3) + 2"],
    correctIndex: 1,
    explanation: "Der Bildpunkt (x | y) kommt vom Urpunkt (x − 2 | y − 3), und der liegt auf dem Graphen von f: y − 3 = f(x − 2).",
  },
  lab: {
    kind: "graph-map",
    title: "Labor: Graphen abbilden",
    intro: "Wähle einen Urgraphen und eine Abbildung. Der Punkt P wandert nach P'; oben stehen die Gleichung des Bildgraphen und die Regel dazu. Bei Verschiebung und Streckung kannst du P' ziehen.",
    params: [
      {
        type: "choice",
        key: "f",
        label: "Urgraph",
        options: [
          { value: 0, label: "y = 2ˣ (Exponentialfunktion)" },
          { value: 1, label: "y = log₂ x (Logarithmusfunktion)" },
          { value: 2, label: "y = x² (Potenzfunktion)" },
        ],
        value: 0,
      },
      { type: "choice", key: "map", label: "Abbildung", options: MAP_NAMES.map((name, value) => ({ value, label: name })), value: 0 },
      { type: "range", key: "vx", label: "Verschiebung nach rechts vₓ", unit: "", min: -4, max: 4, step: 1, value: 2, showIf: (v) => v.map === 0 },
      { type: "range", key: "vy", label: "Verschiebung nach oben", unit: "", min: -4, max: 4, step: 1, value: 1, showIf: (v) => v.map === 0 },
      { type: "range", key: "k", label: "Streckfaktor k", unit: "", min: -4, max: 4, step: 0.5, value: 2, digits: 1, showIf: (v) => v.map === 4 },
    ],
    readouts: [
      { key: "ur", label: "Urgraph", compute: (v) => MAP_ORIGINALS[v.f] ?? MAP_ORIGINALS[0] },
      {
        key: "abbildung",
        label: "Abbildung",
        compute: (v) => (v.map === 0 ? `Verschiebung um v→ = (${fmt(v.vx)} | ${fmt(v.vy)})` : v.map === 4 ? `zentrische Streckung an O mit k = ${fmt(v.k)}` : (MAP_NAMES[v.map] ?? "")),
      },
      { key: "punkte", label: "Punkte", compute: mapPointRule },
      { key: "bild", label: "Bildgraph", emphasis: true, compute: (v) => imageEquation(v).text },
      { key: "regel", label: "Regel", compute: mapRule },
    ],
    goals: [
      {
        id: "verschiebung",
        text: "Bilde y = 2ˣ durch eine Verschiebung auf den Graphen von y = 2ˣ⁺¹ − 3 ab.",
        check: (v) => v.f === 0 && v.map === 0 && v.vx === -1 && v.vy === -3,
      },
      { id: "log-basis", text: "Finde die Abbildung, die den Graphen von y = log₂ x auf den Graphen von y = log₀,₅ x abbildet.", check: (v) => v.f === 1 && v.map === 1 },
      {
        id: "streckung",
        text: "Strecke die Parabel y = x² zentrisch an O so, dass der Bildgraph durch den Punkt (2 | 1) geht.",
        check: (v) => v.f === 2 && v.map === 4 && v.k === 4,
      },
    ],
  },
  exercises: [verschiebung, spiegelung, streckung],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst die Gleichung jedes Bildgraphen bei Verschiebung, Spiegelung und zentrischer Streckung.",
};

export const STAGE_EXPONENTIAL_LOGARITHMUS: Stage = {
  id: STAGE_ID,
  stageNumber: 5,
  title: "Exponential- und Logarithmusfunktionen",
  subtitle: "Wachstum und Zerfall, Logarithmen, Logarithmensätze, Graphen abbilden",
  icon: "📈",
  accent: "#db2777",
  badgeTitle: "Wachstums-Profi",
  lehrplanLabel: "LB 4 (I) · LB 3 (II/III) · LB 2 Graphen abbilden (I)",
  lessons: [exponentialfunktion, wachstum, logarithmus, logarithmensaetze, exponentialAllgemein, logarithmusfunktion, funktionsgraphen],
};
