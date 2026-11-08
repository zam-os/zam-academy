import { fmt, paren, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  chain,
  chainFunction,
  chainTerm,
  FUNCTION_TYPES,
  jumpAt2,
  LIMIT_FUNCTIONS,
  matchesTarget,
  ORDER_TARGETS,
  piecewise,
  smallestX0,
  STEPS,
  staysInStrip,
  SYMMETRY_TEXT,
  symCubic,
  symmetryOf,
  transformTerm,
  typeDomain,
  typeLimit,
  typeMonotony,
  typeRange,
  typeSymmetry,
  typeTerm,
  typeValue,
} from "../lab/views-funktionen";
import { polyText, rel, sameGraph } from "../lab/shared";
import type { AnswerField, ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-1-funktionen";
const LEHRPLAN = "M11 LB 1: Spezielle Eigenschaften von Funktionen";

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** " + 3", " − 3" or "" for 0. */
function plus(value: number, digits = 2): string {
  return term(value, "", false, digits);
}

/** Puts a negative number in brackets: "−2" → "(−2)". */
const MINUS_RE = /^−(.*)$/;

const SYM_OPTIONS = ["achsensymmetrisch zur y-Achse", "punktsymmetrisch zum Ursprung", "weder noch"];
const LIMIT_OPTIONS = ["f(x) → +∞", "f(x) → −∞", "f(x) → 0", "kein Grenzwert, f(x) schwankt"];

// 1.1 Funktionstypen im Überblick ────────────────────────────────────────────

/** The types a task may use, with the factors that keep the values readable. */
const TASK_TYPES = [0, 1, 2, 3, 4, 6];
const FACTORS = [-3, -2, -0.5, 0.5, 2, 3];

function limitIndex(text: string): number {
  return text === "+∞" ? 0 : text === "−∞" ? 1 : text === "0" ? 2 : 3;
}

function symIndex(sym: string): number {
  return sym === "achse" ? 0 : sym === "punkt" ? 1 : 2;
}

function steckbrief(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const type = rng.pick([0, 1, 2, 3, 4, 5, 6]);
    const a = rng.pick(FACTORS);
    const sym = typeSymmetry(type, a);
    const lim = typeLimit(type, a, 1);
    return {
      prompt: `Beschreibe den Graphen von <strong>f(x) = ${typeTerm(type, a)}</strong> (${FUNCTION_TYPES[type].name}): Welche Symmetrie hat er, und wie verhält sich f(x) für x → +∞?`,
      given: [`f(x) = ${typeTerm(type, a)}`, `D<sub>f</sub> = ${typeDomain(type)}`],
      formulaHint: "Nur gerade Exponenten: achsensymmetrisch; nur ungerade: punktsymmetrisch. 2ˣ wächst über alle Grenzen, 1/x geht gegen 0, sin x schwankt.",
      fields: [choiceField("Symmetrie", SYM_OPTIONS, symIndex(sym)), choiceField("für x → +∞", LIMIT_OPTIONS, limitIndex(lim))],
      steps: [
        `Symmetrie: Setze −x ein. ${type === 4 ? "2⁻ˣ ist weder 2ˣ noch −2ˣ." : type === 5 ? "sin(−x) = −sin x." : type === 1 || type === 6 ? "Nur gerade Potenzen: f(−x) = f(x)." : "Nur ungerade Potenzen: f(−x) = −f(x)."}`,
        `Für große x: ${type === 3 ? "a/x wird beliebig klein" : type === 5 ? "sin x pendelt zwischen −1 und 1" : `das Vorzeichen von a = ${fmt(a)} und die Potenz entscheiden`}.`,
        `<strong>${SYMMETRY_TEXT[sym]}, für x → +∞: ${LIMIT_OPTIONS[limitIndex(lim)]}</strong>`,
      ],
      meta: { type, a },
    };
  }
  // Level 2: from a description back to the term.
  const cases = [
    { text: "Der Graph ist punktsymmetrisch zum Ursprung, hat die Definitionsmenge ℝ \\ {0} und nähert sich für x → ±∞ der x-Achse.", type: 3 },
    { text: "Der Graph liegt ganz oberhalb der x-Achse, die x-Achse ist für x → −∞ Asymptote, und die Funktion ist streng monoton steigend.", type: 4 },
    { text: "Der Graph ist achsensymmetrisch zur y-Achse, hat drei Nullstellen und geht für x → ±∞ gegen +∞.", type: 6 },
    { text: "Der Graph ist punktsymmetrisch zum Ursprung, die Funktion ist auf ganz ℝ streng monoton steigend und hat genau eine Nullstelle.", type: 2 },
    { text: "Der Graph ist achsensymmetrisch zur y-Achse, hat genau eine Nullstelle und die Wertemenge ℝ₀⁺.", type: 1 },
  ];
  const chosen = rng.pick(cases);
  const others = rng.shuffle(cases.filter((c) => c.type !== chosen.type)).slice(0, 3);
  const options = rng.shuffle([chosen, ...others]);
  const correct = options.indexOf(chosen);
  const x0 = rng.pick([1, 2, -1, -2]);
  const value = typeValue(chosen.type, 1, x0);
  return {
    prompt: `Ein Funktionsgraph hat diese Eigenschaften: ${chosen.text} Welcher Term passt? Berechne für ihn auch f(${fmt(x0)}).`,
    given: options.map((o, i) => `(${i + 1}) f(x) = ${typeTerm(o.type, 1)}`),
    fields: [choiceField("passender Term", options.map((_, i) => `(${i + 1})`), correct), numberField(`f(${fmt(x0)}) =`, value, "", 2)],
    steps: [
      "Prüfe jede Eigenschaft einzeln: Symmetrie, Definitionsmenge, Nullstellen, Verhalten an den Rändern.",
      `Nur f(x) = ${typeTerm(chosen.type, 1)} erfüllt alle.`,
      `<strong>(${correct + 1}): f(${fmt(x0)}) = ${fmt(value)}</strong>`,
    ],
    meta: { type: chosen.type },
  };
}

function punktParameter(rng: Rng, level: 1 | 2): ExerciseTask {
  const type = rng.pick(TASK_TYPES.filter((t) => t !== 3 || level === 1));
  if (level === 1) {
    const a = rng.pick(FACTORS);
    let x0 = rng.pick([-2, -1, 1, 2, 3]);
    if (type === 3 && x0 === 0) x0 = 1;
    const value = typeValue(type, a, x0);
    const mono = typeMonotony(type, a);
    return {
      prompt: `Gegeben ist f(x) = ${typeTerm(type, a)}. Berechne f(${fmt(x0)}) und entscheide, ob f auf ganz D<sub>f</sub> streng monoton ist.`,
      given: [`f(x) = ${typeTerm(type, a)}`, `D<sub>f</sub> = ${typeDomain(type)}`],
      formulaHint: "Einsetzen: f(x₀) = a · g(x₀). Streng monoton steigend heißt: aus x₁ &lt; x₂ folgt f(x₁) &lt; f(x₂).",
      fields: [
        numberField(`f(${fmt(x0)}) =`, value, "", 3),
        choiceField("Monotonie auf D<sub>f</sub>", ["streng monoton steigend", "streng monoton fallend", "nicht streng monoton"], mono === "steigt" ? 0 : mono === "fällt" ? 1 : 2),
      ],
      steps: [
        `f(${fmt(x0)}) = ${fmt(a)} · ${fmt(FUNCTION_TYPES[type].g(x0), 3).replace(MINUS_RE, "(−$1)")} ${rel(value, 3)} ${fmt(value, 3)}`,
        mono === "wechselt"
          ? type === 3
            ? "Die Kehrwertfunktion fällt (bei a > 0) zwar auf ]−∞; 0[ und auf ]0; +∞[, aber f(−1) &lt; f(1) zeigt: nicht auf ganz D<sub>f</sub>."
            : "Der Graph steigt und fällt abschnittsweise."
          : `Für a ${a > 0 ? "&gt;" : "&lt;"} 0 ${mono === "steigt" ? "steigt" : "fällt"} der Graph überall.`,
      `<strong>f(${fmt(x0)}) ${rel(value, 3)} ${fmt(value, 3)}; ${mono === "steigt" ? "streng monoton steigend" : mono === "fällt" ? "streng monoton fallend" : "nicht streng monoton"}</strong>`,
      ],
      meta: { type, a, x0 },
    };
  }
  // Level 2: the graph passes through a point; find a, then a second value.
  const a = rng.pick([-3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3]);
  const x0 = rng.pick([1, 2, -1]);
  const g0 = FUNCTION_TYPES[type].g(x0);
  const safeX0 = Math.abs(g0) < 1e-9 ? 3 : x0;
  const y0 = typeValue(type, a, safeX0);
  const x1 = safeX0 === 3 ? 1 : 3;
  const y1 = typeValue(type, a, x1);
  return {
    prompt: `Der Graph einer Funktion f(x) = a · ${FUNCTION_TYPES[type].base} (${FUNCTION_TYPES[type].name}) verläuft durch den Punkt P(${fmt(safeX0)} | ${fmt(y0, 3)}). Bestimme a und den Funktionswert an der Stelle ${fmt(x1)}.`,
    given: [`P(${fmt(safeX0)} | ${fmt(y0, 3)})`],
    fields: [
      numberField("a =", a, "", 2, { slips: [{ value: 1 / a, hint: "Du hast durch y geteilt statt durch g(x₀): a = y₀ : g(x₀)." }] }),
      numberField(`f(${fmt(x1)}) =`, y1, "", 2),
    ],
    steps: [
      `P einsetzen: ${fmt(y0, 3)} = a · ${fmt(FUNCTION_TYPES[type].g(safeX0), 3).replace(MINUS_RE, "(−$1)")}`,
      `a = ${fmt(y0, 3)} : ${fmt(FUNCTION_TYPES[type].g(safeX0), 3).replace(MINUS_RE, "(−$1)")} = ${fmt(a)}`,
      `<strong>a = ${fmt(a)}, f(${fmt(x1)}) = ${fmt(y1)}</strong>`,
    ],
    meta: { type, a },
  };
}

