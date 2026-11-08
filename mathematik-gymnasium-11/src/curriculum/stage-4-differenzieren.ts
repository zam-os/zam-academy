import { fmt, linear, paren, quadratic, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { clipped, Plot } from "../lab/svg";
import { polyAt, polyDerivative, polyText, rel } from "../lab/shared";
import {
  differentiableAt0,
  dq,
  kinkValue,
  LIMIT_FUNCTIONS_D,
  RATE_FUNCTIONS,
  rulesPoly,
  SECANT_FUNCTIONS,
  secantSlope,
  signedH,
  sketchMatches,
  sketchTerm,
  SKETCH_FUNCTIONS,
  slopeAngle,
  tangentAt,
  tangentF,
} from "../lab/views-differenzieren";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { atanD, choiceField, numberField, RAD_HINT, tanD, yesNo } from "./helpers";

const STAGE_ID = "stage-4-differenzieren";
const LEHRPLAN = "M11 LB 4.1: Lokales und globales Differenzieren";

function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

function plus(value: number, digits = 2): string {
  return term(value, "", false, digits);
}

/** f(x) as the blackboard writes it for a quadratic a·x² + b·x + c. */
function quad(a: number, b: number, c: number): string {
  return quadratic(a, b, c);
}

// 4.1 Mittlere Änderungsrate ────────────────────────────────────────────────

function differenzenquotient(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.5, 1, 2, -1, -0.5, 3]);
    const b = nonZero(rng, 4);
    const c = rng.int(-5, 5);
    const x1 = rng.int(-3, 2);
    const x2 = x1 + rng.int(1, 4);
    const f = (x: number) => a * x * x + b * x + c;
    const m = (f(x2) - f(x1)) / (x2 - x1);
    return {
      prompt: `Berechne die mittlere Änderungsrate von <strong>f(x) = ${quad(a, b, c)}</strong> im Intervall [${fmt(x1)}; ${fmt(x2)}]. Sie ist die Steigung der Sekante durch die Punkte des Graphen an diesen Stellen.`,
      given: [`f(x) = ${quad(a, b, c)}`, `x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}`],
      formulaHint: "Differenzenquotient: (f(x₂) − f(x₁)) : (x₂ − x₁)",
      fields: [numberField("mittlere Änderungsrate:", m, "", 2, { slips: [{ value: (f(x2) - f(x1)) / 1, hint: "Teile die Differenz der Funktionswerte noch durch die Intervallbreite." }] })],
      steps: [`f(${fmt(x2)}) = ${fmt(f(x2))}, f(${fmt(x1)}) = ${fmt(f(x1))}`, `(${fmt(f(x2))} − ${paren(f(x1))}) : (${fmt(x2)} − ${paren(x1)}) = ${fmt(f(x2) - f(x1))} : ${fmt(x2 - x1)}`, `<strong>m = ${fmt(m)}</strong>`],
    };
  }
  // A road profile h(x) = p·x² + q·x (x in km, h in m): average gradient in percent.
  const p = rng.pick([-20, -10, 10, 20]);
  const q = rng.pick([60, 80, 100, 120]);
  const x1 = rng.int(0, 2);
  const x2 = x1 + rng.int(1, 3);
  const h = (x: number) => p * x * x + q * x;
  const perKm = (h(x2) - h(x1)) / (x2 - x1);
  return {
    prompt: `Das Höhenprofil einer Straße wird durch h(x) = ${quad(p, q, 0)} beschrieben (x: horizontale Entfernung in km, h: Höhe über dem Startpunkt in m). Wie groß ist die durchschnittliche Steigung zwischen km ${x1} und km ${x2} in Prozent?`,
    given: [`h(x) = ${quad(p, q, 0)}`, "1 km = 1000 m"],
    fields: [numberField("durchschnittliche Steigung:", perKm / 10, "%", 2, { slips: [{ value: perKm, hint: "Das sind Meter Höhe pro Kilometer. In Prozent: Meter pro 100 m, also durch 10 teilen." }] })],
    steps: [`h(${x2}) − h(${x1}) = ${fmt(h(x2))} m − ${fmt(h(x1))} m = ${fmt(h(x2) - h(x1))} m`, `auf ${x2 - x1} km = ${(x2 - x1) * 1000} m: ${fmt(h(x2) - h(x1))} : ${(x2 - x1) * 1000} = ${fmt(perKm / 1000, 4)}`, `<strong>${fmt(perKm / 10)} %</strong>`],
  };
}

function durchschnitt(rng: Rng, level: 1 | 2): ExerciseTask {
  const k = rng.pick([0.5, 1, 1.5, 2, 2.5, 5]);
  if (level === 1) {
    const t1 = rng.int(0, 4);
    const t2 = t1 + rng.int(1, 4);
    const v = k * (t1 + t2);
    return {
      prompt: `Ein Fahrzeug fährt aus dem Stand an; nach t Sekunden hat es s(t) = ${fmt(k)}t² Meter zurückgelegt. Wie groß ist seine Durchschnittsgeschwindigkeit zwischen t = ${t1} s und t = ${t2} s?`,
      given: [`s(t) = ${fmt(k)}t²`],
      formulaHint: "Durchschnittsgeschwindigkeit = (s(t₂) − s(t₁)) : (t₂ − t₁)",
      fields: [numberField("v̄ =", v, "m/s", 2)],
      steps: [`s(${t2}) = ${fmt(k * t2 * t2)} m, s(${t1}) = ${fmt(k * t1 * t1)} m`, `(${fmt(k * t2 * t2)} − ${fmt(k * t1 * t1)}) : ${t2 - t1} = ${fmt(v)}`, `<strong>v̄ = ${fmt(v)} m/s</strong>`],
    };
  }
  const target = k * rng.pick([4, 6, 8, 10]);
  const T = target / k;
  return {
    prompt: `Eine Kugel rollt eine Rampe hinab: s(t) = ${fmt(k)}t² (t in s, s in m). Nach welcher Zeit T hat sie seit dem Start eine Durchschnittsgeschwindigkeit von ${fmt(target)} m/s erreicht? Welchen Weg hat sie dann zurückgelegt?`,
    given: [`s(t) = ${fmt(k)}t²`, `v̄ = ${fmt(target)} m/s auf [0; T]`],
    fields: [numberField("T =", T, "s", 2), numberField("s(T) =", k * T * T, "m", 2)],
    steps: [`(s(T) − s(0)) : T = ${fmt(k)}T² : T = ${fmt(k)}T`, `${fmt(k)}T = ${fmt(target)} ⇒ T = ${fmt(T)}`, `<strong>T = ${fmt(T)} s; s(T) = ${fmt(k * T * T)} m</strong>`],
  };
}

const differenzenquotientLesson: Lesson = {
  id: "df-1-differenzenquotient",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Mittlere Änderungsrate",
  subtitle: "Differenzenquotient und Sekantensteigung",
  lehrplan: `${LEHRPLAN}, Differenzenquotient als Sekantensteigung und mittlere Änderungsrate`,
  whyItMatters:
    "Wie schnell ändert sich eine Größe im Durchschnitt? Durchschnittsgeschwindigkeit, mittleres Wachstum oder die durchschnittliche Steigung einer Straße sind alle derselbe Quotient. Er ist der erste Schritt zur Ableitung.",
  explanationHtml: `
    <p>Für eine Funktion f und zwei Stellen x₁ ≠ x₂ heißt</p>
    <p class="formula-line">(f(x₂) − f(x₁)) / (x₂ − x₁) = Δy / Δx</p>
    <p><strong>Differenzenquotient</strong> von f im Intervall [x₁; x₂]. Geometrisch ist er die <strong>Steigung der Sekante</strong> durch die Punkte P(x₁ | f(x₁)) und Q(x₂ | f(x₂)). Inhaltlich gibt er die <strong>mittlere Änderungsrate</strong> von f in diesem Intervall an: um wie viel sich f(x) durchschnittlich ändert, wenn x um 1 zunimmt.</p>
    <ul>
      <li>Beschreibt s(t) den Weg in Abhängigkeit von der Zeit, ist der Differenzenquotient die <strong>Durchschnittsgeschwindigkeit</strong> (Einheit m/s).</li>
      <li>Beschreibt h(x) ein Höhenprofil, ist er die <strong>durchschnittliche Steigung</strong> der Straße; mal 100 ergibt die Steigung in Prozent, wenn x und h dieselbe Einheit haben.</li>
    </ul>
    <div class="example">f(x) = 0,5x² im Intervall [1; 3]: f(3) = 4,5 und f(1) = 0,5, also (4,5 − 0,5) / (3 − 1) = 2. Die Sekante durch (1 | 0,5) und (3 | 4,5) hat die Steigung 2.<br>s(t) = t² (Meter, Sekunden): Zwischen t = 2 s und t = 5 s ist v̄ = (25 − 4) / 3 = 7 m/s.</div>
    <div class="merke"><strong>Merke:</strong> Differenzenquotient (f(x₂) − f(x₁)) / (x₂ − x₁) = Sekantensteigung = mittlere Änderungsrate von f auf [x₁; x₂]. Seine Einheit ist „Einheit von y pro Einheit von x“.</div>
  `,
  formulas: [
    { name: "Differenzenquotient", html: "m = (f(x₂) − f(x₁)) / (x₂ − x₁)", quantities: "Steigung der Sekante durch P(x₁ | f(x₁)) und Q(x₂ | f(x₂))" },
    { name: "Durchschnittsgeschwindigkeit", html: "v̄ = (s(t₂) − s(t₁)) / (t₂ − t₁)", quantities: "s Weg, t Zeit" },
  ],
  quiz: {
    question: "Was gibt der Differenzenquotient von f im Intervall [1; 4] geometrisch an?",
    options: ["die Steigung der Sekante durch die Graphenpunkte bei x = 1 und x = 4", "die Steigung der Tangente im Punkt bei x = 1", "den Unterschied f(4) − f(1) der Funktionswerte"],
    correctIndex: 0,
    explanation: "Δy / Δx ist die Steigung der Geraden durch zwei Punkte des Graphen. Die Tangentensteigung entsteht erst als Grenzwert; f(4) − f(1) ist nur der Zähler.",
  },
  lab: {
    kind: "secant-slope",
    title: "Labor: Sekanten ziehen",
    intro: "Ziehe die Punkte P und Q auf dem Graphen. Das Steigungsdreieck zeigt Δx (orange) und Δy (blau); oben steht der Differenzenquotient.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: SECANT_FUNCTIONS.map((f, i) => ({ value: i, label: f.term })) },
      { type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -4, max: 8, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "x1", label: "x-Wert von Q", unit: "", min: -4, max: 8, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "dq", label: "Differenzenquotient", emphasis: true, compute: (v) => { const m = secantSlope(v); return Number.isFinite(m) ? `${fmt(m)}${SECANT_FUNCTIONS[v.fn].unit ? ` ${SECANT_FUNCTIONS[v.fn].unit}` : ""}` : "nicht definiert für P = Q"; } },
      { key: "dx", label: "Δx", compute: (v) => v.x1 - v.x0, digits: 2 },
      { key: "dy", label: "Δy", compute: (v) => SECANT_FUNCTIONS[v.fn].f(v.x1) - SECANT_FUNCTIONS[v.fn].f(v.x0), digits: 2 },
    ],
    goals: [
      { id: "steigung-2", text: "f(x) = 0,5x²: Lege eine Sekante mit der Steigung 2.", check: (v) => v.fn === 0 && Math.abs(secantSlope(v) - 2) < 1e-9 },
      { id: "waagrecht", text: "f(x) = 0,5x²: Lege eine waagrechte Sekante.", check: (v) => v.fn === 0 && v.x0 !== v.x1 && Math.abs(secantSlope(v)) < 1e-9 },
      { id: "geschwindigkeit", text: "s(t) = t²: Finde ein Zeitintervall der Länge 2 s mit der Durchschnittsgeschwindigkeit 12 m/s.", check: (v) => v.fn === 1 && Math.abs(Math.abs(v.x1 - v.x0) - 2) < 1e-9 && Math.abs(secantSlope(v) - 12) < 1e-9 },
    ],
  },
  exercises: [
    { id: "differenzenquotient", make: differenzenquotient },
    { id: "durchschnitt", make: durchschnitt },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest mittlere Änderungsraten und deutest sie als Sekantensteigung.",
};

