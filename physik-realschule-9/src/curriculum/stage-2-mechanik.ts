import { fmt, fmtUnit } from "../exercises/format";
import { G } from "../lab/engine";
import type { Lesson, Stage } from "../model/types";
import { near, within } from "./helpers";

const STAGE_ID = "stage-2-mechanik-energie";

// 2.1 Kraftwandler ─────────────────────────────────────────────────────────

const kraftwandler: Lesson = {
  id: "me-1-kraftwandler",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Kraftwandler: schiefe Ebene, Hebel, Flaschenzug",
  subtitle: "Weniger Kraft, aber mehr Weg: die goldene Regel der Mechanik",
  tracks: ["II_III"],
  lehrplan: "Ph9 LB 1 (II/III): unterschiedliche Kraftwandler: schiefe Ebene und Flaschenzug oder Hebel",
  whyItMatters:
    "Eine Rampe, ein Brecheisen oder ein Flaschenzug lassen dich schwere Lasten bewegen, die du sonst nicht heben könntest. Keiner dieser Helfer schenkt dir Arbeit.",
  explanationHtml: `
    <p>Ein <strong>Kraftwandler</strong> ändert Betrag oder Richtung einer Kraft. Dabei gilt immer die <strong>goldene Regel der Mechanik</strong>: Was man an Kraft spart, muss man an Weg zusetzen. Die Arbeit F · s bleibt gleich.</p>
    <ul>
      <li><strong>Schiefe Ebene</strong> (ohne Reibung): Statt F<sub>G</sub> senkrecht über h reicht die kleinere Kraft F entlang der Länge l: <strong>F · l = F<sub>G</sub> · h</strong>, also F = F<sub>G</sub> · h / l.</li>
      <li><strong>Hebel:</strong> Im Gleichgewicht gilt das Hebelgesetz <strong>F<sub>1</sub> · a<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub></strong>: Kraft mal Hebelarm ist auf beiden Seiten gleich.</li>
      <li><strong>Flaschenzug:</strong> Tragen n Seilstücke die Last, braucht man nur F<sub>G</sub> / n, muss aber n-mal so viel Seil ziehen.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Kraftwandler verkleinern die Kraft, nie die Arbeit. Reibung macht die nötige Arbeit sogar größer.</div>
  `,
  formulas: [
    { name: "Schiefe Ebene", html: "F · l = F<sub>G</sub> · h", quantities: "F Kraft längs der Ebene in N, l Länge, h Höhe in m" },
    { name: "Hebelgesetz", html: "F<sub>1</sub> · a<sub>1</sub> = F<sub>2</sub> · a<sub>2</sub>", quantities: "F in N, Hebelarme a in m oder cm" },
    { name: "Flaschenzug (Kraft)", html: "F = F<sub>G</sub> / n", quantities: "n tragende Seilstücke" },
    { name: "Flaschenzug (Weg)", html: "s = n · h", quantities: "Seilweg s, Hubhöhe h" },
  ],
  quiz: {
    question: "Du schiebst eine Kiste über eine doppelt so lange Rampe auf dieselbe Höhe. Was ändert sich ohne Reibung?",
    options: [
      "Du brauchst nur die halbe Kraft und verrichtest die halbe Arbeit",
      "Du brauchst nur die halbe Kraft, die Arbeit bleibt gleich",
      "Kraft und Arbeit bleiben gleich",
    ],
    correctIndex: 1,
    explanation: "F = F_G · h / l halbiert sich, aber der Weg verdoppelt sich: W = F · l bleibt m · g · h.",
  },
  lab: {
    kind: "inclined-plane",
    title: "Labor: Kiste auf der Rampe",
    intro: "Ändere Höhe, Länge und Masse. Lies die nötige Kraft entlang der Rampe ab und vergleiche sie mit der Gewichtskraft.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 1, max: 200, step: 1, value: 100 },
      { type: "range", key: "h", label: "Höhe h", unit: "m", min: 0.5, max: 5, step: 0.1, value: 2, digits: 1 },
      { type: "range", key: "l", label: "Länge l", unit: "m", min: 5, max: 20, step: 0.5, value: 10, digits: 1 },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft F_G = m · g", unit: "N", digits: 0, compute: (v) => v.m * G },
      { key: "F", label: "Kraft entlang der Rampe F = F_G · h / l", unit: "N", digits: 0, emphasis: true, compute: (v) => (v.m * G * v.h) / v.l },
      { key: "W", label: "Arbeit W = F · l", unit: "J", digits: 0, compute: (v) => v.m * G * v.h },
      { key: "factor", label: "Kraftersparnis l / h", digits: 1, compute: (v) => v.l / v.h },
    ],
    goals: [
      { id: "dreihundert", text: "Schiebe 100 kg mit höchstens 300 N auf 3 m Höhe.", check: (v, r) => v.m === 100 && v.h === 3 && Number(r.F) <= 300 },
      { id: "vierfach", text: "Mache die Rampe genau viermal so lang wie hoch (l / h = 4).", check: (_v, r) => near(Number(r.factor), 4, 0.011) },
      { id: "arbeit", text: "Zeige: Die Arbeit bleibt bei 2 m Höhe und 100 kg gleich 1 962 J, egal wie lang die Rampe ist. Stelle l = 20 m ein.", check: (v) => v.m === 100 && v.h === 2 && v.l === 20 },
    ],
  },
  exercises: [
    {
      id: "schiefe-ebene",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 30) * 10;
          const h = rng.stepped(1, 4, 0.5);
          const l = h * rng.pick([2, 3, 4, 5, 6]);
          const F = (m * G * h) / l;
          return {
            prompt: `Eine Kiste mit ${fmtUnit(m, "kg", 0)} wird über eine ${fmtUnit(l, "m", 1)} lange Rampe auf ${fmtUnit(h, "m", 1)} Höhe geschoben. Welche Kraft ist ohne Reibung nötig? (g = 9,81 N/kg)`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `l = ${fmtUnit(l, "m", 1)}`],
            formulaHint: "F · l = F_G · h, also F = m · g · h / l",
            answer: F,
            unit: "N",
            digits: 0,
            solutionHtml: `F_G = m · g = ${fmtUnit(m * G, "N", 1)}<br>F = F_G · h / l = ${fmt(m * G, 1)} N · ${fmt(h, 1)} / ${fmt(l, 1)} = <strong>${fmtUnit(F, "N", 0)}</strong>`,
          };
        }
        const m = rng.int(8, 15) * 10;
        const h = rng.stepped(0.4, 1.2, 0.1);
        const F = rng.pick([100, 120, 150, 200]);
        const l = (m * G * h) / F;
        return {
          prompt: `Eine Rollstuhlrampe soll einen Höhenunterschied von ${fmtUnit(h, "m", 1)} überwinden. Rollstuhl und Person wiegen zusammen ${fmtUnit(m, "kg", 0)}. Eine Hilfsperson kann höchstens ${fmtUnit(F, "N", 0)} schieben. Wie lang muss die Rampe mindestens sein (ohne Reibung, g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`, `F = ${fmtUnit(F, "N", 0)}`],
          answer: l,
          unit: "m",
          digits: 2,
          solutionHtml: `F · l = m · g · h ⇒ l = m · g · h / F = ${fmt(m, 0)} · 9,81 · ${fmt(h, 1)} / ${fmt(F, 0)} m = <strong>${fmtUnit(l, "m", 2)}</strong>`,
        };
      },
    },
    {
      id: "hebel",
      make: (rng, level) => {
        if (level === 1) {
          const F1 = rng.int(2, 20) * 10;
          const a1 = rng.pick([20, 30, 40, 50, 60, 80]);
          const a2 = rng.pick([5, 10, 15, 20]);
          const F2 = (F1 * a1) / a2;
          return {
            prompt: `An einem Hebel wirkt die Kraft F₁ = ${fmtUnit(F1, "N", 0)} im Abstand a₁ = ${fmtUnit(a1, "cm", 0)} vom Drehpunkt. Welche Kraft F₂ hält im Abstand a₂ = ${fmtUnit(a2, "cm", 0)} das Gleichgewicht?`,
            given: [`F₁ = ${fmtUnit(F1, "N", 0)}`, `a₁ = ${fmtUnit(a1, "cm", 0)}`, `a₂ = ${fmtUnit(a2, "cm", 0)}`],
            formulaHint: "F₁ · a₁ = F₂ · a₂, also F₂ = F₁ · a₁ / a₂",
            answer: F2,
            unit: "N",
            digits: 0,
            solutionHtml: `F₂ = F₁ · a₁ / a₂ = ${fmt(F1, 0)} N · ${fmt(a1, 0)} / ${fmt(a2, 0)} = <strong>${fmtUnit(F2, "N", 0)}</strong>`,
          };
        }
        const m = rng.int(4, 12) * 10;
        const a2 = rng.pick([0.3, 0.4, 0.5]);
        const a1 = rng.pick([1.2, 1.4, 1.5, 1.6]);
        const F1 = (m * G * a2) / a1;
        return {
          prompt: `Eine Schubkarre ist ein Hebel: Die Last (${fmtUnit(m, "kg", 0)}) liegt ${fmtUnit(a2, "m", 1)} von der Radachse entfernt, die Griffe sind ${fmtUnit(a1, "m", 1)} von der Achse entfernt. Mit welcher Kraft musst du die Griffe anheben (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `a₂ = ${fmtUnit(a2, "m", 1)}`, `a₁ = ${fmtUnit(a1, "m", 1)}`],
          answer: F1,
          unit: "N",
          digits: 0,
          solutionHtml: `F₂ = m · g = ${fmtUnit(m * G, "N", 1)}<br>F₁ = F₂ · a₂ / a₁ = ${fmt(m * G, 1)} N · ${fmt(a2, 1)} / ${fmt(a1, 1)} = <strong>${fmtUnit(F1, "N", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kennst die goldene Regel: Kraft sparen heißt Weg zusetzen.",
};

// 2.2 Arbeit und Leistung ──────────────────────────────────────────────────

const arbeitLeistung: Lesson = {
  id: "me-2-arbeit-leistung",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Arbeit und Leistung",
  subtitle: "Was Physik unter Arbeit versteht und warum die Zeit zählt",
  tracks: ["II_III"],
  lehrplan: "Ph9 LB 1 (II/III): Arbeit und Leistung als abgeleitete Größen",
  whyItMatters:
    "Im Alltag ist Arbeit alles, was anstrengt. In der Physik wird nur dann Arbeit verrichtet, wenn eine Kraft etwas längs eines Weges bewegt. Und wer dieselbe Arbeit schneller schafft, leistet mehr.",
  explanationHtml: `
    <p><strong>Mechanische Arbeit</strong> wird verrichtet, wenn eine Kraft F einen Körper längs des Weges s bewegt:</p>
    <p class="formula-line">W = F · s</p>
    <ul>
      <li>Einheit: <strong>1 J (Joule) = 1 N · m</strong>. 1 kJ = 1000 J.</li>
      <li><strong>Hubarbeit:</strong> Beim Heben um die Höhe h ist F = F<sub>G</sub> = m · g, also <strong>W = m · g · h</strong>.</li>
      <li>Wer eine Tasche nur hält oder waagrecht trägt, verrichtet im physikalischen Sinn keine Hubarbeit: Kein Weg in Kraftrichtung.</li>
      <li><strong>Leistung</strong> ist Arbeit pro Zeit: <strong>P = W / t</strong>, Einheit <strong>1 W (Watt) = 1 J/s</strong>, 1 kW = 1000 W.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Arbeit ist eine Übertragungsgröße: Sie beschreibt, wie viel Energie übertragen wird. Leistung sagt, wie schnell das geschieht.</div>
  `,
  formulas: [
    { name: "Arbeit", html: "W = F · s", quantities: "W in J (1 J = 1 N·m), F in N, s in m" },
    { name: "Hubarbeit", html: "W = m · g · h", quantities: "m in kg, g = 9,81 N/kg, h in m" },
    { name: "Leistung", html: "P = W / t", quantities: "P in W (1 W = 1 J/s), t in s" },
  ],
  quiz: {
    question: "Zwei Personen tragen gleich schwere Kisten in den dritten Stock. Anna braucht 60 s, Ben 120 s. Was gilt?",
    options: [
      "Anna verrichtet doppelt so viel Arbeit wie Ben",
      "Beide verrichten gleich viel Arbeit, Anna hat die doppelte Leistung",
      "Beide verrichten gleich viel Arbeit und haben die gleiche Leistung",
    ],
    correctIndex: 1,
    explanation: "Die Hubarbeit m · g · h ist gleich. P = W / t ist bei halber Zeit doppelt so groß.",
  },
  lab: {
    kind: "work-power",
    title: "Labor: Treppenhaus",
    intro: "Trage eine Last die Treppe hinauf. Wie viel Arbeit steckt darin, und welche Leistung erreichst du, wenn du schneller bist?",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 1, max: 100, step: 1, value: 20 },
      { type: "range", key: "h", label: "Höhe h", unit: "m", min: 1, max: 30, step: 0.5, value: 6, digits: 1 },
      { type: "range", key: "t", label: "Zeit t", unit: "s", min: 1, max: 120, step: 1, value: 10 },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft F_G", unit: "N", digits: 1, compute: (v) => v.m * G },
      { key: "W", label: "Hubarbeit W = m · g · h", unit: "J", digits: 0, emphasis: true, compute: (v) => v.m * G * v.h },
      { key: "P", label: "Leistung P = W / t", unit: "W", digits: 1, emphasis: true, compute: (v) => (v.m * G * v.h) / v.t },
    ],
    goals: [
      { id: "kilowatt", text: "Erreiche eine Leistung von mindestens 1 kW.", check: (_v, r) => Number(r.P) >= 1000 },
      { id: "zwei-kj", text: "Verrichte 2 kJ Hubarbeit (±5 %).", check: (_v, r) => near(Number(r.W), 2000, 0.05) },
      { id: "hundert-watt", text: "Trage 20 kg so langsam 6 m hoch, dass die Leistung unter 100 W bleibt.", check: (v, r) => v.m === 20 && v.h === 6 && Number(r.P) < 100 },
    ],
  },
  exercises: [
    {
      id: "hubarbeit",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 60);
          const h = rng.stepped(0.5, 12, 0.5);
          const W = m * G * h;
          return {
            prompt: `Eine Kiste mit ${fmtUnit(m, "kg", 0)} wird ${fmtUnit(h, "m", 1)} hoch gehoben. Berechne die Hubarbeit (g = 9,81 N/kg).`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`],
            formulaHint: "W = m · g · h",
            answer: W,
            unit: "J",
            digits: 0,
            solutionHtml: `W = m · g · h = ${fmt(m, 0)} kg · 9,81 N/kg · ${fmt(h, 1)} m = <strong>${fmtUnit(W, "J", 0)}</strong>`,
          };
        }
        const m = rng.int(20, 90) * 10;
        const h = rng.int(6, 25);
        const t = rng.int(20, 90);
        const P = (m * G * h) / t;
        return {
          prompt: `Ein Baukran hebt eine Palette mit ${fmtUnit(m, "kg", 0)} in ${fmtUnit(t, "s", 0)} gleichmäßig um ${fmtUnit(h, "m", 0)} an. Welche Leistung bringt der Kran dabei auf (g = 9,81 N/kg)?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
          answer: P,
          unit: "W",
          digits: 0,
          solutionHtml: `W = m · g · h = ${fmtUnit(m * G * h, "J", 0)}<br>P = W / t = ${fmt(m * G * h, 0)} J / ${fmt(t, 0)} s = <strong>${fmtUnit(P, "W", 0)}</strong>`,
        };
      },
    },
    {
      id: "leistung-zeit",
      make: (rng, level) => {
        if (level === 1) {
          const W = rng.int(2, 40) * 100;
          const t = rng.pick([4, 5, 8, 10, 16, 20, 25, 40]);
          const P = W / t;
          return {
            prompt: `In ${fmtUnit(t, "s", 0)} wird die Arbeit ${fmtUnit(W, "J", 0)} verrichtet. Welche Leistung ist das?`,
            given: [`W = ${fmtUnit(W, "J", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "P = W / t",
            answer: P,
            unit: "W",
            digits: 1,
            solutionHtml: `P = W / t = ${fmt(W, 0)} J / ${fmt(t, 0)} s = <strong>${fmtUnit(P, "W", 1)}</strong>`,
          };
        }
        const P = rng.pick([1.5, 2, 3, 4.5, 6]);
        const W = rng.int(4, 30) * 10;
        const t = (W * 1000) / (P * 1000);
        return {
          prompt: `Ein Motor leistet ${fmtUnit(P, "kW", 1)}. Wie lange braucht er, um ${fmtUnit(W, "kJ", 0)} Arbeit zu verrichten?`,
          given: [`P = ${fmtUnit(P, "kW", 1)} = ${fmtUnit(P * 1000, "W", 0)}`, `W = ${fmtUnit(W, "kJ", 0)} = ${fmtUnit(W * 1000, "J", 0)}`],
          answer: t,
          unit: "s",
          digits: 1,
          solutionHtml: `t = W / P = ${fmt(W * 1000, 0)} J / ${fmt(P * 1000, 0)} W = <strong>${fmtUnit(t, "s", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Arbeit in Joule, Leistung in Watt: Du trennst die beiden sicher.",
};

// 2.3 Energie und Energieerhaltung ────────────────────────────────────────

const energie: Lesson = {
  id: "me-3-energieerhaltung",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Energieformen und Energieerhaltung",
  subtitle: "Lageenergie, Bewegungsenergie und der Trick der Achterbahn",
  tracks: ["II_III"],
  lehrplan: "Ph9 LB 1 (II/III): Energieformen, Energieumwandlungen, Prinzip der Energieerhaltung",
  whyItMatters:
    "Eine Achterbahn braucht nur einen Motor für den ersten Hügel. Danach wandelt sie Lageenergie in Bewegungsenergie und zurück. Energie geht nie verloren, sie wechselt nur die Form.",
  explanationHtml: `
    <p><strong>Energie</strong> ist eine Speichergröße: die Fähigkeit, Arbeit zu verrichten. Arbeit überträgt Energie von einem Körper auf einen anderen.</p>
    <ul>
      <li><strong>Lageenergie (potenzielle Energie):</strong> E<sub>pot</sub> = m · g · h. Sie ist die gespeicherte Hubarbeit.</li>
      <li><strong>Bewegungsenergie (kinetische Energie):</strong> E<sub>kin</sub> = ½ · m · v². Doppelte Geschwindigkeit bedeutet <strong>vierfache</strong> Energie.</li>
      <li>Weitere Formen, hier nur im Überblick: innere Energie (Wärme), elektrische Energie, chemische Energie.</li>
      <li><strong>Energieerhaltung:</strong> In einem abgeschlossenen System bleibt die Gesamtenergie gleich. Ohne Reibung gilt E<sub>pot</sub> + E<sub>kin</sub> = konstant.</li>
      <li>Beim Fall aus der Höhe h wird m · g · h zu ½ · m · v², also <strong>v = √(2 · g · h)</strong>, unabhängig von der Masse.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Energie wird umgewandelt, nicht verbraucht. Was „verloren“ scheint, steckt als innere Energie in Reibung und Wärme.</div>
  `,
  formulas: [
    { name: "Lageenergie", html: "E<sub>pot</sub> = m · g · h", quantities: "E in J, m in kg, g = 9,81 N/kg, h in m" },
    { name: "Bewegungsenergie", html: "E<sub>kin</sub> = ½ · m · v²", quantities: "v in m/s (1 m/s = 3,6 km/h)" },
    { name: "Energieerhaltung", html: "E<sub>pot</sub> + E<sub>kin</sub> = konstant", quantities: "ohne Reibung; v = √(2 · g · h)" },
  ],
  quiz: {
    question: "Ein Auto fährt doppelt so schnell wie vorher. Wie ändert sich seine Bewegungsenergie?",
    options: [
      "Sie verdoppelt sich",
      "Sie vervierfacht sich",
      "Sie bleibt gleich, nur die Masse zählt",
    ],
    correctIndex: 1,
    explanation: "E_kin = ½ · m · v² hängt vom Quadrat der Geschwindigkeit ab: 2² = 4.",
  },
  lab: {
    kind: "energy-ramp",
    title: "Labor: Skater auf der Rampe",
    intro: "Schiebe den Skater die Rampe entlang. Beobachte, wie Lageenergie zu Bewegungsenergie wird und die Summe gleich bleibt.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 10, max: 100, step: 1, value: 60 },
      { type: "range", key: "h0", label: "Starthöhe h₀", unit: "m", min: 1, max: 20, step: 0.5, value: 5, digits: 1 },
      { type: "range", key: "x", label: "Position auf der Rampe", unit: "%", min: 0, max: 100, step: 1, value: 0 },
    ],
    readouts: [
      { key: "h", label: "Aktuelle Höhe h", unit: "m", digits: 2, compute: (v) => v.h0 * (1 - v.x / 100) },
      { key: "Eges", label: "Gesamtenergie E_ges = m · g · h₀", unit: "J", digits: 0, compute: (v) => v.m * G * v.h0 },
      { key: "Epot", label: "Lageenergie E_pot", unit: "J", digits: 0, emphasis: true, compute: (v) => v.m * G * v.h0 * (1 - v.x / 100) },
      { key: "Ekin", label: "Bewegungsenergie E_kin", unit: "J", digits: 0, emphasis: true, compute: (v) => v.m * G * v.h0 * (v.x / 100) },
      { key: "v", label: "Geschwindigkeit v", unit: "m/s", digits: 2, compute: (v) => Math.sqrt(2 * G * v.h0 * (v.x / 100)) },
      { key: "vKmh", label: "Geschwindigkeit in km/h", unit: "km/h", digits: 1, compute: (v) => Math.sqrt(2 * G * v.h0 * (v.x / 100)) * 3.6 },
    ],
    goals: [
      { id: "haelfte", text: "Finde den Punkt, an dem E_pot und E_kin gleich groß sind.", check: (v) => v.x === 50 },
      { id: "schnell", text: "Erreiche unten mindestens 54 km/h (15 m/s).", check: (v, r) => v.x === 100 && Number(r.v) >= 15 },
      { id: "masse", text: "Ändere nur die Masse: Die Geschwindigkeit unten bleibt gleich. Stelle unten 10 kg und h₀ = 5 m ein.", check: (v) => v.x === 100 && v.m === 10 && v.h0 === 5 },
    ],
  },
  exercises: [
    {
      id: "lageenergie",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(1, 80);
          const h = rng.stepped(1, 25, 0.5);
          const E = m * G * h;
          return {
            prompt: `Welche Lageenergie hat ein Körper mit ${fmtUnit(m, "kg", 0)} in ${fmtUnit(h, "m", 1)} Höhe (g = 9,81 N/kg)?`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 1)}`],
            formulaHint: "E_pot = m · g · h",
            answer: E,
            unit: "J",
            digits: 0,
            solutionHtml: `E_pot = m · g · h = ${fmt(m, 0)} · 9,81 · ${fmt(h, 1)} J = <strong>${fmtUnit(E, "J", 0)}</strong>`,
          };
        }
        const h = rng.stepped(2, 45, 0.5);
        const v = Math.sqrt(2 * G * h);
        return {
          prompt: `Ein Wagen der Achterbahn rollt ohne Reibung aus ${fmtUnit(h, "m", 1)} Höhe bis ganz nach unten. Mit welcher Geschwindigkeit (in m/s) kommt er unten an? Die Masse spielt keine Rolle.`,
          given: [`h = ${fmtUnit(h, "m", 1)}`, "g = 9,81 N/kg"],
          answer: v,
          unit: "m/s",
          digits: 1,
          solutionHtml: `m · g · h = ½ · m · v² ⇒ v = √(2 · g · h) = √(2 · 9,81 · ${fmt(h, 1)}) m/s = <strong>${fmtUnit(v, "m/s", 1)}</strong> (≈ ${fmtUnit(v * 3.6, "km/h", 0)})`,
        };
      },
    },
    {
      id: "bewegungsenergie",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(1, 90);
          const v = rng.int(2, 30);
          const E = 0.5 * m * v * v;
          return {
            prompt: `Ein Körper mit ${fmtUnit(m, "kg", 0)} bewegt sich mit ${fmtUnit(v, "m/s", 0)}. Berechne seine Bewegungsenergie.`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, `v = ${fmtUnit(v, "m/s", 0)}`],
            formulaHint: "E_kin = ½ · m · v²",
            answer: E,
            unit: "J",
            digits: 0,
            solutionHtml: `E_kin = ½ · ${fmt(m, 0)} kg · (${fmt(v, 0)} m/s)² = ½ · ${fmt(m, 0)} · ${fmt(v * v, 0)} J = <strong>${fmtUnit(E, "J", 0)}</strong>`,
          };
        }
        const m = rng.int(90, 160) * 10;
        const kmh = rng.pick([30, 50, 70, 90, 100, 120]);
        const v = kmh / 3.6;
        const E = (0.5 * m * v * v) / 1000;
        return {
          prompt: `Ein Auto mit ${fmtUnit(m, "kg", 0)} fährt ${fmtUnit(kmh, "km/h", 0)}. Berechne seine Bewegungsenergie in kJ. Rechne die Geschwindigkeit zuerst in m/s um.`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `v = ${fmtUnit(kmh, "km/h", 0)}`],
          answer: E,
          unit: "kJ",
          digits: 0,
          solutionHtml: `v = ${fmt(kmh, 0)} / 3,6 m/s = ${fmtUnit(v, "m/s", 2)}<br>E_kin = ½ · ${fmt(m, 0)} · ${fmt(v, 2)}² J = ${fmtUnit(E * 1000, "J", 0)} = <strong>${fmtUnit(E, "kJ", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Energie wechselt die Form, aber nie die Menge. Du rechnest sicher mit E_pot und E_kin.",
};

// 2.4 Wirkungsgrad ─────────────────────────────────────────────────────────

const wirkungsgrad: Lesson = {
  id: "me-4-wirkungsgrad",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "2.4 Wirkungsgrad",
  subtitle: "Wie viel von der zugeführten Energie wirklich ankommt",
  tracks: ["II_III"],
  lehrplan: "Ph9 LB 1 (II/III): Wirkungsgrad",
  whyItMatters:
    "Eine Glühlampe macht aus 100 J elektrischer Energie nur 5 J Licht, der Rest wird warm. Der Wirkungsgrad sagt, welchen Anteil der Energie eine Maschine nutzbar macht.",
  explanationHtml: `
    <p>Jede Maschine bekommt Energie zugeführt (E<sub>zu</sub>) und gibt davon einen Teil als gewünschte <strong>Nutzenergie</strong> (E<sub>nutz</sub>) ab. Der Rest wird meist zu innerer Energie: Reibungswärme, Abwärme.</p>
    <p class="formula-line">η = E<sub>nutz</sub> / E<sub>zu</sub> = P<sub>nutz</sub> / P<sub>zu</sub></p>
    <ul>
      <li>η (eta) ist eine Zahl zwischen 0 und 1, oft in Prozent: η = 0,3 heißt 30 %.</li>
      <li>Der Wirkungsgrad ist <strong>immer kleiner als 1</strong>: Keine Maschine gibt mehr Energie ab, als sie bekommt.</li>
      <li>Typische Werte: Glühlampe 5 %, Benzinmotor 25 bis 35 %, LED 30 bis 40 %, Elektromotor 85 bis 95 %.</li>
      <li>Hintereinander geschaltete Maschinen: Die Wirkungsgrade werden <strong>multipliziert</strong>.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Energie wird nicht vernichtet, sondern <strong>entwertet</strong>: Die „verlorene“ Energie ist als Wärme noch da, aber kaum noch nutzbar.</div>
  `,
  formulas: [
    { name: "Wirkungsgrad", html: "η = E<sub>nutz</sub> / E<sub>zu</sub>", quantities: "ohne Einheit, 0 < η < 1 oder in Prozent" },
    { name: "Verlust", html: "E<sub>Verlust</sub> = E<sub>zu</sub> − E<sub>nutz</sub>", quantities: "meist Wärme" },
  ],
  quiz: {
    question: "Ein Elektromotor nimmt 2 000 J elektrische Energie auf und verrichtet 1 700 J Hubarbeit. Wie groß ist sein Wirkungsgrad?",
    options: ["85 %", "15 %", "117 %"],
    correctIndex: 0,
    explanation: "η = 1700 / 2000 = 0,85 = 85 %. Die restlichen 15 % werden zu Wärme.",
  },
  lab: {
    kind: "efficiency",
    title: "Labor: Energiefluss",
    intro: "Wähle ein Gerät und führe ihm Energie zu. Wie viel kommt als Nutzenergie an, wie viel wird zu Wärme?",
    params: [
      {
        type: "choice",
        key: "device",
        label: "Gerät",
        options: [
          { value: 0.05, label: "Glühlampe (η = 5 %)" },
          { value: 0.3, label: "Benzinmotor (η = 30 %)" },
          { value: 0.4, label: "LED-Lampe (η = 40 %)" },
          { value: 0.9, label: "Elektromotor (η = 90 %)" },
        ],
        value: 0.3,
      },
      { type: "range", key: "Ezu", label: "Zugeführte Energie E_zu", unit: "kJ", min: 1, max: 100, step: 1, value: 50 },
    ],
    readouts: [
      { key: "eta", label: "Wirkungsgrad η", digits: 2, compute: (v) => v.device },
      { key: "Enutz", label: "Nutzenergie E_nutz = η · E_zu", unit: "kJ", digits: 1, emphasis: true, compute: (v) => v.device * v.Ezu },
      { key: "Everlust", label: "Verluste (Wärme)", unit: "kJ", digits: 1, compute: (v) => (1 - v.device) * v.Ezu },
    ],
    goals: [
      { id: "achtzig", text: "Finde das Gerät, das von 100 kJ mehr als 80 kJ nutzbar macht.", check: (v, r) => v.Ezu === 100 && Number(r.Enutz) > 80 },
      { id: "waerme", text: "Wähle das Gerät, das 95 % der Energie als Wärme abgibt.", check: (v) => v.device === 0.05 },
      { id: "zwoelf", text: "Stelle den Benzinmotor so ein, dass genau 12 kJ Nutzenergie entstehen.", check: (v, r) => v.device === 0.3 && within(Number(r.Enutz), 12, 0.01) },
    ],
  },
  exercises: [
    {
      id: "wirkungsgrad-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const Ezu = rng.int(2, 50) * 100;
          const eta = rng.pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.6, 0.75, 0.8, 0.9]);
          const Enutz = Ezu * eta;
          return {
            prompt: `Einer Maschine werden ${fmtUnit(Ezu, "J", 0)} zugeführt, sie gibt ${fmtUnit(Enutz, "J", 0)} Nutzenergie ab. Berechne den Wirkungsgrad in Prozent.`,
            given: [`E_zu = ${fmtUnit(Ezu, "J", 0)}`, `E_nutz = ${fmtUnit(Enutz, "J", 0)}`],
            formulaHint: "η = E_nutz / E_zu",
            answer: eta * 100,
            unit: "%",
            digits: 0,
            solutionHtml: `η = E_nutz / E_zu = ${fmt(Enutz, 0)} / ${fmt(Ezu, 0)} = ${fmt(eta, 2)} = <strong>${fmtUnit(eta * 100, "%", 0)}</strong>`,
          };
        }
        const m = rng.int(10, 50) * 10;
        const h = rng.int(4, 20);
        const t = rng.int(10, 40);
        // Draw a realistic motor efficiency and derive the input power from it,
        // rounded to 0,1 kW, so η lands between about 55 % and 92 %.
        const target = rng.pick([0.6, 0.7, 0.75, 0.8, 0.85, 0.9]);
        const Pnutz = (m * G * h) / t;
        const PzuW = Math.ceil(Pnutz / target / 10) * 10;
        const eta = (Pnutz / PzuW) * 100;
        return {
          meta: { eta },
          prompt: `Ein Elektromotor nimmt ${fmtUnit(PzuW / 1000, "kW", 2)} auf. Er hebt ${fmtUnit(m, "kg", 0)} in ${fmtUnit(t, "s", 0)} um ${fmtUnit(h, "m", 0)}. Welchen Wirkungsgrad hat der Motor (g = 9,81 N/kg)? Gib ihn in Prozent an.`,
          given: [`P_zu = ${fmtUnit(PzuW / 1000, "kW", 2)} = ${fmtUnit(PzuW, "W", 0)}`, `m = ${fmtUnit(m, "kg", 0)}`, `h = ${fmtUnit(h, "m", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
          answer: eta,
          unit: "%",
          digits: 1,
          solutionHtml: `W_nutz = m · g · h = ${fmtUnit(m * G * h, "J", 0)}, P_nutz = W / t = ${fmtUnit(Pnutz, "W", 0)}<br>η = P_nutz / P_zu = ${fmt(Pnutz, 0)} / ${fmt(PzuW, 0)} = <strong>${fmtUnit(eta, "%", 1)}</strong>`,
        };
      },
    },
    {
      id: "nutzenergie",
      make: (rng, level) => {
        if (level === 1) {
          const Ezu = rng.int(1, 60) * 10;
          const etaPct = rng.pick([5, 20, 25, 30, 40, 60, 80, 90]);
          const Enutz = (Ezu * etaPct) / 100;
          return {
            prompt: `Ein Gerät mit dem Wirkungsgrad ${fmtUnit(etaPct, "%", 0)} erhält ${fmtUnit(Ezu, "kJ", 0)}. Wie viel Nutzenergie gibt es ab?`,
            given: [`η = ${fmtUnit(etaPct, "%", 0)} = ${fmt(etaPct / 100, 2)}`, `E_zu = ${fmtUnit(Ezu, "kJ", 0)}`],
            formulaHint: "E_nutz = η · E_zu",
            answer: Enutz,
            unit: "kJ",
            digits: 1,
            solutionHtml: `E_nutz = η · E_zu = ${fmt(etaPct / 100, 2)} · ${fmt(Ezu, 0)} kJ = <strong>${fmtUnit(Enutz, "kJ", 1)}</strong>`,
          };
        }
        const Enutz = rng.int(5, 40) * 10;
        const etaPct = rng.pick([20, 25, 40, 50, 80]);
        const Ezu = Enutz / (etaPct / 100);
        return {
          prompt: `Eine Pumpe soll ${fmtUnit(Enutz, "kJ", 0)} Hubarbeit verrichten. Ihr Wirkungsgrad beträgt ${fmtUnit(etaPct, "%", 0)}. Wie viel elektrische Energie muss ihr zugeführt werden?`,
          given: [`E_nutz = ${fmtUnit(Enutz, "kJ", 0)}`, `η = ${fmtUnit(etaPct, "%", 0)}`],
          answer: Ezu,
          unit: "kJ",
          digits: 0,
          solutionHtml: `η = E_nutz / E_zu ⇒ E_zu = E_nutz / η = ${fmt(Enutz, 0)} kJ / ${fmt(etaPct / 100, 2)} = <strong>${fmtUnit(Ezu, "kJ", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du kannst Maschinen beim Wort nehmen: η sagt, was wirklich ankommt.",
};

export const STAGE_MECHANIK: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Mechanik und Energie",
  subtitle: "Kraftwandler, Arbeit, Leistung, Energie und Wirkungsgrad",
  icon: "⚙️",
  accent: "#d97706",
  badgeTitle: "Energie-Buchhalter",
  lehrplanLabel: "Ph9 LB 1 (II/III)",
  lessons: [kraftwandler, arbeitLeistung, energie, wirkungsgrad],
};
