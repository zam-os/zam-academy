import { fmt, linear, paren, quadratic, sum, term } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import {
  chainG,
  chainH,
  chainHPrime,
  chainInner,
  chainOuter,
  extremAnalyse,
  paramDf,
  paramF,
  rateWerte,
  sachWerte,
  type SachWerte,
} from "../lab/views-4-anwendungen";
import type { ExerciseTask, LabValues } from "../model/types";
import {
  choice,
  lab,
  makeLesson,
  makeStage,
  range,
  task,
} from "./builders";
import { choiceField, numberField } from "./helpers";

const L = (step: number, content: Parameters<typeof makeLesson>[2]) =>
  makeLesson(4, step, content);

/** A non-zero integer in [−max, max]. */
function nonZero(rng: Rng, max: number): number {
  return rng.int(1, max) * rng.sign();
}

// 4.1 Verknüpfte Funktionen ─────────────────────────────────────────────────

const verketteteFunktionen = L(1, {
  id: "aw-1-verknuepfte-funktionen",
  title: "4.1 Verknüpfte Funktionen",
  subtitle: "Funktionen in Funktionen – und ihre Ableitungen",
  whyItMatters:
    "Bremswege, Temperaturkurven und Wachstumsprozesse hängen oft von Größen ab, die ihrerseits von der Zeit abhängen – Funktionen in Funktionen. Im Abitur musst du solche Verkettungen ableiten und ihre Extrema untersuchen. Wer die Kettenregel sicher anwendet, kommt bei jeder späteren Modellierung schneller zum Ziel.",
  explanationHtml: `
    <p><strong>Verkettete Funktionen</strong> entstehen, wenn eine Funktion in die andere eingesetzt wird: (f ∘ g)(x) = f(g(x)). Die <strong>innere Funktion</strong> g rechnet zuerst, die <strong>äußere Funktion</strong> f wertet das Ergebnis aus. Bei h(x) = (x² + 2)³ ist g(x) = x² + 2 und f(u) = u³.</p>
    <p>Zur Untersuchung brauchst du die <strong>Kettenregel</strong> (Wiederholung aus M12): Die Ableitung einer Verkettung ist das Produkt aus äußerer Ableitung (ausgewertet an der Stelle g(x)) und innerer Ableitung:</p>
    <p>(f ∘ g)′(x) = f′(g(x)) · g′(x)</p>
    <p>Das gilt auch mit <strong>Parametern</strong>: In f(x) = (x² + a)³ steckt a im inneren Term. Die Ableitung ändert sich mit a, und Bedingungen wie „f′(1) = 6“ werden zu Gleichungen für a. Extrema findest du wie gewohnt mit f′ = 0; bei einer Verkettung entscheidet das Produkt, ob eine Stelle Extremstelle ist.</p>
    <p>Eine verkettete Funktion <strong>untersuchst du Schritt für Schritt</strong> – mit denselben Fragen wie jede andere Funktion:</p>
    <ol class="steps">
      <li><strong>Definitionsbereich:</strong> Bei Polynomen ist 𝔻 = ℝ. Bei einer Wurzel muss der innere Term nicht negativ sein, bei ln(g(x)) muss g(x) positiv sein, und bei g(x) : h(x) darf der Nenner nicht 0 werden.</li>
      <li><strong>Nullstellen:</strong> h(x) = 0 lösen; bei f(g(x)) rechnest du zuerst die Nullstellen der inneren Funktion aus und prüfst sie in der äußeren.</li>
      <li><strong>Extremstellen:</strong> Mit der Kettenregel h′(x) = 0 lösen; die Art des Extrempunkts zeigt h″, der Vorzeichenwechsel von h′ oder eine Probe mit benachbarten Stellen.</li>
      <li><strong>Grenzverhalten:</strong> Für sehr große und sehr kleine x entscheidet die äußere Funktion, ob h(x) gegen ∞, gegen −∞ oder gegen einen festen Wert strebt.</li>
    </ol>
    <p>Auch <strong>Produkte und Quotienten</strong> stecken in Verkettungen, etwa h(x) = g(x) · f(g(x)). Dann kombinierst du die Regeln aus M12: (g · h)′(x) = g′(x) · h(x) + g(x) · h′(x) und (g : h)′(x) = (g′(x) · h(x) − g(x) · h′(x)) : h(x)².</p>
    <p>Bei <strong>e-Funktion und ln-Funktion</strong> liefert die äußere Ableitung die e-Regel bzw. die ln-Regel: (e<sup>g(x)</sup>)′ = g′(x) · e<sup>g(x)</sup> und (ln(g(x)))′ = g′(x) : g(x). Besonders sauber wird es, wenn der innere Term an der Stelle 0 ist (dann ist e<sup>0</sup> = 1) oder 1 (dann ist ln(1) = 0).</p>
    <div class="example">h(x) = (x² + 2)³: g(x) = x² + 2, f(u) = u³. Die äußere Ableitung ist f′(g(x)) = 3(x² + 2)², die innere g′(x) = 2x. Also h′(x) = 3(x² + 2)² · 2x = 6x(x² + 2)². Für x = 1: h(1) = 27 und h′(1) = 6 · 1 · 9 = 54.</div>
    <div class="example">c(t) = e<sup>t² − 4t</sup>: innere Funktion g(t) = t² − 4t, äußere Funktion f(u) = e<sup>u</sup>. Nach der Kettenregel ist c′(t) = (2t − 4) · e<sup>t² − 4t</sup>. Für t = 4 ist der Exponent 0, also c(4) = 1 und c′(4) = 4 · 1 = 4. Untersuchung: 𝔻 = ℝ, c(t) ist nie 0, das Minimum liegt bei t = 2 (dort ist der Exponent am kleinsten), und für x → ±∞ strebt c(t) gegen ∞.</div>
    <div class="merke"><strong>Merke:</strong> Bei f(g(x)) zuerst die äußere, dann die innere Ableitung bilden und beide multiplizieren. Die äußere Ableitung wird immer an der Stelle g(x) ausgewertet.</div>
  `,
  formulas: [
    {
      name: "Verkettung",
      html: "(f ∘ g)(x) = f(g(x))",
      quantities: "g innere Funktion, f äußere Funktion",
    },
    {
      name: "Kettenregel",
      html: "(f ∘ g)′(x) = f′(g(x)) · g′(x)",
      quantities: "äußere Ableitung an der Stelle g(x) mal innere Ableitung",
    },
    {
      name: "Beispiel mit Parameter",
      html: "h(x) = (x² + a)³ ⇒ h′(x) = 6x(x² + a)²",
      quantities: "a Parameter im inneren Term",
    },
    {
      name: "Produkt- und Quotientenregel",
      html: "(g · h)′(x) = g′(x) · h(x) + g(x) · h′(x), (g : h)′(x) = (g′(x) · h(x) − g(x) · h′(x)) : h(x)²",
      quantities: "Regeln aus M12, kombiniert mit der Kettenregel in Verkettungen",
    },
    {
      name: "e-Funktion und ln-Funktion",
      html: "(e<sup>g(x)</sup>)′ = g′(x) · e<sup>g(x)</sup>, (ln(g(x)))′ = g′(x) : g(x)",
      quantities: "äußere Ableitung von e hoch u ist e hoch u, von ln u ist 1 : u",
    },
    {
      name: "Untersuchung einer Verkettung",
      html: "𝔻 bestimmen, Nullstellen aus h(x) = 0, Extremstellen aus h′(x) = 0, Grenzverhalten",
      quantities: "Reihenfolge der Untersuchung, auch mit Parametern",
    },
  ],
  quiz: {
    question: "Wie leitest du h(x) = (x² + 3)² ab?",
    options: [
      "Äußere Ableitung 2(x² + 3) mal innere Ableitung 2x: h′(x) = 4x(x² + 3).",
      "Nur die äußere Ableitung: h′(x) = 2(x² + 3).",
      "Äußere Ableitung 2x mal innere Ableitung 2x: h′(x) = 4x².",
    ],
    correctIndex: 0,
    explanation:
      "Die Kettenregel multipliziert die äußere Ableitung 2u (mit u = x² + 3) mit der inneren Ableitung 2x. Das ergibt 2(x² + 3) · 2x = 4x(x² + 3).",
  },
  lab: lab(
    "verkettet",
    "Verkettete Funktionen untersuchen",
    "h(x) = f(g(x)) mit g(x) = x² + a·x + b und f(u) = u². Ziehe die Stelle x auf dem Graphen und stelle a und b so ein, dass die Laboraufträge gelingen. Die orangefarbene Tangente zeigt die Ableitung nach der Kettenregel.",
    [
      range("a", "Parameter a in g(x) = x² + a·x + b", -4, 4, 1, 1),
      range("b", "Parameter b in g(x)", -8, 8, 1, 1),
      range("x", "Stelle x", -4, 4, 0, 0.5),
    ],
    [
      { key: "g", label: "g(x)", compute: chainG, digits: 2 },
      {
        key: "wert",
        label: "h(x) = f(g(x))",
        compute: chainH,
        digits: 2,
        emphasis: true,
      },
      {
        key: "aussen",
        label: "äußere Ableitung f′(g(x))",
        compute: chainOuter,
        digits: 2,
      },
      {
        key: "innen",
        label: "innere Ableitung g′(x)",
        compute: chainInner,
        digits: 2,
      },
      {
        key: "ableitung",
        label: "h′(x) = f′(g(x)) · g′(x)",
        compute: chainHPrime,
        digits: 2,
      },
    ],
    [
      {
        id: "nullstelle",
        text: "Stelle die Parameter so ein, dass h(x) = f(g(x)) an der gewählten Stelle 0 ist.",
        check: (v: LabValues) => Math.abs(chainH(v)) < 1e-9,
      },
      {
        id: "ableitung-vier",
        text: "Sorge dafür, dass die Ableitung h′(x) an der gewählten Stelle genau 4 ist.",
        check: (v: LabValues) => Math.abs(chainHPrime(v) - 4) < 1e-9,
      },
      {
        id: "minimum-inneres",
        text: "Wähle a so, dass die innere Funktion g an der gewählten Stelle ihr Minimum hat (innere Ableitung 0).",
        check: (v: LabValues) => Math.abs(chainInner(v)) < 1e-9,
      },
    ],
  ),
  exercises: [
    {
      id: "verkettet-wert",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x0 = nonZero(rng, 3);
          const b = rng.int(-4, 6);
          const g = x0 * x0 + b;
          const h = g * g;
          return task(
            1,
            `Für die verknüpfte Funktion h(x) = f(g(x)) mit g(x) = x² + b und f(u) = u² ist b = ${fmt(b)} und x = ${fmt(x0)} gegeben. Berechne zuerst g(${fmt(x0)}) und dann h(${fmt(x0)}) = f(g(${fmt(x0)})).`,
            "",
            [
              numberField("g(x) =", g, "", 0, {
                slips: [
                  {
                    value: x0 * x0 - b,
                    hint: "b wird addiert: g(x) = x² + b. Prüfe das Vorzeichen von b.",
                  },
                ],
              }),
              numberField("h(x) =", h, "", 0, {
                slips: [
                  {
                    value: g,
                    hint: "h(x) = f(g(x)) = g(x)²: Quadriere den Wert von g(x).",
                  },
                ],
              }),
            ],
            "Zuerst x in g einsetzen, dann g(x) in f: h(x) = (x² + b)².",
            [
              `Innere Funktion: g(${fmt(x0)}) = ${paren(x0, 0)}²${term(b, "", false)} = ${fmt(g)}.`,
              `Äußere Funktion: f(${fmt(g)}) = ${paren(g, 0)}² = ${fmt(h)}.`,
            ],
            `g(${fmt(x0)}) = ${fmt(g)} und h(${fmt(x0)}) = ${fmt(h)}.`,
            { x: x0, b, g, h },
          );
        }
        const t = rng.int(1, 9);
        const v = t + 2; // m/s
        const E = 2 * v * v; // J bei m = 4 kg
        const dE = 4 * v; // W: E′(t) = m · v(t) · v′(t) mit v′ = 1
        return task(
          2,
          "",
          `Ein Medizinball der Masse m = 4 kg bewegt sich mit v(t) = (t + 2) m/s. Seine kinetische Energie ist E(t) = ½ · m · v(t)². Wie schnell ist er nach ${t} s, wie groß ist dann seine Energie, und wie schnell ändert sich die Energie in diesem Moment?`,
          [
            numberField("v:", v, "m/s", 0),
            numberField("E:", E, "J", 0, {
              slips: [
                {
                  value: 2 * v,
                  hint: "Die Energie hängt am Quadrat der Geschwindigkeit: E = ½ · m · v², nicht ½ · m · v.",
                },
                {
                  value: v * v,
                  hint: "Der Faktor ½ · m = 2 fehlt: Bei m = 4 kg ist E = 2 · v².",
                },
              ],
            }),
            numberField("E′:", dE, "W", 0, {
              slips: [
                {
                  value: 2 * v,
                  hint: "E′(t) = m · v(t) · v′(t) = 4 · v · 1: Es zählt die ganze Masse m = 4 kg, nicht ½ · m.",
                },
              ],
            }),
          ],
          "E′(t) = m · v(t) · v′(t) mit der Kettenregel: äußere Ableitung 2 · ½ · m · v(t), innere Ableitung v′(t) = 1.",
          [
            `v(${t}) = ${t} + 2 = ${v} m/s.`,
            `E = ½ · 4 kg · (${v} m/s)² = 2 · ${v * v} = ${E} J.`,
            `E′ = m · v · v′ = 4 · ${v} · 1 = ${dE} W.`,
          ],
          `Nach ${t} s fährt der Ball ${v} m/s, seine Energie beträgt ${E} J und wächst um ${dE} W.`,
          { t, v, E, dE },
        );
      },
    },
    {
      id: "verkettet-ableitung",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.int(1, 6);
          const x0 = nonZero(rng, 3);
          const g = x0 * x0 + a;
          const aussen = 3 * g * g;
          const innen = 2 * x0;
          const hp = aussen * innen;
          return task(
            1,
            `Die Funktion h(x) = (x² + a)³ mit a = ${fmt(a)} ist verkettet: f(u) = u³ und g(x) = x² + ${fmt(a)}. Berechne für x = ${fmt(x0)} die äußere Ableitung f′(g(x)), die innere Ableitung g′(x) und daraus nach der Kettenregel h′(x).`,
            "",
            [
              numberField("f′(g(x)) =", aussen, "", 0, {
                slips: [
                  {
                    value: g,
                    hint: "f′(u) = 3u²: Die Ableitung von u³ ist das Dreifache des Quadrats.",
                  },
                ],
              }),
              numberField("g′(x) =", innen, "", 0, {
                slips: [
                  {
                    value: x0,
                    hint: "g′(x) = 2x: Bei x² wandert der Faktor 2 nach vorn.",
                  },
                ],
              }),
              numberField("h′(x) =", hp, "", 0, {
                slips: [
                  {
                    value: aussen + innen,
                    hint: "Die Kettenregel multipliziert die beiden Ableitungen, sie addiert sie nicht.",
                  },
                ],
              }),
            ],
            "Kettenregel: h′(x) = f′(g(x)) · g′(x) mit f′(u) = 3u² und g′(x) = 2x.",
            [
              `Innere Ableitung: g′(x) = 2x, also g′(${fmt(x0)}) = ${fmt(innen)}.`,
              `Äußere Ableitung an der Stelle g(${fmt(x0)}) = ${fmt(g)}: f′(${fmt(g)}) = 3 · ${paren(g, 0)}² = ${fmt(aussen)}.`,
              `Kettenregel: h′(${fmt(x0)}) = ${fmt(aussen)} · ${paren(innen)} = ${fmt(hp)}.`,
            ],
            `h′(${fmt(x0)}) = ${fmt(hp)}.`,
            { a, x: x0, g, aussen, innen, hp },
          );
        }
        const k = rng.int(2, 9);
        return task(
          2,
          "",
          `Die Konzentration c eines Farbstoffs (in mg/l) hängt in einem Experiment von der Zeit t (in min) ab: c(t) = e<sup>t² − ${k}·t</sup>. Wie schnell ändert sich die Konzentration nach ${fmt(k)} min, und wie groß ist sie dann?`,
          [
            numberField("Änderungsgeschwindigkeit:", k, "mg/l pro min", 0, {
              slips: [
                {
                  value: 2 * k,
                  hint: `Die innere Ableitung von t² − ${k}·t ist 2t − ${k}: Auch der zweite Summand zählt.`,
                },
              ],
            }),
            numberField("Konzentration:", 1, "mg/l", 0, {
              slips: [
                {
                  value: 0,
                  hint: "Der Exponent ist an der Stelle 0, und e⁰ ist 1, nicht 0.",
                },
              ],
            }),
            choiceField(
              "c(t) ist am kleinsten …",
              [
                `bei t = ${fmt(k / 2)} min`,
                `bei t = ${fmt(k)} min`,
                "bei t = 0 min",
              ],
              0,
            ),
          ],
          `Kettenregel mit e-Regel: c′(t) = g′(t) · e<sup>g(t)</sup> für g(t) = t² − ${k}·t und g′(t) = 2t − ${k}.`,
          [
            `Innere Funktion g(t) = t² − ${k}·t, äußere Funktion f(u) = e<sup>u</sup>; Kettenregel: c′(t) = (2t − ${k}) · e<sup>t² − ${k}·t</sup>.`,
            `Bei t = ${fmt(k)} ist der Exponent ${k}² − ${k} · ${k} = 0, also c(${fmt(k)}) = e<sup>0</sup> = 1 mg/l.`,
            `Ableitungswert: c′(${fmt(k)}) = (2 · ${k} − ${k}) · e<sup>0</sup> = ${fmt(k)} · 1 = ${fmt(k)} mg/l pro min.`,
          ],
          `Nach ${fmt(k)} min ist die Konzentration 1 mg/l und ändert sich um ${fmt(k)} mg/l pro min; am kleinsten ist c bei t = ${fmt(k / 2)} min.`,
          { k, rate: k, konz: 1, tmin: k / 2 },
        );
      },
    },
    {
      id: "untersuchen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const k = rng.int(2, 8);
          const a = k * k;
          const y = -(a * a * a);
          return task(
            1,
            `Untersuche die verkettete Funktion h(x) = (x² − a)³ mit dem Parameter a = ${fmt(a)}: innere Funktion g(x) = x² − ${fmt(a)}, äußere Funktion f(u) = u³. Bestimme den Definitionsbereich, die Nullstellen und den Extrempunkt von h.`,
            "",
            [
              choiceField(
                "Definitionsbereich von h",
                [
                  "𝔻 = ℝ",
                  `𝔻 = ℝ ohne x = ${fmt(-k)} und x = ${fmt(k)}`,
                  "𝔻 = {x | x ≥ 0}",
                ],
                0,
              ),
              numberField("kleinere Nullstelle x₁ =", -k, "", 0, {
                slips: [
                  {
                    value: k,
                    hint: `Aus x² = ${fmt(a)} folgt x = ±${k}: Die kleinere Nullstelle ist negativ.`,
                  },
                ],
              }),
              numberField("größere Nullstelle x₂ =", k, "", 0),
              numberField("x-Wert des Extrempunkts:", 0, "", 0),
              numberField("y-Wert des Extrempunkts:", y, "", 0, {
                slips: [
                  {
                    value: a * a * a,
                    hint: `Für x = 0 ist (0² − ${fmt(a)})³ = ${paren(-a)}³ = ${fmt(y)}: Der Wert ist negativ.`,
                  },
                  {
                    value: -(a * a),
                    hint: `Die dritte Potenz von ${fmt(-a)} ist ${fmt(y)}, nicht ${fmt(-(a * a))}.`,
                  },
                ],
              }),
            ],
            `Kettenregel: h′(x) = 6x(x² − ${fmt(a)})². Nullstellen aus h(x) = 0, Extremstelle aus h′(x) = 0; die Art zeigt eine Probe mit benachbarten Stellen.`,
            [
              `Definitionsbereich: h ist eine Verkettung von Polynomen, also ist 𝔻 = ℝ.`,
              `Nullstellen: h(x) = 0 genau dann, wenn x² − ${fmt(a)} = 0 ist, also x = ${fmt(-k)} oder x = ${fmt(k)}.`,
              `Kettenregel: h′(x) = 3(x² − ${fmt(a)})² · 2x = 6x(x² − ${fmt(a)})²; h′(x) = 0 für x = 0 und x = ±${k}.`,
              `Probe: h(0) = ${paren(-a)}³ = ${fmt(y)}; da (x² − ${fmt(a)})³ mit wachsendem Betrag von x wächst, ist P(0 | ${fmt(y)}) der Tiefpunkt. Bei x = ${fmt(-k)} und x = ${fmt(k)} berührt der Graph die x-Achse.`,
            ],
            `h hat die Nullstellen x = ${fmt(-k)} und x = ${fmt(k)}; der Tiefpunkt liegt bei P(0 | ${fmt(y)}) und für x → ±∞ strebt h(x) gegen ∞.`,
            { k, a, x1: -k, x2: k, xt: 0, yt: y },
          );
        }
        const k = rng.int(2, 9);
        const a = 3 * k;
        const y = -32 * k * k * k;
        return task(
          2,
          "",
          `Ein Kurvenzug wird durch h(x) = (x + a)² · (x − a) mit dem Parameter a = ${fmt(a)} beschrieben. Untersuche den Verlauf vollständig: Nullstellen, Extremstellen und das Verhalten für sehr große Beträge von x.`,
          [
            numberField("x-Wert des Tiefpunkts:", k, "", 0, {
              slips: [
                {
                  value: a,
                  hint: `x = ${fmt(a)} ist die größere Nullstelle, nicht der Tiefpunkt. Leite h nach der Produktregel ab und löse h′(x) = 0.`,
                },
              ],
            }),
            numberField("y-Wert des Tiefpunkts:", y, "", 0, {
              slips: [
                {
                  value: -y,
                  hint: `Bei x = ${fmt(k)} ist der Faktor (x − ${fmt(a)}) = ${fmt(k - a)} negativ, also ist h(${fmt(k)}) negativ.`,
                },
              ],
            }),
            numberField("größere Nullstelle x =", a, "", 0, {
              slips: [
                {
                  value: k,
                  hint: `Die Nullstellen liest du aus den Faktoren ab: x = ${fmt(-a)} und x = ${fmt(a)}.`,
                },
              ],
            }),
            choiceField(
              "Bei der kleineren Nullstelle …",
              [
                `… liegt bei x = ${fmt(-a)} ein Hochpunkt auf der x-Achse.`,
                `… geht der Graph bei x = ${fmt(-a)} durch die x-Achse.`,
                `… liegt bei x = ${fmt(-a)} ein Tiefpunkt auf der x-Achse.`,
              ],
              0,
            ),
            choiceField(
              "Für x → −∞ strebt h(x) …",
              ["… gegen −∞.", "… gegen ∞.", "… gegen 0."],
              0,
            ),
          ],
          "Ableiten mit Produkt- und Kettenregel, h′(x) = 0 lösen, die Art durch Vorzeichenwechsel bestimmen und die Nullstellen aus den Faktoren ablesen.",
          [
            `Nullstellen: (x + ${fmt(a)})² · (x − ${fmt(a)}) = 0 für x = ${fmt(-a)} (doppelte Nullstelle) und x = ${fmt(a)}.`,
            `Produkt- und Kettenregel: h′(x) = 2(x + ${fmt(a)}) · (x − ${fmt(a)}) + (x + ${fmt(a)})² = (x + ${fmt(a)}) · (3x − ${fmt(a)}).`,
            `h′(x) = 0 für x = ${fmt(-a)} und x = ${fmt(k)}; bei x = ${fmt(-a)} liegt ein Hochpunkt mit h = 0, bei x = ${fmt(k)} ein Tiefpunkt.`,
            `Tiefpunkt: h(${fmt(k)}) = ${fmt(k + a)}² · ${paren(k - a)} = ${fmt(y)}; für x → −∞ strebt h(x) gegen −∞ und für x → ∞ gegen ∞.`,
          ],
          `Der Tiefpunkt liegt bei P(${fmt(k)} | ${fmt(y)}), die größere Nullstelle ist x = ${fmt(a)}; bei x = ${fmt(-a)} liegt ein Hochpunkt auf der x-Achse und für x → −∞ strebt h(x) gegen −∞.`,
          { k, a, xt: k, yt: y, ns: a },
        );
      },
    },
  ],
});

