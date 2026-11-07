import { fmt, paren } from "../exercises/format";
import {
  digitSum,
  divisionSteps,
  factorText,
  isPrime,
  multiplicativeEquation,
  primeFactors,
  roundTo,
  sup,
  termKind,
  termSolve,
  termText,
  termValue,
  type TermNode,
} from "../models";
import { MIXED_TERMS } from "../lab/views-gym";
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
const p0 = (value: number) => paren(value, 0);
const L1 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(3, step, 1, content);
const L2 = (step: number, content: Parameters<typeof makeLesson>[3]) => makeLesson(3, step, 2, content);
/** A base as written in a power: negative bases stand in brackets. */
const baseText = (base: number) => (base < 0 ? `(−${-base})` : String(base));

const multiplizieren = L1(1, {
  id: "mu-1-multiplizieren",
  title: "3.1 Schriftlich multiplizieren",
  subtitle: "Auch mit mehrstelligen Faktoren",
  whyItMatters:
    "Wie viele Sitze hat ein Stadion mit 38 Blöcken zu je 245 Plätzen? Das Verfahren funktioniert für beliebig lange Zahlen, der Überschlag prüft das Ergebnis.",
  explanationHtml: `<p>Beim <strong>schriftlichen Multiplizieren</strong> nimmst du den ersten Faktor mit jeder Stelle des zweiten Faktors mal. Jede Teilrechnung rückt eine Stelle nach links. Am Ende addierst du alle Teilergebnisse. Das Ergebnis heißt <strong>Produkt</strong>, die Zahlen heißen <strong>Faktoren</strong>.</p><p>Prüfe mit einem <strong>Überschlag</strong>: Runde beide Faktoren auf eine von null verschiedene Stelle und rechne im Kopf.</p><div class="example">245 · 38: 245 · 3 = 735 (rückt um eine Stelle: 7.350), 245 · 8 = 1.960. Summe: 9.310. Überschlag: 200 · 40 = 8.000. Das passt zur Größenordnung.</div><div class="merke"><strong>Merke:</strong> Stelle für Stelle multiplizieren, jede Zeile eine Stelle weiter links beginnen, addieren, Überschlag machen.</div>`,
  formulas: [
    { name: "Produkt", html: "Faktor · Faktor = Produkt", quantities: "Die Fachbegriffe beim Multiplizieren" },
  ],
  quiz: {
    question: "Welcher Überschlag passt zu 512 · 29?",
    options: ["500 · 30 = 15.000", "500 · 20 = 10.000", "600 · 30 = 18.000"],
    correctIndex: 0,
    explanation: "512 rundest du auf 500, 29 auf 30.",
  },
  lab: lab(
    "written-mult",
    "Teilergebnisse sehen",
    "Stelle zwei Zahlen ein. Die App zeigt die Rechnung mit Teilergebnissen.",
    [c("op", "Rechenart", ["Multiplikation", "Division"]), r("a", "Erste Zahl", 100, 999, 234), r("b", "Zweite Zahl", 2, 25, 6)],
    [
      o("ergebnis", "Ergebnis", (v) => (v.op === 0 ? n0(v.a * v.b) : `${n0(Math.floor(v.a / v.b))} Rest ${v.a % v.b}`)),
      o("ueberschlag", "Überschlag", (v) => (v.op === 0 ? `${n0(roundTo(v.a, 100))} · ${n0(roundTo(v.b, 10) || v.b)}` : "nur beim Multiplizieren")),
    ],
    [
      { id: "tausend", text: "Finde eine Multiplikation mit dem Produkt 1.000.", check: (v) => v.op === 0 && v.a * v.b === 1000 },
      { id: "zwanzig", text: "Rechne 500 mal 20.", check: (v) => v.op === 0 && v.a === 500 && v.b === 20 },
      { id: "gross", text: "Finde das größte Produkt, das hier möglich ist.", check: (v) => v.op === 0 && v.a === 999 && v.b === 25 },
    ],
  ),
  exercises: [
    {
      id: "produkt",
      make: (rng, level) => {
        const a = rng.int(112, 987), b = rng.int(13, 96);
        if (level === 1)
          return task(
            level,
            `Berechne schriftlich: ${n0(a)} · ${b}.`,
            "",
            [num("Produkt:", a * b, "", 0)],
            "Multipliziere stellenweise und addiere die Teilergebnisse.",
            `${n0(a)} · ${Math.floor(b / 10)} · 10 = ${n0(a * Math.floor(b / 10) * 10)} und ${n0(a)} · ${b % 10} = ${n0(a * (b % 10))}.`,
            `Das Produkt ist ${n0(a * b)}.`,
            { a, b },
          );
        const rows = rng.int(120, 480), seats = rng.int(112, 349);
        return task(
          level,
          "",
          `Eine Druckerei druckt ${n0(rows)} Bücher mit je ${n0(seats)} Seiten. Wie viele Seiten sind das zusammen?`,
          [num("Seiten:", rows * seats, "", 0)],
          "Beide Faktoren sind dreistellig. Ein Überschlag zeigt die Größenordnung.",
          `Überschlag: ${n0(roundTo(rows, 100))} · ${n0(roundTo(seats, 100))} = ${n0(roundTo(rows, 100) * roundTo(seats, 100))}.`,
          `Es sind ${n0(rows * seats)} Seiten.`,
          { rows, seats },
        );
      },
    },
    {
      id: "ueberschlag-produkt",
      make: (rng, level) => {
        const a = rng.int(21, 94) * 10 + rng.int(1, 4), b = rng.int(2, 8) * 10 + rng.int(1, 4);
        const rough = roundTo(a, 100) * roundTo(b, 10);
        if (level === 1)
          return task(
            level,
            `Runde den ersten Faktor auf Hunderter und den zweiten auf Zehner. Überschlage: ${a} · ${b}.`,
            "",
            [num("Überschlag:", rough, "", 0)],
            "Runden, dann im Kopf multiplizieren. Die Nullen zählst du zum Schluss dazu.",
            `${a} ≈ ${roundTo(a, 100)} und ${b} ≈ ${roundTo(b, 10)}.`,
            `Der Überschlag ist ${n0(rough)}.`,
            { a, b },
          );
        const wrong = rng.int(0, 1) === 0;
        const claimed = wrong ? a * b * 10 : a * b;
        return task(
          level,
          "",
          `Laura erhält für ${a} · ${b} das Ergebnis ${n0(claimed)}. Prüfe mit einem Überschlag: Kann das stimmen?`,
          [pick("Ihr Ergebnis …", ["kann stimmen", "kann nicht stimmen"], wrong ? 1 : 0)],
          "Überschlag bilden und die Größenordnung vergleichen.",
          `Überschlag: ${roundTo(a, 100)} · ${roundTo(b, 10)} = ${n0(rough)}. Lauras Ergebnis ist ${n0(claimed)}.`,
          wrong ? "Es kann nicht stimmen, es ist etwa 10-mal zu groß." : "Es kann stimmen, die Größenordnung passt.",
          { a, b },
        );
      },
    },
  ],
});

const dividieren = L1(2, {
  id: "mu-2-dividieren",
  title: "3.2 Schriftlich dividieren",
  subtitle: "Divisoren größer als zehn und der Rest",
  whyItMatters:
    "Teilen gerecht aufgeteilt: Wenn 1.536 Karten an 24 Klassen gehen, sagt dir die schriftliche Division, wie viele jede bekommt.",
  explanationHtml: `<p>Beim <strong>schriftlichen Dividieren</strong> gehst du von links nach rechts: Du nimmst so viele Stellen des <strong>Dividenden</strong>, bis der <strong>Divisor</strong> hineinpasst. Dann rechnest du: Wie oft passt der Divisor? Multiplizieren, abziehen, nächste Stelle herunterholen. Das Ergebnis heißt <strong>Quotient</strong>.</p><p>Bleibt am Ende etwas übrig, ist das der <strong>Rest</strong>. In Sachaufgaben überlegst du, was er bedeutet. Durch 0 kannst du nicht teilen.</p><div class="example">1.536 : 24: 153 : 24 = 6 (144), Rest 9. 96 : 24 = 4. Ergebnis 64. Überschlag: 1.500 : 25 = 60. Probe: 64 · 24 = 1.536.</div><div class="merke"><strong>Merke:</strong> Wie oft passt es? Mal, minus, herunterholen. Prüfe mit Überschlag und Probe: Quotient · Divisor + Rest = Dividend.</div>`,
  formulas: [
    { name: "Quotient", html: "Dividend : Divisor = Quotient", quantities: "Die Fachbegriffe beim Dividieren" },
    { name: "Probe", html: "Quotient · Divisor + Rest = Dividend", quantities: "Kontrolle einer Division" },
  ],
  quiz: {
    question: "Welches Ergebnis hat 1.008 : 16?",
    options: ["63", "53", "630"],
    correctIndex: 0,
    explanation: "100 : 16 = 6 (96), Rest 4. 48 : 16 = 3. Also 63. Probe: 63 · 16 = 1.008.",
  },
  lab: lab(
    "written-mult",
    "Division Schritt für Schritt",
    "Wähle die Division und stelle Dividend und Divisor ein.",
    [c("op", "Rechenart", ["Multiplikation", "Division"], 1), r("a", "Dividend", 100, 999, 234), r("b", "Divisor", 2, 25, 6)],
    [
      o("ergebnis", "Quotient und Rest", (v) => (v.op === 1 ? `${n0(Math.floor(v.a / v.b))} Rest ${v.a % v.b}` : n0(v.a * v.b))),
      o("probe", "Probe", (v) => (v.op === 1 ? `${n0(Math.floor(v.a / v.b))} · ${v.b} + ${v.a % v.b} = ${n0(v.a)}` : "nur beim Dividieren")),
    ],
    [
      { id: "ohne-rest", text: "Finde 936 : 12: Die Division geht ohne Rest auf.", check: (v) => v.op === 1 && v.a === 936 && v.b === 12 },
      { id: "rest-sieben", text: "Stelle eine Division mit dem Rest 7 und einem Divisor über 10 ein.", check: (v) => v.op === 1 && v.b > 10 && v.a % v.b === 7 },
      { id: "groesster-rest", text: "Stelle bei einem Divisor von 25 den größtmöglichen Rest ein.", check: (v) => v.op === 1 && v.b === 25 && v.a % 25 === 24 },
    ],
  ),
  exercises: [
    {
      id: "quotient",
      make: (rng, level) => {
        const divisor = rng.int(12, 48), quotient = rng.int(23, 98);
        const dividend = divisor * quotient;
        if (level === 1) {
          const steps = divisionSteps(dividend, divisor);
          return task(
            level,
            `Berechne schriftlich: ${n0(dividend)} : ${divisor}.`,
            "",
            [num("Quotient:", quotient, "", 0)],
            "Wie oft passt der Divisor? Mal, minus, herunterholen.",
            steps
              .map((s, i) =>
                s.part === 0
                  ? "Die heruntergeholte 0 ergibt im Quotienten eine 0."
                  : `${i === 0 ? "" : "Dann "}${n0(s.part)} : ${divisor} = ${s.digit}, Rest ${s.rest}.`,
              )
              .join(" "),
            `Der Quotient ist ${quotient}.`,
            { divisor, quotient },
          );
        }
        const rest = rng.int(1, divisor - 1);
        const total = dividend + rest;
        return task(
          level,
          "",
          `Ein Verein packt ${n0(total)} Äpfel in Kisten zu je ${divisor} Stück. Wie viele volle Kisten entstehen, und wie viele Äpfel bleiben übrig?`,
          [num("Volle Kisten:", quotient, "", 0), num("Äpfel übrig:", rest, "", 0)],
          "Der Rest gibt an, was nicht mehr für eine volle Kiste reicht.",
          `${n0(total)} : ${divisor} = ${quotient} Rest ${rest}. Probe: ${quotient} · ${divisor} + ${rest} = ${n0(total)}.`,
          `${quotient} volle Kisten, ${rest === 1 ? "1 Apfel" : `${rest} Äpfel`} übrig.`,
          { divisor, quotient, rest },
        );
      },
    },
    {
      id: "rest-deuten",
      make: (rng, level) => {
        const size = rng.pick([12, 15, 18, 24, 25]);
        const groups = rng.int(11, 40);
        const rest = rng.int(1, size - 1);
        const total = size * groups + rest;
        if (level === 1)
          return task(
            level,
            `Berechne ${n0(total)} : ${size}. Gib Quotient und Rest an.`,
            "",
            [num("Quotient:", groups, "", 0), num("Rest:", rest, "", 0)],
            "Der Rest ist immer kleiner als der Divisor.",
            `${groups} · ${size} = ${n0(groups * size)}. ${n0(total)} − ${n0(groups * size)} = ${rest}.`,
            `${n0(total)} : ${size} = ${groups} Rest ${rest}`,
            { size, groups, rest },
          );
        return task(
          level,
          "",
          `${n0(total)} Fans wollen mit Bussen zu einem Spiel. In einen Bus passen ${size * 2} Personen. Wie viele Busse braucht der Fanclub, damit alle mitfahren können?`,
          [num("Busse:", Math.ceil(total / (size * 2)), "", 0, { slips: [{ value: Math.floor(total / (size * 2)), hint: "Dann bleiben Fans zurück. Auch für den Rest braucht es einen Bus." }] })],
          "Dividiere und überlege, was der Rest bedeutet.",
          `${n0(total)} : ${size * 2} = ${Math.floor(total / (size * 2))} Rest ${total % (size * 2)}.`,
          `Der Fanclub braucht ${Math.ceil(total / (size * 2))} Busse.`,
          { size, groups, rest },
        );
      },
    },
  ],
});

