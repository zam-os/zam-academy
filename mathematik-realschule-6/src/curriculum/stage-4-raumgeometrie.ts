import { fmt } from "../exercises/format";
import { clean } from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
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
  makeLesson(4, step, content);

const UNIT_NAMES = ["Zuckerwürfel", "cm³", "Spielwürfel"];

const rauminhalt = L(1, {
  id: "rg-1-rauminhalt",
  title: "4.1 Rauminhalte vergleichen und messen",
  subtitle: "Von ungenormten zu genormten Einheiten",
  whyItMatters:
    "Passt mehr in den roten oder in den blauen Karton? Um das eindeutig zu sagen, brauchst du ein Maß, das überall gleich ist.",
  explanationHtml: `<p>Den <strong>Rauminhalt</strong> oder das <strong>Volumen</strong> eines Körpers misst du, indem du zählst, wie viele gleiche Würfel hineinpassen. Mit <strong>ungenormten Einheiten</strong> wie Zuckerwürfeln kannst du zwei Körper vergleichen, wenn du dieselben Würfel nutzt. Andere Personen wissen aber nicht, wie groß sie sind.</p><p><strong>Genormte Einheiten</strong> sind deshalb Würfel mit festen Kanten: 1 cm³ ist ein Würfel mit der Kante 1 cm, 1 dm³ hat die Kante 1 dm, 1 m³ die Kante 1 m.</p><div class="example">In eine Schachtel passen in die untere Schicht 4 · 3 = 12 Würfel. Bei 5 Schichten sind es 5 · 12 = 60 Würfel. Haben die Würfel 1 cm Kantenlänge, ist das Volumen 60 cm³.</div><div class="merke"><strong>Merke:</strong> Wähle die Einheit passend zur Größe: Radiergummi in cm³, Milchkarton in dm³, Zimmer in m³.</div>`,
  formulas: [
    {
      name: "Schichtweise zählen",
      html: "Anzahl = Würfel je Schicht · Schichten",
      quantities: "Würfel je Schicht = Länge · Breite",
    },
    {
      name: "Einheitswürfel",
      html: "1 cm³; 1 dm³; 1 m³",
      quantities: "Würfel mit der Kante 1 cm, 1 dm oder 1 m",
    },
  ],
  quiz: {
    question: "Welche Einheit passt am besten für den Rauminhalt eines Klassenzimmers?",
    options: ["m³", "cm³", "m²"],
    correctIndex: 0,
    explanation: "Ein Zimmer misst man in Kubikmetern. m² ist eine Flächeneinheit, cm³ wäre unpraktisch klein.",
  },
  lab: lab(
    "unit-cubes",
    "Schichten stapeln",
    "Stelle die Kanten ein und fülle den Quader Schicht für Schicht. Wähle auch die Würfelart.",
    [
      r("a", "Würfel in der Länge", 1, 6, 2),
      r("b", "Würfel in der Breite", 1, 4, 2),
      r("c", "Schichten im Körper", 1, 6, 2),
      r("l", "Gefüllte Schichten", 0, 6, 0),
      c("unit", "Würfelart", UNIT_NAMES),
    ],
    [
      o("layer", "Würfel je Schicht", (v) => v.a * v.b, "", 0),
      o("filled", "Gefüllt", (v) => v.a * v.b * Math.min(v.l, v.c), "", 0),
      o("total", "Passen insgesamt", (v) => v.a * v.b * v.c, "", 0),
      o("unitName", "Einheit", (v) => UNIT_NAMES[v.unit]),
      o("norm", "Für andere verständlich?", (v) =>
        v.unit === 1 ? "ja, genormte Einheit" : "nein, ungenormte Einheit",
      ),
    ],
    [
      {
        id: "sechzig",
        text: "Fülle einen Körper aus 4 · 3 · 5 Würfeln in der Einheit cm³ ganz: 60 cm³.",
        check: (v) => v.a === 4 && v.b === 3 && v.c === 5 && v.l >= 5 && v.unit === 1,
      },
      {
        id: "wuerfel",
        text: "Baue aus 27 Einheitswürfeln einen vollen Würfel.",
        check: (v) => v.a === 3 && v.b === 3 && v.c === 3 && v.l >= 3,
      },
      {
        id: "andere-form",
        text: "Fülle einen Körper mit 24 Würfeln, der nur 1 Würfel breit ist.",
        check: (v) => v.b === 1 && v.a * v.c === 24 && v.l >= v.c,
      },
    ],
  ),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 8);
        const h = rng.int(2, 7);
        if (level === 1)
          return task(
            level,
            `In eine Schachtel passen in der unteren Schicht ${a} · ${b} Würfel. Es gibt ${h} Schichten. Wie viele Würfel passen insgesamt hinein?`,
            "",
            [num("Anzahl =", a * b * h, "", 0)],
            "Würfel je Schicht mal Anzahl der Schichten.",
            `${a} · ${b} = ${a * b}; ${a * b} · ${h}.`,
            `${a * b * h} Würfel.`,
            { a, b, h },
          );
        const edge = rng.pick([2, 3, 5]);
        return task(
          level,
          "",
          `Ein Karton ist innen ${a * edge} cm lang, ${b * edge} cm breit und ${h * edge} cm hoch. Wie viele Würfel mit der Kante ${edge} cm passen genau hinein? Wie groß ist das Volumen eines solchen Würfels?`,
          [
            num("Anzahl =", a * b * h, "", 0),
            num("Volumen eines Würfels =", edge ** 3, "cm³", 0),
          ],
          "Wie viele Würfel passen in jede Richtung? Das Volumen eines Würfels ist Kante mal Kante mal Kante.",
          `${a} · ${b} · ${h}; ${edge} · ${edge} · ${edge}.`,
          `${a * b * h} Würfel, je ${edge ** 3} cm³.`,
          { a, b, h, edge },
        );
      },
    },
    {
      id: "einheit-waehlen",
      make: (rng, level) => {
        const items: Array<[string, number]> = [
          ["eines Radiergummis", 0],
          ["einer Streichholzschachtel", 0],
          ["eines Wassereimers", 1],
          ["eines Milchkartons", 1],
          ["eines Klassenzimmers", 2],
          ["eines Schwimmbeckens", 2],
        ];
        const options = ["cm³", "dm³", "m³"];
        const [item, index] = rng.pick(items);
        if (level === 1)
          return task(
            level,
            `Welche Einheit passt am besten für den Rauminhalt ${item}?`,
            "",
            [pick("Einheit", options, index)],
            "Stelle dir den Einheitswürfel vor: Passt er gut in den Körper?",
            "1 cm³ ist etwa so groß wie ein kleiner Spielwürfel, 1 dm³ wie ein Milchkarton, 1 m³ wie ein großer Schrank.",
            `${options[index]}.`,
            { index },
          );
        const countA = rng.int(10, 30);
        const countB = countA + rng.int(1, 12);
        return task(
          level,
          "",
          `Ina füllt Körper A mit ${countA} Zuckerwürfeln, Ole füllt Körper B mit ${countB} Holzwürfeln. Beide Würfelsorten sind verschieden groß. Lässt sich daraus sicher sagen, welcher Körper mehr fasst? Wie viele Zuckerwürfel fasst B, wenn ein Holzwürfel so groß ist wie 2 Zuckerwürfel?`,
          [
            pick("Sicherer Vergleich ohne Umrechnung?", ["nein, die Einheiten sind verschieden", "ja, B fasst mehr"], 0),
            num("B in Zuckerwürfeln =", 2 * countB, "", 0),
          ],
          "Vergleichen kannst du nur mit derselben Einheit.",
          `${countB} · 2 = ${2 * countB}.`,
          `Nein; B fasst ${2 * countB} Zuckerwürfel.`,
          { countA, countB },
        );
      },
    },
  ],
});