// 4.2 Parameter bestimmen ───────────────────────────────────────────────────

const parameter = L(2, {
  id: "aw-2-parameter",
  title: "4.2 Parameter bestimmen",
  subtitle: "Bedingungen statt Werte",
  whyItMatters:
    "In Modellen sind oft nicht alle Zahlen bekannt, sondern nur Eigenschaften: Eine Kurve geht durch einen Messpunkt, eine Tangente hat eine bestimmte Steigung. Im Abitur musst du aus solchen Bedingungen Parameter bestimmen – eine Fähigkeit, die in Statistik, Physik und Wirtschaft täglich gebraucht wird.",
  explanationHtml: `
    <p>Manchmal kennt man nicht alle Zahlen eines Funktionsterms, sondern nur <strong>Bedingungen</strong>: Ein Punkt liegt auf dem Graphen, eine Tangente hat eine bestimmte Steigung, an einer Stelle liegt ein Extremum. Jede Bedingung wird durch Einsetzen zu einer <strong>Gleichung für die Parameter</strong>.</p>
    <ul>
      <li><strong>Punktbedingung:</strong> P(x₀ | y₀) liegt auf dem Graphen von f ⇒ f(x₀) = y₀.</li>
      <li><strong>Steigungsbedingung:</strong> Die Tangente an der Stelle x₀ hat die Steigung m ⇒ f′(x₀) = m.</li>
      <li><strong>Extremstellenbedingung:</strong> An der Stelle x₀ liegt ein Extremum ⇒ f′(x₀) = 0, hinreichend mit f″(x₀) ≠ 0.</li>
    </ul>
    <p>Zwei Bedingungen liefern ein <strong>Gleichungssystem</strong> mit zwei Gleichungen – so viele Gleichungen wie unbekannte Parameter. Du löst es durch Einsetzen, Subtrahieren oder Gleichsetzen.</p>
    <div class="example">f(x) = ax² + bx mit f(1) = 3 und f′(1) = 1. Einsetzen: f(1) = a + b = 3. Ableiten: f′(x) = 2ax + b, also f′(1) = 2a + b = 1. Subtrahieren: a = −2, damit b = 5. Kontrolle: f(x) = −2x² + 5x, f(1) = 3 ✓, f′(1) = −4 + 5 = 1 ✓.</div>
    <div class="merke"><strong>Merke:</strong> Jede Bedingung ist eine Gleichung. Bei zwei unbekannten Parametern brauchst du zwei Bedingungen – und zum Schluss eine Kontrolle durch Einsetzen.</div>
  `,
  formulas: [
    {
      name: "Punktbedingung",
      html: "f(x₀) = y₀",
      quantities: "P(x₀ | y₀) liegt auf dem Graphen",
    },
    {
      name: "Steigungsbedingung",
      html: "f′(x₀) = m",
      quantities: "Tangente an der Stelle x₀ hat die Steigung m",
    },
    {
      name: "Extremstellenbedingung",
      html: "f′(x₀) = 0, Kontrolle mit f″(x₀) ≠ 0",
      quantities: "x₀ ist eine Extremstelle von f",
    },
  ],
  quiz: {
    question:
      "Welche Gleichung liefert die Bedingung, dass die Tangente an den Graphen von f(x) = ax² + bx an der Stelle x = 1 die Steigung 5 hat?",
    options: ["2a + b = 5", "a + b = 5", "a · b = 5"],
    correctIndex: 0,
    explanation:
      "f′(x) = 2ax + b, also ist f′(1) = 2a + b. Die Bedingung lautet daher 2a + b = 5. Die Gleichung a + b = 5 entstünde aus der Punktbedingung f(1) = 5.",
  },
  lab: lab(
    "parameter",
    "Bedingungen einstellen",
    "f(x) = a·x³ + b·x mit den ziehbaren Punkten P(1 | f(1)) und Q(−1 | f(−1)). Die gestrichelte Linie bei y = 2 zeigt das Ziel der Punktbedingung. P zieht b, Q zieht a. Wähle oben, welche Bedingung du erfüllen willst.",
    [
      range("a", "Parameter a in f(x) = a·x³ + b·x", -3, 3, 1, 0.5),
      range("b", "Parameter b in f(x)", -4, 4, 0, 0.5),
      choice("bedingung", "Zu erfüllende Bedingung", [
        "f(1) = 2",
        "f′(1) = 0",
        "f(1) = 2 und f′(1) = 0",
      ]),
    ],
    [
      {
        key: "f1",
        label: "f(1)",
        compute: (v: LabValues) => paramF(v, 1),
        digits: 2,
        emphasis: true,
      },
      {
        key: "df1",
        label: "f′(1)",
        compute: (v: LabValues) => paramDf(v, 1),
        digits: 2,
      },
      {
        key: "funktion",
        label: "Funktionsterm",
        compute: (v: LabValues) =>
          `f(x) = ${sum([[v.a, "x³"], [v.b, "x"]])}`,
      },
      {
        key: "erfuellt",
        label: "Bedingung",
        compute: (v: LabValues) => {
          const f1 = paramF(v, 1);
          const df1 = paramDf(v, 1);
          const ok =
            (v.bedingung !== 1 && Math.abs(f1 - 2) < 1e-9) ||
            (v.bedingung !== 0 && Math.abs(df1) < 1e-9);
          return ok ? "erfüllt" : "noch nicht erfüllt";
        },
      },
      {
        key: "abstand",
        label: "Abstand zur Zielbedingung",
        compute: (v: LabValues) => {
          const f1 = paramF(v, 1);
          const df1 = paramDf(v, 1);
          if (v.bedingung === 0) return Math.abs(f1 - 2);
          if (v.bedingung === 1) return Math.abs(df1);
          return Math.abs(f1 - 2) + Math.abs(df1);
        },
        digits: 2,
      },
    ],
    [
      {
        id: "punktbedingung",
        text: "Stelle die Parameter so ein, dass f(1) = 2 ist.",
        check: (v: LabValues) => Math.abs(paramF(v, 1) - 2) < 1e-9,
      },
      {
        id: "steigung-null",
        text: "Stelle f′(1) = 0 ein, ohne dass f(1) verschwindet.",
        check: (v: LabValues) =>
          Math.abs(paramDf(v, 1)) < 1e-9 && Math.abs(paramF(v, 1)) > 1e-9,
      },
      {
        id: "beide",
        text: "Erfülle beide Bedingungen gleichzeitig: f(1) = 2 und f′(1) = 0.",
        check: (v: LabValues) =>
          Math.abs(paramF(v, 1) - 2) < 1e-9 && Math.abs(paramDf(v, 1)) < 1e-9,
      },
    ],
  ),
  exercises: [
    {
      id: "parameter-punkt",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = nonZero(rng, 6);
          const b = rng.int(-6, 6);
          const x0 = rng.int(1, 4);
          const y0 = a * x0 * x0 + b * x0;
          if (rng.int(0, 1) === 0) {
            return task(
              1,
              `Die Funktion f(x) = a·x² + bx geht durch den Punkt P(${fmt(x0)} | ${fmt(y0)}). Der Parameter b = ${fmt(b)} ist bekannt. Bestimme a.`,
              "",
              [
                numberField("a =", a, "", 0, {
                  slips: [
                    {
                      value: b,
                      hint: "a und b sind verschiedene Parameter: Löse die Gleichung nach a auf.",
                    },
                  ],
                }),
              ],
              "Punktbedingung: f(x₀) = y₀ einsetzen und die Gleichung nach dem unbekannten Parameter auflösen.",
              [
                `Einsetzen: f(${fmt(x0)}) = ${x0 * x0}a${term(b * x0, "", false)} = ${fmt(y0)}.`,
                `Auflösen: ${x0 * x0}a = ${fmt(y0)}${term(-b * x0, "", false)} = ${fmt(y0 - b * x0)}, also a = ${fmt(y0 - b * x0)} : ${fmt(x0 * x0)} = ${fmt(a)}.`,
              ],
              `a = ${fmt(a)}.`,
              { a, b, x: x0, y: y0 },
            );
          }
          return task(
            1,
            `Die Funktion f(x) = ax² + bx geht durch den Punkt P(${fmt(x0)} | ${fmt(y0)}). Der Parameter a = ${fmt(a)} ist bekannt. Bestimme b.`,
            "",
            [
              numberField("b =", b, "", 0, {
                slips: [
                  {
                    value: a,
                    hint: "a und b sind verschiedene Parameter: Löse die Gleichung nach b auf.",
                  },
                ],
              }),
            ],
            "Punktbedingung: f(x₀) = y₀ einsetzen und die Gleichung nach dem unbekannten Parameter auflösen.",
            [
              `Einsetzen: f(${fmt(x0)}) = ${fmt(a * x0 * x0)}${term(b * x0, "b", false)} = ${fmt(y0)}.`,
              `Auflösen: ${x0}b = ${fmt(y0)}${term(-a * x0 * x0, "", false)} = ${fmt(y0 - a * x0 * x0)}, also b = ${fmt(y0 - a * x0 * x0)} : ${x0} = ${fmt(b)}.`,
            ],
            `b = ${fmt(b)}.`,
            { a, b, x: x0, y: y0 },
          );
        }
        const a = rng.int(1, 8);
        const b = rng.int(1, 6);
        const y1 = a + b;
        const y2 = 4 * a + 2 * b;
        return task(
          2,
          "",
          `Der Umsatz U eines Betriebs (in 1000 €) hängt vom Werbebudget x (in 1000 €) ab: U(x) = a·x² + b·x. Messpunkte: Für x = 1 ist U = ${fmt(y1)}, für x = 2 ist U = ${fmt(y2)}. Bestimme die Parameter a und b.`,
          [
            numberField("a =", a, "", 0, {
              slips: [
                {
                  value: a + b,
                  hint: "a + b ist der Messwert U(1), nicht der Parameter a. Löse das Gleichungssystem.",
                },
              ],
            }),
            numberField("b =", b, "", 0),
          ],
          "Zwei Punkte liefern zwei Gleichungen: U(1) = a + b und U(2) = 4a + 2b. Subtrahieren, bis nur eine Unbekannte übrig bleibt.",
          [
            `I: a + b = ${fmt(y1)}; II: 4a + 2b = ${fmt(y2)}.`,
            `II − 2 · I: 2a = ${fmt(y2 - 2 * y1)}, also a = ${fmt(a)}; dann b = ${fmt(y1)} − ${fmt(a)} = ${fmt(b)}.`,
          ],
          `Es gilt a = ${fmt(a)} und b = ${fmt(b)}, also U(x) = ${sum([[a, "x²"], [b, "x"]])} (U in 1000 €).`,
          { a, b, y1, y2 },
        );
      },
    },
    {
      id: "parameter-tangente",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.int(-6, 6);
          const x0 = rng.int(1, 4);
          const m = 2 * x0 + a;
          return task(
            1,
            `Die Tangente an den Graphen von f(x) = x² + a·x + 3 hat an der Stelle x₀ = ${fmt(x0)} die Steigung m = ${fmt(m)}. Bestimme den Parameter a.`,
            "",
            [
              numberField("a =", a, "", 0, {
                slips: [
                  {
                    value: m,
                    hint: "m ist die Steigung der Tangente, nicht der Parameter. Leite zuerst ab: f′(x) = 2x + a.",
                  },
                ],
              }),
            ],
            "Steigungsbedingung: f′(x₀) = m. Für f(x) = x² + a·x + 3 ist f′(x) = 2x + a.",
            [
              `Ableitung: f′(x) = 2x + a.`,
              `Bedingung: 2 · ${fmt(x0)} + a = ${fmt(m)}, also a = ${fmt(m)} − ${fmt(2 * x0)} = ${fmt(a)}.`,
            ],
            `a = ${fmt(a)}.`,
            { a, x: x0, m },
          );
        }
        const a = rng.int(1, 8);
        const p = rng.int(1, 5);
        const x0 = rng.int(1, 3);
        const m = 2 * a * x0 + p;
        const fx = a * x0 * x0 + p * x0;
        return task(
          2,
          "",
          `Die Tangente am Graphen von f(x) = a·x² + ${fmt(p)}x soll an der Stelle x = ${fmt(x0)} die Steigung ${fmt(m)} haben. Bestimme a und den zugehörigen Funktionswert f(${fmt(x0)}).`,
          [
            numberField("a =", a, "", 0, {
              slips: [
                {
                  value: m - p,
                  hint: "Nach f′(x₀) = m musst du die Differenz noch durch 2 · x₀ teilen.",
                },
              ],
            }),
            numberField("f(x) =", fx, "", 0),
          ],
          "f′(x) = 2a·x + p; die Bedingung f′(x₀) = m liefert a, danach wertest du f(x₀) aus.",
          [
            `Ableitung: f′(x) = 2a·x + ${fmt(p)}; Bedingung: ${fmt(2 * x0)}a${term(p, "", false)} = ${fmt(m)}.`,
            `Auflösen: ${fmt(2 * x0)}a = ${fmt(m - p)}, also a = ${fmt(a)}.`,
            `Funktionswert: f(${fmt(x0)}) = ${fmt(a)} · ${x0}²${term(p * x0, "", false)} = ${fmt(fx)}.`,
          ],
          `Es ist a = ${fmt(a)} und f(${fmt(x0)}) = ${fmt(fx)}.`,
          { a, p, x: x0, m, fx },
        );
      },
    },
  ],
});

