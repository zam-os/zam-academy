import { point } from "../exercises/format";
import { angleName } from "../models";
import { lab, makeLesson, output as o, range as r, task } from "./builders";
import { goal } from "./extra-helpers";
import { numberField as num, choiceField as pick } from "./helpers";

export const koordinaten = makeLesson(3, 5, null, {
  id: "ge-koordinaten-erster-quadrant",
  title: "3.5 Punkte im ersten Quadranten",
  subtitle: "Ursprung, Rechtswert und Hochwert",
  whyItMatters:
    "Mit zwei Zahlen beschreibst du genau, wo ein Punkt auf dem Karopapier liegt.",
  explanationHtml: `<p>Der <strong>Ursprung O</strong> ist der Schnittpunkt der beiden Achsen. Die waagrechte Achse zeigt nach rechts, die senkrechte nach oben. Hier arbeiten wir im <strong>ersten Quadranten</strong> und auf den Achsen: Beide Koordinaten sind nicht negativ.</p><p>Bei P(3 | 5) ist 3 der <strong>Rechtswert</strong>, 5 der <strong>Hochwert</strong>. Gehe vom Ursprung erst 3 Einheiten nach rechts, dann 5 nach oben. Zum Ablesen ziehst du gedanklich Senkrechte zu den Achsen.</p><div class="example">A(2 | 1), B(6 | 1), C(6 | 4), D(2 | 4) sind die Ecken eines Rechtecks. AB ist 4 Einheiten lang, BC 3 Einheiten. Ein Punkt auf der Hochachse hat den Rechtswert 0.</div><p>Zeichne ein eigenes Rechteck mit Lineal auf Karopapier. Beschrifte Achsen und Punkte; erkläre deinem Partner den Weg vom Ursprung zu einer Ecke.</p><div class="merke"><strong>Merke:</strong> Erst rechts, dann hoch. Einheiten und Reihenfolge gelten für alle Punkte deiner Zeichnung gleich.</div>`,
  formulas: [
    {
      name: "Koordinaten",
      html: "P(x | y)",
      quantities: "x Rechtswert, y Hochwert; O(0 | 0) ist der Ursprung.",
    },
  ],
  quiz: {
    question: "Wo liegt P(2 | 5)?",
    options: [
      "2 nach rechts, 5 nach oben",
      "5 nach rechts, 2 nach oben",
      "2 nach links, 5 nach unten",
    ],
    correctIndex: 0,
    explanation:
      "Der erste Wert gibt den Weg nach rechts an, der zweite den Weg nach oben.",
  },
  lab: lab(
    "first-quadrant",
    "Punkte auf Karopapier",
    "Ziehe P oder nutze die beiden Regler. Die Hilfslinien zeigen Rechtswert und Hochwert.",
    [r("x", "Rechtswert", 0, 8, 1), r("y", "Hochwert", 0, 6, 2)],
    [o("punkt", "Punkt", (v) => point(v.x, v.y, 0))],
    [
      goal("p", "Zeichne P(3 | 5).", { x: 3, y: 5 }),
      goal("achse", "Zeichne einen Punkt auf der Hochachse mit Hochwert 4.", {
        x: 0,
        y: 4,
      }),
      goal("ursprung", "Lege P in den Ursprung.", { x: 0, y: 0 }),
    ],
  ),
  exercises: [
    {
      id: "koordinaten",
      make: (rng, level) => {
        const x = rng.int(1, 7),
          y = rng.int(1, 5),
          dx = rng.int(1, 3),
          dy = rng.int(1, 3);
        return task(
          level,
          `Vom Ursprung aus gehst du ${x} Einheiten nach rechts und ${y} nach oben. Gib den Rechtswert und den Hochwert des Punkts an.`,
          `Auf dem Plan liegt der Start bei ${point(x, y, 0)}. Gehe ${dx} Einheiten nach rechts und ${dy} nach oben. Welche Koordinaten hat das Ziel?`,
          [
            num("Rechtswert:", x + (level === 2 ? dx : 0), "", 0),
            num("Hochwert:", y + (level === 2 ? dy : 0), "", 0),
          ],
          "Rechts verändert den ersten Wert, hoch den zweiten.",
          level === 1
            ? `Die Reihenfolge lautet rechts | hoch.`
            : `${x} + ${dx} = ${x + dx}; ${y} + ${dy} = ${y + dy}.`,
          `Der Punkt ist ${point(x + (level === 2 ? dx : 0), y + (level === 2 ? dy : 0), 0)}.`,
          { x, y, dx, dy },
        );
      },
    },
    {
      id: "rechteck",
      make: (rng, level) => {
        const x = rng.int(1, 4),
          y = rng.int(1, 4),
          w = rng.int(2, 5),
          h = rng.int(2, 5);
        return task(
          level,
          `A${point(x, y, 0)}, B${point(x + w, y, 0)} und C${point(x + w, y + h, 0)} sind drei aufeinanderfolgende Ecken eines Rechtecks. Gib die vierte Ecke D an.`,
          `Ein rechteckiges Beet hat auf dem Plan die gegenüberliegenden Ecken A${point(x, y, 0)} und C${point(x + w, y + h, 0)}. Die Seiten verlaufen parallel zu den Achsen. Wie breit und wie hoch ist das Beet in Kästchen?`,
          level === 1
            ? [num("D Rechtswert:", x, "", 0), num("D Hochwert:", y + h, "", 0)]
            : [
                num("Breite:", w, "Kästchen", 0),
                num("Höhe:", h, "Kästchen", 0),
              ],
          "Bei einer waagrechten Seite bleibt der Hochwert gleich, bei einer senkrechten der Rechtswert.",
          `Von ${x} bis ${x + w} sind es ${w} Kästchen, von ${y} bis ${y + h} sind es ${h}.`,
          level === 1 ? `D${point(x, y + h, 0)}.` : `Breite ${w}, Höhe ${h}.`,
          { x, y, w, h },
        );
      },
    },
  ],
});

