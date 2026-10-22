import { fmt, fmtUnit, frac, linear, quadratic, sqrtHtml } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  carrierPoint,
  cosineLabTriangle,
  familyAt,
  sineLabTriangles,
  swsTriangle,
  TRIG_EQUATIONS,
  trigSolutions,
} from "../lab/views-dreiecke";
import type { ExerciseTask, LabValues, Lesson, Stage } from "../model/types";
import { acosD, asinD, atanD, choiceField, cosD, numberField, RAD_HINT, sinD, tanD, within, yesNo } from "./helpers";

const STAGE_ID = "stage-2-dreiecke";
const LEHRPLAN = "M10 LB 1 (I) · M10 LB 1 (II/III): Trigonometrie";
const LEHRPLAN_I = "M10 LB 1 (I): Trigonometrie";

type Slip = { value: number; hint: string };

const deg = (value: number, digits = 2): string => `${fmt(value, digits)}°`;
const cm = (value: number, digits = 2): string => fmtUnit(value, "cm", digits);

/** "41 − 13,68", or "41 + 20,52" when the subtracted term is negative. */
function minusTerm(first: number, term: number, digits = 2): string {
  return term >= 0 ? `${fmt(first, digits)} − ${fmt(term, digits)}` : `${fmt(first, digits)} + ${fmt(-term, digits)}`;
}

/** Draws until `ok` holds, at most 100 times; then the known-good fallback. */
function draw<T>(make: () => T, ok: (value: T) => boolean, fallback: T): T {
  for (let i = 0; i < 100; i++) {
    const value = make();
    if (ok(value)) return value;
  }
  return fallback;
}

/** The typical slips with the cosine law: the sign, the root, plain Pythagoras, RAD. */
function cosineSlips(a: number, b: number, gamma: number): Slip[] {
  return [
    { value: Math.sqrt(a * a + b * b + 2 * a * b * cosD(gamma)), hint: "Achte auf das Vorzeichen: Im Kosinussatz wird 2ab · cos γ abgezogen." },
    { value: a * a + b * b - 2 * a * b * cosD(gamma), hint: "Das ist das Quadrat der Seite. Ziehe noch die Wurzel." },
    { value: Math.hypot(a, b), hint: "Das ist der Pythagoras. Er gilt nur für einen rechten Winkel; sonst gehört der Term −2ab · cos γ dazu." },
    { value: Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma)), hint: RAD_HINT },
  ];
}

// 2.1 Sinussatz ──────────────────────────────────────────────────────────────

/** The worked example of 2.1: a = 5 cm, b = 7 cm and α = 35° give two triangles. */
const SSA_EXAMPLE = (() => {
  const s = (7 * sinD(35)) / 5;
  const beta1 = asinD(s);
  return { s, beta1, beta2: 180 - beta1, gamma1: 145 - beta1, gamma2: beta1 - 35 };
})();

function sineLabAngles(v: LabValues): string {
  const triangles = sineLabTriangles(v);
  if (triangles.length === 0) return "kein Dreieck";
  if (triangles.length === 1) return `β ≈ ${deg(triangles[0].beta)}, γ ≈ ${deg(triangles[0].gamma)}`;
  return triangles.map((t, i) => `β${i ? "₂" : "₁"} ≈ ${deg(t.beta)}, γ${i ? "₂" : "₁"} ≈ ${deg(t.gamma)}`).join(" oder ");
}

