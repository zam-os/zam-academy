import { fmt, frac, fracHtml, gcd, paren } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  balanceText,
  builderPoly,
  builderText,
  builderZeros,
  domainText,
  exact2,
  lin,
  n2Vanishes,
  numText,
  polyText,
  proportionText,
  setText,
  sides,
  solveProportion,
  sortedUnique,
  t1,
  t2,
  t2Domain,
  t2IsFraction,
  t2Text,
  t2Zeros,
  valueText,
  xPlus,
} from "../lab/views-bruchterme";
import type { ChoiceField, ExerciseTask, Lesson, NumberField, Stage } from "../model/types";
import { choiceField } from "./helpers";

const STAGE_ID = "stage-5-bruchterme";

/** The highest power with a coefficient other than 0. */
const polyDegree = (p: number[]): number => p.reduce((degree, c, i) => (Math.abs(c) > 1e-9 ? i : degree), 0);
const LP = "M8 LB 5 (I) · M8 LB 4 (II/III)";

// ─── Helpers of this stage ─────────────────────────────────────────────────

/** A whole number from ±1 to ±max. */
const nonZero = (rng: Rng, max: number): number => rng.int(1, max) * rng.sign();

/** A choice field whose options appear in random order (the app shows task options as given). */
function shuffledChoice(rng: Rng, label: string, options: string[], correct: number): ChoiceField {
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceField(label, order.map((i) => options[i]), order.indexOf(correct));
}

/** Money with two decimals: "16,00 €". */
const euro = (value: number): string => `${value.toFixed(2).replace(".", ",")} €`;

/** m · x + n with x put in, as it is written down: "2 · 3 − 5", "(−2) + 1". */
function substituted(m: number, n: number, x: number): string {
  const head = m === 0 ? "" : m === 1 ? paren(x) : m === -1 ? `−${paren(x)}` : `${fmt(m)} · ${paren(x)}`;
  if (!head) return fmt(n);
  return n === 0 ? head : n > 0 ? `${head} + ${fmt(n)}` : `${head} − ${fmt(-n)}`;
}

/** A number field for an exact result, slips kept even when they are close to the answer. */
function exactField(label: string, answer: number, digits = 2, unit = "", slips: Array<{ value: number; hint: string }> = []): NumberField {
  const kept = slips.filter((slip, i) => Number.isFinite(slip.value) && Math.abs(slip.value - answer) > 1e-9 && slips.findIndex((o) => Math.abs(o.value - slip.value) < 1e-9) === i);
  return { kind: "number", label, answer, unit, digits, slips: kept };
}

/** "x + 1 = 0  ⇔  x = −1" for m·x + n = 0, with the division step when m ≠ 1. */
function zeroSteps(m: number, n: number): string {
  const z = -n / m + 0;
  // a bare x needs no step: "x = 0", never "x = 0 ⇔ x = 0"
  if (n === 0) return m === 1 ? "x = 0" : `${lin(m, 0)} = 0  ⇔  x = 0`;
  if (m === 1) return `${lin(1, n)} = 0  ⇔  x = ${numText(z)}`;
  return `${lin(m, n)} = 0  ⇔  ${lin(m, 0)} = ${fmt(-n)}  ⇔  x = ${numText(z)}`;
}

/** The two linear Nenner x + b and x + d multiplied, as written: "(x − 4)(x + 1)", "x(x − 4)". */
function hnText(b: number, d: number): string {
  if (b === 0) return `x(${xPlus(d)})`;
  if (d === 0) return `x(${xPlus(b)})`;
  return `(${xPlus(b)})(${xPlus(d)})`;
}

/** The two excluded numbers in increasing order as number fields. */
function excludedFields(values: number[], slips: Array<Array<{ value: number; hint: string }>> = [[], []]): NumberField[] {
  const [lo, hi] = values;
  return [exactField("kleinere ausgeschlossene Zahl: x₁ =", lo, 2, "", slips[0]), exactField("größere ausgeschlossene Zahl: x₂ =", hi, 2, "", slips[1])];
}

// 5.1 Bruchterme ─────────────────────────────────────────────────────────────

/** A term (p₁x + p₀) : (q₁x + q₀). */
interface Quotient {
  p1: number;
  p0: number;
  q1: number;
  q0: number;
}

const qValue = (t: Quotient, x: number): number => (t.p1 * x + t.p0) / (t.q1 * x + t.q0);
const qZero = (t: Quotient): number => -t.q0 / t.q1 + 0;
const qHtml = (t: Quotient): string => frac(t.p1 === 0 ? fmt(t.p0) : lin(t.p1, t.p0), lin(t.q1, t.q0));
const qText = (t: Quotient): string => `${t.p1 === 0 ? fmt(t.p0) : t.p0 === 0 ? lin(t.p1, 0) : `(${lin(t.p1, t.p0)})`} : ${t.q1 === 1 && t.q0 === 0 ? "x" : `(${lin(t.q1, t.q0)})`}`;

/** A Bruchterm for substituting: k : (x − e), (x + p) : (x − e) or k : (2x − m). */
function randomQuotient(rng: Rng): Quotient {
  const form = rng.int(0, 2);
  if (form === 0) return { p1: 0, p0: rng.pick([6, 8, 12, 18, 24, -12, -6]), q1: 1, q0: -rng.int(-4, 5) };
  if (form === 1) {
    let p = 0;
    let e = 0;
    do {
      p = rng.int(-5, 6);
      e = rng.int(-4, 5);
    } while (p === -e);
    return { p1: 1, p0: p, q1: 1, q0: -e };
  }
  return { p1: 0, p0: rng.pick([6, 9, 12, 15, 18]), q1: 2, q0: -rng.int(-5, 7) };
}

/** The whole numbers from −6 to 8 at which the term has a value with at most two decimals. */
function niceArguments(t: Quotient): number[] {
  const out: number[] = [];
  for (let x = -6; x <= 8; x++) {
    if (t.q1 * x + t.q0 === 0) continue;
    const value = qValue(t, x);
    if (exact2(value) && Math.abs(value) <= 40) out.push(x);
  }
  return out;
}

