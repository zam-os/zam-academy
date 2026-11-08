import { fmt, paren, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { polyAt, polyDerivative, polyText, rel } from "../lab/shared";
import {
  condPoly,
  criticalKind,
  cubicFacts,
  cubicPoly,
  curvatureText,
  curveD,
  curveD2,
  curveF,
  EXTREMA_FUNCTIONS,
  MONO_FUNCTIONS,
  NEWTON_ROOTS,
  newtonD,
  newtonF,
  newtonIterates,
  pointAt0,
  subscript,
} from "../lab/views-kurvenuntersuchung";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, yesNo } from "./helpers";

const STAGE_ID = "stage-5-kurvenuntersuchung";
const LEHRPLAN = "M11 LB 4.2: Anwendung der Differentialrechnung bei der Untersuchung ganzrationaler Funktionen";

function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

function plus(value: number, digits = 2): string {
  return term(value, "", false, digits);
}

/** Two different integers p < q from the list. */
function pair(rng: Rng, values: number[]): [number, number] {
  const [a, b] = rng.shuffle(values).slice(0, 2);
  return a < b ? [a, b] : [b, a];
}

/**
 * The cubic f(x) = x³ − 1,5(p + q)x² + 3pq·x + c, whose derivative is
 * 3(x − p)(x − q): a Hochpunkt at p and a Tiefpunkt at q (p < q).
 */
function cubicWith(p: number, q: number, c: number): number[] {
  return [1, -1.5 * (p + q), 3 * p * q, c];
}

// 5.1 Monotonie ──────────────────────────────────────────────────────────────

function intervalle(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p, q] = pair(rng, [-3, -2, -1, 0, 1, 2, 3]);
    const c = rng.int(-3, 3);
    const poly = cubicWith(p, q, c);
    return {
      prompt: `Bestimme die Intervalle, in denen <strong>f(x) = ${polyText(poly)}</strong> streng monoton steigt oder fällt.`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "f′(x) &gt; 0 in einem Intervall ⇒ f ist dort streng monoton steigend; f′(x) &lt; 0 ⇒ streng monoton fallend.",
      fields: [numberField("f fällt von x =", p, "", 2), numberField("bis x =", q, "", 2), choiceField("für x &gt; " + fmt(q) + " ist f", ["streng monoton steigend", "streng monoton fallend"], 0)],
      steps: [`f′(x) = ${polyText(polyDerivative(poly))} = 3${factorText(p, q)}`, `f′ &lt; 0 zwischen den Nullstellen ${fmt(p)} und ${fmt(q)}, sonst f′ &gt; 0.`, `<strong>f fällt auf [${fmt(p)}; ${fmt(q)}], steigt auf ]−∞; ${fmt(p)}] und [${fmt(q)}; +∞[</strong>`],
    };
  }
  const [p, q] = pair(rng, [1, 2, 3, 4, 5]);
  // Water level W(t) = −(t³ − 1,5(p + q)t² + 3pq·t) + 50: rises between p and q.
  const poly = cubicWith(p, q, 0).map((k) => -k);
  poly[3] = 100;
  return {
    prompt: `Der Wasserstand in einem Rückhaltebecken wird für 0 ≤ t ≤ 6 durch W(t) = ${polyText(poly)} beschrieben (t in Tagen, W in cm). In welchem Zeitraum steigt der Wasserstand?`,
    given: [`W(t) = ${polyText(poly)}`, "0 ≤ t ≤ 6"],
    fields: [numberField("steigt ab t =", p, "Tagen", 2), numberField("bis t =", q, "Tagen", 2)],
    steps: [`W′(t) = ${polyText(polyDerivative(poly))} = −3${factorText(p, q, "t")}`, `W′(t) &gt; 0 genau zwischen ${p} und ${q}.`, `<strong>vom ${p}. bis zum ${q}. Tag</strong>`],
  };
}

/** "(x − 1)(x + 2)" for the roots p, q. */
function factorText(p: number, q: number, x = "x"): string {
  const f = (r: number) => (r === 0 ? x : `(${x} ${r > 0 ? "−" : "+"} ${Math.abs(r)})`);
  return `${f(p)}${f(q)}`;
}

function definition(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const k = rng.pick([1, 2, 3]);
    const [x1, x2] = pair(rng, [-3, -2, -1, 1, 2, 3]);
    const f = (x: number) => x ** 3 - 3 * k * k * x;
    const ok = f(x1) < f(x2);
    return {
      prompt: `Für f(x) = x³ − ${3 * k * k}x: Berechne f(${fmt(x1)}) und f(${fmt(x2)}). Ist für dieses Paar die Bedingung der strengen Monotonie „aus x₁ &lt; x₂ folgt f(x₁) &lt; f(x₂)“ erfüllt?`,
      given: [`f(x) = x³ − ${3 * k * k}x`, `x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}`],
      formulaHint: "Streng monoton steigend auf I: Für alle x₁ &lt; x₂ aus I gilt f(x₁) &lt; f(x₂).",
      fields: [numberField(`f(${fmt(x1)}) =`, f(x1), "", 2), numberField(`f(${fmt(x2)}) =`, f(x2), "", 2), yesNo("f(x₁) &lt; f(x₂)?", ok)],
      steps: [`f(${fmt(x1)}) = ${fmt(f(x1))}, f(${fmt(x2)}) = ${fmt(f(x2))}`, `<strong>${ok ? "ja" : "nein"}: ${fmt(f(x1))} ${ok ? "&lt;" : "≥"} ${fmt(f(x2))}</strong>`],
    };
  }
  const c = rng.pick([1, 2, 3, 0.5]);
  return {
    prompt: `Begründe, dass f(x) = x³ + ${fmt(c)}x auf ganz ℝ streng monoton steigt. Gib dazu den kleinsten Wert von f′ an und wähle die passende Begründung.`,
    given: [`f(x) = x³ + ${fmt(c)}x`],
    fields: [
      numberField("kleinster Wert von f′:", c, "", 2),
      choiceField("Begründung", ["f′(x) = 3x² + " + fmt(c) + " ist für alle x positiv.", "f(0) = 0 und f(1) > 0.", "Der Graph ist punktsymmetrisch zum Ursprung."], 0),
    ],
    steps: [`f′(x) = 3x² + ${fmt(c)} ≥ ${fmt(c)} &gt; 0, kleinster Wert bei x = 0.`, "Zwei Funktionswerte oder die Symmetrie allein beweisen keine Monotonie.", `<strong>kleinster Wert ${fmt(c)}; f′ ist überall positiv</strong>`],
  };
}

