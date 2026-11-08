import { fmt, linear, paren, shifted } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  ASYMPTOTE_FUNCTIONS,
  buildTerm,
  buildValue,
  CUT_FUNCTIONS,
  cutEquation,
  cutPoints,
  denominatorRoots,
  expand,
  factorProduct,
  gapAt,
  isAsymptote,
  numeratorRoots,
  oneSided,
  poleTerm,
  poleValue,
  probeX,
  setText,
  sharesFactor,
  zpTerm,
} from "../lab/views-gebrochen-rational";
import { polyText, quadraticRoots, rel } from "../lab/shared";
import type { AnswerField, ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-2-gebrochen-rational";
const LEHRPLAN = "M11 LB 2: Gebrochen-rationale Funktionen – Grenzwerte und Asymptoten";

function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** Two different integers in [min, max], none of them in `avoid`. */
function twoInts(rng: Rng, min: number, max: number, avoid: number[] = []): [number, number] {
  const pool = rng.shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((n) => !avoid.includes(n)));
  return [pool[0], pool[1]];
}

const INF = ["+∞", "−∞"];

// 2.1 Definitionsmenge und Nullstellen ───────────────────────────────────────

function lueckenNullstellen(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p1, p2] = twoInts(rng, -5, 5);
    const z = twoInts(rng, -5, 5, [p1, p2])[0];
    const a = rng.pick([1, 2, -1, 3, -2]);
    const num = linear(a, -a * z);
    const den = polyText(expand([p1, p2]));
    return {
      prompt: `Bestimme die maximale Definitionsmenge und die Nullstelle von <strong>f(x) = (${num}) / (${den})</strong>.`,
      given: [`f(x) = (${num}) / (${den})`],
      formulaHint: "Definitionslücken: Nenner = 0 (Lösungsformel oder Faktorisieren). Nullstellen: Zähler = 0 an Stellen, die zu D<sub>f</sub> gehören.",
      fields: [numberField("Lücke x₁ =", p1, "", 2), numberField("Lücke x₂ =", p2, "", 2), numberField("Nullstelle x₀ =", z, "", 2)],
      anyOrder: [0, 1],
      steps: [
        `Nenner: ${den} = ${factorProduct([p1, p2])} = 0 ⇔ x = ${fmt(p1)} oder x = ${fmt(p2)}`,
        `D<sub>f</sub> = ℝ \\ ${setText([p1, p2])}`,
        `Zähler: ${num} = 0 ⇔ x = ${fmt(z)}, und ${fmt(z)} ∈ D<sub>f</sub>.`,
        `<strong>D<sub>f</sub> = ℝ \\ ${setText([p1, p2])}; Nullstelle x₀ = ${fmt(z)}</strong>`,
      ],
    };
  }
  const k = rng.int(1, 4);
  const p = twoInts(rng, -6, 6, [0, k, -k])[0];
  return {
    prompt: `Für ein Modell wird die Funktion <strong>f(x) = (x² − ${k * k}) / (x² ${p > 0 ? "−" : "+"} ${Math.abs(p)}x)</strong> verwendet. Gib ihre Definitionslücken an und die positive Nullstelle.`,
    given: [`f(x) = (x² − ${k * k}) / (x² ${p > 0 ? "−" : "+"} ${Math.abs(p)}x)`],
    fields: [
      numberField("Lücke x₁ =", 0, "", 2),
      numberField("Lücke x₂ =", p, "", 2),
      numberField("positive Nullstelle:", k, "", 2, { slips: [{ value: k * k, hint: "x² = " + k * k + " hat die Lösungen ±" + k + ": Ziehe die Wurzel." }] }),
    ],
    anyOrder: [0, 1],
    steps: [
      `Nenner ausklammern: x(x ${p > 0 ? "−" : "+"} ${Math.abs(p)}) = 0 ⇔ x = 0 oder x = ${fmt(p)}`,
      `Zähler: x² − ${k * k} = (x − ${k})(x + ${k}) = 0 ⇔ x = ±${k}; beide liegen in D<sub>f</sub>, der Term ist vollständig gekürzt.`,
      `<strong>D<sub>f</sub> = ℝ \\ ${setText([0, p])}; positive Nullstelle ${k}</strong>`,
    ],
  };
}

function linearfaktoren(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [r1, r2] = twoInts(rng, -5, 5, [1]);
    const c = rng.pick([2, 3, 4, 6, -6]);
    const den = polyText(expand([r1, r2]));
    const value = c / ((1 - r1) * (1 - r2));
    return {
      prompt: `Schreibe den Nenner von <strong>f(x) = ${fmt(c)} / (${den})</strong> als Produkt von Linearfaktoren (x − r₁)(x − r₂) und berechne f(1).`,
      given: [`f(x) = ${fmt(c)} / (${den})`],
      formulaHint: "Nullstellen des Nenners mit der Lösungsformel; dann x² + bx + c = (x − r₁)(x − r₂).",
      fields: [numberField("r₁ =", r1, "", 2), numberField("r₂ =", r2, "", 2), numberField("f(1) =", value, "", 3)],
      anyOrder: [0, 1],
      steps: [`${den} = 0 ⇔ x = ${fmt(r1)} oder x = ${fmt(r2)}`, `${den} = ${factorProduct([r1, r2])}`, `f(1) = ${fmt(c)} / (${fmt(1 - r1)} · ${paren(1 - r2)}) ${rel(value, 3)} ${fmt(value, 3)}`, `<strong>${factorProduct([r1, r2])}; f(1) ${rel(value, 3)} ${fmt(value, 3)}</strong>`],
    };
  }
  const r = rng.int(1, 5);
  const z = twoInts(rng, -6, 6, [0, r, -r])[0];
  const f0 = z / (r * r);
  return {
    prompt: `Die Funktion f(x) = (x − a) / (x² − b) hat die Nullstelle ${fmt(z)} und die Definitionslücken −${r} und ${r}. Bestimme a und b und berechne f(0).`,
    given: [`Nullstelle ${fmt(z)}`, `D<sub>f</sub> = ℝ \\ {−${r}; ${r}}`],
    fields: [
      numberField("a =", z, "", 2),
      numberField("b =", r * r, "", 2, { slips: [{ value: r, hint: `x² − b = 0 soll x = ±${r} liefern, also b = ${r}².` }] }),
      numberField("f(0) =", f0, "", 3),
    ],
    steps: [`Nullstelle ${fmt(z)}: Zähler x − a = 0 bei x = ${fmt(z)} ⇒ a = ${fmt(z)}`, `x² − b = (x − ${r})(x + ${r}) = x² − ${r * r} ⇒ b = ${r * r}`, `f(0) = ${paren(-z)} / (−${r * r}) ${rel(f0, 3)} ${fmt(f0, 3)}`, `<strong>a = ${fmt(z)}, b = ${r * r}, f(0) ${rel(f0, 3)} ${fmt(f0, 3)}</strong>`],
  };
}