const FACTORS = [1000, 1, 0.001, 0.000001];
const FROM_NAMES = ["m³", "dm³", "cm³", "mm³"];

const raumeinheiten = L(2, {
  id: "rg-2-raumeinheiten",
  title: "4.2 Raumeinheiten umrechnen",
  subtitle: "mm³, cm³, dm³, m³ und die Hohlmaße",
  whyItMatters:
    "Auf der Flasche steht 0,75 l, im Mathebuch cm³ und beim Schwimmbad m³. Du musst diese Angaben ineinander umrechnen können.",
  explanationHtml: `<p>Ein Würfel mit der Kante 1 dm = 10 cm enthält 10 · 10 · 10 = 1000 kleine Würfel mit der Kante 1 cm. Darum ist die <strong>Umrechnungszahl bei Raumeinheiten 1000</strong>: 1 m³ = 1000 dm³, 1 dm³ = 1000 cm³, 1 cm³ = 1000 mm³.</p><p>Die Hohlmaße aus Klasse 5 passen genau dazu: <strong>1 l = 1 dm³</strong> und <strong>1 ml = 1 cm³</strong>. Außerdem gilt 1 hl = 100 l.</p><div class="example">2,5 dm³ = 2500 cm³. 750 ml = 750 cm³ = 0,75 l. 2 m³ = 2000 dm³ = 2000 l.</div><div class="merke"><strong>Merke:</strong> Zur kleineren Einheit: mal 1000. Zur größeren Einheit: durch 1000. Bei Längen ist der Schritt 10 und bei Flächen 100.</div>`,
  formulas: [
    {
      name: "Raumeinheiten",
      html: "1 m³ = 1000 dm³; 1 dm³ = 1000 cm³; 1 cm³ = 1000 mm³",
      quantities: "die Umrechnungszahl ist 1000",
    },
    {
      name: "Hohlmaße",
      html: "1 l = 1 dm³; 1 ml = 1 cm³; 1 hl = 100 l",
      quantities: "l Liter, ml Milliliter, hl Hektoliter",
    },
  ],
  quiz: {
    question: "Wie viele cm³ sind 1 Liter?",
    options: ["1000 cm³", "100 cm³", "10 cm³"],
    correctIndex: 0,
    explanation: "1 l = 1 dm³ = 1000 cm³. Die Umrechnungszahl bei Raumeinheiten ist 1000.",
  },
  lab: lab(
    "volume-units",
    "Einheitenleiter",
    "Wähle Wert und Einheiten. Die Leiter zeigt, wie viele Stufen du gehst.",
    [
      r("amount", "Wert", 0.5, 9, 1, 0.5),
      c("from", "Von", ["m³", "dm³ = l", "cm³ = ml", "mm³"]),
      c("to", "Nach", ["m³", "dm³ = l", "cm³ = ml", "mm³"], 3),
    ],
    [
      o("fromName", "Ausgangseinheit", (v) => FROM_NAMES[v.from]),
      o("toName", "Zieleinheit", (v) => FROM_NAMES[v.to]),
      o("result", "Ergebnis", (v) => fmt((v.amount * FACTORS[v.from]) / FACTORS[v.to], 10)),
      o("steps", "Stufen", (v) => Math.abs(v.from - v.to), "", 0),
    ],
    [
      {
        id: "dm-cm",
        text: "Rechne 2 dm³ in cm³ um.",
        check: (v) => v.amount === 2 && v.from === 1 && v.to === 2,
      },
      {
        id: "ml-l",
        text: "Rechne 3,5 l in ml um.",
        check: (v) => v.amount === 3.5 && v.from === 1 && v.to === 2,
      },
      {
        id: "m3-l",
        text: "Zeige: 1 m³ sind 1000 Liter.",
        check: (v) => v.amount === 1 && v.from === 0 && v.to === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "umrechnen",
      make: (rng, level) => {
        const value = rng.int(2, 95) / 10;
        const from = rng.int(0, 2);
        const names = FROM_NAMES;
        if (level === 1)
          return task(
            level,
            `Rechne ${fmt(value)} ${names[from]} in ${names[from + 1]} um.`,
            "",
            [
              num("Ergebnis =", clean(value * 1000), names[from + 1], 0, {
                slips: [
                  { value: clean(value * 100), hint: "Die Umrechnungszahl bei Raumeinheiten ist 1000, nicht 100." },
                  { value: clean(value * 10), hint: "Die Umrechnungszahl bei Raumeinheiten ist 1000, nicht 10." },
                ],
              }),
            ],
            "Zur kleineren Einheit: mal 1000.",
            `${fmt(value)} · 1000.`,
            `${fmt(value * 1000)} ${names[from + 1]}.`,
            { value, from },
          );
        const big = rng.int(1, 9);
        const small = rng.int(1, 999);
        const total = big * 1000 + small;
        return task(
          level,
          "",
          `Schreibe ${big} ${names[from]} ${small} ${names[from + 1]} in ${names[from + 1]} und als Dezimalzahl in ${names[from]}.`,
          [
            num(`In ${names[from + 1]} =`, total, "", 0),
            num(`In ${names[from]} =`, total / 1000, "", 3),
          ],
          "Rechne die größere Einheit um und addiere. Dann teile durch 1000.",
          `${big} · 1000 + ${small} = ${total}.`,
          `${fmt(total, 0)} ${names[from + 1]} = ${fmt(total / 1000, 3)} ${names[from]}.`,
          { big, small, from },
        );
      },
    },
    {
      id: "hohlmass",
      make: (rng, level) => {
        const ml = rng.pick([125, 200, 250, 330, 500, 750, 1500, 2500]);
        if (level === 1)
          return task(
            level,
            `Eine Flasche fasst ${fmt(ml, 0)} ml. Wie viele Liter und wie viele cm³ sind das?`,
            "",
            [num("In Litern =", ml / 1000, "l", 3), num("In cm³ =", ml, "cm³", 0)],
            "1 l = 1000 ml und 1 ml = 1 cm³.",
            `${fmt(ml, 0)} : 1000 = ${fmt(ml / 1000, 3)}.`,
            `${fmt(ml / 1000, 3)} l = ${fmt(ml, 0)} cm³.`,
            { ml },
          );
        const hl = rng.pick([1.5, 2, 3, 4.5, 6]);
        const bottle = rng.pick([0.25, 0.5, 0.75]);
        const count = (hl * 100) / bottle;
        return task(
          level,
          "",
          `Ein Tank enthält ${fmt(hl)} hl Apfelsaft. Wie viele Liter sind das, und wie viele Flaschen mit je ${fmt(bottle)} l lassen sich damit füllen?`,
          [num("Liter =", hl * 100, "l", 0), num("Flaschen =", count, "", 0)],
          "1 hl = 100 l. Teile dann durch die Flaschengröße.",
          `${fmt(hl)} · 100 = ${hl * 100}; ${hl * 100} : ${fmt(bottle)} = ${count}.`,
          `${hl * 100} l und ${count} Flaschen.`,
          { hl, bottle },
        );
      },
    },
  ],
});

const quader = L(3, {
  id: "rg-3-quader-volumen",
  title: "4.3 Das Volumen von Quader und Würfel",
  subtitle: "Länge mal Breite mal Höhe",
  whyItMatters:
    "Das Volumen sagt dir, wie viel Wasser ins Aquarium passt oder wie viel Sand der Sandkasten braucht. Die Formel kommt direkt aus dem Stapeln von Würfeln.",
  explanationHtml: `<p>In der Grundschicht liegen a · b Einheitswürfel, und es gibt c Schichten. Deshalb gilt für den <strong>Quader</strong>: V = a · b · c. Das ist auch <strong>Grundfläche mal Höhe</strong>. Beim <strong>Würfel</strong> sind alle Kanten gleich: V = a³. Alle Längen müssen vorher in derselben Einheit stehen.</p><div class="example">Ein Aquarium ist 6 dm lang, 3 dm breit und 4 dm hoch: V = 6 dm · 3 dm · 4 dm = 72 dm³ = 72 l. Mit 80 cm Länge rechnest du zuerst 80 cm = 8 dm um.</div><div class="merke"><strong>Merke:</strong> Quader: V = a · b · c. Würfel: V = a · a · a. Ein Rauminhalt hat eine Einheit „hoch 3“. Der Umfang hat eine Länge, die Fläche eine Einheit „hoch 2“.</div>`,
  formulas: [
    {
      name: "Quader",
      html: "V = a · b · c = G · h",
      quantities: "a, b, c Kanten; G Grundfläche, h Höhe",
    },
    {
      name: "Würfel",
      html: "V = a³",
      quantities: "a Kantenlänge",
    },
  ],
  quiz: {
    question: "Ein Quader hat die Grundfläche 12 cm² und die Höhe 5 cm. Wie groß ist sein Volumen?",
    options: ["60 cm³", "17 cm³", "60 cm²"],
    correctIndex: 0,
    explanation: "V = G · h = 12 cm² · 5 cm = 60 cm³. Ein Volumen wird in einer Kubikeinheit angegeben.",
  },
  lab: lab(
    "volume-box",
    "Aquarium füllen",
    "Stelle die Kanten in dm ein und ziehe den Wasserstand. 1 dm³ sind genau 1 Liter.",
    [
      r("a", "Länge a", 1, 10, 4, 1, "dm"),
      r("b", "Breite b", 1, 10, 2, 1, "dm"),
      r("c", "Höhe c", 1, 10, 2, 1, "dm"),
      r("w", "Wasserstand", 0, 100, 25, 25, "%"),
    ],
    [
      o("volume", "Volumen", (v) => v.a * v.b * v.c, "dm³", 0),
      o("water", "Wasser", (v) => (v.a * v.b * v.c * v.w) / 100, "l", 2),
    ],
    [
      {
        id: "sechzig",
        text: "Baue ein Aquarium mit 60 Litern aus den Kanten 5 dm, 4 dm und 3 dm.",
        check: (v) => v.a === 5 && v.b === 4 && v.c === 3,
      },
      {
        id: "kubikmeter",
        text: "Baue einen Würfel mit 1 m³ und fülle ihn ganz.",
        check: (v) => v.a === 10 && v.b === 10 && v.c === 10 && v.w === 100,
      },
      {
        id: "halb",
        text: "Fülle ein Becken mit dem Volumen 80 dm³ zur Hälfte: 40 l.",
        check: (v) => v.a * v.b * v.c === 80 && v.w === 50,
      },
    ],
  ),
  exercises: [
    {
      id: "volumen",
      make: (rng, level) => {
        const a = rng.int(3, 15);
        const b = rng.int(2, 10);
        const h = rng.int(2, 10);
        const V = a * b * h;
        if (level === 1)
          return task(
            level,
            `Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${h} cm. Berechne das Volumen.`,
            "",
            [
              num("V =", V, "cm³", 0, {
                slips: [{ value: 2 * (a * b + a * h + b * h), hint: "Das ist die Oberfläche. Das Volumen ist das Produkt aller drei Kanten." }],
              }),
            ],
            "V = a · b · c",
            `${a} · ${b} · ${h}.`,
            `${V} cm³.`,
            { a, b, h },
          );
        const lengthCm = a * 10;
        const fill = rng.pick([0.5, 0.25, 0.75]);
        const litres = V * fill;
        return task(
          level,
          "",
          `Ein Aquarium ist ${lengthCm} cm lang, ${b} dm breit und ${h} dm hoch. Es wird zu ${fmt(fill * 100, 0)} % mit Wasser gefüllt. Wie viele Liter fasst es, und wie viel Wasser ist darin?`,
          [num("Fassungsvermögen =", V, "l", 0), num("Wasser =", litres, "l", 2)],
          "Rechne zuerst alle Kanten in dm um; 1 dm³ = 1 l.",
          `${lengthCm} cm = ${a} dm; ${a} · ${b} · ${h} = ${V}.`,
          `${V} l und ${fmt(litres)} l.`,
          { a, b, h, fill },
        );
      },
    },
    {
      id: "fehlende-kante",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(2, 10);
          const b = rng.int(2, 8);
          const h = rng.int(2, 9);
          return task(
            level,
            `Ein Quader hat das Volumen ${a * b * h} cm³, die Länge ${a} cm und die Breite ${b} cm. Wie hoch ist er?`,
            "",
            [num("c =", h, "cm", 2)],
            "c = V : (a · b)",
            `${a} · ${b} = ${a * b}; ${a * b * h} : ${a * b}.`,
            `${h} cm.`,
            { a, b, h },
          );
        }
        const edge = rng.int(2, 10);
        const V = edge ** 3;
        const times = rng.int(2, 4);
        return task(
          level,
          "",
          `Ein Würfel hat das Volumen ${fmt(V, 0)} cm³. Wie lang ist seine Kante? Wie viele Würfel dieser Größe passen in eine würfelförmige Kiste mit der Kantenlänge ${times * edge} cm?`,
          [num("a =", edge, "cm", 0), num("Anzahl =", times ** 3, "", 0)],
          "Suche die Zahl, die dreimal mit sich selbst multipliziert das Volumen ergibt.",
          `${edge} · ${edge} · ${edge} = ${fmt(V, 0)}; in der Kiste ${times} · ${times} · ${times} Würfel.`,
          `${edge} cm und ${times ** 3} Würfel.`,
          { edge, times },
        );
      },
    },
  ],
});

