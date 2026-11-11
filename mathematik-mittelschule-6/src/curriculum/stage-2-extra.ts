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

export const aenderungen = makeLesson(2, 3, 2, {
  id: "rz-zustandsaenderungen",
  title: "2.3 Änderungen mit Kommazahlen",
  subtitle: "Ein rationaler Start und ein positiver Änderungsbetrag",
  whyItMatters:
    "Temperaturen und Kontostände können zwischen zwei ganzen Zahlen liegen und auch unter null fallen.",
  explanationHtml: `<p>Aus Klasse 5 kennst du negative ganze Zahlen. Jetzt beschreiben auch <strong>negative Dezimalzahlen und Brüche</strong> Zustände: −2,5 °C liegt zwischen −3 °C und −2 °C. Jede solche Zahl lässt sich als Bruch ganzer Zahlen schreiben und gehört zu ℚ.</p><p>Für eine positive Änderung gehst du nach rechts, für eine Abnahme um einen positiven Betrag nach links. Der Start darf negativ sein. Hier stehen rechts vom Plus- oder Minuszeichen positive Änderungsbeträge.</p><div class="example">Bei −2,5 °C wird es um 4,2 Grad wärmer: −2,5 + 4,2 = 1,7. Danach kühlt es um 3,4 Grad ab: 1,7 − 3,4 = −1,7. Die Probe −1,7 + 3,4 = 1,7 führt zum vorigen Zustand.</div><div class="merke"><strong>Merke:</strong> Erst den Start eintragen, dann die Richtung festlegen. Prüfe den Endwert an der Zahlengeraden und an der Geschichte.</div>`,
  formulas: [
    {
      name: "Zustandsänderung",
      html: "a + b oder a − b",
      quantities: "a rationaler Startwert, b positiver Änderungsbetrag.",
    },
  ],
  quiz: {
    question:
      "Es sind −1,5 °C, dann wird es um 2,3 Grad wärmer. Wie warm ist es?",
    options: ["0,8 °C", "−3,8 °C", "3,8 °C"],
    correctIndex: 0,
    explanation:
      "Von −1,5 bis 0 fehlen 1,5 Grad. Von den 2,3 bleiben 0,8 Grad übrig.",
  },
  lab: lab(
    "rational-change",
    "Pfeile über die Null",
    "Der erste Punkt ist der Zustand; der Pfeil zeigt die Änderung. Ziehe den Start und wähle den Betrag.",
    [
      r("a", "Start", -5, 5, 1, 0.1),
      r("b", "Betrag", 0.1, 5, 1, 0.1),
      c("op", "Richtung", ["zunehmen", "abnehmen"]),
    ],
    [o("ziel", "Ziel", (v) => v.a + (v.op === 0 ? v.b : -v.b), "", 1)],
    [
      goal("plus", "Rechne −2,5 + 4,2.", { a: -2.5, b: 4.2, op: 0 }),
      goal("minus", "Rechne 1,7 − 3,4.", { a: 1.7, b: 3.4, op: 1 }),
      goal("probe", "Prüfe mit −1,7 + 3,4.", { a: -1.7, b: 3.4, op: 0 }),
    ],
  ),
  exercises: [
    {
      id: "thermometer",
      make: (rng, level) => {
        const a = -rng.int(5, 45) / 10,
          b = rng.int(5, 60) / 10,
          after = a + b,
          c0 = rng.int(5, 25) / 10,
          answer = after - (level === 2 ? c0 : 0);
        return task(
          level,
          `Eine Temperatur von ${fmt(a, 1)} °C steigt um ${fmt(b, 1)} Grad. Berechne die neue Temperatur.`,
          `Morgens sind es ${fmt(a, 1)} °C. Bis mittags steigt die Temperatur um ${fmt(b, 1)} Grad und fällt danach um ${fmt(c0, 1)} Grad. Wie warm ist es am Ende?`,
          [num("Temperatur:", answer, "°C", 1)],
          "Steigen bedeutet plus; fallen bedeutet minus eines positiven Betrags.",
          `${fmt(a, 1)} + ${fmt(b, 1)} = ${fmt(after, 1)}.${level === 2 ? ` Dann ${fmt(after, 1)} − ${fmt(c0, 1)}.` : ""}`,
          `${fmt(answer, 1)} °C.`,
          { a, b, c: level === 2 ? c0 : 0 },
        );
      },
    },
    {
      id: "konto",
      make: (rng, level) => {
        const a = -rng.int(100, 1800) / 100,
          b = rng.int(100, 2500) / 100,
          answer = a + b,
          expense = rng.int(100, 800) / 100;
        return task(
          level,
          `Ein Konto steht bei ${fmt(a, 2)} €. Es werden ${fmt(b, 2)} € eingezahlt. Wie lautet der neue Kontostand?`,
          `Ein Konto steht bei ${fmt(a, 2)} €. Nach einer Einzahlung von ${fmt(b, 2)} € werden ${fmt(expense, 2)} € abgebucht. Wie lautet der Endstand?`,
          [num("Kontostand:", answer - (level === 2 ? expense : 0), "€", 2)],
          "Der Start ist negativ; die Einzahlung ist ein positiver Betrag.",
          `${fmt(a)} + ${fmt(b)} = ${fmt(answer)}.${level === 2 ? ` Danach ${fmt(expense)} abziehen.` : ""}`,
          `${fmt(answer - (level === 2 ? expense : 0))} €.`,
          { a, b, expense: level === 2 ? expense : 0 },
        );
      },
    },
  ],
});