const sinussatz: Lesson = {
  id: "dr-1-sinussatz",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Der Sinussatz",
  subtitle: "Seite und Gegenwinkel als Paar, und warum SsW zwei Dreiecke liefern kann",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Sinussatz`,
  whyItMatters:
    "Vermesser bestimmen so Entfernungen zu Punkten, die sie nicht erreichen: Eine gemessene Standlinie und zwei Winkel genügen, auch ganz ohne rechten Winkel.",
  explanationHtml: `
    <p>In jedem Dreieck ABC liegt die Seite a dem Winkel α gegenüber, b dem Winkel β und c dem Winkel γ. Die Höhe h<sub>c</sub> von C auf die Gerade AB zerlegt das Dreieck in zwei rechtwinklige Dreiecke; in beiden ist h<sub>c</sub> eine Gegenkathete:</p>
    <p class="formula-line">h<sub>c</sub> = b · sin α und h<sub>c</sub> = a · sin β, also a · sin β = b · sin α</p>
    <p>Teilt man durch sin α · sin β, entsteht der <strong>Sinussatz</strong>. Mit der Höhe auf eine andere Seite kommt c dazu:</p>
    <p class="formula-line"><strong>${frac("a", "sin α")} = ${frac("b", "sin β")} = ${frac("c", "sin γ")}</strong></p>
    <p>Er gilt auch, wenn ein Winkel stumpf ist: Dann liegt der Fußpunkt der Höhe außerhalb von [AB], und es hilft sin(180° − β) = sin β.</p>
    <ul>
      <li>Du brauchst ein <strong>Paar aus Seite und Gegenwinkel</strong> und dazu eine weitere Seite oder einen weiteren Winkel.</li>
      <li><strong>Zwei Winkel und eine Seite</strong> (WSW oder SWW): Den dritten Winkel liefert die Winkelsumme 180°, die Seiten liefert der Sinussatz, zum Beispiel b = ${frac("a · sin β", "sin α")}.</li>
      <li><strong>Zwei Seiten und ein Gegenwinkel</strong>: Aus sin β = ${frac("b · sin α", "a")} liefert der Taschenrechner nur den spitzen Winkel β₁. Wegen sin(180° − β₁) = sin β₁ ist auch β₂ = 180° − β₁ ein Kandidat. Er passt nur, wenn α + β₂ &lt; 180° bleibt.</li>
      <li>Liegt der gegebene Winkel der <strong>längeren</strong> der beiden Seiten gegenüber (SsW), gibt es genau ein Dreieck. Liegt er der <strong>kürzeren</strong> gegenüber, kann es zwei, eines oder keines geben.</li>
    </ul>
    <div class="example">Beispiel: a = 5 cm, b = 7 cm, α = 35°. sin β = 7 · sin 35° : 5 ≈ ${fmt(SSA_EXAMPLE.s, 4)}, also β₁ ≈ ${deg(SSA_EXAMPLE.beta1)} und β₂ ≈ ${deg(SSA_EXAMPLE.beta2)}. Probe: 35° + ${deg(SSA_EXAMPLE.beta2)} &lt; 180°. Es gibt also zwei Dreiecke, eines mit γ₁ ≈ ${deg(SSA_EXAMPLE.gamma1)} und eines mit γ₂ ≈ ${deg(SSA_EXAMPLE.gamma2)}.</div>
    <div class="merke"><strong>Merke:</strong> Den Sinussatz nimmst du, wenn ein Paar aus Seite und Gegenwinkel bekannt ist. Berechnest du damit einen Winkel, prüfe immer auch 180° − β: Der Taschenrechner zeigt nur den spitzen Winkel.</div>
  `,
  formulas: [
    { name: "Sinussatz", html: `${frac("a", "sin α")} = ${frac("b", "sin β")} = ${frac("c", "sin γ")}`, quantities: "jede Seite durch den Sinus ihres Gegenwinkels" },
    { name: "Seite aus dem Sinussatz", html: `b = ${frac("a · sin β", "sin α")}`, quantities: "aus dem Paar a, α und dem Winkel β" },
    { name: "Winkel aus dem Sinussatz", html: `sin β = ${frac("b · sin α", "a")}; β₁ = sin⁻¹(…), β₂ = 180° − β₁`, quantities: "β₂ nur, wenn α + β₂ < 180° bleibt" },
  ],
  quiz: {
    question: "Im Dreieck ABC sind a = 4 cm, b = 6 cm und α = 30° gegeben. Wie viele Dreiecke passen zu diesen Angaben?",
    options: ["Keines, denn a ist kürzer als b", "Genau eines", "Zwei"],
    correctIndex: 2,
    explanation:
      "sin β = 6 · sin 30° : 4 = 0,75 liefert β₁ ≈ 48,59° und β₂ ≈ 131,41°. Beide passen, denn 30° + 131,41° < 180°: Der Winkel α liegt der kürzeren Seite gegenüber.",
  },
  lab: {
    kind: "sine-law",
    title: "Labor: Seite durch Sinus des Gegenwinkels",
    intro:
      "Ziehe die Ecken B und C: Die drei Quotienten bleiben gleich. Im zweiten Versuch sind b, α und a gegeben; der Kreis um C mit dem Radius a trifft den Schenkel von α keinmal, einmal oder zweimal.",
    params: [
      {
        type: "choice",
        key: "view",
        label: "Versuch",
        options: [
          { value: 0, label: "Dreieck ziehen: drei Quotienten" },
          { value: 1, label: "Zwei Seiten und ein Gegenwinkel (SsW)" },
        ],
        value: 0,
      },
      { type: "range", key: "alpha", label: "Winkel α", unit: "°", min: 15, max: 135, step: 1, value: 50 },
      { type: "range", key: "b", label: "Seite b = AC", unit: "cm", min: 2, max: 8, step: 0.5, value: 6, digits: 1 },
      { type: "range", key: "c", label: "Seite c = AB", unit: "cm", min: 2, max: 9, step: 0.5, value: 7, digits: 1, showIf: (v) => v.view === 0 },
      { type: "range", key: "a", label: "Seite a = BC (Zirkel um C)", unit: "cm", min: 1, max: 9, step: 0.1, value: 5.5, digits: 1, showIf: (v) => v.view === 1 },
    ],
    readouts: [
      {
        key: "ra",
        label: "a : sin α",
        unit: "cm",
        digits: 2,
        emphasis: true,
        compute: (v) => (v.view === 1 ? v.a : swsTriangle(v.b, v.c, v.alpha).a) / sinD(v.alpha),
      },
      {
        key: "rb",
        label: "b : sin β",
        unit: "cm",
        digits: 2,
        compute: (v) => {
          const [t] = sineLabTriangles(v);
          return t ? t.b / sinD(t.beta) : "kein Dreieck";
        },
      },
      {
        key: "rc",
        label: "c : sin γ",
        unit: "cm",
        digits: 2,
        compute: (v) => {
          const [t] = sineLabTriangles(v);
          return t ? t.c / sinD(t.gamma) : "kein Dreieck";
        },
      },
      { key: "angles", label: "Winkel β und γ", compute: sineLabAngles },
      { key: "count", label: "Passende Dreiecke", digits: 0, compute: (v) => sineLabTriangles(v).length },
    ],
    goals: [
      {
        id: "doppelt",
        text: "Dreieck ziehen: Mache α doppelt so groß wie β (auf 0,5° genau). Ist a dann auch doppelt so lang wie b?",
        check: (v) => v.view === 0 && within(v.alpha, 2 * swsTriangle(v.b, v.c, v.alpha).beta, 0.5),
      },
      {
        id: "zwei",
        text: "SsW: Stelle b, α und a so ein, dass es zwei verschiedene Dreiecke gibt.",
        check: (v) => v.view === 1 && sineLabTriangles(v).length === 2,
      },
      {
        id: "beruehrt",
        text: "SsW: Mache a kürzer als b, und trotzdem soll es genau ein Dreieck geben. (Tipp: Der Kreis berührt den Schenkel nur.)",
        check: (v) => v.view === 1 && v.a < v.b && sineLabTriangles(v).length === 1,
      },
    ],
  },
  exercises: [
    {
      id: "seite",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const c = rng.stepped(4, 12, 0.5);
          // No angle equal to γ: then the asked side would just be c again.
          const { alpha, beta } = draw(
            () => {
              const alpha = rng.int(25, 80);
              return { alpha, beta: rng.int(25, Math.min(80, 150 - alpha)) };
            },
            (t) => t.alpha !== 180 - t.alpha - t.beta && t.beta !== 180 - t.alpha - t.beta,
            { alpha: 50, beta: 60 },
          );
          const gamma = 180 - alpha - beta;
          const askA = rng.next() < 0.5;
          const angle = askA ? alpha : beta;
          const other = askA ? beta : alpha;
          const name = askA ? "a" : "b";
          const greek = askA ? "α" : "β";
          const side = (c * sinD(angle)) / sinD(gamma);
          return {
            prompt: `Im Dreieck ABC sind c = ${fmt(c, 1)} cm, α = ${alpha}° und β = ${beta}°. Berechne den Winkel γ und die Seite ${name}.`,
            given: [`c = ${cm(c, 1)}`, `α = ${alpha}°`, `β = ${beta}°`],
            formulaHint: `γ = 180° − α − β; ${name} = ${frac(`c · sin ${greek}`, "sin γ")}`,
            fields: [
              numberField("γ =", gamma, "°", 2),
              numberField(`${name} =`, side, "cm", 2, {
                slips: [
                  { value: (c * Math.sin(angle)) / Math.sin(gamma), hint: RAD_HINT },
                  { value: (c * sinD(gamma)) / sinD(angle), hint: `Der Bruch steht auf dem Kopf: Die gesuchte Seite gehört zu ihrem Gegenwinkel, also ${name} = c · sin ${greek} : sin γ.` },
                  { value: (c * sinD(angle)) / sinD(other), hint: "c liegt γ gegenüber: Teile durch sin γ, nicht durch den Sinus des anderen gegebenen Winkels." },
                  { value: (c * angle) / gamma, hint: "Die Seiten verhalten sich wie die Sinuswerte der Gegenwinkel, nicht wie die Winkel selbst." },
                ],
              }),
            ],
            steps: [
              `Winkelsumme: γ = 180° − ${alpha}° − ${beta}° = ${gamma}°`,
              `Das Paar aus Seite und Gegenwinkel ist c und γ. Sinussatz: ${name} : sin ${greek} = c : sin γ, also ${name} = c · sin ${greek} : sin γ.`,
              `${name} = ${fmt(c, 1)} cm · sin ${angle}° : sin ${gamma}° ≈ ${fmt(c, 1)} · ${fmt(sinD(angle), 4)} : ${fmt(sinD(gamma), 4)} ≈ <strong>${cm(side)}</strong>`,
            ],
            meta: { c, alpha, beta, ask: askA ? 0 : 1 },
          };
        }
        const base = rng.pick([60, 75, 80, 90, 100, 120, 150]);
        const alpha = rng.int(40, 80);
        const beta = rng.int(40, Math.min(80, 145 - alpha));
        const gamma = 180 - alpha - beta;
        const ac = (base * sinD(beta)) / sinD(gamma);
        const width = ac * sinD(alpha);
        return {
          prompt: `Um die Breite eines Flusses zu bestimmen, steckt Lena am Ufer eine ${base} m lange, gerade Standlinie [AB] ab. Am anderen Ufer steht ein Baum C. Sie misst ∢BAC = ${alpha}° und ∢ABC = ${beta}°. Wie weit ist der Baum von A entfernt, und wie breit ist der Fluss, also wie weit ist der Baum von der Geraden AB entfernt?`,
          given: [`AB = ${base} m`, `∢BAC = ${alpha}°`, `∢ABC = ${beta}°`],
          fields: [
            numberField("AC =", ac, "m", 2, {
              slips: [
                { value: (base * sinD(alpha)) / sinD(gamma), hint: "Das ist BC. AC liegt dem Winkel bei B gegenüber: AC = AB · sin β : sin γ." },
                { value: (base * Math.sin(beta)) / Math.sin(gamma), hint: RAD_HINT },
              ],
            }),
            numberField("Breite =", width, "m", 2, {
              slips: [
                { value: ac * cosD(alpha), hint: "Die Breite ist die Höhe von C auf AB, die Gegenkathete des Winkels bei A: h = AC · sin α." },
                { value: ac, hint: "AC läuft schräg über den Fluss. Die Breite ist der senkrechte Abstand h = AC · sin α." },
              ],
            }),
          ],
          steps: [
            `Der dritte Winkel liegt der Standlinie gegenüber: ∢ACB = 180° − ${alpha}° − ${beta}° = ${gamma}°.`,
            `Sinussatz: AC : sin ${beta}° = AB : sin ${gamma}°, also AC = ${base} m · sin ${beta}° : sin ${gamma}° ≈ ${fmtUnit(ac, "m")}.`,
            `Die Breite ist die Höhe h von C auf AB. Im rechtwinkligen Dreieck mit der Hypotenuse AC gilt h = AC · sin ${alpha}° ≈ ${fmtUnit(width, "m")}.`,
            `<strong>AC ≈ ${fmtUnit(ac, "m")}, Breite ≈ ${fmtUnit(width, "m")}</strong>`,
          ],
          meta: { base, alpha, beta },
        };
      },
    },
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { a, b, alpha } = draw(
            () => {
              const a = rng.stepped(5, 12, 0.5);
              return { a, b: a - rng.stepped(0.5, 3, 0.5), alpha: rng.int(35, 100) };
            },
            (t) => 180 - t.alpha - asinD((t.b * sinD(t.alpha)) / t.a) >= 12,
            { a: 8, b: 6, alpha: 70 },
          );
          const s = (b * sinD(alpha)) / a;
          const beta = asinD(s);
          const gamma = 180 - alpha - beta;
          const c = (a * sinD(gamma)) / sinD(alpha);
          return {
            prompt: `Im Dreieck ABC sind a = ${fmt(a, 1)} cm, b = ${fmt(b, 1)} cm und α = ${alpha}°. Berechne den Winkel β und die Seite c.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `α = ${alpha}°`],
            formulaHint: `sin β = ${frac("b · sin α", "a")}; γ = 180° − α − β; c = ${frac("a · sin γ", "sin α")}`,
            fields: [
              numberField("β =", beta, "°", 2, {
                slips: [
                  { value: 180 - beta, hint: "180° − β passt hier nicht: Mit α wären es schon mehr als 180°. β liegt der kürzeren Seite b gegenüber und ist spitz." },
                  { value: Math.asin((b * Math.sin(alpha)) / a), hint: RAD_HINT },
                ],
              }),
              numberField("c =", c, "cm", 2, {
                slips: [{ value: b, hint: "Das ist die Seite b. Für c brauchst du den Gegenwinkel γ = 180° − α − β." }],
              }),
            ],
            steps: [
              `Das Paar a und α ist bekannt. Sinussatz: sin β : b = sin α : a, also sin β = ${fmt(b, 1)} · sin ${alpha}° : ${fmt(a, 1)} ≈ ${fmt(s, 4)}.`,
              `β₁ = sin⁻¹(${fmt(s, 4)}) ≈ ${deg(beta)}. Der zweite Kandidat 180° − β₁ ≈ ${deg(180 - beta)} fällt weg: Zusammen mit α = ${alpha}° wären es mehr als 180°.`,
              `γ = 180° − ${alpha}° − ${deg(beta)} ≈ ${deg(gamma)}; c = a · sin γ : sin α = ${fmt(a, 1)} cm · sin ${deg(gamma)} : sin ${alpha}°`,
              `<strong>β ≈ ${deg(beta)}, c ≈ ${cm(c)}</strong>`,
            ],
            meta: { a, b, alpha },
          };
        }
        const { c, a, gamma } = draw(
          () => {
            const c = rng.pick([36, 40, 42, 45, 48, 50, 54, 60]);
            return { c, a: c - rng.pick([4, 6, 7, 8, 9, 10, 12]), gamma: rng.int(55, 100) };
          },
          (t) => 180 - t.gamma - asinD((t.a * sinD(t.gamma)) / t.c) >= 12,
          { c: 48, a: 41, gamma: 72 },
        );
        const s = (a * sinD(gamma)) / c;
        const alpha = asinD(s);
        const beta = 180 - gamma - alpha;
        const b = (c * sinD(beta)) / sinD(gamma);
        return {
          prompt: `Ein dreieckiges Grundstück ABC grenzt mit der ${c} m langen Seite [AB] an eine Straße. Die Grenze [BC] ist ${a} m lang, und an der Ecke C treffen sich die Grenzen [AC] und [BC] unter einem Winkel von ${gamma}°. Berechne das Maß des Winkels ∢BAC und die Länge der dritten Grenze [AC].`,
          given: [`AB = ${c} m`, `BC = ${a} m`, `∢ACB = ${gamma}°`],
          fields: [
            numberField("∢BAC =", alpha, "°", 2, {
              slips: [{ value: 180 - alpha, hint: "Ein zweites Dreieck gibt es hier nicht: ∢BAC liegt der kürzeren Seite [BC] gegenüber, 180° − α ist zu groß." }],
            }),
            numberField("AC =", b, "m", 2, {
              slips: [{ value: a, hint: "Das ist BC. AC liegt dem Winkel bei B gegenüber; berechne zuerst ∢CBA = 180° − α − γ." }],
            }),
          ],
          steps: [
            `Bekannt ist das Paar aus [AB] und dem Winkel bei C, denn [AB] liegt C gegenüber. Sinussatz: sin α = BC · sin γ : AB = ${a} · sin ${gamma}° : ${c} ≈ ${fmt(s, 4)}.`,
            `α ≈ ${deg(alpha)}. Weil [BC] kürzer ist als [AB], ist α kleiner als γ; 180° − α kommt nicht in Frage.`,
            `∢CBA = 180° − ${gamma}° − ${deg(alpha)} ≈ ${deg(beta)}; AC = AB · sin β : sin γ ≈ ${c} m · sin ${deg(beta)} : sin ${gamma}°`,
            `<strong>∢BAC ≈ ${deg(alpha)}, AC ≈ ${fmtUnit(b, "m")}</strong>`,
          ],
          meta: { c, a, gamma },
        };
      },
    },
    {
      id: "zwei-loesungen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const two = rng.next() < 0.6;
          const { a, b, alpha } = draw(
            () => {
              const alpha = rng.int(25, 60);
              const b = rng.stepped(5, 12, 0.5);
              return { alpha, b, a: two ? rng.stepped(2, b - 0.5, 0.5) : rng.stepped(b + 0.5, b + 4, 0.5) };
            },
            (t) => {
              const s = (t.b * sinD(t.alpha)) / t.a;
              return s >= 0.25 && s <= 0.95 && Math.abs(asinD(s) - t.alpha) >= 3;
            },
            two ? { a: 5, b: 7, alpha: 35 } : { a: 8, b: 6, alpha: 40 },
          );
          const s = (b * sinD(alpha)) / a;
          const beta1 = asinD(s);
          const beta2 = 180 - beta1;
          return {
            prompt: `Gegeben sind a = ${fmt(a, 1)} cm, b = ${fmt(b, 1)} cm und α = ${alpha}°. Berechne mit dem Sinussatz beide Kandidaten für den Winkel β und entscheide, wie viele Dreiecke ABC es zu diesen Angaben gibt.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `α = ${alpha}° (liegt a gegenüber)`],
            formulaHint: `sin β = ${frac("b · sin α", "a")}; β₁ = sin⁻¹(…), β₂ = 180° − β₁; β₂ passt nur, wenn α + β₂ &lt; 180°`,
            fields: [
              numberField("β₁ =", beta1, "°", 2, { slips: [{ value: Math.asin((b * Math.sin(alpha)) / a), hint: RAD_HINT }] }),
              numberField("β₂ =", beta2, "°", 2, {
                slips: [
                  { value: 360 - beta1, hint: "Den gleichen Sinus hat der Supplementwinkel 180° − β₁, nicht 360° − β₁." },
                  { value: 90 - beta1, hint: "Nicht 90° − β₁: Den gleichen Sinus hat der Supplementwinkel 180° − β₁." },
                ],
              }),
              choiceField("Anzahl der Dreiecke", ["eines", "zwei"], two ? 1 : 0),
            ],
            steps: [
              `sin β = ${fmt(b, 1)} · sin ${alpha}° : ${fmt(a, 1)} ≈ ${fmt(s, 4)}`,
              `β₁ = sin⁻¹(${fmt(s, 4)}) ≈ ${deg(beta1)}; wegen sin(180° − β) = sin β ist auch β₂ = 180° − β₁ ≈ ${deg(beta2)} ein Kandidat.`,
              two
                ? `Probe: α + β₂ ≈ ${alpha}° + ${deg(beta2)} = ${deg(alpha + beta2)} &lt; 180°. Beide Winkel passen, mit γ₁ ≈ ${deg(180 - alpha - beta1)} und γ₂ ≈ ${deg(180 - alpha - beta2)}.`
                : `Probe: α + β₂ ≈ ${alpha}° + ${deg(beta2)} = ${deg(alpha + beta2)} &gt; 180°. Nur β₁ passt, mit γ ≈ ${deg(180 - alpha - beta1)}.`,
              `<strong>β₁ ≈ ${deg(beta1)}, β₂ ≈ ${deg(beta2)}: ${two ? "zwei Dreiecke" : "ein Dreieck"}</strong>`,
            ],
            meta: { a, b, alpha, two: two ? 1 : 0 },
          };
        }
        const { b, alpha, a } = draw(
          () => ({ b: rng.stepped(8, 16, 0.5), alpha: rng.int(15, 40), a: rng.stepped(3, 15, 0.5) }),
          (t) => {
            const h = t.b * sinD(t.alpha);
            const near = t.b * cosD(t.alpha) - Math.sqrt(t.a * t.a - h * h);
            return t.a <= t.b - 1 && h / t.a <= 0.92 && h / t.a >= 0.3 && near >= 0.5;
          },
          { b: 12, alpha: 30, a: 9 },
        );
        const s = (b * sinD(alpha)) / a;
        const beta1 = asinD(s);
        const beta2 = 180 - beta1;
        const gamma1 = 180 - alpha - beta1;
        const gamma2 = 180 - alpha - beta2;
        const far = (a * sinD(gamma1)) / sinD(alpha);
        const near = (a * sinD(gamma2)) / sinD(alpha);
        return {
          prompt: `Ein Schiff fährt vom Punkt A aus geradeaus. Der Leuchtturm L steht ${fmt(b, 1)} km von A entfernt; der Kurs des Schiffs bildet mit der Richtung von A nach L einen Winkel von ${alpha}°. Das Leuchtfeuer ist bis ${fmt(a, 1)} km weit zu sehen. Nach wie vielen Kilometern fährt das Schiff in den Lichtkreis hinein, und nach wie vielen verlässt es ihn wieder?`,
          given: [`AL = ${fmtUnit(b, "km", 1)}`, `Winkel zwischen Kurs und AL: ${alpha}°`, `Reichweite des Lichts: ${fmtUnit(a, "km", 1)}`],
          fields: [
            numberField("hinein nach", near, "km", 2),
            numberField("hinaus nach", far, "km", 2, {
              slips: [{ value: b * cosD(alpha), hint: "Hier kommt das Schiff dem Leuchtturm am nächsten, genau in der Mitte zwischen Eintritt und Austritt." }],
            }),
          ],
          steps: [
            `Für einen Punkt B des Kurses am Rand des Lichtkreises gilt LB = ${fmt(a, 1)} km. Im Dreieck ABL liegt der Winkel ${alpha}° bei A der Seite LB gegenüber, der Winkel β bei B der Seite AL.`,
            `Sinussatz: sin β = AL · sin ${alpha}° : LB = ${fmt(b, 1)} · sin ${alpha}° : ${fmt(a, 1)} ≈ ${fmt(s, 4)}, also β₁ ≈ ${deg(beta1)} oder β₂ ≈ ${deg(beta2)}. Wegen ${alpha}° + ${deg(beta2)} &lt; 180° passen beide: Es gibt zwei Punkte.`,
            `Winkel bei L: γ₁ = 180° − α − β₁ ≈ ${deg(gamma1)} und γ₂ = 180° − α − β₂ ≈ ${deg(gamma2)}`,
            `AB = LB · sin γ : sin α: ${fmt(a, 1)} · sin ${deg(gamma2)} : sin ${alpha}° ≈ ${fmtUnit(near, "km")} und ${fmt(a, 1)} · sin ${deg(gamma1)} : sin ${alpha}° ≈ ${fmtUnit(far, "km")}`,
            `<strong>hinein nach ≈ ${fmtUnit(near, "km")}, hinaus nach ≈ ${fmtUnit(far, "km")}</strong>`,
          ],
          meta: { b, alpha, a },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest mit dem Sinussatz Seiten und Winkel aus und erkennst, wann zwei Seiten und ein Gegenwinkel zwei Dreiecke liefern.",
};

// 2.2 Kosinussatz ────────────────────────────────────────────────────────────

function cosineKind(v: LabValues): string {
  const t = cosineLabTriangle(v);
  if (!t) return "kein Dreieck";
  if (Math.abs(t.gamma - 90) < 1e-6) return "recht: c² = a² + b² (Pythagoras)";
  return t.gamma < 90 ? "spitz: c² < a² + b²" : "stumpf: c² > a² + b²";
}

const KIND_NAMES = ["spitz", "recht", "stumpf"];

const kosinussatz: Lesson = {
  id: "dr-2-kosinussatz",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Der Kosinussatz",
  subtitle: "Pythagoras für jedes Dreieck, mit einem Korrekturterm",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Kosinussatz`,
  whyItMatters:
    "Wer zwei Strecken und den Winkel dazwischen messen kann, kennt damit auch die dritte, etwa die Länge eines Tunnels durch einen Berg. Und aus drei Längen folgt jeder Winkel.",
  explanationHtml: `
    <p>Kennst du zwei Seiten und den <strong>eingeschlossenen Winkel</strong> (SWS) oder alle <strong>drei Seiten</strong> (SSS), fehlt das Paar aus Seite und Gegenwinkel: Der Sinussatz kommt nicht weiter. Dann hilft der <strong>Kosinussatz</strong>:</p>
    <p class="formula-line"><strong>c² = a² + b² − 2ab · cos γ</strong></p>
    <p>Ebenso gilt a² = b² + c² − 2bc · cos α und b² = a² + c² − 2ac · cos β. Links steht immer die Seite, die dem Winkel rechts gegenüberliegt.</p>
    <p>Herleitung: Die Höhe von A auf die Gerade BC hat den Fußpunkt F mit CF = b · cos γ und AF = b · sin γ. Im rechtwinkligen Dreieck ABF gilt c² = (b · sin γ)² + (a − b · cos γ)² = a² − 2ab · cos γ + b² · (sin² γ + cos² γ) = a² + b² − 2ab · cos γ.</p>
    <ul>
      <li><strong>SWS:</strong> einsetzen, dann die Wurzel ziehen.</li>
      <li><strong>SSS:</strong> nach dem Winkel auflösen: cos γ = ${frac("a² + b² − c²", "2ab")}. Zu jedem Kosinuswert gehört genau ein Winkel zwischen 0° und 180°; eine zweite Lösung wie beim Sinussatz gibt es nicht.</li>
      <li>Für <strong>γ = 90°</strong> ist cos γ = 0: Es bleibt c² = a² + b², der Satz des Pythagoras.</li>
      <li>Ist γ <strong>stumpf</strong>, ist cos γ negativ, −2ab · cos γ also positiv: c² &gt; a² + b². Ist γ spitz, ist c² &lt; a² + b².</li>
    </ul>
    <div class="example">Beispiel: a = 5 cm, b = 3 cm, γ = 120°: c² = 25 + 9 − 2 · 5 · 3 · cos 120° = 34 − 30 · (−0,5) = 49, also c = 7 cm. Umgekehrt liefern die Seiten 3 cm, 5 cm und 7 cm für den Winkel gegenüber der 7-cm-Seite cos γ = (9 + 25 − 49) : 30 = −0,5, also γ = 120°.</div>
    <div class="merke"><strong>Merke:</strong> Bei SWS und SSS hilft der Kosinussatz. Bei SSS zuerst den größten Winkel berechnen, er liegt der längsten Seite gegenüber. Die beiden anderen sind dann spitz, und für sie darfst du auch den Sinussatz nehmen.</div>
  `,
  formulas: [
    { name: "Kosinussatz", html: "c² = a² + b² − 2ab · cos γ", quantities: "γ liegt c gegenüber und wird von a und b eingeschlossen" },
    { name: "Winkel aus drei Seiten", html: `cos γ = ${frac("a² + b² − c²", "2ab")}`, quantities: "eindeutig, weil 0° < γ < 180°" },
    { name: "Sonderfall γ = 90°", html: "cos 90° = 0 ⇒ c² = a² + b²", quantities: "der Satz des Pythagoras" },
  ],
  quiz: {
    question: "Im Dreieck ABC ist c² größer als a² + b². Was folgt für den Winkel γ?",
    options: ["γ ist spitz", "γ ist stumpf", "γ ist ein rechter Winkel"],
    correctIndex: 1,
    explanation: "Aus c² = a² + b² − 2ab · cos γ folgt: c² ist nur dann größer als a² + b², wenn cos γ negativ ist, also für 90° < γ < 180°.",
  },
  lab: {
    kind: "cosine-law",
    title: "Labor: Pythagoras mit Korrekturterm",
    intro: "SWS: Ziehe die Ecken A und B und lies die dritte Seite ab. SSS: Stelle drei Seiten ein, der Kosinussatz liefert γ. Rechts vergleichst du a² + b² mit c².",
    params: [
      {
        type: "choice",
        key: "mode",
        label: "Gegeben",
        options: [
          { value: 0, label: "SWS: a, b und γ" },
          { value: 1, label: "SSS: a, b und c" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "Seite a = BC", unit: "cm", min: 2, max: 9, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "b", label: "Seite b = AC", unit: "cm", min: 2, max: 9, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "gamma", label: "Winkel γ", unit: "°", min: 10, max: 170, step: 1, value: 70, showIf: (v) => v.mode === 0 },
      { type: "range", key: "c", label: "Seite c = AB", unit: "cm", min: 1, max: 17, step: 0.5, value: 6, digits: 1, showIf: (v) => v.mode === 1 },
    ],
    readouts: [
      { key: "c", label: "Seite c", unit: "cm", digits: 2, compute: (v) => (v.mode === 1 ? v.c : (cosineLabTriangle(v)?.c ?? v.c)) },
      { key: "gamma", label: "Winkel γ", unit: "°", digits: 2, emphasis: true, compute: (v) => cosineLabTriangle(v)?.gamma ?? "kein Dreieck" },
      { key: "sum", label: "a² + b²", unit: "cm²", digits: 2, compute: (v) => v.a * v.a + v.b * v.b },
      { key: "c2", label: "c²", unit: "cm²", digits: 2, compute: (v) => (v.mode === 1 ? v.c * v.c : (cosineLabTriangle(v)?.c ?? 0) ** 2) },
      { key: "kind", label: "Art des Winkels γ", compute: cosineKind },
    ],
    goals: [
      {
        id: "pythagoras",
        text: "SWS: Lass den Term 2ab · cos γ verschwinden. Welcher Satz bleibt übrig?",
        check: (v) => v.mode === 0 && v.gamma === 90,
      },
      {
        id: "zehn",
        text: "SWS: Mache mit a = 6 cm und b = 5 cm die dritte Seite c = 10 cm lang (±0,05 cm).",
        check: (v) => v.mode === 0 && v.a === 6 && v.b === 5 && within(cosineLabTriangle(v)?.c ?? 0, 10, 0.05),
      },
      {
        id: "sss",
        text: "SSS: Stelle die Seiten a = 3 cm, b = 5 cm und c = 7 cm ein. Wie groß ist γ?",
        check: (v) => v.mode === 1 && v.a === 3 && v.b === 5 && v.c === 7,
      },
    ],
  },
  exercises: [
    {
      id: "seite",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(3, 12, 0.5);
          const b = rng.stepped(3, 12, 0.5);
          const gamma = rng.int(20, 160);
          const term = 2 * a * b * cosD(gamma);
          const c2 = a * a + b * b - term;
          const c = Math.sqrt(c2);
          return {
            prompt: `Im Dreieck ABC sind a = ${fmt(a, 1)} cm, b = ${fmt(b, 1)} cm und der eingeschlossene Winkel γ = ${gamma}° gegeben. Berechne die dritte Seite c.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `γ = ${gamma}°`],
            formulaHint: "c² = a² + b² − 2ab · cos γ",
            fields: [numberField("c =", c, "cm", 2, { slips: cosineSlips(a, b, gamma) })],
            steps: [
              `c² = ${fmt(a * a, 2)} + ${fmt(b * b, 2)} − 2 · ${fmt(a, 1)} · ${fmt(b, 1)} · cos ${gamma}°`,
              `c² ≈ ${minusTerm(a * a + b * b, term)} ≈ ${fmtUnit(c2, "cm²")}`,
              `c = ${sqrtHtml(fmt(c2, 2))} cm ≈ <strong>${cm(c)}</strong>`,
            ],
            meta: { a, b, gamma },
          };
        }
        if (rng.next() < 0.5) {
          const p = rng.stepped(0.8, 2.5, 0.05);
          const q = rng.stepped(0.8, 2.5, 0.05);
          const gamma = rng.int(40, 130);
          const c = Math.sqrt(p * p + q * q - 2 * p * q * cosD(gamma));
          return {
            prompt: `Durch einen Berg soll ein geradliniger Tunnel von A nach B gebaut werden. Von einem Punkt C aus, von dem man beide Tunneleingänge sieht, misst man CA = ${fmt(p, 2)} km, CB = ${fmt(q, 2)} km und den Winkel ∢ACB = ${gamma}°. Wie lang wird der Tunnel?`,
            given: [`CA = ${fmtUnit(p, "km")}`, `CB = ${fmtUnit(q, "km")}`, `∢ACB = ${gamma}°`],
            fields: [numberField("AB =", c, "km", 2, { slips: cosineSlips(p, q, gamma) })],
            steps: [
              "Gegeben sind zwei Seiten und der Winkel bei C, den sie einschließen: Kosinussatz.",
              `AB² = ${fmt(p, 2)}² + ${fmt(q, 2)}² − 2 · ${fmt(p, 2)} · ${fmt(q, 2)} · cos ${gamma}° ≈ ${fmt(c * c, 4)}`,
              `AB ≈ <strong>${fmtUnit(c, "km")}</strong>`,
            ],
            meta: { p, q, gamma, scenario: 0 },
          };
        }
        const v1 = rng.pick([12, 15, 18, 20, 24]);
        const v2 = rng.pick([10, 14, 16, 22, 25]);
        const t = rng.pick([1.5, 2, 2.5, 3]);
        const gamma = rng.int(35, 140);
        const p = v1 * t;
        const q = v2 * t;
        const d = Math.sqrt(p * p + q * q - 2 * p * q * cosD(gamma));
        return {
          prompt: `Zwei Fähren legen gleichzeitig im selben Hafen ab. Ihre Kurse bilden einen Winkel von ${gamma}°. Die eine fährt mit ${v1} km/h, die andere mit ${v2} km/h. Wie weit sind sie nach ${fmt(t, 1)} Stunden (Luftlinie) voneinander entfernt?`,
          given: [`Winkel zwischen den Kursen: ${gamma}°`, `${v1} km/h und ${v2} km/h`, `Fahrzeit ${fmt(t, 1)} h`],
          fields: [
            numberField("Entfernung =", d, "km", 2, {
              slips: [
                ...cosineSlips(p, q, gamma),
                { value: Math.sqrt(v1 * v1 + v2 * v2 - 2 * v1 * v2 * cosD(gamma)), hint: "Rechne zuerst die Wege aus: Geschwindigkeit mal Zeit." },
              ],
            }),
          ],
          steps: [
            `Wege nach ${fmt(t, 1)} h: ${v1} km/h · ${fmt(t, 1)} h = ${fmtUnit(p, "km", 1)} und ${v2} km/h · ${fmt(t, 1)} h = ${fmtUnit(q, "km", 1)}`,
            `Die Wege schließen den Winkel ${gamma}° ein: d² = ${fmt(p, 1)}² + ${fmt(q, 1)}² − 2 · ${fmt(p, 1)} · ${fmt(q, 1)} · cos ${gamma}° ≈ ${fmt(d * d, 2)}`,
            `d ≈ <strong>${fmtUnit(d, "km")}</strong>`,
          ],
          meta: { p, q, gamma, scenario: 1 },
        };
      },
    },
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const { a, b, c } = draw(
            () => {
              const a = rng.stepped(3, 12, 0.5);
              const b = rng.stepped(3, 12, 0.5);
              return { a, b, c: rng.stepped(Math.abs(a - b) + 1, a + b - 1, 0.5) };
            },
            (t) => t.a * t.a + t.b * t.b === t.c * t.c || Math.abs(acosD((t.a * t.a + t.b * t.b - t.c * t.c) / (2 * t.a * t.b)) - 90) >= 1.5,
            { a: 5, b: 7, c: 9 },
          );
          const top = a * a + b * b - c * c;
          const cosG = top / (2 * a * b);
          const gamma = acosD(cosG);
          const kind = top === 0 ? 1 : top > 0 ? 0 : 2;
          return {
            prompt: `Ein Dreieck hat die Seiten a = ${fmt(a, 1)} cm, b = ${fmt(b, 1)} cm und c = ${fmt(c, 1)} cm. Berechne den Winkel γ, der c gegenüberliegt, und gib an, welche Art von Winkel er ist.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `c = ${cm(c, 1)}`],
            formulaHint: `cos γ = ${frac("a² + b² − c²", "2ab")}`,
            fields: [
              numberField("γ =", gamma, "°", 2, {
                slips: [
                  { value: 180 - gamma, hint: "Vorzeichen im Zähler: cos γ = (a² + b² − c²) : (2ab), c² wird abgezogen." },
                  { value: Math.acos(cosG), hint: RAD_HINT },
                ],
              }),
              choiceField("Art des Winkels γ", KIND_NAMES, kind),
            ],
            steps: [
              `cos γ = (${fmt(a * a, 2)} + ${fmt(b * b, 2)} − ${fmt(c * c, 2)}) : (2 · ${fmt(a, 1)} · ${fmt(b, 1)}) = ${fmt(top, 2)} : ${fmt(2 * a * b, 2)} ≈ ${fmt(cosG, 4)}`,
              `γ = cos⁻¹(${fmt(cosG, 4)}) ≈ ${deg(gamma)}`,
              `<strong>γ ≈ ${deg(gamma)}, ${KIND_NAMES[kind]}</strong>: ${kind === 1 ? "cos γ = 0, also c² = a² + b²" : kind === 0 ? "cos γ &gt; 0, also c² &lt; a² + b²" : "cos γ &lt; 0, also c² &gt; a² + b²"}.`,
            ],
            meta: { a, b, c },
          };
        }
        const sail = rng.next() < 0.5;
        const { p, q, r } = draw(
          () => {
            const p = rng.stepped(2.5, 7, 0.1);
            const q = rng.stepped(2.5, 7, 0.1);
            return { p, q, r: rng.stepped(Math.max(p, q) + 0.3, p + q - 0.5, 0.1) };
          },
          (t) => Math.abs(acosD((t.p * t.p + t.q * t.q - t.r * t.r) / (2 * t.p * t.q)) - 90) >= 2,
          { p: 4.2, q: 5.5, r: 7.8 },
        );
        const u = sail ? 1 : 10;
        const d = sail ? 1 : 0;
        const [P, Q, R] = [p * u, q * u, r * u];
        const cosG = (P * P + Q * Q - R * R) / (2 * P * Q);
        const gamma = acosD(cosG);
        const obtuse = gamma > 90;
        const sides = `${fmt(P, d)} m, ${fmt(Q, d)} m und ${fmt(R, d)} m`;
        return {
          prompt: sail
            ? `Ein dreieckiges Sonnensegel hat Kanten von ${sides} Länge. Unter welchem Winkel treffen sich die beiden kürzeren Kanten? Ist dieser Winkel stumpf?`
            : `Die Grenzen eines dreieckigen Grundstücks sind ${sides} lang. Unter welchem Winkel stoßen die beiden kürzeren Grenzen aneinander? Ist dieser Winkel stumpf?`,
          given: [`Seiten: ${sides}`],
          fields: [
            numberField("Winkel =", gamma, "°", 2, {
              slips: [
                { value: 180 - gamma, hint: "Vorzeichen im Zähler: cos γ = (a² + b² − c²) : (2ab); die längste Seite wird abgezogen." },
                { value: Math.acos(cosG), hint: RAD_HINT },
              ],
            }),
            yesNo("stumpf?", obtuse),
          ],
          steps: [
            `Die beiden kürzeren Seiten schließen den Winkel ein, der der längsten Seite (${fmt(R, d)} m) gegenüberliegt.`,
            `cos γ = (${fmt(P, d)}² + ${fmt(Q, d)}² − ${fmt(R, d)}²) : (2 · ${fmt(P, d)} · ${fmt(Q, d)}) ≈ ${fmt(cosG, 4)}`,
            `<strong>γ ≈ ${deg(gamma)}, ${obtuse ? "der Winkel ist stumpf" : "der Winkel ist nicht stumpf, sondern spitz"}</strong>`,
          ],
          meta: { p: P, q: Q, r: R },
        };
      },
    },
    {
      id: "parallelogramm",
      make: (rng, level): ExerciseTask => {
        const a = level === 1 ? rng.stepped(4, 12, 0.5) : rng.int(18, 40);
        const b = level === 1 ? rng.stepped(3, a, 0.5) : rng.int(10, a - 2);
        const alpha = rng.int(level === 1 ? 30 : 40, 80);
        const f = Math.sqrt(a * a + b * b - 2 * a * b * cosD(alpha));
        const e = Math.sqrt(a * a + b * b + 2 * a * b * cosD(alpha));
        if (level === 1) {
          return {
            prompt: `Ein Parallelogramm ABCD hat die Seiten AB = ${fmt(a, 1)} cm und AD = ${fmt(b, 1)} cm und den Innenwinkel ∢DAB = ${alpha}°. Berechne die Längen der Diagonalen [BD] und [AC].`,
            given: [`AB = CD = ${cm(a, 1)}`, `AD = BC = ${cm(b, 1)}`, `∢DAB = ${alpha}°`],
            formulaHint: "BD² = AB² + AD² − 2 · AB · AD · cos ∢DAB; im Dreieck ABC ist ∢ABC = 180° − ∢DAB",
            fields: [
              numberField("BD =", f, "cm", 2, { slips: cosineSlips(a, b, alpha) }),
              numberField("AC =", e, "cm", 2, {
                slips: [{ value: f, hint: "Für AC brauchst du den Winkel bei B: ∢ABC = 180° − α, und cos(180° − α) = −cos α." }],
              }),
            ],
            steps: [
              `Dreieck ABD: BD² = ${fmt(a * a, 2)} + ${fmt(b * b, 2)} − 2 · ${fmt(a, 1)} · ${fmt(b, 1)} · cos ${alpha}° ≈ ${fmt(f * f, 2)}, also BD ≈ ${cm(f)}`,
              `Benachbarte Winkel im Parallelogramm ergänzen sich zu 180°: ∢ABC = 180° − ${alpha}° = ${180 - alpha}°, und BC = AD = ${cm(b, 1)}.`,
              `Dreieck ABC: AC² = ${fmt(a * a, 2)} + ${fmt(b * b, 2)} − 2 · ${fmt(a, 1)} · ${fmt(b, 1)} · cos ${180 - alpha}° ≈ ${fmt(e * e, 2)}`,
              `<strong>BD ≈ ${cm(f)}, AC ≈ ${cm(e)}</strong>`,
            ],
            meta: { a, b, alpha },
          };
        }
        return {
          prompt: `Ein Grundstück hat die Form eines Parallelogramms mit den Seitenlängen ${a} m und ${b} m; an zwei gegenüberliegenden Ecken misst der Innenwinkel ${alpha}°. Quer über das Grundstück sollen zwei gerade Wege entlang der Diagonalen angelegt werden. Wie lang wird der kürzere, wie lang der längere Weg?`,
          given: [`Seiten ${a} m und ${b} m`, `Innenwinkel ${alpha}° und ${180 - alpha}°`],
          fields: [
            numberField("kürzerer Weg =", f, "m", 2, { slips: cosineSlips(a, b, alpha) }),
            numberField("längerer Weg =", e, "m", 2),
          ],
          steps: [
            `Die kürzere Diagonale liegt dem spitzen Winkel ${alpha}° gegenüber: d₁² = ${a}² + ${b}² − 2 · ${a} · ${b} · cos ${alpha}° ≈ ${fmt(f * f, 2)}`,
            `Die längere liegt dem stumpfen Winkel ${180 - alpha}° gegenüber: d₂² = ${a}² + ${b}² − 2 · ${a} · ${b} · cos ${180 - alpha}° ≈ ${fmt(e * e, 2)}`,
            `<strong>kürzerer Weg ≈ ${fmtUnit(f, "m")}, längerer Weg ≈ ${fmtUnit(e, "m")}</strong>`,
          ],
          meta: { a, b, alpha },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du findest mit dem Kosinussatz die dritte Seite und jeden Winkel aus drei Seiten, und der Pythagoras ist nur ein Sonderfall.",
};

// 2.3 Flächeninhalt mit dem Sinus ────────────────────────────────────────────

function areaSlips(a: number, b: number, gamma: number): Slip[] {
  return [
    { value: a * b * sinD(gamma), hint: "Das ist der Flächeninhalt eines Parallelogramms. Für das Dreieck fehlt der Faktor ½." },
    { value: 0.5 * a * b * cosD(gamma), hint: "Im Flächensatz steht der Sinus des eingeschlossenen Winkels, nicht der Kosinus." },
    { value: 0.5 * a * b * Math.sin(gamma), hint: RAD_HINT },
  ];
}

function reverseSlips(area: number, a: number, b: number): Slip[] {
  return [
    { value: asinD(area / (a * b)), hint: "Den Faktor ½ beachten: Aus A = ½ · a · b · sin γ folgt sin γ = 2A : (a · b)." },
    { value: Math.asin((2 * area) / (a * b)), hint: RAD_HINT },
  ];
}

const flaecheninhalt: Lesson = {
  id: "dr-3-flaecheninhalt",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Flächeninhalt mit dem Sinus",
  subtitle: "Zwei Seiten und der Winkel dazwischen genügen",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, Flächeninhalt A = ½ · a · b · sin γ`,
  whyItMatters:
    "Bei Grundstücken, Segeln oder Dachflächen kann man die Höhe oft nicht messen, wohl aber zwei Seiten und einen Winkel. Damit kennst du den Flächeninhalt, und damit Preis, Stoff oder Farbe.",
  explanationHtml: `
    <p>Für den Flächeninhalt eines Dreiecks brauchst du eine Seite und die Höhe auf diese Seite: A = ½ · a · h<sub>a</sub>. Kennst du statt der Höhe zwei Seiten a, b und den <strong>eingeschlossenen Winkel γ</strong>, liefert das rechtwinklige Teildreieck die Höhe: h<sub>a</sub> = b · sin γ. Also gilt</p>
    <p class="formula-line"><strong>A = ½ · a · b · sin γ</strong></p>
    <ul>
      <li>Ebenso A = ½ · b · c · sin α = ½ · a · c · sin β: immer zwei Seiten und der Winkel <strong>zwischen</strong> ihnen.</li>
      <li>Bei festen Seiten a und b ist der Flächeninhalt für γ = 90° am größten, denn sin 90° = 1: A<sub>max</sub> = ½ · a · b.</li>
      <li>Wegen sin(180° − γ) = sin γ haben die Dreiecke mit γ und mit 180° − γ denselben Flächeninhalt.</li>
      <li>Umgekehrt: Aus A, a und b folgt sin γ = ${frac("2A", "a · b")}. Ist sin γ &lt; 1, passen zwei Winkel, γ₁ = sin⁻¹(…) und γ₂ = 180° − γ₁.</li>
      <li>Ein Parallelogramm mit den Seiten a, b und dem Winkel γ besteht aus zwei solchen Dreiecken: A = a · b · sin γ.</li>
    </ul>
    <div class="example">Beispiel: a = 8 cm, b = 6 cm, γ = 40°: A = ½ · 8 · 6 · sin 40° ≈ ${fmt(24 * sinD(40), 2)} cm². Soll umgekehrt A = 12 cm² sein, gilt sin γ = 24 : 48 = 0,5, also γ = 30° oder γ = 150°.</div>
    <div class="merke"><strong>Merke:</strong> A = ½ · Seite · Seite · Sinus des eingeschlossenen Winkels. Zu einem Flächeninhalt unter dem Höchstwert ½ · a · b gehören zwei Winkel: γ und 180° − γ.</div>
  `,
  formulas: [
    { name: "Flächeninhalt mit dem Sinus", html: "A = ½ · a · b · sin γ", quantities: "γ liegt zwischen den Seiten a und b" },
    { name: "Größter Flächeninhalt", html: "A<sub>max</sub> = ½ · a · b für γ = 90°", quantities: "bei festen Seiten a und b" },
    { name: "Winkel aus dem Flächeninhalt", html: `sin γ = ${frac("2A", "a · b")}; γ₂ = 180° − γ₁`, quantities: "zwei Lösungen, solange sin γ < 1" },
  ],
  quiz: {
    question: "Zwei Dreiecke haben beide die Seiten a = 5 cm und b = 4 cm. Im einen schließen sie den Winkel γ = 50° ein, im anderen γ = 130°. Was gilt für die Flächeninhalte?",
    options: ["Beide sind gleich groß", "Das Dreieck mit 130° ist größer", "Das Dreieck mit 50° ist größer"],
    correctIndex: 0,
    explanation: "sin 130° = sin(180° − 50°) = sin 50°. Mit A = ½ · a · b · sin γ sind beide Flächeninhalte gleich, etwa 7,66 cm².",
  },
  lab: {
    kind: "triangle-area",
    title: "Labor: Ein Winkel, zwei Flächen",
    intro:
      "Ziehe die Ecke A oder den Punkt auf dem Graphen. Die Seiten a und b bleiben fest, nur der eingeschlossene Winkel γ ändert sich. Gestrichelt siehst du das Dreieck mit dem Winkel 180° − γ.",
    params: [
      { type: "range", key: "a", label: "Seite a = BC", unit: "cm", min: 2, max: 8, step: 0.5, value: 4, digits: 1 },
      { type: "range", key: "b", label: "Seite b = AC", unit: "cm", min: 2, max: 8, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "gamma", label: "eingeschlossener Winkel γ", unit: "°", min: 5, max: 175, step: 1, value: 60 },
    ],
    readouts: [
      { key: "A", label: "Flächeninhalt A = ½ · a · b · sin γ", unit: "cm²", digits: 2, emphasis: true, compute: (v) => 0.5 * v.a * v.b * sinD(v.gamma) },
      { key: "h", label: "Höhe auf a: h = b · sin γ", unit: "cm", digits: 2, compute: (v) => v.b * sinD(v.gamma) },
      { key: "max", label: "größter Flächeninhalt ½ · a · b", unit: "cm²", digits: 2, compute: (v) => 0.5 * v.a * v.b },
      { key: "twin", label: "gleicher Flächeninhalt bei 180° − γ", unit: "°", digits: 0, compute: (v) => 180 - v.gamma },
    ],
    goals: [
      {
        id: "max",
        text: "Mache den Flächeninhalt bei a = 6 cm und b = 5 cm so groß wie möglich.",
        check: (v) => v.a === 6 && v.b === 5 && v.gamma === 90,
      },
      {
        id: "gleich",
        text: "Stelle bei a = 6 cm und b = 5 cm den stumpfen Winkel ein, der denselben Flächeninhalt liefert wie γ = 40°.",
        check: (v) => v.a === 6 && v.b === 5 && v.gamma === 140,
      },
      {
        id: "zwanzig",
        text: "Stelle mit a = 8 cm und b = 6 cm einen Flächeninhalt von 20 cm² mit stumpfem γ ein (±0,15 cm²).",
        check: (v) => v.a === 8 && v.b === 6 && v.gamma > 90 && within(0.5 * v.a * v.b * sinD(v.gamma), 20, 0.15),
      },
    ],
  },
  exercises: [
    {
      id: "flaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(3, 12, 0.5);
          const b = rng.stepped(3, 12, 0.5);
          const gamma = rng.int(20, 160);
          const h = b * sinD(gamma);
          const area = 0.5 * a * h;
          return {
            prompt: `Im Dreieck ABC sind a = ${fmt(a, 1)} cm, b = ${fmt(b, 1)} cm und der eingeschlossene Winkel γ = ${gamma}° gegeben. Berechne den Flächeninhalt.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `γ = ${gamma}°`],
            formulaHint: "A = ½ · a · b · sin γ",
            fields: [numberField("A =", area, "cm²", 2, { slips: areaSlips(a, b, gamma) })],
            steps: [
              `Die Höhe auf a ist h = b · sin γ = ${fmt(b, 1)} cm · sin ${gamma}° ≈ ${cm(h)}.`,
              `A = ½ · a · h = ½ · ${fmt(a, 1)} · ${fmt(b, 1)} · sin ${gamma}° ≈ <strong>${fmtUnit(area, "cm²")}</strong>`,
            ],
            meta: { a, b, gamma },
          };
        }
        if (rng.next() < 0.5) {
          const p = rng.int(25, 60);
          const q = rng.int(20, 50);
          const gamma = rng.int(40, 140);
          const price = rng.pick([120, 150, 180, 220, 250, 280]);
          const area = 0.5 * p * q * sinD(gamma);
          return {
            prompt: `Ein dreieckiges Baugrundstück hat zwei Grenzen von ${p} m und ${q} m Länge, die an einer Ecke einen Winkel von ${gamma}° einschließen. Der Quadratmeter kostet ${price} €. Wie groß ist das Grundstück, und was kostet es?`,
            given: [`Grenzen ${p} m und ${q} m`, `eingeschlossener Winkel ${gamma}°`, `${price} € pro m²`],
            fields: [numberField("A =", area, "m²", 2, { slips: areaSlips(p, q, gamma) }), numberField("Preis =", area * price, "€", 0)],
            steps: [
              `A = ½ · ${p} m · ${q} m · sin ${gamma}° ≈ ${fmtUnit(area, "m²")}`,
              `Preis ≈ ${fmt(area, 2)} m² · ${price} € pro m² ≈ ${fmtUnit(area * price, "€", 0)}`,
              `<strong>A ≈ ${fmtUnit(area, "m²")}, Preis ≈ ${fmtUnit(area * price, "€", 0)}</strong>`,
            ],
            meta: { p, q, gamma, price, scenario: 0 },
          };
        }
        const c = rng.stepped(2.5, 5, 0.1);
        const alpha = rng.int(80, 90);
        const beta = rng.int(50, 65);
        const gamma = 180 - alpha - beta;
        const luff = (c * sinD(beta)) / sinD(gamma);
        const area = 0.5 * c * luff * sinD(alpha);
        return {
          prompt: `Ein dreieckiges Segel ist unten an einem ${fmt(c, 1)} m langen Baum befestigt. Am Mast schließen der Baum und die vordere Kante des Segels einen Winkel von ${alpha}° ein, am anderen Ende des Baums treffen sich Baum und hintere Kante unter ${beta}°. Wie lang ist die vordere Kante am Mast, und wie groß ist die Segelfläche?`,
          given: [`Baum ${fmtUnit(c, "m", 1)}`, `Winkel am Mast ${alpha}°`, `Winkel am Ende des Baums ${beta}°`],
          fields: [
            numberField("vordere Kante =", luff, "m", 2, {
              slips: [{ value: (c * sinD(gamma)) / sinD(beta), hint: "Der Bruch steht auf dem Kopf: Die vordere Kante liegt dem Winkel am Ende des Baums gegenüber." }],
            }),
            numberField("A =", area, "m²", 2, { slips: [{ value: c * luff * sinD(alpha), hint: "Der Faktor ½ fehlt." }] }),
          ],
          steps: [
            `Der dritte Winkel, oben am Mast, misst 180° − ${alpha}° − ${beta}° = ${gamma}° und liegt dem Baum gegenüber.`,
            `Sinussatz: vordere Kante = ${fmt(c, 1)} m · sin ${beta}° : sin ${gamma}° ≈ ${fmtUnit(luff, "m")}`,
            `A = ½ · Baum · vordere Kante · sin(Winkel am Mast) = ½ · ${fmt(c, 1)} · ${fmt(luff, 2)} · sin ${alpha}° ≈ ${fmtUnit(area, "m²")}`,
            `<strong>vordere Kante ≈ ${fmtUnit(luff, "m")}, A ≈ ${fmtUnit(area, "m²")}</strong>`,
          ],
          meta: { c, alpha, beta, scenario: 1 },
        };
      },
    },
    {
      id: "winkel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(4, 12, 0.5);
          const b = rng.stepped(4, 12, 0.5);
          const area = Math.round(0.5 * a * b * rng.stepped(0.25, 0.9, 0.05) * 10) / 10;
          const s = (2 * area) / (a * b);
          const g1 = asinD(s);
          const g2 = 180 - g1;
          return {
            prompt: `Ein Dreieck hat die Seiten a = ${fmt(a, 1)} cm und b = ${fmt(b, 1)} cm und den Flächeninhalt A = ${fmt(area, 1)} cm². Berechne beide möglichen Maße des Winkels γ, den a und b einschließen.`,
            given: [`a = ${cm(a, 1)}`, `b = ${cm(b, 1)}`, `A = ${fmtUnit(area, "cm²", 1)}`],
            formulaHint: `sin γ = ${frac("2A", "a · b")}; γ₂ = 180° − γ₁`,
            fields: [
              numberField("γ₁ =", g1, "°", 2, { slips: reverseSlips(area, a, b) }),
              numberField("γ₂ =", g2, "°", 2, { slips: reverseSlips(area, a, b) }),
            ],
            anyOrder: [0, 1],
            steps: [
              `A = ½ · a · b · sin γ, also sin γ = 2 · ${fmt(area, 1)} : (${fmt(a, 1)} · ${fmt(b, 1)}) ≈ ${fmt(s, 4)}`,
              `γ₁ = sin⁻¹(${fmt(s, 4)}) ≈ ${deg(g1)}; wegen sin(180° − γ) = sin γ auch γ₂ = 180° − γ₁ ≈ ${deg(g2)}`,
              `<strong>γ₁ ≈ ${deg(g1)} oder γ₂ ≈ ${deg(g2)}</strong>`,
            ],
            meta: { a, b, area },
          };
        }
        const p = rng.stepped(5, 10, 0.5);
        const q = rng.stepped(3, p - 1, 0.5);
        const area = Math.round(0.5 * p * q * rng.stepped(0.35, 0.85, 0.05) * 2) / 2;
        const s = (2 * area) / (p * q);
        const g1 = asinD(s);
        const g2 = 180 - g1;
        const c1 = Math.sqrt(p * p + q * q - 2 * p * q * cosD(g1));
        const c2 = Math.sqrt(p * p + q * q - 2 * p * q * cosD(g2));
        return {
          prompt: `Zwei Leisten von ${fmt(p, 1)} cm und ${fmt(q, 1)} cm Länge sind an einem Ende durch ein Gelenk verbunden. Mit einer dritten Leiste soll daraus ein Dreieck mit dem Flächeninhalt ${fmt(area, 1)} cm² werden. Welche beiden Winkel sind am Gelenk möglich, und wie lang muss die dritte Leiste jeweils sein?`,
          given: [`Leisten ${cm(p, 1)} und ${cm(q, 1)}`, `A = ${fmtUnit(area, "cm²", 1)}`],
          fields: [
            numberField("spitzer Winkel γ₁ =", g1, "°", 2, { slips: reverseSlips(area, p, q) }),
            numberField("stumpfer Winkel γ₂ =", g2, "°", 2),
            numberField("dritte Leiste bei γ₁:", c1, "cm", 2),
            numberField("dritte Leiste bei γ₂:", c2, "cm", 2),
          ],
          steps: [
            `sin γ = 2A : (a · b) = ${fmt(2 * area, 1)} : ${fmt(p * q, 2)} ≈ ${fmt(s, 4)}, also γ₁ ≈ ${deg(g1)} und γ₂ = 180° − γ₁ ≈ ${deg(g2)}`,
            `Kosinussatz für γ₁: c₁² = ${fmt(p, 1)}² + ${fmt(q, 1)}² − 2 · ${fmt(p, 1)} · ${fmt(q, 1)} · cos ${deg(g1)} ≈ ${fmt(c1 * c1, 2)}`,
            `Für γ₂ ist cos γ₂ = −cos γ₁: c₂² ≈ ${fmt(p * p + q * q, 2)} + ${fmt(2 * p * q * cosD(g1), 2)} = ${fmt(c2 * c2, 2)}`,
            `<strong>γ₁ ≈ ${deg(g1)} mit ${cm(c1)}, γ₂ ≈ ${deg(g2)} mit ${cm(c2)}</strong>`,
          ],
          meta: { p, q, area },
        };
      },
    },
    {
      id: "seite",
      make: (rng, level): ExerciseTask => {
        const b = level === 1 ? rng.stepped(3, 10, 0.5) : rng.stepped(3, 5, 0.5);
        const gamma = level === 1 ? rng.int(25, 155) : rng.int(60, 110);
        const target = level === 1 ? rng.stepped(3, 12, 0.5) : rng.stepped(2.5, 6, 0.5);
        // A rounded value near the area of the target triangle, so the side comes out near the target.
        const area = level === 1 ? Math.round(5 * target * b * sinD(gamma)) / 10 : Math.round(target * b * sinD(gamma)) / 2;
        const a = (2 * area) / (b * sinD(gamma));
        const slips: Slip[] = [
          { value: area / (b * sinD(gamma)), hint: "Der Faktor 2 fehlt: Aus A = ½ · a · b · sin γ folgt a = 2A : (b · sin γ)." },
          { value: (2 * area) / (b * Math.sin(gamma)), hint: RAD_HINT },
          { value: (2 * area) / (b * cosD(gamma)), hint: "Im Flächensatz steht der Sinus des eingeschlossenen Winkels, nicht der Kosinus." },
        ];
        if (level === 1) {
          return {
            prompt: `Ein Dreieck hat den Flächeninhalt A = ${fmt(area, 1)} cm². Die Seite b ist ${fmt(b, 1)} cm lang und schließt mit der Seite a den Winkel γ = ${gamma}° ein. Berechne a.`,
            given: [`A = ${fmtUnit(area, "cm²", 1)}`, `b = ${cm(b, 1)}`, `γ = ${gamma}°`],
            formulaHint: `a = ${frac("2A", "b · sin γ")}`,
            fields: [numberField("a =", a, "cm", 2, { slips })],
            steps: [
              "A = ½ · a · b · sin γ nach a umstellen: a = 2A : (b · sin γ)",
              `a = 2 · ${fmt(area, 1)} : (${fmt(b, 1)} · sin ${gamma}°) ≈ ${fmt(2 * area, 1)} : ${fmt(b * sinD(gamma), 4)} ≈ <strong>${cm(a)}</strong>`,
            ],
            meta: { area, b, gamma },
          };
        }
        return {
          prompt: `Ein dreieckiges Sonnensegel soll ${fmt(area, 1)} m² groß werden. Zwei seiner Kanten treffen sich an einem Mast unter einem Winkel von ${gamma}°; die eine ist ${fmt(b, 1)} m lang. Wie lang muss die andere Kante sein?`,
          given: [`A = ${fmtUnit(area, "m²", 1)}`, `eine Kante ${fmtUnit(b, "m", 1)}`, `Winkel zwischen den Kanten ${gamma}°`],
          fields: [numberField("andere Kante =", a, "m", 2, { slips })],
          steps: [
            `Die beiden Kanten schließen den Winkel ${gamma}° ein: ${fmt(area, 1)} m² = ½ · a · ${fmt(b, 1)} m · sin ${gamma}°.`,
            `a = 2A : (b · sin γ) = ${fmt(2 * area, 1)} : (${fmt(b, 1)} · sin ${gamma}°) ≈ <strong>${fmtUnit(a, "m")}</strong>`,
          ],
          meta: { area, b, gamma },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du berechnest Dreiecksflächen mit dem Sinus und findest zu einem Flächeninhalt beide passenden Winkel.",
};

// 2.4 Berechnungen in Ebene und Raum ─────────────────────────────────────────

interface Quad {
  ab: number;
  ad: number;
  alpha: number;
  bc: number;
  eps: number;
}

/** The quadrilateral ABCD split by [BD]: the diagonal, CD, and its angles at B, C and D. */
export function quadParts(q: Quad): { bd: number; cd: number; atB: number; atC: number; atD: number } {
  const bd = Math.sqrt(q.ab ** 2 + q.ad ** 2 - 2 * q.ab * q.ad * cosD(q.alpha));
  const abd = acosD((q.ab ** 2 + bd ** 2 - q.ad ** 2) / (2 * q.ab * bd));
  const cd = Math.sqrt(bd ** 2 + q.bc ** 2 - 2 * bd * q.bc * cosD(q.eps));
  const bdc = acosD((bd ** 2 + cd ** 2 - q.bc ** 2) / (2 * bd * cd));
  return { bd, cd, atB: abd + q.eps, atC: 180 - q.eps - bdc, atD: 180 - q.alpha - abd + bdc };
}

/** A convex quadrilateral with every angle between 25° and 165°, sides scaled by `scale`. */
function drawQuad(rng: Rng, scale: number): Quad {
  return draw(
    () => ({
      ab: rng.stepped(5, 10, 0.5) * scale,
      ad: rng.stepped(4, 9, 0.5) * scale,
      alpha: rng.int(60, 110),
      bc: rng.stepped(4, 9, 0.5) * scale,
      eps: rng.int(40, 80),
    }),
    (q) => {
      const { atB, atC, atD } = quadParts(q);
      return [atB, atC, atD].every((angle) => angle >= 25 && angle <= 165);
    },
    { ab: 7 * scale, ad: 5 * scale, alpha: 80, bc: 6 * scale, eps: 60 },
  );
}

/** A family ABₙCₙ: one side shrinks by x, the other grows by k · x, the angle at A stays. */
export interface FamilyTask {
  c: number;
  b: number;
  alpha: number;
  k: number;
  shrinkAB: boolean;
}

export function familyTerms(t: FamilyTask) {
  const ab = (x: number) => (t.shrinkAB ? t.c - x : t.c + t.k * x);
  const ac = (x: number) => (t.shrinkAB ? t.b + t.k * x : t.b - x);
  // Both factors vanish once: x = c and x = −b : k, or x = b and x = −c : k.
  const zeros = t.shrinkAB ? [t.c, -t.b / t.k] : [t.b, -t.c / t.k];
  const xmax = (zeros[0] + zeros[1]) / 2;
  const area = (x: number) => 0.5 * ab(x) * ac(x) * sinD(t.alpha);
  const bc = (x: number) => Math.sqrt(ab(x) ** 2 + ac(x) ** 2 - 2 * ab(x) * ac(x) * cosD(t.alpha));
  return { ab, ac, zeros, xmax, upper: zeros[0], area, bc };
}

function drawFamily(rng: Rng): FamilyTask {
  const long = rng.pick([8, 9, 10, 12]);
  const short = rng.pick([2, 3, 4, 5, 6]);
  const k = rng.pick([1, 2]);
  const alpha = rng.pick([30, 40, 45, 50, 60, 70, 75, 80]);
  const shrinkAB = rng.next() < 0.5;
  return { c: shrinkAB ? long : short, b: shrinkAB ? short : long, alpha, k, shrinkAB };
}

function familyWords(t: FamilyTask): { shrink: string; grow: string; ab: string; ac: string } {
  const kx = t.k === 1 ? "x" : `${t.k}x`;
  return t.shrinkAB
    ? { shrink: "Verkürzt man [AB] von B aus um x cm", grow: `verlängert [AC] über C hinaus um ${kx} cm`, ab: `${t.c} − x`, ac: `${t.b} + ${kx}` }
    : { shrink: "Verkürzt man [AC] von C aus um x cm", grow: `verlängert [AB] über B hinaus um ${kx} cm`, ab: `${t.c} + ${kx}`, ac: `${t.b} − x` };
}

const FAMILY_TABLE = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const ebeneRaum: Lesson = {
  id: "dr-4-ebene-raum",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "2.4 Berechnungen in Ebene und Raum",
  subtitle: "Geeignete Dreiecke finden, auch wenn sich die Figur mit x ändert",
  tracks: ["I", "II_III"],
  lehrplan: `${LEHRPLAN}, ebene und räumliche Geometrie, funktionale Abhängigkeiten`,
  whyItMatters:
    "Vierecke, Deiche, Dächer und Pyramiden bestehen aus Dreiecken. Wer das richtige Dreieck findet, berechnet jede Strecke, jeden Winkel und sogar, wann eine Fläche am größten wird.",
  explanationHtml: `
    <p>Viele Figuren und Körper lassen sich in Dreiecke zerlegen. Entscheidend ist, <strong>geeignete Dreiecke</strong> zu finden, in denen genug bekannt ist.</p>
    <ul>
      <li><strong>Vierecke:</strong> Eine Diagonale teilt das Viereck in zwei Dreiecke. Im ersten (zum Beispiel SWS) liefert der Kosinussatz die Diagonale, mit ihr rechnest du im zweiten weiter. Der Flächeninhalt ist die Summe der beiden Dreiecksflächen.</li>
      <li><strong>Trapeze und Parallelogramme:</strong> Die Höhe steckt im rechtwinkligen Dreieck an der Schrägseite: h = AD · sin α.</li>
      <li><strong>Vermessung:</strong> Eine messbare Standlinie und zwei Winkel liefern mit dem Sinussatz Entfernungen zu Punkten, die man nicht erreicht.</li>
      <li><strong>Pyramide und Kegel:</strong> Höhe, halbe Diagonale der Grundfläche und Seitenkante bilden ein rechtwinkliges Dreieck; beim Kegel sind es Höhe, Radius und Mantellinie. Der Winkel ε zwischen Seitenkante und Grundfläche liegt darin: tan ε = h : (½ · d).</li>
    </ul>
    <div class="example">Beispiel: Eine quadratische Pyramide hat die Grundkante 6 cm und die Höhe 8 cm. Die halbe Diagonale ist ½ · 6 · √2 cm = 3√2 cm ≈ 4,24 cm. Also ist tan ε = 8 : 4,24, ε ≈ ${deg(atanD(8 / (3 * Math.SQRT2)))}, und die Seitenkante ist ${sqrtHtml("8² + 18")} cm = ${sqrtHtml("82")} cm ≈ ${cm(Math.sqrt(82))}.</div>
    <p><strong>Funktionale Abhängigkeit:</strong> In Prüfungsaufgaben ändert sich eine Figur mit einer Länge x. Im Dreieck ABC sind AB = 9 cm, AC = 3 cm und ∢BAC = 60°. Verkürzt man [AB] von B aus um x cm und verlängert [AC] über C hinaus um 2x cm, entstehen Dreiecke ABₙCₙ. Der Winkel bei A bleibt fest, deshalb gilt</p>
    <p class="formula-line">A(x) = ½ · (9 − x) · (3 + 2x) · sin 60° cm² mit 0 &lt; x &lt; 9</p>
    <table class="mini">
      <tr><th>x</th>${FAMILY_TABLE.map((x) => `<th>${x}</th>`).join("")}</tr>
      <tr><td>A(x) in cm²</td>${FAMILY_TABLE.map((x) => `<td>${fmt(familyAt(x).area, 2)}</td>`).join("")}</tr>
    </table>
    <p>A(x) wird null für x = 9 und für x = −1,5. Der Graph ist eine nach unten geöffnete Parabel, und ihr Scheitel liegt in der Mitte zwischen diesen Nullstellen: x = (9 − 1,5) : 2 = 3,75. Dort ist der Flächeninhalt am größten, A<sub>max</sub> = A(3,75) ≈ ${fmtUnit(familyAt(3.75).area, "cm²")}. Auch Längen hängen von x ab; [BₙCₙ] berechnest du mit dem Kosinussatz.</p>
    <div class="merke"><strong>Merke:</strong> Skizze zeichnen, ein Dreieck mit genug bekannten Stücken suchen, dann Pythagoras, Sinussatz, Kosinussatz oder A = ½ · a · b · sin γ anwenden. Bei einer Abhängigkeit von x: Längen als Terme in x schreiben, den Bereich für x angeben, den Extremwert am Scheitel ablesen.</div>
  `,
  formulas: [
    { name: "Neigung der Seitenkante", html: "tan ε = h : (½ · d)", quantities: "h Höhe, d Diagonale der Grundfläche; beim Kegel tan ε = h : r" },
    { name: "Dreiecksschar", html: "A(x) = ½ · AB<sub>n</sub>(x) · AC<sub>n</sub>(x) · sin α", quantities: "α ist der feste Winkel zwischen den beiden Seiten" },
    { name: "Extremwert", html: "x<sub>S</sub> = (x₁ + x₂) : 2", quantities: "Scheitel in der Mitte der Nullstellen x₁, x₂ des Flächenterms" },
  ],
  quiz: {
    question:
      "Eine quadratische Pyramide ABCDS hat die Spitze S über dem Mittelpunkt M der Grundfläche. In welchem rechtwinkligen Dreieck liegt der Winkel zwischen der Seitenkante [AS] und der Grundfläche?",
    options: [
      "im Dreieck aus Höhe, halber Grundkante und Seitenhöhe",
      "im Dreieck AMS aus Höhe, halber Diagonale und Seitenkante",
      "im Dreieck ABC aus zwei Grundkanten und der Diagonale",
    ],
    correctIndex: 1,
    explanation: "Die Seitenkante [AS] steht schräg über der halben Diagonale [AM]. Das Dreieck AMS hat bei M einen rechten Winkel, und der gesuchte Winkel liegt bei A: tan ε = MS : AM.",
  },
  lab: {
    kind: "triangle-family",
    title: "Labor: Die Dreiecksschar ABₙCₙ",
    intro:
      "Ziehe Bₙ, Cₙ oder den Punkt auf dem Graphen. Bₙ rückt um x cm auf A zu, Cₙ wandert um 2x cm von C weg; der Winkel bei A bleibt 60°. Rechts siehst du, wie der Flächeninhalt oder die Länge [BₙCₙ] von x abhängt.",
    params: [
      { type: "range", key: "x", label: "x (in cm)", unit: "", min: 0, max: 9, step: 0.05, value: 1, digits: 2 },
      {
        type: "choice",
        key: "graph",
        label: "Graph",
        options: [
          { value: 0, label: "Flächeninhalt A(x)" },
          { value: 1, label: "Länge BₙCₙ(x)" },
        ],
        value: 0,
      },
    ],
    readouts: [
      { key: "ab", label: "ABₙ = (9 − x) cm", unit: "cm", digits: 2, compute: (v) => familyAt(v.x).ab },
      { key: "ac", label: "ACₙ = (3 + 2x) cm", unit: "cm", digits: 2, compute: (v) => familyAt(v.x).ac },
      { key: "area", label: "Flächeninhalt A(x)", unit: "cm²", digits: 2, emphasis: true, compute: (v) => familyAt(v.x).area },
      { key: "bc", label: "Länge BₙCₙ(x)", unit: "cm", digits: 2, compute: (v) => familyAt(v.x).bc },
    ],
    goals: [
      { id: "max", text: "Finde das Dreieck ABₙCₙ mit dem größten Flächeninhalt.", check: (v) => v.x === 3.75 },
      { id: "kurz", text: "Finde das Dreieck, in dem die Seite [BₙCₙ] am kürzesten ist.", check: (v) => v.x === 1.5 },
      {
        id: "gleich",
        text: "Finde ein x > 0, für das das Dreieck ABₙCₙ genau so groß ist wie das Dreieck ABC mit x = 0.",
        check: (v) => v.x === 7.5,
      },
    ],
  },
  exercises: [
    {
      id: "viereck",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const q = drawQuad(rng, 1);
          const { bd } = quadParts(q);
          const a1 = 0.5 * q.ab * q.ad * sinD(q.alpha);
          const a2 = 0.5 * bd * q.bc * sinD(q.eps);
          return {
            prompt: `Im Viereck ABCD sind AB = ${fmt(q.ab, 1)} cm, AD = ${fmt(q.ad, 1)} cm, ∢DAB = ${q.alpha}°, BC = ${fmt(q.bc, 1)} cm und ∢DBC = ${q.eps}°. Die Diagonale [BD] zerlegt es in die Dreiecke ABD und BCD. Berechne die Länge von [BD] und den Flächeninhalt des Vierecks.`,
            given: [`AB = ${cm(q.ab, 1)}, AD = ${cm(q.ad, 1)}, ∢DAB = ${q.alpha}°`, `BC = ${cm(q.bc, 1)}, ∢DBC = ${q.eps}°`],
            formulaHint: "BD² = AB² + AD² − 2 · AB · AD · cos ∢DAB; A = ½ · AB · AD · sin ∢DAB + ½ · BD · BC · sin ∢DBC",
            fields: [
              numberField("BD =", bd, "cm", 2, { slips: cosineSlips(q.ab, q.ad, q.alpha) }),
              numberField("A =", a1 + a2, "cm²", 2, {
                slips: [
                  { value: a1, hint: "Das ist nur das Dreieck ABD. Addiere den Flächeninhalt des Dreiecks BCD." },
                  { value: a2, hint: "Das ist nur das Dreieck BCD. Addiere den Flächeninhalt des Dreiecks ABD." },
                ],
              }),
            ],
            steps: [
              `Dreieck ABD (zwei Seiten und der eingeschlossene Winkel): BD² = ${fmt(q.ab ** 2, 2)} + ${fmt(q.ad ** 2, 2)} − 2 · ${fmt(q.ab, 1)} · ${fmt(q.ad, 1)} · cos ${q.alpha}° ≈ ${fmt(bd * bd, 2)}, BD ≈ ${cm(bd)}`,
              `A(ABD) = ½ · ${fmt(q.ab, 1)} · ${fmt(q.ad, 1)} · sin ${q.alpha}° ≈ ${fmtUnit(a1, "cm²")}`,
              `A(BCD) = ½ · BD · BC · sin ∢DBC ≈ ½ · ${fmt(bd, 2)} · ${fmt(q.bc, 1)} · sin ${q.eps}° ≈ ${fmtUnit(a2, "cm²")}`,
              `<strong>BD ≈ ${cm(bd)}, A ≈ ${fmtUnit(a1 + a2, "cm²")}</strong>`,
            ],
            meta: { ...q, scenario: 0 },
          };
        }
        if (rng.next() < 0.5) {
          const q = drawQuad(rng, 6);
          const { bd, cd } = quadParts(q);
          const a1 = 0.5 * q.ab * q.ad * sinD(q.alpha);
          const a2 = 0.5 * bd * q.bc * sinD(q.eps);
          return {
            prompt: `Ein Grundstück ABCD wird vermessen: AB = ${q.ab} m, AD = ${q.ad} m, ∢DAB = ${q.alpha}°, BC = ${q.bc} m, und von B aus sieht man D und C unter dem Winkel ∢DBC = ${q.eps}°. Wie lang ist die Diagonale [BD], wie lang die Grenze [CD], und wie groß ist das Grundstück?`,
            given: [`AB = ${q.ab} m, AD = ${q.ad} m, ∢DAB = ${q.alpha}°`, `BC = ${q.bc} m, ∢DBC = ${q.eps}°`],
            fields: [
              numberField("BD =", bd, "m", 2, { slips: cosineSlips(q.ab, q.ad, q.alpha) }),
              numberField("CD =", cd, "m", 2, { slips: cosineSlips(bd, q.bc, q.eps) }),
              numberField("A =", a1 + a2, "m²", 2, { slips: [{ value: a1, hint: "Das ist nur das Dreieck ABD; das Dreieck BCD gehört dazu." }] }),
            ],
            steps: [
              "Die Diagonale [BD] zerlegt das Grundstück in die Dreiecke ABD und BCD.",
              `Dreieck ABD: BD² = ${q.ab}² + ${q.ad}² − 2 · ${q.ab} · ${q.ad} · cos ${q.alpha}° ≈ ${fmt(bd * bd, 2)}, BD ≈ ${fmtUnit(bd, "m")}`,
              `Dreieck BCD: CD² = BD² + BC² − 2 · BD · BC · cos ${q.eps}° ≈ ${fmt(cd * cd, 2)}, CD ≈ ${fmtUnit(cd, "m")}`,
              `A = ½ · ${q.ab} · ${q.ad} · sin ${q.alpha}° + ½ · ${fmt(bd, 2)} · ${q.bc} · sin ${q.eps}° ≈ ${fmt(a1, 2)} m² + ${fmt(a2, 2)} m²`,
              `<strong>BD ≈ ${fmtUnit(bd, "m")}, CD ≈ ${fmtUnit(cd, "m")}, A ≈ ${fmtUnit(a1 + a2, "m²")}</strong>`,
            ],
            meta: { ...q, scenario: 1 },
          };
        }
        const top = rng.pick([3, 4, 5, 6]);
        const h = rng.stepped(3, 8, 0.5);
        const wet = rng.int(18, 30);
        const dry = rng.int(32, 50);
        const wx = h / tanD(wet);
        const dx = h / tanD(dry);
        const bottom = top + wx + dx;
        const area = 0.5 * (top + bottom) * h;
        return {
          prompt: `Der Querschnitt eines Deichs ist ein Trapez. Die Krone oben ist ${top} m breit, der Deich ist ${fmt(h, 1)} m hoch. Die Böschung zur Wasserseite ist um ${wet}° gegen die Waagrechte geneigt, die zur Landseite um ${dry}°. Wie breit ist der Deich unten (Sohle), und wie groß ist die Querschnittsfläche?`,
          given: [`Krone ${top} m`, `Höhe ${fmtUnit(h, "m", 1)}`, `Böschungswinkel ${wet}° und ${dry}°`],
          fields: [
            numberField("Sohle =", bottom, "m", 2, {
              slips: [
                { value: top + h * tanD(wet) + h * tanD(dry), hint: "Der waagrechte Teil der Böschung ist die Ankathete: x = h : tan α, nicht h · tan α." },
                { value: top + h / Math.tan(wet) + h / Math.tan(dry), hint: RAD_HINT },
              ],
            }),
            numberField("A =", area, "m²", 2, { slips: [{ value: bottom * h, hint: "Ein Trapez ist kein Rechteck: A = ½ · (Krone + Sohle) · h." }] }),
          ],
          steps: [
            `An beiden Seiten entsteht ein rechtwinkliges Dreieck: Die Höhe ${fmt(h, 1)} m ist die Gegenkathete des Böschungswinkels, der waagrechte Teil die Ankathete.`,
            `Wasserseite: x₁ = ${fmt(h, 1)} m : tan ${wet}° ≈ ${fmtUnit(wx, "m")}; Landseite: x₂ = ${fmt(h, 1)} m : tan ${dry}° ≈ ${fmtUnit(dx, "m")}`,
            `Sohle = ${top} m + x₁ + x₂ ≈ ${fmtUnit(bottom, "m")}; A = ½ · (${top} m + ${fmt(bottom, 2)} m) · ${fmt(h, 1)} m ≈ ${fmtUnit(area, "m²")}`,
            `<strong>Sohle ≈ ${fmtUnit(bottom, "m")}, A ≈ ${fmtUnit(area, "m²")}</strong>`,
          ],
          meta: { top, h, wet, dry, scenario: 2 },
        };
      },
    },
    {
      id: "raum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(4, 10, 0.5);
          const h = rng.stepped(4, 12, 0.5);
          const am = (a * Math.SQRT2) / 2;
          const edge = Math.hypot(h, am);
          const eps = atanD(h / am);
          return {
            prompt: `Eine quadratische Pyramide ABCDS hat die Grundkante a = ${fmt(a, 1)} cm und die Höhe h = ${fmt(h, 1)} cm; M ist der Schnittpunkt der Diagonalen der Grundfläche, die Spitze S liegt genau über M. Berechne die Länge der Seitenkante [AS] und das Maß des Winkels ε = ∢SAM zwischen Seitenkante und Grundfläche.`,
            given: [`a = ${cm(a, 1)}`, `h = MS = ${cm(h, 1)}`],
            formulaHint: `AM = ½ · a · √2; AS = ${sqrtHtml("h² + AM²")}; tan ε = h : AM`,
            fields: [
              numberField("AS =", edge, "cm", 2, {
                slips: [{ value: Math.hypot(h, a / 2), hint: "Das ist die Seitenhöhe zur Mitte einer Grundkante. Die Seitenkante endet in der Ecke A: Im Dreieck AMS ist AM die halbe Diagonale." }],
              }),
              numberField("ε =", eps, "°", 2, {
                slips: [
                  { value: atanD(h / (a / 2)), hint: "Das ist der Neigungswinkel der Seitenfläche. Zur Seitenkante gehört die halbe Diagonale AM." },
                  { value: Math.atan(h / am), hint: RAD_HINT },
                ],
              }),
            ],
            steps: [
              `Das Dreieck AMS hat bei M einen rechten Winkel. AM ist die halbe Diagonale: AM = ½ · ${fmt(a, 1)} cm · √2 ≈ ${cm(am)}.`,
              `AS = ${sqrtHtml(`${fmt(h, 1)}² + ${fmt(am, 2)}²`)} cm ≈ ${cm(edge)}`,
              `tan ε = MS : AM = ${fmt(h, 1)} : ${fmt(am, 2)} ≈ ${fmt(h / am, 4)}, also ε ≈ ${deg(eps)}`,
              `<strong>AS ≈ ${cm(edge)}, ε ≈ ${deg(eps)}</strong>`,
            ],
            meta: { a, h, scenario: 0 },
          };
        }
        if (rng.next() < 0.5) {
          const a = rng.pick([4, 5, 6, 7, 8]);
          const s = rng.pick([10, 11, 12, 13, 14, 15, 16]);
          const am = (a * Math.SQRT2) / 2;
          const h = Math.sqrt(s * s - am * am);
          const eps = acosD(am / s);
          return {
            prompt: `Ein Kirchturmdach hat die Form einer quadratischen Pyramide mit der Grundkante ${a} m. Die vier Dachkanten, also die Seitenkanten, sind je ${s} m lang. Wie hoch ist das Dach, und welchen Winkel bilden die Dachkanten mit dem waagrechten Dachboden?`,
            given: [`Grundkante ${a} m`, `Seitenkante ${s} m`],
            fields: [
              numberField("Höhe =", h, "m", 2, {
                slips: [{ value: Math.sqrt(s * s - (a / 2) ** 2), hint: "Unter der Dachkante liegt die halbe Diagonale ½ · a · √2, nicht die halbe Grundkante." }],
              }),
              numberField("Winkel =", eps, "°", 2, {
                slips: [{ value: 90 - eps, hint: "Das ist der Winkel zwischen Dachkante und senkrechter Turmachse. Gesucht ist der Winkel zum Dachboden: cos ε = AM : AS." }],
              }),
            ],
            steps: [
              `Im Dreieck AMS mit dem rechten Winkel bei M ist die Dachkante AS = ${s} m die Hypotenuse und AM = ½ · ${a} m · √2 ≈ ${fmtUnit(am, "m")} die halbe Diagonale.`,
              `h = ${sqrtHtml(`${s}² − ${fmt(am, 2)}²`)} m ≈ ${fmtUnit(h, "m")}`,
              `cos ε = AM : AS = ${fmt(am, 2)} : ${s} ≈ ${fmt(am / s, 4)}, also ε ≈ ${deg(eps)}`,
              `<strong>Höhe ≈ ${fmtUnit(h, "m")}, Winkel ≈ ${deg(eps)}</strong>`,
            ],
            meta: { a, s, scenario: 1 },
          };
        }
        const d = rng.stepped(4, 9, 0.5);
        const angle = rng.int(28, 38);
        const r = d / 2;
        const h = r * tanD(angle);
        const slant = r / cosD(angle);
        return {
          prompt: `Ein kegelförmiger Kieshaufen hat am Boden einen Durchmesser von ${fmt(d, 1)} m. Kies rutscht ab, sobald die Böschung steiler als ${angle}° ist, und der Haufen ist genau so steil aufgeschüttet. Wie hoch ist der Haufen, und wie lang ist eine Mantellinie von der Spitze bis zum Boden?`,
          given: [`d = ${fmtUnit(d, "m", 1)}`, `Böschungswinkel ${angle}°`],
          fields: [
            numberField("Höhe =", h, "m", 2, {
              slips: [
                { value: d * tanD(angle), hint: "Im Schnitt durch die Spitze liegt unter der Mantellinie der Radius, also d : 2." },
                { value: r * sinD(angle), hint: "Der Radius ist die Ankathete des Böschungswinkels: h = r · tan α." },
              ],
            }),
            numberField("Mantellinie =", slant, "m", 2, { slips: [{ value: r * cosD(angle), hint: "Die Mantellinie ist die Hypotenuse: s = r : cos α." }] }),
          ],
          steps: [
            `Der Schnitt durch die Spitze zeigt ein rechtwinkliges Dreieck aus Radius r = ${fmtUnit(r, "m")}, Höhe h und Mantellinie s; der Böschungswinkel liegt am Boden.`,
            `h = r · tan ${angle}° ≈ ${fmtUnit(h, "m")}`,
            `s = r : cos ${angle}° ≈ ${fmtUnit(slant, "m")}`,
            `<strong>Höhe ≈ ${fmtUnit(h, "m")}, Mantellinie ≈ ${fmtUnit(slant, "m")}</strong>`,
          ],
          meta: { d, angle, scenario: 2 },
        };
      },
    },
    {
      id: "funktion",
      make: (rng, level): ExerciseTask => {
        const t = drawFamily(rng);
        const f = familyTerms(t);
        const words = familyWords(t);
        const xs = f.xmax;
        const vertex = `A(x) = 0 für x = ${fmt(f.zeros[0], 2)} und für x = ${fmt(f.zeros[1], 2)}. Der Graph ist eine nach unten geöffnete Parabel, ihr Scheitel liegt in der Mitte: x = (${fmt(f.zeros[0], 2)} − ${fmt(-f.zeros[1], 2)}) : 2 = ${fmt(xs, 2)}`;
        const xSlips: Slip[] = [{ value: f.upper / 2, hint: "Der Scheitel liegt in der Mitte zwischen beiden Nullstellen des Terms, auch der negativen." }];
        if (level === 1) {
          const x0 = rng.int(1, 3);
          return {
            prompt: `Im Dreieck ABC sind AB = ${t.c} cm, AC = ${t.b} cm und ∢BAC = ${t.alpha}°. ${words.shrink} und ${words.grow}, entstehen Dreiecke ABₙCₙ. Berechne den Flächeninhalt für x = ${x0}, dann den Wert von x, für den der Flächeninhalt am größten ist, und diesen größten Flächeninhalt.`,
            given: [`AB = ${t.c} cm, AC = ${t.b} cm, ∢BAC = ${t.alpha}°`, `ABₙ = (${words.ab}) cm, ACₙ = (${words.ac}) cm`],
            formulaHint: `A(x) = ½ · (${words.ab}) · (${words.ac}) · sin ${t.alpha}°; der Scheitel liegt in der Mitte der Nullstellen`,
            fields: [
              numberField(`A(${x0}) =`, f.area(x0), "cm²", 2, { slips: [{ value: 2 * f.area(x0), hint: "Der Faktor ½ fehlt." }] }),
              numberField("x =", xs, "", 2, { slips: xSlips }),
              numberField("A<sub>max</sub> =", f.area(xs), "cm²", 2),
            ],
            steps: [
              `ABₙ = (${words.ab}) cm, ACₙ = (${words.ac}) cm; der Winkel bei A bleibt ${t.alpha}°: A(x) = ½ · (${words.ab}) · (${words.ac}) · sin ${t.alpha}° cm²`,
              `A(${x0}) = ½ · ${fmt(f.ab(x0), 2)} · ${fmt(f.ac(x0), 2)} · sin ${t.alpha}° ≈ ${fmtUnit(f.area(x0), "cm²")}`,
              vertex,
              `<strong>A(${x0}) ≈ ${fmtUnit(f.area(x0), "cm²")}, x = ${fmt(xs, 2)}, A<sub>max</sub> = A(${fmt(xs, 2)}) ≈ ${fmtUnit(f.area(xs), "cm²")}</strong>`,
            ],
            meta: { c: t.c, b: t.b, alpha: t.alpha, k: t.k, shrinkAB: t.shrinkAB ? 1 : 0, x0 },
          };
        }
        const kx = t.k === 1 ? "x" : `${t.k}x`;
        const points = t.shrinkAB
          ? `Die Punkte Bₙ liegen auf [AB] mit BBₙ = x cm, die Punkte Cₙ auf der Verlängerung von [AC] über C hinaus mit CCₙ = ${kx} cm.`
          : `Die Punkte Cₙ liegen auf [AC] mit CCₙ = x cm, die Punkte Bₙ auf der Verlängerung von [AB] über B hinaus mit BBₙ = ${kx} cm.`;
        const ab = f.ab(xs);
        const ac = f.ac(xs);
        const d = f.bc(xs);
        return {
          prompt: `Gegeben ist das Dreieck ABC mit AB = ${t.c} cm, AC = ${t.b} cm und ∢BAC = ${t.alpha}°. ${points} So entstehen Dreiecke ABₙCₙ mit 0 &lt; x &lt; ${f.upper}. Für welchen Wert von x hat das Dreieck ABₙCₙ den größten Flächeninhalt? Berechne diesen Flächeninhalt und für dieses Dreieck die Länge der Seite [BₙCₙ].`,
          given: [`AB = ${t.c} cm, AC = ${t.b} cm, ∢BAC = ${t.alpha}°`, `0 &lt; x &lt; ${f.upper}`],
          fields: [
            numberField("x =", xs, "", 2, { slips: xSlips }),
            numberField("A<sub>max</sub> =", f.area(xs), "cm²", 2),
            numberField("BₙCₙ =", d, "cm", 2, { slips: cosineSlips(ab, ac, t.alpha) }),
          ],
          steps: [
            `ABₙ(x) = (${words.ab}) cm und ACₙ(x) = (${words.ac}) cm; der Winkel bei A bleibt ${t.alpha}°: A(x) = ½ · (${words.ab}) · (${words.ac}) · sin ${t.alpha}° cm²`,
            vertex,
            `A<sub>max</sub> = A(${fmt(xs, 2)}) = ½ · ${fmt(ab, 2)} · ${fmt(ac, 2)} · sin ${t.alpha}° ≈ ${fmtUnit(f.area(xs), "cm²")}`,
            `Kosinussatz: BₙCₙ² = ${fmt(ab, 2)}² + ${fmt(ac, 2)}² − 2 · ${fmt(ab, 2)} · ${fmt(ac, 2)} · cos ${t.alpha}° ≈ ${fmt(d * d, 2)}`,
            `<strong>x = ${fmt(xs, 2)}, A<sub>max</sub> ≈ ${fmtUnit(f.area(xs), "cm²")}, BₙCₙ ≈ ${cm(d)}</strong>`,
          ],
          meta: { c: t.c, b: t.b, alpha: t.alpha, k: t.k, shrinkAB: t.shrinkAB ? 1 : 0 },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du zerlegst Figuren und Körper in geeignete Dreiecke und findest den Extremwert einer Dreiecksschar.",
};

// 2.5 Trigonometrische Gleichungen und Trägergraphen ─────────────────────────

const TRIG_NAMES = ["sin", "cos", "tan"];
const EQUATION_HINTS = [
  "φ₁ = sin⁻¹ k, φ₂ = 180° − φ₁; einen negativen Winkel um 360° vergrößern",
  "φ₁ = cos⁻¹ k, φ₂ = 360° − φ₁",
  "φ₁ = tan⁻¹ k, φ₂ = φ₁ + 180°; einen negativen Winkel um 180° vergrößern",
];

function solutionsText(v: LabValues): string {
  const solutions = trigSolutions(v.eq, v.k, v.interval);
  if (solutions.length === 0) return "keine Lösung";
  const names = ["₁", "₂", "₃", "₄"];
  return solutions.map((phi, i) => `φ${names[i] ?? ""} ≈ ${deg(phi)}`).join(", ");
}

function equationSlips(type: number, k: number, base: number): Slip[] {
  const slips: Slip[] = [{ value: type === 0 ? Math.asin(k) : type === 1 ? Math.acos(k) : Math.atan(k), hint: RAD_HINT }];
  if (type === 0) {
    slips.push({ value: 360 - base, hint: "Beim Sinus ist die zweite Lösung 180° − φ₁; 360° − φ₁ gehört zum Kosinus." });
    if (k < 0) {
      slips.push(
        { value: base, hint: `Der Taschenrechner liefert ${deg(base)}; dieser Winkel liegt nicht im Intervall. Addiere 360°.` },
        { value: 180 + base, hint: "Achte auf das Vorzeichen: sin φ ist negativ für 180° < φ < 360°." },
      );
    }
  } else if (type === 1) {
    slips.push({ value: 180 - base, hint: "Beim Kosinus ist die zweite Lösung 360° − φ₁; 180° − φ₁ gehört zum Sinus." });
  } else {
    slips.push({ value: 180 - base, hint: "Der Tangens wiederholt sich nach 180°: φ₂ = φ₁ + 180°, nicht 180° − φ₁." });
    if (k < 0) slips.push({ value: base, hint: `${deg(base)} liegt nicht im Intervall: Addiere 180°.` });
  }
  return slips;
}

function equationSteps(type: number, k: number, base: number, phi1: number, phi2: number): string[] {
  const result = `<strong>φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`;
  if (type === 0) {
    return k > 0
      ? [`Der Taschenrechner liefert φ₁ = sin⁻¹(${fmt(k, 2)}) ≈ ${deg(base)}.`, `Wegen sin(180° − φ) = sin φ ist auch φ₂ = 180° − ${deg(base)} ≈ ${deg(phi2)} eine Lösung.`, result]
      : [
          `sin⁻¹(${fmt(k, 2)}) ≈ ${deg(base)} liegt nicht im Intervall. Der Sinus ist negativ für 180° &lt; φ &lt; 360°.`,
          `φ₁ = 180° + ${deg(-base)} ≈ ${deg(phi1)} und φ₂ = 360° − ${deg(-base)} ≈ ${deg(phi2)}`,
          result,
        ];
  }
  if (type === 1) {
    return [`φ₁ = cos⁻¹(${fmt(k, 2)}) ≈ ${deg(base)}`, `Wegen cos(360° − φ) = cos φ ist auch φ₂ = 360° − ${deg(base)} ≈ ${deg(phi2)} eine Lösung.`, result];
  }
  return k > 0
    ? [`φ₁ = tan⁻¹(${fmt(k, 2)}) ≈ ${deg(base)}`, `Der Tangens wiederholt sich nach 180°: φ₂ = ${deg(base)} + 180° ≈ ${deg(phi2)}`, result]
    : [
        `tan⁻¹(${fmt(k, 2)}) ≈ ${deg(base)} liegt nicht im Intervall; der Tangens wiederholt sich nach 180°.`,
        `φ₁ = ${deg(base)} + 180° ≈ ${deg(phi1)} und φ₂ = φ₁ + 180° ≈ ${deg(phi2)}`,
        result,
      ];
}

/** "2 · " for 2, nothing for 1. */
const times = (n: number): string => (n === 1 ? "" : `${fmt(n, 2)} · `);
/** " + 2", " − 1,5" or nothing. */
const offset = (r: number): string => (r === 0 ? "" : r > 0 ? ` + ${fmt(r, 2)}` : ` − ${fmt(-r, 2)}`);

const PARABOLA_PAIRS: Array<[number, number]> = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 2],
  [2, 4],
  [2, 6],
  [2, 8],
  [3, 9],
];
const LINE_PAIRS: Array<[number, number]> = [
  [1, 1],
  [1, 2],
  [1, 3],
  [2, 1],
  [2, 3],
  [2, 4],
  [4, 2],
  [4, 6],
];