// 4.3 Extremwertprobleme ────────────────────────────────────────────────────

const maximumAmRand = (v: LabValues): boolean => {
  const analyse = extremAnalyse(v);
  const rechts = analyse.punkte[analyse.punkte.length - 1];
  return analyse.punkte.every((p) => p === rechts || p.y < rechts.y - 1e-9);
};

const zweiExtremstellen = (v: LabValues): boolean =>
  extremAnalyse(v).roots.filter((x) => x > v.l + 1e-9 && x < v.r - 1e-9)
    .length === 2;

const minimumImInneren = (v: LabValues): boolean => {
  const analyse = extremAnalyse(v);
  const f = (x: number) => v.a * x ** 3 + v.b * x * x + v.c * x;
  return analyse.punkte.some(
    (p) =>
      p.art === "inner" && p.y < f(v.l) - 1e-9 && p.y < f(v.r) - 1e-9,
  );
};

const extremwerte = L(3, {
  id: "aw-3-extremwerte",
  title: "4.3 Extremwertprobleme",
  subtitle: "Hoch, tief, und was am Rand passiert",
  whyItMatters:
    "Abituraufgaben fragen fast immer nach dem größten oder kleinsten Wert – vom maximalen Ertrag bis zur minimalen Baukosten. Wer die Kandidatenliste systematisch aufstellt, verliert dabei keine Punkte; das ist im Studium und in der Praxis nicht anders.",
  explanationHtml: `
    <p>Ein <strong>Extremwertproblem</strong> fragt nach dem größten oder kleinsten Wert einer Größe – im Inneren eines Intervalls oder an seinen Rändern. So gehst du vor (Wiederholung aus M12, hier mit dem Randvergleich):</p>
    <ol class="steps">
      <li><strong>Nullstellen der Ableitung</strong> bestimmen: f′(x) = 0 lösen. Das sind die Kandidaten im Inneren.</li>
      <li><strong>Hinreichende Bedingung</strong> prüfen: f″(x₀) positiv ⇒ lokales Minimum, f″(x₀) negativ ⇒ lokales Maximum (alternativ Vorzeichenwechsel von f′).</li>
      <li><strong>Randwerte</strong> f(a) und f(b) des Intervalls [a; b] berechnen.</li>
      <li><strong>Vergleichen:</strong> Der größte bzw. kleinste Wert der Kandidatenliste ist der globale Extremwert.</li>
    </ol>
    <p>Warum Schritt 3? Auf einem beschränkten Intervall kann das globale Extremum am Rand liegen, obwohl dort f′ nicht 0 ist.</p>
    <div class="example">f(x) = x³ − 3x auf [−2; 2]: f′(x) = 3x² − 3 = 0 ⇒ x = −1 oder x = 1. Kandidatenliste: f(−2) = −2, f(−1) = 2, f(1) = −2, f(2) = 2. Das globale Maximum ist 2 (bei x = −1 und x = 2), das globale Minimum −2 (bei x = 1 und x = −2). Hinreichend: f″(−1) = −6 ist negativ ⇒ lokales Maximum, f″(1) = 6 ist positiv ⇒ lokales Minimum.</div>
    <div class="merke"><strong>Merke:</strong> Kandidaten sind die Nullstellen von f′ und die Ränder des Definitionsbereichs. Ohne Randvergleich findest du Extremwerte auf beschränkten Intervallen nicht sicher.</div>
  `,
  formulas: [
    {
      name: "Kandidatenliste",
      html: "f′(x) = 0 lösen, dazu f(a) und f(b) auf [a; b]",
      quantities: "alle Kandidaten für globale Extremwerte",
    },
    {
      name: "Hinreichende Bedingung",
      html: "f″(x₀) positiv ⇒ Minimum, f″(x₀) negativ ⇒ Maximum",
      quantities: "x₀ aus f′(x₀) = 0",
    },
    {
      name: "Globaler Extremwert",
      html: "größter bzw. kleinster Wert der Kandidatenliste",
      quantities: "inklusive der Randwerte",
    },
  ],
  quiz: {
    question:
      "Welche Stellen gehören in die Kandidatenliste für das globale Maximum von f auf dem Intervall [a; b]?",
    options: [
      "Die Nullstellen von f′ im Inneren und beide Randwerte f(a) und f(b).",
      "Nur die Nullstellen von f′ im Inneren des Intervalls.",
      "Nur die Randwerte f(a) und f(b) des Intervalls.",
    ],
    correctIndex: 0,
    explanation:
      "Am globalen Maximum kommen nur Stellen mit f′(x) = 0 im Inneren infrage – oder die Ränder des Intervalls, an denen die Ableitung nicht 0 sein muss. Deshalb vergleicht man beide Gruppen.",
  },
  lab: lab(
    "extremwert",
    "Kandidaten sammeln",
    "f(x) = a·x³ + b·x² + c·x auf dem Intervall von l bis r. Die farbige Fläche zeigt das Intervall, die Punkte sind die Kandidaten: Randwerte (orange) und Nullstellen von f′ im Inneren (grün). Ziehe die Ränder und stelle a, b und c ein.",
    [
      range("a", "Faktor a in f(x) = a·x³ + b·x² + c·x", -2, 2, 0, 0.5),
      range("b", "Faktor b", -3, 3, -1, 0.5),
      range("c", "Faktor c", -4, 4, 0, 0.5),
      range("l", "linke Intervallgrenze", -4, 0, -1, 0.5),
      range("r", "rechte Intervallgrenze", 0.5, 4, 1, 0.5),
    ],
    [
      {
        key: "ableitung",
        label: "Ableitung",
        compute: (v: LabValues) =>
          `f′(x) = ${quadratic(3 * v.a, 2 * v.b, v.c)}`,
      },
      {
        key: "nullstellen",
        label: "Nullstellen von f′",
        compute: (v: LabValues) => {
          const roots = extremAnalyse(v).roots;
          if (roots.length === 0) return "keine Nullstelle";
          return roots
            .map((x, i) => `x${i === 0 ? "₁" : "₂"} = ${fmt(x)}`)
            .join("; ");
        },
      },
      {
        key: "kandidaten",
        label: "Kandidatenliste",
        compute: (v: LabValues) =>
          extremAnalyse(v)
            .punkte.map((p) => `f(${fmt(p.x)}) = ${fmt(p.y)}`)
            .join("; "),
        emphasis: true,
      },
      {
        key: "gmax",
        label: "globales Maximum",
        compute: (v: LabValues) => extremAnalyse(v).gmax,
        digits: 2,
      },
      {
        key: "gmin",
        label: "globales Minimum",
        compute: (v: LabValues) => extremAnalyse(v).gmin,
        digits: 2,
      },
      {
        key: "lage",
        label: "Lage der Extremwerte",
        compute: (v: LabValues) => {
          const a = extremAnalyse(v);
          const ort = (x: number) =>
            x === v.l
              ? "linker Rand"
              : x === v.r
                ? "rechter Rand"
                : "im Inneren";
          return `Maximum bei x = ${fmt(a.argmax)} (${ort(a.argmax)}), Minimum bei x = ${fmt(a.argmin)} (${ort(a.argmin)})`;
        },
      },
    ],
    [
      {
        id: "maximum-am-rand",
        text: "Stelle ein, dass das globale Maximum auf dem rechten Rand liegt.",
        check: maximumAmRand,
      },
      {
        id: "zwei-extremstellen",
        text: "Erzeuge mit f′ zwei Nullstellen im Intervall: lokales Maximum und lokales Minimum.",
        check: zweiExtremstellen,
      },
      {
        id: "minimum-im-inneren",
        text: "Stelle ein, dass das globale Minimum im Inneren des Intervalls liegt.",
        check: minimumImInneren,
      },
    ],
  ),
  exercises: [
    {
      id: "extremwert",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const d = rng.pick([1, 2, 4]);
          const e = rng.int(6, 12);
          const s = rng.sign();
          const r = d + 3;
          const f0 = s * d * d + e;
          const fd = e;
          const fr = s * 9 + e;
          const werte = [f0, fd, fr];
          const vmax = Math.max(...werte);
          const vmin = Math.min(...werte);
          const argmax = vmax === fd ? d : vmax === f0 ? 0 : r;
          return task(
            1,
            `Die Funktion f(x) = ${quadratic(s, -2 * s * d, s * d * d + e)} soll auf dem Intervall [0; ${fmt(r)}] untersucht werden. Bestimme den größten und den kleinsten Funktionswert auf diesem Intervall sowie die Stelle x, an der der größte Wert angenommen wird.`,
            "",
            [
              numberField("Größter Wert:", vmax, "", 0),
              numberField("Kleinster Wert:", vmin, "", 0),
              numberField("Stelle des größten Werts:", argmax, "", 0, {
                slips: [
                  {
                    value: -argmax,
                    hint: "Achte auf das Vorzeichen der Stelle: Vergleiche die Kandidatenliste mit ihren x-Werten.",
                  },
                ],
              }),
            ],
            "Auf [0; r] zuerst f′ = 0 lösen, dann f an der inneren Stelle und an beiden Randwerten vergleichen.",
            [
              `Ableitung: f′(x) = ${linear(2 * s, -2 * s * d)}; Nullstelle x = ${fmt(d)} liegt im Intervall.`,
              `Kandidaten: f(0) = ${fmt(f0)}, f(${fmt(d)}) = ${fmt(fd)}, f(${fmt(r)}) = ${fmt(fr)}.`,
              `Vergleich: ${fmt(vmax)} ist der größte, ${fmt(vmin)} der kleinste Wert.`,
            ],
            `Größter Wert ${fmt(vmax)} bei x = ${fmt(argmax)}, kleinster Wert ${fmt(vmin)}.`,
            { d, e, s, r, f0, fd, fr, vmax, vmin, argmax },
          );
        }
        const d = rng.int(2, 4);
        const k = rng.int(2, 9);
        const e = d * d + k;
        return task(
          2,
          "",
          `Ein Ball wird aus einer Höhe von ${fmt(k)} m geworfen; seine Höhe nach t Sekunden ist h(t) = ${sum([[-1, "t²"], [2 * d, "t"], [k, ""]])} (t in s, h in m). Wie hoch steigt der Ball, und nach welcher Zeit erreicht er die größte Höhe?`,
          [
            numberField("größte Höhe:", e, "m", 0),
            numberField("Zeit:", d, "s", 0),
          ],
          "Leite h ab und löse h′(t) = 0; die größte Höhe ist h an dieser Stelle. Prüfe mit der zweiten Ableitung, ob es ein Maximum ist.",
          [
            `Ableitung: h′(t) = ${sum([[-2, "t"], [2 * d, ""]])}; h′(t) = 0 ⇒ t = ${fmt(d)} s.`,
            `Zweite Ableitung h″(t) = −2, also negativ ⇒ Maximum. Höhe: h(${fmt(d)}) = ${fmt(e)} m.`,
          ],
          `Der Ball steigt ${fmt(e)} m hoch und erreicht diese Höhe nach ${fmt(d)} s.`,
          { d, k, e },
        );
      },
    },
    {
      id: "parameter-extremum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const k = rng.int(1, 6);
          const a = -3 * k * k;
          return task(
            1,
            `Für die Funktion f(x) = x³ + a·x soll die Stelle x = ${fmt(k)} eine Extremstelle sein. Bestimme den Parameter a.`,
            "",
            [
              numberField("a =", a, "", 0, {
                slips: [
                  {
                    value: -a,
                    hint: "Vorzeichen: Aus 3 · x₀² + a = 0 folgt a = −3 · x₀², also ein negativer Wert.",
                  },
                ],
              }),
            ],
            "Extremstellenbedingung: f′(x₀) = 0. Für f(x) = x³ + a·x ist f′(x) = 3x² + a.",
            [
              `Ableitung: f′(x) = 3x² + a.`,
              `Bedingung: f′(${fmt(k)}) = 3 · ${k}² + a = ${fmt(3 * k * k)} + a = 0, also a = −${fmt(3 * k * k)} = ${fmt(a)}.`,
            ],
            `a = ${fmt(a)}.`,
            { k, a },
          );
        }
        const k = rng.int(1, 3);
        const s = rng.sign();
        const x0 = s * k;
        const a = -3 * k * k;
        const fval = x0 ** 3 + a * x0;
        return task(
          2,
          "",
          `Für f(x) = x³${term(a, "x", false)} ist x = ${fmt(x0)} eine Extremstelle. Prüfe mit der hinreichenden Bedingung, ob dort ein lokales Maximum oder ein lokales Minimum vorliegt, und gib den zugehörigen Funktionswert f(${fmt(x0)}) an.`,
          [
            choiceField(
              "An der Stelle liegt ein …",
              ["lokales Maximum", "lokales Minimum"],
              x0 < 0 ? 0 : 1,
            ),
            numberField("f(x) =", fval, "", 0),
          ],
          "f″(x) = 6x entscheidet: positiv ⇒ Minimum, negativ ⇒ Maximum. Setze danach x₀ in f ein.",
          [
            `Ableitungen: f′(x) = 3x²${term(a, "", false)} und f″(x) = 6x.`,
            `f″(${fmt(x0)}) = ${fmt(6 * x0)} ist ${x0 < 0 ? "negativ" : "positiv"} ⇒ lokales ${x0 < 0 ? "Maximum" : "Minimum"}; f(${fmt(x0)}) = ${fmt(fval)}.`,
          ],
          `An der Stelle x = ${fmt(x0)} liegt ein lokales ${x0 < 0 ? "Maximum" : "Minimum"} mit f(${fmt(x0)}) = ${fmt(fval)}.`,
          { k, s, x: x0, a, fval },
        );
      },
    },
  ],
});

