import { fmt, fmtUnit } from "../exercises/format";
import {
  C_ICE,
  C_STEAM,
  C_WATER,
  KELVIN_OFFSET,
  Q_MELT_ICE,
  Q_VAPORISE_WATER,
} from "../lab/engine";
import type { Lesson, Stage } from "../model/types";
import { near, within } from "./helpers";

const STAGE_ID = "stage-3-waermelehre";
const C_WATER_KJ = C_WATER / 1000; // 4,19 kJ/(kg·K)

// 3.1 Temperatur ───────────────────────────────────────────────────────────

const temperatur: Lesson = {
  id: "wl-1-temperatur",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "3.1 Innere Energie, Temperatur und Kelvin",
  subtitle: "Was ein Thermometer wirklich misst",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 2 (I): absolute Temperatur · Ph9 LB 2 (II/III): innere Energie, Temperatur als Maß für die mittlere Bewegungsenergie, absolute Temperatur",
  whyItMatters:
    "Wärme ist Teilchenbewegung. Je heißer ein Körper, desto schneller zappeln seine Teilchen. Und weil Teilchen nicht langsamer als stillstehen können, gibt es eine tiefste Temperatur.",
  explanationHtml: `
    <p>Alle Stoffe bestehen aus Teilchen, die sich ständig ungeordnet bewegen. Die <strong>innere Energie</strong> eines Körpers ist die Summe aller Bewegungs- und Lageenergien seiner Teilchen. Sie ist eine Speichergröße (Zustandsgröße).</p>
    <ul>
      <li>Die <strong>Temperatur</strong> ist ein Maß für die <strong>mittlere Bewegungsenergie</strong> der Teilchen. Ein Schwimmbecken mit 25 °C hat viel mehr innere Energie als eine Tasse Tee mit 60 °C, aber eine niedrigere Temperatur.</li>
      <li><strong>Wärme</strong> ist die Energie, die wegen eines Temperaturunterschieds übertragen wird: eine Übertragungsgröße, keine Speichergröße.</li>
      <li>Am <strong>absoluten Nullpunkt</strong> wäre die Teilchenbewegung minimal. Er liegt bei <strong>−273,15 °C = 0 K</strong> und ist unerreichbar.</li>
      <li><strong>Kelvin-Skala:</strong> T in K = ϑ in °C + 273,15. Temperatur<em>unterschiede</em> sind in K und °C gleich groß: Δϑ = 10 °C entspricht ΔT = 10 K.</li>
      <li><strong>Erster Hauptsatz:</strong> Die innere Energie eines Körpers ändert sich durch <strong>Arbeit</strong> (Reibung, Zusammendrücken) oder durch <strong>Wärme</strong>: ΔU = W + Q.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Temperatur ist nicht Energie. Temperatur sagt, wie heftig sich die Teilchen im Mittel bewegen. Innere Energie zählt alle Teilchen zusammen.</div>
  `,
  formulas: [
    { name: "Kelvin und Celsius", html: "T / K = ϑ / °C + 273,15", quantities: "T absolute Temperatur in K, ϑ in °C; 0 K = −273,15 °C" },
    { name: "Temperaturdifferenz", html: "ΔT = Δϑ", quantities: "Differenzen in K und °C sind gleich groß" },
    { name: "Erster Hauptsatz", html: "ΔU = W + Q", quantities: "Änderung der inneren Energie durch Arbeit W und Wärme Q, in J" },
  ],
  quiz: {
    question: "Ein See (20 °C) und eine Tasse Tee (70 °C). Welche Aussage stimmt?",
    options: [
      "Der Tee hat mehr innere Energie, weil er heißer ist",
      "Der See hat mehr innere Energie, der Tee die höhere Temperatur",
      "Beide haben gleich viel innere Energie, nur anders verteilt",
    ],
    correctIndex: 1,
    explanation: "Temperatur ist die mittlere Teilchenenergie, innere Energie die Summe über alle Teilchen. Der See hat ungleich mehr Teilchen.",
  },
  lab: {
    kind: "temperature-particles",
    title: "Labor: Teilchen im Kasten",
    intro: "Ändere die Temperatur und beobachte, wie schnell sich die Teilchen bewegen. Lies die Temperatur in Kelvin ab.",
    params: [
      { type: "range", key: "theta", label: "Temperatur ϑ", unit: "°C", min: -273, max: 500, step: 1, value: 20 },
    ],
    readouts: [
      { key: "T", label: "Absolute Temperatur T", unit: "K", digits: 2, emphasis: true, compute: (v) => v.theta + KELVIN_OFFSET },
      { key: "rel", label: "Mittlere Teilchenenergie (im Vergleich zu 20 °C)", digits: 2, compute: (v) => (v.theta + KELVIN_OFFSET) / (20 + KELVIN_OFFSET) },
      {
        key: "example",
        label: "Beispiel",
        compute: (v) => {
          if (v.theta <= -270) return "nahe dem absoluten Nullpunkt";
          if (v.theta <= -196) return "flüssiger Stickstoff siedet bei −196 °C";
          if (v.theta < 0) return "Eis";
          if (v.theta < 30) return "Zimmertemperatur, flüssiges Wasser";
          if (v.theta < 100) return "heißes Wasser";
          if (v.theta === 100) return "Wasser siedet (bei Normaldruck)";
          if (v.theta <= 250) return "Backofen";
          return "glühende Herdplatte";
        },
      },
    ],
    goals: [
      { id: "nullpunkt", text: "Stelle den absoluten Nullpunkt ein (0 K).", check: (_v, r) => within(Number(r.T), 0, 1.2) },
      { id: "dreihundert", text: "Stelle 300 K ein (±1 K).", check: (_v, r) => within(Number(r.T), 300, 1) },
      { id: "sieden", text: "Stelle die Siedetemperatur von Wasser ein.", check: (v) => v.theta === 100 },
    ],
  },
  exercises: [
    {
      id: "celsius-kelvin",
      make: (rng, level) => {
        if (level === 1) {
          const theta = rng.pick([-196, -78, -40, -18, 0, 20, 37, 60, 100, 250]);
          return {
            prompt: `Ein Thermometer zeigt ${fmtUnit(theta, "°C", 0)}. Gib diese Temperatur in Kelvin an.`,
            given: [`ϑ = ${fmtUnit(theta, "°C", 0)}`],
            formulaHint: "T / K = ϑ / °C + 273,15",
            answer: theta + KELVIN_OFFSET,
            unit: "K",
            digits: 2,
            absTolerance: 0.5,
            solutionHtml: `T = (${fmt(theta, 0)} + 273,15) K = <strong>${fmtUnit(theta + KELVIN_OFFSET, "K", 2)}</strong> (gerundet ${fmtUnit(theta + 273, "K", 0)})`,
          };
        }
        const T = rng.pick([4, 77, 195, 233, 263, 290, 310, 350, 373, 500]);
        return {
          prompt: `Ein Gas hat die absolute Temperatur ${fmtUnit(T, "K", 0)}. Wie viel Grad Celsius sind das?`,
          given: [`T = ${fmtUnit(T, "K", 0)}`],
          answer: T - KELVIN_OFFSET,
          unit: "°C",
          digits: 2,
          absTolerance: 0.5,
          solutionHtml: `ϑ = (${fmt(T, 0)} − 273,15) °C = <strong>${fmtUnit(T - KELVIN_OFFSET, "°C", 2)}</strong>`,
        };
      },
    },
    {
      id: "temperaturdifferenz",
      make: (rng, level) => {
        if (level === 1) {
          const t1 = rng.int(-20, 30);
          const t2 = t1 + rng.int(5, 90);
          return {
            prompt: `Wasser wird von ${fmtUnit(t1, "°C", 0)} auf ${fmtUnit(t2, "°C", 0)} erwärmt. Um wie viel Kelvin steigt die Temperatur?`,
            given: [`ϑ₁ = ${fmtUnit(t1, "°C", 0)}`, `ϑ₂ = ${fmtUnit(t2, "°C", 0)}`],
            formulaHint: "ΔT = ϑ₂ − ϑ₁ (Differenzen sind in K und °C gleich)",
            answer: t2 - t1,
            unit: "K",
            digits: 0,
            solutionHtml: `ΔT = ${fmt(t2, 0)} °C − (${fmt(t1, 0)} °C) = <strong>${fmtUnit(t2 - t1, "K", 0)}</strong>`,
          };
        }
        const t1 = rng.int(-10, 40);
        const T2 = Math.round(t1 + KELVIN_OFFSET + rng.int(20, 200));
        const delta = T2 - (t1 + KELVIN_OFFSET);
        return {
          prompt: `Ein Gas wird von ${fmtUnit(t1, "°C", 0)} auf ${fmtUnit(T2, "K", 0)} erwärmt. Um wie viel Kelvin ist die Temperatur gestiegen?`,
          given: [`ϑ₁ = ${fmtUnit(t1, "°C", 0)}`, `T₂ = ${fmtUnit(T2, "K", 0)}`],
          answer: delta,
          unit: "K",
          digits: 2,
          absTolerance: 0.5,
          solutionHtml: `T₁ = ${fmt(t1, 0)} °C + 273,15 = ${fmtUnit(t1 + KELVIN_OFFSET, "K", 2)}<br>ΔT = T₂ − T₁ = ${fmt(T2, 0)} K − ${fmt(t1 + KELVIN_OFFSET, 2)} K = <strong>${fmtUnit(delta, "K", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du trennst Temperatur von innerer Energie und rechnest sicher in Kelvin.",
};

// 3.2 Spezifische Wärmekapazität ───────────────────────────────────────────

const waermekapazitaet: Lesson = {
  id: "wl-2-waermekapazitaet",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "3.2 Spezifische Wärmekapazität und Erwärmungsgesetz",
  subtitle: "Wie viel Energie der Wasserkocher wirklich braucht",
  tracks: ["I", "II_III"],
  lehrplan: "Ph9 LB 2 (I) · Ph9 LB 2 (II/III): spezifische Wärmekapazität, Erwärmungsgesetz, Leistung einer Wärmequelle",
  whyItMatters:
    "Ein Liter Wasser braucht für 10 K Erwärmung rund 42 kJ. Ein Kilogramm Eisen nur ein Neuntel davon. Die spezifische Wärmekapazität sagt, wie viel Energie ein Stoff pro Kilogramm und Kelvin speichert.",
  explanationHtml: `
    <p>Führt man einem Körper die Wärme Q zu, steigt seine Temperatur um Δϑ. Wie stark, hängt von der Masse m und vom Stoff ab:</p>
    <p class="formula-line">Q = c · m · Δϑ (Erwärmungsgesetz)</p>
    <ul>
      <li><strong>c</strong> ist die <strong>spezifische Wärmekapazität</strong>: die Energie, die 1 kg des Stoffes um 1 K erwärmt. Einheit: J/(kg·K) oder kJ/(kg·K).</li>
      <li>Wasser: <strong>c = 4,19 kJ/(kg·K)</strong> (sehr hoch, deshalb ist Wasser ein guter Wärmespeicher). Eisen ≈ 0,45, Aluminium ≈ 0,90, Kupfer ≈ 0,39 kJ/(kg·K).</li>
      <li>Eine <strong>Wärmequelle</strong> (Tauchsieder, Herdplatte) gibt pro Sekunde die Wärme P ab: <strong>Q = P · t</strong>, mit P in W und t in s.</li>
      <li>Bei 100 °C siedet Wasser bei Normaldruck. Weitere Energie erhöht die Temperatur dann nicht mehr, sondern verdampft Wasser (Lektion 3.4).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Doppelte Masse oder doppelte Temperaturdifferenz: doppelte Wärme. Q = c · m · Δϑ, und die Leistung der Quelle liefert Q = P · t.</div>
  `,
  formulas: [
    { name: "Erwärmungsgesetz", html: "Q = c · m · Δϑ", quantities: "Q in J, c in J/(kg·K), m in kg, Δϑ in K; c_Wasser = 4190 J/(kg·K)" },
    { name: "Leistung einer Wärmequelle", html: "Q = P · t", quantities: "P in W, t in s" },
  ],
  quiz: {
    question: "Welche Wärme braucht man, um 2 kg Wasser um 5 K zu erwärmen (c = 4,19 kJ/(kg·K))?",
    options: ["4,19 kJ", "41,9 kJ", "20,95 kJ"],
    correctIndex: 1,
    explanation: "Q = c · m · Δϑ = 4,19 kJ/(kg·K) · 2 kg · 5 K = 41,9 kJ.",
  },
  lab: {
    kind: "heating",
    title: "Labor: Wasserkocher",
    intro: "Stelle Wassermenge, Heizleistung und Zeit ein. Wie warm wird das Wasser, und wann kocht es?",
    params: [
      { type: "range", key: "m", label: "Wassermasse m", unit: "kg", min: 0.2, max: 3, step: 0.1, value: 1, digits: 1 },
      { type: "range", key: "P", label: "Heizleistung P", unit: "W", min: 100, max: 3000, step: 100, value: 2000 },
      { type: "range", key: "t", label: "Zeit t", unit: "s", min: 0, max: 600, step: 10, value: 60 },
      { type: "range", key: "theta0", label: "Anfangstemperatur ϑ₀", unit: "°C", min: 5, max: 40, step: 1, value: 20 },
    ],
    readouts: [
      { key: "Q", label: "Zugeführte Wärme Q = P · t", unit: "J", digits: 0, compute: (v) => v.P * v.t },
      { key: "dtheta", label: "Temperaturerhöhung Δϑ = Q / (c · m)", unit: "K", digits: 1, emphasis: true, compute: (v) => (v.P * v.t) / (C_WATER * v.m) },
      { key: "theta", label: "Endtemperatur (höchstens 100 °C)", unit: "°C", digits: 1, emphasis: true, compute: (v) => Math.min(100, v.theta0 + (v.P * v.t) / (C_WATER * v.m)) },
      { key: "tBoil", label: "Zeit bis zum Sieden", unit: "s", digits: 0, compute: (v) => (C_WATER * v.m * (100 - v.theta0)) / v.P },
    ],
    goals: [
      { id: "kochen", text: "Bring 1 kg Wasser von 20 °C mit höchstens 2 000 W in höchstens 3 Minuten zum Kochen.", check: (v, r) => near(v.m, 1, 0.01) && v.theta0 === 20 && v.P <= 2000 && v.t <= 180 && Number(r.theta) >= 100 },
      { id: "zehn-kelvin", text: "Erwärme 0,5 kg Wasser um genau 10 K (±0,3 K).", check: (v, r) => near(v.m, 0.5, 0.01) && within(Number(r.dtheta), 10, 0.3) },
      { id: "halbe-leistung", text: "Halbe Leistung, doppelte Zeit, gleiche Wärme: Stelle 500 W und 400 s ein (Q = 200 kJ).", check: (v) => v.P === 500 && v.t === 400 },
    ],
  },
  exercises: [
    {
      id: "waermemenge",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.stepped(0.5, 5, 0.5);
          const d = rng.int(5, 80);
          const Q = C_WATER_KJ * m * d;
          return {
            prompt: `Wie viel Wärme braucht man, um ${fmtUnit(m, "kg", 1)} Wasser um ${fmtUnit(d, "K", 0)} zu erwärmen? (c = 4,19 kJ/(kg·K))`,
            given: [`m = ${fmtUnit(m, "kg", 1)}`, `Δϑ = ${fmtUnit(d, "K", 0)}`, "c = 4,19 kJ/(kg·K)"],
            formulaHint: "Q = c · m · Δϑ",
            answer: Q,
            unit: "kJ",
            digits: 1,
            solutionHtml: `Q = c · m · Δϑ = 4,19 kJ/(kg·K) · ${fmt(m, 1)} kg · ${fmt(d, 0)} K = <strong>${fmtUnit(Q, "kJ", 1)}</strong>`,
          };
        }
        const m = rng.stepped(0.5, 2, 0.1);
        const t1 = rng.int(8, 25);
        const P = rng.pick([1000, 1500, 1800, 2000, 2200, 2400]);
        const Q = C_WATER * m * (100 - t1);
        const t = Q / P;
        return {
          prompt: `Ein Wasserkocher mit ${fmtUnit(P, "W", 0)} soll ${fmtUnit(m, "kg", 1)} Wasser von ${fmtUnit(t1, "°C", 0)} zum Sieden bringen. Wie lange dauert das ohne Verluste? (c = 4190 J/(kg·K))`,
          given: [`P = ${fmtUnit(P, "W", 0)}`, `m = ${fmtUnit(m, "kg", 1)}`, `Δϑ = 100 °C − ${fmt(t1, 0)} °C = ${fmtUnit(100 - t1, "K", 0)}`],
          answer: t,
          unit: "s",
          digits: 0,
          solutionHtml: `Q = c · m · Δϑ = 4190 · ${fmt(m, 1)} · ${fmt(100 - t1, 0)} J = ${fmtUnit(Q, "J", 0)}<br>t = Q / P = ${fmt(Q, 0)} J / ${fmt(P, 0)} W = <strong>${fmtUnit(t, "s", 0)}</strong> (≈ ${fmt(t / 60, 1)} min)`,
        };
      },
    },
    {
      id: "stoff-c",
      make: (rng, level) => {
        if (level === 1) {
          const materials = [
            { name: "Eisen", c: 450 },
            { name: "Aluminium", c: 900 },
            { name: "Kupfer", c: 390 },
            { name: "Blei", c: 130 },
            { name: "Glas", c: 800 },
          ];
          const mat = rng.pick(materials);
          const m = rng.stepped(0.5, 4, 0.5);
          const d = rng.int(10, 80);
          const Q = mat.c * m * d;
          return {
            prompt: `${fmtUnit(m, "kg", 1)} eines Stoffes werden durch ${fmtUnit(Q, "J", 0)} um ${fmtUnit(d, "K", 0)} erwärmt. Berechne die spezifische Wärmekapazität in J/(kg·K).`,
            given: [`Q = ${fmtUnit(Q, "J", 0)}`, `m = ${fmtUnit(m, "kg", 1)}`, `Δϑ = ${fmtUnit(d, "K", 0)}`],
            formulaHint: "Q = c · m · Δϑ, also c = Q / (m · Δϑ)",
            answer: mat.c,
            unit: "J/(kg·K)",
            digits: 0,
            solutionHtml: `c = Q / (m · Δϑ) = ${fmt(Q, 0)} J / (${fmt(m, 1)} kg · ${fmt(d, 0)} K) = <strong>${fmtUnit(mat.c, "J/(kg·K)", 0)}</strong> (das ist ${mat.name})`,
          };
        }
        const t = rng.int(2, 10) * 60;
        const m = rng.stepped(1, 4, 0.5);
        // Only powers that keep the water liquid: Δϑ stays below 80 K.
        const allowed = [300, 500, 800, 1000].filter((p) => (p * t) / (C_WATER * m) <= 80);
        const P = rng.pick(allowed.length > 0 ? allowed : [300]);
        const d = (P * t) / (C_WATER * m);
        return {
          meta: { dtheta: d },
          prompt: `Ein Tauchsieder mit ${fmtUnit(P, "W", 0)} heizt ${fmtUnit(m, "kg", 1)} Wasser ${fmtUnit(t / 60, "min", 0)} lang. Um wie viel Kelvin steigt die Temperatur ohne Verluste? (c = 4190 J/(kg·K))`,
          given: [`P = ${fmtUnit(P, "W", 0)}`, `t = ${fmtUnit(t / 60, "min", 0)} = ${fmtUnit(t, "s", 0)}`, `m = ${fmtUnit(m, "kg", 1)}`],
          answer: d,
          unit: "K",
          digits: 1,
          solutionHtml: `Q = P · t = ${fmt(P, 0)} W · ${fmt(t, 0)} s = ${fmtUnit(P * t, "J", 0)}<br>Δϑ = Q / (c · m) = ${fmt(P * t, 0)} / (4190 · ${fmt(m, 1)}) K = <strong>${fmtUnit(d, "K", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Q = c · m · Δϑ sitzt. Du weißt, warum Wasser so lange zum Kochen braucht.",
};

// 3.3 Mischungsgesetz ──────────────────────────────────────────────────────

const mischung: Lesson = {
  id: "wl-3-mischung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "3.3 Mischungsgesetz",
  subtitle: "Welche Temperatur hat das Badewasser?",
  tracks: ["I"],
  lehrplan: "Ph9 LB 2 (I): Energieaustausch bei Körpern unterschiedlicher Temperatur, Mischungsgesetz",
  whyItMatters:
    "Heißes und kaltes Wasser mischen sich zu einer Temperatur dazwischen. Wo genau, verrät die Energiebilanz: Was das warme Wasser abgibt, nimmt das kalte auf.",
  explanationHtml: `
    <p>Bringt man zwei Körper verschiedener Temperatur zusammen, fließt Wärme vom wärmeren zum kälteren, bis beide die <strong>Mischtemperatur ϑ<sub>m</sub></strong> haben. Ohne Verluste gilt:</p>
    <p class="formula-line">Q<sub>ab</sub> = Q<sub>auf</sub> also c<sub>1</sub> · m<sub>1</sub> · (ϑ<sub>1</sub> − ϑ<sub>m</sub>) = c<sub>2</sub> · m<sub>2</sub> · (ϑ<sub>m</sub> − ϑ<sub>2</sub>)</p>
    <ul>
      <li>Für <strong>denselben Stoff</strong> (z. B. Wasser mit Wasser) kürzt sich c heraus: <strong>ϑ<sub>m</sub> = (m<sub>1</sub> · ϑ<sub>1</sub> + m<sub>2</sub> · ϑ<sub>2</sub>) / (m<sub>1</sub> + m<sub>2</sub>)</strong>.</li>
      <li>Gleiche Massen: ϑ<sub>m</sub> liegt genau in der Mitte. Dreimal so viel kaltes Wasser: ϑ<sub>m</sub> liegt dreimal näher am kalten Wert.</li>
      <li>Verschiedene Stoffe (Metall in Wasser): Beide Wärmekapazitäten bleiben in der Gleichung. So bestimmt man c eines unbekannten Metalls.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Energiebilanz aufstellen: abgegebene Wärme = aufgenommene Wärme. Dann nach der gesuchten Größe auflösen.</div>
  `,
  formulas: [
    { name: "Mischungsgesetz (gleicher Stoff)", html: "ϑ<sub>m</sub> = (m<sub>1</sub> · ϑ<sub>1</sub> + m<sub>2</sub> · ϑ<sub>2</sub>) / (m<sub>1</sub> + m<sub>2</sub>)", quantities: "m in kg, ϑ in °C" },
    { name: "Energiebilanz (allgemein)", html: "c<sub>1</sub> · m<sub>1</sub> · (ϑ<sub>1</sub> − ϑ<sub>m</sub>) = c<sub>2</sub> · m<sub>2</sub> · (ϑ<sub>m</sub> − ϑ<sub>2</sub>)", quantities: "Körper 1 gibt ab, Körper 2 nimmt auf" },
  ],
  quiz: {
    question: "1 kg Wasser mit 80 °C wird mit 3 kg Wasser mit 20 °C gemischt. Welche Mischtemperatur ergibt sich?",
    options: ["50 °C", "35 °C", "65 °C"],
    correctIndex: 1,
    explanation: "ϑ_m = (1 · 80 + 3 · 20) / 4 = 140 / 4 = 35 °C. Die größere kalte Masse zieht die Temperatur zu sich.",
  },
  lab: {
    kind: "mixing",
    title: "Labor: Wasser mischen",
    intro: "Mische zwei Wassermengen und finde die Mischtemperatur. Wie musst du die Massen wählen, um eine Wunschtemperatur zu treffen?",
    params: [
      { type: "range", key: "m1", label: "Masse m₁ (warm)", unit: "kg", min: 0.1, max: 5, step: 0.1, value: 1, digits: 1 },
      { type: "range", key: "t1", label: "Temperatur ϑ₁", unit: "°C", min: 0, max: 100, step: 1, value: 60 },
      { type: "range", key: "m2", label: "Masse m₂ (kalt)", unit: "kg", min: 0.1, max: 5, step: 0.1, value: 1, digits: 1 },
      { type: "range", key: "t2", label: "Temperatur ϑ₂", unit: "°C", min: 0, max: 100, step: 1, value: 20 },
    ],
    readouts: [
      { key: "tm", label: "Mischtemperatur ϑ_m", unit: "°C", digits: 1, emphasis: true, compute: (v) => (v.m1 * v.t1 + v.m2 * v.t2) / (v.m1 + v.m2) },
      { key: "Q", label: "Übertragene Wärme", unit: "J", digits: 0, compute: (v) => C_WATER * v.m1 * Math.abs(v.t1 - (v.m1 * v.t1 + v.m2 * v.t2) / (v.m1 + v.m2)) },
    ],
    goals: [
      { id: "dreissig", text: "Mische 60 °C warmes und 20 °C kaltes Wasser zu 30 °C (±0,5 °C).", check: (v, r) => v.t1 === 60 && v.t2 === 20 && within(Number(r.tm), 30, 0.5) },
      { id: "bad", text: "Badewasser: Aus 60 °C und 10 °C sollen 37 °C werden (±0,5 °C).", check: (v, r) => v.t1 === 60 && v.t2 === 10 && within(Number(r.tm), 37, 0.5) },
      { id: "mitte", text: "Gleiche Massen: Stelle 1 kg mit 80 °C und 1 kg mit 20 °C ein. ϑ_m liegt genau in der Mitte.", check: (v) => near(v.m1, 1, 0.01) && near(v.m2, 1, 0.01) && v.t1 === 80 && v.t2 === 20 },
    ],
  },
  exercises: [
    {
      id: "mischtemperatur",
      make: (rng, level) => {
        if (level === 1) {
          const m1 = rng.stepped(0.5, 3, 0.5);
          const t1 = rng.int(50, 95);
          const m2 = rng.stepped(0.5, 3, 0.5);
          const t2 = rng.int(5, 30);
          const tm = (m1 * t1 + m2 * t2) / (m1 + m2);
          return {
            prompt: `${fmtUnit(m1, "kg", 1)} Wasser mit ${fmtUnit(t1, "°C", 0)} werden mit ${fmtUnit(m2, "kg", 1)} Wasser mit ${fmtUnit(t2, "°C", 0)} gemischt. Berechne die Mischtemperatur.`,
            given: [`m₁ = ${fmtUnit(m1, "kg", 1)}, ϑ₁ = ${fmtUnit(t1, "°C", 0)}`, `m₂ = ${fmtUnit(m2, "kg", 1)}, ϑ₂ = ${fmtUnit(t2, "°C", 0)}`],
            formulaHint: "ϑ_m = (m₁ · ϑ₁ + m₂ · ϑ₂) / (m₁ + m₂)",
            answer: tm,
            unit: "°C",
            digits: 1,
            solutionHtml: `ϑ_m = (${fmt(m1, 1)} · ${fmt(t1, 0)} + ${fmt(m2, 1)} · ${fmt(t2, 0)}) / (${fmt(m1, 1)} + ${fmt(m2, 1)}) °C = <strong>${fmtUnit(tm, "°C", 1)}</strong>`,
          };
        }
        const m1 = rng.int(4, 12) * 10;
        const t1 = rng.pick([55, 60, 65, 70]);
        const tm = rng.pick([36, 37, 38, 40]);
        const t2 = rng.pick([8, 10, 12, 15]);
        const m2 = (m1 * (t1 - tm)) / (tm - t2);
        return {
          prompt: `In einer Badewanne sind ${fmtUnit(m1, "kg", 0)} Wasser mit ${fmtUnit(t1, "°C", 0)}. Es soll ${fmtUnit(tm, "°C", 0)} warm werden. Wie viel kaltes Wasser mit ${fmtUnit(t2, "°C", 0)} musst du zugeben?`,
          given: [`m₁ = ${fmtUnit(m1, "kg", 0)}, ϑ₁ = ${fmtUnit(t1, "°C", 0)}`, `ϑ₂ = ${fmtUnit(t2, "°C", 0)}`, `ϑ_m = ${fmtUnit(tm, "°C", 0)}`],
          answer: m2,
          unit: "kg",
          digits: 1,
          solutionHtml: `Q_ab = Q_auf: m₁ · (ϑ₁ − ϑ_m) = m₂ · (ϑ_m − ϑ₂)<br>m₂ = m₁ · (ϑ₁ − ϑ_m) / (ϑ_m − ϑ₂) = ${fmt(m1, 0)} · ${fmt(t1 - tm, 0)} / ${fmt(tm - t2, 0)} kg = <strong>${fmtUnit(m2, "kg", 1)}</strong>`,
        };
      },
    },
    {
      id: "unbekannte-temperatur",
      make: (rng, level) => {
        if (level === 1) {
          const m1 = rng.stepped(0.5, 3, 0.5);
          const t1 = rng.int(60, 95);
          const m2 = rng.stepped(0.5, 3, 0.5);
          const t2 = rng.int(5, 30);
          const tm = (m1 * t1 + m2 * t2) / (m1 + m2);
          return {
            prompt: `${fmtUnit(m1, "kg", 1)} Wasser mit ${fmtUnit(t1, "°C", 0)} werden mit ${fmtUnit(m2, "kg", 1)} kaltem Wasser gemischt. Die Mischtemperatur beträgt ${fmtUnit(tm, "°C", 1)}. Welche Temperatur hatte das kalte Wasser?`,
            given: [`m₁ = ${fmtUnit(m1, "kg", 1)}, ϑ₁ = ${fmtUnit(t1, "°C", 0)}`, `m₂ = ${fmtUnit(m2, "kg", 1)}`, `ϑ_m = ${fmtUnit(tm, "°C", 1)}`],
            formulaHint: "m₁ · (ϑ₁ − ϑ_m) = m₂ · (ϑ_m − ϑ₂), also ϑ₂ = ϑ_m − m₁ · (ϑ₁ − ϑ_m) / m₂",
            answer: t2,
            unit: "°C",
            digits: 1,
            tolerance: 0.03,
            absTolerance: 0.6,
            solutionHtml: `ϑ₂ = ϑ_m − m₁ · (ϑ₁ − ϑ_m) / m₂ = ${fmt(tm, 1)} − ${fmt(m1, 1)} · ${fmt(t1 - tm, 1)} / ${fmt(m2, 1)} °C = <strong>${fmtUnit(t2, "°C", 1)}</strong>`,
          };
        }
        const metals = [
          { name: "Eisen", c: 450 },
          { name: "Aluminium", c: 900 },
          { name: "Kupfer", c: 390 },
        ];
        const metal = rng.pick(metals);
        const mM = rng.stepped(0.2, 1, 0.1);
        const tM = rng.int(80, 100);
        const mW = rng.stepped(0.5, 2, 0.5);
        const tW = rng.int(15, 25);
        const tm = (metal.c * mM * tM + C_WATER * mW * tW) / (metal.c * mM + C_WATER * mW);
        return {
          prompt: `Ein ${metal.name}stück (${fmtUnit(mM, "kg", 1)}, c = ${fmtUnit(metal.c, "J/(kg·K)", 0)}) mit ${fmtUnit(tM, "°C", 0)} wird in ${fmtUnit(mW, "kg", 1)} Wasser mit ${fmtUnit(tW, "°C", 0)} gelegt. Welche Mischtemperatur stellt sich ohne Verluste ein? (c_Wasser = 4190 J/(kg·K))`,
          given: [`${metal.name}: m = ${fmtUnit(mM, "kg", 1)}, c = ${fmt(metal.c, 0)} J/(kg·K), ϑ = ${fmtUnit(tM, "°C", 0)}`, `Wasser: m = ${fmtUnit(mW, "kg", 1)}, c = 4190 J/(kg·K), ϑ = ${fmtUnit(tW, "°C", 0)}`],
          answer: tm,
          unit: "°C",
          digits: 1,
          solutionHtml: `c_M · m_M · (ϑ_M − ϑ_m) = c_W · m_W · (ϑ_m − ϑ_W)<br>ϑ_m = (c_M · m_M · ϑ_M + c_W · m_W · ϑ_W) / (c_M · m_M + c_W · m_W) = <strong>${fmtUnit(tm, "°C", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Abgegeben gleich aufgenommen: Du stellst Energiebilanzen auf und löst sie.",
};

// 3.4 Aggregatzustände ─────────────────────────────────────────────────────

const aggregatzustand: Lesson = {
  id: "wl-4-aggregatzustand",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "3.4 Schmelzen, Sieden und die Energie dahinter",
  subtitle: "Warum die Temperatur beim Schmelzen stehen bleibt",
  tracks: ["I"],
  lehrplan: "Ph9 LB 2 (I): Schmelzen und Erstarren, Verdunsten, Sieden und Kondensieren (energetische Betrachtung), Abhängigkeit der Schmelz- und Siedetemperatur",
  whyItMatters:
    "Eiswasser bleibt bei 0 °C, bis das letzte Eis geschmolzen ist. Kochendes Wasser bleibt bei 100 °C. Die Energie steckt dann nicht in der Temperatur, sondern im Wechsel des Aggregatzustands.",
  explanationHtml: `
    <p>Beim Übergang zwischen fest, flüssig und gasförmig ändert sich die Temperatur nicht, obwohl Energie zugeführt wird. Die Energie löst die Bindungen zwischen den Teilchen.</p>
    <ul>
      <li><strong>Schmelzen</strong> (fest → flüssig) bei der Schmelztemperatur: Q = q<sub>s</sub> · m. Für Eis ist die <strong>spezifische Schmelzenergie q<sub>s</sub> = 334 kJ/kg</strong>. Erstarren gibt dieselbe Energie wieder ab.</li>
      <li><strong>Sieden</strong> (flüssig → gasförmig) bei der Siedetemperatur: Q = q<sub>v</sub> · m. Für Wasser ist die <strong>spezifische Verdampfungsenergie q<sub>v</sub> = 2257 kJ/kg</strong>, fast siebenmal so viel wie Schmelzen. Kondensieren gibt sie wieder ab, deshalb verbrüht Dampf so schlimm.</li>
      <li><strong>Verdunsten</strong> ist Verdampfen unterhalb der Siedetemperatur. Es entzieht dem Rest Energie und kühlt: Schwitzen.</li>
      <li>Die Temperaturen hängen vom Druck und von gelösten Stoffen ab: Im <strong>Schnellkochtopf</strong> siedet Wasser bei höherem Druck erst über 100 °C, im Gebirge schon unter 100 °C. <strong>Streusalz</strong> senkt die Schmelztemperatur von Eis.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Erwärmungskurve: Steigung (Erwärmen mit c), Plateau (Schmelzen mit q_s), Steigung, Plateau (Sieden mit q_v), Steigung.</div>
  `,
  formulas: [
    { name: "Schmelzenergie", html: "Q = q<sub>s</sub> · m", quantities: "q_s(Eis) = 334 kJ/kg" },
    { name: "Verdampfungsenergie", html: "Q = q<sub>v</sub> · m", quantities: "q_v(Wasser) = 2257 kJ/kg" },
    { name: "Erwärmen", html: "Q = c · m · Δϑ", quantities: "c(Eis) ≈ 2,1 kJ/(kg·K), c(Wasser) = 4,19 kJ/(kg·K), c(Dampf) ≈ 2,0 kJ/(kg·K)" },
  ],
  quiz: {
    question: "Einem Gemisch aus Eis und Wasser bei 0 °C wird Wärme zugeführt. Was passiert mit der Temperatur, solange noch Eis vorhanden ist?",
    options: [
      "Sie steigt langsam an",
      "Sie bleibt bei 0 °C",
      "Sie sinkt kurz, weil das Eis kühlt",
    ],
    correctIndex: 1,
    explanation: "Die zugeführte Energie schmilzt das Eis (q_s · m). Erst wenn alles flüssig ist, steigt die Temperatur.",
  },
  lab: {
    kind: "phase-change",
    title: "Labor: Von Eis zu Dampf",
    intro: "Führe einer Eismenge von −20 °C Energie zu und verfolge die Erwärmungskurve.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 0.1, max: 2, step: 0.1, value: 1, digits: 1 },
      { type: "range", key: "Q", label: "Zugeführte Energie Q", unit: "kJ", min: 0, max: 6000, step: 10, value: 20 },
    ],
    readouts: [
      { key: "Qmelt", label: "Energie zum Schmelzen q_s · m", unit: "kJ", digits: 0, compute: (v) => (Q_MELT_ICE * v.m) / 1000 },
      { key: "Qvap", label: "Energie zum Verdampfen q_v · m", unit: "kJ", digits: 0, compute: (v) => (Q_VAPORISE_WATER * v.m) / 1000 },
      { key: "theta", label: "Temperatur", unit: "°C", digits: 1, emphasis: true, compute: (v) => phaseState(v.m, v.Q * 1000).theta },
      { key: "phase", label: "Zustand", emphasis: true, compute: (v) => phaseState(v.m, v.Q * 1000).phase },
      { key: "stage", label: "Abschnitt der Erwärmungskurve", compute: (v) => phaseState(v.m, v.Q * 1000).stage },
    ],
    goals: [
      { id: "geschmolzen", text: "Schmilz das Eis vollständig, aber erwärme das Wasser höchstens auf 2 °C.", check: (_v, r) => r.phase === "Wasser" && Number(r.theta) <= 2 },
      { id: "plateau", text: "Finde einen Punkt, an dem Eis und Wasser gleichzeitig vorliegen.", check: (_v, r) => r.phase === "Eis und Wasser" },
      { id: "verdampft", text: "Verdampfe 1 kg Eis von −20 °C vollständig.", check: (v, r) => near(v.m, 1, 0.01) && r.phase === "Dampf" },
    ],
  },
  exercises: [
    {
      id: "schmelzwaerme",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.stepped(0.2, 5, 0.1);
          const Q = (Q_MELT_ICE / 1000) * m;
          return {
            prompt: `Wie viel Energie ist nötig, um ${fmtUnit(m, "kg", 1)} Eis von 0 °C vollständig zu schmelzen? (q_s = 334 kJ/kg)`,
            given: [`m = ${fmtUnit(m, "kg", 1)}`, "q_s = 334 kJ/kg"],
            formulaHint: "Q = q_s · m",
            answer: Q,
            unit: "kJ",
            digits: 1,
            solutionHtml: `Q = q_s · m = 334 kJ/kg · ${fmt(m, 1)} kg = <strong>${fmtUnit(Q, "kJ", 1)}</strong>`,
          };
        }
        const g = rng.int(5, 30) * 10;
        const t = rng.int(10, 25);
        const m = g / 1000;
        const Q = (Q_MELT_ICE / 1000) * m + C_WATER_KJ * m * t;
        return {
          prompt: `${fmtUnit(g, "g", 0)} Eiswürfel von 0 °C schmelzen in einem Getränk und erwärmen sich als Wasser auf ${fmtUnit(t, "°C", 0)}. Wie viel Energie entziehen sie dem Getränk insgesamt? (q_s = 334 kJ/kg, c = 4,19 kJ/(kg·K))`,
          given: [`m = ${fmtUnit(g, "g", 0)} = ${fmtUnit(m, "kg", 2)}`, `Δϑ = ${fmtUnit(t, "K", 0)}`],
          answer: Q,
          unit: "kJ",
          digits: 1,
          solutionHtml: `Schmelzen: 334 · ${fmt(m, 2)} kJ = ${fmtUnit((Q_MELT_ICE / 1000) * m, "kJ", 1)}<br>Erwärmen: 4,19 · ${fmt(m, 2)} · ${fmt(t, 0)} kJ = ${fmtUnit(C_WATER_KJ * m * t, "kJ", 1)}<br>Summe: <strong>${fmtUnit(Q, "kJ", 1)}</strong>`,
        };
      },
    },
    {
      id: "verdampfen",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.stepped(0.1, 2, 0.1);
          const Q = (Q_VAPORISE_WATER / 1000) * m;
          return {
            prompt: `Wie viel Energie braucht man, um ${fmtUnit(m, "kg", 1)} Wasser von 100 °C vollständig zu verdampfen? (q_v = 2257 kJ/kg)`,
            given: [`m = ${fmtUnit(m, "kg", 1)}`, "q_v = 2257 kJ/kg"],
            formulaHint: "Q = q_v · m",
            answer: Q,
            unit: "kJ",
            digits: 0,
            solutionHtml: `Q = q_v · m = 2257 kJ/kg · ${fmt(m, 1)} kg = <strong>${fmtUnit(Q, "kJ", 0)}</strong>`,
          };
        }
        const m = rng.stepped(0.2, 1.5, 0.1);
        const t1 = rng.int(10, 25);
        const Qheat = C_WATER_KJ * m * (100 - t1);
        const Qvap = (Q_VAPORISE_WATER / 1000) * m;
        return {
          prompt: `${fmtUnit(m, "kg", 1)} Wasser mit ${fmtUnit(t1, "°C", 0)} werden zum Sieden gebracht und vollständig verdampft. Wie viel Energie ist insgesamt nötig? (c = 4,19 kJ/(kg·K), q_v = 2257 kJ/kg)`,
          given: [`m = ${fmtUnit(m, "kg", 1)}`, `Δϑ = ${fmtUnit(100 - t1, "K", 0)}`],
          answer: Qheat + Qvap,
          unit: "kJ",
          digits: 0,
          solutionHtml: `Erwärmen: 4,19 · ${fmt(m, 1)} · ${fmt(100 - t1, 0)} kJ = ${fmtUnit(Qheat, "kJ", 1)}<br>Verdampfen: 2257 · ${fmt(m, 1)} kJ = ${fmtUnit(Qvap, "kJ", 1)}<br>Summe: <strong>${fmtUnit(Qheat + Qvap, "kJ", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Plateau statt Steigung: Du weißt, wohin die Energie beim Schmelzen und Sieden geht.",
};

/** Where `Q` joules take `m` kilograms of ice that start at −20 °C. */
export function phaseState(
  m: number,
  Q: number,
): { theta: number; phase: string; stage: string } {
  const q1 = C_ICE * m * 20;
  const q2 = Q_MELT_ICE * m;
  const q3 = C_WATER * m * 100;
  const q4 = Q_VAPORISE_WATER * m;
  if (Q < q1) {
    return { theta: -20 + Q / (C_ICE * m), phase: "Eis", stage: "Eis erwärmt sich (c_Eis)" };
  }
  if (Q < q1 + q2) {
    const melted = Math.round(((Q - q1) / q2) * 100);
    return { theta: 0, phase: "Eis und Wasser", stage: `Eis schmilzt, ${melted} % sind flüssig (q_s)` };
  }
  if (Q < q1 + q2 + q3) {
    return { theta: (Q - q1 - q2) / (C_WATER * m), phase: "Wasser", stage: "Wasser erwärmt sich (c_Wasser)" };
  }
  if (Q < q1 + q2 + q3 + q4) {
    const vaporised = Math.round(((Q - q1 - q2 - q3) / q4) * 100);
    return { theta: 100, phase: "Wasser und Dampf", stage: `Wasser siedet, ${vaporised} % sind verdampft (q_v)` };
  }
  return {
    theta: 100 + (Q - q1 - q2 - q3 - q4) / (C_STEAM * m),
    phase: "Dampf",
    stage: "Dampf erwärmt sich (c_Dampf)",
  };
}

// 3.5 Wärmetransport und Anomalie des Wassers ──────────────────────────────

const RHO_WATER = (theta: number): number =>
  999.84 + 0.0675 * theta - 0.00894 * theta * theta + 0.0000869 * theta * theta * theta;

const wasseranomalie: Lesson = {
  id: "wl-5-wasseranomalie",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "3.5 Wärmetransport und die Anomalie des Wassers",
  subtitle: "Leitung, Strömung, Strahlung und warum Seen von oben zufrieren",
  tracks: ["II_III"],
  lehrplan: "Ph9 LB 2 (II/III): Energietransport durch Wärmeleitung, Wärmestrahlung und Konvektion, Volumenänderung, Anomalien des Wassers",
  whyItMatters:
    "Fische überleben den Winter, weil Wasser bei 4 °C am dichtesten ist und sich das wärmste Wasser am Grund sammelt. Und ob dich eine Jacke warm hält, entscheidet, wie sie den Wärmetransport bremst.",
  explanationHtml: `
    <p>Wärme wandert auf drei Wegen vom wärmeren zum kälteren Ort:</p>
    <ul>
      <li><strong>Wärmeleitung:</strong> Teilchen stoßen ihre Nachbarn an, der Stoff selbst bleibt an Ort und Stelle. Metalle leiten gut, Luft, Holz und Styropor schlecht (Isolatoren).</li>
      <li><strong>Konvektion (Wärmeströmung):</strong> Warme Flüssigkeit oder warmes Gas dehnt sich aus, wird weniger dicht und steigt auf, Kaltes sinkt ab. So heizt ein Heizkörper den Raum.</li>
      <li><strong>Wärmestrahlung:</strong> Jeder Körper sendet Infrarotstrahlung aus. Sie braucht keinen Stoff und erreicht uns von der Sonne durch das Vakuum.</li>
    </ul>
    <p>Die meisten Stoffe dehnen sich beim Erwärmen aus. Wasser ist eine Ausnahme: Es ist bei <strong>4 °C am dichtesten</strong>. Kühlt es weiter ab, dehnt es sich wieder aus, und Eis (917 kg/m³) ist deutlich leichter als Wasser (<strong>Anomalie des Wassers</strong>).</p>
    <ul>
      <li>Im Winter sinkt 4 °C kaltes Wasser auf den Grund, kälteres bleibt oben und gefriert. Der See friert <strong>von oben</strong> zu, unten bleiben 4 °C.</li>
      <li>Beim Gefrieren nimmt das Volumen um rund 9 % zu: Wasserleitungen und Felsspalten sprengen (Frostsprengung).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Leitung ohne Stofftransport, Konvektion mit Stofftransport, Strahlung ohne Stoff. Wasser: dichtestes Wasser bei 4 °C, Eis schwimmt.</div>
  `,
  formulas: [
    { name: "Dichte", html: "ρ = m / V", quantities: "ρ in kg/m³ oder g/cm³; Wasser 4 °C: 1000 kg/m³, Eis: 917 kg/m³" },
    { name: "Volumenzunahme beim Gefrieren", html: "V<sub>Eis</sub> = m / ρ<sub>Eis</sub>", quantities: "etwa 9 % mehr als flüssig" },
  ],
  quiz: {
    question: "Warum friert ein See im Winter von oben zu?",
    options: [
      "Weil kaltes Wasser immer leichter ist als warmes",
      "Weil Wasser bei 4 °C am dichtesten ist und zum Grund sinkt, kälteres Wasser oben bleibt",
      "Weil Eis schwerer ist als Wasser und oben festgehalten wird",
    ],
    correctIndex: 1,
    explanation: "Die Anomalie des Wassers: Das dichteste Wasser (4 °C) sammelt sich unten, das kältere oben gefriert, und Eis schwimmt.",
  },
  lab: {
    kind: "water-anomaly",
    title: "Labor: Dichte von Wasser",
    intro: "Verändere die Wassertemperatur und beobachte die Dichte. Wo liegt das Maximum?",
    params: [
      { type: "range", key: "theta", label: "Wassertemperatur ϑ", unit: "°C", min: 0, max: 40, step: 0.5, value: 10, digits: 1 },
    ],
    readouts: [
      { key: "rho", label: "Dichte ρ", unit: "kg/m³", digits: 2, emphasis: true, compute: (v) => RHO_WATER(v.theta) },
      { key: "diff4", label: "Unterschied zur Dichte bei 4 °C", unit: "kg/m³", digits: 2, compute: (v) => RHO_WATER(4) - RHO_WATER(v.theta) },
    ],
    goals: [
      { id: "dichteste", text: "Finde die Temperatur mit der größten Dichte.", check: (v) => within(v.theta, 4, 0.5) },
      { id: "warm", text: "Zeige, dass Wasser über 20 °C mehr als 1 kg/m³ leichter ist als bei 4 °C.", check: (v, r) => v.theta >= 20 && Number(r.diff4) > 1 },
      { id: "null", text: "Stelle 0 °C ein: Auch dieses Wasser ist leichter als bei 4 °C und schwimmt oben.", check: (v) => v.theta === 0 },
    ],
  },
  exercises: [
    {
      id: "eis-volumen",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.stepped(0.5, 10, 0.5);
          const V = (m / 917) * 1000;
          return {
            prompt: `${fmtUnit(m, "kg", 1)} Wasser gefrieren zu Eis (ρ_Eis = 917 kg/m³). Welches Volumen hat das Eis in Litern?`,
            given: [`m = ${fmtUnit(m, "kg", 1)}`, "ρ_Eis = 917 kg/m³ = 0,917 kg/L"],
            formulaHint: "ρ = m / V, also V = m / ρ",
            answer: V,
            unit: "L",
            digits: 2,
            solutionHtml: `V = m / ρ = ${fmt(m, 1)} kg / 0,917 kg/L = <strong>${fmtUnit(V, "L", 2)}</strong>`,
          };
        }
        const V = rng.pick([0.5, 0.75, 1, 1.5, 2, 5, 10]);
        const Vice = (V * 1000) / 917;
        return {
          prompt: `Eine Flasche mit ${fmtUnit(V, "L", 2)} Wasser (ρ = 1000 kg/m³) wird in den Gefrierschrank gelegt. Welches Volumen nimmt das Eis (ρ = 917 kg/m³) ein? Erkläre dir damit, warum die Flasche platzen kann.`,
          given: [`V_Wasser = ${fmtUnit(V, "L", 2)}`, "ρ_Wasser = 1000 kg/m³", "ρ_Eis = 917 kg/m³"],
          answer: Vice,
          unit: "L",
          digits: 3,
          solutionHtml: `m = ρ_W · V = ${fmt(V, 2)} kg<br>V_Eis = m / ρ_Eis = ${fmt(V, 2)} kg / 0,917 kg/L = <strong>${fmtUnit(Vice, "L", 3)}</strong>, also rund 9 % mehr`,
        };
      },
    },
    {
      id: "eisberg",
      make: (rng, level) => {
        if (level === 1) {
          const rhoIce = rng.pick([900, 905, 910, 917, 920]);
          const rhoW = rng.pick([1000, 1025]);
          const anteil = (rhoIce / rhoW) * 100;
          return {
            prompt: `Eis der Dichte ${fmtUnit(rhoIce, "kg/m³", 0)} schwimmt in Wasser der Dichte ${fmtUnit(rhoW, "kg/m³", 0)}. Wie viel Prozent des Eises liegen unter Wasser?`,
            given: [`ρ_Eis = ${fmtUnit(rhoIce, "kg/m³", 0)}`, `ρ_Wasser = ${fmtUnit(rhoW, "kg/m³", 0)}`],
            formulaHint: "Schwimmen: eingetauchter Anteil = ρ_Körper / ρ_Flüssigkeit",
            answer: anteil,
            unit: "%",
            digits: 1,
            solutionHtml: `Anteil = ${fmt(rhoIce, 0)} / ${fmt(rhoW, 0)} = ${fmt(rhoIce / rhoW, 3)} = <strong>${fmtUnit(anteil, "%", 1)}</strong>`,
          };
        }
        const tons = rng.int(2, 40) * 50;
        const V = (tons * 1000) / 1025;
        return {
          prompt: `Eine Eisscholle hat die Masse ${fmtUnit(tons, "t", 0)} und schwimmt im Meer (ρ = 1025 kg/m³). Welches Wasservolumen verdrängt sie?`,
          given: [`m = ${fmtUnit(tons, "t", 0)} = ${fmtUnit(tons * 1000, "kg", 0)}`, "ρ_Meer = 1025 kg/m³"],
          answer: V,
          unit: "m³",
          digits: 0,
          solutionHtml: `Schwimmen: verdrängte Wassermasse = Masse der Scholle. V = m / ρ_Meer = ${fmt(tons * 1000, 0)} kg / 1025 kg/m³ = <strong>${fmtUnit(V, "m³", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst, wie Wärme wandert, und warum Eis schwimmt.",
};

// 3.6 Allgemeine Gasgleichung ──────────────────────────────────────────────

const gasgleichung: Lesson = {
  id: "wl-6-gasgleichung",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "3.6 Ideales Gas und allgemeine Gasgleichung",
  subtitle: "Druck, Volumen und Temperatur in einer Gleichung",
  tracks: ["I"],
  lehrplan: "Ph9 LB 2 (I): Temperatur, Druck und Volumen als Zustandsgrößen eines Gases, ideales Gas, allgemeine Gasgleichung",
  whyItMatters:
    "Ein Autoreifen hat nach der Autobahnfahrt mehr Druck, ein Luftballon schrumpft im Gefrierschrank. Die allgemeine Gasgleichung verbindet Druck, Volumen und Temperatur.",
  explanationHtml: `
    <p>Für eine eingeschlossene Gasmenge (<strong>ideales Gas</strong>: Teilchen ohne Eigenvolumen und ohne Anziehung) hängen die drei Zustandsgrößen Druck p, Volumen V und absolute Temperatur T so zusammen:</p>
    <p class="formula-line">p · V / T = konstant, also p<sub>1</sub> · V<sub>1</sub> / T<sub>1</sub> = p<sub>2</sub> · V<sub>2</sub> / T<sub>2</sub></p>
    <ul>
      <li><strong>T muss in Kelvin</strong> eingesetzt werden. 20 °C sind 293 K; mit Celsius-Werten rechnet die Gleichung falsch.</li>
      <li>Konstante Temperatur: p · V = konstant (Boyle-Mariotte). Konstantes Volumen: p / T = konstant (Reifen). Konstanter Druck: V / T = konstant (Ballon).</li>
      <li>Daher der absolute Nullpunkt: Das Volumen eines idealen Gases bei konstantem Druck nimmt pro Kelvin um 1/273 des Volumens bei 0 °C ab. Bei −273 °C wäre es null.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Immer zuerst in Kelvin umrechnen. Dann p · V / T auf beiden Seiten gleichsetzen und nach der gesuchten Größe auflösen.</div>
  `,
  formulas: [
    { name: "Allgemeine Gasgleichung", html: "p<sub>1</sub> · V<sub>1</sub> / T<sub>1</sub> = p<sub>2</sub> · V<sub>2</sub> / T<sub>2</sub>", quantities: "T in K; p und V in beliebigen, aber gleichen Einheiten" },
    { name: "Sonderfall T konstant (Boyle-Mariotte)", html: "p · V = konstant", quantities: "" },
    { name: "Sonderfall V konstant", html: "p / T = konstant", quantities: "Reifen: Erwärmen erhöht den Druck" },
    { name: "Sonderfall p konstant", html: "V / T = konstant", quantities: "Ballon: Abkühlen verkleinert das Volumen" },
  ],
  quiz: {
    question: "Ein abgeschlossenes Gas wird bei konstantem Volumen von 20 °C auf 40 °C erwärmt. Wie ändert sich der Druck?",
    options: [
      "Er verdoppelt sich, weil sich die Temperatur verdoppelt",
      "Er steigt um etwa 7 %, weil 313 K / 293 K ≈ 1,07",
      "Er bleibt gleich, weil das Volumen konstant ist",
    ],
    correctIndex: 1,
    explanation: "In Kelvin steigt T von 293 K auf 313 K, also um den Faktor 1,07. Celsius-Werte darf man nicht ins Verhältnis setzen.",
  },
  lab: {
    kind: "gas-law",
    title: "Labor: Gas im Zylinder",
    intro: "Ändere Volumen und Temperatur. Beobachte den Druck und prüfe, dass p · V / T gleich bleibt. Start: 1000 hPa bei 5 L und 20 °C.",
    params: [
      { type: "range", key: "V", label: "Volumen V", unit: "L", min: 1, max: 10, step: 0.1, value: 5, digits: 1 },
      { type: "range", key: "theta", label: "Temperatur ϑ", unit: "°C", min: -150, max: 300, step: 1, value: 20 },
    ],
    readouts: [
      { key: "T", label: "Absolute Temperatur T", unit: "K", digits: 2, compute: (v) => v.theta + KELVIN_OFFSET },
      { key: "p", label: "Druck p", unit: "hPa", digits: 0, emphasis: true, compute: (v) => (1000 * (5 / v.V) * (v.theta + KELVIN_OFFSET)) / (20 + KELVIN_OFFSET) },
      { key: "pvT", label: "p · V / T", unit: "hPa · L / K", digits: 3, compute: (v) => (((1000 * (5 / v.V) * (v.theta + KELVIN_OFFSET)) / (20 + KELVIN_OFFSET)) * v.V) / (v.theta + KELVIN_OFFSET) },
    ],
    goals: [
      { id: "erwaermen", text: "Erhöhe den Druck bei V = 5 L nur durch Erwärmen auf mindestens 1 500 hPa.", check: (v, r) => near(v.V, 5, 0.001) && Number(r.p) >= 1500 },
      { id: "abkuehlen", text: "Komprimiere auf 2,5 L und halte den Druck durch Abkühlen unter 1 300 hPa.", check: (v, r) => near(v.V, 2.5, 0.001) && Number(r.p) < 1300 },
      { id: "boyle", text: "Halbiere den Druck bei 20 °C, indem du das Volumen verdoppelst (10 L).", check: (v) => v.theta === 20 && near(v.V, 10, 0.001) },
    ],
  },
  exercises: [
    {
      id: "gasgleichung-druck",
      make: (rng, level) => {
        if (level === 1) {
          const p1 = rng.pick([1000, 1013, 1200, 1500]);
          const V1 = rng.int(4, 10);
          const t1 = rng.int(10, 30);
          // The gas is compressed, so V₂ is strictly below V₁.
          const V2 = rng.int(1, V1 - 1);
          const t2 = rng.int(40, 150);
          const T1 = t1 + KELVIN_OFFSET;
          const T2 = t2 + KELVIN_OFFSET;
          const p2 = (p1 * V1 * T2) / (T1 * V2);
          return {
            prompt: `Ein Gas hat ${fmtUnit(p1, "hPa", 0)} bei ${fmtUnit(V1, "L", 0)} und ${fmtUnit(t1, "°C", 0)}. Es wird auf ${fmtUnit(V2, "L", 0)} zusammengedrückt und auf ${fmtUnit(t2, "°C", 0)} erwärmt. Welcher Druck herrscht dann?`,
            given: [`p₁ = ${fmtUnit(p1, "hPa", 0)}, V₁ = ${fmtUnit(V1, "L", 0)}, T₁ = ${fmtUnit(T1, "K", 2)}`, `V₂ = ${fmtUnit(V2, "L", 0)}, T₂ = ${fmtUnit(T2, "K", 2)}`],
            formulaHint: "p₁ · V₁ / T₁ = p₂ · V₂ / T₂, also p₂ = p₁ · V₁ · T₂ / (T₁ · V₂)",
            answer: p2,
            unit: "hPa",
            digits: 0,
            solutionHtml: `p₂ = p₁ · V₁ · T₂ / (T₁ · V₂) = ${fmt(p1, 0)} · ${fmt(V1, 0)} · ${fmt(T2, 2)} / (${fmt(T1, 2)} · ${fmt(V2, 0)}) hPa = <strong>${fmtUnit(p2, "hPa", 0)}</strong>`,
            meta: { V1, V2 },
          };
        }
        const pBar = rng.pick([2.2, 2.4, 2.5, 2.8, 3]);
        const t1 = rng.int(5, 20);
        const t2 = rng.int(40, 70);
        const p2 = (pBar * (t2 + KELVIN_OFFSET)) / (t1 + KELVIN_OFFSET);
        return {
          prompt: `Morgens hat ein Autoreifen bei ${fmtUnit(t1, "°C", 0)} einen Absolutdruck von ${fmtUnit(pBar, "bar", 1)}. Nach der Fahrt ist die Luft im Reifen ${fmtUnit(t2, "°C", 0)} warm, das Volumen bleibt gleich. Welcher Druck herrscht jetzt?`,
          given: [`p₁ = ${fmtUnit(pBar, "bar", 1)}`, `T₁ = ${fmtUnit(t1 + KELVIN_OFFSET, "K", 2)}`, `T₂ = ${fmtUnit(t2 + KELVIN_OFFSET, "K", 2)}`, "V konstant"],
          answer: p2,
          unit: "bar",
          digits: 2,
          solutionHtml: `V konstant ⇒ p₁ / T₁ = p₂ / T₂ ⇒ p₂ = p₁ · T₂ / T₁ = ${fmt(pBar, 1)} bar · ${fmt(t2 + KELVIN_OFFSET, 2)} / ${fmt(t1 + KELVIN_OFFSET, 2)} = <strong>${fmtUnit(p2, "bar", 2)}</strong>`,
        };
      },
    },
    {
      id: "gasgleichung-volumen",
      make: (rng, level) => {
        if (level === 1) {
          const V1 = rng.int(1, 10);
          const t1 = rng.int(15, 30);
          const t2 = rng.int(60, 200);
          const V2 = (V1 * (t2 + KELVIN_OFFSET)) / (t1 + KELVIN_OFFSET);
          return {
            prompt: `${fmtUnit(V1, "L", 0)} Gas mit ${fmtUnit(t1, "°C", 0)} werden bei konstantem Druck auf ${fmtUnit(t2, "°C", 0)} erwärmt. Welches Volumen nimmt das Gas dann ein?`,
            given: [`V₁ = ${fmtUnit(V1, "L", 0)}`, `T₁ = ${fmtUnit(t1 + KELVIN_OFFSET, "K", 2)}`, `T₂ = ${fmtUnit(t2 + KELVIN_OFFSET, "K", 2)}`, "p konstant"],
            formulaHint: "p konstant: V₁ / T₁ = V₂ / T₂, also V₂ = V₁ · T₂ / T₁",
            answer: V2,
            unit: "L",
            digits: 2,
            solutionHtml: `V₂ = V₁ · T₂ / T₁ = ${fmt(V1, 0)} L · ${fmt(t2 + KELVIN_OFFSET, 2)} / ${fmt(t1 + KELVIN_OFFSET, 2)} = <strong>${fmtUnit(V2, "L", 2)}</strong>`,
          };
        }
        const V1 = rng.stepped(2, 6, 0.5);
        const t1 = rng.int(18, 26);
        const t2 = rng.pick([-18, -20, -25, -30]);
        const V2 = (V1 * (t2 + KELVIN_OFFSET)) / (t1 + KELVIN_OFFSET);
        return {
          prompt: `Ein Luftballon mit ${fmtUnit(V1, "L", 1)} wird von ${fmtUnit(t1, "°C", 0)} in einen Gefrierschrank mit ${fmtUnit(t2, "°C", 0)} gelegt. Der Druck bleibt gleich. Welches Volumen hat der Ballon im Gefrierschrank?`,
          given: [`V₁ = ${fmtUnit(V1, "L", 1)}`, `T₁ = ${fmtUnit(t1 + KELVIN_OFFSET, "K", 2)}`, `T₂ = ${fmtUnit(t2 + KELVIN_OFFSET, "K", 2)}`],
          answer: V2,
          unit: "L",
          digits: 2,
          solutionHtml: `V₂ = V₁ · T₂ / T₁ = ${fmt(V1, 1)} L · ${fmt(t2 + KELVIN_OFFSET, 2)} / ${fmt(t1 + KELVIN_OFFSET, 2)} = <strong>${fmtUnit(V2, "L", 2)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "p · V / T bleibt gleich: Du rechnest mit der allgemeinen Gasgleichung in Kelvin.",
};

export const STAGE_WAERME: Stage = {
  id: STAGE_ID,
  stageNumber: 3,
  title: "Wärmelehre",
  subtitle: "Temperatur, Wärme, Wärmekapazität, Aggregatzustände und Gase",
  icon: "🔥",
  accent: "#dc2626",
  badgeTitle: "Wärme-Kenner",
  lehrplanLabel: "Ph9 LB 2 (I) · Ph9 LB 2 (II/III)",
  lessons: [temperatur, waermekapazitaet, mischung, aggregatzustand, wasseranomalie, gasgleichung],
};
