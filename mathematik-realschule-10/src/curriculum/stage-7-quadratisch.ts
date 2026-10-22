import { factorForm, fmt, frac, linear, paren, point, quadratic, round, shifted, sqrtHtml, term, vertexForm } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { circle, clipped, Plot, text } from "../lab/svg";
import {
  BASE_PARABOLA,
  completedVertex,
  completionFits,
  fenceArea,
  fenceModel,
  fenceSide,
  fitParabola,
  intersectionInfo,
  intersectionKind,
  quadraticRoots,
  rel,
  shapeOf,
  vertexOf,
} from "../lab/views-quadratisch";
import type { ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { choiceField, numberField } from "./helpers";

const STAGE_ID = "stage-7-quadratisch";
const LEHRPLAN = "M10 LB 4 (II/III): Quadratische Funktionen und quadratische Gleichungen";

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** A constant added to a term: " + 3", " − 3", or "" for 0. */
function plus(value: number, digits = 2): string {
  return term(value, "", false, digits);
}

/** The factor in front of a bracket: "" for 1, "−" for −1, else the number. */
function factor(a: number): string {
  return a === 1 ? "" : a === -1 ? "−" : fmt(a);
}

/** (x − d)² as the blackboard writes it: (x − 3)², (x + 2)² or x². */
function square(d: number): string {
  const inner = shifted(d);
  return inner === "x" ? "x²" : `${inner}²`;
}

/** The inside of (x − d): "x − 3", "x + 2" or "x". */
function inside(d: number): string {
  const inner = shifted(d);
  return inner === "x" ? "x" : inner.slice(1, -1);
}

/** "L = {−1; 3}", or "L ≈ {…}" when the solutions are rounded. */
function solutionSet(roots: number[], digits = 2): string {
  if (roots.length === 0) return "L = { }";
  const exact = roots.every((x) => rel(x, digits) === "=");
  return `L ${exact ? "=" : "≈"} {${roots.map((x) => fmt(x, digits)).join("; ")}}`;
}

/** A point for readouts: "(1,5 | −2)", or "≈ (0,41 | −1,92)" when rounded. */
function pointText(x: number, y: number): string {
  const exact = rel(x) === "=" && rel(y) === "=";
  return `${exact ? "" : "≈ "}${point(x, y)}`;
}

const COUNT = ["keine", "eine", "zwei"];

// 7.1 Parabeln und ihre Parameter ────────────────────────────────────────────

/** Opening and shape compared with the normal parabola, in the order of the choice fields. */
export const SHAPES = [
  "nach oben geöffnet, gestreckt",
  "nach oben geöffnet, gestaucht",
  "nach unten geöffnet, gestreckt",
  "nach unten geöffnet, gestaucht",
];

/** The index in SHAPES for a factor a with |a| ≠ 1. */
export function shapeIndex(a: number): number {
  return (a > 0 ? 0 : 2) + (Math.abs(a) > 1 ? 0 : 1);
}

const SHAPE_FACTORS = [-3, -2.5, -2, -1.5, -0.75, -0.5, -0.25, -0.2, 0.2, 0.25, 0.5, 0.75, 1.5, 2, 2.5, 3];

interface Lookalike {
  /** The equation as HTML. */
  html: string;
  /** The equation multiplied out and what it describes. */
  explain: string;
}

interface ParabolaCandidate extends Lookalike {
  kind: number;
  a: number;
  b: number;
  c: number;
  slipA?: { value: number; hint: string };
  slipC?: { value: number; hint: string };
}

/** The equation of a parabola that only shows its form after multiplying out. */
function parabolaCandidate(rng: Rng): ParabolaCandidate {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const k = rng.pick([1, 2, -1, 0.5, -2]);
    const r1 = rng.int(-5, 5);
    let r2 = rng.int(-5, 5);
    if (r2 === r1) r2 = r1 > 2 ? r1 - 3 : r1 + 3;
    const html = `y = ${factorForm(k, r1, r2)}`;
    const b = -k * (r1 + r2);
    const c = k * r1 * r2;
    return { kind, html, explain: `${html} = ${quadratic(k, b, c)}: eine Parabel`, a: k, b, c };
  }
  if (kind === 1) {
    const m = rng.pick([1, 2, 3, 0.5]);
    const r = nonZero(rng, 4);
    const n = rng.int(1, 9);
    const html = `y = ${n} − ${factor(m)}${square(r)}`;
    const a = -m;
    const b = 2 * m * r;
    const c = n - m * r * r;
    return {
      kind,
      html,
      explain: `${html} = ${n} − ${factor(m)}(${quadratic(1, -2 * r, r * r)}) = ${quadratic(a, b, c)}: eine Parabel`,
      a,
      b,
      c,
      slipC: { value: n, hint: "c ist der Wert für x = 0: Auch die Klammer trägt dazu bei. Multipliziere erst aus." },
    };
  }
  if (kind === 2) {
    const k = rng.pick([1, 2, 3, 0.5]);
    const p = rng.int(2, 9);
    const q = rng.int(-6, 6);
    const html = `y = x(${p} − ${factor(k)}x)${plus(q)}`;
    return {
      kind,
      html,
      explain: `${html} = ${quadratic(-k, p, q)}: eine Parabel`,
      a: -k,
      b: p,
      c: q,
      slipA: { value: k, hint: "Vorzeichen: x mal (−kx) ergibt −kx², a ist also negativ." },
    };
  }
  const p = nonZero(rng, 4);
  const w = rng.pick([3, 5]);
  const html = `y = (2x${plus(p)})² − ${w}x²`;
  const a = 4 - w;
  const b = 4 * p;
  const c = p * p;
  return {
    kind,
    html,
    explain: `${html} = 4x²${term(4 * p, "x", false)}${plus(p * p)} − ${w}x² = ${quadratic(a, b, c)}: eine Parabel`,
    a,
    b,
    c,
    slipA: { value: 4, hint: `Auch −${w}x² gehört zum x²-Glied: Fasse 4x² − ${w}x² zusammen.` },
  };
}

/** An equation that only looks like a parabola: x² cancels, or x is an exponent. */
function lookalike(rng: Rng, kind: number): Lookalike {
  if (kind === 0) {
    const p = nonZero(rng, 5);
    const html = `y = ${square(-p)} − x²`;
    return { html, explain: `${html} = x²${term(2 * p, "x", false)}${plus(p * p)} − x² = ${linear(2 * p, p * p)}: kein x², eine Gerade` };
  }
  if (kind === 1) {
    const p = rng.int(1, 6);
    const html = `y = ${factorForm(1, p, -p)} − x²`;
    return { html, explain: `${html} = x² − ${p * p} − x² = ${fmt(-p * p)}: eine Parallele zur x-Achse` };
  }
  if (kind === 2) {
    const p = rng.int(1, 5);
    const q = rng.int(-6, 6);
    const html = `y = 2x${shifted(p)} − 2x²${plus(q)}`;
    return { html, explain: `${html} = 2x² − ${2 * p}x − 2x²${plus(q)} = ${linear(-2 * p, q)}: kein x², eine Gerade` };
  }
  if (kind === 3) {
    const k = rng.pick([2, 3, 0.5]);
    const base = rng.pick([2, 3]);
    const html = `y = ${fmt(k)} · ${base}<sup>x</sup>`;
    return { html, explain: `${html}: x steht im Exponenten, eine Exponentialfunktion` };
  }
  const p = nonZero(rng, 4);
  const html = `y = x² − ${square(p)}`;
  return { html, explain: `${html} = x² − (${quadratic(1, -2 * p, p * p)}) = ${linear(2 * p, -p * p)}: kein x², eine Gerade` };
}

/** Fountains y = a(x − x_S)² + y_S whose nozzle height a·x_S² + y_S is positive with at most two decimals. */
const FOUNTAINS: Array<[number, number, number]> = [];
for (const a of [-0.2, -0.25, -0.4, -0.5, -0.8, -1]) {
  for (const xs of [1, 1.5, 2, 2.5, 3]) {
    for (const ys of [2, 2.5, 3, 3.5, 4, 4.5]) {
      const c = a * xs * xs + ys;
      if (c >= 0.4 && Math.abs(c - round(c, 2)) < 1e-9) FOUNTAINS.push([a, xs, ys]);
    }
  }
}

