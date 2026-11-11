import { fmt } from "../exercises/format";
import { NET_PATTERNS, oppositeFace, quadrilateral, SOLIDS } from "../models";
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
  makeLesson(3, step, null, content);

const vierecke = L(1, {
  id: "ge-5-vierecke",
  title: "3.1 Vierecke",
  subtitle: "Quadrat, Rechteck, Parallelogramm, Raute, Trapez, Drachenviereck",
  whyItMatters:
    "Jedes Viereck hat einen Namen, der genau sagt, was an ihm besonders ist. Damit beschreibst du Figuren kurz und eindeutig.",
  explanationHtml: `<p>Ein <strong>Viereck</strong> hat vier Ecken und vier Seiten. Du erkennst besondere Vierecke an ihren Eigenschaften:</p><p><strong>Quadrat:</strong> vier gleich lange Seiten, vier rechte Winkel. <strong>Rechteck:</strong> vier rechte Winkel, gegenüberliegende Seiten gleich lang. <strong>Parallelogramm:</strong> gegenüberliegende Seiten parallel und gleich lang. <strong>Raute:</strong> vier gleich lange Seiten. <strong>Trapez:</strong> mindestens ein Paar paralleler Seiten. <strong>Drachenviereck:</strong> zwei Paare gleich langer Nachbarseiten.</p><p>Jedes Quadrat ist auch ein Rechteck und eine Raute. Jedes Rechteck ist auch ein Parallelogramm, und jedes Parallelogramm ist auch ein Trapez. Umgekehrt gilt das nicht. Eine Figur kann also mehrere Namen tragen. Du nennst immer den genauesten, das ist der, der am meisten über sie sagt: Ein Viereck mit genau einem Paar paralleler Seiten heißt Trapez, eines mit zwei Paaren mindestens Parallelogramm. Figuren kannst du zeichnen, falten oder am Geobrett spannen. Zeichne ein Rechteck, indem du auf einer Grundseite an beiden Enden Senkrechte mit dem Geodreieck errichtest, dieselbe Höhe abträgst und die neuen Punkte verbindest. Für ein Parallelogramm zeichnest du stattdessen eine schräge Nachbarseite und durch die Endpunkte Parallelen zu den jeweils gegenüberliegenden Seiten. Prüfe die Seitenlängen und die Lagebeziehungen. Ein Quadrat hat vier Symmetrieachsen, ein nicht quadratisches Rechteck zwei; eine Raute hat ihre Diagonalen als Symmetrieachsen.</p><div class="example">Figur mit vier gleich langen Seiten, aber ohne rechte Winkel: eine Raute. Genauester Name einer Figur mit genau einem Paar paralleler Seiten: Trapez.</div><div class="merke"><strong>Merke:</strong> Prüfe der Reihe nach: gleich lange Seiten, parallele Seiten, rechte Winkel. Dann nenne den genauesten Namen.</div>`,
  formulas: [
    {
      name: "Besondere Vierecke",
      html: "Quadrat → Rechteck → Parallelogramm → Trapez",
      quantities:
        "Jede Figur ist auch die nächste, aber nicht umgekehrt. Du nennst den genauesten Namen.",
    },
  ],
  quiz: {
    question: "Welche Aussage stimmt?",
    options: [
      "Jedes Quadrat ist ein Rechteck.",
      "Jedes Rechteck ist ein Quadrat.",
      "Jede Raute ist ein Quadrat.",
    ],
    correctIndex: 0,
    explanation:
      "Ein Quadrat hat vier rechte Winkel und ist daher ein Rechteck. Umgekehrt muss ein Rechteck keine gleich langen Seiten haben.",
  },
  lab: lab(
    "quad-types",
    "Viereck verformen",
    "Ziehe die Ecken B und D, oder kürze mit dem Regler die obere Seite. Oben steht, welches Viereck entstanden ist.",
    [
      r("w", "Grundseite", 2, 8, 6, 1, "cm"),
      r("h", "Höhe", 1, 5, 3, 1, "cm"),
      r("s", "Verschieben", -3, 3, 0, 1, "cm"),
      r("t", "Oben kürzen", 0, 2, 0, 1, "cm"),
    ],
    [
      o("name", "Name", (v) => quadrilateral(v.w, v.h, v.s, v.t).name),
      o("eigenschaft", "Parallele Seitenpaare", (v) =>
        Math.min(v.t, Math.floor((v.w - 1) / 2)) > 0
          ? "ein Paar"
          : "zwei Paare",
      ),
    ],
    [
      {
        id: "quadrat",
        text: "Mache aus dem Viereck ein Quadrat.",
        check: (v) => quadrilateral(v.w, v.h, v.s, v.t).name === "Quadrat",
      },
      {
        id: "parallelogramm",
        text: "Schiebe die obere Seite, sodass ein Parallelogramm entsteht.",
        check: (v) =>
          quadrilateral(v.w, v.h, v.s, v.t).name === "Parallelogramm",
      },
      {
        id: "raute",
        text: "Baue eine Raute: Grundseite 5 cm, Höhe 4 cm, um 3 cm verschoben.",
        check: (v) => quadrilateral(v.w, v.h, v.s, v.t).name === "Raute",
      },
    ],
  ),
  exercises: [
    {
      id: "eigenschaft-name",
      make: (rng, level) => {
        const items = [
          ["vier rechte Winkel und vier gleich lange Seiten", "Quadrat"],
          [
            "vier rechte Winkel, aber nicht vier gleich lange Seiten",
            "Rechteck",
          ],
          ["vier gleich lange Seiten, aber keine rechten Winkel", "Raute"],
          [
            "zwei Paare paralleler Seiten, aber keine rechten Winkel und nicht vier gleich lange Seiten",
            "Parallelogramm",
          ],
          ["genau ein Paar paralleler Seiten", "Trapez"],
          [
            "zwei Paare gleich langer Nachbarseiten, aber keine parallelen Seiten",
            "Drachenviereck",
          ],
        ] as const;
        const [text, name] = rng.pick(items);
        const others = rng
          .shuffle(items.map(([, n]) => n).filter((n) => n !== name))
          .slice(0, 2);
        return task(
          level,
          `Wie heißt ein Viereck am genauesten, das ${text} hat?`,
          `Du spannst am Geobrett ein Viereck mit dieser Eigenschaft: ${text}. Welcher Name passt am genauesten?`,
          [pick("Name:", [name, ...others], 0)],
          "Prüfe Seiten, Parallelen und Winkel.",
          `Das beschreibt genau die Eigenschaften dieser Figur.`,
          `Die Figur heißt ${name}.`,
          {},
        );
      },
    },
    {
      id: "wahr-falsch",
      make: (rng, level) => {
        const items = [
          ["Jedes Quadrat ist ein Rechteck.", true],
          ["Jedes Rechteck ist ein Parallelogramm.", true],
          ["Jedes Quadrat ist eine Raute.", true],
          ["Jedes Parallelogramm ist ein Trapez.", true],
          ["Jedes Rechteck ist ein Quadrat.", false],
          ["Jede Raute ist ein Quadrat.", false],
          ["Jedes Parallelogramm ist ein Rechteck.", false],
        ] as const;
        const [claim, truth] = rng.pick(items);
        const w = rng.int(3, 8),
          h = rng.int(1, 5);
        const name = quadrilateral(w, h, 0, 0).name;
        if (level === 1)
          return task(
            level,
            `Stimmt die Aussage? ${claim}`,
            "",
            [pick("Die Aussage ist …", ["wahr", "falsch"], truth ? 0 : 1)],
            "Überlege, welche Eigenschaften die erste Figur immer hat.",
            truth
              ? "Die erste Figur hat alle Eigenschaften der zweiten."
              : "Die erste Figur muss nicht alle Eigenschaften der zweiten haben.",
            truth ? "Wahr." : "Falsch.",
            {},
          );
        return task(
          level,
          "",
          `Du faltest ein Papier zu einer Figur mit vier rechten Winkeln. Sie ist ${w} cm breit und ${h} cm hoch. Wie heißt sie am genauesten, und wie viele rechte Winkel hat sie?`,
          [
            pick(
              "Name:",
              ["Quadrat", "Rechteck", "Raute"],
              name === "Quadrat" ? 0 : 1,
            ),
            num("Rechte Winkel:", 4, "", 0),
          ],
          "Sind alle Seiten gleich lang?",
          w === h
            ? "Beide Seiten sind gleich lang."
            : "Die Seiten sind verschieden lang.",
          `Es ist ein ${name} mit 4 rechten Winkeln.`,
          { w, h },
        );
      },
    },
  ],
});

