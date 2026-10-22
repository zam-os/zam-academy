import type { Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const exponentialfunktionen: Lesson = {
  id: "el-1-exponentialfunktionen",
  stageId: "st-4-exponential",
  stepNumber: 1,
  title: "4.1 Exponentialfunktionen und Asymptoten",
  subtitle: "Wachstumsfaktor a, Streckfaktor b und die waagrechte Asymptote",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 4.1 / M10 (II/III) LB 3.1",
  whyItMatters:
    "Exponentielles Wachstum überholt auf Dauer jedes lineare oder quadratische Wachstum. Wer Zinseszins, Pandemien oder Rechnerleistung verstehen will, braucht Exponentialfunktionen.",
  explanationHtml: `
    <p>Eine <strong>Exponentialfunktion</strong> hat die allgemeine Gleichung:</p>
    <p class="formula-center"><strong>f(x) = b · aˣ + c  (mit a > 0, a ≠ 1, b ≠ 0)</strong></p>
    <ul>
      <li><strong>a (Basis / Wachstumsfaktor):</strong> Für <em>a > 1</em> liegt exponentielles <em>Wachstum</em> vor; für <em>0 < a < 1</em> exponentieller <em>Zerfall</em>.</li>
      <li><strong>b (Streckfaktor / Anfangswert):</strong> Bei <em>c = 0</em> schneidet der Graph die y-Achse bei <em>S_y(0|b)</em>.</li>
      <li><strong>c (vertikale Verschiebung):</strong> Bestimmt die <strong>waagrechte Asymptote y = c</strong>, an die sich der Graph im Unendlichen anschmiegt.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Exponentialfunktion",
      html: "f(x) = b · aˣ + c",
      quantities: "a > 1 Wachstum, 0 < a < 1 Zerfall, y = c waagrechte Asymptote",
    },
    {
      name: "y-Achsenabschnitt",
      html: "f(0) = b · a⁰ + c = b + c",
      quantities: "Schnittpunkt S_y(0 | b + c)",
    },
  ],
  quiz: {
    question: "Wie lautet die Gleichung der waagrechten Asymptote der Exponentialfunktion f(x) = 2 · 3ˣ - 4?",
    options: ["y = -4", "y = 2", "y = 3", "x = 0"],
    correctIndex: 0,
    explanation:
      "Für x → -∞ geht 3^x gegen 0. Der Funktionsterm nähert sich 2 · 0 - 4 = -4 an, die Asymptote ist also die Gerade y = -4.",
  },
  lab: {
    kind: "exponential-growth",
    title: "Exponential-Labor",
    intro: "Verändere Wachstumsfaktor a und Streckfaktor b, um den Verlauf der Exponentialfunktion zu erkunden.",
    params: [
      { type: "range", key: "a", label: "Wachstumsfaktor a", unit: "", min: 0.5, max: 3, step: 0.1, value: 1.5 },
      { type: "range", key: "b", label: "Anfangswert b", unit: "", min: 1, max: 5, step: 0.5, value: 2 },
    ],
    readouts: [
      {
        key: "trendVal",
        label: "Verlauf",
        compute: (v) => ((v.a ?? 1.5) > 1 ? "Exponentielles Wachstum" : "Exponentieller Zerfall"),
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle a < 1 ein, um exponentiellen Zerfall zu sehen.",
        check: (v) => (v.a ?? 1) < 1,
      },
    ],
  },
  exercises: [
    {
      id: "ex-el-1",
      make(rng, _level) {
      const b = rng.int(2, 5);
      const c = rng.int(-6, -1);
      const yAchse = b + c;
      return {
        prompt: `Gegeben ist die Exponentialfunktion <strong>f(x) = ${b} · 2ˣ + (${c})</strong>. Bestimme den y-Wert der waagrechten Asymptote <strong>y_asymptote</strong> sowie den Schnittpunkt mit der y-Achse <strong>y_0 = f(0)</strong>.`,
        given: [`f(x) = ${b} · 2ˣ + (${c})`],
        formulaHint: "Asymptote ist y = c; y-Achsenabschnitt ist f(0) = b · 2⁰ + c = b + c.",
        fields: [numberField("y_asymptote =", c), numberField("y_0 =", yAchse)],
        steps: [
          `Waagrechte Asymptote: y = c = <strong>${c}</strong>`,
          `Schnittpunkt mit der y-Achse: f(0) = ${b} · 1 + (${c}) = <strong>${yAchse}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du kennst Asymptoten und Parameter von Exponentialfunktionen.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=juzL4f0Af4k",
    title: "Exponentialfunktionen Grundlagen, Graph und Asymptote",
    author: "Daniel Jung",
  },
};

