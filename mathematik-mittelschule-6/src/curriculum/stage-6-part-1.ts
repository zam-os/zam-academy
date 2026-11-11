import { fmt } from "../exercises/format";
import { CHART_KEYS, CHART_NAMES, seemingRatio } from "../lab/views-daten";
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
  makeLesson(6, step, null, content);
const values = (v: Record<string, number>) => CHART_KEYS.map((key) => v[key]);

const diagramme = L(1, {
  id: "da-1-diagramme",
  title: "6.1 Strichlisten, Tabellen und Diagramme",
  subtitle: "Daten ablesen und in andere Darstellungen übertragen",
  whyItMatters:
    "Zeitungen, Apps und Klassenumfragen zeigen Zahlen als Bilder. Du lernst, aus ihnen das Richtige herauszulesen.",
  explanationHtml: `<p>Plane für eine Präsentation von Daten: Legt eine eindeutige Frage, die Antwortmöglichkeiten und die befragte Gruppe fest. Jede Person darf bei einer Frage mit genau einer Antwort nur einmal gezählt werden. Stellt eure Daten anschließend der Klasse vor und begründet, warum die Darstellung zum Publikum und zur Fragestellung passt. Die App zeigt dir danach das Bündeln und Darstellen an Beispieldaten.</p><p>Daten kannst du verschieden darstellen. In einer <strong>Strichliste</strong> machst du für jede Antwort einen Strich, je fünf werden gebündelt. In einer <strong>Tabelle</strong> stehen die Anzahlen als Zahlen. Die Anzahl, wie oft ein bestimmtes Ergebnis vorkommt, heißt <strong>absolute Häufigkeit</strong>. Im <strong>Säulendiagramm</strong> und im <strong>Balkendiagramm</strong> entspricht die Länge der Säule oder des Balkens der Anzahl.</p><p>Beim Ablesen schaust du zuerst auf die Beschriftung: Was wird gezählt? Wie ist die Achse eingeteilt? Beim Übertragen wählst du eine Einteilung, auf die alle Werte passen.</p><div class="example">Umfrage: 5 Stimmen für Sport, 3 für Kunst, 8 für Musik. Summe: 16 Kinder. Musik hat die meisten Stimmen, 5 mehr als Kunst. Im Säulendiagramm ist die Musiksäule am höchsten.</div><div class="merke"><strong>Merke:</strong> Erst Beschriftung und Einteilung lesen, dann die Werte. Alle Darstellungen zeigen dieselben Daten.</div>`,
  formulas: [
    {
      name: "Summe der Daten",
      html: "Summe = alle Anzahlen zusammen",
      quantities: "Zahl aller Befragten oder Zählungen",
    },
  ],
  quiz: {
    question:
      "Du siehst eine Strichliste mit zwei Bündeln und 3 Strichen. Für welche Zahl steht das?",
    options: ["13", "5", "23"],
    correctIndex: 0,
    explanation: "Zwei Bündel sind 2 · 5 = 10, und 3 Striche dazu: 13.",
  },
  lab: lab(
    "chart",
    "Dieselben Daten, drei Bilder",
    "Wechsle die Darstellung. Bei Säulen kannst du auch direkt an den Griffen ziehen.",
    [
      c("type", "Darstellung", [
        "Strichliste",
        "Säulendiagramm",
        "Balkendiagramm",
      ]),
      ...CHART_NAMES.map((name, i) =>
        r(CHART_KEYS[i], name, 0, 10, [2, 4, 1, 3, 6][i]),
      ),
    ],
    [
      o("summe", "Summe", (v) => values(v).reduce((a, b) => a + b, 0)),
      o("meist", "Am häufigsten", (v) => {
        const list = values(v);
        const top = Math.max(...list);
        return CHART_NAMES.filter((_, i) => list[i] === top).join(", ");
      }),
    ],
    [
      {
        id: "tabelle",
        text: "Übertrage diese Tabelle ins Säulendiagramm: Sport 5, Kunst 3, Musik 8, Mathe 2, Deutsch 4.",
        check: (v) =>
          v.type === 1 &&
          v.a === 5 &&
          v.b === 3 &&
          v.c === 8 &&
          v.d === 2 &&
          v.e === 4,
      },
      {
        id: "gleich",
        text: "Zeige in der Strichliste 30 Stimmen, die sich gleichmäßig auf alle Fächer verteilen.",
        check: (v) => v.type === 0 && values(v).every((x) => x === 6),
      },
      {
        id: "balken",
        text: "Zeige im Balkendiagramm: Sport hat alleine die meisten Stimmen, nämlich 10.",
        check: (v) =>
          v.type === 2 &&
          v.a === 10 &&
          values(v)
            .slice(1)
            .every((x) => x < 10),
      },
    ],
  ),
  exercises: [
    {
      id: "strichliste-lesen",
      make: (rng, level) => {
        const a = rng.int(6, 19);
        const drawn = rng.int(6, 19);
        const b = drawn === a ? drawn + 1 : drawn;
        const bundles = Math.floor(a / 5),
          rest = a % 5;
        if (level === 1)
          return task(
            level,
            `Eine Strichliste zeigt ${bundles} ${bundles === 1 ? "volles Fünferbündel" : "volle Fünferbündel"} und ${rest === 0 ? "keine einzelnen Striche" : `${rest} ${rest === 1 ? "einzelner Strich" : "einzelne Striche"}`}. Wie viele Stimmen sind das?`,
            "",
            [num("Stimmen:", a, "", 0)],
            "Ein Bündel sind 5 Striche.",
            `${bundles} · 5 + ${rest} = ${a}.`,
            `${a} Stimmen`,
            { a },
          );
        const big = Math.max(a, b),
          small = Math.min(a, b);
        const first = a >= b ? "Hund" : "Katze";
        return task(
          level,
          "",
          `In einer Umfrage stimmten ${a} Kinder für den Hund und ${b} für die Katze. Übertrage das in Gedanken in zwei Säulen. Wie viele Kinder wurden gefragt, und um wie viele Stimmen ist die höhere Säule größer?`,
          [
            num("Befragte:", a + b, "", 0),
            num("Unterschied:", big - small, "", 0),
          ],
          `Die höhere Säule gehört zu: ${first}.`,
          `${a} + ${b} = ${a + b}. ${big} − ${small} = ${big - small}.`,
          `${a + b} Befragte, Unterschied ${big - small}`,
          { a, b },
        );
      },
    },
    {
      id: "saeule-einteilung",
      make: (rng, level) => {
        const step = rng.pick([2, 5, 10]);
        const lines = rng.int(2, 9);
        const value = step * lines;
        if (level === 1)
          return task(
            level,
            `In einem Säulendiagramm bedeutet ein Teilstrich ${step} Kinder. Eine Säule reicht bis zum ${lines}. Strich. Wie viele Kinder sind das?`,
            "",
            [
              num("Kinder:", value, "", 0, {
                slips: [
                  {
                    value: lines,
                    hint: `Das ist die Anzahl der Striche. Ein Strich bedeutet ${step} Kinder.`,
                  },
                ],
              }),
            ],
            "Striche · Wert eines Strichs",
            `${lines} · ${step} = ${value}.`,
            `${value} Kinder`,
            { step, lines },
          );
        const fitting = rng.pick([5, 10, 20, 50]);
        const top = fitting * rng.int(8, 10);
        const data = rng.shuffle([
          rng.int(2, 3) * fitting,
          rng.int(4, 6) * fitting,
          top,
        ]);
        const options = [
          `${fitting} pro Strich`,
          "1 pro Strich",
          `${n0(fitting * 50)} pro Strich`,
        ];
        return task(
          level,
          "",
          `Du sollst ${data.join(", ")} als Säulen auf ein Blatt zeichnen, mit etwa 10 Teilstrichen. Welche Einteilung passt?`,
          [pick("Einteilung:", options, 0)],
          "Der größte Wert muss noch auf das Blatt passen.",
          `Bei ${fitting} pro Strich passt ${top} auf ${top / fitting} Striche. Mit 1 pro Strich wären es viel zu viele, mit ${n0(fitting * 50)} pro Strich wären alle Säulen winzig.`,
          `${fitting} pro Strich`,
          { top },
        );
      },
    },
  ],
});