const kreis = L(2, {
  id: "ge-3-kreis",
  title: "3.2 Der Kreis",
  subtitle: "Kreislinie, Mittelpunkt, Radius und Durchmesser",
  whyItMatters:
    "Mit dem Zirkel zeichnest du alle Punkte mit dem gleichen Abstand von einem Mittelpunkt.",
  explanationHtml: `<p>Eine <strong>Kreislinie</strong> besteht aus allen Punkten, die vom <strong>Mittelpunkt M</strong> denselben Abstand haben. Dieser Abstand heißt <strong>Radius r</strong>. Eine Strecke durch M von Rand zu Rand ist der <strong>Durchmesser d</strong>, er ist doppelt so lang wie der Radius.</p><p>Die <strong>Kreisfläche</strong> ist die Fläche innerhalb der Kreislinie. Zum Zeichnen markierst du den Mittelpunkt, stellst den Zirkel auf den Radius ein und ziehst bei feststehender Spitze die Kreislinie.</p><p>Ein Punkt liegt innerhalb des Kreises, wenn sein Abstand von M kleiner als r ist, außerhalb, wenn er größer ist, und genau auf der Kreislinie, wenn er gleich r ist.</p><div class="example">Ein Kreis mit r = 3 cm hat d = 6 cm. Ein Punkt mit 4 cm Abstand von M liegt außerhalb. Beim Zeichnen stellst du den Zirkel auf 3 cm ein, nicht auf den Durchmesser von 6 cm.</div><div class="merke"><strong>Merke:</strong> d = 2 · r. Alle Punkte der Kreislinie haben von M den Abstand r.</div>`,
  formulas: [
    {
      name: "Durchmesser",
      html: "d = 2 · r",
      quantities: "r Radius, d Durchmesser",
    },
  ],
  quiz: {
    question: "Ein Kreis hat den Durchmesser 10 cm. Wie groß ist der Radius?",
    options: ["5 cm", "20 cm", "10 cm"],
    correctIndex: 0,
    explanation: "Der Radius ist halb so lang wie der Durchmesser.",
  },
  lab: lab(
    "circle-ms",
    "Kreis untersuchen",
    "Ziehe den Radius und den Punkt P. Prüfe, ob P innerhalb, auf oder außerhalb der Kreislinie liegt.",
    [
      r("r", "Radius", 1, 5, 2, 1, "cm"),
      r("p", "Abstand von P", 0, 6, 1, 0.5, "cm"),
    ],
    [
      o("d", "Durchmesser", (v) => 2 * v.r, "cm"),
      o("lage", "P liegt", (v) =>
        v.p < v.r
          ? "innerhalb"
          : v.p > v.r
            ? "außerhalb"
            : "auf der Kreislinie",
      ),
    ],
    [
      {
        id: "durchmesser",
        text: "Stelle den Kreis so ein, dass der Durchmesser 8 cm ist.",
        check: (v) => v.r === 4,
      },
      {
        id: "viertel",
        text: "Stelle den Radius für einen Kreis mit Durchmesser 10 cm ein.",
        check: (v) => v.r === 5,
      },
      {
        id: "auf-linie",
        text: "Lege den Punkt P genau auf die Kreislinie, bei einem Radius von 3 cm.",
        check: (v) => v.r === 3 && v.p === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "radius-durchmesser",
      make: (rng, level) => {
        const radius = rng.int(2, level === 1 ? 12 : 40);
        const askD = rng.int(0, 1) === 0;
        return task(
          level,
          askD
            ? `Ein Kreis hat den Radius ${radius} cm. Wie groß ist sein Durchmesser?`
            : `Ein Kreis hat den Durchmesser ${2 * radius} cm. Wie groß ist sein Radius?`,
          askD
            ? `Eine Tischplatte soll ${radius} cm vom Mittelpunkt bis zum Rand messen. Wie breit ist die Platte an der breitesten Stelle?`
            : `Ein rundes Becken ist an der breitesten Stelle ${2 * radius} cm breit. Wie weit ist es vom Mittelpunkt bis zum Rand?`,
          [
            num(askD ? "d =" : "r =", askD ? 2 * radius : radius, "cm", 0, {
              slips: [
                {
                  value: askD ? radius / 2 : 4 * radius,
                  hint: "Prüfe die Richtung: Der Durchmesser ist doppelt so lang wie der Radius.",
                },
              ],
            }),
          ],
          "d = 2 · r",
          askD ? `2 · ${radius} cm.` : `${2 * radius} cm : 2.`,
          askD ? `d = ${2 * radius} cm` : `r = ${radius} cm`,
          { radius },
        );
      },
    },
    {
      id: "punktlage",
      make: (rng, level) => {
        const radius = rng.int(2, 9),
          outside = rng.pick([true, false]),
          distance = radius + (outside ? 1 : -1);
        return task(
          level,
          `Ein Punkt hat vom Mittelpunkt den Abstand ${distance} cm. Der Kreis hat den Radius ${radius} cm. Wo liegt der Punkt?`,
          `Eine kreisrunde Scheibe hat den Durchmesser ${2 * radius} cm. Eine Markierung liegt ${distance} cm vom Mittelpunkt entfernt. Liegt die Markierung innerhalb oder außerhalb der Scheibe?`,
          [
            pick(
              "Lage:",
              ["innerhalb", "auf der Kreislinie", "außerhalb"],
              outside ? 2 : 0,
            ),
          ],
          "Vergleiche den Abstand zum Mittelpunkt mit dem Radius, nicht mit dem Durchmesser.",
          `${distance} cm sind ${outside ? "mehr" : "weniger"} als ${radius} cm Radius.`,
          `Der Punkt liegt ${outside ? "außerhalb" : "innerhalb"}.`,
          { radius, distance },
        );
      },
    },
  ],
});

const koordinaten = L(3, {
  id: "ge-6-koordinatensystem",
  title: "3.3 Das Koordinatensystem",
  subtitle: "Punkte festlegen und Figuren darstellen",
  whyItMatters:
    "Mit zwei Zahlen sagst du genau, wo ein Punkt liegt. So funktionieren Karten, Schiffe versenken und Computergrafik.",
  explanationHtml: `<p>Das <strong>Koordinatensystem</strong> hat zwei senkrechte Achsen: die waagrechte <strong>x-Achse</strong> und die senkrechte <strong>y-Achse</strong>. Sie schneiden sich im <strong>Ursprung O(0|0)</strong>.</p><p>Ein Punkt hat zwei <strong>Koordinaten</strong>: P(x|y). Die erste Zahl sagt, wie weit du nach rechts (oder bei einer negativen Zahl nach links) gehst. Die zweite sagt, wie weit nach oben (oder unten). Reihenfolge merken: „erst rechts, dann hoch“.</p><p>Verbindest du Punkte, entstehen Figuren, deren Eigenschaften du prüfen kannst.</p><div class="example">P(3|−2): 3 nach rechts, 2 nach unten. Die Punkte A(1|1), B(5|1), C(5|4) und D(1|4) bilden ein Rechteck mit den Seiten 4 und 3.</div><div class="merke"><strong>Merke:</strong> P(x|y): erst x, dann y. Punkte auf der y-Achse haben x = 0, Punkte auf der x-Achse haben y = 0.</div>`,
  formulas: [
    { name: "Punkt", html: "P(x|y)", quantities: "x nach rechts, y nach oben" },
    { name: "Ursprung", html: "O(0|0)", quantities: "Schnittpunkt der Achsen" },
  ],
  quiz: {
    question: "Wo liegt der Punkt P(0|4)?",
    options: ["Auf der y-Achse", "Auf der x-Achse", "Im Ursprung"],
    correctIndex: 0,
    explanation:
      "x = 0 bedeutet: nicht nach rechts oder links. Der Punkt liegt 4 hoch, also auf der y-Achse.",
  },
  lab: lab(
    "coords",
    "Punkte und Rechteck",
    "Ziehe die Punkte A und C. Daraus entsteht ein Rechteck, dessen Seiten parallel zu den Achsen liegen.",
    [
      r("ax", "x von A", -6, 6, 1),
      r("ay", "y von A", -5, 5, 1),
      r("bx", "x von C", -6, 6, 3),
      r("by", "y von C", -5, 5, 2),
    ],
    [
      o(
        "punkte",
        "Eckpunkte",
        (v) =>
          `A(${n0(v.ax)}|${n0(v.ay)}), B(${n0(v.bx)}|${n0(v.ay)}), C(${n0(v.bx)}|${n0(v.by)}), D(${n0(v.ax)}|${n0(v.by)})`,
      ),
      o("breite", "Breite", (v) => Math.abs(v.bx - v.ax)),
      o("hoehe", "Höhe", (v) => Math.abs(v.by - v.ay)),
    ],
    [
      {
        id: "punkt",
        text: "Setze A auf den Punkt (2|3).",
        check: (v) => v.ax === 2 && v.ay === 3,
      },
      {
        id: "achse",
        text: "Setze C auf die y-Achse, auf den Punkt (0|−4).",
        check: (v) => v.bx === 0 && v.by === -4,
      },
      {
        id: "quadrat",
        text: "Forme ein Quadrat mit der Seitenlänge 4.",
        check: (v) =>
          Math.abs(v.bx - v.ax) === 4 && Math.abs(v.by - v.ay) === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "koordinaten-lesen",
      make: (rng, level) => {
        const x = level === 1 ? rng.int(1, 9) : rng.sign() * rng.int(1, 9);
        const y = level === 1 ? rng.int(1, 9) : rng.sign() * rng.int(1, 9);
        const sideX = x < 0 ? "links" : "rechts";
        const sideY = y < 0 ? "unten" : "oben";
        const steps = (count: number) =>
          `${count} ${count === 1 ? "Feld" : "Felder"}`;
        return task(
          level,
          `Vom Ursprung gehst du ${Math.abs(x)} ${Math.abs(x) === 1 ? "Einheit" : "Einheiten"} nach ${sideX} und ${Math.abs(y)} nach ${sideY}. Gib die Koordinaten an.`,
          `Ein Schatz liegt ${steps(Math.abs(y))} ${sideY === "oben" ? "nördlich" : "südlich"} und ${steps(Math.abs(x))} ${sideX === "rechts" ? "östlich" : "westlich"} vom Ursprung. Rechts ist Osten, oben Norden. Gib die Koordinaten an.`,
          [
            num("x =", x, "", 0, {
              slips:
                Math.abs(x) !== Math.abs(y)
                  ? [
                      {
                        value: y,
                        hint: "Du hast x und y vertauscht. Erst rechts oder links, dann hoch oder runter.",
                      },
                    ]
                  : [],
            }),
            num("y =", y, "", 0),
          ],
          "P(x|y): erst rechts oder links, dann hoch oder runter",
          `Nach ${sideX} bestimmt x, nach ${sideY} bestimmt y.`,
          `P(${n0(x)}|${n0(y)})`,
          { x, y },
        );
      },
    },
    {
      id: "vierter-punkt",
      make: (rng, level) => {
        const ax = rng.int(-4, 2),
          ay = rng.int(-4, 2);
        const w = rng.int(2, 4),
          h = rng.int(2, 3);
        if (level === 1) {
          const n = rng.int(1, 8),
            m = rng.int(1, 8),
            k = rng.int(2, 6);
          return task(
            level,
            `Die Punkte A(${n}|${m}) und B(${n + k}|${m}) liegen auf einer waagrechten Linie. Wie lang ist die Strecke [AB]?`,
            "",
            [num("Länge:", k, "LE", 0)],
            "Gleiche y-Koordinate: Abstand der x-Werte",
            `${n + k} − ${n} = ${k}.`,
            `Die Strecke ist ${k} Längeneinheiten lang.`,
            { n, m, k },
          );
        }
        return task(
          level,
          "",
          `A(${n0(ax)}|${n0(ay)}), B(${n0(ax + w)}|${n0(ay)}) und C(${n0(ax + w)}|${n0(ay + h)}) sind Ecken eines Rechtecks. Welche Koordinaten hat die vierte Ecke D?`,
          [num("x =", ax, "", 0), num("y =", ay + h, "", 0)],
          "D liegt über A und auf gleicher Höhe wie C.",
          `D hat das x von A und das y von C.`,
          `D(${n0(ax)}|${n0(ay + h)})`,
          { ax, ay, w, h },
        );
      },
    },
  ],
});

const koerper = L(4, {
  id: "ge-9-koerper",
  title: "3.4 Körper erkennen",
  subtitle: "Ecken, Kanten und Begrenzungsflächen",
  whyItMatters:
    "Dosen, Würfel, Dächer und Bälle: Die Welt besteht aus Körpern. Du lernst, sie genau zu beschreiben.",
  explanationHtml: `<p>Körper beschreibst du mit der Anzahl ihrer <strong>Ecken</strong> und <strong>Kanten</strong> sowie mit Form und Lage ihrer <strong>Begrenzungsflächen</strong>.</p><p><strong>Würfel:</strong> 8 Ecken, 12 gleich lange Kanten, 6 Quadrate. <strong>Quader:</strong> 8 Ecken, 12 Kanten, 6 Rechtecke. <strong>Prisma:</strong> zwei gleiche, parallele Vielecke als Grund- und Deckfläche, außen Rechtecke. Das dreiseitige hat 6 Ecken, 9 Kanten, 5 Flächen. <strong>Pyramide:</strong> ein Vieleck als Grundfläche, außen Dreiecke, die sich in der Spitze treffen. Die viereckige hat 5 Ecken, 8 Kanten, 5 Flächen.</p><p><strong>Zylinder:</strong> 2 parallele Kreise, 1 gekrümmte Mantelfläche, 2 Kanten. <strong>Kegel:</strong> 1 Kreis, 1 gekrümmte Fläche, 1 Kante und eine Spitze. <strong>Kugel:</strong> nur 1 gekrümmte Fläche, keine Kante und keine Ecke.</p><div class="example">Eine Milchtüte ist ein Quader, eine Konservendose ein Zylinder, eine Eiswaffel ein Kegel.</div><div class="merke"><strong>Merke:</strong> Zähle Ecken und Kanten. Gekrümmte Flächen gibt es nur bei Zylinder, Kegel und Kugel.</div>`,
  formulas: [
    {
      name: "Quader und Würfel",
      html: "8 Ecken, 12 Kanten, 6 Flächen",
      quantities: "Beim Würfel sind alle Kanten gleich lang.",
    },
    {
      name: "Dreiseitiges Prisma",
      html: "6 Ecken, 9 Kanten, 5 Flächen",
      quantities: "2 Dreiecke und 3 Rechtecke",
    },
    {
      name: "Viereckige Pyramide",
      html: "5 Ecken, 8 Kanten, 5 Flächen",
      quantities: "1 Viereck und 4 Dreiecke",
    },
  ],
  quiz: {
    question: "Welcher Körper hat keine Kante?",
    options: ["Kugel", "Zylinder", "Kegel"],
    correctIndex: 0,
    explanation:
      "Die Kugel hat nur eine gekrümmte Fläche. Zylinder und Kegel haben Kanten am Rand ihrer Kreise.",
  },
  lab: lab(
    "solids",
    "Körper ansehen",
    "Wähle einen Körper und was du hervorheben willst. Gestrichelte Linien sind verdeckt.",
    [
      c(
        "body",
        "Körper",
        SOLIDS.map((s) => s.name),
      ),
      c("show", "Hervorheben", ["Ecken", "Kanten"]),
    ],
    [
      o("ecken", "Ecken", (v) => SOLIDS[v.body].ecken),
      o("kanten", "Kanten", (v) => SOLIDS[v.body].kanten),
      o("flaechen", "Flächen", (v) => SOLIDS[v.body].flaechen),
    ],
    [
      {
        id: "prisma",
        text: "Finde den Körper mit 6 Ecken und 9 Kanten.",
        check: (v) => v.body === 2,
      },
      {
        id: "pyramide",
        text: "Finde den Körper mit 5 Ecken und 8 Kanten.",
        check: (v) => v.body === 3,
      },
      {
        id: "kegel",
        text: "Finde den Körper mit genau einer Kante und einer Spitze.",
        check: (v) => v.body === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level) => {
        const body = rng.pick(SOLIDS.slice(0, 4));
        const pickProp = rng.pick(["Ecken", "Kanten", "Flächen"] as const);
        const value =
          pickProp === "Ecken"
            ? body.ecken
            : pickProp === "Kanten"
              ? body.kanten
              : body.flaechen;
        if (level === 1)
          return task(
            level,
            `Wie viele ${pickProp} hat dieser Körper: ${body.name}?`,
            "",
            [num(`${pickProp}:`, value, "", 0)],
            "Stelle dir den Körper vor und zähle systematisch.",
            `${body.name}: ${body.ecken} Ecken, ${body.kanten} Kanten, ${body.flaechen} Flächen.`,
            `${value} ${pickProp}`,
            {},
          );
        const count = rng.int(2, 6);
        return task(
          level,
          "",
          `Du baust ${count} Modelle dieses Körpers aus Trinkhalmen und Knetkugeln: ${body.name}. Jede Kante ist ein Halm, jede Ecke eine Kugel. Wie viele Halme und wie viele Kugeln brauchst du?`,
          [
            num("Halme:", count * body.kanten, "", 0),
            num("Kugeln:", count * body.ecken, "", 0),
          ],
          "Kanten und Ecken eines Modells mal Anzahl der Modelle.",
          `${count} · ${body.kanten} Halme und ${count} · ${body.ecken} Kugeln.`,
          `${count * body.kanten} Halme, ${count * body.ecken} Kugeln`,
          { count },
        );
      },
    },
    {
      id: "erkennen",
      make: (rng, level) => {
        const body = rng.pick(SOLIDS);
        const others = rng
          .shuffle(
            SOLIDS.filter(
              (s) =>
                s.name !== body.name &&
                (s.ecken !== body.ecken || s.kanten !== body.kanten),
            ),
          )
          .slice(0, 2);
        const objects: Array<[string, string]> = [
          ["eine Konservendose", "Zylinder"],
          ["eine Eiswaffel", "Kegel"],
          ["ein Fußball", "Kugel"],
          ["eine Milchtüte", "Quader"],
          ["ein Spielwürfel", "Würfel"],
          ["ein Zelt mit dreieckigem Eingang", "Prisma (dreiseitig)"],
        ];
        const [thing, shape] = rng.pick(objects);
        const options = [
          shape,
          ...rng
            .shuffle(SOLIDS.map((s) => s.name).filter((n) => n !== shape))
            .slice(0, 2),
        ];
        return task(
          level,
          `Welcher Körper hat ${body.ecken} ${body.ecken === 1 ? "Ecke" : "Ecken"}, ${body.kanten} ${body.kanten === 1 ? "Kante" : "Kanten"} und ${body.flaechen} ${body.flaechen === 1 ? "Fläche" : "Flächen"}? Seine Begrenzung: ${body.form}.`,
          `Welche Körperform passt am genauesten zu diesem Gegenstand: ${thing}?`,
          [
            level === 1
              ? pick("Körper:", [body.name, ...others.map((s) => s.name)], 0)
              : pick("Körper:", options, 0),
          ],
          "Schau auf die Form der Flächen.",
          level === 1 ? body.form : `${thing} hat die Form: ${shape}.`,
          level === 1 ? `Das ist: ${body.name}.` : `Es ist: ${shape}.`,
          {},
        );
      },
    },
  ],
});

const netze = L(5, {
  id: "ge-10-netze",
  title: "3.5 Netze von Quader und Würfel",
  subtitle: "Körper aufschneiden und flach legen",
  whyItMatters:
    "Jede Faltschachtel beginnt als flaches Netz. Wer Netze zeichnen kann, baut Körper selbst.",
  explanationHtml: `<p>Schneidest du einen Körper an einigen Kanten auf und legst ihn flach hin, entsteht sein <strong>Netz</strong>. Ein Quader hat 6 Rechtecke, davon sind je zwei gegenüberliegende gleich groß. Ein Würfel hat 6 gleich große Quadrate.</p><p><strong>So zeichnest du das Netz eines Quaders:</strong> Zeichne einen Streifen aus vier Rechtecken, die zusammen um den Körper reichen. Setze oben und unten je ein Rechteck für Deckel und Boden an.</p><p>Ein Quader mit den Kanten a, b und c hat 4 Kanten jeder Länge, zusammen also 4 · (a + b + c).</p><div class="example">Quader mit a = 4 cm, b = 3 cm, c = 2 cm: Der Streifen ist 2 · (4 + 2) = 12 cm breit und 3 cm hoch. Deckel und Boden sind 4 cm mal 2 cm groß. Gesamte Kantenlänge: 4 · 9 cm = 36 cm.</div><div class="merke"><strong>Merke:</strong> Im Netz gibt es jedes Rechteck des Quaders zweimal. Gesamte Kantenlänge = 4 · (a + b + c).</div>`,
  formulas: [
    {
      name: "Kantenlänge des Quaders",
      html: "4 · (a + b + c)",
      quantities: "a, b, c Kanten des Quaders",
    },
    {
      name: "Kantenlänge des Würfels",
      html: "12 · a",
      quantities: "a Kante des Würfels",
    },
  ],
  quiz: {
    question: "Aus wie vielen Flächen besteht das Netz eines Quaders?",
    options: ["6", "4", "12"],
    correctIndex: 0,
    explanation: "Ein Quader hat 6 Flächen. 12 ist die Zahl seiner Kanten.",
  },
  lab: lab(
    "box-net",
    "Quadernetz zeichnen",
    "Stelle die Kantenlängen ein. Gleiche Farbe bedeutet gleich große Rechtecke.",
    [
      r("a", "Länge a", 1, 5, 3, 1, "cm"),
      r("b", "Höhe b", 1, 5, 2, 1, "cm"),
      r("c", "Tiefe c", 1, 5, 1, 1, "cm"),
    ],
    [
      o("breite", "Breite des Netzes", (v) => 2 * (v.a + v.c), "cm"),
      o("hoehe", "Höhe des Netzes", (v) => v.b + 2 * v.c, "cm"),
      o("kanten", "Gesamte Kantenlänge", (v) => 4 * (v.a + v.b + v.c), "cm"),
    ],
    [
      {
        id: "wuerfel",
        text: "Mache daraus das Netz eines Würfels mit 3 cm Kantenlänge.",
        check: (v) => v.a === 3 && v.b === 3 && v.c === 3,
      },
      {
        id: "breit",
        text: "Stelle einen Quader ein, dessen Netz genau 14 cm breit und 5 cm hoch ist.",
        check: (v) => 2 * (v.a + v.c) === 14 && v.b + 2 * v.c === 5,
      },
      {
        id: "draht",
        text: "Finde einen Quader mit drei verschiedenen Kantenlängen und 48 cm Kantenlänge insgesamt.",
        check: (v) =>
          4 * (v.a + v.b + v.c) === 48 &&
          v.a !== v.b &&
          v.b !== v.c &&
          v.a !== v.c,
      },
    ],
  ),
  exercises: [
    {
      id: "kantenlaenge",
      make: (rng, level) => {
        const a = rng.int(2, 9),
          b = rng.int(2, 9),
          d = rng.int(2, 9);
        const cube = level === 1;
        const value = cube ? 12 * a : 4 * (a + b + d);
        return task(
          level,
          `Ein Würfel hat die Kantenlänge ${a} cm. Wie lang sind alle seine Kanten zusammen?`,
          `Für ein Kantenmodell eines Quaders mit den Maßen ${a} cm, ${b} cm und ${d} cm wird Draht gebraucht. Wie viel Draht ist das mindestens?`,
          [
            num("Länge:", value, "cm", 0, {
              slips: [
                {
                  value: cube ? 6 * a : a + b + d,
                  hint: cube
                    ? "Ein Würfel hat 12 Kanten, nicht 6."
                    : "Jede Kantenlänge kommt viermal vor.",
                },
              ],
            }),
          ],
          cube ? "Gesamtlänge = 12 · Kante" : "Gesamtlänge = 4 · (a + b + c)",
          cube
            ? `12 · ${a} cm.`
            : `4 · (${a} + ${b} + ${d}) cm = 4 · ${a + b + d} cm.`,
          `Zusammen ${value} cm`,
          { a, b, d },
        );
      },
    },
    {
      id: "netzmasse",
      make: (rng, level) => {
        const a = rng.int(2, 8),
          b = rng.int(2, 8),
          d = rng.int(1, 5);
        const width = 2 * (a + d);
        const height = b + 2 * d;
        return task(
          level,
          `Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${d} cm. Wie breit ist der Streifen aus vier Rechtecken in seinem Netz? Rechne 2 · (a + c).`,
          `Du willst eine Schachtel mit den Maßen ${a} cm, ${b} cm (Höhe) und ${d} cm (Tiefe) falten. Wie breit und wie hoch muss das rechteckige Blatt für das Netz mindestens sein?`,
          [
            num("Breite:", width, "cm", 0),
            ...(level === 2 ? [num("Höhe:", height, "cm", 0)] : []),
          ],
          "Breite 2 · (a + c), Höhe b + 2 · c",
          `Breite: 2 · (${a} + ${d}) = ${width}.${level === 2 ? ` Höhe: ${b} + 2 · ${d} = ${height}.` : ""}`,
          level === 1
            ? `${width} cm`
            : `${width} cm breit und ${height} cm hoch`,
          { a, b, d },
        );
      },
    },
  ],
});

const schraegbild = L(6, {
  id: "ge-11-schraegbild",
  title: "3.6 Schrägbilder zeichnen",
  subtitle: "Quader und Würfel räumlich auf Papier",
  whyItMatters:
    "Auf dem flachen Papier soll ein Körper räumlich aussehen. Das Schrägbild ist die einfachste Methode dafür.",
  explanationHtml: `<p>Beim <strong>Schrägbild</strong> zeichnest du die Vorderseite in wahrer Größe. Alle Kanten, die nach hinten laufen, zeichnest du unter einem Winkel von <strong>45°</strong> und nur <strong>halb so lang</strong>. Auf Karopapier ist das einfach: die Diagonale eines Kästchens.</p><p><strong>Verdeckte Kanten</strong> zeichnest du gestrichelt. Beim Quader sind es von vorn drei.</p><p><strong>Reihenfolge:</strong> Vorderseite zeichnen, von jeder Ecke die Tiefe schräg antragen, die hinteren Ecken verbinden, verdeckte Kanten stricheln.</p><div class="example">Würfel mit a = 4 cm: Vorderseite 4 cm mal 4 cm. Tiefe gezeichnet 2 cm unter 45°.</div><div class="merke"><strong>Merke:</strong> Nach hinten: 45° und halbe Länge. Verdeckte Kanten: gestrichelt.</div>`,
  formulas: [
    {
      name: "Tiefe im Schrägbild",
      html: "gezeichnet = Tiefe : 2",
      quantities: "Unter 45° zur Vorderkante",
    },
  ],
  quiz: {
    question:
      "Ein Quader ist 6 cm tief. Wie lang zeichnest du die Tiefe im Schrägbild?",
    options: ["3 cm", "6 cm", "12 cm"],
    correctIndex: 0,
    explanation:
      "Kanten nach hinten werden im Schrägbild halb so lang gezeichnet.",
  },
  lab: lab(
    "oblique",
    "Schrägbild eines Quaders",
    "Ziehe die Ecke der Vorderseite und stelle mit dem Regler die Tiefe ein. Beobachte die gestrichelten Kanten.",
    [
      r("a", "Breite a", 1, 8, 3, 1, "cm"),
      r("b", "Höhe b", 1, 6, 2, 1, "cm"),
      r("c", "Tiefe c", 1, 8, 2, 1, "cm"),
    ],
    [
      o("tiefe", "Tiefe gezeichnet", (v) => v.c / 2, "cm", 1),
      o("verdeckt", "Verdeckte Kanten", () => 3),
      o("sichtbar", "Sichtbare Kanten", () => 9),
    ],
    [
      {
        id: "wuerfel",
        text: "Zeichne einen Würfel mit a = 4 cm.",
        check: (v) => v.a === 4 && v.b === 4 && v.c === 4,
      },
      {
        id: "quader",
        text: "Zeichne einen Quader, 6 cm breit, 3 cm hoch, 4 cm tief.",
        check: (v) => v.a === 6 && v.b === 3 && v.c === 4,
      },
      {
        id: "halb",
        text: "Stelle die Tiefe so ein, dass im Bild 1,5 cm gezeichnet werden.",
        check: (v) => v.c === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "tiefe",
      make: (rng, level) => {
        const c2 = rng.int(1, 8);
        const c1 = 2 * c2;
        if (level === 1)
          return task(
            level,
            `Ein Quader ist ${c1} cm tief. Wie lang zeichnest du die schräge Kante im Schrägbild?`,
            "",
            [
              num("Länge:", c2, "cm", 0, {
                slips: [
                  {
                    value: c1,
                    hint: "Das ist die wahre Tiefe. Im Bild wird sie halb so lang.",
                  },
                ],
              }),
            ],
            "Gezeichnete Tiefe = Tiefe : 2",
            `${c1} cm : 2.`,
            `${c2} cm`,
            { c1 },
          );
        return task(
          level,
          "",
          `Im Schrägbild eines Quaders ist die schräge Kante ${c2} cm lang. Wie tief ist der Quader in Wirklichkeit? Und unter welchem Winkel ist die Kante gezeichnet?`,
          [num("Tiefe:", c1, "cm", 0), num("Winkel:", 45, "°", 0)],
          "Umgekehrt: Du verdoppelst.",
          `${c2} cm · 2 = ${c1} cm.`,
          `${c1} cm tief, 45°`,
          { c2 },
        );
      },
    },
    {
      id: "kanten-im-bild",
      make: (rng, level) => {
        const a = rng.int(2, 9),
          b = rng.int(2, 9),
          d = rng.int(1, 8) * 2;
        const items = [
          ["verdeckte Kanten", 3],
          ["sichtbare Kanten", 9],
          ["Kanten insgesamt", 12],
        ] as const;
        const [word, count] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Wie viele ${word} hat das Schrägbild eines Quaders, wenn du ihn von vorn oben ansiehst?`,
            "",
            [num("Kanten:", count, "", 0)],
            "Ein Quader hat 12 Kanten, 3 davon sind verdeckt.",
            "3 verdeckt + 9 sichtbar = 12.",
            `${count} Kanten`,
            {},
          );
        return task(
          level,
          "",
          `Du zeichnest einen Quader mit Breite ${a} cm, Höhe ${b} cm und Tiefe ${d} cm als Schrägbild. Wie lang wird im Bild jede der vier schrägen Kanten, und wie lang sind diese vier zusammen?`,
          [
            num("Eine Kante:", d / 2, "cm", 0),
            num("Alle vier:", 4 * (d / 2), "cm", 0),
          ],
          "Jede schräge Kante ist halb so lang wie die Tiefe.",
          `${d} cm : 2 = ${d / 2} cm, und 4 · ${d / 2} cm = ${4 * (d / 2)} cm.`,
          `${d / 2} cm je Kante, zusammen ${4 * (d / 2)} cm`,
          { a, b, d },
        );
      },
    },
  ],
});

const kopfgeometrie = L(7, {
  id: "ge-12-kopfgeometrie",
  title: "3.7 Kopfgeometrie",
  subtitle: "Netze im Kopf falten und Körper drehen",
  whyItMatters:
    "Vorstellungskraft kannst du trainieren. Wer Körper im Kopf falten und drehen kann, löst Aufgaben schneller und braucht weniger Skizzen.",
  explanationHtml: `<p>Bei der <strong>Kopfgeometrie</strong> löst du Aufgaben in der Vorstellung, ohne zu zeichnen. Eine typische Frage: Ergibt ein Muster aus sechs Quadraten einen Würfel? Welche Fläche liegt welcher gegenüber?</p><p>Das hilft dir beim Falten im Kopf:</p><p><strong>In einer geraden Reihe</strong> liegen sich Quadrate gegenüber, zwischen denen genau ein Quadrat liegt. <strong>Vier Quadrate im Block</strong> (2 mal 2) gehen nie: Sie liegen nicht um eine Ecke. Eine <strong>Reihe aus fünf oder mehr</strong> Quadraten geht auch nicht, denn sie würde sich überlappen.</p><p>Auf einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen immer 7.</p><div class="example">Im Kreuz stehen 2, 3, 4, 5 in einer Reihe, 1 darüber und 6 darunter (beide bei der 3). Gegenüber liegen 2 und 4, 3 und 5, 1 und 6.</div><div class="merke"><strong>Merke:</strong> Zwischen zwei Gegenüberliegenden in einer Reihe ist genau ein Quadrat. Kein Viererblock, keine Fünferreihe.</div>`,
  formulas: [
    {
      name: "Würfelnetz",
      html: "6 Quadrate, kein 2-mal-2-Block, keine Reihe aus 5 oder mehr",
      quantities:
        "Das schließt viele Muster aus. Es gibt genau 11 verschiedene Würfelnetze.",
    },
    {
      name: "Spielwürfel",
      html: "Augen gegenüber: 1 + 6 = 2 + 5 = 3 + 4 = 7",
      quantities: "Immer 7",
    },
  ],
  quiz: {
    question: "Ein Spielwürfel zeigt oben eine 2. Wie viele Augen sind unten?",
    options: ["5", "4", "6"],
    correctIndex: 0,
    explanation: "Gegenüberliegende Seiten ergeben zusammen 7, und 7 − 2 = 5.",
  },
  lab: lab(
    "cube-net",
    "Netz im Kopf falten",
    "Wähle ein Muster und eine Fläche. Überlege zuerst, welche Fläche gegenüberliegt, dann schaue nach.",
    [
      c(
        "pattern",
        "Muster",
        NET_PATTERNS.map((p) => p.name),
      ),
      r("face", "Fläche", 1, 6, 3),
    ],
    [
      o("netz", "Würfelnetz?", (v) =>
        oppositeFace(NET_PATTERNS[v.pattern], v.face) === null ? "nein" : "ja",
      ),
      o(
        "gegenueber",
        "Gegenüber",
        (v) => oppositeFace(NET_PATTERNS[v.pattern], v.face) ?? "kein Würfel",
      ),
    ],
    [
      {
        id: "kreuz",
        text: "Zeige im Kreuz, welche Fläche der 1 gegenüberliegt.",
        check: (v) => v.pattern === 0 && v.face === 1,
      },
      {
        id: "kein-netz",
        text: "Finde das Muster aus zwei Dreierreihen. Es ergibt keinen Würfel.",
        check: (v) => v.pattern === 3,
      },
      {
        id: "treppe",
        text: "Zeige in der Treppe die Fläche, die der 5 gegenüberliegt, indem du die 2 wählst.",
        check: (v) => v.pattern === 1 && v.face === 2,
      },
    ],
  ),
  exercises: [
    {
      id: "spielwuerfel",
      make: (rng, level) => {
        const top = rng.int(1, 6);
        const tosses = rng.int(2, 5);
        const shown = `${top} ${top === 1 ? "Auge" : "Augen"}`;
        if (level === 1)
          return task(
            level,
            `Ein Spielwürfel zeigt oben ${shown}. Wie viele Augen sind unten?`,
            "",
            [num("Augen:", 7 - top, "", 0)],
            "Gegenüberliegende Seiten ergeben 7.",
            `7 − ${top} = ${7 - top}.`,
            7 - top === 1
              ? "Unten ist 1 Auge."
              : `Unten sind ${7 - top} Augen.`,
            { top },
          );
        const hidden = 21 - top;
        return task(
          level,
          "",
          `Du kippst einen Spielwürfel ${tosses}-mal und er zeigt am Ende oben ${shown}. Wie viele Augen zeigen dann alle anderen fünf Seiten zusammen? Alle Seiten zusammen haben 21 Augen.`,
          [num("Augen:", hidden, "", 0)],
          "1 + 2 + 3 + 4 + 5 + 6 = 21",
          `21 − ${top} = ${hidden}. Das Kippen ändert daran nichts.`,
          `${hidden} Augen`,
          { top, tosses },
        );
      },
    },
    {
      id: "netz-oder-nicht",
      make: (rng, level) => {
        const index = rng.int(0, NET_PATTERNS.length - 1);
        const pattern = NET_PATTERNS[index];
        const isNet = oppositeFace(pattern, 1) !== null;
        if (level === 1)
          return task(
            level,
            `Stelle dir das Muster „${pattern.name}“ aus sechs Quadraten vor. Du findest es im Labor dieser Lektion. Ergibt es einen Würfel?`,
            "",
            [pick("Antwort:", ["ja", "nein"], isNet ? 0 : 1)],
            "Kein 2-mal-2-Block und keine Reihe aus 5 oder mehr.",
            isNet
              ? "Es gibt weder einen Viererblock noch eine zu lange Reihe."
              : "Es gibt einen Viererblock oder eine zu lange Reihe.",
            isNet
              ? "Ja, das Muster ergibt einen Würfel."
              : "Nein, es ergibt keinen Würfel.",
            { index },
          );
        const face = rng.int(1, 6);
        const cross = NET_PATTERNS[0];
        const other = oppositeFace(cross, face)!;
        return task(
          level,
          "",
          `Im Kreuz stehen die Flächen 2, 3, 4 und 5 in einer Reihe, die 1 über der 3 und die 6 unter der 3. Du faltest den Würfel im Kopf. Welche Fläche liegt der ${face} gegenüber?`,
          [num("Fläche:", other, "", 0)],
          "In der Reihe liegt zwischen Gegenüberliegenden genau eine Fläche.",
          `Die Paare sind 1 und 6, 2 und 4, 3 und 5.`,
          `Gegenüber liegt die ${other}.`,
          { face },
        );
      },
    },
  ],
});

export const LESSONS = [
  vierecke,
  kreis,
  koordinaten,
  koerper,
  netze,
  schraegbild,
  kopfgeometrie,
];
