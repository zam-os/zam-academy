import { fmt } from "../exercises/format";
import {
  borrows,
  carries,
  digitSum,
  divisors,
  dual,
  factorText,
  ggt,
  isPrime,
  kgv,
  primeFactors,
  roman,
  roundTo,
  sup,
  termSteps,
} from "../models";
import { numberField as num, choiceField as pick } from "./helpers";
import {
  lab,
  range as r,
  choice as c,
  output as o,
  makeLesson,
  makeStage,
  task,
} from "./builders";

const n0 = (value: number) => fmt(value, 0);

const zahlenmenge = makeLesson(1, 1, 1, {
  id: "nz-1-zahlenmenge",
  title: "1.1 Natürliche Zahlen ohne Ende",
  subtitle: "Menge ℕ, Nachfolger und Vorgänger, große Zahlen",
  whyItMatters:
    "Du kennst aus der Grundschule Zahlen bis zur Million. Jetzt siehst du, warum es nach oben keine Grenze gibt.",
  explanationHtml: `<p>Mit den Zahlen 1, 2, 3, 4, … zählst du. Sie heißen <strong>natürliche Zahlen</strong> und bilden die Menge ℕ = {1; 2; 3; …}. Nimmst du die Null dazu, schreibst du ℕ₀ = {0; 1; 2; 3; …}.</p><p>Jede natürliche Zahl hat einen <strong>Nachfolger</strong>: die Zahl, die um 1 größer ist. Darum kann es keine größte natürliche Zahl geben. Würde jemand eine „größte Zahl“ nennen, wäre ihr Nachfolger noch größer. Jede natürliche Zahl außer der 1 hat auch einen <strong>Vorgänger</strong> in ℕ.</p><div class="example">Der Nachfolger von 999.999 ist 1.000.000 (eine Million). Der Vorgänger von 1.000.000.000 (einer Milliarde) ist 999.999.999. Nach der Milliarde kommen Billion und Billiarde, und es geht immer weiter.</div><div class="merke"><strong>Merke:</strong> Nachfolger = Zahl + 1, Vorgänger = Zahl − 1. Die Menge der natürlichen Zahlen hat kein größtes Element.</div>`,
  formulas: [
    { name: "Natürliche Zahlen", html: "ℕ = {1; 2; 3; …}, ℕ₀ = {0; 1; 2; 3; …}", quantities: "Die drei Punkte bedeuten: Es geht ohne Ende weiter." },
    { name: "Große Zahlen", html: "1 Million = 1.000.000, 1 Milliarde = 1.000.000.000, 1 Billion = 1.000.000.000.000", quantities: "Eine Stufe weiter bedeutet: 1.000-mal so groß." },
  ],
  quiz: {
    question: "Warum gibt es keine größte natürliche Zahl?",
    options: [
      "Zu jeder Zahl gibt es einen Nachfolger, der um 1 größer ist.",
      "Große Zahlen kann man nicht mehr aufschreiben.",
      "Nach einer Billion hören die natürlichen Zahlen auf.",
    ],
    correctIndex: 0,
    explanation: "Egal welche Zahl du nennst: Addierst du 1, hast du eine größere natürliche Zahl.",
  },
  lab: lab(
    "successor",
    "Immer noch eine größer",
    "Wähle eine Ziffer und die Anzahl der Nullen. Du siehst die Zahl mit Vorgänger und Nachfolger.",
    [r("digit", "Erste Ziffer", 1, 9, 2), r("exp", "Anzahl der Nullen", 0, 12, 3)],
    [
      o("zahl", "Zahl", (v) => n0(v.digit * 10 ** v.exp)),
      o("vor", "Vorgänger", (v) => n0(v.digit * 10 ** v.exp - 1)),
      o("nach", "Nachfolger", (v) => n0(v.digit * 10 ** v.exp + 1)),
    ],
    [
      { id: "million", text: "Stelle eine Million ein: eine 1 mit sechs Nullen.", check: (v) => v.digit === 1 && v.exp === 6 },
      { id: "milliarden", text: "Stelle 5 Milliarden ein: eine 5 mit neun Nullen.", check: (v) => v.digit === 5 && v.exp === 9 },
      { id: "groesste", text: "Stelle die größte Zahl dieses Labors ein. Ihr Nachfolger zeigt: Es geht trotzdem weiter.", check: (v) => v.digit === 9 && v.exp === 12 },
    ],
  ),
  exercises: [
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
          `Eine Anzeigetafel zählt Besucher und zeigt gerade ${n0(n)}. Welche Zahl stand dort direkt ${askNext ? "danach, wenn noch eine Person dazukommt" : "davor, bevor die letzte Person kam"}?`,
          [num(`${word}:`, answer, "", 0, { slips: [{ value: askNext ? n - 1 : n + 1, hint: askNext ? "Das ist der Vorgänger. Der Nachfolger ist um 1 größer." : "Das ist der Nachfolger. Der Vorgänger ist um 1 kleiner." }] })],
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
            num("Größte Zahl:", largest, "", 0, { slips: [{ value: 10 ** digits, hint: `Das ist schon der Nachfolger und hat ${digits + 1} Stellen. Die größte Zahl mit ${digits} Stellen besteht nur aus Neunen.` }] }),
            ...(level === 2 ? [num("Stellen des Nachfolgers:", digits + 1, "", 0)] : []),
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

const stufenzahlen = makeLesson(1, 2, 1, {
  id: "nz-2-stufenzahlen",
  title: "1.2 Stufenzahlen und Stellenwerte",
  subtitle: "Das Dezimalsystem als Stellenwertsystem",
  whyItMatters:
    "Dieselbe Ziffer kann 3 oder 3.000 bedeuten. Es kommt nur darauf an, wo sie steht.",
  explanationHtml: `<p>Die Zahlen 1, 10, 100, 1.000, 10.000, … heißen <strong>Stufenzahlen</strong>. Jede ist 10-mal so groß wie die vorige. Darum heißt unser System <strong>Dezimalsystem</strong> oder Zehnersystem: Zehn Einheiten einer Stufe ergeben eine Einheit der nächsten Stufe.</p><p>Es ist ein <strong>Stellenwertsystem</strong>: Der Wert einer Ziffer hängt von ihrer Stelle ab. Mit den zehn Ziffern 0 bis 9 kannst du jede Zahl schreiben. Die Null hält eine leere Stelle frei.</p><div class="example">407.050 = 4 · 100.000 + 7 · 1.000 + 5 · 10. In der Stellenwerttafel steht: 4 HT, 0 ZT, 7 T, 0 H, 5 Z, 0 E.</div><div class="merke"><strong>Merke:</strong> Eine Stelle weiter links ist die Ziffer 10-mal so viel wert. Die Ziffer 0 zeigt: An dieser Stelle ist nichts.</div>`,
  formulas: [
    { name: "Stufenzahlen", html: "1, 10, 100, 1.000, 10.000, 100.000, 1.000.000, …", quantities: "E Einer, Z Zehner, H Hunderter, T Tausender, ZT Zehntausender, HT Hunderttausender, M Million" },
    { name: "Zerlegen", html: "3.052 = 3 · 1.000 + 5 · 10 + 2 · 1", quantities: "Ziffer mal Stufenzahl" },
  ],
  quiz: {
    question: "Welchen Wert hat die Ziffer 6 in der Zahl 460.218?",
    options: ["60.000", "6.000", "600.000"],
    correctIndex: 0,
    explanation: "Die 6 steht an der Zehntausenderstelle: 6 · 10.000 = 60.000.",
  },
  lab: lab(
    "place-value",
    "Stellenwerttafel",
    "Ziehe die Punkte hoch oder runter und baue Zahlen. Achte darauf, welche Stellen frei bleiben.",
    [r("ht", "Hunderttausender", 0, 9, 1), r("zt", "Zehntausender", 0, 9, 2), r("t", "Tausender", 0, 9, 3), r("h", "Hunderter", 0, 9, 4), r("z", "Zehner", 0, 9, 5), r("e", "Einer", 0, 9, 6)],
    [
      o("zahl", "Zahl", (v) => n0(v.ht * 1e5 + v.zt * 1e4 + v.t * 1e3 + v.h * 100 + v.z * 10 + v.e)),
      o("zerlegung", "Zerlegung", (v) =>
        [[v.ht, 1e5], [v.zt, 1e4], [v.t, 1e3], [v.h, 100], [v.z, 10], [v.e, 1]]
          .filter(([d]) => d > 0)
          .map(([d, s]) => `${d} · ${n0(s)}`)
          .join(" + ") || "0"),
    ],
    [
      { id: "nullen", text: "Baue die Zahl 407.050.", check: (v) => v.ht === 4 && v.zt === 0 && v.t === 7 && v.h === 0 && v.z === 5 && v.e === 0 },
      { id: "stufenzahl", text: "Baue die Stufenzahl 100.000.", check: (v) => v.ht === 1 && v.zt + v.t + v.h + v.z + v.e === 0 },
      { id: "dreitausend", text: "Baue die Zahl, in der nur eine 3 steht und diese den Wert 3.000 hat.", check: (v) => v.t === 3 && v.ht + v.zt + v.h + v.z + v.e === 0 },
    ],
  ),
  exercises: [
    {
      id: "stelle-wert",
      make: (rng, level) => {
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6);
        const number = digits.reduce((sum, d) => sum * 10 + d, 0);
        const place = rng.int(0, level === 1 ? 5 : 4);
        const names = ["Hunderttausender", "Zehntausender", "Tausender", "Hunderter", "Zehner", "Einer"];
        const value = digits[place] * 10 ** (5 - place);
        return task(
          level,
          `Welchen Wert hat die Ziffer an der ${names[place]}stelle von ${n0(number)}?`,
          `Mia sagt: „In ${n0(number)} ist die ${digits[place]} genau ${digits[place]} wert.“ Das stimmt nicht. Gib den richtigen Wert der Ziffer ${digits[place]} an.`,
          [num("Wert:", value, "", 0, { slips: place < 5 ? [{ value: digits[place], hint: "Das ist nur die Ziffer. Multipliziere sie noch mit ihrer Stufenzahl." }] : [] })],
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
        const a = rng.int(1, 9), b = rng.int(1, 9), d = rng.int(1, 9);
        const number = level === 1 ? a * 1000 + b * 100 + d : a * 100000 + b * 1000 + d * 10;
        const text = level === 1 ? `${a} · 1.000 + ${b} · 100 + ${d} · 1` : `${d} · 10 + ${a} · 100.000 + ${b} · 1.000`;
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

const zahlenstrahl = makeLesson(1, 3, 1, {
  id: "nz-3-zahlenstrahl",
  title: "1.3 Zahlenstrahl und Größenvergleich",
  subtitle: "Ablesen, anordnen und passend einteilen",
  whyItMatters:
    "Am Zahlenstrahl siehst du sofort, welche Zahl größer ist und wie weit zwei Zahlen auseinanderliegen.",
  explanationHtml: `<p>Auf dem <strong>Zahlenstrahl</strong> stehen die Zahlen geordnet: Je weiter rechts eine Zahl steht, desto größer ist sie. Das schreibst du mit den Zeichen <strong>&lt;</strong> (kleiner als) und <strong>&gt;</strong> (größer als).</p><p>Vor dem Ablesen klärst du die <strong>Skalierung</strong>: Wie viel bedeutet ein Teilstrich? Willst du selbst Zahlen eintragen, wählst du die Einteilung so, dass alle Zahlen auf den Strahl passen und du sie gut unterscheiden kannst.</p><div class="example">Zwischen 0 und 100 liegen 5 gleiche Abschnitte. Ein Abschnitt ist 100 : 5 = 20 wert. Der dritte Strich zeigt also 60. Weil 60 links von 80 liegt, gilt 60 &lt; 80.</div><div class="merke"><strong>Merke:</strong> Erst den Wert eines Teilstrichs bestimmen, dann ablesen. Die Spitze von &lt; und &gt; zeigt immer zur kleineren Zahl.</div>`,
  formulas: [
    { name: "Wert eines Teilstrichs", html: "Abstand zweier beschrifteter Zahlen : Anzahl der Abschnitte", quantities: "Zuerst zählen, dann teilen" },
    { name: "Vergleichszeichen", html: "3 &lt; 5 und 5 &gt; 3", quantities: "< bedeutet kleiner als, > bedeutet größer als" },
  ],
  quiz: {
    question: "Du sollst 1.200, 3.500 und 4.800 eintragen. Welche Einteilung passt am besten?",
    options: ["Ein Strich bedeutet 100.", "Ein Strich bedeutet 1.", "Ein Strich bedeutet 100.000."],
    correctIndex: 0,
    explanation: "Mit 100 pro Strich reichen 50 Striche. Mit 1 pro Strich wäre der Strahl viel zu lang, mit 100.000 lägen alle Zahlen fast auf einem Punkt.",
  },
  lab: lab(
    "number-ray",
    "Zahlenstrahl einteilen",
    "Wähle, was ein Teilstrich bedeutet, und ziehe den Punkt. Rechts stehen immer die größeren Zahlen.",
    [c("scale", "Ein Teilstrich", ["1", "10", "100", "1.000"]), r("k", "Teilstrich Nummer", 0, 20, 5)],
    [
      o("wert", "Wert des Punktes", (v) => n0(v.k * [1, 10, 100, 1000][v.scale])),
      o("vergleich", "Vergleich mit 1.000", (v) => {
        const value = v.k * [1, 10, 100, 1000][v.scale];
        return value < 1000 ? "kleiner als 1.000" : value > 1000 ? "größer als 1.000" : "genau 1.000";
      }),
    ],
    [
      { id: "siebzig", text: "Markiere 70 mit der Einteilung 10.", check: (v) => v.scale === 1 && v.k === 7 },
      { id: "tausend", text: "Markiere 1.300 mit der Einteilung 100. Die Zahl ist größer als 1.000.", check: (v) => v.scale === 2 && v.k === 13 },
      { id: "gross", text: "Markiere 16.000 mit der passenden Einteilung.", check: (v) => v.scale === 3 && v.k === 16 },
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
          [num("Zahl:", k * step, level === 1 ? "" : "mm", 0, { slips: [{ value: k, hint: "Das ist die Nummer des Strichs. Multipliziere sie mit dem Wert eines Abschnitts." }] })],
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

const runden = makeLesson(1, 4, 1, {
  id: "nz-4-runden",
  title: "1.4 Runden",
  subtitle: "Auf eine Stelle runden und begründen, wann es sinnvoll ist",
  whyItMatters:
    "„Etwa 80.000 Fans“ merkt man sich leichter als 79.846. Beim Eintrittsgeld darf aber niemand runden.",
  explanationHtml: `<p>Beim <strong>Runden</strong> ersetzt du eine Zahl durch eine benachbarte runde Zahl. Entscheidend ist die Ziffer <strong>rechts neben</strong> der Stelle, auf die du rundest: Bei 0, 1, 2, 3 oder 4 rundest du <strong>ab</strong>, bei 5, 6, 7, 8 oder 9 rundest du <strong>auf</strong>. Das Zeichen ≈ bedeutet „ungefähr gleich“.</p><p>Runden ist sinnvoll, wenn es auf den genauen Wert nicht ankommt: Einwohnerzahlen, Entfernungen, Überschläge. Genau bleiben musst du bei Rechnungen, Telefonnummern oder Medikamenten. Manchmal zwingt dich die Sache auch: Für 23 Personen reichen zwei Tische zu je 10 Plätzen nicht, du brauchst drei.</p><div class="example">79.846 auf Tausender: rechts neben der 9 steht die 8, also aufrunden. 79.846 ≈ 80.000. Auf Hunderter: rechts neben der 8 steht die 4, also abrunden. 79.846 ≈ 79.800.</div><div class="merke"><strong>Merke:</strong> 0 bis 4 abrunden, 5 bis 9 aufrunden. Die Ziffer rechts neben der Rundungsstelle entscheidet.</div>`,
  formulas: [
    { name: "Rundungsregel", html: "0, 1, 2, 3, 4 → abrunden; 5, 6, 7, 8, 9 → aufrunden", quantities: "Die Ziffer rechts neben der Rundungsstelle entscheidet." },
    { name: "Ungefähr gleich", html: "4.738 ≈ 4.700", quantities: "≈ steht beim gerundeten Ergebnis" },
  ],
  quiz: {
    question: "Wie lautet 3.495 auf Hunderter gerundet?",
    options: ["3.500", "3.400", "3.000"],
    correctIndex: 0,
    explanation: "Rechts neben der Hunderterstelle steht die 9, also wird aufgerundet. Aus 34 Hundertern werden 35.",
  },
  lab: lab(
    "rounding",
    "Runden am Zahlenstrahl",
    "Ziehe die Zahl. Die Mitte zwischen den beiden runden Nachbarn entscheidet, in welche Richtung gerundet wird.",
    [c("place", "Runden auf", ["Zehner", "Hunderter", "Tausender"], 1), r("n", "Zahl", 1000, 5000, 1234)],
    [
      o("gerundet", "Gerundet", (v) => n0(roundTo(v.n, [10, 100, 1000][v.place]))),
      o("richtung", "Richtung", (v) => {
        const place = [10, 100, 1000][v.place];
        const rounded = roundTo(v.n, place);
        return rounded === v.n ? "schon rund" : rounded > v.n ? "aufrunden" : "abrunden";
      }),
    ],
    [
      { id: "mitte", text: "Runde 2.650 auf Hunderter. Genau in der Mitte wird aufgerundet.", check: (v) => v.place === 1 && v.n === 2650 },
      { id: "knapp", text: "Runde 3.499 auf Tausender. Knapp vor der Mitte wird abgerundet.", check: (v) => v.place === 2 && v.n === 3499 },
      { id: "kette", text: "Runde 4.995 auf Zehner. Das Ergebnis ist 5.000.", check: (v) => v.place === 0 && v.n === 4995 },
    ],
  ),
  exercises: [
    {
      id: "runden-stelle",
      make: (rng, level) => {
        const n = level === 1 ? rng.int(1000, 99999) : rng.int(1000000, 99999999);
        const places = level === 1 ? [10, 100, 1000] : [1000, 10000, 100000];
        const place = rng.pick(places);
        const name = { 10: "Zehner", 100: "Hunderter", 1000: "Tausender", 10000: "Zehntausender", 100000: "Hunderttausender" }[place];
        const rounded = roundTo(n, place);
        const down = Math.floor(n / place) * place;
        const up = down + place;
        const other = rounded === down ? up : down;
        return task(
          level,
          `Runde die Zahl ${n0(n)} auf ${name} und schreibe das Ergebnis auf.`,
          `Ein Land hat ${n0(n)} Einwohner. Eine Zeitung nennt die Zahl in ganzen ${name}n. Welche Zahl druckt sie?`,
          [num("Gerundet:", rounded, "", 0, { slips: [{ value: other, hint: "Du hast in die falsche Richtung gerundet. Schau auf die Ziffer rechts neben der Rundungsstelle." }] })],
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
          ["die Zuschauerzahl eines Fußballspiels in einem Zeitungsartikel", true],
          ["die Einwohnerzahl von Bayern in einem Vortrag", true],
          ["die Entfernung von München nach Hamburg beim Planen einer Reise", true],
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
            ? [pick("Runden ist hier …", ["sinnvoll", "nicht sinnvoll"], sensible ? 0 : 1)]
            : [num("Tische:", tables, "", 0, { slips: persons % 10 > 0 && persons % 10 < 5 ? [{ value: tables - 1, hint: `Dann hätten ${persons % 10} Personen keinen Platz. Hier musst du aufrunden.` }] : [] })],
          "Frage dich: Schadet ein ungenauer Wert hier?",
          level === 1 ? (sensible ? "Hier kommt es nur auf die ungefähre Größe an." : "Hier muss der Wert genau stimmen.") : `${persons} : ${seats} ergibt ${Math.floor(persons / seats)} Rest ${persons % seats}. Auch die restlichen Personen brauchen einen Platz.`,
          level === 1 ? (sensible ? "Runden ist sinnvoll." : "Runden ist nicht sinnvoll.") : `Ihr braucht ${tables} Tische.`,
          { persons },
        );
      },
    },
  ],
});

const dualsystem = makeLesson(1, 5, 2, {
  id: "nz-5-dualsystem",
  title: "1.5 Das Dualsystem",
  subtitle: "Zahlen mit nur zwei Ziffern schreiben",
  whyItMatters:
    "Computer speichern alles mit zwei Zuständen: Strom an oder aus. Darum rechnen sie im Dualsystem.",
  explanationHtml: `<p>Das <strong>Dualsystem</strong> ist auch ein Stellenwertsystem, hat aber nur die Ziffern <strong>0</strong> und <strong>1</strong>. Jede Stelle ist doppelt so viel wert wie die rechts daneben: 1, 2, 4, 8, 16, 32, …</p><p><strong>Vom Dualsystem ins Dezimalsystem:</strong> Addiere die Werte der Stellen, an denen eine 1 steht. <strong>Vom Dezimalsystem ins Dualsystem:</strong> Nimm von links die größte passende Zweierstufe, ziehe sie ab und mache mit dem Rest weiter.</p><div class="example">1101 im Dualsystem = 8 + 4 + 0 + 1 = 13. Umgekehrt: 13 = 8 + 4 + 1, also 1101. Nachteil: Die Zahlen werden lang. 1.000 braucht zehn Stellen. Vorteil: Ein Gerät muss nur zwei Zustände unterscheiden.</div><div class="merke"><strong>Merke:</strong> Stellenwerte im Dualsystem: …, 32, 16, 8, 4, 2, 1. Du addierst nur dort, wo eine 1 steht.</div>`,
  formulas: [
    { name: "Stellenwerte", html: "1, 2, 4, 8, 16, 32, 64, …", quantities: "Jeder Wert ist das Doppelte des vorigen." },
    { name: "Umrechnen", html: "10110 = 16 + 4 + 2 = 22", quantities: "Nur die Stellen mit der Ziffer 1 zählen." },
  ],
  quiz: {
    question: "Welche Zahl im Dezimalsystem ist die Dualzahl 1010?",
    options: ["10", "1.010", "5"],
    correctIndex: 0,
    explanation: "Die Einsen stehen an den Stellen 8 und 2: 8 + 2 = 10.",
  },
  lab: lab(
    "binary",
    "Sechs Schalter",
    "Schalte die Stellen an oder aus. Eine 1 zählt ihren Stellenwert, eine 0 nichts.",
    [r("b5", "Stelle 32", 0, 1, 0), r("b4", "Stelle 16", 0, 1, 0), r("b3", "Stelle 8", 0, 1, 0), r("b2", "Stelle 4", 0, 1, 1), r("b1", "Stelle 2", 0, 1, 0), r("b0", "Stelle 1", 0, 1, 1)],
    [
      o("dual", "Dualzahl", (v) => [v.b5, v.b4, v.b3, v.b2, v.b1, v.b0].join("").replace(/^0+(?=.)/, "")),
      o("dezimal", "Dezimalzahl", (v) => 32 * v.b5 + 16 * v.b4 + 8 * v.b3 + 4 * v.b2 + 2 * v.b1 + v.b0),
    ],
    [
      { id: "dreizehn", text: "Stelle die Dezimalzahl 13 ein.", check: (_, r) => r.dezimal === 13 },
      { id: "zweiunddreissig", text: "Stelle 32 ein. Dafür reicht eine einzige 1.", check: (_, r) => r.dezimal === 32 },
      { id: "alle", text: "Stelle die größte Zahl ein, die mit sechs Stellen möglich ist.", check: (_, r) => r.dezimal === 63 },
    ],
  ),
  exercises: [
    {
      id: "dual-zu-dezimal",
      make: (rng, level) => {
        const n = level === 1 ? rng.int(5, 31) : rng.int(33, 127);
        return task(
          level,
          `Rechne die Dualzahl ${dual(n)} ins Dezimalsystem um.`,
          `Ein Rechner speichert die Anzahl der gefundenen Dateien als ${dual(n)}. Wie viele Dateien sind das?`,
          [num("Dezimalzahl:", n, "", 0)],
          "Stellenwerte von rechts: 1, 2, 4, 8, 16, 32, 64",
          `Addiere die Stellenwerte unter den Einsen von ${dual(n)}.`,
          `${dual(n)} bedeutet ${n}.`,
          { n },
        );
      },
    },
    {
      id: "dezimal-zu-dual",
      make: (rng, level) => {
        const n = level === 1 ? rng.int(5, 15) : rng.int(17, 62);
        const right = dual(n);
        const flip = (text: string, at: number) => text.slice(0, at) + (text[at] === "1" ? "0" : "1") + text.slice(at + 1);
        const wrong = [...new Set([flip(right, right.length - 1), flip(right, 1), `${right}0`])].filter((w) => w !== right).slice(0, 2);
        return task(
          level,
          `Welche Dualzahl gehört zur Dezimalzahl ${n}?`,
          `Du sollst die Hausnummer ${n} als Lichtsignal mit an und aus senden. Welche Dualzahl sendest du?`,
          [pick("Dualzahl:", [right, ...wrong], 0)],
          "Nimm immer die größte Zweierstufe, die noch in die Zahl passt.",
          `Zerlege ${n} in Zweierstufen und schreibe an diese Stellen eine 1.`,
          `${n} ist im Dualsystem ${right}.`,
          { n },
        );
      },
    },
  ],
});

const roemisch = makeLesson(1, 6, 2, {
  id: "nz-6-roemisch",
  title: "1.6 Römische Zahlen",
  subtitle: "Ein Zahlensystem ohne Stellenwerte, Vor- und Nachteile",
  whyItMatters:
    "Römische Zahlen findest du auf Uhren, an alten Gebäuden und hinter Königsnamen. Sie zeigen auch, warum das Dezimalsystem so praktisch ist.",
  explanationHtml: `<p>Die Römer nutzten sieben Zeichen: <strong>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1.000</strong>. Die Werte werden addiert. Steht ein kleineres Zeichen <strong>vor</strong> einem größeren, wird es abgezogen: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900.</p><p>I, X, C und M stehen höchstens dreimal hintereinander, V, L und D nur einmal. Der Wert eines Zeichens hängt nicht von seiner Stelle ab. Darum ist das schriftliche Rechnen mühsam, und eine Null gibt es gar nicht. Das Dezimalsystem kommt dagegen mit zehn Ziffern aus und erlaubt einfache Rechenverfahren. Römische Zahlen wirken dafür feierlich und sind in Inschriften gut zu meißeln.</p><div class="example">MCMXCIV = 1.000 + 900 + 90 + 4 = 1.994. Umgekehrt: 49 = 40 + 9 = XLIX.</div><div class="merke"><strong>Merke:</strong> Größere Zeichen zuerst, dann addieren. Ein kleineres Zeichen davor zieht ab.</div>`,
  formulas: [
    { name: "Zeichen", html: "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1.000", quantities: "Es gibt kein Zeichen für die Null." },
    { name: "Abziehen", html: "IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900", quantities: "Nur diese sechs Paare" },
  ],
  quiz: {
    question: "Wie schreibst du 14 mit römischen Zeichen?",
    options: ["XIV", "XIIII", "IVX"],
    correctIndex: 0,
    explanation: "14 = 10 + 4, also X und IV. Das Zeichen I steht höchstens dreimal hintereinander.",
  },
  lab: lab(
    "roman",
    "Zeichen zerlegen",
    "Ziehe die Zahl. Du siehst, aus welchen Zeichen sie besteht. Orange Felder sind Paare, bei denen abgezogen wird.",
    [r("n", "Zahl", 1, 2000, 8)],
    [
      o("roemisch", "Römisch", (v) => roman(v.n)),
      o("zeichen", "Anzahl der Zeichen", (v) => roman(v.n).length),
      o("stellen", "Stellen im Dezimalsystem", (v) => String(v.n).length),
    ],
    [
      { id: "vierzehn", text: "Stelle 14 ein: XIV.", check: (v) => v.n === 14 },
      { id: "lang", text: "Stelle 49 ein. Zwei Abzieh-Paare stehen hintereinander.", check: (v) => v.n === 49 },
      { id: "jedes", text: "Stelle 1.666 ein. Jedes Zeichen kommt genau einmal vor.", check: (v) => v.n === 1666 },
    ],
  ),
  exercises: [
    {
      id: "roemisch-zu-dezimal",
      make: (rng, level) => {
        const n = level === 1 ? rng.int(11, 99) : rng.int(1100, 1999);
        return task(
          level,
          `Welche Zahl im Dezimalsystem ist ${roman(n)}?`,
          `Über dem Tor einer Kirche steht das Baujahr ${roman(n)}. In welchem Jahr wurde sie gebaut?`,
          [num("Zahl:", n, "", 0)],
          "Addieren; ein kleineres Zeichen vor einem größeren wird abgezogen.",
          `Lies ${roman(n)} von links und achte auf die Abzieh-Paare.`,
          `${roman(n)} = ${n0(n)}`,
          { n },
        );
      },
    },
    {
      id: "dezimal-zu-roemisch",
      make: (rng, level) => {
        const n = level === 1 ? rng.pick([4, 9, 14, 19, 24, 29, 40, 44, 90]) : rng.pick([49, 94, 99, 140, 199, 444, 490, 999]);
        const right = roman(n);
        const naive = n % 10 === 4 ? `${roman(n - 4)}IIII` : n % 10 === 9 ? `${roman(n - 9)}VIIII` : `${roman(n)}I`;
        return task(
          level,
          `Wie schreibst du die Zahl ${n} mit römischen Zeichen?`,
          `Ein Band einer Reihe soll die Nummer ${n} in römischen Zeichen tragen. Welche Schreibweise ist richtig?`,
          [pick("Römisch:", [right, naive, `${right}X`], 0)],
          "Zerlege in Tausender, Hunderter, Zehner und Einer.",
          `Schreibe jeden Teil von ${n} einzeln und setze die Teile zusammen.`,
          `${n} = ${right}`,
          { n },
        );
      },
    },
    {
      id: "vor-nachteile",
      make: (rng, level) => {
        const statements = [
          ["Das Dezimalsystem hat eine Null und Stellenwerte, darum kann man schriftlich rechnen.", "Das Dualsystem kommt mit weniger Stellen aus als das Dezimalsystem.", "Römische Zahlen sind beim schriftlichen Rechnen am einfachsten."],
          ["Das Dualsystem braucht nur zwei Zustände, darum passt es gut zu Computern.", "Im Dualsystem sind Zahlen besonders kurz und gut lesbar.", "Römische Zahlen haben ein eigenes Zeichen für die Null."],
          ["Römische Zahlen wirken feierlich, sind aber zum Rechnen unpraktisch.", "Im römischen System hängt der Wert jedes Zeichens von seiner Stelle ab, wie im Dezimalsystem.", "Das Dezimalsystem braucht für große Zahlen mehr Stellen als das Dualsystem."],
        ];
        const [right, ...wrong] = rng.pick(statements);
        const n = rng.pick([100, 500, 1000, 2000, 5000]);
        const dualLength = dual(n).length;
        return task(
          level,
          "Welche Aussage über die Zahlensysteme stimmt, und was ist an den anderen falsch?",
          `Die Zahl ${n0(n)} hat im Dezimalsystem ${String(n).length} Stellen. Wie viele Stellen hat sie im Dualsystem? Welche Folgerung ist richtig?`,
          level === 1
            ? [pick("Richtig ist:", [right, ...wrong], 0)]
            : [
                num("Stellen:", dualLength, "", 0),
                pick("Folgerung:", ["Dualzahlen werden lang, sind für Menschen also unübersichtlicher.", "Dualzahlen sind kürzer, also für Menschen übersichtlicher.", "Beide Systeme brauchen immer gleich viele Stellen."], 0),
              ],
          "Denke an Stellenwerte, die Null und die Länge der Zahlen.",
          level === 1 ? right : `${n0(n)} im Dualsystem ist ${dual(n)}.`,
          level === 1 ? right : `${dualLength} Stellen im Dualsystem`,
          { n },
        );
      },
    },
  ],
});

const addSub = makeLesson(1, 7, 3, {
  id: "nz-7-addieren-subtrahieren",
  title: "1.7 Schriftlich addieren und subtrahieren",
  subtitle: "Summe und Differenz, Übertrag und Entbündeln",
  whyItMatters:
    "Die schriftlichen Verfahren kennst du aus der Grundschule. Jetzt sollen sie auch bei großen Zahlen sicher sitzen, und du benennst ihre Teile.",
  explanationHtml: `<p>In einer <strong>Summe</strong> werden Summanden addiert: 1. Summand + 2. Summand = Wert der Summe. In einer <strong>Differenz</strong> gilt: Minuend − Subtrahend = Wert der Differenz.</p><p>Schreibe die Zahlen stellengenau untereinander und rechne von rechts. Beim <strong>Addieren</strong> trägst du einen vollen Zehner als Übertrag in die nächste Spalte. Beim <strong>Subtrahieren</strong> nutzt du das Abziehverfahren: Reicht die obere Ziffer nicht, <strong>entbündelst</strong> du einen Einer der nächsten Stelle zu zehn Einheiten.</p><div class="example">503 − 178: 3 − 8 geht nicht. Die Zehnerstelle ist 0, also entbündelst du aus den Hundertern: 503 = 4 H + 9 Z + 13 E. Dann 13 − 8 = 5, 9 − 7 = 2, 4 − 1 = 3. Ergebnis 325. Probe: 325 + 178 = 503.</div><div class="merke"><strong>Merke:</strong> Stellengenau untereinander schreiben, von rechts rechnen. Die Probe zur Subtraktion ist eine Addition.</div>`,
  formulas: [
    { name: "Summe", html: "Summand + Summand = Wert der Summe", quantities: "Beide Summanden darfst du vertauschen." },
    { name: "Differenz", html: "Minuend − Subtrahend = Wert der Differenz", quantities: "Minuend und Subtrahend darfst du nicht vertauschen." },
  ],
  quiz: {
    question: "Wie heißt die 178 in der Rechnung 503 − 178?",
    options: ["Subtrahend", "Minuend", "Summand"],
    correctIndex: 0,
    explanation: "Die Zahl, die abgezogen wird, heißt Subtrahend. 503 ist der Minuend.",
  },
  lab: lab(
    "written-calc",
    "Rechnen in Spalten",
    "Stelle zwei Zahlen und die Rechenart ein. Du siehst, wo ein Übertrag entsteht oder wo entbündelt werden muss.",
    [c("op", "Rechenart", ["Addition", "Subtraktion"]), r("a", "Erste Zahl", 100, 999, 423), r("b", "Zweite Zahl", 100, 999, 152)],
    [
      o("ergebnis", "Ergebnis", (v) => (v.op === 0 ? n0(v.a + v.b) : v.a >= v.b ? n0(v.a - v.b) : "keine natürliche Zahl")),
      o("marken", "Überträge oder Entbündelungen", (v) => (v.op === 0 ? carries(v.a, v.b) : v.a >= v.b ? borrows(v.a, v.b) : []).reduce((sum: number, m: number) => sum + m, 0)),
    ],
    [
      { id: "drei", text: "Finde eine Addition mit drei Überträgen.", check: (v, r) => v.op === 0 && r.marken === 3 },
      { id: "zwei", text: "Finde eine Subtraktion, bei der zweimal entbündelt wird.", check: (v, r) => v.op === 1 && r.marken === 2 },
      { id: "tausend", text: "Finde eine Addition mit der Summe 1.000.", check: (v) => v.op === 0 && v.a + v.b === 1000 },
    ],
  ),
  exercises: [
    {
      id: "schriftlich-plus-minus",
      make: (rng, level) => {
        const a = level === 1 ? rng.int(1200, 8999) : rng.int(120000, 899999);
        const b = level === 1 ? rng.int(1200, a - 1 > 1200 ? a - 1 : 1200) : rng.int(12000, a - 1);
        const plus = rng.int(0, 1) === 0;
        const value = plus ? a + b : a - b;
        return task(
          level,
          `Berechne schriftlich: ${n0(a)} ${plus ? "+" : "−"} ${n0(b)}.`,
          `Ein Verein hat ${n0(a)} € auf dem Konto. ${plus ? `Durch ein Sommerfest kommen ${n0(b)} € dazu.` : `Für ein neues Vereinsheim gibt er ${n0(b)} € aus.`} Wie viel Geld hat er dann?`,
          [num(plus ? "Wert der Summe:" : "Wert der Differenz:", value, level === 1 ? "" : "€", 0, { slips: [{ value: plus ? a - b : a + b, hint: "Prüfe die Rechenart noch einmal." }] })],
          plus ? "Stellengenau untereinander, von rechts, Übertrag beachten." : "Stellengenau untereinander, von rechts, wenn nötig entbündeln.",
          plus ? `Probe durch Überschlag: ${n0(roundTo(a, 1000))} + ${n0(roundTo(b, 1000))}.` : `Probe: ${n0(value)} + ${n0(b)} = ${n0(a)}.`,
          `Ergebnis: ${n0(value)}`,
          { a, b },
        );
      },
    },
    {
      id: "fachbegriffe",
      make: (rng, level) => {
        const a = rng.int(300, 900), b = rng.int(20, 280);
        const ask = rng.int(0, 2);
        const value = a - b;
        if (level === 2) {
          return task(
            level,
            "",
            `Der Minuend ist ${n0(a)}. Der Wert der Differenz ist ${n0(value)}. Wie groß ist der Subtrahend?`,
            [num("Subtrahend:", b, "", 0, { slips: [{ value: a + value, hint: "Du hast addiert. Der Subtrahend ist Minuend minus Wert der Differenz." }] })],
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
          [pick("Fachbegriff:", [terms[ask], ...terms.filter((_, i) => i !== ask)], 0)],
          "Minuend − Subtrahend = Wert der Differenz",
          "Der Minuend steht zuerst. Der Subtrahend wird abgezogen.",
          `${shown[ask]} ist hier: ${terms[ask]}.`,
          { a, b },
        );
      },
    },
  ],
});

const multDiv = makeLesson(1, 8, 3, {
  id: "nz-8-multiplizieren-dividieren",
  title: "1.8 Schriftlich multiplizieren und dividieren",
  subtitle: "Produkt und Quotient, auch mit Rest",
  whyItMatters:
    "Mit diesen beiden Verfahren löst du später fast jede Sachaufgabe, auch wenn gerade kein Taschenrechner dabei ist.",
  explanationHtml: `<p>Im <strong>Produkt</strong> gilt: Faktor · Faktor = Wert des Produkts. Im <strong>Quotienten</strong> gilt: Dividend : Divisor = Wert des Quotienten.</p><p><strong>Multiplizieren:</strong> Rechne mit jeder Ziffer des zweiten Faktors einzeln und schreibe die Teilergebnisse stellengenau untereinander, dann addiere. <strong>Dividieren:</strong> Teile von links Stelle für Stelle. Multipliziere zurück, ziehe ab und hole die nächste Ziffer herunter. Bleibt am Ende etwas übrig, ist das der <strong>Rest</strong>.</p><p>Durch 0 darfst du nicht teilen, denn keine Zahl mal 0 ergibt zum Beispiel 5.</p><div class="example">234 · 16 = 234 · 10 + 234 · 6 = 2.340 + 1.404 = 3.744. Und 999 : 8 = 124 Rest 7, denn 124 · 8 = 992 und 992 + 7 = 999.</div><div class="merke"><strong>Merke:</strong> Die Probe zur Division ist die Multiplikation: Quotient · Divisor + Rest = Dividend.</div>`,
  formulas: [
    { name: "Produkt", html: "Faktor · Faktor = Wert des Produkts", quantities: "Faktoren darfst du vertauschen." },
    { name: "Quotient", html: "Dividend : Divisor = Wert des Quotienten", quantities: "Der Divisor darf nicht 0 sein." },
    { name: "Probe", html: "Quotient · Divisor + Rest = Dividend", quantities: "Der Rest ist kleiner als der Divisor." },
  ],
  quiz: {
    question: "Wie groß ist der Rest bei 100 : 7?",
    options: ["2", "14", "7"],
    correctIndex: 0,
    explanation: "14 · 7 = 98, und 100 − 98 = 2. Der Rest muss kleiner als 7 sein.",
  },
  lab: lab(
    "written-mult",
    "Teilergebnisse sehen",
    "Wähle die Rechenart und zwei Zahlen. Die Zeilen zeigen die Teilschritte des schriftlichen Verfahrens.",
    [c("op", "Rechenart", ["Multiplikation", "Division"]), r("a", "Erste Zahl", 100, 999, 234), r("b", "Zweite Zahl", 2, 25, 6)],
    [
      o("ergebnis", "Ergebnis", (v) => (v.op === 0 ? n0(v.a * v.b) : n0(Math.floor(v.a / v.b)))),
      o("rest", "Rest", (v) => (v.op === 0 ? "kein Rest" : v.a % v.b)),
    ],
    [
      { id: "tausend", text: "Finde eine Multiplikation mit dem Ergebnis 1.000.", check: (v) => v.op === 0 && v.a * v.b === 1000 },
      { id: "ohne-rest", text: "Rechne 936 : 12. Die Division geht ohne Rest auf.", check: (v) => v.op === 1 && v.a === 936 && v.b === 12 },
      { id: "rest-sieben", text: "Finde eine Division mit dem Rest 7.", check: (v) => v.op === 1 && v.a % v.b === 7 },
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
          [num("Wert des Produkts:", a * b, "", 0, { slips: [{ value: a * (b % 10), hint: "Du hast nur mit den Einern gerechnet. Multipliziere auch mit den Zehnern." }] })],
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
          [num(level === 1 ? "Wert des Quotienten:" : "Volle Busse:", q, "", 0), ...(level === 2 ? [num("Übrig:", rest, "", 0)] : [])],
          "Von links Stelle für Stelle teilen und zurückmultiplizieren.",
          `Probe: ${n0(q)} · ${b}${rest ? ` + ${rest}` : ""} = ${n0(a)}.`,
          level === 1 ? `${n0(a)} : ${b} = ${n0(q)}` : `${n0(q)} volle Busse, ${rest} Kinder übrig.`,
          { a, b },
        );
      },
    },
  ],
});

const sachaufgaben = makeLesson(1, 9, 3, {
  id: "nz-9-sachaufgaben",
  title: "1.9 Sachaufgaben und Überschlag",
  subtitle: "Rechenwege vergleichen, Ergebnisse prüfen",
  whyItMatters:
    "Eine richtige Rechnung nützt wenig, wenn das Ergebnis gar nicht zur Geschichte passt. Der Überschlag deckt das schnell auf.",
  explanationHtml: `<p>Bei einer <strong>Sachaufgabe</strong> gehst du Schritt für Schritt vor: Lies genau. Notiere, was gegeben und was gesucht ist. Rechne. Antworte in einem Satz. Oft führen <strong>mehrere Rechenwege</strong> zum Ziel. Vergleiche sie: Welcher hat die wenigsten Schritte und die einfachsten Zahlen?</p><p>Prüfe am Ende, ob das Ergebnis <strong>plausibel</strong> ist. Beim <strong>Überschlag</strong> rundest du die Zahlen und rechnest im Kopf. Liegt das genaue Ergebnis weit davon weg, stimmt etwas nicht.</p><div class="example">28 Kinder zahlen je 32 € für die Fahrt. Überschlag: 30 · 30 = 900. Genau: 28 · 32 = 896. Das passt. Ergebnis „8.960 €“ wäre nicht plausibel: Das wären etwa 320 € pro Kind.</div><div class="merke"><strong>Merke:</strong> Gegeben, gesucht, rechnen, Antwortsatz, Überschlag. Ein Ergebnis muss zur Sache passen.</div>`,
  formulas: [
    { name: "Überschlag", html: "28 · 32 ≈ 30 · 30 = 900", quantities: "Runde so, dass du im Kopf rechnen kannst." },
    { name: "Vorgehen", html: "gegeben → gesucht → rechnen → Antwort → prüfen", quantities: "Eine Skizze oder Tabelle hilft beim Ordnen." },
  ],
  quiz: {
    question: "Für einen Ausflug zahlen 24 Kinder je 19 €. Lea rechnet 4.560 € aus. Was sagt der Überschlag?",
    options: [
      "Etwa 20 · 20 = 400 €, also ist das Ergebnis zehnmal zu groß.",
      "Etwa 20 · 20 = 4.000 €, also stimmt es ungefähr.",
      "Ein Überschlag sagt hier nichts aus.",
    ],
    correctIndex: 0,
    explanation: "24 · 19 ist etwa 400. Genau sind es 456 €. Bei 4.560 € ist eine Null zu viel.",
  },
  lab: lab(
    "estimate",
    "Überschlag als Rechteck",
    "Ziehe die Ecke. Das blaue Rechteck zeigt das genaue Produkt, das gestrichelte den Überschlag mit gerundeten Zahlen.",
    [r("n", "Anzahl", 11, 49, 23), r("p", "Preis", 11, 49, 17, 1, "€")],
    [
      o("genau", "Genau", (v) => n0(v.n * v.p), "€"),
      o("ueberschlag", "Überschlag", (v) => n0(roundTo(v.n, 10) * roundTo(v.p, 10)), "€"),
      o("abstand", "Abstand", (v) => n0(Math.abs(v.n * v.p - roundTo(v.n, 10) * roundTo(v.p, 10))), "€"),
    ],
    [
      { id: "beispiel", text: "Stelle das Beispiel ein: 28 Kinder, 32 €.", check: (v) => v.n === 28 && v.p === 32 },
      { id: "gleich", text: "Stelle 40 Kinder und 30 € ein. Überschlag und genauer Wert sind hier gleich.", check: (v) => v.n === 40 && v.p === 30 },
      { id: "weit", text: "Finde Werte, bei denen der Überschlag um mehr als 300 € danebenliegt.", check: (v) => Math.abs(v.n * v.p - roundTo(v.n, 10) * roundTo(v.p, 10)) > 300 },
    ],
  ),
  exercises: [
    {
      id: "mehrschritt",
      make: (rng, level) => {
        const kids = rng.int(21, 32), price = rng.int(12, 19), bus = rng.int(1, 4) * 100;
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
          [num("Gesamt:", rest, "€", 0, { slips: [{ value: each, hint: "Du hast den Bus vergessen." }, { value: (bus + price) * kids, hint: "Der Bus wird nur einmal bezahlt, nicht für jedes Kind." }] })],
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
        const a = rng.int(21, 89), b = rng.int(21, 89);
        const exact = a * b;
        const estimateValue = roundTo(a, 10) * roundTo(b, 10);
        const wrongBy10 = exact * 10;
        const showRight = rng.int(0, 1) === 0;
        const claim = showRight ? exact : wrongBy10;
        return task(
          level,
          `Tom rechnet ${a} · ${b} = ${n0(claim)}. Überschlage: ${roundTo(a, 10)} · ${roundTo(b, 10)}. Kann sein Ergebnis stimmen?`,
          `In einem Bericht steht: „${a} Klassen haben je ${b} Bücher gesammelt, zusammen ${n0(claim)} Bücher.“ Prüfe mit einem Überschlag, ob das plausibel ist.`,
          [pick("Ergebnis ist …", ["plausibel", "nicht plausibel"], showRight ? 0 : 1)],
          "Runde beide Zahlen auf Zehner und rechne im Kopf.",
          `Überschlag: ${roundTo(a, 10)} · ${roundTo(b, 10)} = ${n0(estimateValue)}. Genau: ${n0(exact)}.`,
          showRight ? "Das Ergebnis ist plausibel." : "Das Ergebnis ist etwa zehnmal zu groß, also nicht plausibel.",
          { a, b },
        );
      },
    },
  ],
});

const rechenregeln = makeLesson(1, 10, 3, {
  id: "nz-10-rechenregeln",
  title: "1.10 Rechenregeln",
  subtitle: "Klammer vor Potenz vor Punkt vor Strich",
  whyItMatters:
    "Eine Rechnung muss für alle dasselbe Ergebnis haben. Dafür sorgen feste Regeln für die Reihenfolge.",
  explanationHtml: `<p>In einer Rechnung mit mehreren Rechenarten gilt die Reihenfolge:</p><p><strong>1. Klammern</strong>, <strong>2. Potenzen</strong>, <strong>3. Punktrechnung</strong> (· und :), <strong>4. Strichrechnung</strong> (+ und −). Steht alles auf einer Stufe, rechnest du von links nach rechts.</p><p>Das Ganze heißt <strong>Term</strong>. Die letzte Rechnung gibt dem Term seinen Namen: Bei 3 + 4 · 2 wird zuletzt addiert, also ist es eine Summe.</p><div class="example">5 + 3 · 2² = 5 + 3 · 4 = 5 + 12 = 17. Dagegen (5 + 3) · 2² = 8 · 4 = 32. Und 20 − 6 − 4 = 14 − 4 = 10, von links nach rechts.</div><div class="merke"><strong>Merke:</strong> Klammer vor Potenz vor Punkt vor Strich. Sonst von links nach rechts.</div>`,
  formulas: [
    { name: "Reihenfolge", html: "( ) → Potenz → · und : → + und −", quantities: "Auf gleicher Stufe von links nach rechts" },
  ],
  quiz: {
    question: "Was ergibt 2 + 3 · 4?",
    options: ["14", "20", "24"],
    correctIndex: 0,
    explanation: "Punkt vor Strich: 3 · 4 = 12 und 2 + 12 = 14. 20 wäre stur von links gerechnet.",
  },
  lab: lab(
    "order-of-ops",
    "Schritt für Schritt",
    "Wähle einen Term und drei Zahlen. Du siehst die richtigen Schritte und was bei stur von links herauskäme.",
    [c("term", "Term", ["a + b · c", "(a + b) · c", "a² + b · c"]), r("a", "a", 1, 9, 5), r("b", "b", 1, 9, 1), r("c", "c", 1, 9, 1)],
    [
      o("wert", "Richtiger Wert", (v) => termSteps(v.term, v.a, v.b, v.c).value),
      o("stur", "Stur von links", (v) => termSteps(v.term, v.a, v.b, v.c).wrong),
    ],
    [
      { id: "punkt", text: "Wähle a + b · c und stelle a = 2, b = 3, c = 4 ein. Richtig ist 14, nicht 20.", check: (v) => v.term === 0 && v.a === 2 && v.b === 3 && v.c === 4 },
      { id: "klammer", text: "Wähle die Klammer und erreiche den Wert 20.", check: (v) => v.term === 1 && (v.a + v.b) * v.c === 20 },
      { id: "potenz", text: "Wähle a² + b · c und erreiche den Wert 19.", check: (v) => v.term === 2 && v.a * v.a + v.b * v.c === 19 },
    ],
  ),
  exercises: [
    {
      id: "terme",
      make: (rng, level) => {
        const a = rng.int(2, 9), b = rng.int(2, 9), d = rng.int(2, 9), e = rng.int(2, 5);
        if (level === 1) {
          const value = a + b * d;
          return task(
            level,
            `Berechne in der richtigen Reihenfolge: ${a} + ${b} · ${d}.`,
            "",
            [num("Wert:", value, "", 0, { slips: [{ value: (a + b) * d, hint: "Das wäre stur von links gerechnet. Punkt geht vor Strich." }] })],
            "Punkt vor Strich",
            `${b} · ${d} = ${b * d}, dann ${a} + ${b * d}.`,
            `Der Wert ist ${value}.`,
            { a, b, d },
          );
        }
        const value = (a + b) * e ** 2 - d;
        return task(
          level,
          "",
          `Berechne den Term in der richtigen Reihenfolge: (${a} + ${b}) · ${e}² − ${d}.`,
          [num("Wert:", value, "", 0, { slips: [{ value: (a + b) * (2 * e) - d, hint: `${e}² bedeutet ${e} · ${e}, nicht ${e} · 2.` }, { value: a + b * e ** 2 - d, hint: "Die Klammer musst du zuerst ausrechnen." }] })],
          "Klammer, Potenz, Punkt, Strich",
          `Klammer: ${a + b}. Potenz: ${e ** 2}. Produkt: ${(a + b) * e ** 2}. Zuletzt minus ${d}.`,
          `Der Wert ist ${value}.`,
          { a, b, d, e },
        );
      },
    },
    {
      id: "term-aufstellen",
      make: (rng, level) => {
        const a = rng.int(2, 9), b = rng.int(2, 9), d = rng.int(2, 9);
        if (level === 1) {
          const value = (a + b) * d;
          return task(
            level,
            `Multipliziere die Summe aus ${a} und ${b} mit ${d}. Welchen Wert hat der Term?`,
            "",
            [num("Wert:", value, "", 0, { slips: [{ value: a + b * d, hint: "Die Summe muss zuerst gerechnet werden. Setze sie in Klammern." }] })],
            "Die Summe kommt in Klammern: (a + b) · c",
            `(${a} + ${b}) · ${d} = ${a + b} · ${d}.`,
            `Der Wert ist ${value}.`,
            { a, b, d },
          );
        }
        const packs = rng.int(3, 8), per = rng.int(4, 9), lose = rng.int(2, 9);
        const value = packs * per + lose;
        return task(
          level,
          "",
          `Emma hat ${packs} volle Packungen mit je ${per} Sammelkarten und ${lose} einzelne Karten. Stelle einen Term auf und berechne, wie viele Karten sie hat.`,
          [
            pick("Passender Term:", [`${packs} · ${per} + ${lose}`, `${packs} · (${per} + ${lose})`, `${packs} + ${per} + ${lose}`], 0),
            num("Karten:", value, "", 0),
          ],
          "Erst die Packungen, dann die einzelnen Karten dazu.",
          `${packs} · ${per} = ${packs * per}, dann ${packs * per} + ${lose}.`,
          `Emma hat ${value} Karten.`,
          { packs, per, lose },
        );
      },
    },
  ],
});

const rechengesetze = makeLesson(1, 11, 3, {
  id: "nz-11-rechengesetze",
  title: "1.11 Rechengesetze und Rechenvorteile",
  subtitle: "Vertauschen, verbinden, verteilen",
  whyItMatters:
    "Mit den Rechengesetzen wird aus 25 · 37 · 4 eine Kopfrechenaufgabe. Du rechnest weniger und machst weniger Fehler.",
  explanationHtml: `<p><strong>Kommutativgesetz (Vertauschungsgesetz):</strong> a + b = b + a und a · b = b · a. Summanden und Faktoren darfst du vertauschen.</p><p><strong>Assoziativgesetz (Verbindungsgesetz):</strong> (a + b) + c = a + (b + c) und (a · b) · c = a · (b · c). In einer reinen Summe oder einem reinen Produkt darfst du die Klammern verschieben.</p><p><strong>Distributivgesetz (Verteilungsgesetz):</strong> a · (b + c) = a · b + a · c. Das gilt auch rückwärts als Ausklammern und mit Minus in der Klammer. Für Subtraktion und Division gelten Vertauschen und Verbinden <strong>nicht</strong>: 8 − 3 ist nicht 3 − 8.</p><div class="example">25 · 37 · 4 = (25 · 4) · 37 = 100 · 37 = 3.700. Und 48 · 17 + 52 · 17 = (48 + 52) · 17 = 100 · 17 = 1.700. Oder 7 · 102 = 7 · 100 + 7 · 2 = 714.</div><div class="merke"><strong>Merke:</strong> Suche Paare, die eine runde Zahl ergeben, und rechne sie zuerst.</div>`,
  formulas: [
    { name: "Kommutativgesetz", html: "a + b = b + a, a · b = b · a", quantities: "Nur für + und ·" },
    { name: "Assoziativgesetz", html: "(a + b) + c = a + (b + c), (a · b) · c = a · (b · c)", quantities: "Nur in reinen Summen und reinen Produkten" },
    { name: "Distributivgesetz", html: "a · (b + c) = a · b + a · c", quantities: "Rückwärts heißt es Ausklammern." },
  ],
  quiz: {
    question: "Welches Gesetz nutzt du bei 6 · 103 = 6 · 100 + 6 · 3?",
    options: ["Distributivgesetz", "Kommutativgesetz", "Assoziativgesetz"],
    correctIndex: 0,
    explanation: "Der Faktor 6 wird auf beide Summanden in der Klammer verteilt.",
  },
  lab: lab(
    "laws",
    "Gesetze ansehen",
    "Wähle ein Gesetz und stelle Zahlen ein. Beide Seiten ergeben immer dasselbe.",
    [c("law", "Gesetz", ["Kommutativgesetz", "Assoziativgesetz", "Distributivgesetz"]), r("a", "a", 1, 40, 6), r("b", "b", 1, 40, 4), r("c", "c", 1, 40, 3)],
    [
      o("links", "Linke Seite", (v) => n0(v.law === 0 ? v.a + v.b : v.law === 1 ? v.a * v.b * v.c : v.a * (v.b + v.c))),
      o("rechts", "Rechte Seite", (v) => n0(v.law === 0 ? v.b + v.a : v.law === 1 ? v.a * (v.b * v.c) : v.a * v.b + v.a * v.c)),
    ],
    [
      { id: "vertauschen", text: "Vertausche 17 und 23 mit dem Kommutativgesetz.", check: (v) => v.law === 0 && v.a === 17 && v.b === 23 },
      { id: "verbinden", text: "Nutze das Assoziativgesetz für 25 · 4 · 37. Das erste Produkt ist 100.", check: (v) => v.law === 1 && v.a === 25 && v.b === 4 && v.c === 37 },
      { id: "verteilen", text: "Rechne 7 · (10 + 2) mit dem Distributivgesetz.", check: (v) => v.law === 2 && v.a === 7 && v.b === 10 && v.c === 2 },
    ],
  ),
  exercises: [
    {
      id: "vorteilhaft",
      make: (rng, level) => {
        const x = rng.int(11, 99);
        if (level === 1) {
          const pair = rng.pick([[25, 4], [50, 2], [5, 20]] as const);
          const value = pair[0] * pair[1] * x;
          return task(
            level,
            `Rechne vorteilhaft: ${pair[0]} · ${x} · ${pair[1]}.`,
            "",
            [num("Wert:", value, "", 0)],
            "Vertausche so, dass ein Produkt eine runde Zahl ergibt.",
            `(${pair[0]} · ${pair[1]}) · ${x} = ${pair[0] * pair[1]} · ${x}.`,
            `Der Wert ist ${n0(value)}.`,
            { x },
          );
        }
        const split = rng.int(21, 79), other = 100 - split, value = 100 * x;
        return task(
          level,
          "",
          `Ein Kino verkauft an zwei Tagen ${split} und ${other} Karten zu je ${x} €. Rechne vorteilhaft: Wie viel nimmt es ein?`,
          [num("Einnahmen:", value, "€", 0)],
          "Klammere den gleichen Faktor aus.",
          `${split} · ${x} + ${other} · ${x} = (${split} + ${other}) · ${x} = 100 · ${x}.`,
          `Das Kino nimmt ${n0(value)} € ein.`,
          { x, split },
        );
      },
    },
    {
      id: "gesetz-erkennen",
      make: (rng, level) => {
        const a = rng.int(3, 9), b = rng.int(11, 40), d = rng.int(2, 9);
        const laws = [
          [`${a} · ${b} = ${b} · ${a}`, 0],
          [`(${a} · ${b}) · ${d} = ${a} · (${b} · ${d})`, 1],
          [`${a} · (${b} + ${d}) = ${a} · ${b} + ${a} · ${d}`, 2],
        ] as const;
        const [text, index] = rng.pick(laws);
        if (level === 1)
          return task(
            level,
            `Welches Gesetz zeigt diese Gleichung: ${text}?`,
            "",
            [pick("Gesetz:", ["Kommutativgesetz", "Assoziativgesetz", "Distributivgesetz"], index)],
            "Vertauscht, Klammern verschoben oder auf zwei Summanden verteilt?",
            ["Die Faktoren wurden vertauscht.", "Die Klammern wurden verschoben.", "Der Faktor wurde verteilt."][index],
            ["Kommutativgesetz", "Assoziativgesetz", "Distributivgesetz"][index],
            { a, b, d },
          );
        const value = a * (100 + d);
        return task(
          level,
          "",
          `Berechne ${a} · ${100 + d} im Kopf, indem du ${100 + d} zerlegst. Welchen Wert hat das Produkt?`,
          [num("Wert:", value, "", 0, { slips: [{ value: a * 100 + d, hint: `Der Faktor ${a} muss auch mit ${d} multipliziert werden.` }] })],
          "a · (b + c) = a · b + a · c",
          `${a} · ${100 + d} = ${a} · 100 + ${a} · ${d} = ${a * 100} + ${a * d}.`,
          `Der Wert ist ${n0(value)}.`,
          { a, d },
        );
      },
    },
  ],
});

const potenzen = makeLesson(1, 12, 3, {
  id: "nz-12-potenzen",
  title: "1.12 Potenzen und Quadratzahlen",
  subtitle: "Basis, Exponent und die Quadratzahlen bis 400",
  whyItMatters:
    "2 · 2 · 2 · 2 · 2 ist lang. 2⁵ ist kurz. Quadratzahlen brauchst du später ständig, zum Beispiel bei Flächen.",
  explanationHtml: `<p>Eine <strong>Potenz</strong> ist die Kurzschreibweise für ein Produkt aus gleichen Faktoren: 2⁵ = 2 · 2 · 2 · 2 · 2 = 32. Die <strong>Basis</strong> (Grundzahl) 2 ist der Faktor, der <strong>Exponent</strong> (Hochzahl) 5 sagt, wie oft er vorkommt. Das Ergebnis 32 heißt <strong>Potenzwert</strong>.</p><p>Eine Zahl mit dem Exponenten 2 ist eine <strong>Quadratzahl</strong>. Lerne sie bis 20² auswendig: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400.</p><div class="example">5³ = 5 · 5 · 5 = 125, nicht 5 · 3 = 15. Und 15² = 15 · 15 = 225, nicht 30.</div><div class="merke"><strong>Merke:</strong> Der Exponent zählt die Faktoren. Er ist kein Faktor.</div>`,
  formulas: [
    { name: "Potenz", html: "a<sup>n</sup> = a · a · … · a (n Faktoren)", quantities: "a Basis, n Exponent" },
    { name: "Quadratzahl", html: "n² = n · n", quantities: "Bis 20² = 400 auswendig" },
  ],
  quiz: {
    question: "Wie heißt die 3 in 7³?",
    options: ["Exponent", "Basis", "Potenzwert"],
    correctIndex: 0,
    explanation: "Die Hochzahl heißt Exponent. Sie sagt: Die Basis 7 kommt dreimal als Faktor vor.",
  },
  lab: lab(
    "power",
    "Potenzen bauen",
    "Stelle Basis und Exponent ein. Bei Exponent 2 siehst du das Quadrat, das der Zahl den Namen gibt.",
    [r("base", "Basis", 1, 20, 3), r("exp", "Exponent", 1, 6, 2)],
    [
      o("wert", "Potenzwert", (v) => n0(v.base ** v.exp)),
      o("produkt", "Als Produkt", (v) => Array.from({ length: v.exp }, () => v.base).join(" · ")),
    ],
    [
      { id: "quadrat", text: "Stelle 15² ein. Der Potenzwert ist 225.", check: (v) => v.base === 15 && v.exp === 2 },
      { id: "zweierpotenz", text: "Stelle 2⁵ ein. Der Potenzwert ist 32.", check: (v) => v.base === 2 && v.exp === 5 },
      { id: "vierhundert", text: "Stelle die Potenz mit dem Exponenten 2 und dem Wert 400 ein.", check: (v) => v.exp === 2 && v.base === 20 },
    ],
  ),
  exercises: [
    {
      id: "potenzwert",
      make: (rng, level) => {
        const base = level === 1 ? rng.int(2, 6) : rng.int(2, 5);
        const exp = level === 1 ? rng.int(2, 4) : rng.int(3, 6);
        const value = base ** exp;
        return task(
          level,
          `Berechne den Potenzwert der Potenz ${base}${sup(exp)}.`,
          `Berechne ${base}${sup(exp)} und vergleiche mit ${base * exp}. Um wie viel ist der Potenzwert größer als das Produkt ${base} · ${exp}?`,
          [
            num("Potenzwert:", value, "", 0, { slips: base * exp !== value ? [{ value: base * exp, hint: `Das ist ${base} · ${exp}. Der Exponent zählt die Faktoren.` }] : [] }),
            ...(level === 2 ? [num("Unterschied:", value - base * exp, "", 0)] : []),
          ],
          "Die Basis so oft als Faktor schreiben, wie der Exponent sagt.",
          `${Array.from({ length: exp }, () => base).join(" · ")} = ${n0(value)}.`,
          `${base}${sup(exp)} = ${n0(value)}`,
          { base, exp },
        );
      },
    },
    {
      id: "quadratzahlen",
      make: (rng, level) => {
        const n = rng.int(11, 20);
        if (level === 1)
          return task(
            level,
            `Wie groß ist ${n}²? Antworte auswendig, wenn du kannst.`,
            "",
            [num(`${n}² =`, n * n, "", 0, { slips: [{ value: n * 2, hint: `${n}² ist ${n} · ${n}, nicht ${n} · 2.` }] })],
            "n² = n · n",
            `${n} · ${n} = ${n * n}.`,
            `${n}² = ${n * n}`,
            { n },
          );
        return task(
          level,
          "",
          `Eine quadratische Terrasse besteht aus ${n * n} gleichen Platten. Wie viele Platten liegen an einer Seite?`,
          [num("Platten pro Seite:", n, "", 0, { slips: [{ value: n * n / 2, hint: "Gesucht ist die Zahl, die mit sich selbst multipliziert den Wert ergibt." }] })],
          "Welche Zahl mal sich selbst ergibt diese Quadratzahl?",
          `${n} · ${n} = ${n * n}.`,
          `An einer Seite liegen ${n} Platten.`,
          { n },
        );
      },
    },
  ],
});

const zehnerpotenzen = makeLesson(1, 13, 3, {
  id: "nz-13-zehnerpotenzen",
  title: "1.13 Zehnerpotenzen",
  subtitle: "Große Zahlen kurz und übersichtlich schreiben",
  whyItMatters:
    "Die Sonne ist etwa 150.000.000 km entfernt. Mit 15 · 10⁷ verzählst du dich bei den Nullen nicht mehr.",
  explanationHtml: `<p>Die Stufenzahlen sind Potenzen von 10: 10¹ = 10, 10² = 100, 10³ = 1.000, 10⁶ = 1.000.000. Der <strong>Exponent zählt die Nullen</strong>.</p><p>Große Zahlen kannst du als Produkt aus einer kleineren Zahl und einer Zehnerpotenz schreiben. Das ist sinnvoll, wenn die Zahl viele Nullen hat oder ohnehin nur ungefähr bekannt ist. Bei kleinen Zahlen wie 30 ist es umständlich.</p><div class="example">350.000 = 35 · 10.000 = 35 · 10⁴. Und 7 · 10⁵ = 700.000. Zum Vergleich: 2 · 10⁶ ist größer als 9 · 10⁵, denn 2.000.000 &gt; 900.000.</div><div class="merke"><strong>Merke:</strong> 10ⁿ ist eine 1 mit n Nullen. Zähle beim Umwandeln die Nullen am Ende der Zahl.</div>`,
  formulas: [
    { name: "Zehnerpotenz", html: "10<sup>n</sup> = 1 mit n Nullen", quantities: "n Exponent" },
    { name: "Zehnerpotenzschreibweise", html: "350.000 = 35 · 10⁴", quantities: "Vier Nullen wandern in den Exponenten." },
  ],
  quiz: {
    question: "Welche Zahl ist 4 · 10⁵?",
    options: ["400.000", "4.000.000", "40.000"],
    correctIndex: 0,
    explanation: "10⁵ ist eine 1 mit fünf Nullen. Also steht hinter der 4 fünfmal die 0.",
  },
  lab: lab(
    "powers-of-ten",
    "Nullen zählen",
    "Stelle eine Zahl und den Exponenten ein. Beobachte, wie sich die ausgeschriebene Zahl verlängert.",
    [r("a", "Zahl vorne", 1, 99, 2), r("n", "Exponent", 1, 12, 2)],
    [
      o("kurz", "Kurz", (v) => `${v.a} · 10${sup(v.n)}`),
      o("lang", "Ausgeschrieben", (v) => n0(v.a * 10 ** v.n)),
    ],
    [
      { id: "million", text: "Stelle eine Million ein: 1 · 10⁶.", check: (v) => v.a === 1 && v.n === 6 },
      { id: "beispiel", text: "Stelle 350.000 ein.", check: (v) => v.a === 35 && v.n === 4 },
      { id: "sonne", text: "Stelle die Entfernung zur Sonne in Kilometern ein: 15 · 10⁷.", check: (v) => v.a === 15 && v.n === 7 },
    ],
  ),
  exercises: [
    {
      id: "ausschreiben",
      make: (rng, level) => {
        const a = rng.int(2, 99), n = level === 1 ? rng.int(2, 5) : rng.int(6, 10);
        const value = a * 10 ** n;
        return task(
          level,
          `Schreibe ohne Zehnerpotenz: ${a} · 10${sup(n)}.`,
          `Ein Lexikon gibt die Zahl der Sterne einer Galaxie mit ${a} · 10${sup(n)} an. Schreibe die Zahl aus.`,
          [num("Zahl:", value, "", 0, { slips: [{ value: a * 10 * n, hint: `10${sup(n)} ist nicht 10 · ${n}. Der Exponent zählt die Nullen.` }] })],
          "Hänge so viele Nullen an, wie der Exponent sagt.",
          `10${sup(n)} hat ${n} Nullen.`,
          `${a} · 10${sup(n)} = ${n0(value)}`,
          { a, n },
        );
      },
    },
    {
      id: "exponent-finden",
      make: (rng, level) => {
        // At most 99 · 10⁷ on level 2: a population that a real country can have.
        const a = rng.int(2, 9) * (rng.int(0, 1) ? 1 : 11), n = level === 1 ? rng.int(3, 5) : rng.int(5, 7);
        const value = a * 10 ** n;
        return task(
          level,
          `Ergänze den Exponenten: ${n0(value)} = ${a} · 10 hoch …`,
          `Ein Land hat ${n0(value)} Einwohner. Schreibe die Zahl als ${a} · 10 hoch …. Welcher Exponent gehört dorthin?`,
          [num("Exponent:", n, "", 0, { slips: [{ value: String(value).length, hint: "Du hast alle Stellen gezählt. Zähle nur die Nullen am Ende." }] })],
          "Zähle die Nullen am Ende der Zahl.",
          `Hinter ${a} stehen ${n} Nullen.`,
          `Der Exponent ist ${n}.`,
          { a, n },
        );
      },
    },
  ],
});

const wachstum = makeLesson(1, 14, 3, {
  id: "nz-14-wachstum",
  title: "1.14 Exponentielles Wachstum",
  subtitle: "Kettenmails, Zellteilung und Bakterien",
  whyItMatters:
    "Manches wächst viel schneller, als du denkst. Mit Potenzen kannst du das ausrechnen statt zu raten.",
  explanationHtml: `<p>Wenn sich eine Anzahl in jedem Schritt <strong>vervielfacht</strong>, wächst sie <strong>exponentiell</strong>. Bei einer Zelle, die sich immer teilt, verdoppelt sich die Zahl: 1, 2, 4, 8, 16, … Nach n Schritten sind es 2ⁿ Zellen. Der Exponent zählt die Schritte.</p><p>Das ist ganz anders als beim Dazuzählen. Kommen in jedem Schritt 2 Zellen dazu, hast du nach 10 Schritten 21 Zellen. Bei der Verdopplung sind es 1.024.</p><div class="example">Eine Kettenmail: Du schickst sie an 3 Personen, jede davon wieder an 3. In Runde 4 erhalten sie 3⁴ = 81 Personen. In Runde 10 wären es schon 59.049.</div><div class="merke"><strong>Merke:</strong> Beim Vervielfachen wächst der Exponent mit jedem Schritt. Anzahl nach n Schritten: Faktor hoch n.</div>`,
  formulas: [
    { name: "Wachstum in Schritten", html: "Anzahl = Faktor<sup>n</sup>", quantities: "n Anzahl der Schritte, Start mit 1" },
  ],
  quiz: {
    question: "Bakterien verdoppeln sich jede Stunde. Am Anfang ist es eines. Wie viele sind es nach 5 Stunden?",
    options: ["32", "10", "25"],
    correctIndex: 0,
    explanation: "2⁵ = 32. Die 10 wäre 5 · 2, die 25 wäre 5².",
  },
  lab: lab(
    "doubling",
    "Vervielfachen",
    "Wähle den Faktor und die Zahl der Schritte. Die letzte Säule stellt alle früheren in den Schatten.",
    [c("f", "In jedem Schritt", ["· 2 (Zellteilung)", "· 3 (Kettenmail)", "· 10"]), r("n", "Schritte", 0, 12, 3)],
    [
      o("anzahl", "Anzahl", (v) => n0([2, 3, 10][v.f] ** v.n)),
      o("linear", "Nur dazuzählen", (v) => n0(1 + [2, 3, 10][v.f] * v.n)),
    ],
    [
      { id: "zellen", text: "Bringe die Zellteilung auf 1.024 Zellen.", check: (v) => v.f === 0 && v.n === 10 },
      { id: "mail", text: "Finde die Runde der Kettenmail mit 243 Empfängern.", check: (v) => v.f === 1 && v.n === 5 },
      { id: "million", text: "Erreiche mit dem Faktor 10 genau eine Million.", check: (v) => v.f === 2 && v.n === 6 },
    ],
  ),
  exercises: [
    {
      id: "anzahl-nach-schritten",
      make: (rng, level) => {
        const f = level === 1 ? 2 : rng.pick([2, 3]);
        const n = level === 1 ? rng.int(3, 8) : rng.int(5, 9);
        const value = f ** n;
        return task(
          level,
          `Eine Zelle teilt sich in jedem Schritt in zwei. Wie viele Zellen gibt es nach ${n} Schritten?`,
          `Eine Nachricht wird in jeder Runde von jeder Person an ${f} neue Personen geschickt. Die erste Runde beginnt mit einer Person. Wie viele Personen werden in Runde ${n} erreicht?`,
          [num("Anzahl:", value, "", 0, { slips: [{ value: f * n, hint: `Das wäre ${f} · ${n}. Hier wird in jedem Schritt vervielfacht, nicht dazugezählt.` }] })],
          "Anzahl = Faktor hoch Schrittzahl",
          `${f}${sup(n)} = ${n0(value)}.`,
          `Es sind ${n0(value)}.`,
          { f, n },
        );
      },
    },
    {
      id: "schritte-finden",
      make: (rng, level) => {
        const n = rng.int(4, 10);
        const target = 2 ** n;
        const hours = level === 1 ? 1 : rng.pick([2, 3]);
        return task(
          level,
          `Bakterien verdoppeln sich in jedem Schritt. Am Anfang ist es eines. Nach wie vielen Schritten sind es ${n0(target)}?`,
          `Eine Bakterienart verdoppelt sich alle ${hours} Stunden. Am Anfang ist es ein Bakterium. Nach wie vielen Stunden sind es ${n0(target)}?`,
          [num(level === 1 ? "Schritte:" : "Stunden:", n * hours, "", 0)],
          "Verdopple so lange, bis du die Zahl erreichst, und zähle mit.",
          `2${sup(n)} = ${n0(target)}, also ${n} Verdopplungen${level === 2 ? `, je ${hours} Stunden` : ""}.`,
          level === 1 ? `Nach ${n} Schritten.` : `Nach ${n * hours} Stunden.`,
          { n, hours },
        );
      },
    },
  ],
});

const teilbarkeit = makeLesson(1, 15, 3, {
  id: "nz-15-teilbarkeit",
  title: "1.15 Teilbarkeit",
  subtitle: "Teilbarkeitsregeln und Teilermengen",
  whyItMatters:
    "Mit den Regeln siehst du einer Zahl an, ob eine Division aufgeht, ohne sie auszurechnen. Das hilft beim Verteilen und später beim Kürzen von Brüchen.",
  explanationHtml: `<p>Geht eine Division ohne Rest auf, ist die Zahl <strong>teilbar</strong>. Die <strong>Teilbarkeitsregeln</strong> helfen dir:</p><p><strong>Letzte Ziffern:</strong> durch 2, wenn die letzte Ziffer gerade ist; durch 5, wenn sie 0 oder 5 ist; durch 10, wenn sie 0 ist; durch 4, wenn die letzten beiden Ziffern eine durch 4 teilbare Zahl bilden.</p><p><strong>Quersumme</strong> (Summe aller Ziffern): durch 3, wenn die Quersumme durch 3 teilbar ist; durch 9, wenn sie durch 9 teilbar ist.</p><p>Die <strong>Teilermenge</strong> enthält alle Teiler einer Zahl. Suche sie paarweise: T₁₂ = {1; 2; 3; 4; 6; 12}.</p><div class="example">Ist 1.236 teilbar? Durch 2 ja, denn die 6 ist gerade. Quersumme 1 + 2 + 3 + 6 = 12: durch 3 ja, durch 9 nein. Die letzten beiden Ziffern 36 sind durch 4 teilbar, also auch 1.236.</div><div class="merke"><strong>Merke:</strong> 2, 5, 10: letzte Ziffer. 4: letzte zwei Ziffern. 3 und 9: Quersumme.</div>`,
  formulas: [
    { name: "Quersumme", html: "Quersumme von 1.236 = 1 + 2 + 3 + 6 = 12", quantities: "Für die Regeln zu 3 und 9" },
    { name: "Teilermenge", html: "T<sub>12</sub> = {1; 2; 3; 4; 6; 12}", quantities: "1 und die Zahl selbst gehören immer dazu." },
  ],
  quiz: {
    question: "Welche Zahl ist durch 3 teilbar, aber nicht durch 9?",
    options: ["123", "117", "125"],
    correctIndex: 0,
    explanation: "123 hat die Quersumme 6: durch 3 teilbar, durch 9 nicht. 117 hat die Quersumme 9, 125 die Quersumme 8.",
  },
  lab: lab(
    "divisibility",
    "Teilbarkeit prüfen",
    "Ziehe die Zahl. Du siehst sofort, welche Regeln zutreffen, und die ganze Teilermenge.",
    [r("n", "Zahl", 2, 300, 14)],
    [
      o("quersumme", "Quersumme", (v) => digitSum(v.n)),
      o("anzahl", "Anzahl der Teiler", (v) => divisors(v.n).length),
    ],
    [
      { id: "drei-teiler", text: "Finde eine Zahl, die durch 2, 3 und 5 teilbar ist und größer als 100 ist.", check: (v) => v.n > 100 && v.n % 30 === 0 },
      { id: "neun", text: "Finde eine ungerade Zahl, die durch 9 teilbar ist und zwischen 100 und 130 liegt.", check: (v) => v.n % 2 === 1 && v.n % 9 === 0 && v.n > 100 && v.n < 130 },
      { id: "viele", text: "Finde eine Zahl mit genau 12 Teilern.", check: (v) => divisors(v.n).length === 12 },
    ],
  ),
  exercises: [
    {
      id: "regel-anwenden",
      make: (rng, level) => {
        const d = rng.pick([2, 3, 4, 5, 9, 10]);
        const yes = rng.int(0, 1) === 0;
        const range = level === 1 ? 100 : 10000;
        let n = rng.int(range / 10, range) * 1;
        n = yes ? n - (n % d) + d : n - (n % d) + d + 1;
        const divisible = n % d === 0;
        const why = d === 3 || d === 9 ? `Die Quersumme ist ${digitSum(n)}.` : d === 4 ? `Die letzten beiden Ziffern bilden ${n % 100}.` : `Die letzte Ziffer ist ${n % 10}.`;
        return task(
          level,
          `Ist ${n0(n)} durch ${d} teilbar? Nutze die Regel, ohne schriftlich zu teilen.`,
          `${n0(n)} Bonbons sollen ohne Rest auf ${d} Gruppen verteilt werden. Geht das? Prüfe mit einer Teilbarkeitsregel.`,
          [pick("Antwort:", ["ja", "nein"], divisible ? 0 : 1)],
          d === 3 || d === 9 ? "Quersumme bilden" : d === 4 ? "Letzte zwei Ziffern prüfen" : "Letzte Ziffer prüfen",
          why,
          divisible ? `Ja, ${n0(n)} ist durch ${d} teilbar.` : `Nein, ${n0(n)} ist nicht durch ${d} teilbar.`,
          { n, d },
        );
      },
    },
    {
      id: "teilermenge",
      make: (rng, level) => {
        const n = rng.pick(level === 1 ? [12, 15, 16, 18, 20, 24, 28, 30] : [36, 40, 42, 48, 56, 60, 72, 90]);
        const list = divisors(n);
        return task(
          level,
          `Bestimme die Anzahl aller Teiler von ${n}. Die Teilermenge beginnt mit 1 und endet mit ${n}.`,
          `${n} Kinder sollen sich in gleich große Gruppen aufteilen. Wie viele verschiedene Gruppengrößen gibt es, wenn auch 1 Kind und alle ${n} Kinder als Gruppe zählen?`,
          [num("Anzahl der Teiler:", list.length, "", 0, { slips: [{ value: list.length - 2, hint: "Die 1 und die Zahl selbst sind auch Teiler." }] })],
          "Suche Teiler paarweise: 1 und die Zahl, 2 und die Hälfte, …",
          `T${[...String(n)].map((d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]).join("")} = { ${list.join("; ")} }.`,
          `${n} hat ${list.length} Teiler.`,
          { n },
        );
      },
    },
  ],
});

const primfaktoren = makeLesson(1, 16, 3, {
  id: "nz-16-primfaktoren",
  title: "1.16 Primzahlen und Primfaktorzerlegung",
  subtitle: "Die Bausteine der natürlichen Zahlen",
  whyItMatters:
    "Jede Zahl lässt sich auf genau eine Art aus Primzahlen zusammensetzen. Damit findest du ggT und kgV schnell.",
  explanationHtml: `<p>Eine <strong>Primzahl</strong> hat genau zwei Teiler: 1 und sich selbst. Die ersten sind 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Die 1 ist <strong>keine</strong> Primzahl, sie hat nur einen Teiler. Die 2 ist die einzige gerade Primzahl.</p><p>Jede andere Zahl größer als 1 kannst du als Produkt von Primzahlen schreiben. Das ist die <strong>Primfaktorzerlegung</strong>. Teile dazu immer wieder durch die kleinste Primzahl, die aufgeht. Mehrfache Faktoren schreibst du als Potenz.</p><div class="example">60 : 2 = 30, 30 : 2 = 15, 15 : 3 = 5, und 5 ist eine Primzahl. Also 60 = 2 · 2 · 3 · 5 = 2² · 3 · 5.</div><div class="merke"><strong>Merke:</strong> Primzahl: genau zwei Teiler. Zerlege, bis nur noch Primzahlen übrig sind, und ordne sie der Größe nach.</div>`,
  formulas: [
    { name: "Primzahlen bis 30", html: "2, 3, 5, 7, 11, 13, 17, 19, 23, 29", quantities: "1 ist keine Primzahl." },
    { name: "Primfaktorzerlegung", html: "60 = 2² · 3 · 5", quantities: "Nur Primzahlen als Faktoren" },
  ],
  quiz: {
    question: "Welche Zerlegung von 36 ist die Primfaktorzerlegung?",
    options: ["2² · 3²", "4 · 9", "6 · 6"],
    correctIndex: 0,
    explanation: "Nur 2 und 3 sind Primzahlen. 4, 9 und 6 kann man noch weiter zerlegen.",
  },
  lab: lab(
    "factor-tree",
    "Zerlegungsbaum",
    "Ziehe die Zahl. Der Baum teilt immer durch die kleinste passende Primzahl.",
    [r("n", "Zahl", 2, 200, 12)],
    [
      o("zerlegung", "Primfaktoren", (v) => factorText(v.n)),
      o("prim", "Primzahl?", (v) => (isPrime(v.n) ? "ja" : "nein")),
      o("anzahl", "Anzahl der Primfaktoren", (v) => primeFactors(v.n).length),
    ],
    [
      { id: "beispiel", text: "Stelle 60 ein und lies die Zerlegung ab.", check: (v) => v.n === 60 },
      { id: "prim", text: "Finde die kleinste Primzahl über 100.", check: (v) => v.n === 101 },
      { id: "sieben", text: "Finde die Zahl, die nur aus sieben Faktoren 2 besteht.", check: (v) => v.n === 128 },
    ],
  ),
  exercises: [
    {
      id: "prim-erkennen",
      make: (rng, level) => {
        const primes = level === 1 ? [7, 11, 13, 17, 19, 23, 29] : [31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        const fakes = level === 1 ? [9, 15, 21, 25, 27] : [39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
        const yes = rng.int(0, 1) === 0;
        const n = rng.pick(yes ? primes : fakes);
        const teiler = divisors(n);
        return task(
          level,
          `Ist die Zahl ${n} eine Primzahl? Prüfe ihre Teiler.`,
          `Tim behauptet: „${n} kann man nur durch 1 und durch sich selbst teilen.“ Hat er recht?`,
          [pick("Antwort:", ["ja", "nein"], yes ? 0 : 1)],
          "Prüfe die Teiler 2, 3, 5 und 7.",
          yes ? `${n} hat nur die Teiler 1 und ${n}.` : `${n} hat auch den Teiler ${teiler[1]}: ${teiler[1]} · ${n / teiler[1]} = ${n}.`,
          yes ? `${n} ist eine Primzahl.` : `${n} ist keine Primzahl.`,
          { n },
        );
      },
    },
    {
      id: "zerlegen",
      make: (rng, level) => {
        const n = rng.pick(level === 1 ? [12, 18, 20, 28, 30, 42, 45, 50] : [72, 84, 90, 96, 108, 120, 126, 150, 168, 180]);
        const right = factorText(n);
        const largest = Math.max(...primeFactors(n));
        const wrongA = right.replace(/²|³|⁴|⁵/, "");
        const firstTwo = primeFactors(n)[0] * primeFactors(n)[1];
        const wrongB = `${firstTwo} · ${n / firstTwo}`;
        return task(
          level,
          `Welche Schreibweise ist die Primfaktorzerlegung von ${n}? Wie heißt der größte Primfaktor?`,
          `Für die Rechnung mit ${n} brauchst du die Primfaktoren. Wähle die Zerlegung und gib den größten Primfaktor an.`,
          [
            pick("Zerlegung:", [right, wrongA === right ? `${right} · 2` : wrongA, wrongB], 0),
            num("Größter Primfaktor:", largest, "", 0),
          ],
          "Teile immer durch die kleinste Primzahl, die aufgeht.",
          `${n} wird so lange geteilt, bis nur Primzahlen übrig sind.`,
          `${n} = ${right}`,
          { n },
        );
      },
    },
  ],
});

const ggtKgv = makeLesson(1, 17, 3, {
  id: "nz-17-ggt-kgv",
  title: "1.17 ggT und kgV",
  subtitle: "Größter gemeinsamer Teiler und kleinstes gemeinsames Vielfaches",
  whyItMatters:
    "Wann treffen sich zwei Busse wieder an der Haltestelle? Wie viele gleiche Tüten lassen sich packen? Solche Fragen löst du mit kgV und ggT.",
  explanationHtml: `<p>Der <strong>größte gemeinsame Teiler (ggT)</strong> ist die größte Zahl, die beide Zahlen teilt. Das <strong>kleinste gemeinsame Vielfache (kgV)</strong> ist die kleinste Zahl, die in beiden Vielfachenmengen vorkommt.</p><p>Bei kleinen Zahlen schreibst du Teiler oder Vielfache auf und suchst die gemeinsamen. Zwei Zahlen mit ggT 1 heißen <strong>teilerfremd</strong>.</p><div class="example">T₁₂ = {1; 2; 3; 4; 6; 12}, T₁₈ = {1; 2; 3; 6; 9; 18}. Gemeinsam: 1, 2, 3, 6. Also ggT(12; 18) = 6. Vielfache: 12, 24, 36, … und 18, 36, … Also kgV(12; 18) = 36.</div><div class="merke"><strong>Merke:</strong> Verteilen in gleich große Teile führt zum ggT. Treffen im gleichen Takt führt zum kgV.</div>`,
  formulas: [
    { name: "ggT", html: "ggT(12; 18) = 6", quantities: "Größte Zahl, die beide teilt" },
    { name: "kgV", html: "kgV(12; 18) = 36", quantities: "Kleinste Zahl, die beide als Teiler hat" },
  ],
  quiz: {
    question: "Zwei Busse fahren alle 12 und alle 15 Minuten ab. Jetzt fahren beide zusammen ab. Wann ist das wieder so?",
    options: ["Nach 60 Minuten: das ist das kgV.", "Nach 3 Minuten: das ist der ggT.", "Nach 180 Minuten: das ist das Produkt."],
    correctIndex: 0,
    explanation: "Gesucht ist die kleinste Zahl in beiden Takten: 60. 12 · 15 wäre zwar auch gemeinsam, aber nicht die kleinste.",
  },
  lab: lab(
    "ggt-kgv",
    "Gemeinsames finden",
    "Stelle zwei Zahlen ein. Grüne Felder zeigen die gemeinsamen Teiler und die gemeinsamen Vielfachen.",
    [r("a", "a", 2, 30, 4), r("b", "b", 2, 30, 6)],
    [
      o("ggt", "ggT", (v) => ggt(v.a, v.b)),
      o("kgv", "kgV", (v) => kgv(v.a, v.b)),
    ],
    [
      { id: "beispiel", text: "Stelle 12 und 18 ein: ggT 6, kgV 36.", check: (v) => v.a === 12 && v.b === 18 },
      { id: "fremd", text: "Finde zwei teilerfremde Zahlen, die beide größer als 7 sind.", check: (v) => ggt(v.a, v.b) === 1 && v.a > 7 && v.b > 7 },
      { id: "vielfaches", text: "Finde zwei verschiedene Zahlen, bei denen das kgV die größere der beiden ist.", check: (v) => v.a !== v.b && kgv(v.a, v.b) === Math.max(v.a, v.b) },
    ],
  ),
  exercises: [
    {
      id: "ggt",
      make: (rng, level) => {
        const g = rng.int(2, level === 1 ? 6 : 12);
        const [x, y] = rng.pick([[2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [2, 5]]);
        const a = g * x, b = g * y;
        return task(
          level,
          `Bestimme den größten gemeinsamen Teiler (ggT) von ${a} und ${b}.`,
          `${a} Äpfel und ${b} Birnen sollen ohne Rest auf möglichst viele gleiche Tüten verteilt werden. Wie viele Tüten sind das?`,
          [num(level === 1 ? "ggT:" : "Tüten:", g, "", 0, { slips: [{ value: a * b / g, hint: "Das ist das kgV. Gesucht ist hier der größte gemeinsame Teiler." }] })],
          "Schreibe die Teiler beider Zahlen auf und suche den größten gemeinsamen.",
          `T(${a}) = { ${divisors(a).join("; ")} }, T(${b}) = { ${divisors(b).join("; ")} }.`,
          `ggT(${a}; ${b}) = ${g}`,
          { a, b },
        );
      },
    },
    {
      id: "kgv",
      make: (rng, level) => {
        const [a, b] = rng.pick(level === 1 ? [[4, 6], [6, 8], [6, 9], [4, 10], [8, 12], [9, 12]] : [[12, 15], [10, 15], [12, 20], [15, 20], [16, 24], [18, 24], [15, 25]]);
        const value = kgv(a, b);
        return task(
          level,
          `Bestimme das kleinste gemeinsame Vielfache (kgV) von ${a} und ${b}.`,
          `Zwei Lichter blinken alle ${a} und alle ${b} Sekunden. Gerade leuchten beide zusammen. Nach wie vielen Sekunden geschieht das wieder?`,
          [num(level === 1 ? "kgV:" : "Sekunden:", value, "", 0, { slips: [{ value: a * b, hint: "Das Produkt ist gemeinsam, aber nicht das kleinste Vielfache." }, { value: ggt(a, b), hint: "Das ist der ggT. Gesucht ist ein gemeinsames Vielfaches." }] })],
          "Schreibe die Vielfachen der größeren Zahl auf, bis die kleinere Zahl sie teilt.",
          `Vielfache von ${b}: ${[1, 2, 3, 4].map((i) => b * i).join(", ")}, …`,
          `kgV(${a}; ${b}) = ${value}`,
          { a, b },
        );
      },
    },
  ],
});

const kombinatorik = makeLesson(1, 18, 4, {
  id: "nz-18-kombinatorik",
  title: "1.18 Kombinatorik",
  subtitle: "Möglichkeiten systematisch zählen, Zählprinzip",
  whyItMatters:
    "Wie viele Outfits ergeben sich aus deinem Kleiderschrank? Wer systematisch zählt, vergisst keine Möglichkeit.",
  explanationHtml: `<p>Bei der <strong>Kombinatorik</strong> zählst du Möglichkeiten, ohne eine zu vergessen. Dazu gehst du <strong>systematisch</strong> vor: in einer Tabelle, einer Zeichnung oder einem <strong>Baumdiagramm</strong>. Jede Stufe im Baum ist eine Entscheidung, jeder Weg vom Start bis zum Ende ist eine Möglichkeit.</p><p>Das <strong>Zählprinzip</strong> kürzt das ab: Multipliziere die Anzahlen der einzelnen Entscheidungen.</p><p>Vorsicht, wenn etwas nicht doppelt vorkommen darf: Bei der Sitzordnung von 3 Kindern hat das erste 3 Plätze, das zweite noch 2, das dritte noch 1. Das sind 3 · 2 · 1 = 6 Möglichkeiten.</p><div class="example">3 T-Shirts, 2 Hosen, 2 Paar Schuhe: 3 · 2 · 2 = 12 Outfits. Im Baum: 3 Äste, an jedem 2 Äste, an jedem wieder 2.</div><div class="merke"><strong>Merke:</strong> Zählprinzip: Anzahlen der Entscheidungen multiplizieren.</div>`,
  formulas: [
    { name: "Zählprinzip", html: "Anzahl = n₁ · n₂ · n₃ · …", quantities: "n₁, n₂, … Anzahl der Möglichkeiten je Entscheidung" },
  ],
  quiz: {
    question: "Eine Eisdiele hat 5 Sorten und 3 Soßen. Wie viele Becher mit einer Sorte und einer Soße gibt es?",
    options: ["15", "8", "53"],
    correctIndex: 0,
    explanation: "Zu jeder der 5 Sorten passen 3 Soßen: 5 · 3 = 15. Die 8 wäre addiert.",
  },
  lab: lab(
    "combi-tree",
    "Baumdiagramm",
    "Stelle die Anzahlen ein. Jeder Punkt ganz rechts ist genau ein Outfit.",
    [r("t", "T-Shirts", 1, 4, 2), r("h", "Hosen", 1, 4, 2), r("s", "Schuhe", 1, 3, 1)],
    [
      o("anzahl", "Möglichkeiten", (v) => v.t * v.h * v.s),
      o("rechnung", "Rechnung", (v) => `${v.t} · ${v.h} · ${v.s}`),
    ],
    [
      { id: "sechs", text: "Stelle 3 T-Shirts, 2 Hosen und 1 Paar Schuhe ein.", check: (v) => v.t === 3 && v.h === 2 && v.s === 1 },
      { id: "achtzehn", text: "Erreiche 18 Outfits mit 3 T-Shirts und 3 Hosen.", check: (v) => v.t === 3 && v.h === 3 && v.s === 2 },
      { id: "maximum", text: "Stelle die größtmögliche Zahl von Outfits ein.", check: (v) => v.t * v.h * v.s === 48 },
    ],
  ),
  exercises: [
    {
      id: "zaehlprinzip",
      make: (rng, level) => {
        const a = rng.int(2, 6), b = rng.int(2, 5), d = rng.int(2, 4);
        const value = level === 1 ? a * b : a * b * d;
        return task(
          level,
          `Es gibt ${a} Brötchen und ${b} Beläge. Wie viele verschiedene belegte Brötchen mit einem Belag gibt es?`,
          `Ein Menü besteht aus einer von ${a} Vorspeisen, einem von ${b} Hauptgerichten und einem von ${d} Nachtischen. Wie viele verschiedene Menüs gibt es?`,
          [num("Möglichkeiten:", value, "", 0, { slips: [{ value: level === 1 ? a + b : a + b + d, hint: "Du hast addiert. Zu jeder Wahl gehören alle Möglichkeiten der nächsten Stufe, also wird multipliziert." }] })],
          "Zählprinzip: Anzahlen multiplizieren",
          level === 1 ? `${a} · ${b} = ${value}.` : `${a} · ${b} · ${d} = ${value}.`,
          `Es gibt ${value} Möglichkeiten.`,
          { a, b, d },
        );
      },
    },
    {
      id: "ohne-wiederholung",
      make: (rng, level) => {
        const n = level === 1 ? rng.int(3, 4) : rng.int(4, 6);
        let value = 1;
        const factors: number[] = [];
        for (let i = n; i >= 1; i--) {
          value *= i;
          factors.push(i);
        }
        const count = rng.int(3, 5);
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count);
        const shown = digits.join(", ");
        const countWord = ["", "", "", "dreistellige", "vierstellige", "fünfstellige"][count];
        const places = Array.from({ length: count }, (_, i) => count - i);
        const once = places.reduce((product, p) => product * p, 1);
        const repeated = count ** count;
        if (level === 1)
          return task(
            level,
            `${n} Kinder stellen sich in einer Reihe auf. Wie viele verschiedene Reihenfolgen gibt es?`,
            "",
            [num("Reihenfolgen:", value, "", 0, { slips: [{ value: n * n, hint: "Wer schon steht, kann nicht noch einmal gewählt werden." }] })],
            `Für den ersten Platz gibt es ${n} Kinder, für den nächsten eines weniger.`,
            `${factors.join(" · ")} = ${value}.`,
            `Es gibt ${value} Reihenfolgen.`,
            { n },
          );
        return task(
          level,
          "",
          `Aus den Ziffern ${shown} sollen ${countWord} Zahlen entstehen, in denen jede Ziffer genau einmal vorkommt. Wie viele sind das? Wie viele wären es, wenn Ziffern mehrfach vorkommen dürften?`,
          [
            num("Jede Ziffer einmal:", once, "", 0),
            num("Ziffern mehrfach erlaubt:", repeated, "", 0),
          ],
          "Überlege für jede Stelle, wie viele Ziffern noch möglich sind.",
          `Einmal: ${places.join(" · ")} = ${n0(once)}. Mehrfach: ${places.map(() => count).join(" · ")} = ${n0(repeated)}.`,
          `${n0(once)} Zahlen ohne Wiederholung, ${n0(repeated)} mit Wiederholung.`,
          { n, count },
        );
      },
    },
  ],
});

export const STAGE_NATUERLICH = makeStage(
  1,
  "Zahlen bis in die Milliarden, Rechengesetze, Potenzen, Teiler und Kombinatorik",
  "#2563eb",
  "🔢",
  [
    zahlenmenge,
    stufenzahlen,
    zahlenstrahl,
    runden,
    dualsystem,
    roemisch,
    addSub,
    multDiv,
    sachaufgaben,
    rechenregeln,
    rechengesetze,
    potenzen,
    zehnerpotenzen,
    wachstum,
    teilbarkeit,
    primfaktoren,
    ggtKgv,
    kombinatorik,
  ],
);