const teilbarkeit = L1(3, {
  id: "mu-3-teilbarkeit",
  title: "3.3 Teilbarkeitsregeln",
  subtitle: "Durch 2, 3, 5 und 10 auf einen Blick",
  whyItMatters:
    "Geht die Division auf? Oft siehst du das, ohne zu rechnen. Das hilft beim Zerlegen von Zahlen und beim Argumentieren.",
  explanationHtml: `<p>Eine Zahl ist <strong>teilbar</strong>, wenn die Division ohne Rest aufgeht.</p><p>Durch <strong>2</strong>: Die letzte Ziffer ist 0, 2, 4, 6 oder 8. Durch <strong>5</strong>: Die letzte Ziffer ist 0 oder 5. Durch <strong>10</strong>: Die letzte Ziffer ist 0. Durch <strong>3</strong>: Die <strong>Quersumme</strong> (Summe aller Ziffern) ist durch 3 teilbar.</p><div class="example">2.475: Die Quersumme ist 2 + 4 + 7 + 5 = 18, also ist die Zahl durch 3 teilbar. Die letzte Ziffer ist 5: teilbar durch 5, nicht durch 2 und nicht durch 10.</div><div class="merke"><strong>Merke:</strong> 2, 5 und 10: Sieh die letzte Ziffer an. 3: Berechne die Quersumme.</div>`,
  formulas: [
    { name: "Teilbar durch 2, 5, 10", html: "Letzte Ziffer prüfen", quantities: "2: gerade, 5: 0 oder 5, 10: 0" },
    { name: "Teilbar durch 3", html: "Quersumme durch 3 teilbar", quantities: "Quersumme: Summe aller Ziffern" },
  ],
  quiz: {
    question: "Welche Zahl ist durch 3 teilbar?",
    options: ["4.512", "4.513", "4.514"],
    correctIndex: 0,
    explanation: "Die Quersumme von 4.512 ist 12 und damit durch 3 teilbar. Die anderen haben die Quersummen 13 und 14.",
  },
  lab: lab(
    "divisibility",
    "Teilbarkeit prüfen",
    "Ziehe die Zahl. Die App zeigt die Quersumme und die Teilbarkeit.",
    [r("n", "Zahl", 2, 300, 14)],
    [
      o("quersumme", "Quersumme", (v) => digitSum(v.n)),
      o("teilbar", "Teilbar durch", (v) => [2, 3, 5, 10].filter((d) => v.n % d === 0).join(", ") || "keine davon"),
    ],
    [
      { id: "alle", text: "Finde die kleinste Zahl, die durch 2, 3, 5 und 10 teilbar ist.", check: (v) => v.n === 30 },
      { id: "nur-drei", text: "Finde eine Zahl über 100, die durch 3, aber nicht durch 2 und nicht durch 5 teilbar ist.", check: (v) => v.n > 100 && v.n % 3 === 0 && v.n % 2 !== 0 && v.n % 5 !== 0 },
      { id: "keine", text: "Finde eine Zahl über 200, die durch keine der vier Zahlen teilbar ist.", check: (v) => v.n > 200 && [2, 3, 5, 10].every((d) => v.n % d !== 0) },
    ],
  ),
  exercises: [
    {
      id: "teilbar-pruefen",
      make: (rng, level) => {
        const divisor = rng.pick([2, 3, 5, 10]);
        const base = rng.int(1000, 99999);
        const n = rng.int(0, 1) === 0 ? base - (base % divisor) : base - (base % divisor) + 1;
        const yes = n % divisor === 0;
        if (level === 1)
          return task(
            level,
            `Ist die Zahl ${n0(n)} durch ${divisor} teilbar oder nicht?`,
            "",
            [pick("Teilbar:", ["ja", "nein"], yes ? 0 : 1)],
            divisor === 3 ? "Berechne die Quersumme." : "Sieh dir die letzte Ziffer an.",
            divisor === 3 ? `Die Quersumme ist ${digitSum(n)}.` : `Die letzte Ziffer ist ${n % 10}.`,
            yes ? `Ja, ${n0(n)} ist durch ${divisor} teilbar.` : `Nein, ${n0(n)} ist nicht durch ${divisor} teilbar.`,
            { n, divisor },
          );
        const kids = rng.pick([3, 5, 10]);
        const raw = rng.int(100, 999);
        const candies = raw - (raw % kids) + rng.int(0, 1);
        const ok = candies % kids === 0;
        return task(
          level,
          "",
          `Eine Gruppe aus ${kids} Kindern möchte ${candies} Murmeln gerecht und ohne Rest teilen. Geht das? Entscheide mit einer Teilbarkeitsregel, ohne zu dividieren.`,
          [pick("Geht:", ["ja", "nein"], ok ? 0 : 1)],
          kids === 3 ? "Quersumme bilden." : "Letzte Ziffer ansehen.",
          kids === 3 ? `Die Quersumme von ${candies} ist ${digitSum(candies)}.` : `Die letzte Ziffer von ${candies} ist ${candies % 10}.`,
          ok ? "Ja, es geht ohne Rest." : "Nein, es bleibt ein Rest.",
          { kids, candies },
        );
      },
    },
    {
      id: "ziffer-ergaenzen",
      make: (rng, level) => {
        const a = rng.int(1, 9), b = rng.int(0, 9), last = rng.pick([1, 2, 4, 5, 7, 8]);
        const smallest = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((d) => (a + b + d + last) % 3 === 0)!;
        if (level === 1) {
          const n = a * 1000 + b * 100 + smallest * 10 + last;
          return task(
            level,
            `Berechne die Quersumme der Zahl ${n0(n)}.`,
            "",
            [num("Quersumme:", digitSum(n), "", 0)],
            "Addiere alle Ziffern.",
            `${a} + ${b} + ${smallest} + ${last} = ${digitSum(n)}.`,
            `Die Quersumme ist ${digitSum(n)}, also ist die Zahl durch 3 teilbar.`,
            { n },
          );
        }
        return task(
          level,
          "",
          `Welche kleinste Ziffer kannst du für das Fragezeichen in ${a}.${b}?${last} einsetzen, damit die Zahl durch 3 teilbar wird?`,
          [num("Ziffer:", smallest, "", 0)],
          "Die Quersumme muss durch 3 teilbar sein.",
          `${a} + ${b} + ${last} = ${a + b + last}. Mit ${smallest} ergibt sich ${a + b + last + smallest}.`,
          `Die kleinste Ziffer ist ${smallest}.`,
          { a, b, last },
        );
      },
    },
  ],
});

const COMPOSITES = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 66, 70, 72, 75, 78, 80, 84, 90, 96, 98, 100, 105, 108, 120, 126, 135, 140, 144, 150, 168, 180, 196, 200];
const primfaktoren = L1(4, {
  id: "mu-4-primfaktoren",
  title: "3.4 Primzahlen und Primfaktorzerlegung",
  subtitle: "Jede Zahl hat genau eine Zerlegung",
  whyItMatters:
    "Primzahlen sind die Bausteine der natürlichen Zahlen. Später hilft dir ihre Zerlegung beim Rechnen mit Brüchen.",
  explanationHtml: `<p>Eine <strong>Primzahl</strong> hat genau zwei Teiler: 1 und sich selbst. Die ersten sind 2, 3, 5, 7, 11, 13, 17, 19. Die 1 ist keine Primzahl.</p><p><strong>Faktorisieren</strong> heißt: eine Zahl als Produkt schreiben. Zerlegst du so lange, bis nur noch Primzahlen dastehen, hast du die <strong>Primfaktorzerlegung</strong>. Sie ist <strong>eindeutig</strong>: Bis auf die Reihenfolge gibt es nur eine. Die Teilbarkeitsregeln helfen dir beim Finden der Faktoren.</p><div class="example">60 = 2 · 30 = 2 · 2 · 15 = 2 · 2 · 3 · 5 = 2² · 3 · 5. Auch 60 = 6 · 10 = 2 · 3 · 2 · 5 führt zu denselben Primfaktoren.</div><div class="merke"><strong>Merke:</strong> Zerlege so lange, bis nur noch Primzahlen übrig sind. Der Weg darf verschieden sein, das Ergebnis ist immer dasselbe.</div>`,
  formulas: [
    { name: "Primzahl", html: "2, 3, 5, 7, 11, 13, 17, 19, 23, …", quantities: "Genau zwei Teiler: 1 und die Zahl selbst" },
    { name: "Primfaktorzerlegung", html: "60 = 2² · 3 · 5", quantities: "Eindeutig bis auf die Reihenfolge" },
  ],
  quiz: {
    question: "Welche Darstellung ist die Primfaktorzerlegung von 36?",
    options: ["2² · 3²", "4 · 9", "6 · 6"],
    correctIndex: 0,
    explanation: "4, 6 und 9 sind keine Primzahlen. Nur 2 und 3 sind Primfaktoren.",
  },
  lab: lab(
    "factor-tree",
    "Zerlegungsbaum",
    "Ziehe die Zahl. Der Baum zerlegt sie in Primfaktoren.",
    [r("n", "Zahl", 2, 200, 12)],
    [
      o("zerlegung", "Primfaktoren", (v) => factorText(v.n)),
      o("prim", "Primzahl?", (v) => (isPrime(v.n) ? "ja" : "nein")),
    ],
    [
      { id: "prim", text: "Stelle die größte Primzahl unter 100 ein.", check: (v) => v.n === 97 },
      { id: "potenz", text: "Stelle eine Zahl ein, die nur aus lauter Zweien besteht und größer als 100 ist.", check: (v) => v.n === 128 },
      { id: "drei-verschiedene", text: "Stelle die kleinste Zahl mit drei verschiedenen Primfaktoren ein.", check: (v) => v.n === 30 },
    ],
  ),
  exercises: [
    {
      id: "zerlegung-finden",
      make: (rng, level) => {
        const n = rng.pick(COMPOSITES);
        const right = factorText(n);
        if (level === 1) {
          const factors = primeFactors(n);
          const wrong1 = `2 · ${n0(n / 2 === Math.floor(n / 2) ? n / 2 : n)}`;
          const other = factors[0] === 2 ? 3 : 2;
          const wrong2 = factorText(n * other);
          return task(
            level,
            `Welche Darstellung ist die Primfaktorzerlegung von ${n}?`,
            "",
            [pick("Zerlegung:", [right, wrong2, wrong1 === right ? "kein Produkt" : wrong1], 0)],
            "Alle Faktoren müssen Primzahlen sein, und das Produkt muss die Zahl ergeben.",
            `Teile der Reihe nach durch die kleinsten Primzahlen.`,
            `${n} = ${right}`,
            { n },
          );
        }
        const count = primeFactors(n).length;
        return task(
          level,
          "",
          `Zerlege ${n} vollständig in Primfaktoren. Wie viele Primfaktoren hat die Zerlegung, wenn du gleiche Faktoren einzeln zählst?`,
          [num("Anzahl:", count, "", 0)],
          "Schreibe alle Faktoren einzeln hin und zähle.",
          `${n} = ${primeFactors(n).join(" · ")}.`,
          `Die Zerlegung hat ${count} Primfaktoren.`,
          { n },
        );
      },
    },
    {
      id: "aus-primfaktoren",
      make: (rng, level) => {
        const n = rng.pick(COMPOSITES);
        if (level === 1)
          return task(
            level,
            `Welche Zahl hat die Primfaktorzerlegung ${factorText(n)}?`,
            "",
            [num("Zahl:", n, "", 0)],
            "Multipliziere alle Faktoren.",
            `${primeFactors(n).join(" · ")} = ${n}.`,
            `Die Zahl heißt ${n}.`,
            { n },
          );
        const prime = rng.pick([13, 17, 19, 23, 29, 31, 37, 41, 43, 47]);
        const composite = rng.pick([21, 27, 33, 39, 49, 51, 57]);
        const candidate = rng.int(0, 1) === 0 ? prime : composite;
        const yes = isPrime(candidate);
        return task(
          level,
          "",
          `Tim sagt: „${candidate} ist eine Primzahl.“ Stimmt das? Prüfe zuerst die kleinen Primzahlen 2, 3, 5 und 7.`,
          [pick("Tim hat …", ["recht", "nicht recht"], yes ? 0 : 1)],
          "Eine Primzahl hat keinen Teiler außer 1 und sich selbst.",
          yes ? `${candidate} lässt sich durch keine kleinere Primzahl teilen.` : `${candidate} = ${primeFactors(candidate).join(" · ")}.`,
          yes ? `${candidate} ist eine Primzahl.` : `${candidate} ist keine Primzahl.`,
          { candidate },
        );
      },
    },
  ],
});