const funktionstypen: Lesson = {
  id: "fk-1-funktionstypen",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Funktionstypen im Überblick",
  subtitle: "Charakteristische Beispiele und ihre Graphen",
  lehrplan: `${LEHRPLAN}, charakteristische Beispiele aller bekannten Funktionstypen`,
  whyItMatters:
    "In der Oberstufe begegnen dir alle Funktionstypen der Jahrgangsstufen 7 bis 10 wieder, oft gemischt. Wer zu jedem Typ ein typisches Beispiel mit Skizze im Kopf hat, erkennt an einem Term sofort, wie der Graph ungefähr aussieht.",
  explanationHtml: `
    <p>Bis zur 10. Klasse hast du diese Funktionstypen kennengelernt (Wiederholung aus M7 bis M10). Zu jedem gehört ein <strong>charakteristisches Beispiel</strong>, dessen Graph du skizzieren können solltest:</p>
    <ul>
      <li><strong>lineare Funktion</strong> f(x) = mx + t, z. B. f(x) = 2x − 1: Gerade, D<sub>f</sub> = W<sub>f</sub> = ℝ.</li>
      <li><strong>quadratische Funktion</strong> f(x) = ax² + bx + c, z. B. f(x) = x²: Parabel mit Scheitel, W<sub>f</sub> = ℝ₀⁺.</li>
      <li><strong>Potenzfunktionen</strong> f(x) = xⁿ: bei geradem n achsensymmetrisch (wie x², x⁴), bei ungeradem n punktsymmetrisch (wie x³); mit negativem Exponenten, z. B. f(x) = x⁻¹ = 1/x: Hyperbel, D<sub>f</sub> = ℝ \\ {0}, die Koordinatenachsen sind Asymptoten.</li>
      <li><strong>Exponentialfunktion</strong> f(x) = b · aˣ, z. B. f(x) = 2ˣ: immer oberhalb der x-Achse, W<sub>f</sub> = ℝ⁺, die x-Achse ist für x → −∞ Asymptote.</li>
      <li><strong>Sinus- und Kosinusfunktion</strong>, z. B. f(x) = sin x: periodisch mit der Periode 2π, W<sub>f</sub> = [−1; 1].</li>
      <li><strong>ganzrationale Funktionen</strong>, z. B. f(x) = 0,25x⁴ − x²: höchstens n Nullstellen beim Grad n, für x → ±∞ bestimmt der Summand mit der höchsten Potenz den Verlauf.</li>
    </ul>
    <p>Eine gute <strong>Skizze</strong> zeigt die wesentlichen Eigenschaften: Schnittpunkte mit den Achsen, Symmetrie, Asymptoten, Monotonie und das Verhalten an den Rändern von D<sub>f</sub>. Ein Faktor a vor dem Term streckt den Graphen in y-Richtung; bei a &lt; 0 wird er an der x-Achse gespiegelt.</p>
    <div class="example">f(x) = −0,5 · 2ˣ: Der Graph von 2ˣ wird mit 0,5 gestaucht und an der x-Achse gespiegelt. Er liegt ganz unterhalb der x-Achse, W<sub>f</sub> = ℝ⁻, f ist streng monoton fallend, für x → −∞ gilt f(x) → 0 und für x → +∞ gilt f(x) → −∞. f(2) = −0,5 · 4 = −2.</div>
    <div class="merke"><strong>Merke:</strong> Zu jedem Funktionstyp gehören typische Eigenschaften: Definitions- und Wertemenge, Symmetrie, Monotonie, Nullstellen und das Verhalten für x → ±∞. Der Faktor a streckt; a &lt; 0 spiegelt an der x-Achse.</div>
  `,
  formulas: [
    { name: "Potenzfunktion", html: "f(x) = xⁿ: n gerade → achsensymmetrisch, n ungerade → punktsymmetrisch", quantities: "n ∈ ℤ, für n < 0 ist D_f = ℝ \\ {0}" },
    { name: "Exponentialfunktion", html: "f(x) = b · aˣ, W<sub>f</sub> = ℝ⁺ für b &gt; 0", quantities: "a > 0, a ≠ 1; Asymptote y = 0" },
    { name: "Sinusfunktion", html: "f(x) = sin x, W<sub>f</sub> = [−1; 1], Periode 2π", quantities: "x im Bogenmaß" },
  ],
  quiz: {
    question: "Welche Eigenschaft hat der Graph von f(x) = 2ˣ?",
    options: [
      "Er liegt ganz oberhalb der x-Achse, und die x-Achse ist für x → −∞ Asymptote.",
      "Er ist punktsymmetrisch zum Ursprung.",
      "Er schneidet die x-Achse im Punkt (0 | 0).",
    ],
    correctIndex: 0,
    explanation: "2ˣ ist für jedes x positiv, also gibt es keine Nullstelle; f(0) = 1. Für x → −∞ wird 2ˣ beliebig klein, bleibt aber positiv. Wegen 2⁻ˣ ≠ ±2ˣ ist der Graph nicht symmetrisch.",
  },
  lab: {
    kind: "function-types",
    title: "Labor: Funktionstypen vergleichen",
    intro: "Wähle einen Funktionstyp und den Faktor a. Ziehe den Punkt P über den Graphen und vergleiche die Eigenschaften unten.",
    params: [
      { type: "choice", key: "type", label: "Funktionstyp", value: 0, options: FUNCTION_TYPES.map((t, i) => ({ value: i, label: `${t.name}: a · ${t.base}` })) },
      { type: "range", key: "a", label: "Faktor a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -4, max: 4, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "term", label: "Funktionsterm", emphasis: true, compute: (v) => `f(x) = ${typeTerm(v.type, v.a)}` },
      { key: "D", label: "Definitionsmenge", compute: (v) => `D_f = ${typeDomain(v.type)}` },
      { key: "W", label: "Wertemenge", compute: (v) => `W_f = ${typeRange(v.type, v.a)}` },
      { key: "sym", label: "Symmetrie", compute: (v) => SYMMETRY_TEXT[typeSymmetry(v.type, v.a)] },
      {
        key: "mono",
        label: "Monotonie auf D_f",
        compute: (v) => {
          const m = typeMonotony(v.type, v.a);
          return m === "steigt" ? "streng monoton steigend" : m === "fällt" ? "streng monoton fallend" : m === "konstant" ? "konstant" : "nicht streng monoton";
        },
      },
      { key: "rand", label: "für x → −∞ und x → +∞", compute: (v) => `${typeLimit(v.type, v.a, -1)} und ${typeLimit(v.type, v.a, 1)}` },
      {
        key: "P",
        label: "Punkt P",
        compute: (v) => {
          const y = typeValue(v.type, v.a, v.x0);
          return Number.isFinite(y) ? `P(${fmt(v.x0)} | ${fmt(y)})` : "x = 0 gehört nicht zu D_f";
        },
      },
    ],
    goals: [
      {
        id: "punkt-fallend",
        text: "Stelle eine Funktion ein, deren Graph punktsymmetrisch zum Ursprung ist und die auf ganz ℝ streng monoton fällt.",
        check: (v) => (v.type === 0 || v.type === 2) && typeSymmetry(v.type, v.a) === "punkt" && typeMonotony(v.type, v.a) === "fällt",
      },
      {
        id: "asymptote",
        text: "Zeige eine Funktion, deren Graph ganz oberhalb der x-Achse liegt und für x → −∞ die x-Achse als Asymptote hat.",
        check: (v) => v.type === 4 && v.a > 0,
      },
      {
        id: "periodisch",
        text: "Stelle eine periodische Funktion mit der Wertemenge [−2; 2] ein und ziehe P auf einen Hochpunkt im Bild.",
        check: (v) => v.type === 5 && Math.abs(v.a) === 2 && typeValue(v.type, v.a, v.x0) > 1.98,
      },
    ],
  },
  exercises: [
    { id: "steckbrief", make: steckbrief },
    { id: "punkt-parameter", make: punktParameter },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst jetzt zu jedem Funktionstyp ein typisches Beispiel und seine Eigenschaften.",
};

// 1.2 Grenzverhalten für x → ±∞ ──────────────────────────────────────────────

const BEHAVIOUR = ["konvergent", "divergent, f(x) → +∞", "divergent, f(x) → −∞", "divergent, f(x) hat keinen Grenzwert"];

interface LimitSide {
  kind: number;
  limit?: number;
  why: string;
}

interface LimitCase {
  term: string;
  /** Behaviour for x → +∞. */
  plus: LimitSide;
  /** Behaviour for x → −∞. */
  minus: LimitSide;
}

const converges = (limit: number, why: string): LimitSide => ({ kind: 0, limit, why });
const towards = (sign: number, why: string): LimitSide => ({ kind: sign > 0 ? 1 : 2, why });

function limitCase(rng: Rng, level: 1 | 2): LimitCase {
  const a = nonZero(rng, 4);
  const b = nonZero(rng, 6);
  const kinds = level === 1 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
  const k = rng.pick(kinds);
  switch (k) {
    case 0:
      return {
        term: `${fmt(a)}${b > 0 ? " + " : " − "}${Math.abs(b)}/x`,
        plus: converges(a, `x → +∞: ${Math.abs(b)}/x → 0, also f(x) → ${fmt(a)}.`),
        minus: converges(a, `x → −∞: ${Math.abs(b)}/x → 0 ebenso, also f(x) → ${fmt(a)}.`),
      };
    case 1:
      return {
        term: `${fmt(a)}${b > 0 ? " + " : " − "}${Math.abs(b)} · 0,5ˣ`,
        plus: converges(a, `x → +∞: 0,5ˣ → 0, also f(x) → ${fmt(a)}.`),
        minus: towards(b, `x → −∞: 0,5ˣ = 2⁻ˣ → +∞, der Faktor ${b > 0 ? "" : "−"}${Math.abs(b)} gibt f(x) → ${b > 0 ? "+" : "−"}∞.`),
      };
    case 2: {
      const s = rng.sign();
      const lead = `${s > 0 ? "" : "−"}x³`;
      return {
        term: `${lead}${plus(b)}x`,
        plus: towards(s, `x → +∞: Der Summand ${lead} bestimmt das Verhalten, f(x) → ${s > 0 ? "+" : "−"}∞.`),
        minus: towards(-s, `x → −∞: x³ → −∞, also ${lead} → ${s > 0 ? "−" : "+"}∞ und f(x) ebenso.`),
      };
    }
    case 3:
      return {
        term: `${fmt(a)} · 2ˣ`,
        plus: towards(a, `x → +∞: 2ˣ → +∞, das Vorzeichen von ${fmt(a)} entscheidet.`),
        minus: converges(0, `x → −∞: 2ˣ → 0, also f(x) → 0.`),
      };
    case 4: {
      const both: LimitSide = { kind: 3, why: "sin x pendelt für x → +∞ wie für x → −∞ immer wieder zwischen −1 und 1." };
      return { term: `${fmt(Math.abs(a))} · sin x`, plus: both, minus: both };
    }
    case 5: {
      // (p x + q) / x = p + q/x after dividing by x.
      const p = nonZero(rng, 5);
      const q = nonZero(rng, 9);
      const why = `Termumformung: (${fmt(p)}x${plus(q)}) / x = ${fmt(p)}${plus(q)}/x, und ${Math.abs(q)}/x → 0 für x → ±∞.`;
      return { term: `(${fmt(p)}x${plus(q)}) / x`, plus: converges(p, why), minus: converges(p, `Für x → −∞ ebenso: f(x) → ${fmt(p)}.`) };
    }
    case 6: {
      const p = nonZero(rng, 4);
      const q = rng.int(2, 9);
      const why = `Termumformung: = ${fmt(p)} + ${q}/x², und ${q}/x² → 0 für x → ±∞.`;
      return { term: `(${fmt(p)}x² + ${q}) / x²`, plus: converges(p, why), minus: converges(p, `Für x → −∞ ebenso: f(x) → ${fmt(p)}.`) };
    }
    case 7: {
      const c = rng.int(2, 6);
      return {
        term: `${c} − 2⁻ˣ`,
        plus: converges(c, `x → +∞: 2⁻ˣ = 0,5ˣ → 0, also f(x) → ${c}.`),
        minus: towards(-1, "x → −∞: 2⁻ˣ → +∞, also f(x) → −∞."),
      };
    }
    case 8: {
      const c = nonZero(rng, 5);
      const why = "Der Summand 0,1x² mit positivem Faktor bestimmt das Verhalten; x² ist auch für negative x positiv.";
      return { term: `0,1x²${plus(c * 10)}x`, plus: towards(1, `x → +∞: ${why} f(x) → +∞.`), minus: towards(1, "x → −∞: ebenso f(x) → +∞.") };
    }
    default: {
      const both: LimitSide = { kind: 3, why: "Die Ausschläge von x · sin x werden in beide Richtungen immer größer, abwechselnd positiv und negativ." };
      return { term: "x · sin x", plus: both, minus: both };
    }
  }
}

function limitResult(side: LimitSide, arrow: string): string {
  return `${BEHAVIOUR[side.kind]}${side.kind === 0 ? `: lim<sub>x→${arrow}</sub> f(x) = ${fmt(side.limit!)}` : ""}`;
}

function grenzwertAblesen(rng: Rng, level: 1 | 2): ExerciseTask {
  const c = limitCase(rng, level);
  const fields: AnswerField[] = [choiceField("Verhalten für x → +∞", BEHAVIOUR, c.plus.kind)];
  if (c.plus.kind === 0) fields.push(numberField("lim<sub>x→+∞</sub> f(x) =", c.plus.limit!, "", 2));
  fields.push(choiceField("Verhalten für x → −∞", BEHAVIOUR, c.minus.kind));
  if (c.minus.kind === 0) fields.push(numberField("lim<sub>x→−∞</sub> f(x) =", c.minus.limit!, "", 2));
  return {
    prompt: `Untersuche das Verhalten von <strong>f(x) = ${c.term}</strong> für x → +∞ und für x → −∞. Gib die Grenzwerte an, falls sie existieren.`,
    given: [`f(x) = ${c.term}`],
    formulaHint: level === 1 ? "1/x → 0 für x → ±∞; 0,5ˣ → 0 für x → +∞, aber 0,5ˣ → +∞ für x → −∞; 2ˣ → 0 für x → −∞; bei Polynomen entscheidet die höchste Potenz." : undefined,
    fields,
    steps: [
      c.plus.why,
      c.minus.why,
      `<strong>x → +∞: ${limitResult(c.plus, "+∞")}; x → −∞: ${limitResult(c.minus, "−∞")}</strong>`,
    ],
  };
}

function streifen(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const c = nonZero(rng, 4);
    const k = rng.pick([1, 2, 3, 4, 5, 6]);
    const eps = rng.pick([0.1, 0.2, 0.25, 0.5]);
    const x0 = k / eps;
    return {
      prompt: `Der Graph von f(x) = ${fmt(c)} + ${k}/x nähert sich für x → +∞ der Geraden y = ${fmt(c)}. Ab welcher Stelle x₀ verlässt er den Streifen zwischen y = ${fmt(c - eps)} und y = ${fmt(c + eps)} nicht mehr?`,
      given: [`f(x) = ${fmt(c)} + ${k}/x`, `ε = ${fmt(eps)}`],
      formulaHint: `|f(x) − ${paren(c)}| = ${k}/x ≤ ${fmt(eps)} ⇔ x ≥ ${k} : ${fmt(eps)}`,
      fields: [numberField("x₀ =", x0, "", 2, { slips: [{ value: k * eps, hint: "Umgekehrt: Aus k/x ≤ ε folgt x ≥ k : ε, nicht k · ε." }] })],
      steps: [`Bedingung: ${k}/x ≤ ${fmt(eps)} (für x &gt; 0)`, `x ≥ ${k} : ${fmt(eps)} = ${fmt(x0)}`, `<strong>x₀ = ${fmt(x0)}</strong>`],
      meta: { c, k, eps },
    };
  }
  const L = rng.pick([2, 4, 5, 8]);
  const tol = rng.pick([0.1, 0.05, 0.2]);
  const t0 = Math.log2(L / tol);
  return {
    prompt: `Nach der Einnahme eines Medikaments wird die Konzentration im Blut durch c(t) = ${L} − ${L} · 0,5<sup>t</sup> (t in Stunden, c in mg/l) beschrieben. Gegen welchen Wert strebt c(t) für t → +∞, und ab welchem Zeitpunkt weicht c(t) um höchstens ${fmt(tol)} mg/l von diesem Wert ab?`,
    given: [`c(t) = ${L} − ${L} · 0,5<sup>t</sup>`, `zulässige Abweichung: ${fmt(tol)} mg/l`],
    fields: [
      numberField("Grenzwert:", L, "mg/l", 2),
      numberField("ab t ≈", t0, "h", 2, { slips: [{ value: L / tol, hint: "Die Abweichung ist " + L + " · 0,5ᵗ, nicht " + L + "/t: Löse mit dem Logarithmus." }] }),
    ],
    steps: [
      `0,5<sup>t</sup> → 0, also c(t) → ${L} mg/l.`,
      `Abweichung: ${L} · 0,5<sup>t</sup> ≤ ${fmt(tol)} ⇔ 2<sup>t</sup> ≥ ${fmt(L / tol)} ⇔ t ≥ log₂(${fmt(L / tol)})`,
      `<strong>Grenzwert ${L} mg/l; ab t ≈ ${fmt(t0)} h</strong>`,
    ],
  };
}

const grenzverhalten: Lesson = {
  id: "fk-2-grenzverhalten",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Grenzverhalten im Unendlichen",
  subtitle: "Konvergenz, Divergenz und der Streifen um den Grenzwert",
  lehrplan: `${LEHRPLAN}, Grenzverhalten für x → ±∞, Konvergenz und Divergenz`,
  whyItMatters:
    "Wie sich eine Größe auf lange Sicht entwickelt, ist oft die wichtigste Frage an ein Modell: Pendelt sich eine Konzentration ein, wächst eine Population über alle Grenzen? Der Grenzwert beantwortet das, ohne dass du unendlich lange rechnen musst.",
  explanationHtml: `
    <p>Nähert sich der Graph von f für x → +∞ einer waagrechten Geraden y = a beliebig genau an, so heißt f <strong>konvergent</strong> für x → +∞ mit dem <strong>Grenzwert</strong> a. Man schreibt</p>
    <p class="formula-line">lim<sub>x→+∞</sub> f(x) = a.</p>
    <p>Anschaulich: Lege um die Gerade y = a einen <strong>Streifen</strong> der Breite 2ε, also zwischen y = a − ε und y = a + ε. Ist f konvergent gegen a, so gibt es zu <strong>jedem noch so schmalen</strong> Streifen eine Stelle x₀, ab der der Graph den Streifen nicht mehr verlässt. Je schmaler der Streifen, desto weiter rechts liegt x₀ in der Regel.</p>
    <p>Gibt es keinen solchen Grenzwert, heißt f <strong>divergent</strong>. Das kann zwei Gründe haben: f(x) wächst über alle Grenzen (lim<sub>x→+∞</sub> f(x) = +∞, ebenso −∞), oder f(x) schwankt immer weiter, wie sin x. Für x → −∞ gilt alles entsprechend.</p>
    <p>Wichtige Bausteine: 1/x → 0, 1/x² → 0 und 0,5ˣ → 0 für x → +∞; 2ˣ → 0 für x → −∞. Bei Polynomen bestimmt der Summand mit der höchsten Potenz das Verhalten (Wiederholung aus M10). Oft hilft eine <strong>Termumformung</strong>: (2x + 3)/x = 2 + 3/x → 2.</p>
    <div class="example">f(x) = 2 + 3/x für x → +∞: 3/x → 0, also lim<sub>x→+∞</sub> f(x) = 2. Zum Streifen mit ε = 0,5: 3/x ≤ 0,5 ⇔ x ≥ 6. Ab x₀ = 6 bleibt der Graph zwischen y = 1,5 und y = 2,5. Für ε = 0,25 braucht man x₀ = 12. Für x → −∞ gilt ebenso 3/x → 0, also auch lim<sub>x→−∞</sub> f(x) = 2.<br>Die beiden Richtungen können sich unterscheiden: g(x) = 2ˣ ist für x → +∞ divergent (g(x) → +∞), aber lim<sub>x→−∞</sub> 2ˣ = 0.</div>
    <div class="merke"><strong>Merke:</strong> lim<sub>x→±∞</sub> f(x) = a bedeutet: Zu jedem ε &gt; 0 gibt es eine Stelle, ab der der Graph im Streifen a ± ε bleibt. Sonst ist f divergent: f(x) → ±∞ oder f(x) hat gar keinen Grenzwert.</div>
  `,
  formulas: [
    { name: "Grenzwertschreibweise", html: "lim<sub>x→+∞</sub> f(x) = a", quantities: "f konvergiert für x → +∞ gegen a; y = a ist waagrechte Asymptote" },
    { name: "Wichtige Grenzwerte", html: "1/xⁿ → 0, qˣ → 0 (0 &lt; q &lt; 1) für x → +∞", quantities: "n ∈ ℕ" },
  ],
  quiz: {
    question: "Die Funktion f(x) = 3 + sin x ist für x → +∞ …",
    options: [
      "divergent, weil f(x) immer zwischen 2 und 4 schwankt.",
      "konvergent mit dem Grenzwert 3.",
      "divergent mit lim f(x) = +∞.",
    ],
    correctIndex: 0,
    explanation: "Ein Streifen um y = 3 mit ε < 1 wird vom Graphen immer wieder verlassen. f bleibt zwar beschränkt, hat aber keinen Grenzwert; f wächst auch nicht über alle Grenzen.",
  },
  lab: {
    kind: "limit-strip",
    title: "Labor: Der Streifen um den Grenzwert",
    intro:
      "Lege mit der orangen Mittellinie und ε einen Streifen um eine Gerade y = c. Ziehe x₀ nach links, so weit es geht: Der Streifen wird grün, solange der Graph ab x₀ in ihm bleibt.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: LIMIT_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "c", label: "Mittellinie y = c", unit: "", min: -1, max: 4, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "eps", label: "halbe Streifenbreite ε", unit: "", min: 0.25, max: 2, step: 0.25, value: 1, digits: 2 },
      { type: "range", key: "x0", label: "Stelle x₀", unit: "", min: 0, max: 16, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "lim", label: "Verhalten für x → +∞", emphasis: true, compute: (v) => { const l = LIMIT_FUNCTIONS[v.fn].limit; return l === null ? (v.fn === 2 ? "divergent, f(x) → +∞" : "divergent, kein Grenzwert") : `lim f(x) = ${fmt(l)}`; } },
      { key: "limMinus", label: "Verhalten für x → −∞", compute: (v) => LIMIT_FUNCTIONS[v.fn].minus },
      { key: "strip", label: "Streifen", compute: (v) => `${fmt(v.c - v.eps)} ≤ y ≤ ${fmt(v.c + v.eps)}` },
      { key: "stays", label: "Graph bleibt ab x₀ im Streifen", compute: (v) => (staysInStrip(v.fn, v.c, v.eps, v.x0) ? "ja" : "nein") },
      { key: "min", label: "kleinstes passendes x₀", compute: (v) => { const m = smallestX0(v.fn, v.c, v.eps); return m === null ? "keines: der Graph verlässt jeden solchen Streifen" : `x₀ ${rel(m)} ${fmt(m)}`; } },
    ],
    goals: [
      {
        id: "streifen-05",
        text: "f(x) = 2 + 3/x: Lege den Streifen mit ε = 0,5 um den Grenzwert und ziehe x₀ auf die kleinste Stelle, ab der der Graph im Streifen bleibt.",
        check: (v) => v.fn === 0 && v.c === 2 && v.eps === 0.5 && staysInStrip(v.fn, v.c, v.eps, v.x0) && v.x0 <= 6,
      },
      {
        id: "streifen-025",
        text: "Halbiere den Streifen auf ε = 0,25: Wo liegt das kleinste x₀ jetzt?",
        check: (v) => v.fn === 0 && v.c === 2 && v.eps === 0.25 && staysInStrip(v.fn, v.c, v.eps, v.x0) && v.x0 <= 12,
      },
      {
        id: "von-unten",
        text: "f(x) = 1 − 2 · 0,5ˣ nähert sich ihrem Grenzwert von unten: Finde das kleinste x₀ für den Streifen mit ε = 0,25 um den Grenzwert.",
        check: (v) => v.fn === 1 && v.c === 1 && v.eps === 0.25 && staysInStrip(v.fn, v.c, v.eps, v.x0) && v.x0 <= 3,
      },
    ],
  },
  exercises: [
    { id: "grenzwert-ablesen", make: grenzwertAblesen },
    { id: "streifen", make: streifen },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Konvergenz und Divergenz und kannst den Grenzwert mit dem Streifen erklären.",
};

// 1.3 Symmetrie rechnerisch prüfen ───────────────────────────────────────────

interface SymCase {
  term: string;
  minus: string;
  sym: number;
  at1: number;
}

function symCase(rng: Rng, level: 1 | 2): SymCase {
  if (level === 1) {
    const kind = rng.int(0, 2);
    const a = nonZero(rng, 3);
    const b = nonZero(rng, 4);
    const c = nonZero(rng, 5);
    if (kind === 0) {
      const p = [a, 0, b, 0, c];
      return { term: polyText(p), minus: `${polyText(p)} = f(x)`, sym: 0, at1: a + b + c };
    }
    if (kind === 1) {
      return { term: polyText([a, 0, b, 0]), minus: `${polyText([-a, 0, -b, 0])} = −f(x)`, sym: 1, at1: -a - b };
    }
    const p = [a, b, 0, c];
    return { term: polyText(p), minus: `${polyText([-a, b, 0, c])}, weder f(x) noch −f(x)`, sym: 2, at1: -a + b + c };
  }
  const k = rng.int(1, 5);
  const cases: SymCase[] = [
    { term: `x / (x² + ${k})`, minus: `−x / (x² + ${k}) = −f(x)`, sym: 1, at1: -1 / (1 + k) },
    { term: "x · sin x", minus: "(−x) · sin(−x) = (−x) · (−sin x) = f(x)", sym: 0, at1: Math.sin(1) },
    { term: "2ˣ + 2⁻ˣ", minus: "2⁻ˣ + 2ˣ = f(x)", sym: 0, at1: 2.5 },
    { term: `x² + ${k} · sin x`, minus: `x² − ${k} · sin x, weder f(x) noch −f(x)`, sym: 2, at1: 1 - k * Math.sin(1) },
    { term: `(x³ − ${k}x) / (x² + 1)`, minus: `(−x³ + ${k}x) / (x² + 1) = −f(x)`, sym: 1, at1: -(1 - k) / 2 },
    { term: `${k} / (x² + 1)`, minus: `${k} / (x² + 1) = f(x)`, sym: 0, at1: k / 2 },
  ];
  return rng.pick(cases);
}

function fVonMinusX(rng: Rng, level: 1 | 2): ExerciseTask {
  const c = symCase(rng, level);
  return {
    prompt: `Prüfe rechnerisch, ob der Graph von <strong>f(x) = ${c.term}</strong> achsensymmetrisch zur y-Achse oder punktsymmetrisch zum Ursprung ist, und berechne f(−1).`,
    given: [`f(x) = ${c.term}`, "D<sub>f</sub> = ℝ"],
    formulaHint: level === 1 ? "f(−x) = f(x) für alle x: achsensymmetrisch; f(−x) = −f(x) für alle x: punktsymmetrisch" : undefined,
    fields: [choiceField("Symmetrie", SYM_OPTIONS, c.sym), numberField("f(−1) =", c.at1, "", 2)],
    steps: [`f(−x) = ${c.minus}`, `<strong>${SYM_OPTIONS[c.sym]}; f(−1) ${rel(c.at1)} ${fmt(c.at1)}</strong>`],
  };
}

function symParameter(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const k = nonZero(rng, 5);
    const b = rng.int(1, 5);
    const c = nonZero(rng, 6);
    return {
      prompt: `Für welchen Wert von k ist der Graph von f(x) = x⁴ + (k ${k > 0 ? "−" : "+"} ${Math.abs(k)})x³ + ${b}x²${plus(c)} achsensymmetrisch zur y-Achse?`,
      given: [`f(x) = x⁴ + (k ${k > 0 ? "−" : "+"} ${Math.abs(k)})x³ + ${b}x²${plus(c)}`],
      formulaHint: "Achsensymmetrie bei ganzrationalen Funktionen: Es dürfen nur gerade Potenzen von x vorkommen.",
      fields: [numberField("k =", k, "", 2, { slips: [{ value: -k, hint: "Der Faktor vor x³ muss 0 sein: Löse die Klammer = 0 nach k auf." }] })],
      steps: [`Der Summand mit x³ muss wegfallen: k ${k > 0 ? "−" : "+"} ${Math.abs(k)} = 0`, `<strong>k = ${fmt(k)}</strong>`],
    };
  }
  const t = nonZero(rng, 4);
  const p = rng.pick([0.5, 1.5, 2, 2.5]);
  const fp = rng.pick([1.2, 2.4, 3.6, -1.8, -0.6]);
  return {
    prompt: `Die Funktion f(x) = x³ + (2t ${t > 0 ? "−" : "+"} ${Math.abs(2 * t)})x² − 5x hat für genau einen Wert von t einen Graphen, der punktsymmetrisch zum Ursprung ist. Bestimme t. Für eine andere Funktion g, deren Graph punktsymmetrisch zum Ursprung ist, ist g(${fmt(p)}) = ${fmt(fp)} bekannt. Gib g(${fmt(-p)}) an.`,
    given: [`f(x) = x³ + (2t ${t > 0 ? "−" : "+"} ${Math.abs(2 * t)})x² − 5x`, `g(${fmt(p)}) = ${fmt(fp)}`],
    fields: [
      numberField("t =", t, "", 2),
      numberField(`g(${fmt(-p)}) =`, -fp, "", 2, { slips: [{ value: fp, hint: "Punktsymmetrie zum Ursprung: g(−x) = −g(x), das Vorzeichen dreht sich um." }] }),
    ],
    steps: [
      `Punktsymmetrie zum Ursprung: nur ungerade Potenzen, also 2t ${t > 0 ? "−" : "+"} ${Math.abs(2 * t)} = 0 ⇒ t = ${fmt(t)}.`,
      `g(${fmt(-p)}) = −g(${fmt(p)}) = ${fmt(-fp)}`,
      `<strong>t = ${fmt(t)}; g(${fmt(-p)}) = ${fmt(-fp)}</strong>`,
    ],
  };
}

