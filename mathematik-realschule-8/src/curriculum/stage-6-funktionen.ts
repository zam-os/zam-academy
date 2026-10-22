import { fmt, fmtUnit, frac, fracHtml, linear, paren, point, sum, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  allDifferentX,
  analyseRelation,
  angleBetweenLines,
  domainFunctionOf,
  domainOf,
  intervalText,
  LINE_TARGETS,
  lineText,
  ORIGIN_TARGET,
  originSlope,
  perpendicularPair,
  type Ratio,
  ratio,
  ratioApprox,
  ratioText,
  REPRESENTATIONS,
  relationPoints,
  representationOf,
  setText,
  sharedValueCount,
  testLineHits,
  valueSet,
  zeroOfLine,
  zerosInDomain,
  zerosText,
} from "../lab/views-funktionen";
import type { ChoiceField, ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-6-funktionen";
/** Lessons 6.1 to 6.5 serve both Zweige, 6.6 to 6.10 only Zweig I. */
const BOTH = "M8 LB 6 (I) · M8 LB 5 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

const CELL = "border:1px solid var(--line);padding:0.2rem 0.55rem;text-align:center";

/** A small table with a heading column, inline-styled so that it looks the same in tasks as in the explanation. */
function valueTable(rows: Array<[string, string[]]>): string {
  const body = rows
    .map(([head, cells]) => `<tr><th style="${CELL};background:var(--elevated)">${head}</th>${cells.map((c) => `<td style="${CELL}">${c}</td>`).join("")}</tr>`)
    .join("");
  return `<table style="border-collapse:collapse;margin:0.3rem 0">${body}</table>`;
}

/** A choice whose options are shuffled; the right one is found again by its text. */
function shuffledChoice(rng: Rng, label: string, correct: string, wrong: string[]): ChoiceField {
  const options = rng.shuffle([correct, ...wrong.filter((w, i, all) => w !== correct && all.indexOf(w) === i)]);
  return choiceField(label, options, options.indexOf(correct));
}

/** "2 · " or "−" or "" in front of a bracket, for substituting into m · x. */
function times(m: number): string {
  return m === 1 ? "" : m === -1 ? "−" : `${fmt(m)} · `;
}

/** The value of m · x + t written out with x substituted: "0,5 · (−2) + 1". */
function linearAt(m: number, t: number, x: number): string {
  return `${times(m)}${paren(x)}${term(t, "", false)}`;
}

/** A ratio in HTML: a decimal where it ends, a stacked fraction otherwise. */
function ratioHtml(r: Ratio): string {
  const shown = ratioText(r);
  return shown.includes("/") ? fracHtml(r[0], r[1]) : shown;
}

/** " ≈ 0,67" behind a ratio whose decimal does not end. */
function approxTail(r: Ratio): string {
  return ratioText(r).includes("/") ? ` ≈ ${fmt(r[0] / r[1], 2)}` : "";
}

/** A ratio as a factor of a product, in brackets when negative: "(−3/4)". */
function ratioFactor(r: Ratio): string {
  return r[0] < 0 ? `(${ratioHtml(r)})` : ratioHtml(r);
}

/** y = m x + t in HTML with m as a ratio: "y = ⅔x + 1", "y = −x", "y = 3". */
function lineHtml(r: Ratio, t = 0): string {
  if (r[0] === 0) return `y = ${fmt(t)}`;
  const shown = ratioText(r);
  const coef = shown === "1" ? "" : shown === "−1" ? "−" : ratioHtml(r);
  return `y = ${coef}x${term(t, "", false)}`;
}

const value = (r: Ratio) => r[0] / r[1];

/** A nonzero whole number between −n and n. */
function nonzero(rng: Rng, n: number): number {
  return rng.pick([...Array.from({ length: n }, (_, i) => -(i + 1)), ...Array.from({ length: n }, (_, i) => i + 1)]);
}

// 6.1 Funktion oder nicht? ──────────────────────────────────────────────────

const RELATION_X = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
const NOT_A_FUNCTION = "keine, die Zuordnung ist eine Funktion";

/** Everyday relations: whether they are functions and why. */
export const SITUATIONS: Array<{ text: string; isFunction: boolean; reason: string }> = [
  { text: "Jedem Schüler deiner Klasse wird sein Geburtsdatum zugeordnet.", isFunction: true, reason: "Jeder Schüler hat genau ein Geburtsdatum. Dass zwei am selben Tag geboren sind, ist erlaubt." },
  { text: "Jedem Briefgewicht (bis 1000 g) wird das Porto zugeordnet.", isFunction: true, reason: "Zu jedem Gewicht gehört genau ein Preis. Viele Gewichte kosten dasselbe, der Graph ist eine Treppe; das ist erlaubt." },
  { text: "Jeder Zahl wird ihr Quadrat zugeordnet.", isFunction: true, reason: "Jede Zahl hat genau ein Quadrat. Dass 3 und −3 beide das Quadrat 9 haben, ist erlaubt." },
  { text: "Jeder Uhrzeit eines Tages wird die Temperatur zugeordnet, die eine Wetterstation misst.", isFunction: true, reason: "Zu jedem Zeitpunkt gibt es genau einen Messwert." },
  { text: "Jeder gefahrenen Strecke wird der Preis einer Taxifahrt nach dem Tarif zugeordnet.", isFunction: true, reason: "Zu jeder Strecke gehört nach dem Tarif genau ein Preis." },
  { text: "Jeder Seitenlänge eines Quadrats wird sein Flächeninhalt zugeordnet.", isFunction: true, reason: "Zu jeder Seitenlänge a gehört genau ein Flächeninhalt a²." },
  { text: "Jedem Zeitpunkt beim Befüllen einer Vase wird die Füllhöhe des Wassers zugeordnet.", isFunction: true, reason: "Zu jedem Zeitpunkt steht das Wasser genau eine Höhe hoch (Füllgraph)." },
  { text: "Jedem Buch der Schulbibliothek wird seine Seitenzahl zugeordnet.", isFunction: true, reason: "Jedes Buch hat genau eine Seitenzahl; gleich dicke Bücher sind erlaubt." },
  { text: "Jeder Körpergröße (in cm) wird der Name eines Schülers deiner Klasse mit dieser Größe zugeordnet.", isFunction: false, reason: "Zwei Schüler können gleich groß sein; dann gehören zu einer Größe zwei Namen." },
  { text: "Jedem Portobetrag wird das Gewicht eines Briefes zugeordnet, der so viel kostet.", isFunction: false, reason: "Für denselben Betrag gibt es viele mögliche Gewichte." },
  { text: "Jeder positiven Zahl werden die Zahlen zugeordnet, deren Quadrat sie ist.", isFunction: false, reason: "Zur Zahl 9 gehören 3 und −3, also zwei Werte." },
  { text: "Jeder gemessenen Temperatur wird die Uhrzeit zugeordnet, zu der die Wetterstation sie gemessen hat.", isFunction: false, reason: "Dieselbe Temperatur kann vormittags und abends gemessen werden." },
  { text: "Jedem Schulfach werden die Schüler deiner Klasse zugeordnet, die es als Lieblingsfach haben.", isFunction: false, reason: "Ein Fach kann mehrere Fans haben, ein anderes gar keinen." },
  { text: "Jedem Tag des Jahres wird der Schüler deiner Klasse zugeordnet, der an diesem Tag Geburtstag hat.", isFunction: false, reason: "An vielen Tagen hat niemand Geburtstag, an manchen zwei Schüler." },
  { text: "Jedem Vornamen werden die Schüler deiner Schule mit diesem Vornamen zugeordnet.", isFunction: false, reason: "Mehrere Schüler können denselben Vornamen haben." },
];

export const RELATION_OPTIONS = [
  "Funktion",
  "keine Funktion: Nicht zu jedem x gehört genau ein y.",
  "keine Funktion: Zwei x haben denselben y-Wert.",
];

export const DESCRIPTIONS = ["y nimmt gleichmäßig zu", "y nimmt zu, aber nicht gleichmäßig", "y nimmt gleichmäßig ab", "y bleibt gleich"];

/** Processes measured in a table: uniform or not, with the sentences that describe them. */
interface Process {
  intro: string;
  xName: string;
  yName: string;
  xUnit: string;
  yUnit: string;
  xs: number[];
  ys: number[];
  /** The right description first, then two wrong ones. */
  sentences: [string, string, string];
  quantity: string;
}

function makeProcess(rng: Rng, kind: number): Process {
  if (kind === 0) {
    const h0 = rng.pick([15, 18, 20, 24]);
    const r = rng.pick([1, 1.5, 2]);
    return {
      intro: "Eine Kerze brennt ab. Lena misst jede Stunde ihre Höhe.",
      xName: "Zeit t in h",
      yName: "Höhe in cm",
      xUnit: "h",
      yUnit: "cm",
      xs: [0, 1, 2, 3, 4],
      ys: [0, 1, 2, 3, 4].map((t) => h0 - r * t),
      sentences: [
        "Je länger die Kerze brennt, desto kürzer ist sie; sie wird gleichmäßig kürzer.",
        "Je länger die Kerze brennt, desto kürzer ist sie; sie wird immer langsamer kürzer.",
        "Je länger die Kerze brennt, desto länger ist sie.",
      ],
      quantity: "die Höhe",
    };
  }
  if (kind === 1) {
    const start = rng.pick([80, 85, 90, 95]);
    const drops = rng.pick([
      [18, 14, 10, 6],
      [20, 15, 11, 8],
      [16, 12, 9, 7],
    ]);
    const ys = [start];
    for (const d of drops) ys.push(ys[ys.length - 1] - d);
    return {
      intro: "Eine Tasse Tee kühlt ab. Tim misst alle 5 Minuten die Temperatur.",
      xName: "Zeit t in min",
      yName: "Temperatur in °C",
      xUnit: "min",
      yUnit: "°C",
      xs: [0, 5, 10, 15, 20],
      ys,
      sentences: [
        "Je länger der Tee steht, desto kälter ist er; er kühlt immer langsamer ab.",
        "Je länger der Tee steht, desto kälter ist er; er kühlt gleichmäßig ab.",
        "Je länger der Tee steht, desto wärmer ist er.",
      ],
      quantity: "die Temperatur",
    };
  }
  if (kind === 2) {
    const v0 = rng.pick([0, 20, 30, 40]);
    const r = rng.pick([10, 12, 15]);
    return {
      intro: "In eine Badewanne läuft Wasser. Alle 2 Minuten wird die Wassermenge abgelesen.",
      xName: "Zeit t in min",
      yName: "Wasser in l",
      xUnit: "min",
      yUnit: "l",
      xs: [0, 2, 4, 6, 8],
      ys: [0, 2, 4, 6, 8].map((t) => v0 + r * t),
      sentences: [
        "Je länger das Wasser läuft, desto mehr ist in der Wanne; die Menge nimmt gleichmäßig zu.",
        "Je länger das Wasser läuft, desto mehr ist in der Wanne; die Menge nimmt immer schneller zu.",
        "Je länger das Wasser läuft, desto weniger ist in der Wanne.",
      ],
      quantity: "die Wassermenge",
    };
  }
  if (kind === 3) {
    const speeds = rng.pick([
      [20, 40, 60, 80, 100],
      [30, 50, 70, 90, 110],
    ]);
    return {
      intro: "Eine Faustformel aus der Fahrschule gibt den Bremsweg eines Autos auf trockener Straße an.",
      xName: "Tempo in km/h",
      yName: "Bremsweg in m",
      xUnit: "km/h",
      yUnit: "m",
      xs: speeds,
      ys: speeds.map((v) => (v / 10) ** 2),
      sentences: [
        "Je schneller das Auto fährt, desto länger ist der Bremsweg; er wächst immer stärker.",
        "Je schneller das Auto fährt, desto länger ist der Bremsweg; er wächst gleichmäßig.",
        "Je schneller das Auto fährt, desto kürzer ist der Bremsweg.",
      ],
      quantity: "der Bremsweg",
    };
  }
  if (kind === 4) {
    const r = rng.pick([10, 12, 15, 20]);
    return {
      intro: "Ein Handy spielt ein Video ab. Jede Stunde wird der Ladestand des Akkus notiert.",
      xName: "Zeit t in h",
      yName: "Ladestand in %",
      xUnit: "h",
      yUnit: "%",
      xs: [0, 1, 2, 3, 4],
      ys: [0, 1, 2, 3, 4].map((t) => 100 - r * t),
      sentences: [
        "Je länger das Video läuft, desto leerer wird der Akku; er entlädt sich gleichmäßig.",
        "Je länger das Video läuft, desto leerer wird der Akku; er entlädt sich immer schneller.",
        "Je länger das Video läuft, desto voller wird der Akku.",
      ],
      quantity: "der Ladestand",
    };
  }
  const rises = rng.pick([
    [4, 5, 6, 7],
    [3, 5, 7, 9],
    [2, 3, 5, 8],
  ]);
  const ys = [0];
  for (const d of rises) ys.push(ys[ys.length - 1] + d);
  return {
    intro: "Eine Vase wird nach oben immer schmaler. Aus einem Hahn läuft gleichmäßig Wasser hinein; alle 10 Sekunden wird die Füllhöhe gemessen.",
    xName: "Zeit t in s",
    yName: "Füllhöhe in cm",
    xUnit: "s",
    yUnit: "cm",
    xs: [0, 10, 20, 30, 40],
    ys,
    sentences: [
      "Je länger Wasser einläuft, desto höher steht es; die Füllhöhe steigt immer schneller.",
      "Je länger Wasser einläuft, desto höher steht es; die Füllhöhe steigt gleichmäßig.",
      "Je länger Wasser einläuft, desto tiefer steht es.",
    ],
    quantity: "die Füllhöhe",
  };
}

const funktionOderNicht: Lesson = {
  id: "fu-1-funktionen",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "6.1 Funktion oder nicht?",
  subtitle: "Jedem x genau ein y",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Funktionale Zusammenhänge`,
  whyItMatters:
    "Nur eine eindeutige Zuordnung lässt sich als Funktion mit Gleichung und Graph beschreiben. Mit dieser Frage beginnt jede Aufgabe zu Funktionen, von der Taxirechnung bis zur Abschlussprüfung.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6 und M7:</strong> Eine <strong>Zuordnung</strong> ordnet Größen einander zu, etwa jeder Menge Äpfel ihren Preis. Du kennst schon direkt proportionale Zuordnungen (quotientengleich, der Graph liegt auf einer Ursprungshalbgeraden) und indirekt proportionale (produktgleich, der Graph ist ein Hyperbelast).</p>
    <p>Eine Zuordnung heißt <strong>Funktion</strong>, wenn zu <strong>jedem</strong> x aus der Definitionsmenge D <strong>genau ein</strong> y gehört. x ist die <strong>unabhängige Größe</strong> (du wählst sie), y die <strong>abhängige Größe</strong> (sie ergibt sich aus x). Die Menge aller x heißt <strong>Definitionsmenge D</strong>, die Menge aller y, die vorkommen, <strong>Wertemenge W</strong>.</p>
    <ul>
      <li><strong>Funktionen:</strong> Zeit → Füllhöhe beim Befüllen einer Vase (Füllgraph), Strecke → Taxipreis, Uhrzeit → Temperatur, Briefgewicht → Porto. Beim Porto haben viele Gewichte denselben Preis, der Graph sieht aus wie eine Treppe. Das ist erlaubt.</li>
      <li><strong>Keine Funktionen:</strong> Körpergröße → Name (zwei Kinder können gleich groß sein), Portobetrag → Briefgewicht, Schulfach → Schüler mit diesem Lieblingsfach. Auch ein Kreis und eine Parallele zur y-Achse sind keine Graphen von Funktionen.</li>
    </ul>
    <p>Wichtig ist die Richtung: Zwei verschiedene x dürfen denselben y-Wert haben. Verboten ist nur, dass ein x zwei verschiedene y-Werte bekommt oder gar keinen.</p>
    <p><strong>Graphen-Test:</strong> Ein Graph gehört genau dann zu einer Funktion, wenn ihn jede Parallele zur y-Achse höchstens einmal trifft. Trifft die Gerade x = c zwei Punkte, dann gehören zur Stelle c zwei y-Werte.</p>
    <div class="example"><strong>Beispiel:</strong> Eine Zuordnung ist durch diese Tabelle gegeben:
      <table class="mini"><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>2</td><td>4</td></tr><tr><th>y</th><td>5</td><td>7</td><td>7</td><td>9</td><td>6</td></tr></table>
      Die Stelle x = 2 kommt zweimal vor, mit y = 7 und mit y = 9. Also ist die Zuordnung <strong>keine Funktion</strong>; im Koordinatensystem liegen (2 | 7) und (2 | 9) übereinander auf der Geraden x = 2. Dass x = 2 und x = 3 beide den Wert 7 haben, wäre erlaubt. Ändert man die zweite 2 in eine 5, entsteht eine Funktion mit D = {1; 2; 3; 4; 5} und W = {5; 6; 7; 9}.</div>
    <p><strong>Zusammenhänge beschreiben:</strong> Mit „je …, desto …“ sagst du, wie sich die abhängige Größe ändert: „Je länger die Kerze brennt, desto kürzer ist sie.“ Ändert sich y bei gleichen Schritten von x immer um denselben Betrag, nimmt y <em>gleichmäßig</em> zu oder ab; das siehst du an gleichen Differenzen in der Wertetabelle. Beim Befüllen einer Vase, die oben schmaler wird, steigt das Wasser dagegen immer schneller.</p>
    <p>Typische Fehler: „Zwei x haben denselben y-Wert, also keine Funktion“ (falsch, das ist erlaubt), und die Richtung vertauschen: Briefgewicht → Porto ist eine Funktion, Porto → Briefgewicht nicht.</p>
    <div class="merke"><strong>Merke:</strong> Eine Funktion ordnet jedem x aus D genau ein y zu. Ein Graph gehört zu einer Funktion, wenn ihn jede Parallele zur y-Achse höchstens einmal trifft. Mehrere x mit demselben y sind erlaubt.</div>
  `,
  formulas: [
    { name: "Funktion", html: "jedem x ∈ D genau ein y ∈ W", quantities: "x unabhängige Größe, y abhängige Größe; D Definitionsmenge, W Wertemenge" },
    { name: "Graphen-Test", html: "jede Parallele zur y-Achse trifft den Graphen höchstens einmal", quantities: "trifft x = c zwei Punkte, gehören zu c zwei y-Werte: keine Funktion" },
    { name: "Gleichmäßige Änderung", html: "gleiche Schritte bei x ⇒ gleiche Differenzen bei y", quantities: "„je …, desto …“ beschreibt die Richtung der Änderung" },
  ],
  quiz: {
    question: "Welche Zuordnung ist keine Funktion?",
    options: ["Briefgewicht → Porto", "Portobetrag → Briefgewicht", "Uhrzeit → gemessene Temperatur", "Seitenlänge eines Quadrats → Umfang"],
    correctIndex: 1,
    explanation:
      "Für denselben Portobetrag gibt es viele mögliche Briefgewichte; zu einem x gehören also mehrere y. Beim Porto nach Gewicht kosten zwar viele Gewichte dasselbe, doch das ist erlaubt: Jedes Gewicht hat genau einen Preis.",
  },
  lab: {
    kind: "relation-check",
    title: "Labor: Der Graphen-Test",
    intro:
      "Ziehe die fünf Punkte im Gitter; rechts siehst du dieselbe Zuordnung als Pfeildiagramm. Die lila Prüfgerade ist eine Parallele zur y-Achse: Trifft sie zwei Punkte, gehören zu einer Stelle x zwei y-Werte.",
    params: [
      {
        type: "choice",
        key: "sel",
        label: "Regler für den Punkt",
        options: [1, 2, 3, 4, 5].map((i) => ({ value: i, label: `P${"₀₁₂₃₄₅"[i]}` })),
        value: 1,
      },
      ...[1, 2, 3, 4, 5].flatMap((i) => [
        { type: "range" as const, key: `x${i}`, label: `x-Koordinate von P${"₀₁₂₃₄₅"[i]}`, unit: "", min: 0, max: 6, step: 1, value: [0, 0, 1, 2, 4, 5][i], showIf: (v: Record<string, number>) => v.sel === i },
        { type: "range" as const, key: `y${i}`, label: `y-Koordinate von P${"₀₁₂₃₄₅"[i]}`, unit: "", min: 0, max: 6, step: 1, value: [0, 1, 3, 4, 5, 2][i], showIf: (v: Record<string, number>) => v.sel === i },
      ]),
      { type: "range", key: "s", label: "Prüfgerade x = s", unit: "", min: 0, max: 6, step: 1, value: 3 },
    ],
    readouts: [
      {
        key: "art",
        label: "Die Zuordnung ist",
        emphasis: true,
        compute: (v) => {
          const info = analyseRelation(relationPoints(v));
          if (info.isFunction) return "eine Funktion";
          const x = info.broken[0];
          return `keine Funktion: x = ${fmt(x)} hat ${(info.ys.get(x) ?? []).length} y-Werte`;
        },
      },
      { key: "D", label: "Definitionsmenge", compute: (v) => `D = ${setText(analyseRelation(relationPoints(v)).D)}` },
      { key: "W", label: "Wertemenge", compute: (v) => `W = ${setText(analyseRelation(relationPoints(v)).W)}` },
      {
        key: "test",
        label: "Prüfgerade x = s trifft",
        compute: (v) => {
          const hits = testLineHits(relationPoints(v), v.s);
          return hits === 0 ? "keinen Punkt" : hits === 1 ? "einen Punkt" : `${hits} Punkte`;
        },
      },
    ],
    goals: [
      {
        id: "zwei-werte",
        text: "Ziehe einen Punkt so, dass die Zuordnung keine Funktion mehr ist, und weise es mit der Prüfgeraden nach: Sie muss zwei Punkte treffen.",
        check: (v) => testLineHits(relationPoints(v), v.s) >= 2,
      },
      {
        id: "gleicher-wert",
        text: "Lege die Punkte auf fünf verschiedene Stellen x, und zwar so, dass genau drei von ihnen denselben y-Wert haben. Ist das noch eine Funktion?",
        check: (v) => {
          const points = relationPoints(v);
          return allDifferentX(points) && sharedValueCount(points) === 3;
        },
      },
      {
        id: "konstant",
        text: "Stelle eine konstante Funktion ein: fünf verschiedene Stellen x, aber nur ein einziger Funktionswert. Wie sieht ihre Wertemenge aus?",
        check: (v) => {
          const points = relationPoints(v);
          return allDifferentX(points) && analyseRelation(points).W.length === 1;
        },
      },
    ],
  },
  exercises: [
    {
      id: "eindeutig",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const isFunction = rng.next() < 0.5;
          const xs = rng.shuffle(RELATION_X).slice(0, 5);
          const ys = xs.map(() => rng.int(-4, 9));
          if (rng.next() < 0.6) {
            const [i, j] = rng.shuffle([0, 1, 2, 3, 4]);
            ys[j] = ys[i];
          }
          const pairs = xs.map((x, i) => ({ x, y: ys[i] }));
          let dup = Number.NaN;
          if (isFunction) {
            pairs.push({ x: rng.pick(RELATION_X.filter((x) => !xs.includes(x))), y: rng.int(-4, 9) });
          } else {
            const k = rng.int(0, 4);
            let y2 = rng.int(-4, 9);
            while (y2 === ys[k]) y2 = rng.int(-4, 9);
            pairs.push({ x: xs[k], y: y2 });
            dup = xs[k];
          }
          const order = rng.shuffle(pairs);
          const info = analyseRelation(order);
          // the x that share a y with another x: the tempting wrong answers
          const shared = info.D.filter((x) => order.some((p) => p.x !== x && p.y === order.find((q) => q.x === x)!.y));
          const others = rng.shuffle(info.D.filter((x) => x !== dup));
          const lures = [...shared.filter((x) => x !== dup), ...others.filter((x) => !shared.includes(x))];
          const xOptions = rng.shuffle([...(isFunction ? [] : [dup]), ...lures].slice(0, 3));
          const options = [NOT_A_FUNCTION, ...xOptions.map((x) => `x = ${fmt(x)}`)];
          const q = rng.pick(info.D.filter((x) => x !== dup));
          const yq = (info.ys.get(q) ?? [0])[0];
          const asTable = rng.next() < 0.5;
          const sharedPair = shared.length >= 2 ? shared.filter((x) => x !== dup).slice(0, 2) : [];
          const sharedValue = sharedPair.length === 2 ? order.find((p) => p.x === sharedPair[0])!.y : 0;
          const dupYs = info.ys.get(dup) ?? [];
          return {
            prompt: `${asTable ? "Eine Zuordnung ist durch die Wertetabelle gegeben." : "Eine Zuordnung besteht aus den angegebenen Wertepaaren (x | y)."} Ist sie eine Funktion? Gib an, welche Stelle x mehr als einen y-Wert hat, und lies den y-Wert an der Stelle x = ${fmt(q)} ab.`,
            given: [
              asTable
                ? valueTable([
                    ["x", order.map((p) => fmt(p.x))],
                    ["y", order.map((p) => fmt(p.y))],
                  ])
                : order.map((p) => point(p.x, p.y)).join("; "),
            ],
            formulaHint: "Funktion: Zu jedem x gehört genau ein y. Zwei verschiedene x dürfen denselben y-Wert haben.",
            fields: [choiceField("Welche Stelle hat mehr als einen y-Wert?", options, isFunction ? 0 : 1 + xOptions.indexOf(dup)), numberField(`y an der Stelle x = ${fmt(q)}:`, yq, "", 0)],
            steps: [
              "Suche die Stellen x, die mehrmals vorkommen, und vergleiche ihre y-Werte.",
              isFunction
                ? `Jede Stelle x kommt genau einmal vor.${sharedPair.length === 2 ? ` Dass x = ${fmt(sharedPair[0])} und x = ${fmt(sharedPair[1])} beide den Wert ${fmt(sharedValue)} haben, ist erlaubt.` : ""}`
                : `x = ${fmt(dup)} kommt zweimal vor: ${point(dup, dupYs[0])} und ${point(dup, dupYs[1])}. Zu einer Stelle gehören zwei y-Werte.`,
              `<strong>${isFunction ? "Die Zuordnung ist eine Funktion" : `Keine Funktion, wegen x = ${fmt(dup)}`}; an der Stelle x = ${fmt(q)} ist y = ${fmt(yq)}.</strong>`,
            ],
            meta: {
              isFunction: isFunction ? 1 : 0,
              dup: isFunction ? 99 : dup,
              q,
              yq,
              ...Object.fromEntries(order.flatMap((p, i) => [[`x${i}`, p.x], [`y${i}`, p.y]])),
            },
          };
        }
        const [a, b] = rng.shuffle(SITUATIONS.map((_, i) => i));
        const [A, B] = [SITUATIONS[a], SITUATIONS[b]];
        return {
          prompt: `Entscheide für beide Zuordnungen, ob sie Funktionen sind, und begründe für dich. Die zuerst genannte Größe ist jeweils x.<br>(A) ${A.text}<br>(B) ${B.text}`,
          given: ["Funktion: jedem x genau ein y"],
          fields: [choiceField("(A)", RELATION_OPTIONS, A.isFunction ? 0 : 1), choiceField("(B)", RELATION_OPTIONS, B.isFunction ? 0 : 1)],
          steps: [`(A) ${A.reason}`, `(B) ${B.reason}`, `<strong>(A) ${A.isFunction ? "Funktion" : "keine Funktion"}, (B) ${B.isFunction ? "Funktion" : "keine Funktion"}</strong>`],
          meta: { a, b },
        };
      },
    },
    {
      id: "beschreiben",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          const m = kind === 0 ? rng.pick([0.5, 1, 1.5, 2, 3]) : kind === 1 ? rng.pick([-0.5, -1, -1.5, -2, -3]) : 0;
          const c = kind === 0 ? rng.int(-3, 5) : kind === 1 ? rng.int(4, 12) : kind === 2 ? rng.int(-3, 4) : rng.int(-3, 8);
          const f = (x: number) => (kind === 2 ? x * x + c : m * x + c);
          const xs = [0, 1, 2, 3, 4];
          const ys = xs.map(f);
          const diffs = ys.slice(1).map((y, i) => y - ys[i]);
          const describe = [0, 2, 1, 3][kind];
          const y5 = f(5);
          const slips = kind === 2 ? [{ value: ys[4] + diffs[3], hint: "Die Differenzen wachsen jedes Mal um 2: Die nächste ist nicht 7, sondern 9." }] : [{ value: ys[4], hint: "Setze das Muster fort: Auch von x = 4 zu x = 5 kommt die gleiche Differenz dazu." }];
          const signed = (d: number) => (d > 0 ? `+${fmt(d)}` : fmt(d));
          return {
            prompt: "Beschreibe, wie sich y ändert, wenn x wächst, und setze die Wertetabelle bis x = 5 fort.",
            given: [valueTable([["x", xs.map((x) => fmt(x))], ["y", ys.map((y) => fmt(y))]])],
            formulaHint: "Bilde die Differenzen der y-Werte von Spalte zu Spalte: Sind sie immer gleich, ändert sich y gleichmäßig.",
            fields: [choiceField("Wie ändert sich y?", DESCRIPTIONS, describe), numberField("y an der Stelle x = 5:", y5, "", 2, { slips })],
            steps: [
              `Differenzen der y-Werte: ${diffs.map(signed).join(", ")}.`,
              kind === 2
                ? "Die Differenzen wachsen um 2: y nimmt zu, aber nicht gleichmäßig. Die nächste Differenz ist +9."
                : kind === 3
                  ? "Alle Differenzen sind 0: y bleibt gleich."
                  : `Immer ${signed(diffs[0])}: y nimmt gleichmäßig ${m > 0 ? "zu" : "ab"}.`,
              `<strong>${DESCRIPTIONS[describe]}; y(5) = ${fmt(ys[4])} ${kind === 2 ? "+ 9" : kind === 3 ? "+ 0" : diffs[0] > 0 ? `+ ${fmt(diffs[0])}` : `− ${fmt(-diffs[0])}`} = ${fmt(y5)}</strong>`,
            ],
            meta: { kind, m, c, y5 },
          };
        }
        const kind = rng.int(0, 5);
        const p = makeProcess(rng, kind);
        const i = rng.int(0, 2);
        const j = rng.int(i + 1, 4);
        const change = p.ys[j] - p.ys[i];
        const [right, ...wrong] = p.sentences;
        return {
          prompt: `${p.intro} Welcher Satz beschreibt den Zusammenhang richtig? Um wie viel ändert sich ${p.quantity} von ${fmtUnit(p.xs[i], p.xUnit)} bis ${fmtUnit(p.xs[j], p.xUnit)}? Gib eine Abnahme mit Minus an.`,
          given: [valueTable([[p.xName, p.xs.map((x) => fmt(x))], [p.yName, p.ys.map((y) => fmt(y))]])],
          fields: [
            shuffledChoice(rng, "Beschreibung", right, wrong),
            numberField("Änderung:", change, p.yUnit, 2, { slips: [{ value: p.ys[j], hint: "Gesucht ist die Änderung, also die Differenz der beiden Werte, nicht der Wert selbst." }] }),
          ],
          steps: [
            `Differenzen von Spalte zu Spalte: ${p.ys.slice(1).map((y, k) => fmt(y - p.ys[k])).join("; ")}. ${new Set(p.ys.slice(1).map((y, k) => y - p.ys[k])).size === 1 ? "Sie sind gleich: Die Änderung ist gleichmäßig." : "Sie sind verschieden: Die Änderung ist nicht gleichmäßig."}`,
            `Änderung: ${fmt(p.ys[j])} ${p.yUnit} − ${fmt(p.ys[i])} ${p.yUnit} = ${fmtUnit(change, p.yUnit)}`,
            `<strong>${right} Änderung: ${fmtUnit(change, p.yUnit)}</strong>`,
          ],
          meta: { kind, i, j, change, ...Object.fromEntries(p.ys.map((y, k) => [`y${k}`, y])), ...Object.fromEntries(p.xs.map((x, k) => [`x${k}`, x])) },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst eindeutige Zuordnungen und beschreibst, wie eine Größe von der anderen abhängt.",
};

// 6.2 Darstellungsformen wechseln ───────────────────────────────────────────

/** A function the task generators use: its term in HTML and its values. */
interface TermFn {
  html: string;
  f: (x: number) => number;
}

const lin = (m: number, t: number): TermFn => ({ html: `y = ${linear(m, t)}`, f: (x) => m * x + t });
const square = (c: number): TermFn => ({ html: `y = ${sum([[1, "x²"], [c, ""]])}`, f: (x) => x * x + c });
const hyper = (k: number): TermFn => ({ html: `y = ${fmt(k)} : x`, f: (x) => k / x });

/** Same values at x = −2 … 6 (without 0): the same function for a table. */
const sameFn = (a: TermFn, b: TermFn) => [-2, -1, 1, 2, 3, 4, 5, 6].every((x) => Math.abs(a.f(x) - b.f(x)) < 1e-9);

/** Terms that fit the first pair (1 | y1) of a table and nothing more: the tempting wrong choices. */
function lures(y1: number, target: TermFn, xs: number[]): TermFn[] {
  const candidates: TermFn[] = [lin(y1, 0), lin(1, y1 - 1), lin(2, y1 - 2), lin(3, y1 - 3), lin(-1, y1 + 1), square(y1 - 1)];
  if (y1 > 0) candidates.push(hyper(y1));
  const out: TermFn[] = [];
  for (const c of candidates) {
    if (sameFn(c, target) || out.some((o) => sameFn(o, c)) || out.some((o) => o.html === c.html)) continue;
    if (xs.every((x) => Math.abs(c.f(x) - target.f(x)) < 1e-9)) continue;
    out.push(c);
  }
  return out;
}

/** The contexts of the description → term tasks. */
function descriptionContext(rng: Rng, kind: number) {
  if (kind === 0) {
    const g = rng.pick([3, 3.5, 4, 4.5]);
    const p = rng.pick([1.8, 2, 2.2, 2.4]);
    const [x1, x2] = rng.shuffle([3, 5, 8, 12, 15]).slice(0, 2).sort((u, w) => u - w);
    return {
      text: `Ein Taxiunternehmen verlangt ${fmtUnit(g, "€")} Grundgebühr und ${fmtUnit(p, "€")} je gefahrenem Kilometer. x ist die Strecke in km, y der Fahrpreis in €.`,
      right: lin(p, g),
      wrong: [lin(g, p), lin(p + g, 0)],
      x1,
      x2,
      xLabel: (x: number) => `Preis für ${fmtUnit(x, "km")}:`,
      unit: "€",
      slip: "Grundgebühr und Kilometerpreis vertauscht? Die Grundgebühr zahlst du einmal, den Kilometerpreis für jeden Kilometer.",
      build: `Für x km zahlst du ${fmt(p)} · x Euro, dazu einmal die Grundgebühr ${fmtUnit(g, "€")}: y = ${linear(p, g)}.`,
      a: g,
      b: p,
    };
  }
  if (kind === 1) {
    const a = rng.pick([20, 30, 49, 50]);
    const b = rng.pick([19, 25, 29, 35]);
    const [x1, x2] = rng.shuffle([3, 6, 9, 12]).slice(0, 2).sort((u, w) => u - w);
    return {
      text: `Ein Fitnessstudio verlangt einmalig ${fmtUnit(a, "€")} Aufnahmegebühr und ${fmtUnit(b, "€")} pro Monat. x ist die Anzahl der Monate, y der bis dahin bezahlte Betrag in €.`,
      right: lin(b, a),
      wrong: [lin(a, b), lin(a + b, 0)],
      x1,
      x2,
      xLabel: (x: number) => `Betrag nach ${x} Monaten:`,
      unit: "€",
      slip: "Aufnahmegebühr und Monatsbeitrag vertauscht? Die Aufnahmegebühr zahlst du einmal, den Beitrag jeden Monat.",
      build: `Für x Monate zahlst du ${fmt(b)} · x Euro und einmal ${fmtUnit(a, "€")}: y = ${linear(b, a)}.`,
      a,
      b,
    };
  }
  if (kind === 2) {
    const A = rng.pick([18, 24, 36, 48]);
    const divisors = [2, 3, 4, 6, 8, 9, 12].filter((d) => A % d === 0);
    const [x1, x2] = rng.shuffle(divisors).slice(0, 2).sort((u, w) => u - w);
    return {
      text: `Alle Rechtecke eines Bastelbogens haben den Flächeninhalt ${A} cm². x ist die Länge eines Rechtecks in cm, y seine Breite in cm.`,
      right: hyper(A),
      wrong: [lin(-1, A), lin(A, 0)],
      x1,
      x2,
      xLabel: (x: number) => `Breite bei der Länge ${fmtUnit(x, "cm")}:`,
      unit: "cm",
      slip: "Länge mal Breite ergibt den Flächeninhalt: Die Breite ist der Flächeninhalt geteilt durch die Länge.",
      build: `Länge mal Breite ist ${A}: x · y = ${A}, also y = ${A} : x (indirekt proportional, Wiederholung aus M7).`,
      a: A,
      b: 0,
    };
  }
  if (kind === 3) {
    const [x1, x2] = rng.shuffle([1.5, 2.5, 3, 4, 6]).slice(0, 2).sort((u, w) => u - w);
    return {
      text: "Ein quadratisches Beet hat die Seitenlänge x in m. Zugeordnet wird sein Flächeninhalt y in m².",
      right: { html: "y = x²", f: (x: number) => x * x },
      wrong: [lin(2, 0), lin(4, 0)],
      x1,
      x2,
      xLabel: (x: number) => `Fläche bei ${fmtUnit(x, "m")} Seitenlänge:`,
      unit: "m²",
      slip: "Der Flächeninhalt eines Quadrats ist Seitenlänge mal Seitenlänge; 4x wäre sein Umfang.",
      build: "Ein Quadrat mit der Seitenlänge x hat den Flächeninhalt x · x: y = x². (4x wäre sein Umfang.)",
      a: 0,
      b: 0,
    };
  }
  const v0 = rng.pick([50, 80, 120]);
  const r = rng.pick([15, 20, 25]);
  const [x1, x2] = rng.shuffle([2, 4, 5, 8, 10]).slice(0, 2).sort((u, w) => u - w);
  return {
    text: `In einem Becken sind schon ${v0} l Wasser. Eine Pumpe füllt pro Minute ${r} l nach. x ist die Zeit in Minuten, y die Wassermenge in l.`,
    right: lin(r, v0),
    wrong: [lin(v0, r), lin(r, 0)],
    x1,
    x2,
    xLabel: (x: number) => `Wasser nach ${x} min:`,
    unit: "l",
    slip: "Was schon im Becken ist, kommt einmal dazu; die Pumpleistung wird mit der Zeit malgenommen.",
    build: `In x Minuten kommen ${r} · x Liter dazu, ${v0} l sind schon da: y = ${linear(r, v0)}.`,
    a: v0,
    b: r,
  };
}

/** The contexts of the table → term tasks with a graph to draw. */
function tableContext(rng: Rng, kind: number) {
  if (kind === 0) {
    const p = rng.pick([0.8, 0.9, 1.2, 1.4]);
    return { text: `Beim Bäcker kosten x Brezen y €.`, xName: "Brezen", yName: "Preis in €", target: lin(p, 0), connect: false, xStar: rng.pick([6, 7, 9, 10]), unit: "€", ask: (x: number) => `Preis für ${x} Brezen:`, why: "Es gibt nur ganze Brezen: einzelne Punkte, keine Linie.", a: p, b: 0 };
  }
  if (kind === 1) {
    const q = rng.pick([8, 9, 10.5, 12]);
    const g = rng.pick([1, 1.5, 2]);
    return { text: `Für eine Online-Bestellung von x Kinokarten zahlt man y € (Kartenpreis und eine Buchungsgebühr).`, xName: "Karten", yName: "Preis in €", target: lin(q, g), connect: false, xStar: rng.pick([6, 8, 10]), unit: "€", ask: (x: number) => `Preis für ${x} Karten:`, why: "Es gibt nur ganze Karten: einzelne Punkte, keine Linie.", a: q, b: g };
  }
  if (kind === 2) {
    const v0 = rng.pick([30, 40, 60]);
    const r = rng.pick([12, 15, 18]);
    return { text: `Ein Becken wird gefüllt. Die Tabelle zeigt die Wassermenge y in l nach x Minuten.`, xName: "Zeit in min", yName: "Wasser in l", target: lin(r, v0), connect: true, xStar: rng.pick([6, 7.5, 10]), unit: "l", ask: (x: number) => `Wasser nach ${fmt(x)} min:`, why: "Die Zeit läuft ohne Sprünge weiter: Zwischenwerte sind sinnvoll, die Punkte werden verbunden.", a: r, b: v0 };
  }
  if (kind === 3) {
    const A = rng.pick([12, 24, 36]);
    return { text: `Gartenbeete mit dem Flächeninhalt ${A} m² sollen rechteckig angelegt werden. Die Tabelle zeigt zur Länge x (in m) die Breite y (in m).`, xName: "Länge in m", yName: "Breite in m", target: hyper(A), connect: true, xStar: 6, unit: "m", ask: (x: number) => `Breite bei ${fmtUnit(x, "m")} Länge:`, why: "Jede Länge ist möglich: Die Punkte werden zu einer Kurve verbunden.", a: A, b: 0 };
  }
  const h0 = rng.pick([20, 24, 30]);
  const r = rng.pick([1.5, 2, 2.5]);
  return { text: `Eine Kerze brennt ab. Die Tabelle zeigt ihre Höhe y in cm nach x Stunden.`, xName: "Zeit in h", yName: "Höhe in cm", target: lin(-r, h0), connect: true, xStar: rng.pick([6, 7, 8]), unit: "cm", ask: (x: number) => `Höhe nach ${x} h:`, why: "Die Zeit läuft ohne Sprünge weiter: Die Punkte werden verbunden.", a: -r, b: h0 };
}

const CONNECT = ["ja, auch Zwischenwerte sind sinnvoll", "nein, nur einzelne Punkte"];

const darstellungen: Lesson = {
  id: "fu-2-darstellungen",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "6.2 Darstellungsformen wechseln",
  subtitle: "Gleichung, Tabelle, Graph und Worte",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Darstellungen von Funktionen`,
  whyItMatters:
    "In Sachaufgaben steht eine Funktion meist in Worten oder als Tabelle. Rechnen kannst du erst mit dem Term, den Überblick gibt dir der Graph: Wer zwischen den Darstellungen wechseln kann, kommt in jeder Aufgabe weiter.",
  explanationHtml: `
    <p>Eine Funktion kannst du auf vier Arten darstellen, und jede zeigt etwas anderes besonders gut:</p>
    <ul>
      <li><strong>Funktionsgleichung</strong> y = 0,5x + 1 oder <strong>Funktionsterm</strong> f(x) = 0,5x + 1: Mit ihm berechnest du jeden Funktionswert genau. f(4), gesprochen „f von 4“, ist der y-Wert an der Stelle x = 4: f(4) = 0,5 · 4 + 1 = 3.</li>
      <li><strong>Wertetabelle:</strong> einzelne Wertepaare auf einen Blick, die Vorlage zum Zeichnen.</li>
      <li><strong>Graph:</strong> alle Punkte (x | f(x)) im Koordinatensystem. Du siehst sofort, wo die Funktion steigt oder fällt.</li>
      <li><strong>Verbale Beschreibung:</strong> der Zusammenhang in Worten, etwa „Ein Taxi kostet 3,50 € Grundgebühr und 2 € je Kilometer“.</li>
    </ul>
    <p><strong>Term → Tabelle → Graph:</strong> Wähle eine passende Schrittweite (meist 1, bei großen Werten 2, für feinere Kurven 0,5), setze jeden x-Wert in den Term ein und trage die Punkte ein. Negative Zahlen setzt du in Klammern: Für y = x² − 2 ist f(−3) = (−3)² − 2 = 9 − 2 = 7, nicht −11.</p>
    <p><strong>Beschreibung → Term:</strong> Beim Taxi zahlst du für x Kilometer 2 · x Euro und dazu einmal 3,50 €, also y = 2x + 3,5 mit x ≥ 0. <strong>Tabelle → Term:</strong> Suche ein Muster und prüfe es an <em>allen</em> Wertepaaren, nicht nur am ersten. Wächst y bei jedem Schritt um 1 nach rechts um denselben Betrag, steckt ein Term wie 2x + 1 dahinter; ist das Produkt x · y immer gleich, eine indirekte Proportionalität wie y = 12 : x (Wiederholung aus M7).</p>
    <p><strong>Punkte verbinden oder nicht?</strong> Verbinde die Punkte nur, wenn auch die Zwischenwerte einen Sinn haben. Zeit, Länge und Strecke können jeden Wert annehmen, dann zeichnest du eine durchgehende Linie. Bei Stückzahlen wie Brezen oder Eintrittskarten gibt es keine 2,5 Stück: Der Graph besteht aus einzelnen Punkten.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Rechteck hat den Flächeninhalt 12 cm². Zur Länge x gehört die Breite y = 12 : x, D = ℚ⁺.
      <table class="mini"><tr><th>x in cm</th><td>1</td><td>2</td><td>3</td><td>4</td><td>6</td></tr><tr><th>y in cm</th><td>12</td><td>6</td><td>4</td><td>3</td><td>2</td></tr></table>
      Probe: In jeder Spalte ist x · y = 12. Weil jede Länge möglich ist, verbindest du die Punkte zu einer Kurve, einem Hyperbelast. Bei 8 cm Länge liest du die Breite 12 : 8 = 1,5 cm ab.</div>
    <p>Typische Fehler: einen Term nur am ersten Wertepaar prüfen (zu (1 | 3) passen y = 3x, y = x + 2 und y = 2x + 1), Vorzeichenfehler beim Einsetzen negativer Zahlen und Punkte verbinden, obwohl es nur ganze Stückzahlen gibt.</p>
    <div class="merke"><strong>Merke:</strong> Gleichung, Wertetabelle, Graph und Beschreibung stellen dieselbe Funktion dar. Ein Term passt zu einer Tabelle erst, wenn er für jedes Wertepaar stimmt. Punkte verbindest du nur, wenn Zwischenwerte sinnvoll sind.</div>
  `,
  formulas: [
    { name: "Funktionswert", html: "f(x) = 0,5x + 1 ⇒ f(4) = 0,5 · 4 + 1 = 3", quantities: "f(4): der y-Wert an der Stelle x = 4; negative x in Klammern einsetzen" },
    { name: "Graph", html: "alle Punkte (x | f(x)) mit x ∈ D", quantities: "Punkte nur verbinden, wenn Zwischenwerte sinnvoll sind" },
    { name: "Term aus einer Tabelle", html: "Muster an jedem Wertepaar prüfen", quantities: "gleiche Zunahme: Term wie 2x + 1; gleiches Produkt x · y: y = k : x" },
  ],
  quiz: {
    question: "Eine Wertetabelle enthält die Paare (1 | 3), (2 | 5) und (3 | 7). Welcher Term passt?",
    options: ["y = 3x", "y = 2x + 1", "y = x + 2", "y = x² + 2"],
    correctIndex: 1,
    explanation:
      "Nur y = 2x + 1 passt zu allen drei Paaren: 2 · 1 + 1 = 3, 2 · 2 + 1 = 5, 2 · 3 + 1 = 7. Die anderen Terme passen nur zum ersten Paar (1 | 3); y = 3x gibt bei x = 2 schon 6.",
  },
  lab: {
    kind: "representations",
    title: "Labor: Vier Darstellungen einer Funktion",
    intro:
      "Wähle eine Funktion und ziehe die Stelle x auf der x-Achse. Rechts stehen Gleichung, Beschreibung und Wertetabelle; die Zeile zur Stelle x leuchtet grün, im Graphen siehst du den Punkt (x | f(x)).",
    params: [
      { type: "choice", key: "f", label: "Funktion", options: REPRESENTATIONS.map((r, i) => ({ value: i, label: r.equation })), value: 0 },
      { type: "range", key: "x", label: "Stelle x", unit: "", min: -4, max: 8, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "gleichung", label: "Funktionsgleichung", compute: (v) => representationOf(v).equation },
      { key: "D", label: "Definitionsmenge", compute: (v) => representationOf(v).D },
      {
        key: "wert",
        label: "Funktionswert",
        emphasis: true,
        compute: (v) => {
          const r = representationOf(v);
          return r.inD(v.x) ? `f(${fmt(v.x)}) = ${fmt(r.f(v.x))}` : `x = ${fmt(v.x)} liegt nicht in D`;
        },
      },
    ],
    goals: [
      {
        id: "wert-sieben",
        text: "Finde bei y = x² − 2 eine Stelle x mit f(x) = 7. Gibt es noch eine zweite?",
        check: (v) => v.f === 1 && Math.abs(v.x) === 3,
      },
      {
        id: "beschreibung",
        text: "Welche Funktion beschreibt Rechtecke mit 12 cm² Flächeninhalt? Wähle sie und finde die Länge x, zu der die Breite 1,5 cm gehört.",
        check: (v) => v.f === 2 && v.x === 8,
      },
      {
        id: "einzelpunkte",
        text: "Bei einer der Funktionen darf man die Punkte nicht verbinden. Wähle sie und stelle eine Stelle x zwischen zwei Punkten ein: Warum liegt sie nicht in D?",
        check: (v) => v.f === 4 && v.x > 0 && v.x < 8 && !Number.isInteger(v.x),
      },
    ],
  },
  exercises: [
    {
      id: "wertetabelle",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          let fn: TermFn;
          let xs: number[];
          let slip: (x: number) => { value: number; hint: string } | null;
          let shown: (x: number) => string;
          if (kind === 0) {
            const m = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1.5, 2, 3]);
            const t = rng.int(-4, 4);
            fn = lin(m, t);
            xs = [rng.int(-4, -1), ...rng.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 2)].sort((a, b) => a - b);
            shown = (x) => linearAt(m, t, x);
            slip = (x) => (x < 0 ? { value: m * -x + t, hint: "Vorzeichen beim Einsetzen: Setze negative Zahlen in Klammern, ein Minus mal ein Minus ergibt Plus." } : null);
          } else if (kind === 1) {
            const c = rng.int(-5, 4);
            fn = square(c);
            xs = [rng.int(-4, -1), ...rng.shuffle([0, 1, 2, 3, 4]).slice(0, 2)].sort((a, b) => a - b);
            shown = (x) => `${paren(x)}²${term(c, "", false)}`;
            slip = (x) => (x < 0 ? { value: -(x * x) + c, hint: `(${fmt(x)})² = ${fmt(x * x)}: Das Quadrat einer negativen Zahl ist positiv. Setze sie in Klammern.` } : null);
          } else {
            const k = rng.pick([6, 8, 12, 18, 24]);
            fn = hyper(k);
            const divisors = [1, 2, 3, 4, 6, 8, 12].filter((d) => k % d === 0);
            xs = [-rng.pick(divisors), ...rng.shuffle(divisors).slice(0, 2)].sort((a, b) => a - b);
            shown = (x) => `${fmt(k)} : ${paren(x)}`;
            slip = (x) => ({ value: x / k, hint: `Bei ${fmt(k)} : x steht x hinter dem Geteiltzeichen: ${fmt(k)} geteilt durch x, nicht umgekehrt.` });
          }
          const fields = xs.map((x) => {
            const s = slip(x);
            return numberField(`f(${fmt(x)}) =`, fn.f(x), "", 2, s ? { slips: [s] } : {});
          });
          return {
            prompt: `Lege für die Funktion ${fn.html} eine Wertetabelle an: Berechne die Funktionswerte an den Stellen ${xs.map((x) => `x = ${fmt(x)}`).join(", ")}.`,
            given: [fn.html],
            formulaHint: "Setze jeden x-Wert für x in den Term ein; negative Zahlen in Klammern.",
            fields,
            steps: [...xs.map((x) => `f(${fmt(x)}) = ${shown(x)} = ${fmt(fn.f(x))}`), `<strong>Wertetabelle:</strong> ${valueTable([["x", xs.map((x) => fmt(x))], ["y", xs.map((x) => fmt(fn.f(x)))]])}`],
            meta: { kind, x0: xs[0], x1: xs[1], x2: xs[2] },
          };
        }
        const kind = rng.int(0, 4);
        const ctx = descriptionContext(rng, kind);
        return {
          prompt: `${ctx.text} Welche Funktionsgleichung beschreibt den Zusammenhang? Berechne mit ihr die beiden gesuchten Werte.`,
          given: [`x₁ = ${fmt(ctx.x1)}, x₂ = ${fmt(ctx.x2)}`],
          fields: [
            shuffledChoice(rng, "Funktionsgleichung", ctx.right.html, ctx.wrong.map((w) => w.html)),
            numberField(ctx.xLabel(ctx.x1), ctx.right.f(ctx.x1), ctx.unit, 2, { slips: ctx.wrong.map((w) => ({ value: w.f(ctx.x1), hint: ctx.slip })) }),
            numberField(ctx.xLabel(ctx.x2), ctx.right.f(ctx.x2), ctx.unit, 2),
          ],
          steps: [ctx.build, `x = ${fmt(ctx.x1)}: y = ${fmtUnit(ctx.right.f(ctx.x1), ctx.unit)}; x = ${fmt(ctx.x2)}: y = ${fmtUnit(ctx.right.f(ctx.x2), ctx.unit)}`, `<strong>${ctx.right.html}; ${fmtUnit(ctx.right.f(ctx.x1), ctx.unit)} und ${fmtUnit(ctx.right.f(ctx.x2), ctx.unit)}</strong>`],
          meta: { kind, a: ctx.a, b: ctx.b, x1: ctx.x1, x2: ctx.x2 },
        };
      },
    },
    {
      id: "term-finden",
      make: (rng, level): ExerciseTask => {
        const xs = [1, 2, 3, 4];
        if (level === 1) {
          const kind = rng.int(0, 3);
          let target: TermFn;
          let xStar: number;
          if (kind === 0) {
            target = lin(rng.pick([2, 3, -1, -2, 0.5, 1.5]), rng.int(-3, 5));
            xStar = rng.pick([6, 10, -2]);
          } else if (kind === 1) {
            target = lin(rng.pick([2, 3, 4, 1.5, -2]), 0);
            xStar = rng.pick([6, 10, -3]);
          } else if (kind === 2) {
            target = square(rng.int(-3, 4));
            xStar = rng.pick([5, 6, -3]);
          } else {
            const k = rng.pick([12, 24, 36]);
            target = hyper(k);
            xStar = rng.pick([6, 12].filter((d) => k % d === 0));
          }
          const y1 = target.f(1);
          const wrong = rng.shuffle(lures(y1, target, xs)).slice(0, 3);
          const tempting = wrong[0];
          return {
            prompt: `Welcher Funktionsterm passt zu der Wertetabelle? Berechne damit auch den Funktionswert an der Stelle x = ${fmt(xStar)}.`,
            given: [valueTable([["x", xs.map((x) => fmt(x))], ["y", xs.map((x) => fmt(target.f(x)))]])],
            formulaHint: "Prüfe jeden Term an allen Wertepaaren, nicht nur am ersten.",
            fields: [
              shuffledChoice(rng, "Funktionsgleichung", target.html, wrong.map((w) => w.html)),
              numberField(`f(${fmt(xStar)}) =`, target.f(xStar), "", 2, { slips: wrong.map((w) => ({ value: w.f(xStar), hint: "Dieser Term passt nur zum ersten Wertepaar. Prüfe ihn auch an x = 2, 3 und 4." })) }),
            ],
            steps: [
              `Alle angebotenen Terme ergeben bei x = 1 den Wert ${fmt(y1)}. Erst die anderen Paare entscheiden: Bei ${tempting.html} wäre f(2) = ${fmt(tempting.f(2))}${Math.abs(tempting.f(2) - target.f(2)) < 1e-9 ? ` und f(3) = ${fmt(tempting.f(3))}` : ""}.`,
              `${target.html} passt zu allen Paaren: ${xs.map((x) => `f(${x}) = ${fmt(target.f(x))}`).join(", ")}.`,
              `<strong>${target.html}; f(${fmt(xStar)}) = ${fmt(target.f(xStar))}</strong>`,
            ],
            meta: { kind, xStar, y1, ...Object.fromEntries(xs.map((x) => [`y${x}`, target.f(x)])) },
          };
        }
        const kind = rng.int(0, 4);
        const ctx = tableContext(rng, kind);
        const wrong = rng.shuffle(lures(ctx.target.f(1), ctx.target, xs)).slice(0, 2);
        return {
          prompt: `${ctx.text} Welcher Funktionsterm passt? Darf man die Punkte des Graphen verbinden? Berechne den gesuchten Wert.`,
          given: [valueTable([[ctx.xName, xs.map((x) => fmt(x))], [ctx.yName, xs.map((x) => fmt(ctx.target.f(x)))]])],
          fields: [
            shuffledChoice(rng, "Funktionsgleichung", ctx.target.html, wrong.map((w) => w.html)),
            choiceField("Punkte verbinden?", CONNECT, ctx.connect ? 0 : 1),
            numberField(ctx.ask(ctx.xStar), ctx.target.f(ctx.xStar), ctx.unit, 2, { slips: wrong.map((w) => ({ value: w.f(ctx.xStar), hint: "Dieser Term passt nur zum ersten Wertepaar. Prüfe ihn an allen Spalten der Tabelle." })) }),
          ],
          steps: [
            `${ctx.target.html} passt zu jeder Spalte: ${xs.map((x) => `f(${x}) = ${fmt(ctx.target.f(x))}`).join(", ")}.`,
            ctx.why,
            `<strong>${ctx.target.html}; ${CONNECT[ctx.connect ? 0 : 1]}; f(${fmt(ctx.xStar)}) = ${fmtUnit(ctx.target.f(ctx.xStar), ctx.unit)}</strong>`,
          ],
          meta: { kind, a: ctx.a, b: ctx.b, xStar: ctx.xStar, connect: ctx.connect ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wechselst sicher zwischen Gleichung, Tabelle, Graph und Beschreibung.",
};

// 6.3 Funktionswerte, Nullstellen, Definitions- und Wertemenge ────────────────

const SLOPES_63 = [-3, -2, -1.5, -1, -0.5, -0.25, 0.25, 0.5, 1, 1.5, 2, 3];

/** f(x) = m x + t with a Nullstelle x₀ that is a whole number and a t of at most two decimals. */
function niceLinear(rng: Rng): { m: number; t: number; x0: number } {
  for (;;) {
    const m = rng.pick(SLOPES_63);
    const x0 = rng.int(-6, 6);
    const t = -m * x0 + 0;
    if (Math.abs(t) <= 8 && t !== 0) return { m, t, x0 };
  }
}

/** Falling processes: a candle, a battery, a tank. */
function fallingContext(rng: Rng) {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    for (;;) {
      const h0 = rng.pick([12, 15, 18, 20, 24]);
      const r = rng.pick([0.5, 0.75, 0.8, 1.2, 1.5, 2, 2.4, 3]);
      const T = h0 / r;
      if (Number.isInteger(T) && T <= 40) {
        return { kind, v0: h0, r, T, name: "h", text: `Eine ${h0} cm hohe Kerze brennt pro Stunde ${fmt(r)} cm ab. Ihre Höhe nach t Stunden ist h(t) = ${fmt(h0)} − ${fmt(r)}t (in cm).`, valueLabel: (t: number) => `Höhe nach ${t} h:`, zeroLabel: "abgebrannt nach t =", unit: "cm", tUnit: "h" };
      }
    }
  }
  if (kind === 1) {
    const r = rng.pick([5, 8, 12.5, 20, 25]);
    return { kind, v0: 100, r, T: 100 / r, name: "L", text: `Ein voll geladener Akku (100 %) eines Tablets verliert beim Spielen pro Stunde ${fmt(r)} Prozentpunkte. Sein Ladestand nach t Stunden ist L(t) = 100 − ${fmt(r)}t (in %).`, valueLabel: (t: number) => `Ladestand nach ${t} h:`, zeroLabel: "leer nach t =", unit: "%", tUnit: "h" };
  }
  for (;;) {
    const v0 = rng.pick([1500, 2400, 3000, 3600]);
    const r = rng.pick([20, 25, 30, 40, 50, 60]);
    const T = v0 / r;
    if (Number.isInteger(T)) {
      return { kind, v0, r, T, name: "V", text: `Ein Heizöltank enthält ${fmt(v0)} l. Im Winter werden pro Tag ${r} l verbraucht. Die Ölmenge nach t Tagen ist V(t) = ${fmt(v0)} − ${r}t (in l).`, valueLabel: (t: number) => `Öl nach ${t} Tagen:`, zeroLabel: "leer nach t =", unit: "l", tUnit: "Tagen" };
    }
  }
}

/** Rising and falling processes with a domain from the text. */
function domainContext(rng: Rng) {
  const kind = rng.int(0, 2);
  if (kind === 0) {
    const g = rng.pick([3, 3.5, 4]);
    const p = rng.pick([1.8, 2, 2.5]);
    const a = rng.pick([1, 2, 3]);
    const b = rng.pick([20, 25, 30]);
    const y = g + p * rng.int(a + 2, b - 2);
    return { kind, m: p, t: g, a, b, y, text: `Ein Taxi kostet ${fmtUnit(g, "€")} Grundgebühr und ${fmtUnit(p, "€")} je Kilometer. Es fährt Strecken zwischen ${a} km und ${b} km.`, fx: `f(x) = ${linear(p, g)} (x in km, y in €)`, ask: (c: number) => `Strecke für ${fmtUnit(c, "€")}:`, unit: "€", xUnit: "km" };
  }
  if (kind === 1) {
    const h0 = rng.pick([45, 60, 80]);
    const r = rng.pick([1.5, 2, 2.5]);
    const b = rng.pick([10, 12, 16].filter((s) => s * r < h0));
    const y = rng.pick([h0 - r * 4, h0 - r * 6, h0 - r * 8]);
    return { kind, m: -r, t: h0, a: 0, b, y, text: `Eine Gondel einer Seilbahn fährt aus ${h0} m Höhe mit ${fmt(r)} m pro Sekunde abwärts. Betrachtet werden die ersten ${b} Sekunden der Fahrt.`, fx: `h(t) = ${linear(-r, h0)} (t in s, h in m)`, ask: (c: number) => `Zeit bis zur Höhe ${fmtUnit(c, "m")}:`, unit: "m", xUnit: "s" };
  }
  const v0 = rng.pick([20, 40, 60]);
  const r = rng.pick([12, 15, 25]);
  const b = rng.pick([10, 12, 20]);
  const y = v0 + r * rng.pick([3, 4, 6]);
  return { kind, m: r, t: v0, a: 0, b, y, text: `In einem Aquarium sind ${v0} l Wasser. Ein Schlauch füllt pro Minute ${r} l nach, ${b} Minuten lang.`, fx: `V(t) = ${linear(r, v0)} (t in min, V in l)`, ask: (c: number) => `Zeit bis ${fmtUnit(c, "l")}:`, unit: "l", xUnit: "min" };
}

const werteNullstellen: Lesson = {
  id: "fu-3-werte-nullstellen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "6.3 Funktionswerte, Nullstellen, Definitions- und Wertemenge",
  subtitle: "Einsetzen, Gleichung lösen, Grenzen setzen",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Funktionswerte und Nullstellen`,
  whyItMatters:
    "Wann ist die Kerze abgebrannt, wann der Tank leer? Solche Fragen sind Nullstellen. Mit Definitions- und Wertemenge legst du fest, für welche Werte eine Funktion im Sachzusammenhang überhaupt gilt.",
  explanationHtml: `
    <p><strong>Funktionswert:</strong> Den Wert an einer Stelle berechnest du durch Einsetzen: Für f(x) = 0,5x − 1 ist f(6) = 0,5 · 6 − 1 = 2. Umgekehrt kannst du nach der Stelle zu einem Wert fragen: f(x) = 3 ist die Gleichung 0,5x − 1 = 3, also 0,5x = 4 und x = 8.</p>
    <p><strong>Nullstelle:</strong> Eine Stelle x₀ mit f(x₀) = 0 heißt Nullstelle. Dort trifft der Graph die x-Achse, im Punkt N(x₀ | 0). Du findest sie, indem du f(x) = 0 setzt und die Gleichung löst: 0,5x − 1 = 0 ⇔ 0,5x = 1 ⇔ x₀ = 2, also N(2 | 0). Eine Funktion kann keine, eine oder mehrere Nullstellen haben: y = 0,5x² − 2 hat die beiden Nullstellen −2 und 2.</p>
    <p><strong>Definitionsmenge D:</strong> alle x, die du einsetzen darfst. Die Grundmenge ist ℚ. Eingeschränkt wird sie durch die Rechnung, etwa bei y = 12 : x, wo x nicht 0 sein darf (D = ℚ \\ {0}, siehe Bruchterme in Etappe 5), und durch den Sachzusammenhang: Zeiten und Längen sind nicht negativ, und eine Kerze brennt nur, bis sie abgebrannt ist. Intervalle schreibst du mit eckigen Klammern: [−2; 4] heißt −2 ≤ x ≤ 4, und ]0; 5] heißt 0 &lt; x ≤ 5.</p>
    <p><strong>Wertemenge W:</strong> alle y-Werte, die tatsächlich vorkommen. Bei einer Geraden über D = [a; b] liegt W zwischen f(a) und f(b); fällt die Gerade, ist f(a) der größte Wert. Ändert der Graph in D seine Richtung, gehört auch der tiefste Punkt dazu: Für y = 0,5x² − 2 auf D = [−1; 4] ist W = [−2; 6], denn der kleinste Wert ist f(0) = −2, der größte f(4) = 6.</p>
    <div class="example"><strong>Beispiel Kerze:</strong> Eine 12 cm hohe Kerze brennt pro Stunde 0,8 cm ab: h(t) = 12 − 0,8t (t in h, h in cm).
      <ul class="steps">
        <li>Nach 5 Stunden: h(5) = 12 − 0,8 · 5 = 8. Die Kerze ist noch 8 cm hoch.</li>
        <li>Wann ist sie 2 cm hoch? 12 − 0,8t = 2 ⇔ 0,8t = 10 ⇔ t = 12,5, also nach 12,5 Stunden.</li>
        <li>Abgebrannt: 12 − 0,8t = 0 ⇔ 0,8t = 12 ⇔ t = 15. Die Nullstelle ist t₀ = 15.</li>
        <li>Sinnvoll sind nur Zeiten von 0 bis 15 Stunden: D = [0; 15]. Die Höhe nimmt von 12 cm auf 0 cm ab: W = [0; 12].</li>
      </ul></div>
    <p>Typische Fehler: die Nullstelle mit f(0) verwechseln (f(0) gibt den Schnittpunkt mit der y-Achse), bei fallenden Funktionen die Grenzen von W vertauschen und eine Nullstelle angeben, die gar nicht in D liegt.</p>
    <div class="merke"><strong>Merke:</strong> Funktionswert: x einsetzen. Stelle zu einem Wert: die Gleichung f(x) = y lösen. Nullstelle: f(x₀) = 0, der Graph trifft die x-Achse in N(x₀ | 0). D enthält alle erlaubten x, W alle y, die vorkommen.</div>
  `,
  formulas: [
    { name: "Nullstelle", html: "f(x₀) = 0; N(x₀ | 0)", quantities: "f(x) = 0 setzen und die Gleichung nach x lösen" },
    { name: "Definitionsmenge", html: "D: alle erlaubten x, z. B. D = [0; 15] oder D = ℚ \\ {0}", quantities: "eingeschränkt durch Nenner ≠ 0 oder den Sachzusammenhang" },
    { name: "Wertemenge einer Geraden", html: "D = [a; b] ⇒ W liegt zwischen f(a) und f(b)", quantities: "steigend: W = [f(a); f(b)]; fallend: W = [f(b); f(a)]" },
  ],
  quiz: {
    question: "Die Funktion f(x) = −2x + 6 ist auf D = [1; 5] definiert. Wie lautet ihre Wertemenge?",
    options: ["W = [4; −4]", "W = [−4; 4]", "W = [1; 5]", "W = [−4; 6]"],
    correctIndex: 1,
    explanation:
      "f(1) = 4 und f(5) = −4. Die Gerade fällt, also ist f(5) der kleinste Wert, und ein Intervall beginnt mit der kleineren Zahl: W = [−4; 4]. [1; 5] ist die Definitionsmenge, und 6 = f(0) kommt nicht vor, weil 0 nicht in D liegt.",
  },
  lab: {
    kind: "zeros-domain",
    title: "Labor: Definitionsmenge einstellen",
    intro:
      "Wähle eine Funktion und ziehe die Enden a und b der Definitionsmenge D = [a; b] auf der x-Achse. Blau markiert ist D, orange die Wertemenge W auf der y-Achse; grüne Punkte sind die Nullstellen in D.",
    params: [
      { type: "choice", key: "f", label: "Funktion", options: [0, 1, 2].map((i) => ({ value: i, label: ["f₁: y = 0,5x − 1", "f₂: y = −x + 3", "f₃: y = 0,5x² − 2"][i] })), value: 0 },
      { type: "range", key: "a", label: "Ende a von D", unit: "", min: -5, max: 5, step: 0.5, value: -2, digits: 1 },
      { type: "range", key: "b", label: "Ende b von D", unit: "", min: -5, max: 5, step: 0.5, value: 4, digits: 1 },
    ],
    readouts: [
      { key: "D", label: "Definitionsmenge", compute: (v) => `D = ${intervalText(domainOf(v).lo, domainOf(v).hi)}` },
      { key: "W", label: "Wertemenge", emphasis: true, compute: (v) => `W = ${intervalText(valueSet(v).lo, valueSet(v).hi)}` },
      { key: "null", label: "Nullstellen in D", compute: (v) => zerosText(zerosInDomain(v)) },
      {
        key: "rand",
        label: "Werte an den Enden",
        compute: (v) => {
          const fn = domainFunctionOf(v);
          const { lo, hi } = domainOf(v);
          return `f(${fmt(lo)}) = ${fmt(fn.f(lo))}; f(${fmt(hi)}) = ${fmt(fn.f(hi))}`;
        },
      },
    ],
    goals: [
      {
        id: "w-intervall",
        text: "Wähle bei f₁ die Definitionsmenge so, dass die Wertemenge W = [−3; 0] ist.",
        check: (v) => v.f === 0 && valueSet(v).lo === -3 && valueSet(v).hi === 0,
      },
      {
        id: "positiv",
        text: "Wähle bei f₂ eine mindestens 4 Einheiten lange Definitionsmenge, auf der alle Funktionswerte positiv sind.",
        check: (v) => v.f === 1 && domainOf(v).hi - domainOf(v).lo >= 4 && valueSet(v).lo > 0,
      },
      {
        id: "eine-nullstelle",
        text: "Wähle bei f₃ eine Definitionsmenge mit genau einer Nullstelle und der Wertemenge W = [−2; 6].",
        check: (v) => v.f === 2 && zerosInDomain(v).length === 1 && valueSet(v).lo === -2 && valueSet(v).hi === 6,
      },
    ],
  },
  exercises: [
    {
      id: "werte-nullstelle",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { m, t, x0 } = niceLinear(rng);
          const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((x) => x !== x0));
          const xb = rng.pick([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((x) => x !== x0 && x !== a));
          const b = m * xb + t;
          const fx = `f(x) = ${linear(m, t)}`;
          return {
            prompt: `Gegeben ist die Funktion ${fx} mit D = ℚ. Berechne f(${fmt(a)}), die Stelle x mit f(x) = ${fmt(b)} und die Nullstelle x₀.`,
            given: [fx],
            formulaHint: "f(a): einsetzen. f(x) = b und f(x) = 0: Gleichung aufstellen und nach x lösen.",
            fields: [
              numberField(`f(${fmt(a)}) =`, m * a + t, "", 2),
              numberField(`x (für f(x) = ${fmt(b)}) =`, xb, "", 2, { slips: [{ value: (b + t) / m, hint: `Beim Umformen: Ziehe auf beiden Seiten ${fmt(t)} ab, bevor du durch ${fmt(m)} teilst.` }] }),
              numberField("x₀ =", x0, "", 2, {
                slips: [
                  { value: t / m, hint: "Vorzeichen: Aus 0 = m · x + t folgt m · x = −t, also x = −t : m." },
                  { value: t, hint: `${fmt(t)} = f(0) ist der Schnittpunkt mit der y-Achse, nicht die Nullstelle. Setze f(x) = 0.` },
                ],
              }),
            ],
            steps: [
              `f(${fmt(a)}) = ${linearAt(m, t, a)} = ${fmt(m * a + t)}`,
              `${linear(m, t)} = ${fmt(b)} ⇔ ${sum([[m, "x"]])} = ${fmt(b - t)} ⇔ x = ${fmt(b - t)} : ${paren(m)} = ${fmt(xb)}`,
              `${linear(m, t)} = 0 ⇔ ${sum([[m, "x"]])} = ${fmt(-t)} ⇔ x₀ = ${fmt(-t)} : ${paren(m)} = ${fmt(x0)}`,
              `<strong>f(${fmt(a)}) = ${fmt(m * a + t)}; x = ${fmt(xb)}; x₀ = ${fmt(x0)}, also N(${fmt(x0)} | 0)</strong>`,
            ],
            meta: { m, t, a, b, xb, x0 },
          };
        }
        const ctx = fallingContext(rng);
        const t1 = rng.pick([2, 3, 4, 5, 6, 8, 10].filter((s) => s < ctx.T));
        const value = ctx.v0 - ctx.r * t1;
        const options = [`D = [0; ${fmt(ctx.T)}], W = [0; ${fmt(ctx.v0)}]`, `D = [0; ${fmt(ctx.v0)}], W = [0; ${fmt(ctx.T)}]`, "D = ℚ, W = ℚ"];
        return {
          prompt: `${ctx.text} Berechne den Wert nach ${t1} ${ctx.tUnit === "Tagen" ? "Tagen" : "Stunden"} und die Nullstelle. Welche Definitionsmenge und welche Wertemenge passen zum Sachzusammenhang?`,
          given: [`${ctx.name}(t) = ${fmt(ctx.v0)} − ${fmt(ctx.r)}t`],
          fields: [
            numberField(ctx.valueLabel(t1), value, ctx.unit, 2, { slips: [{ value: ctx.v0 + ctx.r * t1, hint: "Die Menge nimmt ab: Ziehe ab, was in dieser Zeit verbraucht wird." }] }),
            numberField(ctx.zeroLabel, ctx.T, ctx.tUnit === "Tagen" ? "Tage" : "h", 2, { slips: [{ value: ctx.r / ctx.v0, hint: "Aus 0 = v₀ − r · t folgt t = v₀ : r, nicht r : v₀." }] }),
            shuffledChoice(rng, "Definitions- und Wertemenge", options[0], options.slice(1)),
          ],
          steps: [
            `${ctx.name}(${t1}) = ${fmt(ctx.v0)} − ${fmt(ctx.r)} · ${t1} = ${fmtUnit(value, ctx.unit)}`,
            `Nullstelle: ${fmt(ctx.v0)} − ${fmt(ctx.r)}t = 0 ⇔ ${fmt(ctx.r)}t = ${fmt(ctx.v0)} ⇔ t = ${fmt(ctx.v0)} : ${fmt(ctx.r)} = ${fmt(ctx.T)}`,
            `Sinnvoll sind die Zeiten von 0 bis ${fmt(ctx.T)}, die Werte nehmen von ${fmt(ctx.v0)} bis 0 ab.`,
            `<strong>${ctx.name}(${t1}) = ${fmtUnit(value, ctx.unit)}; t₀ = ${fmt(ctx.T)}; ${options[0]}</strong>`,
          ],
          meta: { kind: ctx.kind, v0: ctx.v0, r: ctx.r, T: ctx.T, t1 },
        };
      },
    },
    {
      id: "wertemenge",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { m, t, x0 } = niceLinear(rng);
          const a = rng.int(-6, 2);
          const b = a + rng.int(2, 7);
          const [fa, fb] = [m * a + t, m * b + t];
          const [lo, hi] = [Math.min(fa, fb), Math.max(fa, fb)];
          const inside = x0 >= a && x0 <= b;
          const fx = `f(x) = ${linear(m, t)}`;
          return {
            prompt: `Die Funktion ${fx} ist auf D = [${fmt(a)}; ${fmt(b)}] definiert. Gib ihre Wertemenge W an und entscheide, ob eine Nullstelle in D liegt.`,
            given: [fx, `D = [${fmt(a)}; ${fmt(b)}]`],
            formulaHint: "Bei einer Geraden liegt W zwischen f(a) und f(b); ein Intervall beginnt mit der kleineren Zahl.",
            fields: [
              numberField("untere Grenze von W:", lo, "", 2, m < 0 ? { slips: [{ value: fa, hint: `Die Gerade fällt: f(${fmt(a)}) ist der größte Wert, die untere Grenze ist f(${fmt(b)}).` }] } : {}),
              numberField("obere Grenze von W:", hi, "", 2, m < 0 ? { slips: [{ value: fb, hint: `Die Gerade fällt: f(${fmt(b)}) ist der kleinste Wert, die obere Grenze ist f(${fmt(a)}).` }] } : {}),
              choiceField("Nullstelle in D?", ["ja", "nein"], inside ? 0 : 1),
            ],
            steps: [
              `f(${fmt(a)}) = ${linearAt(m, t, a)} = ${fmt(fa)} und f(${fmt(b)}) = ${linearAt(m, t, b)} = ${fmt(fb)}`,
              `Die Gerade ${m > 0 ? "steigt" : "fällt"}, also ist W = [${fmt(lo)}; ${fmt(hi)}].`,
              `Nullstelle: ${linear(m, t)} = 0 ⇔ x₀ = ${fmt(x0)}; ${inside ? `${fmt(x0)} liegt in D` : `${fmt(x0)} liegt nicht in D`}.`,
              `<strong>W = [${fmt(lo)}; ${fmt(hi)}]; ${inside ? `Nullstelle x₀ = ${fmt(x0)} in D` : "keine Nullstelle in D"}</strong>`,
            ],
            meta: { m, t, a, b, x0, inside: inside ? 1 : 0 },
          };
        }
        const ctx = domainContext(rng);
        const [fa, fb] = [ctx.m * ctx.a + ctx.t, ctx.m * ctx.b + ctx.t];
        const [lo, hi] = [Math.min(fa, fb), Math.max(fa, fb)];
        const x = (ctx.y - ctx.t) / ctx.m;
        return {
          prompt: `${ctx.text} Stelle die Funktionsgleichung auf, gib die Definitionsmenge an und berechne die Wertemenge W. Wann wird der Wert ${fmtUnit(ctx.y, ctx.unit)} erreicht?`,
          given: [`D = [${fmt(ctx.a)}; ${fmt(ctx.b)}]`],
          fields: [
            numberField("untere Grenze von W:", lo, ctx.unit, 2, { slips: [{ value: ctx.t, hint: "Die Wertemenge hängt von D ab: Setze beide Enden von D ein." }] }),
            numberField("obere Grenze von W:", hi, ctx.unit, 2),
            numberField(ctx.ask(ctx.y), x, ctx.xUnit, 2, { slips: [{ value: (ctx.y + ctx.t) / ctx.m, hint: "Beim Umformen erst den festen Betrag abziehen, dann teilen." }] }),
          ],
          steps: [
            `${ctx.fx}, D = [${fmt(ctx.a)}; ${fmt(ctx.b)}]`,
            `Werte an den Enden: ${fmt(fa)} und ${fmt(fb)}, also W = [${fmt(lo)}; ${fmt(hi)}] (in ${ctx.unit}).`,
            `${linear(ctx.m, ctx.t)} = ${fmt(ctx.y)} ⇔ ${sum([[ctx.m, "x"]])} = ${fmt(ctx.y - ctx.t)} ⇔ x = ${fmt(ctx.y - ctx.t)} : ${paren(ctx.m)} = ${fmt(x)}`,
            `<strong>W = [${fmt(lo)}; ${fmt(hi)}]; ${fmtUnit(ctx.y, ctx.unit)} nach ${fmtUnit(x, ctx.xUnit)}</strong>`,
          ],
          meta: { kind: ctx.kind, m: ctx.m, t: ctx.t, a: ctx.a, b: ctx.b, y: ctx.y, x },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Funktionswerte und Nullstellen und setzt Definitions- und Wertemenge passend zur Situation.",
};

// 6.4 Ursprungsgeraden y = mx ───────────────────────────────────────────────

/** Proportional situations: y = m · x with a rate m and its unit. */
function proportionalContext(rng: Rng) {
  const kind = rng.int(0, 3);
  const pickPair = (xs1: number[], xs2: number[], xs3: number[]) => [rng.pick(xs1), rng.pick(xs2), rng.pick(xs3)];
  if (kind === 0) {
    const m = rng.pick([8, 10, 12, 15]);
    const [x1, x2, x3] = pickPair([2, 3, 4, 5], [6, 7, 9], [10, 12, 15, 20]);
    return { kind, m, x1, x2, x3, text: `Ein Wasserhahn füllt eine Wanne gleichmäßig: In ${x1} Minuten fließen ${fmt(m * x1)} l Wasser hinein.`, mUnit: "l pro min", xUnit: "min", yUnit: "l", ask2: `Wasser nach ${x2} min:`, ask3: `Zeit für ${fmt(m * x3)} l:` };
  }
  if (kind === 1) {
    const m = rng.pick([1.8, 2.4, 2.5, 3.2]);
    const [x1, x2, x3] = pickPair([1.5, 2, 2.5, 3], [4, 5, 6], [7.5, 10, 12]);
    return { kind, m, x1, x2, x3, text: `Auf dem Markt kosten ${fmt(x1)} kg Äpfel ${fmtUnit(m * x1, "€")}. Der Preis ist proportional zur Masse.`, mUnit: "€ pro kg", xUnit: "kg", yUnit: "€", ask2: `Preis für ${fmt(x2)} kg:`, ask3: `Äpfel für ${fmtUnit(m * x3, "€")}:` };
  }
  if (kind === 2) {
    const m = rng.pick([12, 15, 18, 20]);
    const [x1, x2, x3] = pickPair([2, 3, 4], [5, 7, 9], [10, 15, 20]);
    return { kind, m, x1, x2, x3, text: `Ein Drucker druckt gleichmäßig: In ${x1} Minuten schafft er ${fmt(m * x1)} Seiten.`, mUnit: "Seiten pro min", xUnit: "min", yUnit: "Seiten", ask2: `Seiten nach ${x2} min:`, ask3: `Zeit für ${fmt(m * x3)} Seiten:` };
  }
  const m = rng.pick([12, 15, 18, 20]);
  const [x1, x2, x3] = pickPair([0.5, 1.5], [2, 2.5, 3], [4, 5, 6]);
  return { kind, m, x1, x2, x3, text: `Eine Radfahrerin fährt mit gleichbleibendem Tempo. In ${fmt(x1)} Stunden legt sie ${fmt(m * x1)} km zurück.`, mUnit: "km pro h", xUnit: "h", yUnit: "km", ask2: `Strecke nach ${fmt(x2)} h:`, ask3: `Zeit für ${fmt(m * x3)} km:` };
}

/** Claims about a proportional situation, true or with a typical error. */
function claimContext(rng: Rng) {
  const kind = rng.int(0, 3);
  const base = [
    { m: rng.pick([1.5, 2, 2.5]), xs: [2, 3, 4], x2s: [5, 6, 7], x3s: [8, 10, 12], text: (x: number, y: number) => `Ein Heizlüfter verbraucht in ${x} Stunden ${fmt(y)} kWh Strom; der Verbrauch ist proportional zur Zeit.`, claim: (x: number, y: number) => `Tim behauptet: „In ${x} Stunden sind es ${fmt(y)} kWh.“`, xUnit: "h", yUnit: "kWh", ask3: (y: number) => `Zeit für ${fmt(y)} kWh:` },
    { m: rng.pick([80, 90, 120]), xs: [1.5, 2, 2.5], x2s: [3, 4, 5], x3s: [6, 7], text: (x: number, y: number) => `Ein Zug fährt mit gleichbleibendem Tempo und legt in ${fmt(x)} Stunden ${fmt(y)} km zurück.`, claim: (x: number, y: number) => `Lea behauptet: „In ${x} Stunden schafft er ${fmt(y)} km.“`, xUnit: "h", yUnit: "km", ask3: (y: number) => `Zeit für ${fmt(y)} km:` },
    { m: rng.pick([6, 7.5, 12]), xs: [2, 3, 4], x2s: [5, 6, 8], x3s: [10, 12], text: (x: number, y: number) => `Im Stoffladen kosten ${x} m eines Stoffes ${fmtUnit(y, "€")}.`, claim: (x: number, y: number) => `Mia behauptet: „${x} m kosten ${fmtUnit(y, "€")}.“`, xUnit: "m", yUnit: "€", ask3: (y: number) => `Stoff für ${fmtUnit(y, "€")}:` },
    { m: rng.pick([8, 9, 12]), xs: [3, 4, 5], x2s: [6, 7, 10], x3s: [12, 15], text: (x: number, y: number) => `Eine Dusche verbraucht in ${x} Minuten ${fmt(y)} l Wasser, gleichmäßig.`, claim: (x: number, y: number) => `Ben behauptet: „In ${x} Minuten sind es ${fmt(y)} l.“`, xUnit: "min", yUnit: "l", ask3: (y: number) => `Zeit für ${fmt(y)} l:` },
  ][kind];
  const x1 = rng.pick(base.xs);
  const x2 = rng.pick(base.x2s);
  const x3 = rng.pick(base.x3s);
  const truth = base.m * x2;
  const mode = rng.int(0, 2);
  // mode 0: true; 1: additive thinking (one unit more, one unit of y more); 2: a rounding error
  let claimed = mode === 0 ? truth : mode === 1 ? base.m * x1 + (x2 - x1) : truth - rng.pick([1, 2, 5]);
  if (Math.abs(claimed - truth) < 1e-9 && mode !== 0) claimed = truth + 1;
  return { kind, mode, x1, x2, x3, m: base.m, truth, claimed, text: base.text(x1, base.m * x1), claim: base.claim(x2, claimed), xUnit: base.xUnit, yUnit: base.yUnit, ask3: base.ask3(base.m * x3) };
}

const PROBE_SLOPES: Ratio[] = [[1, 2], [3, 4], [2, 3], [-1, 2], [-3, 2], [2, 1], [-3, 1], [5, 2], [-2, 5], [4, 3], [-4, 3], [3, 5]];

const ursprungsgeraden: Lesson = {
  id: "fu-4-ursprungsgeraden",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "6.4 Ursprungsgeraden y = mx",
  subtitle: "Steigung m und Steigungsdreieck",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Ursprungsgeraden und Steigungsdreieck`,
  whyItMatters:
    "Preis pro Kilogramm, Liter pro Minute, Kilometer pro Stunde: Jede direkte Proportionalität ist eine Ursprungsgerade, und ihre Steigung m ist genau diese Rate. Mit dem Steigungsdreieck zeichnest du sie und liest m aus jedem Graphen ab.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6:</strong> Bei einer direkt proportionalen Zuordnung ist der Quotient y : x immer gleich, das ist der Proportionalitätsfaktor; ihr Graph liegt auf einer Geraden durch den Ursprung. Als Funktion schreibst du das <strong>y = mx</strong> mit D = ℚ. Ihr Graph ist eine <strong>Ursprungsgerade</strong>, eine Gerade durch O(0 | 0).</p>
    <p>Der Faktor <strong>m</strong> heißt <strong>Steigung</strong>. Für jeden Punkt P(x | y) der Geraden außer O gilt m = y : x. Damit prüfst du auch, ob ein Punkt auf der Geraden liegt (<strong>Punktprobe</strong>): Q(4 | 3) liegt auf y = 0,75x, weil 0,75 · 4 = 3 ist.</p>
    <p><strong>Steigungsdreieck:</strong> Gehst du von einem Punkt der Geraden 1 nach rechts, musst du m nach oben gehen, um wieder auf die Gerade zu kommen; bei negativem m geht es nach unten. Allgemein gehst du Δx nach rechts und Δy = m · Δx nach oben, also ist m = Δy : Δx. Bei m = ${frac(2, 3)} rechnest du bequemer mit ganzen Zahlen: 3 nach rechts, 2 nach oben. Das Steigungsdreieck darf an jeder Stelle der Geraden liegen und beliebig groß sein, es liefert immer dasselbe m.</p>
    <ul>
      <li>m &gt; 0: Die Gerade steigt (von links nach rechts gelesen).</li>
      <li>m &lt; 0: Die Gerade fällt.</li>
      <li>m = 0: Die Gerade ist die x-Achse, y = 0.</li>
      <li>Je größer |m| ist, desto steiler ist die Gerade: y = 3x ist steiler als y = 0,5x, und y = −3x ist steiler als y = −0,5x.</li>
    </ul>
    <p><strong>Zeichnen:</strong> Von O aus das Steigungsdreieck abtragen, den Endpunkt markieren und die Gerade durch O und diesen Punkt ziehen. <strong>Ablesen:</strong> Suche einen Gitterpunkt auf der Geraden, etwa (3 | −2); dann ist m = −2 : 3 = −${frac(2, 3)}.</p>
    <div class="example"><strong>Beispiel:</strong> Die Ursprungsgerade g geht durch P(−4 | 6).
      <ul class="steps">
        <li>m = y<sub>P</sub> : x<sub>P</sub> = 6 : (−4) = −1,5, also g: y = −1,5x. Die Gerade fällt.</li>
        <li>Steigungsdreieck: −1,5 = −${frac(3, 2)}, also 2 nach rechts und 3 nach unten.</li>
        <li>Punktprobe für Q(2 | −3): −1,5 · 2 = −3 = y<sub>Q</sub>, Q liegt auf g. Für R(3 | 4,5): −1,5 · 3 = −4,5 ≠ 4,5, R liegt nicht auf g.</li>
        <li>Fehlende Koordinate: S(x | 9) liegt auf g, also 9 = −1,5x und x = 9 : (−1,5) = −6.</li>
      </ul></div>
    <p>Typische Fehler: m = x : y statt y : x rechnen, das Steigungsdreieck nach links abtragen und trotzdem „nach oben“ zählen (nach links kehrt sich die Richtung um) und das Minus bei fallenden Geraden vergessen.</p>
    <div class="merke"><strong>Merke:</strong> Die Ursprungsgerade y = mx hat die Steigung m = y : x = Δy : Δx. Steigungsdreieck: 1 nach rechts, m nach oben. Für m &gt; 0 steigt sie, für m &lt; 0 fällt sie; je größer |m|, desto steiler.</div>
  `,
  formulas: [
    { name: "Ursprungsgerade", html: "y = m · x", quantities: "m Steigung; der Graph geht durch O(0 | 0)" },
    { name: "Steigung aus einem Punkt", html: "m = y<sub>P</sub> : x<sub>P</sub>", quantities: "P(x_P | y_P) ein Punkt der Geraden außer O" },
    { name: "Steigungsdreieck", html: "m = Δy : Δx", quantities: "Δx nach rechts, Δy nach oben (negativ: nach unten)" },
  ],
  quiz: {
    question: "Die Ursprungsgerade g geht durch P(4 | −3). Welche Steigung hat sie?",
    options: ["m = −0,75", "m = −4/3", "m = 0,75", "m = −1"],
    correctIndex: 0,
    explanation: "m = y : x = (−3) : 4 = −0,75. −4/3 wäre x : y, also der Kehrwert; ohne Minus würde die Gerade steigen, sie fällt aber, denn zu x = 4 gehört ein negativer y-Wert.",
  },
  lab: {
    kind: "origin-line",
    title: "Labor: Steigung einer Ursprungsgeraden",
    intro:
      "Ziehe den blauen Punkt P: Die Gerade durch O und P hat die Steigung m = y : x. Das Steigungsdreieck verschiebst du an seinem Anfang und machst es an seiner orangen Ecke breiter.",
    params: [
      { type: "range", key: "px", label: "x-Koordinate von P", unit: "", min: -6, max: 6, step: 1, value: 2 },
      { type: "range", key: "py", label: "y-Koordinate von P", unit: "", min: -6, max: 6, step: 1, value: 3 },
      { type: "range", key: "a", label: "Anfang des Steigungsdreiecks bei x =", unit: "", min: -5, max: 5, step: 1, value: 0 },
      { type: "range", key: "d", label: "Breite Δx des Steigungsdreiecks", unit: "", min: 1, max: 5, step: 1, value: 1 },
    ],
    readouts: [
      {
        key: "gl",
        label: "Gleichung",
        emphasis: true,
        compute: (v) => {
          const r = originSlope(v.px, v.py);
          return r ? lineText(r) : v.py === 0 ? "P = O: keine Gerade" : "x = 0 (y-Achse), keine Funktion";
        },
      },
      {
        key: "m",
        label: "Steigung m = y : x",
        compute: (v) => {
          const r = originSlope(v.px, v.py);
          return r ? ratioApprox(r) : "keine";
        },
      },
      {
        key: "dy",
        label: "Steigungsdreieck",
        compute: (v) => {
          const r = originSlope(v.px, v.py);
          return r ? `Δx = ${v.d}, Δy = ${ratioText(ratio(r[0] * v.d, r[1]))}` : "keins";
        },
      },
    ],
    goals: [
      {
        id: "durch-q",
        text: `Lege die Ursprungsgerade durch den Punkt Q(${fmt(ORIGIN_TARGET.x)} | ${fmt(ORIGIN_TARGET.y)}). Welche Steigung hat sie?`,
        check: (v) => v.px !== 0 && ORIGIN_TARGET.y * v.px === ORIGIN_TARGET.x * v.py,
      },
      {
        id: "dreieck-ganz",
        text: "Stelle die Steigung m = 2/3 ein und lege das Steigungsdreieck so, dass alle drei Ecken auf Gitterpunkten liegen.",
        check: (v) => v.px !== 0 && 3 * v.py === 2 * v.px && (2 * v.a) % 3 === 0 && (2 * v.d) % 3 === 0,
      },
      {
        id: "fallend",
        text: "Stelle eine fallende Ursprungsgerade ein, die halb so steil ist wie y = −x, und zeichne ein Steigungsdreieck mit Δx = 4. Wie groß ist Δy?",
        check: (v) => v.px !== 0 && 2 * v.py === -v.px && v.d === 4,
      },
    ],
  },
  exercises: [
    {
      id: "steigung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let xp = 0;
          let yp = 0;
          do {
            xp = nonzero(rng, 6);
            yp = nonzero(rng, 6);
          } while (Math.abs(xp) === Math.abs(yp) && rng.next() < 0.8);
          const r = ratio(yp, xp);
          const ks = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].filter((k) => k !== xp && k % r[1] === 0);
          const k = rng.pick(ks);
          const yk = (r[0] * k) / r[1];
          return {
            prompt: `Die Ursprungsgerade g geht durch den Punkt P(${fmt(xp)} | ${fmt(yp)}). Bestimme ihre Steigung m, gib ihre Gleichung an und berechne den y-Wert an der Stelle x = ${fmt(k)}.`,
            given: [`P(${fmt(xp)} | ${fmt(yp)})`],
            formulaHint: "m = y<sub>P</sub> : x<sub>P</sub>; g: y = m · x",
            fields: [
              numberField("m =", value(r), "", 2, {
                slips: [
                  { value: xp / yp, hint: "Die Steigung ist y : x, nicht x : y." },
                  { value: -value(r), hint: "Prüfe das Vorzeichen: Liegen x und y auf verschiedenen Seiten der Null, fällt die Gerade." },
                ],
              }),
              numberField(`y(${fmt(k)}) =`, yk, "", 2, { slips: [{ value: k / value(r), hint: "y = m · x: Multipliziere die Stelle mit m, teile nicht durch m." }] }),
            ],
            steps: [
              `m = y<sub>P</sub> : x<sub>P</sub> = ${fmt(yp)} : ${paren(xp)} = ${ratioHtml(r)}${approxTail(r)}`,
              `g: ${lineHtml(r)}; ${value(r) > 0 ? "die Gerade steigt" : "die Gerade fällt"}.`,
              `y(${fmt(k)}) = ${ratioFactor(r)} · ${paren(k)} = ${fmt(yk)}`,
              `<strong>m = ${ratioHtml(r)}, g: ${lineHtml(r)}, y(${fmt(k)}) = ${fmt(yk)}</strong>`,
            ],
            meta: { xp, yp, k },
          };
        }
        if (rng.next() < 0.55) {
          const c = proportionalContext(rng);
          const y2 = c.m * c.x2;
          const y3 = c.m * c.x3;
          return {
            prompt: `${c.text} Bestimme die Steigung m der Ursprungsgeraden y = m · x mit ihrer Einheit und berechne damit die beiden gesuchten Werte.`,
            given: [`x₁ = ${fmtUnit(c.x1, c.xUnit)}, y₁ = ${fmtUnit(c.m * c.x1, c.yUnit)}`],
            fields: [
              numberField("m =", c.m, c.mUnit, 2, { slips: [{ value: c.x1 / (c.m * c.x1), hint: "m ist y : x, also die Menge pro Einheit von x, nicht umgekehrt." }] }),
              numberField(c.ask2, y2, c.yUnit, 2),
              numberField(c.ask3, c.x3, c.xUnit, 2, { slips: [{ value: y3 * c.m, hint: "Gesucht ist x: Aus y = m · x folgt x = y : m." }] }),
            ],
            steps: [
              `m = y : x = ${fmt(c.m * c.x1)} : ${fmt(c.x1)} = ${fmt(c.m)} (${c.mUnit}), also y = ${fmt(c.m)} · x.`,
              `y = ${fmt(c.m)} · ${fmt(c.x2)} = ${fmtUnit(y2, c.yUnit)}`,
              `${fmt(y3)} = ${fmt(c.m)} · x ⇔ x = ${fmt(y3)} : ${fmt(c.m)} = ${fmtUnit(c.x3, c.xUnit)}`,
              `<strong>m = ${fmt(c.m)} ${c.mUnit}; ${fmtUnit(y2, c.yUnit)}; ${fmtUnit(c.x3, c.xUnit)}</strong>`,
            ],
            meta: { variant: 0, kind: c.kind, m: c.m, x1: c.x1, x2: c.x2, x3: c.x3 },
          };
        }
        const r = rng.pick(PROBE_SLOPES);
        const left = rng.next() < 0.35;
        const q = r[1];
        const p = Math.abs(r[0]);
        const goesUp = left ? r[0] < 0 : r[0] > 0;
        const k = q * rng.pick([2, 3, 4].filter((n) => q * n <= 12));
        const yk = value(r) * k;
        return {
          prompt: `Am Graphen einer Ursprungsgeraden liest du ab: Gehst du von einem Punkt der Geraden ${q} Kästchen nach ${left ? "links" : "rechts"}, musst du ${p} Kästchen nach ${goesUp ? "oben" : "unten"} gehen, um wieder auf der Geraden zu sein (1 Kästchen = 1 Einheit). Bestimme die Steigung m und den y-Wert an der Stelle x = ${fmt(k)}.`,
          given: [`${q} nach ${left ? "links" : "rechts"}, ${p} nach ${goesUp ? "oben" : "unten"}`],
          fields: [
            numberField("m =", value(r), "", 2, {
              slips: [
                { value: -value(r), hint: left ? "Nach links ist Δx negativ: Wer nach links geht und nach oben muss, hat eine fallende Gerade." : "Prüfe das Vorzeichen: nach unten heißt Δy negativ." },
                { value: q / r[0], hint: "m = Δy : Δx, nicht Δx : Δy." },
              ],
            }),
            numberField(`y(${fmt(k)}) =`, yk, "", 2),
          ],
          steps: [
            `Δx = ${left ? `−${q}` : q}, Δy = ${goesUp ? p : `−${p}`}${left ? " (nach links ist Δx negativ)" : ""}.`,
            `m = Δy : Δx = ${goesUp ? p : `(−${p})`} : ${left ? `(−${q})` : q} = ${ratioHtml(r)}${approxTail(r)}`,
            `y(${fmt(k)}) = ${ratioFactor(r)} · ${fmt(k)} = ${fmt(yk)}`,
            `<strong>m = ${ratioHtml(r)}; y(${fmt(k)}) = ${fmt(yk)}</strong>`,
          ],
          meta: { variant: 1, p: r[0], q: r[1], left: left ? 1 : 0, up: goesUp ? 1 : 0, k },
        };
      },
    },
    {
      id: "punktprobe",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.pick(PROBE_SLOPES);
          const m = value(r);
          const a = r[1] * nonzero(rng, 3);
          const onLine = rng.next() < 0.5;
          const exact = m * a;
          const b = onLine ? exact : rng.next() < 0.5 ? exact + rng.pick([-1, 1]) : -exact;
          const askY = rng.next() < 0.5;
          const c = askY ? r[1] * nonzero(rng, 3) : Math.abs(r[0]) * nonzero(rng, 3);
          const answer = askY ? m * c : c / m;
          const g = `g: ${lineHtml(r)}`;
          return {
            prompt: `Gegeben ist die Ursprungsgerade ${g}. Prüfe rechnerisch, ob der Punkt P(${fmt(a)} | ${fmt(b)}) auf g liegt, und bestimme die fehlende Koordinate von ${askY ? `Q(${fmt(c)} | y)` : `Q(x | ${fmt(c)})`} auf g.`,
            given: [g, `P(${fmt(a)} | ${fmt(b)})`],
            formulaHint: "Punktprobe: m · x<sub>P</sub> ausrechnen und mit y<sub>P</sub> vergleichen. Fehlende x-Koordinate: y = m · x nach x lösen.",
            fields: [
              choiceField("Liegt P auf g?", ["ja", "nein"], onLine ? 0 : 1),
              numberField(askY ? "y =" : "x =", answer, "", 2, { slips: [{ value: askY ? c / m : m * c, hint: askY ? "Gesucht ist y = m · x: malnehmen, nicht teilen." : "Gesucht ist x: Aus y = m · x folgt x = y : m." }] }),
            ],
            steps: [
              `Punktprobe: ${ratioFactor(r)} · ${paren(a)} = ${fmt(exact)}${onLine ? ` = y<sub>P</sub>` : ` ≠ ${fmt(b)}`}, also liegt P ${onLine ? "" : "nicht "}auf g.`,
              askY ? `y = ${ratioFactor(r)} · ${paren(c)} = ${fmt(answer)}` : `${fmt(c)} = ${ratioFactor(r)} · x ⇔ x = ${fmt(c)} : ${ratioFactor(r)} = ${fmt(answer)}`,
              `<strong>P liegt ${onLine ? "auf" : "nicht auf"} g; ${askY ? `Q(${fmt(c)} | ${fmt(answer)})` : `Q(${fmt(answer)} | ${fmt(c)})`}</strong>`,
            ],
            meta: { p: r[0], q: r[1], a, b, askY: askY ? 1 : 0, c },
          };
        }
        const c = claimContext(rng);
        const right = Math.abs(c.claimed - c.truth) < 1e-9;
        const y3 = c.m * c.x3;
        return {
          prompt: `${c.text} ${c.claim} Prüfe die Behauptung mit der Gleichung y = m · x. Wie viel ist es wirklich, und wann wird der Wert ${fmtUnit(y3, c.yUnit)} erreicht?`,
          given: [`${fmtUnit(c.x1, c.xUnit)} ↦ ${fmtUnit(c.m * c.x1, c.yUnit)}`],
          fields: [
            choiceField("Stimmt die Behauptung?", ["ja", "nein"], right ? 0 : 1),
            numberField(`Wert bei ${fmtUnit(c.x2, c.xUnit)}:`, c.truth, c.yUnit, 2, { slips: [{ value: c.m * c.x1 + (c.x2 - c.x1), hint: "Proportional heißt: doppelte Zeit, doppelter Wert. Rechne mit m = y : x, nicht mit dem Unterschied." }] }),
            numberField(c.ask3, c.x3, c.xUnit, 2, { slips: [{ value: y3 * c.m, hint: "Gesucht ist x: Aus y = m · x folgt x = y : m." }] }),
          ],
          steps: [
            `m = ${fmt(c.m * c.x1)} : ${fmt(c.x1)} = ${fmt(c.m)}, also y = ${fmt(c.m)} · x.`,
            `${fmt(c.m)} · ${fmt(c.x2)} = ${fmtUnit(c.truth, c.yUnit)}${right ? ": Die Behauptung stimmt." : ` ≠ ${fmtUnit(c.claimed, c.yUnit)}: Die Behauptung stimmt nicht.`}`,
            `${fmt(y3)} = ${fmt(c.m)} · x ⇔ x = ${fmt(y3)} : ${fmt(c.m)} = ${fmtUnit(c.x3, c.xUnit)}`,
            `<strong>${right ? "ja" : "nein"}; richtig sind ${fmtUnit(c.truth, c.yUnit)}; ${fmtUnit(y3, c.yUnit)} nach ${fmtUnit(c.x3, c.xUnit)}</strong>`,
          ],
          meta: { kind: c.kind, mode: c.mode, m: c.m, x1: c.x1, x2: c.x2, x3: c.x3, claimed: c.claimed },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest die Steigung einer Ursprungsgeraden ab, zeichnest sie mit dem Steigungsdreieck und prüfst Punkte.",
};

