import { fmt, frac, gcd, paren } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  addFractions,
  clean,
  decimalHtml,
  decimalText,
  divFractions,
  expansion,
  fractionKind,
  isFinite25,
  lcm,
  mixedText,
  mulFractions,
  reduce,
  roundSchool,
  subFractions,
} from "../models";
import { choiceField as pick, numberField as num, yesNo } from "./helpers";
import {
  choice as c,
  fractionFields,
  lab,
  makeLesson,
  makeStage,
  output as o,
  range as r,
  task,
} from "./builders";

const L = (step: number, content: Parameters<typeof makeLesson>[2]) =>
  makeLesson(1, step, content);

/** A proper fraction with coprime numerator and denominator. */
function properFraction(rng: Rng, denominators: number[]): [number, number] {
  const d = rng.pick(denominators);
  let n = rng.int(1, d - 1);
  while (gcd(n, d) !== 1) n = rng.int(1, d - 1);
  return [n, d];
}

/** A money amount with both decimals, as on a price tag: "0,60". */
const euro = (value: number) => roundSchool(value, 2).toFixed(2).replace(".", ",");

const ratio = (n: number, d: number) => {
  const [z, m] = reduce(n, d);
  return m === 1 ? `${z}`.replace("-", "−") : `${z}/${m}`.replace("-", "−");
};

const warum = L(1, {
  id: "rz-1-warum-brueche",
  title: "1.1 Warum wir Brüche brauchen",
  subtitle: "Von den ganzen Zahlen zu den rationalen Zahlen",
  whyItMatters:
    "Mit ganzen Zahlen kannst du nicht alles ausdrücken: drei Pizzen für vier Kinder, ein Dreiviertelliter Milch oder die Hälfte der Klasse. Dafür brauchst du Brüche.",
  explanationHtml: `<p>In Klasse 5 hast du mit den ganzen Zahlen …, −2, −1, 0, 1, 2, … gerechnet. Die Rechnung 7 : 3 hat dort aber kein Ergebnis. Brüche schließen diese Lücke, und du begegnest ihnen überall: beim gerechten Teilen, beim Messen (${frac(3, 4)} l), bei Anteilen (${frac(1, 3)} der Klasse) und bei Preisen.</p><div class="example">3 Pizzen werden gerecht auf 4 Kinder verteilt. Das geht ohne Bruch nicht glatt auf. Schneidest du jede Pizza in 4 Stücke, bekommt jedes Kind 3 Stücke, also ${frac(3, 4)} Pizza. Es gilt 3 : 4 = ${frac(3, 4)}.</div><p>Alle Zahlen, die du als Bruch aus ganzen Zahlen schreiben kannst, heißen <strong>rationale Zahlen</strong>; die Menge heißt ℚ. Dazu gehören auch negative Brüche wie −${frac(1, 2)} und jede ganze Zahl, denn 5 = ${frac(5, 1)}.</p><div class="merke"><strong>Merke:</strong> In ℚ hat jede Division a : b mit b ≠ 0 ein Ergebnis, nämlich den Bruch a/b. Durch 0 darfst du nie teilen.</div>`,
  formulas: [
    {
      name: "Division als Bruch",
      html: `a : b = ${frac("a", "b")} (b ≠ 0)`,
      quantities: "a, b ganze Zahlen; im Nenner steht nie 0",
    },
    {
      name: "Zahlenmengen",
      html: "ℕ ⊂ ℤ ⊂ ℚ",
      quantities: "natürliche, ganze und rationale Zahlen",
    },
  ],
  quiz: {
    question: "Warum reichen die ganzen Zahlen nicht aus, um 5 Tafeln Schokolade gerecht auf 3 Kinder zu verteilen?",
    options: [
      "Weil 5 : 3 keine ganze Zahl ergibt",
      "Weil 5 und 3 beide ungerade sind",
      "Weil Schokolade keine Zahl ist",
    ],
    correctIndex: 0,
    explanation:
      "5 : 3 geht in den ganzen Zahlen nicht auf. Als Bruch hat jedes Kind 5/3 Tafeln.",
  },
  lab: lab(
    "share",
    "Gerecht teilen",
    "Verändere Tafeln und Kinder. Von jeder Tafel bekommt jedes Kind ein Teil. Wann geht die Teilung ganz auf?",
    [
      r("n", "Tafeln", 1, 12, 1),
      r("k", "Kinder", 2, 8, 2),
    ],
    [
      o("share", "Jedes Kind bekommt", (v) => ratio(v.n, v.k)),
      o("whole", "Geht es in ganzen Tafeln auf?", (v) =>
        v.n % v.k === 0 ? "ja" : "nein, dafür brauchst du einen Bruch",
      ),
    ],
    [
      {
        id: "drei-viertel",
        text: "Verteile 3 Tafeln auf 4 Kinder.",
        check: (v) => v.n === 3 && v.k === 4,
      },
      {
        id: "ohne-rest",
        text: "Finde eine Verteilung auf 5 Kinder, die ganz aufgeht.",
        check: (v) => v.k === 5 && v.n % 5 === 0,
      },
      {
        id: "mehr-als-eins",
        text: "Verteile 7 Tafeln auf 3 Kinder: mehr als eine Tafel, aber keine ganze Zahl.",
        check: (v) => v.n === 7 && v.k === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "teilen",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [3, 4, 5, 6, 7, 8]);
        const n = level === 1 || rng.pick([true, false]) ? a : a + b * rng.int(1, 2);
        return task(
          level,
          `${n} Pizzen werden gerecht auf ${b} Kinder verteilt. Wie viel Pizza bekommt jedes Kind? Gib den Bruch vollständig gekürzt an.`,
          `Die Klasse backt ${n} gleich große Bleche Kuchen. ${b} Gruppen teilen sie gerecht. Gib den Anteil pro Gruppe als gekürzten Bruch an und entscheide, ob jede Gruppe mindestens ein ganzes Blech bekommt.`,
          [
            ...fractionFields(n, b),
            ...(level === 2 ? [yesNo("Mindestens ein ganzes Blech?", n >= b)] : []),
          ],
          "a Ganze auf b gerecht verteilt: Jeder bekommt a/b.",
          `${n} : ${b} = ${frac(n, b)}.`,
          `Jeder Teil beträgt ${ratio(n, b)}.`,
          { n, b },
        );
      },
    },
    {
      id: "welche-menge",
      make: (rng, level) => {
        const b = rng.pick([2, 3, 4, 5, 6]);
        const whole = rng.pick([true, false]);
        const n = whole ? b * rng.int(2, 6) : b * rng.int(1, 5) + 1;
        const negative = level === 2 && rng.pick([true, false]);
        const shown = negative ? -n : n;
        const inZ = n % b === 0;
        return task(
          level,
          `Berechne ${n} : ${b} (als Bruch oder auf zwei Stellen gerundet). Liegt das Ergebnis in der Menge ℤ der ganzen Zahlen?`,
          `Berechne ${paren(shown)} : ${b} (als Bruch oder auf zwei Stellen gerundet). Liegt das Ergebnis in ℤ?`,
          [
            num("Ergebnis =", shown / b, "", 2),
            yesNo("Liegt es in ℤ?", inZ),
          ],
          "Geht die Division ohne Rest auf, liegt das Ergebnis in ℤ, sonst nur in ℚ.",
          `${paren(shown)} : ${b} = ${ratio(shown, b)}.`,
          `${ratio(shown, b)}, ${inZ ? "liegt in ℤ" : "liegt nicht in ℤ, aber in ℚ"}.`,
          { shown, b },
        );
      },
    },
  ],
});

const grundvorstellungen = L(2, {
  id: "rz-2-grundvorstellungen",
  title: "1.2 Was ein Bruch bedeuten kann",
  subtitle: "Anteil, Division und Rechenbefehl",
  whyItMatters:
    "Derselbe Bruch beschreibt je nach Situation etwas anderes. Wer die Bedeutungen kennt, findet in Textaufgaben schneller die passende Rechnung.",
  explanationHtml: `<p>Im Bruch ${frac("3", "4")} heißt die untere Zahl <strong>Nenner</strong>: Sie nennt, in wie viele gleich große Teile das Ganze zerlegt ist. Die obere Zahl heißt <strong>Zähler</strong>: Sie zählt, wie viele Teile du nimmst.</p><p>Ein Bruch hat drei Grundvorstellungen: als <strong>Anteil</strong> (${frac(3, 4)} eines Kuchens), als <strong>Ergebnis einer Division</strong> (3 Kuchen auf 4 Personen, also 3 : 4) und als <strong>Rechenbefehl</strong> (${frac(3, 4)} von 20 € heißt: durch 4 teilen, mal 3 nehmen).</p><div class="example">${frac(3, 4)} von 20 €: 20 € : 4 = 5 €, und 5 € · 3 = 15 €.</div><div class="merke"><strong>Merke:</strong> Der Nenner teilt, der Zähler zählt. „von“ bedeutet: durch den Nenner teilen, mit dem Zähler malnehmen.</div>`,
  formulas: [
    {
      name: "Bruch",
      html: `${frac("Zähler", "Nenner")}`,
      quantities: "Nenner: in wie viele gleiche Teile; Zähler: wie viele Teile",
    },
    {
      name: "Bruch als Rechenbefehl",
      html: `${frac("z", "n")} von G = G : n · z`,
      quantities: "G das Ganze",
    },
  ],
  quiz: {
    question: "Was gibt der Nenner eines Bruchs an?",
    options: [
      "In wie viele gleich große Teile das Ganze zerlegt ist",
      "Wie viele Teile genommen werden",
      "Wie groß das Ganze ist",
    ],
    correctIndex: 0,
    explanation:
      "Der Nenner benennt die Teilgröße, zum Beispiel Viertel. Der Zähler zählt die genommenen Teile.",
  },
  lab: lab(
    "fraction-bar",
    "Zähler und Nenner",
    "Ziehe den Zähler und wähle den Nenner. Beobachte Rechteck, Kreis und die Rechnung.",
    [r("z", "Zähler", 0, 12, 1), r("n", "Nenner", 2, 12, 2)],
    [
      o("share", "Bruch", (v) => `${v.z}/${v.n}`),
      o("value", "Als Dezimalzahl", (v) => v.z / v.n, "", 3),
      o("of", "Davon von 120 €", (v) => (120 * v.z) / v.n, "€"),
    ],
    [
      {
        id: "dreiviertel",
        text: "Stelle drei Viertel dar.",
        check: (v) => v.z === 3 && v.n === 4,
      },
      {
        id: "ganzes",
        text: "Stelle mit dem Nenner 6 genau ein Ganzes dar.",
        check: (v) => v.z === 6 && v.n === 6,
      },
      {
        id: "funf-achtel",
        text: "Stelle 5/8 ein: Das sind 75 € von 120 €.",
        check: (v) => v.z === 5 && v.n === 8,
      },
    ],
  ),
  exercises: [
    {
      id: "anteil",
      make: (rng, level) => {
        const n = rng.pick([4, 5, 6, 8, 10, 12]);
        const z = rng.int(1, n - 1);
        return task(
          level,
          `Ein Rechteck ist in ${n} gleich große Teile geteilt, ${z} davon sind gefärbt. Welcher Anteil ist gefärbt? Gib den gekürzten Bruch an.`,
          `In einer Klasse mit ${n * 2} Kindern kommen ${z * 2} mit dem Fahrrad, alle anderen zu Fuß. Welcher Anteil kommt zu Fuß? Gib den gekürzten Bruch an.`,
          level === 1 ? fractionFields(z, n) : fractionFields(n - z, n),
          "Anteil = gesuchte Teile : alle Teile, danach kürzen.",
          level === 1
            ? `${z} von ${n} Teilen sind ${frac(z, n)}.`
            : `Zu Fuß kommen ${2 * n} − ${2 * z} = ${2 * (n - z)} Kinder, also ${frac(2 * (n - z), 2 * n)}.`,
          `Der Anteil ist ${ratio(level === 1 ? z : n - z, n)}.`,
          { n, z },
        );
      },
    },
    {
      id: "befehl",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [3, 4, 5, 6, 8]);
        const g = n * rng.int(2, 12);
        const part = (g * z) / n;
        return task(
          level,
          `Berechne ${frac(z, n)} von ${g} €.`,
          `${g} Kinder sind in der Jahrgangsstufe. ${frac(z, n)} von ihnen fahren mit dem Bus. Wie viele Kinder fahren nicht mit dem Bus?`,
          [
            level === 1
              ? num("Bruchteil =", part, "€", 2, {
                  slips: [{ value: g / n, hint: "Das ist erst ein Teil. Nimm ihn noch mit dem Zähler mal." }],
                })
              : num("Anzahl =", g - part, "Kinder", 0, {
                  slips: [{ value: part, hint: "So viele fahren mit dem Bus. Gesucht sind die anderen." }],
                }),
          ],
          "Durch den Nenner teilen, mit dem Zähler malnehmen.",
          `${g} : ${n} = ${g / n}, ${g / n} · ${z} = ${part}.${level === 2 ? ` ${g} − ${part} = ${g - part}.` : ""}`,
          level === 1 ? `${part} €.` : `${g - part} Kinder.`,
          { z, n, g },
        );
      },
    },
  ],
});