const symmetrie: Lesson = {
  id: "fk-3-symmetrie",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Symmetrie rechnerisch prüfen",
  subtitle: "f(−x) = f(x) oder f(−x) = −f(x)",
  lehrplan: `${LEHRPLAN}, Achsensymmetrie zur y-Achse und Punktsymmetrie zum Ursprung`,
  whyItMatters:
    "Symmetrie spart Arbeit: Kennst du den Graphen rechts von der y-Achse, kennst du ihn ganz. Bei ganzrationalen Funktionen siehst du sie an den Exponenten; für alle anderen Funktionen brauchst du die Rechnung mit f(−x).",
  explanationHtml: `
    <p>Der Graph von f ist</p>
    <ul>
      <li><strong>achsensymmetrisch zur y-Achse</strong>, wenn für alle x ∈ D<sub>f</sub> gilt: <strong>f(−x) = f(x)</strong>. Der Punkt (−x | f(x)) liegt dann immer auf dem Graphen.</li>
      <li><strong>punktsymmetrisch zum Ursprung</strong>, wenn für alle x ∈ D<sub>f</sub> gilt: <strong>f(−x) = −f(x)</strong>. Der Punkt (−x | −f(x)) liegt dann immer auf dem Graphen.</li>
    </ul>
    <p>Dazu muss D<sub>f</sub> symmetrisch zu 0 sein. Du ersetzt im Term jedes x durch (−x), vereinfachst und vergleichst mit f(x). Dabei helfen (−x)² = x², (−x)³ = −x³, sin(−x) = −sin x und cos(−x) = cos x.</p>
    <p>Bei ganzrationalen Funktionen genügt ein Blick auf die Exponenten (Wiederholung aus M10): nur gerade Potenzen (auch das Absolutglied) ⇒ achsensymmetrisch, nur ungerade Potenzen ⇒ punktsymmetrisch. Achtung: Ein einzelnes Punktepaar mit f(−p) = f(p) beweist noch keine Symmetrie, die Gleichung muss für <strong>alle</strong> x gelten.</p>
    <div class="example">f(x) = x / (x² + 1): f(−x) = (−x) / ((−x)² + 1) = −x / (x² + 1) = −f(x). Der Graph ist punktsymmetrisch zum Ursprung.<br>g(x) = 2ˣ + 2⁻ˣ: g(−x) = 2⁻ˣ + 2ˣ = g(x). Der Graph ist achsensymmetrisch zur y-Achse.</div>
    <div class="merke"><strong>Merke:</strong> Achsensymmetrie zur y-Achse ⇔ f(−x) = f(x) für alle x ∈ D<sub>f</sub>. Punktsymmetrie zum Ursprung ⇔ f(−x) = −f(x) für alle x ∈ D<sub>f</sub>.</div>
  `,
  formulas: [
    { name: "Achsensymmetrie zur y-Achse", html: "f(−x) = f(x) für alle x ∈ D<sub>f</sub>", quantities: "Ganzrational: nur gerade Exponenten" },
    { name: "Punktsymmetrie zum Ursprung", html: "f(−x) = −f(x) für alle x ∈ D<sub>f</sub>", quantities: "Ganzrational: nur ungerade Exponenten" },
  ],
  quiz: {
    question: "Für eine Funktion f gilt f(−2) = f(2) = 5. Was folgt daraus?",
    options: [
      "Noch nichts: Die Gleichung f(−x) = f(x) muss für alle x gelten.",
      "Der Graph ist achsensymmetrisch zur y-Achse.",
      "Der Graph ist punktsymmetrisch zum Ursprung.",
    ],
    correctIndex: 0,
    explanation: "Ein einzelnes Punktepaar kann zufällig symmetrisch liegen, z. B. bei f(x) = x³ − 4x + 5 für x = ±2. Symmetrie heißt f(−x) = f(x) für jedes x ∈ D_f.",
  },
  lab: {
    kind: "symmetry-check",
    title: "Labor: Spiegelpunkte prüfen",
    intro:
      "Stelle f(x) = ax³ + bx² + cx + d ein und ziehe den Probepunkt P. Die beiden orangen Punkte zeigen, wo der Spiegelpunkt an der y-Achse und am Ursprung läge; grün werden sie, wenn sie auf dem Graphen liegen.",
    params: [
      { type: "range", key: "a", label: "a (vor x³)", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b (vor x²)", unit: "", min: -2, max: 2, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "c", label: "c (vor x)", unit: "", min: -3, max: 3, step: 0.5, value: -1, digits: 1 },
      { type: "range", key: "d", label: "d (Absolutglied)", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "p", label: "Probestelle p", unit: "", min: 0.5, max: 3, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "term", label: "f(x)", emphasis: true, compute: (v) => `f(x) = ${polyText([v.a, v.b, v.c, v.d])}` },
      { key: "minus", label: "f(−x)", compute: (v) => `f(−x) = ${polyText([-v.a, v.b, -v.c, v.d])}` },
      { key: "pair", label: "f(p) und f(−p)", compute: (v) => `${fmt(symCubic(v, v.p))} und ${fmt(symCubic(v, -v.p))}` },
      { key: "sym", label: "Symmetrie des Graphen", compute: (v) => SYMMETRY_TEXT[symmetryOf(v)] },
    ],
    goals: [
      {
        id: "achse",
        text: "Mache den Graphen achsensymmetrisch zur y-Achse, ohne dass er eine Parallele zur x-Achse ist und ohne dass d = 0 ist.",
        check: (v) => symmetryOf(v) === "achse" && v.b !== 0 && v.d !== 0,
      },
      {
        id: "punkt",
        text: "Mache den Graphen punktsymmetrisch zum Ursprung, mit a ≠ 0 und c ≠ 0.",
        check: (v) => symmetryOf(v) === "punkt" && v.a !== 0 && v.c !== 0,
      },
      {
        id: "zufall",
        text: "Finde einen nicht achsensymmetrischen Graphen, bei dem trotzdem f(−p) = f(p) für deine Probestelle gilt.",
        check: (v) => Math.abs(symCubic(v, v.p) - symCubic(v, -v.p)) < 1e-9 && !(v.a === 0 && v.c === 0),
      },
    ],
  },
  exercises: [
    { id: "f-von-minus-x", make: fVonMinusX },
    { id: "sym-parameter", make: symParameter },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du prüfst Symmetrie jetzt rechnerisch, auch bei Funktionen, die keine Polynome sind.",
};

// 1.4 Verschieben, Strecken, Spiegeln ────────────────────────────────────────

function termAusBeschreibung(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const right = nonZero(rng, 4);
    const up = nonZero(rng, 4);
    const a = rng.pick([0.5, 2, 3, -1, -2, -0.5]);
    const c = -right;
    const d = up;
    const size = Math.abs(a);
    const stretch = size === 1 ? "" : `mit dem Faktor ${fmt(size)} in y-Richtung ${size > 1 ? "gestreckt" : "gestaucht"}`;
    const aText = a < 0 ? `${stretch}${stretch ? " und " : ""}an der x-Achse gespiegelt` : stretch;
    return {
      prompt: `Der Graph von f(x) = x² wird zuerst ${aText}, dann um ${Math.abs(right)} nach ${right > 0 ? "rechts" : "links"} und um ${Math.abs(up)} nach ${up > 0 ? "oben" : "unten"} verschoben. Gib a, c und d in g(x) = a · (x + c)² + d an.`,
      given: [`f(x) = x²`, "g(x) = a · (x + c)² + d"],
      formulaHint: "g(x) = a · f(x + c) + d: c &gt; 0 verschiebt nach links, c &lt; 0 nach rechts; d verschiebt nach oben.",
      fields: [
        numberField("a =", a, "", 2),
        numberField("c =", c, "", 2, { slips: [{ value: -c, hint: `Nach ${right > 0 ? "rechts" : "links"} heißt im Term x ${right > 0 ? "−" : "+"} ${Math.abs(right)}: c = ${fmt(c)}.` }] }),
        numberField("d =", d, "", 2),
      ],
      steps: [
        `Streckung und Spiegelung: Faktor a = ${fmt(a)} vor dem Term.`,
        `Verschiebung um ${Math.abs(right)} nach ${right > 0 ? "rechts" : "links"}: x durch x ${right > 0 ? "−" : "+"} ${Math.abs(right)} ersetzen, also c = ${fmt(c)}; um ${Math.abs(up)} nach ${up > 0 ? "oben" : "unten"}: d = ${fmt(d)}.`,
        `<strong>g(x) = ${transformTerm({ base: 0, a, b: 1, c, d })}</strong>`,
      ],
    };
  }
  const asym = nonZero(rng, 5);
  const y0 = asym - rng.pick([1, 2, 3, 4]);
  const a = y0 - asym;
  return {
    prompt: `Der Graph einer Funktion g entsteht aus dem Graphen von f(x) = 2ˣ durch Strecken in y-Richtung, Spiegeln an der x-Achse und Verschieben in y-Richtung, also g(x) = a · 2ˣ + d. Er hat die waagrechte Asymptote y = ${fmt(asym)} und schneidet die y-Achse im Punkt (0 | ${fmt(y0)}). Bestimme a und d.`,
    given: [`Asymptote y = ${fmt(asym)}`, `S<sub>y</sub>(0 | ${fmt(y0)})`],
    fields: [
      numberField("a =", a, "", 2, { slips: [{ value: -a, hint: "Der Graph liegt unter der Asymptote, er ist also an der x-Achse gespiegelt: a &lt; 0." }] }),
      numberField("d =", asym, "", 2),
    ],
    steps: [
      `a · 2ˣ → 0 für x → −∞, also ist y = d die Asymptote: d = ${fmt(asym)}.`,
      `g(0) = a · 1 + d = ${fmt(y0)} ⇒ a = ${fmt(y0)} − ${fmt(asym).replace(MINUS_RE, "(−$1)")} = ${fmt(a)}`,
      `<strong>g(x) = ${fmt(a)} · 2ˣ${plus(asym)}</strong>`,
    ],
  };
}


function punktAbbilden(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const p = rng.pick([-2, -1, 1, 2, 3]);
    const a = rng.pick([2, 3, -1, -2, 0.5]);
    const b = rng.pick([1, 2, -1, 0.5]);
    const c = nonZero(rng, 3);
    const d = nonZero(rng, 4);
    const x1 = p / b - c;
    const y1 = a * p * p + d;
    const g = transformTerm({ base: 0, a, b, c, d });
    return {
      prompt: `Der Punkt P(${fmt(p)} | ${fmt(p * p)}) liegt auf der Normalparabel f(x) = x². Auf welchen Punkt P' des Graphen von g(x) = ${g} wird er abgebildet?`,
      given: [`g(x) = a · f(b · (x + c)) + d mit a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}, d = ${fmt(d)}`],
      formulaHint: "x-Koordinate: b · (x' + c) = p ⇒ x' = p : b − c; y-Koordinate: y' = a · f(p) + d",
      fields: [numberField("x' =", x1, "", 2), numberField("y' =", y1, "", 2)],
      steps: [`x' = ${fmt(p)} : ${fmt(b).replace(MINUS_RE, "(−$1)")} − ${fmt(c).replace(MINUS_RE, "(−$1)")} = ${fmt(x1)}`, `y' = ${fmt(a)} · ${fmt(p * p)}${plus(d)} = ${fmt(y1)}`, `<strong>P'(${fmt(x1)} | ${fmt(y1)})</strong>`],
    };
  }
  const a = rng.pick([1.5, 2, 3, 0.5]);
  const b = rng.pick([0.5, 2, 4, 0.25]);
  const c = nonZero(rng, 2);
  const d = nonZero(rng, 3);
  const period = (2 * Math.PI) / b;
  return {
    prompt: `Ein Pendel schwingt so, dass seine Auslenkung durch g(x) = ${transformTerm({ base: 2, a, b, c, d })} beschrieben wird. Der Graph entsteht aus dem von f(x) = sin x. Gib die Periode und den größten Funktionswert von g an.`,
    given: [`g(x) = ${transformTerm({ base: 2, a, b, c, d })}`],
    fields: [
      numberField("Periode p ≈", period, "", 2, { slips: [{ value: 2 * Math.PI * b, hint: "Streckung in x-Richtung mit Faktor 1 : b, also p = 2π : b." }] }),
      numberField("größter Wert:", a + d, "", 2),
    ],
    steps: [`Der Faktor b = ${fmt(b)} streckt in x-Richtung mit 1 : b: p = 2π : ${fmt(b)} ${rel(period)} ${fmt(period)}.`, `sin pendelt zwischen −1 und 1, also g zwischen ${fmt(-a + d)} und ${fmt(a + d)}.`, `<strong>p ≈ ${fmt(period)}; größter Wert ${fmt(a + d)}</strong>`],
  };
}

