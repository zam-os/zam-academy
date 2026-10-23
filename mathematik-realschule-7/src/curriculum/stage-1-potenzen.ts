import { fmt, frac, paren } from "../exercises/format";
import type {
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
} from "../model/types";
import { decimal, powerText, PREFIXES } from "../powers";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-1-potenzen";
const LEHRPLAN = "M7 LB 1 (I) · M7 LB 1 (II/III): Potenzen";
const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
) => ({
  type: "range" as const,
  key,
  label,
  min,
  max,
  value,
  step,
  unit: "",
  digits: step < 1 ? 1 : 0,
});
const exponents = [-3, -2, -1, 0, 1, 2, 3] as const;
const power = (base: string | number, exponent: number | string) =>
  `${base}<sup>${typeof exponent === "number" ? fmt(exponent, 0) : exponent}</sup>`;
const reciprocalHint =
  "Ein negativer Exponent verlangt den Kehrwert, kein negatives Ergebnis.";

function lesson(
  number: number,
  content: Omit<
    Lesson,
    "stageId" | "stepNumber" | "tracks" | "lehrplan" | "requiredCorrect"
  >,
): Lesson {
  return {
    ...content,
    stageId: STAGE_ID,
    stepNumber: number,
    tracks: ["I", "II_III"],
    lehrplan: LEHRPLAN,
    requiredCorrect: 3,
  };
}

const reciprocalLab: LabDefinition = {
  kind: "reciprocal",
  title: "Labor: Die Potenzleiter",
  intro:
    "Ziehe den Punkt auf der Exponentenleiter. Ein Schritt nach links teilt durch die Basis. Verändere auch die Basis und vergleiche mit dem Kehrwert.",
  params: [range("a", "Basis a", 2, 5, 2), range("n", "Exponent n", -4, 3, 1)],
  readouts: [
    {
      key: "value",
      label: "Potenzwert",
      emphasis: true,
      compute: (v) => `${powerText(v.a, v.n)} = ${decimal(v.a ** v.n)}`,
    },
    {
      key: "reciprocal",
      label: "Gegensätzliche Exponenten",
      compute: (v) => `${powerText(v.a, v.n)} · ${powerText(v.a, -v.n)} = 1`,
    },
  ],
  goals: [
    {
      id: "achtel",
      text: "Stelle mit der Basis 2 den Wert 1/8 ein.",
      check: (v) => v.a === 2 && v.n === -3,
    },
    {
      id: "null",
      text: "Stelle bei der Basis 3 den Exponenten ein, der den Wert 1 ergibt.",
      check: (v) => v.a === 3 && v.n === 0,
    },
    {
      id: "hundertstel",
      text: "Stelle mit der Basis 5 den Wert 0,04 ein.",
      check: (v) => v.a === 5 && v.n === -2,
    },
  ],
};

const reciprocalExercises: ExerciseGenerator[] = [
  {
    id: "kehrwert",
    make: (rng, level): ExerciseTask => {
      const a = rng.pick([2, 4, 5, 10]);
      const n = rng.int(1, 4);
      if (level === 1)
        return {
          prompt: `Schreibe ${power(a, -n)} als Kehrwert und berechne den Potenzwert. Gib auch den Nenner des Kehrwerts an.`,
          given: [`Basis a = ${a}`, `Exponent n = ${fmt(-n, 0)}`],
          formulaHint: `a<sup>−n</sup> = ${frac(1, "a<sup>n</sup>")} für a ≠ 0`,
          fields: [
            numberField("Nenner =", a ** n, "", 0),
            numberField("Potenzwert =", a ** -n, "", 6, {
              slips: [{ value: -(a ** n), hint: reciprocalHint }],
            }),
          ],
          steps: [
            `${power(a, -n)} = ${frac(1, power(a, n))}`,
            `<strong>Nenner ${fmt(a ** n, 0)}; Wert ${decimal(a ** -n)}</strong>`,
          ],
          meta: { a, n },
        };
      const initial = a ** n * rng.int(2, 9);
      return {
        prompt: `Ein Messgerät zeigt zunächst ${fmt(initial, 0)} Einheiten an. Nach jedem Filter wird der Wert durch ${a} geteilt. Er durchläuft ${n} Filter. Gib den Exponenten e in ${fmt(initial, 0)} · ${power(a, "e")} und den Endwert an.`,
        given: [`Anfangswert ${fmt(initial, 0)}`, `${n}-mal teilen durch ${a}`],
        fields: [
          numberField("e =", -n, "", 0),
          numberField("Endwert =", initial * a ** -n, "", 0),
        ],
        steps: [
          `Teilen durch ${a} ist Multiplizieren mit ${power(a, -1)}.`,
          `<strong>e = ${fmt(-n, 0)}; ${fmt(initial, 0)} : ${fmt(a ** n, 0)} = ${fmt(initial * a ** -n, 0)}</strong>`,
        ],
        meta: { a, n, initial },
      };
    },
  },
  {
    id: "vorzeichen-und-null",
    make: (rng, level): ExerciseTask => {
      const a = rng.pick([2, 4, 5]);
      const n = rng.int(1, 3);
      const negative = (-a) ** -n;
      if (level === 1)
        return {
          prompt: `Berechne ${power(`(${fmt(-a, 0)})`, -n)} und ${power(a, 0)}. Achte auf die Klammer um die negative Basis.`,
          given: [`negative Basis ${fmt(-a, 0)}`, `Exponent ${fmt(-n, 0)}`],
          formulaHint:
            "(−a)<sup>−n</sup> = 1 : (−a)<sup>n</sup>; a<sup>0</sup> = 1 für a ≠ 0",
          fields: [
            numberField("erste Potenz =", negative, "", 6),
            numberField("zweite Potenz =", 1, "", 0),
          ],
          steps: [
            `${power(`(${fmt(-a, 0)})`, -n)} = ${frac(1, power(`(${fmt(-a, 0)})`, n))}; die Anzahl der negativen Faktoren bestimmt das Vorzeichen.`,
            `<strong>${decimal(negative)} und 1</strong>`,
          ],
          meta: { a, n },
        };
      return {
        prompt: `Mira sagt: „Ein negativer Exponent macht das Ergebnis immer negativ.“ Prüfe ihre Behauptung mit ${power(a, -n)} und ${power(`(${fmt(-a, 0)})`, -n)}. Berechne beide Werte und entscheide.`,
        given: [`${power(a, -n)}`, `${power(`(${fmt(-a, 0)})`, -n)}`],
        fields: [
          numberField("positive Basis:", a ** -n, "", 6),
          numberField("negative Basis:", negative, "", 6),
          choiceField("Miras Behauptung", ["stimmt immer", "ist falsch"], 1),
        ],
        steps: [
          "Der Exponent bestimmt den Kehrwert. Das Vorzeichen hängt von der Basis und davon ab, ob der Exponent gerade oder ungerade ist.",
          `<strong>${decimal(a ** -n)} und ${decimal(negative)}; die Behauptung ist falsch.</strong>`,
        ],
        meta: { a, n },
      };
    },
  },
];