const bruchformen = L(3, {
  id: "rz-3-bruchformen",
  title: "1.3 Echte, unechte und gemischte Brüche",
  subtitle: "Wann ein Bruch mehr als ein Ganzes ist",
  whyItMatters:
    "Auf dem Messbecher steht 1 ½ l, in der Rechnung schreibst du lieber 3/2. Du wechselst deshalb oft zwischen beiden Schreibweisen.",
  explanationHtml: `<p>Bei einem <strong>echten Bruch</strong> ist der Zähler kleiner als der Nenner: ${frac(3, 4)} ist weniger als ein Ganzes. Bei einem <strong>unechten Bruch</strong> ist der Zähler mindestens so groß wie der Nenner: ${frac(7, 4)} ist mehr als ein Ganzes. Einen unechten Bruch kannst du als <strong>gemischten Bruch</strong> schreiben: Ganze und ein echter Bruch.</p><div class="example">${frac(11, 4)}: 11 : 4 = 2 Rest 3, also 2 ${frac(3, 4)}. Zurück: 2 ${frac(3, 4)} = ${frac("2 · 4 + 3", 4)} = ${frac(11, 4)}.</div><div class="merke"><strong>Merke:</strong> Unecht zu gemischt: Zähler durch Nenner, das Ergebnis sind die Ganzen, der Rest ist der neue Zähler. Gemischt zu unecht: Ganze mal Nenner plus Zähler.</div>`,
  formulas: [
    {
      name: "Gemischter Bruch",
      html: `g ${frac("z", "n")} = ${frac("g · n + z", "n")}`,
      quantities: "g Ganze, z Zähler, n Nenner",
    },
  ],
  quiz: {
    question: "Welcher Bruch ist ein unechter Bruch?",
    options: ["9/4", "4/9", "1/9"],
    correctIndex: 0,
    explanation: "Bei 9/4 ist der Zähler größer als der Nenner; der Wert liegt über 1.",
  },
  lab: lab(
    "mixed",
    "Ganze Streifen",
    "Erhöhe den Zähler. Sobald ein Streifen voll ist, beginnt der nächste.",
    [r("z", "Zähler", 1, 24, 1), r("n", "Nenner", 2, 8, 2)],
    [
      o("kind", "Art", (v) => fractionKind(v.z, v.n)),
      o("mixed", "Geschrieben als", (v) => mixedText(v.z, v.n)),
    ],
    [
      {
        id: "echt",
        text: "Stelle den echten Bruch 5/6 ein.",
        check: (v) => v.z === 5 && v.n === 6,
      },
      {
        id: "unecht",
        text: "Stelle einen unechten Bruch mit dem Wert 1 3/4 ein.",
        check: (v) => v.z === 7 && v.n === 4,
      },
      {
        id: "drei-ganze",
        text: "Stelle mit dem Nenner 4 genau drei Ganze ein.",
        check: (v) => v.z === 12 && v.n === 4,
      },
    ],
  ),
  exercises: [
    {
      id: "umwandeln",
      make: (rng, level) => {
        const n = rng.pick([3, 4, 5, 6, 8]);
        const g = rng.int(1, 5);
        let rest = rng.int(1, n - 1);
        while (gcd(rest, n) !== 1) rest = rng.int(1, n - 1);
        const z = g * n + rest;
        return level === 1
          ? task(
              level,
              `Schreibe ${frac(z, n)} als gemischten Bruch.`,
              "",
              [num("Ganze =", g, "", 0), num("Zähler =", rest, "", 0), num("Nenner =", n, "", 0)],
              "Zähler durch Nenner: Ergebnis sind die Ganzen, der Rest ist der neue Zähler.",
              `${z} : ${n} = ${g} Rest ${rest}.`,
              `${g} ${rest}/${n}.`,
              { z, n },
            )
          : task(
              level,
              "",
              `In einem Krug sind ${g} ${frac(rest, n)} Liter Saft. Du füllst ihn in Gläser mit je ${frac(1, n)} Liter. Wie viele Gläser kannst du füllen?`,
              [
                num("Anzahl =", z, "Gläser", 0, {
                  slips: [{ value: g + rest, hint: "Rechne die Ganzen erst in Teile um: Ganze mal Nenner." }],
                }),
              ],
              "Schreibe den gemischten Bruch als unechten Bruch.",
              `${g} ${frac(rest, n)} = ${frac(`${g} · ${n} + ${rest}`, n)} = ${frac(z, n)}.`,
              `${z} Gläser.`,
              { z, n },
            );
      },
    },
    {
      id: "erkennen",
      make: (rng, level) => {
        const n = rng.pick([3, 4, 5, 6, 7, 8]);
        const type = rng.int(0, 2);
        const z = type === 0 ? rng.int(1, n - 1) : type === 1 ? n + rng.int(1, n - 1) : n * rng.int(2, 4);
        const options = ["echter Bruch", "unechter Bruch mit Rest", "unechter Bruch, genau ganze Zahl"];
        return task(
          level,
          `Um welche Art von Bruch handelt es sich bei ${frac(z, n)}?`,
          `Ordne ${frac(z, n)} ein und gib an, wie viele ganze Einheiten darin stecken. Wäre der Bruch weniger als ein Ganzes, wären es 0.`,
          [
            pick("Art des Bruchs", options, type),
            ...(level === 2 ? [num("Ganze Einheiten =", Math.floor(z / n), "", 0)] : []),
          ],
          "Vergleiche Zähler und Nenner, dann teile den Zähler durch den Nenner.",
          `${z} : ${n} = ${Math.floor(z / n)} Rest ${z % n}.`,
          `${options[type]} (${mixedText(z, n)}).`,
          { z, n },
        );
      },
    },
  ],
});

const bruchteile = L(4, {
  id: "rz-4-bruchteile",
  title: "1.4 Bruchteile und das Ganze",
  subtitle: "Vom Ganzen zum Teil und vom Teil zum Ganzen",
  whyItMatters:
    "„Ein Drittel des Taschengelds“ oder „drei Viertel sind schon verkauft“: Oft kennst du das Ganze, manchmal nur den Teil.",
  explanationHtml: `<p>Einen <strong>Bruchteil</strong> berechnest du, indem du das Ganze durch den Nenner teilst und mit dem Zähler malnimmst. Kennst du nur den Bruchteil, gehst du zurück: Erst berechnest du einen einzelnen Teil, dann das <strong>Ganze</strong>.</p><div class="example">${frac(2, 5)} der Strecke sind 18 km. Ein Fünftel sind 18 km : 2 = 9 km. Das Ganze sind 5 · 9 km = 45 km. Probe: ${frac(2, 5)} von 45 km = 18 km.</div><div class="merke"><strong>Merke:</strong> Bruchteil: Ganzes : Nenner · Zähler. Ganzes: Bruchteil : Zähler · Nenner. Die Probe zeigt, ob du richtig gedacht hast.</div>`,
  formulas: [
    {
      name: "Bruchteil",
      html: `T = G : n · z`,
      quantities: "G das Ganze, T der Bruchteil, z/n der Bruch",
    },
    {
      name: "Das Ganze",
      html: `G = T : z · n`,
      quantities: "T der bekannte Bruchteil",
    },
  ],
  quiz: {
    question: "3/4 einer Summe sind 60 €. Wie groß ist die ganze Summe?",
    options: ["80 €", "45 €", "240 €"],
    correctIndex: 0,
    explanation: "Ein Viertel sind 60 € : 3 = 20 €, das Ganze also 4 · 20 € = 80 €. 45 € wären 3/4 von 60 €.",
  },
  lab: lab(
    "part-whole",
    "Teil und Ganzes",
    "Wähle, ob du das Ganze oder den Bruchteil kennst, und stelle den Bruch ein. Die Balken zeigen beide Größen.",
    [
      c("mode", "Bekannt ist", ["das Ganze", "der Bruchteil"]),
      r("z", "Zähler", 1, 9, 1),
      r("n", "Nenner", 2, 10, 2),
      r("a", "Bekannter Wert", 6, 120, 30, 6),
    ],
    [
      o("part", "Bruchteil", (v) => (v.mode === 0 ? (v.a * v.z) / v.n : v.a)),
      o("whole", "Das Ganze", (v) => (v.mode === 0 ? v.a : (v.a * v.n) / v.z)),
    ],
    [
      {
        id: "teil",
        text: "Berechne 3/4 von 60.",
        check: (v) => v.mode === 0 && v.z === 3 && v.n === 4 && v.a === 60,
      },
      {
        id: "ganzes",
        text: "2/5 sind 18. Bestimme das Ganze.",
        check: (v) => v.mode === 1 && v.z === 2 && v.n === 5 && v.a === 18,
      },
      {
        id: "groesser",
        text: "Berechne 5/4 von 24. Der Bruchteil ist größer als das Ganze.",
        check: (v) => v.mode === 0 && v.z === 5 && v.n === 4 && v.a === 24,
      },
    ],
  ),
  exercises: [
    {
      id: "bruchteil",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [3, 4, 5, 8, 10]);
        const g = n * rng.int(3, 20);
        const part = (g * z) / n;
        const unit = rng.pick(["kg", "m", "€"]);
        return task(
          level,
          `Berechne ${frac(z, n)} von ${g} ${unit}.`,
          `Lena hat ${g} € gespart. Sie gibt ${frac(z, n)} davon für ein Spiel aus. Wie viel Geld bleibt ihr?`,
          [
            level === 1
              ? num("Bruchteil =", part, unit, 2)
              : num("Rest =", g - part, "€", 2, {
                  slips: [{ value: part, hint: "Das hat sie ausgegeben. Gesucht ist, was übrig bleibt." }],
                }),
          ],
          "Ganzes durch Nenner, dann mal Zähler.",
          `${g} : ${n} · ${z} = ${part}.${level === 2 ? ` Übrig: ${g} − ${part} = ${g - part}.` : ""}`,
          level === 1 ? `${part} ${unit}.` : `${g - part} €.`,
          { z, n, g },
        );
      },
    },
    {
      id: "ganzes",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [3, 4, 5, 8]);
        const unitValue = rng.int(2, 15);
        const whole = n * unitValue;
        const part = z * unitValue;
        const rest = whole - part;
        return task(
          level,
          `${frac(z, n)} einer Strecke sind ${part} km. Wie lang ist die ganze Strecke?`,
          `Mia hat ${frac(z, n)} ihres Geldes ausgegeben und noch ${rest} € übrig. Wie viel Geld hatte sie am Anfang?`,
          [
            num("Das Ganze =", whole, level === 1 ? "km" : "€", 2, {
              slips: [
                { value: level === 1 ? (part * z) / n : (rest * z) / n, hint: "Du hast noch einmal den Bruchteil berechnet. Gehe rückwärts: erst durch den Zähler, dann mal den Nenner." },
              ],
            }),
          ],
          "Bruchteil durch Zähler ergibt einen Teil; mal Nenner ergibt das Ganze.",
          level === 1
            ? `${part} : ${z} · ${n} = ${whole}.`
            : `Übrig sind ${frac(n - z, n)}. ${rest} : ${n - z} · ${n} = ${whole}.`,
          `${whole} ${level === 1 ? "km" : "€"}.`,
          { z, n, whole },
        );
      },
    },
  ],
});

const erweitern = L(5, {
  id: "rz-5-erweitern-kuerzen",
  title: "1.5 Erweitern und Kürzen",
  subtitle: "Verschiedene Schreibweisen für denselben Wert",
  whyItMatters:
    "Damit du Brüche vergleichen und addieren kannst, brauchst du wertgleiche Brüche mit passendem Nenner. Gekürzte Ergebnisse sind außerdem leichter zu lesen.",
  explanationHtml: `<p><strong>Erweitern</strong> heißt: Zähler und Nenner mit derselben Zahl malnehmen. <strong>Kürzen</strong> heißt: Zähler und Nenner durch dieselbe Zahl teilen. Der Wert des Bruchs bleibt dabei gleich, nur die Einteilung wird feiner oder gröber.</p><div class="example">Erweitern mit 3: ${frac(3, 4)} = ${frac("3 · 3", "4 · 3")} = ${frac(9, 12)}. Kürzen durch 6: ${frac(12, 18)} = ${frac("12 : 6", "18 : 6")} = ${frac(2, 3)}.</div><p>Ein Bruch ist <strong>vollständig gekürzt</strong>, wenn Zähler und Nenner außer 1 keinen gemeinsamen Teiler mehr haben. Am schnellsten kürzt du durch den ggT, den du aus Klasse 5 kennst.</p><div class="merke"><strong>Merke:</strong> Erweitern und Kürzen ändern den Wert nicht. Addiere dabei nie dieselbe Zahl zu Zähler und Nenner, das ändert den Wert.</div>`,
  formulas: [
    {
      name: "Erweitern",
      html: `${frac("a", "b")} = ${frac("a · k", "b · k")} (k ≠ 0)`,
      quantities: "k der Erweiterungsfaktor",
    },
    {
      name: "Kürzen",
      html: `${frac("a · k", "b · k")} = ${frac("a", "b")} (k ≠ 0)`,
      quantities: "k ein gemeinsamer Teiler von Zähler und Nenner",
    },
  ],
  quiz: {
    question: "Welcher Bruch hat denselben Wert wie 6/8?",
    options: ["3/4", "7/9", "8/6"],
    correctIndex: 0,
    explanation: "Kürzen durch 2 ergibt 3/4. Bei 7/9 wurde auf beiden Seiten 1 addiert, das ändert den Wert.",
  },
  lab: lab(
    "expand",
    "Wertgleiche Brüche",
    "Erweitere den oberen Bruch. Die gefärbte Fläche bleibt gleich groß, nur die Einteilung wird feiner.",
    [
      r("z", "Zähler", 1, 7, 1),
      r("n", "Nenner", 2, 8, 3),
      r("k", "Erweitern mit", 1, 6, 1),
    ],
    [
      o("expanded", "Erweitert", (v) => `${v.z * v.k}/${v.n * v.k}`),
      o("reduced", "Vollständig gekürzt", (v) => ratio(v.z, v.n)),
      o("value", "Wert", (v) => v.z / v.n, "", 3),
    ],
    [
      {
        id: "neun-zwoelftel",
        text: "Zeige, dass 3/4 = 9/12 ist.",
        check: (v) => v.z === 3 && v.n === 4 && v.k === 3,
      },
      {
        id: "acht-zwoelftel",
        text: "Erweitere 2/3 auf den Nenner 12.",
        check: (v) => v.z === 2 && v.n === 3 && v.k === 4,
      },
      {
        id: "kuerzbar",
        text: "Stelle 4/6 ein: Im Bruch steckt noch ein gemeinsamer Teiler, gekürzt ist er 2/3.",
        check: (v) => v.z === 4 && v.n === 6 && v.k === 1,
      },
    ],
  ),
  exercises: [
    {
      id: "erweitern",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [2, 3, 4, 5, 6]);
        if (level === 1) {
          const k = rng.int(2, 8);
          return task(
            level,
            `Erweitere ${frac(z, n)} mit ${k}.`,
            "",
            [num("Zähler =", z * k, "", 0), num("Nenner =", n * k, "", 0)],
            "Zähler und Nenner mit derselben Zahl malnehmen.",
            `${z} · ${k} = ${z * k}, ${n} · ${k} = ${n * k}.`,
            `${z * k}/${n * k}.`,
            { z, n, k },
          );
        }
        const target = n * rng.int(4, 9);
        return task(
          level,
          "",
          `In einem Lostopf sind ${frac(z, n)} aller Lose Gewinne. Es sind ${target} Lose. Schreibe den Anteil als Bruch mit dem Nenner ${target}. Wie viele Gewinnlose sind es also?`,
          [num("Gewinnlose =", (z * target) / n, "", 0)],
          "Welcher Faktor macht aus dem Nenner den gewünschten Nenner?",
          `${n} · ${target / n} = ${target}, also auch ${z} · ${target / n} = ${(z * target) / n}.`,
          `${(z * target) / n} Gewinnlose.`,
          { z, n, target },
        );
      },
    },
    {
      id: "kuerzen",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [3, 4, 5, 7, 8, 9]);
        const k = rng.int(2, 9);
        const top = z * k;
        const bottom = n * k;
        return level === 1
          ? task(
              level,
              `Kürze ${frac(top, bottom)} vollständig.`,
              "",
              fractionFields(top, bottom),
              "Teile Zähler und Nenner durch ihren größten gemeinsamen Teiler.",
              `Der ggT von ${top} und ${bottom} ist ${gcd(top, bottom)}.`,
              `${ratio(top, bottom)}.`,
              { top, bottom },
            )
          : task(
              level,
              "",
              `Bei einem Quiz hat Jonas ${top} von ${bottom} Fragen richtig beantwortet. Gib seinen Anteil richtiger Antworten vollständig gekürzt an. War es mehr als die Hälfte?`,
              [...fractionFields(top, bottom), yesNo("Mehr als die Hälfte?", 2 * z > n)],
              "Anteil aufstellen, kürzen, dann mit 1/2 vergleichen.",
              `${frac(top, bottom)} = ${ratio(top, bottom)}.`,
              `${ratio(top, bottom)}, ${2 * z > n ? "mehr" : "nicht mehr"} als die Hälfte.`,
              { top, bottom },
            );
      },
    },
  ],
});

