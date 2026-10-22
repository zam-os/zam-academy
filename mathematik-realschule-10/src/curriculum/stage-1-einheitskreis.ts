import { toleranceOf } from "../exercises/checker";
import { fmt, fmtUnit, fracHtml, linear, paren, point, round, sqrtHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  calculatorAngle,
  FN_NAMES,
  fnAt,
  intersectionAngle,
  lineEquation,
  norm360,
  quadrantName,
  sameValueAngles,
  tanDefined,
  trig,
  wheelHeight,
} from "../lab/views-einheitskreis";
import type { ExerciseTask, Lesson, NumberField, Stage } from "../model/types";
import { acosD, asinD, atanD, choiceField, cosD, numberField, RAD_HINT, sinD, tanD, within } from "./helpers";

const STAGE_ID = "stage-1-einheitskreis";
const LEHRPLAN = "M10 LB 1 (I) · M10 LB 1 (II/III): Trigonometrie";
const LEHRPLAN_I = "M10 LB 1 (I): Trigonometrie";

type Slip = { value: number; hint: string };

/**
 * A number field whose slips are all wrong answers: a slip the field would
 * accept, or that is another solution of an any-order task, is dropped.
 */
function numField(label: string, answer: number, unit = "", digits = 2, extra: Partial<NumberField> = {}, others: number[] = []): NumberField {
  const field = numberField(label, answer, unit, digits, extra);
  const tolerance = toleranceOf(field);
  const slips = (field.slips ?? []).filter(
    (slip) => Math.abs(slip.value - answer) > 1.5 * tolerance + 1e-9 && others.every((x) => Math.abs(slip.value - x) > 0.6),
  );
  return { ...field, slips };
}

/** An angle in degrees: shown with `digits` decimals and accepted within 0,05°, whatever its size. */
function angleField(label: string, answer: number, slips: Slip[] = [], digits = 2, others: number[] = []): NumberField {
  return numField(label, answer, "°", digits, { tolerance: 0, absTolerance: 0.05, slips }, others);
}

/** Primitive Pythagorean triples (a, b, c): a/c and b/c are sine and cosine of an acute angle. */
const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
] as const;

const ROMAN = ["I", "II", "III", "IV"];
/** Signs of cos α and sin α in the quadrants 1 to 4. */
const QUADRANT_SIGNS: Record<number, [number, number]> = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };
const QUADRANT_RANGE: Record<number, string> = {
  1: "0° &lt; α &lt; 90°",
  2: "90° &lt; α &lt; 180°",
  3: "180° &lt; α &lt; 270°",
  4: "270° &lt; α &lt; 360°",
};

/** A stacked fraction, in brackets when negative: for products and quotients. */
function fracParen(numerator: number, denominator: number): string {
  const html = fracHtml(numerator, denominator);
  return numerator * denominator < 0 ? `(${html})` : html;
}

/** A value with "=" when it is exact at four decimals, else with "≈". */
function approx(value: number, digits = 4): string {
  return `${Math.abs(value - round(value, digits)) < 1e-9 ? "=" : "≈"} ${fmt(value, digits)}`;
}

/** A choice among plain-text options: the answer and three others from the pool, shuffled. */
function pickOptions(rng: Rng, answer: string, pool: readonly string[]): { options: string[]; correctIndex: number } {
  const others = rng.shuffle(pool.filter((option) => option !== answer)).slice(0, 3);
  const options = rng.shuffle([answer, ...others]);
  return { options, correctIndex: options.indexOf(answer) };
}

/** A term and its simplified form, with the steps that get there. */
export interface TermCase {
  text: string;
  answer: string;
  steps: string[];
}

function termTask(rng: Rng, level: 1 | 2, cases: readonly TermCase[], pool: readonly string[], hint: string, given: string[], intro: string): ExerciseTask {
  const index = rng.int(0, cases.length - 1);
  const item = cases[index];
  const { options, correctIndex } = pickOptions(rng, item.answer, pool);
  return {
    prompt: `${intro} ${item.text}`,
    given: [`Term: ${item.text}`, ...(level === 1 ? given : [])],
    ...(level === 1 ? { formulaHint: hint } : {}),
    fields: [choiceField("vereinfacht:", options, correctIndex)],
    // A first step that continues the term ("= …") starts with the term itself.
    steps: [...item.steps.map((step, i) => (i === 0 && step.startsWith("=") ? `${item.text} ${step}` : step)), `<strong>${item.text} = ${item.answer}</strong>`],
    meta: { term: index },
  };
}

// ─── Solving sin α = k, cos α = k, tan α = k in [0°; 360°[ ───────────────

/** The calculator's angle and both solutions in [0°; 360°[ (sorted) of fn(α) = k, for 0 < |k| < 1 (any k ≠ 0 for tan). */
export function solveTrig(fn: number, k: number): { calc: number; solutions: [number, number] } {
  const calc = fn === 0 ? asinD(k) : fn === 1 ? acosD(k) : atanD(k);
  let solutions: [number, number];
  if (fn === 0) solutions = k >= 0 ? [calc, 180 - calc] : [180 - calc, 360 + calc];
  else if (fn === 1) solutions = [calc, 360 - calc];
  else solutions = k >= 0 ? [calc, calc + 180] : [calc + 180, calc + 360];
  return { calc, solutions: [Math.min(...solutions), Math.max(...solutions)] as [number, number] };
}

/** The worked steps of fn(α) = k with the calculator's angle rounded to two decimals, and the two angles shown. */
function inverseSteps(fn: number, k: number): { steps: string[]; shown: [number, number] } {
  const name = FN_NAMES[fn];
  const exact = fn === 0 ? asinD(k) : fn === 1 ? acosD(k) : atanD(k);
  const c = round(exact, 2);
  const tr = `Taschenrechner: ${name}⁻¹(${fmt(k)}) ≈ ${fmt(c)}°`;
  if (fn === 0 && k > 0) {
    return { steps: [tr, `Spiegelung an der y-Achse (Supplementwinkel): 180° − ${fmt(c)}° = ${fmt(180 - c)}°`], shown: [c, round(180 - c, 2)] };
  }
  if (fn === 0) {
    return {
      steps: [`${tr}, ein negativer Winkel.`, `IV. Quadrant: ${fmt(c)}° + 360° = ${fmt(360 + c)}°; III. Quadrant: 180° + ${fmt(-c)}° = ${fmt(180 - c)}°`],
      shown: [round(180 - c, 2), round(360 + c, 2)],
    };
  }
  if (fn === 1) {
    return { steps: [tr, `Spiegelung an der x-Achse: 360° − ${fmt(c)}° = ${fmt(360 - c)}°`], shown: [c, round(360 - c, 2)] };
  }
  if (k > 0) return { steps: [tr, `Gegenpunkt am Ursprung: ${fmt(c)}° + 180° = ${fmt(c + 180)}°`], shown: [c, round(c + 180, 2)] };
  return {
    steps: [`${tr}, ein negativer Winkel.`, `${fmt(c)}° + 180° = ${fmt(c + 180)}° und ${fmt(c)}° + 360° = ${fmt(c + 360)}°`],
    shown: [round(c + 180, 2), round(c + 360, 2)],
  };
}

/** The slips of an angle found from fn(α) = k: the raw calculator value, RAD mode, the wrong mirror. */
function inverseSlips(fn: number, k: number): Slip[] {
  const calc = fn === 0 ? asinD(k) : fn === 1 ? acosD(k) : atanD(k);
  const rad = fn === 0 ? Math.asin(k) : fn === 1 ? Math.acos(k) : Math.atan(k);
  const wrong =
    fn === 0
      ? { value: norm360(360 - calc), hint: "Beim Sinus ist der zweite Winkel 180° − α₁ (Spiegelung an der y-Achse), nicht 360° − α₁." }
      : fn === 1
        ? { value: norm360(180 - calc), hint: "Beim Kosinus ist der zweite Winkel 360° − α₁ (Spiegelung an der x-Achse), nicht 180° − α₁." }
        : { value: norm360(180 - calc), hint: "Beim Tangens ist der zweite Winkel α₁ + 180° (Gegenpunkt am Ursprung)." };
  return [
    { value: calc, hint: "Das ist der Taschenrechnerwinkel. Gesucht sind Winkel von 0° bis 360°: Addiere 360° oder nutze die Symmetrie am Einheitskreis." },
    { value: rad, hint: RAD_HINT },
    wrong,
  ];
}

// 1.1 Einheitskreis ──────────────────────────────────────────────────────────

/** Lesson 1.1: terms with sin²α + cos²α = 1 and tan α = sin α : cos α. */
export const TERMS_PYTHAGORAS: Record<1 | 2, TermCase[]> = {
  1: [
    { text: "(1 − cos²α) : sin α", answer: "sin α", steps: ["= sin²α : sin α (trigonometrischer Pythagoras)", "= sin α"] },
    { text: "tan α · cos α", answer: "sin α", steps: ["= (sin α : cos α) · cos α", "= sin α"] },
    { text: "sin²α + cos²α + 1", answer: "2", steps: ["= 1 + 1", "= 2"] },
    { text: "(1 − sin²α) : cos α", answer: "cos α", steps: ["= cos²α : cos α", "= cos α"] },
    { text: "sin α : tan α", answer: "cos α", steps: ["= sin α : (sin α : cos α) = sin α · cos α : sin α", "= cos α"] },
    { text: "1 − sin²α", answer: "cos²α", steps: ["Aus sin²α + cos²α = 1 folgt", "1 − sin²α = cos²α"] },
  ],
  2: [
    {
      text: "(sin α + cos α)² + (sin α − cos α)²",
      answer: "2",
      steps: ["= sin²α + 2 · sin α · cos α + cos²α + sin²α − 2 · sin α · cos α + cos²α", "= 2 · (sin²α + cos²α) = 2 · 1"],
    },
    { text: "(1 − sin α) · (1 + sin α) : cos²α", answer: "1", steps: ["= (1 − sin²α) : cos²α (3. binomische Formel)", "= cos²α : cos²α"] },
    { text: "tan α · (1 − sin²α) : sin α", answer: "cos α", steps: ["= (sin α : cos α) · cos²α : sin α", "= cos α"] },
    { text: "sin³α + sin α · cos²α", answer: "sin α", steps: ["= sin α · (sin²α + cos²α) (ausklammern)", "= sin α · 1"] },
    { text: "(1 + tan²α) · cos²α", answer: "1", steps: ["= cos²α + (sin²α : cos²α) · cos²α", "= cos²α + sin²α"] },
    { text: "(sin α + cos α)² − 2 · sin α · cos α", answer: "1", steps: ["= sin²α + 2 · sin α · cos α + cos²α − 2 · sin α · cos α", "= sin²α + cos²α"] },
    { text: "sin α · cos α · tan α + cos²α", answer: "1", steps: ["= sin α · cos α · (sin α : cos α) + cos²α", "= sin²α + cos²α"] },
    {
      text: "cos⁴α − sin⁴α + 2 · sin²α",
      answer: "1",
      steps: ["= (cos²α − sin²α) · (cos²α + sin²α) + 2 · sin²α = cos²α − sin²α + 2 · sin²α", "= cos²α + sin²α"],
    },
  ],
};

export const TERM_POOL = ["1", "2", "sin α", "cos α", "tan α", "sin²α", "cos²α"] as const;