const reciprocal = lesson(1, {
  id: "pt-1-negative-exponenten",
  title: "1.1 Null und negative Exponenten",
  subtitle: "Nach links auf der Potenzleiter: teilen statt malnehmen",
  whyItMatters:
    "Beim Verkleinern, bei Messwerten und bei späteren Termen brauchst du auch Potenzen unter 1. Ein negativer Exponent sagt dir, welcher Kehrwert gemeint ist.",
  explanationHtml: `
    <p>Zur Wiederholung: Eine Potenz mit positivem ganzzahligem Exponenten ist ein Produkt gleicher Faktoren: ${power(2, 3)} = 2 · 2 · 2 = 8. Wird der Exponent um 1 kleiner, teilst du den Potenzwert durch 2: 8 → 4 → 2 → 1 → 0,5 → 0,25. So setzt sich die Leiter über den Exponenten 0 hinaus fort.</p>
    <p>Für jede Basis a ≠ 0 gilt <strong>a<sup>0</sup> = 1</strong> und für eine positive ganze Zahl n gilt <strong>a<sup>−n</sup> = 1 : a<sup>n</sup></strong>. Die Basis 0 ist bei Exponent 0 oder einem negativen Exponenten hier ausgeschlossen: Du dürftest sonst durch 0 teilen.</p>
    <div class="example">${power(2, -3)} = ${frac(1, power(2, 3))} = ${frac(1, 8)} = 0,125. Dagegen ist −${power(2, 3)} = −8. Bei ${power("(−2)", -3)} gehört das Minus zur Basis: 1 : (−8) = −0,125. ${power("(−2)", -2)} = 1 : 4 = 0,25.</div>
    <div class="merke"><strong>Merke:</strong> Negativer Exponent → Kehrwert. Er macht die Zahl nicht automatisch negativ. Eine Klammer entscheidet, ob ein Minus zur Basis gehört.</div>`,
  formulas: [
    { name: "Exponent null", html: "a<sup>0</sup> = 1", quantities: "a ≠ 0" },
    {
      name: "Negativer Exponent",
      html: `a<sup>−n</sup> = ${frac(1, "a<sup>n</sup>")}`,
      quantities: "a ≠ 0; n positive ganze Zahl",
    },
  ],
  quiz: {
    question: "Welchen Wert hat 2⁻³?",
    options: ["−8", "1/8", "−6", "1/6"],
    correctIndex: 1,
    explanation:
      "2⁻³ = 1 : 2³ = 1 : 8. Der negative Exponent bildet den Kehrwert.",
  },
  lab: reciprocalLab,
  exercises: reciprocalExercises,
  celebrationMessage: "Du unterscheidest Vorzeichen, Exponent und Kehrwert.",
});