const stellenwerte = L(6, {
  id: "rz-6-stellenwerte",
  title: "1.6 Dezimalzahlen und Stellenwerte",
  subtitle: "Zehntel, Hundertstel und Tausendstel",
  whyItMatters:
    "Preise, Längen und Zeiten beim Sport stehen meist als Dezimalzahl da. Die Stellenwerte sagen dir, was jede Ziffer wert ist.",
  explanationHtml: `<p>Nach dem Komma geht die Stellenwerttafel weiter: <strong>Zehntel</strong> (z), <strong>Hundertstel</strong> (h), <strong>Tausendstel</strong> (t). Jede Stelle ist zehnmal kleiner als die links davon.</p><div class="example">3,074 = 3 E + 0 z + 7 h + 4 t = 3 + ${frac(7, 100)} + ${frac(4, 1000)} = 3 ${frac(74, 1000)}.</div><p>Nullen am Ende nach dem Komma ändern den Wert nicht: 0,5 = 0,50. Eine Null zwischen den Ziffern ist dagegen wichtig: 0,05 ist zehnmal kleiner als 0,5. Zum Umwandeln in einen Bruch liest du die letzte Stelle ab: 0,35 sind 35 Hundertstel, also ${frac(35, 100)} = ${frac(7, 20)}.</p><div class="merke"><strong>Merke:</strong> Die erste Stelle nach dem Komma sind die Zehntel, die zweite die Hundertstel, die dritte die Tausendstel.</div>`,
  formulas: [
    {
      name: "Stellenwerte",
      html: `0,1 = ${frac(1, 10)}; 0,01 = ${frac(1, 100)}; 0,001 = ${frac(1, 1000)}`,
      quantities: "Zehntel, Hundertstel, Tausendstel",
    },
  ],
  quiz: {
    question: "Welche Ziffer steht in 4,283 an der Hundertstelstelle?",
    options: ["8", "2", "3"],
    correctIndex: 0,
    explanation: "Direkt nach dem Komma stehen die Zehntel (2), danach die Hundertstel (8), dann die Tausendstel (3).",
  },
  lab: lab(
    "place-value",
    "Stellenwerttafel",
    "Stelle die Ziffern ein. Die Tafel zeigt die Zahl, ihre Zerlegung und den gekürzten Bruch.",
    [
      r("e", "Einer", 0, 9, 1),
      r("a", "Zehntel", 0, 9, 0),
      r("b", "Hundertstel", 0, 9, 0),
      r("c", "Tausendstel", 0, 9, 0),
    ],
    [
      o("number", "Zahl", (v) => fmt(v.e + v.a / 10 + v.b / 100 + v.c / 1000, 3)),
      o("fraction", "Als Bruch", (v) => {
        const top = v.e * 1000 + v.a * 100 + v.b * 10 + v.c;
        return ratio(top, 1000);
      }),
    ],
    [
      {
        id: "vier-25",
        text: "Stelle 4,25 ein.",
        check: (v) => v.e === 4 && v.a === 2 && v.b === 5 && v.c === 0,
      },
      {
        id: "null-305",
        text: "Stelle 0,305 ein.",
        check: (v) => v.e === 0 && v.a === 3 && v.b === 0 && v.c === 5,
      },
      {
        id: "drei-hundertstel",
        text: "Stelle die Zahl aus genau drei Hundertsteln ein.",
        check: (v) => v.e === 0 && v.a === 0 && v.b === 3 && v.c === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "stelle",
      make: (rng, level) => {
        const e = rng.int(1, 9);
        const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
        const value = e + digits[0] / 10 + digits[1] / 100 + digits[2] / 1000;
        const place = rng.int(0, 2);
        const names = ["Zehntelstelle", "Hundertstelstelle", "Tausendstelstelle"];
        return level === 1
          ? task(
              level,
              `Welche Ziffer steht in ${fmt(value, 3)} an der ${names[place]}?`,
              "",
              [num("Ziffer =", digits[place], "", 0)],
              "Nach dem Komma: Zehntel, Hundertstel, Tausendstel.",
              `Die Stellen nach dem Komma sind ${digits[0]}, ${digits[1]} und ${digits[2]}.`,
              `${digits[place]}.`,
              { value },
            )
          : task(
              level,
              "",
              `Schreibe als Dezimalzahl: ${e} Einer, ${digits[2]} Tausendstel und ${digits[0]} Zehntel. Achte auf die fehlende Stelle.`,
              [num("Zahl =", e + digits[0] / 10 + digits[2] / 1000, "", 3)],
              "Trage die Ziffern in die Stellenwerttafel ein; leere Stellen füllst du mit 0.",
              `E = ${e}, z = ${digits[0]}, h = 0, t = ${digits[2]}.`,
              `${fmt(e + digits[0] / 10 + digits[2] / 1000, 3)}.`,
              { e },
            );
      },
    },
    {
      id: "als-bruch",
      make: (rng, level) => {
        const top = rng.pick([5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 2, 4, 6, 8, 12, 14, 16, 18, 22, 24]);
        const value = top / 100;
        if (level === 1)
          return task(
            level,
            `Schreibe ${fmt(value)} als vollständig gekürzten Bruch.`,
            "",
            fractionFields(top, 100),
            "Lies die letzte Stelle ab: Hundertstel. Dann kürzen.",
            `${fmt(value)} = ${frac(top, 100)}.`,
            `${ratio(top, 100)}.`,
            { top },
          );
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const c0 = rng.int(1, 9);
        return task(
          level,
          "",
          `Berechne im Kopf ${frac(a, 10)} + ${frac(b, 100)} + ${frac(c0, 1000)} und schreibe das Ergebnis als Dezimalzahl.`,
          [num("Summe =", a / 10 + b / 100 + c0 / 1000, "", 3)],
          "Jeder Bruch gehört an genau eine Stelle nach dem Komma.",
          `z = ${a}, h = ${b}, t = ${c0}.`,
          `${fmt(a / 10 + b / 100 + c0 / 1000, 3)}.`,
          { a, b, c0 },
        );
      },
    },
  ],
});

const bruchDezimal = L(7, {
  id: "rz-7-bruch-dezimal",
  title: "1.7 Vom Bruch zur Dezimalzahl",
  subtitle: "Endliche und periodische Dezimalzahlen",
  whyItMatters:
    "Der Taschenrechner zeigt für 1/3 den Wert 0,3333333. Du lernst, was dahintersteckt und warum das bei 3/8 nicht passiert.",
  explanationHtml: `<p>Jeder Bruch ist eine Division: ${frac(3, 8)} = 3 : 8 = 0,375. Manche Nenner kannst du auch auf 10, 100 oder 1000 erweitern: ${frac(3, 4)} = ${frac(75, 100)} = 0,75.</p><p>Bei der Division gibt es zwei Möglichkeiten. Wird der Rest 0, entsteht eine <strong>endliche Dezimalzahl</strong>. Wiederholt sich ein Rest, wiederholen sich auch die Ziffern: Es entsteht eine <strong>nicht endliche, periodische Dezimalzahl</strong>. Die sich wiederholenden Ziffern heißen <strong>Periode</strong> und bekommen einen Strich.</p><div class="example">${frac(1, 3)} = 0,333… = 0,<span class="periode">3</span> und ${frac(1, 6)} = 0,1666… = 0,1<span class="periode">6</span>.</div><div class="merke"><strong>Merke:</strong> Ein vollständig gekürzter Bruch ergibt genau dann eine endliche Dezimalzahl, wenn sein Nenner nur die Primfaktoren 2 und 5 enthält.</div>`,
  formulas: [
    {
      name: "Bruch als Division",
      html: `${frac("a", "b")} = a : b`,
      quantities: "schriftlich dividieren, bis der Rest 0 wird oder sich wiederholt",
    },
    {
      name: "Periode",
      html: `0,1<span class="periode">6</span> = 0,1666…`,
      quantities: "der Strich steht über den Ziffern, die sich wiederholen",
    },
  ],
  quiz: {
    question: "Welcher vollständig gekürzte Bruch ergibt eine periodische Dezimalzahl?",
    options: ["5/6", "5/8", "7/20"],
    correctIndex: 0,
    explanation: "Der Nenner 6 = 2 · 3 enthält den Primfaktor 3. Bei 8 und 20 kommen nur 2 und 5 vor.",
  },
  lab: lab(
    "long-division",
    "Schriftlich dividieren",
    "Stelle Zähler und Nenner ein und verfolge die Reste. Wiederholt sich ein Rest oder wird er 0?",
    [r("z", "Zähler", 1, 20, 1), r("n", "Nenner", 2, 16, 2)],
    [
      o("decimal", "Dezimalzahl", (v) => decimalText(v.z, v.n)),
      o("kind", "Art", (v) =>
        isFinite25(v.z, v.n) ? "endlich" : "nicht endlich, periodisch",
      ),
    ],
    [
      {
        id: "endlich",
        text: "Berechne 3/8 und zeige: Die Dezimalzahl ist endlich.",
        check: (v) => v.z === 3 && v.n === 8,
      },
      {
        id: "rein",
        text: "Berechne 2/3: Die Periode beginnt direkt nach dem Komma.",
        check: (v) => v.z === 2 && v.n === 3,
      },
      {
        id: "spaet",
        text: "Berechne 1/6: Die Periode beginnt erst an der zweiten Stelle.",
        check: (v) => v.z === 1 && v.n === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "endlich",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [4, 5, 8, 10, 20, 25]);
        const value = z / n;
        if (level === 1)
          return task(
            level,
            `Schreibe ${frac(z, n)} als Dezimalzahl.`,
            "",
            [num("Dezimalzahl =", value, "", 3)],
            "Erweitere auf 10, 100 oder 1000 oder dividiere schriftlich.",
            `${z} : ${n} = ${decimalHtml(z, n)}.`,
            `${decimalHtml(z, n)}.`,
            { z, n },
          );
        const g = rng.int(1, 4);
        return task(
          level,
          "",
          `Ein Rezept verlangt ${g} ${frac(z, n)} Liter Milch. Dein Messbecher zeigt Dezimalzahlen. Welche Zahl musst du ablesen?`,
          [num("Menge =", g + value, "l", 3)],
          "Schreibe nur den Bruchteil als Dezimalzahl und setze die Ganzen davor.",
          `${frac(z, n)} = ${decimalHtml(z, n)}.`,
          `${fmt(g + value, 3)} l.`,
          { z, n, g },
        );
      },
    },
    {
      id: "periodisch",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [3, 6, 7, 9, 11, 12]);
        const e = expansion(z, n);
        const options = ["endlich", "nicht endlich, periodisch"];
        if (level === 1)
          return task(
            level,
            `Ist die Dezimalzahl von ${frac(z, n)} endlich oder periodisch? Runde auf drei Stellen nach dem Komma.`,
            "",
            [
              pick("Art", options, 1),
              num("Gerundet ≈", roundSchool(z / n, 3), "", 3),
            ],
            "Zerlege den Nenner in Primfaktoren. Ein anderer Faktor als 2 und 5 bedeutet: periodisch.",
            `${z} : ${n} = ${decimalHtml(z, n)}.`,
            `Periodisch, ≈ ${fmt(roundSchool(z / n, 3), 3)}.`,
            { z, n },
          );
        const [p, q] = rng.pick([true, false]) ? [z, n] : properFraction(rng, [4, 8, 16, 20, 25, 40]);
        const finite = isFinite25(p, q);
        const [, m] = reduce(p, q);
        return task(
          level,
          "",
          `Ohne zu rechnen: Entscheide am vollständig gekürzten Nenner von ${frac(p, q)}, ob die Dezimalzahl endlich ist. Gib den größten Primfaktor des Nenners an.`,
          [
            pick("Art", options, finite ? 0 : 1),
            num("Größter Primfaktor =", Math.max(...primeFactors(m)), "", 0),
          ],
          "Nur 2 und 5 im Nenner: endlich. Jeder andere Primfaktor: periodisch.",
          `Nenner ${m} = ${primeFactors(m).join(" · ")}.`,
          `${finite ? "Endlich" : "Periodisch"}: ${decimalHtml(p, q)}.`,
          { p, q, period: e.period.length },
        );
      },
    },
  ],
});

function primeFactors(value: number): number[] {
  const factors: number[] = [];
  let rest = value;
  for (let p = 2; rest > 1; p++)
    while (rest % p === 0) {
      factors.push(p);
      rest /= p;
    }
  return factors;
}

