import { fmt } from "../exercises/format";
import { borrows, carries, roundTo } from "../models";
import {
  choice as c,
  lab,
  makeLesson,
  output as o,
  range as r,
  task,
} from "./builders";
import { numberField as num, choiceField as pick } from "./helpers";
import { wordForm } from "./numerals";

const L = (step: number, content: Parameters<typeof makeLesson>[3]) =>
  makeLesson(1, step, step <= 4 ? 1 : 2, content);
const n0 = (value: number) => fmt(value, 0);

const zahlenmenge = L(1, {
  id: "nz-1-zahlenmenge",
  title: "1.1 Natürliche Zahlen ohne Ende",
  subtitle: "Menge ℕ, Nachfolger und Vorgänger, große Zahlen",
  whyItMatters:
    "Du kennst aus der Grundschule Zahlen bis zur Million. Jetzt siehst du, warum es nach oben keine Grenze gibt.",
  explanationHtml: `<p>Mit den Zahlen 1, 2, 3, 4, … zählst du. Sie heißen <strong>natürliche Zahlen</strong> und bilden die Menge ℕ = {1; 2; 3; …}. Nimmst du die Null dazu, schreibst du ℕ₀ = {0; 1; 2; 3; …}.</p><p>Jede natürliche Zahl hat einen <strong>Nachfolger</strong>: die Zahl, die um 1 größer ist. Darum kann es keine größte natürliche Zahl geben. Würde jemand eine „größte Zahl“ nennen, wäre ihr Nachfolger noch größer. Jede natürliche Zahl außer der 1 hat auch einen <strong>Vorgänger</strong> in ℕ.</p><div class="example">Der Nachfolger von 999.999 ist 1.000.000 (eine Million). Der Vorgänger von 1.000.000.000 (einer Milliarde) ist 999.999.999. Nach der Milliarde kommen Billion und Billiarde, und es geht immer weiter.</div><div class="merke"><strong>Merke:</strong> Nachfolger = Zahl + 1, Vorgänger = Zahl − 1. Die Menge der natürlichen Zahlen hat kein größtes Element.</div>`,
  formulas: [
    {
      name: "Natürliche Zahlen",
      html: "ℕ = {1; 2; 3; …}, ℕ₀ = {0; 1; 2; 3; …}",
      quantities: "Die drei Punkte bedeuten: Es geht ohne Ende weiter.",
    },
    {
      name: "Große Zahlen",
      html: "1 Million = 1.000.000, 1 Milliarde = 1.000.000.000, 1 Billion = 1.000.000.000.000",
      quantities: "Eine Stufe weiter bedeutet: 1.000-mal so groß.",
    },
  ],
  quiz: {
    question: "Warum gibt es keine größte natürliche Zahl?",
    options: [
      "Zu jeder Zahl gibt es einen Nachfolger, der um 1 größer ist.",
      "Große Zahlen kann man nicht mehr aufschreiben.",
      "Nach einer Billion hören die natürlichen Zahlen auf.",
    ],
    correctIndex: 0,
    explanation:
      "Egal welche Zahl du nennst: Addierst du 1, hast du eine größere natürliche Zahl.",
  },
  lab: lab(
    "successor",
    "Immer noch eine größer",
    "Wähle eine Ziffer und die Anzahl der Nullen. Du siehst die Zahl mit Vorgänger und Nachfolger.",
    [
      r("digit", "Erste Ziffer", 1, 9, 2),
      r("exp", "Anzahl der Nullen", 0, 12, 3),
    ],
    [
      o("zahl", "Zahl", (v) => n0(v.digit * 10 ** v.exp)),
      o("vor", "Vorgänger", (v) => n0(v.digit * 10 ** v.exp - 1)),
      o("nach", "Nachfolger", (v) => n0(v.digit * 10 ** v.exp + 1)),
    ],
    [
      {
        id: "million",
        text: "Stelle eine Million ein: eine 1 mit sechs Nullen.",
        check: (v) => v.digit === 1 && v.exp === 6,
      },
      {
        id: "milliarden",
        text: "Stelle 5 Milliarden ein: eine 5 mit neun Nullen.",
        check: (v) => v.digit === 5 && v.exp === 9,
      },
      {
        id: "groesste",
        text: "Stelle die größte Zahl dieses Labors ein. Ihr Nachfolger zeigt: Es geht trotzdem weiter.",
        check: (v) => v.digit === 9 && v.exp === 12,
      },
    ],
  ),
  exercises: [
    wordForm,
    {
      id: "nachbarn",
      make: (rng, level) => {
        const zeros = level === 1 ? rng.int(2, 4) : rng.int(5, 9);
        const n = rng.int(1, 9) * 10 ** zeros;
        const askNext = rng.int(0, 1) === 1;
        const answer = askNext ? n + 1 : n - 1;
        const word = askNext ? "Nachfolger" : "Vorgänger";
        return task(
          level,
          `Wie heißt der ${word} der Zahl ${n0(n)}? Gib ihn an.`,
          `Ein Videozähler zeigt gerade ${n0(n)} Aufrufe. ${askNext ? "Welche Zahl zeigt er nach dem nächsten Aufruf?" : "Welche Zahl zeigte er direkt vor dem letzten Aufruf?"}`,
          [
            num(`${word}:`, answer, "", 0, {
              slips: [
                {
                  value: askNext ? n - 1 : n + 1,
                  hint: askNext
                    ? "Das ist der Vorgänger. Der Nachfolger ist um 1 größer."
                    : "Das ist der Nachfolger. Der Vorgänger ist um 1 kleiner.",
                },
              ],
            }),
          ],
          askNext ? "Nachfolger = Zahl + 1" : "Vorgänger = Zahl − 1",
          `${n0(n)} ${askNext ? "+" : "−"} 1 = ${n0(answer)}.`,
          `${word}: ${n0(answer)}`,
          { n },
        );
      },
    },
    {
      id: "groesste-zahl",
      make: (rng, level) => {
        const digits = level === 1 ? rng.int(3, 5) : rng.int(5, 7);
        const largest = 10 ** digits - 1;
        return task(
          level,
          `Welche ist die größte natürliche Zahl mit ${digits} Stellen? Schreibe sie auf.`,
          `Ein Zählwerk hat ${digits} Stellen und steht auf der größten Zahl, die es zeigen kann. Welche Zahl ist das, und wie viele Stellen bräuchte es für den Nachfolger?`,
          [
            num("Größte Zahl:", largest, "", 0, {
              slips: [
                {
                  value: 10 ** digits,
                  hint: `Das ist schon der Nachfolger und hat ${digits + 1} Stellen. Die größte Zahl mit ${digits} Stellen besteht nur aus Neunen.`,
                },
              ],
            }),
            ...(level === 2
              ? [num("Stellen des Nachfolgers:", digits + 1, "", 0)]
              : []),
          ],
          "An jeder Stelle steht die größte Ziffer, also 9.",
          `Mit ${digits} Stellen ist ${n0(largest)} am größten. Der Nachfolger ${n0(10 ** digits)} hat ${digits + 1} Stellen.`,
          `Größte Zahl: ${n0(largest)}`,
          { digits },
        );
      },
    },
  ],
});