const transformationen: Lesson = {
  id: "fk-4-transformationen",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Verschieben, Strecken, Spiegeln",
  subtitle: "Was eine Änderung am Term mit dem Graphen macht",
  lehrplan: `${LEHRPLAN}, Verschiebung, Streckung und Spiegelung von Graphen`,
  whyItMatters:
    "Mit wenigen Grundgraphen und vier Arten von Änderungen kannst du sehr viele Funktionen skizzieren, ohne eine Wertetabelle zu rechnen. Umgekehrt liest du aus einem Graphen ab, wie sein Term aussehen muss.",
  explanationHtml: `
    <p>Aus dem Graphen von f entsteht der Graph von <strong>g(x) = a · f(b · (x + c)) + d</strong> (diese Form kennst du von der Sinusfunktion aus M10). Jeder Parameter hat eine eigene Wirkung:</p>
    <ul>
      <li><strong>d:</strong> Verschiebung um d in y-Richtung (d &gt; 0 nach oben).</li>
      <li><strong>c:</strong> Verschiebung um c in x-Richtung, aber gegen das Vorzeichen: x + 2 verschiebt um 2 nach <strong>links</strong>, x − 2 um 2 nach rechts.</li>
      <li><strong>a:</strong> Streckung in y-Richtung mit dem Faktor |a|; bei a &lt; 0 zusätzlich Spiegelung an der <strong>x-Achse</strong>.</li>
      <li><strong>b:</strong> Streckung in x-Richtung mit dem Faktor 1/|b| (b = 2 staucht auf die halbe Breite); bei b &lt; 0 zusätzlich Spiegelung an der <strong>y-Achse</strong>.</li>
    </ul>
    <p>Merkregel: Was <strong>außen</strong> am Term passiert (a, d), wirkt in y-Richtung so, wie es dasteht. Was <strong>innen</strong> am x passiert (b, c), wirkt in x-Richtung umgekehrt. Mit einer Mathematiksoftware kannst du die Parameter als Schieberegler anlegen und die Wirkung beobachten, wie hier im Labor.</p>
    <div class="example">Aus f(x) = 2ˣ wird g(x) = −2ˣ + 3: an der x-Achse gespiegelt und um 3 nach oben verschoben. Die Asymptote y = 0 wandert nach y = 3, der Punkt (0 | 1) nach (0 | 2), und der Graph liegt jetzt unterhalb von y = 3.</div>
    <div class="merke"><strong>Merke:</strong> g(x) = a · f(b · (x + c)) + d. Außen (a, d): y-Richtung, wie es dasteht. Innen (b, c): x-Richtung, umgekehrt. a &lt; 0 spiegelt an der x-Achse, b &lt; 0 an der y-Achse.</div>
  `,
  formulas: [
    { name: "Verschiebung", html: "g(x) = f(x + c) + d", quantities: "c > 0: nach links, c < 0: nach rechts; d > 0: nach oben" },
    { name: "Streckung und Spiegelung", html: "g(x) = a · f(b · x)", quantities: "Faktor |a| in y-Richtung, 1/|b| in x-Richtung; a < 0 Spiegelung an der x-Achse, b < 0 an der y-Achse" },
  ],
  quiz: {
    question: "Wie entsteht der Graph von g(x) = (x − 3)² aus der Normalparabel?",
    options: ["durch Verschieben um 3 nach rechts", "durch Verschieben um 3 nach links", "durch Verschieben um 3 nach unten"],
    correctIndex: 0,
    explanation: "Den Wert, den f bei x = 0 hat, erreicht g erst bei x = 3: Der Graph rückt nach rechts. Eine Änderung innen am x wirkt umgekehrt zum Vorzeichen.",
  },
  lab: {
    kind: "graph-transform",
    title: "Labor: Graphen verformen",
    intro:
      "Wähle einen Ausgangsgraphen (gestrichelt) und verändere a, b, c und d. Ziehe den blauen Bezugspunkt zum Verschieben und den orangen Formpunkt zum Strecken. Grün gepunktet siehst du das Ziel des passenden Laborauftrags.",
    params: [
      { type: "choice", key: "base", label: "Ausgangsfunktion", value: 0, options: [{ value: 0, label: "f(x) = x²" }, { value: 1, label: "f(x) = 2ˣ" }, { value: 2, label: "f(x) = sin x" }, { value: 3, label: "f(x) = x³" }] },
      { type: "range", key: "a", label: "a (Streckung in y-Richtung)", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b (Streckung in x-Richtung)", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "c", label: "c (Verschiebung in x-Richtung)", unit: "", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "d", label: "d (Verschiebung in y-Richtung)", unit: "", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "term", label: "g(x)", emphasis: true, compute: (v) => `g(x) = ${transformTerm(v)}` },
      { key: "shift", label: "Verschiebung", compute: (v) => `${v.c === 0 ? "keine" : `${fmt(Math.abs(v.c))} nach ${v.c > 0 ? "links" : "rechts"}`} in x-Richtung, ${v.d === 0 ? "keine" : `${fmt(Math.abs(v.d))} nach ${v.d > 0 ? "oben" : "unten"}`} in y-Richtung` },
      { key: "stretch", label: "Streckung", compute: (v) => (v.b === 0 ? "b = 0: g ist konstant" : `Faktor ${fmt(Math.abs(v.a))} in y-Richtung, Faktor ${fmt(1 / Math.abs(v.b))} in x-Richtung`) },
      { key: "mirror", label: "Spiegelung", compute: (v) => [v.a < 0 ? "an der x-Achse" : "", v.b < 0 ? "an der y-Achse" : ""].filter(Boolean).join(" und ") || "keine" },
    ],
    goals: [
      { id: "verschieben", text: "Verschiebe die Normalparabel so, dass ihr Scheitel im Punkt (2 | −1) liegt.", check: (v) => matchesTarget(v, 0) },
      { id: "spiegeln", text: "Spiegle den Graphen von f(x) = 2ˣ an der y-Achse.", check: (v) => matchesTarget(v, 1) },
      { id: "sinus", text: "Strecke die Sinuskurve in x- und in y-Richtung jeweils mit dem Faktor 2.", check: (v) => matchesTarget(v, 2) },
    ],
  },
  exercises: [
    { id: "term-aus-beschreibung", make: termAusBeschreibung },
    { id: "punkt-abbilden", make: punktAbbilden },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du siehst einem Term jetzt an, wie sein Graph aus einem Grundgraphen entsteht.",
};

// 1.5 Transformationen kombinieren ───────────────────────────────────────────

function reihenfolgeTerm(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const k = rng.pick([2, 3, 4, 0.5]);
    const s = nonZero(rng, 4);
    const stretchFirst = rng.next() < 0.5;
    const shift = stretchFirst ? s : k * s;
    const order = stretchFirst
      ? `zuerst mit dem Faktor ${fmt(k)} in y-Richtung ${k > 1 ? "gestreckt" : "gestaucht"} und dann um ${Math.abs(s)} nach ${s > 0 ? "oben" : "unten"} verschoben`
      : `zuerst um ${Math.abs(s)} nach ${s > 0 ? "oben" : "unten"} verschoben und dann mit dem Faktor ${fmt(k)} in y-Richtung ${k > 1 ? "gestreckt" : "gestaucht"}`;
    return {
      prompt: `Der Graph von f(x) = x² wird ${order}. Gib den Term des neuen Graphen in der Form g(x) = A · x² + B an.`,
      given: ["f(x) = x²"],
      formulaHint: "Jeder Schritt wirkt auf den ganzen bisherigen Term: Strecken multipliziert alles, auch eine schon vorhandene Verschiebung.",
      fields: [
        numberField("A =", k, "", 2),
        numberField("B =", shift, "", 2, { slips: [{ value: stretchFirst ? k * s : s, hint: "Achte auf die Reihenfolge: Wird erst verschoben und dann gestreckt, wird die Verschiebung mitgestreckt." }] }),
      ],
      steps: [
        stretchFirst ? `Strecken: ${fmt(k)}x², dann verschieben: ${fmt(k)}x²${plus(s)}` : `Verschieben: x²${plus(s)}, dann strecken: ${fmt(k)} · (x²${plus(s)})`,
        `<strong>g(x) = ${fmt(k)}x²${plus(shift)}</strong>`,
      ],
    };
  }
  const s = rng.pick([1, 2, 3]);
  const reflectFirst = rng.next() < 0.5;
  // Reflect at the y-axis, then shift right by s: 2^(−(x − s)); shift first: 2^(−x − s).
  const g0 = reflectFirst ? 2 ** s : 2 ** -s;
  return {
    prompt: `Der Graph von f(x) = 2ˣ wird ${reflectFirst ? `zuerst an der y-Achse gespiegelt und dann um ${s} nach rechts verschoben` : `zuerst um ${s} nach rechts verschoben und dann an der y-Achse gespiegelt`}. Berechne den y-Achsenabschnitt g(0) des neuen Graphen. Ergibt die umgekehrte Reihenfolge denselben Graphen?`,
    given: ["f(x) = 2ˣ"],
    fields: [
      numberField("g(0) =", g0, "", 3, { slips: [{ value: reflectFirst ? 2 ** -s : 2 ** s, hint: "Das wäre die andere Reihenfolge. Ersetze Schritt für Schritt x im bisherigen Term." }] }),
      yesNo("gleicher Graph bei umgekehrter Reihenfolge?", false),
    ],
    steps: [
      reflectFirst
        ? `Spiegeln: 2⁻ˣ; dann x durch x − ${s} ersetzen: g(x) = 2^(−(x − ${s})) = 2^(${s} − x)`
        : `Verschieben: 2^(x − ${s}); dann x durch −x ersetzen: g(x) = 2^(−x − ${s})`,
      `g(0) = ${fmt(g0, 3)}; in der anderen Reihenfolge ergäbe sich ${fmt(reflectFirst ? 2 ** -s : 2 ** s, 3)}.`,
      `<strong>g(0) = ${fmt(g0, 3)}; nein, die Reihenfolge ändert den Graphen</strong>`,
    ],
  };
}

function zuordnen(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const k = rng.pick([2, 3]);
    const s = rng.pick([1, 2, 3]);
    const target = rng.next() < 0.5 ? 0 : 1;
    const options = [
      `erst um ${s} nach oben verschieben, dann mit ${k} in y-Richtung strecken`,
      `erst mit ${k} in y-Richtung strecken, dann um ${s} nach oben verschieben`,
      `erst um ${s} nach rechts verschieben, dann mit ${k} in y-Richtung strecken`,
    ];
    const termText = target === 0 ? `${k}(x² + ${s})` : `${k}x² + ${s}`;
    return {
      prompt: `Welche Reihenfolge der Schritte macht aus dem Graphen von f(x) = x² den Graphen von g(x) = ${termText}? Gib auch g(1) an.`,
      given: [`g(x) = ${termText}`],
      formulaHint: "Klammer außen: Die Streckung kam zuletzt und wirkt auf die Verschiebung mit.",
      fields: [choiceField("Reihenfolge", options, target), numberField("g(1) =", target === 0 ? k * (1 + s) : k + s, "", 2)],
      steps: [target === 0 ? `Die Klammer (x² + ${s}) zeigt: zuerst verschoben, dann alles gestreckt.` : `${k}x² wurde zuerst gebildet, danach + ${s}.`, `<strong>${options[target]}; g(1) = ${target === 0 ? k * (1 + s) : k + s}</strong>`],
    };
  }
  const a = rng.pick([-2, -1, -0.5, 2, 3]);
  const h = nonZero(rng, 3);
  const k = nonZero(rng, 4);
  const term2 = `${a === -1 ? "−" : fmt(a)}(x ${h > 0 ? "−" : "+"} ${Math.abs(h)})²${plus(k)}`;
  const options = [
    `strecken${a < 0 ? " und spiegeln" : ""}, dann um ${Math.abs(h)} nach ${h > 0 ? "rechts" : "links"} und um ${Math.abs(k)} nach ${k > 0 ? "oben" : "unten"} verschieben`,
    `um ${Math.abs(h)} nach ${h > 0 ? "links" : "rechts"} und um ${Math.abs(k)} nach ${k > 0 ? "oben" : "unten"} verschieben, dann strecken${a < 0 ? " und spiegeln" : ""}`,
    `um ${Math.abs(k)} nach ${k > 0 ? "oben" : "unten"} verschieben, dann strecken${a < 0 ? " und spiegeln" : ""}, dann um ${Math.abs(h)} nach ${h > 0 ? "rechts" : "links"} verschieben`,
  ];
  return {
    prompt: `Eine Parabel ist durch g(x) = ${term2} gegeben. Gib den Scheitel des Graphen an und entscheide, welche Abfolge von Schritten den Graphen aus der Normalparabel erzeugt.`,
    given: [`g(x) = ${term2}`],
    fields: [numberField("x<sub>S</sub> =", h, "", 2, { slips: [{ value: -h, hint: "Innen am x wirkt umgekehrt: (x − 2) verschiebt nach rechts, x_S = 2." }] }), numberField("y<sub>S</sub> =", k, "", 2), choiceField("Abfolge", options, 0)],
    steps: [
      `Scheitel der Normalparabel (0 | 0) wandert nach (${fmt(h)} | ${fmt(k)}).`,
      `Die dritte Abfolge streckt die Verschiebung ${plus(k)} mit; die zweite verschiebt in die falsche Richtung.`,
      `<strong>S(${fmt(h)} | ${fmt(k)}); ${options[0]}</strong>`,
    ],
  };
}

