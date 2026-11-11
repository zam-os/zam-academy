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

export const aenderungen = makeLesson(2, 3, null, {
  id: "gz-zustandsaenderungen",
  title: "2.3 Zustand und Änderung",
  subtitle: "Eine ganze Startzahl, ein natürlicher Änderungsbetrag",
  whyItMatters:
    "−3 °C beschreibt einen Zustand. „Es wird um 5 Grad wärmer“ beschreibt eine Änderung.",
  explanationHtml: `<p>Das <strong>Vorzeichen</strong> gehört zur Startzahl: −3 °C liegt unter dem Gefrierpunkt. Das <strong>Rechenzeichen</strong> beschreibt die Änderung. Wird es um 5 Grad wärmer, rechnest du −3 + 5; wird es 5 Grad kälter, rechnest du −3 − 5.</p><p>Markiere den Start auf der Zahlengeraden. Für Plus gehst du den positiven Änderungsbetrag nach rechts, für Minus nach links. Ein Pfeil verbindet Start und Ziel.</p><div class="example">Morgens −3 °C, dann 5 Grad wärmer: −3 + 5 = 2, also 2 °C. Danach 7 Grad kälter: 2 − 7 = −5, also −5 °C. Die Probe −5 + 7 = 2 führt zurück.</div><p>Formuliere selbst eine passende Geschichte und erkläre, warum der Pfeil in diese Richtung zeigt. Prüfe, ob dein Endwert zur Geschichte passt.</p><div class="merke"><strong>Merke:</strong> Ziel = Start + Änderung nach oben beziehungsweise Start − Änderung nach unten. Der Änderungsbetrag ist hier eine natürliche Zahl.</div>`,
  formulas: [
    {
      name: "Änderungen",
      html: "a + b oder a − b",
      quantities: "a ganze Zahl; b natürlicher Änderungsbetrag.",
    },
  ],
  quiz: {
    question: "Es sind −4 °C. Es wird um 6 Grad wärmer. Welche Rechnung passt?",
    options: ["−4 + 6 = 2", "4 + 6 = 10", "−4 − 6 = −10"],
    correctIndex: 0,
    explanation:
      "Der Start bleibt −4; wärmer bedeutet nach rechts, also plus 6.",
  },
  lab: lab(
    "int-add",
    "Start und Pfeil",
    "Ziehe den Startpunkt und wähle Richtung und Betrag. Der grüne Punkt zeigt den Endzustand.",
    [
      r("a", "Start", -15, 15, 2),
      r("b", "Änderungsbetrag", 1, 15, 3),
      c("op", "Änderung", ["wärmer / höher", "kälter / tiefer"]),
    ],
    [o("ziel", "Endzustand", (v) => v.a + (v.op === 0 ? v.b : -v.b))],
    [
      goal("uebernull", "Starte bei −3 und gehe 5 nach rechts.", {
        a: -3,
        b: 5,
        op: 0,
      }),
      goal("unternull", "Starte bei 2 und gehe 7 nach links.", {
        a: 2,
        b: 7,
        op: 1,
      }),
      goal(
        "probe",
        "Prüfe die letzte Änderung: Starte bei −5 und gehe 7 nach rechts.",
        { a: -5, b: 7, op: 0 },
      ),
    ],
  ),
  exercises: [
    {
      id: "temperatur",
      make: (rng, level) => {
        const start = rng.int(-12, 8),
          b = rng.int(2, 12),
          up = rng.pick([true, false]),
          second = rng.int(2, 6),
          first = start + (up ? b : -b),
          answer = first - (level === 2 ? second : 0);
        return task(
          level,
          `Das Thermometer zeigt ${fmt(start, 0)} °C. Es wird ${b} Grad ${up ? "wärmer" : "kälter"}. Welche Temperatur zeigt es danach?`,
          `Morgens sind es ${fmt(start, 0)} °C. Mittags ist es ${b} Grad ${up ? "wärmer" : "kälter"}, abends noch einmal ${second} Grad kälter. Wie warm ist es abends?`,
          [num("Temperatur:", answer, "°C", 0)],
          "Trage den Start ein. Wärmer: rechts. Kälter: links.",
          `${fmt(start, 0)} ${up ? "+" : "−"} ${b} = ${fmt(first, 0)}.${level === 2 ? ` Dann ${fmt(first, 0)} − ${second}.` : ""}`,
          `Es sind ${fmt(answer, 0)} °C.`,
          {
            start,
            amount: b,
            up: Number(up),
            second: level === 2 ? second : 0,
          },
        );
      },
    },
    {
      id: "hoehe",
      make: (rng, level) => {
        const start = -rng.int(2, 20),
          rise = rng.int(3, 25),
          top = start + rise;
        return task(
          level,
          `Ein Taucher befindet sich ${-start} m unter dem Meeresspiegel und steigt ${rise} m auf. Wo liegt er danach relativ zum Meeresspiegel?`,
          `Ein Förderkorb startet bei ${fmt(start, 0)} m und fährt ${rise} m nach oben. Danach fährt er zum Start zurück. Gib die obere Höhe und die Strecke der Rückfahrt an.`,
          [
            num("Höhe:", top, "m", 0),
            ...(level === 2 ? [num("Rückfahrt:", rise, "m", 0)] : []),
          ],
          "Die Höhe darf negativ sein; die gefahrene Strecke ist positiv.",
          `${fmt(start, 0)} + ${rise} = ${fmt(top, 0)}. Die Rückfahrt ist genauso lang wie die Hinfahrt.`,
          `Höhe ${fmt(top, 0)} m${level === 2 ? `; Rückfahrt ${rise} m` : ""}.`,
          { start, rise },
        );
      },
    },
  ],
});
