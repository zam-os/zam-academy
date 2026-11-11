import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num } from "./helpers";

export const bauten = makeLesson(5, 5, null, {
  id: "rg-wuerfelbauten-ansichten",
  title: "5.5 Würfelbauten und Ansichten",
  subtitle: "Bauplan, Vorderansicht und versteckte Würfel",
  whyItMatters:
    "Eine Ansicht zeigt nicht automatisch alle Würfel. Ein Bauplan mit Stapelhöhen gibt dir mehr Informationen.",
  explanationHtml: `<p>Ein Bauplan von oben kann für jedes Feld die Zahl der aufeinanderliegenden Einheitswürfel angeben. Bei einem Bau ohne Lücken addierst du diese <strong>Stapelhöhen</strong>, um alle Würfel zu zählen.</p><p>In der Vorderansicht verdeckt ein vorderer Stapel unter Umständen einen hinteren. Die sichtbare Höhe einer Spalte ist die <strong>größte Höhe</strong> entlang dieser Blickrichtung. Aus einer einzigen Vorderansicht lässt sich die Würfelzahl deshalb oft nicht eindeutig bestimmen.</p><div class="example">Ein 2 × 2-Bauplan hat vorne die Höhen 1 und 2, hinten 3 und 1. Insgesamt: 1 + 2 + 3 + 1 = 7 Würfel. Von vorne siehst du die Spaltenhöhen 3 und 2, von rechts die Reihenhöhen 2 und 3.</div><p>Baue diese Anordnung mit Würfeln nach. Zeichne Vorderansicht, Seitenansicht und Ansicht von oben und prüfe, welche Würfel verdeckt werden. In der App verändern die vier Regler die Stapelhöhen.</p><div class="merke"><strong>Merke:</strong> Volumen aus dem Bauplan: Höhen addieren. Ansicht: entlang der Blickrichtung die größte Höhe suchen.</div>`,
  formulas: [
    {
      name: "Würfelzahl",
      html: "Anzahl = Summe aller Stapelhöhen",
      quantities:
        "Voraussetzung: jeder Stapel ist vom Boden an lückenlos gebaut.",
    },
  ],
  quiz: {
    question:
      "Ein 2 × 2-Bauplan hat die Höhen 1, 2, 3 und 1. Wie viele Würfel sind es?",
    options: ["7", "4", "6"],
    correctIndex: 0,
    explanation: "Alle Stapel werden addiert: 1 + 2 + 3 + 1 = 7.",
  },
  lab: lab(
    "cube-stacks",
    "Vier Felder, vier Stapel",
    "Der Bauplan gibt alle Stapelhöhen an. Die Vorderansicht steht rechts daneben. Jeder Würfel ist ein Einheitswürfel.",
    [
      r("a", "Vorne links", 0, 4, 1),
      r("b", "Vorne rechts", 0, 4, 1),
      r("c", "Hinten links", 0, 4, 1),
      r("d", "Hinten rechts", 0, 4, 1),
    ],
    [
      o("zahl", "Würfelzahl", (v) => v.a + v.b + v.c + v.d, "", 0),
      o(
        "vorne",
        "Vorderansicht links | rechts",
        (v) => `${Math.max(v.a, v.c)} | ${Math.max(v.b, v.d)}`,
      ),
      o(
        "rechts",
        "Von rechts: vorne | hinten",
        (v) => `${Math.max(v.a, v.b)} | ${Math.max(v.c, v.d)}`,
      ),
    ],
    [
      goal("sieben", "Baue vorne 1 | 2 und hinten 3 | 1: insgesamt 7 Würfel.", {
        a: 1,
        b: 2,
        c: 3,
        d: 1,
      }),
      goal(
        "verdeckt",
        "Baue vorne 3 | 3 und hinten 1 | 1. Von vorne bleiben die hinteren Stapel verdeckt.",
        { a: 3, b: 3, c: 1, d: 1 },
      ),
      goal("quader", "Baue einen Quader mit vier Stapeln der Höhe 3.", {
        a: 3,
        b: 3,
        c: 3,
        d: 3,
      }),
    ],
  ),
  exercises: [
    {
      id: "bauplan",
      make: (rng, level) => {
        const a = rng.int(1, 4),
          b = rng.int(1, 4),
          c0 = rng.int(1, 4),
          d = rng.int(1, 4),
          total = a + b + c0 + d;
        return task(
          level,
          `Ein lückenloser Würfelbau hat im Bauplan vorne die Höhen ${a} | ${b} und hinten ${c0} | ${d}. Wie viele Einheitswürfel sind verbaut?`,
          `Ein lückenloser 2 × 2-Würfelbau hat vorne ${a} | ${b} und hinten ${c0} | ${d} als Stapelhöhen. Zähle alle Würfel und gib die beiden Höhen seiner Vorderansicht an.`,
          [
            num("Würfel:", total, "", 0),
            ...(level === 2
              ? [
                  num("Vorderansicht links:", Math.max(a, c0), "", 0),
                  num("Vorderansicht rechts:", Math.max(b, d), "", 0),
                ]
              : []),
          ],
          "Addiere alle Höhen. In einer Ansicht zählt je Blicklinie nur die größte Höhe.",
          `${a} + ${b} + ${c0} + ${d} = ${total}. Vorne: Maximum aus ${a} und ${c0}; aus ${b} und ${d}.`,
          `${total} Würfel${level === 2 ? `, Vorderansicht ${Math.max(a, c0)} | ${Math.max(b, d)}` : ""}.`,
          { a, b, c: c0, d },
        );
      },
    },
    {
      id: "erganzen",
      make: (rng, level) => {
        const height = rng.int(2, 5),
          a = rng.int(0, height),
          b = rng.int(0, height),
          c0 = rng.int(0, height),
          d = rng.int(0, height),
          present = a + b + c0 + d,
          missing = 4 * height - present;
        return task(
          level,
          `Ein Bauplan hat die Höhen ${a}, ${b}, ${c0}, ${d}. Auf allen vier Feldern soll ein Stapel der Höhe ${height} stehen. Wie viele Würfel fehlen?`,
          `Ein lückenloser Bau mit Höhen ${a}, ${b}, ${c0}, ${d} soll zu einem Quader mit Grundfläche 2 × 2 und Höhe ${height} ergänzt werden. Wie viele Würfel werden ergänzt, und wie viele hat der fertige Quader?`,
          [
            num("Ergänzen:", missing, "", 0),
            ...(level === 2
              ? [num("Fertiger Quader:", 4 * height, "", 0)]
              : []),
          ],
          "Berechne zuerst die Würfelzahl des ganzen Quaders, dann ziehe die vorhandenen Würfel ab.",
          `Ganz: 4 · ${height} = ${4 * height}. Vorhanden: ${present}. Fehlend: ${4 * height} − ${present}.`,
          `${missing} Würfel ergänzen.`,
          { height, a, b, c: c0, d },
        );
      },
    },
  ],
});