const stufenzahlen = L(2, {
  id: "nz-2-stufenzahlen",
  title: "1.2 Stufenzahlen und Stellenwerte",
  subtitle: "Das Dezimalsystem als Stellenwertsystem",
  whyItMatters:
    "Dieselbe Ziffer kann 3 oder 3.000 bedeuten. Es kommt nur darauf an, wo sie steht.",
  explanationHtml: `<p>Die Zahlen 1, 10, 100, 1.000, 10.000, … heißen <strong>Stufenzahlen</strong>. Jede ist 10-mal so groß wie die vorige. Darum heißt unser System <strong>Dezimalsystem</strong> oder Zehnersystem: Zehn Einheiten einer Stufe ergeben eine Einheit der nächsten Stufe.</p><p>Es ist ein <strong>Stellenwertsystem</strong>: Der Wert einer Ziffer hängt von ihrer Stelle ab. Mit den zehn Ziffern 0 bis 9 kannst du jede Zahl schreiben. Die Null hält eine leere Stelle frei.</p><p>Nach links setzt sich die Tafel fort: Tausender, Millionen, Milliarden. Lies die Zahl in Dreiergruppen. 2.003.004.005 heißt „zwei Milliarden drei Millionen viertausendfünf“. Jede fehlende Gruppe braucht drei Nullen.</p><div class="example">407.050 = 4 · 100.000 + 7 · 1.000 + 5 · 10. In der Stellenwerttafel steht: 4 HT, 0 ZT, 7 T, 0 H, 5 Z, 0 E.</div><div class="merke"><strong>Merke:</strong> Eine Stelle weiter links ist die Ziffer 10-mal so viel wert. Die Ziffer 0 zeigt: An dieser Stelle ist nichts.</div>`,
  formulas: [
    {
      name: "Stufenzahlen",
      html: "1, 10, 100, 1.000, 10.000, 100.000, 1.000.000, …",
      quantities:
        "E Einer, Z Zehner, H Hunderter, T Tausender, ZT Zehntausender, HT Hunderttausender, M Million",
    },
    {
      name: "Zerlegen",
      html: "3.052 = 3 · 1.000 + 5 · 10 + 2 · 1",
      quantities: "Ziffer mal Stufenzahl",
    },
  ],
  quiz: {
    question: "Welchen Wert hat die Ziffer 6 in der Zahl 460.218?",
    options: ["60.000", "6.000", "600.000"],
    correctIndex: 0,
    explanation: "Die 6 steht an der Zehntausenderstelle: 6 · 10.000 = 60.000.",
  },
  lab: lab(
    "big-place-value",
    "Große Zahlen in Dreiergruppen",
    "Stelle Milliarden, Millionen, Tausender und Einer ein. Eine leere Gruppe wird mit drei Nullen aufgefüllt.",
    [
      r("billions", "Milliarden", 0, 9, 1),
      r("millions", "Millionen", 0, 999, 2),
      r("thousands", "Tausender", 0, 999, 3),
      r("ones", "Einer", 0, 999, 4),
    ],
    [
      o("zahl", "Zahl", (v) =>
        n0(v.billions * 1e9 + v.millions * 1e6 + v.thousands * 1000 + v.ones),
      ),
      o(
        "gruppen",
        "Dreiergruppen",
        (v) =>
          `${v.billions} | ${String(v.millions).padStart(3, "0")} | ${String(v.thousands).padStart(3, "0")} | ${String(v.ones).padStart(3, "0")}`,
      ),
    ],
    [
      {
        id: "nullen",
        text: "Baue 4.000.007.050 mit leeren Gruppen und Stellen.",
        check: (v) =>
          v.billions === 4 &&
          v.millions === 0 &&
          v.thousands === 7 &&
          v.ones === 50,
      },
      {
        id: "stufenzahl",
        text: "Baue die Stufenzahl eine Milliarde.",
        check: (v) =>
          v.billions === 1 &&
          v.millions === 0 &&
          v.thousands === 0 &&
          v.ones === 0,
      },
      {
        id: "dreitausend",
        text: "Baue 2 Milliarden, 3 Millionen, 4 Tausender und 5 Einer.",
        check: (v) =>
          v.billions === 2 &&
          v.millions === 3 &&
          v.thousands === 4 &&
          v.ones === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "stelle-wert",
      make: (rng, level) => {
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
        const number = digits.reduce((sum, d) => sum * 10 + d, 0);
        const place = rng.int(0, level === 1 ? 5 : 4);
        const names = [
          "Hunderttausender",
          "Zehntausender",
          "Tausender",
          "Hunderter",
          "Zehner",
          "Einer",
        ];
        const value = digits[place] * 10 ** (5 - place);
        return task(
          level,
          `Welchen Wert hat die Ziffer an der ${names[place]}stelle von ${n0(number)}?`,
          `Mia sagt: „In ${n0(number)} ist die ${digits[place]} genau ${digits[place]} wert.“ Das stimmt nicht. Gib den richtigen Wert der Ziffer ${digits[place]} an.`,
          [
            num("Wert:", value, "", 0, {
              slips:
                place < 5
                  ? [
                      {
                        value: digits[place],
                        hint: "Das ist nur die Ziffer. Multipliziere sie noch mit ihrer Stufenzahl.",
                      },
                    ]
                  : [],
            }),
          ],
          "Wert = Ziffer · Stufenzahl",
          `Die Ziffer ${digits[place]} steht an der ${names[place]}stelle: ${digits[place]} · ${n0(10 ** (5 - place))}.`,
          `Der Wert ist ${n0(value)}.`,
          { number },
        );
      },
    },
    {
      id: "zerlegung-zahl",
      make: (rng, level) => {
        const a = rng.int(1, 9),
          b = rng.int(1, 9),
          d = rng.int(1, 9);
        const number =
          level === 1 ? a * 1000 + b * 100 + d : a * 100000 + b * 1000 + d * 10;
        const text =
          level === 1
            ? `${a} · 1.000 + ${b} · 100 + ${d} · 1`
            : `${d} · 10 + ${a} · 100.000 + ${b} · 1.000`;
        return task(
          level,
          `Schreibe als Zahl: ${text}.`,
          `Die Reihenfolge ist durcheinandergeraten: ${text}. Welche Zahl ist gemeint? Denke an die freien Stellen.`,
          [num("Zahl:", number, "", 0)],
          "Trage jede Ziffer in ihre Spalte ein. Freie Stellen bekommen eine 0.",
          `Addiere die Werte der Stellen. Stellen ohne Eintrag sind 0.`,
          `Die Zahl ist ${n0(number)}.`,
          { number },
        );
      },
    },
  ],
});

const zahlenstrahl = L(3, {
  id: "nz-3-zahlenstrahl",
  title: "1.3 Zahlenstrahl und Größenvergleich",
  subtitle: "Ablesen, anordnen und passend einteilen",
  whyItMatters:
    "Am Zahlenstrahl siehst du sofort, welche Zahl größer ist und wie weit zwei Zahlen auseinanderliegen.",
  explanationHtml: `<p>Auf dem <strong>Zahlenstrahl</strong> stehen die Zahlen geordnet: Je weiter rechts eine Zahl steht, desto größer ist sie. Das schreibst du mit den Zeichen <strong>&lt;</strong> (kleiner als) und <strong>&gt;</strong> (größer als).</p><p>Vor dem Ablesen klärst du die <strong>Skalierung</strong>: Wie viel bedeutet ein Teilstrich? Willst du selbst Zahlen eintragen, wählst du die Einteilung so, dass alle Zahlen auf den Strahl passen und du sie gut unterscheiden kannst.</p><div class="example">Zwischen 0 und 100 liegen 5 gleiche Abschnitte. Ein Abschnitt ist 100 : 5 = 20 wert. Der dritte Strich zeigt also 60. Weil 60 links von 80 liegt, gilt 60 &lt; 80.</div><div class="merke"><strong>Merke:</strong> Erst den Wert eines Teilstrichs bestimmen, dann ablesen. Die Spitze von &lt; und &gt; zeigt immer zur kleineren Zahl.</div>`,
  formulas: [
    {
      name: "Wert eines Teilstrichs",
      html: "Abstand zweier beschrifteter Zahlen : Anzahl der Abschnitte",
      quantities: "Zuerst zählen, dann teilen",
    },
    {
      name: "Vergleichszeichen",
      html: "3 &lt; 5 und 5 &gt; 3",
      quantities: "< bedeutet kleiner als, > bedeutet größer als",
    },
  ],
  quiz: {
    question:
      "Du sollst 1.200, 3.500 und 4.800 eintragen. Welche Einteilung passt am besten?",
    options: [
      "Ein Strich bedeutet 100.",
      "Ein Strich bedeutet 1.",
      "Ein Strich bedeutet 100.000.",
    ],
    correctIndex: 0,
    explanation:
      "Mit 100 pro Strich reichen 50 Striche. Mit 1 pro Strich wäre der Strahl viel zu lang, mit 100.000 lägen alle Zahlen fast auf einem Punkt.",
  },
  lab: lab(
    "number-ray",
    "Zahlenstrahl einteilen",
    "Wähle, was ein Teilstrich bedeutet, und ziehe den Punkt. Rechts stehen immer die größeren Zahlen.",
    [
      c("scale", "Ein Teilstrich", ["1", "10", "100", "1.000"]),
      r("k", "Teilstrich Nummer", 0, 20, 5),
    ],
    [
      o("wert", "Wert des Punktes", (v) =>
        n0(v.k * [1, 10, 100, 1000][v.scale]),
      ),
      o("vergleich", "Vergleich mit 1.000", (v) => {
        const value = v.k * [1, 10, 100, 1000][v.scale];
        return value < 1000
          ? "kleiner als 1.000"
          : value > 1000
            ? "größer als 1.000"
            : "genau 1.000";
      }),
    ],
    [
      {
        id: "siebzig",
        text: "Markiere 70 mit der Einteilung 10.",
        check: (v) => v.scale === 1 && v.k === 7,
      },
      {
        id: "tausend",
        text: "Markiere 1.300 mit der Einteilung 100. Die Zahl ist größer als 1.000.",
        check: (v) => v.scale === 2 && v.k === 13,
      },
      {
        id: "gross",
        text: "Markiere 16.000 mit der passenden Einteilung.",
        check: (v) => v.scale === 3 && v.k === 16,
      },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const end = level === 1 ? 100 : rng.pick([1000, 5000, 10000]);
        const parts = rng.pick([4, 5, 10]);
        const step = end / parts;
        const k = rng.int(1, parts - 1);
        return task(
          level,
          `Zwischen 0 und ${n0(end)} ist der Zahlenstrahl in ${parts} gleiche Abschnitte geteilt. Welche Zahl steht am Teilstrich Nummer ${k}?`,
          `Auf einer Skala für Wasserstände stehen 0 und ${n0(end)} Millimeter, dazwischen ${parts} gleiche Abschnitte. Der Wasserstand zeigt auf Strich Nummer ${k}. Wie hoch ist er?`,
          [
            num("Zahl:", k * step, level === 1 ? "" : "mm", 0, {
              slips: [
                {
                  value: k,
                  hint: "Das ist die Nummer des Strichs. Multipliziere sie mit dem Wert eines Abschnitts.",
                },
              ],
            }),
          ],
          "Wert eines Abschnitts = Abstand : Anzahl der Abschnitte",
          `Ein Abschnitt ist ${n0(end)} : ${parts} = ${n0(step)} wert. ${k} · ${n0(step)} = ${n0(k * step)}.`,
          `Am Strich steht ${n0(k * step)}.`,
          { end },
        );
      },
    },
    {
      id: "vergleichen",
      make: (rng, level) => {
        const base = rng.int(10, 99) * (level === 1 ? 100 : 10000);
        const a = base + rng.int(1, 9) * (level === 1 ? 10 : 1000);
        const b = a + rng.int(1, 5) * (level === 1 ? 10 : 100);
        const swap = rng.int(0, 1) === 1;
        const [x, y] = swap ? [b, a] : [a, b];
        const index = x < y ? 0 : 1;
        return task(
          level,
          `Welches Zeichen gehört zwischen ${n0(x)} und ${n0(y)}?`,
          `Zwei Städte haben ${n0(x)} und ${n0(y)} Einwohner. Vergleiche die Zahlen in dieser Reihenfolge.`,
          [pick(`${n0(x)} … ${n0(y)}`, ["<", ">", "="], index)],
          "Vergleiche die Stellen von links nach rechts.",
          "Die erste verschiedene Ziffer von links entscheidet.",
          `${n0(x)} ${index === 0 ? "<" : ">"} ${n0(y)}`,
          { x, y },
        );
      },
    },
  ],
});