const zaehlprinzip = L1(5, {
  id: "mu-5-zaehlprinzip",
  title: "3.5 Zählprinzip und Baumdiagramm",
  subtitle: "Anzahlen systematisch bestimmen",
  whyItMatters:
    "Wie viele Kombinationen aus Hose, T-Shirt und Schuhen gibt es? Wie viele Fahrradschloss-Codes? Du musst nicht alle aufschreiben.",
  explanationHtml: `<p>Ein <strong>Baumdiagramm</strong> zeigt alle Möglichkeiten: Jede Entscheidung ist eine Stufe, jeder Weg vom Start bis zum Ende eine Möglichkeit.</p><p>Hat jede Entscheidung gleich viele Möglichkeiten, egal wie die vorige ausging, kannst du das <strong>Zählprinzip</strong> anwenden: Du multiplizierst die Anzahlen der einzelnen Stufen. Wichtig ist immer die Frage, ob in jeder Stufe wirklich gleich viele Möglichkeiten bleiben. Wenn eine Wahl weg ist, wird die nächste Stufe kleiner.</p><div class="example">3 T-Shirts, 2 Hosen, 2 Paar Schuhe: 3 · 2 · 2 = 12 Kombinationen. Drei Kinder laufen um die Wette: 3 · 2 · 1 = 6 mögliche Reihenfolgen.</div><div class="merke"><strong>Merke:</strong> Anzahl aller Möglichkeiten = Produkt der Anzahlen je Stufe. Prüfe, ob sich die Anzahl von Stufe zu Stufe ändert.</div>`,
  formulas: [
    { name: "Zählprinzip", html: "n₁ · n₂ · n₃ · …", quantities: "Anzahl der Möglichkeiten je Stufe" },
  ],
  quiz: {
    question: "Ein Zahlenschloss hat 3 Rädchen mit je 10 Ziffern. Wie viele Codes gibt es?",
    options: ["1.000", "30", "100"],
    correctIndex: 0,
    explanation: "10 · 10 · 10 = 1.000. Ziffern dürfen sich wiederholen.",
  },
  lab: lab(
    "combi-tree",
    "Baumdiagramm",
    "Stelle die Anzahlen ein. Das Diagramm zeigt alle Wege, unten steht das Produkt.",
    [r("t", "T-Shirts", 1, 4, 2), r("h", "Hosen", 1, 4, 2), r("s", "Schuhe", 1, 3, 1)],
    [o("anzahl", "Kombinationen", (v) => v.t * v.h * v.s), o("rechnung", "Rechnung", (v) => `${v.t} · ${v.h} · ${v.s}`)],
    [
      { id: "zwoelf", text: "Stelle 3 T-Shirts, 2 Hosen und 2 Paar Schuhe ein.", check: (v) => v.t === 3 && v.h === 2 && v.s === 2 },
      { id: "groesste", text: "Finde die größte Anzahl.", check: (v) => v.t === 4 && v.h === 4 && v.s === 3 },
      { id: "sechs", text: "Finde eine Einstellung mit genau 6 Kombinationen und 3 Paar Schuhen.", check: (v) => v.s === 3 && v.t * v.h === 2 },
    ],
  ),
  exercises: [
    {
      id: "kombinationen",
      make: (rng, level) => {
        const a = rng.int(2, 6), b = rng.int(2, 6), d = rng.int(2, 5);
        if (level === 1)
          return task(
            level,
            `Im Eiscafé gibt es ${a} Sorten Eis, ${b} Soßen und ${d} Arten Streusel. Wie viele verschiedene Becher mit je einer Sorte, einer Soße und einer Art Streusel kannst du wählen?`,
            "",
            [num("Anzahl:", a * b * d, "", 0, { slips: [{ value: a + b + d, hint: "Du hast addiert. Jede Wahl kombiniert sich mit jeder anderen: multiplizieren." }] })],
            "Zählprinzip: die Anzahlen je Stufe multiplizieren.",
            `${a} · ${b} · ${d} = ${a * b * d}.`,
            `Es gibt ${a * b * d} Becher.`,
            { a, b, d },
          );
        const digits = rng.int(3, 5), base = rng.pick([2, 4, 6, 10]);
        return task(
          level,
          "",
          `Ein Code besteht aus ${digits} Stellen. An jeder Stelle kannst du eines von ${base} Zeichen wählen, Zeichen dürfen sich wiederholen. Wie viele Codes gibt es?`,
          [num("Anzahl:", base ** digits, "", 0, { slips: [{ value: base * digits, hint: "Multipliziere für jede Stelle mit der Zeichenzahl, nicht einmal mit der Stellenzahl." }] })],
          "Jede Stelle ist eine Stufe im Baum.",
          `${Array.from({ length: digits }, () => base).join(" · ")} = ${n0(base ** digits)}.`,
          `Es gibt ${n0(base ** digits)} Codes.`,
          { digits, base },
        );
      },
    },
    {
      id: "zaehlprinzip-erkennen",
      make: (rng, level) => {
        const a = rng.int(2, 5), b = rng.int(2, 5), d = rng.int(2, 5);
        if (level === 1) {
          const fits = rng.int(0, 1) === 0;
          return task(
            level,
            fits
              ? `In der Mensa gibt es ${a} Vorspeisen und ${b} Hauptspeisen. Jede Vorspeise lässt sich mit jeder Hauptspeise kombinieren. Darfst du die Anzahl der Menüs mit dem Zählprinzip berechnen?`
              : `Zum Fisch gibt es ${a} Beilagen, zum Fleisch ${a + 1} Beilagen. Darfst du die Anzahl der Teller einfach mit dem Zählprinzip als Produkt berechnen?`,
            "",
            [pick("Das Zählprinzip passt:", ["ja", "nein"], fits ? 0 : 1)],
            "Prüfe: Bleibt die Anzahl der Möglichkeiten auf der zweiten Stufe gleich, egal was vorher gewählt wurde?",
            fits ? "Zu jeder Vorspeise gibt es gleich viele Hauptspeisen." : "Die Anzahl der Beilagen hängt davon ab, was zuerst gewählt wurde.",
            fits ? `Ja: ${a} · ${b} Menüs.` : `Nein: Im Baumdiagramm zählst du ${a} + ${a + 1} Wege.`,
            { a, b, fits: fits ? 1 : 0 },
          );
        }
        const total = a + (a + b) + d;
        return task(
          level,
          "",
          `Ein Imbiss bietet Fisch, Fleisch und Gemüse an. Zum Fisch passen ${a} Soßen, zum Fleisch ${a + b} Soßen und zum Gemüse ${d} Soßen. Wie viele Kombinationen aus Gericht und Soße gibt es? Zeichne ein Baumdiagramm.`,
          [num("Kombinationen:", total, "", 0, { slips: [{ value: 3 * (a + b), hint: "Die Äste haben verschieden viele Zweige. Darum passt das Zählprinzip hier nicht, zähle jeden Ast." }] })],
          "Die Anzahl der Soßen hängt vom Gericht ab. Zähle die Wege im Baumdiagramm.",
          `${a} + ${a + b} + ${d} = ${total} Wege.`,
          `Es gibt ${total} Kombinationen.`,
          { a, b, d },
        );
      },
    },
    {
      id: "ohne-wiederholung",
      make: (rng, level) => {
        const n = rng.int(3, 6);
        const order = [1, 2, 3, 4, 5, 6].slice(0, n).reduce((p, x) => p * x, 1);
        if (level === 1)
          return task(
            level,
            `${n} Freundinnen stellen sich in einer Reihe für ein Foto auf. Wie viele verschiedene Reihenfolgen gibt es?`,
            "",
            [num("Reihenfolgen:", order, "", 0)],
            `Für den ersten Platz gibt es ${n} Möglichkeiten, für den nächsten eine weniger.`,
            `${Array.from({ length: n }, (_, i) => n - i).join(" · ")} = ${order}.`,
            `Es gibt ${order} Reihenfolgen.`,
            { n },
          );
        const runners = rng.int(5, 12);
        const podium = runners * (runners - 1) * (runners - 2);
        return task(
          level,
          "",
          `Beim Sportfest laufen ${runners} Kinder um die Plätze 1, 2 und 3. Wie viele verschiedene Siegerlisten (mit Reihenfolge) sind möglich?`,
          [num("Listen:", podium, "", 0, { slips: [{ value: runners ** 3, hint: "Ein Kind kann nicht zwei Plätze belegen. Mit jedem Platz wird die Auswahl kleiner." }] })],
          "Beim zweiten Platz bleibt ein Kind weniger zur Wahl.",
          `${runners} · ${runners - 1} · ${runners - 2} = ${n0(podium)}.`,
          `Es gibt ${n0(podium)} Siegerlisten.`,
          { runners },
        );
      },
    },
  ],
});

const vorzeichen = L1(6, {
  id: "mu-6-vorzeichen",
  title: "3.6 Vorzeichenregeln",
  subtitle: "Produkte und Quotienten ganzer Zahlen",
  whyItMatters:
    "Warum ist „minus mal minus“ plus? Ein einfaches Muster macht das plausibel, und danach rechnest du auch das im Kopf.",
  explanationHtml: `<p>Das Muster zeigt die Regel: 3 · (−2) = −6, denn das sind dreimal 2 € Schulden. Rechne weiter: 2 · (−2) = −4, 1 · (−2) = −2, 0 · (−2) = 0. Bei jedem Schritt wird das Ergebnis um 2 größer. Also geht es so weiter: (−1) · (−2) = 2, (−2) · (−2) = 4.</p><p>Es gilt: <strong>Gleiche Vorzeichen ergeben Plus, verschiedene Vorzeichen ergeben Minus.</strong> Für das Dividieren gilt dieselbe Regel, weil Dividieren die Umkehrung des Multiplizierens ist.</p><div class="example">(−6) · 7 = −42. (−6) · (−7) = 42. (−42) : (−6) = 7. 42 : (−6) = −7.</div><div class="merke"><strong>Merke:</strong> Erst den Betrag rechnen, dann das Vorzeichen setzen: gleiche Vorzeichen plus, verschiedene minus.</div>`,
  formulas: [
    { name: "Vorzeichenregel", html: "(+) · (+) = +, (−) · (−) = +, (+) · (−) = −, (−) · (+) = −", quantities: "Beim Dividieren genauso" },
  ],
  quiz: {
    question: "Was ergibt (−8) : (−2)?",
    options: ["4", "−4", "16"],
    correctIndex: 0,
    explanation: "Gleiche Vorzeichen ergeben Plus. 8 : 2 = 4.",
  },
  lab: lab(
    "int-mult",
    "Vorzeichentabelle",
    "Wähle die Rechenart und stelle a und b ein. Die passende Zeile der Tabelle leuchtet.",
    [c("op", "Rechenart", ["mal", "geteilt"]), r("a", "a (bei „geteilt“ der Quotient)", -12, 12, 3), r("b", "b (bei „geteilt“ der Divisor)", -12, 12, 2)],
    [
      o("ergebnis", "Ergebnis", (v) => (v.op === 0 ? n0(v.a * v.b) : v.b === 0 ? "nicht erlaubt" : n0(v.a))),
      o("vorzeichen", "Vorzeichen des Ergebnisses", (v) => { if (v.op === 1 && v.b === 0) return "nicht erlaubt"; const value = v.op === 0 ? v.a * v.b : v.a; return value > 0 ? "plus" : value < 0 ? "minus" : "keines"; }),
    ],
    [
      { id: "minus-minus", text: "Stelle (−4) · (−5) ein.", check: (v) => v.op === 0 && v.a === -4 && v.b === -5 },
      { id: "plus-minus", text: "Stelle 6 · (−7) ein.", check: (v) => v.op === 0 && v.a === 6 && v.b === -7 },
      { id: "geteilt", text: "Wähle „geteilt“ und zeige 12 : (−3) = −4: Stelle dazu den Quotienten a und den Divisor b ein.", check: (v) => v.op === 1 && v.a === -4 && v.b === -3 },
    ],
  ),
  exercises: [
    {
      id: "produkt-quotient",
      make: (rng, level) => {
        const a = rng.sign() * rng.int(2, 15), b = rng.sign() * rng.int(2, 15);
        if (level === 1) {
          const product = rng.int(0, 1) === 0;
          const value = product ? a * b : a;
          const shown = product ? `${p0(a)} · ${p0(b)}` : `${p0(a * b)} : ${p0(b)}`;
          return task(
            level,
            `Berechne den Wert des Terms ${shown}.`,
            "",
            [num("Ergebnis:", value, "", 0, { slips: [{ value: -value, hint: "Der Betrag stimmt. Wende die Vorzeichenregel an." }] })],
            "Gleiche Vorzeichen: Plus. Verschiedene Vorzeichen: Minus.",
            product ? `Betrag: ${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(a * b)}.` : `Betrag: ${Math.abs(a * b)} : ${Math.abs(b)} = ${Math.abs(a)}.`,
            `Das Ergebnis ist ${n0(value)}.`,
            { a, b },
          );
        }
        const debts = rng.int(3, 12), each = rng.int(4, 30);
        return task(
          level,
          "",
          `Der Kontostand einer Kasse ändert sich an ${debts} Tagen jeweils um −${each} €. Um wie viel Euro hat er sich insgesamt geändert? Schreibe ein Produkt mit einer negativen Zahl.`,
          [num("Änderung:", -debts * each, "€", 0, { slips: [{ value: debts * each, hint: "Das Konto wird weniger. Die Änderung muss negativ sein." }] })],
          "Wiederholte Addition einer negativen Zahl ist ein Produkt.",
          `${debts} · (−${each}) = ${n0(-debts * each)}.`,
          `Die Änderung beträgt ${n0(-debts * each)} €.`,
          { debts, each },
        );
      },
    },
    {
      id: "vorzeichen-zaehlen",
      make: (rng, level) => {
        const factors = Array.from({ length: rng.int(3, 5) }, () => rng.sign() * rng.int(1, 3));
        const negatives = factors.filter((f) => f < 0).length;
        const value = factors.reduce((p, f) => p * f, 1);
        const text = factors.map(p0).join(" · ");
        if (level === 1)
          return task(
            level,
            `Berechne den Wert des Produkts ${text}.`,
            "",
            [num("Produkt:", value, "", 0)],
            "Zähle die negativen Faktoren: gerade Anzahl: Plus, ungerade Anzahl: Minus.",
            `${negatives === 1 ? "1 negativer Faktor" : `${negatives} negative Faktoren`}: Das Ergebnis ist ${negatives % 2 === 0 ? "positiv" : "negativ"}.`,
            `Das Produkt ist ${n0(value)}.`,
            { negatives },
          );
        return task(
          level,
          "",
          `Das Produkt ${text} wird nicht ausgerechnet. Ist sein Wert positiv oder negativ?`,
          [pick("Der Wert ist …", ["positiv", "negativ"], negatives % 2 === 0 ? 0 : 1)],
          "Zähle die negativen Faktoren.",
          `${negatives === 1 ? "1 negativer Faktor" : `${negatives} negative Faktoren`}: ${negatives % 2 === 0 ? "gerade" : "ungerade"} Anzahl.`,
          `Der Wert ist ${negatives % 2 === 0 ? "positiv" : "negativ"}.`,
          { negatives },
        );
      },
    },
  ],
});

