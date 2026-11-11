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

const fractions = ["¼", "½", "¾"];
const amounts = [250, 500, 750];
export const schreibweisen = makeLesson(5, 5, null, {
  id: "gr-alltagsbrueche",
  title: "5.5 Alltagsbrüche und Kommaschreibweise",
  subtitle: "Viertel, Halbe und Dreiviertel; Kommas bei Geld und Länge",
  whyItMatters:
    "Du liest ½ l im Rezept, ¾ h im Zeitplan und 1,05 m auf einem Maßband. Dafür brauchst du noch keine allgemeinen Bruchrechenregeln.",
  explanationHtml: `<p><strong>½</strong> ist die Hälfte, <strong>¼</strong> ein Viertel und <strong>¾</strong> sind drei Viertel eines Ganzen. Teile das Ganze in zwei oder vier gleich große Teile. ½ kg = 500 g, ¼ l = 250 ml und ¾ h = 45 min. 1 ½ l sind ein ganzer Liter und ein halber Liter, also 1.500 ml.</p><p>Bei <strong>Geldwerten und Längen</strong> nutzt du auch das Komma. 2,49 € sind 2 € 49 ct. 1,05 m sind 1 m 5 cm. Dabei stehen die Cent beziehungsweise Zentimeter auf zwei Stellen: 1,5 m = 1,50 m = 1 m 50 cm.</p><div class="example">3,75 m = 3 m 75 cm = 375 cm = 3 ¾ m. Eine halbe Stunde sind 30 min; eine Dreiviertelstunde sind 45 min.</div><div class="merke"><strong>Merke:</strong> Das Ganze legt fest, wie groß ein Viertel ist. Eine Viertelstunde hat 15 min, ein Viertelliter 250 ml.</div>`,
  formulas: [
    {
      name: "Feste Alltagsbrüche",
      html: "¼ h = 15 min; ½ h = 30 min; ¾ h = 45 min",
      quantities: "Eine Stunde hat 60 Minuten, ein Liter 1.000 Milliliter.",
    },
    {
      name: "Komma",
      html: "1,05 m = 105 cm; 2,49 € = 249 ct",
      quantities: "Geld und Länge: Stelle und Einheit beachten.",
    },
  ],
  quiz: {
    question: "Wie viele Minuten sind eine Dreiviertelstunde?",
    options: ["45 min", "75 min", "40 min"],
    correctIndex: 0,
    explanation:
      "Eine Stunde hat 60 Minuten. Ein Viertel sind 15, drei Viertel 45 Minuten.",
  },
  lab: lab(
    "everyday-parts",
    "Gleicher Anteil, andere Einheit",
    "Wähle Viertel, Hälfte oder Dreiviertel und das Ganze. Vergleiche die Werte.",
    [
      c("part", "Anteil", fractions),
      c("kind", "Ganzes", ["1 Liter", "1 Kilogramm", "1 Stunde"]),
      r("whole", "Zusätzliche Ganze", 0, 3, 0),
    ],
    [
      o(
        "wert",
        "In kleiner Einheit",
        (v) =>
          `${v.kind === 2 ? v.whole * 60 + (v.part + 1) * 15 : v.whole * 1000 + amounts[v.part]} ${v.kind === 2 ? "min" : v.kind === 1 ? "g" : "ml"}`,
      ),
    ],
    [
      goal("halb-liter", "Stelle einen halben Liter ein.", {
        part: 1,
        kind: 0,
        whole: 0,
      }),
      goal("dreiviertel", "Stelle eine Dreiviertelstunde ein.", {
        part: 2,
        kind: 2,
        whole: 0,
      }),
      goal("eineinhalb", "Stelle eineinhalb Kilogramm ein.", {
        part: 1,
        kind: 1,
        whole: 1,
      }),
    ],
  ),
  exercises: [
    {
      id: "anteile",
      make: (rng, level) => {
        const p = rng.int(0, 2),
          k = rng.int(0, 2),
          whole = level === 1 ? 0 : rng.int(1, 3),
          big = ["l", "kg", "h"][k],
          small = ["ml", "g", "min"][k],
          unit = k === 2 ? 60 : 1000,
          value = whole * unit + (unit * (p + 1)) / 4;
        return task(
          level,
          `Schreibe ${fractions[p]} ${big} in der kleineren Einheit ${small}.`,
          `Auf einem Vorrats- oder Zeitplan stehen ${whole} ${fractions[p]} ${big}. Wie viel ist das insgesamt in ${small}?`,
          [num("Betrag:", value, small, 0)],
          "Teile ein Ganzes in vier gleich große Teile.",
          `${unit} : 4 = ${unit / 4}. ${p + 1} solche Teile ergeben ${((p + 1) * unit) / 4}.${whole ? ` Dazu ${whole} Ganze.` : ""}`,
          `${fmt(value, 0)} ${small}.`,
          { p, k, whole },
        );
      },
    },
    {
      id: "komma",
      make: (rng, level) => {
        const whole = rng.int(1, 8),
          small = rng.int(1, 99),
          money = rng.pick([true, false]),
          bigUnit = money ? "€" : "m",
          smallUnit = money ? "ct" : "cm",
          total = whole * 100 + small;
        return task(
          level,
          `Schreibe ${whole} ${bigUnit} ${small} ${smallUnit} mit Komma in ${bigUnit}.`,
          `Ein ${money ? "Preis" : "Brett"} ist mit ${fmt(total / 100, 2)} ${bigUnit} angegeben. Es kommen ${money ? "15 ct Verpackung" : "15 cm Verlängerung"} dazu. Wie viel ist das insgesamt in ${smallUnit}?`,
          [
            num(
              "Betrag:",
              level === 1 ? total / 100 : total + 15,
              level === 1 ? bigUnit : smallUnit,
              level === 1 ? 2 : 0,
            ),
          ],
          "Ein Euro hat 100 Cent, ein Meter 100 Zentimeter.",
          `${whole} · 100 + ${small} = ${total} ${smallUnit}.${level === 2 ? " Dazu 15." : " Die kleine Einheit steht auf zwei Nachkommastellen."}`,
          `${fmt(level === 1 ? total / 100 : total + 15, 2)} ${level === 1 ? bigUnit : smallUnit}.`,
          { whole, small },
        );
      },
    },
  ],
});