const runden = L(8, {
  id: "rz-8-runden",
  title: "1.8 Runden, wie es die Situation verlangt",
  subtitle: "Genau genug statt möglichst lang",
  whyItMatters:
    "Niemand bezahlt 3,1416 €. Du rundest auf eine sinnvolle Stelle und manchmal musst du trotz der Regel aufrunden: Für 87 Kinder reichen 2 Busse mit je 30 Plätzen nicht.",
  explanationHtml: `<p>Beim Runden betrachtest du die Ziffer direkt rechts von der Rundungsstelle. Ist sie 0, 1, 2, 3 oder 4, wird <strong>abgerundet</strong>; ist sie 5, 6, 7, 8 oder 9, wird <strong>aufgerundet</strong>.</p><div class="example">3,146 auf Hundertstel: Rechts von der 4 steht eine 6, also 3,15. 2,96 auf Zehntel: Rechts von der 9 steht eine 6, also 3,0. Die Null bleibt stehen, denn sie zeigt, auf welche Stelle gerundet wurde.</div><p>Welche Stelle sinnvoll ist, hängt von der Situation ab: Geldbeträge auf Cent, Laufstrecken vielleicht auf 100 m. Bei Fragen wie „Wie viele Packungen brauche ich?“ rundest du immer auf, weil sonst etwas fehlt.</p><div class="merke"><strong>Merke:</strong> Ziffer rechts von der Rundungsstelle ab 5: aufrunden, sonst abrunden. Prüfe danach, ob das Ergebnis zur Situation passt.</div>`,
  formulas: [
    {
      name: "Rundungsregel",
      html: "Ziffer 0–4: abrunden; Ziffer 5–9: aufrunden",
      quantities: "gemeint ist die Ziffer rechts von der Rundungsstelle",
    },
    {
      name: "Gerundeter Wert",
      html: "3,146 ≈ 3,15",
      quantities: "≈ bedeutet „ungefähr gleich“",
    },
  ],
  quiz: {
    question: "Du brauchst 7,2 m Stoff, er wird nur in ganzen Metern verkauft. Wie viele Meter kaufst du?",
    options: ["8 m", "7 m", "7,5 m"],
    correctIndex: 0,
    explanation: "Die mathematische Regel ergäbe 7 m, aber dann fehlt Stoff. Hier musst du aufrunden.",
  },
  lab: lab(
    "rounding",
    "Runden auf der Zahlengeraden",
    "Stelle die Zahl mit den Ziffern ein und wähle die Rundungsstelle. Der Pfeil zeigt zum nächsten Wert der gewählten Stelle.",
    [
      r("e", "Einer", 0, 9, 1),
      r("a", "Zehntel", 0, 9, 5),
      r("b", "Hundertstel", 0, 9, 0),
      r("c", "Tausendstel", 0, 9, 0),
      c("place", "Runden auf", ["Einer", "Zehntel", "Hundertstel"]),
    ],
    [
      o("x", "Zahl", (v) => clean(v.e + v.a / 10 + v.b / 100 + v.c / 1000), "", 3),
      o("rounded", "Gerundet", (v) =>
        roundSchool(v.e + v.a / 10 + v.b / 100 + v.c / 1000, v.place),
      "", 2),
    ],
    [
      {
        id: "hundertstel",
        text: "Runde 3,146 auf Hundertstel.",
        check: (v) => v.e === 3 && v.a === 1 && v.b === 4 && v.c === 6 && v.place === 2,
      },
      {
        id: "uebertrag",
        text: "Runde 2,96 auf Zehntel: Der Übertrag ergibt 3,0.",
        check: (v) => v.e === 2 && v.a === 9 && v.b === 6 && v.c === 0 && v.place === 1,
      },
      {
        id: "mitte",
        text: "Runde 4,5 auf Einer: Genau in der Mitte wird aufgerundet.",
        check: (v) => v.e === 4 && v.a === 5 && v.b === 0 && v.c === 0 && v.place === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "auf-stelle",
      make: (rng, level) => {
        const value = (rng.int(1, 9) * 1000 + rng.int(1, 999)) / 1000;
        const place = rng.int(0, 2);
        const names = ["Einer", "Zehntel", "Hundertstel"];
        if (level === 1)
          return task(
            level,
            `Runde ${fmt(value, 3)} auf ${names[place]}.`,
            "",
            [num("Gerundet =", roundSchool(value, place), "", place)],
            "Schaue auf die Ziffer rechts von der Rundungsstelle: ab 5 aufrunden.",
            `Maßgeblich ist die Ziffer rechts von den ${names[place]}n.`,
            `${fmt(roundSchool(value, place), place)}.`,
            { value, place },
          );
        const litres = rng.int(20, 60) + rng.int(1, 9) / 10;
        const price = (rng.int(150, 199) + rng.pick([0.9])) / 100;
        const cost = Math.round(litres * price * 10000) / 10000;
        return task(
          level,
          "",
          `An der Tankstelle kostet ein Liter ${fmt(price, 3)} €. Jemand tankt ${fmt(litres, 1)} Liter. Berechne den Betrag und runde so, dass man ihn bezahlen kann.`,
          [num("Betrag =", roundSchool(cost, 2), "€", 2)],
          "Geldbeträge rundest du auf Cent, also auf zwei Stellen nach dem Komma.",
          `${fmt(litres, 1)} · ${fmt(price, 3)} = ${fmt(cost, 4)}.`,
          `${fmt(roundSchool(cost, 2), 2)} €.`,
          { litres, price },
        );
      },
    },
    {
      id: "situation",
      make: (rng, level) => {
        const size = rng.pick([25, 30, 40, 50]);
        const children = size * rng.int(2, 5) + rng.int(1, 12);
        const needed = Math.ceil(children / size);
        if (level === 1)
          return task(
            level,
            `${children} Kinder fahren ins Schullandheim. Ein Bus hat ${size} Plätze. Wie viele Busse braucht ihr?`,
            "",
            [
              num("Busse =", needed, "", 0, {
                slips: [{ value: needed - 1, hint: "Mit so vielen Bussen bleiben Kinder zurück. Hier musst du aufrunden." }],
              }),
            ],
            "Teile und überlege: Reicht das Ergebnis, wenn du abrundest?",
            `${children} : ${size} = ${fmt(children / size, 2)}.`,
            `${needed} Busse.`,
            { children, size },
          );
        const cover = rng.pick([1.5, 2.5, 4.5]);
        const area = rng.int(11, 60);
        const buckets = Math.ceil(area / cover);
        return task(
          level,
          "",
          `Ein Eimer Farbe reicht für ${fmt(cover)} m². Eine Wand hat ${area} m². Wie viele Eimer musst du kaufen? Entscheide auch, ob du gewöhnlich gerundet oder immer aufgerundet hast.`,
          [
            num("Eimer =", buckets, "", 0),
            pick("Rundung", ["immer aufrunden, sonst reicht es nicht", "Regel: ab 5 aufrunden"], 0),
          ],
          "Nur ganze Eimer lassen sich kaufen, und die Farbe muss reichen.",
          `${area} : ${fmt(cover)} = ${fmt(area / cover, 2)}.`,
          `${buckets} Eimer.`,
          { area, cover },
        );
      },
    },
  ],
});

const darstellungen = L(9, {
  id: "rz-9-darstellungen",
  title: "1.9 Bruch, Dezimalzahl, Prozent und Bild",
  subtitle: "Dieselbe Zahl in vier Darstellungen",
  whyItMatters:
    "„25 % Rabatt“, „ein Viertel der Klasse“, „0,25 l“: Das ist dreimal derselbe Wert. Wechselst du sicher zwischen den Darstellungen, kannst du immer die bequemste nehmen.",
  explanationHtml: `<p><strong>Prozent</strong> bedeutet Hundertstel: 1 % = ${frac(1, 100)} = 0,01. Vom Bruch zum Prozent erweiterst du auf den Nenner 100 oder du dividierst und nimmst das Ergebnis mal 100. Einen Anteil kannst du auch zeichnen, als Rechtecksanteil oder als <strong>Kreissektor</strong>. Der ganze Kreis hat 360°, also gehören zu 1 % genau 3,6°.</p><div class="example">${frac(3, 5)} = ${frac(60, 100)} = 0,6 = 60 %. Im Kreis: ${frac(3, 5)} von 360° = 216°.</div><div class="merke"><strong>Merke:</strong> Einige Werte solltest du auswendig kennen: ${frac(1, 2)} = 0,5 = 50 %, ${frac(1, 4)} = 0,25 = 25 %, ${frac(3, 4)} = 0,75 = 75 %, ${frac(1, 5)} = 0,2 = 20 %, ${frac(1, 10)} = 0,1 = 10 %.</div>`,
  formulas: [
    {
      name: "Prozent",
      html: `p % = ${frac("p", 100)}`,
      quantities: "p Prozent sind p Hundertstel",
    },
    {
      name: "Kreissektor",
      html: "Winkel = Anteil · 360°",
      quantities: "Anteil als Bruch oder Dezimalzahl",
    },
  ],
  quiz: {
    question: "Welche Darstellung gehört nicht zum selben Wert wie 2/5?",
    options: ["25 %", "0,4", "40 %"],
    correctIndex: 0,
    explanation: "2/5 = 4/10 = 0,4 = 40 %. 25 % entspricht 1/4.",
  },
  lab: lab(
    "representations",
    "Vier Darstellungen",
    "Ziehe den Prozentwert. Gitter, Kreissektor, Bruch und Dezimalzahl ändern sich gemeinsam.",
    [r("p", "Prozent", 0, 100, 10, 1, "%")],
    [
      o("frac", "Gekürzter Bruch", (v) => ratio(v.p, 100)),
      o("dec", "Dezimalzahl", (v) => fmt(v.p / 100)),
      o("angle", "Winkel im Kreis", (v) => v.p * 3.6, "°", 1),
    ],
    [
      {
        id: "dreiviertel",
        text: "Stelle den Anteil 3/4 ein.",
        check: (v) => v.p === 75,
      },
      {
        id: "zwei-fuenftel",
        text: "Stelle den Bruch 2/5 ein.",
        check: (v) => v.p === 40,
      },
      {
        id: "fuenf-hundertstel",
        text: "Stelle die Dezimalzahl 0,05 ein.",
        check: (v) => v.p === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "wechsel",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [2, 4, 5, 10, 20, 25]);
        const p = (100 * z) / n;
        if (level === 1)
          return task(
            level,
            `Schreibe ${frac(z, n)} als Dezimalzahl und in Prozent.`,
            "",
            [num("Dezimalzahl =", z / n, "", 2), num("Prozent =", p, "%", 0)],
            "Erweitere auf den Nenner 100: Der Zähler ist dann der Prozentwert.",
            `${frac(z, n)} = ${frac(p, 100)}.`,
            `${fmt(z / n)} = ${fmt(p)} %.`,
            { z, n },
          );
        const f = rng.int(2, 6);
        return task(
          level,
          "",
          `Von ${n * f} befragten Kindern lesen ${z * f} gern Comics. Gib den Anteil als gekürzten Bruch, als Dezimalzahl und in Prozent an.`,
          [...fractionFields(z * f, n * f), num("Dezimalzahl =", z / n, "", 2), num("Prozent =", p, "%", 0)],
          "Anteil aufstellen, kürzen, auf den Nenner 100 erweitern.",
          `${frac(z * f, n * f)} = ${ratio(z, n)} = ${frac(p, 100)}.`,
          `${ratio(z, n)} = ${fmt(z / n)} = ${fmt(p)} %.`,
          { z, n, f },
        );
      },
    },
    {
      id: "kreissektor",
      make: (rng, level) => {
        const p = rng.pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 75]);
        const angle = p * 3.6;
        return level === 1
          ? task(
              level,
              `Ein Kreisdiagramm zeigt ${p} %. Wie groß ist der Winkel des Kreissektors?`,
              "",
              [
                num("Winkel =", angle, "°", 0, {
                  slips: [{ value: p, hint: "Prozent sind noch keine Grad. 100 % entsprechen 360°." }],
                }),
              ],
              "100 % sind 360°, also 1 % sind 3,6°.",
              `${p} · 3,6° = ${fmt(angle)}°.`,
              `${fmt(angle)}°.`,
              { p },
            )
          : task(
              level,
              "",
              `In einem Kreisdiagramm zur Lieblingssportart hat der Sektor für Fußball einen Winkel von ${fmt(angle)}°. Welchem Anteil entspricht das? Gib die Prozent und den gekürzten Bruch an.`,
              [num("Prozent =", p, "%", 0), ...fractionFields(p, 100)],
              "Winkel durch 360° ergibt den Anteil.",
              `${fmt(angle)} : 360 = ${fmt(p / 100)}.`,
              `${p} % = ${ratio(p, 100)}.`,
              { p },
            );
      },
    },
  ],
});

const RELATION = (p: number, q: number) => (p < q ? "<" : p > q ? ">" : "=");

const vergleichen = L(10, {
  id: "rz-10-vergleichen",
  title: "1.10 Rationale Zahlen vergleichen",
  subtitle: "Hauptnenner, Dezimalzahl und Lage auf der Zahlengeraden",
  whyItMatters:
    "Ist 3/4 l Saft mehr als 0,7 l? Beim Vergleichen musst du Brüche und Dezimalzahlen auf eine gemeinsame Form bringen.",
  explanationHtml: `<p>Gleichnamige Brüche vergleichst du am Zähler. Ungleichnamige Brüche erweiterst du zuerst auf einen <strong>gemeinsamen Nenner</strong> (am besten den Hauptnenner, also das kgV der Nenner). Dezimalzahlen vergleichst du Stelle für Stelle von links. Bei gemischten Darstellungen wandelst du alles in Dezimalzahlen um.</p><div class="example">${frac(3, 4)} und ${frac(2, 3)}: Hauptnenner 12, ${frac(9, 12)} &gt; ${frac(8, 12)}. Also ${frac(3, 4)} &gt; ${frac(2, 3)}.</div><p>Bei negativen Zahlen dreht sich die Beziehung für die Beträge um: −${frac(1, 2)} &lt; −${frac(1, 3)}, denn −${frac(1, 2)} liegt weiter links auf der Zahlengeraden.</p><div class="merke"><strong>Merke:</strong> Auf der Zahlengeraden liegt die kleinere Zahl immer links. Jede negative Zahl ist kleiner als jede positive.</div>`,
  formulas: [
    {
      name: "Gleichnamig machen",
      html: `${frac("a", "b")} und ${frac("c", "d")} auf den Nenner kgV(b; d) erweitern`,
      quantities: "kgV kleinstes gemeinsames Vielfaches, auch Hauptnenner",
    },
  ],
  quiz: {
    question: "Welche Aussage ist richtig?",
    options: ["−3/4 < −1/2", "−3/4 > −1/2", "−3/4 = −1/2"],
    correctIndex: 0,
    explanation: "−3/4 = −0,75 liegt weiter links auf der Zahlengeraden als −1/2 = −0,5.",
  },
  lab: lab(
    "compare",
    "Zwei Zahlen vergleichen",
    "Stelle zwei Brüche ein. Die Zahlengerade zeigt, welche Zahl links liegt; der Hauptnenner zeigt es rechnerisch.",
    [
      r("a", "Zähler der ersten Zahl", -12, 12, 1),
      r("b", "Nenner der ersten Zahl", 2, 12, 2),
      r("c", "Zähler der zweiten Zahl", -12, 12, 1),
      r("d", "Nenner der zweiten Zahl", 2, 12, 3),
    ],
    [
      o("relation", "Beziehung", (v) => RELATION(v.a * v.d, v.c * v.b)),
      o("common", "Hauptnenner", (v) => lcm(v.b, v.d), "", 0),
      o("ext", "Erweitert", (v) => {
        const h = lcm(v.b, v.d);
        return `${ratioRaw((v.a * h) / v.b, h)} und ${ratioRaw((v.c * h) / v.d, h)}`;
      }),
    ],
    [
      {
        id: "positiv",
        text: "Vergleiche 3/4 und 2/3.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 2 && v.d === 3,
      },
      {
        id: "negativ",
        text: "Vergleiche −1/2 und −1/3.",
        check: (v) => v.a === -1 && v.b === 2 && v.c === -1 && v.d === 3,
      },
      {
        id: "gleich",
        text: "Finde zwei wertgleiche Brüche mit den Nennern 4 und 6.",
        check: (v) => v.b === 4 && v.d === 6 && v.a * v.d === v.c * v.b,
      },
    ],
  ),
  exercises: [
    {
      id: "brueche",
      make: (rng, level) => {
        const first = properFraction(rng, [2, 3, 4, 5, 6, 8]);
        let a = first[0];
        const b = first[1];
        let [c0, d] = properFraction(rng, [3, 4, 5, 6, 8, 10]);
        while (a * d === c0 * b) [c0, d] = properFraction(rng, [3, 4, 5, 6, 8, 10]);
        if (level === 2) {
          a = -a;
          c0 = -c0;
        }
        const options = ["<", ">", "="];
        const rel = RELATION(a * d, c0 * b);
        const show = (x: number, y: number) => `${x < 0 ? "−" : ""}${frac(Math.abs(x), y)}`;
        const h = lcm(b, d);
        return task(
          level,
          `Setze das richtige Zeichen: ${show(a, b)} ▢ ${show(c0, d)}.`,
          `Am Morgen zeigt das Thermometer ${show(a, b)} °C, am Abend ${show(c0, d)} °C. Setze das Zeichen: Morgenwert ▢ Abendwert.`,
          [pick("Zeichen", options, options.indexOf(rel))],
          "Erweitere beide Brüche auf den Hauptnenner und vergleiche die Zähler.",
          `Hauptnenner ${h}: ${ratioRaw((a * h) / b, h)} und ${ratioRaw((c0 * h) / d, h)}.`,
          `${show(a, b)} ${rel === "<" ? "&lt;" : rel === ">" ? "&gt;" : "="} ${show(c0, d)}.`,
          { a, b, c0, d },
        );
      },
    },
    {
      id: "bruch-und-dezimal",
      make: (rng, level) => {
        const [z, n] = properFraction(rng, [4, 5, 8, 10, 20]);
        let hundredths = rng.int(5, 95);
        while (hundredths * n === 100 * z) hundredths = rng.int(5, 95);
        const decimal = hundredths / 100;
        const bigger = z / n > decimal;
        if (level === 1)
          return task(
            level,
            `Welche Zahl ist größer: ${frac(z, n)} oder ${fmt(decimal)}?`,
            "",
            [pick("Größer ist", [`${z}/${n}`, fmt(decimal)], bigger ? 0 : 1)],
            "Schreibe den Bruch als Dezimalzahl und vergleiche die Stellen.",
            `${frac(z, n)} = ${fmt(z / n, 3)}.`,
            `${bigger ? `${z}/${n}` : fmt(decimal)} ist größer.`,
            { z, n, hundredths },
          );
        return task(
          level,
          "",
          `Saft A enthält ${frac(z, n)} Liter, Saft B enthält ${fmt(decimal)} Liter. Wie groß ist der Unterschied in Litern? Welcher Saft enthält mehr?`,
          [
            num("Unterschied =", Math.abs(z / n - decimal), "l", 3),
            pick("Mehr enthält", ["Saft A", "Saft B"], bigger ? 0 : 1),
          ],
          "Beide Zahlen als Dezimalzahl schreiben, dann die größere minus die kleinere.",
          `${frac(z, n)} = ${fmt(z / n, 3)}, Unterschied ${fmt(Math.abs(z / n - decimal), 3)}.`,
          `${bigger ? "Saft A" : "Saft B"}, ${fmt(Math.abs(z / n - decimal), 3)} l mehr.`,
          { z, n, hundredths },
        );
      },
    },
  ],
});

