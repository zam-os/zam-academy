import { fmt } from "../exercises/format";
import {
  choice,
  choiceField,
  defineLesson,
  numberField,
  range,
  stage,
  task,
  yesNo,
} from "./helpers";

export const SOLIDS = [
  {
    name: "Würfel",
    planes: "9",
    center: true,
    horizontal: true,
    axis: "13 Drehachsen: 3 durch Flächenmitten, 4 durch Eckenpaare, 6 durch Kantenmittenpaare",
  },
  {
    name: "Quader mit drei verschiedenen Kanten",
    planes: "3",
    center: true,
    horizontal: true,
    axis: "3 Drehachsen durch gegenüberliegende Flächenmitten, jeweils 180°",
  },
  {
    name: "gerade quadratische Pyramide",
    planes: "4",
    center: false,
    horizontal: false,
    axis: "Achse durch Spitze und Grundflächenmitte; kleinster Drehwinkel 90°",
  },
  {
    name: "gerader Kreiszylinder",
    planes: "unendlich viele",
    center: true,
    horizontal: true,
    axis: "Längsachse für beliebige Winkel; zusätzlich 180° um jede mittige Querachse",
  },
  {
    name: "gerader Kreiskegel",
    planes: "unendlich viele",
    center: false,
    horizontal: false,
    axis: "Achse durch Spitze und Grundkreismitte; beliebige Drehwinkel",
  },
  {
    name: "Kugel",
    planes: "unendlich viele",
    center: true,
    horizontal: true,
    axis: "Jeder Durchmesser ist eine Drehachse; beliebige Drehwinkel",
  },
] as const;

const solidSymmetry = defineLesson("rg-1-koerpersymmetrie", {
  subtitle: "Spiegelebene, Drehachse und Symmetriezentrum",
  whyItMatters:
    "Symmetrie vereinfacht räumliche Pläne und erklärt, welche Schnitte gleich aussehen.",
  explanationHtml: `<p>Eine <strong>Symmetrieebene</strong> spiegelt einen Körper auf sich selbst. Eine <strong>Drehachse</strong> erlaubt eine Drehung um weniger als 360° auf denselben Körper. Bei einem <strong>Symmetriezentrum</strong> liegt zu jedem Punkt auch sein Gegenpunkt im gleichen Abstand auf der anderen Seite.</p><p>Ein Quader mit verschiedenen Kanten hat drei mittige Symmetrieebenen und ein Symmetriezentrum. Ein Würfel hat zusätzlich sechs diagonale Ebenen, insgesamt neun. Eine gerade quadratische Pyramide hat vier senkrechte Symmetrieebenen, aber keine waagerechte und kein Symmetriezentrum.</p><p>Kreiszylinder und Kreiskegel haben unendlich viele Ebenen durch ihre Achse. Nur der Zylinder hat zusätzlich die mittlere waagerechte Ebene und ein Symmetriezentrum. Eine Kugel hat jede Ebene durch ihren Mittelpunkt als Symmetrieebene.</p><div class="merke">Prüfe an einer Schachtel und einem kegelförmigen Gegenstand: Welche Ebene würde beide Hälften spiegelbildlich zusammenfallen lassen? Markiere eine Drehachse und begründe, ob ein Zentrum existiert.</div>`,
  formulas: [
    {
      name: "Punktspiegelung im Raum",
      html: "P′ = 2Z − P",
      quantities:
        "Ein Zentrum ist nur dann Symmetriezentrum, wenn der ganze Körper auf sich abgebildet wird.",
    },
  ],
  quiz: {
    question: "Welche Aussage gilt für eine gerade quadratische Pyramide?",
    options: [
      "Sie hat ein Symmetriezentrum.",
      "Sie hat vier senkrechte Symmetrieebenen und kein Symmetriezentrum.",
      "Jede Ebene durch die Spitze ist eine Symmetrieebene.",
    ],
    correctIndex: 1,
    explanation:
      "Die Symmetrieebenen entsprechen den zwei Diagonalen und zwei Mittellinien der quadratischen Grundfläche.",
  },
  lab: {
    kind: "solid-symmetry",
    title: "Würde die Spiegelung passen?",
    intro:
      "Die senkrechte Mittelebene verläuft durch die Achse; die waagerechte liegt auf halber Höhe. Vergleiche mit einer versetzten Ebene.",
    params: [
      choice(
        "solid",
        "Körper",
        SOLIDS.map((s) => s.name),
      ),
      choice("plane", "Ebene", ["senkrecht mittig", "waagerecht mittig", "waagerecht versetzt"]),
    ],
    readouts: [
      { key: "planes", label: "Alle Symmetrieebenen", compute: (v) => SOLIDS[v.solid].planes },
      {
        key: "selected",
        label: "Gewählte Ebene ist Symmetrieebene?",
        compute: (v) =>
          v.plane === 0 || (v.plane === 1 && SOLIDS[v.solid].horizontal) ? "ja" : "nein",
      },
      {
        key: "center",
        label: "Symmetriezentrum?",
        compute: (v) => (SOLIDS[v.solid].center ? "ja" : "nein"),
      },
      { key: "axis", label: "Drehachsen", compute: (v) => SOLIDS[v.solid].axis },
    ],
    goals: [
      {
        id: "quader",
        text: "Prüfe die waagerechte Mittelebene am Quader.",
        check: (v) => v.solid === 1 && v.plane === 1,
      },
      {
        id: "kegel",
        text: "Zeige am Kegel, warum dieselbe Ebene keine Symmetrieebene ist.",
        check: (v) => v.solid === 4 && v.plane === 1,
      },
    ],
  },
  exercises: [
    {
      id: "symmetrie",
      make: (rng, level) => {
        const n = rng.int(0, 5),
          s = SOLIDS[n];
        return task(
          `${level === 1 ? "Untersuche" : "Für ein Modell soll eine horizontale Trennfuge in der Mitte liegen. Beurteile"}: ${s.name}.`,
          [
            yesNo("Mittlere waagerechte Ebene ist Symmetrieebene?", s.horizontal),
            yesNo("Symmetriezentrum vorhanden?", s.center),
            choiceField(
              "Anzahl aller Symmetrieebenen",
              ["3", "4", "9", "unendlich viele"],
              ["3", "4", "9", "unendlich viele"].indexOf(s.planes),
            ),
          ],
          [
            `Prüfe, ob obere und untere Hälfte durch Spiegelung zusammenpassen.`,
            `<strong>${s.name}: ${s.planes} Symmetrieebenen; ${s.center ? "mit" : "ohne"} Symmetriezentrum.</strong> ${s.axis}.`,
          ],
          level === 1
            ? "Ebene, Achse und Zentrum sind verschiedene Arten von Symmetrie."
            : undefined,
          { solid: n },
        );
      },
    },
  ],
});