const sameBase = lesson(2, {
  id: "pt-2-gleiche-basis",
  title: "1.2 Potenzen mit gleicher Basis",
  subtitle: "Beim Multiplizieren addieren, beim Dividieren subtrahieren",
  whyItMatters:
    "Terme sehen oft länger aus, als sie sind. Wenn du gleiche Basen erkennst, werden aus vielen Faktoren eine Zahl und eine Potenz.",
  explanationHtml: `
    <p>Beim Multiplizieren zweier Potenzen mit derselben Basis zählst du die Faktoren zusammen: x<sup>3</sup> · x<sup>2</sup> = (x · x · x) · (x · x) = x<sup>5</sup>. Darum gilt <strong>a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup></strong>. Beim Dividieren werden Faktoren gekürzt: <strong>a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup></strong>. Für ganze Exponenten verwenden wir a ≠ 0.</p>
    <div class="example">3x<sup>4</sup> · 2x<sup>−2</sup> = 6x<sup>4 + (−2)</sup> = 6x<sup>2</sup>. Dagegen ist x<sup>2</sup> : x<sup>5</sup> = x<sup>−3</sup> = 1 : x<sup>3</sup>. Für x = 2 ergibt der Quotient 1/8.</div>
    <p>Die Regel gilt <strong>nicht für eine Summe</strong>: x<sup>2</sup> + x<sup>3</sup> wird nicht zu x<sup>5</sup>. Eine Probe mit x = 2 zeigt 4 + 8 = 12, während 2<sup>5</sup> = 32.</p>
    <div class="merke"><strong>Merke:</strong> Die Basis bleibt gleich. Beim Produkt addierst du die Exponenten, beim Quotienten subtrahierst du den gesamten Exponenten im Nenner, auch wenn er negativ ist.</div>`,
  formulas: [
    {
      name: "Produkt, gleiche Basis",
      html: "a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup>",
      quantities: "a ≠ 0; m, n ganze Zahlen",
    },
    {
      name: "Quotient, gleiche Basis",
      html: "a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup>",
      quantities: "a ≠ 0; m, n ganze Zahlen",
    },
  ],
  quiz: {
    question: "Wie vereinfacht sich x³ : x⁻² für x ≠ 0?",
    options: ["x¹", "x⁻⁶", "x⁵", "x⁻¹"],
    correctIndex: 2,
    explanation: "Du subtrahierst den Nennerexponenten: 3 − (−2) = 5.",
  },
  lab: {
    kind: "same-base",
    title: "Labor: Exponenten zusammenführen",
    intro:
      "Ziehe die Punkte für m und n. Vergleiche Produkt und Quotient. Beobachte, warum ein negativer Nennerexponent beim Subtrahieren das Ergebnis erhöht.",
    params: [
      range("m", "Exponent m", -3, 4, 2),
      range("n", "Exponent n", -3, 4, 1),
      {
        type: "choice",
        key: "op",
        label: "Rechenart",
        value: 0,
        options: [
          { value: 0, label: "multiplizieren" },
          { value: 1, label: "dividieren" },
        ],
      },
    ],
    readouts: [
      {
        key: "exponent",
        label: "Ergebnisexponent",
        emphasis: true,
        compute: (v) => (v.op === 0 ? v.m + v.n : v.m - v.n),
      },
      {
        key: "rule",
        label: "Rechnung",
        compute: (v) =>
          `m ${v.op === 0 ? "+" : "−"} n = ${fmt(v.m, 0)} ${v.op === 0 ? "+" : "−"} (${fmt(v.n, 0)})`,
      },
    ],
    goals: [
      {
        id: "kuerzen",
        text: "Bilde einen Quotienten mit m = n = 2. Der Wert wird 1.",
        check: (v) => v.op === 1 && v.m === 2 && v.n === 2,
      },
      {
        id: "negativ",
        text: "Bilde ein Produkt mit m = −2 und n = −1. Welcher Exponent entsteht?",
        check: (v) => v.op === 0 && v.m === -2 && v.n === -1,
      },
      {
        id: "minus-minus",
        text: "Dividiere x¹ durch x⁻² und erzeuge so den Exponenten 3.",
        check: (v) => v.op === 1 && v.m === 1 && v.n === -2,
      },
    ],
  },
  exercises: [
    {
      id: "produkt",
      make: (rng, level): ExerciseTask => {
        const c = rng.int(2, 5),
          d = rng.int(2, 5),
          m = rng.pick(exponents),
          n = rng.pick(exponents);
        const k = m + n;
        if (level === 1)
          return {
            prompt: `Fasse ${c}${power("x", m)} · ${d}${power("x", n)} zu c · x<sup>k</sup> zusammen. Für x gilt x ≠ 0.`,
            given: [
              `Faktoren ${c} und ${d}`,
              `Exponenten ${fmt(m, 0)} und ${fmt(n, 0)}`,
            ],
            formulaHint:
              "Zahlen multiplizieren, Exponenten gleicher Basis addieren.",
            fields: [
              numberField("c =", c * d, "", 0),
              numberField("k =", k, "", 0, {
                slips: [
                  {
                    value: m * n,
                    hint: "Hier multiplizierst du die Potenzen, nicht die Exponenten. Addiere m und n.",
                  },
                ],
              }),
            ],
            steps: [
              `${c} · ${d} = ${c * d}; ${fmt(m, 0)} + (${fmt(n, 0)}) = ${fmt(k, 0)}`,
              `<strong>${c * d}${power("x", k)}</strong>`,
            ],
            meta: { c, d, m, n },
          };
        return {
          prompt: `Ein Rechteck hat die Seitenlängen ${c}${power("x", m)} cm und ${d}${power("x", n)} cm, x > 0. Gib den Exponenten k im Flächenterm ${c * d} · x<sup>k</sup> an und berechne die Fläche für x = 2.`,
          given: ["Fläche = Länge · Breite", "x = 2"],
          fields: [
            numberField("k =", k, "", 0),
            numberField("Fläche =", c * d * 2 ** k, "cm²", 6),
          ],
          steps: [
            `A = ${c * d}${power("x", k)} cm²`,
            `<strong>k = ${fmt(k, 0)}; A(2) = ${decimal(c * d * 2 ** k)} cm²</strong>`,
          ],
          meta: { c, d, m, n },
        };
      },
    },
    {
      id: "quotient",
      make: (rng, level): ExerciseTask => {
        const m = rng.pick(exponents),
          n = rng.pick(exponents),
          k = m - n;
        if (level === 1)
          return {
            prompt: `Vereinfache ${power("x", m)} : ${power("x", n)} zu x<sup>k</sup> und berechne den Wert für x = 2.`,
            given: ["x ≠ 0", "für den Zahlenwert x = 2"],
            formulaHint: "a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup>",
            fields: [
              numberField("k =", k, "", 0),
              numberField("Wert =", 2 ** k, "", 6),
            ],
            steps: [
              `k = ${fmt(m, 0)} − (${fmt(n, 0)}) = ${fmt(k, 0)}`,
              `<strong>${power("x", k)}; für x = 2: ${decimal(2 ** k)}</strong>`,
            ],
            meta: { m, n },
          };
        return {
          prompt: `Ein Programm vereinfacht ${power("x", m)} : x<sup>n</sup> zu ${power("x", k)}. Welchen Exponenten n hat es im Nenner gelesen? Prüfe beide Terme mit x = 2.`,
          given: ["x ≠ 0", `Ergebnisexponent ${fmt(k, 0)}`],
          fields: [
            numberField("n =", n, "", 0),
            numberField("Quotientenwert für x = 2:", 2 ** k, "", 6),
          ],
          steps: [
            `${fmt(m, 0)} − n = ${fmt(k, 0)}; also n = ${fmt(m, 0)} − (${fmt(k, 0)})`,
            `<strong>n = ${fmt(n, 0)}; ${power(2, m)} : ${power(2, n)} = ${decimal(2 ** k)}</strong>`,
          ],
          meta: { m, n },
        };
      },
    },
  ],
  celebrationMessage:
    "Du erkennst gleiche Basen und rechnest sicher mit ganzen Exponenten.",
});