const bruchterme: Lesson = {
  id: "br-1-bruchterme",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "5.1 Bruchterme",
  subtitle: "Variablen im Nenner und warum man nicht jede Zahl einsetzen darf",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Bruchterme und die Notwendigkeit der Definitionsmenge`,
  whyItMatters:
    "Preise pro Person, Fahrzeiten und alle indirekt proportionalen Größen führen auf Bruchterme. Wer weiß, welche Zahlen man nicht einsetzen darf, vermeidet Rechnungen ohne Ergebnis; die Verhältnisgleichungen in Lektion 5.3 beginnen genau damit.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6 und M7:</strong> Ein Bruch ist ein Quotient: ${frac(3, 4)} = 3 : 4. Bei der indirekten Proportionalität (M7) steht die Variable schon im Nenner: Teilen sich x Personen eine Miete von 120 €, zahlt jede ${frac(120, "x")} Euro.</p>
    <p>Ein Term, bei dem eine Variable im Nenner steht, heißt <strong>Bruchterm</strong>, zum Beispiel ${frac(120, "x")}, ${frac("x + 1", "x − 2")} oder ${frac(5, "x² + 1")}. Steht die Variable nur im Zähler, wie bei ${frac("x", 3)} oder ${frac("2x + 1", 4)}, ist der Term kein Bruchterm: Man teilt nur durch eine feste Zahl.</p>
    <p>Bruchterme entstehen überall, wo durch eine veränderliche Größe geteilt wird: der Preis pro Person 120 € : x, die Fahrzeit t = 240 km : v für eine feste Strecke, die Länge 24 cm² : x eines Rechtecks mit festem Flächeninhalt und der Breite x.</p>
    <div class="example"><strong>Beispiel:</strong> Wertetabelle von T(x) = ${frac(12, "x − 2")}
      <table class="mini">
        <tr><th>x</th><td>−2</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>6</td></tr>
        <tr><th>T(x)</th><td>−3</td><td>−6</td><td>−12</td><td>kein Wert</td><td>12</td><td>6</td><td>3</td></tr>
      </table>
      Zum Beispiel ist T(4) = ${frac(12, "4 − 2")} = ${frac(12, 2)} = 6 und T(0) = ${frac(12, "0 − 2")} = −6. Für x = 2 ist der Nenner 2 − 2 = 0: T(2) gibt es nicht.</div>
    <p><strong>Warum man nicht durch 0 teilen kann:</strong> 12 : 4 = 3, weil 3 · 4 = 12. Ein Ergebnis von 12 : 0 müsste mit 0 multipliziert 12 ergeben, aber jede Zahl mal 0 ist 0. Also hat 12 : 0 kein Ergebnis. Auch 0 : 0 ist nicht festgelegt: Jede Zahl mal 0 ergibt 0, ein eindeutiges Ergebnis gibt es nicht. Für die Zahlen, bei denen der Nenner 0 wird, hat ein Bruchterm deshalb keinen Wert; sie müssen ausgeschlossen werden.</p>
    <p>Die Menge aller Zahlen der Grundmenge G, die man einsetzen darf, heißt <strong>Definitionsmenge D</strong>. Für T(x) = ${frac(12, "x − 2")} und G = ℚ ist D = ℚ ∖ {2}, gelesen „ℚ ohne 2“. Wie man D systematisch bestimmt, lernst du in Lektion 5.2.</p>
    <p><strong>In der Nähe der ausgeschlossenen Zahl</strong> werden die Werte sehr groß: T(2,1) = 12 : 0,1 = 120 und T(2,01) = 12 : 0,01 = 1.200, links von 2 dagegen T(1,99) = 12 : (−0,01) = −1.200. Je näher x an 2 heranrückt, desto größer wird der Betrag des Termwerts, über jede Grenze hinaus; bei x = 2 selbst gibt es keinen Wert.</p>
    <p><strong>Typische Fehler:</strong> ${frac("x", 3)} für einen Bruchterm halten; beim Einsetzen der ausgeschlossenen Zahl „0“ als Ergebnis notieren (12 : 0 ist nicht 0); die falsche Zahl ausschließen, etwa bei ${frac("x + 3", "x − 3")} die −3. Ausgeschlossen wird die Zahl, die den Nenner zu 0 macht, hier 3. Ein Zähler 0 ist erlaubt: ${frac("x + 3", "x − 3")} hat für x = −3 den Wert ${frac(0, "−6")} = 0.</p>
    <div class="merke"><strong>Merke:</strong> Ein Bruchterm hat eine Variable im Nenner. Zahlen, für die der Nenner 0 wird, darf man nicht einsetzen, denn durch 0 kann man nicht teilen. Die erlaubten Zahlen bilden die Definitionsmenge D, zum Beispiel D = ℚ ∖ {2}.</div>
  `,
  formulas: [
    { name: "Bruchterm", html: `${frac(12, "x − 2")}, ${frac("x + 1", "x² + 1")}; kein Bruchterm: ${frac("x", 3)}`, quantities: "Bruchterm: Eine Variable steht im Nenner." },
    { name: "Division durch 0", html: "a : 0 hat kein Ergebnis", quantities: "keine Zahl mal 0 ergibt a ≠ 0; auch 0 : 0 ist nicht festgelegt" },
    { name: "Definitionsmenge", html: `T(x) = ${frac(12, "x − 2")}: D = ℚ ∖ {2}`, quantities: "D: alle Zahlen aus der Grundmenge G, für die der Nenner nicht 0 ist" },
  ],
  quiz: {
    question: "Welcher der Terme ist ein Bruchterm?",
    options: ["x : 5", "(2x + 1) : 3", "4 : (x + 1)", "0,5x − 2"],
    correctIndex: 2,
    explanation:
      "Nur bei 4 : (x + 1) steht die Variable im Nenner. x : 5 und (2x + 1) : 3 teilen durch feste Zahlen, 0,5x − 2 hat gar keinen Nenner; diese drei Terme haben für jede Zahl einen Wert. 4 : (x + 1) dagegen hat für x = −1 keinen.",
  },
  lab: {
    kind: "fraction-term",
    title: "Labor: Wo ein Bruchterm keinen Wert hat",
    intro:
      "Zwei Bruchterme, als Punkte der Wertetabelle und als Graph. Ziehe x unten im Bild oder nutze den Regler: Rechts siehst du die Werte um x herum. An den gestrichelten Stellen ist ein Nenner 0, dort hat der Term keinen Wert.",
    params: [
      { type: "range", key: "b", label: "Zahl b in T₁(x) = 6 : (x − b)", unit: "", min: -4, max: 4, step: 0.5, value: 2, digits: 1 },
      {
        type: "choice",
        key: "typ",
        label: "Nenner von T₂",
        options: [
          { value: 0, label: "a · x + c" },
          { value: 1, label: "x² + 1" },
          { value: 2, label: "x² − 4" },
        ],
        value: 0,
      },
      { type: "range", key: "a", label: "a im Nenner von T₂", unit: "", min: -3, max: 3, step: 1, value: 2, showIf: (v) => v.typ === 0 },
      { type: "range", key: "c", label: "c im Nenner von T₂", unit: "", min: -6, max: 6, step: 1, value: -3, showIf: (v) => v.typ === 0 },
      { type: "range", key: "x", label: "x", unit: "", min: -5, max: 5, step: 0.5, value: 3, digits: 1 },
    ],
    readouts: [
      { key: "t1", label: "T₁(x)", compute: (v) => `${v.b === 0 ? "6 : x" : `6 : (${xPlus(-v.b)})`}, D₁ = ${domainText([v.b])}` },
      { key: "t2", label: "T₂(x)", compute: (v) => `${t2Text(v)}; ${t2Domain(v)}` },
      { key: "werte", label: "Termwerte bei x", emphasis: true, compute: (v) => `${valueText("T₁", v.x, t1(v, v.x))}; ${n2Vanishes(v) ? `T₂(${fmt(v.x)}): kein Wert` : valueText("T₂", v.x, t2(v, v.x))}` },
    ],
    goals: [
      {
        id: "kein-wert",
        text: "Stelle x so ein, dass T₂ keinen Wert hat. Rechne nach: Welche Zahl macht den Nenner zu 0?",
        check: (v) => !n2Vanishes(v) && t2IsFraction(v) && Number.isNaN(t2(v, v.x)),
      },
      {
        id: "gleiche-luecke",
        text: "Stelle T₁ und T₂ so ein, dass beide bei derselben Zahl keinen Wert haben, obwohl ihre Nenner verschieden sind.",
        check: (v) => !n2Vanishes(v) && t2Zeros(v).some((z) => Math.abs(z - v.b) < 1e-9) && !(v.typ === 0 && v.a === 1 && v.c === -v.b),
      },
      {
        id: "ueberall",
        text: "Stelle im Nenner a · x + c von T₂ die Zahlen a und c so ein, dass keine Zahl ausgeschlossen werden muss. Ist T₂ dann noch ein Bruchterm? Welcher andere Nenner der Auswahl schließt auch keine Zahl aus?",
        // a · x + c = 0 has no solution only for a = 0 and c ≠ 0; the Nenner is then a fixed number
        check: (v) => v.typ === 0 && v.a === 0 && v.c !== 0,
      },
    ],
  },
  exercises: [
    {
      id: "termwert",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          for (;;) {
            const t = randomQuotient(rng);
            const nice = niceArguments(t);
            if (nice.length < 4) continue;
            const [x1, x2, other] = rng.shuffle(nice);
            const zero = qZero(t);
            const excluded = rng.next() < 0.5;
            const x3 = excluded ? zero : other;
            const v1 = qValue(t, x1);
            const v2 = qValue(t, x2);
            const flip = (x: number) => (t.p1 * x + t.p0 === 0 ? Number.NaN : (t.q1 * x + t.q0) / (t.p1 * x + t.p0));
            const signSlip = (x: number) => (t.q1 * x - t.q0 === 0 ? Number.NaN : (t.p1 * x + t.p0) / (t.q1 * x - t.q0));
            const slipsFor = (x: number) => [
              { value: flip(x), hint: "Zähler geteilt durch Nenner, nicht umgekehrt." },
              { value: signSlip(x), hint: "Setze die Zahl genau dort ein, wo x steht, und achte auf das Rechenzeichen im Nenner." },
            ];
            const line = (x: number) => `T(${fmt(x)}) = ${frac(substituted(t.p1, t.p0, x), substituted(t.q1, t.q0, x))} = ${frac(fmt(t.p1 * x + t.p0), fmt(t.q1 * x + t.q0))} = ${fmt(qValue(t, x))}`;
            return {
              prompt: `Berechne für den Bruchterm T(x) = ${qHtml(t)} die Termwerte T(${fmt(x1)}) und T(${fmt(x2)}). Hat T auch für x = ${fmt(x3)} einen Wert?`,
              given: [`T(x) = ${qHtml(t)}`],
              formulaHint: "Zahl für x einsetzen, Zähler und Nenner ausrechnen, dann teilen; ist der Nenner 0, hat der Term keinen Wert.",
              fields: [
                exactField(`T(${fmt(x1)}) =`, v1, 2, "", slipsFor(x1)),
                exactField(`T(${fmt(x2)}) =`, v2, 2, "", slipsFor(x2)),
                choiceField(`Hat T für x = ${fmt(x3)} einen Wert?`, ["ja", "nein, der Nenner ist dann 0"], excluded ? 1 : 0),
              ],
              steps: [
                line(x1),
                line(x2),
                excluded
                  ? `x = ${fmt(x3)}: Der Nenner ist ${t.q1 === 1 && t.q0 === 0 ? "dann" : `${substituted(t.q1, t.q0, x3)} =`} 0. Durch 0 kann man nicht teilen, also hat T für x = ${fmt(x3)} keinen Wert.`
                  : `${line(x3)}: Der Nenner ist nicht 0, also gibt es einen Wert.`,
                `<strong>T(${fmt(x1)}) = ${fmt(v1)}, T(${fmt(x2)}) = ${fmt(v2)}; für x = ${fmt(x3)} ${excluded ? "hat T keinen Wert" : `hat T den Wert ${fmt(qValue(t, x3))}`}</strong>`,
              ],
              meta: { p1: t.p1, p0: t.p0, q1: t.q1, q0: t.q0, x1, x2, x3, excluded: excluded ? 1 : 0 },
            };
          }
        }
        const kind = rng.int(0, 2);
        if (kind === 0) {
          // a coach shared among x passengers
          for (;;) {
            const total = rng.pick([360, 420, 480, 540, 600, 660, 720, 840, 900, 960]);
            const n1 = rng.int(12, 40);
            const n2 = n1 + rng.int(2, 10);
            if ((total * 100) % n1 !== 0 || (total * 100) % n2 !== 0) continue;
            const p1 = total / n1;
            const p2 = total / n2;
            return {
              prompt: `Für einen Ausflug mietet eine Gruppe einen Bus für ${total} €. Die Kosten werden gleichmäßig auf alle x Mitfahrer verteilt, der Preis pro Person ist also P(x) = ${frac(total, "x")} Euro. Wie viel zahlt jeder bei ${n1} Mitfahrern? Um wie viel Euro wird es für jeden billiger, wenn ${n2} statt ${n1} mitfahren? Für welche Zahl x ist der Term nicht definiert?`,
              given: [`Busmiete ${total} €`, `${n1} oder ${n2} Mitfahrer`],
              fields: [
                exactField(`P(${n1}) =`, p1, 2, "€", [{ value: n1 / total, hint: "Der Preis pro Person ist die Busmiete geteilt durch die Zahl der Mitfahrer." }]),
                exactField("billiger um", p1 - p2, 2, "€", [{ value: p2, hint: `Das ist der Preis bei ${n2} Mitfahrern. Gefragt ist der Unterschied der beiden Preise.` }]),
                exactField("nicht definiert für x =", 0, 0, "", [{ value: n1, hint: "Gesucht ist die Zahl, für die der Nenner x zu 0 wird." }]),
              ],
              steps: [
                `P(${n1}) = ${frac(total, n1)} € = ${euro(p1)}`,
                `P(${n2}) = ${frac(total, n2)} € = ${euro(p2)}; der Unterschied ist ${euro(p1)} − ${euro(p2)} = ${euro(p1 - p2)}.`,
                "Für x = 0 ist der Nenner 0: P(0) gibt es nicht. Ohne Mitfahrer kann man die Miete auch nicht verteilen.",
                `<strong>Bei ${n1} Mitfahrern zahlt jeder ${euro(p1)}; bei ${n2} Mitfahrern ist es für jeden ${euro(p1 - p2)} billiger. Für x = 0 ist der Term nicht definiert.</strong>`,
              ],
              meta: { kind, total, n1, n2 },
            };
          }
        }
        if (kind === 1) {
          // the travel time for a fixed distance
          for (;;) {
            const s = rng.pick([120, 150, 180, 210, 240, 300, 360]);
            const [v1, v2] = rng.shuffle([45, 48, 50, 60, 72, 75, 80, 90, 100, 120]).slice(0, 2).sort((p, q) => p - q);
            const tA = s / v1;
            const tB = s / v2;
            const saved = (tA - tB) * 60;
            // both times exact to two decimals, so no step shows a rounded value with "="
            if (!exact2(tA) || !exact2(tB) || Math.abs(saved - Math.round(saved)) > 1e-9 || saved < 10) continue;
            return {
              prompt: `Familie Huber fährt ${s} km in den Urlaub. Bei einer Durchschnittsgeschwindigkeit von v km/h dauert die Fahrt t(v) = ${frac(s, "v")} Stunden. Wie viele Stunden dauert die Fahrt bei ${v1} km/h? Wie viele Minuten sparen die Hubers, wenn sie im Durchschnitt ${v2} km/h schaffen? Für welche Zahl v ist der Term nicht definiert?`,
              given: [`Strecke ${s} km`, `${v1} km/h oder ${v2} km/h`],
              fields: [
                exactField(`t(${v1}) =`, tA, 2, "h", [{ value: v1 / s, hint: "Zeit = Strecke geteilt durch Geschwindigkeit." }]),
                exactField("Zeitersparnis:", Math.round(saved), 0, "min", [{ value: tA - tB, hint: "Das ist die Ersparnis in Stunden. Eine Stunde hat 60 Minuten." }]),
                exactField("nicht definiert für v =", 0, 0, "", [{ value: v1, hint: "Gesucht ist die Zahl, für die der Nenner v zu 0 wird." }]),
              ],
              steps: [
                `t(${v1}) = ${frac(s, v1)} h = ${fmt(tA)} h`,
                `t(${v2}) = ${frac(s, v2)} h = ${fmt(tB)} h; Unterschied: ${fmt(tA)} h − ${fmt(tB)} h = ${fmt(tA - tB)} h = ${fmt(tA - tB)} · 60 min = ${Math.round(saved)} min`,
                "Für v = 0 ist der Nenner 0: t(0) gibt es nicht. Wer steht, kommt nie an.",
                `<strong>Die Fahrt dauert bei ${v1} km/h ${fmt(tA)} h; bei ${v2} km/h sparen die Hubers ${Math.round(saved)} Minuten. Für v = 0 ist der Term nicht definiert.</strong>`,
              ],
              meta: { kind, s, v1, v2 },
            };
          }
        }
        // rectangles with a fixed area
        for (;;) {
          const area = rng.pick([24, 36, 48, 60, 72]);
          const widths = [1, 2, 3, 4, 5, 6, 8, 10, 12].filter((w) => area % w === 0);
          const [w1, w2] = rng.shuffle(widths).slice(0, 2);
          const len = area / w1;
          const perimeter = 2 * w2 + (2 * area) / w2;
          if (w1 * w1 === area) continue;
          return {
            prompt: `Alle Rechtecke mit dem Flächeninhalt ${area} cm² haben bei der Breite x cm die Länge l(x) = ${frac(area, "x")} cm. Wie lang ist das Rechteck mit der Breite ${w1} cm? Welchen Umfang hat das Rechteck mit der Breite ${w2} cm? Für welche Zahl x ist der Term nicht definiert?`,
            given: [`A = ${area} cm²`, `Breite ${w1} cm bzw. ${w2} cm`],
            fields: [
              exactField(`l(${w1}) =`, len, 2, "cm", [{ value: w1 / area, hint: "Länge = Flächeninhalt geteilt durch Breite." }]),
              exactField("Umfang:", perimeter, 2, "cm", [{ value: perimeter / 2, hint: "Der Umfang enthält jede Seite zweimal: u = 2 · Breite + 2 · Länge." }, { value: area / w2, hint: "Das ist die Länge. Gefragt ist der Umfang u = 2 · Breite + 2 · Länge." }]),
              exactField("nicht definiert für x =", 0, 0, "", [{ value: w1, hint: "Gesucht ist die Zahl, für die der Nenner x zu 0 wird." }]),
            ],
            steps: [
              `l(${w1}) = ${frac(area, w1)} cm = ${fmt(len)} cm`,
              `Bei der Breite ${w2} cm ist die Länge ${frac(area, w2)} cm = ${fmt(area / w2)} cm, also u = 2 · ${w2} cm + 2 · ${fmt(area / w2)} cm = ${fmt(perimeter)} cm.`,
              `Für x = 0 ist der Nenner 0. Ein Rechteck mit der Breite 0 cm kann auch keinen Flächeninhalt von ${area} cm² haben.`,
              `<strong>Das Rechteck mit der Breite ${w1} cm ist ${fmt(len)} cm lang; das mit der Breite ${w2} cm hat den Umfang ${fmt(perimeter)} cm. Für x = 0 ist der Term nicht definiert.</strong>`,
            ],
            meta: { kind, area, w1, w2 },
          };
        }
      },
    },
    {
      id: "erkennen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          // terms without a variable in a Nenner, each with the reason why
          const NON_REASON: Record<string, string> = {
            "x : 4": "teilt nur durch die feste Zahl 4",
            "(2x + 1) : 3": "teilt nur durch die feste Zahl 3",
            "(x − 5) : 2": "teilt nur durch die feste Zahl 2",
            "0,5x + 3": "hat gar keinen Nenner",
            "x² : 6": "teilt nur durch die feste Zahl 6",
            "(3 − x) : 5": "teilt nur durch die feste Zahl 5",
          };
          const NON = Object.keys(NON_REASON);
          const quotients: Quotient[] = [];
          while (quotients.length < 3) {
            const t = randomQuotient(rng);
            if (!quotients.some((q) => qText(q) === qText(t))) quotients.push(t);
          }
          const findFraction = rng.next() < 0.5;
          const target = quotients[0];
          const zero = qZero(target);
          const options = findFraction ? [qText(target), ...rng.shuffle(NON).slice(0, 3)] : [rng.pick(NON), ...quotients.map(qText)];
          const field = shuffledChoice(rng, findFraction ? "Der Bruchterm ist" : "Kein Bruchterm ist", options, 0);
          const numerator = target.p1 === 0 ? 0 : -target.p0 / target.p1;
          return {
            prompt: findFraction
              ? `Welcher der vier Terme ist ein Bruchterm? Für welche Zahl hat dieser Bruchterm keinen Wert?`
              : `Welcher der vier Terme ist kein Bruchterm? Für welche Zahl hat der Bruchterm T(x) = ${qHtml(target)} keinen Wert?`,
            given: findFraction ? [] : [`T(x) = ${qHtml(target)}`],
            formulaHint: "Bruchterm: Eine Variable steht im Nenner. Keinen Wert hat er, wo der Nenner 0 ist: Nenner gleich 0 setzen.",
            fields: [
              field,
              exactField("kein Wert für x =", zero, 2, "", [
                { value: -zero, hint: "Prüfe das Vorzeichen: Für welche Zahl wird der Nenner wirklich 0?" },
                ...(target.p1 !== 0 ? [{ value: numerator, hint: "Für diese Zahl ist der Zähler 0, und der Term hat den Wert 0. Ausgeschlossen wird die Zahl, für die der Nenner 0 ist." }] : []),
              ]),
            ],
            steps: [
              findFraction
                ? `Nur bei ${qText(target)} steht die Variable im Nenner. Die anderen Terme teilen durch feste Zahlen oder haben keinen Nenner.`
                : `${options[0]} ${NON_REASON[options[0]]}: kein Bruchterm. Bei den anderen drei steht x im Nenner.`,
              `Nenner gleich 0 setzen: ${zeroSteps(target.q1, target.q0)}`,
              `<strong>${findFraction ? `Bruchterm: ${qText(target)}` : `kein Bruchterm: ${options[0]}`}; kein Wert für x = ${numText(zero)}</strong>`,
            ],
            meta: { findFraction: findFraction ? 1 : 0, p1: target.p1, p0: target.p0, q1: target.q1, q0: target.q0 },
          };
        }
        // a claim to check: the zero of the Zähler or of the Nenner?
        for (;;) {
          const p = rng.int(-6, 6);
          const r = rng.pick([1, 1, 2, 3, -1, -2]);
          const zero = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 1.5, -0.5, 2.5]);
          const s = -r * zero;
          if (!Number.isInteger(s) || -p === zero || p === 0) continue;
          // a third number to put in: neither the excluded one nor the zero of the Zähler (and not 0 in −x + s, which would print "−0"), with a value of at most two decimals
          const T = (x: number) => (x + p) / (r * x + s);
          const candidates: number[] = [];
          for (let x = -5; x <= 6; x++) if (x !== zero && x !== -p && !(x === 0 && r === -1) && exact2(T(x)) && Math.abs(T(x)) <= 20) candidates.push(x);
          if (candidates.length === 0) continue;
          const k = rng.pick(candidates);
          const value = T(k) + 0;
          const right = rng.next() < 0.5;
          const claim = right ? zero : -p;
          const name = rng.pick(["Mia", "Jonas", "Lea", "Emre"]);
          const term = frac(xPlus(p), lin(r, s));
          return {
            prompt: `${name} untersucht den Bruchterm T(x) = ${term} und sagt: „Für x = ${numText(claim)} hat der Term keinen Wert, weil dann der ${right ? "Nenner" : "Zähler"} 0 ist.“ Hat ${name} recht? Welche Zahl muss man ausschließen, und welchen Wert hat T für x = ${fmt(k)}?`,
            given: [`T(x) = ${term}`],
            fields: [
              choiceField(`Hat ${name} recht?`, ["ja", "nein"], right ? 0 : 1),
              exactField("ausgeschlossen: x =", zero, 2, "", [
                { value: -p, hint: "Für diese Zahl ist der Zähler 0, und 0 geteilt durch eine Zahl ≠ 0 ist 0. Ausgeschlossen wird die Zahl, für die der Nenner 0 ist." },
                { value: -zero, hint: "Prüfe das Vorzeichen: Setze deine Zahl in den Nenner ein." },
              ]),
              exactField(`T(${fmt(k)}) =`, value, 2, "", [{ value: 1 / value, hint: "Zähler durch Nenner, nicht Nenner durch Zähler: Der Zähler steht oben." }]),
            ],
            steps: [
              `Keinen Wert hat T dort, wo der Nenner 0 ist: ${zeroSteps(r, s)}.`,
              right
                ? `${name} hat recht: Für x = ${numText(zero)} ist der Nenner 0, durch 0 kann man nicht teilen.`
                : `${name} hat nicht recht: Für x = ${fmt(-p)} ist der Zähler 0, der Nenner aber ${substituted(r, s, -p)} = ${fmt(r * -p + s)}. Dann ist T(${fmt(-p)}) = ${frac(0, fmt(r * -p + s))} = 0, ein ganz normaler Wert.`,
              `T(${fmt(k)}) = ${frac(substituted(1, p, k), substituted(r, s, k))} = ${frac(fmt(k + p), fmt(r * k + s))} = ${numText(value)}`,
              `<strong>${right ? "ja" : "nein"}; ausgeschlossen wird x = ${numText(zero)}; T(${fmt(k)}) = ${numText(value)}</strong>`,
            ],
            meta: { p, r, s, k, right: right ? 1 : 0 },
          };
        }
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst Bruchterme, berechnest Termwerte und weißt, warum man manche Zahlen nicht einsetzen darf.",
};

