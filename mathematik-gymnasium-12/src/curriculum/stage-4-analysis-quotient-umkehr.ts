/**
 * Lernbereich 4: Untersuchung von Funktionen – Quotientenregel, Umkehrfunktion (29 Std.)
 * 8 Lektionen zu gebrochen-rationalen Funktionen, Wurzelfunktionen und der natürlichen Logarithmusfunktion.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range, task } from "./builders";
import { numberField } from "./helpers";
import type { Rng } from "../exercises/rng";
import { fmt } from "../exercises/format";

export const STAGE_4_LESSONS: Lesson[] = [
  // 4.1 Quotientenregel bei gebrochen-rationalen Funktionen
  makeLesson(4, 1, 1, {
    id: "g12-quotientenregel-basis",
    title: "Quotientenregel bei gebrochen-rationalen Funktionen",
    subtitle: "Ableitung von Brüchen mit Zähler- und Nennerpolynomen",
    whyItMatters:
      "Quotientenfunktionen modellieren Wirkungsgrade, Konzentrationen und Durchschnittskosten in Industrie und Technik.",
    explanationHtml: `
      <p>Liegt eine Funktion als Quotient zweier differenzierbarer Funktionen <i>f(x) = u(x) / v(x)</i> vor, lautet die <strong>Quotientenregel</strong>:</p>
      <div class="merke">
        <strong>Quotientenregel:</strong>
        <p style="text-align:center;"><i>f'(x) = [u'(x) · v(x) − u(x) · v'(x)] / [v(x)]²</i></p>
        <p>Merkspruch: <em>„Unten mal Ableitung oben minus oben mal Ableitung unten, alles durch unten zum Quadrat.“</em></p>
        <strong>Kürzungsregel:</strong> Enthält der Zähler nach dem Ausdifferenzieren Faktoren des Nenners, kürzt man <strong>vor</strong> dem Ausmultiplizieren!
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Leite <i>f(x) = (2x + 1) / (x − 3)</i> ab.<br>
        <i>u(x) = 2x + 1 &rArr; u'(x) = 2</i><br>
        <i>v(x) = x − 3 &rArr; v'(x) = 1</i><br>
        <i>f'(x) = [2 · (x − 3) − (2x + 1) · 1] / (x − 3)² = [2x − 6 − 2x − 1] / (x − 3)² = −7 / (x − 3)²</i>.
      </div>
    `,
    formulas: [
      {
        name: "Quotientenregel",
        html: "(<sup>u</sup>/<sub>v</sub>)' = <sup>u'v &minus; uv'</sup>/<sub>v²</sub>",
        quantities: "v(x) ≠ 0",
      },
    ],
    quiz: {
      question: "Wie lautet die 1. Ableitung von f(x) = 1 / x²?",
      options: [
        "f'(x) = −2 / x³",
        "f'(x) = 1 / (2x)",
        "f'(x) = −1 / x⁴",
      ],
      correctIndex: 0,
      explanation:
        "Mit Potenzregel x^{−2} oder Quotientenregel mit u=1, v=x²: f'(x) = −2 · x^{−3} = −2 / x³.",
    },
    lab: lab(
      "quotient-rule",
      "Quotientenregel f(x) = (ax + b) / (x − pole)",
      "Verändere Zählerparameter a, b und Polstelle.",
      [
        range("a", "Koeffizient a", 1, 4, 2, 1),
        range("b", "Konstante b", -3, 3, 1, 1),
        range("pole", "Polstelle", 1, 4, 2, 1),
      ],
      [
        output("zaehler_prime", "Zähler von f': -(a·pole + b)", (v) => -(v.a * v.pole + v.b), "", 0),
        output("asymptote", "Waagrechte Asymptote y =", (v) => v.a, "", 0),
      ],
      [
        {
          id: "pol-drei",
          text: "Verschiebe die Polstelle auf x = 3.",
          check: (v) => v.pole === 3,
        },
        {
          id: "waagrecht-eins",
          text: "Stelle a = 1 ein (waagrechte Asymptote y = 1).",
          check: (v) => v.a === 1,
        },
        {
          id: "zaehler-null",
          text: "Wähle b = −2 bei a = 1 und pole = 2.",
          check: (v) => v.a === 1 && v.b === -2 && v.pole === 2,
        },
      ],
    ),
    exercises: [
      {
        id: "quotientenregel-linear",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([1, 2, 3]);
          const d = rng.pick([1, 2, 4]);
          // f(x) = a*x / (x + d) -> f'(0) = (a*d - 0) / d^2 = a / d
          const slope0 = a / d;
          return task(
            level,
            `Berechne die Steigung f'(0) der Funktion f(x) = ${a}x / (x + ${d}) (auf zwei Dezimalen gerundet).`,
            `Der Wirkungsgrad einer Turbine in Abhängigkeit von der Drehzahl x wird modelliert durch &eta;(x) = ${a}x / (x + ${d}). Bestimme die Anfangssteigerung &eta;'(0).`,
            [numberField("f'(0) =", slope0, "", 2)],
            `Quotientenregel: f'(x) = [${a}·(x+${d}) − ${a}x·1] / (x+${d})² = ${a * d} / (x+${d})². Für x=0 ist f'(0) = ${a * d} / ${d * d} = ${a} / ${d}.`,
            `f'(0) = ${a} / ${d} = ${fmt(slope0, 2)}.`,
            `f'(0) = ${fmt(slope0, 2)}`,
            { a, d },
          );
        },
      },
      {
        id: "ableitungszaehler",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([2, 3, 5]);
          // f(x) = (x + c) / (x - 1) -> u'v - uv' = 1*(x-1) - (x+c)*1 = -1 - c
          const num = -1 - c;
          return task(
            level,
            `Welchen konstanten Wert nimmt der Zähler der 1. Ableitung von f(x) = (x + ${c}) / (x − 1) an?`,
            `Bestimme den Zählerterm von f'(x) nach Anwendung der Quotientenregel auf f(x) = (x + ${c}) / (x − 1).`,
            [numberField("Zähler =", num, "", 0)],
            "Quotientenregel: Zähler = u'·v − u·v'.",
            `u'v − uv' = 1·(x − 1) − (x + ${c})·1 = x − 1 − x − ${c} = ${fmt(num, 0)}.`,
            `Zähler = ${fmt(num, 0)}`,
            { c },
          );
        },
      },
    ],
  }),

  // 4.2 Kurvendiskussion gebrochen-rationaler Funktionen
  makeLesson(4, 2, 1, {
    id: "g12-gebrochen-rational-diskussion",
    title: "Kurvendiskussion gebrochen-rationaler Funktionen",
    subtitle: "Definitionsbereich, hebbare Lücken, Polstellen und Asymptoten",
    whyItMatters:
      "Grenzwerte und Polstellen bestimmen die Stabilität von Regelkreisen und Resonanzkatastrophen in Schwingungssystemen.",
    explanationHtml: `
      <p>Bei gebrochen-rationalen Funktionen <i>f(x) = Z(x) / N(x)</i> liefert der Nenner <i>N(x) = 0</i> die <strong>Definitionslücken</strong>:</p>
      <div class="merke">
        <strong>Klassifikation der Definitionslücken:</strong>
        <ul>
          <li><strong>Hebbare Definitionslücke:</strong> Ist <i>x<sub>0</sub></i> eine Nullstelle von Nenner <i>und</i> Zähler mit gleicher oder höherer Vielfachheit im Zähler, lässt sich der Faktor <i>(x − x<sub>0</sub>)</i> herauskürzen. Der Graph hat dort ein „Loch“.</li>
          <li><strong>Polstelle (senkrechte Asymptote):</strong> Ist die Vielfachheit im Nenner größer als im Zähler, strebt <i>f(x) &rarr; &plusmn;&infin;</i>.</li>
          <li><strong>Verhalten im Unendlichen:</strong>
            <br>&bull; Grad Zähler &lt; Grad Nenner &rArr; waagrechte Asymptote <i>y = 0</i>.
            <br>&bull; Grad Zähler = Grad Nenner &rArr; waagrechte Asymptote <i>y = a<sub>n</sub> / b<sub>n</sub></i>.
            <br>&bull; Grad Zähler = Grad Nenner + 1 &rArr; schräge Asymptote (Polynomdivision!).
          </li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> <i>f(x) = (3x² − 12) / (x² − 1)</i>.<br>
        Definitionsbereich: <i>&reals; \ {−1; 1}</i>.<br>
        Da <i>Grad Zähler = Grad Nenner = 2</i>, lautet die waagrechte Asymptote: <i>y = 3/1 = 3</i>.<br>
        Polstellen mit Vorzeichenwechsel bei <i>x = −1</i> und <i>x = 1</i>.
      </div>
    `,
    formulas: [
      {
        name: "Waagrechte Asymptote (gleicher Grad)",
        html: "lim<sub>x&rarr;&infin;</sub> <sup>a<sub>n</sub>x<sup>n</sup> + ...</sup>/<sub>b<sub>n</sub>x<sup>n</sup> + ...</sub> = <sup>a<sub>n</sub></sup>/<sub>b<sub>n</sub></sub>",
        quantities: "a_n, b_n Leitkoeffizienten",
      },
    ],
    quiz: {
      question: "Welche Asymptote besitzt f(x) = (4x² + 5) / (2x² − 8) für x → ±∞?",
      options: [
        "y = 2",
        "y = 0",
        "x = 2",
      ],
      correctIndex: 0,
      explanation:
        "Da Zähler- und Nennergrad übereinstimmen (Grad 2), ergibt sich die waagrechte Asymptote als Quotient der Leitkoeffizienten: y = 4 / 2 = 2.",
    },
    lab: lab(
      "rational-curve",
      "Kurvendiskussion rationaler Funktionen",
      "Stelle den Zählerparameter a in f(x) = (x² − a) / (x² + 1) ein.",
      [range("a", "Parameter a", 0, 9, 1, 1)],
      [
        output("nullstellen", "Positive Nullstelle", (v) => Math.sqrt(v.a), "", 2),
        output("achsenabschnitt", "y-Achsenabschnitt f(0)", (v) => -v.a, "", 0),
      ],
      [
        {
          id: "null-ursprung",
          text: "Wähle a = 0, sodass f(x) den Ursprung berührt.",
          check: (v) => v.a === 0,
        },
        {
          id: "null-drei",
          text: "Stelle a = 9 für Nullstellen bei x = ±3 ein.",
          check: (v) => v.a === 9,
        },
        {
          id: "standard-vier",
          text: "Bringe a = 4 zurück.",
          check: (v) => v.a === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "asymptote-bestimmen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([6, 8, 10]);
          const b = 2;
          const asympY = a / b;
          return task(
            level,
            `Bestimme die waagrechte Asymptote y der Funktion f(x) = (${a}x² − 3) / (${b}x² + 5).`,
            `Für eine Fertigungsstraße verhalten sich die Stückkosten nach K(x) = (${a}x² − 3) / (${b}x² + 5). Welche Grenzkosten y stellen sich bei extrem hohen Stückzahlen x ein?`,
            [numberField("y =", asympY, "", 0)],
            `Quotient der Leitkoeffizienten: y = ${a} / ${b} = ${asympY}.`,
            `y = ${asympY}`,
            { a, b },
          );
        },
      },
      {
        id: "polstelle-bestimmen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const p = rng.pick([2, 3, 5]);
          return task(
            level,
            `Bestimme die positive Polstelle der Funktion f(x) = 1 / (x² − ${p * p}).`,
            `In einem akustischen Filter tritt eine Resonanzüberhöhung bei x² − ${p * p} = 0 auf. Bestimme die positive Resonanzstelle x.`,
            [numberField("x =", p, "", 0)],
            `Nennernullstellen: x² − ${p * p} = 0 &rArr; x = ${p}.`,
            `x = ${p}`,
            { p },
          );
        },
      },
    ],
  }),

  // 4.3 Quotientenregel bei verknüpften Funktionen
  makeLesson(4, 3, 1, {
    id: "g12-quotientenregel-verknuepfung",
    title: "Verknüpfungen mit der Quotientenregel",
    subtitle: "Differenzieren von e^x / p(x) und sin(x) / x",
    whyItMatters:
      "Gedämpfte Schwingungen und Lorentz-Profile in der Spektroskopie entstehen durch Kombination von Quotienten- mit Exponential- und Winkelfunktionen.",
    explanationHtml: `
      <p>Treten im Zähler oder Nenner transzendente Funktionen (wie <i>e<sup>x</sup></i> oder <i>sin(x)</i>) auf, kombiniert man die <strong>Quotientenregel</strong> mit der <strong>Kettenregel</strong>.</p>
      <div class="merke">
        <strong>Standardbeispiel f(x) = e<sup>x</sup> / (x + a):</strong>
        <ul>
          <li><i>u(x) = e<sup>x</sup> &rArr; u'(x) = e<sup>x</sup></i></li>
          <li><i>v(x) = x + a &rArr; v'(x) = 1</i></li>
          <li><i>f'(x) = [e<sup>x</sup> · (x + a) − e<sup>x</sup> · 1] / (x + a)² = [e<sup>x</sup> · (x + a − 1)] / (x + a)²</i>.</li>
          <li>Die Extremstelle liegt bei <i>x = 1 − a</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Leite <i>f(x) = sin(x) / x</i> für <i>x &ne; 0</i> ab.<br>
        <i>f'(x) = [cos(x) · x − sin(x) · 1] / x² = (x · cos x − sin x) / x²</i>.
      </div>
    `,
    formulas: [
      {
        name: "Quotientenregel mit e-Funktion",
        html: "(<sup>e<sup>x</sup></sup>/<sub>v</sub>)' = <sup>e<sup>x</sup>(v &minus; v')</sup>/<sub>v²</sub>",
        quantities: "v differenzierbare Nennerfunktion",
      },
    ],
    quiz: {
      question: "An welcher Stelle x besitzt f(x) = e^x / x für x > 0 eine waagrechte Tangente?",
      options: [
        "x = 1, da f'(x) = e^x · (x − 1) / x² = 0.",
        "x = 0, da der Nenner dort null ist.",
        "x = e, da e / e = 1.",
      ],
      correctIndex: 0,
      explanation:
        "Ableitung: f'(x) = [e^x · x − e^x · 1] / x² = e^x · (x − 1) / x². Nullsetzen des Zählers liefert x = 1.",
    },
    lab: lab(
      "quotient-compositions",
      "Quotient mit e-Funktion: e^{0,5x} / (x + a)",
      "Verschiebe den Parameter a und beobachte Polstelle und Minimum.",
      [range("a", "Parameter a", 0, 4, 3, 1)],
      [
        output("extremstelle", "Extremstelle x_min = 2 - a", (v) => 2 - v.a, "", 0),
        output("polstelle", "Polstelle x_pol = -a", (v) => -v.a, "", 0),
      ],
      [
        {
          id: "extrem-ursprung",
          text: "Wähle a = 2, sodass das Minimum genau bei x = 0 liegt.",
          check: (v) => v.a === 2,
        },
        {
          id: "extrem-eins",
          text: "Wähle a = 1 für ein Minimum bei x = 1.",
          check: (v) => v.a === 1,
        },
        {
          id: "extrem-zwei",
          text: "Stelle a = 0 ein.",
          check: (v) => v.a === 0,
        },
      ],
    ),
    exercises: [
      {
        id: "exp-durch-x-extremum",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 3, 4]);
          // f(x) = e^x / (x + a) -> f'(x) = e^x * (x + a - 1) / (x + a)^2 = 0 -> x = 1 - a
          const xMin = 1 - a;
          return task(
            level,
            `Berechne die Extremstelle der Funktion f(x) = e<sup>x</sup> / (x + ${a}).`,
            `Die Energieaufnahme eines Partikels folgt E(x) = e<sup>x</sup> / (x + ${a}) für x &gt; −${a}. Bestimme die Stelle minimaler Energie.`,
            [numberField("x =", xMin, "", 0)],
            `Zähler der Ableitung: e^x · (x + ${a} − 1) = 0 &rArr; x = 1 − ${a} = ${xMin}.`,
            `x = ${xMin}`,
            { a },
          );
        },
      },
      {
        id: "quotient-sin-ableitung",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // f(x) = x / (x^2 + 1) -> f'(0) = (1*(0+1) - 0*2x) / 1^2 = 1
          return task(
            level,
            "Berechne die Steigung f'(0) für f(x) = x / (x² + 1).",
            "Bestimme die Momentansteigung der Resonanzkurve f(x) = x / (x² + 1) im Ursprung.",
            [numberField("f'(0) =", 1, "", 0)],
            "Quotientenregel: f'(x) = [1·(x²+1) − x·2x] / (x²+1)² = (1 − x²) / (x²+1)². Bei x=0 ergibt sich 1 / 1 = 1.",
            "f'(0) = 1",
          );
        },
      },
    ],
  }),

  // 4.4 Umkehrbarkeit und Wurzelfunktion
  makeLesson(4, 4, 2, {
    id: "g12-umkehrfunktion-wurzel",
    title: "Umkehrbarkeit und Umkehrfunktionen",
    subtitle: "Strenge Monotonie, Spiegelung an y = x und rechnerische Invertierung",
    whyItMatters:
      "Um aus gemessenen Sensorsignalen die physikalische Eingangsgröße exakt zurückzurechnen, benötigt man die Umkehrfunktion.",
    explanationHtml: `
      <p>Eine Funktion <i>f: D<sub>f</sub> &rarr; W<sub>f</sub></i> ist genau dann <strong>umkehrbar (injektiv)</strong>, wenn jedem Funktionswert <i>y</i> genau ein Urbild <i>x</i> zugeordnet ist. Hinreichend dafür ist <strong>strenge Monotonie</strong> (<i>f'(x) &gt; 0</i> oder <i>f'(x) &lt; 0</i>).</p>
      <div class="merke">
        <strong>Eigenschaften der Umkehrfunktion f<sup>−1</sup>:</strong>
        <ul>
          <li><i>D<sub>f<sup>−1</sup></sub> = W<sub>f</sub></i> und <i>W<sub>f<sup>−1</sup></sub> = D<sub>f</sub></i>.</li>
          <li>Der Graph von <i>f<sup>−1</sup></i> entsteht durch <strong>Spiegelung des Graphen von f an der 1. Winkelhalbierenden y = x</strong>.</li>
          <li><strong>Rechnerische Bestimmung:</strong>
            <ol>
              <li>Gleichung <i>y = f(x)</i> nach <i>x</i> auflösen.</li>
              <li>Variablen vertauschen: <i>x &harr; y</i>.</li>
            </ol>
          </li>
          <li><strong>Wurzelfunktion:</strong> <i>f(x) = x²</i> mit <i>D = [0; &infin;[</i> &rArr; Umkehrfunktion <i>f<sup>−1</sup>(x) = &radic;x</i> mit <i>D = [0; &infin;[</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Bestimme die Umkehrfunktion von <i>f(x) = 2x − 6</i> mit <i>D = &reals;</i>.<br>
        1. Auflösen nach <i>x</i>: <i>y = 2x − 6 &rArr; y + 6 = 2x &rArr; x = 0,5y + 3</i>.<br>
        2. Tauschen: <i>y = 0,5x + 3 &rArr; f<sup>−1</sup>(x) = 0,5x + 3</i>.
      </div>
    `,
    formulas: [
      {
        name: "Umkehrbarkeitskriterium",
        html: "f'(x) &gt; 0 &forall; x &isin; D &rArr; f streng monoton steigend &rArr; f umkehrbar",
        quantities: "D Definitionsintervall",
      },
    ],
    quiz: {
      question: "Warum ist die Normalparabel f(x) = x² auf ganz ℝ nicht umkehrbar?",
      options: [
        "Weil zu jedem Funktionswert y > 0 zwei verschiedene x-Werte gehören (z. B. f(−2) = f(2) = 4).",
        "Weil x² immer positiv ist.",
        "Weil die Ableitung f'(0) = 0 ist.",
      ],
      correctIndex: 0,
      explanation:
        "Eine Funktion ist nur umkehrbar, wenn die Zuordnung eindeutig ist. Auf ganz ℝ ist f(x) = x² nicht streng monoton, erst durch Einschränkung auf [0; ∞[ wird sie umkehrbar.",
    },
    lab: lab(
      "inverse-function",
      "Spiegelung an y = x: f(x) = ax² und f^{-1}",
      "Verändere den Streckfaktor a der Parabel (für x ≥ 0).",
      [range("a", "Streckfaktor a", 1, 4, 3, 1)],
      [
        output("umkehrterm", "f^{-1}(x)", (v) => `√(x/${v.a})`),
      ],
      [
        {
          id: "normal",
          text: "Wähle a = 1 für f(x) = x² und f^{-1}(x) = √x.",
          check: (v) => v.a === 1,
        },
        {
          id: "zwei",
          text: "Stelle a = 2 ein (f(x) = 2x², f^{-1}(x) = √(x/2)).",
          check: (v) => v.a === 2,
        },
        {
          id: "vier",
          text: "Wähle a = 4.",
          check: (v) => v.a === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "umkehrterm-linear",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const m = rng.pick([2, 4, 5]);
          const t = rng.pick([6, 10, 15]);
          // y = m*x + t -> x = (y - t)/m = (1/m)*y - t/m
          const invT = -t / m;
          return task(
            level,
            `Die Umkehrfunktion von f(x) = ${m}x + ${t} hat die Form f<sup>−1</sup>(x) = m* · x + t*. Bestimme den Achsenabschnitt t*.`,
            `Ein Kalibrierungssensor liefert Spannung U = ${m}·T + ${t}. Bestimme die Konstante t* zur Rückrechnung der Temperatur T(U) = m*·U + t*.`,
            [numberField("t* =", invT, "", 2)],
            `y = ${m}x + ${t} &rArr; x = (y − ${t}) / ${m} = (1/${m})y − ${t}/${m}. Also t* = −${t}/${m} = ${invT}.`,
            `t* = ${fmt(invT, 2)}`,
            { m, t },
          );
        },
      },
      {
        id: "umkehr-quadrat",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([4, 9, 16]);
          // f(x) = sqrt(x + c) -> y = sqrt(x+c) -> y^2 = x + c -> x = y^2 - c
          return task(
            level,
            `Bestimme die Konstante d der Umkehrfunktion f<sup>−1</sup>(x) = x² + d für f(x) = &radic;(x + ${c}) (für x &ge; 0).`,
            `Die Bremsverzögerung führt auf die Umkehrfunktion s(v) = v² + d. Bestimme d für v(s) = &radic;(s + ${c}).`,
            [numberField("d =", -c, "", 0)],
            `y = &radic;(x + ${c}) &rArr; y² = x + ${c} &rArr; x = y² − ${c}. Also d = −${c}.`,
            `d = −${c}`,
            { c },
          );
        },
      },
    ],
  }),

  // 4.5 Ableitung von Potenzfunktionen mit rationalen Exponenten
  makeLesson(4, 5, 2, {
    id: "g12-potenz-rationale-exponenten",
    title: "Ableitung von Potenzen mit rationalen Exponenten",
    subtitle: "Umschreiben von Wurzeln in Potenzen x^{p/q} und Differenzieren",
    whyItMatters:
      "Keplers 3. Planetengesetz (T² ~ a³) und Allometriegesetze in der Biologie basieren auf gebrochenen Exponenten.",
    explanationHtml: `
      <p>Jede Wurzelfunktion lässt sich nach den Potenzgesetzen als Potenz mit <strong>rationalem Exponenten</strong> schreiben: <i><sup>q</sup>&radic;(x<sup>p</sup>) = x<sup>p/q</sup></i>.</p>
      <div class="merke">
        <strong>Potenzregel für beliebige rationale Exponenten r &isin; &rationals;:</strong>
        <p style="text-align:center;"><i>(x<sup>r</sup>)' = r · x<sup>r − 1</sup></i></p>
        <strong>Spezialfall Quadratwurzel:</strong>
        <p style="text-align:center;"><i>(&radic;x)' = (x<sup>1/2</sup>)' = 1/2 · x<sup>−1/2</sup> = 1 / (2&radic;x)</i></p>
        <strong>Kettenregel bei verknüpften Wurzeln:</strong>
        <p style="text-align:center;"><i>(&radic;u(x))' = u'(x) / (2&radic;u(x))</i></p>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Leite <i>f(x) = ³&radic;x = x<sup>1/3</sup></i> ab.<br>
        <i>f'(x) = 1/3 · x<sup>1/3 − 1</sup> = 1/3 · x<sup>−2/3</sup> = 1 / (3 · ³&radic;(x²))</i>.
      </div>
    `,
    formulas: [
      {
        name: "Ableitung von Wurzel x",
        html: "(&radic;x)' = <sup>1</sup>/<sub>2&radic;x</sub>",
        quantities: "x > 0",
      },
      {
        name: "Potenzregel für rationale Exponenten",
        html: "(x<sup>p/q</sup>)' = <sup>p</sup>/<sub>q</sub> &middot; x<sup>p/q &minus; 1</sup>",
        quantities: "q ≠ 0",
      },
    ],
    quiz: {
      question: "Welchen Wert hat die Ableitung der Quadratwurzel f(x) = √x an der Stelle x = 4?",
      options: [
        "1/4 = 0,25, da 1 / (2√4) = 1 / (2·2) = 1/4.",
        "1/2 = 0,5",
        "2",
      ],
      correctIndex: 0,
      explanation:
        "Mit (√x)' = 1 / (2√x) ergibt sich für x = 4: f'(4) = 1 / (2·2) = 1/4 = 0,25.",
    },
    lab: lab(
      "rational-powers",
      "Rationale Exponenten x^{p/q}",
      "Wähle Zähler p und Nenner q des Exponenten.",
      [
        range("p", "Zähler p", 1, 3, 2, 1),
        range("q", "Nenner q", 2, 4, 3, 1),
      ],
      [
        output("exponent", "Exponent r = p/q", (v) => v.p / v.q, "", 2),
      ],
      [
        {
          id: "quadratwurzel",
          text: "Wähle p = 1 und q = 2 für die Quadratwurzel √x.",
          check: (v) => v.p === 1 && v.q === 2,
        },
        {
          id: "kubikwurzel",
          text: "Wähle p = 1 und q = 3 für die dritte Wurzel ³√x.",
          check: (v) => v.p === 1 && v.q === 3,
        },
        {
          id: "drei-viertel",
          text: "Stelle p = 3 und q = 4 ein.",
          check: (v) => v.p === 3 && v.q === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "wurzel-ableitungswert",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const x0 = rng.pick([1, 4, 9, 16]);
          const slope = 1 / (2 * Math.sqrt(x0));
          return task(
            level,
            `Berechne den Wert der 1. Ableitung von f(x) = &radic;x an der Stelle x = ${x0}.`,
            `Die Ausbreitungsgeschwindigkeit einer Tsunamiwelle im flachen Wasser folgt v(h) = &radic;h. Bestimme die Änderungsrate v'(${x0}).`,
            [numberField("f' =", slope, "", 3)],
            `f'(x) = 1 / (2&radic;x) &rArr; f'(${x0}) = 1 / (2·${Math.sqrt(x0)}) = ${slope}.`,
            `f'(${x0}) = ${fmt(slope, 3)}`,
            { x0 },
          );
        },
      },
      {
        id: "kettenregel-wurzel",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 4, 6]);
          // f(x) = sqrt(a*x + 1) -> f'(0) = a / (2*sqrt(1)) = a / 2
          const slope0 = a / 2;
          return task(
            level,
            `Berechne die Steigung im Ursprung f'(0) für f(x) = &radic;(${a}x + 1).`,
            `Bestimme die Randsteigung f'(0) der Funktion f(x) = &radic;(${a}x + 1).`,
            [numberField("f'(0) =", slope0, "", 1)],
            `Kettenregel: f'(x) = ${a} / (2&radic;(${a}x + 1)). Für x = 0 ist f'(0) = ${a} / 2 = ${slope0}.`,
            `f'(0) = ${slope0}`,
            { a },
          );
        },
      },
    ],
  }),

  // 4.6 Kurvendiskussion von Wurzelfunktionen
  makeLesson(4, 6, 2, {
    id: "g12-wurzel-kurvendiskussion",
    title: "Kurvendiskussion von Wurzelfunktionen",
    subtitle: "Definitionsmenge, Randverhalten und senkrechte Tangenten",
    whyItMatters:
      "Die Randsteigung von Wurzelfunktionen strebt gegen unendlich. Das erklärt, warum Kerben in Bauteilen zu extremer Spannungskonzentration führen.",
    explanationHtml: `
      <p>Unter der Quadratwurzel dürfen im Reellen keine negativen Zahlen stehen: <strong>Radikand &ge; 0</strong>.</p>
      <div class="merke">
        <strong>Besonderheiten der Kurvendiskussion bei f(x) = &radic;(u(x)):</strong>
        <ul>
          <li><strong>Definitionsbereich:</strong> Bedingung <i>u(x) &ge; 0</i> lösen.</li>
          <li><strong>Randsteigung:</strong> An den Nullstellen des Radikanden (wo <i>u(x<sub>0</sub>) = 0</i>) gilt im Nenner der Ableitung <i>2&radic;u(x) &rarr; 0</i>, die Steigung strebt gegen <i>+&infin;</i> (<strong>senkrechte Tangente</strong>).</li>
          <li>Am Rand des Definitionsbereichs ist die Funktion zwar stetig, aber <strong>nicht differenzierbar</strong>!</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> <i>f(x) = &radic;(4 − x²)</i>.<br>
        Definitionsbereich: <i>4 − x² &ge; 0 &rArr; D = [−2; 2]</i>.<br>
        Graph ist ein oberer Halbkreis mit Radius 2.<br>
        Ableitung: <i>f'(x) = −2x / (2&radic;(4 − x²)) = −x / &radic;(4 − x²)</i>.<br>
        Für <i>x &rarr; 2<sup>−</sup></i> strebt <i>f'(x) &rarr; −&infin;</i> (senkrechte Kreistangente!).
      </div>
    `,
    formulas: [
      {
        name: "Definitionsbedingung für Radikanden",
        html: "D = {x &isin; &reals; | Radikand(x) &ge; 0}",
        quantities: "Radikand Term unter der Wurzel",
      },
    ],
    quiz: {
      question: "Was geschieht mit der Tangente an den Graphen von f(x) = √(x − 2) für x → 2?",
      options: [
        "Die Tangente wird senkrecht (Steigung strebt gegen +∞).",
        "Die Tangente wird waagrecht (Steigung ist 0).",
        "Die Steigung bleibt konstant bei 1.",
      ],
      correctIndex: 0,
      explanation:
        "Ableitung f'(x) = 1 / (2√(x − 2)). Für x → 2 geht der Nenner gegen 0+, der Bruch also gegen +∞. Die Tangente steht senkrecht.",
    },
    lab: lab(
      "root-curve",
      "Wurzelfunktion f(x) = √(x + c)",
      "Verschiebe den Parameter c und beobachte den Rand des Definitionsbereichs.",
      [range("c", "Verschiebung c", 0, 4, 1, 1)],
      [
        output("rand", "Rand des Definitionsbereichs x_min", (v) => -v.c, "", 0),
      ],
      [
        {
          id: "ursprung-start",
          text: "Wähle c = 0 für die Standard-Wurzel D = [0; ∞[.",
          check: (v) => v.c === 0,
        },
        {
          id: "start-minus-vier",
          text: "Wähle c = 4 (Definitionsbereich [−4; ∞[).",
          check: (v) => v.c === 4,
        },
        {
          id: "start-minus-zwei",
          text: "Stelle c = 2 ein.",
          check: (v) => v.c === 2,
        },
      ],
    ),
    exercises: [
      {
        id: "wurzel-definitionsbereich",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([3, 5, 7, 9]);
          return task(
            level,
            `Bestimme den kleinstmöglichen Wert x<sub>min</sub> des Definitionsbereichs D = [x<sub>min</sub>; +&infin;[ für f(x) = &radic;(x − ${a}).`,
            `Für die Lebensdauerfunktion eines Akkus L(t) = &radic;(t − ${a}) ist der physikalische Startzeitpunkt t<sub>min</sub> gesucht.`,
            [numberField("x_min =", a, "", 0)],
            `Radikand nichtnegativ: x − ${a} ≥ 0 &rArr; x ≥ ${a}.`,
            `x_min = ${a}`,
            { a },
          );
        },
      },
      {
        id: "wurzel-extrempunkt",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // f(x) = x - sqrt(x) -> f'(x) = 1 - 1/(2*sqrt(x)) = 0 -> 2*sqrt(x) = 1 -> sqrt(x) = 0.5 -> x = 0.25
          return task(
            level,
            "Bestimme die Extremstelle der Funktion f(x) = x − &radic;x für x > 0.",
            "Ein Gewinnmodell führt auf G(x) = x − &radic;x. Bestimme die Stelle minimalen Gewinns.",
            [numberField("x =", 0.25, "", 2)],
            "f'(x) = 1 − 1/(2&radic;x) = 0 &rArr; 2&radic;x = 1 &rArr; &radic;x = 0,5 &rArr; x = 0,25.",
            "x = 0,25",
          );
        },
      },
    ],
  }),

  // 4.7 Natürliche Logarithmusfunktion und ihre Ableitung
  makeLesson(4, 7, 3, {
    id: "g12-ln-ableitung",
    title: "Die natürliche Logarithmusfunktion und ihre Ableitung",
    subtitle: "Herleitung aus der Umkehrfunktion von e^x und Kettenregel",
    whyItMatters:
      "Die logarithmische Ableitung f'/f beschreibt relative Wachstumsraten und Entropie in Thermodynamik und Informationstheorie.",
    explanationHtml: `
      <p>Die <strong>natürliche Logarithmusfunktion</strong> <i>f(x) = ln(x)</i> ist die Umkehrfunktion der natürlichen Exponentialfunktion <i>e<sup>x</sup></i>. Sie ist nur für <strong>echt positive Zahlen x &gt; 0</strong> definiert!</p>
      <div class="merke">
        <strong>Herleitung der Ableitung:</strong>
        <p>Aus <i>e<sup>ln(x)</sup> = x</i> folgt durch beidseitiges Differenzieren nach der Kettenregel:</p>
        <p style="text-align:center;"><i>e<sup>ln(x)</sup> · (ln x)' = 1 &rArr; x · (ln x)' = 1 &rArr; <strong>(ln x)' = 1 / x</strong></i></p>
        <strong>Kettenregel für f(x) = ln(u(x)):</strong>
        <p style="text-align:center;"><i><strong>(ln(u(x)))' = u'(x) / u(x)</strong></i> &emsp; (<em>„Innere Ableitung durch innere Funktion“</em>).</p>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Leite <i>f(x) = ln(x² + 3)</i> ab.<br>
        Innere Funktion: <i>u(x) = x² + 3 &rArr; u'(x) = 2x</i>.<br>
        Ableitung: <i>f'(x) = u'(x) / u(x) = 2x / (x² + 3)</i>.
      </div>
    `,
    formulas: [
      {
        name: "Ableitung der ln-Funktion",
        html: "(ln x)' = <sup>1</sup>/<sub>x</sub>",
        quantities: "x > 0",
      },
      {
        name: "Logarithmische Ableitung",
        html: "(ln(u(x)))' = <sup>u'(x)</sup>/<sub>u(x)</sub>",
        quantities: "u(x) > 0",
      },
    ],
    quiz: {
      question: "Wie lautet die 1. Ableitung von f(x) = ln(5x)?",
      options: [
        "f'(x) = 1 / x, da der Faktor 5 beim Kürzen herausfällt.",
        "f'(x) = 5 / x",
        "f'(x) = 1 / (5x)",
      ],
      correctIndex: 0,
      explanation:
        "Nach Kettenregel: (ln(5x))' = 5 / (5x) = 1 / x. Alternativ nach Logarithmengesetz: ln(5x) = ln(5) + ln(x), und die Konstante ln(5) fällt beim Ableiten weg.",
    },
    lab: lab(
      "ln-derivative",
      "Ableitung von ln(x)",
      "Verschiebe den Berührpunkt x_0 und vergleiche die Steigung mit 1/x_0.",
      [range("x0", "Stelle x_0", 1, 5, 3, 1)],
      [
        output("steigung", "Steigung m = 1/x_0", (v) => 1 / v.x0, "", 2),
      ],
      [
        {
          id: "steigung-eins",
          text: "Wähle x_0 = 1 für Steigung m = 1,00.",
          check: (v) => v.x0 === 1,
        },
        {
          id: "steigung-halb",
          text: "Wähle x_0 = 2 für Steigung m = 0,50.",
          check: (v) => v.x0 === 2,
        },
        {
          id: "steigung-viertel",
          text: "Stelle x_0 = 4 (m = 0,25) ein.",
          check: (v) => v.x0 === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "ln-kettenregel-ausrechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 3, 4]);
          const x0 = 1;
          // f(x) = ln(a*x^2 + 1) -> f'(x) = 2ax / (a*x^2 + 1) -> f'(1) = 2a / (a + 1)
          const slope = (2 * a * x0) / (a * x0 * x0 + 1);
          return task(
            level,
            `Berechne die Steigung f'(1) der Funktion f(x) = ln(${a}x² + 1) (auf zwei Dezimalen gerundet).`,
            `Die Lautstärkeempfindung folgt L(I) = ln(${a}I² + 1). Bestimme die Empfindlichkeitsänderung L'(1).`,
            [numberField("f'(1) =", slope, "", 2)],
            `f'(x) = ${2 * a}x / (${a}x² + 1) &rArr; f'(1) = ${2 * a} / (${a + 1}) = ${fmt(slope, 2)}.`,
            `f'(1) = ${fmt(slope, 2)}`,
            { a },
          );
        },
      },
      {
        id: "ln-tangente-ursprung",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const xVal = rng.pick([2, 5, 10]);
          const m = 1 / xVal;
          return task(
            level,
            `Bestimme die Tangentensteigung m von f(x) = ln(x) an der Stelle x = ${xVal}.`,
            `Berechne die Steigung der Logarithmuskurve bei x = ${xVal}.`,
            [numberField("m =", m, "", 2)],
            `f'(x) = 1 / x &rArr; f'(${xVal}) = 1 / ${xVal} = ${fmt(m, 2)}.`,
            `m = ${fmt(m, 2)}`,
            { xVal },
          );
        },
      },
    ],
  }),

  // 4.8 Kurvendiskussion und Grenzwerte mit ln-Funktion
  makeLesson(4, 8, 3, {
    id: "g12-ln-kurvendiskussion-grenzwerte",
    title: "Kurvendiskussion und Grenzwerte mit der ln-Funktion",
    subtitle: "Grenzwerte lim x·ln(x) = 0 und lim ln(x)/x = 0, Logarithmengesetze",
    whyItMatters:
      "Die Shannon-Entropie H = −∑ p·ln(p) in der Informationstheorie und beim maschinellen Lernen basiert genau auf dem Grenzwert x·ln(x) für x → 0.",
    explanationHtml: `
      <p>Die natürliche Logarithmusfunktion wächst für <i>x &rarr; +&infin;</i> langsamer als jede Potenzfunktion <i>x<sup>n</sup></i> mit <i>n &gt; 0</i>.</p>
      <div class="merke">
        <strong>Wichtige Grenzwerte:</strong>
        <ul>
          <li><i>lim<sub>x &rarr; +&infin;</sub> (ln(x) / x<sup>n</sup>) = 0</i> für alle <i>n &gt; 0</i>.</li>
          <li><i>lim<sub>x &rarr; 0<sup>+</sup></sub> (x<sup>n</sup> · ln(x)) = 0</i> für alle <i>n &gt; 0</i> (die Potenz <i>x<sup>n</sup></i> drückt den Logarithmus zu 0 nieder!).</li>
          <li><strong>Rechenregeln für Logarithmen:</strong>
            <br><i>ln(a · b) = ln(a) + ln(b)</i>
            <br><i>ln(a / b) = ln(a) − ln(b)</i>
            <br><i>ln(a<sup>r</sup>) = r · ln(a)</i>
          </li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Kurvendiskussion von <i>f(x) = x · ln(x)</i> für <i>x &gt; 0</i>.<br>
        Nullstelle: <i>x · ln(x) = 0 &rArr; ln(x) = 0 &rArr; x = 1</i>.<br>
        Ableitung: <i>f'(x) = 1 · ln(x) + x · (1/x) = ln(x) + 1</i>.<br>
        Extremum: <i>ln(x) + 1 = 0 &rArr; ln(x) = −1 &rArr; x = e<sup>−1</sup> = 1/e &approx; 0,368</i>.<br>
        Randverhalten: <i>lim<sub>x &rarr; 0<sup>+</sup></sub> x · ln(x) = 0</i>.
      </div>
    `,
    formulas: [
      {
        name: "Grenzwerte mit Logarithmus",
        html: "lim<sub>x&rarr;&infin;</sub> <sup>ln(x)</sup>/<sub>x<sup>n</sup></sub> = 0 &emsp; und &emsp; lim<sub>x&rarr;0<sup>+</sup></sub> x<sup>n</sup> &middot; ln(x) = 0",
        quantities: "n > 0",
      },
    ],
    quiz: {
      question: "An welcher Stelle x besitzt f(x) = x · ln(x) für x > 0 ihren lokalen Tiefpunkt?",
      options: [
        "x = 1/e ≈ 0,37",
        "x = 1",
        "x = e ≈ 2,72",
      ],
      correctIndex: 0,
      explanation:
        "Die Ableitung lautet f'(x) = ln(x) + 1. Setzt man f'(x) = 0, folgt ln(x) = −1 und somit x = e^{−1} = 1/e.",
    },
    lab: lab(
      "ln-limits",
      "Funktion f(x) = x · ln(x)",
      "Untersuche den Kurvenverlauf und den Grenzwert für x → 0+.",
      [range("zoom", "Zoomfaktor", 1, 4, 1, 1)],
      [
        output("tiefpunkt", "Tiefpunktstelle x = 1/e", () => 1 / Math.E, "", 3),
        output("tiefpunkt_y", "Minimalwert f(1/e) = −1/e", () => -1 / Math.E, "", 3),
      ],
      [
        {
          id: "detail",
          text: "Vergrößere auf Zoom = 2 für Details am Tiefpunkt.",
          check: (v) => v.zoom === 2,
        },
        {
          id: "nah",
          text: "Stelle Zoom = 3 für den Ursprungsübergang ein.",
          check: (v) => v.zoom === 3,
        },
        {
          id: "maximal",
          text: "Wähle Maximalzoom = 4.",
          check: (v) => v.zoom === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "ln-grenzwert-rechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 5, 10]);
          return task(
            level,
            `Bestimme den Grenzwert von f(x) = (${a} + ln(x)) / x für x &rarr; +&infin;.`,
            `Untersuche das Grenzverhalten der relativen Kostenfunktion K(x) = (${a} + ln(x)) / x für x &rarr; +&infin;.`,
            [numberField("Limes =", 0, "", 0)],
            "Zerlege: a/x + ln(x)/x. Beide Summanden gehen für x->unendlich gegen 0.",
            `lim [${a}/x + ln(x)/x] = 0 + 0 = 0.`,
            "Limes = 0",
            { a },
          );
        },
      },
      {
        id: "ln-nullstelle-suchen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([2, 3, 4]);
          // ln(x - c) = 0 -> x - c = 1 -> x = c + 1
          const x0 = c + 1;
          return task(
            level,
            `Bestimme die Nullstelle der Funktion f(x) = ln(x − ${c}).`,
            `An welcher Stelle x schneidet der Graph von f(x) = ln(x − ${c}) die x-Achse?`,
            [numberField("x =", x0, "", 0)],
            `ln(x − ${c}) = 0 &rArr; x − ${c} = 1 &rArr; x = ${x0}.`,
            `x = ${x0}`,
            { c },
          );
        },
      },
    ],
  }),
];