function ratioRaw(n: number, d: number): string {
  return `${n < 0 ? "−" : ""}${Math.abs(n)}/${d}`;
}

const NL_STEPS = [1 / 2, 1 / 4, 1 / 5, 1 / 10];
const nearly = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const zahlengerade = L(11, {
  id: "rz-11-zahlengerade",
  title: "1.11 Rationale Zahlen auf der Zahlengeraden",
  subtitle: "Ablesen, eintragen und passend skalieren",
  whyItMatters:
    "Die Zahlengerade zeigt dir sofort, wie groß eine Zahl ist und wie weit sie von anderen entfernt liegt. Dazu brauchst du eine passende Einteilung.",
  explanationHtml: `<p>Zwischen zwei ganzen Zahlen liegen unendlich viele rationale Zahlen. Wähle die <strong>Skalierung</strong> nach den Nennern der Zahlen: Für Viertel teilst du jede Einheit in 4 Teile, für Zehntel in 10.</p><div class="example">Für −${frac(3, 4)}, ${frac(1, 2)} und 1,25 passt eine Einteilung in Viertel, denn ${frac(1, 2)} = ${frac(2, 4)} und 1,25 = ${frac(5, 4)}. −${frac(3, 4)} liegt 3 Striche links von 0, ${frac(1, 2)} liegt 2 Striche und 1,25 liegt 5 Striche rechts von 0.</div><p>Beim Ablesen zählst du zuerst, wie viele Striche eine Einheit hat. Daraus ergibt sich der Wert eines Strichs.</p><div class="merke"><strong>Merke:</strong> Wert eines Strichs = 1 : Anzahl der Teile je Einheit. Die Lage einer Zahl = Anzahl der Striche · Wert eines Strichs, links von 0 negativ.</div>`,
  formulas: [
    {
      name: "Skalierung",
      html: "Wert eines Strichs = 1 : Teile je Einheit",
      quantities: "die Teile je Einheit ergeben sich aus den Nennern",
    },
  ],
  quiz: {
    question: "Eine Einheit ist in 5 Teile geteilt. P liegt 3 Striche links von 0. Welche Zahl ist P?",
    options: ["−3/5", "3/5", "−5/3"],
    correctIndex: 0,
    explanation: "Ein Strich ist 1/5 wert; drei Striche links von 0 ergeben −3/5.",
  },
  lab: lab(
    "number-line",
    "Punkt auf der Zahlengeraden",
    "Wähle die Einteilung und ziehe den Punkt P. Nicht jede Zahl lässt sich in jeder Einteilung treffen.",
    [
      c("s", "Eine Einheit hat", ["2 Teile", "4 Teile", "5 Teile", "10 Teile"]),
      r("t", "Striche von 0", -20, 20, 1),
    ],
    [
      o("value", "P als Dezimalzahl", (v) => fmt(v.t * NL_STEPS[v.s], 2)),
      o("frac", "P als Bruch", (v) => {
        const denominator = [2, 4, 5, 10][v.s];
        return ratio(v.t, denominator);
      }),
    ],
    [
      {
        id: "minus-dreiviertel",
        text: "Setze P auf −3/4.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], -0.75),
      },
      {
        id: "eins-zwei",
        text: "Setze P auf 1,2.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], 1.2),
      },
      {
        id: "minus-drei-zehntel",
        text: "Setze P auf −0,3. Dazu brauchst du die feinste Einteilung.",
        check: (v) => nearly(v.t * NL_STEPS[v.s], -0.3),
      },
    ],
  ),
  exercises: [
    {
      id: "ablesen",
      make: (rng, level) => {
        const parts = rng.pick([2, 4, 5, 10]);
        const ticks = rng.int(1, 3 * parts) * rng.sign();
        const value = ticks / parts;
        if (level === 1)
          return task(
            level,
            `Eine Einheit der Zahlengeraden ist in ${parts} Teile geteilt. P liegt ${Math.abs(ticks)} Striche ${ticks < 0 ? "links" : "rechts"} von 0. Welche Zahl ist P?`,
            "",
            [num("P =", value, "", 2)],
            "Wert eines Strichs mal Anzahl der Striche; links von 0 ist die Zahl negativ.",
            `Ein Strich ist ${frac(1, parts)} wert.`,
            `P = ${fmt(value)}.`,
            { parts, ticks },
          );
        const a = ticks / parts;
        const distance = rng.int(1, 4);
        const b = a + distance;
        return task(
          level,
          "",
          `Auf einer Zahlengeraden sind A = ${fmt(a)} und B = ${fmt(b)} eingetragen. Welche Zahl liegt genau in der Mitte zwischen A und B?`,
          [num("Mitte =", (a + b) / 2, "", 3)],
          "Halbiere den Abstand und gehe von der kleineren Zahl aus so weit nach rechts.",
          `Abstand ${distance}, die Hälfte ${fmt(distance / 2)}.`,
          `${fmt((a + b) / 2, 3)}.`,
          { a, b },
        );
      },
    },
    {
      id: "skalierung",
      make: (rng, level) => {
        const options = ["2 Teile", "4 Teile", "5 Teile", "10 Teile"];
        const idx = rng.int(1, 3);
        const d = [2, 4, 5, 10][idx];
        let z = rng.int(1, d - 1);
        while (gcd(z, d) !== 1) z = rng.int(1, d - 1);
        const other = idx === 1 ? "0,5" : idx === 2 ? "0,4" : "0,7";
        if (level === 1)
          return task(
            level,
            `Du möchtest −${frac(z, d)} und ${other} eintragen. Welche Einteilung einer Einheit ist am besten geeignet?`,
            "",
            [pick("Einteilung", options, idx)],
            "Schreibe beide Zahlen als Bruch mit gleichem Nenner.",
            `${other} und −${frac(z, d)} lassen sich mit dem Nenner ${d} schreiben.`,
            `${options[idx]}.`,
            { d, z },
          );
        const length = rng.pick([2, 3, 4]);
        const unit = rng.pick([2, 4, 5]);
        return task(
          level,
          "",
          `Deine Zahlengerade soll von 0 bis ${length} reichen und jede Einheit in ${d} Teile teilen. Eine Einheit soll ${unit} cm lang sein. Wie lang ist ein Strichabstand in cm, und wie viele Strichabstände liegen zwischen 0 und ${length}?`,
          [num("Abstand =", unit / d, "cm", 2), num("Strichabstände =", length * d, "", 0)],
          "Einheitslänge durch Teile je Einheit; Einheiten mal Teile.",
          `${unit} : ${d} = ${fmt(unit / d)} und ${length} · ${d} = ${length * d}.`,
          `${fmt(unit / d)} cm, ${length * d} Abstände.`,
          { d, length, unit },
        );
      },
    },
  ],
});

const addieren = L(12, {
  id: "rz-12-brueche-addieren",
  title: "1.12 Brüche addieren und subtrahieren",
  subtitle: "Erst gleichnamig machen",
  whyItMatters:
    "Ein halber Kuchen und ein Drittel Kuchen ergeben nicht zwei Fünftel. Du brauchst erst Stücke gleicher Größe, sonst kannst du sie nicht zusammenzählen.",
  explanationHtml: `<p><strong>Gleichnamige</strong> Brüche addierst du, indem du die Zähler addierst und den Nenner beibehältst: ${frac(1, 5)} + ${frac(2, 5)} = ${frac(3, 5)}. <strong>Ungleichnamige</strong> Brüche machst du zuerst gleichnamig. Gemischte Brüche schreibst du am besten als unechte Brüche.</p><div class="example">${frac(1, 2)} + ${frac(1, 3)}: Hauptnenner 6, also ${frac(3, 6)} + ${frac(2, 6)} = ${frac(5, 6)}. Und 2 ${frac(1, 4)} − ${frac(3, 4)} = ${frac(9, 4)} − ${frac(3, 4)} = ${frac(6, 4)} = 1 ${frac(1, 2)}.</div><div class="merke"><strong>Merke:</strong> Hauptnenner suchen, erweitern, Zähler addieren oder subtrahieren, Nenner behalten, kürzen. Addiere nie die Nenner.</div>`,
  formulas: [
    {
      name: "Gleichnamige Brüche",
      html: `${frac("a", "n")} + ${frac("b", "n")} = ${frac("a + b", "n")}`,
      quantities: "der Nenner bleibt gleich; bei − werden die Zähler subtrahiert",
    },
    {
      name: "Ungleichnamige Brüche",
      html: `${frac("a", "b")} + ${frac("c", "d")} = ${frac("a · d + c · b", "b · d")}`,
      quantities: "am einfachsten mit dem Hauptnenner kgV(b; d)",
    },
  ],
  quiz: {
    question: "Was ergibt 1/4 + 1/2?",
    options: ["3/4", "2/6", "2/4"],
    correctIndex: 0,
    explanation: "1/2 = 2/4, also 1/4 + 2/4 = 3/4. Die Nenner addiert man nicht.",
  },
  lab: lab(
    "add-fractions",
    "Addieren mit Hauptnenner",
    "Stelle zwei Brüche und die Rechenart ein. Beide werden auf dieselbe Einteilung gebracht.",
    [
      r("a", "Zähler 1", 1, 5, 1),
      r("b", "Nenner 1", 2, 6, 2),
      r("c", "Zähler 2", 1, 5, 1),
      r("d", "Nenner 2", 2, 6, 2),
      c("op", "Rechenart", ["addieren", "subtrahieren"]),
    ],
    [
      o("common", "Hauptnenner", (v) => lcm(v.b, v.d), "", 0),
      o("result", "Ergebnis", (v) => {
        const [z, m] = v.op === 0 ? addFractions(v.a, v.b, v.c, v.d) : subFractions(v.a, v.b, v.c, v.d);
        return ratio(z, m);
      }),
    ],
    [
      {
        id: "summe",
        text: "Berechne 1/2 + 1/3.",
        check: (v) => v.a === 1 && v.b === 2 && v.c === 1 && v.d === 3 && v.op === 0,
      },
      {
        id: "differenz",
        text: "Berechne 3/4 − 1/2.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 1 && v.d === 2 && v.op === 1,
      },
      {
        id: "zwoelftel",
        text: "Berechne 1/4 + 1/6 mit dem Hauptnenner 12.",
        check: (v) => v.a === 1 && v.b === 4 && v.c === 1 && v.d === 6 && v.op === 0,
      },
    ],
  ),
  exercises: [
    {
      id: "summe",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [2, 3, 4, 5, 6, 8]);
        const [c0, d] = properFraction(rng, [3, 4, 5, 6, 8, 10]);
        const [z, m] = addFractions(a, b, c0, d);
        const h = lcm(b, d);
        if (level === 1)
          return task(
            level,
            `Berechne ${frac(a, b)} + ${frac(c0, d)} und kürze vollständig.`,
            "",
            fractionFields(a * d + c0 * b, b * d),
            `Bringe beide Brüche auf den Hauptnenner.`,
            `Hauptnenner ${h}: ${frac((a * h) / b, h)} + ${frac((c0 * h) / d, h)} = ${frac((a * h) / b + (c0 * h) / d, h)}.`,
            `${ratio(z, m)}.`,
            { a, b, c0, d },
          );
        const [ga, gb] = [rng.int(1, 3), rng.int(1, 3)];
        const [zz, mm] = addFractions(ga * b + a, b, gb * d + c0, d);
        return task(
          level,
          "",
          `Für ein Rezept brauchst du ${ga} ${frac(a, b)} Tassen Mehl und ${gb} ${frac(c0, d)} Tassen Zucker. Wie viele Tassen sind das zusammen? Gib einen gekürzten unechten Bruch an.`,
          fractionFields(zz, mm),
          "Schreibe beide gemischten Brüche als unechte Brüche.",
          `${frac(ga * b + a, b)} + ${frac(gb * d + c0, d)} mit dem Hauptnenner ${h}.`,
          `${ratio(zz, mm)} = ${mixedText(zz, mm)} Tassen.`,
          { a, b, c0, d, ga, gb },
        );
      },
    },
    {
      id: "differenz",
      make: (rng, level) => {
        let [a, b] = properFraction(rng, [2, 3, 4, 5, 6]);
        let [c0, d] = properFraction(rng, [3, 4, 6, 8, 10]);
        if (a * d === c0 * b) c0 = c0 === d - 1 ? 1 : d - 1;
        if (a * d === c0 * b) [a, b, c0, d] = [3, 4, 1, 3];
        if (a * d < c0 * b) [a, b, c0, d] = [c0, d, a, b];
        const [z, m] = subFractions(a, b, c0, d);
        const h = lcm(b, d);
        if (level === 1)
          return task(
            level,
            `Berechne ${frac(a, b)} − ${frac(c0, d)} und kürze vollständig.`,
            "",
            fractionFields(a * d - c0 * b, b * d),
            "Hauptnenner suchen, erweitern, Zähler subtrahieren.",
            `Hauptnenner ${h}: ${frac((a * h) / b, h)} − ${frac((c0 * h) / d, h)}.`,
            `${ratio(z, m)}.`,
            { a, b, c0, d },
          );
        const x = rng.pick([3, 5, 6, 8]);
        const [restZ, restM] = subFractions(3, 4, 1, x);
        return task(
          level,
          "",
          `Im Schulgarten ist ${frac(1, 4)} der Fläche mit Tomaten und ${frac(1, x)} mit Salat bepflanzt. Welcher Anteil bleibt frei? Gib den gekürzten Bruch an.`,
          fractionFields(restZ, restM),
          "Das Ganze ist 1. Ziehe beide Anteile davon ab.",
          `1 − ${frac(1, 4)} − ${frac(1, x)} = ${ratio(restZ, restM)}.`,
          `${ratio(restZ, restM)}.`,
          { restZ, restM },
        );
      },
    },
  ],
});