// 4.4 Extremwerte in Sachzusammenhängen ─────────────────────────────────────

const zielFunktionBesser = (v: LabValues): boolean => {
  const w = sachWerte(v);
  return (
    w.erfuellt &&
    (w.minimieren ? w.F <= 0.9 * w.Fstart : w.F >= 1.1 * w.Fstart)
  );
};

const sachzusammenhaenge = L(4, {
  id: "aw-4-sachzusammenhaenge",
  title: "4.4 Extremwerte in Sachzusammenhängen",
  subtitle: "Modellieren, lösen, zurückübersetzen",
  whyItMatters:
    "Extremwertprobleme aus der Wirklichkeit sind fester Bestandteil des Abiturs und der Kern jeder Optimierung im Beruf – von der sparsamsten Verpackung bis zur günstigsten Produktion. Entscheidend ist nicht das Ableiten, sondern das Modellieren und Prüfen des Ergebnisses.",
  explanationHtml: `
    <p>Ein Extremwertproblem aus der Wirklichkeit löst du in fünf Schritten: <strong>Variablen wählen</strong> (was ist x?), <strong>Zielfunktion aufstellen</strong> (was soll maximal oder minimal werden?), <strong>Definitionsbereich festlegen</strong> (Längen sind positiv, ein Budget ist begrenzt), <strong>lösen</strong> (f′ = 0 plus Randvergleich) und <strong>zurückübersetzen</strong>: Ist das Ergebnis sinnvoll? Passt die Einheit? Was passiert an den Grenzen?</p>
    <p>Ein klassisches Beispiel: Mit 24 m Zaun soll ein rechteckiges Gehege an einer Mauer eingeschlossen werden. Mit x als Breite senkrecht zur Mauer und y als Länge parallel dazu gilt 2x + y = 24, also y = 24 − 2x. Die Zielfunktion ist A(x) = x · (24 − 2x) mit 𝔻 = {x | 0 &lt; x &lt; 12}.</p>
    <div class="example">A(x) = 24x − 2x², A′(x) = 24 − 4x = 0 ⇒ x = 6 m. A″ = −4 ist negativ ⇒ Maximum. A(6) = 72 m². Randkontrolle: A(0) = 0 und A(12) = 0, also ist 72 m² tatsächlich das globale Maximum. Zurückübersetzen: Das Gehege ist 6 m breit und 12 m lang – beides plausible Längen, und die Fläche passt zur Größenordnung des Zauns.</div>
    <div class="merke"><strong>Merke:</strong> Das mathematische Extremum ist nur so gut wie das Modell. Prüfe immer Definitionsbereich, Einheiten und die Wirklichkeit – eine negative Länge ist keine Lösung.</div>
  `,
  formulas: [
    {
      name: "Zielfunktion",
      html: "A(x) = x · (P − 2x)",
      quantities: "x Breite senkrecht zur Mauer, P Zaunlänge, A Fläche",
    },
    {
      name: "Lösungsschritte",
      html: "f′(x) = 0 lösen, Definitionsbereich prüfen, Randwerte vergleichen",
      quantities: "Reihenfolge beim Extremwertproblem",
    },
    {
      name: "Validierung",
      html: "Einheiten, Größenordnung und Grenzfälle prüfen",
      quantities: "Rückübersetzung ins Sachproblem",
    },
  ],
  quiz: {
    question:
      "Mit 24 m Zaun wird an einer Mauer ein rechteckiges Gehege eingeschlossen; x ist die Breite senkrecht zur Mauer. Welche Zielfunktion beschreibt den Flächeninhalt?",
    options: ["A(x) = x · (24 − 2x)", "A(x) = x · (24 − x)", "A(x) = 2 · (24 − 2x)"],
    correctIndex: 0,
    explanation:
      "Der Zaun bildet zwei Breitenseiten und eine Längsseite: 2x + y = 24, also y = 24 − 2x. Die Fläche des Rechtecks ist A(x) = x · y = x · (24 − 2x). Bei A(x) = x · (24 − x) würde nur eine Breitenseite gezaunt.",
  },
  lab: lab(
    "sachextremum",
    "Modellieren und prüfen",
    "Vier Modelle, immer derselbe Weg: Zielfunktion, Nebenbedingung, Optimum. Zieh die Ecke des Rechtecks oder stelle x ein. Die Balken vergleichen die Zielfunktion mit dem Optimum und mit dem Startwert x = 2; unten steht, ob die Nebenbedingung erfüllt ist.",
    [
      choice("kontext", "Modell", [
        "Zaun an einer Mauer",
        "Kanister mit Deckel",
        "offener Kanal",
        "Lager mit zwei Trennwänden",
      ]),
      range("x", "Eingangsgröße x", 1, 15, 2, 0.5),
      {
        ...range("P", "Zaun- oder Materiallänge P", 16, 48, 24, 4, "m"),
        showIf: (v: LabValues) => v.kontext === 0 || v.kontext === 3,
      },
      {
        ...range("V", "Volumen V", 800, 1200, 1000, 100, "cm³"),
        showIf: (v: LabValues) => v.kontext === 1,
      },
      {
        ...range("A", "Querschnittsfläche A", 6, 12, 8, 2, "m²"),
        showIf: (v: LabValues) => v.kontext === 2,
      },
    ],
    [
      {
        key: "zielfunktion",
        label: "Zielfunktion",
        compute: (v: LabValues) => {
          const w = sachWerte(v);
          return `${w.formel} bei x = ${fmt(v.x)}: ${fmt(w.F)} ${w.einheitF}`;
        },
        emphasis: true,
      },
      {
        key: "optimum",
        label: "Optimum x*",
        compute: (v: LabValues) => {
          const w = sachWerte(v);
          const zeichen =
            Math.abs(w.xOpt - Math.round(w.xOpt * 100) / 100) < 1e-9
              ? "="
              : "≈";
          return `x* ${zeichen} ${fmt(w.xOpt)} ${w.einheitX}, dort ${fmt(w.Fopt)} ${w.einheitF}`;
        },
      },
      {
        key: "nb",
        label: "Nebenbedingung",
        compute: (v: LabValues) => {
          const w = sachWerte(v);
          const forderung =
            w.yRichtung === "min"
              ? `mindestens ${fmt(w.yGrenze)} ${w.einheitX}`
              : `höchstens ${fmt(w.yGrenze)} ${w.einheitX}`;
          return w.erfuellt
            ? `erfüllt: ${w.yName} = ${fmt(w.y)} ${w.einheitX}`
            : `verletzt: ${w.yName} = ${fmt(w.y)} ${w.einheitX}, gefordert ${forderung}`;
        },
      },
      {
        key: "abstand",
        label: "Abstand zum Optimum",
        compute: (v: LabValues) => Math.abs(v.x - sachWerte(v).xOpt),
        digits: 2,
      },
      {
        key: "vergleich",
        label: "Vergleich mit dem Startwert",
        compute: (v: LabValues) => {
          const w: SachWerte = sachWerte(v);
          return w.minimieren
            ? w.F <= 0.9 * w.Fstart
              ? `mindestens 10 % besser als der Startwert ${fmt(w.Fstart)} ${w.einheitF}`
              : `noch nicht 10 % besser als der Startwert ${fmt(w.Fstart)} ${w.einheitF}`
            : w.F >= 1.1 * w.Fstart
              ? `mindestens 10 % besser als der Startwert ${fmt(w.Fstart)} ${w.einheitF}`
              : `noch nicht 10 % besser als der Startwert ${fmt(w.Fstart)} ${w.einheitF}`;
        },
      },
    ],
    [
      {
        id: "optimum",
        text: "Stelle x auf das Optimum der Zielfunktion ein (Abstand höchstens ein Reglerschritt).",
        check: (v: LabValues) =>
          Math.abs(v.x - sachWerte(v).xOpt) <= 0.5 + 1e-9,
      },
      {
        id: "besser",
        text: "Halte die Nebenbedingung ein und verbessere die Zielfunktion um mindestens 10 % gegenüber dem Startwert x = 2.",
        check: zielFunktionBesser,
      },
      {
        id: "nb-verletzt",
        text: "Finde eine Einstellung, bei der die Nebenbedingung verletzt ist – der Readout zeigt es.",
        check: (v: LabValues) => !sachWerte(v).erfuellt,
      },
    ],
  ),
  exercises: [
    {
      id: "sachextremum",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const P = rng.pick([20, 22, 24, 26, 28, 30, 32]);
          const x = P / 4;
          const flaeche = (P * P) / 8;
          return task(
            1,
            `An einer Mauer wird mit ${P} m Zaun ein rechteckiges Gehege eingeschlossen; x ist die Breite senkrecht zur Mauer, y die Länge parallel dazu mit 2x + y = ${P}. Wie groß muss x sein, damit die Fläche A(x) = x · (${P} − 2x) maximal wird, und wie groß ist dann diese Fläche?`,
            "",
            [
              numberField("x =", x, "m", 1),
              numberField("A =", flaeche, "m²", 1),
            ],
            "A(x) = x · (P − 2x) ableiten: A′(x) = P − 4x. A′(x) = 0 lösen und die Randwerte A(0) und A(P : 2) vergleichen.",
            [
              `A(x) = x · (${P} − 2x) = ${P}x − 2x²; A′(x) = ${P} − 4x.`,
              `A′(x) = 0 ⇒ x = ${P} : 4 = ${fmt(x)} m; A″ = −4 ist negativ ⇒ Maximum.`,
              `Randwerte: A(0) = 0 und A(${fmt(P / 2)}) = 0, also ist A(${fmt(x)}) = ${fmt(flaeche)} m² das globale Maximum.`,
            ],
            `Die Breite beträgt ${fmt(x)} m und die größte Fläche ${fmt(flaeche)} m².`,
            { P, x, A: flaeche },
          );
        }
        const v0 = rng.int(6, 12);
        const V = v0 ** 3;
        const O = 6 * v0 * v0;
        return task(
          2,
          "",
          `Ein Kanister mit Deckel hat eine quadratische Grundfläche mit der Kantenlänge x (in cm) und das feste Volumen V = ${V} cm³ (also die Höhe h = V : x²). Seine Oberfläche beträgt O(x) = 2x² + 4 · ${V} : x cm². Wie groß muss x sein, damit die Oberfläche minimal ist, und wie groß ist sie dann?`,
          [
            numberField("x =", v0, "cm", 0),
            numberField("O =", O, "cm²", 0),
          ],
          "O′(x) = 4x − 4 · V : x²; setze O′ = 0, multipliziere mit x² und ziehe die dritte Wurzel.",
          [
            `O(x) = 2x² + ${fmt(4 * V)} : x; O′(x) = 4x − ${fmt(4 * V)} : x².`,
            `O′(x) = 0 ⇒ 4x³ = ${fmt(4 * V)} ⇒ x³ = ${V} ⇒ x = ${v0} cm. O″(x) = 4 + ${fmt(8 * V)} : x³ ist positiv ⇒ Minimum.`,
            `Probe: h = ${V} : ${v0}² = ${v0} cm und O(${v0}) = 2 · ${fmt(v0 * v0)} + 4 · ${fmt(v0 * v0)} = ${fmt(O)} cm².`,
          ],
          `Bei x = ${v0} cm ist die Oberfläche mit ${fmt(O)} cm² am kleinsten.`,
          { v: v0, V, O },
        );
      },
    },
    {
      id: "modell-pruefen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const x = rng.pick([3, 5, 8, 10, 11, 13]);
          const y = 24 - 2 * x;
          return task(
            1,
            `Ein Gehegemodell mit 24 m Zaun an einer Mauer hat die Nebenbedingung 2x + y = 24. Eine Rechnung liefert x = ${x} m. Berechne y = 24 − 2x und prüfe, ob das Ergebnis sinnvoll ist: Beide Längen müssen positiv sein.`,
            "",
            [
              numberField("y =", y, "m", 0),
              choiceField(
                "Ist das Ergebnis sinnvoll?",
                [
                  "Ja, beide Längen sind positiv.",
                  "Nein, eine Länge wäre nicht positiv.",
                ],
                y > 0 ? 0 : 1,
              ),
            ],
            "Setze x in 2x + y = 24 ein und prüfe das Vorzeichen von y.",
            [
              `y = 24 − 2 · ${x} = ${fmt(y)} m.`,
              y > 0
                ? `Beide Längen x = ${x} m und y = ${fmt(y)} m sind positiv – das Ergebnis ist sinnvoll.`
                : `x = ${x} m ist zwar positiv, aber y = ${fmt(y)} m ist es nicht: Für das Modell taugt dieser Wert nicht.`,
            ],
            y > 0
              ? `y = ${fmt(y)} m: Das Ergebnis ist sinnvoll.`
              : `y = ${fmt(y)} m: Das Ergebnis ist nicht sinnvoll.`,
            { x, y },
          );
        }
        const v0 = rng.int(6, 12);
        const V = v0 ** 3;
        return task(
          2,
          "",
          `Für einen Kanister liefert das Modell O(x) = 2x² + 4 · V : x bei V = ${V} cm³ das Optimum x = ${v0} cm. Welche geometrische Annahme steckt in diesem Modell, und wie ändert sich das Optimum, wenn das Volumen auf ${fmt(8 * V)} cm³ steigt?`,
          [
            choiceField(
              "Welche Annahme steckt im Modell?",
              [
                "Der Kanister hat eine quadratische Grundfläche und einen Deckel.",
                "Der Kanister ist kugelförmig und hat zwei Henkel.",
                "Der Kanister hat eine runde Grundfläche ohne Deckel.",
              ],
              0,
            ),
            numberField("neues Optimum x =", 2 * v0, "cm", 0),
          ],
          "Optimal war x³ = V. Rechne rückwärts: x = dritte Wurzel aus V, und bei achtfachem Volumen verdoppelt sich die Kantenlänge.",
          [
            `Die Annahme ist die quadratische Grundfläche mit Deckel: O(x) = 2x² + 4V : x.`,
            `Optimal war x³ = ${V}, also x = ${v0} cm. Für ${fmt(8 * V)} cm³ gilt x³ = ${fmt(8 * V)}, also x = ${2 * v0} cm.`,
          ],
          `Bei ${fmt(8 * V)} cm³ ist x = ${2 * v0} cm optimal.`,
          { v: v0, V, neu: 2 * v0 },
        );
      },
    },
  ],
});