const monotonie: Lesson = {
  id: "ku-1-monotonie",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "5.1 Monotonie",
  subtitle: "Strenge Monotonie und das Vorzeichen von f′",
  lehrplan: `${LEHRPLAN}, Definition der strengen Monotonie und Monotoniekriterium`,
  whyItMatters:
    "Wann steigt ein Wasserstand, wann fällt ein Kurs? Monotonie beschreibt, in welchen Abschnitten eine Größe zu- oder abnimmt. Mit der Ableitung prüfst du das für unendlich viele Stellen auf einmal.",
  explanationHtml: `
    <p>Eine Funktion f heißt in einem Intervall I <strong>streng monoton steigend</strong>, wenn für alle x₁, x₂ ∈ I gilt:</p>
    <p class="formula-line">x₁ &lt; x₂ ⇒ f(x₁) &lt; f(x₂)</p>
    <p>und <strong>streng monoton fallend</strong>, wenn aus x₁ &lt; x₂ stets f(x₁) &gt; f(x₂) folgt. Anschaulich: Weiter rechts liegt der Graph immer höher (bzw. tiefer). Ein einzelnes Paar von Stellen beweist das nicht; die Bedingung muss für alle Paare gelten.</p>
    <p><strong>Monotoniekriterium:</strong> Ist f′(x) &gt; 0 für alle x im Inneren eines Intervalls, so ist f dort streng monoton steigend; ist f′(x) &lt; 0, so ist f streng monoton fallend. Die Umkehrung gilt nicht ganz: f(x) = x³ ist auf ℝ streng monoton steigend, obwohl f′(0) = 0 ist. Aus x₁ &lt; x₂ folgt nämlich x₁³ &lt; x₂³; eine einzelne Stelle mit waagrechter Tangente stört nicht.</p>
    <p>Vorgehen: f′ bilden, Nullstellen von f′ bestimmen, Vorzeichen von f′ zwischen den Nullstellen prüfen.</p>
    <div class="example">f(x) = x³ − 3x: f′(x) = 3x² − 3 = 3(x + 1)(x − 1). f′ &gt; 0 für x &lt; −1 und x &gt; 1, f′ &lt; 0 für −1 &lt; x &lt; 1. Also steigt f streng monoton auf ]−∞; −1] und [1; +∞[ und fällt streng monoton auf [−1; 1].</div>
    <div class="merke"><strong>Merke:</strong> Streng monoton steigend: x₁ &lt; x₂ ⇒ f(x₁) &lt; f(x₂). Hinreichend dafür: f′(x) &gt; 0 im Intervall (einzelne Nullstellen von f′ wie bei x³ stören nicht).</div>
  `,
  formulas: [
    { name: "Strenge Monotonie", html: "x₁ &lt; x₂ ⇒ f(x₁) &lt; f(x₂) (steigend) bzw. f(x₁) &gt; f(x₂) (fallend)", quantities: "für alle x₁, x₂ aus dem Intervall" },
    { name: "Monotoniekriterium", html: "f′(x) &gt; 0 ⇒ f streng monoton steigend; f′(x) &lt; 0 ⇒ streng monoton fallend", quantities: "im Inneren eines Intervalls" },
  ],
  quiz: {
    question: "Warum ist f(x) = x³ auf ganz ℝ streng monoton steigend, obwohl f′(0) = 0 ist?",
    options: [
      "Weil aus x₁ < x₂ immer x₁³ < x₂³ folgt; eine einzelne Nullstelle von f′ ändert daran nichts.",
      "Weil f′(0) = 0 bedeutet, dass f bei 0 besonders stark steigt.",
      "Ist sie nicht: Bei x = 0 hat f einen Hochpunkt.",
    ],
    correctIndex: 0,
    explanation: "Die Definition vergleicht Funktionswerte, nicht Steigungen. f′ ist nur bei 0 null und sonst positiv, der Graph steigt also überall weiter an.",
  },
  lab: {
    kind: "monotony",
    title: "Labor: x₁ < x₂ und f(x₁) < f(x₂)?",
    intro: "Ziehe die Stellen x₁ und x₂. Das Band unten zeigt das Vorzeichen von f′: grün positiv, violett negativ.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: MONO_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "x1", label: "x₁", unit: "", min: -2.5, max: 2.5, step: 0.25, value: 1.5, digits: 2 },
      { type: "range", key: "x2", label: "x₂", unit: "", min: -2.5, max: 2.5, step: 0.25, value: 2, digits: 2 },
    ],
    readouts: [
      { key: "pair", label: "Vergleich", emphasis: true, compute: (v) => { const f = MONO_FUNCTIONS[v.fn].f; return v.x1 < v.x2 ? (f(v.x1) < f(v.x2) ? "f(x₁) < f(x₂): steigend" : "f(x₁) > f(x₂): fallend") : "x₁ muss links von x₂ liegen"; } },
      { key: "d", label: "f′(x)", compute: (v) => (v.fn === 0 ? "3x² − 3 = 3(x + 1)(x − 1)" : "3x²") },
      { key: "mono", label: "Monotonie", compute: (v) => (v.fn === 0 ? "steigt auf ]−∞; −1] und [1; +∞[, fällt auf [−1; 1]" : "steigt streng monoton auf ganz ℝ") },
    ],
    goals: [
      { id: "fallend", text: "f(x) = x³ − 3x: Finde zwei Stellen x₁ < x₂ mit f(x₁) > f(x₂).", check: (v) => v.fn === 0 && v.x1 < v.x2 && MONO_FUNCTIONS[0].f(v.x1) > MONO_FUNCTIONS[0].f(v.x2) },
      { id: "ueber-null", text: "f(x) = x³: Lege x₁ links und x₂ rechts von 0. Auch über die waagrechte Tangente hinweg gilt f(x₁) < f(x₂).", check: (v) => v.fn === 1 && v.x1 < 0 && v.x2 > 0 },
      { id: "intervall", text: "f(x) = x³ − 3x: Markiere mit x₁ und x₂ das größte Intervall, in dem f streng monoton fällt.", check: (v) => v.fn === 0 && v.x1 === -1 && v.x2 === 1 },
    ],
  },
  exercises: [
    { id: "intervalle", make: intervalle },
    { id: "definition", make: definition },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du begründest Monotonie mit der Definition und mit dem Vorzeichen von f′.",
};

// 5.2 Extremstellen ──────────────────────────────────────────────────────────

function extrema(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p, q] = pair(rng, [-3, -2, -1, 0, 1, 2, 3]);
    const c = rng.int(-4, 4);
    const poly = cubicWith(p, q, c);
    return {
      prompt: `Bestimme Art und Lage der Extrempunkte des Graphen von <strong>f(x) = ${polyText(poly)}</strong>.`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "f′(x) = 0 lösen, dann Vorzeichenwechsel von f′: + → − Hochpunkt, − → + Tiefpunkt",
      fields: [numberField("Hochpunkt x =", p, "", 2), numberField("y =", polyAt(poly, p), "", 2), numberField("Tiefpunkt x =", q, "", 2), numberField("y =", polyAt(poly, q), "", 2)],
      steps: [`f′(x) = ${polyText(polyDerivative(poly))} = 3${factorText(p, q)} = 0 ⇔ x = ${fmt(p)} oder x = ${fmt(q)}`, `Vorzeichen von f′: + vor ${fmt(p)}, − zwischen, + nach ${fmt(q)}.`, `<strong>H(${fmt(p)} | ${fmt(polyAt(poly, p))}), T(${fmt(q)} | ${fmt(polyAt(poly, q))})</strong>`],
    };
  }
  // Temperature T(t) = −0,1t³ + b·t² + 15: maximum at t = 20b/3.
  const tMax = rng.pick([6, 9, 12]);
  const b = (0.3 * tMax) / 2;
  const T = (t: number) => -0.1 * t ** 3 + b * t * t + 15;
  return {
    prompt: `An einem Sommertag wird die Temperatur zwischen 6 Uhr (t = 0) und 24 Uhr durch T(t) = −0,1t³ + ${fmt(b)}t² + 15 beschrieben (t in Stunden nach 6 Uhr, T in °C). Wann ist es am wärmsten, und wie warm ist es dann?`,
    given: [`T(t) = −0,1t³ + ${fmt(b)}t² + 15`, "0 ≤ t ≤ 18"],
    fields: [numberField("t =", tMax, "h", 2), numberField("T<sub>max</sub> =", T(tMax), "°C", 2)],
    steps: [`T′(t) = −0,3t² + ${fmt(2 * b)}t = −0,3t(t − ${tMax}) = 0 ⇔ t = 0 oder t = ${tMax}`, `Bei t = ${tMax} wechselt T′ von + nach −: Maximum. Randwerte: T(0) = 15, T(18) = ${fmt(T(18))}.`, `<strong>um ${6 + tMax} Uhr (t = ${tMax}), ${fmt(T(tMax))} °C</strong>`],
  };
}

function vzw(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p, q] = pair(rng, [-2, -1, 0, 1, 2, 3]);
    const terraceFirst = rng.next() < 0.5;
    const fac = (r: number) => (r === 0 ? "x" : `(x ${r > 0 ? "−" : "+"} ${Math.abs(r)})`);
    const sq = (r: number) => (r === 0 ? "x²" : `${fac(r)}²`);
    // (x − p)²(x − q): Terrassenpunkt at p, Tiefpunkt at q. (x − p)(x − q)²: Tiefpunkt at p, Terrassenpunkt at q.
    const text = terraceFirst ? `${sq(p)} · ${fac(q)}` : `${fac(p)} · ${sq(q)}`;
    const kindP = terraceFirst ? 2 : 1;
    const kindQ = terraceFirst ? 1 : 2;
    const options = ["Hochpunkt", "Tiefpunkt", "Terrassenpunkt"];
    return {
      prompt: `Die Ableitung einer Funktion f ist f′(x) = ${text}. Welche Art von Punkt hat der Graph von f an den Stellen ${fmt(p)} und ${fmt(q)}?`,
      given: [`f′(x) = ${text}`],
      formulaHint: "Ein Faktor zum Quadrat wechselt das Vorzeichen nicht: kein Vorzeichenwechsel ⇒ Terrassenpunkt.",
      fields: [choiceField(`bei x = ${fmt(p)}`, options, kindP), choiceField(`bei x = ${fmt(q)}`, options, kindQ)],
      steps: [
        terraceFirst
          ? `Bei ${fmt(p)}: Der Faktor ${sq(p)} wechselt das Vorzeichen nicht, kein Vorzeichenwechsel. Bei ${fmt(q)}: ${sq(p)} &gt; 0 und ${fac(q)} wechselt von − nach +.`
          : `Bei ${fmt(p)}: ${sq(q)} &gt; 0 und ${fac(p)} wechselt von − nach +. Bei ${fmt(q)}: Der Faktor ${sq(q)} wechselt das Vorzeichen nicht.`,
        `<strong>${fmt(p)}: ${options[kindP]}; ${fmt(q)}: ${options[kindQ]}</strong>`,
      ],
    };
  }
  const k = rng.pick([2, 3, 4]);
  // f(x) = x⁴ − (4k/3)x³: f′(x) = 4x²(x − k)
  const poly = [1, (-4 * k) / 3, 0, 0, 0];
  return {
    prompt: `Untersuche f(x) = x⁴ − ${fmt((4 * k) / 3, 3)}x³ auf Extrempunkte. Gib die x-Koordinate des Tiefpunkts an und entscheide, was bei x = 0 vorliegt.`,
    given: [`f(x) = x⁴ − ${fmt((4 * k) / 3, 3)}x³`],
    fields: [numberField("Tiefpunkt bei x =", k, "", 2), numberField("y =", polyAt(poly, k), "", 2), choiceField("bei x = 0", ["Hochpunkt", "Tiefpunkt", "Terrassenpunkt"], 2)],
    steps: [`f′(x) = 4x³ − ${fmt(4 * k)}x² = 4x²(x − ${k}) = 0 ⇔ x = 0 oder x = ${k}`, `Bei 0 wechselt f′ das Vorzeichen nicht (x² ≥ 0, x − ${k} &lt; 0): Terrassenpunkt. Bei ${k} von − nach +: Tiefpunkt.`, `<strong>T(${k} | ${fmt(polyAt(poly, k))}); bei 0 ein Terrassenpunkt</strong>`],
  };
}