const parabeln: Lesson = {
  id: "qf-1-parabeln",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "7.1 Parabeln und ihre Parameter",
  subtitle: "Öffnung, Form und Verschiebung",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, Parabelgleichungen und die Bedeutung ihrer Parameter`,
  whyItMatters:
    "Brückenbögen, Wasserstrahlen und Wurfbahnen haben die Form von Parabeln. Wer die Parameter einer Parabelgleichung deuten kann, sieht ihren Verlauf, ohne eine Wertetabelle anzulegen.",
  explanationHtml: `
    <p>Eine Funktion mit einer Gleichung der Form <strong>y = ax² + bx + c</strong> mit a ≠ 0 heißt <strong>quadratische Funktion</strong>, ihr Graph ist eine <strong>Parabel</strong>. Die einfachste ist die <strong>Normalparabel</strong> y = x²: Ihr Scheitelpunkt ist S(0 | 0), sie ist symmetrisch zur y-Achse, und vom Scheitel aus geht es 1 nach rechts und 1 nach oben, 2 nach rechts und 4 nach oben, 3 nach rechts und 9 nach oben.</p>
    <p>In der <strong>Scheitelpunktsform y = a(x − x<sub>S</sub>)² + y<sub>S</sub></strong> kannst du die Parameter direkt deuten:</p>
    <ul>
      <li><strong>x<sub>S</sub> und y<sub>S</sub>:</strong> Die Parabel ist um x<sub>S</sub> nach rechts (bei x<sub>S</sub> &lt; 0 nach links) und um y<sub>S</sub> nach oben (bei y<sub>S</sub> &lt; 0 nach unten) verschoben. Ihr Scheitelpunkt ist <strong>S(x<sub>S</sub> | y<sub>S</sub>)</strong>, ihre Symmetrieachse die Gerade x = x<sub>S</sub>. Achtung: y = (x + 2)² = (x − (−2))² hat x<sub>S</sub> = −2.</li>
      <li><strong>a:</strong> Bei a &gt; 0 ist die Parabel nach oben geöffnet, bei a &lt; 0 nach unten (an der x-Achse gespiegelt). Bei |a| &gt; 1 ist sie <strong>gestreckt</strong> (schmaler als die Normalparabel), bei |a| &lt; 1 <strong>gestaucht</strong> (breiter), bei |a| = 1 so weit wie die Normalparabel. Vom Scheitel aus geht es 1 nach rechts und a nach oben.</li>
    </ul>
    <p>In der <strong>allgemeinen Form y = ax² + bx + c</strong> hat a dieselbe Bedeutung. <strong>c</strong> ist der y-Achsenabschnitt: Für x = 0 bleibt y = c, die Parabel schneidet die y-Achse im Punkt (0 | c). b allein hat keine so einfache Bedeutung; zusammen mit a legt es fest, wo der Scheitel liegt.</p>
    <p>Ob eine Gleichung zu einer Parabel gehört, zeigt oft erst das Ausmultiplizieren: y = (x + 3)² − x² = 6x + 9 ist eine Gerade, y = x(4 − x) = −x² + 4x eine Parabel.</p>
    <div class="example">y = −2(x − 3)² + 1: Scheitelpunkt S(3 | 1); a = −2, also nach unten geöffnet und gestreckt. Ausmultipliziert: y = −2(x² − 6x + 9) + 1 = −2x² + 12x − 17, die Parabel schneidet die y-Achse in (0 | −17).</div>
    <div class="merke"><strong>Merke:</strong> y = a(x − x<sub>S</sub>)² + y<sub>S</sub> ⇒ S(x<sub>S</sub> | y<sub>S</sub>). Das Vorzeichen von a bestimmt die Öffnung, |a| die Form. In y = ax² + bx + c ist (0 | c) der Schnittpunkt mit der y-Achse.</div>
  `,
  formulas: [
    { name: "Allgemeine Form", html: "y = ax² + bx + c (a ≠ 0)", quantities: "a: Öffnung und Form; (0 | c): Schnittpunkt mit der y-Achse" },
    { name: "Scheitelpunktsform", html: "y = a(x − x<sub>S</sub>)² + y<sub>S</sub>", quantities: "S(x_S | y_S) Scheitelpunkt, Symmetrieachse x = x_S" },
    { name: "Formfaktor a", html: "a &gt; 0 nach oben, a &lt; 0 nach unten; |a| &gt; 1 gestreckt, |a| &lt; 1 gestaucht", quantities: "vom Scheitel 1 nach rechts, a nach oben" },
  ],
  quiz: {
    question: "Was gibt die Zahl c in der Parabelgleichung y = ax² + bx + c an?",
    options: [
      "Die Parabel schneidet die y-Achse im Punkt (0 | c).",
      "c ist die y-Koordinate des Scheitelpunkts.",
      "Die Parabel ist um c nach rechts verschoben.",
    ],
    correctIndex: 0,
    explanation: "Für x = 0 fallen ax² und bx weg, es bleibt y = c. Den Scheitelpunkt liest man aus der Scheitelpunktsform ab; nur bei b = 0 liegt er auf der y-Achse.",
  },
  lab: {
    kind: "parabola-params",
    title: "Labor: Parabeln formen",
    intro:
      "Ziehe den Scheitelpunkt S und den orangen Formpunkt: Von S aus geht es 1 nach rechts und a nach oben. Gestrichelt siehst du die Normalparabel y = x² zum Vergleich.",
    params: [
      { type: "range", key: "a", label: "Formfaktor a", unit: "", min: -3, max: 3, step: 0.05, value: 1, digits: 2 },
      { type: "range", key: "xs", label: "Scheitelpunkt: x-Koordinate", unit: "", min: -5, max: 5, step: 0.5, value: 0, digits: 1 },
      { type: "range", key: "ys", label: "Scheitelpunkt: y-Koordinate", unit: "", min: -3, max: 3, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      { key: "form", label: "Scheitelpunktsform", emphasis: true, compute: (v) => (v.a === 0 ? "a = 0: keine Parabel" : `y = ${vertexForm(v.a, v.xs, v.ys)}`) },
      { key: "general", label: "allgemeine Form", compute: (v) => `y = ${quadratic(v.a, -2 * v.a * v.xs, v.a * v.xs * v.xs + v.ys)}` },
      { key: "S", label: "Scheitelpunkt", compute: (v) => (v.a === 0 ? "keiner" : `S${point(v.xs, v.ys)}`) },
      { key: "shape", label: "Öffnung und Form", compute: (v) => shapeOf(v.a) },
      { key: "c", label: "Schnittpunkt mit der y-Achse", compute: (v) => point(0, v.a * v.xs * v.xs + v.ys) },
    ],
    goals: [
      {
        id: "spiegeln",
        text: "Spiegle die Normalparabel an der x-Achse und verschiebe sie so, dass ihr Scheitelpunkt S(2 | 3) ist.",
        check: (v) => v.a === -1 && v.xs === 2 && v.ys === 3,
      },
      {
        id: "gestaucht",
        text: "Erzeuge eine nach oben geöffnete, gestauchte Parabel mit dem Scheitelpunkt S(−3 | −2).",
        check: (v) => v.a > 0 && v.a < 1 && v.xs === -3 && v.ys === -2,
      },
      {
        id: "y-achse",
        text: "Die Parabel mit dem Scheitelpunkt S(2 | −3) soll die y-Achse im Punkt (0 | 5) schneiden.",
        check: (v) => v.xs === 2 && v.ys === -3 && Math.abs(v.a * v.xs * v.xs + v.ys - 5) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "erkennen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick(SHAPE_FACTORS);
          const xs = rng.int(-6, 6);
          const ys = rng.int(-9, 9);
          const equation = `y = ${vertexForm(a, xs, ys)}`;
          const index = shapeIndex(a);
          const read =
            xs === 0
              ? "in der Klammer steht nur x, also x<sub>S</sub> = 0"
              : xs > 0
                ? `${square(xs)} ergibt x<sub>S</sub> = ${fmt(xs)}`
                : `${square(xs)} = (x − (${fmt(xs)}))² ergibt x<sub>S</sub> = ${fmt(xs)}`;
          const size = Math.abs(a);
          return {
            prompt: `Die Parabel p hat die Gleichung ${equation}. Gib die Koordinaten ihres Scheitelpunkts S an und beschreibe, wie sie im Vergleich zur Normalparabel geöffnet und geformt ist.`,
            given: [`p: ${equation}`],
            formulaHint: "y = a(x − x<sub>S</sub>)² + y<sub>S</sub> ⇒ S(x<sub>S</sub> | y<sub>S</sub>); a &lt; 0: nach unten geöffnet; |a| &gt; 1: gestreckt, |a| &lt; 1: gestaucht",
            fields: [
              numberField("x<sub>S</sub> =", xs, "", 2, { slips: [{ value: -xs, hint: "Vorzeichen: In y = a(x − x_S)² + y_S steht ein Minus vor x_S. Bei (x + 3)² ist x_S = −3." }] }),
              numberField("y<sub>S</sub> =", ys, "", 2),
              choiceField("Öffnung und Form", SHAPES, index),
            ],
            steps: [
              `Vergleiche mit y = a(x − x<sub>S</sub>)² + y<sub>S</sub>: ${read}; y<sub>S</sub> = ${fmt(ys)}.`,
              `a = ${fmt(a)}: ${a < 0 ? "a &lt; 0, also nach unten geöffnet" : "a &gt; 0, also nach oben geöffnet"}; |a| = ${fmt(size)} ${size > 1 ? "&gt; 1, also gestreckt (schmaler als die Normalparabel)" : "&lt; 1, also gestaucht (breiter als die Normalparabel)"}.`,
              `<strong>S(${fmt(xs)} | ${fmt(ys)}), ${SHAPES[index]}</strong>`,
            ],
            meta: { a, xs, ys },
          };
        }
        const parabola = parabolaCandidate(rng);
        const fakes = rng.shuffle([0, 1, 2, 3, 4]).slice(0, 3).map((kind) => lookalike(rng, kind));
        const all: Lookalike[] = rng.shuffle([parabola, ...fakes]);
        const index = all.indexOf(parabola);
        const labels = ["(1)", "(2)", "(3)", "(4)"];
        return {
          prompt: "Nur eine der vier Gleichungen gehört zu einer Parabel. Welche ist es? Multipliziere dazu aus. Gib für diese Parabel auch a und c der allgemeinen Form y = ax² + bx + c an.",
          given: all.map((candidate, i) => `${labels[i]} ${candidate.html}`),
          fields: [
            choiceField("Parabelgleichung", labels, index),
            numberField("a =", parabola.a, "", 2, parabola.slipA ? { slips: [parabola.slipA] } : {}),
            numberField("c =", parabola.c, "", 2, parabola.slipC ? { slips: [parabola.slipC] } : {}),
          ],
          steps: [
            all.map((candidate, i) => `${labels[i]} ${candidate.explain}`).join("<br>"),
            `<strong>Gleichung ${labels[index]} gehört zu einer Parabel: a = ${fmt(parabola.a)}, c = ${fmt(parabola.c)}</strong>`,
          ],
          meta: { index, kind: parabola.kind, a: parabola.a, b: parabola.b, c: parabola.c },
        };
      },
    },
    {
      id: "verschieben",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([-3, -2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2, 3]);
          const xs = nonZero(rng, 6);
          const ys = rng.int(-8, 8);
          const size = Math.abs(a);
          const shape: string[] = [];
          if (a < 0) shape.push("an der x-Achse gespiegelt");
          if (size !== 1) shape.push(`mit dem Faktor ${fmt(size)} ${size > 1 ? "gestreckt" : "gestaucht"}`);
          const moves = [`um ${fmt(Math.abs(xs))} nach ${xs > 0 ? "rechts" : "links"}`];
          if (ys !== 0) moves.push(`um ${fmt(Math.abs(ys))} nach ${ys > 0 ? "oben" : "unten"}`);
          const first = shape.length ? `${shape.join(", ")} und anschließend ` : "";
          return {
            prompt: `Die Normalparabel y = x² wird ${first}${moves.join(" und ")} verschoben. Bestimme a, x<sub>S</sub> und y<sub>S</sub> der neuen Parabel y = a(x − x<sub>S</sub>)² + y<sub>S</sub>.`,
            given: ["Normalparabel y = x² mit S(0 | 0)", ...shape, ...moves.map((move) => `verschoben ${move}`)],
            formulaHint: "Spiegeln an der x-Achse: a wird negativ; Faktor &gt; 1 streckt, Faktor &lt; 1 staucht; um x<sub>S</sub> nach rechts und um y<sub>S</sub> nach oben: y = a(x − x<sub>S</sub>)² + y<sub>S</sub>",
            fields: [
              numberField("a =", a, "", 2, { slips: [{ value: size, hint: "Die Spiegelung an der x-Achse macht a negativ." }] }),
              numberField("x<sub>S</sub> =", xs, "", 2, { slips: [{ value: -xs, hint: "Nach rechts heißt x_S positiv, nach links negativ; in der Gleichung steht dann x − x_S." }] }),
              numberField("y<sub>S</sub> =", ys, "", 2, { slips: [{ value: -ys, hint: "Nach oben heißt y_S positiv, nach unten negativ." }] }),
            ],
            steps: [
              `Form: ${a < 0 ? "gespiegelt, also a &lt; 0; " : ""}${size === 1 ? "so weit wie die Normalparabel" : `Faktor ${fmt(size)}`}, also a = ${fmt(a)}.`,
              `Verschiebung: Der Scheitelpunkt wandert von S(0 | 0) nach S(${fmt(xs)} | ${fmt(ys)}).`,
              `<strong>y = ${vertexForm(a, xs, ys)}</strong>`,
            ],
            meta: { a, xs, ys },
          };
        }
        const [a, xs, ys] = rng.pick(FOUNTAINS);
        const c = round(a * xs * xs + ys, 2);
        const equation = `y = ${vertexForm(a, xs, ys)}`;
        return {
          prompt: `Der Wasserstrahl eines Springbrunnens verläuft auf der Parabel p: ${equation} (x: waagrechte Entfernung von der Düse, y: Höhe über der Wasseroberfläche, beides in m). Die Düse liegt bei x = 0. Wie hoch steigt der Strahl, in welcher Entfernung von der Düse ist er am höchsten, und in welcher Höhe tritt er aus der Düse aus?`,
          given: [`p: ${equation}`, "Düse bei x = 0"],
          fields: [
            numberField("größte Höhe:", ys, "m", 2),
            numberField("Entfernung des höchsten Punkts:", xs, "m", 2),
            numberField("Höhe der Düse:", c, "m", 2, {
              slips: [
                { value: ys - a * xs * xs, hint: "(0 − x_S)² ist positiv: Beim Quadrieren fällt das Minus weg." },
                { value: ys, hint: "y_S ist die größte Höhe. Für die Düse setzt du x = 0 ein." },
              ],
            }),
          ],
          steps: [
            `Scheitelpunktsform: S(${fmt(xs)} | ${fmt(ys)}). Wegen a = ${fmt(a)} &lt; 0 ist S der höchste Punkt des Strahls.`,
            `Düse: x = 0 einsetzen: y = ${fmt(a)} · (0 − ${fmt(xs)})² + ${fmt(ys)} = ${fmt(a)} · ${fmt(xs * xs)} + ${fmt(ys)} = ${fmt(c)}`,
            `<strong>Der Strahl steigt ${fmt(ys)} m hoch, ${fmt(xs)} m von der Düse entfernt; die Düse liegt ${fmt(c)} m über dem Wasser.</strong>`,
          ],
          meta: { a, xs, ys, c },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du liest aus beiden Formen der Parabelgleichung Scheitelpunkt, Öffnung, Form und y-Achsenabschnitt ab.",
};

// 7.2 Scheitelpunktsform und allgemeine Form ─────────────────────────────────

/** The steps of completing the square for y = a·x² + b·x + c with the vertex S(xs | ys), xs ≠ 0. */
function completionSteps(a: number, xs: number, ys: number): string[] {
  const p = -2 * xs;
  const q = xs * xs;
  const c = a * xs * xs + ys;
  if (a === 1) {
    return [
      `Ergänzen und wieder abziehen: (${fmt(p)} : 2)² = ${fmt(q)}, also y = ${quadratic(1, p, 0)} + ${fmt(q)} − ${fmt(q)}${plus(c)}`,
      `Binomische Formel: y = ${square(xs)} − ${fmt(q)}${plus(c)} = ${vertexForm(1, xs, ys)}`,
    ];
  }
  return [
    `a ausklammern: y = ${factor(a)}[${quadratic(1, p, 0)}]${plus(c)}`,
    `Ergänzen und wieder abziehen: (${fmt(p)} : 2)² = ${fmt(q)}, also y = ${factor(a)}[${quadratic(1, p, 0)} + ${fmt(q)} − ${fmt(q)}]${plus(c)}`,
    `Binomische Formel: y = ${factor(a)}[${square(xs)} − ${fmt(q)}]${plus(c)}`,
    `Eckige Klammer auflösen: y = ${vertexForm(a, xs, 0)}${plus(-a * q)}${plus(c)} = ${vertexForm(a, xs, ys)}`,
  ];
}

const scheitelpunkt: Lesson = {
  id: "qf-2-scheitelpunkt",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "7.2 Scheitelpunktsform und allgemeine Form",
  subtitle: "Quadratische Ergänzung, Wertemenge, Graph",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, Wechsel zwischen allgemeiner Form und Scheitelpunktsform, Scheitelpunkt, Definitions- und Wertemenge`,
  whyItMatters:
    "Die Scheitelpunktsform zeigt den höchsten oder tiefsten Punkt, die allgemeine Form den Schnitt mit der y-Achse. Mit Ausmultiplizieren und quadratischer Ergänzung wechselst du zwischen beiden und nimmst die Form, die die Frage am schnellsten beantwortet.",
  explanationHtml: `
    <p>Jede Parabel lässt sich in beiden Formen schreiben. Welche du brauchst, hängt von der Frage ab:</p>
    <ul>
      <li><strong>Scheitelpunktsform</strong> y = a(x − x<sub>S</sub>)² + y<sub>S</sub>: Scheitelpunkt, Wertemenge, Zeichnen.</li>
      <li><strong>allgemeine Form</strong> y = ax² + bx + c: Schnittpunkt (0 | c) mit der y-Achse, Funktionswerte, später die Lösungsformel.</li>
    </ul>
    <p><strong>Scheitelpunktsform → allgemeine Form:</strong> mit der binomischen Formel ausmultiplizieren: y = 2(x − 3)² − 11 = 2(x² − 6x + 9) − 11 = 2x² − 12x + 7.</p>
    <p><strong>Allgemeine Form → Scheitelpunktsform</strong> mit der <strong>quadratischen Ergänzung</strong>:</p>
    <ol class="steps">
      <li><strong>a ausklammern</strong>, nur aus den Gliedern mit x: y = 2x² − 12x + 7 = 2[x² − 6x] + 7</li>
      <li><strong>Ergänzen und wieder abziehen</strong>, und zwar das Quadrat der halben Zahl vor x: (−6 : 2)² = 9, also y = 2[x² − 6x + 9 − 9] + 7</li>
      <li><strong>Binomische Formel:</strong> y = 2[(x − 3)² − 9] + 7</li>
      <li><strong>Eckige Klammer auflösen</strong> und zusammenfassen: y = 2(x − 3)² − 18 + 7 = 2(x − 3)² − 11, also S(3 | −11).</li>
    </ol>
    <p>Zur Kontrolle: x<sub>S</sub> = −b : (2a) = 12 : 4 = 3 und y<sub>S</sub> = 2 · 3² − 12 · 3 + 7 = −11.</p>
    <p><strong>Definitions- und Wertemenge:</strong> Für x darfst du jede Zahl einsetzen, also 𝔻 = ℝ. Der Scheitelpunkt ist der tiefste Punkt (a &gt; 0) oder der höchste Punkt (a &lt; 0), also 𝕎 = {y | y ≥ y<sub>S</sub>} bzw. 𝕎 = {y | y ≤ y<sub>S</sub>}. Ist 𝔻 eingeschränkt, prüfst du zusätzlich die Funktionswerte an den Rändern.</p>
    <p><strong>Zeichnen:</strong> Scheitelpunkt eintragen, Symmetrieachse x = x<sub>S</sub> dazu, dann vom Scheitel aus die Schablone: 1 nach rechts und a nach oben, 2 nach rechts und 4a nach oben; links davon spiegelbildlich. Oder eine Wertetabelle mit x-Werten rechts und links von x<sub>S</sub>.</p>
    <div class="example">y = −x² + 5x − 4 = −[x² − 5x] − 4 = −[x² − 5x + 6,25 − 6,25] − 4 = −[(x − 2,5)² − 6,25] − 4 = −(x − 2,5)² + 2,25. Scheitelpunkt S(2,5 | 2,25), nach unten geöffnet, 𝔻 = ℝ, 𝕎 = {y | y ≤ 2,25}.</div>
    <div class="merke"><strong>Merke:</strong> Ausklammern, halbieren, quadrieren, ergänzen und wieder abziehen. Beim Auflösen der eckigen Klammer wird die abgezogene Ergänzung mit a malgenommen.</div>
  `,
  formulas: [
    { name: "Quadratische Ergänzung", html: "x² + px = (x + p : 2)² − (p : 2)²", quantities: "binomische Formel rückwärts" },
    { name: "Scheitelpunkt aus der allgemeinen Form", html: "x<sub>S</sub> = −b : (2a), y<sub>S</sub> = a · x<sub>S</sub>² + b · x<sub>S</sub> + c", quantities: "zur Kontrolle der quadratischen Ergänzung" },
    { name: "Definitions- und Wertemenge", html: "𝔻 = ℝ; a &gt; 0: 𝕎 = {y | y ≥ y<sub>S</sub>}, a &lt; 0: 𝕎 = {y | y ≤ y<sub>S</sub>}", quantities: "für G = ℝ × ℝ" },
  ],
  quiz: {
    question: "Welche Wertemenge hat die Parabel y = −2(x − 1)² + 3?",
    options: ["𝕎 = {y | y ≤ 3}", "𝕎 = {y | y ≥ 3}", "𝕎 = ℝ", "𝕎 = {y | y ≤ 1}"],
    correctIndex: 0,
    explanation: "a = −2 < 0: Die Parabel ist nach unten geöffnet, ihr Scheitelpunkt S(1 | 3) ist der höchste Punkt. Alle Funktionswerte sind höchstens 3.",
  },
  lab: {
    kind: "completing-square",
    title: "Labor: Die quadratische Ergänzung",
    intro:
      "Die Kacheln zeigen die Klammer x² + px. Ziehe die Ecke des violetten Eckquadrats, bis es genau in die Lücke passt: Seine Seite ist dann p : 2. Rechts entsteht Schritt für Schritt die Scheitelpunktsform und der Rückweg durch Ausmultiplizieren.",
    params: [
      { type: "choice", key: "a", label: "Faktor a", options: [1, 2, -1, -2, 0.5, -0.5].map((a) => ({ value: a, label: `a = ${fmt(a)}` })), value: 1 },
      { type: "range", key: "p", label: "Zahl p in der Klammer x² + px", unit: "", min: -8, max: 8, step: 1, value: 4 },
      { type: "range", key: "c", label: "Konstante c", unit: "", min: -10, max: 10, step: 1, value: 0 },
      { type: "range", key: "s", label: "Seite des Eckquadrats", unit: "", min: 0, max: 5, step: 0.5, value: 0, digits: 1 },
    ],
    readouts: [
      {
        key: "fits",
        label: "Eckquadrat",
        compute: (v) => (completionFits(v) ? (v.p === 0 ? "nicht nötig" : `passt genau: (${fmt(Math.abs(v.p))} : 2)² = ${fmt(v.s * v.s)}`) : v.s < Math.abs(v.p) / 2 ? "zu klein" : "zu groß"),
      },
      {
        key: "vertex",
        label: "Scheitelpunktsform",
        emphasis: true,
        compute: (v) => {
          if (!completionFits(v)) return "erst ergänzen";
          const { xs, ys } = completedVertex(v);
          return `y = ${vertexForm(v.a, xs, ys)}`;
        },
      },
      {
        key: "S",
        label: "Scheitelpunkt",
        compute: (v) => {
          if (!completionFits(v)) return "–";
          const { xs, ys } = completedVertex(v);
          return `S${point(xs, ys)}`;
        },
      },
      {
        key: "W",
        label: "Wertemenge",
        compute: (v) => (completionFits(v) ? `𝕎 = {y | y ${v.a > 0 ? "≥" : "≤"} ${fmt(completedVertex(v).ys)}}` : "–"),
      },
    ],
    goals: [
      { id: "normalform", text: "Bringe y = x² − 6x + 5 in die Scheitelpunktsform.", check: (v) => v.a === 1 && v.p === -6 && v.c === 5 && completionFits(v) },
      { id: "ausklammern", text: "Bringe y = 2x² + 8x + 3 in die Scheitelpunktsform: Klammere zuerst 2 aus.", check: (v) => v.a === 2 && v.p === 4 && v.c === 3 && completionFits(v) },
      { id: "wertemenge", text: "Bestimme Scheitelpunkt und Wertemenge von y = −x² + 5x − 4.", check: (v) => v.a === -1 && v.p === -5 && v.c === -4 && completionFits(v) },
    ],
  },
  exercises: [
    {
      id: "ergaenzen",
      make: (rng, level): ExerciseTask => {
        const a = level === 1 ? rng.pick([1, 1, 2, -1, 3, -2, 0.5]) : rng.pick([0.5, -0.5, 0.25, -0.25, 2, -2, 1.5, -1.5]);
        const xs = nonZero(rng, 5);
        const ys = level === 1 ? rng.int(-9, 9) : rng.stepped(-6, 6, 0.5);
        const b = -2 * a * xs;
        const c = a * xs * xs + ys;
        const equation = `y = ${quadratic(a, b, c)}`;
        const fieldX = numberField("x<sub>S</sub> =", xs, "", 2, { slips: [{ value: -xs, hint: "In der Klammer steht (x − x_S): Bei (x + 2)² ist x_S = −2." }] });
        const fieldY = numberField("y<sub>S</sub> =", ys, "", 2, {
          slips: [
            { value: c - xs * xs, hint: "Nach dem Ausklammern wird die Ergänzung mit a malgenommen, bevor du sie abziehst." },
            { value: c + a * xs * xs, hint: "Die Ergänzung wird wieder abgezogen, nicht addiert." },
          ],
        });
        if (level === 1) {
          return {
            prompt: `Bringe ${equation} mit quadratischer Ergänzung in die Scheitelpunktsform und gib den Scheitelpunkt S an.`,
            given: [equation],
            formulaHint: `y = a[x² + ${frac("b", "a")}x] + c, dann (${frac("b", "2a")})² in der Klammer ergänzen und wieder abziehen`,
            fields: [fieldX, fieldY],
            steps: [...completionSteps(a, xs, ys), `<strong>S(${fmt(xs)} | ${fmt(ys)})</strong>`],
            meta: { a, b, c, xs, ys },
          };
        }
        return {
          prompt: `Die Parabel p hat die Gleichung ${equation} mit G = ℝ × ℝ. Berechne die Koordinaten des Scheitelpunkts S und gib die Wertemenge von p an.`,
          given: [`p: ${equation}`, "G = ℝ × ℝ"],
          fields: [fieldX, fieldY, choiceField("Wertemenge", [`𝕎 = {y | y ≥ ${fmt(ys)}}`, `𝕎 = {y | y ≤ ${fmt(ys)}}`, "𝕎 = ℝ"], a > 0 ? 0 : 1)],
          steps: [
            ...completionSteps(a, xs, ys),
            a > 0 ? "a &gt; 0: Die Parabel ist nach oben geöffnet, S ist der tiefste Punkt." : "a &lt; 0: Die Parabel ist nach unten geöffnet, S ist der höchste Punkt.",
            `<strong>S(${fmt(xs)} | ${fmt(ys)}), 𝕎 = {y | y ${a > 0 ? "≥" : "≤"} ${fmt(ys)}}</strong>`,
          ],
          meta: { a, b, c, xs, ys },
        };
      },
    },
    {
      id: "allgemeine-form",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 2, -1, 3, -2, 0.5, -0.5]);
          const xs = nonZero(rng, 6);
          const ys = rng.int(-9, 9);
          const b = -2 * a * xs;
          const c = a * xs * xs + ys;
          const binomial = quadratic(1, -2 * xs, xs * xs);
          return {
            prompt: `Forme die Scheitelpunktsform y = ${vertexForm(a, xs, ys)} in die allgemeine Form y = ax² + bx + c um. Wie heißen b und c?`,
            given: [`y = ${vertexForm(a, xs, ys)}`],
            formulaHint: "(x − x<sub>S</sub>)² = x² − 2x<sub>S</sub> · x + x<sub>S</sub>² (binomische Formel), dann mit a malnehmen und y<sub>S</sub> addieren",
            fields: [
              numberField("b =", b, "", 2, { slips: [{ value: -b, hint: "Vorzeichen: (x − 3)² = x² − 6x + 9, (x + 3)² = x² + 6x + 9." }, { value: -2 * xs, hint: "Auch das x-Glied wird mit a malgenommen." }] }),
              numberField("c =", c, "", 2, { slips: [{ value: xs * xs + ys, hint: "Auch x_S² wird mit a malgenommen, bevor du y_S addierst." }] }),
            ],
            steps: [
              `Binomische Formel: ${square(xs)} = ${binomial}`,
              a === 1 ? `y = ${binomial}${plus(ys)}` : `Mit a malnehmen: y = ${factor(a)}(${binomial})${plus(ys)} = ${quadratic(a, b, a * xs * xs)}${plus(ys)}`,
              `<strong>y = ${quadratic(a, b, c)}, also b = ${fmt(b)} und c = ${fmt(c)}</strong>`,
            ],
            meta: { a, xs, ys },
          };
        }
        const a = rng.pick([0.5, 1, 2, -0.5, -1, -2, 0.25, -0.25]);
        const xs = rng.int(-4, 4);
        const k = rng.int(1, 5);
        const ys = -a * k * k;
        const b = -2 * a * xs;
        const c = a * xs * xs + ys;
        const equation = vertexForm(a, xs, ys);
        return {
          prompt: `Gegeben ist die Parabel p: y = ${equation}. Berechne die Nullstellen von p und den Schnittpunkt von p mit der y-Achse. Nutze jeweils die Form, mit der es am schnellsten geht.`,
          given: [`p: y = ${equation}`],
          anyOrder: [0, 1],
          fields: [
            numberField("x₁ =", xs - k, "", 2),
            numberField("x₂ =", xs + k, "", 2),
            numberField("Schnittpunkt mit der y-Achse: y =", c, "", 2, { slips: [{ value: ys, hint: "Der Scheitelpunkt liegt nicht auf der y-Achse: Setze x = 0 ein oder lies c aus der allgemeinen Form ab." }] }),
          ],
          steps: [
            `Nullstellen mit der Scheitelpunktsform: ${equation} = 0 ⇒ ${vertexForm(a, xs, 0)} = ${fmt(-ys)} ⇒ ${square(xs)} = ${k * k}`,
            `${inside(xs)} = −${k} oder ${inside(xs)} = ${k}, also x₁ = ${fmt(xs - k)} und x₂ = ${fmt(xs + k)}`,
            `Schnittpunkt mit der y-Achse aus der allgemeinen Form: y = ${quadratic(a, b, c)}, also (0 | ${fmt(c)})`,
            `<strong>x₁ = ${fmt(xs - k)}, x₂ = ${fmt(xs + k)}; Schnittpunkt mit der y-Achse (0 | ${fmt(c)})</strong>`,
          ],
          meta: { a, xs, ys, k },
        };
      },
    },
    {
      id: "wertemenge",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 2, -1, -3, 0.5, -0.5, 3, -2]);
          const xs = nonZero(rng, 6);
          const ys = rng.int(-9, 9);
          const equation = vertexForm(a, xs, ys);
          const domains = rng.shuffle(["ℝ", `{x | x ≥ ${fmt(xs)}}`, `{x | x ≤ ${fmt(xs)}}`]);
          return {
            prompt: `Gib die Definitionsmenge und die Wertemenge der Funktion f: y = ${equation} mit G = ℝ × ℝ an.`,
            given: [`f: y = ${equation}`, "G = ℝ × ℝ"],
            formulaHint: "𝔻 = ℝ; a &gt; 0: 𝕎 = {y | y ≥ y<sub>S</sub>}; a &lt; 0: 𝕎 = {y | y ≤ y<sub>S</sub>}",
            fields: [
              choiceField("𝔻 =", domains, domains.indexOf("ℝ")),
              numberField("Grenze der Wertemenge: y<sub>S</sub> =", ys, "", 2, { slips: [{ value: xs, hint: "Die Grenze der Wertemenge ist ein y-Wert: die y-Koordinate des Scheitelpunkts." }] }),
              choiceField("𝕎 = {y | y … y<sub>S</sub>}", ["≥", "≤", "jedes y (𝕎 = ℝ)"], a > 0 ? 0 : 1),
            ],
            steps: [
              "Für x darfst du jede Zahl einsetzen: 𝔻 = ℝ.",
              `S(${fmt(xs)} | ${fmt(ys)}); a = ${fmt(a)} ${a > 0 ? "&gt; 0: nach oben geöffnet, S ist der tiefste Punkt" : "&lt; 0: nach unten geöffnet, S ist der höchste Punkt"}.`,
              `<strong>𝔻 = ℝ, 𝕎 = {y | y ${a > 0 ? "≥" : "≤"} ${fmt(ys)}}</strong>`,
            ],
            meta: { a, xs, ys },
          };
        }
        const a = rng.pick([1, 0.5, 2, -1, -0.5, -2]);
        const xs = rng.int(-3, 3);
        const ys = rng.int(-6, 6);
        const left = xs - rng.int(1, 4);
        const right = xs + rng.int(1, 4);
        const f = (x: number) => a * (x - xs) ** 2 + ys;
        const atLeft = f(left);
        const atRight = f(right);
        const low = a > 0 ? ys : Math.min(atLeft, atRight);
        const high = a > 0 ? Math.max(atLeft, atRight) : ys;
        const equation = vertexForm(a, xs, ys);
        const domain = `𝔻 = {x | ${fmt(left)} ≤ x ≤ ${fmt(right)}}`;
        return {
          prompt: `Die Funktion f: y = ${equation} ist nur für ${fmt(left)} ≤ x ≤ ${fmt(right)} definiert, also ${domain}. Bestimme ihre Wertemenge 𝕎 = {y | y<sub>min</sub> ≤ y ≤ y<sub>max</sub>}.`,
          given: [`f: y = ${equation}`, domain],
          fields: [
            numberField("y<sub>min</sub> =", low, "", 2, a > 0 ? { slips: [{ value: Math.min(atLeft, atRight), hint: "Der Scheitelpunkt liegt in 𝔻: Der kleinste Wert ist y_S, nicht ein Randwert." }] } : {}),
            numberField("y<sub>max</sub> =", high, "", 2, a < 0 ? { slips: [{ value: Math.max(atLeft, atRight), hint: "Der Scheitelpunkt liegt in 𝔻: Der größte Wert ist y_S, nicht ein Randwert." }] } : {}),
          ],
          steps: [
            `S(${fmt(xs)} | ${fmt(ys)}) liegt in 𝔻. ${a > 0 ? "a &gt; 0: S ist der tiefste Punkt." : "a &lt; 0: S ist der höchste Punkt."}`,
            `Werte an den Rändern: f(${fmt(left)}) = ${fmt(atLeft)}, f(${fmt(right)}) = ${fmt(atRight)}`,
            `<strong>𝕎 = {y | ${fmt(low)} ≤ y ≤ ${fmt(high)}}</strong>`,
          ],
          meta: { a, xs, ys, left, right },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wechselst mit Ausmultiplizieren und quadratischer Ergänzung zwischen den Formen und bestimmst Scheitelpunkt und Wertemenge.",
};