const axial = defineLesson("rg-2-axialschnitte", {
  subtitle: "Eine Ebene durch die Rotationsachse",
  whyItMatters: "Aus einer ebenen Zeichnung erkennst du, welcher Körper durch Rotation entsteht.",
  explanationHtml: `<p>Ein Axialschnitt enthält die Rotationsachse. Beim Kreiszylinder ist er ein Rechteck mit Breite 2r und Höhe h. Beim geraden Kreiskegel ist er ein gleichschenkliges Dreieck mit Grundseite 2r und Höhe h. Bei der Kugel ist es ein Kreis mit Radius r.</p><p>Umgekehrt erzeugt ein Rechteck durch Rotation um eine seiner Seiten einen Zylinder. Ein rechtwinkliges Dreieck erzeugt durch Rotation um eine Kathete einen Kegel. Ein Halbkreis erzeugt durch Rotation um seinen Durchmesser eine Kugel.</p><div class="merke">Skizziere zu einem Trinkglas ohne Griff einen möglichen Axialschnitt. Unterscheide den äußeren Körper von einem hohlen Gefäß.</div>`,
  formulas: [
    {
      name: "Durchmesser",
      html: "d = 2r",
      quantities: "Breite des Axialschnitts; bei der Kugel zugleich dessen Höhe",
    },
  ],
  quiz: {
    question: "Welche Figur entsteht beim Axialschnitt eines geraden Kreiskegels?",
    options: ["Ein Kreis.", "Ein Rechteck.", "Ein gleichschenkliges Dreieck."],
    correctIndex: 2,
    explanation: "Der Schnitt enthält Spitze, Achse und einen Durchmesser des Grundkreises.",
  },
  lab: {
    kind: "axial-section",
    title: "Schnitt und Rotationskörper",
    intro:
      "Wähle den Körper und verändere die Maße. Links siehst du den Axialschnitt, rechts den Körper.",
    params: [
      choice("solid", "Körper", ["Zylinder", "Kegel", "Kugel"]),
      range("radius", "Radius", 1, 5, 2, 0.5, "cm"),
      range("height", "Höhe (ohne Kugel)", 2, 10, 5, 1, "cm"),
    ],
    readouts: [
      { key: "width", label: "Breite des Axialschnitts", unit: "cm", compute: (v) => 2 * v.radius },
      {
        key: "height",
        label: "Höhe des Axialschnitts",
        unit: "cm",
        compute: (v) => (v.solid === 2 ? 2 * v.radius : v.height),
      },
      {
        key: "shape",
        label: "Schnittfigur",
        compute: (v) => ["Rechteck", "gleichschenkliges Dreieck", "Kreis"][v.solid],
      },
    ],
    goals: [
      {
        id: "kegel",
        text: "Stelle einen Kegel mit Schnittbreite 6 cm und Höhe 8 cm dar.",
        check: (v) => v.solid === 1 && v.radius === 3 && v.height === 8,
      },
      {
        id: "kugel",
        text: "Stelle einen kreisförmigen Axialschnitt mit Durchmesser 8 cm dar.",
        check: (v) => v.solid === 2 && v.radius === 4,
      },
    ],
  },
  exercises: [
    {
      id: "schnitt",
      make: (rng, level) => {
        const s = rng.int(0, 2),
          r = rng.int(2, 6),
          h = rng.int(4, 10),
          names = ["Zylinder", "Kegel", "Kugel"],
          shapes = ["Rechteck", "gleichschenkliges Dreieck", "Kreis"];
        return level === 1
          ? task(
              `Ein ${names[s]} hat Radius ${r} cm${s === 2 ? "." : ` und Höhe ${h} cm.`} Beschreibe den Axialschnitt.`,
              [
                choiceField("Schnittfigur", shapes, s),
                numberField("Breite:", 2 * r, "cm", 0),
                numberField("Höhe:", s === 2 ? 2 * r : h, "cm", 0),
              ],
              [
                `Der Schnitt verläuft durch die Achse und enthält den Durchmesser 2r.`,
                `<strong>${shapes[s]}, Breite ${2 * r} cm, Höhe ${s === 2 ? 2 * r : h} cm.</strong>`,
              ],
              "d = 2r",
              { solid: s, r, h },
            )
          : task(
              `Ein ${shapes[s]} mit Breite ${2 * r} cm${s === 2 ? "" : ` und Höhe ${h} cm`} soll als vollständiger Axialschnitt eines Rotationskörpers dienen. Welcher Körper passt und welchen Radius hat er?`,
              [choiceField("Körper", names, s), numberField("Radius:", r, "cm", 0)],
              [
                `Die Breite des vollständigen Axialschnitts ist der Durchmesser.`,
                `<strong>${names[s]} mit r = ${r} cm.</strong>`,
              ],
              undefined,
              { solid: s, r, h },
            );
      },
    },
  ],
});

