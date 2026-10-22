import { fmt, fmtUnit, fracHtml, fracText, gcd, paren, shifted, sqrtHtml, term, vertexForm } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  approxText,
  basicSets,
  exponentText,
  LADDER_BASES,
  ladderValue,
  mirrorCase,
  mirrorPoints,
  MIRROR_EXPONENTS,
  powerEquationSolutions,
  powerOf,
  SHIFT_EXPONENTS,
  shiftedPowerText,
  shiftedSets,
  supInt,
  ZOO_EXPONENTS,
} from "../lab/views-potenzen";
import type { AnswerField, DifficultyLevel, ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-4-potenzen";
const LEHRPLAN = "M10 LB 3 (I): Potenzen und Potenzfunktionen";

// ─── Helpers of this stage ─────────────────────────────────────────────────

/** A fraction p/q in lowest terms with a positive denominator. */
type Ratio = [number, number];

function ratio(p: number, q: number): Ratio {
  const g = gcd(p, q);
  const sign = q < 0 ? -1 : 1;
  return [(sign * p) / g, (sign * q) / g];
}

const plus = (x: Ratio, y: Ratio): Ratio => ratio(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const minus = (x: Ratio, y: Ratio): Ratio => plus(x, [-y[0], y[1]]);
const times = (x: Ratio, y: Ratio): Ratio => ratio(x[0] * y[0], x[1] * y[1]);
const val = (x: Ratio) => x[0] / x[1];
const rt = (x: Ratio) => fracText(x[0], x[1]);
/** A ratio in brackets when negative: "2/3 · (−3/4)". */
const prt = (x: Ratio) => (x[0] < 0 ? `(${rt(x)})` : rt(x));

/** "=" when the value is exact at `digits` decimals, "≈" otherwise. */
function eq(value: number, digits = 2): string {
  return Math.abs(value - Number(value.toFixed(digits))) < 1e-9 ? "=" : "≈";
}

/** " ≈ 0,83" behind a fraction that is no whole number. */
function decimal(x: Ratio): string {
  return x[1] === 1 ? "" : ` ${eq(val(x))} ${fmt(val(x), 2)}`;
}

/** "2/3 + 1/2 = 4/6 + 3/6 = 7/6": a sum or difference of exponents over a common denominator. */
function combineText(x: Ratio, y: Ratio, op: "+" | "−"): string {
  const signed: Ratio = op === "+" ? y : [-y[0], y[1]];
  const result = plus(x, signed);
  const shownOp = signed[0] < 0 ? "−" : "+";
  const abs: Ratio = [Math.abs(y[0]), y[1]];
  const common = (x[1] * y[1]) / gcd(x[1], y[1]);
  const raw = (p: number) => `${p < 0 ? "−" : ""}${Math.abs(p)}/${common}`;
  const middle = x[1] === y[1] || common === 1 ? "" : ` = ${raw((x[0] * common) / x[1])} ${shownOp} ${raw((abs[0] * common) / abs[1])}`;
  return `${rt(x)} ${shownOp} ${rt(abs)}${middle} = ${rt(result)}`;
}

/** The n-th root in HTML: the index as a small raised number before the root sign. */
function rootHtml(n: number | string, radicand: string | number): string {
  return n === 2 ? sqrtHtml(radicand) : `<sup>${n}</sup>${sqrtHtml(radicand)}`;
}

/** base^e in HTML; the exponent 1 is left out. */
function powHtml(base: string, e: Ratio): string {
  return e[0] === e[1] ? base : `${base}<sup>${rt(e)}</sup>`;
}

/** x to a whole power in HTML: "x", "x<sup>3</sup>". */
const xPow = (m: number, x = "x") => (m === 1 ? x : `${x}<sup>${m}</sup>`);

/** "x + 2", "x − 3" or "x": the radicand or bracket content v + s. */
function sumText(v: string, s: number): string {
  return s === 0 ? v : s > 0 ? `${v} + ${fmt(s)}` : `${v} − ${fmt(-s)}`;
}

/** "(y − 3)" or "y": y − d as a factor. */
const lessD = (v: string, d: number) => (d === 0 ? v : `(${sumText(v, -d)})`);

/** The factor in front of a term: "", "−", "2", "−0,5". */
const factor = (a: number) => (a === 1 ? "" : a === -1 ? "−" : fmt(a));

/** The factor written as a product in front of a root: "", "−", "2 · ". */
const rootFactor = (a: number) => (a === 1 ? "" : a === -1 ? "−" : `${fmt(a)} · `);

/** y = a(x + b)^c + d in HTML, with the exponent written as given. */
function powerTermHtml(a: number, b: number, c: string, d: number): string {
  return `y = ${factor(a)}${shifted(-b)}<sup>${c}</sup>${term(d, "", false)}`;
}

/** A coordinate as the board writes it: 0,125, or 1/81 when the decimal does not end. */
function coord(value: number): string {
  if (Math.abs(value - Number(value.toFixed(4))) < 1e-12) return fmt(value, 4);
  const inverse = Math.round(1 / value);
  if (inverse !== 0 && Math.abs(1 / value - inverse) < 1e-9 * Math.abs(inverse)) return fracText(1, inverse);
  return fmt(value, 4);
}

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

const SETS = ["ℝ", "ℝ ∖ {0}", "ℝ₀⁺", "ℝ⁺"];
const SYMMETRIES = ["achsensymmetrisch zur y-Achse", "punktsymmetrisch zum Ursprung"];
const COUNTS = ["keine", "eine", "zwei"];

// 4.1 Potenzen mit rationalen Exponenten ──────────────────────────────────────

/** Whole-number roots for mental arithmetic: (root, index), root^index ≤ 1000. */
const PERFECT: Array<[number, number]> = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [5, 4], [6, 2], [7, 2], [10, 2], [10, 3]];

/** Mammals whose mass is a fourth power k⁴ kg, for Kleiber's law G = 70 · m^(3/4). */
const ANIMALS = [
  { article: "ein", name: "Kaninchen", k: 1 },
  { article: "ein", name: "Hund", k: 2 },
  { article: "ein", name: "Mensch", k: 3 },
  { article: "ein", name: "Bär", k: 4 },
  { article: "ein", name: "Pferd", k: 5 },
  { article: "eine", name: "Giraffe", k: 6 },
  { article: "ein", name: "Nashorn", k: 7 },
  { article: "ein", name: "Elefant", k: 8 },
];

const EXPONENTS: Ratio[] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [3, 2], [5, 2], [4, 3], [5, 4], [-1, 2], [-1, 3], [-2, 3], [-3, 4], [2, 1], [3, 1], [-1, 1]];
const INNER: Ratio[] = [[1, 2], [2, 3], [3, 4], [-1, 2], [1, 3], [2, 1], [-1, 1], [3, 2]];
const SECOND: Ratio[] = [[1, 2], [1, 1], [3, 2], [-1, 2], [1, 3], [2, 1], [-2, 1], [-1, 1]];

