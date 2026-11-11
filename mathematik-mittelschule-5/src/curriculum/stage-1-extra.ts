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

const n = (x: number) => fmt(x, 0);
export const folgen = makeLesson(1, 8, 1, {
  id: "nz-folgen",
  title: "1.8 Zahlenfolgen untersuchen",
  subtitle: "Gleiche Schritte erkennen und eigene Folgen bilden",
  whyItMatters:
    "Mit einer Regel beschreibst du viele Zahlen auf einmal. Prüfe die Regel an jedem Übergang.",
  explanationHtml: `<p>Bei einer Zahlenfolge stehen Zahlen in einer festen Reihenfolge. Prüfe, ob bei <strong>jedem Schritt dieselbe Zahl addiert oder subtrahiert</strong> wird. Manchmal wird jedes Mal mit derselben Zahl multipliziert. Sage deine Regel mit Worten und teste sie an allen gegebenen Übergängen.</p><div class="example">980, 995, 1.010, 1.025: Die Differenz ist immer 15. Danach kommen 1.040 und 1.055. Bei 3, 6, 12, 24 wird dagegen immer verdoppelt; danach kommt 48.</div><p>Denke dir selbst einen Startwert und eine Regel aus. Eine endliche Liste kann mehrere Fortsetzungen haben. In einer Aufgabe mit der Vorgabe „immer derselbe Summand“ muss deine Regel diese Vorgabe erfüllen.</p><div class="merke"><strong>Merke:</strong> Nicht nur den ersten Schritt prüfen. Eine passende Regel erklärt jeden vorgegebenen Übergang.</div>`,
  formulas: [
    {
      name: "Gleichbleibender Schritt",
      html: "nächste Zahl = jetzige Zahl + Schritt",
      quantities: "Bei rückwärts laufenden Folgen wird der Schritt abgezogen.",
    },
  ],
  quiz: {
    question:
      "Welche Zahl folgt bei immer demselben Summanden auf 980, 995, 1.010, 1.025?",
    options: ["1.040", "1.035", "2.050"],
    correctIndex: 0,
    explanation: "Jeder Übergang bedeutet + 15. Also 1.025 + 15 = 1.040.",
  },
  lab: lab(
    "sequence",
    "Eine Regel, fünf Zahlen",
    "Ändere Start, Schritt und Regel. Vergleiche die fünf Folgenglieder.",
    [
      r("start", "Startzahl", 2, 1000, 10),
      r("step", "Schritt oder Faktor", 2, 100, 3),
      c("mode", "Regel", ["addieren", "multiplizieren"]),
    ],
    [
      o("folge", "Folge", (v) =>
        Array.from({ length: 5 }, (_, i) =>
          n(v.mode === 0 ? v.start + i * v.step : v.start * v.step ** i),
        ).join("; "),
      ),
    ],
    [
      goal("fuenfzehn", "Erzeuge 980; 995; 1.010; 1.025; 1.040.", {
        start: 980,
        step: 15,
        mode: 0,
      }),
      goal("verdoppeln", "Erzeuge 3; 6; 12; 24; 48.", {
        start: 3,
        step: 2,
        mode: 1,
      }),
      goal(
        "hunderter",
        "Beginne bei 500 und zähle in Hunderterschritten weiter.",
        { start: 500, step: 100, mode: 0 },
      ),
    ],
  ),
  exercises: [
    {
      id: "schritte",
      make: (rng, level) => {
        const start = rng.int(100, 900) * (level === 1 ? 1 : 1000),
          step = rng.int(2, 19) * (level === 1 ? 5 : 100),
          backwards = rng.pick([true, false]);
        const a = backwards ? start + 5 * step : start,
          direction = backwards ? -1 : 1,
          result = a + 4 * step * direction;
        return task(
          level,
          `Immer derselbe Schritt: ${[0, 1, 2, 3].map((i) => n(a + i * step * direction)).join("; ")}; … Welche Zahl folgt?`,
          `Ein Zähler zeigt nacheinander ${[0, 1, 2].map((i) => n(a + i * step * direction)).join("; ")}. Er ändert sich immer gleich. Welche Zahl zeigt er zwei Schritte nach dem letzten Wert?`,
          [num("Zahl:", result, "", 0)],
          "Bestimme die Differenz zweier Nachbarn und prüfe sie nochmals.",
          `Jeder Schritt bedeutet ${backwards ? "−" : "+"} ${n(step)}. Vom Start aus brauchst du vier Schritte.`,
          `Die gesuchte Zahl ist ${n(result)}.`,
          { start: a, step, direction, steps: 4 },
        );
      },
    },
    {
      id: "faktor",
      make: (rng, level) => {
        const start = rng.int(2, 8),
          factor = rng.int(2, 4),
          count = level === 1 ? 3 : 4,
          result = start * factor ** count;
        return task(
          level,
          `Die Folge wird immer mit derselben Zahl multipliziert: ${start}; ${start * factor}; ${start * factor * factor}; … Welche Zahl folgt?`,
          `Ein Muster beginnt mit ${start} Punkten. Jede nächste Figur enthält ${factor}-mal so viele Punkte wie die vorige. Wie viele Punkte enthält die fünfte Figur?`,
          [num("Punkte:", result, "", 0)],
          "Vom ersten zum nächsten Bild zählt ein Schritt.",
          `${count} Schritte: ${Array.from({ length: count + 1 }, (_, i) => n(start * factor ** i)).join(" → ")}.`,
          `Es sind ${n(result)} Punkte.`,
          { start, factor, steps: count },
        );
      },
    },
  ],
});