const extremstellen: Lesson = {
  id: "ku-2-extremstellen",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "5.2 Extremstellen",
  subtitle: "Waagrechte Tangente und Vorzeichenwechsel von f′",
  lehrplan: `${LEHRPLAN}, Rückschlüsse aus der ersten Ableitung auf Extremstellen`,
  whyItMatters:
    "Wann ist es am wärmsten, wann ist ein Gewinn am größten? Extremstellen beantworten solche Fragen. Die erste Ableitung findet die Kandidaten, ihr Vorzeichenwechsel entscheidet, ob wirklich ein Hoch- oder Tiefpunkt vorliegt.",
  explanationHtml: `
    <p>Hat f an der Stelle x₀ einen <strong>Hochpunkt</strong> (lokales Maximum) oder <strong>Tiefpunkt</strong> (lokales Minimum) und ist f dort differenzierbar, so ist die Tangente waagrecht: <strong>f′(x₀) = 0</strong>. Die Nullstellen von f′ sind also die Kandidaten.</p>
    <p>Ob tatsächlich ein Extremum vorliegt, zeigt der <strong>Vorzeichenwechsel (VZW)</strong> von f′ an der Stelle x₀:</p>
    <ul>
      <li>f′ wechselt von + nach −: f steigt erst, dann fällt es: <strong>Hochpunkt</strong>.</li>
      <li>f′ wechselt von − nach +: <strong>Tiefpunkt</strong>.</li>
      <li>kein Vorzeichenwechsel: kein Extremum, sondern ein <strong>Terrassenpunkt</strong> (Sattelpunkt) mit waagrechter Tangente.</li>
    </ul>
    <p>Bei faktorisiertem f′ siehst du den VZW an den Faktoren: Ein einfacher Faktor (x − x₀) wechselt das Vorzeichen, ein quadratischer (x − x₀)² nicht. Bei Anwendungen in einem Intervall vergleichst du zusätzlich mit den Randwerten.</p>
    <div class="example">f(x) = 0,25x⁴ − (2/3)x³: f′(x) = x³ − 2x² = x²(x − 2). Nullstellen 0 und 2. Bei 0: x² ≥ 0 und x − 2 &lt; 0, also f′ ≤ 0 auf beiden Seiten, kein VZW: Terrassenpunkt (0 | 0). Bei 2 wechselt f′ von − nach +: Tiefpunkt T(2 | −4/3).</div>
    <div class="merke"><strong>Merke:</strong> Kandidaten: f′(x₀) = 0. Entscheidung: VZW von f′ von + nach − ⇒ Hochpunkt, von − nach + ⇒ Tiefpunkt, kein VZW ⇒ Terrassenpunkt.</div>
  `,
  formulas: [
    { name: "Kandidaten für Extremstellen", html: "f′(x₀) = 0", quantities: "Stellen mit waagrechter Tangente" },
    { name: "Vorzeichenwechsel-Kriterium", html: "f′: + → − ⇒ Hochpunkt; − → + ⇒ Tiefpunkt; kein VZW ⇒ Terrassenpunkt", quantities: "VZW von f′ an der Stelle x₀" },
  ],
  quiz: {
    question: "f′(x) = (x − 1)² · (x + 2). Was hat der Graph von f bei x = 1?",
    options: ["einen Terrassenpunkt, weil (x − 1)² das Vorzeichen nicht wechselt", "einen Hochpunkt, weil f′(1) = 0 ist", "einen Tiefpunkt, weil (x − 1)² ≥ 0 ist"],
    correctIndex: 0,
    explanation: "Nahe bei 1 ist x + 2 positiv und (x − 1)² ≥ 0: f′ ist links und rechts von 1 positiv. Ohne Vorzeichenwechsel gibt es kein Extremum, nur eine waagrechte Tangente.",
  },
  lab: {
    kind: "extrema-sign",
    title: "Labor: Vorzeichenwechsel finden",
    intro: "Ziehe den Punkt P über den Graphen. Die violette Tangente und das Band darunter zeigen das Vorzeichen von f′.",
    params: [
      { type: "choice", key: "fn", label: "Funktion", value: 0, options: EXTREMA_FUNCTIONS.map((f, i) => ({ value: i, label: `f(x) = ${f.term}` })) },
      { type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -2, max: 3, step: 0.25, value: 0, digits: 2 },
    ],
    readouts: [
      { key: "kind", label: "Punkt", emphasis: true, compute: (v) => criticalKind(v.fn, v.x0) },
      { key: "slope", label: "f′(x₀)", compute: (v) => EXTREMA_FUNCTIONS[v.fn].d(v.x0), digits: 3 },
      { key: "around", label: "f′ links / rechts", compute: (v) => { const d = EXTREMA_FUNCTIONS[v.fn].d; const s = (x: number) => (d(x) > 1e-12 ? "+" : d(x) < -1e-12 ? "−" : "0"); return `${s(v.x0 - 0.1)} / ${s(v.x0 + 0.1)}`; } },
    ],
    goals: [
      { id: "hochpunkt", text: "f(x) = x³ − 3x: Ziehe P auf den Hochpunkt.", check: (v) => v.fn === 0 && criticalKind(0, v.x0) === "Hochpunkt" },
      { id: "tiefpunkt", text: "f(x) = 0,25x⁴ − (2/3)x³: Ziehe P auf den Tiefpunkt.", check: (v) => v.fn === 1 && criticalKind(1, v.x0) === "Tiefpunkt" },
      { id: "terrasse", text: "f(x) = 0,25x⁴ − (2/3)x³: Finde die Stelle mit waagrechter Tangente ohne Vorzeichenwechsel.", check: (v) => v.fn === 1 && criticalKind(1, v.x0) === "Terrassenpunkt" },
    ],
  },
  exercises: [
    { id: "extrema", make: extrema },
    { id: "vzw", make: vzw },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest Extrempunkte mit f′ = 0 und entscheidest mit dem Vorzeichenwechsel.",
};

// 5.3 Krümmung und Wendestellen ──────────────────────────────────────────────

function wendestelle(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([1, -1, 2, 0.5]);
    const xw = nonZero(rng, 3);
    const c = rng.int(-4, 4);
    const d = rng.int(-5, 5);
    // f(x) = a(x³ − 3·xw·x²) + c·x + d has f″(x) = 6a(x − xw).
    const poly = [a, -3 * a * xw, c, d];
    return {
      prompt: `Bestimme den Wendepunkt des Graphen von <strong>f(x) = ${polyText(poly)}</strong>.`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "f″(x) = 0 lösen; bei ganzrationalen Funktionen dritten Grades wechselt f″ dort immer das Vorzeichen.",
      fields: [numberField("x<sub>W</sub> =", xw, "", 2), numberField("y<sub>W</sub> =", polyAt(poly, xw), "", 2)],
      steps: [`f′(x) = ${polyText(polyDerivative(poly))}, f″(x) = ${polyText(polyDerivative(polyDerivative(poly)))}`, `f″(x) = 0 ⇔ x = ${fmt(xw)}; f″ wechselt dort das Vorzeichen.`, `<strong>W(${fmt(xw)} | ${fmt(polyAt(poly, xw))})</strong>`],
    };
  }
  const k = rng.pick([6, 9, 12]);
  // N(t) = −t³ + k·t² (in Tausend): N′(t) = −3t² + 2kt, maximal at t = k/3.
  const t = k / 3;
  return {
    prompt: `Die Zahl der Nutzer einer neuen App wird in den ersten ${k} Wochen durch N(t) = −t³ + ${k}t² beschrieben (t in Wochen, N in Tausend). Zu welchem Zeitpunkt wächst die Nutzerzahl am stärksten, und wie groß ist die Wachstumsrate dann?`,
    given: [`N(t) = −t³ + ${k}t²`, `0 ≤ t ≤ ${k}`],
    fields: [numberField("t =", t, "Wochen", 2), numberField("N′(t) =", -3 * t * t + 2 * k * t, "Tausend pro Woche", 2, { slips: [{ value: -(t ** 3) + k * t * t, hint: "Das ist N(t), die Nutzerzahl. Gesucht ist die Wachstumsrate N′(t)." }] })],
    steps: [`N′(t) = −3t² + ${2 * k}t, N″(t) = −6t + ${2 * k}`, `N″(t) = 0 ⇔ t = ${fmt(t)}; N″ wechselt von + nach −: Wendestelle, dort ist N′ maximal.`, `<strong>nach ${fmt(t)} Wochen; ${fmt(-3 * t * t + 2 * k * t)} Tausend pro Woche</strong>`],
  };
}