const potenzgesetze: Lesson = {
  id: "pt-1-potenzgesetze",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Potenzen mit rationalen Exponenten",
  subtitle: "Nenner heißt Wurzel, Minus heißt Kehrwert",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Potenzgesetze`,
  whyItMatters:
    "Formeln aus Biologie und Physik enthalten Exponenten wie 3/4 oder −2, etwa der Energiebedarf eines Tieres oder die Helligkeit einer Lampe im Abstand r. Mit den Potenzgesetzen rechnest du mit ihnen wie mit ganzen Exponenten.",
  explanationHtml: `
    <p>Bisher waren Exponenten natürliche Zahlen: a³ = a · a · a. Die Potenzgesetze legen fest, was andere Exponenten bedeuten müssen, damit die Gesetze weiter gelten:</p>
    <ul>
      <li><strong>Exponent 0:</strong> a<sup>0</sup> = 1 für a ≠ 0, denn a<sup>3</sup> : a<sup>3</sup> = a<sup>3 − 3</sup> = a<sup>0</sup> und zugleich = 1.</li>
      <li><strong>Negativer Exponent:</strong> a<sup>−n</sup> = 1 : a<sup>n</sup> für a ≠ 0, zum Beispiel 2<sup>−3</sup> = 1/8. Das Minus bildet den Kehrwert, es macht die Zahl nicht negativ.</li>
      <li><strong>Stammbruch im Exponenten:</strong> a<sup>1/n</sup> = ${rootHtml("n", "a")}, denn (a<sup>1/n</sup>)<sup>n</sup> = a<sup>n/n</sup> = a. So ist 8<sup>1/3</sup> = ${rootHtml(3, 8)} = 2.</li>
      <li><strong>Bruch im Exponenten:</strong> a<sup>m/n</sup> = ${rootHtml("n", "a<sup>m</sup>")} = (${rootHtml("n", "a")})<sup>m</sup>. Der Nenner sagt, welche Wurzel gezogen wird, der Zähler, womit potenziert wird.</li>
    </ul>
    <p>Für a, b &gt; 0 und rationale Exponenten r, s gelten die fünf <strong>Potenzgesetze</strong>:</p>
    <table class="mini">
      <tr><th>Gesetz</th><th>Beispiel</th></tr>
      <tr><td>a<sup>r</sup> · a<sup>s</sup> = a<sup>r + s</sup></td><td>x<sup>1/2</sup> · x<sup>1/3</sup> = x<sup>5/6</sup></td></tr>
      <tr><td>a<sup>r</sup> : a<sup>s</sup> = a<sup>r − s</sup></td><td>x<sup>3/4</sup> : x<sup>1/4</sup> = x<sup>1/2</sup></td></tr>
      <tr><td>a<sup>r</sup> · b<sup>r</sup> = (a · b)<sup>r</sup></td><td>2<sup>1/2</sup> · 8<sup>1/2</sup> = 16<sup>1/2</sup> = 4</td></tr>
      <tr><td>a<sup>r</sup> : b<sup>r</sup> = (a : b)<sup>r</sup></td><td>54<sup>1/3</sup> : 2<sup>1/3</sup> = 27<sup>1/3</sup> = 3</td></tr>
      <tr><td>(a<sup>r</sup>)<sup>s</sup> = a<sup>r · s</sup></td><td>(x<sup>2/3</sup>)<sup>6</sup> = x<sup>4</sup></td></tr>
    </table>
    <div class="example">Ohne Taschenrechner: 8<sup>2/3</sup> = (${rootHtml(3, 8)})² = 2² = 4. 27<sup>−1/3</sup> = 1 : ${rootHtml(3, 27)} = 1/3. 16<sup>0,75</sup> = 16<sup>3/4</sup> = (${rootHtml(4, 16)})³ = 2³ = 8.</div>
    <p>Brüche im Exponenten gibt es nur für eine nichtnegative Basis (bei negativem Exponenten a &gt; 0), denn nur dort sind die Wurzeln eindeutig.</p>
    <div class="merke"><strong>Merke:</strong> Nenner heißt Wurzel, Zähler heißt Potenz, Minus heißt Kehrwert. Bei gleicher Basis werden die Exponenten beim Multiplizieren addiert, beim Dividieren subtrahiert und beim Potenzieren multipliziert.</div>
  `,
  formulas: [
    { name: "Bruch im Exponenten", html: `a<sup>m/n</sup> = ${rootHtml("n", "a<sup>m</sup>")} = (${rootHtml("n", "a")})<sup>m</sup>`, quantities: "a > 0, m ganz, n natürlich; Nenner = Wurzel, Zähler = Potenz" },
    { name: "Negativer Exponent", html: "a<sup>−r</sup> = 1 : a<sup>r</sup>", quantities: "a ≠ 0; das Minus bildet den Kehrwert" },
    { name: "Potenzgesetze", html: "a<sup>r</sup> · a<sup>s</sup> = a<sup>r + s</sup>; a<sup>r</sup> : a<sup>s</sup> = a<sup>r − s</sup>; (a<sup>r</sup>)<sup>s</sup> = a<sup>r · s</sup>", quantities: "dazu aʳ · bʳ = (a · b)ʳ und aʳ : bʳ = (a : b)ʳ" },
  ],
  quiz: {
    question: "Welchen Wert hat 8 hoch 2/3?",
    options: ["16/3", "4", "2", "64"],
    correctIndex: 1,
    explanation: "8 hoch 2/3 = (∛8)² = 2² = 4. Der Nenner 3 heißt dritte Wurzel, der Zähler 2 heißt quadrieren; 2/3 ist kein Faktor.",
  },
  lab: {
    kind: "power-rules",
    title: "Labor: Die Potenzleiter",
    intro: "Jede Stufe nach rechts heißt mal a, jede nach links geteilt durch a. Ziehe die Enden der beiden Pfeile: Zwei Potenzen malnehmen heißt, ihre Pfeile aneinanderzuhängen. Mit dem Nenner q teilst du jede Stufe in q gleiche Teilstufen.",
    params: [
      { type: "choice", key: "a", label: "Basis a", options: LADDER_BASES.map((a) => ({ value: a, label: String(a) })), value: 2 },
      {
        type: "choice",
        key: "q",
        label: "Nenner q der Exponenten",
        options: [
          { value: 1, label: "1 (ganze Zahlen)" },
          { value: 2, label: "2 (Halbe)" },
          { value: 3, label: "3 (Drittel)" },
          { value: 4, label: "4 (Viertel)" },
        ],
        value: 1,
      },
      { type: "range", key: "m", label: "Zähler m des ersten Exponenten r = m/q", unit: "", min: -4, max: 4, step: 1, value: 2 },
      { type: "range", key: "n", label: "Zähler n des zweiten Exponenten s = n/q", unit: "", min: -4, max: 4, step: 1, value: 1 },
    ],
    readouts: [
      { key: "r", label: "erster Exponent r", compute: (v) => fracText(v.m, v.q) },
      { key: "s", label: "zweiter Exponent s", compute: (v) => fracText(v.n, v.q) },
      { key: "product", label: "aʳ · aˢ (Werte malgenommen)", compute: (v) => approxText(ladderValue(v.a, v.m, v.q) * ladderValue(v.a, v.n, v.q)) },
      { key: "power", label: "aʳ⁺ˢ (Exponenten addiert)", emphasis: true, compute: (v) => approxText(ladderValue(v.a, v.m + v.n, v.q)) },
    ],
    goals: [
      { id: "eins", text: "Nimm zwei Potenzen mit Exponenten ungleich 0 so mal, dass 1 herauskommt.", check: (v) => v.m !== 0 && v.n !== 0 && v.m + v.n === 0 },
      { id: "wurzel", text: "Basis 9: Finde zwei gleiche Exponenten r mit 9ʳ · 9ʳ = 9. Welchen Wert hat dann 9ʳ?", check: (v) => v.a === 9 && v.m === v.n && v.m + v.n === v.q },
      { id: "acht", text: "Basis 8: Erzeuge den Wert 4 als Produkt aus einer Potenz mit positivem und einer mit negativem Exponenten.", check: (v) => v.a === 8 && v.m * v.n < 0 && 3 * (v.m + v.n) === 2 * v.q },
    ],
  },
  exercises: [
    {
      id: "wert",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const [r, n] = rng.pick(PERFECT);
          const a = r ** n;
          const m = rng.pick([-3, -2, -1, 1, 2, 3].filter((k) => gcd(k, n) === 1));
          const value = r ** m;
          const e = fracText(m, n);
          const slips = [
            { value: (a * m) / n, hint: "Der Exponent ist kein Faktor: Bei a hoch m/n ziehst du die n-te Wurzel und potenzierst dann mit m." },
            { value: a ** (n / m), hint: "Zähler und Nenner vertauscht? Der Nenner des Exponenten gibt die Wurzel an, der Zähler die Potenz." },
          ];
          if (m < 0) {
            slips.push(
              { value: r ** -m, hint: "Das Minus im Exponenten heißt Kehrwert: a hoch −r = 1 : a hoch r." },
              { value: -(r ** -m), hint: "Ein negativer Exponent macht die Zahl nicht negativ, er bildet den Kehrwert." },
            );
          }
          if (m > 1) slips.push({ value: r, hint: "Das ist erst die Wurzel. Potenziere sie noch mit dem Zähler." });
          return {
            prompt: `Berechne ohne Taschenrechner: ${a}<sup>${e}</sup>`,
            given: [`Basis ${a}, Exponent ${e}`],
            formulaHint: `a<sup>m/n</sup> = (${rootHtml("n", "a")})<sup>m</sup> und a<sup>−r</sup> = 1 : a<sup>r</sup>`,
            fields: [numberField(`${a}<sup>${e}</sup> =`, value, "", 4, { slips })],
            steps: [
              `Nenner ${n}: ${rootHtml(n, a)} = ${r}, denn ${r}<sup>${n}</sup> = ${a}.`,
              m > 0
                ? `Zähler ${m}: ${a}<sup>${e}</sup> =${m === 1 ? "" : ` ${r}<sup>${m}</sup> =`} <strong>${fmt(value)}</strong>`
                : `Das Minus heißt Kehrwert: ${a}<sup>${e}</sup> = 1 : ${-m === 1 ? r : `${r}<sup>${-m}</sup>`} = <strong>${fracHtml(1, r ** -m)} ${eq(value, 4)} ${fmt(value, 4)}</strong>`,
            ],
            meta: { a, r, n, m, value },
          };
        }
        if (rng.next() < 0.5) {
          const i = rng.int(0, ANIMALS.length - 2);
          const j = rng.int(i + 1, ANIMALS.length - 1);
          const [A, B] = [ANIMALS[i], ANIMALS[j]];
          const [m1, m2] = [A.k ** 4, B.k ** 4];
          const G = 70 * B.k ** 3;
          const ratioG = (B.k / A.k) ** 3;
          return {
            prompt: `Den Grundumsatz G eines Säugetiers (seinen Energiebedarf in Ruhe) schätzt man mit dem Gesetz von Kleiber ab: G = 70 · m<sup>3/4</sup> (m in kg, G in kcal pro Tag). ${A.article === "ein" ? "Ein" : "Eine"} ${A.name} wiegt ${fmt(m1)} kg, ${B.article} ${B.name} ${fmt(m2)} kg. Berechne den Grundumsatz des schwereren Tieres und gib an, wievielmal so groß er ist wie der des leichteren.`,
            given: ["G = 70 · m<sup>3/4</sup>", `m₁ = ${fmtUnit(m1, "kg")} (${A.name})`, `m₂ = ${fmtUnit(m2, "kg")} (${B.name})`],
            fields: [
              numberField("G₂ =", G, "kcal", 0, {
                slips: [
                  { value: 70 * m2 * 0.75, hint: "3/4 ist ein Exponent, kein Faktor: erst die vierte Wurzel ziehen, dann hoch 3." },
                  { value: 70 * B.k, hint: "Das ist erst die vierte Wurzel. Sie muss noch hoch 3 genommen werden." },
                ],
              }),
              numberField("Faktor:", ratioG, "", 2, {
                slips: [
                  { value: m2 / m1, hint: "Das ist das Verhältnis der Massen. Der Grundumsatz wächst nur mit m hoch 3/4." },
                  { value: (m2 / m1) ** (4 / 3), hint: "Exponent 3/4, nicht 4/3: erst die vierte Wurzel, dann hoch 3." },
                ],
              }),
            ],
            steps: [
              `m₂<sup>3/4</sup> = (${rootHtml(4, fmt(m2))})³ = ${B.k}³ = ${fmt(B.k ** 3)}, also G₂ = 70 · ${fmt(B.k ** 3)} = ${fmt(G)} kcal.`,
              `Faktor: G₂ : G₁ = (m₂ : m₁)<sup>3/4</sup> = (${fmt(m2)} : ${fmt(m1)})<sup>3/4</sup> = (${B.k} : ${A.k})³ ${eq(ratioG, 3)} ${fmt(ratioG, 3)}`,
              `<strong>G₂ = ${fmt(G)} kcal, Faktor ${eq(ratioG)} ${fmt(ratioG, 2)}</strong>: Die Masse ist ${fmt(m2 / m1, 1)}-mal so groß, der Grundumsatz nur ${fmt(ratioG, 2)}-mal.`,
            ],
            meta: { m1, m2, G, factor: ratioG },
          };
        }
        const V = rng.pick([20, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1500, 2000]);
        const edge = Math.cbrt(V);
        const O = 6 * V ** (2 / 3);
        return {
          prompt: `Ein würfelförmiges Gefäß hat das Volumen V = ${fmt(V)} cm³. Berechne seine Kantenlänge a und seine Oberfläche O. Schreibe dafür a und O als Potenzen von V.`,
          given: [`V = ${fmtUnit(V, "cm³")}`],
          fields: [
            numberField("a =", edge, "cm", 2, {
              slips: [
                { value: V / 3, hint: "a³ = V: Gesucht ist die dritte Wurzel, nicht ein Drittel von V." },
                { value: Math.sqrt(V), hint: "Ein Würfel hat drei gleiche Kanten: a = V hoch 1/3, die dritte Wurzel." },
              ],
            }),
            numberField("O =", O, "cm²", 2, {
              slips: [
                { value: 4 * V, hint: "2/3 ist ein Exponent: O = 6 · V hoch 2/3, nicht 6 · V · 2/3." },
                { value: 6 * edge, hint: "O = 6 · a²: Die Kante wird quadriert." },
                { value: V ** (2 / 3), hint: "Ein Würfel hat 6 Seitenflächen: O = 6 · a²." },
              ],
            }),
          ],
          steps: [
            `a³ = V ⇒ a = ${rootHtml(3, "V")} = V<sup>1/3</sup> = ${fmt(V)}<sup>1/3</sup> ≈ ${fmtUnit(edge, "cm")}`,
            "O = 6 · a² = 6 · (V<sup>1/3</sup>)² = 6 · V<sup>2/3</sup>",
            `O = 6 · ${fmt(V)}<sup>2/3</sup> ≈ <strong>${fmtUnit(O, "cm²")}</strong> (mit a ≈ ${fmtUnit(edge, "cm")})`,
          ],
          meta: { V, edge, O },
        };
      }),
    },
    {
      id: "gesetze",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const rule = rng.int(0, 2);
          const r = rng.pick(EXPONENTS);
          const s = rng.pick(EXPONENTS);
          const k = rule === 0 ? plus(r, s) : rule === 1 ? minus(r, s) : times(r, s);
          const shown = rule === 0 ? `${powHtml("x", r)} · ${powHtml("x", s)}` : rule === 1 ? `${powHtml("x", r)} : ${powHtml("x", s)}` : `(${powHtml("x", r)})<sup>${rt(s)}</sup>`;
          const hint = ["a<sup>r</sup> · a<sup>s</sup> = a<sup>r + s</sup>", "a<sup>r</sup> : a<sup>s</sup> = a<sup>r − s</sup>", "(a<sup>r</sup>)<sup>s</sup> = a<sup>r · s</sup>"][rule];
          const slip = [
            { value: val(times(r, s)), hint: "Beim Malnehmen von Potenzen mit gleicher Basis werden die Exponenten addiert, nicht multipliziert." },
            { value: val(plus(r, s)), hint: "Beim Teilen von Potenzen mit gleicher Basis werden die Exponenten subtrahiert, nicht addiert." },
            { value: val(plus(r, s)), hint: "Potenz einer Potenz: Die Exponenten werden multipliziert, nicht addiert." },
          ][rule];
          const work = [
            `Gleiche Basis, malnehmen: Exponenten addieren. ${combineText(r, s, "+")}`,
            `Gleiche Basis, teilen: Exponenten subtrahieren. ${combineText(r, s, "−")}`,
            `Potenz einer Potenz: Exponenten multiplizieren. ${rt(r)} · ${prt(s)} = ${rt(k)}`,
          ][rule];
          return {
            prompt: `Schreibe ${shown} als eine Potenz x<sup>k</sup> (x > 0) und gib k an.`,
            given: [shown],
            formulaHint: hint,
            fields: [numberField("k =", val(k), "", 2, { slips: [slip] })],
            steps: [work, `<strong>${shown} = ${powHtml("x", k)}</strong>, also k = ${rt(k)}${decimal(k)}`],
            meta: { rule, rp: r[0], rq: r[1], sp: s[0], sq: s[1] },
          };
        }
        let e1: Ratio = [1, 2];
        let f1: Ratio = [1, 2];
        let e2: Ratio = [1, 2];
        let f2: Ratio = [1, 2];
        let t = 2;
        let multiply = true;
        let k: Ratio = [0, 1];
        let l: Ratio = [0, 1];
        for (let tries = 0; tries < 20 && (k[0] === 0 || l[0] === 0); tries++) {
          e1 = rng.pick(INNER);
          f1 = rng.pick(INNER);
          e2 = rng.pick(SECOND);
          f2 = rng.pick(SECOND);
          t = rng.pick([2, 3, 4, 6]);
          multiply = rng.next() < 0.5;
          k = multiply ? plus(times(e1, [t, 1]), e2) : minus(times(e1, [t, 1]), e2);
          l = multiply ? plus(times(f1, [t, 1]), f2) : minus(times(f1, [t, 1]), f2);
        }
        const op = multiply ? "·" : ":";
        const shown = `(${powHtml("a", e1)} · ${powHtml("b", f1)})<sup>${t}</sup> ${op} (${powHtml("a", e2)} · ${powHtml("b", f2)})`;
        const [A1, B1] = [times(e1, [t, 1]), times(f1, [t, 1])];
        const sign = multiply ? "+" : "−";
        return {
          prompt: `Vereinfache den Term so weit wie möglich (a, b > 0) und schreibe ihn in der Form a<sup>k</sup> · b<sup>l</sup>: ${shown}`,
          given: [shown],
          fields: [
            numberField("k =", val(k), "", 2, { slips: [{ value: val(multiply ? plus(e1, e2) : minus(e1, e2)), hint: `Die Klammer steht hoch ${t}: Beide Exponenten in der Klammer werden mit ${t} malgenommen.` }] }),
            numberField("l =", val(l), "", 2, { slips: [{ value: val(multiply ? plus(f1, f2) : minus(f1, f2)), hint: `Die Klammer steht hoch ${t}: Beide Exponenten in der Klammer werden mit ${t} malgenommen.` }] }),
          ],
          steps: [
            `Klammer hoch ${t}, also jeden Exponenten mal ${t}: (${powHtml("a", e1)})<sup>${t}</sup> = ${powHtml("a", A1)} und (${powHtml("b", f1)})<sup>${t}</sup> = ${powHtml("b", B1)}`,
            `${multiply ? "Malnehmen: Exponenten addieren" : "Teilen: Exponenten subtrahieren"}. Bei a: ${combineText(A1, e2, sign)}; bei b: ${combineText(B1, f2, sign)}`,
            `<strong>${powHtml("a", k)} · ${powHtml("b", l)}</strong>, also k = ${rt(k)} und l = ${rt(l)}`,
          ],
          meta: { e1p: e1[0], e1q: e1[1], f1p: f1[0], f1q: f1[1], t, e2p: e2[0], e2q: e2[1], f2p: f2[0], f2q: f2[1], multiply: multiply ? 1 : 0 },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest mit Brüchen und negativen Zahlen im Exponenten so sicher wie mit ganzen.",
};

// 4.2 n-te Wurzeln ────────────────────────────────────────────────────────────

const METALS = [
  { name: "Gold", rho: 19.3 },
  { name: "Silber", rho: 10.5 },
  { name: "Kupfer", rho: 8.96 },
  { name: "Eisen", rho: 7.87 },
  { name: "Aluminium", rho: 2.7 },
];

const wurzeln: Lesson = {
  id: "pt-2-wurzeln",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 n-te Wurzeln und Potenzschreibweise",
  subtitle: "Die nichtnegative Lösung von xⁿ = a",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, n-te Wurzel`,
  whyItMatters:
    "Wie lang ist die Kante eines Würfels, der genau einen Liter fasst? Fragen nach Kanten und Radien führen auf Gleichungen wie x³ = 1000, und ihre Lösung ist eine Wurzel.",
  explanationHtml: `
    <p>Die Gleichung x³ = 64 hat genau eine Lösung, x = 4, denn 4³ = 64. Man schreibt ${rootHtml(3, 64)} = 4 und liest „dritte Wurzel aus 64“.</p>
    <p><strong>Definition:</strong> Für a ≥ 0 und eine natürliche Zahl n ≥ 2 ist ${rootHtml("n", "a")} die <strong>nichtnegative</strong> Lösung der Gleichung x<sup>n</sup> = a. n heißt Wurzelexponent, a Radikand. Für n = 2 schreibt man kurz ${sqrtHtml("a")}.</p>
    <ul>
      <li><strong>Potenzschreibweise:</strong> ${rootHtml("n", "a")} = a<sup>1/n</sup> und ${rootHtml("n", "a<sup>m</sup>")} = a<sup>m/n</sup>, zum Beispiel ${rootHtml(4, "x³")} = x<sup>3/4</sup> und x<sup>2/5</sup> = ${rootHtml(5, "x²")}.</li>
      <li><strong>Rechnen mit Wurzeln:</strong> In der Potenzschreibweise gelten die Potenzgesetze: ${rootHtml(3, "x")} · ${sqrtHtml("x")} = x<sup>1/3 + 1/2</sup> = x<sup>5/6</sup>.</li>
    </ul>
    <p><strong>Gleichungen x<sup>n</sup> = a</strong> haben je nach n und a verschieden viele Lösungen:</p>
    <table class="mini">
      <tr><th></th><th>a &gt; 0</th><th>a = 0</th><th>a &lt; 0</th></tr>
      <tr><th>n gerade</th><td>x = ±${rootHtml("n", "a")}</td><td>x = 0</td><td>keine Lösung</td></tr>
      <tr><th>n ungerade</th><td>x = ${rootHtml("n", "a")}</td><td>x = 0</td><td>x = −${rootHtml("n", "|a|")}</td></tr>
    </table>
    <div class="example">x⁴ = 81: 3⁴ = 81 und (−3)⁴ = 81, also x₁ = −3 und x₂ = 3. Die Wurzel ${rootHtml(4, 81)} = 3 ist nur die nichtnegative der beiden Lösungen. x³ = −8 hat die Lösung x = −2, denn (−2)³ = −8.</div>
    <p><strong>Warum nur a ≥ 0?</strong> Sonst würden sich die Regeln widersprechen: (−8)<sup>1/3</sup> wäre −2, aber (−8)<sup>2/6</sup> = ${rootHtml(6, "(−8)²")} = ${rootHtml(6, 64)} = 2, obwohl 1/3 = 2/6 ist. Deshalb sind Wurzeln und Brüche im Exponenten nur für nichtnegative Zahlen definiert. Die Gleichung x³ = −8 löst man trotzdem: x = −${rootHtml(3, 8)} = −2.</p>
    <div class="merke"><strong>Merke:</strong> ${rootHtml("n", "a")} ist nie negativ. Bei geradem n hat x<sup>n</sup> = a mit a &gt; 0 aber zwei Lösungen: x = ±${rootHtml("n", "a")}.</div>
  `,
  formulas: [
    { name: "n-te Wurzel", html: `${rootHtml("n", "a")} = x ⇔ x<sup>n</sup> = a und x ≥ 0`, quantities: "a ≥ 0, n natürlich, n ≥ 2" },
    { name: "Potenzschreibweise", html: `${rootHtml("n", "a<sup>m</sup>")} = a<sup>m/n</sup>`, quantities: "Wurzelexponent in den Nenner, Exponent unter der Wurzel in den Zähler" },
    { name: "Gleichung xⁿ = a", html: `n gerade, a &gt; 0: x = ±${rootHtml("n", "a")}; n ungerade: genau eine Lösung`, quantities: "n gerade und a < 0: keine Lösung" },
  ],
  quiz: {
    question: "Welche Lösungen hat die Gleichung x⁴ = 81?",
    options: ["nur x = 3", "x = 3 und x = −3", "x = 9 und x = −9", "keine"],
    correctIndex: 1,
    explanation: "3⁴ = 81 und (−3)⁴ = 81. Bei geradem Exponenten hat xⁿ = a mit a > 0 die Lösungen ±ⁿ√a; ∜81 = 3 ist nur die nichtnegative.",
  },
  lab: {
    kind: "root-power",
    title: "Labor: Die Wurzel als Schnittstelle",
    intro: "Blau ist der Graph von y = xⁿ für x ≥ 0, grau gestrichelt der Teil für x < 0. Ziehe die Gerade y = a: Die x-Koordinate des grünen Schnittpunkts ist ⁿ√a, die Lösungen der Gleichung xⁿ = a sind alle Schnittstellen.",
    params: [
      {
        type: "choice",
        key: "n",
        label: "Exponent n",
        options: [
          { value: 2, label: "2 (Quadratwurzel)" },
          { value: 3, label: "3 (dritte Wurzel)" },
          { value: 4, label: "4 (vierte Wurzel)" },
          { value: 5, label: "5 (fünfte Wurzel)" },
        ],
        value: 3,
      },
      { type: "range", key: "a", label: "Zahl a", unit: "", min: -16, max: 32, step: 0.5, value: 8, digits: 1 },
    ],
    readouts: [
      { key: "eq", label: "Gleichung", compute: (v) => `x${supInt(v.n)} = ${fmt(v.a)}` },
      { key: "root", label: "n-te Wurzel aus a", digits: 3, emphasis: true, compute: (v) => (v.a >= 0 ? v.a ** (1 / v.n) : "nicht definiert (a < 0)") },
      {
        key: "solutions",
        label: "Lösungen der Gleichung",
        compute: (v) => {
          const solutions = powerEquationSolutions(v.n, v.a);
          return solutions.length === 0 ? "keine" : solutions.map((x) => fmt(x, 3)).join(" und ");
        },
      },
    ],
    goals: [
      { id: "zwei-loesungen", text: "Stelle eine Gleichung xⁿ = a ein, deren Lösungen x = 3 und x = −3 sind.", check: (v) => v.n % 2 === 0 && v.a === 3 ** v.n },
      { id: "negativ", text: "Finde eine Gleichung xⁿ = a mit negativem a, die trotzdem eine Lösung hat.", check: (v) => v.n % 2 === 1 && v.a < 0 },
      { id: "fuenfte", text: "Bestimme 32 hoch 1/5: Stelle die passende Gleichung xⁿ = a ein.", check: (v) => v.n === 5 && v.a === 32 },
    ],
  },
  exercises: [
    {
      id: "umschreiben",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const n = rng.int(2, 6);
            const m = rng.pick([1, 2, 3, 4, 5, 7].filter((k) => k % n !== 0));
            const inverse = rng.next() < 0.3;
            const k = ratio(inverse ? -m : m, n);
            const radical = rootHtml(n, xPow(m));
            const shown = inverse ? `1 : ${radical}` : radical;
            const sign = inverse ? -1 : 1;
            const slips = [
              { value: (sign * n) / m, hint: "Zähler und Nenner vertauscht: Der Wurzelexponent kommt in den Nenner, der Exponent unter der Wurzel in den Zähler." },
              { value: sign * m * n, hint: "Die n-te Wurzel heißt hoch 1/n: Der Exponent wird durch n geteilt, nicht mit n malgenommen." },
            ];
            if (inverse) slips.push({ value: m / n, hint: "1 : … ist der Kehrwert, also ein negativer Exponent." });
            return {
              prompt: `Schreibe ${shown} als Potenz x<sup>k</sup> (x > 0) und gib k an.`,
              given: [shown],
              formulaHint: `${rootHtml("n", "x<sup>m</sup>")} = x<sup>m/n</sup> und 1 : x<sup>r</sup> = x<sup>−r</sup>`,
              fields: [numberField("k =", val(k), "", 2, { slips })],
              steps: [
                `${radical} = x<sup>${fracText(m, n)}</sup>: Der Wurzelexponent ${n} kommt in den Nenner, der Exponent ${m} in den Zähler.`,
                `${inverse ? `Der Kehrwert gibt das Minus: 1 : x<sup>${fracText(m, n)}</sup> = x<sup>${rt(k)}</sup>. ` : ""}<strong>k = ${rt(k)}</strong>${decimal(k)}`,
              ],
              meta: { dir: 0, n, m, inverse: inverse ? 1 : 0 },
            };
          }
          const n = rng.int(2, 7);
          const m = rng.pick([1, 2, 3, 4, 5, 7, 8].filter((k) => gcd(k, n) === 1));
          return {
            prompt: `Schreibe x<sup>${m}/${n}</sup> als Wurzel ${rootHtml("n", "x<sup>m</sup>")}. Wie heißen der Wurzelexponent n und der Exponent m unter der Wurzel?`,
            given: [`x<sup>${m}/${n}</sup>`],
            formulaHint: `x<sup>m/n</sup> = ${rootHtml("n", "x<sup>m</sup>")}`,
            fields: [numberField("n =", n, "", 0), numberField("m =", m, "", 0)],
            steps: [
              `Der Nenner ${n} wird zum Wurzelexponenten${n === 2 ? " (bei der Quadratwurzel schreibt man die 2 nicht)" : ""}, der Zähler ${m} zum Exponenten unter der Wurzel.`,
              `<strong>x<sup>${m}/${n}</sup> = ${rootHtml(n, xPow(m))}</strong>, also n = ${n} und m = ${m}`,
            ],
            meta: { dir: 1, n, m },
          };
        }
        if (rng.next() < 0.5) {
          const n1 = rng.pick([2, 3, 4, 6]);
          const n2 = rng.pick([2, 3, 4, 6].filter((k) => k !== n1));
          const m1 = rng.pick([1, 2, 3, 5].filter((k) => k % n1 !== 0));
          const m2 = rng.pick([1, 2, 3, 5].filter((k) => k % n2 !== 0));
          const e1 = ratio(m1, n1);
          const e2 = ratio(m2, n2);
          const multiply = rng.next() < 0.6 || val(e1) === val(e2);
          const k = multiply ? plus(e1, e2) : minus(e1, e2);
          const shown = `${rootHtml(n1, xPow(m1))} ${multiply ? "·" : ":"} ${rootHtml(n2, xPow(m2))}`;
          return {
            prompt: `Schreibe den Term als eine Potenz x<sup>k</sup> (x > 0) und gib k an: ${shown}`,
            given: [shown],
            fields: [
              numberField("k =", val(k), "", 2, {
                slips: [
                  multiply
                    ? { value: val(e1) * val(e2), hint: "Beim Malnehmen werden die Exponenten addiert, nicht multipliziert." }
                    : { value: val(e1) / val(e2), hint: "Beim Teilen werden die Exponenten subtrahiert, nicht dividiert." },
                ],
              }),
            ],
            steps: [
              `Potenzschreibweise: ${rootHtml(n1, xPow(m1))} = x<sup>${rt(e1)}</sup> und ${rootHtml(n2, xPow(m2))} = x<sup>${rt(e2)}</sup>`,
              `${multiply ? "Malnehmen: Exponenten addieren" : "Teilen: Exponenten subtrahieren"}: ${combineText(e1, e2, multiply ? "+" : "−")}`,
              `<strong>${shown} = x<sup>${rt(k)}</sup></strong>, also k = ${rt(k)}${decimal(k)}`,
            ],
            meta: { variant: 0, n1, m1, n2, m2, multiply: multiply ? 1 : 0 },
          };
        }
        const n = rng.pick([2, 3, 4]);
        const m = rng.int(1, 3);
        const p = rng.pick([2, 3, 4, 5]);
        const inner = plus([m, 1], [1, p]);
        const k = times(inner, [1, n]);
        const shown = rootHtml(n, `${xPow(m)} · ${rootHtml(p, "x")}`);
        return {
          prompt: `Schreibe den Term als eine Potenz x<sup>k</sup> (x > 0) und gib k an: ${shown}`,
          given: [shown],
          fields: [
            numberField("k =", val(k), "", 2, {
              slips: [
                { value: val(inner), hint: "Die äußere Wurzel fehlt noch: Ihr Exponent 1/n wird mit dem inneren Exponenten multipliziert." },
                { value: m / n + 1 / p, hint: "Die äußere Wurzel gilt für den ganzen Radikanden, auch für die innere Wurzel." },
              ],
            }),
          ],
          steps: [
            `Innen: ${xPow(m)} · ${rootHtml(p, "x")} = ${xPow(m)} · x<sup>1/${p}</sup> = x<sup>${rt(inner)}</sup>`,
            `Außen ${n === 2 ? "die Quadratwurzel" : `die ${n}. Wurzel`}, also hoch 1/${n}: ${rt(inner)} · 1/${n} = ${rt(k)}`,
            `<strong>${shown} = x<sup>${rt(k)}</sup></strong>, also k = ${rt(k)}${decimal(k)}`,
          ],
          meta: { variant: 1, n, m, p },
        };
      }),
    },
    {
      id: "gleichung",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const n = rng.pick([2, 3, 4, 5]);
          const negative = rng.next() < 0.35;
          const exact = rng.next() < 0.6;
          let base: number;
          let root: number;
          if (exact) {
            root = rng.int(1, n === 2 ? 12 : n === 3 ? 6 : n === 4 ? 4 : 3);
            base = root ** n;
          } else {
            base = rng.int(2, 300);
            while (Math.round(base ** (1 / n)) ** n === base) base += 1;
            root = base ** (1 / n);
          }
          const a = negative ? -base : base;
          const count = n % 2 === 0 ? (a > 0 ? 2 : 0) : 1;
          const slips = [
            { value: a / n, hint: "Nicht durch n teilen: Gesucht ist die Zahl, deren n-te Potenz a ist." },
            { value: -a / n, hint: "Nicht durch n teilen: Gesucht ist die Zahl, deren n-te Potenz a ist." },
          ];
          if (n !== 2) {
            const square = Math.sqrt(base);
            slips.push({ value: square, hint: `Hier ist die ${n}. Wurzel gesucht, nicht die Quadratwurzel.` }, { value: -square, hint: `Hier ist die ${n}. Wurzel gesucht, nicht die Quadratwurzel.` });
          }
          if (n % 2 === 1 && a < 0) slips.push({ value: root, hint: "Ungerader Exponent: (−x) hoch n ist negativ. Bei a < 0 ist die Lösung negativ." });
          const fields: AnswerField[] = [choiceField("Anzahl der Lösungen", COUNTS, count)];
          if (count === 2) fields.push(numberField("x₁ =", -root, "", 2, { slips }), numberField("x₂ =", root, "", 2, { slips }));
          if (count === 1) fields.push(numberField("x =", a > 0 ? root : -root, "", 2, { slips }));
          const r = fmt(root, 2);
          const steps =
            count === 2
              ? [`${n} ist gerade und ${fmt(a)} > 0: Es gibt zwei Lösungen, ${rootHtml(n, fmt(base))} und −${rootHtml(n, fmt(base))}.`, `<strong>x₁ ${eq(root)} −${r}, x₂ ${eq(root)} ${r}</strong>${exact ? `, denn (±${r})<sup>${n}</sup> = ${fmt(base)}` : ""}`]
              : count === 0
                ? [`${n} ist gerade: x<sup>${n}</sup> ist nie negativ, kann also nicht ${fmt(a)} sein.`, "<strong>keine Lösung</strong>"]
                : a > 0
                  ? [`${n} ist ungerade: genau eine Lösung, x = ${rootHtml(n, fmt(base))}.`, `<strong>x ${eq(root)} ${r}</strong>`]
                  : [`${n} ist ungerade: Die Lösung ist negativ, denn (−${r})<sup>${n}</sup> ${eq(root)} ${fmt(a)}. Die Wurzel aus ${fmt(a)} ist nicht definiert, also schreibt man x = −${rootHtml(n, fmt(base))}.`, `<strong>x ${eq(root)} −${r}</strong>`];
          return {
            prompt: `Löse die Gleichung x<sup>${n}</sup> = ${fmt(a)} (x ∈ ℝ)${exact ? "" : " und runde auf zwei Dezimalen"}.`,
            given: [`x<sup>${n}</sup> = ${fmt(a)}`],
            formulaHint: `n gerade: x = ±${rootHtml("n", "a")} für a &gt; 0, keine Lösung für a &lt; 0; n ungerade: genau eine Lösung`,
            fields,
            anyOrder: count === 2 ? [1, 2] : undefined,
            steps,
            meta: { n, a, count, root },
          };
        }
        if (rng.next() < 0.5) {
          const metal = rng.pick(METALS);
          const mass = rng.pick([0.5, 1, 2, 5, 10]);
          const V = (mass * 1000) / metal.rho;
          const edge = Math.cbrt(V);
          return {
            prompt: `Ein Barren aus ${metal.name} mit der Masse ${fmt(mass)} kg wird zu einem Würfel umgeschmolzen. ${metal.name} hat die Dichte ${fmt(metal.rho)} g/cm³. Berechne das Volumen und die Kantenlänge des Würfels.`,
            given: [`m = ${fmtUnit(mass, "kg")}`, `ρ = ${fmt(metal.rho)} g/cm³`],
            fields: [
              numberField("V =", V, "cm³", 2, { slips: [{ value: mass / metal.rho, hint: "Erst die Masse in Gramm umrechnen: 1 kg = 1000 g." }, { value: mass * 1000 * metal.rho, hint: "V = m : ρ, nicht m · ρ." }] }),
              numberField("a =", edge, "cm", 2, { slips: [{ value: Math.sqrt(V), hint: "Würfel: a³ = V, also die dritte Wurzel, nicht die Quadratwurzel." }, { value: V / 3, hint: "a³ = V heißt nicht a = V : 3." }] }),
            ],
            steps: [
              `V = m : ρ = ${fmt(mass * 1000)} g : ${fmt(metal.rho)} g/cm³ ≈ ${fmtUnit(V, "cm³")}`,
              `a³ = V ⇒ a = ${rootHtml(3, "V")} = V<sup>1/3</sup>`,
              `a = ${rootHtml(3, fmt(V, 2))} cm ≈ <strong>${fmtUnit(edge, "cm")}</strong>`,
            ],
            meta: { mass, rho: metal.rho, V, edge },
          };
        }
        const a0 = rng.pick([4, 5, 6, 8, 10, 12, 15, 20]);
        const k = rng.pick([2, 3, 4, 5, 10]);
        const edge = a0 * Math.cbrt(k);
        return {
          prompt: `Ein Würfel hat die Kantenlänge ${a0} cm. Ein zweiter Würfel soll das ${k === 2 ? "doppelte" : `${k}-fache`} Volumen haben. Wie lang muss seine Kante sein?`,
          given: [`a₁ = ${fmtUnit(a0, "cm")}`, `V₂ = ${k} · V₁`],
          fields: [
            numberField("a₂ =", edge, "cm", 2, {
              slips: [
                { value: a0 * k, hint: `Mit der ${k}-fachen Kante würde das Volumen ${k ** 3}-mal so groß.` },
                { value: a0 * Math.sqrt(k), hint: "Das Volumen hängt von a³ ab: dritte Wurzel, nicht Quadratwurzel." },
              ],
            }),
          ],
          steps: [
            `V₁ = ${a0}³ cm³ = ${fmt(a0 ** 3)} cm³, V₂ = ${k} · ${fmt(a0 ** 3)} cm³ = ${fmt(k * a0 ** 3)} cm³`,
            `a₂ = ${rootHtml(3, fmt(k * a0 ** 3))} cm = ${a0} · ${rootHtml(3, k)} cm`,
            `<strong>a₂ ≈ ${fmtUnit(edge, "cm")}</strong>`,
          ],
          meta: { a0, k, edge },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du übersetzt zwischen Wurzel und Potenz und weißt, wann xⁿ = a zwei, eine oder keine Lösung hat.",
};

