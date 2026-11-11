import { fmt } from "../exercises/format";
import { notchPerimeter } from "../models";
import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { numberField as num } from "./helpers";

const n0 = (value: number) => fmt(value, 0);
const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(3, step, null, content);

const umfang = L(3, {
  id: "uf-1-umfang",
  title: "3.3 Umfang von Rechteck und Quadrat",
  subtitle: "Die Länge des Randes, auch rückwärts gerechnet",
  whyItMatters:
    "Wie viel Band brauchst du für den Rand eines Tischtuchs? Der Umfang sagt es dir.",
  explanationHtml: `<p>Der <strong>Umfang U</strong> ist die Länge des gesamten Randes einer Figur. Du addierst alle Seiten.</p><p>Beim <strong>Rechteck</strong> kommen die Seiten a und b je zweimal vor: U = 2 · a + 2 · b = 2 · (a + b). Beim <strong>Quadrat</strong> sind alle vier Seiten gleich: U = 4 · a. Der Umfang ist eine Länge, also zum Beispiel in cm oder m.</p><p><strong>Rückwärts:</strong> Du kennst U und eine Seite. Dann ist die halbe Summe U : 2 = a + b, und du ziehst die bekannte Seite ab. Beim Quadrat ist a = U : 4.</p><div class="example">Rechteck mit a = 6 cm und b = 3 cm: U = 2 · (6 cm + 3 cm) = 18 cm. Umgekehrt: U = 24 cm und a = 8 cm. Dann ist a + b = 12 cm, also b = 4 cm.</div><div class="merke"><strong>Merke:</strong> Rechteck: U = 2 · (a + b). Quadrat: U = 4 · a. Der Umfang wird in Längeneinheiten angegeben.</div>`,
  formulas: [
    {
      name: "Umfang Rechteck",
      html: "U = 2 · (a + b)",
      quantities: "a, b Seitenlängen",
    },
    { name: "Umfang Quadrat", html: "U = 4 · a", quantities: "a Seitenlänge" },
    {
      name: "Seite aus dem Umfang",
      html: "b = U : 2 − a",
      quantities: "Beim Quadrat a = U : 4",
    },
  ],
  quiz: {
    question:
      "Ein Rechteck ist 5 cm lang und 2 cm breit. Wie groß ist der Umfang?",
    options: ["14 cm", "10 cm", "7 cm"],
    correctIndex: 0,
    explanation:
      "2 · (5 cm + 2 cm) = 14 cm. 10 wäre das Produkt, 7 nur die halbe Runde.",
  },
  lab: lab(
    "perimeter",
    "Rechteck ziehen",
    "Ziehe die Ecke. Beobachte, wie sich der Umfang mit den Seiten verändert.",
    [
      r("a", "Seite a", 1, 12, 6, 1, "cm"),
      r("b", "Seite b", 1, 12, 3, 1, "cm"),
    ],
    [
      o("u", "Umfang", (v) => 2 * (v.a + v.b), "cm"),
      o("form", "Form", (v) => (v.a === v.b ? "Quadrat" : "Rechteck")),
    ],
    [
      {
        id: "quadrat",
        text: "Forme ein Quadrat mit dem Umfang 20 cm.",
        check: (v) => v.a === v.b && 2 * (v.a + v.b) === 20,
      },
      {
        id: "rueckwaerts",
        text: "Stelle a = 8 cm ein und erreiche den Umfang 24 cm.",
        check: (v) => v.a === 8 && 2 * (v.a + v.b) === 24,
      },
      {
        id: "dreissig",
        text: "Finde ein Rechteck mit dem Umfang 30 cm.",
        check: (v) => 2 * (v.a + v.b) === 30,
      },
    ],
  ),
  exercises: [
    {
      id: "umfang-berechnen",
      make: (rng, level) => {
        const a = rng.int(3, 25),
          b = rng.int(2, a - 1);
        const square = rng.int(0, 2) === 0;
        const value = square ? 4 * a : 2 * (a + b);
        return task(
          level,
          square
            ? `Berechne den Umfang eines Quadrats mit a = ${a} cm.`
            : `Berechne den Umfang eines Rechtecks mit a = ${a} cm und b = ${b} cm.`,
          square
            ? `Ein quadratisches Beet hat die Seitenlänge ${a} m. Wie viele Meter Beeteinfassung braucht es?`
            : `Um ein ${a} m langes und ${b} m breites Spielfeld soll ein Band gelegt werden. Wie lang muss das Band mindestens sein?`,
          [
            num("U =", value, level === 1 ? "cm" : "m", 0, {
              slips: [
                {
                  value: square ? a * a : a * b,
                  hint: "Das ist die Fläche. Für den Umfang addierst du alle Seiten.",
                },
                ...(square
                  ? []
                  : [
                      {
                        value: a + b,
                        hint: "Du hast nur zwei Seiten addiert. Das Rechteck hat vier.",
                      },
                    ]),
              ],
            }),
          ],
          square ? "U = 4 · a" : "U = 2 · (a + b)",
          square
            ? `4 · ${a} = ${value}.`
            : `2 · (${a} + ${b}) = 2 · ${a + b} = ${value}.`,
          `U = ${value} ${level === 1 ? "cm" : "m"}`,
          { a, b },
        );
      },
    },
    {
      id: "seite-rueckwaerts",
      make: (rng, level) => {
        const a = rng.int(5, 30),
          b = rng.int(2, a);
        const value = 2 * (a + b);
        const side = rng.int(2, 30);
        if (level === 1)
          return task(
            level,
            `Der Umfang eines Quadrats ist ${4 * side} cm. Wie lang ist eine Seite?`,
            "",
            [
              num("a =", side, "cm", 0, {
                slips: [
                  {
                    value: 2 * side,
                    hint: "Ein Quadrat hat vier gleiche Seiten. Teile durch 4.",
                  },
                ],
              }),
            ],
            "a = U : 4",
            `${4 * side} cm : 4.`,
            `a = ${side} cm`,
            { side },
          );
        return task(
          level,
          "",
          `Für einen rechteckigen Hof reichen genau ${value} m Zaun. Der Hof ist ${a} m lang. Wie breit ist er?`,
          [
            num("b =", b, "m", 0, {
              slips: [
                {
                  value: value - a,
                  hint: "Die Länge kommt zweimal vor. Rechne zuerst die halbe Runde: U : 2.",
                },
              ],
            }),
          ],
          "b = U : 2 − a",
          `${value} m : 2 = ${value / 2} m. ${value / 2} m − ${a} m = ${b} m.`,
          `Der Hof ist ${b} m breit.`,
          { a, b },
        );
      },
    },
  ],
});