// 4.2 Differentialquotient ─────────────────────────────────────────────────

function hMethode(rng: Rng, level: 1 | 2): ExerciseTask {
  const a = rng.pick([0.5, 1, 2, 3, -1]);
  const x0 = nonZero(rng, 3);
  if (level === 1) {
    const h = 0.1;
    const value = 2 * a * x0 + a * h;
    return {
      prompt: `Für f(x) = ${quad(a, 0, 0)} gilt (f(x₀ + h) − f(x₀)) / h = ${fmt(2 * a)}x₀${term(a, "h", false)}. Berechne den Differenzenquotienten an der Stelle x₀ = ${fmt(x0)} für h = 0,1 und den Grenzwert für h → 0.`,
      given: [`f(x) = ${quad(a, 0, 0)}`, `x₀ = ${fmt(x0)}`],
      formulaHint: "f′(x₀) = lim<sub>h→0</sub> (f(x₀ + h) − f(x₀)) / h: Der Summand mit h fällt weg.",
      fields: [numberField("für h = 0,1:", value, "", 2), numberField(`f′(${fmt(x0)}) =`, 2 * a * x0, "", 2, { slips: [{ value, hint: "Das ist noch der Wert für h = 0,1. Für h → 0 fällt der Summand mit h weg." }] })],
      steps: [`${fmt(2 * a)} · ${paren(x0)} ${a < 0 ? "−" : "+"} ${fmt(Math.abs(a))} · 0,1 = ${fmt(value)}`, `h → 0: ${fmt(2 * a)} · ${paren(x0)} = ${fmt(2 * a * x0)}`, `<strong>${fmt(value)}; f′(${fmt(x0)}) = ${fmt(2 * a * x0)}</strong>`],
    };
  }
  const b = nonZero(rng, 4);
  const aa = Math.abs(a);
  const derivative = 2 * aa * x0 + b;
  return {
    prompt: `Berechne für f(x) = ${quad(aa, b, 0)} den Differentialquotienten an der Stelle x₀ = ${fmt(x0)} mit der h-Methode. Für welches h ist der Differenzenquotient um genau 0,1 größer als f′(${fmt(x0)})?`,
    given: [`f(x) = ${quad(aa, b, 0)}`],
    fields: [numberField(`f′(${fmt(x0)}) =`, derivative, "", 2), numberField("h =", 0.1 / aa, "", 3, { slips: [{ value: 0.1, hint: `Der Differenzenquotient ist f′(x₀) + ${fmt(aa)}h; setze ${fmt(aa)}h = 0,1.` }] })],
    steps: [
      `f(x₀ + h) − f(x₀) = ${aa === 1 ? "" : fmt(aa)}(2x₀h + h²)${term(b, "h", false)}, geteilt durch h: ${fmt(2 * aa)}x₀${term(aa, "h", false)}${plus(b)}`,
      `h → 0: f′(${fmt(x0)}) = ${fmt(2 * aa)} · ${paren(x0)}${plus(b)} = ${fmt(derivative)}`,
      `${aa === 1 ? "" : fmt(aa)}h = 0,1 ⇒ h = ${fmt(0.1 / aa, 3)}`,
      `<strong>f′(${fmt(x0)}) = ${fmt(derivative)}; h = ${fmt(0.1 / aa, 3)}</strong>`,
    ],
  };
}

function momentan(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const t0 = rng.int(1, 5);
    const h = 0.1;
    const avg = 5 * (2 * t0 + h);
    return {
      prompt: `Ein Stein fällt; nach t Sekunden ist er s(t) = 5t² Meter gefallen. Berechne seine Durchschnittsgeschwindigkeit im Zeitraum [${t0}; ${fmt(t0 + h)}] und seine Momentangeschwindigkeit zum Zeitpunkt ${t0} s.`,
      given: ["s(t) = 5t²", `t₀ = ${t0} s`],
      formulaHint: "Momentangeschwindigkeit v(t₀) = lim<sub>h→0</sub> (s(t₀ + h) − s(t₀)) / h = 5 · (2t₀ + h) für h → 0",
      fields: [numberField("v̄ =", avg, "m/s", 2), numberField(`v(${t0}) =`, 10 * t0, "m/s", 2)],
      steps: [`(s(${fmt(t0 + h)}) − s(${t0})) / 0,1 = (${fmt(5 * (t0 + h) ** 2)} − ${5 * t0 * t0}) / 0,1 = ${fmt(avg)}`, `h → 0: 5 · 2 · ${t0} = ${10 * t0}`, `<strong>v̄ = ${fmt(avg)} m/s; v(${t0}) = ${10 * t0} m/s</strong>`],
    };
  }
  const x0 = nonZero(rng, 3);
  const h = 0.01;
  const value = ((x0 + h) ** 3 - x0 ** 3) / h;
  return {
    prompt: `Für f(x) = x³ gilt (f(x₀ + h) − f(x₀)) / h = 3x₀² + 3x₀h + h². Berechne den Differenzenquotienten an der Stelle ${fmt(x0)} für h = 0,01 (auf vier Nachkommastellen genau) und die Steigung des Graphen im Punkt (${fmt(x0)} | ${fmt(x0 ** 3)}).`,
    given: ["f(x) = x³", `x₀ = ${fmt(x0)}`],
    // No 1 % margin: it would accept f′(x₀) itself as the difference quotient.
    fields: [numberField("für h = 0,01:", value, "", 4, { tolerance: 0 }), numberField(`f′(${fmt(x0)}) =`, 3 * x0 * x0, "", 2)],
    steps: [`3 · ${fmt(x0 * x0)} + 3 · ${paren(x0)} · 0,01 + 0,0001 = ${fmt(value, 4)}`, `h → 0: f′(${fmt(x0)}) = 3 · ${fmt(x0 * x0)} = ${fmt(3 * x0 * x0)}`, `<strong>${fmt(value, 4)}; f′(${fmt(x0)}) = ${fmt(3 * x0 * x0)}</strong>`],
  };
}

