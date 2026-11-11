import { fmt } from "../exercises/format";
import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num, choiceField as pick } from "./helpers";

export const mittel = makeLesson(6, 3, null, {
  id: "da-arithmetisches-mittel",
  title: "6.3 Durchschnitt verstehen",
  subtitle: "Arithmetisches Mittel und seine Aussagekraft",
  whyItMatters:
    "Ein Durchschnitt fasst mehrere Messwerte zusammen. Dabei können Unterschiede und Ausreißer unsichtbar werden.",
  explanationHtml: `<p>Das <strong>arithmetische Mittel</strong> erhältst du, indem du alle Werte addierst und die Summe durch die Anzahl der Werte teilst. Anschaulich verteilst du die Gesamtsumme gleichmäßig.</p><div class="example">Vier Messwerte lauten 2, 4, 6 und 8. Summe: 20; Anzahl: 4; Mittel: 20 : 4 = 5. Der Wert 5 muss nicht unter den gemessenen Werten vorkommen.</div><p>Bei 2, 4, 6 und 28 beträgt das Mittel 10. Der einzelne große Wert zieht es nach oben. Prüfe deshalb immer auch die einzelnen Daten und die Frage: Beschreibt der Durchschnitt eine typische Situation?</p><p>Nur vergleichbare Größen gehören zusammen. Bei unterschiedlich großen Gruppen darfst du Gruppenmittel nicht einfach gleich gewichten: Drei Kinder mit je 2 Büchern und ein Kind mit 10 Büchern haben zusammen 16 Bücher, also im Mittel 4.</p><div class="merke"><strong>Merke:</strong> Mittel = Summe : Anzahl. Ausreißer und unterschiedliche Gruppengrößen beachten; gleiche Mittelwerte können ganz verschiedene Daten verbergen.</div>`,
  formulas: [
    {
      name: "Arithmetisches Mittel",
      html: "Mittel = Summe aller Werte : Anzahl der Werte",
      quantities:
        "Es muss mindestens ein Wert vorliegen; alle Werte beschreiben dieselbe Größe.",
    },
  ],
  quiz: {
    question: "Welches Mittel haben 2, 4, 6 und 8?",
    options: ["5", "20", "6"],
    correctIndex: 0,
    explanation: "Die Summe 20 wird durch die vier Werte geteilt: 5.",
  },
  lab: lab(
    "mean",
    "Gleichmäßig verteilen",
    "Verändere vier Messwerte. Die waagrechte Linie zeigt das arithmetische Mittel.",
    [
      r("a", "Wert 1", 0, 30, 2),
      r("b", "Wert 2", 0, 30, 3),
      r("c", "Wert 3", 0, 30, 4),
      r("d", "Wert 4", 0, 30, 7),
    ],
    [
      o("summe", "Summe", (v) => v.a + v.b + v.c + v.d, "", 0),
      o("mittel", "Mittel", (v) => (v.a + v.b + v.c + v.d) / 4),
    ],
    [
      goal("fuenf", "Stelle 2, 4, 6 und 8 ein: Mittel 5.", {
        a: 2,
        b: 4,
        c: 6,
        d: 8,
      }),
      goal(
        "ausreisser",
        "Ändere den letzten Wert auf 28: Das Mittel steigt auf 10.",
        { a: 2, b: 4, c: 6, d: 28 },
      ),
      goal(
        "gleich",
        "Erzeuge denselben Mittelwert 5 mit vier gleichen Werten.",
        { a: 5, b: 5, c: 5, d: 5 },
      ),
    ],
  ),
  exercises: [
    {
      id: "berechnen",
      make: (rng, level) => {
        const list = Array.from({ length: level === 1 ? 4 : 5 }, () =>
            rng.int(2, 25),
          ),
          sum = list.reduce((a, b) => a + b, 0),
          mean = sum / list.length;
        return task(
          level,
          `Berechne das arithmetische Mittel der Werte ${list.join("; ")}. Runde bei Bedarf auf eine Nachkommastelle.`,
          `An fünf Tagen wurden am Fahrradständer ${list.join("; ")} Fahrräder gezählt. Wie viele waren es im Durchschnitt pro Tag? Runde auf eine Nachkommastelle.`,
          [num("Durchschnitt:", mean, level === 2 ? "Fahrräder" : "", 1)],
          "Addiere alle Werte und teile durch ihre Anzahl.",
          `Summe ${sum}; Anzahl ${list.length}; ${sum} : ${list.length} = ${fmt(mean, 1)}.`,
          `Das Mittel ist ${fmt(mean, 1)}.`,
          { sum, count: list.length },
        );
      },
    },
    {
      id: "aussagekraft",
      make: (rng, level) => {
        const low = rng.int(2, 6),
          high = low + rng.int(12, 24),
          mean = (3 * low + high) / 4;
        return task(
          level,
          `Vier Kinder besitzen ${low}, ${low}, ${low} und ${high} Bücher. Berechne die mittlere Bücherzahl und beurteile die Aussage „Alle vier besitzen ungefähr gleich viele“.`,
          `Drei Kinder besitzen je ${low} Bücher, ein viertes besitzt ${high}. Bestimme das Mittel über alle vier Kinder und beurteile, ob der große Einzelwert den Durchschnitt nach oben zieht.`,
          [
            num("Mittel:", mean, "Bücher", 2),
            pick(
              "Beurteilung:",
              level === 1
                ? [
                    "Die Aussage passt nicht: ein Wert ist deutlich größer.",
                    "Die Aussage passt: der Mittelwert macht alle Werte gleich.",
                  ]
                : [
                    "Ja, der große Einzelwert zieht das Mittel nach oben.",
                    "Nein, ein einzelner Wert verändert den Durchschnitt nie.",
                  ],
              0,
            ),
          ],
          "Ein Mittelwert beschreibt nicht automatisch jedes einzelne Kind.",
          `(${low} + ${low} + ${low} + ${high}) : 4 = ${fmt(mean)}. Drei Werte liegen unter dem Mittel, einer darüber.`,
          `Mittel ${fmt(mean)}; die Verteilung ist ungleich.`,
          { low, high },
        );
      },
    },
  ],
});