const coordinates = defineLesson("rg-3-raumkoordinaten", {
  subtitle: "Drei Koordinaten statt zweier",
  whyItMatters: "Räumliche Pläne brauchen neben rechts und hinten auch eine Höhe.",
  explanationHtml: `<p>Im dreidimensionalen Koordinatensystem hat P die Koordinaten (x|y|z). Vom Ursprung gehst du parallel zu den Achsen: erst x, dann y, dann z. Die Reihenfolge der Wege ist für den Endpunkt gleichgültig; die Reihenfolge der Koordinaten darfst du nicht vertauschen.</p><p>In der xy-Ebene gilt z = 0, in der xz-Ebene y = 0 und in der yz-Ebene x = 0. Verbinde passende Punkte, um Strecken, Dreiecke oder Körperkanten zu zeichnen. Ein Schrägbild verkürzt eine Richtung; daran kannst du keine wahren räumlichen Winkel ablesen.</p><div class="merke">Zeichne einen Quader mit A(0|0|0), B(4|0|0), C(4|3|0), D(0|3|0) und einer Höhe von 2. Gib alle vier oberen Eckpunkte an.</div>`,
  formulas: [
    {
      name: "Punkt im Raum",
      html: "P(x | y | z)",
      quantities: "xy-Ebene: z = 0; xz-Ebene: y = 0; yz-Ebene: x = 0",
    },
  ],
  quiz: {
    question: "In welcher Koordinatenebene liegt P(0|3|2)?",
    options: ["xy-Ebene", "xz-Ebene", "yz-Ebene"],
    correctIndex: 2,
    explanation: "Die x-Koordinate ist null; nur y und z werden benötigt.",
  },
  lab: {
    kind: "space-coordinates",
    title: "Im Raum orientieren",
    intro:
      "Verändere x, y und z. Die Hilfslinien führen vom Ursprung zum Punkt; gestrichelte Kanten zeigen den zugehörigen Quader.",
    params: [range("x", "x", 0, 6, 2), range("y", "y", 0, 6, 1), range("z", "z", 0, 6, 3)],
    readouts: [
      { key: "point", label: "P", compute: (v) => `(${v.x}|${v.y}|${v.z})` },
      {
        key: "planes",
        label: "Koordinatenebenen mit P",
        compute: (v) =>
          [v.z === 0 ? "xy" : "", v.y === 0 ? "xz" : "", v.x === 0 ? "yz" : ""]
            .filter(Boolean)
            .join(", ") || "keine",
      },
    ],
    goals: [
      { id: "raum", text: "Markiere P(3|2|4).", check: (v) => v.x === 3 && v.y === 2 && v.z === 4 },
      {
        id: "ebene",
        text: "Markiere Q(0|3|2) in der yz-Ebene.",
        check: (v) => v.x === 0 && v.y === 3 && v.z === 2,
      },
    ],
  },
  exercises: [
    {
      id: "koordinaten",
      make: (rng, level) => {
        const x = rng.int(1, 6),
          y = rng.int(1, 6),
          z = rng.int(1, 6),
          axis = rng.int(0, 2);
        if (level === 1)
          return task(
            `Ein Punkt liegt bei (${x}|${y}|${z}). Er wird senkrecht auf die ${["yz", "xz", "xy"][axis]}-Ebene projiziert. Gib die Koordinaten des Lotfußpunkts an.`,
            [
              numberField("x =", axis === 0 ? 0 : x, "", 0),
              numberField("y =", axis === 1 ? 0 : y, "", 0),
              numberField("z =", axis === 2 ? 0 : z, "", 0),
            ],
            [
              `In der ${["yz", "xz", "xy"][axis]}-Ebene ist die ${["x", "y", "z"][axis]}-Koordinate null. Die beiden anderen bleiben gleich.`,
              `<strong>(${axis === 0 ? 0 : x}|${axis === 1 ? 0 : y}|${axis === 2 ? 0 : z}).</strong>`,
            ],
            "Eine Koordinate wird null.",
            { x, y, z, axis },
          );
        return task(
          `Eine Kiste hat Grundflächenecken (0|0|0), (${x}|0|0), (${x}|${y}|0), (0|${y}|0) und Höhe ${z}. Gib die obere Ecke über (${x}|${y}|0) an.`,
          [
            numberField("x =", x, "", 0),
            numberField("y =", y, "", 0),
            numberField("z =", z, "", 0),
          ],
          [
            `Über der Grundfläche bleiben x und y gleich; nur die Höhe wird ergänzt.`,
            `<strong>(${x}|${y}|${z}).</strong>`,
          ],
          undefined,
          { x, y, z },
        );
      },
    },
  ],
});

