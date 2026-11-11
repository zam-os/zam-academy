import { fmt } from "../exercises/format";
import { tileCount, TILES } from "../lab/views-flaechen";
import { notchArea, notchPerimeter } from "../models";
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
  makeLesson(4, step, null, content);

const flaechenVergleichen = L(1, {
  id: "uf-3-flaechen-vergleichen",
  title: "4.1 Flächen vergleichen",
  subtitle: "Mit Kästchen, Fliesen und Einheitsquadraten auslegen",
  whyItMatters:
    "Welches Zimmer ist größer? Bevor du Formeln nutzt, siehst du hier, was ein Flächeninhalt überhaupt bedeutet.",
  explanationHtml: `<p>Der <strong>Flächeninhalt</strong> sagt, wie viel Platz eine Figur einnimmt. Zwei Figuren vergleichst du, indem du sie mit gleichen Stücken <strong>auslegst</strong>. Das können <strong>ungenormte Einheiten</strong> sein (Fliesen, Karos, Bierdeckel) oder <strong>genormte</strong> wie das Quadrat mit 1 cm Seitenlänge: 1 cm².</p><p>Zerlege schwierige Figuren in <strong>Teilfiguren</strong> und setze sie neu zusammen. Dabei bleibt der Flächeninhalt gleich, auch wenn die Form sich ändert. Verschiedene Formen können also gleich groß sein.</p><p>Ungenormte Einheiten haben einen Nachteil: Wer andere Fliesen nimmt, bekommt eine andere Zahl. Darum wurde genormt.</p><div class="example">Figur A: 3 mal 5 Kästchen, also 15. Figur B: 4 mal 4 Kästchen ohne eine Ecke, also 16 − 1 = 15. Beide sind gleich groß, aber verschieden geformt.</div><div class="merke"><strong>Merke:</strong> Gleiche Fläche heißt nicht gleiche Form. Zerlegen ändert den Flächeninhalt nicht.</div>`,
  formulas: [
    {
      name: "Flächeninhalt",
      html: "Anzahl der Einheitsquadrate",
      quantities: "1 cm² ist ein Quadrat mit 1 cm Seitenlänge.",
    },
  ],
  quiz: {
    question: "Warum nimmt man genormte Einheiten wie cm²?",
    options: [
      "Damit alle dieselbe Zahl für dieselbe Fläche bekommen.",
      "Weil Fliesen sonst nicht passen würden.",
      "Weil Flächen ohne Einheit größer wären.",
    ],
    correctIndex: 0,
    explanation:
      "Mit Fliesen beliebiger Größe bekommt jeder eine andere Zahl. Genormte Einheiten sind überall gleich.",
  },
  lab: lab(
    "tile-compare",
    "Zwei Figuren auslegen",
    "Baue Figur A und Figur B aus Kästchen. Wähle auch, womit du zählst.",
    [
      c(
        "unit",
        "Zählen mit",
        TILES.map((t) => t.label),
      ),
      r("a", "Breite von A", 2, 8, 3),
      r("b", "Höhe von A", 2, 6, 4),
      r("d", "Breite von B", 2, 8, 4),
      r("e", "Höhe von B", 2, 6, 4),
      r("k", "Ecke fehlt bei B", 0, 2, 1),
    ],
    [
      o("a", "Fläche A", (v) => tileCount(v.a * v.b, TILES[v.unit].size)),
      o("b", "Fläche B", (v) =>
        tileCount(v.d * v.e - v.k * v.k, TILES[v.unit].size),
      ),
    ],
    [
      {
        id: "gleich",
        text: "Mache beide Figuren gleich groß, obwohl B eine Ecke fehlt.",
        check: (v) => v.k > 0 && v.a * v.b === v.d * v.e - v.k * v.k,
      },
      {
        id: "zweier",
        text: "Lege A mit genau 12 Zweier-Fliesen aus.",
        check: (v) => v.unit === 1 && v.a * v.b === 24,
      },
      {
        id: "vierer",
        text: "Lege B mit genau 5 Vierer-Fliesen aus und lasse eine Ecke von 2 mal 2 Kästchen fehlen.",
        check: (v) => v.unit === 2 && v.k === 2 && v.d * v.e - v.k * v.k === 20,
      },
    ],
  ),
  exercises: [
    {
      id: "kaestchen-zaehlen",
      make: (rng, level) => {
        const a = rng.int(3, 9),
          b = rng.int(3, 9),
          k = rng.int(1, 2);
        const area = a * b - k * k;
        if (level === 1)
          return task(
            level,
            `Eine Figur besteht aus ${a} mal ${b} Kästchen. Eine Ecke von ${k} mal ${k} Kästchen fehlt. Wie viele Kästchen hat sie?`,
            "",
            [
              num("Kästchen:", area, "", 0, {
                slips: [
                  {
                    value: a * b,
                    hint: "Die fehlende Ecke musst du noch abziehen.",
                  },
                ],
              }),
            ],
            "Alle Kästchen minus fehlende Kästchen",
            `${a} · ${b} − ${k} · ${k} = ${a * b} − ${k * k}.`,
            `${area} Kästchen`,
            { a, b, k },
          );
        const size = rng.pick([2, 4]);
        const c2 = rng.int(2, 5) * size;
        const karosB = c2 * size + rng.pick([-size, 0, size]);
        const verdict = c2 * size > karosB ? 0 : c2 * size < karosB ? 1 : 2;
        return task(
          level,
          "",
          `Boden A besteht aus ${c2} Fliesen zu je ${size} Karos. Boden B besteht aus ${karosB} einzelnen Karos. Welcher Boden ist größer?`,
          [
            pick(
              "Größer ist …",
              ["Boden A", "Boden B", "keiner, sie sind gleich groß"],
              verdict,
            ),
            num("Karos von Boden A:", c2 * size, "", 0),
          ],
          "Rechne beide auf dieselbe Einheit um.",
          `${c2} · ${size} = ${c2 * size} Karos, dazu ${karosB} Karos bei Boden B.`,
          [
            "Boden A ist größer.",
            "Boden B ist größer.",
            "Beide Böden sind gleich groß.",
          ][verdict],
          { c2, size, karosB },
        );
      },
    },
    {
      id: "fliesen",
      make: (rng, level) => {
        const a = rng.int(2, 6) * 2,
          b = rng.int(2, 6) * 2;
        const size = level === 1 ? 2 : 4;
        return task(
          level,
          `Ein Feld hat ${a} mal ${b} Kästchen. Wie viele Zweier-Fliesen braucht man zum Auslegen?`,
          `Eine Terrasse misst ${a} mal ${b} Karos. Eine Fliese bedeckt 2 mal 2 Karos. Wie viele Fliesen braucht man?`,
          [
            num("Fliesen:", (a * b) / size, "", 0, {
              slips: [
                {
                  value: a * b,
                  hint: `Das sind die Karos. Eine Fliese bedeckt ${size} davon.`,
                },
              ],
            }),
          ],
          "Fläche in Karos : Karos pro Fliese",
          `${a} · ${b} = ${a * b}. ${a * b} : ${size} = ${(a * b) / size}.`,
          `${(a * b) / size} Fliesen`,
          { a, b },
        );
      },
    },
  ],
});

