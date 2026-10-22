import { fmt, MINUS, paren, quadratic } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  BINOMIAL_FORMULAS,
  binomialLeft,
  bracket,
  coefOf,
  factorHtml,
  type Mono,
  monoHtml,
  type Poly,
  polyAdd,
  polyHtml,
  polyMul,
  polyScale,
  polySub,
  polyText,
  probeCounts,
  productValue,
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
function exactField(label: string, answer: number, slips: Array<{ value: number; hint: string }> = []): NumberField {
  const kept = slips.filter((slip, i) => slip.value !== answer && slips.findIndex((other) => other.value === slip.value) === i);
  return { kind: "number", label, answer, unit: "", digits: 0, slips: kept };
}

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
          prompt: `Ein Würfel hat die Kantenlänge k = ${edge} (in cm). Berechne ${volume ? "sein Volumen V = k<sup>3</sup>" : "seinen Oberflächeninhalt O = 6 · k<sup>2</sup>"} und schreibe es als ein Produkt aus Zahl und Potenzen.`,
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
          const [a, c] = [rng.int(1, 3), rng.int(1, 3)];
          const [b, d] = [rng.int(1, 9), rng.int(1, 9)];
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
    <p>Weil ein Quadrat nie negativ ist, gilt (−a − b)<sup>2</sup> = (a + b)<sup>2</sup> und (−a + b)<sup>2</sup> = (a − b)<sup>2</sup>.</p>
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
        text: "Wähle die 3. Formel: Finde a und b, bei denen das umgelegte Rechteck genau 24 FE groß ist.",
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

export const STAGE_TERME_GLEICHUNGEN: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Terme und Gleichungen",
  subtitle: "Vereinfachen, ausmultiplizieren, faktorisieren, Extremwerte finden und Gleichungen lösen",
  icon: "🧩",
  accent: "#d97706",
  badgeTitle: "Termtüftler",
  lehrplanLabel: "LB 4 (I) · LB 3 (II/III)",
  lessons: [terme, ausmultiplizieren, binomischeFormeln],
};