const differentialquotient: Lesson = {
  id: "df-2-differentialquotient",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 Tangentensteigung als Grenzwert",
  subtitle: "Vom Differenzenquotienten zum Differentialquotienten",
  lehrplan: `${LEHRPLAN}, Differentialquotient als Tangentensteigung`,
  whyItMatters:
    "Der Tacho zeigt keine Durchschnittsgeschwindigkeit, sondern die Geschwindigkeit in genau diesem Moment. Diese momentane Änderung ist der Grenzwert der Sekantensteigungen, wenn die beiden Punkte zusammenrücken.",
  explanationHtml: `
    <p>Lässt du im Differenzenquotienten den zweiten Punkt Q(x₀ + h | f(x₀ + h)) immer näher an P(x₀ | f(x₀)) heranrücken, also h → 0 (von rechts und von links), so nähern sich die Sekanten der <strong>Tangente</strong> in P. Existiert der Grenzwert</p>
    <p class="formula-line">f′(x₀) = lim<sub>h→0</sub> (f(x₀ + h) − f(x₀)) / h,</p>
    <p>heißt er <strong>Differentialquotient</strong> oder Ableitung von f an der Stelle x₀. Er ist die <strong>Steigung der Tangente</strong> in P und damit die <strong>Steigung des Graphen</strong> in diesem Punkt.</p>
    <p>Berechnen mit der <strong>h-Methode</strong>: Differenzenquotient aufstellen, Zähler ausmultiplizieren und vereinfachen, durch h kürzen, dann h → 0 betrachten. Mit einer Mathematiksoftware kannst du den Grenzprozess auch beobachten, wie hier im Labor.</p>
    <div class="example">f(x) = x², x₀ = 1: (f(1 + h) − f(1)) / h = (1 + 2h + h² − 1) / h = 2 + h. Für h → 0 folgt f′(1) = 2. Für h = 0,1 ist die Sekantensteigung 2,1, für h = −0,1 ist sie 1,9; beide nähern sich 2.</div>
    <div class="merke"><strong>Merke:</strong> f′(x₀) = lim<sub>h→0</sub> (f(x₀ + h) − f(x₀)) / h ist die Steigung der Tangente an den Graphen im Punkt P(x₀ | f(x₀)), also die Steigung des Graphen in P.</div>
  `,
  formulas: [
    { name: "Differentialquotient", html: "f′(x₀) = lim<sub>h→0</sub> (f(x₀ + h) − f(x₀)) / h", quantities: "Steigung der Tangente im Punkt P(x₀ | f(x₀))" },
    { name: "Beispiel h-Methode", html: "f(x) = x²: (f(x₀ + h) − f(x₀)) / h = 2x₀ + h → 2x₀", quantities: "h ≠ 0 kürzen, dann h → 0" },
  ],
  quiz: {
    question: "Warum darf man in (f(x₀ + h) − f(x₀)) / h nicht einfach h = 0 einsetzen?",
    options: ["Weil dann 0 : 0 entsteht; man kürzt erst und betrachtet dann h → 0.", "Weil die Tangente dann senkrecht wäre.", "Weil f an der Stelle x₀ nicht definiert ist."],
    correctIndex: 0,
    explanation: "Für h = 0 sind Zähler und Nenner null, der Ausdruck ist nicht definiert. Nach dem Vereinfachen (z. B. zu 2x₀ + h) kann man den Grenzwert für h → 0 ablesen.",
  },
  lab: {
    kind: "secant-to-tangent",
    title: "Labor: Die Sekante wird zur Tangente",
    intro: "Ziehe Q an P heran (kleines h) und wechsle die Seite. Gestrichelt siehst du die Tangente in P; die violette Sekante legt sich an sie an.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: LIMIT_FUNCTIONS_D.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "x0", label: "Stelle x₀", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "h", label: "Abstand h", unit: "", min: 0.05, max: 2, step: 0.05, value: 1, digits: 2 },
      { type: "choice", key: "side", label: "Q liegt", value: 1, options: [{ value: 0, label: "links von P (h < 0)" }, { value: 1, label: "rechts von P (h > 0)" }] },
    ],
    readouts: [
      { key: "dq", label: "Sekantensteigung", emphasis: true, compute: (v) => dq(v), digits: 4 },
      { key: "h", label: "h", compute: (v) => signedH(v), digits: 2 },
      { key: "tangent", label: "Tangentensteigung f′(x₀)", compute: (v) => LIMIT_FUNCTIONS_D[v.fn].d(v.x0), digits: 3 },
    ],
    goals: [
      { id: "klein", text: "f(x) = x², x₀ = 1: Mache h so klein wie möglich, mit Q rechts von P.", check: (v) => v.fn === 0 && v.x0 === 1 && v.side === 1 && v.h === 0.05 },
      { id: "links", text: "f(x) = x², x₀ = 2: Nähere dich von links, bis die Sekantensteigung zwischen 3,9 und 4 liegt.", check: (v) => v.fn === 0 && v.x0 === 2 && v.side === 0 && dq(v) >= 3.9 && dq(v) < 4 },
      { id: "steigung-3", text: "f(x) = x³: Finde eine Stelle, an der die Tangente die Steigung 3 hat, und bringe die Sekante bis auf h = 0,05 heran.", check: (v) => v.fn === 1 && Math.abs(v.x0) === 1 && v.h === 0.05 },
    ],
  },
  exercises: [
    { id: "h-methode", make: hMethode },
    { id: "momentan", make: momentan },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du verstehst die Tangentensteigung als Grenzwert von Sekantensteigungen und berechnest sie mit der h-Methode.",
};

// 4.3 Differenzierbarkeit ──────────────────────────────────────────────────

function knick(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const x0 = rng.pick([1, 2, -1]);
    const m1 = nonZero(rng, 3);
    const smooth = rng.next() < 0.4;
    const m2 = smooth ? m1 : m1 + rng.pick([1, -1, 2, -2]);
    const t1 = rng.int(-3, 3);
    const y0 = m1 * x0 + t1;
    const t2 = y0 - m2 * x0;
    return {
      prompt: `f(x) = ${linear(m1, t1)} für x ≤ ${fmt(x0)} und f(x) = ${linear(m2, t2)} für x &gt; ${fmt(x0)}. Gib die Steigungen links und rechts der Stelle ${fmt(x0)} an. Ist f dort differenzierbar?`,
      given: [`linker Teil: ${linear(m1, t1)}`, `rechter Teil: ${linear(m2, t2)}`],
      formulaHint: "Beide Teile treffen sich bei x₀. Differenzierbar heißt: kein Knick, also gleiche Steigung von links und von rechts.",
      fields: [numberField("Steigung links:", m1, "", 2), numberField("Steigung rechts:", m2, "", 2), yesNo(`differenzierbar bei ${fmt(x0)}?`, smooth)],
      steps: [`Beide Teile haben bei x = ${fmt(x0)} den Wert ${fmt(y0)}: f ist stetig.`, `Steigungen ${fmt(m1)} und ${fmt(m2)}: ${smooth ? "gleich, kein Knick" : "verschieden, ein Knick"}.`, `<strong>${fmt(m1)} und ${fmt(m2)}; ${smooth ? "differenzierbar" : "nicht differenzierbar"}</strong>`],
    };
  }
  const k = rng.pick([1, 4, 9]);
  const s = Math.sqrt(k);
  return {
    prompt: `An welchen Stellen ist f(x) = |x² − ${k}| nicht differenzierbar? Gib die positive Stelle an und die Steigung des Graphen kurz rechts von ihr. Ist f dort stetig?`,
    given: [`f(x) = |x² − ${k}|`],
    fields: [numberField("positive Stelle x =", s, "", 2), numberField("Steigung rechts davon:", 2 * s, "", 2), yesNo("stetig an dieser Stelle?", true)],
    steps: [
      `Wo x² − ${k} das Vorzeichen wechselt (x = ±${fmt(s)}), wird der Teil unterhalb der x-Achse nach oben geklappt: ein Knick.`,
      `Rechts von ${fmt(s)}: f(x) = x² − ${k}, Steigung 2 · ${fmt(s)} = ${fmt(2 * s)}; links davon −${fmt(2 * s)}.`,
      `<strong>x = ${fmt(s)}; Steigung ${fmt(2 * s)}; stetig, aber nicht differenzierbar</strong>`,
    ],
  };
}

function glattAnschliessen(rng: Rng, level: 1 | 2): ExerciseTask {
  const x0 = rng.pick([1, 2, 3]);
  const a = rng.pick([0.25, 0.5, 1]);
  const m = 2 * a * x0;
  const t = a * x0 * x0 - m * x0;
  if (level === 1) {
    return {
      prompt: `f(x) = ${quad(a, 0, 0)} für x ≤ ${x0} und f(x) = mx + t für x &gt; ${x0}. Bestimme m und t so, dass f an der Stelle ${x0} differenzierbar ist.`,
      given: [`linker Teil: ${quad(a, 0, 0)}`, "rechter Teil: mx + t"],
      formulaHint: `Gleicher Wert und gleiche Steigung bei ${x0}: m = Steigung von ${quad(a, 0, 0)} bei ${x0}, dann t aus dem gemeinsamen Punkt.`,
      fields: [numberField("m =", m, "", 2), numberField("t =", t, "", 2)],
      steps: [`Steigung der Parabel bei ${x0}: ${fmt(2 * a)} · ${x0} = ${fmt(m)}`, `Punkt (${x0} | ${fmt(a * x0 * x0)}): t = ${fmt(a * x0 * x0)} − ${fmt(m)} · ${x0} = ${fmt(t)}`, `<strong>m = ${fmt(m)}, t = ${fmt(t)}</strong>`],
    };
  }
  return {
    prompt: `Eine Skaterampe hat im Querschnitt bis x = ${x0} m die Form einer Parabel y = ${quad(a, 0, 0)} (Angaben in m) und geht dann geradlinig weiter. Wie steil (Steigung m) muss das gerade Stück sein und auf welcher Höhe y beginnt es, damit kein Knick entsteht? In welcher Höhe ist man auf dem geraden Stück 1 m weiter rechts?`,
    given: [`Parabel y = ${quad(a, 0, 0)} für 0 ≤ x ≤ ${x0}`],
    fields: [numberField("m =", m, "", 2), numberField("Höhe bei x₀:", a * x0 * x0, "m", 2), numberField("Höhe 1 m weiter:", a * x0 * x0 + m, "m", 2)],
    steps: [`Ohne Knick: gleiche Steigung wie die Parabel bei ${x0}: ${fmt(m)}`, `Höhe: ${fmt(a)} · ${x0 * x0} = ${fmt(a * x0 * x0)}`, `<strong>m = ${fmt(m)}; ${fmt(a * x0 * x0)} m; ${fmt(a * x0 * x0 + m)} m</strong>`],
  };
}

