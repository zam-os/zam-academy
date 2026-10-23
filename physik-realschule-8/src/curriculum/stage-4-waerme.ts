import { fmt, fmtUnit } from "../exercises/format";
import { KELVIN_OFFSET } from "../lab/engine";
import {
  conductionTemp,
  diffusivity,
  heatingState,
  ICE_DENSITY,
  PROBE_POSITION,
  teaTemperature,
  thermosLosses,
  waterDensity,
} from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-4-waerme";

// 4.1 Innere Energie und Wärme ─────────────────────────────────────────────

const U0 = 1000; // J, inner energy of the body in the lab (reference for the picture)

const innereEnergie: Lesson = {
  id: "wl-1-innere-energie",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "4.1 Innere Energie und Wärme",
  subtitle: "Reibung, Kompression und Wärme verändern die Teilchenbewegung",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): innere Energie als Summe kinetischer und potenzieller Energien der Teilchen, Zustandsgröße; Wärme als Übertragungsgröße",
  whyItMatters:
    "Im Alltag heißt es „Der Tee hat viel Wärme“. Physikalisch ist das falsch: Ein Körper hat innere Energie, Wärme ist nur der Weg, auf dem Energie von selbst von heiß nach kalt wandert.",
  explanationHtml: `
    <p><strong>Erweitertes Teilchenmodell:</strong> Die Teilchen eines Körpers bewegen sich ungeordnet (kinetische Energie), und zwischen ihnen wirken Anziehungskräfte (potenzielle Energie). Die <strong>innere Energie U</strong> eines Körpers ist die <strong>Summe der kinetischen und potenziellen Energien aller seiner Teilchen</strong>. Sie ist eine <strong>Zustandsgröße</strong>: Sie beschreibt den Zustand des Körpers, so wie sein Volumen oder seine Temperatur.</p>
    <p>Man kann die innere Energie eines Körpers auf zwei Wegen ändern:</p>
    <ul>
      <li>durch <strong>Arbeit</strong>: Reibungsarbeit (Hände reiben, Bohren, Bremsen) oder Kompressionsarbeit (Fahrradpumpe, Luft zusammendrücken),</li>
      <li>durch <strong>Wärme Q</strong>: Energie, die wegen eines Temperaturunterschieds von selbst vom wärmeren zum kälteren Körper übergeht. Wärme ist eine <strong>Übertragungsgröße</strong> (Einheit J), keine Eigenschaft eines Körpers.</li>
    </ul>
    <p class="formula-line">ΔU = W + Q</p>
    <p>Wird Energie zu- oder abgeführt (W und Q als Zahlen mit Vorzeichen), ändert sich U. Steigt die innere Energie und ändert sich dabei nicht der Aggregatzustand, bewegen sich die Teilchen im Mittel schneller, und der Körper wird wärmer.</p>
    <div class="merke"><strong>Merke:</strong> Körper haben innere Energie, aber keine Wärme. Wärme „fließt“ vom heißen zum kalten Körper. Arbeit und Wärme können dasselbe bewirken.</div>
  `,
  formulas: [
    { name: "Änderung der inneren Energie", html: "ΔU = W + Q", quantities: "W Arbeit (Reibung, Kompression), Q Wärme, jeweils in J; zugeführt positiv" },
    { name: "Rührarbeit", html: "W = P · t", quantities: "P Leistung in W, t Zeit in s" },
  ],
  quiz: {
    question: "Du reibst deine Hände aneinander und sie werden warm. Was ist passiert?",
    options: [
      "Wärme wurde erzeugt, ohne dass Energie zugeführt wurde",
      "Reibungsarbeit hat die innere Energie der Hände erhöht",
      "Die Hände haben Kälte abgegeben",
    ],
    correctIndex: 1,
    explanation: "Die Reibungsarbeit deiner Muskeln wird in innere Energie der Hände umgewandelt: Die Teilchen bewegen sich schneller, die Temperatur steigt.",
  },
  lab: {
    kind: "internal-energy",
    title: "Labor: Energie in einen Körper",
    intro: "Rühre den Körper (Reibungsarbeit W) und führe Wärme Q zu oder ab. Beobachte die Teilchenbewegung und die Bilanz ΔU = W + Q.",
    params: [
      { type: "range", key: "W", label: "Reibungsarbeit W", unit: "J", min: 0, max: 500, step: 50, value: 100 },
      { type: "range", key: "Q", label: "Wärme Q (negativ: abgegeben)", unit: "J", min: -300, max: 300, step: 50, value: 0 },
    ],
    readouts: [
      { key: "dU", label: "Änderung der inneren Energie ΔU = W + Q", unit: "J", digits: 0, emphasis: true, compute: (v) => v.W + v.Q },
      { key: "speed", label: "Mittleres Teilchentempo (Start = 1)", digits: 2, compute: (v) => Math.sqrt(Math.max(0, (U0 + v.W + v.Q) / U0)) },
      { key: "temp", label: "Temperatur", emphasis: true, compute: (v) => (v.W + v.Q > 0 ? "steigt" : v.W + v.Q < 0 ? "sinkt" : "bleibt gleich") },
    ],
    goals: [
      { id: "nur-reibung", text: "Erhöhe die innere Energie nur durch Arbeit: Reibungsarbeit mindestens 300 J, keine Wärmezufuhr.", check: (v) => v.W >= 300 && v.Q === 0 },
      { id: "nur-waerme", text: "Erhöhe die innere Energie nur durch Wärme: mindestens 200 J, ohne Reibungsarbeit.", check: (v) => v.W === 0 && v.Q >= 200 },
      { id: "ausgleich", text: "Gleiche Reibungsarbeit durch Wärmeabgabe aus: ΔU = 0 bei abgegebener Wärme.", check: (v, r) => v.Q < 0 && Number(r.dU) === 0 },
    ],
  },
  exercises: [
    {
      id: "energiebilanz",
      make: (rng, level) => {
        if (level === 1) {
          const W = rng.int(3, 20) * 50;
          const Q = rng.pick([-100, -50, 50, 100, 150, 200]);
          const dU = W + Q;
          return {
            prompt: `Einem Körper wird Reibungsarbeit ${fmtUnit(W, "J", 0)} zugeführt, und er ${Q >= 0 ? "nimmt zusätzlich" : "gibt"} ${fmtUnit(Math.abs(Q), "J", 0)} Wärme ${Q >= 0 ? "auf" : "ab"}. Wie ändert sich seine innere Energie?`,
            given: [`W = ${fmtUnit(W, "J", 0)}`, `Q = ${Q >= 0 ? "+" : "−"}${fmtUnit(Math.abs(Q), "J", 0)}`],
            formulaHint: "ΔU = W + Q (zugeführt positiv, abgegeben negativ)",
            answer: dU,
            unit: "J",
            digits: 0,
            solutionHtml: `ΔU = W + Q = ${fmt(W, 0)} J ${Q >= 0 ? "+" : "−"} ${fmt(Math.abs(Q), 0)} J = <strong>${fmtUnit(dU, "J", 0)}</strong>`,
          };
        }
        const W = rng.pick([120, 150, 200, 300]);
        const Qout = rng.pick([30, 45, 60, 80]);
        return {
          prompt: `Beim schnellen Aufpumpen eines Fahrradreifens wird die Luft in der Pumpe mit ${fmtUnit(W, "J", 0)} Kompressionsarbeit zusammengedrückt. ${fmtUnit(Qout, "J", 0)} Wärme gibt die Luft dabei an die Pumpenwand ab. Um wie viel Joule steigt die innere Energie der Luft?`,
          given: [`W = ${fmtUnit(W, "J", 0)}`, `abgegebene Wärme ${fmtUnit(Qout, "J", 0)}`],
          answer: W - Qout,
          unit: "J",
          digits: 0,
          solutionHtml: `ΔU = W + Q = ${fmt(W, 0)} J + (−${fmt(Qout, 0)} J) = <strong>${fmtUnit(W - Qout, "J", 0)}</strong>. Die Luft wird wärmer.`,
        };
      },
    },
    {
      id: "ruehrarbeit",
      make: (rng, level) => {
        if (level === 1) {
          const P = rng.pick([100, 150, 200, 250]);
          const t = rng.pick([30, 60, 90, 120]);
          return {
            prompt: `Ein Rührgerät verrichtet mit der Leistung ${fmtUnit(P, "W", 0)} ${fmtUnit(t, "s", 0)} lang Reibungsarbeit an einer Flüssigkeit. Welche Energie wird dabei übertragen?`,
            given: [`P = ${fmtUnit(P, "W", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "W = P · t",
            answer: P * t,
            unit: "J",
            digits: 0,
            solutionHtml: `W = P · t = ${fmt(P, 0)} W · ${fmt(t, 0)} s = <strong>${fmtUnit(P * t, "J", 0)}</strong>`,
          };
        }
        const P = rng.pick([150, 200, 300]);
        const t = rng.pick([60, 120, 180]);
        const Qout = rng.pick([2000, 3000, 4000]);
        const dU = P * t - Qout;
        return {
          prompt: `Ein Mixer rührt mit ${fmtUnit(P, "W", 0)} Leistung ${fmtUnit(t, "s", 0)} lang in einem Becher. Der Becher gibt dabei ${fmtUnit(Qout, "J", 0)} Wärme an die Umgebung ab. Um wie viel Joule steigt die innere Energie der Flüssigkeit?`,
          given: [`P = ${fmtUnit(P, "W", 0)}`, `t = ${fmtUnit(t, "s", 0)}`, `abgegebene Wärme ${fmtUnit(Qout, "J", 0)}`],
          answer: dU,
          unit: "J",
          digits: 0,
          solutionHtml: `W = P · t = ${fmt(P * t, 0)} J<br>ΔU = W + Q = ${fmt(P * t, 0)} J − ${fmt(Qout, 0)} J = <strong>${fmtUnit(dU, "J", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du trennst innere Energie (Zustandsgröße) und Wärme (Übertragungsgröße) und bilanzierst ΔU = W + Q.",
};

// 4.2 Temperatur und Temperaturmessung ─────────────────────────────────────

const temperatur: Lesson = {
  id: "wl-2-temperatur",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "4.2 Temperatur und Temperaturmessung",
  subtitle: "Celsius, Kelvin, Fahrenheit und das richtige Thermometer",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): Temperatur als Maß für die mittlere Bewegungsenergie der Teilchen; Temperaturmessung (Thermoskop, Skalen, Messgeräte)",
  whyItMatters:
    "Fieber messen, Backofen einstellen, Wetterbericht: Temperaturen begegnen uns täglich. Doch was misst ein Thermometer eigentlich, und warum gibt es nach unten eine Grenze?",
  explanationHtml: `
    <p>Die <strong>Temperatur</strong> eines Körpers ist ein Maß für die <strong>mittlere Bewegungsenergie</strong> (kinetische Energie) seiner Teilchen. Sie ist nicht die Wärme und nicht die innere Energie: Ein großer Topf Wasser von 50 °C hat viel mehr innere Energie als ein Tropfen von 80 °C.</p>
    <ul>
      <li><strong>Thermoskop:</strong> zeigt nur „wärmer“ oder „kälter“ an (zum Beispiel ein Luftballon am Gefäß).</li>
      <li><strong>Celsius-Skala:</strong> 0 °C Gefrierpunkt, 100 °C Siedepunkt von Wasser (bei Normaldruck).</li>
      <li><strong>Kelvin-Skala:</strong> T = θ + 273,15. Der <strong>absolute Nullpunkt</strong> 0 K = −273,15 °C ist die tiefste mögliche Temperatur: Die Teilchen hätten die kleinste Bewegungsenergie. Temperaturunterschiede sind in K und °C gleich groß.</li>
      <li><strong>Fahrenheit-Skala</strong> (USA): θ<sub>F</sub> = 1,8 · θ + 32.</li>
      <li><strong>Messen:</strong> Das Thermometer nimmt die Temperatur des Körpers an. Es muss zum Messbereich und zur gewünschten Genauigkeit passen: Fieberthermometer (35 bis 42 °C, 0,1 K), Laborthermometer (−10 bis 110 °C), Infrarot-Thermometer (berührungslos), Bimetall im Backofen.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Temperatur ist Bewegungsenergie pro Teilchen, nicht Wärmemenge. Kelvin hat keine negativen Werte.</div>
  `,
  formulas: [
    { name: "Kelvin und Celsius", html: "T = θ + 273,15", quantities: "T in K, θ in °C; ΔT = Δθ" },
    { name: "Fahrenheit", html: "θ<sub>F</sub> = 1,8 · θ + 32", quantities: "θ in °C" },
    { name: "Wichtige Punkte", html: "0 K = −273,15 °C; 0 °C = 273,15 K; 100 °C = 373,15 K", quantities: "" },
  ],
  quiz: {
    question: "Was gibt die Temperatur eines Körpers an?",
    options: [
      "Die in dem Körper gespeicherte Wärme",
      "Die Anzahl der Teilchen des Körpers",
      "Die mittlere Bewegungsenergie seiner Teilchen",
    ],
    correctIndex: 2,
    explanation: "Je höher die Temperatur, desto schneller bewegen sich die Teilchen im Mittel. Wärme und innere Energie hängen zusätzlich von der Menge des Stoffes ab.",
  },
  lab: {
    kind: "thermometer",
    title: "Labor: Drei Temperaturskalen",
    intro: "Stelle eine Temperatur in °C ein und lies sie in Kelvin und Fahrenheit ab. Der Balken rechts zeigt die mittlere Bewegungsenergie der Teilchen.",
    params: [{ type: "range", key: "theta", label: "Temperatur θ", unit: "°C", min: -273, max: 200, step: 1, value: 20 }],
    readouts: [
      { key: "T", label: "Kelvin T = θ + 273,15", unit: "K", digits: 2, emphasis: true, compute: (v) => v.theta + KELVIN_OFFSET },
      { key: "F", label: "Fahrenheit", unit: "°F", digits: 1, compute: (v) => 1.8 * v.theta + 32 },
      { key: "Ekin", label: "Mittlere Bewegungsenergie (Raumtemperatur = 1)", digits: 2, compute: (v) => (v.theta + KELVIN_OFFSET) / (20 + KELVIN_OFFSET) },
    ],
    goals: [
      { id: "nullpunkt", text: "Stelle den absoluten Nullpunkt ein (−273 °C, praktisch 0 K).", check: (v) => v.theta === -273 },
      { id: "siedepunkt", text: "Stelle den Siedepunkt von Wasser ein: 100 °C sind 373,15 K.", check: (v) => v.theta === 100 },
      { id: "koerper", text: "Stelle die Körpertemperatur 37 °C ein: Das sind 98,6 °F.", check: (v) => v.theta === 37 },
    ],
  },
  exercises: [
    {
      id: "kelvin",
      make: (rng, level) => {
        if (level === 1) {
          const theta = rng.pick([-40, -10, 0, 15, 20, 37, 60, 100]);
          return {
            prompt: `Rechne die Temperatur ${fmtUnit(theta, "°C", 0)} in Kelvin um.`,
            given: [`θ = ${fmtUnit(theta, "°C", 0)}`],
            formulaHint: "T = θ + 273,15",
            answer: theta + KELVIN_OFFSET,
            unit: "K",
            digits: 2,
            solutionHtml: `T = θ + 273,15 = ${fmt(theta, 0)} + 273,15 = <strong>${fmtUnit(theta + KELVIN_OFFSET, "K", 2)}</strong>`,
          };
        }
        const T = rng.pick([77, 90, 194.7, 250, 373.15, 4.2]);
        return {
          prompt: `Flüssiger Stickstoff siedet etwa bei ${fmtUnit(T, "K", 2)} (flüssiges Helium bei 4,2 K, Trockeneis sublimiert bei 194,7 K). Wie viel Grad Celsius sind ${fmtUnit(T, "K", 2)}?`,
          given: [`T = ${fmtUnit(T, "K", 2)}`],
          answer: T - KELVIN_OFFSET,
          unit: "°C",
          digits: 2,
          solutionHtml: `θ = T − 273,15 = ${fmt(T, 2)} − 273,15 = <strong>${fmtUnit(T - KELVIN_OFFSET, "°C", 2)}</strong>`,
        };
      },
    },
    {
      id: "fahrenheit",
      make: (rng, level) => {
        if (level === 1) {
          const theta = rng.pick([-10, 0, 10, 20, 30, 37, 40]);
          return {
            prompt: `Auf einer amerikanischen Wetter-App steht die Temperatur ${fmtUnit(theta, "°C", 0)}. Wie viel Grad Fahrenheit sind das?`,
            given: [`θ = ${fmtUnit(theta, "°C", 0)}`],
            formulaHint: "θ_F = 1,8 · θ + 32",
            answer: 1.8 * theta + 32,
            unit: "°F",
            digits: 1,
            solutionHtml: `θ<sub>F</sub> = 1,8 · ${fmt(theta, 0)} + 32 = <strong>${fmtUnit(1.8 * theta + 32, "°F", 1)}</strong>`,
          };
        }
        const F = rng.pick([14, 50, 68, 86, 95, 104, 212]);
        const theta = (F - 32) / 1.8;
        return {
          prompt: `Ein Backrezept aus den USA verlangt ${fmtUnit(F, "°F", 0)}. Wie viel Grad Celsius sind das? Stelle dazu die Umrechnung nach θ um.`,
          given: [`θ_F = ${fmtUnit(F, "°F", 0)}`],
          answer: theta,
          unit: "°C",
          digits: 1,
          solutionHtml: `θ = (θ<sub>F</sub> − 32) / 1,8 = (${fmt(F, 0)} − 32) / 1,8 = <strong>${fmtUnit(theta, "°C", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest zwischen Celsius, Kelvin und Fahrenheit und weißt, was ein Thermometer misst.",
};

// 4.3 Aggregatzustandsänderungen ───────────────────────────────────────────

const aggregat: Lesson = {
  id: "wl-3-aggregatzustaende",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "4.3 Aggregatzustandsänderungen",
  subtitle: "Schmelzen und Sieden: Energie, die nicht wärmer macht",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): mittlere potenzielle Energie der Teilchen, Kohäsionskräfte, Teilchenabstände und Freiheitsgrade bei Aggregatzustandsänderungen",
  whyItMatters:
    "Ein Eiswürfel im Glas hält das Getränk eine Zeit lang bei 0 °C, obwohl Wärme hineinfließt. Das Teilchenmodell erklärt, wohin diese Energie geht.",
  explanationHtml: `
    <p>Beim <strong>Schmelzen</strong> (fest → flüssig) und <strong>Verdampfen</strong> (flüssig → gasförmig) wird Energie zugeführt, beim <strong>Erstarren</strong> und <strong>Kondensieren</strong> frei. Auch <strong>Sublimieren</strong> (fest → gasförmig) gibt es, etwa bei Trockeneis.</p>
    <p><strong>Beobachtung:</strong> Während einer Zustandsänderung bleibt die Temperatur trotz Energiezufuhr <strong>konstant</strong> (Schmelztemperatur, Siedetemperatur). Im Temperatur-Energie-Diagramm erscheint ein Plateau.</p>
    <ul>
      <li><strong>Teilchenmodell:</strong> Die zugeführte Energie erhöht nicht die mittlere kinetische Energie (die Temperatur), sondern die <strong>mittlere potenzielle Energie</strong>: Die Teilchen müssen die <strong>Kohäsionskräfte</strong> (Anziehung zwischen den Teilchen) überwinden und sich weiter voneinander entfernen.</li>
      <li><strong>Freiheitsgrade der Bewegung:</strong> Fest: Teilchen schwingen um feste Plätze. Flüssig: Sie können zusätzlich ihre Plätze tauschen. Gasförmig: Sie fliegen frei durch den Raum.</li>
      <li>Das Verdampfen braucht viel mehr Energie als das Schmelzen: Die Teilchen müssen sich ganz voneinander lösen.</li>
      <li><strong>Verdunsten</strong> geschieht bei jeder Temperatur nur an der Oberfläche, <strong>Sieden</strong> im ganzen Volumen bei der Siedetemperatur.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Auf dem Plateau steigt die potenzielle Energie der Teilchen, nicht die Temperatur.</div>
  `,
  formulas: [
    { name: "Energie bei konstanter Leistung", html: "Q = P · t", quantities: "Q in J, P in W, t in s" },
    { name: "Wichtige Temperaturen von Wasser", html: "Schmelzen 0 °C, Sieden 100 °C", quantities: "bei Normaldruck" },
  ],
  quiz: {
    question: "Während Eis bei 0 °C schmilzt, wird weiter Energie zugeführt. Warum steigt die Temperatur nicht?",
    options: [
      "Die Energie wird gebraucht, um die Bindungen zwischen den Teilchen zu lösen: Die potenzielle Energie steigt",
      "Die Energie geht verloren",
      "Das Thermometer reagiert zu langsam",
    ],
    correctIndex: 0,
    explanation: "Die Kohäsionskräfte zwischen den Teilchen müssen überwunden werden. Die Energie steckt danach als potenzielle Energie im Wasser, nicht in schnellerer Teilchenbewegung.",
  },
  lab: {
    kind: "heating-curve",
    title: "Labor: Erwärmungskurve von Wasser",
    intro: "Führe einem Kilogramm Eis gleichmäßig Energie zu. Der Regler zeigt die zugeführte Energie (100 Einheiten reichen von Eis bei −20 °C bis zu Dampf bei 120 °C).",
    params: [{ type: "range", key: "E", label: "Zugeführte Energie", unit: "Einheiten", min: 0, max: 100, step: 1, value: 0 }],
    readouts: [
      { key: "theta", label: "Temperatur", unit: "°C", digits: 0, emphasis: true, compute: (v) => heatingState(v.E).theta },
      { key: "state", label: "Zustand", emphasis: true, compute: (v) => heatingState(v.E).state },
    ],
    goals: [
      { id: "schmelzen", text: "Stelle einen Punkt ein, an dem Eis schmilzt: Die Temperatur bleibt trotz Energiezufuhr bei 0 °C.", check: (_v, r) => r.state === "Eis schmilzt (Eis und Wasser)" },
      { id: "sieden", text: "Stelle einen Punkt ein, an dem Wasser siedet: 100 °C, Wasser und Dampf gleichzeitig.", check: (_v, r) => r.state === "Wasser siedet (Wasser und Dampf)" },
      { id: "dampf", text: "Erhitze, bis nur noch Wasserdampf übrig ist, und erwärme ihn weiter.", check: (_v, r) => r.state === "Dampf wird erwärmt" },
    ],
  },
  exercises: [
    {
      id: "plateau-energie",
      make: (rng, level) => {
        if (level === 1) {
          const P = rng.pick([500, 800, 1000, 1500]);
          const tMin = rng.pick([2, 3, 5, 8]);
          const Q = (P * tMin * 60) / 1000;
          return {
            prompt: `Eine Heizplatte mit ${fmtUnit(P, "W", 0)} Leistung schmilzt Eis. Das Plateau bei 0 °C dauert ${fmtUnit(tMin, "min", 0)}. Wie viel Energie wurde in dieser Zeit zugeführt (in Kilojoule)?`,
            given: [`P = ${fmtUnit(P, "W", 0)}`, `t = ${fmtUnit(tMin, "min", 0)} = ${fmtUnit(tMin * 60, "s", 0)}`],
            formulaHint: "Q = P · t",
            answer: Q,
            unit: "kJ",
            digits: 1,
            solutionHtml: `Q = P · t = ${fmt(P, 0)} W · ${fmt(tMin * 60, 0)} s = ${fmt(P * tMin * 60, 0)} J = <strong>${fmtUnit(Q, "kJ", 1)}</strong>`,
          };
        }
        const P = rng.pick([800, 1000, 1500]);
        const t = 334_000 / P / 60;
        return {
          prompt: `Zum Schmelzen von 1 kg Eis bei 0 °C braucht man 334 kJ. Wie viele Minuten dauert das mit einem Tauchsieder von ${fmtUnit(P, "W", 0)} (alle Energie kommt im Eis an)?`,
          given: [`Q = 334 kJ = 334 000 J`, `P = ${fmtUnit(P, "W", 0)}`],
          answer: t,
          unit: "min",
          digits: 1,
          solutionHtml: `t = Q / P = 334 000 J / ${fmt(P, 0)} W = ${fmt(334_000 / P, 0)} s = <strong>${fmtUnit(t, "min", 1)}</strong>`,
        };
      },
    },
    {
      id: "sieden-dauer",
      make: (rng, level) => {
        const Q = 2_257_000;
        const P = rng.pick([1000, 1500, 2000, 2500]);
        if (level === 1) {
          const t = Q / P;
          return {
            prompt: `Ein Wasserkocher mit ${fmtUnit(P, "W", 0)} verdampft 1 kg siedendes Wasser. Dazu braucht man 2257 kJ. Wie viele Sekunden dauert das?`,
            given: [`Q = 2257 kJ = ${fmtUnit(Q, "J", 0)}`, `P = ${fmtUnit(P, "W", 0)}`],
            formulaHint: "t = Q / P",
            answer: t,
            unit: "s",
            digits: 0,
            solutionHtml: `t = Q / P = ${fmt(Q, 0)} J / ${fmt(P, 0)} W = <strong>${fmtUnit(t, "s", 0)}</strong>`,
          };
        }
        const m = rng.pick([0.25, 0.5, 0.75]);
        const t = (Q * m) / P / 60;
        return {
          prompt: `Auf einer Herdplatte (${fmtUnit(P, "W", 0)}) kocht Wasser bereits. Zum Verdampfen von 1 kg braucht man 2257 kJ. Wie viele Minuten dauert es, ${fmtUnit(m, "kg", 2)} Wasser ganz zu verdampfen? Erkläre im Kopf, warum dabei die Temperatur gleich bleibt.`,
          given: [`m = ${fmtUnit(m, "kg", 2)}`, `P = ${fmtUnit(P, "W", 0)}`],
          answer: t,
          unit: "min",
          digits: 1,
          solutionHtml: `Q = 2257 kJ · ${fmt(m, 2)} = ${fmt(Q * m / 1000, 0)} kJ<br>t = Q / P = ${fmt(Q * m, 0)} J / ${fmt(P, 0)} W = ${fmt((Q * m) / P, 0)} s = <strong>${fmtUnit(t, "min", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst das Temperaturplateau mit der potenziellen Energie der Teilchen.",
};

// 4.4 Ausdehnung ───────────────────────────────────────────────────────────

const ausdehnung: Lesson = {
  id: "wl-4-ausdehnung",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "4.4 Ausdehnung bei Erwärmung",
  subtitle: "Längen und Volumen ändern sich mit der inneren Energie",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): materialspezifische Längen- und Volumenänderung von Körpern bei Änderung der inneren Energie (halbquantitativ)",
  whyItMatters:
    "Brücken haben Dehnungsfugen, Freileitungen hängen im Sommer durch, und in Thermostaten biegt sich ein Metallstreifen. Alles Folgen von kleinen Längenänderungen.",
  explanationHtml: `
    <p>Bei Erwärmung dehnen sich fast alle Körper aus. <strong>Teilchenmodell:</strong> Die Teilchen schwingen stärker und stoßen sich weiter voneinander ab, der mittlere Abstand wächst.</p>
    <ul>
      <li><strong>Feste Körper:</strong> Die Längenänderung ΔL ist <strong>proportional zur Anfangslänge L<sub>0</sub></strong> und <strong>proportional zur Temperaturänderung ΔT</strong>: Doppelt so lange Stange, doppelt so viel Dehnung. Doppelt so viel Erwärmung, doppelt so viel Dehnung.</li>
      <li>Der Stoff entscheidet: Aluminium dehnt sich mehr als doppelt so stark aus wie Glas, Eisen liegt dazwischen. (Zusatz: ΔL = α · L<sub>0</sub> · ΔT mit Stahl α = 12 · 10<sup>−6</sup> 1/K, Aluminium 23 · 10<sup>−6</sup> 1/K, Kupfer 17 · 10<sup>−6</sup> 1/K, Glas 9 · 10<sup>−6</sup> 1/K.)</li>
      <li><strong>Flüssigkeiten</strong> dehnen sich bei gleichem Volumen stärker aus als Feststoffe (Flüssigkeitsthermometer, Heizöltank nicht randvoll füllen), <strong>Gase</strong> am stärksten.</li>
      <li><strong>Technik:</strong> Dehnungsfugen an Brücken und Schienen, Spiel in Bauteilen, <strong>Bimetallstreifen</strong> (zwei Metalle, die verschieden stark dehnen, biegen sich bei Wärme: Thermostat, Blinkerrelais).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> ΔL ~ L<sub>0</sub> und ΔL ~ ΔT, und jeder Stoff hat seinen eigenen Faktor.</div>
  `,
  formulas: [
    { name: "Proportionalitäten", html: "ΔL ~ L<sub>0</sub>, ΔL ~ ΔT", quantities: "für feste Körper bei gleichem Stoff" },
    { name: "Längenänderung (Zusatz)", html: "ΔL = α · L<sub>0</sub> · ΔT", quantities: "α Längenausdehnungskoeffizient in 1/K, z. B. Stahl 12 · 10⁻⁶ 1/K" },
  ],
  quiz: {
    question: "Eine Stahlbrücke ist 100 m lang und im Sommer deutlich wärmer als im Winter. Was folgt daraus?",
    options: [
      "Metall dehnt sich bei Wärme nicht merklich aus",
      "Die Brücke schrumpft im Sommer und braucht deshalb Fugen",
      "Die Brücke dehnt sich im Sommer aus und braucht deshalb Dehnungsfugen",
    ],
    correctIndex: 2,
    explanation: "Bei einer Erwärmung um 50 K wächst eine 100 m lange Stahlbrücke um etwa 6 cm. Ohne Fugen würde sie sich verspannen.",
  },
  lab: {
    kind: "expansion",
    title: "Labor: Stab erwärmen",
    intro: "Erwärme einen Stab. Die Verlängerung ist im Bild stark übertrieben. Wähle Stoff, Anfangslänge und Temperaturänderung.",
    params: [
      {
        type: "choice",
        key: "alpha",
        label: "Stoff (α in 10⁻⁶ 1/K)",
        options: [
          { value: 9, label: "Glas, 9" },
          { value: 12, label: "Stahl, 12" },
          { value: 17, label: "Kupfer, 17" },
          { value: 23, label: "Aluminium, 23" },
        ],
        value: 17,
      },
      { type: "range", key: "L0", label: "Anfangslänge L₀", unit: "m", min: 1, max: 20, step: 1, value: 10 },
      { type: "range", key: "dT", label: "Temperaturänderung ΔT", unit: "K", min: 10, max: 100, step: 10, value: 50 },
    ],
    readouts: [
      { key: "dL", label: "Längenänderung ΔL", unit: "mm", digits: 2, emphasis: true, compute: (v) => v.alpha * v.L0 * v.dT * 1e-3 },
    ],
    goals: [
      { id: "alu-zehn", text: "Erwärme einen Aluminiumstab so, dass er sich um mindestens 10 mm verlängert.", check: (v, r) => v.alpha === 23 && Number(r.dL) >= 10 },
      { id: "stahl-sechs", text: "Eine 10 m lange Stahlstange wird um 50 K wärmer: Sie dehnt sich um 6 mm.", check: (v, r) => v.alpha === 12 && near(Number(r.dL), 6, 0.01) },
      { id: "kupfer-doppelt", text: "Verdopple bei der 10 m langen Kupferstange die Erwärmung von 50 K auf 100 K: Die Dehnung verdoppelt sich auf 17 mm.", check: (v) => v.alpha === 17 && v.L0 === 10 && v.dT === 100 },
    ],
  },
  exercises: [
    {
      id: "ausdehnung-proportional",
      make: (rng, level) => {
        if (level === 1) {
          const L1 = rng.pick([2, 4, 5]);
          const T1 = rng.pick([20, 25, 40, 50]);
          const d1 = rng.pick([0.6, 0.9, 1.2, 2.4]);
          const k = rng.pick([2, 3, 4]);
          const m = rng.pick([2, 3]);
          const L2 = L1 * k;
          const T2 = T1 * m;
          const d2 = d1 * k * m;
          return {
            prompt: `Eine Metallstange von ${fmtUnit(L1, "m", 0)} Länge dehnt sich bei einer Erwärmung um ${fmtUnit(T1, "K", 0)} um ${fmtUnit(d1, "mm", 1)}. Um wie viel dehnt sich eine Stange aus demselben Metall von ${fmtUnit(L2, "m", 0)} bei einer Erwärmung um ${fmtUnit(T2, "K", 0)}?`,
            given: [`Messung: L = ${fmtUnit(L1, "m", 0)}, ΔT = ${fmtUnit(T1, "K", 0)}, ΔL = ${fmtUnit(d1, "mm", 1)}`, `Neu: L = ${fmtUnit(L2, "m", 0)}, ΔT = ${fmtUnit(T2, "K", 0)}`],
            formulaHint: "ΔL ~ L und ΔL ~ ΔT: Faktor Länge mal Faktor Temperatur",
            answer: d2,
            unit: "mm",
            digits: 1,
            solutionHtml: `Länge ×${k}, Erwärmung ×${m}: ΔL = ${fmt(d1, 1)} mm · ${k} · ${m} = <strong>${fmtUnit(d2, "mm", 1)}</strong>`,
          };
        }
        const L = rng.pick([24, 30, 60, 120]);
        const dT = rng.pick([40, 50, 60]);
        const alpha = 12e-6;
        const dL = alpha * L * dT * 1000;
        return {
          prompt: `Eine Eisenbahnschiene aus Stahl (α = 12 · 10⁻⁶ 1/K) ist ${fmtUnit(L, "m", 0)} lang. Im Sommer ist sie ${fmtUnit(dT, "K", 0)} wärmer als im Winter. Wie viele Millimeter muss die Fuge zwischen zwei Schienen mindestens Platz lassen?`,
          given: [`L₀ = ${fmtUnit(L, "m", 0)}`, `ΔT = ${fmtUnit(dT, "K", 0)}`, "α = 12 · 10⁻⁶ 1/K"],
          answer: dL,
          unit: "mm",
          digits: 1,
          solutionHtml: `ΔL = α · L₀ · ΔT = 12 · 10⁻⁶ 1/K · ${fmt(L, 0)} m · ${fmt(dT, 0)} K = ${fmt(alpha * L * dT, 5)} m = <strong>${fmtUnit(dL, "mm", 1)}</strong>`,
        };
      },
    },
    {
      id: "bruecke",
      make: (rng, level) => {
        if (level === 1) {
          const L = rng.pick([50, 100, 150, 200]);
          const dT = rng.pick([50, 60, 80, 100]);
          const dL = (1.2 * L * dT) / 100;
          return {
            prompt: `Stahl dehnt sich um 1,2 mm je Meter Länge und je 100 K Erwärmung. Wie viele Millimeter dehnt sich eine ${fmtUnit(L, "m", 0)} lange Stahlbrücke bei ${fmtUnit(dT, "K", 0)} Erwärmung?`,
            given: ["1,2 mm je m und 100 K", `L = ${fmtUnit(L, "m", 0)}`, `ΔT = ${fmtUnit(dT, "K", 0)}`],
            formulaHint: "ΔL = 1,2 mm · (L / 1 m) · (ΔT / 100 K)",
            answer: dL,
            unit: "mm",
            digits: 1,
            solutionHtml: `ΔL = 1,2 mm · ${fmt(L, 0)} · ${fmt(dT / 100, 2)} = <strong>${fmtUnit(dL, "mm", 1)}</strong>`,
          };
        }
        const L = rng.pick([30, 50, 80]);
        const dT = rng.pick([40, 60, 80]);
        const dL = (2.3 * L * dT) / 100;
        return {
          prompt: `Aluminium dehnt sich etwa um 2,3 mm je Meter Länge und je 100 K Erwärmung. Eine ${fmtUnit(L, "m", 0)} lange Aluminium-Dachleiste wird im Sommer ${fmtUnit(dT, "K", 0)} wärmer. Um wie viele Millimeter wird sie länger?`,
          given: ["2,3 mm je m und 100 K", `L = ${fmtUnit(L, "m", 0)}`, `ΔT = ${fmtUnit(dT, "K", 0)}`],
          answer: dL,
          unit: "mm",
          digits: 1,
          solutionHtml: `ΔL = 2,3 mm · ${fmt(L, 0)} · ${fmt(dT / 100, 2)} = <strong>${fmtUnit(dL, "mm", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du schätzt Längenänderungen mit Proportionalität ab und kennst ihre Folgen für Brücken und Schienen.",
};

// 4.5 Anomalie des Wassers ─────────────────────────────────────────────────

const anomalie: Lesson = {
  id: "wl-5-wasseranomalie",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "4.5 Die Anomalie des Wassers",
  subtitle: "Warum Seen von oben zufrieren und Wasserleitungen platzen",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): Anomalien von Wasser; Temperaturschichtungen von Gewässern, Frostaufbrüche",
  whyItMatters:
    "Fast alle Stoffe werden beim Abkühlen dichter. Wasser macht eine Ausnahme, und deshalb überleben Fische den Winter unter dem Eis.",
  explanationHtml: `
    <p>Die meisten Flüssigkeiten ziehen sich beim Abkühlen zusammen. <strong>Wasser nicht durchgehend:</strong> Die Dichte ist bei etwa <strong>4 °C am größten</strong> (1,000 g/cm³). Kühlt man von 4 °C weiter auf 0 °C, dehnt sich das Wasser wieder etwas aus. Das ist die <strong>Anomalie des Wassers</strong>.</p>
    <ul>
      <li>Beim Gefrieren dehnt sich Wasser um etwa <strong>9 %</strong> aus. Eis hat nur 0,917 g/cm³ und <strong>schwimmt</strong>.</li>
      <li><strong>Frostaufbrüche:</strong> Gefriert Wasser in Rissen, Rohren oder Flaschen, sprengt das Eis sie. Deshalb entleert man Leitungen im Winter.</li>
      <li><strong>Seen im Winter:</strong> Das Wasser von 4 °C ist am dichtesten und sinkt zum Grund. Darüber liegt kälteres, leichteres Wasser, ganz oben das Eis. Am Boden bleiben 4 °C, die Lebewesen überleben.</li>
      <li><strong>Seen im Sommer:</strong> Warmes Wasser ist leichter und bleibt oben, kaltes liegt unten: stabile Schichtung. Im Frühjahr und Herbst gleichen sich die Temperaturen an, der Wind wälzt das Wasser um (Zirkulation).</li>
      <li><strong>Teilchenmodell:</strong> Im Eis sind die Wassermoleküle in einem weiten, offenen Gitter angeordnet. Beim Schmelzen bricht es teilweise zusammen, das Wasser wird dichter.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Wasser ist bei 4 °C am dichtesten. Eis ist leichter als Wasser.</div>
  `,
  formulas: [
    { name: "Dichtemaximum", html: "ρ<sub>max</sub> bei 4 °C", quantities: "etwa 1,000 g/cm³ = 1000 kg/m³" },
    { name: "Eis", html: "ρ<sub>Eis</sub> = 0,917 g/cm³", quantities: "V<sub>Eis</sub> ≈ 1,09 · V<sub>Wasser</sub>" },
  ],
  quiz: {
    question: "Im Winter ist ein See zugefroren. Wie warm ist das Wasser ganz unten?",
    options: [
      "0 °C, weil Eis schwerer ist als Wasser und absinkt",
      "Etwa 4 °C, weil Wasser dort am dichtesten ist und absinkt",
      "Über 10 °C, weil der Seeboden geheizt wird",
    ],
    correctIndex: 1,
    explanation: "Wasser von 4 °C hat die größte Dichte und sammelt sich am Grund. Das kältere, leichtere Wasser und das Eis liegen darüber.",
  },
  lab: {
    kind: "water-anomaly",
    title: "Labor: Dichte von Wasser",
    intro: "Stelle die Temperatur von flüssigem Wasser ein oder wähle Eis bei 0 °C. Beobachte Dichte und Volumen von 1000 g.",
    params: [
      { type: "range", key: "theta", label: "Temperatur des flüssigen Wassers", unit: "°C", min: 0, max: 10, step: 1, value: 8 },
      { type: "choice", key: "phase", label: "Zustand bei 0 °C", options: [{ value: 0, label: "flüssig" }, { value: 1, label: "Eis" }], value: 0 },
    ],
    readouts: [
      { key: "rho", label: "Dichte", unit: "kg/m³", digits: 2, emphasis: true, compute: (v) => (v.phase === 1 ? ICE_DENSITY : waterDensity(v.theta)) },
      { key: "V", label: "Volumen von 1000 g", unit: "cm³", digits: 2, emphasis: true, compute: (v) => (v.phase === 1 ? 1e6 / ICE_DENSITY : 1e6 / waterDensity(v.theta)) },
    ],
    goals: [
      { id: "vier-grad", text: "Finde die Temperatur größter Dichte: 4 °C.", check: (v) => v.phase === 0 && v.theta === 4 },
      { id: "eis", text: "Wähle Eis: 1000 g Eis brauchen etwa 1090 cm³, rund 9 % mehr als Wasser.", check: (v, r) => v.phase === 1 && Number(r.V) > 1080 },
      { id: "null-grad", text: "Kühle flüssiges Wasser auf 0 °C ab: Die Dichte ist kleiner als bei 4 °C.", check: (v, r) => v.phase === 0 && v.theta === 0 && Number(r.rho) < waterDensity(4) },
    ],
  },
  exercises: [
    {
      id: "eisvolumen",
      make: (rng, level) => {
        if (level === 1) {
          const V = rng.pick([200, 250, 500, 750, 1000]);
          const Ve = V * 1.09;
          return {
            prompt: `Wasser dehnt sich beim Gefrieren um etwa 9 % aus. Wie groß ist das Volumen von Eis aus ${fmtUnit(V, "cm³", 0)} Wasser?`,
            given: [`V(Wasser) = ${fmtUnit(V, "cm³", 0)}`, "Zunahme 9 %"],
            formulaHint: "V(Eis) = 1,09 · V(Wasser)",
            answer: Ve,
            unit: "cm³",
            digits: 0,
            solutionHtml: `V(Eis) = ${fmt(V, 0)} cm³ · 1,09 = <strong>${fmtUnit(Ve, "cm³", 0)}</strong>`,
          };
        }
        const Vmax = rng.pick([500, 750, 1000, 1500]);
        const Vw = Vmax / 1.09;
        return {
          prompt: `Eine dicht verschlossene Flasche fasst ${fmtUnit(Vmax, "cm³", 0)}. Wie viel Wasser darf höchstens eingefüllt sein, damit sie beim Gefrieren (Volumenzunahme 9 %) gerade nicht platzt?`,
          given: [`V(Flasche) = ${fmtUnit(Vmax, "cm³", 0)}`, "Zunahme 9 %"],
          answer: Vw,
          unit: "cm³",
          digits: 0,
          solutionHtml: `1,09 · V(Wasser) = ${fmt(Vmax, 0)} cm³ ⇒ V(Wasser) = ${fmt(Vmax, 0)} / 1,09 = <strong>${fmtUnit(Vw, "cm³", 0)}</strong>`,
        };
      },
    },
    {
      id: "eis-dichte",
      make: (rng, level) => {
        if (level === 1) {
          const V = rng.pick([100, 200, 500, 1000]);
          const m = 0.917 * V;
          return {
            prompt: `Ein Eisblock hat das Volumen ${fmtUnit(V, "cm³", 0)}. Eis hat die Dichte 0,917 g/cm³. Welche Masse hat der Block?`,
            given: [`V = ${fmtUnit(V, "cm³", 0)}`, "ρ(Eis) = 0,917 g/cm³"],
            formulaHint: "m = ρ · V",
            answer: m,
            unit: "g",
            digits: 1,
            solutionHtml: `m = ρ · V = 0,917 g/cm³ · ${fmt(V, 0)} cm³ = <strong>${fmtUnit(m, "g", 1)}</strong>`,
          };
        }
        const m = rng.pick([458.5, 917, 1834]);
        const V = m / 0.917;
        return {
          prompt: `${fmtUnit(m, "g", 1)} Wasser gefrieren zu Eis (ρ = 0,917 g/cm³). Welches Volumen hat das Eis?`,
          given: [`m = ${fmtUnit(m, "g", 1)}`, "ρ(Eis) = 0,917 g/cm³"],
          answer: V,
          unit: "cm³",
          digits: 0,
          solutionHtml: `Die Masse bleibt beim Gefrieren gleich. V = m / ρ = ${fmt(m, 1)} g / 0,917 g/cm³ = <strong>${fmtUnit(V, "cm³", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst, warum Seen von oben zufrieren und Leitungen im Frost platzen können.",
};

// 4.6 Wärmeleitung ─────────────────────────────────────────────────────────

const PROBE_AFTER_MINUTES = (lambda: number, minutes: number): number =>
  conductionTemp(diffusivity(lambda), minutes * 60, PROBE_POSITION);

const waermeleitung: Lesson = {
  id: "wl-6-waermeleitung",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "4.6 Wärmeleitung",
  subtitle: "Warum Metall kalt wirkt und Wolle warm hält",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): Energietransport durch Wärmeleitung; Beispiele aus Alltag, Natur und Technik, Energietransport beeinflussen",
  whyItMatters:
    "Der Löffel im heißen Tee wird heiß, der Holzgriff nicht. Ein Daunenmantel wärmt, ein Metallgeländer kühlt die Hand. Wärmeleitung entscheidet, wie schnell Energie von Teilchen zu Teilchen wandert.",
  explanationHtml: `
    <p><strong>Wärmeleitung</strong> ist der Energietransport in einem Körper (oder zwischen Körpern in Berührung) <strong>ohne Materiestransport</strong>: Schnellere Teilchen stoßen ihre langsameren Nachbarn an und geben Bewegungsenergie weiter. Die Energie wandert vom wärmeren zum kälteren Ende.</p>
    <ul>
      <li><strong>Gute Wärmeleiter:</strong> Metalle (Kupfer, Aluminium, Eisen). Zusätzlich zu den Gitterschwingungen transportieren frei bewegliche Elektronen Energie.</li>
      <li><strong>Schlechte Wärmeleiter</strong> (Wärmeisolatoren): Holz, Kunststoff, Glas, Styropor, Wolle und ruhende Luft in Hohlräumen (Daunen, Doppelfenster, Dämmstoffe).</li>
      <li>Ein Metallgeländer fühlt sich im Winter kälter an als Holz, weil Metall die Wärme der Hand schneller abführt, nicht weil es kälter ist.</li>
      <li><strong>Energietransport beeinflussen:</strong> Leitung fördern (Kochtopf aus Metall, Kühlrippen) oder hemmen (Griff aus Kunststoff, Hausdämmung, Daunenjacke). Dickere Dämmung hemmt stärker.</li>
    </ul>
    <p><strong>Recherche-Auftrag:</strong> Suche zwei Beispiele aus Alltag oder Technik, in denen Wärmeleitung gefördert wird, und zwei, in denen sie gehemmt wird. Stelle sie mit Fachbegriffen vor.</p>
    <div class="merke"><strong>Merke:</strong> Wärmeleitung: Energie wandert durch Stöße von Teilchen zu Teilchen, der Stoff bleibt an seinem Platz.</div>
  `,
  formulas: [
    { name: "Energie bei konstanter Leistung", html: "Q = P · t", quantities: "z. B. 2 kW · 3 h = 6 kWh" },
    { name: "Dämmung (qualitativ)", html: "Wärmestrom ~ 1 / Dicke der Dämmschicht", quantities: "doppelte Dicke, halber Wärmestrom" },
  ],
  quiz: {
    question: "Warum fühlt sich ein Metallgeländer im Winter kälter an als ein Holzgeländer, obwohl beide gleich warm sind?",
    options: [
      "Das Metall hat eine niedrigere Temperatur als das Holz",
      "Holz gibt zusätzlich Wärme an die Hand ab",
      "Metall leitet die Wärme der Hand schneller ab",
    ],
    correctIndex: 2,
    explanation: "Beide haben dieselbe Temperatur. Metall leitet Energie von der Hand viel schneller weg, deshalb empfindet man es als kälter.",
  },
  lab: {
    kind: "conduction",
    title: "Labor: Stäbe aus verschiedenen Stoffen",
    intro: "Ein Ende eines 50 cm langen Stabes wird auf 100 °C gehalten. Lies die Temperatur an einer Messstelle in 30 cm Abstand zum heißen Ende ab.",
    params: [
      {
        type: "choice",
        key: "lambda",
        label: "Stoff (Wärmeleitfähigkeit in W/(m·K))",
        options: [
          { value: 400, label: "Kupfer, 400" },
          { value: 235, label: "Aluminium, 235" },
          { value: 80, label: "Eisen, 80" },
          { value: 1, label: "Glas, 1" },
          { value: 0.15, label: "Holz, 0,15" },
        ],
        value: 80,
      },
      { type: "range", key: "t", label: "Zeit seit Beginn des Heizens", unit: "min", min: 1, max: 20, step: 1, value: 5 },
    ],
    readouts: [
      { key: "probe", label: "Temperatur an der Messstelle (30 cm)", unit: "°C", digits: 1, emphasis: true, compute: (v) => PROBE_AFTER_MINUTES(v.lambda, v.t) },
    ],
    goals: [
      { id: "kupfer", text: "Kupfer: Nach 10 min zeigt die Messstelle mindestens 50 °C.", check: (v, r) => v.lambda === 400 && v.t === 10 && Number(r.probe) >= 50 },
      { id: "holz", text: "Holz: Auch nach 20 min bleibt die Messstelle unter 21 °C.", check: (v, r) => v.lambda === 0.15 && v.t === 20 && Number(r.probe) < 21 },
      { id: "eisen", text: "Eisen leitet langsamer als Kupfer: Nach 10 min bleibt die Messstelle unter 30 °C.", check: (v, r) => v.lambda === 80 && v.t === 10 && Number(r.probe) < 30 },
    ],
  },
  exercises: [
    {
      id: "daemmung",
      make: (rng, level) => {
        if (level === 1) {
          const d1 = rng.pick([5, 8, 10]);
          const k = rng.pick([2, 3, 4]);
          const P1 = rng.pick([60, 80, 120]);
          const P2 = P1 / k;
          return {
            prompt: `Durch eine Wand mit ${fmtUnit(d1, "cm", 0)} Dämmung gehen ${fmtUnit(P1, "W", 0)} Wärme verloren. Wie viel Wärme geht bei ${k}-facher Dämmdicke (${fmtUnit(d1 * k, "cm", 0)}) verloren? Der Wärmestrom ist umgekehrt proportional zur Dicke.`,
            given: [`${fmtUnit(d1, "cm", 0)} Dämmung: ${fmtUnit(P1, "W", 0)}`, `neu: ${fmtUnit(d1 * k, "cm", 0)}`],
            formulaHint: "P₂ = P₁ · d₁ / d₂",
            answer: P2,
            unit: "W",
            digits: 1,
            solutionHtml: `P₂ = P₁ · d₁ / d₂ = ${fmt(P1, 0)} W · ${fmt(d1, 0)} / ${fmt(d1 * k, 0)} = <strong>${fmtUnit(P2, "W", 1)}</strong>`,
          };
        }
        const d1 = rng.pick([6, 8, 10]);
        const d2 = rng.pick([16, 20, 24]);
        const P1 = rng.pick([100, 120, 150]);
        const P2 = (P1 * d1) / d2;
        return {
          prompt: `Ein Hausbesitzer ersetzt eine ${fmtUnit(d1, "cm", 0)} dicke Dämmung (Wärmeverlust ${fmtUnit(P1, "W", 0)}) durch eine ${fmtUnit(d2, "cm", 0)} dicke aus demselben Stoff. Wie groß ist der neue Wärmeverlust?`,
          given: [`${fmtUnit(d1, "cm", 0)}: ${fmtUnit(P1, "W", 0)}`, `neu: ${fmtUnit(d2, "cm", 0)}`],
          answer: P2,
          unit: "W",
          digits: 1,
          solutionHtml: `P₂ = P₁ · d₁ / d₂ = ${fmt(P1, 0)} W · ${fmt(d1, 0)} / ${fmt(d2, 0)} = <strong>${fmtUnit(P2, "W", 1)}</strong> (das sind ${fmt((P2 / P1) * 100, 0)} % des alten Wertes)`,
        };
      },
    },
    {
      id: "verlustenergie",
      make: (rng, level) => {
        if (level === 1) {
          const P = rng.pick([500, 1000, 2000, 3000]);
          const t = rng.pick([2, 3, 4, 8]);
          const E = (P * t) / 1000;
          return {
            prompt: `Ein Haus verliert durch seine Wände ${fmtUnit(P, "W", 0)} Wärme. Wie viele Kilowattstunden (kWh) sind das in ${fmtUnit(t, "h", 0)}?`,
            given: [`P = ${fmtUnit(P, "W", 0)} = ${fmtUnit(P / 1000, "kW", 1)}`, `t = ${fmtUnit(t, "h", 0)}`],
            formulaHint: "E = P · t (kW · h gibt kWh)",
            answer: E,
            unit: "kWh",
            digits: 1,
            solutionHtml: `E = P · t = ${fmt(P / 1000, 1)} kW · ${fmt(t, 0)} h = <strong>${fmtUnit(E, "kWh", 1)}</strong>`,
          };
        }
        const P = rng.pick([2, 3, 4, 5]);
        const t = rng.pick([8, 12, 24]);
        const E = P * t;
        return {
          prompt: `Eine Heizung muss an einem Wintertag den Wärmeverlust von ${fmtUnit(P, "kW", 0)} ausgleichen, ${fmtUnit(t, "h", 0)} lang. Wie viele Kilowattstunden Energie liefert sie, und wie viele Megajoule sind das? Gib die Kilowattstunden an.`,
          given: [`P = ${fmtUnit(P, "kW", 0)}`, `t = ${fmtUnit(t, "h", 0)}`],
          answer: E,
          unit: "kWh",
          digits: 0,
          solutionHtml: `E = P · t = ${fmt(P, 0)} kW · ${fmt(t, 0)} h = <strong>${fmtUnit(E, "kWh", 0)}</strong> = ${fmt(E * 3.6, 1)} MJ (1 kWh = 3,6 MJ)`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst Wärmeleitung mit Teilchenstößen und weißt, wie man sie fördert oder hemmt.",
};

// 4.7 Konvektion und Wärmestrahlung ────────────────────────────────────────

const konvektionStrahlung: Lesson = {
  id: "wl-7-konvektion-strahlung",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "4.7 Konvektion und Wärmestrahlung",
  subtitle: "Strömende Wärme, Strahlung durch das Vakuum und die Thermoskanne",
  tracks: ["I"],
  lehrplan: "Ph8 LB 2 (I): Energietransport durch Konvektion und Wärmestrahlung; Energietransport beeinflussen",
  whyItMatters:
    "Eine Heizung wärmt den ganzen Raum, obwohl sie nur an einer Stelle steht. Die Sonne wärmt uns durch das Weltall. Und eine Thermoskanne hält den Tee stundenlang heiß, weil sie alle drei Wege des Energietransports bremst.",
  explanationHtml: `
    <p><strong>Konvektion</strong> (Strömung) gibt es nur in <strong>Flüssigkeiten und Gasen</strong>: Eine erwärmte Portion dehnt sich aus, ihre Dichte sinkt, sie steigt auf. Kältere, dichtere Portionen sinken ab. So entsteht ein Kreislauf, der Energie <strong>mit dem Stoff</strong> transportiert (Heizkörper im Raum, Meeresströmung, Thermik, Land- und Seewind).</p>
    <p><strong>Wärmestrahlung</strong> ist Energietransport durch <strong>Strahlung</strong> (vor allem Infrarot). Sie braucht keinen Stoff und geht auch durch das <strong>Vakuum</strong> (Sonne → Erde).</p>
    <ul>
      <li>Dunkle, raue Flächen <strong>absorbieren</strong> Strahlung gut und strahlen auch gut ab (schwarzer Sonnenkollektor). Helle, glatte oder <strong>verspiegelte</strong> Flächen <strong>reflektieren</strong> sie (Rettungsdecke, weiße Hauswand).</li>
      <li><strong>Thermoskanne:</strong> Das <strong>Vakuum</strong> zwischen den Glaswänden unterbindet Leitung und Konvektion, die <strong>Verspiegelung</strong> bremst die Strahlung, der <strong>Stopfen</strong> verhindert Konvektion und Verdunstung an der Öffnung.</li>
      <li>Energietransport beeinflussen: dämmen, verspiegeln, absorbieren lassen oder Luftströmungen unterbinden.</li>
    </ul>
    <p><strong>Recherche-Auftrag:</strong> Suche Beispiele für Leitung, Konvektion und Strahlung in Haus, Natur und Technik und zeige, wie man den Energietransport jeweils verstärkt oder bremst.</p>
    <div class="merke"><strong>Merke:</strong> Leitung: Stoß von Teilchen zu Teilchen. Konvektion: Stoff strömt. Strahlung: kein Stoff nötig.</div>
  `,
  formulas: [
    { name: "Strahlungsleistung", html: "P = I · A", quantities: "I Strahlungsstärke in W/m², A beschienene Fläche in m² (Sonne etwa 800 bis 1000 W/m²)" },
    { name: "Temperaturverlust", html: "ΔT = Rate · t", quantities: "Rate in K/h (konstant angenommen)" },
  ],
  quiz: {
    question: "Wie gelangt die Wärme der Sonne zur Erde?",
    options: [
      "Durch Wärmestrahlung, die keinen Stoff braucht",
      "Durch Wärmeleitung in der Luft",
      "Durch Konvektion im Weltraum",
    ],
    correctIndex: 0,
    explanation: "Zwischen Sonne und Erde ist fast ein Vakuum. Dort gibt es weder Leitung noch Konvektion, nur Strahlung.",
  },
  lab: {
    kind: "thermos",
    title: "Labor: Thermoskanne",
    intro: "Schalte Vakuum, Verspiegelung und Stopfen einzeln zu und beobachte, welcher Verlustweg schrumpft. Der Tee startet mit 90 °C bei 20 °C Umgebung.",
    params: [
      { type: "choice", key: "vac", label: "Vakuum zwischen den Wänden", options: [{ value: 0, label: "nein" }, { value: 1, label: "ja" }], value: 0 },
      { type: "choice", key: "mirror", label: "Verspiegelte Innenwand", options: [{ value: 0, label: "nein" }, { value: 1, label: "ja" }], value: 0 },
      { type: "choice", key: "lid", label: "Stopfen", options: [{ value: 0, label: "offen" }, { value: 1, label: "verschlossen" }], value: 0 },
    ],
    readouts: [
      { key: "conduction", label: "Verlust durch Leitung", unit: "W", digits: 1, compute: (v) => thermosLosses(v.vac, v.mirror, v.lid).conduction },
      { key: "convection", label: "Verlust durch Konvektion", unit: "W", digits: 1, compute: (v) => thermosLosses(v.vac, v.mirror, v.lid).convection },
      { key: "radiation", label: "Verlust durch Strahlung", unit: "W", digits: 1, compute: (v) => thermosLosses(v.vac, v.mirror, v.lid).radiation },
      { key: "opening", label: "Verlust durch die Öffnung", unit: "W", digits: 1, compute: (v) => thermosLosses(v.vac, v.mirror, v.lid).opening },
      { key: "total", label: "Verlust insgesamt", unit: "W", digits: 1, emphasis: true, compute: (v) => thermosLosses(v.vac, v.mirror, v.lid).total },
      { key: "tea", label: "Teetemperatur nach 8 Stunden", unit: "°C", digits: 0, emphasis: true, compute: (v) => teaTemperature(thermosLosses(v.vac, v.mirror, v.lid).total, 8) },
    ],
    goals: [
      { id: "alles", text: "Schalte alle drei Maßnahmen ein: Der Verlust sinkt unter 2 W.", check: (_v, r) => Number(r.total) < 2 },
      { id: "strahlung-bleibt", text: "Mit Vakuum und Stopfen, aber ohne Verspiegelung ist die Strahlung der größte Verlustweg.", check: (v, r) => v.vac === 1 && v.lid === 1 && v.mirror === 0 && Number(r.radiation) > Number(r.conduction) && Number(r.radiation) > Number(r.convection) },
      { id: "tee-warm", text: "Der Tee soll nach 8 Stunden noch über 80 °C warm sein.", check: (_v, r) => Number(r.tea) > 80 },
    ],
  },
  exercises: [
    {
      id: "kollektor",
      make: (rng, level) => {
        if (level === 1) {
          const I = rng.pick([600, 800, 1000]);
          const A = rng.pick([2, 3, 4, 5]);
          return {
            prompt: `Auf einen Sonnenkollektor von ${fmtUnit(A, "m²", 0)} fällt Sonnenlicht mit ${fmtUnit(I, "W/m²", 0)}. Welche Strahlungsleistung kommt am Kollektor an?`,
            given: [`I = ${fmtUnit(I, "W/m²", 0)}`, `A = ${fmtUnit(A, "m²", 0)}`],
            formulaHint: "P = I · A",
            answer: I * A,
            unit: "W",
            digits: 0,
            solutionHtml: `P = I · A = ${fmt(I, 0)} W/m² · ${fmt(A, 0)} m² = <strong>${fmtUnit(I * A, "W", 0)}</strong>`,
          };
        }
        const I = rng.pick([800, 1000]);
        const A = rng.pick([3, 4, 5]);
        const eta = rng.pick([0.5, 0.6, 0.7]);
        const t = rng.pick([2, 3, 4]);
        const E = (I * A * eta * t) / 1000;
        return {
          prompt: `Ein Kollektor von ${fmtUnit(A, "m²", 0)} wird mit ${fmtUnit(I, "W/m²", 0)} bestrahlt und wandelt ${fmt(eta * 100, 0)} % der Strahlung in nutzbare Wärme um. Wie viele Kilowattstunden Wärme liefert er in ${fmtUnit(t, "h", 0)}?`,
          given: [`I = ${fmtUnit(I, "W/m²", 0)}`, `A = ${fmtUnit(A, "m²", 0)}`, `Wirkungsgrad ${fmt(eta * 100, 0)} %`, `t = ${fmtUnit(t, "h", 0)}`],
          answer: E,
          unit: "kWh",
          digits: 2,
          solutionHtml: `P<sub>Strahlung</sub> = ${fmt(I * A, 0)} W, nutzbar: ${fmt(I * A * eta, 0)} W<br>E = P · t = ${fmt((I * A * eta) / 1000, 2)} kW · ${fmt(t, 0)} h = <strong>${fmtUnit(E, "kWh", 2)}</strong>`,
        };
      },
    },
    {
      id: "tee-abkuehlung",
      make: (rng, level) => {
        if (level === 1) {
          const rate = rng.pick([1, 1.5, 2, 3]);
          const t = rng.pick([4, 6, 8]);
          const end = 90 - rate * t;
          return {
            prompt: `Der Tee in einer Thermoskanne hat am Anfang 90 °C und verliert gleichmäßig ${fmtUnit(rate, "K", 1)} pro Stunde. Wie warm ist er nach ${fmtUnit(t, "h", 0)}?`,
            given: [`Start 90 °C`, `Verlust ${fmtUnit(rate, "K/h", 1)}`, `t = ${fmtUnit(t, "h", 0)}`],
            formulaHint: "θ = 90 °C − Rate · t",
            answer: end,
            unit: "°C",
            digits: 1,
            solutionHtml: `ΔT = ${fmt(rate, 1)} K/h · ${fmt(t, 0)} h = ${fmt(rate * t, 1)} K<br>θ = 90 °C − ${fmt(rate * t, 1)} K = <strong>${fmtUnit(end, "°C", 1)}</strong>`,
          };
        }
        const rA = rng.pick([3, 4, 5]);
        const rB = rng.pick([1, 1.5]);
        const t = rng.pick([6, 8, 10]);
        const diff = (rA - rB) * t;
        return {
          prompt: `Kanne A verliert ${fmtUnit(rA, "K", 1)} pro Stunde, Kanne B (besser verspiegelt) ${fmtUnit(rB, "K", 1)} pro Stunde. Um wie viel Kelvin ist der Tee in B nach ${fmtUnit(t, "h", 0)} wärmer als in A (beide starten mit 90 °C)?`,
          given: [`A: ${fmtUnit(rA, "K/h", 1)}`, `B: ${fmtUnit(rB, "K/h", 1)}`, `t = ${fmtUnit(t, "h", 0)}`],
          answer: diff,
          unit: "K",
          digits: 1,
          solutionHtml: `Unterschied der Raten: ${fmt(rA, 1)} − ${fmt(rB, 1)} = ${fmt(rA - rB, 1)} K/h<br>Nach ${fmt(t, 0)} h: ${fmt(rA - rB, 1)} K/h · ${fmt(t, 0)} h = <strong>${fmtUnit(diff, "K", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Leitung, Konvektion und Strahlung und erklärst, wie eine Thermoskanne alle drei bremst.",
};

export const STAGE_WAERME: Stage = {
  id: STAGE_ID,
  stageNumber: 4,
  title: "Wärmelehre",
  subtitle: "Innere Energie, Temperatur, Zustandsänderungen und Wärmetransport",
  icon: "🌡️",
  accent: "#dc2626",
  badgeTitle: "Wärme-Detektiv",
  lehrplanLabel: "Ph8 LB 2 (I)",
  lessons: [innereEnergie, temperatur, aggregat, ausdehnung, anomalie, waermeleitung, konvektionStrahlung],
};