const oblique = defineLesson("rg-4-schraegbilder", {
  subtitle: "Schrägbildachse, Winkel und Verkürzung",
  whyItMatters:
    "Ein räumlicher Körper passt auf ein Blatt, wenn du eine klare Zeichenregel einhältst.",
  explanationHtml: `<p>Beim Schrägbild bleiben Längen und Winkel in Ebenen parallel zur Zeichenebene unverzerrt; beim gezeigten Quader ist das die Vorderfläche. Tiefenstrecken laufen parallel zur Schrägbildachse mit Verzerrungswinkel ω; ihre gezeichnete Länge ist q mal die wahre Länge. Häufig wählt man ω = 45° und q = 1/2, andere Festlegungen sind möglich.</p><p><strong>Prisma:</strong> Zeichne die vordere Fläche, trage die Tiefenstrecken ab und verbinde die hintere Fläche. <strong>Gerade quadratische Pyramide:</strong> Zeichne zuerst die Grundfläche als Parallelogramm; ihr Diagonalenschnitt ist der Fußpunkt der Höhe. Trage dort die Spitze senkrecht nach oben ab. Verdeckte Kanten werden gestrichelt.</p><div class="merke">Zeichne mit Geodreieck ein Prisma und eine Pyramide für ω = 45° und q = 1/2. Beschrifte zuerst die Schrägbildachse; miss dann die verkürzten Tiefenstrecken.</div>`,
  formulas: [
    {
      name: "Tiefe im Bild",
      html: "d<sub>Bild</sub> = q · d",
      quantities: "q ist der Verzerrungsmaßstab; nur die Tiefenrichtung wird verkürzt.",
    },
  ],
  quiz: {
    question: "Wie zeichnest du eine 8 cm lange Tiefenkante bei q = 1/2?",
    options: ["8 cm", "16 cm", "4 cm"],
    correctIndex: 2,
    explanation: "Nur die Tiefenkante wird mit q multipliziert: 8 · 1/2 = 4 cm.",
  },
  lab: {
    kind: "oblique",
    title: "Einen Körper projizieren",
    intro: "Ändere q und den Verzerrungswinkel. Die wahre Tiefe bleibt als Maß gegeben.",
    params: [
      choice("solid", "Körper", ["Prisma (Quader)", "gerade quadratische Pyramide"]),
      range("depth", "wahre Tiefe", 2, 8, 6, 1, "cm"),
      range("q", "Verzerrungsmaßstab q", 0.25, 1, 0.5, 0.25),
      range("angle", "Verzerrungswinkel", 30, 60, 45, 5, "°"),
    ],
    readouts: [
      {
        key: "drawn",
        label: "Tiefenlänge im Bild",
        unit: "cm",
        digits: 2,
        compute: (v) => v.depth * v.q,
      },
      {
        key: "front",
        label: "Unverkürzte Maße",
        compute: (v) =>
          v.solid === 0
            ? "Vorderfläche: Längen und Winkel in wahrer Größe"
            : "Vordere Grundkante und senkrechte Höhe",
      },
    ],
    goals: [
      {
        id: "prisma",
        text: "Zeichne das Prisma mit wahrer Tiefe 8 cm, q = 1/2 und 45°.",
        check: (v) => v.solid === 0 && v.depth === 8 && v.q === 0.5 && v.angle === 45,
      },
      {
        id: "pyramide",
        text: "Zeichne die quadratische Pyramide mit Grundkante 6 cm, q = 1/4 und 60°.",
        check: (v) => v.solid === 1 && v.depth === 6 && v.q === 0.25 && v.angle === 60,
      },
    ],
  },
  exercises: [
    {
      id: "schraegbild",
      make: (rng, level) => {
        const d = rng.int(4, 12),
          q = rng.pick([0.25, 0.5, 0.75]),
          angle = rng.pick([30, 45, 60]);
        if (level === 1)
          return task(
            `Eine Tiefenkante ist ${d} cm lang. Zeichne mit q = ${fmt(q, 2)} und ω = ${angle}°. Wie lang ist die Tiefenkante im Bild?`,
            [
              numberField("Bildlänge:", d * q, "cm", 2),
              numberField("Winkel zur waagerechten Achse:", angle, "°", 0),
            ],
            [
              `Die Bildlänge ist q · d; der vorgegebene Verzerrungswinkel bleibt ${angle}°.`,
              `<strong>${fmt(d * q, 2)} cm bei ${angle}°.</strong>`,
            ],
            "dBild = q · d",
            { d, q, angle },
          );
        return task(
          `Ein Modell soll dieselbe wahre Tiefe behalten. Im ersten Schrägbild hat es bei q = ${fmt(q, 2)} eine ${fmt(d * q, 2)} cm lange Tiefenkante. Im neuen Bild ist q = 1/2. Bestimme die wahre Tiefe und die neue Bildlänge.`,
          [numberField("wahre Tiefe:", d, "cm", 0), numberField("neue Bildlänge:", d / 2, "cm", 1)],
          [
            `Zuerst die Verkürzung rückgängig machen: d = ${fmt(d * q, 2)} / ${fmt(q, 2)} = ${d}.`,
            `<strong>Wahre Tiefe ${d} cm; neue Bildlänge ${fmt(d / 2, 1)} cm.</strong>`,
          ],
          undefined,
          { d, q, angle },
        );
      },
    },
  ],
});