const COMPOSITE = (v: Record<string, number>) =>
  v.t * (v.a * v.d + v.c * (v.b - v.d));

const zusammengesetzt = L(4, {
  id: "rg-4-zusammengesetzte-koerper",
  title: "4.4 Zusammengesetzte Körper",
  subtitle: "In Quader zerlegen und modellieren",
  whyItMatters:
    "Treppen, Pools mit zwei Tiefen und Bausteine sind keine einfachen Quader, lassen sich aber in Quader zerlegen. So kannst du auch reale Dinge berechnen.",
  explanationHtml: `<p>Einen <strong>zusammengesetzten Körper</strong> zerlegst du in Quader und addierst ihre Volumen. Oder du ergänzt ihn zu einem großen Quader und ziehst ab, was fehlt.</p><div class="example">Ein Pool ist 10 m lang und 4 m breit. Auf 6 m Länge ist er 1 m tief, auf den restlichen 4 m ist er 2 m tief. V = 6 m · 4 m · 1 m + 4 m · 4 m · 2 m = 24 m³ + 32 m³ = 56 m³ = 56 000 l.</div><p>So gehst du vor: Skizze zeichnen, Maße ergänzen, Teilkörper festlegen, Einheiten angleichen, rechnen, und das Ergebnis mit einer groben Schätzung vergleichen.</p><div class="merke"><strong>Merke:</strong> Beide Wege, addieren und abziehen, müssen dasselbe ergeben. Dabei dürfen sich die Teilkörper nicht überlappen.</div>`,
  formulas: [
    {
      name: "Zerlegen",
      html: "V = V₁ + V₂ + …",
      quantities: "Teilquader ohne Überlappung",
    },
    {
      name: "Ergänzen",
      html: "V = V<sub>groß</sub> − V<sub>fehlt</sub>",
      quantities: "großer Quader minus fehlender Quader",
    },
  ],
  quiz: {
    question: "Aus einem Würfel mit 5 cm Kante wird ein Würfel mit 2 cm Kante herausgeschnitten. Wie groß ist das Restvolumen?",
    options: ["117 cm³", "133 cm³", "27 cm³"],
    correctIndex: 0,
    explanation: "125 cm³ − 8 cm³ = 117 cm³. 133 cm³ wäre addiert, 27 cm³ wäre (5 − 2)³.",
  },
  lab: lab(
    "composite-solid",
    "L-Körper",
    "Verändere den Körper und wähle den Rechenweg. Beide Rechnungen führen zum selben Volumen.",
    [
      c("mode", "Rechenweg", ["zerlegen und addieren", "ergänzen und abziehen"]),
      r("a", "Länge a", 3, 8, 4, 1, "m"),
      r("b", "Gesamthöhe b", 3, 6, 3, 1, "m"),
      r("c", "Länge oben c", 1, 3, 1, 1, "m"),
      r("d", "Höhe unten d", 1, 2, 1, 1, "m"),
      r("t", "Tiefe t", 1, 4, 2, 1, "m"),
    ],
    [
      o("volume", "Volumen", COMPOSITE, "m³", 0),
      o("calc", "Rechnung", (v) =>
        v.mode === 0
          ? `${v.a}·${v.t}·${v.d} + ${v.c}·${v.t}·${v.b - v.d} = ${COMPOSITE(v)} m³`
          : `${v.a}·${v.t}·${v.b} − ${v.a - v.c}·${v.t}·${v.b - v.d} = ${COMPOSITE(v)} m³`,
      ),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle a = 6 m, b = 5 m, c = 2 m, d = 2 m und t = 3 m ein.",
        check: (v) => v.a === 6 && v.b === 5 && v.c === 2 && v.d === 2 && v.t === 3,
      },
      {
        id: "abziehen",
        text: "Berechne einen Körper mit a = 8 m und t = 4 m mit dem Weg „ergänzen und abziehen“.",
        check: (v) => v.mode === 1 && v.a === 8 && v.t === 4,
      },
      {
        id: "dreissig",
        text: "Finde einen Körper mit dem Volumen 30 m³.",
        check: (v) => COMPOSITE(v) === 30,
      },
    ],
  ),
  exercises: [
    {
      id: "pool",
      make: (rng, level) => {
        const width = rng.int(3, 8);
        const l1 = rng.int(3, 10);
        const l2 = rng.int(2, 8);
        const d1 = rng.pick([1, 1.5]);
        const d2 = rng.pick([2, 2.5, 3]);
        const V = clean(width * l1 * d1 + width * l2 * d2);
        if (level === 1)
          return task(
            level,
            `Ein Körper besteht aus zwei Quadern: ${l1} m · ${width} m · ${fmt(d1)} m und ${l2} m · ${width} m · ${fmt(d2)} m. Berechne das gesamte Volumen.`,
            "",
            [num("V =", V, "m³", 2)],
            "Volumen der beiden Quader einzeln berechnen und addieren.",
            `${fmt(width * l1 * d1)} + ${fmt(width * l2 * d2)}.`,
            `${fmt(V)} m³.`,
            { width, l1, l2, d1, d2 },
          );
        const rate = rng.pick([10, 12, 15, 20]);
        return task(
          level,
          "",
          `Ein Schwimmbecken ist ${width} m breit. Auf ${l1} m Länge ist es ${fmt(d1)} m tief, auf den nächsten ${l2} m ist es ${fmt(d2)} m tief. Wie viele Kubikmeter Wasser fasst es? Wie viele Stunden dauert das Füllen bei ${rate} m³ pro Stunde? Runde auf eine Stelle.`,
          [
            num("V =", V, "m³", 2),
            num("Zeit =", Math.round((V / rate) * 10) / 10, "h", 1),
          ],
          "Becken in zwei Quader zerlegen. Zeit = Volumen : Füllmenge pro Stunde.",
          `${fmt(width * l1 * d1)} + ${fmt(width * l2 * d2)} = ${fmt(V)}; ${fmt(V)} : ${rate}.`,
          `${fmt(V)} m³ und ≈ ${fmt(V / rate, 1)} h.`,
          { width, l1, l2, d1, d2, rate },
        );
      },
    },
    {
      id: "ausgehoehlt",
      make: (rng, level) => {
        const a = rng.int(6, 12);
        const b = rng.int(4, 8);
        const h = rng.int(4, 8);
        const hole = rng.int(1, 3);
        const full = a * b * h;
        const holeV = hole ** 3;
        if (level === 1)
          return task(
            level,
            `Aus einem Quader (${a} cm · ${b} cm · ${h} cm) wird ein Würfel mit ${hole} cm Kante herausgeschnitten. Wie groß ist das Restvolumen?`,
            "",
            [
              num("V =", full - holeV, "cm³", 0, {
                slips: [{ value: full + holeV, hint: "Der Würfel wird abgezogen, nicht addiert." }],
              }),
            ],
            "Großes Volumen minus herausgeschnittenes Volumen.",
            `${full} − ${holeV}.`,
            `${full - holeV} cm³.`,
            { a, b, h, hole },
          );
        const wall = 1;
        const inner = (a - 2 * wall) * (b - 2 * wall) * (h - wall);
        return task(
          level,
          "",
          `Ein oben offener Holzkasten ist außen ${a} cm lang, ${b} cm breit und ${h} cm hoch. Wände und Boden sind ${wall} cm dick. Wie groß ist der Innenraum? Wie viel cm³ Holz wurden verbaut?`,
          [num("Innenraum =", inner, "cm³", 0), num("Holz =", full - inner, "cm³", 0)],
          "Innen fehlt je eine Wanddicke auf beiden Seiten, in der Höhe nur der Boden.",
          `(${a} − 2) · (${b} − 2) · (${h} − 1) = ${inner}; ${full} − ${inner}.`,
          `${inner} cm³ Innenraum und ${full - inner} cm³ Holz.`,
          { a, b, h },
        );
      },
    },
  ],
});

export const STAGE_RAUMGEOMETRIE = makeStage(
  4,
  "Raumgeometrie",
  "Rauminhalte messen, umrechnen und berechnen",
  "#c2410c",
  "🧊",
  [rauminhalt, raumeinheiten, quader, zusammengesetzt],
);
