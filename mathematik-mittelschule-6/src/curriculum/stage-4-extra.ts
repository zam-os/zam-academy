import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

export const kontakt = makeLesson(4, 2, null, {
  id: "of-zusammengesetzte-koerper",
  title: "4.2 Berührungsflächen verschwinden",
  subtitle: "Oberfläche zusammengesetzter Quader und Würfel",
  whyItMatters:
    "Beim Zusammenkleben zweier Körper liegen zwei bisher äußere Flächen innen. Für Farbe oder Papier zählen sie nicht mehr.",
  explanationHtml: `<p>Die Oberfläche ist die Summe aller <strong>äußeren</strong> Begrenzungsflächen. Klebst du zwei Körper zusammen, darfst du ihre Oberflächen nicht einfach addieren. Die Kontaktfläche war vorher bei jedem Körper außen.</p><p>Deshalb ziehst du die <strong>Berührungsfläche zweimal</strong> ab. Eine Zeichnung oder ein Netz hilft dir beim Zählen. Dabei musst du wissen, wie die Körper zusammenliegen.</p><div class="example">Zwei Würfel mit Kantenlänge 3 cm werden flächig zusammengeklebt. Jeder hat 6 · 3 · 3 = 54 cm² Oberfläche. Kontaktfläche: 9 cm². Zusammen: 54 + 54 − 2 · 9 = 90 cm². Das passt auch zum entstandenen Quader 6 cm × 3 cm × 3 cm.</div><div class="merke"><strong>Merke:</strong> Gesamtoberfläche = Summe der Einzeloberflächen − zweimal Kontaktfläche. Gemeint sind vollständige, ebene Kontakte ohne Überlappung des Volumens.</div>`,
  formulas: [
    {
      name: "Kontaktfläche abziehen",
      html: "O = O₁ + O₂ − 2 · K",
      quantities:
        "K gemeinsame Kontaktfläche; O₁, O₂ Oberflächen vor dem Verbinden.",
    },
  ],
  quiz: {
    question: "Warum wird die Kontaktfläche zweimal abgezogen?",
    options: [
      "Weil vorher an jedem der beiden Körper eine Fläche außen war.",
      "Weil jede Fläche eine Vorder- und eine Rückseite hat.",
      "Weil sich beim Kleben auch das Volumen verdoppelt.",
    ],
    correctIndex: 0,
    explanation:
      "Beide aufeinanderliegenden Flächen liegen nach dem Verbinden im Inneren.",
  },
  lab: lab(
    "contact-surface",
    "Zwei Würfel zusammenfügen",
    "Ändere die gemeinsame Kantenlänge. Die Skizze zeigt die beiden Würfel; die Berührungsflächen liegen innen.",
    [r("a", "Würfelkante", 1, 8, 2, 1, "cm")],
    [
      o("einzeln", "Summe vorher", (v) => 12 * v.a ** 2, "cm²", 0),
      o("kontakt", "Kontaktfläche", (v) => v.a ** 2, "cm²", 0),
      o("aussen", "Oberfläche zusammen", (v) => 10 * v.a ** 2, "cm²", 0),
    ],
    [
      goal("drei", "Prüfe zwei Würfel mit Kantenlänge 3 cm: zusammen 90 cm².", {
        a: 3,
      }),
      goal(
        "vier",
        "Prüfe zwei Würfel mit Kantenlänge 4 cm: zusammen 160 cm².",
        { a: 4 },
      ),
      goal("eins", "Prüfe zwei Einheitswürfel: 10 cm² außen.", { a: 1 }),
    ],
  ),
  exercises: [
    {
      id: "wuerfel",
      make: (rng, level) => {
        const a = rng.int(2, 9),
          count = level === 1 ? 2 : 3,
          area = (6 * count - 2 * (count - 1)) * a * a;
        return task(
          level,
          `Zwei Würfel mit Kantenlänge ${a} cm werden an einer ganzen Seitenfläche zusammengeklebt. Berechne die äußere Oberfläche.`,
          `Drei Würfel mit Kantenlänge ${a} cm werden in einer geraden Reihe flächig zusammengeklebt. Wie groß ist die äußere Oberfläche? Zähle die Kontakte.`,
          [num("Oberfläche:", area, "cm²", 0)],
          "Jeder Kontakt nimmt zwei Flächen aus der Oberfläche weg.",
          `${count} · 6 · ${a}² − 2 · ${count - 1} · ${a}² = ${area}.`,
          `${area} cm².`,
          { a, count },
        );
      },
    },
    {
      id: "quader",
      make: (rng, level) => {
        const a = rng.int(2, 8),
          b = rng.int(2, 6),
          h = rng.int(2, 5),
          top = rng.int(1, 4),
          height = h + top,
          area = 2 * (a * b + a * height + b * height);
        return task(
          level,
          `Zwei Quader mit derselben Grundfläche ${a} cm × ${b} cm und den Höhen ${h} cm und ${top} cm stehen passgenau aufeinander. Berechne die Oberfläche des neuen Quaders.`,
          `Zwei Schachteln ohne Zwischenraum haben dieselbe Grundfläche ${a} cm × ${b} cm, die Höhen ${h} cm und ${top} cm. Sie werden passgenau übereinandergestellt und außen vollständig mit Papier beklebt. Wie viel Papier wird ohne Überlappung benötigt?`,
          [num("Papier / Oberfläche:", area, "cm²", 0)],
          "Du kannst die beiden Höhen addieren und den entstandenen Quader berechnen.",
          `Neue Höhe: ${h} + ${top} = ${height}. Oberfläche: 2 · (${a * b} + ${a * height} + ${b * height}).`,
          `${area} cm².`,
          { a, b, h, top },
        );
      },
    },
  ],
});