export const regeln = makeLesson(1, 9, 2, {
  id: "nz-rechenregeln",
  title: "1.9 Rechenregeln und Rechenvorteile",
  subtitle: "Klammern, Punkt vor Strich, Vertauschen und Verbinden",
  whyItMatters:
    "Die Reihenfolge verhindert Missverständnisse. Passendes Zusammenfassen macht Kopfrechnen leichter.",
  explanationHtml: `<p>Rechne zuerst <strong>Klammern</strong>, dann Multiplikation und Division, zuletzt Addition und Subtraktion. Gleichrangige Rechnungen bearbeitest du von links nach rechts.</p><p>Beim Addieren und Multiplizieren darfst du Zahlen vertauschen (Kommutativgesetz) und anders zusammenfassen (Assoziativgesetz). Das gilt nicht allgemein für Subtraktion und Division.</p><div class="example">2 + 3 · 4 = 2 + 12 = 14. Mit Klammer: (2 + 3) · 4 = 20. Ein Rechenvorteil: 25 + 37 + 75 = (25 + 75) + 37 = 137. Und 25 · 3 · 4 = (25 · 4) · 3 = 300.</div><div class="merke"><strong>Merke:</strong> Klammer vor Punkt vor Strich. Vertauschen und Verbinden helfen bei Plus und Mal, nicht beliebig bei Minus und Geteilt.</div>`,
  formulas: [
    {
      name: "Reihenfolge",
      html: "Klammer → Punkt → Strich",
      quantities: "Bei gleichem Rang von links nach rechts.",
    },
    {
      name: "Rechenvorteil",
      html: "a + b = b + a; (a + b) + c = a + (b + c)",
      quantities: "Beide Gesetze gelten auch für Multiplikation.",
    },
  ],
  quiz: {
    question: "Was ergibt 8 + 2 · 5?",
    options: ["18", "50", "40"],
    correctIndex: 0,
    explanation: "Zuerst 2 · 5 = 10, dann 8 + 10 = 18.",
  },
  lab: lab(
    "order",
    "Eine Klammer verändert den Wert",
    "Vergleiche dieselben drei Zahlen mit und ohne Klammer.",
    [
      r("a", "a", 1, 20, 3),
      r("b", "b", 1, 20, 4),
      r("c", "c", 2, 10, 2),
      c("mode", "Term", ["a + b · c", "(a + b) · c"]),
    ],
    [
      o("wert", "Termwert", (v) =>
        v.mode === 0 ? v.a + v.b * v.c : (v.a + v.b) * v.c,
      ),
    ],
    [
      goal("punkt", "Berechne 2 + 3 · 4 ohne Klammer.", {
        a: 2,
        b: 3,
        c: 4,
        mode: 0,
      }),
      goal("klammer", "Berechne (2 + 3) · 4.", { a: 2, b: 3, c: 4, mode: 1 }),
      goal("dreissig", "Stelle 10 + 5 · 4 ein: Der Wert ist 30.", {
        a: 10,
        b: 5,
        c: 4,
        mode: 0,
      }),
    ],
  ),
  exercises: [
    {
      id: "reihenfolge",
      make: (rng, level) => {
        const a = rng.int(2, 15),
          b = rng.int(2, 12),
          c0 = rng.int(2, 9),
          answer = level === 1 ? a + b * c0 : (a + b) * c0;
        return task(
          level,
          `Berechne den Term ${a} + ${b} · ${c0}. Achte auf die Reihenfolge.`,
          `Für ${c0} Gruppen kaufst du jeweils ${a} rote und ${b} blaue Hefte. Wie viele Hefte sind das insgesamt? Stelle dir für jede Gruppe eine Klammer vor.`,
          [
            num("Ergebnis:", answer, "", 0, {
              slips: [
                {
                  value: level === 1 ? (a + b) * c0 : a + b * c0,
                  hint: "Prüfe, ob die Klammer nur eine Zahl oder die ganze Summe vervielfacht.",
                },
              ],
            }),
          ],
          "Klammer zuerst, dann Mal, dann Plus.",
          level === 1
            ? `Zuerst ${b} · ${c0} = ${b * c0}. Dann ${a} dazu.`
            : `Je Gruppe ${a} + ${b} = ${a + b}. Dann ${c0} Gruppen.`,
          `Das Ergebnis ist ${answer}.`,
          { a, b, c: c0 },
        );
      },
    },
    {
      id: "vorteil",
      make: (rng, level) => {
        const a = rng.int(15, 85),
          b = 100 - a,
          c0 = rng.int(13, 67),
          result = level === 1 ? 100 + c0 : 100 * c0;
        return task(
          level,
          `Rechne geschickt im Kopf: ${a} + ${c0} + ${b}. Welche beiden Zahlen fasst du zuerst zusammen?`,
          `Ein Stand verkauft ${c0} Tage lang täglich ${a} kleine und ${b} große Brezeln. Wie viele Brezeln verkauft er insgesamt? Nutze die runde Tagessumme.`,
          [num("Gesamtzahl:", result, "", 0)],
          "Fasse die beiden Zahlen zusammen, die 100 ergeben.",
          `${a} + ${b} = 100. ${level === 1 ? `Dazu ${c0}.` : `Das ${c0}-mal.`}`,
          `Es sind ${n(result)}.`,
          { a, b, c: c0 },
        );
      },
    },
  ],
});
