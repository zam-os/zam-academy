import { fmt, fmtUnit } from "../exercises/format";
import { G, P_AIR } from "../lab/engine";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-1-druck";

// 1.1 Druck ────────────────────────────────────────────────────────────────

const druck: Lesson = {
  id: "dr-1-druck",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Druck: Kraft pro Fläche",
  subtitle: "Was Schneeschuhe, Reißzwecken und Reifendruck gemeinsam haben",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 1 (I) · Ph9 LB 1 (II/III): Druck in eingeschlossenen Flüssigkeiten und Gasen, Druckmessung",
  whyItMatters:
    "Dieselbe Kraft wirkt auf einer kleinen Fläche ganz anders als auf einer großen: Eine Reißzwecke dringt ein, ein Schneeschuh trägt. Der Druck sagt, wie stark eine Kraft auf einer Fläche verteilt ist.",
  explanationHtml: `
    <p>Drückt eine Kraft <strong>F</strong> senkrecht auf eine Fläche <strong>A</strong>, dann herrscht dort der <strong>Druck</strong> p = F / A.</p>
    <ul>
      <li>Einheit: <strong>1 Pa (Pascal) = 1 N/m²</strong>. Das ist winzig, deshalb rechnet man oft in <strong>hPa</strong> (1 hPa = 100 Pa), <strong>kPa</strong> (1 kPa = 1000 Pa) oder <strong>bar</strong> (1 bar = 100 000 Pa = 1000 hPa).</li>
      <li>Fläche umrechnen: <strong>1 m² = 10 000 cm²</strong>, also 1 cm² = 0,0001 m².</li>
      <li>In einer eingeschlossenen Flüssigkeit oder einem Gas breitet sich Druck <strong>nach allen Seiten gleich</strong> aus. Das zeigt sich am Manometer, das in jeder Richtung denselben Wert anzeigt.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Halbe Fläche bedeutet doppelten Druck. Deshalb schneidet ein scharfes Messer, und deshalb trägt der Schnee einen Schneeschuh.</div>
  `,
  formulas: [
    { name: "Druck", html: "p = F / A", quantities: "p in Pa, F in N, A in m²" },
    { name: "Einheiten", html: "1 Pa = 1 N/m² · 1 hPa = 100 Pa · 1 bar = 100 000 Pa", quantities: "1 m² = 10 000 cm²" },
  ],
  quiz: {
    question: "Eine Person steht erst auf beiden Füßen, dann auf einem Fuß. Wie ändert sich der Druck auf den Boden?",
    options: [
      "Er bleibt gleich, weil die Gewichtskraft gleich bleibt",
      "Er verdoppelt sich, weil die Fläche halbiert wird",
      "Er halbiert sich, weil nur noch ein Fuß drückt",
    ],
    correctIndex: 1,
    explanation: "Die Kraft bleibt gleich, die Fläche wird halbiert: p = F / A wird doppelt so groß.",
  },
  lab: {
    kind: "pressure-stamp",
    title: "Labor: Stempel auf dem Boden",
    intro: "Stelle Kraft und Fläche ein und beobachte, wie stark der Boden belastet wird.",
    params: [
      { type: "range", key: "F", label: "Kraft F", unit: "N", min: 10, max: 1000, step: 10, value: 400 },
      { type: "range", key: "A", label: "Fläche A", unit: "cm²", min: 1, max: 2000, step: 1, value: 50 },
    ],
    readouts: [
      { key: "p", label: "Druck p", unit: "Pa", digits: 0, emphasis: true, compute: (v) => v.F / (v.A / 10_000) },
      { key: "pBar", label: "Druck in bar", unit: "bar", digits: 3, compute: (v) => v.F / (v.A / 10_000) / 100_000 },
    ],
    goals: [
      { id: "ein-bar", text: "Erzeuge genau 1 bar, also 100 000 Pa (±5 %).", check: (_v, r) => near(Number(r.p), 100_000, 0.05) },
      { id: "reisszwecke", text: "Erzeuge mit höchstens 50 N einen Druck von mindestens 100 000 Pa.", check: (v, r) => v.F <= 50 && Number(r.p) >= 100_000 },
      { id: "schneeschuh", text: "Schneeschuh: Verteile 800 N so, dass weniger als 5 000 Pa entstehen.", check: (v, r) => near(v.F, 800, 0.01) && Number(r.p) < 5000 },
    ],
  },
  exercises: [
    {
      id: "druck-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const F = rng.int(5, 90) * 10;
          const A = rng.pick([20, 25, 40, 50, 80, 100, 125, 200, 250]);
          const p = F / (A / 10_000);
          return {
            prompt: `Eine Kraft von ${fmtUnit(F, "N", 0)} wirkt senkrecht auf eine Fläche von ${fmtUnit(A, "cm²", 0)}. Berechne den Druck in Pascal.`,
            given: [`F = ${fmtUnit(F, "N", 0)}`, `A = ${fmtUnit(A, "cm²", 0)} = ${fmtUnit(A / 10_000, "m²", 4)}`],
            formulaHint: "p = F / A",
            answer: p,
            unit: "Pa",
            digits: 0,
            solutionHtml: `p = F / A = ${fmtUnit(F, "N", 0)} / ${fmtUnit(A / 10_000, "m²", 4)} = <strong>${fmtUnit(p, "Pa", 0)}</strong>`,
          };
        }
        const m = rng.int(40, 90);
        const A = rng.int(14, 24) * 10;
        const p = (m * G) / (A / 10_000) / 1000;
        return {
          prompt: `Eine Person mit der Masse ${fmtUnit(m, "kg", 0)} steht auf einem Bein. Die Schuhsohle berührt den Boden auf ${fmtUnit(A, "cm²", 0)}. Berechne den Druck auf den Boden in kPa (g = 9,81 N/kg).`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `A = ${fmtUnit(A, "cm²", 0)}`],
          answer: p,
          unit: "kPa",
          digits: 1,
          solutionHtml: `F_G = m · g = ${fmtUnit(m, "kg", 0)} · 9,81 N/kg = ${fmtUnit(m * G, "N", 1)}<br>A = ${fmtUnit(A, "cm²", 0)} = ${fmtUnit(A / 10_000, "m²", 4)}<br>p = F / A = ${fmtUnit((m * G) / (A / 10_000), "Pa", 0)} = <strong>${fmtUnit(p, "kPa", 1)}</strong>`,
        };
      },
    },
    {
      id: "kraft-aus-druck",
      make: (rng, level) => {
        if (level === 1) {
          const p = rng.int(2, 40) * 1000;
          const A = rng.pick([0.02, 0.05, 0.1, 0.2, 0.25, 0.5]);
          const F = p * A;
          return {
            prompt: `Auf eine Fläche von ${fmtUnit(A, "m²", 2)} wirkt ein Druck von ${fmtUnit(p, "Pa", 0)}. Welche Kraft wirkt auf die Fläche?`,
            given: [`p = ${fmtUnit(p, "Pa", 0)}`, `A = ${fmtUnit(A, "m²", 2)}`],
            formulaHint: "p = F / A, also F = p · A",
            answer: F,
            unit: "N",
            digits: 0,
            solutionHtml: `F = p · A = ${fmtUnit(p, "Pa", 0)} · ${fmtUnit(A, "m²", 2)} = <strong>${fmtUnit(F, "N", 0)}</strong>`,
          };
        }
        const bar = rng.pick([2, 2.2, 2.5, 2.8, 3]);
        const A = rng.int(8, 20) * 10;
        const F = bar * 100_000 * (A / 10_000);
        return {
          prompt: `In einem Autoreifen herrscht ein Überdruck von ${fmtUnit(bar, "bar", 1)}. Der Reifen berührt die Straße auf einer Fläche von ${fmtUnit(A, "cm²", 0)}. Welche Kraft trägt diese Aufstandsfläche?`,
          given: [`p = ${fmtUnit(bar, "bar", 1)}`, `A = ${fmtUnit(A, "cm²", 0)}`],
          answer: F,
          unit: "N",
          digits: 0,
          solutionHtml: `p = ${fmtUnit(bar, "bar", 1)} = ${fmtUnit(bar * 100_000, "Pa", 0)}<br>A = ${fmtUnit(A, "cm²", 0)} = ${fmtUnit(A / 10_000, "m²", 4)}<br>F = p · A = <strong>${fmtUnit(F, "N", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kannst Kräfte auf Flächen verteilen und den Druck in Pa, hPa und bar angeben.",
};

// 1.2 Hydraulik ────────────────────────────────────────────────────────────

const hydraulik: Lesson = {
  id: "dr-2-hydraulik",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Der hydraulische Kraftwandler",
  subtitle: "Wie eine Hebebühne mit wenig Kraft ein Auto hebt",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 1 (I): hydraulischer Kraftwandler · Ph9 LB 1 (II/III): hydraulische Anwendungen (qualitativ)",
  whyItMatters:
    "Bremsen, Bagger, Hebebühnen: Überall überträgt eine Flüssigkeit Druck und verwandelt eine kleine Kraft in eine große. Der Preis dafür ist ein längerer Weg.",
  explanationHtml: `
    <p>In einer eingeschlossenen Flüssigkeit herrscht überall <strong>derselbe Druck</strong>. Zwei verbundene Zylinder mit Kolben bilden deshalb einen <strong>hydraulischen Kraftwandler</strong>:</p>
    <ul>
      <li>Am kleinen Kolben erzeugt F<sub>1</sub> den Druck p = F<sub>1</sub> / A<sub>1</sub>. Derselbe Druck wirkt auf den großen Kolben: F<sub>2</sub> = p · A<sub>2</sub>.</li>
      <li>Daraus folgt <strong>F<sub>1</sub> / A<sub>1</sub> = F<sub>2</sub> / A<sub>2</sub></strong>: Die Kräfte verhalten sich wie die Kolbenflächen.</li>
      <li>Die Flüssigkeit lässt sich nicht zusammendrücken. Das verschobene Volumen ist auf beiden Seiten gleich: <strong>A<sub>1</sub> · s<sub>1</sub> = A<sub>2</sub> · s<sub>2</sub></strong>. Der große Kolben bewegt sich um so viel weniger, wie die Kraft größer wird.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Zehnfache Fläche heißt zehnfache Kraft, aber nur ein Zehntel des Weges. Arbeit wird nicht gespart (goldene Regel der Mechanik).</div>
  `,
  formulas: [
    { name: "Hydraulischer Kraftwandler", html: "F<sub>1</sub> / A<sub>1</sub> = F<sub>2</sub> / A<sub>2</sub>", quantities: "F in N, A in cm² oder m² (beide Flächen in derselben Einheit)" },
    { name: "Kolbenwege", html: "A<sub>1</sub> · s<sub>1</sub> = A<sub>2</sub> · s<sub>2</sub>", quantities: "s in cm oder m" },
  ],
  quiz: {
    question: "Der große Kolben einer Hebebühne hat die 20-fache Fläche des kleinen. Was gilt für Kraft und Weg am großen Kolben?",
    options: [
      "20-fache Kraft und 20-facher Weg",
      "20-fache Kraft, aber nur ein Zwanzigstel des Weges",
      "Gleiche Kraft, aber 20-facher Weg",
    ],
    correctIndex: 1,
    explanation: "Die Kraft wächst mit der Fläche, der Weg schrumpft im gleichen Verhältnis: Das verschobene Volumen ist auf beiden Seiten gleich.",
  },
  lab: {
    kind: "hydraulic-press",
    title: "Labor: Hydraulische Presse",
    intro: "Drücke mit F₁ auf den kleinen Kolben. Welche Kraft F₂ hält der große Kolben, und wie weit bewegt er sich?",
    params: [
      { type: "range", key: "F1", label: "Kraft F₁", unit: "N", min: 10, max: 500, step: 10, value: 100 },
      { type: "range", key: "A1", label: "Fläche A₁", unit: "cm²", min: 1, max: 50, step: 1, value: 10 },
      { type: "range", key: "A2", label: "Fläche A₂", unit: "cm²", min: 10, max: 1000, step: 10, value: 200 },
      { type: "range", key: "s1", label: "Weg s₁", unit: "cm", min: 1, max: 50, step: 1, value: 20 },
    ],
    readouts: [
      { key: "p", label: "Druck p", unit: "Pa", digits: 0, compute: (v) => v.F1 / (v.A1 / 10_000) },
      { key: "F2", label: "Kraft F₂", unit: "N", digits: 0, emphasis: true, compute: (v) => (v.F1 * v.A2) / v.A1 },
      { key: "s2", label: "Weg s₂", unit: "cm", digits: 2, compute: (v) => (v.s1 * v.A1) / v.A2 },
      { key: "factor", label: "Kraftverstärkung A₂ / A₁", digits: 1, compute: (v) => v.A2 / v.A1 },
    ],
    goals: [
      { id: "auto", text: "Hebe eine Last von mindestens 12 000 N mit höchstens 300 N.", check: (v, r) => v.F1 <= 300 && Number(r.F2) >= 12_000 },
      { id: "zehntel", text: "Stelle die Flächen so ein, dass s₂ genau ein Zehntel von s₁ ist (±2 %).", check: (_v, r) => near(Number(r.factor), 10, 0.02) },
      { id: "gleich", text: "Mache beide Kolben gleich groß: Dann ist F₂ = F₁.", check: (v) => v.A1 === v.A2 },
    ],
  },
  exercises: [
    {
      id: "hydraulik-kraft",
      make: (rng, level) => {
        if (level === 1) {
          const F1 = rng.int(5, 40) * 10;
          const A1 = rng.pick([2, 4, 5, 8, 10]);
          const A2 = A1 * rng.pick([5, 8, 10, 20, 25, 40]);
          const F2 = (F1 * A2) / A1;
          return {
            prompt: `Auf den kleinen Kolben (A₁ = ${fmtUnit(A1, "cm²", 0)}) wirkt die Kraft F₁ = ${fmtUnit(F1, "N", 0)}. Welche Kraft wirkt auf den großen Kolben mit A₂ = ${fmtUnit(A2, "cm²", 0)}?`,
            given: [`F₁ = ${fmtUnit(F1, "N", 0)}`, `A₁ = ${fmtUnit(A1, "cm²", 0)}`, `A₂ = ${fmtUnit(A2, "cm²", 0)}`],
            formulaHint: "F₁ / A₁ = F₂ / A₂, also F₂ = F₁ · A₂ / A₁",
            answer: F2,
            unit: "N",
            digits: 0,
            solutionHtml: `F₂ = F₁ · A₂ / A₁ = ${fmtUnit(F1, "N", 0)} · ${fmt(A2, 0)} / ${fmt(A1, 0)} = <strong>${fmtUnit(F2, "N", 0)}</strong>`,
          };
        }
        const m = rng.int(90, 180) * 10;
        const A1 = rng.pick([5, 8, 10, 12]);
        const A2 = A1 * rng.pick([25, 30, 40, 50]);
        const F1 = (m * G * A1) / A2;
        return {
          prompt: `Eine Hebebühne soll ein Auto mit der Masse ${fmtUnit(m, "kg", 0)} heben. Der Hubkolben hat ${fmtUnit(A2, "cm²", 0)}, der Pumpkolben ${fmtUnit(A1, "cm²", 0)}. Mit welcher Kraft muss man mindestens auf den Pumpkolben drücken (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `A₁ = ${fmtUnit(A1, "cm²", 0)}`, `A₂ = ${fmtUnit(A2, "cm²", 0)}`],
          answer: F1,
          unit: "N",
          digits: 0,
          solutionHtml: `F₂ = F_G = m · g = ${fmtUnit(m * G, "N", 0)}<br>F₁ = F₂ · A₁ / A₂ = ${fmtUnit(m * G, "N", 0)} · ${fmt(A1, 0)} / ${fmt(A2, 0)} = <strong>${fmtUnit(F1, "N", 0)}</strong>`,
        };
      },
    },
    {
      id: "hydraulik-weg",
      make: (rng, level) => {
        if (level === 1) {
          const s1 = rng.int(5, 40);
          const A1 = rng.pick([2, 4, 5, 10]);
          const A2 = A1 * rng.pick([4, 5, 8, 10, 20]);
          const s2 = (s1 * A1) / A2;
          return {
            prompt: `Der kleine Kolben (A₁ = ${fmtUnit(A1, "cm²", 0)}) wird um s₁ = ${fmtUnit(s1, "cm", 0)} hineingedrückt. Um welche Strecke hebt sich der große Kolben mit A₂ = ${fmtUnit(A2, "cm²", 0)}?`,
            given: [`s₁ = ${fmtUnit(s1, "cm", 0)}`, `A₁ = ${fmtUnit(A1, "cm²", 0)}`, `A₂ = ${fmtUnit(A2, "cm²", 0)}`],
            formulaHint: "A₁ · s₁ = A₂ · s₂, also s₂ = s₁ · A₁ / A₂",
            answer: s2,
            unit: "cm",
            digits: 2,
            solutionHtml: `s₂ = s₁ · A₁ / A₂ = ${fmtUnit(s1, "cm", 0)} · ${fmt(A1, 0)} / ${fmt(A2, 0)} = <strong>${fmtUnit(s2, "cm", 2)}</strong>`,
          };
        }
        const s2 = rng.int(2, 12) * 5;
        const factor = rng.pick([20, 25, 40, 50]);
        const s1 = s2 * factor;
        return {
          prompt: `Der Hubkolben einer Hebebühne hat die ${factor}-fache Fläche des Pumpkolbens. Das Auto soll um ${fmtUnit(s2, "cm", 0)} angehoben werden. Welche Strecke muss der Pumpkolben insgesamt zurücklegen? Gib das Ergebnis in Metern an.`,
          given: [`A₂ / A₁ = ${factor}`, `s₂ = ${fmtUnit(s2, "cm", 0)}`],
          answer: s1 / 100,
          unit: "m",
          digits: 2,
          solutionHtml: `A₁ · s₁ = A₂ · s₂ ⇒ s₁ = s₂ · A₂ / A₁ = ${fmtUnit(s2, "cm", 0)} · ${factor} = ${fmtUnit(s1, "cm", 0)} = <strong>${fmtUnit(s1 / 100, "m", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, warum ein Wagenheber wenig Kraft braucht, aber viele Pumpenhübe.",
};

// 1.3 Schweredruck und Luftdruck ───────────────────────────────────────────

const schweredruck: Lesson = {
  id: "dr-3-schweredruck",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Schweredruck und Luftdruck",
  subtitle: "Warum Taucher einen Druckausgleich brauchen und Bergsteiger dünne Luft atmen",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 1 (I) · Ph9 LB 1 (II/III): Schweredruck in Flüssigkeiten (mit freier Oberfläche), Luftdruck",
  whyItMatters:
    "Die Flüssigkeit über dir hat Gewicht. Jeder Meter Wassertiefe legt rund 100 hPa drauf, und die Luftsäule der Atmosphäre drückt mit etwa 1 bar auf jeden von uns.",
  explanationHtml: `
    <p>In einer Flüssigkeit mit freier Oberfläche wächst der Druck mit der Tiefe: Die darüber liegende Flüssigkeitssäule drückt mit ihrer Gewichtskraft. Das ist der <strong>Schweredruck</strong>:</p>
    <p class="formula-line">p = ρ · g · h</p>
    <ul>
      <li>ρ (rho) ist die <strong>Dichte</strong> der Flüssigkeit (Wasser: 1000 kg/m³), g = 9,81 N/kg, h die Tiefe unter der Oberfläche.</li>
      <li>Der Schweredruck hängt <strong>nur von Tiefe und Dichte</strong> ab, nicht von der Form des Gefäßes (hydrostatisches Paradoxon). In 10 m Wassertiefe beträgt er rund 1 bar.</li>
      <li>Der <strong>Gesamtdruck</strong> auf einen Taucher ist Luftdruck plus Schweredruck: in 10 m Tiefe etwa 2 bar.</li>
      <li>Auch Luft hat Gewicht. Der <strong>Luftdruck</strong> beträgt auf Meereshöhe im Mittel <strong>1013 hPa</strong> und nimmt nach oben ab: in den ersten Kilometern etwa 1 hPa pro 8 m Höhe, in 5500 m Höhe nur noch die Hälfte.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Pro 10 m Wassertiefe kommt etwa 1 bar dazu. Schnelles Auftauchen oder ein schneller Aufstieg am Berg bringt den Körper durch die Druckänderung in Gefahr.</div>
  `,
  formulas: [
    { name: "Schweredruck", html: "p = ρ · g · h", quantities: "p in Pa, ρ in kg/m³, g = 9,81 N/kg, h in m" },
    { name: "Gesamtdruck unter Wasser", html: "p<sub>ges</sub> = p<sub>Luft</sub> + ρ · g · h", quantities: "p_Luft ≈ 1013 hPa ≈ 1 bar" },
  ],
  quiz: {
    question: "Drei Gefäße sind unterschiedlich geformt, aber gleich hoch mit Wasser gefüllt. Wo ist der Schweredruck am Boden am größten?",
    options: [
      "Im breitesten Gefäß, weil es am meisten Wasser enthält",
      "Im schmalsten Gefäß, weil sich das Wasser dort staut",
      "In allen gleich, weil nur die Füllhöhe zählt",
    ],
    correctIndex: 2,
    explanation: "p = ρ · g · h enthält keine Fläche und keine Form. Gleiche Höhe, gleiche Flüssigkeit, gleicher Druck: das hydrostatische Paradoxon.",
  },
  lab: {
    kind: "hydrostatic",
    title: "Labor: Tauchgang",
    intro: "Schicke den Taucher in die Tiefe und wechsle die Flüssigkeit. Beobachte Schweredruck und Gesamtdruck.",
    params: [
      { type: "range", key: "h", label: "Tiefe h", unit: "m", min: 0, max: 40, step: 0.5, value: 5, digits: 1 },
      {
        type: "choice",
        key: "rho",
        label: "Flüssigkeit",
        options: [
          { value: 1000, label: "Süßwasser (1000 kg/m³)" },
          { value: 1025, label: "Meerwasser (1025 kg/m³)" },
          { value: 900, label: "Speiseöl (900 kg/m³)" },
        ],
        value: 1000,
      },
    ],
    readouts: [
      { key: "pS", label: "Schweredruck ρ · g · h", unit: "Pa", digits: 0, emphasis: true, compute: (v) => v.rho * G * v.h },
      { key: "pSbar", label: "Schweredruck in bar", unit: "bar", digits: 2, compute: (v) => (v.rho * G * v.h) / 100_000 },
      { key: "pTotalBar", label: "Gesamtdruck (mit Luftdruck 1,013 bar)", unit: "bar", digits: 2, compute: (v) => (P_AIR + v.rho * G * v.h) / 100_000 },
    ],
    goals: [
      { id: "ein-bar", text: "Finde die Tiefe in Süßwasser, in der der Schweredruck 1 bar erreicht (±3 %).", check: (v, r) => v.rho === 1000 && near(Number(r.pS), 100_000, 0.03) },
      { id: "vier-bar", text: "Erzeuge in Meerwasser einen Gesamtdruck von mindestens 4 bar.", check: (v, r) => v.rho === 1025 && Number(r.pTotalBar) >= 4 },
      { id: "oel", text: "Zeige: In 20 m Öl ist der Schweredruck kleiner als in 20 m Wasser. Stelle 20 m Öl ein.", check: (v) => v.rho === 900 && v.h === 20 },
    ],
  },
  exercises: [
    {
      id: "schweredruck",
      make: (rng, level) => {
        if (level === 1) {
          const h = rng.stepped(1, 30, 0.5);
          const rho = rng.pick([1000, 1025, 900, 800]);
          const p = rho * G * h;
          return {
            prompt: `Berechne den Schweredruck in ${fmtUnit(h, "m", 1)} Tiefe in einer Flüssigkeit der Dichte ${fmtUnit(rho, "kg/m³", 0)} (g = 9,81 N/kg).`,
            given: [`ρ = ${fmtUnit(rho, "kg/m³", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, "g = 9,81 N/kg"],
            formulaHint: "p = ρ · g · h",
            answer: p,
            unit: "Pa",
            digits: 0,
            solutionHtml: `p = ρ · g · h = ${fmt(rho, 0)} kg/m³ · 9,81 N/kg · ${fmt(h, 1)} m = <strong>${fmtUnit(p, "Pa", 0)}</strong>`,
          };
        }
        const h = rng.int(8, 40);
        const p = (P_AIR + 1025 * G * h) / 100_000;
        return {
          prompt: `Ein Taucher befindet sich ${fmtUnit(h, "m", 0)} tief im Meer (Dichte 1025 kg/m³). Berechne den Gesamtdruck in bar, der auf ihn wirkt. Der Luftdruck beträgt 1013 hPa.`,
          given: [`h = ${fmtUnit(h, "m", 0)}`, "ρ = 1025 kg/m³", "p_Luft = 1013 hPa"],
          answer: p,
          unit: "bar",
          digits: 2,
          solutionHtml: `Schweredruck: ρ · g · h = 1025 · 9,81 · ${fmt(h, 0)} Pa = ${fmtUnit(1025 * G * h, "Pa", 0)} = ${fmtUnit((1025 * G * h) / 100_000, "bar", 2)}<br>Gesamtdruck = 1,013 bar + ${fmtUnit((1025 * G * h) / 100_000, "bar", 2)} = <strong>${fmtUnit(p, "bar", 2)}</strong>`,
        };
      },
    },
    {
      id: "tiefe-aus-druck",
      make: (rng, level) => {
        if (level === 1) {
          const p = rng.int(2, 30) * 10_000;
          const h = p / (1000 * G);
          return {
            prompt: `In welcher Wassertiefe beträgt der Schweredruck ${fmtUnit(p, "Pa", 0)}? (ρ = 1000 kg/m³, g = 9,81 N/kg)`,
            given: [`p = ${fmtUnit(p, "Pa", 0)}`, "ρ = 1000 kg/m³", "g = 9,81 N/kg"],
            formulaHint: "p = ρ · g · h, also h = p / (ρ · g)",
            answer: h,
            unit: "m",
            digits: 2,
            solutionHtml: `h = p / (ρ · g) = ${fmt(p, 0)} Pa / (1000 kg/m³ · 9,81 N/kg) = <strong>${fmtUnit(h, "m", 2)}</strong>`,
          };
        }
        const bar = rng.pick([2.5, 3, 3.5, 4, 4.5, 5]);
        const h = (bar * 100_000) / (1000 * G);
        return {
          prompt: `Am Wasserhahn eines Hauses soll der Wasserdruck ${fmtUnit(bar, "bar", 1)} betragen. Wie hoch muss der Wasserspiegel im Wasserturm über dem Hahn liegen? Rechne nur mit dem Schweredruck.`,
          given: [`p = ${fmtUnit(bar, "bar", 1)}`, "ρ = 1000 kg/m³"],
          answer: h,
          unit: "m",
          digits: 1,
          solutionHtml: `p = ${fmtUnit(bar, "bar", 1)} = ${fmtUnit(bar * 100_000, "Pa", 0)}<br>h = p / (ρ · g) = ${fmt(bar * 100_000, 0)} / (1000 · 9,81) m = <strong>${fmtUnit(h, "m", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kannst den Druck in jeder Tiefe berechnen und weißt, was die Luftsäule über dir wiegt.",
};

// 1.4 Auftrieb ─────────────────────────────────────────────────────────────

const auftrieb: Lesson = {
  id: "dr-4-auftrieb",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Auftrieb: Schwimmen, Schweben, Sinken",
  subtitle: "Das Prinzip des Archimedes",
  tracks: ["I"],
  lehrplan: "Ph9 LB 1 (I): Auftrieb in Flüssigkeiten und Gasen, Prinzip des Archimedes",
  whyItMatters:
    "Ein Stahlschiff schwimmt, ein Stahlnagel sinkt. Ob etwas schwimmt, entscheidet nicht das Material allein, sondern die Auftriebskraft gegen die Gewichtskraft.",
  explanationHtml: `
    <p>Unter einem eingetauchten Körper ist der Schweredruck größer als oben. Die Flüssigkeit drückt ihn deshalb nach oben: Das ist die <strong>Auftriebskraft F<sub>A</sub></strong>.</p>
    <p class="formula-line">F<sub>A</sub> = ρ<sub>Fl</sub> · g · V<sub>verdrängt</sub></p>
    <ul>
      <li><strong>Prinzip des Archimedes:</strong> Die Auftriebskraft ist so groß wie die Gewichtskraft der <strong>verdrängten Flüssigkeit</strong>.</li>
      <li>Vergleiche F<sub>A</sub> (ganz eingetaucht) mit der Gewichtskraft F<sub>G</sub>: F<sub>G</sub> &gt; F<sub>A</sub>: der Körper <strong>sinkt</strong>. F<sub>G</sub> = F<sub>A</sub>: er <strong>schwebt</strong>. F<sub>G</sub> &lt; F<sub>A</sub>: er <strong>steigt</strong> und <strong>schwimmt</strong> dann an der Oberfläche.</li>
      <li>Kürzer mit Dichten: ρ<sub>Körper</sub> &gt; ρ<sub>Fl</sub> sinkt, = schwebt, &lt; schwimmt. Beim Schwimmen taucht der Anteil ρ<sub>Körper</sub> / ρ<sub>Fl</sub> ein, beim Eisberg rund 90 %.</li>
      <li>Das gilt auch in Gasen: Ein Heißluftballon steigt, weil die warme Luft in ihm weniger dicht ist als die Umgebungsluft.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Nicht das Material, die <strong>mittlere Dichte</strong> entscheidet. Ein Schiff ist innen voller Luft.</div>
  `,
  formulas: [
    { name: "Auftriebskraft", html: "F<sub>A</sub> = ρ<sub>Fl</sub> · g · V", quantities: "F_A in N, ρ_Fl in kg/m³, V verdrängtes Volumen in m³ (1 dm³ = 1 L = 0,001 m³)" },
    { name: "Schwimmbedingung", html: "F<sub>A</sub> = F<sub>G</sub> bzw. ρ<sub>K</sub> &lt; ρ<sub>Fl</sub>", quantities: "eingetauchter Anteil = ρ_K / ρ_Fl" },
  ],
  quiz: {
    question: "Ein Körper schwebt in Wasser. Was weißt du über seine mittlere Dichte?",
    options: [
      "Sie ist gleich der Dichte von Wasser",
      "Sie ist kleiner als die Dichte von Wasser",
      "Sie ist größer als die Dichte von Wasser",
    ],
    correctIndex: 0,
    explanation: "Schweben heißt F_A = F_G bei vollständigem Eintauchen, also ρ_Körper = ρ_Flüssigkeit.",
  },
  lab: {
    kind: "buoyancy",
    title: "Labor: Körper im Becken",
    intro: "Ändere Volumen und Dichte des Körpers oder die Flüssigkeit. Sinkt, schwebt oder schwimmt er?",
    params: [
      { type: "range", key: "V", label: "Volumen V", unit: "dm³", min: 0.1, max: 10, step: 0.1, value: 2, digits: 1 },
      { type: "range", key: "rhoK", label: "Dichte des Körpers", unit: "kg/m³", min: 100, max: 12_000, step: 10, value: 700 },
      {
        type: "choice",
        key: "rhoFl",
        label: "Flüssigkeit",
        options: [
          { value: 1000, label: "Wasser (1000 kg/m³)" },
          { value: 1025, label: "Meerwasser (1025 kg/m³)" },
          { value: 900, label: "Öl (900 kg/m³)" },
          { value: 13_600, label: "Quecksilber (13 600 kg/m³)" },
        ],
        value: 1000,
      },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft F_G", unit: "N", digits: 2, compute: (v) => v.rhoK * (v.V / 1000) * G },
      { key: "FA", label: "Auftriebskraft F_A (ganz eingetaucht)", unit: "N", digits: 2, emphasis: true, compute: (v) => v.rhoFl * (v.V / 1000) * G },
      {
        key: "state",
        label: "Verhalten",
        compute: (v) => {
          if (near(v.rhoK, v.rhoFl, 0.005)) return "schwebt";
          return v.rhoK > v.rhoFl ? "sinkt" : "schwimmt";
        },
      },
      { key: "frac", label: "Eingetauchter Anteil beim Schwimmen", unit: "%", digits: 0, compute: (v) => Math.min(100, (v.rhoK / v.rhoFl) * 100) },
    ],
    goals: [
      { id: "schweben", text: "Bring den Körper in Wasser zum Schweben.", check: (v, r) => v.rhoFl === 1000 && r.state === "schwebt" },
      { id: "eisen", text: "Lass einen Körper mit mindestens 7 800 kg/m³ (Eisen) schwimmen.", check: (v, r) => v.rhoK >= 7800 && r.state === "schwimmt" },
      { id: "eisberg", text: "Baue einen Eisberg: In Meerwasser sollen etwa 90 % (88 bis 92 %) eintauchen.", check: (v, r) => v.rhoFl === 1025 && r.state === "schwimmt" && Number(r.frac) >= 88 && Number(r.frac) <= 92 },
    ],
  },
  exercises: [
    {
      id: "auftriebskraft",
      make: (rng, level) => {
        if (level === 1) {
          const V = rng.pick([0.2, 0.5, 0.8, 1, 1.5, 2, 2.5, 4]);
          const FA = 1000 * (V / 1000) * G;
          return {
            prompt: `Ein Körper mit dem Volumen ${fmtUnit(V, "dm³", 1)} ist vollständig in Wasser eingetaucht. Berechne die Auftriebskraft (ρ = 1000 kg/m³, g = 9,81 N/kg).`,
            given: [`V = ${fmtUnit(V, "dm³", 1)} = ${fmtUnit(V / 1000, "m³", 4)}`, "ρ_Fl = 1000 kg/m³"],
            formulaHint: "F_A = ρ_Fl · g · V",
            answer: FA,
            unit: "N",
            digits: 2,
            solutionHtml: `F_A = ρ · g · V = 1000 kg/m³ · 9,81 N/kg · ${fmtUnit(V / 1000, "m³", 4)} = <strong>${fmtUnit(FA, "N", 2)}</strong>`,
          };
        }
        const V = rng.int(10, 60) * 10;
        const rhoStone = rng.pick([2500, 2600, 2700, 3000]);
        const m = (rhoStone * V) / 1_000_000;
        const F = m * G - 1000 * (V / 1_000_000) * G;
        return {
          prompt: `Ein Stein (Volumen ${fmtUnit(V, "cm³", 0)}, Dichte ${fmtUnit(rhoStone, "kg/m³", 0)}) hängt an einem Federkraftmesser und wird ganz in Wasser getaucht. Welche Kraft zeigt der Kraftmesser unter Wasser an?`,
          given: [`V = ${fmtUnit(V, "cm³", 0)} = ${fmtUnit(V / 1_000_000, "m³", 6)}`, `ρ_Stein = ${fmtUnit(rhoStone, "kg/m³", 0)}`, "ρ_Wasser = 1000 kg/m³"],
          answer: F,
          unit: "N",
          digits: 2,
          solutionHtml: `m = ρ · V = ${fmt(rhoStone, 0)} · ${fmt(V / 1_000_000, 6)} kg = ${fmtUnit(m, "kg", 3)}, F_G = m · g = ${fmtUnit(m * G, "N", 2)}<br>F_A = 1000 · 9,81 · ${fmt(V / 1_000_000, 6)} N = ${fmtUnit(1000 * (V / 1_000_000) * G, "N", 2)}<br>Anzeige = F_G − F_A = <strong>${fmtUnit(F, "N", 2)}</strong>`,
        };
      },
    },
    {
      id: "schwimmen-anteil",
      make: (rng, level) => {
        if (level === 1) {
          const rhoK = rng.pick([500, 600, 650, 700, 800, 900, 917]);
          const rhoFl = rng.pick([1000, 1025]);
          const anteil = (rhoK / rhoFl) * 100;
          return {
            prompt: `Ein Körper der Dichte ${fmtUnit(rhoK, "kg/m³", 0)} schwimmt in einer Flüssigkeit der Dichte ${fmtUnit(rhoFl, "kg/m³", 0)}. Wie viel Prozent seines Volumens tauchen ein?`,
            given: [`ρ_K = ${fmtUnit(rhoK, "kg/m³", 0)}`, `ρ_Fl = ${fmtUnit(rhoFl, "kg/m³", 0)}`],
            formulaHint: "Schwimmen: F_A = F_G ⇒ eingetauchter Anteil = ρ_K / ρ_Fl",
            answer: anteil,
            unit: "%",
            digits: 1,
            solutionHtml: `Anteil = ρ_K / ρ_Fl = ${fmt(rhoK, 0)} / ${fmt(rhoFl, 0)} = ${fmt(rhoK / rhoFl, 3)} = <strong>${fmtUnit(anteil, "%", 1)}</strong>`,
          };
        }
        const V = rng.int(20, 120);
        const rhoHolz = rng.pick([500, 600, 700, 800]);
        const Vunter = (V * rhoHolz) / 1000;
        return {
          prompt: `Ein Holzbalken (Volumen ${fmtUnit(V, "dm³", 0)}, Dichte ${fmtUnit(rhoHolz, "kg/m³", 0)}) schwimmt in Wasser. Wie viel Volumen liegt unter Wasser?`,
          given: [`V = ${fmtUnit(V, "dm³", 0)}`, `ρ_Holz = ${fmtUnit(rhoHolz, "kg/m³", 0)}`, "ρ_Wasser = 1000 kg/m³"],
          answer: Vunter,
          unit: "dm³",
          digits: 1,
          solutionHtml: `Schwimmen: F_A = F_G ⇒ ρ_W · V_unter = ρ_Holz · V ⇒ V_unter = V · ρ_Holz / ρ_W = ${fmt(V, 0)} dm³ · ${fmt(rhoHolz, 0)} / 1000 = <strong>${fmtUnit(Vunter, "dm³", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Archimedes hätte seine Freude: Du kannst Sinken, Schweben und Schwimmen vorhersagen.",
};

// 1.5 Boyle-Mariotte ───────────────────────────────────────────────────────

const boyle: Lesson = {
  id: "dr-5-boyle-mariotte",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Gesetz von Boyle-Mariotte",
  subtitle: "Gas zusammendrücken bei gleichbleibender Temperatur",
  tracks: ["I"],
  lehrplan: "Ph9 LB 1 (I): Gesetz von Boyle-Mariotte",
  whyItMatters:
    "Eine Luftblase, die vom Grund eines Sees aufsteigt, wird größer. Eine Fahrradpumpe presst Luft zusammen. Beides folgt einer einfachen Regel: Druck mal Volumen bleibt gleich.",
  explanationHtml: `
    <p>Schließt man eine Gasmenge ein und drückt sie bei <strong>gleichbleibender Temperatur</strong> zusammen, steigt der Druck. Halbes Volumen bedeutet doppelten Druck:</p>
    <p class="formula-line">p<sub>1</sub> · V<sub>1</sub> = p<sub>2</sub> · V<sub>2</sub> (bei konstanter Temperatur)</p>
    <ul>
      <li>Druck und Volumen sind <strong>umgekehrt proportional</strong>. Das Produkt p · V ist konstant.</li>
      <li>Im Teilchenmodell: Dieselben Teilchen stoßen im kleineren Raum öfter gegen die Wände. Mehr Stöße pro Fläche bedeuten mehr Druck.</li>
      <li>Es kommt nur auf den <strong>Absolutdruck</strong> an. Ein Reifen mit 2 bar Überdruck hat innen 3 bar Absolutdruck.</li>
      <li>Einheiten dürfen beliebig sein, solange p und V auf beiden Seiten gleich gemessen werden.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Temperatur gleich, Teilchenzahl gleich: p · V = konstant. Ändert sich die Temperatur, brauchst du die allgemeine Gasgleichung (Lektion 3.6).</div>
  `,
  formulas: [
    { name: "Boyle-Mariotte", html: "p<sub>1</sub> · V<sub>1</sub> = p<sub>2</sub> · V<sub>2</sub>", quantities: "bei konstanter Temperatur; p in Pa oder bar, V in cm³, L oder m³" },
  ],
  quiz: {
    question: "Ein Gas wird bei gleicher Temperatur auf ein Viertel seines Volumens zusammengedrückt. Wie ändert sich sein Druck?",
    options: [
      "Er sinkt auf ein Viertel",
      "Er verdoppelt sich",
      "Er vervierfacht sich",
    ],
    correctIndex: 2,
    explanation: "p · V bleibt konstant: Ein Viertel des Volumens ergibt den vierfachen Druck.",
  },
  lab: {
    kind: "boyle",
    title: "Labor: Spritze mit Luft",
    intro: "Verschiebe den Kolben bei gleichbleibender Temperatur. Wie hängt der Druck vom Volumen ab?",
    params: [
      { type: "range", key: "p1", label: "Anfangsdruck p₁", unit: "hPa", min: 500, max: 3000, step: 10, value: 1000 },
      { type: "range", key: "V1", label: "Anfangsvolumen V₁", unit: "cm³", min: 50, max: 200, step: 10, value: 100 },
      { type: "range", key: "V2", label: "Volumen V₂ (Kolben)", unit: "cm³", min: 10, max: 300, step: 1, value: 100 },
    ],
    readouts: [
      { key: "p2", label: "Druck p₂", unit: "hPa", digits: 0, emphasis: true, compute: (v) => (v.p1 * v.V1) / v.V2 },
      { key: "pv1", label: "p₁ · V₁", unit: "hPa · cm³", digits: 0, compute: (v) => v.p1 * v.V1 },
      { key: "pv2", label: "p₂ · V₂", unit: "hPa · cm³", digits: 0, compute: (v) => ((v.p1 * v.V1) / v.V2) * v.V2 },
    ],
    goals: [
      { id: "halbieren", text: "Halbiere das Volumen (V₂ = V₁ / 2): Der Druck verdoppelt sich.", check: (v) => near(v.V2, v.V1 / 2, 0.011) },
      { id: "viertausend", text: "Erzeuge aus p₁ = 1000 hPa einen Druck von 4 000 hPa (±2 %).", check: (v, r) => v.p1 === 1000 && near(Number(r.p2), 4000, 0.02) },
      { id: "ausdehnen", text: "Lass das Gas auf das Dreifache des Anfangsvolumens ausdehnen.", check: (v) => near(v.V2, 3 * v.V1, 0.011) },
    ],
  },
  exercises: [
    {
      id: "boyle-druck",
      make: (rng, level) => {
        if (level === 1) {
          const p1 = rng.pick([1000, 1013, 1200, 1500, 2000]);
          const V1 = rng.int(6, 20) * 10;
          const V2 = rng.pick([20, 25, 40, 50, 80]);
          const p2 = (p1 * V1) / V2;
          return {
            prompt: `In einer Spritze befinden sich ${fmtUnit(V1, "cm³", 0)} Luft bei ${fmtUnit(p1, "hPa", 0)}. Der Kolben wird bei gleicher Temperatur auf ${fmtUnit(V2, "cm³", 0)} hineingeschoben. Welcher Druck herrscht jetzt?`,
            given: [`p₁ = ${fmtUnit(p1, "hPa", 0)}`, `V₁ = ${fmtUnit(V1, "cm³", 0)}`, `V₂ = ${fmtUnit(V2, "cm³", 0)}`],
            formulaHint: "p₁ · V₁ = p₂ · V₂, also p₂ = p₁ · V₁ / V₂",
            answer: p2,
            unit: "hPa",
            digits: 0,
            solutionHtml: `p₂ = p₁ · V₁ / V₂ = ${fmt(p1, 0)} hPa · ${fmt(V1, 0)} / ${fmt(V2, 0)} = <strong>${fmtUnit(p2, "hPa", 0)}</strong>`,
          };
        }
        const h = rng.pick([10, 20, 30]);
        const V1 = rng.int(2, 9) * 0.5;
        const p1 = 1 + h / 10;
        const V2 = (p1 * V1) / 1;
        return {
          prompt: `Eine Luftblase mit ${fmtUnit(V1, "cm³", 1)} steigt vom Grund eines ${fmtUnit(h, "m", 0)} tiefen Sees auf. Dort herrschen ${fmtUnit(p1, "bar", 1)} (Luftdruck 1 bar plus 1 bar je 10 m). Welches Volumen hat die Blase an der Oberfläche bei 1 bar? Die Temperatur bleibe gleich.`,
          given: [`p₁ = ${fmtUnit(p1, "bar", 1)}`, `V₁ = ${fmtUnit(V1, "cm³", 1)}`, "p₂ = 1 bar"],
          answer: V2,
          unit: "cm³",
          digits: 1,
          solutionHtml: `V₂ = p₁ · V₁ / p₂ = ${fmt(p1, 1)} bar · ${fmt(V1, 1)} cm³ / 1 bar = <strong>${fmtUnit(V2, "cm³", 1)}</strong>`,
        };
      },
    },
    {
      id: "boyle-volumen",
      make: (rng, level) => {
        if (level === 1) {
          const p1 = 1000;
          const V1 = rng.int(10, 50) * 10;
          const p2 = rng.pick([1250, 2000, 2500, 4000, 5000]);
          const V2 = (p1 * V1) / p2;
          return {
            prompt: `${fmtUnit(V1, "cm³", 0)} Luft bei ${fmtUnit(p1, "hPa", 0)} werden bei gleicher Temperatur auf ${fmtUnit(p2, "hPa", 0)} verdichtet. Welches Volumen nimmt die Luft dann ein?`,
            given: [`p₁ = ${fmtUnit(p1, "hPa", 0)}`, `V₁ = ${fmtUnit(V1, "cm³", 0)}`, `p₂ = ${fmtUnit(p2, "hPa", 0)}`],
            formulaHint: "p₁ · V₁ = p₂ · V₂, also V₂ = p₁ · V₁ / p₂",
            answer: V2,
            unit: "cm³",
            digits: 0,
            solutionHtml: `V₂ = p₁ · V₁ / p₂ = ${fmt(p1, 0)} · ${fmt(V1, 0)} / ${fmt(p2, 0)} cm³ = <strong>${fmtUnit(V2, "cm³", 0)}</strong>`,
          };
        }
        const V1 = rng.int(3, 12);
        const pAbs = rng.pick([3, 3.5, 4, 4.5, 5]);
        const V2 = (1 * V1) / pAbs;
        return {
          prompt: `Mit einer Luftpumpe werden ${fmtUnit(V1, "L", 0)} Außenluft (1 bar) in einen Reifen gedrückt, in dem ein Absolutdruck von ${fmtUnit(pAbs, "bar", 1)} herrscht. Welches Volumen nimmt diese Luft im Reifen ein? Die Temperatur bleibe gleich.`,
          given: [`p₁ = 1 bar`, `V₁ = ${fmtUnit(V1, "L", 0)}`, `p₂ = ${fmtUnit(pAbs, "bar", 1)}`],
          answer: V2,
          unit: "L",
          digits: 2,
          solutionHtml: `V₂ = p₁ · V₁ / p₂ = 1 bar · ${fmt(V1, 0)} L / ${fmt(pAbs, 1)} bar = <strong>${fmtUnit(V2, "L", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Druck mal Volumen bleibt gleich: Du beherrschst das Gesetz von Boyle-Mariotte.",
};

export const STAGE_DRUCK: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Druck in Flüssigkeiten und Gasen",
  subtitle: "Mechanik von Flüssigkeiten und Gasen",
  icon: "🌊",
  accent: "#0284c7",
  badgeTitle: "Druck-Profi",
  lehrplanLabel: "Ph9 LB 1 (I) · Teile von Ph9 LB 1 (II/III)",
  lessons: [druck, hydraulik, schweredruck, auftrieb, boyle],
};
