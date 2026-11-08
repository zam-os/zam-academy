/**
 * Lernbereich 4: Untersuchung von Funktionen – Quotientenregel, Umkehrfunktion (29 Std.)
 * 8 Lektionen zu gebrochen-rationalen Funktionen, Wurzelfunktionen und der natürlichen Logarithmusfunktion.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range } from "./builders";
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
          const a = rng.pick([1, 2, 3, 4]);
          const d = rng.pick([1, 2, 4, 5]);
          const slope0 = a / d;
          if (level === 1) {
            return {
              prompt: `Berechne die Steigung f'(0) der Funktion f(x) = ${a}x / (x + ${d}) (auf zwei Dezimalen gerundet).`,
              given: [`f(x) = ${a}x / (x + ${d})`, `Stelle x = 0`],
              fields: [numberField("f'(0) =", slope0, "", 2)],
              formulaHint: `Quotientenregel: f'(x) = [u'(x)·v(x) − u(x)·v'(x)] / [v(x)]².`,
              feedbackHint: `Zähler: ${a}·(0 + ${d}) − (${a}·0)·1 = ${a * d}. Nenner: (0 + ${d})² = ${d * d}.`,
              steps: [
                `f'(x) = [${a}·(x+${d}) − ${a}x·1] / (x+${d})² = ${a * d} / (x+${d})².`,
                `f'(0) = ${a * d} / ${d * d} = ${a} / ${d} = ${fmt(slope0, 2)}.`,
                `<strong>f'(0) = ${fmt(slope0, 2)}</strong>`,
              ],
              meta: { a, d, slope0 },
            };
          }
          return {
            prompt: `Der Wirkungsgrad einer Turbine in Abhängigkeit von der Drehzahl x wird modelliert durch &eta;(x) = ${a}x / (x + ${d}). Bestimme die anfängliche Steigerungsrate &eta;'(0) gerundet auf 2 Dezimalstellen.`,
            given: [`&eta;(x) = ${a}x / (x + ${d})`, `Drehzahl x = 0`],
            fields: [numberField("&eta;'(0) =", slope0, "", 2)],
            feedbackHint: `Wende die Quotientenregel an und setze x = 0 ein.`,
            steps: [
              `&eta;'(x) = [${a}(x + ${d}) − ${a}x] / (x + ${d})² = ${a * d} / (x + ${d})².`,
              `&eta;'(0) = ${a * d} / ${d}² = ${fmt(slope0, 2)}.`,
              `<strong>&eta;'(0) = ${fmt(slope0, 2)}</strong>`,
            ],
            meta: { a, d, slope0 },
          };
        },
      },
      {
        id: "ableitungszaehler",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([2, 3, 4, 5, 6]);
          const num = -1 - c;
          if (level === 1) {
            return {
              prompt: `Welchen konstanten Wert nimmt der Zähler der 1. Ableitung von f(x) = (x + ${c}) / (x − 1) nach dem Zusammenfassen an?`,
              given: [`f(x) = (x + ${c}) / (x − 1)`],
              fields: [numberField("Zähler =", num, "", 0)],
              formulaHint: "Quotientenregel: Zähler von f' ist u'·v − u·v'.",
              feedbackHint: `Berechne 1·(x − 1) − (x + ${c})·1.`,
              steps: [
                `u'v − uv' = 1·(x − 1) − (x + ${c})·1 = x − 1 − x − ${c} = ${fmt(num, 0)}.`,
                `<strong>Zähler = ${fmt(num, 0)}</strong>`,
              ],
              meta: { c, num },
            };
          }
          const k = rng.pick([2, 3]);
          return {
            prompt: `Bestimme den konstanten Zählerterm der 1. Ableitung von g(x) = (${k}x) / (x + ${c}) nach Zusammenfassen.`,
            given: [`g(x) = (${k}x) / (x + ${c})`],
            fields: [numberField("Zähler =", k * c, "", 0)],
            feedbackHint: `Zähler = ${k}·(x + ${c}) − ${k}x·1 = ${k}x + ${k * c} − ${k}x = ${k * c}.`,
            steps: [
              `u'v − uv' = ${k}·(x + ${c}) − (${k}x)·1 = ${k * c}.`,
              `<strong>Zähler = ${k * c}</strong>`,
            ],
            meta: { k, c, res: k * c },
          };
        },
      },
    ],
  }),

  // 4.2 Kurvendiskussion gebrochen-rationaler Funktionen
  makeLesson(4, 2, 1, {
    id: "g12-gebrochen-rational-diskussion",
    title: "Kurvendiskussion gebrochen-rationaler Funktionen",
    subtitle: "Definitionsbereich, Asymptoten und Differentialrechnung (Extrema/Monotonie)",
    whyItMatters:
      "Grenzwerte, Polstellen und Extremwerte bestimmen die Stabilität von Regelkreisen und Resonanzkatastrophen in Schwingungssystemen.",
    explanationHtml: `
      <p>Bei gebrochen-rationalen Funktionen <i>f(x) = Z(x) / N(x)</i> liefert der Nenner <i>N(x) = 0</i> die <strong>Definitionslücken</strong> und die Ableitung <i>f'(x)</i> die <strong>Extrema</strong>:</p>
      <div class="merke">
        <strong>Systematik der Kurvendiskussion gebrochen-rationaler Funktionen:</strong>
        <ul>
          <li><strong>Definitionslücken:</strong>
            <br>&bull; Hebbare Lücke: Zähler- und Nennernullstelle gleicher oder höherer Vielfachheit (Graph hat ein Loch).
            <br>&bull; Polstelle: Nennernullstelle höherer Vielfachheit (senkrechte Asymptote).
          </li>
          <li><strong>Asymptoten für x &rarr; &plusmn;&infin;:</strong>
            <br>&bull; Grad Zähler &lt; Grad Nenner &rArr; waagrechte Asymptote <i>y = 0</i>.
            <br>&bull; Grad Zähler = Grad Nenner &rArr; waagrechte Asymptote <i>y = a<sub>n</sub> / b<sub>n</sub></i>.
            <br>&bull; Grad Zähler = Grad Nenner + 1 &rArr; schräge Asymptote (Polynomdivision!).
          </li>
          <li><strong>Differentialrechnung (Extrema):</strong>
            <br>Ableitung <i>f'(x)</i> mit der Quotientenregel bilden: <i>f'(x) = 0 &hArr; Zähler von f'(x) = 0</i> (bei <i>N(x) &ne; 0</i>).
          </li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> <i>f(x) = (x² − 4) / (x² + 1)</i> mit <i>D = &reals;</i>.<br>
        Waagrechte Asymptote: <i>y = 1 / 1 = 1</i>.<br>
        Ableitung: <i>f'(x) = [2x(x² + 1) − (x² − 4)·2x] / (x² + 1)² = [2x³ + 2x − 2x³ + 8x] / (x² + 1)² = 10x / (x² + 1)²</i>.<br>
        Extremum: <i>f'(x) = 0 &hArr; 10x = 0 &rArr; x = 0</i>. Da <i>f'(x)</i> von − nach + wechselt, liegt bei <i>T(0 | −4)</i> ein lokaler Tiefpunkt.
      </div>
    `,
    formulas: [
      {
        name: "Waagrechte Asymptote (gleicher Grad)",
        html: "lim<sub>x&rarr;&infin;</sub> <sup>a<sub>n</sub>x<sup>n</sup> + ...</sup>/<sub>b<sub>n</sub>x<sup>n</sup> + ...</sub> = <sup>a<sub>n</sub></sup>/<sub>b<sub>n</sub></sub>",
        quantities: "a_n, b_n Leitkoeffizienten",
      },
      {
        name: "Extremstellenbedingung",
        html: "f'(x) = 0 &emsp; mit &emsp; [u'v &minus; uv'] = 0",
        quantities: "Zähler der Ableitung muss null sein",
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
      "Kurvendiskussion rationaler Funktionen: f(x) = (x² − a) / (x² + 1)",
      "Stelle den Zählerparameter a ein und untersuche Asymptote, Nullstellen und Tiefpunkt.",
      [range("a", "Parameter a", 0, 9, 2, 1)],
      [
        output("nullstellen", "Positive Nullstelle", (v) => Math.sqrt(v.a), "", 2),
        output("tiefpunkt", "Tiefpunkt T(0 | −a)", (v) => -v.a, "", 0),
        output("asymptote", "Waagrechte Asymptote y =", () => 1, "", 0),
      ],
      [
        {
          id: "null-ursprung",
          text: "Wähle a = 0, sodass f(x) den Ursprung berührt (Tiefpunkt bei (0|0)).",
          check: (v) => v.a === 0,
        },
        {
          id: "null-drei",
          text: "Stelle a = 9 für Nullstellen bei x = ±3 ein (Tiefpunkt bei (0|−9)).",
          check: (v) => v.a === 9,
        },
        {
          id: "standard-vier",
          text: "Stelle a = 4 ein (Tiefpunkt bei (0|−4)).",
          check: (v) => v.a === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "asymptote-bestimmen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([4, 6, 8, 10, 12]);
          const b = rng.pick([2, 4]);
          const asympY = a / b;
          if (level === 1) {
            return {
              prompt: `Bestimme die waagrechte Asymptote y der rationalen Funktion f(x) = (${a}x² − 3) / (${b}x² + 5) für x &rarr; &plusmn;&infin;.`,
              given: [`f(x) = (${a}x² − 3) / (${b}x² + 5)`],
              fields: [numberField("y =", asympY, "", 1)],
              formulaHint: `Vergleiche die Leitkoeffizienten bei gleichem Zähler- und Nennergrad: y = a_n / b_n.`,
              feedbackHint: `Teile den Koeffizienten ${a} vor x² durch den Nennerkoeffizienten ${b}.`,
              steps: [
                `Da Grad(Zähler) = Grad(Nenner) = 2, gilt lim_{x→±∞} f(x) = ${a} / ${b} = ${fmt(asympY, 1)}.`,
                `<strong>Waagrechte Asymptote: y = ${fmt(asympY, 1)}</strong>`,
              ],
              meta: { a, b, asympY },
            };
          }
          return {
            prompt: `Für eine Fertigungsstraße verhalten sich die Stückkosten nach K(x) = (${a}x² − 3) / (${b}x² + 5) (in € pro Stück). Welche Grenzkosten y stellen sich bei extrem hohen Produktionszahlen x ein?`,
            given: [`K(x) = (${a}x² − 3) / (${b}x² + 5)`, `x &rarr; +&infin;`],
            fields: [numberField("y =", asympY, "€", 1)],
            feedbackHint: "Berechne den Grenzwert für x → ∞.",
            steps: [
              `lim_{x→∞} K(x) = ${a} / ${b} = ${fmt(asympY, 1)} €.`,
              `<strong>Grenzkosten = ${fmt(asympY, 1)} €</strong>`,
            ],
            meta: { a, b, asympY },
          };
        },
      },
      {
        id: "polstelle-bestimmen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          if (level === 1) {
            const p = rng.pick([2, 3, 4, 5]);
            return {
              prompt: `Bestimme die positive Polstelle x der Funktion f(x) = 1 / (x² − ${p * p}).`,
              given: [`f(x) = 1 / (x² − ${p * p})`],
              fields: [numberField("x =", p, "", 0)],
              formulaHint: `Setze den Nenner gleich null: x² − ${p * p} = 0.`,
              feedbackHint: `Löse x² = ${p * p} für x > 0.`,
              steps: [
                `Nennernullstellen: x² − ${p * p} = 0 &rArr; x² = ${p * p} &rArr; x = ${p} (da x > 0).`,
                `<strong>x = ${p}</strong>`,
              ],
              meta: { p },
            };
          }
          const d = rng.pick([1, 4, 9]);
          const xExtrem = Math.sqrt(d);
          return {
            prompt: `Gegeben ist die rationale Funktion f(x) = x / (x² + ${d}). Bestimme mit der Quotientenregel die positive Extremstelle x (Hochpunktstelle).`,
            given: [`f(x) = x / (x² + ${d})`, `x > 0`],
            fields: [numberField("x =", xExtrem, "", 1)],
            feedbackHint: `f'(x) = [1·(x² + ${d}) − x·2x] / (x² + ${d})² = (${d} − x²) / (x² + ${d})². Setze den Zähler gleich null.`,
            steps: [
              `f'(x) = (${d} − x²) / (x² + ${d})² = 0.`,
              `${d} − x² = 0 &rArr; x² = ${d} &rArr; x = ${fmt(xExtrem, 1)} (da x > 0).`,
              `<strong>Extremstelle bei x = ${fmt(xExtrem, 1)}</strong>`,
            ],
            meta: { d, xExtrem },
          };
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
          const a = rng.pick([2, 3, 4, 5]);
          const xMin = 1 - a;
          if (level === 1) {
            return {
              prompt: `Berechne die Extremstelle x der Funktion f(x) = e<sup>x</sup> / (x + ${a}).`,
              given: [`f(x) = e<sup>x</sup> / (x + ${a})`, `Definitionsbereich x > −${a}`],
              fields: [numberField("x =", xMin, "", 0)],
              formulaHint: `Klammere e^x im Zähler von f'(x) aus: e^x · (x + ${a} − 1) = 0.`,
              feedbackHint: `Da e^x > 0 immer gilt, muss x + ${a} − 1 = 0 sein.`,
              steps: [
                `f'(x) = [e^x(x + ${a}) − e^x·1] / (x + ${a})² = e^x(x + ${a} − 1) / (x + ${a})².`,
                `f'(x) = 0 &rArr; x + ${a} − 1 = 0 &rArr; x = 1 − ${a} = ${fmt(xMin, 0)}.`,
                `<strong>x = ${fmt(xMin, 0)}</strong>`,
              ],
              meta: { a, xMin },
            };
          }
          return {
            prompt: `Die potentielle Energie eines Schwingungssystems folgt E(x) = e<sup>x</sup> / (x + ${a}) für x > −${a}. Bestimme die Ruhelage (Stelle des Energieminimums x).`,
            given: [`E(x) = e<sup>x</sup> / (x + ${a})`],
            fields: [numberField("x =", xMin, "", 0)],
            feedbackHint: "Setze die 1. Ableitung gleich null.",
            steps: [
              `E'(x) = e^x(x + ${a} − 1) / (x + ${a})² = 0 &rArr; x = 1 − ${a} = ${fmt(xMin, 0)}.`,
              `<strong>x = ${fmt(xMin, 0)}</strong>`,
            ],
            meta: { a, xMin },
          };
        },
      },
      {
        id: "quotient-sin-ableitung",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const k = rng.pick([1, 2, 3, 4]);
          const d = rng.pick([1, 2, 4]);
          const slope0 = k / d;
          if (level === 1) {
            return {
              prompt: `Berechne die Steigung f'(0) für die Funktion f(x) = ${k}x / (x² + ${d}).`,
              given: [`f(x) = ${k}x / (x² + ${d})`, `Stelle x = 0`],
              fields: [numberField("f'(0) =", slope0, "", 2)],
              formulaHint: `Quotientenregel: f'(x) = [u'v − uv'] / v².`,
              feedbackHint: `Für x = 0 ist u(0) = 0 und u'(0) = ${k}, also f'(0) = (${k}·${d} − 0) / ${d}² = ${k} / ${d}.`,
              steps: [
                `f'(x) = [${k}(x² + ${d}) − (${k}x)(2x)] / (x² + ${d})² = [${k * d} − ${k}x²] / (x² + ${d})².`,
                `f'(0) = (${k * d}) / ${d * d} = ${k} / ${d} = ${fmt(slope0, 2)}.`,
                `<strong>f'(0) = ${fmt(slope0, 2)}</strong>`,
              ],
              meta: { k, d, slope0 },
            };
          }
          return {
            prompt: `Ein akustischer Signalfilter überträgt Frequenzen nach A(x) = ${k}x / (x² + ${d}). Bestimme die Momentansteigung der Resonanzkurve im Ursprung A'(0).`,
            given: [`A(x) = ${k}x / (x² + ${d})`, `x = 0`],
            fields: [numberField("A'(0) =", slope0, "", 2)],
            feedbackHint: "Wende die Quotientenregel an und beachte x = 0.",
            steps: [
              `A'(0) = [${k}·${d} − 0] / ${d}² = ${k} / ${d} = ${fmt(slope0, 2)}.`,
              `<strong>A'(0) = ${fmt(slope0, 2)}</strong>`,
            ],
            meta: { k, d, slope0 },
          };
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
          const t = rng.pick([6, 10, 15, 20]);
          const invT = -t / m;
          if (level === 1) {
            return {
              prompt: `Die Umkehrfunktion von f(x) = ${m}x + ${t} hat die Form f<sup>−1</sup>(x) = m* · x + t*. Bestimme den Achsenabschnitt t*.`,
              given: [`f(x) = ${m}x + ${t}`],
              fields: [numberField("t* =", invT, "", 2)],
              formulaHint: `Löse y = ${m}x + ${t} nach x auf: x = (y − ${t}) / ${m}.`,
              feedbackHint: `Der konstante Term lautet −${t}/${m}.`,
              steps: [
                `y = ${m}x + ${t} &rArr; ${m}x = y − ${t} &rArr; x = (1/${m})y − ${t}/${m}.`,
                `Variablentausch: f⁻¹(x) = (1/${m})x − ${fmt(t / m, 2)} &rArr; t* = ${fmt(invT, 2)}.`,
                `<strong>t* = ${fmt(invT, 2)}</strong>`,
              ],
              meta: { m, t, invT },
            };
          }
          return {
            prompt: `Ein Temperatursensor liefert Spannungssignale nach U(T) = ${m}·T + ${t} (in mV). Zur automatischen Temperaturanzeige T(U) = m*·U + t* wird die Umkehrfunktion programmiert. Welcher Offset t* muss hinterlegt werden?`,
            given: [`U(T) = ${m}·T + ${t}`],
            fields: [numberField("t* =", invT, "°C", 2)],
            feedbackHint: "Löse die Sensorspannung nach der Temperatur T auf.",
            steps: [
              `T = (U − ${t}) / ${m} = (1/${m})U − ${t / m}. Also t* = ${fmt(invT, 2)} °C.`,
              `<strong>t* = ${fmt(invT, 2)} °C</strong>`,
            ],
            meta: { m, t, invT },
          };
        },
      },
      {
        id: "umkehr-quadrat",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([4, 9, 16, 25]);
          if (level === 1) {
            return {
              prompt: `Bestimme die Konstante d der Umkehrfunktion f<sup>−1</sup>(x) = x² + d für f(x) = &radic;(x + ${c}) (für x &ge; 0).`,
              given: [`f(x) = &radic;(x + ${c})`],
              fields: [numberField("d =", -c, "", 0)],
              formulaHint: `Quadriere beide Seiten von y = √(x + ${c}): y² = x + ${c}.`,
              feedbackHint: `x = y² − ${c}. Also ist d = −${c}.`,
              steps: [
                `y = &radic;(x + ${c}) &rArr; y² = x + ${c} &rArr; x = y² − ${c}.`,
                `f⁻¹(x) = x² − ${c} &rArr; d = −${c}.`,
                `<strong>d = −${c}</strong>`,
              ],
              meta: { c, d: -c },
            };
          }
          return {
            prompt: `Die Bremsverzögerung eines Fahrzeugs verknüpft Geschwindigkeit v und Bremsweg s über v(s) = &radic;(s + ${c}). Zur Rekonstruktion des Bremswegs s(v) = v² + d soll die Umkehrfunktion bestimmt werden. Bestimme d.`,
            given: [`v(s) = &radic;(s + ${c})`],
            fields: [numberField("d =", -c, "m", 0)],
            feedbackHint: "Löse v = √(s + c) nach s auf.",
            steps: [
              `v² = s + ${c} &rArr; s(v) = v² − ${c}. Konstante d = −${c}.`,
              `<strong>d = −${c}</strong>`,
            ],
            meta: { c, d: -c },
          };
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
          const x0 = rng.pick([1, 4, 9, 16, 25]);
          const slope = 1 / (2 * Math.sqrt(x0));
          if (level === 1) {
            return {
              prompt: `Berechne den Wert der 1. Ableitung von f(x) = &radic;x an der Stelle x = ${x0} (auf drei Dezimalen gerundet).`,
              given: [`f(x) = &radic;x`, `x = ${x0}`],
              fields: [numberField("f' =", slope, "", 3)],
              formulaHint: `Ableitungsformel: f'(x) = 1 / (2√x).`,
              feedbackHint: `Setze x = ${x0} ein: 1 / (2 · ${Math.sqrt(x0)}).`,
              steps: [
                `f'(x) = 1 / (2&radic;x) &rArr; f'(${x0}) = 1 / (2·${Math.sqrt(x0)}) = ${fmt(slope, 3)}.`,
                `<strong>f'(${x0}) = ${fmt(slope, 3)}</strong>`,
              ],
              meta: { x0, slope },
            };
          }
          return {
            prompt: `Die Ausbreitungsgeschwindigkeit einer Tsunamiwelle im flachen Wasser folgt v(h) = &radic;h (h = Wassertiefe in m). Bestimme die Änderungsrate v'(${x0}) der Geschwindigkeit bei Tiefe h = ${x0} m.`,
            given: [`v(h) = &radic;h`, `h = ${x0} m`],
            fields: [numberField("v' =", slope, "s⁻¹", 3)],
            feedbackHint: `Differenziere v(h) nach der Potenzregel und setze h = ${x0} ein.`,
            steps: [
              `v'(h) = 1 / (2&radic;h) &rArr; v'(${x0}) = 1 / (2·${Math.sqrt(x0)}) = ${fmt(slope, 3)}.`,
              `<strong>v'(${x0}) = ${fmt(slope, 3)}</strong>`,
            ],
            meta: { x0, slope },
          };
        },
      },
      {
        id: "kettenregel-wurzel",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 4, 6, 8]);
          const slope0 = a / 2;
          if (level === 1) {
            return {
              prompt: `Berechne die Steigung f'(0) für die Wurzelfunktion f(x) = &radic;(${a}x + 1).`,
              given: [`f(x) = &radic;(${a}x + 1)`, `x = 0`],
              fields: [numberField("f'(0) =", slope0, "", 1)],
              formulaHint: `Kettenregel: (√u(x))' = u'(x) / (2√u(x)).`,
              feedbackHint: `Innere Ableitung u'(0) = ${a}, Nenner 2·√1 = 2.`,
              steps: [
                `f'(x) = ${a} / (2&radic;(${a}x + 1)).`,
                `f'(0) = ${a} / (2&radic;1) = ${a} / 2 = ${slope0}.`,
                `<strong>f'(0) = ${slope0}</strong>`,
              ],
              meta: { a, slope0 },
            };
          }
          return {
            prompt: `Die elektrische Stromstärke beim Einschalten einer Spule verhält sich nach I(t) = &radic;(${a}t + 1) (in A). Bestimme die anfängliche Stromänderungsgeschwindigkeit I'(0) in A/s.`,
            given: [`I(t) = &radic;(${a}t + 1)`, `t = 0 s`],
            fields: [numberField("I'(0) =", slope0, "A/s", 1)],
            feedbackHint: "Kettenregel für die Wurzel: u'/ (2√u).",
            steps: [
              `I'(t) = ${a} / (2&radic;(${a}t + 1)) &rArr; I'(0) = ${a} / 2 = ${slope0} A/s.`,
              `<strong>I'(0) = ${slope0} A/s</strong>`,
            ],
            meta: { a, slope0 },
          };
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
          const a = rng.pick([3, 5, 7, 9, 11]);
          if (level === 1) {
            return {
              prompt: `Bestimme den kleinstmöglichen Wert x<sub>min</sub> des Definitionsbereichs D = [x<sub>min</sub>; +&infin;[ für f(x) = &radic;(x − ${a}).`,
              given: [`f(x) = &radic;(x − ${a})`],
              fields: [numberField("x_min =", a, "", 0)],
              formulaHint: `Radikand nichtnegativ: x − ${a} ≥ 0.`,
              feedbackHint: `Addiere ${a} auf beiden Seiten.`,
              steps: [
                `x − ${a} &ge; 0 &rArr; x &ge; ${a}.`,
                `<strong>x_min = ${a}</strong>`,
              ],
              meta: { a },
            };
          }
          const b = rng.pick([2, 3, 4]);
          const xMax = a / b;
          return {
            prompt: `Bestimme die rechte Intervallgrenze x<sub>max</sub> des maximalen Definitionsbereichs D = ]−&infin;; x<sub>max</sub>] für g(x) = &radic;(${a} − ${b}x).`,
            given: [`g(x) = &radic;(${a} − ${b}x)`],
            fields: [numberField("x_max =", xMax, "", 2)],
            feedbackHint: `Löse die Ungleichung ${a} − ${b}x ≥ 0.`,
            steps: [
              `${a} − ${b}x &ge; 0 &rArr; ${b}x &le; ${a} &rArr; x &le; ${a}/${b} = ${fmt(xMax, 2)}.`,
              `<strong>x_max = ${fmt(xMax, 2)}</strong>`,
            ],
            meta: { a, b, xMax },
          };
        },
      },
      {
        id: "wurzel-extrempunkt",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 4, 6]);
          const xMin = (a * a) / 4;
          if (level === 1) {
            return {
              prompt: `Bestimme die Extremstelle der Funktion f(x) = x − ${a}&radic;x für x > 0.`,
              given: [`f(x) = x − ${a}&radic;x`, `x > 0`],
              fields: [numberField("x =", xMin, "", 2)],
              formulaHint: `f'(x) = 1 − ${a} / (2√x) = 0.`,
              feedbackHint: `2√x = ${a} ⇒ √x = ${a / 2} ⇒ x = (${a / 2})².`,
              steps: [
                `f'(x) = 1 − ${a}/(2&radic;x) = 0 &rArr; &radic;x = ${a / 2} &rArr; x = ${xMin}.`,
                `<strong>x = ${xMin}</strong>`,
              ],
              meta: { a, xMin },
            };
          }
          return {
            prompt: `Ein betriebswirtschaftliches Modell beschreibt Stückkosten durch K(x) = x − ${a}&radic;x + 10 (für x > 0). Bestimme die Produktionsmenge x, bei der die Kosten minimal sind.`,
            given: [`K(x) = x − ${a}&radic;x + 10`, `x > 0`],
            fields: [numberField("x =", xMin, "", 2)],
            feedbackHint: "Bilde die 1. Ableitung K'(x) und setze sie gleich null.",
            steps: [
              `K'(x) = 1 − ${a}/(2&radic;x) = 0 &rArr; &radic;x = ${a / 2} &rArr; x = ${xMin}.`,
              `<strong>x = ${xMin}</strong>`,
            ],
            meta: { a, xMin },
          };
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
          const a = rng.pick([2, 3, 4, 5]);
          const x0 = 1;
          const slope = (2 * a * x0) / (a * x0 * x0 + 1);
          if (level === 1) {
            return {
              prompt: `Berechne die Steigung f'(1) der Funktion f(x) = ln(${a}x² + 1) (auf zwei Dezimalen gerundet).`,
              given: [`f(x) = ln(${a}x² + 1)`, `x = 1`],
              fields: [numberField("f'(1) =", slope, "", 2)],
              formulaHint: `(ln(u(x)))' = u'(x) / u(x).`,
              feedbackHint: `Innere Funktion u(x) = ${a}x² + 1 ⇒ u'(x) = ${2 * a}x. Setze x = 1 ein.`,
              steps: [
                `f'(x) = ${2 * a}x / (${a}x² + 1).`,
                `f'(1) = ${2 * a} / (${a + 1}) = ${fmt(slope, 2)}.`,
                `<strong>f'(1) = ${fmt(slope, 2)}</strong>`,
              ],
              meta: { a, slope },
            };
          }
          return {
            prompt: `Die menschliche Lautstärkeempfindung folgt L(I) = ln(${a}I² + 1) (I = Schallintensität). Bestimme die Empfindlichkeitsänderung L'(1) gerundet auf zwei Dezimalstellen.`,
            given: [`L(I) = ln(${a}I² + 1)`, `I = 1`],
            fields: [numberField("L'(1) =", slope, "", 2)],
            feedbackHint: "Wende die logarithmische Ableitungsregel u'/u an.",
            steps: [
              `L'(I) = ${2 * a}I / (${a}I² + 1) &rArr; L'(1) = ${2 * a} / (${a + 1}) = ${fmt(slope, 2)}.`,
              `<strong>L'(1) = ${fmt(slope, 2)}</strong>`,
            ],
            meta: { a, slope },
          };
        },
      },
      {
        id: "ln-tangente-ursprung",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const xVal = rng.pick([2, 4, 5, 8, 10]);
          const m = 1 / xVal;
          if (level === 1) {
            return {
              prompt: `Bestimme die Tangentensteigung m von f(x) = ln(x) an der Stelle x = ${xVal} (auf zwei Dezimalen).`,
              given: [`f(x) = ln(x)`, `x = ${xVal}`],
              fields: [numberField("m =", m, "", 2)],
              formulaHint: `(ln x)' = 1 / x.`,
              feedbackHint: `Setze ${xVal} in 1/x ein.`,
              steps: [
                `f'(x) = 1 / x &rArr; f'(${xVal}) = 1 / ${xVal} = ${fmt(m, 2)}.`,
                `<strong>m = ${fmt(m, 2)}</strong>`,
              ],
              meta: { xVal, m },
            };
          }
          return {
            prompt: `Ermittle die Steigung der Tangente an den Graphen von g(x) = 3·ln(x) an der Stelle x = ${xVal}.`,
            given: [`g(x) = 3·ln(x)`, `x = ${xVal}`],
            fields: [numberField("m =", 3 / xVal, "", 2)],
            feedbackHint: "Konstanter Faktor 3 bleibt beim Ableiten erhalten: g'(x) = 3/x.",
            steps: [
              `g'(x) = 3 / x &rArr; g'(${xVal}) = 3 / ${xVal} = ${fmt(3 / xVal, 2)}.`,
              `<strong>m = ${fmt(3 / xVal, 2)}</strong>`,
            ],
            meta: { xVal, m: 3 / xVal },
          };
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
          const a = rng.pick([2, 5, 10, 20]);
          if (level === 1) {
            return {
              prompt: `Bestimme den Grenzwert von f(x) = (${a} + ln(x)) / x für x &rarr; +&infin;.`,
              given: [`f(x) = (${a} + ln(x)) / x`, `x &rarr; +&infin;`],
              fields: [numberField("Limes =", 0, "", 0)],
              formulaHint: `Zerlege den Bruch in ${a}/x + ln(x)/x und bilde für beide Summanden den Limes.`,
              feedbackHint: `Beide Terme streben gegen 0.`,
              steps: [
                `lim_{x→∞} [${a}/x + ln(x)/x] = 0 + 0 = 0.`,
                `<strong>Limes = 0</strong>`,
              ],
              meta: { a },
            };
          }
          return {
            prompt: `Untersuche das Grenzverhalten der relativen Kostenfunktion K(x) = (${a} + ln(x)) / x für x &rarr; +&infin;. Welcher Wert wird asymptotisch erreicht?`,
            given: [`K(x) = (${a} + ln(x)) / x`, `x &rarr; +&infin;`],
            fields: [numberField("Limes =", 0, "", 0)],
            feedbackHint: "Der Nenner x wächst viel schneller als der Zähler ln(x).",
            steps: [
              `lim_{x→∞} K(x) = 0.`,
              `<strong>Limes = 0</strong>`,
            ],
            meta: { a },
          };
        },
      },
      {
        id: "ln-nullstelle-suchen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const c = rng.pick([2, 3, 4, 5, 6]);
          const x0 = c + 1;
          if (level === 1) {
            return {
              prompt: `Bestimme die Nullstelle der Funktion f(x) = ln(x − ${c}).`,
              given: [`f(x) = ln(x − ${c})`],
              fields: [numberField("x =", x0, "", 0)],
              formulaHint: `ln(Term) = 0 genau dann, wenn Term = 1.`,
              feedbackHint: `Setze x − ${c} = 1.`,
              steps: [
                `ln(x − ${c}) = 0 &rArr; x − ${c} = 1 &rArr; x = ${x0}.`,
                `<strong>x = ${x0}</strong>`,
              ],
              meta: { c, x0 },
            };
          }
          const k = rng.pick([2, 3]);
          const x02 = (1 + c) / k;
          return {
            prompt: `Bestimme die Schnittstelle mit der x-Achse für die Funktion g(x) = ln(${k}x − ${c}) (auf zwei Dezimalen gerundet).`,
            given: [`g(x) = ln(${k}x − ${c})`],
            fields: [numberField("x =", x02, "", 2)],
            feedbackHint: `Setze ${k}x − ${c} = 1 und löse nach x auf.`,
            steps: [
              `${k}x − ${c} = 1 &rArr; ${k}x = ${1 + c} &rArr; x = ${1 + c} / ${k} = ${fmt(x02, 2)}.`,
              `<strong>x = ${fmt(x02, 2)}</strong>`,
            ],
            meta: { k, c, x02 },
          };
        },
      },
    ],
  }),
];