const einheitskreis: Lesson = {
  id: "tr-1-einheitskreis",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Sinus, Kosinus und Tangens am Einheitskreis",
  subtitle: "Der Punkt P(cos α | sin α) für jeden Winkel",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Einheitskreis`,
  whyItMatters:
    "Im rechtwinkligen Dreieck gibt es nur spitze Winkel. Am Einheitskreis bekommen auch 120° oder 300° einen Sinus, Kosinus und Tangens; das brauchst du für stumpfwinklige Dreiecke, Drehungen und Kreisbewegungen.",
  explanationHtml: `
    <p>Der <strong>Einheitskreis</strong> ist der Kreis um den Ursprung O mit dem Radius 1. Zu jedem Winkel α gehört ein Punkt P auf ihm: Man dreht die Strecke OP von der positiven x-Achse aus <strong>gegen den Uhrzeigersinn</strong> um α.</p>
    <p>Für 0° &lt; α &lt; 90° ist das Dreieck aus O, P und dem Lotfußpunkt F auf der x-Achse rechtwinklig mit der Hypotenuse 1. Also ist sin α = Gegenkathete : 1, die y-Koordinate von P, und cos α = Ankathete : 1, die x-Koordinate. Diese Beobachtung wird zur <strong>Definition für jeden Winkel</strong>:</p>
    <p class="formula-line"><strong>P(cos α | sin α)</strong></p>
    <ul>
      <li><strong>Wertebereich:</strong> P liegt auf dem Kreis mit Radius 1, also gilt −1 ≤ sin α ≤ 1 und −1 ≤ cos α ≤ 1. Die Vorzeichen zeigt der Quadrant: Im II. Quadranten ist cos α negativ, im III. Quadranten sind beide negativ.</li>
      <li><strong>Tangens:</strong> Die Gerade OP schneidet die Tangente x = 1 im Punkt T(1 | tan α). Nach dem Strahlensatz ist tan α : 1 = sin α : cos α, also <strong>tan α = sin α : cos α</strong>; das ist zugleich die Steigung der Geraden OP. Für α = 90° und α = 270° ist cos α = 0 und OP parallel zur Tangente: Dort ist tan α <strong>nicht definiert</strong>. Sonst kann tan α jede reelle Zahl sein.</li>
      <li><strong>Trigonometrischer Pythagoras:</strong> Im Dreieck OFP sind die Katheten |cos α| und |sin α| lang, die Hypotenuse 1. Pythagoras liefert <strong>sin²α + cos²α = 1</strong> für jeden Winkel.</li>
      <li>Auf einem Kreis mit dem Radius r um O liegt der Punkt zum Winkel α bei (r · cos α | r · sin α).</li>
    </ul>
    <div class="example">Beispiel: P(−0,6 | 0,8) liegt auf dem Einheitskreis, denn (−0,6)² + 0,8² = 0,36 + 0,64 = 1. Also ist cos α = −0,6 und sin α = 0,8, und tan α = 0,8 : (−0,6) ≈ −1,33. P liegt im II. Quadranten, der Winkel ist α ≈ 126,87°.</div>
    <div class="merke"><strong>Merke:</strong> Kennst du sin α und den Quadranten, dann ist cos α = ± ${sqrtHtml("1 − sin²α")}; das Vorzeichen liefert der Quadrant. tan α = sin α : cos α gilt für alle Winkel mit cos α ≠ 0.</div>
  `,
  formulas: [
    { name: "Punkt auf dem Einheitskreis", html: "P(cos α | sin α)", quantities: "α von der positiven x-Achse gegen den Uhrzeigersinn gemessen" },
    { name: "Trigonometrischer Pythagoras", html: "sin²α + cos²α = 1", quantities: "für jeden Winkel α" },
    { name: "Tangens", html: "tan α = sin α : cos α", quantities: "für cos α ≠ 0, also nicht für 90° und 270°" },
  ],
  quiz: {
    question: "Für einen Winkel α im II. Quadranten gilt cos α = −0,8. Wie groß ist sin α?",
    options: ["0,6", "−0,6", "0,2", "0,36"],
    correctIndex: 0,
    explanation: "sin²α = 1 − (−0,8)² = 1 − 0,64 = 0,36, also sin α = ±0,6. Im II. Quadranten liegt P oberhalb der x-Achse, deshalb ist sin α = 0,6.",
  },
  lab: {
    kind: "unit-circle",
    title: "Labor: Der Einheitskreis",
    intro: "Ziehe P einmal ganz um den Kreis. Die Katheten zeigen cos α (orange) und sin α (blau), die grüne Strecke an der Tangente x = 1 zeigt tan α.",
    params: [{ type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 0, max: 359, step: 1, value: 35 }],
    readouts: [
      { key: "cos", label: "cos α (x-Koordinate von P)", digits: 4, compute: (v) => cosD(v.alpha) },
      { key: "sin", label: "sin α (y-Koordinate von P)", digits: 4, emphasis: true, compute: (v) => sinD(v.alpha) },
      { key: "tan", label: "tan α = sin α : cos α", digits: 4, compute: (v) => (tanDefined(v.alpha) ? tanD(v.alpha) : "nicht definiert") },
      { key: "pyth", label: "sin²α + cos²α", digits: 4, compute: (v) => sinD(v.alpha) ** 2 + cosD(v.alpha) ** 2 },
      { key: "lage", label: "Lage von P", compute: (v) => quadrantName(v.alpha) },
    ],
    goals: [
      {
        id: "cos-minus-halb",
        text: "Stelle P im II. Quadranten so ein, dass cos α = −0,5 ist.",
        check: (v) => within(cosD(v.alpha), -0.5, 1e-9) && sinD(v.alpha) > 0,
      },
      {
        id: "tan-eins",
        text: "Finde einen Winkel mit tan α = 1, bei dem P unterhalb der x-Achse liegt.",
        check: (v) => sinD(v.alpha) < 0 && tanDefined(v.alpha) && within(tanD(v.alpha), 1, 1e-9),
      },
      {
        id: "nicht-definiert",
        text: "Drehe P zu einem Winkel, für den tan α nicht definiert ist. Wo liegt dann T?",
        check: (v) => !tanDefined(v.alpha),
      },
    ],
  },
  exercises: [
    {
      id: "punkt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const q = rng.int(1, 4);
          const a = 90 * (q - 1) + rng.int(5, 85);
          const c = cosD(a);
          const s = sinD(a);
          const t = s / c;
          return {
            prompt: `Die Strecke OP ist von der positiven x-Achse aus um α = ${a}° gegen den Uhrzeigersinn gedreht, P liegt auf dem Einheitskreis. Berechne die Koordinaten von P und tan α auf drei Dezimalen.`,
            given: [`α = ${a}°`, "Einheitskreis: Mittelpunkt O(0 | 0), Radius 1"],
            formulaHint: "P(cos α | sin α), tan α = sin α : cos α",
            fields: [
              numField("x<sub>P</sub> = cos α =", c, "", 3, { slips: [{ value: Math.cos(a), hint: RAD_HINT }] }),
              numField("y<sub>P</sub> = sin α =", s, "", 3, { slips: [{ value: Math.sin(a), hint: RAD_HINT }] }),
              numField("tan α =", t, "", 3, {
                slips: [
                  { value: c / s, hint: "Umgekehrt geteilt: tan α = sin α : cos α." },
                  { value: Math.tan(a), hint: RAD_HINT },
                ],
              }),
            ],
            steps: [
              `x<sub>P</sub> = cos ${a}° ≈ ${fmt(c, 3)}, y<sub>P</sub> = sin ${a}° ≈ ${fmt(s, 3)}`,
              `P liegt im ${ROMAN[q - 1]}. Quadranten: cos α ist ${c > 0 ? "positiv" : "negativ"}, sin α ist ${s > 0 ? "positiv" : "negativ"}.`,
              `tan ${a}° = sin ${a}° : cos ${a}° ≈ ${fmt(s, 4)} : ${paren(c, 4)} ≈ ${fmt(t, 3)}`,
              `<strong>P(${fmt(c, 3)} | ${fmt(s, 3)}), tan α ≈ ${fmt(t, 3)}</strong>`,
            ],
            meta: { a },
          };
        }
        const r = rng.pick([12, 15, 18, 20, 25, 30]);
        const hub = r + rng.pick([2, 2.5, 3, 4]);
        let a = rng.int(10, 350);
        while (Math.abs(cosD(a)) < 0.15 || Math.abs(sinD(a)) < 0.1) a = rng.int(10, 350);
        const x = r * cosD(a);
        const y = r * sinD(a);
        const h = hub + y;
        const d = Math.abs(x);
        return {
          prompt: `Ein Riesenrad hat den Radius ${fmt(r)} m, seine Achse liegt ${fmt(hub, 1)} m über dem Boden. Eine Gondel (als Punkt am Rand gedacht) ist aus der waagrechten Stellung rechts neben der Achse um α = ${a}° gegen den Uhrzeigersinn weitergedreht. Wie hoch hängt sie über dem Boden, und wie weit ist sie waagrecht von der senkrechten Linie durch die Achse entfernt?`,
          given: [`Radius r = ${fmtUnit(r, "m")}`, `Achse ${fmtUnit(hub, "m", 1)} über dem Boden`, `α = ${a}°`],
          fields: [
            numField("Höhe h =", h, "m", 2, {
              slips: [
                { value: hub + r * Math.sin(a), hint: RAD_HINT },
                { value: y, hint: "Das ist die Höhe über der Achse. Addiere noch die Höhe der Achse." },
                { value: hub + x, hint: "Für die Höhe brauchst du die y-Koordinate r · sin α, nicht r · cos α." },
              ],
            }),
            numField("waagrechter Abstand d =", d, "m", 2, { slips: [{ value: Math.abs(y), hint: "Waagrecht gehört zur x-Koordinate: r · cos α." }] }),
            choiceField("Die Gondel ist", ["rechts der Linie", "links der Linie"], x > 0 ? 0 : 1),
          ],
          steps: [
            `Mit der Achse als Ursprung liegt die Gondel bei (r · cos α | r · sin α) = (${fmt(r)} · cos ${a}° | ${fmt(r)} · sin ${a}°) ≈ (${fmt(x, 2)} | ${fmt(y, 2)}).`,
            `h = ${fmt(hub, 1)} m ${y < 0 ? "−" : "+"} ${fmt(Math.abs(y), 2)} m ≈ ${fmt(h, 2)} m; der Abstand ist der Betrag der x-Koordinate: d ≈ ${fmt(d, 2)} m.`,
            `<strong>h ≈ ${fmtUnit(h, "m")}, d ≈ ${fmtUnit(d, "m")}, ${x > 0 ? "rechts" : "links"} der Linie</strong>`,
          ],
          meta: { r, hub, a },
        };
      },
    },
    {
      id: "pythagoras",
      make: (rng, level): ExerciseTask => {
        const [p, q2, h] = rng.pick(TRIPLES);
        const [u, w] = rng.next() < 0.5 ? [p, q2] : [q2, p];
        const q = rng.int(1, 4);
        const [cs, ss] = QUADRANT_SIGNS[q];
        const sinN = ss * u;
        const cosN = cs * w;
        const sinV = sinN / h;
        const cosV = cosN / h;
        const tanV = sinN / cosN;
        if (level === 1) {
          const givenSin = rng.next() < 0.5;
          const gName = givenSin ? "sin" : "cos";
          const oName = givenSin ? "cos" : "sin";
          const gN = givenSin ? sinN : cosN;
          const oN = givenSin ? cosN : sinN;
          const oV = oN / h;
          return {
            prompt: `Für einen Winkel α im ${ROMAN[q - 1]}. Quadranten gilt ${gName} α = ${fracHtml(gN, h)}. Berechne ${oName} α und tan α, ohne α selbst zu bestimmen.`,
            given: [`${gName} α = ${fracHtml(gN, h)}`, `α im ${ROMAN[q - 1]}. Quadranten (${QUADRANT_RANGE[q]})`],
            formulaHint: `${oName} α = ± ${sqrtHtml(`1 − ${gName}²α`)}, das Vorzeichen zeigt der Quadrant; tan α = sin α : cos α`,
            fields: [
              numField(`${oName} α =`, oV, "", 3, {
                slips: [
                  { value: -oV, hint: `Im ${ROMAN[q - 1]}. Quadranten ist ${oName} α ${oN > 0 ? "positiv" : "negativ"}.` },
                  { value: 1 - Math.abs(gN / h), hint: `Nicht 1 − ${gName} α: Es gilt ${oName}²α = 1 − ${gName}²α.` },
                  { value: oV * oV, hint: `Das ist ${oName}²α. Ziehe noch die Wurzel.` },
                ],
              }),
              numField("tan α =", tanV, "", 3, { slips: [{ value: cosN / sinN, hint: "Umgekehrt geteilt: tan α = sin α : cos α." }] }),
            ],
            steps: [
              `${oName}²α = 1 − ${gName}²α = 1 − ${fracHtml(gN * gN, h * h)} = ${fracHtml(oN * oN, h * h)}`,
              `${oName} α = ± ${fracHtml(Math.abs(oN), h)}; im ${ROMAN[q - 1]}. Quadranten ist ${oName} α ${oN > 0 ? "positiv" : "negativ"}: ${oName} α = ${fracHtml(oN, h)} ≈ ${fmt(oV, 3)}`,
              `tan α = sin α : cos α = ${fracHtml(sinN, h)} : ${fracParen(cosN, h)} = ${fracHtml(sinN, cosN)} ≈ ${fmt(tanV, 3)}`,
              `<strong>${oName} α ≈ ${fmt(oV, 3)}, tan α ≈ ${fmt(tanV, 3)}</strong>`,
            ],
            meta: { q, u, w, h, givenSin: givenSin ? 1 : 0 },
          };
        }
        return {
          prompt: `Für einen Winkel α mit ${QUADRANT_RANGE[q]} gilt tan α = ${fracHtml(sinN, cosN)}. Berechne sin α und cos α, ohne α zu bestimmen, und runde auf drei Dezimalen.`,
          given: [`tan α = ${fracHtml(sinN, cosN)}`, QUADRANT_RANGE[q]],
          fields: [
            numField("sin α =", sinV, "", 3, {
              slips: [
                { value: -sinV, hint: `Vorzeichen: Für ${QUADRANT_RANGE[q]} ist sin α ${ss > 0 ? "positiv" : "negativ"}.` },
                { value: tanV, hint: "Das ist tan α. Nutze sin α = tan α · cos α und sin²α + cos²α = 1." },
              ],
            }),
            numField("cos α =", cosV, "", 3, {
              slips: [
                { value: -cosV, hint: `Vorzeichen: Für ${QUADRANT_RANGE[q]} ist cos α ${cs > 0 ? "positiv" : "negativ"}.` },
                { value: cosV * cosV, hint: "Das ist cos²α. Ziehe noch die Wurzel." },
              ],
            }),
          ],
          steps: [
            "Aus tan α = sin α : cos α folgt sin α = tan α · cos α. Eingesetzt in sin²α + cos²α = 1: cos²α · (1 + tan²α) = 1.",
            `cos²α = 1 : (1 + ${fracHtml(u * u, w * w)}) = 1 : ${fracHtml(h * h, w * w)} = ${fracHtml(w * w, h * h)}, also cos α = ± ${fracHtml(w, h)}.`,
            `Für ${QUADRANT_RANGE[q]} ist cos α ${cs > 0 ? "positiv" : "negativ"}: cos α = ${fracHtml(cosN, h)}; sin α = tan α · cos α = ${fracHtml(sinN, h)}.`,
            `<strong>sin α ≈ ${fmt(sinV, 3)}, cos α ≈ ${fmt(cosV, 3)}</strong>`,
          ],
          meta: { q, u, w, h, givenSin: -1 },
        };
      },
    },
    {
      id: "terme",
      make: (rng, level): ExerciseTask =>
        termTask(
          rng,
          level,
          TERMS_PYTHAGORAS[level],
          TERM_POOL,
          "sin²α + cos²α = 1 und tan α = sin α : cos α",
          ["sin²α + cos²α = 1", "tan α = sin α : cos α"],
          level === 1 ? "Vereinfache den Term so weit wie möglich:" : "Vereinfache so weit wie möglich (alle Nenner seien ungleich 0):",
        ),
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest Sinus, Kosinus und Tangens für jeden Winkel am Einheitskreis ab und nutzt sin²α + cos²α = 1.",
};

// 1.2 Vorzeichen, Supplementwinkel, negative Winkel ─────────────────────────

/** Lesson 1.2, Level 2: relations from a given acute angle β to other angles. */
export const RELATIONS: Array<{ fn: number; angle: (b: number) => number; sign: number; rule: (b: number) => string }> = [
  { fn: 0, angle: (b) => 180 - b, sign: 1, rule: (b) => `sin(180° − ${b}°) = sin ${b}°` },
  { fn: 1, angle: (b) => 180 - b, sign: -1, rule: (b) => `cos(180° − ${b}°) = −cos ${b}°` },
  { fn: 2, angle: (b) => 180 - b, sign: -1, rule: (b) => `tan(180° − ${b}°) = −tan ${b}°` },
  { fn: 0, angle: (b) => 180 + b, sign: -1, rule: (b) => `sin(180° + ${b}°) = −sin ${b}°` },
  { fn: 1, angle: (b) => 180 + b, sign: -1, rule: (b) => `cos(180° + ${b}°) = −cos ${b}°` },
  { fn: 2, angle: (b) => 180 + b, sign: 1, rule: (b) => `tan(180° + ${b}°) = tan ${b}°` },
  { fn: 0, angle: (b) => 360 - b, sign: -1, rule: (b) => `sin(360° − ${b}°) = −sin ${b}°` },
  { fn: 1, angle: (b) => 360 - b, sign: 1, rule: (b) => `cos(360° − ${b}°) = cos ${b}°` },
  { fn: 0, angle: (b) => -b, sign: -1, rule: (b) => `sin(−${b}°) = −sin ${b}°` },
  { fn: 1, angle: (b) => -b, sign: 1, rule: (b) => `cos(−${b}°) = cos ${b}°` },
  { fn: 2, angle: (b) => -b, sign: -1, rule: (b) => `tan(−${b}°) = −tan ${b}°` },
];

const winkelBis360: Lesson = {
  id: "tr-2-winkel-bis-360",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Vorzeichen, Supplementwinkel und negative Winkel",
  subtitle: "Ein Wert, zwei Winkel: was der Taschenrechner verschweigt",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Winkel bis 360° und negative Winkel`,
  whyItMatters:
    "Der Taschenrechner nennt zu sin α = 0,5 nur 30°. Wer am Einheitskreis den zweiten Winkel 150° findet, verliert in Dreiecks- und Prüfungsaufgaben keine Lösung.",
  explanationHtml: `
    <p>Am Einheitskreis hat jede Funktion in jedem Quadranten ein festes <strong>Vorzeichen</strong>: sin α ist die y-Koordinate von P, cos α die x-Koordinate, tan α = sin α : cos α.</p>
    <table class="mini">
      <tr><th>Quadrant</th><th>I</th><th>II</th><th>III</th><th>IV</th></tr>
      <tr><td>Winkel</td><td>0° bis 90°</td><td>90° bis 180°</td><td>180° bis 270°</td><td>270° bis 360°</td></tr>
      <tr><td>sin α</td><td>+</td><td>+</td><td>−</td><td>−</td></tr>
      <tr><td>cos α</td><td>+</td><td>−</td><td>−</td><td>+</td></tr>
      <tr><td>tan α</td><td>+</td><td>−</td><td>+</td><td>−</td></tr>
    </table>
    <p><strong>Supplementbeziehungen:</strong> Spiegelt man P an der y-Achse, gehört der Bildpunkt zum Winkel 180° − α. Die y-Koordinate bleibt gleich, die x-Koordinate wechselt das Vorzeichen:</p>
    <p class="formula-line">sin(180° − α) = sin α · cos(180° − α) = −cos α · tan(180° − α) = −tan α</p>
    <p><strong>Negative Winkel</strong> trägt man im Uhrzeigersinn ab. −α gehört zum selben Punkt wie 360° − α, zum an der x-Achse gespiegelten Punkt: sin(−α) = −sin α, cos(−α) = cos α, tan(−α) = −tan α. Der Gegenpunkt zu α + 180° liegt auf derselben Geraden durch O, deshalb ist tan(α + 180°) = tan α. Der Taschenrechner (Modus DEG) rechnet mit allen Winkeln, auch mit negativen.</p>
    <p><strong>Umgekehrt</strong> gibt es zu einem Wert in [0°; 360°[ meist <strong>zwei Winkel</strong>, der Taschenrechner zeigt aber nur einen: sin⁻¹ liefert Winkel von −90° bis 90°, cos⁻¹ von 0° bis 180°, tan⁻¹ von −90° bis 90°.</p>
    <ul>
      <li>sin α = k: α₁ = sin⁻¹(k), zweiter Winkel 180° − α₁ (Spiegelung an der y-Achse)</li>
      <li>cos α = k: α₁ = cos⁻¹(k), zweiter Winkel 360° − α₁ (Spiegelung an der x-Achse)</li>
      <li>tan α = k: α₁ = tan⁻¹(k), zweiter Winkel α₁ + 180° (Gegenpunkt am Ursprung)</li>
      <li>Einen negativen Taschenrechnerwinkel holt man mit + 360° in den Bereich von 0° bis 360°.</li>
    </ul>
    <div class="example">Beispiel: sin α = −0,6. Der Taschenrechner liefert sin⁻¹(−0,6) ≈ −36,87°, also α₁ ≈ −36,87° + 360° = 323,13° (IV. Quadrant). Der zweite Winkel ist 180° − (−36,87°) = 216,87° (III. Quadrant). L = {216,87°; 323,13°}.</div>
    <div class="merke"><strong>Merke:</strong> Erst den Taschenrechnerwinkel bestimmen, dann am Einheitskreis den zweiten Punkt mit demselben Wert suchen: beim Sinus an der y-Achse gespiegelt, beim Kosinus an der x-Achse, beim Tangens am Ursprung.</div>
  `,
  formulas: [
    { name: "Supplementbeziehungen", html: "sin(180° − α) = sin α; cos(180° − α) = −cos α; tan(180° − α) = −tan α", quantities: "P an der y-Achse gespiegelt" },
    { name: "Negative Winkel", html: "sin(−α) = −sin α; cos(−α) = cos α; tan(−α) = −tan α", quantities: "−α im Uhrzeigersinn, derselbe Punkt wie 360° − α" },
    { name: "Zweiter Winkel zum selben Wert", html: "sin: 180° − α₁ · cos: 360° − α₁ · tan: α₁ + 180°", quantities: "α₁ vom Taschenrechner; negative Winkel + 360°" },
  ],
  quiz: {
    question: "Der Taschenrechner liefert zu sin α = 0,4 den Winkel 23,58°. Welcher Winkel zwischen 0° und 360° hat ebenfalls den Sinuswert 0,4?",
    options: ["156,42°", "203,58°", "336,42°", "66,42°"],
    correctIndex: 0,
    explanation: "Der an der y-Achse gespiegelte Punkt hat dieselbe y-Koordinate: sin(180° − α) = sin α. Also 180° − 23,58° = 156,42°.",
  },
  lab: {
    kind: "supplement",
    title: "Labor: Zwei Winkel, ein Wert",
    intro: "Wähle die Funktion und ziehe P, auch auf negative Winkel. P′ hat denselben Wert, der grüne Ring zeigt, welchen Winkel der Taschenrechner (TR) liefert.",
    params: [
      {
        type: "choice",
        key: "fn",
        label: "Funktion",
        options: [
          { value: 0, label: "Sinus" },
          { value: 1, label: "Kosinus" },
          { value: 2, label: "Tangens" },
        ],
        value: 0,
      },
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: -180, max: 360, step: 1, value: 40 },
    ],
    readouts: [
      { key: "punkt", label: "gehört zum selben Punkt wie", compute: (v) => `${fmt(norm360(v.alpha))}°` },
      { key: "sin", label: "sin α", digits: 4, compute: (v) => sinD(v.alpha) },
      { key: "cos", label: "cos α", digits: 4, compute: (v) => cosD(v.alpha) },
      { key: "tan", label: "tan α", digits: 4, compute: (v) => (tanDefined(v.alpha) ? tanD(v.alpha) : "nicht definiert") },
      {
        key: "rechner",
        label: "Taschenrechner: Umkehrfunktion",
        emphasis: true,
        compute: (v) => {
          const calc = calculatorAngle(v.fn, v.alpha);
          return calc === null ? "Fehler: tan α nicht definiert" : `${FN_NAMES[v.fn]}⁻¹(${fmt(trig(v.fn, v.alpha), 3)}) = ${fmt(calc, 1)}°`;
        },
      },
      {
        key: "loesungen",
        label: "alle Winkel in [0°; 360°[ mit diesem Wert",
        compute: (v) => {
          const list = sameValueAngles(v.fn, v.alpha);
          return list.length ? list.map((x) => `${fmt(x, 1)}°`).join(" und ") : "keine";
        },
      },
    ],
    goals: [
      {
        id: "kosinus-negativ",
        text: "Kosinus: Stelle einen negativen Winkel ein, der denselben Kosinuswert hat wie 60°.",
        check: (v) => v.fn === 1 && v.alpha < 0 && within(cosD(v.alpha), 0.5, 1e-9),
      },
      {
        id: "sinus-zweite",
        text: "Sinus: Zu sin α = −0,5 liefert der Taschenrechner nur −30°. Ziehe P auf die Lösung im III. Quadranten.",
        check: (v) => v.fn === 0 && within(sinD(v.alpha), -0.5, 1e-9) && cosD(v.alpha) < 0,
      },
      {
        id: "tangens-partner",
        text: "Tangens: Finde einen Winkel mit P unterhalb der x-Achse, der denselben Tangenswert hat wie 40°.",
        check: (v) => v.fn === 2 && sinD(v.alpha) < 0 && tanDefined(v.alpha) && within(tanD(v.alpha), tanD(40), 1e-9),
      },
    ],
  },
  exercises: [
    {
      id: "werte",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let a = rng.next() < 0.5 ? -rng.int(10, 350) : rng.int(95, 355);
          while (a % 90 === 0) a = rng.next() < 0.5 ? -rng.int(10, 350) : rng.int(95, 355);
          const here = norm360(a);
          const q = Math.floor(here / 90);
          const s = sinD(a);
          const c = cosD(a);
          return {
            prompt: `Berechne mit dem Taschenrechner ${fnAt("sin", a)} und ${fnAt("cos", a)} auf drei Dezimalen. In welchem Quadranten liegt der zugehörige Punkt P auf dem Einheitskreis?`,
            given: [`α = ${fmt(a)}°`],
            formulaHint: "Taschenrechner auf DEG. Negative Winkel werden im Uhrzeigersinn abgetragen: −α gehört zum selben Punkt wie 360° − α.",
            fields: [
              numField(`${fnAt("sin", a)} =`, s, "", 3, { slips: [{ value: Math.sin(a), hint: RAD_HINT }] }),
              numField(`${fnAt("cos", a)} =`, c, "", 3, { slips: [{ value: Math.cos(a), hint: RAD_HINT }] }),
              choiceField("Quadrant von P", ["I", "II", "III", "IV"], q),
            ],
            steps: [
              `Taschenrechner (DEG): ${fnAt("sin", a)} ≈ ${fmt(s, 3)}, ${fnAt("cos", a)} ≈ ${fmt(c, 3)}`,
              a < 0
                ? `${fmt(a)}° wird im Uhrzeigersinn abgetragen und gehört zum selben Punkt wie ${fmt(a)}° + 360° = ${fmt(here)}°.`
                : `${a}° liegt zwischen ${q * 90}° und ${(q + 1) * 90}°.`,
              `Vorzeichen: sin ${s > 0 ? "&gt;" : "&lt;"} 0, cos ${c > 0 ? "&gt;" : "&lt;"} 0. <strong>${ROMAN[q]}. Quadrant; ${fnAt("sin", a)} ≈ ${fmt(s, 3)}, ${fnAt("cos", a)} ≈ ${fmt(c, 3)}</strong>`,
            ],
            meta: { a },
          };
        }
        let b = rng.int(10, 80);
        while (b === 45) b = rng.int(10, 80);
        const values = [round(sinD(b), 4), round(cosD(b), 4), round(tanD(b), 4)];
        const chosen = rng.shuffle(RELATIONS.map((_, i) => i)).slice(0, 3);
        const fields = chosen.map((index) => {
          const rel = RELATIONS[index];
          const angle = rel.angle(b);
          const answer = trig(rel.fn, angle);
          const other = rel.fn === 0 ? cosD(b) : rel.fn === 1 ? sinD(b) : 1 / tanD(b);
          return numField(`${fnAt(FN_NAMES[rel.fn], angle)} =`, answer, "", 4, {
            slips: [
              { value: -answer, hint: `Vorzeichen: ${fnAt(FN_NAMES[rel.fn], angle)} gehört zu einem Winkel im ${quadrantName(angle)}en.` },
              { value: rel.sign * other, hint: "Bei 180° ± β, 360° − β und −β bleibt die Funktion dieselbe; nur das Vorzeichen kann sich ändern." },
            ],
          });
        });
        const lines = chosen.map((index) => {
          const rel = RELATIONS[index];
          return `${rel.rule(b)} ≈ ${rel.sign < 0 ? "−" : ""}${fmt(values[rel.fn], 4)}`;
        });
        return {
          prompt: `Es gilt sin ${b}° ≈ ${fmt(values[0], 4)}, cos ${b}° ≈ ${fmt(values[1], 4)} und tan ${b}° ≈ ${fmt(values[2], 4)}. Gib ohne Taschenrechner an: ${fields.map((f) => f.label.replace(" =", "")).join(", ")}.`,
          given: [`sin ${b}° ≈ ${fmt(values[0], 4)}`, `cos ${b}° ≈ ${fmt(values[1], 4)}`, `tan ${b}° ≈ ${fmt(values[2], 4)}`],
          fields,
          steps: [...lines, `<strong>${fields.map((f) => `${f.label} ${fmt(f.answer, 4)}`).join("; ")}</strong>`],
          meta: { b, r1: chosen[0], r2: chosen[1], r3: chosen[2] },
        };
      },
    },
    {
      id: "umkehrung",
      make: (rng, level): ExerciseTask => {
        const fn = rng.int(0, 2);
        const name = FN_NAMES[fn];
        if (level === 1) {
          let k = fn === 2 ? (rng.sign() * rng.int(10, 400)) / 100 : rng.int(-95, 95) / 100;
          while (Math.abs(k) < 0.05) k = rng.int(-95, 95) / 100;
          const { solutions } = solveTrig(fn, k);
          const { steps, shown } = inverseSteps(fn, k);
          const slips = inverseSlips(fn, k);
          return {
            prompt: `Bestimme alle Winkel α mit 0° ≤ α &lt; 360°, für die ${name} α = ${fmt(k)} gilt. Runde auf zwei Dezimalen.`,
            given: [`${name} α = ${fmt(k)}`, "0° ≤ α &lt; 360°"],
            formulaHint: `α₁ = ${name}⁻¹(${fmt(k)}); zweiter Winkel: ${fn === 0 ? "180° − α₁" : fn === 1 ? "360° − α₁" : "α₁ + 180°"}; negative Winkel + 360°`,
            fields: [angleField("α₁ =", solutions[0], slips, 2, solutions), angleField("α₂ =", solutions[1], slips, 2, solutions)],
            anyOrder: [0, 1],
            steps: [...steps, `<strong>α₁ ≈ ${fmt(Math.min(...shown))}°, α₂ ≈ ${fmt(Math.max(...shown))}°</strong>`],
            meta: { fn, k },
          };
        }
        const a = rng.pick([2, 4, 5]);
        let k = fn === 2 ? rng.int(-30, 30) / 10 : rng.int(-9, 9) / 10;
        while (k === 0) k = fn === 2 ? rng.int(-30, 30) / 10 : rng.int(-9, 9) / 10;
        const b = rng.int(-3, 3);
        const ak = round(a * k, 2);
        const c = round(ak + b, 2);
        const left = `${a} · ${name} α${b === 0 ? "" : b > 0 ? ` + ${b}` : ` − ${-b}`}`;
        const { solutions } = solveTrig(fn, k);
        const { steps, shown } = inverseSteps(fn, k);
        const slips = inverseSlips(fn, k);
        return {
          prompt: `Bestimme die Lösungsmenge der Gleichung ${left} = ${fmt(c)} über der Grundmenge G = [0°; 360°[. Runde auf zwei Dezimalen.`,
          given: [`${left} = ${fmt(c)}`, "G = [0°; 360°["],
          fields: [angleField("α₁ =", solutions[0], slips, 2, solutions), angleField("α₂ =", solutions[1], slips, 2, solutions)],
          anyOrder: [0, 1],
          steps: [
            `Umformen: ${a} · ${name} α = ${fmt(c)}${b === 0 ? "" : b > 0 ? ` − ${b}` : ` + ${-b}`} = ${fmt(ak)}, also ${name} α = ${fmt(ak)} : ${a} = ${fmt(k)}`,
            ...steps,
            `<strong>L = {${fmt(Math.min(...shown))}°; ${fmt(Math.max(...shown))}°}</strong>`,
          ],
          meta: { fn, k, a, b },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst die Vorzeichen in allen Quadranten und findest zu jedem Wert beide Winkel, nicht nur den des Taschenrechners.",
};

// 1.3 Steigungswinkel und Schnittwinkel ─────────────────────────────────────

/** The inclination angle of a line with slope m: tan⁻¹(m), plus 180° for falling lines. */
export const inclinationOf = (m: number): number => (m >= 0 ? atanD(m) : atanD(m) + 180);

const NEGATIVE_TR = "Der Taschenrechner liefert einen negativen Winkel. Steigungswinkel liegen zwischen 0° und 180°: Addiere 180°.";

/** The steps of the intersection angle, from the inclination angles rounded to two decimals. */
function angleSteps(m1: number, m2: number): { lines: string[]; phi: number } {
  const a1 = round(inclinationOf(m1), 2);
  const a2 = round(inclinationOf(m2), 2);
  const d = round(Math.abs(a2 - a1), 2);
  const say = (m: number, a: number, i: string) => `α${i} = tan⁻¹(${fmt(m)})${m < 0 ? " + 180°" : ""} ≈ ${fmt(a)}°`;
  const phi = d <= 90 ? d : round(180 - d, 2);
  return {
    lines: [
      `${say(m1, a1, "₁")}; ${say(m2, a2, "₂")}`,
      `|α₂ − α₁| ≈ ${fmt(d)}°${d > 90 ? ` &gt; 90°, also φ = 180° − ${fmt(d)}° = ${fmt(phi)}°` : `, also φ ≈ ${fmt(phi)}°`}`,
    ],
    phi,
  };
}

const steigungswinkel: Lesson = {
  id: "tr-3-steigungswinkel",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Steigungswinkel und Schnittwinkel von Geraden",
  subtitle: "m = tan α, auch für fallende Geraden",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, m = tan α`,
  whyItMatters:
    "Mit m = tan α berechnest du, wie steil eine Rampe oder ein Förderband ist, stellst Geradengleichungen aus einem Winkel auf und bestimmst, unter welchem Winkel sich zwei Geraden kreuzen.",
  explanationHtml: `
    <p>Eine Gerade y = mx + t bildet mit der x-Achse den <strong>Steigungswinkel α</strong>. Man misst ihn an der Schnittstelle mit der x-Achse von der positiven x-Richtung aus gegen den Uhrzeigersinn bis zur Geraden, also 0° ≤ α &lt; 180°. Im Steigungsdreieck (1 nach rechts, m nach oben) ist m die Gegenkathete und 1 die Ankathete von α:</p>
    <p class="formula-line"><strong>m = tan α</strong></p>
    <ul>
      <li><strong>Winkel aus der Steigung:</strong> α = tan⁻¹(m). Für m &lt; 0 liefert der Taschenrechner einen negativen Winkel; der Steigungswinkel ist dann α = tan⁻¹(m) + 180°, er liegt zwischen 90° und 180°. Eine senkrechte Gerade (α = 90°) hat keine Steigung.</li>
      <li><strong>Gerade aus Punkt und Winkel:</strong> Geht g durch P(x<sub>P</sub> | y<sub>P</sub>) und hat den Steigungswinkel α, dann ist m = tan α und t = y<sub>P</sub> − m · x<sub>P</sub>.</li>
      <li><strong>Schnittwinkel:</strong> Zwei sich schneidende Geraden bilden mit der x-Achse ein Dreieck. Nach dem Außenwinkelsatz schließen sie den Winkel |α₂ − α₁| ein. Als <strong>Schnittwinkel φ</strong> nimmt man den kleineren der beiden Winkel: Ist |α₂ − α₁| größer als 90°, dann ist φ = 180° − |α₂ − α₁|.</li>
    </ul>
    <div class="example">Beispiel: g: y = 0,5x + 1 und h: y = −x + 4. α₁ = tan⁻¹(0,5) ≈ 26,57° und α₂ = tan⁻¹(−1) + 180° = −45° + 180° = 135°. Es ist |α₂ − α₁| ≈ 108,43° &gt; 90°, also schneiden sich g und h unter φ ≈ 180° − 108,43° = 71,57°.</div>
    <div class="merke"><strong>Merke:</strong> m = tan α mit 0° ≤ α &lt; 180°. Fallende Geraden haben Steigungswinkel über 90°. Der Schnittwinkel zweier Geraden ist höchstens 90°; stehen sie senkrecht, gilt m₁ · m₂ = −1.</div>
  `,
  formulas: [
    { name: "Steigungswinkel", html: "m = tan α", quantities: "0° ≤ α < 180°; bei m < 0 ist α = tan⁻¹(m) + 180°" },
    { name: "Gerade durch P", html: "t = y<sub>P</sub> − m · x<sub>P</sub>", quantities: "für y = mx + t durch den Punkt P mit m = tan α" },
    { name: "Schnittwinkel", html: "φ = |α₂ − α₁| oder φ = 180° − |α₂ − α₁|", quantities: "der kleinere Winkel, höchstens 90°" },
  ],
  quiz: {
    question: "Eine Gerade hat die Steigung m = −1. Wie groß ist ihr Steigungswinkel?",
    options: ["−45°", "45°", "135°", "315°"],
    correctIndex: 2,
    explanation: "tan⁻¹(−1) = −45°. Steigungswinkel liegen zwischen 0° und 180°, also ist α = −45° + 180° = 135°: Die Gerade fällt.",
  },
  lab: {
    kind: "slope-angle",
    title: "Labor: Zwei Geraden durch S",
    intro: "Drehe g (blauer Punkt) und h (oranger Punkt) und verschiebe ihren Schnittpunkt S. An der x-Achse stehen die Steigungswinkel, grün ist der Schnittwinkel.",
    params: [
      { type: "range", key: "a1", label: "Steigungswinkel α₁ von g", unit: "°", min: 0, max: 179, step: 1, value: 30 },
      { type: "range", key: "a2", label: "Steigungswinkel α₂ von h", unit: "°", min: 0, max: 179, step: 1, value: 105 },
      { type: "range", key: "sx", label: "S: x-Koordinate", unit: "", min: -4, max: 4, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "sy", label: "S: y-Koordinate", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
    ],
    readouts: [
      { key: "m1", label: "Steigung m₁ = tan α₁", digits: 3, compute: (v) => (v.a1 === 90 ? "keine (senkrecht)" : tanD(v.a1)) },
      { key: "m2", label: "Steigung m₂ = tan α₂", digits: 3, compute: (v) => (v.a2 === 90 ? "keine (senkrecht)" : tanD(v.a2)) },
      { key: "g", label: "Gerade g", compute: (v) => lineEquation(v.a1, v.sx, v.sy) },
      { key: "h", label: "Gerade h", compute: (v) => lineEquation(v.a2, v.sx, v.sy) },
      {
        key: "phi",
        label: "Schnittwinkel φ",
        unit: "°",
        digits: 0,
        emphasis: true,
        compute: (v) => (v.a1 === v.a2 ? "keiner, g und h fallen zusammen" : intersectionAngle(v.a1, v.a2)),
      },
    ],
    goals: [
      { id: "gerade", text: "Stelle g so ein, dass sie die Gleichung y = −x + 3 hat.", check: (v) => v.a1 === 135 && within(v.sy, 3 - v.sx, 1e-9) },
      { id: "senkrecht", text: "Mache h senkrecht zu g. Was ergibt dann m₁ · m₂?", check: (v) => Math.abs(v.a2 - v.a1) === 90 },
      {
        id: "stumpf",
        text: "Stelle α₁ und α₂ so ein, dass sie sich um mehr als 90° unterscheiden und sich die Geraden unter φ = 50° schneiden.",
        check: (v) => Math.abs(v.a2 - v.a1) === 130,
      },
    ],
  },
  exercises: [
    {
      id: "steigungswinkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            let m = rng.int(-40, 40) / 10;
            while (m === 0) m = rng.int(-40, 40) / 10;
            const t = rng.int(-5, 5);
            const calc = atanD(m);
            const alpha = inclinationOf(m);
            return {
              prompt: `Berechne den Steigungswinkel α der Geraden g: y = ${linear(m, t)} auf zwei Dezimalen.`,
              given: [`g: y = ${linear(m, t)}`, `m = ${fmt(m)}`],
              formulaHint: "m = tan α, also α = tan⁻¹(m); bei m &lt; 0 ist α = tan⁻¹(m) + 180°",
              fields: [angleField("α =", alpha, [{ value: calc, hint: NEGATIVE_TR }, { value: Math.atan(m), hint: RAD_HINT }])],
              steps:
                m > 0
                  ? [`tan α = m = ${fmt(m)}`, `α = tan⁻¹(${fmt(m)}) ≈ <strong>${fmt(alpha, 2)}°</strong>`]
                  : [
                      `tan α = m = ${fmt(m)}; der Taschenrechner liefert tan⁻¹(${fmt(m)}) ≈ ${fmt(calc, 2)}°.`,
                      `Die Gerade fällt, ihr Steigungswinkel liegt zwischen 90° und 180°: α ≈ ${fmt(round(calc, 2))}° + 180° = <strong>${fmt(round(calc, 2) + 180, 2)}°</strong>`,
                    ],
              meta: { variant: 0, m },
            };
          }
          const xp = rng.int(-4, 4);
          const yp = rng.int(-4, 4);
          let alpha = rng.int(10, 170);
          while (Math.abs(alpha - 90) < 8) alpha = rng.int(10, 170);
          const m = tanD(alpha);
          const t = yp - m * xp;
          return {
            prompt: `Die Gerade g geht durch P${point(xp, yp)} und hat den Steigungswinkel α = ${alpha}°. Bestimme ihre Gleichung y = mx + t (Werte auf zwei Dezimalen).`,
            given: [`P${point(xp, yp)}`, `α = ${alpha}°`],
            formulaHint: "m = tan α; t = y<sub>P</sub> − m · x<sub>P</sub>",
            fields: [
              numField("m =", m, "", 2, { slips: [{ value: Math.tan(alpha), hint: RAD_HINT }] }),
              numField("t =", t, "", 2, { absTolerance: 0.03, slips: [{ value: yp + m * xp, hint: "Vorzeichen beim Einsetzen: t = y<sub>P</sub> − m · x<sub>P</sub>." }] }),
            ],
            steps: [
              `m = tan ${alpha}° ≈ ${fmt(m, 4)}`,
              `t = y<sub>P</sub> − m · x<sub>P</sub> = ${fmt(yp)} − ${paren(m, 4)} · ${paren(xp)} ≈ ${fmt(t, 2)}`,
              `<strong>g: y = ${linear(m, t)}</strong>`,
            ],
            meta: { variant: 1, xp, yp, alpha },
          };
        }
        if (rng.next() < 0.5) {
          const alpha = rng.int(12, 40);
          const xa = rng.pick([1, 1.5, 2, 2.5, 3]);
          const run = rng.int(4, 12);
          const xq = xa + run;
          const m = tanD(alpha);
          const t = -m * xa;
          const height = m * run;
          return {
            prompt: `Ein gerades Förderband beginnt am Boden im Punkt A(${fmt(xa, 1)} | 0) und steigt unter einem Winkel von ${alpha}° gegen die Waagrechte nach rechts an (Koordinaten in m, der Boden ist die x-Achse). Bestimme die Gleichung der Geraden, auf der das Band liegt, und berechne, wie hoch das Band über der Stelle x = ${fmt(xq, 1)} m ist.`,
            given: [`A(${fmt(xa, 1)} | 0)`, `Steigungswinkel ${alpha}°`, `x = ${fmtUnit(xq, "m", 1)}`],
            fields: [
              numField("m =", m, "", 2, { slips: [{ value: Math.tan(alpha), hint: RAD_HINT }] }),
              numField("t =", t, "", 2, { absTolerance: 0.03, slips: [{ value: m * xa, hint: "Vorzeichen: Aus 0 = m · x<sub>A</sub> + t folgt t = −m · x<sub>A</sub>." }] }),
              numField("Höhe =", height, "m", 2, {
                absTolerance: 0.03,
                slips: [
                  { value: m * xq, hint: "Das ist nur m · x. Das Band beginnt erst bei A: Höhe = m · x + t." },
                  { value: run * sinD(alpha), hint: "Die waagrechte Strecke ist die Ankathete: Höhe = Δx · tan α." },
                ],
              }),
            ],
            steps: [
              `m = tan ${alpha}° ≈ ${fmt(m, 4)}`,
              `A liegt auf der Geraden: 0 = ${fmt(m, 4)} · ${fmt(xa, 1)} + t, also t ≈ ${fmt(t, 2)}`,
              `y = ${fmt(m, 4)} · ${fmt(xq, 1)} − ${fmt(-t, 4)} ≈ ${fmt(height, 2)}`,
              `<strong>y = ${linear(m, t)}; über x = ${fmt(xq, 1)} m ist das Band ${fmtUnit(height, "m")} hoch</strong>`,
            ],
            meta: { variant: 2, alpha, xa, xq },
          };
        }
        const beta = rng.int(20, 50);
        const h0 = rng.pick([2, 2.5, 3, 3.5, 4, 5]);
        const alpha = 180 - beta;
        const m = tanD(alpha);
        const x0 = h0 / tanD(beta);
        return {
          prompt: `Eine gerade Rutsche beginnt im Punkt S(0 | ${fmt(h0, 1)}) und fällt nach rechts unter einem Winkel von ${beta}° gegen die Waagrechte ab (Koordinaten in m, der Boden ist die x-Achse). Gib den Steigungswinkel α und die Steigung m der Geraden an, auf der die Rutsche liegt, und berechne, bei welchem x sie den Boden erreicht.`,
          given: [`S(0 | ${fmt(h0, 1)})`, `Gefälle: ${beta}° gegen die Waagrechte`],
          fields: [
            angleField("α =", alpha, [
              { value: beta, hint: "Die Gerade fällt: Ihr Steigungswinkel wird von der positiven x-Richtung gegen den Uhrzeigersinn gemessen und ist größer als 90°." },
              { value: -beta, hint: "Steigungswinkel liegen zwischen 0° und 180°: α = 180° − β." },
            ], 0),
            numField("m =", m, "", 2, { slips: [{ value: tanD(beta), hint: "Die Gerade fällt, also ist m negativ: m = tan(180° − β) = −tan β." }] }),
            numField("x =", x0, "m", 2, { slips: [{ value: h0 * tanD(beta), hint: "Boden heißt y = 0: 0 = m · x + t, also x = −t : m." }] }),
          ],
          steps: [
            `Fällt die Gerade unter ${beta}° gegen die Waagrechte, ist ihr Steigungswinkel α = 180° − ${beta}° = ${alpha}°.`,
            `m = tan ${alpha}° ≈ ${fmt(m, 4)}; S liegt auf der y-Achse, also t = ${fmt(h0, 1)}: y = ${linear(m, h0)}`,
            `Boden: 0 = ${fmt(m, 4)} · x + ${fmt(h0, 1)}, also x = ${fmt(h0, 1)} : ${fmt(-m, 4)} ≈ ${fmt(x0, 2)}`,
            `<strong>α = ${alpha}°, m ≈ ${fmt(m, 2)}, Boden bei x ≈ ${fmtUnit(x0, "m")}</strong>`,
          ],
          meta: { variant: 3, beta, h0 },
        };
      },
    },
    {
      id: "schnittwinkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const pickM = () => {
            let m = rng.int(-30, 30) / 10;
            while (m === 0) m = rng.int(-30, 30) / 10;
            return m;
          };
          const m1 = pickM();
          let m2 = pickM();
          while (m2 === m1) m2 = pickM();
          const t1 = rng.int(-4, 4);
          const t2 = rng.int(-4, 4);
          const a1 = inclinationOf(m1);
          const a2 = inclinationOf(m2);
          const d = Math.abs(a2 - a1);
          const phi = intersectionAngle(a1, a2);
          const { lines, phi: shownPhi } = angleSteps(m1, m2);
          return {
            prompt: `Die Geraden g: y = ${linear(m1, t1)} und h: y = ${linear(m2, t2)} schneiden sich. Berechne ihre Steigungswinkel α₁ und α₂ und den Schnittwinkel φ (auf zwei Dezimalen).`,
            given: [`g: y = ${linear(m1, t1)}`, `h: y = ${linear(m2, t2)}`],
            formulaHint: "α = tan⁻¹(m), bei m &lt; 0 noch + 180°; φ = |α₂ − α₁|, bei mehr als 90° φ = 180° − |α₂ − α₁|",
            fields: [
              angleField("α₁ =", a1, [{ value: atanD(m1), hint: NEGATIVE_TR }]),
              angleField("α₂ =", a2, [{ value: atanD(m2), hint: NEGATIVE_TR }]),
              angleField("φ =", phi, [{ value: d, hint: "Der Schnittwinkel ist der kleinere der beiden Winkel zwischen den Geraden: φ = 180° − |α₂ − α₁|." }]),
            ],
            steps: [...lines, `<strong>α₁ ≈ ${fmt(a1, 2)}°, α₂ ≈ ${fmt(a2, 2)}°, φ ≈ ${fmt(shownPhi, 2)}°</strong>`],
            meta: { m1, m2 },
          };
        }
        const SLOPES = [0.5, 1, 1.5, 2, 3, -0.5, -1, -1.5, -2, -3];
        const m1 = rng.pick(SLOPES);
        let m2 = rng.pick(SLOPES);
        while (m2 === m1) m2 = rng.pick(SLOPES);
        const xs = rng.int(-3, 3);
        const ys = rng.int(-3, 3);
        const A = { x: xs - 2, y: ys - 2 * m1 };
        const B = { x: xs + 2, y: ys + 2 * m1 };
        const t1 = ys - m1 * xs;
        const t2 = ys - m2 * xs;
        const a1 = inclinationOf(m1);
        const a2 = inclinationOf(m2);
        const phi = intersectionAngle(a1, a2);
        const { lines, phi: shownPhi } = angleSteps(m1, m2);
        return {
          prompt: `Die Gerade g verläuft durch die Punkte A${point(A.x, A.y)} und B${point(B.x, B.y)}, die Gerade h hat die Gleichung y = ${linear(m2, t2)}. Berechne den Schnittpunkt S von g und h und den Winkel φ, unter dem sich die beiden Geraden schneiden.`,
          given: [`A${point(A.x, A.y)}, B${point(B.x, B.y)}`, `h: y = ${linear(m2, t2)}`],
          fields: [
            numField("x<sub>S</sub> =", xs, "", 2),
            numField("y<sub>S</sub> =", ys, "", 2),
            angleField("φ =", phi, [{ value: Math.abs(a2 - a1), hint: "Der Schnittwinkel ist der kleinere der beiden Winkel: φ = 180° − |α₂ − α₁|." }]),
          ],
          steps: [
            `m₁ = (${fmt(B.y)} − ${paren(A.y)}) : (${fmt(B.x)} − ${paren(A.x)}) = ${fmt(4 * m1)} : 4 = ${fmt(m1)}; t₁ = ${fmt(A.y)} − ${paren(m1)} · ${paren(A.x)} = ${fmt(t1)}, also g: y = ${linear(m1, t1)}`,
            `Gleichsetzen: ${linear(m1, t1)} = ${linear(m2, t2)} ergibt x = ${fmt(xs)} und y = ${fmt(ys)}.`,
            ...lines,
            `<strong>S${point(xs, ys)}, φ ≈ ${fmt(shownPhi, 2)}°</strong>`,
          ],
          meta: { xs, ys, m1, m2 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest mit m = tan α zwischen Steigung und Winkel hin und her und bestimmst Schnittwinkel von Geraden.",
};

// 1.4 Die Sinusfunktion ──────────────────────────────────────────────────────

/** All angles in [0°; 720°] with the same sine as α. */
function sameSineTo720(alpha: number): string {
  const base = sameValueAngles(0, alpha);
  const all = [...base, ...base.map((x) => x + 360), ...base.map((x) => x + 720)].filter((x) => x <= 720 + 1e-9);
  return [...new Set(all.map((x) => round(x, 6)))]
    .sort((p, q) => p - q)
    .map((x) => `${fmt(x)}°`)
    .join(", ");
}

const CITIES = [
  { name: "München", mean: 12.2, amp: 3.8 },
  { name: "Berlin", mean: 12.3, amp: 4.6 },
  { name: "Hamburg", mean: 12.3, amp: 4.8 },
] as const;

const sinusfunktion: Lesson = {
  id: "tr-4-sinusfunktion",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Die Sinusfunktion und periodische Vorgänge",
  subtitle: "Vom Kreis zur Welle: Riesenrad, Tageslänge, Pendel",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Graph von y = sin α`,
  whyItMatters:
    "Riesenräder, Tageslängen, Gezeiten und Pendel wiederholen sich in gleichen Abständen. Die Sinuskurve beschreibt solche periodischen Vorgänge, und du kannst an ihr Höchst- und Tiefstwerte ablesen.",
  explanationHtml: `
    <p>Lässt man P auf dem Einheitskreis umlaufen und trägt zu jedem Winkel α die Höhe sin α (die y-Koordinate von P) über α ab, entsteht der Graph der <strong>Sinusfunktion y = sin α</strong>, die Sinuskurve. Nach einer vollen Umdrehung ist P wieder am Start, deshalb wiederholt sich die Kurve.</p>
    <ul>
      <li><strong>Periode 360°:</strong> sin(α + 360°) = sin α. Man darf beliebige Winkel einsetzen, auch über 360° und negative.</li>
      <li><strong>Wertemenge:</strong> −1 ≤ sin α ≤ 1.</li>
      <li><strong>Nullstellen</strong> bei 0°, 180°, 360°, …, allgemein bei k · 180° (k ganze Zahl).</li>
      <li><strong>Hochpunkte</strong> (Wert 1) bei 90° + k · 360°, <strong>Tiefpunkte</strong> (Wert −1) bei 270° + k · 360°.</li>
      <li>Von 0° bis 90° steigt die Kurve, von 90° bis 270° fällt sie, von 270° bis 360° steigt sie wieder. Weil sin(180° − α) = sin α ist, liegt der Bogen von 0° bis 180° symmetrisch zur senkrechten Geraden bei 90°.</li>
    </ul>
    <p><strong>Periodische Vorgänge</strong> folgen oft einer Sinuskurve: Die Höhe einer Gondel im Riesenrad wiederholt sich mit jeder Umdrehung, die Tageslänge mit jedem Jahr, die Auslenkung eines Pendels mit jeder Schwingung. Liegt die Achse eines Riesenrads mit dem Radius r in der Höhe h<sub>A</sub> und misst man den Drehwinkel α ab der waagrechten Stellung, dann ist die Gondel h = h<sub>A</sub> + r · sin α hoch.</p>
    <div class="example">Beispiel: Riesenrad mit r = 20 m und 22 m hoher Achse: h = 22 m + 20 m · sin α. Bei α = 210° ist h = 22 m + 20 m · (−0,5) = 12 m. Die Gondel ist höchstens 42 m und mindestens 2 m hoch; nach 360° wiederholt sich alles.</div>
    <div class="merke"><strong>Merke:</strong> sin α = k hat für −1 &lt; k &lt; 1 in jeder Periode genau zwei Lösungen. Alle weiteren erhältst du, indem du Vielfache von 360° addierst.</div>
  `,
  formulas: [
    { name: "Periode der Sinusfunktion", html: "sin(α + 360°) = sin α", quantities: "die Sinuskurve wiederholt sich nach 360°" },
    { name: "Nullstellen und Extremstellen", html: "Nullstellen k · 180°; Hochpunkte 90° + k · 360°; Tiefpunkte 270° + k · 360°", quantities: "k ganze Zahl; Wertemenge von −1 bis 1" },
    { name: "Höhe am Riesenrad", html: "h = h<sub>A</sub> + r · sin α", quantities: "Achsenhöhe hA, Radius r, Drehwinkel α ab der waagrechten Stellung" },
  ],
  quiz: {
    question: "Welchen Wert hat sin 750°?",
    options: ["0,5", "−0,5", "0,866", "nicht definiert"],
    correctIndex: 0,
    explanation: "750° = 2 · 360° + 30°. Die Sinusfunktion hat die Periode 360°, also ist sin 750° = sin 30° = 0,5.",
  },
  lab: {
    kind: "sine-graph",
    title: "Labor: Vom Kreis zur Sinuskurve",
    intro: "Ziehe P auf dem Kreis oder den blauen Punkt auf der Kurve: Beide liegen immer auf derselben Höhe. Die grünen Ringe markieren denselben Wert eine Periode früher oder später.",
    params: [
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 0, max: 720, step: 5, value: 50 },
      {
        type: "choice",
        key: "ctx",
        label: "Ansicht",
        options: [
          { value: 0, label: "Einheitskreis: y = sin α" },
          { value: 1, label: "Riesenrad (r = 20 m, Achse 22 m hoch)" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "sin", label: "sin α", digits: 4, emphasis: true, compute: (v) => sinD(v.alpha) },
      { key: "h", label: "Riesenrad: h = 22 m + 20 m · sin α", unit: "m", digits: 2, compute: (v) => wheelHeight(v.alpha) },
      { key: "gleich", label: "derselbe Sinuswert von 0° bis 720° bei", compute: (v) => sameSineTo720(v.alpha) },
      {
        key: "verlauf",
        label: "Verlauf der Kurve bei α",
        compute: (v) => {
          const c = cosD(v.alpha);
          const s = sinD(v.alpha);
          if (Math.abs(c) < 1e-9) return s > 0 ? "Hochpunkt (größter Wert 1)" : "Tiefpunkt (kleinster Wert −1)";
          return `${Math.abs(s) < 1e-9 ? "Nullstelle, " : ""}${c > 0 ? "die Kurve steigt" : "die Kurve fällt"}`;
        },
      },
    ],
    goals: [
      {
        id: "periode",
        text: "Finde einen Winkel über 360°, bei dem die Kurve denselben Wert hat wie bei 50°.",
        check: (v) => v.alpha > 360 && within(sinD(v.alpha), sinD(50), 1e-9),
      },
      {
        id: "nullstelle-fallend",
        text: "Stelle eine Nullstelle zwischen 360° und 720° ein, an der die Kurve fällt.",
        check: (v) => v.alpha > 360 && v.alpha < 720 && Math.abs(sinD(v.alpha)) < 1e-9 && cosD(v.alpha) < 0,
      },
      {
        id: "riesenrad",
        text: "Riesenrad: Die Gondel soll 12 m hoch sein und gerade abwärts fahren.",
        check: (v) => v.ctx === 1 && within(wheelHeight(v.alpha), 12, 1e-9) && cosD(v.alpha) < 0,
      },
    ],
  },
  exercises: [
    {
      id: "sinusgleichung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let k = rng.int(-95, 95) / 100;
          while (Math.abs(k) < 0.05) k = rng.int(-95, 95) / 100;
          const { solutions } = solveTrig(0, k);
          const all = [...solutions, solutions[0] + 360, solutions[1] + 360];
          const { steps, shown } = inverseSteps(0, k);
          const s = [Math.min(...shown), Math.max(...shown)];
          const slips = inverseSlips(0, k);
          return {
            prompt: `Bestimme alle Winkel α mit 0° ≤ α &lt; 720°, für die sin α = ${fmt(k)} gilt. Runde auf zwei Dezimalen.`,
            given: [`sin α = ${fmt(k)}`, "0° ≤ α &lt; 720° (zwei Perioden)"],
            formulaHint: "In [0°; 360°[: α₁ = sin⁻¹(k) und 180° − α₁ (negative Winkel + 360°); Periode 360°: jeweils + 360°",
            fields: all.map((x, i) => angleField(`α${["₁", "₂", "₃", "₄"][i]} =`, x, slips, 2, all)),
            anyOrder: [0, 1, 2, 3],
            steps: [
              ...steps,
              `Periode 360°: ${fmt(s[0])}° + 360° = ${fmt(s[0] + 360)}° und ${fmt(s[1])}° + 360° = ${fmt(s[1] + 360)}°`,
              `<strong>α ≈ ${fmt(s[0])}°, ${fmt(s[1])}°, ${fmt(s[0] + 360)}° oder ${fmt(s[1] + 360)}°</strong>`,
            ],
            meta: { k },
          };
        }
        const r = rng.pick([15, 20, 25, 30]);
        const hub = r + rng.pick([2, 3, 5]);
        let k = rng.int(-9, 9) / 10;
        while (k === 0) k = rng.int(-9, 9) / 10;
        const target = round(hub + r * k, 2);
        const aq = rng.int(2, 34) * 10 + 5;
        const hq = hub + r * sinD(aq);
        const { solutions } = solveTrig(0, k);
        const { steps, shown } = inverseSteps(0, k);
        const slips = inverseSlips(0, k);
        return {
          prompt: `Für ein Riesenrad mit dem Radius ${r} m und einer ${hub} m hohen Achse gilt für die Höhe einer Gondel h = ${hub} m + ${r} m · sin α. Dabei ist α der Drehwinkel ab der waagrechten Stellung rechts neben der Achse. Bei welchen Drehwinkeln während der ersten Umdrehung (0° ≤ α &lt; 360°) ist die Gondel ${fmt(target, 1)} m hoch? Wie hoch ist sie bei α = ${aq}°?`,
          given: [`h = ${hub} m + ${r} m · sin α`, `gesuchte Höhe ${fmtUnit(target, "m", 1)}`, `α = ${aq}°`],
          fields: [
            angleField("α₁ =", solutions[0], slips, 2, solutions),
            angleField("α₂ =", solutions[1], slips, 2, solutions),
            numField(`Höhe bei ${aq}°: h =`, hq, "m", 2, {
              slips: [
                { value: hub + r * Math.sin(aq), hint: RAD_HINT },
                { value: r * sinD(aq), hint: "Das ist die Höhe über der Achse. Addiere die Achsenhöhe." },
              ],
            }),
          ],
          anyOrder: [0, 1],
          steps: [
            `${fmt(target, 1)} = ${hub} + ${r} · sin α, also sin α = (${fmt(target, 1)} − ${hub}) : ${r} = ${fmt(k)}`,
            ...steps,
            `h(${aq}°) = ${hub} m + ${r} m · sin ${aq}° ≈ ${fmt(hq, 2)} m`,
            `<strong>α ≈ ${fmt(Math.min(...shown))}° oder α ≈ ${fmt(Math.max(...shown))}°; bei ${aq}° ist h ≈ ${fmtUnit(hq, "m")}</strong>`,
          ],
          meta: { r, hub, k, aq },
        };
      },
    },
    {
      id: "kurve",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const k = rng.int(-2, 3);
          const a = 180 * k;
          const even = Math.abs(k) % 2 === 0;
          const hi = even ? a + 90 : a + 270;
          const lo = even ? a + 270 : a + 90;
          const zero = a + 180;
          const edge = "Das ist ein Randwert des Intervalls. Gesucht ist die Nullstelle dazwischen.";
          return {
            prompt: `Betrachte die Sinuskurve y = sin α im Intervall [${fmt(a)}°; ${fmt(a + 360)}°]. Bei welchem Winkel liegt dort der Hochpunkt, bei welchem der Tiefpunkt, und wo liegt die Nullstelle zwischen den beiden Randwerten?`,
            given: [`Intervall [${fmt(a)}°; ${fmt(a + 360)}°]`],
            formulaHint: "Hochpunkte bei 90° + k · 360°, Tiefpunkte bei 270° + k · 360°, Nullstellen bei k · 180°",
            fields: [
              angleField("Hochpunkt bei α =", hi, [{ value: lo, hint: "Das ist der Tiefpunkt. Am Hochpunkt ist sin α = 1." }], 0),
              angleField("Tiefpunkt bei α =", lo, [{ value: hi, hint: "Das ist der Hochpunkt. Am Tiefpunkt ist sin α = −1." }], 0),
              angleField("Nullstelle bei α =", zero, [{ value: a, hint: edge }, { value: a + 360, hint: edge }], 0),
            ],
            steps: [
              `Hochpunkte liegen bei 90° + k · 360°, im Intervall also bei ${fmt(hi)}°. Tiefpunkte liegen bei 270° + k · 360°: bei ${fmt(lo)}°.`,
              `Nullstellen liegen bei k · 180°: an den Rändern ${fmt(a)}° und ${fmt(a + 360)}° und dazwischen bei ${fmt(zero)}°.`,
              `<strong>Hochpunkt bei ${fmt(hi)}°, Tiefpunkt bei ${fmt(lo)}°, Nullstelle bei ${fmt(zero)}°</strong>`,
            ],
            meta: { a },
          };
        }
        const city = rng.pick(CITIES);
        let aq = rng.int(1, 35) * 10;
        while (aq % 90 === 0) aq = rng.int(1, 35) * 10;
        const longest = city.mean + city.amp;
        const dq = city.mean + city.amp * sinD(aq);
        return {
          prompt: `Die Tageslänge in ${city.name} lässt sich näherungsweise durch d = ${fmt(city.mean, 1)} h + ${fmt(city.amp, 1)} h · sin α beschreiben. Dabei ist α der „Jahreswinkel“: Ein Jahr entspricht 360°, α = 0° ist der Frühlingsanfang am 20. März. Wie lang ist der längste Tag, bei welchem Jahreswinkel tritt er auf, und wie lang ist der Tag bei α = ${aq}°?`,
          given: [`d = ${fmt(city.mean, 1)} h + ${fmt(city.amp, 1)} h · sin α`, "360° ≙ 1 Jahr, 0° ≙ 20. März", `α = ${aq}°`],
          fields: [
            numField("längster Tag: d =", longest, "h", 1, {
              slips: [
                { value: city.mean, hint: "Das ist der Mittelwert. Der größte Wert von sin α ist 1." },
                { value: city.mean - city.amp, hint: "Das ist der kürzeste Tag, bei sin α = −1." },
              ],
            }),
            angleField("bei α =", 90, [{ value: 270, hint: "Bei 270° ist sin α = −1: Das ist der kürzeste Tag." }, { value: 180, hint: "Bei 180° ist sin α = 0: Herbstanfang, Tag und Nacht sind gleich lang." }], 0),
            numField(`Tageslänge bei ${aq}°: d =`, dq, "h", 2, { slips: [{ value: city.mean + city.amp * Math.sin(aq), hint: RAD_HINT }] }),
          ],
          steps: [
            "sin α ist höchstens 1, und zwar bei α = 90°, ein Vierteljahr nach Frühlingsanfang (um den 21. Juni).",
            `d<sub>max</sub> = ${fmt(city.mean, 1)} h + ${fmt(city.amp, 1)} h · 1 = ${fmt(longest, 1)} h`,
            `d(${aq}°) = ${fmt(city.mean, 1)} h + ${fmt(city.amp, 1)} h · sin ${aq}° ≈ ${fmt(dq, 2)} h`,
            `<strong>längster Tag ${fmtUnit(longest, "h", 1)} bei α = 90°; bei ${aq}° ist d ≈ ${fmtUnit(dq, "h")}</strong>`,
          ],
          meta: { mean: city.mean, amp: city.amp, aq },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du beschreibst die Sinuskurve mit Periode, Nullstellen und Extremstellen und nutzt sie für periodische Vorgänge.",
};

// 1.5 Kosinus- und Tangensfunktion, Komplementbeziehungen ────────────────────

/** Lesson 1.5, Level 2: terms with sin(90° − α) = cos α and cos(90° − α) = sin α. */
export const TERMS_KOMPLEMENT: TermCase[] = [
  { text: "sin(90° − α) · tan α", answer: "sin α", steps: ["= cos α · tan α = cos α · (sin α : cos α)", "= sin α"] },
  { text: "cos(90° − α) : sin(90° − α)", answer: "tan α", steps: ["= sin α : cos α", "= tan α"] },
  { text: "sin²(90° − α) + sin²α", answer: "1", steps: ["= cos²α + sin²α", "= 1"] },
  { text: "cos(90° − α) · sin α + sin(90° − α) · cos α", answer: "1", steps: ["= sin α · sin α + cos α · cos α", "= sin²α + cos²α = 1"] },
  { text: "sin(90° − α) · cos(90° − α) · tan α", answer: "sin²α", steps: ["= cos α · sin α · (sin α : cos α)", "= sin²α"] },
  { text: "1 − cos²(90° − α)", answer: "cos²α", steps: ["= 1 − sin²α", "= cos²α"] },
  { text: "sin(90° − α) : cos α + 1", answer: "2", steps: ["= cos α : cos α + 1", "= 1 + 1 = 2"] },
  { text: "tan α · cos α − cos(90° − α) + sin(90° − α)", answer: "cos α", steps: ["= sin α − sin α + cos α", "= cos α"] },
];

const kosinusTangens: Lesson = {
  id: "tr-5-kosinus-tangens",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Kosinus- und Tangensfunktion, Komplementbeziehungen",
  subtitle: "Verschobener Sinus, Asymptoten und 90° − α",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN_I}, Graphen von y = cos α und y = tan α, Komplementbeziehungen`,
  whyItMatters:
    "Kosinus- und Tangenskurve gehören zum Grundwissen über Funktionen. Mit sin(90° − α) = cos α wandelst du Terme um, statt mit gerundeten Taschenrechnerwerten zu rechnen.",
  explanationHtml: `
    <p>Trägt man statt der y-Koordinate die <strong>x-Koordinate</strong> von P über dem Winkel ab, entsteht der Graph von <strong>y = cos α</strong>. Er sieht aus wie die Sinuskurve, nur um 90° nach links verschoben: cos α = sin(α + 90°).</p>
    <ul>
      <li><strong>Kosinusfunktion:</strong> Periode 360°, Wertemenge −1 ≤ cos α ≤ 1, Nullstellen bei 90° + k · 180°, Hochpunkte bei k · 360°, Tiefpunkte bei 180° + k · 360°. Wegen cos(−α) = cos α ist die Kurve achsensymmetrisch zur y-Achse.</li>
      <li><strong>Tangensfunktion y = tan α:</strong> Sie ist für α = 90° + k · 180° nicht definiert. Dort hat der Graph <strong>senkrechte Asymptoten</strong>: Kurz vor 90° wird tan α beliebig groß, kurz danach beliebig klein. Zwischen zwei Asymptoten steigt die Kurve immer. Die Nullstellen liegen bei k · 180°, die Wertemenge sind alle reellen Zahlen. Weil P und der Gegenpunkt zu α + 180° auf derselben Geraden durch O liegen, hat der Tangens die <strong>Periode 180°</strong>.</li>
    </ul>
    <p><strong>Komplementbeziehungen:</strong> Im rechtwinkligen Dreieck ist der zweite spitze Winkel 90° − α; die Gegenkathete von α ist die Ankathete von 90° − α und umgekehrt. Am Einheitskreis vertauscht die Spiegelung an der Geraden y = x die beiden Koordinaten. Deshalb gilt für jeden Winkel:</p>
    <p class="formula-line">sin(90° − α) = cos α  ·  cos(90° − α) = sin α</p>
    <div class="example">Beispiel: sin 70° = sin(90° − 20°) = cos 20°. Und ein Term wird kürzer: sin(90° − α) · tan α = cos α · (sin α : cos α) = sin α.</div>
    <div class="merke"><strong>Merke:</strong> Sinus und Kosinus haben die Periode 360°, der Tangens 180°. Beim Komplementwinkel 90° − α wird aus sin ein cos und aus cos ein sin.</div>
  `,
  formulas: [
    { name: "Komplementbeziehungen", html: "sin(90° − α) = cos α; cos(90° − α) = sin α", quantities: "für jeden Winkel α" },
    { name: "Kosinus als verschobener Sinus", html: "cos α = sin(α + 90°)", quantities: "die Kosinuskurve ist die um 90° nach links verschobene Sinuskurve" },
    { name: "Tangensfunktion", html: "tan(α + 180°) = tan α; Asymptoten bei α = 90° + k · 180°", quantities: "k ganze Zahl; Nullstellen bei k · 180°" },
  ],
  quiz: {
    question: "Welcher Term hat denselben Wert wie sin 70°?",
    options: ["cos 20°", "cos 70°", "sin 20°", "−cos 20°"],
    correctIndex: 0,
    explanation: "Komplementbeziehung: sin 70° = sin(90° − 20°) = cos 20°. Im rechtwinkligen Dreieck ist die Gegenkathete von 70° die Ankathete von 20°.",
  },
  lab: {
    kind: "cos-tan-graph",
    title: "Labor: Kosinus, Tangens und der Komplementwinkel",
    intro: "Wähle eine Ansicht und ziehe P auf dem Kreis oder den blauen Punkt auf der Kurve. Beim Tangens zeigen die gestrichelten senkrechten Linien die Asymptoten.",
    params: [
      {
        type: "choice",
        key: "view",
        label: "Ansicht",
        options: [
          { value: 0, label: "Kosinusfunktion y = cos α" },
          { value: 1, label: "Tangensfunktion y = tan α" },
          { value: 2, label: "Komplementwinkel 90° − α" },
        ],
        value: 0,
      },
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: -360, max: 360, step: 5, value: 30 },
    ],
    readouts: [
      { key: "cos", label: "cos α", digits: 4, emphasis: true, compute: (v) => cosD(v.alpha) },
      { key: "sin", label: "sin α", digits: 4, compute: (v) => sinD(v.alpha) },
      { key: "tan", label: "tan α", digits: 4, compute: (v) => (tanDefined(v.alpha) ? tanD(v.alpha) : "nicht definiert (Asymptote)") },
      { key: "sinKomp", label: "sin(90° − α)", digits: 4, compute: (v) => sinD(90 - v.alpha) },
      { key: "cosKomp", label: "cos(90° − α)", digits: 4, compute: (v) => cosD(90 - v.alpha) },
    ],
    goals: [
      {
        id: "asymptote",
        text: "Tangens: Stelle einen negativen Winkel ein, an dem die Tangenskurve eine senkrechte Asymptote hat.",
        check: (v) => v.view === 1 && v.alpha < 0 && !tanDefined(v.alpha),
      },
      {
        id: "kosinus-steigt",
        text: "Kosinus: Finde die Nullstelle zwischen 0° und 360°, an der die Kosinuskurve steigt.",
        check: (v) => v.view === 0 && v.alpha > 0 && v.alpha < 360 && Math.abs(cosD(v.alpha)) < 1e-9 && sinD(v.alpha) < 0,
      },
      {
        id: "komplement",
        text: "Komplement: Stelle einen spitzen Winkel α ein, für den sin(90° − α) = 0,5 ist.",
        check: (v) => v.view === 2 && v.alpha > 0 && v.alpha < 90 && within(sinD(90 - v.alpha), 0.5, 1e-9),
      },
    ],
  },
  exercises: [
    {
      id: "komplement",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const b1 = rng.int(1, 89);
          const b2 = rng.int(1, 89);
          const same = "Gleicher Winkel geht nur bei 45°. Der Komplementwinkel ist 90° − β.";
          const supplement = "Das ist der Supplementwinkel 180° − β. Zwischen sin und cos führt der Komplementwinkel 90° − β.";
          return {
            prompt: `Schreibe mit den Komplementbeziehungen sin ${b1}° als Kosinus und cos ${b2}° als Sinus eines Winkels zwischen 0° und 90°.`,
            given: [`sin ${b1}°`, `cos ${b2}°`],
            formulaHint: "sin β = cos(90° − β), cos β = sin(90° − β)",
            fields: [
              angleField(`sin ${b1}° = cos`, 90 - b1, [{ value: b1, hint: same }, { value: 180 - b1, hint: supplement }], 0),
              angleField(`cos ${b2}° = sin`, 90 - b2, [{ value: b2, hint: same }, { value: 180 - b2, hint: supplement }], 0),
            ],
            steps: [
              `sin ${b1}° = cos(90° − ${b1}°) = cos ${90 - b1}°`,
              `cos ${b2}° = sin(90° − ${b2}°) = sin ${90 - b2}°`,
              `<strong>sin ${b1}° = cos ${90 - b1}°, cos ${b2}° = sin ${90 - b2}°</strong>`,
            ],
            meta: { b1, b2 },
          };
        }
        return termTask(rng, 2, TERMS_KOMPLEMENT, TERM_POOL, "", [], "Vereinfache mit den Komplementbeziehungen so weit wie möglich:");
      },
    },
    {
      id: "graphen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const type = rng.int(0, 3);
          const a = 180 * rng.int(-2, 1);
          const interval = `[${fmt(a)}°; ${fmt(a + 360)}°[`;
          const hint =
            "cos: Nullstellen bei 90° + k · 180°, Hochpunkte bei k · 360°, Tiefpunkte bei 180° + k · 360°; tan: Nullstellen bei k · 180°, Asymptoten bei 90° + k · 180°";
          if (type === 1) {
            const maxFirst = Math.abs(a) % 360 === 0;
            const hi = maxFirst ? a : a + 180;
            const lo = maxFirst ? a + 180 : a;
            return {
              prompt: `Bei welchen Winkeln hat die Kosinuskurve y = cos α im Intervall ${interval} ihren Hochpunkt und ihren Tiefpunkt?`,
              given: [`y = cos α`, `Intervall ${interval}`],
              formulaHint: hint,
              fields: [
                angleField("Hochpunkt bei α =", hi, [{ value: hi + 90, hint: "Dort ist cos α = 0. Am Hochpunkt ist cos α = 1." }], 0),
                angleField("Tiefpunkt bei α =", lo, [{ value: lo + 90, hint: "Dort ist cos α = 0. Am Tiefpunkt ist cos α = −1." }], 0),
              ],
              steps: [
                "Hochpunkte der Kosinuskurve liegen bei k · 360° (cos α = 1), Tiefpunkte bei 180° + k · 360° (cos α = −1).",
                `Im Intervall ${interval}: Hochpunkt bei ${fmt(hi)}°, Tiefpunkt bei ${fmt(lo)}°.`,
                `<strong>Hochpunkt bei ${fmt(hi)}°, Tiefpunkt bei ${fmt(lo)}°</strong>`,
              ],
              meta: { type, a },
            };
          }
          const answers = type === 2 ? [a, a + 180] : [a + 90, a + 270];
          const question = [
            `Gib alle Nullstellen der Funktion y = cos α im Intervall ${interval} an.`,
            "",
            `Gib alle Nullstellen der Funktion y = tan α im Intervall ${interval} an.`,
            `An welchen Stellen hat der Graph von y = tan α im Intervall ${interval} senkrechte Asymptoten?`,
          ][type];
          const rule = ["Nullstellen von y = cos α liegen bei 90° + k · 180°.", "", "Nullstellen von y = tan α liegen bei k · 180°.", "Asymptoten von y = tan α liegen bei 90° + k · 180°, dort ist cos α = 0."][type];
          const slip: Slip =
            type === 0
              ? { value: a, hint: "Dort hat cos α den Wert 1 oder −1. Nullstellen liegen bei 90° + k · 180°." }
              : type === 2
                ? { value: a + 90, hint: "Bei 90° + k · 180° hat der Tangens Asymptoten, keine Nullstellen." }
                : { value: a, hint: "Bei k · 180° hat der Tangens Nullstellen. Asymptoten liegen dort, wo cos α = 0 ist." };
          return {
            prompt: question,
            given: [type === 0 ? "y = cos α" : "y = tan α", `Intervall ${interval}`],
            formulaHint: hint,
            fields: answers.map((x, i) => angleField(`α${i === 0 ? "₁" : "₂"} =`, x, [slip], 0, answers)),
            anyOrder: [0, 1],
            steps: [rule, `Im Intervall ${interval}: ${fmt(answers[0])}° und ${fmt(answers[1])}°.`, `<strong>α₁ = ${fmt(answers[0])}°, α₂ = ${fmt(answers[1])}°</strong>`],
            meta: { type, a },
          };
        }
        if (rng.next() < 0.5) {
          const r = rng.pick([15, 20, 25, 30]);
          const hub = r + rng.pick([2, 3, 5]);
          let k = rng.int(-9, 9) / 10;
          while (k === 0) k = rng.int(-9, 9) / 10;
          const target = round(hub - r * k, 2);
          const { solutions } = solveTrig(1, k);
          const { steps, shown } = inverseSteps(1, k);
          const slips = inverseSlips(1, k);
          return {
            prompt: `Eine Gondel eines Riesenrads (Radius ${r} m, Achse ${hub} m hoch) startet ganz unten. Nach einer Drehung um den Winkel α ist sie h = ${hub} m − ${r} m · cos α hoch. Bei welchen Drehwinkeln während der ersten Umdrehung (0° ≤ α &lt; 360°) ist die Gondel ${fmt(target, 1)} m hoch, und bei welchem Drehwinkel ist sie ganz oben?`,
            given: [`h = ${hub} m − ${r} m · cos α`, `gesuchte Höhe ${fmtUnit(target, "m", 1)}`],
            fields: [
              angleField("α₁ =", solutions[0], slips, 2, solutions),
              angleField("α₂ =", solutions[1], slips, 2, solutions),
              angleField("ganz oben bei α =", 180, [{ value: 90, hint: "Bei 90° ist cos α = 0: Die Gondel ist auf Achsenhöhe. Ganz oben ist cos α = −1." }], 0),
            ],
            anyOrder: [0, 1],
            steps: [
              `${fmt(target, 1)} = ${hub} − ${r} · cos α, also cos α = (${hub} − ${fmt(target, 1)}) : ${r} = ${fmt(k)}`,
              ...steps,
              "Ganz oben ist h am größten, also cos α = −1: α = 180°.",
              `<strong>α ≈ ${fmt(Math.min(...shown))}° oder α ≈ ${fmt(Math.max(...shown))}°; ganz oben bei 180°</strong>`,
            ],
            meta: { variant: 0, r, hub, k },
          };
        }
        const d = rng.pick([20, 30, 40, 50, 80]);
        const a1 = rng.int(15, 80);
        const s2 = rng.int(2, 60) * 5;
        const s1 = d * tanD(a1);
        const alpha = atanD(s2 / d);
        const answers = [
          "läuft der Strahl parallel zur Mauer: tan 90° ist nicht definiert",
          "trifft der Strahl genau den Lotfußpunkt",
          `ist der Fleck genau ${d} m entfernt`,
        ];
        const options = rng.shuffle(answers);
        return {
          prompt: `Ein Leuchtfeuer L steht ${d} m vor einer langen, geraden Mauer. Sein Lichtstrahl dreht sich; α ist der Winkel zwischen dem Strahl und dem Lot von L auf die Mauer. Der Lichtfleck ist dann s = ${d} m · tan α vom Lotfußpunkt entfernt. Wie weit ist er bei α = ${a1}° entfernt, bei welchem Winkel ist er ${s2} m entfernt, und was passiert bei α = 90°?`,
          given: [`s = ${d} m · tan α`, `α = ${a1}°`, `s = ${s2} m`],
          fields: [
            numField(`s bei ${a1}° =`, s1, "m", 2, {
              slips: [
                { value: d * Math.tan(a1), hint: RAD_HINT },
                { value: d * sinD(a1), hint: "Abstand und Lichtfleck sind die Katheten: s = d · tan α, nicht d · sin α." },
              ],
            }),
            angleField(`α bei ${s2} m =`, alpha, [
              { value: atanD(d / s2), hint: "Umgekehrt geteilt: tan α = s : d." },
              { value: Math.atan(s2 / d), hint: RAD_HINT },
            ]),
            choiceField("Bei α = 90° …", options, options.indexOf(answers[0])),
          ],
          steps: [
            `s = ${d} m · tan ${a1}° ≈ ${fmt(s1, 2)} m`,
            `tan α = ${s2} : ${d} = ${fmt(s2 / d, 4)}, also α = tan⁻¹(${fmt(s2 / d, 4)}) ≈ ${fmt(alpha, 2)}°`,
            "Bei 90° ist tan α nicht definiert (senkrechte Asymptote): Der Strahl läuft parallel zur Mauer und trifft sie nie.",
            `<strong>s ≈ ${fmtUnit(s1, "m")}, α ≈ ${fmt(alpha, 2)}°; bei 90° gibt es keinen Lichtfleck</strong>`,
          ],
          meta: { variant: 1, d, a1, s2 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst Kosinus- und Tangenskurve mit Periode und Asymptoten und formst mit sin(90° − α) = cos α um.",
};

// 1.6 Additionstheoreme ──────────────────────────────────────────────────────

/** Lesson 1.6, Level 1: exact values from special angles; p1, p2 are the two products of the theorem. */
export const EXACT_ITEMS: Array<{ target: string; fn: 0 | 1; a: number; b: number; op: 1 | -1; p1: string; p2: string; exact: string }> = [
  { target: "sin 75°", fn: 0, a: 45, b: 30, op: 1, p1: "½√2 · ½√3 = ¼√6", p2: "½√2 · ½ = ¼√2", exact: "¼√6 + ¼√2 = ¼(√6 + √2)" },
  { target: "cos 75°", fn: 1, a: 45, b: 30, op: 1, p1: "½√2 · ½√3 = ¼√6", p2: "½√2 · ½ = ¼√2", exact: "¼√6 − ¼√2 = ¼(√6 − √2)" },
  { target: "sin 15°", fn: 0, a: 45, b: 30, op: -1, p1: "½√2 · ½√3 = ¼√6", p2: "½√2 · ½ = ¼√2", exact: "¼√6 − ¼√2 = ¼(√6 − √2)" },
  { target: "cos 15°", fn: 1, a: 45, b: 30, op: -1, p1: "½√2 · ½√3 = ¼√6", p2: "½√2 · ½ = ¼√2", exact: "¼√6 + ¼√2 = ¼(√6 + √2)" },
  { target: "sin 105°", fn: 0, a: 60, b: 45, op: 1, p1: "½√3 · ½√2 = ¼√6", p2: "½ · ½√2 = ¼√2", exact: "¼√6 + ¼√2 = ¼(√6 + √2)" },
  { target: "cos 105°", fn: 1, a: 60, b: 45, op: 1, p1: "½ · ½√2 = ¼√2", p2: "½√3 · ½√2 = ¼√6", exact: "¼√2 − ¼√6 = ¼(√2 − √6)" },
  { target: "sin 135°", fn: 0, a: 90, b: 45, op: 1, p1: "1 · ½√2 = ½√2", p2: "0 · ½√2 = 0", exact: "½√2" },
  { target: "cos 120°", fn: 1, a: 90, b: 30, op: 1, p1: "0 · ½√3 = 0", p2: "1 · ½ = ½", exact: "0 − ½ = −½" },
  { target: "sin 150°", fn: 0, a: 90, b: 60, op: 1, p1: "1 · ½ = ½", p2: "0 · ½√3 = 0", exact: "½" },
];

/** The products of the theorem for fn(a ± b): sin a · cos b and cos a · sin b, or cos a · cos b and sin a · sin b. */
export function theoremProducts(fn: number, a: number, b: number): [number, number] {
  return fn === 0 ? [sinD(a) * cosD(b), cosD(a) * sinD(b)] : [cosD(a) * cosD(b), sinD(a) * sinD(b)];
}

const EXACT_VALUE: Record<number, Record<number, string>> = {
  0: { 30: "½", 45: "½√2", 60: "½√3", 90: "1", 120: "½√3", 135: "½√2", 150: "½" },
  1: { 30: "½√3", 45: "½√2", 60: "½", 90: "0", 120: "−½", 135: "−½√2", 150: "−½√3" },
};

/** Lesson 1.6: terms with special angles (Level 1) and with sums and differences (Level 2). */
export const TERMS_SPECIAL: Array<TermCase & { expand: string }> = [
  { text: "sin(α + 90°)", answer: "cos α", expand: "sin α · cos 90° + cos α · sin 90°", steps: ["= sin α · 0 + cos α · 1"] },
  { text: "cos(α + 90°)", answer: "−sin α", expand: "cos α · cos 90° − sin α · sin 90°", steps: ["= cos α · 0 − sin α · 1"] },
  { text: "sin(α − 90°)", answer: "−cos α", expand: "sin α · cos 90° − cos α · sin 90°", steps: ["= sin α · 0 − cos α · 1"] },
  { text: "cos(α − 90°)", answer: "sin α", expand: "cos α · cos 90° + sin α · sin 90°", steps: ["= cos α · 0 + sin α · 1"] },
  { text: "sin(180° − α)", answer: "sin α", expand: "sin 180° · cos α − cos 180° · sin α", steps: ["= 0 · cos α − (−1) · sin α"] },
  { text: "cos(180° − α)", answer: "−cos α", expand: "cos 180° · cos α + sin 180° · sin α", steps: ["= (−1) · cos α + 0 · sin α"] },
  { text: "sin(α + 180°)", answer: "−sin α", expand: "sin α · cos 180° + cos α · sin 180°", steps: ["= sin α · (−1) + cos α · 0"] },
  { text: "cos(α + 180°)", answer: "−cos α", expand: "cos α · cos 180° − sin α · sin 180°", steps: ["= cos α · (−1) − sin α · 0"] },
  { text: "sin(270° − α)", answer: "−cos α", expand: "sin 270° · cos α − cos 270° · sin α", steps: ["= (−1) · cos α − 0 · sin α"] },
  { text: "cos(360° − α)", answer: "cos α", expand: "cos 360° · cos α + sin 360° · sin α", steps: ["= 1 · cos α + 0 · sin α"] },
];

export const SPECIAL_POOL = ["sin α", "−sin α", "cos α", "−cos α"] as const;

export const TERMS_SUMS: TermCase[] = [
  { text: "sin(α + β) + sin(α − β)", answer: "2 · sin α · cos β", steps: ["= sin α · cos β + cos α · sin β + sin α · cos β − cos α · sin β"] },
  { text: "sin(α + β) − sin(α − β)", answer: "2 · cos α · sin β", steps: ["= sin α · cos β + cos α · sin β − sin α · cos β + cos α · sin β"] },
  { text: "cos(α + β) + cos(α − β)", answer: "2 · cos α · cos β", steps: ["= cos α · cos β − sin α · sin β + cos α · cos β + sin α · sin β"] },
  { text: "cos(α − β) − cos(α + β)", answer: "2 · sin α · sin β", steps: ["= cos α · cos β + sin α · sin β − cos α · cos β + sin α · sin β"] },
  { text: "sin(60° + α) − sin(60° − α)", answer: "sin α", steps: ["= sin 60° · cos α + cos 60° · sin α − sin 60° · cos α + cos 60° · sin α", "= 2 · cos 60° · sin α = 2 · ½ · sin α"] },
  { text: "cos(30° − α) − cos(30° + α)", answer: "sin α", steps: ["= cos 30° · cos α + sin 30° · sin α − cos 30° · cos α + sin 30° · sin α", "= 2 · sin 30° · sin α = 2 · ½ · sin α"] },
  { text: "sin(α + 30°) + cos(α + 60°)", answer: "cos α", steps: ["= sin α · ½√3 + cos α · ½ + cos α · ½ − sin α · ½√3"] },
  { text: "cos(α + 45°) + sin(α + 45°)", answer: "√2 · cos α", steps: ["= cos α · ½√2 − sin α · ½√2 + sin α · ½√2 + cos α · ½√2", "= 2 · ½√2 · cos α"] },
  { text: "sin(α + β) · cos β − cos(α + β) · sin β", answer: "sin α", steps: ["Das ist sin(x − β) mit x = α + β:", "= sin((α + β) − β)"] },
  { text: "cos(α + β) · cos β + sin(α + β) · sin β", answer: "cos α", steps: ["Das ist cos(x − β) mit x = α + β:", "= cos((α + β) − β)"] },
];

export const SUMS_POOL = ["2 · sin α · cos β", "2 · cos α · sin β", "2 · cos α · cos β", "2 · sin α · sin β", "sin α", "cos α", "√2 · cos α", "0", "1"] as const;

const THEOREMS = "sin(α ± β) = sin α · cos β ± cos α · sin β; cos(α ± β) = cos α · cos β ∓ sin α · sin β";

const additionstheoreme: Lesson = {
  id: "tr-6-additionstheoreme",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "1.6 Additionstheoreme",
  subtitle: "Warum sin(α + β) nicht sin α + sin β ist",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN_I}, Additionstheoreme`,
  whyItMatters:
    "Mit den Additionstheoremen berechnest du Werte wie sin 75° exakt und vereinfachst trigonometrische Terme, wie sie in Prüfungsaufgaben zu funktionalen Abhängigkeiten vorkommen.",
  explanationHtml: `
    <p>Für Summen und Differenzen von Winkeln gelten die <strong>Additionstheoreme</strong>:</p>
    <p class="formula-line">sin(α ± β) = sin α · cos β ± cos α · sin β</p>
    <p class="formula-line">cos(α ± β) = cos α · cos β ∓ sin α · sin β</p>
    <p><strong>Warum?</strong> Man dreht am Einheitskreis erst um α und dann um β weiter zum Punkt P; seine Höhe ist sin(α + β). Das rechtwinklige Dreieck OQP mit dem Winkel β bei O hat die Hypotenuse 1, also ist OQ = cos β und QP = sin β. Q liegt auf dem Strahl zum Winkel α in der Höhe cos β · sin α. Von Q bis P geht es noch einmal um sin β · cos α nach oben. Zusammen ergibt das sin(α + β) = sin α · cos β + cos α · sin β. Das Labor zeigt beide Stücke.</p>
    <ul>
      <li><strong>Vorsicht:</strong> sin(α + β) ist <strong>nicht</strong> sin α + sin β. Für α = β = 60° wäre sin 60° + sin 60° ≈ 1,73, ein Sinuswert ist aber höchstens 1. Richtig ist sin 120° ≈ 0,87.</li>
      <li><strong>Terme vereinfachen:</strong> sin(α + 90°) = sin α · 0 + cos α · 1 = cos α und cos(180° − α) = cos 180° · cos α + sin 180° · sin α = −cos α. Mit β = α folgt sin(2α) = 2 · sin α · cos α.</li>
    </ul>
    <div class="example">Beispiel: sin 75° = sin(45° + 30°) = sin 45° · cos 30° + cos 45° · sin 30° = ½√2 · ½√3 + ½√2 · ½ = ¼√6 + ¼√2 = ¼(√6 + √2) ≈ 0,9659.</div>
    <div class="merke"><strong>Merke:</strong> Beim Sinus gemischt (sin · cos ± cos · sin) mit demselben Rechenzeichen wie in der Klammer, beim Kosinus sortiert (cos · cos ∓ sin · sin) mit dem umgekehrten Rechenzeichen.</div>
  `,
  formulas: [
    { name: "Additionstheorem für den Sinus", html: "sin(α ± β) = sin α · cos β ± cos α · sin β", quantities: "dasselbe Rechenzeichen wie in der Klammer" },
    { name: "Additionstheorem für den Kosinus", html: "cos(α ± β) = cos α · cos β ∓ sin α · sin β", quantities: "das umgekehrte Rechenzeichen" },
    { name: "Doppelter Winkel", html: "sin(2α) = 2 · sin α · cos α", quantities: "das Additionstheorem mit β = α" },
  ],
  quiz: {
    question: "Jana rechnet: sin(30° + 60°) = sin 30° + sin 60° ≈ 1,37. Was stimmt?",
    options: [
      "Das ist richtig",
      "Falsch: Ein Sinuswert ist höchstens 1, richtig ist sin 90° = 1",
      "Falsch: Man muss multiplizieren, sin 30° · sin 60° ≈ 0,43",
      "Falsch: Richtig wäre cos 30° + cos 60°",
    ],
    correctIndex: 1,
    explanation: "sin(α + β) ist nicht sin α + sin β. Mit dem Additionstheorem: sin 30° · cos 60° + cos 30° · sin 60° = ¼ + ¾ = 1 = sin 90°.",
  },
  lab: {
    kind: "addition-theorem",
    title: "Labor: Die Höhe von P in zwei Stücken",
    intro: "Ziehe den blauen Punkt (Winkel α) und P (Winkel β, auch negativ). Rechts: blau und orange gestapelt ergibt sin(α + β); die violette Säule ist der Fehler sin α + sin β.",
    params: [
      {
        type: "choice",
        key: "fn",
        label: "Additionstheorem",
        options: [
          { value: 0, label: "Sinus: sin(α + β)" },
          { value: 1, label: "Kosinus: cos(α + β)" },
        ],
        value: 0,
      },
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 0, max: 90, step: 1, value: 40 },
      { type: "range", key: "beta", label: "Winkel β (negativ heißt α − |β|)", unit: "°", min: -90, max: 90, step: 1, value: 20 },
    ],
    readouts: [
      { key: "summe", label: "α + β", unit: "°", digits: 0, compute: (v) => v.alpha + v.beta },
      { key: "sinSumme", label: "sin(α + β)", digits: 4, emphasis: true, compute: (v) => sinD(v.alpha + v.beta) },
      { key: "sinTheorem", label: "sin α · cos β + cos α · sin β", digits: 4, compute: (v) => sinD(v.alpha) * cosD(v.beta) + cosD(v.alpha) * sinD(v.beta) },
      { key: "sinFalsch", label: "sin α + sin β (falsch)", digits: 4, compute: (v) => sinD(v.alpha) + sinD(v.beta) },
      { key: "cosSumme", label: "cos(α + β)", digits: 4, compute: (v) => cosD(v.alpha + v.beta) },
      { key: "cosTheorem", label: "cos α · cos β − sin α · sin β", digits: 4, compute: (v) => cosD(v.alpha) * cosD(v.beta) - sinD(v.alpha) * sinD(v.beta) },
    ],
    goals: [
      {
        id: "fuenfundsiebzig",
        text: "Sinus: Zerlege 75° in 45° + 30° und lies sin 75° ab.",
        check: (v) => v.fn === 0 && ((v.alpha === 45 && v.beta === 30) || (v.alpha === 30 && v.beta === 45)),
      },
      {
        id: "fehler",
        text: "Sinus: Finde α und β, bei denen sin α + sin β größer als 1 ist, sin(α + β) aber kleiner als 0,5.",
        check: (v) => v.fn === 0 && sinD(v.alpha) + sinD(v.beta) > 1 && sinD(v.alpha + v.beta) < 0.5,
      },
      {
        id: "differenz",
        text: "Kosinus: Berechne cos 15° als cos(45° − 30°). Dafür ist β negativ.",
        check: (v) => v.fn === 1 && v.alpha === 45 && v.beta === -30,
      },
    ],
  },
  exercises: [
    {
      id: "exakt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const index = rng.int(0, EXACT_ITEMS.length - 1);
          const item = EXACT_ITEMS[index];
          const name = FN_NAMES[item.fn];
          const opText = item.op > 0 ? "+" : "−";
          const resultOp = item.fn === 0 ? opText : item.op > 0 ? "−" : "+";
          const labels = item.fn === 0 ? [`sin ${item.a}° · cos ${item.b}°`, `cos ${item.a}° · sin ${item.b}°`] : [`cos ${item.a}° · cos ${item.b}°`, `sin ${item.a}° · sin ${item.b}°`];
          const [p1, p2] = theoremProducts(item.fn, item.a, item.b);
          const value = trig(item.fn, item.a + item.op * item.b);
          const naive = trig(item.fn, item.a) + item.op * trig(item.fn, item.b);
          const wrongSign = resultOp === "+" ? p1 - p2 : p1 + p2;
          return {
            prompt: `Berechne ${item.target} exakt mit einem Additionstheorem: ${item.target} = ${name}(${item.a}° ${opText} ${item.b}°). Gib die beiden Produkte und das Ergebnis auf vier Dezimalen an.`,
            given: ["sin 30° = ½, sin 45° = ½√2, sin 60° = ½√3, sin 90° = 1", "cos 30° = ½√3, cos 45° = ½√2, cos 60° = ½, cos 90° = 0"],
            formulaHint: item.fn === 0 ? "sin(α ± β) = sin α · cos β ± cos α · sin β" : "cos(α ± β) = cos α · cos β ∓ sin α · sin β",
            fields: [
              numField(`${labels[0]} =`, p1, "", 4),
              numField(`${labels[1]} =`, p2, "", 4),
              numField(`${item.target} =`, value, "", 4, {
                slips: [
                  { value: naive, hint: `${name}(α ${opText} β) ist nicht ${name} α ${opText} ${name} β. Nutze das Additionstheorem.` },
                  { value: wrongSign, hint: "Rechenzeichen: Beim Sinus steht dasselbe wie in der Klammer, beim Kosinus das umgekehrte." },
                ],
              }),
            ],
            steps: [
              `${item.target} = ${name}(${item.a}° ${opText} ${item.b}°) = ${labels[0]} ${resultOp} ${labels[1]}`,
              `${labels[0]} = ${item.p1}; ${labels[1]} = ${item.p2}`,
              `<strong>${item.target} = ${item.exact} ${approx(value)}</strong>`,
            ],
            meta: { item: index },
          };
        }
        if (rng.next() < 0.5) {
          const T = rng.pick([30, 45, 60, 90, 120, 135, 150]);
          const fn = rng.int(0, 1);
          const op = rng.sign();
          let y = rng.int(5, 40);
          let x = op > 0 ? T - y : T + y;
          while (x <= 0 || x === y || x >= 180) {
            y = rng.int(5, 40);
            x = op > 0 ? T - y : T + y;
          }
          const name = FN_NAMES[fn];
          const middle = fn === 0 ? (op > 0 ? "+" : "−") : op > 0 ? "−" : "+";
          const expr = fn === 0 ? `sin ${x}° · cos ${y}° ${middle} cos ${x}° · sin ${y}°` : `cos ${x}° · cos ${y}° ${middle} sin ${x}° · sin ${y}°`;
          const value = trig(fn, T);
          return {
            prompt: `Berechne ohne Taschenrechner: ${expr}. Erkenne dazu ein Additionstheorem und gib den Wert auf vier Dezimalen an.`,
            given: [`T = ${expr}`],
            fields: [
              numField("T =", value, "", 4, {
                slips: [{ value: trig(fn, x - op * y), hint: "Rechenzeichen: sin(α + β) hat ein +, cos(α + β) ein − zwischen den Produkten." }],
              }),
            ],
            steps: [
              `Das ist das Additionstheorem für ${name}(${x}° ${op > 0 ? "+" : "−"} ${y}°) = ${name} ${T}°.`,
              `<strong>T = ${name} ${T}° = ${EXACT_VALUE[fn][T]} ${approx(value)}</strong>`,
            ],
            meta: { variant: 0, fn, x, y, op },
          };
        }
        const t1 = rng.int(0, TRIPLES.length - 1);
        let t2 = rng.int(0, TRIPLES.length - 1);
        while (t2 === t1) t2 = rng.int(0, TRIPLES.length - 1);
        const [p1, q1] = rng.next() < 0.5 ? [TRIPLES[t1][0], TRIPLES[t1][1]] : [TRIPLES[t1][1], TRIPLES[t1][0]];
        const [p2, q2] = rng.next() < 0.5 ? [TRIPLES[t2][0], TRIPLES[t2][1]] : [TRIPLES[t2][1], TRIPLES[t2][0]];
        const h1 = TRIPLES[t1][2];
        const h2 = TRIPLES[t2][2];
        // sin α = p1/h1, cos α = q1/h1; sin β = p2/h2, cos β = q2/h2 (both acute).
        const kinds = rng.shuffle([0, 1, 2, 3]).slice(0, 2);
        const den = h1 * h2;
        const expr = (kind: number) => ["sin(α + β)", "sin(α − β)", "cos(α + β)", "cos(α − β)"][kind];
        const numerator = (kind: number) => [p1 * q2 + q1 * p2, p1 * q2 - q1 * p2, q1 * q2 - p1 * p2, q1 * q2 + p1 * p2][kind];
        const expansion = (kind: number) => {
          const s = (n: number, d: number) => fracHtml(n, d);
          const sin1 = `${s(p1, h1)} · ${s(q2, h2)}`;
          const sin2 = `${s(q1, h1)} · ${s(p2, h2)}`;
          const cos1 = `${s(q1, h1)} · ${s(q2, h2)}`;
          const cos2 = `${s(p1, h1)} · ${s(p2, h2)}`;
          return [`${sin1} + ${sin2}`, `${sin1} − ${sin2}`, `${cos1} − ${cos2}`, `${cos1} + ${cos2}`][kind];
        };
        const naive = (kind: number) => (kind < 2 ? p1 / h1 + (kind === 0 ? 1 : -1) * (p2 / h2) : q1 / h1 + (kind === 2 ? 1 : -1) * (q2 / h2));
        return {
          prompt: `Für die spitzen Winkel α und β gilt sin α = ${fracHtml(p1, h1)} und cos β = ${fracHtml(q2, h2)}. Berechne ${expr(kinds[0])} und ${expr(kinds[1])}, ohne α und β zu bestimmen (als Bruch oder auf vier Dezimalen).`,
          given: [`sin α = ${fracHtml(p1, h1)}, α spitz`, `cos β = ${fracHtml(q2, h2)}, β spitz`],
          fields: kinds.map((kind) =>
            numField(`${expr(kind)} =`, numerator(kind) / den, "", 4, {
              slips: [{ value: naive(kind), hint: "Ein Additionstheorem ist keine Summe der Einzelwerte: Setze in die Formel mit Produkten ein." }],
            }),
          ),
          steps: [
            `cos α = ${sqrtHtml(`1 − ${fracHtml(p1 * p1, h1 * h1)}`)} = ${fracHtml(q1, h1)} und sin β = ${sqrtHtml(`1 − ${fracHtml(q2 * q2, h2 * h2)}`)} = ${fracHtml(p2, h2)}, positiv, weil α und β spitz sind.`,
            ...kinds.map((kind) => `${expr(kind)} = ${expansion(kind)} = ${fracHtml(numerator(kind), den)} ≈ ${fmt(numerator(kind) / den, 4)}`),
            `<strong>${kinds.map((kind) => `${expr(kind)} = ${fracHtml(numerator(kind), den)} ≈ ${fmt(numerator(kind) / den, 4)}`).join("; ")}</strong>`,
          ],
          meta: { variant: 1, p1, q1, h1, p2, q2, h2, k1: kinds[0], k2: kinds[1] },
        };
      },
    },
    {
      id: "vereinfachen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const index = rng.int(0, TERMS_SPECIAL.length - 1);
          const item = TERMS_SPECIAL[index];
          const { options, correctIndex } = pickOptions(rng, item.answer, SPECIAL_POOL);
          return {
            prompt: `Vereinfache mit einem Additionstheorem: ${item.text}`,
            given: [`Term: ${item.text}`, "sin 90° = 1, cos 90° = 0, sin 180° = 0, cos 180° = −1", "sin 270° = −1, cos 270° = 0, sin 360° = 0, cos 360° = 1"],
            formulaHint: THEOREMS,
            fields: [choiceField("vereinfacht:", options, correctIndex)],
            steps: [`${item.text} = ${item.expand}`, ...item.steps, `<strong>${item.text} = ${item.answer}</strong>`],
            meta: { term: index },
          };
        }
        return termTask(rng, 2, TERMS_SUMS, SUMS_POOL, "", [], "Vereinfache mit den Additionstheoremen so weit wie möglich:");
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wendest die Additionstheoreme an, berechnest exakte Werte und fällst nicht auf sin(α + β) = sin α + sin β herein.",
};

export const STAGE_EINHEITSKREIS: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Trigonometrie am Einheitskreis",
  subtitle: "Sinus, Kosinus und Tangens für alle Winkel, Steigungswinkel, Graphen, Additionstheoreme",
  icon: "🎡",
  accent: "#2563eb",
  badgeTitle: "Einheitskreis-Profi",
  lehrplanLabel: "LB 1 Trigonometrie (I und II/III)",
  lessons: [einheitskreis, winkelBis360, steigungswinkel, sinusfunktion, kosinusTangens, additionstheoreme],
};
