import {
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

const volumen = makeLesson(7, 1, null, {
  id: "gl-volumen-rueckwaerts",
  title: "7.1 Volumen rückwärts berechnen",
  subtitle: "Unbekannte Höhe durch Probieren und Umkehren finden",
  whyItMatters:
    "Wenn die Grundfläche einer Kiste feststeht, kannst du aus ihrem Volumen die nötige Höhe bestimmen.",
  explanationHtml: `<p>Bei einem Quader gilt V = a · b · h. Ein Buchstabe kann eine unbekannte Länge darstellen. Halte die beiden bekannten Längen fest und probiere für h geordnet verschiedene Werte.</p><div class="example">Eine Kiste hat a = 4 dm, b = 3 dm und V = 60 dm³. Bei h = 1 ist das Volumen 12, bei h = 2 sind es 24, bei h = 5 sind es 60 dm³. Rückwärts: 60 : (4 · 3) = 5. Die Höhe ist 5 dm. Probe: 4 · 3 · 5 = 60.</div><p>Ein Zahlenrätsel kann genauso aufgebaut sein: „Multipliziere meine Zahl zuerst mit 4, dann mit 3; du erhältst 60.“ Auch hier findest du 5 durch zwei Umkehraufgaben. Die Einheit kommt aus der Situation hinzu.</p><div class="merke"><strong>Merke:</strong> Gesuchte Höhe = Volumen : Grundflächeninhalt. Gleiche Einheiten herstellen und das Ergebnis in die Ausgangsformel einsetzen.</div>`,
  formulas: [
    {
      name: "Unbekannte Höhe",
      html: "h = V : (a · b)",
      quantities:
        "a, b und h Längen; V Volumen; Grundfläche a · b ist nicht 0.",
    },
  ],
  quiz: {
    question: "V = 48 cm³, a = 4 cm, b = 3 cm. Wie hoch ist der Quader?",
    options: ["4 cm", "41 cm", "4 cm³"],
    correctIndex: 0,
    explanation:
      "Grundfläche 4 · 3 = 12 cm². 48 : 12 = 4 cm. Probe: 4 · 3 · 4 = 48 cm³.",
  },
  lab: lab(
    "inverse-volume",
    "Die passende Höhe finden",
    "Suche durch Probieren die passende Höhe. Vergleiche Grundfläche und Volumen.",
    [
      r("a", "Länge", 1, 8, 2),
      r("b", "Breite", 1, 8, 2),
      r("h", "Höhenversuch", 1, 10, 2),
    ],
    [
      o("grund", "Grundfläche", (v) => v.a * v.b, "dm²", 0),
      o("volumen", "Volumen", (v) => v.a * v.b * v.h, "dm³", 0),
    ],
    [
      goal(
        "sechzig",
        "Finde bei Länge 4 dm und Breite 3 dm die Höhe für 60 dm³.",
        { a: 4, b: 3, h: 5 },
      ),
      goal(
        "achtundvierzig",
        "Finde bei Länge 4 dm und Breite 3 dm die Höhe für 48 dm³.",
        { a: 4, b: 3, h: 4 },
      ),
      goal("wuerfel", "Finde einen Würfel mit 27 dm³ Volumen.", {
        a: 3,
        b: 3,
        h: 3,
      }),
    ],
  ),
  exercises: [
    {
      id: "hoehe",
      make: (rng, level) => {
        const a = rng.int(2, 8),
          b = rng.int(2, 7),
          h = rng.int(2, 9),
          v = a * b * h;
        return task(
          level,
          `Ein Quader hat V = ${v} dm³, a = ${a} dm und b = ${b} dm. Bestimme die Höhe durch die Umkehraufgabe.`,
          `Ein rechteckiger Behälter mit Innenmaßen ${a} dm × ${b} dm am Boden soll ${v} l Wasser fassen. Wie hoch muss er innen mindestens sein? Gib die Höhe in cm an.`,
          [
            num(
              "Höhe:",
              level === 1 ? h : h * 10,
              level === 1 ? "dm" : "cm",
              0,
            ),
          ],
          "1 l = 1 dm³. Teile das Volumen durch die Grundfläche.",
          `${a} · ${b} = ${a * b} dm²; ${v} : ${a * b} = ${h} dm.${level === 2 ? ` Das sind ${h * 10} cm.` : ""}`,
          `${level === 1 ? h : h * 10} ${level === 1 ? "dm" : "cm"}. Probe: ${a} · ${b} · ${h} = ${v}.`,
          { a, b, h, v },
        );
      },
    },
    {
      id: "raetsel",
      make: (rng, level) => {
        const a = rng.int(2, 6),
          b = rng.int(2, 6),
          x = rng.int(2, 12),
          result = a * b * x;
        return task(
          level,
          `Eine Zahl wird mit ${a} und danach mit ${b} multipliziert. Das Ergebnis ist ${result}. Welche Zahl ist gesucht?`,
          `Eine Kiste hat das Volumen ${result} cm³. Zwei ihrer Innenkanten sind ${a} cm und ${b} cm lang. Finde die dritte Kante und prüfe, ob die Kiste ein Würfel ist.`,
          [
            num("Gesuchte Zahl / Kante:", x, level === 1 ? "" : "cm", 0),
            ...(level === 2
              ? [
                  {
                    kind: "choice" as const,
                    label: "Würfel?",
                    options: ["ja", "nein"],
                    correctIndex: a === b && b === x ? 0 : 1,
                  },
                ]
              : []),
          ],
          "Mache die beiden Multiplikationen durch Division rückgängig.",
          `${result} : ${b} = ${a * x}; ${a * x} : ${a} = ${x}. Probe: ${a} · ${b} · ${x} = ${result}.`,
          `Gesucht ist ${x}${level === 2 ? ` cm. ${a === b && b === x ? "Alle Kanten sind gleich." : "Die Kanten sind nicht alle gleich."}` : "."}`,
          { a, b, x, result },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  7,
  "Zahlenrätsel und fehlende Quadermaße mit der Probe sichern",
  "#a16207",
  "x",
  [volumen],
);