const differenzierbarkeit: Lesson = {
  id: "df-3-differenzierbarkeit",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Differenzierbarkeit",
  subtitle: "Knicke, die keine Tangente zulassen",
  lehrplan: `${LEHRPLAN}, lokale Differenzierbarkeit, Graphen mit nicht differenzierbaren Stellen wie die Betragsfunktion`,
  whyItMatters:
    "Nicht jeder Graph hat überall eine Tangente. An einem Knick, etwa bei der Betragsfunktion, gibt es keine eindeutige Steigung. Wo Übergänge glatt sein müssen, bei Straßen, Bahngleisen oder Rampen, ist Differenzierbarkeit eine Konstruktionsbedingung.",
  explanationHtml: `
    <p>f heißt an der Stelle x₀ <strong>differenzierbar</strong>, wenn der Differentialquotient f′(x₀) existiert: Die Sekantensteigungen müssen sich für h → 0 von links und von rechts <strong>demselben</strong> Wert nähern. Anschaulich hat der Graph in P(x₀ | f(x₀)) dann eine eindeutige Tangente; unter einer immer stärkeren Lupe sieht er aus wie eine Gerade.</p>
    <p>Nicht differenzierbar ist f zum Beispiel</p>
    <ul>
      <li>an einem <strong>Knick</strong>: Von links und rechts ergeben sich verschiedene Steigungen. Beispiel: die <strong>Betragsfunktion</strong> f(x) = |x| an der Stelle 0, mit Steigung −1 links und 1 rechts;</li>
      <li>an einer <strong>Sprungstelle</strong>: Eine nicht stetige Funktion ist dort auch nicht differenzierbar.</li>
    </ul>
    <p>Eine differenzierbare Funktion ist immer stetig; die Umkehrung gilt nicht, wie |x| zeigt.</p>
    <div class="example">f(x) = |x|: Für h &gt; 0 ist (|0 + h| − |0|)/h = h/h = 1, für h &lt; 0 ist er (−h)/h = −1. Die beiden einseitigen Grenzwerte sind verschieden, f ist bei 0 nicht differenzierbar. f(x) = x² für x ≤ 1 und f(x) = 2x − 1 für x &gt; 1 ist dagegen bei 1 differenzierbar: Wert 1 und Steigung 2 von beiden Seiten.</div>
    <div class="merke"><strong>Merke:</strong> Differenzierbar bei x₀ heißt: Die Sekantensteigungen haben von links und von rechts denselben Grenzwert. An Knicken (|x| bei 0) und Sprüngen ist f nicht differenzierbar.</div>
  `,
  formulas: [
    { name: "Betragsfunktion", html: "|x| = x für x ≥ 0 und |x| = −x für x &lt; 0", quantities: "bei 0 stetig, aber nicht differenzierbar (Knick)" },
    { name: "Glatter Übergang", html: "gleicher Funktionswert und gleiche Steigung beider Teile an der Nahtstelle", quantities: "dann ist f dort differenzierbar" },
  ],
  quiz: {
    question: "f(x) = |x − 2|. An welcher Stelle ist f nicht differenzierbar?",
    options: ["bei x = 2, dort hat der Graph einen Knick", "bei x = 0, dort ist der Betrag null", "nirgends, f ist stetig"],
    correctIndex: 0,
    explanation: "Der Graph ist der von |x|, um 2 nach rechts verschoben. Der Knick liegt bei x = 2: links Steigung −1, rechts 1. Stetigkeit allein reicht nicht für Differenzierbarkeit.",
  },
  lab: {
    kind: "kink-zoom",
    title: "Labor: Knick unter der Lupe",
    intro: "Links von 0 gilt f(x) = m₁x, rechts f(x) = x² + m₂x. Ziehe die beiden Äste und vergrößere mit der Lupe die Umgebung von 0.",
    params: [
      { type: "range", key: "m1", label: "Steigung links m₁", unit: "", min: -3, max: 3, step: 0.5, value: 0.5, digits: 1 },
      { type: "range", key: "m2", label: "Steigung rechts m₂", unit: "", min: -3, max: 3, step: 0.5, value: 0.5, digits: 1 },
      { type: "choice", key: "zoom", label: "Lupe", value: 1, options: [{ value: 1, label: "×1" }, { value: 4, label: "×4" }, { value: 16, label: "×16" }, { value: 64, label: "×64" }] },
    ],
    readouts: [
      { key: "verdict", label: "bei x = 0", emphasis: true, compute: (v) => (differentiableAt0(v) ? `differenzierbar, f′(0) = ${fmt(v.m1)}` : "nicht differenzierbar (Knick)") },
      { key: "left", label: "Sekantensteigung links (h = −0,001)", compute: (v) => (kinkValue(v, -0.001) - kinkValue(v, 0)) / -0.001, digits: 3 },
      { key: "right", label: "Sekantensteigung rechts (h = 0,001)", compute: (v) => (kinkValue(v, 0.001) - kinkValue(v, 0)) / 0.001, digits: 3 },
    ],
    goals: [
      { id: "betrag", text: "Stelle einen Knick wie bei der Betragsfunktion ein: links Steigung −1, rechts Steigung 1.", check: (v) => v.m1 === -1 && v.m2 === 1 },
      { id: "glatt", text: "Mache den Übergang glatt mit der Steigung 1 an der Stelle 0.", check: (v) => v.m1 === 1 && v.m2 === 1 },
      { id: "lupe", text: "Zoome mit der stärksten Lupe auf einen Knick: Er wird nicht zur Geraden.", check: (v) => v.zoom === 64 && !differentiableAt0(v) },
    ],
  },
  exercises: [
    { id: "knick", make: knick },
    { id: "glatt-anschliessen", make: glattAnschliessen },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst Stellen, an denen ein Graph keine Tangente hat.",
};

// 4.4 Graph der Ableitungsfunktion ─────────────────────────────────────────

/** A small graph of a cubic for a task, drawn with the lab's SVG helpers. */
function cubicSvg(f: (x: number) => number, label: string): string {
  const plot = new Plot(-4, 4, -6, 6, { x: 14, y: 10, w: 300, h: 190 });
  return `<svg class="task-svg" viewBox="0 0 330 210" role="img" aria-label="${label}">${plot.clip("clip-task")}${plot.grid(1, 2)}${clipped("clip-task", plot.graph(f, "lab-curve"))}</svg>`;
}

function ausGraph(rng: Rng, level: 1 | 2): ExerciseTask {
  const [p, q] = rng.shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 2).sort((x, y) => x - y);
  const a = rng.pick([1, -1]);
  // f′(x) = a(x − p)(x − q): for a > 0 a Hochpunkt at p and a Tiefpunkt at q.
  if (level === 1) {
    const r = (p + q) / 2;
    return {
      prompt: `Der Graph einer ganzrationalen Funktion f hat einen ${a > 0 ? "Hochpunkt" : "Tiefpunkt"} bei x = ${fmt(p)} und einen ${a > 0 ? "Tiefpunkt" : "Hochpunkt"} bei x = ${fmt(q)}; dazwischen ${a > 0 ? "fällt" : "steigt"} er. Wo hat der Graph von f′ Nullstellen, und welches Vorzeichen hat f′(${fmt(r)})?`,
      given: [`Extremstellen bei ${fmt(p)} und ${fmt(q)}`],
      formulaHint: "Waagrechte Tangente ⇒ f′ = 0. f steigt ⇒ f′ &gt; 0; f fällt ⇒ f′ &lt; 0.",
      fields: [numberField("Nullstelle x₁ =", p, "", 2), numberField("Nullstelle x₂ =", q, "", 2), choiceField(`f′(${fmt(r)}) ist`, ["positiv", "negativ"], a > 0 ? 1 : 0)],
      anyOrder: [0, 1],
      steps: [`An Hoch- und Tiefpunkten ist die Tangente waagrecht: f′(${fmt(p)}) = f′(${fmt(q)}) = 0.`, `Zwischen ${fmt(p)} und ${fmt(q)} ${a > 0 ? "fällt f, also f′ &lt; 0" : "steigt f, also f′ &gt; 0"}.`, `<strong>Nullstellen ${fmt(p)} und ${fmt(q)}; f′(${fmt(r)}) ${a > 0 ? "negativ" : "positiv"}</strong>`],
    };
  }
  // f(x) = a(x³/3 − (p + q)x²/2 + pq·x), scaled to fit the picture.
  // Scaled so the two extreme values lie 4 units apart, shifted so the turning point is on the x-axis.
  const F = (x: number) => x ** 3 / 3 - ((p + q) * x * x) / 2 + p * q * x;
  const w = (p + q) / 2;
  const k = 4 / Math.abs(F(p) - F(q));
  const f = (x: number) => a * k * (F(x) - F(w));
  return {
    prompt: `Der Graph zeigt eine Funktion f; ihre Extremstellen liegen bei ganzen Zahlen.<br>${cubicSvg(f, "Graph einer Funktion dritten Grades")}<br>An welcher Stelle zwischen den Extremstellen ist der Graph von f am steilsten, hat also f′ einen Extrempunkt? Ist f′(${fmt(q + 1)}) positiv oder negativ?`,
    given: ["Graph von f, Kästchenbreite 1"],
    fields: [numberField("Extremstelle von f′: x =", w, "", 2), choiceField(`f′(${fmt(q + 1)}) ist`, ["positiv", "negativ"], a > 0 ? 0 : 1)],
    steps: [
      `Extremstellen von f bei ${fmt(p)} und ${fmt(q)}: dort ist f′ = 0, f′ ist eine Parabel mit diesen Nullstellen.`,
      `Der Scheitel der Parabel liegt in der Mitte: x = ${fmt(w)}. Dort ist der Graph von f am steilsten.`,
      `<strong>x = ${fmt(w)}; f′(${fmt(q + 1)}) ${a > 0 ? "positiv" : "negativ"}</strong>`,
    ],
  };
}