const rules = lesson(3, {
  id: "pt-3-weitere-potenzgesetze",
  title: "1.3 Gleiche Exponenten und Potenzen potenzieren",
  subtitle: "Erst die passende Regel erkennen",
  whyItMatters:
    "Gleiche Basis und gleicher Exponent sind verschiedene Fälle. Wenn du sie auseinanderhältst, kannst du auch verschachtelte Terme gezielt vereinfachen.",
  explanationHtml: `
    <p>Bei <strong>gleichen Exponenten</strong> kannst du die Basen zusammenfassen: a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup> und a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup>. Zum Beispiel 2<sup>3</sup> · 5<sup>3</sup> = (2 · 5)<sup>3</sup> = 10<sup>3</sup> = 1.000. Für ganze, auch negative Exponenten seien a und b ungleich 0.</p>
    <p>Bei einer <strong>Potenz einer Potenz</strong> werden die Exponenten multipliziert: (a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>. Bei n = 3 kannst du das als drei gleiche Faktoren lesen; über die Kehrwertregel gilt es auch für negative ganze Exponenten.</p>
    <div class="example">(x<sup>−2</sup>)<sup>3</sup> = x<sup>−6</sup>. Dagegen ist x<sup>−2</sup> · x<sup>3</sup> = x<sup>1</sup>. Auch ${power(6, -2)} : ${power(3, -2)} = ${power("(6 : 3)", -2)} = 1/4. Setze probeweise x = 2 ein, um die beiden Rechenarten zu unterscheiden.</div>
    <p>Für Summen gibt es diese Zusammenfassung nicht: (2 + 3)<sup>2</sup> = 25, aber 2<sup>2</sup> + 3<sup>2</sup> = 13.</p>
    <div class="merke"><strong>Merke:</strong> Gleiche Exponenten → Basen zusammenfassen. Potenz potenzieren → Exponenten multiplizieren. Prüfe immer zuerst die Rechenart und die Klammern.</div>`,
  formulas: [
    {
      name: "Gleicher Exponent, Produkt",
      html: "a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup>",
      quantities: "a, b ≠ 0; n ganzzahlig",
    },
    {
      name: "Gleicher Exponent, Quotient",
      html: "a<sup>n</sup> : b<sup>n</sup> = (a : b)<sup>n</sup>",
      quantities: "a, b ≠ 0; n ganzzahlig",
    },
    {
      name: "Potenz potenzieren",
      html: "(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>",
      quantities: "a ≠ 0; m, n ganzzahlig",
    },
  ],
  quiz: {
    question: "Wie vereinfacht sich (x²)³ für x ≠ 0?",
    options: ["x⁵", "x⁸", "x⁶", "6x"],
    correctIndex: 2,
    explanation:
      "Eine Potenz wird potenziert: 2 · 3 = 6. x² · x³ wäre dagegen x⁵.",
  },
  lab: {
    kind: "power-rules",
    title: "Labor: Drei Regeln im Vergleich",
    intro:
      "Wähle eine Rechenart und ziehe die Exponentenpunkte. Die Zeichnung zeigt links den Ausgangsterm, rechts die Zusammenfassung. Welche Zahl bleibt gleich?",
    params: [
      range("a", "Basis a", 1, 5, 2),
      range("b", "Basis b", 1, 5, 3),
      range("m", "innerer Exponent m", -3, 3, 2),
      range("n", "Exponent n", -3, 3, 1),
      {
        type: "choice",
        key: "op",
        label: "Rechenart",
        value: 0,
        options: [
          { value: 0, label: "gleiche Exponenten: Produkt" },
          { value: 1, label: "gleiche Exponenten: Quotient" },
          { value: 2, label: "Potenz potenzieren" },
        ],
      },
    ],
    readouts: [
      {
        key: "base",
        label: "Ergebnisbasis",
        compute: (v) => (v.op === 0 ? v.a * v.b : v.op === 1 ? v.a / v.b : v.a),
      },
      {
        key: "exponent",
        label: "Ergebnisexponent",
        compute: (v) => (v.op === 2 ? v.m * v.n : v.n),
      },
      {
        key: "value",
        label: "Potenzwert beider Seiten",
        emphasis: true,
        compute: (v) =>
          decimal(
            v.op === 0
              ? (v.a * v.b) ** v.n
              : v.op === 1
                ? (v.a / v.b) ** v.n
                : v.a ** (v.m * v.n),
          ),
      },
    ],
    goals: [
      {
        id: "produkt",
        text: "Fasse 2² · 3² zu 6² zusammen.",
        check: (v) => v.op === 0 && v.a === 2 && v.b === 3 && v.n === 2,
      },
      {
        id: "quotient",
        text: "Fasse 4³ : 2³ zu 2³ zusammen.",
        check: (v) => v.op === 1 && v.a === 4 && v.b === 2 && v.n === 3,
      },
      {
        id: "verschachtelt",
        text: "Stelle (2²)⁻³ ein. Beobachte den Exponenten −6.",
        check: (v) => v.op === 2 && v.a === 2 && v.m === 2 && v.n === -3,
      },
    ],
  },
  exercises: [
    {
      id: "gleicher-exponent",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(2, 5),
          b = rng.int(2, 5),
          n = rng.pick([-2, -1, 2, 3]);
        const quotient = level === 2;
        const base = quotient ? a : a * b;
        return {
          prompt: quotient
            ? `Ein Termvergleich kürzt ${power(a * b, n)} : ${power(b, n)}. Gib die Basis c in ${power("c", n)} und den Zahlenwert an. Erkläre dir, weshalb die Exponenten unverändert bleiben.`
            : `Fasse ${power(a, n)} · ${power(b, n)} zu c<sup>n</sup> zusammen. Gib c und den Potenzwert an.`,
          given: [`gleicher Exponent ${fmt(n, 0)}`, "alle Basen ungleich 0"],
          ...(level === 1
            ? {
                formulaHint:
                  "a<sup>n</sup> · b<sup>n</sup> = (a · b)<sup>n</sup>",
              }
            : {}),
          fields: [
            numberField("c =", base, "", 0),
            numberField("Potenzwert =", base ** n, "", 8),
          ],
          steps: [
            `c = ${quotient ? `${a * b} : ${b}` : `${a} · ${b}`} = ${base}`,
            `<strong>${power(base, n)} = ${decimal(base ** n)}</strong>`,
          ],
          meta: { a, b, n, quotient: quotient ? 1 : 0 },
        };
      },
    },
    {
      id: "potenz-potenzieren",
      make: (rng, level): ExerciseTask => {
        const m = rng.pick(exponents),
          n = rng.pick(exponents),
          k = m * n;
        if (level === 1)
          return {
            prompt: `Vereinfache (${power("x", m)})<sup>${fmt(n, 0)}</sup> für x ≠ 0 zu x<sup>k</sup> und berechne den Wert bei x = 2.`,
            given: [`m = ${fmt(m, 0)}`, `n = ${fmt(n, 0)}`],
            formulaHint: "(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup>",
            fields: [
              numberField("k =", k, "", 0),
              numberField("Wert bei x = 2:", 2 ** k, "", 9),
            ],
            steps: [
              `k = ${paren(m, 0)} · ${paren(n, 0)} = ${fmt(k, 0)}`,
              `<strong>${power("x", k)}; bei x = 2: ${decimal(2 ** k)}</strong>`,
            ],
            meta: { m, n },
          };
        return {
          prompt: `Vergleiche (${power("x", m)})<sup>${fmt(n, 0)}</sup> mit ${power("x", m)} · ${power("x", n)} für x ≠ 0. Welchen Exponenten hat jeder vereinfachte Term? Sind sie für alle x ≠ 0 gleich?`,
          given: [
            "Erster Term: verschachtelte Potenz",
            "Zweiter Term: Produkt",
          ],
          fields: [
            numberField("erster Exponent:", k, "", 0),
            numberField("zweiter Exponent:", m + n, "", 0),
            choiceField(
              "Für alle x ≠ 0 gleich?",
              ["ja", "nein"],
              k === m + n ? 0 : 1,
            ),
          ],
          steps: [
            `Erster Exponent ${paren(m, 0)} · ${paren(n, 0)} = ${fmt(k, 0)}; zweiter Exponent ${fmt(m, 0)} + (${fmt(n, 0)}) = ${fmt(m + n, 0)}`,
            `<strong>${k === m + n ? "Hier sind die Exponenten zufällig gleich." : "Die Exponenten unterscheiden sich: Bei x = 2 liefern die Terme verschiedene Werte."}</strong>`,
          ],
          meta: { m, n },
        };
      },
    },
  ],
  celebrationMessage: "Du wählst die Potenzregel passend zur Rechenart.",
});

