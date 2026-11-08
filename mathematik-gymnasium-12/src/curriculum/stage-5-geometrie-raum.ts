/**
 * Lernbereich 5: Grundlagen der Koordinatengeometrie im Raum (20 Std.)
 * 5 Lektionen zu 3D-Koordinaten, Vektoralgebra, Skalarprodukt, Vektorprodukt und Raumkörpern.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range, task } from "./builders";
import { numberField } from "./helpers";
import type { Rng } from "../exercises/rng";
import { fmt } from "../exercises/format";

export const STAGE_5_LESSONS: Lesson[] = [
  // 5.1 3D-Koordinatensystem und Symmetrien
  makeLesson(5, 1, null, {
    id: "g12-raum-koordinatensystem",
    title: "Das dreidimensionale Koordinatensystem",
    subtitle: "Punkte, Koordinatenebenen und Symmetrien im Raum ℝ³",
    whyItMatters:
      "3D-Koordinatensysteme bilden die Grundlage für CAD-Konstruktionen, Computeranimationen, Robotik und GPS-Navigation.",
    explanationHtml: `
      <p>Punkte im dreidimensionalen Raum werden durch Koordinatentripel <i>P(x<sub>1</sub>|x<sub>2</sub>|x<sub>3</sub>)</i> beschrieben. Das Koordinatensystem folgt der <strong>Rechte-Hand-Regel</strong> (<i>x<sub>1</sub></i> Daumen nach vorne, <i>x<sub>2</sub></i> Zeigefinger nach rechts, <i>x<sub>3</sub></i> Mittelfinger nach oben).</p>
      <div class="merke">
        <strong>Koordinatenebenen und Symmetrien:</strong>
        <ul>
          <li><strong>x₁x₂-Ebene (Grundebene):</strong> Alle Punkte haben <i>x<sub>3</sub> = 0</i>.</li>
          <li><strong>x₁x₃-Ebene:</strong> Alle Punkte haben <i>x<sub>2</sub> = 0</i>.</li>
          <li><strong>x₂x₃-Ebene:</strong> Alle Punkte haben <i>x<sub>1</sub> = 0</i>.</li>
          <li><strong>Spiegelung am Ursprung (0|0|0):</strong> Vorzeichen aller drei Koordinaten kehren sich um: <i>P'(−x₁|−x₂|−x₃)</i>.</li>
          <li><strong>Spiegelung an der x₁x₂-Ebene:</strong> Nur das Vorzeichen von <i>x<sub>3</sub></i> dreht sich um: <i>P'(x₁|x₂|−x₃)</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Gegeben ist der Punkt <i>P(3|−4|5)</i>.<br>
        Spiegelung an der <i>x₁x₂</i>-Ebene ergibt <i>P<sub>1</sub>(3|−4|−5)</i>.<br>
        Spiegelung am Koordinatenursprung ergibt <i>P<sub>2</sub>(−3|4|−5)</i>.
      </div>
    `,
    formulas: [
      {
        name: "Abstand zweier Punkte im Raum",
        html: "d(P, Q) = &radic;[(q<sub>1</sub>&minus;p<sub>1</sub>)² + (q<sub>2</sub>&minus;p<sub>2</sub>)² + (q<sub>3</sub>&minus;p<sub>3</sub>)²]",
        quantities: "p_i, q_i Koordinaten der Punkte",
      },
    ],
    quiz: {
      question: "Welche Koordinaten hat der an der x_2-x_3-Ebene gespiegelte Punkt von P(4 | −2 | 7)?",
      options: [
        "P'(−4 | −2 | 7), da nur die x_1-Koordinate ihr Vorzeichen wechselt.",
        "P'(4 | 2 | −7)",
        "P'(−4 | 2 | −7)",
      ],
      correctIndex: 0,
      explanation:
        "Bei einer Spiegelung an einer Koordinatenebene wechselt genau die Koordinate ihr Vorzeichen, die senkrecht auf dieser Ebene steht. Für die x_2-x_3-Ebene ist dies x_1.",
    },
    lab: lab(
      "3d-coordinates",
      "Punkt P(x_1, x_2, x_3) im 3D-Raum",
      "Verändere die drei Raumkoordinaten des Punktes P.",
      [
        range("x1", "Koordinate x1", 0, 6, 3, 1),
        range("x2", "Koordinate x2", 0, 6, 4, 1),
        range("x3", "Koordinate x3", 0, 6, 5, 1),
      ],
      [
        output("abstand_ursprung", "Abstand zum Ursprung", (v) => Math.sqrt(v.x1 ** 2 + v.x2 ** 2 + v.x3 ** 2), "", 2),
      ],
      [
        {
          id: "grundebene",
          text: "Setze den Punkt auf die x1-x2-Grundebene (x3 = 0).",
          check: (v) => v.x3 === 0,
        },
        {
          id: "achse",
          text: "Platziere den Punkt auf der x2-Achse (x1 = 0, x3 = 0).",
          check: (v) => v.x1 === 0 && v.x3 === 0,
        },
        {
          id: "symmetrisch",
          text: "Wähle x1 = 4, x2 = 4, x3 = 2.",
          check: (v) => v.x1 === 4 && v.x2 === 4 && v.x3 === 2,
        },
      ],
    ),
    exercises: [
      {
        id: "punktabstand-raum",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // Pyth Tripel im Raum: 1^2 + 2^2 + 2^2 = 9 -> d = 3 oder 2^2 + 3^2 + 6^2 = 49 -> d = 7
          const tripel = rng.pick([
            { dx: 1, dy: 2, dz: 2, d: 3 },
            { dx: 2, dy: 3, dz: 6, d: 7 },
            { dx: 4, dy: 4, dz: 7, d: 9 },
          ]);
          return task(
            level,
            `Berechne den Abstand d der Punkte P(0|0|0) und Q(${tripel.dx}|${tripel.dy}|${tripel.dz}).`,
            `Ein Kranhaken wird vom Ursprung zum Punkt Q(${tripel.dx}|${tripel.dy}|${tripel.dz}) verfahren. Welche Gesamtlänge d legt das Seil zurück?`,
            [numberField("d =", tripel.d, "", 0)],
            `d = √(${tripel.dx}² + ${tripel.dy}² + ${tripel.dz}²) = √(${tripel.d * tripel.d}) = ${tripel.d}.`,
            `d = ${tripel.d}`,
            { d: tripel.d },
          );
        },
      },
      {
        id: "spiegelung-ebene",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const z = rng.pick([3, 5, 8]);
          return task(
            level,
            `Der Punkt P(2|4|${z}) wird an der x1-x2-Ebene gespiegelt. Welche x3-Koordinate hat der Bildpunkt P'?`,
            `Bestimme die x3-Koordinate des an der Grundebene reflektierten Signals für Quelle P(2|4|${z}).`,
            [numberField("x3 =", -z, "", 0)],
            `Spiegelung an der x1-x2-Ebene kehrt das Vorzeichen von x3 um: x3' = −${z}.`,
            `x3' = −${z}`,
            { z },
          );
        },
      },
    ],
  }),

  // 5.2 Vektoralgebra im Raum
  makeLesson(5, 2, null, {
    id: "g12-vektoralgebra-raum",
    title: "Vektoralgebra im dreidimensionalen Raum",
    subtitle: "Vektoraddition, Skalarmultiplikation, Linearkombinationen und Rechengesetze",
    whyItMatters:
      "Kräfte, Geschwindigkeiten und Beschleunigungen in der Physik sind dreidimensionale Vektoren. Ihre Überlagerung folgt der Vektoralgebra.",
    explanationHtml: `
      <p>Ein <strong>Vektor</strong> im Raum beschreibt eine gerichtete Verschiebung mit drei Komponenten:</p>
      <div class="merke">
        <strong>Rechenregeln für Vektoren:</strong>
        <ul>
          <li><strong>Addition &amp; Subtraktion:</strong> Komponentenweise: <i>(a<sub>1</sub>|a<sub>2</sub>|a<sub>3</sub>)<sup>T</sup> &plusmn; (b<sub>1</sub>|b<sub>2</sub>|b<sub>3</sub>)<sup>T</sup> = (a<sub>1</sub>&plusmn;b<sub>1</sub> | a<sub>2</sub>&plusmn;b<sub>2</sub> | a<sub>3</sub>&plusmn;b<sub>3</sub>)<sup>T</sup></i>.</li>
          <li><strong>Skalare Multiplikation:</strong> <i>r · (a<sub>1</sub>|a<sub>2</sub>|a<sub>3</sub>)<sup>T</sup> = (r·a<sub>1</sub> | r·a<sub>2</sub> | r·a<sub>3</sub>)<sup>T</sup></i>.</li>
          <li><strong>Rechengesetze:</strong> Kommutativgesetz (<i>a + b = b + a</i>), Assoziativgesetz und Distributivgesetze gelten uneingeschränkt.</li>
          <li><strong>Kollinearität:</strong> Zwei Vektoren <i>a, b &ne; 0</i> sind kollinear (parallel), wenn <i>a = k · b</i> für ein <i>k &isin; &reals;</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Gegeben <i>a = (1 | 2 | −3)<sup>T</sup></i> und <i>b = (4 | −1 | 2)<sup>T</sup></i>.<br>
        <i>2a + b = (2·1 + 4 | 2·2 − 1 | 2·(−3) + 2)<sup>T</sup> = (6 | 3 | −4)<sup>T</sup></i>.
      </div>
    `,
    formulas: [
      {
        name: "Linearkombination von Vektoren",
        html: "r &middot; a + s &middot; b = (r&middot;a<sub>1</sub> + s&middot;b<sub>1</sub> | r&middot;a<sub>2</sub> + s&middot;b<sub>2</sub> | r&middot;a<sub>3</sub> + s&middot;b<sub>3</sub>)<sup>T</sup>",
        quantities: "r, s Skalare",
      },
    ],
    quiz: {
      question: "Wann sind zwei Vektoren a und b (ungleich Null) kollinear (parallel)?",
      options: [
        "Wenn einer ein skalares Vielfaches des anderen ist (a = k · b).",
        "Wenn ihr Skalarprodukt null ergibt.",
        "Wenn sie dieselbe Länge besitzen.",
      ],
      correctIndex: 0,
      explanation:
        "Kollinearität bedeutet Parallelität. Zwei Vektoren zeigen in dieselbe oder entgegengesetzte Richtung, wenn sie durch Multiplikation mit einer reellen Zahl k auseinander hervorgehen.",
    },
    lab: lab(
      "vector-algebra",
      "Vektoraddition a + b im Raum",
      "Verändere die Komponenten von a und b.",
      [
        range("a1", "a1", 0, 4, 2, 1),
        range("a2", "a2", 0, 4, 3, 1),
        range("b1", "b1", 0, 4, 1, 1),
        range("b2", "b2", 0, 4, 2, 1),
      ],
      [
        output("summe_1", "Summe x1", (v) => v.a1 + v.b1, "", 0),
        output("summe_2", "Summe x2", (v) => v.a2 + v.b2, "", 0),
      ],
      [
        {
          id: "kollinear",
          text: "Mache a und b parallel (z. B. a = (2|2), b = (2|2)).",
          check: (v) => v.a1 === 2 && v.a2 === 2 && v.b1 === 2 && v.b2 === 2,
        },
        {
          id: "null-b",
          text: "Setze b = (0|0).",
          check: (v) => v.b1 === 0 && v.b2 === 0,
        },
        {
          id: "groesser",
          text: "Stelle a = (3|4) und b = (1|2) ein.",
          check: (v) => v.a1 === 3 && v.a2 === 4 && v.b1 === 1 && v.b2 === 2,
        },
      ],
    ),
    exercises: [
      {
        id: "linearkombination-rechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const r = rng.pick([2, 3]);
          const a1 = 1;
          const b1 = 4;
          const res1 = r * a1 + b1;
          return task(
            level,
            `Berechne die 1. Komponente des Vektors c = ${r}·a + b für a = (1|2|3)<sup>T</sup> und b = (4|0|−1)<sup>T</sup>.`,
            `Zwei Seilkräfte überlagern sich zu F = ${r}·F_1 + F_2. Bestimme die x-Komponente der Gesamtkraft.`,
            [numberField("c1 =", res1, "", 0)],
            `c1 = ${r} · 1 + 4 = ${res1}.`,
            `c1 = ${res1}`,
            { r },
          );
        },
      },
      {
        id: "verbindungsvektor",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const xA = rng.pick([1, 2, 3]);
          const xB = rng.pick([6, 7, 9]);
          const dx = xB - xA;
          return task(
            level,
            `Bestimme die 1. Komponente des Verbindungsvektors AB von A(${xA}|2|1) nach B(${xB}|5|4).`,
            `Ein Flugzeug fliegt von Wegpunkt A(${xA}|2|1) zu Wegpunkt B(${xB}|5|4). Wie lautet die Verschiebung in x1-Richtung?`,
            [numberField("Δx =", dx, "", 0)],
            `AB = B − A &rArr; Δx = ${xB} − ${xA} = ${dx}.`,
            `Δx = ${dx}`,
            { xA, xB },
          );
        },
      },
    ],
  }),

  // 5.3 Skalarprodukt und Schnittwinkel
  makeLesson(5, 3, null, {
    id: "g12-skalarprodukt-winkel",
    title: "Skalarprodukt und Orthogonalität",
    subtitle: "Vektorlänge, Schnittwinkel und Orthogonalitätskriterium",
    whyItMatters:
      "Das Skalarprodukt prüft rechte Winkel bei Baukonstruktionen und berechnet in der Physik die mechanische Arbeit W = F · s.",
    explanationHtml: `
      <p>Das <strong>Skalarprodukt</strong> zweier Vektoren <i>a</i> und <i>b</i> ordnet zwei Vektoren eine reelle Zahl (ein Skalar) zu:</p>
      <div class="merke">
        <strong>Definition und Eigenschaften:</strong>
        <p style="text-align:center;"><i>a · b = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub> + a<sub>3</sub>b<sub>3</sub> = |a| · |b| · cos(&phi;)</i></p>
        <ul>
          <li><strong>Vektorlänge (Betrag):</strong> <i>|a| = &radic;(a · a) = &radic;(a<sub>1</sub>² + a<sub>2</sub>² + a<sub>3</sub>²)</i>.</li>
          <li><strong>Orthogonalitätskriterium:</strong> Zwei Vektoren <i>a, b &ne; 0</i> stehen genau dann <strong>orthogonal (senkrecht)</strong> aufeinander, wenn <i>a · b = 0</i> gilt (da <i>cos(90°) = 0</i>).</li>
          <li><strong>Schnittwinkel:</strong> <i>cos(&phi;) = (a · b) / (|a| · |b|)</i> mit <i>0° &le; &phi; &le; 180°</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Sind <i>a = (2 | 3 | −1)<sup>T</sup></i> und <i>b = (4 | −2 | 2)<sup>T</sup></i> orthogonal?<br>
        <i>a · b = 2·4 + 3·(−2) + (−1)·2 = 8 − 6 − 2 = 0</i>.<br>
        Das Skalarprodukt ist null, folglich stehen die Vektoren orthogonal aufeinander (<i>&phi; = 90°</i>).
      </div>
    `,
    formulas: [
      {
        name: "Skalarprodukt",
        html: "a &middot; b = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub> + a<sub>3</sub>b<sub>3</sub>",
        quantities: "Ergebnis ist eine reelle Zahl",
      },
      {
        name: "Schnittwinkelformel",
        html: "cos(&phi;) = <sup>a &middot; b</sup>/<sub>|a| &middot; |b|</sub>",
        quantities: "φ Winkel zwischen a und b",
      },
    ],
    quiz: {
      question: "Was bedeutet es für zwei Vektoren a ≠ 0 und b ≠ 0, wenn ihr Skalarprodukt a · b < 0 negativ ist?",
      options: [
        "Der von ihnen eingeschlossene Winkel ist ein stumpfer Winkel (90° < φ ≤ 180°).",
        "Die Vektoren stehen senkrecht aufeinander.",
        "Der Winkel ist spitz (0° ≤ φ < 90°).",
      ],
      correctIndex: 0,
      explanation:
        "Da cos(φ) = (a·b)/(|a||b|) das gleiche Vorzeichen wie das Skalarprodukt hat und der Kosinus im 2. Quadranten negativ ist, liegt ein stumpfer Winkel vor.",
    },
    lab: lab(
      "dot-product",
      "Skalarprodukt und Winkel",
      "Verändere die Vektoren a = (a1 | 0 | 0) und b = (2 | b2 | 0).",
      [
        range("a1", "Länge a1", 1, 5, 2, 1),
        range("b2", "Komponente b2", 0, 4, 3, 1),
      ],
      [
        output("skalarprodukt", "Skalarprodukt a · b", (v) => v.a1 * 2, "", 0),
        output("winkel", "Winkel φ", (v) => (Math.acos(2 / Math.sqrt(4 + v.b2 ** 2)) * 180) / Math.PI, "°", 1),
      ],
      [
        {
          id: "orthogonal",
          text: "Wähle b2 = 0 (b liegt auf derselben Achse, Winkel 0°).",
          check: (v) => v.b2 === 0,
        },
        {
          id: "laenge-vier",
          text: "Stelle a1 = 4 ein.",
          check: (v) => v.a1 === 4,
        },
        {
          id: "winkel-vierzig",
          text: "Wähle b2 = 2 bei a1 = 3 (Winkel ca. 45°).",
          check: (v) => v.a1 === 3 && v.b2 === 2,
        },
      ],
    ),
    exercises: [
      {
        id: "skalarprodukt-ausrechnen",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a1 = rng.pick([2, 3, 4]);
          const a2 = 1;
          const a3 = -2;
          const b1 = 3;
          const b2 = 4;
          const b3 = 2;
          const dot = a1 * b1 + a2 * b2 + a3 * b3;
          return task(
            level,
            `Berechne das Skalarprodukt a · b für a = (${a1}|${a2}|${a3})<sup>T</sup> und b = (${b1}|${b2}|${b3})<sup>T</sup>.`,
            `Eine Kraft F = (${a1}|${a2}|${a3})<sup>T</sup> N verschiebt einen Körper um s = (${b1}|${b2}|${b3})<sup>T</sup> m. Berechne die verrichtete Arbeit W = F · s in Joule.`,
            [numberField("a · b =", dot, "", 0)],
            `a · b = ${a1}·${b1} + ${a2}·${b2} + (${a3})·${b3} = ${a1 * b1} + ${a2 * b2} + (${a3 * b3}) = ${dot}.`,
            `a · b = ${dot}`,
            { a1, dot },
          );
        },
      },
      {
        id: "orthogonal-parameter",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // a = (2, k, 4), b = (4, -2, -1) -> a*b = 8 - 2k - 4 = 4 - 2k = 0 -> k = 2
          return task(
            level,
            "Für welchen Wert von k stehen die Vektoren a = (2|k|4)<sup>T</sup> und b = (4|−2|−1)<sup>T</sup> orthogonal aufeinander?",
            "Zwei Firstbalken sollen rechtwinklig aufeinanderstoßen: a = (2|k|4)<sup>T</sup> und b = (4|−2|−1)<sup>T</sup>. Bestimme k.",
            [numberField("k =", 2, "", 0)],
            "Bedingung a · b = 0 &rArr; 2·4 + k·(−2) + 4·(−1) = 8 − 2k − 4 = 4 − 2k = 0 &rArr; 2k = 4 &rArr; k = 2.",
            "k = 2",
          );
        },
      },
    ],
  }),

  // 5.4 Vektorprodukt, Flächen und Spatvolumen
  makeLesson(5, 4, null, {
    id: "g12-vektorprodukt-spatprodukt",
    title: "Vektorprodukt und Spatprodukt",
    subtitle: "Kreuzprodukt, Normalenvektor, Dreiecksflächen und Rauminhalte",
    whyItMatters:
      "Das Vektorprodukt konstruiert automatisch Normalenvektoren von Ebenen und liefert in der Physik das Drehmoment M = r × F und die Lorentzkraft.",
    explanationHtml: `
      <p>Das <strong>Vektorprodukt (Kreuzprodukt)</strong> zweier Vektoren <i>a &times; b</i> liefert einen <strong>Vektor</strong>, der orthogonal auf beiden Ausgangsvektoren steht:</p>
      <div class="merke">
        <strong>Definition und Eigenschaften:</strong>
        <p style="text-align:center;"><i>a &times; b = (a<sub>2</sub>b<sub>3</sub> − a<sub>3</sub>b<sub>2</sub> | a<sub>3</sub>b<sub>1</sub> − a<sub>1</sub>b<sub>3</sub> | a<sub>1</sub>b<sub>2</sub> − a<sub>2</sub>b<sub>1</sub>)<sup>T</sup></i></p>
        <ul>
          <li><strong>Antikommutativ:</strong> <i>b &times; a = −(a &times; b)</i>.</li>
          <li><strong>Flächeninhalt:</strong>
            <br>&bull; Parallelogrammfläche: <i>A<sub>Parallelogramm</sub> = |a &times; b|</i>.
            <br>&bull; Dreiecksfläche: <i>A<sub>Dreieck</sub> = <sup>1</sup>/<sub>2</sub> · |a &times; b|</i>.
          </li>
          <li><strong>Spatprodukt (Volumen eines Parallelepipeds):</strong> <i>V<sub>Spat</sub> = |(a &times; b) · c|</i>.</li>
          <li><strong>Pyramidenvolumen:</strong> <i>V<sub>Pyramide</sub> = <sup>1</sup>/<sub>6</sub> · |(a &times; b) · c|</i>.</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Berechne den Normalenvektor zu <i>a = (1|0|0)<sup>T</sup></i> und <i>b = (0|2|0)<sup>T</sup></i>.<br>
        <i>a &times; b = (0·0 − 0·2 | 0·0 − 1·0 | 1·2 − 0·0)<sup>T</sup> = (0 | 0 | 2)<sup>T</sup></i>.<br>
        Die aufgespannte Fläche beträgt <i>|a &times; b| = &radic;(0² + 0² + 2²) = 2</i> FE.
      </div>
    `,
    formulas: [
      {
        name: "Dreiecksfläche mit Kreuzprodukt",
        html: "A<sub>Dreieck</sub> = <sup>1</sup>/<sub>2</sub> &middot; |a &times; b|",
        quantities: "a, b aufspannende Kantenvektoren",
      },
      {
        name: "Pyramidenvolumen (Spatprodukt)",
        html: "V = <sup>1</sup>/<sub>6</sub> &middot; |(a &times; b) &middot; c|",
        quantities: "a, b, c Kantenvektoren der Dreieckspyramide",
      },
    ],
    quiz: {
      question: "Was ergibt das Kreuzprodukt zweier paralleler Vektoren a und b (mit a = k · b)?",
      options: [
        "Den Nullvektor (0 | 0 | 0)^T, da die aufgespannte Parallelogrammfläche null ist.",
        "Ein Skalar vom Wert 1.",
        "Einen Einheitsvektor.",
      ],
      correctIndex: 0,
      explanation:
        "Parallele Vektoren spannen keine Fläche auf (|a × b| = 0). Folglich ist das Kreuzprodukt kollinearer Vektoren stets der Nullvektor.",
    },
    lab: lab(
      "cross-product",
      "Vektorprodukt und Parallelogrammfläche",
      "Stelle die Längen der Kantenvektoren a = (a1 | 0 | 0) und b = (0 | b2 | 0) ein.",
      [
        range("a1", "Länge a1", 1, 5, 2, 1),
        range("b2", "Länge b2", 1, 5, 2, 1),
      ],
      [
        output("flaeche", "Flächeninhalt |a × b|", (v) => v.a1 * v.b2, "", 0),
        output("dreiecksflaeche", "Dreiecksfläche", (v) => 0.5 * v.a1 * v.b2, "", 1),
      ],
      [
        {
          id: "quadrat",
          text: "Wähle a1 = 4 und b2 = 4 (Fläche = 16).",
          check: (v) => v.a1 === 4 && v.b2 === 4,
        },
        {
          id: "dreieck-sechs",
          text: "Wähle a1 = 3 und b2 = 4 für Dreiecksfläche 6,0.",
          check: (v) => v.a1 === 3 && v.b2 === 4,
        },
        {
          id: "standard-drei",
          text: "Bringe a1 = 3 und b2 = 3 zurück.",
          check: (v) => v.a1 === 3 && v.b2 === 3,
        },
      ],
    ),
    exercises: [
      {
        id: "kreuzprodukt-komponente",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // a = (1, 2, 0), b = (0, 3, 4)
          // a x b = (2*4 - 0*3 | 0*0 - 1*4 | 1*3 - 2*0) = (8 | -4 | 3)
          return task(
            level,
            "Berechne das Kreuzprodukt n = a × b für a = (1|2|0)<sup>T</sup> und b = (0|3|4)<sup>T</sup>. Wie lautet die 1. Komponente n1?",
            "Bestimme den Normalenvektor der Ebene E aufgespannt durch a = (1|2|0)<sup>T</sup> und b = (0|3|4)<sup>T</sup>.",
            [numberField("n1 =", 8, "", 0)],
            "n1 = a2·b3 − a3·b2 = 2·4 − 0·3 = 8.",
            "n1 = 8",
          );
        },
      },
      {
        id: "dreiecksflaeche-vektor",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([4, 6, 8]);
          const b = rng.pick([3, 5]);
          // a = (a, 0, 0), b = (0, b, 0) -> Area = 0.5 * a * b
          const area = 0.5 * a * b;
          return task(
            level,
            `Berechne den Flächeninhalt des Dreiecks aufgespannt von a = (${a}|0|0)<sup>T</sup> und b = (0|${b}|0)<sup>T</sup>.`,
            `Eine dreieckige Glasfassade wird durch a = (${a}|0|0)<sup>T</sup> m und b = (0|${b}|0)<sup>T</sup> m beschrieben. Bestimme die Glasfläche in m².`,
            [numberField("A =", area, "", 1)],
            `A = 0,5 · |a × b| = 0,5 · (${a} · ${b}) = ${area}.`,
            `A = ${fmt(area, 1)}`,
            { a, b },
          );
        },
      },
    ],
  }),

  // 5.5 Geometrische Körper und Figuren im Raum in Sachzusammenhängen
  makeLesson(5, 5, null, {
    id: "g12-koerper-sachkontexte",
    title: "Berechnungen an Raumkörpern in Sachkontexten",
    subtitle: "Dachkonstruktionen, Pyramiden, Neigungswinkel und Volumina",
    whyItMatters:
      "Statiker und Architekten modellieren Solardächer, Brückenpfeiler und Hallenkonstruktionen mit räumlichen Vektormodellen.",
    explanationHtml: `
      <p>Komplexe dreidimensionale Bauwerke (wie Dächer, Zelte oder Pyramiden) werden durch Eckpunkte im Raum modelliert. Vektoren ermöglichen die exakte Berechnung von Längen, Neigungswinkeln und Rauminhalten:</p>
      <div class="merke">
        <strong>Werkzeuge der räumlichen Modellierung:</strong>
        <ul>
          <li><strong>Neigungswinkel eines Dachs:</strong> Schnittwinkel zwischen dem Normalenvektor der Dachfläche und der vertikalen Achse <i>n<sub>Grund</sub> = (0|0|1)<sup>T</sup></i>:
            <br><i>cos(&alpha;) = |n<sub>Dach</sub> · (0|0|1)<sup>T</sup>| / |n<sub>Dach</sub>|</i>.
          </li>
          <li><strong>Dachfläche:</strong> Zerlegung in ebene Dreiecke und Parallelogramme mittels Vektorprodukt.</li>
          <li><strong>Volumen:</strong> Zerlegung in Quader, Prismen und Pyramiden (<i>V = <sup>1</sup>/<sub>3</sub> · G · h</i>).</li>
        </ul>
      </div>
      <div class="example">
        <strong>Beispiel:</strong> Eine Pyramide hat die quadratische Grundfläche <i>A(2|−2|0)</i>, <i>B(2|2|0)</i>, <i>C(−2|2|0)</i>, <i>D(−2|−2|0)</i> und die Spitze <i>S(0|0|6)</i>.<br>
        Grundkantenlänge: <i>a = 4</i>, Grundfläche: <i>G = 4² = 16</i>.<br>
        Höhe: <i>h = 6</i>.<br>
        Volumen: <i>V = <sup>1</sup>/<sub>3</sub> · G · h = <sup>1</sup>/<sub>3</sub> · 16 · 6 = 32</i> VE.
      </div>
    `,
    formulas: [
      {
        name: "Volumen einer Pyramide",
        html: "V = <sup>1</sup>/<sub>3</sub> &middot; G &middot; h",
        quantities: "G Grundflächeninhalt, h Körperhöhe",
      },
    ],
    quiz: {
      question: "Wie berechnet man den Neigungswinkel einer Dachfläche gegenüber der horizontalen Ebene am schnellsten?",
      options: [
        "Über den Schnittwinkel zwischen dem Normalenvektor der Dachfläche und dem Normalenvektor der horizontalen Grundebene (0 | 0 | 1)^T.",
        "Durch Ausmessen aller Dachkanten mit dem Satz des Pythagoras.",
        "Über das Dreifache des Skalarprodukts.",
      ],
      correctIndex: 0,
      explanation:
        "Der Neigungswinkel einer Ebene gegen die Horizontale entspricht exakt dem Winkel zwischen ihren Normalenvektoren. Der Normalenvektor der Horizontalebene ist schlicht (0|0|1)^T.",
    },
    lab: lab(
      "3d-solids",
      "Pyramide mit quadratischer Grundfläche",
      "Verändere Grundkante a und Pyramidenhöhe h.",
      [
        range("a", "Grundkante a", 2, 6, 3, 1),
        range("h", "Höhe h", 3, 9, 4, 1),
      ],
      [
        output("volumen", "Volumen V", (v) => (1 / 3) * v.a * v.a * v.h, "", 2),
      ],
      [
        {
          id: "groesse-vier-sechs",
          text: "Wähle a = 4 und h = 6 für Volumen V = 32,00.",
          check: (v) => v.a === 4 && v.h === 6,
        },
        {
          id: "hoch",
          text: "Erhöhe die Höhe auf h = 9 bei a = 3.",
          check: (v) => v.a === 3 && v.h === 9,
        },
        {
          id: "standard-pyramide",
          text: "Stelle a = 4 und h = 5 ein.",
          check: (v) => v.a === 4 && v.h === 5,
        },
      ],
    ),
    exercises: [
      {
        id: "pyramidenvolumen-sachkontext",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([6, 9, 12]);
          const h = rng.pick([4, 6, 8]);
          // V = (1/3) * a^2 * h
          const vol = (1 / 3) * a * a * h;
          return task(
            level,
            `Berechne das Volumen einer Pyramide mit quadratischer Grundfläche (Kantenlänge a = ${a}) und Höhe h = ${h}.`,
            `Ein Pavillondach hat die Form einer regelmäßigen Pyramide mit quadratischer Basis a = ${a} m und Dachhöhe h = ${h} m. Wie groß ist der umbaute Raum V in m³?`,
            [numberField("V =", vol, "m³", 0)],
            `V = (1/3) · a² · h = (1/3) · ${a * a} · ${h} = ${vol}.`,
            `V = ${vol} m³`,
            { a, h },
          );
        },
      },
      {
        id: "neigungswinkel-dach",
        make: (_rng: Rng, level: DifficultyLevel): ExerciseTask => {
          // Normalenvektor n = (0, 3, 4) -> cos(alpha) = 4 / sqrt(9+16) = 4/5 = 0.8 -> alpha approx 36.87°
          const nZ = 4;
          const lenN = 5;
          const deg = (Math.acos(nZ / lenN) * 180) / Math.PI;
          return task(
            level,
            "Eine Dachfläche hat den Normalenvektor n = (0 | 3 | 4)<sup>T</sup>. Berechne den Neigungswinkel α gegenüber der Horizontale (in Grad, auf eine Dezimale gerundet).",
            "Zur Installation einer Photovoltaikanlage wird der Neigungswinkel der Dachfläche mit Normalenvektor n = (0 | 3 | 4)<sup>T</sup> benötigt. Bestimme α in Grad.",
            [numberField("α =", deg, "°", 1)],
            "cos(α) = |n · (0|0|1)| / |n| = 4 / 5 = 0,8 &rArr; α = arccos(0,8) &approx; 36,9°.",
            `α &approx; ${fmt(deg, 1)}°`,
          );
        },
      },
    ],
  }),
];
