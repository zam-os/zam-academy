import { fmt } from "../exercises/format";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

const units = ["mm²", "cm²", "dm²", "m²"];
export const einheiten = makeLesson(4, 4, null, {
  id: "fl-flaecheneinheiten",
  title: "4.4 Flächeneinheiten umrechnen",
  subtitle: "Quadratmillimeter bis Quadratmeter",
  whyItMatters:
    "Zwei Flächen kannst du erst vergleichen oder addieren, wenn sie in derselben Einheit stehen.",
  explanationHtml: `<p>Ein Flächeninhalt zählt Einheitsquadrate. Bei <strong>mm², cm², dm² und m²</strong> ist der Schritt zur Nachbareinheit immer der Faktor 100. Denn ein Quadrat von 1 dm Seitenlänge ist 10 cm lang und 10 cm breit: Darin liegen 100 Quadrate von 1 cm².</p><div class="example">3 m² = 300 dm². Umgekehrt sind 450 cm² = 4 dm² 50 cm². Für die Summe 2 dm² + 75 cm² rechnest du zuerst 2 dm² = 200 cm² und erhältst 275 cm².</div><p>Eine Briefmarke misst du eher in cm², ein Zimmer in m². Schätze zuerst: Ein Zimmer von 20 m² kann nicht nur 200 cm² groß sein.</p><div class="merke"><strong>Merke:</strong> Zur kleineren Nachbareinheit mal 100, zur größeren durch 100. Bei Längen sind es dagegen 10.</div>`,
  formulas: [
    {
      name: "Flächenstufen",
      html: "1 m² = 100 dm²; 1 dm² = 100 cm²; 1 cm² = 100 mm²",
      quantities: "Eine Stufe bedeutet zehn Reihen mit je zehn Quadraten.",
    },
  ],
  quiz: {
    question: "Wie viele cm² sind 3 dm²?",
    options: ["300 cm²", "30 cm²", "3.000 cm²"],
    correctIndex: 0,
    explanation: "Je dm² sind es 100 cm², also 3 · 100 = 300.",
  },
  lab: lab(
    "area-units-ms",
    "Hundert kleine Quadrate",
    "Wähle eine große Einheit und ihre kleine Nachbareinheit. Das Raster zeigt die Umrechnung eines Einheitsquadrats.",
    [
      r("amount", "Maßzahl", 1, 10, 1),
      c("unit", "Von", ["cm² nach mm²", "dm² nach cm²", "m² nach dm²"]),
    ],
    [
      o(
        "wert",
        "In der kleineren Einheit",
        (v) => `${v.amount * 100} ${units[v.unit]}`,
      ),
    ],
    [
      goal("cm", "Rechne 3 cm² in mm² um.", { amount: 3, unit: 0 }),
      goal("dm", "Rechne 5 dm² in cm² um.", { amount: 5, unit: 1 }),
      goal("m", "Rechne 2 m² in dm² um.", { amount: 2, unit: 2 }),
    ],
  ),
  exercises: [
    {
      id: "nachbar",
      make: (rng, level) => {
        const k = rng.int(0, 2),
          amount = rng.int(2, 45),
          remainder = rng.int(1, 99);
        return task(
          level,
          `Rechne ${amount} ${units[k + 1]} in die kleine Nachbareinheit ${units[k]} um.`,
          `Eine Fläche misst ${amount} ${units[k + 1]} und ${remainder} ${units[k]}. Wie groß ist die gesamte Fläche in ${units[k]}?`,
          [
            num(
              "Fläche:",
              amount * 100 + (level === 2 ? remainder : 0),
              units[k],
              0,
              {
                slips: [
                  {
                    value: amount * 10 + (level === 2 ? remainder : 0),
                    hint: "Bei Flächen hat jede Stufe den Faktor 100, nicht 10.",
                  },
                ],
              },
            ),
          ],
          "Je Stufe zur kleineren Einheit mal 100.",
          `${amount} · 100 = ${amount * 100}.${level === 2 ? ` Dazu ${remainder}.` : ""}`,
          `${fmt(amount * 100 + (level === 2 ? remainder : 0), 0)} ${units[k]}.`,
          { amount, remainder, k },
        );
      },
    },
    {
      id: "grosse-einheit",
      make: (rng, level) => {
        const k = rng.int(0, 2),
          amount = rng.int(2, 40),
          other = rng.int(2, 15);
        return task(
          level,
          `Eine Fläche ist ${amount * 100} ${units[k]} groß. Gib ihren Inhalt in der großen Nachbareinheit ${units[k + 1]} an.`,
          `Zwei Platten haben Flächeninhalte von ${amount * 100} ${units[k]} und ${other} ${units[k + 1]}. Wie groß ist die Gesamtfläche in ${units[k + 1]}?`,
          [num("Fläche:", amount + (level === 2 ? other : 0), units[k + 1], 0)],
          "Je Stufe zur größeren Einheit durch 100.",
          `${amount * 100} : 100 = ${amount}.${level === 2 ? ` Dann ${amount} + ${other}.` : ""}`,
          `${amount + (level === 2 ? other : 0)} ${units[k + 1]}.`,
          { amount, other, k },
        );
      },
    },
  ],
});