const rechenvorteile = L1(7, {
  id: "mu-7-rechenvorteile",
  title: "3.7 Rechenvorteile beim Multiplizieren",
  subtitle: "Faktoren geschickt vertauschen und zusammenfassen",
  whyItMatters:
    "4 · 17 · 25 sieht schwer aus. Fasst du 4 · 25 zuerst zusammen, ist es leicht.",
  explanationHtml: `<p>Beim Multiplizieren gelten das <strong>Kommutativgesetz</strong> a · b = b · a und das <strong>Assoziativgesetz</strong> (a · b) · c = a · (b · c). Du darfst Faktoren also vertauschen und beliebig zusammenfassen. Negative Zahlen nehmen ihr Vorzeichen mit.</p><p>Suche Paare, die eine runde Zahl ergeben: 2 · 5, 4 · 25, 8 · 125, 20 · 5.</p><div class="example">4 · 17 · 25 = 4 · 25 · 17 = 100 · 17 = 1.700. (−5) · 13 · 2 = (−5) · 2 · 13 = (−10) · 13 = −130.</div><div class="merke"><strong>Merke:</strong> In einem reinen Produkt darfst du vertauschen und zusammenfassen. Das gilt nicht für den Quotienten: 12 : 3 ist nicht 3 : 12.</div>`,
  formulas: [
    { name: "Kommutativgesetz", html: "a · b = b · a", quantities: "Faktoren vertauschen" },
    { name: "Assoziativgesetz", html: "(a · b) · c = a · (b · c)", quantities: "Faktoren zusammenfassen" },
    { name: "Runde Paare", html: "2 · 5, 4 · 25, 8 · 125", quantities: "Ergeben 10, 100, 1.000" },
  ],
  quiz: {
    question: "Wie rechnest du 25 · 19 · 4 geschickt?",
    options: ["(25 · 4) · 19 = 1.900", "(25 · 19) · 4 = 1.800", "25 · (19 + 4) = 575"],
    correctIndex: 0,
    explanation: "25 · 4 = 100, dann 100 · 19 = 1.900.",
  },
  lab: lab(
    "laws",
    "Gesetze ansehen",
    "Wähle ein Gesetz und stelle a, b und c ein. Beide Rechnungen ergeben dasselbe.",
    [c("law", "Gesetz", ["Kommutativgesetz", "Assoziativgesetz"]), r("a", "a", 1, 40, 6), r("b", "b", 1, 40, 4), r("c", "c", 1, 40, 3)],
    [
      o("wert", "Wert", (v) => n0(v.law === 0 ? v.a * v.b : v.a * v.b * v.c)),
      o("schritt", "Rechnung", (v) => (v.law === 0 ? `${v.a} · ${v.b} = ${v.b} · ${v.a}` : `(${v.a} · ${v.b}) · ${v.c}`)),
    ],
    [
      { id: "tauschen", text: "Zeige beim Kommutativgesetz 25 · 4.", check: (v) => v.law === 0 && v.a === 25 && v.b === 4 },
      { id: "hundert", text: "Stelle beim Assoziativgesetz a = 25, b = 4 und c = 37 ein.", check: (v) => v.law === 1 && v.a === 25 && v.b === 4 && v.c === 37 },
      { id: "tausend", text: "Finde beim Assoziativgesetz a, b und c mit dem Produkt 1.000 und a = 25, b = 4.", check: (v) => v.law === 1 && v.a === 25 && v.b === 4 && v.c === 10 },
    ],
  ),
  exercises: [
    {
      id: "geschickt-multiplizieren",
      make: (rng, level) => {
        const [x, y] = rng.pick([[4, 25], [2, 5], [5, 20], [8, 125], [2, 50]]);
        const k = rng.int(3, 79);
        const sign = rng.sign();
        const value = sign * x * y * k;
        if (level === 1)
          return task(
            level,
            `Rechne geschickt und im Kopf: ${sign < 0 ? `(−${x})` : x} · ${k} · ${y}.`,
            "",
            [num("Produkt:", value, "", 0)],
            `Fasse zuerst ${sign < 0 ? `(−${x})` : x} · ${y} zusammen.`,
            `${sign < 0 ? `(−${x})` : x} · ${y} = ${n0(sign * x * y)}, dann ${p0(sign * x * y)} · ${k} = ${n0(value)}.`,
            `Das Ergebnis ist ${n0(value)}.`,
            { x, y, k },
          );
        const boxes = rng.pick([4, 5, 8]);
        const packs = boxes === 8 ? 125 : boxes === 4 ? 25 : 20;
        return task(
          level,
          "",
          `Ein Laden bekommt ${boxes} Paletten mit je ${k} Kartons, in jedem Karton sind ${packs} Packungen. Wie viele Packungen sind das? Rechne geschickt.`,
          [num("Packungen:", boxes * packs * k, "", 0)],
          "Vertausche die Faktoren so, dass ein rundes Zwischenergebnis entsteht.",
          `${boxes} · ${packs} = ${n0(boxes * packs)}, dann ${n0(boxes * packs)} · ${k}.`,
          `Es sind ${n0(boxes * packs * k)} Packungen.`,
          { boxes, k },
        );
      },
    },
    {
      id: "gesetz-erkennen",
      make: (rng, level) => {
        const a = rng.int(3, 20), b = rng.int(3, 20), d = rng.int(3, 20);
        if (level === 1) {
          const comm = rng.int(0, 1) === 0;
          return task(
            level,
            comm ? `Welches Gesetz zeigt ${a} · ${b} = ${b} · ${a}?` : `Welches Gesetz zeigt (${a} · ${b}) · ${d} = ${a} · (${b} · ${d})?`,
            "",
            [pick("Gesetz:", ["Kommutativgesetz", "Assoziativgesetz"], comm ? 0 : 1)],
            "Kommutativ: vertauschen. Assoziativ: Klammer verschieben.",
            comm ? "Die Faktoren werden vertauscht." : "Die Reihenfolge bleibt, die Klammer wandert.",
            comm ? "Es ist das Kommutativgesetz." : "Es ist das Assoziativgesetz.",
            { a, b, d },
          );
        }
        const claims = [
          [`${n0(a * b)} : ${b} = ${b} : ${n0(a * b)}`, false, "Beim Dividieren darfst du nicht vertauschen."],
          [`${a} · ${b} · ${d} = ${d} · ${a} · ${b}`, true, "Faktoren darfst du beliebig vertauschen."],
          [`(${a} · ${b}) · ${d} = ${a} · (${b} · ${d})`, true, "Faktoren darfst du beliebig zusammenfassen."],
          [`(${n0(a * b * d)} : ${b}) : ${d} = ${n0(a * b * d)} : (${b} : ${d})`, false, "Links wird nacheinander geteilt; rechts steht eine andere Rechnung."],
        ] as const;
        const [claim, truth, why] = rng.pick(claims);
        return task(
          level,
          "",
          `Stimmt die Gleichung? Entscheide mit den Rechengesetzen: ${claim}`,
          [pick("Die Gleichung …", ["stimmt", "stimmt nicht"], truth ? 0 : 1)],
          "Kommutativ- und Assoziativgesetz gelten für Produkte, nicht für Quotienten.",
          why,
          truth ? "Die Gleichung stimmt." : "Die Gleichung stimmt nicht.",
          { a, b, d },
        );
      },
    },
  ],
});

const potenzen = L1(8, {
  id: "mu-8-potenzen",
  title: "3.8 Potenzen",
  subtitle: "Ganzzahlige Basen und natürliche Exponenten",
  whyItMatters:
    "Lange Produkte aus gleichen Faktoren lassen sich kurz schreiben. Bei negativer Basis musst du genau hinsehen.",
  explanationHtml: `<p>Eine <strong>Potenz</strong> ist ein Produkt aus gleichen Faktoren: 2⁴ = 2 · 2 · 2 · 2 = 16. Die <strong>Basis</strong> 2 gibt den Faktor an, der <strong>Exponent</strong> 4 sagt, wie oft er vorkommt.</p><p>Auch negative Zahlen können Basis sein. Dann steht die Basis in Klammern: (−2)³ = (−2) · (−2) · (−2) = −8. Bei geradem Exponenten ist der Wert positiv, bei ungeradem negativ. Ohne Klammer gehört das Minus nicht zur Basis: −3² = −9, aber (−3)² = 9.</p><div class="example">5¹ = 5, 2⁵ = 32, (−3)³ = −27, (−3)⁴ = 81, 1⁷ = 1.</div><div class="merke"><strong>Merke:</strong> Basis hoch Exponent: Der Exponent zählt die Faktoren. 2³ ist 2 · 2 · 2, nicht 2 · 3.</div>`,
  formulas: [
    { name: "Potenz", html: "a<sup>n</sup> = a · a · … · a", quantities: "a Basis, n Exponent, n gleiche Faktoren" },
    { name: "Negative Basis", html: "(−3)² = 9, −3² = −9", quantities: "Die Klammer entscheidet" },
  ],
  quiz: {
    question: "Welchen Wert hat (−2)⁴?",
    options: ["16", "−16", "−8"],
    correctIndex: 0,
    explanation: "Vier negative Faktoren: gerade Anzahl, also positiv. 2 · 2 · 2 · 2 = 16.",
  },
  lab: lab(
    "power",
    "Potenzen bauen",
    "Stelle Basis und Exponent ein. Die App schreibt das Produkt aus.",
    [r("base", "Basis", -10, 20, 3), r("exp", "Exponent", 1, 6, 2)],
    [
      o("wert", "Wert", (v) => n0(v.base ** v.exp)),
      o("faktoren", "Anzahl der Faktoren", (v) => v.exp),
    ],
    [
      { id: "minus-acht", text: "Stelle (−2)³ ein.", check: (v) => v.base === -2 && v.exp === 3 },
      { id: "plus-sechzehn", text: "Finde eine negative Basis mit dem Wert 16.", check: (v) => v.base < 0 && v.base ** v.exp === 16 },
      { id: "million", text: "Finde mit Basis 10 den Wert 1 Million.", check: (v) => v.base === 10 && v.exp === 6 },
    ],
  ),
  exercises: [
    {
      id: "potenzwert",
      make: (rng, level) => {
        const base = rng.sign() * rng.int(2, 6), exp = rng.int(2, 4);
        const value = base ** exp;
        if (level === 1)
          return task(
            level,
            `Berechne den Wert der Potenz ${baseText(base)}${sup(exp)}.`,
            "",
            [num("Wert:", value, "", 0, { slips: [{ value: base * exp, hint: "Der Exponent sagt, wie oft der Faktor vorkommt. Er ist kein Faktor." }] })],
            "Schreibe das Produkt aus und zähle die negativen Faktoren.",
            `${Array.from({ length: exp }, () => baseText(base)).join(" · ")} = ${n0(value)}.`,
            `Der Wert ist ${n0(value)}.`,
            { base, exp },
          );
        const a = rng.int(2, 7);
        const form = rng.int(0, 1);
        const shown = form === 0 ? `−${a}²` : `(−${a})²`;
        const answer = form === 0 ? -a * a : a * a;
        return task(
          level,
          "",
          `Welchen Wert hat ${shown}? Achte darauf, ob das Minuszeichen zur Basis gehört.`,
          [num("Wert:", answer, "", 0, { slips: [{ value: -answer, hint: "Prüfe, ob das Minuszeichen zur Basis gehört." }] })],
          "Ohne Klammer gehört das Minus nicht zur Basis.",
          form === 0 ? `−${a}² bedeutet −(${a} · ${a}).` : `(−${a})² bedeutet (−${a}) · (−${a}).`,
          `Der Wert ist ${n0(answer)}.`,
          { a, form },
        );
      },
    },
    {
      id: "exponent-finden",
      make: (rng, level) => {
        const base = rng.pick([2, 3, 4, 5]), exp = rng.int(2, base === 2 ? 8 : 4);
        if (level === 1)
          return task(
            level,
            `Schreibe ${Array.from({ length: exp }, () => base).join(" · ")} als Potenz. Wie heißt der Exponent?`,
            "",
            [num("Exponent:", exp, "", 0, { slips: [{ value: base, hint: "Das ist die Basis. Der Exponent zählt die Faktoren." }] })],
            "Zähle die gleichen Faktoren.",
            `${exp} gleiche Faktoren: ${base}${sup(exp)}.`,
            `Der Exponent ist ${exp}.`,
            { base, exp },
          );
        return task(
          level,
          "",
          `Welcher Exponent x passt: ${base}<sup>x</sup> = ${n0(base ** exp)}?`,
          [num("x =", exp, "", 0)],
          "Multipliziere die Basis so oft, bis der Wert erreicht ist.",
          `${Array.from({ length: exp }, () => base).join(" · ")} = ${n0(base ** exp)}.`,
          `x = ${exp}`,
          { base, exp },
        );
      },
    },
  ],
});