// 4.3 Potenzfunktionen ────────────────────────────────────────────────────────

const INTEGER_EXPONENTS = [-4, -3, -2, -1, 2, 3, 4, 5];

/** Exponents with x-values that give readable function values. */
const VALUE_CASES: Array<{ c: Ratio; xs: number[] }> = [
  { c: [-3, 1], xs: [-2, 2, 0.5] },
  { c: [-2, 1], xs: [-2, 2, 0.5, 4] },
  { c: [-1, 1], xs: [-4, 4, 0.5, -0.25] },
  { c: [-1, 2], xs: [4, 9, 16, 25, 100] },
  { c: [1, 3], xs: [8, 27, 64, 0.125] },
  { c: [1, 2], xs: [4, 9, 16, 0.25] },
  { c: [2, 3], xs: [8, 27, 64] },
  { c: [3, 2], xs: [4, 9, 16] },
  { c: [2, 1], xs: [-3, 1.5, 2.5] },
  { c: [3, 1], xs: [-2, 1.5] },
  { c: [4, 1], xs: [-2, 1.5] },
];

/** Exponents and positive solutions x* for "P(x | y) lies on the graph". */
const POINT_CASES: Array<{ c: Ratio; xs: number[] }> = [
  { c: [2, 3], xs: [8, 27, 64, 0.125] },
  { c: [3, 2], xs: [4, 9, 16, 0.25] },
  { c: [-1, 2], xs: [4, 16, 25, 0.25] },
  { c: [1, 3], xs: [8, 27, 125] },
  { c: [1, 2], xs: [2.25, 6.25, 9, 0.25] },
  { c: [-2, 1], xs: [2, 4, 0.5] },
  { c: [2, 1], xs: [3, 1.5, 2.5] },
  { c: [4, 1], xs: [2, 3, 1.5] },
  { c: [3, 1], xs: [2, 3, 1.5] },
  { c: [-3, 1], xs: [2, 0.5] },
  { c: [-1, 1], xs: [4, 0.25, 2] },
];