const reihenfolge: Lesson = {
  id: "fk-5-reihenfolge",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Transformationen kombinieren",
  subtitle: "Wann die Reihenfolge zählt, Terme und Graphen zuordnen",
  lehrplan: `${LEHRPLAN}, Kombination von Transformationen und Zuordnung von Termen zu Graphen`,
  whyItMatters:
    "Meist wird ein Graph in mehreren Schritten verändert. Ob du erst streckst und dann verschiebst oder umgekehrt, kann ein anderes Ergebnis geben. Wer das sieht, ordnet Terme und Graphen sicher zu.",
  explanationHtml: `
    <p>Werden mehrere Transformationen nacheinander ausgeführt, wirkt jede auf den <strong>ganzen bisherigen Term</strong>. Deshalb kann die Reihenfolge eine Rolle spielen:</p>
    <ul>
      <li>Erst um 2 nach oben verschieben, dann mit 2 in y-Richtung strecken: x² → x² + 2 → <strong>2(x² + 2) = 2x² + 4</strong>.</li>
      <li>Erst strecken, dann verschieben: x² → 2x² → <strong>2x² + 2</strong>.</li>
    </ul>
    <p>Die Streckung wirkt also auch auf eine schon vorhandene Verschiebung in derselben Richtung. Ebenso innen: Erst um 1 nach rechts verschieben, dann in x-Richtung mit 0,5 stauchen, gibt (2x − 1)²; umgekehrt (2(x − 1))² = (2x − 2)².</p>
    <p>Schritte, die in <strong>verschiedenen Richtungen</strong> wirken, sind vertauschbar: Eine Verschiebung nach rechts (innen) und eine Spiegelung an der x-Achse (außen) ergeben in beiden Reihenfolgen −(x − 1)².</p>
    <p>Beim <strong>Zuordnen</strong> von Termen zu Graphen prüfst du markante Punkte: Wo liegt der Scheitel, wo die Asymptote, welches Vorzeichen hat der Streckfaktor? Ein Term passt nur, wenn alle Merkmale stimmen.</p>
    <div class="example">g(x) = −2(x + 1)² + 3: Normalparabel mit 2 strecken und an der x-Achse spiegeln, um 1 nach links und um 3 nach oben verschieben, die Verschiebung nach oben zuletzt. Scheitel S(−1 | 3), nach unten geöffnet.</div>
    <div class="merke"><strong>Merke:</strong> Jeder Schritt wirkt auf den ganzen bisherigen Term. Strecken und Verschieben in derselben Richtung sind nicht vertauschbar; Schritte in verschiedenen Richtungen schon.</div>
  `,
  formulas: [
    { name: "Erst verschieben, dann strecken", html: "x² → x² + d → a(x² + d) = ax² + ad", quantities: "die Verschiebung wird mitgestreckt" },
    { name: "Erst strecken, dann verschieben", html: "x² → ax² → ax² + d", quantities: "die Verschiebung bleibt d" },
  ],
  quiz: {
    question: "Der Graph von f(x) = x² wird erst um 1 nach oben verschoben und dann an der x-Achse gespiegelt. Welcher Term entsteht?",
    options: ["−x² − 1", "−x² + 1", "−(x − 1)²"],
    correctIndex: 0,
    explanation: "Verschieben ergibt x² + 1; die Spiegelung an der x-Achse dreht das Vorzeichen des ganzen Terms: −(x² + 1) = −x² − 1. In umgekehrter Reihenfolge entstünde −x² + 1.",
  },
  lab: {
    kind: "transform-order",
    title: "Labor: Reihenfolge der Schritte",
    intro:
      "Wähle zwei Schritte und ziehe den Punkt P über den Ausgangsgraphen (gestrichelt). Die Pfeile zeigen, wohin P im ersten (orange) und im zweiten Schritt (blau) wandert.",
    params: [
      { type: "choice", key: "base", label: "Ausgangsgraph", value: 0, options: [{ value: 0, label: "f(x) = x²" }, { value: 1, label: "f(x) = x³" }] },
      { type: "choice", key: "t1", label: "1. Schritt", value: 0, options: STEPS.map((s, i) => ({ value: i, label: s })) },
      { type: "choice", key: "t2", label: "2. Schritt", value: 0, options: STEPS.map((s, i) => ({ value: i, label: s })) },
      { type: "range", key: "p", label: "x-Wert von P", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
    ],
    readouts: [
      { key: "term", label: "neuer Term", emphasis: true, compute: (v) => `y = ${chainTerm(v.base, chain(v.t1, v.t2))}` },
      { key: "swapped", label: "in umgekehrter Reihenfolge", compute: (v) => `y = ${chainTerm(v.base, chain(v.t2, v.t1))}` },
      {
        key: "same",
        label: "Reihenfolge egal?",
        compute: (v) => (sameGraph(chainFunction(v.base, chain(v.t1, v.t2)), chainFunction(v.base, chain(v.t2, v.t1))) ? "ja, beide Reihenfolgen geben denselben Graphen" : "nein, die Graphen unterscheiden sich"),
      },
    ],
    goals: [
      { id: "erst-verschieben", text: "Erzeuge aus y = x² den Graphen von y = 2x² + 4.", check: (v) => v.base === 0 && sameGraph(chainFunction(0, chain(v.t1, v.t2)), ORDER_TARGETS[0]) },
      { id: "erst-strecken", text: "Erzeuge mit denselben beiden Schritten den Graphen von y = 2x² + 2.", check: (v) => v.base === 0 && sameGraph(chainFunction(0, chain(v.t1, v.t2)), ORDER_TARGETS[1]) },
      {
        id: "vertauschbar",
        text: "Erzeuge y = −(x − 1)², und prüfe: Hier ist die Reihenfolge egal.",
        check: (v) => v.base === 0 && sameGraph(chainFunction(0, chain(v.t1, v.t2)), ORDER_TARGETS[2]),
      },
    ],
  },
  exercises: [
    { id: "reihenfolge-term", make: reihenfolgeTerm },
    { id: "zuordnen", make: zuordnen },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt jetzt, wann die Reihenfolge der Schritte zählt, und ordnest Terme ihren Graphen zu.",
};

// 1.6 Stetigkeit ─────────────────────────────────────────────────────────────

function parameterStetig(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const x0 = rng.pick([1, 2, 3, -1]);
    const m = nonZero(rng, 3);
    const q = nonZero(rng, 4);
    const right = x0 * x0 + q;
    const k = right - m * x0;
    return {
      prompt: `Gegeben ist f(x) = ${fmt(m)}x + k für x ≤ ${fmt(x0)} und f(x) = x²${plus(q)} für x &gt; ${fmt(x0)}. Für welchen Wert von k ist f an der Stelle ${fmt(x0)} stetig?`,
      given: [`linker Teil: ${fmt(m)}x + k`, `rechter Teil: x²${plus(q)}`],
      formulaHint: `Stetig bei x₀: Beide Teile haben an der Stelle ${fmt(x0)} denselben Wert, ${fmt(m)} · ${fmt(x0).replace(MINUS_RE, "(−$1)")} + k = ${fmt(x0).replace(MINUS_RE, "(−$1)")}²${plus(q)}.`,
      fields: [numberField("k =", k, "", 2, { slips: [{ value: right, hint: "Das ist der Wert des rechten Teils. Ziehe noch den Wert von " + fmt(m) + "x an der Stelle ab." }] })],
      steps: [`Rechter Teil bei x = ${fmt(x0)}: ${fmt(right)}`, `${fmt(m * x0)} + k = ${fmt(right)} ⇒ k = ${fmt(k)}`, `<strong>k = ${fmt(k)}</strong>`],
    };
  }
  const limit = rng.pick([100, 150, 200]);
  const p1 = rng.pick([0.4, 0.35, 0.3]);
  const p2 = rng.pick([0.25, 0.28, 0.2]);
  const base1 = rng.pick([8, 10, 12]);
  const base2 = base1 + (p1 - p2) * limit;
  return {
    prompt: `Ein Stromtarif kostet bis ${limit} kWh ${fmt(base1)} € Grundgebühr plus ${fmt(p1)} € je kWh. Über ${limit} kWh gilt ein günstigerer Arbeitspreis von ${fmt(p2)} € je kWh mit einer höheren Grundgebühr. Wie hoch muss diese sein, damit die Kosten an der Grenze nicht springen? Wie viel kosten dann ${limit + 50} kWh?`,
    given: [`K(x) = ${fmt(base1)} + ${fmt(p1)}x für x ≤ ${limit}`, `K(x) = G + ${fmt(p2)}x für x &gt; ${limit}`],
    fields: [numberField("G =", base2, "€", 2), numberField(`K(${limit + 50}) =`, base2 + p2 * (limit + 50), "€", 2)],
    steps: [
      `Stetig bei ${limit}: ${fmt(base1)} + ${fmt(p1)} · ${limit} = G + ${fmt(p2)} · ${limit}`,
      `G = ${fmt(base1 + p1 * limit)} − ${fmt(p2 * limit)} = ${fmt(base2)}`,
      `<strong>G = ${fmt(base2)} €; K(${limit + 50}) = ${fmt(base2 + p2 * (limit + 50))} €</strong>`,
    ],
  };
}

function sprung(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const x0 = rng.pick([1, 2, -1]);
    const m = nonZero(rng, 3);
    const t = nonZero(rng, 4);
    const q = nonZero(rng, 3);
    const leftValue = m * x0 + t;
    const rightLimit = 2 * x0 * x0 + q;
    const jump = rightLimit - leftValue;
    return {
      prompt: `f(x) = ${fmt(m)}x${plus(t)} für x ≤ ${fmt(x0)} und f(x) = 2x²${plus(q)} für x &gt; ${fmt(x0)}. Um wie viel springt der Graph an der Stelle ${fmt(x0)} (rechter minus linker Wert)? Ist f dort stetig?`,
      given: [`f(${fmt(x0)}) = ${fmt(m)} · ${fmt(x0).replace(MINUS_RE, "(−$1)")}${plus(t)}`],
      formulaHint: "Sprung = Grenzwert des rechten Teils − f(x₀); stetig genau bei Sprung 0",
      fields: [numberField("Sprung:", jump, "", 2), yesNo("stetig bei x₀?", Math.abs(jump) < 1e-9)],
      steps: [`links: f(${fmt(x0)}) = ${fmt(leftValue)}; rechts: 2 · ${fmt(x0 * x0)}${plus(q)} = ${fmt(rightLimit)}`, `<strong>Sprung ${fmt(jump)}; ${Math.abs(jump) < 1e-9 ? "stetig" : "nicht stetig"}</strong>`],
    };
  }
  const steps = rng.pick([
    { masses: [2, 5, 10], prices: [4.5, 6, 9.5, 14] },
    { masses: [1, 3, 8], prices: [3.8, 5.2, 7.9, 12.5] },
    { masses: [2, 4, 10], prices: [4.2, 5.5, 8.9, 15] },
  ]);
  const i = rng.int(0, 2);
  const at = steps.masses[i];
  const jump = steps.prices[i + 1] - steps.prices[i];
  return {
    prompt: `Ein Paketdienst berechnet für Pakete bis ${steps.masses[0]} kg ${fmt(steps.prices[0])} €, bis ${steps.masses[1]} kg ${fmt(steps.prices[1])} €, bis ${steps.masses[2]} kg ${fmt(steps.prices[2])} € und darüber ${fmt(steps.prices[3])} €. Um wie viel springt der Preis an der Stelle ${at} kg? Ist die Preisfunktion an der Stelle 3,5 kg stetig?`,
    given: ["P(m): Preis in € für ein Paket der Masse m in kg (Treppenfunktion)"],
    fields: [numberField("Sprung:", jump, "€", 2), yesNo("stetig bei 3,5 kg?", !steps.masses.includes(3.5))],
    steps: [`An den Grenzen ${steps.masses.join(" kg, ")} kg springt der Preis; dazwischen ist P konstant.`, `Bei ${at} kg: ${fmt(steps.prices[i + 1])} € − ${fmt(steps.prices[i])} € = ${fmt(jump)} €`, `<strong>Sprung ${fmt(jump)} €; bei 3,5 kg ja, stetig</strong>`],
  };
}

