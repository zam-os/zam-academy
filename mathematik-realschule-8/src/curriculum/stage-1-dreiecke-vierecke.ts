import { fmt, fmtUnit, frac } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  CASES,
  cmText,
  congruenceResult,
  conStep,
  constructionApexes,
  constructionSteps,
  deg,
  existenceTriangle,
  legDistance,
  measure,
  oppositeText,
  sideCheck,
  ssaLengths,
  anglesText,
  diagonalsText,
  familyPoints,
  FREEHAND_START,
  problemAngles,
  problemArea,
  quadInfo,
  redrawFreehand,
  sidesText,
  symmetryText,
  withArticle,
  ZUG_FIGURES,
  ZUG_START,
  zugConstructionText,
  zugKeeps,
  zugPoints,
} from "../lab/views-dreiecke-vierecke";
import type { AnswerField, ChoiceField, ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { choiceField, numberField, sinD } from "./helpers";

const STAGE_ID = "stage-1-dreiecke-vierecke";
const II = "M8 LB 1 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

const cm = (value: number, digits = 1): string => fmtUnit(value, "cm", digits);

/** U+202F, the narrow no-break space between groups of digits. */
const NARROW_SPACE = String.fromCharCode(0x202f);

/**
 * A large number as German textbooks write Maßstäbe and lengths: four digits
 * ungrouped ("1 : 1000", "3500 cm"), from five digits in groups of three with
 * a narrow no-break space ("1 : 25 000"), never "1.000".
 */
const big = (value: number, digits = 2): string => {
  const text = fmt(value, digits);
  return Math.abs(value) < 10000 ? text.replace(/\./g, "") : text.replace(/\./g, NARROW_SPACE);
};

/** A choice whose options are shuffled; the right one is found again by its text. */
function shuffledChoice(rng: Rng, label: string, correct: string, wrong: string[]): ChoiceField {
  const options = rng.shuffle([correct, ...wrong.filter((w, i, all) => w !== correct && all.indexOf(w) === i)]);
  return choiceField(label, options, options.indexOf(correct));
}

/** Draws until `ok` holds, at most 200 times; then the known-good fallback. */
function draw<T>(make: () => T, ok: (value: T) => boolean, fallback: T): T {
  for (let i = 0; i < 200; i++) {
    const value = make();
    if (ok(value)) return value;
  }
  return fallback;
}

/** A multiple of `step` between min and max (both multiples of step). */
const multiple = (rng: Rng, min: number, max: number, step: number): number => rng.int(min / step, max / step) * step;

/** "a, b und c" */
function listText(items: string[]): string {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

/** A segment name with its letters in alphabetical order: pair("C", "A") is "AC". */
const pair = (p: string, q: string): string => (p < q ? `${p}${q}` : `${q}${p}`);

/** "<", "=" or ">" as HTML entity between two values. */
const relHtml = (x: number, y: number): string => (Math.abs(x - y) < 1e-9 ? "=" : x < y ? "&lt;" : "&gt;");

// Names in a triangle ABC: side i lies opposite vertex i, angle i sits at vertex i.
const VERTEX = ["A", "B", "C"];
const SIDE = ["a", "b", "c"];
const GREEK = ["α", "β", "γ"];

/** The letters of a triangle with its names rotated by r (r = 1: a ↦ b, α ↦ β, A ↦ B). */
function letters(r: number) {
  const at = (i: number) => (i + r) % 3;
  return {
    v: (i: number) => VERTEX[at(i)],
    s: (i: number) => SIDE[at(i)],
    w: (i: number) => GREEK[at(i)],
  };
}

// 1.1 Wann es ein Dreieck gibt ─────────────────────────────────────────────

export const EXIST_OPTIONS = ["ja", "nein: Die Summe ist kleiner als die längste Seite.", "nein: Die Summe ist genau so lang wie die längste Seite."];

/** The three range contexts of 1.1, Level 2: the unit, the name of the third length and the field labels. */
export const RANGE_CONTEXTS = [
  { unit: "dm", name: "x", labels: ["Leiste x mindestens:", "Leiste x höchstens:", "Anzahl der Längen:"] },
  { unit: "km", name: "AC", labels: ["kleinste Entfernung AC:", "größte Entfernung AC:", "Anzahl:"] },
  { unit: "cm", name: "c", labels: ["kleinstes c:", "größtes c:", "Anzahl:"] },
];

function existenceReadout(v: LabValues): string {
  if (v.view === 1) {
    const sum = v.alpha + v.beta;
    return sum < 180 ? "ja: α + β < 180°" : sum === 180 ? "nein: α + β = 180°, die Schenkel sind parallel" : "nein: α + β > 180°";
  }
  const check = sideCheck(v.a, v.b, v.c);
  return check.meet === "two" ? "ja: längste Seite kürzer als die Summe der anderen" : check.meet === "touch" ? "nein: Summe gleich der längsten Seite" : "nein: Summe kleiner als die längste Seite";
}

const dreiecksexistenz: Lesson = {
  id: "dv-1-dreiecksexistenz",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Wann es ein Dreieck gibt",
  subtitle: "Die Dreiecksungleichung und der größte Winkel gegenüber der längsten Seite",
  tracks: ["II_III"],
  lehrplan: `${II}: Existenz von Dreiecken`,
  whyItMatters:
    "Ob drei Stäbe, drei Wege oder drei Messwerte ein Dreieck ergeben, entscheidest du mit einem einzigen Vergleich, ohne zu zeichnen. Die Beziehung zwischen Seiten und Winkeln brauchst du bei jeder Dreieckskonstruktion und bei den Kongruenzsätzen.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5 und M7:</strong> Im Dreieck ABC liegt die Seite a = [BC] der Ecke A gegenüber, b = [CA] der Ecke B und c = [AB] der Ecke C. Die Winkel heißen α (bei A), β (bei B) und γ (bei C), und ihre Summe ist immer 180°.</p>
    <p><strong>Die Dreiecksungleichung.</strong> Der direkte Weg von A nach B ist kürzer als der Umweg über C. Deshalb ist in jedem Dreieck jede Seite kürzer als die Summe der beiden anderen:</p>
    <p class="formula-line">a + b &gt; c, &nbsp; a + c &gt; b, &nbsp; b + c &gt; a</p>
    <p>Du musst nicht alle drei Ungleichungen prüfen: Es genügt, die <strong>längste Seite</strong> mit der Summe der beiden anderen zu vergleichen. Die Zirkelprobe zeigt, warum. Du zeichnest [AB] und schlägst um A einen Kreis mit dem Radius b und um B einen mit dem Radius a. Nur wo sich die Kreise schneiden, kann C liegen.</p>
    <ul>
      <li>a + b &gt; c (c ist die längste Seite): Die Kreise schneiden sich, es gibt ein Dreieck.</li>
      <li>a + b = c: Die Kreise berühren sich auf [AB]. C liegt auf der Strecke, A, B und C liegen auf einer Geraden: <strong>kein</strong> Dreieck.</li>
      <li>a + b &lt; c: Zwischen den Kreisen bleibt eine Lücke: kein Dreieck.</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Gibt es ein Dreieck mit den Seiten 4 cm, 7 cm und 12 cm? Die längste Seite ist 12 cm, und 4 cm + 7 cm = 11 cm &lt; 12 cm: kein Dreieck. Mit 4 cm, 7 cm und 10 cm geht es, denn 11 cm &gt; 10 cm.<br>Welche Längen kann die dritte Seite c haben, wenn a = 4 cm und b = 7 cm sind? c muss kürzer sein als 4 cm + 7 cm = 11 cm. Außerdem darf b nicht die zu lange Seite werden: 4 cm + c &gt; 7 cm, also c &gt; 3 cm. Es gilt 3 cm &lt; c &lt; 11 cm; in ganzen Zentimetern sind das 4 cm, 5 cm, …, 10 cm, also 10 − 4 + 1 = 7 Möglichkeiten.</div>
    <p><strong>Seiten und Winkel.</strong> Der längeren von zwei Seiten liegt der größere Winkel gegenüber, und umgekehrt. Die längste Seite liegt also dem größten Winkel gegenüber, die kürzeste dem kleinsten. Gleich lange Seiten liegen gleich großen Winkeln gegenüber: Im gleichschenkligen Dreieck sind die Basiswinkel gleich groß (Wiederholung aus M6), im gleichseitigen Dreieck sind alle drei Winkel 60° groß.</p>
    <p><strong>Winkel.</strong> Wegen α + β + γ = 180° ergeben zwei Winkel eines Dreiecks zusammen weniger als 180°. Ein Dreieck hat deshalb höchstens einen stumpfen oder rechten Winkel. Ist α + β = 180°, laufen die freien Schenkel in A und B parallel (Ergänzungswinkel aus M7) und treffen sich nie. Drei Winkel legen nur die Form fest, nicht die Größe: Ein Dreieck mit 50°, 60° und 70° gibt es klein und groß.</p>
    <p><strong>Typische Fehler:</strong> eine kürzere Seite mit der Summe vergleichen statt der längsten; a + b = c noch für ein Dreieck halten; den größten Winkel an der längsten Seite suchen statt ihr gegenüber.</p>
    <div class="merke"><strong>Merke:</strong> Ein Dreieck gibt es genau dann, wenn die längste Seite kürzer ist als die Summe der beiden anderen. Der größere Winkel liegt der längeren Seite gegenüber, gleich lange Seiten liegen gleich großen Winkeln gegenüber. Zwei Winkel eines Dreiecks ergeben zusammen weniger als 180°.</div>
  `,
  formulas: [
    { name: "Dreiecksungleichung", html: "a + b &gt; c, a + c &gt; b, b + c &gt; a", quantities: "Es genügt: längste Seite kürzer als die Summe der beiden anderen" },
    { name: "Bereich der dritten Seite", html: "b − a &lt; c &lt; a + b", quantities: "für zwei gegebene Seiten a ≤ b" },
    { name: "Innenwinkelsumme", html: "α + β + γ = 180°", quantities: "zwei Winkel zusammen kleiner als 180°" },
    { name: "Seiten und Winkel", html: "a &lt; b ⇔ α &lt; β; a = b ⇔ α = β", quantities: "die längste Seite liegt dem größten Winkel gegenüber" },
  ],
  quiz: {
    question: "Aus welchen drei Stäben lässt sich ein Dreieck legen?",
    options: ["3 cm, 4 cm und 8 cm", "5 cm, 5 cm und 10 cm", "4 cm, 6 cm und 9 cm", "2 cm, 9 cm und 6 cm"],
    correctIndex: 2,
    explanation:
      "Vergleiche immer die längste Seite mit der Summe der beiden anderen: 9 cm < 4 cm + 6 cm = 10 cm, das passt. Bei 5 cm, 5 cm und 10 cm ist die Summe genau so lang wie der längste Stab: Die Stäbe liegen flach aufeinander, ein Dreieck entsteht nicht.",
  },
  lab: {
    kind: "triangle-existence",
    title: "Labor: Die Zirkelprobe",
    intro:
      "Stelle die drei Seiten ein oder ziehe an B, an C und an den Punkten auf den Kreisen. Um A ist ein Kreis mit dem Radius b gezogen, um B einer mit dem Radius a: Nur wo sie sich schneiden, liegt C. Im zweiten Versuch sind c und die Winkel α und β gegeben.",
    params: [
      {
        type: "choice",
        key: "view",
        label: "Versuch",
        options: [
          { value: 0, label: "Drei Seiten: die Zirkelprobe" },
          { value: 1, label: "Eine Seite und zwei Winkel" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "Seite a = [BC] (Kreis um B)", unit: "cm", min: 1, max: 9, step: 0.5, value: 4, digits: 1, showIf: (v) => v.view === 0 },
      { type: "range", key: "b", label: "Seite b = [CA] (Kreis um A)", unit: "cm", min: 1, max: 9, step: 0.5, value: 3, digits: 1, showIf: (v) => v.view === 0 },
      { type: "range", key: "c", label: "Seite c = [AB]", unit: "cm", min: 2, max: 9, step: 0.5, value: 8, digits: 1 },
      { type: "range", key: "alpha", label: "Winkel α bei A", unit: "°", min: 10, max: 170, step: 5, value: 70, showIf: (v) => v.view === 1 },
      { type: "range", key: "beta", label: "Winkel β bei B", unit: "°", min: 10, max: 170, step: 5, value: 60, showIf: (v) => v.view === 1 },
    ],
    readouts: [
      { key: "dreieck", label: "Gibt es ein Dreieck?", emphasis: true, compute: existenceReadout },
      {
        key: "pruefung",
        label: "Prüfung",
        compute: (v) => {
          if (v.view === 1) return `α + β = ${deg(v.alpha + v.beta)}`;
          const check = sideCheck(v.a, v.b, v.c);
          return `längste Seite ${check.longest} = ${cmText(check.L)}, Summe der anderen ${cmText(check.S)}`;
        },
      },
      {
        key: "winkel",
        label: "Winkel",
        compute: (v) => {
          const t = existenceTriangle(v);
          if (!t) return "kein Dreieck";
          return v.view === 1 ? `γ = 180° − α − β = ${deg(180 - v.alpha - v.beta)}` : `α ≈ ${deg(t.alpha)}, β ≈ ${deg(t.beta)}, γ ≈ ${deg(t.gamma)} (gemessen)`;
        },
      },
      {
        key: "gegenueber",
        label: "Seiten und Winkel",
        compute: (v) => {
          const t = existenceTriangle(v);
          return t ? oppositeText(t) : "kein Dreieck";
        },
      },
    ],
    goals: [
      {
        id: "grenzfall",
        text: "Zirkelprobe: Stelle die Seiten so ein, dass sich die beiden Kreise gerade noch auf [AB] berühren. Welche Beziehung haben a, b und c dann?",
        check: (v) => v.view === 0 && Math.abs(v.a + v.b - v.c) < 1e-9,
      },
      {
        id: "gleichschenklig",
        text: "Baue ein gleichschenkliges Dreieck mit a = b, in dem der Winkel γ an der Spitze der größte Winkel ist. Welche Seite muss dafür die längste sein?",
        check: (v) => v.view === 0 && v.a === v.b && v.c > v.a && v.c < 2 * v.a,
      },
      {
        id: "parallel",
        text: "Eine Seite und zwei Winkel: Stelle α und β so ein, dass die freien Schenkel parallel laufen. Wie groß ist α + β, und warum gibt es dann kein Dreieck?",
        check: (v) => v.view === 1 && v.alpha + v.beta === 180,
      },
    ],
  },
  exercises: [
    {
      id: "existenz",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const roll = rng.next();
          const kind = roll < 0.5 ? 0 : roll < 0.75 ? 1 : 2; // 0 a triangle, 1 sum too small, 2 sum equal
          const x = rng.stepped(2, 8, 0.5);
          const y = rng.stepped(2, 8, 0.5);
          const z = kind === 0 ? rng.stepped(Math.max(1, Math.abs(x - y) + 0.5), x + y - 0.5, 0.5) : kind === 2 ? x + y : x + y + rng.stepped(0.5, 3, 0.5);
          const [a, b, c] = rng.shuffle([x, y, z]);
          const check = sideCheck(a, b, c);
          const others = (["a", "b", "c"] as const).filter((n) => n !== check.longest);
          const val = { a, b, c };
          const verdict = ["es gibt ein Dreieck.", "kein Dreieck, die Summe ist zu klein.", "kein Dreieck, A, B und C lägen auf einer Geraden."][kind];
          return {
            prompt: `Gibt es ein Dreieck ABC mit a = ${cm(a)}, b = ${cm(b)} und c = ${cm(c)}? Addiere die beiden kürzeren Seiten und vergleiche mit der längsten.`,
            given: [`a = ${cm(a)}`, `b = ${cm(b)}`, `c = ${cm(c)}`],
            formulaHint: "Dreiecksungleichung: längste Seite &lt; Summe der beiden anderen Seiten",
            fields: [
              numberField("Summe der beiden kürzeren Seiten:", check.S, "cm", 1, {
                slips: [
                  { value: a + b + c, hint: "Addiere nur die beiden kürzeren Seiten. Mit der längsten vergleichst du dann." },
                  { value: check.L + Math.max(val[others[0]], val[others[1]]), hint: "Die längste Seite gehört nicht in die Summe: Addiere die beiden kürzeren." },
                ],
              }),
              choiceField("Gibt es ein Dreieck?", EXIST_OPTIONS, kind),
            ],
            steps: [
              `Die längste Seite ist ${check.longest} = ${cm(check.L)}.`,
              `Summe der beiden anderen: ${others[0]} + ${others[1]} = ${cm(val[others[0]])} + ${cm(val[others[1]])} = ${cm(check.S)}.`,
              kind === 0
                ? `${cm(check.S)} &gt; ${cm(check.L)}: Die Kreise um A und B schneiden sich.`
                : kind === 2
                  ? `${cm(check.S)} = ${cm(check.L)}: Die Kreise berühren sich nur, C läge auf der Strecke.`
                  : `${cm(check.S)} &lt; ${cm(check.L)}: Die Kreise treffen sich nicht.`,
              `<strong>Summe ${cm(check.S)}: ${verdict.charAt(0).toUpperCase()}${verdict.slice(1)}</strong>`,
            ],
            meta: { a, b, c, kind },
          };
        }
        const ctx = rng.int(0, 2);
        const p = rng.int(2, 9);
        const q = rng.int(p + 1, Math.min(p + 9, 16));
        const lo = q - p + 1;
        const hi = p + q - 1;
        const count = hi - lo + 1;
        const { unit, name, labels } = RANGE_CONTEXTS[ctx];
        const prompt = [
          `Lukas baut aus drei Holzleisten einen dreieckigen Rahmen. Zwei Leisten sind ${p} dm und ${q} dm lang. Die dritte Leiste x gibt es im Baumarkt nur in ganzen Dezimetern. Wie lang muss sie mindestens sein, wie lang darf sie höchstens sein, und wie viele Längen kommen in Frage?`,
          `Vom Dorf A zum Dorf B sind es ${p} km Luftlinie, von B zum Dorf C sind es ${q} km. Die drei Dörfer liegen nicht auf einer Geraden, und die Entfernung AC ist eine ganze Zahl von Kilometern. Welche Entfernung AC ist die kleinste, welche die größte, und wie viele sind möglich?`,
          `Ein Dreieck ABC hat die Seiten a = ${p} cm und b = ${q} cm. Für welche ganzzahligen Längen c (in cm) gibt es ein solches Dreieck? Gib die kleinste und die größte Länge und die Anzahl der Möglichkeiten an.`,
        ][ctx];
        return {
          prompt,
          given: ctx === 1 ? [`AB = ${p} km`, `BC = ${q} km`] : ctx === 0 ? [`zwei Leisten: ${p} dm und ${q} dm`] : [`a = ${p} cm`, `b = ${q} cm`],
          fields: [
            numberField(labels[0], lo, unit, 0, {
              slips: [{ value: q - p, hint: `Bei ${q - p} ${unit} wäre die Seite mit ${q} ${unit} genau so lang wie die beiden anderen zusammen: Die drei Punkte lägen auf einer Geraden. Nimm die nächste ganze Zahl.` }],
            }),
            numberField(labels[1], hi, unit, 0, {
              slips: [{ value: p + q, hint: `Bei ${p + q} ${unit} wäre die dritte Seite genau so lang wie die beiden anderen zusammen: Das ist kein Dreieck mehr.` }],
            }),
            numberField(labels[2], count, "", 0, {
              slips: [
                { value: count + 2, hint: `Die Grenzen ${q - p} ${unit} und ${p + q} ${unit} selbst gehören nicht dazu.` },
                { value: count - 1, hint: "Zähle so: größte Länge − kleinste Länge + 1. Beide Grenzen zählen mit." },
              ],
            }),
          ],
          steps: [
            `Die dritte Seite muss kürzer sein als die Summe der beiden anderen: ${name} &lt; ${p} ${unit} + ${q} ${unit} = ${p + q} ${unit}.`,
            `Auch die längere gegebene Seite muss kürzer sein als die Summe: ${q} ${unit} &lt; ${p} ${unit} + ${name}, also ${name} &gt; ${q} ${unit} − ${p} ${unit} = ${q - p} ${unit}.`,
            `Also ${q - p} ${unit} &lt; ${name} &lt; ${p + q} ${unit}; ganzzahlig von ${lo} ${unit} bis ${hi} ${unit}, das sind ${hi} − ${lo} + 1 = ${count} Längen.`,
            `<strong>kleinste Länge ${lo} ${unit}, größte Länge ${hi} ${unit}, ${count} Möglichkeiten</strong>`,
          ],
          meta: { ctx, p, q },
        };
      },
    },
    {
      id: "seiten-winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const angles = draw(
            () => {
              const al = rng.int(25, 110);
              const be = rng.int(20, Math.min(120, 160 - al));
              return [al, be, 180 - al - be];
            },
            (t) => Math.min(...t) >= 15 && Math.abs(t[0] - t[1]) >= 4 && Math.abs(t[1] - t[2]) >= 4 && Math.abs(t[0] - t[2]) >= 4,
            [48, 75, 57],
          );
          const missing = rng.int(0, 2);
          const known = [0, 1, 2].filter((i) => i !== missing);
          const largest = angles.indexOf(Math.max(...angles));
          const sideOptions = ["a = [BC]", "b = [CA]", "c = [AB]"];
          return {
            prompt: `Im Dreieck ABC sind ${GREEK[known[0]]} = ${angles[known[0]]}° und ${GREEK[known[1]]} = ${angles[known[1]]}°. Berechne ${GREEK[missing]} und gib an, welche Seite die längste ist.`,
            given: known.map((i) => `${GREEK[i]} = ${angles[i]}°`),
            formulaHint: "α + β + γ = 180°; die längste Seite liegt dem größten Winkel gegenüber.",
            fields: [
              numberField(`${GREEK[missing]} =`, angles[missing], "°", 0, {
                slips: [
                  { value: 360 - angles[known[0]] - angles[known[1]], hint: "Im Dreieck ist die Winkelsumme 180°, nicht 360° wie im Viereck." },
                  { value: angles[known[0]] + angles[known[1]], hint: "Ziehe die beiden gegebenen Winkel von 180° ab." },
                ],
              }),
              choiceField("Längste Seite:", sideOptions, largest),
            ],
            steps: [
              `${GREEK[missing]} = 180° − ${angles[known[0]]}° − ${angles[known[1]]}° = ${angles[missing]}°`,
              `Der größte Winkel ist ${GREEK[largest]} = ${angles[largest]}°. Ihm gegenüber liegt die Seite ${sideOptions[largest]}.`,
              `<strong>${GREEK[missing]} = ${angles[missing]}°; die längste Seite ist ${SIDE[largest]}.</strong>`,
            ],
            meta: { alpha: angles[0], beta: angles[1], gamma: angles[2], missing },
          };
        }
        const roll = rng.next();
        if (roll < 0.4) {
          const phi = draw(() => rng.int(25, 72), (x) => x !== 60, 40);
          const top = 180 - 2 * phi;
          const wider = phi < 60;
          return {
            prompt: `Der Giebel eines Hauses ist ein gleichschenkliges Dreieck: Die beiden Dachschrägen sind gleich lang und bilden mit der waagrechten Giebelbreite jeweils einen Winkel von ${phi}°. Wie groß ist der Winkel am First, wo sich die Dachschrägen treffen? Ist die Giebelbreite länger oder kürzer als eine Dachschräge?`,
            given: [`Neigung der Dachschrägen: ${phi}°`],
            fields: [
              numberField("Winkel am First:", top, "°", 0, {
                slips: [
                  { value: 180 - phi, hint: "Beide Basiswinkel sind gleich groß: Ziehe zweimal die Neigung von 180° ab." },
                  { value: 90 - phi, hint: "Am First liegt der ganze Winkel zwischen den Dachschrägen: 180° minus beide Basiswinkel." },
                ],
              }),
              choiceField("Die Giebelbreite ist …", ["länger als eine Dachschräge", "kürzer als eine Dachschräge"], wider ? 0 : 1),
            ],
            steps: [
              `Im gleichschenkligen Dreieck sind die Basiswinkel gleich groß: Winkel am First = 180° − 2 · ${phi}° = ${top}°.`,
              "Die Giebelbreite liegt dem Winkel am First gegenüber, jede Dachschräge einem Basiswinkel.",
              wider ? `${top}° &gt; ${phi}°: Der Winkel am First ist größer, also ist die Giebelbreite länger.` : `${top}° &lt; ${phi}°: Der Winkel am First ist kleiner, also ist die Giebelbreite kürzer.`,
              `<strong>Winkel am First ${top}°; die Giebelbreite ist ${wider ? "länger" : "kürzer"} als eine Dachschräge.</strong>`,
            ],
            meta: { ctx: 0, phi },
          };
        }
        if (roll < 0.75) {
          const [x, y] = draw(
            () => {
              const x = rng.int(30, 100);
              return [x, rng.int(30, Math.min(110, 160 - x))];
            },
            ([x, y]) => {
              const z = 180 - x - y;
              return z >= 20 && Math.abs(x - y) >= 5 && Math.abs(x - z) >= 5 && Math.abs(y - z) >= 5;
            },
            [62, 45],
          );
          const z = 180 - x - y;
          const borders = ["[BC]", "[CA]", "[AB]"];
          const largest = [x, y, z].indexOf(Math.max(x, y, z));
          return {
            prompt: `Auf dem Plan eines dreieckigen Grundstücks ABC sind die Winkel ∢BAC = ${x}° und ∢CBA = ${y}° eingetragen. Wie groß ist der Winkel bei C? An welcher Grenze ist das Grundstück am längsten?`,
            given: [`∢BAC = ${x}°`, `∢CBA = ${y}°`],
            fields: [
              numberField("∢ACB =", z, "°", 0, { slips: [{ value: 360 - x - y, hint: "Im Dreieck ist die Winkelsumme 180°." }] }),
              choiceField("Längste Grenze:", borders, largest),
            ],
            steps: [
              `∢ACB = 180° − ${x}° − ${y}° = ${z}°`,
              `Der größte Winkel liegt bei ${VERTEX[largest]} (${[x, y, z][largest]}°). Die längste Grenze liegt ihm gegenüber: ${borders[largest]}.`,
              `<strong>∢ACB = ${z}°; am längsten ist die Grenze ${borders[largest]}.</strong>`,
            ],
            meta: { ctx: 1, x, y },
          };
        }
        // a plan to check: about half of them are possible, so that "prüfe" does not mean "nein"
        const possible = rng.next() < 0.45;
        const x = possible ? rng.int(60, 110) : rng.int(80, 120);
        const y = possible ? rng.int(Math.max(40, 120 - x), 175 - x) : rng.int(180 - x, 120);
        const sum = x + y;
        const yes = `Das Beet gibt es: Für den Winkel bei C bleiben ${180 - sum}° übrig.`;
        const no = "Das Beet gibt es nicht: Zwei Winkel ergeben schon 180° oder mehr.";
        const wrongYes = possible ? "Das Beet gibt es nur, wenn die Seiten lang genug sind." : "Das Beet gibt es: Der Winkel bei C ist eben sehr klein.";
        return {
          prompt: `Mia hat in den Plan eines dreieckigen Beets ABC die Winkel ∢BAC = ${x}° und ∢CBA = ${y}° eingetragen. Prüfe, ob es so ein Beet geben kann.`,
          given: [`∢BAC = ${x}°`, `∢CBA = ${y}°`],
          fields: [numberField("∢BAC + ∢CBA =", sum, "°", 0), shuffledChoice(rng, "Ergebnis:", possible ? yes : no, possible ? [no, wrongYes] : [wrongYes, "Das Beet gibt es nur, wenn die Seiten lang genug sind."])],
          steps: [
            `${x}° + ${y}° = ${sum}°`,
            possible
              ? `Das ist weniger als 180°: Für den Winkel bei C bleiben 180° − ${sum}° = ${180 - sum}°. Die Seitenlängen ändern daran nichts.`
              : sum === 180
                ? "Für den Winkel bei C bliebe 0° übrig: Die freien Schenkel in A und B wären parallel."
                : "Schon die beiden Winkel sind zusammen größer als 180°: Die freien Schenkel laufen auseinander.",
            possible ? `<strong>${sum}° &lt; 180°: Das Beet gibt es, ∢ACB = ${180 - sum}°.</strong>` : `<strong>${sum}° ≥ 180°: Das Beet gibt es nicht.</strong>`,
          ],
          meta: { ctx: 2, x, y },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst sofort, ob drei Seiten oder zwei Winkel ein Dreieck ergeben.",
};

// 1.2 Dreiecke konstruieren ────────────────────────────────────────────────

/** The answer options for the case of a construction. */
export const FALL_OPTIONS = ["SSS", "SWS", "WSW", "SWW", "SsW"];
export const COUNT_OPTIONS = ["genau eines", "keines"];

function constructionCheck(v: LabValues): string {
  if (v.fall === 0) {
    const check = sideCheck(v.a, v.b, v.c);
    return `längste Seite ${check.longest} = ${cmText(check.L)}, Summe der anderen ${cmText(check.S)}`;
  }
  if (v.fall === 1) return "Zwei Seiten und der Winkel dazwischen: immer genau ein Dreieck";
  if (v.fall === 2) return `α + β = ${deg(v.alpha + v.beta)}${v.alpha + v.beta < 180 ? " < 180°" : " ≥ 180°"}`;
  if (v.a > v.c) return "a > c: α liegt der längeren Seite gegenüber (SsW)";
  if (v.a === v.c) return "a = c: Der Kreis um B geht durch A";
  return "a < c: α liegt der kürzeren Seite gegenüber, Vorsicht!";
}

/** One generated triangle task of 1.2: which case, the pieces and whether a triangle exists. */
interface CasePieces {
  kind: number;
  r: number;
  pieces: string[];
  exists: boolean;
  /** For SWW: the missing angle at the given side, its name and the two angles it comes from. */
  missing?: { name: string; value: number; from: [number, number] };
  reason: string;
  condition: string;
}

function makeCase(rng: Rng): CasePieces {
  const kind = rng.int(0, 4);
  const r = rng.int(0, 2);
  const L = letters(r);
  const side = (i: number, x: number) => `${L.s(i)} = ${cm(x)}`;
  const angle = (i: number, x: number) => `${L.w(i)} = ${x}°`;
  if (kind === 0) {
    const valid = rng.next() < 0.7;
    const x = rng.stepped(3, 9, 0.5);
    const y = rng.stepped(3, 9, 0.5);
    const z = valid ? rng.stepped(Math.abs(x - y) + 0.5, x + y - 0.5, 0.5) : x + y + rng.stepped(0, 2, 0.5);
    const s = rng.shuffle([x, y, z]);
    const check = sideCheck(s[0], s[1], s[2]);
    const longest = s.indexOf(check.L);
    return {
      kind,
      r,
      pieces: [0, 1, 2].map((i) => side(i, s[i])),
      exists: check.meet === "two",
      reason: "Drei Seiten sind gegeben: SSS.",
      condition: `Längste Seite ${L.s(longest)} = ${cm(check.L)}, Summe der anderen ${cm(check.S)}: ${cm(check.L)} ${relHtml(check.L, check.S)} ${cm(check.S)}.`,
    };
  }
  if (kind === 1) {
    const s1 = rng.stepped(3, 9, 0.5);
    const s2 = rng.stepped(3, 9, 0.5);
    const w0 = multiple(rng, 20, 140, 5);
    return {
      kind,
      r,
      pieces: [side(1, s1), side(2, s2), angle(0, w0)],
      exists: true,
      reason: `${L.s(1)} und ${L.s(2)} treffen sich in ${L.v(0)}, und dort liegt ${L.w(0)} zwischen ihnen: SWS.`,
      condition: "Zwei Seiten und der eingeschlossene Winkel ergeben immer genau ein Dreieck.",
    };
  }
  if (kind === 2 || kind === 3) {
    const valid = rng.next() < 0.75;
    const s0 = rng.stepped(3, 9, 0.5);
    const p = valid ? multiple(rng, 25, 115, 5) : multiple(rng, 60, 125, 5);
    const q = valid ? multiple(rng, 20, Math.min(120, 160 - p), 5) : multiple(rng, 180 - p, 145, 5);
    if (kind === 2) {
      return {
        kind,
        r,
        pieces: [side(0, s0), angle(1, p), angle(2, q)],
        exists: valid,
        reason: `${L.w(1)} und ${L.w(2)} liegen an den beiden Enden der Seite ${L.s(0)}: WSW.`,
        condition: `${L.w(1)} + ${L.w(2)} = ${p + q}° ${relHtml(p + q, 180)} 180°.`,
      };
    }
    return {
      kind,
      r,
      pieces: [side(0, s0), angle(1, p), angle(0, q)],
      exists: valid,
      missing: valid ? { name: L.w(2), value: 180 - p - q, from: [q, p] } : undefined,
      reason: `${L.w(1)} liegt an der Seite ${L.s(0)}, ${L.w(0)} liegt ihr gegenüber: SWW.`,
      condition: `${L.w(0)} + ${L.w(1)} = ${p + q}° ${relHtml(p + q, 180)} 180°.`,
    };
  }
  const s1 = rng.stepped(3, 7, 0.5);
  const s0 = s1 + rng.stepped(0.5, 3, 0.5);
  const w0 = multiple(rng, 30, 150, 5);
  return {
    kind,
    r,
    pieces: [side(0, s0), side(1, s1), angle(0, w0)],
    exists: true,
    reason: `${L.w(0)} liegt der Seite ${L.s(0)} gegenüber, und ${L.s(0)} = ${cm(s0)} ist länger als ${L.s(1)} = ${cm(s1)}: SsW.`,
    condition: "Der Winkel liegt der längeren Seite gegenüber: genau ein Dreieck.",
  };
}

/** The scale contexts of 1.2, Level 2: a side of a real triangle in m or km and the scale of the drawing. */
export const SCALE_CONTEXTS = [
  { lengths: [30, 35, 40, 45, 50, 60], unit: "m", scale: 1000 },
  { lengths: [2.4, 3, 3.6, 4, 4.5], unit: "m", scale: 50 },
  { lengths: [1.2, 1.5, 1.8, 2], unit: "km", scale: 25000 },
];

/** Steps 3 and 4 of a construction, each with its typical wrong alternatives. */
function nextStepOptions(v: LabValues): Array<{ right: string; wrong: string[] }> {
  const [, , s3, s4] = constructionSteps(v);
  if (v.fall === 0) {
    return [
      { right: s3, wrong: [`Zeichne den Kreis um B mit dem Radius b = ${cm(v.b)}.`, `Zeichne den Kreis um A mit dem Radius a = ${cm(v.a)}.`, "Trage in C den Winkel γ an."] },
      { right: s4, wrong: ["Der Mittelpunkt von [AB] ist C.", `Zeichne den Kreis um C mit dem Radius c = ${cm(v.c)}.`, "Trage in A an [AB] den Winkel α an."] },
    ];
  }
  if (v.fall === 1) {
    return [
      { right: s3, wrong: [`Der Kreis um B mit r = b = ${cm(v.b)} schneidet den Schenkel in C.`, `Der Kreis um A mit r = c = ${cm(v.c)} schneidet den Schenkel in C.`, "Trage in B an [BA] den Winkel β an."] },
      { right: s4, wrong: ["Zeichne den Kreis um B mit dem Radius a.", "Trage in C den Winkel γ an.", "Halbiere die Strecke [AC]."] },
    ];
  }
  if (v.fall === 2) {
    return [
      { right: s3, wrong: [`Trage in A an [AB] den Winkel β = ${deg(v.beta)} an.`, `Zeichne den Kreis um A mit dem Radius c = ${cm(v.c)}.`, `Trage in B an [BA] den Winkel α = ${deg(v.alpha)} an.`] },
      { right: s4, wrong: [`Der Kreis um B mit r = c = ${cm(v.c)} schneidet den Schenkel in C.`, "Der Mittelpunkt von [AB] ist C.", "Zeichne den Kreis um A mit dem Radius b."] },
    ];
  }
  return [
    { right: s3, wrong: [`Zeichne den Kreis um A mit dem Radius a = ${cm(v.a)}.`, `Zeichne den Kreis um B mit dem Radius c = ${cm(v.c)}.`, "Trage in B an [BA] den Winkel β an."] },
    { right: s4, wrong: ["Der Kreis schneidet die Strecke [AB] in C.", "Der Mittelpunkt von [AB] ist C.", "Trage in C den Winkel γ an."] },
  ];
}

const dreieckskonstruktion: Lesson = {
  id: "dv-2-dreieckskonstruktion",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Dreiecke konstruieren",
  subtitle: "Planfigur, Konstruktionsbeschreibung und die Zahl der Lösungen",
  tracks: ["II_III"],
  lehrplan: `${II}: Dreieckskonstruktionen`,
  whyItMatters:
    "Wer ein Dach, ein Segel oder ein Grundstück maßstäblich zeichnet, muss wissen, womit er beginnt und ob die Angaben genau ein Dreieck ergeben. Mit einer Konstruktionsbeschreibung erklärst du in Prüfungen, wie du gezeichnet hast.",
  explanationHtml: `
    <p><strong>Planfigur.</strong> Vor jeder Konstruktion skizzierst du das Dreieck ABC, beschriftet gegen den Uhrzeigersinn, und markierst die gegebenen Stücke farbig. Daran siehst du, welcher Fall vorliegt und womit du beginnst, meist mit einer gegebenen Seite. Die Skizze muss nicht maßstäblich sein.</p>
    <p><strong>Die Fälle.</strong> S steht für eine gegebene Seite, W für einen gegebenen Winkel.</p>
    <table class="mini">
      <tr><th>Fall</th><th>gegeben</th><th>Bedingung</th></tr>
      <tr><td>SSS</td><td>drei Seiten</td><td>längste Seite &lt; Summe der anderen (Lektion 1.1)</td></tr>
      <tr><td>SWS</td><td>zwei Seiten und der Winkel zwischen ihnen</td><td>immer genau ein Dreieck</td></tr>
      <tr><td>WSW</td><td>eine Seite und die Winkel an ihren Enden</td><td>Winkelsumme der beiden &lt; 180°</td></tr>
      <tr><td>SWW</td><td>eine Seite, ein anliegender und der gegenüberliegende Winkel</td><td>fehlenden Winkel berechnen, dann wie WSW</td></tr>
      <tr><td>SsW</td><td>zwei Seiten und der Winkel gegenüber der längeren Seite</td><td>genau ein Dreieck</td></tr>
    </table>
    <div class="example"><strong>Beispiel (SWS):</strong> Konstruiere das Dreieck ABC mit c = 6 cm, b = 4 cm und α = 50°. In der Planfigur treffen sich c und b in A, und α liegt zwischen ihnen.
      <ol class="steps">
        <li>Zeichne die Strecke [AB] mit c = 6 cm.</li>
        <li>Trage in A an [AB] den Winkel α = 50° an.</li>
        <li>Zeichne den Kreis um A mit dem Radius b = 4 cm. Er schneidet den freien Schenkel in C.</li>
        <li>Verbinde B mit C.</li>
      </ol>
      Bei SWW, etwa c = 5 cm, α = 40° und γ = 75°, rechnest du zuerst β = 180° − 40° − 75° = 65° und konstruierst dann nach WSW mit c, α und β.</div>
    <p><strong>Wie viele Lösungen?</strong> Den Punkt C findest du immer als Schnittpunkt zweier Linien: zweier Kreise, eines Kreises und eines Schenkels oder zweier Schenkel. Zwei Kreise schneiden sich zweimal, berühren sich einmal oder treffen sich gar nicht. Bei SSS liegt der zweite Schnittpunkt unterhalb von [AB]; er liefert nur das Spiegelbild, also dasselbe Dreieck in anderer Lage. Zwei freie Schenkel treffen sich höchstens einmal, und nur, wenn die beiden Winkel zusammen weniger als 180° haben.</p>
    <p>Genau hinschauen musst du bei zwei Seiten und einem Gegenwinkel. Sind c, a und α gegeben, schlägst du um B einen Kreis mit dem Radius a. Ist a länger als c, liegt α der längeren Seite gegenüber (SsW), und der Kreis schneidet den freien Schenkel von α genau einmal. Ist a kürzer als c, kann er den Schenkel <strong>zweimal</strong>, einmal oder gar nicht treffen. Ist a genau so lang wie c, geht der Kreis durch A; bei spitzem α bleibt nur der zweite Schnittpunkt, ein gleichschenkliges Dreieck. Ist α ein stumpfer oder rechter Winkel, muss a sogar die längste Seite sein, sonst gibt es kein Dreieck.</p>
    <p><strong>Dynamische Geometriesoftware:</strong> Im Zugmodus ziehst du an A oder B. Eine echte Konstruktion behält dabei ihre Eigenschaften, weil jeder Punkt aus den anderen konstruiert ist. Eine nach Augenmaß gezeichnete Figur fällt auseinander.</p>
    <p><strong>Typische Fehler:</strong> den Kreis um die falsche Ecke schlagen (b = [CA] beginnt in A, also Kreis um A mit r = b); bei SWS einen Winkel nehmen, der nicht zwischen den beiden Seiten liegt; bei SWW den Winkel, der der Seite gegenüberliegt, an [AB] antragen.</p>
    <div class="merke"><strong>Merke:</strong> Erst die Planfigur, dann die Konstruktionsbeschreibung. Mit SSS, SWS, WSW, SWW oder SsW gibt es höchstens ein Dreieck. Liegt der gegebene Winkel der kürzeren der beiden Seiten gegenüber, kann es zwei verschiedene Dreiecke geben.</div>
  `,
  formulas: [
    { name: "SSS", html: "drei Seiten: längste Seite &lt; Summe der beiden anderen", quantities: "Kreise um A (r = b) und um B (r = a) schneiden sich in C" },
    { name: "SWS", html: "zwei Seiten und der eingeschlossene Winkel", quantities: "zum Beispiel b, c und α: immer genau ein Dreieck" },
    { name: "WSW und SWW", html: "β = 180° − α − γ", quantities: "eine Seite und zwei Winkel; die beiden Winkel an der Seite zusammen kleiner als 180°" },
    { name: "SsW", html: "zwei Seiten und der Gegenwinkel der längeren Seite", quantities: "zum Beispiel c, a und α mit a > c: genau ein Dreieck; mit a < c bis zu zwei" },
  ],
  quiz: {
    question: "Für ein Dreieck ABC sind c = 6 cm, a = 4 cm und α = 35° gegeben. Was gilt für die Konstruktion?",
    options: ["Sie liefert immer genau ein Dreieck.", "Es kann zwei verschiedene Dreiecke geben, weil α der kürzeren Seite a gegenüberliegt.", "Es gibt kein Dreieck, weil a kürzer als c ist."],
    correctIndex: 1,
    explanation:
      "α liegt a gegenüber, und a ist die kürzere der beiden Seiten. Der Kreis um B mit r = 4 cm schneidet den freien Schenkel von α hier zweimal: zwei verschiedene Dreiecke. Eindeutig wäre die Konstruktion nur, wenn α der längeren Seite gegenüberläge (SsW).",
  },
  lab: {
    kind: "triangle-construction",
    title: "Labor: Konstruktion Schritt für Schritt",
    intro:
      "Wähle den Fall und die Stücke. Mit „Nächster Schritt“ entsteht die Konstruktion wie im Heft, zuerst die Planfigur. Ziehe dann an B, an den Zirkelpunkten unter [AB] oder an den Schenkeln: Die Konstruktion passt sich an wie im Zugmodus einer Geometriesoftware.",
    params: [
      {
        type: "choice",
        key: "fall",
        label: "Fall",
        options: [
          { value: 0, label: "SSS: drei Seiten" },
          { value: 1, label: "SWS: b, c und α" },
          { value: 2, label: "WSW: c, α und β" },
          { value: 3, label: "zwei Seiten und ein Gegenwinkel: c, a und α" },
        ],
        value: 0,
      },
      { type: "range", key: "c", label: "Seite c = [AB]", unit: "cm", min: 3, max: 8, step: 0.5, value: 6, digits: 1 },
      { type: "range", key: "a", label: "Seite a = [BC]", unit: "cm", min: 1, max: 8, step: 0.5, value: 5, digits: 1, showIf: (v) => v.fall === 0 || v.fall === 3 },
      { type: "range", key: "b", label: "Seite b = [CA]", unit: "cm", min: 1, max: 8, step: 0.5, value: 4, digits: 1, showIf: (v) => v.fall === 0 || v.fall === 1 },
      { type: "range", key: "alpha", label: "Winkel α bei A", unit: "°", min: 10, max: 170, step: 5, value: 50, showIf: (v) => v.fall !== 0 },
      { type: "range", key: "beta", label: "Winkel β bei B", unit: "°", min: 10, max: 170, step: 5, value: 60, showIf: (v) => v.fall === 2 },
      { type: "state", key: "step", value: 0 },
    ],
    readouts: [
      { key: "schritt", label: "Stand", compute: (v) => (conStep(v) === 0 ? "Planfigur" : `Schritt ${conStep(v)} von 4`) },
      {
        key: "beschreibung",
        label: "Konstruktionsbeschreibung bis hier",
        compute: (v) => {
          const step = conStep(v);
          return step === 0 ? "Planfigur: Skizze mit den gegebenen Stücken" : constructionSteps(v).slice(0, step).map((s, i) => `${i + 1}. ${s}`).join(" ");
        },
      },
      {
        key: "loesungen",
        label: "Passende Dreiecke",
        emphasis: true,
        compute: (v) => ["keines", "genau eines", "zwei (C₁ und C₂)"][constructionApexes(v).length],
      },
      { key: "pruefung", label: "Prüfung", compute: constructionCheck },
    ],
    goals: [
      {
        id: "rechter-winkel",
        text: "WSW: Konstruiere bis zum letzten Schritt ein Dreieck, in dem γ ein rechter Winkel wird. Was muss dann für α und β gelten?",
        check: (v) => v.fall === 2 && conStep(v) === 4 && v.alpha + v.beta === 90,
      },
      {
        id: "keine-loesung",
        text: "SSS: Finde Seitenlängen, bei denen sich die beiden Kreise nicht schneiden und nicht berühren, und führe die Konstruktion bis zum letzten Schritt aus.",
        check: (v) => v.fall === 0 && conStep(v) === 4 && sideCheck(v.a, v.b, v.c).meet === "none",
      },
      {
        id: "zwei-loesungen",
        text: "Zwei Seiten und ein Gegenwinkel: Finde Werte, bei denen der Kreis um B den freien Schenkel im letzten Schritt zweimal schneidet. Welche Seite ist dann länger, a oder c?",
        check: (v) => v.fall === 3 && conStep(v) === 4 && constructionApexes(v).length === 2,
      },
    ],
    actions: [
      { id: "zurueck", label: "◀ Schritt zurück", apply: (v) => ({ ...v, step: Math.max(0, conStep(v) - 1) }) },
      { id: "weiter", label: "Nächster Schritt ▶", apply: (v) => ({ ...v, step: Math.min(4, conStep(v) + 1) }) },
      { id: "neu", label: "Von vorn", apply: (v) => ({ ...v, step: 0 }) },
    ],
  },
  exercises: [
    {
      id: "fall",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const t = makeCase(rng);
          const shown = rng.shuffle(t.pieces);
          // the same two questions for every case, so that no extra field gives the case away
          const fields: AnswerField[] = [choiceField("Fall:", FALL_OPTIONS, t.kind), choiceField("Anzahl der Dreiecke:", COUNT_OPTIONS, t.exists ? 0 : 1)];
          return {
            prompt: `Ein Dreieck ABC soll aus diesen Stücken konstruiert werden: ${listText(shown)}. Welcher Fall liegt vor, und wie viele Dreiecke gibt es?`,
            given: shown,
            formulaHint: "Liegt der Winkel zwischen zwei Seiten (SWS), an den Enden einer Seite (WSW) oder einer Seite gegenüber (SWW, SsW)? SSS: längste Seite &lt; Summe; WSW: die beiden Winkel zusammen &lt; 180°.",
            fields,
            steps: [
              t.reason,
              t.condition,
              ...(t.missing ? [`Für die Konstruktion rechnest du ${t.missing.name} = 180° − ${t.missing.from[0]}° − ${t.missing.from[1]}° = ${t.missing.value}° und konstruierst nach WSW.`] : []),
              `<strong>${FALL_OPTIONS[t.kind]}; ${t.exists ? "genau ein Dreieck" : "kein Dreieck"}</strong>`,
            ],
            meta: { kind: t.kind, exists: t.exists ? 1 : 0, r: t.r, missing: t.missing?.value ?? -1 },
          };
        }
        const ctx = rng.int(0, 2);
        const c = SCALE_CONTEXTS[ctx];
        const L = rng.pick(c.lengths);
        // the second given angle lies at B (WSW) or at C, opposite [AB] (SWW), in every context
        const kind = rng.next() < 0.5 ? 2 : 3;
        const x = rng.int(38, 75);
        const y = rng.int(40, Math.min(90, 150 - x));
        const angle = 180 - x - y;
        const lengthCm = c.unit === "km" ? L * 100000 : L * 100;
        const drawn = lengthCm / c.scale;
        const scaleText = `1 : ${big(c.scale, 0)}`;
        const second = [
          kind === 2 ? `bei B die Grenzen [AB] und [BC] einen Winkel von ${y}°` : `bei C treffen sich die Grenzen [AC] und [BC] unter ${y}°`,
          kind === 2 ? `an der Ecke B die Kante [BC] einen Winkel von ${y}°` : `an der oberen Ecke C treffen sich die Kanten [AC] und [BC] unter ${y}°`,
          kind === 2 ? `bei B die Wege nach A und nach C einen Winkel von ${y}°` : `bei C treffen sich die Wege von A und von B unter ${y}°`,
        ][ctx];
        const question = "Welcher Fall liegt vor? Berechne den dritten Winkel. Wie lang wird [AB] in der Zeichnung?";
        const prompts = [
          `Ein dreieckiges Grundstück ABC grenzt mit der ${fmt(L)} m langen Seite [AB] an eine Straße. Bei A bilden die Grenzen [AB] und [AC] einen Winkel von ${x}°, ${second}. Das Grundstück soll im Maßstab ${scaleText} gezeichnet werden. ${question}`,
          `Ein dreieckiges Sonnensegel ABC hat eine ${fmt(L)} m lange Unterkante [AB]. An der Ecke A schließt die Kante [AC] mit der Unterkante einen Winkel von ${x}° ein, ${second}. Lena zeichnet das Segel im Maßstab ${scaleText}. ${question}`,
          `Drei Hütten A, B und C sind durch gerade Wege verbunden. Der Weg von A nach B ist ${fmt(L)} km lang. Bei A bilden die Wege nach B und nach C einen Winkel von ${x}°, ${second}. Für eine Wanderkarte im Maßstab ${scaleText} wird das Dreieck konstruiert. ${question}`,
        ];
        const angleName = kind === 2 ? "∢ACB" : "∢CBA";
        const unitWord = c.unit === "km" ? "km" : "m";
        return {
          prompt: prompts[ctx],
          given: [`AB = ${fmt(L)} ${unitWord}`, `∢BAC = ${x}°`, kind === 2 ? `∢CBA = ${y}°` : `∢ACB = ${y}°`, `Maßstab ${scaleText}`],
          fields: [
            choiceField("Fall:", FALL_OPTIONS, kind),
            numberField(`${angleName} =`, angle, "°", 0, { slips: [{ value: 360 - x - y, hint: "Im Dreieck ist die Winkelsumme 180°." }] }),
            numberField("[AB] in der Zeichnung:", drawn, "cm", 1, {
              slips: [
                { value: L / c.scale, hint: `Das ist die Länge in ${unitWord === "km" ? "Kilometern" : "Metern"}. Rechne zuerst in Zentimeter um.` },
                { value: L, hint: `Teile die wirkliche Länge (in cm) durch ${big(c.scale, 0)}.` },
              ],
            }),
          ],
          steps: [
            kind === 2
              ? "Gegeben sind die Seite [AB] und die beiden Winkel an ihren Enden A und B: WSW."
              : "Gegeben sind die Seite [AB], der Winkel bei A an dieser Seite und der Winkel bei C, der ihr gegenüberliegt: SWW.",
            kind === 2
              ? `Der dritte Winkel liegt bei C: ∢ACB = 180° − ${x}° − ${y}° = ${angle}°.`
              : `Der dritte Winkel liegt bei B, an [AB]: ∢CBA = 180° − ${x}° − ${y}° = ${angle}°. Mit ihm konstruierst du nach WSW.`,
            `Maßstab ${scaleText}: ${fmt(L)} ${unitWord} = ${big(lengthCm, 0)} cm, und ${big(lengthCm, 0)} cm : ${big(c.scale, 0)} = ${cm(drawn)}.`,
            `<strong>${FALL_OPTIONS[kind]}; ${angleName} = ${angle}°; [AB] wird ${cm(drawn)} lang.</strong>`,
          ],
          meta: { ctx, kind, L, x, y, angle, drawn },
        };
      },
    },
    {
      id: "schritt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const fall = rng.int(0, 3);
          const v: LabValues = draw(
            () => {
              const c = rng.stepped(4, 8, 0.5);
              const a = fall === 3 ? c + rng.stepped(0.5, 2.5, 0.5) : rng.stepped(3, 8, 0.5);
              return { fall, c, a, b: rng.stepped(3, 8, 0.5), alpha: multiple(rng, 30, 110, 5), beta: multiple(rng, 30, 100, 5), step: 4 };
            },
            (t) => constructionApexes(t).length === 1 && (fall !== 0 || (t.a !== t.b && t.b !== t.c && t.a !== t.c)) && (fall !== 1 || t.b !== t.c),
            { fall, c: 6, a: 7, b: 4, alpha: 50, beta: 60, step: 4 },
          );
          const steps = constructionSteps(v);
          const options = nextStepOptions(v);
          const pieces = [
            ["a = " + cm(v.a), "b = " + cm(v.b), "c = " + cm(v.c)],
            ["c = " + cm(v.c), "b = " + cm(v.b), `α = ${v.alpha}°`],
            ["c = " + cm(v.c), `α = ${v.alpha}°`, `β = ${v.beta}°`],
            ["c = " + cm(v.c), "a = " + cm(v.a), `α = ${v.alpha}°`],
          ][fall];
          const fields = options.map((o, i) => shuffledChoice(rng, `Schritt ${i + 3}:`, o.right, rng.shuffle(o.wrong).slice(0, 2)));
          const why = [
            ["Der Kreis um A trägt b = [CA]; nun fehlt der Kreis um B mit dem Radius a = [BC].", "C ist der Schnittpunkt der beiden Kreise oberhalb von [AB]."],
            ["b = [CA] beginnt in A: Der Kreis um A mit dem Radius b schneidet den freien Schenkel von α in C.", "Nun fehlt nur noch die Seite a = [BC]."],
            ["β liegt bei B: Er wird in B an [BA] angetragen.", "C ist der Schnittpunkt der beiden freien Schenkel."],
            ["a = [BC] beginnt in B: Der Kreis um B mit dem Radius a.", "C ist der Schnittpunkt dieses Kreises mit dem freien Schenkel von α."],
          ][fall];
          return {
            prompt: `Ein Dreieck ABC wird nach ${CASES[fall]} aus ${listText(pieces)} konstruiert. Die ersten beiden Schritte der Konstruktionsbeschreibung stehen schon da. Wie geht es weiter?`,
            given: [`1. ${steps[0]}`, `2. ${steps[1]}`],
            formulaHint: "Gegebene Seiten nimmst du in den Zirkel, gegebene Winkel trägst du an den Enden von [AB] an. C ist immer ein Schnittpunkt.",
            fields,
            steps: [`Schritt 3: ${why[0]}`, `Schritt 4: ${why[1]}`, `<strong>3. ${steps[2]} 4. ${steps[3]}</strong>`],
            meta: { fall, a: v.a, b: v.b, c: v.c, alpha: v.alpha, beta: v.beta },
          };
        }
        const roll = rng.next();
        if (roll < 0.4) {
          const alpha = multiple(rng, 90, 150, 5);
          const c = rng.stepped(3, 8, 0.5);
          const aMin = Math.floor(c) + 1;
          return {
            prompt: `Für ein Dreieck ABC sind c = ${cm(c)} und α = ${alpha}° gegeben. Die Seite a liegt α gegenüber und soll eine ganze Zahl von Zentimetern lang sein. Welche Länge ist die kleinste, für die es ein Dreieck gibt? Wie viele Dreiecke liefert die Konstruktion dann?`,
            given: [`c = ${cm(c)}`, `α = ${alpha}°`],
            fields: [
              numberField("kleinstes a:", aMin, "cm", 0, {
                slips: Number.isInteger(c)
                  ? [{ value: c, hint: `Mit a = c wäre das Dreieck gleichschenklig, und auch der Winkel bei C wäre ${alpha}° groß. Zwei solche Winkel passen nicht in ein Dreieck.` }]
                  : [{ value: Math.floor(c), hint: "Diese Länge ist kürzer als c. Dem größten Winkel muss aber die längste Seite gegenüberliegen." }],
              }),
              // shuffled: the app shows choice options in their order, and the answer is always "genau eines"
              shuffledChoice(rng, "Anzahl der Dreiecke:", "genau eines", ["zwei", "keines"]),
            ],
            steps: [
              `α = ${alpha}° ist ${alpha === 90 ? "ein rechter" : "ein stumpfer"} Winkel, also der größte Winkel des Dreiecks. Ihm muss die längste Seite gegenüberliegen: a &gt; c = ${cm(c)}.`,
              `Die kleinste ganze Zahl über ${fmt(c)} ist ${aMin}.`,
              `Mit a = ${aMin} cm liegt α der längeren Seite gegenüber (SsW): Der Kreis um B schneidet den freien Schenkel genau einmal.`,
              `<strong>a = ${aMin} cm; genau ein Dreieck</strong>`,
            ],
            meta: { variant: 0, c, alpha, aMin },
          };
        }
        // a claim of two triangles: true when α lies opposite the shorter side (checked to give two), false when opposite the longer
        const two = rng.next() < 0.5;
        const name = rng.pick(["Lena", "Tim", "Aylin", "Jonas"]);
        const { c, a, alpha } = two
          ? draw(
              () => {
                const alpha = multiple(rng, 25, 60, 5);
                const c = rng.stepped(5, 9, 0.5);
                return { c, a: rng.stepped(2, c - 0.5, 0.5), alpha };
              },
              (t) => t.a > t.c * Math.sin((t.alpha * Math.PI) / 180) + 0.3 && t.a < t.c - 0.25 && ssaLengths(t.c, t.a, t.alpha).length === 2,
              { c: 7, a: 5, alpha: 40 },
            )
          : (() => {
              const c = rng.stepped(3, 7, 0.5);
              return { c, a: c + rng.stepped(0.5, 3, 0.5), alpha: multiple(rng, 30, 120, 5) };
            })();
        const yes = "Das ist möglich: α liegt der kürzeren Seite gegenüber, der Kreis um B kann den Schenkel zweimal schneiden.";
        const no = "Das geht nicht: α liegt der längeren Seite gegenüber (SsW), es gibt genau ein Dreieck.";
        return {
          prompt: `${name} konstruiert ein Dreieck ABC mit c = ${cm(c)}, a = ${cm(a)} und α = ${alpha}° und erhält zwei verschiedene Dreiecke. Kann das stimmen? Welcher der beiden Seiten liegt α gegenüber?`,
          given: [`c = ${cm(c)}`, `a = ${cm(a)}`, `α = ${alpha}°`],
          fields: [
            shuffledChoice(rng, "Kann das stimmen?", two ? yes : no, two ? [no, "Das geht nicht: Weil a kürzer als c ist, gibt es gar kein Dreieck."] : [yes, "Das ist möglich: Ein Kreis schneidet einen Schenkel immer zweimal."]),
            choiceField("α liegt gegenüber …", ["der kürzeren der beiden Seiten", "der längeren der beiden Seiten"], two ? 0 : 1),
          ],
          steps: [
            `α liegt a gegenüber, und a = ${cm(a)} ist ${two ? "kürzer" : "länger"} als c = ${cm(c)}.`,
            two
              ? "Der Kreis um B mit dem Radius a kann den freien Schenkel von α dann zweimal schneiden: zwei Dreiecke ABC₁ und ABC₂, die nicht deckungsgleich sind."
              : "Der Kreis um B mit dem Radius a schneidet den freien Schenkel von α dann genau einmal; der zweite Schnittpunkt liegt auf der Verlängerung über A hinaus.",
            `<strong>${two ? `Das kann stimmen; α liegt der kürzeren Seite gegenüber.` : `Das kann nicht stimmen; α liegt der längeren Seite gegenüber, es gibt genau ein Dreieck.`}</strong>`,
          ],
          meta: { variant: 1, two: two ? 1 : 0, c, a, alpha },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Planfigur, Fall, Konstruktionsbeschreibung: Du konstruierst wie im Heft und weißt vorher, wie viele Lösungen es gibt.",
};

// 1.3 Die Kongruenzsätze ───────────────────────────────────────────────────

export const THEOREM_OPTIONS = ["SSS", "SWS", "WSW (auch SWW)", "SsW", "nicht entscheidbar"];
/** The reason for each case of a congruence pair: 0 SSS, 1 SWS, 2 WSW, 3 SWW, 4 SsW, 5 SSW (shorter side), 6 WWW. */
export const CONGRUENCE_REASONS = [
  "Alle drei Seiten stimmen überein.",
  "Der Winkel liegt zwischen den beiden Seiten.",
  "Die beiden Winkel liegen an den Enden der Seite.",
  "Ein Winkel liegt an der Seite, einer gegenüber; der dritte folgt aus der Winkelsumme.",
  "Der Winkel liegt der längeren der beiden Seiten gegenüber.",
  "Der Winkel liegt der kürzeren der beiden Seiten gegenüber.",
  "Gleiche Winkel legen die Größe nicht fest.",
];

/** The congruence lab's readout for the theorem the chosen pieces form. */
function theoremReadout(v: LabValues): string {
  const res = congruenceResult(v);
  if (v.art === 4) return res.count === "keins" ? "kein Dreieck" : "keiner: WWW legt die Größe nicht fest";
  if (res.count === "keins") return "kein Dreieck";
  if (v.art === 3) {
    if (v.a > v.c) return "SsW: α liegt der längeren Seite gegenüber";
    return v.a < v.c ? "keiner: α liegt der kürzeren Seite gegenüber" : "a = c: gleichschenklig mit γ = α, also WSW";
  }
  return res.theorem;
}

function piecesReadout(v: LabValues): string {
  const res = congruenceResult(v);
  if (v.art === 4) return res.count === "keins" ? "kein Dreieck" : `γ = 180° − α − β = ${deg(180 - v.alpha - v.beta)}`;
  if (res.apexes.length === 0) {
    if (v.art !== 3) return "kein Dreieck";
    return v.alpha >= 90 && v.a <= v.c ? "kein Dreieck: α ist nicht spitz, a müsste länger als c sein" : `kein Dreieck: a ist kürzer als der Abstand ≈ ${cmText(legDistance(v.c, v.alpha))}`;
  }
  const B = { x: v.c, y: 0 };
  const O = { x: 0, y: 0 };
  if (res.apexes.length === 2) {
    const [m1, m2] = res.apexes.map((C) => measure(O, B, C));
    return `[AC₁] ≈ ${cmText(m1.b)}, γ₁ ≈ ${deg(m1.gamma)}; [AC₂] ≈ ${cmText(m2.b)}, γ₂ ≈ ${deg(m2.gamma)}`;
  }
  const m = measure(O, B, res.apexes[0]);
  const parts = [
    [`α ≈ ${deg(m.alpha)}`, `β ≈ ${deg(m.beta)}`, `γ ≈ ${deg(m.gamma)}`],
    [`a ≈ ${cmText(m.a)}`, `β ≈ ${deg(m.beta)}`, `γ ≈ ${deg(m.gamma)}`],
    [`a ≈ ${cmText(m.a)}`, `b ≈ ${cmText(m.b)}`, `γ = ${deg(180 - v.alpha - v.beta)}`],
    [`b ≈ ${cmText(m.b)}`, `β ≈ ${deg(m.beta)}`, `γ ≈ ${deg(m.gamma)}`],
  ][v.art];
  return parts.join(", ");
}

/** A pair of triangles ABC and DEF with three equal pieces, the theorem they form and an extra question. */
interface CongruencePair {
  /** Index in THEOREM_OPTIONS. */
  answer: number;
  /** The case drawn: 0 SSS, 1 SWS, 2 WSW, 3 SWW, 4 SsW, 5 SSW (shorter side), 6 WWW. */
  kind: number;
  lines: string[];
  reason: string;
}

const DEF = ["D", "E", "F"];

function makeCongruencePair(rng: Rng): CongruencePair & { r: number } {
  const roll = rng.next();
  const kind = roll < 0.13 ? 0 : roll < 0.26 ? 1 : roll < 0.39 ? 2 : roll < 0.52 ? 3 : roll < 0.65 ? 4 : roll < 0.84 ? 5 : 6;
  const r = rng.int(0, 2);
  const at = (i: number) => (i + r) % 3;
  // side i joins the vertices i + 1 and i + 2; the angle at vertex i lies between them
  const sideName = (i: number, names: string[]) => pair(names[at(i + 1)], names[at(i + 2)]);
  const angleName = (i: number, names: string[]) => `∢${names[at(i + 1)]}${names[at(i)]}${names[at(i + 2)]}`;
  const side = (i: number, x: number) => `${sideName(i, VERTEX)} = ${sideName(i, DEF)} = ${cm(x)}`;
  const angle = (i: number, x: number) => `${angleName(i, VERTEX)} = ${angleName(i, DEF)} = ${x}°`;
  const sideOf = (i: number) => sideName(i, VERTEX);
  const angleOf = (i: number) => angleName(i, VERTEX);
  if (kind === 0) {
    const s = draw(
      () => [rng.stepped(3, 9, 0.5), rng.stepped(3, 9, 0.5), rng.stepped(3, 9, 0.5)],
      (t) => sideCheck(t[0], t[1], t[2]).meet === "two",
      [5, 6, 7],
    );
    return { kind, r, answer: 0, lines: [0, 1, 2].map((i) => side(i, s[i])), reason: "Alle drei Seiten stimmen überein: SSS." };
  }
  if (kind === 1) {
    return {
      kind,
      r,
      answer: 1,
      lines: [side(1, rng.stepped(3, 9, 0.5)), side(2, rng.stepped(3, 9, 0.5)), angle(0, multiple(rng, 20, 140, 5))],
      reason: `Der Winkel ${angleOf(0)} liegt zwischen den Seiten [${sideOf(1)}] und [${sideOf(2)}]: SWS.`,

    };
  }
  if (kind === 2 || kind === 3) {
    const p = multiple(rng, 25, 110, 5);
    const q = multiple(rng, 20, 155 - p, 5);
    const s0 = rng.stepped(3, 9, 0.5);
    return kind === 2
      ? { kind, r, answer: 2, lines: [side(0, s0), angle(1, p), angle(2, q)], reason: `Die Winkel ${angleOf(1)} und ${angleOf(2)} liegen an den Enden der Seite [${sideOf(0)}]: WSW.` }
      : {
          kind,
          r,
          answer: 2,
          lines: [side(0, s0), angle(1, p), angle(0, q)],
          reason: `${angleOf(1)} liegt an der Seite [${sideOf(0)}], ${angleOf(0)} ihr gegenüber; der dritte Winkel stimmt wegen der Winkelsumme auch überein: SWW, also WSW.`,

        };
  }
  const short = rng.stepped(3, 7, 0.5);
  const long = short + rng.stepped(0.5, 3, 0.5);
  if (kind === 4) {
    return {
      kind,
      r,
      answer: 3,
      lines: [side(0, long), side(1, short), angle(0, multiple(rng, 30, 140, 5))],
      reason: `Der Winkel ${angleOf(0)} liegt der Seite [${sideOf(0)}] gegenüber, und sie ist die längere der beiden: SsW.`,

    };
  }
  if (kind === 5) {
    // the angle opposite the shorter side, with values for which two different triangles really exist
    const [s5, l5, w5] = draw(
      () => {
        const s = rng.stepped(3, 7, 0.5);
        return [s, s + rng.stepped(0.5, 3, 0.5), multiple(rng, 25, 70, 5)];
      },
      ([s, l, w]) => s > l * sinD(w) + 0.25,
      [4, 5, 40],
    );
    return {
      kind,
      r,
      answer: 4,
      lines: [side(0, s5), side(1, l5), angle(0, w5)],
      reason: `Der Winkel ${angleOf(0)} liegt der Seite [${sideOf(0)}] gegenüber, und das ist die kürzere der beiden Seiten. Dann kann es zwei verschiedene Dreiecke geben.`,
    };
  }
  const p = multiple(rng, 30, 100, 5);
  const q = multiple(rng, 25, 150 - p, 5);
  return {
    kind,
    r,
    answer: 4,
    lines: [angle(0, p), angle(1, q), angle(2, 180 - p - q)],
    reason: "Nur die drei Winkel stimmen überein: Die Dreiecke haben dieselbe Form, können aber verschieden groß sein.",
  };
}

/** The figure contexts of 1.3: which theorem and which conclusion. */
export const FIGURE_CONTEXTS = ["Parallelogramm", "Drachenviereck", "gleichschenkliges Dreieck", "Schmetterling", "Rechteck", "Flussbreite"];

const kongruenz: Lesson = {
  id: "dv-3-kongruenz",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Die Kongruenzsätze",
  subtitle: "Drei passende Stücke genügen, aber nicht jede Wahl",
  tracks: ["II_III"],
  lehrplan: `${II}: Kongruenzsätze`,
  whyItMatters:
    "Mit einem Kongruenzsatz zeigst du, dass zwei Dreiecke in allen Seiten und Winkeln übereinstimmen, ohne sie auszumessen. So begründest du etwa, warum eine Diagonale ein Parallelogramm in zwei gleiche Hälften teilt oder wie man eine Flussbreite vom Ufer aus misst.",
  explanationHtml: `
    <p><strong>Kongruent</strong> heißt deckungsgleich: Zwei Figuren sind kongruent, wenn man die eine durch Achsenspiegelungen und Parallelverschiebungen (M6, M7), auch nacheinander ausgeführt, genau auf die andere legen kann. Man schreibt ABC ≅ DEF. Die Reihenfolge der Buchstaben sagt, welche Ecken einander entsprechen: A ↦ D, B ↦ E, C ↦ F. Entsprechende Seiten und Winkel sind gleich groß, also AB = DE, ∢BAC = ∢EDF und so weiter.</p>
    <p>Du musst nicht alle sechs Stücke vergleichen. Die <strong>Kongruenzsätze</strong> sagen: Zwei Dreiecke sind schon kongruent, wenn sie übereinstimmen in</p>
    <ul>
      <li><strong>SSS:</strong> allen drei Seiten,</li>
      <li><strong>SWS:</strong> zwei Seiten und dem Winkel, den diese Seiten einschließen,</li>
      <li><strong>WSW:</strong> einer Seite und den beiden Winkeln an ihren Enden; wegen der Winkelsumme genügt auch eine Seite, ein anliegender und der gegenüberliegende Winkel (SWW),</li>
      <li><strong>SsW:</strong> zwei Seiten und dem Winkel, der der längeren dieser Seiten gegenüberliegt.</li>
    </ul>
    <p>Der Grund steckt in Lektion 1.2: Genau diese Stücke legen die Konstruktion eindeutig fest. Jedes Dreieck mit denselben Stücken ist also dasselbe Dreieck, höchstens verschoben oder gespiegelt.</p>
    <p><strong>Keine Kongruenzsätze:</strong> Bei <em>WWW</em> legen drei gleiche Winkel nur die Form fest; ein kleines und ein großes Dreieck mit 50°, 60° und 70° sind nicht kongruent. Bei <em>SSW mit dem Winkel gegenüber der kürzeren Seite</em> kann der Zirkelkreis den freien Schenkel zweimal schneiden, und es entstehen zwei verschiedene Dreiecke.</p>
    <div class="example"><strong>Beispiel:</strong> Im Dreieck ABC sind AB = 5 cm, BC = 7 cm und ∢CBA = 40°, im Dreieck DEF sind DE = 5 cm, EF = 7 cm und ∢FED = 40°. Der Winkel liegt jeweils zwischen den beiden Seiten: Nach SWS ist ABC ≅ DEF mit A ↦ D, B ↦ E und C ↦ F. Daraus folgt ohne Nachmessen AC = DF und ∢ACB = ∢DFE.<br>Ein zweites Paar: Beide Dreiecke haben a = 4 cm, c = 6 cm und α = 35°. Der Winkel α liegt a gegenüber, und a ist die <em>kürzere</em> der beiden Seiten. Daraus folgt keine Kongruenz.</div>
    <p><strong>Anwenden:</strong> Die Diagonale [AC] zerlegt ein Parallelogramm ABCD in die Dreiecke ABC und CDA. Gegenüberliegende Seiten sind gleich lang (AB = CD, BC = DA), und [AC] gehört zu beiden Dreiecken: Nach SSS sind sie kongruent, also ist ∢CBA = ∢ADC. Beim Drachenviereck zeigst du genauso, dass die Symmetrieachse [AC] die Winkel bei A und C halbiert.</p>
    <p><strong>Typische Fehler:</strong> bei SWS einen Winkel nehmen, der nicht zwischen den beiden Seiten liegt; die Ecken falsch zuordnen; aus drei gleichen Winkeln auf Kongruenz schließen.</p>
    <div class="merke"><strong>Merke:</strong> Zwei Dreiecke sind kongruent, wenn sie nach SSS, SWS, WSW (oder SWW) oder SsW übereinstimmen. WWW und SSW mit dem Winkel gegenüber der kürzeren Seite reichen nicht. In kongruenten Dreiecken sind entsprechende Seiten und Winkel gleich groß.</div>
  `,
  formulas: [
    { name: "Kongruent", html: "ABC ≅ DEF: A ↦ D, B ↦ E, C ↦ F", quantities: "entsprechende Seiten und Winkel sind gleich groß" },
    { name: "Kongruenzsätze", html: "SSS, SWS, WSW (SWW), SsW", quantities: "SWS: der Winkel liegt zwischen den Seiten; SsW: er liegt der längeren Seite gegenüber" },
    { name: "Kein Kongruenzsatz", html: "WWW; SSW mit dem Winkel gegenüber der kürzeren Seite", quantities: "WWW: gleiche Form, verschiedene Größe möglich" },
  ],
  quiz: {
    question: "Zwei Dreiecke stimmen in allen drei Winkeln überein. Was folgt daraus?",
    options: ["Sie sind kongruent (WWW).", "Sie haben dieselbe Form, können aber verschieden groß sein.", "Sie haben denselben Flächeninhalt.", "Sie sind beide gleichschenklig."],
    correctIndex: 1,
    explanation:
      "Gleiche Winkel legen nur die Form fest. Ein Dreieck mit 50°, 60° und 70° kannst du klein oder groß zeichnen; die beiden sind nicht deckungsgleich. WWW ist deshalb kein Kongruenzsatz.",
  },
  lab: {
    kind: "congruence",
    title: "Labor: Welche Dreiecke passen?",
    intro:
      "Wähle, welche drei Stücke gegeben sind, und stelle sie ein. Die Zeichnung zeigt jedes Dreieck über [AB], das dazu passt: eines (das gestrichelte Spiegelbild ist dasselbe Dreieck), zwei verschiedene oder bei WWW unendlich viele verschieden große.",
    params: [
      {
        type: "choice",
        key: "art",
        label: "Gegeben sind",
        options: [
          { value: 0, label: "drei Seiten (SSS)" },
          { value: 1, label: "zwei Seiten und der Winkel dazwischen (SWS)" },
          { value: 2, label: "eine Seite und die Winkel an ihren Enden (WSW)" },
          { value: 3, label: "zwei Seiten und ein Gegenwinkel" },
          { value: 4, label: "drei Winkel (WWW)" },
        ],
        value: 0,
      },
      { type: "range", key: "c", label: "Seite c = [AB]", unit: "cm", min: 2, max: 8, step: 0.5, value: 6, digits: 1, showIf: (v) => v.art !== 4 },
      { type: "range", key: "a", label: "Seite a = [BC]", unit: "cm", min: 2, max: 8, step: 0.5, value: 5, digits: 1, showIf: (v) => v.art === 0 || v.art === 3 },
      { type: "range", key: "b", label: "Seite b = [CA]", unit: "cm", min: 2, max: 8, step: 0.5, value: 4, digits: 1, showIf: (v) => v.art === 0 || v.art === 1 },
      { type: "range", key: "alpha", label: "Winkel α bei A", unit: "°", min: 10, max: 170, step: 5, value: 50, showIf: (v) => v.art !== 0 },
      { type: "range", key: "beta", label: "Winkel β bei B", unit: "°", min: 10, max: 170, step: 5, value: 60, showIf: (v) => v.art === 2 || v.art === 4 },
    ],
    readouts: [
      {
        key: "anzahl",
        label: "Passende Dreiecke",
        emphasis: true,
        compute: (v) => ({ eins: "genau eines (bis auf die Lage)", zwei: "zwei, nicht kongruent", keins: "keines", unendlich: "unendlich viele verschiedene Größen" })[congruenceResult(v).count],
      },
      { key: "satz", label: "Kongruenzsatz", compute: theoremReadout },
      { key: "stuecke", label: "Die übrigen Stücke (gemessen)", compute: piecesReadout },
    ],
    goals: [
      {
        id: "zwei",
        text: "Zwei Seiten und ein Gegenwinkel: Finde Werte, zu denen zwei nicht kongruente Dreiecke passen. Welcher Seite liegt α dann gegenüber, der längeren oder der kürzeren?",
        check: (v) => v.art === 3 && congruenceResult(v).count === "zwei",
      },
      {
        id: "stumpf",
        text: "Zwei Seiten und ein Gegenwinkel: Stelle α stumpf ein und suche das kürzeste a (in Schritten von 0,5 cm), für das es noch ein Dreieck gibt. Warum muss a länger sein als c?",
        check: (v) => v.art === 3 && v.alpha > 90 && congruenceResult(v).count === "eins" && Math.abs(v.a - (v.c + 0.5)) < 1e-9,
      },
      {
        id: "gleichseitig",
        text: "WWW: Stelle die Winkel so ein, dass alle passenden Dreiecke gleichseitig sind. Sind zwei gleichseitige Dreiecke deshalb immer kongruent?",
        check: (v) => v.art === 4 && v.alpha === 60 && v.beta === 60,
      },
    ],
  },
  exercises: [
    {
      id: "satz",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const t = makeCongruencePair(rng);
          const shown = rng.shuffle(t.lines);
          // the same two questions for every pair: the theorem and its reason, chosen among all reasons
          const reason = CONGRUENCE_REASONS[t.kind];
          const others = rng.shuffle(CONGRUENCE_REASONS.filter((_, k) => k !== t.kind)).slice(0, 3);
          const fields: ChoiceField[] = [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, t.answer), shuffledChoice(rng, "Begründung:", reason, others)];
          return {
            prompt: "Von den Dreiecken ABC und DEF kennst du die unten stehenden Stücke; dabei entspricht A dem Punkt D, B dem Punkt E und C dem Punkt F. Nach welchem Kongruenzsatz sind die Dreiecke kongruent, oder lässt es sich nicht entscheiden? Wähle auch die Begründung.",
            given: shown,
            formulaHint: "Wo liegt der Winkel: zwischen den Seiten (SWS), an der Seite (WSW), gegenüber der längeren Seite (SsW)? WWW und SSW mit dem Winkel gegenüber der kürzeren Seite reichen nicht.",
            fields,
            steps: [t.reason, `<strong>${THEOREM_OPTIONS[t.answer]}: ${reason}</strong>`],
            meta: { kind: t.kind, r: t.r, answer: t.answer },
          };
        }
        const ctx = rng.int(0, 5);
        if (ctx === 0) {
          const x = draw(() => multiple(rng, 50, 130, 2), (n) => n !== 90, 64);
          return {
            prompt: `Die Diagonale [AC] zerlegt das Parallelogramm ABCD in die Dreiecke ABC und CDA. Bekannt ist: AB = CD und BC = DA (gegenüberliegende Seiten), und [AC] gehört zu beiden Dreiecken. Nach welchem Kongruenzsatz sind die Dreiecke kongruent? Wie groß ist ∢ADC, wenn ∢CBA = ${x}° ist?`,
            given: ["AB = CD", "BC = DA", "[AC] gemeinsam", `∢CBA = ${x}°`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 0), numberField("∢ADC =", x, "°", 0, { slips: [{ value: 180 - x, hint: "∢ADC entspricht dem Winkel bei B im kongruenten Dreieck; er ist gleich groß, nicht die Ergänzung zu 180°." }] })],
            steps: ["Drei Paare gleich langer Seiten: AB = CD, BC = DA und die gemeinsame Seite [AC]. Das ist SSS.", "Bei ABC ≅ CDA entspricht B dem Punkt D, also ist ∢ADC = ∢CBA.", `<strong>SSS; ∢ADC = ${x}°</strong>`],
            meta: { ctx, x, answer: x },
          };
        }
        if (ctx === 1) {
          const y = rng.int(20, 70);
          return {
            prompt: `Im Drachenviereck ABCD gilt AB = AD und CB = CD. Die Diagonale [AC] zerlegt es in die Dreiecke ABC und ADC. Nach welchem Kongruenzsatz sind sie kongruent? Wie groß ist der Winkel ∢BAD bei A, wenn ∢BAC = ${y}° ist?`,
            given: ["AB = AD", "CB = CD", "[AC] gemeinsam", `∢BAC = ${y}°`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 0), numberField("∢BAD =", 2 * y, "°", 0, { slips: [{ value: y, hint: "Das ist nur die Hälfte: ∢BAD besteht aus ∢BAC und dem gleich großen ∢CAD." }] })],
            steps: ["AB = AD, CB = CD und die gemeinsame Seite [AC]: SSS.", `Also ist ∢CAD = ∢BAC = ${y}°: Die Diagonale [AC] halbiert den Winkel bei A.`, `<strong>SSS; ∢BAD = 2 · ${y}° = ${2 * y}°</strong>`],
            meta: { ctx, y, answer: 2 * y },
          };
        }
        if (ctx === 2) {
          const gamma = multiple(rng, 30, 140, 2);
          return {
            prompt: `Im gleichschenkligen Dreieck ABC ist AC = BC. M ist der Mittelpunkt der Basis [AB]. Die Strecke [CM] zerlegt das Dreieck in die Dreiecke AMC und BMC. Nach welchem Kongruenzsatz sind sie kongruent? Wie groß ist ∢ACM, wenn der Winkel an der Spitze ∢ACB = ${gamma}° beträgt?`,
            given: ["AC = BC", "AM = BM", "[CM] gemeinsam", `∢ACB = ${gamma}°`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 0), numberField("∢ACM =", gamma / 2, "°", 0, { slips: [{ value: gamma, hint: "[CM] teilt den Winkel an der Spitze in zwei gleich große Teile." }, { value: (180 - gamma) / 2, hint: "Das ist ein Basiswinkel. Gesucht ist der Teil des Winkels an der Spitze." }] })],
            steps: ["AC = BC, AM = BM und die gemeinsame Seite [CM]: SSS.", "Entsprechende Winkel sind gleich groß: ∢ACM = ∢MCB. Zusammen ergeben sie ∢ACB.", `<strong>SSS; ∢ACM = ${gamma}° : 2 = ${fmt(gamma / 2)}°</strong>`],
            meta: { ctx, gamma, answer: gamma / 2 },
          };
        }
        if (ctx === 3) {
          const s = rng.stepped(2.5, 7, 0.1);
          return {
            prompt: `Die Strecken [AD] und [BE] schneiden sich im Punkt M, und M ist der Mittelpunkt beider Strecken: AM = DM und BM = EM. Die Winkel ∢BMA und ∢EMD sind Scheitelwinkel. Nach welchem Kongruenzsatz sind die Dreiecke ABM und DEM kongruent? Wie lang ist [DE], wenn AB = ${cm(s)} ist?`,
            given: ["AM = DM", "BM = EM", "∢BMA = ∢EMD (Scheitelwinkel)", `AB = ${cm(s)}`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 1), numberField("DE =", s, "cm", 1)],
            steps: ["Zwei Seiten (AM = DM, BM = EM) und der Winkel zwischen ihnen bei M stimmen überein: SWS.", "Bei ABM ≅ DEM entspricht [AB] der Seite [DE].", `<strong>SWS; DE = ${cm(s)}</strong>`],
            meta: { ctx, s, answer: s },
          };
        }
        if (ctx === 4) {
          const d = rng.stepped(4, 12, 0.1);
          return {
            prompt: `Im Rechteck ABCD betrachtest du die Dreiecke ABC und BAD. Die Seite [AB] gehört zu beiden, BC = AD, und die Winkel bei B und bei A sind rechte Winkel. Nach welchem Kongruenzsatz sind die Dreiecke kongruent? Wie lang ist die Diagonale [BD], wenn AC = ${cm(d)} ist?`,
            given: ["[AB] gemeinsam", "BC = AD", "∢CBA = ∢BAD = 90°", `AC = ${cm(d)}`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 1), numberField("BD =", d, "cm", 1)],
            steps: ["Zwei Seiten ([AB] und BC = AD) und der rechte Winkel zwischen ihnen: SWS.", "Bei ABC ≅ BAD entspricht die Diagonale [AC] der Diagonale [BD]: Im Rechteck sind die Diagonalen gleich lang.", `<strong>SWS; BD = ${cm(d)}</strong>`],
            meta: { ctx, d, answer: d },
          };
        }
        const p = rng.int(15, 40);
        const w = rng.int(20, 60);
        return {
          prompt: `Um die Breite AB eines Flusses zu bestimmen, geht Tim vom Punkt A am Ufer aus senkrecht zu AB am Ufer entlang ${p} m bis C und dann noch einmal ${p} m weiter bis D. Von D aus geht er senkrecht vom Fluss weg, bis er einen Punkt E erreicht, von dem aus C und der Baum B am anderen Ufer genau hintereinander liegen. Er misst DE = ${w} m. Nach welchem Kongruenzsatz sind die Dreiecke ABC und DEC kongruent? Wie breit ist der Fluss?`,
          given: ["AC = DC", "∢CAB = ∢CDE = 90°", "∢BCA = ∢ECD (Scheitelwinkel)", `DE = ${w} m`],
          fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 2), numberField("AB =", w, "m", 0, { slips: [{ value: p, hint: "Das ist der Weg am Ufer. Die Flussbreite AB entspricht im kongruenten Dreieck der Strecke [DE]." }, { value: 2 * p, hint: "Das ist der ganze Weg am Ufer. Die Flussbreite AB entspricht der Strecke [DE]." }] })],
          steps: [`Die Seite AC = DC = ${p} m, an ihrem Ende A bzw. D je ein rechter Winkel, an ihrem Ende C die Scheitelwinkel: WSW.`, "Bei ABC ≅ DEC entspricht [AB] der Strecke [DE].", `<strong>WSW; der Fluss ist ${w} m breit.</strong>`],
          meta: { ctx, p, w, answer: w },
        };
      },
    },
    {
      id: "stuecke",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const perm = draw(() => rng.shuffle([0, 1, 2]), (p) => p[0] !== 0 || p[1] !== 1, [1, 2, 0]);
          const img = (i: number) => DEF[perm[i]];
          const [alpha, beta] = draw(
            () => [rng.int(30, 100), rng.int(25, 100)],
            ([a, b]) => a + b <= 155 && Math.abs(a - b) >= 5 && Math.abs(180 - a - b - a) >= 5 && Math.abs(180 - a - b - b) >= 5,
            [55, 70],
          );
          const gamma = 180 - alpha - beta;
          const [ab, bc] = draw(() => [rng.stepped(3, 9, 0.1), rng.stepped(3, 9, 0.1)], ([x, y]) => Math.abs(x - y) >= 0.5, [5.2, 6.4]);
          const sideName = pair(img(0), img(1));
          const angleName = `∢${img(0)}${img(2)}${img(1)}`;
          return {
            prompt: `Die Dreiecke ABC und DEF sind kongruent: ABC ≅ ${img(0)}${img(1)}${img(2)}, also A ↦ ${img(0)}, B ↦ ${img(1)} und C ↦ ${img(2)}. Im Dreieck ABC sind AB = ${cm(ab)}, BC = ${cm(bc)}, ∢BAC = ${alpha}° und ∢CBA = ${beta}°. Wie lang ist [${sideName}], und wie groß ist der Winkel ${angleName} bei ${img(2)}?`,
            given: [`ABC ≅ ${img(0)}${img(1)}${img(2)}`, `AB = ${cm(ab)}`, `BC = ${cm(bc)}`, `∢BAC = ${alpha}°`, `∢CBA = ${beta}°`],
            formulaHint: "Entsprechende Stücke kongruenter Dreiecke sind gleich groß. Winkelsumme: α + β + γ = 180°.",
            fields: [
              numberField(`${sideName} =`, ab, "cm", 1, { slips: [{ value: bc, hint: `Das ist die Länge von [BC]. Zu [${sideName}] gehört die Seite zwischen A und B.` }] }),
              numberField(`${angleName} =`, gamma, "°", 0, {
                slips: [
                  { value: alpha, hint: `Das ist der Winkel bei A. Zur Ecke ${img(2)} gehört die Ecke C.` },
                  { value: beta, hint: `Das ist der Winkel bei B. Zur Ecke ${img(2)} gehört die Ecke C.` },
                ],
              }),
            ],
            steps: [
              `A ↦ ${img(0)} und B ↦ ${img(1)}: [${sideName}] entspricht [AB], also ${sideName} = ${cm(ab)}.`,
              `C ↦ ${img(2)}: Der Winkel bei ${img(2)} entspricht dem Winkel bei C. ∢ACB = 180° − ${alpha}° − ${beta}° = ${gamma}°.`,
              `<strong>${sideName} = ${cm(ab)}; ${angleName} = ${gamma}°</strong>`,
            ],
            meta: { ab, bc, alpha, beta, p0: perm[0], p1: perm[1], p2: perm[2] },
          };
        }
        const ctx = rng.int(0, 3);
        if (ctx === 0) {
          const x = rng.int(25, 65);
          const y = rng.int(Math.max(96 - x, 45), Math.min(150 - x, 125));
          const atC = 2 * (180 - x - y);
          return {
            prompt: `Das Drachenviereck ABCD hat die Symmetrieachse [AC]; die Dreiecke ABC und ADC sind nach SSS kongruent. Es ist ∢BAC = ${x}° und ∢CBA = ${y}°. Berechne ∢ADC und den Winkel ∢DCB bei C.`,
            given: [`∢BAC = ${x}°`, `∢CBA = ${y}°`, "ABC ≅ ADC"],
            fields: [
              numberField("∢ADC =", y, "°", 0, { slips: [{ value: 180 - y, hint: "∢ADC entspricht dem Winkel bei B im kongruenten Dreieck: gleich groß." }] }),
              numberField("∢DCB =", atC, "°", 0, { slips: [{ value: 180 - x - y, hint: "Das ist nur ∢ACB, die Hälfte. Der Winkel bei C besteht aus ∢ACB und dem gleich großen ∢DCA." }] }),
            ],
            steps: [
              `B ↦ D, also ∢ADC = ∢CBA = ${y}°.`,
              `Im Dreieck ABC: ∢ACB = 180° − ${x}° − ${y}° = ${180 - x - y}°. Ebenso groß ist ∢DCA.`,
              `<strong>∢ADC = ${y}°; ∢DCB = 2 · ${180 - x - y}° = ${atC}°</strong>`,
            ],
            meta: { ctx, x, y, a1: y, a2: atC },
          };
        }
        if (ctx === 1) {
          const x = rng.int(20, 60);
          const y = rng.int(20, 60);
          return {
            prompt: `Die Diagonale [AC] zerlegt das Parallelogramm ABCD in die kongruenten Dreiecke ABC und CDA (A ↦ C, B ↦ D, C ↦ A). Es ist ∢BAC = ${x}° und ∢ACB = ${y}°. Berechne den Winkel ∢ADC bei D und den Winkel ∢BAD bei A.`,
            given: [`∢BAC = ${x}°`, `∢ACB = ${y}°`, "ABC ≅ CDA"],
            fields: [
              numberField("∢ADC =", 180 - x - y, "°", 0, { slips: [{ value: x + y, hint: "∢ADC entspricht dem Winkel bei B: 180° minus die beiden anderen Winkel im Dreieck ABC." }] }),
              numberField("∢BAD =", x + y, "°", 0, { slips: [{ value: 2 * x, hint: "∢CAD entspricht ∢ACB (C ↦ A), nicht ∢BAC." }] }),
            ],
            steps: [
              `B ↦ D: ∢ADC = ∢CBA = 180° − ${x}° − ${y}° = ${180 - x - y}°.`,
              `C ↦ A und A ↦ C: ∢CAD = ∢ACB = ${y}°. Also ∢BAD = ∢BAC + ∢CAD = ${x}° + ${y}°.`,
              `<strong>∢ADC = ${180 - x - y}°; ∢BAD = ${x + y}°</strong>`,
            ],
            meta: { ctx, x, y, a1: 180 - x - y, a2: x + y },
          };
        }
        if (ctx === 2) {
          const s = rng.stepped(2.5, 7, 0.1);
          const x = rng.int(30, 80);
          const z = rng.int(40, Math.min(110, 150 - x));
          return {
            prompt: `Die Strecken [AD] und [BE] halbieren sich gegenseitig im Punkt M. Deshalb sind die Dreiecke ABM und DEM nach SWS kongruent (A ↦ D, B ↦ E, M ↦ M). Es ist AB = ${cm(s)}, ∢MAB = ${x}° und ∢BMA = ${z}°. Wie lang ist [DE], und wie groß ist ∢DEM?`,
            given: [`AB = ${cm(s)}`, `∢MAB = ${x}°`, `∢BMA = ${z}°`, "ABM ≅ DEM"],
            fields: [
              numberField("DE =", s, "cm", 1),
              numberField("∢DEM =", 180 - x - z, "°", 0, { slips: [{ value: x, hint: "Das ist der Winkel bei A; ihm entspricht der Winkel bei D. Gesucht ist der Winkel bei E, er entspricht dem bei B." }] }),
            ],
            steps: [`[DE] entspricht [AB]: DE = ${cm(s)}.`, `Der Winkel bei E entspricht dem Winkel bei B: ∢ABM = 180° − ${x}° − ${z}° = ${180 - x - z}°.`, `<strong>DE = ${cm(s)}; ∢DEM = ${180 - x - z}°</strong>`],
            meta: { ctx, s, x, z, a1: s, a2: 180 - x - z },
          };
        }
        const gamma = multiple(rng, 30, 140, 2);
        return {
          prompt: `Im gleichschenkligen Dreieck ABC mit AC = BC ist M der Mittelpunkt der Basis [AB]. Die Dreiecke AMC und BMC sind nach SSS kongruent. Der Winkel an der Spitze ist ∢ACB = ${gamma}°. Berechne ∢ACM und den Basiswinkel ∢MAC.`,
          given: [`∢ACB = ${gamma}°`, "AMC ≅ BMC"],
          fields: [
            numberField("∢ACM =", gamma / 2, "°", 0, { slips: [{ value: gamma, hint: "[CM] halbiert den Winkel an der Spitze." }] }),
            numberField("∢MAC =", (180 - gamma) / 2, "°", 0, { slips: [{ value: 180 - gamma, hint: "Das sind beide Basiswinkel zusammen; jeder ist halb so groß." }] }),
          ],
          steps: [
            `Entsprechende Winkel: ∢ACM = ∢MCB, zusammen ${gamma}°, also je ${fmt(gamma / 2)}°.`,
            `Die Basiswinkel sind gleich groß: (180° − ${gamma}°) : 2 = ${fmt((180 - gamma) / 2)}°.`,
            `<strong>∢ACM = ${fmt(gamma / 2)}°; ∢MAC = ${fmt((180 - gamma) / 2)}°</strong>`,
          ],
          meta: { ctx, gamma, a1: gamma / 2, a2: (180 - gamma) / 2 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst, welche drei Stücke ein Dreieck festlegen, und schließt daraus auf gleiche Seiten und Winkel.",
};

// ─── Vierecke (both Zweige) ────────────────────────────────────────────────

const BOTH = "M8 LB 1 (I) · M8 LB 1 (II/III)";
const QUAD = ["A", "B", "C", "D"];

// Column vectors and vector names in HTML, as in Mathematik 10 (no CSS class of the app draws them).
const COLUMN_STYLE =
  "display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;padding:0.05em 0.38em;margin:0 0.12em;border-left:1.5px solid currentColor;border-right:1.5px solid currentColor;border-radius:0.65em / 50%";

/** A column vector (x over y) in round brackets. */
function vecHtml(x: number, y: number): string {
  return `<span class="vec" style="${COLUMN_STYLE}"><span>${fmt(x)}</span><span>${fmt(y)}</span></span>`;
}

/** A vector name with the arrow above it: vn("BC") is BC→. */
function vn(name: string): string {
  return `<span class="vname" style="display:inline-block;position:relative;line-height:1;padding-top:0.42em"><span aria-hidden="true" style="position:absolute;left:0;right:0;top:0;text-align:center;font-size:0.7em;line-height:0.8">⟶</span>${name}</span>`;
}

const pt = (x: number, y: number): string => `(${fmt(x)} | ${fmt(y)})`;

// 1.4 Das Haus der Vierecke ────────────────────────────────────────────────

/** The names a quadrilateral is most easily confused with, the wrong options of the tasks. */
export const QUAD_NEIGHBOURS: Record<string, string[]> = {
  Quadrat: ["Rechteck", "Raute", "Parallelogramm"],
  Rechteck: ["Quadrat", "Parallelogramm", "gleichschenkliges Trapez"],
  Raute: ["Quadrat", "Parallelogramm", "Drachenviereck"],
  Parallelogramm: ["Rechteck", "Raute", "Trapez"],
  "gleichschenkliges Trapez": ["Trapez", "Rechteck", "Parallelogramm"],
  Trapez: ["gleichschenkliges Trapez", "Parallelogramm", "Drachenviereck"],
  Drachenviereck: ["Raute", "Quadrat", "Trapez"],
};

/** The number of symmetry axes each name guarantees. */
export const QUAD_AXES: Record<string, number> = { Quadrat: 4, Rechteck: 2, Raute: 2, Parallelogramm: 0, "gleichschenkliges Trapez": 1, Trapez: 0, Drachenviereck: 1 };

const AXIS_SLIPS: Record<string, Array<{ value: number; hint: string }>> = {
  Quadrat: [{ value: 2, hint: "Beim Quadrat sind beide Diagonalen und beide Mittellinien Symmetrieachsen." }],
  Rechteck: [{ value: 4, hint: "Die Diagonalen eines Rechtecks sind keine Symmetrieachsen: Faltest du längs einer Diagonale, liegen die Ecken nicht aufeinander." }],
  Raute: [{ value: 4, hint: "Bei der Raute liegen die Symmetrieachsen auf den Diagonalen; durch die Seitenmitten geht keine." }],
  Parallelogramm: [{ value: 2, hint: "Ein Parallelogramm ist nur punktsymmetrisch. Symmetrieachsen hat es erst als Rechteck oder Raute." }],
  "gleichschenkliges Trapez": [{ value: 2, hint: "Das gleichschenklige Trapez hat nur die Achse durch die Mitten der parallelen Seiten." }],
  Trapez: [{ value: 1, hint: "Eine Symmetrieachse hat erst das gleichschenklige Trapez." }],
  Drachenviereck: [{ value: 2, hint: "Beim Drachen ist nur eine Diagonale Symmetrieachse." }],
};

/** Which lines are the symmetry axes of each name. */
const AXIS_TEXT: Record<string, string> = {
  Quadrat: "beide Diagonalen und beide Geraden durch gegenüberliegende Seitenmitten, also 4",
  Rechteck: "die beiden Geraden durch gegenüberliegende Seitenmitten, also 2",
  Raute: "die beiden Diagonalen, also 2",
  Parallelogramm: "keine, es ist nur punktsymmetrisch",
  "gleichschenkliges Trapez": "die Gerade durch die Mitten der parallelen Seiten, also 1",
  Trapez: "keine",
  Drachenviereck: "die Diagonale, die die andere senkrecht halbiert, also 1",
};

interface NamedCase {
  text: string;
  name: string;
  why: string;
}

/** A quadrilateral described by its sides and angles (1.4, Level 1). */
function propertyCase(rng: Rng): NamedCase & { kind: number; params: Record<string, number> } {
  const kind = rng.int(0, 6);
  const s = rng.stepped(3, 8, 0.5);
  const t = draw(() => rng.stepped(2, 7.5, 0.5), (x) => x !== s, s === 7.5 ? 4 : s + 0.5);
  const phi = multiple(rng, 40, 85, 5);
  if (kind === 0) return { params: { s, t, phi, psi: 0 }, kind, name: "Raute", text: `Alle vier Seiten sind ${cm(s)} lang; die Winkel betragen ${phi}°, ${180 - phi}°, ${phi}° und ${180 - phi}°.`, why: "Vier gleich lange Seiten, aber kein rechter Winkel: eine Raute, kein Quadrat." };
  if (kind === 1) return { params: { s, t, phi, psi: 0 }, kind, name: "Rechteck", text: `Alle vier Winkel sind rechte Winkel; die Seiten sind ${cm(s)}, ${cm(t)}, ${cm(s)} und ${cm(t)} lang.`, why: "Vier rechte Winkel, aber benachbarte Seiten verschieden lang: ein Rechteck, kein Quadrat." };
  if (kind === 2) return { params: { s, t, phi, psi: 0 }, kind, name: "Quadrat", text: `Alle vier Seiten sind ${cm(s)} lang, und ein Winkel ist ein rechter Winkel.`, why: "Vier gleich lange Seiten (Raute) und ein rechter Winkel: ein Quadrat." };
  if (kind === 3)
    return {
      params: { s, t, phi, psi: 0 },
      kind,
      name: "Parallelogramm",
      text: `Gegenüberliegende Seiten sind parallel; die Seiten sind ${cm(s)}, ${cm(t)}, ${cm(s)} und ${cm(t)} lang, die Winkel ${phi}°, ${180 - phi}°, ${phi}° und ${180 - phi}°.`,
      why: "Zwei Paare paralleler Seiten, aber weder ein rechter Winkel noch vier gleich lange Seiten: ein Parallelogramm.",
    };
  if (kind === 4) return { params: { s, t, phi, psi: 0 }, kind, name: "gleichschenkliges Trapez", text: `AB ∥ CD, die Winkel bei A und bei B sind beide ${phi}° groß, und [AB] ist länger als [CD].`, why: "Ein Paar paralleler Seiten mit gleich großen Basiswinkeln: Die Mittelsenkrechte von [AB] ist Symmetrieachse, also ein gleichschenkliges Trapez." };
  if (kind === 5) {
    const psi = draw(() => multiple(rng, 40, 85, 5), (x) => x !== phi, phi === 60 ? 70 : 60);
    return { params: { s, t, phi, psi }, kind, name: "Trapez", text: `AB ∥ CD, der Winkel bei A ist ${phi}° groß, der Winkel bei B ${psi}°.`, why: "Ein Paar paralleler Seiten, aber verschieden große Basiswinkel: ein Trapez, kein gleichschenkliges, und wegen α + β < 180° kein Parallelogramm." };
  }
  return { params: { s, t, phi, psi: 0 }, kind, name: "Drachenviereck", text: `Es gilt AB = AD = ${cm(s)} und CB = CD = ${cm(t)}.`, why: `Zwei Paare gleich langer Nachbarseiten: Die Diagonale [AC] ist Symmetrieachse. Weil ${cm(s)} und ${cm(t)} verschieden sind, ist es keine Raute.` };
}

/** A quadrilateral given only by its diagonals: two sticks whose ends are the corners (1.4, Level 2). */
function diagonalCase(rng: Rng): NamedCase & { kind: number; params: Record<string, number> } {
  const kind = rng.int(0, 6);
  const p = rng.int(30, 90);
  const q = draw(() => rng.int(30, 90), (x) => Math.abs(x - p) >= 10, p >= 60 ? p - 20 : p + 20);
  const long = Math.max(p, q);
  const short = Math.min(p, q);
  const corners = "Ihre Enden sind die Ecken eines Vierecks.";
  if (kind === 0)
    return {
      params: { p, q, u: 0, w: 0 },
      kind,
      name: "Rechteck",
      text: `Ein Schreiner prüft einen viereckigen Fensterrahmen. Er misst beide Diagonalen: Sie sind je ${p} cm lang und halbieren sich gegenseitig.`,
      why: "Diagonalen, die sich halbieren: ein Parallelogramm. Sind sie zudem gleich lang, ist es ein Rechteck. Ob sie senkrecht aufeinander stehen, weiß er nicht.",
    };
  if (kind === 1)
    return {
      params: { p, q, u: 0, w: 0 },
      kind,
      name: "Drachenviereck",
      text: `Für ein Fensterbild werden zwei Leisten, ${long} cm und ${short} cm lang, senkrecht zueinander verbunden. Die lange Leiste trifft die kurze genau in deren Mitte, die kurze die lange aber nicht in der Mitte. Die Leistenenden sind die Ecken eines Vierecks.`,
      why: "Die lange Diagonale halbiert die kurze senkrecht: Sie ist Symmetrieachse. Weil die kurze die lange nicht halbiert, ist es keine Raute.",
    };
  if (kind === 2) return { params: { p, q, u: 0, w: 0 }, kind, name: "Quadrat", text: `Zwei gleich lange Stäbe, je ${p} cm, kreuzen sich in ihren Mitten unter einem rechten Winkel. ${corners}`, why: "Die Diagonalen halbieren sich (Parallelogramm), sind gleich lang (Rechteck) und stehen senkrecht (Raute): ein Quadrat." };
  if (kind === 3) return { params: { p, q, u: 0, w: 0 }, kind, name: "Raute", text: `Zwei Stäbe, ${long} cm und ${short} cm lang, kreuzen sich in ihren Mitten unter einem rechten Winkel. ${corners}`, why: "Die Diagonalen halbieren sich senkrecht, sind aber verschieden lang: eine Raute." };
  if (kind === 4) return { params: { p, q, u: 0, w: 0 }, kind, name: "Parallelogramm", text: `Zwei Stäbe, ${long} cm und ${short} cm lang, kreuzen sich in ihren Mitten, aber nicht unter einem rechten Winkel. ${corners}`, why: "Die Diagonalen halbieren sich, sind aber weder gleich lang noch senkrecht: ein Parallelogramm." };
  if (kind === 5) return { params: { p, q, u: 0, w: 0 }, kind, name: "Rechteck", text: `Zwei gleich lange Stäbe, je ${p} cm, kreuzen sich in ihren Mitten, aber nicht unter einem rechten Winkel. ${corners}`, why: "Die Diagonalen halbieren sich und sind gleich lang, stehen aber nicht senkrecht: ein Rechteck, kein Quadrat." };
  const u = rng.int(10, 40);
  const w = draw(() => rng.int(10, 40), (x) => Math.abs(x - u) >= 5, u + 10);
  return {
    params: { p, q, u, w },
    kind,
    name: "gleichschenkliges Trapez",
    text: `Zwei gleich lange Stäbe [AC] und [BD] kreuzen sich im Punkt S, und zwar so, dass AS = BS = ${u} cm und CS = DS = ${w} cm ist. Die Enden A, B, C und D sind die Ecken eines Vierecks.`,
    why: "Die Diagonalen sind gleich lang und teilen sich im gleichen Verhältnis, halbieren sich aber nicht. Die Figur ist symmetrisch zur Winkelhalbierenden bei S, und AB ∥ CD: ein gleichschenkliges Trapez.",
  };
}

/** True and false statements about the Haus der Vierecke, with the reason. */
export const STATEMENTS: Array<[string, boolean, string]> = [
  ["Jedes Quadrat ist ein Rechteck.", true, "Ein Quadrat ist ein Parallelogramm mit rechtem Winkel, also ein Rechteck."],
  ["Jedes Rechteck ist ein Quadrat.", false, "Benachbarte Seiten eines Rechtecks dürfen verschieden lang sein."],
  ["Jede Raute ist ein Parallelogramm.", true, "Bei vier gleich langen Seiten sind die Gegenseiten parallel."],
  ["Jedes Parallelogramm ist eine Raute.", false, "Die Seiten eines Parallelogramms müssen nicht alle gleich lang sein."],
  ["Jede Raute ist ein Drachenviereck.", true, "Bei der Raute sind sogar beide Diagonalen Symmetrieachsen."],
  ["Jedes Drachenviereck ist eine Raute.", false, "Beim Drachen sind nur die Nachbarseiten paarweise gleich lang."],
  ["Jedes Rechteck ist ein gleichschenkliges Trapez.", true, "Es hat parallele Gegenseiten und eine Symmetrieachse durch deren Mitten."],
  ["Jedes Parallelogramm ist ein Trapez.", true, "Ein Trapez braucht ein Paar paralleler Seiten; das Parallelogramm hat sogar zwei."],
  ["Jedes Trapez ist ein Parallelogramm.", false, "Ein Trapez braucht nur ein Paar paralleler Seiten."],
  ["Jedes Quadrat ist eine Raute.", true, "Ein Quadrat hat vier gleich lange Seiten."],
  ["Jede Raute ist ein Quadrat.", false, "Eine Raute braucht keinen rechten Winkel."],
  ["Jedes gleichschenklige Trapez ist ein Rechteck.", false, "Seine Basiswinkel müssen keine rechten Winkel sein."],
  ["Die Diagonalen jedes Rechtecks sind gleich lang.", true, "Die Symmetrieachse durch die Seitenmitten bildet die eine Diagonale auf die andere ab."],
  ["Die Diagonalen jedes Rechtecks stehen senkrecht aufeinander.", false, "Das gilt nur beim Quadrat."],
  ["Die Diagonalen jeder Raute stehen senkrecht aufeinander.", true, "Sie sind Symmetrieachsen und halbieren sich senkrecht."],
  ["Die Diagonalen jedes Parallelogramms halbieren sich.", true, "Eine halbe Drehung um den Diagonalenschnittpunkt bildet das Parallelogramm auf sich ab."],
  ["Die Diagonalen jedes Parallelogramms sind gleich lang.", false, "Das gilt nur, wenn es ein Rechteck ist."],
  ["Jedes Parallelogramm ist achsensymmetrisch.", false, "Es ist punktsymmetrisch; Symmetrieachsen hat es erst als Rechteck oder Raute."],
  ["Jedes Drachenviereck hat zueinander senkrechte Diagonalen.", true, "Die Symmetrieachse steht senkrecht auf der anderen Diagonale."],
  ["In jedem gleichschenkligen Trapez sind die Diagonalen gleich lang.", true, "Die Symmetrieachse bildet die eine Diagonale auf die andere ab."],
  ["Jedes Quadrat ist ein Drachenviereck.", true, "Seine Diagonalen sind Symmetrieachsen."],
  ["Jedes Trapez hat eine Symmetrieachse.", false, "Eine Symmetrieachse hat erst das gleichschenklige Trapez."],
];

/** "zugleich X und Y": the most special name such a quadrilateral surely has, and its fewest symmetry axes. */
export const COMBOS: Array<[string, string, string]> = [
  ["zugleich ein Drachenviereck und ein Trapez", "Raute", "Ein Drachen mit einem Paar paralleler Seiten hat wegen der Symmetrie auch das zweite Paar parallel; mit den gleichen Nachbarseiten sind alle vier Seiten gleich lang."],
  ["zugleich ein Drachenviereck und ein Parallelogramm", "Raute", "Im Parallelogramm sind Gegenseiten gleich lang, im Drachen Nachbarseiten: Also sind alle vier Seiten gleich lang."],
  ["zugleich ein Drachenviereck und ein Rechteck", "Quadrat", "Ein Rechteck, dessen Diagonale Symmetrieachse ist, hat gleich lange Nachbarseiten."],
  ["zugleich eine Raute und ein Rechteck", "Quadrat", "Vier gleich lange Seiten und vier rechte Winkel."],
  ["zugleich ein gleichschenkliges Trapez und ein Parallelogramm", "Rechteck", "Die Symmetrieachse macht die Basiswinkel gleich groß; im Parallelogramm ergänzen sie sich zu 180°, also je 90°."],
  ["zugleich eine Raute und ein gleichschenkliges Trapez", "Quadrat", "Gleich große Basiswinkel, die sich zu 180° ergänzen, sind rechte Winkel; dazu vier gleich lange Seiten."],
  ["ein Parallelogramm mit einem rechten Winkel", "Rechteck", "Das ist die Festlegung des Rechtecks."],
  ["ein Parallelogramm mit zueinander senkrechten Diagonalen", "Raute", "Diagonalen, die sich senkrecht halbieren, gehören zur Raute."],
  ["ein Parallelogramm mit gleich langen Diagonalen", "Rechteck", "Diagonalen, die sich halbieren und gleich lang sind, gehören zum Rechteck."],
  ["ein Rechteck mit zueinander senkrechten Diagonalen", "Quadrat", "Dann ist es auch eine Raute, also ein Quadrat."],
  ["eine Raute mit gleich langen Diagonalen", "Quadrat", "Dann ist sie auch ein Rechteck, also ein Quadrat."],
  ["ein Drachenviereck, dessen Diagonalen sich gegenseitig halbieren", "Raute", "Halbieren sich die Diagonalen, ist es ein Parallelogramm; ein Drachen, der Parallelogramm ist, ist eine Raute."],
  ["ein Trapez mit einer Symmetrieachse durch die Mitten der parallelen Seiten", "gleichschenkliges Trapez", "Das ist die Festlegung des gleichschenkligen Trapezes."],
  ["ein Trapez, dessen Diagonalen sich gegenseitig halbieren", "Parallelogramm", "Diagonalen, die sich halbieren, gehören zum Parallelogramm."],
];

const familyInfo = (v: LabValues) => quadInfo(familyPoints(v));

const hausDerVierecke: Lesson = {
  id: "dv-4-vierecke",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Das Haus der Vierecke",
  subtitle: "Besondere Vierecke an Seiten, Winkeln, Diagonalen und Symmetrie erkennen und ordnen",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Besondere Vierecke`,
  whyItMatters:
    "Ob ein Fensterrahmen wirklich rechtwinklig ist oder ein Drachen symmetrisch, erkennst du an wenigen Eigenschaften. Wer die Vierecke ordnen kann, weiß sofort, welche Eigenschaften und Formeln er nutzen darf: Was für jedes Parallelogramm gilt, gilt auch für jedes Rechteck.",
  explanationHtml: `
    <p><strong>Wiederholung aus M5 bis M7:</strong> Ein Viereck ABCD wird gegen den Uhrzeigersinn beschriftet. a = [AB], b = [BC], c = [CD] und d = [DA] sind die Seiten, e = [AC] und f = [BD] die Diagonalen, α, β, γ und δ die Winkel bei A, B, C und D. Die Innenwinkelsumme beträgt 360°. Drachenviereck, Raute, gleichschenkliges Trapez, Rechteck und Quadrat kennst du aus M6 als achsensymmetrische Figuren.</p>
    <p>Jedes besondere Viereck hat eine <strong>charakteristische Eigenschaft</strong>: eine kurze Festlegung, aus der alle anderen Eigenschaften folgen.</p>
    <table class="mini">
      <tr><th>Viereck</th><th>charakteristische Eigenschaft</th><th>daraus folgt unter anderem</th></tr>
      <tr><td>Trapez</td><td>mindestens ein Paar paralleler Seiten</td><td>an jeder der beiden anderen Seiten ergänzen sich die Winkel zu 180°</td></tr>
      <tr><td>gleichschenkliges Trapez</td><td>Trapez mit einer Symmetrieachse durch die Mitten der parallelen Seiten</td><td>Schenkel gleich lang, Basiswinkel gleich groß, Diagonalen gleich lang</td></tr>
      <tr><td>Parallelogramm</td><td>zwei Paare paralleler Seiten</td><td>Gegenseiten gleich lang, Gegenwinkel gleich groß, Diagonalen halbieren sich, punktsymmetrisch</td></tr>
      <tr><td>Rechteck</td><td>Parallelogramm mit einem rechten Winkel</td><td>vier rechte Winkel, Diagonalen gleich lang, zwei Symmetrieachsen durch die Seitenmitten</td></tr>
      <tr><td>Raute</td><td>vier gleich lange Seiten</td><td>Diagonalen halbieren sich senkrecht und halbieren die Winkel, zwei Symmetrieachsen auf den Diagonalen</td></tr>
      <tr><td>Quadrat</td><td>Raute mit einem rechten Winkel</td><td>alles von Rechteck und Raute, vier Symmetrieachsen</td></tr>
      <tr><td>Drachenviereck</td><td>eine Diagonale ist Symmetrieachse</td><td>zwei Paare gleich langer Nachbarseiten, Diagonalen senkrecht, die Achse halbiert die andere Diagonale</td></tr>
    </table>
    <p><strong>Punktsymmetrie:</strong> Führt man mit einem Parallelogramm eine halbe Drehung um den Schnittpunkt Z seiner Diagonalen aus, landet jede Ecke auf der gegenüberliegenden. Das Parallelogramm ist <strong>punktsymmetrisch</strong>; deshalb halbieren sich seine Diagonalen, und Gegenseiten wie Gegenwinkel sind gleich groß.</p>
    <p><strong>Das Haus der Vierecke</strong> ordnet die Vierecke wie einen Stammbaum: Ganz oben steht das allgemeine Viereck, darunter Trapez und Drachenviereck. Unter dem Trapez stehen gleichschenkliges Trapez und Parallelogramm, unter dem Parallelogramm Rechteck und Raute, ganz unten das Quadrat. Das Rechteck ist zugleich ein gleichschenkliges Trapez, die Raute zugleich ein Drachenviereck. Ein Viereck hat <strong>alle Eigenschaften</strong> der Vierecke über ihm.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Viereck hat vier gleich lange Seiten, aber keinen rechten Winkel. Es ist eine <strong>Raute</strong> und damit auch ein Parallelogramm, ein Trapez und ein Drachenviereck: Gegenseiten sind parallel, die Diagonalen halbieren sich senkrecht, und es hat zwei Symmetrieachsen. Ein Rechteck ist es nicht, also auch kein Quadrat.<br>Ebenso gilt: Jedes Quadrat ist ein Rechteck, aber nicht jedes Rechteck ist ein Quadrat.</div>
    <p><strong>An den Diagonalen erkennen:</strong> Halbieren sich die Diagonalen, ist das Viereck ein Parallelogramm. Sind sie dazu gleich lang, ist es ein Rechteck; stehen sie dazu senkrecht aufeinander, ist es eine Raute; beides zusammen ergibt ein Quadrat. Halbiert nur eine Diagonale die andere senkrecht, ist es ein Drachenviereck. Ein Drachenviereck kann auch nach innen geknickt sein (nicht konvex).</p>
    <p><strong>Typische Fehler:</strong> „Ein Quadrat ist kein Rechteck“ (doch, es hat alle Eigenschaften eines Rechtecks); gleich lange Diagonalen allein machen noch kein Rechteck, auch das gleichschenklige Trapez hat sie; senkrechte Diagonalen allein machen noch keinen Drachen; ein Parallelogramm hat zwar gleich lange Gegenseiten, ist aber meist kein gleichschenkliges Trapez, weil ihm die Symmetrieachse fehlt.</p>
    <div class="merke"><strong>Merke:</strong> Jedes Viereck im Haus der Vierecke hat alle Eigenschaften der Vierecke über ihm. Den speziellsten Namen findest du, wenn du von oben nach unten prüfst: parallele Seiten, gleich lange Seiten, rechte Winkel, Symmetrie. Auch die Diagonalen verraten ihn: Halbieren sie sich, ist es ein Parallelogramm.</div>
  `,
  formulas: [
    { name: "Parallelogramm", html: "AB ∥ CD und BC ∥ DA", quantities: "Gegenseiten gleich lang, Gegenwinkel gleich groß, Diagonalen halbieren sich, punktsymmetrisch" },
    { name: "Rechteck", html: "Parallelogramm mit α = 90°", quantities: "Diagonalen gleich lang; zwei Symmetrieachsen durch die Seitenmitten" },
    { name: "Raute", html: "a = b = c = d", quantities: "Diagonalen halbieren sich senkrecht; zwei Symmetrieachsen auf den Diagonalen" },
    { name: "Drachenviereck", html: "Diagonale [AC] ist Symmetrieachse: AB = AD, CB = CD", quantities: "e ⊥ f, und e halbiert f" },
    { name: "Haus der Vierecke", html: "Quadrat → Rechteck, Raute → Parallelogramm → Trapez", quantities: "→ heißt „ist auch ein“; außerdem Rechteck → gleichschenkliges Trapez, Raute → Drachenviereck" },
  ],
  quiz: {
    question: "Welche Aussage ist richtig?",
    options: ["Jedes Rechteck ist ein Quadrat.", "Jede Raute ist ein Rechteck.", "Jedes Quadrat ist ein Rechteck.", "Jedes Drachenviereck ist eine Raute."],
    correctIndex: 2,
    explanation:
      "Ein Quadrat ist ein Parallelogramm mit rechtem Winkel, also ein Rechteck, das zusätzlich vier gleich lange Seiten hat. Umgekehrt gilt es nicht: Ein Rechteck mit 4 cm und 2 cm ist kein Quadrat, und eine Raute ohne rechten Winkel ist kein Rechteck.",
  },
  lab: {
    kind: "quadrilateral-family",
    title: "Labor: Das Viereck auf dem Gitter",
    intro:
      "Ziehe die vier Ecken auf Gitterpunkte. Striche markieren gleich lange Seiten, Pfeilspitzen parallele Seiten, kleine Quadrate rechte Winkel und lila Linien Symmetrieachsen. Oben steht der speziellste Name mit seiner charakteristischen Eigenschaft.",
    params: [
      { type: "choice", key: "sel", label: "Regler für die Ecke", options: QUAD.map((n, i) => ({ value: i, label: n })), value: 0 },
      ...QUAD.flatMap((n, i) => [
        { type: "range" as const, key: `x${n}`, label: `x-Koordinate von ${n}`, unit: "", min: 0, max: 12, step: 1, value: [1, 7, 8, 3][i], showIf: (v: LabValues) => v.sel === i },
        { type: "range" as const, key: `y${n}`, label: `y-Koordinate von ${n}`, unit: "", min: 0, max: 7, step: 1, value: [1, 1, 5, 6][i], showIf: (v: LabValues) => v.sel === i },
      ]),
    ],
    readouts: [
      { key: "name", label: "Speziellster Name", emphasis: true, compute: (v) => familyInfo(v).name },
      { key: "seiten", label: "Seiten", compute: (v) => sidesText(familyInfo(v)) },
      { key: "winkel", label: "Winkel", compute: (v) => anglesText(familyInfo(v), familyPoints(v)) },
      { key: "diagonalen", label: "Diagonalen", compute: (v) => diagonalsText(familyInfo(v)) },
      { key: "symmetrie", label: "Symmetrie", compute: (v) => symmetryText(familyInfo(v)) },
    ],
    goals: [
      {
        id: "raute",
        text: "Baue eine Raute, die kein Quadrat ist. Welche Eigenschaft fehlt ihr zum Quadrat?",
        check: (v) => familyInfo(v).name === "Raute",
      },
      {
        id: "senkrecht",
        text: "Ziehe die Ecken so, dass die Diagonalen senkrecht aufeinander stehen, das Viereck aber kein Drachenviereck ist. Was fehlt zum Drachen?",
        check: (v) => {
          const info = familyInfo(v);
          return info.convex && info.diagPerp && info.axes.length === 0;
        },
      },
      {
        id: "diagonalen",
        text: "Finde ein Viereck mit gleich langen Diagonalen, das kein Rechteck ist. Welche Eigenschaft fehlt seinen Diagonalen?",
        check: (v) => {
          const info = familyInfo(v);
          return info.convex && info.diagEqual && info.name !== "Rechteck" && info.name !== "Quadrat";
        },
      },
    ],
  },
  exercises: [
    {
      id: "name",
      make: (rng, level): ExerciseTask => {
        const c = level === 1 ? propertyCase(rng) : diagonalCase(rng);
        const axes = QUAD_AXES[c.name];
        return {
          prompt:
            level === 1
              ? `Von einem Viereck ABCD weißt du: ${c.text} Wie heißt es mit dem speziellsten Namen, und wie viele Symmetrieachsen hat es?`
              : `${c.text} Welches Viereck ist es auf jeden Fall (der speziellste Name, der sicher passt)? Wie viele Symmetrieachsen hat es mindestens?`,
          given: [],
          formulaHint: level === 1 ? "Prüfe von oben nach unten: parallele Seiten (Trapez, Parallelogramm), vier gleiche Seiten (Raute), rechter Winkel (Rechteck, Quadrat), Symmetrieachse (gleichschenkliges Trapez, Drachenviereck)." : undefined,
          fields: [
            shuffledChoice(rng, level === 1 ? "Speziellster Name:" : "Auf jeden Fall ein …", c.name, QUAD_NEIGHBOURS[c.name]),
            numberField(level === 1 ? "Anzahl der Symmetrieachsen:" : "mindestens … Symmetrieachsen:", axes, "", 0, { slips: AXIS_SLIPS[c.name] }),
          ],
          steps: [c.why, `Symmetrieachsen: ${AXIS_TEXT[c.name]}.`, `<strong>${c.name}; ${level === 2 ? "mindestens " : ""}${axes} Symmetrieachse${axes === 1 ? "" : "n"}</strong>`],
          meta: { kind: c.kind, axes, ...c.params },
        };
      },
    },
    {
      id: "aussagen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const [i, j] = draw(() => [rng.int(0, STATEMENTS.length - 1), rng.int(0, STATEMENTS.length - 1)], ([x, y]) => x !== y, [0, 1]);
          const [s1, s2] = [STATEMENTS[i], STATEMENTS[j]];
          return {
            prompt: `Wahr oder falsch?<br>(1) ${s1[0]}<br>(2) ${s2[0]}`,
            given: [],
            formulaHint: "Ein spezielleres Viereck hat alle Eigenschaften der Vierecke über ihm im Haus der Vierecke; umgekehrt gilt das nicht.",
            fields: [choiceField("(1)", ["wahr", "falsch"], s1[1] ? 0 : 1), choiceField("(2)", ["wahr", "falsch"], s2[1] ? 0 : 1)],
            steps: [`(1) ${s1[2]}`, `(2) ${s2[2]}`, `<strong>(1) ${s1[1] ? "wahr" : "falsch"}, (2) ${s2[1] ? "wahr" : "falsch"}</strong>`],
            meta: { i, j },
          };
        }
        const k = rng.int(0, COMBOS.length - 1);
        const [combo, name, why] = COMBOS[k];
        const axes = QUAD_AXES[name];
        return {
          prompt: `Ein Viereck ist ${combo}. Welches Viereck ist es auf jeden Fall (der speziellste Name, der sicher passt)? Wie viele Symmetrieachsen hat es mindestens?`,
          given: [],
          fields: [shuffledChoice(rng, "Auf jeden Fall ein …", name, QUAD_NEIGHBOURS[name]), numberField("mindestens … Symmetrieachsen:", axes, "", 0, { slips: AXIS_SLIPS[name] })],
          steps: [why, `<strong>${name}; mindestens ${axes} Symmetrieachse${axes === 1 ? "" : "n"}</strong>`],
          meta: { k, axes },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du ordnest jedes Viereck ins Haus der Vierecke ein und weißt, was daraus folgt.",
};

// 1.5 Vierecke konstruieren ────────────────────────────────────────────────

/** Which pieces fix which quadrilateral (1.5, Level 1). */
export const PIECE_CASES: Array<{ type: string; pieces: string[]; fixed: boolean; need: number; why: string }> = [
  { type: "Parallelogramm", pieces: ["a", "b", "α"], fixed: true, need: 3, why: "Das Dreieck ABD ist nach SWS festgelegt, C folgt über die Parallelen." },
  { type: "Parallelogramm", pieces: ["a", "b"], fixed: false, need: 3, why: "Ohne Winkel lässt sich das Parallelogramm wie ein Gelenk zusammenschieben." },
  { type: "Parallelogramm", pieces: ["a", "α", "β"], fixed: false, need: 3, why: "β = 180° − α ist kein neues Stück; die Seite b fehlt." },
  { type: "Raute", pieces: ["a", "α"], fixed: true, need: 2, why: "Das Dreieck ABD mit AB = AD = a und α ist nach SWS festgelegt." },
  { type: "Raute", pieces: ["e", "f"], fixed: true, need: 2, why: "Die Diagonalen halbieren sich senkrecht: B und D liegen auf der Mittelsenkrechten von [AC], je f : 2 vom Mittelpunkt entfernt." },
  { type: "Raute", pieces: ["a"], fixed: false, need: 2, why: "Mit derselben Seitenlänge gibt es Rauten mit ganz verschiedenen Winkeln." },
  { type: "Rechteck", pieces: ["a", "b"], fixed: true, need: 2, why: "Das Dreieck ABC mit dem rechten Winkel bei B ist nach SWS festgelegt." },
  { type: "Rechteck", pieces: ["e"], fixed: false, need: 2, why: "Viele verschiedene Rechtecke haben gleich lange Diagonalen." },
  { type: "Rechteck", pieces: ["a", "e"], fixed: true, need: 2, why: "Im Dreieck ABC liegt der rechte Winkel bei B der längsten Seite e gegenüber: SsW." },
  { type: "Quadrat", pieces: ["e"], fixed: true, need: 1, why: "Die Diagonalen sind gleich lang und halbieren sich senkrecht: Aus e folgt das ganze Quadrat." },
  { type: "Drachenviereck", pieces: ["e", "a", "b"], fixed: true, need: 3, why: "Das Dreieck ABC ist nach SSS festgelegt (AC = e, AB = a, BC = b), D ist das Spiegelbild von B an AC." },
  { type: "Drachenviereck", pieces: ["a", "b"], fixed: false, need: 3, why: "Ohne Diagonale oder Winkel lässt sich der Drachen verformen." },
  { type: "Trapez", pieces: ["a", "c", "h"], fixed: false, need: 4, why: "Die obere Seite c lässt sich auf der Parallelen verschieben; es fehlt ein Winkel oder ein Schenkel." },
  { type: "gleichschenkliges Trapez", pieces: ["a", "c", "h"], fixed: true, need: 3, why: "c liegt symmetrisch über der Mitte von a, im Abstand h." },
  { type: "allgemeines Viereck", pieces: ["a", "b", "c", "d"], fixed: false, need: 5, why: "Vier Seiten allein lassen das Viereck noch wackeln wie ein Gelenk; es fehlt eine Diagonale oder ein Winkel." },
];

/** Construction plans for quadrilaterals with a diagonal (1.5, Level 2): the first triangle and its theorem. */
export const PLAN_CASES: Array<{ type: string; pieces: string[]; triangle: string; others: string[]; theorem: number; why: string }> = [
  { type: "Parallelogramm", pieces: ["a", "b", "e"], triangle: "ABC", others: ["ABD", "BCD"], theorem: 0, why: "AB = a, BC = b und AC = e: Dreieck ABC nach SSS; D = A ⊕ BC→." },
  { type: "Parallelogramm", pieces: ["a", "e", "∢BAC"], triangle: "ABC", others: ["ABD", "BCD"], theorem: 1, why: "AB = a, AC = e und der Winkel ∢BAC zwischen ihnen: Dreieck ABC nach SWS." },
  { type: "Raute", pieces: ["a", "e"], triangle: "ABC", others: ["ABD", "BCD"], theorem: 0, why: "AB = BC = a und AC = e: Dreieck ABC nach SSS; D ist das Spiegelbild von B an AC." },
  { type: "Raute", pieces: ["a", "f"], triangle: "ABD", others: ["ABC", "ACD"], theorem: 0, why: "AB = AD = a und BD = f: Dreieck ABD nach SSS; C ist das Spiegelbild von A an BD." },
  { type: "Drachenviereck", pieces: ["e", "a", "b"], triangle: "ABC", others: ["ABD", "BCD"], theorem: 0, why: "AC = e, AB = a und BC = b: Dreieck ABC nach SSS; D ist das Spiegelbild von B an AC." },
  { type: "Drachenviereck", pieces: ["a", "e", "∢BAC"], triangle: "ABC", others: ["ABD", "BCD"], theorem: 1, why: "AB = a, AC = e und ∢BAC dazwischen: Dreieck ABC nach SWS; D ist das Spiegelbild von B an AC." },
  { type: "gleichschenkliges Trapez", pieces: ["a", "d", "α"], triangle: "ABD", others: ["ACD", "BCD"], theorem: 1, why: "AB = a, AD = d und α dazwischen: Dreieck ABD nach SWS; C ist das Spiegelbild von D an der Mittelsenkrechten von [AB]." },
];

const THEOREMS_SHORT = ["SSS", "SWS", "WSW", "SsW"];

/** Plausible values for the pieces of a quadrilateral task. */
function pieceValues(rng: Rng, type: string, pieces: string[]): Record<string, number> {
  return draw(
    () => {
      const a = rng.stepped(4, 9, 0.5);
      const b = rng.stepped(2.5, 7, 0.5);
      const alpha = draw(() => multiple(rng, 40, 140, 5), (x) => x !== 90, 70);
      const values: Record<string, number> = { a, b, d: b, c: rng.stepped(2, a - 1, 0.5), h: rng.stepped(2, 6, 0.5), α: type === "gleichschenkliges Trapez" ? multiple(rng, 50, 80, 5) : alpha, e: rng.stepped(3, 11, 0.5), f: rng.stepped(2, 8, 0.5), "∢BAC": multiple(rng, 20, 60, 5) };
      values.β = 180 - values.α;
      if (type === "Rechteck" && pieces.includes("e")) values.e = pieces.includes("a") ? a + rng.stepped(0.5, 3, 0.5) : rng.stepped(4, 11, 0.5);
      // a general quadrilateral gets its own fourth side, not d = b
      if (type === "allgemeines Viereck") values.d = rng.stepped(2.5, 7, 0.5);
      return values;
    },
    (x) => {
      // four sides close up only if the longest is shorter than the sum of the other three; no two equal
      if (type === "allgemeines Viereck") {
        const s = [x.a, x.b, x.c, x.d];
        return 2 * Math.max(...s) < s[0] + s[1] + s[2] + s[3] - 1 && new Set(s).size === 4;
      }
      if (type === "Parallelogramm" && pieces.includes("e") && pieces.includes("b")) return sideCheck(x.a, x.b, x.e).meet === "two";
      if (type === "Raute" && pieces.includes("e") && pieces.includes("a")) return x.e < 2 * x.a;
      if (type === "Raute" && pieces.includes("f") && pieces.includes("a")) return x.f < 2 * x.a;
      if (type === "Drachenviereck" && pieces.includes("b")) return sideCheck(x.e, x.a, x.b).meet === "two" && x.a !== x.b;
      // an isosceles trapezoid from a, d and α needs a top side: a − 2 · d · cos α > 0 (checked here, not asked)
      if (type === "gleichschenkliges Trapez" && pieces.includes("d")) return x.a - 2 * x.d * Math.cos((x.α * Math.PI) / 180) >= 1;
      return true;
    },
    { a: 6, b: 4, d: 4, c: 3, h: 3, α: 70, β: 110, e: 7, f: 5, "∢BAC": 30 },
  );
}

function pieceText(name: string, value: number): string {
  return name === "α" || name === "β" || name === "∢BAC" ? `${name} = ${value}°` : `${name} = ${cm(value)}`;
}

function zugInfo(v: LabValues) {
  const { P } = zugPoints(v);
  return quadInfo(P, 1e-6);
}

function zugState(v: LabValues): string {
  const info = zugInfo(v);
  const fig = ZUG_FIGURES[v.fig];
  if (zugKeeps(v.fig, info)) return info.name === fig ? `ja, ABCD ist ${withArticle(fig)}` : `ja, sogar ${withArticle(info.name)}`;
  return info.simple ? `nein, jetzt nur noch ${withArticle(info.name)}` : `nein: ${info.broken}`;
}

const viereckskonstruktion: Lesson = {
  id: "dv-5-viereckskonstruktion",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Vierecke konstruieren",
  subtitle: "Mit Teildreiecken und Eigenschaften konstruieren und im Zugmodus prüfen",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Vierecke konstruieren`,
  whyItMatters:
    "Ob Beet, Drachen oder Werkstück: Erst wenn du weißt, welche Stücke ein Viereck festlegen, kannst du es maßstäblich zeichnen oder in einer Geometriesoftware so konstruieren, dass es beim Ziehen nicht auseinanderfällt.",
  explanationHtml: `
    <p><strong>Wiederholung:</strong> Dreiecke konstruierst du aus drei passenden Stücken (SSS, SWS, WSW, SsW). Ein Viereck zerlegst du meist mit einer Diagonale in zwei Dreiecke und konstruierst eines nach dem anderen. Die Parallelverschiebung kennst du aus M7: P' = P ⊕ ${vn("v")}.</p>
    <p><strong>Wie viele Stücke braucht man?</strong> Ein allgemeines Viereck ist erst durch fünf Stücke festgelegt, zum Beispiel durch die Diagonale [AC] und je zwei weitere Seiten für die Dreiecke ABC und ACD. Besondere Vierecke brauchen weniger, weil ihre Eigenschaften Stücke liefern: das Quadrat eines, Rechteck und Raute zwei, Parallelogramm, Drachenviereck und gleichschenkliges Trapez drei, ein Trapez vier.</p>
    <ul>
      <li><strong>Parallelogramm aus a, b und α:</strong> Dreieck ABD nach SWS (AB = a, AD = b, α dazwischen). C ist der Schnittpunkt der Parallelen zu AB durch D und der Parallelen zu AD durch B, oder C = B ⊕ ${vn("AD")}.</li>
      <li><strong>Raute aus den Diagonalen e und f:</strong> [AC] mit der Länge e zeichnen, dann die Mittelsenkrechte von [AC] (Fundamentalkonstruktion aus M6). Auf ihr liegen B und D, je f : 2 vom Mittelpunkt M entfernt.</li>
      <li><strong>Drachenviereck aus e = [AC], a = AB und b = BC:</strong> Dreieck ABC nach SSS, dann D als Spiegelbild von B an der Geraden AC.</li>
      <li><strong>Trapez aus a, c und h:</strong> [AB] zeichnen, die Parallele zu AB im Abstand h, darauf [DC] mit der Länge c. Wo [DC] liegt, legen a, c und h noch nicht fest; dafür brauchst du ein viertes Stück, etwa α. Beim gleichschenkligen Trapez liegt [DC] symmetrisch über der Mitte von [AB].</li>
    </ul>
    <div class="example"><strong>Beispiel:</strong> Parallelogramm ABCD mit a = 6 cm, b = 4 cm und α = 60°. In der Planfigur treffen sich a und b in A, α liegt zwischen ihnen.
      <ol class="steps">
        <li>Zeichne die Strecke [AB] mit a = 6 cm.</li>
        <li>Trage in A an [AB] den Winkel α = 60° an und markiere auf dem freien Schenkel D mit AD = 4 cm.</li>
        <li>Zeichne die Parallele zu AB durch D und die Parallele zu AD durch B; ihr Schnittpunkt ist C.</li>
      </ol>
      In Koordinaten: Für A(1 | 1), B(6 | 1) und C(8 | 4) ist ${vn("BC")} = ${vecHtml(2, 3)}. D = A ⊕ ${vn("BC")} ergibt D(1 + 2 | 1 + 3), also D(3 | 4).</div>
    <p><strong>Dynamische Geometriesoftware und der Zugmodus:</strong> In einer Geometriesoftware konstruierst du D aus A, B und C, etwa als Schnittpunkt zweier Parallelen. Ziehst du dann an einer Ecke, bleibt die Figur ein Parallelogramm. Setzt du D dagegen nur nach Augenmaß an die passende Stelle, zerfällt die Figur beim Ziehen. Der Zugmodus ist also die Probe, ob wirklich konstruiert wurde.</p>
    <p><strong>Typische Fehler:</strong> D = B ⊕ ${vn("AC")} statt D = A ⊕ ${vn("BC")} (dann entsteht ein anderes Parallelogramm); bei der Raute die Diagonalen nicht in ihren Mitten kreuzen lassen; glauben, a, c und h legten ein Trapez schon fest.</p>
    <div class="merke"><strong>Merke:</strong> Zerlege das Viereck mit einer Diagonale in Dreiecke und nutze seine Eigenschaften: Parallelen, gleiche Seiten, Symmetrie. Im Parallelogramm ABCD gilt D = A ⊕ ${vn("BC")}. Eine echte Konstruktion übersteht den Zugmodus.</div>
  `,
  formulas: [
    { name: "Vierte Ecke im Parallelogramm", html: `D = A ⊕ ${vn("BC")}`, quantities: "zu A den Pfeil von B nach C addieren; ebenso C = B ⊕ AD→" },
    { name: "Nötige Stücke", html: "Quadrat 1; Rechteck, Raute 2; Parallelogramm, Drachen, gleichschenkliges Trapez 3; Trapez 4; Viereck 5", quantities: "so viele Längen und Winkel legen das Viereck mindestens fest" },
    { name: "Raute aus e und f", html: "B, D auf der Mittelsenkrechten von [AC], je f : 2 von M", quantities: "M Mittelpunkt von [AC]" },
    { name: "Drachenviereck", html: "D ist das Spiegelbild von B an der Geraden AC", quantities: "AC ist die Symmetrieachse" },
  ],
  quiz: {
    question: "Mit welchen Angaben ist ein Parallelogramm ABCD eindeutig festgelegt?",
    options: ["a = 6 cm und b = 4 cm", "α = 70° und β = 110°", "a = 6 cm und α = 70°", "a = 6 cm, b = 4 cm und α = 70°"],
    correctIndex: 3,
    explanation:
      "Ein Parallelogramm braucht drei Stücke: Aus a, b und α konstruierst du das Dreieck ABD nach SWS, C folgt über die Parallelen. Mit a und b allein lässt es sich wie ein Gelenk zusammenschieben, und β = 180° − α ist kein neues Stück.",
  },
  lab: {
    kind: "quadrilateral-construction",
    title: "Labor: Zugmodus",
    intro:
      "Ziehe A, B und C; die orange Ecke entsteht durch die Konstruktion. Stelle auf „nach Augenmaß“ um: Dann bleibt diese Ecke liegen, wo sie gerade ist, und du siehst, was beim Ziehen passiert. Der Knopf setzt sie wieder nach Augenmaß an die passende Stelle.",
    params: [
      {
        type: "choice",
        key: "fig",
        label: "Figur",
        options: [
          { value: 0, label: "Parallelogramm: D = A ⊕ BC→" },
          { value: 1, label: "Raute aus den Diagonalen e und f" },
          { value: 2, label: "Drachenviereck mit der Symmetrieachse AC" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "modus",
        label: "Die orange Ecke ist",
        options: [
          { value: 0, label: "konstruiert (Zugmodus)" },
          { value: 1, label: "nach Augenmaß gezeichnet" },
        ],
        value: 0,
      },
      { type: "choice", key: "sel", label: "Regler für die Ecke", options: QUAD.slice(0, 3).map((n, i) => ({ value: i, label: n })), value: 0 },
      ...QUAD.slice(0, 3).flatMap((n, i) => [
        { type: "range" as const, key: `x${n}`, label: `x-Koordinate von ${n}`, unit: "", min: 0, max: 12, step: 1, value: [ZUG_START.xA, ZUG_START.xB, ZUG_START.xC][i], showIf: (v: LabValues) => v.sel === i && !(v.fig === 1 && i === 1) },
        { type: "range" as const, key: `y${n}`, label: `y-Koordinate von ${n}`, unit: "", min: 0, max: 7, step: 1, value: [ZUG_START.yA, ZUG_START.yB, ZUG_START.yC][i], showIf: (v: LabValues) => v.sel === i && !(v.fig === 1 && i === 1) },
      ]),
      { type: "range", key: "f", label: "Diagonale f = [BD]", unit: "", min: 1, max: 7, step: 0.5, value: ZUG_START.f, digits: 1, showIf: (v) => v.fig === 1 },
      { type: "state", key: "pDx", value: FREEHAND_START.p.x },
      { type: "state", key: "pDy", value: FREEHAND_START.p.y },
      { type: "state", key: "rBx", value: FREEHAND_START.rB.x },
      { type: "state", key: "rBy", value: FREEHAND_START.rB.y },
      { type: "state", key: "rDx", value: FREEHAND_START.rD.x },
      { type: "state", key: "rDy", value: FREEHAND_START.rD.y },
      { type: "state", key: "kDx", value: FREEHAND_START.k.x },
      { type: "state", key: "kDy", value: FREEHAND_START.k.y },
    ],
    readouts: [
      { key: "zustand", label: "Bleibt die Figur erhalten?", emphasis: true, compute: zugState },
      { key: "konstruktion", label: "Konstruktion", compute: zugConstructionText },
      { key: "seiten", label: "Seiten", compute: (v) => sidesText(zugInfo(v)) },
      { key: "diagonalen", label: "Diagonalen", compute: (v) => diagonalsText(zugInfo(v)) },
    ],
    goals: [
      {
        id: "rechteck",
        text: "Konstruiertes Parallelogramm: Ziehe an den Ecken, bis ein Rechteck entsteht. Wie viele rechte Winkel musst du dafür einstellen?",
        check: (v) => v.fig === 0 && v.modus === 0 && ["Rechteck", "Quadrat"].includes(zugInfo(v).name),
      },
      {
        id: "augenmass",
        text: "Parallelogramm nach Augenmaß: Ziehe an A, B oder C, bis ABCD kein Parallelogramm mehr ist. Was hätte die Konstruktion verhindert?",
        check: (v) => v.fig === 0 && v.modus === 1 && zugInfo(v).simple && !zugKeeps(0, zugInfo(v)),
      },
      {
        id: "drachen-raute",
        text: "Konstruiertes Drachenviereck: Ziehe B so, dass aus dem Drachen eine Raute wird. Wo trifft das Lot von B dann auf [AC]?",
        check: (v) => v.fig === 2 && v.modus === 0 && zugInfo(v).allEqual && zugInfo(v).simple,
      },
    ],
    actions: [{ id: "augenmass", label: "Ecken nach Augenmaß neu setzen", apply: redrawFreehand }],
  },
  exercises: [
    {
      id: "stuecke",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const k = rng.int(0, PIECE_CASES.length - 1);
          const c = PIECE_CASES[k];
          const values = pieceValues(rng, c.type, c.pieces);
          const given = c.pieces.map((p) => pieceText(p, values[p]));
          const article = c.type === "Raute" ? "eine" : "ein";
          return {
            prompt: `Ist ${article} ${c.type} ABCD durch ${listText(given)} eindeutig festgelegt? Wie viele Stücke braucht man für ${c.type === "Raute" ? "eine Raute" : `ein ${c.type}`} mindestens?`,
            given,
            formulaHint: "Quadrat 1 Stück; Rechteck und Raute 2; Parallelogramm, Drachenviereck und gleichschenkliges Trapez 3; Trapez 4; allgemeines Viereck 5. Neue Stücke liefern nur Angaben, die nicht schon aus den anderen folgen.",
            fields: [
              choiceField("Eindeutig festgelegt?", ["ja", "nein"], c.fixed ? 0 : 1),
              numberField("Mindestens nötige Stücke:", c.need, "", 0, { slips: [{ value: 5, hint: "Die Eigenschaften dieses Vierecks liefern schon Stücke mit: gleiche Seiten, gleiche Winkel, Symmetrie." }] }),
            ],
            steps: [c.why, `<strong>${c.fixed ? "ja" : "nein"}; ${c.need} Stück${c.need === 1 ? "" : "e"}</strong>`],
            meta: { k },
          };
        }
        const k = rng.int(0, PLAN_CASES.length - 1);
        const c = PLAN_CASES[k];
        const values = pieceValues(rng, c.type, c.pieces);
        const given = c.pieces.map((p) => pieceText(p, values[p]));
        const article = c.type === "Raute" ? "eine" : "ein";
        return {
          prompt: `${article.charAt(0).toUpperCase()}${article.slice(1)} ${c.type} ABCD soll aus ${listText(given)} konstruiert werden. Mit welchem Teildreieck beginnst du, und nach welchem Kongruenzsatz konstruierst du es?`,
          given,
          fields: [shuffledChoice(rng, "Erstes Teildreieck:", c.triangle, c.others), choiceField("Kongruenzsatz:", THEOREMS_SHORT, c.theorem)],
          steps: [c.why, `<strong>Dreieck ${c.triangle} nach ${THEOREMS_SHORT[c.theorem]}</strong>`],
          meta: { k },
        };
      },
    },
    {
      id: "koordinaten",
      make: (rng, level): ExerciseTask => {
        const P = (lo: number, hi: number) => ({ x: rng.int(lo, hi), y: rng.int(lo, hi - 1) });
        if (level === 1) {
          const [A, B, C] = draw(
            () => [P(-2, 8), P(-2, 8), P(-2, 8)],
            ([a, b, c]) => {
              // A, B, C counterclockwise, as ABCD is labelled
              const area = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
              return area >= 6 && b.x !== c.x && b.y !== c.y && Math.abs(c.x - b.x) + Math.abs(c.y - b.y) >= 3;
            },
            [
              { x: 1, y: 1 },
              { x: 6, y: 1 },
              { x: 8, y: 4 },
            ],
          );
          const v = { x: C.x - B.x, y: C.y - B.y };
          const D = { x: A.x + v.x, y: A.y + v.y };
          const wrongD = { x: B.x + C.x - A.x, y: B.y + C.y - A.y };
          const slipD = "So entsteht ein anderes Parallelogramm. In ABCD liegt D neben A und C, gegenüber von B: D = A ⊕ BC→.";
          return {
            prompt: `Die Punkte A${pt(A.x, A.y)}, B${pt(B.x, B.y)} und C${pt(C.x, C.y)} sind Ecken des Parallelogramms ABCD. Berechne den Vektor ${vn("BC")} und die Koordinaten von D.`,
            given: [`A${pt(A.x, A.y)}`, `B${pt(B.x, B.y)}`, `C${pt(C.x, C.y)}`],
            formulaHint: `${vn("BC")} = C − B (Spitze minus Fuß); D = A ⊕ ${vn("BC")}`,
            fields: [
              numberField(`${vn("BC")}: x =`, v.x, "", 0, { slips: [{ value: -v.x, hint: "Der Pfeil BC→ geht von B nach C: Rechne C minus B, nicht B minus C." }] }),
              numberField(`${vn("BC")}: y =`, v.y, "", 0, { slips: [{ value: -v.y, hint: "Der Pfeil BC→ geht von B nach C: Rechne C minus B, nicht B minus C." }] }),
              numberField("D: x =", D.x, "", 0, { slips: [{ value: wrongD.x, hint: slipD }] }),
              numberField("D: y =", D.y, "", 0, { slips: [{ value: wrongD.y, hint: slipD }] }),
            ],
            steps: [
              `${vn("BC")} = ${vecHtml(C.x, C.y)} − ${vecHtml(B.x, B.y)} = ${vecHtml(v.x, v.y)}`,
              `D = A ⊕ ${vn("BC")}: ${pt(A.x, A.y)} ⊕ ${vecHtml(v.x, v.y)} = (${fmt(A.x)} ${v.x < 0 ? "−" : "+"} ${fmt(Math.abs(v.x))} | ${fmt(A.y)} ${v.y < 0 ? "−" : "+"} ${fmt(Math.abs(v.y))})`,
              `<strong>${vn("BC")} = ${vecHtml(v.x, v.y)}; D${pt(D.x, D.y)}</strong>`,
            ],
            meta: { ax: A.x, ay: A.y, bx: B.x, by: B.y, cx: C.x, cy: C.y },
          };
        }
        const variant = rng.int(0, 2);
        if (variant === 0) {
          // a missing vertex B or C of a parallelogram
          const [A, Q, R] = draw(
            () => [P(-2, 8), P(-2, 8), P(-2, 8)],
            ([a, b, c]) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 6,
            [
              { x: 0, y: 1 },
              { x: 5, y: 0 },
              { x: 2, y: 4 },
            ],
          );
          const missingB = rng.next() < 0.5;
          // missing B: A, C = Q, D = R given, B = A ⊕ DC→; missing C: A, B = Q, D = R given, C = B ⊕ AD→
          const X = missingB ? { x: A.x + Q.x - R.x, y: A.y + Q.y - R.y } : { x: Q.x + R.x - A.x, y: Q.y + R.y - A.y };
          const name = missingB ? "B" : "C";
          const known = missingB ? `A${pt(A.x, A.y)}, C${pt(Q.x, Q.y)} und D${pt(R.x, R.y)}` : `A${pt(A.x, A.y)}, B${pt(Q.x, Q.y)} und D${pt(R.x, R.y)}`;
          const rule = missingB ? `B = A ⊕ ${vn("DC")}` : `C = B ⊕ ${vn("AD")}`;
          const arrow = missingB ? { x: Q.x - R.x, y: Q.y - R.y } : { x: R.x - A.x, y: R.y - A.y };
          const start = missingB ? A : Q;
          return {
            prompt: `Für ein Beet in Form eines Parallelogramms ABCD sind auf einem Plan die Ecken ${known} eingezeichnet (1 Einheit = 1 m). Wo muss die Ecke ${name} liegen?`,
            given: missingB ? [`A${pt(A.x, A.y)}`, `C${pt(Q.x, Q.y)}`, `D${pt(R.x, R.y)}`] : [`A${pt(A.x, A.y)}`, `B${pt(Q.x, Q.y)}`, `D${pt(R.x, R.y)}`],
            fields: [numberField(`${name}: x =`, X.x, "", 0), numberField(`${name}: y =`, X.y, "", 0)],
            steps: [
              missingB ? `Im Parallelogramm ABCD ist ${vn("AB")} = ${vn("DC")}, also ${rule}.` : `Im Parallelogramm ABCD ist ${vn("BC")} = ${vn("AD")}, also ${rule}.`,
              `${missingB ? vn("DC") : vn("AD")} = ${vecHtml(arrow.x, arrow.y)}; ${name} = ${pt(start.x, start.y)} ⊕ ${vecHtml(arrow.x, arrow.y)}`,
              `<strong>${name}${pt(X.x, X.y)}</strong>`,
            ],
            meta: { variant, missingB: missingB ? 1 : 0, ax: A.x, ay: A.y, qx: Q.x, qy: Q.y, rx: R.x, ry: R.y },
          };
        }
        if (variant === 1) {
          // A, B and the meeting point M of the diagonals: C and D by halving
          const [A, B, C] = draw(
            () => [P(-2, 8), P(-2, 8), P(-2, 8)],
            ([a, b, c]) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 6,
            [
              { x: 0, y: 0 },
              { x: 6, y: 1 },
              { x: 7, y: 5 },
            ],
          );
          const M = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
          const D = { x: A.x + C.x - B.x, y: A.y + C.y - B.y };
          return {
            prompt: `Im Parallelogramm ABCD sind A${pt(A.x, A.y)} und B${pt(B.x, B.y)} bekannt, und die Diagonalen schneiden sich in M${pt(M.x, M.y)}. Berechne die Koordinaten von C und D.`,
            given: [`A${pt(A.x, A.y)}`, `B${pt(B.x, B.y)}`, `M${pt(M.x, M.y)}`],
            fields: [
              numberField("C: x =", C.x, "", 0, { slips: [{ value: M.x + (M.x - B.x), hint: "Das wäre D: C liegt A gegenüber, also C = M ⊕ AM→." }] }),
              numberField("C: y =", C.y, "", 0),
              numberField("D: x =", D.x, "", 0, { slips: [{ value: M.x + (M.x - A.x), hint: "Das wäre C: D liegt B gegenüber, also D = M ⊕ BM→." }] }),
              numberField("D: y =", D.y, "", 0),
            ],
            steps: [
              "Die Diagonalen eines Parallelogramms halbieren sich: M ist der Mittelpunkt von [AC] und von [BD].",
              `${vn("AM")} = ${vecHtml(M.x - A.x, M.y - A.y)}, also C = M ⊕ ${vn("AM")} = ${pt(C.x, C.y)}; ${vn("BM")} = ${vecHtml(M.x - B.x, M.y - B.y)}, also D = M ⊕ ${vn("BM")} = ${pt(D.x, D.y)}.`,
              `<strong>C${pt(C.x, C.y)}, D${pt(D.x, D.y)}</strong>`,
            ],
            meta: { variant, ax: A.x, ay: A.y, bx: B.x, by: B.y, cx: C.x, cy: C.y },
          };
        }
        // a kite with its symmetry axis AC parallel to the x-axis
        const y0 = rng.int(0, 4);
        const x1 = rng.int(-2, 2);
        const x2 = x1 + 2 * rng.int(3, 5);
        const rhombus = rng.next() < 0.35;
        const xb = rhombus ? (x1 + x2) / 2 : draw(() => rng.int(x1 + 1, x2 - 1), (x) => x !== (x1 + x2) / 2, x1 + 1);
        const yb = y0 - rng.int(2, 4);
        const D = { x: xb, y: 2 * y0 - yb };
        return {
          prompt: `Das Drachenviereck ABCD hat die Symmetrieachse AC mit A${pt(x1, y0)} und C${pt(x2, y0)}; außerdem ist B${pt(xb, yb)}. Berechne die Koordinaten von D. Ist ABCD sogar eine Raute?`,
          given: [`A${pt(x1, y0)}`, `C${pt(x2, y0)}`, `B${pt(xb, yb)}`],
          fields: [
            numberField("D: x =", D.x, "", 0),
            numberField("D: y =", D.y, "", 0, { slips: [{ value: -yb, hint: `Gespiegelt wird an der Geraden AC (y = ${fmt(y0)}), nicht an der x-Achse.` }] }),
            choiceField("Ist ABCD eine Raute?", ["ja", "nein"], rhombus ? 0 : 1),
          ],
          steps: [
            `AC liegt auf der Geraden y = ${fmt(y0)}. D ist das Spiegelbild von B: gleiche x-Koordinate, und B liegt ${fmt(y0 - yb)} unter der Achse, also liegt D ${fmt(y0 - yb)} darüber.`,
            rhombus
              ? `Das Lot von B trifft AC bei x = ${fmt(xb)}, genau in der Mitte von [AC] (${fmt(x1)} + ${fmt(x2)}) : 2 = ${fmt((x1 + x2) / 2)}. Die Diagonalen halbieren sich: eine Raute.`
              : `Die Mitte von [AC] liegt bei x = ${fmt((x1 + x2) / 2)}, das Lot von B trifft AC aber bei x = ${fmt(xb)}. [BD] halbiert [AC] nicht: keine Raute.`,
            `<strong>D${pt(D.x, D.y)}; ${rhombus ? "ja, eine Raute" : "nein, keine Raute"}</strong>`,
          ],
          meta: { variant, x1, x2, y0, xb, yb, rhombus: rhombus ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, welche Stücke ein Viereck festlegen, und konstruierst so, dass es auch im Zugmodus hält.",
};

// 1.6 Mit Viereckseigenschaften rechnen ────────────────────────────────────

function problemFormula(v: LabValues): string {
  if (v.fig === 0) return `m = (a + c) : 2 = ${cmText((v.a + v.c) / 2)}; A = m · h`;
  if (v.fig === 1) return `Rechteck e · f = ${fmt(v.e * v.f)} cm²; der Drachen ist die Hälfte`;
  return `h ≈ ${cmText(v.b * Math.sin((v.alpha * Math.PI) / 180), 2)} (gemessen); A = a · h`;
}

function problemAngleText(v: LabValues): string {
  const w = problemAngles(v);
  const sign = v.fig === 2 ? "=" : "≈";
  return w.map((x, i) => `${["α", "β", "γ", "δ"][i]} ${sign} ${fmt(x, 1)}°`).join(", ");
}

const viereckeAnwenden: Lesson = {
  id: "dv-6-vierecke-anwenden",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "1.6 Mit Viereckseigenschaften rechnen",
  subtitle: "Winkel aus den Eigenschaften, Flächen von Parallelogramm, Trapez und Drachen",
  tracks: ["I", "II_III"],
  lehrplan: `${BOTH}: Viereckseigenschaften nutzen`,
  whyItMatters:
    "Winkel und Flächen von Dachflächen, Grundstücken, Fliesen oder Drachen berechnest du aus wenigen Maßen, wenn du die Eigenschaften des Vierecks kennst. Die Flächenformeln brauchst du wieder, sobald du Oberflächen und Volumen von Körpern berechnest.",
  explanationHtml: `
    <p><strong>Winkel in besonderen Vierecken.</strong> Die Innenwinkelsumme jedes Vierecks ist 360° (Wiederholung aus M7). Dazu kommen die Eigenschaften:</p>
    <ul>
      <li><strong>Parallelogramm:</strong> Gegenüberliegende Winkel sind gleich groß (α = γ, β = δ), benachbarte ergänzen sich zu 180° (α + β = 180°), denn an parallelen Seiten sind sie Ergänzungswinkel.</li>
      <li><strong>Trapez</strong> mit AB ∥ CD: α + δ = 180° und β + γ = 180°. Im <strong>gleichschenkligen Trapez</strong> sind außerdem die Basiswinkel gleich groß: α = β und γ = δ.</li>
      <li><strong>Drachenviereck</strong> mit der Symmetrieachse AC: Die Winkel an den beiden anderen Ecken sind gleich groß (β = δ), und AC halbiert die Winkel α und γ.</li>
      <li><strong>Raute:</strong> Beide Diagonalen halbieren die Winkel und stehen senkrecht aufeinander.</li>
    </ul>
    <div class="example"><strong>Beispiel (Winkel):</strong> In der Raute ABCD ist α = 70°. Dann ist γ = 70° und β = δ = 180° − 70° = 110°. Die Diagonale [AC] halbiert α, also ∢BAC = 35°. Im Dreieck ABM mit dem rechten Winkel bei M ist ∢MBA = 180° − 90° − 35° = 55°, die Hälfte von β.</div>
    <p><strong>Flächeninhalte (Wiederholung aus M6):</strong></p>
    <table class="mini">
      <tr><th>Viereck</th><th>Flächeninhalt</th><th>Begründung</th></tr>
      <tr><td>Parallelogramm</td><td>A = g · h</td><td>ein Dreieck abschneiden und auf der anderen Seite anlegen: Rechteck g · h</td></tr>
      <tr><td>Trapez</td><td>A = ½ · (a + c) · h</td><td>zwei gleiche Trapeze, eines auf den Kopf gestellt angelegt, ergeben ein Parallelogramm mit der Grundseite a + c</td></tr>
      <tr><td>Drachenviereck, Raute</td><td>A = ½ · e · f</td><td>die Hälfte des Rechtecks mit den Seiten e und f</td></tr>
    </table>
    <p>Die Höhe h ist immer der senkrechte Abstand zur Grundseite, nie die schräge Seite. Beim Trapez heißt m = ½ · (a + c) die <strong>Mittellinie</strong>; damit ist A = m · h. Verschiebst du die obere Seite eines Trapezes auf ihrer Geraden, ändern sich a, c und h nicht, also auch nicht der Flächeninhalt.</p>
    <div class="example"><strong>Beispiel (Fläche):</strong> Trapez mit a = 9 cm, c = 5 cm und h = 6 cm: A = ½ · (9 cm + 5 cm) · 6 cm = 7 cm · 6 cm = 42 cm². Rückwärts: Ein Trapez mit A = 42 cm², a = 9 cm und c = 5 cm hat die Höhe h = 2 · A : (a + c) = 84 cm² : 14 cm = 6 cm. Ein Drachen mit e = 8 cm und f = 5 cm hat A = ½ · 8 cm · 5 cm = 20 cm².</div>
    <p><strong>Typische Fehler:</strong> beim Trapez oder Drachen das ½ vergessen; beim Parallelogramm die schräge Seite statt der Höhe nehmen; im Parallelogramm benachbarte Winkel gleichsetzen statt gegenüberliegende.</p>
    <div class="merke"><strong>Merke:</strong> Parallelogramm: α = γ, β = δ, α + β = 180° und A = g · h. Trapez: A = ½ · (a + c) · h. Drachen und Raute: A = ½ · e · f. Die Höhe steht immer senkrecht auf der Grundseite.</div>
  `,
  formulas: [
    { name: "Parallelogramm", html: "A = g · h; α = γ, β = δ, α + β = 180°", quantities: "g Grundseite, h die Höhe zu g" },
    { name: "Trapez", html: `A = ${frac("a + c", 2)} · h = m · h`, quantities: "a, c parallele Seiten, h ihr Abstand, m Mittellinie" },
    { name: "Drachenviereck und Raute", html: `A = ${frac("e · f", 2)}`, quantities: "e, f die Diagonalen" },
    { name: "Winkel", html: "gleichschenkliges Trapez: α = β, γ = δ; Drachen: β = δ", quantities: "Innenwinkelsumme im Viereck 360°" },
  ],
  quiz: {
    question: "Ein Parallelogramm hat die Seiten a = 8 cm und b = 5 cm, die Höhe zur Seite a ist 4 cm lang. Wie groß ist sein Flächeninhalt?",
    options: ["40 cm²", "32 cm²", "16 cm²", "20 cm²"],
    correctIndex: 1,
    explanation:
      "A = g · h = 8 cm · 4 cm = 32 cm². 40 cm² wäre a · b, aber die schräge Seite b ist nicht die Höhe. 16 cm² entsteht, wenn man wie beim Dreieck halbiert, 20 cm² mit b statt a als Grundseite.",
  },
  lab: {
    kind: "quadrilateral-problems",
    title: "Labor: Flächen und Winkel",
    intro:
      "Wähle eine Figur und ziehe an ihren Ecken. Beim Trapez verschiebst du mit D die obere Seite, beim Drachen mit M den Kreuzungspunkt der Diagonalen. Die Hilfsfigur zeigt, woher die Flächenformel kommt.",
    params: [
      {
        type: "choice",
        key: "fig",
        label: "Figur",
        options: [
          { value: 0, label: "Trapez: obere Seite verschieben" },
          { value: 1, label: "Drachenviereck im Rechteck" },
          { value: 2, label: "Parallelogramm: Winkel ändern" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "hilfe",
        label: "Hilfsfigur",
        options: [
          { value: 0, label: "ausblenden" },
          { value: 1, label: "zeigen" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "Grundseite a", unit: "cm", min: 3, max: 10, step: 0.5, value: 8, digits: 1, showIf: (v) => v.fig !== 1 },
      { type: "range", key: "c", label: "obere Seite c", unit: "cm", min: 1, max: 8, step: 0.5, value: 4, digits: 1, showIf: (v) => v.fig === 0 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 1, max: 6, step: 0.5, value: 4, digits: 1, showIf: (v) => v.fig === 0 },
      { type: "range", key: "s", label: "Verschiebung der oberen Seite", unit: "cm", min: -2, max: 6, step: 0.5, value: 1, digits: 1, showIf: (v) => v.fig === 0 },
      { type: "range", key: "e", label: "Diagonale e = [AC]", unit: "cm", min: 2, max: 10, step: 0.5, value: 8, digits: 1, showIf: (v) => v.fig === 1 },
      { type: "range", key: "f", label: "Diagonale f = [BD]", unit: "cm", min: 1, max: 6, step: 0.5, value: 5, digits: 1, showIf: (v) => v.fig === 1 },
      { type: "range", key: "p", label: "Lage von M auf [AC]", unit: "%", min: 10, max: 90, step: 5, value: 30, showIf: (v) => v.fig === 1 },
      { type: "range", key: "b", label: "Seite b", unit: "cm", min: 1, max: 6, step: 0.5, value: 4, digits: 1, showIf: (v) => v.fig === 2 },
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 15, max: 165, step: 5, value: 60, showIf: (v) => v.fig === 2 },
    ],
    readouts: [
      { key: "flaeche", label: "Flächeninhalt", unit: "cm²", digits: 2, emphasis: true, compute: problemArea },
      { key: "formel", label: "So rechnest du", compute: problemFormula },
      { key: "winkel", label: "Winkel", compute: problemAngleText },
    ],
    goals: [
      {
        id: "gleichschenklig",
        text: "Trapez: Verschiebe die obere Seite, bis das Trapez gleichschenklig ist und α = β gilt. Ändert sich dabei der Flächeninhalt?",
        check: (v) => v.fig === 0 && v.c < v.a && Math.abs(2 * v.s + v.c - v.a) < 1e-9,
      },
      {
        id: "raute",
        text: "Drachenviereck: Verschiebe den Kreuzungspunkt M so, dass aus dem Drachen eine Raute wird. Welcher Anteil des Rechtecks bleibt bedeckt?",
        check: (v) => v.fig === 1 && v.p === 50,
      },
      {
        id: "doppelt",
        text: "Parallelogramm: Stelle α so ein, dass α doppelt so groß ist wie β. Welche Winkelbeziehung hilft dir dabei?",
        check: (v) => v.fig === 2 && v.alpha === 120,
      },
    ],
  },
  exercises: [
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 4);
          if (kind === 0) {
            const alpha = draw(() => rng.int(40, 140), (x) => x !== 90, 64);
            return {
              prompt: `Im Parallelogramm ABCD ist α = ${alpha}°. Berechne β und γ.`,
              given: [`α = ${alpha}°`],
              formulaHint: "Parallelogramm: α + β = 180°, α = γ, β = δ",
              fields: [
                numberField("β =", 180 - alpha, "°", 0, { slips: [{ value: alpha, hint: "Benachbarte Winkel ergänzen sich zu 180°; gleich groß sind die gegenüberliegenden." }] }),
                numberField("γ =", alpha, "°", 0, { slips: [{ value: 180 - alpha, hint: "γ liegt α gegenüber und ist deshalb genauso groß." }] }),
              ],
              steps: [`β = 180° − ${alpha}° = ${180 - alpha}° (Ergänzungswinkel an den Parallelen AD und BC)`, `γ liegt α gegenüber: γ = ${alpha}°.`, `<strong>β = ${180 - alpha}°; γ = ${alpha}°</strong>`],
              meta: { kind, alpha },
            };
          }
          if (kind === 1) {
            const alpha = rng.int(40, 85);
            return {
              prompt: `Im gleichschenkligen Trapez ABCD mit AB ∥ CD ist der Basiswinkel α = ${alpha}°. Berechne β und γ.`,
              given: [`α = ${alpha}°`, "AB ∥ CD, AD = BC"],
              formulaHint: "gleichschenkliges Trapez: α = β, γ = δ; α + δ = 180°",
              fields: [
                numberField("β =", alpha, "°", 0, { slips: [{ value: 180 - alpha, hint: "Im gleichschenkligen Trapez sind die Basiswinkel α und β gleich groß." }] }),
                numberField("γ =", 180 - alpha, "°", 0, { slips: [{ value: alpha, hint: "γ und β liegen an der Seite [BC] zwischen den Parallelen: Sie ergänzen sich zu 180°." }] }),
              ],
              steps: ["Die Symmetrieachse macht die Basiswinkel gleich groß: β = α.", `β und γ ergänzen sich zu 180°: γ = 180° − ${alpha}° = ${180 - alpha}°.`, `<strong>β = ${alpha}°; γ = ${180 - alpha}°</strong>`],
              meta: { kind, alpha },
            };
          }
          if (kind === 2) {
            const [alpha, gamma] = draw(
              () => [2 * rng.int(20, 60), 2 * rng.int(15, 50)],
              ([a, g]) => Math.abs(a - g) >= 10 && (360 - a - g) / 2 >= 40 && (360 - a - g) / 2 <= 130,
              [80, 120],
            );
            const beta = (360 - alpha - gamma) / 2;
            return {
              prompt: `Im Drachenviereck ABCD mit der Symmetrieachse AC sind α = ${alpha}° und γ = ${gamma}°. Berechne β und den Winkel ∢BAC.`,
              given: [`α = ${alpha}°`, `γ = ${gamma}°`],
              formulaHint: "Drachen: β = δ; α + β + γ + δ = 360°; AC halbiert α und γ",
              fields: [
                numberField("β =", beta, "°", 0, { slips: [{ value: 360 - alpha - gamma, hint: "β und δ sind gleich groß und teilen sich den Rest zu 360°." }] }),
                numberField("∢BAC =", alpha / 2, "°", 0, { slips: [{ value: alpha, hint: "Die Symmetrieachse AC halbiert den Winkel α." }] }),
              ],
              steps: [`β = δ = (360° − ${alpha}° − ${gamma}°) : 2 = ${fmt(beta)}°`, `AC halbiert α: ∢BAC = ${alpha}° : 2 = ${alpha / 2}°`, `<strong>β = ${fmt(beta)}°; ∢BAC = ${alpha / 2}°</strong>`],
              meta: { kind, alpha, gamma },
            };
          }
          if (kind === 3) {
            const alpha = draw(() => 2 * rng.int(20, 70), (x) => x !== 90, 70);
            return {
              prompt: `In der Raute ABCD ist α = ${alpha}°. Berechne β und den Winkel ∢BAC, den die Diagonale [AC] mit der Seite [AB] bildet.`,
              given: [`α = ${alpha}°`],
              formulaHint: "Raute: α + β = 180°; die Diagonalen halbieren die Winkel",
              fields: [
                numberField("β =", 180 - alpha, "°", 0, { slips: [{ value: alpha, hint: "Benachbarte Winkel der Raute ergänzen sich zu 180°." }] }),
                numberField("∢BAC =", alpha / 2, "°", 0, { slips: [{ value: (180 - alpha) / 2, hint: "Das ist die Hälfte von β. Die Diagonale [AC] halbiert den Winkel bei A." }] }),
              ],
              steps: [`β = 180° − ${alpha}° = ${180 - alpha}°`, `[AC] halbiert α: ∢BAC = ${alpha / 2}°`, `<strong>β = ${180 - alpha}°; ∢BAC = ${alpha / 2}°</strong>`],
              meta: { kind, alpha },
            };
          }
          const [alpha, beta] = draw(() => [rng.int(40, 85), rng.int(40, 85)], ([a, b]) => Math.abs(a - b) >= 5, [60, 75]);
          return {
            prompt: `Im Trapez ABCD mit AB ∥ CD sind α = ${alpha}° und β = ${beta}°. Berechne γ und δ.`,
            given: [`α = ${alpha}°`, `β = ${beta}°`, "AB ∥ CD"],
            formulaHint: "Trapez mit AB ∥ CD: α + δ = 180°, β + γ = 180°",
            fields: [
              numberField("γ =", 180 - beta, "°", 0, { slips: [{ value: 180 - alpha, hint: "γ liegt an der Seite [BC], zusammen mit β." }] }),
              numberField("δ =", 180 - alpha, "°", 0, { slips: [{ value: 180 - beta, hint: "δ liegt an der Seite [AD], zusammen mit α." }] }),
            ],
            steps: [`An [BC] zwischen den Parallelen: γ = 180° − ${beta}° = ${180 - beta}°.`, `An [AD]: δ = 180° − ${alpha}° = ${180 - alpha}°.`, `<strong>γ = ${180 - beta}°; δ = ${180 - alpha}°</strong>`],
            meta: { kind, alpha, beta },
          };
        }
        const ctx = rng.int(0, 4);
        if (ctx === 0) {
          const x = draw(() => rng.int(20, 70), (n) => n !== 45, 30);
          return {
            prompt: `Ein Fenster hat die Form einer Raute ABCD; die Diagonalen schneiden sich in M. Die Diagonale [BD] bildet mit der Seite [AB] den Winkel ∢MBA = ${x}°. Berechne die Innenwinkel α und β der Raute.`,
            given: [`∢MBA = ${x}°`],
            fields: [
              numberField("α =", 180 - 2 * x, "°", 0, { slips: [{ value: 90 - x, hint: "Das ist ∢BAM, die Hälfte von α: Die Diagonale [AC] halbiert den Winkel bei A." }] }),
              numberField("β =", 2 * x, "°", 0, { slips: [{ value: x, hint: "[BD] halbiert β: Der ganze Winkel ist doppelt so groß." }] }),
            ],
            steps: [`Die Diagonalen stehen senkrecht: Im Dreieck ABM ist ∢BAM = 180° − 90° − ${x}° = ${90 - x}°.`, `Die Diagonalen halbieren die Winkel: α = 2 · ${90 - x}° = ${180 - 2 * x}°, β = 2 · ${x}° = ${2 * x}°.`, `<strong>α = ${180 - 2 * x}°; β = ${2 * x}°</strong>`],
            meta: { ctx, x, a1: 180 - 2 * x, a2: 2 * x },
          };
        }
        if (ctx === 1) {
          const [x, y] = draw(() => [rng.int(20, 60), rng.int(20, 60)], ([p, q]) => Math.abs(p - q) >= 5, [35, 50]);
          return {
            prompt: `Ein Grundstück hat die Form eines Parallelogramms ABCD. Die Diagonale [AC] teilt den Winkel bei A in ∢BAC = ${x}° und ∢CAD = ${y}°. Berechne den Winkel β bei B und den Winkel ∢ACB.`,
            given: [`∢BAC = ${x}°`, `∢CAD = ${y}°`],
            fields: [
              numberField("β =", 180 - x - y, "°", 0, { slips: [{ value: x + y, hint: "Das ist α. β ergänzt α zu 180°." }] }),
              numberField("∢ACB =", y, "°", 0, { slips: [{ value: x, hint: "∢ACB und ∢CAD sind Wechselwinkel an den Parallelen AD und BC, nicht ∢BAC." }] }),
            ],
            steps: [`α = ${x}° + ${y}° = ${x + y}°, also β = 180° − ${x + y}° = ${180 - x - y}°.`, `AD ∥ BC: ∢ACB und ∢CAD sind Wechselwinkel, also ∢ACB = ${y}°.`, `<strong>β = ${180 - x - y}°; ∢ACB = ${y}°</strong>`],
            meta: { ctx, x, y, a1: 180 - x - y, a2: y },
          };
        }
        if (ctx === 2) {
          const w = rng.int(25, 60);
          const p = rng.stepped(3, 6, 0.5);
          const q = p + rng.stepped(1, 4, 0.5);
          return {
            prompt: `Im Parallelogramm ABCD ist α = ${2 * w}°, AD = ${cm(p)} und CD = ${cm(q)}. Die Winkelhalbierende von α schneidet die Seite [CD] im Punkt E. Berechne den Winkel ∢DEA und die Länge [CE].`,
            given: [`α = ${2 * w}°`, `AD = ${cm(p)}`, `CD = ${cm(q)}`],
            fields: [
              numberField("∢DEA =", w, "°", 0, { slips: [{ value: 2 * w, hint: "Die Winkelhalbierende teilt α: ∢BAE ist nur die Hälfte, und ∢DEA ist sein Wechselwinkel." }] }),
              numberField("CE =", q - p, "cm", 1, { slips: [{ value: p, hint: "Das ist DE. Gesucht ist das restliche Stück CE = CD − DE." }] }),
            ],
            steps: [
              `∢BAE = ${2 * w}° : 2 = ${w}°. AB ∥ CD: ∢DEA und ∢BAE sind Wechselwinkel, also ∢DEA = ${w}°.`,
              `Im Dreieck AED sind die Winkel bei A und E je ${w}° groß: Es ist gleichschenklig mit DE = AD = ${cm(p)}.`,
              `<strong>∢DEA = ${w}°; CE = ${cm(q)} − ${cm(p)} = ${cm(q - p)}</strong>`,
            ],
            meta: { ctx, w, p, q, a1: w, a2: q - p },
          };
        }
        if (ctx === 3) {
          const [x, y] = draw(() => [rng.int(20, 45), rng.int(20, 45)], ([p, q]) => p + q < 85 && Math.abs(p - q) >= 4, [30, 40]);
          return {
            prompt: `Der Querschnitt eines Deichs ist ein gleichschenkliges Trapez ABCD mit AB ∥ CD und AD = BC. Die Diagonale [AC] teilt den Winkel bei A in ∢BAC = ${x}° und ∢CAD = ${y}°. Berechne den Winkel γ bei C und den Winkel ∢DCA.`,
            given: [`∢BAC = ${x}°`, `∢CAD = ${y}°`],
            fields: [
              numberField("γ =", 180 - x - y, "°", 0, { slips: [{ value: x + y, hint: "Das ist β = α. γ ergänzt β zu 180°." }] }),
              numberField("∢DCA =", x, "°", 0, { slips: [{ value: y, hint: "∢DCA und ∢BAC sind Wechselwinkel an den Parallelen AB und CD." }] }),
            ],
            steps: [`α = ${x}° + ${y}° = ${x + y}°; im gleichschenkligen Trapez ist β = α, also γ = 180° − ${x + y}° = ${180 - x - y}°.`, `AB ∥ CD: ∢DCA = ∢BAC = ${x}° (Wechselwinkel).`, `<strong>γ = ${180 - x - y}°; ∢DCA = ${x}°</strong>`],
            meta: { ctx, x, y, a1: 180 - x - y, a2: x },
          };
        }
        const [x, y] = draw(() => [rng.int(20, 60), rng.int(25, 70)], ([p, q]) => p + q > 90 && p + q < 150 && Math.abs(p - q) >= 5, [40, 65]);
        return {
          prompt: `Ein Drachen ABCD hat die Symmetrieachse AC. Die Leiste [AC] bildet mit der Seite [AB] den Winkel ∢BAC = ${x}° und mit der Seite [BC] den Winkel ∢ACB = ${y}°. Berechne den Winkel β bei B und den Winkel γ bei C.`,
          given: [`∢BAC = ${x}°`, `∢ACB = ${y}°`],
          fields: [
            numberField("β =", 180 - x - y, "°", 0, { slips: [{ value: 360 - 2 * x - 2 * y, hint: "Das sind β und δ zusammen. β allein folgt aus dem Dreieck ABC." }] }),
            numberField("γ =", 2 * y, "°", 0, { slips: [{ value: y, hint: "AC halbiert γ: Der ganze Winkel ist doppelt so groß wie ∢ACB." }] }),
          ],
          steps: [`Im Dreieck ABC: β = 180° − ${x}° − ${y}° = ${180 - x - y}°.`, `AC halbiert den Winkel bei C: γ = 2 · ${y}° = ${2 * y}°.`, `<strong>β = ${180 - x - y}°; γ = ${2 * y}°</strong>`],
          meta: { ctx, x, y, a1: 180 - x - y, a2: 2 * y },
        };
      },
    },
    {
      id: "flaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 3);
          if (kind === 0) {
            const g = rng.stepped(3, 12, 0.5);
            const h = rng.stepped(2, 8, 0.5);
            const b = h + rng.stepped(0.5, 3, 0.5);
            return {
              prompt: `Ein Parallelogramm hat die Grundseite g = ${cm(g)}, die schräge Seite b = ${cm(b)} und die Höhe h = ${cm(h)} zur Grundseite. Berechne seinen Flächeninhalt.`,
              given: [`g = ${cm(g)}`, `b = ${cm(b)}`, `h = ${cm(h)}`],
              formulaHint: "Parallelogramm: A = g · h",
              fields: [
                numberField("A =", g * h, "cm²", 2, {
                  slips: [
                    { value: g * b, hint: "Die schräge Seite b ist nicht die Höhe. Die Höhe steht senkrecht auf der Grundseite." },
                    { value: (g * h) / 2, hint: "Beim Parallelogramm wird nicht halbiert; das gilt für Dreiecke." },
                  ],
                }),
              ],
              steps: ["Die Höhe steht senkrecht auf g; die schräge Seite b brauchst du nicht.", `<strong>A = ${cm(g)} · ${cm(h)} = ${fmtUnit(g * h, "cm²")}</strong>`],
              meta: { kind, g, h, b },
            };
          }
          if (kind === 1) {
            const a = rng.stepped(4, 12, 0.5);
            const c = rng.stepped(1, a - 1, 0.5);
            const h = rng.stepped(2, 8, 1);
            const m = (a + c) / 2;
            return {
              prompt: `Ein Trapez hat die parallelen Seiten a = ${cm(a)} und c = ${cm(c)} und die Höhe h = ${cm(h)}. Berechne die Mittellinie m und den Flächeninhalt.`,
              given: [`a = ${cm(a)}`, `c = ${cm(c)}`, `h = ${cm(h)}`],
              formulaHint: `Trapez: m = ${frac("a + c", 2)}; A = m · h`,
              fields: [
                numberField("m =", m, "cm", 2, { slips: [{ value: a + c, hint: "Die Mittellinie ist die Hälfte von a + c." }] }),
                numberField("A =", m * h, "cm²", 2, { slips: [{ value: (a + c) * h, hint: "Das ½ fehlt: A = ½ · (a + c) · h." }] }),
              ],
              steps: [`m = (${cm(a)} + ${cm(c)}) : 2 = ${cm(m, 2)}`, `<strong>m = ${cm(m, 2)}; A = ${cm(m, 2)} · ${cm(h)} = ${fmtUnit(m * h, "cm²")}</strong>`],
              meta: { kind, a, c, h },
            };
          }
          const e = rng.stepped(2, 12, 0.5);
          const f = draw(() => rng.stepped(2, 12, 1), (x) => x !== e, e === 12 ? 6 : 7);
          const name = kind === 2 ? "Ein Drachenviereck" : "Eine Raute";
          return {
            prompt: `${name} hat die Diagonalen e = ${cm(e)} und f = ${cm(f)}. Berechne den Flächeninhalt des Rechtecks mit den Seiten e und f und den Flächeninhalt ${kind === 2 ? "des Drachenvierecks" : "der Raute"}.`,
            given: [`e = ${cm(e)}`, `f = ${cm(f)}`],
            formulaHint: `A = ${frac("e · f", 2)}`,
            fields: [
              numberField("Rechteck e · f =", e * f, "cm²", 2, { slips: [{ value: (e * f) / 2, hint: "Das ist schon die halbe Fläche. Das Rechteck hat e · f." }] }),
              numberField("A =", (e * f) / 2, "cm²", 2, { slips: [{ value: e * f, hint: "Die Figur bedeckt nur die Hälfte des Rechtecks: A = ½ · e · f." }] }),
            ],
            steps: [`Rechteck: ${cm(e)} · ${cm(f)} = ${fmtUnit(e * f, "cm²")}`, `<strong>A = ½ · ${fmtUnit(e * f, "cm²")} = ${fmtUnit((e * f) / 2, "cm²")}</strong>`],
            meta: { kind, e, f },
          };
        }
        const ctx = rng.int(0, 3);
        if (ctx === 0) {
          const a = rng.int(20, 40);
          const c = rng.int(8, a - 6);
          const h = rng.int(10, 30);
          const area = ((a + c) / 2) * h;
          return {
            prompt: `Ein Grundstück hat die Form eines Trapezes. Die beiden parallelen Grenzen sind ${a} m und ${c} m lang, der Flächeninhalt beträgt ${big(area)} m². Wie weit sind die parallelen Grenzen voneinander entfernt?`,
            given: [`a = ${a} m`, `c = ${c} m`, `A = ${big(area)} m²`],
            fields: [numberField("h =", h, "m", 2, { slips: [{ value: area / (a + c), hint: "Das ½ aus der Formel: A = ½ · (a + c) · h, also h = 2 · A : (a + c)." }, { value: (2 * area) / a, hint: "Teile 2 · A durch a + c, nicht nur durch a." }] })],
            steps: [`A = ½ · (a + c) · h, also h = 2 · A : (a + c).`, `h = 2 · ${big(area)} m² : ${a + c} m = ${big(2 * area)} m² : ${a + c} m`, `<strong>h = ${h} m</strong>`],
            meta: { ctx, a, c, h },
          };
        }
        if (ctx === 1) {
          const e = rng.stepped(10, 30, 1);
          const f = draw(() => rng.stepped(6, 24, 2), (x) => x !== e, 12);
          const area = (e * f) / 2;
          return {
            prompt: `Eine Fliese hat die Form einer Raute mit dem Flächeninhalt ${fmt(area)} cm². Ihre lange Diagonale ist ${cm(Math.max(e, f))} lang. Wie lang ist die kurze Diagonale?`,
            given: [`A = ${fmt(area)} cm²`, `e = ${cm(Math.max(e, f))}`],
            fields: [numberField("f =", Math.min(e, f), "cm", 2, { slips: [{ value: area / Math.max(e, f), hint: "A = ½ · e · f, also f = 2 · A : e. Das ½ nicht vergessen." }] })],
            steps: [`A = ½ · e · f, also f = 2 · A : e.`, `<strong>f = 2 · ${fmt(area)} cm² : ${cm(Math.max(e, f))} = ${cm(Math.min(e, f))}</strong>`],
            meta: { ctx, e: Math.max(e, f), f: Math.min(e, f) },
          };
        }
        if (ctx === 2) {
          const a = rng.stepped(5, 10, 0.5);
          const b = rng.stepped(3, a - 0.5, 0.5);
          const ha = rng.stepped(2, b - 0.5, 0.5);
          const area = a * ha;
          const hb = area / b;
          return {
            prompt: `Ein Parallelogramm hat die Seiten a = ${cm(a)} und b = ${cm(b)}; die Höhe zur Seite a ist ${cm(ha)} lang. Berechne den Flächeninhalt und die Höhe zur Seite b.`,
            given: [`a = ${cm(a)}`, `b = ${cm(b)}`, `Höhe zu a: ${cm(ha)}`],
            fields: [
              numberField("A =", area, "cm²", 2, { slips: [{ value: a * b, hint: "a · b ist kein Flächeninhalt des Parallelogramms: Nimm die Höhe, die senkrecht auf a steht." }] }),
              numberField("Höhe zu b:", hb, "cm", 2, { slips: [{ value: ha, hint: "Zu jeder Seite gehört ihre eigene Höhe. Aus A = b · h folgt die Höhe zu b." }] }),
            ],
            steps: [`A = a · (Höhe zu a) = ${cm(a)} · ${cm(ha)} = ${fmtUnit(area, "cm²")}`, `Derselbe Flächeninhalt ist b · (Höhe zu b), also Höhe zu b = ${fmtUnit(area, "cm²")} : ${cm(b)}`, `<strong>A = ${fmtUnit(area, "cm²")}; Höhe zu b ${Math.abs(hb - Math.round(hb * 100) / 100) < 1e-9 ? "=" : "≈"} ${cm(hb, 2)}</strong>`],
            meta: { ctx, a, b, ha },
          };
        }
        const a = rng.stepped(5, 12, 0.5);
        const c = rng.stepped(2, a - 1, 0.5);
        const h = rng.stepped(2, 7, 1);
        return {
          prompt: `Lena legt zwei gleiche Trapeze mit a = ${cm(a)}, c = ${cm(c)} und h = ${cm(h)} so aneinander, dass das zweite auf dem Kopf steht und ein Parallelogramm entsteht. Wie lang ist die Grundseite dieses Parallelogramms, und wie groß ist der Flächeninhalt eines Trapezes?`,
          given: [`a = ${cm(a)}`, `c = ${cm(c)}`, `h = ${cm(h)}`],
          fields: [
            numberField("Grundseite:", a + c, "cm", 2, { slips: [{ value: a, hint: "Unten liegt a des ersten Trapezes neben c des zweiten." }] }),
            numberField("Trapez A =", ((a + c) * h) / 2, "cm²", 2, { slips: [{ value: (a + c) * h, hint: "Das ist das ganze Parallelogramm aus zwei Trapezen; ein Trapez ist die Hälfte." }] }),
          ],
          steps: [`Unten liegen a und c nebeneinander: Grundseite a + c = ${cm(a + c)}, Höhe ${cm(h)}.`, `Parallelogramm: ${cm(a + c)} · ${cm(h)} = ${fmtUnit((a + c) * h, "cm²")}; ein Trapez ist die Hälfte.`, `<strong>Grundseite ${cm(a + c)}; A = ${fmtUnit(((a + c) * h) / 2, "cm²")}</strong>`],
          meta: { ctx, a, c, h },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Winkel aus Eigenschaften, Flächen vorwärts und rückwärts: Mit Vierecken rechnest du jetzt sicher.",
};

export const STAGE_DREIECKE_VIERECKE: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Dreiecke und Vierecke",
  subtitle: "Dreiecke begründen, konstruieren und vergleichen; Vierecke ordnen, konstruieren und nutzen",
  icon: "📐",
  accent: "#2563eb",
  badgeTitle: "Figurenkenner",
  lehrplanLabel: "LB 1 Vierecke (I) · LB 1 Dreiecke und Vierecke (II/III)",
  lessons: [dreiecksexistenz, dreieckskonstruktion, kongruenz, hausDerVierecke, viereckskonstruktion, viereckeAnwenden],
};