const gleichungen: Lesson = {
  id: "dr-5-gleichungen",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "2.5 Trigonometrische Gleichungen und Trägergraphen",
  subtitle: "Alle Lösungen im Intervall finden und den Winkel eliminieren",
  tracks: ["I"],
  lehrplan: `${LEHRPLAN_I}, Gleichungen und Trägergraphen`,
  whyItMatters:
    "In Prüfungsaufgaben hängen Figuren oft von einem Winkel φ ab. Gefragt ist dann, für welche φ eine Strecke oder Fläche einen bestimmten Wert hat und auf welcher Linie die Punkte der Schar liegen.",
  explanationHtml: `
    <p>Hängt eine Figur von einem <strong>Winkel φ</strong> ab, werden Seitenlängen und Flächeninhalte zu Termen in φ. Beispiel: Im Dreieck ABC sind AB = 8 cm und AC = 5 cm. Dreht man [AC] um A, entstehen Dreiecke ABCₙ mit ∢BACₙ = φ und φ ∈ ]0°; 180°[. Für sie gilt A(φ) = ½ · 8 · 5 · sin φ cm² = 20 · sin φ cm².</p>
    <p><strong>Gleichungen lösen:</strong> Für welche φ ist A(φ) = 12 cm²? Aus 20 · sin φ = 12 folgt sin φ = 0,6. Der Taschenrechner liefert φ₁ ≈ ${deg(asinD(0.6))}; wegen sin(180° − φ) = sin φ ist auch φ₂ ≈ ${deg(180 - asinD(0.6))} eine Lösung. Beide liegen im Intervall.</p>
    <ul>
      <li><strong>sin φ = k:</strong> φ₁ = sin⁻¹ k und φ₂ = 180° − φ₁. Ist k negativ, liefert der Taschenrechner einen negativen Winkel; im Intervall 0° ≤ φ &lt; 360° liegen dann 180° − φ₁ und 360° + φ₁.</li>
      <li><strong>cos φ = k:</strong> φ₁ = cos⁻¹ k und φ₂ = 360° − φ₁. Im Intervall ]0°; 180°[ gibt es nur die eine Lösung φ₁.</li>
      <li><strong>tan φ = k:</strong> φ₁ = tan⁻¹ k und φ₂ = φ₁ + 180°.</li>
      <li>Stehen sin und cos zusammen in einer Gleichung, hilft ein Zusammenhang aus Etappe 1: tan φ = sin φ : cos φ, sin² φ + cos² φ = 1 oder das Additionstheorem sin(2φ) = sin(φ + φ) = 2 · sin φ · cos φ.</li>
    </ul>
    <div class="example">Beispiel: 2 · sin φ · cos φ = 0,5 mit φ ∈ ]0°; 180°[. Mit dem Additionstheorem wird daraus sin(2φ) = 0,5 mit 2φ ∈ ]0°; 360°[, also 2φ = 30° oder 2φ = 150°. Die Lösungen sind φ = 15° und φ = 75°.</div>
    <p><strong>Trägergraph:</strong> Hängen die Koordinaten von Punkten Pₙ von φ ab, liegen die Punkte oft auf einem bekannten Graphen. Um seine Gleichung zu finden, eliminiert man φ. Für Pₙ(2 · cos φ | 4 · sin² φ) gilt cos φ = x : 2 und sin² φ = 1 − cos² φ, also y = 4 · (1 − x²/4) = −x² + 4. Alle Pₙ liegen auf dieser Parabel, und zwar für −2 ≤ x ≤ 2.</p>
    <div class="merke"><strong>Merke:</strong> Erst auf die Form sin φ = k, cos φ = k oder tan φ = k bringen, dann <strong>alle</strong> Lösungen im Intervall suchen: Supplement 180° − φ, Periode 360°, beim Tangens 180°. Für den Trägergraphen φ mit sin² φ + cos² φ = 1 eliminieren.</div>
  `,
  formulas: [
    { name: "Supplementbeziehung", html: "sin(180° − φ) = sin φ", quantities: "die zweite Lösung von sin φ = k" },
    { name: "Doppelter Winkel", html: "2 · sin φ · cos φ = sin(2φ)", quantities: "aus sin(α + β) mit α = β = φ" },
    { name: "Trigonometrischer Pythagoras", html: "sin² φ = 1 − cos² φ", quantities: "φ eliminieren und den Trägergraphen bestimmen" },
  ],
  quiz: {
    question: "Wie viele Lösungen hat die Gleichung cos φ = −0,4 im Intervall 0° < φ < 180°?",
    options: ["keine", "zwei", "eine"],
    correctIndex: 2,
    explanation:
      "Zwischen 0° und 180° fällt cos φ von 1 auf −1 und nimmt jeden Wert genau einmal an: φ = cos⁻¹(−0,4) ≈ 113,58°. Die zweite Lösung 360° − 113,58° = 246,42° liegt außerhalb des Intervalls.",
  },
  lab: {
    kind: "trig-equation",
    title: "Labor: Gleichungen am Graphen und der Trägergraph",
    intro:
      "Verschiebe die Gerade y = k: Jeder Schnittpunkt mit dem Graphen im Intervall ist eine Lösung. Im zweiten Versuch wandert der Punkt Pₙ(2 · cos φ | 4 · sin² φ) mit dem Winkel φ, und zwar auf einer Parabel.",
    params: [
      {
        type: "choice",
        key: "view",
        label: "Versuch",
        options: [
          { value: 0, label: "Gleichung am Graphen lösen" },
          { value: 1, label: "Trägergraph der Punkte Pₙ" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "eq",
        label: "Gleichung",
        options: TRIG_EQUATIONS.map((equation, i) => ({ value: i, label: `${equation.label} = k` })),
        value: 0,
        showIf: (v) => v.view === 0,
      },
      {
        type: "choice",
        key: "interval",
        label: "Intervall",
        options: [
          { value: 0, label: "0° ≤ φ < 360°" },
          { value: 1, label: "0° < φ < 180°" },
        ],
        value: 0,
        showIf: (v) => v.view === 0,
      },
      { type: "range", key: "k", label: "rechte Seite k", unit: "", min: -2, max: 2, step: 0.05, value: 0.6, digits: 2, showIf: (v) => v.view === 0 },
      { type: "range", key: "phi", label: "Winkel φ", unit: "°", min: 0, max: 180, step: 1, value: 30, showIf: (v) => v.view === 1 },
    ],
    readouts: [
      { key: "solutions", label: "Lösungen im Intervall", emphasis: true, compute: solutionsText },
      { key: "count", label: "Anzahl der Lösungen", digits: 0, compute: (v) => trigSolutions(v.eq, v.k, v.interval).length },
      {
        key: "point",
        label: "Punkt Pₙ(2 · cos φ | 4 · sin² φ)",
        compute: (v) => {
          const p = carrierPoint(v.phi);
          return `(${fmt(p.x, 2)} | ${fmt(p.y, 2)})`;
        },
      },
      { key: "check", label: "Probe: −x² + 4 an der Stelle x von Pₙ", digits: 2, compute: (v) => 4 - carrierPoint(v.phi).x ** 2 },
    ],
    goals: [
      {
        id: "eine",
        text: "Finde ein k, für das sin φ = k im Intervall 0° ≤ φ < 360° genau eine Lösung hat.",
        check: (v) => v.view === 0 && v.eq === 0 && v.interval === 0 && trigSolutions(0, v.k, 0).length === 1,
      },
      {
        id: "doppelt",
        text: "Stelle 2 · sin φ · cos φ = k für 0° < φ < 180° so ein, dass φ = 15° eine Lösung ist. Welche zweite Lösung gibt es?",
        check: (v) => v.view === 0 && v.eq === 3 && v.interval === 1 && trigSolutions(3, v.k, 1).some((phi) => within(phi, 15, 1e-6)),
      },
      {
        id: "traeger",
        text: "Trägergraph: Stelle einen Winkel φ ein, für den der Punkt Pₙ auf der Geraden y = 3 liegt.",
        check: (v) => v.view === 1 && within(carrierPoint(v.phi).y, 3, 1e-9),
      },
    ],
  },
  exercises: [
    {
      id: "gleichung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const type = rng.int(0, 2);
          const k = type === 2 ? rng.sign() * rng.pick([0.25, 0.5, 0.75, 1.2, 1.5, 2, 2.5, 3]) : rng.sign() * rng.stepped(0.1, 0.95, 0.05);
          const [phi1, phi2] = trigSolutions(type, k, 0);
          const base = type === 0 ? asinD(k) : type === 1 ? acosD(k) : atanD(k);
          const name = TRIG_NAMES[type];
          const slips = equationSlips(type, k, base);
          return {
            prompt: `Bestimme alle Lösungen der Gleichung ${name} φ = ${fmt(k, 2)} im Intervall 0° ≤ φ &lt; 360°.`,
            given: [`${name} φ = ${fmt(k, 2)}`, "0° ≤ φ &lt; 360°"],
            formulaHint: EQUATION_HINTS[type],
            fields: [numberField("φ₁ =", phi1, "°", 2, { slips }), numberField("φ₂ =", phi2, "°", 2, { slips })],
            anyOrder: [0, 1],
            steps: equationSteps(type, k, base, phi1, phi2),
            meta: { type, k },
          };
        }
        const c = rng.stepped(6, 12, 0.5);
        const b = rng.stepped(3, 8, 0.5);
        const setup = `Im Dreieck ABC sind AB = ${fmt(c, 1)} cm und AC = ${fmt(b, 1)} cm. Dreht man [AC] um A, entstehen Dreiecke ABCₙ mit ACₙ = ${fmt(b, 1)} cm und ∢BACₙ = φ, wobei φ ∈ ]0°; 180°[.`;
        if (rng.next() < 0.6) {
          const area = Math.round(0.5 * b * c * rng.stepped(0.25, 0.9, 0.05) * 2) / 2;
          const s = (2 * area) / (b * c);
          const phi1 = asinD(s);
          const phi2 = 180 - phi1;
          return {
            prompt: `${setup} Stelle den Flächeninhalt A(φ) auf und berechne, für welche Werte von φ das Dreieck ABCₙ den Flächeninhalt ${fmt(area, 1)} cm² hat.`,
            given: [`AB = ${cm(c, 1)}`, `ACₙ = ${cm(b, 1)}`, `A = ${fmtUnit(area, "cm²", 1)}`, "φ ∈ ]0°; 180°["],
            fields: [
              numberField("φ₁ =", phi1, "°", 2, {
                slips: [
                  { value: Math.asin(s), hint: RAD_HINT },
                  { value: asinD(area / (b * c)), hint: "Den Faktor ½ beachten: sin φ = 2A : (AB · ACₙ)." },
                ],
              }),
              numberField("φ₂ =", phi2, "°", 2, {
                slips: [{ value: 360 - phi1, hint: "360° − φ₁ liegt nicht im Intervall. Den gleichen Sinus hat der Winkel 180° − φ₁." }],
              }),
            ],
            anyOrder: [0, 1],
            steps: [
              `A(φ) = ½ · AB · ACₙ · sin φ = ½ · ${fmt(c, 1)} · ${fmt(b, 1)} · sin φ cm² = ${fmt(0.5 * b * c, 2)} · sin φ cm²`,
              `${fmt(0.5 * b * c, 2)} · sin φ = ${fmt(area, 1)} ⇒ sin φ = ${fmt(area, 1)} : ${fmt(0.5 * b * c, 2)} ≈ ${fmt(s, 4)}`,
              `φ₁ = sin⁻¹(${fmt(s, 4)}) ≈ ${deg(phi1)} und φ₂ = 180° − φ₁ ≈ ${deg(phi2)}; beide liegen in ]0°; 180°[.`,
              `<strong>φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`,
            ],
            meta: { variant: 0, c, b, area },
          };
        }
        const d = draw(
          () => rng.stepped(Math.abs(c - b) + 1, c + b - 1, 0.5),
          (len) => Math.abs((b * b + c * c - len * len) / (2 * b * c)) <= 0.9,
          Math.round(Math.sqrt(b * b + c * c) * 2) / 2,
        );
        const cosPhi = (b * b + c * c - d * d) / (2 * b * c);
        const phi = acosD(cosPhi);
        return {
          prompt: `${setup} Für welchen Wert von φ ist die Seite [BCₙ] genau ${fmt(d, 1)} cm lang?`,
          given: [`AB = ${cm(c, 1)}`, `ACₙ = ${cm(b, 1)}`, `BCₙ = ${cm(d, 1)}`, "φ ∈ ]0°; 180°["],
          fields: [
            numberField("φ =", phi, "°", 2, {
              slips: [
                { value: 360 - phi, hint: "Im Intervall ]0°; 180°[ gibt es nur diese eine Lösung; 360° − φ liegt außerhalb." },
                { value: 180 - phi, hint: "Vorzeichen: cos φ = (AB² + ACₙ² − BCₙ²) : (2 · AB · ACₙ)." },
                { value: Math.acos(cosPhi), hint: RAD_HINT },
              ],
            }),
          ],
          steps: [
            "Kosinussatz im Dreieck ABCₙ: BCₙ² = AB² + ACₙ² − 2 · AB · ACₙ · cos φ",
            `${fmt(d * d, 2)} = ${fmt(b * b + c * c, 2)} − ${fmt(2 * b * c, 2)} · cos φ ⇒ cos φ = ${fmt(b * b + c * c - d * d, 2)} : ${fmt(2 * b * c, 2)} ≈ ${fmt(cosPhi, 4)}`,
            `Im Intervall ]0°; 180°[ nimmt cos φ jeden Wert nur einmal an: φ = cos⁻¹(${fmt(cosPhi, 4)}) ≈ ${deg(phi)}`,
            `<strong>φ ≈ ${deg(phi)}</strong>`,
          ],
          meta: { variant: 1, c, b, d },
        };
      },
    },
    {
      id: "zusammenhang",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const variant = rng.int(0, 2);
          if (variant === 0) {
            const p = rng.int(1, 5);
            const q = rng.sign() * rng.int(1, 5);
            const m = q / p;
            const base = atanD(m);
            const phi = base < 0 ? base + 180 : base;
            const inverse = atanD(p / q) < 0 ? atanD(p / q) + 180 : atanD(p / q);
            const slips: Slip[] = [
              { value: inverse, hint: "Umgekehrt geteilt: Aus p · sin φ = q · cos φ folgt tan φ = q : p." },
              { value: Math.atan(m), hint: RAD_HINT },
            ];
            if (base < 0) slips.push({ value: base, hint: `${deg(base)} liegt nicht im Intervall: Addiere 180°, denn der Tangens wiederholt sich nach 180°.` });
            const right = q === 1 ? "cos φ" : q === -1 ? "−cos φ" : `${fmt(q, 0)} · cos φ`;
            return {
              prompt: `Löse die Gleichung ${times(p)}sin φ = ${right} im Intervall 0° &lt; φ &lt; 180°.`,
              given: ["0° &lt; φ &lt; 180°"],
              formulaHint: "Durch cos φ teilen: tan φ = sin φ : cos φ",
              fields: [numberField("φ =", phi, "°", 2, { slips })],
              steps: [
                "Für φ = 90° wäre cos φ = 0, aber sin φ = 1; dann stimmt die Gleichung nicht. Also darfst du durch cos φ teilen.",
                `tan φ = sin φ : cos φ = ${fmt(q, 0)} : ${p} ≈ ${fmt(m, 4)}`,
                base < 0
                  ? `tan⁻¹(${fmt(m, 4)}) ≈ ${deg(base)} liegt nicht im Intervall; der Tangens wiederholt sich nach 180°: φ ≈ ${deg(phi)}`
                  : `φ = tan⁻¹(${fmt(m, 4)}) ≈ ${deg(phi)}; φ + 180° liegt außerhalb des Intervalls.`,
                `<strong>φ ≈ ${deg(phi)}</strong>`,
              ],
              meta: { variant, p, q },
            };
          }
          if (variant === 1) {
            const k = rng.sign() * rng.stepped(0.2, 0.9, 0.05);
            const [phi1, phi2] = trigSolutions(3, k, 1);
            const psi = asinD(k);
            const doubled = k > 0 ? [psi, 180 - psi] : [180 - psi, 360 + psi];
            const slips: Slip[] = [...doubled.map((value) => ({ value, hint: "Das ist 2φ. Halbiere noch." })), { value: Math.asin(k) / 2, hint: RAD_HINT }];
            return {
              prompt: `Löse die Gleichung 2 · sin φ · cos φ = ${fmt(k, 2)} im Intervall 0° &lt; φ &lt; 180°.`,
              given: ["0° &lt; φ &lt; 180°, also 0° &lt; 2φ &lt; 360°"],
              formulaHint: "Additionstheorem: 2 · sin φ · cos φ = sin(2φ); erst 2φ bestimmen, dann halbieren",
              fields: [numberField("φ₁ =", phi1, "°", 2, { slips }), numberField("φ₂ =", phi2, "°", 2, { slips })],
              anyOrder: [0, 1],
              steps: [
                `sin(2φ) = sin(φ + φ) = sin φ · cos φ + cos φ · sin φ = 2 · sin φ · cos φ, also sin(2φ) = ${fmt(k, 2)}.`,
                k > 0
                  ? `Mit 0° &lt; 2φ &lt; 360°: 2φ = sin⁻¹(${fmt(k, 2)}) ≈ ${deg(psi)} oder 2φ = 180° − ${deg(psi)} ≈ ${deg(180 - psi)}`
                  : `sin⁻¹(${fmt(k, 2)}) ≈ ${deg(psi)} ist negativ. Mit 0° &lt; 2φ &lt; 360°: 2φ = 180° + ${deg(-psi)} ≈ ${deg(180 - psi)} oder 2φ = 360° − ${deg(-psi)} ≈ ${deg(360 + psi)}`,
                `Halbieren: φ₁ ≈ ${deg(phi1)} und φ₂ ≈ ${deg(phi2)}`,
                `<strong>φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`,
              ],
              meta: { variant, k },
            };
          }
          const { p, q, r } = draw(
            () => {
              const p = rng.int(1, 6);
              const q = rng.int(1, 6);
              const s = rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]);
              return { p, q, r: Math.round((q + s * (p - q)) * 100) / 100 };
            },
            (t) => t.p !== t.q,
            { p: 3, q: 1, r: 2 },
          );
          const s = (r - q) / (p - q);
          const phi1 = acosD(Math.sqrt(s));
          const phi2 = 180 - phi1;
          return {
            prompt: `Löse die Gleichung ${times(p)}cos² φ + ${times(q)}sin² φ = ${fmt(r, 2)} im Intervall 0° &lt; φ &lt; 180°.`,
            given: ["0° &lt; φ &lt; 180°"],
            formulaHint: "sin² φ = 1 − cos² φ einsetzen, nach cos² φ auflösen und beide Wurzeln beachten",
            fields: [
              numberField("φ₁ =", phi1, "°", 2),
              numberField("φ₂ =", phi2, "°", 2, {
                slips: [{ value: phi1, hint: "Vergiss die negative Wurzel nicht: cos φ = −√… liefert den stumpfen Winkel." }],
              }),
            ],
            anyOrder: [0, 1],
            steps: [
              `sin² φ = 1 − cos² φ einsetzen: ${times(p)}cos² φ + ${q} · (1 − cos² φ) = ${fmt(r, 2)}`,
              `${p - q === 1 ? "" : p - q === -1 ? "−" : `${fmt(p - q, 0)} · `}cos² φ = ${fmt(r - q, 2)} ⇒ cos² φ = ${fmt(s, 4)}`,
              `cos φ = ${sqrtHtml(fmt(s, 4))} ≈ ${fmt(Math.sqrt(s), 4)} oder cos φ = −${sqrtHtml(fmt(s, 4))}: φ₁ ≈ ${deg(phi1)}, φ₂ = 180° − φ₁ ≈ ${deg(phi2)}`,
              `<strong>φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`,
            ],
            meta: { variant, p, q, r },
          };
        }
        const s = rng.pick([4, 5, 6, 7, 8]);
        const area = Math.round(0.5 * s * s * rng.stepped(0.3, 0.9, 0.05) * 2) / 2;
        const k = (2 * area) / (s * s);
        const psi = asinD(k);
        const phi1 = psi / 2;
        const phi2 = 90 - psi / 2;
        const slips: Slip[] = [
          { value: psi, hint: "Das ist 2φ. Halbiere noch." },
          { value: 180 - psi, hint: "Das ist 2φ. Halbiere noch." },
        ];
        return {
          prompt: `Ein Dachgiebel hat die Form eines gleichschenkligen Dreiecks mit zwei ${s} m langen Dachsparren als Schenkeln. Die Dachneigung φ ist der Winkel zwischen einem Sparren und dem waagrechten Dachboden, 0° &lt; φ &lt; 90°. Zeige, dass für die Giebelfläche A(φ) = ${s * s} · sin φ · cos φ m² gilt, und berechne, für welche Dachneigungen die Giebelfläche ${fmt(area, 1)} m² groß ist.`,
          given: [`Sparren ${s} m`, `A = ${fmtUnit(area, "m²", 1)}`, "0° &lt; φ &lt; 90°"],
          fields: [numberField("φ₁ =", phi1, "°", 2, { slips }), numberField("φ₂ =", phi2, "°", 2, { slips })],
          anyOrder: [0, 1],
          steps: [
            `Die Höhe des Giebels ist h = ${s} · sin φ, die halbe Breite ${s} · cos φ. Also A(φ) = ½ · 2 · ${s} · cos φ · ${s} · sin φ = ${s * s} · sin φ · cos φ.`,
            `Mit 2 · sin φ · cos φ = sin(2φ) wird A(φ) = ${fmt((s * s) / 2, 1)} · sin(2φ). Aus A = ${fmt(area, 1)} folgt sin(2φ) = ${fmt(area, 1)} : ${fmt((s * s) / 2, 1)} ≈ ${fmt(k, 4)}.`,
            `Mit 0° &lt; 2φ &lt; 180°: 2φ ≈ ${deg(psi)} oder 2φ = 180° − ${deg(psi)} ≈ ${deg(180 - psi)}`,
            `<strong>φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`,
          ],
          meta: { s, area },
        };
      },
    },
    {
      id: "traegergraph",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const straight = rng.next() < 0.4;
          const [p, q] = rng.pick(straight ? LINE_PAIRS : PARABOLA_PAIRS);
          const r = rng.pick([-2, -1, 0, 1, 2, 3]);
          if (straight) {
            const xTerm = `${times(p)}sin² φ`;
            const yTerm = `${times(q)}cos² φ${offset(r)}`;
            const ratio = p === 1 ? "x" : `x : ${p}`;
            const m = -q / p;
            const t = q + r;
            return {
              prompt: `Die Punkte Pₙ(${xTerm} | ${yTerm}) mit φ ∈ [0°; 90°] liegen auf einer Geraden. Bestimme ihre Gleichung in der Form y = m · x + t.`,
              given: [`x = ${xTerm}`, `y = ${yTerm}`],
              formulaHint: `sin² φ = ${ratio}; cos² φ = 1 − sin² φ`,
              fields: [
                numberField("m =", m, "", 2, { slips: [{ value: -m, hint: "Prüfe das Vorzeichen: cos² φ = 1 − sin² φ." }] }),
                numberField("t =", t, "", 2, { slips: [{ value: r, hint: "Aus cos² φ = 1 − sin² φ entsteht auch ein konstanter Summand." }] }),
              ],
              steps: [
                `x = ${xTerm} ⇒ sin² φ = ${ratio}`,
                `cos² φ = 1 − sin² φ = 1 − ${ratio} einsetzen: y = ${times(q)}(1 − ${ratio})${offset(r)}`,
                `<strong>y = ${linear(m, t)}</strong>`,
              ],
              meta: { straight: 1, p, q, r },
            };
          }
          const xTerm = `${times(p)}cos φ`;
          const yTerm = `${times(q)}sin² φ${offset(r)}`;
          const square = p === 1 ? "x²" : `x² : ${p * p}`;
          const a = -q / (p * p);
          const c = q + r;
          return {
            prompt: `Die Punkte Pₙ(${xTerm} | ${yTerm}) mit φ ∈ [0°; 180°] liegen auf einer Parabel. Bestimme ihre Gleichung in der Form y = a · x² + c.`,
            given: [`x = ${xTerm}`, `y = ${yTerm}`],
            formulaHint: `cos φ = ${p === 1 ? "x" : `x : ${p}`}; sin² φ = 1 − cos² φ`,
            fields: [
              numberField("a =", a, "", 2, {
                slips: [
                  { value: -a, hint: "Prüfe das Vorzeichen: sin² φ = 1 − cos² φ." },
                  { value: -q / p, hint: `cos² φ = (x : ${p})² = x² : ${p * p}: Quadriere auch den Nenner.` },
                ],
              }),
              numberField("c =", c, "", 2, { slips: [{ value: r, hint: "Aus sin² φ = 1 − cos² φ entsteht auch ein konstanter Summand." }] }),
            ],
            steps: [
              `x = ${xTerm} ⇒ cos φ = ${p === 1 ? "x" : `x : ${p}`}, also cos² φ = ${square}`,
              `sin² φ = 1 − cos² φ einsetzen: y = ${times(q)}(1 − ${square})${offset(r)}`,
              `<strong>y = ${quadratic(a, 0, c)}</strong>`,
            ],
            meta: { straight: 0, p, q, r },
          };
        }
        const [p, q] = rng.pick(PARABOLA_PAIRS);
        const r = draw(
          () => -rng.pick([0.5, 1, 1.5, 2, 3]),
          (value) => -value / q >= 0.1 && -value / q <= 0.9,
          -q / 2,
        );
        const xTerm = `${times(p)}cos φ`;
        const yTerm = `${times(q)}sin² φ${offset(r)}`;
        const square = p === 1 ? "x²" : `x² : ${p * p}`;
        const a = -q / (p * p);
        const c = q + r;
        const s = -r / q;
        const phi1 = asinD(Math.sqrt(s));
        const phi2 = 180 - phi1;
        return {
          prompt: `Die Punkte Bₙ(${xTerm} | ${yTerm}) mit φ ∈ ]0°; 180°[ liegen auf einer Parabel p. Bestimme die Gleichung von p in der Form y = a · x² + c. Für welche Werte von φ liegt der Punkt Bₙ auf der x-Achse?`,
          given: [`x = ${xTerm}`, `y = ${yTerm}`, "φ ∈ ]0°; 180°["],
          fields: [
            numberField("a =", a, "", 2, { slips: [{ value: -a, hint: "Prüfe das Vorzeichen: sin² φ = 1 − cos² φ." }] }),
            numberField("c =", c, "", 2, { slips: [{ value: r, hint: "Aus sin² φ = 1 − cos² φ entsteht auch ein konstanter Summand." }] }),
            numberField("φ₁ =", phi1, "°", 2, { slips: [{ value: asinD(s), hint: "Erst die Wurzel ziehen: sin φ = √(sin² φ)." }] }),
            numberField("φ₂ =", phi2, "°", 2),
          ],
          anyOrder: [2, 3],
          steps: [
            `cos φ = ${p === 1 ? "x" : `x : ${p}`}, also cos² φ = ${square}; mit sin² φ = 1 − cos² φ: y = ${times(q)}(1 − ${square})${offset(r)}`,
            `p: y = ${quadratic(a, 0, c)}`,
            `Auf der x-Achse ist y = 0: ${times(q)}sin² φ${offset(r)} = 0 ⇒ sin² φ = ${fmt(s, 4)} ⇒ sin φ = ${sqrtHtml(fmt(s, 4))} ≈ ${fmt(Math.sqrt(s), 4)}, denn sin φ &gt; 0 in ]0°; 180°[`,
            `φ₁ = sin⁻¹(${fmt(Math.sqrt(s), 4)}) ≈ ${deg(phi1)} und φ₂ = 180° − φ₁ ≈ ${deg(phi2)}`,
            `<strong>p: y = ${quadratic(a, 0, c)}; φ₁ ≈ ${deg(phi1)}, φ₂ ≈ ${deg(phi2)}</strong>`,
          ],
          meta: { p, q, r },
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst trigonometrische Gleichungen mit allen Lösungen im Intervall und bestimmst Trägergraphen.",
};

export const STAGE_DREIECKE: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Trigonometrie in Dreieck und Raum",
  subtitle: "Sinussatz, Kosinussatz, Flächeninhalt, Körper und funktionale Abhängigkeiten",
  icon: "📐",
  accent: "#0d9488",
  badgeTitle: "Dreiecks-Profi",
  lehrplanLabel: "LB 1 Trigonometrie (I und II/III)",
  lessons: [sinussatz, kosinussatz, flaecheninhalt, ebeneRaum, gleichungen],
};
