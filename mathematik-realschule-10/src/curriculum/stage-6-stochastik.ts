import type { Lesson, Stage } from "../model/types";
import { numberField } from "./helpers";

const bedingteWahrscheinlichkeit: Lesson = {
  id: "dz-1-bedingte-wahrscheinlichkeit",
  stageId: "st-6-stochastik",
  stepNumber: 1,
  title: "6.1 Bedingte Wahrscheinlichkeit",
  subtitle: "Wahrscheinlichkeit unter einer Vorbedingung P_B(A)",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I/II/III) LB 5.1",
  whyItMatters:
    "Ein medizinischer Test schlägt positiv an – wie hoch ist nun wirklich die Wahrscheinlichkeit, krank zu sein? Diese lebenswichtige Frage beantwortet die bedingte Wahrscheinlichkeit.",
  explanationHtml: `
    <p>Die <strong>bedingte Wahrscheinlichkeit P_B(A)</strong> (gesprochen: <em>Wahrscheinlichkeit von A unter der Bedingung B</em>) gibt die Wahrscheinlichkeit für das Eintreten von <em>A</em> an, wenn bereits feststeht, dass <em>B</em> eingetreten ist:</p>
    <p class="formula-center"><strong>P_B(A) = P(A ∩ B) / P(B)  (mit P(B) > 0)</strong></p>
    <p>Daraus folgt der <strong>Multiplikationssatz</strong>:</p>
    <p class="formula-center"><strong>P(A ∩ B) = P(B) · P_B(A) = P(A) · P_A(B)</strong></p>
    <p>Im Baumdiagramm entspricht <em>P_B(A)</em> der Wahrscheinlichkeit am <em>zweiten Ast</em>, nachdem der Pfad <em>B</em> gewählt wurde.</p>
  `,
  formulas: [
    {
      name: "Bedingte Wahrscheinlichkeit",
      html: "P_B(A) = P(A ∩ B) / P(B)",
      quantities: "P(B) > 0 Voraussetzung",
    },
    {
      name: "Multiplikationssatz",
      html: "P(A ∩ B) = P(B) · P_B(A)",
      quantities: "Pfadregel im Baumdiagramm",
    },
  ],
  quiz: {
    question: "Was bedeutet die Schreibweise P_B(A)?",
    options: [
      "Wahrscheinlichkeit von A unter der Voraussetzung, dass B bereits eingetreten ist",
      "Wahrscheinlichkeit, dass B unter der Bedingung A eintritt",
      "Das Produkt P(A) · P(B)",
      "Die Differenz P(A) - P(B)",
    ],
    correctIndex: 0,
    explanation:
      "Der Index (unten) ist die Bedingung, die bereits bekannt oder eingetreten ist. P_B(A) ist also die Wahrscheinlichkeit von A unter der Bedingung B.",
  },
  lab: {
    kind: "probability-tree",
    title: "Wahrscheinlichkeits-Labor",
    intro: "Verändere P(A) und die bedingte Wahrscheinlichkeit P_A(B), um die Schnittmenge P(A ∩ B) zu berechnen.",
    params: [
      { type: "range", key: "pA", label: "P(A)", unit: "%", min: 10, max: 90, step: 10, value: 60 },
      { type: "range", key: "pB_A", label: "P_A(B)", unit: "%", min: 10, max: 90, step: 10, value: 70 },
    ],
    readouts: [
      {
        key: "jointVal",
        label: "P(A ∩ B)",
        digits: 3,
        emphasis: true,
        compute: (v) => {
          const pa = (v.pA ?? 60) / 100;
          const pb_a = (v.pB_A ?? 70) / 100;
          return Math.round(pa * pb_a * 1000) / 1000;
        },
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle P(A) = 50 % und P_A(B) = 40 % ein (ergibt P(A ∩ B) = 0,20).",
        check: (v) => (v.pA ?? 0) === 50 && (v.pB_A ?? 0) === 40,
      },
    ],
  },
  exercises: [
    {
      id: "ex-dz-1",
      make(rng, _level) {
      const pB = rng.pick([0.4, 0.5, 0.6]);
      const pAB = rng.pick([0.12, 0.15, 0.2, 0.24, 0.3]);
      const pB_A = Math.round((pAB / pB) * 100) / 100;
      return {
        prompt: `In einer Gesamtheite sei <strong>P(B) = ${pB}</strong> und die gemeinsame Wahrscheinlichkeit <strong>P(A ∩ B) = ${pAB}</strong>. Berechne die bedingte Wahrscheinlichkeit <strong>P_B(A)</strong> auf 2 Nachkommastellen gerundet.`,
        given: [`P(B) = ${pB}`, `P(A ∩ B) = ${pAB}`],
        formulaHint: "P_B(A) = P(A ∩ B) / P(B)",
        fields: [numberField("P_B(A) =", pB_A, "", 2)],
        steps: [
          `Formel ansetzen: P_B(A) = ${pAB} / ${pB}`,
          `Ausrechnen: P_B(A) = <strong>${pB_A}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Super! Du beherrschst die bedingte Wahrscheinlichkeit.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=Lh9PSxafG40",
    title: "Bedingte Wahrscheinlichkeit, Einführung, Übersicht",
    author: "Daniel Jung",
  },
};

const unabhaengigkeit: Lesson = {
  id: "dz-2-unabhaengigkeit",
  stageId: "st-6-stochastik",
  stepNumber: 2,
  title: "6.2 Stochastische Unabhängigkeit",
  subtitle: "Wann sich zwei Ereignisse gegenseitig nicht beeinflussen",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I/II/III) LB 5.1",
  whyItMatters:
    "Viele Berechnungen setzen voraus, dass Versuche unabhängig sind (z. B. Würfeln, Qualitätskontrollen getrennter Maschinen). Die stochastische Unabhängigkeit lässt sich exakt nachrechnen.",
  explanationHtml: `
    <p>Zwei Ereignisse <em>A</em> und <em>B</em> heißen <strong>stochastisch unabhängig</strong>, wenn das Eintreten von <em>B</em> die Wahrscheinlichkeit von <em>A</em> nicht verändert:</p>
    <p class="formula-center"><strong>P_B(A) = P(A)</strong>  ⟺  <strong>P(A ∩ B) = P(A) · P(B)</strong></p>
    <p><em>Wichtig:</em> Stochastische Unabhängigkeit darf man <strong>nicht</strong> mit unvereinbaren Ereignissen verwechseln! Wenn zwei Ereignisse unvereinbar sind (A ∩ B = ∅), sind sie fast nie unabhängig.</p>
  `,
  formulas: [
    {
      name: "Unabhängigkeitskriterium",
      html: "P(A ∩ B) = P(A) · P(B)",
      quantities: "Gilt genau dann, wenn A und B unabhängig sind",
    },
  ],
  quiz: {
    question: "Zwei Ereignisse haben P(A) = 0,4 und P(B) = 0,5. Welchen Wert muss P(A ∩ B) haben, damit A und B stochastisch unabhängig sind?",
    options: ["0,20 (da 0,4 · 0,5 = 0,20)", "0,90 (Summe)", "0,10", "0,00"],
    correctIndex: 0,
    explanation:
      "Genau nach der Produktformel für stochastische Unabhängigkeit: P(A ∩ B) = P(A) · P(B) = 0,4 · 0,5 = 0,20.",
  },
  lab: {
    kind: "probability-tree",
    title: "Unabhängigkeits-Labor",
    intro: "Prüfe, ob P(A ∩ B) gleich P(A) · P(B) ist.",
    params: [
      { type: "range", key: "pA", label: "P(A)", unit: "%", min: 20, max: 80, step: 10, value: 50 },
      { type: "range", key: "pB_A", label: "P_A(B)", unit: "%", min: 20, max: 80, step: 10, value: 50 },
    ],
    readouts: [
      {
        key: "jointVal",
        label: "P(A ∩ B)",
        digits: 2,
        compute: (v) => Math.round((((v.pA ?? 50) / 100) * ((v.pB_A ?? 50) / 100)) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle P(A) = 40 % und P_A(B) = 50 % ein.",
        check: (v) => (v.pA ?? 0) === 40 && (v.pB_A ?? 0) === 50,
      },
    ],
  },
  exercises: [
    {
      id: "ex-dz-2",
      make(rng, _level) {
      const pa = rng.pick([0.2, 0.3, 0.4, 0.5]);
      const pb = rng.pick([0.3, 0.4, 0.5, 0.6]);
      const pProd = Math.round(pa * pb * 100) / 100;
      return {
        prompt: `Die Ereignisse A und B sind stochastisch unabhängig mit <strong>P(A) = ${pa}</strong> und <strong>P(B) = ${pb}</strong>. Berechne die Schnittwahrscheinlichkeit <strong>P(A ∩ B)</strong>.`,
        given: [`P(A) = ${pa}`, `P(B) = ${pb}`, "A und B sind stochastisch unabhängig"],
        formulaHint: "P(A ∩ B) = P(A) · P(B)",
        fields: [numberField("P(A ∩ B) =", pProd, "", 2)],
        steps: [
          `Produktansatz: P(A ∩ B) = ${pa} · ${pb}`,
          `Ausmultiplizieren: <strong>${pProd}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Klasse! Du prüfst und berechnest stochastische Unabhängigkeit fehlerfrei.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=vfBMGefSNvA",
    title: "Stochastische Unabhängigkeit, Einführung und Formel",
    author: "Daniel Jung",
  },
};

const vierfeldertafelVertieft: Lesson = {
  id: "dz-3-vierfeldertafel-vertieft",
  stageId: "st-6-stochastik",
  stepNumber: 3,
  title: "6.3 Vierfeldertafel & inverses Baumdiagramm",
  subtitle: "Schnittmengen, Randwahrscheinlichkeiten und Testgüte",
  tracks: ["I", "II_III"],
  lehrplan: "M10 (I/II/III) LB 5.1 / Abschlussprüfung",
  whyItMatters:
    "Bei diagnostischen Tests (z. B. Schnelltest auf Krankheiten, Qualitätsprüfung von Bauteilen) kehrt das inverse Baumdiagramm Ursache und Wirkung um.",
  explanationHtml: `
    <p>Eine <strong>Vierfeldertafel</strong> ordnet zwei Merkmale <em>A</em> und <em>B</em> mit ihren Gegenereignissen <em>¬A</em> und <em>¬B</em> an:</p>
    <ul>
      <li>Die 4 Innenfelder enthalten die Schnittwahrscheinlichkeiten: <em>P(A ∩ B)</em>, <em>P(A ∩ ¬B)</em>, <em>P(¬A ∩ B)</em>, <em>P(¬A ∩ ¬B)</em>.</li>
      <li>Die Ränder enthalten die Gesamtwahrscheinlichkeiten: <em>P(A)</em>, <em>P(¬A)</em>, <em>P(B)</em>, <em>P(¬B)</em>. Unten rechts steht immer <em>1 (bzw. 100 %)</em>.</li>
      <li><strong>Inverses Baumdiagramm:</strong> Im ersten Baum steht <em>A</em> zuerst, im zweiten Baum steht <em>B</em> zuerst. Beide Bäume lassen sich über die Vierfeldertafel ineinander umrechnen.</li>
    </ul>
  `,
  formulas: [
    {
      name: "Randsummen der Vierfeldertafel",
      html: "P(A) = P(A ∩ B) + P(A ∩ ¬B)",
      quantities: "Zeilensummen und Spaltensummen",
    },
  ],
  quiz: {
    question: "Was steht in den vier inneren Feldern einer Vierfeldertafel?",
    options: [
      "Die Schnittwahrscheinlichkeiten der Kombinationen (z. B. P(A ∩ B))",
      "Die bedingten Wahrscheinlichkeiten P_B(A)",
      "Nur die Randwahrscheinlichkeiten P(A) und P(B)",
      "Der Mittelwert der Ereignisse",
    ],
    correctIndex: 0,
    explanation:
      "Die vier Innenfelder enthalten stets die Schnittmengenwahrscheinlichkeiten der beiden Merkmale und ihrer Gegenereignisse.",
  },
  lab: {
    kind: "probability-tree",
    title: "Vierfelder-Labor",
    intro: "Erforsche den Zusammenhang von Randsummen und Schnittmengen.",
    params: [
      { type: "range", key: "pA", label: "P(A)", unit: "%", min: 10, max: 90, step: 10, value: 40 },
      { type: "range", key: "pB_A", label: "P(B)", unit: "%", min: 10, max: 90, step: 10, value: 50 },
    ],
    readouts: [
      {
        key: "jointVal",
        label: "P(A ∩ B)",
        digits: 2,
        compute: (v) => Math.round((((v.pA ?? 40) / 100) * 0.5) * 100) / 100,
      },
    ],
    goals: [
      {
        id: "g1",
        text: "Stelle P(A) = 40 % ein.",
        check: (v) => (v.pA ?? 0) === 40,
      },
    ],
  },
  exercises: [
    {
      id: "ex-dz-3",
      make(rng, _level) {
      const pA = rng.pick([0.3, 0.4, 0.5, 0.6]);
      const pAB = 0.2;
      const pA_notB = Math.round((pA - pAB) * 100) / 100;
      return {
        prompt: `In einer Vierfeldertafel ist <strong>P(A) = ${pA}</strong> und <strong>P(A ∩ B) = ${pAB}</strong> bekannt. Berechne den Wert des Nachbarfeldes <strong>P(A ∩ ¬B)</strong>.`,
        given: [`P(A) = ${pA}`, `P(A ∩ B) = ${pAB}`],
        formulaHint: "P(A ∩ ¬B) = P(A) - P(A ∩ B)",
        fields: [numberField("P(A ∩ ¬B) =", pA_notB, "", 2)],
        steps: [
          `Zeilensumme anwenden: P(A ∩ B) + P(A ∩ ¬B) = P(A)`,
          `Nach P(A ∩ ¬B) umstellen: ${pA} - ${pAB} = <strong>${pA_notB}</strong>`,
        ],
      };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Perfekt! Du liest und berechnest Vierfeldertafeln und inverse Bäume sicher.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=xslCG8xjGjI",
    title: "Vierfeldertafel Wahrscheinlichkeitsrechnung",
    author: "Daniel Jung",
  },
};

export const STAGE_STOCHASTIK: Stage = {
  id: "st-6-stochastik",
  stageNumber: 6,
  title: "Daten und Zufall (Stochastik)",
  subtitle: "Bedingte Wahrscheinlichkeit, Unabhängigkeit und Vierfeldertafeln",
  icon: "🎲",
  accent: "#06b6d4",
  badgeTitle: "Zufalls-Analyst",
  lehrplanLabel: "M10 (I/II/III) LB 5",
  lessons: [bedingteWahrscheinlichkeit, unabhaengigkeit, vierfeldertafelVertieft],
};
