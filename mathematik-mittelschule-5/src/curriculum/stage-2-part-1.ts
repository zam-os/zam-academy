import { fmt } from "../exercises/format";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { numberField as num, choiceField as pick } from "./helpers";

const n0 = (value: number) => fmt(value, 0);
const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(2, step, null, content);

const negativeZahlen = L(1, {
  id: "gz-1-negative-zahlen",
  title: "2.1 Warum negative Zahlen?",
  subtitle: "Temperatur, Kontostand und Stockwerke",
  whyItMatters:
    "3 − 5 hat in den natürlichen Zahlen keine Lösung. Trotzdem kann es morgens 3 °C haben und abends 5 Grad kälter sein.",
  explanationHtml: `<p>Mit natürlichen Zahlen kannst du nicht jede Subtraktion ausführen: 3 − 5 geht nicht. Darum <strong>erweitern</strong> wir den Zahlenbereich um die <strong>negativen Zahlen</strong> −1, −2, −3, … Zusammen mit der 0 und den positiven Zahlen ergeben sie die <strong>ganzen Zahlen</strong> ℤ = {…; −2; −1; 0; 1; 2; …}.</p><p>Negative Zahlen beschreiben alles, was unter einem Nullpunkt liegt: Temperaturen unter 0 °C, Schulden auf dem Konto, Stockwerke unter dem Erdgeschoss, Orte unter dem Meeresspiegel, die Tordifferenz einer Mannschaft.</p><div class="example">Morgens 3 °C, bis zum Abend 5 Grad kälter: 3 − 5 = −2. Abends sind es −2 °C. Wer 20 € auf dem Konto hat und 50 € abhebt, steht bei −30 €.</div><div class="merke"><strong>Merke:</strong> Ganze Zahlen reichen in beide Richtungen ohne Ende. Die 0 selbst ist weder positiv noch negativ.</div>`,
  formulas: [
    {
      name: "Ganze Zahlen",
      html: "ℤ = {…; −2; −1; 0; 1; 2; …}",
      quantities: "ℕ ist ein Teil davon.",
    },
  ],
  quiz: {
    question: "Warum reichen die natürlichen Zahlen nicht aus?",
    options: [
      "Weil zum Beispiel 3 − 5 keine natürliche Zahl ergibt.",
      "Weil es nur endlich viele natürliche Zahlen gibt.",
      "Weil man natürliche Zahlen nicht addieren kann.",
    ],
    correctIndex: 0,
    explanation:
      "Das Ergebnis −2 liegt außerhalb von ℕ. Mit den ganzen Zahlen geht jede Subtraktion auf.",
  },
  lab: lab(
    "thermometer",
    "Unter der Null",
    "Wähle eine Situation und ziehe den Wert. Du siehst, wann die Zahl negativ wird.",
    [
      c("ctx", "Situation", ["Temperatur", "Kontostand", "Stockwerk"]),
      r("t", "Wert", -20, 30, 5),
    ],
    [
      o("art", "Art der Zahl", (v) =>
        v.t < 0 ? "negativ" : v.t > 0 ? "positiv" : "weder noch",
      ),
      o("satz", "Bedeutung", (v) => {
        if (v.ctx === 0)
          return v.t < 0
            ? `${-v.t} Grad unter dem Gefrierpunkt`
            : `${v.t} Grad über dem Gefrierpunkt`;
        if (v.ctx === 1)
          return v.t < 0 ? `${-v.t} € Schulden` : `${v.t} € Guthaben`;
        return v.t < 0
          ? `${-v.t}. Untergeschoss`
          : v.t === 0
            ? "Erdgeschoss"
            : `${v.t}. Obergeschoss`;
      }),
    ],
    [
      {
        id: "frost",
        text: "Stelle starken Frost ein: −12 °C.",
        check: (v) => v.ctx === 0 && v.t === -12,
      },
      {
        id: "schulden",
        text: "Stelle 20 € Schulden ein.",
        check: (v) => v.ctx === 1 && v.t === -20,
      },
      {
        id: "keller",
        text: "Fahre mit dem Aufzug in das 3. Untergeschoss.",
        check: (v) => v.ctx === 2 && v.t === -3,
      },
    ],
  ),
  exercises: [
    {
      id: "temperatur",
      make: (rng, level) => {
        const start = rng.int(1, 9),
          drop = start + rng.int(1, 9);
        const end = start - drop;
        if (level === 1)
          return task(
            level,
            `Am Morgen zeigt das Thermometer ${start} °C. Bis zum Abend wird es ${drop} Grad kälter. Wie warm ist es dann?`,
            "",
            [
              num("Temperatur:", end, "°C", 0, {
                slips: [
                  {
                    value: -end,
                    hint: "Das Ergebnis liegt unter null. Vergiss das Minuszeichen nicht.",
                  },
                ],
              }),
            ],
            `Rechne ${start} − ${drop}.`,
            `Bis 0 °C ${start === 1 ? "ist es" : "sind es"} ${start} Grad. Dann ${drop - start === 1 ? "fehlt" : "fehlen"} noch ${drop - start} Grad.`,
            `Es sind ${n0(end)} °C.`,
            { start, drop },
          );
        const rise = rng.int(3, 15);
        return task(
          level,
          "",
          `In der Nacht hat es ${n0(end)} °C. Bis zum Mittag steigt die Temperatur um ${rise} Grad, am Abend fällt sie wieder um ${drop} Grad. Welche Temperatur ist am Abend?`,
          [num("Temperatur:", end + rise - drop, "°C", 0)],
          "Rechne Schritt für Schritt auf der Zahlengeraden.",
          `${n0(end)} + ${rise} = ${n0(end + rise)}, dann ${n0(end + rise)} − ${drop} = ${n0(end + rise - drop)}.`,
          `Am Abend sind es ${n0(end + rise - drop)} °C.`,
          { end, rise, drop },
        );
      },
    },
    {
      id: "situation",
      make: (rng, level) => {
        const amount = rng.int(5, 90);
        const items = [
          [`${amount} € Schulden`, -amount],
          [`${amount} € Guthaben`, amount],
          [`${amount} m unter dem Meeresspiegel`, -amount],
          [`${amount} m über dem Meeresspiegel`, amount],
        ] as const;
        const [label, value] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Schreibe „${label}“ als ganze Zahl.`,
            "",
            [
              num("Zahl:", value, "", 0, {
                slips: [
                  {
                    value: -value,
                    hint: "Prüfe das Vorzeichen: Liegt der Wert über oder unter der Null?",
                  },
                ],
              }),
            ],
            "Unter der Null: negativ. Über der Null: positiv.",
            `„${label}“ liegt ${value < 0 ? "unter" : "über"} dem Nullpunkt.`,
            `Die Zahl ist ${n0(value)}.`,
            { value },
          );
        const pay = amount + rng.int(5, 60);
        return task(
          level,
          "",
          `Auf dem Konto von Lena sind ${amount} €. Sie bezahlt ein Rad für ${pay} €. Wie sieht der Kontostand danach aus?`,
          [
            num("Kontostand:", amount - pay, "€", 0, {
              slips: [
                {
                  value: pay - amount,
                  hint: "Dann hätte Lena Guthaben. Sie hat aber mehr ausgegeben, als da war.",
                },
              ],
            }),
          ],
          "Mehr ausgegeben als da war: negativer Kontostand.",
          `${amount} − ${pay} = ${n0(amount - pay)}.`,
          `Der Kontostand ist ${n0(amount - pay)} €.`,
          { amount, pay },
        );
      },
    },
  ],
});

const zahlengerade = L(2, {
  id: "gz-3-zahlengerade",
  title: "2.2 Die Zahlengerade",
  subtitle: "Ablesen, vergleichen und passend einteilen",
  whyItMatters:
    "Auf der Zahlengeraden wird dir schnell klar, warum −10 kleiner ist als −2, obwohl die 10 größer aussieht.",
  explanationHtml: `<p>Die <strong>Zahlengerade</strong> verlängert den Zahlenstrahl nach links. Rechts von der Null stehen die positiven, links die negativen Zahlen. Auch hier gilt: Weiter rechts bedeutet größer.</p><p>Darum ist bei negativen Zahlen die mit dem größeren Betrag die <strong>kleinere</strong>: −10 &lt; −2. Jede negative Zahl ist kleiner als jede positive. Wie beim Zahlenstrahl klärst du zuerst den Wert eines Teilstrichs und wählst eine <strong>Skalierung</strong>, auf die alle Zahlen passen.</p><div class="example">Ordne −40, 15, −5 und 0: Die Reihenfolge ist −40 &lt; −5 &lt; 0 &lt; 15. Passend ist eine Einteilung mit 5 pro Strich.</div><div class="merke"><strong>Merke:</strong> Rechts ist immer größer. Bei negativen Zahlen gilt: je größer der Betrag, desto kleiner die Zahl.</div>`,
  formulas: [
    {
      name: "Vergleich",
      html: "−10 &lt; −2 &lt; 0 &lt; 3",
      quantities: "Von links nach rechts wird es größer.",
    },
  ],
  quiz: {
    question: "Was ist richtig?",
    options: ["−8 < −3", "−8 > −3", "−3 < −8"],
    correctIndex: 0,
    explanation: "−8 liegt links von −3 und ist daher die kleinere Zahl.",
  },
  lab: lab(
    "integer-line",
    "Zwei Punkte vergleichen",
    "Wähle die Einteilung und ziehe beide Punkte. Unten steht das richtige Vergleichszeichen.",
    [
      c("scale", "Ein Teilstrich", ["1", "5", "10", "100"]),
      r("a", "Strich von a", -10, 10, -3),
      r("b", "Strich von b", -10, 10, 2),
    ],
    [
      o("a", "a", (v) => n0(v.a * [1, 5, 10, 100][v.scale])),
      o("b", "b", (v) => n0(v.b * [1, 5, 10, 100][v.scale])),
      o("abstand", "Abstand", (v) =>
        n0(Math.abs(v.a - v.b) * [1, 5, 10, 100][v.scale]),
      ),
    ],
    [
      {
        id: "beide-negativ",
        text: "Zeige −40 < −10 mit der Einteilung 10.",
        check: (v) => v.scale === 2 && v.a === -4 && v.b === -1,
      },
      {
        id: "hundert",
        text: "Zeige −300 < 200 mit der Einteilung 100.",
        check: (v) => v.scale === 3 && v.a === -3 && v.b === 2,
      },
      {
        id: "gleich",
        text: "Lege beide Punkte auf −25.",
        check: (v) => v.scale === 1 && v.a === -5 && v.b === -5,
      },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const step =
          level === 1 ? rng.pick([1, 2, 5]) : rng.pick([25, 50, 100]);
        const k = rng.sign() * rng.int(1, 9);
        const value = k * step;
        const strokes = `${Math.abs(k)} ${Math.abs(k) === 1 ? "Strich" : "Striche"}`;
        return task(
          level,
          `Auf einer Zahlengeraden bedeutet ein Teilstrich ${step}. Ein Punkt liegt ${strokes} ${k < 0 ? "links" : "rechts"} von der Null. Welche Zahl ist das?`,
          `Eine Skala für Höhen zeigt 0 m auf Meereshöhe, ein Strich bedeutet ${step} m. ${k < 0 ? "Ein U-Boot" : "Ein Berggipfel"} liegt ${strokes} ${k < 0 ? "unter" : "über"} der Null. Welche Höhe ist das?`,
          [
            num("Zahl:", value, level === 1 ? "" : "m", 0, {
              slips: [
                {
                  value: -value,
                  hint: "Prüfe die Seite: Liegt der Punkt links oder rechts der Null?",
                },
                {
                  value: k,
                  hint: "Du hast nur die Striche gezählt. Multipliziere noch mit dem Wert eines Strichs.",
                },
              ],
            }),
          ],
          "Anzahl der Striche · Wert eines Strichs, Vorzeichen nach der Seite.",
          `${Math.abs(k)} · ${step} = ${Math.abs(value)}, ${k < 0 ? "negativ" : "positiv"}.`,
          `Die Zahl ist ${n0(value)}.`,
          { step, k },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        const scale = level === 1 ? 1 : 100;
        const a = -rng.int(2, 12) * scale,
          b = -rng.int(13, 30) * scale,
          d = rng.int(1, 9) * scale;
        const smallest = Math.min(a, b, d);
        if (level === 1) {
          const [x, y] = rng.shuffle([a, b]);
          const sign = x < y ? 0 : 1;
          return task(
            level,
            `Welches Zeichen gehört zwischen ${n0(x)} und ${n0(y)}?`,
            "",
            [pick(`${n0(x)} … ${n0(y)}`, ["<", ">", "="], sign)],
            "Die weiter rechts liegende Zahl ist größer.",
            `${n0(Math.min(x, y))} liegt weiter links als ${n0(Math.max(x, y))}.`,
            `${n0(x)} ${sign === 0 ? "<" : ">"} ${n0(y)}`,
            { x, y },
          );
        }
        const heights = rng.shuffle([a, b, d]);
        return task(
          level,
          "",
          `An drei Messpunkten im Meer und an Land werden die Höhen ${heights.map(n0).join(" m, ")} m gemessen. Welcher Messpunkt liegt am tiefsten, und wie groß ist der Abstand zum höchsten?`,
          [
            num("Tiefster Punkt:", smallest, "m", 0, {
              slips: [
                {
                  value: a,
                  hint: "Bei negativen Zahlen ist die mit dem größeren Betrag die kleinere.",
                },
              ],
            }),
            num("Abstand:", d - b, "m", 0),
          ],
          "Am weitesten links liegt der tiefste Punkt.",
          `Von ${n0(b)} bis 0 sind es ${n0(-b)} m, dann noch ${n0(d)} m.`,
          `Tiefster Punkt ${n0(b)} m, Abstand ${n0(d - b)} m`,
          { a, b, d },
        );
      },
    },
  ],
});

export const LESSONS = [negativeZahlen, zahlengerade];