export const winkel = makeLesson(3, 6, null, {
  id: "ge-winkel-bis-180",
  title: "3.6 Winkel bis 180°",
  subtitle: "Scheitelpunkt, Schenkel, messen und zeichnen",
  whyItMatters:
    "Eine Türöffnung und ein aufgeklappter Meterstab zeigen Winkel. Zum Messen brauchst du einen festen Scheitel und eine passende Skala.",
  explanationHtml: `<p>Ein Winkel hat zwei <strong>Schenkel</strong> mit gemeinsamem <strong>Scheitelpunkt</strong>. Die Öffnung misst du in Grad (°). Spitze Winkel sind kleiner als 90°, ein rechter Winkel hat 90°, stumpfe Winkel liegen zwischen 90° und 180°. Ein gestreckter Winkel hat 180°.</p><p>Zum Messen legst du den Mittelpunkt des Geodreiecks auf den Scheitel und die Grundlinie auf einen Schenkel. Lies die Skala, die bei diesem Schenkel mit 0° beginnt. Zum Zeichnen trägst du den Messwert ab und ziehst den zweiten Schenkel durch die Markierung.</p><div class="example">Eine geöffnete Tür bildet 60°: spitz. Bei 120° ist der Winkel stumpf. Auf dem Geodreieck stehen dort auch 60° der anderen Skala; die richtige Skala beginnt am ersten Schenkel mit 0°.</div><p>Schätze zuerst mithilfe von 45°, 90° und 180°. Zeichne danach selbst 45°, 90° und 135° mit dem Geodreieck und prüfe die Winkel durch erneutes Messen.</p><div class="merke"><strong>Merke:</strong> Scheitel auf den Mittelpunkt, erster Schenkel auf 0°. Schenkellänge und Winkelgröße sind verschiedene Dinge.</div>`,
  formulas: [
    {
      name: "Winkelarten",
      html: "spitz: 0° &lt; α &lt; 90°; recht: 90°; stumpf: 90° &lt; α &lt; 180°; gestreckt: 180°",
      quantities: "Die Öffnung entscheidet, nicht die Länge der Schenkel.",
    },
  ],
  quiz: {
    question: "Wie heißt ein Winkel von 135°?",
    options: ["stumpfer Winkel", "spitzer Winkel", "rechter Winkel"],
    correctIndex: 0,
    explanation: "135° liegt zwischen 90° und 180°.",
  },
  lab: lab(
    "angle-180",
    "Winkel öffnen",
    "Ziehe den zweiten Schenkel oder nutze den Regler. Vergleiche mit den Marken bei 45°, 90° und 180°.",
    [r("a", "Winkel", 5, 180, 30, 5, "°")],
    [
      o("art", "Winkelart", (v) => angleName(v.a)),
      o("grad", "Winkelmaß", (v) => v.a, "°", 0),
    ],
    [
      goal("halb-recht", "Öffne den Winkel auf 45°.", { a: 45 }),
      goal("recht", "Erzeuge einen rechten Winkel.", { a: 90 }),
      goal("stumpf", "Erzeuge einen stumpfen Winkel von 135°.", { a: 135 }),
    ],
  ),
  exercises: [
    {
      id: "art",
      make: (rng, level) => {
        const a = rng.pick([15, 30, 45, 60, 90, 100, 120, 135, 150, 180]),
          names = [
            "spitzer Winkel",
            "rechter Winkel",
            "stumpfer Winkel",
            "gestreckter Winkel",
          ],
          index = a < 90 ? 0 : a === 90 ? 1 : a < 180 ? 2 : 3;
        return task(
          level,
          `Du misst einen Winkel von ${a}°. Ordne ihn der richtigen Winkelart zu.`,
          `Eine Klappe soll ${a}° weit geöffnet werden. Ordne den Winkel ein und gib an, wie viele Grad bis zur gestreckten Öffnung fehlen.`,
          [
            pick("Winkelart:", names, index),
            ...(level === 2 ? [num("Bis 180° fehlen:", 180 - a, "°", 0)] : []),
          ],
          "Vergleiche zuerst mit 90° und dann mit 180°.",
          `${a}° ist ${a < 90 ? "kleiner als 90°" : a === 90 ? "genau 90°" : a < 180 ? "zwischen 90° und 180°" : "genau 180°"}.`,
          `${names[index]}${level === 2 ? `; es fehlen ${180 - a}°` : ""}.`,
          { a },
        );
      },
    },
    {
      id: "skala",
      make: (rng, level) => {
        const a = rng.pick([25, 35, 55, 65, 115, 125, 145, 155]),
          result = level === 1 ? 180 - a : a + 15;
        return task(
          level,
          `Am zweiten Schenkel stehen auf dem Geodreieck ${a}° und ${180 - a}°. Die Skala, die am ersten Schenkel mit 0° beginnt, gehört zur zweiten Zahl. Wie groß ist der Winkel?`,
          `Eine Tür ist ${a}° geöffnet. Du öffnest sie um weitere 15°. Wie groß ist die Öffnung jetzt? Kontrolliere, ob dein Wert unter 180° bleibt.`,
          [num("Winkel:", result, "°", 0)],
          "Lies die Skala vom Nullpunkt des ersten Schenkels aus.",
          level === 1
            ? `Die vorgegebene passende Skala zeigt ${180 - a}°.`
            : `${a}° + 15° = ${result}°.`,
          `Der Winkel hat ${result}°.`,
          { a },
        );
      },
    },
  ],
});

