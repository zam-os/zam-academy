import { fmt, fmtUnit, frac, sqrtHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import { ropeSides } from "../lab/views-dreiecke";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import {
  acosD,
  asinD,
  atanD,
  choiceField,
  cosD,
  near,
  numberField,
  RAD_HINT,
  sinD,
  tanD,
  within,
  yesNo,
} from "./helpers";

const STAGE_ID = "stage-1-dreiecke";
const LEHRPLAN = "M9 LB 3 (I) · M9 LB 3 (II/III): Rechtwinklige Dreiecke";

/** A Pythagorean triple scaled by k, legs first: (3, 4, 5) · k and friends. */
function triple(rng: Rng): [number, number, number] {
  const [a, b, c] = rng.pick([
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
    [6, 8, 10],
    [9, 12, 15],
    [20, 21, 29],
  ] as const);
  const k = rng.pick([1, 1, 2, 0.5]);
  return [a * k, b * k, c * k];
}

// 1.1 Satz des Pythagoras ───────────────────────────────────────────────────

const pythagoras: Lesson = {
  id: "rd-1-pythagoras",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Der Satz des Pythagoras",
  subtitle: "Drei Quadrate, eine Gleichung, und ein Puzzle als Beweis",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Satz des Pythagoras`,
  whyItMatters:
    "Handwerker prüfen damit rechte Winkel, Navigationsgeräte berechnen Luftlinien, und jeder Bildschirm wird nach seiner Diagonale verkauft. Wo ein rechter Winkel ist, hilft Pythagoras.",
  explanationHtml: `
    <p>Ein Dreieck mit einem rechten Winkel heißt <strong>rechtwinklig</strong>. Die zwei Seiten, die den rechten Winkel bilden, heißen <strong>Katheten</strong>. Die Seite <strong>gegenüber dem rechten Winkel</strong> heißt <strong>Hypotenuse</strong>; sie ist immer die längste Seite.</p>
    <p><strong>Satz des Pythagoras:</strong> In jedem rechtwinkligen Dreieck haben die Quadrate über den beiden Katheten zusammen genau den Flächeninhalt des Quadrats über der Hypotenuse. Liegt der rechte Winkel bei C, gilt <strong>a² + b² = c²</strong>.</p>
    <ul>
      <li>Hypotenuse berechnen: c = ${sqrtHtml("a² + b²")}.</li>
      <li>Kathete berechnen: a = ${sqrtHtml("c² − b²")}. Hier wird subtrahiert, weil die Hypotenuse die längste Seite ist.</li>
      <li>Die Gleichung hängt an der <strong>Lage des rechten Winkels</strong>, nicht an den Buchstaben: Liegt er bei B, ist b die Hypotenuse, und es gilt a² + c² = b².</li>
    </ul>
    <div class="example">Beispiel: a = 3 cm, b = 4 cm. Dann ist c² = 9 cm² + 16 cm² = 25 cm², also c = 5 cm.</div>
    <p>Im Labor siehst du auch den Grund: Vier gleiche Dreiecke liegen in einem Quadrat mit der Seite a + b. Schiebst du sie um, bleibt einmal das Quadrat c² frei und einmal die Quadrate a² und b². Die freie Fläche ist beide Male dieselbe.</p>
    <div class="merke"><strong>Merke:</strong> Erst quadrieren, dann addieren, zuletzt die Wurzel ziehen. 3 + 4 ist nicht 5, aber 3² + 4² = 5².</div>
  `,
  formulas: [
    { name: "Satz des Pythagoras", html: "a² + b² = c²", quantities: "a, b Katheten, c Hypotenuse (rechter Winkel bei C)" },
    { name: "Hypotenuse", html: `c = ${sqrtHtml("a² + b²")}`, quantities: "aus beiden Katheten" },
    { name: "Kathete", html: `a = ${sqrtHtml("c² − b²")}`, quantities: "aus Hypotenuse und der anderen Kathete" },
  ],
  quiz: {
    question: "Im Dreieck ABC liegt der rechte Winkel bei B. Welche Gleichung gilt?",
    options: ["a² + b² = c²", "a² + c² = b²", "b² + c² = a²"],
    correctIndex: 1,
    explanation: "Die Hypotenuse liegt dem rechten Winkel gegenüber, bei B ist das die Seite b. Also a² + c² = b².",
  },
  lab: {
    kind: "pythagoras",
    title: "Labor: Quadrate an den Seiten",
    intro: "Ziehe die Ecken A und B und vergleiche die drei Quadrate. Im Puzzle siehst du, warum der Satz für jedes rechtwinklige Dreieck gilt.",
    params: [
      { type: "range", key: "a", label: "Kathete a", unit: "cm", min: 1, max: 9, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "b", label: "Kathete b", unit: "cm", min: 1, max: 9, step: 0.5, value: 2, digits: 1 },
      { type: "choice", key: "view", label: "Ansicht", options: [{ value: 0, label: "Quadrate an den Seiten" }, { value: 1, label: "Puzzle-Beweis" }], value: 0 },
      { type: "range", key: "puzzle", label: "Dreiecke verschieben", unit: "%", min: 0, max: 100, step: 1, value: 0, showIf: (v) => v.view === 1 },
    ],
    readouts: [
      { key: "a2", label: "a²", unit: "cm²", digits: 2, compute: (v) => v.a * v.a },
      { key: "b2", label: "b²", unit: "cm²", digits: 2, compute: (v) => v.b * v.b },
      { key: "c2", label: "c² = a² + b²", unit: "cm²", digits: 2, compute: (v) => v.a * v.a + v.b * v.b },
      { key: "c", label: "Hypotenuse c", unit: "cm", digits: 2, emphasis: true, compute: (v) => Math.hypot(v.a, v.b) },
    ],
    goals: [
      {
        id: "zehn",
        text: "Stelle ein Dreieck mit genau c = 10 cm ein.",
        check: (_v, r) => within(Number(r.c), 10, 1e-9),
      },
      {
        id: "tripel",
        text: "Finde ein Dreieck, dessen Hypotenuse eine ganze oder halbe Zahl ist, das aber nicht die Form 3 : 4 : 5 hat.",
        check: (v, r) => {
          const c = Number(r.c);
          const half = Math.abs(c * 2 - Math.round(c * 2)) < 1e-9;
          const ratio = v.a / v.b;
          return half && Math.abs(ratio - 0.75) > 1e-9 && Math.abs(ratio - 4 / 3) > 1e-9;
        },
      },
      {
        id: "puzzle",
        text: "Puzzle-Beweis: Schiebe bei einem Dreieck mit a ≠ b alle vier Dreiecke ganz um.",
        check: (v) => v.view === 1 && v.puzzle === 100 && v.a !== v.b,
      },
    ],
  },
  exercises: [
    {
      id: "hypotenuse",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.int(3, 15);
          const b = rng.int(3, 15);
          const c = Math.hypot(a, b);
          return {
            prompt: `Ein rechtwinkliges Dreieck hat die Katheten a = ${fmt(a)} cm und b = ${fmt(b)} cm. Berechne die Hypotenuse c.`,
            given: [`a = ${fmtUnit(a, "cm")}`, `b = ${fmtUnit(b, "cm")}`],
            formulaHint: `c = ${sqrtHtml("a² + b²")}`,
            fields: [
              numberField("c =", c, "cm", 2, {
                slips: [
                  { value: a + b, hint: "Du hast a + b gerechnet. Quadriere zuerst beide Katheten, addiere dann, und ziehe zuletzt die Wurzel." },
                  { value: a * a + b * b, hint: "Das ist c². Ziehe noch die Wurzel." },
                ],
              }),
            ],
            steps: [
              `c² = a² + b² = ${fmt(a * a)} cm² + ${fmt(b * b)} cm² = ${fmt(a * a + b * b)} cm²`,
              `c = ${sqrtHtml(`${fmt(a * a + b * b)} cm²`)} ≈ <strong>${fmtUnit(c, "cm")}</strong>`,
            ],
          };
        }
        if (rng.next() < 0.5) {
          const k = rng.int(5, 9);
          const w = 16 * k;
          const h = 9 * k;
          const d = Math.hypot(w, h);
          return {
            prompt: `Ein Fernseher im Format 16 : 9 hat ein Bild, das ${fmt(w)} cm breit und ${fmt(h)} cm hoch ist. Fernseher werden nach ihrer Bilddiagonale in Zoll verkauft (1 Zoll = 2,54 cm). Wie viel Zoll hat er?`,
            given: [`Breite ${fmtUnit(w, "cm")}`, `Höhe ${fmtUnit(h, "cm")}`, "1 Zoll = 2,54 cm"],
            fields: [
              numberField("Diagonale =", d / 2.54, "Zoll", 1, {
                slips: [{ value: d, hint: "Das ist die Diagonale in cm. Rechne sie noch in Zoll um: durch 2,54." }],
              }),
            ],
            steps: [
              `Breite und Höhe sind die Katheten, die Diagonale ist die Hypotenuse.`,
              `d = ${sqrtHtml(`${fmt(w)}² + ${fmt(h)}²`)} cm ≈ ${fmtUnit(d, "cm", 1)}`,
              `d ≈ ${fmt(d, 1)} cm : 2,54 cm ≈ <strong>${fmtUnit(d / 2.54, "Zoll", 1)}</strong>`,
            ],
          };
        }
        const height = rng.int(205, 235);
        const depth = rng.int(55, 75);
        const diagonal = Math.hypot(height, depth);
        // A ceiling within 1 cm of the diagonal would let rounding decide the
        // answer, so draw again until the gap is clear.
        let ceiling = rng.int(225, 245);
        while (Math.abs(diagonal - ceiling) < 1) ceiling = rng.int(225, 245);
        const fits = diagonal < ceiling;
        return {
          prompt: `Ein Schrank liegt auf dem Rücken und soll aufgerichtet werden. Er ist ${fmt(height)} cm hoch und ${fmt(depth)} cm tief. Beim Aufrichten dreht er sich um eine Kante; dabei ragt seine Diagonale am weitesten nach oben. Wie lang ist die Diagonale, und passt der Schrank unter eine Decke in ${fmt(ceiling)} cm Höhe?`,
          given: [`Höhe ${fmtUnit(height, "cm")}`, `Tiefe ${fmtUnit(depth, "cm")}`, `Raumhöhe ${fmtUnit(ceiling, "cm")}`],
          fields: [
            numberField("Diagonale =", diagonal, "cm", 1, {
              slips: [{ value: height + depth, hint: "Höhe + Tiefe ist zu viel: Die Diagonale ist die Hypotenuse, also √(h² + t²)." }],
            }),
            yesNo("Passt er?", fits),
          ],
          steps: [
            `Höhe und Tiefe sind Katheten, die Diagonale ist die Hypotenuse.`,
            `d = ${sqrtHtml(`${fmt(height)}² + ${fmt(depth)}²`)} cm ≈ ${fmtUnit(diagonal, "cm", 1)}`,
            `${fmt(diagonal, 1)} cm ${fits ? "<" : ">"} ${fmt(ceiling)} cm, also: <strong>${fmtUnit(diagonal, "cm", 1)}, ${fits ? "er passt" : "er passt nicht"}</strong>.`,
          ],
        };
      },
    },
    {
      id: "kathete",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.int(3, 12);
          const c = a + rng.int(2, 9);
          const b = Math.sqrt(c * c - a * a);
          return {
            prompt: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${fmt(c)} cm und die Kathete a = ${fmt(a)} cm lang. Berechne die Kathete b.`,
            given: [`c = ${fmtUnit(c, "cm")}`, `a = ${fmtUnit(a, "cm")}`],
            formulaHint: `b = ${sqrtHtml("c² − a²")}`,
            fields: [
              numberField("b =", b, "cm", 2, {
                slips: [
                  { value: Math.hypot(a, c), hint: "Du hast addiert. Gesucht ist eine Kathete, sie ist kürzer als c: b² = c² − a²." },
                  { value: c - a, hint: "Du hast die Seiten subtrahiert, nicht ihre Quadrate: b² = c² − a²." },
                  { value: c * c - a * a, hint: "Das ist b². Ziehe noch die Wurzel." },
                ],
              }),
            ],
            steps: [
              `b² = c² − a² = ${fmt(c * c)} cm² − ${fmt(a * a)} cm² = ${fmt(c * c - a * a)} cm²`,
              `b = ${sqrtHtml(`${fmt(c * c - a * a)} cm²`)} ≈ <strong>${fmtUnit(b, "cm")}</strong>`,
            ],
          };
        }
        if (rng.next() < 0.5) {
          const L = rng.pick([4, 4.5, 5, 5.5, 6, 7]);
          const x = rng.pick([1.1, 1.2, 1.4, 1.5, 1.6, 1.8]);
          const h = Math.sqrt(L * L - x * x);
          return {
            prompt: `Eine ${fmt(L, 1)} m lange Leiter lehnt an einer Hauswand. Ihr Fuß steht ${fmt(x, 1)} m von der Wand entfernt. Wie hoch reicht die Leiter an der Wand?`,
            given: [`Leiter ${fmtUnit(L, "m", 1)}`, `Abstand ${fmtUnit(x, "m", 1)}`],
            fields: [
              numberField("Höhe =", h, "m", 2, {
                slips: [{ value: Math.hypot(L, x), hint: "Die Leiter ist die längste Seite, die Hypotenuse. Die Höhe ist eine Kathete: h² = L² − x²." }],
              }),
            ],
            steps: [
              `Die Leiter ist die Hypotenuse, Abstand und Höhe sind die Katheten.`,
              `h² = ${fmt(L, 1)}² − ${fmt(x, 1)}² = ${fmt(L * L, 2)} − ${fmt(x * x, 2)} = ${fmt(L * L - x * x, 2)}`,
              `h = ${sqrtHtml(fmt(L * L - x * x, 2))} ≈ <strong>${fmtUnit(h, "m")}</strong>`,
            ],
          };
        }
        const [a, b, c] = triple(rng).map((n) => n * 4);
        return {
          prompt: `Ein Drachen hängt an einer ${fmt(c)} m langen, straff gespannten Schnur. Er steht genau über einem Punkt, der ${fmt(a)} m von dir entfernt ist. In welcher Höhe über deiner Hand fliegt er?`,
          given: [`Schnur ${fmtUnit(c, "m")}`, `Abstand am Boden ${fmtUnit(a, "m")}`],
          fields: [numberField("Höhe =", b, "m", 1, { slips: [{ value: c - a, hint: "Subtrahiere die Quadrate, nicht die Längen: h² = Schnur² − Abstand²." }] })],
          steps: [
            `Die Schnur ist die Hypotenuse.`,
            `h² = ${fmt(c)}² − ${fmt(a)}² = ${fmt(c * c)} − ${fmt(a * a)} = ${fmt(b * b)}`,
            `h = ${sqrtHtml(fmt(b * b))} = <strong>${fmtUnit(b, "m", 1)}</strong>`,
          ],
        };
      },
    },
    {
      id: "lage",
      make: (rng, level): ExerciseTask => {
        const [l1, l2, hyp] = triple(rng);
        if (level === 1) {
          return {
            prompt: `Im Dreieck PQR liegt der rechte Winkel bei Q. Die Seiten heißen nach der gegenüberliegenden Ecke: p = ${fmt(l1)} cm, r = ${fmt(l2)} cm. Berechne q.`,
            given: [`rechter Winkel bei Q`, `p = ${fmtUnit(l1, "cm")}`, `r = ${fmtUnit(l2, "cm")}`],
            formulaHint: "Der rechte Winkel liegt bei Q, also ist q die Hypotenuse: p² + r² = q²",
            fields: [numberField("q =", hyp, "cm", 2)],
            steps: [
              `Die Hypotenuse liegt dem rechten Winkel gegenüber: q.`,
              `q² = p² + r² = ${fmt(l1 * l1)} + ${fmt(l2 * l2)} = ${fmt(hyp * hyp)}`,
              `q = <strong>${fmtUnit(hyp, "cm")}</strong>`,
            ],
          };
        }
        return {
          prompt: `Im Dreieck XYZ ist der Winkel bei X ein rechter. Die Seite x ist ${fmt(hyp)} cm lang, die Seite y ist ${fmt(l1)} cm lang. Wie lang ist z?`,
          given: [`rechter Winkel bei X`, `x = ${fmtUnit(hyp, "cm")}`, `y = ${fmtUnit(l1, "cm")}`],
          fields: [
            numberField("z =", l2, "cm", 2, {
              slips: [{ value: Math.hypot(hyp, l1), hint: "Bei X liegt der rechte Winkel, also ist x die Hypotenuse und z eine Kathete: z² = x² − y²." }],
            }),
          ],
          steps: [
            `Die Seite gegenüber X ist die Hypotenuse: x. Also gilt y² + z² = x².`,
            `z² = x² − y² = ${fmt(hyp * hyp)} − ${fmt(l1 * l1)} = ${fmt(l2 * l2)}`,
            `z = <strong>${fmtUnit(l2, "cm")}</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst die Hypotenuse in jeder Lage und berechnest fehlende Seiten mit a² + b² = c².",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=cIzM2XBduuY",
    title: "Satz des Pythagoras im rechtwinkligen Dreieck",
    author: "Daniel Jung",
  },
};

// 1.2 Umkehrung ──────────────────────────────────────────────────────────────

function ropeGamma(v: { N: number; p: number; q: number }): number | null {
  const { sides, valid } = ropeSides(v);
  if (!valid) return null;
  const [u, w, L] = sides;
  return acosD((u * u + w * w - L * L) / (2 * u * w));
}

const umkehrung: Lesson = {
  id: "rd-2-umkehrung",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Umkehrung: Ist das Dreieck rechtwinklig?",
  subtitle: "Die Knotenschnur der Seilspanner",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Umkehrung des Satzes des Pythagoras`,
  whyItMatters:
    "Wer ein Beet, ein Fundament oder eine Wand abstecken will, braucht einen rechten Winkel, oft ohne Geodreieck. Drei Längen genügen, wenn man die Umkehrung des Pythagoras kennt.",
  explanationHtml: `
    <p>Der Satz des Pythagoras gilt auch umgekehrt: Sind p und q die kürzeren Seiten und r die längste Seite eines Dreiecks, dann gilt</p>
    <ul>
      <li><strong>p² + q² = r²</strong>: Das Dreieck ist <strong>rechtwinklig</strong>, der rechte Winkel liegt r gegenüber.</li>
      <li>p² + q² &gt; r²: Der Winkel gegenüber r ist kleiner als 90°, das Dreieck ist spitzwinklig.</li>
      <li>p² + q² &lt; r²: Der Winkel gegenüber r ist größer als 90°, das Dreieck ist stumpfwinklig.</li>
    </ul>
    <p>Prüfen heißt also: die zwei kurzen Seiten quadrieren und addieren, die längste Seite quadrieren, vergleichen.</p>
    <div class="example">Seit der Antike wird von „Seilspannern“ erzählt: Mit einer Schnur aus 12 gleichen Abschnitten, gespannt zu 3 + 4 + 5, entsteht ein rechter Winkel, denn 3² + 4² = 9 + 16 = 25 = 5².</div>
    <div class="merke"><strong>Merke:</strong> Immer die <strong>längste</strong> Seite allein auf eine Seite der Gleichung stellen. Ganze Zahlen wie 3, 4, 5 oder 5, 12, 13 mit a² + b² = c² heißen pythagoreische Zahlentripel.</div>
  `,
  formulas: [
    { name: "Umkehrung des Pythagoras", html: "p² + q² = r² ⇒ rechter Winkel gegenüber r", quantities: "r längste Seite, p und q die beiden anderen" },
    { name: "Winkelart", html: "p² + q² &gt; r²: spitz · p² + q² &lt; r²: stumpf", quantities: "für den Winkel gegenüber der längsten Seite" },
  ],
  quiz: {
    question: "Ein Dreieck hat die Seiten 6 cm, 8 cm und 11 cm. Was gilt?",
    options: [
      "Es ist rechtwinklig, weil 6 + 8 > 11 ist",
      "Es ist stumpfwinklig, weil 6² + 8² < 11² ist",
      "Es ist spitzwinklig, weil 6² + 8² < 11² ist",
    ],
    correctIndex: 1,
    explanation: "6² + 8² = 100 ist kleiner als 11² = 121. Der Winkel gegenüber der längsten Seite ist also größer als 90°.",
  },
  lab: {
    kind: "rope",
    title: "Labor: Die Knotenschnur",
    intro: "Eine geschlossene Schnur hat gleich weite Knotenabstände. Lege zwei Seiten fest, die dritte ergibt sich aus dem Rest. Wann entsteht ein rechter Winkel?",
    params: [
      {
        type: "choice",
        key: "N",
        label: "Knotenabstände der Schnur",
        options: [12, 24, 30, 36, 40].map((n) => ({ value: n, label: `${n} Abstände` })),
        value: 12,
      },
      { type: "range", key: "p", label: "Seite p", unit: "Abst.", min: 1, max: 20, step: 1, value: 4 },
      { type: "range", key: "q", label: "Seite q", unit: "Abst.", min: 1, max: 20, step: 1, value: 4 },
    ],
    readouts: [
      { key: "r", label: "dritte Seite r = N − p − q", digits: 0, compute: (v) => (v.N - v.p - v.q > 0 ? v.N - v.p - v.q : "keine") },
      {
        key: "gamma",
        label: "Winkel gegenüber der längsten Seite",
        unit: "°",
        digits: 1,
        emphasis: true,
        compute: (v) => ropeGamma({ N: v.N, p: v.p, q: v.q }) ?? "kein Dreieck",
      },
      {
        key: "kind",
        label: "Art des Dreiecks",
        compute: (v) => {
          const { sides, valid } = ropeSides(v);
          if (!valid) return "kein Dreieck";
          const [u, w, L] = sides;
          const diff = u * u + w * w - L * L;
          return diff === 0 ? "rechtwinklig" : diff > 0 ? "spitzwinklig" : "stumpfwinklig";
        },
      },
    ],
    goals: [
      {
        id: "zwoelf",
        text: "Spanne mit 12 Knotenabständen einen rechten Winkel.",
        check: (v, r) => v.N === 12 && r.kind === "rechtwinklig",
      },
      {
        id: "dreissig",
        text: "Spanne mit 30 Knotenabständen einen rechten Winkel. (3 : 4 : 5 geht hier nicht auf.)",
        check: (v, r) => v.N === 30 && r.kind === "rechtwinklig",
      },
      {
        id: "stumpf",
        text: "Spanne ein stumpfwinkliges Dreieck: Die zwei kurzen Seiten im Quadrat ergeben weniger als die längste im Quadrat.",
        check: (_v, r) => r.kind === "stumpfwinklig",
      },
    ],
  },
  exercises: [
    {
      id: "pruefen",
      make: (rng, level): ExerciseTask => {
        const right = rng.next() < 0.5;
        const [p, q, hyp] = triple(rng);
        // r must stay below p + q, or the three sides form no triangle.
        const delta = hyp + 1 < p + q ? rng.pick([0.5, 1]) : 0.5;
        // A wrong longest side stays the longest one.
        const r = right ? hyp : hyp - delta > Math.max(p, q) && rng.next() < 0.5 ? hyp - delta : hyp + delta;
        if (level === 1) {
          return {
            prompt: `Ein Dreieck hat die Seiten ${fmt(p)} cm, ${fmt(q)} cm und ${fmt(r)} cm. Ist es rechtwinklig?`,
            given: [`kurze Seiten: ${fmt(p)} cm und ${fmt(q)} cm`, `längste Seite: ${fmt(r)} cm`],
            formulaHint: "Vergleiche p² + q² mit r² (r ist die längste Seite)",
            fields: [
              numberField("p² + q² =", p * p + q * q, "cm²", 2),
              numberField("r² =", r * r, "cm²", 2),
              yesNo("rechtwinklig?", right),
            ],
            steps: [
              `p² + q² = ${fmt(p * p)} + ${fmt(q * q)} = ${fmt(p * p + q * q)}`,
              `r² = ${fmt(r)}² = ${fmt(r * r)}`,
              `${fmt(p * p + q * q)} ${right ? "=" : "≠"} ${fmt(r * r)}: <strong>${right ? "rechtwinklig" : "nicht rechtwinklig"}</strong>`,
            ],
          };
        }
        const [a, b, c] = triple(rng).map((n) => n * 10);
        const measured = right ? c : c + rng.pick([-3, -2, 2, 3]);
        return {
          prompt: `Ein Tischler prüft eine Regalecke. Er misst auf den beiden Brettern ${fmt(a)} cm und ${fmt(b)} cm ab und die Diagonale dazwischen mit ${fmt(measured)} cm. Wie lang müsste die Diagonale bei einem rechten Winkel sein, und ist die Ecke rechtwinklig?`,
          given: [`Bretter: ${fmt(a)} cm und ${fmt(b)} cm`, `gemessene Diagonale: ${fmt(measured)} cm`],
          fields: [numberField("Soll-Diagonale =", c, "cm", 1), yesNo("rechtwinklig?", right)],
          steps: [
            `Bei einem rechten Winkel wäre die Diagonale die Hypotenuse: d = ${sqrtHtml(`${fmt(a)}² + ${fmt(b)}²`)} = ${fmtUnit(c, "cm")}.`,
            `Gemessen: ${fmt(measured)} cm. <strong>${fmtUnit(c, "cm")}, ${right ? "die Ecke ist rechtwinklig" : "die Ecke ist nicht rechtwinklig"}</strong>.`,
          ],
        };
      },
    },
    {
      id: "winkelart",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const p = rng.int(4, 12);
          const q = rng.int(4, 12);
          // Longest side, but shorter than p + q, so the triangle exists.
          const L = Math.max(p, q) + rng.int(1, Math.min(p, q) - 1);
          const diff = p * p + q * q - L * L;
          const kind = diff === 0 ? 1 : diff > 0 ? 0 : 2;
          return {
            prompt: `Ein Dreieck hat die Seiten ${p} cm, ${q} cm und ${L} cm. Berechne p² + q² − r² für die längste Seite r und entscheide, welche Art von Winkel ihr gegenüberliegt.`,
            given: [`p = ${p} cm, q = ${q} cm`, `längste Seite r = ${L} cm`],
            formulaHint: "Ist p² + q² − r² positiv, null oder negativ?",
            fields: [
              numberField("p² + q² − r² =", diff, "cm²", 0),
              choiceField("Winkel gegenüber r", ["spitz", "recht", "stumpf"], kind),
            ],
            steps: [
              `p² + q² − r² = ${p * p} + ${q * q} − ${L * L} = ${fmt(diff)}`,
              `<strong>${fmt(diff)} cm²</strong>: ${diff === 0 ? "null, also ein rechter Winkel" : diff > 0 ? "positiv, also ein spitzer Winkel" : "negativ, also ein stumpfer Winkel"}.`,
            ],
          };
        }
        const p = rng.int(5, 20);
        const q = rng.int(5, 20);
        const r = Math.hypot(p, q);
        return {
          prompt: `Ein Gärtner will ein dreieckiges Beet mit einem rechten Winkel abstecken. Zwei Seiten sollen ${p} m und ${q} m lang werden. Wie lang muss er die dritte Seite spannen?`,
          given: [`Seiten am rechten Winkel: ${p} m und ${q} m`],
          fields: [numberField("dritte Seite =", r, "m", 2, { slips: [{ value: p + q, hint: "Nicht die Längen addieren, sondern die Quadrate: r² = p² + q²." }] })],
          steps: [
            `Die dritte Seite liegt dem rechten Winkel gegenüber, sie ist die Hypotenuse.`,
            `r = ${sqrtHtml(`${p}² + ${q}²`)} = ${sqrtHtml(String(p * p + q * q))} ≈ <strong>${fmtUnit(r, "m")}</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du prüfst mit drei Längen, ob ein Winkel ein rechter ist, und unterscheidest spitz, recht und stumpf.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=AoV_uEr3ldU",
    title: "Umkehrung des Satzes des Pythagoras",
    author: "Cornelsen Verlag",
  },
};

// 1.3 Höhensatz und Kathetensatz ─────────────────────────────────────────────

const hoehensatz: Lesson = {
  id: "rd-3-hoehe-kathetensatz",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Höhensatz und Kathetensatz",
  subtitle: "Ein Punkt wandert auf dem Thaleskreis",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Satzgruppe des Pythagoras (Höhensatz, Kathetensatz)`,
  whyItMatters:
    "Höhe und Hypotenusenabschnitte stecken in Dachgiebeln, Rampen und Brückenstreben. Mit Höhensatz und Kathetensatz berechnest du sie, auch wenn eine Seite gar nicht gemessen werden kann.",
  explanationHtml: `
    <p>Zeichnet man im rechtwinkligen Dreieck die <strong>Höhe h</strong> vom rechten Winkel auf die Hypotenuse, teilt sie c in zwei <strong>Hypotenusenabschnitte</strong>: p liegt an der Kathete a, q liegt an der Kathete b. Es gilt c = p + q.</p>
    <ul>
      <li><strong>Höhensatz:</strong> h² = p · q. Das Quadrat über der Höhe ist so groß wie das Rechteck aus den beiden Abschnitten.</li>
      <li><strong>Kathetensatz:</strong> a² = c · p und b² = c · q. Das Quadrat über einer Kathete ist so groß wie das Rechteck aus der Hypotenuse und dem Abschnitt, der an dieser Kathete liegt.</li>
    </ul>
    <p>Alle Punkte C, für die das Dreieck ABC bei C einen rechten Winkel hat, liegen auf dem Kreis mit dem Durchmesser AB (ohne A und B), dem <strong>Thaleskreis</strong>. Im Labor wandert C auf seiner oberen Hälfte: Der rechte Winkel bleibt, Höhe und Abschnitte ändern sich.</p>
    <div class="example">Zusammen ergeben die beiden Kathetensätze den Pythagoras: a² + b² = c · p + c · q = c · (p + q) = c².</div>
    <div class="merke"><strong>Merke:</strong> Höhensatz: h² = p · q. Kathetensatz: Kathete² = Hypotenuse · anliegender Abschnitt.</div>
  `,
  formulas: [
    { name: "Höhensatz", html: "h² = p · q", quantities: "h Höhe auf c, p und q Hypotenusenabschnitte" },
    { name: "Kathetensatz", html: "a² = c · p, b² = c · q", quantities: "p liegt an a, q liegt an b, c = p + q" },
  ],
  quiz: {
    question: "Der Punkt C wandert auf dem Thaleskreis über AB. Was bleibt dabei gleich?",
    options: ["Die Höhe h", "Der rechte Winkel bei C", "Die Länge der Kathete a"],
    correctIndex: 1,
    explanation: "Jeder Punkt auf dem Thaleskreis bildet mit A und B einen rechten Winkel. Höhe und Katheten ändern sich dabei.",
  },
  lab: {
    kind: "thales",
    title: "Labor: Der Thaleskreis",
    intro: "Ziehe C auf dem Halbkreis. Rechts siehst du ein Quadrat und ein Rechteck, die immer gleich groß sind. Wähle, welchen Satz du sehen willst.",
    params: [
      { type: "range", key: "c", label: "Hypotenuse c", unit: "cm", min: 4, max: 10, step: 0.5, value: 8, digits: 1 },
      { type: "range", key: "s", label: "Lage von C (Anteil q an c)", unit: "%", min: 2, max: 98, step: 1, value: 35 },
      {
        type: "choice",
        key: "show",
        label: "Zeige",
        options: [
          { value: 0, label: "Höhensatz h² = p · q" },
          { value: 1, label: "Kathetensatz a² = c · p" },
          { value: 2, label: "Kathetensatz b² = c · q" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "p", label: "Abschnitt p", unit: "cm", digits: 2, compute: (v) => v.c - (v.c * v.s) / 100 },
      { key: "q", label: "Abschnitt q", unit: "cm", digits: 2, compute: (v) => (v.c * v.s) / 100 },
      { key: "h", label: "Höhe h = √(p · q)", unit: "cm", digits: 2, emphasis: true, compute: (v) => Math.sqrt((v.c - (v.c * v.s) / 100) * ((v.c * v.s) / 100)) },
      { key: "a2", label: "a² = c · p", unit: "cm²", digits: 2, compute: (v) => v.c * (v.c - (v.c * v.s) / 100) },
      { key: "b2", label: "b² = c · q", unit: "cm²", digits: 2, compute: (v) => v.c * ((v.c * v.s) / 100) },
    ],
    goals: [
      { id: "gleich", text: "Mache p und q gleich lang. Wie hoch ist h dann im Vergleich zu c?", check: (v) => v.s === 50 },
      {
        id: "hoehe-vier",
        text: "Stelle bei c = 10 cm den Punkt C so ein, dass die Höhe genau 4 cm ist.",
        check: (v, r) => v.c === 10 && within(Number(r.h), 4, 1e-6),
      },
      {
        id: "dreimal",
        text: "Mache das Quadrat über a genau dreimal so groß wie das Quadrat über b.",
        check: (_v, r) => near(Number(r.a2) / Number(r.b2), 3, 1e-6),
      },
    ],
  },
  exercises: [
    {
      id: "hoehensatz",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const p = rng.stepped(1.5, 9, 0.5);
          const q = rng.stepped(1.5, 9, 0.5);
          const h = Math.sqrt(p * q);
          return {
            prompt: `Die Höhe eines rechtwinkligen Dreiecks teilt die Hypotenuse in p = ${fmt(p, 1)} cm und q = ${fmt(q, 1)} cm. Berechne die Höhe h.`,
            given: [`p = ${fmtUnit(p, "cm", 1)}`, `q = ${fmtUnit(q, "cm", 1)}`],
            formulaHint: `h = ${sqrtHtml("p · q")}`,
            fields: [
              numberField("h =", h, "cm", 2, {
                slips: [
                  { value: (p + q) / 2, hint: "Das ist der Mittelwert von p und q. Nach dem Höhensatz ist h² = p · q." },
                  { value: p * q, hint: "Das ist h². Ziehe noch die Wurzel." },
                ],
              }),
            ],
            steps: [`h² = p · q = ${fmt(p, 1)} · ${fmt(q, 1)} = ${fmt(p * q, 2)}`, `h = ${sqrtHtml(fmt(p * q, 2))} ≈ <strong>${fmtUnit(h, "cm")}</strong>`],
          };
        }
        const width = rng.pick([8, 9, 10, 12]);
        const q = rng.stepped(2, width / 2 - 0.5, 0.2);
        const p = width - q;
        const h = Math.sqrt(p * q);
        return {
          prompt: `Ein Dachgiebel hat oben am First einen rechten Winkel. Das Lot vom First auf den ${fmt(width)} m breiten Dachboden trifft ihn ${fmt(q, 1)} m von der linken Hauswand entfernt. Wie hoch liegt der First über dem Dachboden?`,
          given: [`Hausbreite ${fmtUnit(width, "m")}`, `Fußpunkt des Lots: ${fmtUnit(q, "m", 1)} von links`],
          fields: [numberField("Firsthöhe =", h, "m", 2, { slips: [{ value: p * q, hint: "Das ist h². Ziehe noch die Wurzel." }] })],
          steps: [
            `Die Hausbreite ist die Hypotenuse, das Lot ist die Höhe. Die Abschnitte sind ${fmt(q, 1)} m und ${fmt(width, 0)} m − ${fmt(q, 1)} m = ${fmt(p, 1)} m.`,
            `h² = ${fmt(q, 1)} · ${fmt(p, 1)} = ${fmt(p * q, 2)}`,
            `h = ${sqrtHtml(fmt(p * q, 2))} ≈ <strong>${fmtUnit(h, "m")}</strong>`,
          ],
        };
      },
    },
    {
      id: "kathetensatz",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const c = rng.int(6, 14);
          const p = rng.stepped(1, c - 1, 0.5);
          const a = Math.sqrt(c * p);
          return {
            prompt: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${fmt(c)} cm. Der Abschnitt an der Kathete a ist p = ${fmt(p, 1)} cm. Berechne a.`,
            given: [`c = ${fmtUnit(c, "cm")}`, `p = ${fmtUnit(p, "cm", 1)}`],
            formulaHint: `a = ${sqrtHtml("c · p")}`,
            fields: [
              numberField("a =", a, "cm", 2, {
                slips: [
                  { value: c * p, hint: "Das ist a². Ziehe noch die Wurzel." },
                  { value: Math.sqrt(c * c - p * p), hint: "Das ist Pythagoras mit p, aber p ist keine Seite des Dreiecks. Kathetensatz: a² = c · p." },
                ],
              }),
            ],
            steps: [`a² = c · p = ${fmt(c)} · ${fmt(p, 1)} = ${fmt(c * p, 2)}`, `a = ${sqrtHtml(fmt(c * p, 2))} ≈ <strong>${fmtUnit(a, "cm")}</strong>`],
          };
        }
        const [a, b] = triple(rng);
        const c = Math.hypot(a, b);
        const p = (a * a) / c;
        const h = (a * b) / c;
        return {
          prompt: `Ein rechtwinkliges Dreieck hat die Katheten a = ${fmt(a)} cm und b = ${fmt(b)} cm. Berechne die Hypotenuse c, den Abschnitt p an der Kathete a und die Höhe h.`,
          given: [`a = ${fmtUnit(a, "cm")}`, `b = ${fmtUnit(b, "cm")}`],
          fields: [numberField("c =", c, "cm", 2), numberField("p =", p, "cm", 2), numberField("h =", h, "cm", 2)],
          steps: [
            `Pythagoras: c = ${sqrtHtml(`${fmt(a)}² + ${fmt(b)}²`)} = ${fmtUnit(c, "cm")}`,
            `Kathetensatz: a² = c · p, also p = a² : c = ${fmt(a * a)} : ${fmt(c)} = ${fmtUnit(p, "cm")}`,
            `Höhensatz mit q = c − p = ${fmt(c - p)}: h = ${sqrtHtml(`${fmt(p)} · ${fmt(c - p)}`)} ≈ ${fmtUnit(h, "cm")}`,
            `<strong>c = ${fmtUnit(c, "cm")}, p = ${fmtUnit(p, "cm")}, h = ${fmtUnit(h, "cm")}</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst Höhensatz und Kathetensatz und siehst, wie sie zusammen den Pythagoras ergeben.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=ujUCsWMjH9Y",
    title: "Höhensatz und Kathetensatz des Euklid",
    author: "Daniel Jung",
  },
};

// 1.4 Sinus und Kosinus ──────────────────────────────────────────────────────

const sinusKosinus: Lesson = {
  id: "rd-4-sinus-kosinus",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Sinus und Kosinus",
  subtitle: "Seitenverhältnisse, die nur vom Winkel abhängen",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Sinus und Kosinus am rechtwinkligen Dreieck`,
  whyItMatters:
    "Mit Pythagoras brauchst du zwei Seiten. Mit Sinus und Kosinus reichen eine Seite und ein Winkel, zum Beispiel für die Höhe, die eine Leiter erreicht, oder den Winkel einer Rampe.",
  explanationHtml: `
    <p>Von einem spitzen Winkel α aus heißen die Seiten eines rechtwinkligen Dreiecks so: Die <strong>Gegenkathete</strong> liegt α gegenüber, die <strong>Ankathete</strong> liegt an α an, die <strong>Hypotenuse</strong> liegt dem rechten Winkel gegenüber.</p>
    <ul>
      <li>sin α = ${frac("Gegenkathete", "Hypotenuse")}</li>
      <li>cos α = ${frac("Ankathete", "Hypotenuse")}</li>
    </ul>
    <p>Alle rechtwinkligen Dreiecke mit demselben Winkel α sind ähnlich: Ein doppelt so großes Dreieck hat doppelt so lange Seiten, die <strong>Verhältnisse</strong> bleiben gleich. Deshalb hängt sin α nur von α ab. Weil eine Kathete immer kürzer ist als die Hypotenuse, liegen sin α und cos α für spitze Winkel zwischen 0 und 1.</p>
    <div class="example">Seite berechnen: Gegenkathete = Hypotenuse · sin α. Winkel berechnen: α = sin⁻¹(Gegenkathete : Hypotenuse). Der Taschenrechner muss dafür auf <strong>DEG</strong> stehen.</div>
    <div class="merke"><strong>Merke:</strong> Die Gegenkathete von α ist die Ankathete des anderen spitzen Winkel β. Deshalb ist sin α = cos(90° − α).</div>
  `,
  formulas: [
    { name: "Sinus", html: `sin α = ${frac("Gegenkathete", "Hypotenuse")}`, quantities: "für spitze Winkel im rechtwinkligen Dreieck" },
    { name: "Kosinus", html: `cos α = ${frac("Ankathete", "Hypotenuse")}`, quantities: "Ankathete liegt am Winkel an" },
    { name: "Ergänzungswinkel", html: "sin α = cos(90° − α)", quantities: "α und β = 90° − α sind die spitzen Winkel" },
  ],
  quiz: {
    question: "Ein rechtwinkliges Dreieck wird mit denselben Winkeln doppelt so groß gezeichnet. Was passiert mit sin α?",
    options: ["Er verdoppelt sich", "Er halbiert sich", "Er bleibt gleich"],
    correctIndex: 2,
    explanation: "Gegenkathete und Hypotenuse werden beide doppelt so lang. Ihr Verhältnis, der Sinus, bleibt gleich.",
  },
  lab: {
    kind: "ladder",
    title: "Labor: Die Leiter an der Wand",
    intro: "Ziehe das obere Ende oder den Fuß der Leiter. Die Leiter ist die Hypotenuse. Sicher steht eine Anlegeleiter zwischen 65° und 75° (grüner Bereich).",
    params: [
      { type: "range", key: "alpha", label: "Anstellwinkel α", unit: "°", min: 5, max: 85, step: 1, value: 50 },
      { type: "range", key: "L", label: "Leiterlänge", unit: "m", min: 2, max: 8, step: 0.5, value: 5, digits: 1 },
    ],
    readouts: [
      { key: "gk", label: "Höhe an der Wand (Gegenkathete)", unit: "m", digits: 2, compute: (v) => v.L * sinD(v.alpha) },
      { key: "ak", label: "Abstand des Fußes (Ankathete)", unit: "m", digits: 2, compute: (v) => v.L * cosD(v.alpha) },
      { key: "sin", label: "sin α", digits: 3, emphasis: true, compute: (v) => sinD(v.alpha) },
      { key: "cos", label: "cos α", digits: 3, compute: (v) => cosD(v.alpha) },
    ],
    goals: [
      { id: "halb", text: "Finde den Winkel, bei dem die Leiter genau halb so hoch reicht, wie sie lang ist.", check: (v) => v.alpha === 30 },
      {
        id: "sicher",
        text: "Stelle eine 6-m-Leiter sicher auf (65° bis 75°) so, dass sie mindestens 5,6 m hoch reicht.",
        check: (v, r) => v.L === 6 && v.alpha >= 65 && v.alpha <= 75 && Number(r.gk) >= 5.6,
      },
      { id: "gleich", text: "Mache die Höhe an der Wand genau so groß wie den Abstand des Fußes.", check: (v) => v.alpha === 45 },
    ],
  },
  exercises: [
    {
      id: "seite",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const alpha = rng.int(15, 75);
          const c = rng.stepped(4, 20, 0.5);
          const opposite = rng.next() < 0.5;
          const answer = opposite ? c * sinD(alpha) : c * cosD(alpha);
          const radian = opposite ? c * Math.sin(alpha) : c * Math.cos(alpha);
          const other = opposite ? c * cosD(alpha) : c * sinD(alpha);
          return {
            prompt: `In einem rechtwinkligen Dreieck ist die Hypotenuse ${fmt(c, 1)} cm lang, ein spitzer Winkel ist α = ${alpha}°. Berechne die ${opposite ? "Gegenkathete" : "Ankathete"} von α.`,
            given: [`Hypotenuse ${fmtUnit(c, "cm", 1)}`, `α = ${alpha}°`],
            formulaHint: opposite ? "Gegenkathete = Hypotenuse · sin α" : "Ankathete = Hypotenuse · cos α",
            fields: [
              numberField(opposite ? "Gegenkathete =" : "Ankathete =", answer, "cm", 2, {
                slips: [
                  { value: radian, hint: RAD_HINT },
                  { value: other, hint: opposite ? "Das ist die Ankathete. Die Gegenkathete liegt α gegenüber: sin α." : "Das ist die Gegenkathete. Die Ankathete liegt an α: cos α." },
                ],
              }),
            ],
            steps: [
              opposite ? `sin α = Gegenkathete : Hypotenuse, also Gegenkathete = Hypotenuse · sin α.` : `cos α = Ankathete : Hypotenuse, also Ankathete = Hypotenuse · cos α.`,
              `${fmt(c, 1)} cm · ${opposite ? "sin" : "cos"} ${alpha}° ≈ ${fmt(c, 1)} cm · ${fmt(opposite ? sinD(alpha) : cosD(alpha), 4)} ≈ <strong>${fmtUnit(answer, "cm")}</strong>`,
            ],
          };
        }
        const scenario = rng.int(0, 1);
        if (scenario === 0) {
          const length = rng.int(30, 80);
          const alpha = rng.int(35, 70);
          const h = length * sinD(alpha);
          return {
            prompt: `Ein Drachen steigt an einer ${length} m langen, straff gespannten Schnur. Die Schnur bildet mit dem Boden einen Winkel von ${alpha}°. Wie hoch über der Hand fliegt der Drachen?`,
            given: [`Schnur ${length} m`, `Winkel zum Boden ${alpha}°`],
            fields: [numberField("Höhe =", h, "m", 1, { slips: [{ value: length * Math.sin(alpha), hint: RAD_HINT }, { value: length * cosD(alpha), hint: "Die Höhe liegt dem Winkel gegenüber: Gegenkathete, also sin." }] })],
            steps: [`Die Schnur ist die Hypotenuse, die Höhe die Gegenkathete des Winkels.`, `h = ${length} m · sin ${alpha}° ≈ <strong>${fmtUnit(h, "m", 1)}</strong>`],
          };
        }
        const s = rng.stepped(2, 8, 0.5);
        const alpha = rng.int(8, 25);
        const x = s * cosD(alpha);
        return {
          prompt: `Eine ${fmt(s, 1)} km lange, gerade Straße steigt mit einem Winkel von ${alpha}° an. Wie weit kommt man dabei waagrecht voran, also auf der Landkarte gemessen?`,
          given: [`Straßenlänge ${fmtUnit(s, "km", 1)}`, `Steigungswinkel ${alpha}°`],
          fields: [numberField("waagrecht =", x, "km", 2, { slips: [{ value: s * Math.cos(alpha), hint: RAD_HINT }, { value: s * sinD(alpha), hint: "Das ist der Höhenunterschied. Waagrecht ist die Ankathete: cos." }] })],
          steps: [`Die Straße ist die Hypotenuse, die waagrechte Strecke die Ankathete.`, `x = ${fmt(s, 1)} km · cos ${alpha}° ≈ <strong>${fmtUnit(x, "km")}</strong>`],
        };
      },
    },
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const c = rng.int(8, 20);
          const side = rng.int(2, c - 2);
          const useSin = rng.next() < 0.5;
          const alpha = useSin ? asinD(side / c) : acosD(side / c);
          return {
            prompt: `In einem rechtwinkligen Dreieck ist die Hypotenuse ${c} cm lang und die ${useSin ? "Gegenkathete" : "Ankathete"} von α ${side} cm. Berechne α.`,
            given: [`Hypotenuse ${c} cm`, `${useSin ? "Gegenkathete" : "Ankathete"} ${side} cm`],
            formulaHint: useSin ? "α = sin⁻¹(Gegenkathete : Hypotenuse)" : "α = cos⁻¹(Ankathete : Hypotenuse)",
            fields: [
              numberField("α =", alpha, "°", 1, {
                slips: [
                  { value: (alpha * Math.PI) / 180, hint: RAD_HINT },
                  { value: 90 - alpha, hint: "Das ist der andere spitze Winkel. Prüfe, ob die Seite an α anliegt oder ihm gegenüberliegt." },
                ],
              }),
            ],
            steps: [
              `${useSin ? "sin" : "cos"} α = ${side} : ${c} ≈ ${fmt(side / c, 4)}`,
              `α = ${useSin ? "sin" : "cos"}⁻¹(${fmt(side / c, 4)}) ≈ <strong>${fmt(alpha, 1)}°</strong>`,
            ],
          };
        }
        const L = rng.pick([5, 6, 7, 8]);
        const h = Number((L * sinD(rng.int(58, 80))).toFixed(1));
        const alpha = asinD(h / L);
        const safe = alpha >= 65 && alpha <= 75;
        return {
          prompt: `Eine ${L} m lange Leiter reicht an einer Wand ${fmt(h, 1)} m hoch. Unter welchem Winkel zum Boden steht sie? Eine Anlegeleiter steht sicher zwischen 65° und 75°. Steht sie sicher?`,
          given: [`Leiter ${L} m`, `Höhe an der Wand ${fmtUnit(h, "m", 1)}`],
          fields: [numberField("α =", alpha, "°", 1, { slips: [{ value: (alpha * Math.PI) / 180, hint: RAD_HINT }] }), yesNo("sicher?", safe)],
          steps: [
            `Die Leiter ist die Hypotenuse, die Höhe die Gegenkathete: sin α = ${fmt(h, 1)} : ${L} ≈ ${fmt(h / L, 4)}.`,
            `α = sin⁻¹(${fmt(h / L, 4)}) ≈ ${fmt(alpha, 1)}°`,
            `<strong>${fmt(alpha, 1)}°, ${safe ? "sie steht sicher" : alpha < 65 ? "zu flach, sie kann wegrutschen" : "zu steil, sie kann nach hinten kippen"}</strong>.`,
          ],
        };
      },
    },
    {
      id: "hypotenuse",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const alpha = rng.int(20, 70);
          const a = rng.stepped(3, 12, 0.5);
          const c = a / sinD(alpha);
          return {
            prompt: `In einem rechtwinkligen Dreieck liegt die Kathete a = ${fmt(a, 1)} cm dem Winkel α = ${alpha}° gegenüber. Berechne die Hypotenuse c.`,
            given: [`a = ${fmtUnit(a, "cm", 1)} (Gegenkathete)`, `α = ${alpha}°`],
            formulaHint: "sin α = a : c, also c = a : sin α",
            fields: [
              numberField("c =", c, "cm", 2, {
                slips: [
                  { value: a * sinD(alpha), hint: "Hier wird geteilt: Aus sin α = a : c folgt c = a : sin α." },
                  { value: a / Math.sin(alpha), hint: RAD_HINT },
                ],
              }),
            ],
            steps: [`sin α = a : c, nach c umgestellt: c = a : sin α.`, `c = ${fmt(a, 1)} cm : sin ${alpha}° ≈ ${fmt(a, 1)} : ${fmt(sinD(alpha), 4)} ≈ <strong>${fmtUnit(c, "cm")}</strong>`],
          };
        }
        const height = rng.stepped(0.3, 1.2, 0.1);
        const alpha = rng.pick([3, 3.5, 4, 5, 6]);
        const length = height / sinD(alpha);
        return {
          prompt: `Eine Rampe soll einen Höhenunterschied von ${fmt(height * 100, 0)} cm überwinden und dabei nur ${fmt(alpha, 1)}° steil sein. Wie lang wird die schräge Rampe?`,
          given: [`Höhe ${fmt(height * 100, 0)} cm`, `Neigung ${fmt(alpha, 1)}°`],
          fields: [numberField("Länge =", length, "m", 2, { slips: [{ value: length * 100, hint: "Gib die Länge in Metern an." }, { value: height / Math.sin(alpha), hint: RAD_HINT }] })],
          steps: [
            `Die Höhe ist die Gegenkathete des Neigungswinkels, die Rampe die Hypotenuse.`,
            `L = ${fmt(height, 2)} m : sin ${fmt(alpha, 1)}° ≈ <strong>${fmtUnit(length, "m")}</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du benennst Gegenkathete und Ankathete und berechnest mit sin und cos Seiten und Winkel.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=TljGSjLKvqA",
    title: "Sinus, Kosinus im rechtwinkligen Dreieck",
    author: "Daniel Jung",
  },
};

// 1.5 Tangens ────────────────────────────────────────────────────────────────

const tangens: Lesson = {
  id: "rd-5-tangens",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Tangens und Steigung",
  subtitle: "Was das Schild „12 %“ bedeutet",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Tangens am rechtwinkligen Dreieck`,
  whyItMatters:
    "Straßenschilder, Dachneigungen und Rollstuhlrampen geben Steigungen an. Der Tangens verbindet die Steigung in Prozent mit dem Winkel, den man mit dem Geodreieck messen würde.",
  explanationHtml: `
    <p>Der <strong>Tangens</strong> vergleicht die beiden Katheten: tan α = ${frac("Gegenkathete", "Ankathete")}. Teilt man Gegenkathete und Ankathete jeweils durch die Hypotenuse, sieht man: <strong>tan α = ${frac("sin α", "cos α")}</strong>.</p>
    <p>Eine Gerade, die unter dem Winkel α zur x-Achse ansteigt, hat die <strong>Steigung m = tan α</strong>: Auf 1 nach rechts geht es tan α nach oben. Straßenschilder geben das in Prozent an: <strong>12 % heißt 12 m Höhe auf 100 m waagrechter Strecke</strong>, also tan α = 0,12 und α ≈ 6,8°.</p>
    <ul>
      <li>100 % Steigung sind 45°, nicht 90°: Höhe und waagrechte Strecke sind gleich lang.</li>
      <li>Für Winkel nahe 90° wird der Tangens beliebig groß, eine senkrechte Wand hat keine Steigung in Prozent.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> tan α = Gegenkathete : Ankathete = Steigung. Prozent : 100 = tan α.</div>
  `,
  formulas: [
    { name: "Tangens", html: `tan α = ${frac("Gegenkathete", "Ankathete")} = ${frac("sin α", "cos α")}`, quantities: "für spitze Winkel" },
    { name: "Steigung", html: "m = tan α; Steigung in % = tan α · 100", quantities: "α Winkel gegen die Waagrechte" },
  ],
  quiz: {
    question: "Eine Straße hat 100 % Steigung. Wie groß ist ihr Steigungswinkel?",
    options: ["90°", "45°", "100°"],
    correctIndex: 1,
    explanation: "100 % heißt tan α = 1: Auf 100 m waagrecht geht es 100 m hoch. Das ist der Winkel 45°.",
  },
  lab: {
    kind: "slope",
    title: "Labor: Steigung in Prozent",
    intro: "Ziehe das obere Ende der Straße oder stelle Höhe und waagrechte Strecke ein. Das Schild zeigt die Steigung, der Winkel steht unten.",
    params: [
      { type: "choice", key: "run", label: "Waagrechte Strecke", options: [100, 400, 1000].map((n) => ({ value: n, label: `${n} m` })), value: 100 },
      { type: "range", key: "h", label: "Höhenunterschied", unit: "m", min: 0, max: 500, step: 1, value: 8 },
    ],
    readouts: [
      { key: "percent", label: "Steigung", unit: "%", digits: 1, emphasis: true, compute: (v) => (v.h / v.run) * 100 },
      { key: "tan", label: "tan α", digits: 4, compute: (v) => v.h / v.run },
      { key: "alpha", label: "Steigungswinkel α", unit: "°", digits: 2, compute: (v) => atanD(v.h / v.run) },
    ],
    goals: [
      { id: "hundert", text: "Baue eine Straße mit 100 % Steigung. Welcher Winkel ist das?", check: (v) => v.h === v.run },
      { id: "zwoelf", text: "Stelle auf 400 m waagrechter Strecke das Schild „12 %“ ein.", check: (v) => v.run === 400 && v.h === 48 },
      { id: "zehn-grad", text: "Finde die Steigung in Prozent, die zu 10° gehört (auf ±0,05° genau).", check: (_v, r) => within(Number(r.alpha), 10, 0.05) },
    ],
  },
  exercises: [
    {
      id: "prozent-winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          if (rng.next() < 0.5) {
            const p = rng.int(3, 40);
            const alpha = atanD(p / 100);
            return {
              prompt: `Ein Schild zeigt eine Steigung von ${p} %. Berechne den Steigungswinkel α.`,
              given: [`Steigung ${p} %`],
              formulaHint: "tan α = Prozent : 100, also α = tan⁻¹(Prozent : 100)",
              fields: [numberField("α =", alpha, "°", 1, { slips: [{ value: (alpha * Math.PI) / 180, hint: RAD_HINT }, { value: (p / 100) * 90, hint: "Prozent sind keine Anteile von 90°. Rechne α = tan⁻¹(p : 100)." }] })],
              steps: [`tan α = ${p} : 100 = ${fmt(p / 100, 2)}`, `α = tan⁻¹(${fmt(p / 100, 2)}) ≈ <strong>${fmt(alpha, 1)}°</strong>`],
            };
          }
          const alpha = rng.int(2, 40);
          const p = tanD(alpha) * 100;
          return {
            prompt: `Eine Rampe ist um ${alpha}° gegen die Waagrechte geneigt. Wie viel Prozent Steigung hat sie?`,
            given: [`α = ${alpha}°`],
            formulaHint: "Steigung in % = tan α · 100",
            fields: [numberField("Steigung =", p, "%", 1, { slips: [{ value: Math.tan(alpha) * 100, hint: RAD_HINT }, { value: tanD(alpha), hint: "Das ist tan α. Mal 100 ergibt die Prozent." }] })],
            steps: [`tan ${alpha}° ≈ ${fmt(tanD(alpha), 4)}`, `Steigung ≈ ${fmt(tanD(alpha), 4)} · 100 ≈ <strong>${fmt(p, 1)} %</strong>`],
          };
        }
        const p = rng.int(4, 18);
        const km = rng.stepped(0.5, 4, 0.5);
        const rise = (p / 100) * km * 1000;
        return {
          prompt: `Ein Straßenschild warnt vor ${p} % Steigung. Wie viele Höhenmeter überwindet die Straße auf ${fmt(km, 1)} km waagrechter Strecke (auf der Landkarte gemessen)?`,
          given: [`Steigung ${p} %`, `waagrecht ${fmtUnit(km, "km", 1)}`],
          fields: [numberField("Höhenunterschied =", rise, "m", 0, { slips: [{ value: rise / 1000, hint: "Gib das Ergebnis in Metern an." }] })],
          steps: [`${p} % heißt ${p} m Höhe auf 100 m waagrecht.`, `${fmt(km, 1)} km = ${fmt(km * 1000, 0)} m, also ${fmt(km * 1000, 0)} m · ${fmt(p / 100, 2)} = <strong>${fmtUnit(rise, "m", 0)}</strong>`],
        };
      },
    },
    {
      id: "schatten",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const alpha = rng.int(15, 70);
          const b = rng.stepped(3, 15, 0.5);
          const a = b * tanD(alpha);
          return {
            prompt: `In einem rechtwinkligen Dreieck ist die Ankathete von α = ${alpha}° genau ${fmt(b, 1)} cm lang. Berechne die Gegenkathete.`,
            given: [`Ankathete ${fmtUnit(b, "cm", 1)}`, `α = ${alpha}°`],
            formulaHint: "Gegenkathete = Ankathete · tan α",
            fields: [numberField("Gegenkathete =", a, "cm", 2, { slips: [{ value: b * Math.tan(alpha), hint: RAD_HINT }, { value: b / tanD(alpha), hint: "Hier wird multipliziert: tan α = GK : AK, also GK = AK · tan α." }] })],
            steps: [`tan α = Gegenkathete : Ankathete`, `GK = ${fmt(b, 1)} cm · tan ${alpha}° ≈ ${fmt(b, 1)} · ${fmt(tanD(alpha), 4)} ≈ <strong>${fmtUnit(a, "cm")}</strong>`],
          };
        }
        const shadow = rng.stepped(6, 30, 0.5);
        const sun = rng.int(25, 60);
        const tree = shadow * tanD(sun);
        return {
          prompt: `Die Sonne steht ${sun}° über dem Horizont. Ein Baum wirft auf ebenem Boden einen ${fmt(shadow, 1)} m langen Schatten. Wie hoch ist der Baum?`,
          given: [`Sonnenhöhe ${sun}°`, `Schattenlänge ${fmtUnit(shadow, "m", 1)}`],
          fields: [numberField("Höhe =", tree, "m", 1, { slips: [{ value: shadow * Math.tan(sun), hint: RAD_HINT }, { value: shadow * sinD(sun), hint: "Der Schatten ist eine Kathete, nicht die Hypotenuse: Hier passt der Tangens." }] })],
          steps: [`Baum und Schatten sind die Katheten; der Sonnenwinkel liegt am Schattenende.`, `h = ${fmt(shadow, 1)} m · tan ${sun}° ≈ <strong>${fmtUnit(tree, "m", 1)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest Steigungen zwischen Prozent und Winkel um und nutzt tan α = GK : AK.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=TljGSjLKvqA",
    title: "Tangens im rechtwinkligen Dreieck berechnen",
    author: "Daniel Jung",
  },
};

// 1.6 Besondere Winkel ───────────────────────────────────────────────────────

const EXACT: Array<{ text: string; value: number; steps: string }> = [
  { text: "sin 30° + cos 60°", value: 1, steps: "½ + ½ = 1" },
  { text: "tan 45° − sin 30°", value: 0.5, steps: "1 − ½ = ½" },
  { text: "sin 60° · cos 30°", value: 0.75, steps: "½√3 · ½√3 = ¼ · 3 = ¾" },
  { text: "sin 45° · cos 45°", value: 0.5, steps: "½√2 · ½√2 = ¼ · 2 = ½" },
  { text: "cos² 30° + sin 30°", value: 1.25, steps: "¾ + ½ = 1¼" },
  { text: "2 · sin 30° · cos 60°", value: 0.5, steps: "2 · ½ · ½ = ½" },
  { text: "tan 60° · tan 30°", value: 1, steps: "√3 · ⅓√3 = ⅓ · 3 = 1" },
  { text: "sin² 60° − cos² 60°", value: 0.5, steps: "¾ − ¼ = ½" },
];

const besondereWinkel: Lesson = {
  id: "rd-6-besondere-winkel",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "1.6 Trigonometrischer Pythagoras und besondere Winkel",
  subtitle: "Warum sin² α + cos² α immer 1 ist",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Zusammenhänge zwischen sin, cos und tan`,
  whyItMatters:
    "Für 30°, 45° und 60° kennst du Sinus und Kosinus exakt, ganz ohne Taschenrechner. Und aus einem der beiden Werte folgt immer der andere.",
  explanationHtml: `
    <p>Hat die Hypotenuse die Länge 1, sind die Katheten genau <strong>sin α</strong> (gegenüber) und <strong>cos α</strong> (anliegend). Pythagoras liefert dann für jeden Winkel:</p>
    <p class="formula-line"><strong>sin² α + cos² α = 1</strong></p>
    <p>Kennt man sin α eines spitzen Winkels, folgt cos α = ${sqrtHtml("1 − sin² α")}.</p>
    <table class="mini">
      <tr><th>α</th><th>30°</th><th>45°</th><th>60°</th></tr>
      <tr><td>sin α</td><td>½</td><td>½√2</td><td>½√3</td></tr>
      <tr><td>cos α</td><td>½√3</td><td>½√2</td><td>½</td></tr>
      <tr><td>tan α</td><td>⅓√3</td><td>1</td><td>√3</td></tr>
    </table>
    <ul>
      <li><strong>45°:</strong> Halbiert man ein Quadrat mit der Seite 1 längs der Diagonale, sind beide Katheten gleich lang, sin 45° = cos 45° = ½√2.</li>
      <li><strong>30° und 60°:</strong> Halbiert man ein gleichseitiges Dreieck mit Seite 1, ist die kurze Kathete ½ und die Höhe ½√3.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> sin 0°, 30°, 45°, 60°, 90° = ½√0, ½√1, ½√2, ½√3, ½√4. Der Kosinus läuft rückwärts.</div>
  `,
  formulas: [
    { name: "Trigonometrischer Pythagoras", html: "sin² α + cos² α = 1", quantities: "für jeden Winkel α" },
    { name: "Besondere Werte", html: "sin 30° = cos 60° = ½; sin 45° = cos 45° = ½√2; tan 45° = 1", quantities: "aus dem halben Quadrat und dem halben gleichseitigen Dreieck" },
  ],
  quiz: {
    question: "Welchen Wert hat sin² 37° + cos² 37°?",
    options: ["0,5", "1", "Das hängt vom Winkel ab"],
    correctIndex: 1,
    explanation: "sin² α + cos² α ist für jeden Winkel genau 1: Das ist der Satz des Pythagoras im Dreieck mit Hypotenuse 1.",
  },
  lab: {
    kind: "unit-quarter",
    title: "Labor: Der Viertelkreis mit Radius 1",
    intro: "Ziehe P auf dem Viertelkreis. Die Katheten sind sin α und cos α. Rechts füllen ihre Quadrate zusammen immer genau das Einheitsquadrat.",
    params: [
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 0, max: 90, step: 1, value: 20 },
      {
        type: "choice",
        key: "helper",
        label: "Hilfsdreieck",
        options: [
          { value: 0, label: "keines" },
          { value: 1, label: "halbes Quadrat (45°)" },
          { value: 2, label: "halbes gleichseitiges Dreieck (30°, 60°)" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "sin", label: "sin α", digits: 4, emphasis: true, compute: (v) => sinD(v.alpha) },
      { key: "cos", label: "cos α", digits: 4, compute: (v) => cosD(v.alpha) },
      { key: "tan", label: "tan α", digits: 4, compute: (v) => (v.alpha >= 90 ? "nicht definiert" : tanD(v.alpha)) },
      { key: "sum", label: "sin² α + cos² α", digits: 4, compute: (v) => sinD(v.alpha) ** 2 + cosD(v.alpha) ** 2 },
    ],
    goals: [
      { id: "dreissig", text: "Finde den Winkel, für den sin α genau ½ ist.", check: (v) => v.alpha === 30 },
      { id: "gleich", text: "Mache sin α und cos α gleich groß.", check: (v) => v.alpha === 45 },
      {
        id: "drei-vier-fuenf",
        text: "Finde den Winkel des 3-4-5-Dreiecks: sin α ≈ 0,8 und cos α ≈ 0,6 (je ±0,005).",
        check: (_v, r) => within(Number(r.sin), 0.8, 0.005) && within(Number(r.cos), 0.6, 0.005),
      },
    ],
  },
  exercises: [
    {
      id: "exakt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const item = rng.pick(EXACT);
          return {
            prompt: `Berechne ohne Taschenrechner mit den besonderen Werten: ${item.text}`,
            given: ["sin 30° = ½, sin 45° = ½√2, sin 60° = ½√3", "cos 30° = ½√3, cos 45° = ½√2, cos 60° = ½", "tan 30° = ⅓√3, tan 45° = 1, tan 60° = √3"],
            formulaHint: "Setze die exakten Werte aus der Tabelle ein",
            fields: [numberField(`${item.text} =`, item.value, "", 2)],
            steps: [`Einsetzen: ${item.steps.split("=")[0].trim()}`, `<strong>${item.steps}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const s = rng.int(4, 16);
          const h = (s * Math.sqrt(3)) / 2;
          return {
            prompt: `Ein gleichseitiges Dreieck hat die Seitenlänge ${s} cm. Berechne seine Höhe mit sin 60° = ½√3.`,
            given: [`Seite ${s} cm`, "alle Winkel 60°"],
            fields: [numberField("h =", h, "cm", 2, { slips: [{ value: s * Math.sin(60), hint: RAD_HINT }, { value: s / 2, hint: "Das ist die halbe Grundseite. Die Höhe liegt dem 60°-Winkel gegenüber." }] })],
            steps: [`Die Höhe teilt das Dreieck in zwei rechtwinklige Dreiecke mit Hypotenuse ${s} cm und Winkel 60°.`, `h = ${s} cm · sin 60° = ${s} · ½√3 ≈ <strong>${fmtUnit(h, "cm")}</strong>`],
          };
        }
        const d = rng.int(4, 20);
        const side = d * Math.SQRT1_2;
        return {
          prompt: `Ein Quadrat hat eine ${d} cm lange Diagonale. Berechne seine Seitenlänge mit cos 45° = ½√2.`,
          given: [`Diagonale ${d} cm`, "Diagonale und Seite bilden 45°"],
          fields: [numberField("Seite =", side, "cm", 2, { slips: [{ value: d / 2, hint: "Die Seite ist nicht die halbe Diagonale: s = d · cos 45°." }] })],
          steps: [`Die Diagonale ist die Hypotenuse, die Seite die Ankathete des 45°-Winkels.`, `s = ${d} cm · cos 45° = ${d} · ½√2 ≈ <strong>${fmtUnit(side, "cm")}</strong>`],
        };
      },
    },
    {
      id: "trig-pythagoras",
      make: (rng, level): ExerciseTask => {
        const [opp, adj, hyp] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [7, 24, 25],
          [20, 21, 29],
        ] as const);
        if (level === 1) {
          return {
            prompt: `Für einen spitzen Winkel α ist sin α = ${opp}/${hyp}. Berechne cos α mit dem trigonometrischen Pythagoras.`,
            given: [`sin α = ${opp}/${hyp}`],
            formulaHint: `cos α = ${sqrtHtml("1 − sin² α")}`,
            fields: [
              numberField("cos α =", adj / hyp, "", 3, {
                slips: [
                  { value: 1 - opp / hyp, hint: "Nicht 1 − sin α, sondern 1 − sin² α, und davon die Wurzel." },
                  { value: 1 - (opp / hyp) ** 2, hint: "Das ist cos² α. Ziehe noch die Wurzel." },
                ],
              }),
            ],
            steps: [`cos² α = 1 − sin² α = 1 − ${opp * opp}/${hyp * hyp} = ${adj * adj}/${hyp * hyp}`, `cos α = ${sqrtHtml(`${adj * adj}/${hyp * hyp}`)} = <strong>${adj}/${hyp} ≈ ${fmt(adj / hyp, 3)}</strong>`],
          };
        }
        return {
          prompt: `Für einen spitzen Winkel α ist cos α = ${adj}/${hyp}. Berechne sin α und tan α, ohne α selbst zu bestimmen.`,
          given: [`cos α = ${adj}/${hyp}`],
          fields: [numberField("sin α =", opp / hyp, "", 3), numberField("tan α =", opp / adj, "", 3)],
          steps: [
            `sin² α = 1 − cos² α = 1 − ${adj * adj}/${hyp * hyp} = ${opp * opp}/${hyp * hyp}, also sin α = ${opp}/${hyp}.`,
            `tan α = sin α : cos α = ${opp}/${hyp} : ${adj}/${hyp} = ${opp}/${adj}`,
            `<strong>sin α = ${opp}/${hyp} ≈ ${fmt(opp / hyp, 3)}, tan α = ${opp}/${adj} ≈ ${fmt(opp / adj, 3)}</strong>`,
          ],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst sin² α + cos² α = 1 und die exakten Werte für 30°, 45° und 60°.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=U0fRSsrWRII",
    title: "sin² α + cos² α = 1 am Einheitskreis mit Pythagoras",
    author: "Daniel Jung",
  },
};

export const STAGE_DREIECKE: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Rechtwinklige Dreiecke",
  subtitle: "Pythagoras, Höhen- und Kathetensatz, Sinus, Kosinus, Tangens",
  icon: "📐",
  accent: "#2563eb",
  badgeTitle: "Rechte-Winkel-Profi",
  lehrplanLabel: "LB 3 (I und II/III)",
  lessons: [pythagoras, umkehrung, hoehensatz, sinusKosinus, tangens, besondereWinkel],
};