function ableitungDeuten(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const m = rng.pick([2, 3, 4, -2]);
    const c = nonZero(rng, 6);
    const zero = -c / m;
    const x = zero + rng.pick([2, -2, 3]);
    const rising = m * x + c > 0;
    return {
      prompt: `Die Ableitung einer Funktion f ist f′(x) = ${linear(m, c)}. An welcher Stelle hat der Graph von f eine waagrechte Tangente? Steigt der Graph von f an der Stelle ${fmt(x)}?`,
      given: [`f′(x) = ${linear(m, c)}`],
      formulaHint: "Waagrechte Tangente: f′(x) = 0. Steigen: f′(x) &gt; 0.",
      fields: [numberField("waagrechte Tangente bei x =", zero, "", 2), yesNo(`steigt f bei ${fmt(x)}?`, rising)],
      steps: [`${linear(m, c)} = 0 ⇔ x = ${fmt(zero)}`, `f′(${fmt(x)}) = ${fmt(m * x + c)} ${rising ? "&gt;" : "&lt;"} 0`, `<strong>x = ${fmt(zero)}; ${rising ? "ja, f steigt" : "nein, f fällt"}</strong>`],
    };
  }
  const [p, q] = rng.shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 2).sort((x, y) => x - y);
  const a = rng.pick([1, -1]);
  const w = (p + q) / 2;
  const what = a > 0 ? "am stärksten fällt" : "am stärksten steigt";
  return {
    prompt: `Der Graph von f′ ist eine ${a > 0 ? "nach oben" : "nach unten"} geöffnete Parabel mit den Nullstellen ${fmt(p)} und ${fmt(q)}. Welche Art von Extrempunkt hat der Graph von f bei x = ${fmt(p)}? An welcher Stelle zwischen ${fmt(p)} und ${fmt(q)} ${what.replace("am", "der Graph von f am")}?`,
    given: [`f′(x) = ${a > 0 ? "" : "−"}(x ${p > 0 ? "−" : "+"} ${Math.abs(p)})(x ${q > 0 ? "−" : "+"} ${Math.abs(q)})`],
    fields: [choiceField(`bei x = ${fmt(p)}`, ["Hochpunkt", "Tiefpunkt"], a > 0 ? 0 : 1), numberField(`${what.replace("am stärksten", "am stärksten")} bei x =`, w, "", 2)],
    steps: [
      `Bei ${fmt(p)} wechselt f′ das Vorzeichen von ${a > 0 ? "+ nach −" : "− nach +"}: ${a > 0 ? "Hochpunkt" : "Tiefpunkt"}.`,
      `Zwischen den Nullstellen ist f′ ${a > 0 ? "negativ" : "positiv"} und im Scheitel der Parabel bei x = ${fmt(w)} betragsmäßig am größten.`,
      `<strong>${a > 0 ? "Hochpunkt" : "Tiefpunkt"}; x = ${fmt(w)}</strong>`,
    ],
  };
}

const ableitungsfunktion: Lesson = {
  id: "df-4-ableitungsfunktion",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Graph der Ableitungsfunktion",
  subtitle: "Vom Graphen von f auf den Graphen von f′ schließen",
  lehrplan: `${LEHRPLAN}, Ableitungsfunktion und Zusammenhang der Graphen von f und f′`,
  whyItMatters:
    "Die Ableitungsfunktion fasst alle Tangentensteigungen in einem Graphen zusammen. Wer aus dem Verlauf von f auf f′ schließen kann, sieht sofort, wo eine Größe wächst, schrumpft oder am schnellsten zunimmt.",
  explanationHtml: `
    <p>Ordnet man jeder Stelle x die Steigung f′(x) des Graphen von f zu, erhält man die <strong>Ableitungsfunktion</strong> f′ mit</p>
    <p class="formula-line">f′(x) = lim<sub>h→0</sub> (f(x + h) − f(x)) / h.</p>
    <p>Den Graphen von f′ skizzierst du aus dem Graphen von f so:</p>
    <ul>
      <li>Wo f eine <strong>waagrechte Tangente</strong> hat (Hoch-, Tief- oder Terrassenpunkt), hat f′ eine <strong>Nullstelle</strong>.</li>
      <li>Wo der Graph von f′ <strong>oberhalb</strong> der x-Achse liegt (f′ &gt; 0), <strong>steigt</strong> f; wo er unterhalb liegt, fällt f. Umgekehrt kann f′ an einzelnen Stellen 0 sein, obwohl f überall steigt: f(x) = x³ steigt auf ganz ℝ, hat aber f′(0) = 0 (Lektion 5.1).</li>
      <li>Wo f <strong>am steilsten</strong> ist, hat f′ einen Hoch- oder Tiefpunkt.</li>
      <li>Je steiler f, desto weiter ist f′(x) von 0 entfernt.</li>
    </ul>
    <p>Begründe jeden Schritt mit der Steigung: „Bei x = 1 hat f einen Tiefpunkt, also ist dort die Tangente waagrecht und f′(1) = 0.“</p>
    <div class="example">f(x) = x³ − 3x hat einen Hochpunkt bei −1 und einen Tiefpunkt bei 1. Also hat f′ die Nullstellen −1 und 1, ist für x &lt; −1 und x &gt; 1 positiv und dazwischen negativ. Am steilsten fällt f bei x = 0; dort hat f′ seinen Tiefpunkt: f′(x) = 3x² − 3 ist eine nach oben geöffnete Parabel.</div>
    <div class="merke"><strong>Merke:</strong> Waagrechte Tangente von f ⇔ Nullstelle von f′. f′ &gt; 0 auf einem Intervall ⇒ f steigt dort (die Umkehrung gilt nicht, siehe x³). Steilste Stelle von f ⇔ Extremstelle von f′.</div>
  `,
  formulas: [
    { name: "Ableitungsfunktion", html: "f′: x ↦ f′(x) = lim<sub>h→0</sub> (f(x + h) − f(x)) / h", quantities: "ordnet jeder Stelle die Steigung des Graphen von f zu" },
    { name: "Zusammenhang der Graphen", html: "f′(x) &gt; 0: f steigt · f′(x) &lt; 0: f fällt · f′(x) = 0: waagrechte Tangente", quantities: "Extremstellen von f′: steilste Stellen von f" },
  ],
  quiz: {
    question: "Der Graph von f hat bei x = 2 einen Tiefpunkt. Was gilt für den Graphen von f′?",
    options: ["Er schneidet die x-Achse bei x = 2.", "Er hat bei x = 2 ebenfalls einen Tiefpunkt.", "Er liegt bei x = 2 unterhalb der x-Achse."],
    correctIndex: 0,
    explanation: "Im Tiefpunkt ist die Tangente waagrecht, also f′(2) = 0. Extrempunkte von f′ gehören zu den steilsten Stellen von f, nicht zu den Extrempunkten von f.",
  },
  lab: {
    kind: "derivative-sketch",
    title: "Labor: f′ skizzieren",
    intro: "Der blaue Graph zeigt f. Skizziere f′ als violette Parabel: Ziehe ihre beiden Nullstellen auf der x-Achse und den Formpunkt. Sie wird grün, wenn sie stimmt.",
    params: [
      { type: "choice", key: "fn", label: "Funktion f", value: 0, options: SKETCH_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "u", label: "erste Nullstelle der Skizze", unit: "", min: -3, max: 3, step: 0.5, value: -2, digits: 1 },
      { type: "range", key: "v", label: "zweite Nullstelle der Skizze", unit: "", min: -3, max: 3, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "a", label: "Formfaktor der Skizze", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
    ],
    readouts: [
      { key: "sketch", label: "deine Skizze", emphasis: true, compute: (v) => `y = ${sketchTerm(v)}` },
      { key: "check", label: "Vergleich mit f′", compute: (v) => (sketchMatches(v) ? "stimmt: das ist der Graph von f′" : `bei x = 0: Skizze ${fmt(v.a * v.u * v.v)}, f′(0) = ${fmt(SKETCH_FUNCTIONS[v.fn].d(0))}`) },
    ],
    goals: [
      { id: "kubisch", text: "Skizziere f′ für f(x) = x³ − 3x.", check: (v) => v.fn === 0 && sketchMatches(v) },
      { id: "nach-unten", text: "Skizziere f′ für f(x) = −x³/3 + x².", check: (v) => v.fn === 1 && sketchMatches(v) },
      { id: "verschoben", text: "Skizziere f′ für f(x) = x³/3 − 2x² + 3x.", check: (v) => v.fn === 2 && sketchMatches(v) },
    ],
  },
  exercises: [
    { id: "aus-graph", make: ausGraph },
    { id: "ableitung-deuten", make: ableitungDeuten },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du schließt vom Graphen einer Funktion auf den Graphen ihrer Ableitung und begründest es.",
};

// 4.5 Ableitungsregeln ─────────────────────────────────────────────────────

function ableiten(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const p = [rng.pick([1, 2, -1, 0.5, -2, 3]), nonZero(rng, 4), nonZero(rng, 6), rng.int(-9, 9)];
    const d = polyDerivative(p);
    return {
      prompt: `Leite ab: <strong>f(x) = ${polyText(p)}</strong>. Gib f′(x) = Ax² + Bx + C an.`,
      given: [`f(x) = ${polyText(p)}`],
      formulaHint: "Potenzregel (xⁿ)′ = n · xⁿ⁻¹, Faktorregel (a · f)′ = a · f′, Summenregel (f + g)′ = f′ + g′; Konstanten fallen weg.",
      fields: [numberField("A =", d[0], "", 2), numberField("B =", d[1], "", 2, { slips: [{ value: p[1], hint: "Potenzregel: Der Exponent 2 wandert als Faktor nach vorn." }] }), numberField("C =", d[2], "", 2)],
      steps: [`(${fmt(p[0])}x³)′ = ${fmt(3 * p[0])}x², (${fmt(p[1])}x²)′ = ${fmt(2 * p[1])}x, (${fmt(p[2])}x)′ = ${fmt(p[2])}, (${fmt(p[3])})′ = 0`, `<strong>f′(x) = ${polyText(d)}</strong>`],
    };
  }
  const k = rng.pick([1, 2, 0.5]);
  const r = nonZero(rng, 3);
  // f(x) = k·x·(x − r)² = k(x³ − 2r x² + r² x)
  const p = [k, -2 * k * r, k * r * r, 0];
  const d = polyDerivative(p);
  const x0 = rng.pick([1, 2, -1]);
  return {
    prompt: `Gegeben ist f(x) = ${fmt(k) === "1" ? "" : `${fmt(k)} · `}x · (x ${r > 0 ? "−" : "+"} ${Math.abs(r)})². Multipliziere aus, leite ab und berechne f′(${fmt(x0)}) und f′(0).`,
    given: [`f(x) = ${fmt(k) === "1" ? "" : `${fmt(k)} · `}x · (x ${r > 0 ? "−" : "+"} ${Math.abs(r)})²`],
    fields: [numberField(`f′(${fmt(x0)}) =`, polyAt(d, x0), "", 2), numberField("f′(0) =", polyAt(d, 0), "", 2)],
    steps: [`f(x) = ${polyText(p)}`, `f′(x) = ${polyText(d)}`, `<strong>f′(${fmt(x0)}) = ${fmt(polyAt(d, x0))}; f′(0) = ${fmt(polyAt(d, 0))}</strong>`],
  };
}

function ableitungswert(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const p = [rng.pick([1, -1, 2]), 0, nonZero(rng, 5), rng.int(-5, 5)];
    const d = polyDerivative(p);
    const x0 = nonZero(rng, 3);
    return {
      prompt: `Berechne die Steigung des Graphen von f(x) = ${polyText(p)} an der Stelle ${fmt(x0)}.`,
      given: [`f(x) = ${polyText(p)}`],
      formulaHint: "Erst f′(x) mit den Ableitungsregeln bilden, dann x₀ einsetzen.",
      fields: [numberField(`f′(${fmt(x0)}) =`, polyAt(d, x0), "", 2, { slips: [{ value: polyAt(p, x0), hint: "Das ist f(x₀), der Funktionswert. Gesucht ist die Steigung f′(x₀)." }] })],
      steps: [`f′(x) = ${polyText(d)}`, `<strong>f′(${fmt(x0)}) = ${fmt(polyAt(d, x0))}</strong>`],
    };
  }
  const b = nonZero(rng, 4) * 2;
  const target = rng.pick([2, 4, 6, -2]);
  const x = (target - b) / 2;
  return {
    prompt: `An welcher Stelle hat der Graph von f(x) = x²${term(b, "x", false)} + 1 die Steigung ${fmt(target)}? Gib auch den Punkt des Graphen an.`,
    given: [`f(x) = x²${term(b, "x", false)} + 1`, `Steigung ${fmt(target)}`],
    fields: [numberField("x =", x, "", 2), numberField("y =", x * x + b * x + 1, "", 2)],
    steps: [`f′(x) = 2x${plus(b)}`, `2x${plus(b)} = ${fmt(target)} ⇔ x = ${fmt(x)}`, `<strong>P(${fmt(x)} | ${fmt(x * x + b * x + 1)})</strong>`],
  };
}

