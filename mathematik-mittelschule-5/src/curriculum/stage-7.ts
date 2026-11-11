import { fmt } from "../exercises/format";
import {
  choice as c,
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

const raetsel = makeLesson(7, 1, null, {
  id: "gl-zahlenraetsel",
  title: "7.1 Zahlenrätsel lösen",
  subtitle: "Systematisch probieren und mit der Umkehraufgabe prüfen",
  whyItMatters:
    "Ein Buchstabe kann für eine gesuchte Zahl stehen. Durch Probieren und Rückwärtsrechnen findest du sie.",
  explanationHtml: `<p>Eine <strong>Variable</strong>, zum Beispiel x, steht hier für eine gesuchte Zahl. Eine <strong>Gleichung</strong> behauptet, dass zwei Werte gleich sind. Die Lösung macht diese Behauptung wahr.</p><p>Beim systematischen Probieren schreibst du die Versuche geordnet auf. Ist ein Ergebnis zu klein, probierst du bei einer Plusaufgabe einen größeren Wert. Mit der <strong>Umkehraufgabe</strong> kommst du oft schneller ans Ziel.</p><div class="example">„Zu meiner Zahl kommen 7 dazu, dann sind es 19.“ Gleichung: x + 7 = 19. Rückwärts: 19 − 7 = 12. Probe: 12 + 7 = 19. Bei 3 · x = 21 ist die Umkehraufgabe 21 : 3 = 7.</div><div class="merke"><strong>Merke:</strong> Schreibe auf, was x bedeutet. Löse durch geordnetes Probieren oder Umkehren und setze den Wert zur Probe ein.</div>`,
  formulas: [
    {
      name: "Umkehraufgaben",
      html: "x + a = b → x = b − a; a · x = b → x = b : a",
      quantities: "Bei der Division ist a nicht 0.",
    },
  ],
  quiz: {
    question: "Welche Zahl löst x + 8 = 23?",
    options: ["15", "31", "8"],
    correctIndex: 0,
    explanation: "23 − 8 = 15. Probe: 15 + 8 = 23.",
  },
  lab: lab(
    "equation",
    "Versuch und Probe",
    "Wähle eine Zahl für x. Vergleiche die linke Seite mit dem Zielwert 24.",
    [
      r("x", "Versuch für x", 1, 30, 2),
      r("a", "Zahl a", 2, 12, 3),
      c("mode", "Linke Seite", ["x + a", "a · x"]),
    ],
    [
      o("links", "Linke Seite", (v) => (v.mode === 0 ? v.x + v.a : v.a * v.x)),
      o("vergleich", "Vergleich mit 24", (v) => {
        const value = v.mode === 0 ? v.x + v.a : v.a * v.x;
        return value === 24
          ? "gleich: Lösung gefunden"
          : value < 24
            ? "noch zu klein"
            : "noch zu groß";
      }),
    ],
    [
      goal("plus", "Löse x + 7 = 24.", { x: 17, a: 7, mode: 0 }),
      goal("mal", "Löse 3 · x = 24.", { x: 8, a: 3, mode: 1 }),
      goal("andere", "Löse 6 · x = 24.", { x: 4, a: 6, mode: 1 }),
    ],
  ),
  exercises: [
    {
      id: "additiv",
      make: (rng, level) => {
        const x = rng.int(5, 35),
          a = rng.int(5, 25),
          b = x + a,
          second = rng.int(2, 9);
        return task(
          level,
          `Löse das Zahlenrätsel x + ${a} = ${b}. Du kannst systematisch probieren oder die Umkehraufgabe verwenden.`,
          `Ich denke mir eine Zahl, addiere ${a} und danach ${second}. Das Ergebnis ist ${b + second}. Welche Zahl habe ich gedacht?`,
          [num("x =", x, "", 0)],
          "Mache die Rechenschritte in umgekehrter Reihenfolge rückgängig.",
          `${level === 2 ? `${b + second} − ${second} = ${b}; dann ` : ""}${b} − ${a} = ${x}. Probe: ${x} + ${a} = ${b}.`,
          `x = ${x}.`,
          { x, a, b },
        );
      },
    },
    {
      id: "multiplikativ",
      make: (rng, level) => {
        const x = rng.int(4, 20),
          a = rng.int(2, 9),
          total = x * a;
        return task(
          level,
          `Welche Zahl x erfüllt ${a} · x = ${total}? Prüfe mit der Multiplikation.`,
          `${a} gleich große Beutel enthalten zusammen ${total} Murmeln. Jeder Beutel hat denselben Inhalt. Wie viele Murmeln sind in einem Beutel? Beschreibe die Umkehraufgabe.`,
          [num("x =", x, "", 0)],
          "Die Umkehrung des Malnehmens ist das Teilen.",
          `${total} : ${a} = ${x}. Probe: ${a} · ${x} = ${total}.`,
          `x = ${x}.`,
          { x, a, total },
        );
      },
    },
  ],
});

const rechteck = makeLesson(7, 2, null, {
  id: "gl-rechteck-rueckwaerts",
  title: "7.2 Rechtecke rückwärts berechnen",
  subtitle: "Eine fehlende Seite aus Umfang oder Fläche finden",
  whyItMatters:
    "Manchmal kennst du die Fläche eines Zimmers und nur eine Seitenlänge. Eine Umkehraufgabe liefert die andere.",
  explanationHtml: `<p>Beim Rechteck gilt A = a · b und U = 2 · (a + b). Ist eine Seite gesucht, schreibe zuerst auf, ob die Aufgabe eine <strong>Fläche</strong> oder einen <strong>Umfang</strong> vorgibt.</p><div class="example">Ein Rechteck hat A = 24 cm² und a = 6 cm. Probiere für b: 2 ergibt 12, 3 ergibt 18, 4 ergibt 24. Also b = 24 : 6 = 4 cm. Bei U = 20 cm und a = 6 cm: Der halbe Umfang ist 10 cm, also b = 10 − 6 = 4 cm.</div><p>Für ein Quadrat suchst du die Zahl, deren Produkt mit sich selbst die Fläche ergibt. Bei 25 cm² probierst du 4 · 4 = 16 und 5 · 5 = 25; die Seite ist 5 cm. Eine allgemeine Wurzelrechnung brauchst du hier nicht.</p><div class="merke"><strong>Merke:</strong> Fläche gegeben: durch die bekannte Seite teilen. Umfang gegeben: erst halbieren, dann die bekannte Seite abziehen. Immer die Probe rechnen.</div>`,
  formulas: [
    {
      name: "Fehlende Rechteckseite",
      html: "b = A : a; b = U : 2 − a",
      quantities: "a und b Längen; A Flächeninhalt; U Umfang.",
    },
  ],
  quiz: {
    question: "A = 35 cm², a = 7 cm. Wie lang ist b?",
    options: ["5 cm", "28 cm", "5 cm²"],
    correctIndex: 0,
    explanation: "35 : 7 = 5. Die Seite ist eine Länge, also cm.",
  },
  lab: lab(
    "inverse-rectangle",
    "Seiten suchen und prüfen",
    "Ändere Länge und Breite. Suche passende Werte für die angegebenen Flächen und Umfänge.",
    [r("a", "Länge", 1, 12, 3, 1, "cm"), r("b", "Breite", 1, 10, 2, 1, "cm")],
    [
      o("flaeche", "Fläche", (v) => v.a * v.b, "cm²", 0),
      o("umfang", "Umfang", (v) => 2 * (v.a + v.b), "cm", 0),
    ],
    [
      goal("flaeche", "Finde zu a = 6 cm die Breite für A = 24 cm².", {
        a: 6,
        b: 4,
      }),
      goal("umfang", "Finde zu a = 8 cm die Breite für U = 22 cm.", {
        a: 8,
        b: 3,
      }),
      goal("quadrat", "Finde das Quadrat mit A = 25 cm².", { a: 5, b: 5 }),
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const a = rng.int(3, 12),
          b = rng.int(2, 9),
          area = a * b;
        return task(
          level,
          `Ein Rechteck hat die Fläche ${area} cm² und ist ${a} cm lang. Wie breit ist es?`,
          `Ein rechteckiger Garten hat ${area} m² Fläche und ist ${a} m lang. Wie viel Zaun wird einmal rundherum benötigt? Berechne zuerst die fehlende Breite.`,
          [
            num("Breite:", b, level === 1 ? "cm" : "m", 0),
            ...(level === 2 ? [num("Zaun:", 2 * (a + b), "m", 0)] : []),
          ],
          "Teile die Fläche durch die bekannte Länge.",
          `${area} : ${a} = ${b}. Probe: ${a} · ${b} = ${area}.${level === 2 ? ` Umfang: 2 · (${a} + ${b}).` : ""}`,
          `Breite ${b}${level === 2 ? ` m, Zaun ${2 * (a + b)} m` : " cm"}.`,
          { a, b, area },
        );
      },
    },
    {
      id: "umfang",
      make: (rng, level) => {
        const a = rng.int(3, 12),
          b = rng.int(2, 9),
          u = 2 * (a + b);
        return task(
          level,
          `Ein Rechteck hat den Umfang ${u} cm. Eine Seite ist ${a} cm lang. Wie lang ist die andere Seite?`,
          `Ein rechteckiger Bilderrahmen hat einen Umfang von ${u} dm. Er ist ${a} dm breit. Wie groß ist seine rechteckige Innenfläche, wenn die angegebenen Maße unmittelbar die Bildkanten beschreiben?`,
          [
            num(
              level === 1 ? "Andere Seite:" : "Fläche:",
              level === 1 ? b : a * b,
              level === 1 ? "cm" : "dm²",
              0,
            ),
          ],
          "Halbiere den Umfang. Ziehe dann die bekannte Seite ab.",
          `${u} : 2 = ${a + b}; ${a + b} − ${a} = ${b}.${level === 2 ? ` Fläche: ${a} · ${b}.` : ""}`,
          `${fmt(level === 1 ? b : a * b, 0)} ${level === 1 ? "cm" : "dm²"}.`,
          { a, b, u },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  7,
  "Unbekannte Zahlen durch Probieren und Umkehren finden",
  "#a16207",
  "x",
  [raetsel, rechteck],
);