const quadratzahlen = L1(9, {
  id: "mu-9-quadratzahlen",
  title: "3.9 Quadratzahlen bis 400",
  subtitle: "Auswendig und sicher",
  whyItMatters:
    "Quadratzahlen tauchen überall auf: bei Flächen, später in der Algebra. Bis 400 solltest du sie ohne Nachdenken abrufen können.",
  explanationHtml: `<p>Eine <strong>Quadratzahl</strong> ist das Produkt einer Zahl mit sich selbst: n² = n · n. Ein Quadrat aus n mal n Kästchen besteht aus n² Kästchen.</p><p>Lerne die Reihe bis 20² = 400 auswendig: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400.</p><div class="example">13² = 169, 15² = 225, 19² = 361. (−7)² ist ebenfalls 49. Der Unterschied zwischen 12² und 11² ist 144 − 121 = 23.</div><div class="merke"><strong>Merke:</strong> Die Quadratzahlen bis 400 gehören zu deinem automatischen Wissen.</div>`,
  formulas: [
    { name: "Quadratzahl", html: "n² = n · n", quantities: "1, 4, 9, …, 400" },
    { name: "Reihe von 11² bis 20²", html: "121, 144, 169, 196, 225, 256, 289, 324, 361, 400", quantities: "Auswendig können" },
  ],
  quiz: {
    question: "Welche Zahl ist eine Quadratzahl?",
    options: ["289", "280", "299"],
    correctIndex: 0,
    explanation: "289 = 17 · 17. Die Quadratzahlen 16² = 256 und 18² = 324 liegen daneben.",
  },
  lab: lab(
    "power",
    "Quadrate aus Kästchen",
    "Stelle den Exponenten auf 2 und ziehe die Basis. Präge dir die Werte ein.",
    [r("base", "Basis", -10, 20, 5), r("exp", "Exponent", 1, 6, 1)],
    [o("wert", "Wert", (v) => n0(v.base ** v.exp)), o("quadrat", "Quadratzahl dieser Basis", (v) => n0(v.base * v.base))],
    [
      { id: "dreizehn", text: "Stelle 13² ein.", check: (v) => v.base === 13 && v.exp === 2 },
      { id: "vierhundert", text: "Finde den größten Wert der Reihe bis 400.", check: (v) => v.base === 20 && v.exp === 2 },
      { id: "negativ", text: "Stelle eine negative Basis ein, deren Quadrat 49 ist.", check: (v) => v.base === -7 && v.exp === 2 },
    ],
  ),
  exercises: [
    {
      id: "quadrat-abrufen",
      make: (rng, level) => {
        const n = rng.int(11, 20);
        if (level === 1)
          return task(
            level,
            `Wie viel ist ${n}²? Rufe den Wert aus dem Gedächtnis ab oder rechne ${n} · ${n}.`,
            "",
            [num("Wert:", n * n, "", 0, { slips: [{ value: 2 * n, hint: "n² bedeutet n · n, nicht 2 · n." }] })],
            "n² = n · n",
            `${n} · ${n} = ${n * n}.`,
            `${n}² = ${n * n}`,
            { n },
          );
        return task(
          level,
          "",
          `Ein quadratischer Schulhof hat einen Flächeninhalt von ${n * n} m². Wie lang ist eine Seite?`,
          [num("Seite:", n, "m", 0)],
          "Welche Zahl mit sich selbst multipliziert ergibt den Wert?",
          `${n} · ${n} = ${n * n}.`,
          `Eine Seite ist ${n} m lang.`,
          { n },
        );
      },
    },
    {
      id: "quadrat-vergleich",
      make: (rng, level) => {
        const a = rng.int(11, 19);
        const b = rng.int(a + 1, 20);
        if (level === 1)
          return task(
            level,
            `Berechne die Differenz ${b}² − ${a}².`,
            "",
            [num("Differenz:", b * b - a * a, "", 0, { slips: [{ value: (b - a) ** 2, hint: "Du musst jede Zahl einzeln quadrieren und dann subtrahieren." }] })],
            "Zuerst die Quadratzahlen, dann subtrahieren.",
            `${b * b} − ${a * a} = ${b * b - a * a}.`,
            `Das Ergebnis ist ${b * b - a * a}.`,
            { a, b },
          );
        const n = rng.int(101, 399);
        const low = Math.floor(Math.sqrt(n));
        const between = low * low === n ? n + 1 : n;
        const lower = Math.floor(Math.sqrt(between));
        return task(
          level,
          "",
          `Zwischen welchen zwei aufeinanderfolgenden Quadratzahlen liegt ${between}? Gib die kleinere an.`,
          [num("Kleinere Quadratzahl:", lower * lower, "", 0)],
          "Gehe die Reihe der Quadratzahlen durch.",
          `${lower}² = ${lower * lower} und ${lower + 1}² = ${(lower + 1) * (lower + 1)}.`,
          `Die kleinere ist ${lower * lower}.`,
          { between },
        );
      },
    },
  ],
});

const zehnerpotenzen = L1(10, {
  id: "mu-10-zehnerpotenzen",
  title: "3.10 Zehnerpotenzen und Verdoppeln",
  subtitle: "Große Zahlen kurz schreiben, schnelles Wachsen verstehen",
  whyItMatters:
    "Wie viele Reiskörner auf dem Schachbrett? Wiederholtes Verdoppeln wächst schneller, als man denkt. Mit Potenzen behältst du den Überblick.",
  explanationHtml: `<p>Eine <strong>Zehnerpotenz</strong> ist 10ⁿ: eine 1 mit n Nullen. So schreibst du große Zahlen kurz: 4 · 10⁶ = 4.000.000 und 37 · 10³ = 37.000.</p><p>Bei wiederholtem <strong>Verdoppeln</strong> steckt eine Potenz von 2: Nach n Schritten hast du das 2ⁿ-Fache. Nach 10 Schritten ist es schon mehr als das Tausendfache, denn 2¹⁰ = 1.024.</p><div class="example">Eine Bakterienkolonie mit 5 Zellen verdoppelt sich 6-mal: 5 · 2⁶ = 5 · 64 = 320 Zellen. Die Entfernung Erde–Sonne ist rund 15 · 10⁷ km.</div><div class="merke"><strong>Merke:</strong> Der Exponent bei 10 zählt die Nullen. Nach n-maligem Verdoppeln rechnest du Anfangswert · 2ⁿ.</div>`,
  formulas: [
    { name: "Zehnerpotenz", html: "10ⁿ", quantities: "1 mit n Nullen" },
    { name: "Verdoppeln", html: "Anfangswert · 2ⁿ", quantities: "n: Anzahl der Verdopplungen" },
  ],
  quiz: {
    question: "Wie schreibst du 6.000.000 mit einer Zehnerpotenz?",
    options: ["6 · 10⁶", "6 · 10⁵", "60 · 10⁶"],
    correctIndex: 0,
    explanation: "6.000.000 hat 6 Nullen hinter der 6.",
  },
  lab: lab(
    "powers-of-ten",
    "Nullen zählen",
    "Stelle die Zahl vorne und den Exponenten ein und lies die Zahl aus.",
    [r("a", "Zahl vorne", 1, 99, 2), r("n", "Exponent", 1, 12, 2)],
    [
      o("zahl", "Zahl", (v) => n0(v.a * 10 ** v.n)),
      o("nullen", "Anzahl der Nullen hinter der Zahl", (v) => v.n + (v.a % 10 === 0 ? 1 : 0)),
    ],
    [
      { id: "bayern", text: "Stelle 13 · 10⁶ ein, das ist ungefähr die Einwohnerzahl Bayerns.", check: (v) => v.a === 13 && v.n === 6 },
      { id: "erde", text: "Stelle 8 · 10⁹ ein, das ist ungefähr die Zahl der Menschen auf der Erde.", check: (v) => v.a === 8 && v.n === 9 },
      { id: "sonne", text: "Stelle 15 · 10⁷ ein, die Entfernung Erde–Sonne in km.", check: (v) => v.a === 15 && v.n === 7 },
    ],
  ),
  exercises: [
    {
      id: "zehnerpotenz",
      make: (rng, level) => {
        const a = rng.int(2, 95), n = rng.int(3, 10);
        const value = a * 10 ** n;
        if (level === 1)
          return task(
            level,
            `Schreibe ${a} · 10${sup(n)} als Zahl ohne Potenz.`,
            "",
            [num("Zahl:", value, "", 0)],
            "Der Exponent gibt die Zahl der angehängten Nullen an.",
            `An ${a} kommen ${n} Nullen.`,
            `${a} · 10${sup(n)} = ${n0(value)}`,
            { a, n },
          );
        const [sentence, base, exp] = rng.pick([
          ["In Deutschland leben rund 84 Millionen Menschen.", 84, 6],
          ["Die Entfernung Erde–Sonne beträgt rund 150 Millionen km.", 15, 7],
          ["Auf der Erde leben rund 8 Milliarden Menschen.", 8, 9],
          ["Licht legt in einer Sekunde rund 300.000 km zurück.", 3, 5],
          ["Der Mond ist rund 380.000 km von der Erde entfernt.", 38, 4],
        ] as const);
        return task(
          level,
          "",
          `${sentence} Schreibe die Zahl als ${base} · 10<sup>n</sup>. Wie heißt n?`,
          [num("n =", exp, "", 0)],
          "Schreibe die Zahl aus und zähle die Nullen nach der vorderen Zahl.",
          `${n0(base * 10 ** exp)} = ${base} · 10${sup(exp)}.`,
          `n = ${exp}`,
          { base, exp },
        );
      },
    },
    {
      id: "verdoppeln",
      make: (rng, level) => {
        const start = rng.int(2, 9), n = rng.int(3, 10);
        const value = start * 2 ** n;
        if (level === 1)
          return task(
            level,
            `Eine Zahl wird ${n}-mal verdoppelt. Am Anfang steht ${start}. Welche Zahl entsteht?`,
            "",
            [num("Zahl:", value, "", 0, { slips: [{ value: start * 2 * n, hint: "Es wird immer wieder das neue Ergebnis verdoppelt, nicht zum Anfangswert addiert." }] })],
            `Rechne ${start} · 2${sup(n)}.`,
            `2${sup(n)} = ${n0(2 ** n)}, dann ${start} · ${n0(2 ** n)}.`,
            `Es entsteht ${n0(value)}.`,
            { start, n },
          );
        const target = rng.pick([1000, 5000, 10000, 100000]);
        let days = 0;
        let cells = start;
        while (cells < target) {
          cells *= 2;
          days++;
        }
        return task(
          level,
          "",
          `Eine Algenfläche ist ${start} m² groß und verdoppelt sich jeden Tag. Nach wie vielen Tagen ist sie zum ersten Mal mindestens ${n0(target)} m² groß?`,
          [num("Tage:", days, "", 0)],
          "Verdopple schrittweise und zähle die Schritte.",
          `${start} · 2${sup(days)} = ${n0(start * 2 ** days)}, ein Tag vorher waren es ${n0(start * 2 ** (days - 1))} m².`,
          `Nach ${days} Tagen.`,
          { start, target },
        );
      },
    },
  ],
});