// 5.2 Die Definitionsmenge bestimmen ─────────────────────────────────────────

/** The typical mistakes when a Nenner is set to 0, as a classmate's error is named in Level 2. */
const NENNER_ERRORS = {
  sign: "Vorzeichenfehler: Aus x + a = 0 folgt x = −a, nicht x = a.",
  coefficient: "Am Ende nicht durch die Zahl vor x geteilt.",
  root: "Bei x² = … nur die positive Lösung genommen; die negative fehlt.",
  divide: "Durch x geteilt; dabei geht die Lösung x = 0 verloren.",
  second: "Nur einen der beiden Nenner gleich 0 gesetzt.",
  numerator: "Den Zähler statt des Nenners gleich 0 gesetzt.",
};
type NennerError = keyof typeof NENNER_ERRORS;

/** A Nenner for Level 2: a product, a sum to factorise, or two Bruchterme. */
interface DomainCase {
  /** The term as HTML. */
  html: string;
  /** The steps from "Nenner = 0" to the zeros. */
  steps: string[];
  zeros: number[];
  /** Typical wrong zeros, per field. */
  slips: Array<Array<{ value: number; hint: string }>>;
  /** A classmate's solution with one typical mistake: the work, the numbers it excludes, the mistake and what corrects it. */
  wrong: { work: string; set: number[]; error: NennerError; fix: string };
  kind: number;
  meta: Record<string, number>;
}