const runden = L(4, {
  id: "nz-4-runden",
  title: "1.4 Runden",
  subtitle: "Auf eine Stelle runden und begründen, wann es sinnvoll ist",
  whyItMatters:
    "„Etwa 80.000 Fans“ merkt man sich leichter als 79.846. Beim Eintrittsgeld darf aber niemand runden.",
  explanationHtml: `<p>Beim <strong>Runden</strong> ersetzt du eine Zahl durch eine benachbarte runde Zahl. Entscheidend ist die Ziffer <strong>rechts neben</strong> der Stelle, auf die du rundest: Bei 0, 1, 2, 3 oder 4 rundest du <strong>ab</strong>, bei 5, 6, 7, 8 oder 9 rundest du <strong>auf</strong>. Das Zeichen ≈ bedeutet „ungefähr gleich“.</p><p>Runden ist sinnvoll, wenn es auf den genauen Wert nicht ankommt: Einwohnerzahlen, Entfernungen, Überschläge. Genau bleiben musst du bei Rechnungen, Telefonnummern oder Medikamenten. Manchmal zwingt dich die Sache auch: Für 23 Personen reichen zwei Tische zu je 10 Plätzen nicht, du brauchst drei.</p><div class="example">79.846 auf Tausender: rechts neben der 9 steht die 8, also aufrunden. 79.846 ≈ 80.000. Auf Hunderter: rechts neben der 8 steht die 4, also abrunden. 79.846 ≈ 79.800.</div><div class="merke"><strong>Merke:</strong> 0 bis 4 abrunden, 5 bis 9 aufrunden. Die Ziffer rechts neben der Rundungsstelle entscheidet.</div>`,
  formulas: [
    {
      name: "Rundungsregel",
      html: "0, 1, 2, 3, 4 → abrunden; 5, 6, 7, 8, 9 → aufrunden",
      quantities: "Die Ziffer rechts neben der Rundungsstelle entscheidet.",
    },
    {
      name: "Ungefähr gleich",
      html: "4.738 ≈ 4.700",
      quantities: "≈ steht beim gerundeten Ergebnis",
    },
  ],
  quiz: {
    question: "Wie lautet 3.495 auf Hunderter gerundet?",
    options: ["3.500", "3.400", "3.000"],
    correctIndex: 0,
    explanation:
      "Rechts neben der Hunderterstelle steht die 9, also wird aufgerundet. Aus 34 Hundertern werden 35.",
  },
  lab: lab(
    "rounding",
    "Runden am Zahlenstrahl",
    "Ziehe die Zahl. Die Mitte zwischen den beiden runden Nachbarn entscheidet, in welche Richtung gerundet wird.",
    [
      c("place", "Runden auf", ["Zehner", "Hunderter", "Tausender"], 1),
      r("n", "Zahl", 1000, 5000, 1234),
    ],
    [
      o("gerundet", "Gerundet", (v) =>
        n0(roundTo(v.n, [10, 100, 1000][v.place])),
      ),
      o("richtung", "Richtung", (v) => {
        const place = [10, 100, 1000][v.place];
        const rounded = roundTo(v.n, place);
        return rounded === v.n
          ? "schon rund"
          : rounded > v.n
            ? "aufrunden"
            : "abrunden";
      }),
    ],
    [
      {
        id: "mitte",
        text: "Runde 2.650 auf Hunderter. Genau in der Mitte wird aufgerundet.",
        check: (v) => v.place === 1 && v.n === 2650,
      },
      {
        id: "knapp",
        text: "Runde 3.499 auf Tausender. Knapp vor der Mitte wird abgerundet.",
        check: (v) => v.place === 2 && v.n === 3499,
      },
      {
        id: "kette",
        text: "Runde 4.995 auf Zehner. Das Ergebnis ist 5.000.",
        check: (v) => v.place === 0 && v.n === 4995,
      },
    ],
  ),
  exercises: [
    {
      id: "runden-stelle",
      make: (rng, level) => {
        const n =
          level === 1 ? rng.int(1000, 99999) : rng.int(1000000, 99999999);
        const places = level === 1 ? [10, 100, 1000] : [1000, 10000, 100000];
        const place = rng.pick(places);
        const name = {
          10: "Zehner",
          100: "Hunderter",
          1000: "Tausender",
          10000: "Zehntausender",
          100000: "Hunderttausender",
        }[place];
        const rounded = roundTo(n, place);
        const down = Math.floor(n / place) * place;
        const up = down + place;
        const other = rounded === down ? up : down;
        return task(
          level,
          `Runde die Zahl ${n0(n)} auf ${name} und schreibe das Ergebnis auf.`,
          `Ein Land hat ${n0(n)} Einwohner. Eine Zeitung nennt die Zahl in ganzen ${name}n. Welche Zahl druckt sie?`,
          [
            num("Gerundet:", rounded, "", 0, {
              slips: [
                {
                  value: other,
                  hint: "Du hast in die falsche Richtung gerundet. Schau auf die Ziffer rechts neben der Rundungsstelle.",
                },
              ],
            }),
          ],
          "0 bis 4 abrunden, 5 bis 9 aufrunden",
          `Die Ziffer rechts neben der ${name}stelle von ${n0(n)} ist ${Math.floor(n / (place / 10)) % 10}.`,
          `${n0(n)} ≈ ${n0(rounded)}`,
          { n, place },
        );
      },
    },
    {
      id: "runden-sinnvoll",
      make: (rng, level) => {
        const items = [
          [
            "die Zuschauerzahl eines Fußballspiels in einem Zeitungsartikel",
            true,
          ],
          ["die Einwohnerzahl von Bayern in einem Vortrag", true],
          [
            "die Entfernung von München nach Hamburg beim Planen einer Reise",
            true,
          ],
          ["den Betrag auf einer Rechnung beim Bezahlen", false],
          ["die Telefonnummer deiner Freundin", false],
          ["die Menge eines Medikaments für ein Kind", false],
        ] as const;
        const [text, sensible] = rng.pick(items);
        const persons = rng.int(21, 58) + (level === 2 ? 1 : 0);
        const seats = 10;
        const tables = Math.ceil(persons / seats);
        return task(
          level,
          `Ist es sinnvoll, ${text} zu runden?`,
          `Zu einem Fest kommen ${persons} Personen. An einen Tisch passen ${seats} Personen. Wie viele Tische braucht ihr? Normales Runden liefert hier nicht immer die richtige Antwort.`,
          level === 1
            ? [
                pick(
                  "Runden ist hier …",
                  ["sinnvoll", "nicht sinnvoll"],
                  sensible ? 0 : 1,
                ),
              ]
            : [
                num("Tische:", tables, "", 0, {
                  slips:
                    persons % 10 > 0 && persons % 10 < 5
                      ? [
                          {
                            value: tables - 1,
                            hint: `${persons % 10 === 1 ? "Dann hätte 1 Person" : `Dann hätten ${persons % 10} Personen`} keinen Platz. Hier musst du aufrunden.`,
                          },
                        ]
                      : [],
                }),
              ],
          "Frage dich: Schadet ein ungenauer Wert hier?",
          level === 1
            ? sensible
              ? "Hier kommt es nur auf die ungefähre Größe an."
              : "Hier muss der Wert genau stimmen."
            : `${persons} : ${seats} ergibt ${Math.floor(persons / seats)} Rest ${persons % seats}. ${persons % seats === 0 ? "Alle finden genau Platz." : persons % seats === 1 ? "Auch die letzte Person braucht einen Platz." : "Auch die restlichen Personen brauchen einen Platz."}`,
          level === 1
            ? sensible
              ? "Runden ist sinnvoll."
              : "Runden ist nicht sinnvoll."
            : `Ihr braucht ${tables} Tische.`,
          { persons },
        );
      },
    },
  ],
});