const stetigkeit: Lesson = {
  id: "fk-6-stetigkeit",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "1.6 Stetigkeit",
  subtitle: "Abschnittsweise definierte Funktionen ohne und mit Sprung",
  lehrplan: `${LEHRPLAN}, anschauliche Stetigkeit bei abschnittsweise definierten Funktionen`,
  whyItMatters:
    "Tarife, Steuersätze und Paketpreise sind oft abschnittsweise definiert. Ob die Kosten an einer Grenze springen, ist für Kundinnen und Kunden ein großer Unterschied. Stetigkeit ist außerdem die Voraussetzung dafür, dass ein Graph eine Tangente haben kann.",
  explanationHtml: `
    <p>Eine <strong>abschnittsweise definierte Funktion</strong> hat für verschiedene Bereiche der x-Achse verschiedene Terme, zum Beispiel</p>
    <p class="formula-line">f(x) = x + 1 für x ≤ 2 und f(x) = 0,5x² + 1 für x &gt; 2.</p>
    <p>Anschaulich heißt eine Funktion <strong>stetig</strong>, wenn du ihren Graphen ohne Absetzen des Stiftes zeichnen kannst. An einer Nahtstelle x₀ prüfst du, ob die Teile zusammenpassen: Der Wert des einen Teils an der Stelle x₀ muss mit dem Wert übereinstimmen, dem sich der andere Teil bei Annäherung an x₀ nähert. Stimmen sie nicht überein, hat der Graph einen <strong>Sprung</strong>, und f ist an dieser Stelle nicht stetig.</p>
    <p>Lineare, quadratische, ganzrationale, Exponential- und Sinusfunktionen sind auf ganz ℝ stetig. Unstetigkeiten entstehen bei abschnittsweise definierten Funktionen an den Nahtstellen, etwa bei <strong>Treppenfunktionen</strong> wie Paketpreisen. Auch ein stetiger Übergang kann einen <strong>Knick</strong> haben; was ein Knick bedeutet, untersuchst du in Etappe 4.</p>
    <div class="example">Im Beispiel oben: linker Teil bei x = 2: 2 + 1 = 3; rechter Teil bei Annäherung an 2: 0,5 · 4 + 1 = 3. Beide Werte stimmen überein, f ist bei x = 2 stetig. Mit dem rechten Teil 0,5x² − 1 läge der rechte Wert bei 1: Sprung um 1 − 3 = −2, f wäre bei x = 2 nicht stetig.</div>
    <div class="merke"><strong>Merke:</strong> Eine abschnittsweise definierte Funktion ist an einer Nahtstelle x₀ stetig, wenn die Teile dort zusammenpassen: Linker und rechter Teil haben an der Stelle x₀ denselben Wert. Sonst springt der Graph.</div>
  `,
  formulas: [
    { name: "Stetigkeit an der Nahtstelle", html: "linker Teil bei x₀ = rechter Teil bei x₀", quantities: "x₀ Nahtstelle einer abschnittsweise definierten Funktion" },
    { name: "Sprunghöhe", html: "Sprung = rechter Wert − linker Wert an der Stelle x₀", quantities: "Sprung 0 ⇔ stetig" },
  ],
  quiz: {
    question: "f(x) = 2x für x ≤ 1 und f(x) = x + 1 für x > 1. Ist f an der Stelle 1 stetig?",
    options: ["Ja, beide Teile haben bei x = 1 den Wert 2.", "Nein, die Steigungen 2 und 1 sind verschieden.", "Nein, eine abschnittsweise definierte Funktion ist nie stetig."],
    correctIndex: 0,
    explanation: "2 · 1 = 2 und 1 + 1 = 2: Der Graph lässt sich ohne Absetzen zeichnen. Die verschiedenen Steigungen erzeugen einen Knick, aber keinen Sprung.",
  },
  lab: {
    kind: "piecewise-continuity",
    title: "Labor: Lücke schließen",
    intro:
      "Links von x = 2 verläuft die Gerade y = mx + t, rechts die Parabel y = 0,5x² − 1, die sich dem Punkt (2 | 1) nähert. Ziehe die beiden Punkte der Geraden oder nutze die Regler.",
    params: [
      { type: "range", key: "m", label: "Steigung m", unit: "", min: -2, max: 3, step: 0.25, value: 0, digits: 2 },
      { type: "range", key: "t", label: "y-Achsenabschnitt t", unit: "", min: -4, max: 4, step: 0.25, value: 0, digits: 2 },
    ],
    readouts: [
      { key: "left", label: "linker Teil bei x = 2", emphasis: true, compute: (v) => piecewise(v, 2), digits: 2 },
      { key: "right", label: "rechter Teil bei Annäherung an 2", compute: () => 1, digits: 2 },
      { key: "jump", label: "Sprung", compute: (v) => (Math.abs(jumpAt2(v)) < 1e-9 ? "kein Sprung: f ist bei x = 2 stetig" : `${fmt(jumpAt2(v))}: f ist bei x = 2 nicht stetig`) },
      { key: "kink", label: "Übergang", compute: (v) => (Math.abs(jumpAt2(v)) > 1e-9 ? "Sprung" : v.m === 2 ? "glatt, ohne Knick" : `Knick: Steigung links ${fmt(v.m)}, rechts 2`) },
    ],
    goals: [
      { id: "stetig", text: "Schließe die Lücke bei x = 2, ohne die Steigung m = 1 aufzugeben.", check: (v) => v.m === 1 && Math.abs(jumpAt2(v)) < 1e-9 },
      { id: "glatt", text: "Mache f stetig und den Übergang zusätzlich glatt, also ohne Knick.", check: (v) => Math.abs(jumpAt2(v)) < 1e-9 && v.m === 2 },
      { id: "sprung", text: "Stelle mit waagrechter Geraden einen Sprung der Höhe 2 nach oben ein.", check: (v) => v.m === 0 && Math.abs(jumpAt2(v) - 2) < 1e-9 },
    ],
  },
  exercises: [
    { id: "parameter-stetig", make: parameterStetig },
    { id: "sprung", make: sprung },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst an den Nahtstellen, ob eine Funktion stetig ist oder springt.",
};

export const STAGE_FUNKTIONEN: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Spezielle Eigenschaften von Funktionen",
  subtitle: "Funktionstypen, Grenzverhalten, Symmetrie, Transformationen und Stetigkeit",
  icon: "📈",
  accent: "#2563eb",
  badgeTitle: "Funktionen im Griff",
  lehrplanLabel: "M11 LB 1 · ca. 14 Std.",
  lessons: [funktionstypen, grenzverhalten, symmetrie, transformationen, reihenfolge, stetigkeit],
};