const gleichungenMul = L1(11, {
  id: "mu-11-gleichungen",
  title: "3.11 Gleichungen mit Mal und Geteilt",
  subtitle: "Probieren und Umkehraufgabe",
  whyItMatters:
    "Wie viele Packungen, wenn insgesamt 96 Stück gebraucht werden? Solche Fragen sind Gleichungen. Die Umkehraufgabe löst sie.",
  explanationHtml: `<p>Auch hier hilft das <strong>systematische Probieren</strong> oder die <strong>Umkehraufgabe</strong>. Für die drei Formen gilt:</p><p>a · x = b führt zu x = b : a. x : a = b führt zu x = b · a. a : x = b führt zu x = a : b. Die Vorzeichenregeln gelten wie immer.</p><div class="example">−6 · x = 42: x = 42 : (−6) = −7. x : 4 = −5: x = (−5) · 4 = −20. 36 : x = −9: x = 36 : (−9) = −4. Probe: 36 : (−4) = −9.</div><div class="merke"><strong>Merke:</strong> Multiplikation und Division kehren einander um. Durch 0 darfst du nie teilen. Mache die Probe.</div>`,
  formulas: [
    { name: "a · x = b", html: "x = b : a", quantities: "Umkehraufgabe zur Multiplikation" },
    { name: "x : a = b", html: "x = b · a", quantities: "Umkehraufgabe zur Division" },
    { name: "a : x = b", html: "x = a : b", quantities: "Der Divisor ist gesucht" },
  ],
  quiz: {
    question: "Wie lautet die Lösung von 5 · x = −35?",
    options: ["x = −7", "x = 7", "x = −175"],
    correctIndex: 0,
    explanation: "x = (−35) : 5 = −7. Probe: 5 · (−7) = −35.",
  },
  lab: lab(
    "equation-mul",
    "Probieren und prüfen",
    "Wähle die Form der Gleichung und ziehe x, bis beide Seiten gleich sind.",
    [
      c("form", "Form", ["a · x = b", "x : a = b", "a : x = b"]),
      r("a", "a", -12, 12, 6),
      r("b", "b", -60, 60, 42),
      r("x", "x", -60, 60, 2),
    ],
    [
      o("links", "Linke Seite", (v) => { if (v.a === 0) return "nicht erlaubt"; const left = multiplicativeEquation(v.form, v.a, v.b).left(v.x); return Number.isFinite(left) ? (Number.isInteger(left) ? n0(left) : "keine ganze Zahl") : "nicht erlaubt"; }),
      o("loesung", "Passt?", (v) => (v.a !== 0 && multiplicativeEquation(v.form, v.a, v.b).left(v.x) === v.b ? "ja" : "noch nicht")),
    ],
    [
      { id: "mal", text: "Löse −6 · x = 42.", check: (v) => v.form === 0 && v.a === -6 && v.b === 42 && v.x === -7 },
      { id: "geteilt", text: "Löse x : 4 = −5.", check: (v) => v.form === 1 && v.a === 4 && v.b === -5 && v.x === -20 },
      { id: "divisor", text: "Löse 12 : x = −3.", check: (v) => v.form === 2 && v.a === 12 && v.b === -3 && v.x === -4 },
    ],
  ),
  exercises: [
    {
      id: "umkehraufgabe",
      make: (rng, level) => {
        const form = rng.int(0, 2);
        const a0 = rng.sign() * rng.int(2, 12), x = rng.sign() * rng.int(2, 15);
        const a = form === 2 ? a0 * x : a0;
        const b = form === 0 ? a * x : form === 1 ? rng.sign() * rng.int(2, 15) : a0;
        const equation = multiplicativeEquation(form, a, b);
        const solution = form === 0 ? x : form === 1 ? b * a : x;
        if (level === 1)
          return task(
            level,
            `Löse die Gleichung ${equation.text("x")} mit einer Umkehraufgabe.`,
            "",
            [num("x =", solution, "", 0, { slips: [{ value: -solution, hint: "Prüfe das Vorzeichen, indem du x einsetzt." }] })],
            ["a · x = b: x = b : a", "x : a = b: x = b · a", "a : x = b: x = a : b"][form],
            equation.inverse,
            `x = ${n0(solution)}`,
            { form, a, b },
          );
        const pack = rng.pick([6, 8, 12, 15]);
        const packs = rng.int(3, 24);
        const total = pack * packs;
        return task(
          level,
          "",
          `Für ein Fest werden ${total} Brezen gebraucht. Sie kommen in Tüten zu je ${pack} Stück. Stelle die Gleichung ${pack} · x = ${total} auf und löse sie.`,
          [num("x =", packs, "", 0)],
          "Bilde die Umkehraufgabe.",
          `x = ${total} : ${pack} = ${packs}.`,
          `Es sind ${packs} Tüten.`,
          { pack, packs },
        );
      },
    },
    {
      id: "gedachte-zahl",
      make: (rng, level) => {
        const a = rng.int(2, 12), x = rng.sign() * rng.int(2, 20);
        if (level === 1) {
          const options = [x, x + 1, -x].map(n0);
          return task(
            level,
            `Welche Zahl löst die Gleichung ${a} · x = ${n0(a * x)}? Setze ein.`,
            "",
            [pick("x =", options, 0)],
            "Setze jede Zahl ein und vergleiche.",
            `${a} · ${p0(x)} = ${n0(a * x)}.`,
            `x = ${n0(x)}`,
            { a, x },
          );
        }
        return task(
          level,
          "",
          `Mia denkt sich eine Zahl und dividiert sie durch ${a}. Es kommt ${n0(x)} heraus. Wie heißt ihre Zahl?`,
          [num("Zahl:", a * x, "", 0, { slips: [{ value: x, hint: "Das ist das Ergebnis. Gesucht ist die Zahl davor." }] })],
          "Die Umkehrung von Dividieren ist Multiplizieren.",
          `x : ${a} = ${n0(x)}, also x = ${n0(x)} · ${a}.`,
          `Ihre Zahl ist ${n0(a * x)}.`,
          { a, x },
        );
      },
    },
  ],
});

const gliedern = L2(12, {
  id: "te-1-gliedern",
  title: "3.12 Terme gliedern",
  subtitle: "Summe, Differenz, Produkt, Quotient, Potenz",
  whyItMatters:
    "Lange Terme sehen kompliziert aus. Mit den richtigen Fachbegriffen erkennst du sofort, was zuletzt zu rechnen ist.",
  explanationHtml: `<p>Der Name eines Terms hängt von der Rechnung ab, die du <strong>zuletzt</strong> ausführst: <strong>Summe</strong>, <strong>Differenz</strong>, <strong>Produkt</strong>, <strong>Quotient</strong> oder <strong>Potenz</strong>. Zu jeder Art gehören eigene Namen für die Teile: Summanden; Minuend und Subtrahend; Faktoren; Dividend und Divisor; Basis und Exponent.</p><p>Beim Gliedern beginnst du mit der letzten Rechnung und gehst von außen nach innen.</p><div class="example">(6 + 3) · (−4) ist ein Produkt. 1. Faktor: die Summe aus 6 und 3. 2. Faktor: −4. Dagegen ist 6 + 3 · (−4) eine Summe. 1. Summand: 6. 2. Summand: das Produkt aus 3 und −4.</div><div class="merke"><strong>Merke:</strong> Frage: Was rechne ich zuletzt? Das ist der Name des Terms.</div>`,
  formulas: [
    { name: "Fachbegriffe", html: "Summand + Summand; Minuend − Subtrahend; Faktor · Faktor; Dividend : Divisor; Basis<sup>Exponent</sup>", quantities: "Die Namen der Teile eines Terms" },
  ],
  quiz: {
    question: "Wie heißt der Term 48 : (−6) − 2³?",
    options: ["Differenz", "Quotient", "Potenz"],
    correctIndex: 0,
    explanation: "Punkt vor Strich und Potenz zuerst, zuletzt wird subtrahiert: eine Differenz.",
  },
  lab: lab(
    "term-tree-mixed",
    "Termbaum",
    "Wähle einen Term. Oben im Baum steht die letzte Rechnung.",
    [
      { type: "choice" as const, key: "term", label: "Term", value: 0, options: MIXED_TERMS.map((term, value) => ({ value, label: termText(term) })) },
      r("step", "Rechenschritt", 0, 4, 0),
    ],
    [o("art", "Art des Terms", (v) => termKind(MIXED_TERMS[v.term])), o("wert", "Wert", (v) => n0(termValue(MIXED_TERMS[v.term])))],
    [
      { id: "produkt", text: "Finde den Term, der ein Produkt ist.", check: (v) => v.term === 1 },
      { id: "differenz", text: "Finde den Term, der eine Differenz ist, und rechne ihn bis zum Ende.", check: (v) => v.term === 2 && v.step >= 3 },
      { id: "quotient", text: "Finde den Term, der ein Quotient ist, und rechne ihn bis zum Ende.", check: (v) => v.term === 3 && v.step >= 3 },
    ],
  ),
  exercises: [
    {
      id: "termart",
      make: (rng, level) => {
        const a = rng.int(2, 15), b = rng.int(2, 9), d = rng.sign() * rng.int(2, 9);
        const terms: TermNode[] = [
          { op: "+", left: a, right: { op: "·", left: b, right: d } },
          { op: "·", left: { op: "+", left: a, right: b }, right: d },
          { op: "−", left: { op: "·", left: a, right: b }, right: d },
          { op: ":", left: { op: "·", left: a, right: b * Math.abs(d) }, right: b },
          { op: "^", left: { op: "+", left: b, right: d }, right: 2 },
        ];
        const term = rng.pick(terms);
        const kinds = ["Summe", "Differenz", "Produkt", "Quotient", "Potenz"];
        const kind = termKind(term);
        if (level === 1)
          return task(
            level,
            `Wie heißt der Term ${termText(term)} nach seiner letzten Rechnung?`,
            "",
            [pick("Art des Terms:", kinds, kinds.indexOf(kind))],
            "Suche die Rechnung, die zuletzt kommt.",
            "Die letzte Rechnung bestimmt den Namen des Terms.",
            `Der Term ist: ${kind}.`,
            { a, b, d },
          );
        const value = a * b + d;
        return task(
          level,
          "",
          `Schreibe als Term und berechne: Addiere zum Produkt aus ${a} und ${b} die Zahl ${n0(d)}.`,
          [num("Wert:", value, "", 0)],
          "Das Wort „Produkt“ sagt, was zuerst gerechnet wird.",
          `${a} · ${b} + ${p0(d)} = ${a * b} + ${p0(d)}.`,
          `Der Wert ist ${n0(value)}.`,
          { a, b, d },
        );
      },
    },
    {
      id: "teil-benennen",
      make: (rng, level) => {
        const a = rng.int(3, 15), b = rng.int(2, 9), d = rng.int(2, 9);
        if (level === 1) {
          const inner = rng.int(0, 1) === 0;
          const term: TermNode = inner
            ? { op: "−", left: a * b, right: { op: "·", left: b, right: d } }
            : { op: "·", left: { op: "−", left: a * b, right: b }, right: d };
          return task(
            level,
            `Wie heißt der Term ${termText(term)} nach seiner letzten Rechnung?`,
            "",
            [pick("Art des Terms:", ["Differenz", "Produkt"], inner ? 0 : 1)],
            "Klammern zuerst. Was kommt danach zuletzt?",
            inner ? "Punkt vor Strich: Zuletzt wird subtrahiert." : "Die Klammer steht zuerst, zuletzt wird multipliziert.",
            inner ? "Der Term ist eine Differenz." : "Der Term ist ein Produkt.",
            { a, b, d },
          );
        }
        const term: TermNode = { op: "−", left: { op: "·", left: a, right: b }, right: { op: ":", left: d * b, right: b } };
        return task(
          level,
          "",
          `Gliedere den Term ${termText(term)}: Er ist eine Differenz. Welchen Wert hat der Subtrahend?`,
          [num("Subtrahend:", d, "", 0, { slips: [{ value: a * b, hint: "Das ist der Minuend. Der Subtrahend steht hinter dem Minus." }] })],
          "Der Subtrahend steht hinter dem Minus.",
          `Der Subtrahend ist ${d * b} : ${b} = ${d}.`,
          `Sein Wert ist ${d}.`,
          { a, b, d },
        );
      },
    },
  ],
});