const umfangVielecke = L(4, {
  id: "uf-2-umfang-vielecke",
  title: "3.4 Umfang von Vielecken",
  subtitle: "Alle Seiten addieren und Zäune planen",
  whyItMatters:
    "Grundstücke sind selten genau rechteckig. Mit dem Umfang planst du Zäune, Hecken und Wege.",
  explanationHtml: `<p>Bei jedem <strong>Vieleck</strong> addierst du alle Seiten: Das ist der Umfang. Fehlt eine Seite, kannst du sie oft aus den anderen berechnen. Achte darauf, dass alle Längen dieselbe Einheit haben.</p><p>Ein schöner Trick: Schneidest du aus einem Rechteck eine Ecke heraus, ist der Umfang des L-förmigen Rests <strong>genauso groß</strong> wie beim ganzen Rechteck. Die beiden neuen Kanten ersetzen genau die weggefallenen Stücke.</p><p>Bei einem Zaun ziehst du die Breite eines Tors ab.</p><div class="example">Grundstück in L-Form, 10 m lang und 6 m breit, mit herausgeschnittener Ecke: U = 2 · (10 m + 6 m) = 32 m. Mit einem Tor von 2 m Breite brauchst du 30 m Zaun.</div><div class="merke"><strong>Merke:</strong> Umfang = Summe aller Seiten. Beim L aus einem Rechteck bleibt der Umfang gleich.</div>`,
  formulas: [
    {
      name: "Umfang Vieleck",
      html: "U = a + b + c + …",
      quantities: "Alle Seiten in derselben Einheit",
    },
    {
      name: "Zaunlänge",
      html: "Zaun = U − Tor",
      quantities: "Das Tor wird nicht umzäunt.",
    },
  ],
  quiz: {
    question:
      "Aus einem Rechteck wird eine rechteckige Ecke herausgeschnitten. Was passiert mit dem Umfang?",
    options: [
      "Er bleibt gleich.",
      "Er wird kleiner.",
      "Er wird immer doppelt so groß.",
    ],
    correctIndex: 0,
    explanation:
      "Die neuen Kanten sind genauso lang wie die Stücke, die wegfallen.",
  },
  lab: lab(
    "polygon-perimeter",
    "Grundstück einzäunen",
    "Ändere Größe, Ausschnitt und Tor. Prüfe, was den Umfang wirklich verändert.",
    [
      r("w", "Länge", 4, 12, 6, 1, "m"),
      r("h", "Breite", 3, 10, 4, 1, "m"),
      r("cw", "Ausschnitt lang", 0, 3, 1, 1, "m"),
      r("ch", "Ausschnitt breit", 0, 2, 1, 1, "m"),
      r("t", "Tor", 0, 4, 1, 1, "m"),
    ],
    [
      o("u", "Umfang", (v) => notchPerimeter(v.w, v.h), "m"),
      o("zaun", "Zaun", (v) => notchPerimeter(v.w, v.h) - v.t, "m"),
    ],
    [
      {
        id: "dreissig",
        text: "Plane genau 30 m Zaun.",
        check: (v) => notchPerimeter(v.w, v.h) - v.t === 30,
      },
      {
        id: "l-form",
        text: "Schneide eine Ecke von 3 m mal 2 m aus einem 8 m mal 6 m großen Grundstück. Der Umfang bleibt 28 m.",
        check: (v) => v.w === 8 && v.h === 6 && v.cw === 3 && v.ch === 2,
      },
      {
        id: "tor",
        text: "Baue ein 4 m breites Tor ein und plane genau 20 m Zaun.",
        check: (v) => v.t === 4 && notchPerimeter(v.w, v.h) - v.t === 20,
      },
    ],
  ),
  exercises: [
    {
      id: "vieleck",
      make: (rng, level) => {
        const sides = Array.from({ length: level === 1 ? 5 : 6 }, () =>
          rng.int(5, 12),
        );
        const total = sides.reduce((a, b) => a + b, 0);
        if (level === 1)
          return task(
            level,
            `Ein Fünfeck hat die Seiten ${sides.join(" cm, ")} cm. Berechne seinen Umfang.`,
            "",
            [num("U =", total, "cm", 0)],
            "Alle Seiten addieren",
            `${sides.join(" + ")} = ${total}.`,
            `U = ${total} cm`,
            { total },
          );
        const gate = rng.int(1, 3);
        return task(
          level,
          "",
          `Ein Grundstück hat sechs Seiten: ${sides.join(" m, ")} m. Es bekommt einen Zaun mit einem ${gate} m breiten Tor. Wie viele Meter Zaun braucht man?`,
          [
            num("Zaun:", total - gate, "m", 0, {
              slips: [
                {
                  value: total,
                  hint: "Das ist der ganze Umfang. Das Tor braucht keinen Zaun.",
                },
              ],
            }),
          ],
          "Umfang minus Tor",
          `U = ${total} m. ${total} m − ${gate} m.`,
          `${total - gate} m Zaun`,
          { total, gate },
        );
      },
    },
    {
      id: "l-form",
      make: (rng, level) => {
        const w = rng.int(6, 20),
          h = rng.int(5, 15),
          cw = rng.int(2, 4),
          ch = rng.int(2, 4);
        const u = notchPerimeter(w, h);
        if (level === 1)
          return task(
            level,
            `Aus einem Rechteck mit ${w} m Länge und ${h} m Breite wird eine Ecke von ${cw} m mal ${ch} m herausgeschnitten. Wie groß ist der Umfang des Rests?`,
            "",
            [
              num("U =", u, "m", 0, {
                slips: [
                  {
                    value: u - 2 * (cw + ch),
                    hint: "Der Ausschnitt nimmt Stücke weg, bringt aber gleich lange neue Kanten dazu.",
                  },
                ],
              }),
            ],
            "Der Umfang bleibt wie beim ganzen Rechteck.",
            `2 · (${w} + ${h}) = ${u}.`,
            `U = ${u} m`,
            { w, h },
          );
        const price = rng.int(5, 15);
        return task(
          level,
          "",
          `Ein L-förmiger Garten entsteht aus einem Rechteck, ${w} m mal ${h} m, mit einer fehlenden Ecke von ${cw} m mal ${ch} m. Ein Meter Hecke kostet ${price} €. Wie viel kostet die Hecke rundherum?`,
          [num("Kosten:", u * price, "€", 0)],
          "Erst den Umfang, dann mal Preis pro Meter.",
          `U = 2 · (${w} + ${h}) = ${u}. ${u} · ${price} = ${u * price}.`,
          `${n0(u * price)} €`,
          { w, h, price },
        );
      },
    },
  ],
});

export const LESSONS = [umfang, umfangVielecke];