const flaecheRechteck = L(2, {
  id: "uf-5-flaeche-rechteck",
  title: "4.2 Flächeninhalt von Rechteck und Quadrat",
  subtitle: "Die Formeln und das Rückwärtsrechnen",
  whyItMatters:
    "Teppich, Tapete oder Rasen: Mit der Rechteckformel weißt du, wie viel du kaufen musst.",
  explanationHtml: `<p>Ein Rechteck mit a = 5 cm und b = 3 cm lässt sich mit 3 Reihen zu je 5 Quadraten mit 1 cm Seitenlänge auslegen. Das sind 5 · 3 = 15 Quadrate. Darum gilt <strong>A = a · b</strong>. Beim Quadrat ist <strong>A = a · a = a²</strong>.</p><p>Beide Seiten müssen <strong>dieselbe Einheit</strong> haben. Das Ergebnis ist dann in der passenden Flächeneinheit: cm · cm = cm².</p><p><strong>Rückwärts:</strong> Kennst du A und a, ist b = A : a. Beim Quadrat suchst du die Zahl, die mit sich selbst den Flächeninhalt ergibt.</p><div class="example">Zimmer: a = 6 m, b = 4 m. A = 24 m². Ein Teppich mit 36 m² und a = 9 m hat b = 36 m² : 9 m = 4 m. Ein Quadrat mit A = 64 cm² hat a = 8 cm.</div><div class="merke"><strong>Merke:</strong> Rechteck: A = a · b. Quadrat: A = a². Flächen haben Quadrateinheiten, Umfänge haben Längeneinheiten.</div>`,
  formulas: [
    {
      name: "Flächeninhalt Rechteck",
      html: "A = a · b",
      quantities: "a, b Seitenlängen",
    },
    {
      name: "Flächeninhalt Quadrat",
      html: "A = a²",
      quantities: "a Seitenlänge",
    },
    {
      name: "Seite aus der Fläche",
      html: "b = A : a",
      quantities: "Bei gleicher Einheit",
    },
  ],
  quiz: {
    question:
      "Ein Rechteck hat a = 8 cm und b = 5 cm. Wie groß ist der Flächeninhalt?",
    options: ["40 cm²", "26 cm", "13 cm²"],
    correctIndex: 0,
    explanation: "8 · 5 = 40, die Einheit ist cm². 26 cm wäre der Umfang.",
  },
  lab: lab(
    "area-rect",
    "Quadrate zählen",
    "Ziehe die Ecke. Jedes Kästchen ist 1 cm² groß.",
    [
      r("a", "Seite a", 1, 12, 5, 1, "cm"),
      r("b", "Seite b", 1, 12, 2, 1, "cm"),
    ],
    [
      o("a2", "Flächeninhalt", (v) => v.a * v.b, "cm²"),
      o("u", "Umfang", (v) => 2 * (v.a + v.b), "cm"),
    ],
    [
      {
        id: "quadrat",
        text: "Forme ein Quadrat mit dem Flächeninhalt 36 cm².",
        check: (v) => v.a === v.b && v.a * v.b === 36,
      },
      {
        id: "rueckwaerts",
        text: "Stelle a = 8 cm ein und erreiche den Flächeninhalt 24 cm².",
        check: (v) => v.a === 8 && v.b === 3,
      },
      {
        id: "gleicher-umfang",
        text: "Finde ein Rechteck mit dem Umfang 20 cm und dem Flächeninhalt 16 cm².",
        check: (v) => 2 * (v.a + v.b) === 20 && v.a * v.b === 16,
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche-berechnen",
      make: (rng, level) => {
        const a = rng.int(3, 25),
          b = rng.int(2, a);
        const value = a * b;
        const price = rng.int(3, 12);
        return task(
          level,
          `Berechne den Flächeninhalt eines Rechtecks mit a = ${a} cm und b = ${b} cm.`,
          `Ein Saal ist ${a} m lang und ${b} m breit. Ein Quadratmeter Boden kostet ${price} €. Wie teuer ist der Boden?`,
          [
            num(
              level === 1 ? "A =" : "Kosten:",
              level === 1 ? value : value * price,
              level === 1 ? "cm²" : "€",
              0,
              {
                slips:
                  level === 1
                    ? [
                        {
                          value: 2 * (a + b),
                          hint: "Das ist der Umfang. Für die Fläche multiplizierst du.",
                        },
                      ]
                    : [
                        {
                          value: 2 * (a + b) * price,
                          hint: "Du hast den Umfang genommen. Hier zählt die Fläche.",
                        },
                      ],
              },
            ),
          ],
          "A = a · b",
          level === 1
            ? `${a} · ${b} = ${value}.`
            : `A = ${a} · ${b} = ${value} m². ${value} · ${price} = ${value * price}.`,
          level === 1 ? `A = ${value} cm²` : `${n0(value * price)} €`,
          { a, b },
        );
      },
    },
    {
      id: "seite-aus-flaeche",
      make: (rng, level) => {
        const a = rng.int(3, 20),
          b = rng.int(2, 15);
        if (level === 1)
          return task(
            level,
            `Ein Rechteck hat den Flächeninhalt ${a * b} cm² und die Seite a = ${a} cm. Wie lang ist b?`,
            "",
            [
              num("b =", b, "cm", 0, {
                slips: [
                  {
                    value: a * b - a,
                    hint: "Du hast abgezogen. Bei der Fläche wird geteilt: b = A : a.",
                  },
                ],
              }),
            ],
            "b = A : a",
            `${a * b} : ${a} = ${b}.`,
            `b = ${b} cm`,
            { a, b },
          );
        const side = rng.int(4, 20);
        return task(
          level,
          "",
          `Ein quadratischer Garten hat ${side * side} m² Fläche. Er soll einen Zaun bekommen. Wie lang ist eine Seite, und wie viel Zaun braucht man?`,
          [num("Seite:", side, "m", 0), num("Zaun:", 4 * side, "m", 0)],
          "Welche Zahl mal sich selbst ergibt die Fläche?",
          `${side} · ${side} = ${side * side}. U = 4 · ${side}.`,
          `Seite ${side} m, Zaun ${4 * side} m`,
          { side },
        );
      },
    },
  ],
});

const zusammengesetzt = L(3, {
  id: "uf-6-zusammengesetzt",
  title: "4.3 Flächen von Vielecken",
  subtitle: "Zerlegen oder ergänzen",
  whyItMatters:
    "Wohnungen haben selten vier gerade Wände. Du lernst, jede eckige Form in Rechtecke aufzuteilen.",
  explanationHtml: `<p>Für den Flächeninhalt eines Vielecks gibt es zwei Wege:</p><p><strong>Zerlegen:</strong> Teile die Figur in Rechtecke und addiere deren Flächen. <strong>Ergänzen:</strong> Ergänze die Figur zu einem großen Rechteck und ziehe das fehlende Stück ab. Beide Wege führen zum gleichen Ergebnis. Fehlende Seitenlängen rechnest du aus den anderen aus.</p><div class="example">L-Form, 10 m mal 8 m, mit fehlender Ecke von 4 m mal 3 m. Zerlegen: 10 m · 5 m + 6 m · 3 m = 50 m² + 18 m² = 68 m². Ergänzen: 10 m · 8 m − 4 m · 3 m = 80 m² − 12 m² = 68 m².</div><div class="merke"><strong>Merke:</strong> Zerlegen: addieren. Ergänzen: abziehen. Eine Skizze mit allen Längen hilft.</div>`,
  formulas: [
    {
      name: "Zerlegen",
      html: "A = A₁ + A₂",
      quantities: "Teilrechtecke addieren",
    },
    {
      name: "Ergänzen",
      html: "A = A<sub>groß</sub> − A<sub>klein</sub>",
      quantities: "Fehlendes Stück abziehen",
    },
  ],
  quiz: {
    question:
      "Ein 10 m mal 6 m großer Raum hat eine fehlende Ecke von 2 m mal 2 m. Wie groß ist er?",
    options: ["56 m²", "64 m²", "60 m²"],
    correctIndex: 0,
    explanation: "60 m² − 4 m² = 56 m².",
  },
  lab: lab(
    "composite",
    "Zerlegen oder ergänzen",
    "Wechsle die Methode und verändere die Figur. Das Ergebnis bleibt bei beiden Wegen gleich.",
    [
      c("method", "Methode", ["Zerlegen", "Ergänzen"]),
      r("w", "Breite", 5, 12, 6, 1, "m"),
      r("h", "Höhe", 4, 10, 5, 1, "m"),
      r("cw", "Ecke breit", 1, 4, 2, 1, "m"),
      r("ch", "Ecke hoch", 1, 3, 1, 1, "m"),
    ],
    [
      o("a", "Flächeninhalt", (v) => notchArea(v.w, v.h, v.cw, v.ch), "m²"),
      o("u", "Umfang", (v) => notchPerimeter(v.w, v.h), "m"),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle das Beispiel ein: 10 m mal 8 m, Ecke 4 m mal 3 m.",
        check: (v) => v.w === 10 && v.h === 8 && v.cw === 4 && v.ch === 3,
      },
      {
        id: "achtundvierzig",
        text: "Erreiche 48 m² mit der Methode Ergänzen.",
        check: (v) => v.method === 1 && notchArea(v.w, v.h, v.cw, v.ch) === 48,
      },
      {
        id: "zerlegt",
        text: "Erreiche mit der Methode Zerlegen genau 100 m².",
        check: (v) => v.method === 0 && notchArea(v.w, v.h, v.cw, v.ch) === 100,
      },
    ],
  ),
  exercises: [
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(8, 16),
          h = rng.int(6, 12),
          cw = rng.int(2, 5),
          ch = rng.int(2, 4);
        const area = notchArea(w, h, cw, ch);
        return task(
          level,
          `Eine Figur entsteht aus einem Rechteck mit ${w} m Breite und ${h} m Höhe, von dem eine Ecke mit ${cw} m mal ${ch} m fehlt. Berechne ihren Flächeninhalt.`,
          `Ein Erdgeschoss hat einen Grundriss aus einem Rechteck von ${w} m mal ${h} m, in dessen Ecke ein ${cw} m mal ${ch} m großer Schacht liegt. Wie groß ist die Wohnfläche?`,
          [
            num("A =", area, "m²", 0, {
              slips: [
                {
                  value: w * h,
                  hint: "Das fehlende Stück musst du noch abziehen.",
                },
                {
                  value: w * h + cw * ch,
                  hint: "Du hast die Ecke addiert. Sie fehlt aber.",
                },
              ],
            }),
          ],
          "A = großes Rechteck − kleines Rechteck",
          `${w} · ${h} = ${w * h}. ${cw} · ${ch} = ${cw * ch}. ${w * h} − ${cw * ch} = ${area}.`,
          `A = ${area} m²`,
          { w, h, cw, ch },
        );
      },
    },
    {
      id: "wohnung",
      make: (rng, level) => {
        const a = rng.int(3, 6),
          b = rng.int(3, 5),
          d = rng.int(3, 6),
          e = rng.int(2, 4),
          g = rng.int(4, 6),
          f = rng.int(2, 4);
        const area = a * b + d * e + (level === 2 ? g * f : 0);
        if (level === 1)
          return task(
            level,
            `Eine Figur besteht aus zwei Rechtecken: ${a} m mal ${b} m und ${d} m mal ${e} m. Wie groß ist sie zusammen?`,
            "",
            [num("A =", area, "m²", 0)],
            "Teilflächen addieren",
            `${a} · ${b} + ${d} · ${e} = ${a * b} + ${d * e}.`,
            `A = ${area} m²`,
            { a, b },
          );
        return task(
          level,
          "",
          `Ein Wohnungsplan zeigt ein Wohnzimmer mit ${a} m mal ${b} m, eine Küche mit ${d} m mal ${e} m und einen Flur mit ${g} m mal ${f} m. Wie groß ist die Wohnung insgesamt?`,
          [num("A =", area, "m²", 0)],
          "Jeden Raum einzeln berechnen, dann addieren.",
          `${a * b} m² + ${d * e} m² + ${g * f} m².`,
          `A = ${area} m²`,
          { a, b, d, e, g, f },
        );
      },
    },
  ],
});

export const LESSONS = [flaechenVergleichen, flaecheRechteck, zusammengesetzt];