function domainCase(rng: Rng): DomainCase {
  const kind = rng.int(0, 4);
  const signHint = "Prüfe das Vorzeichen: Setze deine Zahl in den Nenner ein, dann muss 0 herauskommen.";
  if (kind === 0) {
    // a product of two linear factors, one maybe with a factor before x
    for (;;) {
      const u = nonZero(rng, 5);
      const m = rng.pick([1, 1, 2, 3]);
      const w = nonZero(rng, 6);
      const z1 = u;
      const z2 = -w / m;
      if (Math.abs(z1 - z2) < 1e-9 || !exact2(z2)) continue;
      // the classmate forgets to divide by m, or (m = 1) gets the sign wrong; his two numbers differ
      const wrongZ2 = m !== 1 ? -w : w;
      if (wrongZ2 === u) continue;
      const f1 = `(${xPlus(-u)})`;
      const f2 = `(${lin(m, w)})`;
      const zeros = sortedUnique([z1, z2]);
      return {
        html: frac(xPlus(rng.int(-5, 5)), `${f1}${f2}`),
        steps: [`${f1}${f2} = 0: Ein Produkt ist 0, wenn ein Faktor 0 ist.`, `${zeroSteps(1, -u)} oder ${zeroSteps(m, w)}`],
        zeros,
        slips: zeros.map((z) => [{ value: -z, hint: signHint }]),
        wrong: {
          work: `${f1}${f2} = 0  ⇔  ${xPlus(-u)} = 0 oder ${lin(m, w)} = 0  ⇔  x = ${fmt(u)} oder x = ${fmt(wrongZ2)}`,
          set: sortedUnique([u, wrongZ2]),
          error: m !== 1 ? "coefficient" : "sign",
          fix: m !== 1 ? `Aus ${lin(m, w)} = 0 folgt ${lin(m, 0)} = ${fmt(-w)}; dann noch durch ${m} teilen: x = ${numText(z2)}.` : `Aus ${xPlus(w)} = 0 folgt x = ${fmt(-w)}, nicht x = ${fmt(w)}.`,
        },
        kind,
        meta: { kind, u, m, w },
      };
    }
  }
  if (kind === 1) {
    // x² − c² with the third binomial formula, maybe after taking out a factor
    const c = rng.int(1, 7);
    const k = rng.pick([1, 1, 2, 3, 5]);
    const n = k === 1 ? `x² − ${c * c}` : `${k}x² − ${k * c * c}`;
    const factored = k === 1 ? `(x + ${c})(x − ${c})` : `${k}(x² − ${c * c}) = ${k}(x + ${c})(x − ${c})`;
    return {
      html: frac(rng.pick(["1", "x", "x + 1", "3", "2x"]), n),
      steps: [`${n} = 0`, `Faktorisieren${k === 1 ? " mit der dritten binomischen Formel" : ": erst " + k + " ausklammern, dann dritte binomische Formel"}: ${n} = ${factored}`, `Ein Produkt ist 0, wenn ein Faktor 0 ist: x + ${c} = 0 ⇔ x = −${c} oder x − ${c} = 0 ⇔ x = ${c}`],
      zeros: [-c, c],
      slips: [[{ value: -(c * c), hint: `Nicht ${c * c} ausschließen: ${n} ist 0, wenn x² = ${c * c} ist, also für x = ${c} und für x = −${c}.` }], [{ value: c * c, hint: `Nicht ${c * c} ausschließen: x² = ${c * c} gilt für x = ${c} und für x = −${c}.` }]],
      wrong: {
        work: k === 1 ? `${n} = 0  ⇔  x² = ${c * c}  ⇔  x = ${c}` : `${n} = 0  ⇔  ${k}x² = ${k * c * c}  ⇔  x² = ${c * c}  ⇔  x = ${c}`,
        set: [c],
        error: "root",
        fix: `x² = ${c * c} gilt für x = ${c} und für x = −${c}; beide Zahlen machen den Nenner zu 0.`,
      },
      kind,
      meta: { kind, c, k },
    };
  }
  if (kind === 2) {
    // a·x² + b·x: take out a·x
    for (;;) {
      const a = rng.pick([1, 2, 3, 4, 5]);
      const z = nonZero(rng, 6);
      const b = -a * z;
      const n = polyText([0, b, a]);
      const out = a === 1 ? "x" : `${a}x`;
      const zeros = sortedUnique([0, z]);
      return {
        html: frac(rng.pick(["5", "x − 1", "2", "x + 3"]), n),
        steps: [`${n} = 0`, `Ausklammern: ${out}(${xPlus(-z)}) = 0`, `${a === 1 ? "x = 0" : `${out} = 0 ⇔ x = 0`} oder ${xPlus(-z)} = 0 ⇔ x = ${fmt(z)}`],
        zeros,
        slips: zeros.map((v) => (v === 0 ? [{ value: z, hint: "Vergiss den ausgeklammerten Faktor nicht: Auch x = 0 macht den Nenner zu 0." }] : [{ value: -v, hint: signHint }])),
        wrong: {
          work: a === 1 ? `${n} = 0  ⇔  x² = ${lin(-b, 0)}  | : x  ⇔  x = ${fmt(z)}` : `${n} = 0  ⇔  ${a}x² = ${lin(-b, 0)}  | : x  ⇔  ${a}x = ${fmt(-b)}  ⇔  x = ${fmt(z)}`,
          set: [z],
          error: "divide",
          fix: `Durch x darf man nicht teilen, x könnte 0 sein. Klammere aus: ${out}(${xPlus(-z)}) = 0, also auch x = 0.`,
        },
        kind,
        meta: { kind, a, z },
      };
    }
  }
  if (kind === 3) {
    // x² + 2cx + c², a binomial square, and a second Bruchterm
    for (;;) {
      const c = nonZero(rng, 5);
      const e = nonZero(rng, 6);
      // the zeros −c and −e must differ
      if (e === c) continue;
      const square = `x² ${c > 0 ? "+" : "−"} ${2 * Math.abs(c)}x + ${c * c}`;
      const zeros = sortedUnique([-c, -e]);
      return {
        html: `${frac(1, square)} + ${frac(4, xPlus(e))}`,
        steps: [`Erster Nenner mit der ${c > 0 ? "ersten" : "zweiten"} binomischen Formel: ${square} = (${xPlus(c)})² = 0 ⇔ ${xPlus(c)} = 0 ⇔ x = ${fmt(-c)}`, `Zweiter Nenner: ${zeroSteps(1, e)}`, "Beide Zahlen werden ausgeschlossen."],
        zeros,
        slips: zeros.map((v) => [{ value: -v, hint: signHint }]),
        wrong: {
          work: `${square} = (${xPlus(c)})² = 0  ⇔  x = ${fmt(-c)}`,
          set: [-c],
          error: "second",
          fix: `Auch der zweite Nenner ${xPlus(e)} wird 0, für x = ${fmt(-e)}: Ausgeschlossen werden die Nullstellen aller Nenner.`,
        },
        kind,
        meta: { kind, c, e },
      };
    }
  }
  // two Bruchterme with linear Nenner
  for (;;) {
    const m = rng.pick([1, 2, 3, 4]);
    const n = nonZero(rng, 9);
    const e = nonZero(rng, 6);
    const z1 = -n / m;
    if (!exact2(z1) || Math.abs(z1 + e) < 1e-9) continue;
    // the classmate gets the sign of the second zero wrong; his two numbers differ
    if (Math.abs(z1 - e) < 1e-9) continue;
    const zeros = sortedUnique([z1, -e]);
    return {
      html: `${frac(3, lin(m, n))} − ${frac("x", xPlus(e))}`,
      steps: [`Erster Nenner: ${zeroSteps(m, n)}`, `Zweiter Nenner: ${zeroSteps(1, e)}`, "Beide Zahlen werden ausgeschlossen."],
      zeros,
      slips: zeros.map((v) => [{ value: -v, hint: signHint }]),
      wrong: {
        work: `erster Nenner: ${zeroSteps(m, n)}; zweiter Nenner: ${xPlus(e)} = 0  ⇔  x = ${fmt(e)}`,
        set: sortedUnique([z1, e]),
        error: "sign",
        fix: `Aus ${xPlus(e)} = 0 folgt x = ${fmt(-e)}, nicht x = ${fmt(e)}.`,
      },
      kind,
      meta: { kind, m, n, e },
    };
  }
}

const GRUNDMENGEN: Record<string, (x: number) => boolean> = {
  "ℚ": () => true,
  "ℤ": (x) => Number.isInteger(x),
  "ℕ": (x) => Number.isInteger(x) && x >= 1,
};