const wachstumsmodelle: Lesson = {
  id: "el-2-wachstumsmodelle",
  stageId: "st-4-exponential",
  stepNumber: 2,
  title: "4.2 Wachstumsmodelle, Halbwerts- & Verdopplungszeit",
  subtitle: "Reale Prozesse in Biologie, Physik, Chemie und Finanzmathematik",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 4.2 / M10 (II/III) LB 3.1",
  whyItMatters:
    "Halbwertszeiten bei radioaktivem Zerfall oder Medikamentenabbau im Blut und Verdopplungszeiten von Bakterienkulturen folgen exakt diesem Wachstumsmodell.",
  explanationHtml: `
    <p>Ein zeitlicher Bestand <em>N(t)</em> mit Anfangsbestand <em>N_0</em> und Zeit <em>t</em> wird beschrieben durch:</p>
    <p class="formula-center"><strong>N(t) = N_0 · aᵗ  oder  N(t) = N_0 · (1 + p/100)ᵗ</strong></p>
    <ul>
      <li><strong>Verdopplungszeit T_V:</strong> Zeitspanne, nach der sich der Bestand verdoppelt hat: <em>N(T_V) = 2 · N_0 ⟹ a^(T_V) = 2</em>.</li>
      <li><strong>Halbwertszeit T_1/2:</strong> Zeitspanne, nach der sich der Bestand halbiert hat: <em>N(T_1/2) = 0,5 · N_0 ⟹ a^(T_1/2) = 0,5</em>.</li>
      <li>Nach <em>k</em> Halbwertszeiten ist noch genau <em>(1/2)ᵏ</em> des Anfangsbestands vorhanden.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Zerfallsgesetz",
      html: "N(t) = N_0 · (1/2)^(t / T_1/2)",
      quantities: "T_1/2 Halbwertszeit",
    },
    {
      name: "Verdopplung",
      html: "N(t) = N_0 · 2^(t / T_V)",
      quantities: "T_V Verdopplungszeit",
    },
  ],
  quiz: {
    question: "Ein Stoff hat eine Halbwertszeit von T_1/2 = 8 Tagen. Welcher Bruchteil ist nach 24 Tagen (3 Halbwertszeiten) noch übrig?",
    options: ["1/8 (12,5 %)", "1/3 (33,3 %)", "1/6 (16,7 %)", "1/4 (25 %)"],
    correctIndex: 0,
    explanation:
      "Nach 24 Tagen sind genau 24 / 8 = 3 Halbwertszeiten vergangen. Es verbleibt (1/2)³ = 1/8 = 12,5 % des Ausgangsstoffes.",
  },
  lab: {
    kind: "exponential-growth",
    title: "Wachstumsmodell-Labor",
    intro: "Untersuche das Anwachsen oder Abklingen über mehrere Zeitschritte.",
    params: [
      { type: "range", key: "a", label: "Wachstumsfaktor", unit: "", min: 0.5, max: 2, step: 0.1, value: 0.5 },
      { type: "range", key: "b", label: "Anfangsmenge N_0", unit: "mg", min: 50, max: 500, step: 50, value: 100 },
    ],
    readouts: [
      {
        key: "trendVal",
        label: "Prozess",
        compute: (v) => ((v.a ?? 0.5) === 0.5 ? "Halbwertszeit (50 % Rest)" : "Allgemeiner Prozess"),
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle a = 0.5 ein, um den Halbwertszeit-Zerfall darzustellen.",
        check: (v) => Math.abs((v.a ?? 0) - 0.5) < 0.05,
      },
    ],
  },
  exercises: [
    {
      id: "ex-el-2",
      make(rng, _level) {
      const n0 = rng.pick([200, 400, 800, 1000]);
      const halfDays = rng.pick([4, 6, 8, 10]);
      const k = rng.pick([2, 3]);
      const totalDays = k * halfDays;
      const factor = Math.pow(0.5, k);
      const remaining = n0 * factor;
      return {
        prompt: `Ein radioaktives Präparat hat zu Beginn eine Masse von <strong>N_0 = ${n0} mg</strong> und eine Halbwertszeit von <strong>T = ${halfDays} Tagen</strong>. Welche Masse ist nach <strong>${totalDays} Tagen</strong> noch vorhanden?`,
        given: [`N_0 = ${n0} mg`, `T = ${halfDays} Tage`, `t = ${totalDays} Tage`],
        formulaHint: "Anzahl Halbwertszeiten k = t / T; N = N_0 · (1/2)ᵏ",
        fields: [numberField("Restmasse =", remaining, "mg", 1)],
        steps: [
          `Vergangene Halbwertszeiten: k = ${totalDays} / ${halfDays} = ${k}`,
          `Berechnung: N = ${n0} · (0,5)^${k} = ${n0} · ${factor} = <strong>${remaining} mg</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du rechnest reale Wachstums- und Zerfallsprozesse souverän aus.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=juzL4f0Af4k",
    title: "Exponentielles Wachstum und Zerfall, Halbwertszeit",
    author: "Daniel Jung",
  },
};