const ableitungsregeln: Lesson = {
  id: "df-5-ableitungsregeln",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Ableitungsregeln",
  subtitle: "Potenz-, Faktor- und Summenregel",
  lehrplan: `${LEHRPLAN}, ganzrationale Funktionen ableiten mit Faktor- und Summenregel`,
  whyItMatters:
    "Mit der h-Methode jede Ableitung neu zu berechnen, wäre mühsam. Drei Regeln genügen, um jede ganzrationale Funktion in einer Zeile abzuleiten. Sie sind das wichtigste Werkzeug der ganzen Differentialrechnung.",
  explanationHtml: `
    <p>Für ganzrationale Funktionen genügen drei Regeln:</p>
    <ul>
      <li><strong>Potenzregel:</strong> (xⁿ)′ = n · xⁿ⁻¹ für n ∈ ℕ, also (x³)′ = 3x², (x²)′ = 2x, (x)′ = 1. Die Ableitung einer Konstanten ist 0.</li>
      <li><strong>Faktorregel:</strong> (a · f(x))′ = a · f′(x). Ein konstanter Faktor bleibt stehen.</li>
      <li><strong>Summenregel:</strong> (f(x) + g(x))′ = f′(x) + g′(x). Man leitet Summand für Summand ab.</li>
    </ul>
    <p>Die Potenzregel für x² und x³ hast du mit der h-Methode schon gesehen: (x + h)² − x² = 2xh + h² führt auf 2x. Liegt ein Term als Produkt oder mit Klammern vor, multiplizierst du ihn zuerst aus.</p>
    <p>Eine additive Konstante verschiebt den Graphen nur nach oben oder unten; die Steigungen ändern sich nicht. Deshalb fällt sie beim Ableiten weg.</p>
    <div class="example">f(x) = 2x³ − 5x² + 4x − 7: f′(x) = 2 · 3x² − 5 · 2x + 4 = 6x² − 10x + 4. Steigung bei x = 1: f′(1) = 6 − 10 + 4 = 0, dort ist die Tangente waagrecht.<br>g(x) = x(x − 2)² = x³ − 4x² + 4x, also g′(x) = 3x² − 8x + 4.</div>
    <div class="merke"><strong>Merke:</strong> (xⁿ)′ = n · xⁿ⁻¹, (a · f)′ = a · f′, (f + g)′ = f′ + g′, Konstanten fallen weg. Produkte und Klammern zuerst ausmultiplizieren.</div>
  `,
  formulas: [
    { name: "Potenzregel", html: "(xⁿ)′ = n · xⁿ⁻¹", quantities: "n ∈ ℕ; (c)′ = 0 für eine Konstante c" },
    { name: "Faktorregel", html: "(a · f(x))′ = a · f′(x)", quantities: "a konstanter Faktor" },
    { name: "Summenregel", html: "(f(x) + g(x))′ = f′(x) + g′(x)", quantities: "summandenweise ableiten" },
  ],
  quiz: {
    question: "Wie lautet die Ableitung von f(x) = 4x³ − x + 9?",
    options: ["f′(x) = 12x² − 1", "f′(x) = 12x² − 1 + 9", "f′(x) = 4x² − 1"],
    correctIndex: 0,
    explanation: "Potenz- und Faktorregel: (4x³)′ = 4 · 3x² = 12x², (−x)′ = −1, die Konstante 9 fällt weg.",
  },
  lab: {
    kind: "derivative-rules",
    title: "Labor: f und f′ nebeneinander",
    intro: "Stelle die Koeffizienten von f(x) = ax³ + bx² + cx + d ein. Violett erscheint f′; der Punkt auf f′ zeigt die Tangentensteigung im Punkt P.",
    params: [
      { type: "range", key: "a", label: "a (vor x³)", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b (vor x²)", unit: "", min: -3, max: 3, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "c", label: "c (vor x)", unit: "", min: -4, max: 4, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "d", label: "d (Konstante)", unit: "", min: -3, max: 3, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -3, max: 3, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "d", label: "f′(x)", emphasis: true, compute: (v) => `f′(x) = ${polyText(polyDerivative(rulesPoly(v)))}` },
      { key: "slope", label: "Steigung in P", compute: (v) => polyAt(polyDerivative(rulesPoly(v)), v.x0), digits: 3 },
    ],
    goals: [
      { id: "konstant", text: "Erzeuge eine Funktion, deren Ableitung konstant 2 ist.", check: (v) => v.a === 0 && v.b === 0 && v.c === 2 },
      { id: "parabel", text: "Erzeuge eine Funktion mit f′(x) = 3x² − 3.", check: (v) => v.a === 1 && v.b === 0 && v.c === -3 },
      { id: "verschoben", text: "Erzeuge eine Funktion mit f′(x) = 6x, deren Graph durch (0 | 2) geht.", check: (v) => v.a === 0 && v.b === 3 && v.c === 0 && v.d === 2 },
    ],
  },
  exercises: [
    { id: "ableiten", make: ableiten },
    { id: "ableitungswert", make: ableitungswert },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du leitest ganzrationale Funktionen mit Potenz-, Faktor- und Summenregel ab.",
};

// 4.6 Lokale Änderungsrate ─────────────────────────────────────────────────

function momentanrate(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.5, 1, 2, 4]);
    const b = rng.pick([0, 2, 3, 5]);
    const t0 = rng.int(1, 6);
    const v = 2 * a * t0 + b;
    return {
      prompt: `Ein Wagen fährt mit s(t) = ${quad(a, b, 0)} (t in s, s in m). Berechne seine Momentangeschwindigkeit zum Zeitpunkt t = ${t0} s.`,
      given: [`s(t) = ${quad(a, b, 0)}`],
      formulaHint: "Momentangeschwindigkeit v(t₀) = s′(t₀)",
      fields: [numberField(`v(${t0}) =`, v, "m/s", 2, { slips: [{ value: (a * t0 * t0 + b * t0) / t0, hint: "Das ist die Durchschnittsgeschwindigkeit seit dem Start. Gesucht ist s′(t₀)." }] })],
      steps: [`s′(t) = ${linear(2 * a, b)}`, `<strong>v(${t0}) = ${fmt(v)} m/s</strong>`],
    };
  }
  // Plant height h(t) = −0,1t³ + 1,5t² (cm, t in days).
  const t0 = rng.pick([2, 3, 4, 6]);
  const h = (t: number) => -0.1 * t ** 3 + 1.5 * t * t;
  const rate = -0.3 * t0 * t0 + 3 * t0;
  return {
    prompt: `Die Höhe einer Pflanze wird in den ersten 10 Tagen durch h(t) = −0,1t³ + 1,5t² beschrieben (t in Tagen, h in cm). Wie schnell wächst sie genau nach ${t0} Tagen, und wie schnell ist sie in den ersten ${t0} Tagen im Mittel gewachsen?`,
    given: ["h(t) = −0,1t³ + 1,5t²", "0 ≤ t ≤ 10"],
    fields: [numberField(`h′(${t0}) =`, rate, "cm/Tag", 2), numberField("mittlere Rate:", h(t0) / t0, "cm/Tag", 2, { slips: [{ value: rate, hint: "Die mittlere Rate ist der Differenzenquotient (h(t₀) − h(0)) : t₀." }] })],
    steps: [`h′(t) = −0,3t² + 3t, h′(${t0}) = ${fmt(rate)}`, `(h(${t0}) − h(0)) : ${t0} = ${fmt(h(t0))} : ${t0} = ${fmt(h(t0) / t0)}`, `<strong>lokal ${fmt(rate)} cm/Tag; im Mittel ${fmt(h(t0) / t0)} cm/Tag</strong>`],
  };
}