export const wiederholen = makeLesson(2, 4, 2, {
  id: "rz-wiederholte-aenderung",
  title: "2.4 Mehrere gleiche Änderungen",
  subtitle: "Mal als wiederholtes Addieren, Teilen als Umkehrung",
  whyItMatters:
    "Wenn die Temperatur jede Stunde um denselben Betrag fällt, kannst du die Schritte bündeln.",
  explanationHtml: `<p>Eine negative rationale Zahl kannst du als wiederholte Änderung verstehen. Dreimal −1,5 bedeutet: Von 0 dreimal je 1,5 nach links. Das ergibt −4,5. Die <strong>natürliche Zahl 3</strong> zählt die Schritte.</p><p>Die Division ist die Umkehrung: Eine Gesamtänderung von −4,5, gleichmäßig auf 3 Schritte verteilt, bedeutet pro Schritt −1,5. Auch hier teilst du durch eine natürliche Zahl größer als 0.</p><div class="example">Die Temperatur fällt 4 Stunden lang jede Stunde um 0,75 Grad. Gesamtänderung: (−0,75) · 4 = −3. Umgekehrt: −3 : 4 = −0,75. Ein Start von 2 °C führt damit zu −1 °C.</div><div class="merke"><strong>Merke:</strong> Hier gibt die natürliche Zahl die Anzahl der gleichen Schritte an. Eine negative Gesamtänderung bleibt beim Teilen durch eine positive Schrittzahl negativ.</div>`,
  formulas: [
    {
      name: "Gleiche Schritte",
      html: "Gesamtänderung = Änderung je Schritt · Anzahl",
      quantities: "Anzahl natürliche Zahl; bei der Division größer als 0.",
    },
  ],
  quiz: {
    question: "Vier gleiche Änderungen von je −0,5 ergeben zusammen …",
    options: ["−2", "2", "−0,125"],
    correctIndex: 0,
    explanation: "Vier Pfeile je 0,5 nach links führen von 0 zu −2.",
  },
  lab: lab(
    "repeated-change",
    "Gleiche Pfeile",
    "Wähle die Änderung je Schritt und die Zahl der Schritte. Die Pfeile beginnen bei 0.",
    [
      r("a", "Änderung je Schritt", -2, 2, 0.5, 0.25),
      r("k", "Schritte", 1, 6, 2),
    ],
    [
      o("gesamt", "Gesamtänderung", (v) => v.a * v.k),
      o("probe", "Gesamt : Schritte", (v) => v.a),
    ],
    [
      goal("minusdrei", "Zeige vier Schritte von je −0,75.", {
        a: -0.75,
        k: 4,
      }),
      goal("minusviereinhalb", "Zeige drei Schritte von je −1,5.", {
        a: -1.5,
        k: 3,
      }),
      goal("plusdrei", "Zeige sechs Schritte von je 0,5.", { a: 0.5, k: 6 }),
    ],
  ),
  exercises: [
    {
      id: "mal",
      make: (rng, level) => {
        const a = -rng.int(1, 8) / 4,
          k = rng.int(2, 6),
          total = a * k,
          start = rng.int(1, 6);
        return task(
          level,
          `Berechne die Gesamtänderung von ${k} gleichen Schritten mit je ${fmt(a)}. Denke an Pfeile auf der Zahlengeraden.`,
          `Es sind ${start} °C. In den nächsten ${k} Stunden fällt die Temperatur jede Stunde um ${fmt(-a)} Grad. Berechne Gesamtänderung und Endtemperatur.`,
          [
            num("Gesamtänderung:", total, level === 2 ? "Grad" : "", 2),
            ...(level === 2
              ? [num("Endtemperatur:", start + total, "°C", 2)]
              : []),
          ],
          "Multipliziere die Änderung eines Schritts mit der natürlichen Anzahl.",
          `${k} · (${fmt(a)}) = ${fmt(total)}.${level === 2 ? ` Dann ${start} − ${fmt(-total)}.` : ""}`,
          `Gesamt ${fmt(total)}${level === 2 ? ` Grad, Ende ${fmt(start + total)} °C` : ""}.`,
          { a, k, start },
        );
      },
    },
    {
      id: "geteilt",
      make: (rng, level) => {
        const a = -rng.int(1, 12) / 4,
          k = rng.int(2, 6),
          total = a * k;
        return task(
          level,
          `Berechne ${fmt(total)} : ${k}. Nutze die Umkehrung der Multiplikation.`,
          `Ein Kontostand ändert sich in ${k} Tagen um insgesamt ${fmt(total)} €. Jeden Tag wird derselbe Betrag abgebucht. Wie lautet die Änderung pro Tag mit Vorzeichen?`,
          [num("Je Schritt:", a, level === 2 ? "€" : "", 2)],
          "Teile den Betrag durch die Schrittzahl und behalte die Richtung nach links.",
          `${fmt(-total)} : ${k} = ${fmt(-a)}; die Änderung ist negativ. Probe: ${k} · (${fmt(a)}) = ${fmt(total)}.`,
          `${fmt(a)}${level === 2 ? " € pro Tag" : ""}.`,
          { a, k, total },
        );
      },
    },
  ],
});