function kruemmung(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const poly = [rng.pick([1, -1, 2]), nonZero(rng, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const d2 = polyDerivative(polyDerivative(poly));
    let x0 = rng.int(-3, 3);
    if (Math.abs(polyAt(d2, x0)) < 1e-9) x0 += 1;
    const value = polyAt(d2, x0);
    return {
      prompt: `Ist der Graph von f(x) = ${polyText(poly)} an der Stelle ${fmt(x0)} links- oder rechtsgekrümmt?`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "f″(x₀) &gt; 0: linksgekrümmt (f′ steigt); f″(x₀) &lt; 0: rechtsgekrümmt (f′ fällt)",
      fields: [numberField(`f″(${fmt(x0)}) =`, value, "", 2), choiceField("Krümmung", ["linksgekrümmt", "rechtsgekrümmt"], value > 0 ? 0 : 1)],
      steps: [`f″(x) = ${polyText(d2)}`, `f″(${fmt(x0)}) = ${fmt(value)}`, `<strong>${value > 0 ? "linksgekrümmt" : "rechtsgekrümmt"}</strong>`],
    };
  }
  const k = rng.pick([1, 2, 3]);
  // f(x) = x⁴ − 6k²x²: f″(x) = 12x² − 12k², turning points at ±k.
  const poly = [1, 0, -6 * k * k, 0, rng.int(0, 5)];
  return {
    prompt: `Bestimme die Wendestellen von f(x) = ${polyText(poly)}. Gib die positive an. Wie ist der Graph bei x = 0 gekrümmt?`,
    given: [`f(x) = ${polyText(poly)}`],
    fields: [numberField("positive Wendestelle x =", k, "", 2), choiceField("Krümmung bei 0", ["linksgekrümmt", "rechtsgekrümmt"], 1)],
    steps: [`f″(x) = 12x² − ${12 * k * k} = 12(x − ${k})(x + ${k})`, `Nullstellen ±${k} mit Vorzeichenwechsel; f″(0) = −${12 * k * k} &lt; 0.`, `<strong>x = ${k}; bei 0 rechtsgekrümmt</strong>`],
  };
}

const kruemmungLesson: Lesson = {
  id: "ku-3-kruemmung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "5.3 Krümmung und Wendestellen",
  subtitle: "Die zweite Ableitung und die Stelle größten Wachstums",
  lehrplan: `${LEHRPLAN}, Krümmungsverhalten mit der zweiten Ableitung, Wendestellen`,
  whyItMatters:
    "Eine Größe kann wachsen und trotzdem immer langsamer wachsen. Wo das Wachstum am größten ist, liegt eine Wendestelle: zum Beispiel der Zeitpunkt, ab dem sich eine Ausbreitung abschwächt.",
  explanationHtml: `
    <p>Fährt man den Graphen in Richtung wachsender x ab, so ist er <strong>linksgekrümmt</strong>, wenn man nach links lenkt, und <strong>rechtsgekrümmt</strong>, wenn man nach rechts lenkt. Linkskrümmung heißt: Die Tangentensteigung f′ nimmt zu; Rechtskrümmung: f′ nimmt ab. Das Krümmungsverhalten von f ist also das Monotonieverhalten von f′.</p>
    <p>Mit der <strong>zweiten Ableitung</strong> f″ = (f′)′ folgt aus dem Monotoniekriterium:</p>
    <ul>
      <li>f″(x) &gt; 0 im Intervall ⇒ f′ steigt ⇒ Graph <strong>linksgekrümmt</strong>,</li>
      <li>f″(x) &lt; 0 im Intervall ⇒ f′ fällt ⇒ Graph <strong>rechtsgekrümmt</strong>.</li>
    </ul>
    <p>Eine Stelle, an der sich die Krümmung ändert, heißt <strong>Wendestelle</strong>, der Punkt Wendepunkt. Dort hat f′ ein Extremum: Die Steigung bzw. die lokale Änderungsrate ist an der Wendestelle <strong>extremal</strong>. Im Sachkontext ist das etwa der Zeitpunkt größten Wachstums. Rechnerisch: f″(x) = 0 lösen und prüfen, ob f″ dort das Vorzeichen wechselt.</p>
    <div class="example">f(x) = x³ − 3x² + 2: f′(x) = 3x² − 6x, f″(x) = 6x − 6. f″(x) = 0 ⇔ x = 1, und f″ wechselt dort von − nach +. Wendepunkt W(1 | 0); für x &lt; 1 rechtsgekrümmt, für x &gt; 1 linksgekrümmt. Bei x = 1 hat f′ seinen Tiefpunkt: Dort fällt der Graph am stärksten (f′(1) = −3).</div>
    <div class="merke"><strong>Merke:</strong> f″ &gt; 0: linksgekrümmt, f″ &lt; 0: rechtsgekrümmt. Wendestelle: f″ wechselt das Vorzeichen; dort ist die Steigung von f extremal.</div>
  `,
  formulas: [
    { name: "Krümmung", html: "f″(x) &gt; 0: linksgekrümmt; f″(x) &lt; 0: rechtsgekrümmt", quantities: "f″ = (f′)′ zweite Ableitung" },
    { name: "Wendestelle", html: "f″(x<sub>W</sub>) = 0 mit Vorzeichenwechsel von f″", quantities: "dort ist f′ extremal (größte oder kleinste Steigung)" },
  ],
  quiz: {
    question: "Der Graph einer Wachstumsfunktion N ist bis t = 4 linksgekrümmt und danach rechtsgekrümmt. Was bedeutet das?",
    options: ["Bis t = 4 wächst N immer schneller, danach immer langsamer; bei t = 4 ist das Wachstum am größten.", "Bei t = 4 ist N am größten.", "Ab t = 4 nimmt N ab."],
    correctIndex: 0,
    explanation: "Die Krümmung beschreibt, wie sich die Wachstumsrate N′ ändert. Die Wendestelle t = 4 ist das Maximum von N′, nicht von N. N selbst kann danach weiter wachsen.",
  },
  lab: {
    kind: "curvature",
    title: "Labor: Links, rechts, Wende",
    intro: "Ziehe P über den Graphen von f(x) = x³ − 3x² + 2. Gestrichelt siehst du den Graphen von f′; der orange Punkt darauf ist die aktuelle Steigung.",
    params: [{ type: "range", key: "x0", label: "x-Wert von P", unit: "", min: -1.5, max: 3.5, step: 0.25, value: 3, digits: 2 }],
    readouts: [
      { key: "curv", label: "Krümmung bei P", emphasis: true, compute: (v) => curvatureText(v.x0) },
      { key: "d1", label: "f′(x₀)", compute: (v) => curveD(v.x0), digits: 3 },
      { key: "d2", label: "f″(x₀)", compute: (v) => curveD2(v.x0), digits: 3 },
      { key: "P", label: "P", compute: (v) => `(${fmt(v.x0)} | ${fmt(curveF(v.x0))})` },
    ],
    goals: [
      { id: "wende", text: "Ziehe P auf den Wendepunkt.", check: (v) => Math.abs(curveD2(v.x0)) < 1e-9 },
      { id: "steigend-rechts", text: "Finde eine Stelle, an der der Graph steigt, aber rechtsgekrümmt ist.", check: (v) => curveD(v.x0) > 0 && curveD2(v.x0) < 0 },
      { id: "fallend-links", text: "Finde eine Stelle, an der der Graph fällt, aber linksgekrümmt ist.", check: (v) => curveD(v.x0) < 0 && curveD2(v.x0) > 0 },
    ],
  },
  exercises: [
    { id: "wendestelle", make: wendestelle },
    { id: "kruemmung", make: kruemmung },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du untersuchst die Krümmung mit f″ und deutest Wendestellen als Stellen extremer Steigung.",
};

// 5.4 Notwendige und hinreichende Bedingungen ───────────────────────────────

function klassifizieren(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p, q] = pair(rng, [-2, -1, 0, 1, 2]);
    const poly = cubicWith(p, q, rng.int(-3, 3));
    const x0 = rng.pick([p, q]);
    const d2 = polyAt(polyDerivative(polyDerivative(poly)), x0);
    return {
      prompt: `Für f(x) = ${polyText(poly)} gilt f′(${fmt(x0)}) = 0. Berechne f″(${fmt(x0)}) und entscheide damit, welche Art von Extrempunkt vorliegt.`,
      given: [`f(x) = ${polyText(poly)}`, `f′(${fmt(x0)}) = 0`],
      formulaHint: "Hinreichend: f′(x₀) = 0 und f″(x₀) &lt; 0 ⇒ Hochpunkt; f′(x₀) = 0 und f″(x₀) &gt; 0 ⇒ Tiefpunkt",
      fields: [numberField(`f″(${fmt(x0)}) =`, d2, "", 2), choiceField("Art", ["Hochpunkt", "Tiefpunkt", "keine Aussage möglich"], d2 < 0 ? 0 : d2 > 0 ? 1 : 2)],
      steps: [`f″(x) = ${polyText(polyDerivative(polyDerivative(poly)))}`, `f″(${fmt(x0)}) = ${fmt(d2)} ${d2 < 0 ? "&lt;" : "&gt;"} 0`, `<strong>${d2 < 0 ? "Hochpunkt (rechtsgekrümmt)" : "Tiefpunkt (linksgekrümmt)"}</strong>`],
    };
  }
  const k = rng.pick([2, 3, 4]);
  // f(x) = x⁴ − k·x³ at x = 0: f′(0) = f″(0) = 0, f′(x) = x²(4x − 3k) without change of sign at 0.
  return {
    prompt: `Für f(x) = x⁴ − ${k}x³ gilt f′(0) = 0 und f″(0) = 0. Was folgt aus f″(0) = 0? Untersuche mit dem Vorzeichenwechsel von f′, was bei x = 0 vorliegt, und gib die Stelle des Tiefpunkts an.`,
    given: [`f(x) = x⁴ − ${k}x³`],
    fields: [
      choiceField("aus f″(0) = 0 folgt", ["noch nichts: das f″-Kriterium versagt", "ein Wendepunkt", "ein Terrassenpunkt"], 0),
      choiceField("bei x = 0 liegt", ["ein Hochpunkt", "ein Tiefpunkt", "ein Terrassenpunkt"], 2),
      numberField("Tiefpunkt bei x =", (3 * k) / 4, "", 2),
    ],
    steps: [`f′(x) = 4x³ − ${3 * k}x² = x²(4x − ${3 * k})`, `Bei 0: x² ≥ 0, 4x − ${3 * k} &lt; 0: f′ ≤ 0 auf beiden Seiten, kein VZW ⇒ Terrassenpunkt.`, `4x − ${3 * k} = 0 ⇔ x = ${fmt((3 * k) / 4)}, dort VZW von − nach +.`, `<strong>f″(0) = 0 entscheidet nichts; Terrassenpunkt bei 0; Tiefpunkt bei x = ${fmt((3 * k) / 4)}</strong>`],
  };
}