// 6.5 Senkrechte Geraden ─────────────────────────────────────────────────────

const PERP_SLOPES: Ratio[] = [[2, 1], [3, 1], [4, 1], [-2, 1], [-3, 1], [1, 2], [1, 3], [-1, 4], [2, 3], [-3, 4], [3, 2], [-5, 2], [1, 5], [5, 4], [-4, 3], [-1, 1]];

const negativeReciprocal = (r: Ratio): Ratio => ratio(-r[1], r[0]);
const product = (a: Ratio, b: Ratio): Ratio => ratio(a[0] * b[0], a[1] * b[1]);

const senkrecht: Lesson = {
  id: "fu-5-senkrecht",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "6.5 Senkrechte Geraden",
  subtitle: "m₁ · m₂ = −1",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Orthogonale Geraden`,
  whyItMatters:
    "Rechte Winkel stecken in Grundrissen, Rampen und Wegen. Mit m₁ · m₂ = −1 prüfst du, ob zwei Geraden senkrecht aufeinander stehen, ohne zu messen, und berechnest die Steigung einer Senkrechten.",
  explanationHtml: `
    <p>Zwei Geraden, die sich unter einem rechten Winkel schneiden, heißen <strong>senkrecht</strong> oder <strong>orthogonal</strong> zueinander, kurz g ⊥ h. Für zwei Ursprungsgeraden g: y = m₁x und h: y = m₂x, die nicht auf einer Koordinatenachse liegen, gilt:</p>
    <p class="formula-line"><strong>g ⊥ h ⇔ m₁ · m₂ = −1</strong>, also m₂ = −1 : m₁</p>
    <p>m₂ ist der <strong>negative Kehrwert</strong> von m₁: Kehrwert bilden und das Vorzeichen umdrehen. Zu m₁ = 2 gehört m₂ = −${frac(1, 2)}, zu m₁ = −${frac(3, 4)} gehört m₂ = ${frac(4, 3)}, zu m₁ = 0,2 = ${frac(1, 5)} gehört m₂ = −5.</p>
    <p><strong>Warum?</strong> Das Steigungsdreieck von g geht 1 nach rechts und m₁ nach oben. Drehst du es um 90° gegen den Uhrzeigersinn um O, geht das gedrehte Dreieck m₁ nach links und 1 nach oben, und es liegt an der gedrehten Geraden h. Deren Steigung ist also 1 : (−m₁) = −1 : m₁. Mit einem Gitterpunkt siehst du es ohne Brüche: P(3 | 2) liegt auf g mit m₁ = ${frac(2, 3)}. Nach der Drehung um 90° um O liegt P′(−2 | 3) auf h, also ist m₂ = 3 : (−2) = −${frac(3, 2)}, und ${frac(2, 3)} · (−${frac(3, 2)}) = −1.</p>
    <p><strong>Sonderfall:</strong> Die x-Achse (m = 0) und die y-Achse stehen auch senkrecht aufeinander, aber die y-Achse hat keine Steigung. Für Geraden parallel zu den Achsen gilt die Regel deshalb nicht.</p>
    <div class="example"><strong>Beispiel:</strong> g: y = 1,5x. Gesucht ist die Ursprungsgerade h mit h ⊥ g.
      <ul class="steps">
        <li>1,5 = ${frac(3, 2)}; der negative Kehrwert ist −${frac(2, 3)}. Also h: y = −${frac(2, 3)}x.</li>
        <li>Probe: 1,5 · (−${frac(2, 3)}) = −1.</li>
        <li>Liegt Q(−6 | 4) auf h? −${frac(2, 3)} · (−6) = 4, ja.</li>
        <li>Ist k: y = 0,6x senkrecht zu h? −${frac(2, 3)} · 0,6 = −0,4 ≠ −1, also nicht.</li>
      </ul></div>
    <p>Typische Fehler: nur den Kehrwert bilden (aus 2 wird ${frac(1, 2)}, die Geraden sind dann nicht senkrecht), nur das Vorzeichen ändern (aus 2 wird −2) oder m₁ + m₂ = 0 statt m₁ · m₂ = −1 prüfen.</p>
    <div class="merke"><strong>Merke:</strong> Zwei Geraden mit den Steigungen m₁ und m₂ stehen genau dann senkrecht aufeinander, wenn m₁ · m₂ = −1 ist. Die Steigung der Senkrechten ist der negative Kehrwert: m₂ = −1 : m₁.</div>
  `,
  formulas: [
    { name: "Senkrechte Geraden", html: "g ⊥ h ⇔ m₁ · m₂ = −1", quantities: "m₁, m₂ Steigungen; keine der Geraden parallel zu einer Achse" },
    { name: "Negativer Kehrwert", html: "m₂ = −1 : m₁", quantities: "z. B. m₁ = 2/3 ⇒ m₂ = −3/2" },
  ],
  quiz: {
    question: "Die Gerade g hat die Steigung m₁ = 2/3. Welche Steigung hat eine zu g senkrechte Gerade?",
    options: ["3/2", "−2/3", "−3/2", "−1"],
    correctIndex: 2,
    explanation: "Der negative Kehrwert von 2/3 ist −3/2, denn 2/3 · (−3/2) = −1. 3/2 ist nur der Kehrwert (Produkt +1), −2/3 nur die Gegenzahl (Produkt −4/9).",
  },
  lab: {
    kind: "perpendicular",
    title: "Labor: Senkrecht oder nicht?",
    intro:
      "Ziehe P₁ und P₂. Blau ist das Steigungsdreieck von g₁, gestrichelt dasselbe Dreieck um 90° um O gedreht: Geht g₂ durch seine Spitze P₁′, stehen die Geraden senkrecht aufeinander.",
    params: [
      { type: "range", key: "x1", label: "x-Koordinate von P₁", unit: "", min: -6, max: 6, step: 1, value: 3 },
      { type: "range", key: "y1", label: "y-Koordinate von P₁", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "x2", label: "x-Koordinate von P₂", unit: "", min: -6, max: 6, step: 1, value: -1 },
      { type: "range", key: "y2", label: "y-Koordinate von P₂", unit: "", min: -6, max: 6, step: 1, value: 2 },
    ],
    readouts: [
      { key: "m1", label: "Steigung m₁", compute: (v) => (v.x1 === 0 ? (v.y1 === 0 ? "P₁ = O" : "keine (y-Achse)") : ratioApprox(ratio(v.y1, v.x1))) },
      { key: "m2", label: "Steigung m₂", compute: (v) => (v.x2 === 0 ? (v.y2 === 0 ? "P₂ = O" : "keine (y-Achse)") : ratioApprox(ratio(v.y2, v.x2))) },
      {
        key: "produkt",
        label: "m₁ · m₂",
        emphasis: true,
        compute: (v) => (v.x1 === 0 || v.x2 === 0 ? "nicht berechenbar" : ratioApprox(product(ratio(v.y1, v.x1), ratio(v.y2, v.x2)))),
      },
      {
        key: "winkel",
        label: "Winkel zwischen g₁ und g₂",
        unit: "°",
        digits: 1,
        compute: (v) => angleBetweenLines(v.x1, v.y1, v.x2, v.y2) ?? "keiner",
      },
    ],
    goals: [
      {
        id: "m-zwei",
        text: "Stelle g₁ mit der Steigung m₁ = 2 ein und g₂ senkrecht dazu. Welche Steigung hat g₂?",
        check: (v) => v.x1 !== 0 && v.y1 === 2 * v.x1 && perpendicularPair(v),
      },
      {
        id: "bruch",
        text: "Finde zwei zueinander senkrechte Geraden, deren Steigungen beide keine ganzen Zahlen sind. Was ergibt m₁ · m₂?",
        check: (v) => perpendicularPair(v) && v.y1 % v.x1 !== 0 && v.y2 % v.x2 !== 0,
      },
      {
        id: "achse",
        text: "Lege g₁ auf die x-Achse und g₂ senkrecht dazu. Warum lässt sich m₁ · m₂ jetzt nicht berechnen?",
        check: (v) => v.y1 === 0 && v.x1 !== 0 && v.x2 === 0 && v.y2 !== 0,
      },
    ],
  },
  exercises: [
    {
      id: "senkrecht-m",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r1 = rng.pick(PERP_SLOPES);
          const r2 = negativeReciprocal(r1);
          const k = r2[1] * rng.pick([1, 2, 3].filter((n) => r2[1] * n <= 8)) * rng.pick([-1, 1]);
          const yk = value(r2) * k;
          return {
            prompt: `Die Ursprungsgerade g hat die Steigung m₁ = ${ratioHtml(r1)}. Bestimme die Steigung m₂ der zu g senkrechten Ursprungsgeraden h und den y-Wert von h an der Stelle x = ${fmt(k)}.`,
            given: [`g: ${lineHtml(r1)}`],
            formulaHint: "m₁ · m₂ = −1, also m₂ = −1 : m₁ (negativer Kehrwert)",
            fields: [
              numberField("m₂ =", value(r2), "", 2, {
                slips: [
                  { value: r1[1] / r1[0], hint: "Das ist nur der Kehrwert. Senkrecht heißt negativer Kehrwert: Auch das Vorzeichen dreht sich um." },
                  { value: -value(r1), hint: "Nur das Vorzeichen geändert: Bilde auch den Kehrwert." },
                ],
              }),
              numberField(`y(${fmt(k)}) =`, yk, "", 2),
            ],
            steps: [
              `m₂ = −1 : m₁ = −1 : ${ratioFactor(r1)} = ${ratioHtml(r2)}${approxTail(r2)}`,
              `Probe: ${ratioFactor(r1)} · ${ratioFactor(r2)} = −1. h: ${lineHtml(r2)}`,
              `y(${fmt(k)}) = ${ratioFactor(r2)} · ${paren(k)} = ${fmt(yk)}`,
              `<strong>m₂ = ${ratioHtml(r2)}; y(${fmt(k)}) = ${fmt(yk)}</strong>`,
            ],
            meta: { p1: r1[0], q1: r1[1], k },
          };
        }
        let a = 0;
        let b = 0;
        do {
          a = nonzero(rng, 6);
          b = nonzero(rng, 6);
        } while (Math.abs(a) === Math.abs(b) && rng.next() < 0.7);
        const g = Math.abs(gcdInt(a, b));
        const rg = ratio(b, a);
        const rh = negativeReciprocal(rg);
        const s = nonzero(rng, 2);
        const mode = rng.int(0, 2);
        // mode 0: Q on h; 1: Q on g instead; 2: Q one step beside h
        const Q = mode === 0 ? { x: (-b / g) * s, y: (a / g) * s } : mode === 1 ? { x: (a / g) * s, y: (b / g) * s } : { x: (-b / g) * s, y: (a / g) * s + 1 };
        const onH = Math.abs(value(rh) * Q.x - Q.y) < 1e-9;
        const xR = rh[1] * rng.pick([1, 2]) * rng.pick([-1, 1]);
        const yR = value(rh) * xR;
        return {
          prompt: `Die Ursprungsgerade g verläuft durch den Punkt P(${fmt(a)} | ${fmt(b)}). Die Ursprungsgerade h steht senkrecht auf g. Bestimme die Gleichung von h, prüfe, ob Q(${fmt(Q.x)} | ${fmt(Q.y)}) auf h liegt, und berechne die y-Koordinate des Punktes R(${fmt(xR)} | y) auf h.`,
          given: [`P(${fmt(a)} | ${fmt(b)}) auf g`, `Q(${fmt(Q.x)} | ${fmt(Q.y)})`],
          fields: [
            numberField("m<sub>h</sub> =", value(rh), "", 2, {
              slips: [
                { value: value(rg), hint: "Das ist die Steigung von g. Für h brauchst du den negativen Kehrwert." },
                { value: -value(rg), hint: "Nur das Vorzeichen geändert: Bilde auch den Kehrwert." },
                { value: a / b, hint: "Kehrwert ja, aber das Vorzeichen muss sich umdrehen." },
              ],
            }),
            choiceField("Liegt Q auf h?", ["ja", "nein"], onH ? 0 : 1),
            numberField("y<sub>R</sub> =", yR, "", 2),
          ],
          steps: [
            `m<sub>g</sub> = ${fmt(b)} : ${paren(a)} = ${ratioHtml(rg)}${approxTail(rg)}`,
            `m<sub>h</sub> = −1 : m<sub>g</sub> = ${ratioHtml(rh)}${approxTail(rh)}, also h: ${lineHtml(rh)}`,
            `Punktprobe: ${ratioFactor(rh)} · ${paren(Q.x)} = ${fmt(value(rh) * Q.x)}${onH ? " = y<sub>Q</sub>" : ` ≠ ${fmt(Q.y)}`}${mode === 1 ? " (Q liegt auf g, nicht auf h)" : ""}`,
            `y<sub>R</sub> = ${ratioFactor(rh)} · ${paren(xR)} = ${fmt(yR)}`,
            `<strong>h: ${lineHtml(rh)}; Q liegt ${onH ? "auf" : "nicht auf"} h; R(${fmt(xR)} | ${fmt(yR)})</strong>`,
          ],
          meta: { a, b, qx: Q.x, qy: Q.y, xR },
        };
      },
    },
    {
      id: "pruefen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r1 = rng.pick(PERP_SLOPES);
          const perp = rng.next() < 0.5;
          const lures = [ratio(r1[1], r1[0]), ratio(-r1[0], r1[1]), ratio(-2 * r1[1], r1[0]), ratio(-r1[1], 2 * r1[0])].filter((r) => {
            const pr = product(r1, r);
            return !(pr[0] === -1 && pr[1] === 1) && !(r[0] === r1[0] && r[1] === r1[1]);
          });
          const r2 = perp ? negativeReciprocal(r1) : rng.pick(lures);
          const pr = product(r1, r2);
          const ortho = pr[0] === -1 && pr[1] === 1;
          return {
            prompt: `Stehen die Geraden g: ${lineHtml(r1)} und h: ${lineHtml(r2)} senkrecht aufeinander? Berechne das Produkt der Steigungen.`,
            given: [`m₁ = ${ratioHtml(r1)}`, `m₂ = ${ratioHtml(r2)}`],
            formulaHint: "g ⊥ h ⇔ m₁ · m₂ = −1",
            fields: [numberField("m₁ · m₂ =", value(pr), "", 2), choiceField("senkrecht?", ["ja", "nein"], ortho ? 0 : 1)],
            steps: [`m₁ · m₂ = ${ratioFactor(r1)} · ${ratioFactor(r2)} = ${ratioHtml(pr)}${approxTail(pr)}`, ortho ? "Das Produkt ist −1." : "Das Produkt ist nicht −1.", `<strong>m₁ · m₂ = ${ratioHtml(pr)}: ${ortho ? "senkrecht" : "nicht senkrecht"}</strong>`],
            meta: { p1: r1[0], q1: r1[1], p2: r2[0], q2: r2[1] },
          };
        }
        let A = { x: 0, y: 0 };
        let B = { x: 0, y: 0 };
        let perp = false;
        do {
          A = { x: nonzero(rng, 8), y: nonzero(rng, 8) };
          const g = Math.abs(gcdInt(A.x, A.y));
          const s = nonzero(rng, 2) * rng.pick([1, 2]);
          perp = rng.next() < 0.5;
          B = perp ? { x: (-A.y / g) * s, y: (A.x / g) * s } : rng.next() < 0.5 ? { x: (A.y / g) * s, y: (A.x / g) * s } : { x: (-A.y / g) * s + rng.pick([-1, 1]), y: (A.x / g) * s };
        } while (B.x === 0 || B.y === 0 || Math.abs(B.x) > 10 || Math.abs(B.y) > 10 || (A.x * B.x + A.y * B.y === 0) !== perp);
        const rg = ratio(A.y, A.x);
        const rh = ratio(B.y, B.x);
        const pr = product(rg, rh);
        return {
          prompt: `Zwei gerade Wege in einem Park beginnen am Brunnen O(0 | 0). Der eine führt zum Kiosk K(${fmt(A.x)} | ${fmt(A.y)}), der andere zur Bank B(${fmt(B.x)} | ${fmt(B.y)}) (Koordinaten in m). Stehen die Wege senkrecht aufeinander? Bestimme dazu die Steigungen der beiden Ursprungsgeraden.`,
          given: [`K(${fmt(A.x)} | ${fmt(A.y)})`, `B(${fmt(B.x)} | ${fmt(B.y)})`],
          fields: [numberField("m<sub>OK</sub> =", value(rg), "", 2), numberField("m<sub>OB</sub> =", value(rh), "", 2), choiceField("senkrecht?", ["ja", "nein"], perp ? 0 : 1)],
          steps: [
            `m<sub>OK</sub> = ${fmt(A.y)} : ${paren(A.x)} = ${ratioHtml(rg)}${approxTail(rg)}; m<sub>OB</sub> = ${fmt(B.y)} : ${paren(B.x)} = ${ratioHtml(rh)}${approxTail(rh)}`,
            `m<sub>OK</sub> · m<sub>OB</sub> = ${ratioFactor(rg)} · ${ratioFactor(rh)} = ${ratioHtml(pr)}${approxTail(pr)}`,
            `<strong>${perp ? "Das Produkt ist −1: Die Wege stehen senkrecht aufeinander." : "Das Produkt ist nicht −1: Die Wege stehen nicht senkrecht aufeinander."}</strong>`,
          ],
          meta: { ax: A.x, ay: A.y, bx: B.x, by: B.y },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst senkrechte Geraden an m₁ · m₂ = −1 und bildest den negativen Kehrwert.",
};

/** The gcd of two whole numbers with its sign dropped. */
function gcdInt(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

// 6.6 Geraden y = mx + t ─────────────────────────────────────────────────────

const SLOPES_66: Ratio[] = [[1, 2], [-1, 2], [1, 3], [-1, 3], [2, 3], [-2, 3], [3, 4], [-3, 4], [1, 1], [-1, 1], [2, 1], [-2, 1], [3, 1], [-3, 1], [3, 2], [-3, 2], [1, 4], [-1, 4]];

/** A line y = m x + t with a whole t (1 ≤ |t| ≤ 6) and a Nullstelle that is a multiple of 0,5. */
function lineWithZero(rng: Rng): { r: Ratio; t: number; x0: number } {
  for (;;) {
    const r = rng.pick(SLOPES_66);
    const x0 = rng.int(-12, 12) / 2;
    const t = -value(r) * x0 + 0;
    if (x0 !== 0 && Number.isInteger(Math.round(t * 1e9) / 1e9) && Math.abs(t) >= 1 && Math.abs(t) <= 6) return { r, t: Math.round(t), x0 };
  }
}

/** "3 nach rechts, 2 nach oben" and the two tempting wrong readings. */
function triangleWords(r: Ratio): { right: string; wrong: string[] } {
  const q = r[1];
  const p = Math.abs(r[0]);
  const dir = r[0] > 0 ? "oben" : "unten";
  const other = r[0] > 0 ? "unten" : "oben";
  return {
    right: `${q} nach rechts, ${p} nach ${dir}`,
    wrong: [`${q} nach rechts, ${p} nach ${other}`, p !== q ? `${p} nach rechts, ${q} nach ${dir}` : `${q} nach rechts, ${2 * p} nach ${dir}`],
  };
}

const geraden: Lesson = {
  id: "fu-6-geraden",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "6.6 Geraden y = mx + t",
  subtitle: "Steigung m und y-Achsenabschnitt t",
  tracks: ["I"],
  lehrplan: "M8 LB 6 (I): Geraden y = mx + t",
  whyItMatters:
    "Fast jede lineare Sachaufgabe führt auf eine Gerade y = mx + t: ein Anfangswert t und eine gleichmäßige Änderung m. Wer m und t im Graphen sieht, zeichnet die Gerade in Sekunden und liest ihre Gleichung ab.",
  explanationHtml: `
    <p>Bisher gingen alle Geraden durch den Ursprung. Verschiebst du die Ursprungsgerade y = mx um t Einheiten längs der y-Achse (für t &gt; 0 nach oben, für t &lt; 0 nach unten), entsteht die Gerade</p>
    <p class="formula-line"><strong>g: y = mx + t</strong> &nbsp;bzw.&nbsp; f(x) = mx + t, D = ℚ</p>
    <p>Eine Funktion mit einer solchen Gleichung heißt <strong>lineare Funktion</strong>, ihr Graph ist eine Gerade. Die beiden Parameter haben eine feste Bedeutung:</p>
    <ul>
      <li><strong>m ist die Steigung:</strong> m = Δy : Δx. Gehst du 1 nach rechts, ändert sich y um m. Das Verschieben ändert die Steigung nicht, alle Geraden y = 2x + t verlaufen parallel.</li>
      <li><strong>t ist der y-Achsenabschnitt:</strong> Für x = 0 ist y = m · 0 + t = t. Die Gerade schneidet die y-Achse im Punkt (0 | t).</li>
    </ul>
    <p><strong>Zeichnen:</strong> Markiere (0 | t) auf der y-Achse und trage von dort aus das Steigungsdreieck ab. <strong>Ablesen:</strong> t liest du am Schnittpunkt mit der y-Achse ab, m an einem Steigungsdreieck zwischen zwei Gitterpunkten der Geraden. <strong>Nullstelle:</strong> mx + t = 0 ⇔ x₀ = −t : m (für m ≠ 0).</p>
    <div class="example"><strong>Beispiel:</strong> g: y = −0,5x + 3.
      <ul class="steps">
        <li>t = 3: g schneidet die y-Achse in (0 | 3).</li>
        <li>m = −0,5 = −${frac(1, 2)}: Von (0 | 3) aus 2 nach rechts und 1 nach unten, so erreichst du (2 | 2). Die Gerade durch beide Punkte ist g; sie fällt.</li>
        <li>Nullstelle: −0,5x + 3 = 0 ⇔ 0,5x = 3 ⇔ x₀ = 6, also N(6 | 0).</li>
      </ul></div>
    <p><strong>Sonderfälle achsenparalleler Geraden:</strong></p>
    <ul>
      <li>m = 0: y = t ist eine Parallele zur x-Achse und eine <strong>konstante Funktion</strong>. Für t ≠ 0 hat sie keine Nullstelle.</li>
      <li>x = c ist eine Parallele zur y-Achse durch (c | 0). Sie hat keine Steigung und ist <strong>kein Graph einer Funktion</strong>, denn zur Stelle c gehören unendlich viele y-Werte (Graphen-Test aus Lektion 6.1).</li>
    </ul>
    <p>Typische Fehler: t mit der Nullstelle verwechseln, beim Zeichnen im Ursprung statt bei (0 | t) beginnen und die Gerade x = 3 mit y = 3 verwechseln.</p>
    <div class="merke"><strong>Merke:</strong> y = mx + t ist eine Gerade mit der Steigung m und dem y-Achsenabschnitt t; sie schneidet die y-Achse in (0 | t). y = t ist parallel zur x-Achse, x = c ist parallel zur y-Achse und keine Funktion.</div>
  `,
  formulas: [
    { name: "Gerade", html: "y = mx + t", quantities: "m Steigung (m = Δy : Δx), t y-Achsenabschnitt; Schnitt mit der y-Achse in (0 | t)" },
    { name: "Nullstelle", html: "x₀ = −t : m", quantities: "aus mx + t = 0, für m ≠ 0" },
    { name: "Achsenparallele Geraden", html: "y = t (parallel zur x-Achse); x = c (parallel zur y-Achse)", quantities: "x = c ist kein Graph einer Funktion" },
  ],
  quiz: {
    question: "Welche Gerade schneidet die y-Achse in (0 | −2) und fällt?",
    options: ["y = −2x + 3", "y = 3x − 2", "y = −3x − 2", "y = −2"],
    correctIndex: 2,
    explanation: "t = −2 ist der y-Achsenabschnitt, also kommen nur y = 3x − 2 und y = −3x − 2 in Frage; fallen tut nur die mit m = −3 < 0. y = −2x + 3 schneidet die y-Achse bei 3, und y = −2 ist waagrecht.",
  },
  lab: {
    kind: "line-mx-t",
    title: "Labor: Steigung und y-Achsenabschnitt",
    intro:
      "Stelle m und t ein oder ziehe die Punkte: Der blaue sitzt auf der y-Achse bei (0 | t), der orange ist die Spitze des Steigungsdreiecks (1 nach rechts, m nach oben). Grau gestrichelt ist die Ursprungsgerade y = mx.",
    params: [
      { type: "range", key: "m", label: "Steigung m", unit: "", min: -3, max: 3, step: 0.25, value: 1.5, digits: 2 },
      { type: "range", key: "t", label: "y-Achsenabschnitt t", unit: "", min: -5, max: 5, step: 0.5, value: -3, digits: 1 },
    ],
    readouts: [
      { key: "gl", label: "Gleichung", emphasis: true, compute: (v) => `y = ${linear(v.m, v.t)}` },
      { key: "achse", label: "Schnittpunkt mit der y-Achse", compute: (v) => point(0, v.t) },
      { key: "null", label: "Nullstelle", compute: (v) => zeroOfLine(v.m, v.t) },
    ],
    goals: [
      {
        id: "zwei-punkte",
        text: `Lege die Gerade durch die Punkte A(${fmt(LINE_TARGETS[0].x)} | ${fmt(LINE_TARGETS[0].y)}) und B(${fmt(LINE_TARGETS[1].x)} | ${fmt(LINE_TARGETS[1].y)}). Lies ihre Steigung und ihren y-Achsenabschnitt ab.`,
        check: (v) => LINE_TARGETS.slice(0, 2).every((p) => Math.abs(v.m * p.x + v.t - p.y) < 1e-9),
      },
      {
        id: "parallele-x",
        text: `Stelle die Parallele zur x-Achse durch C(${fmt(LINE_TARGETS[2].x)} | ${fmt(LINE_TARGETS[2].y)}) ein. Welche Steigung hat sie, und hat sie eine Nullstelle?`,
        check: (v) => v.m === 0 && v.t === LINE_TARGETS[2].y,
      },
      {
        id: "nullstelle-vier",
        text: "Finde eine fallende Gerade mit der Nullstelle x₀ = 4, deren y-Achsenabschnitt eine ganze Zahl ist. Wie hängen m und t dann zusammen?",
        check: (v) => v.m < 0 && Math.abs(4 * v.m + v.t) < 1e-9 && Number.isInteger(v.t),
      },
    ],
  },
  exercises: [
    {
      id: "zeichnen",
      make: (rng, level): ExerciseTask => {
        const { r, t, x0 } = lineWithZero(rng);
        const m = value(r);
        if (level === 1) {
          const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((x) => x !== x0));
          const words = triangleWords(r);
          const g = `g: ${lineHtml(r, t)}`;
          return {
            prompt: `Gegeben ist die Gerade ${g}. Wie zeichnest du das Steigungsdreieck vom Punkt (0 | ${fmt(t)}) aus? Berechne außerdem den Funktionswert an der Stelle x = ${fmt(a)} und die Nullstelle.`,
            given: [g],
            formulaHint: "Start bei (0 | t), dann das Steigungsdreieck: m = Δy : Δx. Nullstelle: x₀ = −t : m.",
            fields: [
              shuffledChoice(rng, "Steigungsdreieck ab (0 | t)", words.right, words.wrong),
              numberField(`f(${fmt(a)}) =`, m * a + t, "", 2),
              numberField("x₀ =", x0, "", 2, {
                slips: [
                  { value: t / m, hint: "Vorzeichen: Aus mx + t = 0 folgt mx = −t, also x₀ = −t : m." },
                  { value: t, hint: "t ist der Schnittpunkt mit der y-Achse, nicht die Nullstelle. Setze y = 0." },
                ],
              }),
            ],
            steps: [
              `t = ${fmt(t)}: Start im Punkt (0 | ${fmt(t)}). m = ${ratioHtml(r)}: ${words.right}.`,
              `f(${fmt(a)}) = ${ratioFactor(r)} · ${paren(a)}${term(t, "", false)} = ${fmt(m * a + t)}`,
              `${lineHtml(r, t).slice(4)} = 0 ⇔ ${ratioHtml(r) === "1" ? "" : ratioFactor(r) + " · "}x = ${fmt(-t)} ⇔ x₀ = ${fmt(-t)} : ${ratioFactor(r)} = ${fmt(x0)}`,
              `<strong>${words.right}; f(${fmt(a)}) = ${fmt(m * a + t)}; x₀ = ${fmt(x0)}</strong>`,
            ],
            meta: { p: r[0], q: r[1], t, a, x0 },
          };
        }
        const decimalWords = [1, 2, 4].includes(r[1]) && rng.next() < 0.4;
        const rises = m > 0;
        const description = decimalWords
          ? `Eine Gerade g schneidet die y-Achse bei ${fmt(t)}. Pro Einheit nach rechts ${rises ? "steigt" : "fällt"} sie um ${fmt(Math.abs(m))}.`
          : `Eine Gerade g schneidet die y-Achse im Punkt (0 | ${fmt(t)}). Geht man auf g ${r[1]} ${r[1] === 1 ? "Einheit" : "Einheiten"} nach rechts, ${rises ? "steigt" : "fällt"} sie um ${Math.abs(r[0])} ${Math.abs(r[0]) === 1 ? "Einheit" : "Einheiten"}.`;
        return {
          prompt: `${description} Bestimme die Gleichung von g und die Nullstelle von g.`,
          given: [decimalWords ? `Δx = 1, Δy = ${fmt(m)}` : `Δx = ${r[1]}, Δy = ${rises ? "" : "−"}${Math.abs(r[0])}`],
          fields: [
            numberField("m =", m, "", 2, { slips: [{ value: -m, hint: rises ? "Steigt die Gerade, ist m positiv." : "Fällt die Gerade, ist m negativ." }, { value: r[1] / r[0], hint: "m = Δy : Δx, nicht Δx : Δy." }] }),
            numberField("t =", t, "", 2),
            numberField("x₀ =", x0, "", 2, { slips: [{ value: t / m, hint: "Vorzeichen: x₀ = −t : m." }] }),
          ],
          steps: [
            `m = Δy : Δx = ${ratioHtml(r)}${approxTail(r)}; der Schnittpunkt mit der y-Achse liefert t = ${fmt(t)}.`,
            `g: ${lineHtml(r, t)}`,
            `${lineHtml(r, t).slice(4)} = 0 ⇔ x₀ = −${paren(t)} : ${ratioFactor(r)} = ${fmt(x0)}`,
            `<strong>g: ${lineHtml(r, t)}; x₀ = ${fmt(x0)}</strong>`,
          ],
          meta: { p: r[0], q: r[1], t, x0, decimal: decimalWords ? 1 : 0 },
        };
      },
    },
    {
      id: "ablesen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.6) {
            const t = nonzero(rng, 6);
            const x0 = nonzero(rng, 6);
            const r = ratio(-t, x0);
            return {
              prompt: `Der Graph einer linearen Funktion schneidet die y-Achse im Punkt (0 | ${fmt(t)}) und die x-Achse im Punkt (${fmt(x0)} | 0). Bestimme m und t und gib die Funktionsgleichung an.`,
              given: [`(0 | ${fmt(t)})`, `(${fmt(x0)} | 0)`],
              formulaHint: "t ist der y-Wert bei x = 0; m = Δy : Δx zwischen den beiden Punkten.",
              fields: [
                numberField("m =", value(r), "", 2, { slips: [{ value: x0 / -t, hint: "m = Δy : Δx, nicht Δx : Δy." }, { value: -value(r), hint: "Prüfe das Vorzeichen: Von (0 | t) zur Nullstelle geht es nach rechts oder links und nach oben oder unten." }] }),
                numberField("t =", t, "", 2, { slips: [{ value: x0, hint: "Die Nullstelle ist nicht t: t ist der Schnittpunkt mit der y-Achse." }] }),
              ],
              steps: [
                `t = ${fmt(t)}, denn die Gerade geht durch (0 | ${fmt(t)}).`,
                `Von (0 | ${fmt(t)}) nach (${fmt(x0)} | 0): Δx = ${fmt(x0)}, Δy = ${fmt(-t)}, also m = ${fmt(-t)} : ${paren(x0)} = ${ratioHtml(r)}${approxTail(r)}.`,
                `<strong>m = ${ratioHtml(r)}, t = ${fmt(t)}: ${lineHtml(r, t)}</strong>`,
              ],
              meta: { variant: 0, t, x0 },
            };
          }
          const a = nonzero(rng, 5);
          const b = nonzero(rng, 5);
          if (rng.next() < 0.5) {
            return {
              prompt: `Gib die Gleichung der Parallelen zur x-Achse durch den Punkt P(${fmt(a)} | ${fmt(b)}) in der Form y = mx + t an.`,
              given: [`P(${fmt(a)} | ${fmt(b)})`],
              formulaHint: "Eine Parallele zur x-Achse hat die Steigung 0: y = t.",
              fields: [numberField("m =", 0, "", 2), numberField("t =", b, "", 2, { slips: [{ value: a, hint: "Parallel zur x-Achse heißt: y ist überall gleich, nämlich die y-Koordinate von P." }] })],
              steps: ["Parallel zur x-Achse: Die Gerade steigt nicht, m = 0.", `Alle Punkte haben dieselbe y-Koordinate wie P, also t = ${fmt(b)}.`, `<strong>y = ${fmt(b)} (m = 0, t = ${fmt(b)})</strong>`],
              meta: { variant: 1, a, b },
            };
          }
          return {
            prompt: `Gib die Gleichung der Parallelen zur y-Achse durch den Punkt P(${fmt(a)} | ${fmt(b)}) an. Ist diese Gerade der Graph einer Funktion?`,
            given: [`P(${fmt(a)} | ${fmt(b)})`],
            formulaHint: "Eine Parallele zur y-Achse hat die Gleichung x = c; sie hat keine Steigung.",
            fields: [numberField("x =", a, "", 2, { slips: [{ value: b, hint: "Parallel zur y-Achse heißt: x ist überall gleich, nämlich die x-Koordinate von P." }] }), choiceField("Graph einer Funktion?", ["ja", "nein"], 1)],
            steps: [`Alle Punkte der Geraden haben die x-Koordinate ${fmt(a)}: x = ${fmt(a)}.`, `Zur Stelle ${fmt(a)} gehören unendlich viele y-Werte, der Graphen-Test schlägt fehl.`, `<strong>x = ${fmt(a)}; keine Funktion</strong>`],
            meta: { variant: 2, a, b },
          };
        }
        const { r, t, x0 } = lineWithZero(rng);
        const m = value(r);
        const a = r[1] * nonzero(rng, 2);
        const onLine = rng.next() < 0.5;
        const exact = m * a + t;
        const b = onLine ? exact : exact + rng.pick([-1, 1]);
        return {
          prompt: `Die Ursprungsgerade h: ${lineHtml(r)} wird um ${Math.abs(t)} ${Math.abs(t) === 1 ? "Einheit" : "Einheiten"} nach ${t > 0 ? "oben" : "unten"} verschoben; so entsteht die Gerade g. Gib den y-Achsenabschnitt von g an, berechne die Nullstelle von g und prüfe, ob P(${fmt(a)} | ${fmt(b)}) auf g liegt.`,
          given: [`h: ${lineHtml(r)}`, `${Math.abs(t)} nach ${t > 0 ? "oben" : "unten"}`],
          fields: [
            numberField("t =", t, "", 2, { slips: [{ value: -t, hint: t > 0 ? "Nach oben verschieben heißt: t ist positiv." : "Nach unten verschieben heißt: t ist negativ." }] }),
            numberField("x₀ =", x0, "", 2, { slips: [{ value: t / m, hint: "Vorzeichen: x₀ = −t : m." }, { value: 0, hint: "Die Ursprungsgerade hat die Nullstelle 0, die verschobene Gerade nicht mehr." }] }),
            choiceField("Liegt P auf g?", ["ja", "nein"], onLine ? 0 : 1),
          ],
          steps: [
            `Verschieben längs der y-Achse ändert nur t: g: ${lineHtml(r, t)}, also t = ${fmt(t)}.`,
            `${lineHtml(r, t).slice(4)} = 0 ⇔ x₀ = −${paren(t)} : ${ratioFactor(r)} = ${fmt(x0)}`,
            `Punktprobe: ${ratioFactor(r)} · ${paren(a)}${term(t, "", false)} = ${fmt(exact)}${onLine ? " = y<sub>P</sub>" : ` ≠ ${fmt(b)}`}`,
            `<strong>t = ${fmt(t)}; x₀ = ${fmt(x0)}; P liegt ${onLine ? "auf" : "nicht auf"} g</strong>`,
          ],
          meta: { p: r[0], q: r[1], t, x0, a, b },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest m und t an jeder Geraden ab und kennst die Sonderfälle y = t und x = c.",
};

export const STAGE_FUNKTIONEN: Stage = {
  id: "stage-6-funktionen",
  stageNumber: 6,
  title: "Funktionen",
  subtitle: "Eindeutige Zuordnungen, Darstellungen, Geraden und ihre Gleichungen",
  icon: "📈",
  accent: "#059669",
  badgeTitle: "Graphenleser",
  lehrplanLabel: "LB 6 (I) · LB 5 (II/III)",
  lessons: [funktionOderNicht, darstellungen, werteNullstellen, ursprungsgeraden, senkrecht, geraden],
};
