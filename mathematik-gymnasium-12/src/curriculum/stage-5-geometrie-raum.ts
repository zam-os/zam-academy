/**
 * Lernbereich 5: Grundlagen der Koordinatengeometrie im Raum (20 Std.)
 * 5 Lektionen zu 3D-Koordinaten, Vektoralgebra, Skalarprodukt, Vektorprodukt und Raumkörpern.
 */

import type { DifficultyLevel, ExerciseTask, Lesson } from "../model/types";
import { lab, makeLesson, output, range } from "./builders";
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
          const tripel = rng.pick([
            { dx: 1, dy: 2, dz: 2, d: 3 },
            { dx: 2, dy: 3, dz: 6, d: 7 },
            { dx: 4, dy: 4, dz: 7, d: 9 },
            { dx: 1, dy: 4, dz: 8, d: 9 },
            { dx: 2, dy: 6, dz: 9, d: 11 },
            { dx: 6, dy: 6, dz: 7, d: 11 },
          ]);
          if (level === 1) {
            return {
              prompt: `Berechne den Abstand d des Punktes Q(${tripel.dx}|${tripel.dy}|${tripel.dz}) vom Koordinatenursprung P(0|0|0).`,
              given: [`P(0|0|0)`, `Q(${tripel.dx}|${tripel.dy}|${tripel.dz})`],
              fields: [numberField("d =", tripel.d, "", 0)],
              formulaHint: `Raumabstand: d = √(x² + y² + z²).`,
              feedbackHint: `Berechne √(${tripel.dx}² + ${tripel.dy}² + ${tripel.dz}²).`,
              steps: [
                `d = &radic;(${tripel.dx}² + ${tripel.dy}² + ${tripel.dz}²) = &radic;(${tripel.dx * tripel.dx + tripel.dy * tripel.dy + tripel.dz * tripel.dz}) = ${tripel.d}.`,
                `<strong>d = ${tripel.d}</strong>`,
              ],
              meta: { dx: tripel.dx, dy: tripel.dy, dz: tripel.dz, d: tripel.d },
            };
          }
          const px = rng.pick([1, 2, 3]);
          const py = rng.pick([1, 2]);
          const pz = rng.pick([2, 4]);
          const qx = px + tripel.dx;
          const qy = py + tripel.dy;
          const qz = pz + tripel.dz;
          return {
            prompt: `Ein Industrieroboter bewegt sein Werkzeug geradlinig vom Startpunkt P(${px}|${py}|${pz}) zum Zielpunkt Q(${qx}|${qy}|${qz}) (Koordinaten in dm). Welche Wegstrecke d legt der Greifarm zurück?`,
            given: [`P(${px}|${py}|${pz})`, `Q(${qx}|${qy}|${qz})`],
            fields: [numberField("d =", tripel.d, "dm", 0)],
            feedbackHint: `Differenzen der Koordinaten bilden: Δx = ${tripel.dx}, Δy = ${tripel.dy}, Δz = ${tripel.dz}. Dann Pythagoras im Raum.`,
            steps: [
              `Δx = ${qx} − ${px} = ${tripel.dx}, Δy = ${qy} − ${py} = ${tripel.dy}, Δz = ${qz} − ${pz} = ${tripel.dz}.`,
              `d = &radic;(${tripel.dx}² + ${tripel.dy}² + ${tripel.dz}²) = &radic;${tripel.d * tripel.d} = ${tripel.d} dm.`,
              `<strong>d = ${tripel.d} dm</strong>`,
            ],
            meta: { px, py, pz, qx, qy, qz, d: tripel.d },
          };
        },
      },
      {
        id: "spiegelung-ebene",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const px = rng.pick([2, 3, 5]);
          const py = rng.pick([1, 4, 6]);
          const pz = rng.pick([3, 5, 8]);
          if (level === 1) {
            return {
              prompt: `Der Punkt P(${px}|${py}|${pz}) wird an der x₁x₂-Ebene gespiegelt. Welche x₃-Koordinate hat der Bildpunkt P'?`,
              given: [`P(${px}|${py}|${pz})`, `Spiegelebene: x₁x₂-Ebene (x₃ = 0)`],
              fields: [numberField("x₃' =", -pz, "", 0)],
              formulaHint: "Spiegelung an der x₁x₂-Ebene wechselt nur das Vorzeichen von x₃.",
              feedbackHint: `x₃' = −(${pz}) = ${fmt(-pz, 0)}.`,
              steps: [
                `Spiegelung an x₁x₂-Ebene: (x₁|x₂|x₃) &rarr; (x₁|x₂|−x₃).`,
                `<strong>x₃' = ${fmt(-pz, 0)}</strong>`,
              ],
              meta: { px, py, pz, res: -pz },
            };
          }
          const mode = rng.pick(["x1x3", "x2x3"]);
          const isX1X3 = mode === "x1x3";
          const res = isX1X3 ? -py : -px;
          const plane = isX1X3 ? "x₁x₃-Ebene" : "x₂x₃-Ebene";
          const coordName = isX1X3 ? "x₂'" : "x₁'";
          return {
            prompt: `Ein Lasersignal von Quelle S(${px}|${py}|${pz}) wird an der ${plane} reflektiert. Bestimme die ${coordName}-Koordinate des virtuellen Spiegelpunkts S'.`,
            given: [`S(${px}|${py}|${pz})`, `Reflexion an ${plane}`],
            fields: [numberField(`${coordName} =`, res, "", 0)],
            feedbackHint: isX1X3 ? "Bei der x₁x₃-Ebene wechselt nur x₂ das Vorzeichen." : "Bei der x₂x₃-Ebene wechselt nur x₁ das Vorzeichen.",
            steps: [
              `Bei der Spiegelung an der ${plane} kehrt genau die Senkrechtenkoordinate ihr Vorzeichen um: ${coordName} = ${fmt(res, 0)}.`,
              `<strong>${coordName} = ${fmt(res, 0)}</strong>`,
            ],
            meta: { px, py, pz, res },
          };
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
          const r = rng.pick([2, 3, 4]);
          const a1 = rng.pick([1, 2, 3]);
          const b1 = rng.pick([2, 4, 5]);
          const res1 = r * a1 + b1;
          if (level === 1) {
            return {
              prompt: `Berechne die 1. Komponente des Vektors c = ${r}·a + b für a = (${a1}|2|3)<sup>T</sup> und b = (${b1}|0|−1)<sup>T</sup>.`,
              given: [`a = (${a1}|2|3)ᵀ`, `b = (${b1}|0|−1)ᵀ`, `c = ${r}·a + b`],
              fields: [numberField("c₁ =", res1, "", 0)],
              formulaHint: `Rechne komponentenweise: c₁ = ${r} · a₁ + b₁.`,
              feedbackHint: `c₁ = ${r} · ${a1} + ${b1} = ${res1}.`,
              steps: [
                `c₁ = ${r} · ${a1} + ${b1} = ${r * a1} + ${b1} = ${res1}.`,
                `<strong>c₁ = ${res1}</strong>`,
              ],
              meta: { r, a1, b1, res1 },
            };
          }
          const s = rng.pick([2, 3]);
          const res2 = r * a1 - s * b1;
          return {
            prompt: `Zwei Zugkräfte überlagern sich zu F = ${r}·F₁ − ${s}·F₂ mit F₁ = (${a1}|5|2)<sup>T</sup> kN und F₂ = (${b1}|1|−2)<sup>T</sup> kN. Wie groß ist die x₁-Komponente der Gesamtkraft in kN?`,
            given: [`F₁ = (${a1}|5|2)ᵀ kN`, `F₂ = (${b1}|1|−2)ᵀ kN`, `F = ${r}·F₁ − ${s}·F₂`],
            fields: [numberField("F₁ =", res2, "kN", 0)],
            feedbackHint: `Berechne ${r}·(${a1}) − ${s}·(${b1}).`,
            steps: [
              `F₁ = ${r} · ${a1} − ${s} · ${b1} = ${r * a1} − ${s * b1} = ${fmt(res2, 0)} kN.`,
              `<strong>F₁ = ${fmt(res2, 0)} kN</strong>`,
            ],
            meta: { r, s, a1, b1, res2 },
          };
        },
      },
      {
        id: "verbindungsvektor",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const xA = rng.pick([1, 2, 3]);
          const yA = rng.pick([2, 4]);
          const xB = rng.pick([6, 7, 9]);
          const yB = rng.pick([7, 8]);
          const dx = xB - xA;
          const dy = yB - yA;
          if (level === 1) {
            return {
              prompt: `Bestimme die 1. Komponente des Verbindungsvektors AB von A(${xA}|${yA}|1) nach B(${xB}|${yB}|4).`,
              given: [`A(${xA}|${yA}|1)`, `B(${xB}|${yB}|4)`],
              fields: [numberField("Δx₁ =", dx, "", 0)],
              formulaHint: `Spitze minus Fuß: AB = B − A.`,
              feedbackHint: `Subtrahiere die x₁-Koordinate von A von der von B: ${xB} − ${xA}.`,
              steps: [
                `AB = B − A &rArr; Δx₁ = ${xB} − ${xA} = ${dx}.`,
                `<strong>Δx₁ = ${dx}</strong>`,
              ],
              meta: { xA, xB, dx },
            };
          }
          return {
            prompt: `Ein Vermessungsdrohnenflug startet bei A(${xA}|${yA}|10) m und landet bei B(${xB}|${yB}|40) m. Wie lautet die Verschiebung in x₂-Richtung (Δx₂)?`,
            given: [`Start A(${xA}|${yA}|10) m`, `Ziel B(${xB}|${yB}|40) m`],
            fields: [numberField("Δx₂ =", dy, "m", 0)],
            feedbackHint: `Berechne y_B − y_A = ${yB} − ${yA}.`,
            steps: [
              `Δx₂ = ${yB} − ${yA} = ${dy} m.`,
              `<strong>Δx₂ = ${dy} m</strong>`,
            ],
            meta: { yA, yB, dy },
          };
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
          const a2 = rng.pick([1, 2]);
          const a3 = rng.pick([1, 2]);
          const b1 = 3;
          const b2 = 4;
          const b3 = rng.pick([1, 2]);
          const dot = a1 * b1 + a2 * b2 + a3 * b3;
          if (level === 1) {
            return {
              prompt: `Berechne das Skalarprodukt a · b für a = (${a1}|${a2}|${a3})<sup>T</sup> und b = (${b1}|${b2}|${b3})<sup>T</sup>.`,
              given: [`a = (${a1}|${a2}|${a3})ᵀ`, `b = (${b1}|${b2}|${b3})ᵀ`],
              fields: [numberField("a · b =", dot, "", 0)],
              formulaHint: `a · b = a₁b₁ + a₂b₂ + a₃b₃.`,
              feedbackHint: `Multipliziere die Komponenten paarweise: ${a1}·${b1} + ${a2}·${b2} + ${a3}·${b3}.`,
              steps: [
                `a · b = ${a1}·${b1} + ${a2}·${b2} + ${a3}·${b3} = ${a1 * b1} + ${a2 * b2} + ${a3 * b3} = ${fmt(dot, 0)}.`,
                `<strong>a · b = ${fmt(dot, 0)}</strong>`,
              ],
              meta: { a1, a2, a3, b1, b2, b3, dot },
            };
          }
          return {
            prompt: `Eine konstante Zugkraft F = (${a1}|${a2}|${a3})<sup>T</sup> N verschiebt eine Lore um den Vektor s = (${b1}|${b2}|${b3})<sup>T</sup> m. Berechne die verrichtete mechanische Arbeit W = F · s in Joule (J).`,
            given: [`Kraftvektor F = (${a1}|${a2}|${a3})ᵀ N`, `Wegvektor s = (${b1}|${b2}|${b3})ᵀ m`],
            fields: [numberField("W =", dot, "J", 0)],
            feedbackHint: "Die mechanische Arbeit entspricht dem Skalarprodukt aus Kraft und Weg: W = F · s.",
            steps: [
              `W = F · s = ${a1}·${b1} + ${a2}·${b2} + ${a3}·${b3} = ${fmt(dot, 0)} J.`,
              `<strong>W = ${fmt(dot, 0)} J</strong>`,
            ],
            meta: { a1, dot },
          };
        },
      },
      {
        id: "orthogonal-parameter",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const item = rng.pick([
            { a: ["2", "k", "4"], b: ["4", "−2", "−1"], k: 2, eq: "8 − 2k − 4 = 0 &rArr; 2k = 4" },
            { a: ["3", "k", "2"], b: ["2", "−1", "−4"], k: -2, eq: "6 − k − 8 = 0 &rArr; −k − 2 = 0" },
            { a: ["1", "k", "3"], b: ["5", "−2", "1"], k: 4, eq: "5 − 2k + 3 = 0 &rArr; 2k = 8" },
            { a: ["4", "k", "1"], b: ["2", "−3", "1"], k: 3, eq: "8 − 3k + 1 = 0 &rArr; 3k = 9" },
          ]);
          if (level === 1) {
            return {
              prompt: `Für welchen Wert von k stehen die Vektoren a = (${item.a[0]}|k|${item.a[2]})<sup>T</sup> und b = (${item.b[0]}|${item.b[1]}|${item.b[2]})<sup>T</sup> orthogonal aufeinander?`,
              given: [`a = (${item.a[0]}|k|${item.a[2]})ᵀ`, `b = (${item.b[0]}|${item.b[1]}|${item.b[2]})ᵀ`, `Bedingung: a ⊥ b`],
              fields: [numberField("k =", item.k, "", 0)],
              formulaHint: "Orthogonalitätsbedingung: a · b = 0.",
              feedbackHint: `Setze das Skalarprodukt gleich 0 und löse nach k auf.`,
              steps: [
                `a · b = ${item.a[0]}·${item.b[0]} + k·(${item.b[1]}) + ${item.a[2]}·(${item.b[2]}) = 0.`,
                `${item.eq} &rArr; k = ${fmt(item.k, 0)}.`,
                `<strong>k = ${fmt(item.k, 0)}</strong>`,
              ],
              meta: { k: item.k },
            };
          }
          return {
            prompt: `Zwei Trägerbalken einer Dachkonstruktion sollen exakt im rechten Winkel aufeinandertreffen. Die Richtungsvektoren lauten v₁ = (${item.a[0]}|k|${item.a[2]})<sup>T</sup> und v₂ = (${item.b[0]}|${item.b[1]}|${item.b[2]})<sup>T</sup>. Bestimme den Konstruktionsparameter k.`,
            given: [`v₁ = (${item.a[0]}|k|${item.a[2]})ᵀ`, `v₂ = (${item.b[0]}|${item.b[1]}|${item.b[2]})ᵀ`, `Rechter Winkel: v₁ · v₂ = 0`],
            fields: [numberField("k =", item.k, "", 0)],
            feedbackHint: "Rechter Winkel erfordert ein verschwindendes Skalarprodukt v₁ · v₂ = 0.",
            steps: [
              `v₁ · v₂ = 0 liefert ${item.eq} &rArr; k = ${fmt(item.k, 0)}.`,
              `<strong>k = ${fmt(item.k, 0)}</strong>`,
            ],
            meta: { k: item.k },
          };
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
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const u = rng.pick([1, 2]);
          const v = rng.pick([2, 3]);
          const y = rng.pick([1, 3]);
          const z = rng.pick([2, 4]);
          // a = (u, v, 0), b = (0, y, z)
          // a x b = (v*z - 0*y | 0*0 - u*z | u*y - v*0) = (v*z | -u*z | u*y)
          const n1 = v * z;
          if (level === 1) {
            return {
              prompt: `Berechne das Kreuzprodukt n = a × b für a = (${u}|${v}|0)<sup>T</sup> und b = (0|${y}|${z})<sup>T</sup>. Wie lautet die 1. Komponente n₁?`,
              given: [`a = (${u}|${v}|0)ᵀ`, `b = (0|${y}|${z})ᵀ`],
              fields: [numberField("n₁ =", n1, "", 0)],
              formulaHint: `Kreuzprodukt: n₁ = a₂·b₃ − a₃·b₂.`,
              feedbackHint: `n₁ = ${v}·${z} − 0·${y} = ${n1}.`,
              steps: [
                `n₁ = a₂b₃ − a₃b₂ = ${v} · ${z} − 0 · ${y} = ${n1}.`,
                `<strong>n₁ = ${n1}</strong>`,
              ],
              meta: { u, v, y, z, n1 },
            };
          }
          const n3 = u * y;
          return {
            prompt: `Zwei Richtungsvektoren einer PV-Aufständerung lauten v₁ = (${u}|${v}|0)<sup>T</sup> und v₂ = (0|${y}|${z})<sup>T</sup>. Bestimme die 3. Komponente n₃ des Normalenvektors n = v₁ × v₂.`,
            given: [`v₁ = (${u}|${v}|0)ᵀ`, `v₂ = (0|${y}|${z})ᵀ`],
            fields: [numberField("n₃ =", n3, "", 0)],
            feedbackHint: `n₃ = a₁·b₂ − a₂·b₁ = ${u}·${y} − ${v}·0.`,
            steps: [
              `n₃ = ${u} · ${y} − ${v} · 0 = ${n3}.`,
              `<strong>n₃ = ${n3}</strong>`,
            ],
            meta: { u, v, y, z, n3 },
          };
        },
      },
      {
        id: "dreiecksflaeche-vektor",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const a = rng.pick([4, 6, 8, 10]);
          const b = rng.pick([3, 5, 7]);
          const area = 0.5 * a * b;
          if (level === 1) {
            return {
              prompt: `Berechne den Flächeninhalt des Dreiecks aufgespannt von a = (${a}|0|0)<sup>T</sup> und b = (0|${b}|0)<sup>T</sup>.`,
              given: [`a = (${a}|0|0)ᵀ`, `b = (0|${b}|0)ᵀ`],
              fields: [numberField("A =", area, "", 1)],
              formulaHint: `A = 0,5 · |a × b|.`,
              feedbackHint: `Da die Vektoren orthogonal aufeinander stehen, ist |a × b| = ${a} · ${b}.`,
              steps: [
                `a × b = (0 | 0 | ${a * b})ᵀ &rArr; |a × b| = ${a * b}.`,
                `A = 0,5 · ${a * b} = ${fmt(area, 1)}.`,
                `<strong>A = ${fmt(area, 1)}</strong>`,
              ],
              meta: { a, b, area },
            };
          }
          return {
            prompt: `Ein dreieckiges Sonnensegel wird zwischen den Befestigungspunkten aufgespannt durch u = (${a}|0|0)<sup>T</sup> m und v = (0|${b}|0)<sup>T</sup> m. Bestimme den Materialbedarf (Flächeninhalt A) in m².`,
            given: [`Kantenvektoren u = (${a}|0|0)ᵀ m und v = (0|${b}|0)ᵀ m`],
            fields: [numberField("A =", area, "m²", 1)],
            feedbackHint: "Fläche eines Dreiecks im Raum: A = 1/2 · |u × v|.",
            steps: [
              `A = 0,5 · |u × v| = 0,5 · (${a} · ${b}) = ${fmt(area, 1)} m².`,
              `<strong>A = ${fmt(area, 1)} m²</strong>`,
            ],
            meta: { a, b, area },
          };
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
          const a = rng.pick([6, 9, 12, 15]);
          const h = rng.pick([4, 6, 8, 10]);
          const vol = (1 / 3) * a * a * h;
          if (level === 1) {
            return {
              prompt: `Berechne das Volumen V einer Pyramide mit quadratischer Grundfläche (Kantenlänge a = ${a}) und Höhe h = ${h}.`,
              given: [`Quadratische Grundkante a = ${a}`, `Körperhöhe h = ${h}`],
              fields: [numberField("V =", vol, "", 0)],
              formulaHint: `Pyramidenvolumen: V = 1/3 · a² · h.`,
              feedbackHint: `Grundfläche G = ${a}² = ${a * a}. V = 1/3 · ${a * a} · ${h}.`,
              steps: [
                `V = (1/3) · ${a}² · ${h} = (1/3) · ${a * a} · ${h} = ${vol}.`,
                `<strong>V = ${vol}</strong>`,
              ],
              meta: { a, h, vol },
            };
          }
          return {
            prompt: `Ein Pavillondach hat die Form einer regelmäßigen Pyramide mit quadratischer Basis (Kantenlänge a = ${a} m) und Dachhöhe h = ${h} m. Wie groß ist der umbaute Raum (Volumen V) in m³?`,
            given: [`Basis a = ${a} m`, `Dachhöhe h = ${h} m`],
            fields: [numberField("V =", vol, "m³", 0)],
            feedbackHint: "V = 1/3 · G · h mit G = a².",
            steps: [
              `V = (1/3) · ${a}² · ${h} = ${vol} m³.`,
              `<strong>V = ${vol} m³</strong>`,
            ],
            meta: { a, h, vol },
          };
        },
      },
      {
        id: "neigungswinkel-dach",
        make: (rng: Rng, level: DifficultyLevel): ExerciseTask => {
          const roof = rng.pick([
            { y: 3, z: 4, len: 5, deg: (Math.acos(4 / 5) * 180) / Math.PI },
            { y: 4, z: 3, len: 5, deg: (Math.acos(3 / 5) * 180) / Math.PI },
            { y: 5, z: 12, len: 13, deg: (Math.acos(12 / 13) * 180) / Math.PI },
            { y: 12, z: 5, len: 13, deg: (Math.acos(5 / 13) * 180) / Math.PI },
          ]);
          if (level === 1) {
            return {
              prompt: `Eine Dachfläche hat den Normalenvektor n = (0 | ${roof.y} | ${roof.z})<sup>T</sup>. Berechne den Neigungswinkel α gegenüber der horizontalen Ebene (in Grad, auf eine Dezimale gerundet).`,
              given: [`Normalenvektor n = (0 | ${roof.y} | ${roof.z})ᵀ`, `Horizontalvektor n₀ = (0|0|1)ᵀ`],
              fields: [numberField("α =", roof.deg, "°", 1)],
              formulaHint: `cos(α) = |n · (0|0|1)| / |n| = ${roof.z} / ${roof.len}.`,
              feedbackHint: `cos(α) = ${roof.z} / ${roof.len}. Bilde arccos(${fmt(roof.z / roof.len, 3)}).`,
              steps: [
                `|n| = &radic;(0² + ${roof.y}² + ${roof.z}²) = ${roof.len}.`,
                `cos(α) = ${roof.z} / ${roof.len} = ${fmt(roof.z / roof.len, 3)} &rArr; α = arccos(${fmt(roof.z / roof.len, 3)}) &approx; ${fmt(roof.deg, 1)}°.`,
                `<strong>α = ${fmt(roof.deg, 1)}°</strong>`,
              ],
              meta: { y: roof.y, z: roof.z, len: roof.len, deg: roof.deg },
            };
          }
          return {
            prompt: `Für die Montage von Photovoltaikmodulen muss die Dachneigung α ermittelt werden. Die Dachfläche wird durch den Normalenvektor n = (0 | ${roof.y} | ${roof.z})<sup>T</sup> beschrieben. Bestimme den Neigungswinkel α in Grad (auf eine Dezimalstelle gerundet).`,
            given: [`Normalenvektor n = (0 | ${roof.y} | ${roof.z})ᵀ`],
            fields: [numberField("α =", roof.deg, "°", 1)],
            feedbackHint: "Der Neigungswinkel gegenüber der Horizontale entspricht dem Winkel des Normalenvektors zur z-Achse.",
            steps: [
              `cos(α) = |n · (0|0|1)| / |n| = ${roof.z} / ${roof.len} &rArr; α &approx; ${fmt(roof.deg, 1)}°.`,
              `<strong>α = ${fmt(roof.deg, 1)}°</strong>`,
            ],
            meta: { y: roof.y, z: roof.z, len: roof.len, deg: roof.deg },
          };
        },
      },
    ],
  }),
];