const multiplizieren = L(13, {
  id: "rz-13-brueche-multiplizieren",
  title: "1.13 Brüche multiplizieren",
  subtitle: "Zähler mal Zähler, Nenner mal Nenner",
  whyItMatters:
    "„Drei Viertel von zwei Dritteln“ ist eine Multiplikation. Das Flächenmodell zeigt, warum das Produkt zweier echter Brüche kleiner wird.",
  explanationHtml: `<p>Zwei Brüche multiplizierst du, indem du Zähler mit Zähler und Nenner mit Nenner malnimmst. Vor dem Ausrechnen lohnt es sich, zu kürzen. Eine ganze Zahl schreibst du als Bruch mit dem Nenner 1.</p><div class="example">${frac(2, 3)} · ${frac(3, 4)} = ${frac("2 · 3", "3 · 4")} = ${frac(6, 12)} = ${frac(1, 2)}. Und 3 · ${frac(2, 5)} = ${frac("3 · 2", 5)} = ${frac(6, 5)}.</div><p>Im Flächenmodell nimmst du ${frac(2, 3)} der Spalten und ${frac(3, 4)} der Zeilen. Der doppelt gefärbte Bereich ist das Produkt.</p><div class="merke"><strong>Merke:</strong> Das Wort „von“ zwischen zwei Brüchen bedeutet „mal“. Ein Produkt mit einem echten Bruch ist kleiner als der andere Faktor, wenn dieser positiv ist.</div>`,
  formulas: [
    {
      name: "Brüche multiplizieren",
      html: `${frac("a", "b")} · ${frac("c", "d")} = ${frac("a · c", "b · d")}`,
      quantities: "kürze möglichst vor dem Ausrechnen",
    },
  ],
  quiz: {
    question: "Welches Ergebnis hat 2/5 · 3/4 nach dem Kürzen?",
    options: ["3/10", "5/9", "8/15"],
    correctIndex: 0,
    explanation: "2 · 3 = 6 und 5 · 4 = 20, also 6/20 = 3/10. 5/9 wäre fälschlich addiert, 8/15 über Kreuz gerechnet.",
  },
  lab: lab(
    "mult-fractions",
    "Flächenmodell",
    "Färbe Spalten und Zeilen. Das Produkt ist der Bereich, der in beiden Richtungen gefärbt ist.",
    [
      r("a", "Zähler 1", 1, 6, 1),
      r("b", "Nenner 1", 2, 6, 2),
      r("c", "Zähler 2", 1, 6, 1),
      r("d", "Nenner 2", 2, 6, 5),
    ],
    [
      o("result", "Produkt gekürzt", (v) => {
        const [z, m] = mulFractions(v.a, v.b, v.c, v.d);
        return ratio(z, m);
      }),
      o("value", "Als Dezimalzahl", (v) => (v.a * v.c) / (v.b * v.d), "", 3),
    ],
    [
      {
        id: "halb",
        text: "Berechne 2/3 · 3/4.",
        check: (v) => v.a === 2 && v.b === 3 && v.c === 3 && v.d === 4,
      },
      {
        id: "sechstel",
        text: "Berechne 1/2 · 1/3.",
        check: (v) => v.a === 1 && v.b === 2 && v.c === 1 && v.d === 3,
      },
      {
        id: "unecht",
        text: "Berechne 5/4 · 2/5: Ein Faktor ist größer als 1.",
        check: (v) => v.a === 5 && v.b === 4 && v.c === 2 && v.d === 5,
      },
    ],
  ),
  exercises: [
    {
      id: "bruch-mal-bruch",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [2, 3, 4, 5, 6, 8]);
        const [c0, d] = properFraction(rng, [3, 4, 5, 6, 7, 9]);
        const [z, m] = mulFractions(a, b, c0, d);
        return task(
          level,
          `Berechne ${frac(a, b)} · ${frac(c0, d)} und kürze vollständig.`,
          `${frac(c0, d)} eines Beets sind bepflanzt, davon sind ${frac(a, b)} Karotten. Welcher Anteil des ganzen Beets besteht aus Karotten?`,
          fractionFields(a * c0, b * d),
          "Zähler mal Zähler, Nenner mal Nenner, dann kürzen.",
          `${frac(`${a} · ${c0}`, `${b} · ${d}`)} = ${frac(a * c0, b * d)}.`,
          `${ratio(z, m)}.`,
          { a, b, c0, d },
        );
      },
    },
    {
      id: "mit-ganzen",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [2, 3, 4, 5, 8]);
        const k = rng.int(2, 9);
        const [z, m] = mulFractions(k, 1, a, b);
        if (level === 1)
          return task(
            level,
            `Berechne ${k} · ${frac(a, b)}. Gib das Ergebnis als Dezimalzahl oder Bruch an.`,
            "",
            [num("Ergebnis =", (k * a) / b, "", 3)],
            "Nur den Zähler mit der ganzen Zahl malnehmen.",
            `${k} · ${a} = ${k * a}, also ${frac(k * a, b)}.`,
            `${ratio(z, m)} = ${fmt((k * a) / b, 3)}.`,
            { k, a, b },
          );
        const g = rng.int(1, 3);
        const top = g * b + a;
        const [e, f] = properFraction(rng, [3, 4, 5]);
        const [zz, mm] = mulFractions(top, b, e, f);
        return task(
          level,
          "",
          `Eine Strecke ist ${g} ${frac(a, b)} km lang. Nach ${frac(e, f)} der Strecke machst du Pause. Wie viele Kilometer hast du dann zurückgelegt? Gib einen gekürzten Bruch an.`,
          fractionFields(top * e, b * f),
          "Schreibe den gemischten Bruch als unechten Bruch, „von“ heißt „mal“.",
          `${g} ${frac(a, b)} = ${frac(top, b)}. ${frac(top, b)} · ${frac(e, f)}.`,
          `${ratio(zz, mm)} km.`,
          { top, b, e, f },
        );
      },
    },
  ],
});

const dividieren = L(14, {
  id: "rz-14-brueche-dividieren",
  title: "1.14 Durch einen Bruch dividieren",
  subtitle: "Mit dem Kehrwert malnehmen",
  whyItMatters:
    "Wie viele Viertelliter-Gläser füllt eine Zwei-Liter-Flasche? Teilen durch einen Bruch fragt: Wie oft passt der Bruch hinein?",
  explanationHtml: `<p>Den <strong>Kehrwert</strong> eines Bruchs erhältst du, indem du Zähler und Nenner vertauschst: Der Kehrwert von ${frac(2, 3)} ist ${frac(3, 2)}. Durch einen Bruch dividierst du, indem du mit seinem Kehrwert multiplizierst.</p><div class="example">2 : ${frac(1, 4)}: Vier Viertel passen in ein Ganzes, in zwei Ganze also 8. Mit dem Kehrwert: 2 · ${frac(4, 1)} = 8. Und ${frac(3, 4)} : ${frac(2, 5)} = ${frac(3, 4)} · ${frac(5, 2)} = ${frac(15, 8)}.</div><p>Teilst du durch einen echten Bruch, wird das Ergebnis größer als die Ausgangszahl.</p><div class="merke"><strong>Merke:</strong> Durch einen Bruch teilen heißt: mit dem Kehrwert malnehmen. Nur der zweite Bruch wird umgedreht.</div>`,
  formulas: [
    {
      name: "Brüche dividieren",
      html: `${frac("a", "b")} : ${frac("c", "d")} = ${frac("a", "b")} · ${frac("d", "c")}`,
      quantities: "b, c, d ≠ 0; d/c ist der Kehrwert von c/d",
    },
  ],
  quiz: {
    question: "Womit multiplizierst du, wenn du durch 3/5 teilst?",
    options: ["5/3", "3/5", "−3/5"],
    correctIndex: 0,
    explanation: "Der Kehrwert von 3/5 ist 5/3. Mit −3/5, der Gegenzahl, hat das Teilen nichts zu tun.",
  },
  lab: lab(
    "div-fractions",
    "Wie oft passt es hinein?",
    "Stelle zwei Brüche ein. Der untere Balken zeigt, wie oft der zweite Bruch in den ersten passt.",
    [
      r("a", "Zähler 1", 1, 8, 1),
      r("b", "Nenner 1", 2, 8, 2),
      r("c", "Zähler 2", 1, 6, 1),
      r("d", "Nenner 2", 2, 12, 2),
    ],
    [
      o("result", "Ergebnis", (v) => {
        const [z, m] = divFractions(v.a, v.b, v.c, v.d);
        return ratio(z, m);
      }),
      o("value", "Als Dezimalzahl", (v) => (v.a * v.d) / (v.b * v.c), "", 3),
    ],
    [
      {
        id: "sechs",
        text: "Berechne 3/4 : 1/8.",
        check: (v) => v.a === 3 && v.b === 4 && v.c === 1 && v.d === 8,
      },
      {
        id: "zwei",
        text: "Berechne 1/2 : 1/4.",
        check: (v) => v.a === 1 && v.b === 2 && v.c === 1 && v.d === 4,
      },
      {
        id: "vier",
        text: "Berechne 2/3 : 1/6.",
        check: (v) => v.a === 2 && v.b === 3 && v.c === 1 && v.d === 6,
      },
    ],
  ),
  exercises: [
    {
      id: "kehrwert",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [2, 3, 4, 5, 6, 8]);
        const [c0, d] = properFraction(rng, [3, 4, 5, 6, 7]);
        const [z, m] = divFractions(a, b, c0, d);
        if (level === 1)
          return task(
            level,
            `Berechne ${frac(a, b)} : ${frac(c0, d)} und kürze vollständig.`,
            "",
            fractionFields(a * d, b * c0),
            "Mit dem Kehrwert des zweiten Bruchs malnehmen.",
            `${frac(a, b)} · ${frac(d, c0)} = ${frac(a * d, b * c0)}.`,
            `${ratio(z, m)}.`,
            { a, b, c0, d },
          );
        const unit = rng.pick([4, 5, 8, 10]);
        const g = rng.int(1, 4);
        const parts = rng.int(1, unit - 1);
        const litres = g + parts / unit;
        return task(
          level,
          "",
          `Eine Flasche enthält ${fmt(litres, 3)} l Saft. Du füllst Gläser mit je ${frac(1, unit)} l. Wie viele Gläser werden voll?`,
          [num("Gläser =", g * unit + parts, "", 0)],
          "Wie oft passt der Bruch in die Menge? Teile durch den Bruch.",
          `${fmt(litres, 3)} : ${frac(1, unit)} = ${fmt(litres, 3)} · ${unit}.`,
          `${g * unit + parts} Gläser.`,
          { litres, unit },
        );
      },
    },
    {
      id: "mit-ganzen",
      make: (rng, level) => {
        const [a, b] = properFraction(rng, [2, 3, 4, 5, 6]);
        const k = rng.int(2, 9);
        if (level === 1) {
          const [z, m] = reduce(a, b * k);
          return task(
            level,
            `Berechne ${frac(a, b)} : ${k} und kürze vollständig.`,
            "",
            fractionFields(a, b * k),
            `Der Kehrwert von ${k} ist ${frac(1, k)}.`,
            `${frac(a, b)} · ${frac(1, k)} = ${frac(a, b * k)}.`,
            `${ratio(z, m)}.`,
            { a, b, k },
          );
        }
        const pieces = (k * b) / a;
        return task(
          level,
          "",
          `Ein Band ist ${k} m lang. Du schneidest Stücke von je ${frac(a, b)} m ab. Wie viele ganze Stücke entstehen?`,
          [num("Stücke =", Math.floor(pieces + 1e-9), "", 0)],
          "Teile durch den Bruch. Nur ganze Stücke zählen, also abrunden.",
          `${k} · ${frac(b, a)} = ${fmt(pieces, 2)}.`,
          `${Math.floor(pieces + 1e-9)} ganze Stücke.`,
          { k, a, b },
        );
      },
    },
  ],
});

const dezimalAdd = L(15, {
  id: "rz-15-dezimal-addieren",
  title: "1.15 Dezimalzahlen addieren und subtrahieren",
  subtitle: "Komma unter Komma",
  whyItMatters:
    "Beim Einkauf, beim Weitsprung und bei der Zeitmessung: Du darfst nur gleiche Stellenwerte zusammenzählen.",
  explanationHtml: `<p>Beim schriftlichen Rechnen schreibst du die Zahlen so untereinander, dass <strong>Komma unter Komma</strong> steht. So stehen auch gleiche Stellenwerte untereinander. Fehlende Stellen füllst du mit Nullen.</p><div class="example">12,4 + 3,75: Schreibe 12,40 und 3,75 untereinander. 40 + 75 Hundertstel ergeben 115 Hundertstel. Das Ergebnis ist 16,15.</div><p>Im Kopf rechnest du oft günstiger, wenn du zuerst Ganze und dann den Rest nimmst: 5 − 1,25 = 4 − 0,25 = 3,75.</p><div class="merke"><strong>Merke:</strong> Komma unter Komma, leere Stellen mit Nullen füllen, dann wie gewohnt rechnen. Das Komma im Ergebnis steht an derselben Stelle.</div>`,
  formulas: [
    {
      name: "Stellengerecht rechnen",
      html: "12,40 + 3,75 = 16,15",
      quantities: "Komma unter Komma; fehlende Stellen sind Nullen",
    },
  ],
  quiz: {
    question: "Was ergibt 2,5 + 0,75?",
    options: ["3,25", "2,80", "9,5"],
    correctIndex: 0,
    explanation: "2,50 + 0,75 = 3,25. Das Ergebnis 2,80 entsteht, wenn man 5 Zehntel und 75 Hundertstel falsch untereinander setzt.",
  },
  lab: lab(
    "decimal-add",
    "Komma unter Komma",
    "Stelle zwei Zahlen und die Rechenart ein. Die Tafel zeigt die Rechnung, die Zahlengerade den Sprung.",
    [
      r("a", "Erste Zahl", 0, 10, 1, 0.05),
      r("b", "Zweite Zahl", 0, 6, 1, 0.05),
      c("op", "Rechenart", ["addieren", "subtrahieren"]),
    ],
    [
      o("result", "Ergebnis", (v) => clean(v.op === 0 ? v.a + v.b : v.a - v.b)),
    ],
    [
      {
        id: "summe",
        text: "Berechne 2,75 + 1,5.",
        check: (v) => nearly(v.a, 2.75) && nearly(v.b, 1.5) && v.op === 0,
      },
      {
        id: "differenz",
        text: "Berechne 5 − 1,25.",
        check: (v) => nearly(v.a, 5) && nearly(v.b, 1.25) && v.op === 1,
      },
      {
        id: "zehn",
        text: "Finde zwei Zahlen mit der Summe 10, ohne dass eine davon ganz ist.",
        check: (v) => v.op === 0 && nearly(v.a + v.b, 10) && !nearly(v.a, Math.round(v.a)),
      },
    ],
  ),
  exercises: [
    {
      id: "addieren",
      make: (rng, level) => {
        const a = rng.int(10, 400) / 10;
        const b = rng.int(100, 900) / 100;
        const sum = clean(a + b);
        if (level === 1)
          return task(
            level,
            `Berechne ${fmt(a)} + ${fmt(b)}.`,
            "",
            [num("Summe =", sum, "", 2)],
            "Komma unter Komma, leere Stellen mit 0 füllen.",
            `${a.toFixed(2).replace(".", ",")} + ${b.toFixed(2).replace(".", ",")}.`,
            `${fmt(sum)}.`,
            { a, b },
          );
        const c0 = rng.int(50, 500) / 100;
        const total = clean(a + b + c0);
        const paid = Math.ceil(total / 10) * 10;
        return task(
          level,
          "",
          `Dein Einkauf: ${fmt(a)} €, ${fmt(b)} € und ${fmt(c0)} €. Wie viel musst du bezahlen, und wie viel bekommst du zurück, wenn du mit ${paid} € zahlst?`,
          [num("Summe =", total, "€", 2), num("Rückgeld =", clean(paid - total), "€", 2)],
          "Erst alle Beträge addieren, dann die Summe vom bezahlten Betrag abziehen.",
          `${fmt(a)} + ${fmt(b)} + ${fmt(c0)} = ${fmt(total)}.`,
          `${fmt(total)} € und ${fmt(clean(paid - total))} € zurück.`,
          { a, b, c0 },
        );
      },
    },
    {
      id: "subtrahieren",
      make: (rng, level) => {
        const big = rng.int(300, 2000) / 100;
        const small = rng.int(10, 290) / 100;
        const diff = clean(big - small);
        if (level === 1)
          return task(
            level,
            `Berechne ${fmt(big)} − ${fmt(small)}.`,
            "",
            [num("Differenz =", diff, "", 2)],
            "Komma unter Komma, dann von rechts nach links subtrahieren.",
            `${big.toFixed(2).replace(".", ",")} − ${small.toFixed(2).replace(".", ",")}.`,
            `${fmt(diff)}.`,
            { big, small },
          );
        const first = rng.int(300, 520) / 100;
        const second = clean(first + rng.pick([-1, 1]) * rng.int(2, 60) / 100);
        const best = Math.max(first, second);
        const gap = rng.int(11, 60) / 100;
        return task(
          level,
          "",
          `Beim Weitsprung schafft Ada ${fmt(first)} m und Ben ${fmt(second)} m. Der Rekord der Schule liegt bei ${fmt(clean(best + gap))} m. Wie groß ist der Unterschied zwischen den beiden, und wie viel fehlt dem Besseren zum Rekord?`,
          [
            num("Unterschied =", clean(Math.abs(first - second)), "m", 2),
            num("Zum Rekord =", gap, "m", 2),
          ],
          "Immer die kleinere von der größeren Länge abziehen.",
          `${fmt(best)} m ist die bessere Weite.`,
          `Unterschied ${fmt(clean(Math.abs(first - second)))} m; zum Rekord ${fmt(gap)} m.`,
          { first, second },
        );
      },
    },
  ],
});