export const dreiecksUmfang = makeLesson(3, 7, null, {
  id: "ge-umfang-dreieck",
  title: "3.7 Umfang am Dreieck",
  subtitle: "Randlängen messen, umrechnen und addieren",
  whyItMatters:
    "Ein Randband muss einmal um die ganze Figur reichen. Die Fläche im Inneren sagt dir seine Länge nicht.",
  explanationHtml: `<p>Der <strong>Umfang</strong> ist die Länge des gesamten Randes. Beim Dreieck addierst du alle drei Seiten. Miss jede Seite mit dem Lineal vom Nullstrich aus und notiere zuerst die Einheit.</p><div class="example">Ein Dreieck hat Seiten von 4 cm, 5 cm und 60 mm. 60 mm = 6 cm, also U = 4 cm + 5 cm + 6 cm = 15 cm.</div><p>Bei einer Figur aus mehreren aneinanderliegenden Teilen zählt nur der äußere Rand. Gemeinsame Innenkanten gehören nicht zum Umfang. Markiere den Rand einmal rundherum, damit du keine Strecke doppelt zählst.</p><div class="merke"><strong>Merke:</strong> Gleiche Längeneinheit herstellen, dann alle äußeren Randstücke addieren.</div>`,
  formulas: [
    {
      name: "Dreiecksumfang",
      html: "U = a + b + c",
      quantities: "a, b und c in derselben Längeneinheit.",
    },
  ],
  quiz: {
    question: "Seiten: 3 cm, 4 cm, 50 mm. Wie groß ist der Umfang?",
    options: ["12 cm", "57 cm", "12 cm²"],
    correctIndex: 0,
    explanation: "50 mm = 5 cm. 3 + 4 + 5 = 12; Umfang ist eine Länge.",
  },
  lab: lab(
    "triangle-perimeter",
    "Ein Rand aus drei Stücken",
    "Die beiden schrägen Seiten sind gleich lang. Ziehe die Basis und vergleiche Seitenlängen und Umfang.",
    [r("base", "Basis", 2, 10, 4), r("side", "Schräge Seite", 6, 10, 7)],
    [o("umfang", "Umfang", (v) => v.base + 2 * v.side, "cm", 0)],
    [
      goal(
        "vierzehn",
        "Baue ein Dreieck mit Basis 2 cm und zwei Seiten von je 6 cm.",
        { base: 2, side: 6 },
      ),
      goal(
        "zwanzig",
        "Baue ein Dreieck mit Basis 6 cm und zwei Seiten von je 7 cm.",
        { base: 6, side: 7 },
      ),
      goal(
        "gleichseitig",
        "Baue ein gleichseitiges Dreieck mit Seitenlänge 8 cm.",
        { base: 8, side: 8 },
      ),
    ],
  ),
  exercises: [
    {
      id: "rand",
      make: (rng, level) => {
        const a = rng.int(3, 8),
          b = a + rng.int(0, 3),
          c0 = b + rng.int(0, 2),
          u = a + b + c0;
        return task(
          level,
          `Die Seiten eines Dreiecks sind ${a} cm, ${b} cm und ${c0 * 10} mm lang. Wie groß ist der Umfang in cm?`,
          `Eine dreieckige Fahne hat Seiten von ${a * 10} cm, ${b * 10} cm und ${c0} dm. Zum Säumen brauchst du zusätzlich 5 cm Band. Wie viele Zentimeter Band brauchst du?`,
          [num("Bandlänge / Umfang:", level === 1 ? u : u * 10 + 5, "cm", 0)],
          "Erst die Einheiten angleichen; beim Umfang werden Seiten addiert.",
          level === 1
            ? `${c0 * 10} mm = ${c0} cm. ${a} + ${b} + ${c0} = ${u}.`
            : `${c0} dm = ${c0 * 10} cm. Rand ${u * 10} cm, dazu 5 cm.`,
          `${level === 1 ? u : u * 10 + 5} cm.`,
          { a, b, c: c0 },
        );
      },
    },
    {
      id: "fehlende-seite",
      make: (rng, level) => {
        const a = rng.int(4, 9),
          b = a + 1,
          c0 = a + 2,
          u = a + b + c0;
        return task(
          level,
          `Ein Dreieck hat den Umfang ${u} cm. Zwei Seiten sind ${a} cm und ${b} cm lang. Berechne die dritte Seite.`,
          `Ein dreieckiges Beet hat einen Rand von ${u} m. Eine Seite misst ${a} m, eine zweite ${b} m. Nur an der dritten Seite wird ein Zaun mit einem 1 m breiten Tor gebaut. Wie viel Zaun brauchst du?`,
          [
            num(
              "Gesuchte Länge:",
              level === 1 ? c0 : c0 - 1,
              level === 1 ? "cm" : "m",
              0,
            ),
          ],
          "Ziehe die bekannten Randstücke vom ganzen Umfang ab.",
          `${u} − ${a} − ${b} = ${c0}.${level === 2 ? ` Für das Tor 1 m abziehen.` : ""}`,
          `${level === 1 ? c0 : c0 - 1} ${level === 1 ? "cm" : "m"}.`,
          { a, b, c: c0, u },
        );
      },
    },
  ],
});