const punktVorStrich = L2(13, {
  id: "te-2-punkt-vor-strich",
  title: "3.13 Punkt vor Strich",
  subtitle: "Regeln für die Reihenfolge der Rechenschritte",
  whyItMatters:
    "3 + 4 · 5 ist 23, nicht 35. Ohne feste Regeln käme jeder zu einem anderen Ergebnis.",
  explanationHtml: `<p>Für die Reihenfolge gilt: <strong>1. Klammern</strong> (von innen nach außen). <strong>2. Potenzen</strong>. <strong>3. Punktrechnung</strong> (Mal und Geteilt). <strong>4. Strichrechnung</strong> (Plus und Minus). Gleichrangige Rechnungen führst du von links nach rechts aus.</p><p>Schreibe jeden Schritt in einer klaren, fortlaufenden Rechnung. Rechne nur das, was gerade dran ist, und übernimm den Rest unverändert.</p><div class="example">7 − 2 · (5 − 8)² = 7 − 2 · (−3)² = 7 − 2 · 9 = 7 − 18 = −11.</div><div class="merke"><strong>Merke:</strong> Klammer, Potenz, Punkt, Strich. Bei Gleichrang von links nach rechts.</div>`,
  formulas: [
    { name: "Reihenfolge", html: "Klammer → Potenz → Punkt → Strich", quantities: "Gleichrangig: von links nach rechts" },
  ],
  quiz: {
    question: "Welchen Wert hat 20 − 3 · 4?",
    options: ["8", "68", "−8"],
    correctIndex: 0,
    explanation: "Punkt vor Strich: 3 · 4 = 12, dann 20 − 12 = 8.",
  },
  lab: lab(
    "int-mixed",
    "Schritte mit ganzen Zahlen",
    "Wähle einen Term und stelle a, b und d ein. Die App zeigt die fortlaufende Rechnung.",
    [c("term", "Term", ["a + b · d", "(a + b) · d", "a − b · d"]), r("a", "a", -20, 20, 2), r("b", "b", -9, 9, 1), r("d", "d", -9, 9, 1)],
    [
      o("wert", "Wert", (v) => n0(v.term === 1 ? (v.a + v.b) * v.d : v.term === 2 ? v.a - v.b * v.d : v.a + v.b * v.d)),
      o("erst", "Zuerst rechnest du", (v) => (v.term === 1 ? "die Klammer" : "das Produkt")),
    ],
    [
      { id: "beispiel", text: "Stelle (a + b) · d mit a = 6, b = 3 und d = −4 ein.", check: (v) => v.term === 1 && v.a === 6 && v.b === 3 && v.d === -4 },
      { id: "gleich", text: "Finde a, b und d, bei denen a + b · d und (a + b) · d denselben Wert haben, mit d = 1 und a = 5.", check: (v) => v.d === 1 && v.a === 5 },
      { id: "null", text: "Finde bei a − b · d mit a = 12 Werte für b und d, sodass das Ergebnis 0 ist.", check: (v) => v.term === 2 && v.a === 12 && v.b * v.d === 12 },
    ],
  ),
  exercises: [
    {
      id: "reihenfolge",
      make: (rng, level) => {
        const a = rng.int(-15, 20), b = rng.int(2, 9), d = rng.sign() * rng.int(2, 9), e = rng.int(2, 4);
        if (level === 1) {
          const term: TermNode = { op: "+", left: a, right: { op: "·", left: b, right: d } };
          return task(
            level,
            `Berechne in fortlaufender Rechnung: ${termText(term)}.`,
            "",
            [num("Wert:", termValue(term), "", 0, { slips: [{ value: (a + b) * d, hint: "Du hast von links nach rechts gerechnet. Punkt kommt vor Strich." }] })],
            "Punkt vor Strich.",
            `= ${termSolve(term).join(" = ")}`,
            `Der Wert ist ${n0(termValue(term))}.`,
            { a, b, d },
          );
        }
        const term: TermNode = {
          op: "−",
          left: { op: "·", left: b, right: { op: "−", left: a, right: d } },
          right: { op: "^", left: e, right: 2 },
        };
        return task(
          level,
          "",
          `Berechne in fortlaufender Rechnung: ${termText(term)}.`,
          [num("Wert:", termValue(term), "", 0)],
          "Klammer, Potenz, Punkt, Strich.",
          `= ${termSolve(term).join(" = ")}`,
          `Der Wert ist ${n0(termValue(term))}.`,
          { a, b, d, e },
        );
      },
    },
    {
      id: "klammer-setzen",
      make: (rng, level) => {
        const a = rng.int(2, 12), b = rng.int(2, 9), d = rng.int(2, 9);
        if (level === 1) {
          const noBracket = a + b * d;
          const withBracket = (a + b) * d;
          const asked = rng.int(0, 1) === 0;
          return task(
            level,
            `Berechne den Wert von ${asked ? `(${a} + ${b}) · ${d}` : `${a} + ${b} · ${d}`}.`,
            "",
            [num("Wert:", asked ? withBracket : noBracket, "", 0, { slips: [{ value: asked ? noBracket : withBracket, hint: "Achte darauf, ob eine Klammer steht." }] })],
            "Klammern zuerst, sonst Punkt vor Strich.",
            asked ? `${a + b} · ${d}.` : `${a} + ${b * d}.`,
            `Der Wert ist ${asked ? withBracket : noBracket}.`,
            { a, b, d },
          );
        }
        const withBracket = (a + b) * d;
        const needsBracket = rng.int(0, 1) === 0;
        const target = needsBracket ? withBracket : a + b * d;
        return task(
          level,
          "",
          `Soll ${a} + ${b} · ${d} den Wert ${target} haben, muss dann eine Klammer gesetzt werden?`,
          [pick("Klammer nötig:", ["ja", "nein"], needsBracket ? 0 : 1)],
          "Berechne den Term ohne Klammer und vergleiche.",
          `Ohne Klammer ist der Wert ${a + b * d}.`,
          needsBracket ? `Ja: (${a} + ${b}) · ${d} = ${withBracket}.` : `Nein, der Wert stimmt bereits.`,
          { a, b, d },
        );
      },
    },
  ],
});

const distributiv = L2(14, {
  id: "te-3-distributivgesetz",
  title: "3.14 Das Distributivgesetz",
  subtitle: "Kopfrechentricks erklärt",
  whyItMatters:
    "7 · 98 im Kopf? Du rechnest 7 · 100 − 7 · 2. Das hast du schon früher gemacht. Jetzt kennst du das Gesetz dahinter.",
  explanationHtml: `<p>Das <strong>Distributivgesetz</strong> verbindet Punkt- und Strichrechnung: a · (b + c) = a · b + a · c und a · (b − c) = a · b − a · c. Es gilt auch beim Dividieren einer Summe: (b + c) : a = b : a + c : a.</p><p>Viele <strong>Kopfrechenstrategien</strong> aus der Grundschule sind Anwendungen: 6 · 14 rechnest du als 6 · 10 + 6 · 4. Auch umgekehrt ist es nützlich: Ausklammern macht 17 · 8 + 17 · 2 zu 17 · 10.</p><div class="example">7 · 98 = 7 · (100 − 2) = 700 − 14 = 686. (−3) · 21 + (−3) · 9 = (−3) · 30 = −90.</div><div class="merke"><strong>Merke:</strong> Ein Faktor wird mit jedem Teil der Klammer multipliziert. Teile große Faktoren in runde Zahlen.</div>`,
  formulas: [
    { name: "Distributivgesetz", html: "a · (b + c) = a · b + a · c", quantities: "Ausmultiplizieren; von rechts nach links: Ausklammern" },
    { name: "Mit Minus", html: "a · (b − c) = a · b − a · c", quantities: "Hilft bei Zahlen knapp unter einer runden Zahl" },
  ],
  quiz: {
    question: "Welche Umformung nutzt das Distributivgesetz richtig?",
    options: ["5 · (10 + 2) = 5 · 10 + 5 · 2", "5 · (10 + 2) = 5 · 10 + 2", "5 · (10 + 2) = 5 + 10 · 2"],
    correctIndex: 0,
    explanation: "Der Faktor 5 wird mit beiden Summanden multipliziert.",
  },
  lab: lab(
    "distributive",
    "Rechteck zerlegen",
    "Stelle die Zahlen ein. Das Rechteck zeigt die beiden Teilprodukte.",
    [c("op", "Klammer", ["b + c", "b − c"]), r("a", "a", 2, 12, 6), r("b", "b", 10, 100, 20, 10), r("c", "c", 1, 9, 3)],
    [
      o("links", "a · (Klammer)", (v) => n0(v.a * (v.op === 0 ? v.b + v.c : v.b - v.c))),
      o("rechts", "Teilprodukte", (v) => `${n0(v.a * v.b)} ${v.op === 0 ? "+" : "−"} ${n0(v.a * v.c)}`),
    ],
    [
      { id: "plus", text: "Zerlege 6 · 14 als 6 · (10 + 4).", check: (v) => v.op === 0 && v.a === 6 && v.b === 10 && v.c === 4 },
      { id: "minus", text: "Rechne 7 · 98 als 7 · (100 − 2).", check: (v) => v.op === 1 && v.a === 7 && v.b === 100 && v.c === 2 },
      { id: "gross", text: "Rechne 12 · 99 als 12 · (100 − 1).", check: (v) => v.op === 1 && v.a === 12 && v.b === 100 && v.c === 1 },
    ],
  ),
  exercises: [
    {
      id: "kopfrechnen",
      make: (rng, level) => {
        const a = rng.int(3, 12);
        if (level === 1) {
          const tens = rng.pick([20, 30, 40, 50, 100]), unit = rng.int(1, 4), minus = rng.int(0, 1) === 0;
          const b = minus ? tens - unit : tens + unit;
          return task(
            level,
            `Rechne im Kopf mit einer Zerlegung: ${a} · ${b}.`,
            "",
            [num("Produkt:", a * b, "", 0)],
            `Zerlege ${b} = ${tens} ${minus ? "−" : "+"} ${unit}.`,
            `${a} · ${tens} ${minus ? "−" : "+"} ${a} · ${unit} = ${n0(a * tens)} ${minus ? "−" : "+"} ${a * unit}.`,
            `Das Produkt ist ${n0(a * b)}.`,
            { a, tens, unit },
          );
        }
        const price = rng.pick([99, 199, 299, 49, 98]);
        const round = price === 98 ? 100 : price + 1;
        const n = rng.int(3, 9);
        return task(
          level,
          "",
          `Ein Bastelset kostet ${price} ct. Du kaufst ${n} Stück. Wie viel Cent musst du zahlen? Rechne im Kopf mit dem Distributivgesetz.`,
          [num("Preis:", price * n, "ct", 0)],
          "Rechne mit der runden Zahl und ziehe den Unterschied wieder ab.",
          `${n} · (${round} − ${round - price}) = ${n0(n * round)} − ${n * (round - price)}.`,
          `Du zahlst ${n0(price * n)} ct.`,
          { price, n },
        );
      },
    },
    {
      id: "ausklammern",
      make: (rng, level) => {
        const a = rng.sign() * rng.int(3, 25);
        const b = rng.pick([17, 23, 28, 36, 44]);
        const c1 = rng.pick([100, 50, 60, 80]) - b;
        const sum = b + c1;
        if (level === 1)
          return task(
            level,
            `Rechne geschickt: ${p0(a)} · ${b} + ${p0(a)} · ${c1}.`,
            "",
            [num("Wert:", a * sum, "", 0)],
            "Klammere den gemeinsamen Faktor aus.",
            `${p0(a)} · (${b} + ${c1}) = ${p0(a)} · ${sum}.`,
            `Der Wert ist ${n0(a * sum)}.`,
            { a, b, c1 },
          );
        const k = rng.int(3, 12);
        const claim = rng.int(0, 1) === 0;
        const right = `${k} · ${b} + ${k} · ${c1}`;
        const wrong = `${k} · ${b} + ${c1}`;
        return task(
          level,
          "",
          `Stimmt diese Umformung? ${k} · (${b} + ${c1}) = ${claim ? right : wrong}`,
          [pick("Die Umformung …", ["stimmt", "stimmt nicht"], claim ? 0 : 1)],
          "Der Faktor vor der Klammer muss mit jedem Summanden multipliziert werden.",
          claim ? "Beide Summanden werden mit dem Faktor multipliziert." : `Der Summand ${c1} wurde nicht multipliziert.`,
          claim ? "Die Umformung stimmt." : "Die Umformung stimmt nicht.",
          { k, b, c1 },
        );
      },
    },
  ],
});