const dezimalMult = L(16, {
  id: "rz-16-dezimal-multiplizieren",
  title: "1.16 Dezimalzahlen multiplizieren und dividieren",
  subtitle: "Das Komma richtig setzen",
  whyItMatters:
    "1,5 kg Äpfel zu 2,40 € pro kg: Beim Malnehmen bestimmen die Stellen nach dem Komma, wo das Komma im Ergebnis steht. Beim Teilen verschiebst du es vorher.",
  explanationHtml: `<p><strong>Multiplizieren:</strong> Rechne zuerst ohne Komma. Das Ergebnis bekommt so viele Stellen nach dem Komma, wie beide Faktoren zusammen haben.</p><div class="example">2,4 · 0,3: 24 · 3 = 72. Beide Faktoren haben zusammen 2 Stellen nach dem Komma, also 0,72.</div><p><strong>Dividieren:</strong> Verschiebe das Komma bei beiden Zahlen um gleich viele Stellen nach rechts, bis der Divisor eine ganze Zahl ist. Dann teilst du wie gewohnt.</p><div class="example">7,2 : 0,9 = 72 : 9 = 8. Und 1,5 : 0,25 = 150 : 25 = 6.</div><p>Mit 10, 100, 1000 verschiebst du das Komma nur: 3,45 · 100 = 345 und 3,45 : 10 = 0,345.</p><div class="merke"><strong>Merke:</strong> Beim Malnehmen zählst du die Stellen nach dem Komma. Beim Teilen machst du den Divisor ganz.</div>`,
  formulas: [
    {
      name: "Multiplizieren",
      html: "Stellen im Produkt = Stellen des 1. Faktors + Stellen des 2. Faktors",
      quantities: "gemeint sind die Stellen nach dem Komma",
    },
    {
      name: "Dividieren",
      html: "7,2 : 0,9 = 72 : 9",
      quantities: "beide Kommas um gleich viele Stellen verschieben",
    },
  ],
  quiz: {
    question: "Was ergibt 0,4 · 0,6?",
    options: ["0,24", "2,4", "0,024"],
    correctIndex: 0,
    explanation: "4 · 6 = 24; zusammen zwei Stellen nach dem Komma, also 0,24. Das Produkt ist kleiner als beide Faktoren.",
  },
  lab: lab(
    "decimal-mult",
    "Zehntel mal Zehntel",
    "Stelle zwei Faktoren ein. Im Flächenmodell werden aus Zehnteln mal Zehnteln Hundertstel.",
    [r("a", "Erster Faktor", 0.1, 2, 0.5, 0.1), r("b", "Zweiter Faktor", 0.1, 2, 0.5, 0.1)],
    [
      o("product", "Produkt", (v) => clean(v.a * v.b)),
      o("hundredths", "In Hundertsteln", (v) => Math.round(v.a * 10) * Math.round(v.b * 10), "", 0),
    ],
    [
      {
        id: "klein",
        text: "Berechne 0,3 · 0,4.",
        check: (v) => nearly(v.a, 0.3) && nearly(v.b, 0.4),
      },
      {
        id: "gemischt",
        text: "Berechne 1,5 · 0,2.",
        check: (v) => nearly(v.a, 1.5) && nearly(v.b, 0.2),
      },
      {
        id: "quadrat",
        text: "Berechne 1,2 · 1,2.",
        check: (v) => nearly(v.a, 1.2) && nearly(v.b, 1.2),
      },
    ],
  ),
  exercises: [
    {
      id: "mal",
      make: (rng, level) => {
        const a = rng.int(2, 99) / 10;
        const b = rng.int(2, 9) / 10;
        const product = clean(a * b);
        if (level === 1)
          return task(
            level,
            `Berechne ${fmt(a, 1)} · ${fmt(b, 1)}.`,
            "",
            [
              num("Produkt =", product, "", 2, {
                slips: [{ value: clean(product * 10), hint: "Zähle die Stellen nach dem Komma beider Faktoren zusammen." }],
              }),
            ],
            "Ohne Komma rechnen, dann die Stellen nach dem Komma zusammenzählen.",
            `${Math.round(a * 10)} · ${Math.round(b * 10)} = ${Math.round(a * 10) * Math.round(b * 10)}; zwei Stellen nach dem Komma.`,
            `${fmt(product)}.`,
            { a, b },
          );
        const metres = rng.pick([1.5, 2.5, 3.5, 4.5]);
        const price = rng.int(120, 480) / 100;
        const cost = clean(metres * price);
        return task(
          level,
          "",
          `Stoff kostet ${fmt(price)} € pro Meter. Du kaufst ${fmt(metres)} m. Wie viel kostet das? Runde auf Cent.`,
          [num("Preis =", roundSchool(cost, 2), "€", 2)],
          "Meter mal Preis pro Meter; Geld auf zwei Stellen nach dem Komma.",
          `${fmt(metres)} · ${fmt(price)} = ${fmt(cost, 3)}.`,
          `${fmt(roundSchool(cost, 2), 2)} €.`,
          { metres, price },
        );
      },
    },
    {
      id: "durch",
      make: (rng, level) => {
        const divisor = rng.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 1.2, 1.5]);
        const q = rng.int(2, 12);
        const dividend = clean(divisor * q);
        if (level === 1)
          return task(
            level,
            `Berechne ${fmt(dividend)} : ${fmt(divisor)}.`,
            "",
            [num("Quotient =", q, "", 0)],
            "Verschiebe beide Kommas gleich weit, bis der Divisor ganz ist.",
            `${fmt(dividend * 10)} : ${fmt(divisor * 10)}.`,
            `${q}.`,
            { dividend, divisor },
          );
        const glass = rng.pick([0.2, 0.25, 0.3, 0.4]);
        const n = rng.int(4, 18);
        const total = clean(glass * n);
        return task(
          level,
          "",
          `Ein Krug fasst ${fmt(total)} l. Wie viele Gläser mit je ${fmt(glass)} l kannst du daraus füllen? Wie viele Gläser wären es mit einem doppelt so großen Krug?`,
          [num("Gläser =", n, "", 0), num("Beim doppelten Krug =", 2 * n, "", 0)],
          "Teile durch die Glasgröße; der doppelte Krug füllt doppelt so viele Gläser.",
          `${fmt(total)} : ${fmt(glass)} = ${n}.`,
          `${n} und ${2 * n} Gläser.`,
          { total, glass },
        );
      },
    },
  ],
});

const OPS = ["+", "−", "·", ":"];
const compute = (a: number, b: number, op: number) =>
  op === 0 ? a + b : op === 1 ? a - b : op === 2 ? a * b : b === 0 ? Number.NaN : a / b;

const vorzeichen = L(17, {
  id: "rz-17-vorzeichen",
  title: "1.17 Rechnen mit Vorzeichen",
  subtitle: "Die Regeln aus Klasse 5 gelten auch für Brüche",
  whyItMatters:
    "−2,5 °C und +4 °C, Schulden und Guthaben: Rationale Zahlen haben auch Vorzeichen. Die Regeln kennst du von den ganzen Zahlen.",
  explanationHtml: `<p><strong>Addieren und Subtrahieren:</strong> Stelle dir die Zahlengerade vor. Plus geht nach rechts, Minus nach links. Das Subtrahieren einer negativen Zahl ist wie das Addieren ihrer Gegenzahl: 2 − (−1,5) = 2 + 1,5 = 3,5.</p><p><strong>Multiplizieren und Dividieren:</strong> Rechne mit den Beträgen und bestimme dann das Vorzeichen: Gleiche Vorzeichen ergeben Plus, verschiedene Vorzeichen ergeben Minus.</p><div class="example">(−2,5) + 4 = 1,5. (−1,5) · (−2) = 3. (−3) : 0,5 = −6. −${frac(1, 2)} + ${frac(1, 4)} = −${frac(2, 4)} + ${frac(1, 4)} = −${frac(1, 4)}.</div><div class="merke"><strong>Merke:</strong> Bei Punktrechnung gilt: gleiche Vorzeichen ergeben +, verschiedene ergeben −. Durch 0 darfst du nicht teilen.</div>`,
  formulas: [
    {
      name: "Gegenzahl",
      html: "a − (−b) = a + b",
      quantities: "eine negative Zahl subtrahieren heißt ihre Gegenzahl addieren",
    },
    {
      name: "Vorzeichenregel",
      html: "(+)·(+) = +; (−)·(−) = +; (+)·(−) = −",
      quantities: "gilt ebenso für die Division",
    },
  ],
  quiz: {
    question: "Was ergibt (−0,5) · (−4)?",
    options: ["2", "−2", "−4,5"],
    correctIndex: 0,
    explanation: "Gleiche Vorzeichen ergeben Plus, und 0,5 · 4 = 2.",
  },
  lab: lab(
    "sign-line",
    "Rechnen auf der Zahlengeraden",
    "Wähle zwei Zahlen und die Rechenart. Der Pfeil zeigt von a zum Ergebnis.",
    [
      r("a", "a", -6, 6, 1, 0.5),
      r("b", "b", -6, 6, 1, 0.5),
      c("op", "Rechenart", OPS),
    ],
    [
      o("term", "Rechnung", (v) => {
        const res = compute(v.a, v.b, v.op);
        return `${paren(v.a)} ${OPS[v.op]} ${paren(v.b)} = ${Number.isNaN(res) ? "nicht erlaubt" : fmt(res, 2)}`;
      }),
      o("result", "Ergebnis", (v) => {
        const res = compute(v.a, v.b, v.op);
        return Number.isNaN(res) ? "durch 0 nicht definiert" : clean(res);
      }),
      o("rule", "Regel", (v) => {
        if (v.op === 3 && v.b === 0) return "Durch 0 darfst du nicht teilen.";
        if (v.op < 2) return v.op === 1 ? "Minus b heißt: Gegenzahl von b addieren." : "Plus: bei positivem b nach rechts, bei negativem b nach links.";
        return v.a * v.b >= 0 ? "Gleiche Vorzeichen ergeben Plus." : "Verschiedene Vorzeichen ergeben Minus.";
      }),
    ],
    [
      {
        id: "summe",
        text: "Berechne (−2,5) + 4.",
        check: (v) => v.a === -2.5 && v.b === 4 && v.op === 0,
      },
      {
        id: "produkt",
        text: "Berechne (−1,5) · (−2).",
        check: (v) => v.a === -1.5 && v.b === -2 && v.op === 2,
      },
      {
        id: "quotient",
        text: "Berechne (−3) : 0,5.",
        check: (v) => v.a === -3 && v.b === 0.5 && v.op === 3,
      },
    ],
  ),
  exercises: [
    {
      id: "strich",
      make: (rng, level) => {
        const a = rng.int(-40, 40) / 10;
        const b = (rng.int(1, 40) / 10) * rng.sign();
        const subtract = rng.pick([true, false]);
        const result = clean(subtract ? a - b : a + b);
        if (level === 1)
          return task(
            level,
            `Berechne ${paren(a)} ${subtract ? "−" : "+"} ${paren(b)}.`,
            "",
            [num("Ergebnis =", result, "", 1)],
            "Stelle dir die Zahlengerade vor. Minus einer negativen Zahl heißt: Gegenzahl addieren.",
            `Du startest bei ${fmt(a)} und gehst ${fmt(Math.abs(b))} nach ${(subtract ? -b : b) > 0 ? "rechts" : "links"}.`,
            `${fmt(result)}.`,
            { a, b },
          );
        const start = rng.int(-80, 40) / 10;
        const rise = rng.int(5, 90) / 10;
        const fall = rng.int(5, 60) / 10;
        const end = clean(start + rise - fall);
        return task(
          level,
          "",
          `Morgens hat es ${fmt(start)} °C. Bis zum Mittag steigt die Temperatur um ${fmt(rise)} °C, bis zum Abend fällt sie um ${fmt(fall)} °C. Wie warm ist es am Abend?`,
          [num("Temperatur =", end, "°C", 1)],
          "Steigen heißt plus, Fallen heißt minus.",
          `${paren(start)} + ${fmt(rise)} − ${fmt(fall)}.`,
          `${fmt(end)} °C.`,
          { start, rise, fall },
        );
      },
    },
    {
      id: "punkt",
      make: (rng, level) => {
        const a = (rng.int(1, 12) / 2) * rng.sign();
        const b = rng.pick([0.5, 2, 3, 4, 5]) * rng.sign();
        const divide = rng.pick([true, false]);
        const left = divide ? clean(a * b) : a;
        const result = divide ? a : clean(a * b);
        if (level === 1)
          return task(
            level,
            `Berechne ${paren(left)} ${divide ? ":" : "·"} ${paren(b)}.`,
            "",
            [num("Ergebnis =", result, "", 2)],
            "Beträge rechnen, dann Vorzeichen: gleich ergibt +, verschieden ergibt −.",
            `Die Vorzeichen sind ${left * b > 0 ? "gleich" : "verschieden"}.`,
            `${fmt(result)}.`,
            { left, b },
          );
        const monthly = rng.pick([2.5, 4, 7.5, 12.5]);
        const months = rng.int(2, 8);
        return task(
          level,
          "",
          `Dein Guthaben ändert sich jeden Monat um −${fmt(monthly)} €. Um wie viel ändert es sich in den nächsten ${months} Monaten? Und um wie viel war es vor ${months} Monaten höher als heute? Das rechnest du als (−${fmt(monthly)}) · (−${months}).`,
          [
            num("Änderung in Zukunft =", -monthly * months, "€", 2),
            num("Früher höher um =", monthly * months, "€", 2),
          ],
          "Änderung pro Monat mal Anzahl der Monate; beachte die Vorzeichen.",
          `(−${fmt(monthly)}) · ${months} und (−${fmt(monthly)}) · (−${months}).`,
          `${fmt(-monthly * months)} € und ${fmt(monthly * months)} €.`,
          { monthly, months },
        );
      },
    },
  ],
});

