import { frac, fmt, round, shifted } from "../exercises/format";
import {
  anteilImBand,
  balken,
  diskretF,
  diskretP,
  messreihe,
  messreiheZurueck,
  neueMessreihe,
  normalIntervalP,
  normalPdf,
  Phi,
  sampleMean,
  sampleStd,
  stetigF,
  stetigP,
} from "../lab/views-2-normalverteilung";
import type { ExerciseTask, LabValues } from "../model/types";
import {
  choice,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";
import { choiceField, numberField } from "./helpers";

// ─── Helfer ────────────────────────────────────────────────────────────────

/** Φ-Werte wie in der Tabelle der Formelsammlung: vier Dezimalstellen. */
const phiTab = (z: number): number => round(Phi(z), 4);
/** Ein Tabellenwert als Text: dec(0,1587) → "0,1587". */
const dec = (p: number): string => fmt(p, 4);
/** Ein z-Wert als Text: zStr(-1,5) → "−1,5". */
const zStr = (z: number): string => fmt(z, 2);
/** Der Prozentanteil einer Sigma-Regel: 68 %, 95 %, 99,7 %. */
const regelPct = (k: number): string => (k === 3 ? "99,7" : k === 2 ? "95" : "68");

/** Vier Balkenhöhen zu 1 Summe in Schritten von 0,05. */
function histogramm(rng: {
  stepped: (min: number, max: number, step: number) => number;
  int: (min: number, max: number) => number;
}): number[] {
  for (let i = 0; i < 40; i++) {
    const h1 = rng.stepped(0.1, 0.55, 0.05);
    const h2 = rng.stepped(0.1, 0.55, 0.05);
    const h3 = rng.stepped(0.05, 0.5, 0.05);
    const h4 = round(1 - h1 - h2 - h3, 2);
    if (h4 >= 0.1 && h4 <= 0.55) return [h1, h2, h3, h4];
  }
  return [0.25, 0.25, 0.25, 0.25];
}

/** Eine kumulative Verteilung F(1) < F(2) < F(3) < F(4) = 1 in Schritten von 0,05. */
function kumulierteTabelle(rng: {
  stepped: (min: number, max: number, step: number) => number;
}): [number, number, number] {
  const c1 = rng.stepped(0.05, 0.3, 0.05);
  const c2 = round(c1 + rng.stepped(0.1, 0.45, 0.05), 2);
  const c3 = round(Math.min(0.9, c2 + rng.stepped(0.1, 0.45, 0.05)), 2);
  return [c1, c2, c3];
}

// ─── 2.1 Diskrete und stetige Zufallsgrößen ────────────────────────────────

const zufallsgroessen = makeLesson(2, 1, {
  id: "nv-1-zufallsgroessen",
  title: "2.1 Diskrete und stetige Zufallsgrößen",
  subtitle: "Einzelwerte oder Intervalle – und was Wahrscheinlichkeit dann heißt",
  whyItMatters:
    "Ob Augenzahl oder Werkstücklänge: Wie du Wahrscheinlichkeiten beschreibst, hängt davon ab, ob die Zufallsgröße nur einzelne Werte annehmen kann oder jeden Wert eines Intervalls. Diese Unterscheidung ist die Grundlage der Normalverteilung und im Abitur in jeder Stochastik-Aufgabe vorausgesetzt.",
  explanationHtml: `
    <p>Eine <strong>Zufallsgröße</strong> X ordnet jedem Ergebnis eines Zufallsexperiments eine Zahl zu. Sie heißt <strong>diskret</strong>, wenn sie nur abzählbar viele Werte annehmen kann (Augenzahl 1 bis 6, Anzahl von Anrufen pro Stunde), und <strong>stetig</strong>, wenn sie jeden Wert eines Intervalls annehmen kann (Länge, Zeit, Masse).</p>
    <ul>
      <li><strong>Diskret:</strong> Das Histogramm zeigt die Wahrscheinlichkeit jedes einzelnen Werts als Balkenhöhe. Die Balkenhöhen ergeben zusammen 1.</li>
      <li><strong>Stetig:</strong> Die <strong>Dichtefunktion</strong> f beschreibt die Verteilung. Wahrscheinlichkeit ist Fläche: Die Fläche unter dem Graphen von f ist 1.</li>
      <li>Die <strong>kumulative Verteilungsfunktion</strong> F(x) = P(X ≤ x) gibt für jede Stelle x den Anteil der Werte an, die höchstens x betragen. F wächst monoton von F(−∞) = 0 bis F(∞) = 1.</li>
    </ul>
    <div class="example">Ein fairer Würfel: Das Histogramm hat sechs Balkenhöhen zu ${frac(1, 6)}. Dann ist P(X ≤ 2) = ${frac(1, 6)} + ${frac(1, 6)} = ${frac(1, 3)} ≈ 0,33.<br>
      Eine Stange ist zwischen 90 cm und 100 cm gleichverteilt, die Dichte ist dort konstant f(x) = 0,1. P(92 < X ≤ 95) = 3 · 0,1 = 0,3. Der Einzelwert X = 93 hat dagegen die Wahrscheinlichkeit 0.</div>
    <div class="merke"><strong>Merke:</strong> Bei stetigen Zufallsgrößen hat jeder Einzelwert die Wahrscheinlichkeit 0: P(X = x) = 0. Nur Intervalle haben eine Wahrscheinlichkeit, zum Beispiel P(a < X ≤ b) = Fläche unter f zwischen a und b.</div>
  `,
  formulas: [
    {
      name: "Kumulative Verteilungsfunktion",
      html: "F(x) = P(X ≤ x)",
      quantities: "x Stelle, F(x) Anteil der Werte, die höchstens x betragen",
    },
    {
      name: "Wahrscheinlichkeit aus der Dichte",
      html: "P(a < X ≤ b) = Fläche unter f zwischen a und b",
      quantities: "f Dichtefunktion, a und b Intervallgrenzen",
    },
    {
      name: "Normierung",
      html: "Summe der Balkenhöhen = 1 bzw. Fläche unter f = 1",
      quantities: "Bedingung jeder Wahrscheinlichkeitsverteilung",
    },
  ],
  quiz: {
    question:
      "X ist stetig (zum Beispiel die Länge eines Werkstücks). Wie groß ist P(X = 3)?",
    options: [
      "0, denn ein Einzelwert hat keine Breite und damit keine Fläche",
      "0,5, weil 3 in der Mitte liegt",
      "Es hängt von der Dichte an der Stelle 3 ab",
      "1, denn X kann den Wert 3 annehmen",
    ],
    correctIndex: 0,
    explanation:
      "Bei einer stetigen Zufallsgröße hat jeder Einzelwert die Wahrscheinlichkeit 0, weil er keine Breite hat und Wahrscheinlichkeit als Fläche unter der Dichte gemessen wird. Nur Intervalle haben eine Wahrscheinlichkeit größer als 0.",
  },
  lab: {
    ...lab(
      "zufallsgroesse",
      "Balken und Dichte",
      "Wähle oben, ob X diskret oder stetig ist. Beim Histogramm stellst du die vier Balkenhöhen ein, bei der Dichte Start, Breite und Höhe. a und b begrenzen das Intervall, x ist die Stelle für F(x).",
      [
        choice(
          "art",
          "Art der Zufallsgröße",
          ["diskret (Werte 1 bis 4)", "stetig (Wert aus einem Intervall)"],
          0,
        ),
        {
          ...range("h1", "Balkenhöhe bei 1", 0.05, 0.9, 0.4, 0.05),
          showIf: (v: LabValues) => v.art === 0,
        },
        {
          ...range("h2", "Balkenhöhe bei 2", 0.05, 0.9, 0.3, 0.05),
          showIf: (v: LabValues) => v.art === 0,
        },
        {
          ...range("h3", "Balkenhöhe bei 3", 0.05, 0.9, 0.2, 0.05),
          showIf: (v: LabValues) => v.art === 0,
        },
        {
          ...range("h4", "Balkenhöhe bei 4", 0.05, 0.9, 0.2, 0.05),
          showIf: (v: LabValues) => v.art === 0,
        },
        {
          ...range("a0", "Start der Dichte", 0, 5, 1, 0.5),
          showIf: (v: LabValues) => v.art === 1,
        },
        {
          ...range("b0", "Breite der Dichte", 1, 6, 3, 0.5),
          showIf: (v: LabValues) => v.art === 1,
        },
        {
          ...range("hh", "Höhe der Dichte", 0.05, 1, 0.3, 0.05),
          showIf: (v: LabValues) => v.art === 1,
        },
        range("xstelle", "Stelle x für F(x)", 0, 8, 2, 0.5),
        range("lo", "Intervallgrenze a", 0, 8, 1, 0.5),
        range("hi", "Intervallgrenze b", 0, 8, 3, 0.5),
      ],
      [
        output(
          "summe",
          "Summe der Balken bzw. Fläche der Dichte",
          (v) =>
            v.art === 0
              ? balken(v).reduce((sum, h) => sum + h, 0)
              : v.hh * v.b0,
          "",
          2,
        ),
        output(
          "F",
          "F(x) an der Stelle x",
          (v) => (v.art === 0 ? diskretF(v, v.xstelle) : stetigF(v, v.xstelle)),
          "",
          2,
        ),
        output(
          "Pint",
          "P(a < X ≤ b)",
          (v) => (v.art === 0 ? diskretP(v) : stetigP(v)),
          "",
          2,
        ),
        output(
          "punkt",
          "P(X = x)",
          (v) =>
            v.art === 0
              ? Number.isInteger(v.xstelle) && v.xstelle >= 1 && v.xstelle <= 4
                ? `P(X = ${fmt(v.xstelle, 0)}) = ${fmt(balken(v)[v.xstelle - 1])}`
                : "P(X = x) = 0 – x ist kein Wert des Histogramms"
              : "P(X = x) = 0 – eine stetige Größe hat bei einem Einzelwert keine Breite",
        ),
      ],
      [
        {
          id: "summe-eins-halbe",
          text: "Diskret: Stelle die vier Balkenhöhen so ein, dass sie zusammen 1 ergeben und P(X ≤ 2) = 0,5 ist.",
          check: (v) =>
            v.art === 0 &&
            Math.abs(balken(v).reduce((sum, h) => sum + h, 0) - 1) < 1e-6 &&
            Math.abs(v.h1 + v.h2 - 0.5) < 1e-6,
        },
        {
          id: "flaeche-eins-viertel",
          text: "Stetig: Stelle eine Dichte mit Fläche 1 ein, für die P(a < X ≤ b) = 0,25 ist.",
          check: (v) =>
            v.art === 1 &&
            Math.abs(v.hh * v.b0 - 1) < 1e-6 &&
            Math.abs(stetigP(v) - 0.25) < 1e-6,
        },
        {
          id: "punkt-ohne-breite",
          text: "Stetig: Wähle eine echte Dichte (Fläche 1) und eine Stelle x in ihrem Inneren – im Readout steht, warum P(X = x) = 0 ist.",
          check: (v) =>
            v.art === 1 &&
            Math.abs(v.hh * v.b0 - 1) < 1e-6 &&
            v.xstelle > v.a0 + 1e-9 &&
            v.xstelle < v.a0 + v.b0 - 1e-9,
        },
      ],
    ),
  },
  exercises: [
    {
      id: "diskret-stetig",
      make: (rng, level): ExerciseTask => {
        if (level === 2) {
          const [w, l] = rng.pick([
            [4, 1],
            [4, 2],
            [5, 1],
            [5, 2],
            [5, 3],
            [6, 4],
            [8, 1],
            [8, 3],
            [8, 5],
            [10, 1],
            [10, 3],
          ] as const);
          const s = rng.int(0, 3) * 5;
          const c = s + rng.int(0, w - l);
          const d = c + l;
          const hoehe = round(1 / w, 3);
          const p = round(l / w, 3);
          return {
            ...task(
              level,
              "",
              `Die Wartezeit X auf die nächste S-Bahn ist zwischen ${fmt(s)} min und ${fmt(s + w)} min gleichverteilt: Die Dichte ist dort konstant f(x) = ${fmt(hoehe, 3)}, sonst 0. Wie groß ist P(${fmt(c)} < X ≤ ${fmt(d)})? Ordne X außerdem ein.`,
              [
                numberField("P =", p, "", 3, {
                  slips: [
                    {
                      value: round((w - l) / w, 3),
                      hint: "Das ist die Fläche außerhalb deines Intervalls, also das Gegenereignis.",
                    },
                    {
                      value: hoehe,
                      hint: "Die Dichte ist die Höhe, nicht die Wahrscheinlichkeit. Für P zählst du die Fläche: Breite mal Höhe.",
                    },
                  ],
                }),
                choiceField("X ist …", ["diskret", "stetig"], 1),
              ],
              "Wahrscheinlichkeit ist Fläche: P = Breite des Intervalls mal Höhe der Dichte. Eine Zeit kann jeden Wert eines Intervalls annehmen.",
              [
                `Die Dichte ist zwischen ${fmt(s)} und ${fmt(s + w)} konstant ${fmt(hoehe, 3)}: Fläche = Breite · Höhe.`,
                `Das Intervall von ${fmt(c)} bis ${fmt(d)} ist ${fmt(l)} breit: P = ${fmt(l)} · ${fmt(hoehe, 3)} = ${fmt(p, 3)}.`,
                `Zeit nimmt jeden Wert eines Intervalls an, also ist X stetig.`,
              ],
              `P(${fmt(c)} < X ≤ ${fmt(d)}) = ${fmt(p, 3)}; X ist stetig.`,
              { w, l, s, c, d },
            ),
            given: [
              `X gleichverteilt zwischen ${fmt(s)} min und ${fmt(s + w)} min`,
              `Dichte dort: f(x) = ${fmt(hoehe, 3)} (sonst 0)`,
              `Gesucht: P(${fmt(c)} < X ≤ ${fmt(d)})`,
            ],
          };
        }
        const hs = histogramm(rng);
        const k = rng.int(1, 3);
        const p = round(
          hs.slice(0, k).reduce((sum, h) => sum + h, 0),
          2,
        );
        return {
          ...task(
            level,
            `Eine Zufallsgröße X kann die Werte 1, 2, 3 und 4 annehmen. Die Balkenhöhen des Histogramms stehen unten. Berechne P(X ≤ ${k}) und ordne X ein.`,
            "",
            [
              numberField(`P(X ≤ ${k}) =`, p, "", 2, {
                slips: [
                  {
                    value: hs[k - 1],
                    hint: `Das ist nur die Balkenhöhe bei ${k}. P(X ≤ ${k}) ist die Summe der Balken bis ${k}.`,
                  },
                  {
                    value: round(1 - p, 2),
                    hint: `Das ist das Gegenereignis P(X > ${k}).`,
                  },
                ],
              }),
              choiceField(
                "X ist …",
                ["eine diskrete Zufallsgröße", "eine stetige Zufallsgröße"],
                0,
              ),
            ],
            "P(X ≤ k) ist die Summe der Balkenhöhen bis k. Abzählbar viele Ausprägungen bedeuten: X ist diskret.",
            [
              `Balkenhöhen bis ${k} addieren: ${hs
                .slice(0, k)
                .map((h) => fmt(h))
                .join(" + ")} = ${fmt(p)}.`,
              `X hat nur abzählbar viele Ausprägungen (1 bis 4), also ist X diskret.`,
            ],
            `P(X ≤ ${k}) = ${fmt(p)}; X ist diskret.`,
            { h1: hs[0], h2: hs[1], h3: hs[2], h4: hs[3], k },
          ),
          given: [
            "Histogramm, Balkenhöhen:",
            ...hs.map((h, index) => `bei ${index + 1}: ${fmt(h)}`),
          ],
        };
      },
    },
    {
      id: "verteilung-ablesen",
      make: (rng, level): ExerciseTask => {
        const [c1, c2, c3] = kumulierteTabelle(rng);
        const c4 = 1;
        const werte = [c1, c2, c3, c4];
        const tabelle = ["1", "2", "3", "4"].map(
          (x, index) => `x = ${x}: F(x) = ${fmt(werte[index])}`,
        );
        if (level === 1) {
          const p3 = round(c3 - c2, 2);
          return {
            ...task(
              level,
              "Für eine diskrete Zufallsgröße X ist die kumulative Verteilungsfunktion unten tabelliert. Lies F(2) ab und berechne P(X = 3).",
              "",
              [
                numberField("F(2) =", c2, "", 2),
                numberField("P(X = 3) =", p3, "", 2, {
                  slips: [
                    {
                      value: c3,
                      hint: "F(3) ist der Anteil bis 3 einschließlich. Für den Einzelwert X = 3 ziehst du F(2) ab.",
                    },
                  ],
                }),
              ],
              "F(x) = P(X ≤ x) liest du in der Tabelle ab. Für einen Einzelwert gilt P(X = k) = F(k) − F(k − 1).",
              [
                `In der Tabelle bei x = 2 steht F(2) = ${fmt(c2)}.`,
                `P(X = 3) = F(3) − F(2) = ${fmt(c3)} − ${fmt(c2)} = ${fmt(p3)}.`,
              ],
              `F(2) = ${fmt(c2)} und P(X = 3) = ${fmt(p3)}.`,
              { c1, c2, c3 },
            ),
            given: ["F(x) = P(X ≤ x) tabelliert:", ...tabelle],
          };
        }
        const t = rng.pick([0.3, 0.4, 0.5, 0.6, 0.7]);
        const k = werte.findIndex((c) => c >= t - 1e-9) + 1;
        const fk = werte[k - 1];
        return {
          ...task(
            level,
            "",
            `Die kumulative Verteilungsfunktion von X ist unten tabelliert. Bestimme die kleinste Ausprägung x, für die F(x) mindestens ${fmt(t)} ist, und gib den dazugehörigen Anteil F(x) an.`,
            [
              numberField("x =", k, "", 0),
              numberField("F(x) =", fk, "", 2),
            ],
            "Gehe die Tabelle von oben nach unten durch und suche die erste Stelle, an der F(x) mindestens so groß wie die gesuchte Wahrscheinlichkeit ist.",
            [
              `Ablesen: ${tabelle
                .map((zeile, index) => `${zeile}${werte[index] >= t - 1e-9 ? " (erreicht)" : ""}`)
                .join("; ")}`,
              `Die kleinste Ausprägung mit F(x) ≥ ${fmt(t)} ist also x = ${k}, dort ist F(${k}) = ${fmt(fk)}.`,
            ],
            `x = ${k} mit F(${k}) = ${fmt(fk)}.`,
            { c1, c2, c3, t, k },
          ),
          given: ["F(x) = P(X ≤ x) tabelliert:", ...tabelle, `Gesucht: F(x) ≥ ${fmt(t)}`],
        };
      },
    },
  ],
});

// ─── 2.2 Warum die Normalverteilung? ───────────────────────────────────────

const glockenkurve = makeLesson(2, 2, {
  id: "nv-2-glockenkurve",
  title: "2.2 Warum die Normalverteilung?",
  subtitle: "Messwerte häufen sich in der Mitte",
  whyItMatters:
    "Körpergrößen, Füllmengen, Messfehler: Viele Messreihen sehen gleich aus – glockenförmig. Wer das versteht, erkennt in Prüfungsaufgaben sofort, dass die Normalverteilung das passende Modell ist, und weiß, warum Ausreißer selten sind.",
  explanationHtml: `
    <p>Messwerte werden von vielen kleinen Einflüssen beeinflusst: Das Messgerät schwankt, die Temperatur ändert sich, das Material ist nicht ganz gleichmäßig. Jeder Einfluss verschiebt den Wert ein klein wenig. Diese vielen kleinen Verschiebungen <strong>addieren sich</strong> – und die Summe vieler kleiner Zufallseinflüsse häuft sich um den Mittelwert.</p>
    <ul>
      <li>Werte nahe bei μ sind häufig, große Abweichungen nach oben oder unten sind selten: Das Histogramm einer Messreihe wird <strong>glockenförmig</strong>.</li>
      <li>Typische Beispiele sind die Körpergröße einer größeren Gruppe, die Länge von Werkstücken aus einer Maschine oder wiederholte Messungen derselben Größe.</li>
      <li>Die Standardabweichung σ beschreibt die Streuung: rund 68 % der Werte liegen im Intervall μ ± σ.</li>
    </ul>
    <div class="example">Die Längen von 1000 Werkstücken ergeben ein Histogramm mit einem deutlichen Gipfel bei 50,0 cm. Die Werte häufen sich zwischen 49,5 cm und 50,5 cm; unter 48,5 cm oder über 51,5 cm liegen nur wenige Stücke. Das passt zu einer Normalverteilung mit μ = 50,0 und σ ≈ 0,5.</div>
    <div class="merke"><strong>Merke:</strong> Die Glocke ist ein Modell, kein Naturgesetz. Schau immer zuerst auf die Daten (Histogramm), bevor du die Normalverteilung verwendest.</div>
  `,
  formulas: [
    {
      name: "Mittelwert",
      html: "x̄ = (x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>)/n",
      quantities: "xᵢ Messwerte, n Anzahl der Messwerte",
    },
    {
      name: "Standardabweichung einer Messreihe",
      html: "s = √(Σ(x<sub>i</sub> − x̄)²/(n − 1))",
      quantities: "mittlere quadratische Abweichung vom Mittelwert",
    },
    {
      name: "Sigma-Regeln",
      html: "rund 68 % der Werte in μ ± σ, 95 % in μ ± 2σ, 99,7 % in μ ± 3σ",
      quantities: "gilt für normalverteilte Zufallsgrößen",
    },
  ],
  quiz: {
    question: "Warum sind viele Messreihen glockenförmig verteilt?",
    options: [
      "Weil sich viele kleine Zufallseinflüsse addieren und sich die Werte um den Mittelwert häufen",
      "Weil Messgeräte nur runde Werte anzeigen können",
      "Weil alle Werte zwischen Minimum und Maximum gleich wahrscheinlich sind",
      "Weil die Normalverteilung die einzige Verteilung ist, die es gibt",
    ],
    correctIndex: 0,
    explanation:
      "Jeder kleine Einfluss verschiebt den Messwert ein wenig nach oben oder unten. Diese vielen Verschiebungen addieren sich, und die Summe häuft sich um den Mittelwert – das ergibt die Glockenform. Ausreißer nach weit außen sind selten.",
  },
  lab: {
    ...lab(
      "glockenkurve",
      "Messreihe ziehen",
      "Der Knopf zieht eine neue Messreihe aus einer Normalverteilung zu μ und σ. Die Regler starten die Zählung jeweils neu. Vergleiche das Histogramm mit der Glocke und schau auf x̄, s und den Anteil in μ ± σ.",
      [
        range("n", "Anzahl der Messwerte n", 5, 40, 15, 5),
        range("mu", "Erwartungswert μ", 60, 140, 100, 1, "cm"),
        range("sigma", "Standardabweichung σ", 1, 12, 2, 1, "cm"),
        { type: "state", key: "seed", value: 20261108, resetOnChange: true },
        { type: "state", key: "ziehungen", value: 0, resetOnChange: true },
      ],
      [
        output(
          "mittel",
          "Mittelwert x̄ der Messreihe",
          (v) => sampleMean(messreihe(v)),
          "cm",
          2,
        ),
        output(
          "streu",
          "Standardabweichung s",
          (v) => sampleStd(messreihe(v)),
          "cm",
          2,
        ),
        output("anteil", "Anteil im Intervall μ ± σ", (v) => anteilImBand(v), "", 2),
        output(
          "spanne",
          "Spannweite der Messreihe",
          (v) => {
            const xs = messreihe(v);
            return Math.max(...xs) - Math.min(...xs);
          },
          "cm",
          2,
        ),
      ],
      [
        {
          id: "glockenform",
          text: "Ziehe eine Messreihe mit mindestens 20 Werten, bei der der Anteil in μ ± σ zwischen 60 % und 78 % liegt – so sieht eine glockenförmige Verteilung aus.",
          check: (v) =>
            v.n >= 20 && anteilImBand(v) >= 0.6 && anteilImBand(v) <= 0.78,
        },
        {
          id: "mittelwert-nah",
          text: "Wähle n so groß, dass der Mittelwert x̄ deiner Messreihe höchstens 0,2 cm vom Erwartungswert μ entfernt ist.",
          check: (v) =>
            v.n >= 30 && Math.abs(sampleMean(messreihe(v)) - v.mu) <= 0.2,
        },
        {
          id: "streuung-verdoppelt",
          text: "Verdopple σ von 2 auf 4 und lass mindestens 20 Messwerte ziehen: Die Standardabweichung s deiner Reihe wächst dann auf über 3 cm.",
          check: (v) =>
            v.n >= 20 && v.sigma >= 4 && sampleStd(messreihe(v)) >= 3,
        },
      ],
    ),
    actions: [
      { id: "neu", label: "neue Messreihe ziehen", apply: (v) => neueMessreihe(v) },
      {
        id: "zurueck",
        label: "Messreihe zurücksetzen",
        apply: (v) => messreiheZurueck(v),
      },
    ],
  },
  exercises: [
    {
      id: "messwerte",
      make: (rng, level): ExerciseTask => {
        if (level === 2) {
          const mu = rng.int(150, 185);
          const sigma = rng.pick([5, 10]);
          const z = rng.pick([
            -3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3,
          ]);
          const x = round(mu + z * sigma, 1);
          const ueblich = Math.abs(z) <= 2;
          return {
            ...task(
              level,
              "",
              `Die Körpergrößen X einer Klasse sind normalverteilt mit μ = ${fmt(mu)} cm und σ = ${fmt(sigma)} cm. Eine Schülerin ist ${fmt(x)} cm groß. Wie viele Standardabweichungen liegt ihr Wert vom Mittelwert entfernt (mit Vorzeichen)? Und ist der Wert üblich oder außergewöhnlich?`,
              [
                numberField("z =", z, "", 1),
                choiceField(
                  "Der Wert ist …",
                  [
                    "üblich (höchstens 2 Standardabweichungen vom Mittelwert)",
                    "außergewöhnlich (mehr als 2 Standardabweichungen)",
                  ],
                  ueblich ? 0 : 1,
                ),
              ],
              "Standardisieren: z = (x − μ)/σ. Als üblich gelten Werte mit |z| ≤ 2, alles darüber ist außergewöhnlich.",
              [
                `z = (x − μ)/σ = (${fmt(x)} − ${fmt(mu)})/${fmt(sigma)} = ${fmt(x - mu, 1)}/${fmt(sigma)} = ${fmt(z, 1)}.`,
                `|z| = ${fmt(Math.abs(z), 1)}: ${ueblich ? "höchstens 2, der Wert ist üblich" : "mehr als 2, der Wert ist außergewöhnlich"}.`,
              ],
              `z = ${fmt(z, 1)}; der Wert ist ${ueblich ? "üblich" : "außergewöhnlich"}.`,
              { mu, sigma, z, x },
            ),
            given: [
              `μ = ${fmt(mu)} cm`,
              `σ = ${fmt(sigma)} cm`,
              `Messwert x = ${fmt(x)} cm`,
              "üblich: |z| ≤ 2",
            ],
          };
        }
        const m = rng.int(8, 60);
        const s = rng.pick([2, 4, 5, 10]);
        const xs = [m - s, m - s, m, m + s, m + s];
        return {
          ...task(
            level,
            `Eine Messreihe hat die fünf Werte ${xs.map((x) => fmt(x)).join(", ")} (in cm). Berechne den Mittelwert x̄ und die Standardabweichung s.`,
            "",
            [
              numberField("Mittelwert x̄ =", m, "cm", 0),
              numberField("Standardabweichung s =", s, "cm", 0, {
                slips: [
                  {
                    value: round(s * Math.sqrt(0.8), 2),
                    hint: "Du hast durch n = 5 geteilt. Für die Standardabweichung einer Messreihe teilt man durch n − 1 = 4.",
                  },
                  {
                    value: s * s,
                    hint: "Das ist die Varianz s². Für s ziehst du die Wurzel.",
                  },
                ],
              }),
            ],
            "x̄ ist der Mittelwert der fünf Zahlen. Für s bildet man die Abweichungen vom Mittelwert, quadriert sie, teilt durch n − 1 = 4 und zieht die Wurzel.",
            [
              `Mittelwert: (${xs.map((x) => fmt(x)).join(" + ")}) : 5 = ${fmt(m)}.`,
              `Abweichungen: ${fmt(-s)}, ${fmt(-s)}, 0, ${fmt(s)}, ${fmt(s)}; Summe der Quadrate = ${fmt(4 * s * s)}.`,
              `s = √(${fmt(4 * s * s)}/4) = √(${fmt(s * s)}) = ${fmt(s)}.`,
            ],
            `x̄ = ${fmt(m)} cm und s = ${fmt(s)} cm.`,
            { m, s },
          ),
          given: [
            `Messwerte (cm): ${xs.map((x) => fmt(x)).join(", ")}`,
            "n = 5 Messwerte",
            "s = √(Σ(xᵢ − x̄)²/(n − 1))",
          ],
        };
      },
    },
    {
      id: "glockenform",
      make: (rng, level): ExerciseTask => {
        if (level === 2) {
          const mu = rng.pick([100, 200, 250, 500]);
          const sigma = rng.pick([2, 4, 5, 8, 10]);
          const z = rng.pick([-4, -3.5, -2.5, -2, 2, 2.5, 3.5, 4]);
          const x = round(mu + z * sigma, 1);
          const oben = round(mu + 3 * sigma, 1);
          const unten = round(mu - 3 * sigma, 1);
          const ausreisser = Math.abs(z) > 3;
          return {
            ...task(
              level,
              "",
              `Die Füllmenge X einer Abfüllanlage ist normalverteilt mit μ = ${fmt(mu)} ml und σ = ${fmt(sigma)} ml. Eine Flasche enthält ${fmt(x)} ml. Begründe mit der 3σ-Regel, ob das noch üblich ist, und gib die obere Grenze des 3σ-Intervalls an.`,
              [
                numberField("obere Grenze =", oben, "ml", 1),
                choiceField(
                  "Der Wert ist …",
                  ["üblich (innerhalb von 3σ)", "ein Ausreißer (außerhalb von 3σ)"],
                  ausreisser ? 1 : 0,
                ),
              ],
              "Die 3σ-Regel sagt: Rund 99,7 % der Werte liegen zwischen μ − 3σ und μ + 3σ. Was außerhalb liegt, ist ein Ausreißer.",
              [
                `3σ-Regel: In μ ± 3σ = ${fmt(unten)} bis ${fmt(oben)} liegen rund 99,7 % der Werte.`,
                `Der Messwert ${fmt(x)} liegt ${fmt(Math.abs(z), 1)}σ ${z < 0 ? "unter" : "über"} dem Mittelwert: ${fmt(Math.abs(z), 1)}σ ${ausreisser ? "ist mehr als 3σ – ein Ausreißer" : "ist höchstens 3σ – der Wert ist üblich"}.`,
              ],
              `Obere Grenze: ${fmt(oben)} ml; der Wert ist ${ausreisser ? "ein Ausreißer" : "üblich"}.`,
              { mu, sigma, z, x, oben },
            ),
            given: [
              `μ = ${fmt(mu)} ml`,
              `σ = ${fmt(sigma)} ml`,
              `Messwert x = ${fmt(x)} ml`,
              "3σ-Regel: rund 99,7 % in μ ± 3σ",
            ],
          };
        }
        const k = rng.int(1, 3);
        const p = [0.68, 0.95, 0.997][k - 1];
        const aussen = Math.round((1 - p) * 1000);
        const optionen = [
          `rund ${fmt(aussen)} Stück`,
          "rund 500 Stück",
          "genau 0 Stück",
        ];
        const order = rng.shuffle([0, 1, 2]);
        return {
          ...task(
            level,
            `Nach der Sigma-Regel liegen die Messwerte einer normalverteilten Größe in μ ± ${k}σ. Wie groß ist dieser Anteil, und wie viele von 1000 Messwerten liegen außerhalb?`,
            "",
            [
              numberField(`Anteil in μ ± ${k}σ =`, p, "", 3),
              choiceField(
                "Außerhalb von μ ± " + k + "σ liegen …",
                order.map((index) => optionen[index]),
                order.indexOf(0),
              ),
            ],
            "Die Sigma-Regeln: 68 % in μ ± σ, 95 % in μ ± 2σ, 99,7 % in μ ± 3σ. Die Summe aller Anteile ist 1.",
            [
              `Sigma-Regel: In μ ± ${k}σ liegen rund ${regelPct(k)} % der Messwerte, also der Anteil ${fmt(p, 3)}.`,
              `Außerhalb bleiben 100 % − ${regelPct(k)} % = ${fmt((1 - p) * 100, k === 3 ? 1 : 0)} %, also rund ${fmt(aussen)} von 1000 Werten.`,
            ],
            `Anteil in μ ± ${k}σ = ${fmt(p, 3)}; außerhalb liegen rund ${fmt(aussen)} von 1000 Messwerten.`,
            { k, p, aussen },
          ),
          given: [
            "normalverteilte Messwerte",
            `Intervall μ ± ${k}σ`,
            "Sigma-Regeln: 68 % / 95 % / 99,7 %",
          ],
        };
      },
    },
  ],
});

// ─── 2.3 Dichte- und Verteilungsfunktion ───────────────────────────────────

const dichteVerteilung = makeLesson(2, 3, {
  id: "nv-3-dichte-verteilung",
  title: "2.3 Dichte- und Verteilungsfunktion",
  subtitle: "Glocke und S-Kurve gehören zusammen",
  whyItMatters:
    "In Aufgaben musst du μ und σ aus einem Dichteterm ablesen und Wahrscheinlichkeiten als Flächen deuten können. Wer f und F auseinanderhalten kann, verliert in Abituraufgaben keine Punkte mehr bei „Wie groß ist der Anteil bis x?“.",
  explanationHtml: `
    <p>Die <strong>Dichtefunktion</strong> der Normalverteilung N(μ; σ) ist f(x) = 1/(σ√(2π)) · e<sup>−(x − μ)²/(2σ²)</sup>. Ihr Graph ist die <strong>Glocke</strong>: symmetrisch um μ, mit dem Maximum bei x = μ und Wendepunkten bei μ − σ und μ + σ.</p>
    <ul>
      <li>Die Fläche unter dem Graphen von f ist insgesamt 1.</li>
      <li>Die <strong>kumulative Verteilungsfunktion</strong> F(x) = P(X ≤ x) sammelt diese Fläche von links: Ihr Graph ist eine monoton wachsende <strong>S-Kurve</strong> mit F(μ) = 0,5.</li>
      <li><strong>μ</strong> liest du als Achsensymmetrie der Glocke ab, <strong>σ</strong> aus dem Nenner des Exponenten: 2σ² steht unter (x − μ)².</li>
    </ul>
    <div class="example">X ~ N(100; 10): Die Glocke ist um x = 100 symmetrisch, F(100) = 0,5. Die Wendepunkte liegen bei 90 und 110. Der Höchstwert ist f(100) = 1/(10√(2π)) ≈ 0,0399. Für x = 115 ist z = 1,5 und F(115) = Φ(1,5) = 0,9332: 93,32 % der Werte sind höchstens 115.</div>
    <div class="merke"><strong>Merke:</strong> μ schiebt die Glocke nach links oder rechts, σ macht sie breiter und flacher – die Fläche bleibt immer 1. Die Wendepunkte liegen immer bei μ ± σ, und F(μ) = 0,5.</div>
  `,
  formulas: [
    {
      name: "Dichtefunktion der Normalverteilung",
      html: `f(x) = ${frac(1, "σ√(2π)")} · e<sup>−(x − μ)²/(2σ²)</sup>`,
      quantities: "μ Erwartungswert (Lage), σ Standardabweichung (Streuung)",
    },
    {
      name: "Kumulative Verteilungsfunktion",
      html: "F(x) = P(X ≤ x), F(μ) = 0,5",
      quantities: "monoton wachsende S-Kurve, Fläche unter f = 1",
    },
    {
      name: "Wendepunkte",
      html: "Wendepunkte von f bei μ − σ und μ + σ",
      quantities: "hier ändert die Glocke ihre Krümmung",
    },
  ],
  quiz: {
    question:
      "Wie groß ist F(μ) für eine normalverteilte Zufallsgröße mit Erwartungswert μ?",
    options: [
      "0,5, weil die Glocke um μ symmetrisch ist",
      "0, weil bei μ die Dichte ihr Maximum hat",
      "1, weil F immer gegen 1 wächst",
      "Es hängt von der Standardabweichung σ ab",
    ],
    correctIndex: 0,
    explanation:
      "Die Glocke ist um μ symmetrisch, also liegt links von μ genau die Hälfte der Fläche: F(μ) = P(X ≤ μ) = 0,5. Das gilt für jedes σ.",
  },
  lab: {
    ...lab(
      "normalverteilung",
      "Glocke und S-Kurve",
      "Stelle μ, σ und die Stelle x ein (der Punkt auf der x-Achse ist ziehbar). Links siehst du die Dichte f mit der Fläche bis x, rechts die Verteilungsfunktion F.",
      [
        range("mu", "Erwartungswert μ", -2, 6, 0, 0.5),
        range("sigma", "Standardabweichung σ", 0.5, 4, 3, 0.5),
        range("x", "Stelle x", -4, 8, 0, 0.05),
      ],
      [
        output("fx", "Dichte f(x)", (v) => normalPdf(v.x, v.mu, v.sigma), "", 4),
        output(
          "Fx",
          "Verteilungsfunktion F(x)",
          (v) => Phi((v.x - v.mu) / v.sigma),
          "",
          4,
        ),
        output("erwartungswert", "Erwartungswert μ", (v) => v.mu, "", 2),
        output("streuung", "Standardabweichung σ", (v) => v.sigma, "", 2),
        output(
          "wendepunkte",
          "Wendepunkte μ ± σ",
          (v) => `${fmt(v.mu - v.sigma)} | ${fmt(v.mu + v.sigma)}`,
        ),
      ],
      [
        {
          id: "mu-sigma-einstellen",
          text: "Stelle μ = 2 und σ = 1 ein und setze x auf μ: Das Readout zeigt F(x) = 0,5 – links vom Erwartungswert liegen die Hälfte der Werte.",
          check: (v) =>
            v.mu === 2 &&
            v.sigma === 1 &&
            Math.abs(Phi((v.x - v.mu) / v.sigma) - 0.5) < 1e-9,
        },
        {
          id: "stelle-f-95",
          text: "Finde eine Stelle x mit F(x) = 0,95 (Toleranz 0,005) – knapp über μ + 1,6σ.",
          check: (v) =>
            Math.abs(Phi((v.x - v.mu) / v.sigma) - 0.95) < 0.005,
        },
        {
          id: "sigma-doppelt",
          text: "Verdopple σ von 1 auf 2 bei μ = 2 und setze x auf μ: F(x) bleibt bei 0,5, obwohl die Glocke breiter und flacher wird.",
          check: (v) =>
            v.mu === 2 &&
            v.sigma === 2 &&
            Math.abs(Phi((v.x - v.mu) / v.sigma) - 0.5) < 1e-9,
        },
      ],
    ),
  },
  exercises: [
    {
      id: "dichte-parameter",
      make: (rng, level): ExerciseTask => {
        if (level === 2) {
          const mu = rng.int(40, 90);
          const sigma = rng.pick([2, 5, 10]);
          const za = rng.pick([-2.5, -2, -1.5, -1, -0.5]);
          const zb = rng.pick([0.5, 1, 1.5, 2, 2.5]);
          const a = round(mu + za * sigma, 1);
          const b = round(mu + zb * sigma, 1);
          const pa = phiTab(za);
          const pb = phiTab(zb);
          const p = round(pb - pa, 4);
          return {
            ...task(
              level,
              "",
              `Die Länge X von Werkstücken ist normalverteilt mit μ = ${fmt(mu)} cm und σ = ${fmt(sigma)} cm. Welcher Anteil der Werkstücke liegt zwischen ${fmt(a)} cm und ${fmt(b)} cm? Rechne mit den Tabellenwerten.`,
              [
                numberField("P =", p, "", 4, {
                  slips: [
                    {
                      value: pb,
                      hint: "Φ(z_b) ist der Anteil links von b. Für das Intervall musst du Φ(z_a) abziehen.",
                    },
                    {
                      value: pa,
                      hint: "Φ(z_a) ist nur der Anteil links von a, nicht der Anteil im Intervall.",
                    },
                  ],
                }),
              ],
              "P(a < X ≤ b) = Φ(z_b) − Φ(z_a) mit z = (x − μ)/σ. Rechne mit den vorgegebenen Tabellenwerten.",
              [
                `z_a = (a − μ)/σ = ${zStr(za)}; z_b = (b − μ)/σ = ${zStr(zb)}.`,
                `P = Φ(z_b) − Φ(z_a) = ${dec(pb)} − ${dec(pa)} = ${dec(p)}.`,
              ],
              `P(${fmt(a)} < X ≤ ${fmt(b)}) = ${dec(p)} – also rund ${fmt(p * 100, 1)} % der Werkstücke.`,
              { mu, sigma, za, zb, pa, pb, a, b },
            ),
            given: [
              `μ = ${fmt(mu)} cm, σ = ${fmt(sigma)} cm`,
              `a = ${fmt(a)} cm, b = ${fmt(b)} cm`,
              `Tabelle: Φ(${zStr(za)}) = ${dec(pa)}`,
              `Tabelle: Φ(${zStr(zb)}) = ${dec(pb)}`,
            ],
          };
        }
        const variante = rng.next() < 0.5 ? 0 : 1;
        if (variante === 0) {
          const mu = rng.sign() * rng.int(1, 9);
          const sigma = rng.pick([1, 2, 3, 4]);
          const zweiSigmaQuadrat = 2 * sigma * sigma;
          return {
            ...task(
              level,
              `Die Dichte einer normalverteilten Zufallsgröße lautet f(x) = ${frac(1, `${fmt(sigma)} · √(2π)`)} · e<sup>−${shifted(mu)}²/${fmt(zweiSigmaQuadrat)}</sup>. Lies μ und σ aus dem Term ab.`,
              "",
              [
                numberField("μ =", mu, "", 0, {
                  slips: [
                    {
                      value: -mu,
                      hint: "Im Exponenten steht (x − μ)². Bei (x + 2)² ist μ = −2, nicht 2.",
                    },
                  ],
                }),
                numberField("σ =", sigma, "", 0, {
                  slips: [
                    {
                      value: zweiSigmaQuadrat,
                      hint: "Das ist 2σ² aus dem Exponenten. Löse 2σ² = … nach σ auf.",
                    },
                    {
                      value: sigma * sigma,
                      hint: "Das ist σ². Für σ ziehst du noch die Wurzel.",
                    },
                  ],
                }),
              ],
              "Vergleiche den Term mit der allgemeinen Form f(x) = 1/(σ√(2π)) · e^(−(x − μ)²/(2σ²)). Aus (x − μ)² liest du μ, aus 2σ² berechnest du σ.",
              [
                `Allgemeine Form: f(x) = 1/(σ√(2π)) · e^(−(x − μ)²/(2σ²)).`,
                `Im Exponenten ist (x − μ)² = ${shifted(mu)}², also μ = ${fmt(mu)}.`,
                `2σ² = ${fmt(zweiSigmaQuadrat)} → σ² = ${fmt(sigma * sigma)} → σ = ${fmt(sigma)}.`,
              ],
              `μ = ${fmt(mu)} und σ = ${fmt(sigma)}.`,
              { mu, sigma, variante },
            ),
            given: [
              `f(x) = ${frac(1, `${fmt(sigma)} · √(2π)`)} · e<sup>−${shifted(mu)}²/${fmt(zweiSigmaQuadrat)}</sup>`,
              "gesucht: μ und σ",
            ],
          };
        }
        const z = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
        const mu = rng.int(30, 90);
        const sigma = rng.pick([2, 5, 10]);
        const x = round(mu + z * sigma, 1);
        const pw = phiTab(z);
        const pg = round(1 - pw, 4);
        return {
          ...task(
            level,
            `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Wie groß ist P(X ≤ ${fmt(x)}) und wie groß ist P(X > ${fmt(x)})? Die Tabelle liefert Φ(${zStr(z)}) = ${dec(pw)}.`,
            "",
            [
              numberField("P(X ≤ x) =", pw, "", 4),
              numberField("P(X > x) =", pg, "", 4, {
                slips: [
                  {
                    value: pw,
                    hint: "Φ(z) ist bereits der Anteil links von x. Für P(X > x) brauchst du das Gegenereignis 1 − Φ(z).",
                  },
                ],
              }),
            ],
            "P(X ≤ x) = Φ(z) mit z = (x − μ)/σ; das Gegenereignis ist P(X > x) = 1 − Φ(z).",
            [
              `z = (${fmt(x)} − ${fmt(mu)})/${fmt(sigma)} = ${zStr(z)}; die Tabelle liefert Φ(${zStr(z)}) = ${dec(pw)}.`,
              `P(X > x) = 1 − ${dec(pw)} = ${dec(pg)}.`,
            ],
            `P(X ≤ ${fmt(x)}) = ${dec(pw)} und P(X > ${fmt(x)}) = ${dec(pg)}.`,
            { mu, sigma, z, x, pw, pg, variante },
          ),
          given: [
            `μ = ${fmt(mu)}, σ = ${fmt(sigma)}`,
            `x = ${fmt(x)}`,
            `Tabelle: Φ(${zStr(z)}) = ${dec(pw)}`,
          ],
        };
      },
    },
    {
      id: "eigenschaften",
      make: (rng, level): ExerciseTask => {
        if (level === 2) {
          const z = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
          const mu = rng.int(20, 80);
          const sigma = rng.pick([2, 4, 5, 10]);
          const x = round(mu + z * sigma, 1);
          const pw = phiTab(z);
          return {
            ...task(
              level,
              "",
              `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Für welche Stelle x gilt F(x) = ${dec(pw)}? Die Tabelle liefert Φ(${zStr(z)}) = ${dec(pw)}. Bestimme x.`,
              [
                numberField("x =", x, "", 1, {
                  slips: [
                    {
                      value: round(mu + z, 1),
                      hint: "Du hast z nicht mit σ multipliziert: Es gilt x = μ + z · σ.",
                    },
                  ],
                }),
              ],
              "F(x) = Φ((x − μ)/σ). Lies z aus der Tabelle ab und stelle x = μ + z · σ um.",
              [
                `Aus F(x) = Φ(z) = ${dec(pw)} liest du z = ${zStr(z)} ab.`,
                `x = μ + z · σ = ${fmt(mu)} ${z < 0 ? "−" : "+"} ${fmt(Math.abs(round(z * sigma, 2)), 2)} = ${fmt(x)}.`,
              ],
              `x = ${fmt(x)}.`,
              { mu, sigma, z, x, pw },
            ),
            given: [
              `μ = ${fmt(mu)}, σ = ${fmt(sigma)}`,
              `F(x) = ${dec(pw)}`,
              `Tabelle: Φ(${zStr(z)}) = ${dec(pw)}`,
            ],
          };
        }
        const mu = rng.sign() * rng.int(2, 9);
        const sigma = rng.pick([1, 2, 3, 4]);
        const richtig = rng.pick([
          "Die Fläche unter dem Graphen von f ist 1.",
          "F(μ) = 0,5: Links vom Erwartungswert liegt die Hälfte der Werte.",
          "Die Glocke ist symmetrisch um μ.",
        ]);
        const optionen = rng.shuffle([
          richtig,
          "Die Fläche unter dem Graphen von f ist σ.",
          "F(μ) = 1, weil f dort ihr Maximum hat.",
          "Das Maximum von f liegt bei x = σ.",
        ]);
        return {
          ...task(
            level,
            `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)} (Dichte f, Verteilungsfunktion F). Gib die beiden Wendepunkte von f an und wähle die richtige Aussage.`,
            "",
            [
              numberField("Wendepunkt links x₁ =", round(mu - sigma, 1), "", 1),
              numberField("Wendepunkt rechts x₂ =", round(mu + sigma, 1), "", 1),
              choiceField("Richtige Aussage:", optionen, optionen.indexOf(richtig)),
            ],
            "Die Wendepunkte von f liegen bei μ − σ und μ + σ. Merke: Die Fläche unter f ist 1, f ist symmetrisch um μ, und F(μ) = 0,5.",
            [
              `Wendepunkte: μ ± σ = ${fmt(mu)} ± ${fmt(sigma)} = ${fmt(mu - sigma)} und ${fmt(mu + sigma)}.`,
              `Richtig ist: ${richtig}`,
            ],
            `Wendepunkte bei x₁ = ${fmt(mu - sigma)} und x₂ = ${fmt(mu + sigma)}; richtig ist: ${richtig}`,
            { mu, sigma },
          ),
          given: [`μ = ${fmt(mu)}`, `σ = ${fmt(sigma)}`, "gesucht: Wendepunkte von f"],
        };
      },
    },
  ],
});

// ─── 2.4 Wahrscheinlichkeiten und Sigma-Regeln ─────────────────────────────

const sigmaRegeln = makeLesson(2, 4, {
  id: "nv-4-sigma-regeln",
  title: "2.4 Wahrscheinlichkeiten und Sigma-Regeln",
  subtitle: "68 – 95 – 99,7 und was dazwischen liegt",
  whyItMatters:
    "„Wie groß ist der Anteil in einem Intervall?“ und „Zwischen welchen Grenzen liegen 95 % der Werte?“ sind die Standardfragen jeder Abituraufgabe zur Normalverteilung. Mit Standardisierung, Φ-Tabelle und Sigma-Regeln beantwortest du beide sicher.",
  explanationHtml: `
    <p>Für eine normalverteilte Zufallsgröße X ~ N(μ; σ) ist die Wahrscheinlichkeit eines Intervalls die Fläche unter der Dichte: <strong>P(a < X ≤ b) = F(b) − F(a)</strong>. Damit du die Φ-Tabelle benutzen kannst, <strong>standardisierst</strong> du: z = (x − μ)/σ. Dann ist F(x) = Φ(z), und P(a < X ≤ b) = Φ(z_b) − Φ(z_a).</p>
    <ul>
      <li><strong>Sigma-Regeln:</strong> P(μ − σ < X ≤ μ + σ) = 0,68; P(μ ± 2σ) = 0,95; P(μ ± 3σ) = 0,997.</li>
      <li><strong>Symmetrische Intervalle:</strong> P(μ − d < X ≤ μ + d) = 2 · Φ(z) − 1 mit z = d/σ.</li>
      <li><strong>Umkehrung:</strong> Zu einer Wahrscheinlichkeit p suchst du in der Tabelle den z-Wert mit Φ(z) = (p + 1)/2 und rechnest x = μ + z · σ.</li>
    </ul>
    <div class="example">X ~ N(100; 10). Gesucht ist P(100 < X ≤ 115). Standardisieren: z_a = (100 − 100)/10 = 0 und z_b = (115 − 100)/10 = 1,5. Die Tabelle liefert Φ(0) = 0,5 und Φ(1,5) = 0,9332. Also P = 0,9332 − 0,5 = 0,4332: Rund 43 % der Werte liegen zwischen 100 und 115.</div>
    <div class="merke"><strong>Merke:</strong> Erst standardisieren, dann die Φ-Tabelle benutzen: P(a < X ≤ b) = Φ(z_b) − Φ(z_a). Für symmetrische Intervalle um μ sind die Sigma-Regeln der schnellste Weg.</div>
  `,
  formulas: [
    {
      name: "Wahrscheinlichkeit eines Intervalls",
      html: "P(a < X ≤ b) = F(b) − F(a) = Φ(z_b) − Φ(z_a)",
      quantities: "z_a = (a − μ)/σ und z_b = (b − μ)/σ standardisierte Grenzen",
    },
    {
      name: "Standardisierung",
      html: "z = (x − μ)/σ",
      quantities: "z gibt an, wie viele Standardabweichungen x von μ entfernt ist",
    },
    {
      name: "Sigma-Regeln",
      html: "P(μ ± 1σ) = 0,68 · P(μ ± 2σ) = 0,95 · P(μ ± 3σ) = 0,997",
      quantities: "symmetrische Intervalle um den Erwartungswert",
    },
  ],
  quiz: {
    question:
      "X ist normalverteilt mit μ = 100 und σ = 10. Wie groß ist P(100 < X ≤ 110)?",
    options: [
      "0,3413",
      "0,5",
      "0,1587",
      "0,6827",
    ],
    correctIndex: 0,
    explanation:
      "z_a = 0 und z_b = 1. Die Tabelle liefert Φ(0) = 0,5 und Φ(1) = 0,8413. Also P = 0,8413 − 0,5 = 0,3413. Das ist der halbe Anteil von μ ± σ (0,6827), wie die Symmetrie der Glocke verlangt.",
  },
  lab: {
    ...lab(
      "sigma-regeln",
      "Fläche zwischen a und b",
      "Verschiebe a und b (die Punkte auf der Achse sind ziehbar) und stelle μ und σ ein. Die schattierte Fläche ist P(a < X ≤ b); die Marken zeigen μ ± σ, μ ± 2σ und μ ± 3σ.",
      [
        range("a", "Intervallgrenze a", 60, 140, 95, 1, "cm"),
        range("b", "Intervallgrenze b", 60, 140, 115, 1, "cm"),
        range("mu", "Erwartungswert μ", 60, 140, 100, 1, "cm"),
        range("sigma", "Standardabweichung σ", 2, 20, 10, 1, "cm"),
      ],
      [
        output(
          "P",
          "P(a < X ≤ b)",
          (v) => normalIntervalP(v.a, v.b, v.mu, v.sigma),
          "",
          4,
        ),
        output(
          "z",
          "z-Werte z_a | z_b",
          (v) =>
            `${fmt((v.a - v.mu) / v.sigma, 2)} | ${fmt((v.b - v.mu) / v.sigma, 2)}`,
        ),
        output(
          "anteile",
          "Anteile laut Sigma-Regel",
          () => "μ ± 1σ: 68 % · μ ± 2σ: 95 % · μ ± 3σ: 99,7 %",
        ),
        output(
          "sym",
          "symmetrisch zu P = 0,95",
          (v) => `${fmt(v.mu - 2 * v.sigma)} | ${fmt(v.mu + 2 * v.sigma)}`,
        ),
      ],
      [
        {
          id: "intervall-68",
          text: "Stelle das Intervall μ ± σ ein (a = μ − σ, b = μ + σ): Nach der Sigma-Regel liegen darin rund 68 % der Werte.",
          check: (v) =>
            Math.abs(v.a - (v.mu - v.sigma)) < 1e-9 &&
            Math.abs(v.b - (v.mu + v.sigma)) < 1e-9 &&
            Math.abs(normalIntervalP(v.a, v.b, v.mu, v.sigma) - 0.6827) < 0.005,
        },
        {
          id: "intervall-95",
          text: "Finde das um μ symmetrische Intervall mit P ≈ 0,95: a = μ − 2σ, b = μ + 2σ.",
          check: (v) =>
            Math.abs(v.a - (v.mu - 2 * v.sigma)) < 1e-9 &&
            Math.abs(v.b - (v.mu + 2 * v.sigma)) < 1e-9 &&
            Math.abs(normalIntervalP(v.a, v.b, v.mu, v.sigma) - 0.9545) < 0.005,
        },
        {
          id: "asymmetrisch-40-50",
          text: "Stelle ein nicht um μ symmetrisches Intervall ein, für das P(a < X ≤ b) zwischen 0,4 und 0,5 liegt.",
          check: (v) =>
            v.b > v.a &&
            normalIntervalP(v.a, v.b, v.mu, v.sigma) >= 0.4 &&
            normalIntervalP(v.a, v.b, v.mu, v.sigma) <= 0.5 &&
            Math.abs(v.a + v.b - 2 * v.mu) >= 1,
        },
      ],
    ),
  },
  exercises: [
    {
      id: "wahrscheinlichkeit",
      make: (rng, level): ExerciseTask => {
        const mu = rng.int(20, 90);
        const sigma = rng.pick([2, 5, 10]);
        const za = rng.pick([-2.5, -2, -1.5, -1, -0.5, 0]);
        const zb = rng.pick([0.5, 1, 1.5, 2, 2.5]);
        const a = round(mu + za * sigma, 1);
        const b = round(mu + zb * sigma, 1);
        const pa = phiTab(za);
        const pb = phiTab(zb);
        const p = round(pb - pa, 4);
        if (level === 2) {
          const N = 1000;
          const stueck = Math.round(p * N);
          return {
            ...task(
              level,
              "",
              `Die Füllmenge X einer Abfüllanlage ist normalverteilt mit μ = ${fmt(mu)} ml und σ = ${fmt(sigma)} ml. Wie viele von 1000 Flaschen enthalten zwischen ${fmt(a)} ml und ${fmt(b)} ml (kaufmännisch gerundet)? Rechne mit den Tabellenwerten.`,
              [
                numberField("Flaschen =", stueck, "Stück", 0, {
                  slips: [
                    {
                      value: Math.round(pb * N),
                      hint: "Φ(z_b) ist der Anteil links von b. Für das Intervall ziehst du Φ(z_a) ab, bevor du mit 1000 multiplizierst.",
                    },
                    {
                      value: Math.round((1 - p) * N),
                      hint: "Das sind die Flaschen außerhalb des Intervalls, also das Gegenereignis.",
                    },
                  ],
                }),
              ],
              "P(a < X ≤ b) = Φ(z_b) − Φ(z_a); von 1000 Flaschen sind es dann 1000 · P Stück, kaufmännisch gerundet.",
              [
                `z_a = (a − μ)/σ = ${zStr(za)}; z_b = (b − μ)/σ = ${zStr(zb)}; P = Φ(z_b) − Φ(z_a) = ${dec(pb)} − ${dec(pa)} = ${dec(p)}.`,
                `Anteil ${dec(p)} von 1000 Flaschen: 1000 · ${dec(p)} = ${fmt(p * 1000, 1)}, kaufmännisch gerundet ${fmt(stueck)}.`,
              ],
              `Rund ${fmt(stueck)} von 1000 Flaschen liegen im Intervall.`,
              { mu, sigma, za, zb, pa, pb, p, N, a, b },
            ),
            given: [
              `μ = ${fmt(mu)} ml, σ = ${fmt(sigma)} ml`,
              `a = ${fmt(a)} ml, b = ${fmt(b)} ml`,
              `Tabelle: Φ(${zStr(za)}) = ${dec(pa)}`,
              `Tabelle: Φ(${zStr(zb)}) = ${dec(pb)}`,
            ],
          };
        }
        return {
          ...task(
            level,
            `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Berechne P(a < X ≤ b) für a = ${fmt(a)} und b = ${fmt(b)} mit den Tabellenwerten.`,
            "",
            [
              numberField("P =", p, "", 4, {
                slips: [
                  {
                    value: pb,
                    hint: "Φ(z_b) ist der Anteil links von b. Für das Intervall musst du Φ(z_a) abziehen.",
                  },
                  {
                    value: round(1 - p, 4),
                    hint: "Das ist das Gegenereignis: der Anteil außerhalb des Intervalls.",
                  },
                ],
              }),
            ],
            "Standardisiere zuerst: z = (x − μ)/σ. Dann ist P(a < X ≤ b) = Φ(z_b) − Φ(z_a) mit den vorgegebenen Tabellenwerten.",
            [
              `z_a = (a − μ)/σ = ${zStr(za)}; z_b = (b − μ)/σ = ${zStr(zb)}.`,
              `P = Φ(z_b) − Φ(z_a) = ${dec(pb)} − ${dec(pa)} = ${dec(p)}.`,
            ],
            `P(${fmt(a)} < X ≤ ${fmt(b)}) = ${dec(p)}.`,
            { mu, sigma, za, zb, pa, pb, p, a, b },
          ),
          given: [
            `μ = ${fmt(mu)}, σ = ${fmt(sigma)}`,
            `a = ${fmt(a)}, b = ${fmt(b)}`,
            `Tabelle: Φ(${zStr(za)}) = ${dec(pa)}`,
            `Tabelle: Φ(${zStr(zb)}) = ${dec(pb)}`,
          ],
        };
      },
    },
    {
      id: "intervall-suchen",
      make: (rng, level): ExerciseTask => {
        const mu = rng.int(20, 120);
        const sigma = rng.pick([5, 10]);
        if (level === 1) {
          const k = rng.int(1, 3);
          const p = [0.68, 0.95, 0.997][k - 1];
          const a = round(mu - k * sigma, 1);
          const b = round(mu + k * sigma, 1);
          return {
            ...task(
              level,
              `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Nach der Sigma-Regel liegen ${regelPct(k)} % der Werte in einem um μ symmetrischen Intervall μ ± kσ. Gib die beiden Grenzen an.`,
              "",
              [
                numberField("a =", a, "", 1),
                numberField("b =", b, "", 1),
              ],
              "68 % → k = 1, 95 % → k = 2, 99,7 % → k = 3. Die Grenzen sind μ − kσ und μ + kσ; die Reihenfolge der beiden Felder ist frei.",
              [
                `Zu ${regelPct(k)} % gehört k = ${k}: das Intervall μ ± ${k}σ.`,
                `a = μ − kσ = ${fmt(mu)} − ${fmt(k * sigma)} = ${fmt(a)}; b = μ + kσ = ${fmt(mu)} + ${fmt(k * sigma)} = ${fmt(b)}.`,
              ],
              `a = ${fmt(a)} und b = ${fmt(b)}.`,
              { mu, sigma, k, p },
            ),
            anyOrder: [0, 1],
            given: [
              `μ = ${fmt(mu)}, σ = ${fmt(sigma)}`,
              `Anteil: ${regelPct(k)} %`,
              "Sigma-Regeln: 68 % → μ ± 1σ, 95 % → μ ± 2σ, 99,7 % → μ ± 3σ",
            ],
          };
        }
        const z = rng.pick([0.52, 0.85, 1.04, 1.28, 1.65, 2, 2.33]);
        const w = phiTab(z);
        const pSym = round(2 * w - 1, 4);
        const d = round(z * sigma, 2);
        const a = round(mu - d, 2);
        const b = round(mu + d, 2);
        return {
          ...task(
            level,
            "",
            `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Gesucht ist ein um μ symmetrisches Intervall mit P ≈ ${fmt(round(pSym, 2))}. Die Tabelle liefert Φ(${zStr(z)}) = ${dec(w)}. Bestimme die Grenzen und die genaue Wahrscheinlichkeit.`,
            [
              numberField("a =", a, "", 2),
              numberField("b =", b, "", 2),
              numberField("P =", pSym, "", 4),
            ],
            "Symmetrisch um μ ist P = 2 · Φ(z) − 1. Aus x = μ ± z · σ bekommst du die beiden Grenzen; die Reihenfolge der Grenzenfelder ist frei.",
            [
              `Symmetrisch: P = 2 · Φ(z) − 1 = 2 · ${dec(w)} − 1 = ${dec(pSym)}.`,
              `d = z · σ = ${zStr(z)} · ${fmt(sigma)} = ${fmt(d, 2)}; also a = μ − d = ${fmt(a, 2)} und b = μ + d = ${fmt(b, 2)}.`,
            ],
            `a = ${fmt(a, 2)}, b = ${fmt(b, 2)} und P = ${dec(pSym)}.`,
            { mu, sigma, z, w, pSym, d, a, b },
          ),
          anyOrder: [0, 1],
          given: [
            `μ = ${fmt(mu)}, σ = ${fmt(sigma)}`,
            `Tabelle: Φ(${zStr(z)}) = ${dec(w)}`,
            "symmetrisch: P(μ − d < X ≤ μ + d) = 2 · Φ(z) − 1",
          ],
        };
      },
    },
  ],
});

export const STAGE_NORMALVERTEILUNG = makeStage(
  2,
  "Stetige Zufallsgrößen, Dichte- und Verteilungsfunktion, Sigma-Regeln",
  "#7c3aed",
  "🔔",
  [zufallsgroessen, glockenkurve, dichteVerteilung, sigmaRegeln],
);