const potenzfunktionen: Lesson = {
  id: "pt-3-potenzfunktionen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Potenzfunktionen y = xⁿ",
  subtitle: "Parabeln, Hyperbeln und Wurzelfunktionen",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Graphen`,
  whyItMatters:
    "Viele Gesetze der Natur sind Potenzfunktionen: Die Fläche wächst mit x², das Volumen mit x³, die Lautstärke nimmt mit 1 : r² ab. Wer die Grundgraphen kennt, sieht einer Formel sofort an, wie sie sich verhält.",
  explanationHtml: `
    <p>Funktionen mit einer Gleichung der Form <strong>y = x<sup>n</sup></strong> heißen <strong>Potenzfunktionen</strong>. Wie ihr Graph aussieht, verrät der Exponent:</p>
    <ul>
      <li><strong>Parabeln n-ter Ordnung</strong> (n = 2, 3, 4, …): 𝔻 = ℝ. Bei geradem n ist der Graph achsensymmetrisch zur y-Achse, 𝕎 = ℝ<sub>0</sub><sup>+</sup>, er geht durch (−1 | 1), (0 | 0) und (1 | 1). Bei ungeradem n ist er punktsymmetrisch zum Ursprung, 𝕎 = ℝ, er geht durch (−1 | −1), (0 | 0) und (1 | 1).</li>
      <li><strong>Hyperbeln n-ter Ordnung</strong> (y = x<sup>−n</sup> = 1 : x<sup>n</sup>): 𝔻 = ℝ ∖ {0}. Die Koordinatenachsen sind <strong>Asymptoten</strong>: Der Graph kommt den Geraden x = 0 und y = 0 beliebig nahe, ohne sie zu erreichen. Bei geradem n ist 𝕎 = ℝ<sup>+</sup> und der Graph achsensymmetrisch, bei ungeradem n ist 𝕎 = ℝ ∖ {0} und der Graph punktsymmetrisch.</li>
      <li><strong>Wurzelfunktionen</strong> (y = x<sup>1/n</sup> = ${rootHtml("n", "x")}): 𝔻 = 𝕎 = ℝ<sub>0</sub><sup>+</sup>, der Graph geht durch (0 | 0) und (1 | 1). Allgemein ist bei einem Bruch im Exponenten 𝔻 = ℝ<sub>0</sub><sup>+</sup>, bei einem negativen Bruch 𝔻 = ℝ<sup>+</sup>.</li>
    </ul>
    <p>Alle diese Graphen gehen durch (1 | 1). Zwischen 0 und 1 liegt y = x³ unter y = x², rechts von 1 darüber: Je größer der Exponent, desto flacher verläuft der Graph bei 0 und desto steiler rechts von 1.</p>
    <div class="example">y = x<sup>−2</sup>: f(2) = 1 : 2² = 0,25 und f(−2) = 1 : (−2)² = 0,25, der Graph ist symmetrisch zur y-Achse. y = x<sup>−3</sup>: f(−2) = 1 : (−2)³ = −0,125, der Graph ist punktsymmetrisch zum Ursprung.</div>
    <div class="merke"><strong>Merke:</strong> Gerader Exponent: symmetrisch zur y-Achse. Ungerader Exponent: symmetrisch zum Ursprung. Negativer Exponent: Hyperbel mit den Achsen als Asymptoten. Bruch im Exponenten: nur x ≥ 0.</div>
  `,
  formulas: [
    { name: "Potenzfunktion", html: "y = x<sup>n</sup>", quantities: "n gerade: symmetrisch zur y-Achse; n ungerade: symmetrisch zum Ursprung" },
    { name: "Hyperbel", html: "y = x<sup>−n</sup> = 1 : x<sup>n</sup>", quantities: "𝔻 = ℝ ∖ {0}, Asymptoten x = 0 und y = 0" },
    { name: "Wurzelfunktion", html: `y = x<sup>1/n</sup> = ${rootHtml("n", "x")}`, quantities: "𝔻 = 𝕎 = ℝ₀⁺" },
  ],
  quiz: {
    question: "Welcher Graph ist achsensymmetrisch zur y-Achse und hat die Koordinatenachsen als Asymptoten?",
    options: ["y = x⁻¹", "y = x⁻²", "y = x²", "y = √x"],
    correctIndex: 1,
    explanation: "Der Exponent −2 ist gerade (symmetrisch zur y-Achse) und negativ (Hyperbel mit den Asymptoten x = 0 und y = 0). y = x⁻¹ ist punktsymmetrisch zum Ursprung.",
  },
  lab: {
    kind: "power-graph",
    title: "Labor: Der Zoo der Potenzfunktionen",
    intro: "Wähle einen Exponenten und ziehe die Stelle x auf der x-Achse. P liegt auf dem Graphen, P′ an der Stelle −x: So siehst du die Symmetrie. Die schwarzen Punkte haben alle Graphen dieser Art gemeinsam.",
    params: [
      { type: "choice", key: "c", label: "Exponent", options: ZOO_EXPONENTS.map((c) => ({ value: c, label: exponentText(c) })), value: 2 },
      { type: "range", key: "x", label: "Stelle x von P", unit: "", min: -3, max: 3, step: 0.05, value: 1.5, digits: 2 },
    ],
    readouts: [
      { key: "D", label: "Definitionsmenge 𝔻", compute: (v) => basicSets(v.c).D },
      { key: "W", label: "Wertemenge 𝕎", compute: (v) => basicSets(v.c).W },
      { key: "sym", label: "Symmetrie", compute: (v) => basicSets(v.c).symmetry },
      { key: "asym", label: "Asymptoten", compute: (v) => basicSets(v.c).asymptotes },
      {
        key: "P",
        label: "Punkt P",
        emphasis: true,
        compute: (v) => {
          const y = powerOf(v.x, v.c);
          return Number.isFinite(y) ? `P(${fmt(v.x, 2)} | ${fmt(y, 3)})` : `x = ${fmt(v.x, 2)} liegt nicht in D`;
        },
      },
    ],
    goals: [
      { id: "hyperbel", text: "Wähle den Graphen, der achsensymmetrisch zur y-Achse ist und die beiden Koordinatenachsen als Asymptoten hat.", check: (v) => v.c === -2 },
      { id: "punkt", text: "Lege P auf den Punkt (−2 | −1/8). Welcher Exponent passt?", check: (v) => v.c === -3 && v.x === -2 },
      { id: "wurzel", text: "Wähle die Wurzelfunktion, deren Graph durch (4 | 2) geht, und lege P auf die Stelle mit y = 1,5.", check: (v) => v.c === 0.5 && v.x === 2.25 },
    ],
  },
  exercises: [
    {
      id: "eigenschaften",
      make: guarded((rng, level): ExerciseTask => {
        const c = rng.pick(INTEGER_EXPONENTS);
        const even = c % 2 === 0;
        const sets = basicSets(c);
        if (level === 1) {
          const x0 = rng.pick([-3, -2, 2, 3, -0.5, 0.5]);
          const value = x0 ** c;
          const slips = [{ value: x0 * c, hint: "Potenzieren heißt die Basis mit sich selbst malnehmen, nicht mit dem Exponenten." }];
          if (!even && x0 < 0) slips.push({ value: Math.abs(value), hint: "Ungerader Exponent: Das Minus der Basis bleibt erhalten." });
          if (c < 0) slips.push({ value: x0 ** -c, hint: "Negativer Exponent: Bilde den Kehrwert, 1 : x hoch n." });
          return {
            prompt: `Untersuche den Graphen der Potenzfunktion y = x<sup>${fmt(c)}</sup>: Welche Symmetrie hat er, welche Wertemenge, und welchen y-Wert hat er an der Stelle x = ${fmt(x0)}?`,
            given: [`y = x<sup>${fmt(c)}</sup>`, `x = ${fmt(x0)}`],
            formulaHint: "Gerader Exponent: achsensymmetrisch zur y-Achse; ungerader: punktsymmetrisch zum Ursprung; negativer Exponent: y = 1 : x<sup>n</sup>",
            fields: [
              choiceField("Symmetrie", SYMMETRIES, even ? 0 : 1),
              choiceField("Wertemenge 𝕎", SETS, SETS.indexOf(sets.W)),
              numberField(`f(${fmt(x0)}) =`, value, "", 4, { slips }),
            ],
            steps: [
              `Der Exponent ${fmt(c)} ist ${even ? "gerade" : "ungerade"}: Der Graph ist ${sets.symmetry}.`,
              c > 0 ? `Positiver Exponent: Parabel ${c}. Ordnung mit 𝔻 = ℝ und 𝕎 = ${sets.W}.` : `Negativer Exponent: Hyperbel y = 1 : ${xPow(-c)} mit 𝔻 = ℝ ∖ {0} und 𝕎 = ${sets.W}.`,
              `<strong>f(${fmt(x0)}) = ${paren(x0)}<sup>${fmt(c)}</sup> = ${c < 0 ? `1 : ${paren(x0 ** -c, 4)} = ` : ""}${coord(value)}</strong>${coord(value).includes("/") ? ` ≈ ${fmt(value, 4)}` : ""}`,
            ],
            meta: { c, x0, value },
          };
        }
        const x0 = rng.pick([2, -2, 0.5, -0.5, 3, -3]);
        const y0 = x0 ** c;
        return {
          prompt: `Der Graph einer Potenzfunktion mit der Gleichung y = x<sup>n</sup> (n ganz, n ≠ 0) verläuft durch den Punkt P(${coord(x0)} | ${coord(y0)}). Bestimme n. Welche Symmetrie hat der Graph, und hat er Asymptoten?`,
          given: [`P(${coord(x0)} | ${coord(y0)})`],
          fields: [
            numberField("n =", c, "", 0),
            choiceField("Symmetrie", SYMMETRIES, even ? 0 : 1),
            choiceField("Asymptoten", ["x = 0 und y = 0", "keine"], c < 0 ? 0 : 1),
          ],
          steps: [
            `${fmt(Math.abs(x0))}<sup>${fmt(c)}</sup> = ${coord(Math.abs(y0))}${x0 < 0 ? `, und auch das Vorzeichen passt: ${paren(x0)}<sup>${fmt(c)}</sup> = ${coord(y0)}` : ""}.`,
            `n = ${fmt(c)} ist ${even ? "gerade" : "ungerade"}: ${even ? SYMMETRIES[0] : SYMMETRIES[1]}. ${c < 0 ? "Negativer Exponent: Die Achsen x = 0 und y = 0 sind Asymptoten." : "Positiver Exponent: keine Asymptoten."}`,
            `<strong>n = ${fmt(c)}</strong>, also y = x<sup>${fmt(c)}</sup>`,
          ],
          meta: { c, x0, y0 },
        };
      }),
    },
    {
      id: "definitionsmenge",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const { c, xs } = rng.pick(VALUE_CASES);
          const x0 = rng.pick(xs);
          const ce = val(c);
          const y = powerOf(x0, ce);
          const sets = basicSets(ce);
          const fraction = c[1] !== 1;
          const slips = [{ value: x0 * ce, hint: "Der Exponent ist kein Faktor: Potenziere die Basis." }];
          if (ce < 0) slips.push({ value: powerOf(x0, -ce), hint: "Minus im Exponenten: Bilde den Kehrwert." });
          return {
            prompt: `Gib für die Funktion y = x<sup>${rt(c)}</sup> die Definitionsmenge 𝔻 und die Wertemenge 𝕎 an, und berechne den y-Wert an der Stelle x = ${fmt(x0)}.`,
            given: [`y = x<sup>${rt(c)}</sup>`, `x = ${fmt(x0)}`],
            formulaHint: "Bruch im Exponenten: 𝔻 = ℝ<sub>0</sub><sup>+</sup> (bei negativem Bruch ℝ<sup>+</sup>); negativer ganzer Exponent: 𝔻 = ℝ ∖ {0}",
            fields: [choiceField("Definitionsmenge 𝔻", SETS, SETS.indexOf(sets.D)), choiceField("Wertemenge 𝕎", SETS, SETS.indexOf(sets.W)), numberField(`f(${fmt(x0)}) =`, y, "", 2, { slips })],
            steps: [
              fraction
                ? `Bruch im Exponenten: Nur x ≥ 0 ist erlaubt${ce < 0 ? ", wegen des Minus sogar nur x > 0" : ""}, also 𝔻 = ${sets.D}. Die Werte sind ${ce < 0 ? "positiv" : "nicht negativ"}: 𝕎 = ${sets.W}.`
                : `Ganzer Exponent ${rt(c)}: 𝔻 = ${sets.D}, 𝕎 = ${sets.W} (${sets.symmetry}).`,
              `<strong>f(${fmt(x0)}) = ${paren(x0)}<sup>${rt(c)}</sup> = ${coord(y)}</strong>${coord(y).includes("/") ? ` ≈ ${fmt(y, 2)}` : ""}`,
            ],
            meta: { cp: c[0], cq: c[1], x0, y },
          };
        }
        const { c, xs } = rng.pick(POINT_CASES);
        const ce = val(c);
        const xStar = rng.pick(xs);
        const integer = c[1] === 1;
        const odd = integer && c[0] % 2 !== 0;
        const sign = odd ? rng.sign() : 1;
        const impossible = !odd && rng.next() < 0.2;
        const y0 = (impossible ? -1 : 1) * powerOf(sign * xStar, ce);
        const count = impossible ? 0 : integer && !odd ? 2 : 1;
        const sets = basicSets(ce);
        const inverse = ratio(c[1], c[0]);
        const fields: AnswerField[] = [choiceField("Anzahl der Punkte", ["keinen", "einen", "zwei"], count)];
        const slips = [{ value: Math.abs(y0) ** ce, hint: "Umkehren: Potenziere y mit dem Kehrwert des Exponenten." }];
        if (count === 2) fields.push(numberField("x₁ =", -xStar, "", 2, { slips }), numberField("x₂ =", xStar, "", 2, { slips }));
        if (count === 1) {
          if (!integer) slips.push({ value: -xStar, hint: "Bei einem Bruch im Exponenten ist nur x ≥ 0 erlaubt." });
          fields.push(numberField("x =", sign * xStar, "", 2, { slips }));
        }
        const steps =
          count === 0
            ? [`${integer ? `Der Exponent ${rt(c)} ist gerade` : "Bruch im Exponenten"}: x<sup>${rt(c)}</sup> ist nie negativ, kann also nicht ${coord(y0)} sein.`, "<strong>Es gibt keinen solchen Punkt.</strong>"]
            : count === 2
              ? [`x<sup>${rt(c)}</sup> = ${coord(y0)} ⇒ |x| = ${coord(y0)}<sup>${rt(inverse)}</sup> = ${fmt(xStar, 4)}`, `Gerader Exponent: Auch die Gegenzahl passt, denn (−${fmt(xStar, 4)})<sup>${rt(c)}</sup> = ${coord(y0)}.`, `<strong>zwei Punkte: x₁ = −${fmt(xStar, 4)}, x₂ = ${fmt(xStar, 4)}</strong>`]
              : integer
                ? [`x<sup>${rt(c)}</sup> = ${coord(y0)}: Ungerader Exponent, also genau eine Lösung mit dem Vorzeichen von y.`, `|x| = ${coord(Math.abs(y0))}<sup>${rt(inverse)}</sup> = ${fmt(xStar, 4)}`, `<strong>ein Punkt: x = ${fmt(sign * xStar, 4)}</strong>`]
                : [`x<sup>${rt(c)}</sup> = ${coord(y0)} ⇒ x = ${coord(y0)}<sup>${rt(inverse)}</sup> = ${fmt(xStar, 4)}`, `Nur x ≥ 0 gehört zu 𝔻 = ${sets.D}.`, `<strong>ein Punkt: x = ${fmt(xStar, 4)}</strong>`];
        return {
          prompt: `Ein Punkt P(x | ${coord(y0)}) soll auf dem Graphen von y = x<sup>${rt(c)}</sup> liegen. Wie viele solche Punkte gibt es, und welche x-Koordinaten haben sie?`,
          given: [`y = x<sup>${rt(c)}</sup>`, `y = ${coord(y0)}`],
          fields,
          anyOrder: count === 2 ? [1, 2] : undefined,
          steps,
          meta: { cp: c[0], cq: c[1], y0, count, x: sign * xStar },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst an Exponent und Vorzeichen, wie der Graph einer Potenzfunktion aussieht.",
};

// 4.4 Verschieben und Strecken ────────────────────────────────────────────────

const parameter: Lesson = {
  id: "pt-4-parameter",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Verschieben und Strecken: y = a(x + b)ᶜ + d",
  subtitle: "Mittelpunkt, Asymptoten, Definitions- und Wertemenge",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Definitionsmenge, Wertemenge, Asymptoten`,
  whyItMatters:
    "In Prüfungsaufgaben ist ein Graph fast nie der Grundgraph, sondern verschoben und gestreckt. An a, b und d liest du Asymptoten, Definitions- und Wertemenge ab, ohne eine Wertetabelle anzulegen.",
  explanationHtml: `
    <p>Aus dem Graphen von y = x<sup>c</sup> entsteht der Graph von <strong>y = a · (x + b)<sup>c</sup> + d</strong> in zwei Schritten:</p>
    <ol class="steps">
      <li><strong>Strecken mit a:</strong> Alle y-Werte werden mit a malgenommen. |a| &gt; 1 streckt, |a| &lt; 1 staucht, a &lt; 0 spiegelt zusätzlich an der x-Achse.</li>
      <li><strong>Verschieben mit b und d:</strong> um −b in x-Richtung und um d in y-Richtung. (x + 2) verschiebt also um 2 nach <strong>links</strong>, (x − 3) um 3 nach rechts.</li>
    </ol>
    <p>Der Ursprung wandert dabei nach <strong>M(−b | d)</strong>, der Punkt (1 | 1) nach (−b + 1 | d + a). Bei negativem c schneiden sich in M die <strong>Asymptoten x = −b und y = d</strong>.</p>
    <table class="mini">
      <tr><th>c</th><th>𝔻</th><th>𝕎 (für a &gt; 0)</th><th>Asymptoten</th></tr>
      <tr><td>−1, −3, …</td><td>ℝ ∖ {−b}</td><td>ℝ ∖ {d}</td><td>x = −b, y = d</td></tr>
      <tr><td>−2, −4, …</td><td>ℝ ∖ {−b}</td><td>{y | y &gt; d}</td><td>x = −b, y = d</td></tr>
      <tr><td>1/2, 1/3, …</td><td>{x | x ≥ −b}</td><td>{y | y ≥ d}</td><td>keine</td></tr>
      <tr><td>2, 4, …</td><td>ℝ</td><td>{y | y ≥ d}</td><td>keine</td></tr>
      <tr><td>3, 5, …</td><td>ℝ</td><td>ℝ</td><td>keine</td></tr>
    </table>
    <p>Bei a &lt; 0 kehrt sich in 𝕎 das Zeichen um: y &lt; d bzw. y ≤ d.</p>
    <div class="example">y = 2 · (x − 1)<sup>−2</sup> + 3: M(1 | 3), 𝔻 = ℝ ∖ {1}, 𝕎 = {y | y &gt; 3}, Asymptoten x = 1 und y = 3. Der Punkt P(2 | 5) liegt auf dem Graphen, denn 2 · 1<sup>−2</sup> + 3 = 5.</div>
    <div class="merke"><strong>Merke:</strong> Die Klammer (x + b) wird bei x = −b null. Dort liegt bei negativem c die senkrechte Asymptote und bei einem Bruch im Exponenten der Anfangspunkt des Graphen.</div>
  `,
  formulas: [
    { name: "Verschobene Potenzfunktion", html: "y = a · (x + b)<sup>c</sup> + d", quantities: "Ursprung → M(−b | d); a streckt in y-Richtung" },
    { name: "Asymptoten (c < 0)", html: "x = −b und y = d", quantities: "𝔻 = ℝ ∖ {−b}" },
    { name: "Bruch im Exponenten", html: "𝔻 = {x | x ≥ −b}", quantities: "𝕎 = {y | y ≥ d} für a > 0" },
  ],
  quiz: {
    question: "Welche Asymptoten hat der Graph von y = 2(x − 3)⁻¹ + 1?",
    options: ["x = 3 und y = 1", "x = −3 und y = 1", "x = 3 und y = 2", "x = 1 und y = 3"],
    correctIndex: 0,
    explanation: "Die Klammer wird bei x = 3 null: senkrechte Asymptote x = 3. Für große |x| geht 2(x − 3)⁻¹ gegen 0: waagrechte Asymptote y = 1. Der Faktor 2 streckt nur.",
  },
  lab: {
    kind: "power-shift",
    title: "Labor: Verschieben und Strecken",
    intro: "Ziehe den Punkt M(−b | d), um den Graphen zu verschieben, und den orangen Punkt, um ihn mit a zu strecken: Er liegt von M aus 1 nach rechts und a nach oben. Grau ist der Grundgraph y = xᶜ.",
    params: [
      { type: "choice", key: "c", label: "Exponent c", options: SHIFT_EXPONENTS.map((c) => ({ value: c, label: exponentText(c) })), value: -1 },
      { type: "range", key: "a", label: "Streckfaktor a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b (Verschiebung um −b nach rechts)", unit: "", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "d", label: "d (Verschiebung nach oben)", unit: "", min: -3, max: 3, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "eq", label: "Gleichung", emphasis: true, compute: (v) => shiftedPowerText(v.a, v.b, v.c, v.d) },
      { key: "M", label: "Punkt M(−b | d)", compute: (v) => `M(${fmt(-v.b)} | ${fmt(v.d)})` },
      { key: "D", label: "Definitionsmenge 𝔻", compute: (v) => shiftedSets(v.a, v.b, v.c, v.d).D },
      { key: "W", label: "Wertemenge 𝕎", compute: (v) => shiftedSets(v.a, v.b, v.c, v.d).W },
      { key: "asym", label: "Asymptoten", compute: (v) => shiftedSets(v.a, v.b, v.c, v.d).asymptotes },
    ],
    goals: [
      { id: "asymptoten", text: "Erzeuge eine Hyperbel mit den Asymptoten x = 2 und y = −1.", check: (v) => v.c < 0 && v.a !== 0 && v.b === -2 && v.d === -1 },
      { id: "wertemenge", text: "Stelle einen Graphen mit 𝔻 = ℝ ∖ {−3} und 𝕎 = {y | y < 2} ein.", check: (v) => v.c === -2 && v.b === 3 && v.d === 2 && v.a < 0 },
      { id: "wurzel", text: "Die Wurzelfunktion (c = 1/2) soll im Punkt (−2 | 1) beginnen und durch T(2 | 5) gehen.", check: (v) => v.c === 0.5 && v.b === 2 && v.d === 1 && v.a === 2 },
    ],
  },
  exercises: [
    {
      id: "asymptoten",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const c = rng.pick([-1, -2, -3]);
          const a = rng.pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]);
          const b = rng.int(1, 5) * rng.sign();
          const d = rng.int(-5, 5);
          const odd = c % 2 !== 0;
          const options = [`ℝ ∖ {${fmt(d)}}`, `{y | y > ${fmt(d)}}`, `{y | y < ${fmt(d)}}`];
          const index = odd ? 0 : a > 0 ? 1 : 2;
          const eqHtml = powerTermHtml(a, b, fmt(c), d);
          return {
            prompt: `Gib für den Graphen von ${eqHtml} die Gleichungen der Asymptoten und die Wertemenge an.`,
            given: [eqHtml],
            formulaHint: "y = a(x + b)<sup>c</sup> + d mit c &lt; 0: Asymptoten x = −b und y = d",
            fields: [
              numberField("senkrechte Asymptote: x =", -b, "", 2, { slips: [{ value: b, hint: "Die senkrechte Asymptote liegt dort, wo die Klammer null wird: x + b = 0, also x = −b." }] }),
              numberField("waagrechte Asymptote: y =", d, "", 2, { slips: [{ value: a, hint: "a streckt nur in y-Richtung. Die waagrechte Asymptote ist y = d." }] }),
              choiceField("Wertemenge 𝕎", options, index),
            ],
            steps: [
              `Die Klammer ${shifted(-b)} wird für x = ${fmt(-b)} null: Diese Stelle gehört nicht zu 𝔻, die Gerade x = ${fmt(-b)} ist senkrechte Asymptote.`,
              `Für große |x| wird ${factor(a)}${shifted(-b)}<sup>${fmt(c)}</sup> beliebig klein: y nähert sich ${fmt(d)}, die waagrechte Asymptote ist y = ${fmt(d)}.`,
              `<strong>𝕎 = ${options[index].replace("<", "&lt;").replace(">", "&gt;")}</strong>, denn ${odd ? `bei ungeradem Exponenten nimmt ${shifted(-b)}<sup>${fmt(c)}</sup> jeden Wert außer 0 an` : `${shifted(-b)}<sup>${fmt(c)}</sup> ist immer positiv${a > 0 ? "" : ", mal a &lt; 0 also negativ"}`}.`,
            ],
            meta: { a, b, c, d },
          };
        }
        const c = rng.pick([-1, -2, 0.5]);
        const b = rng.int(1, 4) * rng.sign();
        const d = rng.int(-4, 4);
        const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const t = c === -1 ? rng.pick([-4, -2, -1, 1, 2, 4]) : c === -2 ? rng.pick([-2, -1, 1, 2]) : rng.pick([1, 4, 9]);
        const xP = t - b;
        const tc = powerOf(t, c);
        const yP = a * tc + d;
        const cText = exponentText(c);
        const general = `y = a · (x + b)<sup>${cText}</sup> + d`;
        return {
          prompt:
            c < 0
              ? `Eine Hyperbel mit einer Gleichung der Form ${general} hat die Asymptoten x = ${fmt(-b)} und y = ${fmt(d)} und verläuft durch den Punkt P(${fmt(xP)} | ${fmt(yP)}). Bestimme a, b und d.`
              : `Der Graph einer Funktion mit der Gleichung ${general} beginnt im Punkt R(${fmt(-b)} | ${fmt(d)}) und verläuft durch den Punkt P(${fmt(xP)} | ${fmt(yP)}). Bestimme a, b und d.`,
          given: c < 0 ? [`Asymptoten x = ${fmt(-b)} und y = ${fmt(d)}`, `P(${fmt(xP)} | ${fmt(yP)})`] : [`R(${fmt(-b)} | ${fmt(d)})`, `P(${fmt(xP)} | ${fmt(yP)})`],
          fields: [
            numberField("a =", a, "", 2, { slips: [{ value: yP / tc, hint: "Erst d abziehen: y − d = a · (x + b) hoch c." }] }),
            numberField("b =", b, "", 2),
            numberField("d =", d, "", 2),
          ],
          steps: [
            c < 0 ? `Aus x = −b folgt b = ${fmt(b)}, aus der waagrechten Asymptote d = ${fmt(d)}.` : `Der Graph beginnt in R(−b | d): b = ${fmt(b)} und d = ${fmt(d)}.`,
            `P einsetzen: ${fmt(yP)} = a · (${sumText(fmt(xP), b)})<sup>${cText}</sup>${term(d, "", false)} ⇒ ${fmt(yP - d)} = a · ${paren(tc, 4)}`,
            `a = ${fmt(yP - d)} : ${paren(tc, 4)} = <strong>${fmt(a)}</strong>, also ${powerTermHtml(a, b, cText, d)}`,
          ],
          meta: { a, b, c, d, xP, yP },
        };
      }),
    },
    {
      id: "punkte",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          const c = rng.pick(SHIFT_EXPONENTS);
          const a = rng.pick([-2, -1, 0.5, 1, 2, 3]);
          const b = rng.int(-4, 4);
          const d = rng.int(-4, 4);
          const t = c === -1 ? rng.pick([-4, -2, -1, -0.5, 0.5, 1, 2, 4]) : c === -2 ? rng.pick([-2, -1, -0.5, 0.5, 1, 2]) : c === 0.5 ? rng.pick([0, 1, 4, 9, 0.25]) : c === 2 ? rng.int(-3, 3) : rng.int(-2, 2);
          const x0 = t - b;
          const tc = powerOf(t, c);
          const y = a * tc + d;
          const cText = exponentText(c);
          const eqHtml = powerTermHtml(a, b, cText, d);
          const slips: Array<{ value: number; hint: string }> = [];
          const wrongBracket = a * powerOf(x0 - b, c) + d;
          if (b !== 0 && Number.isFinite(wrongBracket)) slips.push({ value: wrongBracket, hint: "In der Klammer steht x + b: Setze x ein und addiere b." });
          if (a !== 1) slips.push({ value: tc + d, hint: "Nach dem Potenzieren noch mit a malnehmen, dann d addieren." });
          return {
            prompt: `Berechne den y-Wert des Punktes P(${fmt(x0)} | y) auf dem Graphen von ${eqHtml}.`,
            given: [eqHtml, `x = ${fmt(x0)}`],
            formulaHint: "x einsetzen: erst die Klammer, dann potenzieren, dann mit a malnehmen, dann d addieren",
            fields: [numberField("y =", y, "", 2, { slips })],
            steps: [
              b === 0 ? `Klammer: x = ${fmt(x0)}` : `Klammer: x ${b > 0 ? "+" : "−"} ${fmt(Math.abs(b))} = ${sumText(fmt(x0), b)} = ${fmt(t)}`,
              `Potenzieren: ${paren(t)}<sup>${cText}</sup> = ${fmt(tc, 4)}`,
              `<strong>y = ${fmt(a)} · ${paren(tc, 4)}${term(d, "", false)} = ${fmt(y, 2)}</strong>`,
            ],
            meta: { a, b, c, d, x0, y },
          };
        }
        if (rng.next() < 0.5) {
          const a = rng.pick([0.5, 1, 2, 3, -1, -2]);
          const u = rng.int(1, 3);
          const d = -a * u;
          const b = rng.int(0, 4);
          const xN = u * u - b;
          const y0 = a * Math.sqrt(b) + d;
          const eqHtml = powerTermHtml(a, b, "1/2", d);
          return {
            prompt: `Berechne die Koordinaten der Schnittpunkte des Graphen von ${eqHtml} mit den Koordinatenachsen.`,
            given: [eqHtml, `𝔻 = {x | x ≥ ${fmt(-b)}}`],
            fields: [
              numberField("Schnittpunkt mit der x-Achse: x =", xN, "", 2, { slips: [{ value: u - b, hint: "Nach dem Isolieren der Wurzel wird quadriert: √(x + b) = u ⇒ x + b = u²." }] }),
              numberField("Schnittpunkt mit der y-Achse: y =", y0, "", 2),
            ],
            steps: [
              `x-Achse (y = 0): ${rootFactor(a)}${sqrtHtml(sumText("x", b))} = ${fmt(-d)} ⇒ ${sqrtHtml(sumText("x", b))} = ${u} ⇒ ${sumText("x", b)} = ${u * u}${b === 0 ? "" : ` ⇒ x = ${fmt(xN)}`}`,
              `y-Achse (x = 0): y = ${rootFactor(a)}${sqrtHtml(b)}${term(d, "", false)} ${eq(y0)} ${fmt(y0, 2)}`,
              `<strong>N(${fmt(xN)} | 0) und S(0 | ${fmt(y0, 2)})</strong>`,
            ],
            meta: { kind: 0, a, b, d, xN, y0 },
          };
        }
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 6]);
        const d = rng.pick([-2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const xN = -a / d - b;
        const y0 = a / b + d;
        const eqHtml = powerTermHtml(a, b, "−1", d);
        return {
          prompt: `Berechne die Koordinaten der Schnittpunkte des Graphen von ${eqHtml} mit den Koordinatenachsen.`,
          given: [eqHtml, `𝔻 = ℝ ∖ {${fmt(-b)}}`],
          fields: [
            numberField("Schnittpunkt mit der x-Achse: x =", xN, "", 2, { slips: [{ value: -d / a - b, hint: "(x + b) hoch −1 = −d : a heißt x + b = −a : d, der Kehrwert." }] }),
            numberField("Schnittpunkt mit der y-Achse: y =", y0, "", 2),
          ],
          steps: [
            `x-Achse (y = 0): ${fmt(a)} · ${shifted(-b)}<sup>−1</sup> = ${fmt(-d)} ⇒ ${sumText("x", b)} = ${fmt(a)} : ${paren(-d)} = ${fmt(-a / d, 2)} ⇒ x ${eq(xN)} ${fmt(xN, 2)}`,
            `y-Achse (x = 0): y = ${fmt(a)} : ${paren(b)}${term(d, "", false)} ${eq(y0)} ${fmt(y0, 2)}`,
            `<strong>N(${fmt(xN, 2)} | 0) und S(0 | ${fmt(y0, 2)})</strong>`,
          ],
          meta: { kind: 1, a, b, d, xN, y0 },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest an a, b und d Asymptoten, Definitions- und Wertemenge ab und findest Punkte auf dem Graphen.",
};

// 4.5 Umkehrfunktionen und Anwendungen ────────────────────────────────────────

/** Planets with their real mean distance a (AE) and period T (years): T² = a³. */
const BODIES = [
  { name: "Der Merkur", a: 0.387, T: 0.241 },
  { name: "Die Venus", a: 0.723, T: 0.615 },
  { name: "Der Mars", a: 1.524, T: 1.881 },
  { name: "Der Zwergplanet Ceres", a: 2.77, T: 4.6 },
  { name: "Der Jupiter", a: 5.203, T: 11.86 },
  { name: "Der Saturn", a: 9.537, T: 29.46 },
  { name: "Der Uranus", a: 19.19, T: 84.01 },
  { name: "Der Neptun", a: 30.07, T: 164.8 },
];

const KEPLER = "Nach dem dritten keplerschen Gesetz gilt für die Planeten T² = a³ (T: Umlaufzeit um die Sonne in Jahren, a: mittlerer Abstand zur Sonne in AE; 1 AE ist der mittlere Abstand der Erde von der Sonne).";

const umkehrfunktion: Lesson = {
  id: "pt-5-umkehrfunktion",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Umkehrfunktionen und Anwendungen",
  subtitle: "Spiegeln an der Geraden y = x",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Umkehrfunktion und Anwendungen`,
  whyItMatters:
    "Aus dem Radius das Volumen einer Kugel zu berechnen ist leicht. Die umgekehrte Frage, welcher Radius zu einem Liter gehört, beantwortet die Umkehrfunktion: Sie macht aus einer Formel V(r) eine Formel r(V).",
  explanationHtml: `
    <p>Eine Funktion f ordnet jedem x genau ein y zu. Lässt sich umgekehrt aus jedem y-Wert eindeutig das x zurückgewinnen, heißt f <strong>umkehrbar</strong>; die Zuordnung y ↦ x ist die <strong>Umkehrfunktion f<sup>−1</sup></strong>.</p>
    <ul>
      <li><strong>Umkehrbar</strong> ist f, wenn jeder y-Wert nur einmal vorkommt, also wenn der Graph nur steigt oder nur fällt. y = x² ist auf ℝ nicht umkehrbar, denn 2² = (−2)² = 4. Schränkt man die Definitionsmenge auf ℝ<sub>0</sub><sup>+</sup> ein, ist sie umkehrbar.</li>
      <li><strong>So bestimmst du f<sup>−1</sup>:</strong> die Gleichung nach x auflösen, dann x und y vertauschen. Definitions- und Wertemenge tauschen dabei die Rollen: 𝔻(f<sup>−1</sup>) = 𝕎(f) und 𝕎(f<sup>−1</sup>) = 𝔻(f).</li>
      <li>Der Graph von f<sup>−1</sup> ist das <strong>Spiegelbild</strong> des Graphen von f an der Geraden y = x: Aus P(u | v) wird P′(v | u).</li>
    </ul>
    <div class="example">f: y = (x − 2)² + 1 mit 𝔻 = {x | x ≥ 2}, 𝕎 = {y | y ≥ 1}. Auflösen: y − 1 = (x − 2)², x − 2 = ${sqrtHtml("y − 1")} (denn x − 2 ≥ 0), x = ${sqrtHtml("y − 1")} + 2. Tauschen: f<sup>−1</sup>: y = ${sqrtHtml("x − 1")} + 2 mit 𝔻 = {x | x ≥ 1} und 𝕎 = {y | y ≥ 2}.</div>
    <p>Allgemein hat y = a · (x + b)<sup>n</sup> + d mit a &gt; 0 und 𝔻 = {x | x ≥ −b} die Umkehrfunktion y = ((x − d) : a)<sup>1/n</sup> − b mit 𝔻 = {x | x ≥ d}. Hyperbeln y = a · (x + b)<sup>−1</sup> + d sind ohne Einschränkung umkehrbar: f<sup>−1</sup>: y = a · (x − d)<sup>−1</sup> − b.</p>
    <p><strong>Anwendungen:</strong> Die Umkehrfunktion beantwortet die umgekehrte Frage einer Formel. Das Kugelvolumen V = 4/3 · π · r³ hängt vom Radius ab; umgekehrt ist r = ${rootHtml(3, "3V : (4π)")}. Nach dem dritten keplerschen Gesetz gilt für die Planeten T² = a³ (T in Jahren, a in AE): Also ist T = a<sup>3/2</sup> und umgekehrt a = T<sup>2/3</sup>.</p>
    <div class="merke"><strong>Merke:</strong> Auflösen, x und y tauschen, 𝔻 und 𝕎 tauschen. Bei geraden Exponenten zuerst die Definitionsmenge einschränken.</div>
  `,
  formulas: [
    { name: "Umkehrfunktion", html: "nach x auflösen, x und y tauschen; 𝔻(f<sup>−1</sup>) = 𝕎(f)", quantities: "Der Graph von f⁻¹ ist das Spiegelbild an y = x" },
    { name: "Umkehrung einer Potenzfunktion", html: "y = a(x + b)<sup>n</sup> + d ⇒ f<sup>−1</sup>: y = ((x − d) : a)<sup>1/n</sup> − b", quantities: "für a > 0 und 𝔻 = {x | x ≥ −b}" },
    { name: "Kugelradius aus dem Volumen", html: `r = ${rootHtml(3, "3V : (4π)")}`, quantities: "Umkehrung von V = 4/3 · π · r³" },
  ],
  quiz: {
    question: "Wie entsteht der Graph der Umkehrfunktion f⁻¹ aus dem Graphen von f?",
    options: ["durch Spiegelung an der x-Achse", "durch Spiegelung an der y-Achse", "durch Spiegelung an der Geraden y = x", "durch Drehung um 90° um den Ursprung"],
    correctIndex: 2,
    explanation: "Beim Umkehren werden x und y vertauscht: Aus P(u | v) wird P′(v | u). Das ist die Spiegelung an der Winkelhalbierenden y = x.",
  },
  lab: {
    kind: "inverse-mirror",
    title: "Labor: Der Spiegel y = x",
    intro: "Blau ist f: y = (x + b)ᶜ + d, orange sein Spiegelbild an der Geraden y = x. Ziehe P auf dem Graphen von f: P′ ist sein Spiegelpunkt. Nur wenn das Spiegelbild wieder ein Funktionsgraph ist, ist f umkehrbar.",
    params: [
      {
        type: "choice",
        key: "c",
        label: "Exponent c",
        options: MIRROR_EXPONENTS.map((c) => ({ value: c, label: c === 2 ? "2 (Parabel)" : c === -2 ? "−2 (Hyperbel)" : c === 0.5 ? "1/2 (Wurzel)" : "−1 (Hyperbel)" })),
        value: 2,
      },
      { type: "range", key: "b", label: "b (Verschiebung um −b nach rechts)", unit: "", min: -2, max: 2, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "d", label: "d (Verschiebung nach oben)", unit: "", min: -2, max: 2, step: 0.5, value: 0, digits: 1 },
      {
        type: "choice",
        key: "r",
        label: "Definitionsmenge von f",
        options: [
          { value: 0, label: "größtmöglich" },
          { value: 1, label: "eingeschränkt auf x ≥ −b (bzw. x > −b)" },
        ],
        value: 0,
        showIf: (v) => v.c === 2 || v.c === -2,
      },
      { type: "range", key: "x", label: "x-Koordinate von P", unit: "", min: -5, max: 5, step: 0.5, value: 1.5, digits: 1 },
    ],
    readouts: [
      { key: "f", label: "Funktion f", compute: (v) => mirrorCase(v).fText },
      { key: "DWf", label: "𝔻 und 𝕎 von f", compute: (v) => `𝔻 = ${mirrorCase(v).D}; 𝕎 = ${mirrorCase(v).W}` },
      { key: "inv", label: "Umkehrfunktion f⁻¹", emphasis: true, compute: (v) => mirrorCase(v).invText },
      { key: "DWinv", label: "𝔻 und 𝕎 von f⁻¹", compute: (v) => (mirrorCase(v).invertible ? `𝔻 = ${mirrorCase(v).Dinv}; 𝕎 = ${mirrorCase(v).Winv}` : "–") },
      {
        key: "P",
        label: "P und sein Spiegelpunkt P′",
        compute: (v) => {
          const points = mirrorPoints(v);
          return points ? `P(${fmt(points.P[0], 2)} | ${fmt(points.P[1], 3)}) ↦ P′(${fmt(points.Q[0], 3)} | ${fmt(points.Q[1], 2)})` : "P liegt nicht in der Zeichnung";
        },
      },
    ],
    goals: [
      { id: "einschraenken", text: "Die Parabel (c = 2) ist auf ganz ℝ nicht umkehrbar. Schränke ihre Definitionsmenge so ein, dass das Spiegelbild ein Funktionsgraph wird.", check: (v) => v.c === 2 && v.r === 1 },
      { id: "selbst", text: "Finde eine Hyperbel außer y = x⁻¹, die ihre eigene Umkehrfunktion ist.", check: (v) => v.c === -1 && v.b === -v.d && v.b !== 0 },
      { id: "gleichung", text: "Stelle f so ein, dass ihre Umkehrfunktion y = √(x − 1) + 2 ist.", check: (v) => v.c === 2 && v.r === 1 && v.b === -2 && v.d === 1 },
    ],
  },
  exercises: [
    {
      id: "umkehrfunktion",
      make: guarded((rng, level): ExerciseTask => {
        const b = rng.int(1, 4) * rng.sign();
        const d = rng.int(-4, 4);
        const yd = lessD("y", d);
        const xd = lessD("x", d);
        const bracket = sumText("x", b);
        if (level === 1) {
          const kind = rng.int(0, 3);
          const a = kind === 3 ? rng.pick([-3, -2, -1, 1, 2, 3, 4]) : 1;
          const fHtml =
            kind === 0 ? `y = ${shifted(-b)}²${term(d, "", false)}` : kind === 1 ? `y = ${shifted(-b)}³${term(d, "", false)}` : kind === 2 ? `y = ${sqrtHtml(bracket)}${term(d, "", false)}` : powerTermHtml(a, b, "−1", d);
          const domain = kind === 3 ? `𝔻 = ℝ ∖ {${fmt(-b)}}` : `𝔻 = {x | x ≥ ${fmt(-b)}}`;
          const template = [`y = ${sqrtHtml("x − u")} + v`, `y = ${rootHtml(3, "x − u")} + v`, "y = (x − u)² + v", "y = k · (x − u)<sup>−1</sup> + v"][kind];
          const inverseHtml = [
            `y = ${sqrtHtml(sumText("x", -d))}${term(-b, "", false)}`,
            `y = ${rootHtml(3, sumText("x", -d))}${term(-b, "", false)}`,
            `y = ${vertexForm(1, d, -b)}`,
            powerTermHtml(a, -d, "−1", -b),
          ][kind];
          const solve = [
            `Nach x auflösen: ${sumText("y", -d)} = (${bracket})² ⇒ ${bracket} = ${sqrtHtml(sumText("y", -d))}, denn wegen x ≥ ${fmt(-b)} ist ${bracket} ≥ 0.`,
            `Nach x auflösen: ${sumText("y", -d)} = (${bracket})³ ⇒ ${bracket} = ${rootHtml(3, sumText("y", -d))}, denn wegen x ≥ ${fmt(-b)} ist ${bracket} ≥ 0.`,
            `Nach x auflösen: ${sumText("y", -d)} = ${sqrtHtml(bracket)} ⇒ ${bracket} = ${d === 0 ? "y²" : `${yd}²`}, wobei y ≥ ${fmt(d)}.`,
            `Nach x auflösen: ${sumText("y", -d)} = ${fmt(a)} · (${bracket})<sup>−1</sup> ⇒ ${bracket} = ${fmt(a)} : ${yd}`,
          ][kind];
          const fields =
            kind === 3
              ? [
                  numberField("k =", a, "", 2, { slips: a === 1 || a === -1 ? [] : [{ value: 1 / a, hint: "Der Faktor a bleibt beim Umkehren erhalten: x + b = a : (y − d)." }] }),
                  numberField("u =", d, "", 2),
                  numberField("v =", -b, "", 2),
                ]
              : [numberField("u =", d, "", 2), numberField("v =", -b, "", 2)];
          return {
            prompt: `Die Funktion f mit ${fHtml} und ${domain} ist umkehrbar. Bestimme die Gleichung der Umkehrfunktion f<sup>−1</sup> in der Form ${template}.`,
            given: [fHtml, domain],
            formulaHint: "Nach x auflösen, dann x und y vertauschen; 𝔻(f<sup>−1</sup>) = 𝕎(f)",
            fields,
            steps: [
              solve,
              `${kind === 3 ? `x = ${fmt(a)} : ${yd}${term(-b, "", false)}` : kind === 2 ? `x = ${d === 0 ? "y²" : `${yd}²`}${term(-b, "", false)}` : `x = ${(kind === 0 ? sqrtHtml : (r: string) => rootHtml(3, r))(sumText("y", -d))}${term(-b, "", false)}`}; jetzt x und y vertauschen.`,
              `<strong>f<sup>−1</sup>: ${inverseHtml}</strong> mit 𝔻 = ${kind === 3 ? `ℝ ∖ {${fmt(d)}}` : `{x | x ≥ ${fmt(d)}}`}${kind === 3 ? `, also k = ${fmt(a)},` : ", also"} u = ${fmt(d)} und v = ${fmt(-b)}`,
            ],
            meta: { kind, a, b, d },
          };
        }
        if (rng.next() < 0.5) {
          const a = rng.pick([0.25, 0.5, 2, 4]);
          const k = 1 / a;
          const fHtml = `y = ${fmt(a)}${shifted(-b)}²${term(d, "", false)}`;
          return {
            prompt: `Gegeben ist die Funktion f mit ${fHtml} und 𝔻 = {x | x ≥ ${fmt(-b)}}. Bestimme die Gleichung der Umkehrfunktion f<sup>−1</sup> in der Form y = ${sqrtHtml("k · (x − u)")} + v.`,
            given: [fHtml, `𝔻 = {x | x ≥ ${fmt(-b)}}`],
            fields: [
              numberField("k =", k, "", 2, { slips: [{ value: a, hint: "Beim Auflösen wird durch a geteilt: k = 1 : a." }] }),
              numberField("u =", d, "", 2),
              numberField("v =", -b, "", 2),
            ],
            steps: [
              `${sumText("y", -d)} = ${fmt(a)} · (${bracket})² ⇒ (${bracket})² = ${yd} : ${fmt(a)} = ${fmt(k)} · ${yd}`,
              `${bracket} = ${sqrtHtml(`${fmt(k)} · ${yd}`)}, denn ${bracket} ≥ 0. Also x = ${sqrtHtml(`${fmt(k)} · ${yd}`)}${term(-b, "", false)}; jetzt x und y vertauschen.`,
              `<strong>f<sup>−1</sup>: y = ${sqrtHtml(`${fmt(k)} · ${xd}`)}${term(-b, "", false)}</strong> mit 𝔻 = {x | x ≥ ${fmt(d)}}: k = ${fmt(k)}, u = ${fmt(d)}, v = ${fmt(-b)}`,
            ],
            meta: { kind: 4, a, b, d },
          };
        }
        const a = rng.pick([0.25, 1, 4, 9]);
        const k = Math.sqrt(a);
        const fHtml = `y = ${factor(a)}${shifted(-b)}<sup>−2</sup>${term(d, "", false)}`;
        return {
          prompt: `Gegeben ist die Funktion f mit ${fHtml} und 𝔻 = {x | x > ${fmt(-b)}}. Bestimme die Gleichung der Umkehrfunktion f<sup>−1</sup> in der Form y = k · (x − u)<sup>−1/2</sup> + v.`,
          given: [fHtml, `𝔻 = {x | x > ${fmt(-b)}}`],
          fields: [
            numberField("k =", k, "", 2, { slips: [{ value: a, hint: "Beim Wurzelziehen wird aus a die Zahl √a." }, { value: 1 / k, hint: "a steht im Zähler: x + b = √(a : (y − d)) = √a · (y − d) hoch −1/2." }] }),
            numberField("u =", d, "", 2),
            numberField("v =", -b, "", 2),
          ],
          steps: [
            `${sumText("y", -d)} = ${fmt(a)} · (${bracket})<sup>−2</sup> ⇒ (${bracket})² = ${fmt(a)} : ${yd}`,
            `${bracket} = ${sqrtHtml(`${fmt(a)} : ${yd}`)} = ${fmt(k)} · ${yd}<sup>−1/2</sup>, denn ${bracket} > 0; jetzt x und y vertauschen.`,
            `<strong>f<sup>−1</sup>: y = ${fmt(k)} · ${xd}<sup>−1/2</sup>${term(-b, "", false)}</strong> mit 𝔻 = {x | x > ${fmt(d)}}: k = ${fmt(k)}, u = ${fmt(d)}, v = ${fmt(-b)}`,
          ],
          meta: { kind: 5, a, b, d },
        };
      }),
    },
    {
      id: "anwendung",
      make: guarded((rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.6) {
            const V = rng.pick([100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000]);
            const r3 = (3 * V) / (4 * Math.PI);
            const r = Math.cbrt(r3);
            return {
              prompt: `Eine Kugel hat das Volumen V = ${fmt(V)} cm³. Berechne ihren Radius r.`,
              given: [`V = ${fmtUnit(V, "cm³")}`],
              formulaHint: `V = 4/3 · π · r³ ⇒ r = ${rootHtml(3, "3V : (4π)")}`,
              fields: [
                numberField("r =", r, "cm", 2, {
                  slips: [
                    { value: Math.sqrt(r3), hint: "r steht hoch 3: Gesucht ist die dritte Wurzel, nicht die Quadratwurzel." },
                    { value: Math.cbrt((3 * V) / 4), hint: "Durch π teilen nicht vergessen: r³ = 3V : (4π)." },
                    { value: Math.cbrt(V), hint: "Erst nach r³ auflösen: r³ = 3V : (4π)." },
                    { value: r3, hint: "Das ist r³. Ziehe noch die dritte Wurzel." },
                  ],
                }),
              ],
              steps: [
                `V = 4/3 · π · r³ ⇒ r³ = 3V : (4π) = ${fmt(3 * V)} : ${fmt(4 * Math.PI, 4)} ≈ ${fmtUnit(r3, "cm³")}`,
                `r = ${rootHtml(3, `${fmt(r3, 2)} cm³`)} ≈ <strong>${fmtUnit(r, "cm")}</strong>`,
              ],
              meta: { variant: 0, V, r },
            };
          }
          const O = rng.pick([50, 100, 200, 314, 500, 1000, 1256]);
          const r2 = O / (4 * Math.PI);
          const r = Math.sqrt(r2);
          return {
            prompt: `Ein Ball hat die Oberfläche O = ${fmt(O)} cm². Berechne seinen Radius r.`,
            given: [`O = ${fmtUnit(O, "cm²")}`],
            formulaHint: `O = 4 · π · r² ⇒ r = ${sqrtHtml("O : (4π)")}`,
            fields: [
              numberField("r =", r, "cm", 2, {
                slips: [
                  { value: Math.sqrt(O / 4), hint: "Durch π teilen nicht vergessen: r² = O : (4π)." },
                  { value: r2, hint: "Das ist r². Ziehe noch die Wurzel." },
                ],
              }),
            ],
            steps: [`O = 4 · π · r² ⇒ r² = O : (4π) = ${fmt(O)} : ${fmt(4 * Math.PI, 4)} ≈ ${fmtUnit(r2, "cm²")}`, `r = ${sqrtHtml(`${fmt(r2, 2)} cm²`)} ≈ <strong>${fmtUnit(r, "cm")}</strong>`],
            meta: { variant: 1, O, r },
          };
        }
        if (rng.next() < 0.6) {
          const body = rng.pick(BODIES);
          if (rng.next() < 0.5) {
            const a = body.T ** (2 / 3);
            return {
              prompt: `${KEPLER} ${body.name} braucht für einen Umlauf ${fmt(body.T, 3)} Jahre. Berechne den mittleren Abstand a zur Sonne.`,
              given: ["T² = a³", `T = ${fmt(body.T, 3)} Jahre`],
              fields: [
                numberField("a =", a, "AE", 2, {
                  slips: [
                    { value: body.T ** 1.5, hint: "Umgekehrt: Aus T² = a³ folgt a = T hoch 2/3." },
                    { value: body.T ** (1 / 3), hint: "T wird quadriert: a³ = T², also a = (T²) hoch 1/3." },
                    { value: body.T ** 2, hint: "Das ist a³. Ziehe noch die dritte Wurzel." },
                  ],
                }),
              ],
              steps: [`T² = a³ ⇒ a = ${rootHtml(3, "T²")} = T<sup>2/3</sup>`, `a = ${fmt(body.T, 3)}<sup>2/3</sup> ≈ <strong>${fmtUnit(a, "AE")}</strong>. Die Funktionen a ↦ a<sup>3/2</sup> und T ↦ T<sup>2/3</sup> sind Umkehrfunktionen voneinander.`],
              meta: { variant: 2, T: body.T, a },
            };
          }
          const T = body.a ** 1.5;
          return {
            prompt: `${KEPLER} ${body.name} ist im Mittel ${fmt(body.a, 3)} AE von der Sonne entfernt. Berechne die Umlaufzeit T.`,
            given: ["T² = a³", `a = ${fmt(body.a, 3)} AE`],
            fields: [
              numberField("T =", T, "Jahre", 2, {
                slips: [
                  { value: body.a ** (2 / 3), hint: "Umgekehrt: Aus T² = a³ folgt T = a hoch 3/2." },
                  { value: body.a ** 3, hint: "Das ist T². Ziehe noch die Wurzel." },
                  { value: Math.sqrt(body.a), hint: "a wird hoch 3 genommen: T² = a³." },
                ],
              }),
            ],
            steps: [`T² = a³ ⇒ T = ${sqrtHtml("a³")} = a<sup>3/2</sup>`, `T = ${fmt(body.a, 3)}<sup>3/2</sup> ≈ <strong>${fmt(T, 2)} Jahre</strong>. Die Funktionen a ↦ a<sup>3/2</sup> und T ↦ T<sup>2/3</sup> sind Umkehrfunktionen voneinander.`],
            meta: { variant: 3, a: body.a, T },
          };
        }
        const k = rng.pick([2, 3, 4, 5, 8, 10, 27, 0.5]);
        const growth = Math.cbrt(k);
        return {
          prompt:
            k > 1
              ? `Ein kugelförmiger Luftballon wird weiter aufgeblasen, bis sein Volumen ${k === 2 ? "doppelt" : `${fmt(k)}-mal`} so groß ist wie vorher. Wievielmal so groß ist dann sein Radius?`
              : "Aus einem kugelförmigen Luftballon entweicht Luft, bis sein Volumen nur noch halb so groß ist wie vorher. Wievielmal so groß wie vorher ist dann sein Radius?",
          given: ["V = 4/3 · π · r³", `V₂ = ${fmt(k)} · V₁`],
          fields: [
            numberField("Faktor:", growth, "", 2, {
              slips: [
                { value: k, hint: "Der Radius wächst nicht wie das Volumen: V hängt von r³ ab, also r von V hoch 1/3." },
                { value: Math.sqrt(k), hint: "V hängt von r³ ab: dritte Wurzel, nicht Quadratwurzel." },
              ],
            }),
          ],
          steps: [
            "V = 4/3 · π · r³ ⇒ r = (3V : (4π))<sup>1/3</sup>: r ist proportional zu V<sup>1/3</sup>.",
            `V wird mit ${fmt(k)} malgenommen ⇒ r wird mit ${fmt(k)}<sup>1/3</sup> = ${rootHtml(3, fmt(k))} malgenommen.`,
            `<strong>Faktor ${eq(growth)} ${fmt(growth, 2)}</strong>`,
          ],
          meta: { variant: 4, k, factor: growth },
        };
      }),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst Umkehrfunktionen und beantwortest damit die umgekehrte Frage einer Formel.",
};

export const STAGE_POTENZEN: Stage = {
  id: "stage-4-potenzen",
  stageNumber: 4,
  title: "Potenzen und Potenzfunktionen",
  subtitle: "Rationale Exponenten, Wurzeln, Graphen, Asymptoten, Umkehrfunktionen",
  icon: "🧮",
  accent: "#ea580c",
  badgeTitle: "Potenz-Profi",
  lehrplanLabel: "LB 3 (nur Zweig I)",
  lessons: [potenzgesetze, wurzeln, potenzfunktionen, parameter, umkehrfunktion],
};

