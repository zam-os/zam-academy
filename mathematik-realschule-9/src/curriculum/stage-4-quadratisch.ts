import { factorForm, fmt, fmtUnit, frac, linear, paren, quadratic, sqrtHtml, vertexForm } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { fenceRect, HOOP, intersectionKind, isHit, quadraticRoots, throwFactor } from "../lab/views-quadratisch";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-4-quadratisch";
const LEHRPLAN = "M9 LB 7 (I): Quadratische Funktionen und quadratische Gleichungen";

/** A non-zero integer in [-max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

const COUNT = ["keine", "eine", "zwei"];

// 4.1 Scheitelform ───────────────────────────────────────────────────────────

const scheitelform: Lesson = {
  id: "qf-1-scheitelform",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Die verschobene Normalparabel",
  subtitle: "Den Scheitel ziehen",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Normalparabel und Scheitelform`,
  whyItMatters:
    "Brückenbögen, Wurfbahnen und Antennenschüsseln haben die Form einer Parabel. Wo ihr höchster oder tiefster Punkt liegt, verrät die Scheitelform auf einen Blick.",
  explanationHtml: `
    <p>Der Graph von y = x² heißt <strong>Normalparabel</strong>. Ihr tiefster Punkt, der <strong>Scheitel</strong>, ist S(0 | 0); sie ist symmetrisch zur y-Achse. Vom Scheitel aus geht es 1 nach rechts und 1 nach oben, 2 nach rechts und 4 nach oben, 3 nach rechts und 9 nach oben.</p>
    <p>Die Funktion <strong>f(x) = (x − d)² + e</strong> hat dieselbe Form, ist aber verschoben: Ihr Scheitel ist <strong>S(d | e)</strong>.</p>
    <ul>
      <li>(x − 3)² verschiebt um 3 nach <strong>rechts</strong>, (x + 2)² = (x − (−2))² um 2 nach <strong>links</strong>. Das Vorzeichen in der Klammer ist umgekehrt zur Verschiebung.</li>
      <li>+ e verschiebt um e nach oben, − e nach unten.</li>
      <li>Nullstellen: Liegt der Scheitel unter der x-Achse (e &lt; 0), gibt es zwei, bei e = 0 eine, bei e &gt; 0 keine.</li>
    </ul>
    <div class="example">f(x) = (x − 3)² + 5 hat den Scheitel S(3 | 5). f(x) = (x + 1)² − 4 hat S(−1 | −4) und zwei Nullstellen.</div>
    <div class="merke"><strong>Merke:</strong> f(x) = (x − d)² + e ⇒ S(d | e). Aufpassen beim Vorzeichen von d.</div>
  `,
  formulas: [
    { name: "Normalparabel", html: "y = x², S(0 | 0)", quantities: "Wertetabelle: (±1 | 1), (±2 | 4), (±3 | 9)" },
    { name: "Scheitelform", html: "f(x) = (x − d)² + e ⇒ S(d | e)", quantities: "d nach rechts, e nach oben verschoben" },
  ],
  quiz: {
    question: "Welchen Scheitel hat f(x) = (x + 2)² − 3?",
    options: ["S(2 | −3)", "S(−2 | −3)", "S(−2 | 3)"],
    correctIndex: 1,
    explanation: "(x + 2)² = (x − (−2))², also d = −2. Mit e = −3 ist der Scheitel S(−2 | −3).",
  },
  lab: {
    kind: "vertex",
    title: "Labor: Den Scheitel ziehen",
    intro: "Ziehe den Scheitel S. Die gestrichelte Treppe zeigt die Schablone der Normalparabel: 1 rechts, 1 hoch; 1 rechts, 3 hoch.",
    params: [
      { type: "range", key: "d", label: "Verschiebung d", unit: "", min: -6, max: 6, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "e", label: "Verschiebung e", unit: "", min: -4, max: 5, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "term", label: "Funktionsterm", emphasis: true, compute: (v) => `f(x) = ${vertexForm(1, v.d, v.e)}` },
      { key: "S", label: "Scheitel", compute: (v) => `S(${fmt(v.d)} | ${fmt(v.e)})` },
      { key: "zeros", label: "Nullstellen", digits: 0, compute: (v) => (v.e < 0 ? 2 : v.e === 0 ? 1 : 0) },
      { key: "f0", label: "Schnitt mit der y-Achse f(0)", digits: 2, compute: (v) => v.d * v.d + v.e },
    ],
    goals: [
      { id: "zwei-punkte", text: "Lege die Parabel durch die beiden Punkte (1 | 2) und (5 | 2).", check: (v) => v.d === 3 && v.e === -2 },
      { id: "beruehren", text: "Lass die Parabel die x-Achse links vom Ursprung berühren.", check: (v) => v.e === 0 && v.d < 0 },
      { id: "y-fuenf", text: "Die Parabel soll die y-Achse bei 5 schneiden, aber die x-Achse nicht treffen.", check: (v) => v.d * v.d + v.e === 5 && v.e > 0 },
    ],
  },
  exercises: [
    {
      id: "scheitel-ablesen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const d = rng.stepped(-6, 6, 0.5);
          const e = rng.stepped(-8, 8, 0.5);
          return {
            prompt: `Gib den Scheitel der Parabel f(x) = ${vertexForm(1, d, e)} an.`,
            given: [`f(x) = ${vertexForm(1, d, e)}`],
            formulaHint: "f(x) = (x − d)² + e ⇒ S(d | e)",
            fields: [
              numberField("x<sub>S</sub> =", d, "", 1, { slips: [{ value: -d, hint: "Vorzeichen: Bei (x − d)² liegt der Scheitel bei x = d, bei (x + 2)² also bei x = −2." }] }),
              numberField("y<sub>S</sub> =", e, "", 1),
            ],
            steps: [`Klammer: ${d === 0 ? "x²" : d > 0 ? `(x − ${fmt(d)})²` : `(x + ${fmt(-d)})² = (x − (${fmt(d)}))²`}, also d = ${fmt(d)}; e = ${fmt(e)}.`, `<strong>S(${fmt(d)} | ${fmt(e)})</strong>`],
          };
        }
        const x1 = rng.int(-6, 3);
        const x2 = x1 + rng.int(1, 8);
        const xs = (x1 + x2) / 2;
        const ys = -(((x2 - x1) / 2) ** 2);
        return {
          prompt: `Eine nach oben geöffnete, verschobene Normalparabel schneidet die x-Achse bei x₁ = ${fmt(x1)} und x₂ = ${fmt(x2)}. Wo liegt ihr Scheitel?`,
          given: [`Nullstellen ${fmt(x1)} und ${fmt(x2)}`],
          fields: [numberField("x<sub>S</sub> =", xs, "", 2), numberField("y<sub>S</sub> =", ys, "", 2)],
          steps: [`Der Scheitel liegt genau in der Mitte: x<sub>S</sub> = (${fmt(x1)} + ${paren(x2)}) : 2 = ${fmt(xs)}.`, `Von dort ${fmt((x2 - x1) / 2)} nach rechts bis zur Nullstelle: Die Normalparabel steigt dabei um ${fmt((x2 - x1) / 2)}² = ${fmt(-ys)}.`, `<strong>S(${fmt(xs)} | ${fmt(ys)})</strong>`],
        };
      },
    },
    {
      id: "funktionswert",
      make: (rng, level): ExerciseTask => {
        const d = rng.int(-5, 5);
        const e = rng.int(-6, 6);
        if (level === 1) {
          const x0 = rng.int(-6, 6);
          const y = (x0 - d) ** 2 + e;
          return {
            prompt: `Berechne für f(x) = ${vertexForm(1, d, e)} den Funktionswert f(${fmt(x0)}).`,
            given: [`f(x) = ${vertexForm(1, d, e)}`, `x = ${fmt(x0)}`],
            formulaHint: "x einsetzen: erst die Klammer, dann quadrieren, dann e addieren",
            fields: [numberField(`f(${fmt(x0)}) =`, y, "", 0, { slips: [{ value: (x0 + d) ** 2 + e, hint: "Vorzeichen in der Klammer: (x − d)." }, { value: (x0 - d) * 2 + e, hint: "Quadrieren heißt mit sich selbst malnehmen, nicht verdoppeln." }] })],
            steps: [`f(${fmt(x0)}) = (${fmt(x0)} − ${paren(d)})² ${e < 0 ? "−" : "+"} ${fmt(Math.abs(e))} = ${paren(x0 - d)}² ${e < 0 ? "−" : "+"} ${fmt(Math.abs(e))}`, `<strong>f(${fmt(x0)}) = ${fmt(y)}</strong>`],
          };
        }
        const k = rng.int(1, 5);
        const level2 = e + k * k;
        return {
          prompt: `Für welche x nimmt f(x) = ${vertexForm(1, d, e)} den Wert ${fmt(level2)} an?`,
          given: [`f(x) = ${vertexForm(1, d, e)}`, `f(x) = ${fmt(level2)}`],
          anyOrder: [0, 1],
          fields: [numberField("x₁ =", d - k, "", 2), numberField("x₂ =", d + k, "", 2)],
          steps: [`${vertexForm(1, d, e)} = ${fmt(level2)} ⇒ ${d === 0 ? "x²" : `${vertexForm(1, d, 0)}`} = ${k * k}`, `x − ${paren(d)} = ±${k}`, `<strong>x₁ = ${fmt(d - k)}, x₂ = ${fmt(d + k)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest den Scheitel aus der Scheitelform ab und verschiebst Normalparabeln im Kopf.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=i2WDgLldlJc",
    title: "Scheitelpunktform quadratischer Funktionen erkennen",
    author: "Daniel Jung",
  },
};

// 4.2 Streckfaktor ───────────────────────────────────────────────────────────

const A_VALUES = [-3, -2, -1.5, -0.5, -0.25, 0.25, 0.5, 1.5, 2, 3];

const streckfaktor: Lesson = {
  id: "qf-2-streckfaktor",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 Gestreckt, gestaucht, gespiegelt: der Faktor a",
  subtitle: "Einen Basketball in den Korb werfen",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Funktionen der Form f(x) = a(x − d)² + e`,
  whyItMatters:
    "Jeder Wurf ist eine Parabel, die nach unten geöffnet ist. Ob sie flach oder steil ist, bestimmt der Faktor a, und er lässt sich aus zwei Punkten berechnen.",
  explanationHtml: `
    <p>In <strong>f(x) = a · (x − d)² + e</strong> bleibt S(d | e) der Scheitel. Der Faktor a ändert die Form:</p>
    <ul>
      <li>|a| &gt; 1: <strong>gestreckt</strong>, schmaler als die Normalparabel.</li>
      <li>0 &lt; |a| &lt; 1: <strong>gestaucht</strong>, breiter.</li>
      <li>a &lt; 0: <strong>nach unten geöffnet</strong>, der Scheitel ist der höchste Punkt.</li>
      <li>Schablone: Vom Scheitel 1 nach rechts geht es a nach oben (bei a &lt; 0 also nach unten).</li>
    </ul>
    <p><strong>a aus einem Punkt:</strong> Kennt man den Scheitel und einen weiteren Punkt P(x<sub>P</sub> | y<sub>P</sub>), dann gilt a = ${frac("y<sub>P</sub> − e", "(x<sub>P</sub> − d)²")}.</p>
    <div class="example">Ein Ball wird bei P(0 | 2) abgeworfen und ist bei x = 2,5 am höchsten, in 4 m Höhe: a = (2 − 4) : (0 − 2,5)² = −0,32. Seine Bahn: f(x) = −0,32(x − 2,5)² + 4.</div>
    <div class="merke"><strong>Merke:</strong> a &lt; 0 heißt nach unten offen. Je größer |a|, desto schmaler die Parabel.</div>
  `,
  formulas: [
    { name: "Allgemeine Scheitelform", html: "f(x) = a · (x − d)² + e", quantities: "S(d | e); a Streckfaktor" },
    { name: "Faktor aus einem Punkt", html: `a = ${frac("y<sub>P</sub> − e", "(x<sub>P</sub> − d)²")}`, quantities: "P ein Punkt der Parabel außer S" },
  ],
  quiz: {
    question: "Was bewirkt in f(x) = −0,5 · x² der Faktor −0,5?",
    options: [
      "Die Parabel ist nach unten geöffnet und breiter als die Normalparabel",
      "Die Parabel ist nach unten geöffnet und schmaler als die Normalparabel",
      "Die Parabel ist um 0,5 nach unten verschoben",
    ],
    correctIndex: 0,
    explanation: "Das Minus spiegelt die Parabel nach unten, |−0,5| < 1 staucht sie: Sie wird breiter.",
  },
  lab: {
    kind: "basketball",
    title: "Labor: Der Freiwurf",
    intro: "Der Ball verlässt die Hand bei (0 | 2). Ziehe den höchsten Punkt der Flugbahn, bis der Ball von oben in den Korb (4,2 m entfernt, 3,05 m hoch) fällt. Der Faktor a ergibt sich daraus.",
    params: [
      { type: "range", key: "d", label: "Scheitel waagrecht d", unit: "m", min: 0.5, max: 4.15, step: 0.05, value: 2, digits: 2 },
      { type: "range", key: "e", label: "Scheitelhöhe e", unit: "m", min: 2.1, max: 5, step: 0.05, value: 3, digits: 2 },
    ],
    readouts: [
      { key: "a", label: "Faktor a", digits: 3, emphasis: true, compute: (v) => throwFactor(v) },
      { key: "atHoop", label: "Höhe am Korb", unit: "m", digits: 2, compute: (v) => throwFactor(v) * (HOOP.x - v.d) ** 2 + v.e },
      { key: "hit", label: "Ergebnis", compute: (v) => (isHit(v) ? "Treffer" : "daneben") },
    ],
    goals: [
      { id: "korb", text: "Triff den Korb.", check: (v) => isHit(v) },
      { id: "flach", text: "Triff mit einem flachen Wurf: Der Ball fliegt höchstens 3,5 m hoch.", check: (v) => isHit(v) && v.e <= 3.5 },
      { id: "steil", text: "Triff mit einem hohen Bogen: Der Ball fliegt mindestens 4,5 m hoch.", check: (v) => isHit(v) && v.e >= 4.5 },
    ],
  },
  exercises: [
    {
      id: "a-bestimmen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick(A_VALUES);
          const d = rng.int(-4, 4);
          const e = rng.int(-4, 4);
          const k = nonZero(rng, 3);
          const xP = d + k;
          const yP = a * k * k + e;
          return {
            prompt: `Eine Parabel hat den Scheitel S(${fmt(d)} | ${fmt(e)}) und geht durch P(${fmt(xP)} | ${fmt(yP)}). Bestimme den Faktor a in f(x) = a(x − d)² + e.`,
            given: [`S(${fmt(d)} | ${fmt(e)})`, `P(${fmt(xP)} | ${fmt(yP)})`],
            formulaHint: `a = (y<sub>P</sub> − e) : (x<sub>P</sub> − d)²`,
            fields: [numberField("a =", a, "", 2, { slips: [{ value: (yP - e) / (xP - d), hint: "Im Nenner steht (x_P − d) im Quadrat." }] })],
            steps: [`${fmt(yP)} = a · (${fmt(xP)} − ${paren(d)})² ${e < 0 ? "−" : "+"} ${fmt(Math.abs(e))}`, `${fmt(yP - e)} = a · ${fmt(k * k)}`, `<strong>a = ${fmt(a, 2)}</strong>`],
          };
        }
        const span = rng.pick([20, 30, 40, 50, 60]);
        const height = rng.pick([5, 6, 8, 10, 12]);
        const a = -height / (span / 2) ** 2;
        return {
          prompt: `Ein Brückenbogen hat die Form einer Parabel. Er ist ${span} m weit gespannt und in der Mitte ${height} m hoch. Lege den Scheitel auf S(0 | ${height}). Wie groß ist a?`,
          given: [`Spannweite ${span} m`, `Höhe ${height} m`, `Fußpunkte (±${span / 2} | 0)`],
          fields: [numberField("a =", a, "", 4, { slips: [{ value: -height / span ** 2, hint: "Die Fußpunkte liegen bei ±halbe Spannweite: x = ±" + span / 2 + "." }, { value: height / (span / 2) ** 2, hint: "Der Bogen ist nach unten geöffnet: a ist negativ." }] })],
          steps: [`Der Fußpunkt (${span / 2} | 0) liegt auf der Parabel: 0 = a · ${span / 2}² + ${height}`, `a = −${height} : ${(span / 2) ** 2}`, `<strong>a = ${fmt(a, 4)}</strong>`],
        };
      },
    },
    {
      id: "wurfbahn",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick(A_VALUES);
          const d = rng.int(-3, 3);
          const e = rng.int(-4, 4);
          const x0 = rng.int(-4, 4);
          const y = a * (x0 - d) ** 2 + e;
          return {
            prompt: `Berechne für f(x) = ${vertexForm(a, d, e)} den Wert f(${fmt(x0)}).`,
            given: [`f(x) = ${vertexForm(a, d, e)}`],
            formulaHint: "Erst die Klammer, dann quadrieren, dann mit a malnehmen, dann e addieren",
            fields: [numberField(`f(${fmt(x0)}) =`, y, "", 2, { slips: [{ value: (a * (x0 - d)) ** 2 + e, hint: "Nur die Klammer wird quadriert, danach mit a malgenommen." }] })],
            steps: [`(${fmt(x0)} − ${paren(d)})² = ${fmt((x0 - d) ** 2)}`, `${fmt(a)} · ${fmt((x0 - d) ** 2)} ${e < 0 ? "−" : "+"} ${fmt(Math.abs(e))} = <strong>${fmt(y, 2)}</strong>`],
          };
        }
        const a = rng.pick([-0.25, -0.5, -1, -2]);
        const d = rng.pick([1, 1.5, 2, 2.5, 3]);
        const e = rng.pick([2, 2.5, 3, 4]);
        const reach = d + Math.sqrt(-e / a);
        return {
          prompt: `Der Strahl eines Springbrunnens folgt f(x) = ${vertexForm(a, d, e)} (x und y in Metern, die Düse liegt links vom Scheitel). Wie weit von x = 0 entfernt trifft der Strahl rechts auf den Boden (y = 0)?`,
          given: [`f(x) = ${vertexForm(a, d, e)}`, "Boden: y = 0"],
          fields: [numberField("x =", reach, "m", 2, { slips: [{ value: d - Math.sqrt(-e / a), hint: "Das ist die linke Nullstelle. Gesucht ist die rechte: x = d + √(−e : a)." }] })],
          steps: [`0 = ${vertexForm(a, d, e)} ⇒ ${vertexForm(1, d, 0)} = ${fmt(-e / a, 2)}`, `x − ${fmt(d)} = ±${sqrtHtml(fmt(-e / a, 2))}`, `rechts: <strong>x = ${fmt(d)} + ${fmt(Math.sqrt(-e / a), 3)} ≈ ${fmtUnit(reach, "m")}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst am Faktor a Öffnung und Form der Parabel und berechnest a aus Scheitel und Punkt.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=KEuNUgIiIyI",
    title: "Parabel strecken, stauchen, spiegeln",
    author: "Daniel Jung",
  },
};

// 4.3 Quadratische Ergänzung ─────────────────────────────────────────────────

const ergaenzung: Lesson = {
  id: "qf-3-quadratische-ergaenzung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Quadratische Ergänzung",
  subtitle: "Das fehlende Eckquadrat",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, quadratische Ergänzung und Scheitelpunktbestimmung`,
  whyItMatters:
    "Die meisten Funktionen kommen in der Form f(x) = x² + bx + c an. Mit der quadratischen Ergänzung machst du daraus die Scheitelform und siehst sofort den höchsten oder tiefsten Punkt.",
  explanationHtml: `
    <p>Nach der 1. binomischen Formel ist (x + h)² = x² + 2hx + h². Steht <strong>x² + bx</strong> da, ist h = b/2: Es fehlt genau das Eckquadrat <strong>(b/2)²</strong>. Im Labor sieht man es: x² und zwei Streifen b/2 · x bilden ein Quadrat, dem eine Ecke fehlt.</p>
    <ol class="steps">
      <li><strong>Ergänzen und gleich wieder abziehen:</strong> x² − 8x + 10 = x² − 8x + 16 − 16 + 10</li>
      <li><strong>Binom bilden:</strong> = (x − 4)² − 16 + 10</li>
      <li><strong>Zusammenfassen:</strong> = (x − 4)² − 6, also S(4 | −6)</li>
    </ol>
    <p>Allgemein: x² + bx + c = (x + b/2)² + c − (b/2)², also <strong>S(−b/2 | c − (b/2)²)</strong>. Ist a ≠ 1, wird a zuerst aus den x-Gliedern ausgeklammert: 2x² − 12x + 7 = 2(x² − 6x) + 7 = 2[(x − 3)² − 9] + 7 = 2(x − 3)² − 11.</p>
    <div class="merke"><strong>Merke:</strong> Halbieren, quadrieren, ergänzen und abziehen. Die Hälfte von b steht dann in der Klammer.</div>
  `,
  formulas: [
    { name: "Quadratische Ergänzung", html: "x² + bx + (b/2)² = (x + b/2)²", quantities: "1. binomische Formel rückwärts" },
    { name: "Scheitel aus der allgemeinen Form", html: "x² + bx + c ⇒ S(−b/2 | c − (b/2)²)", quantities: "für a = 1" },
  ],
  quiz: {
    question: "Welche Zahl ergänzt x² + 10x zu einem vollständigen Quadrat?",
    options: ["10", "25", "100"],
    correctIndex: 1,
    explanation: "Halbieren: 10 : 2 = 5, quadrieren: 5² = 25. Dann ist x² + 10x + 25 = (x + 5)².",
  },
  lab: {
    kind: "square-tiles",
    title: "Labor: Die Kacheln",
    intro: "x² und zwei Streifen bilden ein Quadrat mit fehlender Ecke. Ziehe die Ecke des violetten Quadrats, bis es genau passt.",
    params: [
      { type: "choice", key: "b", label: "Koeffizient b", options: [2, 4, 6, 8, 10].map((b) => ({ value: b, label: `${b}x` })), value: 4 },
      { type: "range", key: "q", label: "Ergänzung", unit: "", min: 0, max: 30, step: 1, value: 0 },
      { type: "range", key: "c", label: "Konstante c", unit: "", min: -10, max: 10, step: 1, value: 0 },
    ],
    readouts: [
      { key: "fits", label: "Eckquadrat", compute: (v) => (v.q === (v.b / 2) ** 2 ? "passt genau" : v.q < (v.b / 2) ** 2 ? "zu klein" : "zu groß") },
      { key: "S", label: "Scheitel", emphasis: true, compute: (v) => (v.q === (v.b / 2) ** 2 ? `S(${fmt(-v.b / 2)} | ${fmt(v.c - v.q)})` : "erst ergänzen") },
    ],
    goals: [
      { id: "sechs", text: "Ergänze x² + 6x zu einem vollständigen Quadrat.", check: (v) => v.b === 6 && v.q === 9 },
      { id: "zehn", text: "Ergänze x² + 10x zu einem vollständigen Quadrat.", check: (v) => v.b === 10 && v.q === 25 },
      { id: "scheitel", text: "Bestimme den Scheitel von f(x) = x² + 8x + 10.", check: (v) => v.b === 8 && v.q === 16 && v.c === 10 },
    ],
  },
  exercises: [
    {
      id: "ergaenzung",
      make: (rng, level): ExerciseTask => {
        const h = nonZero(rng, 7);
        const b = 2 * h;
        if (level === 1) {
          return {
            prompt: `Ergänze x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x zu einem vollständigen Quadrat: Welche Zahl wird ergänzt, und welche Zahl steht dann in der Klammer (x + ?)²?`,
            given: [`x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x`],
            formulaHint: "Ergänzung (b/2)², in der Klammer b/2",
            fields: [
              numberField("Ergänzung:", h * h, "", 0, { slips: [{ value: b * b, hint: "Erst halbieren, dann quadrieren: (b/2)²." }, { value: Math.abs(h), hint: "Halbiert ist richtig, jetzt noch quadrieren." }] }),
              numberField("(x + ?)²: ? =", h, "", 0, { slips: [{ value: -h, hint: "Das Vorzeichen von b bleibt in der Klammer erhalten." }] }),
            ],
            steps: [`Halbieren: ${fmt(b)} : 2 = ${fmt(h)}`, `Quadrieren: ${paren(h)}² = ${h * h}`, `<strong>x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + ${h * h} = ${h < 0 ? `(x − ${-h})²` : `(x + ${h})²`}</strong>`],
          };
        }
        const c = rng.int(-10, 15);
        return {
          prompt: `Bestimme mit quadratischer Ergänzung den Scheitel von f(x) = ${quadratic(1, b, c)}.`,
          given: [`f(x) = ${quadratic(1, b, c)}`],
          fields: [numberField("x<sub>S</sub> =", -h, "", 2, { slips: [{ value: h, hint: "In der Klammer steht (x + b/2), der Scheitel liegt also bei x = −b/2." }] }), numberField("y<sub>S</sub> =", c - h * h, "", 2)],
          steps: [`f(x) = ${quadratic(1, b, 0)} + ${h * h} − ${h * h}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`}`, `= ${vertexForm(1, -h, c - h * h)}`, `<strong>S(${fmt(-h)} | ${fmt(c - h * h)})</strong>`],
        };
      },
    },
    {
      id: "scheitel-a",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const b = rng.pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]);
          const c = rng.int(-8, 8);
          const h = b / 2;
          return {
            prompt: `Bestimme den Scheitel von f(x) = ${quadratic(1, b, c)} mit quadratischer Ergänzung.`,
            given: [`f(x) = ${quadratic(1, b, c)}`],
            formulaHint: "S(−b/2 | c − (b/2)²)",
            fields: [numberField("x<sub>S</sub> =", -h, "", 2), numberField("y<sub>S</sub> =", c - h * h, "", 2, { slips: [{ value: c + h * h, hint: "Die Ergänzung wird wieder abgezogen: c − (b/2)²." }] })],
            steps: [`b/2 = ${fmt(h)}, (b/2)² = ${fmt(h * h, 2)}`, `f(x) = ${vertexForm(1, -h, c - h * h)}`, `<strong>S(${fmt(-h, 2)} | ${fmt(c - h * h, 2)})</strong>`],
          };
        }
        const a = rng.pick([2, 3, -1, -2, 0.5]);
        const d = rng.int(-4, 4);
        const e = rng.int(-9, 9);
        const b = -2 * a * d;
        const c = a * d * d + e;
        return {
          prompt: `Bestimme den Scheitel von f(x) = ${quadratic(a, b, c)}. Klammere dafür zuerst ${fmt(a)} aus den x-Gliedern aus.`,
          given: [`f(x) = ${quadratic(a, b, c)}`],
          fields: [numberField("x<sub>S</sub> =", d, "", 2), numberField("y<sub>S</sub> =", e, "", 2, { slips: [{ value: c - d * d, hint: "Nach dem Ausklammern wird die Ergänzung mit a malgenommen, bevor man sie abzieht." }] })],
          steps: [
            `f(x) = ${fmt(a)} · (${quadratic(1, b / a, 0)}) ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`,
            `= ${fmt(a)} · [${vertexForm(1, d, -d * d)}] ${c < 0 ? "−" : "+"} ${fmt(Math.abs(c))}`,
            `= ${vertexForm(a, d, e)}`,
            `<strong>S(${fmt(d)} | ${fmt(e)})</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du ergänzt x² + bx zum Quadrat und bringst jede Parabel in die Scheitelform.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=JLADCKXbeNE",
    title: "Quadratische Ergänzung Schritt für Schritt",
    author: "Daniel Jung",
  },
};

// 4.4 Lösungsformel ──────────────────────────────────────────────────────────

const loesungsformel: Lesson = {
  id: "qf-4-loesungsformel",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Quadratische Gleichungen und die Lösungsformel",
  subtitle: "Die Diskriminante entscheidet",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Lösungsformel und Diskriminante`,
  whyItMatters:
    "Wann landet der Ball? Welche Seitenlänge hat ein Rechteck mit 40 cm²? Solche Fragen führen auf ax² + bx + c = 0. Eine einzige Formel löst sie alle, und eine Zahl darin sagt vorher, wie viele Lösungen es gibt.",
  explanationHtml: `
    <p>Jede quadratische Gleichung lässt sich in die Form <strong>ax² + bx + c = 0</strong> mit a ≠ 0 bringen. Ihre Lösungen liefert die <strong>Lösungsformel</strong> (oft „Mitternachtsformel“ genannt):</p>
    <p class="formula-line">x<sub>1,2</sub> = ${frac("−b ± √(b² − 4ac)", "2a")}</p>
    <p>Der Term unter der Wurzel heißt <strong>Diskriminante D = b² − 4ac</strong>:</p>
    <ul>
      <li>D &gt; 0: zwei Lösungen, die Parabel schneidet die x-Achse zweimal.</li>
      <li>D = 0: eine Lösung x = −b : (2a), die Parabel berührt die x-Achse.</li>
      <li>D &lt; 0: keine Lösung, denn aus einer negativen Zahl gibt es keine Wurzel.</li>
    </ul>
    <div class="example">2x² + 2x − 12 = 0: a = 2, b = 2, c = −12. D = 4 + 96 = 100. x<sub>1,2</sub> = (−2 ± 10) : 4, also x₁ = 2 und x₂ = −3.</div>
    <div class="merke"><strong>Merke:</strong> Erst alles auf eine Seite bringen und a, b, c mit Vorzeichen ablesen, dann D berechnen.</div>
  `,
  formulas: [
    { name: "Lösungsformel", html: `x<sub>1,2</sub> = ${frac("−b ± √D", "2a")}`, quantities: "für ax² + bx + c = 0, a ≠ 0" },
    { name: "Diskriminante", html: "D = b² − 4ac", quantities: "D > 0: zwei, D = 0: eine, D < 0: keine Lösung" },
  ],
  quiz: {
    question: "Die Diskriminante einer quadratischen Gleichung ist negativ. Wie viele Lösungen hat die Gleichung?",
    options: ["keine", "eine", "zwei"],
    correctIndex: 0,
    explanation: "Bei D < 0 müsste man die Wurzel aus einer negativen Zahl ziehen. Die Parabel trifft die x-Achse nicht.",
  },
  lab: {
    kind: "discriminant",
    title: "Labor: Die Diskriminante",
    intro: "Stelle a, b und c ein. Die Nullstellen der Parabel sind die Lösungen der Gleichung; der Balken rechts zeigt das Vorzeichen von D.",
    params: [
      { type: "range", key: "a", label: "a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b", unit: "", min: -8, max: 8, step: 1, value: 0 },
      { type: "range", key: "c", label: "c", unit: "", min: -8, max: 8, step: 1, value: -4 },
    ],
    readouts: [
      { key: "D", label: "D = b² − 4ac", digits: 2, emphasis: true, compute: (v) => v.b * v.b - 4 * v.a * v.c },
      { key: "count", label: "Lösungen", compute: (v) => (v.a === 0 ? "keine quadratische Gleichung" : COUNT[Math.sign(v.b * v.b - 4 * v.a * v.c) + 1]) },
      { key: "x", label: "Lösungsmenge", compute: (v) => (v.a === 0 ? "–" : `{${quadraticRoots(v.a, v.b, v.c).map((x) => fmt(x, 3)).join("; ")}}`) },
    ],
    goals: [
      { id: "beruehren", text: "Erzeuge genau eine Lösung, mit b ≠ 0.", check: (v) => v.a !== 0 && v.b !== 0 && v.b * v.b - 4 * v.a * v.c === 0 },
      { id: "keine-unten", text: "Erzeuge eine Gleichung ohne Lösung, deren Parabel nach unten geöffnet ist.", check: (v) => v.a < 0 && v.b * v.b - 4 * v.a * v.c < 0 },
      {
        id: "zwei-minus-drei",
        text: "Erzeuge eine Gleichung mit den Lösungen 2 und −3.",
        check: (v) => {
          const roots = quadraticRoots(v.a, v.b, v.c);
          return v.a !== 0 && roots.length === 2 && Math.abs(roots[0] + 3) < 1e-9 && Math.abs(roots[1] - 2) < 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "loesungsformel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 1, 2, -1, 3]);
          const r1 = rng.int(-6, 6);
          let r2 = rng.int(-6, 6);
          if (r2 === r1) r2 = r1 + 2;
          const b = -a * (r1 + r2);
          const c = a * r1 * r2;
          const D = b * b - 4 * a * c;
          return {
            prompt: `Löse die Gleichung ${quadratic(a, b, c)} = 0 mit der Lösungsformel.`,
            given: [`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`],
            formulaHint: `D = b² − 4ac, x<sub>1,2</sub> = (−b ± √D) : (2a)`,
            anyOrder: [1, 2],
            fields: [
              numberField("D =", D, "", 2, { slips: [{ value: b * b + 4 * a * c, hint: "D = b² − 4ac: Achte auf das Minus und die Vorzeichen von a und c." }] }),
              numberField("x₁ =", r1, "", 2),
              numberField("x₂ =", r2, "", 2),
            ],
            steps: [`D = ${paren(b)}² − 4 · ${paren(a)} · ${paren(c)} = ${fmt(D)}`, `x<sub>1,2</sub> = (${fmt(-b)} ± ${fmt(Math.sqrt(D))}) : ${paren(2 * a)}`, `<strong>x₁ = ${fmt(Math.min(r1, r2))}, x₂ = ${fmt(Math.max(r1, r2))}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const width = rng.int(3, 12);
          const more = rng.int(1, 8);
          const area = width * (width + more);
          return {
            prompt: `Ein Rechteck ist ${more} cm länger als breit und hat den Flächeninhalt ${area} cm². Wie breit und wie lang ist es?`,
            given: [`x · (x + ${more}) = ${area}`],
            fields: [numberField("Breite:", width, "cm", 2), numberField("Länge:", width + more, "cm", 2)],
            steps: [`x² + ${more}x − ${area} = 0, D = ${more * more} + ${4 * area} = ${more * more + 4 * area}`, `x = (−${more} ± ${fmt(Math.sqrt(more * more + 4 * area))}) : 2; nur die positive Lösung passt: x = ${width}.`, `<strong>Breite ${width} cm, Länge ${width + more} cm</strong>`],
          };
        }
        const n1 = rng.int(1, 9);
        const n2 = -rng.int(2, 10);
        const p = -(n1 + n2);
        const q = n1 * n2;
        const multiple = Math.abs(p) === 1 ? "die Zahl selbst" : `das ${Math.abs(p)}-Fache der Zahl`;
        const middle = p === 0 ? "" : p > 0 ? ` plus ${multiple}` : ` minus ${multiple}`;
        return {
          prompt: `Das Quadrat einer Zahl${middle} ergibt ${-q}. Welche Zahlen erfüllen das?`,
          given: [`x² ${p === 0 ? "" : p > 0 ? `+ ${p}x` : `− ${-p}x`} = ${-q}`],
          anyOrder: [0, 1],
          fields: [numberField("x₁ =", n1, "", 2), numberField("x₂ =", n2, "", 2)],
          steps: [`${quadratic(1, p, q)} = 0, D = ${p * p} − 4 · ${paren(q)} = ${p * p - 4 * q}`, `x<sub>1,2</sub> = (${fmt(-p)} ± ${fmt(Math.sqrt(p * p - 4 * q))}) : 2`, `<strong>x₁ = ${fmt(n1)}, x₂ = ${fmt(n2)}</strong>`],
        };
      },
    },
    {
      id: "anzahl",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          const a = rng.pick([1, 2, -1, -2, 3]);
          let b: number;
          let c: number;
          if (kind === 2) {
            const r1 = rng.int(-5, 5);
            const r2 = r1 + rng.int(1, 6);
            b = -a * (r1 + r2);
            c = a * r1 * r2;
          } else if (kind === 1) {
            const r = rng.int(-5, 5);
            b = -2 * a * r;
            c = a * r * r;
          } else {
            const d = rng.int(-4, 4);
            const e = rng.int(1, 6) * Math.sign(a);
            b = -2 * a * d;
            c = a * d * d + e;
          }
          const D = b * b - 4 * a * c;
          return {
            prompt: `Wie viele Lösungen hat ${quadratic(a, b, c)} = 0? Berechne die Diskriminante.`,
            given: [`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`],
            formulaHint: "D = b² − 4ac",
            fields: [numberField("D =", D, "", 0), choiceField("Lösungen", COUNT, kind)],
            steps: [`D = ${paren(b)}² − 4 · ${paren(a)} · ${paren(c)} = ${fmt(D)}`, `<strong>D ${D > 0 ? "> 0: zwei Lösungen" : D === 0 ? "= 0: eine Lösung" : "< 0: keine Lösung"}</strong>`],
          };
        }
        const h = nonZero(rng, 6);
        const b = 2 * h;
        return {
          prompt: `Für welchen Wert von c hat die Gleichung x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + c = 0 genau eine Lösung? Wie heißt diese Lösung?`,
          given: [`x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + c = 0`],
          fields: [numberField("c =", h * h, "", 2), numberField("x =", -h, "", 2)],
          steps: [`Genau eine Lösung bei D = 0: ${b * b} − 4c = 0`, `c = ${b * b} : 4 = ${h * h}; dann ist x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + ${h * h} = ${h < 0 ? `(x − ${-h})²` : `(x + ${h})²`}`, `<strong>c = ${h * h}, x = ${fmt(-h)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst quadratische Gleichungen mit der Lösungsformel und weißt vorher, wie viele Lösungen es gibt.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=ukEXR0DKMQg",
    title: "Mitternachtsformel (abc-Formel) lösen",
    author: "Daniel Jung",
  },
};

// 4.5 Linearfaktoren ─────────────────────────────────────────────────────────

const linearfaktoren: Lesson = {
  id: "qf-5-linearfaktoren",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Nullstellen und Linearfaktoren",
  subtitle: "Ein Produkt ist null, wenn ein Faktor null ist",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Nullstellen und Linearfaktorzerlegung`,
  whyItMatters:
    "In der Linearfaktorform stehen die Nullstellen schon da, ganz ohne Rechnen. Und wer zwei Nullstellen kennt, kann die ganze Parabel aufschreiben.",
  explanationHtml: `
    <p><strong>Satz vom Nullprodukt:</strong> Ein Produkt ist genau dann null, wenn mindestens ein Faktor null ist. Deshalb hat</p>
    <p class="formula-line"><strong>f(x) = a · (x − x₁) · (x − x₂)</strong></p>
    <p>die Nullstellen x₁ und x₂. Das ist die <strong>Linearfaktorform</strong>.</p>
    <ul>
      <li>Der Scheitel liegt genau in der Mitte zwischen den Nullstellen: x<sub>S</sub> = (x₁ + x₂) : 2.</li>
      <li>Ausmultiplizieren ergibt die allgemeine Form: a(x − x₁)(x − x₂) = a · (x² − (x₁ + x₂)x + x₁ · x₂).</li>
      <li>Fehlt das c (z. B. x² − 5x), klammert man x aus: x(x − 5), Nullstellen 0 und 5.</li>
    </ul>
    <div class="example">f(x) = (x − 2)(x + 5) hat die Nullstellen 2 und −5. Ausmultipliziert: x² + 3x − 10. Scheitel bei x = (2 − 5) : 2 = −1,5.</div>
    <div class="merke"><strong>Merke:</strong> Nullstellen sind die Zahlen, die die Klammern null machen. Das Vorzeichen in der Klammer ist umgekehrt.</div>
  `,
  formulas: [
    { name: "Linearfaktorform", html: "f(x) = a · (x − x₁) · (x − x₂)", quantities: "x₁, x₂ Nullstellen, a Streckfaktor" },
    { name: "Satz vom Nullprodukt", html: "u · v = 0 ⇔ u = 0 oder v = 0", quantities: "gilt für jedes Produkt" },
  ],
  quiz: {
    question: "Welche Nullstellen hat f(x) = (x − 2)(x + 5)?",
    options: ["2 und 5", "2 und −5", "−2 und 5"],
    correctIndex: 1,
    explanation: "x − 2 = 0 für x = 2, x + 5 = 0 für x = −5. Das Vorzeichen in der Klammer ist umgekehrt.",
  },
  lab: {
    kind: "roots",
    title: "Labor: Nullstellen ziehen",
    intro: "Ziehe die beiden Nullstellen auf der x-Achse und den Punkt rechts für den Faktor a. Die Linearfaktorform und die ausmultiplizierte Form stehen oben.",
    params: [
      { type: "range", key: "x1", label: "Nullstelle x₁", unit: "", min: -6, max: 6, step: 0.5, value: -1, digits: 1 },
      { type: "range", key: "x2", label: "Nullstelle x₂", unit: "", min: -6, max: 6, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "a", label: "Faktor a", unit: "", min: -2, max: 2, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "factor", label: "Linearfaktorform", emphasis: true, compute: (v) => `f(x) = ${v.a === 0 ? "0" : factorForm(v.a, v.x1, v.x2)}` },
      { key: "general", label: "allgemeine Form", compute: (v) => `f(x) = ${quadratic(v.a, -v.a * (v.x1 + v.x2), v.a * v.x1 * v.x2)}` },
      { key: "S", label: "Scheitel", compute: (v) => { const xs = (v.x1 + v.x2) / 2; return `S(${fmt(xs, 2)} | ${fmt(v.a * (xs - v.x1) * (xs - v.x2), 2)})`; } },
    ],
    goals: [
      { id: "zwei-fuenf", text: "Stelle f(x) = (x − 2)(x + 5) ein.", check: (v) => v.a === 1 && [v.x1, v.x2].sort((p, q) => p - q).join() === "-5,2" },
      { id: "doppelt", text: "Erzeuge eine doppelte Nullstelle bei x = 3 mit einer nach unten geöffneten Parabel.", check: (v) => v.x1 === 3 && v.x2 === 3 && v.a < 0 },
      { id: "allgemein", text: "Stelle die Parabel von f(x) = 2x² − 4x − 6 ein.", check: (v) => v.a === 2 && [v.x1, v.x2].sort((p, q) => p - q).join() === "-1,3" },
    ],
  },
  exercises: [
    {
      id: "nullstellen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 2, -1, 0.5, -3]);
          const p = rng.int(-7, 7);
          let q = rng.int(-7, 7);
          if (q === p) q = p + 3;
          return {
            prompt: `Gib die Nullstellen von f(x) = ${factorForm(a, p, q)} an.`,
            given: [`f(x) = ${factorForm(a, p, q)}`],
            formulaHint: "Jede Klammer null setzen",
            anyOrder: [0, 1],
            fields: [
              numberField("x₁ =", p, "", 2, { slips: [{ value: -p, hint: "Vorzeichen: (x − 2) wird null für x = 2, (x + 5) für x = −5." }] }),
              numberField("x₂ =", q, "", 2, { slips: [{ value: -q, hint: "Vorzeichen: (x − 2) wird null für x = 2, (x + 5) für x = −5." }] }),
            ],
            steps: [`Satz vom Nullprodukt: ${p === 0 ? "x = 0" : `${p > 0 ? `x − ${p}` : `x + ${-p}`} = 0`} oder ${q === 0 ? "x = 0" : `${q > 0 ? `x − ${q}` : `x + ${-q}`} = 0`}`, `<strong>x₁ = ${fmt(p)}, x₂ = ${fmt(q)}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const a = rng.pick([1, 2, -1, 3]);
          const r = nonZero(rng, 8);
          const b = -a * r;
          return {
            prompt: `Bestimme die Nullstellen von f(x) = ${quadratic(a, b, 0)} durch Ausklammern.`,
            given: [`f(x) = ${quadratic(a, b, 0)}`],
            anyOrder: [0, 1],
            fields: [numberField("x₁ =", 0, "", 2), numberField("x₂ =", r, "", 2)],
            steps: [`f(x) = ${factorForm(a, 0, r)}`, `<strong>x₁ = 0, x₂ = ${fmt(r)}</strong>`],
          };
        }
        const a = rng.pick([1, 2, 3, -1]);
        const k = rng.int(1, 7);
        return {
          prompt: `Bestimme die Nullstellen von f(x) = ${quadratic(a, 0, -a * k * k)}.`,
          given: [`f(x) = ${quadratic(a, 0, -a * k * k)}`],
          anyOrder: [0, 1],
          fields: [numberField("x₁ =", -k, "", 2), numberField("x₂ =", k, "", 2)],
          steps: [`${quadratic(a, 0, 0)} = ${fmt(a * k * k)} ⇒ x² = ${k * k}`, `<strong>x₁ = −${k}, x₂ = ${k}</strong>, also f(x) = ${factorForm(a, -k, k)}`],
        };
      },
    },
    {
      id: "ausmultiplizieren",
      make: (rng, level): ExerciseTask => {
        const x1 = rng.int(-6, 6);
        let x2 = rng.int(-6, 6);
        if (x2 === x1) x2 = x1 - 2;
        if (level === 1) {
          const a = rng.pick([1, 2, -1, 3]);
          const b = -a * (x1 + x2);
          const c = a * x1 * x2;
          return {
            prompt: `Eine Parabel hat die Nullstellen ${fmt(x1)} und ${fmt(x2)} und den Faktor a = ${fmt(a)}. Schreibe sie in der allgemeinen Form f(x) = ax² + bx + c. Wie heißen b und c?`,
            given: [`f(x) = ${factorForm(a, x1, x2)}`],
            formulaHint: "a(x − x₁)(x − x₂) = a(x² − (x₁ + x₂)x + x₁ · x₂)",
            fields: [numberField("b =", b, "", 2), numberField("c =", c, "", 2, { slips: [{ value: -c, hint: "x₁ · x₂ mit Vorzeichen: (x − 2)(x + 5) ergibt −10." }] })],
            steps: [`(x − ${paren(x1)})(x − ${paren(x2)}) = x² − (${fmt(x1 + x2)})x + (${fmt(x1 * x2)})`, `mal ${fmt(a)}: f(x) = ${quadratic(a, b, c)}`, `<strong>b = ${fmt(b)}, c = ${fmt(c)}</strong>`],
          };
        }
        const a = rng.pick([1, 2, -1, -2, 0.5]);
        // a point that is no root, so it fixes a
        const P0 = [0, 1, -1, 2, -2].find((x) => x !== x1 && x !== x2) ?? 3;
        const yP = a * (P0 - x1) * (P0 - x2);
        return {
          prompt: `Eine Parabel hat die Nullstellen x₁ = ${fmt(x1)} und x₂ = ${fmt(x2)} und geht durch den Punkt P(${fmt(P0)} | ${fmt(yP)}). Bestimme a, b und c in f(x) = ax² + bx + c.`,
          given: [`Nullstellen ${fmt(x1)} und ${fmt(x2)}`, `P(${fmt(P0)} | ${fmt(yP)})`],
          fields: [numberField("a =", a, "", 2), numberField("b =", -a * (x1 + x2), "", 2), numberField("c =", a * x1 * x2, "", 2)],
          steps: [`f(x) = a · ${factorForm(1, x1, x2)}`, `P einsetzen: ${fmt(yP)} = a · (${fmt(P0)} − ${paren(x1)})(${fmt(P0)} − ${paren(x2)}) = a · ${fmt((P0 - x1) * (P0 - x2))}, also a = ${fmt(a)}`, `<strong>f(x) = ${quadratic(a, -a * (x1 + x2), a * x1 * x2)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest Nullstellen aus der Linearfaktorform ab und baust aus zwei Nullstellen eine Parabel.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=wRc6AtV7HmY",
    title: "Linearfaktorzerlegung Parabel Nullstellen",
    author: "Daniel Jung",
  },
};

// 4.6 Parabel und Gerade ─────────────────────────────────────────────────────

const parabelGerade: Lesson = {
  id: "qf-6-parabel-gerade",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "4.6 Parabel und Gerade",
  subtitle: "Sekante, Tangente, Passante",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, gemeinsame Punkte von Parabel und Gerade`,
  whyItMatters:
    "Wo trifft der Ball die Rampe? Berührt die Straße den Hügel oder schneidet sie hinein? Gemeinsame Punkte von Parabel und Gerade findet man mit einer quadratischen Gleichung.",
  explanationHtml: `
    <p>Gemeinsame Punkte von Parabel y = f(x) und Gerade y = g(x) findet man durch <strong>Gleichsetzen</strong>: f(x) = g(x). Bringt man alles auf eine Seite, entsteht eine quadratische Gleichung. Ihre Diskriminante entscheidet:</p>
    <ul>
      <li>D &gt; 0: zwei Schnittpunkte, die Gerade ist eine <strong>Sekante</strong>.</li>
      <li>D = 0: ein Berührpunkt, die Gerade ist eine <strong>Tangente</strong>.</li>
      <li>D &lt; 0: kein gemeinsamer Punkt, die Gerade ist eine <strong>Passante</strong>.</li>
    </ul>
    <p>Die y-Koordinaten erhält man durch Einsetzen der x-Werte in die Geradengleichung.</p>
    <div class="example">y = x² − 4 und y = 2x − 1: x² − 4 = 2x − 1 ⇒ x² − 2x − 3 = 0 ⇒ (x − 3)(x + 1) = 0. Schnittpunkte (3 | 5) und (−1 | −3).</div>
    <div class="merke"><strong>Merke:</strong> Gleichsetzen, auf null bringen, D berechnen, x-Werte, y-Werte.</div>
  `,
  formulas: [
    { name: "Gemeinsame Punkte", html: "f(x) = g(x) ⇒ ax² + bx + c = 0", quantities: "D > 0 Sekante, D = 0 Tangente, D < 0 Passante" },
  ],
  quiz: {
    question: "Eine Gerade, die nicht senkrecht ist, hat mit einer Parabel genau einen gemeinsamen Punkt. Wie heißt sie?",
    options: ["Sekante", "Tangente", "Passante"],
    correctIndex: 1,
    explanation: "Eine Tangente berührt die Parabel in genau einem Punkt; die Gleichung beim Gleichsetzen hat dann D = 0.",
  },
  lab: {
    kind: "parabola-line",
    title: "Labor: Die Gerade an der Parabel",
    intro: "Die Parabel ist y = x² − 4. Ziehe die Gerade an ihrem Achsenabschnitt und an ihrem Steigungspunkt.",
    params: [
      { type: "range", key: "m", label: "Steigung m", unit: "", min: -4, max: 4, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "t", label: "Achsenabschnitt t", unit: "", min: -6, max: 6, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "D", label: "D", digits: 3, emphasis: true, compute: (v) => intersectionKind(v.m, v.t).D },
      { key: "kind", label: "Lage", compute: (v) => { const D = intersectionKind(v.m, v.t).D; return D > 0 ? "Sekante" : D === 0 ? "Tangente" : "Passante"; } },
      { key: "points", label: "gemeinsame Punkte", compute: (v) => { const { xs } = intersectionKind(v.m, v.t); return xs.length === 0 ? "keine" : xs.map((x) => `(${fmt(x, 2)} | ${fmt(v.m * x + v.t, 2)})`).join(", "); } },
    ],
    goals: [
      { id: "tangente", text: "Lege die Gerade als Tangente an die Parabel.", check: (v) => intersectionKind(v.m, v.t).D === 0 },
      { id: "passante-steigend", text: "Erzeuge eine steigende Passante.", check: (v) => v.m > 0 && intersectionKind(v.m, v.t).D < 0 },
      { id: "sekante-punkte", text: "Lege eine Sekante durch die Parabelpunkte mit x = −1 und x = 3.", check: (v) => v.m === 2 && v.t === -1 },
    ],
  },
  exercises: [
    {
      id: "schnittpunkte",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r1 = rng.int(-5, 4);
          const r2 = r1 + rng.int(1, 6);
          const m = rng.int(-3, 3);
          const t = rng.int(-4, 4);
          const p = m - (r1 + r2);
          const q = t + r1 * r2;
          return {
            prompt: `Berechne die x-Koordinaten der Schnittpunkte von y = ${quadratic(1, p, q)} und y = ${linear(m, t)}.`,
            given: [`Parabel y = ${quadratic(1, p, q)}`, `Gerade y = ${linear(m, t)}`],
            formulaHint: "Gleichsetzen, auf null bringen, Lösungsformel",
            anyOrder: [0, 1],
            fields: [numberField("x₁ =", r1, "", 2), numberField("x₂ =", r2, "", 2)],
            steps: [`${quadratic(1, p, q)} = ${linear(m, t)}`, `${quadratic(1, p - m, q - t)} = 0, D = ${fmt((p - m) ** 2 - 4 * (q - t))}`, `<strong>x₁ = ${fmt(r1)}, x₂ = ${fmt(r2)}</strong>`],
          };
        }
        const m = rng.pick([-4, -2, 2, 4, 6]);
        return {
          prompt: `Für welchen Wert von t ist die Gerade y = ${linear(m, 0)} + t eine Tangente an die Normalparabel y = x²? In welchem x berührt sie?`,
          given: [`y = x²`, `y = ${linear(m, 0)} + t`],
          fields: [numberField("t =", -(m * m) / 4, "", 2), numberField("x =", m / 2, "", 2)],
          steps: [`x² = ${linear(m, 0)} + t ⇒ x² ${m > 0 ? "−" : "+"} ${Math.abs(m)}x − t = 0`, `Tangente bei D = ${m * m} + 4t = 0 ⇒ t = ${fmt(-(m * m) / 4)}`, `<strong>t = ${fmt(-(m * m) / 4)}, Berührpunkt bei x = ${fmt(m / 2)}</strong>`],
        };
      },
    },
    {
      id: "lage",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          // 0 Passante, 1 Tangente, 2 Sekante
          const kind = rng.int(0, 2);
          const x0 = rng.int(-3, 3);
          // The tangent to y = x² at (x0 | x0²) has the slope 2·x0.
          const slope = kind === 1 ? 2 * x0 : rng.int(-3, 3);
          const t = kind === 1 ? -x0 * x0 : -(slope * slope) / 4 + (kind === 2 ? rng.int(1, 6) : -rng.int(1, 5));
          const D = slope * slope + 4 * t;
          const k = kind;
          return {
            prompt: `Wie liegt die Gerade y = ${linear(slope, t)} zur Normalparabel y = x²? Berechne die Diskriminante der Gleichung x² = ${linear(slope, t)}.`,
            given: [`y = x²`, `y = ${linear(slope, t)}`],
            formulaHint: `x² − ${paren(slope)}x − ${paren(t)} = 0, D = m² + 4t`,
            fields: [numberField("D =", D, "", 2), choiceField("Lage", ["Passante", "Tangente", "Sekante"], k)],
            steps: [`x² ${slope === 0 ? "" : slope > 0 ? `− ${slope}x ` : `+ ${-slope}x `}${t === 0 ? "" : t > 0 ? `− ${t} ` : `+ ${-t} `}= 0`, `D = ${paren(slope)}² + 4 · ${paren(t)} = ${fmt(D)}`, `<strong>${D > 0 ? "Sekante" : D === 0 ? "Tangente" : "Passante"}</strong>`],
          };
        }
        const k = rng.pick([0.2, 0.25, 0.5]);
        const b = rng.pick([2, 3, 4]);
        const c = rng.pick([0, 1, 1.5, 2]);
        const m = rng.pick([0.4, 0.5, 1, -0.5]);
        const x = (b - m) / k;
        return {
          prompt: `Ein Ball fliegt auf der Bahn y = ${quadratic(-k, b, c)}. Eine gerade Rampe verläuft auf y = ${linear(m, c)}; beide beginnen bei x = 0 im selben Punkt. Bei welchem x landet der Ball wieder auf der Rampe?`,
          given: [`Ball: y = ${quadratic(-k, b, c)}`, `Rampe: y = ${linear(m, c)}`],
          fields: [numberField("x =", x, "m", 2, { slips: [{ value: 0, hint: "x = 0 ist der Startpunkt. Gesucht ist der zweite gemeinsame Punkt." }] })],
          steps: [`${quadratic(-k, b, c)} = ${linear(m, c)} ⇒ ${quadratic(-k, b - m, 0)} = 0`, `x · (${linear(-k, b - m)}) = 0 ⇒ x = 0 oder x = ${fmt(b - m, 2)} : ${fmt(k, 2)}`, `<strong>x = ${fmt(x, 2)} m</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest gemeinsame Punkte von Parabel und Gerade und unterscheidest Sekante, Tangente und Passante.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=T7wnzYyfc1o",
    title: "Schnittpunkt Parabel und Gerade berechnen",
    author: "Lehrerschmidt",
  },
};

// 4.7 Extremwerte ────────────────────────────────────────────────────────────

const extremwerte: Lesson = {
  id: "qf-7-extremwerte",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "4.7 Größter Inhalt, höchster Punkt",
  subtitle: "Mit 20 m Zaun das größte Gehege bauen",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN}, Extremwerte in Anwendungen`,
  whyItMatters:
    "Wie hoch fliegt der Ball? Welches Gehege wird mit demselben Zaun am größten? Wird eine Größe durch eine quadratische Funktion beschrieben, liegt das Beste genau im Scheitel.",
  explanationHtml: `
    <p>Der Scheitel einer Parabel ist ihr <strong>tiefster Punkt</strong> (a &gt; 0, Minimum) oder ihr <strong>höchster Punkt</strong> (a &lt; 0, Maximum). Bei Anwendungen geht man so vor:</p>
    <ol class="steps">
      <li>Die Größe, die möglichst groß oder klein werden soll, als Term mit einer Variablen schreiben.</li>
      <li>Den Term in die Scheitelform bringen (quadratische Ergänzung) oder den Scheitel aus den Nullstellen bestimmen.</li>
      <li>Den Scheitel im Sachzusammenhang deuten.</li>
    </ol>
    <div class="example">20 m Zaun für ein Rechteck: 2x + 2y = 20, also y = 10 − x. A(x) = x · (10 − x) = −x² + 10x = −(x − 5)² + 25. Das größte Gehege hat x = 5 m und y = 5 m: ein Quadrat mit 25 m².</div>
    <div class="merke"><strong>Merke:</strong> Der Scheitel liegt in der Mitte zwischen den Nullstellen. Bei A(x) = x(10 − x) also bei x = 5.</div>
  `,
  formulas: [
    { name: "Extremwert", html: "f(x) = a(x − d)² + e: Extremwert e bei x = d", quantities: "a < 0 Maximum, a > 0 Minimum" },
  ],
  quiz: {
    question: "Ein Rechteck soll 40 m Umfang haben. Für welche Seitenlänge x wird sein Flächeninhalt am größten?",
    options: ["x = 10 m, es ist dann ein Quadrat", "x = 20 m", "x = 5 m"],
    correctIndex: 0,
    explanation: "A(x) = x · (20 − x) hat die Nullstellen 0 und 20, der Scheitel liegt bei x = 10. Dann ist auch y = 10: ein Quadrat.",
  },
  lab: {
    kind: "fence",
    title: "Labor: Das Gehege",
    intro: "Ziehe die Ecke des Geheges. Rechts siehst du den Flächeninhalt A als Funktion von x, eine nach unten geöffnete Parabel.",
    params: [
      { type: "choice", key: "mode", label: "Gehege", options: [{ value: 0, label: "frei stehend (4 Seiten)" }, { value: 1, label: "an einer Mauer (3 Seiten)" }], value: 0 },
      { type: "choice", key: "L", label: "Zaunlänge", options: [20, 24, 40].map((n) => ({ value: n, label: `${n} m` })), value: 20 },
      { type: "range", key: "x", label: "Seite x", unit: "m", min: 0.5, max: 20, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "y", label: "andere Seite y", unit: "m", digits: 2, compute: (v) => Math.max(0, fenceRect(v).y) },
      { key: "A", label: "Flächeninhalt A", unit: "m²", digits: 2, emphasis: true, compute: (v) => fenceRect(v).area },
      { key: "best", label: "größtmöglicher Inhalt", unit: "m²", digits: 2, compute: (v) => fenceRect(v).best },
    ],
    goals: [
      { id: "quadrat", text: "Frei stehend mit 20 m Zaun: Baue das größte Gehege.", check: (v) => v.mode === 0 && v.L === 20 && v.x === 5 },
      { id: "mauer", text: "An der Mauer mit 24 m Zaun: Baue das größte Gehege.", check: (v) => v.mode === 1 && v.L === 24 && v.x === 6 },
      { id: "sechsundneunzig", text: "Baue frei stehend mit 40 m Zaun ein Gehege mit genau 96 m².", check: (v, r) => v.mode === 0 && v.L === 40 && Number(r.A) === 96 },
    ],
  },
  exercises: [
    {
      id: "maximum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const d = rng.int(-5, 6);
          const e = rng.int(-6, 12);
          const b = 2 * d;
          const c = e - d * d;
          return {
            prompt: `Bestimme den höchsten Punkt der Parabel f(x) = ${quadratic(-1, b, c)}.`,
            given: [`f(x) = ${quadratic(-1, b, c)}`],
            formulaHint: "−1 ausklammern, quadratisch ergänzen: f(x) = −(x − d)² + e",
            fields: [numberField("x =", d, "", 2), numberField("höchster Wert =", e, "", 2)],
            steps: [`f(x) = −(${quadratic(1, -b, 0)})${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`}`, `= ${vertexForm(-1, d, e)}`, `<strong>Hochpunkt (${fmt(d)} | ${fmt(e)})</strong>`],
          };
        }
        const v0 = rng.pick([10, 12, 15, 20, 25]);
        const h0 = rng.pick([1, 1.5, 2]);
        const tMax = v0 / 10;
        const hMax = h0 + (v0 * v0) / 20;
        return {
          prompt: `Ein Ball wird senkrecht nach oben geworfen. Seine Höhe in Metern nach t Sekunden ist h(t) = ${quadratic(-5, v0, h0).replace(/x/g, "t")}. Wann erreicht er seine größte Höhe, und wie hoch ist sie?`,
          given: [`h(t) = ${quadratic(-5, v0, h0).replace(/x/g, "t")}`],
          fields: [numberField("t =", tMax, "s", 2), numberField("h =", hMax, "m", 2)],
          steps: [`h(t) = −5(t² − ${fmt(v0 / 5)}t) + ${fmt(h0)}`, `= −5(t − ${fmt(tMax)})² + ${fmt(hMax)}`, `<strong>Nach ${fmt(tMax)} s ist der Ball ${fmtUnit(hMax, "m")} hoch.</strong>`],
        };
      },
    },
    {
      id: "rechteck",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const u = rng.pick([12, 16, 20, 24, 30, 36, 40, 48]);
          return {
            prompt: `Ein Rechteck hat den Umfang ${u} cm. Für welche Seitenlänge x ist sein Flächeninhalt am größten, und wie groß ist er?`,
            given: [`2x + 2y = ${u}`, `A(x) = x · (${u / 2} − x)`],
            formulaHint: "Der Scheitel liegt in der Mitte der Nullstellen 0 und U/2",
            fields: [numberField("x =", u / 4, "cm", 2), numberField("A =", (u * u) / 16, "cm²", 2)],
            steps: [`A(x) = x(${u / 2} − x) hat die Nullstellen 0 und ${u / 2}.`, `Scheitel bei x = ${fmt(u / 4)}, dann ist auch y = ${fmt(u / 4)}.`, `<strong>x = ${fmt(u / 4)} cm, A = ${fmt((u * u) / 16)} cm²</strong>`],
          };
        }
        const L = rng.pick([16, 20, 24, 30, 40, 50]);
        return {
          prompt: `An einer langen Hauswand soll ein rechteckiges Beet mit ${L} m Zaun eingefasst werden; an der Wand braucht es keinen Zaun. Wie lang muss die Seite x senkrecht zur Wand sein, damit das Beet am größten wird, und wie groß wird es?`,
          given: [`2x + y = ${L}`, `A(x) = x · (${L} − 2x)`],
          fields: [numberField("x =", L / 4, "m", 2, { slips: [{ value: L / 3, hint: "Drei gleich lange Seiten sind nicht das Beste: Der Scheitel von A(x) = x(L − 2x) liegt bei x = L : 4." }] }), numberField("A =", (L * L) / 8, "m²", 2)],
          steps: [`A(x) = x(${L} − 2x) hat die Nullstellen 0 und ${L / 2}.`, `Scheitel bei x = ${fmt(L / 4)}, dann y = ${L} − 2 · ${fmt(L / 4)} = ${fmt(L / 2)}.`, `<strong>x = ${fmt(L / 4)} m, A = ${fmt((L * L) / 8)} m²</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest Höchst- und Tiefstwerte im Scheitel und löst damit Optimierungsaufgaben.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=G-Y_z65qvnM",
    title: "Extremwertproblem ohne Ableitung lösen",
    author: "Daniel Jung",
  },
};

export const STAGE_QUADRATISCH: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Quadratische Funktionen und Gleichungen",
  subtitle: "Scheitelform, quadratische Ergänzung, Lösungsformel, Linearfaktoren, Extremwerte",
  icon: "⛲",
  accent: "#ea580c",
  badgeTitle: "Parabel-Profi",
  lehrplanLabel: "LB 7 (nur Zweig I)",
  lessons: [scheitelform, streckfaktor, ergaenzung, loesungsformel, linearfaktoren, parabelGerade, extremwerte],
};