// 4.5 Analysis in Beruf und Forschung ───────────────────────────────────────

const anwendungen = L(5, {
  id: "aw-5-anwendungen",
  title: "4.5 Analysis in Beruf und Forschung",
  subtitle: "Wo die Analysis wirklich gebraucht wird",
  whyItMatters:
    "Ob Wirtschaftsmathematik, Statistik, Klimaforschung oder Ingenieurwesen: Überall werden Raten abgeleitet, Mengen integriert und Optima gesucht. Diese drei Grundfragen zu erkennen und ihre Ergebnisse zu validieren, unterscheidet eine Modellrechnung von einer Schätzung – im Abitur und in jedem dieser Berufe.",
  explanationHtml: `
    <p>Die Differential- und Integralrechnung steckt in vielen Berufsfeldern – Wirtschaftsmathematik, Statistik, Klimaforschung, Ingenieurwesen. Überall helfen dieselben drei Fragen:</p>
    <ul>
      <li><strong>Lokale Rate:</strong> Wie schnell ändert sich die Größe gerade jetzt? (Ableitung r(t) = F′(t))</li>
      <li><strong>Gesamtmenge:</strong> Wie viel kommt über den Zeitraum zusammen? (bestimmtes Integral G = ∫ von 0 bis T r(t) dt)</li>
      <li><strong>Extremum:</strong> Wo liegt der beste, größte oder sparsamste Punkt? (f′ = 0 plus Randvergleich)</li>
    </ul>
    <p>In der Wirtschaft ist r(t) etwa die Veränderungsrate eines Lagerbestands, in der Klimaforschung die CO₂-Emission pro Jahr, in der Technik die Belastungsrate eines Bauteils. Für eine <strong>linear fallende Rate</strong> ist die Gesamtmenge die Fläche des Trapezs unter r(t): G = (r(0) + r(T)) : 2 · T.</p>
    <div class="example">Eine Fabrik stößt am ersten Tag 8 t CO₂ pro Tag aus; die Rate fällt linear auf 4 t pro Tag am Ende von 6 Tagen. Gesamtmenge: G = (8 + 4) : 2 · 6 = 36 t. Validierung: Die Einheit passt (t pro Tag mal Tag ergibt t), die Größenordnung liegt zwischen 6 · 4 = 24 t und 6 · 8 = 48 t, und für eine konstante Rate von 8 t pro Tag wären es 48 t – die fallende Rate spart also 12 t.</div>
    <div class="merke"><strong>Merke:</strong> Ableitung = momentane Änderung, Integral = Gesamtänderung, Extremum = optimale Stelle – in jedem Fachgebiet. Prüfe jedes Ergebnis: Einheit, Größenordnung, Grenzfälle.</div>
  `,
  formulas: [
    {
      name: "Lokale Rate",
      html: "r(t) = F′(t)",
      quantities: "momentane Änderung pro Zeiteinheit",
    },
    {
      name: "Gesamtmenge",
      html: "G = ∫ von 0 bis T r(t) dt = F(T) − F(0)",
      quantities: "bestimmtes Integral der Rate über den Zeitraum",
    },
    {
      name: "Linear fallende Rate",
      html: "G = (r(0) + r(T)) : 2 · T",
      quantities: "Fläche des Trapezs unter dem Graphen von r",
    },
  ],
  quiz: {
    question:
      "Eine Emissionsrate fällt linear von 8 t pro Tag auf 4 t pro Tag. Wie groß ist die Gesamtmenge über 6 Tage?",
    options: ["36 t", "48 t", "24 t"],
    correctIndex: 0,
    explanation:
      "Bei linear fallender Rate ist die Gesamtmenge die Trapezfläche: (8 + 4) : 2 · 6 = 36 t. Die 48 t entstünden bei einer konstanten Rate von 8 t pro Tag, die 24 t bei konstanten 4 t pro Tag.",
  },
  lab: lab(
    "anwendung",
    "Raten und Gesamtmenge",
    "r(t) = a·t + b ist die Rate über den Zeitraum von 0 bis T. Die grüne Fläche ist die Gesamtmenge als bestimmtes Integral. Ziehe den Startpunkt (Anfangsrate) und das Ende (Zeitraum) oder stelle a, b und T ein.",
    [
      choice("kontext", "Anwendungsfenster", [
        "Wirtschaft: Bestandsänderung",
        "Klima: CO₂-Ausstoß",
        "Technik: Belastung",
      ]),
      range("a", "Steigung a der Rate r(t) = a·t + b", -4, 4, 1, 0.5),
      range("b", "Anfangsrate b", -6, 10, 1, 1),
      range("T", "Zeitraum T", 1, 10, 5, 1),
    ],
    [
      {
        key: "gesamtmenge",
        label: "Gesamtmenge (Integral)",
        compute: (v: LabValues) => rateWerte(v).G,
        digits: 2,
        emphasis: true,
      },
      {
        key: "rateAnfang",
        label: "Rate r(0)",
        compute: (v: LabValues) => rateWerte(v).r0,
        digits: 2,
      },
      {
        key: "rateEnde",
        label: `Rate r(T)`,
        compute: (v: LabValues) => rateWerte(v).rT,
        digits: 2,
      },
      {
        key: "rateFormel",
        label: "Ratenfunktion",
        compute: (v: LabValues) => `r(t) = ${sum([[v.a, "t"], [v.b, ""]])}`,
      },
      {
        key: "bedeutung",
        label: "Einheiten",
        compute: (v: LabValues) =>
          v.kontext === 0
            ? "Wirtschaft: r in T€ pro Monat, G in T€ (Bestandsänderung)"
            : v.kontext === 1
              ? "Klima: r in Mio. t pro Jahr, G in Mio. t (Gesamtemission)"
              : "Technik: r in mm pro Tag, G in mm (Gesamtverformung)",
      },
      {
        key: "vorzeichen",
        label: "Verlauf der Rate",
        compute: (v: LabValues) => {
          const w = rateWerte(v);
          if (w.r0 === 0 && w.rT === 0) return "Die Rate ist durchgehend 0.";
          if (w.r0 * w.rT < 0) return "Die Rate wechselt das Vorzeichen.";
          return w.rT < w.r0
            ? "Die Rate fällt über den Zeitraum."
            : w.rT > w.r0
              ? "Die Rate steigt über den Zeitraum."
              : "Die Rate ist konstant.";
        },
      },
    ],
    [
      {
        id: "gesamtmenge-20",
        text: "Stelle die Parameter so ein, dass die Gesamtmenge im Zeitraum genau 20 ist.",
        check: (v: LabValues) => Math.abs(rateWerte(v).G - 20) < 1e-9,
      },
      {
        id: "rate-faellt",
        text: "Lass die Rate über den Zeitraum fallen (Endrate kleiner als Anfangsrate) und halte die Gesamtmenge über 5.",
        check: (v: LabValues) => {
          const w = rateWerte(v);
          return w.rT < w.r0 - 1e-9 && w.G > 5;
        },
      },
      {
        id: "gesamtmenge-null",
        text: "Stelle eine Gesamtmenge von 0 ein – die Rate wechselt dabei das Vorzeichen.",
        check: (v: LabValues) => {
          const w = rateWerte(v);
          return Math.abs(w.G) < 1e-9 && w.r0 * w.rT < 0;
        },
      },
    ],
  ),
  exercises: [
    {
      id: "anwendung-integral",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r1 = rng.int(2, 9);
          const t1 = rng.int(1, 4);
          const r2 = rng.int(2, 9);
          const t2 = rng.int(1, 4);
          const m1 = r1 * t1;
          const G = m1 + r2 * t2;
          return task(
            1,
            `In einen Speicher wird eine Menge zugeführt. In den ersten ${t1} Tagen ist die Rate konstant ${r1} kg pro Tag, danach ${t2} Tage lang konstant ${r2} kg pro Tag. Wie groß ist die Menge im ersten Abschnitt, und wie groß die Gesamtmenge über alle ${t1 + t2} Tage?`,
            "",
            [
              numberField("Menge im ersten Abschnitt:", m1, "kg", 0),
              numberField("Gesamtmenge:", G, "kg", 0, {
                slips: [
                  {
                    value: m1,
                    hint: "Die Gesamtmenge ist die Summe beider Abschnitte, nicht nur die erste Fläche.",
                  },
                ],
              }),
            ],
            "Bei konstanter Rate ist die Menge die Fläche des Rechtecks: Menge = Rate · Zeit. Die Gesamtmenge ist die Summe beider Flächen.",
            [
              `Erster Abschnitt: ${fmt(r1)} kg pro Tag · ${t1} Tage = ${fmt(m1)} kg.`,
              `Zweiter Abschnitt: ${fmt(r2)} kg pro Tag · ${t2} Tage = ${fmt(r2 * t2)} kg; zusammen ${fmt(m1)} + ${fmt(r2 * t2)} = ${fmt(G)} kg.`,
            ],
            `Im ersten Abschnitt sammeln sich ${fmt(m1)} kg, insgesamt sind es ${fmt(G)} kg.`,
            { r1, t1, r2, t2, m1, G },
          );
        }
        const r0 = rng.pick([4, 6, 8, 10, 12]);
        const rT = rng.pick([2, 4, 6, 8, 10].filter((r) => r < r0));
        const T = rng.int(2, 6);
        const G = ((r0 + rT) / 2) * T;
        const mittel = (r0 + rT) / 2;
        return task(
          2,
          "",
          `Eine Fabrik reduziert ihren CO₂-Ausstoß. Die Emissionsrate fällt linear von ${fmt(r0)} Mio. t pro Jahr auf ${fmt(rT)} Mio. t pro Jahr, und das über ${T} Jahre. Wie viel wird in dieser Zeit insgesamt emittiert, und wie hoch ist die mittlere Emissionsrate?`,
          [
            numberField("Gesamtmenge:", G, "Mio. t", 0),
            numberField("mittlere Rate:", mittel, "Mio. t pro Jahr", 0),
          ],
          "Die Gesamtmenge ist die Trapezfläche unter der Rate: (r(0) + r(T)) : 2 · T. Die mittlere Rate ist (r(0) + r(T)) : 2.",
          [
            `Trapezfläche: G = (${fmt(r0)} + ${fmt(rT)}) : 2 · ${T} = ${fmt(r0 + rT)} : 2 · ${T} = ${fmt(G)} Mio. t.`,
            `Mittlere Rate: (${fmt(r0)} + ${fmt(rT)}) : 2 = ${fmt(mittel)} Mio. t pro Jahr – mit dieser konstanten Rate entstünde dieselbe Gesamtmenge.`,
          ],
          `Es werden insgesamt ${fmt(G)} Mio. t emittiert; die mittlere Rate beträgt ${fmt(mittel)} Mio. t pro Jahr.`,
          { r0, rT, T, G, mittel },
        );
      },
    },
    {
      id: "rate-vergleich",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = -rng.int(1, 2);
          const b = rng.int(10, 14);
          const T = rng.int(2, 4);
          const rT = a * T + b;
          return task(
            1,
            `Die Rate eines Speichers ändert sich linear: r(t) = ${sum([[a, "t"], [b, ""]])} (r in kg pro Tag, t in Tage) über den Zeitraum von 0 bis ${T} Tagen. Wie hoch ist die Rate am Ende des Zeitraums, und wie verhält sich die Gesamtmenge gegenüber einer konstanten Rate von ${fmt(b)} kg pro Tag?`,
            "",
            [
              numberField("r(T) =", rT, "kg pro Tag", 0),
              choiceField(
                "Die Gesamtmenge ist …",
                [
                  "kleiner als bei konstanter Anfangsrate",
                  "gleich wie bei konstanter Anfangsrate",
                  "größer als bei konstanter Anfangsrate",
                ],
                0,
              ),
            ],
            "r(T) = a · T + b einsetzen. Die Gesamtmenge ist die Trapezfläche (r(0) + r(T)) : 2 · T; vergleiche sie mit r(0) · T.",
            [
              `r(${T}) = ${fmt(a)} · ${T}${term(b, "", false)} = ${fmt(rT)} kg pro Tag.`,
              `Gesamtmenge G = (${fmt(b)} + ${fmt(rT)}) : 2 · ${T} = ${fmt(((b + rT) / 2) * T)} kg; bei konstanten ${fmt(b)} kg pro Tag wären es ${fmt(b * T)} kg.`,
            ],
            `Am Ende beträgt die Rate ${fmt(rT)} kg pro Tag; die Gesamtmenge ist kleiner als bei konstanter Anfangsrate.`,
            { a, b, T, rT },
          );
        }
        const r0 = rng.pick([8, 10, 12, 14]);
        const rT = rng.pick([2, 4, 6].filter((r) => r < r0));
        const T = rng.int(2, 6);
        const G = ((r0 + rT) / 2) * T;
        const G2 = G + T;
        return task(
          2,
          "",
          `Die Rate eines Speichers fällt linear von ${fmt(r0)} kg pro Tag auf ${fmt(rT)} kg pro Tag über ${T} Tage; die Gesamtmenge ist ${fmt(G)} kg. Ein Techniker schlägt vor, die Anfangsrate um 2 kg pro Tag zu erhöhen, während Endrate und Zeitraum gleich bleiben. Wie groß ist dann die neue Gesamtmenge, und was bedeutet das im Vergleich?`,
          [
            numberField("neue Gesamtmenge:", G2, "kg", 0),
            choiceField(
              "Die Gesamtmenge …",
              ["steigt", "sinkt", "bleibt gleich"],
              0,
            ),
          ],
          "Eine um 2 erhöhte Anfangsrate vergrößert die Trapezfläche um 2 · T : 2 = T.",
          [
            `Neue Anfangsrate ${fmt(r0 + 2)} kg pro Tag, Endrate ${fmt(rT)} kg pro Tag: G = (${fmt(r0 + 2)} + ${fmt(rT)}) : 2 · ${T} = ${fmt(G2)} kg.`,
            `Der Zuwachs beträgt ${fmt(G2 - G)} kg: Die Erhöhung um 2 kg pro Tag zählt über die halbe Dauer (2 · ${T} : 2 = ${fmt(G2 - G)}).`,
          ],
          `Die neue Gesamtmenge beträgt ${fmt(G2)} kg – sie steigt um ${fmt(G2 - G)} kg.`,
          { r0, rT, T, G, G2 },
        );
      },
    },
  ],
});

export const STAGE_ANWENDUNGEN = makeStage(
  4,
  "Verknüpfte Funktionen, Parameter, Extremwerte und Anwendungen",
  "#ea580c",
  "📈",
  [verketteteFunktionen, parameter, extremwerte, sachzusammenhaenge, anwendungen],
);