const trueSize = defineLesson("rg-5-wahre-groesse", {
  subtitle: "Eine Körperfläche aus dem Schrägbild herauslösen",
  whyItMatters:
    "Ein Bildwinkel ist oft verzerrt. Für Messen und Konstruieren brauchst du eine Zeichnung in wahrer Größe.",
  explanationHtml: `<p>Eine im Raum rechteckige Grundfläche erscheint im Schrägbild als Parallelogramm. Der Bildwinkel von 45° ist kein Beleg für einen 45°-Winkel im Körper. Löse die Fläche heraus: Übernimm unverkürzte Längen und teile Tiefenlängen durch q. Zeichne dann die ursprüngliche Figur mit ihren echten Winkeln.</p><div class="example">Bei q = 1/2 ist eine gezeichnete Tiefe von 3 cm in Wirklichkeit 6 cm lang. Eine Grundfläche mit Vorderkante 4 cm wird als Rechteck 4 cm × 6 cm gezeichnet. Dort kannst du Diagonalen und Winkel mit dem Geodreieck messen.</div><div class="merke">Zeichne die Grundfläche aus dem Labor in wahrer Größe. Zeichne eine Diagonale und miss ihre Länge sowie den Winkel zur Vorderkante. Vergleiche beide Werte mit dem verzerrten Schrägbild und erkläre die Abweichung.</div>`,
  formulas: [
    {
      name: "Wahre Tiefe",
      html: "d = d<sub>Bild</sub> / q",
      quantities: "Winkel der ursprünglichen Figur werden aus der Körperbeschreibung übernommen.",
    },
  ],
  quiz: {
    question:
      "Eine rechteckige Grundfläche zeigt im Schrägbild einen Winkel von 45°. Wie groß ist der echte Innenwinkel?",
    options: ["45°", "90°", "22,5°"],
    correctIndex: 1,
    explanation:
      "Die Figur ist ein Rechteck. Die 45° beschreiben nur die Projektion der Tiefenachse.",
  },
  lab: {
    kind: "true-size",
    title: "Schrägbild und wahre Grundfläche",
    intro:
      "Links ist die projizierte Grundfläche, rechts dieselbe Fläche in wahrer Größe. Beide Zeichnungen verwenden denselben Längenmaßstab vor der Tiefenverkürzung.",
    params: [
      range("width", "Vorderkante", 2, 8, 4, 1, "cm"),
      range("depth", "wahre Tiefe", 2, 8, 6, 1, "cm"),
      range("q", "Verzerrungsmaßstab q", 0.25, 1, 0.5, 0.25),
    ],
    readouts: [
      {
        key: "drawn",
        label: "Bildtiefe links",
        unit: "cm",
        digits: 2,
        compute: (v) => v.depth * v.q,
      },
      { key: "actual", label: "Wahre Tiefe rechts", unit: "cm", compute: (v) => v.depth },
      { key: "angle", label: "Wahrer Innenwinkel", unit: "°", compute: () => 90 },
    ],
    goals: [
      {
        id: "rueckweg",
        text: "Vergleiche Vorderkante 5 cm und Tiefe 8 cm bei q = 1/4.",
        check: (v) => v.width === 5 && v.depth === 8 && v.q === 0.25,
      },
      {
        id: "unverkuerzt",
        text: "Stelle q = 1 bei Vorderkante 5 cm und Tiefe 8 cm ein. Auch dann sind die Bildwinkel verzerrt.",
        check: (v) => v.width === 5 && v.depth === 8 && v.q === 1,
      },
    ],
  },
  exercises: [
    {
      id: "wahre-laenge",
      make: (rng, level) => {
        const width = rng.int(3, 9),
          depth = rng.int(4, 12),
          q = rng.pick([0.25, 0.5, 0.75]);
        return task(
          `${level === 1 ? "Eine rechteckige Grundfläche" : "Für ein passgenaues Bodenstück rekonstruierst du eine rechteckige Grundfläche"}: Im Schrägbild ist die Vorderkante ${width} cm lang und die Tiefenkante ${fmt(depth * q, 2)} cm. Es gilt q = ${fmt(q, 2)}. Gib die wahre Tiefe${level === 2 ? " und die Fläche des Bodenstücks" : " und den wahren Innenwinkel"} an.`,
          [
            numberField("wahre Tiefe:", depth, "cm", 0),
            level === 1
              ? numberField("Innenwinkel:", 90, "°", 0)
              : numberField("Fläche:", width * depth, "cm²", 0),
          ],
          [
            `Die wahre Tiefe ist ${fmt(depth * q, 2)} / ${fmt(q, 2)} = ${depth} cm.`,
            `<strong>${level === 1 ? "Innenwinkel 90°" : `Fläche ${width} · ${depth} = ${width * depth} cm²`}.</strong> Zeichne die Fläche in wahrer Größe und miss eine Diagonale.`,
          ],
          level === 1 ? "d = dBild / q" : undefined,
          { width, depth, q },
        );
      },
    },
  ],
});

export const STAGE_RAUM = stage("raumgeometrie", [
  solidSymmetry,
  axial,
  coordinates,
  oblique,
  trueSize,
]);
