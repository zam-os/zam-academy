/**
 * Lernbereich 1: Untersuchung von Funktionen – Stammfunktion, Produkt- und Kettenregel (33 Std.)
 * 8 Lektionen zu ganzrationalen Scharen, Stammfunktionen, e-Funktionen und Trigonometrie.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range, task } from "./builders";
import { numberField } from "./helpers";
import type { Rng } from "../exercises/rng";
import { fmt } from "../exercises/format";

export const STAGE_1_LESSONS: Lesson[] = [
  // 1.1 Ganzrationale Funktionen mit Parametern
  makeLesson(1, 1, 1, {
    id: "g12-schar-ganzrational",
    title: "Kurvenscharen ganzrationaler Funktionen",
    subtitle: "Einfluss von Parametern auf Nullstellen, Extrema und Wendepunkte",
    whyItMatters:
      "In technischen und ökonomischen Modellen hängen Kosten- oder Tragwerkfunktionen oft von Stellparametern wie Materialstärke oder Produktionskapazität ab.",
    explanationHtml: `
      <p>Eine <strong>Funktionenschar</strong> ordnet jedem Parameterwert <i>a</i> eine eigene Kurve <i>f<sub>a</sub></i> zu. Bei der Kurvendiskussion wird der Parameter <i>a</i> wie eine feste Zahl behandelt.</p>
      <div class="merke">
        <strong>Merke:</strong> Zur Bestimmung von Nullstellen, Extrem- und Wendepunkten setzt du <i>f<sub>a</sub>(x) = 0</i>, <i>f'<sub>a</sub>(x) = 0</i> bzw. <i>f''<sub>a</sub>(x) = 0</i> und löst nach <i>x</i> in Abhängigkeit von <i>a</i> auf. Achte auf Fallunterscheidungen, falls <i>a</i> im Nenner oder unter einer Wurzel auftritt.
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Gegeben ist <i>f<sub>a</sub>(x) = x³ − a·x</i> mit <i>a &gt; 0</i>.<br>
        1. Ableitung: <i>f'<sub>a</sub>(x) = 3x² − a</i>.<br>
        Extremstellen: <i>3x² − a = 0 &rArr; x² = a/3 &rArr; x<sub>1,2</sub> = &plusmn;&radic;(a/3)</i>.<br>
        Für jedes <i>a &gt; 0</i> existieren genau ein lokales Maximum bei <i>−&radic;(a/3)</i> und ein Minimum bei <i>+&radic;(a/3)</i>.
      </div>
    `,
    formulas: [
      {
        name: "Kurvenschar-Ableitung",
        html: "f'<sub>a</sub>(x) = &part;/&part;x [f<sub>a</sub>(x)]",
        quantities: "a Scharparameter (als Konstante behandelt), x unabhängige Variable",
      },
    ],
    quiz: {
      question: "Für welche Werte des Parameters a besitzt f_a(x) = x³ + a·x keine lokalen Extrema?",
      options: [
        "Für a > 0, da f'_a(x) = 3x² + a keine reellen Nullstellen hat.",
        "Für a < 0, da die Diskriminante positiv ist.",
        "Für alle a ∈ ℝ, da x³ immer streng monoton ist.",
      ],
      correctIndex: 0,
      explanation:
        "Die Ableitung f'_a(x) = 3x² + a = 0 hat für a > 0 keine reelle Lösung x² = −a/3, folglich gibt es keine waagrechten Tangenten und keine Extrema.",
    },
    lab: lab(
      "polynomial-family",
      "Kurvenschar f_a(x) = 0,25 · (x³ − ax)",
      "Verändere den Parameter a und beobachte, wie sich Nullstellen und Extrempunkte verschieben.",
      [range("a", "Parameter a", 0, 8, 3, 1)],
      [
        output("extrema", "Extremstelle x_min", (v) => (v.a > 0 ? Math.sqrt(v.a / 3) : 0), "", 2),
        output("nullstellen", "Positive Nullstelle", (v) => Math.sqrt(v.a), "", 2),
      ],
      [
        {
          id: "monoton",
          text: "Stelle a so ein, dass die Funktion im Ursprung einen Sattelpunkt hat.",
          check: (v) => v.a === 0,
        },
        {
          id: "nullstelle-zwei",
          text: "Stelle a so ein, dass die positive Nullstelle bei x = 2 liegt.",
          check: (v) => v.a === 4,
        },
        {
          id: "abstand",
          text: "Wähle a so, dass die Extremstellen mehr als 1,5 Einheiten vom Ursprung entfernt sind.",
          check: (v) => Math.sqrt(v.a / 3) > 1.5,
        },
      ],
    ),
    exercises: [
      {
        id: "parameter-einfluss",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([3, 12, 27, 48]);
          // f(x) = x^3 - a*x -> f'(x) = 3x^2 - a = 0 -> x = sqrt(a/3)
          const xExtr = Math.sqrt(a / 3);
          return task(
            level,
            `Berechne die positive Extremstelle der Funktionenschar f<sub>${a}</sub>(x) = x³ − ${a}x.`,
            `Ein Konstruktionsprofil wird durch f<sub>a</sub>(x) = x³ − ${a}x modelliert. Bestimme die Lage des lokalen Tiefpunkts für x &gt; 0.`,
            [
              numberField("x =", xExtr, "", 2, {
                slips: [
                  {
                    value: a / 3,
                    hint: "Ziehe noch die Wurzel aus x² = a/3.",
                  },
                  {
                    value: Math.round(Math.sqrt(a) * 100) / 100,
                    hint: "Achte auf den Faktor 3 beim Ableiten von x³: f'(x) = 3x² − a.",
                  },
                ],
              }),
            ],
            "Leite ab: f'(x) = 3x² − a. Setze f'(x) = 0.",
            `f'(x) = 3x² − ${a} = 0 &rArr; x² = ${a}/3 = ${a / 3} &rArr; x = ${xExtr}.`,
            `x = ${fmt(xExtr, 2)}`,
            { a },
          );
        },
      },
      {
        id: "kurvenschar-nullstellen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const k = rng.pick([1, 4, 9, 16]);
          const xNull = Math.sqrt(k);
          return task(
            level,
            `Bestimme die positive Nullstelle der Funktion f(x) = x³ − ${k}x.`,
            `An welcher Stelle x &gt; 0 schneidet der Graph der Funktion f(x) = x(x² − ${k}) die Abszissenachse?`,
            [numberField("x =", xNull, "", 2)],
            "Klammere x aus: x(x² − k) = 0.",
            `x(x² − ${k}) = 0 &rArr; x² = ${k} &rArr; x = ${xNull}.`,
            `x = ${fmt(xNull, 2)}`,
            { k },
          );
        },
      },
    ],
  }),

  // 1.2 Stammfunktionen ganzrationaler Funktionen & Graphisches Integrieren
  makeLesson(1, 2, 1, {
    id: "g12-stammfunktion-ganzrational",
    title: "Stammfunktionen und graphisches Integrieren",
    subtitle: "Zusammenhang zwischen f(x) und F(x) sowie Integrationsregeln",
    whyItMatters:
      "Aus dem Geschwindigkeitsgraphen den zurückgelegten Weg rekonstruieren oder aus Durchflussraten das Gesamtvolumen ermitteln erfordert Stammfunktionen.",
    explanationHtml: `
      <p>Eine differenzierbare Funktion <i>F</i> heißt <strong>Stammfunktion</strong> von <i>f</i> auf einem Intervall, wenn für alle <i>x</i> gilt: <i>F'(x) = f(x)</i>.</p>
      <div class="merke">
        <strong>Graphischer Zusammenhang (NEW-Regel):</strong>
        <ul>
          <li>Nullstelle von <i>f</i> &rArr; Waagrechte Tangente (Extremstelle oder Terrassenstelle) von <i>F</i>.</li>
          <li>Extremstelle von <i>f</i> &rArr; Wendestelle von <i>F</i>.</li>
          <li>Positives <i>f(x) &gt; 0</i> &rArr; <i>F</i> ist streng monoton steigend.</li>
        </ul>
        Potenzregel der Integration: &int; x<sup>n</sup> dx = 1/(n+1) · x<sup>n+1</sup> + C für <i>n &ne; −1</i>.
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Sei <i>f(x) = 3x² − 6x</i>.<br>
        Eine Stammfunktion lautet: <i>F(x) = 3 · (x³/3) − 6 · (x²/2) + C = x³ − 3x² + C</i>.<br>
        Da <i>f(2) = 0</i> und <i>f</i> bei <i>x = 2</i> das Vorzeichen von − nach + wechselt, besitzt <i>F</i> bei <i>x = 2</i> ein lokales Minimum.
      </div>
    `,
    formulas: [
      {
        name: "Potenzregel der Stammfunktion",
        html: "&int; x<sup>n</sup> dx = <sup>1</sup>/<sub>n+1</sub> x<sup>n+1</sup> + C",
        quantities: "n Exponent (n ≠ −1), C Integrationskonstante",
      },
    ],
    quiz: {
      question: "Was lässt sich über den Graphen von F an einer Stelle x_0 sagen, an der f(x_0) = 0 mit Vorzeichenwechsel von + nach − gilt?",
      options: [
        "F besitzt bei x_0 ein lokales Maximum (Hochpunkt).",
        "F besitzt bei x_0 ein lokales Minimum (Tiefpunkt).",
        "F schneidet an dieser Stelle die x-Achse.",
      ],
      correctIndex: 0,
      explanation:
        "Da F'(x) = f(x) gilt, wechselt die Steigung von F bei x_0 von positiv nach negativ. Folglich liegt ein lokales Maximum vor.",
    },
    lab: lab(
      "antiderivative-graph",
      "Stammfunktion und Ableitungsgraph",
      "Verschiebe die Integrationskonstante C und vergleiche f(x) mit F(x).",
      [range("C", "Konstante C", -4, 4, 1, 1)],
      [
        output("f_nullstelle", "Nullstelle von f", () => 2, "", 0),
        output("F_extremwert", "Wert F(2) bei Tiefpunkt", (v) => -2.67 + v.C * 0.5, "", 2),
      ],
      [
        {
          id: "konstante-positiv",
          text: "Setze die Integrationskonstante auf C = 2.",
          check: (v) => v.C === 2,
        },
        {
          id: "negativ",
          text: "Verschiebe F nach unten auf C = −3.",
          check: (v) => v.C === -3,
        },
        {
          id: "ursprung",
          text: "Bringe F(x) auf C = 0 zurück.",
          check: (v) => v.C === 0,
        },
      ],
    ),
    exercises: [
      {
        id: "stammfunktion-term",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([3, 6, 9]);
          const b = rng.pick([2, 4, 8]);
          // f(x) = a*x^2 - b*x -> F(x) = (a/3)*x^3 - (b/2)*x^2
          const c3 = a / 3;
          const c2 = b / 2;
          const xVal = 2;
          const res = c3 * Math.pow(xVal, 3) - c2 * Math.pow(xVal, 2);
          return task(
            level,
            `Für f(x) = ${a}x² − ${b}x sei F(x) die Stammfunktion mit F(0) = 0. Berechne F(${xVal}).`,
            `Eine Pumpe fördert Wasser mit Rate f(t) = ${a}t² − ${b}t Liter pro Stunde. Berechne das geförderte Gesamtvolumen im Intervall [0; ${xVal}].`,
            [numberField("F =", res, "", 2)],
            "Integriere gliedweise: F(x) = (a/3)x³ − (b/2)x².",
            `F(x) = ${c3}x³ − ${c2}x² &rArr; F(${xVal}) = ${c3}·8 − ${c2}·4 = ${fmt(res, 2)}.`,
            `F(${xVal}) = ${fmt(res, 2)}`,
            { a, b },
          );
        },
      },
      {
        id: "stammfunktion-ableitung",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const m = rng.pick([2, 3, 4, 5]);
          const x0 = rng.pick([1, 2, 3]);
          // f(x) = m*x -> F'(x0) = f(x0) = m*x0
          const res = m * x0;
          return task(
            level,
            `Sei F eine Stammfunktion von f(x) = ${m}x. Welchen Wert hat die Ableitung F'(${x0})?`,
            `Die Randsteigung einer Staumauer wird durch F'(x) beschrieben. Berechne F'(${x0}) für die Zuflussfunktion f(x) = ${m}x.`,
            [numberField("F' =", res, "", 2)],
            "Nutze den Hauptsatz: F'(x) = f(x).",
            `F'(${x0}) = f(${x0}) = ${m} · ${x0} = ${fmt(res, 2)}.`,
            `F'(${x0}) = ${fmt(res, 2)}`,
            { m, x0 },
          );
        },
      },
    ],
  }),

  // 1.3 Natürliche Exponentialfunktion: Produkt- und Kettenregel
  makeLesson(1, 3, 2, {
    id: "g12-exp-ableitung-regeln",
    title: "Natürliche Exponentialfunktion und Ableitungsregeln",
    subtitle: "Produktregel und Kettenregel bei Verknüpfungen mit e^x",
    whyItMatters:
      "Die e-Funktion ist die einzige Funktion, deren Ableitung mit sich selbst übereinstimmt. Sie beschreibt fundamentale Naturprozesse wie radioaktiven Zerfall und Kondensatorentladung.",
    explanationHtml: `
      <p>Für die <strong>natürliche Exponentialfunktion</strong> <i>f(x) = e<sup>x</sup></i> gilt die bemerkenswerte Eigenschaft: <i>(e<sup>x</sup>)' = e<sup>x</sup></i>.</p>
      <div class="merke">
        <strong>Ableitungsregeln:</strong>
        <ul>
          <li><strong>Kettenregel:</strong> <i>(e<sup>u(x)</sup>)' = u'(x) · e<sup>u(x)</sup></i> (äußere mal innere Ableitung).</li>
          <li><strong>Produktregel:</strong> <i>(u(x) · v(x))' = u'(x) · v(x) + u(x) · v'(x)</i>.</li>
          <li>Beim Differenzieren von <i>(ax + b) · e<sup>kx</sup></i> klammert man stets den Term <i>e<sup>kx</sup></i> aus!</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Leite <i>f(x) = (2x − 3) · e<sup>−x</sup></i> ab.<br>
        Setze <i>u(x) = 2x − 3 &rArr; u'(x) = 2</i> und <i>v(x) = e<sup>−x</sup> &rArr; v'(x) = −e<sup>−x</sup></i>.<br>
        <i>f'(x) = 2 · e<sup>−x</sup> + (2x − 3) · (−e<sup>−x</sup>) = e<sup>−x</sup> · [2 − (2x − 3)] = (5 − 2x) · e<sup>−x</sup></i>.
      </div>
    `,
    formulas: [
      {
        name: "Produktregel",
        html: "(u · v)' = u' · v + u · v'",
        quantities: "u, v differenzierbare Funktionen",
      },
      {
        name: "Kettenregel für e-Funktion",
        html: "(e<sup>u(x)</sup>)' = u'(x) · e<sup>u(x)</sup>",
        quantities: "u innere Funktion, u' innere Ableitung",
      },
    ],
    quiz: {
      question: "Wie lautet die Ableitung von f(x) = e^{−2x}?",
      options: [
        "f'(x) = −2 · e^{−2x}",
        "f'(x) = 2 · e^{−2x}",
        "f'(x) = −e^{−2x}",
      ],
      correctIndex: 0,
      explanation:
        "Nach der Kettenregel ist die innere Ableitung von u(x) = −2x gleich −2. Also f'(x) = −2 · e^{−2x}.",
    },
    lab: lab(
      "exp-derivatives",
      "Ableitung von (x − a) · e^{kx}",
      "Stelle Scharparameter a und Steigung k ein und beobachte den Kurvenverlauf.",
      [
        range("a", "Parameter a", -2, 4, 0, 1),
        range("k", "Exponent k", -2, -1, -2, 1),
      ],
      [
        output("extremstelle", "Extremstelle x_E", (v) => v.a - 1 / v.k, "", 2),
      ],
      [
        {
          id: "tiefpunkt-ursprung",
          text: "Stelle a und k so ein, dass die Extremstelle bei x = 0 liegt.",
          check: (v) => v.a - 1 / v.k === 0,
        },
        {
          id: "waagrecht-zwei",
          text: "Wähle a = 1 und k = −1, sodass die Extremstelle bei x = 2 liegt.",
          check: (v) => v.a === 1 && v.k === -1,
        },
        {
          id: "extrem-drei",
          text: "Wähle a = 2 und k = −1, sodass die Extremstelle bei x = 3 liegt.",
          check: (v) => v.a === 2 && v.k === -1,
        },
      ],
    ),
    exercises: [
      {
        id: "produktregel-exp",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 3, 4]);
          const b = rng.pick([1, 2, 5]);
          // f(x) = (a*x - b)*e^-x -> f'(x) = [a - (a*x - b)]*e^-x = (a + b - a*x)*e^-x
          // Extremstelle bei x = (a+b)/a
          const xExtr = (a + b) / a;
          return task(
            level,
            `Berechne die Extremstelle der Funktion f(x) = (${a}x − ${b}) · e<sup>−x</sup>.`,
            `Der Wirkstoffspiegel im Blut verläuft nach c(t) = (${a}t − ${b}) · e<sup>−t</sup> (für t &gt; ${b / a}). Zu welchem Zeitpunkt erreicht die Konzentration ihr Maximum?`,
            [numberField("t =", xExtr, "", 2)],
            "Leite mit der Produktregel ab, klammere e^-x aus und setze die Klammer gleich 0.",
            `f'(x) = [${a} − (${a}x − ${b})] · e<sup>−x</sup> = (${a + b} − ${a}x) · e<sup>−x</sup> = 0 &rArr; x = ${a + b}/${a} = ${fmt(xExtr, 2)}.`,
            `x = ${fmt(xExtr, 2)}`,
            { a, b },
          );
        },
      },
      {
        id: "kettenregel-exp",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const k = rng.pick([2, 3, 4, 5]);
          // f(x) = e^(k*x) -> f'(0) = k
          return task(
            level,
            `Berechne den Steigungswert f'(0) für f(x) = e<sup>${k}x</sup>.`,
            `Die Stromstärke beim Einschalten eines Stromkreises folgt I(t) = 10 · e<sup>−${k}t</sup>. Bestimme |I'(0)|.`,
            [numberField("Steigung =", k, "", 0)],
            "Innere Ableitung von k·x ist k. f'(x) = k · e^{kx}, für x=0 ist e^0 = 1.",
            `f'(x) = ${k} · e<sup>${k}x</sup> &rArr; f'(0) = ${k} · 1 = ${k}.`,
            `f'(0) = ${k}`,
            { k },
          );
        },
      },
    ],
  }),

  // 1.4 Asymptotik und Grenzwerte: e^x vs. x^n
  makeLesson(1, 4, 2, {
    id: "g12-exp-grenzwerte",
    title: "Grenzwerte und Dominanz der e-Funktion",
    subtitle: "Wachstumsvergleich zwischen Exponential- und Potenzfunktionen",
    whyItMatters:
      "Die Dominanz der e-Funktion über Polynome erklärt, warum exponentielle Prozesse letztlich jedes polynomiale Wachstum überholen oder dämpfen.",
    explanationHtml: `
      <p>Im Unendlichen wächst die natürliche Exponentialfunktion schneller als jede Potenzfunktion <i>x<sup>n</sup></i> mit <i>n &gt; 0</i>.</p>
      <div class="merke">
        <strong>Zentrale Grenzwerte:</strong>
        <ul>
          <li><i>lim<sub>x &rarr; +&infin;</sub> (x<sup>n</sup> / e<sup>x</sup>) = 0</i> für alle <i>n &isin; &naturals;</i>.</li>
          <li><i>lim<sub>x &rarr; −&infin;</sub> (x<sup>n</sup> · e<sup>x</sup>) = 0</i> für alle <i>n &isin; &naturals;</i>.</li>
          <li>Man sagt: <em>„Die e-Funktion dominiert jede Potenzfunktion.“</em></li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Untersuche <i>f(x) = (x² − 3x) · e<sup>−x</sup></i> für <i>x &rarr; +&infin;</i> und <i>x &rarr; −&infin;</i>.<br>
        Für <i>x &rarr; +&infin;</i>: <i>f(x) = (x² − 3x)/e<sup>x</sup> &rarr; 0</i> (waagrechte Asymptote <i>y = 0</i>).<br>
        Für <i>x &rarr; −&infin;</i>: <i>x² − 3x &rarr; +&infin;</i> und <i>e<sup>−x</sup> &rarr; +&infin;</i>, also <i>f(x) &rarr; +&infin;</i>.
      </div>
    `,
    formulas: [
      {
        name: "Dominanz der e-Funktion",
        html: "lim<sub>x&rarr;&infin;</sub> <sup>x<sup>n</sup></sup>/<sub>e<sup>x</sup></sub> = 0",
        quantities: "n beliebige positive Zahl",
      },
    ],
    quiz: {
      question: "Welchen Grenzwert hat f(x) = x⁵ · e^{−x} für x → +∞?",
      options: [
        "0, weil die e-Funktion im Nenner schneller wächst als x⁵.",
        "+∞, weil x⁵ unendlich groß wird.",
        "1, da sich Zähler und Nenner ausgleichen.",
      ],
      correctIndex: 0,
      explanation:
        "Da x⁵ · e^{−x} = x⁵ / e^x geschrieben werden kann, setzt sich die exponentielle Dämpfung gegen die Potenzfunktion durch. Der Grenzwert ist 0.",
    },
    lab: lab(
      "exp-limits",
      "Grenzwerte x^n / e^x",
      "Verändere den Exponenten n und beobachte, wie rasch der Quotient für wachsende x gegen 0 strebt.",
      [range("n", "Exponent n", 1, 4, 2, 1)],
      [
        output("wert_bei_5", "Wert bei x = 5", (v) => Math.pow(5, v.n) / Math.exp(5), "", 3),
        output("wert_bei_10", "Wert bei x = 10", (v) => Math.pow(10, v.n) / Math.exp(10), "", 5),
      ],
      [
        {
          id: "linear",
          text: "Wähle n = 1 für den Grenzwert x / e^x.",
          check: (v) => v.n === 1,
        },
        {
          id: "kubisch",
          text: "Wähle n = 3 für den kubischen Vergleich x³ / e^x.",
          check: (v) => v.n === 3,
        },
        {
          id: "vier",
          text: "Wähle n = 4 für x⁴ / e^x.",
          check: (v) => v.n === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "limes-exp-asymptote",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 5, 8]);
          // f(x) = (x + a)*e^-x + 3 -> Limes für x->+oo ist 3
          const c = rng.pick([1, 2, 3, 4]);
          return task(
            level,
            `Bestimme den Grenzwert von f(x) = (x + ${a}) · e<sup>−x</sup> + ${c} für x &rarr; +&infin;.`,
            `Die Temperatur eines Werkstücks kühlt ab nach T(t) = (t + ${a}) · e<sup>−t</sup> + ${c}. Welche Umgebungstemperatur wird langfristig erreicht?`,
            [numberField("Limes =", c, "", 0)],
            "Da (x+a)*e^-x für x->unendlich gegen 0 geht, bleibt nur die Konstante übrig.",
            `lim<sub>x&rarr;&infin;</sub> [(x + ${a}) · e<sup>−x</sup> + ${c}] = 0 + ${c} = ${c}.`,
            `Limes = ${c}`,
            { a, c },
          );
        },
      },
      {
        id: "dominanz-exp-rechnung",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const deg = rng.pick([2, 3]);
          return task(
            level,
            `Welchen Grenzwert besitzt f(x) = x<sup>${deg}</sup> · e<sup>x</sup> für x &rarr; −&infin;?`,
            `Untersuche das Grenzverhalten von g(x) = x<sup>${deg}</sup> / e<sup>−x</sup> für x &rarr; −&infin;.`,
            [numberField("Limes =", 0, "", 0)],
            "Substitution z = −x zeigt z^deg * e^-z -> 0.",
            `Aufgrund der Dominanz der Exponentialfunktion gilt lim_{x→−∞} x^${deg} · e^x = 0.`,
            `Limes = 0`,
            { deg },
          );
        },
      },
    ],
  }),

  // 1.5 Kurvendiskussion von e-Funktionen mit Parametern
  makeLesson(1, 5, 2, {
    id: "g12-exp-kurvendiskussion",
    title: "Kurvendiskussion verknüpfter e-Funktionen",
    subtitle: "Extrempunkte, Wendepunkte und Gleichungen mit dem natürlichen Logarithmus",
    whyItMatters:
      "Vollständige Funktionsuntersuchungen verknüpfter e-Funktionen sind ein Kernbestandteil bayerischer Abiturprüfungen.",
    explanationHtml: `
      <p>Bei der Kurvendiskussion von <i>f(x) = p(x) · e<sup>kx</sup></i> nutzt du die Eigenschaft <i>e<sup>kx</sup> &gt; 0</i> für alle reellen <i>x</i>. Eine Exponentialfunktion kann niemals den Wert 0 annehmen!</p>
      <div class="merke">
        <strong>Vorgehensweise:</strong>
        <ul>
          <li><strong>Nullstellen:</strong> Da <i>e<sup>kx</sup> &ne; 0</i>, muss das Polynom <i>p(x) = 0</i> werden.</li>
          <li><strong>Gleichungen lösen:</strong> Aus <i>e<sup>kx</sup> = c</i> folgt durch Logarithmieren <i>kx = ln(c) &rArr; x = ln(c)/k</i> (nur für <i>c &gt; 0</i> lösbar!).</li>
          <li><strong>Extrema:</strong> Ausklammern von <i>e<sup>kx</sup></i> bei <i>f'(x) = 0</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> <i>f(x) = (x² − 4) · e<sup>−x</sup></i>.<br>
        Nullstellen: <i>x² − 4 = 0 &rArr; x<sub>1</sub> = 2, x<sub>2</sub> = −2</i>.<br>
        Ableitung: <i>f'(x) = (−x² + 2x + 4) · e<sup>−x</sup></i>.<br>
        Notwendige Bedingung: <i>−x² + 2x + 4 = 0 &rArr; x<sub>1,2</sub> = 1 &plusmn; &radic;5</i>.
      </div>
    `,
    formulas: [
      {
        name: "Lösen von Exponentialgleichungen",
        html: "e<sup>kx</sup> = c &hArr; x = <sup>ln(c)</sup>/<sub>k</sub>",
        quantities: "c > 0, k ≠ 0",
      },
    ],
    quiz: {
      question: "Warum kann die Gleichung (x − 3) · e^{2x} = 0 nur die Nullstelle x = 3 besitzen?",
      options: [
        "Weil e^{2x} > 0 für alle reellen Zahlen x gilt und nie null wird.",
        "Weil e^{2x} nur für x = 0 null wird.",
        "Weil die Kettenregel keine weiteren Nullstellen zulässt.",
      ],
      correctIndex: 0,
      explanation:
        "Ein Produkt wird null, wenn mindestens ein Faktor null ist. Da der Exponentialausdruck e^{2x} echt positiv ist, kann nur x − 3 = 0 werden.",
    },
    lab: lab(
      "exp-curve",
      "Kurvendiskussion f_a(x) = (x² − a) · e^{−0,5x}",
      "Stelle a ein und beobachte Nullstellen und Extremstellen.",
      [range("a", "Parameter a", 1, 9, 2, 1)],
      [
        output("nullstelle", "Positive Nullstelle", (v) => Math.sqrt(v.a), "", 2),
      ],
      [
        {
          id: "null-eins",
          text: "Setze a = 1, sodass die Nullstellen bei x = ±1 liegen.",
          check: (v) => v.a === 1,
        },
        {
          id: "null-drei",
          text: "Wähle a = 9 für Nullstellen bei x = ±3.",
          check: (v) => v.a === 9,
        },
        {
          id: "standard",
          text: "Stelle a = 4 ein.",
          check: (v) => v.a === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "exp-nullstellen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([4, 9, 16, 25]);
          const xPos = Math.sqrt(a);
          return task(
            level,
            `Bestimme die positive Nullstelle von f(x) = (x² − ${a}) · e<sup>−2x</sup>.`,
            `Ein Laserimpuls hat die Intensitätsverteilung I(x) = (x² − ${a}) · e<sup>−x</sup>. Bei welchem x &gt; 0 erlischt der Impuls?`,
            [numberField("x =", xPos, "", 2)],
            "Da e^-2x > 0, setze x² − a = 0.",
            `x² − ${a} = 0 &rArr; x = &radic;${a} = ${xPos}.`,
            `x = ${fmt(xPos, 2)}`,
            { a },
          );
        },
      },
      {
        id: "exp-gleichung-ln",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const k = rng.pick([2, 4]);
          const c = rng.pick([3, 5, 7]);
          const res = Math.log(c) / k;
          return task(
            level,
            `Löse die Exponentialgleichung e<sup>${k}x</sup> = ${c} auf zwei Dezimalen gerundet.`,
            `Eine Bakterienpopulation wächst nach N(t) = e<sup>${k}t</sup>. Zu welchem Zeitpunkt t ist der Bestand auf das ${c}-fache angewachsen?`,
            [numberField("x =", res, "", 2)],
            "Wende den natürlichen Logarithmus an: k·x = ln(c) &rArr; x = ln(c)/k.",
            `${k}x = ln(${c}) &rArr; x = ln(${c})/${k} &approx; ${fmt(res, 2)}.`,
            `x = ${fmt(res, 2)}`,
            { k, c },
          );
        },
      },
    ],
  }),

  // 1.6 Modellierung von Wachstum und Zerfall & Basiswechsel
  makeLesson(1, 6, 2, {
    id: "g12-exp-wachstum-modelle",
    title: "Modellierung von Wachstums- und Abklingvorgängen",
    subtitle: "Basiswechsel auf die Basis e, Halbwertszeit und Verdopplungszeit",
    whyItMatters:
      "Ob Pharmakokinetik beim Abbau von Medikamenten oder Zinseszins in der Finanzmathematik: Reale Daten werden standardisiert auf die Basis e zurückgeführt.",
    explanationHtml: `
      <p>Jede Exponentialfunktion mit beliebiger Basis <i>a &gt; 0</i> lässt sich durch die Identität <i>a = e<sup>ln(a)</sup></i> auf die natürliche Basis <i>e</i> zurückführen: <i>B(t) = B<sub>0</sub> · a<sup>t</sup> = B<sub>0</sub> · e<sup>(ln a) · t</sup> = B<sub>0</sub> · e<sup>k·t</sup></i> mit <i>k = ln(a)</i>.</p>
      <div class="merke">
        <strong>Wichtige Kenngrößen:</strong>
        <ul>
          <li><strong>Wachstumskonstante:</strong> <i>k &gt; 0</i> für Wachstum, <i>k &lt; 0</i> für Abklingen/Zerfall.</li>
          <li><strong>Halbwertszeit <i>T<sub>H</sub></i>:</strong> Zeitspanne, nach der sich der Anfangsbestand halbiert hat: <i>T<sub>H</sub> = ln(2) / |k|</i>.</li>
          <li><strong>Verdopplungszeit <i>T<sub>V</sub></i>:</strong> <i>T<sub>V</sub> = ln(2) / k</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Ein radioaktives Isotop zerfällt nach <i>N(t) = 100 · e<sup>−0,05·t</sup></i> (Zeit in Tagen).<br>
        Halbwertszeit: <i>T<sub>H</sub> = ln(2) / 0,05 &approx; 0,6931 / 0,05 &approx; 13,86</i> Tage.<br>
        Nach ca. 13,9 Tagen ist noch die Hälfte des Ausgangsmaterials vorhanden.
      </div>
    `,
    formulas: [
      {
        name: "Basiswechsel auf Basis e",
        html: "a<sup>t</sup> = e<sup>(ln a) · t</sup>",
        quantities: "a > 0 Basis, ln natürlicher Logarithmus",
      },
      {
        name: "Halbwertszeit",
        html: "T<sub>H</sub> = <sup>ln(2)</sup>/<sub>|k|</sub>",
        quantities: "k Zerfallskonstante (k < 0)",
      },
    ],
    quiz: {
      question: "Wie lautet die Wachstumskonstante k für den Prozess N(t) = N_0 · 2^t umgeschrieben zur Basis e?",
      options: [
        "k = ln(2) ≈ 0,693",
        "k = 2",
        "k = e² ≈ 7,389",
      ],
      correctIndex: 0,
      explanation:
        "Da 2 = e^{ln(2)} gilt, ist 2^t = e^{(ln 2)·t}. Die Wachstumskonstante ist somit k = ln(2).",
    },
    lab: lab(
      "exp-growth",
      "Wachstum und Zerfall N(t) = N_0 · e^{kt}",
      "Stelle Anfangswert N_0 und Exponent k ein.",
      [
        range("N0", "Anfangsbestand N_0", 50, 150, 80, 10),
        range("k", "Rate k (x0,1)", -6, 4, -2, 1),
      ],
      [
        output("halbwertszeit", "Halbwertszeit T_H", (v) => (v.k < 0 ? Math.log(2) / Math.abs(v.k * 0.1) : 0), "Std", 2),
      ],
      [
        {
          id: "zerfall-stark",
          text: "Wähle k = −5 für einen raschen Zerfall.",
          check: (v) => v.k === -5,
        },
        {
          id: "wachstum-moderat",
          text: "Stelle k = 2 für exponentielles Wachstum ein.",
          check: (v) => v.k === 2,
        },
        {
          id: "basis",
          text: "Wähle N_0 = 100 und k = −3.",
          check: (v) => v.N0 === 100 && v.k === -3,
        },
      ],
    ),
    exercises: [
      {
        id: "halbwertszeit-berechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const lambda = rng.pick([0.02, 0.05, 0.1, 0.2]);
          const th = Math.log(2) / lambda;
          return task(
            level,
            `Berechne die Halbwertszeit T<sub>H</sub> für N(t) = N<sub>0</sub> · e<sup>−${lambda}t</sup> (in Tagen, auf eine Dezimale gerundet).`,
            `Ein Medikament wird im Körper gemäß c(t) = c<sub>0</sub> · e<sup>−${lambda}t</sup> abgebaut (t in Stunden). Nach wie vielen Stunden ist die Hälfte der Dosis abgebaut?`,
            [numberField("T_H =", th, "h", 1)],
            "Nutze die Formel T_H = ln(2) / lambda.",
            `T_H = ln(2) / ${lambda} &approx; 0,6931 / ${lambda} = ${fmt(th, 1)}.`,
            `T_H = ${fmt(th, 1)} h`,
            { lambda },
          );
        },
      },
      {
        id: "basiswechsel-k",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([1.05, 1.1, 1.25, 1.5]);
          const k = Math.log(a);
          return task(
            level,
            `Bestimme die Wachstumskonstante k zur Basis e für B(t) = B<sub>0</sub> · ${a}<sup>t</sup> (auf drei Dezimalen gerundet).`,
            `Der Wert eines Anlageportfolios wächst jährlich um den Faktor ${a}. Wie lautet die stetige Verzinsungsrate k in der Darstellung e<sup>kt</sup>?`,
            [numberField("k =", k, "", 3)],
            "Berechne k = ln(a).",
            `k = ln(${a}) &approx; ${fmt(k, 3)}.`,
            `k = ${fmt(k, 3)}`,
            { a },
          );
        },
      },
    ],
  }),

  // 1.7 Ableitung der Sinus- und Kosinusfunktion (Graphische Plausibilisierung)
  makeLesson(1, 7, 3, {
    id: "g12-trig-ableitung-graph",
    title: "Ableitung der Sinus- und Kosinusfunktion",
    subtitle: "Graphische Herleitung der Steigungen an markanten Punkten",
    whyItMatters:
      "Trigonometrische Funktionen modellieren harmonische Schwingungen in Physik, Akustik und Elektrotechnik. Die Ableitung beschreibt die Phasengeschwindigkeit.",
    explanationHtml: `
      <p>Betrachtet man den Graphen der Sinusfunktion <i>f(x) = sin(x)</i> im Bogenmaß, erkennt man an den Extremstellen waagrechte Tangenten (Steigung 0) und an den Nullstellen maximale Steigung.</p>
      <div class="merke">
        <strong>Graphische Ableitungsregeln:</strong>
        <ul>
          <li><i>(sin x)' = cos x</i></li>
          <li><i>(cos x)' = −sin x</i></li>
          <li><i>(sin x)'' = −sin x</i> (zweite Ableitung ist die gespiegelte Ausgangsfunktion!).</li>
          <li><strong>Achtung:</strong> Diese Ableitungsregeln gelten nur im <strong>Bogenmaß (rad)</strong>!</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Bei <i>x = 0</i> hat <i>sin(x)</i> die Steigung <i>f'(0) = cos(0) = 1</i>.<br>
        Bei <i>x = &pi;/2</i> ist der Hochpunkt von <i>sin(x)</i>, folglich <i>f'(&pi;/2) = cos(&pi;/2) = 0</i>.<br>
        Bei <i>x = &pi;</i> fällt <i>sin(x)</i> am steilsten: <i>f'(&pi;) = cos(&pi;) = −1</i>.
      </div>
    `,
    formulas: [
      {
        name: "Ableitung trigonometrischer Grundfunktionen",
        html: "(sin x)' = cos x &emsp; und &emsp; (cos x)' = −sin x",
        quantities: "x im Bogenmaß",
      },
    ],
    quiz: {
      question: "Welchen Wert hat die Steigung des Kosinusgraphen an der Stelle x = π/2?",
      options: [
        "−1, da (cos x)' = −sin(π/2) = −1.",
        "0, da cos(π/2) = 0.",
        "+1, da sin(π/2) = 1.",
      ],
      correctIndex: 0,
      explanation:
        "Die Ableitung von cos(x) lautet −sin(x). Für x = π/2 ergibt sich −sin(π/2) = −1.",
    },
    lab: lab(
      "trig-tangent",
      "Graphische Ableitung des Sinus",
      "Verschiebe den Berührpunkt x_0 und vergleiche die Tangentensteigung mit dem Kosinuswert.",
      [range("x0", "Stelle x_0 (in π/4)", -4, 4, 1, 1)],
      [
        output("steigung", "Steigung m = cos(x_0)", (v) => Math.cos((v.x0 * Math.PI) / 4), "", 2),
      ],
      [
        {
          id: "ursprung-steigung",
          text: "Wähle x_0 = 0 für maximale Steigung m = 1.",
          check: (v) => v.x0 === 0,
        },
        {
          id: "hochpunkt",
          text: "Wähle x_0 = 2 (entspricht π/2) für waagrechte Tangente m = 0.",
          check: (v) => v.x0 === 2,
        },
        {
          id: "abfall",
          text: "Stelle x_0 = 4 (entspricht π) für die steilste Abnahme m = −1 ein.",
          check: (v) => v.x0 === 4,
        },
      ],
    ),
    exercises: [
      {
        id: "trig-ableitungswert",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const choice = rng.pick([
            { fn: "sin", x: 0, val: 1, text: "cos(0)" },
            { fn: "cos", x: 0, val: 0, text: "−sin(0)" },
            { fn: "sin", x: Math.PI, val: -1, text: "cos(π)" },
          ]);
          return task(
            level,
            `Bestimme den Wert der Ableitung von f(x) = ${choice.fn}(x) an der Stelle x = ${choice.x === 0 ? "0" : "π"}.`,
            `Eine Schaukelbewegung folgt s(t) = ${choice.fn}(t). Bestimme die Momentangeschwindigkeit s' zum Zeitpunkt t = ${choice.x === 0 ? "0" : "π"}.`,
            [numberField("f' =", choice.val, "", 0)],
            `Nutze (${choice.fn} x)' an der Stelle.`,
            `Ableitung auswerten: ${choice.text} = ${fmt(choice.val, 0)}.`,
            `f' = ${fmt(choice.val, 0)}`,
            { val: choice.val },
          );
        },
      },
      {
        id: "trig-wendetangente",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 3, 5]);
          return task(
            level,
            `Berechne die Steigung der Tangente an den Graphen von f(x) = ${a} · sin(x) im Ursprung x = 0.`,
            `Ein Federpendel schwingt mit Auslenkung y(t) = ${a} · sin(t). Bestimme die Maximalgeschwindigkeit im Nulldurchgang t = 0.`,
            [numberField("m =", a, "", 0)],
            "f'(x) = a · cos(x). Für x = 0 ist cos(0) = 1.",
            `f'(0) = ${a} · cos(0) = ${a} · 1 = ${a}.`,
            `m = ${a}`,
            { a },
          );
        },
      },
    ],
  }),

  // 1.8 Verknüpfungen trigonometrischer Funktionen (Kettenregel)
  makeLesson(1, 8, 3, {
    id: "g12-trig-kurvendiskussion",
    title: "Verknüpfungen trigonometrischer Funktionen",
    subtitle: "Kettenregel bei Sinus und Kosinus, Frequenz und Amplitude",
    whyItMatters:
      "Wechselstromkreise und mechanische Schwingungsdämpfer erfordern die Differenzierung zusammengesetzter Sinusfunktionen mit inneren linearen Funktionen.",
    explanationHtml: `
      <p>Wird das Argument der Sinusfunktion durch eine lineare Funktion <i>u(x) = k·x + d</i> ersetzt, greift die <strong>Kettenregel</strong>: <i>(sin(k·x + d))' = k · cos(k·x + d)</i>.</p>
      <div class="merke">
        <strong>Regeln für f(x) = a · sin(k·x + d):</strong>
        <ul>
          <li><strong>Amplitude:</strong> <i>|a|</i> (maximale Auslenkung).</li>
          <li><strong>Periode:</strong> <i>p = 2&pi; / |k|</i>.</li>
          <li><strong>1. Ableitung:</strong> <i>f'(x) = a·k · cos(k·x + d)</i>.</li>
          <li><strong>2. Ableitung:</strong> <i>f''(x) = −a·k² · sin(k·x + d) = −k² · f(x)</i> (Schwingungsdifferentialgleichung!).</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Gegeben ist <i>f(x) = 3 · sin(2x)</i>.<br>
        1. Ableitung: <i>f'(x) = 3 · 2 · cos(2x) = 6 · cos(2x)</i>.<br>
        Die maximale Steigung beträgt <i>6</i> und wird bei allen Nullstellen mit <i>cos(2x) = 1</i> erreicht.
      </div>
    `,
    formulas: [
      {
        name: "Kettenregel für Sinus",
        html: "(sin(k·x))' = k · cos(k·x)",
        quantities: "k Kreisfrequenz / Stauchungsfaktor",
      },
    ],
    quiz: {
      question: "Wie lautet die 1. Ableitung von f(x) = 4 · cos(3x)?",
      options: [
        "f'(x) = −12 · sin(3x)",
        "f'(x) = 12 · sin(3x)",
        "f'(x) = −4 · sin(3x)",
      ],
      correctIndex: 0,
      explanation:
        "Nach der Kettenregel ist die innere Ableitung 3 und (cos u)' = −sin u. Also f'(x) = 4 · (−sin(3x)) · 3 = −12 · sin(3x).",
    },
    lab: lab(
      "trig-composition",
      "Schwingungen f(x) = a · sin(ωx)",
      "Verändere Amplitude a und Frequenz ω.",
      [
        range("a", "Amplitude a", 1, 4, 1, 1),
        range("omega", "Kreisfrequenz ω", 1, 3, 2, 1),
      ],
      [
        output("max_steigung", "Max. Steigung a · ω", (v) => v.a * v.omega, "", 0),
        output("periode", "Periode 2π/ω", (v) => (2 * Math.PI) / v.omega, "", 2),
      ],
      [
        {
          id: "schnell",
          text: "Wähle Frequenz ω = 3 für schnelle Schwingung.",
          check: (v) => v.omega === 3,
        },
        {
          id: "amplitude-drei",
          text: "Stelle Amplitude a = 3 und ω = 2 ein.",
          check: (v) => v.a === 3 && v.omega === 2,
        },
        {
          id: "standard-schwingung",
          text: "Bringe a = 2 und ω = 1 zurück.",
          check: (v) => v.a === 2 && v.omega === 1,
        },
      ],
    ),
    exercises: [
      {
        id: "trig-kettenregel-rechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([2, 3, 5]);
          const k = rng.pick([2, 4]);
          const maxSlope = a * k;
          return task(
            level,
            `Bestimme die maximale Steigung des Graphen von f(x) = ${a} · sin(${k}x).`,
            `Die Wechselspannung in einem Netz folgt U(t) = ${a} · sin(${k}t). Bestimme den Maximalwert der Änderungsrate |U'(t)|.`,
            [numberField("m_max =", maxSlope, "", 0)],
            "f'(x) = a · k · cos(k·x). Der Maximalwert von cos ist 1.",
            `f'(x) = ${a} · ${k} · cos(${k}x) = ${maxSlope} · cos(${k}x) &rArr; Maximum = ${maxSlope}.`,
            `m_max = ${maxSlope}`,
            { a, k },
          );
        },
      },
      {
        id: "trig-extremwert-stelle",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const k = rng.pick([2, 4]);
          // f(x) = sin(k*x) hat ersten HP bei k*x = pi/2 -> x = pi / (2*k)
          const xHp = Math.PI / (2 * k);
          return task(
            level,
            `Berechne die kleinste positive Extremstelle von f(x) = sin(${k}x) (auf zwei Dezimalen).`,
            `Ein Kolben schwingt mit Auslenkung s(t) = sin(${k}t). Zu welchem ersten Zeitpunkt t &gt; 0 kehrt der Kolben um (v(t) = 0)?`,
            [numberField("t =", xHp, "", 2)],
            `Erster Hochpunkt bei ${k}x = π/2 &rArr; x = π / (2·${k}).`,
            `${k}x = &pi;/2 &rArr; x = &pi;/${2 * k} &approx; ${fmt(xHp, 2)}.`,
            `x = ${fmt(xHp, 2)}`,
            { k },
          );
        },
      },
    ],
  }),
];
