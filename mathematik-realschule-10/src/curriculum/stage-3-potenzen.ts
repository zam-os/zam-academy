import type { Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const potenzgesetze: Lesson = {
  id: "pt-1-potenzgesetze",
  stageId: "st-3-potenzen",
  stepNumber: 1,
  title: "3.1 Rationale und negative Exponenten",
  subtitle: "Wurzeln als Potenzen schreiben und Rechengesetze anwenden",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 3.1",
  whyItMatters:
    "Das Umschreiben von Wurzeln in Potenzen (z. B. √x = x^(1/2)) macht komplizierte Rechenausdrücke algebraisch einfach handhabbar.",
  explanationHtml: `
    <p>Die Potenzrechnung wird auf beliebige <strong>rationale Exponenten</strong> erweitert:</p>
    <ul>
      <li><strong>Negative Exponenten:</strong> <em>a^(-n) = 1 / a^n</em> (z. B. 2^(-3) = 1/8).</li>
      <li><strong>Stammbrüche als Wurzeln:</strong> <em>a^(1/n) = ⁿ√a</em> (z. B. 16^(1/4) = ⁴√16 = 2).</li>
      <li><strong>Allgemeine rationale Exponenten:</strong> <em>a^(m/n) = ⁿ√(a^m) = (ⁿ√a)^m</em> (z. B. 8^(2/3) = (³√8)² = 2² = 4).</li>
    </ul>
    <p>Die klassischen <strong>Potenzgesetze</strong> gelten unverändert:</p>
    <p class="formula-center"><strong>aʳ · aˢ = aʳ⁺ˢ  |  aʳ / aˢ = aʳ⁻ˢ  |  (aʳ)ˢ = aʳ˙ˢ</strong></p>
  `,
  formulas: [
    {
      name: "Rationale Exponenten",
      html: "a^(m/n) = ⁿ√(a^m)",
      quantities: "a > 0 Basis, m Zähler, n Wurzelexponent (Nenner)",
    },
    {
      name: "Negative Exponenten",
      html: "a^(-n) = 1 / a^n",
      quantities: "Kehrwertbildung",
    },
  ],
  quiz: {
    question: "Welchen exakten Wert hat der Term 27^(2/3)?",
    options: ["9", "3", "18", "6"],
    correctIndex: 0,
    explanation:
      "27^(2/3) = (³√27)² = 3² = 9.",
  },
  lab: {
    kind: "power-graph",
    title: "Potenz-Labor",
    intro: "Untersuche Potenzen mit verschiedenen ganzzahligen und gebrochenen Hochzahlen.",
    params: [
      { type: "range", key: "exp", label: "Exponent", unit: "", min: -3, max: 4, step: 1, value: 2 },
    ],
    readouts: [
      {
        key: "typeVal",
        label: "Funktionstyp",
        compute: (v) => {
          const e = v.exp ?? 2;
          if (e === 2) return "Normalparabel (achsensymmetrisch)";
          if (e === 3) return "Kubische Parabel (punktsymmetrisch)";
          if (e === -1) return "Hyperbel f(x) = 1/x";
          if (e === -2) return "Hyperbel f(x) = 1/x²";
          return `Potenzfunktion x^${e}`;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle den Exponenten -1 ein, um die Hyperbel 1/x zu betrachten.",
        check: (v) => (v.exp ?? 0) === -1,
      },
    ],
  },
  exercises: [
    {
      id: "ex-pt-1",
      make(rng, _level) {
      const base = rng.pick([4, 8, 9, 16, 25, 27, 32, 64]);
      let ans = 0;
      let expStr = "";
      if (base === 4) { expStr = "3/2"; ans = 8; }
      else if (base === 8) { expStr = "2/3"; ans = 4; }
      else if (base === 9) { expStr = "3/2"; ans = 27; }
      else if (base === 16) { expStr = "3/4"; ans = 8; }
      else if (base === 25) { expStr = "3/2"; ans = 125; }
      else if (base === 27) { expStr = "2/3"; ans = 9; }
      else if (base === 32) { expStr = "2/5"; ans = 4; }
      else { expStr = "2/3"; ans = 16; }

      return {
        prompt: `Berechne den Wert der Potenz <strong>${base}^(${expStr})</strong> im Kopf ohne Taschenrechner.`,
        given: [`${base}^(${expStr})`],
        formulaHint: "a^(m/n) = (ⁿ√a)^m",
        fields: [numberField("Wert =", ans)],
        steps: [
          `Zuerst die Wurzel ziehen: Nenner des Exponenten`,
          `Anschließend mit dem Zähler potenzieren:`,
          `Ergebnis: <strong>${ans}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du beherrschst Potenzen mit rationalen Exponenten.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=NucUdbvOKIM",
    title: "Wurzel und Potenzen, Grundlagen, Zusammenhänge",
    author: "Daniel Jung",
  },
};

const potenzfunktionen: Lesson = {
  id: "pt-2-potenzfunktionen",
  stageId: "st-3-potenzen",
  stepNumber: 2,
  title: "3.2 Potenzfunktionen und ihre Graphen",
  subtitle: "Symmetrie, Monotonie und Grenzverhalten im Unendlichen",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 3.2",
  whyItMatters:
    "Potenzfunktionen bilden das Grundgerüst für Polynome und physikalische Gesetze (z. B. Gravitationsgesetz F ~ 1/r² oder Bremsweg s ~ v²).",
  explanationHtml: `
    <p>Eine <strong>Potenzfunktion</strong> hat die Form <em>f(x) = xⁿ</em> mit <em>n ∈ ℤ</em>:</p>
    <ul>
      <li><strong>n gerade, positiv (z. B. x², x⁴):</strong> Parabelkurven, achsensymmetrisch zur y-Achse, Scheitelpunkt im Tiefpunkt (0|0).</li>
      <li><strong>n ungerade, positiv (z. B. x³, x⁵):</strong> S-förmige Kurven, punktsymmetrisch zum Ursprung (0|0), streng monoton steigend.</li>
      <li><strong>n negativ (z. B. x⁻¹ = 1/x, x⁻² = 1/x²):</strong> Hyperbeln mit Polstelle bei x = 0; die Koordinatenachsen sind Asymptoten.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Symmetrie",
      html: "f(-x) = f(x) (Achsensymmetrie) | f(-x) = -f(x) (Punktsymmetrie)",
      quantities: "Achsensymmetrie bei geradem n, Punktsymmetrie bei ungeradem n",
    },
  ],
  quiz: {
    question: "Welche Symmetrie besitzt der Graph der Funktion f(x) = x³?",
    options: [
      "Punktsymmetrisch zum Koordinatenursprung (0|0)",
      "Achsensymmetrisch zur y-Achse",
      "Achsensymmetrisch zur x-Achse",
      "Keine Symmetrie",
    ],
    correctIndex: 0,
    explanation:
      "Ungerade Potenzen wie f(x) = x³ erfüllen f(-x) = (-x)³ = -x³ = -f(x) und sind daher punktsymmetrisch zum Ursprung.",
  },
  lab: {
    kind: "power-graph",
    title: "Graphen-Labor",
    intro: "Vergleiche die Graphen für gerade und ungerade Potenzen.",
    params: [
      { type: "range", key: "exp", label: "Exponent n", unit: "", min: -2, max: 4, step: 1, value: 3 },
    ],
    readouts: [
      {
        key: "typeVal",
        label: "Verhalten",
        compute: (v) => ((v.exp ?? 3) % 2 === 0 ? "Achsensymmetrisch zur y-Achse" : "Punktsymmetrisch zum Ursprung"),
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle einen geraden Exponenten ein (z. B. n = 4).",
        check: (v) => Math.abs(v.exp ?? 0) === 4 || Math.abs(v.exp ?? 0) === 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-pt-2",
      make(rng, _level) {
      const exp = rng.pick([2, 3, 4, 5]);
      const x = rng.pick([-2, -1, 2, 3]);
      const y = Math.pow(x, exp);
      return {
        prompt: `Berechne den Funktionswert <strong>f(${x})</strong> der Potenzfunktion <strong>f(x) = x^${exp}</strong>.`,
        given: [`f(x) = x^${exp}`, `x = ${x}`],
        formulaHint: "Vorzeichen beachten: (-a)ⁿ ist bei geradem n positiv, bei ungeradem n negativ.",
        fields: [numberField(`f(${x}) =`, y)],
        steps: [
          `Einsetzen: f(${x}) = (${x})^${exp}`,
          `Ausrechnen: <strong>${y}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du kennst die Eigenschaften und Graphen aller Potenzfunktionen.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=OVWF5UATHVc",
    title: "Potenzfunktionen Übersicht, Basis, Exponent",
    author: "Daniel Jung",
  },
};

const wurzelfunktionen: Lesson = {
  id: "pt-3-wurzelfunktionen",
  stageId: "st-3-potenzen",
  stepNumber: 3,
  title: "3.3 Wurzelfunktionen als Umkehrfunktionen",
  subtitle: "Spiegelung an der ersten Winkelhalbierenden y = x",
  tracks: ["I"],
  lehrplan: "M10 (I) LB 3.2",
  whyItMatters:
    "Umkehrfunktionen machen Rechenschritte rückgängig. Die Wurzelfunktion f(x) = √x ist die Umkehrfunktion der quadratischen Funktion.",
  explanationHtml: `
    <p>Die Standard-Wurzelfunktion <em>f(x) = √x = x^(1/2)</em> ist nur für <em>x ≥ 0</em> definiert (Definitionsmenge <em>D = ℝ₀⁺</em>, Wertemenge <em>W = ℝ₀⁺</em>).</p>
    <p>Sie ist die <strong>Umkehrfunktion</strong> der eingeschränkten Parabel <em>g(x) = x²</em> für <em>x ≥ 0</em>.</p>
    <p><strong>Geometrische Eigenschaft:</strong> Der Graph der Umkehrfunktion entsteht durch <strong>Spiegelung an der ersten Winkelhalbierenden y = x</strong>.</p>
  `,
  formulas: [
    {
      name: "Wurzelfunktion",
      html: "f(x) = √x = x^(1/2)",
      quantities: "D = ℝ₀⁺, W = ℝ₀⁺",
    },
    {
      name: "Umkehrprinzip",
      html: "y = √x ⟺ x = y² (für x, y ≥ 0)",
      quantities: "Vertauschen von x und y",
    },
  ],
  quiz: {
    question: "An welcher Geraden wird der Graph gespiegelt, um den Graphen der Umkehrfunktion zu erhalten?",
    options: [
      "An der ersten Winkelhalbierenden y = x",
      "An der x-Achse y = 0",
      "An der y-Achse x = 0",
      "An der Geraden y = -x",
    ],
    correctIndex: 0,
    explanation:
      "Die Umkehrfunktion entsteht rechnerisch durch Vertauschen von x und y, was geometrisch einer Spiegelung an der ersten Winkelhalbierenden y = x entspricht.",
  },
  lab: {
    kind: "power-graph",
    title: "Umkehrungs-Labor",
    intro: "Betrachte die Wurzelfunktion und ihre Verwandtschaft zu x².",
    params: [
      { type: "range", key: "exp", label: "Exponent", unit: "", min: 1, max: 3, step: 1, value: 2 },
    ],
    readouts: [
      {
        key: "typeVal",
        label: "Umkehrung",
        compute: () => "y = x gespiegelt ⟹ Wurzelfunktion",
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Betrachte die Parabel x², deren Umkehrung √x ist.",
        check: (v) => (v.exp ?? 0) === 2,
      },
    ],
  },
  exercises: [
    {
      id: "ex-pt-3",
      make(rng, _level) {
      const x = rng.pick([16, 25, 36, 49, 64, 81, 100]);
      const root = Math.round(Math.sqrt(x));
      return {
        prompt: `Berechne den Funktionswert <strong>f(${x})</strong> der Wurzelfunktion <strong>f(x) = √x</strong>.`,
        given: [`f(x) = √x`, `x = ${x}`],
        formulaHint: "Die Wurzel √x sucht die nicht-negative Zahl, deren Quadrat x ist.",
        fields: [numberField(`f(${x}) =`, root)],
        steps: [
          `Wurzel ziehen: √${x} = <strong>${root}</strong> (da ${root}² = ${x})`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Großartig! Du verstehst Wurzelfunktionen als Umkehrfunktionen.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=X8QDtWIWu6Q",
    title: "Umkehrfunktion bestimmen, Vorgehensweise, Rezept",
    author: "Daniel Jung",
  },
};

export const STAGE_POTENZEN: Stage = {
  id: "st-3-potenzen",
  stageNumber: 3,
  title: "Potenzen & Potenzfunktionen",
  subtitle: "Rationale Exponenten, Potenzfunktionen und Wurzelfunktionen",
  icon: "⚡",
  accent: "#f59e0b",
  badgeTitle: "Potenz-Meister",
  lehrplanLabel: "M10 (I) LB 3",
  lessons: [potenzgesetze, potenzfunktionen, wurzelfunktionen],
};