const definitionsmenge: Lesson = {
  id: "gr-1-definitionsmenge",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Definitionsmenge und Nullstellen",
  subtitle: "Zähler, Nenner und Linearfaktoren",
  lehrplan: `${LEHRPLAN}, maximale Definitionsmenge, Nullstellen und Linearfaktoren`,
  whyItMatters:
    "Sobald ein Term durch x teilt, gibt es Stellen, an denen er nicht definiert ist. Stückkosten, Konzentrationen und Mischungsverhältnisse führen auf solche Brüche. Wer Zähler und Nenner in Linearfaktoren zerlegt, sieht auf einen Blick, wo der Graph die x-Achse trifft und wo er nicht existiert.",
  explanationHtml: `
    <p>Eine <strong>gebrochen-rationale Funktion</strong> hat einen Term der Form f(x) = Z(x) / N(x) mit Polynomen Z (Zähler) und N (Nenner). Hier betrachtest du <strong>einfache</strong> gebrochen-rationale Funktionen: Zähler und Nenner haben höchstens den Grad 2, und der Term ist <strong>vollständig gekürzt</strong> (Zähler und Nenner haben keinen gemeinsamen Linearfaktor).</p>
    <ul>
      <li><strong>Maximale Definitionsmenge:</strong> Alle x mit N(x) = 0 musst du ausschließen. Diese Stellen heißen <strong>Definitionslücken</strong>: D<sub>f</sub> = ℝ \\ {Nullstellen des Nenners}.</li>
      <li><strong>Nullstellen:</strong> f(x) = 0 genau dann, wenn Z(x) = 0 und x ∈ D<sub>f</sub>.</li>
      <li><strong>Linearfaktoren:</strong> Hat ein Polynom zweiten Grades die Nullstellen r₁ und r₂, so gilt ax² + bx + c = a(x − r₁)(x − r₂). In dieser Darstellung liest du Nullstellen und Definitionslücken direkt ab. Für Grenzwerte ist oft die ausmultiplizierte Form praktischer: Wähle die Darstellung, die zur Frage passt.</li>
    </ul>
    <div class="example">f(x) = (2x − 2) / (x² − x − 2). Nenner: x² − x − 2 = 0 ⇔ x = −1 oder x = 2, also x² − x − 2 = (x + 1)(x − 2) und D<sub>f</sub> = ℝ \\ {−1; 2}. Zähler: 2x − 2 = 2(x − 1) = 0 ⇔ x = 1, und 1 ∈ D<sub>f</sub>. Faktorisiert: f(x) = 2(x − 1) / ((x + 1)(x − 2)).</div>
    <div class="merke"><strong>Merke:</strong> Nenner = 0 liefert die Definitionslücken, Zähler = 0 (in D<sub>f</sub>) die Nullstellen. Mit Linearfaktoren a(x − r₁)(x − r₂) siehst du beide sofort.</div>
  `,
  formulas: [
    { name: "Gebrochen-rationale Funktion", html: "f(x) = Z(x) / N(x), D<sub>f</sub> = ℝ \\ {x | N(x) = 0}", quantities: "Z Zählerpolynom, N Nennerpolynom (hier höchstens Grad 2)" },
    { name: "Linearfaktoren", html: "ax² + bx + c = a(x − r₁)(x − r₂)", quantities: "r₁, r₂ Nullstellen des Polynoms" },
  ],
  quiz: {
    question: "Welche Definitionsmenge hat f(x) = (x + 3) / (x² − 9x)?",
    options: ["ℝ \\ {0; 9}", "ℝ \\ {−3}", "ℝ \\ {−3; 3}"],
    correctIndex: 0,
    explanation: "Ausgeschlossen werden die Nullstellen des Nenners: x² − 9x = x(x − 9) = 0 ⇔ x = 0 oder x = 9. Die Nullstelle des Zählers, −3, ist eine Nullstelle von f.",
  },
  lab: {
    kind: "rational-zeros-poles",
    title: "Labor: Nullstellen und Definitionslücken",
    intro:
      "Wähle die Grade von Zähler und Nenner und ziehe die blauen Nullstellen des Zählers auf der x-Achse und die orangen Nullstellen des Nenners am oberen Rand. Gestrichelt: die Definitionslücken.",
    params: [
      { type: "choice", key: "nz", label: "Zähler", value: 1, options: [{ value: 0, label: "1 (Grad 0)" }, { value: 1, label: "x − z₁ (Grad 1)" }, { value: 2, label: "(x − z₁)(x − z₂) (Grad 2)" }] },
      { type: "range", key: "z1", label: "z₁", unit: "", min: -4, max: 4, step: 1, value: 2, digits: 0, showIf: (v) => v.nz >= 1 },
      { type: "range", key: "z2", label: "z₂", unit: "", min: -4, max: 4, step: 1, value: 0, digits: 0, showIf: (v) => v.nz === 2 },
      { type: "choice", key: "nd", label: "Nenner", value: 1, options: [{ value: 1, label: "x − p₁ (Grad 1)" }, { value: 2, label: "(x − p₁)(x − p₂) (Grad 2)" }] },
      { type: "range", key: "p1", label: "p₁", unit: "", min: -4, max: 4, step: 1, value: -2, digits: 0 },
      { type: "range", key: "p2", label: "p₂", unit: "", min: -4, max: 4, step: 1, value: 0, digits: 0, showIf: (v) => v.nd === 2 },
    ],
    readouts: [
      { key: "term", label: "Funktionsterm", emphasis: true, compute: (v) => `f(x) = ${zpTerm(v)}` },
      { key: "expanded", label: "ausmultipliziert", compute: (v) => `(${polyText(expand(numeratorRoots(v)))}) / (${polyText(expand(denominatorRoots(v)))})` },
      { key: "D", label: "Definitionsmenge", compute: (v) => `D_f = ℝ \\ ${setText(denominatorRoots(v))}` },
      {
        key: "zeros",
        label: "Nullstellen",
        compute: (v) => {
          if (sharesFactor(v)) return "Term nicht gekürzt: Zähler und Nenner haben einen gemeinsamen Faktor";
          const z = [...new Set(numeratorRoots(v))];
          return z.length === 0 ? "keine" : z.map((x) => fmt(x)).join(" und ");
        },
      },
    ],
    goals: [
      {
        id: "zwei-luecken",
        text: "Stelle eine Funktion mit D_f = ℝ \\ {−1; 2} und der einzigen Nullstelle x = 1 ein.",
        check: (v) => v.nz === 1 && v.z1 === 1 && v.nd === 2 && setText(denominatorRoots(v)) === "{−1; 2}",
      },
      {
        id: "zwei-nullstellen",
        text: "Stelle eine Funktion mit den Nullstellen −3 und 3 und der einzigen Definitionslücke 0 ein.",
        check: (v) => v.nz === 2 && setText(numeratorRoots(v)) === "{−3; 3}" && v.nd === 1 && v.p1 === 0,
      },
      {
        id: "doppelt",
        text: "Stelle mit einem Nenner zweiten Grades eine Funktion ohne Nullstelle und mit D_f = ℝ \\ {1} ein.",
        check: (v) => v.nz === 0 && v.nd === 2 && v.p1 === 1 && v.p2 === 1,
      },
    ],
  },
  exercises: [
    { id: "luecken-nullstellen", make: lueckenNullstellen },
    { id: "linearfaktoren", make: linearfaktoren },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst Definitionslücken und Nullstellen und nutzt dafür Linearfaktoren.",
};

// 2.2 Verhalten im Unendlichen und Asymptoten ────────────────────────────────

function gradvergleich(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const kind = rng.int(0, 2);
    const a = nonZero(rng, 6);
    const d = rng.pick([1, 2, 4, 5]);
    const b = nonZero(rng, 5);
    const c = rng.int(1, 9);
    let fTerm: string;
    let limit: number;
    let why: string;
    if (kind === 0) {
      fTerm = `(${polyText([a, b, c])}) / (${polyText([d, 0, rng.int(1, 6)])})`;
      limit = a / d;
      why = `Gleicher Grad 2: Teile Zähler und Nenner durch x². Es bleibt ${fmt(a)} / ${fmt(d)}.`;
    } else if (kind === 1) {
      fTerm = `(${linear(a, b)}) / (${linear(d, c)})`;
      limit = a / d;
      why = `Gleicher Grad 1: Teile durch x. Es bleibt ${fmt(a)} / ${fmt(d)}.`;
    } else {
      fTerm = `(${linear(a, b)}) / (${polyText([d, 0, c])})`;
      limit = 0;
      why = "Der Zählergrad ist kleiner als der Nennergrad: Der Nenner wächst schneller, f(x) → 0.";
    }
    return {
      prompt: `Untersuche das Verhalten von <strong>f(x) = ${fTerm}</strong> für x → ±∞ und gib die Gleichung der waagrechten Asymptote an.`,
      given: [`f(x) = ${fTerm}`],
      formulaHint: "Zählergrad &lt; Nennergrad: y = 0. Gleicher Grad: y = (Koeffizient der höchsten Potenz im Zähler) : (Koeffizient im Nenner).",
      fields: [numberField("Asymptote y =", limit, "", 2, kind === 2 ? {} : { slips: [{ value: d / a, hint: "Zähler durch Nenner, nicht umgekehrt." }] })],
      steps: [why, `<strong>waagrechte Asymptote y = ${fmt(limit)}</strong>`],
    };
  }
  const k = rng.pick([4, 6, 8, 12]);
  const m = rng.pick([1, 2, 3, 5]);
  return {
    prompt: `Die Konzentration eines Wirkstoffs im Blut wird durch c(t) = ${k}t / (t + ${m}) beschrieben (t in Stunden, c in mg/l). Gegen welchen Wert strebt die Konzentration auf lange Sicht? Nach welcher Zeit sind 80 % dieses Werts erreicht?`,
    given: [`c(t) = ${k}t / (t + ${m})`, "t ≥ 0"],
    fields: [
      numberField("Grenzwert:", k, "mg/l", 2),
      numberField("t =", 4 * m, "h", 2, { slips: [{ value: 0.8 * m, hint: "Setze c(t) = 0,8 · " + k + " und löse nach t auf: 0,2t = 0,8 · " + m + "." }] }),
    ],
    steps: [
      `Termumformung: c(t) = ${k} / (1 + ${m}/t) → ${k} für t → +∞.`,
      `${k}t / (t + ${m}) = ${fmt(0.8 * k)} ⇔ ${k}t = ${fmt(0.8 * k)}t + ${fmt(0.8 * k * m)} ⇔ ${fmt(0.2 * k)}t = ${fmt(0.8 * k * m)}`,
      `<strong>Grenzwert ${k} mg/l; 80 % nach t = ${4 * m} h</strong>`,
    ],
  };
}

