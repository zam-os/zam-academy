import { fmt, fmtUnit, linear, paren, sum, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  caseText,
  combined,
  equationText,
  explicitText,
  isLine,
  RIDDLES,
  solveSystem,
} from "../lab/views-gleichungssysteme";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-3-gleichungssysteme";
const LEHRPLAN = "M9 LB 6 (I) · M9 LB 6 (II/III): Systeme linearer Gleichungen";

/** A non-zero integer in [-max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

const CASES = ["keine Lösung", "genau eine Lösung", "unendlich viele Lösungen"];

// 3.1 Lineare Gleichung mit zwei Variablen ───────────────────────────────────

const lineareGleichung: Lesson = {
  id: "lg-1-lineare-gleichung",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Lineare Gleichung mit zwei Variablen",
  subtitle: "Unendlich viele Lösungen auf einer Geraden",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, lineare Gleichungen mit zwei Variablen und ihre Graphen`,
  whyItMatters:
    "Viele Fragen haben zwei Unbekannte: Wie viele Kinder- und wie viele Erwachsenenkarten? Wie lang und wie breit? Eine Gleichung allein lässt unendlich viele Paare zu, und die liegen alle auf einer Geraden.",
  explanationHtml: `
    <p>Eine Gleichung der Form <strong>a · x + b · y = c</strong> heißt <strong>lineare Gleichung mit zwei Variablen</strong>. Ihre Lösungen sind <strong>Zahlenpaare (x | y)</strong>: Setzt man sie ein, stimmt die Gleichung.</p>
    <ul>
      <li>Es gibt unendlich viele Lösungspaare. Im Koordinatensystem bilden sie eine <strong>Gerade</strong>.</li>
      <li>Ist b ≠ 0, löst man nach y auf und erhält die Geradengleichung <strong>y = m · x + t</strong> mit der Steigung m = −a : b und dem y-Achsenabschnitt t = c : b.</li>
      <li>Ist b = 0, steht x = c : a da: eine <strong>senkrechte</strong> Gerade. Sie ist kein Graph einer Funktion.</li>
    </ul>
    <div class="example">Beispiel: 2x − 4y = 8 | −2x → −4y = −2x + 8 | : (−4) → y = 0,5x − 2. Also m = 0,5 und t = −2. Das Paar (4 | 0) ist eine Lösung, denn 2 · 4 − 4 · 0 = 8.</div>
    <div class="merke"><strong>Merke:</strong> Punktprobe: Koordinaten einsetzen. Stimmt die Gleichung, liegt der Punkt auf der Geraden.</div>
  `,
  formulas: [
    { name: "Lineare Gleichung", html: "a · x + b · y = c", quantities: "Lösungen sind Zahlenpaare (x | y)" },
    { name: "Nach y aufgelöst", html: "y = −(a : b) · x + c : b", quantities: "Steigung m = −a : b, y-Achsenabschnitt t = c : b, falls b ≠ 0" },
  ],
  quiz: {
    question: "Welche Form hat die Lösungsmenge von 3x + 2y = 6 im Koordinatensystem?",
    options: ["ein einzelner Punkt", "eine Gerade", "eine Parabel"],
    correctIndex: 1,
    explanation: "Jedes Paar (x | y), das die Gleichung erfüllt, ist eine Lösung. Zusammen bilden sie die Gerade y = −1,5x + 3.",
  },
  lab: {
    kind: "line-equation",
    title: "Labor: Die Lösungsgerade",
    intro: "Stelle a, b und c ein. Ziehe den Punkt P: Er wird grün, wenn er die Gleichung erfüllt.",
    params: [
      { type: "range", key: "a", label: "a", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "b", label: "b", unit: "", min: -5, max: 5, step: 1, value: 2 },
      { type: "range", key: "c", label: "c", unit: "", min: -10, max: 10, step: 1, value: 4 },
      { type: "range", key: "px", label: "x von P", unit: "", min: -8, max: 8, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "py", label: "y von P", unit: "", min: -5, max: 5, step: 0.5, value: -2, digits: 1 },
    ],
    readouts: [
      { key: "eq", label: "Gleichung", compute: (v) => equationText(v.a, v.b, v.c) },
      { key: "explicit", label: "nach y aufgelöst", emphasis: true, compute: (v) => explicitText(v.a, v.b, v.c) },
      { key: "probe", label: "a · x + b · y für P", digits: 2, compute: (v) => v.a * v.px + v.b * v.py },
    ],
    goals: [
      {
        id: "punkt",
        text: "Finde einen Punkt P, der die Gleichung erfüllt und auf keiner Achse liegt.",
        check: (v) => isLine(v.a, v.b) && v.px !== 0 && v.py !== 0 && Math.abs(v.a * v.px + v.b * v.py - v.c) < 1e-9,
      },
      {
        id: "zwei-punkte",
        text: "Stelle eine Gleichung ein, deren Gerade durch (0 | −2) und (4 | 0) geht.",
        check: (v) => isLine(v.a, v.b) && v.b * -2 === v.c && v.a * 4 === v.c,
      },
      { id: "senkrecht", text: "Mache die Gerade senkrecht. Welcher Koeffizient muss dafür 0 sein?", check: (v) => v.b === 0 && v.a !== 0 },
    ],
  },
  exercises: [
    {
      id: "explizit",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const b = rng.pick([2, 3, 4, 5, -2, -3, -4]);
          const a = nonZero(rng, 9);
          const c = rng.int(-12, 12);
          const m = -a / b;
          const t = c / b;
          return {
            prompt: `Löse die Gleichung ${equationText(a, b, c)} nach y auf und gib Steigung m und y-Achsenabschnitt t an.`,
            given: [`${equationText(a, b, c)}`],
            formulaHint: "b · y = −a · x + c, dann durch b teilen",
            fields: [
              numberField("m =", m, "", 2, { slips: [{ value: a / b, hint: "Beim Herüberbringen von a · x wechselt das Vorzeichen: b · y = −a · x + c." }] }),
              numberField("t =", t, "", 2, { slips: [{ value: c, hint: "Teile auch c durch b." }] }),
            ],
            steps: [`${fmt(b)}y = ${linear(-a, c)} | : ${paren(b)}`, `y = ${linear(m, t)}`, `<strong>m = ${fmt(m, 2)}, t = ${fmt(t, 2)}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const u = rng.pick([20, 24, 30, 36, 40, 50]);
          return {
            prompt: `Ein Rechteck hat den Umfang ${u} cm. Stelle die Gleichung für Länge x und Breite y auf und löse sie nach y auf: y = m · x + t. Gib m und t an.`,
            given: [`Umfang ${u} cm`, "2x + 2y = Umfang"],
            fields: [numberField("m =", -1), numberField("t =", u / 2)],
            steps: [`2x + 2y = ${u} | : 2`, `x + y = ${fmt(u / 2)}, also y = −x + ${fmt(u / 2)}`, `<strong>m = −1, t = ${fmt(u / 2)}</strong>`],
          };
        }
        const p1 = rng.pick([8, 10, 12, 15]);
        const p2 = rng.pick([18, 20, 24, 30]);
        const total = p1 * p2 * rng.pick([1, 2]);
        return {
          prompt: `Ein Teehändler mischt x kg Tee zu ${p1} €/kg mit y kg Tee zu ${p2} €/kg. Die Mischung soll zusammen ${total} € kosten. Stelle die Gleichung auf und löse nach y auf: y = m · x + t.`,
          given: [`Sorte 1: ${p1} €/kg`, `Sorte 2: ${p2} €/kg`, `zusammen ${total} €`],
          fields: [numberField("m =", -p1 / p2, "", 3), numberField("t =", total / p2, "", 2)],
          steps: [`${p1}x + ${p2}y = ${total}`, `${p2}y = −${p1}x + ${total} | : ${p2}`, `<strong>y = ${linear(-p1 / p2, total / p2, 3)}: m ≈ ${fmt(-p1 / p2, 3)}, t = ${fmt(total / p2, 2)}</strong>`],
        };
      },
    },
    {
      id: "punktprobe",
      make: (rng, level): ExerciseTask => {
        const a = nonZero(rng, 6);
        const b = nonZero(rng, 6);
        const x = rng.int(-6, 6);
        if (level === 1) {
          const y = rng.int(-6, 6);
          const onLine = rng.next() < 0.5;
          const value = a * x + b * y;
          const c = onLine ? value : value + rng.pick([-3, -2, -1, 1, 2, 3]);
          return {
            prompt: `Liegt der Punkt P(${fmt(x)} | ${fmt(y)}) auf der Geraden ${equationText(a, b, c)}? Setze ein.`,
            given: [equationText(a, b, c), `P(${fmt(x)} | ${fmt(y)})`],
            formulaHint: "Koordinaten einsetzen und mit c vergleichen",
            fields: [numberField("a · x + b · y =", value, "", 0), yesNo("auf der Geraden?", onLine)],
            steps: [`${paren(a)} · ${paren(x)} + ${paren(b)} · ${paren(y)} = ${fmt(value)}`, `<strong>${fmt(value)} ${onLine ? "=" : "≠"} ${fmt(c)}: P liegt ${onLine ? "auf" : "nicht auf"} der Geraden</strong>.`],
          };
        }
        const y = rng.int(-6, 6);
        const c = a * x + b * y;
        return {
          prompt: `Der Punkt P(${fmt(x)} | y) liegt auf der Geraden ${equationText(a, b, c)}. Berechne seine y-Koordinate.`,
          given: [equationText(a, b, c), `x = ${fmt(x)}`],
          fields: [numberField("y =", y, "", 2)],
          steps: [`${paren(a)} · ${paren(x)}${term(b, "y", false)} = ${fmt(c)}`, `${sum([[b, "y"]])} = ${fmt(c - a * x)}`, `<strong>y = ${fmt(y)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, dass eine Gleichung mit zwei Variablen eine ganze Gerade von Lösungen hat, und machst die Punktprobe.",
};

// 3.2 Gleichsetzen und Einsetzen ──────────────────────────────────────────────

const gleichsetzen: Lesson = {
  id: "lg-2-gleichsetzen",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Gleichsetzungs- und Einsetzungsverfahren",
  subtitle: "Zwei Tarife, ein Schnittpunkt",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Lösungsverfahren`,
  whyItMatters:
    "Ab wann lohnt sich der andere Handytarif? Wann holt das schnellere Fahrrad das langsamere ein? Das ist jedes Mal der Schnittpunkt zweier Geraden, also die Lösung eines Gleichungssystems.",
  explanationHtml: `
    <p>Zwei lineare Gleichungen mit denselben Variablen bilden ein <strong>lineares Gleichungssystem</strong>. Seine Lösung ist das Zahlenpaar, das <strong>beide</strong> Gleichungen erfüllt: der <strong>Schnittpunkt</strong> der beiden Geraden.</p>
    <ul>
      <li><strong>Gleichsetzungsverfahren:</strong> Sind beide Gleichungen nach derselben Variablen aufgelöst (y = …), setzt man die rechten Seiten gleich.</li>
      <li><strong>Einsetzungsverfahren:</strong> Ist eine Gleichung nach einer Variablen aufgelöst, setzt man diesen Term in die andere Gleichung ein.</li>
      <li>Danach die zweite Variable durch Einsetzen berechnen und die <strong>Probe</strong> in beiden Gleichungen machen.</li>
    </ul>
    <div class="example">(I) y = 3x − 1, (II) y = −2x + 9. Gleichsetzen: 3x − 1 = −2x + 9 → 5x = 10 → x = 2. In (I): y = 3 · 2 − 1 = 5. L = {(2 | 5)}.</div>
    <div class="merke"><strong>Merke:</strong> Beide Gleichungen nach y aufgelöst → Gleichsetzen. Eine nach x oder y aufgelöst → Einsetzen.</div>
  `,
  formulas: [
    { name: "Gleichsetzen", html: "m₁x + t₁ = m₂x + t₂ ⇒ x = (t₂ − t₁) : (m₁ − m₂)", quantities: "beide Gleichungen in der Form y = mx + t" },
    { name: "Lösungsmenge", html: "L = {(x | y)}", quantities: "das Zahlenpaar, das beide Gleichungen erfüllt" },
  ],
  quiz: {
    question: "Welches Verfahren bietet sich bei (I) y = 3x − 1 und (II) y = −2x + 9 an?",
    options: ["Gleichsetzen, weil beide nach y aufgelöst sind", "Addieren, weil die x-Werte Gegenzahlen sind", "Keines, das System hat keine Lösung"],
    correctIndex: 0,
    explanation: "Beide Gleichungen sind schon nach y aufgelöst. Gleichsetzen liefert sofort 3x − 1 = −2x + 9.",
  },
  lab: {
    kind: "two-lines",
    title: "Labor: Zwei Geraden",
    intro: "Ziehe an jeder Geraden die zwei Punkte: einen auf der y-Achse (Achsenabschnitt) und einen für die Steigung. Der Schnittpunkt ist die Lösung des Systems.",
    params: [
      { type: "range", key: "m1", label: "Steigung m₁", unit: "", min: -3, max: 3, step: 0.25, value: 1, digits: 2 },
      { type: "range", key: "t1", label: "Achsenabschnitt t₁", unit: "", min: -5, max: 5, step: 0.5, value: -1, digits: 1 },
      { type: "range", key: "m2", label: "Steigung m₂", unit: "", min: -3, max: 3, step: 0.25, value: -0.5, digits: 2 },
      { type: "range", key: "t2", label: "Achsenabschnitt t₂", unit: "", min: -5, max: 5, step: 0.5, value: 3, digits: 1 },
    ],
    readouts: [
      { key: "g1", label: "(I)", compute: (v) => `y = ${linear(v.m1, v.t1)}` },
      { key: "g2", label: "(II)", compute: (v) => `y = ${linear(v.m2, v.t2)}` },
      {
        key: "S",
        label: "Lösung",
        emphasis: true,
        compute: (v) => {
          if (v.m1 === v.m2) return v.t1 === v.t2 ? "unendlich viele" : "keine";
          const x = (v.t2 - v.t1) / (v.m1 - v.m2);
          return `(${fmt(x, 3)} | ${fmt(v.m1 * x + v.t1, 3)})`;
        },
      },
    ],
    goals: [
      {
        id: "drei-vier",
        text: "Lege den Schnittpunkt genau auf S(3 | 4).",
        check: (v) => v.m1 !== v.m2 && Math.abs(3 * v.m1 + v.t1 - 4) < 1e-9 && Math.abs(3 * v.m2 + v.t2 - 4) < 1e-9,
      },
      {
        id: "negativ",
        text: "Erzeuge einen Schnittpunkt mit negativem x und negativem y.",
        check: (v) => {
          if (v.m1 === v.m2) return false;
          const x = (v.t2 - v.t1) / (v.m1 - v.m2);
          return x < 0 && v.m1 * x + v.t1 < 0;
        },
      },
      { id: "y-achse", text: "Lass eine steigende und eine fallende Gerade sich auf der y-Achse schneiden.", check: (v) => v.t1 === v.t2 && v.m1 * v.m2 < 0 },
    ],
  },
  exercises: [
    {
      id: "gleichsetzen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.int(-5, 5);
          const y = rng.int(-6, 6);
          const m1 = nonZero(rng, 4);
          let m2 = nonZero(rng, 4);
          if (m2 === m1) m2 = -m1;
          const t1 = y - m1 * x;
          const t2 = y - m2 * x;
          return {
            prompt: `Löse das Gleichungssystem mit dem Gleichsetzungsverfahren: (I) y = ${linear(m1, t1)}, (II) y = ${linear(m2, t2)}.`,
            given: [`(I) y = ${linear(m1, t1)}`, `(II) y = ${linear(m2, t2)}`],
            formulaHint: `${linear(m1, t1)} = ${linear(m2, t2)}`,
            fields: [numberField("x =", x, "", 2), numberField("y =", y, "", 2)],
            steps: [`${linear(m1, t1)} = ${linear(m2, t2)}`, `${fmt(m1 - m2)}x = ${fmt(t2 - t1)}, also x = ${fmt(x)}`, `In (I): y = ${paren(m1)} · ${paren(x)} ${t1 < 0 ? "−" : "+"} ${fmt(Math.abs(t1))} = ${fmt(y)}`, `<strong>L = {(${fmt(x)} | ${fmt(y)})}</strong>`],
          };
        }
        const minutes = rng.pick([20, 25, 30, 40, 50, 60, 80, 100]);
        const p1 = rng.pick([0.09, 0.1, 0.12, 0.15, 0.2]);
        const d = rng.pick([0.03, 0.05]);
        const p2 = Number((p1 - d).toFixed(2));
        const b1 = rng.pick([0, 2, 3, 5]);
        const b2 = Number((b1 + d * minutes).toFixed(2));
        const cost = b1 + p1 * minutes;
        return {
          prompt: `Tarif A kostet ${fmt(b1, 2)} € Grundgebühr und ${fmt(p1, 2)} € je Minute. Tarif B kostet ${fmt(b2, 2)} € Grundgebühr und ${fmt(p2, 2)} € je Minute. Bei wie vielen Minuten kosten beide Tarife gleich viel, und wie viel ist das?`,
          given: [`A: y = ${fmt(p1, 2)}x + ${fmt(b1, 2)}`, `B: y = ${fmt(p2, 2)}x + ${fmt(b2, 2)}`],
          fields: [numberField("x =", minutes, "min", 0), numberField("Kosten =", cost, "€", 2)],
          steps: [`${fmt(p1, 2)}x + ${fmt(b1, 2)} = ${fmt(p2, 2)}x + ${fmt(b2, 2)}`, `${fmt(d, 2)}x = ${fmt(b2 - b1, 2)}, also x = ${minutes}`, `<strong>Bei ${minutes} Minuten kosten beide ${fmtUnit(cost, "€", 2)}</strong>; darüber ist B günstiger.`],
        };
      },
    },
    {
      id: "einsetzen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.int(-5, 5);
          const y = rng.int(-6, 6);
          const m = nonZero(rng, 3);
          const t = y - m * x;
          const a = nonZero(rng, 4);
          let b = nonZero(rng, 4);
          if (a + b * m === 0) b = b + (b > 0 ? 1 : -1);
          const c = a * x + b * y;
          return {
            prompt: `Löse mit dem Einsetzungsverfahren: (I) ${equationText(a, b, c)}, (II) y = ${linear(m, t)}.`,
            given: [`(I) ${equationText(a, b, c)}`, `(II) y = ${linear(m, t)}`],
            formulaHint: `(II) in (I): ${sum([[a, "x"]])} + ${paren(b)} · (${linear(m, t)}) = ${fmt(c)}`,
            fields: [numberField("x =", x, "", 2), numberField("y =", y, "", 2)],
            steps: [
              `${sum([[a, "x"]])} + ${paren(b)} · (${linear(m, t)}) = ${fmt(c)}`,
              `${sum([[a + b * m, "x"]])} + ${paren(b * t)} = ${fmt(c)}, also x = ${fmt(x)}`,
              `In (II): y = ${paren(m)} · ${paren(x)} + ${paren(t)} = ${fmt(y)}`,
              `<strong>L = {(${fmt(x)} | ${fmt(y)})}</strong>`,
            ],
          };
        }
        const daughter = rng.int(6, 15);
        const factor = rng.pick([3, 4]);
        const father = factor * daughter;
        return {
          prompt: `Ein Vater ist heute ${factor}-mal so alt wie seine Tochter. Zusammen sind die beiden ${father + daughter} Jahre alt. Wie alt sind sie?`,
          given: [`v = ${factor} · t`, `v + t = ${father + daughter}`],
          fields: [numberField("Tochter:", daughter, "Jahre", 0), numberField("Vater:", father, "Jahre", 0)],
          steps: [`Einsetzen: ${factor}t + t = ${father + daughter}`, `${factor + 1}t = ${father + daughter}, also t = ${daughter}`, `<strong>Die Tochter ist ${daughter}, der Vater ${father} Jahre alt.</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst Gleichungssysteme durch Gleichsetzen und Einsetzen und deutest die Lösung als Schnittpunkt.",
};

// 3.3 Additionsverfahren ─────────────────────────────────────────────────────

const additionsverfahren: Lesson = {
  id: "lg-3-additionsverfahren",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Additionsverfahren",
  subtitle: "Die Eliminations-Maschine",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Additionsverfahren`,
  whyItMatters:
    "Sind beide Gleichungen in der Form ax + by = c gegeben, ist das Additionsverfahren meist der kürzeste Weg. Es ist auch die Idee hinter den Verfahren, mit denen Computer große Gleichungssysteme lösen.",
  explanationHtml: `
    <p>Beim <strong>Additionsverfahren</strong> multipliziert man die Gleichungen so mit Zahlen, dass vor einer Variablen <strong>Gegenzahlen</strong> stehen (z. B. +4 und −4). Addiert man dann die Gleichungen, fällt diese Variable heraus.</p>
    <div class="example">(I) 3x + 4y = 18, (II) 2x − 4y = −8. Hier stehen schon +4y und −4y. (I) + (II): 5x = 10, also x = 2. In (I): 6 + 4y = 18, also y = 3. L = {(2 | 3)}.</div>
    <ul>
      <li>Stehen keine Gegenzahlen da, multipliziert man eine oder beide Gleichungen: bei (I) 2x + 3y = 12 und (II) 4x − y = 10 zum Beispiel (II) mit 3.</li>
      <li>Im Labor siehst du: Die Summe zweier Gleichungen ist wieder eine Gerade durch denselben Schnittpunkt. Fällt y heraus, ist sie senkrecht und zeigt direkt den x-Wert.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Faktoren so wählen, dass eine Variable Gegenzahlen bekommt. Dann addieren, die andere Variable berechnen, einsetzen, Probe.</div>
  `,
  formulas: [
    { name: "Additionsverfahren", html: "k₁ · (I) + k₂ · (II)", quantities: "k₁, k₂ so, dass die Koeffizienten einer Variablen Gegenzahlen werden" },
  ],
  quiz: {
    question: "Wie müssen die Koeffizienten einer Variablen sein, damit sie beim Addieren der Gleichungen herausfällt?",
    options: ["gleich", "Gegenzahlen, zum Beispiel +3 und −3", "Kehrwerte, zum Beispiel 3 und ⅓"],
    correctIndex: 1,
    explanation: "Nur Gegenzahlen ergeben zusammen 0: 3y + (−3y) = 0y.",
  },
  lab: {
    kind: "elimination",
    title: "Labor: Die Eliminations-Maschine",
    intro: "Wähle ein System und die Faktoren k₁ und k₂. Die Summe erscheint als Gleichung und als violette Gerade, die immer durch den Schnittpunkt geht.",
    params: [
      { type: "choice", key: "sys", label: "System", options: [1, 2, 3].map((n) => ({ value: n, label: `System ${n}` })), value: 1 },
      { type: "range", key: "k1", label: "Faktor k₁ für (I)", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "k2", label: "Faktor k₂ für (II)", unit: "", min: -5, max: 5, step: 1, value: 1 },
    ],
    readouts: [
      { key: "sum", label: "k₁ · (I) + k₂ · (II)", emphasis: true, compute: (v) => { const s = combined(v); return equationText(s.a, s.b, s.c); } },
      { key: "ax", label: "Koeffizient von x", digits: 0, compute: (v) => combined(v).a },
      { key: "by", label: "Koeffizient von y", digits: 0, compute: (v) => combined(v).b },
    ],
    goals: [
      {
        id: "s1-y",
        text: "System 1: Eliminiere y.",
        check: (v) => v.sys === 1 && v.k1 !== 0 && v.k2 !== 0 && combined(v).b === 0 && combined(v).a !== 0,
      },
      {
        id: "s2-x",
        text: "System 2: Eliminiere x.",
        check: (v) => v.sys === 2 && v.k1 !== 0 && v.k2 !== 0 && combined(v).a === 0 && combined(v).b !== 0,
      },
      {
        id: "s3-gross",
        text: "System 3: Eliminiere eine Variable, ohne einen Faktor 1 oder −1 zu benutzen.",
        check: (v) => {
          const s = combined(v);
          return v.sys === 3 && Math.abs(v.k1) > 1 && Math.abs(v.k2) > 1 && (s.a === 0) !== (s.b === 0);
        },
      },
    ],
  },
  exercises: [
    {
      id: "addition-direkt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.int(-5, 6);
          const y = rng.int(-5, 6);
          const k = rng.int(1, 5);
          const a1 = nonZero(rng, 5);
          let a2 = nonZero(rng, 5);
          if (a1 + a2 === 0) a2 += 1;
          const c1 = a1 * x + k * y;
          const c2 = a2 * x - k * y;
          return {
            prompt: `Löse mit dem Additionsverfahren: (I) ${equationText(a1, k, c1)}, (II) ${equationText(a2, -k, c2)}.`,
            given: [`(I) ${equationText(a1, k, c1)}`, `(II) ${equationText(a2, -k, c2)}`],
            formulaHint: "(I) + (II): die y-Glieder heben sich auf",
            fields: [numberField("x =", x, "", 2), numberField("y =", y, "", 2)],
            steps: [`(I) + (II): ${fmt(a1 + a2)}x = ${fmt(c1 + c2)}, also x = ${fmt(x)}`, `In (I): ${paren(a1)} · ${paren(x)} + ${k}y = ${fmt(c1)}, also y = ${fmt(y)}`, `<strong>L = {(${fmt(x)} | ${fmt(y)})}</strong>`],
          };
        }
        const big = rng.int(12, 60);
        const small = rng.int(2, big - 2);
        return {
          prompt: `Die Summe zweier Zahlen ist ${big + small}, ihre Differenz ist ${big - small}. Wie heißen die beiden Zahlen?`,
          given: [`x + y = ${big + small}`, `x − y = ${big - small}`],
          fields: [numberField("größere Zahl x =", big, "", 0), numberField("kleinere Zahl y =", small, "", 0)],
          steps: [`Addieren: 2x = ${2 * big}, also x = ${big}`, `Einsetzen: ${big} + y = ${big + small}, also y = ${small}`, `<strong>Die Zahlen sind ${big} und ${small}.</strong>`],
        };
      },
    },
    {
      id: "addition-faktoren",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.int(-4, 6);
          const y = rng.int(-4, 6);
          const k = rng.pick([2, 3, 4]);
          const b1 = rng.pick([1, -1, 2]);
          const a1 = nonZero(rng, 5);
          let a2 = nonZero(rng, 5);
          if (k * a1 + a2 === 0) a2 += 1;
          const b2 = k * b1;
          // (II) has −k·b1 so that k·(I) + (II) removes y
          const c1 = a1 * x + b1 * y;
          const c2 = a2 * x - b2 * y;
          return {
            prompt: `Löse mit dem Additionsverfahren: (I) ${equationText(a1, b1, c1)}, (II) ${equationText(a2, -b2, c2)}.`,
            given: [`(I) ${equationText(a1, b1, c1)}`, `(II) ${equationText(a2, -b2, c2)}`],
            formulaHint: `Multipliziere (I) mit ${k}, dann addiere`,
            fields: [numberField("x =", x, "", 2), numberField("y =", y, "", 2)],
            steps: [`${k} · (I): ${equationText(k * a1, k * b1, k * c1)}`, `+ (II): ${fmt(k * a1 + a2)}x = ${fmt(k * c1 + c2)}, also x = ${fmt(x)}`, `In (I): y = ${fmt(y)}`, `<strong>L = {(${fmt(x)} | ${fmt(y)})}</strong>`],
          };
        }
        const heft = rng.stepped(0.9, 2.5, 0.1);
        const stift = rng.stepped(0.4, 1.6, 0.1);
        const n1 = rng.int(2, 5);
        const m1 = rng.int(1, 4);
        let n2 = rng.int(1, 4);
        const m2 = rng.int(2, 6);
        if (n1 * m2 === n2 * m1) n2 += 1;
        const p1 = n1 * heft + m1 * stift;
        const p2 = n2 * heft + m2 * stift;
        return {
          prompt: `${n1} Hefte und ${m1} Stift${m1 === 1 ? "" : "e"} kosten zusammen ${fmt(p1, 2)} €. ${n2} Heft${n2 === 1 ? "" : "e"} und ${m2} Stifte kosten ${fmt(p2, 2)} €. Was kostet ein Heft, was ein Stift?`,
          given: [`(I) ${n1}h + ${m1}s = ${fmt(p1, 2)}`, `(II) ${n2}h + ${m2}s = ${fmt(p2, 2)}`],
          fields: [numberField("Heft:", heft, "€", 2), numberField("Stift:", stift, "€", 2)],
          steps: [`Faktoren so wählen, dass h wegfällt: ${n2} · (I) − ${n1} · (II)`, `${fmt(n2 * m1 - n1 * m2)}s = ${fmt(n2 * p1 - n1 * p2, 2)}, also s = ${fmt(stift, 2)}`, `Einsetzen in (I): h = ${fmt(heft, 2)}`, `<strong>Ein Heft kostet ${fmtUnit(heft, "€", 2)}, ein Stift ${fmtUnit(stift, "€", 2)}.</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wählst Faktoren, mit denen eine Variable herausfällt, und löst Systeme mit dem Additionsverfahren.",
};

// 3.4 Lösungsfälle ───────────────────────────────────────────────────────────

const loesungsfaelle: Lesson = {
  id: "lg-4-loesungsfaelle",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Eine, keine oder unendlich viele Lösungen",
  subtitle: "Schneiden, parallel, deckungsgleich",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Lösbarkeit und geometrische Deutung`,
  whyItMatters:
    "Nicht jedes Rätsel hat genau eine Antwort. Ein Gleichungssystem kann widersprüchliche Angaben enthalten oder zweimal dasselbe sagen. Das erkennst du an den Geraden und an der Rechnung.",
  explanationHtml: `
    <p>Zwei Geraden in der Ebene können sich auf drei Arten zueinander verhalten:</p>
    <ul>
      <li><strong>Sie schneiden sich:</strong> verschiedene Steigungen, <strong>genau eine Lösung</strong>.</li>
      <li><strong>Sie sind echt parallel:</strong> gleiche Steigung, verschiedener y-Achsenabschnitt, <strong>keine Lösung</strong>, L = { }. Beim Rechnen entsteht ein Widerspruch wie 0 = 5.</li>
      <li><strong>Sie sind identisch:</strong> eine Gleichung ist ein Vielfaches der anderen, <strong>unendlich viele Lösungen</strong>. Beim Rechnen entsteht eine wahre Aussage wie 0 = 0.</li>
    </ul>
    <div class="example">(I) 2x + 4y = 6, (II) x + 2y = 3: (II) · 2 ergibt genau (I). Beide beschreiben dieselbe Gerade y = −0,5x + 1,5.</div>
    <div class="merke"><strong>Merke:</strong> Beide Gleichungen nach y auflösen und m und t vergleichen: m verschieden → eine Lösung; m gleich und t verschieden → keine; m und t gleich → unendlich viele.</div>
  `,
  formulas: [
    { name: "Fallunterscheidung", html: "m₁ ≠ m₂: eine · m₁ = m₂, t₁ ≠ t₂: keine · m₁ = m₂, t₁ = t₂: unendlich viele", quantities: "beide Gleichungen in der Form y = mx + t" },
  ],
  quiz: {
    question: "Die Geraden zweier Gleichungen sind echt parallel. Wie viele Lösungen hat das System?",
    options: ["keine", "genau eine", "unendlich viele"],
    correctIndex: 0,
    explanation: "Echt parallele Geraden haben keinen gemeinsamen Punkt, also gibt es kein Zahlenpaar, das beide Gleichungen erfüllt.",
  },
  lab: {
    kind: "system-cases",
    title: "Labor: Drei Fälle",
    intro: "Stelle die Koeffizienten beider Gleichungen ein. Die Zeichnung und die Rechnung zeigen, welcher Fall vorliegt.",
    params: [
      { type: "range", key: "a1", label: "(I) a₁", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "b1", label: "(I) b₁", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "c1", label: "(I) c₁", unit: "", min: -6, max: 6, step: 1, value: 4 },
      { type: "range", key: "a2", label: "(II) a₂", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "b2", label: "(II) b₂", unit: "", min: -6, max: 6, step: 1, value: -1 },
      { type: "range", key: "c2", label: "(II) c₂", unit: "", min: -6, max: 6, step: 1, value: 0 },
    ],
    readouts: [
      { key: "eq1", label: "(I)", compute: (v) => equationText(v.a1, v.b1, v.c1) },
      { key: "eq2", label: "(II)", compute: (v) => equationText(v.a2, v.b2, v.c2) },
      { key: "case", label: "Lösungsfall", emphasis: true, compute: (v) => caseText(v) },
    ],
    goals: [
      {
        id: "keine",
        text: "Erzeuge ein System ohne Lösung.",
        check: (v) => isLine(v.a1, v.b1) && isLine(v.a2, v.b2) && solveSystem(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2).kind === "none",
      },
      {
        id: "unendlich",
        text: "Erzeuge unendlich viele Lösungen, ohne zweimal genau dieselbe Gleichung einzustellen.",
        check: (v) =>
          isLine(v.a1, v.b1) &&
          solveSystem(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2).kind === "infinite" &&
          !(v.a1 === v.a2 && v.b1 === v.b2 && v.c1 === v.c2),
      },
      {
        id: "eine",
        text: "Erzeuge ein System mit genau der Lösung (−2 | 1).",
        check: (v) => {
          const sol = solveSystem(v.a1, v.b1, v.c1, v.a2, v.b2, v.c2);
          return sol.kind === "one" && Math.abs(sol.x + 2) < 1e-9 && Math.abs(sol.y - 1) < 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "fall",
      make: (rng, level): ExerciseTask => {
        const kind = rng.int(0, 2);
        const m1 = nonZero(rng, 3);
        const t1 = rng.int(-5, 5);
        let m2 = m1;
        let t2 = t1;
        if (kind === 1) m2 = m1 + rng.pick([-2, -1, 1, 2]);
        if (kind === 0) t2 = t1 + rng.pick([-3, -2, 2, 3]);
        if (level === 1) {
          const q1 = rng.pick([1, 2]);
          const q2 = rng.pick([1, 2, 3]);
          // general form −q·m·x + q·y = q·t
          const e1 = { a: -q1 * m1, b: q1, c: q1 * t1 };
          const e2 = { a: -q2 * m2, b: q2, c: q2 * t2 };
          return {
            prompt: `Wie viele Lösungen hat das System (I) ${equationText(e1.a, e1.b, e1.c)}, (II) ${equationText(e2.a, e2.b, e2.c)}? Löse beide Gleichungen nach y auf und vergleiche.`,
            given: [`(I) ${equationText(e1.a, e1.b, e1.c)}`, `(II) ${equationText(e2.a, e2.b, e2.c)}`],
            formulaHint: "y = mx + t: vergleiche m₁ mit m₂, dann t₁ mit t₂",
            fields: [numberField("m₁ =", m1, "", 2), numberField("m₂ =", m2, "", 2), choiceField("Lösungsfall", CASES, kind)],
            steps: [`(I): y = ${linear(m1, t1)}, (II): y = ${linear(m2, t2)}`, `<strong>${kind === 1 ? "m₁ ≠ m₂: genau eine Lösung" : t1 === t2 ? "m und t gleich: unendlich viele Lösungen" : "gleiche Steigung, verschiedene t: keine Lösung"}</strong>`],
          };
        }
        const same = kind === 2;
        let startA: number, lengthB: number, rateA: number, rateB: number;
        // Draw again until the answer falls while both candles still burn,
        // with at least 1 cm left: at the meeting time, or after the 3 h asked.
        do {
          startA = rng.int(14, 24);
          lengthB = same ? startA : startA - rng.int(2, 6);
          rateA = rng.pick([1.5, 2, 2.5, 3]);
          rateB = kind === 1 ? rateA - rng.pick([0.5, 1]) : rateA;
        } while (
          kind === 1
            ? startA - rateA * ((startA - lengthB) / (rateA - rateB)) < 1
            : lengthB - 3 * rateB < 1
        );
        return {
          prompt: `Kerze A ist ${startA} cm lang und brennt in jeder Stunde ${fmt(rateA, 1)} cm ab. Kerze B ist ${lengthB} cm lang und brennt ${fmt(rateB, 1)} cm pro Stunde ab. Beide werden gleichzeitig angezündet. Gibt es einen Zeitpunkt, an dem beide gleich lang sind? Gib die Anzahl der Lösungen des Systems an.`,
          given: [`A: y = ${startA} − ${fmt(rateA, 1)}x`, `B: y = ${lengthB} − ${fmt(rateB, 1)}x`],
          fields: [
            choiceField("Lösungsfall", CASES, kind),
            kind === 1
              ? numberField("gleich lang nach", (startA - lengthB) / (rateA - rateB), "h", 2)
              : numberField("Unterschied nach 3 h:", startA - lengthB, "cm", 1),
          ],
          steps: [
            `Steigungen: −${fmt(rateA, 1)} und −${fmt(rateB, 1)}; Anfangslängen ${startA} cm und ${lengthB} cm.`,
            kind === 1
              ? `${startA} − ${fmt(rateA, 1)}x = ${lengthB} − ${fmt(rateB, 1)}x, also ${fmt(rateA - rateB, 1)}x = ${startA - lengthB} und x = ${fmt((startA - lengthB) / (rateA - rateB), 2)}. Dann sind beide noch ${fmt(startA - (rateA * (startA - lengthB)) / (rateA - rateB), 2)} cm lang, sie brennen also noch.`
              : `Beide werden gleich schnell kürzer: Der Unterschied bleibt immer ${startA - lengthB} cm.`,
            `<strong>${kind === 1 ? "Verschiedene Steigungen: genau eine Lösung" : same ? "Gleiche Gerade: unendlich viele Lösungen, sie sind immer gleich lang" : "Gleiche Steigung, verschiedener Start: keine Lösung, sie werden nie gleich lang"}</strong>.`,
          ],
        };
      },
    },
    {
      id: "parameter",
      make: (rng, level): ExerciseTask => {
        const a = nonZero(rng, 4);
        const b = nonZero(rng, 4);
        const c = nonZero(rng, 6);
        const k = rng.pick([2, 3, -2]);
        if (level === 1) {
          return {
            prompt: `Für welche Zahl d hat das System (I) ${equationText(a, b, c)}, (II) ${equationText(k * a, k * b, 0).replace(" = 0", " = d")} unendlich viele Lösungen? Und wie viele Lösungen hat es für jede andere Zahl d?`,
            given: [`(I) ${equationText(a, b, c)}`, `(II) ${equationText(k * a, k * b, 0).replace(" = 0", " = d")}`],
            formulaHint: `(II) ist das ${fmt(k)}-Fache von (I) auf der linken Seite`,
            fields: [numberField("d =", k * c, "", 0), choiceField("sonst", CASES, 0)],
            steps: [`Die linke Seite von (II) ist ${fmt(k)} · (linke Seite von I).`, `Unendlich viele Lösungen nur, wenn auch d = ${fmt(k)} · ${paren(c)} = ${fmt(k * c)} ist.`, `<strong>d = ${fmt(k * c)}; für jedes andere d: parallele Geraden, keine Lösung</strong>.`],
          };
        }
        const p = rng.pick([2, 3, 4]);
        const q = rng.pick([2, 4, 6]);
        const r = nonZero(rng, 9);
        const s = r * 2 + rng.pick([1, 3]);
        // a·x + p·y = r and q·x + 2p·y = s are parallel for a = q / 2
        return {
          prompt: `Für welchen Wert von a hat das System (I) a · x + ${p}y = ${fmt(r)}, (II) ${q}x + ${2 * p}y = ${fmt(s)} keine Lösung?`,
          given: [`(I) a · x + ${p}y = ${fmt(r)}`, `(II) ${q}x + ${2 * p}y = ${fmt(s)}`],
          fields: [numberField("a =", q / 2, "", 2, { slips: [{ value: q * 2, hint: "Vergleiche die Faktoren: (II) hat beim y das Doppelte, also muss auch beim x das Doppelte von a stehen." }] })],
          steps: [`Keine Lösung bei gleicher Steigung: Die linken Seiten müssen Vielfache sein.`, `Beim y: ${2 * p} = 2 · ${p}, also muss ${q} = 2 · a sein.`, `Rechts: ${fmt(s)} ≠ 2 · ${paren(r)} = ${fmt(2 * r)}, also echt parallel. <strong>a = ${fmt(q / 2, 2)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst an Steigung und Achsenabschnitt, ob ein System eine, keine oder unendlich viele Lösungen hat.",
};

// 3.5 Textaufgaben ───────────────────────────────────────────────────────────

const textaufgaben: Lesson = {
  id: "lg-5-textaufgaben",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "3.5 Textaufgaben mit zwei Unbekannten",
  subtitle: "Ein Rätsel aus einem alten chinesischen Rechenbuch",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Anwendungen`,
  whyItMatters:
    "Rätsel mit zwei Unbekannten sind älter als unsere Schrift für Gleichungen. Mit einem Gleichungssystem löst du sie in wenigen Zeilen, statt lange zu probieren.",
  explanationHtml: `
    <p>In einem chinesischen Rechenbuch (Sunzi Suanjing, etwa 3. bis 5. Jahrhundert) steht: <em>In einem Käfig sind Fasane und Kaninchen. Zusammen haben sie 35 Köpfe und 94 Beine. Wie viele Tiere jeder Art sind es?</em></p>
    <ol class="steps">
      <li><strong>Variablen festlegen:</strong> x = Anzahl der Fasane, y = Anzahl der Kaninchen.</li>
      <li><strong>Zwei Gleichungen aus dem Text:</strong> Köpfe: x + y = 35. Beine: 2x + 4y = 94.</li>
      <li><strong>Lösen</strong>, zum Beispiel mit dem Additionsverfahren: (II) − 2 · (I) ergibt 2y = 24, also y = 12 und x = 23.</li>
      <li><strong>Probe am Text:</strong> 23 + 12 = 35 Köpfe, 46 + 48 = 94 Beine.</li>
      <li><strong>Antwortsatz:</strong> Es sind 23 Fasane und 12 Kaninchen.</li>
    </ol>
    <div class="merke"><strong>Merke:</strong> Jede Angabe im Text, die eine Zahl festlegt, wird zu einer Gleichung. Zwei Unbekannte brauchen zwei Gleichungen.</div>
  `,
  formulas: [
    { name: "Lösungsplan", html: "Variablen → zwei Gleichungen → lösen → Probe → Antwortsatz", quantities: "für jede Textaufgabe mit zwei Unbekannten" },
  ],
  quiz: {
    question: "Im Käfig sind x Fasane und y Kaninchen mit zusammen 94 Beinen. Welche Gleichung beschreibt die Beine?",
    options: ["x + y = 94", "2x + 4y = 94", "4x + 2y = 94"],
    correctIndex: 1,
    explanation: "Ein Fasan hat 2 Beine, ein Kaninchen 4. Also 2x + 4y = 94.",
  },
  lab: {
    kind: "puzzle-farm",
    title: "Labor: Drei Rätsel",
    intro: "Ziehe den Punkt (x | y) rechts, bis beide Bedingungen grün sind. Er liegt dann auf beiden Geraden.",
    params: [
      { type: "choice", key: "puzzle", label: "Rätsel", options: Object.entries(RIDDLES).map(([value, riddle]) => ({ value: Number(value), label: riddle.title })), value: 0 },
      { type: "range", key: "x", label: "x", unit: "", min: 0, max: 100, step: 1, value: 10 },
      { type: "range", key: "y", label: "y", unit: "", min: 0, max: 100, step: 1, value: 10 },
    ],
    readouts: [
      { key: "total", label: "Bedingung 1", compute: (v) => { const r = RIDDLES[v.puzzle]; return `${r.totalLabel}: ${v.x + v.y} von ${r.total}`; } },
      { key: "value", label: "Bedingung 2", compute: (v) => { const r = RIDDLES[v.puzzle]; return `${r.valueLabel}: ${r.wa * v.x + r.wb * v.y}${r.unit} von ${r.value}${r.unit}`; } },
    ],
    goals: [
      { id: "fasane", text: "Löse das Rätsel der Fasane und Kaninchen.", check: (v) => v.puzzle === 0 && v.x === 23 && v.y === 12 },
      { id: "kino", text: "Löse das Rätsel der Kinokasse.", check: (v) => v.puzzle === 1 && v.x === 80 && v.y === 40 },
      { id: "spardose", text: "Löse das Rätsel der Spardose.", check: (v) => v.puzzle === 2 && v.x === 12 && v.y === 13 },
    ],
  },
  exercises: [
    {
      id: "raetsel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.int(3, 15);
          const y = rng.int(1, 12);
          const k = rng.pick([2, 3]);
          return {
            prompt: `Das ${k === 2 ? "Doppelte" : "Dreifache"} einer Zahl x plus eine zweite Zahl y ergibt ${k * x + y}. Die erste Zahl minus die zweite ergibt ${fmt(x - y)}. Wie heißen die Zahlen?`,
            given: [`(I) ${k}x + y = ${k * x + y}`, `(II) x − y = ${fmt(x - y)}`],
            formulaHint: "(I) + (II): y fällt heraus",
            fields: [numberField("x =", x, "", 0), numberField("y =", y, "", 0)],
            steps: [`(I) + (II): ${k + 1}x = ${(k + 1) * x}, also x = ${fmt(x)}`, `In (II): ${fmt(x)} − y = ${fmt(x - y)}, also y = ${fmt(y)}`, `<strong>x = ${fmt(x)}, y = ${fmt(y)}</strong>`],
          };
        }
        const birds = rng.int(5, 30);
        const rabbits = rng.int(3, 20);
        return {
          prompt: `Auf einem Hof leben Hühner und Kaninchen. Zusammen haben sie ${birds + rabbits} Köpfe und ${2 * birds + 4 * rabbits} Beine. Wie viele Hühner und wie viele Kaninchen sind es?`,
          given: [`${birds + rabbits} Köpfe`, `${2 * birds + 4 * rabbits} Beine`],
          fields: [numberField("Hühner:", birds, "", 0), numberField("Kaninchen:", rabbits, "", 0)],
          steps: [`(I) h + k = ${birds + rabbits}, (II) 2h + 4k = ${2 * birds + 4 * rabbits}`, `(II) − 2 · (I): 2k = ${2 * rabbits}, also k = ${rabbits}`, `<strong>${birds} Hühner und ${rabbits} Kaninchen</strong>`],
        };
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const adults = rng.int(10, 60);
          const kids = rng.int(10, 60);
          const pa = rng.pick([7, 8, 9, 10]);
          const pk = rng.pick([4, 5, 6]);
          return {
            prompt: `Ins Kino gehen ${adults + kids} Personen. Erwachsene zahlen ${pa} €, Kinder ${pk} €. Die Kasse nimmt ${pa * adults + pk * kids} € ein. Wie viele Erwachsene und wie viele Kinder waren es?`,
            given: [`(I) e + k = ${adults + kids}`, `(II) ${pa}e + ${pk}k = ${pa * adults + pk * kids}`],
            formulaHint: `(II) − ${pk} · (I): k fällt heraus`,
            fields: [numberField("Erwachsene:", adults, "", 0), numberField("Kinder:", kids, "", 0)],
            steps: [`(II) − ${pk} · (I): ${pa - pk}e = ${(pa - pk) * adults}, also e = ${adults}`, `k = ${adults + kids} − ${adults} = ${kids}`, `<strong>${adults} Erwachsene und ${kids} Kinder</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const width = rng.int(4, 20);
          const diff = rng.int(2, 10);
          const length = width + diff;
          return {
            prompt: `Ein Rechteck hat den Umfang ${2 * (length + width)} cm. Es ist ${diff} cm länger als breit. Wie lang und wie breit ist es?`,
            given: [`Umfang ${2 * (length + width)} cm`, `Länge = Breite + ${diff} cm`],
            fields: [numberField("Länge:", length, "cm", 0), numberField("Breite:", width, "cm", 0)],
            steps: [`(I) 2l + 2b = ${2 * (length + width)}, (II) l = b + ${diff}`, `Einsetzen: 2(b + ${diff}) + 2b = ${2 * (length + width)}, also 4b = ${4 * width} und b = ${width}`, `<strong>Länge ${length} cm, Breite ${width} cm</strong>`],
          };
        }
        const ones = rng.int(3, 25);
        const twos = rng.int(3, 25);
        return {
          prompt: `In einer Spardose sind ${ones + twos} Münzen, nur 1-€- und 2-€-Stücke. Zusammen sind es ${ones + 2 * twos} €. Wie viele Münzen jeder Sorte sind es?`,
          given: [`${ones + twos} Münzen`, `${ones + 2 * twos} €`],
          fields: [numberField("1-€-Münzen:", ones, "", 0), numberField("2-€-Münzen:", twos, "", 0)],
          steps: [`(I) e + z = ${ones + twos}, (II) e + 2z = ${ones + 2 * twos}`, `(II) − (I): z = ${twos}`, `<strong>${ones} Ein-Euro- und ${twos} Zwei-Euro-Münzen</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du übersetzt Texte in zwei Gleichungen, löst sie und prüfst die Lösung am Text.",
};

export const STAGE_GLEICHUNGSSYSTEME: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Systeme linearer Gleichungen",
  subtitle: "Geraden, Schnittpunkte, drei Lösungsverfahren, Textaufgaben",
  icon: "✖️",
  accent: "#7c3aed",
  badgeTitle: "Schnittpunkt-Profi",
  lehrplanLabel: "LB 6 (I und II/III)",
  lessons: [lineareGleichung, gleichsetzen, additionsverfahren, loesungsfaelle, textaufgaben],
};
