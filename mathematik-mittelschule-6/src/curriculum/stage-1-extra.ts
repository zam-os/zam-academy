import { fmt, frac, fracText, round } from "../exercises/format";
import {
  choice as c,
  fractionFields,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

export const teilen = makeLesson(1, 12, 2, {
  id: "br-durch-natuerliche-zahl",
  title: "1.12 Einen Bruch gerecht teilen",
  subtitle: "Division durch eine natürliche Zahl",
  whyItMatters:
    "Du möchtest eine Teilmenge gerecht auf mehrere Personen verteilen. Dafür teilst du einen Bruch durch eine natürliche Zahl.",
  explanationHtml: `<p>Teilst du einen Bruch durch eine natürliche Zahl größer als 0, teilst du jeden seiner Teile noch einmal auf. Du kannst dazu den <strong>Nenner mit der Anzahl der Personen multiplizieren</strong>. Der Zähler bleibt zunächst gleich. Kürze das Ergebnis.</p><div class="example">¾ l Saft werden auf 3 Personen verteilt: ¾ : 3 = 3/12 = ¼. Jede Person bekommt ¼ l. Die Probe ist 3 · ¼ l = ¾ l.</div><p>Wenn sich der Zähler durch die Personenzahl teilen lässt, geht es auch einfacher: 6/7 : 3 = 2/7. Beide Wege ergeben denselben Wert. Hier teilen wir durch natürliche Zahlen; die Division durch einen beliebigen Bruch gehört nicht zu diesem Lernschritt.</p><div class="merke"><strong>Merke:</strong> a/b : n = a/(b · n), n größer als 0. Kürzen und mit der Multiplikation prüfen. Durch 0 wird niemals geteilt.</div>`,
  formulas: [
    {
      name: "Bruch durch natürliche Zahl",
      html: `${frac("a", "b")} : n = ${frac("a", "b · n")}`,
      quantities: "b und n sind nicht 0; n ist eine natürliche Zahl.",
    },
  ],
  quiz: {
    question: "Was ist 3/4 : 3?",
    options: ["1/4", "9/4", "3/7"],
    correctIndex: 0,
    explanation:
      "3/4 : 3 = 3/12 = 1/4. Drei solche Anteile ergeben wieder 3/4.",
  },
  lab: lab(
    "divide-natural",
    "Eine Menge verteilen",
    "Der obere Streifen zeigt die Gesamtmenge. Darunter siehst du den Anteil einer Person.",
    [
      r("z", "Zähler", 1, 8, 1),
      r("d", "Nenner", 2, 8, 2),
      r("k", "Personen", 2, 6, 2),
    ],
    [
      o("anteil", "Pro Person", (v) => fracText(v.z, v.d * v.k)),
      o("probe", "Probe: Personen · Anteil", (v) => fracText(v.z, v.d)),
    ],
    [
      goal("viertel", "Teile 3/4 auf 3 Personen.", { z: 3, d: 4, k: 3 }),
      goal("siebtel", "Teile 6/7 auf 3 Personen.", { z: 6, d: 7, k: 3 }),
      goal("achtel", "Teile 1/2 auf 4 Personen.", { z: 1, d: 2, k: 4 }),
    ],
  ),
  exercises: [
    {
      id: "verteilen",
      make: (rng, level) => {
        const d = rng.pick([3, 4, 5, 6, 8]),
          z = rng.int(1, d - 1),
          k = rng.int(2, 6);
        return task(
          level,
          `Berechne ${frac(z, d)} : ${k}. Gib das Ergebnis vollständig gekürzt an.`,
          `${frac(z, d)} l Saft werden gerecht auf ${k} gleich große Becher verteilt. Welcher Bruchteil eines Liters kommt in einen Becher? Gib den gekürzten Bruch an.`,
          fractionFields(z, d * k),
          "Multipliziere den Nenner mit der Zahl der Portionen.",
          `${frac(z, d)} : ${k} = ${frac(z, d * k)}. Jetzt vollständig kürzen.`,
          `Jede Portion ist ${fracText(z, d * k)}${level === 2 ? " l" : ""}.`,
          { z, d, k },
        );
      },
    },
    {
      id: "probe",
      make: (rng, level) => {
        const d = rng.pick([3, 5, 7, 8]),
          k = rng.int(2, 5),
          z = rng.int(1, 3),
          total = k * z;
        return task(
          level,
          `Teile ${frac(total, d)} durch ${k}. Kürze den Bruch vollständig.`,
          `${k} Kinder teilen ${frac(total, d)} Tafeln Schokolade gerecht. Gib den Anteil pro Kind als gekürzten Bruch an und berechne zur Probe die gesamte Menge als Dezimalzahl auf drei Stellen gerundet.`,
          [
            ...fractionFields(z, d),
            ...(level === 2
              ? [num("Gesamtmenge zur Probe:", total / d, "Tafeln", 3)]
              : []),
          ],
          "Du kannst hier den Zähler direkt durch die Kinderzahl teilen.",
          `${total} : ${k} = ${z}, also ${frac(z, d)} pro Kind. Probe: ${k} · ${frac(z, d)} = ${frac(total, d)}.`,
          `${fracText(z, d)} pro Kind.`,
          { z, d, k },
        );
      },
    },
  ],
});

export const regeln = makeLesson(1, 13, 2, {
  id: "br-rechenregeln-runden",
  title: "1.13 Rechenregeln und sinnvolles Runden",
  subtitle: "Darstellung wählen, Klammern beachten und erst am Ende runden",
  whyItMatters:
    "Bei 0,25 + ¾ hilft der Darstellungswechsel. In einer Sachaufgabe muss auch die Genauigkeit passen.",
  explanationHtml: `<p>Wähle die günstigere Darstellung: 0,25 + ¾ wird mit ¼ + ¾ = 1 besonders einfach. Für 2,4 € + 1,35 € ist die Dezimalschreibweise praktisch. Bei Brüchen rechnest du möglichst exakt weiter.</p><p>Auch hier gilt: Klammer vor Punkt vor Strich. Bei Plus und Mal darfst du vertauschen und anders zusammenfassen. Rechne 0,25 + 0,6 + 0,75 als (0,25 + 0,75) + 0,6 = 1,6.</p><div class="example">0,5 + 3 · 0,25 = 0,5 + 0,75 = 1,25. Mit Klammer: (0,5 + 3) · 0,25 = 0,875. Auf Hundertstel gerundet wird daraus 0,88: Die Tausendstelziffer 5 rundet auf.</div><p>Runde erst das Endergebnis auf die geforderte Stelle. Ein Geldbetrag wird üblicherweise auf Cent angegeben; die Zahl der Nachkommastellen allein sagt noch nicht, wie genau gemessen wurde.</p><div class="merke"><strong>Merke:</strong> Günstige Darstellung wählen, Reihenfolge beachten, erst am Ende in sinnvoller Genauigkeit runden.</div>`,
  formulas: [
    {
      name: "Reihenfolge",
      html: "Klammer → Punkt → Strich",
      quantities: "Gleichrangige Operationen von links nach rechts.",
    },
    {
      name: "Runden",
      html: "0 bis 4 abrunden; 5 bis 9 aufrunden",
      quantities: "Die erste wegfallende Ziffer entscheidet.",
    },
  ],
  quiz: {
    question: "Was ergibt 0,5 + 3 · 0,25?",
    options: ["1,25", "0,875", "3,75"],
    correctIndex: 0,
    explanation: "Erst 3 · 0,25 = 0,75, dann 0,5 dazu: 1,25.",
  },
  lab: lab(
    "order",
    "Klammern und Kommazahlen",
    "Vergleiche die Werte mit und ohne Klammern. Beobachte danach die Rundung auf Hundertstel.",
    [
      r("a", "a", 0.1, 3, 0.2, 0.1),
      r("b", "b", 1, 6, 2),
      r("c", "c", 0.05, 1, 0.2, 0.05),
      c("mode", "Term", ["a + b · c", "(a + b) · c"]),
    ],
    [
      o(
        "wert",
        "Exakter Termwert",
        (v) => (v.mode === 0 ? v.a + v.b * v.c : (v.a + v.b) * v.c),
        "",
        3,
      ),
      o("rund", "Auf Hundertstel", (v) =>
        fmt(v.mode === 0 ? v.a + v.b * v.c : (v.a + v.b) * v.c, 2),
      ),
    ],
    [
      goal("ohne", "Berechne 0,5 + 3 · 0,25.", {
        a: 0.5,
        b: 3,
        c: 0.25,
        mode: 0,
      }),
      goal("mit", "Berechne (0,5 + 3) · 0,25 und runde auf Hundertstel.", {
        a: 0.5,
        b: 3,
        c: 0.25,
        mode: 1,
      }),
      goal("halb", "Berechne (1 + 2) · 0,5.", { a: 1, b: 2, c: 0.5, mode: 1 }),
    ],
  ),
  exercises: [
    {
      id: "reihenfolge",
      make: (rng, level) => {
        const a = rng.int(1, 9) / 10,
          b = rng.int(2, 8),
          c0 = rng.pick([0.25, 0.5, 0.75]),
          value = level === 1 ? a + b * c0 : (a + b) * c0;
        return task(
          level,
          `Berechne ${fmt(a)} + ${b} · ${fmt(c0)}. Gib das Ergebnis genau an.`,
          `Ein Rechteck ist ${fmt(a + b)} m lang und ${fmt(c0)} m breit. Seine Länge setzt sich aus ${fmt(a)} m und ${b} m zusammen. Berechne den Flächeninhalt und runde auf Hundertstel.`,
          [
            num(
              "Ergebnis:",
              level === 1 ? value : round(value, 2),
              level === 1 ? "" : "m²",
              level === 1 ? 3 : 2,
            ),
          ],
          "Punkt vor Strich; eine Klammer fasst die ganze Länge zusammen.",
          level === 1
            ? `Zuerst ${b} · ${fmt(c0)} = ${fmt(b * c0)}, dann ${fmt(a)} dazu.`
            : `(${fmt(a)} + ${b}) · ${fmt(c0)} = ${fmt(value, 3)}. Die dritte Nachkommastelle entscheidet.`,
          `${fmt(value, level === 1 ? 3 : 2)}${level === 2 ? " m²" : ""}.`,
          { a, b, c: c0 },
        );
      },
    },
    {
      id: "darstellung",
      make: (rng, level) => {
        const p = rng.pick([1, 2, 3]),
          whole = rng.int(2, 8),
          result = level === 1 ? 1 : whole;
        return task(
          level,
          `Berechne ${fmt(p / 4)} + ${frac(4 - p, 4)}. Wähle eine günstige Darstellung.`,
          `Für ein Rezept brauchst du ${fmt(p / 4)} kg einer Zutat und ${frac(4 - p, 4)} kg einer zweiten. Du bereitest die ${whole}-fache Menge zu. Wie viele Kilogramm beider Zutaten brauchst du zusammen?`,
          [num("Gesamt:", result, level === 2 ? "kg" : "", 0)],
          "Schreibe beide Anteile als Viertel. Zusammen ergeben sie ein Ganzes.",
          `${frac(p, 4)} + ${frac(4 - p, 4)} = 1.${level === 2 ? ` Dann ${whole} · 1 kg.` : ""}`,
          `${result}${level === 2 ? " kg" : ""}.`,
          { p, whole },
        );
      },
    },
  ],
});