const addSub = L(5, {
  id: "nz-7-addieren-subtrahieren",
  title: "1.5 Schriftlich addieren und subtrahieren",
  subtitle: "Summe und Differenz, Übertrag und Entbündeln",
  whyItMatters:
    "Die schriftlichen Verfahren kennst du aus der Grundschule. Jetzt sollen sie auch bei großen Zahlen sicher sitzen, und du benennst ihre Teile.",
  explanationHtml: `<p>In einer <strong>Summe</strong> werden Summanden addiert: 1. Summand + 2. Summand = Wert der Summe. In einer <strong>Differenz</strong> gilt: Minuend − Subtrahend = Wert der Differenz.</p><p>Schreibe die Zahlen stellengenau untereinander und rechne von rechts. Beim <strong>Addieren</strong> trägst du einen vollen Zehner als Übertrag in die nächste Spalte. Beim <strong>Subtrahieren</strong> nutzt du das Abziehverfahren: Reicht die obere Ziffer nicht, <strong>entbündelst</strong> du einen Einer der nächsten Stelle zu zehn Einheiten.</p><div class="example">503 − 178: 3 − 8 geht nicht. Die Zehnerstelle ist 0, also entbündelst du aus den Hundertern: 503 = 4 H + 9 Z + 13 E. Dann 13 − 8 = 5, 9 − 7 = 2, 4 − 1 = 3. Ergebnis 325. Probe: 325 + 178 = 503.</div><div class="merke"><strong>Merke:</strong> Stellengenau untereinander schreiben, von rechts rechnen. Die Probe zur Subtraktion ist eine Addition.</div>`,
  formulas: [
    {
      name: "Summe",
      html: "Summand + Summand = Wert der Summe",
      quantities: "Beide Summanden darfst du vertauschen.",
    },
    {
      name: "Differenz",
      html: "Minuend − Subtrahend = Wert der Differenz",
      quantities: "Minuend und Subtrahend darfst du nicht vertauschen.",
    },
  ],
  quiz: {
    question: "Wie heißt die 178 in der Rechnung 503 − 178?",
    options: ["Subtrahend", "Minuend", "Summand"],
    correctIndex: 0,
    explanation:
      "Die Zahl, die abgezogen wird, heißt Subtrahend. 503 ist der Minuend.",
  },
  lab: lab(
    "written-calc",
    "Rechnen in Spalten",
    "Stelle zwei Zahlen und die Rechenart ein. Du siehst, wo ein Übertrag entsteht oder wo entbündelt werden muss.",
    [
      c("op", "Rechenart", ["Addition", "Subtraktion"]),
      r("a", "Erste Zahl", 100, 999, 423),
      r("b", "Zweite Zahl", 100, 999, 152),
    ],
    [
      o("ergebnis", "Ergebnis", (v) =>
        v.op === 0
          ? n0(v.a + v.b)
          : v.a >= v.b
            ? n0(v.a - v.b)
            : "keine natürliche Zahl",
      ),
      o("marken", "Überträge oder Entbündelungen", (v) =>
        (v.op === 0
          ? carries(v.a, v.b)
          : v.a >= v.b
            ? borrows(v.a, v.b)
            : []
        ).reduce((sum: number, m: number) => sum + m, 0),
      ),
    ],
    [
      {
        id: "drei",
        text: "Finde eine Addition mit drei Überträgen.",
        check: (v, r) => v.op === 0 && r.marken === 3,
      },
      {
        id: "zwei",
        text: "Finde eine Subtraktion, bei der zweimal entbündelt wird.",
        check: (v, r) => v.op === 1 && r.marken === 2,
      },
      {
        id: "tausend",
        text: "Finde eine Addition mit der Summe 1.000.",
        check: (v) => v.op === 0 && v.a + v.b === 1000,
      },
    ],
  ),
  exercises: [
    {
      id: "schriftlich-plus-minus",
      make: (rng, level) => {
        const a = level === 1 ? rng.int(1200, 8999) : rng.int(120000, 899999);
        const b =
          level === 1
            ? rng.int(1200, a - 1 > 1200 ? a - 1 : 1200)
            : rng.int(12000, a - 1);
        const plus = rng.int(0, 1) === 0;
        const value = plus ? a + b : a - b;
        return task(
          level,
          `Berechne schriftlich: ${n0(a)} ${plus ? "+" : "−"} ${n0(b)}.`,
          `Ein Verein hat ${n0(a)} € auf dem Konto. ${plus ? `Durch ein Sommerfest kommen ${n0(b)} € dazu.` : `Für ein neues Vereinsheim gibt er ${n0(b)} € aus.`} Wie viel Geld hat er dann?`,
          [
            num(
              plus ? "Wert der Summe:" : "Wert der Differenz:",
              value,
              level === 1 ? "" : "€",
              0,
              {
                slips: [
                  {
                    value: plus ? a - b : a + b,
                    hint: "Prüfe die Rechenart noch einmal.",
                  },
                ],
              },
            ),
          ],
          plus
            ? "Stellengenau untereinander, von rechts, Übertrag beachten."
            : "Stellengenau untereinander, von rechts, wenn nötig entbündeln.",
          plus
            ? `Probe durch Überschlag: ${n0(roundTo(a, 1000))} + ${n0(roundTo(b, 1000))}.`
            : `Probe: ${n0(value)} + ${n0(b)} = ${n0(a)}.`,
          `Ergebnis: ${n0(value)}`,
          { a, b },
        );
      },
    },
    {
      id: "fachbegriffe",
      make: (rng, level) => {
        const a = rng.int(300, 900),
          b = rng.int(20, 280);
        const ask = rng.int(0, 2);
        const value = a - b;
        if (level === 2) {
          return task(
            level,
            "",
            `Der Minuend ist ${n0(a)}. Der Wert der Differenz ist ${n0(value)}. Wie groß ist der Subtrahend?`,
            [
              num("Subtrahend:", b, "", 0, {
                slips: [
                  {
                    value: a + value,
                    hint: "Du hast addiert. Der Subtrahend ist Minuend minus Wert der Differenz.",
                  },
                ],
              }),
            ],
            "Minuend − Subtrahend = Wert der Differenz",
            `${n0(a)} − ${n0(value)} = ${n0(b)}. Probe: ${n0(a)} − ${n0(b)} = ${n0(value)}.`,
            `Der Subtrahend ist ${n0(b)}.`,
            { a, b },
          );
        }
        const terms = ["Minuend", "Subtrahend", "Wert der Differenz"];
        const shown = [n0(a), n0(b), n0(value)];
        return task(
          level,
          `Wie heißt die Zahl ${shown[ask]} in der Rechnung ${n0(a)} − ${n0(b)} = ${n0(value)}?`,
          "",
          [
            pick(
              "Fachbegriff:",
              [terms[ask], ...terms.filter((_, i) => i !== ask)],
              0,
            ),
          ],
          "Minuend − Subtrahend = Wert der Differenz",
          "Der Minuend steht zuerst. Der Subtrahend wird abgezogen.",
          `${shown[ask]} ist hier: ${terms[ask]}.`,
          { a, b },
        );
      },
    },
  ],
});