// 7.3 Parabelgleichungen bestimmen ───────────────────────────────────────────

/** Arches [width, height] in m whose factor a = −h : (w : 2)² and heights stay two-decimal numbers. */
const ARCHES: Array<[number, number]> = [
  [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
  [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
  [8, 4],
  [10, 2], [10, 3], [10, 4], [10, 5], [10, 6],
];

/** The steps for b and c of y = a·x² + b·x + c through (x1 | y1) and (x2 | y2), x1 < x2. */
function systemSteps(a: number, b: number, c: number, x1: number, y1: number, x2: number, y2: number): string[] {
  return [
    `Beide Punkte einsetzen: (I) ${fmt(y1)} = ${fmt(a * x1 * x1)}${term(x1, "b", false)} + c`,
    `(II) ${fmt(y2)} = ${fmt(a * x2 * x2)}${term(x2, "b", false)} + c`,
    `(II) − (I): ${fmt(y2 - y1)} = ${fmt(a * (x2 * x2 - x1 * x1))}${term(x2 - x1, "b", false)}, also b = ${fmt(b)}`,
    `b in (I) einsetzen: ${fmt(y1)} = ${fmt(a * x1 * x1)}${plus(b * x1)} + c, also c = ${fmt(c)}`,
  ];
}

/** A small graph of a parabola for a task, with marked grid points. */
function taskGraph(f: (x: number) => number, points: Array<{ x: number; y: number; name: string }>): string {
  const plot = new Plot(-6, 6, -6, 6, { x: 10, y: 10, w: 240, h: 240 });
  let out = `<svg class="lab-svg" viewBox="0 0 260 260" role="img" aria-label="Graph einer Parabel im Koordinatensystem" style="max-width: 260px; margin: 0.6rem 0">`;
  out += plot.clip("clip-task-graph") + plot.grid(1, 2);
  out += clipped("clip-task-graph", plot.graph(f, "lab-curve"));
  for (const marked of points) {
    const P = plot.P(marked.x, marked.y);
    out += circle(P.x, P.y, 5, "lab-point-b");
    if (marked.name) out += text(P.x + 8, P.y - 8, marked.name, "lab-text lab-text-b");
  }
  return `${out}</svg>`;
}

const bestimmungsstuecke: Lesson = {
  id: "qf-3-bestimmungsstuecke",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "7.3 Parabelgleichungen bestimmen",
  subtitle: "Scheitel und Punkt, a und zwei Punkte, Graph",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, Gleichungen quadratischer Funktionen aus Bestimmungsstücken und Graphen`,
  whyItMatters:
    "In der Abschlussprüfung ist oft eine Parabel durch zwei Punkte mit gegebenem a gesucht. Mit dem richtigen Ansatz wird daraus ein lineares Gleichungssystem, das du schon lösen kannst.",
  explanationHtml: `
    <p>Eine Parabel ist durch passende <strong>Bestimmungsstücke</strong> festgelegt. Wähle die Form, in der am wenigsten unbekannt ist.</p>
    <p><strong>1. Scheitelpunkt und ein weiterer Punkt:</strong> Scheitelpunktsform ansetzen, dann fehlt nur a. Für S(1 | −2) und P(3 | 6): y = a(x − 1)² − 2. P einsetzen: 6 = a · 2² − 2, also 4a = 8 und a = 2. Ergebnis: y = 2(x − 1)² − 2.</p>
    <p><strong>2. a und zwei Punkte:</strong> In y = ax² + bx + c fehlen b und c. Setzt du beide Punkte ein, entsteht ein <strong>lineares Gleichungssystem</strong>, das du wie in der 9. Klasse löst, etwa mit dem Additionsverfahren.</p>
    <div class="example">y = −0,5x² + bx + c durch P(−2 | 0) und Q(4 | 0):<br>(I) 0 = −2 − 2b + c<br>(II) 0 = −8 + 4b + c<br>(II) − (I): 0 = −6 + 6b, also b = 1; in (I): 0 = −2 − 2 + c, also c = 4.<br>Ergebnis: y = −0,5x² + x + 4.</div>
    <p><strong>3. Aus dem Graphen:</strong> Lies den Scheitelpunkt und einen gut ablesbaren Gitterpunkt ab und rechne wie bei 1. Mit der Schablone geht es oft im Kopf: Steigt die Parabel vom Scheitel aus 1 nach rechts um 3, ist a = 3; sinkt sie 2 nach rechts um 2, ist a = −2 : 2² = −0,5.</p>
    <div class="merke"><strong>Merke:</strong> Scheitelpunkt bekannt → Scheitelpunktsform, nur a fehlt. a bekannt → allgemeine Form, b und c aus zwei Gleichungen. Zur Probe die Punkte in die fertige Gleichung einsetzen.</div>
  `,
  formulas: [
    { name: "Scheitelpunkt und Punkt", html: `a = ${frac("y<sub>P</sub> − y<sub>S</sub>", "(x<sub>P</sub> − x<sub>S</sub>)²")}`, quantities: "aus y = a(x − x_S)² + y_S mit P eingesetzt" },
    { name: "a und zwei Punkte", html: "P und Q in y = ax² + bx + c einsetzen", quantities: "lineares Gleichungssystem für b und c" },
  ],
  quiz: {
    question: "Eine Parabel hat den Scheitelpunkt S(0 | 2) und geht durch P(2 | 4). Wie groß ist a?",
    options: ["a = 0,5", "a = 1", "a = 2"],
    correctIndex: 0,
    explanation: "y = a · x² + 2 mit P: 4 = a · 2² + 2, also 4a = 2 und a = 0,5. (x_P − x_S) wird quadriert.",
  },
  lab: {
    kind: "parabola-fit",
    title: "Labor: Die Parabel durch die Punkte",
    intro:
      "Wähle, was gegeben ist: Scheitelpunkt und Punkt, oder a und zwei Punkte. Ziehe die Punkte; die Parabel, die Rechnung und die Gleichung passen sich an.",
    params: [
      { type: "choice", key: "mode", label: "Gegeben", options: [{ value: 0, label: "Scheitelpunkt und ein Punkt" }, { value: 1, label: "a und zwei Punkte" }], value: 0 },
      { type: "choice", key: "a", label: "Formfaktor a", options: [-2, -1, -0.5, 0.5, 1, 2].map((a) => ({ value: a, label: `a = ${fmt(a)}` })), value: 1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "xs", label: "Scheitelpunkt S: x", unit: "", min: -5, max: 5, step: 0.5, value: 0, digits: 1, showIf: (v) => v.mode === 0 },
      { type: "range", key: "ys", label: "Scheitelpunkt S: y", unit: "", min: -4, max: 5, step: 0.5, value: 0, digits: 1, showIf: (v) => v.mode === 0 },
      { type: "range", key: "xp", label: "Punkt P: x", unit: "", min: -6, max: 6, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "yp", label: "Punkt P: y", unit: "", min: -4, max: 5, step: 0.5, value: 2, digits: 1 },
      { type: "range", key: "xq", label: "Punkt Q: x", unit: "", min: -6, max: 6, step: 0.5, value: -2, digits: 1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "yq", label: "Punkt Q: y", unit: "", min: -4, max: 5, step: 0.5, value: 1, digits: 1, showIf: (v) => v.mode === 1 },
    ],
    readouts: [
      {
        key: "vertexForm",
        label: "Scheitelpunktsform",
        emphasis: true,
        compute: (v) => {
          const fit = fitParabola(v);
          if (!fit.ok) return fit.reason;
          const S = vertexOf(fit.a, fit.b, fit.c);
          const exact = [fit.a, S.x, S.y].every((value) => rel(value, 3) === "=");
          return `y ${exact ? "=" : "≈"} ${vertexForm(fit.a, S.x, S.y, 3)}`;
        },
      },
      {
        key: "general",
        label: "allgemeine Form",
        compute: (v) => {
          const fit = fitParabola(v);
          if (!fit.ok) return "–";
          const exact = [fit.a, fit.b, fit.c].every((value) => rel(value, 3) === "=");
          return `y ${exact ? "=" : "≈"} ${quadratic(fit.a, fit.b, fit.c, 3)}`;
        },
      },
      {
        key: "S",
        label: "Scheitelpunkt",
        compute: (v) => {
          const fit = fitParabola(v);
          if (!fit.ok) return "–";
          const S = vertexOf(fit.a, fit.b, fit.c);
          return `S${pointText(S.x, S.y)}`;
        },
      },
    ],
    goals: [
      {
        id: "bogen",
        text: "Torbogen: Lege den Scheitelpunkt auf S(0 | 4) und die Parabel durch den Fußpunkt (4 | 0).",
        check: (v) => {
          const fit = fitParabola(v);
          return v.mode === 0 && v.xs === 0 && v.ys === 4 && fit.ok && Math.abs(fit.a + 0.25) < 1e-9;
        },
      },
      {
        id: "nullstellen",
        text: "Mit a = −0,5: Erzeuge die Parabel mit den Nullstellen −2 und 4.",
        check: (v) => {
          const fit = fitParabola(v);
          return v.mode === 1 && v.a === -0.5 && fit.ok && Math.abs(fit.b - 1) < 1e-9 && Math.abs(fit.c - 4) < 1e-9;
        },
      },
      {
        id: "y-achse",
        text: "Mit a = 2: Die Parabel soll die y-Achse bei y = 1 schneiden und durch den Punkt (1 | −1) gehen.",
        check: (v) => {
          const fit = fitParabola(v);
          return v.mode === 1 && v.a === 2 && fit.ok && Math.abs(fit.b + 4) < 1e-9 && Math.abs(fit.c - 1) < 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "scheitel-punkt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([-3, -2, -1, -0.5, -0.25, 0.25, 0.5, 1, 2, 3]);
          const xs = rng.int(-4, 4);
          const ys = rng.int(-5, 5);
          const k = Math.abs(a) < 1 ? rng.pick([-4, -2, 2, 4]) : nonZero(rng, 3);
          const xp = xs + k;
          const yp = ys + a * k * k;
          return {
            prompt: `Eine Parabel hat den Scheitelpunkt S(${fmt(xs)} | ${fmt(ys)}) und verläuft durch den Punkt P(${fmt(xp)} | ${fmt(yp)}). Bestimme den Formfaktor a ihrer Gleichung y = a(x − x<sub>S</sub>)² + y<sub>S</sub>.`,
            given: [`S(${fmt(xs)} | ${fmt(ys)})`, `P(${fmt(xp)} | ${fmt(yp)})`],
            formulaHint: "S in y = a(x − x<sub>S</sub>)² + y<sub>S</sub> einsetzen, dann P einsetzen und nach a auflösen",
            fields: [
              numberField("a =", a, "", 2, {
                slips: [
                  { value: (yp - ys) / k, hint: "In der Scheitelpunktsform wird (x_P − x_S) quadriert." },
                  { value: (yp + ys) / (k * k), hint: "Vorzeichen: y_S kommt beim Auflösen mit umgekehrtem Vorzeichen auf die andere Seite." },
                ],
              }),
            ],
            steps: [
              `S einsetzen: y = a · ${square(xs)}${plus(ys)}`,
              `P einsetzen: ${fmt(yp)} = a · (${fmt(xp)} − ${paren(xs)})²${plus(ys)} = ${fmt(k * k)}a${plus(ys)}`,
              `${fmt(yp - ys)} = ${fmt(k * k)}a, also <strong>a = ${fmt(a)} und y = ${vertexForm(a, xs, ys)}</strong>`,
            ],
            meta: { a, xs, ys, xp, yp },
          };
        }
        if (rng.next() < 0.5) {
          const [w, h] = rng.pick(ARCHES);
          const half = w / 2;
          const a = -h / (half * half);
          const x = half - 1;
          const height = a * x * x + h;
          return {
            prompt: `Ein parabelförmiger Torbogen ist am Boden ${fmt(w)} m breit und ${fmt(h)} m hoch. Lege das Koordinatensystem so, dass der Boden auf der x-Achse und der höchste Punkt auf der y-Achse liegt. Bestimme a in der Gleichung y = ax² + ${fmt(h)} und berechne, wie hoch der Bogen 1 m vom Fußpunkt entfernt ist.`,
            given: [`Breite am Boden ${fmt(w)} m`, `Höhe ${fmt(h)} m`],
            fields: [
              numberField("a =", a, "", 2, {
                slips: [
                  { value: -h / (w * w), hint: `Die Fußpunkte liegen bei x = −${fmt(half)} und x = ${fmt(half)}, der halben Breite.` },
                  { value: h / (half * half), hint: "Der Bogen ist nach unten geöffnet: a ist negativ." },
                ],
              }),
              numberField("Höhe:", height, "m", 2),
            ],
            steps: [
              `Scheitelpunkt S(0 | ${fmt(h)}), Fußpunkte (−${fmt(half)} | 0) und (${fmt(half)} | 0): y = a · x² + ${fmt(h)}`,
              `Fußpunkt einsetzen: 0 = a · ${fmt(half)}² + ${fmt(h)}, also a = −${fmt(h)} : ${fmt(half * half)} = ${fmt(a)}`,
              `1 m vom Fußpunkt entfernt ist x = ${fmt(x)}: y = ${fmt(a)} · ${fmt(x)}² + ${fmt(h)} = ${fmt(height)}`,
              `<strong>a = ${fmt(a)}; 1 m vom Fußpunkt entfernt ist der Bogen ${fmt(height)} m hoch.</strong>`,
            ],
            meta: { w, h, a, height },
          };
        }
        const a = rng.pick([0.5, -0.5, 0.25, -0.25, 1, -1, 2, -2]);
        const xs = nonZero(rng, 4);
        const ys = rng.int(-5, 5);
        const k = Math.abs(a) < 1 ? rng.pick([-4, -2, 2, 4]) : nonZero(rng, 3);
        const xp = xs + k;
        const yp = ys + a * k * k;
        const b = -2 * a * xs;
        const c = a * xs * xs + ys;
        return {
          prompt: `Die Parabel p hat den Scheitelpunkt S(${fmt(xs)} | ${fmt(ys)}) und verläuft durch den Punkt P(${fmt(xp)} | ${fmt(yp)}). Bestimme die Gleichung von p in der allgemeinen Form y = ax² + bx + c.`,
          given: [`S(${fmt(xs)} | ${fmt(ys)})`, `P(${fmt(xp)} | ${fmt(yp)})`],
          fields: [
            numberField("a =", a, "", 2, { slips: [{ value: (yp - ys) / k, hint: "In der Scheitelpunktsform wird (x_P − x_S) quadriert." }] }),
            numberField("b =", b, "", 2, { slips: [{ value: -b, hint: "Vorzeichen: (x − 3)² = x² − 6x + 9." }] }),
            numberField("c =", c, "", 2, { slips: [{ value: xs * xs + ys, hint: "Beim Ausmultiplizieren wird auch x_S² mit a malgenommen." }] }),
          ],
          steps: [
            `y = a · ${square(xs)}${plus(ys)}; P einsetzen: ${fmt(yp)} = ${fmt(k * k)}a${plus(ys)}, also a = ${fmt(a)}`,
            `Ausmultiplizieren: y = ${factor(a)}(${quadratic(1, -2 * xs, xs * xs)})${plus(ys)} = ${quadratic(a, b, a * xs * xs)}${plus(ys)}`,
            `<strong>y = ${quadratic(a, b, c)}</strong>`,
          ],
          meta: { a, xs, ys, xp, yp },
        };
      },
    },
    {
      id: "zwei-punkte",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, -1, 0.5, -0.5, 2, -2]);
          const b = rng.int(-6, 6);
          const c = rng.int(-6, 6);
          const x1 = rng.int(-4, 3);
          const x2 = x1 + rng.int(1, 5);
          const y1 = a * x1 * x1 + b * x1 + c;
          const y2 = a * x2 * x2 + b * x2 + c;
          const form = `y = ${term(a, "x²", true)} + bx + c`;
          return {
            prompt: `Die Parabel p hat eine Gleichung der Form ${form} und verläuft durch die Punkte P(${fmt(x1)} | ${fmt(y1)}) und Q(${fmt(x2)} | ${fmt(y2)}). Berechne b und c.`,
            given: [form, `P(${fmt(x1)} | ${fmt(y1)})`, `Q(${fmt(x2)} | ${fmt(y2)})`],
            formulaHint: "P und Q einsetzen: zwei lineare Gleichungen für b und c; bei (II) − (I) fällt c weg",
            fields: [numberField("b =", b, "", 2), numberField("c =", c, "", 2)],
            steps: [...systemSteps(a, b, c, x1, y1, x2, y2), `<strong>y = ${quadratic(a, b, c)}</strong>`],
            meta: { a, b, c, x1, y1, x2, y2 },
          };
        }
        const a = rng.pick([0.25, -0.25, 0.5, -0.5]);
        const xs = rng.int(-4, 4);
        const ys = rng.int(-5, 5);
        const b = -2 * a * xs;
        const c = a * xs * xs + ys;
        const x1 = rng.int(-6, 2);
        const x2 = x1 + rng.int(2, 6);
        const y1 = a * x1 * x1 + b * x1 + c;
        const y2 = a * x2 * x2 + b * x2 + c;
        const form = `y = ${term(a, "x²", true)} + bx + c`;
        return {
          prompt: `Die Parabel p verläuft durch die Punkte P(${fmt(x1)} | ${fmt(y1)}) und Q(${fmt(x2)} | ${fmt(y2)}). Sie hat eine Gleichung der Form ${form} mit G = ℝ × ℝ und b, c ∈ ℝ. Berechne b und c und gib die Koordinaten des Scheitelpunkts S von p an.`,
          given: [`P(${fmt(x1)} | ${fmt(y1)})`, `Q(${fmt(x2)} | ${fmt(y2)})`, form],
          fields: [numberField("b =", b, "", 2), numberField("c =", c, "", 2), numberField("x<sub>S</sub> =", xs, "", 2), numberField("y<sub>S</sub> =", ys, "", 2)],
          steps: [
            ...systemSteps(a, b, c, x1, y1, x2, y2),
            `Scheitelpunkt mit quadratischer Ergänzung: y = ${quadratic(a, b, c)} = ${vertexForm(a, xs, ys)}`,
            `<strong>y = ${quadratic(a, b, c)}, S(${fmt(xs)} | ${fmt(ys)})</strong>`,
          ],
          meta: { a, b, c, x1, y1, x2, y2, xs, ys },
        };
      },
    },
    {
      id: "graph",
      make: (rng, level): ExerciseTask => {
        const a = rng.pick([1, -1, 0.5, -0.5, 2, -2]);
        const xs = rng.int(-3, 3);
        const ys = a > 0 ? rng.int(-4, 1) : rng.int(-1, 4);
        const k = Math.abs(a) === 0.5 ? 2 : Math.abs(a) === 2 ? 1 : rng.pick([1, 2]);
        const xp = xs + k * rng.sign();
        const yp = ys + a * k * k;
        const f = (x: number) => a * (x - xs) ** 2 + ys;
        const read = `Abgelesen: S(${fmt(xs)} | ${fmt(ys)}) und P(${fmt(xp)} | ${fmt(yp)})`;
        const factorStep = `a = (${fmt(yp)} − ${paren(ys)}) : (${fmt(xp)} − ${paren(xs)})² = ${fmt(yp - ys)} : ${fmt(k * k)} = ${fmt(a)}`;
        if (level === 1) {
          return {
            prompt: `Der Graph zeigt eine Parabel mit ihrem Scheitelpunkt S und einem weiteren Punkt P; beide liegen auf Gitterpunkten. Lies ihre Koordinaten ab und bestimme die Gleichung der Parabel in der Scheitelpunktsform y = a(x − x<sub>S</sub>)² + y<sub>S</sub>.${taskGraph(f, [{ x: xs, y: ys, name: "S" }, { x: xp, y: yp, name: "P" }])}`,
            given: ["Kästchenbreite: 1"],
            formulaHint: "S und P ablesen; a = (y<sub>P</sub> − y<sub>S</sub>) : (x<sub>P</sub> − x<sub>S</sub>)²",
            fields: [
              numberField("x<sub>S</sub> =", xs, "", 2),
              numberField("y<sub>S</sub> =", ys, "", 2),
              numberField("a =", a, "", 2, { slips: [{ value: -a, hint: "Öffnet sich die Parabel nach unten, ist a negativ." }] }),
            ],
            steps: [read, factorStep, `<strong>y = ${vertexForm(a, xs, ys)}</strong>`],
            meta: { a, xs, ys, xp, yp },
          };
        }
        const b = -2 * a * xs;
        const c = a * xs * xs + ys;
        return {
          prompt: `Der Graph zeigt eine Parabel; die beiden markierten Punkte liegen auf Gitterpunkten, einer davon ist der Scheitelpunkt. Bestimme die Gleichung der Parabel in der allgemeinen Form y = ax² + bx + c.${taskGraph(f, [{ x: xs, y: ys, name: "" }, { x: xp, y: yp, name: "" }])}`,
          given: ["Kästchenbreite: 1"],
          fields: [
            numberField("a =", a, "", 2, { slips: [{ value: -a, hint: "Öffnet sich die Parabel nach unten, ist a negativ." }] }),
            numberField("b =", b, "", 2),
            numberField("c =", c, "", 2, { slips: [{ value: ys, hint: "y_S ist der Scheitel. c ist der Schnittpunkt mit der y-Achse: Multipliziere aus." }] }),
          ],
          steps: [
            `${read}; der Scheitelpunkt ist der ${a > 0 ? "tiefste" : "höchste"} Punkt.`,
            `${factorStep}, also y = ${vertexForm(a, xs, ys)}`,
            `Ausmultiplizieren: y = ${xs === 0 ? quadratic(a, 0, ys) : `${factor(a)}(${quadratic(1, -2 * xs, xs * xs)})${plus(ys)}`}`,
            `<strong>y = ${quadratic(a, b, c)}</strong>`,
          ],
          meta: { a, xs, ys, xp, yp },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du stellst Parabelgleichungen aus Scheitelpunkt und Punkt, aus a und zwei Punkten und aus dem Graphen auf.",
};

// 7.4 Extremwertprobleme ─────────────────────────────────────────────────────

const FENCE_TEXT = [
  (L: number) => `Ein rechteckiges Beet soll an einer Hauswand mit ${L} m Zaun eingefasst werden; an der Wand braucht es keinen Zaun. x ist die Länge der beiden Seiten senkrecht zur Wand.`,
  (L: number) => `Ein rechteckiger Auslauf an einer Stallwand wird mit ${L} m Zaun eingefasst und durch ein Zaunstück senkrecht zur Wand in zwei Teile geteilt. x ist die Länge der drei Zaunstücke senkrecht zur Wand.`,
  (L: number) => `Ein rechteckiges Gehege wird ringsum mit ${L} m Zaun eingefasst. x ist die Länge einer Seite.`,
];

/** Rectangles [AB, BC] whose inner parallelograms have their smallest area at an integer x < BC. */
const RECTANGLES: Array<[number, number]> = [];
for (let w = 4; w <= 9; w++) {
  for (let l = w + 1; l < 3 * w && l <= 16; l++) {
    if ((l + w) % 4 === 0) RECTANGLES.push([l, w]);
  }
}

const extremwerte: Lesson = {
  id: "qf-4-extremwerte",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "7.4 Extremwertprobleme",
  subtitle: "Größter Inhalt, längste Strecke",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, Extremwertprobleme bei funktionalen Abhängigkeiten`,
  whyItMatters:
    "Mit einem festen Zaun die größte Fläche einzäunen oder in einer Figurenschar die längste Strecke finden: Solche Optimierungsaufgaben löst der Scheitelpunkt einer Parabel ganz ohne Ausprobieren.",
  explanationHtml: `
    <p>Viele Größen hängen quadratisch von einer Variablen x ab: ein Flächeninhalt, eine Streckenlänge, ein Gewinn. Ist der Term eine quadratische Funktion, liegt der größte oder kleinste Wert im <strong>Scheitelpunkt</strong>: bei a &lt; 0 ein Maximum, bei a &gt; 0 ein Minimum.</p>
    <ol class="steps">
      <li><strong>Zielgröße aufstellen:</strong> die Größe, die möglichst groß oder klein werden soll, mithilfe der Bedingung der Aufgabe als Term in x schreiben.</li>
      <li><strong>Definitionsmenge:</strong> Für welche x gibt es die Figur? Längen müssen positiv sein.</li>
      <li><strong>Scheitelpunkt</strong> mit quadratischer Ergänzung bestimmen und prüfen, ob x<sub>S</sub> in 𝔻 liegt.</li>
      <li><strong>Antwort</strong> im Sachzusammenhang: Für welches x, wie groß ist der Extremwert?</li>
    </ol>
    <div class="example">Mit 24 m Zaun wird an einer Mauer ein Rechteck eingezäunt. x ist die Seite senkrecht zur Mauer, y die Seite parallel dazu: 2x + y = 24, also y = 24 − 2x.<br>A(x) = x · (24 − 2x) = −2x² + 24x mit 𝔻 = {x | 0 &lt; x &lt; 12}.<br>A(x) = −2[x² − 12x + 36 − 36] = −2(x − 6)² + 72.<br>Für x = 6 m und y = 12 m wird die Fläche mit 72 m² am größten.</div>
    <p>Auch bei <strong>Figuren im Koordinatensystem</strong> entstehen quadratische Terme. Liegen P<sub>n</sub>(x | −0,5x² + 2x + 4) auf einer Parabel und Q<sub>n</sub>(x | 0,5x − 1) auf einer Geraden, so ist die Strecke [P<sub>n</sub>Q<sub>n</sub>] (−0,5x² + 1,5x + 5) LE = (−0,5(x − 1,5)² + 6,125) LE lang. Sie existiert für −2 &lt; x &lt; 5, wo die Parabel über der Geraden liegt, und ist für x = 1,5 mit 6,125 LE am längsten.</p>
    <div class="merke"><strong>Merke:</strong> Zielfunktion aufstellen, Definitionsmenge angeben, Scheitelpunkt bestimmen. Die y-Koordinate des Scheitelpunkts ist der Extremwert, die x-Koordinate sagt, wo er angenommen wird.</div>
  `,
  formulas: [
    { name: "Extremwert", html: "y = a(x − x<sub>S</sub>)² + y<sub>S</sub>: Extremwert y<sub>S</sub> bei x = x<sub>S</sub>", quantities: "a < 0 Maximum, a > 0 Minimum" },
    { name: "Rechteck an der Mauer", html: "2x + y = L ⇒ A(x) = x · (L − 2x), größte Fläche für x = L : 4", quantities: "L Zaunlänge, x Seite senkrecht zur Mauer" },
  ],
  quiz: {
    question: "Der Flächeninhalt eines Geheges ist A(x) = −2(x − 6)² + 72 (x in m, A in m²). Was gilt?",
    options: [
      "Für x = 6 m ist A mit 72 m² am größten.",
      "Für x = 72 m ist A mit 6 m² am größten.",
      "Für x = 6 m ist A mit 72 m² am kleinsten.",
    ],
    correctIndex: 0,
    explanation: "a = −2 < 0: Die Parabel ist nach unten geöffnet, ihr Scheitelpunkt S(6 | 72) ist der höchste Punkt. Also ist A_max = 72 m² bei x = 6 m.",
  },
  lab: {
    kind: "fence",
    title: "Labor: Das größte Gehege",
    intro:
      "Wähle Gehege und Zaunlänge und ziehe die Ecke des Geheges oder den Punkt auf dem Graphen. Rechts siehst du A(x) über der Definitionsmenge; der Scheitelpunkt ist das größte Gehege.",
    params: [
      {
        type: "choice",
        key: "mode",
        label: "Gehege",
        options: [
          { value: 0, label: "an der Mauer (3 Seiten)" },
          { value: 1, label: "an der Mauer mit Trennzaun" },
          { value: 2, label: "frei stehend (4 Seiten)" },
        ],
        value: 0,
      },
      { type: "choice", key: "L", label: "Zaunlänge", options: [24, 30, 36].map((n) => ({ value: n, label: `${n} m` })), value: 24 },
      { type: "range", key: "x", label: "Seite x", unit: "m", min: 0.5, max: 18, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "y", label: "andere Seite y", unit: "m", digits: 2, compute: (v) => Math.max(0, fenceSide(v)) },
      { key: "A", label: "Flächeninhalt A", unit: "m²", digits: 2, emphasis: true, compute: (v) => fenceArea(v) },
      { key: "D", label: "Definitionsmenge", compute: (v) => `𝔻 = {x | 0 < x < ${fmt(fenceModel(v.mode, v.L).xmax)}}` },
      {
        key: "vertex",
        label: "A(x) in Scheitelpunktsform",
        compute: (v) => {
          const { k, j, xBest, areaBest } = fenceModel(v.mode, v.L);
          return `A(x) = ${vertexForm(-k / j, xBest, areaBest)}`;
        },
      },
      { key: "best", label: "größtmöglicher Inhalt", unit: "m²", digits: 2, compute: (v) => fenceModel(v.mode, v.L).areaBest },
    ],
    goals: [
      { id: "mauer", text: "An der Mauer mit 30 m Zaun: Baue das größte Gehege.", check: (v) => v.mode === 0 && v.L === 30 && v.x === 7.5 },
      { id: "trennzaun", text: "An der Mauer mit Trennzaun und 36 m Zaun: Baue das größte Gehege.", check: (v) => v.mode === 1 && v.L === 36 && v.x === 6 },
      { id: "flaeche", text: "Frei stehend mit 24 m Zaun: Baue ein Gehege mit genau 32 m².", check: (v) => v.mode === 2 && v.L === 24 && Math.abs(fenceArea(v) - 32) < 1e-9 },
    ],
  },
  exercises: [
    {
      id: "gehege",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const mode = rng.int(0, 2);
          const L = rng.pick(mode === 1 ? [24, 30, 36, 42, 48] : [16, 20, 24, 28, 32, 40]);
          const { k, j, xmax, xBest, areaBest } = fenceModel(mode, L);
          const yBest = (L - k * xBest) / j;
          const rule = mode === 2 ? `2x + 2y = ${L}` : `${k}x + y = ${L}`;
          const side = mode === 2 ? `${fmt(L / 2)} − x` : `${L} − ${k}x`;
          return {
            prompt: `${FENCE_TEXT[mode](L)} Stelle den Flächeninhalt A(x) auf, gib die Definitionsmenge an und bestimme, für welches x die Fläche am größten wird.`,
            given: [`Zaunlänge ${L} m`, rule],
            formulaHint: `${rule} ⇒ y = ${side}; A(x) = x · (${side}); Scheitelpunkt mit quadratischer Ergänzung`,
            fields: [
              numberField("obere Grenze von 𝔻:", xmax, "m", 2),
              numberField("x =", xBest, "m", 2, { slips: [{ value: L / (k + j), hint: "Gleich lange Zaunstücke sind hier nicht das Beste: Der Scheitelpunkt von A(x) liegt in der Mitte zwischen den Nullstellen." }] }),
              numberField("A<sub>max</sub> =", areaBest, "m²", 2),
            ],
            steps: [
              `Bedingung: ${rule}, also y = ${side}`,
              `A(x) = x · (${side}) = ${quadratic(-k / j, L / j, 0)}; 𝔻 = {x | 0 &lt; x &lt; ${fmt(xmax)}}`,
              `A(x) = ${factor(-k / j)}[x² − ${fmt(L / k)}x + ${fmt(xBest * xBest)} − ${fmt(xBest * xBest)}] = ${vertexForm(-k / j, xBest, areaBest)}`,
              `<strong>x = ${fmt(xBest)} m und y = ${fmt(yBest)} m: A<sub>max</sub> = ${fmt(areaBest)} m²</strong>`,
            ],
            meta: { mode, L },
          };
        }
        const k = rng.pick([1, 2, 3]);
        const m = rng.int(2, 6);
        const w = k * m;
        const l = rng.int(m + 2, 14);
        const xBest = (l - m) / 2;
        const areaBest = k * ((l + m) / 2) ** 2;
        const grow = k === 1 ? "x" : `${k}x`;
        return {
          prompt: `Ein Rechteck ist ${l} cm lang und ${w} cm breit. Verkürzt man die Länge um x cm und verlängert gleichzeitig die Breite um ${grow} cm, entstehen neue Rechtecke. Gib den Flächeninhalt A(x) der neuen Rechtecke und die Definitionsmenge an. Für welchen Wert von x ist der Flächeninhalt am größten, und wie groß ist er dann?`,
          given: [`Länge ${l} cm, Breite ${w} cm`, `neue Länge (${l} − x) cm, neue Breite (${w} + ${grow}) cm`],
          fields: [
            numberField("obere Grenze von 𝔻:", l, "cm", 2),
            numberField("x =", xBest, "cm", 2, { slips: [{ value: l - m, hint: "Bei der quadratischen Ergänzung wird die Zahl vor x halbiert." }] }),
            numberField("A<sub>max</sub> =", areaBest, "cm²", 2, { slips: [{ value: l * w, hint: "Das ist das Ausgangsrechteck (x = 0). Gesucht ist der Wert im Scheitelpunkt." }] }),
          ],
          steps: [
            `A(x) = (${l} − x) · (${w} + ${grow}) = ${quadratic(-k, k * l - w, l * w)}; die Länge muss positiv bleiben: 𝔻 = {x | 0 &lt; x &lt; ${l}}`,
            `A(x) = ${factor(-k)}[x² − ${fmt(l - m)}x]${plus(l * w)} = ${factor(-k)}[${square(xBest)} − ${fmt(xBest * xBest)}]${plus(l * w)} = ${vertexForm(-k, xBest, areaBest)}`,
            `<strong>x = ${fmt(xBest)} cm: A<sub>max</sub> = ${fmt(areaBest)} cm²; das Rechteck ist dann ${fmt(l - xBest)} cm lang und ${fmt(w + k * xBest)} cm breit.</strong>`,
          ],
          meta: { k, l, w },
        };
      },
    },
    {
      id: "schar",
      make: (rng, level): ExerciseTask => {
        const k = rng.pick([0.5, 1, 0.25]);
        const n = rng.int(2, 4);
        const r1 = rng.int(-4, 1);
        const r2 = r1 + 2 * n;
        const m = rng.pick([-1, -0.5, 0.5, 1, 2]);
        const t = rng.int(-3, 3);
        const pb = k * (r1 + r2) + m;
        const pc = t - k * r1 * r2;
        const xBest = (r1 + r2) / 2;
        const longest = k * n * n;
        const p = quadratic(-k, pb, pc);
        const g = linear(m, t);
        const difference = quadratic(-k, k * (r1 + r2), -k * r1 * r2);
        if (level === 1) {
          return {
            prompt: `Die Punkte P<sub>n</sub>(x | ${p}) liegen auf der Parabel p, die Punkte Q<sub>n</sub>(x | ${g}) auf der Geraden g. P<sub>n</sub> und Q<sub>n</sub> haben jeweils dieselbe Abszisse x, und P<sub>n</sub> liegt über Q<sub>n</sub>. Berechne die Länge der Strecken [P<sub>n</sub>Q<sub>n</sub>] in Abhängigkeit von x. Für welches x ist die Strecke am längsten, und wie lang ist sie dann?`,
            given: [`p: y = ${p}`, `g: y = ${g}`],
            formulaHint: "P<sub>n</sub>Q<sub>n</sub>(x) = (y<sub>P</sub> − y<sub>Q</sub>) LE; dann den Scheitelpunkt dieser Funktion bestimmen",
            fields: [
              numberField("x =", xBest, "", 2, { slips: [{ value: pb / (2 * k), hint: "Das ist der Scheitelpunkt der Parabel p. Gesucht ist der Scheitelpunkt der Streckenlänge P_nQ_n(x)." }] }),
              numberField("größte Länge:", longest, "LE", 2),
            ],
            steps: [
              `P<sub>n</sub>Q<sub>n</sub>(x) = [(${p}) − (${g})] LE = (${difference}) LE`,
              `Quadratische Ergänzung: P<sub>n</sub>Q<sub>n</sub>(x) = (${vertexForm(-k, xBest, longest)}) LE`,
              `<strong>Für x = ${fmt(xBest)} ist die Strecke am längsten: ${fmt(longest)} LE.</strong>`,
            ],
            meta: { k, r1, r2, m, t },
          };
        }
        const f = rng.pick([2, 4, 6]);
        const areaBest = (f / 2) * longest;
        return {
          prompt: `Die Punkte A<sub>n</sub>(x | ${g}) auf der Geraden g und die Punkte C<sub>n</sub>(x | ${p}) auf der Parabel p haben dieselbe Abszisse x. Sie sind zusammen mit Punkten B<sub>n</sub> und D<sub>n</sub> die Eckpunkte von Rauten A<sub>n</sub>B<sub>n</sub>C<sub>n</sub>D<sub>n</sub>; die Diagonale [B<sub>n</sub>D<sub>n</sub>] ist jeweils ${f} LE lang. Für welche Werte von x gibt es solche Rauten? Für welches x ist der Flächeninhalt am größten, und wie groß ist er dann?`,
          given: [`g: y = ${g}`, `p: y = ${p}`, `B<sub>n</sub>D<sub>n</sub> = ${f} LE`],
          fields: [
            numberField("untere Grenze von 𝔻:", r1, "", 2),
            numberField("obere Grenze von 𝔻:", r2, "", 2),
            numberField("x =", xBest, "", 2),
            numberField("A<sub>max</sub> =", areaBest, "FE", 2, { slips: [{ value: f * longest, hint: "Flächeninhalt einer Raute: A = ½ · e · f. Die Hälfte nicht vergessen." }] }),
          ],
          steps: [
            `A<sub>n</sub>C<sub>n</sub>(x) = [(${p}) − (${g})] LE = (${difference}) LE = (${vertexForm(-k, xBest, longest)}) LE`,
            `Rauten gibt es, wo C<sub>n</sub> über A<sub>n</sub> liegt. Nullstellen: ${vertexForm(-k, xBest, longest)} = 0 ⇒ ${square(xBest)} = ${n * n} ⇒ x = ${fmt(r1)} oder x = ${fmt(r2)}, also 𝔻 = {x | ${fmt(r1)} &lt; x &lt; ${fmt(r2)}}`,
            `A(x) = ½ · A<sub>n</sub>C<sub>n</sub>(x) · ${f} LE = (${vertexForm((-k * f) / 2, xBest, areaBest)}) FE`,
            `<strong>𝔻 = {x | ${fmt(r1)} &lt; x &lt; ${fmt(r2)}}; für x = ${fmt(xBest)} ist A<sub>max</sub> = ${fmt(areaBest)} FE.</strong>`,
          ],
          meta: { k, r1, r2, m, t, f },
        };
      },
    },
    {
      id: "minimum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const s = rng.pick([6, 8, 10, 12, 14]);
          const xBest = s / 2;
          const areaMin = (s * s) / 2;
          return {
            prompt: `Im Quadrat ABCD mit der Seitenlänge ${s} cm liegt auf jeder Seite ein Punkt, jeweils x cm von der vorhergehenden Ecke entfernt (A → B → C → D). Die vier Punkte bilden ein inneres Quadrat. Für welches x ist sein Flächeninhalt am kleinsten, und wie groß ist er dann?`,
            given: [`Seitenlänge ${s} cm`],
            formulaHint: "A(x) = großes Quadrat minus vier rechtwinklige Dreiecke: A(x) = s² − 4 · ½ · x · (s − x)",
            fields: [
              numberField("x =", xBest, "cm", 2),
              numberField("A<sub>min</sub> =", areaMin, "cm²", 2, { slips: [{ value: s * s, hint: "Das ist das große Quadrat. Ziehe die vier Dreiecke ab." }] }),
            ],
            steps: [
              `Abgeschnitten werden vier rechtwinklige Dreiecke mit den Katheten x und ${s} − x.`,
              `A(x) = ${s * s} − 4 · ½ · x · (${s} − x) = ${quadratic(2, -2 * s, s * s)}; 𝔻 = {x | 0 &lt; x &lt; ${s}}`,
              `A(x) = 2[x² − ${s}x]${plus(s * s)} = ${vertexForm(2, xBest, areaMin)}`,
              `<strong>Für x = ${fmt(xBest)} cm ist das innere Quadrat am kleinsten: A<sub>min</sub> = ${fmt(areaMin)} cm².</strong>`,
            ],
            meta: { s },
          };
        }
        const [l, w] = rng.pick(RECTANGLES);
        const xBest = (l + w) / 4;
        const areaMin = l * w - 2 * xBest * xBest;
        return {
          prompt: `Das Rechteck ABCD hat die Seitenlängen AB = ${l} cm und BC = ${w} cm. Auf jeder Seite liegt ein Punkt, jeweils x cm von der vorhergehenden Ecke entfernt (A → B → C → D). Die vier Punkte bilden Parallelogramme. Gib die Definitionsmenge an. Für welches x hat das Parallelogramm den kleinsten Flächeninhalt, und wie groß ist er dann?`,
          given: [`AB = ${l} cm`, `BC = ${w} cm`],
          fields: [
            numberField("obere Grenze von 𝔻:", w, "cm", 2, { slips: [{ value: l, hint: "x darf nicht größer als die kürzere Seite BC sein." }] }),
            numberField("x =", xBest, "cm", 2),
            numberField("A<sub>min</sub> =", areaMin, "cm²", 2, { slips: [{ value: l * w, hint: "Das ist das Rechteck. Ziehe die vier Dreiecke ab." }] }),
          ],
          steps: [
            `Abgeschnitten werden zwei rechtwinklige Dreiecke mit den Katheten x und ${l} − x und zwei mit den Katheten x und ${w} − x.`,
            `A(x) = ${l * w} − x(${l} − x) − x(${w} − x) = ${quadratic(2, -(l + w), l * w)}; x muss kleiner als die kürzere Seite sein: 𝔻 = {x | 0 &lt; x &lt; ${w}}`,
            `A(x) = 2[x² − ${fmt((l + w) / 2)}x]${plus(l * w)} = ${vertexForm(2, xBest, areaMin)}`,
            `<strong>Für x = ${fmt(xBest)} cm ist A<sub>min</sub> = ${fmt(areaMin)} cm².</strong>`,
          ],
          meta: { l, w },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst Extremwertprobleme mit der Scheitelpunktsform und achtest dabei auf die Definitionsmenge.",
};

// 7.5 Lösungsformel, Diskriminante und Nullstellen ───────────────────────────

/** Balls h(x) = a(x − r₋)(x − r₊) with a release height between 0,8 m and 3 m and two-decimal coefficients. */
const BALLS: Array<[number, number, number]> = [];
for (const a of [-0.05, -0.1, -0.2, -0.25, -0.5]) {
  for (const rNeg of [-1, -2, -3]) {
    for (const rPos of [4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]) {
      const b = -a * (rNeg + rPos);
      const c = a * rNeg * rPos;
      const top = -a * ((rPos - rNeg) / 2) ** 2;
      const tidy = Math.abs(b - round(b, 2)) < 1e-9 && Math.abs(c - round(c, 2)) < 1e-9;
      if (c >= 0.8 && c <= 3 && top <= 12 && tidy) BALLS.push([a, rNeg, rPos]);
    }
  }
}

const loesungsformel: Lesson = {
  id: "qf-5-loesungsformel",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "7.5 Lösungsformel, Diskriminante und Nullstellen",
  subtitle: "Die Diskriminante entscheidet",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, Lösungsformel, Diskriminante und Nullstellen`,
  whyItMatters:
    "Wann landet der Ball, wo schneidet die Parabel die x-Achse? Die Lösungsformel löst jede quadratische Gleichung, und die Diskriminante verrät schon vorher, wie viele Lösungen es gibt.",
  explanationHtml: `
    <p>Eine <strong>quadratische Gleichung</strong> lässt sich immer in die Form <strong>ax² + bx + c = 0</strong> mit a ≠ 0 bringen. Zwei Sonderfälle löst du ohne Formel:</p>
    <ul>
      <li><strong>ohne x-Glied:</strong> 2x² − 18 = 0 ⇒ x² = 9 ⇒ x = −3 oder x = 3.</li>
      <li><strong>ohne Zahlglied:</strong> x² − 5x = 0 ⇒ x · (x − 5) = 0 ⇒ x = 0 oder x = 5, denn ein Produkt ist null, wenn ein Faktor null ist.</li>
    </ul>
    <p>Für alle anderen hilft die <strong>Lösungsformel</strong>. Sie entsteht, wenn man ax² + bx + c = 0 mit der quadratischen Ergänzung allgemein löst:</p>
    <p class="formula-line">x<sub>1,2</sub> = ${frac("−b ± √D", "2a")} mit der <strong>Diskriminante</strong> D = b² − 4ac</p>
    <ul>
      <li>D &gt; 0: zwei Lösungen, L = {x₁; x₂}.</li>
      <li>D = 0: genau eine Lösung x = −b : (2a).</li>
      <li>D &lt; 0: keine Lösung, L = { }, denn aus einer negativen Zahl kann man keine Wurzel ziehen.</li>
    </ul>
    <p>Die <strong>Nullstellen</strong> einer quadratischen Funktion y = ax² + bx + c sind die Lösungen von ax² + bx + c = 0. Die Diskriminante sagt dir schon vor dem Rechnen, ob die Parabel die x-Achse zweimal schneidet (D &gt; 0), berührt (D = 0, ihr Scheitelpunkt liegt auf der x-Achse) oder gar nicht trifft (D &lt; 0).</p>
    <div class="example">2x² − 4x − 6 = 0: a = 2, b = −4, c = −6. D = (−4)² − 4 · 2 · (−6) = 16 + 48 = 64.<br>x<sub>1,2</sub> = (4 ± 8) : 4, also x₁ = −1 und x₂ = 3, L = {−1; 3}.</div>
    <div class="merke"><strong>Merke:</strong> Erst auf die Form ax² + bx + c = 0 bringen und a, b, c mit Vorzeichen ablesen, dann D berechnen. Das Vorzeichen von D entscheidet über die Anzahl der Lösungen.</div>
  `,
  formulas: [
    { name: "Lösungsformel", html: `x<sub>1,2</sub> = ${frac("−b ± √D", "2a")}`, quantities: "für ax² + bx + c = 0 mit a ≠ 0" },
    { name: "Diskriminante", html: "D = b² − 4ac", quantities: "D > 0: zwei, D = 0: eine, D < 0: keine Lösung" },
    { name: "Sonderfälle", html: "ax² + c = 0 ⇒ x² = −c : a; ax² + bx = 0 ⇒ x · (ax + b) = 0", quantities: "ohne Lösungsformel" },
  ],
  quiz: {
    question: "Wie viele Lösungen hat die Gleichung 2x² − 4x + 2 = 0?",
    options: ["genau eine", "zwei", "keine"],
    correctIndex: 0,
    explanation: "D = (−4)² − 4 · 2 · 2 = 16 − 16 = 0: Es gibt genau eine Lösung, x = 4 : 4 = 1.",
  },
  lab: {
    kind: "discriminant",
    title: "Labor: Die Diskriminante",
    intro:
      "Stelle a, b und c ein oder ziehe den Schnittpunkt mit der y-Achse. Die Nullstellen der Parabel sind die Lösungen der Gleichung; der Balken rechts zeigt das Vorzeichen von D.",
    params: [
      { type: "range", key: "a", label: "a", unit: "", min: -3, max: 3, step: 0.5, value: 1, digits: 1 },
      { type: "range", key: "b", label: "b", unit: "", min: -8, max: 8, step: 1, value: 0 },
      { type: "range", key: "c", label: "c", unit: "", min: -6, max: 6, step: 1, value: -4 },
    ],
    readouts: [
      { key: "D", label: "D = b² − 4ac", digits: 2, emphasis: true, compute: (v) => v.b * v.b - 4 * v.a * v.c },
      {
        key: "count",
        label: "Anzahl der Lösungen",
        compute: (v) => (v.a === 0 ? "a = 0: keine quadratische Gleichung" : ["keine", "genau eine", "zwei"][Math.sign(v.b * v.b - 4 * v.a * v.c) + 1]),
      },
      { key: "L", label: "Lösungsmenge", compute: (v) => (v.a === 0 ? "–" : solutionSet(quadraticRoots(v.a, v.b, v.c))) },
      {
        key: "S",
        label: "Scheitelpunkt",
        compute: (v) => {
          if (v.a === 0) return "–";
          const S = vertexOf(v.a, v.b, v.c);
          return `S${pointText(S.x, S.y)}`;
        },
      },
    ],
    goals: [
      { id: "beruehren", text: "Erzeuge eine Parabel, die die x-Achse berührt (D = 0), mit b ≠ 0.", check: (v) => v.a !== 0 && v.b !== 0 && v.b * v.b - 4 * v.a * v.c === 0 },
      { id: "keine-unten", text: "Erzeuge eine nach unten geöffnete Parabel ohne Nullstelle.", check: (v) => v.a < 0 && v.b * v.b - 4 * v.a * v.c < 0 },
      {
        id: "loesungsmenge",
        text: "Stelle eine nach unten geöffnete Parabel ein, deren Gleichung die Lösungsmenge L = {−1; 3} hat.",
        check: (v) => {
          if (v.a >= 0) return false;
          const roots = quadraticRoots(v.a, v.b, v.c);
          return roots.length === 2 && Math.abs(roots[0] + 1) < 1e-9 && Math.abs(roots[1] - 3) < 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "loesungsformel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 1, 2, -1, 3, -2, 0.5]);
          const r1 = rng.int(-6, 6);
          let r2 = rng.int(-6, 6);
          if (r2 === r1) r2 = r1 > 0 ? r1 - 4 : r1 + 4;
          const b = -a * (r1 + r2);
          const c = a * r1 * r2;
          const D = b * b - 4 * a * c;
          const low = Math.min(r1, r2);
          const high = Math.max(r1, r2);
          return {
            prompt: `Löse die quadratische Gleichung ${quadratic(a, b, c)} = 0 mit der Lösungsformel. Berechne zuerst die Diskriminante D.`,
            given: [`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`],
            formulaHint: `D = b² − 4ac; x<sub>1,2</sub> = ${frac("−b ± √D", "2a")}`,
            anyOrder: [1, 2],
            fields: [
              numberField("D =", D, "", 2, { slips: [{ value: b * b + 4 * a * c, hint: "D = b² − 4ac: Achte auf das Minus und auf die Vorzeichen von a und c." }] }),
              numberField("x₁ =", low, "", 2),
              numberField("x₂ =", high, "", 2),
            ],
            steps: [
              `a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}: D = ${paren(b)}² − 4 · ${paren(a)} · ${paren(c)} = ${fmt(D)}`,
              `x<sub>1,2</sub> = (${fmt(-b)} ± ${sqrtHtml(fmt(D))}) : ${paren(2 * a)} = (${fmt(-b)} ± ${fmt(Math.abs(a) * (high - low))}) : ${paren(2 * a)}`,
              `<strong>L = {${fmt(low)}; ${fmt(high)}}</strong>`,
            ],
            meta: { a, b, c },
          };
        }
        let k = 1;
        let p = 1;
        let m = 0;
        let t = 4;
        for (let attempt = 0; attempt < 40; attempt++) {
          const kk = rng.pick([1, 2, 0.5, -1, 3]);
          const pp = nonZero(rng, 4);
          const mm = rng.int(-6, 6);
          const tt = rng.int(-8, 8);
          const BB = 2 * kk * pp - mm;
          const CC = kk * pp * pp - tt;
          if (BB * BB - 4 * kk * CC >= 1) {
            [k, p, m, t] = [kk, pp, mm, tt];
            break;
          }
        }
        const A = k;
        const B = 2 * k * p - m;
        const C = k * p * p - t;
        const D = B * B - 4 * A * C;
        const roots = quadraticRoots(A, B, C);
        const left = `${factor(k)}${square(-p)}`;
        const right = linear(m, t);
        return {
          prompt: `Bestimme die Lösungsmenge der Gleichung ${left} = ${right} mit G = ℝ. Runde wenn nötig auf zwei Stellen nach dem Komma.`,
          given: [`${left} = ${right}`],
          anyOrder: [0, 1],
          fields: [numberField("x₁ =", roots[0], "", 2), numberField("x₂ =", roots[1], "", 2)],
          steps: [
            `Ausmultiplizieren: ${quadratic(k, 2 * k * p, k * p * p)} = ${right}`,
            `Auf die Form ax² + bx + c = 0 bringen: ${quadratic(A, B, C)} = 0`,
            `D = ${paren(B)}² − 4 · ${paren(A)} · ${paren(C)} = ${fmt(D)}`,
            `x<sub>1,2</sub> = (${fmt(-B)} ± ${sqrtHtml(fmt(D))}) : ${paren(2 * A)}`,
            `<strong>${solutionSet(roots)}</strong>`,
          ],
          meta: { k, p, m, t },
        };
      },
    },
    {
      id: "anzahl",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          const a = rng.pick([1, 2, -1, -2, 3, 0.5]);
          let b: number;
          let c: number;
          if (kind === 2) {
            const r1 = rng.int(-5, 4);
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
            prompt: `Wie viele Lösungen hat die Gleichung ${quadratic(a, b, c)} = 0? Entscheide mit der Diskriminante, ohne die Gleichung zu lösen.`,
            given: [`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`],
            formulaHint: "D = b² − 4ac; D &gt; 0: zwei, D = 0: eine, D &lt; 0: keine Lösung",
            fields: [
              numberField("D =", D, "", 2, { slips: [{ value: b * b + 4 * a * c, hint: "D = b² − 4ac: Achte auf das Minus und auf die Vorzeichen." }] }),
              choiceField("Anzahl der Lösungen", COUNT, kind),
            ],
            steps: [
              `D = ${paren(b)}² − 4 · ${paren(a)} · ${paren(c)} = ${fmt(D)}`,
              `<strong>D ${D > 0 ? "&gt; 0: zwei Lösungen" : D === 0 ? "= 0: genau eine Lösung" : "&lt; 0: keine Lösung"}</strong>`,
            ],
            meta: { a, b, c, kind },
          };
        }
        const a = rng.pick([1, 2, -1, 0.5, -2, 3]);
        const h = nonZero(rng, 5);
        const b = -2 * a * h;
        const c0 = a * h * h;
        const sign = a > 0 ? "−" : "+";
        return {
          prompt: `Für welchen Wert von c hat die Gleichung ${quadratic(a, b, 0)} + c = 0 genau eine Lösung? Wie heißt diese Lösung, und für welche Werte von c gibt es zwei Lösungen?`,
          given: [`${quadratic(a, b, 0)} + c = 0`],
          fields: [
            numberField("c =", c0, "", 2, { slips: [{ value: -c0, hint: "D = b² − 4ac = 0 nach c auflösen: c = b² : (4a)." }] }),
            numberField("x =", h, "", 2, { slips: [{ value: -h, hint: "Die Lösung ist x = −b : (2a). Achte auf das Vorzeichen von b." }] }),
            choiceField("zwei Lösungen für", [`c < ${fmt(c0)}`, `c > ${fmt(c0)}`], a > 0 ? 0 : 1),
          ],
          steps: [
            `D = ${paren(b)}² − 4 · ${paren(a)} · c = ${fmt(b * b)} ${sign} ${fmt(Math.abs(4 * a))}c`,
            `Genau eine Lösung bei D = 0: c = ${fmt(b * b)} : ${paren(4 * a)} = ${fmt(c0)}; dann ist x = ${fmt(-b)} : ${paren(2 * a)} = ${fmt(h)}`,
            `Zwei Lösungen bei D &gt; 0: ${fmt(b * b)} ${sign} ${fmt(Math.abs(4 * a))}c &gt; 0 ⇔ c ${a > 0 ? "&lt;" : "&gt;"} ${fmt(c0)}`,
            `<strong>c = ${fmt(c0)}, x = ${fmt(h)}; zwei Lösungen für c ${a > 0 ? "&lt;" : "&gt;"} ${fmt(c0)}</strong>`,
          ],
          meta: { a, b, h },
        };
      },
    },
    {
      id: "nullstellen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const a = rng.pick([1, 2, 0.5, -1, -2, 3]);
            const k = rng.int(1, 6);
            const c = -a * k * k;
            return {
              prompt: `Berechne die Nullstellen der Funktion f: y = ${quadratic(a, 0, c)} ohne Lösungsformel.`,
              given: [`f: y = ${quadratic(a, 0, c)}`],
              formulaHint: "ax² + c = 0 ⇒ x² = −c : a ⇒ x = −√(−c : a) oder x = √(−c : a)",
              anyOrder: [0, 1],
              fields: [
                numberField("x₁ =", -k, "", 2, { slips: [{ value: -k * k, hint: "Das ist x². Ziehe noch die Wurzel." }] }),
                numberField("x₂ =", k, "", 2, { slips: [{ value: k * k, hint: "Das ist x². Ziehe noch die Wurzel." }] }),
              ],
              steps: [
                `${quadratic(a, 0, c)} = 0 ⇒ ${quadratic(a, 0, 0)} = ${fmt(-c)} ⇒ x² = ${k * k}`,
                `<strong>x₁ = ${fmt(-k)}, x₂ = ${fmt(k)}</strong>`,
              ],
              meta: { a, b: 0, c },
            };
          }
          const a = rng.pick([1, 2, -1, 0.5, -0.5, 3]);
          const r = nonZero(rng, 8);
          const b = -a * r;
          return {
            prompt: `Berechne die Nullstellen der Funktion f: y = ${quadratic(a, b, 0)} ohne Lösungsformel.`,
            given: [`f: y = ${quadratic(a, b, 0)}`],
            formulaHint: "x ausklammern: x · (ax + b) = 0 ⇒ x = 0 oder ax + b = 0",
            anyOrder: [0, 1],
            fields: [numberField("x₁ =", 0, "", 2), numberField("x₂ =", r, "", 2, { slips: [{ value: -r, hint: "ax + b = 0 ⇒ x = −b : a. Achte auf das Vorzeichen." }] })],
            steps: [
              `x ausklammern: ${quadratic(a, b, 0)} = x · (${linear(a, b)}) = 0`,
              `x = 0 oder ${linear(a, b)} = 0, also x = ${fmt(-b)} : ${paren(a)} = ${fmt(r)}`,
              `<strong>x₁ = 0, x₂ = ${fmt(r)}</strong>`,
            ],
            meta: { a, b, c: 0 },
          };
        }
        const [a, rNeg, rPos] = rng.pick(BALLS);
        const b = -a * (rNeg + rPos);
        const c = a * rNeg * rPos;
        const root = Math.abs(a) * (rPos - rNeg);
        return {
          prompt: `Ein Ball wird geworfen und fliegt auf der Bahn h(x) = ${quadratic(a, b, c)} (x: waagrechte Entfernung vom Abwurfpunkt, h(x): Höhe über dem Boden, beides in m). In welcher Entfernung vom Abwurfpunkt trifft der Ball auf den Boden?`,
          given: [`h(x) = ${quadratic(a, b, c)}`, "Boden: h(x) = 0"],
          fields: [numberField("x =", rPos, "m", 2, { slips: [{ value: rNeg, hint: "Die negative Lösung liegt hinter dem Abwurfpunkt und gehört nicht zum Wurf." }] })],
          steps: [
            `Boden: h(x) = 0, also ${quadratic(a, b, c)} = 0`,
            `D = ${paren(b)}² − 4 · ${paren(a)} · ${paren(c)} = ${fmt(root * root)}`,
            `x<sub>1,2</sub> = (${fmt(-b)} ± ${fmt(root)}) : ${paren(2 * a)}, also x = ${fmt(rNeg)} oder x = ${fmt(rPos)}`,
            `<strong>Nur x = ${fmt(rPos)} passt, denn x &gt; 0: Der Ball landet ${fmt(rPos)} m vom Abwurfpunkt entfernt.</strong>`,
          ],
          meta: { a, b, c },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst quadratische Gleichungen mit der Lösungsformel und sagst mit der Diskriminante die Anzahl der Lösungen voraus.",
};

// 7.6 Schnittpunkte von Parabel und Gerade bzw. zweier Parabeln ──────────────

/** Intersection points of p: y = a·x² + pb·x + pc with g: y = m·x + t at x = r1 < r2. */
function crossingTask(a: number, r1: number, r2: number, m: number, t: number, level: 1 | 2): ExerciseTask {
  const pb = m - a * (r1 + r2);
  const pc = t + a * r1 * r2;
  const B = pb - m;
  const C = pc - t;
  const D = B * B - 4 * a * C;
  const y1 = m * r1 + t;
  const y2 = m * r2 + t;
  const p = quadratic(a, pb, pc);
  const g = linear(m, t);
  const [first, second] = level === 1 ? ["S₁", "S₂"] : ["P", "Q"];
  return {
    prompt:
      level === 1
        ? `Berechne die Koordinaten der Schnittpunkte S₁ und S₂ der Parabel p: y = ${p} und der Geraden g: y = ${g}. S₁ ist der Schnittpunkt mit der kleineren x-Koordinate.`
        : `Die Parabel p hat die Gleichung y = ${p}, die Gerade g die Gleichung y = ${g} mit G = ℝ × ℝ. Berechne die Koordinaten der Schnittpunkte P und Q von p und g; P hat die kleinere x-Koordinate.`,
    given: [`p: y = ${p}`, `g: y = ${g}`],
    ...(level === 1 ? { formulaHint: "Gleichsetzen, auf null bringen, Lösungsformel; die y-Werte durch Einsetzen in g" } : {}),
    fields: [
      numberField(`${first}: x =`, r1, "", 2),
      numberField(`${first}: y =`, y1, "", 2),
      numberField(`${second}: x =`, r2, "", 2),
      numberField(`${second}: y =`, y2, "", 2),
    ],
    steps: [
      `Gleichsetzen: ${p} = ${g}`,
      `Auf null bringen: ${quadratic(a, B, C)} = 0`,
      `D = ${paren(B)}² − 4 · ${paren(a)} · ${paren(C)} = ${fmt(D, 4)}; x<sub>1,2</sub> = (${fmt(-B)} ± ${fmt(Math.abs(a) * (r2 - r1))}) : ${paren(2 * a)}, also x₁ = ${fmt(r1)} und x₂ = ${fmt(r2)}`,
      `In g einsetzen: y₁ = ${fmt(m)} · ${paren(r1)}${plus(t)} = ${fmt(y1)}, y₂ = ${fmt(m)} · ${paren(r2)}${plus(t)} = ${fmt(y2)}`,
      `<strong>${first}${point(r1, y1)}, ${second}${point(r2, y2)}</strong>`,
    ],
    meta: { a, pb, pc, m, t },
  };
}

/** [a₁, a₂] with a₁ ≠ a₂ for two parabolas that intersect. */
const PARABOLA_PAIRS: Array<[number, number]> = [[1, -1], [0.5, -0.5], [2, 1], [1, -0.5], [-1, 1], [-0.5, 0.5], [1, 2]];

/** The common points the lab lists: the solutions of the difference equation, on the fixed parabola. */
function commonPoints(v: LabValues): string {
  const info = intersectionInfo(v);
  if (info.same) return "unendlich viele";
  if (info.xs.length === 0) return "keine";
  const { a, b, c } = BASE_PARABOLA;
  return info.xs.map((x) => pointText(x, a * x * x + b * x + c)).join(", ");
}

const schnittpunkte: Lesson = {
  id: "qf-6-schnittpunkte",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "7.6 Schnittpunkte von Parabel und Gerade bzw. zweier Parabeln",
  subtitle: "Sekante, Tangente, Passante",
  tracks: ["II_III"],
  lehrplan: `${LEHRPLAN}, quadratische Gleichungssysteme und Schnittpunkte`,
  whyItMatters:
    "Wo trifft eine Rampe die Wurfbahn, wo kreuzen sich zwei Bögen? Gemeinsame Punkte von Graphen gehören zu den häufigsten Prüfungsaufgaben, und alle laufen auf eine quadratische Gleichung hinaus.",
  explanationHtml: `
    <p>Gemeinsame Punkte zweier Graphen erfüllen beide Gleichungen: Ihre Koordinaten sind die Lösungen eines <strong>quadratischen Gleichungssystems</strong>. Du löst es durch <strong>Gleichsetzen</strong>.</p>
    <p><strong>Parabel und Gerade:</strong> p: y = x² − 2x − 1 und g: y = x + 3.</p>
    <ol class="steps">
      <li>Gleichsetzen: x² − 2x − 1 = x + 3</li>
      <li>Auf null bringen: x² − 3x − 4 = 0</li>
      <li>Lösen: D = (−3)² − 4 · 1 · (−4) = 25, x<sub>1,2</sub> = (3 ± 5) : 2, also x₁ = −1 und x₂ = 4</li>
      <li>y-Werte durch Einsetzen in die einfachere Gleichung, hier g: y₁ = 2, y₂ = 7</li>
    </ol>
    <p>Also L = {(−1 | 2); (4 | 7)}. Die Diskriminante der Gleichung nach dem Gleichsetzen entscheidet über die Lage: D &gt; 0 zwei Schnittpunkte (die Gerade ist eine <strong>Sekante</strong>), D = 0 ein Berührpunkt (<strong>Tangente</strong>), D &lt; 0 kein gemeinsamer Punkt (<strong>Passante</strong>).</p>
    <p><strong>Zwei Parabeln</strong> setzt du genauso gleich. Haben beide denselben Faktor a, fällt x² weg: Es bleibt eine lineare Gleichung mit höchstens einer Lösung.</p>
    <div class="example">p₁: y = x² − 4 und p₂: y = −x² + 2x: x² − 4 = −x² + 2x ⇒ 2x² − 2x − 4 = 0 ⇒ x² − x − 2 = 0.<br>D = 1 + 8 = 9, x<sub>1,2</sub> = (1 ± 3) : 2, also x₁ = −1 und x₂ = 2. Schnittpunkte (−1 | −3) und (2 | 0).</div>
    <div class="merke"><strong>Merke:</strong> Gleichsetzen, auf null bringen, D berechnen, x-Werte bestimmen, y-Werte durch Einsetzen. So viele Lösungen die quadratische Gleichung hat, so viele gemeinsame Punkte haben die Graphen.</div>
  `,
  formulas: [
    { name: "Gemeinsame Punkte", html: "f(x) = g(x) ⇒ ax² + bx + c = 0", quantities: "die Lösungen sind die x-Koordinaten der gemeinsamen Punkte" },
    { name: "Lage von Parabel und Gerade", html: "D &gt; 0 Sekante, D = 0 Tangente, D &lt; 0 Passante", quantities: "D der Gleichung nach dem Gleichsetzen" },
  ],
  quiz: {
    question: "Wie viele Schnittpunkte haben die Parabeln y = x² + 2x und y = x² − 4x + 6?",
    options: ["genau einen", "zwei", "keinen"],
    correctIndex: 0,
    explanation: "Beim Gleichsetzen fällt x² weg: 2x = −4x + 6, also 6x = 6 und x = 1. Eine lineare Gleichung hat hier genau eine Lösung: S(1 | 3).",
  },
  lab: {
    kind: "intersections",
    title: "Labor: Gemeinsame Punkte",
    intro:
      "Die feste Parabel ist p: y = 0,5x² − 2. Ziehe die Gerade an ihrem Achsenabschnitt und ihrem Steigungspunkt oder den Scheitel einer zweiten Parabel und beobachte die Diskriminante der Gleichung nach dem Gleichsetzen.",
    params: [
      { type: "choice", key: "mode", label: "Zweiter Graph", options: [{ value: 0, label: "Gerade g: y = mx + t" }, { value: 1, label: "Parabel p₂: y = a₂(x − d)² + e" }], value: 0 },
      { type: "range", key: "m", label: "Steigung m", unit: "", min: -4, max: 4, step: 0.5, value: 1, digits: 1, showIf: (v) => v.mode === 0 },
      { type: "range", key: "t", label: "y-Achsenabschnitt t", unit: "", min: -6, max: 6, step: 0.5, value: 1, digits: 1, showIf: (v) => v.mode === 0 },
      { type: "choice", key: "a2", label: "Faktor a₂", options: [-1, -0.5, 0.5, 1, 2].map((a) => ({ value: a, label: `a₂ = ${fmt(a)}` })), value: -1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "d", label: "Scheitel von p₂: x", unit: "", min: -5, max: 5, step: 0.5, value: 0, digits: 1, showIf: (v) => v.mode === 1 },
      { type: "range", key: "e", label: "Scheitel von p₂: y", unit: "", min: -6, max: 6, step: 0.5, value: 3, digits: 1, showIf: (v) => v.mode === 1 },
    ],
    readouts: [
      {
        key: "equation",
        label: "Gleichsetzen ergibt",
        compute: (v) => {
          const info = intersectionInfo(v);
          return `${quadratic(info.A, info.B, info.C)} = 0`;
        },
      },
      {
        key: "D",
        label: "Diskriminante",
        emphasis: true,
        compute: (v) => {
          const D = intersectionInfo(v).D;
          return D === null ? "keine, x² fällt weg" : `D = ${fmt(D, 3)}`;
        },
      },
      { key: "kind", label: "Lage", compute: (v) => intersectionKind(v) },
      { key: "points", label: "gemeinsame Punkte", compute: (v) => commonPoints(v) },
    ],
    goals: [
      { id: "tangente", text: "Lege eine steigende Gerade als Tangente an die Parabel p.", check: (v) => v.mode === 0 && v.m > 0 && intersectionInfo(v).D === 0 },
      {
        id: "beruehren",
        text: "Lass eine nach unten geöffnete zweite Parabel die Parabel p in genau einem Punkt berühren.",
        check: (v) => v.mode === 1 && v.a2 < 0 && intersectionInfo(v).D === 0,
      },
      {
        id: "gleiches-a",
        text: "Wähle für p₂ denselben Faktor wie bei p (a₂ = 0,5) und erzeuge genau einen Schnittpunkt.",
        check: (v) => {
          const info = intersectionInfo(v);
          return v.mode === 1 && v.a2 === 0.5 && !info.same && info.xs.length === 1;
        },
      },
    ],
  },
  exercises: [
    {
      id: "schnittpunkte",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.pick([1, 1, -1, 2, 0.5]);
          const r1 = rng.int(-5, 3);
          const r2 = r1 + rng.int(1, 6);
          return crossingTask(a, r1, r2, rng.int(-3, 3), rng.int(-4, 4), 1);
        }
        const a = rng.pick([-0.25, 0.25, -0.5, 0.5]);
        const r1 = rng.int(-6, 0);
        const r2 = r1 + rng.int(2, 8);
        return crossingTask(a, r1, r2, rng.pick([-0.5, 0.5, 1, -1, 1.5, 2]), rng.int(-3, 4), 2);
      },
    },
    {
      id: "zwei-parabeln",
      make: (rng, level): ExerciseTask => {
        const [a1, a2] = rng.pick(PARABOLA_PAIRS);
        const A = a1 - a2;
        if (level === 1) {
          const b2 = rng.int(-4, 4);
          const c2 = rng.int(-5, 5);
          const r1 = rng.int(-4, 2);
          const r2 = r1 + rng.int(1, 5);
          const b1 = b2 - A * (r1 + r2);
          const c1 = c2 + A * r1 * r2;
          const y1 = a2 * r1 * r1 + b2 * r1 + c2;
          const y2 = a2 * r2 * r2 + b2 * r2 + c2;
          const B = b1 - b2;
          const C = c1 - c2;
          const p1 = quadratic(a1, b1, c1);
          const p2 = quadratic(a2, b2, c2);
          return {
            prompt: `Berechne die Koordinaten der Schnittpunkte S₁ und S₂ der Parabeln p₁: y = ${p1} und p₂: y = ${p2}. S₁ ist der Schnittpunkt mit der kleineren x-Koordinate.`,
            given: [`p₁: y = ${p1}`, `p₂: y = ${p2}`],
            formulaHint: "Gleichsetzen, alles auf eine Seite bringen, Lösungsformel; y durch Einsetzen in p₁ oder p₂",
            fields: [
              numberField("S₁: x =", r1, "", 2),
              numberField("S₁: y =", y1, "", 2),
              numberField("S₂: x =", r2, "", 2),
              numberField("S₂: y =", y2, "", 2),
            ],
            steps: [
              `Gleichsetzen: ${p1} = ${p2}`,
              `Alles auf eine Seite: ${quadratic(A, B, C)} = 0`,
              `D = ${paren(B)}² − 4 · ${paren(A)} · ${paren(C)} = ${fmt(B * B - 4 * A * C)}; x<sub>1,2</sub> = (${fmt(-B)} ± ${fmt(Math.abs(A) * (r2 - r1))}) : ${paren(2 * A)}, also x₁ = ${fmt(r1)} und x₂ = ${fmt(r2)}`,
              `In p₂ einsetzen: y₁ = ${fmt(y1)}, y₂ = ${fmt(y2)}`,
              `<strong>S₁${point(r1, y1)}, S₂${point(r2, y2)}</strong>`,
            ],
            meta: { a1, b1, c1, a2, b2, c2 },
          };
        }
        const x0 = rng.int(-3, 3);
        const b2 = rng.int(-4, 4);
        const c1 = rng.int(-5, 5);
        const b1 = b2 - 2 * A * x0;
        const e = c1 - A * x0 * x0;
        const y0 = a1 * x0 * x0 + b1 * x0 + c1;
        const B = b1 - b2;
        const p1 = quadratic(a1, b1, c1);
        const p2 = `${quadratic(a2, b2, 0)} + e`;
        return {
          prompt: `Gegeben sind die Parabel p₁: y = ${p1} und die Parabeln p₂: y = ${p2} mit e ∈ ℝ. Für welchen Wert von e berühren sich p₁ und p₂ in genau einem Punkt B? Berechne e und die Koordinaten von B.`,
          given: [`p₁: y = ${p1}`, `p₂: y = ${p2}`],
          fields: [
            numberField("e =", e, "", 2, { slips: [{ value: c1 + A * x0 * x0, hint: "Vorzeichen: Aus c₁ − e = b² : (4a) folgt e = c₁ − b² : (4a)." }] }),
            numberField("B: x =", x0, "", 2),
            numberField("B: y =", y0, "", 2),
          ],
          steps: [
            `Gleichsetzen: ${p1} = ${p2}, also ${quadratic(A, B, c1)} − e = 0`,
            `Berühren heißt D = 0: ${paren(B)}² − 4 · ${paren(A)} · (${fmt(c1)} − e) = 0`,
            `${fmt(c1)} − e = ${paren(B)}² : ${paren(4 * A)} = ${fmt((B * B) / (4 * A))}, also e = ${fmt(e)}`,
            `Berührstelle: x = ${fmt(-B)} : ${paren(2 * A)} = ${fmt(x0)}; in p₁ eingesetzt: y = ${fmt(y0)}`,
            `<strong>e = ${fmt(e)}, B${point(x0, y0)}</strong>`,
          ],
          meta: { a1, b1, c1, a2, b2 },
        };
      },
    },
    {
      id: "lage",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          const a = rng.pick([1, -1, 0.5, 2, -0.5]);
          const m = rng.int(-3, 3);
          const t = rng.int(-4, 4);
          let B: number;
          let C: number;
          if (kind === 2) {
            const r1 = rng.int(-4, 2);
            const r2 = r1 + rng.int(1, 5);
            B = -a * (r1 + r2);
            C = a * r1 * r2;
          } else if (kind === 1) {
            const r = rng.int(-4, 4);
            B = -2 * a * r;
            C = a * r * r;
          } else {
            const d = rng.int(-3, 3);
            const s = rng.int(1, 4);
            B = -2 * a * d;
            C = a * (d * d + s);
          }
          const pb = B + m;
          const pc = C + t;
          const D = B * B - 4 * a * C;
          const p = quadratic(a, pb, pc);
          const g = linear(m, t);
          return {
            prompt: `Wie liegt die Gerade g: y = ${g} zur Parabel p: y = ${p}? Berechne die Diskriminante der Gleichung, die beim Gleichsetzen entsteht.`,
            given: [`p: y = ${p}`, `g: y = ${g}`],
            formulaHint: "Gleichsetzen und auf null bringen; D &gt; 0: Sekante, D = 0: Tangente, D &lt; 0: Passante",
            fields: [
              numberField("D =", D, "", 2, { slips: [{ value: (pb + m) ** 2 - 4 * a * (pc + t), hint: "Beim Auf-null-Bringen wird mx + t abgezogen, nicht addiert." }] }),
              choiceField("Lage von g", ["Passante", "Tangente", "Sekante"], kind),
            ],
            steps: [
              `${p} = ${g}, also ${quadratic(a, B, C)} = 0`,
              `D = ${paren(B)}² − 4 · ${paren(a)} · ${paren(C)} = ${fmt(D)}`,
              `<strong>D ${D > 0 ? "&gt; 0: g ist eine Sekante (zwei Schnittpunkte)" : D === 0 ? "= 0: g ist eine Tangente (ein Berührpunkt)" : "&lt; 0: g ist eine Passante (kein gemeinsamer Punkt)"}</strong>`,
            ],
            meta: { a, pb, pc, m, t, kind },
          };
        }
        const a = rng.pick([1, 2, -1, 0.5, -2, -0.5]);
        const m = rng.int(-3, 3);
        const x0 = rng.int(-3, 3);
        const c = rng.int(-4, 4);
        const b = m - 2 * a * x0;
        const t0 = c - a * x0 * x0;
        const K = (b - m) ** 2 - 4 * a * c;
        const lineText = m === 0 ? "t" : `${linear(m, 0)} + t`;
        const below = a > 0 ? "&lt;" : "&gt;";
        return {
          prompt: `Gegeben sind die Parabel p: y = ${quadratic(a, b, c)} und die Geraden g: y = ${lineText} mit t ∈ ℝ. Für welchen Wert von t ist g eine Tangente an p? Für welche Werte von t ist g eine Passante?`,
          given: [`p: y = ${quadratic(a, b, c)}`, `g: y = ${lineText}`],
          fields: [
            numberField("Tangente für t =", t0, "", 2, { slips: [{ value: -t0, hint: "Vorzeichen: Löse D = 0 sorgfältig nach t auf." }] }),
            choiceField("Passante für", [`t < ${fmt(t0)}`, `t > ${fmt(t0)}`], a > 0 ? 0 : 1),
          ],
          steps: [
            `Gleichsetzen: ${quadratic(a, b, c)} = ${lineText}, also ${quadratic(a, b - m, c)} − t = 0`,
            `D = ${paren(b - m)}² − 4 · ${paren(a)} · (${fmt(c)} − t) = ${fmt(K)}${term(4 * a, "t", false)}`,
            `Tangente: D = 0, also t = ${fmt(t0)}`,
            `Passante: D &lt; 0 ⇔ ${fmt(4 * a)}t &lt; ${fmt(-K)} ⇔ t ${below} ${fmt(t0)}`,
            `<strong>Tangente für t = ${fmt(t0)}, Passante für t ${below} ${fmt(t0)}</strong>`,
          ],
          meta: { a, b, c, m },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest gemeinsame Punkte von Parabeln und Geraden und erkennst an der Diskriminante Sekante, Tangente und Passante.",
};

export const STAGE_QUADRATISCH: Stage = {
  id: STAGE_ID,
  stageNumber: 7,
  title: "Quadratische Funktionen und Gleichungen",
  subtitle: "Parabeln, Scheitelpunkt, Lösungsformel, Extremwerte, Schnittpunkte",
  icon: "⛲",
  accent: "#65a30d",
  badgeTitle: "Parabel-Profi",
  lehrplanLabel: "LB 4 (nur Zweig II/III)",
  lessons: [parabeln, scheitelpunkt, bestimmungsstuecke, extremwerte, loesungsformel, schnittpunkte],
};
