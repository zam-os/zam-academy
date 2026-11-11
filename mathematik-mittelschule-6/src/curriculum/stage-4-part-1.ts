const surface = (v: Record<string, number>) =>
  2 * (v.a * v.b + v.a * v.c + v.b * v.c);
import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { numberField as num } from "./helpers";

const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(4, step, null, content);

const oberflaeche = L(1, {
  id: "fl-6-oberflaeche",
  title: "4.1 Die Oberfläche von Quader und Würfel",
  subtitle: "Das Netz zeigt alle Flächen",
  whyItMatters:
    "Wie viel Geschenkpapier brauchst du für eine Schachtel? Das Netz aus Lernbereich 3, zeigt alle sechs Flächen auf einmal.",
  explanationHtml: `<p>Ein <strong>Quader</strong> hat 6 Rechtecke als Begrenzungsflächen, die paarweise gleich groß sind: Boden und Deckel, Vorder- und Rückseite, linke und rechte Seite. Der <strong>Oberflächeninhalt</strong> O ist die Summe aller sechs Flächen. Ein <strong>Würfel</strong> hat 6 gleiche Quadrate.</p><div class="example">Quader mit a = 5 cm, b = 3 cm, c = 2 cm: O = 2 · (5 · 3 + 5 · 2 + 3 · 2) cm² = 2 · 31 cm² = 62 cm². Würfel mit a = 3 cm: O = 6 · 9 cm² = 54 cm².</div><p>Achte in Sachaufgaben darauf, welche Flächen wirklich gemeint sind: Ein Karton ohne Deckel hat nur fünf Flächen.</p><div class="merke"><strong>Merke:</strong> Quader: O = 2 · (a · b + a · c + b · c). Würfel: O = 6 · a². Flächen messen wir in cm² oder m².</div>`,
  formulas: [
    {
      name: "Quader",
      html: "O = 2 · (a · b + a · c + b · c)",
      quantities: "a, b, c Kantenlängen",
    },
    {
      name: "Würfel",
      html: "O = 6 · a²",
      quantities: "a Kantenlänge",
    },
  ],
  quiz: {
    question:
      "Wie viele Flächen musst du bei einem Karton ohne Deckel berechnen?",
    options: ["5", "6", "4"],
    correctIndex: 0,
    explanation: "Ein Quader hat 6 Flächen. Ohne Deckel bleiben 5.",
  },
  lab: lab(
    "surface-net",
    "Quadernetz",
    "Verändere die Kanten. Das Netz zeigt die drei Flächenpaare in je einer Farbe.",
    [
      r("a", "Kante a", 1, 8, 4, 1, "cm"),
      r("b", "Kante b", 1, 6, 2, 1, "cm"),
      r("c", "Kante c", 1, 6, 3, 1, "cm"),
    ],
    [
      o("surface", "Oberfläche", surface, "cm²", 0),
      o("kind", "Körper", (v) =>
        v.a === v.b && v.b === v.c ? "Würfel" : "Quader",
      ),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle den Quader mit 5 cm, 3 cm und 2 cm ein.",
        check: (v) => v.a === 5 && v.b === 3 && v.c === 2,
      },
      {
        id: "wuerfel",
        text: "Erzeuge einen Würfel mit der Oberfläche 54 cm².",
        check: (v) => v.a === 3 && v.b === 3 && v.c === 3,
      },
      {
        id: "hundert",
        text: "Finde einen Quader mit der Oberfläche 100 cm².",
        check: (v) => surface(v) === 100,
      },
    ],
  ),
  exercises: [
    {
      id: "quader",
      make: (rng, level) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 10);
        const c0 = rng.int(1, 8);
        const O = surface({ a, b, c: c0 });
        if (level === 1)
          return task(
            level,
            `Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${c0} cm. Berechne den Oberflächeninhalt.`,
            "",
            [
              num("O =", O, "cm²", 0, {
                slips: [
                  {
                    value: O / 2,
                    hint: "Jede Fläche kommt zweimal vor. Nimm die Summe mal 2.",
                  },
                ],
              }),
            ],
            "O = 2 · (a · b + a · c + b · c)",
            `2 · (${a * b} + ${a * c0} + ${b * c0}).`,
            `${O} cm².`,
            { a, b, c0 },
          );
        return task(
          level,
          "",
          `Ein Karton ohne Deckel hat die Grundfläche ${a} dm · ${b} dm und ist ${c0} dm hoch. Wie viel Pappe wird mindestens gebraucht?`,
          [
            num("Pappe =", O - a * b, "dm²", 0, {
              slips: [
                {
                  value: O,
                  hint: "Der Deckel fehlt. Ziehe ihn von der Oberfläche ab.",
                },
              ],
            }),
          ],
          "Oberfläche minus Deckelfläche a · b.",
          `${O} − ${a * b}.`,
          `${O - a * b} dm².`,
          { a, b, c0 },
        );
      },
    },
    {
      id: "wuerfel",
      make: (rng, level) => {
        const a = rng.int(2, 12);
        if (level === 1)
          return task(
            level,
            `Ein Würfel hat die Kantenlänge ${a} cm. Berechne seine Oberfläche.`,
            "",
            [
              num("O =", 6 * a * a, "cm²", 0, {
                slips: [
                  {
                    value: a * a,
                    hint: "Das ist nur eine Fläche. Der Würfel hat sechs.",
                  },
                ],
              }),
            ],
            "O = 6 · a²",
            `6 · ${a} · ${a}.`,
            `${6 * a * a} cm².`,
            { a },
          );
        return task(
          level,
          "",
          `Ein Würfel hat die Oberfläche ${6 * a * a} cm². Wie groß ist eine einzelne Fläche, und wie lang ist seine Kante?`,
          [num("Eine Fläche =", a * a, "cm²", 0), num("a =", a, "cm", 0)],
          "Teile durch 6. Welche Quadratzahl ist das?",
          `${6 * a * a} : 6 = ${a * a} = ${a} · ${a}.`,
          `${a * a} cm² und ${a} cm.`,
          { a },
        );
      },
    },
  ],
});

export const LESSONS = [oberflaeche];