function wasserstand(rng: Rng, level: 1 | 2): ExerciseTask {
  const a = rng.pick([0.5, 1]);
  const b = rng.pick([4, 6, 8]);
  const c = rng.pick([10, 20, 50]);
  // W(t) = −a t² + b t + c (cm, t in h); W′(t) = −2a t + b.
  if (level === 1) {
    const t0 = rng.int(1, 9);
    const rate = -2 * a * t0 + b;
    return {
      prompt: `Der Wasserstand eines Flusses wird durch W(t) = ${quad(-a, b, c)} beschrieben (t in Stunden, W in cm). Mit welcher Rate ändert er sich nach ${t0} Stunden? Steigt oder fällt der Wasserstand dann?`,
      given: [`W(t) = ${quad(-a, b, c)}`],
      formulaHint: "Lokale Änderungsrate W′(t₀); positiv: steigt, negativ: fällt",
      fields: [numberField(`W′(${t0}) =`, rate, "cm/h", 2), choiceField("Der Wasserstand", ["steigt", "fällt", "bleibt kurz gleich"], rate > 0 ? 0 : rate < 0 ? 1 : 2)],
      steps: [`W′(t) = ${linear(-2 * a, b)}`, `W′(${t0}) = ${fmt(rate)}`, `<strong>${fmt(rate)} cm/h; ${rate > 0 ? "steigt" : rate < 0 ? "fällt" : "bleibt kurz gleich"}</strong>`],
    };
  }
  const r = rng.pick([2, 4]);
  const t = (b + r) / (2 * a);
  return {
    prompt: `Der Wasserstand eines Flusses wird durch W(t) = ${quad(-a, b, c)} beschrieben (t in Stunden, W in cm). Zu welchem Zeitpunkt fällt der Wasserstand mit ${r} cm pro Stunde? Wie hoch steht das Wasser dann?`,
    given: [`W(t) = ${quad(-a, b, c)}`],
    fields: [numberField("t =", t, "h", 2, { slips: [{ value: (b - r) / (2 * a), hint: "Fallen heißt W′(t) = −" + r + ", nicht +" + r + "." }] }), numberField("W(t) =", -a * t * t + b * t + c, "cm", 2)],
    steps: [`W′(t) = ${linear(-2 * a, b)} = −${r}`, `t = ${fmt(t)}`, `<strong>nach ${fmt(t)} h; W = ${fmt(-a * t * t + b * t + c)} cm</strong>`],
  };
}

const aenderungsrate: Lesson = {
  id: "df-6-aenderungsrate",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "4.6 Lokale Änderungsrate im Sachkontext",
  subtitle: "Momentangeschwindigkeit, Steigung einer Straße, Wachstum",
  lehrplan: `${LEHRPLAN}, Werte der Ableitungsfunktion als lokale Änderungsraten im Sachkontext`,
  whyItMatters:
    "Die Ableitung beantwortet die Frage „Wie schnell ändert sich das gerade?“. Ob Geschwindigkeit, Wachstum, Zufluss oder Steigung: Der Wert f′(x₀) mit der richtigen Einheit beschreibt den Zustand in genau diesem Moment.",
  explanationHtml: `
    <p>Der Wert f′(x₀) heißt <strong>lokale</strong> oder <strong>momentane Änderungsrate</strong> von f an der Stelle x₀. Er gibt an, wie stark sich f(x) bei x₀ ändert, bezogen auf eine Einheit von x. Seine Einheit ist „Einheit von f pro Einheit von x“.</p>
    <ul>
      <li>Weg s(t) in m, Zeit in s: s′(t₀) ist die <strong>Momentangeschwindigkeit</strong> in m/s.</li>
      <li>Höhenprofil h(x), beide in derselben Einheit: h′(x₀) ist die <strong>lokale Steigung</strong> der Straße; mal 100 in Prozent.</li>
      <li>Wachstum N(t): N′(t₀) gibt an, wie schnell N gerade zunimmt (z. B. cm pro Tag).</li>
    </ul>
    <p>Unterscheide: Die <strong>mittlere</strong> Änderungsrate (Differenzenquotient) gilt für ein Intervall, die <strong>lokale</strong> (Ableitung) für einen Zeitpunkt. Ein positives Vorzeichen heißt Zunahme, ein negatives Abnahme.</p>
    <div class="example">Freier Fall s(t) = 5t² (s in m, t in s): s′(t) = 10t, nach 2 s ist v = 20 m/s. Die Durchschnittsgeschwindigkeit in den ersten 2 s ist nur s(2) : 2 = 10 m/s.<br>Straße h(x) = 60x² − 8x³ (x in km, h in m): h′(1) = 120 − 24 = 96 m pro km, also 9,6 % Steigung.</div>
    <div class="merke"><strong>Merke:</strong> f′(x₀) ist die lokale Änderungsrate von f bei x₀, mit der Einheit „Einheit von f pro Einheit von x“. Sie unterscheidet sich im Allgemeinen von der mittleren Änderungsrate eines Intervalls.</div>
  `,
  formulas: [
    { name: "Momentangeschwindigkeit", html: "v(t₀) = s′(t₀)", quantities: "s(t) Weg-Zeit-Funktion" },
    { name: "Lokale Steigung", html: "Steigung in % = 100 · h′(x₀)", quantities: "h und x in derselben Längeneinheit" },
  ],
  quiz: {
    question: "Ein Becken wird gefüllt, V(t) ist das Wasservolumen in Litern nach t Minuten. Was bedeutet V′(5) = 12?",
    options: ["Nach 5 Minuten fließen gerade 12 Liter pro Minute zu.", "Nach 5 Minuten sind 12 Liter im Becken.", "In den ersten 5 Minuten flossen im Mittel 12 Liter pro Minute zu."],
    correctIndex: 0,
    explanation: "V′(5) ist die lokale Änderungsrate zum Zeitpunkt 5 min, mit der Einheit l/min. Das Volumen selbst ist V(5), der Mittelwert ist der Differenzenquotient.",
  },
  lab: {
    kind: "local-rate",
    title: "Labor: Tacho und Steigungsmesser",
    intro: "Ziehe den Punkt entlang des Graphen. Die violette Tangente zeigt die lokale Änderungsrate: beim Fall die Geschwindigkeit, bei der Passstraße die Steigung in Prozent.",
    params: [
      { type: "choice", key: "fn", label: "Situation", value: 0, options: RATE_FUNCTIONS.map((f, i) => ({ value: i, label: f.name })) },
      { type: "range", key: "x0", label: "Zeitpunkt t bzw. Ort x", unit: "", min: 0, max: 5, step: 0.25, value: 1, digits: 2 },
    ],
    readouts: [
      { key: "rate", label: "lokale Änderungsrate", emphasis: true, compute: (v) => RATE_FUNCTIONS[v.fn].rate(v.x0) },
      { key: "value", label: "Funktionswert", compute: (v) => `${fmt(RATE_FUNCTIONS[v.fn].f(v.x0), 1)} m` },
    ],
    goals: [
      { id: "zwanzig", text: "Freier Fall: Finde den Zeitpunkt, an dem der Stein 20 m/s schnell ist.", check: (v) => v.fn === 0 && Math.abs(RATE_FUNCTIONS[0].d(v.x0) - 20) < 1e-9 },
      { id: "steil", text: "Passstraße: Finde eine Stelle mit mehr als 12 % Steigung.", check: (v) => v.fn === 1 && RATE_FUNCTIONS[1].d(v.x0) > 12 },
      { id: "steilste", text: "Passstraße: Finde die steilste Stelle der Straße.", check: (v) => v.fn === 1 && v.x0 === 2.5 },
    ],
  },
  exercises: [
    { id: "momentanrate", make: momentanrate },
    { id: "wasserstand", make: wasserstand },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du deutest Ableitungswerte als lokale Änderungsraten mit der passenden Einheit.",
};

// 4.7 Tangente und Steigungswinkel ─────────────────────────────────────────

function tangente(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.5, 1, -1, 2, -0.5]);
    const b = rng.int(-3, 3);
    const c = rng.int(-4, 4);
    const x0 = nonZero(rng, 3);
    const m = 2 * a * x0 + b;
    const y0 = a * x0 * x0 + b * x0 + c;
    const t = y0 - m * x0;
    return {
      prompt: `Stelle die Gleichung der Tangente an den Graphen von f(x) = ${quad(a, b, c)} im Punkt mit der x-Koordinate ${fmt(x0)} auf: t: y = mx + t.`,
      given: [`f(x) = ${quad(a, b, c)}`, `x₀ = ${fmt(x0)}`],
      formulaHint: "m = f′(x₀); Punkt P(x₀ | f(x₀)) einsetzen: t = f(x₀) − m · x₀",
      fields: [numberField("m =", m, "", 2), numberField("t =", t, "", 2, { slips: [{ value: y0, hint: "f(x₀) ist der y-Wert von P, nicht der y-Achsenabschnitt der Tangente." }] })],
      steps: [`f′(x) = ${linear(2 * a, b)}, m = f′(${fmt(x0)}) = ${fmt(m)}`, `f(${fmt(x0)}) = ${fmt(y0)}; t = ${fmt(y0)} − ${paren(m)} · ${paren(x0)} = ${fmt(t)}`, `<strong>t: y = ${linear(m, t)}</strong>`],
    };
  }
  const x0 = rng.pick([1, 2, -1]);
  const p = [1, 0, rng.pick([-3, -2, 1]), rng.int(-2, 3)];
  const d = polyDerivative(p);
  const m = polyAt(d, x0);
  const y0 = polyAt(p, x0);
  const t = y0 - m * x0;
  const zero = m === 0 ? Number.NaN : -t / m;
  const fields = [numberField("m =", m, "", 2), numberField("t =", t, "", 2)];
  if (Number.isFinite(zero)) fields.push(numberField("Schnitt mit der x-Achse x =", zero, "", 2));
  return {
    prompt: `Die Tangente an den Graphen von f(x) = ${polyText(p)} im Punkt P(${fmt(x0)} | ${fmt(y0)}) wird als Rampe benutzt. Gib ihre Gleichung an${Number.isFinite(zero) ? " und berechne, wo sie die x-Achse schneidet" : ""}.`,
    given: [`f(x) = ${polyText(p)}`],
    fields,
    steps: [`f′(x) = ${polyText(d)}, m = ${fmt(m)}`, `t = ${fmt(y0)} − ${paren(m)} · ${paren(x0)} = ${fmt(t)}`, Number.isFinite(zero) ? `${linear(m, t)} = 0 ⇔ x = ${fmt(zero)}` : "Die Tangente ist waagrecht.", `<strong>y = ${linear(m, t)}${Number.isFinite(zero) ? `; x = ${fmt(zero)}` : ""}</strong>`],
  };
}