const STATEMENTS = [
  { text: "f′(x₀) = 0 ist für eine Extremstelle der differenzierbaren Funktion f an der Stelle x₀ …", answer: 0 },
  { text: "f′(x₀) = 0 und ein Vorzeichenwechsel von f′ bei x₀ sind für eine Extremstelle …", answer: 1 },
  { text: "f″(x₀) = 0 ist für eine Wendestelle der Funktion f (mit existierender zweiter Ableitung) …", answer: 0 },
  { text: "f′(x₀) = 0 und f″(x₀) ≠ 0 sind für eine Extremstelle …", answer: 1 },
];

function aussagen(rng: Rng, level: 1 | 2): ExerciseTask {
  const options = ["notwendig, aber nicht hinreichend", "hinreichend", "weder notwendig noch hinreichend"];
  if (level === 1) {
    const s = rng.pick(STATEMENTS);
    const n = rng.pick([3, 5]);
    return {
      prompt: `Ergänze: „${s.text}“ Prüfe die erste Aussage am Beispiel f(x) = x${n === 3 ? "³" : "⁵"}: Berechne f′(0).`,
      given: [`f(x) = x${n === 3 ? "³" : "⁵"}`],
      formulaHint: "Notwendig: muss gelten, wenn die Eigenschaft vorliegt. Hinreichend: Wenn es gilt, liegt die Eigenschaft sicher vor.",
      fields: [choiceField("Die Bedingung ist", options, s.answer), numberField("f′(0) =", 0, "", 2)],
      steps: [`f′(x) = ${n}x${n === 3 ? "²" : "⁴"}, f′(0) = 0, aber f hat bei 0 kein Extremum: f′ = 0 allein reicht nicht.`, `<strong>${options[s.answer]}; f′(0) = 0</strong>`],
    };
  }
  const k = rng.pick([1, 2, 3]);
  // g(x) = x⁴ + k: f″(0) = 0 but no turning point (Tiefpunkt).
  return {
    prompt: `Zeige an g(x) = x⁴ + ${k}, dass f″(x₀) = 0 nicht hinreichend für eine Wendestelle ist: Berechne g″(0), g″(−1) und g″(1). Was liegt bei x = 0 vor?`,
    given: [`g(x) = x⁴ + ${k}`],
    fields: [numberField("g″(0) =", 0, "", 2), numberField("g″(1) =", 12, "", 2), choiceField("bei x = 0", ["Wendepunkt", "Tiefpunkt", "Terrassenpunkt"], 1)],
    steps: ["g′(x) = 4x³, g″(x) = 12x²", "g″(−1) = g″(1) = 12 &gt; 0: Auf beiden Seiten linksgekrümmt, kein Krümmungswechsel. g′ wechselt bei 0 von − nach +.", `<strong>g″(0) = 0, g″(1) = 12; Tiefpunkt (0 | ${k})</strong>`],
  };
}