const rechengesetze = L(18, {
  id: "rz-18-rechengesetze",
  title: "1.18 Rechenregeln und Rechengesetze",
  subtitle: "Geschickt rechnen auch mit Brüchen und Dezimalzahlen",
  whyItMatters:
    "Mit den Rechengesetzen wird 0,25 · 7 · 4 zur Kopfrechnung. Die Rechenregeln legen fest, in welcher Reihenfolge du rechnen musst.",
  explanationHtml: `<p>Die <strong>Rechenregeln</strong> kennst du: Klammern zuerst, dann Potenzen, dann Punkt vor Strich. Die <strong>Rechengesetze</strong> erlauben dir das geschickte Umstellen: Vertauschungsgesetz (a + b = b + a; a · b = b · a), Verbindungsgesetz ((a + b) + c = a + (b + c); (a · b) · c = a · (b · c)) und Verteilungsgesetz (a · (b + c) = a · b + a · c).</p><div class="example">0,25 · 7 · 4 = (0,25 · 4) · 7 = 1 · 7 = 7. ${frac(3, 4)} · 13 + ${frac(3, 4)} · 7 = ${frac(3, 4)} · (13 + 7) = ${frac(3, 4)} · 20 = 15.</div><div class="merke"><strong>Merke:</strong> Suche Partner, die zusammen eine glatte Zahl ergeben: 0,25 und 4, 0,5 und 2, ${frac(2, 3)} und ${frac(1, 3)}. Punkt vor Strich gilt immer, auch bei Brüchen.</div>`,
  formulas: [
    {
      name: "Vertauschungsgesetz",
      html: "a + b = b + a; a · b = b · a",
      quantities: "nicht bei − und :",
    },
    {
      name: "Verbindungsgesetz",
      html: "(a + b) + c = a + (b + c); (a · b) · c = a · (b · c)",
      quantities: "die Klammern dürfen wandern",
    },
    {
      name: "Verteilungsgesetz",
      html: "a · (b + c) = a · b + a · c",
      quantities: "gilt auch für die Subtraktion in der Klammer",
    },
  ],
  quiz: {
    question: "Was ergibt 2,5 + 3 · 1,5?",
    options: ["7", "8,25", "11"],
    correctIndex: 0,
    explanation: "Punkt vor Strich: 3 · 1,5 = 4,5; 2,5 + 4,5 = 7. Das Ergebnis 8,25 entsteht, wenn man von links nach rechts rechnet.",
  },
  lab: lab(
    "laws",
    "Verteilungsgesetz als Fläche",
    "Die Fläche des ganzen Rechtecks lässt sich auf zwei Arten berechnen. Suche besonders bequeme Zahlen.",
    [
      r("a", "a", 0.5, 4, 1, 0.5),
      r("b", "b", 1, 9, 1),
      r("c", "c", 1, 9, 1),
    ],
    [
      o("left", "a · (b + c)", (v) => v.a * (v.b + v.c)),
      o("right", "a · b + a · c", (v) => v.a * v.b + v.a * v.c),
    ],
    [
      {
        id: "zehn",
        text: "Berechne 2,5 · (3 + 7): Die Klammer ergibt genau 10.",
        check: (v) => v.a === 2.5 && v.b === 3 && v.c === 7,
      },
      {
        id: "halb",
        text: "Berechne 0,5 · (6 + 2) auf beide Arten.",
        check: (v) => v.a === 0.5 && v.b === 6 && v.c === 2,
      },
      {
        id: "hundert",
        text: "Finde zu a = 4 Zahlen b und c mit dem Ergebnis 40.",
        check: (v) => v.a === 4 && v.b + v.c === 10,
      },
    ],
  ),
  exercises: [
    {
      id: "vorteilhaft",
      make: (rng, level) => {
        if (level === 1) {
          const [p, q] = rng.pick([[0.25, 4], [0.5, 2], [2.5, 4], [1.25, 8]] as const);
          const m = rng.int(3, 19);
          return task(
            level,
            `Berechne vorteilhaft: ${fmt(p)} · ${m} · ${q}.`,
            "",
            [num("Ergebnis =", p * q * m, "", 2)],
            "Vertausche die Faktoren so, dass zwei zusammen eine glatte Zahl ergeben.",
            `(${fmt(p)} · ${q}) · ${m} = ${fmt(p * q)} · ${m}.`,
            `${fmt(p * q * m)}.`,
            { p, q, m },
          );
        }
        const n = rng.pick([4, 5, 8]);
        const z = rng.pick(n === 4 ? [1, 3] : n === 5 ? [2, 3, 4] : [3, 5, 7]);
        const a = rng.int(3, 37);
        const b = 40 - a;
        return task(
          level,
          "",
          `Rechne geschickt mit dem Verteilungsgesetz: ${frac(z, n)} · ${a} + ${frac(z, n)} · ${b}.`,
          [num("Ergebnis =", (z * 40) / n, "", 2)],
          "Klammere den gemeinsamen Faktor aus.",
          `${frac(z, n)} · (${a} + ${b}) = ${frac(z, n)} · 40.`,
          `${fmt((z * 40) / n)}.`,
          { z, n, a },
        );
      },
    },
    {
      id: "reihenfolge",
      make: (rng, level) => {
        if (level === 1) {
          const a = rng.int(1, 9) / 2;
          const b = rng.int(2, 6);
          const c0 = rng.int(1, 8) / 2;
          return task(
            level,
            `Berechne ${fmt(a)} + ${b} · ${fmt(c0)}.`,
            "",
            [
              num("Ergebnis =", a + b * c0, "", 2, {
                slips: [{ value: (a + b) * c0, hint: "Punkt vor Strich: Zuerst wird multipliziert." }],
              }),
            ],
            "Punkt vor Strich.",
            `${b} · ${fmt(c0)} = ${fmt(b * c0)}.`,
            `${fmt(a + b * c0)}.`,
            { a, b, c0 },
          );
        }
        const a = rng.pick([-2, -3, -4, 2, 4]);
        const b = rng.int(1, 6);
        const c0 = rng.int(7, 12);
        const d = rng.pick([0.5, 1.5, 2.5]);
        const value = clean(a * (b - c0) + d);
        return task(
          level,
          "",
          `Berechne den Term und halte die Reihenfolge ein: ${paren(a)} · (${b} − ${c0}) + ${fmt(d)}.`,
          [num("Wert =", value, "", 2)],
          "Klammer zuerst, dann Punkt, dann Strich. Achte auf die Vorzeichen.",
          `${b} − ${c0} = ${fmt(b - c0)}; ${paren(a)} · ${paren(b - c0)} = ${fmt(a * (b - c0))}.`,
          `${fmt(value)}.`,
          { a, b, c0, d },
        );
      },
    },
  ],
});

const sachaufgaben = L(19, {
  id: "rz-19-sachaufgaben",
  title: "1.19 Rechnen mit Größen",
  subtitle: "Sachaufgaben mit Einheiten",
  whyItMatters:
    "Rezepte, Einkäufe und Strecken: In Alltagsaufgaben kommen Brüche, Dezimalzahlen und Einheiten zusammen. Du musst die Einheiten zuerst angleichen.",
  explanationHtml: `<p>Größen bestehen aus Maßzahl und Einheit. Vor dem Rechnen bringst du alle Größen auf dieselbe Einheit. Aus Klasse 5 kennst du: 1 kg = 1000 g, 1 km = 1000 m, 1 h = 60 min, 1 € = 100 ct.</p><div class="example">Ein Kuchen braucht ${frac(3, 4)} kg Mehl. Das sind 750 g. Für 3 Kuchen brauchst du 3 · 0,75 kg = 2,25 kg. Eine Packung hat 1 kg und kostet 1,20 €. Du kaufst 3 Packungen für 3 · 1,20 € = 3,60 €.</div><p>Ein bewährter Weg: Was ist gegeben? Was ist gesucht? Welche Rechnung passt? Passt das Ergebnis zur Situation? Runde erst am Ende.</p><div class="merke"><strong>Merke:</strong> Gleiche Einheiten zuerst. Schreibe zum Ergebnis immer die Einheit und einen Antwortsatz.</div>`,
  formulas: [
    {
      name: "Einheiten umrechnen",
      html: `1 kg = 1000 g; 1 h = 60 min; ${frac(1, 4)} h = 15 min`,
      quantities: "gleiche Einheiten vor dem Rechnen",
    },
  ],
  quiz: {
    question: "Wie viele Minuten sind 3/4 h?",
    options: ["45 min", "75 min", "34 min"],
    correctIndex: 0,
    explanation: "Eine Stunde hat 60 Minuten: 60 : 4 · 3 = 45.",
  },
  lab: lab(
    "recipe",
    "Rezept umrechnen",
    "Das Grundrezept gilt für 4 Personen. Ändere die Personenzahl und den Mehlpreis und achte auf die Einheiten.",
    [
      r("p", "Personen", 1, 12, 4),
      r("price", "Mehlpreis pro kg", 0.8, 2.4, 1.2, 0.2, "€"),
    ],
    [
      o("flour", "Mehl", (v) => (v.p * 500) / 4, "g", 0),
      o("milk", "Milch", (v) => (v.p * 0.75) / 4, "l", 3),
      o("cost", "Mehlkosten", (v) => euro(((v.p * 500) / 4 / 1000) * v.price)),
      o("change", "Rückgeld von 20 €", (v) => euro(20 - ((v.p * 500) / 4 / 1000) * v.price)),
    ],
    [
      {
        id: "sechs",
        text: "Rechne das Rezept auf 6 Personen um: 750 g Mehl.",
        check: (v) => v.p === 6,
      },
      {
        id: "liter",
        text: "Finde die Personenzahl, für die du genau 1,5 l Milch brauchst.",
        check: (v) => v.p === 8,
      },
      {
        id: "kosten",
        text: "Stelle 12 Personen und einen Mehlpreis von 2 € pro kg ein: Das Mehl kostet 3 €.",
        check: (v) => v.p === 12 && nearly(v.price, 2),
      },
    ],
  ),
  exercises: [
    {
      id: "einkauf",
      make: (rng, level) => {
        const kg = rng.pick([0.5, 1.5, 2.5, 0.75, 1.25]);
        const price = rng.int(12, 48) / 10;
        const cost = clean(kg * price);
        if (level === 1)
          return task(
            level,
            `${fmt(kg)} kg Äpfel kosten ${fmt(price)} € pro kg. Wie viel musst du bezahlen? Runde auf Cent.`,
            "",
            [num("Preis =", roundSchool(cost, 2), "€", 2)],
            "Menge mal Preis pro kg.",
            `${fmt(kg)} · ${fmt(price)} = ${fmt(cost, 3)}.`,
            `${fmt(roundSchool(cost, 2), 2)} €.`,
            { kg, price },
          );
        const grams = rng.pick([250, 400, 600, 750]);
        const second = roundSchool((grams / 1000) * price, 2);
        const total = roundSchool(cost, 2) + second;
        return task(
          level,
          "",
          `Du kaufst ${fmt(kg)} kg und später noch ${grams} g derselben Äpfel zu ${fmt(price)} € pro kg. Wie viel kostet alles? Runde jeden Einkauf auf Cent. Wie viel Geld bleibt dir von 20 €?`,
          [num("Zusammen =", clean(total), "€", 2), num("Rest =", clean(20 - total), "€", 2)],
          "Rechne die Gramm in kg um, bevor du mit dem Preis pro kg multiplizierst.",
          `${grams} g = ${fmt(grams / 1000)} kg.`,
          `${fmt(clean(total), 2)} € und ${fmt(clean(20 - total), 2)} € Rest.`,
          { kg, grams, price },
        );
      },
    },
    {
      id: "zeit-weg",
      make: (rng, level) => {
        const [z, n] = rng.pick([[1, 4], [1, 2], [3, 4], [1, 3], [2, 3], [1, 6]] as const);
        const minutes = (60 * z) / n;
        if (level === 1)
          return task(
            level,
            `Wie viele Minuten sind ${frac(z, n)} h?`,
            "",
            [num("Zeit =", minutes, "min", 0)],
            "Eine Stunde hat 60 Minuten: durch den Nenner, mal den Zähler.",
            `60 : ${n} · ${z} = ${minutes}.`,
            `${minutes} min.`,
            { z, n },
          );
        const hours = rng.int(1, 2);
        const speed = rng.pick([4, 12, 15, 18]);
        const distance = clean(speed * (hours + z / n));
        return task(
          level,
          "",
          `Auf einer Radtour fährst du ${hours} ${frac(z, n)} h lang mit ${speed} km pro Stunde. Wie weit kommst du (auf zwei Stellen gerundet), und wie viele Minuten bist du unterwegs?`,
          [num("Strecke =", distance, "km", 2), num("Zeit =", hours * 60 + minutes, "min", 0)],
          "Strecke = Kilometer pro Stunde mal Stunden.",
          `${speed} · ${frac(hours * n + z, n)} = ${fmt(distance)}.`,
          `${fmt(distance)} km in ${hours * 60 + minutes} min.`,
          { hours, z, n, speed },
        );
      },
    },
  ],
});

export const STAGE_RATIONALE_ZAHLEN = makeStage(
  1,
  "Rationale Zahlen",
  "Brüche, Dezimalzahlen und Prozent verstehen und mit ihnen rechnen",
  "#2563eb",
  "🍕",
  [
    warum,
    grundvorstellungen,
    bruchformen,
    bruchteile,
    erweitern,
    stellenwerte,
    bruchDezimal,
    runden,
    darstellungen,
    vergleichen,
    zahlengerade,
    addieren,
    multiplizieren,
    dividieren,
    dezimalAdd,
    dezimalMult,
    vorzeichen,
    rechengesetze,
    sachaufgaben,
  ],
);