function winkel(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([0.5, 1, 0.25]);
    const x0 = nonZero(rng, 4);
    const m = 2 * a * x0;
    const alpha = atanD(m);
    return {
      prompt: `Unter welchem Winkel α steigt bzw. fällt der Graph von f(x) = ${quad(a, 0, 0)} an der Stelle ${fmt(x0)} gegenüber der x-Achse? (Negatives α: Der Graph fällt.)`,
      given: [`f(x) = ${quad(a, 0, 0)}`],
      formulaHint: "tan α = f′(x₀); α = tan⁻¹(f′(x₀)), Taschenrechner auf DEG",
      fields: [numberField("α ≈", alpha, "°", 1, { slips: [{ value: Math.atan(m), hint: RAD_HINT }] })],
      steps: [`f′(${fmt(x0)}) = ${fmt(m)}`, `α = tan⁻¹(${fmt(m)}) ${rel(alpha, 1)} ${fmt(alpha, 1)}°`, `<strong>α ≈ ${fmt(alpha, 1)}°</strong>`],
    };
  }
  const alpha = rng.pick([30, 45, 60, 20]);
  const a = rng.pick([0.5, 1]);
  const x0 = tanD(alpha) / (2 * a);
  return {
    prompt: `An welcher Stelle hat der Graph von f(x) = ${quad(a, 0, 0)} den Steigungswinkel ${alpha}°? Gib die Koordinaten des Punktes an.`,
    given: [`f(x) = ${quad(a, 0, 0)}`, `α = ${alpha}°`],
    fields: [numberField("x ≈", x0, "", 3), numberField("y ≈", a * x0 * x0, "", 3)],
    steps: [`tan ${alpha}° ${rel(tanD(alpha), 4)} ${fmt(tanD(alpha), 4)} = f′(x) = ${fmt(2 * a)}x`, `x = ${fmt(tanD(alpha), 4)} : ${fmt(2 * a)} ≈ ${fmt(x0, 3)}`, `<strong>P(${fmt(x0, 3)} | ${fmt(a * x0 * x0, 3)})</strong>`],
  };
}

const tangenteLesson: Lesson = {
  id: "df-7-tangente",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "4.7 Tangentengleichung und Steigungswinkel",
  subtitle: "t: y = f′(x₀)(x − x₀) + f(x₀) und tan α = f′(x₀)",
  lehrplan: `${LEHRPLAN}, Tangentengleichung und Steigungswinkel der Tangente`,
  whyItMatters:
    "Eine Tangente beschreibt einen Graphen in der Nähe eines Punktes so gut wie eine Gerade kann: Wo eine Kugel von einer Bahn abfliegt, wie steil eine Rampe am Übergang sein muss, wie ein Fahrzeug aus einer Kurve weiterfährt.",
  explanationHtml: `
    <p>Die <strong>Tangente</strong> an den Graphen von f im Punkt P(x₀ | f(x₀)) ist die Gerade durch P mit der Steigung f′(x₀):</p>
    <p class="formula-line">t: y = f′(x₀) · (x − x₀) + f(x₀)</p>
    <p>Alternativ setzt du y = mx + t mit m = f′(x₀) an und bestimmst t durch Einsetzen von P. Der <strong>Steigungswinkel</strong> α der Tangente gegenüber der x-Achse erfüllt (Wiederholung aus M9/M10)</p>
    <p class="formula-line">tan α = f′(x₀), also α = tan⁻¹(f′(x₀)).</p>
    <p>Bei negativer Steigung ist α negativ (der Graph fällt); der Winkel zwischen Tangente und x-Achse ist dann |α|. Rechne im Gradmaß: Taschenrechner auf DEG.</p>
    <div class="example">f(x) = 0,5x² + 2, x₀ = 2: f′(x) = x, also m = 2, und f(2) = 4. t: y = 2(x − 2) + 4 = 2x. Diese Tangente geht durch den Ursprung. Steigungswinkel: α = tan⁻¹(2) ≈ 63,4°.</div>
    <div class="merke"><strong>Merke:</strong> Tangente in P(x₀ | f(x₀)): y = f′(x₀)(x − x₀) + f(x₀). Steigungswinkel: tan α = f′(x₀).</div>
  `,
  formulas: [
    { name: "Tangentengleichung", html: "t: y = f′(x₀) · (x − x₀) + f(x₀)", quantities: "P(x₀ | f(x₀)) Berührpunkt" },
    { name: "Steigungswinkel", html: "tan α = f′(x₀)", quantities: "α Winkel zwischen Tangente und x-Achse, im Gradmaß" },
  ],
  quiz: {
    question: "Welche Steigung hat eine Tangente mit dem Steigungswinkel 45°?",
    options: ["1", "45", "0,5"],
    correctIndex: 0,
    explanation: "tan 45° = 1: Bei 45° steigt die Tangente um 1, wenn x um 1 zunimmt.",
  },
  lab: {
    kind: "tangent-line",
    title: "Labor: Tangente anlegen",
    intro: "Ziehe den Berührpunkt P über die Parabel f(x) = 0,5x² + 2. Die violette Tangente und ihr Steigungswinkel α folgen.",
    params: [{ type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -4, max: 4, step: 0.25, value: -3, digits: 2 }],
    readouts: [
      { key: "eq", label: "Tangente", emphasis: true, compute: (v) => { const { m, t } = tangentAt(v.x0); return `y = ${linear(m, t)}`; } },
      { key: "m", label: "Steigung f′(x₀)", compute: (v) => tangentAt(v.x0).m, digits: 2 },
      { key: "alpha", label: "Steigungswinkel α", compute: (v) => `${fmt(slopeAngle(tangentAt(v.x0).m), 1)}°` },
      { key: "P", label: "Berührpunkt", compute: (v) => `P(${fmt(v.x0)} | ${fmt(tangentF(v.x0))})` },
    ],
    goals: [
      { id: "45-grad", text: "Lege die Tangente so, dass ihr Steigungswinkel 45° beträgt.", check: (v) => Math.abs(slopeAngle(tangentAt(v.x0).m) - 45) < 1e-9 },
      { id: "ursprung", text: "Lege eine Tangente, die durch den Ursprung geht.", check: (v) => Math.abs(tangentAt(v.x0).t) < 1e-9 },
      { id: "waagrecht", text: "Lege eine waagrechte Tangente.", check: (v) => Math.abs(tangentAt(v.x0).m) < 1e-9 },
    ],
  },
  exercises: [
    { id: "tangente", make: tangente },
    { id: "winkel", make: winkel },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du stellst Tangentengleichungen auf und berechnest Steigungswinkel.",
};

export const STAGE_DIFFERENZIEREN: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Lokales und globales Differenzieren",
  subtitle: "Änderungsraten, Ableitung, Ableitungsregeln und Tangenten",
  icon: "📐",
  accent: "#7c3aed",
  badgeTitle: "Tangenten-Profi",
  lehrplanLabel: "M11 LB 4.1 · ca. 19 Std.",
  lessons: [differenzenquotientLesson, differentialquotient, differenzierbarkeit, ableitungsfunktion, ableitungsregeln, aenderungsrate, tangenteLesson],
};