const bedingungen: Lesson = {
  id: "ku-4-bedingungen",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "5.4 Notwendige und hinreichende Bedingungen",
  subtitle: "Warum f′(x₀) = 0 nicht genügt",
  lehrplan: `${LEHRPLAN}, notwendige und hinreichende Bedingungen für Extrem- und Wendestellen`,
  whyItMatters:
    "„Wenn f′(x₀) = 0 ist, dann liegt ein Extremum vor“ ist falsch, und trotzdem ein häufiger Fehler. Wer notwendige und hinreichende Bedingungen auseinanderhält, argumentiert sauber und übersieht keine Sonderfälle wie Terrassenpunkte.",
  explanationHtml: `
    <p>Eine Bedingung B heißt für eine Eigenschaft E</p>
    <ul>
      <li><strong>notwendig</strong>, wenn sie immer erfüllt ist, sobald E vorliegt (ohne B kein E),</li>
      <li><strong>hinreichend</strong>, wenn aus B sicher E folgt (B genügt für E).</li>
    </ul>
    <p>Für eine differenzierbare Funktion f gilt:</p>
    <ul>
      <li>f′(x₀) = 0 ist <strong>notwendig, aber nicht hinreichend</strong> für eine Extremstelle bei x₀. Gegenbeispiel: f(x) = x³ mit f′(0) = 0, aber ohne Extremum (Terrassenpunkt).</li>
      <li><strong>Hinreichend</strong> sind: f′(x₀) = 0 mit Vorzeichenwechsel von f′, oder f′(x₀) = 0 und f″(x₀) ≠ 0 (f″(x₀) &lt; 0: Hochpunkt, f″(x₀) &gt; 0: Tiefpunkt).</li>
      <li>f″(x₀) = 0 ist <strong>notwendig, aber nicht hinreichend</strong> für eine Wendestelle. Gegenbeispiel: g(x) = x⁴ mit g″(0) = 0, aber einem Tiefpunkt bei 0. Hinreichend ist f″(x₀) = 0 mit Vorzeichenwechsel von f″.</li>
    </ul>
    <p>Ist f′(x₀) = 0 und f″(x₀) = 0, liefert das f″-Kriterium keine Aussage; dann hilft der Vorzeichenwechsel von f′.</p>
    <div class="example">f(x) = x⁴ − 2x³: f′(x) = 2x²(2x − 3), f″(x) = 12x² − 12x. Bei 0: f′(0) = 0 und f″(0) = 0, f″ entscheidet nichts. f′ ist links und rechts von 0 negativ: kein VZW, Terrassenpunkt. Bei 1,5: f″(1,5) = 9 &gt; 0, also Tiefpunkt.</div>
    <div class="merke"><strong>Merke:</strong> f′(x₀) = 0 ist notwendig, nicht hinreichend für ein Extremum (x³). Hinreichend: f′(x₀) = 0 mit VZW von f′ oder f′(x₀) = 0 mit f″(x₀) ≠ 0. f″(x₀) = 0 ist notwendig, nicht hinreichend für eine Wendestelle (x⁴).</div>
  `,
  formulas: [
    { name: "Hinreichend für ein Extremum", html: "f′(x₀) = 0 und f″(x₀) ≠ 0 (oder VZW von f′)", quantities: "f″(x₀) < 0: Hochpunkt, f″(x₀) > 0: Tiefpunkt" },
    { name: "Hinreichend für eine Wendestelle", html: "f″(x₀) = 0 und VZW von f″", quantities: "f″(x₀) = 0 allein ist nur notwendig" },
  ],
  quiz: {
    question: "Für eine Funktion gilt f′(2) = 0 und f″(2) = 0. Was kann man sagen?",
    options: ["Noch nichts: Es kann ein Extremum oder ein Terrassenpunkt vorliegen; der Vorzeichenwechsel von f′ entscheidet.", "Bei 2 liegt sicher ein Terrassenpunkt.", "Bei 2 liegt sicher ein Wendepunkt."],
    correctIndex: 0,
    explanation: "x⁴ hat bei 0 einen Tiefpunkt, x³ einen Terrassenpunkt; bei beiden sind f′(0) = f″(0) = 0. Diese Bedingungen sind nur notwendig.",
  },
  lab: {
    kind: "conditions",
    title: "Labor: Wenn f′(0) = 0 ist",
    intro: "f(x) = ax⁴ + bx³ + cx² hat immer f′(0) = 0. Verändere a, b und c (oder ziehe den Formpunkt bei x = 1 für a) und beobachte, was bei 0 vorliegt.",
    params: [
      { type: "range", key: "a", label: "a (vor x⁴)", unit: "", min: -2, max: 2, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "b", label: "b (vor x³)", unit: "", min: -2, max: 2, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "c", label: "c (vor x²)", unit: "", min: -2, max: 2, step: 0.5, value: 1, digits: 1 },
    ],
    readouts: [
      { key: "kind", label: "bei x = 0", emphasis: true, compute: (v) => pointAt0(v) },
      { key: "d2", label: "f″(0)", compute: (v) => 2 * v.c, digits: 2 },
      { key: "rule", label: "f″-Kriterium", compute: (v) => (v.c !== 0 ? `entscheidet: ${v.c > 0 ? "Tiefpunkt" : "Hochpunkt"}` : "f″(0) = 0: keine Aussage, VZW von f′ prüfen") },
      { key: "term", label: "f(x)", compute: (v) => (pointAt0(v) === "konstant" ? "f(x) = 0" : `f(x) = ${polyText(condPoly(v))}`) },
    ],
    goals: [
      { id: "kein-extremum", text: "Erzeuge eine Funktion mit f′(0) = 0, die bei 0 kein Extremum hat und steigt.", check: (v) => v.c === 0 && v.b > 0 },
      { id: "tief-trotz", text: "Erzeuge einen Tiefpunkt bei 0, obwohl f″(0) = 0 ist.", check: (v) => v.c === 0 && v.b === 0 && v.a > 0 },
      { id: "hochpunkt", text: "Erzeuge einen Hochpunkt bei 0, den das f″-Kriterium sicher erkennt.", check: (v) => v.c < 0 },
    ],
  },
  exercises: [
    { id: "klassifizieren", make: klassifizieren },
    { id: "aussagen", make: aussagen },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest notwendige und hinreichende Bedingungen und kennst die Gegenbeispiele x³ und x⁴.",
};

// 5.5 Ganzrationale Funktionen untersuchen ──────────────────────────────────

function kurvendiskussion(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const [p, q] = pair(rng, [-3, -2, -1, 0, 1, 2, 3]);
    const poly = cubicWith(p, q, rng.int(-4, 4));
    const xw = (p + q) / 2;
    return {
      prompt: `Untersuche <strong>f(x) = ${polyText(poly)}</strong>: Bestimme die Extremstellen und den Wendepunkt. Kontrolliere dein Ergebnis mit einem Funktionenplotter.`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "f′(x) = 0 und VZW (oder f″ ≠ 0) für Extremstellen; f″(x) = 0 mit VZW für Wendestellen",
      fields: [numberField("Hochpunkt bei x =", p, "", 2), numberField("Tiefpunkt bei x =", q, "", 2), numberField("x<sub>W</sub> =", xw, "", 2), numberField("y<sub>W</sub> =", polyAt(poly, xw), "", 2)],
      steps: [`f′(x) = 3${factorText(p, q)}: Nullstellen ${fmt(p)} und ${fmt(q)}`, `f″(x) = 6x${plus(-3 * (p + q))}: f″(${fmt(p)}) &lt; 0 (Hochpunkt), f″(${fmt(q)}) &gt; 0 (Tiefpunkt), f″ = 0 bei ${fmt(xw)}`, `<strong>H bei ${fmt(p)}, T bei ${fmt(q)}, W(${fmt(xw)} | ${fmt(polyAt(poly, xw))})</strong>`],
    };
  }
  const p = rng.pick([1, 2, 3]);
  // f(x) = x³ − 1,5p·x² + k: Hochpunkt bei 0, Tiefpunkt bei p; Tiefpunkt auf der x-Achse für k = 0,5p³.
  const k = 0.5 * p ** 3;
  return {
    prompt: `Gegeben ist f(x) = x³ − ${fmt(1.5 * p)}x² + k. Für welchen Wert von k liegt der Tiefpunkt des Graphen auf der x-Achse? Gib für dieses k die Koordinaten des Hochpunkts an.`,
    given: [`f(x) = x³ − ${fmt(1.5 * p)}x² + k`],
    fields: [numberField("k =", k, "", 2), numberField("Hochpunkt x =", 0, "", 2), numberField("Hochpunkt y =", k, "", 2)],
    steps: [`f′(x) = 3x² − ${fmt(3 * p)}x = 3x(x − ${p}): Hochpunkt bei 0, Tiefpunkt bei ${p} (f″(${p}) = ${fmt(3 * p)} &gt; 0)`, `f(${p}) = ${p ** 3} − ${fmt(1.5 * p ** 3)} + k = 0 ⇒ k = ${fmt(k)}`, `<strong>k = ${fmt(k)}; H(0 | ${fmt(k)})</strong>`],
  };
}

function symmetrieNullstellen(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([1, 4, 9]);
    const s = Math.sqrt(a);
    const poly = [1, 0, -a, 0];
    const ex = Math.sqrt(a / 3);
    return {
      prompt: `Untersuche f(x) = ${polyText(poly)} auf Symmetrie, Nullstellen und Extremstellen. Gib die positive Nullstelle und die positive Extremstelle an.`,
      given: [`f(x) = ${polyText(poly)}`],
      formulaHint: "Nur ungerade Potenzen ⇒ punktsymmetrisch. Nullstellen: x ausklammern. Extremstellen: f′(x) = 0.",
      fields: [choiceField("Symmetrie", ["achsensymmetrisch zur y-Achse", "punktsymmetrisch zum Ursprung", "keine"], 1), numberField("positive Nullstelle:", s, "", 2), numberField("positive Extremstelle ≈", ex, "", 2)],
      steps: [`f(−x) = −f(x): punktsymmetrisch. f(x) = x(x² − ${a}) = 0 ⇔ x = 0 oder x = ±${fmt(s)}`, `f′(x) = 3x² − ${a} = 0 ⇔ x = ±√(${fmt(a / 3, 3)}) ${rel(ex)} ±${fmt(ex)}`, `<strong>punktsymmetrisch; ${fmt(s)}; ${fmt(ex)}</strong>`],
    };
  }
  const [m, n] = rng.pick([[1, 2], [1, 3], [2, 3]]);
  // f(x) = (x² − m²)(x² − n²) = x⁴ − (m² + n²)x² + m²n²
  const poly = [1, 0, -(m * m + n * n), 0, m * m * n * n];
  const ex = Math.sqrt((m * m + n * n) / 2);
  return {
    prompt: `Untersuche f(x) = ${polyText(poly)}. Löse f(x) = 0 durch Substitution (Wiederholung aus M10) und gib die beiden positiven Nullstellen an. Wie viele Extrempunkte hat der Graph, und wo liegt der positive Tiefpunkt?`,
    given: [`f(x) = ${polyText(poly)}`],
    fields: [numberField("Nullstelle x₁ =", m, "", 2), numberField("Nullstelle x₂ =", n, "", 2), numberField("Anzahl Extrempunkte:", 3, "", 0), numberField("Tiefpunkt bei x ≈", ex, "", 2)],
    anyOrder: [0, 1],
    steps: [`z = x²: z² − ${m * m + n * n}z + ${m * m * n * n} = 0 ⇔ z = ${m * m} oder z = ${n * n}`, `f′(x) = 4x³ − ${2 * (m * m + n * n)}x = 2x(2x² − ${m * m + n * n}) = 0 ⇔ x = 0 oder x = ±${fmt(ex)}`, `<strong>Nullstellen ±${m}, ±${n}; 3 Extrempunkte (H bei 0); Tiefpunkt bei x ≈ ${fmt(ex)}</strong>`],
  };
}