const verzerrungen = L(2, {
  id: "da-3-verzerrungen",
  title: "6.2 Diagramme kritisch prüfen",
  subtitle: "Fehler und Verzerrungen erkennen und korrigieren",
  whyItMatters:
    "Werbung und Schlagzeilen zeigen Diagramme oft so, dass kleine Unterschiede riesig wirken. Lass dich nicht täuschen.",
  explanationHtml: `<p>Diagramme können täuschen. Prüfe immer:</p><p><strong>Beginnt die Achse bei 0?</strong> Schneidet man den unteren Teil ab, wirken kleine Unterschiede groß. <strong>Ist die Einteilung gleichmäßig?</strong> Alle Abstände müssen gleich viel bedeuten. <strong>Sind die Säulen gleich breit?</strong> <strong>Passen die Säulen zu den Zahlen?</strong> <strong>Fehlt die Beschriftung?</strong></p><p>Zum <strong>Korrigieren</strong> zeichnest du das Diagramm mit einer Achse ab 0 und gleichmäßiger Einteilung neu.</p><div class="example">Produkt A hat 90 Punkte, Produkt B 70 Punkte. Beginnt die Achse bei 50, ist die Säule A doppelt so hoch wie die von B, denn 40 ist das Doppelte von 20. In Wahrheit ist A nur wenig mehr als ein Viertel größer.</div><div class="merke"><strong>Merke:</strong> Achse ab 0, gleichmäßige Einteilung. Vertraue den Zahlen, nicht nur dem Bild.</div>`,
  formulas: [
    {
      name: "Ehrliche Achse",
      html: "Säulendiagramme beginnen bei 0.",
      quantities: "Sonst wirken Unterschiede größer, als sie sind.",
    },
  ],
  quiz: {
    question:
      "Ein Diagramm zeigt 98 und 96 Punkte. Die eine Säule ist doppelt so hoch wie die andere. Was ist passiert?",
    options: [
      "Die Achse beginnt nicht bei 0.",
      "Die Säulen sind korrekt gezeichnet.",
      "96 ist die Hälfte von 98.",
    ],
    correctIndex: 0,
    explanation:
      "Beginnt die Achse bei 94, sind die Säulen 4 und 2 hoch. Die Zahlen unterscheiden sich aber kaum.",
  },
  lab: lab(
    "truncated-axis",
    "Die Achse verschieben",
    "Stelle zwei Werte ein und verschiebe den Beginn der Achse. Vergleiche, was das Bild zeigt und was die Zahlen sagen.",
    [
      r("a", "Wert A", 50, 100, 90),
      r("b", "Wert B", 50, 100, 70),
      r("start", "Achsenbeginn", 0, 45, 20, 5),
    ],
    [
      o(
        "wirkt",
        "A wirkt wie das …-fache",
        (v) => seemingRatio(v.a, v.b, v.start),
        "",
        1,
      ),
      o("wahr", "A ist wirklich das …-fache", (v) => v.a / v.b, "", 1),
    ],
    [
      {
        id: "taeuschen",
        text: "Lasse Säule A mindestens doppelt so hoch wirken, obwohl A weniger als das 1,5-Fache von B ist.",
        check: (v) => seemingRatio(v.a, v.b, v.start) >= 2 && v.a / v.b < 1.5,
      },
      {
        id: "ehrlich",
        text: "Zeige ehrlich: A ist doppelt so groß wie B. Die Achse beginnt bei 0.",
        check: (v) => v.start === 0 && v.a === 2 * v.b,
      },
      {
        id: "gleich",
        text: "Stelle zwei gleiche Werte von 80 ein, mit Achse ab 0.",
        check: (v) => v.start === 0 && v.a === 80 && v.b === 80,
      },
    ],
  ),
  exercises: [
    {
      id: "wirkung",
      make: (rng, level) => {
        const honest = level === 2 && rng.int(0, 2) === 0;
        const start = honest ? 0 : rng.pick([40, 50, 60]);
        const b = honest ? rng.int(2, 6) * 10 : start + rng.int(1, 3) * 10;
        const a = start + (b - start) * 2;
        return task(
          level,
          `Die Achse beginnt bei ${start}. Säule A zeigt ${a}, Säule B zeigt ${b}. Wie hoch ist Säule A im Bild, und wie hoch ist Säule B, gemessen ab dem Achsenbeginn?`,
          `Eine Werbung zeigt Säulen für ${a} und ${b} Punkte auf einer Achse ab ${start}. Die Säule von A wirkt doppelt so hoch. Ist A wirklich doppelt so gut wie B?`,
          level === 1
            ? [
                num("Höhe A:", a - start, "", 0),
                num("Höhe B:", b - start, "", 0),
              ]
            : [
                pick(
                  "Wirklich doppelt so gut?",
                  ["nein", "ja"],
                  honest ? 1 : 0,
                ),
                num("Doppelter Wert von B wäre:", 2 * b, "", 0),
              ],
          "Im Bild zählt nur der Teil ab dem Achsenbeginn.",
          `${a} − ${start} = ${a - start} und ${b} − ${start} = ${b - start}.${level === 2 ? ` Das Doppelte von ${b} wäre ${2 * b}.` : ""}`,
          level === 1
            ? `A: ${a - start}, B: ${b - start}`
            : honest
              ? `Ja, die Achse beginnt bei 0, und ${a} ist das Doppelte von ${b}.`
              : `Nein, ${a} ist nicht das Doppelte von ${b}.`,
          { start, a, b },
        );
      },
    },
    {
      id: "fehler-finden",
      make: (rng, level) => {
        const items = [
          [
            "Die Achse beginnt bei 80 statt bei 0.",
            "Die Unterschiede wirken zu groß.",
          ],
          [
            "Die Abstände 10, 20, 30, 50, 100 sind gleich weit gezeichnet.",
            "Die Einteilung ist nicht gleichmäßig.",
          ],
          [
            "Eine Säule ist doppelt so breit wie die anderen.",
            "Die breite Säule wirkt zu groß.",
          ],
        ] as const;
        const [text, effect] = rng.pick(items);
        const others = items.map(([, e]) => e).filter((e) => e !== effect);
        const low = rng.int(40, 60),
          high = low + rng.int(2, 9) * 2;
        return task(
          level,
          `Prüfe das Diagramm: ${text} Was ist das Problem?`,
          `Ein Diagramm zeigt ${low} und ${high}. Um korrekt zu sein, zeichnest du es neu. Bei welcher Zahl beginnt die Achse, und wie groß ist der Unterschied?`,
          level === 1
            ? [pick("Problem:", [effect, ...others], 0)]
            : [
                num("Achsenbeginn:", 0, "", 0),
                num("Unterschied:", high - low, "", 0),
              ],
          "Prüfe Achse, Einteilung und Breite.",
          level === 1
            ? text
            : `Eine ehrliche Säule beginnt bei 0. ${high} − ${low} = ${high - low}.`,
          level === 1 ? effect : `Achse ab 0, Unterschied ${high - low}`,
          { low, high },
        );
      },
    },
  ],
});

export const LESSONS = [diagramme, verzerrungen];
