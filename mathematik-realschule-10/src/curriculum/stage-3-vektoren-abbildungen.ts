import { fmt, frac, linear, paren, point, quadratic, sqrtHtml, term, vertexForm } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  add,
  AREA_MAPS,
  angleBetween,
  angleKind,
  applyAffine,
  axisText,
  carrierText,
  colHtml,
  cosDeg,
  det,
  detHtml,
  dot,
  footOn,
  footPoint,
  graphOf,
  graphY,
  imagePoint,
  imageTerms,
  lineOf,
  LINES,
  LOCUS_GRAPHS,
  LOCUS_MAPS,
  mapOf,
  matHtml,
  mul,
  norm,
  reflectAt,
  rotateAbout,
  same,
  sinDeg,
  sub,
  TRIANGLE,
  triangleArea,
  triangleDet,
  trianglePoints,
  type Vec,
  vec,
  vecHtml,
  vn,
} from "../lab/views-vektoren-abbildungen";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, numberField, RAD_HINT, yesNo } from "./helpers";

const STAGE_ID = "stage-3-vektoren-abbildungen";
const LB1 = "M10 LB 1 (I)";
const LB2 = "M10 LB 2 (I)";

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

/** "A(3 | −2)". */
const named = (name: string, p: Vec, digits = 2): string => `${name}${point(p.x, p.y, digits)}`;
/** "4 − (−2)": the difference of two coordinates as it is written down. */
const diff = (b: number, a: number, digits = 2): string => `${fmt(b, digits)} − ${paren(a, digits)}`;
/** "x − 3", "x + 2" or "x". */
const xMinus = (a: number, variable = "x"): string => (a === 0 ? variable : a > 0 ? `${variable} − ${fmt(a)}` : `${variable} + ${fmt(-a)}`);
/** "3 · (−2)". */
const times = (a: number, b: number, digits = 2): string => `${paren(a, digits)} · ${paren(b, digits)}`;
const acosDeg = (c: number): number => (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
/** "= 5" or "≈ 5,83": exact values get an equals sign. */
const eqSign = (value: number, digits = 2): string => (Math.abs(value - Number(value.toFixed(digits))) < 1e-9 ? "=" : "≈");
/** A vector with whole coordinates inside [−max, max]. */
const fits = (p: Vec, max: number): boolean => Math.abs(p.x) <= max && Math.abs(p.y) <= max;
/** √n, or the number itself when the root is whole: √4 is 2. */
const root = (n: number): string => (Number.isInteger(Math.sqrt(n)) ? fmt(Math.sqrt(n)) : sqrtHtml(fmt(n)));
/** A linear term in another variable: "−2x' − 2". */
const linearIn = (m: number, t: number, variable: string): string => linear(m, t).replace(/x/g, variable);

// 3.1 Vektoren ───────────────────────────────────────────────────────────────

const vektoren: Lesson = {
  id: "vk-1-vektoren",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Vektoren: Verbindungsvektor, Gegenvektor, Betrag",
  subtitle: "Spitze minus Schaft, und die Länge mit Pythagoras",
  tracks: ["I"],
  lehrplan: `${LB1}: Skalarprodukt, Wiederholung der Vektorrechnung aus M8/M9`,
  whyItMatters:
    "Navigationsgeräte, Computerspiele und Roboterarme rechnen mit Vektoren: Zwei Zahlen sagen, wie weit es nach rechts und wie weit nach oben geht. Alles, was in dieser Etappe kommt, baut darauf auf.",
  explanationHtml: `
    <p>Ein <strong>Vektor</strong> beschreibt eine Verschiebung: so weit nach rechts (oder links) und so weit nach oben (oder unten). Man schreibt ihn als <strong>Spaltenvektor</strong>, oben die x-Koordinate, unten die y-Koordinate, zum Beispiel ${vn("v")} = ${vecHtml(3, 4)}. Alle Pfeile mit derselben Länge und derselben Richtung gehören zum selben Vektor.</p>
    <ul>
      <li><strong>Verbindungsvektor (Spitze minus Schaft):</strong> Der Pfeil von A(x<sub>A</sub> | y<sub>A</sub>) nach B(x<sub>B</sub> | y<sub>B</sub>) hat die Koordinaten ${vn("AB")} = ${vecHtml("x<sub>B</sub> − x<sub>A</sub>", "y<sub>B</sub> − y<sub>A</sub>")}.</li>
      <li><strong>Ortsvektor:</strong> Der Pfeil vom Ursprung O zum Punkt P(x | y) ist ${vn("OP")} = ${vecHtml("x", "y")}.</li>
      <li><strong>Gegenvektor:</strong> ${vn("BA")} = −${vn("AB")} ist gleich lang, zeigt aber in die entgegengesetzte Richtung: Beide Koordinaten wechseln das Vorzeichen.</li>
      <li><strong>Rechnen:</strong> Vektoren werden koordinatenweise addiert; ${vn("AB")} + ${vn("BC")} = ${vn("AC")} heißt: Pfeile aneinanderhängen. Mit einer Zahl k wird jede Koordinate vervielfacht; für k &lt; 0 dreht sich die Richtung um.</li>
      <li><strong>Punkt plus Vektor:</strong> Wer von A aus um ${vn("AB")} weitergeht, landet in B. Man schreibt B = A ⊕ ${vn("AB")}, gerechnet wird ${vn("OB")} = ${vn("OA")} + ${vn("AB")}.</li>
      <li><strong>Betrag (Länge):</strong> |${vn("v")}| = ${sqrtHtml("v<sub>x</sub>² + v<sub>y</sub>²")}. Die beiden Koordinaten sind die Katheten eines rechtwinkligen Dreiecks, der Pfeil ist die Hypotenuse (Satz des Pythagoras).</li>
    </ul>
    <div class="example">Beispiel: A(−2 | 3) und B(4 | −5). ${vn("AB")} = ${vecHtml("4 − (−2)", "−5 − 3")} = ${vecHtml(6, -8)}, der Gegenvektor ist ${vn("BA")} = ${vecHtml(-6, 8)}. Die Länge: |${vn("AB")}| = ${sqrtHtml("6² + (−8)²")} = ${sqrtHtml("100")} = 10, also ist die Strecke [AB] 10 LE lang.</div>
    <div class="merke"><strong>Merke:</strong> Verbindungsvektor: Spitze minus Schaft. Gegenvektor: beide Vorzeichen wechseln. Betrag: ${sqrtHtml("x² + y²")}; der Gegenvektor ist genauso lang.</div>
  `,
  formulas: [
    { name: "Verbindungsvektor", html: `${vn("AB")} = ${vecHtml("x<sub>B</sub> − x<sub>A</sub>", "y<sub>B</sub> − y<sub>A</sub>")}`, quantities: "Spitze B minus Schaft A, Koordinate für Koordinate" },
    { name: "Gegenvektor", html: `${vn("BA")} = −${vn("AB")}`, quantities: "gleich lang, entgegengesetzt gerichtet" },
    { name: "Betrag eines Vektors", html: `|${vn("v")}| = ${sqrtHtml("v<sub>x</sub>² + v<sub>y</sub>²")}`, quantities: "Länge des Pfeils in LE (Satz des Pythagoras)" },
  ],
  quiz: {
    question: "Gegeben sind A(1 | 5) und B(4 | 1). Welche Koordinaten hat der Verbindungsvektor AB→?",
    options: ["x-Koordinate 3, y-Koordinate −4", "x-Koordinate −3, y-Koordinate 4", "x-Koordinate 5, y-Koordinate 6"],
    correctIndex: 0,
    explanation: "Spitze minus Schaft: 4 − 1 = 3 und 1 − 5 = −4. Die umgekehrte Reihenfolge liefert den Gegenvektor BA→; addierte Koordinaten ergeben gar keinen Verbindungsvektor.",
  },
  lab: {
    kind: "vector-arrow",
    title: "Labor: Der Pfeil von A nach B",
    intro: "Ziehe die Punkte A und B. Blau ist der Verbindungsvektor AB→, orange sein Gegenvektor BA→. Die gestrichelten Katheten zeigen die Koordinaten, aus denen der Satz des Pythagoras die Länge macht.",
    params: [
      { type: "range", key: "ax", label: "x von A", unit: "", min: -6, max: 6, step: 1, value: -4 },
      { type: "range", key: "ay", label: "y von A", unit: "", min: -6, max: 6, step: 1, value: -2 },
      { type: "range", key: "bx", label: "x von B", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "by", label: "y von B", unit: "", min: -6, max: 6, step: 1, value: 1 },
    ],
    readouts: [
      { key: "ab", label: "AB→ (Spitze minus Schaft)", compute: (v) => `x = ${fmt(v.bx - v.ax)}, y = ${fmt(v.by - v.ay)}` },
      { key: "ba", label: "Gegenvektor BA→", compute: (v) => `x = ${fmt(v.ax - v.bx)}, y = ${fmt(v.ay - v.by)}` },
      { key: "len", label: "Länge |AB→|", unit: "LE", digits: 2, emphasis: true, compute: (v) => Math.hypot(v.bx - v.ax, v.by - v.ay) },
    ],
    goals: [
      {
        id: "betrag-fuenf",
        text: "Stelle einen Vektor AB→ mit dem Betrag 5 ein, der weder waagrecht noch senkrecht ist.",
        check: (v) => v.bx !== v.ax && v.by !== v.ay && Math.abs(Math.hypot(v.bx - v.ax, v.by - v.ay) - 5) < 1e-9,
      },
      {
        id: "gegenvektor",
        text: "Stelle A und B so ein, dass der Gegenvektor BA→ die Koordinaten x = 3 und y = −2 hat.",
        check: (v) => v.ax - v.bx === 3 && v.ay - v.by === -2,
      },
      {
        id: "schaft",
        text: "Lege B auf (1 | 4) und suche den Schaft A, sodass AB→ die Koordinaten x = 3 und y = 5 hat.",
        check: (v) => v.bx === 1 && v.by === 4 && v.ax === -2 && v.ay === -1,
      },
    ],
  },
  exercises: [
    {
      id: "verbindungsvektor",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let a: Vec;
          let b: Vec;
          do {
            a = vec(rng.int(-6, 6), rng.int(-6, 6));
            b = vec(rng.int(-6, 6), rng.int(-6, 6));
          } while (a.x === b.x || a.y === b.y);
          const d = sub(b, a);
          const square = d.x * d.x + d.y * d.y;
          const len = Math.sqrt(square);
          return {
            prompt: `Gegeben sind die Punkte ${named("A", a)} und ${named("B", b)}. Berechne die Koordinaten des Verbindungsvektors ${vn("AB")} und seine Länge.`,
            given: [named("A", a), named("B", b)],
            formulaHint: `${vn("AB")} = ${vecHtml("x<sub>B</sub> − x<sub>A</sub>", "y<sub>B</sub> − y<sub>A</sub>")}, |${vn("AB")}| = ${sqrtHtml("x² + y²")}`,
            fields: [
              numberField(`${vn("AB")}: x =`, d.x, "", 0, { slips: [{ value: -d.x, hint: "Spitze minus Schaft: x von B minus x von A, nicht umgekehrt." }] }),
              numberField("y =", d.y, "", 0, { slips: [{ value: -d.y, hint: "Spitze minus Schaft: y von B minus y von A, nicht umgekehrt." }] }),
              numberField(`|${vn("AB")}| =`, len, "LE", 2, {
                slips: [
                  { value: square, hint: "Das ist das Quadrat der Länge. Ziehe noch die Wurzel." },
                  { value: Math.abs(d.x) + Math.abs(d.y), hint: "Die Koordinaten sind die Katheten: Die Länge ist die Wurzel aus x² + y², nicht x + y." },
                ],
              }),
            ],
            steps: [
              `${vn("AB")} = ${vecHtml(diff(b.x, a.x), diff(b.y, a.y))} = ${colHtml(d, 0)}`,
              `|${vn("AB")}| = ${sqrtHtml(`${paren(d.x)}² + ${paren(d.y)}²`)} = ${sqrtHtml(fmt(square))}`,
              `<strong>${vn("AB")} = ${colHtml(d, 0)}, |${vn("AB")}| ${eqSign(len)} ${fmt(len)} LE</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
          };
        }
        // Parallelogramm ABCD: C = D ⊕ AB→
        let a: Vec;
        let u: Vec;
        let w: Vec;
        do {
          a = vec(rng.int(-5, 2), rng.int(-5, 1));
          u = vec(rng.int(2, 6), rng.int(-2, 3));
          w = vec(rng.int(-3, 2), rng.int(2, 6));
        } while (det(u, w) <= 0 || !fits(add(a, add(u, w)), 9));
        const b = add(a, u);
        const d = add(a, w);
        const c = add(d, u);
        const ac = sub(c, a);
        const square = ac.x * ac.x + ac.y * ac.y;
        const wrong = sub(d, u);
        return {
          prompt: `Die Punkte ${named("A", a)}, ${named("B", b)} und ${named("D", d)} sind Eckpunkte des Parallelogramms ABCD. Berechne die Koordinaten des Eckpunkts C und die Länge der Diagonalen [AC].`,
          given: [named("A", a), named("B", b), named("D", d), "Parallelogramm ABCD (Ecken gegen den Uhrzeigersinn)"],
          fields: [
            numberField("C: x =", c.x, "", 0, { slips: [{ value: wrong.x, hint: "Im Parallelogramm ABCD gilt DC→ = AB→, also C = D ⊕ AB→." }] }),
            numberField("y =", c.y, "", 0, { slips: [{ value: wrong.y, hint: "Im Parallelogramm ABCD gilt DC→ = AB→, also C = D ⊕ AB→." }] }),
            numberField("|AC| =", Math.sqrt(square), "LE", 2, { slips: [{ value: square, hint: "Das ist das Quadrat der Länge. Ziehe noch die Wurzel." }] }),
          ],
          steps: [
            `Im Parallelogramm ABCD ist ${vn("DC")} = ${vn("AB")} = ${vecHtml(diff(b.x, a.x), diff(b.y, a.y))} = ${colHtml(u, 0)}.`,
            `${vn("OC")} = ${vn("OD")} + ${vn("AB")} = ${colHtml(d, 0)} + ${colHtml(u, 0)} = ${colHtml(c, 0)}, also ${named("C", c)}.`,
            `${vn("AC")} = ${colHtml(ac, 0)}, |${vn("AC")}| = ${sqrtHtml(`${paren(ac.x)}² + ${paren(ac.y)}²`)} = ${sqrtHtml(fmt(square))}`,
            `<strong>${named("C", c)}, [AC] ${eqSign(Math.sqrt(square))} ${fmt(Math.sqrt(square))} LE</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, dx: d.x, dy: d.y },
        };
      },
    },
    {
      id: "punkt-plus-vektor",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const u = vec(nonZero(rng, 6), nonZero(rng, 6));
          const b = vec(rng.int(-5, 5), rng.int(-5, 5));
          const a = sub(b, u);
          const wrong = add(b, u);
          return {
            prompt: `Der Pfeil des Vektors ${vn("AB")} = ${colHtml(u, 0)} endet im Punkt ${named("B", b)}. Gib den Gegenvektor ${vn("BA")} an und berechne die Koordinaten des Anfangspunkts A.`,
            given: [`${vn("AB")} = ${colHtml(u, 0)}`, named("B", b)],
            formulaHint: `${vn("BA")} = −${vn("AB")}; ${vn("OA")} = ${vn("OB")} + ${vn("BA")}`,
            fields: [
              numberField(`${vn("BA")}: x =`, -u.x, "", 0),
              numberField("y =", -u.y, "", 0),
              numberField("A: x =", a.x, "", 0, { slips: [{ value: wrong.x, hint: "Du bist in Pfeilrichtung weitergegangen. A ist der Schaft: Gehe von B mit dem Gegenvektor zurück." }] }),
              numberField("y =", a.y, "", 0, { slips: [{ value: wrong.y, hint: "Du bist in Pfeilrichtung weitergegangen. A ist der Schaft: Gehe von B mit dem Gegenvektor zurück." }] }),
            ],
            steps: [
              `${vn("BA")} = −${vn("AB")} = ${colHtml(mul(-1, u), 0)}`,
              `${vn("OA")} = ${vn("OB")} + ${vn("BA")} = ${colHtml(b, 0)} + ${colHtml(mul(-1, u), 0)} = ${colHtml(a, 0)}`,
              `<strong>${vn("BA")} = ${colHtml(mul(-1, u), 0)}, ${named("A", a)}</strong>`,
            ],
            meta: { ux: u.x, uy: u.y, bx: b.x, by: b.y },
          };
        }
        const s = vec(rng.int(-4, 4), rng.int(-4, 4));
        let v1: Vec;
        let v2: Vec;
        do {
          v1 = vec(nonZero(rng, 5), rng.int(-5, 5));
          v2 = vec(rng.int(-5, 5), nonZero(rng, 5));
        } while (Math.abs(det(v1, v2)) < 1e-9 || norm(add(v1, v2)) === 0);
        const sl = add(v1, v2);
        const l = add(s, sl);
        const dist = 10 * norm(sl);
        return {
          prompt: `Eine Drohne startet im Punkt ${named("S", s)} eines Koordinatensystems mit 1 LE = 10 m. Sie fliegt zuerst um ${vn("v")} = ${colHtml(v1, 0)} und dann um ${vn("w")} = ${colHtml(v2, 0)}. In welchem Punkt L landet sie, und wie weit ist L in Luftlinie vom Start entfernt?`,
          given: [named("S", s), `${vn("v")} = ${colHtml(v1, 0)}`, `${vn("w")} = ${colHtml(v2, 0)}`, "1 LE = 10 m"],
          fields: [
            numberField("L: x =", l.x, "", 0),
            numberField("y =", l.y, "", 0),
            numberField("Luftlinie:", dist, "m", 1, {
              slips: [
                { value: 10 * (norm(v1) + norm(v2)), hint: "Das ist der Flugweg. Die Luftlinie ist die Länge des einen Pfeils von S nach L." },
                { value: norm(sl), hint: "Das ist die Länge in LE. Rechne noch in Meter um: 1 LE = 10 m." },
              ],
            }),
          ],
          steps: [
            `${vn("SL")} = ${vn("v")} + ${vn("w")} = ${colHtml(v1, 0)} + ${colHtml(v2, 0)} = ${colHtml(sl, 0)}`,
            `${vn("OL")} = ${vn("OS")} + ${vn("SL")} = ${colHtml(s, 0)} + ${colHtml(sl, 0)} = ${colHtml(l, 0)}`,
            `|${vn("SL")}| = ${sqrtHtml(`${paren(sl.x)}² + ${paren(sl.y)}²`)} ${eqSign(norm(sl))} ${fmt(norm(sl))} LE`,
            `<strong>${named("L", l)}, Luftlinie ${eqSign(dist, 1)} ${fmt(dist, 1)} m</strong>`,
          ],
          meta: { sx: s.x, sy: s.y, v1x: v1.x, v1y: v1.y, v2x: v2.x, v2y: v2.y },
        };
      },
    },
    {
      id: "betrag",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const v = vec(nonZero(rng, 9), nonZero(rng, 9));
          const k = rng.pick([-3, -2, -0.5, 0.5, 2, 3]);
          const len = norm(v);
          const square = v.x * v.x + v.y * v.y;
          return {
            prompt: `Berechne den Betrag des Vektors ${vn("v")} = ${colHtml(v, 0)} und den Betrag des Vektors ${fmt(k)} · ${vn("v")}.`,
            given: [`${vn("v")} = ${colHtml(v, 0)}`, `k = ${fmt(k)}`],
            formulaHint: `|${vn("v")}| = ${sqrtHtml("v<sub>x</sub>² + v<sub>y</sub>²")}, |k · ${vn("v")}| = |k| · |${vn("v")}|`,
            fields: [
              numberField(`|${vn("v")}| =`, len, "LE", 2, { slips: [{ value: square, hint: "Das ist das Quadrat des Betrags. Ziehe noch die Wurzel." }] }),
              numberField(`|${fmt(k)} · ${vn("v")}| =`, Math.abs(k) * len, "LE", 2, { slips: [{ value: k * len, hint: "Ein Betrag ist nie negativ: |k · v→| = |k| · |v→|." }] }),
            ],
            steps: [
              `|${vn("v")}| = ${sqrtHtml(`${paren(v.x)}² + ${paren(v.y)}²`)} = ${sqrtHtml(fmt(square))} ${eqSign(len)} ${fmt(len)} LE`,
              `${fmt(k)} · ${vn("v")} = ${colHtml(mul(k, v), 2)} ist ${fmt(Math.abs(k))}-mal so lang${k < 0 ? " und zeigt in die Gegenrichtung" : ""}.`,
              `<strong>|${vn("v")}| ${eqSign(len)} ${fmt(len)} LE, |${fmt(k)} · ${vn("v")}| ${eqSign(Math.abs(k) * len)} ${fmt(Math.abs(k) * len)} LE</strong>`,
            ],
            meta: { vx: v.x, vy: v.y, k },
          };
        }
        const [p, q, d] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [6, 8, 10],
          [8, 6, 10],
          [5, 12, 13],
          [12, 5, 13],
        ] as const);
        const a = vec(rng.int(-4, 4), rng.int(-4, 4));
        const c = a.y + p * rng.sign();
        const x1 = a.x + q;
        const x2 = a.x - q;
        return {
          prompt: `Der Punkt P(x | ${fmt(c)}) soll vom Punkt ${named("A", a)} genau ${fmt(d)} LE entfernt sein. Berechne die beiden möglichen Werte für x.`,
          given: [named("A", a), `P(x | ${fmt(c)})`, `|${vn("AP")}| = ${fmt(d)} LE`],
          fields: [numberField("x₁ =", x1, "", 0), numberField("x₂ =", x2, "", 0)],
          anyOrder: [0, 1],
          steps: [
            `${vn("AP")} = ${vecHtml(xMinus(a.x), diff(c, a.y))} = ${vecHtml(xMinus(a.x), fmt(c - a.y))}`,
            `(${xMinus(a.x)})² + ${paren(c - a.y)}² = ${fmt(d)}², also (${xMinus(a.x)})² = ${fmt(d * d)} − ${fmt(p * p)} = ${fmt(q * q)}`,
            `${xMinus(a.x)} = ${fmt(q)} oder ${xMinus(a.x)} = −${fmt(q)}`,
            `<strong>x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, c, d },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bildest Verbindungs- und Gegenvektoren mit „Spitze minus Schaft“ und berechnest ihre Länge mit Pythagoras.",
};

// 3.2 Das Skalarprodukt ──────────────────────────────────────────────────────

/** Two vectors with whole coordinates that are neither parallel nor perpendicular. */
function vectorPair(rng: Rng, max: number): [Vec, Vec] {
  let a: Vec;
  let b: Vec;
  do {
    a = vec(nonZero(rng, max), rng.int(-max, max));
    b = vec(rng.int(-max, max), nonZero(rng, max));
  } while (det(a, b) === 0 || dot(a, b) === 0);
  return [a, b];
}

const KINDS = ["spitz", "rechtwinklig (senkrecht)", "stumpf"];
const kindIndex = (a: Vec, b: Vec): number => {
  const s = dot(a, b);
  return s > 0 ? 0 : s === 0 ? 1 : 2;
};

const skalarprodukt: Lesson = {
  id: "vk-2-skalarprodukt",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Das Skalarprodukt: Orthogonalität und Winkel",
  subtitle: "Eine Zahl aus zwei Vektoren verrät den Winkel",
  tracks: ["I"],
  lehrplan: `${LB1}: Skalarprodukt, Orthogonalität und Winkelmaß`,
  whyItMatters:
    "Ob zwei Wände senkrecht aufeinander stehen oder unter welchem Winkel zwei Wege abzweigen, verrät eine einzige Zahl: das Skalarprodukt. Damit prüfst du rechte Winkel und berechnest Winkelmaße, ohne zu zeichnen.",
  explanationHtml: `
    <p>Das <strong>Skalarprodukt</strong> zweier Vektoren ${vn("a")} = ${vecHtml("a<sub>x</sub>", "a<sub>y</sub>")} und ${vn("b")} = ${vecHtml("b<sub>x</sub>", "b<sub>y</sub>")} ist eine Zahl (ein Skalar): Man multipliziert die x-Koordinaten, multipliziert die y-Koordinaten und addiert die beiden Produkte.</p>
    <p class="formula-line">${vn("a")} ⊙ ${vn("b")} = a<sub>x</sub> · b<sub>x</sub> + a<sub>y</sub> · b<sub>y</sub></p>
    <p>Das Zeichen ⊙ steht so auch in der Merkhilfe. Das Ergebnis verrät die Lage der beiden Vektoren (beide verschieden vom Nullvektor):</p>
    <ul>
      <li>${vn("a")} ⊙ ${vn("b")} = 0: Die Vektoren stehen <strong>senkrecht (orthogonal)</strong> aufeinander, ${vn("a")} ⊥ ${vn("b")}.</li>
      <li>${vn("a")} ⊙ ${vn("b")} &gt; 0: Sie schließen einen <strong>spitzen</strong> Winkel ein (kleiner als 90°).</li>
      <li>${vn("a")} ⊙ ${vn("b")} &lt; 0: Sie schließen einen <strong>stumpfen</strong> Winkel ein (größer als 90°).</li>
    </ul>
    <p>Genauer gilt ${vn("a")} ⊙ ${vn("b")} = |${vn("a")}| · |${vn("b")}| · cos φ. Daraus folgt das <strong>Maß φ des Winkels</strong> zwischen den Vektoren, mit 0° ≤ φ ≤ 180°:</p>
    <p class="formula-line">cos φ = ${frac(`${vn("a")} ⊙ ${vn("b")}`, `|${vn("a")}| · |${vn("b")}|`)}</p>
    <div class="example">Beispiel 1: ${vn("a")} = ${vecHtml(2, 3)}, ${vn("b")} = ${vecHtml(6, -4)}. ${vn("a")} ⊙ ${vn("b")} = 2 · 6 + 3 · (−4) = 12 − 12 = 0, also stehen die Vektoren senkrecht aufeinander.<br>Beispiel 2: ${vn("u")} = ${vecHtml(3, 1)}, ${vn("v")} = ${vecHtml(-1, 2)}. ${vn("u")} ⊙ ${vn("v")} = 3 · (−1) + 1 · 2 = −1, |${vn("u")}| = ${sqrtHtml("10")}, |${vn("v")}| = ${sqrtHtml("5")}. cos φ = −1 : (${sqrtHtml("10")} · ${sqrtHtml("5")}) ≈ −0,1414, also φ ≈ 98,13°: ein stumpfer Winkel.</div>
    <div class="merke"><strong>Merke:</strong> Skalarprodukt 0 ⇔ senkrecht. Für das Winkelmaß teilst du das Skalarprodukt durch das Produkt der Beträge und wendest cos⁻¹ an; der Taschenrechner steht auf DEG.</div>
  `,
  formulas: [
    { name: "Skalarprodukt", html: `${vn("a")} ⊙ ${vn("b")} = a<sub>x</sub> · b<sub>x</sub> + a<sub>y</sub> · b<sub>y</sub>`, quantities: "Das Ergebnis ist eine Zahl (Skalar)." },
    { name: "Orthogonalität", html: `${vn("a")} ⊥ ${vn("b")} ⇔ ${vn("a")} ⊙ ${vn("b")} = 0`, quantities: "für Vektoren, die nicht der Nullvektor sind" },
    { name: "Winkel zwischen Vektoren", html: `cos φ = ${frac(`${vn("a")} ⊙ ${vn("b")}`, `|${vn("a")}| · |${vn("b")}|`)}`, quantities: "φ zwischen 0° und 180°" },
  ],
  quiz: {
    question: "Für zwei Vektoren gilt a→ ⊙ b→ = −6. Was folgt daraus?",
    options: ["Sie schließen einen stumpfen Winkel ein.", "Sie stehen senkrecht aufeinander.", "Sie schließen einen spitzen Winkel ein."],
    correctIndex: 0,
    explanation: "Ein negatives Skalarprodukt bedeutet cos φ < 0, also liegt φ zwischen 90° und 180°. Senkrecht wären die Vektoren nur bei a→ ⊙ b→ = 0.",
  },
  lab: {
    kind: "dot-product",
    title: "Labor: Skalarprodukt und Winkel",
    intro: "Ziehe die Spitzen der Vektoren a→ und b→. Rechts siehst du das Skalarprodukt, die Beträge und das Winkelmaß φ.",
    params: [
      { type: "range", key: "ax", label: "x von a→", unit: "", min: -5, max: 5, step: 1, value: 4 },
      { type: "range", key: "ay", label: "y von a→", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "bx", label: "x von b→", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "by", label: "y von b→", unit: "", min: -5, max: 5, step: 1, value: 3 },
    ],
    readouts: [
      { key: "dot", label: "a→ ⊙ b→", digits: 0, emphasis: true, compute: (v) => v.ax * v.bx + v.ay * v.by },
      { key: "la", label: "|a→|", digits: 2, compute: (v) => Math.hypot(v.ax, v.ay) },
      { key: "lb", label: "|b→|", digits: 2, compute: (v) => Math.hypot(v.bx, v.by) },
      { key: "phi", label: "Winkel φ", unit: "°", digits: 2, compute: (v) => angleBetween(vec(v.ax, v.ay), vec(v.bx, v.by)) ?? "nicht definiert (Nullvektor)" },
      { key: "kind", label: "Lage", compute: (v) => angleKind(vec(v.ax, v.ay), vec(v.bx, v.by)) ?? "Nullvektor: keine Richtung" },
    ],
    goals: [
      {
        id: "senkrecht",
        text: "Stelle b→ senkrecht zu einem schräg liegenden a→ (keine Koordinate von a→ ist 0).",
        check: (v) => v.ax !== 0 && v.ay !== 0 && (v.bx !== 0 || v.by !== 0) && v.ax * v.bx + v.ay * v.by === 0,
      },
      {
        id: "stumpf",
        text: "Erzeuge einen stumpfen Winkel. Welches Vorzeichen hat das Skalarprodukt dann?",
        check: (v) => (v.ax !== 0 || v.ay !== 0) && (v.bx !== 0 || v.by !== 0) && v.ax * v.bx + v.ay * v.by < 0,
      },
      {
        id: "fuenfundvierzig",
        text: "Stelle einen Winkel von genau 45° zwischen a→ und b→ ein.",
        check: (v) => {
          const phi = angleBetween(vec(v.ax, v.ay), vec(v.bx, v.by));
          return phi !== null && Math.abs(phi - 45) < 1e-6;
        },
      },
    ],
  },
  exercises: [
    {
      id: "orthogonal",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = vec(nonZero(rng, 6), nonZero(rng, 6));
          const ortho = rng.next() < 0.5;
          let b: Vec;
          if (ortho) {
            const k = rng.pick([1, -1, 2, -2]);
            b = vec(-a.y * k, a.x * k);
            if (!fits(b, 9)) b = vec(-a.y * Math.sign(k), a.x * Math.sign(k));
          } else {
            do {
              b = vec(nonZero(rng, 6), rng.int(-6, 6));
            } while (dot(a, b) === 0);
          }
          const s = dot(a, b);
          return {
            prompt: `Berechne das Skalarprodukt der Vektoren ${vn("a")} = ${colHtml(a, 0)} und ${vn("b")} = ${colHtml(b, 0)}. Stehen die Vektoren senkrecht aufeinander?`,
            given: [`${vn("a")} = ${colHtml(a, 0)}`, `${vn("b")} = ${colHtml(b, 0)}`],
            formulaHint: `${vn("a")} ⊙ ${vn("b")} = a<sub>x</sub> · b<sub>x</sub> + a<sub>y</sub> · b<sub>y</sub>; senkrecht genau dann, wenn das Ergebnis 0 ist`,
            fields: [
              numberField(`${vn("a")} ⊙ ${vn("b")} =`, s, "", 0, {
                slips: [
                  { value: a.x * b.x - a.y * b.y, hint: "Die beiden Produkte werden addiert, nicht subtrahiert." },
                  { value: a.x * b.y + a.y * b.x, hint: "Multipliziere x-Koordinate mit x-Koordinate und y-Koordinate mit y-Koordinate, nicht über Kreuz." },
                ],
              }),
              yesNo("senkrecht?", ortho),
            ],
            steps: [
              `${vn("a")} ⊙ ${vn("b")} = ${times(a.x, b.x)} + ${times(a.y, b.y)} = ${fmt(a.x * b.x)} + ${paren(a.y * b.y)} = ${fmt(s)}`,
              `<strong>${vn("a")} ⊙ ${vn("b")} = ${fmt(s)}: ${ortho ? "Die Vektoren stehen senkrecht aufeinander." : "Die Vektoren stehen nicht senkrecht aufeinander."}</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
          };
        }
        let p: number;
        let q: number;
        let r: number;
        let t: number;
        do {
          p = nonZero(rng, 6);
          q = rng.pick([-5, -4, -2, -1, 1, 2, 4, 5]);
          r = nonZero(rng, 6);
          t = (-p * r) / q;
        } while (Math.abs(t + 3.5) < 1e-9 || Math.abs(t) > 12);
        return {
          prompt: `Die Punkte A(t | ${fmt(p)}) und ${named("B", vec(q, r))} bilden zusammen mit dem Ursprung O das Dreieck OAB. Für welchen Wert von t hat das Dreieck bei O einen rechten Winkel?`,
          given: [`A(t | ${fmt(p)})`, named("B", vec(q, r)), "rechter Winkel bei O"],
          fields: [numberField("t =", t, "", 2, { slips: [{ value: -t, hint: "Prüfe das Vorzeichen beim Auflösen nach t." }] })],
          steps: [
            `Rechter Winkel bei O: ${vn("OA")} ⊙ ${vn("OB")} = 0 mit ${vn("OA")} = ${vecHtml("t", fmt(p))} und ${vn("OB")} = ${vecHtml(q, r)}.`,
            `t · ${paren(q)} + ${times(p, r)} = 0, also ${fmt(q)}t = ${fmt(-p * r)}`,
            `<strong>t = ${fmt(t)}</strong>`,
          ],
          meta: { p, q, r },
        };
      },
    },
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const [a, b] = vectorPair(rng, 6);
          const s = dot(a, b);
          const n = norm(a) * norm(b);
          const phi = acosDeg(s / n);
          return {
            prompt: `Berechne das Skalarprodukt und das Maß φ des Winkels zwischen ${vn("a")} = ${colHtml(a, 0)} und ${vn("b")} = ${colHtml(b, 0)}.`,
            given: [`${vn("a")} = ${colHtml(a, 0)}`, `${vn("b")} = ${colHtml(b, 0)}`],
            formulaHint: `cos φ = ${frac(`${vn("a")} ⊙ ${vn("b")}`, `|${vn("a")}| · |${vn("b")}|`)}`,
            fields: [
              numberField(`${vn("a")} ⊙ ${vn("b")} =`, s, "", 0),
              numberField("φ =", phi, "°", 2, {
                slips: [
                  { value: Math.acos(s / n), hint: RAD_HINT },
                  { value: 180 - phi, hint: "Prüfe das Vorzeichen des Skalarprodukts: Bei negativem Wert ist der Winkel stumpf." },
                ],
              }),
            ],
            steps: [
              `${vn("a")} ⊙ ${vn("b")} = ${times(a.x, b.x)} + ${times(a.y, b.y)} = ${fmt(s)}`,
              `|${vn("a")}| = ${root(dot(a, a))}, |${vn("b")}| = ${root(dot(b, b))}`,
              `cos φ = ${fmt(s)} : (${root(dot(a, a))} · ${root(dot(b, b))}) ≈ ${fmt(s / n, 4)}`,
              `<strong>${vn("a")} ⊙ ${vn("b")} = ${fmt(s)}, φ ≈ ${fmt(phi)}°</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
          };
        }
        const p = vec(rng.int(-3, 3), rng.int(-3, 3));
        const [u, w] = vectorPair(rng, 7);
        const h = add(p, u);
        const q = add(p, w);
        const s = dot(u, w);
        const phi = acosDeg(s / (norm(u) * norm(w)));
        return {
          prompt: `Zwei gerade Wanderwege beginnen am Parkplatz ${named("P", p)}. Der eine führt zur Hütte ${named("H", h)}, der andere zum Aussichtspunkt ${named("A", q)} (Koordinaten in 100 m). Berechne das Maß des Winkels ∢HPA zwischen den beiden Wegen.`,
          given: [named("P", p), named("H", h), named("A", q)],
          fields: [
            numberField("∢HPA =", phi, "°", 2, {
              slips: [
                { value: Math.acos(s / (norm(u) * norm(w))), hint: RAD_HINT },
                { value: 180 - phi, hint: "Beide Vektoren müssen im Scheitel P beginnen: PH→ und PA→." },
              ],
            }),
          ],
          steps: [
            `${vn("PH")} = ${colHtml(u, 0)}, ${vn("PA")} = ${colHtml(w, 0)}`,
            `${vn("PH")} ⊙ ${vn("PA")} = ${times(u.x, w.x)} + ${times(u.y, w.y)} = ${fmt(s)}`,
            `cos φ = ${fmt(s)} : (${root(dot(u, u))} · ${root(dot(w, w))}) ≈ ${fmt(s / (norm(u) * norm(w)), 4)}`,
            `<strong>∢HPA ≈ ${fmt(phi)}°</strong>`,
          ],
          meta: { px: p.x, py: p.y, hx: h.x, hy: h.y, qx: q.x, qy: q.y },
        };
      },
    },
    {
      id: "winkelart",
      make: (rng, level): ExerciseTask => {
        const wanted = rng.int(0, 2);
        let a: Vec;
        let b: Vec;
        do {
          a = vec(nonZero(rng, 6), rng.int(-6, 6));
          b = wanted === 1 ? mul(rng.pick([1, -1]), vec(-a.y, a.x)) : vec(rng.int(-6, 6), nonZero(rng, 6));
        } while (kindIndex(a, b) !== wanted || det(a, b) === 0);
        const s = dot(a, b);
        if (level === 1) {
          return {
            prompt: `Berechne das Skalarprodukt von ${vn("a")} = ${colHtml(a, 0)} und ${vn("b")} = ${colHtml(b, 0)} und entscheide, welche Art von Winkel die Vektoren einschließen.`,
            given: [`${vn("a")} = ${colHtml(a, 0)}`, `${vn("b")} = ${colHtml(b, 0)}`],
            formulaHint: "positiv: spitz · 0: rechtwinklig · negativ: stumpf",
            fields: [numberField(`${vn("a")} ⊙ ${vn("b")} =`, s, "", 0), choiceField("Winkel", KINDS, wanted)],
            steps: [`${vn("a")} ⊙ ${vn("b")} = ${times(a.x, b.x)} + ${times(a.y, b.y)} = ${fmt(s)}`, `<strong>${fmt(s)} ${s > 0 ? "> 0: spitzer Winkel" : s === 0 ? "= 0: rechter Winkel" : "< 0: stumpfer Winkel"}</strong>`],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
          };
        }
        const pa = vec(rng.int(-3, 3), rng.int(-3, 3));
        const pb = add(pa, a);
        const pc = add(pa, b);
        return {
          prompt: `Gegeben ist das Dreieck ABC mit ${named("A", pa)}, ${named("B", pb)} und ${named("C", pc)}. Begründe mit dem Skalarprodukt, ob der Innenwinkel bei A spitz, recht oder stumpf ist.`,
          given: [named("A", pa), named("B", pb), named("C", pc)],
          fields: [numberField(`${vn("AB")} ⊙ ${vn("AC")} =`, s, "", 0), choiceField("Winkel bei A", KINDS, wanted)],
          steps: [
            `Beide Vektoren beginnen im Scheitel A: ${vn("AB")} = ${colHtml(a, 0)}, ${vn("AC")} = ${colHtml(b, 0)}.`,
            `${vn("AB")} ⊙ ${vn("AC")} = ${times(a.x, b.x)} + ${times(a.y, b.y)} = ${fmt(s)}`,
            `<strong>${fmt(s)} ${s > 0 ? "> 0: Der Winkel bei A ist spitz." : s === 0 ? "= 0: Der Winkel bei A ist ein rechter." : "< 0: Der Winkel bei A ist stumpf."}</strong>`,
          ],
          meta: { ax: pa.x, ay: pa.y, bx: pb.x, by: pb.y, cx: pc.x, cy: pc.y },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Skalarprodukte, erkennst senkrechte Vektoren und bestimmst Winkelmaße.",
};

// 3.3 Lot, Abstand und besondere Punkte ──────────────────────────────────────

/** Slopes with a direction u = (u_x | u_y) and a normal n with whole coordinates. */
const SLOPES: Array<{ m: number; u: Vec; n: Vec }> = [
  { m: 0.5, u: vec(2, 1), n: vec(-1, 2) },
  { m: -0.5, u: vec(2, -1), n: vec(1, 2) },
  { m: 2, u: vec(1, 2), n: vec(-2, 1) },
  { m: -2, u: vec(1, -2), n: vec(2, 1) },
  { m: 1, u: vec(1, 1), n: vec(-1, 1) },
  { m: -1, u: vec(1, -1), n: vec(1, 1) },
];

/** A point P and a line y = m·x + t with a foot F of whole coordinates. */
function footTask(rng: Rng): { m: number; t: number; u: Vec; f: Vec; p: Vec } {
  const { m, u, n } = rng.pick(SLOPES);
  const fx = Math.abs(m) === 0.5 ? 2 * rng.int(-2, 2) : rng.int(-3, 3);
  const t = rng.int(-3, 3);
  const f = vec(fx, m * fx + t);
  const p = add(f, mul(rng.pick([-2, -1, 1, 2]), n));
  return { m, t, u, f, p };
}

const abstand: Lesson = {
  id: "vk-3-abstand",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Lot, Abstand und besondere Punkte",
  subtitle: "Rechte Winkel nachweisen, Lotfußpunkte berechnen",
  tracks: ["I"],
  lehrplan: `${LB1}: Skalarprodukt, Abstand von Punkt und Gerade`,
  whyItMatters:
    "Wie weit ist ein Haus von einer geraden Straße entfernt? Der kürzeste Weg trifft die Straße im rechten Winkel, und den findest du mit dem Skalarprodukt. Genauso weist du rechte Winkel in Dreiecken und Vierecken nach.",
  explanationHtml: `
    <p>Mit dem Skalarprodukt löst du Aufgaben der ebenen Geometrie rechnerisch:</p>
    <ul>
      <li><strong>Nachweis eines rechten Winkels:</strong> Im Dreieck ABC ist der Winkel bei B ein rechter, wenn ${vn("BA")} ⊙ ${vn("BC")} = 0 ist. Beide Vektoren beginnen im Scheitel B.</li>
      <li><strong>Winkelmaß im Dreieck:</strong> Der Innenwinkel α bei A liegt zwischen ${vn("AB")} und ${vn("AC")}: cos α = ${frac(`${vn("AB")} ⊙ ${vn("AC")}`, `|${vn("AB")}| · |${vn("AC")}|`)}. Nimmst du versehentlich ${vn("CA")}, erhältst du 180° − α.</li>
      <li><strong>Lotfußpunkt und Abstand:</strong> Die Gerade g: y = m · x + t hat den Richtungsvektor ${vn("u")} = ${vecHtml(1, "m")} (oder ein Vielfaches davon). Ihre Punkte sind F(x | m · x + t). Der <strong>Lotfußpunkt</strong> des Lotes von P auf g ist der Punkt F mit ${vn("PF")} ⊙ ${vn("u")} = 0. Der <strong>Abstand</strong> von P zu g ist d(P; g) = |${vn("PF")}|; jeder andere Punkt von g ist weiter von P entfernt.</li>
      <li><strong>Punkte mit besonderen Eigenschaften:</strong> Soll ein Punkt C(x | m · x + t) der Geraden g zum Beispiel bei B einen rechten Winkel erzeugen, setzt du ${vn("BA")} ⊙ ${vn("BC")} = 0 an und löst nach x auf.</li>
    </ul>
    <div class="example">Beispiel: P(1 | 6) und g: y = 0,5x + 1 mit ${vn("u")} = ${vecHtml(2, 1)}, dem Doppelten von ${vecHtml(1, "0,5")}. F(x | 0,5x + 1), also ${vn("PF")} = ${vecHtml("x − 1", "0,5x − 5")}.<br>${vn("PF")} ⊙ ${vn("u")} = 2 · (x − 1) + 1 · (0,5x − 5) = 2,5x − 7 = 0, also x = 2,8 und F(2,8 | 2,4).<br>${vn("PF")} = ${vecHtml("1,8", "−3,6")}, d(P; g) = ${sqrtHtml("1,8² + 3,6²")} = ${sqrtHtml("16,2")} ≈ 4,02 LE.</div>
    <div class="merke"><strong>Merke:</strong> Lotfußpunkt: allgemeinen Punkt F der Geraden aufstellen, ${vn("PF")} ⊙ ${vn("u")} = 0 nach x auflösen, Abstand = |${vn("PF")}|.</div>
  `,
  formulas: [
    { name: "Rechter Winkel bei B", html: `∢ABC = 90° ⇔ ${vn("BA")} ⊙ ${vn("BC")} = 0`, quantities: "Beide Vektoren beginnen im Scheitel B." },
    { name: "Lotfußpunkt F auf g", html: `${vn("PF")} ⊙ ${vn("u")} = 0`, quantities: "F(x | m · x + t) auf g: y = m · x + t, Richtungsvektor u→ mit den Koordinaten 1 und m" },
    { name: "Abstand Punkt–Gerade", html: `d(P; g) = |${vn("PF")}|`, quantities: "F ist der Lotfußpunkt des Lotes von P auf g" },
  ],
  quiz: {
    question: "Im Dreieck ABC soll der Winkel bei A ein rechter sein. Welche Gleichung musst du prüfen?",
    options: ["AB→ ⊙ AC→ = 0", "AB→ ⊙ BC→ = 0", "BA→ ⊙ BC→ = 0"],
    correctIndex: 0,
    explanation: "Der Winkel bei A liegt zwischen den Seiten [AB] und [AC]. Beide Vektoren müssen im Scheitel A beginnen: AB→ ⊙ AC→ = 0. Die Gleichung BA→ ⊙ BC→ = 0 prüft den Winkel bei B.",
  },
  lab: {
    kind: "point-line-distance",
    title: "Labor: Lot und kürzester Abstand",
    intro: "Ziehe den Punkt F auf der Geraden, bis PF→ senkrecht auf g steht. Der Kreis um P zeigt: Nur am Lotfußpunkt berührt er die Gerade, dort ist der Abstand am kleinsten.",
    params: [
      { type: "choice", key: "g", label: "Gerade", options: Object.entries(LINES).map(([value, g]) => ({ value: Number(value), label: g.label })), value: 1 },
      { type: "range", key: "px", label: "x von P", unit: "", min: -5, max: 5, step: 1, value: -3 },
      { type: "range", key: "py", label: "y von P", unit: "", min: -5, max: 5, step: 1, value: 4 },
      { type: "range", key: "fx", label: "x von F", unit: "", min: -6, max: 6, step: 0.1, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "F", label: "F auf g", compute: (v) => named("F", footPoint(v)) },
      { key: "dot", label: "PF→ ⊙ u→", digits: 2, compute: (v) => dot(sub(footPoint(v), vec(v.px, v.py)), lineOf(v).u) },
      { key: "pf", label: "|PF→|", unit: "LE", digits: 2, emphasis: true, compute: (v) => norm(sub(footPoint(v), vec(v.px, v.py))) },
    ],
    goals: [
      {
        id: "lot",
        text: "Ziehe F auf den Lotfußpunkt: PF→ steht senkrecht auf g (P liegt nicht auf g).",
        check: (v) => {
          const g = lineOf(v);
          const p = vec(v.px, v.py);
          return Math.abs(g.m * p.x + g.t - p.y) > 1e-9 && Math.abs(dot(sub(footPoint(v), p), g.u)) < 1e-9;
        },
      },
      {
        id: "abstand",
        text: "Wähle g₂: y = −x und lege P so, dass sein Abstand von g₂ genau √8 ≈ 2,83 LE beträgt. Zeige den Abstand mit F am Lotfußpunkt.",
        check: (v) => {
          const p = vec(v.px, v.py);
          return v.g === 2 && Math.abs(Math.abs(p.x + p.y) - 4) < 1e-9 && Math.abs(dot(sub(footPoint(v), p), LINES[2].u)) < 1e-9;
        },
      },
      {
        id: "fusspunkt",
        text: "Wähle g₁ und lege P so, dass das Lot von P auf g₁ den Fußpunkt F(2 | 2) hat. Ziehe F zur Kontrolle dorthin.",
        check: (v) => {
          const p = vec(v.px, v.py);
          return v.g === 1 && same(footOn(LINES[1], p), vec(2, 2)) && Math.abs(v.fx - 2) < 1e-9 && Math.abs(0.5 * p.x + 1 - p.y) > 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "rechter-winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const right = rng.next() < 0.5;
          let s: Vec;
          let u: Vec;
          let w: Vec;
          do {
            s = vec(rng.int(-3, 3), rng.int(-3, 3));
            u = vec(nonZero(rng, 5), nonZero(rng, 4));
            w = right ? mul(rng.pick([1, -1]), vec(-u.y, u.x)) : vec(rng.int(-5, 5), nonZero(rng, 5));
          } while (det(u, w) === 0 || (!right && dot(u, w) === 0) || !fits(add(s, u), 8) || !fits(add(s, w), 8));
          // u and w start in the vertex V; name the corners so that V is A, B or C
          const vertex = rng.pick(["A", "B", "C"] as const);
          const others = { A: ["B", "C"], B: ["A", "C"], C: ["A", "B"] }[vertex];
          const corners: Record<string, Vec> = { [vertex]: s, [others[0]]: add(s, u), [others[1]]: add(s, w) };
          const product = dot(u, w);
          const name1 = `${vertex}${others[0]}`;
          const name2 = `${vertex}${others[1]}`;
          return {
            prompt: `Prüfe rechnerisch, ob das Dreieck ABC mit ${named("A", corners.A)}, ${named("B", corners.B)} und ${named("C", corners.C)} bei ${vertex} einen rechten Winkel hat.`,
            given: [named("A", corners.A), named("B", corners.B), named("C", corners.C)],
            formulaHint: `Rechter Winkel bei ${vertex} ⇔ ${vn(name1)} ⊙ ${vn(name2)} = 0`,
            fields: [numberField(`${vn(name1)} ⊙ ${vn(name2)} =`, product, "", 0), yesNo(`rechter Winkel bei ${vertex}?`, right)],
            steps: [
              `${vn(name1)} = ${colHtml(u, 0)}, ${vn(name2)} = ${colHtml(w, 0)}`,
              `${vn(name1)} ⊙ ${vn(name2)} = ${times(u.x, w.x)} + ${times(u.y, w.y)} = ${fmt(product)}`,
              `<strong>${right ? `Das Skalarprodukt ist 0: Bei ${vertex} liegt ein rechter Winkel.` : `${fmt(product)} ≠ 0: Bei ${vertex} liegt kein rechter Winkel.`}</strong>`,
            ],
            meta: { ax: corners.A.x, ay: corners.A.y, bx: corners.B.x, by: corners.B.y, cx: corners.C.x, cy: corners.C.y, vertex: ["A", "B", "C"].indexOf(vertex) },
          };
        }
        let b: Vec;
        let ba: Vec;
        let k: number;
        let m: number;
        let c: Vec;
        do {
          b = vec(rng.int(-3, 3), rng.int(-3, 3));
          ba = vec(nonZero(rng, 4), nonZero(rng, 4));
          k = rng.pick([1, -1, 2, -2]);
          m = rng.pick([0.5, -0.5, 2, -2, 1, -1]);
          c = add(b, mul(k, vec(-ba.y, ba.x)));
        } while (ba.x + ba.y * m === 0 || !fits(c, 8) || !fits(add(b, ba), 8));
        const a = add(b, ba);
        const t = c.y - m * c.x;
        const k1 = ba.x + ba.y * m;
        const k0 = -ba.x * b.x + ba.y * (t - b.y);
        return {
          prompt: `Gegeben sind ${named("A", a)} und ${named("B", b)}. Die Punkte C<sub>n</sub>(x | ${linear(m, t)}) liegen auf der Geraden g: y = ${linear(m, t)}. Für welchen Punkt C der Geraden g ist das Dreieck ABC bei B rechtwinklig? Berechne seine Koordinaten.`,
          given: [named("A", a), named("B", b), `g: y = ${linear(m, t)}`],
          fields: [numberField("C: x =", c.x, "", 2), numberField("y =", c.y, "", 2)],
          steps: [
            `${vn("BA")} = ${colHtml(ba, 0)}, ${vn("BC<sub>n</sub>")} = ${vecHtml(xMinus(b.x), linear(m, t - b.y))}`,
            `${vn("BA")} ⊙ ${vn("BC<sub>n</sub>")} = ${paren(ba.x)} · (${xMinus(b.x)}) + ${paren(ba.y)} · (${linear(m, t - b.y)}) = 0`,
            `${linear(k1, k0)} = 0, also x = ${fmt(c.x)}`,
            `<strong>${named("C", c)}</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, m, t },
        };
      },
    },
    {
      id: "innenwinkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = vec(rng.int(-3, 3), rng.int(-3, 3));
          const [u, w] = vectorPair(rng, 6);
          const b = add(a, u);
          const c = add(a, w);
          const alpha = angleBetween(u, w) ?? 0;
          return {
            prompt: `Berechne im Dreieck ABC mit ${named("A", a)}, ${named("B", b)} und ${named("C", c)} das Maß α des Innenwinkels bei A.`,
            given: [named("A", a), named("B", b), named("C", c)],
            formulaHint: `cos α = ${frac(`${vn("AB")} ⊙ ${vn("AC")}`, `|${vn("AB")}| · |${vn("AC")}|`)}`,
            fields: [numberField("α =", alpha, "°", 2, { slips: [{ value: 180 - alpha, hint: "Beide Vektoren müssen in A beginnen: AB→ und AC→, nicht CA→." }, { value: (alpha * Math.PI) / 180, hint: RAD_HINT }] })],
            steps: [
              `${vn("AB")} = ${colHtml(u, 0)}, ${vn("AC")} = ${colHtml(w, 0)}, ${vn("AB")} ⊙ ${vn("AC")} = ${fmt(dot(u, w))}`,
              `cos α = ${fmt(dot(u, w))} : (${root(dot(u, u))} · ${root(dot(w, w))}) ≈ ${fmt(Math.cos((alpha * Math.PI) / 180), 4)}`,
              `<strong>α ≈ ${fmt(alpha)}°</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y },
          };
        }
        let a: Vec;
        let u: Vec;
        let w: Vec;
        do {
          a = vec(rng.int(-4, 0), rng.int(-4, 0));
          u = vec(rng.int(3, 7), rng.int(-2, 2));
          w = vec(rng.int(-3, 3), rng.int(2, 6));
        } while (det(u, w) <= 0 || dot(u, w) === 0);
        const alpha = angleBetween(u, w) ?? 0;
        const b = add(a, u);
        const d = add(a, w);
        return {
          prompt: `Die Punkte ${named("A", a)}, ${named("B", b)} und ${named("D", d)} legen das Parallelogramm ABCD fest. Berechne das Maß des Innenwinkels α = ∢DAB und daraus das Maß von β = ∢ABC.`,
          given: [named("A", a), named("B", b), named("D", d), "Parallelogramm ABCD"],
          fields: [
            numberField("α =", alpha, "°", 2, { slips: [{ value: 180 - alpha, hint: "Für α beginnen beide Vektoren in A: AB→ und AD→." }] }),
            numberField("β =", 180 - alpha, "°", 2, { slips: [{ value: alpha, hint: "Im Parallelogramm ergänzen sich benachbarte Winkel zu 180°." }] }),
          ],
          steps: [
            `${vn("AB")} = ${colHtml(u, 0)}, ${vn("AD")} = ${colHtml(w, 0)}, ${vn("AB")} ⊙ ${vn("AD")} = ${fmt(dot(u, w))}`,
            `cos α = ${fmt(dot(u, w))} : (${root(dot(u, u))} · ${root(dot(w, w))}), also α ≈ ${fmt(alpha)}°`,
            `Benachbarte Winkel im Parallelogramm ergeben zusammen 180°: β = 180° − α.`,
            `<strong>α ≈ ${fmt(alpha)}°, β ≈ ${fmt(180 - alpha)}°</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, dx: d.x, dy: d.y },
        };
      },
    },
    {
      id: "abstand",
      make: (rng, level): ExerciseTask => {
        const { m, t, u, f, p } = footTask(rng);
        const pf = sub(f, p);
        const d = norm(pf);
        const k1 = u.x + u.y * m;
        const k0 = -u.x * p.x + u.y * (t - p.y);
        const solve = [
          `F(x | ${linear(m, t)}) auf g, ${vn("PF")} = ${vecHtml(xMinus(p.x), linear(m, t - p.y))}, ${vn("u")} = ${colHtml(u, 0)}`,
          `${vn("PF")} ⊙ ${vn("u")} = ${paren(u.x)} · (${xMinus(p.x)}) + ${paren(u.y)} · (${linear(m, t - p.y)}) = ${linear(k1, k0)} = 0, also x = ${fmt(f.x)}`,
        ];
        if (level === 1) {
          return {
            prompt: `Berechne den Lotfußpunkt F des Lotes vom Punkt ${named("P", p)} auf die Gerade g: y = ${linear(m, t)} und den Abstand des Punktes P von g.`,
            given: [named("P", p), `g: y = ${linear(m, t)}`],
            formulaHint: `F(x | ${linear(m, t)}), ${vn("PF")} ⊙ ${vn("u")} = 0 mit ${vn("u")} = ${colHtml(u, 0)}; d = |${vn("PF")}|`,
            fields: [numberField("F: x =", f.x, "", 2), numberField("y =", f.y, "", 2), numberField("d =", d, "LE", 2, { slips: [{ value: d * d, hint: "Das ist das Quadrat des Abstands. Ziehe noch die Wurzel." }] })],
            steps: [...solve, `${named("F", f)}, ${vn("PF")} = ${colHtml(pf, 0)}`, `<strong>${named("F", f)}, d(P; g) = ${sqrtHtml(fmt(d * d))} ${eqSign(d)} ${fmt(d)} LE</strong>`],
            meta: { m, t, px: p.x, py: p.y },
          };
        }
        return {
          prompt: `Ein Funkmast steht im Punkt ${named("M", p)}. Eine gerade Bahnstrecke verläuft entlang der Geraden g: y = ${linear(m, t)} (1 LE = 100 m). Berechne den Punkt F der Strecke, der dem Mast am nächsten liegt, und den Abstand des Mastes von der Bahnstrecke in Metern.`,
          given: [named("M", p), `g: y = ${linear(m, t)}`, "1 LE = 100 m"],
          fields: [
            numberField("F: x =", f.x, "", 2),
            numberField("Abstand:", d * 100, "m", 0, { slips: [{ value: d, hint: "Das ist der Abstand in LE. Rechne noch in Meter um: 1 LE = 100 m." }] }),
          ],
          steps: [
            "Der kürzeste Weg trifft die Strecke im rechten Winkel: F ist der Lotfußpunkt.",
            ...solve.map((s) => s.replace(/PF/g, "MF")),
            `<strong>${named("F", f)}, Abstand ${sqrtHtml(fmt(d * d))} LE ≈ ${fmt(d * 100, 0)} m</strong>`,
          ],
          meta: { m, t, px: p.x, py: p.y },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weist rechte Winkel nach, berechnest Innenwinkel und findest Lotfußpunkt und Abstand eines Punktes von einer Geraden.",
};

// 3.4 Parallelverschiebung und zentrische Streckung ──────────────────────────

const FACTORS = [-2, -1.5, -1, -0.5, 0.5, 1.5, 2, 2.5, 3];

const verschiebungStreckung: Lesson = {
  id: "ab-1-verschiebung-streckung",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Parallelverschiebung und zentrische Streckung",
  subtitle: "Bildpunkte, Urpunkte, Vektor und Streckungsfaktor berechnen",
  tracks: ["I"],
  lehrplan: `${LB2}: Abbildungen, Parallelverschiebung und zentrische Streckung`,
  whyItMatters:
    "Wenn ein Grafikprogramm ein Logo verschiebt oder vergrößert, rechnet es genau so: Jeder Punkt bekommt mit einem Vektor seinen Bildpunkt. Mit derselben Rechnung findest du rückwärts den Urpunkt, den Vektor oder den Streckungsfaktor.",
  explanationHtml: `
    <p><strong>Parallelverschiebung</strong> mit dem Vektor ${vn("v")}: Jeder Punkt P(x | y) wird um denselben Pfeil verschoben, P' = P ⊕ ${vn("v")}. In Koordinaten:</p>
    <p class="formula-line">${vecHtml("x'", "y'")} = ${vecHtml("x", "y")} ⊕ ${vecHtml("x<sub>v</sub>", "y<sub>v</sub>")}, also x' = x + x<sub>v</sub> und y' = y + y<sub>v</sub></p>
    <ul>
      <li>Der Verschiebungsvektor ist ${vn("v")} = ${vn("PP'")} (Spitze minus Schaft); den Urpunkt erhältst du mit dem Gegenvektor: P = P' ⊕ (−${vn("v")}).</li>
      <li>Bildfigur und Urfigur sind deckungsgleich; jede Gerade wird auf eine parallele Gerade abgebildet.</li>
    </ul>
    <p><strong>Zentrische Streckung</strong> mit dem Zentrum Z und dem Streckungsfaktor k (k ≠ 0): Der Pfeil von Z zum Bildpunkt ist das k-Fache des Pfeils zum Urpunkt.</p>
    <p class="formula-line">${vn("ZP'")} = k · ${vn("ZP")}, also ${vn("OP'")} = ${vn("OZ")} + k · ${vn("ZP")}</p>
    <ul>
      <li>k &gt; 0: P' liegt auf derselben Seite von Z wie P; k &lt; 0: auf der anderen Seite.</li>
      <li>|k| &gt; 1 vergrößert, |k| &lt; 1 verkleinert. Längen werden mit |k| multipliziert, Flächeninhalte mit k².</li>
      <li>Für das Zentrum O(0 | 0) gilt einfach ${vecHtml("x'", "y'")} = k · ${vecHtml("x", "y")}.</li>
      <li>Rückwärts: Urpunkt aus ${vn("ZP")} = (1 : k) · ${vn("ZP'")}; der Faktor k ist das Verhältnis der Koordinaten von ${vn("ZP'")} und ${vn("ZP")} (für x und y derselbe Wert).</li>
    </ul>
    <div class="example">Beispiel: Z(1 | 2), k = −1,5, P(3 | 1). ${vn("ZP")} = ${vecHtml(2, -1)}, ${vn("ZP'")} = −1,5 · ${vecHtml(2, -1)} = ${vecHtml(-3, "1,5")}, ${vn("OP'")} = ${vecHtml(1, 2)} + ${vecHtml(-3, "1,5")} = ${vecHtml(-2, "3,5")}, also P'(−2 | 3,5).<br>Mit funktionaler Abhängigkeit: Die Punkte P<sub>n</sub>(x | 0,5x + 1) werden um ${vn("v")} = ${vecHtml(2, -3)} verschoben. Ihre Bildpunkte sind P<sub>n</sub>'(x + 2 | 0,5x − 2).</div>
    <div class="merke"><strong>Merke:</strong> Verschiebung: Vektor addieren. Streckung: erst den Pfeil ${vn("ZP")} bilden, mit k multiplizieren, dann an Z anhängen.</div>
  `,
  formulas: [
    { name: "Parallelverschiebung", html: `${vecHtml("x'", "y'")} = ${vecHtml("x", "y")} ⊕ ${vecHtml("x<sub>v</sub>", "y<sub>v</sub>")}`, quantities: "v→ Verschiebungsvektor, P' = P ⊕ v→" },
    { name: "Zentrische Streckung", html: `${vn("ZP'")} = k · ${vn("ZP")}`, quantities: "Z Streckungszentrum, k ≠ 0 Streckungsfaktor" },
    { name: "Flächeninhalt bei der Streckung", html: "A' = k² · A", quantities: "Längen mal |k|, Flächeninhalte mal k²" },
  ],
  quiz: {
    question: "Bei einer zentrischen Streckung mit k = −2 wird ein Dreieck abgebildet. Was gilt für das Bilddreieck?",
    options: [
      "Es hat den 4-fachen Flächeninhalt und liegt auf der anderen Seite von Z.",
      "Es hat den doppelten Flächeninhalt und liegt auf derselben Seite von Z.",
      "Es hat den 4-fachen Flächeninhalt und liegt auf derselben Seite von Z.",
    ],
    correctIndex: 0,
    explanation: "Flächeninhalte werden mit k² = (−2)² = 4 multipliziert. Der negative Faktor legt das Bild auf die andere Seite des Zentrums Z.",
  },
  lab: {
    kind: "translate-scale",
    title: "Labor: Verschieben und Strecken",
    intro: "Wähle die Abbildung. Bei der Verschiebung ziehst du den Bildpunkt A', bei der Streckung das Zentrum Z und A' (das ändert k). Rechts steht die Abbildungsgleichung mit Zahlen.",
    params: [
      { type: "choice", key: "mode", label: "Abbildung", options: [{ value: 0, label: "Parallelverschiebung" }, { value: 1, label: "Zentrische Streckung" }], value: 0 },
      { type: "range", key: "vx", label: "x von v→", unit: "", min: -6, max: 6, step: 1, value: 3, showIf: (v) => v.mode === 0 },
      { type: "range", key: "vy", label: "y von v→", unit: "", min: -6, max: 6, step: 1, value: 1, showIf: (v) => v.mode === 0 },
      { type: "range", key: "zx", label: "x von Z", unit: "", min: -6, max: 6, step: 1, value: 0, showIf: (v) => v.mode === 1 },
      { type: "range", key: "zy", label: "y von Z", unit: "", min: -6, max: 6, step: 1, value: 0, showIf: (v) => v.mode === 1 },
      { type: "range", key: "k", label: "Streckungsfaktor k", unit: "", min: -2, max: 2.5, step: 0.25, value: 1.5, digits: 2, showIf: (v) => v.mode === 1 },
    ],
    readouts: [
      { key: "A1", label: "Bildpunkt A'", compute: (v) => named("A'", imagePoint(v, TRIANGLE[0])) },
      { key: "C1", label: "Bildpunkt C'", compute: (v) => named("C'", imagePoint(v, TRIANGLE[2])) },
      { key: "area", label: "Flächeninhalt ABC", unit: "FE", digits: 2, compute: () => triangleArea(TRIANGLE) },
      { key: "image", label: "Flächeninhalt A'B'C'", unit: "FE", digits: 2, emphasis: true, compute: (v) => triangleArea(TRIANGLE.map((p) => imagePoint(v, p))) },
    ],
    goals: [
      {
        id: "verschiebung",
        text: "Verschiebe das Dreieck so, dass A' auf C fällt. Welcher Verbindungsvektor ist dann v→?",
        check: (v) => v.mode === 0 && same(imagePoint(v, TRIANGLE[0]), TRIANGLE[2]),
      },
      {
        id: "fixpunkt",
        text: "Finde eine zentrische Streckung mit k ≠ 1, bei der der Punkt B auf sich selbst abgebildet wird.",
        check: (v) => v.mode === 1 && v.k !== 0 && v.k !== 1 && same(imagePoint(v, TRIANGLE[1]), TRIANGLE[1]),
      },
      {
        id: "vierfach",
        text: "Erzeuge mit einem negativen Streckungsfaktor ein Bilddreieck mit dem 4-fachen Flächeninhalt.",
        check: (v) => v.mode === 1 && v.k < 0 && Math.abs(v.k * v.k - 4) < 1e-9,
      },
    ],
  },
  exercises: [
    {
      id: "verschiebung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const p = vec(rng.int(-6, 6), rng.int(-6, 6));
          const v = vec(nonZero(rng, 6), nonZero(rng, 6));
          const q = add(p, v);
          if (rng.next() < 0.5) {
            return {
              prompt: `Der Punkt ${named("P", p)} wird durch die Parallelverschiebung mit ${vn("v")} = ${colHtml(v, 0)} abgebildet. Berechne die Koordinaten des Bildpunkts P'.`,
              given: [named("P", p), `${vn("v")} = ${colHtml(v, 0)}`],
              formulaHint: `${vecHtml("x'", "y'")} = ${vecHtml("x", "y")} ⊕ ${vecHtml("x<sub>v</sub>", "y<sub>v</sub>")}`,
              fields: [numberField("P': x' =", q.x, "", 0), numberField("y' =", q.y, "", 0)],
              steps: [`${vecHtml("x'", "y'")} = ${colHtml(p, 0)} ⊕ ${colHtml(v, 0)} = ${colHtml(q, 0)}`, `<strong>${named("P'", q)}</strong>`],
              meta: { px: p.x, py: p.y, vx: v.x, vy: v.y, variant: 0 },
            };
          }
          return {
            prompt: `Bei einer Parallelverschiebung wird ${named("P", p)} auf ${named("P'", q)} abgebildet. Berechne die Koordinaten des Verschiebungsvektors ${vn("v")}.`,
            given: [named("P", p), named("P'", q)],
            formulaHint: `${vn("v")} = ${vn("PP'")} = ${vecHtml("x' − x", "y' − y")}`,
            fields: [
              numberField(`${vn("v")}: x =`, v.x, "", 0, { slips: [{ value: -v.x, hint: "Spitze minus Schaft: P' minus P, nicht umgekehrt." }] }),
              numberField("y =", v.y, "", 0, { slips: [{ value: -v.y, hint: "Spitze minus Schaft: P' minus P, nicht umgekehrt." }] }),
            ],
            steps: [`${vn("v")} = ${vn("PP'")} = ${vecHtml(diff(q.x, p.x), diff(q.y, p.y))}`, `<strong>${vn("v")} = ${colHtml(v, 0)}</strong>`],
            meta: { px: p.x, py: p.y, vx: v.x, vy: v.y, variant: 1 },
          };
        }
        if (rng.next() < 0.5) {
          let m: number;
          let t: number;
          let v: Vec;
          do {
            m = rng.pick([0.5, -0.5, 2, -2, 1, -1]);
            t = rng.int(-4, 4);
            v = vec(nonZero(rng, 5), nonZero(rng, 5));
          } while (t + v.y === 0);
          const x = -(t + v.y) / m;
          return {
            prompt: `Die Punkte P<sub>n</sub>(x | ${linear(m, t)}) werden durch die Parallelverschiebung mit ${vn("v")} = ${colHtml(v, 0)} auf die Punkte P<sub>n</sub>' abgebildet. Berechne P<sub>n</sub>' in Abhängigkeit von x. Für welchen Wert von x liegt P<sub>n</sub>' auf der x-Achse? Gib auch die x-Koordinate dieses Bildpunkts an.`,
            given: [`P<sub>n</sub>(x | ${linear(m, t)})`, `${vn("v")} = ${colHtml(v, 0)}`],
            fields: [numberField("x =", x, "", 2), numberField("x' =", x + v.x, "", 2)],
            steps: [
              `${vecHtml("x'", "y'")} = ${vecHtml("x", linear(m, t))} ⊕ ${colHtml(v, 0)} = ${vecHtml(linear(1, v.x), linear(m, t + v.y))}, also P<sub>n</sub>'(${linear(1, v.x)} | ${linear(m, t + v.y)})`,
              `Auf der x-Achse ist y' = 0: ${linear(m, t + v.y)} = 0, also x = ${fmt(x)}`,
              `x' = ${fmt(x)} + ${paren(v.x)} = ${fmt(x + v.x)}`,
              `<strong>x = ${fmt(x)}, der Bildpunkt ist (${fmt(x + v.x)} | 0)</strong>`,
            ],
            meta: { m, t, vx: v.x, vy: v.y, variant: 2 },
          };
        }
        const a = vec(rng.int(-5, 0), rng.int(-5, 0));
        const c = add(a, vec(rng.int(1, 4), rng.int(2, 5)));
        const v = vec(nonZero(rng, 5), nonZero(rng, 5));
        const a1 = add(a, v);
        const c1 = add(c, v);
        return {
          prompt: `Das Dreieck ABC mit ${named("A", a)} und ${named("C", c)} wird so verschoben, dass A auf ${named("A'", a1)} fällt. Berechne den Verschiebungsvektor ${vn("v")} und die Koordinaten des Bildpunkts C'.`,
          given: [named("A", a), named("C", c), named("A'", a1)],
          fields: [numberField(`${vn("v")}: x =`, v.x, "", 0), numberField("y =", v.y, "", 0), numberField("C': x' =", c1.x, "", 0), numberField("y' =", c1.y, "", 0)],
          steps: [
            `${vn("v")} = ${vn("AA'")} = ${vecHtml(diff(a1.x, a.x), diff(a1.y, a.y))} = ${colHtml(v, 0)}`,
            `${vecHtml("x'", "y'")} = ${colHtml(c, 0)} ⊕ ${colHtml(v, 0)} = ${colHtml(c1, 0)}`,
            `<strong>${vn("v")} = ${colHtml(v, 0)}, ${named("C'", c1)}</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, cx: c.x, cy: c.y, vx: v.x, vy: v.y, variant: 3 },
        };
      },
    },
    {
      id: "streckung",
      make: (rng, level): ExerciseTask => {
        const z = vec(rng.int(-4, 4), rng.int(-4, 4));
        const k = rng.pick(FACTORS);
        if (level === 1) {
          let p: Vec;
          do {
            p = vec(rng.int(-5, 5), rng.int(-5, 5));
          } while (same(p, z));
          const zp = sub(p, z);
          const q = add(z, mul(k, zp));
          const fromO = mul(k, p);
          return {
            prompt: `Der Punkt ${named("P", p)} wird durch die zentrische Streckung mit dem Zentrum ${named("Z", z)} und dem Streckungsfaktor k = ${fmt(k)} abgebildet. Berechne die Koordinaten des Bildpunkts P'.`,
            given: [named("P", p), named("Z", z), `k = ${fmt(k)}`],
            formulaHint: `${vn("ZP'")} = k · ${vn("ZP")}, ${vn("OP'")} = ${vn("OZ")} + ${vn("ZP'")}`,
            fields: [
              numberField("P': x' =", q.x, "", 2, { slips: [{ value: fromO.x, hint: "Du hast vom Ursprung aus gestreckt. Bilde zuerst ZP→, multipliziere mit k und hänge den Pfeil an Z an." }] }),
              numberField("y' =", q.y, "", 2, { slips: [{ value: fromO.y, hint: "Du hast vom Ursprung aus gestreckt. Bilde zuerst ZP→, multipliziere mit k und hänge den Pfeil an Z an." }] }),
            ],
            steps: [
              `${vn("ZP")} = ${vecHtml(diff(p.x, z.x), diff(p.y, z.y))} = ${colHtml(zp, 0)}`,
              `${vn("ZP'")} = ${fmt(k)} · ${colHtml(zp, 0)} = ${colHtml(mul(k, zp))}`,
              `${vn("OP'")} = ${colHtml(z, 0)} + ${colHtml(mul(k, zp))} = ${colHtml(q)}`,
              `<strong>${named("P'", q)}</strong>`,
            ],
            meta: { px: p.x, py: p.y, zx: z.x, zy: z.y, k },
          };
        }
        let a: Vec;
        do {
          a = vec(rng.int(-5, 5), rng.int(-5, 5));
        } while (same(a, z));
        const a1 = add(z, mul(k, sub(a, z)));
        const area = rng.pick([4, 5, 6, 8, 9, 10, 12]);
        const wrong = add(z, mul(k, sub(a1, z)));
        return {
          prompt: `Das Dreieck A'B'C' ist das Bild des Dreiecks ABC bei der zentrischen Streckung mit dem Zentrum ${named("Z", z)} und k = ${fmt(k)}. Es ist ${named("A'", a1)}. Berechne die Koordinaten des Urpunkts A. Das Dreieck ABC hat den Flächeninhalt ${fmt(area)} FE; wie groß ist der Flächeninhalt des Bilddreiecks?`,
          given: [named("Z", z), `k = ${fmt(k)}`, named("A'", a1), `A<sub>ABC</sub> = ${fmt(area)} FE`],
          fields: [
            numberField("A: x =", a.x, "", 2, { slips: [{ value: wrong.x, hint: "Für den Urpunkt teilst du durch k: ZA→ = (1 : k) · ZA'→." }] }),
            numberField("y =", a.y, "", 2, { slips: [{ value: wrong.y, hint: "Für den Urpunkt teilst du durch k: ZA→ = (1 : k) · ZA'→." }] }),
            numberField("A' =", k * k * area, "FE", 2, { slips: [{ value: Math.abs(k) * area, hint: "Flächeninhalte werden mit k² multipliziert, nicht mit k." }] }),
          ],
          steps: [
            `${vn("ZA'")} = ${vecHtml(diff(a1.x, z.x), diff(a1.y, z.y))} = ${colHtml(sub(a1, z))}`,
            `${vn("ZA")} = (1 : ${paren(k)}) · ${vn("ZA'")} = ${colHtml(sub(a, z))}, ${vn("OA")} = ${colHtml(z, 0)} + ${colHtml(sub(a, z))} = ${colHtml(a)}`,
            `A<sub>A'B'C'</sub> = k² · A<sub>ABC</sub> = ${fmt(k * k)} · ${fmt(area)} FE`,
            `<strong>${named("A", a)}, A<sub>A'B'C'</sub> = ${fmt(k * k * area)} FE</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, zx: z.x, zy: z.y, k, area },
        };
      },
    },
    {
      id: "faktor-zentrum",
      make: (rng, level): ExerciseTask => {
        const k = rng.pick(FACTORS.filter((f) => f !== 1));
        const z = vec(rng.int(-4, 4), rng.int(-4, 4));
        const zp = vec(nonZero(rng, 4), nonZero(rng, 4));
        const p = add(z, zp);
        const q = add(z, mul(k, zp));
        if (level === 1) {
          return {
            prompt: `Bei einer zentrischen Streckung mit dem Zentrum ${named("Z", z)} wird ${named("P", p)} auf ${named("P'", q)} abgebildet. Berechne den Streckungsfaktor k.`,
            given: [named("Z", z), named("P", p), named("P'", q)],
            formulaHint: `${vn("ZP'")} = k · ${vn("ZP")}: k = x-Koordinate von ${vn("ZP'")} : x-Koordinate von ${vn("ZP")}`,
            fields: [numberField("k =", k, "", 2, Math.abs(k) === 1 ? {} : { slips: [{ value: 1 / k, hint: "Umgekehrt: k ist ZP'→ durch ZP→, der Bildpfeil steht oben." }] })],
            steps: [
              `${vn("ZP")} = ${colHtml(zp, 0)}, ${vn("ZP'")} = ${colHtml(sub(q, z))}`,
              `${fmt(q.x - z.x)} : ${paren(zp.x)} = ${fmt(k)} und ${fmt(q.y - z.y)} : ${paren(zp.y)} = ${fmt(k)}: dasselbe k für beide Koordinaten.`,
              `<strong>k = ${fmt(k)}</strong>`,
            ],
            meta: { zx: z.x, zy: z.y, px: p.x, py: p.y, k },
          };
        }
        return {
          prompt: `Bei einer zentrischen Streckung mit dem Streckungsfaktor k = ${fmt(k)} wird ${named("P", p)} auf ${named("P'", q)} abgebildet. Berechne die Koordinaten des Streckungszentrums Z.`,
          given: [named("P", p), named("P'", q), `k = ${fmt(k)}`],
          fields: [numberField("Z: x =", z.x, "", 2), numberField("y =", z.y, "", 2)],
          steps: [
            `Mit Z(x | y) gilt ${vn("ZP'")} = k · ${vn("ZP")}: ${vecHtml(`${fmt(q.x)} − x`, `${fmt(q.y)} − y`)} = ${fmt(k)} · ${vecHtml(`${fmt(p.x)} − x`, `${fmt(p.y)} − y`)}`,
            `${fmt(q.x)} − x = ${paren(k)} · (${fmt(p.x)} − x), also ${term(1 - k, "x", true)} = ${fmt(q.x - k * p.x)} und x = ${fmt(z.x)}`,
            `${fmt(q.y)} − y = ${paren(k)} · (${fmt(p.y)} − y), also ${term(1 - k, "y", true)} = ${fmt(q.y - k * p.y)} und y = ${fmt(z.y)}`,
            `<strong>${named("Z", z)}</strong>`,
          ],
          meta: { px: p.x, py: p.y, qx: q.x, qy: q.y, k },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Bild- und Urpunkte bei Verschiebung und zentrischer Streckung und findest Vektor, Faktor und Zentrum.",
};

// 3.5 Achsenspiegelung an einer Ursprungsgeraden ─────────────────────────────

/** Slopes m of an axis y = m·x whose matrix has exact two-digit entries. */
const AXIS_SLOPES = [0.5, -0.5, 2, -2, 3, -3, 0.75, -0.75];
const mirrorCos = (m: number): number => (1 - m * m) / (1 + m * m);
const mirrorSin = (m: number): number => (2 * m) / (1 + m * m);
/** Reflection at y = m·x with the exact matrix entries. */
const reflectSlope = (p: Vec, m: number): Vec => {
  const c = mirrorCos(m);
  const s = mirrorSin(m);
  return { x: c * p.x + s * p.y, y: s * p.x - c * p.y };
};
/** The inclination of y = m·x, between 0° and 180°. */
const inclination = (m: number): number => {
  const a = (Math.atan(m) * 180) / Math.PI;
  return a < 0 ? a + 180 : a;
};

const SPECIAL_AXES = [
  { name: "an der x-Achse", label: "x-Achse", alpha: 0, map: (p: Vec) => vec(p.x, -p.y), rule: "(x | y) ↦ (x | −y)" },
  { name: "an der y-Achse", label: "y-Achse", alpha: 90, map: (p: Vec) => vec(-p.x, p.y), rule: "(x | y) ↦ (−x | y)" },
  { name: "an der Winkelhalbierenden y = x", label: "Winkelhalbierende y = x", alpha: 45, map: (p: Vec) => vec(p.y, p.x), rule: "(x | y) ↦ (y | x)" },
  { name: "an der Geraden y = −x", label: "Gerade y = −x", alpha: 135, map: (p: Vec) => vec(-p.y, -p.x), rule: "(x | y) ↦ (−y | −x)" },
];

const MIRROR_ANGLES = [10, 15, 20, 25, 35, 40, 50, 55, 65, 70, 100, 110, 125, 140, 160];

const achsenspiegelung: Lesson = {
  id: "ab-2-achsenspiegelung",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "3.5 Achsenspiegelung an einer Ursprungsgeraden",
  subtitle: "Die Spiegelmatrix mit dem doppelten Winkel",
  tracks: ["I"],
  lehrplan: `${LB2}: Abbildungen, Achsenspiegelung`,
  whyItMatters:
    "Spiegelungen stecken in jedem Bildbearbeitungsprogramm und in der Optik. Mit der Spiegelmatrix berechnest du Bildpunkte an jeder schrägen Achse durch den Ursprung, ohne zu konstruieren.",
  explanationHtml: `
    <p>Die Spiegelachse g ist eine <strong>Ursprungsgerade</strong>; sie schließt mit der x-Achse den Winkel α ein (0° ≤ α &lt; 180°). Ist g: y = m · x gegeben, gilt tan α = m. Für den Bildpunkt P'(x' | y') von P(x | y) gilt:</p>
    <p class="formula-line">${vecHtml("x'", "y'")} = ${matHtml("cos 2α", "sin 2α", "sin 2α", "−cos 2α")} ⊙ ${vecHtml("x", "y")}</p>
    <p>Matrix mal Vektor heißt: Zeile mal Spalte. Also x' = x · cos 2α + y · sin 2α und y' = x · sin 2α − y · cos 2α. In der Matrix steht der <strong>doppelte</strong> Winkel 2α.</p>
    <table class="mini">
      <tr><th>Spiegelachse</th><th>α</th><th>Bildpunkt von P(x | y)</th></tr>
      <tr><td>x-Achse</td><td>0°</td><td>P'(x | −y)</td></tr>
      <tr><td>y-Achse</td><td>90°</td><td>P'(−x | y)</td></tr>
      <tr><td>y = x</td><td>45°</td><td>P'(y | x)</td></tr>
      <tr><td>y = −x</td><td>135°</td><td>P'(−y | −x)</td></tr>
    </table>
    <ul>
      <li><strong>Probe:</strong> Der Pfeil ${vn("PP'")} steht senkrecht auf g, und der Mittelpunkt M von [PP'] liegt auf g.</li>
      <li>Punkte auf der Achse sind <strong>Fixpunkte</strong>. Spiegelt man P' noch einmal, erhält man wieder P: Den Urpunkt berechnest du mit derselben Matrix.</li>
      <li>Die Achsenspiegelung ist eine Kongruenzabbildung; sie kehrt den Umlaufsinn einer Figur um.</li>
    </ul>
    <div class="example">Beispiel: g: y = 0,5x, also α = tan⁻¹(0,5) ≈ 26,57° und 2α ≈ 53,13° mit cos 2α = 0,6 und sin 2α = 0,8. Für P(5 | 0): x' = 5 · 0,6 + 0 · 0,8 = 3 und y' = 5 · 0,8 − 0 · 0,6 = 4, also P'(3 | 4). Probe: M(4 | 2) liegt auf g, denn 0,5 · 4 = 2.</div>
    <div class="merke"><strong>Merke:</strong> Spiegelmatrix: oben cos 2α und sin 2α, unten sin 2α und −cos 2α. Immer den doppelten Winkel einsetzen.</div>
  `,
  formulas: [
    { name: "Achsenspiegelung an einer Ursprungsgeraden", html: `${vecHtml("x'", "y'")} = ${matHtml("cos 2α", "sin 2α", "sin 2α", "−cos 2α")} ⊙ ${vecHtml("x", "y")}`, quantities: "α: Winkel, den die Spiegelachse mit der x-Achse einschließt" },
    { name: "Koordinatenform", html: "x' = x · cos 2α + y · sin 2α; y' = x · sin 2α − y · cos 2α", quantities: "Matrix mal Vektor: Zeile mal Spalte" },
    { name: "Winkel der Spiegelachse", html: "tan α = m", quantities: "für die Spiegelachse g: y = m · x" },
  ],
  quiz: {
    question: "Der Punkt P(3 | 1) wird an der Winkelhalbierenden y = x gespiegelt. Wo liegt P'?",
    options: ["P'(1 | 3)", "P'(−3 | 1)", "P'(−1 | −3)"],
    correctIndex: 0,
    explanation: "Für α = 45° ist 2α = 90°, also cos 2α = 0 und sin 2α = 1: x' = y = 1 und y' = x = 3. Die Koordinaten tauschen die Plätze. (−3 | 1) wäre das Bild an der y-Achse, (−1 | −3) an der Geraden y = −x.",
  },
  lab: {
    kind: "reflection",
    title: "Labor: Spiegeln an einer Ursprungsgeraden",
    intro: "Ziehe P und den Punkt auf der Spiegelachse (er ändert den Winkel α). Rechts siehst du die Spiegelmatrix mit 2α, die Rechnung und die Probe mit dem Mittelpunkt M.",
    params: [
      { type: "range", key: "alpha", label: "Winkel α der Achse", unit: "°", min: 0, max: 175, step: 5, value: 30 },
      { type: "range", key: "px", label: "x von P", unit: "", min: -5, max: 5, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "py", label: "y von P", unit: "", min: -5, max: 5, step: 0.5, value: 2, digits: 1 },
    ],
    readouts: [
      { key: "axis", label: "Spiegelachse", compute: (v) => axisText(v.alpha) },
      { key: "double", label: "2α", unit: "°", digits: 0, compute: (v) => 2 * v.alpha },
      { key: "image", label: "Bildpunkt", emphasis: true, compute: (v) => { const q = reflectAt(vec(v.px, v.py), v.alpha); return named("P'", q); } },
      { key: "mid", label: "Mittelpunkt M von [PP']", compute: (v) => named("M", mul(0.5, add(vec(v.px, v.py), reflectAt(vec(v.px, v.py), v.alpha)))) },
    ],
    goals: [
      {
        id: "y-achse",
        text: "Stelle die y-Achse als Spiegelachse ein und lege P so, dass P'(−3 | 2) entsteht.",
        check: (v) => v.alpha === 90 && same(reflectAt(vec(v.px, v.py), v.alpha), vec(-3, 2)),
      },
      {
        id: "fixpunkt",
        text: "Lege P auf eine schräge Spiegelachse (nicht die x- oder y-Achse), ohne in O zu sein: P wird auf sich selbst abgebildet.",
        check: (v) => v.alpha !== 0 && v.alpha !== 90 && (v.px !== 0 || v.py !== 0) && same(reflectAt(vec(v.px, v.py), v.alpha), vec(v.px, v.py)),
      },
      {
        id: "winkelhalbierende",
        text: "Finde die Spiegelachse, die P(4 | 0) auf P'(0 | −4) abbildet.",
        check: (v) => v.px === 4 && v.py === 0 && same(reflectAt(vec(v.px, v.py), v.alpha), vec(0, -4)),
      },
    ],
  },
  exercises: [
    {
      id: "bildpunkt",
      make: (rng, level): ExerciseTask => {
        let p: Vec;
        do {
          p = vec(rng.int(-6, 6), rng.int(-6, 6));
        } while (p.x === 0 && p.y === 0);
        if (level === 1) {
          const alpha = rng.pick(MIRROR_ANGLES);
          const c = cosDeg(2 * alpha);
          const s = sinDeg(2 * alpha);
          const q = reflectAt(p, alpha);
          const single = vec(p.x * cosDeg(alpha) + p.y * sinDeg(alpha), p.x * sinDeg(alpha) - p.y * cosDeg(alpha));
          return {
            prompt: `Der Punkt ${named("P", p)} wird an der Ursprungsgeraden g gespiegelt, die mit der x-Achse den Winkel α = ${fmt(alpha)}° einschließt. Berechne die Koordinaten des Bildpunkts P' (auf zwei Dezimalen gerundet).`,
            given: [named("P", p), `α = ${fmt(alpha)}°`],
            formulaHint: `${vecHtml("x'", "y'")} = ${matHtml("cos 2α", "sin 2α", "sin 2α", "−cos 2α")} ⊙ ${vecHtml("x", "y")}`,
            fields: [
              numberField("P': x' =", q.x, "", 2, { slips: [{ value: single.x, hint: "In der Matrix steht der doppelte Winkel 2α, nicht α." }] }),
              numberField("y' =", q.y, "", 2, {
                slips: [
                  { value: single.y, hint: "In der Matrix steht der doppelte Winkel 2α, nicht α." },
                  { value: p.x * s + p.y * c, hint: "Unten rechts in der Spiegelmatrix steht −cos 2α." },
                ],
              }),
            ],
            steps: [
              `2α = ${fmt(2 * alpha)}°: cos ${fmt(2 * alpha)}° ≈ ${fmt(c, 4)}, sin ${fmt(2 * alpha)}° ≈ ${fmt(s, 4)}`,
              `x' = ${fmt(p.x)} · cos ${fmt(2 * alpha)}° + ${paren(p.y)} · sin ${fmt(2 * alpha)}° ≈ ${fmt(q.x)}`,
              `y' = ${fmt(p.x)} · sin ${fmt(2 * alpha)}° − ${paren(p.y)} · cos ${fmt(2 * alpha)}° ≈ ${fmt(q.y)}`,
              `<strong>P'(${fmt(q.x)} | ${fmt(q.y)})</strong>`,
            ],
            meta: { px: p.x, py: p.y, alpha },
          };
        }
        const m = rng.pick(AXIS_SLOPES);
        const c = mirrorCos(m);
        const s = mirrorSin(m);
        const q = reflectSlope(p, m);
        const alpha = inclination(m);
        return {
          prompt: `Das Dreieck ABC wird an der Geraden g: y = ${linear(m, 0)} gespiegelt. Berechne zuerst cos 2α und sin 2α für den Winkel α zwischen g und der x-Achse und dann den Bildpunkt C' von ${named("C", p)}.`,
          given: [`g: y = ${linear(m, 0)}`, named("C", p)],
          fields: [
            numberField("cos 2α =", c, "", 2),
            numberField("sin 2α =", s, "", 2),
            numberField("C': x' =", q.x, "", 2),
            numberField("y' =", q.y, "", 2),
          ],
          steps: [
            `tan α = ${fmt(m)}, also α ≈ ${fmt(alpha)}° und 2α ≈ ${fmt(2 * alpha)}°`,
            `cos 2α = ${fmt(c)}, sin 2α = ${fmt(s)} (exakt)`,
            `x' = ${fmt(p.x)} · ${paren(c)} + ${paren(p.y)} · ${paren(s)} = ${fmt(q.x)}; y' = ${fmt(p.x)} · ${paren(s)} − ${paren(p.y)} · ${paren(c)} = ${fmt(q.y)}`,
            `<strong>cos 2α = ${fmt(c)}, sin 2α = ${fmt(s)}, C'(${fmt(q.x)} | ${fmt(q.y)})</strong>`,
          ],
          meta: { px: p.x, py: p.y, m },
        };
      },
    },
    {
      id: "sonderfall-urpunkt",
      make: (rng, level): ExerciseTask => {
        let p: Vec;
        do {
          p = vec(rng.int(-7, 7), rng.int(-7, 7));
        } while (p.x === 0 || p.y === 0 || Math.abs(p.x) === Math.abs(p.y));
        if (level === 1) {
          const axis = rng.pick(SPECIAL_AXES);
          const q = axis.map(p);
          return {
            prompt: `Spiegle den Punkt ${named("P", p)} ${axis.name}. Gib die Koordinaten des Bildpunkts P' an.`,
            given: [named("P", p), `Spiegelachse: ${axis.label}`],
            formulaHint: `α = ${axis.alpha}°, 2α = ${2 * axis.alpha}°: cos 2α = ${fmt(cosDeg(2 * axis.alpha))}, sin 2α = ${fmt(sinDeg(2 * axis.alpha))}`,
            fields: [numberField("P': x' =", q.x, "", 0), numberField("y' =", q.y, "", 0)],
            steps: [`Für α = ${axis.alpha}° wird die Matrix zu ${matHtml(cosDeg(2 * axis.alpha), sinDeg(2 * axis.alpha), sinDeg(2 * axis.alpha), -cosDeg(2 * axis.alpha))}: ${axis.rule}.`, `<strong>${named("P'", q)}</strong>`],
            meta: { px: p.x, py: p.y, alpha: axis.alpha },
          };
        }
        const alpha = rng.pick(MIRROR_ANGLES);
        const q = reflectAt(p, alpha);
        const shown = vec(Number(q.x.toFixed(2)), Number(q.y.toFixed(2)));
        const back = reflectAt(shown, alpha);
        return {
          prompt: `Der Punkt ${named("P'", shown)} ist der Bildpunkt eines Punktes P bei der Achsenspiegelung an der Ursprungsgeraden mit α = ${fmt(alpha)}°. Berechne die Koordinaten des Urpunkts P.`,
          given: [named("P'", shown), `α = ${fmt(alpha)}°`],
          fields: [numberField("P: x =", back.x, "", 2, { absTolerance: 0.01 }), numberField("y =", back.y, "", 2, { absTolerance: 0.01 })],
          steps: [
            "Spiegelt man den Bildpunkt noch einmal an derselben Achse, erhält man den Urpunkt zurück: Es ist dieselbe Matrix.",
            `x = ${fmt(shown.x)} · cos ${fmt(2 * alpha)}° + ${paren(shown.y)} · sin ${fmt(2 * alpha)}° ≈ ${fmt(back.x)}`,
            `y = ${fmt(shown.x)} · sin ${fmt(2 * alpha)}° − ${paren(shown.y)} · cos ${fmt(2 * alpha)}° ≈ ${fmt(back.y)}`,
            `<strong>P(${fmt(back.x)} | ${fmt(back.y)})</strong>`,
          ],
          meta: { qx: shown.x, qy: shown.y, alpha },
        };
      },
    },
    {
      id: "nachweis",
      make: (rng, level): ExerciseTask => {
        const m = rng.pick(AXIS_SLOPES);
        let p: Vec;
        do {
          p = vec(rng.int(-6, 6), rng.int(-6, 6));
        } while ((p.x === 0 && p.y === 0) || Math.abs(m * p.x - p.y) < 1e-9 || norm(add(p, reflectSlope(p, m))) < 1e-9);
        const image = reflectSlope(p, m);
        const u = vec(Math.abs(m) === 0.75 ? 4 : Math.abs(m) === 0.5 ? 2 : 1, Math.abs(m) === 0.75 ? 4 * m : Math.abs(m) === 0.5 ? 2 * m : m);
        if (level === 1) {
          const mirror = rng.next() < 0.5;
          const q = mirror ? image : add(image, rng.pick([vec(0, 1), vec(1, 0), vec(0, -1), vec(-1, 0)]));
          const mid = mul(0.5, add(p, q));
          const product = dot(sub(q, p), u);
          const onAxis = Math.abs(m * mid.x - mid.y) < 1e-9;
          const isMirror = onAxis && Math.abs(product) < 1e-9;
          return {
            prompt: `Prüfe, ob ${named("Q", q)} das Spiegelbild von ${named("P", p)} an der Geraden g: y = ${linear(m, 0)} ist. Berechne dazu den Mittelpunkt M von [PQ] und das Skalarprodukt von ${vn("PQ")} mit dem Richtungsvektor ${vn("u")} = ${colHtml(u, 0)} von g.`,
            given: [named("P", p), named("Q", q), `g: y = ${linear(m, 0)}`],
            formulaHint: `Spiegelbild ⇔ M liegt auf g und ${vn("PQ")} ⊙ ${vn("u")} = 0`,
            fields: [numberField("M: x =", mid.x, "", 2), numberField("y =", mid.y, "", 2), numberField(`${vn("PQ")} ⊙ ${vn("u")} =`, product, "", 2), yesNo("Spiegelbild?", isMirror)],
            steps: [
              `M(${fmt((p.x + q.x) / 2)} | ${fmt((p.y + q.y) / 2)}); auf g wäre y = ${fmt(m)} · ${paren(mid.x)} = ${fmt(m * mid.x)}: M liegt ${onAxis ? "auf" : "nicht auf"} g.`,
              `${vn("PQ")} = ${colHtml(sub(q, p))}, ${vn("PQ")} ⊙ ${vn("u")} = ${fmt(product)}`,
              `<strong>${isMirror ? "Q ist das Spiegelbild von P." : "Q ist nicht das Spiegelbild von P."}</strong>`,
            ],
            meta: { px: p.x, py: p.y, qx: q.x, qy: q.y, m },
          };
        }
        const mid = mul(0.5, add(p, image));
        const alpha = inclination(m);
        const imageAngle = ((Math.atan2(image.y, image.x) * 180) / Math.PI + 360) % 180;
        return {
          prompt: `Bei einer Achsenspiegelung an einer Ursprungsgeraden g wird ${named("P", p)} auf ${named("P'", image)} abgebildet. Berechne das Maß α des Winkels, den g mit der x-Achse einschließt (0° ≤ α < 180°).`,
          given: [named("P", p), named("P'", image)],
          fields: [numberField("α =", alpha, "°", 2, Math.abs(imageAngle - alpha) > 0.5 ? { slips: [{ value: imageAngle, hint: "Die Achse geht durch den Mittelpunkt M von [PP'], nicht durch P'." }] } : {})],
          steps: [
            `Die Spiegelachse geht durch O und durch den Mittelpunkt von [PP']: M(${fmt(mid.x)} | ${fmt(mid.y)}).`,
            `Steigung von g: m = ${fmt(mid.y)} : ${paren(mid.x)} = ${fmt(m)}, also tan α = ${fmt(m)}${m < 0 ? " und α = 180° + tan⁻¹(" + fmt(m) + ")" : ""}`,
            `<strong>α ≈ ${fmt(alpha)}°</strong>`,
          ],
          meta: { px: p.x, py: p.y, m },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du spiegelst Punkte mit der Spiegelmatrix an jeder Ursprungsgeraden und prüfst das Ergebnis mit Mittelpunkt und Skalarprodukt.",
};

// 3.6 Drehung ────────────────────────────────────────────────────────────────

const ROTATION_ANGLES = [30, 45, 60, 120, 135, 150, -30, -45, -60, -120, 210, 300];

const drehung: Lesson = {
  id: "ab-3-drehung",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "3.6 Drehung mit der Drehmatrix",
  subtitle: "Um den Ursprung, um ein Zentrum Z und zurück",
  tracks: ["I"],
  lehrplan: `${LB2}: Abbildungen, Drehung`,
  whyItMatters:
    "Riesenräder, Uhrzeiger und jede Animation, in der sich etwas dreht, rechnen mit der Drehmatrix. Sie liefert aus dem Drehwinkel sofort die Koordinaten jedes gedrehten Punktes.",
  explanationHtml: `
    <p>Bei der <strong>Drehung um den Ursprung O(0 | 0)</strong> mit dem Drehwinkel φ (positiv heißt gegen den Uhrzeigersinn) gilt für P(x | y) und seinen Bildpunkt P'(x' | y'):</p>
    <p class="formula-line">${vecHtml("x'", "y'")} = ${matHtml("cos φ", "−sin φ", "sin φ", "cos φ")} ⊙ ${vecHtml("x", "y")}</p>
    <p>Also x' = x · cos φ − y · sin φ und y' = x · sin φ + y · cos φ. In der Merkhilfe heißt der Drehwinkel α.</p>
    <ul>
      <li><strong>Sonderfälle aus M8:</strong> φ = 90°: ${vecHtml("x", "y")} ↦ ${vecHtml("−y", "x")}; φ = −90°: ${vecHtml("x", "y")} ↦ ${vecHtml("y", "−x")}; φ = 180°: ${vecHtml("x", "y")} ↦ ${vecHtml("−x", "−y")}, das ist die Punktspiegelung am Zentrum.</li>
      <li><strong>Drehung um Z(x<sub>Z</sub> | y<sub>Z</sub>):</strong> Drehe den Pfeil ${vn("ZP")} und hänge ihn wieder an Z an: ${vn("ZP'")} = D<sub>φ</sub> ⊙ ${vn("ZP")} und ${vn("OP'")} = ${vn("OZ")} + ${vn("ZP'")}.</li>
      <li><strong>Urpunkt aus dem Bildpunkt:</strong> Drehe P' um dasselbe Zentrum um −φ zurück; dabei ist cos(−φ) = cos φ und sin(−φ) = −sin φ.</li>
      <li>Die Drehung ist eine Kongruenzabbildung: |ZP'| = |ZP|, und der Umlaufsinn einer Figur bleibt erhalten.</li>
    </ul>
    <div class="example">Beispiel 1: ${vn("v")} = ${vecHtml(4, 0)} wird um 60° gedreht: x' = 4 · cos 60° − 0 · sin 60° = 2 und y' = 4 · sin 60° + 0 · cos 60° = 2${sqrtHtml("3")} ≈ 3,46.<br>Beispiel 2: P(4 | 3) wird um Z(1 | 2) um 90° gedreht: ${vn("ZP")} = ${vecHtml(3, 1)}, ${vn("ZP'")} = ${vecHtml(-1, 3)}, also P'(0 | 5).</div>
    <div class="merke"><strong>Merke:</strong> In der Drehmatrix steht cos φ auf der Hauptdiagonalen, oben rechts −sin φ, unten links sin φ. Bei einem Zentrum Z: erst ${vn("ZP")} drehen, dann an Z anhängen.</div>
  `,
  formulas: [
    { name: "Drehung um den Ursprung", html: `${vecHtml("x'", "y'")} = ${matHtml("cos φ", "−sin φ", "sin φ", "cos φ")} ⊙ ${vecHtml("x", "y")}`, quantities: "φ: Drehwinkel, positiv gegen den Uhrzeigersinn" },
    { name: "Drehung um ein Zentrum Z", html: `${vn("ZP'")} = D<sub>φ</sub> ⊙ ${vn("ZP")}`, quantities: "D φ ist die Drehmatrix; danach OP'→ = OZ→ + ZP'→" },
    { name: "Drehung um 90°", html: `${vecHtml("x", "y")} ↦ ${vecHtml("−y", "x")}`, quantities: "um O, gegen den Uhrzeigersinn" },
  ],
  quiz: {
    question: "Der Vektor v→ mit den Koordinaten x = 3 und y = 2 wird um 90° gegen den Uhrzeigersinn gedreht. Welche Koordinaten hat der Bildvektor?",
    options: ["x' = −2 und y' = 3", "x' = 2 und y' = −3", "x' = −3 und y' = −2"],
    correctIndex: 0,
    explanation: "Bei 90° gilt x' = −y und y' = x: Aus 3 und 2 werden −2 und 3. Die Koordinaten 2 und −3 gehören zur Drehung um −90°, −3 und −2 zur Drehung um 180°.",
  },
  lab: {
    kind: "rotation",
    title: "Labor: Drehen um ein Zentrum",
    intro: "Ziehe P, das Drehzentrum Z und den Bildpunkt P' (er ändert den Drehwinkel φ). Rechts wird ZP→ mit der Drehmatrix gedreht und wieder an Z angehängt.",
    params: [
      { type: "range", key: "phi", label: "Drehwinkel φ", unit: "°", min: -180, max: 180, step: 5, value: 60 },
      { type: "range", key: "px", label: "x von P", unit: "", min: -5, max: 5, step: 1, value: 4 },
      { type: "range", key: "py", label: "y von P", unit: "", min: -5, max: 5, step: 1, value: 1 },
      { type: "range", key: "zx", label: "x von Z", unit: "", min: -5, max: 5, step: 1, value: 0 },
      { type: "range", key: "zy", label: "y von Z", unit: "", min: -5, max: 5, step: 1, value: 0 },
    ],
    readouts: [
      { key: "image", label: "Bildpunkt", emphasis: true, compute: (v) => named("P'", rotateAbout(vec(v.px, v.py), vec(v.zx, v.zy), v.phi)) },
      { key: "matrix", label: "Drehmatrix", compute: (v) => `cos φ = ${fmt(cosDeg(v.phi), 2)}, sin φ = ${fmt(sinDeg(v.phi), 2)}` },
      { key: "radius", label: "|ZP| = |ZP'|", unit: "LE", digits: 2, compute: (v) => Math.hypot(v.px - v.zx, v.py - v.zy) },
    ],
    goals: [
      {
        id: "neunzig",
        text: "Stelle eine Drehung um O ein, bei der x' = −y und y' = x gilt.",
        check: (v) => v.zx === 0 && v.zy === 0 && (v.px !== 0 || v.py !== 0) && v.phi === 90,
      },
      {
        id: "punktspiegelung",
        text: "Drehe um ein Zentrum Z ≠ O so, dass P' das Spiegelbild von P am Punkt Z ist.",
        check: (v) => (v.zx !== 0 || v.zy !== 0) && (v.px !== v.zx || v.py !== v.zy) && Math.abs(v.phi) === 180,
      },
      {
        id: "zentrum",
        text: "Drehe P(5 | 1) um Z(2 | 1) so, dass P'(2 | −2) entsteht.",
        check: (v) => v.px === 5 && v.py === 1 && v.zx === 2 && v.zy === 1 && same(rotateAbout(vec(v.px, v.py), vec(v.zx, v.zy), v.phi), vec(2, -2)),
      },
    ],
  },
  exercises: [
    {
      id: "drehung-o",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let p: Vec;
          do {
            p = vec(rng.int(-6, 6), rng.int(-6, 6));
          } while (p.x === 0 && p.y === 0);
          const phi = rng.pick(ROTATION_ANGLES);
          const q = rotateAbout(p, vec(0, 0), phi);
          const back = rotateAbout(p, vec(0, 0), -phi);
          const c = cosDeg(phi);
          const s = sinDeg(phi);
          return {
            prompt: `Der Punkt ${named("P", p)} wird um den Ursprung O mit dem Drehwinkel φ = ${fmt(phi)}° gedreht. Berechne die Koordinaten des Bildpunkts P' (auf zwei Dezimalen gerundet).`,
            given: [named("P", p), `φ = ${fmt(phi)}°`],
            formulaHint: `${vecHtml("x'", "y'")} = ${matHtml("cos φ", "−sin φ", "sin φ", "cos φ")} ⊙ ${vecHtml("x", "y")}`,
            fields: [
              numberField("P': x' =", q.x, "", 2, { slips: [{ value: back.x, hint: "Positiver Drehwinkel heißt gegen den Uhrzeigersinn: Oben rechts in der Matrix steht −sin φ." }] }),
              numberField("y' =", q.y, "", 2, { slips: [{ value: back.y, hint: "Positiver Drehwinkel heißt gegen den Uhrzeigersinn: Unten links in der Matrix steht sin φ." }] }),
            ],
            steps: [
              `cos ${fmt(phi)}° ≈ ${fmt(c, 4)}, sin ${fmt(phi)}° ≈ ${fmt(s, 4)}`,
              `x' = ${fmt(p.x)} · cos ${fmt(phi)}° − ${paren(p.y)} · sin ${fmt(phi)}° ≈ ${fmt(q.x)}`,
              `y' = ${fmt(p.x)} · sin ${fmt(phi)}° + ${paren(p.y)} · cos ${fmt(phi)}° ≈ ${fmt(q.y)}`,
              `<strong>P'(${fmt(q.x)} | ${fmt(q.y)})</strong>`,
            ],
            meta: { px: p.x, py: p.y, phi },
          };
        }
        const r = rng.pick([6, 8, 10, 12]);
        const minutes = rng.pick([5, 10, 20, 25, 35, 40, 50, 55]);
        const phi = -6 * minutes;
        const q = rotateAbout(vec(0, r), vec(0, 0), phi);
        return {
          prompt: `Der Minutenzeiger einer Bahnhofsuhr ist ${fmt(r)} dm lang. Im Koordinatensystem (1 LE = 1 dm) liegt die Zeigerachse im Ursprung; um 12:00 Uhr zeigt die Spitze auf S(0 | ${fmt(r)}). Welche Koordinaten hat die Spitze ${minutes} Minuten später? Beachte: Die Uhr dreht im Uhrzeigersinn, in jeder Minute um 6°.`,
          given: [`S(0 | ${fmt(r)})`, `${minutes} min, 6° pro Minute im Uhrzeigersinn`],
          fields: [
            numberField("x' =", q.x, "", 2, { slips: [{ value: -q.x, hint: "Die Uhr dreht im Uhrzeigersinn: Der Drehwinkel ist negativ." }] }),
            numberField("y' =", q.y, "", 2),
          ],
          steps: [
            `φ = −${minutes} · 6° = ${fmt(phi)}° (im Uhrzeigersinn, also negativ)`,
            `x' = 0 · cos(${fmt(phi)}°) − ${fmt(r)} · sin(${fmt(phi)}°) ≈ ${fmt(q.x)}`,
            `y' = 0 · sin(${fmt(phi)}°) + ${fmt(r)} · cos(${fmt(phi)}°) ≈ ${fmt(q.y)}`,
            `<strong>Spitze bei (${fmt(q.x)} | ${fmt(q.y)})</strong>`,
          ],
          meta: { r, minutes },
        };
      },
    },
    {
      id: "drehung-z",
      make: (rng, level): ExerciseTask => {
        let z: Vec;
        do {
          z = vec(rng.int(-3, 3), rng.int(-3, 3));
        } while (z.x === 0 && z.y === 0);
        const phi = rng.pick([90, -90, 180, 60, 120, -60, 45, 30, 150]);
        let p: Vec;
        do {
          p = vec(rng.int(-5, 5), rng.int(-5, 5));
        } while (same(p, z));
        const zp = sub(p, z);
        const q = rotateAbout(p, z, phi);
        const c = cosDeg(phi);
        const s = sinDeg(phi);
        if (level === 1) {
          const fromO = rotateAbout(p, vec(0, 0), phi);
          return {
            prompt: `Der Punkt ${named("P", p)} wird um das Zentrum ${named("Z", z)} mit φ = ${fmt(phi)}° gedreht. Berechne die Koordinaten des Bildpunkts P' (auf zwei Dezimalen gerundet).`,
            given: [named("P", p), named("Z", z), `φ = ${fmt(phi)}°`],
            formulaHint: `${vn("ZP'")} = ${matHtml("cos φ", "−sin φ", "sin φ", "cos φ")} ⊙ ${vn("ZP")}; ${vn("OP'")} = ${vn("OZ")} + ${vn("ZP'")}`,
            fields: [
              numberField("P': x' =", q.x, "", 2, { slips: [{ value: fromO.x, hint: "Du hast um den Ursprung gedreht. Drehe den Pfeil ZP→ und hänge ihn an Z an." }] }),
              numberField("y' =", q.y, "", 2, { slips: [{ value: fromO.y, hint: "Du hast um den Ursprung gedreht. Drehe den Pfeil ZP→ und hänge ihn an Z an." }] }),
            ],
            steps: [
              `${vn("ZP")} = ${vecHtml(diff(p.x, z.x), diff(p.y, z.y))} = ${colHtml(zp, 0)}`,
              `${vn("ZP'")} = ${matHtml(fmt(c, 2), fmt(-s, 2), fmt(s, 2), fmt(c, 2))} ⊙ ${colHtml(zp, 0)} ≈ ${colHtml(sub(q, z))}`,
              `${vn("OP'")} = ${colHtml(z, 0)} + ${colHtml(sub(q, z))} = ${colHtml(q)}`,
              `<strong>P'(${fmt(q.x)} | ${fmt(q.y)})</strong>`,
            ],
            meta: { px: p.x, py: p.y, zx: z.x, zy: z.y, phi },
          };
        }
        const shown = vec(Number(q.x.toFixed(2)), Number(q.y.toFixed(2)));
        const back = rotateAbout(shown, z, -phi);
        const again = rotateAbout(shown, z, phi);
        return {
          prompt: `Bei der Drehung um das Zentrum ${named("Z", z)} mit φ = ${fmt(phi)}° entsteht der Bildpunkt ${named("P'", shown)}. Berechne die Koordinaten des Urpunkts P.`,
          given: [named("Z", z), `φ = ${fmt(phi)}°`, named("P'", shown)],
          fields: [
            numberField("P: x =", back.x, "", 2, { absTolerance: 0.01, slips: [{ value: again.x, hint: "Für den Urpunkt drehst du zurück, also um −φ." }] }),
            numberField("y =", back.y, "", 2, { absTolerance: 0.01, slips: [{ value: again.y, hint: "Für den Urpunkt drehst du zurück, also um −φ." }] }),
          ],
          steps: [
            `Zurückdrehen um −φ = ${fmt(-phi)}°: ${vn("ZP")} = D<sub>${fmt(-phi)}°</sub> ⊙ ${vn("ZP'")} mit ${vn("ZP'")} = ${colHtml(sub(shown, z))}`,
            `cos(${fmt(-phi)}°) ≈ ${fmt(cosDeg(-phi), 4)}, sin(${fmt(-phi)}°) ≈ ${fmt(sinDeg(-phi), 4)}: ${vn("ZP")} ≈ ${colHtml(sub(back, z))}`,
            `${vn("OP")} = ${colHtml(z, 0)} + ${colHtml(sub(back, z))}`,
            `<strong>P(${fmt(back.x)} | ${fmt(back.y)})</strong>`,
          ],
          meta: { qx: shown.x, qy: shown.y, zx: z.x, zy: z.y, phi },
        };
      },
    },
    {
      id: "quadrat",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const v = vec(nonZero(rng, 7), nonZero(rng, 7));
          return {
            prompt: `Drehe den Vektor ${vn("v")} = ${colHtml(v, 0)} um 90° und um −90°. Gib jeweils die Koordinaten des Bildvektors an.`,
            given: [`${vn("v")} = ${colHtml(v, 0)}`],
            formulaHint: `90°: ${vecHtml("x", "y")} ↦ ${vecHtml("−y", "x")}; −90°: ${vecHtml("x", "y")} ↦ ${vecHtml("y", "−x")}`,
            fields: [numberField("90°: x' =", -v.y, "", 0), numberField("y' =", v.x, "", 0), numberField("−90°: x' =", v.y, "", 0), numberField("y' =", -v.x, "", 0)],
            steps: [`Drehung um 90°: ${colHtml(v, 0)} ↦ ${colHtml(vec(-v.y, v.x), 0)}`, `Drehung um −90°: ${colHtml(v, 0)} ↦ ${colHtml(vec(v.y, -v.x), 0)}`, `<strong>${colHtml(vec(-v.y, v.x), 0)} und ${colHtml(vec(v.y, -v.x), 0)}</strong>`],
            meta: { vx: v.x, vy: v.y },
          };
        }
        const a = vec(rng.int(-4, 2), rng.int(-4, 2));
        const u = vec(rng.int(1, 4), rng.int(-3, 3));
        const b = add(a, u);
        const turned = vec(-u.y, u.x);
        const d = add(a, turned);
        const c = add(b, turned);
        const wrongD = add(a, vec(u.y, -u.x));
        return {
          prompt: `Die Punkte ${named("A", a)} und ${named("B", b)} sind benachbarte Eckpunkte des Quadrats ABCD, dessen Ecken gegen den Uhrzeigersinn aufeinander folgen. Berechne die Koordinaten von C und D.`,
          given: [named("A", a), named("B", b), "Quadrat ABCD gegen den Uhrzeigersinn"],
          fields: [
            numberField("C: x =", c.x, "", 0),
            numberField("y =", c.y, "", 0),
            numberField("D: x =", d.x, "", 0, { slips: [{ value: wrongD.x, hint: "Gegen den Uhrzeigersinn: AD→ entsteht aus AB→ durch eine Drehung um +90°." }] }),
            numberField("y =", d.y, "", 0, { slips: [{ value: wrongD.y, hint: "Gegen den Uhrzeigersinn: AD→ entsteht aus AB→ durch eine Drehung um +90°." }] }),
          ],
          steps: [
            `${vn("AB")} = ${colHtml(u, 0)}; gedreht um 90°: ${vn("AD")} = ${colHtml(turned, 0)}`,
            `${vn("OD")} = ${vn("OA")} + ${vn("AD")} = ${colHtml(d, 0)}, ${vn("OC")} = ${vn("OB")} + ${vn("AD")} = ${colHtml(c, 0)}`,
            `<strong>${named("C", c)}, ${named("D", d)}</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du drehst Punkte mit der Drehmatrix um O und um jedes Zentrum Z und findest Urpunkte durch Zurückdrehen.",
};

// 3.7 Flächeninhalte mit Determinanten ───────────────────────────────────────

/** A triangle family A B C_n with C_n on a parabola above [AB]; its area A(x) has its maximum at xs. */
function triangleFamily(rng: Rng) {
  const a = vec(rng.int(-3, -1), rng.int(-2, 1));
  const [ux, uy] = rng.pick([
    [4, -2],
    [4, 0],
    [4, 2],
    [6, 0],
    [8, -4],
    [8, 0],
    [8, 4],
  ] as const);
  const p = rng.pick([-0.25, -0.5]);
  const xs = a.x + rng.int(1, ux - 1);
  const h = rng.int(2, 5);
  const q = uy / ux - 2 * p * xs;
  // the parabola lies h above the line AB at x = xs
  const lineAt = (x: number) => a.y + (uy / ux) * (x - a.x);
  const r = lineAt(xs) + h - p * xs * xs - q * xs;
  // A(x) = ½ · det(AB, AC_n) = ½ · ux · (h + p (x − xs)²)
  const a2 = 0.5 * ux * p;
  const a1 = -ux * p * xs;
  const a0 = 0.5 * ux * (p * xs * xs + h);
  return { a, b: add(a, vec(ux, uy)), ux, uy, p, q, r, xs, h, a2, a1, a0, max: 0.5 * ux * h };
}

/** A convex quadrilateral ABCD with whole coordinates, corners counter-clockwise. */
function quadrilateral(rng: Rng): Vec[] {
  for (;;) {
    const pts = [210, 300, 30, 120].map((base) => {
      const angle = ((base + rng.int(0, 50)) * Math.PI) / 180;
      const r = rng.int(3, 6);
      return vec(Math.round(r * Math.cos(angle)), Math.round(r * Math.sin(angle)));
    });
    const convex = pts.every((p, i) => {
      const q = pts[(i + 1) % 4];
      const s = pts[(i + 2) % 4];
      return det(sub(q, p), sub(s, q)) > 0;
    });
    if (convex) return pts;
  }
}

const determinante: Lesson = {
  id: "ab-4-determinante",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "3.7 Flächeninhalte mit Determinanten",
  subtitle: "Dreiecke, Vierecke und Dreiecksscharen im Koordinatensystem",
  tracks: ["I"],
  lehrplan: `${LB2}: Abbildungen, Flächeninhalte mit Determinanten (Wiederholung aus M8)`,
  whyItMatters:
    "Vermessungsämter berechnen den Flächeninhalt eines Grundstücks aus den Koordinaten seiner Eckpunkte, genau mit dieser Formel. In der Abschlussprüfung brauchst du sie bei fast jeder Dreiecksschar.",
  explanationHtml: `
    <p>Für zwei Vektoren ${vn("u")} und ${vn("v")} heißt die Zahl</p>
    <p class="formula-line">${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} = x<sub>u</sub> · y<sub>v</sub> − y<sub>u</sub> · x<sub>v</sub></p>
    <p>die <strong>zweireihige Determinante</strong> der beiden Vektoren: Produkt der Hauptdiagonalen minus Produkt der Nebendiagonalen.</p>
    <ul>
      <li>Das von ${vn("u")} und ${vn("v")} aufgespannte <strong>Parallelogramm</strong> hat den Flächeninhalt A = ${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} FE, wenn ${vn("v")} gegen den Uhrzeigersinn auf ${vn("u")} folgt.</li>
      <li>Für das <strong>Dreieck ABC</strong> mit ${vn("u")} = ${vn("AB")} und ${vn("v")} = ${vn("AC")} gilt A = ½ · ${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} FE, wenn A, B und C gegen den Uhrzeigersinn aufeinander folgen. Ist die Determinante negativ, liegen die Ecken im Uhrzeigersinn; dann nimmst du den Betrag.</li>
      <li>Ist die Determinante 0, liegen A, B und C auf einer Geraden.</li>
      <li><strong>Abbildungen:</strong> Parallelverschiebung, Drehung und Achsenspiegelung ändern den Flächeninhalt nicht; die Spiegelung kehrt nur den Umlaufsinn um. Eine zentrische Streckung multipliziert ihn mit k².</li>
      <li><strong>Vierecke</strong> zerlegst du in zwei Dreiecke: A<sub>ABCD</sub> = ½ · (det(${vn("AB")}, ${vn("AC")}) + det(${vn("AC")}, ${vn("AD")})) FE.</li>
    </ul>
    <div class="example">Beispiel: A(1 | 1), B(5 | 2), C(2 | 6). ${vn("AB")} = ${vecHtml(4, 1)}, ${vn("AC")} = ${vecHtml(1, 5)}, ${detHtml(4, 1, 1, 5)} = 4 · 5 − 1 · 1 = 19, also A<sub>ABC</sub> = ½ · 19 = 9,5 FE.<br>Dreiecksschar: A(−2 | 1), B(6 | 1) und C<sub>n</sub>(x | −0,25x² + x + 5). ${vn("AB")} = ${vecHtml(8, 0)}, ${vn("AC<sub>n</sub>")} = ${vecHtml("x + 2", "−0,25x² + x + 4")}; A(x) = ½ · (8 · (−0,25x² + x + 4) − 0 · (x + 2)) = −x² + 4x + 16 = −(x − 2)² + 20. Der größte Flächeninhalt ist 20 FE für x = 2.</div>
    <div class="merke"><strong>Merke:</strong> Dreieck: A = ½ · det(${vn("AB")}, ${vn("AC")}) FE bei Umlauf gegen den Uhrzeigersinn. Hauptdiagonale minus Nebendiagonale.</div>
  `,
  formulas: [
    { name: "Zweireihige Determinante", html: `${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} = x<sub>u</sub> · y<sub>v</sub> − y<sub>u</sub> · x<sub>v</sub>`, quantities: "Hauptdiagonale minus Nebendiagonale" },
    { name: "Flächeninhalt eines Dreiecks", html: `A = ½ · ${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} FE`, quantities: "u→ = AB→, v→ = AC→; A, B, C gegen den Uhrzeigersinn" },
    { name: "Flächeninhalt eines Parallelogramms", html: `A = ${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} FE`, quantities: "aufgespannt von u→ und v→" },
  ],
  quiz: {
    question: "Gegeben sind A(0 | 0), B(4 | 0) und C(1 | 3). Welchen Flächeninhalt hat das Dreieck ABC?",
    options: ["6 FE", "12 FE", "3 FE"],
    correctIndex: 0,
    explanation: "AB→ hat die Koordinaten 4 und 0, AC→ die Koordinaten 1 und 3: Die Determinante ist 4 · 3 − 0 · 1 = 12. Das Dreieck hat die Hälfte, 6 FE; 12 FE ist das Parallelogramm.",
  },
  lab: {
    kind: "determinant-area",
    title: "Labor: Flächeninhalt mit der Determinante",
    intro: "Ziehe die Ecken A, B und C. Der grüne Pfeil zeigt den Umlaufsinn, das gestrichelte Parallelogramm hat den doppelten Flächeninhalt. Wähle eine Abbildung und vergleiche die Determinante des Bilddreiecks.",
    params: [
      { type: "range", key: "ax", label: "x von A", unit: "", min: -5, max: 5, step: 1, value: -4 },
      { type: "range", key: "ay", label: "y von A", unit: "", min: -5, max: 5, step: 1, value: -3 },
      { type: "range", key: "bx", label: "x von B", unit: "", min: -5, max: 5, step: 1, value: 2 },
      { type: "range", key: "by", label: "y von B", unit: "", min: -5, max: 5, step: 1, value: -2 },
      { type: "range", key: "cx", label: "x von C", unit: "", min: -5, max: 5, step: 1, value: -1 },
      { type: "range", key: "cy", label: "y von C", unit: "", min: -5, max: 5, step: 1, value: 3 },
      { type: "choice", key: "map", label: "Abbildung", options: Object.entries(AREA_MAPS).map(([value, m]) => ({ value: Number(value), label: m.label })), value: 0 },
    ],
    readouts: [
      { key: "det", label: "det(AB→, AC→)", digits: 0, compute: (v) => triangleDet(trianglePoints(v)) },
      { key: "area", label: "Flächeninhalt Dreieck ABC", unit: "FE", digits: 1, emphasis: true, compute: (v) => Math.abs(triangleDet(trianglePoints(v))) / 2 },
      { key: "para", label: "Flächeninhalt Parallelogramm", unit: "FE", digits: 0, compute: (v) => Math.abs(triangleDet(trianglePoints(v))) },
      { key: "sense", label: "Umlaufsinn", compute: (v) => { const d = triangleDet(trianglePoints(v)); return d > 0 ? "gegen den Uhrzeigersinn" : d < 0 ? "im Uhrzeigersinn" : "keiner: A, B, C auf einer Geraden"; } },
      { key: "image", label: "Bilddreieck: Determinante", digits: 2, compute: (v) => triangleDet(trianglePoints(v).map((AREA_MAPS[v.map] ?? AREA_MAPS[0]).map)) },
    ],
    goals: [
      {
        id: "zehn",
        text: "Erzeuge ein Dreieck mit genau 10 FE, bei dem keine Seite parallel zu einer Koordinatenachse ist.",
        check: (v) => {
          const p = trianglePoints(v);
          const sides = [sub(p[1], p[0]), sub(p[2], p[1]), sub(p[0], p[2])];
          return Math.abs(triangleDet(p)) === 20 && sides.every((s) => s.x !== 0 && s.y !== 0);
        },
      },
      {
        id: "uhrzeigersinn",
        text: "Ordne die Ecken im Uhrzeigersinn an. Was passiert mit der Determinante?",
        check: (v) => triangleDet(trianglePoints(v)) < 0,
      },
      {
        id: "kollinear",
        text: "Lege C so, dass der Flächeninhalt 0 FE ist, ohne dass zwei Ecken zusammenfallen.",
        check: (v) => {
          const p = trianglePoints(v);
          return triangleDet(p) === 0 && !same(p[0], p[1]) && !same(p[1], p[2]) && !same(p[0], p[2]);
        },
      },
    ],
  },
  exercises: [
    {
      id: "dreieck",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          let a: Vec;
          let b: Vec;
          let c: Vec;
          do {
            a = vec(rng.int(-5, 5), rng.int(-5, 5));
            b = vec(rng.int(-5, 5), rng.int(-5, 5));
            c = vec(rng.int(-5, 5), rng.int(-5, 5));
          } while (triangleDet([a, b, c]) === 0);
          const u = sub(b, a);
          const w = sub(c, a);
          const d = det(u, w);
          return {
            prompt: `Berechne die Determinante der Vektoren ${vn("AB")} und ${vn("AC")} und den Flächeninhalt des Dreiecks ABC mit ${named("A", a)}, ${named("B", b)} und ${named("C", c)}.`,
            given: [named("A", a), named("B", b), named("C", c)],
            formulaHint: `A = ½ · ${detHtml("x<sub>u</sub>", "x<sub>v</sub>", "y<sub>u</sub>", "y<sub>v</sub>")} FE mit ${vn("u")} = ${vn("AB")}, ${vn("v")} = ${vn("AC")}; bei negativem Wert den Betrag nehmen`,
            fields: [
              numberField(`det(${vn("AB")}, ${vn("AC")}) =`, d, "", 0, { slips: [{ value: u.x * w.y + u.y * w.x, hint: "Hauptdiagonale minus Nebendiagonale, nicht plus." }] }),
              numberField("A =", Math.abs(d) / 2, "FE", 1, {
                slips: [
                  { value: Math.abs(d), hint: "Das ist der Flächeninhalt des Parallelogramms. Das Dreieck hat die Hälfte." },
                  { value: d / 2, hint: "Ein Flächeninhalt ist nie negativ: Die Ecken liegen im Uhrzeigersinn, nimm den Betrag." },
                ],
              }),
            ],
            steps: [
              `${vn("AB")} = ${colHtml(u, 0)}, ${vn("AC")} = ${colHtml(w, 0)}`,
              `${detHtml(u.x, w.x, u.y, w.y)} = ${times(u.x, w.y)} − ${times(u.y, w.x)} = ${fmt(d)}${d < 0 ? ": negativ, die Ecken liegen im Uhrzeigersinn" : ""}`,
              `<strong>det = ${fmt(d)}, A = ½ · ${fmt(Math.abs(d))} = ${fmt(Math.abs(d) / 2)} FE</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y },
          };
        }
        const [a, b, c, d] = quadrilateral(rng);
        const ab = sub(b, a);
        const ac = sub(c, a);
        const ad = sub(d, a);
        const d1 = det(ab, ac);
        const d2 = det(ac, ad);
        const area = (d1 + d2) / 2;
        return {
          prompt: `Ein Grundstück hat im Koordinatensystem (1 LE = 10 m) die Eckpunkte ${named("A", a)}, ${named("B", b)}, ${named("C", c)} und ${named("D", d)}, gegen den Uhrzeigersinn. Berechne seinen Flächeninhalt in FE, indem du es längs der Diagonalen [AC] in zwei Dreiecke zerlegst.`,
          given: [named("A", a), named("B", b), named("C", c), named("D", d)],
          fields: [numberField("A<sub>ABCD</sub> =", area, "FE", 1, { slips: [{ value: d1 + d2, hint: "Jedes Dreieck hat die Hälfte seiner Determinante: Teile die Summe durch 2." }] })],
          steps: [
            `${vn("AB")} = ${colHtml(ab, 0)}, ${vn("AC")} = ${colHtml(ac, 0)}, ${vn("AD")} = ${colHtml(ad, 0)}`,
            `A<sub>ABC</sub> = ½ · ${detHtml(ab.x, ac.x, ab.y, ac.y)} = ½ · ${fmt(d1)} = ${fmt(d1 / 2)} FE`,
            `A<sub>ACD</sub> = ½ · ${detHtml(ac.x, ad.x, ac.y, ad.y)} = ½ · ${fmt(d2)} = ${fmt(d2 / 2)} FE`,
            `<strong>A<sub>ABCD</sub> = ${fmt(area)} FE</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y, dx: d.x, dy: d.y },
        };
      },
    },
    {
      id: "dreiecksschar",
      make: (rng, level): ExerciseTask => {
        const f = triangleFamily(rng);
        const parabola = quadratic(f.p, f.q, f.r);
        const intro = `Gegeben sind ${named("A", f.a)} und ${named("B", f.b)}. Die Punkte C<sub>n</sub>(x | ${parabola}) liegen auf einer Parabel und bilden mit A und B Dreiecke ABC<sub>n</sub> (Umlauf gegen den Uhrzeigersinn).`;
        const ac = vecHtml(xMinus(f.a.x), quadratic(f.p, f.q, f.r - f.a.y));
        const detLine = `A(x) = ½ · ${detHtml(fmt(f.ux), xMinus(f.a.x), fmt(f.uy), quadratic(f.p, f.q, f.r - f.a.y))} FE = (${quadratic(f.a2, f.a1, f.a0)}) FE`;
        if (level === 1) {
          let x0: number;
          do {
            x0 = f.xs + rng.int(-2, 2);
          } while (f.h + f.p * (x0 - f.xs) ** 2 < 0.5);
          const area = 0.5 * f.ux * (f.h + f.p * (x0 - f.xs) ** 2);
          const c = vec(x0, f.p * x0 * x0 + f.q * x0 + f.r);
          return {
            prompt: `${intro} Berechne den Flächeninhalt des Dreiecks ABC<sub>n</sub> für x = ${fmt(x0)}.`,
            given: [named("A", f.a), named("B", f.b), `C<sub>n</sub>(x | ${parabola})`, `x = ${fmt(x0)}`],
            formulaHint: `A = ½ · det(${vn("AB")}, ${vn("AC")}) FE`,
            fields: [numberField("A =", area, "FE", 2, { slips: [{ value: 2 * area, hint: "Das ist die Determinante, also das Parallelogramm. Das Dreieck hat die Hälfte." }] })],
            steps: [
              `Für x = ${fmt(x0)} ist ${named("C", c)}.`,
              `${vn("AB")} = ${vecHtml(f.ux, f.uy)}, ${vn("AC")} = ${colHtml(sub(c, f.a))}`,
              `det = ${times(f.ux, c.y - f.a.y)} − ${times(f.uy, c.x - f.a.x)} = ${fmt(2 * area)}`,
              `<strong>A = ½ · ${fmt(2 * area)} = ${fmt(area)} FE</strong>`,
            ],
            meta: { ax: f.a.x, ay: f.a.y, ux: f.ux, uy: f.uy, p: f.p, q: f.q, r: f.r, x0 },
          };
        }
        return {
          prompt: `${intro} Berechne den Flächeninhalt A(x) der Dreiecke ABC<sub>n</sub> in Abhängigkeit von x. Für welchen Wert von x hat das Dreieck den größten Flächeninhalt, und wie groß ist er?`,
          given: [named("A", f.a), named("B", f.b), `C<sub>n</sub>(x | ${parabola})`],
          fields: [numberField("x =", f.xs, "", 2), numberField("A<sub>max</sub> =", f.max, "FE", 2, { slips: [{ value: 2 * f.max, hint: "Vergiss den Faktor ½ vor der Determinante nicht." }] })],
          steps: [
            `${vn("AB")} = ${vecHtml(f.ux, f.uy)}, ${vn("AC<sub>n</sub>")} = ${ac}`,
            detLine,
            `Scheitelpunktsform: A(x) = ${vertexForm(f.a2, f.xs, f.max)}, denn ${fmt(f.a2)} &lt; 0: Der Scheitel ist ein Hochpunkt.`,
            `<strong>Für x = ${fmt(f.xs)} ist A<sub>max</sub> = ${fmt(f.max)} FE.</strong>`,
          ],
          meta: { ax: f.a.x, ay: f.a.y, ux: f.ux, uy: f.uy, p: f.p, q: f.q, r: f.r },
        };
      },
    },
    {
      id: "abbildung-flaeche",
      make: (rng, level): ExerciseTask => {
        let a: Vec;
        let b: Vec;
        let c: Vec;
        do {
          a = vec(rng.int(-4, 4), rng.int(-4, 4));
          b = vec(rng.int(-4, 4), rng.int(-4, 4));
          c = vec(rng.int(-4, 4), rng.int(-4, 4));
        } while (triangleDet([a, b, c]) <= 0);
        const area = triangleDet([a, b, c]) / 2;
        const k = rng.pick([-3, -2, -1.5, -0.5, 0.5, 1.5, 2, 3]);
        if (level === 1) {
          return {
            prompt: `Das Dreieck ABC mit ${named("A", a)}, ${named("B", b)} und ${named("C", c)} wird zentrisch mit k = ${fmt(k)} gestreckt. Berechne den Flächeninhalt von ABC und den des Bilddreiecks A'B'C'.`,
            given: [named("A", a), named("B", b), named("C", c), `k = ${fmt(k)}`],
            formulaHint: "A = ½ · det(AB→, AC→) FE; bei der zentrischen Streckung A' = k² · A",
            fields: [
              numberField("A<sub>ABC</sub> =", area, "FE", 2),
              numberField("A<sub>A'B'C'</sub> =", k * k * area, "FE", 2, { slips: [{ value: Math.abs(k) * area, hint: "Flächeninhalte werden mit k² multipliziert, nicht mit k." }] }),
            ],
            steps: [
              `det(${vn("AB")}, ${vn("AC")}) = ${detHtml(b.x - a.x, c.x - a.x, b.y - a.y, c.y - a.y)} = ${fmt(2 * area)}, also A<sub>ABC</sub> = ${fmt(area)} FE`,
              `A<sub>A'B'C'</sub> = k² · A<sub>ABC</sub> = ${fmt(k * k)} · ${fmt(area)} FE`,
              `<strong>A<sub>ABC</sub> = ${fmt(area)} FE, A<sub>A'B'C'</sub> = ${fmt(k * k * area)} FE</strong>`,
            ],
            meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y, k },
          };
        }
        const moves = rng.shuffle([
          { text: "an der x-Achse gespiegelt", flips: true },
          { text: rng.next() < 0.5 ? "um O um 90° gedreht" : "um den Vektor mit den Koordinaten 3 und −2 verschoben", flips: false },
          { text: `mit dem Zentrum O und k = ${fmt(k)} zentrisch gestreckt`, flips: false },
        ]);
        const chain = rng.next() < 0.5 ? moves : moves.filter((m) => !m.flips).concat([{ text: "an der Geraden y = x gespiegelt", flips: true }, { text: "an der y-Achse gespiegelt", flips: true }]);
        const flips = chain.filter((m) => m.flips).length % 2 === 1;
        return {
          prompt: `Das Dreieck ABC mit ${named("A", a)}, ${named("B", b)} und ${named("C", c)} (gegen den Uhrzeigersinn) wird nacheinander ${chain.map((m) => m.text).join(", dann ")}. Berechne den Flächeninhalt des Bilddreiecks und gib seinen Umlaufsinn an.`,
          given: [named("A", a), named("B", b), named("C", c), `k = ${fmt(k)}`],
          fields: [
            numberField("A' =", k * k * area, "FE", 2, { slips: [{ value: Math.abs(k) * area, hint: "Flächeninhalte werden mit k² multipliziert, nicht mit k." }] }),
            choiceField("Umlaufsinn des Bilddreiecks", ["gegen den Uhrzeigersinn", "im Uhrzeigersinn"], flips ? 1 : 0),
          ],
          steps: [
            `A<sub>ABC</sub> = ½ · ${detHtml(b.x - a.x, c.x - a.x, b.y - a.y, c.y - a.y)} = ${fmt(area)} FE`,
            `Spiegelung, Drehung und Verschiebung ändern den Flächeninhalt nicht; die Streckung multipliziert ihn mit k² = ${fmt(k * k)}.`,
            `Jede Achsenspiegelung kehrt den Umlaufsinn um, Drehung, Verschiebung und Streckung nicht. Hier: ${chain.filter((m) => m.flips).length} Spiegelung${chain.filter((m) => m.flips).length === 1 ? "" : "en"}.`,
            `<strong>A' = ${fmt(k * k * area)} FE, ${flips ? "im Uhrzeigersinn" : "gegen den Uhrzeigersinn"}</strong>`,
          ],
          meta: { ax: a.x, ay: a.y, bx: b.x, by: b.y, cx: c.x, cy: c.y, k, mirrors: chain.filter((m) => m.flips).length },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Flächeninhalte mit Determinanten, auch für Vierecke, Abbildungen und Dreiecksscharen mit Extremwert.",
};

// 3.8 Abbildungen hintereinander und Trägergraphen ───────────────────────────

interface NamedMap {
  name: string;
  map: (p: Vec) => Vec;
}

const FIRST_MAPS: NamedMap[] = [
  { name: "an der x-Achse gespiegelt", map: (p) => vec(p.x, -p.y) },
  { name: "an der y-Achse gespiegelt", map: (p) => vec(-p.x, p.y) },
  { name: "an der Winkelhalbierenden y = x gespiegelt", map: (p) => vec(p.y, p.x) },
  { name: "um O um 90° gedreht", map: (p) => vec(-p.y, p.x) },
  { name: "um O um 180° gedreht", map: (p) => vec(-p.x, -p.y) },
];

/** Affine maps of a line y = m·x + t whose image line has nice coefficients. */
function lineMap(rng: Rng): { name: string; a: number; b: number; c: number; d: number; e: number; f: number } {
  const v = vec(nonZero(rng, 4), nonZero(rng, 4));
  const k = rng.pick([2, -2, 0.5, -0.5]);
  return rng.pick([
    { name: `die Parallelverschiebung mit ${vn("v")} = ${colHtml(v, 0)}`, a: 1, b: 0, c: 0, d: 1, e: v.x, f: v.y },
    { name: "die Drehung um O um 90°", a: 0, b: -1, c: 1, d: 0, e: 0, f: 0 },
    { name: "die Achsenspiegelung an der Winkelhalbierenden y = x", a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 },
    { name: "die Achsenspiegelung an der x-Achse", a: 1, b: 0, c: 0, d: -1, e: 0, f: 0 },
    { name: `die zentrische Streckung mit dem Zentrum O und k = ${fmt(k)}`, a: k, b: 0, c: 0, d: k, e: 0, f: 0 },
  ]);
}

/** The image line of y = m·x + t under x' = a x + b y + e, y' = c x + d y + f. */
function imageLine(m: number, t: number, g: { a: number; b: number; c: number; d: number; e: number; f: number }) {
  const kx = g.a + g.b * m;
  const cx = g.b * t + g.e;
  const ky = g.c + g.d * m;
  const cy = g.d * t + g.f;
  const slope = ky / kx;
  return { kx, cx, ky, cy, slope, intercept: cy - slope * cx };
}

/** The steps from x' and y' to the Trägergraph, as a learner writes them down. */
function carrierSteps(m: number, t: number, g: { a: number; b: number; c: number; d: number; e: number; f: number }, name = "P<sub>n</sub>'"): string[] {
  const { kx, cx, ky, cy, slope, intercept } = imageLine(m, t, g);
  return [
    `${name}: x' = ${linear(kx, cx)} und y' = ${linear(ky, cy)}`,
    `Aus x' = ${linear(kx, cx)} folgt x = ${linearIn(1 / kx, -cx / kx, "x'")}.`,
    `Eingesetzt: y' = ${ky === 1 ? "" : `${fmt(ky)} · `}(${linearIn(1 / kx, -cx / kx, "x'")})${cy === 0 ? "" : ` ${cy < 0 ? "−" : "+"} ${fmt(Math.abs(cy))}`} = ${linearIn(slope, intercept, "x'")}`,
  ];
}

const traegergraph: Lesson = {
  id: "ab-5-traegergraph",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "3.8 Abbildungen hintereinander und Trägergraphen",
  subtitle: "Bildpunkte in Abhängigkeit von x und die Kurve, auf der sie liegen",
  tracks: ["I"],
  lehrplan: `${LB2}: Abbildungen, Hintereinanderausführung und Trägergraphen`,
  whyItMatters:
    "In der Abschlussprüfung wandern Punkte auf einer Geraden oder Parabel, und ihre Bildpunkte bilden eine neue Kurve. Wer die Bildpunkte in Abhängigkeit von x berechnen kann, löst die typische Aufgabe „Die Punkte C_n liegen auf …“ in wenigen Zeilen.",
  explanationHtml: `
    <p><strong>Hintereinanderausführung:</strong> Man bildet zuerst mit der ersten Abbildung ab und den Bildpunkt dann mit der zweiten: P ↦ P' ↦ P''. Die Reihenfolge ist wichtig. Spiegelung an der x-Achse und dann Verschiebung um ${vn("v")} = ${vecHtml(2, 1)} liefert ${vecHtml("x", "y")} ↦ ${vecHtml("x", "−y")} ↦ ${vecHtml("x + 2", "−y + 1")}; erst verschieben, dann spiegeln liefert ${vecHtml("x + 2", "−y − 1")}.</p>
    <p><strong>Punktscharen:</strong> Liegen die Punkte P<sub>n</sub>(x | f(x)) auf einem Graphen, hängen auch ihre Bildpunkte P<sub>n</sub>'(x' | y') von x ab. Den <strong>Trägergraphen</strong>, auf dem alle Bildpunkte liegen, findest du so:</p>
    <ol class="steps">
      <li>Bildpunkt in Abhängigkeit von x berechnen: x' = … und y' = ….</li>
      <li>Die Gleichung für x' nach x auflösen.</li>
      <li>In die Gleichung für y' einsetzen und vereinfachen; am Ende schreibt man wieder x und y.</li>
    </ol>
    <div class="example">Beispiel 1: Die Punkte P<sub>n</sub>(x | 0,5x + 1) werden um O um 90° gedreht: x' = −(0,5x + 1) = −0,5x − 1 und y' = x. Aus x' = −0,5x − 1 folgt x = −2x' − 2, eingesetzt y' = −2x' − 2. Die Bildpunkte liegen auf der Geraden h: y = −2x − 2. Probe: 0,5 · (−2) = −1, h steht senkrecht auf der Urgeraden.<br>Beispiel 2: Die Parabelpunkte P<sub>n</sub>(x | x² − 2) werden um ${vn("v")} = ${vecHtml(3, 1)} verschoben: x' = x + 3 und y' = x² − 1. Mit x = x' − 3 folgt y' = (x' − 3)² − 1: wieder eine Parabel, ihr Scheitel ist S'(3 | −1).</div>
    <div class="merke"><strong>Merke:</strong> Trägergraph: x' nach x auflösen und in y' einsetzen. Bei Verschiebung und zentrischer Streckung bleibt eine Gerade parallel zu sich selbst, bei der Drehung um 90° steht sie danach senkrecht dazu.</div>
  `,
  formulas: [
    { name: "Trägergraph der Bildpunkte", html: "x' = … und y' = … in Abhängigkeit von x; x' nach x auflösen und in y' einsetzen", quantities: "P n'(x' | y') sind die Bildpunkte der Punktschar P n" },
    { name: "Hintereinanderausführung", html: "P ↦ P' ↦ P''", quantities: "erst die erste, dann die zweite Abbildung; die Reihenfolge zählt" },
  ],
  quiz: {
    question: "Die Punkte P_n(x | 2x) werden um den Vektor mit den Koordinaten 1 und 3 verschoben. Auf welcher Geraden liegen die Bildpunkte?",
    options: ["y = 2x + 1", "y = 2x + 3", "y = 2x + 5"],
    correctIndex: 0,
    explanation: "x' = x + 1 und y' = 2x + 3. Mit x = x' − 1 folgt y' = 2(x' − 1) + 3 = 2x' + 1. Die Verschiebung um 1 nach rechts senkt die Gerade um 2 ab, die um 3 nach oben hebt sie wieder.",
  },
  lab: {
    kind: "locus",
    title: "Labor: Punktscharen und Trägergraphen",
    intro: "Wähle einen Graphen und eine Abbildung und ziehe Pₙ. Die orangen Punkte sind die Bildpunkte für x = −4, −3, …, 4. Lass dir den Trägergraphen zeigen, auf dem alle Bildpunkte liegen.",
    params: [
      { type: "choice", key: "graph", label: "Punktschar", options: Object.entries(LOCUS_GRAPHS).map(([value, g]) => ({ value: Number(value), label: g.label })), value: 0 },
      { type: "choice", key: "map", label: "Abbildung", options: Object.entries(LOCUS_MAPS).map(([value, m]) => ({ value: Number(value), label: m.label })), value: 0 },
      { type: "range", key: "x", label: "x von Pₙ", unit: "", min: -4, max: 4, step: 0.5, value: 2, digits: 1 },
      { type: "choice", key: "trace", label: "Trägergraph", options: [{ value: 0, label: "verbergen" }, { value: 1, label: "zeigen" }], value: 0 },
    ],
    readouts: [
      { key: "P", label: "Pₙ", compute: (v) => named("Pₙ", vec(v.x, graphY(graphOf(v), v.x))) },
      { key: "Q", label: "Bildpunkt Pₙ'", emphasis: true, compute: (v) => named("Pₙ'", applyAffine(mapOf(v), vec(v.x, graphY(graphOf(v), v.x)))) },
      { key: "terms", label: "in Abhängigkeit von x", compute: (v) => imageTerms(graphOf(v), mapOf(v)).join("; ") },
      { key: "carrier", label: "Trägergraph", compute: (v) => (v.trace === 1 ? carrierText(graphOf(v), mapOf(v)) : "noch verborgen") },
    ],
    goals: [
      {
        id: "y-achse",
        text: "Finde einen Punkt Pₙ, der nicht auf der y-Achse liegt, dessen Bildpunkt Pₙ' aber auf der y-Achse liegt.",
        check: (v) => v.x !== 0 && Math.abs(applyAffine(mapOf(v), vec(v.x, graphY(graphOf(v), v.x))).x) < 1e-9,
      },
      {
        id: "fixpunkt",
        text: "Finde einen Punkt Pₙ, der auf sich selbst abgebildet wird (Fixpunkt).",
        check: (v) => { const p = vec(v.x, graphY(graphOf(v), v.x)); return same(applyAffine(mapOf(v), p), p); },
      },
      {
        id: "parallel",
        text: "Zeige den Trägergraphen und finde eine Abbildung, bei der er für die Gerade g parallel zu g verläuft.",
        check: (v) => v.graph === 0 && v.trace === 1 && (v.map === 2 || v.map === 3),
      },
    ],
  },
  exercises: [
    {
      id: "hintereinander",
      make: (rng, level): ExerciseTask => {
        const p = vec(nonZero(rng, 6), nonZero(rng, 6));
        if (level === 1) {
          const first = rng.pick(FIRST_MAPS);
          const v = vec(nonZero(rng, 5), nonZero(rng, 5));
          const p1 = first.map(p);
          const p2 = add(p1, v);
          const swapped = first.map(add(p, v));
          return {
            prompt: `Der Punkt ${named("P", p)} wird zuerst ${first.name} und der Bildpunkt P' dann um ${vn("v")} = ${colHtml(v, 0)} verschoben. Berechne die Koordinaten von P''.`,
            given: [named("P", p), `1. ${first.name}`, `2. Verschiebung um ${vn("v")} = ${colHtml(v, 0)}`],
            formulaHint: "erst P ↦ P' mit der ersten Abbildung, dann P' ↦ P'' = P' ⊕ v→",
            fields: [
              numberField("P'': x'' =", p2.x, "", 0, same(swapped, p2) ? {} : { slips: [{ value: swapped.x, hint: "Achte auf die Reihenfolge: zuerst die erste Abbildung, dann die Verschiebung." }] }),
              numberField("y'' =", p2.y, "", 0, same(swapped, p2) ? {} : { slips: [{ value: swapped.y, hint: "Achte auf die Reihenfolge: zuerst die erste Abbildung, dann die Verschiebung." }] }),
            ],
            steps: [`1. Abbildung: ${named("P", p)} ↦ ${named("P'", p1)}`, `2. Verschiebung: ${colHtml(p1, 0)} ⊕ ${colHtml(v, 0)} = ${colHtml(p2, 0)}`, `<strong>${named("P''", p2)}</strong>`],
            meta: { px: p.x, py: p.y, vx: v.x, vy: v.y, first: FIRST_MAPS.indexOf(first) },
          };
        }
        const m = rng.pick([0.5, -0.5, 2, -2]);
        const reflectFirst = rng.next() < 0.5;
        const turn = (q: Vec) => vec(-q.y, q.x);
        const result = reflectFirst ? turn(reflectSlope(p, m)) : reflectSlope(turn(p), m);
        const other = reflectFirst ? reflectSlope(turn(p), m) : turn(reflectSlope(p, m));
        const c = mirrorCos(m);
        const s = mirrorSin(m);
        const order = reflectFirst
          ? `zuerst an der Geraden g: y = ${linear(m, 0)} gespiegelt und dann um O um 90° gedreht`
          : `zuerst um O um 90° gedreht und dann an der Geraden g: y = ${linear(m, 0)} gespiegelt`;
        const mid = reflectFirst ? reflectSlope(p, m) : turn(p);
        return {
          prompt: `Der Punkt ${named("C", p)} wird ${order}. Berechne die Koordinaten von C''. (Für g gilt cos 2α = ${fmt(c)} und sin 2α = ${fmt(s)}.)`,
          given: [named("C", p), `g: y = ${linear(m, 0)}`, `cos 2α = ${fmt(c)}, sin 2α = ${fmt(s)}`],
          fields: [
            numberField("C'': x'' =", result.x, "", 2, same(other, result) ? {} : { slips: [{ value: other.x, hint: "Achte auf die Reihenfolge der beiden Abbildungen." }] }),
            numberField("y'' =", result.y, "", 2, same(other, result) ? {} : { slips: [{ value: other.y, hint: "Achte auf die Reihenfolge der beiden Abbildungen." }] }),
          ],
          steps: [
            reflectFirst
              ? `Spiegelung: x' = ${fmt(p.x)} · ${paren(c)} + ${paren(p.y)} · ${paren(s)} = ${fmt(mid.x)}, y' = ${fmt(p.x)} · ${paren(s)} − ${paren(p.y)} · ${paren(c)} = ${fmt(mid.y)}`
              : `Drehung um 90°: ${colHtml(p, 0)} ↦ ${colHtml(mid)}`,
            reflectFirst
              ? `Drehung um 90°: ${colHtml(mid)} ↦ ${colHtml(result)}`
              : `Spiegelung: x'' = ${fmt(mid.x)} · ${paren(c)} + ${paren(mid.y)} · ${paren(s)} = ${fmt(result.x)}, y'' = ${fmt(mid.x)} · ${paren(s)} − ${paren(mid.y)} · ${paren(c)} = ${fmt(result.y)}`,
            `<strong>C''(${fmt(result.x)} | ${fmt(result.y)})</strong>`,
          ],
          meta: { px: p.x, py: p.y, m, reflectFirst: reflectFirst ? 1 : 0 },
        };
      },
    },
    {
      id: "traegergerade",
      make: (rng, level): ExerciseTask => {
        const m = rng.pick([0.5, -0.5, 2, -2, 1, -1]);
        const t = nonZero(rng, 4);
        if (level === 1) {
          const g = lineMap(rng);
          const { slope, intercept } = imageLine(m, t, g);
          return {
            prompt: `Die Punkte P<sub>n</sub>(x | ${linear(m, t)}) werden durch ${g.name} auf die Punkte P<sub>n</sub>' abgebildet. Berechne die Koordinaten von P<sub>n</sub>' in Abhängigkeit von x und bestimme die Gleichung y = m' · x + t' des Trägergraphen der Punkte P<sub>n</sub>'.`,
            given: [`P<sub>n</sub>(x | ${linear(m, t)})`, g.name.replace(/^die /, "")],
            formulaHint: "x' und y' in Abhängigkeit von x aufstellen, x' nach x auflösen, in y' einsetzen",
            fields: [numberField("m' =", slope, "", 2), numberField("t' =", intercept, "", 2)],
            steps: [...carrierSteps(m, t, g), `<strong>Trägergraph: y = ${linear(slope, intercept)}</strong>`],
            meta: { m, t, a: g.a, b: g.b, c: g.c, d: g.d, e: g.e, f: g.f },
          };
        }
        const v = vec(nonZero(rng, 4), nonZero(rng, 4));
        const turnFirst = rng.next() < 0.5;
        const g = turnFirst ? { a: 0, b: -1, c: 1, d: 0, e: v.x, f: v.y } : { a: 1, b: 0, c: 0, d: -1, e: v.x, f: v.y };
        const { slope, intercept } = imageLine(m, t, g);
        const first = turnFirst ? "um O um 90° gedreht" : "an der x-Achse gespiegelt";
        const middle = turnFirst ? `B<sub>n</sub>'(${linear(-m, -t)} | x)` : `B<sub>n</sub>'(x | ${linear(-m, -t)})`;
        return {
          prompt: `Die Punkte B<sub>n</sub>(x | ${linear(m, t)}) werden zuerst ${first} und dann um ${vn("v")} = ${colHtml(v, 0)} verschoben; so entstehen die Punkte C<sub>n</sub>. Zeige, dass die Punkte C<sub>n</sub> auf einer Geraden h liegen, und bestimme ihre Gleichung.`,
          given: [`B<sub>n</sub>(x | ${linear(m, t)})`, `1. ${first}`, `2. Verschiebung um ${vn("v")} = ${colHtml(v, 0)}`],
          fields: [numberField("m' =", slope, "", 2), numberField("t' =", intercept, "", 2)],
          steps: [`Nach der ersten Abbildung: ${middle}`, ...carrierSteps(m, t, g, "C<sub>n</sub>"), `<strong>h: y = ${linear(slope, intercept)}</strong>`],
          meta: { m, t, a: g.a, b: g.b, c: g.c, d: g.d, e: g.e, f: g.f },
        };
      },
    },
    {
      id: "traegerparabel",
      make: (rng, level): ExerciseTask => {
        const a = rng.pick([0.5, -0.5, 1, -1, 2, 0.25]);
        const d = rng.int(-3, 3);
        const e = rng.int(-3, 3);
        const parabola = vertexForm(a, d, e);
        const v = vec(nonZero(rng, 4), nonZero(rng, 4));
        if (level === 1) {
          const kind = rng.int(0, 2);
          // a / k keeps at most two decimals
          const k = Math.abs(a) === 0.25 ? 0.5 : rng.pick([2, -2, 0.5]);
          const result =
            kind === 0
              ? { name: `die Parallelverschiebung mit ${vn("v")} = ${colHtml(v, 0)}`, a1: a, s: vec(d + v.x, e + v.y), rule: `x' = x + ${paren(v.x)}, y' = y + ${paren(v.y)}` }
              : kind === 1
                ? { name: "die Achsenspiegelung an der x-Achse", a1: -a, s: vec(d, -e), rule: "x' = x, y' = −y" }
                : { name: `die zentrische Streckung mit dem Zentrum O und k = ${fmt(k)}`, a1: a / k, s: vec(k * d, k * e), rule: `x' = ${fmt(k)}x, y' = ${fmt(k)}y` };
          return {
            prompt: `Die Punkte P<sub>n</sub>(x | ${parabola}) liegen auf der Parabel p. Sie werden durch ${result.name} auf die Punkte P<sub>n</sub>' abgebildet. Der Trägergraph der P<sub>n</sub>' ist eine Parabel p' mit y = a' · (x − x<sub>S</sub>)² + y<sub>S</sub>. Bestimme a' und den Scheitel S'.`,
            given: [`p: y = ${parabola}, Scheitel S${point(d, e)}`, result.name.replace(/^die /, "")],
            formulaHint: `${result.rule}; x' nach x auflösen und in y' einsetzen`,
            fields: [numberField("a' =", result.a1, "", 2), numberField("x<sub>S</sub> =", result.s.x, "", 2), numberField("y<sub>S</sub> =", result.s.y, "", 2)],
            steps: [
              `Abbildungsgleichung: ${result.rule}`,
              `Eingesetzt und nach x aufgelöst: p': y = ${vertexForm(result.a1, result.s.x, result.s.y)}`,
              `<strong>a' = ${fmt(result.a1)}, S'${point(result.s.x, result.s.y)}</strong>`,
            ],
            meta: { a, d, e, kind, k, vx: v.x, vy: v.y },
          };
        }
        const mirrorFirst = rng.next() < 0.5;
        const k = Math.abs(a) === 0.25 ? rng.pick([0.5, -0.5]) : rng.pick([2, -2, 0.5, -0.5]);
        const result = mirrorFirst ? { a1: -a, s: vec(d + v.x, -e + v.y) } : { a1: a / k, s: vec(k * (d + v.x), k * (e + v.y)) };
        const text = mirrorFirst
          ? `zuerst an der x-Achse gespiegelt und dann um ${vn("v")} = ${colHtml(v, 0)} verschoben`
          : `zuerst um ${vn("v")} = ${colHtml(v, 0)} verschoben und dann zentrisch mit dem Zentrum O und k = ${fmt(k)} gestreckt`;
        return {
          prompt: `Die Punkte P<sub>n</sub>(x | ${parabola}) werden ${text}. Zeige, dass die Bildpunkte P<sub>n</sub>'' auf einer Parabel liegen, und gib ihre Gleichung in Scheitelpunktsform an: Bestimme a' und den Scheitel S''.`,
          given: [`P<sub>n</sub>(x | ${parabola})`, mirrorFirst ? "1. Spiegelung an der x-Achse" : `1. Verschiebung um ${vn("v")} = ${colHtml(v, 0)}`, mirrorFirst ? `2. Verschiebung um ${vn("v")} = ${colHtml(v, 0)}` : `2. Streckung Z = O, k = ${fmt(k)}`],
          fields: [numberField("a' =", result.a1, "", 2), numberField("x<sub>S</sub> =", result.s.x, "", 2), numberField("y<sub>S</sub> =", result.s.y, "", 2)],
          steps: mirrorFirst
            ? [
                `Spiegelung: (x | ${parabola}) ↦ (x | ${vertexForm(-a, d, -e)})`,
                `Verschiebung: x'' = x + ${paren(v.x)}, y'' = ${vertexForm(-a, d, -e)} + ${paren(v.y)}; mit x = x'' − ${paren(v.x)} folgt y'' = ${vertexForm(-a, d + v.x, -e + v.y).replace(/x/g, "x''")}`,
                `<strong>a' = ${fmt(result.a1)}, S''${point(result.s.x, result.s.y)}</strong>`,
              ]
            : [
                `Verschiebung: der Scheitel wandert von S${point(d, e)} nach ${point(d + v.x, e + v.y)}, die Parabel bleibt y = ${vertexForm(a, d + v.x, e + v.y)}.`,
                `Streckung: x'' = ${fmt(k)}x, y'' = ${fmt(k)}y; mit x = x'' : ${paren(k)} folgt y'' = ${fmt(k)} · ${paren(a)} · (x'' : ${paren(k)} − ${paren(d + v.x)})² + ${paren(k * (e + v.y))} = ${vertexForm(result.a1, result.s.x, result.s.y).replace(/x/g, "x''")}`,
                `<strong>a' = ${fmt(result.a1)}, S''${point(result.s.x, result.s.y)}</strong>`,
              ],
          meta: { a, d, e, vx: v.x, vy: v.y, k, mirrorFirst: mirrorFirst ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du führst Abbildungen hintereinander aus und bestimmst die Gleichung des Trägergraphen einer Punktschar.",
};

export const STAGE_VEKTOREN_ABBILDUNGEN: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Vektoren und Abbildungen",
  subtitle: "Skalarprodukt, Abstand, Verschiebung, Streckung, Spiegelung, Drehung, Determinante, Trägergraph",
  icon: "🧭",
  accent: "#7c3aed",
  badgeTitle: "Abbildungs-Profi",
  lehrplanLabel: "LB 1 Skalarprodukt · LB 2 Abbildungen (nur Zweig I)",
  lessons: [vektoren, skalarprodukt, abstand, verschiebungStreckung, achsenspiegelung, drehung, determinante, traegergraph],
};