const logarithmus: Lesson = {
  id: "el-3-logarithmus",
  stageId: "st-4-exponential",
  stepNumber: 3,
  title: "4.3 Der Begriff des Logarithmus",
  subtitle: "Die Umkehroperation zum Potenzieren",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 4.3 / M10 (II/III) LB 3.2",
  whyItMatters:
    "Wenn man weiß, wie stark etwas gewachsen ist, und wissen will, wie lange es gedauert hat (der Exponent x), benötigt man den Logarithmus.",
  explanationHtml: `
    <p>Der <strong>Logarithmus</strong> zur Basis <em>b</em> von <em>y</em> ist die Zahl <em>x</em>, mit der man <em>b</em> potenzieren muss, um <em>y</em> zu erhalten:</p>
    <p class="formula-center"><strong>log_b(y) = x  ⟺  bˣ = y  (für b > 0, b ≠ 1 und y > 0)</strong></p>
    <ul>
      <li><em>Zweierlogarithmus (lb):</em> log_2(8) = 3, da 2³ = 8. log_2(32) = 5, da 2⁵ = 32.</li>
      <li><em>Zehnerlogarithmus (dekadischer Logarithmus lg):</em> log_10(1000) = 3, da 10³ = 1000.</li>
      <li><em>Wichtig:</em> log_b(1) = 0 und log_b(b) = 1 für jede Basis b.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Logarithmus-Definition",
      html: "log_b(y) = x ⟺ bˣ = y",
      quantities: "b Basis, y Numerus (Argument), x Exponent (Logarithmuswert)",
    },
    {
      name: "Spezielle Werte",
      html: "log_b(1) = 0 | log_b(b) = 1",
      quantities: "Da b⁰ = 1 und b¹ = b",
    },
  ],
  quiz: {
    question: "Welchen exakten Wert hat der dekadische Logarithmus lg(1000) bzw. log_2(32)?",
    options: [
      "lg(1000) = 3 und log_2(32) = 5",
      "lg(1000) = 100 und log_2(32) = 16",
      "lg(1000) = 4 und log_2(32) = 6",
      "lg(1000) = 10 und log_2(32) = 2",
    ],
    correctIndex: 0,
    explanation:
      "Da 10³ = 1000 ist, gilt lg(1000) = 3. Da 2⁵ = 32 ist, gilt log_2(32) = 5.",
  },
  lab: {
    kind: "logarithm-scale",
    title: "Logarithmus-Labor",
    intro: "Erforsche den Zusammenhang zwischen Basis, Exponent und Logarithmus.",
    params: [
      { type: "choice", key: "base", label: "Basis b", options: [{ value: 2, label: "2" }, { value: 10, label: "10" }], value: 2 },
      { type: "range", key: "arg", label: "Argument y", unit: "", min: 1, max: 64, step: 1, value: 8 },
    ],
    readouts: [
      {
        key: "logVal",
        label: "x = log_b(y)",
        digits: 2,
        emphasis: true,
        compute: (v) => Math.round((Math.log(v.arg ?? 8) / Math.log(v.base ?? 2)) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle Basis b = 2 und Argument y = 16 ein (Ergebnis x = 4).",
        check: (v) => (v.base ?? 0) === 2 && (v.arg ?? 0) === 16,
      },
    ],
  },
  exercises: [
    {
      id: "ex-el-3",
      make(rng, _level) {
      const task = rng.pick([
        { b: 2, y: 16, x: 4 },
        { b: 2, y: 32, x: 5 },
        { b: 2, y: 64, x: 6 },
        { b: 3, y: 9, x: 2 },
        { b: 3, y: 27, x: 3 },
        { b: 3, y: 81, x: 4 },
        { b: 5, y: 25, x: 2 },
        { b: 5, y: 125, x: 3 },
        { b: 10, y: 100, x: 2 },
        { b: 10, y: 1000, x: 3 },
      ]);
      return {
        prompt: `Berechne den exakten Wert des Logarithmus <strong>log_${task.b}(${task.y})</strong> im Kopf.`,
        given: [`log_${task.b}(${task.y})`],
        formulaHint: "Frage dich: Welche Hochzahl x erfüllt bˣ = y?",
        fields: [numberField("Wert =", task.x)],
        steps: [
          `Ansatz: ${task.b}ˣ = ${task.y}`,
          `Da ${task.b}^${task.x} = ${task.y} ist, folgt:`,
          `log_${task.b}(${task.y}) = <strong>${task.x}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du beherrschst die Definition des Logarithmus.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=3h00zAFRLPY",
    title: "Logarithmus, Grundlagen, Rechengesetze",
    author: "Daniel Jung",
  },
};