const multDiv = L(6, {
  id: "nz-8-multiplizieren-dividieren",
  title: "1.6 Schriftlich multiplizieren und dividieren",
  subtitle: "Produkt und Quotient, auch mit Rest",
  whyItMatters:
    "Mit diesen beiden Verfahren löst du später fast jede Sachaufgabe, auch wenn gerade kein Taschenrechner dabei ist.",
  explanationHtml: `<p>Im <strong>Produkt</strong> gilt: Faktor · Faktor = Wert des Produkts. Im <strong>Quotienten</strong> gilt: Dividend : Divisor = Wert des Quotienten.</p><p><strong>Multiplizieren:</strong> Rechne mit jeder Ziffer des zweiten Faktors einzeln und schreibe die Teilergebnisse stellengenau untereinander, dann addiere. <strong>Dividieren:</strong> Teile von links Stelle für Stelle. Multipliziere zurück, ziehe ab und hole die nächste Ziffer herunter. Bleibt am Ende etwas übrig, ist das der <strong>Rest</strong>.</p><p>Durch 0 darfst du nicht teilen, denn keine Zahl mal 0 ergibt zum Beispiel 5.</p><div class="example">234 · 16 = 234 · 10 + 234 · 6 = 2.340 + 1.404 = 3.744. Und 999 : 8 = 124 Rest 7, denn 124 · 8 = 992 und 992 + 7 = 999.</div><div class="merke"><strong>Merke:</strong> Die Probe zur Division ist die Multiplikation: Quotient · Divisor + Rest = Dividend.</div>`,
  formulas: [
    {
      name: "Produkt",
      html: "Faktor · Faktor = Wert des Produkts",
      quantities: "Faktoren darfst du vertauschen.",
    },
    {
      name: "Quotient",
      html: "Dividend : Divisor = Wert des Quotienten",
      quantities: "Der Divisor darf nicht 0 sein.",
    },
    {
      name: "Probe",
      html: "Quotient · Divisor + Rest = Dividend",
      quantities: "Der Rest ist kleiner als der Divisor.",
    },
  ],
  quiz: {
    question: "Wie groß ist der Rest bei 100 : 7?",
    options: ["2", "14", "7"],
    correctIndex: 0,
    explanation:
      "14 · 7 = 98, und 100 − 98 = 2. Der Rest muss kleiner als 7 sein.",
  },
  lab: lab(
    "written-mult",
    "Teilergebnisse sehen",
    "Wähle die Rechenart und zwei Zahlen. Die Zeilen zeigen die Teilschritte des schriftlichen Verfahrens.",
    [
      c("op", "Rechenart", ["Multiplikation", "Division"]),
      r("a", "Erste Zahl", 100, 999, 234),
      r("b", "Zweite Zahl", 2, 25, 6),
    ],
    [
      o("ergebnis", "Ergebnis", (v) =>
        v.op === 0 ? n0(v.a * v.b) : n0(Math.floor(v.a / v.b)),
      ),
      o("rest", "Rest", (v) => (v.op === 0 ? "kein Rest" : v.a % v.b)),
    ],
    [
      {
        id: "tausend",
        text: "Finde eine Multiplikation mit dem Ergebnis 1.000.",
        check: (v) => v.op === 0 && v.a * v.b === 1000,
      },
      {
        id: "ohne-rest",
        text: "Rechne 936 : 12. Die Division geht ohne Rest auf.",
        check: (v) => v.op === 1 && v.a === 936 && v.b === 12,
      },
      {
        id: "rest-sieben",
        text: "Finde eine Division mit dem Rest 7.",
        check: (v) => v.op === 1 && v.a % v.b === 7,
      },
    ],
  ),
  exercises: [
    {
      id: "schriftlich-mal",
      make: (rng, level) => {
        const a = level === 1 ? rng.int(120, 980) : rng.int(1200, 9800);
        const b = level === 1 ? rng.int(3, 9) : rng.int(12, 89);
        return task(
          level,
          `Berechne die Aufgabe schriftlich: ${n0(a)} · ${b}.`,
          `Eine Druckerei liefert ${b} Paletten mit je ${n0(a)} Heften. Wie viele Hefte sind das?`,
          [
            num("Wert des Produkts:", a * b, "", 0, {
              slips: [
                {
                  value: a * (b % 10),
                  hint: "Du hast nur mit den Einern gerechnet. Multipliziere auch mit den Zehnern.",
                },
              ],
            }),
          ],
          "Mit jeder Ziffer einzeln multiplizieren, stellengenau addieren.",
          `Überschlag: ${n0(roundTo(a, level === 1 ? 100 : 1000))} · ${level === 1 ? b : roundTo(b, 10)}.`,
          `${n0(a)} · ${b} = ${n0(a * b)}`,
          { a, b },
        );
      },
    },
    {
      id: "schriftlich-durch",
      make: (rng, level) => {
        const b = level === 1 ? rng.int(3, 9) : rng.int(12, 25);
        const q = level === 1 ? rng.int(45, 320) : rng.int(45, 120);
        const rest = level === 1 ? 0 : rng.int(1, b - 1);
        const a = q * b + rest;
        return task(
          level,
          `Berechne die Aufgabe schriftlich: ${n0(a)} : ${b}.`,
          `${n0(a)} Kinder fahren zu einem Sportfest, in Bussen mit je ${b} Plätzen. Wie viele volle Busse gibt es, und wie viele Kinder bleiben übrig?`,
          [
            num(
              level === 1 ? "Wert des Quotienten:" : "Volle Busse:",
              q,
              "",
              0,
            ),
            ...(level === 2 ? [num("Übrig:", rest, "", 0)] : []),
          ],
          "Von links Stelle für Stelle teilen und zurückmultiplizieren.",
          `Probe: ${n0(q)} · ${b}${rest ? ` + ${rest}` : ""} = ${n0(a)}.`,
          level === 1
            ? `${n0(a)} : ${b} = ${n0(q)}`
            : `${n0(q)} volle Busse, ${rest === 1 ? "1 Kind" : `${rest} Kinder`} übrig.`,
          { a, b },
        );
      },
    },
  ],
});