const vorwaerts = L2(15, {
  id: "te-4-vorwaerts-rueckwaerts",
  title: "3.15 Vorwärts- und Rückwärtsarbeiten",
  subtitle: "Zwei Strategien zum Problemlösen",
  whyItMatters:
    "Wenn du das Ergebnis kennst, aber den Anfang suchst, hilft ein anderer Weg: von hinten aufrollen.",
  explanationHtml: `<p>Beim <strong>Vorwärtsarbeiten</strong> beginnst du beim Gegebenen und rechnest Schritt für Schritt zum Gesuchten. Beim <strong>Rückwärtsarbeiten</strong> startest du beim bekannten Ergebnis und machst jede Rechnung rückgängig, von der letzten zur ersten: Aus Addieren wird Subtrahieren, aus Multiplizieren wird Dividieren.</p><p>Rückwärtsarbeiten lohnt sich, wenn das Endergebnis gegeben und der Anfang gesucht ist. Prüfe dein Ergebnis danach durch Vorwärtsrechnen.</p><div class="example">Eine Zahl wird mit −3 multipliziert, dann wird 5 addiert: Ergebnis −7. Rückwärts: −7 − 5 = −12, dann −12 : (−3) = 4. Probe: 4 · (−3) + 5 = −7.</div><div class="merke"><strong>Merke:</strong> Rückwärts: letzte Rechnung zuerst umkehren. Danach mit einer Vorwärtsrechnung prüfen.</div>`,
  formulas: [
    { name: "Umkehrungen", html: "+ ↔ − und · ↔ :", quantities: "Rückwärts in umgekehrter Reihenfolge" },
  ],
  quiz: {
    question: "Eine Zahl wird verdoppelt, dann werden 3 subtrahiert. Das Ergebnis ist 11. Welche Rechnung führt zurück?",
    options: ["(11 + 3) : 2", "11 : 2 + 3", "(11 − 3) · 2"],
    correctIndex: 0,
    explanation: "Zuerst die letzte Rechnung umkehren: + 3. Dann die erste: : 2. Das ergibt 7.",
  },
  lab: lab(
    "chain",
    "Rechenkette",
    "Stelle Start und Rechnungen ein. Wechsle die Richtung und vergleiche.",
    [c("dir", "Richtung", ["vorwärts", "rückwärts"]), r("x", "Startzahl", -20, 20, 2), r("a", "Multiplizieren mit", -6, 6, 3), r("b", "Addieren von", -20, 20, 4)],
    [o("ziel", "Ziel", (v) => n0(v.x * v.a + v.b)), o("start", "Start", (v) => n0(v.x))],
    [
      { id: "beispiel", text: "Zeige rückwärts: Start 4, mal −3, plus 5, Ziel −7.", check: (v) => v.dir === 1 && v.x === 4 && v.a === -3 && v.b === 5 },
      { id: "ziel-null", text: "Stelle vorwärts mit Faktor 3 und Summand 12 den Start ein, der zum Ziel 0 führt.", check: (v) => v.dir === 0 && v.a === 3 && v.b === 12 && v.x === -4 },
      { id: "ziel-gross", text: "Stelle vorwärts mit Faktor −5 und Summand 20 den Start ein, der zum Ziel 45 führt.", check: (v) => v.dir === 0 && v.a === -5 && v.b === 20 && v.x === -5 },
    ],
  ),
  exercises: [
    {
      id: "zahl-zurueck",
      make: (rng, level) => {
        const x = rng.int(-12, 15), a = rng.sign() * rng.int(2, 6), b = rng.sign() * rng.int(2, 25);
        const result = x * a + b;
        if (level === 1)
          return task(
            level,
            `Eine Zahl wird mit ${p0(a)} multipliziert, dann wird ${p0(b)} addiert. Das Ergebnis ist ${n0(result)}. Wie heißt die Zahl?`,
            "",
            [num("Zahl:", x, "", 0, { slips: [{ value: (result + b) / a, hint: "Addieren kehrst du mit Subtrahieren um." }] })],
            "Rückwärts: erst die Addition umkehren, dann die Multiplikation.",
            `${n0(result)} − ${p0(b)} = ${n0(result - b)}, dann ${p0(result - b)} : ${p0(a)} = ${n0(x)}.`,
            `Die Zahl heißt ${n0(x)}.`,
            { x, a, b },
          );
        const start = rng.int(30, 150), spent = rng.pick([12, 18, 24, 36]), half = start * 2 + spent;
        return task(
          level,
          "",
          `Ben gibt erst ${spent} € aus und danach die Hälfte vom Rest. Am Ende hat er noch ${start} €. Wie viel Geld hatte er am Anfang?`,
          [num("Anfang:", half, "€", 0)],
          "Rückwärts: Die Hälfte kehrst du durch Verdoppeln um, das Ausgeben durch Addieren.",
          `${start} · 2 = ${start * 2}, dann ${start * 2} + ${spent} = ${half}.`,
          `Am Anfang hatte er ${half} €.`,
          { start, spent },
        );
      },
    },
    {
      id: "vorwaerts-rechnen",
      make: (rng, level) => {
        const x = rng.int(2, 15), a = rng.int(2, 6), b = rng.sign() * rng.int(2, 25);
        if (level === 1)
          return task(
            level,
            `Vorwärtsarbeiten: Starte bei ${x}, multipliziere mit ${a}, addiere ${p0(b)}. Welche Zahl entsteht?`,
            "",
            [num("Zahl:", x * a + b, "", 0)],
            "Führe die Rechnungen der Reihe nach aus.",
            `${x} · ${a} = ${x * a}, dann ${x * a} + ${p0(b)} = ${n0(x * a + b)}.`,
            `Es entsteht ${n0(x * a + b)}.`,
            { x, a, b },
          );
        const rows = rng.int(6, 9), seats = rng.pick([15, 18, 20]), reserved = rng.int(3, 15), arrive = rng.int(20, 40);
        const free = rows * seats - reserved - arrive;
        return task(
          level,
          "",
          `Ein Theatersaal hat ${rows} Reihen mit je ${seats} Plätzen. ${reserved} Plätze sind reserviert, ${arrive} Gäste setzen sich auf die übrigen Plätze. Wie viele Plätze bleiben frei?`,
          [num("Frei:", free, "", 0)],
          "Vorwärts: Erst alle Plätze, dann die vergebenen abziehen.",
          `${rows} · ${seats} = ${rows * seats}. ${rows * seats} − ${reserved} − ${arrive} = ${free}.`,
          `Es bleiben ${free} Plätze frei.`,
          { rows, seats, reserved, arrive },
        );
      },
    },
  ],
});

const sachaufgaben = L2(16, {
  id: "te-5-sachaufgaben",
  title: "3.16 Sachaufgaben mit ganzen Zahlen",
  subtitle: "Rechnen, dokumentieren, kritisch prüfen",
  whyItMatters:
    "Eine Sachaufgabe ist erst gelöst, wenn du erklären kannst, warum dein Ergebnis zur Situation passt.",
  explanationHtml: `<p>Gehe bei <strong>Sachaufgaben</strong> so vor: <strong>1. Verstehen:</strong> Was ist gegeben, was ist gesucht? <strong>2. Plan:</strong> Welche Rechnungen führen zum Ziel? <strong>3. Rechnen:</strong> Schreibe den Lösungsweg nachvollziehbar auf, mit Fachsprache. <strong>4. Prüfen:</strong> Überschlage und überlege, ob das Ergebnis zur Situation passt. Antworte in einem Satz.</p><div class="example">Eine Klasse mit 28 Kindern fährt ins Museum: Eintritt 7 € pro Kind, zusammen 420 € Buskosten. Überschlag: 30 · 7 + 400 = 610. Rechnung: 28 · 7 + 420 = 196 + 420 = 616. Antwort: Der Ausflug kostet 616 €.</div><div class="merke"><strong>Merke:</strong> Verstehen, Plan, Rechnen, Prüfen und Antwortsatz. Ein Ergebnis, das nicht passt, ist ein Hinweis auf einen Fehler.</div>`,
  formulas: [
    { name: "Vorgehen", html: "Verstehen → Plan → Rechnen → Prüfen → Antwort", quantities: "Für jede Sachaufgabe" },
  ],
  quiz: {
    question: "Ein Bus kostet 420 € und fährt 28 Kinder. Max rechnet: Jedes Kind zahlt 150 €. Was sagt dir ein Überschlag?",
    options: ["420 : 30 ≈ 14 €, also hat Max sich verrechnet.", "Der Preis stimmt, weil Busse teuer sind.", "Das kann man ohne Taschenrechner nicht prüfen."],
    correctIndex: 0,
    explanation: "420 : 28 = 15. Max' Ergebnis ist etwa 10-mal zu groß.",
  },
  lab: lab(
    "shopping",
    "Einkauf für das Klassenfest",
    "Stelle die Kinderzahl und die Packungsgröße ein. Die App zeigt, wie viele Packungen nötig sind.",
    [r("k", "Kinder", 2, 30, 10), r("s", "Brötchen pro Kind", 1, 4, 1), c("pack", "Packung", ["6 Stück", "8 Stück", "10 Stück"])],
    [
      o("bedarf", "Brötchen", (v) => v.k * v.s),
      o("packungen", "Packungen", (v) => Math.ceil((v.k * v.s) / [6, 8, 10][v.pack])),
      o("rest", "Übrig", (v) => Math.ceil((v.k * v.s) / [6, 8, 10][v.pack]) * [6, 8, 10][v.pack] - v.k * v.s),
    ],
    [
      { id: "kein-rest", text: "Stelle eine Einkaufsliste ohne Rest bei 28 Kindern ein.", check: (v) => v.k === 28 && (v.k * v.s) % [6, 8, 10][v.pack] === 0 },
      { id: "wenig-rest", text: "Stelle 25 Kinder mit je 2 Brötchen und 8er-Packungen ein.", check: (v) => v.k === 25 && v.s === 2 && v.pack === 1 },
      { id: "viele", text: "Plane für 30 Kinder mit je 4 Brötchen und 10er-Packungen.", check: (v) => v.k === 30 && v.s === 4 && v.pack === 2 },
    ],
  ),
  exercises: [
    {
      id: "klassenfahrt",
      make: (rng, level) => {
        const kids = rng.int(22, 32), fee = rng.int(4, 12), bus = rng.int(25, 60) * 10;
        const total = kids * fee + bus;
        if (level === 1)
          return task(
            level,
            `${kids} Kinder besuchen ein Museum. Der Eintritt kostet ${fee} € pro Kind, der Bus insgesamt ${bus} €. Wie viel kostet der Ausflug zusammen?`,
            "",
            [num("Kosten:", total, "€", 0)],
            "Erst die Eintritte zusammen, dann den Bus dazu.",
            `${kids} · ${fee} = ${kids * fee}, dann ${kids * fee} + ${bus} = ${total}.`,
            `Der Ausflug kostet ${total} €.`,
            { kids, fee, bus },
          );
        const adults = rng.int(2, 3);
        const perChild = rng.int(14, 26);
        const paying = kids;
        const busCost = paying * perChild - kids * fee;
        return task(
          level,
          "",
          `${kids} Kinder und ${adults} Lehrkräfte fahren ins Museum. Nur die Kinder zahlen: je ${perChild} €. Davon gehen ${fee} € Eintritt pro Kind weg, der Rest bezahlt den Bus. Wie viel Geld ist für den Bus da?`,
          [num("Bus:", busCost, "€", 0)],
          "Lehrkräfte zahlen hier nicht. Rechne erst pro Kind, dann für alle.",
          `${perChild} − ${fee} = ${perChild - fee}, dann ${kids} · ${perChild - fee} = ${busCost}.`,
          `Für den Bus sind ${busCost} € da.`,
          { kids, adults, perChild, fee },
        );
      },
    },
    {
      id: "kontostand",
      make: (rng, level) => {
        const start = rng.int(-60, 120), rate = rng.int(5, 25), months = rng.int(3, 10);
        const end = start - rate * months;
        if (level === 1)
          return task(
            level,
            `Ein Konto steht bei ${n0(start)} €. In jedem von ${months} Monaten werden ${rate} € abgebucht. Wie hoch ist der Kontostand danach?`,
            "",
            [num("Kontostand:", end, "€", 0)],
            "Berechne alle Abbuchungen zusammen und subtrahiere.",
            `${months} · ${rate} = ${months * rate}. ${n0(start)} − ${months * rate} = ${n0(end)}.`,
            `Der Kontostand ist ${n0(end)} €.`,
            { start, rate, months },
          );
        const income = rng.int(30, 60);
        const net = income - rate;
        const months2 = rng.int(3, 8);
        const end2 = start + net * months2;
        return task(
          level,
          "",
          `Lena hat ${n0(start)} € auf dem Konto. Monatlich bekommt sie ${income} € und gibt ${rate} € für ihren Verein aus. Wie hoch ist der Kontostand nach ${months2} Monaten? Prüfe mit einem Überschlag.`,
          [num("Kontostand:", end2, "€", 0)],
          "Bestimme zuerst, um wie viel sich der Stand pro Monat ändert.",
          `${income} − ${rate} = ${net}. ${n0(start)} + ${months2} · ${net} = ${n0(end2)}.`,
          `Der Kontostand ist ${n0(end2)} €.`,
          { start, income, rate, months2 },
        );
      },
    },
  ],
});

export const STAGE_MULTIPLIKATION = makeStage(
  3,
  "Schriftliche Verfahren, Primfaktoren, Zählprinzip, Vorzeichen, Potenzen und Terme",
  "#d97706",
  "✖️",
  [
    multiplizieren,
    dividieren,
    teilbarkeit,
    primfaktoren,
    zaehlprinzip,
    vorzeichen,
    rechenvorteile,
    potenzen,
    quadratzahlen,
    zehnerpotenzen,
    gleichungenMul,
    gliedern,
    punktVorStrich,
    distributiv,
    vorwaerts,
    sachaufgaben,
  ],
);