function schraeg(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const m = rng.pick([0.5, 1, 2, -1, -0.5, 1.5]);
    const t = nonZero(rng, 4);
    const k = nonZero(rng, 5);
    const p = nonZero(rng, 4);
    const fTerm = `${linear(m, t)}${k > 0 ? " + " : " − "}${Math.abs(k)} / ${shifted(p)}`;
    return {
      prompt: `Gib die Gleichung der schrägen Asymptote und die Polstelle von <strong>f(x) = ${fTerm}</strong> an.`,
      given: [`f(x) = ${fTerm}`],
      formulaHint: "f(x) = mx + t + k / (x − p): Der Bruch geht für x → ±∞ gegen 0, also ist y = mx + t die Asymptote.",
      fields: [numberField("m =", m, "", 2), numberField("t =", t, "", 2), numberField("Polstelle x =", p, "", 2, { slips: [{ value: -p, hint: `Der Nenner ${shifted(p)} wird 0 bei x = ${fmt(p)}.` }] })],
      steps: [`${Math.abs(k)} / ${shifted(p)} → 0 für x → ±∞`, `<strong>schräge Asymptote y = ${linear(m, t)}; Polstelle x = ${fmt(p)}</strong>`],
    };
  }
  const a = rng.pick([0.01, 0.02, 0.05]);
  const b = rng.pick([2, 3, 5]);
  const c = rng.pick([200, 450, 800]);
  const at = 100;
  const value = a * at + b + c / at;
  return {
    prompt: `Bei der Herstellung von x Stück eines Bauteils betragen die Stückkosten k(x) = (${fmt(a)}x² + ${b}x + ${c}) / x in €. Teile den Bruch termweise und gib die schräge Asymptote y = mx + t des Graphen an. Wie hoch sind die Stückkosten bei 100 Stück?`,
    given: [`k(x) = (${fmt(a)}x² + ${b}x + ${c}) / x`],
    fields: [numberField("m =", a, "", 2), numberField("t =", b, "", 2), numberField("k(100) =", value, "€", 2)],
    steps: [`k(x) = ${fmt(a)}x + ${b} + ${c}/x`, `${c}/x → 0 für x → +∞, also y = ${fmt(a)}x + ${b}.`, `k(100) = ${fmt(a * at)} + ${b} + ${fmt(c / at)} = ${fmt(value)}`, `<strong>y = ${fmt(a)}x + ${b}; k(100) = ${fmt(value)} €</strong>`],
  };
}

