import { fmt, frac, MINUS, paren, quadratic, shifted, sum, vertexForm } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  BINOMIAL_FORMULAS,
  binomialLeft,
  bracket,
  coefOf,
  completedSquare,
  equationCase,
  equationSolutionSet,
  EXTREMUM_MODELS,
  extremumSides,
  factorHtml,
  FLIPPED,
  GRUNDMENGEN,
  holds,
  inDomain,
  inequalitySet,
  inequalitySolution,
  inGrundmenge,
  integerEdge,
  intervalText,
  type Mono,
  monoHtml,
  type Poly,
  polyAdd,
  polyHtml,
  polyMul,
  polyScale,
  polySub,
  plusText,
  polyText,
  probeCounts,
  productValue,
  rectChange,
  RELATIONS,
  satisfies,
  solutionText,
  termValue,
  tileFactor,
  tileFit,
  type Var,
  varsHtml,
  varsText,
  WRONG_CLAIMS,
} from "../lab/views-terme-gleichungen";
import type { DifficultyLevel, ExerciseTask, Lesson, NumberField, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-4-terme-gleichungen";
const LP = "M8 LB 4 (I) · M8 LB 3 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

/**
 * The shared task test types 3x + 7 as its "far off" answer: at x = −3,5 that
 * equals x, and at x = −7/3 it is a rounding residue printed as 1e−16. Such
 * answers are drawn again.
 */
const awkward = (x: number) => Math.abs(x + 3.5) < 1e-9 || Math.abs(3 * x + 7) < 1e-6;

function guarded(make: (rng: Rng, level: DifficultyLevel) => ExerciseTask): (rng: Rng, level: DifficultyLevel) => ExerciseTask {
  return (rng, level) => {
    let task = make(rng, level);
    for (let i = 0; i < 20 && task.fields.some((field) => field.kind === "number" && awkward(field.answer)); i++) {
      task = make(rng, level);
    }
    return task;
  };
}

/** A whole number from ±1 to ±max. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** " + 3" or " − 3": a number after something else. */
function signed(k: number): string {
  return k < 0 ? ` ${MINUS} ${fmt(-k)}` : ` + ${fmt(k)}`;
}

/** k · x + d as a polynomial. */
const lin = (k: number, d: number): Poly => [
  { c: k, m: { x: 1 } },
  { c: d, m: {} },
];

const X2: Mono = { x: 2 };
const X1: Mono = { x: 1 };
const X0: Mono = {};

/** A whole-number field for a coefficient or an exponent. */
function intField(label: string, answer: number, slips: Array<{ value: number; hint: string }> = []) {
  return numberField(label, answer, "", 0, { slips });
}

/**
 * A whole-number field for a large exact result such as 201 · 199 = 39.999.
 * numberField() drops slips within 2 % of the answer, which would remove
 * 40.001 there; an exact answer keeps every slip that is not the answer.
 */
function exactField(label: string, answer: number, slips: Array<{ value: number; hint: string }> = [], unit = ""): NumberField {
  const kept = slips.filter((slip, i) => slip.value !== answer && slips.findIndex((other) => other.value === slip.value) === i);
  return { kind: "number", label, answer, unit, digits: 0, slips: kept };
}

/** Cents as euros the way a price is written: 750 → "7,50". */
const euro = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

/** c · x as written: "x", "1,5x". */
const cx = (c: number) => (c === 1 ? "x" : `${fmt(c)}x`);

/** Fields for the coefficients of x², x and the constant of a result. */
function quadFields(p: Poly, slips: { x2?: Array<{ value: number; hint: string }>; x1?: Array<{ value: number; hint: string }>; x0?: Array<{ value: number; hint: string }> } = {}) {
  return [
    intField("Zahl vor x<sup>2</sup>:", coefOf(p, X2), slips.x2),
    intField("Zahl vor x:", coefOf(p, X1), slips.x1),
    intField("Zahl ohne x:", coefOf(p, X0), slips.x0),
  ];
}

// 4.1 Terme mit mehreren Variablen ──────────────────────────────────────────────

/** Pairs of monomials that look alike but are not gleichartig. */
const LIKE_PAIRS: Array<[Mono, Mono]> = [
  [{ x: 2, y: 1 }, { x: 1, y: 2 }],
  [{ a: 2, b: 1 }, { a: 1, b: 2 }],
  [{ x: 3 }, { x: 2 }],
  [{ a: 2, b: 2 }, { a: 1, b: 1 }],
  [{ x: 1, y: 1 }, { x: 2 }],
  [{ a: 3, b: 1 }, { a: 1, b: 3 }],
];

/** A proper factor of a monomial with at least two variable factors: x²y → x, xy or x². */
function splitMono(rng: Rng, m: Mono): [Mono, Mono] {
  const letters: Var[] = [];
  for (const v of ["a", "b", "x", "y"] as Var[]) for (let i = 0; i < (m[v] ?? 0); i++) letters.push(v);
  const cut = rng.int(1, letters.length - 1);
  const shuffled = rng.shuffle(letters);
  const first: Mono = {};
  const second: Mono = {};
  shuffled.forEach((v, i) => {
    const target = i < cut ? first : second;
    target[v] = (target[v] ?? 0) + 1;
  });
  return [first, second];
}

const VAR_PAIRS: Array<[Var, Var]> = [
  ["a", "b"],
  ["x", "y"],
];

const mono2 = (u: Var, w: Var, e: number, f: number): Mono => ({ [u]: e, [w]: f });

const terme: Lesson = {
  id: "tg-1-terme",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Terme mit mehreren Variablen",
  subtitle: "Gleichartige Glieder zusammenfassen, Produkte mit den Potenzgesetzen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Terme vereinfachen`,
  whyItMatters:
    "Formeln für Flächen und Körper enthalten oft mehrere Variablen, etwa O = 2ab + 2ac + 2bc für die Oberfläche eines Quaders. Jede Gleichung und jede Extremwertaufgabe dieses Lernbereichs beginnt damit, einen Term richtig zu vereinfachen.",
  explanationHtml: `
    <p>Ein Term kann mehrere Variablen und höhere Potenzen enthalten, zum Beispiel 3x<sup>2</sup>y − 5xy<sup>2</sup> + 7x<sup>2</sup>y. Seine Summanden heißen <strong>Glieder</strong>, die Zahl vor den Variablen heißt <strong>Koeffizient</strong>. Zwei Glieder sind <strong>gleichartig</strong>, wenn sie dieselben Variablen mit denselben Exponenten enthalten; nur ihre Koeffizienten dürfen verschieden sein.</p>
    <table class="mini">
      <tr><th>Glieder</th><th>gleichartig?</th></tr>
      <tr><td>3x<sup>2</sup>y und −7x<sup>2</sup>y</td><td>ja, beide x<sup>2</sup>y</td></tr>
      <tr><td>4ab und −ba</td><td>ja, denn ba = ab</td></tr>
      <tr><td>3x<sup>2</sup>y und 5xy<sup>2</sup></td><td>nein: x<sup>2</sup>y ist x · x · y, xy<sup>2</sup> ist x · y · y</td></tr>
      <tr><td>x<sup>2</sup> und x</td><td>nein, verschiedene Exponenten</td></tr>
    </table>
    <p><strong>Addieren und subtrahieren:</strong> Gleichartige Glieder fasst du zusammen, indem du ihre Koeffizienten addierst; Variablen und Exponenten bleiben, wie sie sind: 3x<sup>2</sup>y + 5x<sup>2</sup>y = 8x<sup>2</sup>y. Ungleichartige Glieder bleiben stehen: 3x<sup>2</sup>y + 5xy<sup>2</sup> lässt sich nicht weiter zusammenfassen. Steht ein Minus vor einer Klammer, ändert beim Weglassen der Klammer jedes Glied darin sein Vorzeichen (Wiederholung aus M7): 5a − (2a − 3b) = 5a − 2a + 3b = 3a + 3b.</p>
    <p><strong>Multiplizieren, dividieren, potenzieren</strong> (Wiederholung aus M7, Potenzgesetze): Zahlen werden mit Zahlen verrechnet; bei gleicher Basis werden die Exponenten beim Multiplizieren addiert und beim Dividieren subtrahiert; ein Produkt wird potenziert, indem man jeden Faktor potenziert.</p>
    <ul>
      <li>3a<sup>2</sup>b · 4ab<sup>3</sup> = (3 · 4) · a<sup>2 + 1</sup> · b<sup>1 + 3</sup> = 12a<sup>3</sup>b<sup>4</sup></li>
      <li>12x<sup>5</sup>y<sup>2</sup> : (4x<sup>2</sup>y) = (12 : 4) · x<sup>5 − 2</sup> · y<sup>2 − 1</sup> = 3x<sup>3</sup>y</li>
      <li>(−2x<sup>2</sup>y)<sup>3</sup> = (−2)<sup>3</sup> · (x<sup>2</sup>)<sup>3</sup> · y<sup>3</sup> = −8x<sup>6</sup>y<sup>3</sup></li>
    </ul>
    <p>Im Ergebnis ordnest du die Variablen alphabetisch und die Glieder nach fallenden Exponenten: 4a<sup>3</sup> − 2a<sup>2</sup>b + ab<sup>2</sup>.</p>
    <div class="example"><strong>Beispiel:</strong> Vereinfache T = 2x<sup>2</sup>y − (4xy<sup>2</sup> − 3x<sup>2</sup>y) + 2x · 3xy.<br>
      1. Minusklammer auflösen: T = 2x<sup>2</sup>y − 4xy<sup>2</sup> + 3x<sup>2</sup>y + 2x · 3xy<br>
      2. Produkt berechnen: 2x · 3xy = 6x<sup>2</sup>y<br>
      3. Gleichartige Glieder zusammenfassen: x<sup>2</sup>y: 2 + 3 + 6 = 11; xy<sup>2</sup>: −4<br>
      4. Ergebnis: T = 11x<sup>2</sup>y − 4xy<sup>2</sup><br>
      Probe mit x = 2 und y = 1: Der Ausgangsterm ergibt 8 − (8 − 12) + 24 = 36, das Ergebnis 44 − 8 = 36.</div>
    <p><strong>Die Einsetzprobe</strong> (Wiederholung aus M6): Ob zwei Terme äquivalent sind, prüfst du durch Einsetzen von Zahlen. Liefert eine Einsetzung verschiedene Werte, ist die Umformung sicher falsch; ein Gegenbeispiel genügt. Gleiche Werte bei einer Einsetzung beweisen nichts: x<sup>2</sup> · x<sup>3</sup> = x<sup>6</sup> ist falsch, ergibt für x = 1 aber links und rechts 1. Setze deshalb nicht 0 oder 1 ein und wähle für verschiedene Variablen verschiedene Zahlen.</p>
    <p><strong>Typische Fehler:</strong> x<sup>2</sup> + x<sup>2</sup> = x<sup>4</sup> (richtig: 2x<sup>2</sup>), x<sup>2</sup> · x<sup>3</sup> = x<sup>6</sup> (richtig: x<sup>5</sup>), (−3a)<sup>2</sup> = −9a<sup>2</sup> (richtig: 9a<sup>2</sup>), 2x · 3x = 6x (richtig: 6x<sup>2</sup>).</p>
    <div class="merke"><strong>Merke:</strong> Addieren und subtrahieren darfst du nur gleichartige Glieder: Koeffizienten zusammenfassen, Variablen und Exponenten bleiben. Beim Multiplizieren werden die Zahlen multipliziert und die Exponenten gleicher Basen addiert.</div>
  `,
  formulas: [
    { name: "Gleichartige Glieder", html: "3x<sup>2</sup>y + 5x<sup>2</sup>y = 8x<sup>2</sup>y; 3x<sup>2</sup>y + 5xy<sup>2</sup> bleibt stehen", quantities: "gleiche Variablen mit gleichen Exponenten: Koeffizienten addieren" },
    { name: "Potenzgesetze", html: "a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>; a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup>; (a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>; (a · b)<sup>n</sup> = a<sup>n</sup> · b<sup>n</sup>", quantities: "m, n ganze Zahlen; a, b ≠ 0, wenn durch sie geteilt wird" },
    { name: "Minusklammer", html: "a − (b − c) = a − b + c", quantities: "jedes Glied in der Klammer ändert sein Vorzeichen" },
  ],
  quiz: {
    question: "Vereinfache 2x · 3x + x².",
    options: ["6x + x²", "7x⁴", "7x²"],
    correctIndex: 2,
    explanation: "2x · 3x = 2 · 3 · x · x = 6x². 6x² und x² sind gleichartig, also 6x² + x² = 7x². Beim Addieren bleibt der Exponent; 7x⁴ entsteht, wenn man ihn fälschlich mitaddiert.",
  },
  lab: {
    kind: "like-terms",
    title: "Labor: Die Einsetzprobe",
    intro:
      "Neun Umformungen, sechs davon sind falsch. Wähle Zahlen für x und y: Die Tabelle setzt sie links und rechts ein. Verschiedene Werte entlarven eine falsche Umformung, gleiche Werte beweisen nichts.",
    params: [
      { type: "range", key: "x", label: "x", unit: "", min: -3, max: 3, step: 1, value: 0 },
      { type: "range", key: "y", label: "y", unit: "", min: -3, max: 3, step: 1, value: 0 },
    ],
    readouts: [
      { key: "probe", label: "Einsetzung", compute: (v) => `x = ${fmt(v.x)}, y = ${fmt(v.y)}` },
      { key: "exposed", label: "entlarvte falsche Umformungen", emphasis: true, compute: (v) => `${probeCounts(v.x, v.y).exposed} von ${WRONG_CLAIMS}` },
      { key: "slipped", label: "falsch, aber unentdeckt", digits: 0, compute: (v) => probeCounts(v.x, v.y).slipped },
    ],
    goals: [
      {
        id: "zwei",
        text: "Zeige, dass eine bestandene Probe nichts beweist: Finde x ≠ 0 und y ≠ 0, bei denen mindestens zwei falsche Umformungen unentdeckt bleiben.",
        check: (v) => v.x !== 0 && v.y !== 0 && probeCounts(v.x, v.y).slipped >= 2,
      },
      {
        id: "eine",
        text: "Finde eine Einsetzung, bei der genau eine falsche Umformung unentdeckt bleibt. Welche ist es, und warum rutscht sie durch?",
        check: (v) => probeCounts(v.x, v.y).slipped === 1,
      },
      {
        id: "alle",
        text: "Finde eine Einsetzung, die alle sechs falschen Umformungen auf einmal entlarvt.",
        check: (v) => probeCounts(v.x, v.y).exposed === WRONG_CLAIMS,
      },
    ],
  },
  exercises: [
    {
      id: "zusammenfassen",
      make: (rng, level): ExerciseTask => {
        const pair = rng.int(0, LIKE_PAIRS.length - 1);
        const [K1, K2] = LIKE_PAIRS[pair];
        const k1 = varsHtml(K1);
        const k2 = varsHtml(K2);
        const notLike = `${varsText(K1)} und ${varsText(K2)} sind nicht gleichartig: Fasse nur Glieder mit denselben Variablen und denselben Exponenten zusammen.`;
        if (level === 1) {
          let [c1, c2, d1, d2] = [1, 1, 1, 1];
          do {
            [c1, c2, d1, d2] = [nonZero(rng, 9), nonZero(rng, 9), nonZero(rng, 9), nonZero(rng, 9)];
          } while (c1 + c2 === 0 || d1 + d2 === 0);
          const shown = rng.shuffle([
            { c: c1, m: K1 },
            { c: d1, m: K2 },
            { c: c2, m: K1 },
            { c: d2, m: K2 },
          ]);
          const r1 = c1 + c2;
          const r2 = d1 + d2;
          return {
            prompt: `Fasse die gleichartigen Glieder zusammen: T = ${polyHtml(shown, false)}. Gib die Koeffizienten vor ${k1} und vor ${k2} im Ergebnis an.`,
            given: [`T = ${polyHtml(shown, false)}`],
            formulaHint: "Nur gleichartige Glieder (gleiche Variablen mit gleichen Exponenten) zusammenfassen: Koeffizienten addieren, Variablen bleiben.",
            fields: [
              intField(`Zahl vor ${k1}:`, r1, [
                { value: r1 + r2, hint: notLike },
                { value: Math.abs(c1) + Math.abs(c2), hint: "Das Vorzeichen vor einem Glied gehört zu seinem Koeffizienten: Minus heißt subtrahieren." },
              ]),
              intField(`Zahl vor ${k2}:`, r2, [
                { value: r1 + r2, hint: notLike },
                { value: Math.abs(d1) + Math.abs(d2), hint: "Das Vorzeichen vor einem Glied gehört zu seinem Koeffizienten: Minus heißt subtrahieren." },
              ]),
            ],
            steps: [
              `Gleichartig sind ${monoHtml(c1, K1)} und ${monoHtml(c2, K1)} (beide ${k1}) sowie ${monoHtml(d1, K2)} und ${monoHtml(d2, K2)} (beide ${k2}).`,
              `${k1}: ${fmt(c1)} + ${paren(c2)} = ${fmt(r1)}; ${k2}: ${fmt(d1)} + ${paren(d2)} = ${fmt(r2)}`,
              `<strong>T = ${polyHtml([{ c: r1, m: K1 }, { c: r2, m: K2 }])}</strong>`,
            ],
            meta: { pair, c1, c2, d1, d2 },
          };
        }
        // Level 2: a Minusklammer and a product of monomials inside the sum.
        let [A, B, C, D, f1, f2, t] = [1, 1, 1, 1, 2, 2, 0];
        let r1 = 0;
        let r2 = 0;
        for (let tries = 0; tries < 50; tries++) {
          [A, B, C, D] = [nonZero(rng, 9), nonZero(rng, 9), nonZero(rng, 9), nonZero(rng, 9)];
          [f1, f2, t] = [rng.int(2, 5), rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]), rng.int(0, 1)];
          r1 = A - C + (t === 0 ? f1 * f2 : 0);
          r2 = B - D + (t === 1 ? f1 * f2 : 0);
          if (r1 !== 0 && r2 !== 0 && Math.abs(r1) !== Math.abs(r2)) break;
        }
        const Kt = t === 0 ? K1 : K2;
        const [m1, m2] = splitMono(rng, Kt);
        const E = f1 * f2;
        const inner = polyHtml([{ c: C, m: K1 }, { c: D, m: K2 }], false);
        const product = `${monoHtml(f1, m1)} · ${factorHtml(f2, m2)}`;
        const T = `${polyHtml([{ c: A, m: K1 }, { c: B, m: K2 }], false)} − (${inner}) + ${product}`;
        const flipped = polyHtml([{ c: -C, m: K1 }, { c: -D, m: K2 }], false);
        const sumLine = (a: number, c: number, e: number) => `${fmt(a)}${signed(-c)}${e !== 0 ? signed(e) : ""}`;
        const bracketSlip = { hint: "Vor der Klammer steht ein Minus: Jedes Glied in der Klammer ändert beim Auflösen sein Vorzeichen." };
        const productText = `${polyText([{ c: f1, m: m1 }], false)} · ${f2 < 0 ? `(${polyText([{ c: f2, m: m2 }], false)})` : polyText([{ c: f2, m: m2 }], false)}`;
        const productSlip = { hint: `Das Produkt ${productText} ergibt auch ein Glied mit ${varsText(Kt)}: Rechne es zuerst aus.` };
        return {
          prompt: `Vereinfache den Term so weit wie möglich und gib die Koeffizienten vor ${k1} und vor ${k2} an: T = ${T}`,
          given: [`T = ${T}`],
          fields: [
            intField(`Zahl vor ${k1}:`, r1, [
              { value: A + C + (t === 0 ? E : 0), ...bracketSlip },
              ...(t === 0 ? [{ value: A - C, ...productSlip }] : []),
              { value: r1 + r2, hint: notLike },
            ]),
            intField(`Zahl vor ${k2}:`, r2, [
              { value: B + D + (t === 1 ? E : 0), ...bracketSlip },
              ...(t === 1 ? [{ value: B - D, ...productSlip }] : []),
              { value: r1 + r2, hint: notLike },
            ]),
          ],
          steps: [
            `Minusklammer auflösen, jedes Vorzeichen in der Klammer umdrehen: − (${inner}) = ${flipped}`,
            `Produkt: ${product} = ${monoHtml(E, Kt)}`,
            `${k1}: ${sumLine(A, C, t === 0 ? E : 0)} = ${fmt(r1)}; ${k2}: ${sumLine(B, D, t === 1 ? E : 0)} = ${fmt(r2)}`,
            `<strong>T = ${polyHtml([{ c: r1, m: K1 }, { c: r2, m: K2 }])}</strong>`,
          ],
          meta: { pair, A, B, C, D, f1, f2, t, m1a: m1.a ?? 0, m1b: m1.b ?? 0, m1x: m1.x ?? 0, m1y: m1.y ?? 0, m2a: m2.a ?? 0, m2b: m2.b ?? 0, m2x: m2.x ?? 0, m2y: m2.y ?? 0 },
        };
      },
    },
    {
      id: "potenzgesetze",
      make: (rng, level): ExerciseTask => {
        const [u, w] = rng.pick(VAR_PAIRS);
        const expFields = (factor: number, eu: number, ew: number, slips: { f?: Array<{ value: number; hint: string }>; u?: Array<{ value: number; hint: string }>; w?: Array<{ value: number; hint: string }> }) => [
          intField("Zahlfaktor:", factor, slips.f),
          intField(`Exponent von ${u}:`, eu, slips.u),
          intField(`Exponent von ${w}:`, ew, slips.w),
        ];
        const addHint = `Bei gleicher Basis werden die Exponenten beim Multiplizieren addiert, nicht multipliziert: ${u}² · ${u}³ = ${u}⁵.`;
        if (level === 1) {
          if (rng.next() < 0.5) {
            const c1 = rng.int(2, 6) * rng.sign();
            const c2 = rng.int(2, 6) * (rng.next() < 0.35 ? -1 : 1);
            const [m1, m2, n1, n2] = [rng.int(1, 4), rng.int(1, 3), rng.int(0, 3), rng.int(1, 3)];
            const F1 = mono2(u, w, m1, n1);
            const F2 = mono2(u, w, m2, n2);
            const R = mono2(u, w, m1 + m2, n1 + n2);
            const shown = `${monoHtml(c1, F1)} · ${factorHtml(c2, F2)}`;
            return {
              prompt: `Vereinfache das Produkt: ${shown}`,
              given: [shown],
              formulaHint: "Zahlen multiplizieren; a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>",
              fields: expFields(c1 * c2, m1 + m2, n1 + n2, {
                f: [{ value: c1 + c2, hint: "Die Zahlen werden multipliziert, nicht addiert." }],
                u: [{ value: m1 * m2, hint: addHint }],
                w: [{ value: n1 * n2, hint: addHint }],
              }),
              steps: [
                `Zahlen: ${fmt(c1)} · ${paren(c2)} = ${fmt(c1 * c2)}`,
                `${u}: ${u}<sup>${m1}</sup> · ${u}<sup>${m2}</sup> = ${u}<sup>${m1} + ${m2}</sup> = ${u}<sup>${m1 + m2}</sup>; ${w}: ${w}<sup>${n1}</sup> · ${w}<sup>${n2}</sup> = ${w}<sup>${n1 + n2}</sup>${n1 === 0 ? ` (${w}<sup>0</sup> = 1: im ersten Faktor kommt ${w} nicht vor)` : ""}`,
                `<strong>${shown} = ${monoHtml(c1 * c2, R)}</strong>`,
              ],
              meta: { kind: 0, c1, c2, m1, m2, n1, n2 },
            };
          }
          const q = rng.int(2, 6) * rng.sign();
          const c2 = rng.int(2, 4) * (rng.next() < 0.35 ? -1 : 1);
          const c1 = q * c2;
          const [r1, e1, r2, e2] = [rng.int(1, 4), rng.int(1, 3), rng.int(0, 2), rng.int(1, 2)];
          const F1 = mono2(u, w, r1 + e1, r2 + e2);
          const F2 = mono2(u, w, e1, e2);
          const shown = `${monoHtml(c1, F1)} : (${monoHtml(c2, F2)})`;
          const subHint = (n: string) => `Beim Dividieren werden die Exponenten subtrahiert: ${n}⁵ : ${n}² = ${n}³.`;
          return {
            prompt: `Vereinfache den Quotienten: ${shown}`,
            given: [shown],
            formulaHint: "Zahlen dividieren; a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup>",
            fields: expFields(q, r1, r2, {
              f: [{ value: c1 * c2, hint: "Die Zahlen werden dividiert, nicht multipliziert." }],
              u: [
                { value: r1 + 2 * e1, hint: subHint(u) },
                ...(Number.isInteger((r1 + e1) / e1) ? [{ value: (r1 + e1) / e1, hint: subHint(u) }] : []),
              ],
              w: [{ value: r2 + 2 * e2, hint: subHint(w) }],
            }),
            steps: [
              `Zahlen: ${fmt(c1)} : ${paren(c2)} = ${fmt(q)}`,
              `${u}: ${u}<sup>${r1 + e1}</sup> : ${u}<sup>${e1}</sup> = ${u}<sup>${r1 + e1} − ${e1}</sup> = ${u}<sup>${r1}</sup>; ${w}: ${w}<sup>${r2 + e2}</sup> : ${w}<sup>${e2}</sup> = ${w}<sup>${r2}</sup>${r2 === 0 ? ` = 1, ${w} kommt im Ergebnis nicht mehr vor` : ""}`,
              `<strong>${shown} = ${monoHtml(q, mono2(u, w, r1, r2))}</strong>`,
            ],
            meta: { kind: 1, c1, c2, m1: r1 + e1, m2: e1, n1: r2 + e2, n2: e2 },
          };
        }
        // Level 2: a power of a product, several factors, or a cube with a term as edge.
        const kind = rng.int(0, 3);
        if (kind <= 1) {
          const k = rng.pick([2, 3]);
          const c1 = rng.pick(k === 2 ? [-3, -2, -1, 2, 3] : [-2, -1, 2]);
          const [m1, n1] = [rng.int(1, 3), rng.int(1, 2)];
          const c2 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const [m2, n2] = [rng.int(0, 3), rng.int(1, 3)];
          let factor = c1 ** k * c2;
          let eu = m1 * k + m2;
          let ew = n1 * k + n2;
          const base = `(${monoHtml(c1, mono2(u, w, m1, n1))})<sup>${k}</sup> · ${factorHtml(c2, mono2(u, w, m2, n2))}`;
          let shown = base;
          let division = "";
          let c3 = 1;
          let m3 = 0;
          let n3 = 0;
          if (kind === 1) {
            const divisors = [2, 3, 4, 6, 8].filter((d) => factor % d === 0);
            c3 = divisors.length ? rng.pick(divisors) : 1;
            if (c3 === 1) c3 = Math.abs(c2);
            m3 = rng.int(1, eu - 1);
            n3 = rng.int(1, ew - 1);
            division = ` : (${monoHtml(c3, mono2(u, w, m3, n3))})`;
            shown = `${base}${division}`;
            factor /= c3;
            eu -= m3;
            ew -= n3;
          }
          const powered = monoHtml(c1 ** k, mono2(u, w, m1 * k, n1 * k));
          return {
            prompt: `Vereinfache den Term so weit wie möglich und schreibe ihn als ein Produkt aus Zahl und Potenzen: T = ${shown}`,
            given: [`T = ${shown}`],
            fields: expFields(factor, eu, ew, {
              f: [
                { value: (c1 * k * c2) / c3, hint: `Die Klammer hoch ${k}: Die Zahl in der Klammer wird mit ${k} potenziert, nicht mit ${k} multipliziert.` },
                { value: (c1 * c2) / c3, hint: `Auch die Zahl in der Klammer wird potenziert: (${fmt(c1)})${k === 2 ? "²" : "³"} = ${fmt(c1 ** k)}.` },
              ],
              u: [{ value: m1 + k + m2 - m3, hint: `Potenz einer Potenz: (${u}^m)^${k} = ${u}^(m · ${k}). Die Exponenten werden multipliziert.` }],
              w: [{ value: n1 + k + n2 - n3, hint: `Potenz einer Potenz: (${w}^n)^${k} = ${w}^(n · ${k}). Die Exponenten werden multipliziert.` }],
            }),
            steps: [
              `Klammer hoch ${k}: Jeder Faktor wird potenziert: (${monoHtml(c1, mono2(u, w, m1, n1))})<sup>${k}</sup> = ${c1 < 0 ? `(${fmt(c1)})` : fmt(c1)}<sup>${k}</sup> · ${u}<sup>${m1} · ${k}</sup> · ${w}<sup>${n1} · ${k}</sup> = ${powered}`,
              `Malnehmen: ${powered} · ${factorHtml(c2, mono2(u, w, m2, n2))} = ${monoHtml(c1 ** k * c2, mono2(u, w, m1 * k + m2, n1 * k + n2))}`,
              ...(kind === 1 ? [`Teilen: ${monoHtml(c1 ** k * c2, mono2(u, w, m1 * k + m2, n1 * k + n2))}${division} = ${monoHtml(factor, mono2(u, w, eu, ew))}`] : []),
              `<strong>T = ${monoHtml(factor, mono2(u, w, eu, ew))}</strong>`,
            ],
            meta: { kind: 2 + kind, k, c1, m1, n1, c2, m2, n2, c3, m3, n3 },
          };
        }
        // A cube whose edge is a monomial: surface 6 · k² or volume k³.
        const c = rng.int(2, 5);
        const [m, n] = [rng.int(1, 3), rng.int(1, 2)];
        const edge = monoHtml(c, mono2(u, w, m, n));
        const volume = kind === 2;
        const factor = volume ? c ** 3 : 6 * c * c;
        const [eu, ew] = volume ? [3 * m, 3 * n] : [2 * m, 2 * n];
        return {
          prompt: `Ein Würfel hat die Kantenlänge k = ${edge} (in cm). Berechne ${volume ? "sein Volumen V = k<sup>3</sup> und schreibe es" : "seinen Oberflächeninhalt O = 6 · k<sup>2</sup> und schreibe ihn"} als ein Produkt aus Zahl und Potenzen.`,
          given: [`k = ${edge}`],
          fields: expFields(factor, eu, ew, {
            f: volume
              ? [
                  { value: 3 * c, hint: `k³ heißt k · k · k: Die Zahl ${c} wird hoch 3 genommen, nicht mal 3.` },
                  { value: c, hint: `Auch die Zahl in der Kante wird potenziert: ${c}³ = ${c ** 3}.` },
                ]
              : [
                  { value: 36 * c * c, hint: "Nur die Kante wird quadriert, die 6 nicht: O = 6 · k²." },
                  { value: 12 * c, hint: `k² heißt k · k: Die Zahl ${c} wird quadriert, nicht verdoppelt.` },
                  { value: 6 * c, hint: `Auch die Zahl in der Kante wird quadriert: ${c}² = ${c * c}.` },
                ],
            u: [{ value: m + (volume ? 3 : 2), hint: "Potenz einer Potenz: Die Exponenten werden multipliziert, nicht addiert." }],
            w: [{ value: n + (volume ? 3 : 2), hint: "Potenz einer Potenz: Die Exponenten werden multipliziert, nicht addiert." }],
          }),
          steps: volume
            ? [`V = k<sup>3</sup> = (${edge})<sup>3</sup> = ${c}<sup>3</sup> · ${u}<sup>${m} · 3</sup> · ${w}<sup>${n} · 3</sup>`, `<strong>V = ${monoHtml(factor, mono2(u, w, eu, ew))}</strong> (in cm³)`]
            : [`k<sup>2</sup> = (${edge})<sup>2</sup> = ${monoHtml(c * c, mono2(u, w, 2 * m, 2 * n))}`, `O = 6 · ${monoHtml(c * c, mono2(u, w, 2 * m, 2 * n))}`, `<strong>O = ${monoHtml(factor, mono2(u, w, eu, ew))}</strong> (in cm²)`],
          meta: { kind: volume ? 4 : 5, c, m, n },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst gleichartige Glieder und rechnest mit Produkten von Potenzen sicher.",
};

// 4.2 Summenterme multiplizieren ──────────────────────────────────────────────

/** "(2x − 3)": a bracket k · x + d. */
const linHtml = (k: number, d: number) => `(${polyHtml(lin(k, d), false)})`;

const ausmultiplizieren: Lesson = {
  id: "tg-2-ausmultiplizieren",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 Summenterme multiplizieren",
  subtitle: "Jedes Glied mit jedem",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Summenterme multiplizieren`,
  whyItMatters:
    "Wird ein Rechteck in beiden Richtungen verändert, ist sein neuer Flächeninhalt ein Produkt zweier Summen. Ausmultiplizieren brauchst du für die binomischen Formeln, für Extremwerte und für jede Gleichung mit Klammern.",
  explanationHtml: `
    <p><strong>Summe mal Faktor</strong> (Wiederholung aus M7): Nach dem Distributivgesetz wird jedes Glied der Klammer mit dem Faktor multipliziert, zum Beispiel 3x · (2x − 5) = 6x<sup>2</sup> − 15x und −2a · (a + 3b) = −2a<sup>2</sup> − 6ab.</p>
    <p><strong>Summe mal Summe:</strong> Jedes Glied der ersten Klammer wird mit jedem Glied der zweiten Klammer multipliziert, danach fasst du gleichartige Glieder zusammen:</p>
    <p>(a + b) · (c + d) = ac + ad + bc + bd</p>
    <p>Hat die erste Klammer m Glieder und die zweite n Glieder, entstehen m · n Teilprodukte, bei (x + 2)(x<sup>2</sup> − x + 4) also 2 · 3 = 6. Zähle sie nach, dann vergisst du keines.</p>
    <p><strong>Rechteckmodell:</strong> Für positive Werte ist (x + 3)(x + 2) der Flächeninhalt eines Rechtecks mit den Seiten x + 3 und x + 2. Es zerfällt in vier Teilrechtecke: x · x = x<sup>2</sup>, 3 · x = 3x, x · 2 = 2x und 3 · 2 = 6, zusammen x<sup>2</sup> + 5x + 6.</p>
    <div class="example"><strong>Beispiel:</strong> (2x − 3)(x + 4)<br>
      = 2x · x + 2x · 4 + (−3) · x + (−3) · 4<br>
      = 2x<sup>2</sup> + 8x − 3x − 12<br>
      = 2x<sup>2</sup> + 5x − 12<br>
      Probe mit x = 1: (2 − 3) · (1 + 4) = −5 und 2 + 5 − 12 = −5.</div>
    <p><strong>Drei Faktoren:</strong> Multipliziere zuerst zwei Faktoren aus, dann das Ergebnis mit dem dritten: 2x(x + 1)(x − 3) = 2x(x<sup>2</sup> − 2x − 3) = 2x<sup>3</sup> − 4x<sup>2</sup> − 6x.</p>
    <p><strong>Minus vor einem Produkt:</strong> Erst ausmultiplizieren und das Ergebnis in Klammern lassen, dann die Klammer mit dem Minus auflösen: −(x + 2)(x − 3) = −(x<sup>2</sup> − x − 6) = −x<sup>2</sup> + x + 6.</p>
    <p><strong>Typische Fehler:</strong> ein Teilprodukt vergessen, besonders (x + 2)(x + 3) = x<sup>2</sup> + 6, wo 3x und 2x fehlen; Vorzeichenfehler bei negativen Gliedern, etwa (−3) · (−4) = +12; beim Minus vor dem Produkt nur das erste Glied umdrehen.</p>
    <div class="merke"><strong>Merke:</strong> Jedes Glied mit jedem: Aus m und n Gliedern werden m · n Teilprodukte, dann werden gleichartige Glieder zusammengefasst. Steht ein Minus vor dem Produkt, bleibt das Ergebnis zuerst in Klammern.</div>
  `,
  formulas: [
    { name: "Distributivgesetz", html: "a · (b + c) = ab + ac", quantities: "jedes Glied der Klammer mit dem Faktor multiplizieren" },
    { name: "Summe mal Summe", html: "(a + b) · (c + d) = ac + ad + bc + bd", quantities: "m Glieder mal n Glieder ergeben m · n Teilprodukte" },
    { name: "Minus vor einem Produkt", html: "−(a + b)(c + d) = −(ac + ad + bc + bd)", quantities: "erst ausmultiplizieren, dann die Klammer auflösen" },
  ],
  quiz: {
    question: "Was ergibt (x + 2)(x + 3)?",
    options: ["x² + 6", "x² + 5x + 6", "x² + 6x + 5", "2x + 5"],
    correctIndex: 1,
    explanation: "Jedes Glied mit jedem: x · x + x · 3 + 2 · x + 2 · 3 = x² + 3x + 2x + 6 = x² + 5x + 6. Bei x² + 6 fehlen die beiden Teilprodukte 3x und 2x.",
  },
  lab: {
    kind: "expand-products",
    title: "Labor: Das Rechteckmodell",
    intro:
      "Das Rechteck hat die Seiten x + p und x + q. Ziehe die Ecke des Quadrats (x), den rechten Rand (p) oder den unteren Rand (q). Die Teilflächen sind die Teilprodukte; die Tabelle multipliziert jedes Glied mit jedem. Bei negativem q wird unten ein Streifen abgeschnitten.",
    params: [
      { type: "range", key: "x", label: "x", unit: "", min: 1, max: 7, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "p", label: "p in x + p", unit: "", min: 1, max: 5, step: 1, value: 3 },
      { type: "range", key: "q", label: "q in x + q", unit: "", min: -4, max: 5, step: 1, value: 2 },
    ],
    readouts: [
      { key: "term", label: "Produkt", compute: (v) => `${bracket("x", v.p)}${bracket("x", v.q)}` },
      { key: "expanded", label: "ausmultipliziert", emphasis: true, compute: (v) => quadratic(1, v.p + v.q, v.p * v.q) },
      { key: "value", label: "Wert des Produkts", digits: 2, compute: (v) => productValue(v) },
      { key: "missing", label: "fehlt bei x² + pq", digits: 2, compute: (v) => (v.p + v.q) * v.x },
    ],
    goals: [
      {
        id: "fehler",
        text: "Viele rechnen (x + p)(x + q) = x² + pq. Stelle ein Rechteck mit q ≠ 0 ein, bei dem dieser Fehler genau 24 FE ausmacht.",
        check: (v) => v.x + v.q > 0 && v.q !== 0 && Math.abs((v.p + v.q) * v.x - 24) < 1e-9,
      },
      {
        id: "ohne-x",
        text: "Finde ein Rechteck, bei dem im Ergebnis kein x-Glied vorkommt. Was geschieht mit den beiden Streifen?",
        check: (v) => v.x + v.q > 0 && v.p + v.q === 0,
      },
      {
        id: "quadrat",
        text: "Finde ein Rechteck mit q ≠ 0, das genau denselben Flächeninhalt hat wie das Quadrat x².",
        check: (v) => v.x + v.q > 0 && v.q !== 0 && Math.abs(productValue(v) - v.x * v.x) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "ausmultiplizieren",
      make: (rng, level): ExerciseTask => {
        const forgot = { hint: "Ein Teilprodukt fehlt: Jedes Glied der ersten Klammer wird mit jedem Glied der zweiten multipliziert." };
        const signs = { hint: "Prüfe die Vorzeichen der Teilprodukte: Minus mal Minus ergibt Plus, Minus mal Plus ergibt Minus." };
        if (level === 1) {
          const [a, c] = [rng.int(1, 3), rng.int(1, 3)];
          const [b, d] = [nonZero(rng, 9), nonZero(rng, 9)];
          const result = polyMul(lin(a, b), lin(c, d));
          const shown = `${linHtml(a, b)}${linHtml(c, d)}`;
          const term = (k: number, m: Mono) => monoHtml(k, m);
          return {
            prompt: `Multipliziere aus und fasse zusammen: ${shown}. Gib das Ergebnis in der Form □x<sup>2</sup> + □x + □ an.`,
            given: [shown],
            formulaHint: "(a + b)(c + d) = ac + ad + bc + bd: jedes Glied mit jedem multiplizieren",
            fields: quadFields(result, {
              x1: [
                { value: 0, hint: "Es fehlen Teilprodukte: Aus zwei mal zwei Gliedern entstehen vier Teilprodukte, zwei davon mit x." },
                { value: a * d, ...forgot },
                { value: b * c, ...forgot },
                { value: a * d - b * c, ...signs },
              ],
              x0: [
                { value: b + d, hint: "Die beiden Zahlen werden multipliziert, nicht addiert." },
                { value: -b * d, ...signs },
              ],
              x2: [{ value: a + c, hint: "x · x = x²; die Zahlen davor werden multipliziert." }],
            }),
            steps: [
              `Vier Teilprodukte: ${term(a, X1)} · ${term(c, X1)} = ${term(a * c, X2)}; ${term(a, X1)} · ${paren(d)} = ${term(a * d, X1)}; ${fmt(b)} · ${term(c, X1)} = ${term(b * c, X1)}; ${fmt(b)} · ${paren(d)} = ${fmt(b * d)}`,
              `${shown} = ${polyHtml([{ c: a * c, m: X2 }, { c: a * d, m: X1 }, { c: b * c, m: X1 }, { c: b * d, m: X0 }], false)}`,
              `<strong>${shown} = ${polyHtml(result)}</strong>`,
            ],
            meta: { kind: 0, a, b, c, d },
          };
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          // (a x + b)(x² + c x + d): six partial products, a cubic result.
          const a = rng.int(1, 3);
          const [b, c, d] = [nonZero(rng, 5), nonZero(rng, 5), nonZero(rng, 6)];
          const tri: Poly = [{ c: 1, m: X2 }, { c, m: X1 }, { c: d, m: X0 }];
          const result = polyMul(lin(a, b), tri);
          const shown = `${linHtml(a, b)}(${polyHtml(tri, false)})`;
          const partial = polyHtml(
            [
              { c: a, m: { x: 3 } },
              { c: a * c, m: X2 },
              { c: a * d, m: X1 },
              { c: b, m: X2 },
              { c: b * c, m: X1 },
              { c: b * d, m: X0 },
            ],
            false,
          );
          return {
            prompt: `Multipliziere aus und fasse zusammen. Wie viele Teilprodukte entstehen dabei? Schreibe das Ergebnis in der Form □x<sup>3</sup> + □x<sup>2</sup> + □x + □: ${shown}`,
            given: [shown],
            fields: [
              intField("Anzahl der Teilprodukte:", 6, [{ value: 5, hint: "2 Glieder mal 3 Glieder: 2 · 3 = 6 Teilprodukte." }, { value: 4, hint: "2 Glieder mal 3 Glieder: 2 · 3 = 6 Teilprodukte." }]),
              intField("Zahl vor x<sup>3</sup>:", coefOf(result, { x: 3 })),
              intField("Zahl vor x<sup>2</sup>:", coefOf(result, X2), [{ value: a * c, ...forgot }, { value: b, ...forgot }]),
              intField("Zahl vor x:", coefOf(result, X1), [{ value: a * d, ...forgot }, { value: b * c, ...forgot }]),
              intField("Zahl ohne x:", b * d, [{ value: -b * d, ...signs }]),
            ],
            steps: [
              `2 · 3 = 6 Teilprodukte: ${shown} = ${partial}`,
              `Gleichartige Glieder: x<sup>2</sup>: ${fmt(a * c)}${signed(b)} = ${fmt(a * c + b)}; x: ${fmt(a * d)}${signed(b * c)} = ${fmt(a * d + b * c)}`,
              `<strong>${shown} = ${polyHtml(result)}</strong>`,
            ],
            meta: { kind: 1, a, b, c, d },
          };
        }
        if (kind === 1) {
          // (a x + b y)(c x + d y): two variables.
          const [a, c] = [rng.int(1, 4), rng.int(1, 4)];
          const [b, d] = [nonZero(rng, 5), nonZero(rng, 5)];
          const P: Poly = [{ c: a, m: { x: 1 } }, { c: b, m: { y: 1 } }];
          const Q: Poly = [{ c, m: { x: 1 } }, { c: d, m: { y: 1 } }];
          const result = polyMul(P, Q);
          const shown = `(${polyHtml(P, false)})(${polyHtml(Q, false)})`;
          return {
            prompt: `Multipliziere aus und fasse zusammen: ${shown}. Gib das Ergebnis in der Form □x<sup>2</sup> + □xy + □y<sup>2</sup> an.`,
            given: [shown],
            fields: [
              intField("Zahl vor x<sup>2</sup>:", a * c),
              intField("Zahl vor xy:", a * d + b * c, [{ value: a * d, ...forgot }, { value: b * c, ...forgot }, { value: 0, hint: "xy und yx sind gleichartig: Die beiden gemischten Teilprodukte werden zusammengefasst." }]),
              intField("Zahl vor y<sup>2</sup>:", b * d, [{ value: -b * d, ...signs }]),
            ],
            steps: [
              `Vier Teilprodukte: ${shown} = ${polyHtml([{ c: a * c, m: X2 }, { c: a * d, m: { x: 1, y: 1 } }, { c: b * c, m: { x: 1, y: 1 } }, { c: b * d, m: { y: 2 } }], false)}`,
              `xy und yx sind gleichartig: ${fmt(a * d)}${signed(b * c)} = ${fmt(a * d + b * c)}`,
              `<strong>${shown} = ${polyHtml(result)}</strong>`,
            ],
            meta: { kind: 2, a, b, c, d },
          };
        }
        // (x + p)(x + q) − (r x + s)(x + t): a minus before the second product.
        const [p, q] = [nonZero(rng, 6), nonZero(rng, 6)];
        const r = rng.int(1, 2);
        const [s, t] = [nonZero(rng, 5), nonZero(rng, 5)];
        const first = polyMul(lin(1, p), lin(1, q));
        const second = polyMul(lin(r, s), lin(1, t));
        const result = polySub(first, second);
        const shown = `${linHtml(1, p)}${linHtml(1, q)} − ${linHtml(r, s)}${linHtml(1, t)}`;
        const half = polyAdd(first, polyScale([second[0]], -1), second.slice(1));
        return {
          prompt: `Vereinfache den Term T so weit wie möglich und gib ihn in der Form □x<sup>2</sup> + □x + □ an: T = ${shown}`,
          given: [`T = ${shown}`],
          fields: quadFields(result, {
            x2: [{ value: 1 + r, hint: "Das Minus gilt auch für das x²-Glied des zweiten Produkts." }],
            x1: [{ value: coefOf(half, X1), hint: "Das Minus gilt für das ganze zweite Produkt: erst ausmultiplizieren, Ergebnis in Klammern, dann jedes Vorzeichen umdrehen." }],
            x0: [{ value: coefOf(half, X0), hint: "Das Minus gilt für das ganze zweite Produkt: erst ausmultiplizieren, Ergebnis in Klammern, dann jedes Vorzeichen umdrehen." }],
          }),
          steps: [
            `Erstes Produkt: ${linHtml(1, p)}${linHtml(1, q)} = ${polyHtml(first)}`,
            `Zweites Produkt in Klammern: ${linHtml(r, s)}${linHtml(1, t)} = ${polyHtml(second)}`,
            `Minus vor der Klammer, jedes Vorzeichen umdrehen: T = ${polyHtml(first)} − (${polyHtml(second)}) = ${polyHtml([...first, ...polyScale(second, -1)], false)}`,
            `<strong>T = ${polyHtml(result)}</strong>`,
          ],
          meta: { kind: 3, p, q, r, s, t },
        };
      },
    },
    {
      id: "flaeche",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          // two different sides: (2x + 5)(2x + 5) would be a square
          let [a, b, c, d] = [1, 1, 1, 1];
          do {
            [a, c] = [rng.int(1, 3), rng.int(1, 3)];
            [b, d] = [rng.int(1, 9), rng.int(1, 9)];
          } while (a === c && b === d);
          const k = rng.int(1, 6);
          const result = polyMul(lin(a, b), lin(c, d));
          const A = (a * k + b) * (c * k + d);
          return {
            prompt: `Ein Rechteck hat die Seitenlängen ${linHtml(a, b)} cm und ${linHtml(c, d)} cm. Stelle einen Term für seinen Flächeninhalt A auf, multipliziere aus und berechne A für x = ${k}.`,
            given: [`Seiten ${linHtml(a, b)} cm und ${linHtml(c, d)} cm`, `x = ${k}`],
            formulaHint: "A = Länge · Breite; (a + b)(c + d) = ac + ad + bc + bd",
            fields: [
              ...quadFields(result, { x1: [{ value: 0, hint: "Es fehlen die Teilprodukte mit x: Jedes Glied mit jedem multiplizieren." }, { value: a * d, hint: "Ein Teilprodukt fehlt." }, { value: b * c, hint: "Ein Teilprodukt fehlt." }] }),
              numberField(`A für x = ${k}:`, A, "cm²", 0, { slips: [{ value: a * c * k * k + b * d, hint: "Mit dem Term ohne die Teilprodukte mit x kommt zu wenig heraus." }] }),
            ],
            steps: [
              `A = ${linHtml(a, b)} · ${linHtml(c, d)} = ${polyHtml([{ c: a * c, m: X2 }, { c: a * d, m: X1 }, { c: b * c, m: X1 }, { c: b * d, m: X0 }], false)} = ${polyHtml(result)}`,
              `x = ${k}: A = ${fmt(a * c)} · ${k}<sup>2</sup> + ${fmt(a * d + b * c)} · ${k} + ${fmt(b * d)} = ${fmt(A)}; Kontrolle: ${fmt(a * k + b)} cm · ${fmt(c * k + d)} cm = ${fmt(A)} cm²`,
              `<strong>A = ${polyHtml(result)} (in cm²), für x = ${k}: A = ${fmt(A)} cm²</strong>`,
            ],
            meta: { kind: 0, a, b, c, d, k },
          };
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          // Both sides grow: length by x, width by m · x.
          const L = rng.int(6, 15);
          const B = rng.int(3, L - 1);
          const m = rng.int(1, 3);
          const k = rng.int(1, 5);
          const delta = m * k * k + (m * L + B) * k;
          const widthGrow = m === 1 ? "x cm" : `${m}x cm`;
          return {
            prompt: `Ein Rechteck ist ${L} cm lang und ${B} cm breit. Seine Länge wird um x cm verlängert, seine Breite um ${widthGrow}. Um wie viel nimmt der Flächeninhalt zu? Gib die Zunahme als Term in der Form □x<sup>2</sup> + □x an und berechne sie für x = ${k}.`,
            given: [`Länge ${L} cm, Breite ${B} cm`, `neue Länge (${L} + x) cm, neue Breite (${B} + ${m === 1 ? "x" : `${m}x`}) cm`],
            fields: [
              intField("Zahl vor x<sup>2</sup>:", m),
              intField("Zahl vor x:", m * L + B, [{ value: L + B, hint: "Die Breite wächst um mehr als x: Multipliziere die Länge mit dem ganzen Zuwachs der Breite." }, { value: m * L, hint: "Ein Teilprodukt fehlt: Auch die alte Breite wird mit dem Zuwachs der Länge multipliziert." }]),
              numberField(`Zunahme für x = ${k}:`, delta, "cm²", 0, { slips: [{ value: (L + k) * (B + m * k), hint: "Das ist der neue Flächeninhalt. Gesucht ist die Zunahme: neuer minus alter Flächeninhalt." }] }),
            ],
            steps: [
              `Neuer Flächeninhalt: (${L} + x)(${B} + ${m === 1 ? "x" : `${m}x`}) = ${polyHtml(polyMul(lin(1, L), lin(m, B)))}`,
              `Zunahme: ${polyHtml(polyMul(lin(1, L), lin(m, B)))} − ${L * B} = ${polyHtml([{ c: m, m: X2 }, { c: m * L + B, m: X1 }])}`,
              `<strong>Zunahme ${polyHtml([{ c: m, m: X2 }, { c: m * L + B, m: X1 }])} (in cm²); für x = ${k}: ${fmt(delta)} cm²</strong>`,
            ],
            meta: { kind: 1, L, B, m, k },
          };
        }
        if (kind === 1) {
          // Length plus x, width minus x: the area changes by −x² + (B − L)x.
          const L = rng.int(8, 16);
          const B = rng.int(4, L - 2);
          const k = rng.int(1, B - 1);
          const change = -k * k + (B - L) * k;
          return {
            prompt: `Ein Rechteck ist ${L} cm lang und ${B} cm breit. Die Länge wird um x cm verlängert, die Breite um x cm verkürzt. Wie ändert sich der Flächeninhalt? Gib die Änderung (neu minus alt) als Term in der Form □x<sup>2</sup> + □x an und berechne sie für x = ${k}.`,
            given: [`Länge ${L} cm, Breite ${B} cm`, `neue Seiten (${L} + x) cm und (${B} − x) cm`],
            fields: [
              intField("Zahl vor x<sup>2</sup>:", -1, [{ value: 1, hint: "x · (−x) = −x²." }]),
              intField("Zahl vor x:", B - L, [{ value: L - B, hint: "Teilprodukte mit x: x · " + B + " und " + L + " · (−x). Achte auf das Vorzeichen." }, { value: B + L, hint: "Die Länge wird mit −x multipliziert: " + L + " · (−x) = −" + L + "x." }]),
              numberField(`Änderung für x = ${k}:`, change, "cm²", 0, { slips: [{ value: (L + k) * (B - k), hint: "Das ist der neue Flächeninhalt. Gesucht ist die Änderung: neu minus alt." }] }),
            ],
            steps: [
              `Neuer Flächeninhalt: (${L} + x)(${B} − x) = ${B * L} − ${L}x + ${B}x − x<sup>2</sup> = ${polyHtml(polyMul(lin(1, L), lin(-1, B)))}`,
              `Änderung: ${polyHtml(polyMul(lin(1, L), lin(-1, B)))} − ${L * B} = ${polyHtml([{ c: -1, m: X2 }, { c: B - L, m: X1 }])}`,
              `<strong>Änderung ${polyHtml([{ c: -1, m: X2 }, { c: B - L, m: X1 }])} (in cm²); für x = ${k}: ${fmt(change)} cm², der Flächeninhalt nimmt also um ${fmt(-change)} cm² ab.</strong>`,
            ],
            meta: { kind: 2, L, B, k },
          };
        }
        // A square whose sides grow by x.
        const s = rng.int(4, 15);
        const k = rng.int(1, 5);
        const delta = k * k + 2 * s * k;
        return {
          prompt: `Jede Seite eines Quadrats mit ${s} cm Seitenlänge wird um x cm verlängert. Um wie viel nimmt der Flächeninhalt zu? Gib die Zunahme als Term in der Form □x<sup>2</sup> + □x an und berechne sie für x = ${k}.`,
          given: [`Seitenlänge ${s} cm`, `neue Seitenlänge (${s} + x) cm`],
          fields: [
            intField("Zahl vor x<sup>2</sup>:", 1),
            intField("Zahl vor x:", 2 * s, [{ value: s, hint: `Zwei Streifen kommen dazu: x · ${s} und ${s} · x, zusammen ${2 * s}x.` }]),
            numberField(`Zunahme für x = ${k}:`, delta, "cm²", 0, { slips: [{ value: k * k, hint: "Nicht nur das kleine Eckquadrat kommt dazu, sondern auch die beiden Streifen." }, { value: (s + k) ** 2, hint: "Das ist der neue Flächeninhalt. Gesucht ist die Zunahme." }] }),
          ],
          steps: [
            `Neuer Flächeninhalt: (${s} + x)(${s} + x) = ${s * s} + ${s}x + ${s}x + x<sup>2</sup> = ${polyHtml(polyMul(lin(1, s), lin(1, s)))}`,
            `Zunahme: ${polyHtml(polyMul(lin(1, s), lin(1, s)))} − ${s * s} = ${polyHtml([{ c: 1, m: X2 }, { c: 2 * s, m: X1 }])}`,
            `<strong>Zunahme x<sup>2</sup> + ${2 * s}x (in cm²); für x = ${k}: ${fmt(delta)} cm²</strong>`,
          ],
          meta: { kind: 3, s, k },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Jedes Glied mit jedem: Du multiplizierst Summen aus, ohne ein Teilprodukt zu verlieren.",
};

// 4.3 Die binomischen Formeln ─────────────────────────────────────────────────

/** p · x as written: "x", "3x". */
const px = (p: number, v = "x") => (p === 1 ? v : `${p}${v}`);

const binomischeFormeln: Lesson = {
  id: "tg-3-binomische-formeln",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Die binomischen Formeln",
  subtitle: "Drei Produkte, die man auswendig kennt",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Binomische Formeln`,
  whyItMatters:
    "Die binomischen Formeln sparen Rechenarbeit beim Ausmultiplizieren und beim Kopfrechnen (49² = 2401). Rückwärts gelesen sind sie das wichtigste Werkzeug zum Faktorisieren und für die quadratische Ergänzung.",
  explanationHtml: `
    <p>Drei Produkte kommen so oft vor, dass man ihr Ergebnis auswendig kennt. Sie heißen <strong>binomische Formeln</strong>; ein Binom ist eine Summe oder Differenz aus zwei Gliedern.</p>
    <table class="mini">
      <tr><th></th><th>Formel</th><th>Beispiel</th></tr>
      <tr><td>1. (Plus-Formel)</td><td>(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup></td><td>(x + 5)<sup>2</sup> = x<sup>2</sup> + 10x + 25</td></tr>
      <tr><td>2. (Minus-Formel)</td><td>(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup></td><td>(x − 3)<sup>2</sup> = x<sup>2</sup> − 6x + 9</td></tr>
      <tr><td>3. (Plus-Minus-Formel)</td><td>(a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup></td><td>(x + 4)(x − 4) = x<sup>2</sup> − 16</td></tr>
    </table>
    <p><strong>Herleitung:</strong> Multipliziere aus: (a + b)<sup>2</sup> = (a + b)(a + b) = a<sup>2</sup> + ab + ba + b<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>. Am Quadrat mit der Seite a + b siehst du die vier Teile: das Quadrat a<sup>2</sup>, zwei Rechtecke ab und das Quadrat b<sup>2</sup>. Für (a − b)<sup>2</sup> schneidest du vom Quadrat a<sup>2</sup> zwei Streifen ab mit je dem Inhalt ab; die Ecke b<sup>2</sup> wird dabei doppelt abgeschnitten und kommt einmal zurück: a<sup>2</sup> − 2ab + b<sup>2</sup>. Bei (a + b)(a − b) heben sich die gemischten Glieder auf: a<sup>2</sup> − ab + ab − b<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup>.</p>
    <p><strong>Warum (a + b)<sup>2</sup> ≠ a<sup>2</sup> + b<sup>2</sup>:</strong> Es fehlt das <strong>Mischglied</strong> 2ab. Probe mit a = 3 und b = 4: (3 + 4)<sup>2</sup> = 49, aber 3<sup>2</sup> + 4<sup>2</sup> = 25.</p>
    <p><strong>Mit Koeffizienten und zwei Variablen:</strong> a und b dürfen selbst Terme sein. Quadriere sie ganz, mit ihrer Zahl.</p>
    <div class="example"><strong>Beispiel:</strong> (3x − 4y)<sup>2</sup> mit a = 3x und b = 4y:<br>
      a<sup>2</sup> = (3x)<sup>2</sup> = 9x<sup>2</sup>; 2ab = 2 · 3x · 4y = 24xy; b<sup>2</sup> = (4y)<sup>2</sup> = 16y<sup>2</sup><br>
      (3x − 4y)<sup>2</sup> = 9x<sup>2</sup> − 24xy + 16y<sup>2</sup></div>
    <p>Eine Zahl und ihre Gegenzahl haben dasselbe Quadrat: (−c)<sup>2</sup> = c<sup>2</sup>. Weil −a − b = −(a + b) ist, gilt (−a − b)<sup>2</sup> = (a + b)<sup>2</sup>; ebenso ist (−a + b)<sup>2</sup> = (a − b)<sup>2</sup>, denn −a + b = −(a − b).</p>
    <p><strong>Geschickt rechnen:</strong> 49<sup>2</sup> = (50 − 1)<sup>2</sup> = 2500 − 100 + 1 = 2401 und 21 · 19 = (20 + 1)(20 − 1) = 400 − 1 = 399. <strong>Lücken füllen:</strong> Bei (x + □)<sup>2</sup> = x<sup>2</sup> + 10x + □ ist 10x das Mischglied 2 · x · □, also gehört 5 in die erste Lücke und 5<sup>2</sup> = 25 in die zweite.</p>
    <p><strong>Typische Fehler:</strong> (x + 3)<sup>2</sup> = x<sup>2</sup> + 9 (Mischglied vergessen), (3x)<sup>2</sup> = 3x<sup>2</sup> (die Zahl nicht quadriert), (x − 4)<sup>2</sup> = x<sup>2</sup> − 8x − 16 (b<sup>2</sup> ist immer positiv), ab statt 2ab.</p>
    <div class="merke"><strong>Merke:</strong> (a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>, (a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>, (a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>. Beim Quadrieren eines Binoms nie das Mischglied 2ab vergessen.</div>
  `,
  formulas: [
    { name: "1. binomische Formel", html: "(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>", quantities: "2ab heißt Mischglied" },
    { name: "2. binomische Formel", html: "(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>", quantities: "b² ist immer positiv" },
    { name: "3. binomische Formel", html: "(a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>", quantities: "die gemischten Glieder heben sich auf" },
  ],
  quiz: {
    question: "Welcher Term ist gleich (3x − 4)²?",
    options: ["9x² − 16", "3x² − 24x + 16", "9x² − 24x + 16", "9x² − 12x + 16"],
    correctIndex: 2,
    explanation: "2. binomische Formel mit a = 3x und b = 4: a² = 9x², 2ab = 2 · 3x · 4 = 24x, b² = 16. 9x² − 16 vergisst das Mischglied, 12x vergisst die 2, und bei 3x² ist die 3 nicht quadriert.",
  },
  lab: {
    kind: "binomial-squares",
    title: "Labor: Formeln am Quadrat",
    intro:
      "Wähle die Formel und ziehe die Ecken. Das Quadrat mit der Seite a + b zerfällt in a², zwei Rechtecke ab und b². Bei (a − b)² werden zwei Streifen abgeschnitten, bei (a + b)(a − b) wird ein Streifen umgelegt.",
    params: [
      {
        type: "choice",
        key: "mode",
        label: "Formel",
        options: [
          { value: 0, label: "1. Formel: (a + b)²" },
          { value: 1, label: "2. Formel: (a − b)²" },
          { value: 2, label: "3. Formel: (a + b)(a − b)" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "a", unit: "", min: 1, max: 6, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "b", label: "b", unit: "", min: 0.5, max: 4, step: 0.5, value: 1.5, digits: 1 },
    ],
    readouts: [
      { key: "formula", label: "Formel", compute: (v) => BINOMIAL_FORMULAS[v.mode] },
      { key: "left", label: "Wert der linken Seite", digits: 2, emphasis: true, compute: (v) => binomialLeft(v) },
      { key: "mixed", label: "Mischglied 2ab", digits: 2, compute: (v) => 2 * v.a * v.b },
      { key: "squares", label: "a² + b²", digits: 2, compute: (v) => v.a * v.a + v.b * v.b },
    ],
    goals: [
      {
        id: "fehler",
        text: "Viele rechnen (a + b)² = a² + b². Finde a und b, bei denen dieser Fehler genau 18 FE ausmacht.",
        check: (v) => v.mode === 0 && Math.abs(2 * v.a * v.b - 18) < 1e-9,
      },
      {
        id: "doppelt",
        text: "Finde a und b mit (a + b)² = 2 · (a² + b²). Was gilt dann für a und b?",
        check: (v) => v.mode === 0 && Math.abs((v.a + v.b) ** 2 - 2 * (v.a * v.a + v.b * v.b)) < 1e-9,
      },
      {
        id: "dritte",
        text: "Wähle die 3. Formel: Finde a und b, bei denen das neue Rechteck mit den Seiten a + b und a − b genau 24 FE groß ist.",
        check: (v) => v.mode === 2 && v.a > v.b && Math.abs(v.a * v.a - v.b * v.b - 24) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "binom",
      make: (rng, level): ExerciseTask => {
        const mixedHint = "Das Mischglied heißt 2ab: Die 2 nicht vergessen.";
        if (level === 1) {
          const kind = rng.int(0, 2);
          const p = rng.int(1, 5);
          const q = rng.int(1, 9);
          const shown = kind === 0 ? `(${px(p)} + ${q})<sup>2</sup>` : kind === 1 ? `(${px(p)} − ${q})<sup>2</sup>` : `(${px(p)} + ${q})(${px(p)} − ${q})`;
          const mid = kind === 0 ? 2 * p * q : kind === 1 ? -2 * p * q : 0;
          const last = kind === 2 ? -q * q : q * q;
          const result: Poly = [{ c: p * p, m: X2 }, { c: mid, m: X1 }, { c: last, m: X0 }];
          const hint = ["(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup>", "(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>", "(a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>"][kind];
          const a = px(p);
          return {
            prompt: `Multipliziere mit einer binomischen Formel aus: ${shown}. Gib das Ergebnis in der Form □x<sup>2</sup> + □x + □ an.`,
            given: [shown, `a = ${a}, b = ${q}`],
            formulaHint: hint,
            fields: quadFields(result, {
              x2: p > 1 ? [{ value: p, hint: `(${p}x)² = ${p}² · x² = ${p * p}x²: Auch die Zahl wird quadriert.` }] : [],
              x1: kind === 2 ? [{ value: 2 * p * q, hint: "Bei (a + b)(a − b) heben sich die gemischten Glieder auf: Es gibt kein x-Glied." }] : [{ value: mid / 2, hint: mixedHint }, { value: 0, hint: "Das Mischglied 2ab fehlt: (a + b)² ist nicht a² + b²." }],
              x0: kind === 1 ? [{ value: -q * q, hint: "b² ist ein Quadrat und damit positiv: (−b)² = b²." }] : kind === 2 ? [{ value: q * q, hint: "Bei der 3. binomischen Formel steht − b²." }] : [{ value: 2 * q, hint: `b² heißt ${q} · ${q}, nicht 2 · ${q}.` }],
            }),
            steps: [
              `a = ${a}, b = ${q}: a<sup>2</sup> = ${p === 1 ? "x<sup>2</sup>" : `(${a})<sup>2</sup> = ${p * p}x<sup>2</sup>`}${kind === 2 ? "" : `, 2ab = 2 · ${a} · ${q} = ${px(2 * p * q)}`}, b<sup>2</sup> = ${q * q}`,
              `<strong>${shown} = ${polyHtml(result)}</strong>`,
            ],
            meta: { kind, p, q },
          };
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          // (a x ± b)² − (c x + d)(c x − d)
          const a = rng.int(2, 4);
          const c = rng.pick([1, 2, 3].filter((k) => k !== a));
          const b = rng.int(1, 7) * rng.sign();
          const d = rng.int(1, 6);
          const square = polyMul(lin(a, b), lin(a, b));
          const third = polyMul(lin(c, d), lin(c, -d));
          const result = polySub(square, third);
          const shown = `${linHtml(a, b)}<sup>2</sup> − ${linHtml(c, d)}${linHtml(c, -d)}`;
          return {
            prompt: `Vereinfache mit den binomischen Formeln und gib T in der Form □x<sup>2</sup> + □x + □ an: T = ${shown}`,
            given: [`T = ${shown}`],
            fields: quadFields(result, {
              x1: [{ value: a * b, hint: mixedHint }],
              x0: [{ value: b * b - d * d, hint: `Minus vor dem Produkt: − (${c === 1 ? "" : c * c}x² − ${d * d}) = − ${c === 1 ? "" : c * c}x² + ${d * d}.` }],
              x2: [{ value: a * a + c * c, hint: "Vor dem zweiten Produkt steht ein Minus: Auch sein x²-Glied wird abgezogen." }],
            }),
            steps: [
              `${b > 0 ? "1." : "2."} binomische Formel: ${linHtml(a, b)}<sup>2</sup> = ${polyHtml(square)}`,
              `3. binomische Formel: ${linHtml(c, d)}${linHtml(c, -d)} = ${polyHtml(third)}`,
              `T = ${polyHtml(square)} − (${polyHtml(third)}) = ${polyHtml(square)} − ${c === 1 ? "" : c * c}x<sup>2</sup> + ${d * d}`,
              `<strong>T = ${polyHtml(result)}</strong>`,
            ],
            meta: { kind: 3, a, b, c, d },
          };
        }
        if (kind === 1) {
          // (a x ± b y)² with two variables.
          const a = rng.int(1, 6);
          const b = rng.pick([1, 2, 3, 4, 5, 6].filter((k) => k !== a)) * rng.sign();
          const P: Poly = [{ c: a, m: { x: 1 } }, { c: b, m: { y: 1 } }];
          const result = polyMul(P, P);
          const shown = `(${polyHtml(P, false)})<sup>2</sup>`;
          return {
            prompt: `Ein Quadrat hat die Seitenlänge ${shown.replace("<sup>2</sup>", "")} (alle Längen in cm, ${b < 0 ? `${px(a)} > ${px(-b, "y")}` : "x, y > 0"}). Gib seinen Flächeninhalt als Summe in der Form □x<sup>2</sup> + □xy + □y<sup>2</sup> an.`,
            given: [`Seitenlänge ${shown.replace("<sup>2</sup>", "")} cm`],
            fields: [
              intField("Zahl vor x<sup>2</sup>:", a * a, a > 1 ? [{ value: a, hint: `(${a}x)² = ${a * a}x²: Auch die Zahl wird quadriert.` }] : []),
              intField("Zahl vor xy:", 2 * a * b, [{ value: a * b, hint: mixedHint }, { value: 0, hint: "Das Mischglied 2ab fehlt: (a + b)² ist nicht a² + b²." }]),
              intField("Zahl vor y<sup>2</sup>:", b * b, [{ value: -b * b, hint: "b² ist ein Quadrat und damit positiv." }]),
            ],
            steps: [
              `A = ${shown}, ${b > 0 ? "1." : "2."} binomische Formel mit a = ${px(a)} und b = ${px(Math.abs(b), "y")}`,
              `a<sup>2</sup> = ${a * a === 1 ? "" : a * a}x<sup>2</sup>, 2ab = 2 · ${px(a)} · ${px(Math.abs(b), "y")} = ${2 * a * Math.abs(b)}xy, b<sup>2</sup> = ${b * b === 1 ? "" : b * b}y<sup>2</sup>`,
              `<strong>A = ${polyHtml(result)} (in cm²)</strong>`,
            ],
            meta: { kind: 4, a, b },
          };
        }
        // (a x + b)² + (a x − b)²: the mixed terms cancel.
        const a = rng.int(1, 5);
        const b = rng.int(1, 8);
        const result = polyAdd(polyMul(lin(a, b), lin(a, b)), polyMul(lin(a, -b), lin(a, -b)));
        const shown = `${linHtml(a, b)}<sup>2</sup> + ${linHtml(a, -b)}<sup>2</sup>`;
        return {
          prompt: `Vereinfache mit den binomischen Formeln und gib T in der Form □x<sup>2</sup> + □x + □ an. Was fällt dir auf? T = ${shown}`,
          given: [`T = ${shown}`],
          fields: quadFields(result, {
            x1: [{ value: 4 * a * b, hint: "Die Mischglieder haben verschiedene Vorzeichen: +2ab und −2ab heben sich auf." }],
            x2: [{ value: a * a, hint: "Beide Quadrate liefern ein x²-Glied." }],
            x0: [{ value: 0, hint: "b² kommt in beiden Quadraten positiv vor." }],
          }),
          steps: [
            `1. Formel: ${linHtml(a, b)}<sup>2</sup> = ${polyHtml(polyMul(lin(a, b), lin(a, b)))}; 2. Formel: ${linHtml(a, -b)}<sup>2</sup> = ${polyHtml(polyMul(lin(a, -b), lin(a, -b)))}`,
            `Die Mischglieder ${2 * a * b}x und −${2 * a * b}x heben sich auf.`,
            `<strong>T = ${polyHtml(result)}</strong>`,
          ],
          meta: { kind: 5, a, b },
        };
      },
    },
    {
      id: "luecken",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const k = rng.int(2, 12);
            const minus = rng.next() < 0.5;
            const op = minus ? "−" : "+";
            return {
              prompt: `Fülle die Lücken so aus, dass eine binomische Formel entsteht: (x ${op} □)<sup>2</sup> = x<sup>2</sup> ${op} ${2 * k}x + □`,
              given: [`(x ${op} □)<sup>2</sup> = x<sup>2</sup> ${op} ${2 * k}x + □`],
              formulaHint: `(a ${op} b)<sup>2</sup> = a<sup>2</sup> ${op} 2ab + b<sup>2</sup>: das Mischglied ist 2 · x · b`,
              fields: [
                intField("erste Lücke:", k, [{ value: 2 * k, hint: `${2 * k}x ist das Mischglied 2 · x · b: Teile durch 2.` }]),
                intField("zweite Lücke:", k * k, [{ value: 2 * k, hint: "Die zweite Lücke ist b², das Quadrat der ersten Lücke." }, { value: 4 * k * k, hint: "Quadriere die erste Lücke, nicht das Mischglied." }]),
              ],
              steps: [`Das Mischglied ${2 * k}x = 2 · x · b, also b = ${2 * k} : 2 = ${k}.`, `b<sup>2</sup> = ${k}<sup>2</sup> = ${k * k}`, `<strong>(x ${op} ${k})<sup>2</sup> = x<sup>2</sup> ${op} ${2 * k}x + ${k * k}</strong>`],
              meta: { kind: 0, k, minus: minus ? 1 : 0 },
            };
          }
          if (kind === 1) {
            const t = rng.int(2, 9);
            const d = rng.int(1, 2);
            const minus = rng.next() < 0.5;
            const n = 10 * t + (minus ? -d : d);
            const mid = 20 * t * d;
            return {
              prompt: `Berechne ${n}<sup>2</sup> ohne Taschenrechner mit einer binomischen Formel: ${n} = ${10 * t} ${minus ? "−" : "+"} ${d}.`,
              given: [`${n}<sup>2</sup> = (${10 * t} ${minus ? "−" : "+"} ${d})<sup>2</sup>`],
              formulaHint: `(a ${minus ? "−" : "+"} b)<sup>2</sup> = a<sup>2</sup> ${minus ? "−" : "+"} 2ab + b<sup>2</sup>`,
              fields: [
                exactField("Mischglied 2ab =", mid, [{ value: mid / 2, hint: "2ab: die 2 nicht vergessen." }]),
                exactField(`${n}<sup>2</sup> =`, n * n, [{ value: 100 * t * t + d * d, hint: "Das Mischglied fehlt: (a + b)² ist nicht a² + b²." }, { value: minus ? 100 * t * t + mid + d * d : 100 * t * t - mid + d * d, hint: "Prüfe das Vorzeichen des Mischglieds." }]),
              ],
              steps: [
                `a = ${10 * t}, b = ${d}: a<sup>2</sup> = ${fmt(100 * t * t)}, 2ab = 2 · ${10 * t} · ${d} = ${mid}, b<sup>2</sup> = ${d * d}`,
                `<strong>${n}<sup>2</sup> = ${fmt(100 * t * t)} ${minus ? "−" : "+"} ${mid} + ${d * d} = ${fmt(n * n)}</strong>`,
              ],
              meta: { kind: 1, n, t, d },
            };
          }
          const t = rng.int(2, 9);
          const d = rng.int(1, 3);
          const [m, n] = [10 * t + d, 10 * t - d];
          return {
            prompt: `Berechne ${m} · ${n} ohne Taschenrechner mit der 3. binomischen Formel.`,
            given: [`${m} · ${n} = (${10 * t} + ${d})(${10 * t} − ${d})`],
            formulaHint: "(a + b)(a − b) = a<sup>2</sup> − b<sup>2</sup>",
            fields: [exactField(`${m} · ${n} =`, m * n, [{ value: 100 * t * t + d * d, hint: "Bei der 3. binomischen Formel wird b² abgezogen." }, { value: 100 * t * t - d, hint: `b² heißt ${d} · ${d}.` }])],
            steps: [`${m} · ${n} = (${10 * t} + ${d})(${10 * t} − ${d}) = ${10 * t}<sup>2</sup> − ${d}<sup>2</sup>`, `<strong>${m} · ${n} = ${fmt(100 * t * t)} − ${d * d} = ${fmt(m * n)}</strong>`],
            meta: { kind: 2, m, n, t, d },
          };
        }
        const kind = rng.int(0, 1);
        if (kind === 0) {
          // (□x − k y)² = p²x² − □xy + k²y²
          const p = rng.int(2, 7);
          const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== p));
          const minus = rng.next() < 0.6;
          const op = minus ? "−" : "+";
          const shown = `(□x ${op} ${px(k, "y")})<sup>2</sup> = ${p * p}x<sup>2</sup> ${op} □xy + ${k * k}y<sup>2</sup>`;
          return {
            prompt: `Ergänze die Lücken so, dass eine binomische Formel stimmt, und begründe mit a<sup>2</sup> und 2ab: ${shown}`,
            given: [shown],
            fields: [
              intField("erste Lücke:", p, [{ value: p * p, hint: `${p * p}x² ist a²: Gesucht ist die Zahl, deren Quadrat ${p * p} ist.` }]),
              intField("zweite Lücke:", 2 * p * k, [{ value: p * k, hint: "Das Mischglied heißt 2ab: Die 2 nicht vergessen." }, { value: 2 * p * p * k, hint: `a = ${p}x, nicht ${p * p}x: Nimm die erste Lücke für a.` }]),
            ],
            steps: [`a<sup>2</sup> = ${p * p}x<sup>2</sup> = (${p}x)<sup>2</sup>, also a = ${p}x; b<sup>2</sup> = ${k * k}y<sup>2</sup>, also b = ${px(k, "y")}`, `2ab = 2 · ${p}x · ${px(k, "y")} = ${2 * p * k}xy`, `<strong>(${p}x ${op} ${px(k, "y")})<sup>2</sup> = ${p * p}x<sup>2</sup> ${op} ${2 * p * k}xy + ${k * k}y<sup>2</sup></strong>`],
            meta: { kind: 3, p, k, minus: minus ? 1 : 0 },
          };
        }
        // A clever computation with three-digit numbers.
        const variant = rng.int(0, 2);
        const d = rng.int(1, 4);
        const base = rng.pick([100, 200, 300, 1000]);
        const formulas = ["1. binomische Formel", "2. binomische Formel", "3. binomische Formel"];
        const [m, n] = variant === 0 ? [base + d, base + d] : variant === 1 ? [base - d, base - d] : [base + d, base - d];
        const shown = m === n ? `${fmt(m)}<sup>2</sup>` : `${fmt(m)} · ${fmt(n)}`;
        const value = m * n;
        const work =
          variant === 0
            ? `(${fmt(base)} + ${d})<sup>2</sup> = ${fmt(base * base)} + ${fmt(2 * base * d)} + ${d * d}`
            : variant === 1
              ? `(${fmt(base)} − ${d})<sup>2</sup> = ${fmt(base * base)} − ${fmt(2 * base * d)} + ${d * d}`
              : `(${fmt(base)} + ${d})(${fmt(base)} − ${d}) = ${fmt(base * base)} − ${d * d}`;
        return {
          prompt: `Lea behauptet, sie könne ${shown} im Kopf ausrechnen. Welche binomische Formel hilft dabei, und welches Ergebnis erhält sie?`,
          given: [shown],
          fields: [
            choiceField("Welche Formel hilft?", formulas, variant),
            exactField(
              `${shown} =`,
              value,
              variant === 2
                ? [{ value: base * base + d * d, hint: "Bei der 3. binomischen Formel wird b² abgezogen." }]
                : [
                    { value: base * base + d * d, hint: "Das Mischglied 2ab fehlt: (a + b)² ist nicht a² + b²." },
                    { value: base * base - d * d, hint: "Das ist die 3. Formel. Hier wird ein Binom quadriert: a² ± 2ab + b²." },
                    { value: variant === 0 ? base * base - 2 * base * d + d * d : base * base + 2 * base * d + d * d, hint: "Prüfe das Vorzeichen des Mischglieds." },
                  ],
            ),
          ],
          steps: [`${fmt(m)} = ${fmt(base)} ${m > base ? "+" : "−"} ${d}${m !== n ? ` und ${fmt(n)} = ${fmt(base)} − ${d}: ${formulas[2]}` : `: ${formulas[variant]}`}`, `${work}`, `<strong>${shown} = ${fmt(value)}</strong>`],
          meta: { kind: 4, variant, m, n },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Plus, Minus, Plus-Minus: Die drei binomischen Formeln sitzen, auch mit Koeffizienten und zwei Variablen.",
};

// 4.4 Faktorisieren ───────────────────────────────────────────────────────────

/** The divisors d of n with 1 < d < n: common factors that are not the greatest. */
const properDivisors = (n: number) => Array.from({ length: Math.max(0, n - 2) }, (_, i) => i + 2).filter((d) => d < n && n % d === 0);

/** Exponent pairs for the bracket after ausklammern: [exponent of u, exponent of w]. */
const BRACKET_EXPS: Array<[number, number]> = [
  [1, 0],
  [0, 1],
  [2, 0],
  [0, 2],
  [1, 1],
  [2, 1],
  [1, 2],
];

const FORMULAS = ["1. binomische Formel", "2. binomische Formel", "3. binomische Formel"];

const faktorisieren: Lesson = {
  id: "tg-4-faktorisieren",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Faktorisieren",
  subtitle: "Ausklammern und binomische Formeln rückwärts",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Faktorisieren`,
  whyItMatters:
    "Ein Produkt verrät mehr als eine Summe: An 2(x + 3)(x − 3) siehst du sofort, wann der Term null wird, und Bruchterme in Etappe 5 kürzt du nur in faktorisierter Form. Die quadratische Ergänzung der nächsten Lektion beruht darauf, ein vollständiges Quadrat zu erkennen.",
  explanationHtml: `
    <p><strong>Faktorisieren</strong> heißt, eine Summe als Produkt zu schreiben. Es ist die Umkehrung des Ausmultiplizierens. Zwei Werkzeuge kennst du schon: das Distributivgesetz und die binomischen Formeln, beide rückwärts gelesen.</p>
    <p><strong>1. Ausklammern:</strong> Suche den größten gemeinsamen Faktor aller Glieder: den ggT der Zahlen und jede Variable, die in allen Gliedern vorkommt, mit ihrem kleinsten Exponenten. Teile dann jedes Glied durch diesen Faktor.</p>
    <div class="example"><strong>Beispiel 1:</strong> 12x<sup>3</sup>y − 18x<sup>2</sup>y<sup>2</sup><br>
      ggT(12; 18) = 6; x steckt in jedem Glied mindestens als x<sup>2</sup>, y mindestens als y.<br>
      Gemeinsamer Faktor: 6x<sup>2</sup>y. Geteilt: 12x<sup>3</sup>y : (6x<sup>2</sup>y) = 2x und 18x<sup>2</sup>y<sup>2</sup> : (6x<sup>2</sup>y) = 3y.<br>
      12x<sup>3</sup>y − 18x<sup>2</sup>y<sup>2</sup> = 6x<sup>2</sup>y(2x − 3y)<br>
      Probe: 6x<sup>2</sup>y · 2x − 6x<sup>2</sup>y · 3y = 12x<sup>3</sup>y − 18x<sup>2</sup>y<sup>2</sup></div>
    <p><strong>2. Binomische Formeln rückwärts:</strong> Ein Dreiglied ist ein <strong>vollständiges Quadrat</strong>, wenn zwei Glieder Quadrate a<sup>2</sup> und b<sup>2</sup> sind und das dritte genau das Mischglied ±2ab ist: 9x<sup>2</sup> − 30x + 25 = (3x)<sup>2</sup> − 2 · 3x · 5 + 5<sup>2</sup> = (3x − 5)<sup>2</sup>. Eine Differenz zweier Quadrate zerlegst du mit der 3. Formel: 25a<sup>2</sup> − 49b<sup>2</sup> = (5a)<sup>2</sup> − (7b)<sup>2</sup> = (5a + 7b)(5a − 7b).</p>
    <p><strong>Erkennen, was fehlt:</strong> x<sup>2</sup> + 8x + □ wird ein Quadrat, wenn □ = 4<sup>2</sup> = 16 ist, denn 8x = 2 · x · 4. x<sup>2</sup> + 6x + 4 ist kein vollständiges Quadrat, denn zu 6x gehört 3<sup>2</sup> = 9. Eine Summe zweier Quadrate wie x<sup>2</sup> + 16 lässt sich mit keiner binomischen Formel zerlegen.</p>
    <div class="example"><strong>Beispiel 2:</strong> Erst ausklammern, dann die Klammer prüfen:<br>
      2x<sup>2</sup> − 18 = 2(x<sup>2</sup> − 9) = 2(x + 3)(x − 3)<br>
      3x<sup>3</sup> − 12x<sup>2</sup> + 12x = 3x(x<sup>2</sup> − 4x + 4) = 3x(x − 2)<sup>2</sup></div>
    <p><strong>Probe:</strong> Multipliziere dein Ergebnis wieder aus; es muss der Ausgangsterm herauskommen.</p>
    <p><strong>Typische Fehler:</strong> nicht den größten Faktor ausklammern (2x(6x<sup>2</sup>y − 9xy<sup>2</sup>) ist richtig, aber nicht fertig); beim Ausklammern die 1 vergessen: 4x<sup>2</sup> + 2x = 2x(2x + 1); ein Dreiglied für ein Quadrat halten, dessen Mischglied nicht 2ab ist; nach dem Ausklammern aufhören, obwohl in der Klammer noch eine binomische Formel steckt.</p>
    <div class="merke"><strong>Merke:</strong> Erst ausklammern (ggT und kleinste Potenzen), dann in der Klammer nach a<sup>2</sup> ± 2ab + b<sup>2</sup> oder a<sup>2</sup> − b<sup>2</sup> suchen. Jede Faktorisierung prüfst du durch Ausmultiplizieren.</div>
  `,
  formulas: [
    { name: "Ausklammern", html: "ab + ac = a(b + c)", quantities: "a: ggT der Zahlen und gemeinsame Variablen mit dem kleinsten Exponenten" },
    { name: "Vollständiges Quadrat", html: "a<sup>2</sup> + 2ab + b<sup>2</sup> = (a + b)<sup>2</sup>; a<sup>2</sup> − 2ab + b<sup>2</sup> = (a − b)<sup>2</sup>", quantities: "das Mischglied muss genau 2ab sein" },
    { name: "Differenz zweier Quadrate", html: "a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)", quantities: "eine Summe a² + b² lässt sich so nicht zerlegen" },
  ],
  quiz: {
    question: "Welche Zerlegung von 2x² − 18 ist richtig und vollständig?",
    options: ["2(x² − 9)", "2(x − 3)²", "2(x + 3)(x − 3)", "2(x + 9)(x − 9)"],
    correctIndex: 2,
    explanation: "Erst 2 ausklammern: 2(x² − 9). x² − 9 = x² − 3² ist eine Differenz zweier Quadrate, also 2(x + 3)(x − 3). 2(x² − 9) ist richtig, aber nicht fertig; 2(x − 3)² ergäbe 2x² − 12x + 18.",
  },
  lab: {
    kind: "factorise",
    title: "Labor: Quadrate legen",
    intro:
      "Wähle, wie viele x²-Kacheln, x-Streifen und Einerquadrate du hast. Die Zeichnung legt sie zum Quadrat (sx + k)² und zeigt gestrichelt, welche Einerquadrate fehlen. Sind die x²-Kacheln selbst kein Quadrat, entstehen gleiche Gruppen: Das ist Ausklammern.",
    params: [
      { type: "choice", key: "A", label: "x²-Kacheln", options: [1, 2, 3, 4, 9].map((n) => ({ value: n, label: String(n) })), value: 1 },
      { type: "range", key: "B", label: "x-Streifen", unit: "", min: 0, max: 24, step: 1, value: 6 },
      { type: "range", key: "C", label: "Einerquadrate", unit: "", min: 0, max: 36, step: 1, value: 4 },
    ],
    readouts: [
      { key: "term", label: "Term", compute: (v) => quadratic(v.A, v.B, v.C) },
      { key: "factor", label: "als Produkt", emphasis: true, compute: (v) => (tileFit(v.A, v.B, v.C).ok ? tileFactor(tileFit(v.A, v.B, v.C)) : "kein vollständiges Quadrat") },
      {
        key: "need",
        label: "nötige Einerquadrate",
        compute: (v) => {
          const fit = tileFit(v.A, v.B, v.C);
          return fit.k === null ? "kein Quadrat möglich" : String(fit.need);
        },
      },
    ],
    goals: [
      {
        id: "ergaenzen",
        text: "Ergänze x² + 10x mit Einerquadraten zu einem vollständigen Quadrat. Wie viele brauchst du, und warum gerade so viele?",
        check: (v) => v.A === 1 && v.B === 10 && tileFit(v.A, v.B, v.C).ok,
      },
      {
        id: "zwei",
        text: "Zwei x²-Kacheln ergeben kein Quadrat. Finde Streifen und Einerquadrate, sodass zwei gleiche Quadrate entstehen.",
        check: (v) => {
          const fit = tileFit(v.A, v.B, v.C);
          return v.A === 2 && fit.ok && (fit.k ?? 0) >= 1;
        },
      },
      {
        id: "doppelt",
        text: "Lege ein vollständiges Quadrat, das sich auch als Vielfaches eines Quadrats schreiben lässt, wie (2x + 2)² = 4(x + 1)².",
        check: (v) => {
          const fit = tileFit(v.A, v.B, v.C);
          const k = fit.k ?? 0;
          return fit.ok && fit.groups === 1 && fit.s > 1 && k > 0 && k % fit.s === 0;
        },
      },
    ],
  },
  exercises: [
    {
      id: "ausklammern",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const [u, w] = rng.pick(VAR_PAIRS);
          const g = rng.pick([2, 3, 4, 5, 6, 8, 9, 12]);
          let [p, q] = [1, 1];
          let bracketTerms: Poly = [];
          for (let tries = 0; tries < 100; tries++) {
            [p, q] = [rng.int(0, 3), rng.int(0, 2)];
            if (p + q === 0) continue;
            const n = rng.next() < 0.35 ? 3 : 2;
            const exps = rng.shuffle(BRACKET_EXPS).slice(0, n);
            const coefs = exps.map((_, i) => (i === 0 ? rng.int(1, 6) : nonZero(rng, 6)));
            const common = coefs.reduce((x, y) => {
              let [m, k] = [Math.abs(x), Math.abs(y)];
              while (k) [m, k] = [k, m % k];
              return m;
            });
            if (common !== 1) continue;
            if (Math.min(...exps.map((e) => e[0])) !== 0 || Math.min(...exps.map((e) => e[1])) !== 0) continue;
            bracketTerms = exps.map(([i, j], k) => ({ c: coefs[k], m: mono2(u, w, i, j) }));
            break;
          }
          const G = mono2(u, w, p, q);
          const T = polyMul([{ c: g, m: G }], bracketTerms);
          const shown = polyHtml(T);
          const maxU = Math.max(...T.map((t) => t.m[u] ?? 0));
          const maxW = Math.max(...T.map((t) => t.m[w] ?? 0));
          const smaller = { hint: "Das ist ein gemeinsamer Faktor, aber nicht der größte: In der Klammer ließe sich noch etwas ausklammern." };
          const minHint = (v: string) => `Ausklammern kannst du nur die kleinste Potenz von ${v}, die in jedem Glied steckt.`;
          return {
            prompt: `Klammere den größten gemeinsamen Faktor aus: ${shown} = □ · ${u}<sup>□</sup>${w}<sup>□</sup> · (…). Gib die Zahl und die Exponenten des Faktors an.`,
            given: [`T = ${shown}`],
            formulaHint: "ggT der Zahlen; jede Variable mit dem kleinsten Exponenten, der in allen Gliedern vorkommt (Exponent 0: die Variable fehlt in einem Glied)",
            fields: [
              intField("Zahl:", g, properDivisors(g).map((d) => ({ value: d, ...smaller }))),
              intField(`Exponent von ${u}:`, p, [{ value: maxU, hint: minHint(u) }]),
              intField(`Exponent von ${w}:`, q, [{ value: maxW, hint: minHint(w) }]),
            ],
            steps: [
              `ggT der Zahlen: ${g}. ${p === 0 ? `${u} fehlt in einem Glied.` : `${u} steckt in jedem Glied mindestens als ${varsHtml({ [u]: p })}.`} ${q === 0 ? `${w} fehlt in einem Glied.` : `${w} steckt in jedem Glied mindestens als ${varsHtml({ [w]: q })}.`}`,
              `Jedes Glied durch ${monoHtml(g, G)} teilen: ${T.map((t) => `${monoHtml(t.c, t.m)} : (${monoHtml(g, G)}) = ${monoHtml(t.c / g, mono2(u, w, (t.m[u] ?? 0) - p, (t.m[w] ?? 0) - q))}`).join("; ")}`,
              `<strong>${shown} = ${monoHtml(g, G)}(${polyHtml(bracketTerms)})</strong>`,
            ],
            meta: { g, p, q, terms: T.length, ...Object.fromEntries(T.flatMap((t, i) => [[`c${i}`, t.c], [`u${i}`, t.m[u] ?? 0], [`w${i}`, t.m[w] ?? 0]])) },
          };
        }
        // Level 2: ausklammern, then a binomial formula in the bracket.
        const kind = rng.int(0, 2);
        const g = rng.pick([2, 3, 5, 6]);
        const k = rng.int(1, 6);
        const withX = rng.next() < 0.4 ? 1 : 0;
        const inner: Poly = kind === 2 ? [{ c: 1, m: X2 }, { c: -k * k, m: X0 }] : [{ c: 1, m: X2 }, { c: kind === 0 ? 2 * k : -2 * k, m: X1 }, { c: k * k, m: X0 }];
        const front: Poly = [{ c: g, m: withX ? X1 : X0 }];
        const T = polyMul(front, inner);
        const shown = polyHtml(T);
        const product = kind === 0 ? `(x + ${k})<sup>2</sup>` : kind === 1 ? `(x − ${k})<sup>2</sup>` : `(x + ${k})(x − ${k})`;
        const frontHtml = monoHtml(g, withX ? X1 : X0);
        return {
          prompt: `Faktorisiere T = ${shown} so weit wie möglich: Klammere zuerst den größten gemeinsamen Faktor aus und wende dann in der Klammer eine binomische Formel an. Gib den ausgeklammerten Faktor, die Formel und die Zahl k in (x ± k) an.`,
          given: [`T = ${shown}`],
          fields: [
            intField("ausgeklammerte Zahl:", g, [{ value: 1, hint: `Alle Zahlen sind durch ${g} teilbar: Klammere ${g} aus.` }, ...properDivisors(g).map((d) => ({ value: d, hint: "Das ist nicht der größte gemeinsame Faktor: Prüfe den ggT aller Zahlen." }))]),
            intField("Exponent von x im ausgeklammerten Faktor:", withX, withX ? [{ value: 0, hint: "Jedes Glied enthält x: Auch x wird ausgeklammert." }] : [{ value: 1, hint: "Das letzte Glied enthält kein x: x lässt sich nicht ausklammern." }]),
            choiceField("Formel in der Klammer:", FORMULAS, kind),
            intField("k =", k, [{ value: k * k, hint: `k ist die Zahl, deren Quadrat ${k * k} am Ende der Klammer steht.` }, ...(kind < 2 ? [{ value: 2 * k, hint: "Das Mischglied ist 2 · x · k: Halbiere die Zahl vor x." }] : [])]),
          ],
          steps: [
            `Ausklammern: ggT ${g}${withX ? ", und x steckt in jedem Glied" : ""}: T = ${frontHtml}(${polyHtml(inner)})`,
            kind === 2 ? `In der Klammer: x<sup>2</sup> − ${k * k} = x<sup>2</sup> − ${k}<sup>2</sup>, eine Differenz zweier Quadrate (3. Formel).` : `In der Klammer: ${polyHtml(inner)} = x<sup>2</sup> ${kind === 0 ? "+" : "−"} 2 · x · ${k} + ${k}<sup>2</sup>, ein vollständiges Quadrat (${kind + 1}. Formel).`,
            `<strong>T = ${frontHtml}${product}</strong>`,
          ],
          meta: { kind, g, k, withX, t3: coefOf(T, { x: 3 }), t2: coefOf(T, X2), t1: coefOf(T, X1), t0: coefOf(T, X0) },
        };
      },
    },
    {
      id: "rueckwaerts",
      make: (rng, level): ExerciseTask => {
        const coprime = (a: number, b: number) => {
          let [m, n] = [a, b];
          while (n) [m, n] = [n, m % n];
          return m === 1;
        };
        let [p, q] = [2, 1];
        do {
          [p, q] = [rng.int(2, 7), rng.int(1, 9)];
        } while (!coprime(p, q));
        if (level === 1) {
          const kind = rng.int(0, 3);
          const [v1, v2] = kind === 3 ? ["a", "b"] : ["x", ""];
          const sq = (n: number, v: string) => (v ? `${n * n === 1 ? "" : n * n}${v}<sup>2</sup>` : `${n * n}`);
          const pv = (n: number, v: string) => (v ? px(n, v) : `${n}`);
          const root = (n: number, v: string) => (v ? `(${px(n, v)})<sup>2</sup>` : `${n}<sup>2</sup>`);
          const shown =
            kind === 0 ? `${p * p}x<sup>2</sup> + ${2 * p * q}x + ${q * q}` : kind === 1 ? `${p * p}x<sup>2</sup> − ${2 * p * q}x + ${q * q}` : `${sq(p, v1)} − ${sq(q, v2)}`;
          const template = kind === 0 ? `(□x + □)<sup>2</sup>` : kind === 1 ? `(□x − □)<sup>2</sup>` : `(□${v1} + □${v2})(□${v1} − □${v2})`;
          const factored = kind === 0 ? `(${p}x + ${q})<sup>2</sup>` : kind === 1 ? `(${p}x − ${q})<sup>2</sup>` : `(${pv(p, v1)} + ${pv(q, v2)})(${pv(p, v1)} − ${pv(q, v2)})`;
          return {
            prompt: `Faktorisiere mit einer binomischen Formel: ${shown} = ${template}`,
            given: [`${shown} = ${template}`],
            formulaHint: "a<sup>2</sup> + 2ab + b<sup>2</sup> = (a + b)<sup>2</sup>; a<sup>2</sup> − 2ab + b<sup>2</sup> = (a − b)<sup>2</sup>; a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)",
            fields: [
              intField("erste Zahl:", p, [{ value: p * p, hint: `Gesucht ist die Zahl, deren Quadrat ${p * p} ist.` }]),
              intField("zweite Zahl:", q, [{ value: q * q, hint: `Gesucht ist die Zahl, deren Quadrat ${q * q} ist.` }, ...(kind < 2 ? [{ value: p * q, hint: "Das Mischglied ist 2ab, nicht ab." }, { value: 2 * p * q, hint: "Das ist das Mischglied 2ab, gesucht ist b." }] : [])]),
            ],
            steps: [
              kind < 2
                ? `${p * p}x<sup>2</sup> = (${p}x)<sup>2</sup>, ${q * q} = ${q}<sup>2</sup> und das Mischglied passt: 2 · ${p}x · ${q} = ${2 * p * q}x.`
                : `${sq(p, v1)} = ${root(p, v1)} und ${sq(q, v2)} = ${root(q, v2)}: eine Differenz zweier Quadrate.`,
              `<strong>${shown} = ${factored}</strong>`,
            ],
            meta: { kind, p, q },
          };
        }
        // Level 2: check a claimed square and name the summand that must be there.
        const variant = rng.int(0, 2);
        const minus = rng.next() < 0.4;
        let mid = 2 * p * q;
        let last = q * q;
        const right = variant === 0;
        if (variant === 1) last = rng.pick([q * q + rng.int(1, 6), Math.max(1, q * q - rng.int(1, 5)), 2 * q, q].filter((n) => n !== q * q && n > 0));
        if (variant === 2) mid = rng.pick([p * q, 2 * p * q + p, 2 * p * q - p, p * p * q].filter((n) => n !== 2 * p * q && n > 0));
        const op = minus ? "−" : "+";
        const shown = `${p * p}x<sup>2</sup> ${op} ${mid}x + ${last}`;
        const askLast = variant === 1 || (variant === 0 && rng.next() < 0.5);
        const name = ["Tim", "Mia", "Can", "Lena", "Jonas", "Elif"][rng.int(0, 5)];
        return {
          prompt: `${name} behauptet: T = ${shown} ist ein vollständiges Quadrat. Prüfe die Behauptung. Welche Zahl muss ${askLast ? "am Ende" : "vor x"} stehen, damit T ein vollständiges Quadrat ist? (Steht dort schon die richtige Zahl, gib sie an.)`,
          given: [`T = ${shown}`],
          fields: [
            choiceField("Ist T ein vollständiges Quadrat?", ["ja", "nein"], right ? 0 : 1),
            askLast
              ? intField("Zahl am Ende:", q * q, [{ value: q, hint: `Am Ende steht b², also ${q} · ${q}.` }, { value: 2 * q, hint: `b² heißt ${q} · ${q}, nicht 2 · ${q}.` }, ...(right ? [] : [{ value: last, hint: "Prüfe mit dem Mischglied: 2 · a · b muss die Zahl vor x ergeben." }])])
              : intField("Zahl vor x:", 2 * p * q, [{ value: p * q, hint: "Das Mischglied ist 2ab, nicht ab." }, ...(right ? [] : [{ value: mid, hint: "Prüfe: Die Zahl vor x muss 2 · a · b sein." }])]),
          ],
          steps: [
            `${p * p}x<sup>2</sup> = (${p}x)<sup>2</sup>, also a = ${p}x. ${askLast ? `Das Mischglied ${mid}x = 2 · ${p}x · b ergibt b = ${q}.` : `${last} = ${q}<sup>2</sup>, also b = ${q}.`}`,
            askLast ? `Dann muss am Ende b<sup>2</sup> = ${q * q} stehen${right ? ", und das steht dort." : `, nicht ${last}.`}` : `Dann muss das Mischglied 2 · ${p}x · ${q} = ${2 * p * q}x sein${right ? ", und das ist es." : `, nicht ${mid}x.`}`,
            `<strong>${right ? "ja" : "nein"}: ${p * p}x<sup>2</sup> ${op} ${2 * p * q}x + ${q * q} = (${p}x ${op} ${q})<sup>2</sup></strong>`,
          ],
          meta: { variant, p, q, mid, last, minus: minus ? 1 : 0, askLast: askLast ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Ausklammern und binomische Formeln rückwärts: Du zerlegst Summen in Produkte und prüfst sie.",
};

// 4.5 Extremwerte quadratischer Terme ─────────────────────────────────────────

/** The factor in front of a bracket in HTML: "", "−", "2", "−0,5". */
const lead = (a: number) => (a === 1 ? "" : a === -1 ? MINUS : fmt(a));

/** The steps of the quadratische Ergänzung of ax² + bx + c in HTML, ending with a(x − d)² + e. */
function completionSteps(a: number, b: number, c: number): string[] {
  const d = -b / (2 * a);
  const e = c - (b * b) / (4 * a);
  const h = Math.abs(b / (2 * a));
  const cText = c === 0 ? "" : signed(c);
  const form = vertexForm(a, d, e, 4).replace("²", "<sup>2</sup>");
  const sqBracket = `${shifted(d, 4)}<sup>2</sup>`;
  const inner = quadratic(1, b / a, 0, 4).replace("x²", "x<sup>2</sup>");
  if (a === 1) {
    return [
      `T(x) = ${inner} + ${fmt(h, 4)}<sup>2</sup> − ${fmt(h, 4)}<sup>2</sup>${cText}`,
      `T(x) = ${sqBracket} − ${fmt(h * h, 4)}${cText} = ${form}`,
    ];
  }
  return [
    `a = ${fmt(a)} aus den x-Gliedern ausklammern: T(x) = ${lead(a)}[${inner}]${cText}`,
    `In der Klammer ergänzen: T(x) = ${lead(a)}[${inner} + ${fmt(h, 4)}<sup>2</sup> − ${fmt(h, 4)}<sup>2</sup>]${cText} = ${lead(a)}[${sqBracket} − ${fmt(h * h, 4)}]${cText}`,
    `Ausmultiplizieren: T(x) = ${lead(a)}${sqBracket}${signed(-a * h * h)}${cText} = ${form}`,
  ];
}

/** The conclusion: "T(x) hat für x = 3 den kleinsten Wert T_min = 5." */
function extremeSentence(a: number, d: number, e: number, name = "T"): string {
  return a > 0 ? `${name}(x) hat für x = ${fmt(d, 4)} den kleinsten Wert ${name}<sub>min</sub> = ${fmt(e, 4)}.` : `${name}(x) hat für x = ${fmt(d, 4)} den größten Wert ${name}<sub>max</sub> = ${fmt(e, 4)}.`;
}

const KIND = ["kleinster Wert (Minimum)", "größter Wert (Maximum)"];

const extremwerte: Lesson = {
  id: "tg-5-extremwerte",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Extremwerte quadratischer Terme",
  subtitle: "Quadratische Ergänzung: Ein Quadrat ist nie negativ",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Extremwerte quadratischer Terme`,
  whyItMatters:
    "Wie groß kann eine Fläche höchstens werden, wie klein ein Materialverbrauch? Solche Fragen führen auf quadratische Terme, und deren kleinsten oder größten Wert findest du mit der quadratischen Ergänzung ganz ohne Ausprobieren.",
  explanationHtml: `
    <p>Ein Term T(x) = ax<sup>2</sup> + bx + c mit a ≠ 0 heißt <strong>quadratischer Term</strong>. Welchen Wert er annimmt, hängt von x ab. Oft willst du wissen, wie klein oder wie groß er werden kann. Das zeigt die <strong>quadratische Ergänzung</strong>: Sie schreibt T(x) in der Form a(x − d)<sup>2</sup> + e.</p>
    <p><strong>Warum das hilft:</strong> Ein Quadrat ist nie negativ: (x − d)<sup>2</sup> ≥ 0, und es ist genau dann 0, wenn x = d ist. Für a &gt; 0 ist a(x − d)<sup>2</sup> ≥ 0, also T(x) ≥ e: T(x) hat für x = d den <strong>kleinsten Wert</strong> T<sub>min</sub> = e. Für a &lt; 0 ist a(x − d)<sup>2</sup> ≤ 0, also T(x) ≤ e: T(x) hat für x = d den <strong>größten Wert</strong> T<sub>max</sub> = e.</p>
    <div class="example"><strong>Beispiel 1</strong> (a = 1): T(x) = x<sup>2</sup> − 6x + 14<br>
      Halbiere die Zahl vor x: 6 : 2 = 3. Ergänze 3<sup>2</sup> und ziehe es gleich wieder ab:<br>
      T(x) = x<sup>2</sup> − 6x + 3<sup>2</sup> − 3<sup>2</sup> + 14 = (x − 3)<sup>2</sup> − 9 + 14 = (x − 3)<sup>2</sup> + 5<br>
      T(x) hat für x = 3 den kleinsten Wert T<sub>min</sub> = 5.<br>
      Kontrolle mit der Wertetabelle: T(2) = 6, T(3) = 5, T(4) = 6.</div>
    <p><strong>Mit a ≠ 1</strong> klammerst du a zuerst aus den beiden x-Gliedern aus, ergänzt in der Klammer und multiplizierst dann wieder aus:</p>
    <div class="example"><strong>Beispiel 2:</strong> T(x) = 2x<sup>2</sup> + 8x + 3 = 2[x<sup>2</sup> + 4x] + 3 = 2[x<sup>2</sup> + 4x + 2<sup>2</sup> − 2<sup>2</sup>] + 3 = 2[(x + 2)<sup>2</sup> − 4] + 3 = 2(x + 2)<sup>2</sup> − 8 + 3 = 2(x + 2)<sup>2</sup> − 5<br>
      a = 2 &gt; 0: T(x) hat für x = −2 den kleinsten Wert T<sub>min</sub> = −5.<br>
      <strong>Beispiel 3:</strong> T(x) = −x<sup>2</sup> + 4x + 1 = −[x<sup>2</sup> − 4x] + 1 = −[(x − 2)<sup>2</sup> − 4] + 1 = −(x − 2)<sup>2</sup> + 5<br>
      a = −1 &lt; 0: T(x) hat für x = 2 den größten Wert T<sub>max</sub> = 5.</div>
    <p>Die Werte liegen symmetrisch zu x = d: T(d − 1) = T(d + 1), T(d − 2) = T(d + 2) und so weiter. Das ist eine gute Kontrolle in der Wertetabelle.</p>
    <p><strong>Typische Fehler:</strong> das Quadrat der halben Zahl nur addieren und nicht wieder abziehen; den Faktor a vergessen (bei 2x<sup>2</sup> + 8x + 3 ist d = −2, nicht −4); das Vorzeichen von d: (x + 2)<sup>2</sup> ist für x = −2 null, nicht für x = 2; die Ergänzung in der eckigen Klammer beim Ausmultiplizieren nicht mit a malnehmen.</p>
    <div class="merke"><strong>Merke:</strong> T(x) = a(x − d)<sup>2</sup> + e. Für a &gt; 0 hat T(x) für x = d den kleinsten Wert T<sub>min</sub> = e, für a &lt; 0 den größten Wert T<sub>max</sub> = e.</div>
  `,
  formulas: [
    { name: "Quadratische Ergänzung", html: `x<sup>2</sup> + bx + c = (x + ${frac("b", "2")})<sup>2</sup> − (${frac("b", "2")})<sup>2</sup> + c`, quantities: "die halbe Zahl vor x quadrieren, addieren und gleich wieder abziehen" },
    { name: "Extremwert", html: "T(x) = a(x − d)<sup>2</sup> + e", quantities: "a > 0: kleinster Wert e für x = d; a < 0: größter Wert e für x = d" },
    { name: "Ein Quadrat ist nie negativ", html: "(x − d)<sup>2</sup> ≥ 0", quantities: "null genau für x = d" },
  ],
  quiz: {
    question: "Welchen Extremwert hat T(x) = x² + 4x + 7?",
    options: ["kleinster Wert 7 für x = 0", "kleinster Wert 3 für x = 2", "größter Wert 3 für x = −2", "kleinster Wert 3 für x = −2"],
    correctIndex: 3,
    explanation: "x² + 4x + 7 = x² + 4x + 2² − 2² + 7 = (x + 2)² + 3. Das Quadrat ist für x = −2 null und sonst positiv, also ist 3 der kleinste Wert, angenommen bei x = −2, nicht bei 2.",
  },
  lab: {
    kind: "completing-square",
    title: "Labor: Das Quadrat entscheidet",
    intro:
      "Wähle a, b und c für T(x) = ax² + bx + c und schiebe x. Links steht die quadratische Ergänzung, darunter das Quadrat (x − d)² als Fläche: Es schrumpft bei x = d auf null. Rechts siehst du die Werte der Wertetabelle als Punkte.",
    params: [
      { type: "choice", key: "a", label: "a", options: [-2, -1, -0.5, 0.5, 1, 2].map((n) => ({ value: n, label: fmt(n) })), value: 1 },
      { type: "range", key: "b", label: "b", unit: "", min: -6, max: 6, step: 1, value: -6 },
      { type: "range", key: "c", label: "c", unit: "", min: -10, max: 15, step: 1, value: 14 },
      { type: "range", key: "x", label: "x", unit: "", min: -6, max: 6, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "value", label: "T(x) beim eingestellten x", digits: 3, emphasis: true, compute: (v) => termValue(v, v.x) },
      { key: "square", label: "Quadrat (x − d)²", digits: 4, compute: (v) => (v.x - completedSquare(v).d) ** 2 },
      { key: "form", label: "nach der quadratischen Ergänzung", compute: (v) => `T(x) = ${vertexForm(v.a, completedSquare(v).d, completedSquare(v).e, 4)}` },
    ],
    goals: [
      {
        id: "kleinster",
        text: "Stelle mit a = 1 einen Term ein, der seinen kleinsten Wert 1 für x = −2 annimmt. Welche Zahl b brauchst du, welche Zahl c?",
        check: (v) => v.a === 1 && Math.abs(completedSquare(v).d + 2) < 1e-9 && Math.abs(completedSquare(v).e - 1) < 1e-9,
      },
      {
        id: "max4",
        text: "Stelle einen Term mit x-Glied ein, dessen größter Wert genau 4 ist.",
        check: (v) => v.a < 0 && v.b !== 0 && Math.abs(completedSquare(v).e - 4) < 1e-9,
      },
      {
        id: "spiegel",
        text: "Finde ein x ≠ 0, bei dem T(x) denselben Wert hat wie bei x = 0. Wie hängt es mit d zusammen?",
        check: (v) => v.x !== 0 && Math.abs(termValue(v, v.x) - v.c) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "extremwert",
      make: guarded((rng, level): ExerciseTask => {
        const dSlips = (d: number, b: number) => [
          { value: -d, hint: `Achte auf das Vorzeichen: ${d > 0 ? `(x − ${fmt(d)})²` : `(x + ${fmt(-d)})²`} ist für x = ${fmt(d)} null.` },
          { value: -b, hint: "Halbiere die Zahl vor x (und teile vorher durch a)." },
        ];
        if (level === 1) {
          const a = rng.next() < 0.3 ? -1 : 1;
          const d = nonZero(rng, 6);
          const e = rng.int(-9, 12);
          const b = -2 * a * d;
          const c = e + a * d * d;
          return {
            prompt: `Bestimme mit quadratischer Ergänzung den Extremwert von T(x) = ${polyHtml([{ c: a, m: X2 }, { c: b, m: X1 }, { c, m: X0 }])}. Ist es der kleinste oder der größte Wert, und für welches x wird er angenommen?`,
            given: [`T(x) = ${polyHtml([{ c: a, m: X2 }, { c: b, m: X1 }, { c, m: X0 }])}`],
            formulaHint: `x<sup>2</sup> + bx + c = x<sup>2</sup> + bx + (${frac("b", "2")})<sup>2</sup> − (${frac("b", "2")})<sup>2</sup> + c${a < 0 ? "; bei −x<sup>2</sup> zuerst −1 ausklammern" : ""}`,
            fields: [
              choiceField("Art des Extremwerts:", KIND, a > 0 ? 0 : 1),
              numberField("x =", d, "", 2, { slips: dSlips(d, b) }),
              numberField("Extremwert:", e, "", 2, {
                slips: [
                  { value: c + a * d * d, hint: "Die ergänzte Zahl muss gleich wieder abgezogen werden." },
                  { value: c, hint: "c ist nicht der Extremwert: Die Ergänzung verändert die Zahl am Ende." },
                  { value: c - a * b * b, hint: "Quadriere die Hälfte der Zahl vor x, nicht die ganze Zahl." },
                ],
              }),
            ],
            steps: [...completionSteps(a, b, c), `Ein Quadrat ist nie negativ und nur für x = ${fmt(d)} null.`, `<strong>${extremeSentence(a, d, e)}</strong>`],
            meta: { a, b, c, d, e },
          };
        }
        const context = rng.next() < 0.3;
        if (context) {
          // A profit G(x) = a(x − d)² + e with its greatest value at d hundred pieces.
          const a = rng.pick([-0.5, -1, -2]);
          const d = rng.int(2, 9);
          const e = rng.int(4, 40) * (a === -0.5 ? 1 : 2);
          const b = -2 * a * d;
          const c = e + a * d * d;
          const G = polyHtml([{ c: a, m: X2 }, { c: b, m: X1 }, { c, m: X0 }]);
          return {
            prompt: `Eine Schülerfirma verkauft Kalender. Ihr Gewinn ist G(x) = ${G} (x: verkaufte Kalender in Hundert, G in Hundert Euro; ein negativer Wert ist ein Verlust). Bei welcher Verkaufszahl ist der Gewinn am größten, und wie groß ist er dann?`,
            given: [`G(x) = ${G}`],
            fields: [
              numberField("x =", d, "Hundert", 2, { slips: dSlips(d, b) }),
              numberField("größter Gewinn:", e, "Hundert €", 2, { slips: [{ value: c, hint: "c ist der Wert für x = 0, nicht der größte Gewinn." }, { value: c - d * d, hint: "Klammere a zuerst aus: Die Ergänzung wird mit a multipliziert." }] }),
            ],
            steps: [...completionSteps(a, b, c).map((s) => s.replaceAll("T(x)", "G(x)")), `<strong>${extremeSentence(a, d, e, "G")} Bei ${fmt(100 * d)} Kalendern ist der Gewinn mit ${fmt(100 * e)} € am größten.</strong>`],
            meta: { a, b, c, d, e, context: 1 },
          };
        }
        const a = rng.pick([2, 3, -2, -3, 0.5, -0.5, -1]);
        const d = nonZero(rng, 5);
        const e = rng.int(-9, 12);
        const b = -2 * a * d;
        const c = e + a * d * d;
        const T = polyHtml([{ c: a, m: X2 }, { c: b, m: X1 }, { c, m: X0 }]);
        return {
          prompt: `Gegeben ist der Term T(x) = ${T}. Bestimme mit quadratischer Ergänzung, ob T(x) einen kleinsten oder einen größten Wert hat, wie groß er ist und für welches x er angenommen wird.`,
          given: [`T(x) = ${T}`],
          fields: [
            choiceField("Art des Extremwerts:", KIND, a > 0 ? 0 : 1),
            numberField("x =", d, "", 2, { slips: [...dSlips(d, b), { value: -b / 2, hint: `Klammere zuerst ${fmt(a)} aus: Halbiert wird die Zahl vor x in der Klammer.` }] }),
            numberField("Extremwert:", e, "", 2, {
              slips: [
                { value: c - d * d, hint: "Die Ergänzung steht in der Klammer: Beim Ausmultiplizieren wird sie mit a multipliziert." },
                { value: c + a * d * d, hint: "Die ergänzte Zahl muss gleich wieder abgezogen werden." },
                { value: c, hint: "c ist nicht der Extremwert: Die Ergänzung verändert die Zahl am Ende." },
              ],
            }),
          ],
          steps: [...completionSteps(a, b, c), `a = ${fmt(a)} ${a > 0 ? "&gt; 0: Das Quadrat wird mit einer positiven Zahl multipliziert" : "&lt; 0: Das Quadrat wird mit einer negativen Zahl multipliziert"}.`, `<strong>${extremeSentence(a, d, e)}</strong>`],
          meta: { a, b, c, d, e, context: 0 },
        };
      }),
    },
    {
      id: "parameter",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const d = nonZero(rng, 8);
          const m = rng.int(-8, 10);
          const b = -2 * d;
          const c = m + d * d;
          const shown = `x<sup>2</sup>${signed(b)}x + c`;
          return {
            prompt: `Bestimme c so, dass der kleinste Wert von T(x) = ${shown} genau ${fmt(m)} ist. Für welches x wird er angenommen?`,
            given: [`T(x) = ${shown}`, `T<sub>min</sub> = ${fmt(m)}`],
            formulaHint: `x<sup>2</sup> + bx + c = (x + ${frac("b", "2")})<sup>2</sup> + c − (${frac("b", "2")})<sup>2</sup>, also T<sub>min</sub> = c − (${frac("b", "2")})<sup>2</sup>`,
            fields: [
              numberField("c =", c, "", 2, { slips: [{ value: m - d * d, hint: "Die Ergänzung wird abgezogen; c muss sie ausgleichen: c = T_min + (b : 2)²." }, { value: m, hint: "c ist nicht der kleinste Wert: Die Ergänzung zieht noch etwas ab." }] }),
              numberField("x =", d, "", 2, { slips: [{ value: -d, hint: `Achte auf das Vorzeichen: ${d > 0 ? `(x − ${d})²` : `(x + ${-d})²`} ist für x = ${fmt(d)} null.` }] }),
            ],
            steps: [
              `T(x) = x<sup>2</sup>${signed(b)}x + ${Math.abs(d)}<sup>2</sup> − ${Math.abs(d)}<sup>2</sup> + c = ${shifted(d)}<sup>2</sup> + c − ${d * d}`,
              `Der kleinste Wert ist c − ${d * d}. Er soll ${fmt(m)} sein: c − ${d * d} = ${fmt(m)}, also c = ${fmt(c)}.`,
              `<strong>c = ${fmt(c)}; der kleinste Wert ${fmt(m)} wird für x = ${fmt(d)} angenommen.</strong>`,
            ],
            meta: { a: 1, b, d, m, c },
          };
        }
        const a = rng.pick([-2, -1, -0.5, 2, 3, 0.5, -3]);
        const d = nonZero(rng, 5);
        const m = rng.int(-6, 12);
        const b = -2 * a * d;
        const c = m + a * d * d;
        const shown = `${polyHtml([{ c: a, m: X2 }, { c: b, m: X1 }])} + c`;
        const word = a > 0 ? "kleinsten" : "größten";
        return {
          prompt: `Gegeben ist T(x) = ${shown}. Bestimme c so, dass T(x) den ${word} Wert ${fmt(m)} hat, und gib an, für welches x dieser Wert angenommen wird.`,
          given: [`T(x) = ${shown}`],
          fields: [
            numberField("c =", c, "", 2, { slips: [{ value: m - a * d * d, hint: "Die Ergänzung wird abgezogen; c muss sie ausgleichen." }, { value: m + d * d, hint: "Klammere a zuerst aus: Die Ergänzung wird beim Ausmultiplizieren mit a multipliziert." }, { value: m, hint: "c ist nicht der Extremwert: Die Ergänzung verändert die Zahl am Ende." }] }),
            numberField("x =", d, "", 2, { slips: [{ value: -d, hint: "Achte auf das Vorzeichen von d." }, { value: -b / 2, hint: `Klammere zuerst ${fmt(a)} aus: Halbiert wird die Zahl vor x in der Klammer.` }] }),
          ],
          steps: [
            `T(x) = ${lead(a)}[${quadratic(1, b / a, 0).replace("x²", "x<sup>2</sup>")}] + c = ${lead(a)}[${shifted(d)}<sup>2</sup> − ${d * d}] + c = ${lead(a)}${shifted(d)}<sup>2</sup>${signed(-a * d * d)} + c`,
            `Der ${a > 0 ? "kleinste" : "größte"} Wert ist ${fmt(-a * d * d)} + c. Er soll ${fmt(m)} sein, also c = ${fmt(m)}${signed(a * d * d)} = ${fmt(c)}.`,
            `<strong>c = ${fmt(c)}; T(x) = ${vertexForm(a, d, m).replace("²", "<sup>2</sup>")} hat für x = ${fmt(d)} den ${word} Wert ${fmt(m)}.</strong>`,
          ],
          meta: { a, b, d, m, c },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest mit der quadratischen Ergänzung den kleinsten oder größten Wert eines quadratischen Terms.",
};

// 4.6 Extremwertprobleme ──────────────────────────────────────────────────────

const WALL = [16, 20, 24, 28, 32, 36, 40, 44, 48];
const PERIMETER = [12, 16, 20, 24, 28, 32, 36, 40];
const DIVIDER = [18, 24, 30, 36, 42, 48, 60];

const extremwertprobleme: Lesson = {
  id: "tg-6-extremwertprobleme",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "4.6 Extremwertprobleme",
  subtitle: "Größte Fläche, kleinste Fläche",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Extremwertprobleme`,
  whyItMatters:
    "Mit einer festen Zaunlänge die größte Weide einzäunen oder aus einem Brett möglichst wenig Abfall schneiden: Solche Aufgaben stehen in jeder Abschlussprüfung, und die quadratische Ergänzung löst sie genau.",
  explanationHtml: `
    <p>Bei einem <strong>Extremwertproblem</strong> soll eine Größe möglichst groß oder möglichst klein werden, etwa der Flächeninhalt eines Rechtecks. Ist diese Größe ein quadratischer Term, findest du den Extremwert mit der quadratischen Ergänzung aus Lektion 4.5.</p>
    <ol>
      <li><strong>Variable festlegen:</strong> Was ist x, in welcher Einheit?</li>
      <li><strong>Term aufstellen:</strong> die Zielgröße in Abhängigkeit von x, zum Beispiel A(x) = Länge · Breite, wobei die Seiten selbst Terme in x sind.</li>
      <li><strong>Sinnvolle Werte für x:</strong> Alle Längen müssen positiv sein. Daraus folgt ein Bereich wie 0 &lt; x &lt; 8, geschrieben x ∈ ]0; 8[.</li>
      <li><strong>Extremwert bestimmen:</strong> quadratisch ergänzen, den Extremwert ablesen und prüfen, ob x im Bereich liegt.</li>
      <li><strong>Antwort</strong> im Sachzusammenhang, mit Einheiten.</li>
    </ol>
    <div class="example"><strong>Beispiel:</strong> Ein Rechteck ist 8 cm lang und 5 cm breit. Die Länge wird um x cm verkürzt, die Breite um 2x cm verlängert. Für welches x wird der Flächeninhalt am größten?<br>
      Seiten: (8 − x) cm und (5 + 2x) cm, beide positiv für 0 &lt; x &lt; 8, also x ∈ ]0; 8[.<br>
      A(x) = (8 − x)(5 + 2x) = 40 + 16x − 5x − 2x<sup>2</sup> = −2x<sup>2</sup> + 11x + 40<br>
      A(x) = −2[x<sup>2</sup> − 5,5x] + 40 = −2[(x − 2,75)<sup>2</sup> − 7,5625] + 40 = −2(x − 2,75)<sup>2</sup> + 55,125<br>
      a = −2 &lt; 0: größter Wert für x = 2,75, und 2,75 liegt in ]0; 8[.<br>
      Antwort: Für x = 2,75 ist das Rechteck 5,25 cm lang und 10,5 cm breit; sein Flächeninhalt ist mit 55,125 cm² am größten.</div>
    <p><strong>Zaun an einer Mauer:</strong> Mit 40 m Zaun wird an einer Mauer ein Rechteck eingezäunt; an der Mauer braucht es keinen Zaun. Ist x die Seite senkrecht zur Mauer, bleiben für die Seite an der Mauer (40 − 2x) m. A(x) = x(40 − 2x) = −2(x − 10)<sup>2</sup> + 200 mit x ∈ ]0; 20[: Das größte Gehege ist 10 m tief, 20 m lang und 200 m² groß.</p>
    <p><strong>Gleicher Umfang:</strong> Ein Rechteck mit dem Umfang 20 cm hat die Seiten x cm und (10 − x) cm. A(x) = x(10 − x) = −(x − 5)<sup>2</sup> + 25: Am größten ist das Quadrat mit 5 cm Seitenlänge. Unter allen Rechtecken mit gleichem Umfang hat das Quadrat den größten Flächeninhalt.</p>
    <p><strong>Ein kleinster Wert:</strong> Auf jeder Seite eines Quadrats mit 8 cm Seitenlänge liegt ein Punkt, x cm von der Ecke entfernt (immer im gleichen Umlaufsinn). Die vier Punkte bilden ein inneres Quadrat; abgeschnitten werden vier rechtwinklige Dreiecke mit den Katheten x und 8 − x. A(x) = 64 − 4 · ½ · x · (8 − x) = 2x<sup>2</sup> − 16x + 64 = 2(x − 4)<sup>2</sup> + 32: Für x = 4 ist das innere Quadrat mit 32 cm² am kleinsten.</p>
    <p><strong>Typische Fehler:</strong> x nicht festlegen; den Bereich der sinnvollen x vergessen; x und den Extremwert verwechseln; ein Ergebnis angeben, das nicht im Bereich liegt; in der Antwort die Einheit vergessen.</p>
    <div class="merke"><strong>Merke:</strong> Variable festlegen, Term aufstellen, Bereich der sinnvollen x angeben, quadratisch ergänzen und im Sachzusammenhang antworten.</div>
  `,
  formulas: [
    { name: "Rechteck verändern", html: "A(x) = (l − x) · (b + kx)", quantities: "l, b alte Seiten; alle Seiten müssen positiv bleiben" },
    { name: "Zaun an einer Mauer", html: "A(x) = x · (L − 2x), am größten für x = L : 4", quantities: "L Zaunlänge, x Seite senkrecht zur Mauer" },
    { name: "Gleicher Umfang", html: "A(x) = x · (u : 2 − x), am größten für x = u : 4", quantities: "u Umfang; das beste Rechteck ist ein Quadrat" },
  ],
  quiz: {
    question: "Ein Gehege hat den Flächeninhalt A(x) = −2(x − 10)² + 200 (x in m, A in m²) mit x ∈ ]0; 20[. Was gilt?",
    options: ["Für x = 200 m ist A mit 10 m² am größten.", "Für x = 10 m ist A mit 200 m² am kleinsten.", "Für x = 10 m ist A mit 200 m² am größten.", "Für x = −10 m ist A mit 200 m² am größten."],
    correctIndex: 2,
    explanation: "a = −2 < 0: Das Quadrat (x − 10)² wird mit −2 multipliziert, A ist also höchstens 200. Das wird für x = 10 erreicht, weil das Quadrat dort null ist; 10 liegt in ]0; 20[.",
  },
  lab: {
    kind: "extremum-problem",
    title: "Labor: Das beste Rechteck",
    intro:
      "Wähle eine Situation und schiebe x oder ziehe einen der Punkte. Rechts siehst du den Flächeninhalt für viele x als Punkte. Erst selbst suchen, dann mit „Rechnung: zeigen“ die quadratische Ergänzung ansehen.",
    params: [
      {
        type: "choice",
        key: "mode",
        label: "Situation",
        options: [
          { value: 0, label: "Rechteck 8 cm × 5 cm verändern" },
          { value: 1, label: "40 m Zaun an einer Mauer" },
          { value: 2, label: "Inneres Quadrat im Quadrat" },
          { value: 3, label: "Rechtecke mit 20 cm Umfang" },
        ],
        value: 0,
      },
      { type: "range", key: "x", label: "x", unit: "", min: 0, max: 20, step: 0.25, value: 1, digits: 2 },
      {
        type: "choice",
        key: "show",
        label: "Rechnung",
        options: [
          { value: 0, label: "verdeckt" },
          { value: 1, label: "zeigen" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "sides", label: "Seiten", compute: (v) => extremumSides(v) },
      { key: "area", label: "Flächeninhalt", emphasis: true, compute: (v) => (inDomain(v) ? `${fmt(EXTREMUM_MODELS[v.mode].area(v.x), 4)} ${EXTREMUM_MODELS[v.mode].unit}²` : "keine Figur") },
      { key: "domain", label: "sinnvolle x", compute: (v) => `x ∈ ]0; ${EXTREMUM_MODELS[v.mode].upper}[` },
    ],
    goals: [
      {
        id: "maximum",
        text: "Rechteck 8 cm × 5 cm: Finde das x, für das das neue Rechteck den größten Flächeninhalt hat.",
        check: (v) => v.mode === 0 && v.x === EXTREMUM_MODELS[0].xBest,
      },
      {
        id: "gleich",
        text: "Für x = 1 hat das neue Rechteck 49 cm². Finde das zweite x mit genau 49 cm². Wo liegt es im Vergleich zum besten x?",
        check: (v) => v.mode === 0 && v.x !== 1 && inDomain(v) && Math.abs(EXTREMUM_MODELS[0].area(v.x) - 49) < 1e-9,
      },
      {
        id: "minimum",
        text: "Inneres Quadrat: Für welches x wird das innere Quadrat am kleinsten?",
        check: (v) => v.mode === 2 && v.x === EXTREMUM_MODELS[2].xBest,
      },
    ],
  },
  exercises: [
    {
      id: "rechteck",
      make: guarded((rng, level): ExerciseTask => {
        const inner = level === 2 && rng.next() < 0.35;
        if (inner) {
          const s = rng.pick([6, 8, 10, 12, 14, 16]);
          const xBest = s / 2;
          const best = (s * s) / 2;
          return {
            prompt: `Das Quadrat ABCD hat die Seitenlänge ${s} cm. Auf jeder Seite liegt ein Punkt, jeweils x cm von der vorhergehenden Ecke entfernt (A → B → C → D). Die vier Punkte bilden ein inneres Quadrat. Für welche x gibt es solche inneren Quadrate? Für welches x ist das innere Quadrat am kleinsten, und wie groß ist es dann?`,
            given: [`Seitenlänge ${s} cm`],
            fields: [
              numberField("obere Grenze der sinnvollen x:", s, "cm", 2, { slips: [{ value: s / 2, hint: "x darf so groß werden wie die Seite: Erst bei x = s fällt der Punkt in die nächste Ecke." }] }),
              numberField("x =", xBest, "cm", 2, { slips: [{ value: s, hint: "Bei der quadratischen Ergänzung wird die Zahl vor x halbiert." }] }),
              numberField("kleinster Flächeninhalt:", best, "cm²", 2, { slips: [{ value: s * s, hint: "Das ist das große Quadrat. Ziehe die vier Dreiecke ab." }, { value: (s * s) / 4, hint: "Jedes abgeschnittene Dreieck hat den Inhalt ½ · x · (s − x)." }] }),
            ],
            steps: [
              `Abgeschnitten werden vier rechtwinklige Dreiecke mit den Katheten x und ${s} − x; sinnvoll ist x ∈ ]0; ${s}[.`,
              `A(x) = ${s * s} − 4 · ½ · x · (${s} − x) = ${polyHtml([{ c: 2, m: X2 }, { c: -2 * s, m: X1 }, { c: s * s, m: X0 }])}`,
              `A(x) = 2[x<sup>2</sup> − ${s}x] + ${s * s} = 2[(x − ${fmt(xBest)})<sup>2</sup> − ${fmt(xBest * xBest)}] + ${s * s} = 2(x − ${fmt(xBest)})<sup>2</sup> + ${fmt(best)}`,
              `<strong>Für x = ${fmt(xBest)} cm ist das innere Quadrat am kleinsten: ${fmt(best)} cm², halb so groß wie das große Quadrat.</strong>`,
            ],
            meta: { inner: 1, s },
          };
        }
        let [L, B, k] = [8, 5, 2];
        do {
          [L, B, k] = [rng.int(6, 14), rng.int(2, 10), rng.pick([1, 2])];
        } while (k * L - B < 2 || B >= L);
        const xBest = (k * L - B) / (2 * k);
        const best = (k * L + B) ** 2 / (4 * k);
        const grow = k === 1 ? "x" : `${k}x`;
        const area = polyHtml([{ c: -k, m: X2 }, { c: k * L - B, m: X1 }, { c: L * B, m: X0 }]);
        const steps = [
          `A(x) = (${L} − x)(${B} + ${grow}) = ${L * B} + ${fmt(k * L)}x − ${B}x − ${k === 1 ? "" : k}x<sup>2</sup> = ${area}`,
          `A(x) = ${lead(-k)}[x<sup>2</sup> − ${fmt((k * L - B) / k)}x] + ${L * B} = ${lead(-k)}[(x − ${fmt(xBest)})<sup>2</sup> − ${fmt(xBest * xBest, 4)}] + ${L * B} = ${vertexForm(-k, xBest, best, 4).replace("²", "<sup>2</sup>")}`,
          `a = ${fmt(-k)} &lt; 0: größter Wert für x = ${fmt(xBest)}, und ${fmt(xBest)} liegt in ]0; ${L}[.`,
          `<strong>Für x = ${fmt(xBest)} cm ist der Flächeninhalt mit ${fmt(best, 4)} cm² am größten; das Rechteck ist dann ${fmt(L - xBest)} cm lang und ${fmt(B + k * xBest)} cm breit.</strong>`,
        ];
        const xField = numberField("x =", xBest, "cm", 2, {
          slips: [
            { value: k * L - B, hint: "Bei der quadratischen Ergänzung wird die Zahl vor x halbiert." },
            ...(k > 1 ? [{ value: (k * L - B) / 2, hint: `Klammere zuerst −${k} aus: Halbiert wird die Zahl vor x in der Klammer.` }] : []),
          ],
        });
        const bestField = numberField("größter Flächeninhalt:", best, "cm²", 3, { slips: [{ value: L * B, hint: "Das ist der alte Flächeninhalt (x = 0). Gesucht ist der Extremwert nach der quadratischen Ergänzung." }] });
        if (level === 1) {
          return {
            prompt: `Ein Rechteck ist ${L} cm lang und ${B} cm breit. Verkürzt man die Länge um x cm und verlängert die Breite um ${grow} cm, entstehen neue Rechtecke mit dem Flächeninhalt A(x) = (${L} − x)(${B} + ${grow}) cm². Für welches x ist der Flächeninhalt am größten, und wie groß ist er dann?`,
            given: [`A(x) = (${L} − x)(${B} + ${grow})`],
            formulaHint: "A(x) ausmultiplizieren, dann quadratisch ergänzen: A(x) = a(x − d)<sup>2</sup> + e",
            fields: [xField, bestField],
            steps,
            meta: { inner: 0, L, B, k },
          };
        }
        return {
          prompt: `Ein Rechteck ist ${L} cm lang und ${B} cm breit. Seine Länge wird um x cm verkürzt und seine Breite gleichzeitig um ${grow} cm verlängert. Stelle einen Term für den Flächeninhalt A(x) der neuen Rechtecke auf und gib an, für welche x es sie gibt. Für welches x ist der Flächeninhalt am größten, und wie groß ist er dann?`,
          given: [`Länge ${L} cm, Breite ${B} cm`],
          fields: [numberField("obere Grenze der sinnvollen x:", L, "cm", 2, { slips: [{ value: B, hint: `Die Breite wird länger und bleibt positiv; die Länge ${L} − x muss positiv bleiben.` }] }), xField, bestField],
          steps: [`Neue Seiten: (${L} − x) cm und (${B} + ${grow}) cm; positiv für 0 &lt; x &lt; ${L}, also x ∈ ]0; ${L}[.`, ...steps],
          meta: { inner: 0, L, B, k },
        };
      }),
    },
    {
      id: "zaun",
      make: guarded((rng, level): ExerciseTask => {
        const kind = level === 1 ? rng.int(0, 1) : rng.int(0, 2);
        if (kind === 0) {
          const L = rng.pick(WALL);
          const [xBest, y, best] = [L / 4, L / 2, (L * L) / 8];
          const what = rng.pick(["ein rechteckiges Beet an einer Hauswand", "ein rechteckiger Auslauf an einer Stallwand", "ein rechteckiger Spielbereich an einer Hallenwand"]);
          const steps = [
            `A(x) = x · (${L} − 2x) = ${polyHtml([{ c: -2, m: X2 }, { c: L, m: X1 }])}; sinnvoll ist x ∈ ]0; ${fmt(L / 2)}[`,
            `A(x) = −2[x<sup>2</sup> − ${fmt(L / 2)}x] = −2[(x − ${fmt(xBest)})<sup>2</sup> − ${fmt(xBest * xBest)}] = −2(x − ${fmt(xBest)})<sup>2</sup> + ${fmt(best)}`,
            `<strong>Für x = ${fmt(xBest)} m ist die Fläche am größten: Die Seite an der Wand ist ${fmt(y)} m lang, der Flächeninhalt ${fmt(best)} m².</strong>`,
          ];
          const fields = [
            numberField("x =", xBest, "m", 2, { slips: [{ value: L / 3, hint: "Gleich lange Zaunstücke sind hier nicht das Beste: Rechne mit der quadratischen Ergänzung." }, { value: L / 2, hint: "Bei der quadratischen Ergänzung wird die Zahl vor x halbiert, nachdem −2 ausgeklammert ist." }] }),
            numberField("größter Flächeninhalt:", best, "m²", 2, { slips: [{ value: (L * L) / 16, hint: "Das wäre ein Quadrat aus allen vier Seiten. An der Wand braucht es aber keinen Zaun." }] }),
          ];
          if (level === 1) {
            return {
              prompt: `Mit ${L} m Zaun wird ${what} eingefasst; an der Wand braucht es keinen Zaun. x ist die Länge der beiden Seiten senkrecht zur Wand, dann bleiben für die Seite an der Wand (${L} − 2x) m und A(x) = x · (${L} − 2x) m². Für welches x wird die Fläche am größten, und wie groß ist sie dann?`,
              given: [`A(x) = x · (${L} − 2x)`],
              formulaHint: "A(x) ausmultiplizieren, −2 ausklammern und quadratisch ergänzen",
              fields,
              steps,
              meta: { kind, L },
            };
          }
          return {
            prompt: `Mit ${L} m Zaun soll ${what} eingefasst werden; an der Wand braucht es keinen Zaun. Gib an, für welche Längen x der beiden Seiten senkrecht zur Wand das möglich ist. Für welches x wird die Fläche am größten, und wie groß ist sie dann?`,
            given: [`Zaunlänge ${L} m`],
            fields: [numberField("obere Grenze der sinnvollen x:", L / 2, "m", 2, { slips: [{ value: L, hint: "Zwei Seiten sind x lang: 2x muss kleiner als die Zaunlänge sein." }] }), ...fields],
            steps: [`Seite an der Wand: (${L} − 2x) m; sie ist positiv für x &lt; ${fmt(L / 2)}.`, ...steps],
            meta: { kind, L },
          };
        }
        if (kind === 1) {
          const U = rng.pick(PERIMETER);
          const [xBest, best] = [U / 4, (U * U) / 16];
          const what = rng.pick(["ein rechteckiges Gehege", "ein rechteckiges Gemüsebeet", "eine rechteckige Weide"]);
          const steps = [
            `Zwei Seiten zusammen sind ${fmt(U / 2)} m lang: A(x) = x · (${fmt(U / 2)} − x) = ${polyHtml([{ c: -1, m: X2 }, { c: U / 2, m: X1 }])}; sinnvoll ist x ∈ ]0; ${fmt(U / 2)}[`,
            `A(x) = −[x<sup>2</sup> − ${fmt(U / 2)}x] = −[(x − ${fmt(xBest)})<sup>2</sup> − ${fmt(xBest * xBest)}] = −(x − ${fmt(xBest)})<sup>2</sup> + ${fmt(best)}`,
            `<strong>Für x = ${fmt(xBest)} m ist die Fläche mit ${fmt(best)} m² am größten; dann sind beide Seiten ${fmt(xBest)} m lang: ein Quadrat.</strong>`,
          ];
          const fields = [
            numberField("x =", xBest, "m", 2, { slips: [{ value: U / 2, hint: "Halbiere bei der quadratischen Ergänzung die Zahl vor x." }] }),
            numberField("größter Flächeninhalt:", best, "m²", 2, { slips: [{ value: (U * U) / 4, hint: "Die beiden Seiten zusammen sind nur der halbe Umfang lang." }] }),
          ];
          if (level === 1) {
            return {
              prompt: `Mit ${U} m Zaun wird ${what} ringsum eingezäunt. Ist eine Seite x m lang, so ist die andere (${fmt(U / 2)} − x) m lang und A(x) = x · (${fmt(U / 2)} − x) m². Für welches x wird die Fläche am größten, und wie groß ist sie dann?`,
              given: [`A(x) = x · (${fmt(U / 2)} − x)`],
              formulaHint: "A(x) ausmultiplizieren, −1 ausklammern und quadratisch ergänzen",
              fields,
              steps,
              meta: { kind, U },
            };
          }
          return {
            prompt: `Mit ${U} m Zaun soll ${what} ringsum eingezäunt werden. x ist die Länge einer Seite. Gib an, für welche x das möglich ist. Für welches x wird die Fläche am größten, und wie groß ist sie dann? Welche Form hat das beste Rechteck?`,
            given: [`Zaunlänge ${U} m`],
            fields: [numberField("obere Grenze der sinnvollen x:", U / 2, "m", 2, { slips: [{ value: U, hint: "Zwei Seiten zusammen sind der halbe Umfang: x muss kleiner als die Hälfte sein." }] }), ...fields],
            steps: [`Der halbe Umfang ist ${fmt(U / 2)} m, die andere Seite also (${fmt(U / 2)} − x) m.`, ...steps],
            meta: { kind, U },
          };
        }
        // a wall and a divider: 3x + y = L
        const L = rng.pick(DIVIDER);
        const [xBest, y, best] = [L / 6, L / 2, (L * L) / 12];
        return {
          prompt: `Ein rechteckiger Auslauf an einer Stallwand wird mit ${L} m Zaun eingefasst und durch ein Zaunstück senkrecht zur Wand in zwei Teile geteilt; an der Wand braucht es keinen Zaun. x ist die Länge der drei Zaunstücke senkrecht zur Wand. Für welche x ist das möglich? Für welches x ist der Auslauf am größten, und wie groß ist er dann?`,
          given: [`Zaunlänge ${L} m`, "drei Stücke senkrecht zur Wand"],
          fields: [
            numberField("obere Grenze der sinnvollen x:", L / 3, "m", 2, { slips: [{ value: L / 2, hint: "Es gibt drei Zaunstücke der Länge x: 3x muss kleiner als die Zaunlänge sein." }] }),
            numberField("x =", xBest, "m", 2, { slips: [{ value: L / 4, hint: "Drei Stücke senkrecht zur Wand, nicht zwei: A(x) = x · (L − 3x)." }] }),
            numberField("größter Flächeninhalt:", best, "m²", 2, { slips: [{ value: (L * L) / 8, hint: "Das gilt ohne Trennzaun. Hier sind es drei Stücke der Länge x." }] }),
          ],
          steps: [
            `Seite an der Wand: (${L} − 3x) m, positiv für x &lt; ${fmt(L / 3)}; also x ∈ ]0; ${fmt(L / 3)}[.`,
            `A(x) = x · (${L} − 3x) = ${polyHtml([{ c: -3, m: X2 }, { c: L, m: X1 }])} = −3[x<sup>2</sup> − ${fmt(L / 3)}x] = −3[(x − ${fmt(xBest)})<sup>2</sup> − ${fmt(xBest * xBest)}] = −3(x − ${fmt(xBest)})<sup>2</sup> + ${fmt(best)}`,
            `<strong>Für x = ${fmt(xBest)} m ist der Auslauf mit ${fmt(best)} m² am größten; die Seite an der Wand ist dann ${fmt(y)} m lang.</strong>`,
          ],
          meta: { kind, L },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Term aufstellen, sinnvolle x angeben, ergänzen, antworten: Du löst Extremwertprobleme vollständig.",
};

// 4.7 Gleichungen mit Klammern und binomischen Formeln ──────────────────────────

/** "(x + 3)<sup>2</sup>" or "x<sup>2</sup>". */
const sqHtml = (p: number) => (p === 0 ? "x<sup>2</sup>" : `(${plusText("x", p)})<sup>2</sup>`);

/** "(x + 1)(x − 2)", "x(x + 2)". */
function prodHtml(q: number, r: number): string {
  if (r === 0) return `x(${plusText("x", q)})`;
  if (q === 0) return `x(${plusText("x", r)})`;
  return `(${plusText("x", q)})(${plusText("x", r)})`;
}

/** A solution x₀ = j / den whose decimal ends, den dividing A, so the given numbers stay whole. */
function niceSolution(rng: Rng, A: number, range = 12): number {
  const dens = [1, 2, 4, 5].filter((den) => A % den === 0);
  const den = rng.pick(dens);
  let j = rng.int(-range, range);
  if (den > 1) while (j % den === 0) j = rng.int(-range, range);
  return j / den;
}

/** "| − 7" or "| + 7" for moving the number k to the other side; empty for 0. */
const moveHtml = (k: number) => (k === 0 ? "" : k > 0 ? `   | − ${fmt(k)}` : `   | + ${fmt(-k)}`);

/** The steps from A · x = B to the solution, or to the true or false statement. */
function reducedSteps(A: number, B: number): string[] {
  if (A === 0) return [`0 · x = ${fmt(B)}`, B === 0 ? "0 = 0 ist für jedes x wahr: allgemeingültig" : `0 = ${fmt(B)} ist falsch: keine Lösung`];
  return [`${monoHtml(A, X1)} = ${fmt(B)}${A === 1 ? "" : `   | : ${paren(A)}`}`, `x = ${solutionText(B, A)}`];
}

/** " + 3k", " − k": q · k after another term. */
const kTerm = (q: number) => (q === 1 ? " + k" : q === -1 ? ` ${MINUS} k` : `${signed(q)}k`);

/** "k", "−k", "3k": q · k on its own. */
const kMono = (q: number) => (q === 1 ? "k" : q === -1 ? `${MINUS}k` : `${fmt(q)}k`);

const CASES = ["genau eine Lösung", "keine Lösung", "unendlich viele Lösungen (allgemeingültig)"];

const gleichungen: Lesson = {
  id: "tg-7-gleichungen",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "4.7 Gleichungen mit Klammern und binomischen Formeln",
  subtitle: "Erst vereinfachen, dann umformen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Lineare Gleichungen`,
  whyItMatters:
    "Wer Flächen vergleicht oder Rechtecke verändert, landet bei Gleichungen mit Klammern und Quadraten, in denen sich x² am Ende aufhebt. Solche Gleichungen sicher und mit Probe zu lösen, ist das Werkzeug für die Text- und Sachaufgaben der nächsten Lektion.",
  explanationHtml: `
    <p>Eine Gleichung löst du mit <strong>Äquivalenzumformungen</strong> (Wiederholung aus M7): Auf beiden Seiten darfst du dieselbe Zahl oder denselben Term addieren oder subtrahieren, und du darfst beide Seiten mit derselben Zahl ungleich 0 multiplizieren oder durch sie dividieren. Die Lösungsmenge bleibt dabei gleich. <strong>Mit 0 multiplizieren ist keine Äquivalenzumformung:</strong> Aus 2x = 6 würde 0 = 0, und plötzlich wäre jede Zahl eine „Lösung“. Durch 0 dividieren ist gar nicht erlaubt.</p>
    <p>Stehen Klammern, Produkte von Summen oder binomische Formeln in der Gleichung, vereinfachst du zuerst beide Seiten. Oft heben sich die x<sup>2</sup>-Glieder dabei auf, und es bleibt eine lineare Gleichung.</p>
    <div class="example"><strong>Beispiel:</strong> (x + 3)<sup>2</sup> − (x − 1)(x + 2) = 5<br>
      1. Binomische Formel und Produkt, das Produkt in Klammern: x<sup>2</sup> + 6x + 9 − (x<sup>2</sup> + x − 2) = 5<br>
      2. Minusklammer auflösen: x<sup>2</sup> + 6x + 9 − x<sup>2</sup> − x + 2 = 5<br>
      3. Zusammenfassen, x<sup>2</sup> fällt weg: 5x + 11 = 5   | − 11<br>
      4. 5x = −6   | : 5<br>
      5. x = −1,2, also L = {−1,2}<br>
      Probe in der Ausgangsgleichung: (1,8)<sup>2</sup> − (−2,2) · 0,8 = 3,24 + 1,76 = 5</div>
    <p><strong>Drei Lösungsfälle:</strong> Am Ende steht eine Gleichung der Form a · x = b.</p>
    <table class="mini">
      <tr><th>reduzierte Form</th><th>Lösungsmenge</th><th>Beispiel</th></tr>
      <tr><td>a ≠ 0</td><td>genau eine Lösung x = b : a</td><td>5x = −6: L = {−1,2}</td></tr>
      <tr><td>a = 0, b ≠ 0</td><td>keine Lösung: L = { }</td><td>0 · x = 7, also 0 = 7: falsch</td></tr>
      <tr><td>a = 0, b = 0</td><td>allgemeingültig: L = G</td><td>0 · x = 0, also 0 = 0: wahr</td></tr>
    </table>
    <p>Ein Beispiel für allgemeingültig: 3(2x − 5) − 4(x + 2) = 2x − 23 ⇔ 6x − 15 − 4x − 8 = 2x − 23 ⇔ 2x − 23 = 2x − 23 ⇔ 0 = 0. Jede Zahl erfüllt die Gleichung: L = ℚ.</p>
    <p><strong>Grundmenge:</strong> L enthält nur Zahlen aus der Grundmenge G. Über G = ℚ ist im Beispiel oben L = {−1,2}; über G = ℤ oder G = ℕ = {1; 2; 3; …} ist −1,2 nicht erlaubt, dann ist L = { }.</p>
    <p><strong>Probe:</strong> Setze die Lösung in die Ausgangsgleichung ein, nicht in eine umgeformte. Nur so findest du Fehler beim Umformen.</p>
    <p><strong>Typische Fehler:</strong> das Minus vor einem Produkt falsch auflösen: −(x − 1)(x + 2) = −(x<sup>2</sup> + x − 2) = −x<sup>2</sup> − x + 2, nicht −x<sup>2</sup> + x − 2; x<sup>2</sup> stehen lassen, obwohl es sich aufhebt; durch einen Ausdruck teilen, der 0 sein kann: In (5 − k) · x = 3 darfst du nur für k ≠ 5 durch 5 − k teilen, für k = 5 steht 0 = 3 da.</p>
    <div class="merke"><strong>Merke:</strong> Erst beide Seiten vereinfachen, dann mit Äquivalenzumformungen zu a · x = b. a ≠ 0: genau eine Lösung; a = 0 und b ≠ 0: keine Lösung; a = 0 und b = 0: allgemeingültig. Nie mit 0 multiplizieren, nie durch 0 teilen.</div>
  `,
  formulas: [
    { name: "Äquivalenz­umformungen", html: "T<sub>1</sub> = T<sub>2</sub> ⇔ T<sub>1</sub> + c = T<sub>2</sub> + c; T<sub>1</sub> = T<sub>2</sub> ⇔ c · T<sub>1</sub> = c · T<sub>2</sub> für c ≠ 0", quantities: "auf beiden Seiten dasselbe; nie mit 0 multiplizieren" },
    { name: "Lösungsfälle", html: "a · x = b", quantities: "a ≠ 0: x = b : a; a = 0 und b ≠ 0: L = { }; a = 0 und b = 0: L = G" },
    { name: "Minus vor einem Produkt", html: "−(x − 1)(x + 2) = −(x<sup>2</sup> + x − 2) = −x<sup>2</sup> − x + 2", quantities: "erst ausmultiplizieren, dann jedes Vorzeichen umdrehen" },
  ],
  quiz: {
    question: "Welche Lösungsmenge hat (x + 2)² − x(x + 4) = 4 über G = ℚ?",
    options: ["L = { }", "L = {0}", "L = ℚ", "L = {4}"],
    correctIndex: 2,
    explanation: "(x + 2)² − x(x + 4) = x² + 4x + 4 − x² − 4x = 4. Es bleibt 4 = 4, eine wahre Aussage für jedes x: Die Gleichung ist allgemeingültig, L = ℚ. Bei L = {0} hätte man nur eine einzige Probe gemacht.",
  },
  lab: {
    kind: "linear-equation",
    title: "Labor: Der Gleichungsbaukasten",
    intro:
      "Die Gleichung (x + p)² − (x + q)(x + r) = k wird Schritt für Schritt vereinfacht; die x²-Glieder heben sich auf. Ändere p, q, r und k und beobachte, wann es genau eine, keine oder unendlich viele Lösungen gibt. Die Grundmenge entscheidet mit, was in L steht.",
    params: [
      { type: "range", key: "p", label: "p", unit: "", min: -5, max: 5, step: 1, value: 3 },
      { type: "range", key: "q", label: "q", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "r", label: "r", unit: "", min: -5, max: 5, step: 1, value: 2 },
      { type: "range", key: "k", label: "k (rechte Seite)", unit: "", min: -10, max: 20, step: 1, value: 0 },
      { type: "choice", key: "G", label: "Grundmenge", options: GRUNDMENGEN.map((g, i) => ({ value: i, label: i === 2 ? "ℕ = {1; 2; 3; …}" : g })), value: 0 },
    ],
    readouts: [
      { key: "reduced", label: "vereinfacht", compute: (v) => { const c = equationCase(v); return `${c.A === 0 ? "0 · x" : sum([[c.A, "x"]])} = ${fmt(c.B)}`; } },
      { key: "case", label: "Lösungsfall", emphasis: true, compute: (v) => CASES[equationCase(v).kind] },
      { key: "set", label: "Lösungsmenge", compute: (v) => equationSolutionSet(v) },
    ],
    goals: [
      { id: "keine", text: "Stelle die Gleichung so ein, dass sie keine Lösung hat. Was steht am Ende da?", check: (v) => equationCase(v).kind === 1 },
      { id: "alle", text: "Stelle die Gleichung so ein, dass jede Zahl eine Lösung ist (allgemeingültig).", check: (v) => equationCase(v).kind === 2 },
      {
        id: "grundmenge",
        text: "Wähle G = ℕ und finde eine Gleichung, die über ℚ genau eine Lösung hätte, deren Lösungsmenge über ℕ aber leer ist.",
        check: (v) => v.G === 2 && equationCase(v).kind === 0 && !inGrundmenge(equationCase(v).x0, 2),
      },
    ],
  },
  exercises: [
    {
      id: "gleichung",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const s = rng.next() < 0.7 ? 1 : -1;
          let [p, q, r, A] = [1, 1, 1, 0];
          do {
            [p, q, r] = [nonZero(rng, 6), nonZero(rng, 6), nonZero(rng, 6)];
            A = s * (2 * p - q - r);
          } while (A === 0 || Math.abs(A) > 10 || q === r);
          const rest = s * (p * p - q * r);
          const x0 = niceSolution(rng, A);
          const k = A * x0 + rest;
          const sq = polyMul(lin(1, p), lin(1, p));
          const prod = polyMul(lin(1, q), lin(1, r));
          const shown = s === 1 ? `${sqHtml(p)} − ${prodHtml(q, r)} = ${fmt(k)}` : `${prodHtml(q, r)} − ${sqHtml(p)} = ${fmt(k)}`;
          const expanded = s === 1 ? `${polyHtml(sq)} − (${polyHtml(prod)})` : `${polyHtml(prod)} − (${polyHtml(sq)})`;
          const opened = s === 1 ? polyHtml([...sq, ...polyScale(prod, -1)], false) : polyHtml([...prod, ...polyScale(sq, -1)], false);
          // The slip of a minus that turns only the x² term of what stands behind it:
          // behind the minus stands the product (s = 1) or the square (s = −1).
          const wrongA = 2 * p + q + r;
          const wrongRest = p * p + q * r;
          const behind = s === 1 ? "im ausmultiplizierten Produkt" : "in der ausmultiplizierten Klammer";
          const leftAt = (x: number) => (s === 1 ? (x + p) ** 2 - (x + q) * (x + r) : (x + q) * (x + r) - (x + p) ** 2);
          return {
            prompt: `Löse die Gleichung über G = ℚ: ${shown}. Vereinfache dazu zuerst die linke Seite zu □x + □.`,
            given: [shown],
            formulaHint: "(a ± b)<sup>2</sup> = a<sup>2</sup> ± 2ab + b<sup>2</sup>; Minus vor einer Klammer: erst ausmultiplizieren, Ergebnis in Klammern, dann jedes Vorzeichen umdrehen",
            fields: [
              intField("linke Seite: Zahl vor x", A, [{ value: wrongA, hint: `Das Minus vor der Klammer gilt für jedes Glied ${behind}: Auch das x-Glied ändert sein Vorzeichen.` }]),
              intField("linke Seite: Zahl ohne x", rest, [{ value: wrongRest, hint: `Das Minus vor der Klammer gilt auch für die Zahl ${behind}.` }]),
              numberField("x =", x0, "", 2, { slips: wrongA !== 0 ? [{ value: (k - rest) / wrongA, hint: `Prüfe die Minusklammer: Jedes Glied ${behind} ändert sein Vorzeichen.` }] : [] }),
            ],
            steps: [
              `Ausmultiplizieren: ${expanded} = ${fmt(k)}`,
              `Minusklammer auflösen: ${opened} = ${fmt(k)}`,
              `x<sup>2</sup> − x<sup>2</sup> = 0: ${polyHtml(lin(A, rest))} = ${fmt(k)}${moveHtml(rest)}`,
              ...reducedSteps(A, k - rest).slice(0, 1),
              `Probe: linke Seite für x = ${fmt(x0)} ergibt ${fmt(leftAt(x0), 4)} = ${fmt(k)}`,
              `<strong>x = ${fmt(x0)}, also L = {${fmt(x0)}}</strong>`,
            ],
            meta: { variant: 0, s, p, q, r, k, x0 },
          };
        }
        const variant = rng.int(0, 2);
        if (variant <= 1) {
          const a = rng.int(1, 3);
          let [p, q, A] = [1, 1, 0];
          do {
            [p, q] = [nonZero(rng, 6), nonZero(rng, 6)];
            A = variant === 0 ? 2 * a * (p + q) : 2 * a * p;
          } while (A === 0);
          const x0 = niceSolution(rng, A, 10);
          const ax = (k: number) => linHtml(a, k);
          let shown: string;
          let k: number;
          let steps: string[];
          if (variant === 0) {
            // (ax + p)² = (ax − q)² + k
            k = A * x0 + p * p - q * q;
            const left = polyMul(lin(a, p), lin(a, p));
            const right = polyMul(lin(a, -q), lin(a, -q));
            shown = `${ax(p)}<sup>2</sup> = ${ax(-q)}<sup>2</sup>${signed(k)}`;
            steps = [
              `Binomische Formeln auf beiden Seiten: ${polyHtml(left)} = ${polyHtml(right)}${signed(k)}`,
              `${a * a === 1 ? "" : a * a}x<sup>2</sup> auf beiden Seiten abziehen und die x-Glieder nach links: ${monoHtml(A, X1)} = ${fmt(q * q + k - p * p)}`,
            ];
          } else {
            // (ax + p)² − (ax + q)(ax − q) = k
            k = A * x0 + p * p + q * q;
            shown = `${ax(p)}<sup>2</sup> − ${ax(q)}${ax(-q)} = ${fmt(k)}`;
            steps = [
              `1. und 3. binomische Formel: ${polyHtml(polyMul(lin(a, p), lin(a, p)))} − (${polyHtml([{ c: a * a, m: X2 }, { c: -q * q, m: X0 }])}) = ${fmt(k)}`,
              `Minusklammer auflösen, x<sup>2</sup> fällt weg: ${polyHtml(lin(A, p * p + q * q))} = ${fmt(k)}${moveHtml(p * p + q * q)}`,
            ];
          }
          const B = variant === 0 ? q * q + k - p * p : k - p * p - q * q;
          return {
            prompt: `Löse die Gleichung über G = ℚ und mache die Probe: ${shown}`,
            given: [shown],
            fields: [
              numberField("x =", x0, "", 2, {
                slips: [
                  { value: B / (A / 2), hint: "Das Mischglied heißt 2ab: Die 2 nicht vergessen." },
                  ...(variant === 0 ? [{ value: (k - p * p - q * q) / A, hint: "(a − b)² = a² − 2ab + b²: b² ist immer positiv." }] : [{ value: (k - p * p + q * q) / A, hint: "Minus vor dem Produkt: −(a² − b²) = −a² + b²." }]),
                ],
              }),
            ],
            steps: [...steps, ...reducedSteps(A, B).slice(0, 1), `<strong>x = ${fmt(x0)}, also L = {${fmt(x0)}}</strong>`],
            meta: { variant: variant + 1, a, p, q, k, x0 },
          };
        }
        // a Grundmenge other than ℚ
        const G = rng.pick([1, 2]);
        let [p, q, r, A] = [1, 1, 1, 0];
        do {
          [p, q, r] = [nonZero(rng, 6), nonZero(rng, 6), nonZero(rng, 6)];
          A = 2 * p - q - r;
        } while (A === 0 || Math.abs(A) > 10 || q === r);
        const wantIn = rng.next() < 0.5;
        let x0 = niceSolution(rng, A, 12);
        for (let tries = 0; tries < 40 && inGrundmenge(x0, G) !== wantIn; tries++) x0 = wantIn ? (G === 2 ? rng.int(1, 9) : rng.int(-8, 8)) : niceSolution(rng, A, 12);
        const isIn = inGrundmenge(x0, G);
        const rest = p * p - q * r;
        const k = A * x0 + rest;
        const shown = `${sqHtml(p)} − ${prodHtml(q, r)} = ${fmt(k)}`;
        const Gname = G === 1 ? "ℤ" : "ℕ";
        return {
          prompt: `Löse die Gleichung ${shown} und gib die Lösungsmenge über der Grundmenge G = ${Gname} an.`,
          given: [shown, `G = ${Gname}`],
          fields: [
            numberField("Lösung in ℚ: x =", x0, "", 2),
            choiceField(`Lösungsmenge über G = ${Gname}:`, [`L = {${fmt(x0)}}`, "L = { }"], isIn ? 0 : 1),
          ],
          steps: [
            `${polyHtml(polyMul(lin(1, p), lin(1, p)))} − (${polyHtml(polyMul(lin(1, q), lin(1, r)))}) = ${fmt(k)}`,
            `${polyHtml(lin(A, rest))} = ${fmt(k)}${moveHtml(rest)}`,
            ...reducedSteps(A, k - rest),
            `<strong>x = ${fmt(x0)} ${isIn ? "∈" : "∉"} ${Gname}, also L = ${isIn ? `{${fmt(x0)}}` : "{ }"}</strong>`,
          ],
          meta: { variant: 3, G, p, q, r, k, x0 },
        };
      }),
    },
    {
      id: "loesungsfall",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          if (rng.next() < 0.5) {
            // (x + p)² − (x + q)(x + r) = k
            let [p, q, r] = [1, 1, 1];
            do {
              [p, q] = [nonZero(rng, 6), nonZero(rng, 6)];
              r = kind === 0 ? nonZero(rng, 6) : 2 * p - q;
            } while (r === 0 || q === r || Math.abs(r) > 9 || (kind === 0 && 2 * p - q - r === 0));
            const rest = p * p - q * r;
            const k = kind === 2 ? rest : kind === 1 ? rest + nonZero(rng, 6) : rng.int(-10, 20);
            const [A, B] = [2 * p - q - r, k - rest];
            const shown = `${sqHtml(p)} − ${prodHtml(q, r)} = ${fmt(k)}`;
            return {
              prompt: `Vereinfache die Gleichung ${shown} zur Form a · x = b (x-Glieder links, Zahlen rechts) und entscheide, wie viele Lösungen sie über G = ℚ hat.`,
              given: [shown],
              formulaHint: "a ≠ 0: genau eine Lösung; a = 0 und b ≠ 0: keine Lösung; a = 0 und b = 0: allgemeingültig",
              fields: [intField("a =", A, [{ value: 2 * p + q + r, hint: "Minus vor dem Produkt: Auch das x-Glied des Produkts ändert sein Vorzeichen." }]), intField("b =", B, [{ value: k + rest, hint: "Die Zahl ohne x wird auf die rechte Seite gebracht: Ihr Vorzeichen ändert sich." }]), choiceField("Lösungsfall:", CASES, kind)],
              steps: [
                `${polyHtml(polyMul(lin(1, p), lin(1, p)))} − (${polyHtml(polyMul(lin(1, q), lin(1, r)))}) = ${fmt(k)}`,
                `${A === 0 ? `0 · x${signed(rest)}` : polyHtml(lin(A, rest))} = ${fmt(k)}${moveHtml(rest)}`,
                ...reducedSteps(A, B),
                `<strong>a = ${fmt(A)}, b = ${fmt(B)}: ${CASES[kind]}</strong>`,
              ],
              meta: { tpl: 0, kind, p, q, r, k, A, B },
            };
          }
          // m(ax + b) − n(cx + d) = e · x + f, as in the old card
          const [m, n] = [rng.int(2, 5), rng.int(2, 5)];
          const [a, c] = [rng.int(1, 3), rng.int(1, 3)];
          const [b, d] = [nonZero(rng, 6), nonZero(rng, 6)];
          const slope = m * a - n * c;
          let e = slope;
          if (kind === 0) while (e === slope) e = rng.int(-4, 6);
          const constant = m * b - n * d;
          const f = kind === 2 ? constant : kind === 1 ? constant + nonZero(rng, 9) : rng.int(-20, 20);
          const [A, B] = [slope - e, f - constant];
          const right = e === 0 ? fmt(f) : polyHtml(lin(e, f));
          const shown = `${m}${linHtml(a, b)} − ${n}${linHtml(c, d)} = ${right}`;
          return {
            prompt: `Vereinfache die Gleichung ${shown} zur Form a · x = b (x-Glieder links, Zahlen rechts) und entscheide, wie viele Lösungen sie über G = ℚ hat.`,
            given: [shown],
            formulaHint: "a ≠ 0: genau eine Lösung; a = 0 und b ≠ 0: keine Lösung; a = 0 und b = 0: allgemeingültig",
            fields: [intField("a =", A, [{ value: m * a + n * c - e, hint: "Minus vor der zweiten Klammer: Auch ihr x-Glied ändert sein Vorzeichen." }]), intField("b =", B, [{ value: f - m * b - n * d, hint: "Minus vor der zweiten Klammer: Auch die Zahl darin ändert ihr Vorzeichen." }]), choiceField("Lösungsfall:", CASES, kind)],
            steps: [
              `Klammern auflösen: ${polyHtml([{ c: m * a, m: X1 }, { c: m * b, m: X0 }, { c: -n * c, m: X1 }, { c: -n * d, m: X0 }], false)} = ${right}`,
              `Zusammenfassen: ${slope === 0 ? `0 · x${constant === 0 ? "" : signed(constant)}` : polyHtml(lin(slope, constant))} = ${right}`,
              ...reducedSteps(A, B),
              `<strong>a = ${fmt(A)}, b = ${fmt(B)}: ${CASES[kind]}</strong>`,
            ],
            meta: { tpl: 1, kind, m, a, b, n, c, d, e, f, A, B },
          };
        }
        // Level 2: a parameter decides the case.
        const variant = rng.int(0, 2);
        let [p, q] = [1, 1];
        // p ≠ q: otherwise (x + p)² − (x + p)(x + k) hides the task in a common factor.
        do {
          [p, q] = [nonZero(rng, 5), nonZero(rng, 5)];
        } while (q === -2 || p === q || 2 * p - q === 0 || Math.abs(2 * p - q) > 9);
        const kStar = 2 * p - q;
        const xCoef = `${fmt(2 * p - q)} − k`;
        if (variant === 0) {
          let c = rng.int(-10, 20);
          while (c === (p - q) ** 2) c = rng.int(-10, 20);
          const shown = `${sqHtml(p)} − (${plusText("x", q)})(x + k) = ${fmt(c)}`;
          return {
            prompt: `Für welchen Wert des Parameters k hat die Gleichung ${shown} keine Lösung? Begründe mit der Form a · x = b.`,
            given: [shown],
            fields: [intField("k =", kStar, [{ value: -kStar, hint: `Prüfe das Vorzeichen: Die Zahl vor x ist ${xCoef}.` }, { value: 2 * p + q, hint: `Das Minus vor dem Produkt gilt auch für das Glied ${monoHtml(q, X1)}.` }])],
            steps: [
              `${polyHtml(polyMul(lin(1, p), lin(1, p)))} − (${polyHtml([{ c: 1, m: X2 }, { c: q, m: X1 }])} + kx${kTerm(q)}) = ${fmt(c)}`,
              `(${fmt(2 * p - q)} − k) · x = ${fmt(c - p * p)}${kTerm(q)}`,
              `Keine Lösung gibt es nur, wenn die Zahl vor x null ist: ${fmt(2 * p - q)} − k = 0, also k = ${fmt(kStar)}. Dann steht rechts ${fmt(c - p * p + q * kStar)} ≠ 0, also 0 = ${fmt(c - p * p + q * kStar)}: falsch.`,
              `<strong>Für k = ${fmt(kStar)} hat die Gleichung keine Lösung.</strong>`,
            ],
            meta: { variant, p, q, c, k: kStar },
          };
        }
        if (variant === 1) {
          const c = (p - q) ** 2;
          const shown = `${sqHtml(p)} − (${plusText("x", q)})(x + k) = c`;
          return {
            prompt: `Bestimme die Parameter k und c so, dass die Gleichung ${shown} allgemeingültig ist.`,
            given: [shown],
            fields: [intField("k =", kStar, [{ value: -kStar, hint: `Prüfe das Vorzeichen: Die Zahl vor x ist ${xCoef}.` }]), intField("c =", c, [{ value: p * p, hint: `Auch das Produkt liefert eine Zahl ohne x: ${kMono(q)}.` }])],
            steps: [
              `${polyHtml(polyMul(lin(1, p), lin(1, p)))} − (${polyHtml([{ c: 1, m: X2 }, { c: q, m: X1 }])} + kx${kTerm(q)}) = c`,
              `(${fmt(2 * p - q)} − k) · x = c − ${fmt(p * p)}${kTerm(q)}`,
              `Allgemeingültig heißt 0 · x = 0: k = ${fmt(kStar)} und c = ${fmt(p * p)}${signed(-q * kStar)} = ${fmt(c)}.`,
              `<strong>k = ${fmt(kStar)} und c = ${fmt(c)}</strong>`,
            ],
            meta: { variant, p, q, c, k: kStar },
          };
        }
        // The parameter that gives the solution x = s. For x = −q the factor
        // (x + q) is 0 and every k would fit, so that x is never asked.
        const x1 = rng.pick([-3, -2, -1, 1, 2, 3, 4].filter((n) => n + q !== 0));
        let k = nonZero(rng, 6);
        while (2 * p - q - k === 0) k = nonZero(rng, 6);
        const c = (2 * p - q - k) * x1 + p * p - q * k;
        const shown = `${sqHtml(p)} − (${plusText("x", q)})(x + k) = ${fmt(c)}`;
        return {
          prompt: `Für welchen Wert des Parameters k hat die Gleichung ${shown} die Lösung x = ${fmt(x1)}?`,
          given: [shown, `x = ${fmt(x1)}`],
          fields: [intField("k =", k, [{ value: -k, hint: "Prüfe das Vorzeichen beim Auflösen nach k." }])],
          steps: [
            `x = ${fmt(x1)} einsetzen: ${paren(x1 + p)}<sup>2</sup> − ${paren(x1 + q)} · (${fmt(x1)} + k) = ${fmt(c)}`,
            `${fmt((x1 + p) ** 2)}${signed(-(x1 + q) * x1)}${kTerm(-(x1 + q))} = ${fmt(c)}, also ${kMono(-(x1 + q))} = ${fmt(c - (x1 + p) ** 2 + (x1 + q) * x1)}`,
            `<strong>k = ${fmt(k)}</strong>; Probe: Mit k = ${fmt(k)} ergibt x = ${fmt(x1)} links ${fmt((x1 + p) ** 2 - (x1 + q) * (x1 + k))} = ${fmt(c)}.`,
          ],
          meta: { variant, p, q, c, k, x1 },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Ausmultiplizieren, x² streichen, umformen, Probe: Du löst Gleichungen mit Klammern und erkennst jeden Lösungsfall.",
};

// 4.8 Text- und Sachaufgaben ──────────────────────────────────────────────────

/** Rectangles d cm longer than wide whose area stays when the width grows by m and the length shrinks by n. */
const RECT_SETS: Array<[number, number, number, number]> = [];
for (let d = 3; d <= 12; d++) {
  for (let m = 1; m <= 5; m++) {
    for (let n = m + 1; n < d; n++) {
      const x = (m * (d - n)) / (n - m);
      if (Number.isInteger(x) && x >= 2 && x <= 20) RECT_SETS.push([d, m, n, x]);
    }
  }
}

/** A cyclist (v1) and a motor scooter (v2, at most 45 km/h) that starts Δ hours later: catching-up times with short decimals. */
const CHASES: Array<[number, number, number, number]> = [];
for (const v1 of [12, 15, 16, 18, 20]) {
  for (const v2 of [24, 25, 30, 32, 36, 40, 45]) {
    for (const delta of [0.5, 1, 1.5, 2]) {
      const t = (v2 * delta) / (v2 - v1);
      if (t <= 4 && Math.abs(t * 100 - Math.round(t * 100)) < 1e-9 && Math.abs(v1 * t * 100 - Math.round(v1 * t * 100)) < 1e-9) CHASES.push([v1, v2, delta, t]);
    }
  }
}

/** Juice mixtures: m₁ litres with p₁ %, how much with p₂ % gives p %. */
const MIXES: Array<[number, number, number, number, number]> = [];
for (const p1 of [10, 20, 25, 30, 40]) {
  for (const p2 of [50, 60, 70, 80, 90, 100]) {
    for (let p = p1 + 5; p < p2; p += 5) {
      for (const m1 of [1, 2, 3, 4, 5, 6]) {
        const x = (m1 * (p - p1)) / (p2 - p);
        if (x >= 0.5 && x <= 12 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-9) MIXES.push([p1, p2, p, m1, x]);
      }
    }
  }
}

const sachaufgaben: Lesson = {
  id: "tg-8-sachaufgaben",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "4.8 Text- und Sachaufgaben",
  subtitle: "Variable festlegen, Gleichung aufstellen, Probe am Text",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Text- und Sachaufgaben`,
  whyItMatters:
    "In der Abschlussprüfung steht die Gleichung nicht da, sie steckt im Text: in einem veränderten Rechteck, in einer Altersangabe oder in einer Verfolgungsfahrt. Wer sie selbst aufstellt und am Text prüft, löst solche Aufgaben sicher.",
  explanationHtml: `
    <p>Eine Text- oder Sachaufgabe löst du in festen Schritten:</p>
    <ol>
      <li><strong>Variable festlegen:</strong> „x sei …“ mit Einheit, zum Beispiel „x sei die Breite des Rechtecks in cm“.</li>
      <li><strong>Gleichung aufstellen:</strong> Übersetze den Text Satz für Satz in Terme und setze gleich, was gleich sein soll.</li>
      <li><strong>Gleichung lösen</strong> mit Äquivalenzumformungen.</li>
      <li><strong>Probe am Text:</strong> Prüfe die Lösung mit den Angaben der Aufgabe, nicht mit deiner Gleichung. War die Gleichung falsch aufgestellt, merkst du es nur so.</li>
      <li><strong>Antwortsatz</strong> mit Einheit. Passt die Antwort zur Situation? Längen sind positiv, Personenzahlen ganz.</li>
    </ol>
    <div class="example"><strong>Beispiel (Geometrie):</strong> Ein Rechteck ist 8 cm länger als breit. Verlängert man die Breite um 2 cm und verkürzt die Länge um 3 cm, bleibt der Flächeninhalt gleich. Wie lang sind die Seiten?<br>
      x sei die Breite in cm; dann ist die Länge (x + 8) cm.<br>
      Neue Seiten: (x + 2) cm und (x + 8 − 3) cm = (x + 5) cm.<br>
      Gleichung: x · (x + 8) = (x + 2)(x + 5)<br>
      x<sup>2</sup> + 8x = x<sup>2</sup> + 7x + 10   | − x<sup>2</sup> − 7x<br>
      x = 10<br>
      Probe am Text: altes Rechteck 10 cm · 18 cm = 180 cm², neues 12 cm · 15 cm = 180 cm².<br>
      Antwort: Das Rechteck ist 10 cm breit und 18 cm lang.</div>
    <p><strong>Weitere Zusammenhänge:</strong></p>
    <ul>
      <li><strong>Zahlenrätsel:</strong> „Das Produkt zweier aufeinanderfolgender Zahlen ist um 41 größer als das Quadrat der kleineren“: x · (x + 1) = x<sup>2</sup> + 41, also x = 41.</li>
      <li><strong>Alter:</strong> Ist Ben heute x Jahre alt, so ist er in 3 Jahren x + 3 und war vor 2 Jahren x − 2 Jahre alt.</li>
      <li><strong>Bewegung:</strong> Weg = Geschwindigkeit · Zeit, s = v · t. Holt ein Fahrzeug ein anderes ein, haben beide denselben Weg zurückgelegt.</li>
      <li><strong>Preise und Mischungen:</strong> Gesamtpreis = Anzahl · Preis pro Stück. Beim Mischen bleibt die Menge des Stoffs erhalten: Anteil · Menge der einen Sorte plus Anteil · Menge der anderen ergibt den Anteil · Menge der Mischung.</li>
    </ul>
    <p><strong>Typische Fehler:</strong> die Variable nicht festlegen (Was ist x, in welcher Einheit?); die Probe nur an der eigenen Gleichung machen; eine Antwort geben, die nicht zur Situation passt, etwa eine negative Länge oder 12,5 Personen.</p>
    <div class="merke"><strong>Merke:</strong> x festlegen, Gleichung aufstellen, lösen, Probe am Text, Antwortsatz. Ein Ergebnis, das nicht zur Situation passt, zeigt einen Fehler an.</div>
  `,
  formulas: [
    { name: "Lösungsweg", html: "x festlegen → Gleichung → lösen → Probe am Text → Antwortsatz", quantities: "die Probe immer mit den Angaben im Text" },
    { name: "Bewegung", html: "s = v · t", quantities: "s Weg, v Geschwindigkeit, t Zeit" },
    { name: "Mischung", html: "p<sub>1</sub> · m<sub>1</sub> + p<sub>2</sub> · m<sub>2</sub> = p · (m<sub>1</sub> + m<sub>2</sub>)", quantities: "p Anteil des Stoffs, m Menge der Sorte" },
  ],
  quiz: {
    question: "Ein Rechteck ist 3 cm länger als breit; x ist die Breite in cm. Welcher Term beschreibt seinen Flächeninhalt?",
    options: ["x + (x + 3)", "x · (x + 3)", "x · 3x", "2x + 2(x + 3)"],
    correctIndex: 1,
    explanation: "Die Länge ist x + 3, der Flächeninhalt ist Länge mal Breite: x · (x + 3) = x² + 3x. 2x + 2(x + 3) wäre der Umfang, und x · 3x gehört zu „dreimal so lang wie breit“.",
  },
  lab: {
    kind: "word-problem",
    title: "Labor: Gleicher Flächeninhalt",
    intro:
      "Ein Rechteck ist x cm breit und d cm länger als breit. Die Breite wird um m cm verlängert, die Länge um n cm verkürzt. Rot ist der Streifen, der wegfällt, grün der, der dazukommt. Ziehe die Ecke oder schiebe x, bis beide gleich groß sind.",
    params: [
      { type: "range", key: "d", label: "d: Länge − Breite", unit: "cm", min: 1, max: 10, step: 1, value: 8 },
      { type: "range", key: "m", label: "m: Breite wird länger um", unit: "cm", min: 1, max: 6, step: 1, value: 2 },
      { type: "range", key: "n", label: "n: Länge wird kürzer um", unit: "cm", min: 1, max: 6, step: 1, value: 3 },
      { type: "range", key: "x", label: "Breite x", unit: "cm", min: 0.5, max: 16, step: 0.5, value: 6, digits: 1 },
    ],
    readouts: [
      { key: "old", label: "alter Flächeninhalt", compute: (v) => `${fmt(rectChange(v).oldArea)} cm²` },
      { key: "new", label: "neuer Flächeninhalt", compute: (v) => (rectChange(v).exists ? `${fmt(rectChange(v).newArea)} cm²` : "kein Rechteck") },
      {
        key: "diff",
        label: "Unterschied neu − alt",
        emphasis: true,
        compute: (v) => {
          const rc = rectChange(v);
          return rc.exists ? `${rc.diff > 0 ? "+" : rc.diff < 0 ? MINUS : ""}${fmt(Math.abs(rc.diff))} cm²` : "kein Rechteck";
        },
      },
    ],
    goals: [
      {
        id: "gleich",
        text: "Finde eine Breite x, bei der der Flächeninhalt gleich bleibt, obwohl sich beide Seiten um verschiedene Längen ändern (m ≠ n).",
        check: (v) => v.m !== v.n && rectChange(v).exists && Math.abs(rectChange(v).diff) < 1e-9,
      },
      {
        id: "quadrat",
        text: "Finde ein Rechteck, das nach der Änderung ein Quadrat mit genau demselben Flächeninhalt ist.",
        check: (v) => {
          const rc = rectChange(v);
          return rc.exists && Math.abs(rc.width - rc.length) < 1e-9 && Math.abs(rc.diff) < 1e-9;
        },
      },
      {
        id: "jedes",
        text: "Finde eine Einstellung, bei der der Flächeninhalt für jede Breite x gleich bleibt. Was passiert dann mit dem Rechteck?",
        check: (v) => v.m === v.n && v.n === v.d,
      },
    ],
  },
  exercises: [
    {
      id: "geometrie",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 2 && rng.next() < 0.45) {
          // a square changed into a rectangle
          const b = rng.int(1, 4);
          const a = rng.int(b + 1, b + 5);
          let x = rng.int(b + 2, 16);
          let c = a * b - (a - b) * x;
          while (c === 0) {
            x += 1;
            c = a * b - (a - b) * x;
          }
          const smaller = c > 0;
          const shown = `(x + ${a})(x − ${b}) = x<sup>2</sup> ${smaller ? "−" : "+"} ${Math.abs(c)}`;
          return {
            prompt: `Verlängert man eine Seite eines Quadrats um ${a} cm und verkürzt die andere um ${b} cm, so entsteht ein Rechteck, dessen Flächeninhalt um ${Math.abs(c)} cm² ${smaller ? "kleiner" : "größer"} ist als der des Quadrats. Wie lang ist die Seite des Quadrats, und wie groß ist sein Flächeninhalt?`,
            given: [`Seite + ${a} cm, Seite − ${b} cm`, `Unterschied ${Math.abs(c)} cm²`],
            fields: [
              numberField("Seitenlänge:", x, "cm", 2, { slips: [{ value: (a * b + c) / (a - b), hint: `Das Rechteck ist ${smaller ? "kleiner" : "größer"}: Auf welcher Seite der Gleichung muss der Unterschied stehen?` }] }),
              numberField("Flächeninhalt des Quadrats:", x * x, "cm²", 2, { slips: [{ value: (x + a) * (x - b), hint: "Das ist der Flächeninhalt des Rechtecks." }] }),
            ],
            steps: [
              `x sei die Seitenlänge des Quadrats in cm. Rechteck: (x + ${a}) cm und (x − ${b}) cm.`,
              `Gleichung: ${shown}`,
              `x<sup>2</sup> + ${a - b}x − ${a * b} = x<sup>2</sup> ${smaller ? "−" : "+"} ${Math.abs(c)}   | − x<sup>2</sup> + ${a * b}: ${monoHtml(a - b, X1)} = ${fmt(a * b - c)}, also x = ${fmt(x)}`,
              `Probe am Text: Quadrat ${fmt(x * x)} cm², Rechteck ${fmt(x + a)} cm · ${fmt(x - b)} cm = ${fmt((x + a) * (x - b))} cm², ${Math.abs(c)} cm² ${smaller ? "weniger" : "mehr"}.`,
              `<strong>Das Quadrat hat die Seitenlänge ${fmt(x)} cm und den Flächeninhalt ${fmt(x * x)} cm².</strong>`,
            ],
            meta: { kind: 1, a, b, c, x },
          };
        }
        const [d, m, n, x] = rng.pick(RECT_SETS);
        const eq = `x · (x + ${d}) = (x + ${m})(${plusText("x", d - n)})`;
        const steps = [
          `x sei die Breite in cm; Länge (x + ${d}) cm, neue Seiten (x + ${m}) cm und (x + ${d} − ${n}) cm = (${plusText("x", d - n)}) cm.`,
          `Gleichung: ${eq}`,
          `x<sup>2</sup> + ${d}x = ${polyHtml(polyMul(lin(1, m), lin(1, d - n)))}   | − x<sup>2</sup> − ${d - n + m === 1 ? "" : d - n + m}x: ${n - m === 1 ? "" : n - m}x = ${m * (d - n)}`,
          `x = ${fmt(x)}. Probe am Text: alt ${fmt(x)} cm · ${fmt(x + d)} cm = ${fmt(x * (x + d))} cm², neu ${fmt(x + m)} cm · ${fmt(x + d - n)} cm = ${fmt((x + m) * (x + d - n))} cm².`,
          `<strong>Das Rechteck ist ${fmt(x)} cm breit und ${fmt(x + d)} cm lang.</strong>`,
        ];
        const fields = [
          numberField("Breite:", x, "cm", 2),
          numberField("Länge:", x + d, "cm", 2, { slips: [{ value: x + d - n, hint: "Das ist die neue Länge. Gefragt ist das ursprüngliche Rechteck." }] }),
        ];
        if (level === 1) {
          return {
            prompt: `Ein Rechteck ist ${d} cm länger als breit. Verlängert man die Breite um ${m} cm und verkürzt die Länge um ${n} cm, bleibt der Flächeninhalt gleich. Mit der Breite x (in cm) gilt: ${eq}. Berechne Breite und Länge des Rechtecks.`,
            given: [eq],
            formulaHint: "Beide Seiten ausmultiplizieren; x<sup>2</sup> hebt sich auf, dann nach x auflösen",
            fields,
            steps,
            meta: { kind: 0, d, m, n, x },
          };
        }
        return {
          prompt: `Ein Rechteck ist ${d} cm länger als breit. Verlängert man die Breite um ${m} cm und verkürzt gleichzeitig die Länge um ${n} cm, so ändert sich der Flächeninhalt nicht. Berechne die Seitenlängen und den Flächeninhalt des Rechtecks.`,
          given: [`Länge = Breite + ${d} cm`, `Breite + ${m} cm, Länge − ${n} cm: gleicher Flächeninhalt`],
          fields: [...fields, numberField("Flächeninhalt:", x * (x + d), "cm²", 2)],
          steps,
          meta: { kind: 0, d, m, n, x },
        };
      }),
    },
    {
      id: "zahlen",
      make: guarded((rng, level): ExerciseTask => {
        const context = rng.int(0, 4);
        const l1 = level === 1;
        if (context === 0) {
          // a number puzzle with products
          if (l1) {
            const d = rng.int(1, 5);
            const x = rng.int(3, 25);
            const c = d * x;
            const eq = `x · (x + ${d}) = x<sup>2</sup> + ${c}`;
            return {
              prompt: `Das Produkt zweier natürlicher Zahlen, die sich um ${d} unterscheiden, ist um ${c} größer als das Quadrat der kleineren Zahl. x sei die kleinere Zahl; dann gilt ${eq}. Wie heißen die beiden Zahlen?`,
              given: [eq],
              formulaHint: "Links ausmultiplizieren, x<sup>2</sup> fällt weg",
              fields: [numberField("kleinere Zahl:", x, "", 0), numberField("größere Zahl:", x + d, "", 0)],
              steps: [`x<sup>2</sup> + ${d}x = x<sup>2</sup> + ${c}   | − x<sup>2</sup>`, `${d === 1 ? "" : d}x = ${c}, also x = ${x}`, `Probe am Text: ${x} · ${x + d} = ${x * (x + d)} und ${x}<sup>2</sup> + ${c} = ${x * x + c}.`, `<strong>Die Zahlen heißen ${x} und ${x + d}.</strong>`],
              meta: { context, d, x, c },
            };
          }
          const d = rng.int(2, 6);
          const e = rng.int(1, 4);
          const x = rng.int(e + 2, 20);
          const c = (d + 2 * e) * x - e * e;
          return {
            prompt: `Multipliziert man eine natürliche Zahl mit der um ${d} größeren Zahl, so erhält man ${c} mehr, als wenn man die um ${e} kleinere Zahl quadriert. Wie heißt die Zahl?`,
            given: [`Zahl · (Zahl + ${d}) = (Zahl − ${e})<sup>2</sup> + ${c}`],
            fields: [numberField("Zahl:", x, "", 0, { slips: [{ value: (c + e * e) / d, hint: "(x − e)² ist ein Binom: Das Mischglied −2ex nicht vergessen." }] })],
            steps: [
              `x sei die gesuchte Zahl: x · (x + ${d}) = (x − ${e})<sup>2</sup> + ${c}`,
              `x<sup>2</sup> + ${d}x = x<sup>2</sup> − ${2 * e}x + ${e * e} + ${c}   | − x<sup>2</sup> + ${2 * e}x`,
              `${d + 2 * e}x = ${e * e + c}, also x = ${x}`,
              `Probe am Text: ${x} · ${x + d} = ${x * (x + d)}, ${x - e}<sup>2</sup> + ${c} = ${(x - e) ** 2 + c}.`,
              `<strong>Die Zahl heißt ${x}.</strong>`,
            ],
            meta: { context: 5, d, e, x, c },
          };
        }
        if (context === 1) {
          // ages: the product of the ages grows
          const x = rng.int(6, 16);
          const d = rng.int(1, 6);
          const t = rng.int(2, 5);
          const P = t * (2 * x + d + t);
          const [older, younger] = rng.pick([["Anna", "Ben"], ["Lea", "Tom"], ["Mira", "Paul"]]);
          const eq = `(x + ${t})(x + ${d + t}) = x · (x + ${d}) + ${P}`;
          return {
            prompt: `${older} ist ${d === 1 ? "ein Jahr" : `${d} Jahre`} älter als ${younger}. In ${t} Jahren ist das Produkt ihrer Alter um ${P} größer als heute.${l1 ? ` Mit ${younger}s Alter x (in Jahren) gilt: ${eq}.` : ""} Wie alt sind beide heute?`,
            given: l1 ? [eq] : [`${older} ist ${d === 1 ? "ein Jahr" : `${d} Jahre`} älter.`, `in ${t} Jahren: Produkt um ${P} größer`],
            ...(l1 ? { formulaHint: "Beide Seiten ausmultiplizieren, x<sup>2</sup> fällt weg" } : {}),
            fields: [numberField(`${younger}:`, x, "Jahre", 0), numberField(`${older}:`, x + d, "Jahre", 0, { slips: [{ value: x + d + t, hint: `Das ist ${older}s Alter in ${t} Jahren. Gefragt ist das Alter heute.` }] })],
            steps: [
              `x sei ${younger}s Alter heute; ${older} ist x + ${d}. In ${t} Jahren: x + ${t} und x + ${d + t}.`,
              `${eq}`,
              `${polyHtml(polyMul(lin(1, t), lin(1, d + t)))} = ${polyHtml([{ c: 1, m: X2 }, { c: d, m: X1 }, { c: P, m: X0 }])}   | − x<sup>2</sup> − ${cx(d)} − ${t * (d + t)}`,
              `${2 * t}x = ${P - t * (d + t)}, also x = ${x}`,
              `Probe am Text: heute ${x} · ${x + d} = ${x * (x + d)}, in ${t} Jahren ${x + t} · ${x + d + t} = ${(x + t) * (x + d + t)}, also ${P} mehr.`,
              `<strong>${younger} ist ${x} Jahre alt, ${older} ${x + d} Jahre.</strong>`,
            ],
            meta: { context, x, d, t, P },
          };
        }
        if (context === 2) {
          // catching up: s = v · t
          const [v1, v2, delta, t] = rng.pick(CHASES);
          const s = v1 * t;
          const eq = `${v1} · t = ${v2} · (t − ${fmt(delta)})`;
          return {
            prompt: `Ein Radfahrer fährt mit ${v1} km/h los. ${fmt(delta)} h später startet am selben Ort ein Motorroller mit ${v2} km/h auf derselben Strecke.${l1 ? ` Mit der Fahrzeit t des Radfahrers (in h) gilt: ${eq}.` : ""} Nach welcher Fahrzeit des Radfahrers holt der Motorroller ihn ein, und wie weit sind beide dann gefahren?`,
            given: l1 ? [eq] : [`Radfahrer ${v1} km/h`, `Motorroller ${v2} km/h, ${fmt(delta)} h später`],
            ...(l1 ? { formulaHint: "Beide haben denselben Weg zurückgelegt: s = v · t" } : {}),
            fields: [
              numberField("t =", t, "h", 2, { slips: [{ value: t - delta, hint: "Das ist die Fahrzeit des Motorrollers. Gefragt ist die Zeit des Radfahrers." }] }),
              numberField("Weg:", s, "km", 2),
            ],
            steps: [
              `t sei die Fahrzeit des Radfahrers in h; der Motorroller fährt t − ${fmt(delta)} h. Beim Einholen sind die Wege gleich.`,
              `${eq}   ⇔   ${v1}t = ${v2}t − ${fmt(v2 * delta)}   | − ${v2}t`,
              `${fmt(v1 - v2)}t = ${fmt(-v2 * delta)}   | : (${fmt(v1 - v2)}), also t = ${fmt(t)}`,
              `Probe am Text: Radfahrer ${v1} km/h · ${fmt(t)} h = ${fmt(s)} km, Motorroller ${v2} km/h · ${fmt(t - delta)} h = ${fmt(v2 * (t - delta))} km.`,
              `<strong>Nach ${fmt(t)} h holt der Motorroller den Radfahrer ein; beide sind dann ${fmt(s)} km gefahren.</strong>`,
            ],
            meta: { context, v1, v2, delta, t },
          };
        }
        if (context === 3) {
          // a juice mixture
          const [p1, p2, p, m1, x] = rng.pick(MIXES);
          const eq = `${fmt(p1 / 100)} · ${m1} + ${fmt(p2 / 100)} · x = ${fmt(p / 100)} · (${m1} + x)`;
          return {
            prompt: `${m1} l Fruchtsaftgetränk mit ${p1} % Fruchtgehalt sollen mit Saft mit ${p2} % Fruchtgehalt gemischt werden, sodass ein Getränk mit ${p} % Fruchtgehalt entsteht.${l1 ? ` Mit der Menge x (in l) des ${p2}-%-Safts gilt: ${eq}.` : ""} Wie viel Liter ${p2}-%-Saft braucht man, und wie viel Getränk entsteht?`,
            given: l1 ? [eq] : [`${m1} l mit ${p1} %`, `Saft mit ${p2} %`, `Ziel: ${p} %`],
            ...(l1 ? { formulaHint: "Menge Frucht vorher = Menge Frucht nachher: p<sub>1</sub> · m<sub>1</sub> + p<sub>2</sub> · x = p · (m<sub>1</sub> + x)" } : {}),
            fields: [numberField("x =", x, "l", 2), numberField("Mischung:", m1 + x, "l", 2, { slips: [{ value: x, hint: "Das ist nur der zugegebene Saft. Gefragt ist die ganze Mischung." }] })],
            steps: [
              `x sei die Menge des ${p2}-%-Safts in l. Die Fruchtmenge bleibt erhalten: ${eq}`,
              `${fmt((p1 * m1) / 100)} + ${fmt(p2 / 100)}x = ${fmt((p * m1) / 100)} + ${fmt(p / 100)}x   | − ${fmt(p / 100)}x − ${fmt((p1 * m1) / 100)}`,
              `${fmt((p2 - p) / 100)}x = ${fmt(((p - p1) * m1) / 100)}, also x = ${fmt(x)}`,
              `Probe am Text: Frucht ${fmt((p1 * m1) / 100)} l + ${fmt((p2 * x) / 100)} l = ${fmt((p1 * m1 + p2 * x) / 100)} l in ${fmt(m1 + x)} l Getränk, das sind ${p} %.`,
              `<strong>Man braucht ${fmt(x)} l ${p2}-%-Saft und erhält ${fmt(m1 + x)} l Getränk.</strong>`,
            ],
            meta: { context, p1, p2, p, m1, x },
          };
        }
        // prices: adults and children
        const PA = rng.int(8, 12);
        const PK = rng.int(4, PA - 2);
        const N = rng.int(8, 25);
        const kids = rng.int(1, N - 1);
        const T = PA * (N - kids) + PK * kids;
        const eq = `${PA} · (${N} − x) + ${PK} · x = ${T}`;
        return {
          prompt: `Eine Gruppe von ${N} Personen besucht ein Kino. Eine Karte kostet für Erwachsene ${PA} €, für Kinder ${PK} €. Zusammen zahlt die Gruppe ${T} €.${l1 ? ` Mit der Zahl x der Kinder gilt: ${eq}.` : ""} Wie viele Kinder und wie viele Erwachsene sind in der Gruppe?`,
          given: l1 ? [eq] : [`${N} Personen`, `Erwachsene ${PA} €, Kinder ${PK} €`, `zusammen ${T} €`],
          ...(l1 ? { formulaHint: "Gesamtpreis = Anzahl · Preis; Erwachsene und Kinder zusammen sind alle Personen" } : {}),
          fields: [numberField("Kinder:", kids, "", 0), numberField("Erwachsene:", N - kids, "", 0)],
          steps: [
            `x sei die Zahl der Kinder; dann sind ${N} − x Erwachsene dabei.`,
            `${eq}   ⇔   ${PA * N} − ${PA}x + ${PK}x = ${T}`,
            `${fmt(PK - PA)}x = ${fmt(T - PA * N)}, also x = ${kids}`,
            `Probe am Text: ${N - kids} · ${PA} € + ${kids} · ${PK} € = ${(N - kids) * PA} € + ${kids * PK} € = ${T} €.`,
            `<strong>In der Gruppe sind ${kids} Kinder und ${N - kids} Erwachsene.</strong>`,
          ],
          meta: { context: 4, PA, PK, N, kids, T },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Vom Text zur Gleichung und zurück: Du stellst Gleichungen selbst auf und prüfst sie am Text.",
};

// 4.9 Ungleichungen ───────────────────────────────────────────────────────────

const REL_FIELD = ["x <", "x ≤", "x >", "x ≥"];

/** "]−∞; 3[" and friends in HTML (the same text, the minus is real). */
const interval = (rel: number, g: number) => intervalText(rel, fmt(g, 2));

/**
 * A positive boundary as the calculator gives it: "12,5" when the decimal
 * ends, otherwise cut after two decimals with "…" (55,55…, never 55,56…).
 */
function boundText(v: number): string {
  if (Math.abs(v * 100 - Math.round(v * 100)) < 1e-9) return fmt(v, 2);
  return `${(Math.floor(v * 100 + 1e-9) / 100).toFixed(2).replace(".", ",")}…`;
}

const ungleichungen: Lesson = {
  id: "tg-9-ungleichungen",
  stageId: STAGE_ID,
  stepNumber: 9,
  title: "4.9 Ungleichungen",
  subtitle: "Umformen wie bei Gleichungen, mit einer Ausnahme",
  tracks: ["I"],
  lehrplan: "M8 LB 4 (I): Ungleichungen",
  whyItMatters:
    "„Höchstens 20 € im Monat“, „mindestens 150 € verdienen“, „ab wie vielen Minuten lohnt sich der andere Tarif?“: Solche Fragen sind Ungleichungen. Ihre Lösung ist meist ein ganzer Bereich von Zahlen, und genau den brauchst du für die Antwort.",
  explanationHtml: `
    <p>Eine Ungleichung wie 5 − 3x ≥ 17 vergleicht zwei Terme mit &lt;, ≤, &gt; oder ≥. Ihre Lösungsmenge enthält meist unendlich viele Zahlen (Wiederholung aus M7: Ungleichungen der Form ax + b ⋚ c).</p>
    <p><strong>Äquivalenzumformungen für Ungleichungen:</strong></p>
    <ul>
      <li>Auf beiden Seiten dieselbe Zahl oder denselben Term addieren oder subtrahieren: Das Zeichen bleibt.</li>
      <li>Beide Seiten mit derselben <strong>positiven</strong> Zahl multiplizieren oder durch sie dividieren: Das Zeichen bleibt.</li>
      <li>Beide Seiten mit derselben <strong>negativen</strong> Zahl multiplizieren oder durch sie dividieren: Das Zeichen <strong>kehrt sich um</strong> (Inversionsgesetz). Aus &lt; wird &gt;, aus ≤ wird ≥ und umgekehrt.</li>
    </ul>
    <p><strong>Warum:</strong> 2 &lt; 3, aber −2 &gt; −3. Multiplizieren mit −1 spiegelt alle Zahlen auf dem Zahlenstrahl an der 0; was vorher links lag, liegt danach rechts.</p>
    <div class="example"><strong>Beispiel 1:</strong> 5 − 3x ≥ 17   | − 5<br>
      −3x ≥ 12   | : (−3), das Zeichen kehrt sich um<br>
      x ≤ −4<br>
      L = {x | x ≤ −4} = ]−∞; −4]<br>
      Probe mit x = −5: 5 − 3 · (−5) = 20 ≥ 17 ist wahr; mit x = 0: 5 ≥ 17 ist falsch, 0 gehört nicht zu L.</div>
    <p><strong>Mit Klammern und binomischen Formeln</strong> vereinfachst du zuerst beide Seiten, wie bei Gleichungen. Beispiel 2: (x − 2)<sup>2</sup> ≤ (x + 1)(x − 3) + 7 ⇔ x<sup>2</sup> − 4x + 4 ≤ x<sup>2</sup> − 2x + 4 ⇔ −2x ≤ 0 ⇔ x ≥ 0, also L = [0; ∞[.</p>
    <table class="mini">
      <tr><th>Ungleichung</th><th>Mengenschreibweise</th><th>Intervall</th><th>Zahlenstrahl</th></tr>
      <tr><td>x &lt; 3</td><td>{x | x &lt; 3}</td><td>]−∞; 3[</td><td>leerer Punkt bei 3, nach links</td></tr>
      <tr><td>x ≤ 3</td><td>{x | x ≤ 3}</td><td>]−∞; 3]</td><td>voller Punkt bei 3, nach links</td></tr>
      <tr><td>x &gt; −1</td><td>{x | x &gt; −1}</td><td>]−1; ∞[</td><td>leerer Punkt bei −1, nach rechts</td></tr>
      <tr><td>x ≥ −1</td><td>{x | x ≥ −1}</td><td>[−1; ∞[</td><td>voller Punkt bei −1, nach rechts</td></tr>
    </table>
    <p><strong>Grundmenge:</strong> Über G = ℤ erfüllen 5 − 3x ≥ 17 nur die ganzen Zahlen −4, −5, −6 und so weiter: L = {…; −6; −5; −4}. Über G = ℕ gibt es keine Lösung, L = { }. In Sachaufgaben ist die Grundmenge oft ℕ: Minuten, Personen, Stück.</p>
    <p><strong>Sachaufgaben:</strong> „höchstens“ heißt ≤, „mindestens“ heißt ≥, „weniger als“ heißt &lt;, „mehr als“ heißt &gt;. Ein Tarif kostet 8 € im Monat und 0,09 € pro Minute. Wer höchstens 20 € ausgeben will, braucht 8 + 0,09x ≤ 20, also x ≤ 133,3…: Er darf höchstens 133 Minuten telefonieren.</p>
    <p><strong>Typische Fehler:</strong> beim Teilen durch eine negative Zahl das Zeichen nicht umdrehen; das Zeichen umdrehen, obwohl nur addiert oder subtrahiert wurde; in ℕ falsch runden: x ≤ 133,3 heißt höchstens 133, nicht 134.</p>
    <div class="merke"><strong>Merke:</strong> Ungleichungen formst du um wie Gleichungen. Beim Multiplizieren oder Dividieren mit einer negativen Zahl kehrt sich das Ungleichheitszeichen um.</div>
  `,
  formulas: [
    { name: "Inversionsgesetz", html: "a &lt; b ⇔ −a &gt; −b; aus a &lt; b folgt a · c &gt; b · c für c &lt; 0", quantities: "Multiplizieren oder Dividieren mit einer negativen Zahl kehrt das Zeichen um" },
    { name: "Intervalle", html: "x &lt; a: ]−∞; a[, x ≤ a: ]−∞; a], x &gt; a: ]a; ∞[, x ≥ a: [a; ∞[", quantities: "eine Klammer, die von a weg zeigt: a gehört nicht dazu" },
    { name: "Signalwörter", html: "höchstens: ≤; mindestens: ≥; weniger als: &lt;; mehr als: &gt;", quantities: "für Sachaufgaben" },
  ],
  quiz: {
    question: "Welche Lösungsmenge hat −2x < 8 über G = ℚ?",
    options: ["L = ]−∞; −4[", "L = ]−4; ∞[", "L = ]4; ∞[", "L = [−4; ∞["],
    correctIndex: 1,
    explanation: "Teilen durch −2 kehrt das Zeichen um: −2x < 8 ⇔ x > −4. Die Randzahl −4 gehört nicht dazu, also L = ]−4; ∞[. ]−∞; −4[ entsteht, wenn man das Zeichen nicht umdreht.",
  },
  lab: {
    kind: "inequality",
    title: "Labor: Ungleichungen am Zahlenstrahl",
    intro:
      "Stelle a, b, c und das Zeichen für ax + b ⋚ c ein. Die Rechnung zeigt jede Umformung, der Zahlenstrahl die Lösungsmenge. Ziehe den Testwert: Grün heißt, er erfüllt die Ungleichung. Gestrichelt siehst du, was herauskäme, wenn man das Zeichen beim Teilen durch eine negative Zahl nicht umdreht.",
    params: [
      { type: "range", key: "a", label: "a", unit: "", min: -5, max: 5, step: 1, value: 2 },
      { type: "range", key: "b", label: "b", unit: "", min: -10, max: 10, step: 1, value: 1 },
      { type: "choice", key: "rel", label: "Zeichen", options: RELATIONS.map((r, i) => ({ value: i, label: r })), value: 0 },
      { type: "range", key: "c", label: "c", unit: "", min: -10, max: 20, step: 1, value: 7 },
      { type: "range", key: "t", label: "Testwert x", unit: "", min: -8, max: 8, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      {
        key: "solved",
        label: "aufgelöst",
        emphasis: true,
        compute: (v) => {
          const sol = inequalitySolution(v);
          return sol.kind === "all" ? "jede Zahl" : sol.kind === "none" ? "keine Zahl" : `x ${RELATIONS[sol.rel]} ${sol.gText}`;
        },
      },
      { key: "set", label: "Lösungsmenge", compute: (v) => inequalitySet(v) },
      { key: "test", label: "Testwert", compute: (v) => `x = ${fmt(v.t)} ${satisfies(v, v.t) ? "erfüllt die Ungleichung" : "erfüllt sie nicht"}` },
    ],
    goals: [
      {
        id: "umkehr",
        text: "Wähle a < 0 und finde einen Testwert, der die Ungleichung erfüllt, aber in der gestrichelten Menge ohne Umdrehen nicht liegt. So zeigst du, dass das Zeichen umgedreht werden muss.",
        check: (v) => {
          const sol = inequalitySolution(v);
          return v.a < 0 && sol.kind === "bound" && satisfies(v, v.t) && !holds(v.t, v.rel, sol.g);
        },
      },
      {
        id: "offen",
        text: "Stelle eine Ungleichung ein, deren Lösungsmenge L = ]−∞; 2[ ist.",
        check: (v) => {
          const sol = inequalitySolution(v);
          return sol.kind === "bound" && sol.rel === 0 && Math.abs(sol.g - 2) < 1e-9;
        },
      },
      {
        id: "ganzzahl",
        text: "Finde eine Ungleichung mit a < 0, deren kleinste ganze Lösung −3 ist, und prüfe sie mit dem Testwert −3.",
        check: (v) => {
          const sol = inequalitySolution(v);
          return v.a < 0 && sol.kind === "bound" && sol.rel >= 2 && integerEdge(sol.rel, sol.g) === -3 && v.t === -3;
        },
      },
    ],
  },
  exercises: [
    {
      id: "ungleichung",
      make: guarded((rng, level): ExerciseTask => {
        const rel = rng.int(0, 3);
        if (level === 1) {
          let [m, n, e, A] = [2, 1, 0, 1];
          do {
            [m, n, e] = [rng.int(2, 5), rng.int(1, 4), rng.int(-4, 5)];
            A = m - n - e;
          } while (A === 0);
          const [p, q] = [nonZero(rng, 6), nonZero(rng, 6)];
          const g = rng.int(-6, 6);
          const f = A * g + m * p - n * q;
          const solved = A > 0 ? rel : FLIPPED[rel];
          const right = e === 0 ? fmt(f) : polyHtml(lin(e, f));
          const shown = `${m}${linHtml(1, p)} − ${n === 1 ? "" : n}${linHtml(1, q)} ${RELATIONS[rel].replace("<", "&lt;").replace(">", "&gt;")} ${right}`;
          const R = (i: number) => RELATIONS[i].replace("<", "&lt;").replace(">", "&gt;");
          return {
            prompt: `Löse die Ungleichung über G = ℚ: ${shown}. Gib die Randzahl und das Zeichen der Lösung x ⋚ Randzahl an.`,
            given: [shown],
            formulaHint: "Klammern auflösen, x-Glieder nach links, Zahlen nach rechts; beim Dividieren durch eine negative Zahl das Zeichen umdrehen",
            fields: [numberField("Randzahl:", g, "", 2), choiceField("Lösung:", REL_FIELD, solved)],
            steps: [
              `Klammern auflösen: ${polyHtml([{ c: m, m: X1 }, { c: m * p, m: X0 }, { c: -n, m: X1 }, { c: -n * q, m: X0 }], false)} ${R(rel)} ${right}`,
              `x-Glieder nach links, Zahlen nach rechts: ${monoHtml(A, X1)} ${R(rel)} ${fmt(A * g)}`,
              A === 1 ? `x ${R(rel)} ${fmt(g)}` : `| : ${paren(A)}${A < 0 ? ", negative Zahl: Zeichen umdrehen" : ""}: x ${R(solved)} ${fmt(g)}`,
              `<strong>x ${R(solved)} ${fmt(g)}, L = ${interval(solved, g)}</strong>`,
            ],
            meta: { kind: 0, m, n, e, p, q, f, rel, g },
          };
        }
        // binomial formula against a product, and the whole number nearest to the boundary
        let [p, q, r, A] = [1, 1, 1, 0];
        do {
          [p, q, r] = [nonZero(rng, 5), nonZero(rng, 5), nonZero(rng, 5)];
          A = r - q - 2 * p;
        } while (A === 0);
        let g = niceSolution(rng, A, 9);
        if (Number.isInteger(g) && (rel === 1 || rel === 3) && rng.next() < 0.6) g = niceSolution(rng, A, 9);
        const k = A * g + q * r + p * p;
        const solved = A > 0 ? rel : FLIPPED[rel];
        const edge = integerEdge(solved, g);
        const R = (i: number) => RELATIONS[i].replace("<", "&lt;").replace(">", "&gt;");
        const shown = `(${plusText("x", -p)})<sup>2</sup> ${R(rel)} ${prodHtml(q, -r)}${k === 0 ? "" : signed(k)}`;
        return {
          prompt: `Bestimme die Lösungsmenge der Ungleichung ${shown} über G = ℚ. Welche ganze Zahl in L liegt am nächsten an der Randzahl?`,
          given: [shown],
          fields: [
            choiceField("Lösung:", REL_FIELD, solved),
            numberField("Randzahl:", g, "", 2),
            numberField("ganze Zahl in L, die am nächsten an der Randzahl liegt:", edge, "", 0, { slips: [{ value: Math.round(g) === edge ? edge + (solved >= 2 ? -1 : 1) : Math.round(g), hint: "Prüfe, ob die Randzahl selbst dazugehört (≤, ≥) oder nicht (<, >), und in welche Richtung die Lösungsmenge geht." }] }),
          ],
          steps: [
            `Binomische Formel und Produkt: ${polyHtml(polyMul(lin(1, -p), lin(1, -p)))} ${R(rel)} ${polyHtml(polyMul(lin(1, q), lin(1, -r)))}${k === 0 ? "" : signed(k)}`,
            `x<sup>2</sup> fällt weg, x-Glieder nach links, Zahlen nach rechts: ${monoHtml(A, X1)} ${R(rel)} ${fmt(A * g)}`,
            `${A === 1 ? "" : `| : ${paren(A)}${A < 0 ? ", Zeichen umdrehen" : ""}: `}x ${R(solved)} ${fmt(g)}, L = ${interval(solved, g)}`,
            `<strong>x ${R(solved)} ${fmt(g)}; die ganze Zahl in L am Rand ist ${fmt(edge)}.</strong>`,
          ],
          meta: { kind: 1, p, q, r, k, rel, g, edge },
        };
      }),
    },
    {
      id: "sachaufgabe",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const variant = rng.int(0, 2);
          if (variant === 2) {
            // x on both sides: two gym offers, with the Ansatz given
            const joinA = rng.pick([0, 20, 30, 40]);
            const joinB = joinA + rng.pick([40, 50, 60, 75, 90]);
            const perA = rng.pick([25, 29, 30, 35]);
            const perB = perA - rng.pick([3, 4, 5, 6]);
            const g = (joinB - joinA) / (perA - perB);
            const from = integerEdge(2, g);
            const left = `${joinB} + ${perB}x`;
            const right = joinA === 0 ? `${perA}x` : `${joinA} + ${perA}x`;
            return {
              prompt: `Fitnessstudio A verlangt ${joinA === 0 ? "keine Aufnahmegebühr" : `${joinA} € Aufnahmegebühr`} und ${perA} € im Monat, Fitnessstudio B ${joinB} € Aufnahmegebühr und ${perB} € im Monat. Ab wie vielen Monaten ist B insgesamt günstiger als A?`,
              given: [`Ansatz: ${left} &lt; ${right} (x: Monate)`],
              formulaHint: "x-Glieder auf eine Seite, Zahlen auf die andere; beim Teilen durch eine negative Zahl das Zeichen umdrehen; „günstiger“ heißt echt kleiner",
              fields: [exactField("B ist günstiger ab", from, Number.isInteger(g) ? [{ value: g, hint: `Nach genau ${g} Monaten kosten beide gleich viel. „Günstiger“ heißt echt kleiner.` }] : [{ value: Math.floor(g), hint: "Nach dieser Zahl von Monaten ist B noch nicht günstiger: aufrunden." }], "Monaten")],
              steps: [
                `${left} &lt; ${right}   | − ${perA}x − ${joinB}`,
                `${fmt(perB - perA)}x &lt; ${fmt(joinA - joinB)}   | : (${fmt(perB - perA)}), Zeichen umdrehen`,
                `x &gt; ${boundText(g)}`,
                `<strong>Ab ${from} Monaten ist Fitnessstudio B günstiger.</strong>`,
              ],
              meta: { kind: 4, joinA, joinB, perA, perB, from },
            };
          }
          if (variant === 0) {
            // at most: a phone tariff and a budget
            const base = rng.pick([500, 750, 800, 950, 1000, 1200]);
            const perMin = rng.pick([5, 6, 8, 9, 12, 15]);
            const extra = rng.pick([500, 600, 800, 1000, 1200, 1500]);
            const budget = base + extra;
            const minutes = Math.floor(extra / perMin);
            const exact = extra % perMin === 0;
            const ansatz = `${fmt(base / 100)} + ${fmt(perMin / 100)} · x ≤ ${fmt(budget / 100)}`;
            return {
              prompt: `Wiederholung aus M7: Ein Handytarif kostet im Monat ${euro(base)} € Grundgebühr und ${perMin} ct pro Minute. Lena will höchstens ${euro(budget)} € im Monat ausgeben. Wie viele ganze Minuten darf sie höchstens telefonieren?`,
              given: [`Ansatz: ${ansatz} (x: Minuten)`],
              formulaHint: "höchstens heißt ≤; x ist eine Anzahl von Minuten, also eine natürliche Zahl",
              fields: [exactField("höchstens", minutes, exact ? [] : [{ value: minutes + 1, hint: "Aufgerundet wäre das Budget überschritten: Bei „höchstens“ wird abgerundet." }], "Minuten")],
              steps: [`${ansatz}   | − ${fmt(base / 100)}`, `${fmt(perMin / 100)} · x ≤ ${fmt(extra / 100)}   | : ${fmt(perMin / 100)}`, `x ≤ ${boundText(extra / perMin)}`, `<strong>Lena darf höchstens ${minutes} Minuten telefonieren.</strong>`],
              meta: { kind: 0, base, perMin, budget, minutes },
            };
          }
          // at least: a holiday job
          const wage = rng.pick([950, 1000, 1100, 1250, 1300]);
          const bonus = rng.pick([0, 1000, 1500, 2000, 2500]);
          const target = rng.pick([10000, 12000, 15000, 18000, 20000, 25000]);
          const hours = Math.ceil((target - bonus) / wage);
          const exact = (target - bonus) % wage === 0;
          const ansatz = `${bonus ? `${fmt(bonus / 100)} + ` : ""}${fmt(wage / 100)} · x ≥ ${fmt(target / 100)}`;
          return {
            prompt: `Wiederholung aus M7: Tim jobbt in den Ferien für ${euro(wage)} € pro Stunde${bonus ? ` und bekommt einmalig ${euro(bonus)} € Fahrgeld` : ""}. Er will mindestens ${euro(target)} € verdienen. Wie viele ganze Stunden muss er mindestens arbeiten?`,
            given: [`Ansatz: ${ansatz} (x: Stunden)`],
            formulaHint: "mindestens heißt ≥; x ist eine Anzahl ganzer Stunden",
            fields: [exactField("mindestens", hours, exact ? [] : [{ value: hours - 1, hint: "Abgerundet reicht das Geld nicht: Bei „mindestens“ wird aufgerundet." }], "Stunden")],
            steps: [...(bonus ? [`${ansatz}   | − ${fmt(bonus / 100)}`] : []), `${fmt(wage / 100)} · x ≥ ${fmt((target - bonus) / 100)}   | : ${fmt(wage / 100)}`, `x ≥ ${boundText((target - bonus) / wage)}`, `<strong>Tim muss mindestens ${hours} Stunden arbeiten.</strong>`],
            meta: { kind: 1, wage, bonus, target, hours },
          };
        }
        if (rng.next() < 0.5) {
          // two phone tariffs
          const baseA = rng.pick([0, 300, 500, 600]);
          const baseB = baseA + rng.pick([400, 500, 600, 700, 900]);
          const perA = rng.pick([9, 10, 12, 15]);
          const perB = perA - rng.pick([3, 4, 5, 6, 7]);
          const g = (baseB - baseA) / (perA - perB);
          const from = integerEdge(2, g);
          const tariffA = baseA === 0 ? `Tarif A hat keine Grundgebühr und kostet ${perA} ct pro Minute` : `Tarif A kostet ${euro(baseA)} € Grundgebühr im Monat und ${perA} ct pro Minute`;
          return {
            prompt: `${tariffA}, Tarif B ${euro(baseB)} € Grundgebühr und ${perB} ct pro Minute. Welcher Tarif ist für wenige Minuten günstiger? Ab wie vielen Minuten im Monat ist Tarif B günstiger als Tarif A?`,
            given: [`A: ${baseA === 0 ? "" : `${euro(baseA)} € + `}${perA} ct/min`, `B: ${euro(baseB)} € + ${perB} ct/min`],
            fields: [
              choiceField("Für wenige Minuten günstiger:", ["Tarif A", "Tarif B"], 0),
              exactField("Tarif B ist günstiger ab", from, Number.isInteger(g) ? [{ value: g, hint: `Bei genau ${g} Minuten kosten beide gleich viel. „Günstiger“ heißt echt kleiner.` }] : [{ value: Math.floor(g), hint: "Bei dieser Minutenzahl ist Tarif B noch nicht günstiger: aufrunden." }], "Minuten"),
            ],
            steps: [
              `x sei die Zahl der Minuten. Tarif B günstiger: ${fmt(baseB / 100)} + ${fmt(perB / 100)}x &lt; ${baseA === 0 ? "" : `${fmt(baseA / 100)} + `}${fmt(perA / 100)}x   | − ${fmt(perA / 100)}x − ${fmt(baseB / 100)}`,
              `${fmt((perB - perA) / 100)}x &lt; ${fmt((baseA - baseB) / 100)}   | : (${fmt((perB - perA) / 100)}), Zeichen umdrehen: x &gt; ${boundText(g)}`,
              `Für wenige Minuten ist A günstiger, weil ${baseA === 0 ? "es dort keine Grundgebühr gibt" : "seine Grundgebühr kleiner ist"}.`,
              `<strong>Ab ${from} Minuten im Monat ist Tarif B günstiger.</strong>`,
            ],
            meta: { kind: 2, baseA, baseB, perA, perB, from },
          };
        }
        // a season ticket for the pool
        const single = rng.pick([350, 400, 450, 500, 550]);
        const perVisit = rng.pick([100, 150, 200]);
        const season = rng.pick([1500, 2000, 2500, 3000, 3500]);
        const g = season / (single - perVisit);
        const from = integerEdge(2, g);
        return {
          prompt: `Ein Einzeleintritt ins Freibad kostet ${euro(single)} €. Mit einer Saisonkarte für ${euro(season)} € zahlt man pro Besuch nur noch ${euro(perVisit)} €. Ab wie vielen Besuchen ist die Saisonkarte günstiger?`,
          given: [`Einzeln: ${euro(single)} € pro Besuch`, `Saisonkarte: ${euro(season)} € + ${euro(perVisit)} € pro Besuch`],
          fields: [exactField("ab", from, Number.isInteger(g) ? [{ value: g, hint: `Bei genau ${g} Besuchen kosten beide gleich viel. „Günstiger“ heißt echt kleiner.` }] : [{ value: Math.floor(g), hint: "Bei dieser Zahl ist die Saisonkarte noch nicht günstiger: aufrunden." }], "Besuchen")],
          steps: [
            `x sei die Zahl der Besuche: ${fmt(season / 100)} + ${cx(perVisit / 100)} &lt; ${cx(single / 100)}   | − ${cx(perVisit / 100)}`,
            `${fmt(season / 100)} &lt; ${cx((single - perVisit) / 100)}${single - perVisit === 100 ? "" : `   | : ${fmt((single - perVisit) / 100)}`}`,
            `x &gt; ${boundText(g)}`,
            `<strong>Ab ${from} Besuchen ist die Saisonkarte günstiger.</strong>`,
          ],
          meta: { kind: 3, single, perVisit, season, from },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du formst Ungleichungen sicher um, drehst das Zeichen an der richtigen Stelle und antwortest mit der passenden ganzen Zahl.",
};

export const STAGE_TERME_GLEICHUNGEN: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Terme und Gleichungen",
  subtitle: "Vereinfachen, ausmultiplizieren, faktorisieren, Extremwerte finden und Gleichungen lösen",
  icon: "🧩",
  accent: "#d97706",
  badgeTitle: "Termtüftler",
  lehrplanLabel: "LB 4 (I) · LB 3 (II/III)",
  lessons: [terme, ausmultiplizieren, binomischeFormeln, faktorisieren, extremwerte, extremwertprobleme, gleichungen, sachaufgaben, ungleichungen],
};