const sachaufgaben = L(7, {
  id: "nz-9-sachaufgaben",
  title: "1.7 Sachaufgaben und Überschlag",
  subtitle: "Rechenwege vergleichen, Ergebnisse prüfen",
  whyItMatters:
    "Eine richtige Rechnung nützt wenig, wenn das Ergebnis gar nicht zur Geschichte passt. Der Überschlag deckt das schnell auf.",
  explanationHtml: `<p>Bei einer <strong>Sachaufgabe</strong> gehst du Schritt für Schritt vor: Lies genau. Notiere, was gegeben und was gesucht ist. Rechne. Antworte in einem Satz. Oft führen <strong>mehrere Rechenwege</strong> zum Ziel. Vergleiche sie: Welcher hat die wenigsten Schritte und die einfachsten Zahlen?</p><p>Prüfe am Ende, ob das Ergebnis <strong>plausibel</strong> ist. Beim <strong>Überschlag</strong> rundest du die Zahlen und rechnest im Kopf. Liegt das genaue Ergebnis weit davon weg, stimmt etwas nicht.</p><div class="example">28 Kinder zahlen je 32 € für die Fahrt. Überschlag: 30 · 30 = 900. Genau: 28 · 32 = 896. Das passt. Ergebnis „8.960 €“ wäre nicht plausibel: Das wären etwa 320 € pro Kind.</div><div class="merke"><strong>Merke:</strong> Gegeben, gesucht, rechnen, Antwortsatz, Überschlag. Ein Ergebnis muss zur Sache passen.</div>`,
  formulas: [
    {
      name: "Überschlag",
      html: "28 · 32 ≈ 30 · 30 = 900",
      quantities: "Runde so, dass du im Kopf rechnen kannst.",
    },
    {
      name: "Vorgehen",
      html: "gegeben → gesucht → rechnen → Antwort → prüfen",
      quantities: "Eine Skizze oder Tabelle hilft beim Ordnen.",
    },
  ],
  quiz: {
    question:
      "Für einen Ausflug zahlen 24 Kinder je 19 €. Lea rechnet 4.560 € aus. Was sagt der Überschlag?",
    options: [
      "Etwa 20 · 20 = 400 €, also ist das Ergebnis zehnmal zu groß.",
      "Etwa 20 · 20 = 4.000 €, also stimmt es ungefähr.",
      "Ein Überschlag sagt hier nichts aus.",
    ],
    correctIndex: 0,
    explanation:
      "24 · 19 ist etwa 400. Genau sind es 456 €. Bei 4.560 € ist eine Null zu viel.",
  },
  lab: lab(
    "estimate",
    "Überschlag als Rechteck",
    "Ziehe die Ecke. Das blaue Rechteck zeigt das genaue Produkt, das gestrichelte den Überschlag mit gerundeten Zahlen.",
    [r("n", "Anzahl", 11, 49, 23), r("p", "Preis", 11, 49, 17, 1, "€")],
    [
      o("genau", "Genau", (v) => n0(v.n * v.p), "€"),
      o(
        "ueberschlag",
        "Überschlag",
        (v) => n0(roundTo(v.n, 10) * roundTo(v.p, 10)),
        "€",
      ),
      o(
        "abstand",
        "Abstand",
        (v) => n0(Math.abs(v.n * v.p - roundTo(v.n, 10) * roundTo(v.p, 10))),
        "€",
      ),
    ],
    [
      {
        id: "beispiel",
        text: "Stelle das Beispiel ein: 28 Kinder, 32 €.",
        check: (v) => v.n === 28 && v.p === 32,
      },
      {
        id: "gleich",
        text: "Stelle 40 Kinder und 30 € ein. Überschlag und genauer Wert sind hier gleich.",
        check: (v) => v.n === 40 && v.p === 30,
      },
      {
        id: "weit",
        text: "Finde Werte, bei denen der Überschlag um mehr als 300 € danebenliegt.",
        check: (v) =>
          Math.abs(v.n * v.p - roundTo(v.n, 10) * roundTo(v.p, 10)) > 300,
      },
    ],
  ),
  exercises: [
    {
      id: "mehrschritt",
      make: (rng, level) => {
        const kids = rng.int(21, 32),
          price = rng.int(12, 19),
          bus = rng.int(1, 4) * 100;
        if (level === 1) {
          const total = kids * price;
          return task(
            level,
            `${kids} Kinder zahlen je ${price} € für einen Ausflug. Wie viel Geld kommt zusammen?`,
            "",
            [num("Gesamt:", total, "€", 0)],
            "Anzahl · Preis pro Kind",
            `${kids} · ${price} = ${total}. Überschlag: ${roundTo(kids, 10)} · ${roundTo(price, 10)} = ${roundTo(kids, 10) * roundTo(price, 10)}.`,
            `Es kommen ${total} € zusammen.`,
            { kids, price },
          );
        }
        const each = kids * price;
        const rest = each + bus;
        return task(
          level,
          "",
          `Der Bus für einen Ausflug kostet ${bus} €. Dazu kommt für jedes der ${kids} Kinder ein Eintritt von ${price} €. Wie viel kostet der Ausflug insgesamt?`,
          [
            num("Gesamt:", rest, "€", 0, {
              slips: [
                { value: each, hint: "Du hast den Bus vergessen." },
                {
                  value: (bus + price) * kids,
                  hint: "Der Bus wird nur einmal bezahlt, nicht für jedes Kind.",
                },
              ],
            }),
          ],
          "Zwei Schritte: erst alle Eintritte, dann den Bus dazu.",
          `Eintritte: ${kids} · ${price} = ${each}. Dazu der Bus: ${each} + ${bus} = ${rest}.`,
          `Der Ausflug kostet ${n0(rest)} €.`,
          { kids, price, bus },
        );
      },
    },
    {
      id: "plausibel",
      make: (rng, level) => {
        const a = rng.int(21, 89),
          b = rng.int(21, 89);
        const exact = a * b;
        const estimateValue = roundTo(a, 10) * roundTo(b, 10);
        const wrongBy10 = exact * 10;
        const showRight = rng.int(0, 1) === 0;
        const claim = showRight ? exact : wrongBy10;
        return task(
          level,
          `Tom rechnet ${a} · ${b} = ${n0(claim)}. Überschlage: ${roundTo(a, 10)} · ${roundTo(b, 10)}. Kann sein Ergebnis stimmen?`,
          `In einem Bericht steht: „${a} Klassen haben je ${b} Bücher gesammelt, zusammen ${n0(claim)} Bücher.“ Prüfe mit einem Überschlag, ob das plausibel ist.`,
          [
            pick(
              "Ergebnis ist …",
              ["plausibel", "nicht plausibel"],
              showRight ? 0 : 1,
            ),
          ],
          "Runde beide Zahlen auf Zehner und rechne im Kopf.",
          `Überschlag: ${roundTo(a, 10)} · ${roundTo(b, 10)} = ${n0(estimateValue)}. Genau: ${n0(exact)}.`,
          showRight
            ? "Das Ergebnis ist plausibel."
            : "Das Ergebnis ist etwa zehnmal zu groß, also nicht plausibel.",
          { a, b },
        );
      },
    },
  ],
});

export const LESSONS = [
  zahlenmenge,
  stufenzahlen,
  zahlenstrahl,
  runden,
  addSub,
  multDiv,
  sachaufgaben,
];