const tens = lesson(4, {
  id: "pt-4-zehnerpotenzen",
  title: "1.4 Große und kleine Zahlen mit Zehnerpotenzen",
  subtitle: "Eine Zahl behalten, die Schreibweise ändern",
  whyItMatters:
    "Die Entfernung eines Satelliten und die Dicke einer dünnen Schicht unterscheiden sich stark. Mit Zehnerpotenzen schreibst du beide übersichtlich und vergleichst Größen ohne Nullenzählen.",
  explanationHtml: `
    <p>10<sup>3</sup> = 1.000 und 10<sup>−3</sup> = 0,001. Bei der Multiplikation mit 10<sup>n</sup> rücken die Ziffern um n Stellen zu höheren Stellenwerten; für einen negativen Exponenten entsprechend zu kleineren. Die Dezimalzahl und das Produkt beschreiben <strong>denselben Wert</strong>.</p>
    <p>In der <strong>normierten wissenschaftlichen Schreibweise</strong> einer positiven Zahl steht vor der Zehnerpotenz ein Faktor a mit 1 ≤ a &lt; 10. Du bewegst das Komma so, dass genau eine von 0 verschiedene Ziffer davor steht, und gleichst die Verschiebung durch den Exponenten aus.</p>
    <div class="example">42.000 = 4,2 · 10<sup>4</sup>. Dagegen ist 0,00072 = 7,2 · 10<sup>−4</sup>. Auch 42 · 10<sup>3</sup> hat den Wert 42.000, ist aber nicht normiert. Bei 3,5 · 10<sup>6</sup> m sind das 3.500.000 m.</div>
    <p>Zum Multiplizieren zweier solcher Zahlen nutzt du die Regeln aus Lektion 1.2: (2 · 10<sup>3</sup>) · (4 · 10<sup>−5</sup>) = 8 · 10<sup>−2</sup> = 0,08.</p>
    <div class="merke"><strong>Merke:</strong> Bei kleinen positiven Zahlen ist der Exponent oft negativ. In normierter Schreibweise liegt der Faktor zwischen 1 einschließlich und 10 ausschließlich.</div>`,
  formulas: [
    {
      name: "Zehnerpotenz",
      html: "10<sup>−n</sup> = 1 : 10<sup>n</sup>",
      quantities: "n positive ganze Zahl",
    },
    {
      name: "Normierte Schreibweise",
      html: "a · 10<sup>n</sup> mit 1 ≤ a &lt; 10",
      quantities: "positive Zahl; n ganzzahlig",
    },
  ],
  quiz: {
    question: "Welche normierte Schreibweise gehört zu 0,0042?",
    options: ["4,2 · 10³", "42 · 10⁻⁴", "4,2 · 10⁻³", "0,42 · 10⁻²"],
    correctIndex: 2,
    explanation:
      "4,2 wird durch 1.000 geteilt. 42 · 10⁻⁴ und 0,42 · 10⁻² haben zwar denselben Wert, aber ihr erster Faktor ist nicht normiert.",
  },
  lab: {
    kind: "decimal-scale",
    title: "Labor: Das Komma wandert",
    intro:
      "Ziehe den Exponentenpunkt auf der Stellenwertleiter. Ändere den Faktor. Vergleiche die wissenschaftliche Schreibweise mit der Dezimaldarstellung.",
    params: [
      range("a", "Faktor a", 1, 9.9, 2.5, 0.1),
      range("n", "Exponent n", -9, 9, -2),
    ],
    readouts: [
      {
        key: "value",
        label: "Dezimaldarstellung",
        emphasis: true,
        compute: (v) => decimal(v.a * 10 ** v.n),
      },
      {
        key: "scientific",
        label: "Normierte Schreibweise",
        compute: (v) => `${fmt(v.a, 1)} · ${powerText(10, v.n)}`,
      },
    ],
    goals: [
      {
        id: "gross",
        text: "Stelle den Wert 4.200 ein.",
        check: (v) => v.a === 4.2 && v.n === 3,
      },
      {
        id: "klein",
        text: "Stelle den Wert 0,00072 ein.",
        check: (v) => v.a === 7.2 && v.n === -4,
      },
      {
        id: "million",
        text: "Stelle sechseinhalb Millionen ein.",
        check: (v) => v.a === 6.5 && v.n === 6,
      },
    ],
  },
  exercises: [
    {
      id: "normieren",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(11, 99) / 10,
          n = rng.int(-6, 7),
          value = a * 10 ** n;
        if (level === 1)
          return {
            prompt: `Schreibe ${decimal(value)} in der normierten Form a · 10<sup>n</sup>. Gib Faktor und Exponent getrennt an.`,
            given: ["1 ≤ a < 10", "n ist eine ganze Zahl"],
            formulaHint:
              "Komma hinter die erste von 0 verschiedene Ziffer; Verschiebung mit 10<sup>n</sup> ausgleichen.",
            fields: [
              numberField("a =", a, "", 1),
              numberField("n =", n, "", 0),
            ],
            steps: [
              `Die erste Ziffer bleibt vor dem Komma: a = ${fmt(a, 1)}.`,
              `<strong>${decimal(value)} = ${fmt(a, 1)} · ${power(10, n)}</strong>`,
            ],
            meta: { a, n },
          };
        const shift = rng.pick([-2, -1, 1, 2]);
        const coefficient = a * 10 ** shift,
          exponent = n - shift;
        return {
          prompt: `Ein Messbericht nennt ${decimal(coefficient)} · ${power(10, exponent)} m. Bringe die Angabe in normierte Schreibweise und entscheide, ob sich dadurch die gemessene Länge ändert.`,
          given: ["Gesucht: a · 10ⁿ m mit 1 ≤ a < 10"],
          fields: [
            numberField("a =", a, "", 1),
            numberField("n =", n, "", 0),
            choiceField("Die Länge", ["bleibt gleich", "ändert sich"], 0),
          ],
          steps: [
            `Faktor und Zehnerpotenz gleichen einander aus: ${decimal(coefficient)} = ${fmt(a, 1)} · ${power(10, shift)}.`,
            `<strong>${fmt(a, 1)} · ${power(10, n)} m; die Länge bleibt gleich.</strong>`,
          ],
          meta: { a, n, shift },
        };
      },
    },
    {
      id: "mit-zehnerpotenzen-rechnen",
      make: (rng, level): ExerciseTask => {
        const a = rng.int(2, 4),
          b = rng.int(2, 4),
          m = rng.int(-4, level === 1 ? 4 : -1),
          n = rng.int(-4, level === 1 ? 4 : -1);
        const raw = a * b,
          shift = raw >= 10 ? 1 : 0,
          coefficient = raw / 10 ** shift,
          exponent = m + n + shift;
        return {
          prompt:
            level === 1
              ? `Berechne (${a} · ${power(10, m)}) · (${b} · ${power(10, n)}) und normiere das Ergebnis.`
              : `Eine rechteckige Sensorfläche hat die Seitenlängen ${a} · ${power(10, m)} m und ${b} · ${power(10, n)} m. Bestimme den Flächeninhalt in normierter Schreibweise in m².`,
          given:
            level === 1
              ? ["Zahlenfaktoren und Zehnerpotenzen getrennt behandeln"]
              : ["A = Länge · Breite", "Gesucht: a · 10ⁿ m²"],
          ...(level === 1
            ? {
                formulaHint:
                  "10<sup>m</sup> · 10<sup>n</sup> = 10<sup>m + n</sup>; anschließend 1 ≤ a < 10 herstellen.",
              }
            : {}),
          fields: [
            numberField("Faktor a =", coefficient, "", 1),
            numberField("Exponent n =", exponent, "", 0),
          ],
          steps: [
            `${a} · ${b} = ${raw}; ${fmt(m, 0)} + (${fmt(n, 0)}) = ${fmt(m + n, 0)}`,
            `<strong>${fmt(coefficient, 1)} · ${power(10, exponent)}${level === 2 ? " m²" : ""}</strong>`,
          ],
          meta: { a, b, m, n },
        };
      },
    },
  ],
  celebrationMessage:
    "Du schreibst große und kleine Größen ohne den Wert zu verändern.",
});