const definitionsmenge: Lesson = {
  id: "br-2-definitionsmenge",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "5.2 Die Definitionsmenge bestimmen",
  subtitle: "Nenner gleich 0 setzen, lösen, ausschließen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Definitionsmenge von Bruchtermen`,
  whyItMatters:
    "Bevor du eine Bruchgleichung löst, musst du wissen, welche Zahlen als Lösung gar nicht in Frage kommen. Dafür brauchst du das Lösen einfacher Gleichungen und das Faktorisieren aus Etappe 4.",
  explanationHtml: `
    <p>Die Definitionsmenge eines Bruchterms bestimmst du in drei Schritten:</p>
    <ol class="steps">
      <li>Setze den Nenner gleich 0.</li>
      <li>Löse diese Gleichung (Wiederholung: Gleichungen lösen aus M7 und Etappe 4).</li>
      <li>Schließe die Lösungen aus der Grundmenge aus.</li>
    </ol>
    <div class="example"><strong>Beispiel 1:</strong> T(x) = ${frac("x + 3", "2x − 8")}, G = ℚ.<br>
      2x − 8 = 0 &nbsp;| + 8 &nbsp;⇔ 2x = 8 &nbsp;| : 2 &nbsp;⇔ x = 4<br>
      D = ℚ ∖ {4}. Der Zähler spielt keine Rolle: T(−3) = 0 ist ein erlaubter Wert.</div>
    <p><strong>Mehrere Nenner:</strong> Kommen mehrere Bruchterme vor, schließt du die Nullstellen aller Nenner aus. ${frac(3, "x")} + ${frac(5, "x + 1")} hat D = ℚ ∖ {−1; 0}. Die Zahlen schreibst du der Größe nach.</p>
    <p><strong>Ein Produkt im Nenner:</strong> Ein Produkt ist genau dann 0, wenn einer seiner Faktoren 0 ist. Für ${frac(7, "(x − 2)(x + 3)")} gilt (x − 2)(x + 3) = 0 ⇔ x − 2 = 0 oder x + 3 = 0 ⇔ x = 2 oder x = −3, also D = ℚ ∖ {−3; 2}.</p>
    <p><strong>Erst faktorisieren</strong> (Etappe 4, Lektion 4.4): Ist der Nenner eine Summe, zerlegst du ihn in Faktoren, durch Ausklammern oder mit einer binomischen Formel.</p>
    <table class="mini">
      <tr><th>Nenner</th><th>faktorisiert</th><th>ausgeschlossen</th></tr>
      <tr><td>x² − 9</td><td>(x + 3)(x − 3)</td><td>−3 und 3</td></tr>
      <tr><td>2x² − 8x</td><td>2x(x − 4)</td><td>0 und 4</td></tr>
      <tr><td>5x² − 20</td><td>5(x + 2)(x − 2)</td><td>−2 und 2</td></tr>
      <tr><td>x² + 6x + 9</td><td>(x + 3)²</td><td>−3</td></tr>
    </table>
    <div class="example"><strong>Beispiel 2:</strong> T(x) = ${frac("x + 1", "3x² − 12x")}, G = ℚ.<br>
      3x² − 12x = 0 ⇔ 3x(x − 4) = 0 ⇔ x = 0 oder x = 4<br>
      D = ℚ ∖ {0; 4}</div>
    <p><strong>Nenner, die nie 0 werden:</strong> x² + 1 ist immer mindestens 1, denn x² ist nie negativ. Für ${frac(2, "x² + 1")} gilt deshalb D = ℚ.</p>
    <p><strong>Andere Grundmengen:</strong> Ausgeschlossen wird nur, was in G liegt. Für G = ℕ = {1; 2; 3; …} und ${frac(5, "x + 2")} ist −2 keine natürliche Zahl, also D = ℕ; bei ${frac(1, "x − 3")} ist D = ℕ ∖ {3}.</p>
    <p>Die Definitionsmenge liest du immer am <strong>ursprünglichen Term</strong> ab. Bei ${frac("x − 2", "x² − 4")} ist für x = 2 der Nenner 0, auch wenn derselbe Faktor x − 2 im Zähler steht: D = ℚ ∖ {−2; 2}.</p>
    <p><strong>Typische Fehler:</strong> den Zähler statt des Nenners gleich 0 setzen; Vorzeichenfehler (aus x + 3 = 0 folgt x = −3, nicht 3); beim Ausklammern den Faktor x vergessen (2x(x − 4) = 0 hat auch die Lösung 0); D = {4} statt D = ℚ ∖ {4} schreiben.</p>
    <div class="merke"><strong>Merke:</strong> Nenner gleich 0 setzen, lösen, ausschließen: D = G ∖ {Nullstellen des Nenners}. Ein Produkt ist 0, wenn ein Faktor 0 ist; Summen im Nenner zerlegst du vorher in Faktoren.</div>
  `,
  formulas: [
    { name: "Definitionsmenge", html: "D = G ∖ {Nullstellen des Nenners}", quantities: "G Grundmenge, meist ℚ; die Zahlen in der Mengenklammer der Größe nach" },
    { name: "Produkt gleich 0", html: "a · b = 0 ⇔ a = 0 oder b = 0", quantities: "a, b Faktoren, zum Beispiel x und (x − 4)" },
    { name: "Faktorisieren", html: "x² − c² = (x + c)(x − c); a · x² + b · x = x(a · x + b)", quantities: "dritte binomische Formel und Ausklammern" },
  ],
  quiz: {
    question: "Welche Definitionsmenge hat der Term (x − 1) : (x² − 25) über G = ℚ?",
    options: ["D = ℚ ∖ {1}", "D = ℚ ∖ {−5; 5}", "D = ℚ ∖ {5}", "D = ℚ ∖ {25}"],
    correctIndex: 1,
    explanation:
      "x² − 25 = (x + 5)(x − 5) ist 0 für x = −5 und für x = 5. Der Zähler darf 0 sein, die 1 bleibt also erlaubt. Wer nur 5 ausschließt, hat −5 vergessen, und 25 ist die Zahl, die von x² abgezogen wird.",
  },
  lab: {
    kind: "domain",
    title: "Labor: Der Nennerbaukasten",
    intro:
      "Baue den Nenner aus einem Zahlfaktor und bis zu zwei Faktoren. Die Zeichnung setzt den Nenner gleich 0, löst die Gleichung und zeigt die ausgeschlossenen Zahlen auf der Zahlengerade.",
    params: [
      {
        type: "choice",
        key: "k",
        label: "Zahlfaktor",
        options: [1, 2, 3, -1, -2].map((k) => ({ value: k, label: fmt(k) })),
        value: 1,
      },
      { type: "choice", key: "f1", label: "1. Faktor", options: ["kein Faktor", "(x − a₁)", "x²", "(x² + 1)"].map((label, value) => ({ value, label })), value: 1 },
      { type: "range", key: "a1", label: "a₁", unit: "", min: -5, max: 5, step: 0.5, value: 2, digits: 1, showIf: (v) => v.f1 === 1 },
      { type: "choice", key: "f2", label: "2. Faktor", options: ["kein Faktor", "(x − a₂)", "x²", "(x² + 1)"].map((label, value) => ({ value, label })), value: 0 },
      { type: "range", key: "a2", label: "a₂", unit: "", min: -5, max: 5, step: 0.5, value: -1, digits: 1, showIf: (v) => v.f2 === 1 },
    ],
    readouts: [
      { key: "nenner", label: "Nenner", compute: (v) => `N(x) = ${builderText(v)}` },
      { key: "aus", label: "ausmultipliziert", compute: (v) => `N(x) = ${polyText(builderPoly(v))}` },
      { key: "d", label: "Definitionsmenge", emphasis: true, compute: (v) => `D = ${domainText(builderZeros(v))}` },
    ],
    goals: [
      {
        id: "zwei",
        text: "Baue einen Nenner, der genau die Zahlen −1 und 3 aus der Definitionsmenge ausschließt.",
        check: (v) => setText(builderZeros(v)) === setText([-1, 3]),
      },
      {
        id: "gleiche-d",
        text: "Baue einen Nenner aus zwei Faktoren, der ausmultipliziert ein x³-Glied hat und trotzdem wie x − 2 nur die Zahl 2 ausschließt. Warum schließt der zweite Faktor keine Zahl aus?",
        // only (x − 2)(x² + 1) does it: x² + 1 is at least 1 for every x, so the product is 0 only where x − 2 is
        check: (v) => v.f1 !== 0 && v.f2 !== 0 && setText(builderZeros(v)) === setText([2]) && polyDegree(builderPoly(v)) === 3,
      },
      {
        id: "faktor",
        text: "Baue den Nenner N(x) = 2x² − 8x als Produkt nach. Welche Zahlen schließt er aus?",
        check: (v) => polyText(builderPoly(v)) === "2x² − 8x",
      },
    ],
  },
  exercises: [
    {
      id: "nenner-null",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          for (;;) {
            const m = rng.pick([1, 2, 2, 3, 4, 5, -1, -2, -3]);
            const zero = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 0.5, 1.5, -2.5, 2.5, 0.25, -0.75]);
            const n = -m * zero;
            if (!Number.isInteger(n) || n === 0) continue;
            const p = rng.int(-6, 6);
            const pm = rng.pick([1, 1, 2, 3]);
            const numeratorZero = -p / pm;
            if (Math.abs(numeratorZero - zero) < 1e-9) continue;
            const term = frac(lin(pm, p), lin(m, n));
            const options = [`D = ℚ ∖ {${numText(zero)}}`, `D = {${numText(zero)}}`, `D = ℚ ∖ {${numText(-zero)}}`];
            return {
              prompt: `Bestimme die Definitionsmenge des Bruchterms T(x) = ${term} über der Grundmenge ℚ. Welche Zahl wird ausgeschlossen, und wie schreibt man D?`,
              given: [`T(x) = ${term}`, "G = ℚ"],
              formulaHint: "Nenner gleich 0 setzen, die Gleichung lösen, die Lösung ausschließen: D = ℚ ∖ {…}",
              fields: [
                exactField("ausgeschlossen: x =", zero, 2, "", [
                  { value: -zero, hint: "Prüfe das Vorzeichen: Setze deine Zahl in den Nenner ein, dann muss 0 herauskommen." },
                  { value: numeratorZero, hint: "Das ist die Nullstelle des Zählers; dort hat der Term den Wert 0. Ausgeschlossen wird die Nullstelle des Nenners." },
                  { value: -n, hint: `Teile am Ende durch die Zahl vor x: ${lin(m, 0)} = ${fmt(-n)}.` },
                ]),
                shuffledChoice(rng, "Definitionsmenge:", options, 0),
              ],
              steps: [
                `Nenner gleich 0 setzen: ${zeroSteps(m, n)}`,
                `Probe: ${substituted(m, n, zero)} = 0`,
                `<strong>x = ${numText(zero)} wird ausgeschlossen: D = ℚ ∖ {${numText(zero)}}</strong>`,
              ],
              meta: { m, n, pm, p },
            };
          }
        }
        // a classmate's solution with one typical mistake: find it, then determine D yourself
        const c = domainCase(rng);
        const [name, him] = rng.pick([
          ["Tom", "ihm"],
          ["Lena", "ihr"],
          ["Can", "ihm"],
          ["Sophie", "ihr"],
        ]);
        const others = (Object.keys(NENNER_ERRORS) as NennerError[]).filter((e) => e !== c.wrong.error);
        const errorField = shuffledChoice(rng, `${name}s Fehler:`, [c.wrong.error, ...rng.shuffle(others).slice(0, 2)].map((e) => NENNER_ERRORS[e]), 0);
        // typing the classmate's wrong number gets what corrects it
        const fromWrong = c.wrong.set.filter((v) => !c.zeros.some((z) => Math.abs(z - v) < 1e-9)).map((value) => ({ value, hint: c.wrong.fix }));
        return {
          prompt: `${name} bestimmt die Definitionsmenge von T(x) = ${c.html} über der Grundmenge ℚ und schreibt: ${c.wrong.work}, also D = ℚ ∖ ${setText(c.wrong.set)}. Welcher Fehler ist ${him} passiert? Bestimme die richtige Definitionsmenge und gib die ausgeschlossenen Zahlen der Größe nach an.`,
          given: [`T(x) = ${c.html}`, "G = ℚ"],
          fields: [...excludedFields(c.zeros, c.slips.map((s) => [...s, ...fromWrong])), errorField],
          steps: [`${name}s Fehler: ${c.wrong.fix}`, ...c.steps, `<strong>D = ℚ ∖ ${setText(c.zeros)}; ${name}s Fehler: ${NENNER_ERRORS[c.wrong.error]}</strong>`],
          meta: { ...c.meta, error: Object.keys(NENNER_ERRORS).indexOf(c.wrong.error) },
        };
      },
    },
    {
      id: "grundmenge",
      make: (rng, level): ExerciseTask => {
        const G = rng.pick(["ℚ", "ℚ", "ℤ", "ℕ", "ℕ"]);
        const inG = GRUNDMENGEN[G];
        const Gtext = G === "ℕ" ? "ℕ = {1; 2; 3; …}" : G === "ℤ" ? "ℤ" : "ℚ";
        if (level === 1) {
          const form = rng.int(0, 3);
          let html = "";
          let zeros: number[] = [];
          let reason = "";
          /** A typical wrong Definitionsmenge of this term, and the numbers it excludes when it is written G ∖ {…}. */
          let typical = "";
          let typicalExcluded: number[] | null = null;
          /** The drawn numbers, for the test: z; m and n; c; c. */
          let k1 = 0;
          let k2 = 0;
          if (form === 0) {
            const z = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
            html = frac(rng.pick([1, 2, 5, 7]), xPlus(-z));
            zeros = [z];
            k1 = z;
            reason = zeroSteps(1, -z);
            typical = `{${numText(z)}}`;
          } else if (form === 1) {
            const m = rng.pick([2, 3, 4]);
            let n = 0;
            do n = nonZero(rng, 9);
            while (n % m === 0);
            html = frac("x", lin(m, n));
            zeros = [-n / m];
            [k1, k2] = [m, n];
            reason = zeroSteps(m, n);
            typical = `${G} ∖ {${fmt(-n)}}`;
            typicalExcluded = [-n];
          } else if (form === 2) {
            const c = rng.int(1, 6);
            html = frac(rng.pick(["1", "x", "3"]), `x² − ${c * c}`);
            zeros = [-c, c];
            k1 = c;
            reason = `x² − ${c * c} = (x + ${c})(x − ${c}) = 0 ⇔ x = −${c} oder x = ${c}`;
            typical = `${G} ∖ {${c * c}}`;
            typicalExcluded = [c * c];
          } else {
            const c = rng.int(1, 9);
            html = frac(rng.pick(["4", "x − 2", "x"]), `x² + ${c}`);
            zeros = [];
            k1 = c;
            reason = `x² + ${c} ist mindestens ${c}, denn x² ist nie negativ: Der Nenner wird nie 0.`;
            typical = `${G} ∖ {${fmt(-c)}}`;
            typicalExcluded = [-c];
          }
          const inside = zeros.filter(inG);
          const outside = zeros.filter((z) => !inG(z));
          const correct = domainText(inside, G);
          // "G ∖ S" names the right set whenever S holds the same numbers of G (ℕ ∖ {−1} is ℕ), so such an option is no wrong answer
          const sameAsCorrect = (excluded: number[] | null) => excluded !== null && setText(sortedUnique(excluded.filter(inG))) === setText(inside);
          // wrong ones: the zeros with the other sign, the typical slip of this form, the set of the zeros alone, 0 excluded, the right numbers over ℚ instead of G
          const flipped = sortedUnique(zeros.map((z) => -z + 0));
          const wrongs: Array<[string, number[] | null]> = [
            [domainText(zeros, G), zeros],
            [domainText(flipped.filter(inG), G), flipped],
            [typical, typicalExcluded],
            [zeros.length ? setText(zeros) : "{ }", null],
            [`${G} ∖ {0}`, [0]],
            ...(G === "ℚ" ? [] : [[domainText(inside, "ℚ"), null] as [string, number[] | null]]),
          ];
          const texts = wrongs.filter(([option, excluded]) => option !== correct && !sameAsCorrect(excluded)).map(([option]) => option);
          const unique = [correct, ...texts.filter((o, i) => texts.indexOf(o) === i)].slice(0, 3);
          return {
            prompt: `Bestimme die Definitionsmenge von T(x) = ${html} über der Grundmenge G = ${Gtext}. Wie viele Zahlen aus G musst du ausschließen?`,
            given: [`T(x) = ${html}`, `G = ${Gtext}`],
            formulaHint: "Nenner gleich 0 setzen und lösen; ausgeschlossen wird nur, was in der Grundmenge liegt.",
            fields: [
              exactField("Anzahl der ausgeschlossenen Zahlen:", inside.length, 0, "", outside.length ? [{ value: zeros.length, hint: `${outside.map((z) => numText(z)).join(" und ")} ${outside.length === 1 ? "liegt" : "liegen"} nicht in ${G}: Diese Zahl${outside.length === 1 ? "" : "en"} musst du gar nicht ausschließen.` }] : []),
              shuffledChoice(rng, "Definitionsmenge:", unique.map((o) => `D = ${o}`), 0),
            ],
            steps: [
              `Nenner gleich 0 setzen: ${reason}`,
              zeros.length === 0
                ? "Keine Zahl macht den Nenner zu 0."
                : outside.length === 0
                  ? `${zeros.map((z) => numText(z)).join(" und ")} ${zeros.length === 1 ? "liegt" : "liegen"} in ${G} und ${zeros.length === 1 ? "wird" : "werden"} ausgeschlossen.`
                  : `${outside.map((z) => numText(z)).join(" und ")} ${outside.length === 1 ? "liegt" : "liegen"} nicht in ${G}, ${outside.length === 1 ? "muss" : "müssen"} also nicht ausgeschlossen werden${inside.length ? `; ${inside.map((z) => numText(z)).join(" und ")} schon` : ""}.`,
              `<strong>D = ${correct}; ${inside.length === 0 ? "es wird keine Zahl ausgeschlossen" : inside.length === 1 ? "ausgeschlossen wird eine Zahl" : `ausgeschlossen werden ${inside.length} Zahlen`}</strong>`,
            ],
            meta: { form, G: ["ℚ", "ℤ", "ℕ"].indexOf(G), k1, k2 },
          };
        }
        // two Bruchterme, one Nenner to factorise first: Sophie works over ℚ, Paul over ℤ or ℕ
        const PG = G === "ℚ" ? rng.pick(["ℤ", "ℕ"]) : G;
        const inPG = GRUNDMENGEN[PG];
        const paulSet = PG === "ℕ" ? "nur mit natürlichen Zahlen, G = ℕ = {1; 2; 3; …}" : "nur mit ganzen Zahlen, G = ℤ";
        for (;;) {
          const c = rng.int(2, 6);
          const shape = rng.int(0, 1);
          const a = rng.pick([1, 2, 3]);
          const first = shape === 0 ? `${a === 1 ? "" : a}x² − ${a * c * c}` : `${a === 1 ? "" : a}x² − ${a * c}x`;
          const firstZeros = shape === 0 ? [-c, c] : [0, c];
          const m = rng.pick([1, 2]);
          // now and then both Nenner are 0 for the same number c, which is excluded only once
          const shared = rng.next() < 0.25;
          const n = shared ? -m * c : nonZero(rng, 9);
          const z2 = -n / m;
          const zeros = sortedUnique([...firstZeros, z2]);
          if (zeros.length !== (shared ? 2 : 3) || !exact2(z2)) continue;
          const once = shared ? [{ value: zeros.length + 1, hint: `Die Zahl ${c} macht beide Nenner zu 0; sie wird nur einmal ausgeschlossen.` }] : [];
          const html = `${frac(2, first)} + ${frac("x", lin(m, n))}`;
          const inside = zeros.filter(inPG);
          const correct = domainText(inside, PG);
          const forgot = domainText(sortedUnique([firstZeros[1], z2]).filter(inPG), PG);
          // no "G ∖ {all zeros}" here: with zeros outside G it names the right set (ℕ ∖ {−9; 4} is ℕ ∖ {4}); Sophie's set over ℚ is wrong for Paul instead
          const allOptions = [correct, forgot, domainText(sortedUnique([...firstZeros.map((z) => -z + 0), -z2 + 0]).filter(inPG), PG), domainText(zeros, "ℚ")];
          const unique = [...new Set(allOptions)];
          if (unique.length < 3) continue;
          const factored = shape === 0 ? `${a === 1 ? "" : `${a}(x² − ${c * c}) = ${a}`}(x + ${c})(x − ${c})` : `${a === 1 ? "x" : `${a}x`}(x − ${c})`;
          const sameCount = inside.length === zeros.length;
          return {
            prompt: `Sophie und Paul bestimmen die Definitionsmenge von T(x) = ${html}. Sophie rechnet mit allen rationalen Zahlen, G = ℚ, Paul ${paulSet}. Wie viele Zahlen muss Sophie ausschließen, wie viele Paul? Welche Definitionsmenge erhält Paul?`,
            given: [`T(x) = ${html}`, "Sophie: G = ℚ", `Paul: G = ${PG}`],
            fields: [
              exactField("Sophie: Anzahl der ausgeschlossenen Zahlen", zeros.length, 0, "", [...once, { value: zeros.length - 1, hint: "Prüfe beide Nenner; der erste hat zwei Nullstellen." }]),
              exactField("Paul: Anzahl der ausgeschlossenen Zahlen", inside.length, 0, "", [...once, ...(sameCount ? [{ value: zeros.length - 1, hint: "Prüfe beide Nenner; der erste hat zwei Nullstellen." }] : [{ value: zeros.length, hint: `Nicht jede Nullstelle liegt in ${PG}; Paul schließt nur aus, was in seiner Grundmenge liegt.` }])]),
              shuffledChoice(rng, "Pauls Definitionsmenge:", unique.slice(0, 3).map((o) => `D = ${o}`), 0),
            ],
            steps: [
              `Erster Nenner: ${first} = ${factored} = 0 ⇔ x = ${numText(firstZeros[0])} oder x = ${numText(firstZeros[1])}`,
              `Zweiter Nenner: ${zeroSteps(m, n)}`,
              `Sophie schließt die ${zeros.length} Nullstellen der Nenner aus${shared ? ` (${c} macht beide Nenner zu 0 und zählt nur einmal)` : ""}: D = ${domainText(zeros, "ℚ")}.`,
              `Paul: ${sameCount ? `${zeros.length === 2 ? "Beide Zahlen liegen" : `Alle ${zeros.length} Zahlen liegen`} in ${PG}, er schließt dieselben aus.` : inside.length === 0 ? `Keine der Zahlen liegt in ${PG}, er schließt keine aus.` : `Nur ${inside.map((z) => numText(z)).join(" und ")} ${inside.length === 1 ? "liegt" : "liegen"} in ${PG}.`}`,
              `<strong>Sophie: ${zeros.length} Zahlen, Paul: ${inside.length === 0 ? "keine" : inside.length === 1 ? "eine Zahl" : `${inside.length} Zahlen`}; Pauls D = ${correct}</strong>`,
            ],
            meta: { shape, a, c, m, n, shared: shared ? 1 : 0, G: ["ℚ", "ℤ", "ℕ"].indexOf(PG) },
          };
        }
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du bestimmst Definitionsmengen, auch bei Produkten im Nenner, nach dem Faktorisieren und über anderen Grundmengen.",
};

// 5.3 Verhältnisgleichungen ───────────────────────────────────────────────────

/** "6(x + 1)", "−(x − 2)", "4x": a number times x + b, as written after multiplying. */
function times(k: number, b: number): string {
  if (b === 0) return k === 1 ? "x" : k === -1 ? "−x" : `${fmt(k)}x`;
  if (k === 1) return xPlus(b);
  if (k === -1) return `−(${xPlus(b)})`;
  return `${fmt(k)}(${xPlus(b)})`;
}

/** The solving lines for (A)x + B₁ = (C)x + B₂ written out: "6x + 6 = 4x − 8 ⇔ 2x = −14 ⇔ x = −7". */
function linearSolve(a: number, b: number, c: number, d: number): string {
  // a·x + b = c·x + d
  const A = a - c;
  const B = d - b;
  const x = B / A;
  const first = `${lin(a, b)} = ${lin(c, d)}`;
  const second = `${lin(A, 0)} = ${fmt(B)}`;
  // no doubled step: "x = 6 ⇔ x = 6" when the equation is solved already
  const chain = [first, second, `x = ${numText(x)}`];
  return chain.filter((part, i) => i === 0 || part !== chain[i - 1]).join("  ⇔  ");
}

interface Movement {
  fast: string;
  fastDefinite: string;
  fastGenitive: string;
  slow: string;
  slowGenitive: string;
  speeds: number[];
  deltas: number[];
  times: number[];
}

const MOVEMENTS: Movement[] = [
  { fast: "Ein Radfahrer", fastDefinite: "Der Radfahrer", fastGenitive: "des Radfahrers", slow: "eine Läuferin", slowGenitive: "der Läuferin", speeds: [6, 8, 9, 10, 12], deltas: [8, 10, 12, 15, 16], times: [0.5, 1, 1.5, 2] },
  { fast: "Ein Auto", fastDefinite: "Das Auto", fastGenitive: "des Autos", slow: "ein Lkw", slowGenitive: "des Lkw", speeds: [60, 70, 75, 80], deltas: [20, 30, 40, 45], times: [0.5, 1, 1.5, 2] },
  { fast: "Ein ICE", fastDefinite: "Der ICE", fastGenitive: "des ICE", slow: "ein Regionalzug", slowGenitive: "des Regionalzugs", speeds: [80, 90, 100, 120], deltas: [60, 80, 100, 120], times: [0.5, 0.75, 1, 1.5] },
];

const verhaeltnis: Lesson = {
  id: "br-3-verhaeltnisgleichungen",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "5.3 Verhältnisgleichungen",
  subtitle: "Bruchgleichungen der Form a/b = c/d lösen und die Lösung prüfen",
  tracks: ["I", "II_III"],
  lehrplan: `${LP}: Bruchgleichungen der Form a/b = c/d`,
  whyItMatters:
    "Mit Verhältnisgleichungen rechnest du Maßstäbe, Mischungen und Rezepte um und vergleichst Geschwindigkeiten. Steht die Unbekannte im Nenner, entscheidet die Definitionsmenge, ob eine berechnete Zahl wirklich eine Lösung ist.",
  explanationHtml: `
    <p><strong>Wiederholung aus M6:</strong> Eine Verhältnisgleichung wie ${frac(3, 4)} = ${frac("x", 20)} setzt zwei Quotienten gleich; beim Dreisatz und in der Prozentrechnung hast du solche Gleichungen schon gelöst.</p>
    <p>Steht die Variable in einem Nenner, ist die Verhältnisgleichung eine <strong>Bruchgleichung</strong> der Form ${frac("a", "b")} = ${frac("c", "d")}, zum Beispiel ${frac(3, "x − 2")} = ${frac(5, "x + 2")}. Die Variable kann in einem oder in beiden Nennern stehen, auch zusätzlich in einem Zähler. So löst du die Gleichung:</p>
    <ol class="steps">
      <li><strong>Definitionsmenge bestimmen:</strong> x − 2 = 0 ⇔ x = 2 und x + 2 = 0 ⇔ x = −2, also D = ℚ ∖ {−2; 2}.</li>
      <li><strong>Beide Seiten mit dem Hauptnenner multiplizieren.</strong> Mit HN = (x − 2)(x + 2) bleibt links 3 · (x + 2) und rechts 5 · (x − 2) übrig: 3(x + 2) = 5(x − 2). Das ist dasselbe wie „über Kreuz multiplizieren“: Aus ${frac("a", "b")} = ${frac("c", "d")} wird a · d = b · c (Produktgleichheit).</li>
      <li><strong>Die lineare Gleichung lösen:</strong> 3x + 6 = 5x − 10 ⇔ 16 = 2x ⇔ x = 8.</li>
      <li><strong>Prüfen, ob die Lösung in D liegt:</strong> 8 ∈ D, also L = {8}.</li>
      <li><strong>Probe:</strong> ${frac(3, "8 − 2")} = ${frac(3, 6)} = 0,5 und ${frac(5, "8 + 2")} = ${frac(5, 10)} = 0,5.</li>
    </ol>
    <div class="example"><strong>Beispiel mit leerer Lösungsmenge:</strong> ${frac("x + 1", "x − 3")} = ${frac(4, "x − 3")}, D = ℚ ∖ {3}.<br>
      Beide Seiten mit HN = x − 3 multiplizieren: x + 1 = 4 ⇔ x = 3.<br>
      Aber 3 ∉ D: Für x = 3 hätten beide Seiten keinen Wert. Also L = { }.</div>
    <p><strong>Anwendungen:</strong> Verhältnisgleichungen beschreiben Maßstäbe, Mischungsverhältnisse, Rezepte und Preise. Eine Bruchgleichung entsteht oft bei gleichen Zeiten: Ein Radfahrer fährt 36 km in derselben Zeit, in der eine Läuferin 12 km schafft; der Radfahrer ist 16 km/h schneller. Weil die Zeit t = s : v ist, gilt für die Geschwindigkeit x der Läuferin ${frac(36, "x + 16")} = ${frac(12, "x")} mit D = ℚ ∖ {−16; 0}. Über Kreuz: 36x = 12(x + 16) ⇔ 36x = 12x + 192 ⇔ 24x = 192 ⇔ x = 8. Die Läuferin schafft 8 km/h, der Radfahrer 24 km/h, beide sind 1,5 h unterwegs.</p>
    <p><strong>Typische Fehler:</strong> die Definitionsmenge vergessen und eine ausgeschlossene Zahl als Lösung angeben; nur eine Seite mit dem Hauptnenner multiplizieren; über Kreuz falsch kombinieren (Zähler mal Nenner derselben Seite); Klammern vergessen: 5(x − 2) = 5x − 10, nicht 5x − 2.</p>
    <div class="merke"><strong>Merke:</strong> Bei einer Bruchgleichung ${frac("a", "b")} = ${frac("c", "d")} bestimmst du zuerst D, multiplizierst dann mit dem Hauptnenner (über Kreuz: a · d = b · c), löst die lineare Gleichung und prüfst, ob die Lösung in D liegt; sonst ist L = { }.</div>
  `,
  formulas: [
    { name: "Verhältnisgleichung", html: `${frac("a", "b")} = ${frac("c", "d")} ⇔ a · d = b · c`, quantities: "b, d ≠ 0; über Kreuz multiplizieren (Produktgleichheit)" },
    { name: "Lösungsweg", html: "D bestimmen → mit dem Hauptnenner multiplizieren → lösen → Lösung in D? → L angeben", quantities: "HN Hauptnenner; liegt die Lösung nicht in D, ist L = { }" },
    { name: "Gleiche Zeit", html: `${frac("s<sub>1</sub>", "v<sub>1</sub>")} = ${frac("s<sub>2</sub>", "v<sub>2</sub>")}`, quantities: "t = s : v; s Strecke, v Geschwindigkeit" },
  ],
  quiz: {
    question: "Welche Lösungsmenge hat die Gleichung 2 : (x − 1) = 6 : (x + 3) über G = ℚ?",
    options: ["L = {−5}", "L = {3}", "L = { }", "L = {−3}"],
    correctIndex: 1,
    explanation:
      "D = ℚ ∖ {−3; 1}. Über Kreuz: 2 · (x + 3) = 6 · (x − 1) ⇔ 2x + 6 = 6x − 6 ⇔ 12 = 4x ⇔ x = 3, und 3 liegt in D. {−5} entsteht, wenn man Zähler und Nenner derselben Seite kombiniert: 2 · (x − 1) = 6 · (x + 3).",
  },
  lab: {
    kind: "proportion-equation",
    title: "Labor: Die Bruchwaage",
    intro:
      "Links liegt a : (x + b), rechts c : (x + d). Stelle die Zahlen ein und ziehe x auf der Zahlengerade, bis die Waage im Gleichgewicht ist. Rechts steht, was beim Multiplizieren über Kreuz entsteht; die Lösung kannst du aufdecken.",
    params: [
      { type: "range", key: "a", label: "Zähler a (links)", unit: "", min: -6, max: 6, step: 1, value: 6 },
      { type: "range", key: "b", label: "b im Nenner x + b (links)", unit: "", min: -6, max: 6, step: 1, value: -2 },
      { type: "range", key: "c", label: "Zähler c (rechts)", unit: "", min: -6, max: 6, step: 1, value: 4 },
      { type: "range", key: "d", label: "d im Nenner x + d (rechts)", unit: "", min: -6, max: 6, step: 1, value: 1 },
      { type: "range", key: "x", label: "x", unit: "", min: -10, max: 10, step: 0.5, value: 3, digits: 1 },
      { type: "choice", key: "rechnung", label: "Lösung", options: [{ value: 0, label: "verdeckt" }, { value: 1, label: "aufdecken" }], value: 0 },
    ],
    readouts: [
      { key: "gleichung", label: "Gleichung", compute: (v) => `${proportionText(v)}, D = ${domainText(solveProportion(v).excluded)}` },
      {
        key: "seiten",
        label: "Seiten bei x",
        compute: (v) => {
          const { left, right } = sides(v);
          const show = (value: number) => (Number.isNaN(value) ? "kein Wert" : exact2(value) ? fmt(value, 2) : `≈ ${fmt(value, 2)}`);
          return `links ${show(left)}, rechts ${show(right)}`;
        },
      },
      { key: "waage", label: "Waage", emphasis: true, compute: (v) => balanceText(v) },
    ],
    goals: [
      {
        id: "gleich",
        text: "Stelle x so ein, dass die Waage im Gleichgewicht ist, und rechne nach: Welches x liefert die Gleichung?",
        check: (v) => {
          const { left, right } = sides(v);
          const different = v.a !== v.c || v.b !== v.d;
          return different && !(v.a === 0 && v.c === 0) && !Number.isNaN(left) && !Number.isNaN(right) && Math.abs(left - right) < 1e-9;
        },
      },
      {
        id: "leer",
        text: "Stelle die Zahlen so ein, dass das Multiplizieren über Kreuz zwar eine Zahl liefert, diese aber nicht in D liegt: L = { }.",
        check: (v) => {
          const s = solveProportion(v);
          return s.kind === 0 && s.excludedCandidate;
        },
      },
      {
        id: "null",
        text: "Stelle eine Gleichung ein, deren Lösung x = 0 ist. Was fällt dir an den vier Zahlen auf?",
        check: (v) => {
          const s = solveProportion(v);
          return s.kind === 0 && !s.excludedCandidate && Math.abs(s.x0) < 1e-9;
        },
      },
    ],
  },
  exercises: [
    {
      id: "kreuz",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          for (;;) {
            const x0 = rng.int(-9, 9);
            const b = rng.int(-6, 6);
            const d = rng.int(-6, 6);
            const u = x0 + b;
            const w = x0 + d;
            if (b === d || u === 0 || w === 0 || Math.abs(u) > 12 || Math.abs(w) > 12) continue;
            const g = gcd(u, w);
            const k = rng.pick([1, 1, 2, 3]) * rng.sign();
            const a = (k * u) / g;
            const c = (k * w) / g;
            if (Math.abs(a) > 12 || Math.abs(c) > 12) continue;
            const v = { a, b, c, d };
            const excluded = sortedUnique([-b, -d]);
            const wrongPairing = a - c === 0 ? Number.NaN : (c * d - a * b) / (a - c);
            const equation = `${frac(fmt(a), xPlus(b))} = ${frac(fmt(c), xPlus(d))}`;
            const value = fracHtml(a, u);
            return {
              prompt: `Löse die Bruchgleichung ${equation} über der Grundmenge ℚ. Gib zuerst die beiden Zahlen an, die nicht in der Definitionsmenge liegen, dann die Lösung.`,
              given: [equation],
              formulaHint: `D: Nenner gleich 0 setzen; ${frac("a", "b")} = ${frac("c", "d")} ⇔ a · d = b · c; lösen und prüfen, ob die Lösung in D liegt`,
              fields: [
                ...excludedFields(excluded, excluded.map((e) => [{ value: -e, hint: "x + b = 0 hat die Lösung x = −b: Prüfe das Vorzeichen." }])),
                exactField("Lösung: x =", x0, 2, "", [{ value: wrongPairing, hint: "Über Kreuz heißt: Zähler links mal Nenner rechts gleich Zähler rechts mal Nenner links." }]),
              ],
              steps: [
                `D: ${zeroSteps(1, b)} und ${zeroSteps(1, d)}, also D = ${domainText(excluded)}`,
                `Mit dem Hauptnenner ${hnText(b, d)} multiplizieren, also über Kreuz: ${times(a, d)} = ${times(c, b)}`,
                `Ausmultiplizieren und lösen: ${linearSolve(a, a * d, c, c * b)}`,
                `${fmt(x0)} ∈ D. Probe: ${frac(fmt(a), substituted(1, b, x0))} = ${value} und ${frac(fmt(c), substituted(1, d, x0))} = ${value}`,
                `<strong>D = ${domainText(excluded)}; L = {${fmt(x0)}}</strong>`,
              ],
              meta: { ...v, x0 },
            };
          }
        }
        if (rng.next() < 0.45) {
          // the candidate may be the excluded number: (m·x + p) : (x − e) = c : (x − e)
          for (;;) {
            const m = rng.pick([1, 1, 2, 3]);
            const e = nonZero(rng, 6);
            const p = rng.int(-6, 6);
            const excluded = rng.next() < 0.55;
            const x0 = excluded ? e : rng.int(-6, 6);
            if (!excluded && x0 === e) continue;
            const c = m * x0 + p;
            if (c === 0 || Math.abs(c) > 20) continue;
            const left = frac(lin(m, p), xPlus(-e));
            const right = frac(fmt(c), xPlus(-e));
            const options = [`L = {${fmt(x0)}}`, "L = { }", `L = ℚ ∖ {${fmt(e)}}`];
            return {
              prompt: `Löse die Bruchgleichung ${left} = ${right} über der Grundmenge ℚ. Welche Zahl gehört nicht zur Definitionsmenge, welche Zahl liefert die Rechnung, und wie lautet die Lösungsmenge?`,
              given: [`${left} = ${right}`],
              fields: [
                exactField("ausgeschlossen: x =", e, 2, "", [{ value: -e, hint: "Prüfe das Vorzeichen: Für welche Zahl wird der Nenner 0?" }]),
                exactField("Die Rechnung liefert x =", x0, 2, "", []),
                shuffledChoice(rng, "Lösungsmenge:", options, excluded ? 1 : 0),
              ],
              steps: [
                `D: ${zeroSteps(1, -e)}, also D = ℚ ∖ {${fmt(e)}}`,
                `Beide Seiten haben denselben Nenner. Mit HN = ${xPlus(-e)} multiplizieren: ${lin(m, p)} = ${fmt(c)}`,
                `Lösen: ${linearSolve(m, p, 0, c)}`,
                excluded ? `Aber ${fmt(x0)} ∉ D: Für x = ${fmt(x0)} haben beide Seiten keinen Wert. Die Gleichung hat keine Lösung.` : `${fmt(x0)} ∈ D, also ist ${fmt(x0)} die Lösung.`,
                `<strong>D = ℚ ∖ {${fmt(e)}}; ${excluded ? "L = { }" : `L = {${fmt(x0)}}`}</strong>`,
              ],
              meta: { kind: 1, m, e, p, c },
            };
          }
        }
        // x in both Zähler and both Nenner: x² cancels after multiplying out
        for (;;) {
          const [p, q, r, s] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
          if (q === s || p === q || r === s || p === r) continue;
          const A = p + s - r - q;
          const B = r * q - p * s;
          if (A === 0 || B % A !== 0) continue;
          const x0 = B / A + 0;
          if (x0 === -q || x0 === -s || Math.abs(x0) > 12) continue;
          const excluded = sortedUnique([-q, -s]);
          const equation = `${frac(xPlus(p), xPlus(q))} = ${frac(xPlus(r), xPlus(s))}`;
          const lhs = u2(p, s);
          const rhs = u2(r, q);
          return {
            prompt: `Löse die Bruchgleichung ${equation} über der Grundmenge ℚ. Gib die beiden Zahlen an, die nicht in der Definitionsmenge liegen, und die Lösung.`,
            given: [equation],
            fields: [
              ...excludedFields(excluded, excluded.map((e) => [{ value: -e, hint: "Prüfe das Vorzeichen: Für welche Zahl wird der Nenner 0?" }])),
              exactField("Lösung: x =", x0, 2, "", [{ value: -x0, hint: "Prüfe das Vorzeichen beim Auflösen nach x." }]),
            ],
            steps: [
              `D: ${zeroSteps(1, q)} und ${zeroSteps(1, s)}, also D = ${domainText(excluded)}`,
              `Über Kreuz multiplizieren: ${product(p, s)} = ${product(r, q)}`,
              `Ausmultiplizieren: ${lhs} = ${rhs}. Auf beiden Seiten steht x², es fällt weg: ${lin(p + s, p * s)} = ${lin(r + q, r * q)}`,
              `Lösen: ${linearSolve(p + s, p * s, r + q, r * q)}; ${fmt(x0)} ∈ D`,
              `<strong>D = ${domainText(excluded)}; L = {${fmt(x0)}}</strong>`,
            ],
            meta: { kind: 2, p, q, r, s },
          };
        }
      },
    },
    {
      id: "anwendung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          for (;;) {
            const [cc, dd] = rng.pick([
              [1, 2],
              [1, 3],
              [2, 3],
              [3, 4],
              [2, 5],
              [3, 2],
              [5, 4],
              [4, 3],
            ]);
            const t = rng.pick([1, 2, 3]) * rng.sign();
            const u = t * dd;
            const a = t * cc;
            const b = rng.int(-6, 6);
            const x0 = u - b;
            if (b === 0 && rng.next() < 0.6) continue;
            const equation = `${frac(fmt(a), xPlus(b))} = ${frac(cc, dd)}`;
            const wrong = (a * cc) / dd - b;
            return {
              prompt: `Löse die Verhältnisgleichung ${equation} über der Grundmenge ℚ. Welche Zahl ist ausgeschlossen, und welche Lösung hat die Gleichung?`,
              given: [equation],
              formulaHint: `${frac("a", "b")} = ${frac("c", "d")} ⇔ a · d = b · c; vorher D bestimmen`,
              fields: [
                exactField("ausgeschlossen: x =", -b, 2, "", [{ value: b, hint: "Prüfe das Vorzeichen: Für welche Zahl wird der Nenner 0?" }]),
                exactField("Lösung: x =", x0, 2, "", [{ value: wrong, hint: "Über Kreuz: Zähler links mal Nenner rechts gleich Nenner links mal Zähler rechts." }, { value: u, hint: `Das ist der Wert des ganzen Nenners ${xPlus(b)}. Gesucht ist x.` }]),
              ],
              steps: [
                `D: ${zeroSteps(1, b)}, also D = ${domainText([-b])}`,
                `Über Kreuz: ${fmt(a)} · ${dd} = ${cc} · (${xPlus(b)})`,
                `Ausmultiplizieren und lösen: ${linearSolve(cc, cc * b, 0, a * dd)}`,
                `${fmt(x0)} ∈ D; Probe: ${frac(fmt(a), substituted(1, b, x0))} = ${frac(fmt(a), fmt(u))}${a === cc && u === dd ? "" : ` = ${fracHtml(a, u)}`}`,
                `<strong>D = ${domainText([-b])}; L = {${fmt(x0)}}</strong>`,
              ],
              meta: { a, b, cc, dd },
            };
          }
        }
        const kind = rng.int(0, 3);
        if (kind === 0) {
          // two movements that take the same time
          const mv = rng.pick(MOVEMENTS);
          for (;;) {
            const v = rng.pick(mv.speeds);
            const delta = rng.pick(mv.deltas);
            const t = rng.pick(mv.times);
            const s2 = v * t;
            const s1 = (v + delta) * t;
            if (!Number.isInteger(s1) || !Number.isInteger(s2)) continue;
            const equation = `${frac(s1, `x + ${delta}`)} = ${frac(s2, "x")}`;
            return {
              prompt: `${mv.fast} legt ${s1} km in derselben Zeit zurück, in der ${mv.slow} ${s2} km schafft. ${mv.fastDefinite} ist im Durchschnitt ${delta} km/h schneller. Stelle mit t = s : v eine Bruchgleichung für die Geschwindigkeit x ${mv.slowGenitive} auf und löse sie. Wie viele Minuten sind beide unterwegs?`,
              given: [`${s1} km und ${s2} km in derselben Zeit`, `Unterschied ${delta} km/h`],
              fields: [
                exactField("x =", v, 2, "km/h", [{ value: v + delta, hint: `Das ist die Geschwindigkeit ${mv.fastGenitive}. Gesucht ist x, die Geschwindigkeit ${mv.slowGenitive}.` }]),
                exactField("Zeit:", t * 60, 0, "min", [{ value: t, hint: "Das ist die Zeit in Stunden. Eine Stunde hat 60 Minuten." }]),
              ],
              steps: [
                `Gleiche Zeit: ${equation}, D = ℚ ∖ {${fmt(-delta)}; 0}`,
                `Über Kreuz: ${s1}x = ${s2}(x + ${delta})  ⇔  ${s1}x = ${s2}x + ${fmt(s2 * delta)}  ⇔  ${s1 - s2}x = ${fmt(s2 * delta)}  ⇔  x = ${fmt(v)}`,
                `${fmt(v)} ∈ D. Zeit: t = ${frac(s2, v)} h = ${fmt(t)} h = ${fmt(t * 60)} min; Probe: ${frac(s1, v + delta)} h = ${fmt(t)} h`,
                `<strong>Die Geschwindigkeit ${mv.slowGenitive} ist ${fmt(v)} km/h, die ${mv.fastGenitive} ${fmt(v + delta)} km/h; beide sind ${fmt(t * 60)} Minuten unterwegs.</strong>`,
              ],
              meta: { kind, v, delta, t, s1, s2 },
            };
          }
        }
        if (kind === 1) {
          // a mixture: x : (V − x) = p : q
          for (;;) {
            const [p, q] = rng.pick([
              [1, 2],
              [1, 3],
              [2, 3],
              [1, 4],
              [3, 2],
              [2, 5],
              [3, 5],
            ]);
            const V = rng.pick([1, 1.5, 2, 2.5, 3, 4, 5, 6]);
            const x = (p * V) / (p + q);
            if (!exact2(x)) continue;
            const juice = rng.next() < 0.5;
            const [first, second, mix, unit] = juice ? ["Apfelsaft", "Wasser", "Apfelschorle", "l"] : ["Zement", "Sand", "Mörtelmischung", "kg"];
            const amount = juice ? `${fmt(V)} Liter` : `${fmt(V * 10)} kg`;
            const total = juice ? V : V * 10;
            const xs = juice ? x : x * 10;
            const equation = `${frac("x", `${fmt(total)} − x`)} = ${frac(p, q)}`;
            return {
              prompt: juice
                ? `Für eine Apfelschorle mischt Ben Apfelsaft und Wasser im Verhältnis ${p} : ${q}. Wie viel Liter Apfelsaft und wie viel Liter Wasser braucht er für ${amount} Schorle? Löse dazu die Gleichung ${equation} mit x für die Menge Apfelsaft in Litern.`
                : `Für einen Mörtel mischt eine Maurerin Zement und Sand im Massenverhältnis ${p} : ${q}. Wie viel Kilogramm Zement und wie viel Kilogramm Sand braucht sie für ${amount} Mischung? Löse dazu die Gleichung ${equation} mit x für die Masse Zement in Kilogramm.`,
              given: [`Verhältnis ${p} : ${q}`, `${amount} ${mix}`],
              fields: [
                exactField(`${first}:`, xs, 2, unit, [{ value: (p * total) / q, hint: `Das Verhältnis ${p} : ${q} vergleicht ${first} mit ${second}, nicht mit der ganzen Mischung.` }]),
                exactField(`${second}:`, total - xs, 2, unit, [{ value: xs, hint: `Das ist die Menge ${first}. ${second} ist der Rest der Mischung.` }]),
              ],
              steps: [
                `${first} : ${second} = ${p} : ${q}, also ${equation} mit D = ℚ ∖ {${fmt(total)}}`,
                p === 1
                  ? `Über Kreuz: ${q}x = ${fmt(total)} − x  ⇔  ${p + q}x = ${fmt(total)}  ⇔  x = ${fmt(xs)}`
                  : `Über Kreuz: ${q}x = ${p}(${fmt(total)} − x)  ⇔  ${q}x = ${fmt(p * total)} − ${p}x  ⇔  ${p + q}x = ${fmt(p * total)}  ⇔  x = ${fmt(xs)}`,
                `${fmt(xs)} ∈ D. ${second}: ${fmt(total)} ${unit} − ${fmt(xs)} ${unit} = ${fmt(total - xs)} ${unit}; Probe: ${fmt(xs)} : ${fmt(total - xs)} = ${p} : ${q}`,
                `<strong>${juice ? "Ben braucht" : "Sie braucht"} ${fmt(xs)} ${unit} ${first} und ${fmt(total - xs)} ${unit} ${second}.</strong>`,
              ],
              meta: { kind, p, q, total, juice: juice ? 1 : 0 },
            };
          }
        }
        if (kind === 2) {
          // a map scale 1 : x
          for (;;) {
            const scale = rng.pick([10000, 20000, 25000, 50000, 100000]);
            const cm = rng.pick([2, 3, 4, 5, 6, 8, 12]);
            const km = (cm * scale) / 100000;
            const otherKm = rng.pick([1, 2, 3, 5, 6, 10]);
            const otherCm = (otherKm * 100000) / scale;
            if (!exact2(km) || !exact2(otherCm) || otherCm > 60) continue;
            return {
              prompt: `Auf einer Wanderkarte sind zwei Gipfel ${cm} cm voneinander entfernt, in Wirklichkeit sind es ${fmt(km)} km. Bestimme den Maßstab 1 : x der Karte mit einer Verhältnisgleichung. Wie viele Zentimeter auf der Karte entsprechen ${otherKm} km in Wirklichkeit?`,
              given: [`${cm} cm auf der Karte`, `${fmt(km)} km in Wirklichkeit`],
              fields: [
                exactField("Maßstab 1 : x mit x =", scale, 0, "", [{ value: scale / 100, hint: "Rechne beide Längen in dieselbe Einheit um: 1 km = 1.000 m = 100.000 cm." }, { value: scale / 1000, hint: "Rechne beide Längen in dieselbe Einheit um: 1 km = 100.000 cm." }]),
                exactField(`${otherKm} km entsprechen`, otherCm, 2, "cm", [{ value: otherCm * 10, hint: "Das sind Millimeter. Gefragt ist in Zentimetern." }]),
              ],
              steps: [
                `${fmt(km)} km = ${fmt(km * 100000)} cm. Verhältnisgleichung: ${frac(1, "x")} = ${frac(cm, fmt(km * 100000))}, D = ℚ ∖ {0}`,
                `Über Kreuz: ${cm}x = ${fmt(km * 100000)}  ⇔  x = ${fmt(scale)}; ${fmt(scale)} ∈ D`,
                `${otherKm} km = ${fmt(otherKm * 100000)} cm; ${fmt(otherKm * 100000)} cm : ${fmt(scale)} = ${fmt(otherCm)} cm`,
                `<strong>Der Maßstab ist 1 : ${fmt(scale)}; ${otherKm} km sind auf der Karte ${fmt(otherCm)} cm.</strong>`,
              ],
              meta: { kind, scale, cm, otherKm },
            };
          }
        }
        // a recipe: how many people does an amount feed?
        for (;;) {
          const people = rng.pick([4, 6, 8, 10, 12]);
          const per = rng.pick([50, 60, 75, 80, 100, 125]);
          const base = people * per;
          const more = rng.pick([1.5, 2, 2.5, 3, 0.5]) * base;
          const x = more / per;
          const ask = rng.pick([3, 5, 7, 9, 15]);
          if (!Number.isInteger(x) || x === people || ask === people || ask === x) continue;
          // every amount through fmt(): 1.250 g and 1.125 g alike, never 1125 g next to 1.250 g
          const equation = `${frac(fmt(base), people)} = ${frac(fmt(more), "x")}`;
          return {
            prompt: `Für einen Kuchen für ${people} Personen braucht man ${fmt(base)} g Mehl. Lisa hat ${fmt(more)} g Mehl. Für wie viele Personen reicht es, wenn sie das Rezept im gleichen Verhältnis ${more > base ? "vergrößert" : "verkleinert"}? Stelle dazu eine Verhältnisgleichung mit x Personen auf. Wie viel Mehl braucht man für ${ask} Personen?`,
            given: [`${people} Personen: ${fmt(base)} g Mehl`, `${fmt(more)} g Mehl vorhanden`],
            fields: [
              exactField("x =", x, 0, "Personen", [{ value: (base * people) / more, hint: `${more > base ? "Mehr" : "Weniger"} Mehl reicht für ${more > base ? "mehr" : "weniger"} Personen: Mehl und Personen sind proportional, Mehl : Personen bleibt gleich.` }]),
              exactField(`Mehl für ${ask} Personen:`, ask * per, 2, "g", [{ value: (base / ask) * people, hint: "Mehr Personen brauchen mehr Mehl: Rechne mit dem Mehl für eine Person." }]),
            ],
            steps: [
              `Gleiches Verhältnis Mehl : Personen: ${equation}, D = ℚ ∖ {0}`,
              `Über Kreuz: ${fmt(base)}x = ${fmt(more)} · ${people}  ⇔  x = ${fmt((more * people) / base)}; ${fmt(x)} ∈ D`,
              `Für eine Person ${fmt(base)} g : ${people} = ${fmt(per)} g, für ${ask} Personen ${ask} · ${fmt(per)} g = ${fmt(ask * per)} g`,
              `<strong>Das Mehl reicht für ${fmt(x)} Personen; für ${ask} Personen braucht man ${fmt(ask * per)} g Mehl.</strong>`,
            ],
            meta: { kind: 3, people, per, more, ask },
          };
        }
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du löst Bruchgleichungen der Form a/b = c/d mit Definitionsmenge, Hauptnenner und Probe, auch in Sachaufgaben.",
};

/** (x + u)(x + w) as written: "(x + 6)(x − 1)", "x(x + 3)", a bare x first. */
function product(u: number, w: number): string {
  if (u === 0 && w === 0) return "x · x";
  if (u === 0) return `x(${xPlus(w)})`;
  if (w === 0) return `x(${xPlus(u)})`;
  return `(${xPlus(u)})(${xPlus(w)})`;
}

/** (x + u)(x + w) multiplied out: "x² + 3x − 10". */
function u2(u: number, w: number): string {
  const rest = lin(u + w, u * w);
  if (rest === "0") return "x²";
  return rest.startsWith("−") ? `x² − ${rest.slice(1)}` : `x² + ${rest}`;
}

export const STAGE_BRUCHTERME: Stage = {
  id: "stage-5-bruchterme",
  stageNumber: 5,
  title: "Bruchterme und Bruchgleichungen",
  subtitle: "Variablen im Nenner, Definitionsmenge und Verhältnisgleichungen",
  icon: "➗",
  accent: "#db2777",
  badgeTitle: "Bruchdetektiv",
  lehrplanLabel: "LB 5 (I) · LB 4 (II/III)",
  lessons: [bruchterme, definitionsmenge, verhaeltnis],
};

