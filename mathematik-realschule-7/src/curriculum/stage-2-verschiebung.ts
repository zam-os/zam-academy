import type { ExerciseTask } from "../model/types";
import { fmt, point } from "../exercises/format";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  output as o,
  makeLesson as lesson,
  makeStage,
} from "./builders";

const L = (step: number, content: Parameters<typeof lesson>[3]) =>
  lesson(2, step, [2, 2], content);
const translationParams = [
  r("x", "x von P", -4, 4, -2),
  r("y", "y von P", -4, 4, 1),
  r("u", "Vektor: x-Anteil", -6, 6, 1),
  r("v", "Vektor: y-Anteil", -6, 6, 2),
];
const translationReadouts = [
  o("image", "Bildpunkt P′", (v) => point(v.x + v.u, v.y + v.v)),
  o("inverse", "Gegenvektor", (v) => point(-v.u, -v.v)),
];

const verschiebung = L(1, {
  id: "pv-1-verschiebung",
  title: "2.1 Figuren parallel verschieben",
  subtitle: "Alle Punkte erhalten denselben Verschiebungspfeil",
  whyItMatters:
    "Eine Form auf einem Plan zu versetzen darf ihre Größe und Orientierung nicht verändern. Dafür braucht jeder Punkt denselben Pfeil.",
  explanationHtml: `<p>Eine <strong>Parallelverschiebung</strong> bildet jeden Punkt P auf einen Bildpunkt P′ ab. Die Pfeile von P nach P′ sind parallel, gleich lang und gleich gerichtet. Ein Verschiebungsvektor (u | v) sagt: u Einheiten waagrecht, v Einheiten senkrecht. Negative Werte bedeuten links bzw. unten.</p><p>Die Abbildung ist eine Kongruenzabbildung: Streckenlängen, Winkel, Geraden und der Umlaufsinn bleiben erhalten. Sie spiegelt die Figur nicht. Bei dem Nullvektor bleibt jeder Punkt an seinem Platz.</p><div class="example">A(−2 | 1), B(1 | 1), C(−1 | 3) werden um (3 | −1) verschoben. Es entstehen A′(1 | 0), B′(4 | 0), C′(2 | 2). Die Seite AB und ihre Bildseite sind beide 3 LE lang.</div><div class="merke"><strong>Merke:</strong> P′(x + u | y + v). Verschiebe bei einer Figur jeden Eckpunkt gleich. Zeichne anschließend die Bildstrecken.</div>`,
  formulas: [
    {
      name: "Verschiebung",
      html: "P(x | y) → P′(x + u | y + v)",
      quantities: "Vektor (u | v); LE sind Längeneinheiten",
    },
    {
      name: "Erhaltene Eigenschaften",
      html: "Länge, Winkel, Geraden, Umlaufsinn",
      quantities: "Kongruenzabbildung",
    },
  ],
  quiz: {
    question: "Was passiert mit dem Umlaufsinn bei einer Parallelverschiebung?",
    options: [
      "Er bleibt erhalten.",
      "Er kehrt sich um.",
      "Er hängt von der Pfeillänge ab.",
    ],
    correctIndex: 0,
    explanation:
      "Alle Punkte bewegen sich gleich; es findet keine Spiegelung statt.",
  },
  lab: lab(
    "translation",
    "Dreieck verschieben",
    "Ziehe P oder seinen Bildpunkt P′. Der Bildpunkt verändert den Verschiebungsvektor; die ganze Bildfigur folgt demselben Pfeil.",
    translationParams,
    translationReadouts,
    [
      {
        id: "rechts",
        text: "Verschiebe die Figur um (3 | −1).",
        check: (v) => v.u === 3 && v.v === -1,
      },
      {
        id: "links",
        text: "Verschiebe die Figur um (−2 | 2).",
        check: (v) => v.u === -2 && v.v === 2,
      },
      {
        id: "identisch",
        text: "Bringe Original und Bild zur Deckung, ohne die Originalfigur zu ändern.",
        check: (v) => v.u === 0 && v.v === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "bildpunkt",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-4, 4),
          y = rng.int(-4, 4),
          u = rng.int(-5, 5),
          v = rng.int(-5, 5);
        return {
          prompt:
            level === 1
              ? `Verschiebe P${point(x, y)} um den Vektor ${point(u, v)}. Berechne P′.`
              : `Auf einem Plan wird ein Dreieck um ${point(u, v)} verschoben. Sein Eckpunkt A liegt bei ${point(x, y)}, B liegt 3 LE rechts von A. Berechne A′ und B′.`,
          given: [`P bzw. A${point(x, y)}`, `Vektor ${point(u, v)}`],
          ...(level === 1
            ? {
                formulaHint:
                  "Zu beiden Koordinaten den zugehörigen Vektoranteil addieren.",
              }
            : {}),
          fields: [
            num("x′ =", x + u, "", 0),
            num("y′ =", y + v, "", 0),
            ...(level === 2
              ? [
                  num("x von B′ =", x + 3 + u, "", 0),
                  num("y von B′ =", y + v, "", 0),
                ]
              : []),
          ],
          steps: [
            `Waagrecht: ${fmt(x)} + (${fmt(u)}) = ${fmt(x + u)}; senkrecht entsprechend.`,
            `<strong>P′ bzw. A′${point(x + u, y + v)}${level === 2 ? `, B′${point(x + 3 + u, y + v)}` : ""}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
    {
      id: "urpunkt",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-3, 3),
          y = rng.int(-3, 3),
          u = rng.int(1, 5),
          v = rng.int(-4, 4);
        return {
          prompt:
            level === 1
              ? `P′${point(x + u, y + v)} ist das Bild von P bei der Verschiebung um ${point(u, v)}. Bestimme P.`
              : `Ein Lageplan zeigt nach einer Verschiebung den Punkt P′${point(x + u, y + v)}. Die Verschiebung ging ${u} LE nach rechts und ${Math.abs(v)} LE ${v < 0 ? "nach unten" : "nach oben"}. Bestimme den ursprünglichen Punkt und den x-Anteil des Rückwegs.`,
          given: [`Bildpunkt ${point(x + u, y + v)}`],
          ...(level === 1
            ? {
                formulaHint:
                  "Rückweg: die Vektoranteile vom Bildpunkt abziehen.",
              }
            : {}),
          fields: [
            num("x =", x, "", 0),
            num("y =", y, "", 0),
            ...(level === 2 ? [num("Rückweg: x-Anteil =", -u, "", 0)] : []),
          ],
          steps: [
            `P = P′ − ${point(u, v)}.`,
            `<strong>P${point(x, y)}; Gegenvektor ${point(-u, -v)}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
  ],
});

const vektoren = L(2, {
  id: "pv-2-vektoren",
  title: "2.2 Verbindungsvektor und Gegenvektor",
  subtitle: "Spitze minus Schaft, zurück mit dem Gegenvektor",
  whyItMatters:
    "Mit Koordinaten kannst du einen Weg beschreiben, auch wenn er nicht auf dem Blatt eingezeichnet ist. Für den Rückweg brauchst du dieselbe Länge in Gegenrichtung.",
  explanationHtml: `<p>Der Verbindungsvektor von A nach B hat die Koordinaten <strong>(x<sub>B</sub> − x<sub>A</sub> | y<sub>B</sub> − y<sub>A</sub>)</strong>. Du berechnest die Änderung in jeder Richtung: Spitze minus Schaft. Parallelverschiebungspfeile können an verschiedenen Punkten beginnen und trotzdem denselben Vektor darstellen.</p><p>Der Gegenvektor kehrt beide Vorzeichen um. Verschiebung und Umkehrverschiebung heben sich auf.</p><div class="example">A(−2 | 3), B(4 | −1): AB = (4 − (−2) | −1 − 3) = (6 | −4). Der Rückweg BA = (−6 | 4). Prüfe: (4 | −1) + (−6 | 4) = (−2 | 3).</div><div class="merke"><strong>Merke:</strong> Ein Vektor ist kein Ortsname. Gleicher Vektor bedeutet gleiche Verschiebung; der Gegenvektor vertauscht Start und Ziel.</div>`,
  formulas: [
    {
      name: "Verbindungsvektor",
      html: "AB = (x<sub>B</sub> − x<sub>A</sub> | y<sub>B</sub> − y<sub>A</sub>)",
      quantities: "A Start, B Ziel",
    },
    {
      name: "Gegenvektor",
      html: "−(u | v) = (−u | −v)",
      quantities: "gleiche Länge, entgegengesetzte Richtung",
    },
  ],
  quiz: {
    question: "Wie lautet der Gegenvektor zu (3 | −2)?",
    options: ["(−3 | 2)", "(−2 | 3)", "(3 | 2)"],
    correctIndex: 0,
    explanation:
      "Beide Koordinaten wechseln ihr Vorzeichen; die Reihenfolge bleibt erhalten.",
  },
  lab: lab(
    "translation",
    "Wege und Rückwege",
    "Ziehe Startpunkt und Bildpunkt. Lies die Änderung in beiden Koordinaten ab und finde den Rückweg.",
    translationParams,
    translationReadouts,
    [
      {
        id: "beispiel",
        text: "Stelle A(−2 | 3) und B(4 | −1) ein.",
        check: (v) =>
          v.x === -2 && v.y === 3 && v.x + v.u === 4 && v.y + v.v === -1,
      },
      {
        id: "gegen",
        text: "Stelle den Vektor (−3 | −2) ein. Welcher Gegenvektor führt zurück?",
        check: (v) => v.u === -3 && v.v === -2,
      },
      {
        id: "senkrecht",
        text: "Erzeuge einen rein senkrechten Weg 4 LE nach oben.",
        check: (v) => v.u === 0 && v.v === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "vektor",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-5, 5),
          y = rng.int(-5, 5),
          u = rng.int(-5, 5),
          v = rng.int(-5, 5);
        return {
          prompt:
            level === 1
              ? `Berechne den Vektor von A${point(x, y)} nach B${point(x + u, y + v)}.`
              : `Ein Roboter fährt von A${point(x, y)} zu B${point(x + u, y + v)}. Gib Hin- und Rückvektor an.`,
          given: [`A${point(x, y)}`, `B${point(x + u, y + v)}`],
          ...(level === 1
            ? {
                formulaHint:
                  "Spitze minus Schaft, für jede Koordinate einzeln.",
              }
            : {}),
          fields: [
            num("Hinweg: x-Anteil =", u, "", 0),
            num("Hinweg: y-Anteil =", v, "", 0),
            ...(level === 2
              ? [
                  num("Rückweg: x-Anteil =", -u, "", 0),
                  num("Rückweg: y-Anteil =", -v, "", 0),
                ]
              : []),
          ],
          steps: [
            `AB = (${fmt(x + u)} − (${fmt(x)}) | ${fmt(y + v)} − (${fmt(y)})).`,
            `<strong>AB${point(u, v)}; BA${point(-u, -v)}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
    {
      id: "unbekannter-punkt",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-4, 4),
          y = rng.int(-4, 4),
          u = rng.int(-4, 4),
          v = rng.int(-4, 4);
        return {
          prompt:
            level === 1
              ? `Der Vektor AB ist ${point(u, v)} und B${point(x + u, y + v)} ist bekannt. Berechne A.`
              : `Die Wege A → B und C → D haben denselben Vektor. A${point(x, y)}, B${point(x + u, y + v)} und C${point(x + 2, y - 1)} sind bekannt. Berechne D.`,
          given: ["Gleicher Vektor: gleiche Koordinatenänderung"],
          ...(level === 1 ? { formulaHint: "A = B − AB" } : {}),
          fields: [
            num("x =", level === 1 ? x : x + 2 + u, "", 0),
            num("y =", level === 1 ? y : y - 1 + v, "", 0),
          ],
          steps: [
            `Der gemeinsame Vektor ist ${point(u, v)}.`,
            `<strong>${level === 1 ? `A${point(x, y)}` : `D${point(x + 2 + u, y - 1 + v)}`}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
  ],
});

const addition = L(3, {
  id: "pv-3-vektoraddition",
  title: "2.3 Vektoren addieren",
  subtitle: "Zwei Wege hintereinander, ein Gesamtweg",
  tracks: ["I"],
  whyItMatters:
    "Die Reihenfolge einzelner Wege lässt sich zeichnen und mit Koordinaten prüfen. Die Summe beschreibt direkt den Weg vom ersten Start zum letzten Ziel.",
  explanationHtml: `<p>Für die Summe zweier Vektoren setzt du den Anfang des zweiten Pfeils an die Spitze des ersten. Der Summenvektor verbindet den ursprünglichen Anfang mit dem letzten Ende. Rechnerisch addierst du die Koordinaten paarweise.</p><div class="example">(3 | 1) + (−1 | 2) = (2 | 3). Vom Ursprung gehst du zuerst 3 nach rechts und 1 nach oben, danach 1 nach links und 2 nach oben. Der Endpunkt ist (2 | 3). Vertauscht du beide Wege, bleibt der Endpunkt gleich.</div><p>Ein Vektor und sein Gegenvektor ergeben den Nullvektor. Die Parallelogrammregel zeigt dieselbe Summe als Diagonale eines Parallelogramms.</p><div class="merke"><strong>Merke:</strong> (u | v) + (p | q) = (u + p | v + q). Die Summe hängt nicht von der Reihenfolge ab.</div>`,
  formulas: [
    {
      name: "Vektoraddition",
      html: "(u | v) + (p | q) = (u + p | v + q)",
      quantities: "Koordinaten paarweise",
    },
    { name: "Rückweg", html: "v + (−v) = (0 | 0)", quantities: "Nullvektor" },
  ],
  quiz: {
    question: "Welcher Summenvektor entsteht aus (3 | 1) und (−1 | 2)?",
    options: ["(2 | 3)", "(4 | −1)", "(−3 | 2)"],
    correctIndex: 0,
    explanation: "Waagrecht 3 − 1 = 2, senkrecht 1 + 2 = 3.",
  },
  lab: lab(
    "vector-addition",
    "Pfeile aneinanderlegen",
    "Ziehe die Endpunkte beider Pfeile. Vergleiche den Gesamtweg mit der Diagonale des Parallelogramms.",
    [
      r("u", "erster Vektor x", -4, 4, 1),
      r("v", "erster Vektor y", -4, 4, 2),
      r("p", "zweiter Vektor x", -4, 4, 2),
      r("q", "zweiter Vektor y", -4, 4, 1),
    ],
    [o("sum", "Summe", (v) => point(v.u + v.p, v.v + v.q))],
    [
      {
        id: "ziel",
        text: "Erzeuge die Summe (4 | 0) aus zwei Pfeilen mit verschiedenen Richtungen.",
        check: (v) => v.u + v.p === 4 && v.v + v.q === 0 && v.v !== 0,
      },
      {
        id: "null",
        text: "Hebe einen von null verschiedenen ersten Pfeil durch den zweiten auf.",
        check: (v) =>
          v.u + v.p === 0 && v.v + v.q === 0 && (v.u !== 0 || v.v !== 0),
      },
      {
        id: "beispiel",
        text: "Stelle (3 | 1) + (−1 | 2) ein.",
        check: (v) => v.u === 3 && v.v === 1 && v.p === -1 && v.q === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "summe",
      make: (rng, level): ExerciseTask => {
        const u = rng.int(-4, 4),
          v = rng.int(-4, 4),
          p = rng.int(-4, 4),
          q = rng.int(-4, 4);
        return {
          prompt:
            level === 1
              ? `Addiere die Vektoren ${point(u, v)} und ${point(p, q)}.`
              : `Ein Roboter startet bei (2 | −1) und fährt zuerst ${point(u, v)}, dann ${point(p, q)}. Berechne seinen Endpunkt.`,
          given: ["Wege werden hintereinander ausgeführt"],
          ...(level === 1
            ? {
                formulaHint:
                  "Die x-Anteile und die y-Anteile jeweils addieren.",
              }
            : {}),
          fields: [
            num("x =", u + p + (level === 2 ? 2 : 0), "", 0),
            num("y =", v + q - (level === 2 ? 1 : 0), "", 0),
          ],
          steps: [
            `Summenvektor ${point(u + p, v + q)}.`,
            `<strong>${level === 1 ? "Summe" : "Endpunkt"} ${point(u + p + (level === 2 ? 2 : 0), v + q - (level === 2 ? 1 : 0))}</strong>`,
          ],
          meta: { u, v, p, q },
        };
      },
    },
    {
      id: "fehlender-vektor",
      make: (rng, level): ExerciseTask => {
        const u = rng.int(-4, 4),
          v = rng.int(-4, 4),
          p = rng.int(-4, 4),
          q = rng.int(-4, 4);
        return {
          prompt:
            level === 1
              ? `${point(u, v)} + w = ${point(u + p, v + q)}. Berechne w.`
              : `Zwei Teilwege sollen dich vom Ursprung zurück zum Ursprung bringen. Der erste ist ${point(u, v)}, der zweite ${point(p, q)}. Berechne den dritten Weg.`,
          given: ["Gesamtweg = Summe aller Teilwege"],
          ...(level === 1
            ? { formulaHint: "Bekannten Vektor von der Summe abziehen." }
            : {}),
          fields: [
            num("x-Anteil =", level === 1 ? p : -u - p, "", 0),
            num("y-Anteil =", level === 1 ? q : -v - q, "", 0),
          ],
          steps: [
            "Stelle die Gleichung nach dem fehlenden Vektor um.",
            `<strong>${point(level === 1 ? p : -u - p, level === 1 ? q : -v - q)}</strong>`,
          ],
          meta: { u, v, p, q },
        };
      },
    },
  ],
});

const mittelpunkt = L(4, {
  id: "pv-4-parallelogramm-mitte",
  title: "2.4 Parallelogramm und Mittelpunkt",
  subtitle: "Die Diagonalen halbieren einander",
  whyItMatters:
    "Ein fehlender Eckpunkt oder die Mitte einer Strecke lassen sich durch Koordinaten finden, ohne das ganze Bild neu zu messen.",
  explanationHtml: `<p>In einem Parallelogramm ABCD sind gegenüberliegende Seiten parallel und gleich lang. Für die Eckpunkte in dieser Umlaufreihenfolge gilt <strong>C = B + D − A</strong>. Du verschiebst A und B um denselben Pfeil AD.</p><p>Der Mittelpunkt einer Strecke entsteht durch Mittelung der Koordinaten. Weil sich die Diagonalen des Parallelogramms halbieren, sind die Mittelpunkte von AC und BD gleich.</p><div class="example">A(0 | 0), B(4 | 0), D(1 | 2) ergeben C(5 | 2). M von AC ist (2,5 | 1). Auch die Mitte von B und D ist ((4 + 1)/2 | (0 + 2)/2) = (2,5 | 1).</div><div class="merke"><strong>Merke:</strong> Bei einem Mittelpunkt addierst du die Endpunktkoordinaten und halbierst. Beim fehlenden Eckpunkt ist die Reihenfolge ABCD entscheidend.</div>`,
  formulas: [
    {
      name: "Mittelpunkt AB",
      html: "M((x<sub>A</sub> + x<sub>B</sub>)/2 | (y<sub>A</sub> + y<sub>B</sub>)/2)",
      quantities: "Koordinaten einzeln mitteln",
    },
    {
      name: "Parallelogramm ABCD",
      html: "C = B + D − A",
      quantities: "Eckpunkte in Umlaufreihenfolge",
    },
  ],
  quiz: {
    question: "Wo liegt die Mitte von A(−2 | 1) und B(4 | 3)?",
    options: ["(1 | 2)", "(2 | 4)", "(3 | 1)"],
    correctIndex: 0,
    explanation: "(−2 + 4)/2 = 1 und (1 + 3)/2 = 2.",
  },
  lab: lab(
    "midpoint",
    "Die gemeinsame Diagonalenmitte",
    "A bleibt im Ursprung. Ziehe B und D; die vierte Ecke C und der Schnittpunkt M werden mitgeführt.",
    [
      r("x", "x von B", -4, 4, 3),
      r("y", "y von B", -4, 4, 0),
      r("u", "x von D", -4, 4, 1),
      r("v", "y von D", -4, 4, 2),
    ],
    [
      o("c", "C", (v) => point(v.x + v.u, v.y + v.v)),
      o("m", "Diagonalenmitte M", (v) =>
        point((v.x + v.u) / 2, (v.y + v.v) / 2),
      ),
    ],
    [
      {
        id: "rechteck",
        text: "Stelle B(4 | 0) und D(0 | 4) ein. Wo liegt M?",
        check: (v) => v.x === 4 && v.y === 0 && v.u === 0 && v.v === 4,
      },
      {
        id: "schief",
        text: "Erzeuge C(2 | 4) mit B(3 | 1) und passendem D.",
        check: (v) =>
          v.x === 3 && v.y === 1 && v.x + v.u === 2 && v.y + v.v === 4,
      },
      {
        id: "mitte",
        text: "Erzeuge M(0 | 1), ohne dass das Parallelogramm zu einer Strecke wird.",
        check: (v) =>
          v.x + v.u === 0 && v.y + v.v === 2 && v.x * v.v - v.y * v.u !== 0,
      },
    ],
  ),
  exercises: [
    {
      id: "mitte",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-4, 4),
          y = rng.int(-4, 4),
          u = rng.int(-4, 4),
          v = rng.int(-4, 4);
        return {
          prompt:
            level === 1
              ? `Berechne den Mittelpunkt von A${point(x, y)} und B${point(u, v)}.`
              : `Ein Wegstück hat den Mittelpunkt M${point((x + u) / 2, (y + v) / 2)} und den Endpunkt A${point(x, y)}. Berechne den zweiten Endpunkt B.`,
          given: ["M ist von beiden Endpunkten gleich weit entfernt"],
          ...(level === 1
            ? {
                formulaHint:
                  "Je Koordinate: Endpunkte addieren, dann durch 2 teilen.",
              }
            : {}),
          fields: [
            num("x =", level === 1 ? (x + u) / 2 : u, "", 1),
            num("y =", level === 1 ? (y + v) / 2 : v, "", 1),
          ],
          steps: [
            level === 1 ? "M = (A + B) : 2." : "B = 2M − A.",
            `<strong>${point(level === 1 ? (x + u) / 2 : u, level === 1 ? (y + v) / 2 : v)}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
    {
      id: "vierte-ecke",
      make: (rng, level): ExerciseTask => {
        const x = rng.int(-3, 3),
          y = rng.int(-3, 3),
          u = rng.int(2, 5),
          v = rng.int(2, 5);
        return {
          prompt:
            level === 1
              ? `A${point(x, y)}, B${point(x + u, y)} und D${point(x + 1, y + v)} sind Ecken des Parallelogramms ABCD. Berechne C.`
              : `Ein Rechteck hat die gegenüberliegenden Ecken A${point(x, y)} und C${point(x + u, y + v)}. Seine Seiten liegen parallel zu den Achsen. Bestimme seine Mitte und seinen Flächeninhalt.`,
          given: ["Eckpunkte in Umlaufreihenfolge beachten"],
          ...(level === 1 ? { formulaHint: "C = B + D − A" } : {}),
          fields:
            level === 1
              ? [
                  num("x von C =", x + u + 1, "", 0),
                  num("y von C =", y + v, "", 0),
                ]
              : [
                  num("x von M =", x + u / 2, "", 1),
                  num("y von M =", y + v / 2, "", 1),
                  num("Fläche =", u * v, "FE", 0),
                ],
          steps: [
            level === 1
              ? "Die Verschiebung von A nach D gilt auch von B nach C."
              : `Seitenlängen ${u} und ${v}; Fläche ${u} · ${v}.`,
            `<strong>${level === 1 ? `C${point(x + u + 1, y + v)}` : `M${point(x + u / 2, y + v / 2)}, Fläche ${u * v} FE`}</strong>`,
          ],
          meta: { x, y, u, v },
        };
      },
    },
  ],
});

const determinante = L(5, {
  id: "pv-5-determinante",
  title: "2.5 Flächen mit der Determinante",
  subtitle: "Das Vorzeichen zeigt den Umlaufsinn, der Betrag den Flächeninhalt",
  whyItMatters:
    "Auch schiefe Figuren im Koordinatensystem haben einen berechenbaren Flächeninhalt. Eine Determinante braucht dafür nur zwei Seitenvektoren.",
  explanationHtml: `<p>Für u = (u₁ | u₂) und v = (v₁ | v₂) ist die zweireihige Determinante <strong>u₁ · v₂ − u₂ · v₁</strong>. Ihr Betrag ist der Flächeninhalt des aufgespannten Parallelogramms. Das Dreieck aus denselben Seitenvektoren hat die halbe Fläche.</p><div class="example">A(1 | 1), B(5 | 2), C(2 | 6): AB = (4 | 1), AC = (1 | 5). Die Determinante ist 4 · 5 − 1 · 1 = 19. Das Dreieck hat 9,5 FE. Vertauschst du die Vektoren, ist die Determinante −19; der Flächeninhalt bleibt 9,5 FE.</div><p>Eine Determinante null bedeutet: Die beiden Vektoren liegen auf einer Geraden; die Figur ist entartet. Vielecke zerlegst du in Dreiecke. Addiere deren Flächen, ohne Teile doppelt zu zählen.</p><div class="merke"><strong>Merke:</strong> Fläche ist nie negativ. Bilde erst die passenden Seitenvektoren, dann die Determinante, dann ihren Betrag und beim Dreieck die Hälfte.</div>`,
  formulas: [
    {
      name: "Determinante",
      html: "det(u,v) = u₁v₂ − u₂v₁",
      quantities: "Vorzeichen hängt von der Reihenfolge ab",
    },
    {
      name: "Flächen",
      html: "A<sub>Parallelogramm</sub> = |det(u,v)|; A<sub>Dreieck</sub> = ½ |det(u,v)|",
      quantities: "FE: Flächeneinheiten",
    },
  ],
  quiz: {
    question:
      "Eine Determinante zweier Seitenvektoren beträgt −12. Wie groß ist die Dreiecksfläche?",
    options: ["6 FE", "−6 FE", "12 FE"],
    correctIndex: 0,
    explanation: "Betrag 12, dann halbieren: 6 FE.",
  },
  lab: lab(
    "determinant",
    "Vorzeichen und Fläche",
    "Ziehe die beiden Vektorenden. Die Dreiecksfläche bleibt die Hälfte der Parallelogrammfläche, auch beim Wechsel des Umlaufsinns.",
    [
      r("u", "erster Vektor x", -4, 4, 3),
      r("v", "erster Vektor y", -4, 4, 1),
      r("p", "zweiter Vektor x", -4, 4, 1),
      r("q", "zweiter Vektor y", -4, 4, 2),
    ],
    [
      o("det", "Determinante", (v) => v.u * v.q - v.v * v.p),
      o(
        "area",
        "Dreiecksfläche",
        (v) => Math.abs(v.u * v.q - v.v * v.p) / 2,
        "FE",
      ),
    ],
    [
      {
        id: "positiv",
        text: "Erzeuge die Determinante 12 und damit die Dreiecksfläche 6 FE.",
        check: (v) => v.u * v.q - v.v * v.p === 12,
      },
      {
        id: "negativ",
        text: "Erzeuge dieselbe Fläche mit Determinante −12.",
        check: (v) => v.u * v.q - v.v * v.p === -12,
      },
      {
        id: "gerade",
        text: "Bringe zwei von null verschiedene Vektoren auf dieselbe Gerade.",
        check: (v) =>
          v.u * v.q - v.v * v.p === 0 &&
          (v.u !== 0 || v.v !== 0) &&
          (v.p !== 0 || v.q !== 0),
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level): ExerciseTask => {
        const u = rng.int(2, 6),
          v = rng.int(-2, 2),
          p = rng.int(-2, 2),
          q = rng.int(3, 6),
          d = u * q - v * p;
        return {
          prompt:
            level === 1
              ? `Die Seitenvektoren eines Dreiecks sind ${point(u, v)} und ${point(p, q)}. Berechne Determinante und Fläche.`
              : `Eine dreieckige Grundstücksskizze hat A(1 | 2), B${point(u + 1, v + 2)}, C${point(p + 1, q + 2)}. Eine LE entspricht 10 m. Berechne den Flächeninhalt in FE und in m².`,
          given: ["Dreieck aus zwei Seitenvektoren"],
          ...(level === 1
            ? { formulaHint: "det = u₁v₂ − u₂v₁; A = ½ |det|" }
            : {}),
          fields:
            level === 1
              ? [
                  num("det =", d, "", 0),
                  num("Fläche =", d / 2, "FE", 1, {
                    slips: [
                      {
                        value: d,
                        hint: "Der Determinantenbetrag ist die Parallelogrammfläche. Für das Dreieck musst du diese Fläche noch halbieren.",
                      },
                    ],
                  }),
                ]
              : [
                  num("Fläche =", d / 2, "FE", 1, {
                    slips: [
                      {
                        value: d,
                        hint: "Der Determinantenbetrag ist die Parallelogrammfläche. Für das Dreieck musst du diese Fläche noch halbieren.",
                      },
                    ],
                  }),
                  num("Fläche =", d * 50, "m²", 0),
                ],
          steps: [
            `det = ${u} · ${q} − (${fmt(v)}) · (${fmt(p)}) = ${d}.`,
            `<strong>A = ${fmt(d / 2)} FE${level === 2 ? ` = ${d * 50} m²` : ""}</strong>`,
          ],
          meta: { u, v, p, q },
        };
      },
    },
    {
      id: "parallelogramm-vieleck",
      make: (rng, level): ExerciseTask => {
        const b = rng.int(3, 8),
          h = rng.int(2, 6),
          shift = rng.int(1, 3);
        return {
          prompt:
            level === 1
              ? `Ein Parallelogramm wird von ${point(b, 0)} und ${point(shift, h)} aufgespannt. Berechne seine Fläche.`
              : `Ein Viereck wird durch eine Diagonale in zwei Dreiecke zerlegt. Ihre Seitenvektoren am gemeinsamen Start sind (4 | 0), (0 | ${h}) sowie (0 | ${h}), (−${b} | 0). Berechne die Gesamtfläche.`,
          given: ["Flächen nicht doppelt zählen"],
          ...(level === 1
            ? { formulaHint: "Parallelogrammfläche = Betrag der Determinante." }
            : {}),
          fields: [
            num("Fläche =", level === 1 ? b * h : ((4 + b) * h) / 2, "FE", 1),
          ],
          steps: [
            level === 1
              ? `det = ${b} · ${h} − 0 · ${shift}.`
              : `Die Dreiecksflächen sind ${2 * h} FE und ${fmt((b * h) / 2)} FE.`,
            `<strong>${fmt(level === 1 ? b * h : ((4 + b) * h) / 2)} FE</strong>`,
          ],
          meta: { b, h, shift },
        };
      },
    },
  ],
});

const winkel = L(6, {
  id: "pv-6-parallelen-winkel",
  title: "2.6 Winkel an Parallelen",
  subtitle: "Stufen-, Wechsel- und Ergänzungswinkel begründen",
  whyItMatters:
    "Mit einer bekannten Winkelgröße kannst du viele weitere bestimmen. Die Gleichheiten helfen dir umgekehrt auch nachzuweisen, dass zwei Geraden parallel sind.",
  explanationHtml: `<p>Schneidet eine Gerade zwei parallele Geraden, sind <strong>Stufenwinkel</strong> in gleicher Lage und <strong>Wechselwinkel</strong> in Z-Lage gleich groß. Innenwinkel auf derselben Seite der schneidenden Geraden heißen Ergänzungswinkel und ergänzen sich zu 180°.</p><p>An jeder einzelnen Kreuzung sind Scheitelwinkel gleich groß und Nebenwinkel zusammen 180°. Diese beiden Regeln brauchen keine parallelen Geraden. Umgekehrt folgt aus gleich großen Stufen- oder Wechselwinkeln die Parallelität der beiden Geraden.</p><div class="example">g ∥ h, ein Winkel beträgt 65°. Sein Stufenwinkel und Wechselwinkel betragen ebenfalls 65°. Die benachbarten Ergänzungswinkel sind 180° − 65° = 115°.</div><div class="merke"><strong>Merke:</strong> Benenne zuerst die Lage des Winkelpaars und die Voraussetzung g ∥ h. Gleiche Winkel nur aus einer ähnlich aussehenden Zeichnung abzulesen ist keine Begründung.</div>`,
  formulas: [
    {
      name: "Stufen-/Wechselwinkel",
      html: "α = β bei g ∥ h",
      quantities: "F- bzw. Z-Lage",
    },
    {
      name: "Ergänzungswinkel",
      html: "α + γ = 180° bei g ∥ h",
      quantities: "Innenwinkel auf derselben Seite",
    },
  ],
  quiz: {
    question:
      "Ein Stufenwinkel zu 65° liegt an einer parallelen Geraden. Wie groß ist er?",
    options: ["65°", "115°", "25°"],
    correctIndex: 0,
    explanation:
      "Stufenwinkel an Parallelen sind gleich groß; 115° wäre ein Ergänzungswinkel.",
  },
  lab: lab(
    "parallel-angles",
    "Parallelen prüfen",
    "Ziehe den Winkelpunkt. Drehe zusätzlich die zweite Gerade: Die Stufenwinkelgleichheit geht verloren, sobald die Geraden nicht mehr parallel sind.",
    [
      r("alpha", "Winkel α", 40, 140, 50, 10, "°"),
      r("beta", "Drehung der zweiten Geraden", -20, 20, 10, 10, "°"),
    ],
    [
      o("stufe", "zweiter Stufenwinkel", (v) => v.alpha - v.beta, "°"),
      o("erg", "Ergänzungswinkel zu α", (v) => 180 - v.alpha, "°"),
      o("parallel", "Geraden", (v) =>
        v.beta === 0 ? "parallel" : "nicht parallel",
      ),
    ],
    [
      {
        id: "sechzig",
        text: "Erzeuge parallele Geraden und Stufenwinkel von 60°.",
        check: (v) => v.beta === 0 && v.alpha === 60,
      },
      {
        id: "hundertzwanzig",
        text: "Erzeuge parallele Geraden mit α = 120° und Ergänzungswinkel 60°.",
        check: (v) => v.beta === 0 && v.alpha === 120,
      },
      {
        id: "widerlegen",
        text: "Stelle α = 50° und den zweiten Stufenwinkel 30° ein. Sind die Geraden parallel?",
        check: (v) => v.alpha === 50 && v.alpha - v.beta === 30,
      },
    ],
  ),
  exercises: [
    {
      id: "winkelpaare",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(3, 15) * 10;
        return {
          prompt:
            level === 1
              ? `g ∥ h. Ein Winkel ist ${a}° groß. Berechne seinen Stufenwinkel und seinen Ergänzungswinkel.`
              : `Bei einer Doppelkreuzung beträgt ein Winkel ${a}°. Die Geraden sind parallel. Von den acht Teilwinkeln sind vier so groß wie dieser Winkel und vier ergänzend. Berechne den Ergänzungswinkel und die Summe aller acht Teilwinkel.`,
          given: ["g ∥ h"],
          ...(level === 1
            ? {
                formulaHint:
                  "Stufenwinkel gleich; Ergänzungswinkel zusammen 180°.",
              }
            : {}),
          fields:
            level === 1
              ? [
                  num("Stufenwinkel =", a, "°", 0),
                  num("Ergänzungswinkel =", 180 - a, "°", 0),
                ]
              : [
                  num("Ergänzungswinkel =", 180 - a, "°", 0),
                  num("Gesamtsumme =", 720, "°", 0),
                ],
          steps: [
            `180° − ${a}° = ${180 - a}°.`,
            `<strong>${a}° und ${180 - a}°; zwei Vollwinkel ergeben 720°.</strong>`,
          ],
          meta: { a },
        };
      },
    },
    {
      id: "parallelitaet",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(4, 13) * 10,
          parallel = rng.pick([true, false]),
          b = parallel ? a : a + 10;
        return {
          prompt:
            level === 1
              ? `Zwei Stufenwinkel haben ${a}° und ${b}°. Folgt daraus Parallelität?`
              : `Zwei Innenwinkel auf derselben Seite einer schneidenden Geraden haben ${a}° und ${180 - b}°. Prüfe, ob die Geraden parallel sind, und gib die Winkelsumme an.`,
          given: ["Die Lage des Winkelpaars ist vorgegeben"],
          ...(level === 1
            ? { formulaHint: "Umkehrung: gleiche Stufenwinkel ⇒ parallel." }
            : {}),
          fields: [
            pick("Parallel?", ["ja", "nein"], parallel ? 0 : 1),
            ...(level === 2 ? [num("Winkelsumme =", 180 + a - b, "°", 0)] : []),
          ],
          steps: [
            level === 1
              ? `Vergleiche ${a}° mit ${b}°.`
              : `Summe ${a}° + ${180 - b}° = ${180 + a - b}°.`,
            `<strong>${parallel ? "Die Parallelität folgt." : "Die Geraden sind nicht parallel."}</strong>`,
          ],
          meta: { a, b, parallel: parallel ? 1 : 0 },
        };
      },
    },
  ],
});

const summen = L(7, {
  id: "pv-7-winkelsummen",
  title: "2.7 Innen- und Außenwinkel",
  subtitle: "Dreieck 180°, Viereck 360°",
  whyItMatters:
    "Eine fehlende Winkelgröße lässt sich aus der Summe bestimmen. Der Außenwinkelsatz ist oft der kürzere Weg.",
  explanationHtml: `<p>Ziehst du durch eine Dreiecksecke eine Parallele zur Gegenseite, erscheinen die beiden anderen Innenwinkel dort als Wechselwinkel. Zusammen mit dem Winkel an der Ecke bilden sie einen gestreckten Winkel: <strong>α + β + γ = 180°</strong>.</p><p>Ein Außenwinkel ist der Nebenwinkel eines Innenwinkels und damit gleich der Summe der beiden nicht anliegenden Innenwinkel. Ein Viereck wird durch eine Diagonale in zwei Dreiecke zerlegt; seine Innenwinkelsumme ist 360°.</p><div class="example">Im Dreieck sind α = 40° und β = 60° gegeben. γ = 180° − 40° − 60° = 80°. Der Außenwinkel neben γ beträgt 100° = α + β. Im Viereck mit 70°, 90°, 110° fehlt 360° − 270° = 90°.</div><div class="merke"><strong>Merke:</strong> Ein Dreieck braucht drei positive Innenwinkel. Rechne einen Außenwinkel nicht zusätzlich zur Innenwinkelsumme dazu.</div>`,
  formulas: [
    { name: "Dreieck", html: "α + β + γ = 180°", quantities: "Innenwinkel" },
    {
      name: "Außenwinkel",
      html: "γ<sub>außen</sub> = α + β",
      quantities: "nicht anliegende Innenwinkel",
    },
    {
      name: "Viereck",
      html: "α + β + γ + δ = 360°",
      quantities: "zwei Dreiecke",
    },
  ],
  quiz: {
    question:
      "Im Dreieck betragen zwei Winkel 40° und 60°. Wie groß ist der dritte?",
    options: ["80°", "100°", "260°"],
    correctIndex: 0,
    explanation: "180° − 40° − 60° = 80°. 100° ist der zugehörige Außenwinkel.",
  },
  lab: lab(
    "polygon-angles",
    "Die Winkelbilanz",
    "Wähle Dreieck oder Viereck und ändere die Winkel mit den Reglern. Die Bilanz zeigt, ob ein zulässiger fehlender Innenwinkel entsteht.",
    [
      r("n", "Eckenanzahl", 3, 4, 3),
      r("alpha", "α", 20, 140, 50, 10, "°"),
      r("beta", "β", 20, 140, 60, 10, "°"),
      r("gamma", "γ (nur Viereck)", 20, 140, 80, 10, "°"),
    ],
    [
      o("sum", "Innenwinkelsumme", (v) => (v.n - 2) * 180, "°"),
      o(
        "rest",
        "fehlender Winkel",
        (v) => (v.n - 2) * 180 - v.alpha - v.beta - (v.n === 4 ? v.gamma : 0),
        "°",
      ),
    ],
    [
      {
        id: "dreieck",
        text: "Stelle ein Dreieck mit 40°, 60° und 80° ein.",
        check: (v) => v.n === 3 && v.alpha === 40 && v.beta === 60,
      },
      {
        id: "rechteck",
        text: "Stelle vier rechte Winkel ein.",
        check: (v) =>
          v.n === 4 && v.alpha === 90 && v.beta === 90 && v.gamma === 90,
      },
      {
        id: "gleichseitig",
        text: "Stelle die Winkel eines gleichseitigen Dreiecks ein.",
        check: (v) => v.n === 3 && v.alpha === 60 && v.beta === 60,
      },
    ],
  ),
  exercises: [
    {
      id: "fehlender-winkel",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(3, 7) * 10,
          b = rng.int(3, 7) * 10,
          g = 180 - a - b;
        return {
          prompt:
            level === 1
              ? `Ein Dreieck hat die Innenwinkel ${a}° und ${b}°. Berechne den dritten Winkel.`
              : `Zwei Innenwinkel eines Dreiecks sind ${a}° und ${b}°. Berechne den dritten Innenwinkel und den anliegenden Außenwinkel.`,
          given: ["Innenwinkelsumme 180°"],
          ...(level === 1 ? { formulaHint: "γ = 180° − α − β" } : {}),
          fields: [
            num("γ =", g, "°", 0),
            ...(level === 2 ? [num("Außenwinkel =", a + b, "°", 0)] : []),
          ],
          steps: [
            `γ = 180° − ${a}° − ${b}°.`,
            `<strong>γ = ${g}°; außen ${a + b}°</strong>`,
          ],
          meta: { a, b },
        };
      },
    },
    {
      id: "viereck",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(6, 11) * 10,
          b = rng.int(6, 11) * 10,
          c = rng.int(6, 11) * 10,
          d = 360 - a - b - c;
        return {
          prompt:
            level === 1
              ? `Im Viereck sind ${a}°, ${b}° und ${c}° bekannt. Berechne den vierten Innenwinkel.`
              : `In einem Viereck sind zwei Winkel gleich groß. Die beiden anderen betragen ${a}° und ${b}°. Wie groß ist jeder der gleichen Winkel?`,
          given: ["Innenwinkelsumme 360°"],
          ...(level === 1
            ? { formulaHint: "Fehlenden Winkel von 360° aus ergänzen." }
            : {}),
          fields: [
            num(
              "gesuchter Winkel =",
              level === 1 ? d : (360 - a - b) / 2,
              "°",
              0,
            ),
          ],
          steps: [
            level === 1
              ? `360° − ${a}° − ${b}° − ${c}°.`
              : `Zuerst ${a}° und ${b}° abziehen, dann den Rest halbieren.`,
            `<strong>${level === 1 ? d : (360 - a - b) / 2}°</strong>`,
          ],
          meta: { a, b, c },
        };
      },
    },
  ],
});

const vielecke = L(8, {
  id: "pv-8-vielecke",
  title: "2.8 Winkelsummen in Vielecken",
  subtitle: "Von einer Ecke aus in Dreiecke zerlegen",
  tracks: ["I"],
  whyItMatters:
    "Die Innenwinkelsumme musst du nicht für jede Eckenanzahl auswendig lernen. Eine passende Zerlegung begründet die allgemeine Regel.",
  explanationHtml: `<p>Verbinde in einem konvexen n-Eck eine Ecke mit allen nicht benachbarten Ecken. Es entstehen n − 2 Dreiecke. Deren Innenwinkel füllen genau die Innenwinkel des Vielecks aus.</p><div class="example">Ein Fünfeck lässt sich in 3 Dreiecke zerlegen. Seine Winkelsumme beträgt 3 · 180° = 540°. Beim regelmäßigen Fünfeck sind alle fünf Innenwinkel gleich: 540° : 5 = 108°.</div><p>Bei einem regelmäßigen Vieleck ist jeder Außenwinkel 360° : n. Innen- und zugehöriger Außenwinkel ergänzen sich zu 180°. Die Zerlegung begründet die Innenwinkelsumme; die Zeichnung allein beweist sie nicht.</p><div class="merke"><strong>Merke:</strong> S = (n − 2) · 180°. Nur bei einem regelmäßigen Vieleck darfst du S durch n teilen, um jeden Innenwinkel zu erhalten.</div>`,
  formulas: [
    {
      name: "Innenwinkelsumme",
      html: "S = (n − 2) · 180°",
      quantities: "n Ecken",
    },
    {
      name: "Regelmäßiges Vieleck",
      html: "Innenwinkel = S : n; Außenwinkel = 360° : n",
      quantities: "alle Seiten und Winkel gleich",
    },
  ],
  quiz: {
    question: "In wie viele Dreiecke zerlegt eine Ecke ein konvexes Sechseck?",
    options: ["4", "6", "3"],
    correctIndex: 0,
    explanation: "n − 2 = 6 − 2 = 4 Dreiecke.",
  },
  lab: lab(
    "polygon-angles",
    "Vieleck zerlegen",
    "Ändere die Eckenanzahl. Die Diagonalen von einer Ecke zeigen die Anzahl der Dreiecke.",
    [r("n", "Eckenanzahl", 3, 8, 4)],
    [
      o("count", "Dreiecke", (v) => v.n - 2),
      o("sum", "Winkelsumme", (v) => (v.n - 2) * 180, "°"),
      o(
        "angle",
        "regelmäßiger Innenwinkel",
        (v) => ((v.n - 2) * 180) / v.n,
        "°",
      ),
    ],
    [
      {
        id: "fuenf",
        text: "Erzeuge eine Innenwinkelsumme von 540°.",
        check: (v) => v.n === 5,
      },
      {
        id: "sechs",
        text: "Erzeuge vier Teildreiecke.",
        check: (v) => v.n === 6,
      },
      {
        id: "acht",
        text: "Erzeuge einen regelmäßigen Innenwinkel von 135°.",
        check: (v) => v.n === 8,
      },
    ],
  ),
  exercises: [
    {
      id: "winkelsumme",
      make: (rng, level): ExerciseTask => {
        const n = rng.pick([5, 6, 8, 9, 10, 12]);
        return {
          prompt:
            level === 1
              ? `Ein konvexes Vieleck hat ${n} Ecken. Bestimme seine Innenwinkelsumme und die Zahl der Teildreiecke.`
              : `Ein regelmäßiges Vieleck hat ${n} Ecken. Bestimme jeden Innen- und Außenwinkel.`,
          given: [`n = ${n}`],
          ...(level === 1
            ? { formulaHint: "n − 2 Dreiecke mit jeweils 180°." }
            : {}),
          fields:
            level === 1
              ? [
                  num("Summe =", (n - 2) * 180, "°", 0),
                  num("Dreiecke =", n - 2, "", 0),
                ]
              : [
                  num("Innenwinkel =", ((n - 2) * 180) / n, "°", 1),
                  num("Außenwinkel =", 360 / n, "°", 1),
                ],
          steps: [
            `S = (${n} − 2) · 180° = ${(n - 2) * 180}°.`,
            `<strong>${level === 1 ? `${n - 2} Dreiecke` : `innen ${fmt(((n - 2) * 180) / n)}°, außen ${fmt(360 / n)}°`}</strong>`,
          ],
          meta: { n },
        };
      },
    },
    {
      id: "ecken-finden",
      make: (rng, level): ExerciseTask => {
        const n = rng.pick([5, 6, 8, 10, 12]);
        return {
          prompt:
            level === 1
              ? `Die Innenwinkelsumme eines Vielecks ist ${(n - 2) * 180}°. Berechne seine Eckenanzahl.`
              : `Der Außenwinkel eines regelmäßigen Vielecks beträgt ${360 / n}°. Bestimme Eckenanzahl und Innenwinkelsumme.`,
          given: ["Gesucht ist eine ganze Eckenanzahl"],
          ...(level === 1 ? { formulaHint: "n = S : 180° + 2" } : {}),
          fields: [
            num("Eckenanzahl =", n, "", 0),
            ...(level === 2 ? [num("Summe =", (n - 2) * 180, "°", 0)] : []),
          ],
          steps: [
            level === 1
              ? `S : 180° ergibt die Zahl der Teildreiecke.`
              : `360° : ${360 / n}° = ${n}.`,
            `<strong>${n} Ecken, Winkelsumme ${(n - 2) * 180}°</strong>`,
          ],
          meta: { n },
        };
      },
    },
  ],
});

export const STAGE_VERSCHIEBUNG = makeStage(
  2,
  "Parallelverschiebung",
  "Vektoren, Flächen und Winkelbeziehungen",
  "#0891b2",
  "↗",
  [2, 2],
  [
    verschiebung,
    vektoren,
    addition,
    mittelpunkt,
    determinante,
    winkel,
    summen,
    vielecke,
  ],
);