const logarithmengesetze: Lesson = {
  id: "el-4-logarithmengesetze",
  stageId: "st-4-exponential",
  stepNumber: 4,
  title: "4.4 Die Logarithmengesetze & Basiswechsel",
  subtitle: "Rechnen mit Produkten, Quotienten, Potenzen und beliebigen Basen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 4.3 / M10 (II/III) LB 3.2",
  whyItMatters:
    "Mit den Logarithmengesetzen lassen sich komplizierte Multiplikationen in einfache Additionen verwandeln – das historische Prinzip hinter Rechenschiebern und modernen Algorithmen.",
  explanationHtml: `
    <p>Die <strong>drei fundamentalen Logarithmengesetze</strong> spiegeln die Potenzgesetze wider:</p>
    <ul>
      <li><strong>Produktregel:</strong> log_b(u · v) = log_b(u) + log_b(v)</li>
      <li><strong>Quotientenregel:</strong> log_b(u / v) = log_b(u) - log_b(v)</li>
      <li><strong>Potenzregel:</strong> log_b(uʳ) = r · log_b(u)  <em>(Exponenten nach vorne ziehen!)</em></li>
    </ul>
    <p><strong>Basiswechselsatz:</strong> Um Logarithmen zu beliebiger Basis <em>b</em> mit dem Taschenrechner (Taste <em>log</em> oder <em>ln</em>) zu berechnen:</p>
    <p class="formula-center"><strong>log_b(a) = lg(a) / lg(b) = ln(a) / ln(b)</strong></p>
  `,
  formulas: [
    {
      name: "Logarithmengesetze",
      html: "log(u·v) = log u + log v | log(u/v) = log u - log v | log(uʳ) = r · log u",
      quantities: "u, v > 0",
    },
    {
      name: "Basiswechsel",
      html: "log_b(a) = lg a / lg b",
      quantities: "Zur Berechnung auf jedem Taschenrechner",
    },
  ],
  quiz: {
    question: "Welches Gesetz erlaubt es, einen Exponenten r im Argument vor den Logarithmus zu ziehen?",
    options: [
      "Die Potenzregel: log_b(uʳ) = r · log_b(u)",
      "Die Produktregel: log_b(u · v) = log_b(u) + log_b(v)",
      "Der Basiswechselsatz",
      "Es ist grundsätzlich verboten",
    ],
    correctIndex: 0,
    explanation:
      "Nach der Potenzregel für Logarithmen gilt log_b(uʳ) = r · log_b(u). Sie ist das Kernwerkzeug zum Lösen von Exponentialgleichungen.",
  },
  lab: {
    kind: "logarithm-scale",
    title: "Rechengesetze-Labor",
    intro: "Prüfe die Rechengesetze und den Basiswechsel nach.",
    params: [
      { type: "range", key: "base", label: "Basis b", unit: "", min: 2, max: 10, step: 1, value: 3 },
      { type: "range", key: "arg", label: "Zahl a", unit: "", min: 2, max: 50, step: 1, value: 27 },
    ],
    readouts: [
      {
        key: "logVal",
        label: "log_b(a)",
        digits: 3,
        emphasis: true,
        compute: (v) => Math.round((Math.log(v.arg ?? 27) / Math.log(v.base ?? 3)) * 1000) / 1000,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle Basis b = 3 und a = 27 ein (ergibt genau 3).",
        check: (v) => (v.base ?? 0) === 3 && (v.arg ?? 0) === 27,
      },
    ],
  },
  exercises: [
    {
      id: "ex-el-4",
      make(rng, _level) {
      const b = rng.pick([2, 3, 5, 7]);
      const a = rng.int(10, 80);
      const val = Math.round((Math.log(a) / Math.log(b)) * 100) / 100;
      return {
        prompt: `Berechne den Logarithmus <strong>log_${b}(${a})</strong> mithilfe des Basiswechselsatzes auf 2 Nachkommastellen gerundet.`,
        given: [`log_${b}(${a})`],
        formulaHint: "log_b(a) = lg(a) / lg(b)",
        fields: [numberField("Wert =", val, "", 2)],
        steps: [
          `Basiswechsel ansetzen: log_${b}(${a}) = lg(${a}) / lg(${b})`,
          `Mit Taschenrechner berechnen: ≈ <strong>${val}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Stark! Du wendest die Logarithmengesetze und den Basiswechsel zielsicher an.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=3h00zAFRLPY",
    title: "Logarithmusgesetze, Logarithmieren",
    author: "Daniel Jung",
  },
};

const exponentialgleichungen: Lesson = {
  id: "el-5-exponentialgleichungen",
  stageId: "st-4-exponential",
  stepNumber: 5,
  title: "4.5 Lösen von Exponentialgleichungen",
  subtitle: "Exponenten isolieren und durch Logarithmieren bestimmen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I) LB 4.4 / M10 (II/III) LB 3.2",
  whyItMatters:
    "Wann hat sich ein Kapital verdoppelt? Wann ist die Giftstoffkonzentration unter den Grenzwert gesunken? Diese Fragen führen immer auf Exponentialgleichungen.",
  explanationHtml: `
    <p>Eine <strong>Exponentialgleichung</strong> enthält die gesuchte Variable <em>x</em> im Exponenten:</p>
    <p class="formula-center"><strong>c · aˣ = d  ⟺  aˣ = d / c</strong></p>
    <p><strong>Lösungsverfahren durch Logarithmieren:</strong></p>
    <ol>
      <li><strong>Isolieren:</strong> Bringe die Potenz <em>aˣ</em> auf eine Seite der Gleichung.</li>
      <li><strong>Logarithmieren:</strong> Wende auf beiden Seiten den Logarithmus (z. B. lg) an: <em>lg(aˣ) = lg(d / c)</em>.</li>
      <li><strong>Potenzregel anwenden:</strong> Ziehe das <em>x</em> nach vorne: <em>x · lg(a) = lg(d / c)</em>.</li>
      <li><strong>Auflösen:</strong> Teile durch <em>lg(a)</em>: <strong>x = lg(d / c) / lg(a)</strong>.</li>
    </ol>
  `,
  formulas: [
    {
      name: "Exponentialgleichung lösen",
      html: "aˣ = y ⟹ x = lg y / lg a",
      quantities: "Beidseitiges Logarithmieren",
    },
  ],
  quiz: {
    question: "Wie lautet die exakte Lösung der Exponentialgleichung 5ˣ = 125?",
    options: ["x = 3", "x = 25", "x = 15", "x = 2"],
    correctIndex: 0,
    explanation:
      "Da 5³ = 5 · 5 · 5 = 125 ist, lautet die Lösung x = 3 (bzw. x = log_5(125) = 3).",
  },
  lab: {
    kind: "logarithm-scale",
    title: "Gleichungs-Labor",
    intro: "Löse Exponentialgleichungen graphisch und rechnerisch.",
    params: [
      { type: "range", key: "base", label: "Basis a", unit: "", min: 2, max: 5, step: 1, value: 2 },
      { type: "range", key: "arg", label: "Zielwert y", unit: "", min: 4, max: 64, step: 1, value: 32 },
    ],
    readouts: [
      {
        key: "logVal",
        label: "Lösung x",
        digits: 2,
        emphasis: true,
        compute: (v) => Math.round((Math.log(v.arg ?? 32) / Math.log(v.base ?? 2)) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle Basis a = 2 und Zielwert y = 32 ein, um die Lösung x = 5 abzulesen.",
        check: (v) => (v.base ?? 0) === 2 && (v.arg ?? 0) === 32,
      },
    ],
  },
  exercises: [
    {
      id: "ex-el-5",
      make(rng, _level) {
      const a = rng.pick([2, 3, 4, 5]);
      const x = rng.int(2, 4);
      const y = Math.pow(a, x);
      return {
        prompt: `Löse die Exponentialgleichung <strong>${a}ˣ = ${y}</strong> nach <strong>x</strong> auf.`,
        given: [`${a}ˣ = ${y}`],
        formulaHint: "x = lg(y) / lg(a)",
        fields: [numberField("x =", x)],
        steps: [
          `Beidseitig logarithmieren: lg(${a}ˣ) = lg(${y})`,
          `Potenzregel: x · lg(${a}) = lg(${y})`,
          `Teilen durch lg(${a}): x = lg(${y}) / lg(${a}) = <strong>${x}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Hervorragend! Du löst Exponentialgleichungen sicher durch Logarithmieren.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=n2P2VkA5v4M",
    title: "Logarithmus, Exponentialgleichungen lösen Teil 1",
    author: "Daniel Jung",
  },
};

export const STAGE_EXPONENTIAL: Stage = {
  id: "st-4-exponential",
  stageNumber: 4,
  title: "Exponentialfunktionen & Logarithmen",
  subtitle: "Wachstum, Halbwertszeit, Logarithmengesetze und Gleichungen",
  icon: "📈",
  accent: "#8b5cf6",
  badgeTitle: "Wachstums-Stratege",
  lehrplanLabel: "M10 (I) LB 4 / M10 (II/III) LB 3",
  lessons: [
    exponentialfunktionen,
    wachstumsmodelle,
    logarithmus,
    logarithmengesetze,
    exponentialgleichungen,
  ],
};