const asymptoten: Lesson = {
  id: "gr-2-asymptoten",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Verhalten im Unendlichen",
  subtitle: "Waagrechte und schräge Asymptoten",
  lehrplan: `${LEHRPLAN}, Grenzverhalten für x → ±∞, waagrechte und schräge Asymptoten`,
  whyItMatters:
    "Für große x verhält sich eine gebrochen-rationale Funktion oft fast wie eine Gerade. Diese Asymptote beschreibt das Langzeitverhalten, etwa den Endwert einer Konzentration oder wie Stückkosten bei großen Mengen weiter wachsen.",
  explanationHtml: `
    <p>Für x → ±∞ entscheidet der Vergleich von <strong>Zählergrad</strong> und <strong>Nennergrad</strong>:</p>
    <ul>
      <li><strong>Zählergrad &lt; Nennergrad:</strong> lim<sub>x→±∞</sub> f(x) = 0, die x-Achse (y = 0) ist waagrechte Asymptote.</li>
      <li><strong>Zählergrad = Nennergrad:</strong> Der Grenzwert ist der Quotient der Koeffizienten der höchsten Potenzen. Das zeigt die Termumformung: Zähler und Nenner durch die höchste Potenz von x teilen.</li>
      <li><strong>Zählergrad = Nennergrad + 1:</strong> f ist divergent; oft ist eine <strong>schräge Asymptote</strong> y = mx + t direkt im Term zu sehen, wenn er in der Form f(x) = mx + t + k/(x − p) vorliegt oder sich termweise teilen lässt.</li>
    </ul>
    <p class="formula-line">f(x) = (6x² − x) / (2x² + 5) = (6 − 1/x) / (2 + 5/x²) → 6 / 2 = 3 für x → ±∞</p>
    <div class="example">f(x) = (2x + 1)/(x − 1): Gleicher Grad 1, also y = 2/1 = 2 waagrechte Asymptote. g(x) = 0,5x − 1 + 2/(x + 1): Der Bruch geht gegen 0, also ist y = 0,5x − 1 schräge Asymptote. Für x → +∞ liegt der Graph oberhalb, für x → −∞ unterhalb der Asymptote, weil 2/(x + 1) dort positiv bzw. negativ ist.</div>
    <div class="merke"><strong>Merke:</strong> Grad Z &lt; Grad N ⇒ y = 0. Grad Z = Grad N ⇒ y = Quotient der höchsten Koeffizienten. Steht der Term als mx + t + Bruch da, der gegen 0 geht, ist y = mx + t die schräge Asymptote.</div>
  `,
  formulas: [
    { name: "Waagrechte Asymptote, gleicher Grad", html: "f(x) = (aₙxⁿ + …) / (bₙxⁿ + …) ⇒ y = aₙ / bₙ", quantities: "aₙ, bₙ Koeffizienten der höchsten Potenz" },
    { name: "Schräge Asymptote", html: "f(x) = mx + t + k / (x − p) ⇒ y = mx + t", quantities: "der Bruch geht für x → ±∞ gegen 0" },
  ],
  quiz: {
    question: "Welche waagrechte Asymptote hat f(x) = (3x² + 1) / (6x² − x)?",
    options: ["y = 0,5", "y = 2", "y = 0"],
    correctIndex: 0,
    explanation: "Gleicher Grad: Teilt man durch x², bleibt (3 + 1/x²) / (6 − 1/x) → 3/6 = 0,5. y = 0 gälte nur, wenn der Zählergrad kleiner wäre.",
  },
  lab: {
    kind: "asymptote-infinity",
    title: "Labor: Die Asymptote finden",
    intro:
      "Lege die violette Gerade y = mx + t mit den zwei Punkten so, dass sich der Graph ihr für x → ±∞ beliebig nähert. Unten siehst du, wie weit der Graph bei großen x noch von deiner Geraden entfernt ist.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: ASYMPTOTE_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "m", label: "Steigung m der Geraden", unit: "", min: -2, max: 2, step: 0.25, value: 0, digits: 2 },
      { type: "range", key: "t", label: "y-Achsenabschnitt t der Geraden", unit: "", min: -4, max: 4, step: 0.25, value: 0, digits: 2 },
    ],
    readouts: [
      { key: "line", label: "deine Gerade", emphasis: true, compute: (v) => `y = ${linear(v.m, v.t)}` },
      { key: "gap100", label: "Abstand f(x) − Gerade bei x = 100", compute: (v) => gapAt(v, 100), digits: 3 },
      { key: "gap1000", label: "Abstand bei x = 1000", compute: (v) => gapAt(v, 1000), digits: 4 },
      { key: "verdict", label: "Asymptote?", compute: (v) => (isAsymptote(v) ? "ja: der Abstand geht gegen 0" : "nein: der Abstand geht nicht gegen 0") },
    ],
    goals: [
      { id: "gleicher-grad", text: "f(x) = (2x + 1)/(x − 1): Lege die Gerade auf die waagrechte Asymptote.", check: (v) => v.fn === 0 && isAsymptote(v) },
      { id: "quotient", text: "f(x) = (−3x² + x)/(2x² + 5): Lege die Gerade auf die waagrechte Asymptote.", check: (v) => v.fn === 2 && isAsymptote(v) },
      { id: "schraeg", text: "f(x) = 0,5x − 1 + 2/(x + 1): Lege die Gerade auf die schräge Asymptote.", check: (v) => v.fn === 3 && isAsymptote(v) },
    ],
  },
  exercises: [
    { id: "gradvergleich", make: gradvergleich },
    { id: "schraeg", make: schraeg },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest waagrechte und schräge Asymptoten aus dem Term ab.",
};

// 2.3 Polstellen und senkrechte Asymptoten ───────────────────────────────────

function einseitig(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const p = nonZero(rng, 4);
    let b = nonZero(rng, 5);
    if (p + b === 0) b += 1;
    const n0 = p + b;
    const left = n0 > 0 ? 1 : 0;
    const right = n0 > 0 ? 0 : 1;
    const fTerm = `${linear(1, b)} / ${shifted(p)}`;
    return {
      prompt: `Bestimme die Polstelle von <strong>f(x) = ${fTerm}</strong> und das Verhalten von f(x) bei Annäherung an die Polstelle von links und von rechts.`,
      given: [`f(x) = ${fTerm}`],
      formulaHint: "Nahe der Polstelle: Vorzeichen des Zählers bestimmen, Nenner ist links von p negativ, rechts positiv.",
      fields: [numberField("Polstelle x =", p, "", 2), choiceField(`x → ${fmt(p)} von links:`, INF, left), choiceField(`x → ${fmt(p)} von rechts:`, INF, right)],
      steps: [
        `Zähler bei x = ${fmt(p)}: ${fmt(n0)} (${n0 > 0 ? "positiv" : "negativ"}); Nenner → 0.`,
        `Links ist ${shifted(p)} &lt; 0, rechts &gt; 0.`,
        `<strong>x = ${fmt(p)}; von links ${INF[left]}, von rechts ${INF[right]}</strong>`,
      ],
    };
  }
  const p = nonZero(rng, 3);
  let b = nonZero(rng, 4);
  if (p + b === 0) b += 1;
  const n0 = p + b;
  const square = rng.next() < 0.5;
  let q = twoInts(rng, -4, 4, [p, -b])[0];
  if (q === p) q = p + 2;
  const den = square ? `${shifted(p)}²` : factorProduct([p, q]);
  const rightSign = square ? Math.sign(n0) : Math.sign(n0) * Math.sign(p - q);
  return {
    prompt: `Untersuche f(x) = ${linear(1, b)} / (${den}) an der Stelle ${fmt(p)}: Hat der Graph dort einen Pol mit oder ohne Vorzeichenwechsel? Gib die senkrechte Asymptote an und das Verhalten für x → ${fmt(p)} von rechts.`,
    given: [`f(x) = ${linear(1, b)} / (${den})`],
    fields: [numberField("senkrechte Asymptote x =", p, "", 2), choiceField("Pol", ["mit Vorzeichenwechsel", "ohne Vorzeichenwechsel"], square ? 1 : 0), choiceField(`x → ${fmt(p)} von rechts:`, INF, rightSign > 0 ? 0 : 1)],
    steps: [
      square ? `${shifted(p)}² ist auf beiden Seiten positiv: kein Vorzeichenwechsel.` : `${shifted(p)} wechselt bei ${fmt(p)} das Vorzeichen, ${shifted(q)} hat dort den Wert ${fmt(p - q)}: Vorzeichenwechsel.`,
      `Rechts von ${fmt(p)}: Zähler ${n0 > 0 ? "positiv" : "negativ"}, Nenner ${square || p - q > 0 ? "positiv" : "negativ"}.`,
      `<strong>x = ${fmt(p)}; ${square ? "ohne" : "mit"} Vorzeichenwechsel; von rechts ${INF[rightSign > 0 ? 0 : 1]}</strong>`,
    ],
  };
}

function polKontext(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = nonZero(rng, 5);
    const p = nonZero(rng, 4);
    return {
      prompt: `Berechne für f(x) = ${fmt(a)} / ${shifted(p)} die Funktionswerte kurz rechts und kurz links der Polstelle, an den Stellen ${fmt(p + 0.1)} und ${fmt(p - 0.1)}.`,
      given: [`f(x) = ${fmt(a)} / ${shifted(p)}`],
      formulaHint: `f(${fmt(p)} ± 0,1) = ${fmt(a)} / (±0,1)`,
      fields: [numberField(`f(${fmt(p + 0.1)}) =`, a / 0.1, "", 2), numberField(`f(${fmt(p - 0.1)}) =`, -a / 0.1, "", 2)],
      steps: [`Der Nenner ist ±0,1.`, `<strong>f(${fmt(p + 0.1)}) = ${fmt(a * 10)}; f(${fmt(p - 0.1)}) = ${fmt(-a * 10)}</strong>`],
    };
  }
  const F = rng.pick([4, 5, 8, 10]);
  const g1 = 1.5 * F;
  return {
    prompt: `Für eine Sammellinse mit der Brennweite ${F} cm hängt die Bildweite b von der Gegenstandsweite g ab: b(g) = ${F}g / (g − ${F}) (alles in cm, g &gt; 0). Wo hat b eine Polstelle, und wie verhält sich b, wenn sich der Gegenstand von außen (g &gt; ${F}) der Brennweite nähert? Wie groß ist b für g = ${fmt(g1)} cm?`,
    given: [`b(g) = ${F}g / (g − ${F})`],
    fields: [numberField("Polstelle g =", F, "cm", 2), choiceField(`g → ${F} von rechts: b(g) →`, INF, 0), numberField(`b(${fmt(g1)}) =`, 3 * F, "cm", 2)],
    steps: [`Nenner g − ${F} = 0 ⇔ g = ${F}; der Zähler ist dort ${F * F} &gt; 0.`, `Für g &gt; ${F} ist der Nenner positiv: b → +∞. Das Bild entsteht immer weiter weg.`, `b(${fmt(g1)}) = ${fmt(F * g1)} / ${fmt(g1 - F)} = ${3 * F}`, `<strong>g = ${F} cm; b → +∞; b = ${3 * F} cm</strong>`],
  };
}

