import { fmt, fmtUnit } from "../exercises/format";
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
} from "../lab/views-dreiecke-vierecke";
import type { AnswerField, ChoiceField, ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-1-dreiecke-vierecke";
const II = "M8 LB 1 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

const cm = (value: number, digits = 1): string => fmtUnit(value, "cm", digits);

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
  { unit: "dm", name: "x", labels: ["kürzeste Leiste:", "längste Leiste:", "Anzahl der Längen:"] },
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
        const x = rng.int(80, 120);
        const y = rng.int(180 - x, 120);
        const sum = x + y;
        return {
          prompt: `Mia hat in den Plan eines dreieckigen Beets ABC die Winkel ∢BAC = ${x}° und ∢CBA = ${y}° eingetragen. Prüfe, ob es so ein Beet geben kann.`,
          given: [`∢BAC = ${x}°`, `∢CBA = ${y}°`],
          fields: [
            numberField("∢BAC + ∢CBA =", sum, "°", 0),
            shuffledChoice(rng, "Ergebnis:", "Das Beet gibt es nicht: Zwei Winkel ergeben schon 180° oder mehr.", [
              "Das Beet gibt es: Der Winkel bei C ist eben sehr klein.",
              "Das Beet gibt es, wenn die Seiten lang genug sind.",
            ]),
          ],
          steps: [
            `${x}° + ${y}° = ${sum}°`,
            sum === 180
              ? "Für den Winkel bei C bliebe 0° übrig: Die freien Schenkel in A und B wären parallel."
              : "Schon die beiden Winkel sind zusammen größer als 180°: Die freien Schenkel laufen auseinander.",
            `<strong>${sum}° ≥ 180°: Das Beet gibt es nicht.</strong>`,
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

/** The scale contexts of 1.2, Level 2: a side and two angles of a real triangle. */
export const SCALE_CONTEXTS = [
  { kind: 3, lengths: [30, 35, 40, 45, 50, 60], unit: "m", scale: 1000 },
  { kind: 2, lengths: [2.4, 3, 3.6, 4, 4.5], unit: "m", scale: 50 },
  { kind: 3, lengths: [1.2, 1.5, 1.8, 2], unit: "km", scale: 25000 },
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
    <p>Genau hinschauen musst du bei zwei Seiten und einem Gegenwinkel. Sind c, a und α gegeben, schlägst du um B einen Kreis mit dem Radius a. Ist a länger als c, liegt α der längeren Seite gegenüber (SsW), und der Kreis schneidet den freien Schenkel von α genau einmal. Ist a kürzer als c, kann er den Schenkel <strong>zweimal</strong>, einmal oder gar nicht treffen. Ist α ein stumpfer oder rechter Winkel, muss a sogar die längste Seite sein, sonst gibt es kein Dreieck.</p>
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
          const fields: AnswerField[] = [choiceField("Fall:", FALL_OPTIONS, t.kind), choiceField("Anzahl der Dreiecke:", COUNT_OPTIONS, t.exists ? 0 : 1)];
          if (t.missing) {
            fields.push(
              numberField(`${t.missing.name} =`, t.missing.value, "°", 0, {
                slips: [{ value: 360 - t.missing.from[0] - t.missing.from[1], hint: "Im Dreieck ist die Winkelsumme 180°." }],
              }),
            );
          }
          return {
            prompt: `Ein Dreieck ABC soll aus diesen Stücken konstruiert werden: ${listText(shown)}. Welcher Fall liegt vor, und wie viele Dreiecke gibt es?${t.missing ? ` Berechne außerdem den Winkel ${t.missing.name}, den du für die Konstruktion an der gegebenen Seite brauchst.` : ""}`,
            given: shown,
            formulaHint: "Liegt der Winkel zwischen zwei Seiten (SWS), an den Enden einer Seite (WSW) oder einer Seite gegenüber (SWW, SsW)? SSS: längste Seite &lt; Summe; WSW: die beiden Winkel zusammen &lt; 180°.",
            fields,
            steps: [
              t.reason,
              t.condition,
              ...(t.missing ? [`${t.missing.name} = 180° − ${t.missing.from[0]}° − ${t.missing.from[1]}° = ${t.missing.value}°; damit kennst du beide Winkel an der Seite und konstruierst nach WSW.`] : []),
              `<strong>${FALL_OPTIONS[t.kind]}; ${t.exists ? "genau ein Dreieck" : "kein Dreieck"}${t.missing ? `; ${t.missing.name} = ${t.missing.value}°` : ""}</strong>`,
            ],
            meta: { kind: t.kind, exists: t.exists ? 1 : 0, r: t.r, missing: t.missing?.value ?? -1 },
          };
        }
        const ctx = rng.int(0, 2);
        const c = SCALE_CONTEXTS[ctx];
        const L = rng.pick(c.lengths);
        const x = ctx === 1 ? rng.int(50, 80) : rng.int(38, 72);
        const y = ctx === 1 ? rng.int(35, Math.min(75, 150 - x)) : rng.int(45, Math.min(90, 150 - x));
        // ctx 0 and 2: x at A, y at C (opposite [AB]); ctx 1: x at A, y at B
        const angle = 180 - x - y;
        const lengthCm = c.unit === "km" ? L * 100000 : L * 100;
        const drawn = lengthCm / c.scale;
        const scaleText = `1 : ${fmt(c.scale, 0)}`;
        const prompts = [
          `Ein dreieckiges Grundstück ABC grenzt mit der ${fmt(L)} m langen Seite [AB] an eine Straße. Bei A bilden die Grenzen [AB] und [AC] einen Winkel von ${x}°, bei C treffen sich die Grenzen [AC] und [BC] unter ${y}°. Das Grundstück soll im Maßstab ${scaleText} konstruiert werden. Welcher Fall liegt vor? Welchen Winkel musst du noch berechnen, und wie lang wird [AB] in der Zeichnung?`,
          `Ein dreieckiges Sonnensegel ABC hat eine ${fmt(L)} m lange Unterkante [AB]. An der Ecke A schließt die Kante [AC] mit der Unterkante einen Winkel von ${x}° ein, an der Ecke B die Kante [BC] einen Winkel von ${y}°. Lena zeichnet das Segel im Maßstab ${scaleText}. Welcher Fall liegt vor? Wie groß wird der Winkel bei C, und wie lang zeichnet sie [AB]?`,
          `Drei Hütten A, B und C sind durch gerade Wege verbunden. Der Weg von A nach B ist ${fmt(L)} km lang. Bei A bilden die Wege nach B und nach C einen Winkel von ${x}°, bei C treffen sich die Wege von A und von B unter ${y}°. Für eine Wanderkarte im Maßstab ${scaleText} wird das Dreieck konstruiert. Welcher Fall liegt vor? Welchen Winkel brauchst du noch, und wie lang wird der Weg [AB] auf der Karte?`,
        ];
        const angleName = ctx === 1 ? "∢ACB" : "∢CBA";
        const unitWord = c.unit === "km" ? "km" : "m";
        return {
          prompt: prompts[ctx],
          given: ctx === 1 ? [`AB = ${fmt(L)} m`, `∢BAC = ${x}°`, `∢CBA = ${y}°`, `Maßstab ${scaleText}`] : [`AB = ${fmt(L)} ${unitWord}`, `∢BAC = ${x}°`, `∢ACB = ${y}°`, `Maßstab ${scaleText}`],
          fields: [
            choiceField("Fall:", FALL_OPTIONS, c.kind),
            numberField(`${angleName} =`, angle, "°", 0, { slips: [{ value: 360 - x - y, hint: "Im Dreieck ist die Winkelsumme 180°." }] }),
            numberField("[AB] in der Zeichnung:", drawn, "cm", 1, {
              slips: [
                { value: L / c.scale, hint: `Das ist die Länge in ${unitWord === "km" ? "Kilometern" : "Metern"}. Rechne zuerst in Zentimeter um.` },
                { value: L, hint: `Teile die wirkliche Länge (in cm) durch ${fmt(c.scale, 0)}.` },
              ],
            }),
          ],
          steps: [
            ctx === 1
              ? "Gegeben sind die Seite [AB] und die beiden Winkel an ihren Enden A und B: WSW."
              : "Gegeben sind die Seite [AB], der Winkel bei A an dieser Seite und der Winkel bei C, der ihr gegenüberliegt: SWW.",
            ctx === 1
              ? `Zur Kontrolle: ∢ACB = 180° − ${x}° − ${y}° = ${angle}°.`
              : `Für die Konstruktion brauchst du auch den Winkel bei B an [AB]: ∢CBA = 180° − ${x}° − ${y}° = ${angle}°. Dann konstruierst du nach WSW.`,
            `Maßstab ${scaleText}: ${fmt(L)} ${unitWord} = ${fmt(lengthCm, 0)} cm, und ${fmt(lengthCm, 0)} cm : ${fmt(c.scale, 0)} = ${cm(drawn)}.`,
            `<strong>${FALL_OPTIONS[c.kind]}; ${angleName} = ${angle}°; [AB] wird ${cm(drawn)} lang.</strong>`,
          ],
          meta: { ctx, L, x, y, angle, drawn },
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
              choiceField("Anzahl der Dreiecke:", ["genau eines", "zwei", "keines"], 0),
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
        if (roll < 0.7) {
          const { c, a, alpha } = draw(
            () => {
              const alpha = multiple(rng, 25, 60, 5);
              const c = rng.stepped(5, 9, 0.5);
              return { c, a: rng.stepped(2, c - 0.5, 0.5), alpha };
            },
            (t) => t.a > t.c * Math.sin((t.alpha * Math.PI) / 180) + 0.3 && t.a < t.c - 0.25 && ssaLengths(t.c, t.a, t.alpha).length === 2,
            { c: 7, a: 5, alpha: 40 },
          );
          return {
            prompt: `Lena soll ein Dreieck ABC mit c = ${cm(c)}, a = ${cm(a)} und α = ${alpha}° konstruieren. Sie erhält zwei verschiedene Dreiecke und glaubt, sie habe sich verzeichnet. Was stimmt? Und wie müsste a sein, damit es sicher nur ein Dreieck gibt?`,
            given: [`c = ${cm(c)}`, `a = ${cm(a)}`, `α = ${alpha}°`],
            fields: [
              shuffledChoice(rng, "Was stimmt?", "Zwei Dreiecke sind möglich: α liegt der kürzeren Seite a gegenüber.", [
                "Sie hat sich verzeichnet: Zwei Seiten und ein Winkel ergeben immer genau ein Dreieck.",
                "Sie hat sich verzeichnet: Weil a kürzer als c ist, gibt es gar kein Dreieck.",
              ]),
              choiceField("Sicher eindeutig wäre es, wenn a …", ["länger als c wäre", "kürzer als c wäre"], 0),
            ],
            steps: [
              `α liegt a gegenüber, und a = ${cm(a)} ist kürzer als c = ${cm(c)}.`,
              "Der Kreis um B mit dem Radius a kann den freien Schenkel von α dann zweimal schneiden: zwei Dreiecke ABC₁ und ABC₂, die nicht deckungsgleich sind.",
              "Ist a länger als c, liegt α der längeren Seite gegenüber (SsW), und der Kreis schneidet den Schenkel nur einmal.",
              "<strong>Lena hat richtig gezeichnet; eindeutig wäre es mit a länger als c.</strong>",
            ],
            meta: { variant: 1, c, a, alpha },
          };
        }
        const alpha = multiple(rng, 30, 120, 5);
        const c = rng.stepped(3, 7, 0.5);
        const a = c + rng.stepped(0.5, 3, 0.5);
        return {
          prompt: `Tim behauptet: „Mit c = ${cm(c)}, a = ${cm(a)} und α = ${alpha}° gibt es zwei verschiedene Dreiecke ABC.“ Wie viele Dreiecke gibt es wirklich, und warum?`,
          given: [`c = ${cm(c)}`, `a = ${cm(a)}`, `α = ${alpha}°`],
          fields: [
            numberField("Anzahl der Dreiecke:", 1, "", 0, { slips: [{ value: 2, hint: "Vergleiche a und c: Welcher Seite liegt α gegenüber, der längeren oder der kürzeren?" }] }),
            shuffledChoice(rng, "Begründung:", "α liegt der längeren Seite a gegenüber (SsW).", ["α liegt der kürzeren Seite gegenüber.", "Ein Kreis schneidet einen Schenkel immer zweimal."]),
          ],
          steps: [
            `α liegt a gegenüber, und a = ${cm(a)} ist länger als c = ${cm(c)}.`,
            "Der Kreis um B mit dem Radius a schneidet den freien Schenkel von α dann genau einmal (SsW).",
            "<strong>genau ein Dreieck; Tim irrt sich</strong>",
          ],
          meta: { variant: 2, c, a, alpha },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Planfigur, Fall, Konstruktionsbeschreibung: Du konstruierst wie im Heft und weißt vorher, wie viele Lösungen es gibt.",
};

// 1.3 Die Kongruenzsätze ───────────────────────────────────────────────────

export const THEOREM_OPTIONS = ["SSS", "SWS", "WSW (auch SWW)", "SsW", "nicht entscheidbar"];
const WHY_NOT = ["Der Winkel liegt der kürzeren Seite gegenüber.", "Gleiche Winkel legen die Größe nicht fest.", "Zwei Seiten allein legen kein Dreieck fest."];

/** The congruence lab's readout for the theorem the chosen pieces form. */
function theoremReadout(v: LabValues): string {
  const res = congruenceResult(v);
  if (v.art === 4) return res.count === "keins" ? "kein Dreieck" : "keiner: WWW legt die Größe nicht fest";
  if (res.count === "keins") return "kein Dreieck";
  if (v.art === 3) {
    if (v.a > v.c) return "SsW: α liegt der längeren Seite gegenüber";
    return v.a < v.c ? "keiner: α liegt der kürzeren Seite gegenüber" : "keiner der Sätze, a = c";
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

function makeCongruencePair(rng: Rng): CongruencePair & { r: number; ask?: { type: "side" | "angle"; index: number } } {
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
    return { kind, r, answer: 0, lines: [0, 1, 2].map((i) => side(i, s[i])), reason: "Alle drei Seiten stimmen überein: SSS.", ask: { type: "angle", index: rng.int(0, 2) } };
  }
  if (kind === 1) {
    return {
      kind,
      r,
      answer: 1,
      lines: [side(1, rng.stepped(3, 9, 0.5)), side(2, rng.stepped(3, 9, 0.5)), angle(0, multiple(rng, 20, 140, 5))],
      reason: `Der Winkel ${angleOf(0)} liegt zwischen den Seiten [${sideOf(1)}] und [${sideOf(2)}]: SWS.`,
      ask: { type: "side", index: 0 },
    };
  }
  if (kind === 2 || kind === 3) {
    const p = multiple(rng, 25, 110, 5);
    const q = multiple(rng, 20, 155 - p, 5);
    const s0 = rng.stepped(3, 9, 0.5);
    return kind === 2
      ? { kind, r, answer: 2, lines: [side(0, s0), angle(1, p), angle(2, q)], reason: `Die Winkel ${angleOf(1)} und ${angleOf(2)} liegen an den Enden der Seite [${sideOf(0)}]: WSW.`, ask: { type: "side", index: 1 } }
      : {
          kind,
          r,
          answer: 2,
          lines: [side(0, s0), angle(1, p), angle(0, q)],
          reason: `${angleOf(1)} liegt an der Seite [${sideOf(0)}], ${angleOf(0)} ihr gegenüber; der dritte Winkel stimmt wegen der Winkelsumme auch überein: SWW, also WSW.`,
          ask: { type: "angle", index: 2 },
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
      ask: { type: "side", index: 2 },
    };
  }
  if (kind === 5) {
    return {
      kind,
      r,
      answer: 4,
      lines: [side(0, short), side(1, long), angle(0, multiple(rng, 25, 70, 5))],
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
          const at = (i: number) => (i + t.r) % 3;
          const fields: ChoiceField[] = [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, t.answer)];
          let question: string;
          let extraStep = "";
          let answerLine: string;
          if (t.ask) {
            const i = t.ask.index;
            if (t.ask.type === "side") {
              const piece = `[${pair(VERTEX[at(i + 1)], VERTEX[at(i + 2)])}]`;
              const right = `[${pair(DEF[at(i + 1)], DEF[at(i + 2)])}]`;
              const wrong = [1, 2].map((d) => `[${pair(DEF[at(i + d + 1)], DEF[at(i + d + 2)])}]`);
              fields.push(shuffledChoice(rng, `So lang wie ${piece} ist`, right, wrong));
              question = ` Welche Seite des Dreiecks DEF ist dann so lang wie ${piece}?`;
              extraStep = `Zu ${piece} gehört die Seite ${right}, denn ${VERTEX[at(i + 1)]} ↦ ${DEF[at(i + 1)]} und ${VERTEX[at(i + 2)]} ↦ ${DEF[at(i + 2)]}.`;
              answerLine = `${THEOREM_OPTIONS[t.answer]}; ${right} ist so lang wie ${piece}.`;
            } else {
              const piece = `∢${VERTEX[at(i + 1)]}${VERTEX[at(i)]}${VERTEX[at(i + 2)]}`;
              const right = `∢${DEF[at(i + 1)]}${DEF[at(i)]}${DEF[at(i + 2)]}`;
              const wrong = [1, 2].map((d) => `∢${DEF[at(i + d + 1)]}${DEF[at(i + d)]}${DEF[at(i + d + 2)]}`);
              fields.push(shuffledChoice(rng, `So groß wie ${piece} ist`, right, wrong));
              question = ` Welcher Winkel des Dreiecks DEF ist dann so groß wie ${piece}?`;
              extraStep = `Zum Winkel bei ${VERTEX[at(i)]} gehört der Winkel bei ${DEF[at(i)]}, denn ${VERTEX[at(i)]} ↦ ${DEF[at(i)]}.`;
              answerLine = `${THEOREM_OPTIONS[t.answer]}; ${right} ist so groß wie ${piece}.`;
            }
          } else {
            const why = t.kind === 5 ? 0 : 1;
            fields.push(choiceField("Woran liegt es, falls kein Satz passt?", WHY_NOT, why));
            question = " Falls kein Satz passt: Woran liegt es?";
            answerLine = `nicht entscheidbar: ${WHY_NOT[why]}`;
          }
          return {
            prompt: `Von den Dreiecken ABC und DEF kennst du die unten stehenden Stücke; dabei entspricht A dem Punkt D, B dem Punkt E und C dem Punkt F. Nach welchem Kongruenzsatz sind die Dreiecke kongruent, oder lässt es sich nicht entscheiden?${question}`,
            given: shown,
            formulaHint: "Wo liegt der Winkel: zwischen den Seiten (SWS), an der Seite (WSW), gegenüber der längeren Seite (SsW)? WWW und SSW mit dem Winkel gegenüber der kürzeren Seite reichen nicht.",
            fields,
            steps: [t.reason, ...(extraStep ? [extraStep] : []), `<strong>${answerLine}</strong>`],
            meta: { kind: t.kind, r: t.r, answer: t.answer, ask: t.ask ? (t.ask.type === "side" ? 10 : 20) + t.ask.index : -1 },
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
            prompt: `Im Drachenviereck ABCD gilt AB = AD und CB = CD. Die Diagonale [AC] zerlegt es in die Dreiecke ABC und ADC. Nach welchem Kongruenzsatz sind sie kongruent? Wie groß ist der Winkel ∢DAB bei A, wenn ∢CAB = ${y}° ist?`,
            given: ["AB = AD", "CB = CD", "[AC] gemeinsam", `∢CAB = ${y}°`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 0), numberField("∢DAB =", 2 * y, "°", 0, { slips: [{ value: y, hint: "Das ist nur die Hälfte: ∢DAB besteht aus ∢CAB und dem gleich großen ∢DAC." }] })],
            steps: ["AB = AD, CB = CD und die gemeinsame Seite [AC]: SSS.", `Also ist ∢DAC = ∢CAB = ${y}°: Die Diagonale [AC] halbiert den Winkel bei A.`, `<strong>SSS; ∢DAB = 2 · ${y}° = ${2 * y}°</strong>`],
            meta: { ctx, y, answer: 2 * y },
          };
        }
        if (ctx === 2) {
          const gamma = multiple(rng, 30, 140, 2);
          return {
            prompt: `Im gleichschenkligen Dreieck ABC ist AC = BC. M ist der Mittelpunkt der Basis [AB]. Die Strecke [CM] zerlegt das Dreieck in die Dreiecke AMC und BMC. Nach welchem Kongruenzsatz sind sie kongruent? Wie groß ist ∢MCA, wenn der Winkel an der Spitze ∢ACB = ${gamma}° beträgt?`,
            given: ["AC = BC", "AM = BM", "[CM] gemeinsam", `∢ACB = ${gamma}°`],
            fields: [choiceField("Kongruenzsatz:", THEOREM_OPTIONS, 0), numberField("∢MCA =", gamma / 2, "°", 0, { slips: [{ value: gamma, hint: "[CM] teilt den Winkel an der Spitze in zwei gleich große Teile." }, { value: (180 - gamma) / 2, hint: "Das ist ein Basiswinkel. Gesucht ist der Teil des Winkels an der Spitze." }] })],
            steps: ["AC = BC, AM = BM und die gemeinsame Seite [CM]: SSS.", "Entsprechende Winkel sind gleich groß: ∢MCA = ∢BCM. Zusammen ergeben sie ∢ACB.", `<strong>SSS; ∢MCA = ${gamma}° : 2 = ${fmt(gamma / 2)}°</strong>`],
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
            prompt: `Das Drachenviereck ABCD hat die Symmetrieachse [AC]; die Dreiecke ABC und ADC sind nach SSS kongruent. Es ist ∢CAB = ${x}° und ∢ABC = ${y}°. Berechne ∢CDA und den Winkel ∢BCD bei C.`,
            given: [`∢CAB = ${x}°`, `∢ABC = ${y}°`, "ABC ≅ ADC"],
            fields: [
              numberField("∢CDA =", y, "°", 0, { slips: [{ value: 180 - y, hint: "∢CDA entspricht dem Winkel bei B im kongruenten Dreieck: gleich groß." }] }),
              numberField("∢BCD =", atC, "°", 0, { slips: [{ value: 180 - x - y, hint: "Das ist nur ∢BCA, die Hälfte. Der Winkel bei C besteht aus ∢BCA und dem gleich großen ∢ACD." }] }),
            ],
            steps: [
              `B ↦ D, also ∢CDA = ∢ABC = ${y}°.`,
              `Im Dreieck ABC: ∢BCA = 180° − ${x}° − ${y}° = ${180 - x - y}°. Ebenso groß ist ∢ACD.`,
              `<strong>∢CDA = ${y}°; ∢BCD = 2 · ${180 - x - y}° = ${atC}°</strong>`,
            ],
            meta: { ctx, x, y, a1: y, a2: atC },
          };
        }
        if (ctx === 1) {
          const x = rng.int(20, 60);
          const y = rng.int(20, 60);
          return {
            prompt: `Die Diagonale [AC] zerlegt das Parallelogramm ABCD in die kongruenten Dreiecke ABC und CDA (A ↦ C, B ↦ D, C ↦ A). Es ist ∢CAB = ${x}° und ∢BCA = ${y}°. Berechne den Winkel ∢ADC bei D und den Winkel ∢DAB bei A.`,
            given: [`∢CAB = ${x}°`, `∢BCA = ${y}°`, "ABC ≅ CDA"],
            fields: [
              numberField("∢ADC =", 180 - x - y, "°", 0, { slips: [{ value: x + y, hint: "∢ADC entspricht dem Winkel bei B: 180° minus die beiden anderen Winkel im Dreieck ABC." }] }),
              numberField("∢DAB =", x + y, "°", 0, { slips: [{ value: 2 * x, hint: "∢DAC entspricht ∢BCA (C ↦ A), nicht ∢CAB." }] }),
            ],
            steps: [
              `B ↦ D: ∢ADC = ∢CBA = 180° − ${x}° − ${y}° = ${180 - x - y}°.`,
              `C ↦ A und A ↦ C: ∢DAC = ∢BCA = ${y}°. Also ∢DAB = ∢DAC + ∢CAB = ${y}° + ${x}°.`,
              `<strong>∢ADC = ${180 - x - y}°; ∢DAB = ${x + y}°</strong>`,
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
          prompt: `Im gleichschenkligen Dreieck ABC mit AC = BC ist M der Mittelpunkt der Basis [AB]. Die Dreiecke AMC und BMC sind nach SSS kongruent. Der Winkel an der Spitze ist ∢ACB = ${gamma}°. Berechne ∢MCA und den Basiswinkel ∢CAM.`,
          given: [`∢ACB = ${gamma}°`, "AMC ≅ BMC"],
          fields: [
            numberField("∢MCA =", gamma / 2, "°", 0, { slips: [{ value: gamma, hint: "[CM] halbiert den Winkel an der Spitze." }] }),
            numberField("∢CAM =", (180 - gamma) / 2, "°", 0, { slips: [{ value: 180 - gamma, hint: "Das sind beide Basiswinkel zusammen; jeder ist halb so groß." }] }),
          ],
          steps: [
            `Entsprechende Winkel: ∢MCA = ∢BCM, zusammen ${gamma}°, also je ${fmt(gamma / 2)}°.`,
            `Die Basiswinkel sind gleich groß: (180° − ${gamma}°) : 2 = ${fmt((180 - gamma) / 2)}°.`,
            `<strong>∢MCA = ${fmt(gamma / 2)}°; ∢CAM = ${fmt((180 - gamma) / 2)}°</strong>`,
          ],
          meta: { ctx, gamma, a1: gamma / 2, a2: (180 - gamma) / 2 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst, welche drei Stücke ein Dreieck festlegen, und schließt daraus auf gleiche Seiten und Winkel.",
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
  lessons: [dreiecksexistenz, dreieckskonstruktion, kongruenz],
};