const untersuchung: Lesson = {
  id: "ku-5-untersuchung",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "5.5 Ganzrationale Funktionen untersuchen",
  subtitle: "Die Methoden der Differentialrechnung flexibel nutzen",
  lehrplan: `${LEHRPLAN}, Analyse ganzrationaler Funktionen mit den Methoden der Differentialrechnung`,
  whyItMatters:
    "Am Ende fügst du alles zusammen: Symmetrie, Nullstellen, Monotonie, Extrem- und Wendepunkte ergeben ein vollständiges Bild des Graphen. Diese Analyse ist ein Kern der Abiturprüfung.",
  explanationHtml: `
    <p>Eine Untersuchung einer ganzrationalen Funktion umfasst, je nach Fragestellung:</p>
    <ol>
      <li><strong>Symmetrie</strong> und <strong>Verhalten für x → ±∞</strong> (höchste Potenz),</li>
      <li><strong>Nullstellen</strong>, auch mit Ausklammern oder Substitution, mit ihrer Vielfachheit,</li>
      <li><strong>Monotonie und Extrempunkte</strong>: f′(x) = 0, dann Vorzeichenwechsel oder f″,</li>
      <li><strong>Krümmung und Wendepunkte</strong>: f″(x) = 0 mit Vorzeichenwechsel,</li>
      <li>eine <strong>Skizze</strong>, kontrolliert mit einer Mathematiksoftware.</li>
    </ol>
    <p>Nutze, was du weißt, flexibel: Eine doppelte Nullstelle ist ein Extrempunkt auf der x-Achse; eine Funktion dritten Grades hat genau einen Wendepunkt, und ihr Graph ist punktsymmetrisch zu ihm; ein Parameter im Term lässt sich über eine Bedingung (z. B. „Tiefpunkt auf der x-Achse“) bestimmen.</p>
    <div class="example">f(x) = x³ − 3x² + 4 = (x + 1)(x − 2)²: Nullstellen −1 (einfach) und 2 (doppelt). f′(x) = 3x(x − 2): Hochpunkt H(0 | 4), Tiefpunkt T(2 | 0) auf der x-Achse. f″(x) = 6x − 6: Wendepunkt W(1 | 2). Für x → +∞ geht f(x) → +∞, für x → −∞ gegen −∞.</div>
    <div class="merke"><strong>Merke:</strong> Untersuchen heißt: Symmetrie, Randverhalten, Nullstellen, Extrem- und Wendepunkte bestimmen und zu einer Skizze zusammenfügen. Doppelte Nullstelle ⇒ Extrempunkt auf der x-Achse.</div>
  `,
  formulas: [
    { name: "Extrempunkte", html: "f′(x₀) = 0 und VZW von f′ (oder f′(x₀) = 0 und f″(x₀) ≠ 0)", quantities: "Art über das Vorzeichen" },
    { name: "Wendepunkte", html: "f″(x<sub>W</sub>) = 0 und VZW von f″", quantities: "Grad 3: genau ein Wendepunkt, Symmetriezentrum" },
  ],
  quiz: {
    question: "Der Graph einer ganzrationalen Funktion hat bei x = 2 eine doppelte Nullstelle. Was folgt daraus?",
    options: ["Er berührt die x-Achse bei 2; dort liegt ein Extrempunkt (f(2) = f′(2) = 0).", "Er schneidet die x-Achse bei 2 mit Vorzeichenwechsel.", "Bei 2 liegt ein Wendepunkt."],
    correctIndex: 0,
    explanation: "Bei einer doppelten Nullstelle wechselt f das Vorzeichen nicht; der Graph berührt die x-Achse, die Tangente ist dort die x-Achse selbst.",
  },
  lab: {
    kind: "cubic-analysis",
    title: "Labor: Funktion dritten Grades",
    intro: "Ziehe die drei Nullstellen von f(x) = a(x − r₁)(x − r₂)(x − r₃) und wähle a. Hochpunkte sind orange, Tiefpunkte grün, der Wendepunkt blau markiert.",
    params: [
      { type: "choice", key: "a", label: "Faktor a", value: 0.5, options: [-2, -1, -0.5, 0.5, 1, 2].map((a) => ({ value: a, label: fmt(a) })) },
      { type: "range", key: "r1", label: "Nullstelle r₁", unit: "", min: -3, max: 3, step: 0.5, value: -3, digits: 1 },
      { type: "range", key: "r2", label: "Nullstelle r₂", unit: "", min: -3, max: 3, step: 0.5, value: -1, digits: 1 },
      { type: "range", key: "r3", label: "Nullstelle r₃", unit: "", min: -3, max: 3, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "term", label: "f(x)", emphasis: true, compute: (v) => `f(x) = ${polyText(cubicPoly(v))}` },
      { key: "ext", label: "Extrempunkte", compute: (v) => { const f = cubicFacts(v); return f.terrace ? "keiner: ein Terrassenpunkt" : f.extrema.length === 0 ? "keine" : f.extrema.map((e) => `${e.kind === "Hochpunkt" ? "H" : "T"}(${fmt(e.x)} | ${fmt(e.y)})`).join(", "); } },
      { key: "wp", label: "Wendepunkt", compute: (v) => { const w = cubicFacts(v).inflection; return `W(${fmt(w.x)} | ${fmt(w.y)})`; } },
      { key: "sym", label: "punktsymmetrisch zum Ursprung?", compute: (v) => { const p = cubicPoly(v); return Math.abs(p[1]) < 1e-9 && Math.abs(p[3]) < 1e-9 ? "ja" : "nein"; } },
    ],
    goals: [
      { id: "ursprung", text: "Mache den Graphen punktsymmetrisch zum Ursprung: Der Wendepunkt liegt dann in (0 | 0).", check: (v) => { const p = cubicPoly(v); return Math.abs(p[1]) < 1e-9 && Math.abs(p[3]) < 1e-9; } },
      { id: "doppelt", text: "Lege einen Tiefpunkt auf die x-Achse.", check: (v) => cubicFacts(v).extrema.some((e) => e.kind === "Tiefpunkt" && Math.abs(e.y) < 1e-9) },
      { id: "hochpunkt-y", text: "Lege einen Hochpunkt auf die y-Achse.", check: (v) => cubicFacts(v).extrema.some((e) => e.kind === "Hochpunkt" && Math.abs(e.x) < 1e-9) },
    ],
  },
  exercises: [
    { id: "kurvendiskussion", make: kurvendiskussion },
    { id: "symmetrie-nullstellen", make: symmetrieNullstellen },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du untersuchst ganzrationale Funktionen vollständig und nutzt die Methoden flexibel.",
};

// 5.6 Newton-Verfahren ───────────────────────────────────────────────────────

const NEWTON_TASKS = [
  { term: "x³ − 2x − 5", f: (x: number) => x ** 3 - 2 * x - 5, d: (x: number) => 3 * x * x - 2, start: 2 },
  { term: "x³ + x − 3", f: (x: number) => x ** 3 + x - 3, d: (x: number) => 3 * x * x + 1, start: 1 },
  { term: "x³ − 3x + 1", f: newtonF, d: newtonD, start: 2 },
  { term: "x⁴ − x − 1", f: (x: number) => x ** 4 - x - 1, d: (x: number) => 4 * x ** 3 - 1, start: 1 },
];

function schritt(rng: Rng, level: 1 | 2): ExerciseTask {
  const t = rng.pick(NEWTON_TASKS);
  const x0 = t.start + rng.pick([0, 0.5]);
  const x1 = x0 - t.f(x0) / t.d(x0);
  if (level === 1) {
    return {
      prompt: `Führe für f(x) = ${t.term} einen Schritt des Newton-Verfahrens mit dem Startwert x₀ = ${fmt(x0)} aus. Runde auf drei Nachkommastellen.`,
      given: [`f(x) = ${t.term}`, `x₀ = ${fmt(x0)}`],
      formulaHint: "x₁ = x₀ − f(x₀) : f′(x₀)",
      // The prompt asks for three decimals, so only rounding is tolerated (no 1 % margin).
      fields: [numberField("x₁ ≈", x1, "", 3, { tolerance: 0, slips: [{ value: x0 + t.f(x0) / t.d(x0), hint: "Im Newton-Verfahren wird f(x₀) : f′(x₀) abgezogen, nicht addiert." }] })],
      steps: [`f(${fmt(x0)}) = ${fmt(t.f(x0), 4)}, f′(${fmt(x0)}) = ${fmt(t.d(x0), 4)}`, `x₁ = ${fmt(x0)} − ${paren(t.f(x0), 4)} : ${fmt(t.d(x0), 4)} ${rel(x1, 3)} ${fmt(x1, 3)}`, `<strong>x₁ ≈ ${fmt(x1, 3)}</strong>`],
    };
  }
  const x2 = x1 - t.f(x1) / t.d(x1);
  return {
    prompt: `Bestimme mit dem Newton-Verfahren eine Näherung für die Nullstelle von f(x) = ${t.term}, die sich nicht mit einer Formel berechnen lässt. Starte bei x₀ = ${fmt(x0)} und rechne zwei Schritte, wie in einer Tabellenkalkulation (Spalten x, f(x), f′(x)). Gib x₂ auf vier Nachkommastellen an und f(x₂) auf drei.`,
    given: [`f(x) = ${t.term}`, `x₀ = ${fmt(x0)}`],
    // Only rounding is tolerated; f(x₂) may also carry the error of an x₂ rounded to four decimals.
    fields: [
      numberField("x₂ ≈", x2, "", 4, { tolerance: 0 }),
      numberField("f(x₂) ≈", t.f(x2), "", 3, { tolerance: 0, absTolerance: 0.51e-3 + 0.5e-4 * Math.abs(t.d(x2)) }),
    ],
    steps: [`x₁ = ${fmt(x0)} − ${paren(t.f(x0), 4)} : ${fmt(t.d(x0), 4)} ≈ ${fmt(x1, 4)}`, `x₂ = x₁ − f(x₁) : f′(x₁) ≈ ${fmt(x2, 4)}`, `<strong>x₂ ≈ ${fmt(x2, 4)}; f(x₂) ≈ ${fmt(t.f(x2), 3)}</strong>`],
  };
}

function wurzel(rng: Rng, level: 1 | 2): ExerciseTask {
  if (level === 1) {
    const a = rng.pick([2, 3, 5, 7, 10]);
    const x0 = rng.pick([1, 2, 3]);
    const x1 = (x0 + a / x0) / 2;
    return {
      prompt: `Mit dem Newton-Verfahren für f(x) = x² − ${a} kann man √${a} annähern. Zeige, dass die Iterationsvorschrift x<sub>n+1</sub> = (xₙ + ${a} : xₙ) : 2 lautet, und berechne x₁ für x₀ = ${x0}.`,
      given: [`f(x) = x² − ${a}`, `x₀ = ${x0}`],
      formulaHint: `xₙ − (xₙ² − ${a}) : (2xₙ) = (xₙ + ${a} : xₙ) : 2`,
      fields: [numberField("x₁ ≈", x1, "", 4, { tolerance: 0 })],
      steps: [`x₁ = ${x0} − (${x0 * x0} − ${a}) : ${2 * x0} = ${fmt(x1, 4)}`, `<strong>x₁ ≈ ${fmt(x1, 4)} (√${a} ≈ ${fmt(Math.sqrt(a), 4)})</strong>`],
    };
  }
  const k = rng.pick([1, 2, 3]);
  const c = rng.pick([1, 2, 5]);
  return {
    prompt: `Das Newton-Verfahren für f(x) = x³ − ${3 * k * k}x + ${c} bricht bei einem positiven Startwert x₀ sofort ab. Welcher ist das, und warum?`,
    given: [`f(x) = x³ − ${3 * k * k}x + ${c}`],
    fields: [numberField("x₀ =", k, "", 2), choiceField("Grund", ["f′(x₀) = 0: Die Tangente ist waagrecht und schneidet die x-Achse nicht.", "f(x₀) = 0: x₀ ist schon eine Nullstelle.", "x₀ ist zu groß; das Verfahren läuft weg."], 0)],
    steps: [`f′(x) = 3x² − ${3 * k * k} = 0 ⇔ x = ±${k}`, `Bei x₀ = ${k} müsste man durch f′(${k}) = 0 teilen.`, `<strong>x₀ = ${k}; waagrechte Tangente</strong>`],
  };
}

const newtonLesson: Lesson = {
  id: "ku-6-newton",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "5.6 Newton-Verfahren",
  subtitle: "Nullstellen schrittweise mit Tangenten annähern",
  lehrplan: `${LEHRPLAN}, Newton-Verfahren als iteratives Näherungsverfahren`,
  whyItMatters:
    "Viele Gleichungen lassen sich nicht mit einer Formel lösen, etwa x³ − 2x − 5 = 0. Näherungsverfahren wie das Newton-Verfahren stecken in Taschenrechnern, Wettermodellen, Flugzeugentwicklung und Finanzsoftware.",
  explanationHtml: `
    <p>Beim <strong>Newton-Verfahren</strong> ersetzt man den Graphen nahe einem Startwert x₀ durch seine Tangente und nimmt deren Nullstelle als bessere Näherung. Die Tangente in (x₀ | f(x₀)) schneidet die x-Achse bei</p>
    <p class="formula-line">x₁ = x₀ − f(x₀) / f′(x₀).</p>
    <p>Mit x₁ wiederholt man das Vorgehen: x<sub>n+1</sub> = xₙ − f(xₙ) / f′(xₙ). Ein solches Verfahren, das immer dieselbe Vorschrift auf das letzte Ergebnis anwendet, heißt <strong>iterativ</strong>. In einer Tabellenkalkulation schreibst du die Vorschrift einmal und ziehst sie nach unten. Meist verdoppelt sich die Zahl der richtigen Nachkommastellen mit jedem Schritt.</p>
    <p>Grenzen: Ist f′(xₙ) = 0, ist die Tangente waagrecht und das Verfahren bricht ab. Liegt der Startwert ungünstig, kann es zu einer anderen Nullstelle oder gar nicht konvergieren. Ein Blick auf den Graphen hilft, einen guten Startwert zu wählen.</p>
    <div class="example">f(x) = x³ − 3x + 1, f′(x) = 3x² − 3, Startwert x₀ = 2: x₁ = 2 − 3/9 ≈ 1,6667; x₂ ≈ 1,5486; x₃ ≈ 1,5324; x₄ ≈ 1,5321. Die Nullstelle ist ≈ 1,532. Mit x₀ = 1 bricht das Verfahren ab, weil f′(1) = 0 ist.</div>
    <div class="merke"><strong>Merke:</strong> Newton-Verfahren: x<sub>n+1</sub> = xₙ − f(xₙ) / f′(xₙ). Guter Startwert nahe der Nullstelle; bei f′(xₙ) = 0 bricht es ab.</div>
  `,
  formulas: [
    { name: "Newton-Verfahren", html: "x<sub>n+1</sub> = xₙ − f(xₙ) / f′(xₙ)", quantities: "f′(xₙ) ≠ 0; Startwert x₀ nahe der gesuchten Nullstelle" },
  ],
  quiz: {
    question: "Was ist x₁ im Newton-Verfahren geometrisch?",
    options: ["die Schnittstelle der Tangente in (x₀ | f(x₀)) mit der x-Achse", "der Schnittpunkt des Graphen mit der y-Achse", "die Stelle, an der die Tangente waagrecht ist"],
    correctIndex: 0,
    explanation: "Die Tangente y = f′(x₀)(x − x₀) + f(x₀) hat die Nullstelle x₀ − f(x₀) / f′(x₀). Sie ersetzt den Graphen nahe x₀.",
  },
  lab: {
    kind: "newton",
    title: "Labor: Tangenten zur Nullstelle",
    intro: "Ziehe den Startwert x₀ auf der x-Achse und erhöhe die Zahl der Schritte. Jede violette Tangente liefert die nächste Näherung.",
    params: [
      { type: "range", key: "x0", label: "Startwert x₀", unit: "", min: -3, max: 3, step: 0.25, value: 0.5, digits: 2 },
      { type: "range", key: "n", label: "Schritte n", unit: "", min: 0, max: 6, step: 1, value: 0, digits: 0 },
    ],
    readouts: [
      { key: "xn", label: "Näherung xₙ", emphasis: true, compute: (v) => { const r = newtonIterates(v.x0, v.n); return r.stopped && r.xs.length - 1 < v.n ? `Abbruch bei x${subscript(r.xs.length - 1)} = ${fmt(r.xs[r.xs.length - 1], 6)}: f′ = 0` : fmt(r.xs[r.xs.length - 1], 6); } },
      { key: "fxn", label: "f(xₙ)", compute: (v) => { const r = newtonIterates(v.x0, v.n); return newtonF(r.xs[r.xs.length - 1]); }, digits: 6 },
      { key: "list", label: "Folge", compute: (v) => newtonIterates(v.x0, Math.min(v.n, 4)).xs.map((x) => fmt(x, 4)).join(" → ") },
    ],
    goals: [
      { id: "groesste", text: "Starte bei x₀ = 2 und nähere die größte Nullstelle auf drei Nachkommastellen genau an.", check: (v) => { const r = newtonIterates(v.x0, v.n); return v.x0 === 2 && Math.abs(r.xs[r.xs.length - 1] - NEWTON_ROOTS[2]) < 5e-4; } },
      { id: "abbruch", text: "Finde einen Startwert, bei dem das Verfahren schon im ersten Schritt abbricht.", check: (v) => v.n >= 1 && Math.abs(newtonD(v.x0)) < 1e-12 },
      { id: "kleinste", text: "Finde einen Startwert, der zur kleinsten Nullstelle (≈ −1,879) führt, auf drei Nachkommastellen genau.", check: (v) => { const r = newtonIterates(v.x0, v.n); return Math.abs(r.xs[r.xs.length - 1] - NEWTON_ROOTS[0]) < 5e-4; } },
    ],
  },
  exercises: [
    { id: "schritt", make: schritt },
    { id: "wurzel", make: wurzel },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst Nullstellen näherungsweise mit dem Newton-Verfahren und kennst seine Grenzen.",
};

export const STAGE_KURVENUNTERSUCHUNG: Stage = {
  id: STAGE_ID,
  stageNumber: 5,
  title: "Ganzrationale Funktionen untersuchen",
  subtitle: "Monotonie, Extrem- und Wendepunkte, Bedingungen und das Newton-Verfahren",
  icon: "🎢",
  accent: "#be185d",
  badgeTitle: "Kurven-Profi",
  lehrplanLabel: "M11 LB 4.2 · ca. 18 Std.",
  lessons: [monotonie, extremstellen, kruemmungLesson, bedingungen, untersuchung, newtonLesson],
};