const polstellen: Lesson = {
  id: "gr-3-polstellen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Polstellen und senkrechte Asymptoten",
  subtitle: "Links- und rechtsseitiges Grenzverhalten",
  lehrplan: `${LEHRPLAN}, links- und rechtsseitiges Grenzverhalten an Polstellen, senkrechte Asymptoten`,
  whyItMatters:
    "An einer Polstelle wird der Funktionswert betragsmäßig beliebig groß. Ob er dabei gegen +∞ oder −∞ geht und ob das Vorzeichen wechselt, bestimmt die Gestalt des Graphen und in Anwendungen, etwa bei Linsen, wohin ein Bild ausweicht.",
  explanationHtml: `
    <p>Ist x₀ eine Nullstelle des Nenners, aber nicht des Zählers (der Term ist gekürzt), so heißt x₀ <strong>Polstelle</strong>. Nähert sich x der Stelle x₀, wird |f(x)| beliebig groß. Die Gerade <strong>x = x₀</strong> ist <strong>senkrechte Asymptote</strong>.</p>
    <p>Man untersucht beide Seiten getrennt:</p>
    <ul>
      <li><strong>linksseitig:</strong> x → x₀ mit x &lt; x₀, geschrieben lim<sub>x→x₀⁻</sub> f(x),</li>
      <li><strong>rechtsseitig:</strong> x → x₀ mit x &gt; x₀, geschrieben lim<sub>x→x₀⁺</sub> f(x).</li>
    </ul>
    <p>Das Ergebnis ist jeweils +∞ oder −∞. Du bestimmst es mit den Vorzeichen: Zähler nahe x₀ (sein Wert bei x₀), Nenner kurz links und kurz rechts von x₀. Ist der Faktor (x − x₀) im Nenner einfach, wechselt das Vorzeichen: <strong>Pol mit Vorzeichenwechsel</strong>. Steht (x − x₀)², ist der Nenner auf beiden Seiten positiv: <strong>Pol ohne Vorzeichenwechsel</strong>.</p>
    <div class="example">f(x) = (x + 1)/(x − 2): Zähler bei 2: 3 &gt; 0. Links von 2 ist x − 2 &lt; 0, also lim<sub>x→2⁻</sub> f(x) = −∞; rechts lim<sub>x→2⁺</sub> f(x) = +∞. Pol mit Vorzeichenwechsel, senkrechte Asymptote x = 2. Probe: f(2,1) = 3,1/0,1 = 31, f(1,9) = 2,9/(−0,1) = −29.</div>
    <div class="merke"><strong>Merke:</strong> Polstelle x₀: Nenner 0, Zähler ≠ 0. Senkrechte Asymptote x = x₀. Einfacher Faktor (x − x₀): Pol mit Vorzeichenwechsel; (x − x₀)²: ohne Vorzeichenwechsel.</div>
  `,
  formulas: [
    { name: "Einseitige Grenzwerte", html: "lim<sub>x→x₀⁻</sub> f(x), lim<sub>x→x₀⁺</sub> f(x) ∈ {+∞; −∞}", quantities: "x₀⁻: von links (x < x₀), x₀⁺: von rechts" },
    { name: "Senkrechte Asymptote", html: "x = x₀", quantities: "x₀ Polstelle: N(x₀) = 0, Z(x₀) ≠ 0" },
  ],
  quiz: {
    question: "Wie verhält sich f(x) = 1/(x − 3)² bei Annäherung an x = 3?",
    options: ["Von beiden Seiten f(x) → +∞: Pol ohne Vorzeichenwechsel", "Von links −∞, von rechts +∞", "f(x) → 0, weil der Zähler 1 ist"],
    correctIndex: 0,
    explanation: "(x − 3)² ist auf beiden Seiten von 3 positiv und wird beliebig klein. Der Kehrwert wird also von beiden Seiten beliebig groß und positiv.",
  },
  lab: {
    kind: "pole-approach",
    title: "Labor: An die Polstelle heran",
    intro:
      "Stelle f(x) = a/(x − p) oder a/(x − p)² ein und ziehe den Punkt nahe an die Polstelle, von links oder von rechts. Beobachte, wie groß f(x) wird und welches Vorzeichen es hat.",
    params: [
      { type: "range", key: "a", label: "Zähler a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "p", label: "Polstelle p", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "choice", key: "n", label: "Nenner", value: 1, options: [{ value: 1, label: "(x − p), einfach" }, { value: 2, label: "(x − p)², doppelt" }] },
      { type: "choice", key: "side", label: "Seite", value: 1, options: [{ value: 0, label: "links von p" }, { value: 1, label: "rechts von p" }] },
      { type: "range", key: "dist", label: "Abstand zur Polstelle", unit: "", min: 0.05, max: 2, step: 0.05, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "term", label: "f(x)", emphasis: true, compute: (v) => `f(x) = ${poleTerm(v)}` },
      { key: "value", label: "f(x) am Punkt", compute: (v) => poleValue(v, probeX(v)), digits: 2 },
      { key: "left", label: "x → p von links", compute: (v) => oneSided(v, 0) },
      { key: "right", label: "x → p von rechts", compute: (v) => oneSided(v, 1) },
      { key: "vzw", label: "Pol", compute: (v) => (v.a === 0 ? "a = 0: keine Polstelle" : v.n === 1 ? `mit Vorzeichenwechsel, Asymptote x = ${fmt(v.p)}` : `ohne Vorzeichenwechsel, Asymptote x = ${fmt(v.p)}`) },
    ],
    goals: [
      { id: "ohne-vzw-unten", text: "Stelle einen Pol ohne Vorzeichenwechsel ein, bei dem der Graph auf beiden Seiten nach unten geht.", check: (v) => v.n === 2 && v.a < 0 },
      { id: "links-minus", text: "Lege die Polstelle auf x = −1 mit f(x) → −∞ von links und f(x) → +∞ von rechts.", check: (v) => v.p === -1 && v.n === 1 && v.a > 0 },
      { id: "gross", text: "Nähere dich einer Polstelle von links so weit, dass |f(x)| größer als 100 wird.", check: (v) => v.side === 0 && Math.abs(poleValue(v, probeX(v))) > 100 },
    ],
  },
  exercises: [
    { id: "einseitig", make: einseitig },
    { id: "pol-kontext", make: polKontext },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du untersuchst Polstellen von beiden Seiten und erkennst Pole mit und ohne Vorzeichenwechsel.",
};

// 2.4 Graph und Term ─────────────────────────────────────────────────────────

function eigenschaftenAblesen(rng: Rng, level: 1 | 2): ExerciseTask {
  const a = rng.pick([-3, -2, -1, 2, 3, 0.5]);
  const [z, p] = twoInts(rng, -4, 4, [0]);
  if (level === 1) {
    const v = { a, z, p, n: 1 };
    return {
      prompt: `Lies aus <strong>f(x) = ${buildTerm(v)}</strong> die Nullstelle, die Polstelle und die waagrechte Asymptote ab, ohne zu zeichnen.`,
      given: [`f(x) = ${buildTerm(v)}`],
      formulaHint: "f(x) = a(x − z)/(x − p): Nullstelle z, Polstelle p, Asymptote y = a (gleicher Grad).",
      fields: [numberField("Nullstelle x =", z, "", 2), numberField("Polstelle x =", p, "", 2), numberField("Asymptote y =", a, "", 2)],
      steps: [`Zähler 0 bei x = ${fmt(z)}, Nenner 0 bei x = ${fmt(p)}.`, `Gleicher Grad: y = ${fmt(a)} / 1.`, `<strong>Nullstelle ${fmt(z)}, Polstelle ${fmt(p)}, Asymptote y = ${fmt(a)}</strong>`],
    };
  }
  const v = { a, z, p, n: 2 };
  const f0 = buildValue(v, 0);
  return {
    prompt: `Analysiere f(x) = ${buildTerm(v)}: Nullstelle, Art des Pols, waagrechte Asymptote und den Schnittpunkt mit der y-Achse. Skizziere danach den Graphen auf Papier.`,
    given: [`f(x) = ${buildTerm(v)}`],
    fields: [
      numberField("Nullstelle x =", z, "", 2),
      choiceField(`Pol bei x = ${fmt(p)}`, ["mit Vorzeichenwechsel", "ohne Vorzeichenwechsel"], 1),
      numberField("Asymptote y =", 0, "", 2),
      numberField("f(0) =", f0, "", 3),
    ],
    steps: [`(x ${p > 0 ? "−" : "+"} ${Math.abs(p)})² wechselt das Vorzeichen nicht.`, "Zählergrad 1 &lt; Nennergrad 2: y = 0.", `f(0) = ${fmt(a)} · ${paren(-z)} / ${fmt(p * p)} ${rel(f0, 3)} ${fmt(f0, 3)}`, `<strong>Nullstelle ${fmt(z)}; ohne Vorzeichenwechsel; y = 0; f(0) ${rel(f0, 3)} ${fmt(f0, 3)}</strong>`],
  };
}

function termFinden(rng: Rng, level: 1 | 2): ExerciseTask {
  const [z, p] = twoInts(rng, -4, 4);
  if (level === 1) {
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    return {
      prompt: `Gesucht ist eine Funktion f(x) = a(x − z)/(x − p) mit der Nullstelle ${fmt(z)}, einem Pol mit Vorzeichenwechsel bei x = ${fmt(p)} und der waagrechten Asymptote y = ${fmt(a)}. Gib a, z und p an.`,
      given: [`Nullstelle ${fmt(z)}`, `Polstelle ${fmt(p)}`, `Asymptote y = ${fmt(a)}`],
      formulaHint: "Nullstelle aus dem Zähler, Polstelle aus dem Nenner, Asymptote = Quotient der Leitkoeffizienten a : 1.",
      fields: [numberField("a =", a, "", 2), numberField("z =", z, "", 2), numberField("p =", p, "", 2)],
      steps: [`a = ${fmt(a)}, z = ${fmt(z)}, p = ${fmt(p)}`, `<strong>f(x) = ${buildTerm({ a, z, p, n: 1 })}</strong>`],
    };
  }
  const a = rng.pick([-2, -1, 0.5, 1, 2, 3]);
  const x1 = twoInts(rng, -4, 4, [z, p])[0];
  const y1 = (a * (x1 - z)) / (x1 - p) ** 2;
  return {
    prompt: `Der Graph einer Funktion f(x) = a(x − z)/(x − p)² hat die Nullstelle ${fmt(z)}, einen Pol ohne Vorzeichenwechsel bei x = ${fmt(p)} und verläuft durch den Punkt (${fmt(x1)} | ${fmt(y1, 3)}). Bestimme a. Welche waagrechte Asymptote hat er?`,
    given: [`Nullstelle ${fmt(z)}`, `Pol ohne Vorzeichenwechsel bei ${fmt(p)}`, `Punkt (${fmt(x1)} | ${fmt(y1, 3)})`],
    fields: [numberField("a =", a, "", 2), numberField("Asymptote y =", 0, "", 2)],
    steps: [`Einsetzen: ${fmt(y1, 3)} = a · ${paren(x1 - z)} / ${fmt((x1 - p) ** 2)}`, `a = ${fmt(y1, 3)} · ${fmt((x1 - p) ** 2)} : ${paren(x1 - z)} = ${fmt(a)}`, `<strong>a = ${fmt(a)}; Asymptote y = 0</strong>`],
  };
}

const graphTerm: Lesson = {
  id: "gr-4-graph-term",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "2.4 Graph skizzieren und Term finden",
  subtitle: "Von den Eigenschaften zum Graphen und zurück",
  lehrplan: `${LEHRPLAN}, Analyse einfacher gebrochen-rationaler Funktionen und Terme zu gegebenen Eigenschaften`,
  whyItMatters:
    "Nullstellen, Pole und Asymptoten sind das Gerüst eines Graphen. Hast du sie, kannst du ihn skizzieren und mit einer Software kontrollieren. Umgekehrt baust du aus geforderten Eigenschaften einen passenden Term, etwa für ein Modell.",
  explanationHtml: `
    <p>Für eine Skizze einer einfachen gebrochen-rationalen Funktion bestimmst du nacheinander:</p>
    <ol>
      <li>Definitionsmenge und Polstellen (Art des Pols: mit oder ohne Vorzeichenwechsel),</li>
      <li>Nullstellen und den Schnittpunkt mit der y-Achse,</li>
      <li>das Verhalten für x → ±∞ und die Asymptoten,</li>
      <li>bei Bedarf Symmetrie und einzelne Funktionswerte.</li>
    </ol>
    <p>Dann zeichnest du zuerst die Asymptoten gestrichelt, trägst die Punkte ein und verbindest so, dass sich der Graph den Asymptoten annähert. Zur Kontrolle eignet sich ein Funktionenplotter.</p>
    <p>Umgekehrt: Sollen Nullstelle z, Polstelle p und Asymptote vorgegeben sein, beginnst du mit f(x) = a(x − z)/(x − p). Der Faktor a legt bei gleichem Grad die waagrechte Asymptote y = a fest. Ein Pol ohne Vorzeichenwechsel verlangt (x − p)² im Nenner; dann ist y = 0 die Asymptote, und a bestimmst du über einen weiteren Punkt.</p>
    <div class="example">Gesucht: Nullstelle 2, Pol mit Vorzeichenwechsel bei −1, Asymptote y = 2. Ansatz f(x) = a(x − 2)/(x + 1), Asymptote y = a ⇒ a = 2: f(x) = 2(x − 2)/(x + 1). Probe: f(0) = −4, der Graph schneidet die y-Achse bei −4.</div>
    <div class="merke"><strong>Merke:</strong> Gerüst eines Graphen: Pole, Nullstellen, Asymptoten. Ansatz für einen Term: f(x) = a(x − z)/(x − p) oder a(x − z)/(x − p)²; a über die Asymptote oder einen Punkt bestimmen.</div>
  `,
  formulas: [
    { name: "Ansatz mit Pol mit Vorzeichenwechsel", html: "f(x) = a(x − z) / (x − p), Asymptote y = a", quantities: "z Nullstelle, p Polstelle" },
    { name: "Ansatz mit Pol ohne Vorzeichenwechsel", html: "f(x) = a(x − z) / (x − p)², Asymptote y = 0", quantities: "a über einen Punkt bestimmen" },
  ],
  quiz: {
    question: "Welcher Term hat die Nullstelle 1, einen Pol bei 3 und die Asymptote y = −2?",
    options: ["f(x) = −2(x − 1)/(x − 3)", "f(x) = −2(x − 3)/(x − 1)", "f(x) = (x − 1)/(−2(x − 3)²)"],
    correctIndex: 0,
    explanation: "Die Nullstelle steht im Zähler, die Polstelle im Nenner. Bei gleichem Grad ist die Asymptote der Quotient der Leitkoeffizienten, hier −2 : 1. Mit (x − 3)² im Nenner wäre y = 0 die Asymptote.",
  },
  lab: {
    kind: "rational-build",
    title: "Labor: Einen Term bauen",
    intro:
      "Ziehe die Nullstelle (blau), die Polstelle (oben) und bei einfachem Nenner die Höhe der Asymptote (orange). Wähle, ob der Nenner (x − p) oder (x − p)² ist.",
    params: [
      { type: "range", key: "a", label: "Faktor a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "z", label: "Nullstelle z", unit: "", min: -4, max: 4, step: 1, value: 1, digits: 0 },
      { type: "range", key: "p", label: "Polstelle p", unit: "", min: -4, max: 4, step: 1, value: -2, digits: 0 },
      { type: "choice", key: "n", label: "Nenner", value: 1, options: [{ value: 1, label: "(x − p)" }, { value: 2, label: "(x − p)²" }] },
    ],
    readouts: [
      { key: "term", label: "f(x)", emphasis: true, compute: (v) => `f(x) = ${buildTerm(v)}` },
      { key: "props", label: "Nullstelle, Pol", compute: (v) => (v.z === v.p ? "gemeinsamer Faktor: Term erst kürzen" : `Nullstelle ${fmt(v.z)}; Pol ${v.n === 1 ? "mit" : "ohne"} Vorzeichenwechsel bei ${fmt(v.p)}`) },
      { key: "asym", label: "waagrechte Asymptote", compute: (v) => `y = ${fmt(v.n === 1 ? v.a : 0)}` },
      { key: "y0", label: "Schnitt mit der y-Achse", compute: (v) => (v.p === 0 ? "keiner: 0 ∉ D_f" : `(0 | ${fmt(buildValue(v, 0))})`) },
    ],
    goals: [
      { id: "vzw", text: "Baue eine Funktion mit Nullstelle 2, Pol mit Vorzeichenwechsel bei −1 und Asymptote y = 2.", check: (v) => v.n === 1 && v.a === 2 && v.z === 2 && v.p === -1 },
      { id: "ohne-vzw", text: "Nullstelle 0, Pol ohne Vorzeichenwechsel bei 3, und der Graph geht durch (1 | 0,5).", check: (v) => v.n === 2 && v.z === 0 && v.p === 3 && Math.abs(buildValue(v, 1) - 0.5) < 1e-9 },
      { id: "negativ", text: "Nullstelle −2, Pol mit Vorzeichenwechsel bei 1 und Asymptote y = −1.", check: (v) => v.n === 1 && v.a === -1 && v.z === -2 && v.p === 1 },
    ],
  },
  exercises: [
    { id: "eigenschaften-ablesen", make: eigenschaftenAblesen },
    { id: "term-finden", make: termFinden },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du skizzierst gebrochen-rationale Funktionen aus ihren Eigenschaften und findest Terme zu Vorgaben.",
};

// 2.5 Schnittpunkte ──────────────────────────────────────────────────────────

function geradeHyperbel(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const m = rng.pick([1, -1, 2, 0.5]);
    const [r1, r2] = twoInts(rng, -4, 4, [0]);
    const c = -m * r1 * r2;
    const t = -m * (r1 + r2);
    return {
      prompt: `Berechne die Schnittstellen der Graphen von <strong>f(x) = ${fmt(c)}/x</strong> und <strong>g(x) = ${linear(m, t)}</strong>.`,
      given: [`f(x) = ${fmt(c)}/x`, `g(x) = ${linear(m, t)}`],
      formulaHint: "f(x) = g(x) mit x multiplizieren (x ≠ 0), alles auf eine Seite, Lösungsformel.",
      fields: [numberField("x₁ =", r1, "", 2), numberField("x₂ =", r2, "", 2)],
      anyOrder: [0, 1],
      steps: [
        `${fmt(c)}/x = ${linear(m, t)} | · x ⇒ ${fmt(c)} = ${polyText([m, t, 0])}`,
        `${polyText([m, t, -c])} = 0 ⇔ x = ${fmt(r1)} oder x = ${fmt(r2)} (beide ≠ 0)`,
        `<strong>x₁ = ${fmt(r1)}, x₂ = ${fmt(r2)}</strong>`,
      ],
    };
  }
  const x0 = nonZero(rng, 4);
  let p = nonZero(rng, 3);
  if (p === x0) p = -p;
  const k = nonZero(rng, 3);
  const b = k * x0;
  const a = k * (x0 - p);
  return {
    prompt: `Zwei Messreihen werden durch f(x) = ${fmt(a)}/${shifted(p)} und g(x) = ${fmt(b)}/x beschrieben. Berechne die Koordinaten des Schnittpunkts der beiden Graphen.`,
    given: [`f(x) = ${fmt(a)}/${shifted(p)}`, `g(x) = ${fmt(b)}/x`],
    fields: [numberField("x =", x0, "", 2), numberField("y =", k, "", 2)],
    steps: [
      `Gleichsetzen und über Kreuz multiplizieren: ${fmt(a)}x = ${fmt(b)}${shifted(p)}`,
      `${fmt(a)}x = ${linear(b, -b * p)} ⇒ ${fmt(a - b)}x = ${fmt(-b * p)} ⇒ x = ${fmt(x0)}`,
      `y = g(${fmt(x0)}) = ${fmt(b)}/${paren(x0)} = ${fmt(k)}`,
      `<strong>S(${fmt(x0)} | ${fmt(k)})</strong>`,
    ],
  };
}

function beruehren(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const s = rng.pick([1, 2, 3, 4]);
    const k = s * s;
    return {
      prompt: `Für welchen positiven Wert von t berührt die Gerade g(x) = −x + t den Graphen von f(x) = ${k}/x (genau ein gemeinsamer Punkt)? Gib auch die Berührstelle an.`,
      given: [`f(x) = ${k}/x`, "g(x) = −x + t"],
      formulaHint: "x² − tx + k = 0 hat genau eine Lösung, wenn die Diskriminante t² − 4k = 0 ist.",
      fields: [numberField("t =", 2 * s, "", 2, { slips: [{ value: 4 * k, hint: "t² = 4k: Ziehe noch die Wurzel." }] }), numberField("Berührstelle x =", s, "", 2)],
      steps: [`${k}/x = −x + t ⇔ x² − tx + ${k} = 0`, `D = t² − ${4 * k} = 0 ⇔ t = ${2 * s} (t &gt; 0)`, `x = t/2 = ${s}`, `<strong>t = ${2 * s}; Berührstelle x = ${s}</strong>`],
    };
  }
  const k = rng.pick([2, 4, 6]);
  const m = rng.pick([-1, -2, -0.5]);
  const t = rng.pick([2, 3, 4, 5, 6, 7]);
  // k/x = mx + t ⇔ m x² + t x − k = 0
  const roots = quadraticRoots(m, t, -k);
  const count = roots.length;
  const fields: AnswerField[] = [choiceField("Anzahl der Schnittpunkte", ["keiner", "einer", "zwei"], count)];
  if (count > 0) fields.push(numberField("größte Schnittstelle x ≈", Math.max(...roots), "", 2));
  const D = t * t + 4 * m * k;
  return {
    prompt: `Wie viele Schnittpunkte haben die Graphen von f(x) = ${k}/x und g(x) = ${linear(m, t)}? Gib gegebenenfalls die größte Schnittstelle an.`,
    given: [`f(x) = ${k}/x`, `g(x) = ${linear(m, t)}`],
    fields,
    steps: [`${k}/x = ${linear(m, t)} | · x ⇒ ${polyText([m, t, -k])} = 0`, `Diskriminante: ${fmt(t * t)} ${4 * m * k < 0 ? "−" : "+"} ${fmt(Math.abs(4 * m * k))} = ${fmt(D)}`, `<strong>${["keiner", "einer", "zwei"][count]}${count > 0 ? `; größte Schnittstelle x ≈ ${fmt(Math.max(...roots))}` : ""}</strong>`],
  };
}

const schnittpunkte: Lesson = {
  id: "gr-5-schnittpunkte",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "2.5 Schnittpunkte berechnen",
  subtitle: "Bruchgleichungen, die auf quadratische Gleichungen führen",
  lehrplan: `${LEHRPLAN}, Schnittpunkte mit Graphen linearer und gebrochen-rationaler Funktionen`,
  whyItMatters:
    "Wo sich zwei Graphen schneiden, haben zwei Modelle denselben Wert: Kosten und Erlös, zwei Messreihen, eine Bahn und ein Hindernis. Bei gebrochen-rationalen Funktionen führt das auf eine Bruchgleichung, die du auf eine lineare oder quadratische Gleichung zurückführst.",
  explanationHtml: `
    <p>Für die Schnittstellen der Graphen von f und g löst du die Gleichung <strong>f(x) = g(x)</strong>. Ist f gebrochen-rational, entsteht eine <strong>Bruchgleichung</strong>:</p>
    <ol>
      <li>Definitionsmenge festhalten (Nennernullstellen ausschließen).</li>
      <li>Mit dem Hauptnenner multiplizieren; es entsteht eine lineare oder quadratische Gleichung.</li>
      <li>Lösen (bei quadratischen Gleichungen mit der Lösungsformel) und prüfen, ob die Lösungen in der Definitionsmenge liegen.</li>
      <li>y-Koordinaten durch Einsetzen in f oder g berechnen.</li>
    </ol>
    <p>Die <strong>Diskriminante</strong> der quadratischen Gleichung zeigt die Anzahl der gemeinsamen Punkte: zwei, einen (die Gerade <strong>berührt</strong> den Graphen) oder keinen. Kontrolliere dein Ergebnis mit einer Software, aber bedenke: Ein Plotter zeigt nahe einer Polstelle manchmal senkrechte Linien, die nicht zum Graphen gehören.</p>
    <div class="example">f(x) = 1/x und g(x) = −x + 2,5: 1/x = −x + 2,5 | · x ⇒ 1 = −x² + 2,5x ⇒ x² − 2,5x + 1 = 0 ⇒ x = 0,5 oder x = 2. Beide ≠ 0. Schnittpunkte (0,5 | 2) und (2 | 0,5).</div>
    <div class="merke"><strong>Merke:</strong> f(x) = g(x) mit dem Nenner multiplizieren, die entstehende Gleichung lösen, Lösungen mit D<sub>f</sub> vergleichen. Diskriminante 0: Die Gerade berührt den Graphen.</div>
  `,
  formulas: [
    { name: "Schnittbedingung", html: "f(x) = g(x), x ∈ D<sub>f</sub> ∩ D<sub>g</sub>", quantities: "nach dem Multiplizieren mit dem Nenner: lineare oder quadratische Gleichung" },
    { name: "Lösungsformel", html: "ax² + bx + c = 0 ⇒ x = (−b ± √(b² − 4ac)) / (2a)", quantities: "Diskriminante D = b² − 4ac" },
  ],
  quiz: {
    question: "Beim Lösen von 2/(x − 1) = x erhältst du x² − x − 2 = 0 mit den Lösungen −1 und 2. Was gilt?",
    options: ["Beide sind Schnittstellen, denn beide liegen in D = ℝ \\ {1}.", "Nur 2 ist Schnittstelle, negative Lösungen fallen weg.", "Keine, weil man mit x − 1 multipliziert hat."],
    correctIndex: 0,
    explanation: "Ausgeschlossen ist nur die Nennernullstelle 1. Probe: 2/(−2) = −1 und 2/1 = 2. Das Multiplizieren mit x − 1 ist erlaubt, solange x ≠ 1 ist.",
  },
  lab: {
    kind: "rational-intersections",
    title: "Labor: Gerade und Hyperbel",
    intro: "Ziehe die violette Gerade mit ihren zwei Punkten. Oben steht die quadratische Gleichung, auf die f(x) = mx + t führt; die Schnittpunkte sind markiert.",
    params: [
      { type: "choice", key: "fn", label: "Funktion f", value: 0, options: CUT_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "m", label: "Steigung m", unit: "", min: -3, max: 3, step: 0.25, value: 0.5, digits: 2 },
      { type: "range", key: "t", label: "y-Achsenabschnitt t", unit: "", min: -4, max: 4, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "eq", label: "Gleichung nach dem Multiplizieren", emphasis: true, compute: (v) => `${polyText(cutEquation(v))} = 0` },
      { key: "count", label: "gemeinsame Punkte", compute: (v) => String(cutPoints(v).length) },
      { key: "points", label: "Schnittpunkte", compute: (v) => { const c = cutPoints(v); return c.length === 0 ? "keine" : c.map((x) => `(${fmt(x)} | ${fmt(v.m * x + v.t)})`).join(" und "); } },
    ],
    goals: [
      { id: "beruehren", text: "f(x) = 1/x: Stelle eine Gerade mit der Steigung −1 ein, die den Graphen berührt.", check: (v) => v.fn === 0 && v.m === -1 && cutPoints(v).length === 1 },
      { id: "asymptote", text: "f(x) = 2/(x − 1) + 1: Finde die waagrechte Gerade, die den Graphen nie schneidet.", check: (v) => v.fn === 1 && v.m === 0 && cutPoints(v).length === 0 },
      { id: "ursprung", text: "f(x) = 1/x: Lege eine Ursprungsgerade durch die Punkte (1 | 1) und (−1 | −1).", check: (v) => v.fn === 0 && v.m === 1 && v.t === 0 },
    ],
  },
  exercises: [
    { id: "gerade-hyperbel", make: geradeHyperbel },
    { id: "beruehren", make: beruehren },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Schnittpunkte mit gebrochen-rationalen Funktionen über Bruchgleichungen.",
};

export const STAGE_GEBROCHEN_RATIONAL: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Gebrochen-rationale Funktionen",
  subtitle: "Definitionslücken, Asymptoten, Polstellen, Graphen und Schnittpunkte",
  icon: "🧮",
  accent: "#0d9488",
  badgeTitle: "Asymptoten-Profi",
  lehrplanLabel: "M11 LB 2 · ca. 15 Std.",
  lessons: [definitionsmenge, asymptoten, polstellen, graphTerm, schnittpunkte],
};