const prefixRows = PREFIXES.map(
  (p) =>
    `<tr><td>${p.name}</td><td>${p.symbol || "—"}</td><td>${power(10, p.exponent)}</td></tr>`,
).join("");
const prefixes = lesson(5, {
  id: "pt-5-vorsilben",
  title: "1.5 Vorsilben und Einheiten umrechnen",
  subtitle: "Von Atto bis Exa: die Einheit gehört zum Wert",
  whyItMatters:
    "3 mm und 3 km enthalten dieselbe Zahl, aber sehr verschiedene Längen. Die Vorsilbe trägt eine Zehnerpotenz; beim Umrechnen muss die Länge erhalten bleiben.",
  explanationHtml: `
    <p>Eine Vorsilbe multipliziert die Einheit mit einer festen Zehnerpotenz: 1 mm = 10<sup>−3</sup> m; 1 km = 10<sup>3</sup> m. Groß- und Kleinschreibung ist entscheidend: <strong>m</strong> steht als Vorsilbe für Milli, <strong>M</strong> für Mega. Das alleinstehende m ist außerdem das Einheitenzeichen für Meter.</p>
    <table class="formula-table"><thead><tr><th>Vorsilbe</th><th>Zeichen</th><th>Faktor</th></tr></thead><tbody>${prefixRows}</tbody></table>
    <p>Von einer Vorsilbe mit Exponent p zu einer mit Exponent q änderst du den Zahlenwert um den Faktor 10<sup>p − q</sup>. Für die <strong>kleinere Einheit</strong> brauchst du mehr Einheiten, der Zahlenwert wächst.</p>
    <div class="example">3,2 mm = 3,2 · 10<sup>−3</sup> m = 0,0032 m. In Mikrometern: 3,2 · 10<sup>−3 − (−6)</sup> µm = 3.200 µm. Die Länge bleibt gleich. Bei Flächeneinheiten wird auch der Faktor quadriert: 1 cm² = (10<sup>−2</sup> m)² = 10<sup>−4</sup> m².</div>
    <div class="merke"><strong>Merke:</strong> Schreibe die Einheit mit. Von p nach q gilt Zahlenwert neu = Zahlenwert alt · 10<sup>p − q</sup>. Vorsilben beziehen sich auf Zehnerpotenzen; bei Flächen und Volumen wird der Einheitenfaktor mit potenziert.</div>`,
  formulas: [
    {
      name: "Einheit wechseln",
      html: "z<sub>neu</sub> = z<sub>alt</sub> · 10<sup>p − q</sup>",
      quantities:
        "p Quellvorsilbe, q Zielvorsilbe; Länge bzw. Größe bleibt gleich",
    },
    {
      name: "Milli, Mikro, Nano",
      html: "m: 10<sup>−3</sup>; µ: 10<sup>−6</sup>; n: 10<sup>−9</sup>",
      quantities: "Vorsilbenzeichen, kein Produkt",
    },
    {
      name: "Kilo, Mega, Giga",
      html: "k: 10<sup>3</sup>; M: 10<sup>6</sup>; G: 10<sup>9</sup>",
      quantities: "Groß- und Kleinschreibung beachten",
    },
  ],
  quiz: {
    question: "Wie viele Mikrometer sind 2 mm?",
    options: ["0,002 µm", "2.000 µm", "2 µm", "2.000.000 µm"],
    correctIndex: 1,
    explanation:
      "Milli: 10⁻³; Mikro: 10⁻⁶. 2 · 10⁻³⁻⁽⁻⁶⁾ = 2 · 10³ = 2.000. Die kleinere Einheit erfordert den größeren Zahlenwert.",
  },
  lab: {
    kind: "prefix-scale",
    title: "Labor: Eine Länge, verschiedene Einheiten",
    intro:
      "Ziehe die zwei Punkte auf der Vorsilbenleiter oder wähle die Einheiten darunter. Der Umrechnungsfaktor folgt aus der Differenz der Exponenten. Beide Angaben meinen dieselbe Länge.",
    params: [
      range("amount", "Zahlenwert in der Quelleinheit", 1, 9, 3),
      ...["from", "to"].map((key) => ({
        type: "choice" as const,
        key,
        label: key === "from" ? "Quelleinheit" : "Zieleinheit",
        value: key === "from" ? -3 : 0,
        options: PREFIXES.map((p) => ({
          value: p.exponent,
          label: `${p.name}: ${p.symbol}m`,
        })),
      })),
    ],
    readouts: [
      {
        key: "exponent",
        label: "Exponent des Umrechnungsfaktors",
        compute: (v) => v.from - v.to,
      },
      {
        key: "value",
        label: "Gleiche Länge in der Zieleinheit",
        emphasis: true,
        compute: (v) =>
          `${v.amount} · ${powerText(10, v.from - v.to)} ${PREFIXES.find((p) => p.exponent === v.to)!.symbol}m`,
      },
    ],
    goals: [
      {
        id: "mikro",
        text: "Rechne 3 mm in µm um.",
        check: (v) => v.amount === 3 && v.from === -3 && v.to === -6,
      },
      {
        id: "kilo",
        text: "Rechne 2 km in m um.",
        check: (v) => v.amount === 2 && v.from === 3 && v.to === 0,
      },
      {
        id: "extrem",
        text: "Vergleiche die Ränder der Tabelle: Rechne 1 Em in am um. Warum steht hier die Potenzschreibweise?",
        check: (v) => v.amount === 1 && v.from === 18 && v.to === -18,
      },
    ],
  },
  exercises: [
    {
      id: "vorsilbe-lesen",
      make: (rng, level): ExerciseTask => {
        const prefix = rng.pick(PREFIXES.filter((p) => p.exponent !== 0));
        const amount = rng.int(2, 9);
        if (level === 1)
          return {
            prompt: `Schreibe ${amount} ${prefix.symbol}m als ${amount} · 10<sup>e</sup> m. Gib den Exponenten e und die Bedeutung der Vorsilbe an.`,
            given: [`Vorsilbe ${prefix.symbol}`, "Bezugseinheit Meter"],
            formulaHint:
              "Lies in der Vorsilbentabelle den Zehnerpotenzfaktor ab.",
            fields: [
              numberField("e =", prefix.exponent, "", 0),
              choiceField(
                "Vorsilbe",
                [
                  prefix.name,
                  prefix.exponent < 0 ? "Kilo" : "Milli",
                  "ohne Vorsilbe",
                ],
                0,
              ),
            ],
            steps: [
              `${prefix.name} (${prefix.symbol}) steht für ${power(10, prefix.exponent)}.`,
              `<strong>${amount} ${prefix.symbol}m = ${amount} · ${power(10, prefix.exponent)} m</strong>`,
            ],
            meta: { exponent: prefix.exponent, amount },
          };
        const other = rng.pick(
          PREFIXES.filter((p) => p.exponent !== prefix.exponent),
        );
        return {
          prompt: `Eine Zeichnung nennt die Länge ${amount} ${prefix.symbol}m. Du brauchst sie als ${amount} · 10<sup>e</sup> ${other.symbol}m. Bestimme e. Ändert sich dadurch die Länge des Gegenstands?`,
          given: [`Quelle: ${prefix.name}`, `Ziel: ${other.name}`],
          fields: [
            numberField("e =", prefix.exponent - other.exponent, "", 0),
            choiceField("Die Länge", ["bleibt gleich", "ändert sich"], 0),
          ],
          steps: [
            `Quell- minus Zielexponent: ${fmt(prefix.exponent, 0)} − (${fmt(other.exponent, 0)}) = ${fmt(prefix.exponent - other.exponent, 0)}`,
            `<strong>${amount} · ${power(10, prefix.exponent - other.exponent)} ${other.symbol}m; die Länge bleibt gleich.</strong>`,
          ],
          meta: { from: prefix.exponent, to: other.exponent, amount },
        };
      },
    },
    {
      id: "einheiten-umrechnen",
      make: (rng, level): ExerciseTask => {
        const from = rng.pick([-3, -2, 0, 3]),
          to = rng.pick([-3, -2, 0, 3].filter((p) => p !== from));
        const amount = rng.int(1, 9),
          factorExponent = (from - to) * (level === 1 ? 1 : 2);
        const fromSymbol = PREFIXES.find((p) => p.exponent === from)!.symbol,
          toSymbol = PREFIXES.find((p) => p.exponent === to)!.symbol;
        if (level === 1)
          return {
            prompt: `Rechne ${amount} ${fromSymbol}m in ${toSymbol}m um. Gib auch den Exponenten des Umrechnungsfaktors an.`,
            given: [
              `${fromSymbol}m = ${power(10, from)} m`,
              `${toSymbol}m = ${power(10, to)} m`,
            ],
            formulaHint: "Zahlenwert neu = Zahlenwert alt · 10<sup>p − q</sup>",
            fields: [
              numberField("Faktorexponent =", factorExponent, "", 0),
              numberField(
                "neuer Zahlenwert =",
                amount * 10 ** factorExponent,
                `${toSymbol}m`,
                6,
              ),
            ],
            steps: [
              `${fmt(from, 0)} − (${fmt(to, 0)}) = ${fmt(factorExponent, 0)}`,
              `<strong>${amount} ${fromSymbol}m = ${decimal(amount * 10 ** factorExponent)} ${toSymbol}m</strong>`,
            ],
            meta: { from, to, amount },
          };
        return {
          prompt: `Eine Fläche ist ${amount} ${fromSymbol}m² groß. Schreibe sie als ${amount} · 10<sup>e</sup> ${toSymbol}m². Beachte, dass die Längeneinheit im Quadrat steht.`,
          given: ["Erst den Längenfaktor bestimmen, dann quadrieren"],
          fields: [
            numberField("e =", factorExponent, "", 0),
            choiceField(
              "Warum?",
              [
                "Der Längenfaktor wird quadriert.",
                "Der Zahlenwert wird nur verdoppelt.",
                "Vorsilben spielen bei Flächen keine Rolle.",
              ],
              0,
            ),
          ],
          steps: [
            `Längenfaktor ${power(10, from - to)}; sein Quadrat ist ${power(10, factorExponent)}.`,
            `<strong>${amount} ${fromSymbol}m² = ${amount} · ${power(10, factorExponent)} ${toSymbol}m²</strong>`,
          ],
          meta: { from, to, amount },
        };
      },
    },
  ],
  celebrationMessage:
    "Du rechnest Einheiten um und hältst den Wert der Größe fest.",
});

export const STAGE_POTENZEN: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Potenzen",
  subtitle: "Kehrwerte, Potenzgesetze, Zehnerpotenzen und Vorsilben",
  icon: "🧮",
  accent: "#2563eb",
  badgeTitle: "Potenzen verstanden",
  lehrplanLabel: "M7 LB 1 · I und II/III · ca. 10 Std.",
  lessons: [reciprocal, sameBase, rules, tens, prefixes],
};
