import { fmt, frac } from "../exercises/format";
import { clean, roundSchool } from "../models";
import { numberField as num } from "./helpers";
import {
  choice as c,
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";

const L = (step: number, content: Parameters<typeof makeLesson>[2]) =>
  makeLesson(3, step, content);

const parallelogramm = L(1, {
  id: "fl-1-parallelogramm",
  title: "3.1 Flächen zerlegen: das Parallelogramm",
  subtitle: "Vom Rechteck zur Formel A = g · h",
  whyItMatters:
    "Du kennst aus Klasse 5 die Formel für das Rechteck. Durch Zerlegen führst du neue Figuren darauf zurück, statt jede Formel nur auswendig zu lernen.",
  explanationHtml: `<p>Zwei Figuren sind <strong>zerlegungsgleich</strong>, wenn du sie in paarweise kongruente Teilflächen zerlegen kannst. Sie haben dann denselben Flächeninhalt.</p><p>Beim <strong>Parallelogramm</strong> schneidest du entlang einer Höhe ein Dreieck ab und setzt es auf der anderen Seite an. Es entsteht ein Rechteck mit der Länge g und der Breite h. Die <strong>Höhe</strong> steht senkrecht auf der Grundseite. Sie ist nicht die schräge Seite.</p><div class="example">g = 6 cm, h = 4 cm: A = 6 cm · 4 cm = 24 cm². Die schräge Seite (zum Beispiel 5 cm) kommt in der Rechnung nicht vor.</div><p>Zu jeder Seite gehört eine eigene Höhe: A = g · h<sub>g</sub> = s · h<sub>s</sub>.</p><div class="merke"><strong>Merke:</strong> Parallelogramm: Flächeninhalt = Grundseite mal zugehörige Höhe. Verschiebst du die obere Seite parallel, ändert sich die Fläche nicht.</div>`,
  formulas: [
    {
      name: "Parallelogramm",
      html: "A = g · h",
      quantities: "g Grundseite, h zugehörige Höhe (senkrecht zu g)",
    },
  ],
  quiz: {
    question: "Ein Parallelogramm hat g = 8 cm, die schräge Seite s = 5 cm und die Höhe h = 4 cm auf g. Wie groß ist A?",
    options: ["32 cm²", "40 cm²", "26 cm²"],
    correctIndex: 0,
    explanation: "A = g · h = 8 cm · 4 cm. Die schräge Seite gehört nicht in die Formel. 40 cm² wäre g · s, 26 cm der Umfang.",
  },
  lab: lab(
    "area-parallelogram",
    "Parallelogramm umbauen",
    "Ziehe die obere Ecke und zeige die Zerlegung an. Die Fläche ändert sich beim Verschieben nicht.",
    [
      r("g", "Grundseite g", 2, 8, 5, 1, "cm"),
      r("h", "Höhe h", 1, 6, 3, 1, "cm"),
      r("s", "Versatz der oberen Seite", 0, 4, 2),
      c("cut", "Ansicht", ["Parallelogramm", "zerlegt zum Rechteck"]),
    ],
    [
      o("area", "Flächeninhalt", (v) => v.g * v.h, "cm²", 0),
      o("slant", "Schräge Seite", (v) => Math.hypot(v.s, v.h), "cm", 2),
    ],
    [
      {
        id: "vierundzwanzig",
        text: "Stelle g = 6 cm und h = 4 cm ein.",
        check: (v) => v.g === 6 && v.h === 4,
      },
      {
        id: "zerlegt",
        text: "Zeige die Zerlegung für einen Versatz von 3.",
        check: (v) => v.cut === 1 && v.s === 3,
      },
      {
        id: "rechteck",
        text: "Verschiebe die obere Seite so, dass ein Rechteck mit 12 cm² entsteht.",
        check: (v) => v.s === 0 && v.g * v.h === 12,
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const g = rng.int(30, 120) / 10;
        const h = rng.int(20, 80) / 10;
        const area = clean(g * h);
        if (level === 1) {
          const s = clean(h + rng.int(5, 20) / 10);
          return task(
            level,
            `Ein Parallelogramm hat die Grundseite g = ${fmt(g)} cm, die schräge Seite s = ${fmt(s)} cm und die Höhe h = ${fmt(h)} cm auf g. Berechne den Flächeninhalt.`,
            "",
            [
              num("A =", area, "cm²", 2, {
                slips: [{ value: clean(g * s), hint: "Du hast mit der schrägen Seite gerechnet. Die Höhe steht senkrecht auf g." }],
              }),
            ],
            "A = g · h, die schräge Seite wird nicht gebraucht.",
            `${fmt(g)} · ${fmt(h)} = ${fmt(area)}.`,
            `${fmt(area)} cm².`,
            { g, h },
          );
        }
        const side = rng.pick([4, 5, 6, 8, 10]);
        const heightOnSide = rng.pick([3, 4, 6, 9, 12]);
        const longSide = rng.pick([12, 15, 16, 18, 20]);
        const a = side * heightOnSide;
        return task(
          level,
          "",
          `Ein Parallelogramm hat die Seite s = ${side} cm mit der zugehörigen Höhe ${heightOnSide} cm. Seine andere Seite ist ${longSide} cm lang. Berechne den Flächeninhalt und die Höhe auf die Seite mit ${longSide} cm. Runde auf zwei Stellen.`,
          [num("A =", a, "cm²", 0), num("Höhe =", roundSchool(a / longSide, 2), "cm", 2)],
          "Jede Seite hat ihre eigene Höhe, aber der Flächeninhalt bleibt derselbe.",
          `A = ${side} · ${heightOnSide} = ${a}; ${a} : ${longSide} = ${fmt(a / longSide, 3)}.`,
          `A = ${a} cm², Höhe ≈ ${fmt(roundSchool(a / longSide, 2))} cm.`,
          { side, heightOnSide, longSide },
        );
      },
    },
    {
      id: "rueckwaerts",
      make: (rng, level) => {
        const g = rng.int(3, 15);
        const h = rng.int(2, 12);
        const area = g * h;
        if (level === 1)
          return task(
            level,
            `Ein Parallelogramm hat den Flächeninhalt ${area} cm² und die Grundseite ${g} cm. Wie groß ist die Höhe?`,
            "",
            [num("h =", h, "cm", 2)],
            "Aus A = g · h folgt h = A : g.",
            `${area} : ${g} = ${h}.`,
            `${h} cm.`,
            { g, h },
          );
        const price = rng.pick([12, 18, 24, 35]);
        return task(
          level,
          "",
          `Ein Beet hat die Form eines Parallelogramms mit der Grundseite ${g} m und der Höhe ${h} m. Pro m² kosten die Pflanzen ${price} €. Wie groß ist das Beet und was kosten die Pflanzen?`,
          [num("A =", area, "m²", 0), num("Kosten =", area * price, "€", 0)],
          "Erst A = g · h, dann Fläche mal Preis pro m².",
          `${g} · ${h} = ${area}; ${area} · ${price} = ${area * price}.`,
          `${area} m² und ${area * price} €.`,
          { g, h, price },
        );
      },
    },
  ],
});

const dreieck = L(2, {
  id: "fl-2-dreieck",
  title: "3.2 Der Flächeninhalt des Dreiecks",
  subtitle: "Ein Dreieck ist ein halbes Parallelogramm",
  whyItMatters:
    "Dächer, Segel und Grundstücke sind oft dreieckig. Zwei gleiche Dreiecke ergeben zusammen ein Parallelogramm, daher kommt die Formel.",
  explanationHtml: `<p>Legst du ein Dreieck und eine gedrehte Kopie zusammen, entsteht ein <strong>Parallelogramm</strong> mit derselben Grundseite und derselben Höhe. Das Dreieck hat also die halbe Fläche.</p><p>Jede Seite kann Grundseite sein. Die zugehörige Höhe ist die Senkrechte von der gegenüberliegenden Ecke auf die Gerade durch diese Seite. Beim stumpfwinkligen Dreieck kann die Höhe außerhalb des Dreiecks liegen, beim rechtwinkligen Dreieck ist eine Kathete die Höhe auf die andere.</p><div class="example">g = 8 cm, h = 5 cm: A = 8 cm · 5 cm : 2 = 20 cm². Bei einem rechtwinkligen Dreieck mit den Katheten 6 cm und 4 cm gilt A = 6 cm · 4 cm : 2 = 12 cm².</div><div class="merke"><strong>Merke:</strong> Dreieck: A = g · h : 2. Grundseite und Höhe müssen zusammengehören und senkrecht aufeinander stehen.</div>`,
  formulas: [
    {
      name: "Dreieck",
      html: `A = ${frac("g · h", 2)}`,
      quantities: "g Grundseite, h zugehörige Höhe",
    },
  ],
  quiz: {
    question: "Warum steht in der Dreiecksformel „: 2“?",
    options: [
      "Zwei gleiche Dreiecke ergeben ein Parallelogramm.",
      "Ein Dreieck hat zwei schräge Seiten.",
      "Die Höhe liegt immer in der Mitte.",
    ],
    correctIndex: 0,
    explanation: "Das Parallelogramm hat die Fläche g · h, das Dreieck genau die Hälfte davon.",
  },
  lab: lab(
    "area-triangle",
    "Dreieck verformen",
    "Ziehe die Spitze. Solange die Höhe gleich bleibt, bleibt auch die Fläche gleich, selbst wenn die Spitze über die Grundseite hinausragt.",
    [
      r("g", "Grundseite g", 2, 8, 4, 1, "cm"),
      r("h", "Höhe h", 1, 7, 3, 1, "cm"),
      r("s", "Lage der Spitze", -2, 9, 2),
    ],
    [
      o("area", "Flächeninhalt", (v) => (v.g * v.h) / 2, "cm²", 1),
      o("type", "Die Höhe liegt", (v) =>
        v.s < 0 || v.s > v.g ? "außerhalb des Dreiecks" : v.s === 0 || v.s === v.g ? "auf einer Seite: rechter Winkel" : "innerhalb des Dreiecks",
      ),
    ],
    [
      {
        id: "zwoelf",
        text: "Stelle ein Dreieck mit g = 6 cm und 12 cm² ein.",
        check: (v) => v.g === 6 && v.h === 4,
      },
      {
        id: "rechtwinklig",
        text: "Erzeuge ein rechtwinkliges Dreieck: Die Höhe ist zugleich eine Seite.",
        check: (v) => v.s === 0 || v.s === v.g,
      },
      {
        id: "aussen",
        text: "Erzeuge ein Dreieck, dessen Höhe außerhalb liegt.",
        check: (v) => v.s < 0 || v.s > v.g,
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const g = rng.int(3, 16);
        const h = rng.int(2, 12);
        const area = (g * h) / 2;
        if (level === 1)
          return task(
            level,
            `Ein Dreieck hat die Grundseite ${g} cm und die zugehörige Höhe ${h} cm. Berechne den Flächeninhalt.`,
            "",
            [
              num("A =", area, "cm²", 1, {
                slips: [{ value: g * h, hint: "Das ist das ganze Parallelogramm. Das Dreieck ist die Hälfte." }],
              }),
            ],
            "A = g · h : 2",
            `${g} · ${h} : 2.`,
            `${fmt(area)} cm².`,
            { g, h },
          );
        const price = rng.pick([20, 25, 30, 40]);
        return task(
          level,
          "",
          `Ein dreieckiges Segel ist unten ${g} m breit und ${h} m hoch; Breite und Höhe stehen senkrecht aufeinander. Der Stoff kostet ${price} € pro m². Wie groß ist das Segel, und was kostet der Stoff?`,
          [num("A =", area, "m²", 1), num("Kosten =", area * price, "€", 0)],
          "Erst A = g · h : 2, dann mal Preis pro m².",
          `A = ${fmt(area)} m², ${fmt(area)} · ${price}.`,
          `${fmt(area)} m² und ${fmt(area * price)} €.`,
          { g, h, price },
        );
      },
    },
    {
      id: "hoehen",
      make: (rng, level) => {
        if (level === 1) {
          const g = rng.pick([4, 5, 6, 8, 10]);
          const h = rng.int(3, 12);
          const area = (g * h) / 2;
          return task(
            level,
            `Ein Dreieck hat den Flächeninhalt ${fmt(area)} cm² und die Grundseite ${g} cm. Wie groß ist die zugehörige Höhe?`,
            "",
            [num("h =", h, "cm", 2)],
            "Aus A = g · h : 2 folgt h = 2 · A : g.",
            `2 · ${fmt(area)} : ${g} = ${h}.`,
            `${h} cm.`,
            { g, h },
          );
        }
        const a = rng.pick([6, 8, 10, 12]);
        const ha = rng.pick([4, 5, 6, 8]);
        const b = rng.pick([8, 10, 15, 16]);
        const area = (a * ha) / 2;
        return task(
          level,
          "",
          `In einem Dreieck gehört zur Seite a = ${a} cm die Höhe ${ha} cm. Eine andere Seite ist b = ${b} cm lang. Berechne den Flächeninhalt und die zu b gehörige Höhe. Runde auf zwei Stellen.`,
          [num("A =", area, "cm²", 1), num("Höhe auf b =", roundSchool((2 * area) / b, 2), "cm", 2)],
          "Der Flächeninhalt bleibt gleich, egal welche Seite du als Grundseite nimmst.",
          `A = ${a} · ${ha} : 2 = ${fmt(area)}; 2 · ${fmt(area)} : ${b}.`,
          `${fmt(area)} cm² und ≈ ${fmt(roundSchool((2 * area) / b, 2))} cm.`,
          { a, ha, b },
        );
      },
    },
  ],
});

const trapez = L(3, {
  id: "fl-3-trapez",
  title: "3.3 Der Flächeninhalt des Trapezes",
  subtitle: "Zwei parallele Seiten, eine Höhe",
  whyItMatters:
    "Dachflächen, Deichquerschnitte und Grundstücke sind oft Trapeze. Ihre Formel entsteht wieder aus einem Parallelogramm.",
  explanationHtml: `<p>Ein <strong>Trapez</strong> hat zwei parallele Seiten a und c. Die Höhe h ist der Abstand dieser beiden Seiten. Legst du das Trapez und eine gedrehte Kopie zusammen, entsteht ein Parallelogramm mit der Grundseite a + c und der Höhe h. Das Trapez ist die Hälfte davon.</p><div class="example">a = 7 cm, c = 3 cm, h = 4 cm: A = (7 cm + 3 cm) · 4 cm : 2 = 20 cm².</div><p>Die schrägen Seiten kommen in der Formel nicht vor. Du kannst das Trapez auch zerlegen: in ein Rechteck und zwei Dreiecke oder durch eine Diagonale in zwei Dreiecke.</p><div class="merke"><strong>Merke:</strong> Trapez: A = (a + c) · h : 2. Rechne zuerst die Klammer.</div>`,
  formulas: [
    {
      name: "Trapez",
      html: `A = ${frac("(a + c) · h", 2)}`,
      quantities: "a, c parallele Seiten, h ihr Abstand",
    },
  ],
  quiz: {
    question: "Welche Längen brauchst du für den Flächeninhalt eines Trapezes?",
    options: [
      "die beiden parallelen Seiten und ihren Abstand",
      "alle vier Seiten",
      "nur die beiden schrägen Seiten",
    ],
    correctIndex: 0,
    explanation: "A = (a + c) · h : 2. Die schrägen Seiten bestimmen den Flächeninhalt nicht.",
  },
  lab: lab(
    "area-trapezoid",
    "Trapez verändern",
    "Stelle die parallelen Seiten ein und ziehe die obere Ecke. Der Versatz ändert die Form, aber nicht die Fläche.",
    [
      r("a", "Seite a", 2, 11, 6, 1, "cm"),
      r("c", "Seite c", 1, 8, 2, 1, "cm"),
      r("h", "Höhe h", 1, 6, 3, 1, "cm"),
      r("s", "Versatz", 0, 4, 1),
    ],
    [o("area", "Flächeninhalt", (v) => ((v.a + v.c) * v.h) / 2, "cm²", 1)],
    [
      {
        id: "zwanzig",
        text: "Stelle a = 7 cm, c = 3 cm und h = 4 cm ein.",
        check: (v) => v.a === 7 && v.c === 3 && v.h === 4,
      },
      {
        id: "gleich",
        text: "Mache a und c gleich lang: Das Trapez wird zum Parallelogramm.",
        check: (v) => v.a === v.c,
      },
      {
        id: "dreissig",
        text: "Finde ein Trapez mit dem Flächeninhalt 30 cm² und h = 5 cm.",
        check: (v) => v.h === 5 && v.a + v.c === 12,
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const a = rng.int(5, 18);
        const c0 = rng.int(2, a - 1);
        const h = rng.int(2, 11);
        const area = ((a + c0) * h) / 2;
        if (level === 1)
          return task(
            level,
            `Ein Trapez hat die parallelen Seiten a = ${a} cm und c = ${c0} cm sowie die Höhe ${h} cm. Berechne den Flächeninhalt.`,
            "",
            [
              num("A =", area, "cm²", 1, {
                slips: [{ value: (a + c0) * h, hint: "Teile am Ende noch durch 2." }],
              }),
            ],
            "A = (a + c) · h : 2",
            `(${a} + ${c0}) · ${h} : 2 = ${a + c0} · ${h} : 2.`,
            `${fmt(area)} cm².`,
            { a, c0, h },
          );
        const roofPrice = rng.pick([30, 45, 50]);
        return task(
          level,
          "",
          `Eine trapezförmige Dachfläche ist unten ${a} m und oben ${c0} m breit; die Höhe beträgt ${h} m. Ein m² Ziegel kostet ${roofPrice} €. Berechne Fläche und Kosten.`,
          [num("A =", area, "m²", 1), num("Kosten =", area * roofPrice, "€", 0)],
          "Parallele Seiten addieren, mal Höhe, durch 2.",
          `A = ${fmt(area)} m²; ${fmt(area)} · ${roofPrice}.`,
          `${fmt(area)} m² und ${fmt(area * roofPrice)} €.`,
          { a, c0, h, roofPrice },
        );
      },
    },
    {
      id: "rueckwaerts",
      make: (rng, level) => {
        const a = rng.int(6, 16);
        const c0 = rng.int(2, a - 2);
        const h = 2 * rng.int(1, 6);
        const area = ((a + c0) * h) / 2;
        if (level === 1)
          return task(
            level,
            `Ein Trapez hat die Fläche ${area} cm², die parallelen Seiten ${a} cm und ${c0} cm. Wie groß ist die Höhe?`,
            "",
            [num("h =", h, "cm", 2)],
            "h = 2 · A : (a + c)",
            `2 · ${area} : ${a + c0} = ${h}.`,
            `${h} cm.`,
            { a, c0, h },
          );
        return task(
          level,
          "",
          `Ein Trapez mit der Fläche ${area} cm² und der Höhe ${h} cm hat die lange parallele Seite a = ${a} cm. Wie lang ist die andere parallele Seite?`,
          [num("c =", c0, "cm", 2)],
          "Stelle die Formel um: a + c = 2 · A : h. Ziehe dann a ab.",
          `2 · ${area} : ${h} = ${a + c0}; ${a + c0} − ${a} = ${c0}.`,
          `c = ${c0} cm.`,
          { a, c0, h },
        );
      },
    },
  ],
});

const drachen = L(4, {
  id: "fl-4-drachen-raute",
  title: "3.4 Drachenviereck und Raute",
  subtitle: "Mit den Diagonalen rechnen",
  whyItMatters:
    "Bei Drachen und Rauten stehen die Diagonalen senkrecht aufeinander. Deshalb reichen diese beiden Längen für den Flächeninhalt.",
  explanationHtml: `<p>Zeichne um ein <strong>Drachenviereck</strong> oder eine <strong>Raute</strong> das Rechteck, dessen Seiten parallel zu den Diagonalen e und f sind. Die Diagonalen zerlegen das Rechteck in vier kleinere Rechtecke, und jedes wird durch eine Viereckseite halbiert. Die Figur hat also genau die halbe Rechtecksfläche.</p><div class="example">e = 8 cm, f = 5 cm: A = 8 cm · 5 cm : 2 = 20 cm². Das umgebende Rechteck hat 40 cm².</div><p>Die Raute ist auch ein Parallelogramm. Du kannst sie deshalb ebenso mit A = g · h berechnen.</p><div class="merke"><strong>Merke:</strong> Drachenviereck und Raute: A = e · f : 2, wobei e und f die Längen der Diagonalen sind.</div>`,
  formulas: [
    {
      name: "Drachenviereck und Raute",
      html: `A = ${frac("e · f", 2)}`,
      quantities: "e, f die Längen der beiden Diagonalen",
    },
  ],
  quiz: {
    question: "Eine Raute hat die Diagonalen 6 cm und 10 cm. Wie groß ist ihr Flächeninhalt?",
    options: ["30 cm²", "60 cm²", "16 cm²"],
    correctIndex: 0,
    explanation: "A = 6 cm · 10 cm : 2 = 30 cm². 60 cm² ist das umgebende Rechteck.",
  },
  lab: lab(
    "area-kite",
    "Drachen im Rechteck",
    "Ziehe die rechte Ecke und verändere die Diagonale e. Die Figur füllt immer genau die Hälfte des Rechtecks.",
    [
      r("e", "Diagonale e", 2, 8, 4, 1, "cm"),
      r("f", "Diagonale f", 2, 10, 4, 1, "cm"),
      r("s", "Lage der Querdiagonalen", -2, 2, 1),
    ],
    [
      o("area", "Flächeninhalt", (v) => (v.e * v.f) / 2, "cm²", 1),
      o("box", "Umgebendes Rechteck", (v) => v.e * v.f, "cm²", 0),
      o("name", "Figur", (v) =>
        Math.abs(v.s) >= v.e / 2 ? "kein Drachenviereck: Der Versatz ist zu groß" : v.s !== 0 ? "Drachenviereck" : v.e === v.f ? "Quadrat" : "Raute",
      ),
    ],
    [
      {
        id: "zwanzig",
        text: "Stelle einen Drachen mit e = 8 cm und f = 5 cm ein, die Querdiagonale nicht in der Mitte.",
        check: (v) => v.e === 8 && v.f === 5 && v.s !== 0 && Math.abs(v.s) < v.e / 2,
      },
      {
        id: "raute",
        text: "Erzeuge eine Raute mit dem Flächeninhalt 24 cm².",
        check: (v) => v.s === 0 && v.e * v.f === 48 && v.e !== v.f,
      },
      {
        id: "quadrat",
        text: "Erzeuge ein Quadrat mit gleich langen Diagonalen von 6 cm.",
        check: (v) => v.s === 0 && v.e === 6 && v.f === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "flaeche",
      make: (rng, level) => {
        const e = rng.int(3, 16);
        const f = rng.int(3, 14);
        const area = (e * f) / 2;
        if (level === 1)
          return task(
            level,
            `Ein Drachenviereck hat die Diagonalen e = ${e} cm und f = ${f} cm. Berechne den Flächeninhalt.`,
            "",
            [
              num("A =", area, "cm²", 1, {
                slips: [{ value: e * f, hint: "Das ist das umgebende Rechteck. Der Drachen füllt die Hälfte." }],
              }),
            ],
            "A = e · f : 2",
            `${e} · ${f} : 2.`,
            `${fmt(area)} cm².`,
            { e, f },
          );
        const paper = rng.pick([1.5, 2, 2.5]);
        return task(
          level,
          "",
          `Für einen Flugdrachen werden zwei Leisten von ${e * 10} cm und ${f * 10} cm senkrecht gekreuzt. Berechne die Fläche des Drachens in cm² und in dm². Papier kostet ${fmt(paper)} € pro dm². Was kostet das Papier mindestens?`,
          [
            num("A =", area * 100, "cm²", 0),
            num("A =", area, "dm²", 1),
            num("Kosten =", area * paper, "€", 2),
          ],
          "A = e · f : 2; 100 cm² sind 1 dm².",
          `${e * 10} · ${f * 10} : 2 = ${area * 100}.`,
          `${fmt(area * 100)} cm² = ${fmt(area)} dm², ${fmt(area * paper)} €.`,
          { e, f, paper },
        );
      },
    },
    {
      id: "diagonale",
      make: (rng, level) => {
        const e = rng.pick([4, 5, 6, 8, 10, 12]);
        const f = rng.int(3, 14);
        const area = (e * f) / 2;
        if (level === 1)
          return task(
            level,
            `Eine Raute hat den Flächeninhalt ${fmt(area)} cm² und die Diagonale e = ${e} cm. Wie lang ist die andere Diagonale?`,
            "",
            [num("f =", f, "cm", 2)],
            "f = 2 · A : e",
            `2 · ${fmt(area)} : ${e} = ${f}.`,
            `${f} cm.`,
            { e, f },
          );
        // Half diagonals 3k and 4k give the whole side 5k, so the rhombus really exists.
        const k = rng.int(1, 4);
        const side = 5 * k;
        const height = 4.8 * k;
        const given = 6 * k;
        const other = 8 * k;
        const rhombus = clean(side * height);
        return task(
          level,
          "",
          `Eine Raute hat die Seitenlänge ${side} cm und die Höhe ${fmt(height, 1)} cm auf diese Seite. Ihre eine Diagonale ist ${given} cm lang. Berechne den Flächeninhalt und die andere Diagonale.`,
          [num("A =", rhombus, "cm²", 0), num("f =", other, "cm", 2)],
          "Als Parallelogramm: A = g · h. Dann f = 2 · A : e.",
          `A = ${side} · ${fmt(height, 1)} = ${fmt(rhombus)}; 2 · ${fmt(rhombus)} : ${given} = ${other}.`,
          `${fmt(rhombus)} cm² und ${other} cm.`,
          { k },
        );
      },
    },
  ],
});

const L_AREA = (v: Record<string, number>) => v.a * v.d + v.c * (v.b - v.d);

const vielecke = L(5, {
  id: "fl-5-vielecke",
  title: "3.5 Vielecke zerlegen",
  subtitle: "Teilflächen addieren oder abziehen",
  whyItMatters:
    "Grundstücke und Zimmer sind selten einfache Rechtecke. Du zerlegst sie in Figuren, deren Flächenformeln du kennst.",
  explanationHtml: `<p>Einen <strong>Vieleck</strong>-Flächeninhalt findest du, indem du die Figur in bekannte Teilfiguren zerlegst und deren Flächen addierst. Manchmal ist es einfacher, ein großes Rechteck zu nehmen und die fehlenden Stücke abzuziehen.</p><div class="example">Ein L-förmiger Raum ist 8 m breit und 6 m tief, eine Ecke von 3 m · 2 m fehlt. Addieren: 8 m · 4 m + 5 m · 2 m = 42 m². Abziehen: 8 m · 6 m − 3 m · 2 m = 42 m². Beide Wege ergeben dasselbe.</div><p>Zeichne dir vorher eine Skizze und schreibe die fehlenden Längen dazu. Wähle die Zerlegung mit den wenigsten Rechenschritten.</p><div class="merke"><strong>Merke:</strong> Zerlegen und addieren oder ergänzen und abziehen. Rechne alle Längen vorher in dieselbe Einheit um.</div>`,
  formulas: [
    {
      name: "Zerlegen",
      html: "A = A₁ + A₂ + … ",
      quantities: "die Teilflächen dürfen sich nicht überlappen",
    },
    {
      name: "Ergänzen",
      html: "A = A<sub>groß</sub> − A<sub>fehlt</sub>",
      quantities: "großes Rechteck minus fehlende Stücke",
    },
  ],
  quiz: {
    question: "Ein Rechteck von 10 m · 6 m hat eine rechteckige Aussparung von 2 m · 3 m. Wie groß ist die Restfläche?",
    options: ["54 m²", "66 m²", "60 m²"],
    correctIndex: 0,
    explanation: "10 m · 6 m − 2 m · 3 m = 60 m² − 6 m² = 54 m². Die Aussparung wird abgezogen, nicht addiert.",
  },
  lab: lab(
    "area-polygon",
    "L-Form zerlegen",
    "Verändere die L-Form und wähle den Rechenweg. Beide Wege müssen dasselbe Ergebnis liefern.",
    [
      c("mode", "Rechenweg", ["zerlegen und addieren", "ergänzen und abziehen"]),
      r("a", "Breite a", 4, 12, 6, 1, "m"),
      r("b", "Höhe b", 3, 7, 4, 1, "m"),
      r("c", "Breite oben c", 1, 4, 2, 1, "m"),
      r("d", "Höhe unten d", 1, 3, 1, 1, "m"),
    ],
    [
      o("area", "Flächeninhalt", (v) => L_AREA(v), "m²", 0),
      o("calc", "Rechnung", (v) =>
        v.mode === 0
          ? `${v.a} · ${v.d} + ${v.c} · ${v.b - v.d} = ${L_AREA(v)} m²`
          : `${v.a} · ${v.b} − ${v.a - v.c} · ${v.b - v.d} = ${L_AREA(v)} m²`,
      ),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle den Raum mit a = 8 m, b = 6 m, c = 4 m und d = 3 m ein.",
        check: (v) => v.a === 8 && v.b === 6 && v.c === 4 && v.d === 3,
      },
      {
        id: "abziehen",
        text: "Berechne dieselbe Fläche mit dem Rechenweg „ergänzen und abziehen“: a = 10 m, b = 5 m, c = 3 m, d = 2 m.",
        check: (v) => v.mode === 1 && v.a === 10 && v.b === 5 && v.c === 3 && v.d === 2,
      },
      {
        id: "dreissig",
        text: "Finde eine L-Form mit genau 30 m².",
        check: (v) => L_AREA(v) === 30,
      },
    ],
  ),
  exercises: [
    {
      id: "l-form",
      make: (rng, level) => {
        const a = rng.int(6, 14);
        const b = rng.int(5, 10);
        const notchW = rng.int(1, a - 3);
        const notchH = rng.int(1, b - 3);
        const area = a * b - notchW * notchH;
        if (level === 1)
          return task(
            level,
            `Aus einem Rechteck mit den Seiten ${a} m und ${b} m wird in einer Ecke ein Rechteck von ${notchW} m · ${notchH} m herausgeschnitten. Berechne die Restfläche.`,
            "",
            [
              num("A =", area, "m²", 0, {
                slips: [{ value: a * b + notchW * notchH, hint: "Die Aussparung wird abgezogen, nicht addiert." }],
              }),
            ],
            "Große Fläche minus Aussparung.",
            `${a} · ${b} − ${notchW} · ${notchH}.`,
            `${area} m².`,
            { a, b, notchW, notchH },
          );
        const tile = rng.pick([18, 25, 32]);
        return task(
          level,
          "",
          `Ein Zimmer ist ${a} m breit und ${b} m lang, in einer Ecke fehlt wegen eines Schachts ein Stück von ${notchW} m · ${notchH} m. Der Boden kostet ${tile} € pro m². Dazu kommen 10 % Verschnitt auf die Fläche. Wie viele m² musst du kaufen, und was kostet das?`,
          [num("Zu kaufen =", clean(area * 1.1), "m²", 1), num("Kosten =", clean(area * 1.1 * tile), "€", 2)],
          "Fläche berechnen, 10 % davon dazurechnen, mit dem Preis malnehmen.",
          `A = ${area}; ${area} + ${fmt(area * 0.1)} = ${fmt(area * 1.1)}.`,
          `${fmt(area * 1.1)} m² für ${fmt(area * 1.1 * tile)} €.`,
          { a, b, notchW, notchH, tile },
        );
      },
    },
    {
      id: "haus",
      make: (rng, level) => {
        const w = 2 * rng.int(2, 6);
        const wall = rng.int(3, 7);
        const roof = rng.int(2, 5);
        const area = w * wall + (w * roof) / 2;
        if (level === 1)
          return task(
            level,
            `Eine Hausfront besteht aus einem Rechteck (${w} m breit, ${wall} m hoch) und einem gleichschenkligen Giebeldreieck darauf (Höhe ${roof} m). Berechne die ganze Fläche.`,
            "",
            [num("A =", area, "m²", 1)],
            "Rechteck plus Dreieck: g · h : 2.",
            `${w} · ${wall} + ${w} · ${roof} : 2.`,
            `${fmt(area)} m².`,
            { w, wall, roof },
          );
        const door = rng.pick([2, 3, 4]);
        const paint = rng.pick([6, 8, 10]);
        const net = area - door;
        return task(
          level,
          "",
          `Eine Hausfront besteht aus einem Rechteck (${w} m breit, ${wall} m hoch) und einem Giebeldreieck (Höhe ${roof} m). Tür und Fenster nehmen zusammen ${door} m² ein. Ein Liter Farbe reicht für ${paint} m². Wie groß ist die Fläche zum Streichen, und wie viele ganze Liter brauchst du?`,
          [num("Fläche =", net, "m²", 1), num("Liter =", Math.ceil(net / paint - 1e-9), "l", 0)],
          "Rechteck plus Dreieck minus Öffnungen. Farbe musst du aufrunden.",
          `${w} · ${wall} + ${w} · ${roof} : 2 − ${door} = ${fmt(net)}; ${fmt(net)} : ${paint} = ${fmt(net / paint)}.`,
          `${fmt(net)} m² und ${Math.ceil(net / paint - 1e-9)} l.`,
          { w, wall, roof, door, paint },
        );
      },
    },
  ],
});

const surface = (v: Record<string, number>) =>
  2 * (v.a * v.b + v.a * v.c + v.b * v.c);

const oberflaeche = L(6, {
  id: "fl-6-oberflaeche",
  title: "3.6 Die Oberfläche von Quader und Würfel",
  subtitle: "Das Netz zeigt alle Flächen",
  whyItMatters:
    "Wie viel Geschenkpapier brauchst du für eine Schachtel? Das Netz, das du aus Klasse 5 kennst, zeigt alle sechs Flächen auf einmal.",
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
    question: "Wie viele Flächen musst du bei einem Karton ohne Deckel berechnen?",
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
      o("kind", "Körper", (v) => (v.a === v.b && v.b === v.c ? "Würfel" : "Quader")),
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
                slips: [{ value: O / 2, hint: "Jede Fläche kommt zweimal vor. Nimm die Summe mal 2." }],
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
              slips: [{ value: O, hint: "Der Deckel fehlt. Ziehe ihn von der Oberfläche ab." }],
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
                slips: [{ value: a * a, hint: "Das ist nur eine Fläche. Der Würfel hat sechs." }],
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

export const STAGE_FLAECHENINHALT = makeStage(
  3,
  "Flächeninhalt ebener Figuren",
  "Flächen zerlegen, berechnen und in Sachaufgaben nutzen",
  "#0f766e",
  "📐",
  [parallelogramm, dreieck, trapez, drachen, vielecke, oberflaeche],
);
